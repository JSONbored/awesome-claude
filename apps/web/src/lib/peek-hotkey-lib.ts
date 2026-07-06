/**
 * Pure "P to peek" hotkey decision helper.
 *
 * The stateful listener/registration surface lives in `peek-hotkey.ts`
 * (`@/lib/peek-hotkey`), which re-exports `shouldTriggerPeek` and calls it from
 * its `keydown` handler. Given the same event shape the output here is
 * deterministic — no module state, no browser side effects.
 */

export type PeekKeyEvent = {
  metaKey: boolean;
  ctrlKey: boolean;
  altKey: boolean;
  shiftKey: boolean;
  key: string;
  target: EventTarget | null;
};

/**
 * Whether a keydown should trigger "peek": bare `p`/`P`, no modifiers, and not
 * while typing in an input/textarea/select/contenteditable.
 */
export function shouldTriggerPeek(e: PeekKeyEvent): boolean {
  if (e.metaKey || e.ctrlKey || e.altKey || e.shiftKey) return false;
  const t = e.target as { matches?: (selector: string) => boolean } | null;
  if (t?.matches?.("input,textarea,select,[contenteditable='true']")) return false;
  return e.key.toLowerCase() === "p";
}
