import { Link } from "@tanstack/react-router";
import { cellToneClass, riskTone } from "@/lib/entry-evidence-tone-lib";
import {
  type EntryEvidenceReadinessMatrixState,
  type EvidenceMatrixPresetId,
} from "@/lib/entry-evidence-readiness-matrix";
import {
  detailEvidenceMatrixBenchmarkEntryAnalyticsData,
  detailEvidenceMatrixBenchmarkEntryAnalyticsEvent,
  parseDetailEntryRef,
} from "@/lib/entry-detail-decision-preset-cta-events";
import { trackEvent } from "@/lib/analytics";
import { cn } from "@/lib/utils";

const PRESETS: { id: EvidenceMatrixPresetId; label: string }[] = [
  { id: "balanced", label: "Balanced" },
  { id: "strict", label: "Strict" },
  { id: "pilot", label: "Pilot" },
];

export function EntryEvidenceReadinessMatrix({
  state,
  category,
  slug,
  selectedPreset,
  onSelectPreset,
  className,
}: {
  state: EntryEvidenceReadinessMatrixState;
  category: string;
  slug: string;
  selectedPreset: EvidenceMatrixPresetId;
  onSelectPreset: (preset: EvidenceMatrixPresetId) => void;
  className?: string;
}) {
  return (
    <section
      id="evidence-matrix"
      aria-label="Evidence readiness matrix"
      className={cn("rounded-xl border border-border bg-surface p-4 sm:p-5", className)}
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="eyebrow">Evidence readiness</p>
          <h3 className="mt-1 text-base font-semibold text-ink sm:text-lg">{state.heading}</h3>
          <p className="mt-1.5 text-sm text-ink-muted">{state.summary}</p>
        </div>
        <span
          className={cn(
            "inline-flex rounded-full border px-2 py-0.5 font-mono text-[10px] uppercase tracking-wide",
            riskTone(state.riskScore),
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

      <div className="mt-4 grid gap-2.5 sm:grid-cols-2">
        {state.cells.map((cell) => (
          <article
            key={cell.id}
            className={cn("rounded-md border px-3 py-2.5", cellToneClass(cell.tone))}
          >
            <div className="flex items-start justify-between gap-2">
              <h4 className="text-xs font-semibold text-ink">{cell.label}</h4>
              <span className="text-[10px] uppercase tracking-wide text-ink-subtle">
                {cell.present ? "Present" : "Missing"}
              </span>
            </div>
            <p className="mt-1 text-[11px] text-ink-muted">{cell.detail}</p>
            <p className="mt-1 text-[10px] text-ink-subtle">
              {cell.required ? "Required in this preset" : "Optional in this preset"}
            </p>
          </article>
        ))}
      </div>

      {state.requiredMissing.length > 0 ? (
        <p className="mt-3 rounded-md border border-trust-blocked/35 bg-trust-blocked/5 px-3 py-2 text-xs text-trust-blocked">
          Required gaps: {state.requiredMissing.join(", ")}
        </p>
      ) : (
        <p className="mt-3 rounded-md border border-trust-trusted/35 bg-trust-trusted/5 px-3 py-2 text-xs text-trust-trusted">
          Required evidence gates are covered for this preset.
        </p>
      )}

      {state.benchmarkSummary ? (
        <p className="mt-3 text-xs text-ink-muted">{state.benchmarkSummary}</p>
      ) : null}

      {state.benchmarks.length > 0 ? (
        <div className="mt-2 rounded-md border border-border bg-background px-3 py-2">
          <p className="text-[11px] font-medium text-ink">Compare benchmark snapshot</p>
          <ul className="mt-1.5 space-y-1">
            {state.benchmarks.map((benchmark) => {
              const parsed = parseDetailEntryRef(benchmark.entryRef);
              const title = benchmark.title;

              return (
                <li
                  key={benchmark.entryRef}
                  className="flex items-center justify-between gap-2 text-[11px]"
                >
                  {parsed ? (
                    <Link
                      to="/entry/$category/$slug"
                      params={{ category: parsed.category, slug: parsed.slug }}
                      onClick={() =>
                        trackEvent(
                          detailEvidenceMatrixBenchmarkEntryAnalyticsEvent(),
                          detailEvidenceMatrixBenchmarkEntryAnalyticsData(
                            category,
                            slug,
                            benchmark.entryRef,
                            selectedPreset,
                            benchmark.score,
                            benchmark.strongerThanTarget,
                            state.benchmarks.length,
                          ),
                        )
                      }
                      className="truncate underline-offset-2 hover:text-accent hover:underline"
                    >
                      {title}
                    </Link>
                  ) : (
                    <span className="truncate text-ink">{title}</span>
                  )}
                  <span className="font-mono text-ink-muted">{benchmark.score}</span>
                </li>
              );
            })}
          </ul>
        </div>
      ) : null}
    </section>
  );
}
