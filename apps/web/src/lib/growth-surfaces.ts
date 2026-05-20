import "server-only";

import { cache } from "react";

import { getDirectoryEntries } from "@/lib/content";
import {
  entryCommunityTarget,
  safeCommunitySignalCounts,
} from "@/lib/community-signals";
import { communityDiscoveryScore } from "@/lib/growth-ranking";
import { safeIntentEventCounts } from "@/lib/intent-events";
import { safeVoteCounts } from "@/lib/votes";

type GrowthEntry = Awaited<ReturnType<typeof getDirectoryEntries>>[number];

const DAY_MS = 24 * 60 * 60 * 1000;

function entryKey(entry: GrowthEntry) {
  return `${entry.category}:${entry.slug}`;
}

function signalTarget(entry: GrowthEntry) {
  return entryCommunityTarget(entry.category, entry.slug);
}

function dateValue(value?: string | null) {
  if (!value) return 0;
  const parsed = Date.parse(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function latestEntryDate(entries: GrowthEntry[], field: keyof GrowthEntry) {
  return entries.reduce((latest, entry) => {
    const value = entry[field];
    return Math.max(latest, typeof value === "string" ? dateValue(value) : 0);
  }, 0);
}

function recentVerificationDate(entry: GrowthEntry) {
  return (
    entry.trustSignals?.lastVerifiedAt ||
    entry.verifiedAt ||
    entry.reviewedAt ||
    entry.repoUpdatedAt ||
    entry.dateAdded ||
    ""
  );
}

function hasInstallSurface(entry: GrowthEntry) {
  return Boolean(
    entry.installCommand || entry.downloadUrl || entry.configSnippet,
  );
}

function isSourceBacked(entry: GrowthEntry) {
  return entry.trustSignals?.sourceStatus === "available";
}

function hasSafeInstallSignal(entry: GrowthEntry) {
  return (
    entry.downloadTrust === "first-party" ||
    entry.packageVerified === true ||
    (isSourceBacked(entry) && !entry.downloadUrl)
  );
}

export const getGrowthSurfaces = cache(async () => {
  const entries = await getDirectoryEntries();
  const entryKeys = entries.map(entryKey);
  const communityTargets = entries.map((entry) => ({
    targetKind: "entry" as const,
    targetKey: signalTarget(entry),
  }));
  const [voteState, communityState, intentState] = await Promise.all([
    safeVoteCounts(entryKeys),
    safeCommunitySignalCounts(communityTargets),
    safeIntentEventCounts(entryKeys),
  ]);
  const newest = [...entries]
    .filter((entry) => entry.dateAdded)
    .sort((left, right) =>
      String(right.dateAdded).localeCompare(String(left.dateAdded)),
    )
    .slice(0, 12);
  const latestDateAdded = latestEntryDate(entries, "dateAdded");
  const newThisWeek = [...entries]
    .filter((entry) => {
      const added = dateValue(entry.dateAdded);
      return added > 0 && latestDateAdded - added <= 7 * DAY_MS;
    })
    .sort((left, right) =>
      String(right.dateAdded).localeCompare(String(left.dateAdded)),
    )
    .slice(0, 12);
  const recentlyUpdated = [...entries]
    .filter((entry) => entry.repoUpdatedAt)
    .sort((left, right) =>
      String(right.repoUpdatedAt).localeCompare(String(left.repoUpdatedAt)),
    )
    .slice(0, 12);
  const recentlyVerified = [...entries]
    .filter(
      (entry) =>
        isSourceBacked(entry) ||
        entry.packageVerified === true ||
        Boolean(entry.reviewedBy || entry.claimStatus === "verified"),
    )
    .sort(
      (left, right) =>
        dateValue(recentVerificationDate(right)) -
        dateValue(recentVerificationDate(left)),
    )
    .slice(0, 12);
  const sourceBacked = [...entries]
    .filter(isSourceBacked)
    .sort((left, right) => {
      const starDelta = (right.githubStars ?? 0) - (left.githubStars ?? 0);
      if (starDelta !== 0) return starDelta;
      return String(right.dateAdded ?? "").localeCompare(
        String(left.dateAdded ?? ""),
      );
    })
    .slice(0, 12);
  const safeInstall = [...entries]
    .filter((entry) => hasInstallSurface(entry) && hasSafeInstallSignal(entry))
    .sort((left, right) => {
      const rightScore =
        (right.downloadTrust === "first-party" ? 40 : 0) +
        (right.packageVerified === true ? 25 : 0) +
        (isSourceBacked(right) ? 15 : 0) +
        (right.verificationStatus === "production" ? 10 : 0);
      const leftScore =
        (left.downloadTrust === "first-party" ? 40 : 0) +
        (left.packageVerified === true ? 25 : 0) +
        (isSourceBacked(left) ? 15 : 0) +
        (left.verificationStatus === "production" ? 10 : 0);
      if (rightScore !== leftScore) return rightScore - leftScore;
      return String(right.dateAdded ?? "").localeCompare(
        String(left.dateAdded ?? ""),
      );
    })
    .slice(0, 12);
  const popularBySourceSignals = [...entries]
    .filter(
      (entry) => typeof entry.githubStars === "number" && entry.githubStars > 0,
    )
    .sort((left, right) => (right.githubStars ?? 0) - (left.githubStars ?? 0))
    .slice(0, 12);
  const practicalPicks = [...entries]
    .filter(
      (entry) =>
        Boolean(
          entry.installCommand || entry.downloadUrl || entry.configSnippet,
        ) && Boolean(entry.dateAdded),
    )
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
    .slice(0, 12);
  const communityTrending = [...entries]
    .map((entry) => ({
      entry,
      score: communityDiscoveryScore({
        communitySignals: communityState.counts[signalTarget(entry)],
        intentCounts: intentState.counts[entryKey(entry)],
        votes: voteState.counts[entryKey(entry)] ?? 0,
        firstPartyPackage: entry.downloadTrust === "first-party",
        productionVerified: entry.verificationStatus === "production",
      }),
    }))
    .filter((item) => item.score > 0)
    .sort(
      (left, right) =>
        right.score - left.score ||
        String(right.entry.dateAdded).localeCompare(
          String(left.entry.dateAdded),
        ),
    )
    .slice(0, 12)
    .map((item) => item.entry);

  return {
    newest,
    newThisWeek: newThisWeek.length ? newThisWeek : newest,
    recentlyUpdated,
    recentlyVerified,
    sourceBacked,
    safeInstall,
    popularBySourceSignals,
    practicalPicks,
    communityTrending,
    communitySignals: communityState.counts,
    communitySignalsAvailable: communityState.available,
    voteCounts: voteState.counts,
    votesAvailable: voteState.available,
    intentCounts: intentState.counts,
    intentEventsAvailable: intentState.available,
  };
});
