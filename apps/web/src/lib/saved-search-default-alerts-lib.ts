// Pure default alert schedule for a saved search, split out of the saved-search
// manager so the default can be unit-tested (and reused) without React.

import type { AlertSchedule } from "@/lib/recents";

/** The schedule applied to a saved search that has no alerts yet: enabled, in-app, instant. */
export function defaultAlerts(): AlertSchedule {
  return { enabled: true, channels: ["inapp"], cadence: "instant" };
}
