import { LABELS } from "./constants";
import { parseSimpleFrontmatter } from "./duplicates";
import type { GateDecision, GateDecisionEvidence } from "./review";

export type SubmittedSourceUrl = {
  field: string;
  url: string;
};

export type SourceEvidenceItem = SubmittedSourceUrl & {
  status: "passed" | "hard_failure" | "retryable";
  outcome: string;
  httpStatus?: number;
  finalUrl?: string;
  error?: string;
};

export type SourceEvidenceReport = {
  status: "passed" | "failed" | "retryable";
  hash: string;
  urls: SourceEvidenceItem[];
};

const SOURCE_URL_FIELDS = [
  "documentationUrl",
  "docsUrl",
  "downloadUrl",
  "githubUrl",
  "packageUrl",
  "repoUrl",
  "repositoryUrl",
  "sourceUrl",
  "websiteUrl",
] as const;

const SOURCE_URL_LIST_FIELDS = new Set(["sourceUrls"]);
const SOURCE_EVIDENCE_TIMEOUT_MS = 10_000;

function stripYamlComment(value: string) {
  return value.replace(/\s+#.*$/, "").trim();
}

function unquoteYamlValue(value: string) {
  const trimmed = stripYamlComment(value);
  if (
    (trimmed.startsWith('"') && trimmed.endsWith('"')) ||
    (trimmed.startsWith("'") && trimmed.endsWith("'"))
  ) {
    return trimmed.slice(1, -1).trim();
  }
  return trimmed.trim();
}

function frontmatterBlock(source: string) {
  const match = /^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/.exec(
    String(source || ""),
  );
  return match?.[1] || "";
}

function scalarSourceUrlValues(value: string) {
  const trimmed = value.trim();
  if (!trimmed) return [];
  if (trimmed.startsWith("[") && trimmed.endsWith("]")) {
    return trimmed
      .slice(1, -1)
      .split(",")
      .map(unquoteYamlValue)
      .filter(Boolean);
  }
  return [unquoteYamlValue(trimmed)].filter(Boolean);
}

function listSourceUrlValues(source: string) {
  const values: SubmittedSourceUrl[] = [];
  let activeField = "";
  for (const line of frontmatterBlock(source).split(/\r?\n/)) {
    const topLevel = /^([A-Za-z][A-Za-z0-9_]*):\s*(.*?)\s*$/.exec(line);
    if (topLevel) {
      const [, key, value] = topLevel;
      activeField = SOURCE_URL_LIST_FIELDS.has(key) ? key : "";
      if (activeField && value && value !== "|" && value !== ">") {
        for (const url of scalarSourceUrlValues(value)) {
          values.push({ field: activeField, url });
        }
      }
      continue;
    }
    if (!activeField) continue;
    const item = /^\s*-\s*(.*?)\s*$/.exec(line);
    if (!item) continue;
    const url = unquoteYamlValue(item[1] || "");
    if (url) values.push({ field: activeField, url });
  }
  return values;
}

export function extractSubmittedSourceUrls(source: string) {
  const fields = parseSimpleFrontmatter(source);
  const urls: SubmittedSourceUrl[] = [];
  for (const field of SOURCE_URL_FIELDS) {
    for (const url of scalarSourceUrlValues(fields[field] || "")) {
      urls.push({ field, url });
    }
  }
  urls.push(...listSourceUrlValues(source));

  const seen = new Set<string>();
  return urls.filter((item) => {
    const key = `${item.field}\n${item.url}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function sourceStatusFromHttpStatus(status: number) {
  if (status >= 200 && status < 400) return "passed" as const;
  if (status === 408 || status === 429 || status >= 500) {
    return "retryable" as const;
  }
  if (status >= 400 && status < 500) return "hard_failure" as const;
  return "retryable" as const;
}

async function fetchSourceUrl(
  item: SubmittedSourceUrl,
  method: "HEAD" | "GET",
  fetchImpl: typeof fetch,
): Promise<SourceEvidenceItem> {
  const response = await fetchImpl(item.url, {
    method,
    redirect: "follow",
    headers: {
      accept: "text/html,application/json,text/plain,*/*",
      "user-agent": "heyclaude-submission-gate",
    },
    signal: AbortSignal.timeout(SOURCE_EVIDENCE_TIMEOUT_MS),
  });
  const status = sourceStatusFromHttpStatus(response.status);
  return {
    ...item,
    status,
    outcome:
      status === "passed"
        ? "reachable"
        : status === "hard_failure"
          ? "http_hard_failure"
          : "http_retryable",
    httpStatus: response.status,
    finalUrl: response.url || item.url,
  };
}

async function checkOneSourceUrl(
  item: SubmittedSourceUrl,
  fetchImpl: typeof fetch,
): Promise<SourceEvidenceItem> {
  try {
    const parsed = new URL(item.url);
    if (!["http:", "https:"].includes(parsed.protocol)) {
      return {
        ...item,
        status: "hard_failure",
        outcome: "invalid_url",
        error: "Source URL must use http or https.",
      };
    }
  } catch (error) {
    return {
      ...item,
      status: "hard_failure",
      outcome: "invalid_url",
      error: error instanceof Error ? error.message : "Invalid source URL.",
    };
  }

  try {
    const head = await fetchSourceUrl(item, "HEAD", fetchImpl);
    if (head.status === "passed") return head;
  } catch {
    // Some source hosts reject HEAD or transiently fail it. Confirm with GET.
  }

  try {
    return await fetchSourceUrl(item, "GET", fetchImpl);
  } catch (error) {
    return {
      ...item,
      status: "retryable",
      outcome: "fetch_error",
      error:
        error instanceof Error
          ? error.message
          : "Source URL fetch failed before a response was returned.",
    };
  }
}

async function sha256Hex(value: string) {
  const digest = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(value),
  );
  return [...new Uint8Array(digest)]
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

function sourceEvidenceHashInput(urls: SourceEvidenceItem[]) {
  return JSON.stringify(
    urls.map((item) => ({
      field: item.field,
      url: item.url,
      finalUrl: item.finalUrl || "",
      status: item.status,
      outcome: item.outcome,
      httpStatus: item.httpStatus || null,
    })),
  );
}

export async function checkSubmittedSourceEvidence(
  source: string,
  fetchImpl: typeof fetch = fetch,
): Promise<SourceEvidenceReport> {
  const urls = await Promise.all(
    extractSubmittedSourceUrls(source).map((item) =>
      checkOneSourceUrl(item, fetchImpl),
    ),
  );
  const status = urls.some((item) => item.status === "hard_failure")
    ? "failed"
    : urls.some((item) => item.status === "retryable")
      ? "retryable"
      : "passed";
  return {
    status,
    urls,
    hash: await sha256Hex(sourceEvidenceHashInput(urls)),
  };
}

export function sourceEvidenceSummary(report: SourceEvidenceReport) {
  if (!report.urls.length) return "No source URLs were declared.";
  return report.urls
    .map((item) => {
      const status = item.httpStatus ? `HTTP ${item.httpStatus}` : item.outcome;
      return `${item.field} ${item.url} -> ${status}`;
    })
    .join("; ");
}

export function sourceEvidenceToDecisionEvidence(
  report: SourceEvidenceReport,
): GateDecisionEvidence[] {
  return report.urls
    .filter((item) => item.status === "hard_failure")
    .map((item) => ({
      ruleId: "source_url_reachability",
      field: item.field,
      url: item.url,
      matchedUrl: item.url,
      finalUrl: item.finalUrl,
      outcome: item.outcome,
      status: item.status,
      httpStatus: item.httpStatus ? String(item.httpStatus) : undefined,
      behavior: item.httpStatus
        ? `${item.field} returned HTTP ${item.httpStatus}`
        : `${item.field} is not a valid reachable source URL`,
      fix: "Replace the source URL with a reachable authoritative source and resubmit a new one-file content PR.",
    }));
}

export function sourceEvidenceCloseDecision(
  report: SourceEvidenceReport,
): GateDecision | null {
  const evidence = sourceEvidenceToDecisionEvidence(report);
  if (!evidence.length) return null;
  return {
    verdict: "close",
    reasonCode: "source_hard_failure",
    evidence,
    sourceEvidenceHash: report.hash,
    confidence: 1,
    summary: [
      "Summary:",
      "- Deterministic source evidence found one or more dead or invalid source URLs.",
      "- Dead source links block one-shot content submissions because the entry cannot be verified.",
      "",
      "Source Review:",
      ...evidence.map((item) =>
        [
          `- \`${item.field || "source"}\` ${item.url || item.matchedUrl}`,
          item.httpStatus ? `returned HTTP ${item.httpStatus}` : item.outcome,
          item.finalUrl && item.finalUrl !== item.url
            ? `(final URL: ${item.finalUrl})`
            : "",
        ]
          .filter(Boolean)
          .join(" "),
      ),
      "",
      "Recommended Action:",
      "- Close this PR and resubmit with reachable, authoritative source URLs.",
    ].join("\n"),
    labels: [LABELS.close],
    close: true,
  };
}
