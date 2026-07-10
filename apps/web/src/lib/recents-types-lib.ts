// Shared recents/saved-search/follow types, split out of the recents provider so
// pure helpers can depend on them without importing the React module.
// `@/lib/recents` re-exports these, so existing importers stay unchanged.

export interface RecentEntry {
  category: string;
  slug: string;
  title: string;
  visitedAt: string;
}

export type AlertChannel = "inapp" | "email" | "rss";
export type AlertCadence = "instant" | "daily" | "weekly";

export interface AlertSchedule {
  enabled: boolean;
  channels: AlertChannel[];
  cadence: AlertCadence;
  email?: string;
  lastNotifiedAt?: string;
}

export interface SavedSearch {
  id: string;
  label: string;
  q: string;
  category?: string;
  trust?: string;
  source?: string;
  signal?: string;
  platform?: string;
  sort?: string;
  savedAt: string;
  alerts?: AlertSchedule;
}

export interface Follow {
  id: string; // local id
  label: string; // display label (rename-able)
  followId: string; // e.g. "category:mcp"
  source?: string;
  email?: string;
  segmentId?: string; // resolved Resend segment id (optional)
  createdAt: string;
}

export interface Segment {
  id: string; // Resend segment id or follow id
  label: string;
  email: string;
  subscribedAt: string;
}

/** The whole persisted recents payload. */
export interface RecentsState {
  entries: RecentEntry[];
  saved: SavedSearch[];
  follows: Follow[];
  segments: Segment[];
}
