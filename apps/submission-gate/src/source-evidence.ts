import { LABELS } from "./constants";
import { parseSimpleFrontmatter } from "./duplicates";
import type { GateDecision, GateDecisionEvidence } from "./review";

export type SubmittedSourceUrl = {
  field: string;
  url: string;
};

export type SourceEvidenceRole = "canonical" | "distribution";

export type SourceEvidenceItem = SubmittedSourceUrl & {
  status: "passed" | "hard_failure" | "retryable";
  role: SourceEvidenceRole;
  blocking: boolean;
  outcome: string;
  httpStatus?: number;
  finalUrl?: string;
  error?: string;
};

export type SourceEvidenceReport = {
  status: "passed" | "failed" | "retryable";
  hash: string;
  urls: SourceEvidenceItem[];
  warnings: SourceEvidenceItem[];
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
const SOURCE_EVIDENCE_TIMEOUT_MS = 1_500;
const MAX_SOURCE_EVIDENCE_URLS = 10;
const MAX_SOURCE_EVIDENCE_REDIRECTS = 2;
const DISTRIBUTION_SOURCE_FIELDS = new Set(["downloadUrl", "packageUrl"]);
const DISTRIBUTION_SOURCE_HOSTS = new Set([
  "crates.io",
  "files.pythonhosted.org",
  "hub.docker.com",
  "marketplace.visualstudio.com",
  "mvnrepository.com",
  "npmjs.com",
  "packagist.org",
  "pkg.go.dev",
  "plugins.gradle.org",
  "pypi.org",
  "registry.npmjs.org",
  "repo1.maven.org",
  "rubygems.org",
  "www.npmjs.com",
]);

const TRUSTED_SOURCE_HOSTS = new Set([
  "bitbucket.org",
  "crates.io",
  "deno.land",
  "docs.anthropic.com",
  "docs.github.com",
  "gist.github.com",
  "github.com",
  "gitlab.com",
  "jsr.io",
  "marketplace.visualstudio.com",
  "npmjs.com",
  "pkg.go.dev",
  "pypi.org",
  "raw.githubusercontent.com",
  "www.npmjs.com",
]);

const TRUSTED_SOURCE_HOST_SUFFIXES = [] as const;
const PRIMARY_CANONICAL_SOURCE_FIELDS = new Set([
  "githubUrl",
  "repoUrl",
  "repositoryUrl",
  "sourceUrl",
]);

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

function sourceRole(item: SubmittedSourceUrl): SourceEvidenceRole {
  if (DISTRIBUTION_SOURCE_FIELDS.has(item.field)) return "distribution";
  try {
    const host = new URL(item.url).hostname.toLowerCase();
    if (DISTRIBUTION_SOURCE_HOSTS.has(host)) return "distribution";
  } catch {
    // Malformed URLs are classified separately as hard failures.
  }
  return "canonical";
}

function withSourceDefaults(
  item: SubmittedSourceUrl,
  values: Omit<SourceEvidenceItem, keyof SubmittedSourceUrl | "role" | "blocking">,
): SourceEvidenceItem {
  return {
    ...item,
    ...values,
    role: sourceRole(item),
    blocking: true,
  };
}

function sourceStatusFromHttpStatus(status: number) {
  if (status >= 200 && status < 400) return "passed" as const;
  if ([401, 403, 408, 425, 429].includes(status) || status >= 500) {
    return "retryable" as const;
  }
  if (status === 404 || status === 410) return "hard_failure" as const;
  if (status >= 400 && status < 500) return "hard_failure" as const;
  return "retryable" as const;
}

function normalizeHostname(hostname: string) {
  return hostname.toLowerCase().replace(/\.$/, "");
}

function sourceHostIsTrusted(hostname: string) {
  const normalized = normalizeHostname(hostname);
  return (
    TRUSTED_SOURCE_HOSTS.has(normalized) ||
    DISTRIBUTION_SOURCE_HOSTS.has(normalized) ||
    TRUSTED_SOURCE_HOST_SUFFIXES.some((suffix) => normalized.endsWith(suffix))
  );
}

function validateFetchableSourceUrl(url: string) {
  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch (error) {
    return {
      ok: false as const,
      outcome: "invalid_url",
      error: error instanceof Error ? error.message : "Invalid source URL.",
    };
  }
  if (!["http:", "https:"].includes(parsed.protocol)) {
    return {
      ok: false as const,
      outcome: "invalid_url",
      error: "Source URL must use http or https.",
    };
  }
  if (!sourceHostIsTrusted(parsed.hostname)) {
    return {
      ok: false as const,
      outcome: "source_host_not_checked",
      error:
        "Source URL host is outside the deterministic reachability allowlist.",
    };
  }
  return { ok: true as const, parsed };
}

function redirectLocation(response: Response, currentUrl: string) {
  const location = response.headers.get("location");
  if (!location) return "";
  try {
    return new URL(location, currentUrl).toString();
  } catch {
    return "";
  }
}

async function fetchSourceUrl(
  item: SubmittedSourceUrl,
  method: "HEAD" | "GET",
  fetchImpl: typeof fetch,
): Promise<SourceEvidenceItem> {
  let currentUrl = item.url;
  for (
    let redirects = 0;
    redirects <= MAX_SOURCE_EVIDENCE_REDIRECTS;
    redirects += 1
  ) {
    const validation = validateFetchableSourceUrl(currentUrl);
    if (!validation.ok) {
      return withSourceDefaults(item, {
        status: "hard_failure",
        outcome: validation.outcome,
        error: validation.error,
      });
    }

    const response = await fetchImpl(currentUrl, {
      method,
      redirect: "manual",
      headers: {
        accept: "text/html,application/json,text/plain,*/*",
        "user-agent": "heyclaude-submission-gate",
      },
      signal: AbortSignal.timeout(SOURCE_EVIDENCE_TIMEOUT_MS),
    });

    if (response.status >= 300 && response.status < 400) {
      const nextUrl = redirectLocation(response, currentUrl);
      if (!nextUrl) {
        return withSourceDefaults(item, {
          status: "retryable",
          outcome: "redirect_without_location",
          httpStatus: response.status,
          finalUrl: currentUrl,
        });
      }
      if (redirects === MAX_SOURCE_EVIDENCE_REDIRECTS) {
        return withSourceDefaults(item, {
          status: "retryable",
          outcome: "too_many_redirects",
          httpStatus: response.status,
          finalUrl: currentUrl,
        });
      }
      currentUrl = nextUrl;
      continue;
    }

    const status = sourceStatusFromHttpStatus(response.status);
    return withSourceDefaults(item, {
      status,
      outcome:
        status === "passed"
          ? "reachable"
          : status === "hard_failure"
            ? "http_hard_failure"
            : "source_inconclusive",
      httpStatus: response.status,
      finalUrl: currentUrl,
    });
  }

  return withSourceDefaults(item, {
    status: "retryable",
    outcome: "too_many_redirects",
  });
}

async function checkOneSourceUrl(
  item: SubmittedSourceUrl,
  fetchImpl: typeof fetch,
): Promise<SourceEvidenceItem> {
  const validation = validateFetchableSourceUrl(item.url);
  if (!validation.ok) {
    const invalidProtocol = validation.outcome === "invalid_url";
    return withSourceDefaults(item, {
      status: invalidProtocol ? "hard_failure" : "passed",
      outcome: validation.outcome,
      error: validation.error,
    });
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
    return withSourceDefaults(item, {
      status: "retryable",
      outcome: "fetch_error",
      error:
        error instanceof Error
          ? error.message
          : "Source URL fetch failed before a response was returned.",
    });
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
      role: item.role,
      blocking: item.blocking,
    })),
  );
}

