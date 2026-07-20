/**
 * Pure IndexNow change-window helpers for the daily scheduled submit job.
 *
 * The cron runs once per day (~24h). A 48h sliding window therefore marks
 * almost every newly-changed URL eligible on *two* consecutive runs, which
 * contradicts the job's anti-spam "submit only recent changes" design.
 * Keep the window just wider than one cadence so a slightly-late daily run
 * still catches updates, without guaranteeing a double submit under normal
 * operation. A fully missed day can drop an update — use a persisted
 * watermark if that tradeoff becomes unacceptable.
 */

export const INDEXNOW_DAILY_CADENCE_MS = 24 * 60 * 60 * 1000;

/** Slightly wider than the daily cadence; must stay well under 2× cadence. */
export const INDEXNOW_CHANGE_WINDOW_MS = 26 * 60 * 60 * 1000;

/** True when `stampMs` falls inside the inclusive lookback window ending at `nowMs`. */
export function isWithinIndexNowChangeWindow(
  stampMs: number,
  nowMs: number,
  windowMs: number = INDEXNOW_CHANGE_WINDOW_MS,
): boolean {
  if (!Number.isFinite(stampMs) || !Number.isFinite(nowMs) || !Number.isFinite(windowMs)) {
    return false;
  }
  if (windowMs < 0) return false;
  const cutoff = nowMs - windowMs;
  return stampMs >= cutoff && stampMs <= nowMs;
}
