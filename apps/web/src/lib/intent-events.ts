import { getSiteDb, type D1DatabaseLike } from "@/lib/db";

export const INTENT_EVENT_TYPES = [
  "copy",
  "open",
  "install",
  "download",
  "vote",
] as const;
export const INTENT_EVENT_WINDOW_DAYS = 30;
export const ZERO_INTENT_EVENT_COUNTS = {
  copy: 0,
  open: 0,
  install: 0,
  download: 0,
  vote: 0,
};

export type IntentEventType = (typeof INTENT_EVENT_TYPES)[number];
export type IntentEventCounts = Record<IntentEventType, number>;

type IntentEventRow = {
  entry_key: string;
  event_type: IntentEventType;
  count: number;
};

const D1_SAFE_VARIABLE_BATCH_SIZE = 25;

export function normalizeIntentEventType(value: unknown) {
  const normalized = String(value ?? "")
    .trim()
    .toLowerCase();
  return (INTENT_EVENT_TYPES as readonly string[]).includes(normalized)
    ? (normalized as IntentEventType)
    : "";
}

export function normalizeIntentEntryKey(value: unknown) {
  const normalized = String(value ?? "")
    .trim()
    .toLowerCase();
  return /^[a-z0-9-]+:[a-z0-9-]+$/.test(normalized) ? normalized : "";
}

export function normalizeIntentSessionId(value: unknown) {
  const normalized = String(value ?? "").trim();
  return normalized.length <= 128 ? normalized : "";
}

export function getFallbackIntentEventCounts(keys: string[]) {
  const counts: Record<string, IntentEventCounts> = {};
  for (const key of keys) counts[key] = { ...ZERO_INTENT_EVENT_COUNTS };
  return counts;
}

export async function queryIntentEventCounts(
  db: D1DatabaseLike,
  keys: string[],
  windowDays = INTENT_EVENT_WINDOW_DAYS,
) {
  const uniqueKeys = [...new Set(keys.filter(Boolean))];
  const counts = getFallbackIntentEventCounts(uniqueKeys);
  if (!uniqueKeys.length) return counts;

  for (
    let index = 0;
    index < uniqueKeys.length;
    index += D1_SAFE_VARIABLE_BATCH_SIZE
  ) {
    const batch = uniqueKeys.slice(index, index + D1_SAFE_VARIABLE_BATCH_SIZE);
    const placeholders = batch.map(() => "?").join(", ");
    const { results } = await db
      .prepare(
        `SELECT entry_key, event_type, COUNT(*) AS count
         FROM intent_events
         WHERE entry_key IN (${placeholders})
           AND created_at >= datetime('now', ?)
         GROUP BY entry_key, event_type`,
      )
      .bind(...batch, `-${Math.max(1, windowDays)} days`)
      .all<IntentEventRow>();

    for (const row of results || []) {
      if (!INTENT_EVENT_TYPES.includes(row.event_type)) continue;
      counts[row.entry_key] = counts[row.entry_key] || {
        ...ZERO_INTENT_EVENT_COUNTS,
      };
      counts[row.entry_key][row.event_type] = Number(row.count) || 0;
    }
  }

  return counts;
}

export async function safeIntentEventCounts(keys: string[]) {
  try {
    const db = getSiteDb();
    if (!db) {
      return {
        available: false,
        counts: getFallbackIntentEventCounts(keys),
      };
    }
    return {
      available: true,
      counts: await queryIntentEventCounts(db, keys),
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    if (
      !message.includes("no such table: intent_events") &&
      !message.includes("SITE_DB")
    ) {
      console.warn("[intent-events] failed to read counts", error);
    }
    return {
      available: false,
      counts: getFallbackIntentEventCounts(keys),
    };
  }
}
