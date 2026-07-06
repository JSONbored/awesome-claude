/**
 * CSV-cell escaping surface.
 *
 * The pure escaping logic lives in `csv-lib.ts`. This module re-exports the
 * helper so existing `@/lib/csv` imports stay unchanged.
 */
export { csvEscape } from "@/lib/csv-lib";
