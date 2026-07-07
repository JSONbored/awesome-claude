import { getFallbackIntentEventCounts, queryIntentEventCounts } from "@/lib/intent-events-lib";
import { getSiteDb } from "@/lib/db";

export * from "@/lib/intent-events-lib";

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
    if (!message.includes("no such table: intent_events") && !message.includes("SITE_DB")) {
      console.warn("[intent-events] failed to read counts", error);
    }
    return {
      available: false,
      counts: getFallbackIntentEventCounts(keys),
    };
  }
}
