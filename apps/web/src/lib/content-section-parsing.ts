/**
 * Content section HTML parsing surface.
 *
 * Pure section parsing helpers live in `content-section-lib.ts`. This module
 * re-exports that surface so existing `@/lib/content-section-parsing` imports
 * stay unchanged.
 */
export type { SectionSubitem } from "@/lib/content-section-lib";
export {
  extractSectionSubitems,
  findNextH3Start,
  getEmbeddedSectionType,
  htmlBeforeFirstH3,
  stripSectionTypeComments,
} from "@/lib/content-section-lib";
