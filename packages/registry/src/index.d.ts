export type ContentCodeBlock = {
  language: string;
  code: string;
};

export type ContentSection = {
  title: string;
  id: string;
  markdown: string;
  codeBlocks: ContentCodeBlock[];
};

export type ContentHeading = {
  depth: number;
  text: string;
  id: string;
};

export type ContentCollectionItem = {
  slug: string;
  category: string;
};

export type DownloadTrust = "first-party" | "external" | null;

export type SkillType = "general" | "capability-pack";
export type SkillLevel = "foundational" | "advanced" | "expert";
export type VerificationStatus = "draft" | "validated" | "production";
export type SkillSupportLevel = "native-skill" | "adapter" | "manual-context";
export type ClaimStatus = "unclaimed" | "pending" | "verified";
export type BrandAssetSource =
  | "brandfetch"
  | "manual"
  | "website"
  | "github"
  | "none";

export type SkillPlatformCompatibility = {
  platform: string;
  supportLevel: SkillSupportLevel | string;
  installPath: string;
  adapterPath?: string;
  verifiedAt?: string;
};

export type SkillPackage = {
  format: "agent-skill" | string;
  entrypoint: string;
  downloadUrl: string;
  sha256?: string | null;
};

export type EntryTrustSignals = {
  firstPartyEditorial: boolean;
  packageVerified: boolean;
  packageTrust: DownloadTrust;
  packageChecksum: string;
  checksumPresent: boolean;
  sourceUrlCount: number;
  sourceUrls: string[];
  sourceStatus: "available" | "missing" | string;
  lastVerifiedAt: string;
  adapterGenerated: boolean;
  platforms: string[];
  supportLevels: string[];
};

export type RegistryTrustReportEntry = {
  key: string;
  category: string;
  slug: string;
  title: string;
  brandName: string;
  brandDomain: string;
  brandAssetSource: string;
  sourceStatus: string;
  sourceUrlCount: number;
  checksumPresent: boolean;
  adapterGenerated: boolean;
  firstPartyEditorial: boolean;
  packageVerified: boolean;
  packageTrust: DownloadTrust;
  hasSafetyNotes: boolean;
  hasPrivacyNotes: boolean;
  lastVerifiedAt: string;
  verificationAgeDays: number | null;
  hasProvenance: boolean;
  submittedBy: string;
  reviewedBy: string;
  claimStatus: string;
  recommendations: string[];
};

export type RegistryTrustReport = {
  schemaVersion: number;
  kind: "registry-trust-report";
  generatedAt: string;
  count: number;
  thresholds: {
    recentlyVerifiedDays: number;
    staleVerificationDays: number;
  };
  summary: {
    brandedCount: number;
    brandedPercent: number;
    brandfetchCount: number;
    sourceAvailableCount: number;
    sourceAvailablePercent: number;
    missingSourceCount: number;
    checksumPresentCount: number;
    checksumPresentPercent: number;
    adapterGeneratedCount: number;
    recentlyVerifiedCount: number;
    staleVerificationCount: number;
    provenanceCount: number;
    provenancePercent: number;
    claimedOrReviewedCount: number;
    claimedOrReviewedPercent: number;
    safetyNotesCount: number;
    safetyNotesPercent: number;
    privacyNotesCount: number;
    privacyNotesPercent: number;
    firstPartyPackageCount: number;
    firstPartyPackagePercent: number;
    recommendedFixCount: number;
    entriesNeedingAttention: number;
  };
  categoryBreakdown: Record<
    string,
    {
      count: number;
      brandCoverage: number;
      sourceAvailable: number;
      checksumPresent: number;
      adapterGenerated: number;
      provenancePresent: number;
      safetyNotesPresent: number;
      privacyNotesPresent: number;
      firstPartyPackage: number;
      recommendedFixes: number;
    }
  >;
  queues: Record<string, RegistryTrustReportEntry[]>;
  entries: RegistryTrustReportEntry[];
};

export type RepoStats = {
  url?: string;
  stars?: number | null;
  forks?: number | null;
  updatedAt?: string | null;
  source?: "github" | "unknown";
  appliesTo?: "listing_source_repo" | "none";
  label?: string;
};

