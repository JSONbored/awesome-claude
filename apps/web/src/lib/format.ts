/**
 * Public entrypoint for number/date formatting helpers.
 *
 * The implementation lives in `@/lib/format-lib`; this module re-exports the
 * stable public API so import sites stay unchanged.
 */
export { formatCompact, timeAgo } from "@/lib/format-lib";
