import { parseGitHubRepoUrl } from "@heyclaude/registry/source-repo";
import { canonicalizeSourceUrl } from "@heyclaude/registry/source-url";

import type { DirectoryEntry } from "@/lib/content.server";
import { siteConfig } from "@/lib/site";

export const TOOL_LISTING_FORM_URL = "https://heyclau.de/tools/submit";

export type DuplicateCandidate = {
  key: string;
  category: string;
  slug: string;
  title: string;
  url: string;
  reasons: string[];
  reasonLabels: string[];
};

export type PreflightIssue = {
  code: string;
  message: string;
};

export type PreflightRouteSuggestion =
  | "route_away"
  | "fix_required"
  | "manual_review"
  | "submit_pr";

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

export function normalizePreflightText(value: unknown) {
  return String(value ?? "").trim();
}

export function normalizeComparablePreflightText(value: unknown) {
  return normalizePreflightText(value).toLowerCase().replace(/\s+/g, " ");
}

export function duplicateReasonLabels(reasons: string[]) {
  return reasons.map((reason) => {
    if (Object.hasOwn(DUPLICATE_REASON_LABELS, reason)) {
      return DUPLICATE_REASON_LABELS[reason as keyof typeof DUPLICATE_REASON_LABELS];
    }
    return reason;
  });
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
    normalizeComparablePreflightText(value)
      .split(/[^a-z0-9]+/i)
      .map((word) => word.trim())
      .filter((word) => word.length > 2 && !TITLE_STOP_WORDS.has(word)),
  );
}

export function isSimilarSubmissionTitle(submittedTitle: string, entryTitle: string) {
  const submitted = normalizeComparablePreflightText(submittedTitle);
  const existing = normalizeComparablePreflightText(entryTitle);
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

export function submittedSourceValues(fields: Record<string, unknown>) {
  return [
    fields.github_url,
    fields.docs_url,
    fields.source_url,
    fields.download_url,
    fields.website_url,
  ];
}

export function submittedSourceUrls(fields: Record<string, unknown>) {
  return submittedSourceValues(fields).map(canonicalizeSourceUrl).filter(Boolean);
}

export function entrySourceValues(entry: DirectoryEntry) {
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

export function findDuplicateCandidates(params: {
  entries: DirectoryEntry[];
  fields: Record<string, unknown>;
  category: string;
  slug: string;
}) {
  const title = normalizeComparablePreflightText(params.fields.name || params.fields.title || "");
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

    if (title && normalizeComparablePreflightText(entry.title) === title) {
      reasons.push("title");
    } else if (title && isSimilarSubmissionTitle(title, entry.title)) {
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

export function preflightBlocker(code: string, message: string): PreflightIssue {
  return { code, message };
}

export function preflightWarning(code: string, message: string): PreflightIssue {
  return { code, message };
}

export function isToolsRouteError(message: string) {
  const normalized = message.toLowerCase();
  return (
    normalized.includes("tools/app lead form") ||
    normalized.includes("tools/app listing flow") ||
    normalized.includes("free resource queue without maintainer approval") ||
    normalized.includes("change the category to tools")
  );
}

export function looksLikeCommercialListing(fields: Record<string, unknown>) {
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
    .map(normalizeComparablePreflightText)
    .filter(Boolean)
    .join(" ");
  if (!text) return false;
  return /\b(paid|pricing|enterprise|saas|hosted platform|sponsorship|sponsored|affiliate|listing)\b/.test(
    text,
  );
}

export function buildPreflightIssues(params: {
  validationSkipped: boolean;
  validationErrors: string[];
  category: string;
  fields: Record<string, unknown>;
  duplicates: DuplicateCandidate[];
  sourceGateSummary?: string | undefined;
  sourceGateStatus?: string | undefined;
  missingSafetySummary?: string | undefined;
  missingPrivacySummary?: string | undefined;
}) {
  const blockers: PreflightIssue[] = [];
  const warnings: PreflightIssue[] = [];

  if (params.validationSkipped) {
    blockers.push(
      preflightBlocker(
        "unsupported_category",
        "Choose one of the supported HeyClaude submission categories.",
      ),
    );
  }

  for (const error of params.validationErrors) {
    blockers.push(preflightBlocker("schema_invalid", error));
  }

  const shouldRouteCommercial =
    params.category !== "tools" && looksLikeCommercialListing(params.fields);
  if (shouldRouteCommercial) {
    blockers.push(
      preflightBlocker(
        "route_away",
        "Commercial tools, hosted services, paid listings, sponsorships, and affiliate-style submissions should use the tools/app listing flow.",
      ),
    );
  }

  for (const duplicate of params.duplicates) {
    if (duplicate.reasons.includes("slug") || duplicate.reasons.includes("source_url")) {
      const labels = duplicateReasonLabels(
        duplicate.reasons.filter((reason) => reason === "slug" || reason === "source_url"),
      ).join(", ");
      blockers.push(
        preflightBlocker("duplicate_existing", `Likely duplicate of ${duplicate.key}: ${labels}.`),
      );
    }
  }

  for (const duplicate of params.duplicates) {
    if (duplicate.reasons.includes("title")) {
      warnings.push(
        preflightWarning(
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
        preflightWarning(
          "possible_duplicate_existing",
          `Possible related existing entry ${duplicate.key}: ${duplicateReasonLabels(relatedReasons).join(", ")}.`,
        ),
      );
    }
  }

  if (params.sourceGateStatus && params.sourceGateStatus !== "pass") {
    warnings.push(
      preflightWarning(
        "source_needs_review",
        params.sourceGateSummary || "Add a canonical GitHub, docs, or source URL.",
      ),
    );
  }

  if (params.missingSafetySummary) {
    warnings.push(preflightWarning("missing_safety_notes", params.missingSafetySummary));
  }
  if (params.missingPrivacySummary) {
    warnings.push(preflightWarning("missing_privacy_notes", params.missingPrivacySummary));
  }

  return { blockers, warnings, shouldRouteCommercial };
}

export function resolvePreflightRouteSuggestion(params: {
  validationErrors: string[];
  shouldRouteCommercial: boolean;
  blockers: PreflightIssue[];
  policyDecision?: string | undefined;
  riskTier?: string | undefined;
}): PreflightRouteSuggestion {
  if (params.validationErrors.some(isToolsRouteError) || params.shouldRouteCommercial) {
    return "route_away";
  }
  if (params.blockers.length) return "fix_required";
  if (
    params.policyDecision === "maintainer_review" ||
    params.riskTier === "high" ||
    params.riskTier === "critical"
  ) {
    return "manual_review";
  }
  return "submit_pr";
}

export function buildSubmissionPrPreview(
  draft: { title: string; body: string },
  category: string,
  slug: string,
) {
  return {
    title: draft.title,
    targetPath: category && slug ? `content/${category}/${slug}.mdx` : "",
    branchHint: category && slug ? `heyclaude/submit-${category}-${slug}` : "",
    baseRef: siteConfig.submissionBaseRef,
    body: draft.body,
  };
}

export function normalizePreflightError(error: unknown) {
  if (error instanceof Error) {
    return {
      name: error.name,
      message: error.message,
    };
  }
  return { message: String(error) };
}
