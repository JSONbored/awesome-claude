import { buildSubmissionIssueDraft, validateSubmission } from "@heyclaude/registry/submission";
import { analyzeIssueSubmissionRisk } from "@heyclaude/registry/submission-risk";

import { getDirectoryEntries, type DirectoryEntry } from "@/lib/content.server";
import { siteConfig } from "@/lib/site";

const DEFAULT_REPO = "JSONbored/awesome-claude";
const TOOL_LISTING_FORM_URL = "/tools/submit";
const MAX_FALLBACK_BODY_BYTES = 6000;
const FALLBACK_BODY_TRUNCATION_NOTE =
  "\n\n[HeyClaude preflight note: this fallback URL shortened the issue body. Submit from the website to keep the full draft.]";

type DuplicateCandidate = {
  key: string;
  category: string;
  slug: string;
  title: string;
  url: string;
  reasons: string[];
};

function normalizeText(value: unknown) {
  return String(value ?? "").trim();
}

function normalizeComparable(value: unknown) {
  return normalizeText(value).toLowerCase().replace(/\s+/g, " ");
}

function normalizeUrl(value: unknown) {
  const text = normalizeText(value);
  if (!text) return "";
  try {
    const url = new URL(text);
    url.hash = "";
    if (url.pathname !== "/" && url.pathname.endsWith("/")) {
      url.pathname = url.pathname.slice(0, -1);
    }
    return url.toString().toLowerCase();
  } catch {
    return text.toLowerCase();
  }
}

function normalizeError(error: unknown) {
  if (error instanceof Error) {
    return {
      name: error.name,
      message: error.message,
    };
  }
  return { message: String(error) };
}

function truncateFallbackBody(value: string) {
  const encoder = new TextEncoder();
  if (encoder.encode(value).length <= MAX_FALLBACK_BODY_BYTES) return value;

  const noteBytes = encoder.encode(FALLBACK_BODY_TRUNCATION_NOTE).length;
  const budget = Math.max(0, MAX_FALLBACK_BODY_BYTES - noteBytes);
  let bytes = 0;
  let body = "";
  for (const char of value) {
    const nextBytes = encoder.encode(char).length;
    if (bytes + nextBytes > budget) break;
    body += char;
    bytes += nextBytes;
  }
  return `${body.trimEnd()}${FALLBACK_BODY_TRUNCATION_NOTE}`;
}

function githubIssueFallbackUrl(issue: { title: string; body: string }) {
  const url = new URL(`https://github.com/${DEFAULT_REPO}/issues/new`);
  url.searchParams.set("title", issue.title);
  url.searchParams.set("body", truncateFallbackBody(issue.body));
  return url.toString();
}

function submittedSourceUrls(fields: Record<string, unknown>) {
  return [fields.github_url, fields.docs_url, fields.source_url, fields.download_url]
    .map(normalizeUrl)
    .filter(Boolean);
}

function entrySourceUrls(entry: DirectoryEntry) {
  return [
    entry.repoUrl,
    entry.githubUrl,
    entry.documentationUrl,
    entry.downloadUrl,
    ...(entry.trustSignals?.sourceUrls ?? []),
  ]
    .map(normalizeUrl)
    .filter(Boolean);
}

function duplicateCandidates(params: {
  entries: DirectoryEntry[];
  fields: Record<string, unknown>;
  category: string;
  slug: string;
}) {
  const title = normalizeComparable(params.fields.name || params.fields.title || "");
  const sourceUrls = submittedSourceUrls(params.fields);
  const sourceUrlSet = new Set(sourceUrls);
  const candidates: DuplicateCandidate[] = [];

  for (const entry of params.entries) {
    const reasons: string[] = [];
    if (params.category && params.slug) {
      if (entry.category === params.category && entry.slug === params.slug) {
        reasons.push("slug");
      }
    }

    if (title && normalizeComparable(entry.title) === title) {
      reasons.push("title");
    }

    if (sourceUrlSet.size) {
      const shared = entrySourceUrls(entry).find((url) => sourceUrlSet.has(url));
      if (shared) reasons.push("source_url");
    }

    if (!reasons.length) continue;
    candidates.push({
      key: `${entry.category}:${entry.slug}`,
      category: entry.category,
      slug: entry.slug,
      title: entry.title,
      url: entry.canonicalUrl || `${siteConfig.url}/entry/${entry.category}/${entry.slug}`,
      reasons: [...new Set(reasons)],
    });
  }

  return candidates.slice(0, 5);
}

function blocker(code: string, message: string) {
  return { code, message };
}

function warning(code: string, message: string) {
  return { code, message };
}

