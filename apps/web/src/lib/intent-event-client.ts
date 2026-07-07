/**
 * Client intent-event recording surface.
 *
 * Fire-and-forget POSTs to `/api/intent-events` that degrade safely when D1
 * or the network is unavailable. Payloads never include copy text or other
 * sensitive fields — only event type and entry key.
 */
export type { IntentEventClientType } from "@/lib/intent-event-client-lib";
export {
  INTENT_EVENT_CLIENT_TYPES,
  INTENT_EVENTS_API_PATH,
  buildIntentEventEntryKey,
  buildIntentEventRequestBody,
  intentEventWasStored,
} from "@/lib/intent-event-client-lib";

import {
  buildIntentEventEntryKey,
  buildIntentEventRequestBody,
  INTENT_EVENTS_API_PATH,
  intentEventWasStored,
  type IntentEventClientType,
} from "@/lib/intent-event-client-lib";
import { normalizeIntentEntryKey } from "@/lib/intent-events-lib";
import type { Entry } from "@/types/registry";

export async function recordIntentEvent(
  type: IntentEventClientType,
  entry: Pick<Entry, "category" | "slug">,
): Promise<boolean> {
  const entryKey = normalizeIntentEntryKey(buildIntentEventEntryKey(entry.category, entry.slug));
  if (!entryKey) return false;

  try {
    const response = await fetch(INTENT_EVENTS_API_PATH, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: buildIntentEventRequestBody(type, entryKey),
    });
    if (!response.ok) return false;
    return intentEventWasStored(await response.json());
  } catch {
    return false;
  }
}
