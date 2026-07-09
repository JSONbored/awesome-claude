// Shared watch/alert types, split out of the watch provider so pure helpers can
// depend on them without importing the React module (and creating a cycle).
// `@/lib/watch` re-exports these, so existing importers stay unchanged.

export type WatchKind = "entry" | "validator" | "changelog-stream" | "integration" | "saved-search";

export interface WatchTarget {
  id: string;
  kind: WatchKind;
  label: string;
  href?: string;
  addedAt: string;
}

export type AlertSeverity = "info" | "warning" | "blocker";

export interface Alert {
  id: string;
  targetId: string;
  kind: WatchKind;
  title: string;
  body: string;
  severity: AlertSeverity;
  href?: string;
  date: string;
}
