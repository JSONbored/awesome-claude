import { buildSubmissionPrDraft, validateSubmission } from "@heyclaude/registry/submission";
import { analyzeSubmissionDraftRisk } from "@heyclaude/registry/submission-risk";
import { parseGitHubRepoUrl } from "@heyclaude/registry/source-repo";
import { canonicalizeSourceUrl } from "@heyclaude/registry/source-url";

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
  reasonLabels: string[];
};

const DUPLICATE_REASON_LABELS = {
  slug: "same slug",
  source_url: "same source",
  title: "same title",
  similar_title: "similar title",
  same_repo: "same GitHub repository",
  same_host: "same source host",
} as const;

const COMMON_SOURCE_HOSTS = new Set([
  "bitbucket.org",
  "github.com",
  "gitlab.com",
  "marketplace.visualstudio.com",
  "npmjs.com",
  "pypi.org",
  "raw.githubusercontent.com",
]);

const TITLE_STOP_WORDS = new Set(["and", "for", "mcp", "server", "the", "tool", "with"]);

function normalizeText(value: unknown) {
  return String(value ?? "").trim();
}

function normalizeComparable(value: unknown) {
  return normalizeText(value).toLowerCase().replace(/\s+/g, " ");
}

function duplicateReasonLabels(reasons: string[]) {
  return reasons.map(
    (reason) => DUPLICATE_REASON_LABELS[reason as keyof typeof DUPLICATE_REASON_LABELS] || reason,
  );
}

function sourceHost(value: unknown) {
  const canonical = canonicalizeSourceUrl(value);
  if (!canonical) return "";
  try {
    return new URL(canonical).hostname.replace(/^www\./, "").toLowerCase();
  } catch {
    return "";
  }
}

function titleWords(value: unknown) {
  return new Set(
    normalizeComparable(value)
      .split(/[^a-z0-9]+/i)
      .map((word) => word.trim())
      .filter((word) => word.length > 2 && !TITLE_STOP_WORDS.has(word)),
  );
}

function isSimilarTitle(submittedTitle: string, entryTitle: string) {
  const submitted = normalizeComparable(submittedTitle);
  const existing = normalizeComparable(entryTitle);
  if (!submitted || !existing || submitted === existing) return false;
  const submittedWords = titleWords(submitted);
  const existingWords = titleWords(existing);
  if (!submittedWords.size || !existingWords.size) return false;
  const shared = [...submittedWords].filter((word) => existingWords.has(word));
  return (
    shared.length >= 2 && shared.length / Math.min(submittedWords.size, existingWords.size) >= 0.6
  );
}

function sourceProfile(values: unknown[]) {
  const canonicalUrls = new Set<string>();
  const hosts = new Set<string>();
  const githubRepos = new Set<string>();

  for (const value of values) {
    const canonical = canonicalizeSourceUrl(value);
    if (canonical) canonicalUrls.add(canonical);

    const host = sourceHost(canonical || value);
    if (host && !COMMON_SOURCE_HOSTS.has(host)) hosts.add(host);

    const repo = parseGitHubRepoUrl(canonical || value);
    if (repo) githubRepos.add(repo.url.toLowerCase());
  }

  return { canonicalUrls, hosts, githubRepos };
}

function intersects(left: Set<string>, right: Set<string>) {
  return [...left].some((value) => right.has(value));
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

function submittedSourceValues(fields: Record<string, unknown>) {
  return [
    fields.github_url,
    fields.docs_url,
    fields.source_url,
    fields.download_url,
    fields.website_url,
  ];
}

function submittedSourceUrls(fields: Record<string, unknown>) {
  return submittedSourceValues(fields).map(canonicalizeSourceUrl).filter(Boolean);
}

function entrySourceValues(entry: DirectoryEntry) {
  return [
    entry.repoUrl,
    entry.githubUrl,
    entry.documentationUrl,
    entry.docsUrl,
    entry.sourceUrl,
    entry.packageUrl,
    entry.repositoryUrl,
    entry.websiteUrl,
    entry.downloadUrl,
    ...(entry.sourceUrls ?? []),
    ...(entry.retrievalSources ?? []),
    ...(entry.trustSignals?.sourceUrls ?? []),
  ];
}

function duplicateCandidates(params: {
  entries: DirectoryEntry[];
  fields: Record<string, unknown>;
  category: string;
  slug: string;
}) {
  const title = normalizeComparable(params.fields.name || params.fields.title || "");
  const submittedValues = submittedSourceValues(params.fields);
  const submittedProfile = sourceProfile(submittedValues);
  const sourceUrlSet = new Set(submittedSourceUrls(params.fields));
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
    } else if (title && isSimilarTitle(title, entry.title)) {
      reasons.push("similar_title");
    }

    const entryProfile = sourceProfile(entrySourceValues(entry));
    if (sourceUrlSet.size) {
      const shared = [...entryProfile.canonicalUrls].find((url) => sourceUrlSet.has(url));
      if (shared) reasons.push("source_url");
    }
    if (intersects(submittedProfile.githubRepos, entryProfile.githubRepos)) {
      reasons.push("same_repo");
    }
    if (intersects(submittedProfile.hosts, entryProfile.hosts)) {
      reasons.push("same_host");
    }

    if (!reasons.length) continue;
    const uniqueReasons = [...new Set(reasons)];
    candidates.push({
      key: `${entry.category}:${entry.slug}`,
      category: entry.category,
      slug: entry.slug,
      title: entry.title,
      url: entry.canonicalUrl || `${siteConfig.url}/entry/${entry.category}/${entry.slug}`,
      reasons: uniqueReasons,
      reasonLabels: duplicateReasonLabels(uniqueReasons),
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
    normalized.includes("tools/app listing flow") ||
    normalized.includes("free resource queue without maintainer approval") ||
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
      const labels = duplicateReasonLabels(
        duplicate.reasons.filter((reason) => reason === "slug" || reason === "source_url"),
      ).join(", ");
      blockers.push(
        blocker("duplicate_existing", `Likely duplicate of ${duplicate.key}: ${labels}.`),
      );
    }
  }

  for (const duplicate of duplicates) {
    if (duplicate.reasons.includes("title")) {
      warnings.push(
        warning(
          "possible_duplicate_title",
          `Existing entry uses the same title: ${duplicate.key}.`,
        ),
      );
    }
    const relatedReasons = duplicate.reasons.filter(
      (reason) => !["slug", "source_url", "title"].includes(reason),
    );
    if (relatedReasons.length) {
      warnings.push(
        warning(
          "possible_duplicate_existing",
          `Possible related existing entry ${duplicate.key}: ${duplicateReasonLabels(relatedReasons).join(", ")}.`,
        ),
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
