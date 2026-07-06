/**
 * Robots policy surface.
 *
 * Pure helpers live in `robots-policy-lib.ts`. This module re-exports that
 * surface so existing `@/lib/robots-policy` imports stay unchanged.
 */
export { getRobotsPolicy, renderRobotsTxt } from "@/lib/robots-policy-lib";
