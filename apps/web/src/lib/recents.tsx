import * as React from "react";

const STORAGE_KEY = "hc.recents.v1";
const MAX_RECENT = 8;

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

interface State {
  entries: RecentEntry[];
  saved: SavedSearch[];
  follows: Follow[];
  segments: Segment[];
}

interface RecentsCtx extends State {
  pushEntry: (e: Omit<RecentEntry, "visitedAt">) => void;
  saveSearch: (s: Omit<SavedSearch, "id" | "savedAt">) => void;
  renameSaved: (id: string, label: string) => void;
  removeSaved: (id: string) => void;
  updateSavedAlerts: (id: string, alerts: AlertSchedule) => void;
  toggleSavedAlerts: (id: string, enabled: boolean) => void;
  addFollow: (f: Omit<Follow, "id" | "createdAt">) => void;
  renameFollow: (id: string, label: string) => void;
  removeFollow: (id: string) => void;
  addSegment: (s: Omit<Segment, "subscribedAt">) => void;
  removeSegment: (id: string) => void;
  clearRecent: () => void;
}

const Ctx = React.createContext<RecentsCtx | null>(null);

function load(): State {
  const empty: State = { entries: [], saved: [], follows: [], segments: [] };
  if (typeof window === "undefined") return empty;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return empty;
    const p = JSON.parse(raw) as Partial<State>;
    return {
      entries: Array.isArray(p.entries) ? p.entries : [],
      saved: Array.isArray(p.saved) ? p.saved : [],
      follows: Array.isArray(p.follows) ? p.follows : [],
      segments: Array.isArray(p.segments) ? p.segments : [],
    };
  } catch {
    return empty;
  }
}

function save(s: State) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(s));
  } catch {
    /* noop */
  }
}

export function RecentsProvider({ children }: { children: React.ReactNode }) {
  const [hydrated, setHydrated] = React.useState(false);
  const [entries, setEntries] = React.useState<RecentEntry[]>([]);
  const [saved, setSaved] = React.useState<SavedSearch[]>([]);
  const [follows, setFollows] = React.useState<Follow[]>([]);
  const [segments, setSegments] = React.useState<Segment[]>([]);

  React.useEffect(() => {
    const s = load();
    setEntries(s.entries);
    setSaved(s.saved);
    setFollows(s.follows);
    setSegments(s.segments);
    setHydrated(true);
  }, []);

  const echoSuppress = React.useRef(false);
  React.useEffect(() => {
    if (!hydrated) return;
    if (echoSuppress.current) {
      echoSuppress.current = false;
      return;
    }
    save({ entries, saved, follows, segments });
  }, [entries, saved, follows, segments, hydrated]);

  // Cross-tab sync: another tab wrote to localStorage — re-hydrate without echoing back.
  React.useEffect(() => {
    if (!hydrated) return;
    const onStorage = (e: StorageEvent) => {
      if (e.key !== STORAGE_KEY) return;
      const s = load();
      echoSuppress.current = true;
      setEntries(s.entries);
      setSaved(s.saved);
      setFollows(s.follows);
      setSegments(s.segments);
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, [hydrated]);

  const value = React.useMemo<RecentsCtx>(
    () => ({
      entries,
      saved,
      follows,
      segments,
      pushEntry: (e) =>
        setEntries((cur) => {
          const without = cur.filter((x) => !(x.category === e.category && x.slug === e.slug));
          return [{ ...e, visitedAt: new Date().toISOString() }, ...without].slice(0, MAX_RECENT);
        }),
      saveSearch: (s) =>
        setSaved((cur) =>
          [{ ...s, id: `s-${Date.now()}`, savedAt: new Date().toISOString() }, ...cur].slice(0, 12),
        ),
      renameSaved: (id, label) =>
        setSaved((cur) =>
          cur.map((s) => (s.id === id ? { ...s, label: label.trim() || s.label } : s)),
        ),
      removeSaved: (id) => setSaved((cur) => cur.filter((s) => s.id !== id)),
      updateSavedAlerts: (id, alerts) =>
        setSaved((cur) => cur.map((s) => (s.id === id ? { ...s, alerts } : s))),
      toggleSavedAlerts: (id, enabled) =>
        setSaved((cur) =>
          cur.map((s) =>
            s.id === id
              ? {
                  ...s,
                  alerts: {
                    enabled,
                    channels: s.alerts?.channels ?? ["inapp"],
                    cadence: s.alerts?.cadence ?? "instant",
                    email: s.alerts?.email,
                    lastNotifiedAt: s.alerts?.lastNotifiedAt,
                  },
                }
              : s,
          ),
        ),
      addFollow: (f) =>
        setFollows((cur) => {
          const without = cur.filter((x) => x.followId !== f.followId);
          return [
            { ...f, id: `f-${Date.now()}`, createdAt: new Date().toISOString() },
            ...without,
          ].slice(0, 50);
        }),
      renameFollow: (id, label) =>
        setFollows((cur) =>
          cur.map((f) => (f.id === id ? { ...f, label: label.trim() || f.label } : f)),
        ),
      removeFollow: (id) => setFollows((cur) => cur.filter((f) => f.id !== id)),
      addSegment: (s) =>
        setSegments((cur) => {
          const without = cur.filter((x) => !(x.id === s.id && x.email === s.email));
          return [{ ...s, subscribedAt: new Date().toISOString() }, ...without].slice(0, 100);
        }),
      removeSegment: (id) => setSegments((cur) => cur.filter((s) => s.id !== id)),
      clearRecent: () => setEntries([]),
    }),
    [entries, saved, follows, segments],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useRecents() {
  const ctx = React.useContext(Ctx);
  if (!ctx) throw new Error("useRecents must be used within RecentsProvider");
  return ctx;
}
