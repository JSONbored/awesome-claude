/**
 * Pure weekly brief entry egress analytics helpers.
 *
 * Maps brief hub and issue archive entry navigation to privacy-light event
 * names without embedding entry titles or brief copy.
 */

export const BRIEF_HUB_SURFACE = "brief-hub";
export const BRIEF_ISSUE_SURFACE = "brief-issue";

export type BriefHubSectionId = "new-entries" | "trusted-installs" | "source-backed-picks";
export type BriefIssueSectionId =
  | "newEntries"
  | "sourceBacked"
  | "saferInstalls"
  | "notableChanges";

export function briefEntryAnalyticsEvent(): string {
  return "brief_entry_click";
}

export function parseBriefEntryRef(urlOrRef: string): string | null {
  if (!urlOrRef || urlOrRef === "#") return null;
  if (!urlOrRef.startsWith("http") && !urlOrRef.startsWith("/")) {
    const slash = urlOrRef.indexOf("/");
    if (slash > 0 && slash < urlOrRef.length - 1) {
      return urlOrRef;
    }
  }
  const match = urlOrRef.match(/\/entry\/([^/]+)\/([^/?#]+)/);
  if (!match) return null;
  return `${match[1]}/${match[2]}`;
}

export function briefHubEntryAnalyticsData(
  entryRef: string,
  sectionId: BriefHubSectionId,
  rowIndex: number,
  rowCount: number,
) {
  return {
    entry: entryRef,
    surface: BRIEF_HUB_SURFACE,
    sectionId,
    rowIndex,
    rowCount,
  };
}

export function briefIssueEntryAnalyticsData(
  entryRef: string,
  sectionId: BriefIssueSectionId,
  rowIndex: number,
  rowCount: number,
  issueNumber: number,
) {
  return {
    entry: entryRef,
    surface: BRIEF_ISSUE_SURFACE,
    sectionId,
    rowIndex,
    rowCount,
    issueNumber,
  };
}

export type BriefIssueHubSource = "breadcrumb" | "not-found";

export function briefIssueHubAnalyticsEvent(): string {
  return "brief_issue_hub_click";
}

export function briefIssueHubAnalyticsData(
  issueNumber: number | null,
  source: BriefIssueHubSource,
) {
  return {
    surface: BRIEF_ISSUE_SURFACE,
    issueNumber,
    source,
  };
}

export function briefHubIssueAnalyticsEvent(): string {
  return "brief_hub_issue_click";
}

export function briefHubIssueAnalyticsData(
  issueNumber: number,
  rowIndex: number,
  issueCount: number,
) {
  return {
    surface: BRIEF_HUB_SURFACE,
    issueNumber,
    rowIndex,
    issueCount,
  };
}

export function briefHubLatestIssueAnalyticsEvent(): string {
  return "brief_hub_latest_issue_click";
}

export function briefHubLatestIssueAnalyticsData(issueNumber: number, entryCount: number) {
  return {
    surface: BRIEF_HUB_SURFACE,
    issueNumber,
    entryCount,
  };
}

export function briefHubStaticIssueAnalyticsEvent(): string {
  return "brief_hub_static_issue_click";
}

export function briefHubStaticIssueAnalyticsData(
  issueNumber: number,
  rowIndex: number,
  issueCount: number,
) {
  return {
    surface: BRIEF_HUB_SURFACE,
    issueNumber,
    rowIndex,
    issueCount,
  };
}

export type BriefHubIssueDestination = {
  to: "/brief/$number";
  params: { number: string };
};

/** Map a brief issue number to a brief issue destination. */
export function briefHubIssueDestination(
  issueNumber: number | string,
): BriefHubIssueDestination | null {
  const raw = String(issueNumber).trim();
  switch (raw) {
    case "":
      return null;
    default:
      return { to: "/brief/$number", params: { number: raw } };
  }
}

export type BriefIssueHubDestination = {
  to: "/brief";
};

/** Map a brief issue hub egress id to the brief hub. */
export function briefIssueHubDestination(destination: string): BriefIssueHubDestination | null {
  switch (destination) {
    case "brief":
      return { to: "/brief" };
    default:
      return null;
  }
}
