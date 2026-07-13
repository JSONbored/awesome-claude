import { Link } from "@tanstack/react-router";
import type { BrowseAdoptionPresetId, BrowseAdoptionQueueState } from "@/lib/browse-adoption-queue";
import { browseAdoptionTierClass } from "@/lib/browse-adoption-queue";
import {
  browseAdoptionQueueEntryAnalyticsData,
  browseAdoptionQueueEntryAnalyticsEvent,
  parseBrowseDecisionPanelEntryRef,
} from "@/lib/browse-decision-panel-cta-events";
import { trackEvent } from "@/lib/analytics";
import { cn } from "@/lib/utils";

const PRESETS: { id: BrowseAdoptionPresetId; label: string }[] = [
  { id: "balanced", label: "Balanced" },
  { id: "security-first", label: "Security-first" },
  { id: "fast-pilot", label: "Fast pilot" },
];

export function BrowseAdoptionQueuePanel({
  state,
  selectedPreset,
  onSelectPreset,
  className,
}: {
  state: BrowseAdoptionQueueState;
  selectedPreset: BrowseAdoptionPresetId;
  onSelectPreset: (preset: BrowseAdoptionPresetId) => void;
  className?: string;
}) {
  if (state.scannedCount === 0 || state.rows.length === 0) return null;

  return (
    <section
      aria-label="Browse adoption queue"
      className={cn("rounded-xl border border-border bg-surface p-4 sm:p-5", className)}
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="eyebrow">Adoption queue</p>
          <h3 className="mt-1 text-base font-semibold text-ink sm:text-lg">{state.heading}</h3>
          <p className="mt-1 text-sm text-ink-muted">{state.summary}</p>
        </div>
        <div className="flex flex-wrap gap-1.5">
          <span className="rounded-full border border-border bg-background px-2 py-0.5 font-mono text-[10px] text-ink-subtle">
            ready {state.readyCount}
          </span>
          <span className="rounded-full border border-border bg-background px-2 py-0.5 font-mono text-[10px] text-ink-subtle">
            caution {state.cautionCount}
          </span>
          <span className="rounded-full border border-border bg-background px-2 py-0.5 font-mono text-[10px] text-ink-subtle">
            hold {state.holdCount}
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
        {state.rows.map((row) => {
          const parsed = parseBrowseDecisionPanelEntryRef(row.entryRef);
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
                          browseAdoptionQueueEntryAnalyticsEvent(),
                          browseAdoptionQueueEntryAnalyticsData(
                            row.entryRef,
                            selectedPreset,
                            row.tier,
                            row.readinessScore,
                            row.blockers.length,
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
                  <p className="mt-0.5 text-[11px] text-ink-muted">
                    {row.blockers.length > 0
                      ? `${row.blockers.length} blockers: ${row.blockers.slice(0, 2).join(", ")}`
                      : "No required blockers for this preset."}
                  </p>
                </div>
                <div className="text-right">
                  <span
                    className={cn(
                      "inline-flex rounded-full border px-2 py-0.5 text-[10px] uppercase tracking-wide",
                      browseAdoptionTierClass(row.tier),
                    )}
                  >
                    {row.tier}
                  </span>
                  <p className="mt-1 font-mono text-xs text-ink">{row.readinessScore}/100</p>
                </div>
              </div>

              <div className="mt-2 grid gap-1.5 sm:grid-cols-2">
                {row.nextSteps.map((step) => (
                  <p
                    key={`${row.entryRef}-${step}`}
                    className="rounded border border-border px-2 py-1 text-[11px] text-ink-muted"
                  >
                    {step}
                  </p>
                ))}
              </div>

              <p className="mt-2 text-[11px] text-ink-subtle">
                {row.entryRef} · trust {row.trust} · confidence {row.confidence}%
              </p>
            </article>
          );
        })}
      </div>
    </section>
  );
}
