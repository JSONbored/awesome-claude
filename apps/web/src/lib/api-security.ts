/**
 * API request security surface.
 *
 * Pure helpers live in `api-security-lib.ts`. This module re-exports that surface
 * so existing `@/lib/api-security` imports stay unchanged.
 */
export {
  BodyTooLargeError,
  getClientIp,
  hasJsonContentType,
  isAllowedOrigin,
  isRateLimited,
  readRequestTextWithinLimit,
  __rateLimitTestHooks,
} from "@/lib/api-security-lib";
