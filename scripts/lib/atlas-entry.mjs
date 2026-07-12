// Pure projection helpers behind scripts/build-content-index.mjs: scrubbing
// documentation credential placeholders out of arbitrary values and projecting a
// content entry down to the fields the Atlas index publishes. Split out so the
// projection and scrubbing can be unit-tested without the build pipeline.

const ATLAS_CREDENTIAL_PLACEHOLDER_REPLACEMENTS = [
  [
    "postgresql://user:password@host:port/database",
    "PostgreSQL connection URI with user, password, host, port, and database",
  ],
  [
    "postgresql://user:password@localhost:5432/mydb",
    "PostgreSQL connection URI stored in POSTGRES_CONNECTION_STRING",
  ],
  [
    "redis://user:password@host:port/db",
    "Redis connection URI with user, password, host, port, and database",
  ],
  [
    "redis://:password@host:6379",
    "Redis connection URI with password authentication",
  ],
  [
    "redis://username:password@host:6379",
    "Redis connection URI with ACL username and password authentication",
  ],
];

/**
 * Recursively replace known credential-shaped placeholder strings with their
 * descriptive text. Strings are rewritten; arrays and plain objects are walked;
 * every other value is returned unchanged.
 */
export function scrubAtlasCredentialPlaceholders(value) {
  if (typeof value === "string") {
    let scrubbed = value;
    for (const [
      placeholder,
      replacement,
    ] of ATLAS_CREDENTIAL_PLACEHOLDER_REPLACEMENTS) {
      scrubbed = scrubbed.split(placeholder).join(replacement);
    }
    return scrubbed;
  }

  if (Array.isArray(value)) {
    return value.map((item) => scrubAtlasCredentialPlaceholders(item));
  }

  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value).map(([key, item]) => [
        key,
        scrubAtlasCredentialPlaceholders(item),
      ]),
    );
  }

  return value;
}

/** Project a content entry to the Atlas index shape, scrubbing credentials. */
export function pickAtlasEntry(entry) {
  const repoStats =
    entry.repoUrl ||
    entry.githubStars != null ||
    entry.githubForks != null ||
    entry.repoUpdatedAt
      ? {
          repository: entry.repoUrl
            ? entry.repoUrl.replace(/^https:\/\/github\.com\//, "")
            : undefined,
          url: entry.repoUrl || undefined,
          stars: entry.githubStars,
          forks: entry.githubForks,
          updatedAt: entry.repoUpdatedAt,
          appliesTo: entry.repoUrl ? "listing_source_repo" : "none",
          label: "Source repo",
        }
      : undefined;

  return scrubAtlasCredentialPlaceholders({
    category: entry.category,
    slug: entry.slug,
    title: entry.title,
    description: entry.description,
    seoTitle: entry.seoTitle,
    seoDescription: entry.seoDescription,
    author: entry.author,
    submittedBy: entry.submittedBy,
    submittedByUrl: entry.submittedByUrl,
    submittedAt: entry.submittedAt,
    sourceSubmissionUrl: entry.sourceSubmissionUrl,
    importPrUrl: entry.importPrUrl,
    reviewedBy: entry.reviewedBy,
    reviewedAt: entry.reviewedAt,
    claimStatus: entry.claimStatus,
    authorProfileUrl: entry.authorProfileUrl,
    dateAdded: entry.dateAdded,
    contentUpdatedAt: entry.contentUpdatedAt,
    tags: entry.tags,
    keywords: entry.keywords,
    cardDescription: entry.cardDescription,
    installCommand: entry.installCommand,
    configSnippet: entry.configSnippet,
    usageSnippet: entry.usageSnippet,
    documentationUrl: entry.documentationUrl,
    githubUrl: entry.githubUrl,
    repoUrl: entry.repoUrl,
    brandName: entry.brandName,
    brandDomain: entry.brandDomain,
    brandIconUrl: entry.brandIconUrl,
    prerequisites: entry.prerequisites,
    safetyNotes: entry.safetyNotes,
    privacyNotes: entry.privacyNotes,
    downloadUrl: entry.downloadUrl,
    downloadSha256: entry.downloadSha256,
    packageVerified: entry.packageVerified,
    downloadTrust: entry.downloadTrust,
    githubStars: entry.githubStars,
    githubForks: entry.githubForks,
    repoUpdatedAt: entry.repoUpdatedAt,
    repoStats,
    trustSignals: entry.trustSignals
      ? {
          firstPartyEditorial: entry.trustSignals.firstPartyEditorial,
          sourceStatus: entry.trustSignals.sourceStatus,
          lastVerifiedAt: entry.trustSignals.lastVerifiedAt,
          platforms: entry.trustSignals.platforms,
          supportLevels: entry.trustSignals.supportLevels,
        }
      : undefined,
    platformCompatibility: entry.platformCompatibility,
    commandSyntax: entry.commandSyntax,
    argumentHint: entry.argumentHint,
    allowedTools: entry.allowedTools,
    scriptLanguage: entry.scriptLanguage,
    trigger: entry.trigger,
    items: entry.items,
    installationOrder: entry.installationOrder,
    estimatedSetupTime: entry.estimatedSetupTime,
    difficulty: entry.difficulty,
    skillType: entry.skillType,
    skillLevel: entry.skillLevel,
    verificationStatus: entry.verificationStatus,
    verifiedAt: entry.verifiedAt,
    retrievalSources: entry.retrievalSources,
    testedPlatforms: entry.testedPlatforms,
    pricingModel: entry.pricingModel,
    disclosure: entry.disclosure,
    applicationCategory: entry.applicationCategory,
    operatingSystem: entry.operatingSystem,
    readingTime: entry.readingTime,
    difficultyScore: entry.difficultyScore,
    hasPrerequisites: entry.hasPrerequisites,
    hasTroubleshooting: entry.hasTroubleshooting,
    hasBreakingChanges: entry.hasBreakingChanges,
  });
}
