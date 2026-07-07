import { GitCompare } from "lucide-react";
import type { ResourceCardTrustDecisionState } from "@/lib/resource-card-trust-decision";
import { cn } from "@/lib/utils";

const KIND_STYLES: Record<ResourceCardTrustDecisionState["kind"], string> = {
  aligns: "border-border bg-surface text-ink-muted",
  stronger: "border-trust-trusted/30 bg-trust-trusted/5 text-trust-trusted",
  weaker: "border-trust-review/30 bg-trust-review/5 text-amber-900",
  diverges: "border-amber-500/30 bg-amber-500/5 text-amber-900",
  "mixed-trust": "border-accent/30 bg-accent/5 text-ink",
};

export function ResourceCardTrustHint({
  state,
  className,
}: {
  state: ResourceCardTrustDecisionState;
  className?: string;
}) {
  if (!state.showHint) return null;

  return (
    <p
      className={cn(
        "inline-flex items-start gap-1.5 rounded-md border px-2 py-1 text-[11px] leading-snug",
        KIND_STYLES[state.kind],
        className,
      )}
      role="status"
    >
      <GitCompare className="mt-0.5 h-3 w-3 shrink-0 opacity-70" aria-hidden />
      <span>{state.hint}</span>
    </p>
  );
}
