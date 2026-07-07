import type { Entry } from "@/types/registry";
import {
  compareSurfaceBannerTexts,
  compareSurfaceDecisionBannerText,
  compareSurfaceDecisionSummary,
  compareSurfaceSummary,
} from "@/lib/compare-surface-summary-lib";

export const COMPARE_PAGE_SURFACE = "compare-page";

export function comparePageDecisionSummary(entries: Entry[]) {
  return compareSurfaceDecisionSummary(entries);
}

export function comparePageDecisionBannerText(entries: Entry[]): string | null {
  return compareSurfaceDecisionBannerText(entries);
}

export function comparePageActionBannerText(actionsDiverge: boolean): string | null {
  if (!actionsDiverge) return null;
  return "Next steps differ across this comparison — review install, source, and claim actions in the table below.";
}

export function comparePageSummary(entries: Entry[]) {
  return compareSurfaceSummary(entries);
}

export function comparePageBannerTexts(entries: Entry[]): string[] {
  const summary = compareSurfaceSummary(entries);
  return compareSurfaceBannerTexts(entries, comparePageActionBannerText(summary.actionsDiverge));
}
