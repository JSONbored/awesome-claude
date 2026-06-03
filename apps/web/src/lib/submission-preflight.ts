import { buildSubmissionPrDraft, validateSubmission } from "@heyclaude/registry/submission";
import { analyzeSubmissionDraftRisk } from "@heyclaude/registry/submission-risk";

import { getDirectoryEntries, type DirectoryEntry } from "@/lib/content.server";
import { siteConfig } from "@/lib/site";

const TOOL_LISTING_FORM_URL = "https://heyclau.de/tools/submit";

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

function looksLikeCommercialListing(fields: Record<string, unknown>) {
  const text = [
    fields.name,
    fields.title,
    fields.description,
    fields.card_description,
    fields.docs_url,
    fields.website_url,
    fields.pricing_model,
    fields.disclosure,
  ]
    .map(normalizeComparable)
    .filter(Boolean)
    .join(" ");
  if (!text) return false;
  return /\b(paid|pricing|enterprise|saas|hosted platform|sponsorship|sponsored|affiliate|listing)\b/.test(
    text,
  );
}

function missingNoteWarnings(risk: ReturnType<typeof analyzeSubmissionDraftRisk>) {
  const warnings = risk.classificationWarnings ?? [];
  const safety = warnings.find((item) => item.id === "missing_safety_notes");
  const privacy = warnings.find((item) => item.id === "missing_privacy_notes");
  return { safety, privacy };
}

function buildPrPreview(draft: { title: string; body: string }, category: string, slug: string) {
  return {
    title: draft.title,
    targetPath: category && slug ? `content/${category}/${slug}.mdx` : "",
    branchHint: category && slug ? `heyclaude/submit-${category}-${slug}` : "",
    baseRef: siteConfig.submissionBaseRef,
    body: draft.body,
  };
}

export async function buildSubmissionPreflight(fields: Record<string, unknown>) {
  const draft = buildSubmissionPrDraft({
    ...fields,
    submitted_via: "website-preflight",
  });
  const validation = validateSubmission({
    title: draft.title,
    body: draft.body,
  });
  const risk = analyzeSubmissionDraftRisk(
    {
      title: draft.title,
      body: draft.body,
      author: "website-preflight",
    },
    validation,
  );
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

  const shouldRouteCommercial =
    category !== "tools" && looksLikeCommercialListing(validation.fields || fields);
  if (shouldRouteCommercial) {
    blockers.push(
      blocker(
        "route_away",
        "Commercial tools, hosted services, paid listings, sponsorships, and affiliate-style submissions should use the tools/app listing flow.",
      ),
    );
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

  const routeSuggestion =
    validation.errors?.some(isToolsRouteError) || shouldRouteCommercial
      ? "route_away"
      : blockers.length
        ? "fix_required"
        : risk.policyDecision === "maintainer_review" ||
            risk.riskTier === "high" ||
            risk.riskTier === "critical"
          ? "manual_review"
          : "submit_pr";

  const response = {
    ok: true,
    valid: routeSuggestion === "submit_pr",
    routeSuggestion,
    category,
    slug,
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
      routeSuggestion === "route_away"
        ? {
            label: "Use the paid/editorial tool listing flow",
            url: TOOL_LISTING_FORM_URL,
          }
        : routeSuggestion === "fix_required"
          ? {
              label: "Fix blockers before opening a submission",
            }
          : routeSuggestion === "manual_review"
            ? {
                label: "Prepare a single-entry PR with extra source and safety context",
              }
            : {
                label: "Prepare a single-entry content PR",
              },
  };
  return routeSuggestion === "submit_pr"
    ? { ...response, prPreview: buildPrPreview(draft, category, slug) }
    : response;
}
