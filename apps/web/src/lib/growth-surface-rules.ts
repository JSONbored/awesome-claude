export type GrowthSurfaceEntry = {
  category?: string;
  slug?: string;
  dateAdded?: string | null;
  repoUpdatedAt?: string | null;
  reviewedAt?: string | null;
  verifiedAt?: string | null;
  githubStars?: number | null;
  installCommand?: string | null;
  downloadUrl?: string | null;
  configSnippet?: string | null;
  downloadTrust?: string | null;
  packageVerified?: boolean | null;
  verificationStatus?: string | null;
  trustSignals?: {
    sourceStatus?: string | null;
    lastVerifiedAt?: string | null;
  } | null;
  reviewedBy?: string | null;
  claimStatus?: string | null;
};

const DAY_MS = 24 * 60 * 60 * 1000;

function dateValue(value?: string | null) {
  if (!value) return 0;
  const parsed = Date.parse(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function latestEntryDate<T extends GrowthSurfaceEntry>(
  entries: T[],
  field: keyof T,
) {
  return entries.reduce((latest, entry) => {
    const value = entry[field];
    return Math.max(latest, typeof value === "string" ? dateValue(value) : 0);
  }, 0);
}

function recentVerificationDate(entry: GrowthSurfaceEntry) {
  return (
    entry.trustSignals?.lastVerifiedAt ||
    entry.verifiedAt ||
    entry.reviewedAt ||
    entry.repoUpdatedAt ||
    entry.dateAdded ||
    ""
  );
}

export function isSourceBackedEntry(entry: GrowthSurfaceEntry) {
  return entry.trustSignals?.sourceStatus === "available";
}

export function hasInstallSurface(entry: GrowthSurfaceEntry) {
  return Boolean(
    entry.installCommand || entry.downloadUrl || entry.configSnippet,
  );
}

export function hasSafeInstallSignal(entry: GrowthSurfaceEntry) {
  return (
    entry.downloadTrust === "first-party" ||
    entry.packageVerified === true
  );
}

function safeInstallScore(entry: GrowthSurfaceEntry) {
  return (
    (entry.downloadTrust === "first-party" ? 40 : 0) +
    (entry.packageVerified === true ? 25 : 0) +
    (isSourceBackedEntry(entry) ? 15 : 0) +
    (entry.verificationStatus === "production" ? 10 : 0)
  );
}

export function buildDiscoverySurfaceLists<T extends GrowthSurfaceEntry>(
  entries: T[],
  options: { limit?: number } = {},
) {
  const limit = options.limit ?? 12;
  const newest = [...entries]
    .filter((entry) => entry.dateAdded)
    .sort((left, right) =>
      String(right.dateAdded).localeCompare(String(left.dateAdded)),
    )
    .slice(0, limit);
  const latestDateAdded = latestEntryDate(entries, "dateAdded");
  const newThisWeek = [...entries]
    .filter((entry) => {
      const added = dateValue(entry.dateAdded);
      return added > 0 && latestDateAdded - added <= 7 * DAY_MS;
    })
    .sort((left, right) =>
      String(right.dateAdded).localeCompare(String(left.dateAdded)),
    )
    .slice(0, limit);
  const recentlyUpdated = [...entries]
    .filter((entry) => entry.repoUpdatedAt)
    .sort((left, right) =>
      String(right.repoUpdatedAt).localeCompare(String(left.repoUpdatedAt)),
    )
    .slice(0, limit);
  const recentlyVerified = [...entries]
    .filter(
      (entry) =>
        isSourceBackedEntry(entry) ||
        entry.packageVerified === true ||
        Boolean(entry.reviewedBy || entry.claimStatus === "verified"),
    )
    .sort(
      (left, right) =>
        dateValue(recentVerificationDate(right)) -
        dateValue(recentVerificationDate(left)),
    )
    .slice(0, limit);
  const sourceBacked = [...entries]
    .filter(isSourceBackedEntry)
    .sort((left, right) => {
      const starDelta = (right.githubStars ?? 0) - (left.githubStars ?? 0);
      if (starDelta !== 0) return starDelta;
      return String(right.dateAdded ?? "").localeCompare(
        String(left.dateAdded ?? ""),
      );
    })
    .slice(0, limit);
  const safeInstall = [...entries]
    .filter((entry) => hasInstallSurface(entry) && hasSafeInstallSignal(entry))
    .sort((left, right) => {
      const scoreDelta = safeInstallScore(right) - safeInstallScore(left);
      if (scoreDelta !== 0) return scoreDelta;
      return String(right.dateAdded ?? "").localeCompare(
        String(left.dateAdded ?? ""),
      );
    })
    .slice(0, limit);
  const popularBySourceSignals = [...entries]
    .filter(
      (entry) => typeof entry.githubStars === "number" && entry.githubStars > 0,
    )
    .sort((left, right) => (right.githubStars ?? 0) - (left.githubStars ?? 0))
    .slice(0, limit);
  const practicalPicks = [...entries]
    .filter((entry) => hasInstallSurface(entry) && Boolean(entry.dateAdded))
    .sort((left, right) => {
      const rightScore =
        (right.githubStars ?? 0) +
        (right.downloadTrust === "first-party" ? 25 : 0) +
        (right.verificationStatus === "production" ? 20 : 0);
      const leftScore =
        (left.githubStars ?? 0) +
        (left.downloadTrust === "first-party" ? 25 : 0) +
        (left.verificationStatus === "production" ? 20 : 0);
      if (rightScore !== leftScore) return rightScore - leftScore;
      return String(right.dateAdded).localeCompare(String(left.dateAdded));
    })
    .slice(0, limit);

  return {
    newest,
    newThisWeek: newThisWeek.length ? newThisWeek : newest,
    recentlyUpdated,
    recentlyVerified,
    sourceBacked,
    safeInstall,
    popularBySourceSignals,
    practicalPicks,
  };
}
