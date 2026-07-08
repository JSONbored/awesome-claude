import type {
  CompareScenarioId,
  CompareScenarioRankingState,
} from "@/lib/compare-scenario-ranking";
import { COMPARE_SCENARIO_PRESETS } from "@/lib/compare-scenario-ranking";
import { cn } from "@/lib/utils";

function scoreDeltaText(delta: number): string {
  if (delta === 0) return "Top score";
  if (delta > 0) return `+${delta}`;
  return `${delta}`;
}

export function CompareScenarioRankingPanel({
  state,
  selectedScenario,
  onSelectScenario,
  compact = false,
  className,
}: {
  state: CompareScenarioRankingState;
  selectedScenario: CompareScenarioId;
  onSelectScenario: (scenario: CompareScenarioId) => void;
  compact?: boolean;
  className?: string;
}) {
  if (state.ranked.length === 0) return null;

  return (
    <section
      aria-label="Scenario ranking"
      className={cn("rounded-xl border border-border bg-surface p-4 sm:p-5", className)}
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="eyebrow">Scenario ranking</p>
          <h3 className="mt-1 text-base font-semibold text-ink sm:text-lg">
            Compare by decision preset
          </h3>
          <p className="mt-1.5 text-sm text-ink-muted">{state.summary}</p>
        </div>
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        {COMPARE_SCENARIO_PRESETS.map((preset) => (
          <button
            key={preset.id}
            type="button"
            onClick={() => onSelectScenario(preset.id)}
            aria-pressed={selectedScenario === preset.id}
            className={cn(
              "rounded-full border px-3 py-1.5 text-xs transition-colors",
              selectedScenario === preset.id
                ? "border-accent bg-accent/10 text-ink"
                : "border-border bg-background text-ink-muted hover:text-ink",
            )}
            title={preset.description}
          >
            {preset.shortLabel}
          </button>
        ))}
      </div>

      <div
        className={cn("mt-3 grid gap-2", compact ? "grid-cols-1" : "grid-cols-1 xl:grid-cols-2")}
      >
        {state.ranked.map((item) => (
          <article
            key={item.entryRef}
            className={cn(
              "rounded-lg border border-border bg-background p-3",
              item.rank === 1 && "ring-1 ring-accent/40",
            )}
          >
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="rounded bg-surface-2 px-1.5 py-0.5 font-mono text-[10px] text-ink-subtle">
                    #{item.rank}
                  </span>
                  <h4 className="truncate text-sm font-semibold text-ink">{item.title}</h4>
                </div>
                <p className="mt-1 text-[11px] text-ink-muted">{item.rationale[0]}</p>
              </div>
              <div className="text-right">
                <p className="font-mono text-xs text-ink">Score {item.score}</p>
                <p className="text-[10px] text-ink-subtle">{scoreDeltaText(item.deltaFromTop)}</p>
              </div>
            </div>
            <ul className="mt-2 flex flex-wrap gap-1.5">
              {item.rationale.slice(1).map((reason) => (
                <li
                  key={reason}
                  className="rounded-full border border-border bg-surface px-2 py-0.5 text-[10px] text-ink-muted"
                >
                  {reason}
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </section>
  );
}