export type ContentEntry = {
  category: string;
  slug: string;
  title: string;
  description: string;
  seoTitle?: string;
  seoDescription?: string;
  author?: string;
  authorProfileUrl?: string;
  dateAdded?: string;
  contentUpdatedAt?: string;
  submittedBy?: string;
  submittedByUrl?: string;
  submittedAt?: string;
  submissionIssueNumber?: number;
  submissionIssueUrl?: string;
  importPrNumber?: number;
  importPrUrl?: string;
  reviewedBy?: string;
  reviewedAt?: string;
  claimStatus?: ClaimStatus;
  claimedBy?: string;
  claimedByUrl?: string;
  claimedAt?: string;
  tags: string[];
  keywords: string[];
  readingTime?: number;
  difficultyScore?: number;
  documentationUrl?: string;
  websiteUrl?: string;
  brandName?: string;
  brandDomain?: string;
  brandIconUrl?: string;
  brandLogoUrl?: string;
  brandAssetSource?: BrandAssetSource | string;
  brandVerifiedAt?: string;
  brandColors?: string[];
  affiliateUrl?: string;
  pricingModel?: string;
  disclosure?: Disclosure;
  applicationCategory?: string;
  operatingSystem?: string;
  cardDescription?: string;
  installable?: boolean;
  installCommand?: string;
  usageSnippet?: string;
  copySnippet?: string;
  configSnippet?: string;
  commandSyntax?: string;
  argumentHint?: string;
  allowedTools?: string[];
  scriptLanguage?: string;
  scriptBody?: string;
  trigger?: string;
  items?: ContentCollectionItem[];
  installationOrder?: string[];
  estimatedSetupTime?: string;
  difficulty?: string;
  skillType?: SkillType;
  skillLevel?: SkillLevel;
  verificationStatus?: VerificationStatus;
  verifiedAt?: string;
  retrievalSources?: string[];
  testedPlatforms?: string[];
  platformCompatibility?: SkillPlatformCompatibility[];
  skillPackage?: SkillPackage;
  prerequisites?: string[];
  safetyNotes?: string[];
  privacyNotes?: string[];
  hasPrerequisites?: boolean;
  hasTroubleshooting?: boolean;
  hasBreakingChanges?: boolean;
  robotsIndex?: boolean;
  robotsFollow?: boolean;
  packageVerified?: boolean;
  downloadUrl?: string;
  downloadTrust?: DownloadTrust;
  downloadSha256?: string | null;
  body: string;
  sections: ContentSection[];
  headings: ContentHeading[];
  codeBlocks: ContentCodeBlock[];
  filePath?: string;
  githubUrl?: string;
  repoUrl?: string | null;
  githubStars?: number | null;
  githubForks?: number | null;
  repoUpdatedAt?: string | null;
  repoStats?: RepoStats;
  canonicalUrl?: string;
  llmsUrl?: string;
  apiUrl?: string;
  trustSignals?: EntryTrustSignals;
};

export type DirectoryEntry = Omit<
  ContentEntry,
  "body" | "sections" | "headings" | "codeBlocks" | "scriptBody"
> & {
  body?: string;
  sections?: ContentSection[];
  headings?: ContentHeading[];
  codeBlocks?: ContentCodeBlock[];
  scriptBody?: string;
};

export type CategorySummary = {
  category: string;
  label: string;
  count: number;
  description: string;
};

export type RegistryCategorySpecEntry = {
  label: string;
  description: string;
  seoDescription?: string;
  usageHint: string;
  quickstart?: string[];
  template: string;
  requiresAssetContent: boolean;
  requiresUsageSnippet: boolean;
  supportsSkillMetadata: boolean;
  supportsDownloadUrl: boolean;
};

export type RegistryCategorySpec = {
  categoryOrder: string[];
  submissionOrder: string[];
  commonIssueRequiredFields: string[];
  skillTypeValues: SkillType[];
  skillLevelValues: SkillLevel[];
  verificationStatusValues: VerificationStatus[];
  defaultTestedPlatforms: string[];
  aliases: Record<string, string>;
  categories: Record<string, RegistryCategorySpecEntry>;
};

export type DistributionBadge = {
  label: string;
  title: string;
};

export type Disclosure =
  | "editorial"
  | "heyclaude_pick"
  | "affiliate"
  | "sponsored"
  | "claimed";
export type CommercialTier = "free" | "standard" | "featured" | "sponsored";
export type ListingLeadKind = "job" | "tool" | "claim";
export type ListingLead = {
  kind: ListingLeadKind;
  tierInterest: CommercialTier;
  contactName: string;
  contactEmail: string;
  companyName: string;
  listingTitle: string;
  websiteUrl?: string;
  applyUrl?: string;
  message?: string;
};
export type JobSourceLifecycleInput = {
  currentStatus?: string;
  tier?: string;
  staleCheckCount?: number;
  expiresAt?: string | null;
  paidPlacementExpiresAt?: string | null;
  sourceOk?: boolean;
  titleMatched?: boolean;
  companyMatched?: boolean;
  closureDetected?: boolean;
  applyDetected?: boolean;
};
export type JobSourceLifecycleResult = {
  status: "active" | "stale_pending_review" | "closed";
  staleCheckCount: number;
  indexable: boolean;
  reason: string;
  expiresAt?: string | null;
};
export type JobSourceTruth = {
  sourceOk?: boolean;
  titleMatched?: boolean;
  companyMatched?: boolean;
  closureDetected?: boolean;
  applyDetected?: boolean;
};
export type JobPublicExposureReport = {
  ok: boolean;
  required: boolean;
  errors: string[];
};
export type CommercialPlacement = {
  targetKind: "job" | "tool" | "entry";
  targetKey: string;
  tier: Exclude<CommercialTier, "free">;
  disclosure: Disclosure;
  startsAt?: string;
  expiresAt?: string;
};

