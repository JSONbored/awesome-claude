/**
 * Pure dossier TOC CTA analytics helpers.
 *
 * Maps detail-rail section navigation clicks to privacy-light event names
 * without embedding section labels or other free-text fields.
 */

export const DOSSIER_TOC_DETAIL_RAIL_SURFACE = "detail-dossier-toc";
export const DOSSIER_TOC_CONTENT_OUTLINE_SURFACE = "detail-content-outline";

export function dossierTocEntryKey(category: string, slug: string): string {
  return `${category}/${slug}`;
}

export function dossierTocSectionAnalyticsEvent(): string {
  return "detail_toc_section_click";
}

export function dossierTocSectionAnalyticsData(
  category: string,
  slug: string,
  sectionId: string,
  surface: string = DOSSIER_TOC_DETAIL_RAIL_SURFACE,
) {
  return {
    entry: dossierTocEntryKey(category, slug),
    surface,
    section: sectionId,
  };
}
