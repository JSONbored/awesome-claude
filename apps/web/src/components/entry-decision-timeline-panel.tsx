import type {
  DecisionTimelinePresetId,
  EntryDecisionTimelineState,
} from "@/lib/entry-decision-timeline";
import { cn } from "@/lib/utils";

const PRESETS: { id: DecisionTimelinePresetId; label: string }[] = [
  { id: "fast-track", label: "Fast track" },
  { id: "balanced", label: "Balanced" },
  { id: "security-first", label: "Security first" },
];

function toneClass(tone: "complete" | "warning" | "critical"): string {
  if (tone === "critical") return "border-trust-blocked/35 bg-trust-blocked/5";
  if (tone === "warning") return "border-amber-500/35 bg-amber-500/5";
  return "border-border bg-background";
}

function riskClass(score: number): string {
  if (score >= 60) return "border-trust-blocked/40 bg-trust-blocked/10 text-trust-blocked";
  if (score >= 30) return "border-amber-500/40 bg-amber-500/10 text-amber-900";
  return "border-trust-trusted/40 bg-trust-trusted/10 text-trust-trusted";
}

export function EntryDecisionTimelinePanel({
  state,
  selectedPreset,
  onSelectPreset,
  className,
}: {
  state: EntryDecisionTimelineState;
  selectedPreset: DecisionTimelinePresetId;
  onSelectPreset: (preset: DecisionTimelinePresetId) => void;
  className?: string;
}) {
  return (
    <section
      id="decision-timeline"
      aria-label="Decision timeline"
      className={cn("rounded-xl border border-border bg-surface p-4 sm:p-5", className)}
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="eyebrow">Decision timeline</p>
          <h3 className="mt-1 text-base font-semibold text-ink sm:text-lg">{state.heading}</h3>
          <p className="mt-1.5 text-sm text-ink-muted">{state.summary}</p>
        </div>
        <span
          className={cn(
            "inline-flex rounded-full border px-2 py-0.5 font-mono text-[10px] uppercase tracking-wide",
            riskClass(state.riskScore),
          )}
        >
          Risk {state.riskScore}
        </span>
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        {PRESETS.map((preset) => (
          <button
            key={preset.id}
            type="button"
            aria-pressed={selectedPreset === preset.id}
            onClick={() => onSelectPreset(preset.id)}
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

      <div className="mt-4 grid gap-2">
        {state.steps.map((step) => (
          <article
            key={step.id}
            className={cn("rounded-md border px-3 py-2.5", toneClass(step.tone))}
          >
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div className="min-w-0">
                <p className="text-[10px] uppercase tracking-wide text-ink-subtle">{step.phase}</p>
                <h4 className="text-xs font-semibold text-ink">
                  {step.title}
                  {step.required ? (
                    <span className="ml-1 rounded bg-ink/10 px-1 py-0.5 text-[9px] uppercase tracking-wide text-ink-muted">
                      Required
                    </span>
                  ) : null}
                </h4>
                <p className="mt-1 text-[11px] text-ink-muted">{step.detail}</p>
              </div>
              <span className="text-[10px] uppercase tracking-wide text-ink-subtle">
                {step.done ? "Done" : "Pending"}
              </span>
            </div>
          </article>
        ))}
      </div>

      {state.blockers.length > 0 ? (
        <p className="mt-3 rounded-md border border-trust-blocked/35 bg-trust-blocked/5 px-3 py-2 text-xs text-trust-blocked">
          Blockers: {state.blockers.join(", ")}
        </p>
      ) : (
        <p className="mt-3 rounded-md border border-trust-trusted/35 bg-trust-trusted/5 px-3 py-2 text-xs text-trust-trusted">
          No required blockers for this timeline preset.
        </p>
      )}

      {state.benchmarkSummary ? (
        <p className="mt-3 text-xs text-ink-muted">{state.benchmarkSummary}</p>
      ) : null}
      {state.benchmarks.length > 0 ? (
        <div className="mt-2 rounded-md border border-border bg-background px-3 py-2">
          <p className="text-[11px] font-medium text-ink">Compare benchmark deltas</p>
          <ul className="mt-1.5 space-y-1">
            {state.benchmarks.map((benchmark) => (
              <li
                key={benchmark.entryRef}
                className="flex items-center justify-between gap-2 text-[11px]"
              >
                <span className="truncate text-ink">{benchmark.title}</span>
                <span className="font-mono text-ink-muted">
                  {benchmark.score} ({benchmark.delta >= 0 ? "+" : ""}
                  {benchmark.delta})
                </span>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </section>
  );
}