export declare const BRAND_ASSET_SOURCES: BrandAssetSource[];
export declare const KNOWN_BRANDS: Array<{
  name: string;
  domain: string;
  aliases: string[];
}>;
export declare function normalizeBrandDomain(value?: unknown): string;
export declare function domainFromUrl(value?: unknown): string;
export declare function isHostingOrRegistryDomain(domain?: string): boolean;
export declare function normalizeBrandColors(value?: unknown): string[];
export declare function isAllowedBrandAssetUrl(value?: unknown): boolean;
export declare function brandfetchClientId(params?: {
  clientId?: string;
}): string;
export declare function brandfetchLogoUrl(
  domain: string,
  params?: {
    clientId?: string;
    width?: number;
    height?: number;
    type?: "icon" | "logo" | string;
    theme?: "light" | "dark" | string;
  },
): string;
export declare function brandAssetProxyUrl(
  domain: string,
  params?: {
    kind?: "icon" | "logo" | string;
    siteUrl?: string;
    baseUrl?: string;
  },
): string;
export declare function detectKnownBrand(data?: Record<string, unknown>): {
  name?: string;
  domain: string;
  source: "explicit" | "known-brand";
  alias?: string;
} | null;
export declare function buildBrandAssetMetadata(
  data?: Record<string, unknown>,
  options?: {
    allowWebsiteFallback?: boolean;
    allowAliasFallback?: boolean;
    assetBaseUrl?: string;
    siteUrl?: string;
    clientId?: string;
  },
): {
  brandName?: string;
  brandDomain?: string;
  brandIconUrl?: string;
  brandLogoUrl?: string;
  brandAssetSource?: BrandAssetSource | string;
  brandVerifiedAt?: string;
  brandColors?: string[];
};
export type ToolListing = DirectoryEntry & {
  websiteUrl?: string;
  pricingModel?: string;
  disclosure?: Disclosure;
  placement?: CommercialPlacement;
  featured?: boolean;
  sponsored?: boolean;
};
export type JsonLdDocument = Record<string, unknown>;
export type SeoDocument = {
  title: string;
  description: string;
  path: string;
  jsonLd?: JsonLdDocument[];
};

export type DerivedSeoFields = {
  seoTitle: string;
  seoDescription: string;
  keywords: string[];
};

export function platformFeedSlug(platform: string): string;
export function buildCategoryDistributionFeed(
  entries: ContentEntry[],
  category: string,
  params?: { siteUrl?: string },
): unknown;
export function buildPlatformDistributionFeed(
  entries: ContentEntry[],
  platform: string,
  params?: { siteUrl?: string },
): unknown;
export function buildDistributionFeedIndex(
  entries: ContentEntry[],
  params?: { siteUrl?: string },
): unknown;

export function deriveSeoFields(
  data?: Record<string, unknown>,
  category?: string,
): DerivedSeoFields;

export type SourceProvenance = {
  sourceQuality: string;
  hasExternalSource: boolean;
  hasRepository: boolean;
  hasDocumentation: boolean;
  hasFirstPartyPackage: boolean;
  sourceUrls: string[];
  externalSourceUrls: string[];
};

export type EntryQualityReport = {
  key: string;
  category: string;
  slug: string;
  title: string;
  scores: {
    total: number;
    usefulness: number;
    source: number;
    copyability: number;
    freshness: number;
    seo: number;
  };
  provenance: SourceProvenance;
  warnings: string[];
};

export type ContentQualityPrompt = {
  key: string;
  category: string;
  slug: string;
  title: string;
  score: number;
  priority: "high" | "medium" | "low";
  prompt: string;
  warnings: string[];
};

export type SubmissionFieldSpec = {
  id: string;
  label: string;
  type: string;
  required: boolean;
  placeholder?: string;
  helpText?: string;
  render?: string;
  options?: string[];
};

export type IssueTemplateSpec = {
  schemaVersion: number;
  category: string;
  template?: string;
  labels: string[];
  title: string;
  fields: SubmissionFieldSpec[];
};

export type SubmissionIssueDraft = {
  title: string;
  body: string;
  labels: string[];
};

export function normalizeSubmissionPayloadFields(
  fields?: Record<string, unknown>,
): Record<string, string>;
export function buildSubmissionIssueTitle(
  fields?: Record<string, unknown>,
): string;
export function buildSubmissionIssueBody(
  fields?: Record<string, unknown>,
): string;
export function buildSubmissionIssueDraft(
  fields?: Record<string, unknown>,
): SubmissionIssueDraft;

export type SubmissionValidationReport = {
  ok: boolean;
  skipped: boolean;
  reason: string;
  category: string;
  errors: string[];
  warnings: string[];
  fields: Record<string, string>;
};

export type SubmissionRiskTier = "low" | "medium" | "high" | "critical";

export type SubmissionRiskFlag = {
  id: string;
  severity: "info" | "low" | "medium" | "high" | "critical";
  summary: string;
  detail?: string;
};

export type SubmissionClassificationWarning = {
  id: string;
  summary: string;
  detail?: string;
};

export type SubmissionProvenanceFinding = {
  id: string;
  severity: "info" | "warning" | "error";
  summary: string;
  detail?: string;
  blocking?: boolean;
};

