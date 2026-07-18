/**
 * Pure contributor attribution navigation analytics helpers.
 *
 * Maps profile and external attribution egress to privacy-light event names
 * without embedding display names or free-text URLs.
 */

export const CONTRIBUTOR_ATTRIBUTION_SURFACE = "contributor-attribution";

export type ContributorAttributionKind = "profile" | "external";

export type ContributorAttributionRole = "author" | "submitter" | "identity";

export function contributorAttributionAnalyticsEvent(): string {
  return "contributor_attribution_click";
}

export function contributorAttributionAnalyticsData(
  kind: ContributorAttributionKind,
  role: ContributorAttributionRole,
  contributorSlug: string | null = null,
) {
  return {
    surface: CONTRIBUTOR_ATTRIBUTION_SURFACE,
    kind,
    role,
    contributorSlug,
  };
}

export type ContributorAttributionProfileDestination = {
  to: "/contributors/$slug";
  params: { slug: string };
};

/** Map a contributor slug to a contributor profile destination. */
export function contributorAttributionProfileDestination(
  slug: string,
): ContributorAttributionProfileDestination | null {
  const id = slug.trim();
  switch (id) {
    case "":
      return null;
    default:
      return { to: "/contributors/$slug", params: { slug: id } };
  }
}
