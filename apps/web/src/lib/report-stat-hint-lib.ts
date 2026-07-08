// Pure display helper for report "stat" tiles, shared by the state-of-* report
// routes (previously an identical copy in each). Split out so it can be
// unit-tested without rendering the route.

import type { ReportStat } from "@/lib/data-reports";

/**
 * Display string for a stat's hint: when the hint is the literal "%" token it
 * renders as "<value>%", otherwise the hint text is returned verbatim.
 */
export function statHint(stat: ReportStat): string {
  return stat.hint === "%" ? `${stat.value}%` : stat.hint;
}
