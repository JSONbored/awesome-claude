import { Link } from "@tanstack/react-router";
import type {
  BrowseConfidencePresetId,
  BrowseDecisionConfidenceState,
} from "@/lib/browse-decision-confidence";
import { browseConfidenceBandClass } from "@/lib/browse-decision-confidence";
import {
  browseDecisionConfidenceEntryAnalyticsData,
  browseDecisionConfidenceEntryAnalyticsEvent,
  parseBrowseDecisionPanelEntryRef,
} from "@/lib/browse-decision-panel-cta-events";
import { trackEvent } from "@/lib/analytics";
import { cn } from "@/lib/utils";

const PRESETS: { id: BrowseConfidencePresetId; label: string }[] = [
  { id: "balanced", label: "Balanced" },
  { id: "strict", label: "Strict" },
  { id: "pilot", label: "Pilot" },
];

export function BrowseDecisionConfidencePanel({
  state,
  selectedPreset,
  onSelectPreset,
  className,
}: {
  state: BrowseDecisionConfidenceState;
  selectedPreset: BrowseConfidencePresetId;
  onSelectPreset: (preset: BrowseConfidencePresetId) => void;
  className?: string;
}) {
  if (state.scannedCount === 0 || state.entries.length === 0) return null;

  return (
    <section
      aria-label="Browse decision confidence"
      className={cn("rounded-xl border border-border bg-surface p-4 sm:p-5", className)}
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="eyebrow">Decision confidence</p>
          <h3 className="mt-1 text-base font-semibold text-ink sm:text-lg">{state.heading}</h3>
          <p className="mt-1 text-sm text-ink-muted">{state.summary}</p>
        </div>
        <div className="flex flex-wrap gap-1.5">
          <span className="rounded-full border border-border bg-background px-2 py-0.5 font-mono text-[10px] text-ink-subtle">
            high {state.highCount}
          </span>
          <span className="rounded-full border border-border bg-background px-2 py-0.5 font-mono text-[10px] text-ink-subtle">
            medium {state.mediumCount}
          </span>
          <span className="rounded-full border border-border bg-background px-2 py-0.5 font-mono text-[10px] text-ink-subtle">
            low {state.lowCount}
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
        {state.entries.map((entry) => {
          const parsed = parseBrowseDecisionPanelEntryRef(entry.entryRef);
          const title = <h4 className="text-sm font-semibold text-ink">{entry.title}</h4>;
          return (
            <article
              key={entry.entryRef}
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
                          browseDecisionConfidenceEntryAnalyticsEvent(),
                          browseDecisionConfidenceEntryAnalyticsData(
                            entry.entryRef,
                            selectedPreset,
                            entry.band,
                            entry.confidenceScore,
                            entry.missingSignals.length,
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
                  <p className="mt-0.5 text-[11px] text-ink-muted">{entry.recommendation}</p>
                </div>
                <div className="text-right">
                  <span
                    className={cn(
                      "inline-flex rounded-full border px-2 py-0.5 text-[10px] uppercase tracking-wide",
                      browseConfidenceBandClass(entry.band),
                    )}
                  >
                    {entry.band}
                  </span>
                  <p className="mt-1 font-mono text-xs text-ink">{entry.confidenceScore}/100</p>
                </div>
              </div>

              <div className="mt-2 flex flex-wrap gap-1.5">
                {entry.missingSignals.length > 0 ? (
                  entry.missingSignals.slice(0, 3).map((signal) => (
                    <span
                      key={`${entry.entryRef}-${signal}`}
                      className="rounded border border-border bg-surface px-2 py-0.5 text-[10px] text-ink-muted"
                    >
                      Missing: {signal}
                    </span>
                  ))
                ) : (
                  <span className="rounded border border-border bg-surface px-2 py-0.5 text-[10px] text-ink-muted">
                    All key signals present
                  </span>
                )}
              </div>

              <p className="mt-2 text-[11px] text-ink-subtle">
                {entry.entryRef} · trust {entry.trust}
              </p>
            </article>
          );
        })}
      </div>
    </section>
  );
}
