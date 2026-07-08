// Pure helpers for turning raw registry feed events into watch identifiers and
// detail links, split out of the watch hook module so the entry-event guards
// and encoding can be unit-tested without the React context.

export interface RegistryEvent {
  id?: string;
  kind?: string;
  category?: string;
  slug?: string;
  action?: string;
  date?: string;
  title?: string;
  commit?: string;
}

/** Stable watch-target id for an entry event, or null for non-entry events. */
export function eventTargetId(event: RegistryEvent): string | null {
  if (event.kind === "entry" && event.category && event.slug) {
    return `entry:${event.category}/${event.slug}`;
  }
  return null;
}

/** Data URL for an entry event's detail JSON, or null for non-entry events. */
export function entryDetailUrl(event: RegistryEvent): string | null {
  if (event.kind !== "entry" || !event.category || !event.slug) return null;
  return `/data/entries/${encodeURIComponent(event.category)}/${encodeURIComponent(event.slug)}.json`;
}
