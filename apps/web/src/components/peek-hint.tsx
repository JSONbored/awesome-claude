import * as React from "react";
import { X } from "lucide-react";
import { Kbd } from "@/components/badges";
import { cn } from "@/lib/utils";

const HINT_KEY = "hc.hint.peek.v1";

function alreadyDismissed(): boolean {
  if (typeof window === "undefined") return true;
  try {
    return window.localStorage.getItem(HINT_KEY) === "1";
  } catch {
    return true;
  }
}

function dismiss() {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(HINT_KEY, "1");
  } catch {
    /* noop */
  }
}

/**
 * One-time coach mark teaching the global `P` shortcut. Renders inside the
 * card hover cluster the first time a user lingers on a card for ≥600 ms.
 * Auto-dismisses after 8 s, on `P` press, or via the close affordance.
 */
export function PeekHint({ hovered, className }: { hovered: boolean; className?: string }) {
  const [visible, setVisible] = React.useState(false);
  const [eligible, setEligible] = React.useState(false);

  // Defer the eligibility check to the client (avoid SSR/hydration mismatch).
  React.useEffect(() => {
    setEligible(!alreadyDismissed());
  }, []);

  React.useEffect(() => {
    if (!eligible || !hovered) return;
    const showT = window.setTimeout(() => setVisible(true), 600);
    return () => window.clearTimeout(showT);
  }, [hovered, eligible]);

  React.useEffect(() => {
    if (!visible) return;
    const hideT = window.setTimeout(() => {
      setVisible(false);
      setEligible(false);
      dismiss();
    }, 8000);
    const onKey = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === "p" && !e.metaKey && !e.ctrlKey && !e.altKey) {
        setVisible(false);
        setEligible(false);
        dismiss();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.clearTimeout(hideT);
      window.removeEventListener("keydown", onKey);
    };
  }, [visible]);

  if (!eligible || !visible) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className={cn(
        "pointer-events-auto absolute right-2 top-11 z-20 flex items-center gap-2 rounded-md border border-border bg-surface px-2 py-1 text-[11px] text-ink shadow-md motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-top-1",
        className,
      )}
    >
      <span>
        Press <Kbd>P</Kbd> to peek
      </span>
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setVisible(false);
          setEligible(false);
          dismiss();
        }}
        aria-label="Dismiss peek shortcut hint"
        className="inline-flex h-4 w-4 items-center justify-center rounded text-ink-subtle hover:text-ink"
      >
        <X className="h-3 w-3" aria-hidden />
      </button>
    </div>
  );
}