export type SubmissionRiskContributor = {
  login: string;
  htmlUrl?: string;
  id?: number | string | null;
  accountType?: string;
  createdAt?: string;
  publicRepos?: number | string | null;
  error?: string;
};

export type SubmissionContentProvenance = {
  filename: string;
  submittedBy?: string;
  submittedByUrl?: string;
  submissionIssueNumber?: number | null;
  submissionIssueUrl?: string;
  importPrNumber?: number | null;
  importPrUrl?: string;
};

export type SubmissionContributorAnalysis = {
  login: string;
  rawLogin: string;
  source: string;
  profileUrl: string;
  id: number | string | null;
  accountType: string;
  resolutionStatus: "resolved" | "metadata_unavailable" | "unresolved";
  accountAgeDays: number | null;
  publicRepos: number | null;
  reviewSignals: string[];
  warnings: string[];
};

export type SubmissionContributionAnalysis = {
  schemaState: "not_checked" | "skipped" | "passed" | "failed";
  sourceState: "unknown" | "missing" | "needs_verification" | "provided";
  contentFiles: Array<{
    filename: string;
    status?: string;
    category?: string;
    slug?: string;
    sourceUrls?: string[];
    githubSources?: string[];
  }>;
  sourceUrls: string[];
  githubSourceRepos: Array<{
    fullName: string;
    url?: string;
    defaultBranch?: string;
    visibility?: string;
    archived?: boolean;
    disabled?: boolean;
    stargazersCount?: number | string | null;
    forksCount?: number | string | null;
  }>;
  capabilityRiskBuckets: string[];
  provenanceState: "not_applicable" | "passed" | "failed";
  maintainerActionItems: string[];
};

export type SubmissionPolicyGateStatus = "pass" | "warn" | "block";

export type SubmissionPolicyGate = {
  status: SubmissionPolicyGateStatus;
  summary: string;
  detail: string[];
};

export type SubmissionPolicyMatrix = Record<
  "schema" | "source" | "package" | "provenance" | "capability" | "quality",
  SubmissionPolicyGate
>;

export type SubmissionPolicyDecision =
  | "auto_import_eligible"
  | "maintainer_review"
  | "blocked";

export type SubmissionRiskReport = {
  schemaVersion: number;
  kind: "submission-risk";
  generatedAt: string;
  subject: Record<string, unknown>;
  provenanceStatus: "not_applicable" | "passed" | "failed";
  provenanceFindings: SubmissionProvenanceFinding[];
  contentProvenance: SubmissionContentProvenance[];
  effectiveContributor: SubmissionRiskContributor | null;
  contributorSource: string;
  contributorAnalysis: SubmissionContributorAnalysis;
  contributionAnalysis: SubmissionContributionAnalysis;
  pullRequestActor: SubmissionRiskContributor | null;
  riskTier: SubmissionRiskTier;
  reviewFlags: SubmissionRiskFlag[];
  trustSignals: string[];
  sourceUrls: string[];
  classificationWarnings: SubmissionClassificationWarning[];
  recommendedLabels: string[];
  recommendedAction:
    | "maintainer_review"
    | "request_author_input"
    | "block_until_resolved";
  policyMatrix: SubmissionPolicyMatrix;
  policyDecision: SubmissionPolicyDecision;
  requestChangesReasons: string[];
  humanReviewNotes: string[];
  labelDefinitions: Record<string, { color: string; description: string }>;
};

export type SubmissionQueueEntry = {
  number: number | null;
  title: string;
  url: string;
  author: string;
  updatedAt: string;
  bodyFingerprint: string;
  bodyUpdatedAt: string;
  authorCommentedAfterReview: boolean;
  authorCommentedWithoutBodyUpdate: boolean;
  lastAuthorCommentAt: string;
  labels: string[];
  recommendedLabels: string[];
  missingLabels: string[];
  status:
    | "import_ready"
    | "maintainer_review"
    | "needs_author_input"
    | "source_needs_verification"
    | "stale_reminder_due"
    | "close_eligible"
    | "skipped";
  nextAction:
    | "import"
    | "review_risk"
    | "verify_source"
    | "request_author_input"
    | "update_issue_body_required"
    | "send_stale_reminder"
    | "close_stale"
    | "skip";
  triageGroup:
    | "ready"
    | "blocked"
    | "needs_author_input"
    | "source_verification"
    | "likely_promo_spam"
    | "stale"
    | "close_eligible"
    | "maintainer_review"
    | "skipped";
  triageReason: string;
  staleState: "not_applicable" | "fresh" | "reminder_due" | "close_eligible";
  ageDays: number;
  sourceNeedsVerification: boolean;
  riskTier: SubmissionRiskTier;
  riskFlags: string[];
  riskSummary: string;
  policyMatrix: SubmissionPolicyMatrix;
  policyDecision: SubmissionPolicyDecision;
  autoImportEligible: boolean;
  contributorReview: string[];
  sourceState: SubmissionContributionAnalysis["sourceState"];
  maintainerActions: string[];
  riskRecommendedAction: string;
  actionDue:
    | ""
    | "author_input"
    | "update_issue_body"
    | "verify_source"
    | "remind"
    | "close";
  category: string;
  slug: string;
  name: string;
  sourceUrl: string;
  sourceUrls: string[];
  contributorContext: {
    login: string;
    profileUrl: string;
    resolutionStatus: string;
    accountAgeDays: number | null;
    publicRepos: number | null;
    signals: string[];
    warnings: string[];
  };
  policyReasons: Array<{
    name: string;
    status: string;
    summary: string;
    detail: string[];
  }>;
  errors: string[];
  warnings: string[];
  reviewChecklist: string[];
  commentDraft: string;
  importPath: string;
};

