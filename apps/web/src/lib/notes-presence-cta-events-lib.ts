/**
 * Pure notes-presence chip navigation analytics helpers.
 *
 * Maps safety/privacy presence chips to privacy-light browse egress without
 * embedding note copy.
 */

export const NOTES_PRESENCE_SURFACE = "notes-presence";

export type NotesPresenceSurface =
  | typeof NOTES_PRESENCE_SURFACE
  | "compare-table"
  | "compare-drawer"
  | "category-ranking"
  | "peek-panel"
  | "compare-tray"
  | "trending-list"
  | "browse-card"
  | "browse-grid"
  | "browse-row"
  | "browse-compact"
  | "home-recent"
  | "home-popular"
  | "home-newest"
  | "home-compare-rail"
  | "category-hub"
  | "tag-hub"
  | "best-index"
  | "best-collection"
  | "platform-hub"
  | "platform-category"
  | "detail-related"
  | "detail-guides"
  | "contributor-profile";

export type NotesPresenceKind = "safety" | "privacy";

export function notesPresenceAnalyticsEvent(): string {
  return "notes_presence_chip_click";
}

export function notesPresenceAnalyticsData(
  noteKind: NotesPresenceKind,
  present: boolean,
  surface: string = NOTES_PRESENCE_SURFACE,
) {
  return {
    surface,
    noteKind,
    present,
  };
}

/** Map a present notes chip to a browse `signal` search patch. */
export function notesPresenceBrowseSearch(
  noteKind: string,
  present: boolean,
): { signal: string } | null {
  if (!present) return null;
  switch (noteKind) {
    case "safety":
      return { signal: "safety-notes" };
    case "privacy":
      return { signal: "privacy-notes" };
    default:
      return null;
  }
}

export type NotesPresenceBrowseDestination = { to: "/browse"; search: { signal: string } };

/** Map a present notes chip to a directory browse destination. */
export function notesPresenceBrowseDestination(
  noteKind: string,
  present: boolean,
): NotesPresenceBrowseDestination | null {
  const search = notesPresenceBrowseSearch(noteKind, present);
  if (!search) return null;
  return { to: "/browse", search };
}
