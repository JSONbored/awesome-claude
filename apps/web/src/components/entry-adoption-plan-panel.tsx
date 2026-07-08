import { AlertTriangle, CheckCircle2, Circle, ShieldAlert } from "lucide-react";
import type { AdoptionPlanPresetId, EntryAdoptionPlanState } from "@/lib/entry-adoption-plan";
import { ENTRY_ADOPTION_PLAN_PRESETS } from "@/lib/entry-adoption-plan";
import { cn } from "@/lib/utils";

function RiskBadge({ score }: { score: number }) {
  const tone =
    score >= 60
      ? "border-trust-blocked/40 bg-trust-blocked/10 text-trust-blocked"
      : score >= 30
        ? "border-amber-500/40 bg-amber-500/10 text-amber-900"
        : "border-trust-trusted/40 bg-trust-trusted/10 text-trust-trusted";
  return (
    <span
      className={cn(
        "inline-flex rounded-full border px-2 py-0.5 font-mono text-[10px] uppercase tracking-wide",
        tone,
      )}
    >
      Risk {score}
    </span>
  );
}

function StepRow({
  title,
  detail,
  required,
  done,
  severity,
}: {
  title: string;
  detail: string;
  required: boolean;
  done: boolean;
  severity: "ok" | "warn" | "critical";
}) {
  return (
    <li
      className={cn(
        "rounded-md border px-2.5 py-2",
        severity === "critical"
          ? "border-trust-blocked/30 bg-trust-blocked/5"
          : severity === "warn"
            ? "border-amber-500/30 bg-amber-500/5"
            : "border-border bg-background",
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="text-xs font-medium text-ink">
            {title}
            {required ? (
              <span className="ml-1 rounded bg-ink/10 px-1 py-0.5 text-[9px] uppercase tracking-wide text-ink-muted">
                Required
              </span>
            ) : null}
          </p>
          <p className="mt-0.5 text-[11px] text-ink-muted">{detail}</p>
        </div>
        <span
          className={cn(
            "mt-0.5 inline-flex shrink-0 items-center gap-1 text-[10px] uppercase tracking-wide",
            done ? "text-trust-trusted" : "text-ink-subtle",
          )}
        >
          {done ? <CheckCircle2 className="h-3.5 w-3.5" /> : <Circle className="h-3.5 w-3.5" />}
          {done ? "Done" : "Pending"}
        </span>
      </div>
    </li>
  );
}

export function EntryAdoptionPlanPanel({
  state,
  selectedPreset,
  onSelectPreset,
  className,
}: {
  state: EntryAdoptionPlanState;
  selectedPreset: AdoptionPlanPresetId;
  onSelectPreset: (preset: AdoptionPlanPresetId) => void;
  className?: string;
}) {
  return (
    <section
      id="adoption-plan"
      aria-label="Adoption plan"
      className={cn("rounded-xl border border-border bg-surface p-4 sm:p-5", className)}
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="eyebrow">Adoption plan</p>
          <h3 className="mt-1 text-base font-semibold text-ink sm:text-lg">{state.heading}</h3>
          <p className="mt-1.5 text-sm text-ink-muted">{state.summary}</p>
        </div>
        <RiskBadge score={state.riskScore} />
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        {ENTRY_ADOPTION_PLAN_PRESETS.map((preset) => (
          <button
            key={preset.id}
            type="button"
            aria-pressed={selectedPreset === preset.id}
            onClick={() => onSelectPreset(preset.id)}
            title={preset.description}
            className={cn(
              "rounded-full border px-3 py-1.5 text-xs transition-colors",
              selectedPreset === preset.id
                ? "border-accent bg-accent/10 text-ink"
                : "border-border bg-background text-ink-muted hover:text-ink",
            )}
          >
            {preset.label}
          </button>
        ))}
      </div>

      {state.compareSummary ? (
        <p className="mt-3 rounded-md border border-border bg-background px-3 py-2 text-xs text-ink-muted">
          {state.compareSummary}
        </p>
      ) : null}

      {state.blockers.length > 0 ? (
        <div className="mt-3 rounded-lg border border-trust-blocked/40 bg-trust-blocked/5 px-3 py-2.5 text-xs">
          <div className="mb-1 inline-flex items-center gap-1.5 font-medium text-trust-blocked">
            <ShieldAlert className="h-3.5 w-3.5" aria-hidden />
            Adoption blockers
          </div>
          <ul className="space-y-1 text-ink-muted">
            {state.blockers.map((blocker) => (
              <li key={blocker} className="inline-flex items-start gap-1.5">
                <AlertTriangle className="mt-0.5 h-3 w-3 shrink-0 text-trust-blocked" />
                <span>{blocker}</span>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      <div className="mt-4 grid gap-3 lg:grid-cols-3">
        {state.stages.map((stage) => (
          <article key={stage.id} className="rounded-lg border border-border bg-background p-3">
            <h4 className="text-sm font-semibold text-ink">{stage.title}</h4>
            <p className="mt-1 text-xs text-ink-muted">{stage.summary}</p>
            <ul className="mt-2 space-y-1.5">
              {stage.steps.map((step) => (
                <StepRow
                  key={step.id}
                  title={step.title}
                  detail={step.detail}
                  required={step.required}
                  done={step.done}
                  severity={step.severity}
                />
              ))}
            </ul>
          </article>
        ))}
      </div>
    </section>
  );
}
