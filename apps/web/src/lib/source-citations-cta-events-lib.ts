/**
 * Pure source citations CTA analytics helpers.
 *
 * Maps citation panel outbound links to privacy-light event names without
 * embedding full URLs or other sensitive fields.
 */

export const SOURCE_CITATIONS_DETAIL_SURFACE = "detail-source-citations";

export type SourceCitationKind = "source-repo" | "repo" | "docs" | "website" | "package";
export type SourceCitationEgressDestination = "quality-source-provenance" | "contributor-profile";

export function sourceCitationEntryKey(category: string, slug: string): string {
  return `${category}/${slug}`;
}

export function sourceCitationAnalyticsEvent(): string {
  return "detail_citation_open";
}

export function sourceCitationAnalyticsData(
  category: string,
  slug: string,
  kind: SourceCitationKind,
  host: string,
  surface: string,
) {
  return {
    entry: sourceCitationEntryKey(category, slug),
    surface,
    citation: kind,
    host,
  };
}

export function sourceCitationEgressAnalyticsEvent(): string {
  return "detail_source_citations_egress_click";
}

export function sourceCitationEgressAnalyticsData(
  destination: SourceCitationEgressDestination,
  surface: string = SOURCE_CITATIONS_DETAIL_SURFACE,
) {
  return {
    surface,
    destination,
  };
}

export type SourceCitationContributorDestination = {
  to: "/contributors/$slug";
  params: { slug: string };
};

/** Map a contributor slug to a contributor profile destination. */
export function sourceCitationContributorDestination(
  slug: string,
): SourceCitationContributorDestination | null {
  const id = slug.trim();
  switch (id) {
    case "":
      return null;
    default:
      return { to: "/contributors/$slug", params: { slug: id } };
  }
}

export type SourceCitationQualityDestination = { to: "/quality"; hash: "source-provenance" };

/** Map a source citations quality egress id to a quality page destination. */
export function sourceCitationQualityDestination(
  destination: string,
): SourceCitationQualityDestination | null {
  switch (destination) {
    case "quality-source-provenance":
      return { to: "/quality", hash: "source-provenance" };
    default:
      return null;
  }
}
