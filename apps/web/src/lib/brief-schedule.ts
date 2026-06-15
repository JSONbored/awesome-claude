// The recommended weekly send slot: Tuesday 15:00 UTC (mid-morning US /
// afternoon EU — the strongest engagement window for developer newsletters).
const SEND_DOW = 2; // 0=Sun..6=Sat; Tuesday
const SEND_HOUR_UTC = 15;

/**
 * The next Tuesday 15:00 UTC strictly at or after `from` (today if it's Tuesday
 * before 15:00, otherwise the following Tuesday). Returned as an ISO string for
 * the scheduled_send_at column.
 */
export function nextSendSlot(from: Date): string {
  const slot = new Date(
    Date.UTC(from.getUTCFullYear(), from.getUTCMonth(), from.getUTCDate(), SEND_HOUR_UTC, 0, 0, 0),
  );
  let add = (SEND_DOW - slot.getUTCDay() + 7) % 7;
  if (add === 0 && from.getTime() >= slot.getTime()) add = 7;
  slot.setUTCDate(slot.getUTCDate() + add);
  return slot.toISOString();
}
