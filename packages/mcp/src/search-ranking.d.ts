export type RegistrySearchDocumentLike = {
  category?: string;
  slug?: string;
  title?: string;
  description?: string;
  cardDescription?: string;
  author?: string;
  submittedBy?: string;
  brandName?: string;
  brandDomain?: string;
  verificationStatus?: string;
  downloadTrust?: "first-party" | "external" | "none" | string | null;
  trust?: string;
  source?: string;
  safetyNotes?: string | string[];
  privacyNotes?: string | string[];
  platforms?: string[];
  supportLevels?: string[];
  mcpInstallTargets?: string[];
  tags?: string[];
  keywords?: string[];
  installable?: boolean;
  downloadUrl?: string;
  installCommand?: string;
  configSnippet?: string;
  claimStatus?: string;
  reviewedBy?: string;
  documentationUrl?: string;
  docsUrl?: string;
  repoUrl?: string;
  githubUrl?: string;
  sourceUrl?: string;
  dateAdded?: string;
  trustSignals?: {
    hasSafetyNotes?: boolean;
    hasPrivacyNotes?: boolean;
    packageVerified?: boolean;
    sourceStatus?: string;
  };
};

export type RankedRegistrySearchEntry<T extends RegistrySearchDocumentLike> = {
  entry: T;
  index: number;
  score: number;
  reasons: string[];
};

export function normalizeRegistrySearchQuery(query: unknown): string;
export function tokenizeRegistrySearchQuery(query: unknown): string[];
export function normalizeRegistryPlatform(value: unknown): string;
export function normalizedRegistrySearchText(
  entry: RegistrySearchDocumentLike,
): string;
export function matchesRegistryQuery(
  entry: RegistrySearchDocumentLike,
  query: unknown,
): boolean;
export function matchesRegistryPlatform(
  entry: RegistrySearchDocumentLike,
  platform: unknown,
): boolean;
export function entryHasSafetyNotes(entry: RegistrySearchDocumentLike): boolean;
export function entryHasPrivacyNotes(
  entry: RegistrySearchDocumentLike,
): boolean;
export function entryIsInstallable(entry: RegistrySearchDocumentLike): boolean;
export function entryPackageTrustValue(
  entry: RegistrySearchDocumentLike,
): string;
export function entrySourceStatusValue(
  entry: RegistrySearchDocumentLike,
): string;
export function entryClaimStatusValue(
  entry: RegistrySearchDocumentLike,
): string;
export function scoreRegistrySearchEntry(
  entry: RegistrySearchDocumentLike,
  query: unknown,
): { score: number; reasons: string[] };
export function rankRegistrySearchEntries<T extends RegistrySearchDocumentLike>(
  entries: ReadonlyArray<T>,
  query: unknown,
): RankedRegistrySearchEntry<T>[];
