/**
 * Weekly-brief scheduling surface.
 *
 * The pure slot computation lives in `brief-schedule-lib.ts`
 * (`@/lib/brief-schedule-lib`). This module re-exports it so existing
 * `@/lib/brief-schedule` importers stay unchanged.
 */
export { nextSendSlot } from "@/lib/brief-schedule-lib";
