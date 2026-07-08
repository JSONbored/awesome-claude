import { AlertTriangle, CheckCircle2, Circle, Scale, ShieldAlert } from "lucide-react";
import type { CompareDecisionBriefState, CompareBriefTone } from "@/lib/compare-decision-brief";
import { cn } from "@/lib/utils";

const TONE_BADGE: Record<CompareBriefTone, string> = {
  ready: "border-trust-trusted/30 bg-trust-trusted/10 text-trust-trusted",
  review: "border-accent/30 bg-accent/10 text-ink",
  caution: "border-amber-500/30 bg-amber-500/10 text-amber-900",
  blocked: "border-trust-blocked/30 bg-trust-blocked/10 text-trust-blocked",
};

const TONE_LABEL: Record<CompareBriefTone, string> = {
  ready: "Ready",
  review: "Review",
  caution: "Caution",
  blocked: "Blocked",
};

function ChecklistMark({ done }: { done: boolean }) {
  return done ? (
    <CheckCircle2 className="h-3.5 w-3.5 text-trust-trusted" aria-hidden />
  ) : (
    <Circle className="h-3.5 w-3.5 text-ink-subtle" aria-hidden />
  );
}

export function CompareDecisionBriefPanel({
  state,
  className,
  compact = false,
}: {
  state: CompareDecisionBriefState;
  className?: string;
  compact?: boolean;
}) {
  if (state.comparedCount === 0) return null;

  return (
    <section
      aria-label="Decision brief"
      className={cn("rounded-xl border border-border bg-surface p-4 sm:p-5", className)}
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="eyebrow">Decision brief</p>
          <h3 className="mt-1 text-base font-semibold text-ink sm:text-lg">
            Ranked next-step guidance
          </h3>
          <p className="mt-1.5 text-sm text-ink-muted">{state.summary}</p>
        </div>
        <div className="inline-flex items-center gap-1 rounded-full border border-border bg-background px-2.5 py-1 text-xs text-ink-muted">
          <Scale className="h-3.5 w-3.5" aria-hidden />
          {state.comparedCount} compared
        </div>
      </div>

      {(state.hasDecisionDivergence || state.hasActionDivergence) && (
        <div className="mt-3 rounded-lg border border-amber-500/30 bg-amber-500/5 px-3 py-2 text-xs">
          <div className="flex items-start gap-2">
            <ShieldAlert className="mt-0.5 h-3.5 w-3.5 shrink-0 text-amber-700" aria-hidden />
            <div className="min-w-0">
              <p className="text-amber-900">
                Divergence detected
                {state.divergingLabels.length > 0
                  ? ` on ${state.divergingLabels.slice(0, 4).join(", ")}`
                  : ""}
                .
              </p>
              {state.hasActionDivergence ? (
                <p className="mt-0.5 text-amber-800">
                  Next-step actions differ between compared entries.
                </p>
              ) : null}
            </div>
          </div>
        </div>
      )}

      <div
        className={cn("mt-4 grid gap-3", compact ? "grid-cols-1" : "grid-cols-1 xl:grid-cols-2")}
      >
        {state.entryBriefs.map((brief) => (
          <article
            key={brief.entryRef}
            className={cn(
              "rounded-lg border border-border bg-background p-3",
              brief.rank === 1 && "ring-1 ring-trust-trusted/30",
            )}
          >
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="rounded bg-surface-2 px-1.5 py-0.5 font-mono text-[10px] text-ink-subtle">
                    #{brief.rank}
                  </span>
                  <h4 className="truncate text-sm font-semibold text-ink">{brief.title}</h4>
                </div>
                <p className="mt-1 text-xs text-ink-muted">{brief.headline}</p>
              </div>
              <div className="text-right">
                <span
                  className={cn(
                    "inline-flex rounded-full border px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide",
                    TONE_BADGE[brief.tone],
                  )}
                >
                  {TONE_LABEL[brief.tone]}
                </span>
                <p className="mt-1 font-mono text-xs text-ink">Score {brief.score}</p>
              </div>
            </div>

            <p className="mt-2 text-xs text-ink">{brief.recommendation}</p>
            <p className="mt-1 text-[11px] text-ink-subtle">{brief.compareDeltaSummary}</p>

            <ul className="mt-2 flex flex-wrap gap-1.5">
              {brief.reasons.map((reason) => (
                <li
                  key={reason}
                  className="rounded-full border border-border bg-surface px-2 py-0.5 text-[10px] text-ink-muted"
                >
                  {reason}
                </li>
              ))}
            </ul>

            {!compact && (
              <ul className="mt-3 space-y-1.5">
                {brief.checklist.map((item) => (
                  <li
                    key={item.id}
                    className="flex items-start justify-between gap-2 rounded-md border border-border/70 px-2 py-1.5"
                  >
                    <div className="min-w-0">
                      <p className="text-[11px] font-medium text-ink">
                        {item.label}
                        {item.required ? (
                          <span className="ml-1 rounded bg-ink/10 px-1 py-0.5 text-[9px] uppercase tracking-wide text-ink-muted">
                            Required
                          </span>
                        ) : null}
                      </p>
                      <p className="mt-0.5 text-[10px] text-ink-subtle">{item.detail}</p>
                    </div>
                    <ChecklistMark done={item.done} />
                  </li>
                ))}
              </ul>
            )}

            {compact && brief.checklist.some((item) => item.required && !item.done) ? (
              <div className="mt-2 inline-flex items-center gap-1.5 rounded-md border border-amber-500/30 bg-amber-500/10 px-2 py-1 text-[10px] text-amber-900">
                <AlertTriangle className="h-3 w-3" aria-hidden />
                Required checks still pending
              </div>
            ) : null}
          </article>
        ))}
      </div>
    </section>
  );
}
