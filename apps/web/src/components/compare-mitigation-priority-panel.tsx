import type {
  CompareMitigationPriorityState,
  MitigationPriorityPresetId,
} from "@/lib/compare-mitigation-priority";
import { mitigationPriorityTierClass } from "@/lib/compare-mitigation-priority";
import { cn } from "@/lib/utils";

const PRESETS: { id: MitigationPriorityPresetId; label: string }[] = [
  { id: "balanced", label: "Balanced" },
  { id: "security-first", label: "Security-first" },
  { id: "rollout-first", label: "Rollout-first" },
];

export function CompareMitigationPriorityPanel({
  state,
  selectedPreset,
  onSelectPreset,
  compact = false,
  className,
}: {
  state: CompareMitigationPriorityState;
  selectedPreset: MitigationPriorityPresetId;
  onSelectPreset: (preset: MitigationPriorityPresetId) => void;
  compact?: boolean;
  className?: string;
}) {
  if (state.entries.length === 0) return null;

  return (
    <section
      aria-label="Mitigation priority queue"
      className={cn("rounded-xl border border-border bg-surface p-4 sm:p-5", className)}
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="eyebrow">Mitigation priority queue</p>
          <h3 className="mt-1 text-base font-semibold text-ink sm:text-lg">{state.heading}</h3>
          <p className="mt-1.5 text-sm text-ink-muted">{state.summary}</p>
        </div>
        <div className="flex flex-wrap gap-1.5">
          <span className="rounded-full border border-border bg-background px-2 py-0.5 font-mono text-[10px] text-ink-subtle">
            urgent {state.urgentCount}
          </span>
          <span className="rounded-full border border-border bg-background px-2 py-0.5 font-mono text-[10px] text-ink-subtle">
            watch {state.watchCount}
          </span>
        </div>
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        {PRESETS.map((preset) => (
          <button
            key={preset.id}
            type="button"
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

      <div className="mt-3 grid gap-2">
        {state.entries.map((entry) => (
          <article
            key={entry.entryRef}
            className="rounded-lg border border-border bg-background p-3"
          >
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div className="min-w-0">
                <h4 className="text-sm font-semibold text-ink">{entry.title}</h4>
                <p className="mt-0.5 text-[11px] text-ink-muted">{entry.rationale}</p>
              </div>
              <div className="text-right">
                <span
                  className={cn(
                    "inline-flex rounded-full border px-2 py-0.5 text-[10px] uppercase tracking-wide",
                    mitigationPriorityTierClass(entry.tier),
                  )}
                >
                  {entry.tier}
                </span>
                <p className="mt-1 font-mono text-xs text-ink">{entry.priorityScore}/100</p>
              </div>
            </div>

            {!compact && entry.actions.length > 0 ? (
              <div className="mt-2 grid gap-1.5 sm:grid-cols-2">
                {entry.actions.map((action) => (
                  <div
                    key={`${entry.entryRef}-${action.signalId}`}
                    className="rounded border border-border px-2 py-1"
                  >
                    <p className="text-[10px] uppercase tracking-wide text-ink-subtle">
                      {action.label}
                    </p>
                    <p className="text-[11px] text-ink-muted">{action.detail}</p>
                  </div>
                ))}
              </div>
            ) : null}

            <p className="mt-2 text-[11px] text-ink-subtle">
              Trust {entry.trust} · {entry.actions.length} mitigation items
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}
