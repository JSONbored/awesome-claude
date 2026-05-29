import * as React from "react";

/**
 * Global keyboard shortcuts registered while mounted.
 * Skips when focus is in an editable element unless `whenTyping` is true.
 */
export function useKeyboardShortcuts(
  bindings: Record<string, () => void>,
  options: { whenTyping?: boolean } = {},
) {
  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement | null;
      const typing =
        !!t &&
        (t.tagName === "INPUT" ||
          t.tagName === "TEXTAREA" ||
          t.tagName === "SELECT" ||
          t.isContentEditable);
      if (typing && !options.whenTyping) return;
      const key = e.key;
      if (bindings[key]) {
        e.preventDefault();
        bindings[key]();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [bindings, options.whenTyping]);
}
