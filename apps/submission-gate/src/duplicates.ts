export type ContentDuplicateSignals = {
  filePath: string;
  category: string;
  slug: string;
  title: string;
  normalizedTitle: string;
  normalizedDescription: string;
  urls: string[];
  strictDuplicateUrls: string[];
  domains: string[];
  label?: string;
  url?: string;
};

export type ContentDuplicateMatch = {
  existing: ContentDuplicateSignals;
  reasons: string[];
};

export type ContentDuplicateReview = {
  legacyDuplicate: ContentDuplicateMatch | null;
  strictDuplicate: ContentDuplicateMatch | null;
  relatedCandidates: ContentDuplicateMatch[];
};

const PROTECTED_FRONTMATTER_FIELDS = new Set([
  "affiliateUrl",
  "author",
  "authorProfileUrl",
  "category",
  "claimStatus",
  "claimUrl",
  "dateAdded",
  "disclosure",
  "documentationUrl",
  "docsUrl",
  "downloadUrl",
  "githubUrl",
  "importPrNumber",
  "importPrUrl",
  "packageUrl",
  "packageVerified",
  "pricingModel",
  "repoUrl",
  "repositoryUrl",
  "reviewedAt",
  "reviewedBy",
  "reviewedPrNumber",
  "slug",
  "sourceUrl",
  "submittedAt",
  "submittedBy",
  "submittedByUrl",
  "sourceSubmissionNumber",
  "sourceSubmissionUrl",
  "websiteUrl",
]);

const URL_FIELDS = new Set([
  "documentationUrl",
  "docsUrl",
  "downloadUrl",
  "githubUrl",
  "packageUrl",
  "repoUrl",
  "repositoryUrl",
  "sourceUrl",
  "websiteUrl",
  "docs_url",
  "download_url",
  "github_url",
  "package_url",
  "repo_url",
  "repository_url",
  "source_url",
  "website_url",
]);

const CROSS_CATEGORY_STRICT_URL_FIELDS = new Set([
  "downloadUrl",
  "githubUrl",
  "packageUrl",
  "repoUrl",
  "repositoryUrl",
  "sourceUrl",
  "websiteUrl",
  "download_url",
  "github_url",
  "package_url",
  "repo_url",
  "repository_url",
  "source_url",
  "website_url",
]);
const DOMAIN_ONLY_EXCLUSIONS = new Set([
  "github.com",
  "npmjs.com",
  "pypi.org",
  "raw.githubusercontent.com",
  "registry.npmjs.org",
]);

const MULTI_ENTRY_CATALOG_URLS = new Set([
  "https://code.claude.com/docs/en/hooks",
  "https://code.claude.com/docs/en/statusline",
  "https://github.com/awslabs/mcp",
  "https://github.com/microsoft/mcp",
  "https://github.com/modelcontextprotocol/servers",
  "https://github.com/snowflake-labs/mcp",
  "https://github.com/twilio-labs/mcp",
]);

