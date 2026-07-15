/**
 * Pure trust drilldown navigation analytics helpers.
 *
 * Maps methodology egress, reason doc links, and external source opens to
 * privacy-light event names without embedding titles, URLs, or free text.
 */

export const TRUST_DRILLDOWN_SURFACE = "trust-drilldown";

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
) {
  return {
    surface: TRUST_DRILLDOWN_SURFACE,
    entry: trustDrilldownEntryKey(category, slug),
    trust,
    reasonCount,
  };
}

export function trustDrilldownMethodologyAnalyticsEvent(): string {
  return "trust_drilldown_methodology_click";
}

export function trustDrilldownMethodologyAnalyticsData(category: string, slug: string) {
  return {
    surface: TRUST_DRILLDOWN_SURFACE,
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
) {
  return {
    surface: TRUST_DRILLDOWN_SURFACE,
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
) {
  return {
    surface: TRUST_DRILLDOWN_SURFACE,
    entry: trustDrilldownEntryKey(category, slug),
    reasonId,
    severity,
  };
}
