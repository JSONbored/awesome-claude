import { Link } from "@tanstack/react-router";
import type {
  CompareBenchmarkPresetId,
  EntryCompareBenchmarkState,
} from "@/lib/entry-compare-benchmark";
import { compareBenchmarkVerdictClass } from "@/lib/entry-compare-benchmark";
import {
  detailCompareBenchmarkEntryAnalyticsData,
  detailCompareBenchmarkEntryAnalyticsEvent,
  parseDetailEntryRef,
} from "@/lib/entry-detail-decision-preset-cta-events";
import { trackEvent } from "@/lib/analytics";
import { cn } from "@/lib/utils";

const PRESETS: { id: CompareBenchmarkPresetId; label: string }[] = [
  { id: "balanced", label: "Balanced" },
  { id: "security", label: "Security" },
  { id: "rollout", label: "Rollout" },
];

export function EntryCompareBenchmarkPanel({
  state,
  category,
  slug,
  selectedPreset,
  onSelectPreset,
  className,
}: {
  state: EntryCompareBenchmarkState;
  category: string;
  slug: string;
  selectedPreset: CompareBenchmarkPresetId;
  onSelectPreset: (preset: CompareBenchmarkPresetId) => void;
  className?: string;
}) {
  if (!state.showPanel) return null;

  return (
    <section
      id="compare-benchmark"
      aria-label="Compare benchmark"
      className={cn("rounded-xl border border-border bg-surface p-4 sm:p-5", className)}
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="eyebrow">Compare benchmark</p>
          <h3 className="mt-1 text-base font-semibold text-ink sm:text-lg">{state.heading}</h3>
          <p className="mt-1.5 text-sm text-ink-muted">{state.summary}</p>
        </div>
        <div className="text-right">
          <p className="font-mono text-xs text-ink-subtle">{state.targetRef}</p>
          <p className="mt-1 font-mono text-sm text-ink">{state.targetScore}/100</p>
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

      {state.benchmarkSummary ? (
        <p className="mt-3 text-sm text-ink-muted">{state.benchmarkSummary}</p>
      ) : null}

      <div className="mt-3 grid gap-2">
        {state.rows.map((row) => {
          const parsed = parseDetailEntryRef(row.entryRef);
          const title = <h4 className="text-sm font-semibold text-ink">{row.title}</h4>;
          return (
            <article
              key={row.entryRef}
              className="rounded-lg border border-border bg-background p-3"
            >
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div className="min-w-0">
                  {parsed ? (
                    <Link
                      to="/entry/$category/$slug"
                      params={{ category: parsed.category, slug: parsed.slug }}
                      onClick={() =>
                        trackEvent(
                          detailCompareBenchmarkEntryAnalyticsEvent(),
                          detailCompareBenchmarkEntryAnalyticsData(
                            category,
                            slug,
                            row.entryRef,
                            selectedPreset,
                            row.verdict,
                            row.totalScore,
                            row.delta,
                            state.rows.length,
                          ),
                        )
                      }
                      className="underline-offset-2 hover:text-accent hover:underline"
                    >
                      {title}
                    </Link>
                  ) : (
                    title
                  )}
                  <p className="mt-0.5 text-[11px] text-ink-muted">{row.summary}</p>
                </div>
                <div className="text-right">
                  <span
                    className={cn(
                      "inline-flex rounded-full border px-2 py-0.5 text-[10px] uppercase tracking-wide",
                      compareBenchmarkVerdictClass(row.verdict),
                    )}
                  >
                    {row.verdict}
                  </span>
                  <p className="mt-1 font-mono text-xs text-ink">
                    {row.totalScore}/100 ({row.delta >= 0 ? "+" : ""}
                    {row.delta})
                  </p>
                </div>
              </div>

              <div className="mt-2 grid gap-1.5 sm:grid-cols-2">
                {row.dimensions.map((dimension) => (
                  <div
                    key={`${row.entryRef}-${dimension.id}`}
                    className="rounded border border-border px-2 py-1"
                  >
                    <p className="text-[10px] uppercase tracking-wide text-ink-subtle">
                      {dimension.label}
                    </p>
                    <p className="text-[11px] text-ink-muted">
                      {dimension.score}/100 · {dimension.detail}
                    </p>
                  </div>
                ))}
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
