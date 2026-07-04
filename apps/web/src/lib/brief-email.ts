/**
 * Weekly brief email surface.
 *
 * Pure HTML/text newsletter builders live in `brief-email-lib.ts`. This module
 * re-exports that surface so existing `@/lib/brief-email` imports stay unchanged.
 */
export {
  FEATURED_PER_SECTION,
  SECTIONS,
  MONTHS,
  CATEGORY_LABELS,
  escapeHtml,
  absolute,
  categoryLabel,
  shortDate,
  truncate,
  itemBadges,
  cardHtml,
  overflowRowHtml,
  sectionHtml,
  sectionText,
  buildBriefEmail,
  type BriefItem,
  type BriefSection,
  type BriefPayload,
} from "@/lib/brief-email-lib";
