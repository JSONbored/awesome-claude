/**
 * Pure client intent-event helpers.
 *
 * Builds privacy-light POST bodies and interprets API responses without
 * touching fetch or browser globals.
 */

export const INTENT_EVENTS_API_PATH = "/api/intent-events";

export const INTENT_EVENT_CLIENT_TYPES = ["copy", "open", "install"] as const;

export type IntentEventClientType = (typeof INTENT_EVENT_CLIENT_TYPES)[number];

export function buildIntentEventEntryKey(category: string, slug: string): string {
  return `${category}:${slug}`;
}

export function buildIntentEventRequestBody(type: IntentEventClientType, entryKey: string): string {
  return JSON.stringify({ type, entryKey });
}

export function intentEventWasStored(payload: unknown): boolean {
  if (!payload || typeof payload !== "object") return false;
  return (payload as { stored?: boolean }).stored === true;
}
