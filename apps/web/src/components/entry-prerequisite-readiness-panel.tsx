import { useCallback, useMemo, useState } from "react";
import { CheckCircle2, Circle, Clock, RotateCcw } from "lucide-react";
import type { EntryPrerequisiteReadinessState } from "@/lib/entry-prerequisite-readiness";
import {
  entryPrerequisiteResetAnalyticsData,
  entryPrerequisiteResetAnalyticsEvent,
  entryPrerequisiteToggleAnalyticsData,
  entryPrerequisiteToggleAnalyticsEvent,
} from "@/lib/entry-prerequisite-events";
import { trackEvent } from "@/lib/analytics";
import { cn } from "@/lib/utils";

export function EntryPrerequisiteReadinessPanel({
  state,
  category,
  slug,
  className,
}: {
  state: EntryPrerequisiteReadinessState;
  category: string;
  slug: string;
  className?: string;
}) {
  const [checked, setChecked] = useState<Record<string, boolean>>({});

  const checkedCount = useMemo(
    () => state.steps.reduce((total, step) => total + (checked[step.id] ? 1 : 0), 0),
    [state.steps, checked],
  );

  const toggle = useCallback(
    (stepId: string, kind: EntryPrerequisiteReadinessState["steps"][number]["kind"]) => {
      setChecked((prev) => {
        const next = { ...prev, [stepId]: !prev[stepId] };
        const nextChecked = state.steps.reduce((total, step) => total + (next[step.id] ? 1 : 0), 0);
        const nowChecked = Boolean(next[stepId]);
        trackEvent(
          entryPrerequisiteToggleAnalyticsEvent(nowChecked),
          entryPrerequisiteToggleAnalyticsData(category, slug, kind, nextChecked, state.total),
        );
        return next;
      });
    },
    [state.steps, state.total, category, slug],
  );

  const reset = useCallback(() => {
    setChecked({});
    trackEvent(
      entryPrerequisiteResetAnalyticsEvent(),
      entryPrerequisiteResetAnalyticsData(category, slug, state.total),
    );
  }, [category, slug, state.total]);

  if (!state.showPanel) {
    return null;
  }

  const allDone = checkedCount === state.total;

  return (
    <section
      id="prerequisite-readiness"
      aria-label="Prerequisite readiness"
      className={cn("rounded-xl border border-border bg-surface p-4 sm:p-5", className)}
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="eyebrow">Prerequisite readiness</p>
          <h3 className="mt-1 text-base font-semibold text-ink sm:text-lg">{state.heading}</h3>
          <p className="mt-1.5 text-sm text-ink-muted">{state.summary}</p>
        </div>
        <span
          className={cn(
            "inline-flex shrink-0 rounded-full border px-2.5 py-0.5 font-mono text-[11px] uppercase tracking-wide",
            allDone
              ? "border-trust-trusted/40 bg-trust-trusted/10 text-trust-trusted"
              : "border-border bg-background text-ink-muted",
          )}
        >
          {checkedCount}/{state.total} ready
        </span>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        {state.kinds.map((kind) => (
          <span
            key={kind.kind}
            className="inline-flex items-center gap-1 rounded-full border border-border bg-background px-2.5 py-1 text-[11px] text-ink-muted"
          >
            {kind.kindLabel}
            <span className="font-mono text-ink">{kind.count}</span>
          </span>
        ))}
        {state.setupTime ? (
          <span className="inline-flex items-center gap-1 rounded-full border border-border bg-background px-2.5 py-1 text-[11px] text-ink-muted">
            <Clock className="h-3 w-3" aria-hidden />
            {state.setupTime}
          </span>
        ) : null}
      </div>

      <ul className="mt-4 space-y-2">
        {state.steps.map((step) => {
          const isChecked = Boolean(checked[step.id]);
          return (
            <li key={step.id}>
              <button
                type="button"
                aria-pressed={isChecked}
                onClick={() => toggle(step.id, step.kind)}
                className={cn(
                  "flex w-full items-start gap-2.5 rounded-lg border px-3 py-2.5 text-left transition-colors",
                  isChecked
                    ? "border-trust-trusted/40 bg-trust-trusted/5"
                    : "border-border bg-background hover:border-accent/50",
                )}
              >
                {isChecked ? (
                  <CheckCircle2
                    className="mt-0.5 h-4 w-4 shrink-0 text-trust-trusted"
                    aria-hidden
                  />
                ) : (
                  <Circle className="mt-0.5 h-4 w-4 shrink-0 text-ink-muted" aria-hidden />
                )}
                <span className="min-w-0">
                  <span className="flex flex-wrap items-center gap-1.5">
                    <span className="rounded bg-ink/10 px-1 py-0.5 text-[9px] uppercase tracking-wide text-ink-muted">
                      {step.kindLabel}
                    </span>
                  </span>
                  <span
                    className={cn(
                      "mt-1 block text-sm text-ink",
                      isChecked && "line-through text-ink-muted",
                    )}
                  >
                    {step.label}
                  </span>
                  <span className="mt-0.5 block text-xs text-ink-muted">{step.hint}</span>
                </span>
              </button>
            </li>
          );
        })}
      </ul>

      {checkedCount > 0 ? (
        <button
          type="button"
          onClick={reset}
          className="mt-3 inline-flex items-center gap-1.5 rounded-md border border-border bg-background px-2.5 py-1.5 text-xs text-ink-muted transition-colors hover:text-ink"
        >
          <RotateCcw className="h-3 w-3" aria-hidden />
          Reset checklist
        </button>
      ) : null}
    </section>
  );
}
