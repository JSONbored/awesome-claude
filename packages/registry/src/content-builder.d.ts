import type { ContentEntry, SkillPlatformCompatibility } from "./index.js";

export const DEFAULT_DIRECTORY_REPO_URL: string;
export function buildGitHubUrl(filePath: string, repoRoot: string): string;
export function parseGitHubRepo(repoUrl?: string | null): {
  owner: string;
  repo: string;
  key: string;
  url: string;
} | null;
export function normalizeDownloadUrl(downloadUrl?: string | null): string;
export function normalizeDateAdded(value: unknown): string | undefined;
export function normalizeTextField(value: unknown): string | undefined;
export function normalizeStringList(value: unknown): string[] | undefined;
export function normalizeDateTimeField(value: unknown): string | undefined;
export function normalizePositiveInteger(value: unknown): number | undefined;
export function normalizeClaimStatus(
  value: unknown,
): "unclaimed" | "pending" | "verified" | undefined;
export function buildProvenanceFields(data?: Record<string, unknown>): {
  submittedBy: string | undefined;
  submittedByUrl: string | undefined;
  submittedAt: string | undefined;
  sourceSubmissionNumber: number | undefined;
  sourceSubmissionUrl: string | undefined;
  importPrNumber: number | undefined;
  importPrUrl: string | undefined;
  reviewedBy: string | undefined;
  reviewedAt: string | undefined;
  claimStatus: "unclaimed" | "pending" | "verified" | undefined;
  claimedBy: string | undefined;
  claimedByUrl: string | undefined;
  claimedAt: string | undefined;
};
export function isFirstPartyPackage(data?: Record<string, unknown>): boolean;
export function isLocalDownloadUrl(downloadUrl?: string | null): boolean;
export function localDownloadSourcePath(
  downloadUrl: string,
  contentRoot: string,
): string | null;
export function buildDefaultSkillPlatformCompatibility(
  data: Record<string, unknown>,
  inferred: Record<string, unknown>,
): SkillPlatformCompatibility[];
export function normalizePlatformCompatibility(
  value: unknown,
  data: Record<string, unknown>,
  inferred: Record<string, unknown>,
): SkillPlatformCompatibility[];
export function buildContentEntryFromMdx(params: {
  category: string;
  fileName: string;
  filePath: string;
  source: string;
  repoRoot: string;
  contentRoot: string;
  contentUpdatedAt?: string;
  getLocalDownloadSha256?: (localDownloadPath: string) => string | null;
}): ContentEntry;