function hasVerifiableCanonicalSource(urls: SourceEvidenceItem[]) {
  const reachableCanonical = urls.filter(
    (item) =>
      item.role === "canonical" &&
      item.status === "passed" &&
      item.outcome === "reachable",
  );
  return (
    reachableCanonical.length >= 2 ||
    reachableCanonical.some((item) =>
      PRIMARY_CANONICAL_SOURCE_FIELDS.has(item.field),
    )
  );
}

function downgradeInconclusiveSourceWarnings(urls: SourceEvidenceItem[]) {
  if (!hasVerifiableCanonicalSource(urls)) return urls;
  return urls.map((item) =>
    item.status === "retryable"
      ? { ...item, blocking: false }
      : item,
  );
}

export async function checkSubmittedSourceEvidence(
  source: string,
  fetchImpl: typeof fetch = fetch,
): Promise<SourceEvidenceReport> {
  const extracted = extractSubmittedSourceUrls(source);
  const checkedUrls: SourceEvidenceItem[] = [];
  for (const item of extracted.slice(0, MAX_SOURCE_EVIDENCE_URLS)) {
    checkedUrls.push(await checkOneSourceUrl(item, fetchImpl));
  }
  for (const item of extracted.slice(MAX_SOURCE_EVIDENCE_URLS)) {
    checkedUrls.push(withSourceDefaults(item, {
      status: "hard_failure",
      outcome: "too_many_source_urls",
      error: `Only ${MAX_SOURCE_EVIDENCE_URLS} source URLs can be checked automatically.`,
    }));
  }
  const urls = downgradeInconclusiveSourceWarnings(checkedUrls);
  const blockingUrls = urls.filter((item) => item.blocking);
  const status = blockingUrls.some((item) => item.status === "hard_failure")
    ? "failed"
    : blockingUrls.some((item) => item.status === "retryable")
      ? "retryable"
      : "passed";
  return {
    status,
    urls,
    warnings: urls.filter(
      (item) => !item.blocking && item.status !== "passed",
    ),
    hash: await sha256Hex(sourceEvidenceHashInput(urls)),
  };
}

export function sourceEvidenceSummary(report: SourceEvidenceReport) {
  if (!report.urls.length) return "No source URLs were declared.";
  return report.urls
    .map((item) => {
      const status = item.httpStatus ? `HTTP ${item.httpStatus}` : item.outcome;
      const suffix = item.blocking
        ? ""
        : " (non-blocking source-inconclusive warning)";
      return `${item.field} ${item.url} -> ${status}${suffix}`;
    })
    .join("; ");
}

export function sourceEvidenceToDecisionEvidence(
  report: SourceEvidenceReport,
): GateDecisionEvidence[] {
  return report.urls
    .filter((item) => item.blocking && item.status === "hard_failure")
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
