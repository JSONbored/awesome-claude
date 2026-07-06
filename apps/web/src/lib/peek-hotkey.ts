/**
 * Global "P to peek" hotkey. The currently focused/hovered card registers an
 * opener; pressing `p` (no modifiers, not typing) invokes it.
 *
 * The pure keydown decision lives in `peek-hotkey-lib.ts`
 * (`@/lib/peek-hotkey-lib`); this module keeps the opener registry and the
 * browser `keydown` listener install.
 */
import { shouldTriggerPeek } from "@/lib/peek-hotkey-lib";

export { shouldTriggerPeek } from "@/lib/peek-hotkey-lib";

type Opener = { open: () => void };
let hot: Opener | null = null;
let installed = false;

export function setHotPeek(o: Opener) {
  hot = o;
}
export function clearHotPeek(o: Opener) {
  if (hot === o) hot = null;
}

export function installPeekShortcut() {
  if (installed || typeof window === "undefined") return;
  installed = true;
  window.addEventListener("keydown", (e) => {
    if (!shouldTriggerPeek(e)) return;
    if (hot) {
      e.preventDefault();
      hot.open();
    }
  });
}
