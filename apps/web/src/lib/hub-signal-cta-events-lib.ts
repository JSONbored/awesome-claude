/**
 * Pure hub signal-stat navigation analytics helpers.
 *
 * Maps hub coverage bars to privacy-light browse egress without embedding
 * hub titles or free-form labels beyond stable stat keys.
 */

export type HubSignalSurface = "category-hub" | "platform-hub" | "tag-hub" | "platform-category";

export type HubSignalStatKey = "trusted" | "sourced" | "safety" | "privacy" | "reviewed";

export type HubSignalBrowseSearch = {
  category?: string;
  platform?: string;
  q?: string;
  trust?: string;
  signal?: string;
};

export function hubSignalStatAnalyticsEvent(): string {
  return "hub_signal_stat_click";
}

export function hubSignalStatAnalyticsData(
  surface: HubSignalSurface,
  statKey: string,
  count: number,
  pct: number,
) {
  return {
    surface,
    statKey,
    count,
    pct,
  };
}

export function hubStatBrowseSearch(
  statKey: string,
  base: { category?: string; platform?: string; q?: string } = {},
): HubSignalBrowseSearch | null {
  switch (statKey) {
    case "trusted":
      return { ...base, trust: "trusted" };
    case "sourced":
      return { ...base, signal: "source-backed" };
    case "safety":
      return { ...base, signal: "safety-notes" };
    case "privacy":
      return { ...base, signal: "privacy-notes" };
    case "reviewed":
      return { ...base, signal: "reviewed" };
    default:
      return null;
  }
}

export type HubSignalStatDestination = { to: "/browse"; search: HubSignalBrowseSearch };

/** Map a hub signal stat key to a directory browse destination. */
export function hubSignalStatDestination(
  statKey: string,
  base: { category?: string; platform?: string; q?: string } = {},
): HubSignalStatDestination | null {
  const search = hubStatBrowseSearch(statKey, base);
  if (!search) return null;
  return { to: "/browse", search };
}
