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

interface RegistryEvent {
  id?: string;
  kind?: string;
  category?: string;
  slug?: string;
  action?: string;
  date?: string;
  title?: string;
  commit?: string;
}

function eventTargetId(event: RegistryEvent): string | null {
  if (event.kind === "entry" && event.category && event.slug) {
    return `entry:${event.category}/${event.slug}`;
  }
  return null;
}

function eventToAlert(event: RegistryEvent, target: WatchTarget): Alert | null {
  const targetId = eventTargetId(event);
  if (!targetId || targetId !== target.id || !event.date) return null;
  const action =
    event.action === "removed" ? "removed" : event.action === "added" ? "added" : "updated";
  const label = event.title || target.label;
  return {
    id: event.id || `${target.id}:${event.date}:${action}`,
    targetId: target.id,
    kind: target.kind,
    title: `${label} ${action}`,
    body:
      action === "removed"
        ? "This watched registry entry was removed from the source content."
        : "This watched registry entry changed in the source content.",
    severity: action === "removed" ? "warning" : "info",
    href: target.href,
    date: event.date,
  };
}

export function WatchProvider({ children }: { children: React.ReactNode }) {
  const [hydrated, setHydrated] = React.useState(false);
  const [targets, setTargets] = React.useState<WatchTarget[]>([]);
  const [lastSeenAt, setLastSeenAt] = React.useState("1970-01-01");
  const [remoteEvents, setRemoteEvents] = React.useState<RegistryEvent[]>([]);

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

  React.useEffect(() => {
    if (!hydrated || targets.length === 0) {
      setRemoteEvents([]);
      return;
    }
    let cancelled = false;
    async function loadAlerts() {
      try {
        const response = await fetch("/api/public/alerts", {
          headers: { accept: "application/json" },
        });
        if (!response.ok) throw new Error(`alerts API returned ${response.status}`);
        const payload = (await response.json()) as { events?: RegistryEvent[] };
        if (!cancelled) setRemoteEvents(Array.isArray(payload.events) ? payload.events : []);
      } catch {
        if (!cancelled) setRemoteEvents([]);
      }
    }
    void loadAlerts();
    return () => {
      cancelled = true;
    };
  }, [hydrated, targets.length]);

  const alerts = React.useMemo(() => {
    const byId = new Map(targets.map((target) => [target.id, target]));
    return remoteEvents
      .map((event) => {
        const targetId = eventTargetId(event);
        const target = targetId ? byId.get(targetId) : undefined;
        return target ? eventToAlert(event, target) : null;
      })
      .filter((alert): alert is Alert => Boolean(alert))
      .sort((left, right) => right.date.localeCompare(left.date));
  }, [targets, remoteEvents]);

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