export type SubmissionQueue = {
  schemaVersion: number;
  kind: "submission-queue";
  generatedAt: string;
  count: number;
  summary: {
    ready: number;
    blocked: number;
    likelyPromoSpam: number;
    stale: number;
    importReady: number;
    maintainerReview: number;
    needsAuthorInput: number;
    sourceNeedsVerification: number;
    staleReminderDue: number;
    closeEligible: number;
    highRisk: number;
    needsChanges: number;
    skipped: number;
  };
  entries: SubmissionQueueEntry[];
};

export type JsonLdSnapshot = {
  key: string;
  category: string;
  slug: string;
  url: string;
  documents: JsonLdDocument[];
};

export type SearchDocument = {
  category: string;
  slug: string;
  title: string;
  seoTitle?: string;
  description: string;
  seoDescription?: string;
  tags: string[];
  keywords: string[];
  author: string;
  safetyNotes?: string[];
  privacyNotes?: string[];
  submittedBy?: string;
  submittedByUrl?: string;
  submittedAt?: string;
  submissionIssueNumber?: number;
  submissionIssueUrl?: string;
  importPrNumber?: number;
  importPrUrl?: string;
  reviewedBy?: string;
  reviewedAt?: string;
  claimStatus?: ClaimStatus;
  claimedBy?: string;
  claimedByUrl?: string;
  claimedAt?: string;
  brandName?: string;
  brandDomain?: string;
  brandIconUrl?: string;
  brandLogoUrl?: string;
  brandAssetSource?: string;
  dateAdded: string;
  installable: boolean;
  downloadUrl?: string;
  downloadTrust: DownloadTrust;
  verificationStatus: string;
  platforms?: string[];
  supportLevels?: string[];
  documentationUrl: string;
  repoUrl: string;
  repoStats?: RepoStats;
  url: string;
  canonicalUrl: string;
  llmsUrl: string;
  apiUrl: string;
  trustSignals: EntryTrustSignals;
};

export type ArtifactManifestV2 = {
  schemaVersion: number;
  kind?: string;
  generatedAt: string;
  totalEntries: number;
  categoryOrder: string[];
  categories: Record<string, { count: number; label: string }>;
  artifacts: Record<string, string>;
  routes?: Array<{
    key: string;
    category: string;
    slug: string;
    canonicalUrl: string;
    llmsUrl?: string;
    apiUrl?: string;
  }>;
  qualitySummary?: Record<string, unknown>;
  trustSummary?: Record<string, unknown>;
  artifactContracts?: Record<
    string,
    { path: string; type: string; sha256: string }
  >;
};

export type RegistryEnvelope<T> = {
  schemaVersion: number;
  kind?: string;
  generatedAt?: string;
  count?: number;
  entries: T[];
};

export const categorySpec: RegistryCategorySpec;
export const registryCategorySpec: RegistryCategorySpec;
export const ENTRY_SCHEMA_VERSION: number;
export const RAYCAST_SCHEMA_VERSION: number;
export const REGISTRY_ARTIFACT_SCHEMA_VERSION: number;
export const SITE_URL: string;
export const RAYCAST_COPY_PREVIEW_LIMIT: number;

export function compactCount(value: number): string;
export function parseAbbreviatedCount(value: unknown): number | null;
export function firstUsefulLine(value?: string | null): string;
export function extractConfigCommand(value?: string | null): string;
export function buildCollectionSequence(entry: Partial<DirectoryEntry>): string;
export function getPreviewLine(entry: Partial<DirectoryEntry>): string;
export function getCopyText(entry: Partial<DirectoryEntry>): string;
export function getDistributionBadges(
  entry: Partial<DirectoryEntry>,
): DistributionBadge[];
export function buildContentPromptArtifact(entries: ContentEntry[]): {
  schemaVersion: number;
  kind: string;
  generatedAt: string;
  count: number;
  prompts: ContentQualityPrompt[];
};
export function buildRegistryArtifactSet(
  entries: ContentEntry[],
  params?: {
    siteUrl?: string;
    siteName?: string;
    siteDescription?: string;
  },
): Array<
  | {
      path: string;
      type: "json";
      value: unknown;
    }
  | {
      path: string;
      type: "text";
      value: string;
    }
