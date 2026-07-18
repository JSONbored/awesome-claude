/**
 * Pure trust drilldown navigation analytics helpers.
 *
 * Maps methodology egress, reason doc links, external source opens, and trust
 * browse egress to privacy-light event names without embedding titles, URLs, or
 * free text.
 */

export const TRUST_DRILLDOWN_SURFACE = "trust-drilldown";

export type TrustDrilldownSurface =
  | typeof TRUST_DRILLDOWN_SURFACE
  | "compare-table"
  | "compare-drawer"
  | "detail-header";

export function trustDrilldownEntryKey(category: string, slug: string): string {
  return `${category}/${slug}`;
}

export function trustDrilldownOpenAnalyticsEvent(): string {
  return "trust_drilldown_open_click";
}

export function trustDrilldownOpenAnalyticsData(
  category: string,
  slug: string,
  trust: string,
  reasonCount: number,
  surface: string = TRUST_DRILLDOWN_SURFACE,
) {
  return {
    surface,
    entry: trustDrilldownEntryKey(category, slug),
    trust,
    reasonCount,
  };
}

export function trustDrilldownMethodologyAnalyticsEvent(): string {
  return "trust_drilldown_methodology_click";
}

export function trustDrilldownMethodologyAnalyticsData(
  category: string,
  slug: string,
  surface: string = TRUST_DRILLDOWN_SURFACE,
) {
  return {
    surface,
    entry: trustDrilldownEntryKey(category, slug),
  };
}

export function trustDrilldownDocAnalyticsEvent(): string {
  return "trust_drilldown_doc_click";
}

export function trustDrilldownDocAnalyticsData(
  category: string,
  slug: string,
  reasonId: string,
  severity: string,
  surface: string = TRUST_DRILLDOWN_SURFACE,
) {
  return {
    surface,
    entry: trustDrilldownEntryKey(category, slug),
    reasonId,
    severity,
  };
}

export function trustDrilldownSourceAnalyticsEvent(): string {
  return "trust_drilldown_source_click";
}

export function trustDrilldownSourceAnalyticsData(
  category: string,
  slug: string,
  reasonId: string,
  severity: string,
  surface: string = TRUST_DRILLDOWN_SURFACE,
) {
  return {
    surface,
    entry: trustDrilldownEntryKey(category, slug),
    reasonId,
    severity,
  };
}

export function trustDrilldownBrowseAnalyticsEvent(): string {
  return "trust_drilldown_browse_click";
}

export function trustDrilldownBrowseAnalyticsData(
  category: string,
  slug: string,
  trust: string,
  surface: string = TRUST_DRILLDOWN_SURFACE,
) {
  return {
    surface,
    entry: trustDrilldownEntryKey(category, slug),
    trust,
  };
}

/** Map a trust level to a browse `trust` search patch. */
export function trustDrilldownBrowseSearch(trust: string): { trust: string } | null {
  switch (trust) {
    case "trusted":
      return { trust: "trusted" };
    case "review":
      return { trust: "review" };
    case "limited":
      return { trust: "limited" };
    case "blocked":
      return { trust: "blocked" };
    default:
      return null;
  }
}

export type TrustDrilldownMethodologyDestination = { to: "/quality"; hash: "methodology" };

/** Map a trust drilldown methodology egress id to a quality page destination. */
export function trustDrilldownMethodologyDestination(
  destination: string,
): TrustDrilldownMethodologyDestination | null {
  switch (destination) {
    case "methodology":
      return { to: "/quality", hash: "methodology" };
    default:
      return null;
  }
}

export type TrustDrilldownBrowseDestination = { to: "/browse"; search: { trust: string } };

/** Map a trust level to a directory browse destination. */
export function trustDrilldownBrowseDestination(
  trust: string,
): TrustDrilldownBrowseDestination | null {
  const search = trustDrilldownBrowseSearch(trust);
  if (!search) return null;
  return { to: "/browse", search };
}
