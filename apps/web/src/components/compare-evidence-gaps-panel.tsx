import { Link } from "@tanstack/react-router";
import { severityClass } from "@/lib/compare-evidence-severity-lib";
import type { CompareEvidenceGapsState } from "@/lib/compare-evidence-gaps";
import {
  compareEvidenceGapsEntryAnalyticsData,
  compareEvidenceGapsEntryAnalyticsEvent,
  parseComparePanelEntryRef,
} from "@/lib/compare-panel-entry-cta-events";
import { trackEvent } from "@/lib/analytics";
import { cn } from "@/lib/utils";

export function CompareEvidenceGapsPanel({
  state,
  surface,
  compact = false,
  className,
}: {
  state: CompareEvidenceGapsState;
  surface: string;
  compact?: boolean;
  className?: string;
}) {
  if (state.comparedCount === 0) return null;

  const entriesWithGaps = state.entries
    .filter((entry) => entry.missingLabels.length > 0)
    .sort((a, b) => b.missingLabels.length - a.missingLabels.length);

  return (
    <section
      aria-label="Evidence gaps"
      className={cn("rounded-xl border border-border bg-surface p-4 sm:p-5", className)}
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="eyebrow">Evidence gaps</p>
          <h3 className="mt-1 text-base font-semibold text-ink sm:text-lg">{state.headline}</h3>
          <p className="mt-1.5 text-sm text-ink-muted">{state.summary}</p>
        </div>
        <span className="rounded-full border border-border bg-background px-2 py-0.5 font-mono text-[10px] text-ink-subtle">
          {state.comparedCount} compared
        </span>
      </div>

      <div className="mt-3 grid gap-2">
        {state.rows.map((row) => (
          <article key={row.id} className="rounded-lg border border-border bg-background p-3">
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div className="min-w-0">
                <h4 className="text-sm font-semibold text-ink">{row.label}</h4>
                <p className="mt-0.5 text-[11px] text-ink-muted">{row.hint}</p>
              </div>
              <div className="text-right">
                <span
                  className={cn(
                    "inline-flex rounded-full border px-2 py-0.5 text-[10px] uppercase tracking-wide",
                    severityClass(row.severity),
                  )}
                >
                  {row.severity}
                </span>
                <p className="mt-1 font-mono text-xs text-ink">{row.coveragePercent}% covered</p>
              </div>
            </div>

            <div className="mt-2 flex flex-wrap gap-1.5">
              <span className="rounded border border-border bg-surface px-2 py-0.5 text-[10px] text-ink-muted">
                Present: {row.presentCount}
              </span>
              <span className="rounded border border-border bg-surface px-2 py-0.5 text-[10px] text-ink-muted">
                Missing: {row.missingCount}
              </span>
            </div>

            {!compact && row.missingRefs.length > 0 ? (
              <p className="mt-2 text-[11px] text-ink-subtle">
                Missing in: {row.missingRefs.join(", ")}
              </p>
            ) : null}
          </article>
        ))}
      </div>

      {entriesWithGaps.length > 0 ? (
        <div className="mt-3 rounded-md border border-border bg-background p-2.5">
          <p className="text-[11px] font-medium text-ink">Entries with evidence gaps</p>
          <ul className="mt-1.5 space-y-1.5">
            {entriesWithGaps.map((entry) => {
              const parsed = parseComparePanelEntryRef(entry.entryRef);
              const title = (
                <div className="min-w-0">
                  <p className="truncate text-ink">{entry.title}</p>
                  <p className="truncate text-ink-subtle">
                    {entry.missingLabels.length} missing signal
                    {entry.missingLabels.length === 1 ? "" : "s"}
                  </p>
                </div>
              );
              return (
                <li
                  key={entry.entryRef}
                  className="flex items-start justify-between gap-2 text-[11px]"
                >
                  {parsed ? (
                    <Link
                      to="/entry/$category/$slug"
                      params={{ category: parsed.category, slug: parsed.slug }}
                      onClick={() =>
                        trackEvent(
                          compareEvidenceGapsEntryAnalyticsEvent(),
                          compareEvidenceGapsEntryAnalyticsData(
                            surface,
                            entry.entryRef,
                            entry.missingLabels.length,
                            state.comparedCount,
                          ),
                        )
                      }
                      className="min-w-0 flex-1 underline-offset-2 hover:text-accent hover:underline"
                    >
                      {title}
                    </Link>
                  ) : (
                    title
                  )}
                  <span className="shrink-0 font-mono text-ink-muted">
                    {entry.missingLabels.length}/{state.rows.length}
                  </span>
                </li>
              );
            })}
          </ul>
        </div>
      ) : null}
    </section>
  );
}