function isToolsRouteError(message: string) {
  const normalized = message.toLowerCase();
  return (
    normalized.includes("tools/app lead form") ||
    normalized.includes("change the category to tools")
  );
}

function missingNoteWarnings(risk: ReturnType<typeof analyzeIssueSubmissionRisk>) {
  const warnings = risk.classificationWarnings ?? [];
  const safety = warnings.find((item) => item.id === "missing_safety_notes");
  const privacy = warnings.find((item) => item.id === "missing_privacy_notes");
  return { safety, privacy };
}

export async function buildSubmissionPreflight(fields: Record<string, unknown>) {
  const issue = buildSubmissionIssueDraft({
    ...fields,
    submitted_via: "website-preflight",
  });
  const validation = validateSubmission({
    title: issue.title,
    body: issue.body,
    labels: issue.labels,
  });
  const risk = analyzeIssueSubmissionRisk(
    {
      title: issue.title,
      body: issue.body,
      labels: issue.labels,
      author: "website-preflight",
    },
    validation,
  );
  const fallbackUrl = githubIssueFallbackUrl(issue);
  const category = normalizeText(validation.category || risk.subject?.category);
  const slug = normalizeText(validation.fields?.slug || risk.subject?.slug);
  const entries = await getDirectoryEntries().catch((error) => {
    console.warn(
      JSON.stringify({
        ts: new Date().toISOString(),
        level: "warn",
        event: "submissions.preflight.directory_entries_failed",
        error: normalizeError(error),
      }),
    );
    return [];
  });
  const duplicates = duplicateCandidates({
    entries,
    fields: validation.fields || fields,
    category,
    slug,
  });
  const noteWarnings = missingNoteWarnings(risk);

  const blockers = [];
  const warnings = [];

  if (validation.skipped) {
    blockers.push(
      blocker(
        "unsupported_category",
        "Choose one of the supported HeyClaude submission categories.",
      ),
    );
  }

  for (const error of validation.errors || []) {
    blockers.push(blocker("schema_invalid", error));
  }

  for (const duplicate of duplicates) {
    if (duplicate.reasons.includes("slug") || duplicate.reasons.includes("source_url")) {
      blockers.push(blocker("duplicate_existing", `Likely duplicate of ${duplicate.key}.`));
    }
  }

  for (const duplicate of duplicates) {
    if (duplicate.reasons.includes("title")) {
      warnings.push(
        warning("possible_duplicate_title", `Similar existing title: ${duplicate.key}.`),
      );
    }
  }

  const sourceGate = risk.policyMatrix?.source;
  if (sourceGate?.status && sourceGate.status !== "pass") {
    warnings.push(
      warning(
        "source_needs_review",
        sourceGate.summary || "Add a canonical GitHub, docs, or source URL.",
      ),
    );
  }

  if (noteWarnings.safety) {
    warnings.push(warning("missing_safety_notes", noteWarnings.safety.summary));
  }
  if (noteWarnings.privacy) {
    warnings.push(warning("missing_privacy_notes", noteWarnings.privacy.summary));
  }

  const routeSuggestion = validation.errors?.some(isToolsRouteError)
    ? "tools_form"
    : blockers.length
      ? "fix_required"
      : "github_issue";

  return {
    ok: true,
    valid: !validation.skipped && validation.ok && blockers.length === 0,
    routeSuggestion,
    category,
    slug,
    fallbackUrl,
    issuePreview: {
      title: issue.title,
      labels: issue.labels,
      body: issue.body,
    },
    schema: {
      ok: validation.ok,
      skipped: validation.skipped,
      errors: validation.errors || [],
      warnings: validation.warnings || [],
      fields: validation.fields || {},
    },
    risk: {
      tier: risk.riskTier,
      policyDecision: risk.policyDecision,
      policyMatrix: risk.policyMatrix || {},
      reviewFlags: risk.reviewFlags || [],
      classificationWarnings: risk.classificationWarnings || [],
    },
    expectedNotes: {
      safety: Boolean(noteWarnings.safety),
      privacy: Boolean(noteWarnings.privacy),
      reasons: [noteWarnings.safety?.detail, noteWarnings.privacy?.detail].filter(Boolean),
    },
    blockers,
    warnings,
    duplicates,
    nextAction:
      routeSuggestion === "tools_form"
        ? {
            label: "Use the paid/editorial tool listing flow",
            url: TOOL_LISTING_FORM_URL,
          }
        : routeSuggestion === "fix_required"
          ? {
              label: "Fix blockers before opening a submission issue",
            }
          : {
              label: "Open a reviewable GitHub issue",
              url: fallbackUrl,
            },
  };
}
