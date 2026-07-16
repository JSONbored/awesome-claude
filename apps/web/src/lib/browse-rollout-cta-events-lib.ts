/**
 * Pure browse rollout signals panel analytics helpers.
 *
 * Maps flagged-entry navigation from the rollout signal scan to privacy-light
 * event names without embedding entry titles or missing-signal labels.
 */

export const BROWSE_ROLLOUT_SIGNALS_SURFACE = "browse-rollout-signals";

export function browseRolloutFlaggedEntryAnalyticsEvent(): string {
  return "browse_rollout_flagged_entry_click";
}

export function browseRolloutFlaggedEntryAnalyticsData(
  entryRef: string,
  missingRequiredCount: number,
  signalCoveragePercent: number,
) {
  return {
    surface: BROWSE_ROLLOUT_SIGNALS_SURFACE,
    entry: entryRef,
    missingRequiredCount,
    signalCoveragePercent,
  };
}

export function parseBrowseRolloutEntryRef(
  entryRef: string,
): { category: string; slug: string } | null {
  const slash = entryRef.indexOf("/");
  if (slash <= 0 || slash >= entryRef.length - 1) {
    return null;
  }
  return {
    category: entryRef.slice(0, slash),
    slug: entryRef.slice(slash + 1),
  };
}

export function browseRolloutSignalRowAnalyticsEvent(): string {
  return "browse_rollout_signal_row_click";
}

export function browseRolloutSignalRowAnalyticsData(
  signalId: string,
  tone: string,
  coveragePercent: number,
  scannedCount: number,
) {
  return {
    surface: BROWSE_ROLLOUT_SIGNALS_SURFACE,
    signalId,
    tone,
    coveragePercent,
    scannedCount,
  };
}

/** Map rollout row ids to browse `signal` (or `source`) search values. */
export function browseRolloutSignalSearch(
  signalId: string,
): { signal?: string; source?: string } | null {
  switch (signalId) {
    case "source":
      return { signal: "source-backed" };
    case "reviewed":
      return { signal: "reviewed" };
    case "safety":
      return { signal: "safety-notes" };
    case "privacy":
      return { signal: "privacy-notes" };
    case "package":
      return { signal: "trusted-package" };
    default:
      return null;
  }
}
