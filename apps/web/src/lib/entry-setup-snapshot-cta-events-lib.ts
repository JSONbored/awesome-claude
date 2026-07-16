/**
 * Pure entry setup snapshot tile analytics helpers.
 *
 * Maps setup-at-a-glance tile navigation to privacy-light event names without
 * embedding titles, install commands, or prerequisite copy.
 */

export const ENTRY_SETUP_SNAPSHOT_SURFACE = "detail-setup-snapshot";

export type EntrySetupSnapshotTileId =
  | "install"
  | "config"
  | "copy"
  | "prerequisites"
  | "platforms"
  | "difficulty"
  | "install-type";

export type EntrySetupSnapshotDestination = "entry-command-center" | "prerequisites";

export function entrySetupSnapshotEntryKey(category: string, slug: string): string {
  return `${category}/${slug}`;
}

export function entrySetupSnapshotAnalyticsEvent(): string {
  return "detail_setup_snapshot_click";
}

export function entrySetupSnapshotAnalyticsData(
  category: string,
  slug: string,
  tileId: EntrySetupSnapshotTileId,
  destination: EntrySetupSnapshotDestination,
) {
  return {
    entry: entrySetupSnapshotEntryKey(category, slug),
    surface: ENTRY_SETUP_SNAPSHOT_SURFACE,
    tileId,
    destination,
  };
}
