/**
 * Pure entry signals panel navigation analytics helpers.
 *
 * Maps upvote and community-signal toggles to privacy-light event names
 * without embedding free-text reasons or client identifiers.
 */

export const ENTRY_SIGNALS_PANEL_SURFACE = "entry-signals-panel";

export type EntrySignalsCommunityType = "used" | "works" | "broken";

export function entrySignalsEntryKey(category: string, slug: string): string {
  return `${category}/${slug}`;
}

export function entrySignalsVoteAnalyticsEvent(): string {
  return "entry_signals_vote_click";
}

export function entrySignalsVoteAnalyticsData(
  category: string,
  slug: string,
  voted: boolean,
  voteCount: number,
) {
  return {
    surface: ENTRY_SIGNALS_PANEL_SURFACE,
    entry: entrySignalsEntryKey(category, slug),
    voted,
    voteCount,
  };
}

export function entrySignalsCommunityAnalyticsEvent(): string {
  return "entry_signals_community_click";
}

export function entrySignalsCommunityAnalyticsData(
  category: string,
  slug: string,
  signalType: EntrySignalsCommunityType,
  active: boolean,
) {
  return {
    surface: ENTRY_SIGNALS_PANEL_SURFACE,
    entry: entrySignalsEntryKey(category, slug),
    signalType,
    active,
  };
}
