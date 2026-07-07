/**
 * Pure weekly-brief scheduling helper.
 *
 * Computes the next send slot with no module state and no side effects — the
 * reference date is passed in — so it is unit-testable in isolation. The
 * `brief-schedule.ts` module (`@/lib/brief-schedule`) re-exports this surface so
 * existing importers stay unchanged.
 */

// The weekly send slot: Sunday 16:00 UTC — the cadence subscribers signed up
// for ("Weekly · Sundays"). Generation runs Friday, leaving the weekend for
// review before the Sunday send.
const SEND_DOW = 0; // 0=Sun..6=Sat; Sunday
const SEND_HOUR_UTC = 16;

/**
 * The next Sunday 16:00 UTC strictly at or after `from` (today if it's Sunday
 * before 16:00, otherwise the following Sunday). Returned as an ISO string for
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
