/**
 * Global "P to peek" hotkey. The currently focused/hovered card registers an
 * opener; pressing `p` (no modifiers, not typing) invokes it.
 */
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
    if (e.metaKey || e.ctrlKey || e.altKey || e.shiftKey) return;
    const t = e.target as HTMLElement | null;
    if (t?.matches?.("input,textarea,select,[contenteditable='true']")) return;
    if (e.key.toLowerCase() === "p" && hot) {
      e.preventDefault();
      hot.open();
    }
  });
}
