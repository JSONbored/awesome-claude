import type { Entry } from "@/types/registry";
import {
  compareSurfaceBannerTexts,
  compareSurfaceDecisionBannerText,
  compareSurfaceDecisionSummary,
  compareSurfaceSummary,
} from "@/lib/compare-surface-summary-lib";

export function compareDrawerDecisionSummary(entries: Entry[]) {
  return compareSurfaceDecisionSummary(entries);
}

export function compareDrawerDecisionBannerText(entries: Entry[]): string | null {
  return compareSurfaceDecisionBannerText(entries);
}

export function compareDrawerActionBannerText(actionsDiverge: boolean): string | null {
  if (!actionsDiverge) return null;
  return "Next steps differ across this comparison — review install, source, and claim actions per entry.";
}

export function compareDrawerSummary(entries: Entry[]) {
  return compareSurfaceSummary(entries);
}

export function compareDrawerBannerTexts(entries: Entry[]): string[] {
  const summary = compareSurfaceSummary(entries);
  return compareSurfaceBannerTexts(entries, compareDrawerActionBannerText(summary.actionsDiverge));
}
