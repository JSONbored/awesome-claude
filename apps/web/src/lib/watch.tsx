import * as React from "react";

export type WatchKind = "entry" | "validator" | "changelog-stream" | "integration";

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

interface WatchCtx {
  targets: WatchTarget[];
  alerts: Alert[];
  lastSeenAt: string;
  isWatching: (id: string) => boolean;
  toggle: (target: Omit<WatchTarget, "addedAt">) => void;
  markAllRead: () => void;
  unreadCount: number;
}

const STORAGE_KEY = "hc.watch.v1";
const Ctx = React.createContext<WatchCtx | null>(null);

interface StoredState {
  targets: WatchTarget[];
  lastSeenAt: string;
}

function loadState(): StoredState {
  if (typeof window === "undefined") return { targets: [], lastSeenAt: "1970-01-01" };
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return { targets: [], lastSeenAt: "1970-01-01" };
    const parsed = JSON.parse(raw) as StoredState;
    return {
      targets: Array.isArray(parsed.targets) ? parsed.targets : [],
      lastSeenAt: typeof parsed.lastSeenAt === "string" ? parsed.lastSeenAt : "1970-01-01",
    };
  } catch {
    return { targets: [], lastSeenAt: "1970-01-01" };
  }
}

function saveState(state: StoredState) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    /* noop */
  }
}

export function WatchProvider({
  children,
  alertGenerator,
}: {
  children: React.ReactNode;
  alertGenerator: (targets: WatchTarget[]) => Alert[];
}) {
  const [hydrated, setHydrated] = React.useState(false);
  const [targets, setTargets] = React.useState<WatchTarget[]>([]);
  const [lastSeenAt, setLastSeenAt] = React.useState("1970-01-01");

  React.useEffect(() => {
    const s = loadState();
    setTargets(s.targets);
    setLastSeenAt(s.lastSeenAt);
    setHydrated(true);
  }, []);

  React.useEffect(() => {
    if (!hydrated) return;
    saveState({ targets, lastSeenAt });
  }, [targets, lastSeenAt, hydrated]);

  const alerts = React.useMemo(() => alertGenerator(targets), [targets, alertGenerator]);

  const value = React.useMemo<WatchCtx>(() => {
    const ids = new Set(targets.map((t) => t.id));
    const unreadCount = alerts.filter((a) => a.date > lastSeenAt).length;
    return {
      targets,
      alerts,
      lastSeenAt,
      isWatching: (id) => ids.has(id),
      toggle: (t) =>
        setTargets((cur) =>
          cur.some((x) => x.id === t.id)
            ? cur.filter((x) => x.id !== t.id)
            : [...cur, { ...t, addedAt: new Date().toISOString() }],
        ),
      markAllRead: () => setLastSeenAt(new Date().toISOString()),
      unreadCount,
    };
  }, [targets, alerts, lastSeenAt]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useWatch() {
  const ctx = React.useContext(Ctx);
  if (!ctx) throw new Error("useWatch must be used within WatchProvider");
  return ctx;
}