>;
export function buildSkillPlatformCompatibility(
  entry: ContentEntry,
): SkillPlatformCompatibility[];
export function buildEntryTrustSignals(
  entry: Partial<ContentEntry>,
): EntryTrustSignals;
export function buildRegistryTrustReport(
  entries: ContentEntry[],
): RegistryTrustReport;
export function buildCursorSkillAdapter(entry: ContentEntry): string;
export function summarizePlacementExpiry(
  placements: Array<Record<string, unknown>>,
  now?: Date | string,
  reminderWindowDays?: number,
): Array<{
  targetKind: string;
  targetKey: string;
  tier: CommercialTier;
  status: string;
  expiresAt: string;
  daysUntilExpiry: number | null;
  needsRenewalReminder: boolean;
  expired: boolean;
}>;
export function buildPlacementRenewalReminder(summary: {
  targetKind: string;
  targetKey: string;
  tier: CommercialTier;
  daysUntilExpiry: number | null;
  needsRenewalReminder: boolean;
}): string;
export const LISTING_LEAD_KINDS: string[];
export const COMMERCIAL_TIERS: string[];
export const PAID_JOB_TIERS: string[];
export const JOB_PUBLICATION_QUALITY_RULES: {
  summaryMinLength: number;
  descriptionMinLength: number;
  minimumResponsibilities: number;
  minimumRequirements: number;
  minimumBenefits: number;
};
export const JOB_PUBLIC_EXPOSURE_RULES: {
  summaryMinLength: number;
  detailMinLength: number;
  minimumResponsibilities: number;
  minimumRequirements: number;
};
export const COMMERCIAL_PLACEMENT_TARGETS: string[];
export const DISCLOSURE_STATES: string[];
export const COMMERCIAL_STATUSES: string[];
export function normalizeCommercialTier(value: unknown): CommercialTier;
export function normalizeLeadKind(value: unknown): ListingLeadKind;
export function normalizeDisclosure(value: unknown): Disclosure;
export function isPaidOrAffiliateDisclosure(value: unknown): boolean;
export function normalizePricingModel(value: unknown): string;
export function validateListingLeadPayload(payload: Record<string, unknown>): {
  ok: boolean;
  errors: string[];
  data: ListingLead;
};
export function validateJobPublicationQuality(
  payload: Record<string, unknown>,
): {
  ok: boolean;
  required: boolean;
  errors: string[];
};
export function validateJobPublicExposure(
  payload: Record<string, unknown>,
  options?: { sourceTruth?: JobSourceTruth },
): JobPublicExposureReport;
export function evaluateJobSourceLifecycle(
  input?: JobSourceLifecycleInput,
  now?: Date,
): JobSourceLifecycleResult;
export function normalizeCommercialStatus(value: unknown): string;
export function isPlacementActive(
  placement?: Record<string, unknown>,
  now?: Date | string,
): boolean;
export function linkRelForDisclosure(value: unknown): string;
export function toolPlacementRank(tool: Record<string, unknown>): number;
export function compareToolListings(
  left: Record<string, unknown>,
  right: Record<string, unknown>,
): number;
export function nextLeadStatus(currentStatus: unknown, action: unknown): string;

export function absoluteSiteUrl(siteUrl: string, path?: string): string;
export function buildOrganizationJsonLd(
  params?: Record<string, unknown>,
): JsonLdDocument;
export function buildWebsiteJsonLd(
  params?: Record<string, unknown>,
): JsonLdDocument;
export function buildSearchActionJsonLd(
  params?: Record<string, unknown>,
): JsonLdDocument;
export function buildWebPageJsonLd(
  params?: Record<string, unknown>,
): JsonLdDocument;
export function buildCollectionPageJsonLd(
  params?: Record<string, unknown>,
): JsonLdDocument;
export function buildBreadcrumbJsonLd(
  items: Array<{ name: string; url: string }>,
): JsonLdDocument;
export function buildItemListJsonLd(
  items: Array<{ name?: string; title?: string; url: string }>,
  params?: Record<string, unknown>,
): JsonLdDocument;
export function buildEntryJsonLd(
  entry: Partial<ContentEntry>,
  params?: Record<string, unknown>,
): JsonLdDocument;
export function buildToolSoftwareApplicationJsonLd(
  tool: Partial<ToolListing>,
  params?: Record<string, unknown>,
): JsonLdDocument | null;
export function buildJobPostingJsonLd(
  job: Record<string, unknown>,
  params?: Record<string, unknown>,
): JsonLdDocument | null;
export function buildEntryJsonLdSnapshot(
  entry: Partial<ContentEntry>,
  params?: Record<string, unknown>,
): JsonLdSnapshot;

