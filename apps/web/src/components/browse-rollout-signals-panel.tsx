import { toneClass } from "@/lib/browse-rollout-tone-lib";
import type { BrowseRolloutSignalsState } from "@/lib/browse-rollout-signals";
import { cn } from "@/lib/utils";

export function BrowseRolloutSignalsPanel({
  state,
  className,
}: {
  state: BrowseRolloutSignalsState;
  className?: string;
}) {
  if (!state.showPanel) return null;
  return (
    <section className={cn("rounded-xl border border-border bg-surface p-4", className)}>
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <p className="eyebrow">Rollout signal scan</p>
          <h3 className="mt-1 text-sm font-semibold text-ink">{state.heading}</h3>
          <p className="mt-1 text-xs text-ink-muted">{state.summary}</p>
        </div>
        <span className="rounded-full border border-border bg-background px-2 py-0.5 font-mono text-[10px] text-ink-subtle">
          {state.scannedCount} scanned
        </span>
      </div>

      <div className="mt-3 grid gap-2 sm:grid-cols-2">
        {state.rows.map((row) => (
          <article key={row.id} className="rounded-md border border-border bg-background p-2.5">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <p className="text-xs font-medium text-ink">{row.label}</p>
                <p className="mt-0.5 text-[11px] text-ink-muted">{row.message}</p>
              </div>
              <span
                className={cn(
                  "inline-flex rounded-full border px-1.5 py-0.5 text-[10px] uppercase tracking-wide",
                  toneClass(row.tone),
                )}
              >
                {row.tone}
              </span>
            </div>
            <p className="mt-1.5 font-mono text-[11px] text-ink">
              {row.coveragePercent}% ({row.presentCount}/{row.presentCount + row.missingCount})
            </p>
          </article>
        ))}
      </div>

      {state.flaggedEntries.length > 0 ? (
        <div className="mt-3 rounded-md border border-border bg-background p-2.5">
          <p className="text-[11px] font-medium text-ink">Most at-risk entries in this view</p>
          <ul className="mt-1.5 space-y-1.5">
            {state.flaggedEntries.map((entry) => (
              <li
                key={entry.entryRef}
                className="flex items-start justify-between gap-2 text-[11px]"
              >
                <div className="min-w-0">
                  <p className="truncate text-ink">{entry.title}</p>
                  <p className="truncate text-ink-subtle">
                    {entry.missingRequired.length > 0
                      ? `Missing required: ${entry.missingRequired.join(", ")}`
                      : "No required rollout gaps"}
                  </p>
                </div>
                <span className="shrink-0 font-mono text-ink-muted">
                  {entry.signalCoveragePercent}%
                </span>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </section>
  );
}
