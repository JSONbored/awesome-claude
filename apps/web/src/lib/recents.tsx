import * as React from "react";

import { emptyRecentsState, parseRecentsState } from "@/lib/recents-storage-lib";
import type {
  AlertCadence,
  AlertChannel,
  AlertSchedule,
  Follow,
  RecentEntry,
  RecentsState,
  SavedSearch,
  Segment,
} from "@/lib/recents-types-lib";

export type {
  AlertCadence,
  AlertChannel,
  AlertSchedule,
  Follow,
  RecentEntry,
  RecentsState,
  SavedSearch,
  Segment,
};

const STORAGE_KEY = "hc.recents.v1";
const MAX_RECENT = 8;

type State = RecentsState;

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
  if (typeof window === "undefined") return emptyRecentsState();
  try {
    // The storage read stays inside the try/catch: the getter itself can throw
    // (SecurityError) in sandboxed / storage-blocked contexts.
    return parseRecentsState(window.localStorage.getItem(STORAGE_KEY));
  } catch {
    return emptyRecentsState();
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