export function generatedAtForEntries(entries: Partial<ContentEntry>[]): string;
export function buildDirectoryEntries(
  entries: ContentEntry[],
): DirectoryEntry[];
export function buildSearchEntries(entries: ContentEntry[]): SearchDocument[];
export function buildEntryDetail(entry: ContentEntry): Record<string, unknown>;
export function buildRaycastDetail(
  entry: ContentEntry,
): Record<string, unknown>;
export function buildRaycastEnvelope(
  entries: ContentEntry[],
): Record<string, unknown>;
export function buildArtifactHash(
  value: unknown,
  type?: "json" | "text",
): string;
export function buildReadOnlyEcosystemFeed(
  entries: ContentEntry[],
  params?: Record<string, unknown>,
): Record<string, unknown>;
export function buildMcpRegistryFeed(
  entries: ContentEntry[],
): Record<string, unknown>;
export function buildPluginExportFeed(
  entries: ContentEntry[],
): Record<string, unknown>;
export function buildRegistryChangelogFeed(
  entries: ContentEntry[],
): Record<string, unknown>;
export function buildArtifactEnvelope<T>(
  kind: string,
  entries: T[],
  extra?: Record<string, unknown>,
): RegistryEnvelope<T>;
export function buildEnvelopeEntries<T>(payload: RegistryEnvelope<T>): T[];
export function buildRegistryManifest(
  entries: ContentEntry[],
): ArtifactManifestV2;
export function buildArtifactManifestV2(
  entries: ContentEntry[],
  extra?: Record<string, unknown>,
): ArtifactManifestV2;
export function buildContentQualityArtifact(
  entries: ContentEntry[],
): Record<string, unknown>;
export function buildJsonLdSnapshots(
  entries: ContentEntry[],
  params?: Record<string, unknown>,
): Record<string, unknown>;
export function buildEntryLlmsArtifact(
  entry: ContentEntry,
  params?: Record<string, unknown>,
): string;
export function buildCorpusLlmsArtifact(
  entries: ContentEntry[],
  params?: Record<string, unknown>,
): string;
export const QUALITY_REPORT_SCHEMA_VERSION: number;
export const SOURCE_HEALTH_REPORT_SCHEMA_VERSION: number;
export const LLMS_ARTIFACT_SCHEMA_VERSION: number;
export const SUBMISSION_SPEC_SCHEMA_VERSION: number;

export type SourceHealthFreshness =
  | "fresh"
  | "aging"
  | "stale"
  | "dormant"
  | "unknown";

export type SourceHealthEntry = {
  key: string;
  category: string;
  slug: string;
  title: string;
  sourceStatus: "available" | "missing";
  sourceQuality: string;
  freshness: SourceHealthFreshness;
  ageDays: number | null;
  lastActivityAt: string;
  hasSafetyNotes: boolean;
  hasPrivacyNotes: boolean;
  packageTrust: DownloadTrust;
  packageVerified: boolean;
  hasPackageTrust: boolean;
  riskBearing: boolean;
  needsAttention: boolean;
  attentionReasons: string[];
};

export type SourceHealthReport = {
  schemaVersion: number;
  kind: "source-health-report";
  generatedAt: string;
  count: number;
  thresholds: {
    freshMaxDays: number;
    agingMaxDays: number;
    staleMaxDays: number;
  };
  summary: {
    sourceBackedCount: number;
    sourceBackedPercent: number;
    missingSourceCount: number;
    freshCount: number;
    agingCount: number;
    staleCount: number;
    dormantCount: number;
    unknownFreshnessCount: number;
    riskBearingCount: number;
    missingSafetyNotesCount: number;
    missingPrivacyNotesCount: number;
    packageTrustCount: number;
    packageTrustPercent: number;
    needsAttentionCount: number;
  };
  categoryBreakdown: Record<
    string,
    {
      count: number;
      sourceBacked: number;
      stale: number;
      missingSafetyNotes: number;
      missingPrivacyNotes: number;
      packageTrust: number;
      needsAttention: number;
    }
  >;
  entries: SourceHealthEntry[];
};

export function buildSourceProvenance(
  entry: Partial<ContentEntry>,
): SourceProvenance;
export function buildEntrySourceHealth(
  entry: Partial<ContentEntry>,
  referenceDate?: Date | string,
): SourceHealthEntry;
export function buildSourceHealthReport(
  entries: Partial<ContentEntry>[],
): SourceHealthReport;
export function buildEntryQuality(
  entry: Partial<ContentEntry>,
  referenceDate?: Date | string,
): EntryQualityReport;
export function findDuplicateBodyGroups(
  entries: Partial<ContentEntry>[],
): Array<Array<Record<string, unknown>>>;
export function buildContentQualityReport(
  entries: Partial<ContentEntry>[],
): Record<string, unknown>;
export function renderEntryLlms(
  entry: Partial<ContentEntry>,
  params?: Record<string, unknown>,
): string;
export function buildEntryCitationFacts(
  entry: Partial<ContentEntry>,
  params?: Record<string, unknown>,
): string;
export function renderCorpusLlms(
  entries: Partial<ContentEntry>[],
  params?: Record<string, unknown>,
): string;
export function buildSubmissionFieldModel(category: string): {
  schemaVersion: number;
  category: string;
  label: string;
  description: string;
  template?: string;
  fields: SubmissionFieldSpec[];
} | null;
export function buildIssueTemplateSpec(
  category: string,
): IssueTemplateSpec | null;
export function buildSubmissionSpecs(): Record<string, unknown>;
export const CATEGORY_SCHEMAS: Record<
  string,
  { required: string[]; recommended: string[] }
