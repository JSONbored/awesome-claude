/**
 * Pure resource card compare CTA helpers.
 */

import { DEFAULT_COMPARE_LIMIT } from "@/lib/compare-selection-lib";

export function resourceCardCompareFullMessage(maxCount = DEFAULT_COMPARE_LIMIT): string {
  return `Compare is full (${maxCount}/${maxCount}). Remove an entry to add this one.`;
}

export function resourceCardCompareWouldBlock(
  inCompare: boolean,
  compareCount: number,
  maxCount = DEFAULT_COMPARE_LIMIT,
): boolean {
  return !inCompare && compareCount >= maxCount;
}
