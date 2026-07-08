import type {
  CompareRolloutReadinessState,
  RolloutPresetId,
} from "@/lib/compare-rollout-readiness";
import { cn } from "@/lib/utils";

function tierClass(tier: "ready" | "review" | "hold"): string {
  if (tier === "ready") return "border-trust-trusted/30 bg-trust-trusted/5 text-trust-trusted";
  if (tier === "hold") return "border-trust-blocked/30 bg-trust-blocked/5 text-trust-blocked";
  return "border-amber-500/30 bg-amber-500/5 text-amber-900";
}

const PRESETS: { id: RolloutPresetId; label: string }[] = [
  { id: "prototype", label: "Prototype" },
  { id: "team", label: "Team" },
  { id: "production", label: "Production" },
];

export function CompareRolloutReadinessPanel({
  state,
  selectedPreset,
  onSelectPreset,
  compact = false,
  className,
}: {
  state: CompareRolloutReadinessState;
  selectedPreset: RolloutPresetId;
  onSelectPreset: (preset: RolloutPresetId) => void;
  compact?: boolean;
  className?: string;
}) {
  if (state.comparedCount === 0) return null;
  return (
    <section className={cn("rounded-xl border border-border bg-surface p-4 sm:p-5", className)}>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="eyebrow">Rollout readiness</p>
          <h3 className="mt-1 text-base font-semibold text-ink sm:text-lg">{state.heading}</h3>
          <p className="mt-1 text-sm text-ink-muted">{state.summary}</p>
        </div>
        <span className="rounded-full border border-border bg-background px-2 py-0.5 font-mono text-[10px] text-ink-subtle">
          {state.comparedCount} entries
        </span>
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        {PRESETS.map((preset) => {
          const active = selectedPreset === preset.id;
          return (
            <button
              key={preset.id}
              type="button"
              onClick={() => onSelectPreset(preset.id)}
              className={cn(
                "inline-flex rounded-md border px-2.5 py-1 text-xs transition",
                active
                  ? "border-ink bg-ink text-background"
                  : "border-border bg-background text-ink-muted hover:text-ink",
              )}
            >
              {preset.label}
            </button>
          );
        })}
      </div>

      <div className="mt-3 grid gap-2.5">
        {state.plans.map((plan) => (
          <article
            key={plan.entryRef}
            className="rounded-lg border border-border bg-background p-3"
          >
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div>
                <h4 className="text-sm font-semibold text-ink">{plan.title}</h4>
                <p className="mt-0.5 text-[11px] text-ink-muted">{plan.summary}</p>
              </div>
              <div className="text-right">
                <span
                  className={cn(
                    "inline-flex rounded-full border px-2 py-0.5 text-[10px] uppercase tracking-wide",
                    tierClass(plan.tier),
                  )}
                >
                  {plan.tier}
                </span>
                <p className="mt-1 font-mono text-xs text-ink">{plan.score}/100</p>
              </div>
            </div>

            {!compact && plan.blockers.length > 0 ? (
              <p className="mt-2 text-[11px] text-trust-blocked">
                Blockers: {plan.blockers.join(", ")}
              </p>
            ) : null}

            <div className="mt-2 flex flex-wrap gap-1.5">
              {plan.checklist.map((item) => (
                <span
                  key={`${plan.entryRef}-${item.id}`}
                  className={cn(
                    "rounded border px-2 py-0.5 text-[10px]",
                    item.tone === "complete" &&
                      "border-trust-trusted/30 bg-trust-trusted/5 text-trust-trusted",
                    item.tone === "warning" && "border-amber-500/30 bg-amber-500/5 text-amber-900",
                    item.tone === "blocked" &&
                      "border-trust-blocked/30 bg-trust-blocked/5 text-trust-blocked",
                  )}
                >
                  {item.label}
                  {item.required ? " (required)" : ""}
                </span>
              ))}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
