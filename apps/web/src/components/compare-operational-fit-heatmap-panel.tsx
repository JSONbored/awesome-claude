import type {
  CompareOperationalFitHeatmapState,
  OperationalFitPresetId,
} from "@/lib/compare-operational-fit-heatmap";
import { operationalFitToneClass } from "@/lib/compare-operational-fit-heatmap-lib";
import { cn } from "@/lib/utils";

const PRESETS: { id: OperationalFitPresetId; label: string }[] = [
  { id: "team-default", label: "Team default" },
  { id: "security-hardening", label: "Security hardening" },
  { id: "rapid-adoption", label: "Rapid adoption" },
];

export function CompareOperationalFitHeatmapPanel({
  state,
  selectedPreset,
  onSelectPreset,
  compact = false,
  className,
}: {
  state: CompareOperationalFitHeatmapState;
  selectedPreset: OperationalFitPresetId;
  onSelectPreset: (preset: OperationalFitPresetId) => void;
  compact?: boolean;
  className?: string;
}) {
  if (state.entries.length === 0) return null;

  return (
    <section className={cn("rounded-xl border border-border bg-surface p-4 sm:p-5", className)}>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="eyebrow">Operational fit heatmap</p>
          <h3 className="mt-1 text-base font-semibold text-ink sm:text-lg">{state.heading}</h3>
          <p className="mt-1 text-sm text-ink-muted">{state.summary}</p>
        </div>
        <span className="rounded-full border border-border bg-background px-2 py-0.5 font-mono text-[10px] text-ink-subtle">
          best {state.bestEntryRef ?? "n/a"}
        </span>
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
            className="rounded-md border border-border bg-background p-3"
          >
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div className="min-w-0">
                <h4 className="text-sm font-semibold text-ink">{entry.title}</h4>
                <p className="mt-0.5 text-[11px] text-ink-muted">{entry.recommendation}</p>
              </div>
              <div className="text-right">
                <span
                  className={cn(
                    "inline-flex rounded-full border px-2 py-0.5 text-[10px] uppercase tracking-wide",
                    operationalFitToneClass(entry.fitTone),
                  )}
                >
                  {entry.fitTone}
                </span>
                <p className="mt-1 font-mono text-xs text-ink">{entry.totalScore}/100</p>
              </div>
            </div>

            {!compact ? (
              <div className="mt-2 grid gap-1.5 sm:grid-cols-2">
                {entry.cells.map((cell) => (
                  <div
                    key={`${entry.entryRef}-${cell.axisId}`}
                    className="rounded border border-border px-2 py-1"
                  >
                    <p className="text-[10px] uppercase tracking-wide text-ink-subtle">
                      {cell.axisId}
                    </p>
                    <p className="text-[11px] text-ink-muted">{cell.reason}</p>
                  </div>
                ))}
              </div>
            ) : null}

            <p className="mt-2 text-[11px] text-ink-subtle">Confidence {entry.confidence}%</p>
          </article>
        ))}
      </div>
    </section>
  );
}
