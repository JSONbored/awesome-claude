import { GitCompare } from "lucide-react";
import type { ResourceCardTrustDecisionState } from "@/lib/resource-card-trust-decision";
import { resourceCardTrustHintToneClass } from "@/lib/resource-card-trust-decision";
import { cn } from "@/lib/utils";

export function ResourceCardTrustHint({
  state,
  className,
  onActivate,
}: {
  state: ResourceCardTrustDecisionState;
  className?: string;
  /** When set, renders as a compare-tray CTA button. */
  onActivate?: () => void;
}) {
  if (!state.showHint) return null;

  const classes = cn(
    "inline-flex items-start gap-1.5 rounded-md border px-2 py-1 text-left text-[11px] leading-snug",
    resourceCardTrustHintToneClass(state.kind),
    className,
  );

  if (onActivate) {
    return (
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onActivate();
        }}
        className={cn(
          classes,
          "transition-colors hover:border-ink/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60",
        )}
      >
        <GitCompare className="mt-0.5 h-3 w-3 shrink-0 opacity-70" aria-hidden />
        <span>{state.hint}</span>
      </button>
    );
  }

  return (
    <p className={classes} role="status">
      <GitCompare className="mt-0.5 h-3 w-3 shrink-0 opacity-70" aria-hidden />
      <span>{state.hint}</span>
    </p>
  );
}
