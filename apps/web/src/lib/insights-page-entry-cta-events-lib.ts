/**
 * Pure insights page entry egress analytics helpers.
 *
 * Maps contributor, quality, validators, and state report entry navigation to
 * privacy-light event names without embedding entry titles or page copy.
 */

import type { ContributorAcceptedEntryRole } from "@/data/contributors";

export const CONTRIBUTOR_PROFILE_SURFACE = "contributor-profile";
export const QUALITY_QUEUE_SURFACE = "quality-queue";
export const VALIDATORS_ATTENTION_SURFACE = "validators-attention";
export const VALIDATORS_RECENT_REVIEWED_SURFACE = "validators-recent-reviewed";
export const STATE_REPORT_SURFACE = "state-report";

export type QualityQueueId = "improvement" | "trust";
export type StateReportId = "claude-tooling" | "mcp-servers";
export type ContributorProfileRole = ContributorAcceptedEntryRole | "reviewed";

export function insightsPageEntryKey(category: string, slug: string): string {
  return `${category}/${slug}`;
}

export function contributorProfileEntryAnalyticsEvent(): string {
  return "contributor_profile_entry_click";
}

export function contributorProfileEntryAnalyticsData(
  category: string,
  slug: string,
  contributorSlug: string,
  role: ContributorProfileRole,
  rowIndex: number,
  rowCount: number,
) {
  return {
    entry: insightsPageEntryKey(category, slug),
    surface: CONTRIBUTOR_PROFILE_SURFACE,
    contributorSlug,
    role,
    rowIndex,
    rowCount,
  };
}

export function qualityQueueEntryAnalyticsEvent(): string {
  return "quality_queue_entry_click";
}

export function qualityQueueEntryAnalyticsData(
  category: string,
  slug: string,
  queueId: QualityQueueId,
  score: number,
  rowIndex: number,
  rowCount: number,
) {
  return {
    entry: insightsPageEntryKey(category, slug),
    surface: QUALITY_QUEUE_SURFACE,
    queueId,
    score,
    rowIndex,
    rowCount,
  };
}

export function validatorsAttentionEntryAnalyticsEvent(): string {
  return "validators_attention_entry_click";
}

export function validatorsAttentionEntryAnalyticsData(
  category: string,
  slug: string,
  expertiseId: string,
  rowIndex: number,
  rowCount: number,
) {
  return {
    entry: insightsPageEntryKey(category, slug),
    surface: VALIDATORS_ATTENTION_SURFACE,
    expertiseId,
    rowIndex,
    rowCount,
  };
}

export function validatorsRecentReviewedEntryAnalyticsEvent(): string {
  return "validators_recent_reviewed_entry_click";
}

export function validatorsRecentReviewedEntryAnalyticsData(
  category: string,
  slug: string,
  rowIndex: number,
  rowCount: number,
) {
  return {
    entry: insightsPageEntryKey(category, slug),
    surface: VALIDATORS_RECENT_REVIEWED_SURFACE,
    rowIndex,
    rowCount,
  };
}

export function stateReportEntryAnalyticsEvent(): string {
  return "state_report_entry_click";
}

export function stateReportEntryAnalyticsData(
  category: string,
  slug: string,
  reportId: StateReportId,
  rowIndex: number,
  rowCount: number,
) {
  return {
    entry: insightsPageEntryKey(category, slug),
    surface: STATE_REPORT_SURFACE,
    reportId,
    rowIndex,
    rowCount,
  };
}

export type InsightsPageEntryDestination = {
  to: "/entry/$category/$slug";
  params: { category: string; slug: string };
};

/** Map an insights/report entry ref to an entry detail destination. */
export function insightsPageEntryDestination(
  category: string,
  slug: string,
): InsightsPageEntryDestination | null {
  const categoryId = category.trim();
  const entrySlug = slug.trim();
  switch (categoryId) {
    case "":
      return null;
    default:
      switch (entrySlug) {
        case "":
          return null;
        default:
          return {
            to: "/entry/$category/$slug",
            params: { category: categoryId, slug: entrySlug },
          };
      }
  }
}