function unquoteYamlScalar(value: string) {
  const trimmed = value.trim();
  if (
    (trimmed.startsWith('"') && trimmed.endsWith('"')) ||
    (trimmed.startsWith("'") && trimmed.endsWith("'"))
  ) {
    return trimmed.slice(1, -1).trim();
  }
  return trimmed.replace(/\s+#.*$/, "").trim();
}

export function parseSimpleFrontmatter(source: string) {
  const match = /^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/.exec(
    String(source || ""),
  );
  const fields: Record<string, string> = {};
  if (!match) return fields;

  for (const line of match[1].split(/\r?\n/)) {
    const scalar = /^([A-Za-z][A-Za-z0-9_]*):\s*(.*?)\s*$/.exec(line);
    if (!scalar) continue;
    const [, key, value] = scalar;
    if (!value || value === "|" || value === ">") continue;
    fields[key] = unquoteYamlScalar(value);
  }
  return fields;
}

export function protectedFrontmatterChanges(
  beforeSource: string,
  afterSource: string,
) {
  const before = parseSimpleFrontmatter(beforeSource);
  const after = parseSimpleFrontmatter(afterSource);
  return [...PROTECTED_FRONTMATTER_FIELDS]
    .filter((field) => (before[field] || "") !== (after[field] || ""))
    .sort();
}

function normalizeText(value: unknown) {
  return String(value || "")
    .toLowerCase()
    .replace(/['’]/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim()
    .replace(/\s+/g, " ");
}

function normalizeHostname(hostname: string) {
  return hostname.toLowerCase().replace(/^www\./, "");
}

function normalizeUrl(value: unknown) {
  const raw = String(value || "").trim();
  if (!raw) return "";
  try {
    const parsed = new URL(raw);
    if (!["http:", "https:"].includes(parsed.protocol)) return "";
    parsed.protocol = "https:";
    parsed.hostname = normalizeHostname(parsed.hostname);
    parsed.hash = "";
    for (const key of [...parsed.searchParams.keys()]) {
      const normalizedKey = key.toLowerCase();
      if (
        normalizedKey.startsWith("utm_") ||
        [
          "affiliate",
          "affiliate_id",
          "campaign",
          "ref",
          "referral",
          "referral_code",
          "source",
          "via",
        ].includes(normalizedKey)
      ) {
        parsed.searchParams.delete(key);
      }
    }

    if (parsed.hostname === "github.com") {
      const [owner, repo, ...pathParts] = parsed.pathname
        .split("/")
        .filter(Boolean);
      if (owner && repo) {
        const repoRoot = `https://github.com/${owner.toLowerCase()}/${repo
          .replace(/\.git$/i, "")
          .toLowerCase()}`;
        if (MULTI_ENTRY_CATALOG_URLS.has(repoRoot) && pathParts.length) {
          return `${repoRoot}/${pathParts.join("/").replace(/\/+$/, "")}`;
        }
        return repoRoot;
      }
    }

    parsed.pathname = parsed.pathname.replace(/\/+$/, "") || "/";
    return parsed.toString().replace(/\/$/, "");
  } catch {
    return "";
  }
}

function domainFromUrl(value: string) {
  try {
    return normalizeHostname(new URL(value).hostname);
  } catch {
    return "";
  }
}

function pathParts(filePath: string) {
  const match = /^content\/([^/]+)\/([^/]+)\.mdx$/i.exec(filePath);
  return {
    category: match?.[1]?.toLowerCase() || "",
    slug: match?.[2]?.toLowerCase() || "",
  };
}

export function extractContentDuplicateSignals(params: {
  filePath: string;
  content: string;
  label?: string;
  url?: string;
}): ContentDuplicateSignals {
  const fields = parseSimpleFrontmatter(params.content);
  const parts = pathParts(params.filePath);
  const urlEntries = Object.entries(fields)
    .filter(([key]) => URL_FIELDS.has(key))
    .map(([key, value]) => ({
      key,
      url: normalizeUrl(value),
    }))
    .filter((entry) => entry.url);
  const urls = [...new Set(urlEntries.map((entry) => entry.url))];
  const strictDuplicateUrls = [
    ...new Set(
      urlEntries
        .filter((entry) => CROSS_CATEGORY_STRICT_URL_FIELDS.has(entry.key))
        .map((entry) => entry.url),
    ),
  ];

  return {
    filePath: params.filePath,
    category: normalizeText(fields.category) || parts.category,
    slug: normalizeText(fields.slug).replace(/\s+/g, "-") || parts.slug,
    title: fields.title || "",
    normalizedTitle: normalizeText(fields.title),
    normalizedDescription: normalizeText(fields.description),
    urls,
    strictDuplicateUrls,
    domains: [...new Set(urls.map(domainFromUrl).filter(Boolean))],
    label: params.label,
    url: params.url,
  };
}

function intersection(left: string[], right: string[]) {
  const rightSet = new Set(right);
  return left.filter((value) => rightSet.has(value));
}

function strictDuplicateUrls(sharedUrls: string[]) {
  return sharedUrls.filter((url) => !MULTI_ENTRY_CATALOG_URLS.has(url));
}

function multiEntryCatalogRoot(url: string) {
  return [...MULTI_ENTRY_CATALOG_URLS].find(
    (catalogUrl) => url === catalogUrl || url.startsWith(`${catalogUrl}/`),
  );
}

function isString(value: unknown): value is string {
  return typeof value === "string";
}

function multiEntryCatalogSubpathUrls(sharedUrls: string[]) {
  return sharedUrls.filter((url) => {
    const catalogUrl = multiEntryCatalogRoot(url);
    return catalogUrl && url !== catalogUrl;
  });
}

function sharedCatalogUrls(leftUrls: string[], rightUrls: string[]) {
  const leftCatalogUrls = leftUrls.map(multiEntryCatalogRoot).filter(isString);
  const rightCatalogUrls = rightUrls
    .map(multiEntryCatalogRoot)
    .filter(isString);
  return intersection(
    [...new Set(leftCatalogUrls)],
    [...new Set(rightCatalogUrls)],
  );
}

function isCollectionBridge(
  candidate: ContentDuplicateSignals,
  existing: ContentDuplicateSignals,
) {
  return (
    candidate.category !== existing.category &&
    (candidate.category === "collections" ||
      existing.category === "collections")
  );
}

export function findContentDuplicateMatch(
  candidate: ContentDuplicateSignals,
  existingItems: ContentDuplicateSignals[],
): ContentDuplicateMatch | null {
  for (const existing of existingItems) {
    const reasons: string[] = [];
    if (candidate.filePath === existing.filePath) {
      reasons.push(`same content path \`${existing.filePath}\``);
    }
    if (
      candidate.category &&
      candidate.slug &&
      candidate.category === existing.category &&
      candidate.slug === existing.slug
    ) {
      reasons.push(`same ${candidate.category} slug \`${candidate.slug}\``);
    }

    const sharedUrls = intersection(candidate.urls, existing.urls);
    if (sharedUrls.length) {
      reasons.push(`same canonical source URL ${sharedUrls[0]}`);
    }

    if (
      candidate.category &&
      candidate.normalizedTitle &&
      candidate.category === existing.category &&
      candidate.normalizedTitle === existing.normalizedTitle
    ) {
      reasons.push(`same normalized title in ${candidate.category}`);
    }

    if (
      candidate.category &&
      candidate.normalizedDescription &&
      candidate.category === existing.category &&
      candidate.normalizedDescription === existing.normalizedDescription
    ) {
      reasons.push(`same normalized description in ${candidate.category}`);
    }

    const sharedDomains = intersection(candidate.domains, existing.domains);
    if (
      sharedDomains.length &&
      candidate.normalizedTitle &&
      candidate.normalizedTitle === existing.normalizedTitle
    ) {
      reasons.push(`same source domain ${sharedDomains[0]} and title`);
    }
    const aggressiveDomainMatch = sharedDomains.find(
      (domain) => !DOMAIN_ONLY_EXCLUSIONS.has(domain),
    );
    if (
      aggressiveDomainMatch &&
      candidate.category &&
      candidate.category === existing.category
    ) {
      reasons.push(
        `same non-generic source domain ${aggressiveDomainMatch} in ${candidate.category}`,
      );
    }

    if (reasons.length) return { existing, reasons };
  }
  return null;
}

export function findStrictContentDuplicateMatch(
  candidate: ContentDuplicateSignals,
  existingItems: ContentDuplicateSignals[],
): ContentDuplicateMatch | null {
  for (const existing of existingItems) {
    const reasons: string[] = [];
    if (candidate.filePath === existing.filePath) {
      reasons.push(`same content path \`${existing.filePath}\``);
    }
    if (
      candidate.category &&
      candidate.slug &&
      candidate.category === existing.category &&
      candidate.slug === existing.slug
    ) {
      reasons.push(`same ${candidate.category} slug \`${candidate.slug}\``);
    }

    const sharedUrls = intersection(candidate.urls, existing.urls);
    const blockingSharedUrls = strictDuplicateUrls(sharedUrls);
    const crossCategoryBlockingSharedUrls = strictDuplicateUrls(
      intersection(candidate.strictDuplicateUrls, existing.strictDuplicateUrls),
    );
    const catalogSubpathUrls = multiEntryCatalogSubpathUrls(blockingSharedUrls);
    if (
      catalogSubpathUrls.length &&
      candidate.category &&
      candidate.category === existing.category
    ) {
      reasons.push(
        `same multi-entry catalog subpath URL ${catalogSubpathUrls[0]}`,
      );
    }
    if (
      crossCategoryBlockingSharedUrls.length &&
      candidate.category &&
      existing.category &&
      candidate.category !== existing.category &&
      !isCollectionBridge(candidate, existing)
    ) {
      reasons.push(
        `same canonical source URL ${crossCategoryBlockingSharedUrls[0]} across ${candidate.category}/${existing.category}`,
      );
    }
    if (
      blockingSharedUrls.length &&
      candidate.category &&
      candidate.category === existing.category &&
      candidate.normalizedDescription &&
      candidate.normalizedDescription === existing.normalizedDescription
    ) {
      reasons.push(
        `same canonical source URL ${blockingSharedUrls[0]} and same normalized description`,
      );
    }
    if (
      blockingSharedUrls.length >= 2 &&
      candidate.category === "collections" &&
      existing.category === "collections"
    ) {
      reasons.push(
        `same collection source set including ${blockingSharedUrls[0]}`,
      );
    }

    if (reasons.length) return { existing, reasons };
  }
  return null;
}

export function findRelatedContentMatches(
  candidate: ContentDuplicateSignals,
  existingItems: ContentDuplicateSignals[],
  limit = 5,
): ContentDuplicateMatch[] {
  const matches: ContentDuplicateMatch[] = [];
  for (const existing of existingItems) {
    const reasons: string[] = [];
    if (candidate.filePath === existing.filePath) continue;

    const sharedUrls = intersection(candidate.urls, existing.urls);
    if (sharedUrls.length && candidate.category !== existing.category) {
      reasons.push(
        isCollectionBridge(candidate, existing)
          ? `same canonical source URL ${sharedUrls[0]} across collection/resource categories`
          : `same canonical source URL ${sharedUrls[0]} across ${candidate.category}/${existing.category}`,
      );
    } else if (
      sharedUrls.length &&
      candidate.category &&
      candidate.category === existing.category
    ) {
      reasons.push(
        `same canonical source URL ${sharedUrls[0]} in ${candidate.category}, but not a strict duplicate without the same title, slug, or purpose`,
      );
    }
    const catalogUrls = sharedCatalogUrls(candidate.urls, existing.urls);
    if (
      catalogUrls.length &&
      candidate.category &&
      candidate.category === existing.category
    ) {
      reasons.push(
        `same multi-entry catalog source URL ${catalogUrls[0]} in ${candidate.category}`,
      );
    }

    const sharedDomains = intersection(candidate.domains, existing.domains);
    const relatedDomain = sharedDomains.find(
      (domain) => !DOMAIN_ONLY_EXCLUSIONS.has(domain),
    );
    if (relatedDomain && candidate.category && existing.category) {
      reasons.push(
        candidate.category === existing.category
          ? `same non-generic source domain ${relatedDomain} in ${candidate.category}`
          : `same non-generic source domain ${relatedDomain} across ${candidate.category}/${existing.category}`,
      );
    }

    if (
      candidate.category &&
      candidate.normalizedTitle &&
      candidate.category === existing.category &&
      candidate.normalizedTitle === existing.normalizedTitle
    ) {
      reasons.push(
        `same normalized title in ${candidate.category}, but not a strict duplicate without the same slug, path, source, or purpose`,
      );
    }

    if (
      candidate.category &&
      candidate.normalizedDescription &&
      candidate.category === existing.category &&
      candidate.normalizedDescription === existing.normalizedDescription
    ) {
      reasons.push(`same normalized description in ${candidate.category}`);
    }

    if (reasons.length) {
      matches.push({ existing, reasons });
      if (matches.length >= limit) break;
    }
  }
  return matches;
}

export function buildContentDuplicateReview(
  candidate: ContentDuplicateSignals,
  existingItems: ContentDuplicateSignals[],
): ContentDuplicateReview {
  return {
    legacyDuplicate: findContentDuplicateMatch(candidate, existingItems),
    strictDuplicate: findStrictContentDuplicateMatch(candidate, existingItems),
    relatedCandidates: findRelatedContentMatches(candidate, existingItems),
  };
}
