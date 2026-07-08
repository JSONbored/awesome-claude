// Pure localStorage layer for the entry-signals panel, split out of
// entry-signals-panel.tsx so the client-id and active-community persistence can
// be unit-tested with a fake storage and an injected id generator.

import type { CommunityCounts } from "@/lib/entry-signals-counts-lib";

const CLIENT_STORAGE_KEY = "hc:client-id";
const COMMUNITY_STORAGE_PREFIX = "hc:community:";

type StorageLike = Pick<Storage, "getItem" | "setItem">;

/** The per-signal-kind flags a user has toggled locally. */
export type ActiveCommunity = Partial<Record<keyof CommunityCounts, boolean>>;

/** Default client-id generator: `crypto.randomUUID` when available, else a
 *  time+random fallback. Both are prefixed `hc-`. */
export function defaultClientId(): string {
  return typeof crypto !== "undefined" && "randomUUID" in crypto
    ? `hc-${crypto.randomUUID()}`
    : `hc-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 18)}`;
}

/**
 * Read the stable per-client id from storage, or generate + persist a new one.
 * A stored value is reused only when it matches the expected id shape. Returns
 * "" when there is no storage.
 */
export function getClientId(
  storage: StorageLike | null | undefined,
  generateId: () => string = defaultClientId,
): string {
  if (!storage) return "";
  const existing = storage.getItem(CLIENT_STORAGE_KEY);
  if (existing && /^[a-zA-Z0-9_-]{16,96}$/.test(existing)) return existing;
  const generated = generateId();
  storage.setItem(CLIENT_STORAGE_KEY, generated);
  return generated;
}

/** Read the locally-remembered active community flags for a target. */
export function readActiveCommunity(
  storage: StorageLike | null | undefined,
  targetKey: string,
): ActiveCommunity {
  if (!storage) return {};
  try {
    const raw = storage.getItem(`${COMMUNITY_STORAGE_PREFIX}${targetKey}`);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as Record<string, unknown>;
    return {
      used: parsed.used === true,
      works: parsed.works === true,
      broken: parsed.broken === true,
    };
  } catch {
    return {};
  }
}

/** Persist the active community flags for a target. No-op without storage. */
export function writeActiveCommunity(
  storage: StorageLike | null | undefined,
  targetKey: string,
  active: ActiveCommunity,
): void {
  if (!storage) return;
  storage.setItem(`${COMMUNITY_STORAGE_PREFIX}${targetKey}`, JSON.stringify(active));
}
