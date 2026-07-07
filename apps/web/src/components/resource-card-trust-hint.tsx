import { GitCompare } from "lucide-react";
import type { ResourceCardTrustDecisionState } from "@/lib/resource-card-trust-decision";
import { resourceCardTrustHintToneClass } from "@/lib/resource-card-trust-decision";
import { cn } from "@/lib/utils";

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
        resourceCardTrustHintToneClass(state.kind),
        className,
      )}
      role="status"
    >
      <GitCompare className="mt-0.5 h-3 w-3 shrink-0 opacity-70" aria-hidden />
      <span>{state.hint}</span>
    </p>
  );
}