>;
export const FORBIDDEN_CONTENT_FIELDS: string[];
export function normalizeBody(body: string, category: string): string;
export function inferStructuredFields(
  data: Record<string, unknown>,
  body: string,
  category: string,
): Record<string, unknown>;
export function inferSectionBooleans(body?: string): {
  hasPrerequisites: boolean;
  hasTroubleshooting: boolean;
};
export function extractCodeBlocks(body: string): ContentCodeBlock[];
export function extractHeadings(body: string): ContentHeading[];
export function extractSections(
  body: string,
): Array<{ title: string; id: string; markdown: string }>;
export function headingId(text: string): string;
export function validateEntry(
  category: string,
  data: Record<string, unknown>,
  inferred?: Record<string, unknown>,
): Record<string, unknown>;

export const CORE_CATEGORIES: string[];
export const CATEGORY_REQUIREMENTS: Record<string, string[]>;
export const COMMON_REQUIRED_FIELDS: string[];
export const HEADING_KEY_MAP: Record<string, string>;
export function normalizeHeading(label: string): string;
export function normalizeValue(value: unknown): string;
export function slugify(value: unknown): string;
export function normalizeCategory(value: unknown): string;
export function parseIssueFormBody(body: string): Record<string, string>;
export function normalizeParsedFields(
  fields: Record<string, string>,
): Record<string, string>;
export function issueLabels(issue: Record<string, unknown>): string[];
export function looksLikeSubmissionIssue(
  issue: Record<string, unknown>,
): boolean;
export function isLikelyAffiliateUrl(value: unknown): boolean;
export function recommendedSubmissionLabels(
  issue: Record<string, unknown>,
  report?: SubmissionValidationReport,
): string[];
export function hasProtectedSubmissionLabel(
  issue?: Record<string, unknown>,
): boolean;
export function submissionSourceNeedsVerification(
  report: SubmissionValidationReport,
  issue?: Record<string, unknown>,
): boolean;
export function submissionAgeDays(
  issue?: Record<string, unknown>,
  options?: { now?: string },
): number;
export function submissionStaleState(
  issue?: Record<string, unknown>,
  report?: SubmissionValidationReport,
  options?: { now?: string },
): "not_applicable" | "fresh" | "reminder_due" | "close_eligible";
export function submissionQueueStatus(
  report: SubmissionValidationReport,
  issue?: Record<string, unknown>,
  options?: { now?: string },
): string;
export const SUBMISSION_BASE_LABELS: string[];
export const COMMUNITY_CATEGORY_LABELS: Record<string, string>;
export const SUBMISSION_NEEDS_AUTHOR_INPUT_LABEL: string;
export const SUBMISSION_SOURCE_NEEDS_VERIFICATION_LABEL: string;
export const SUBMISSION_STALE_LABEL: string;
export const SUBMISSION_AUTO_IMPORT_ELIGIBLE_LABEL: string;
export const SUBMISSION_RISK_LOW_LABEL: string;
export const SUBMISSION_RISK_MEDIUM_LABEL: string;
export const SUBMISSION_RISK_HIGH_LABEL: string;
export const SUBMISSION_PROTECTED_REVIEW_LABELS: string[];
export const SUBMISSION_MANAGED_VALIDATION_LABELS: string[];
export const SUBMISSION_RISK_LABELS: string[];
export const SUBMISSION_VALIDATION_LABEL_DEFINITIONS: Record<
  string,
  { color: string; description: string }
>;
export const SUBMISSION_RISK_LABEL_DEFINITIONS: Record<
  string,
  { color: string; description: string }
>;
export const SUBMISSION_STALE_POLICY: {
  reminderDays: number;
  closeDays: number;
};
export function submissionLabelsForCategory(category: string): string[];
export function recommendedLabelsForCategory(category: string): string[];
export function buildSubmissionQueue(
  issues: Array<Record<string, unknown>>,
  options?: { now?: string },
): SubmissionQueue;
export function submissionBodyFingerprint(
  issue?: Record<string, unknown>,
): string;
export function submissionBodyUpdatedAt(
  issue?: Record<string, unknown>,
): string;
export function submissionActivityState(issue?: Record<string, unknown>): {
  bodyFingerprint: string;
  bodyUpdatedAt: string;
  lastAuthorCommentAt: string;
  authorCommentedAfterReview: boolean;
  authorCommentedWithoutBodyUpdate: boolean;
};
export function validateSubmission(
  issue: Record<string, unknown>,
): SubmissionValidationReport;
export const SUBMISSION_RISK_SCHEMA_VERSION: number;
export const SUBMISSION_RISK_COMMENT_MARKER: string;
export function analyzeIssueSubmissionRisk(
  issue?: Record<string, unknown>,
  validationReport?: SubmissionValidationReport | null,
  options?: {
    contributor?: Record<string, unknown>;
    githubSourceRepositories?: Array<Record<string, unknown>>;
    sourceRepositories?: Array<Record<string, unknown>>;
  },
): SubmissionRiskReport;
export function analyzeDirectContentRisk(
  input?: Record<string, unknown>,
): SubmissionRiskReport;
export function formatSubmissionRiskMarkdown(
  report: SubmissionRiskReport,
): string;
export function directContentRequestChangesReasons(
  report: SubmissionRiskReport,
): string[];
