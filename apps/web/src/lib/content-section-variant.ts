/**
 * Content section variant classification surface.
 *
 * Pure section variant helpers live in `content-section-lib.ts`. This module
 * re-exports that surface so existing `@/lib/content-section-variant` imports
 * stay unchanged.
 */
export type { SectionVariant } from "@/lib/content-section-lib";
export {
  getSectionEyebrow,
  getSectionVariant,
  isEssentialVariant,
  shouldOpenSection,
} from "@/lib/content-section-lib";
