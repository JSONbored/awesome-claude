import { Link } from "@tanstack/react-router";
import { toneClass } from "@/lib/browse-rollout-tone-lib";
import type { BrowseFreshnessDistributionState } from "@/lib/browse-freshness-distribution";
import {
  browseFreshnessBucketAnalyticsData,
  browseFreshnessBucketAnalyticsEvent,
  browseFreshnessBucketDestination,
  browseFreshnessStaleEntryAnalyticsData,
  browseFreshnessStaleEntryAnalyticsEvent,
  parseBrowseFreshnessEntryRef,
  type BrowseFreshnessBucketBrowseSearch,
} from "@/lib/browse-distribution-cta-events";
import { trackEvent } from "@/lib/analytics";
import { cn } from "@/lib/utils";

export function BrowseFreshnessDistributionPanel({
  state,
  onBucketSelect,
  className,
}: {
  state: BrowseFreshnessDistributionState;
  onBucketSelect?: (bucketId: string, search: BrowseFreshnessBucketBrowseSearch) => void;
  className?: string;
}) {
  if (!state.showPanel) return null;
  return (
    <section className={cn("rounded-xl border border-border bg-surface p-4", className)}>
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <p className="eyebrow">Freshness distribution</p>
          <h3 className="mt-1 text-sm font-semibold text-ink">{state.heading}</h3>
          <p className="mt-1 text-xs text-ink-muted">{state.summary}</p>
        </div>
        <span className="rounded-full border border-border bg-background px-2 py-0.5 font-mono text-[10px] text-ink-subtle">
          median {state.medianAgeDays}d
        </span>
      </div>

      <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
        {state.buckets.map((bucket) => {
          const destination = browseFreshnessBucketDestination(bucket.id);
          const body = (
            <>
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="text-xs font-medium text-ink">{bucket.label}</p>
                  <p className="mt-0.5 text-[11px] text-ink-muted">{bucket.rangeLabel}</p>
                </div>
                <span
                  className={cn(
                    "inline-flex rounded-full border px-1.5 py-0.5 text-[10px] uppercase tracking-wide",
                    toneClass(bucket.tone),
                  )}
                >
                  {bucket.percent}%
                </span>
              </div>
              <p className="mt-1.5 font-mono text-[11px] text-ink">
                {bucket.count} {bucket.count === 1 ? "entry" : "entries"}
              </p>
            </>
          );

          if (!destination) {
            return (
              <article
                key={bucket.id}
                className="rounded-md border border-border bg-background p-2.5"
              >
                {body}
              </article>
            );
          }

          const track = () =>
            trackEvent(
              browseFreshnessBucketAnalyticsEvent(),
              browseFreshnessBucketAnalyticsData(
                bucket.id,
                bucket.count,
                bucket.percent,
                state.scannedCount,
              ),
            );

          if (destination.to === "/browse" && onBucketSelect) {
            return (
              <button
                key={bucket.id}
                type="button"
                onClick={() => {
                  track();
                  onBucketSelect(bucket.id, destination.search);
                }}
                className="rounded-md border border-border bg-background p-2.5 text-left transition-colors duration-200 ease-out hover:border-border-strong hover:bg-surface-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60"
              >
                {body}
              </button>
            );
          }

          return (
            <Link
              key={bucket.id}
              to={destination.to}
              hash={destination.to === "/quality" ? destination.hash : undefined}
              onClick={track}
              className="rounded-md border border-border bg-background p-2.5 text-left transition-colors duration-200 ease-out hover:border-border-strong hover:bg-surface-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60"
            >
              {body}
            </Link>
          );
        })}
      </div>

      {state.staleEntries.length > 0 ? (
        <div className="mt-3 rounded-md border border-border bg-background p-2.5">
          <p className="text-[11px] font-medium text-ink">Oldest entries in this view</p>
          <ul className="mt-1.5 space-y-1.5">
            {state.staleEntries.map((entry) => {
              const parsed = parseBrowseFreshnessEntryRef(entry.entryRef);
              const title = (
                <div className="min-w-0">
                  <p className="truncate text-ink">{entry.title}</p>
                  <p className="truncate text-ink-subtle">
                    {entry.verified ? "Verified previously" : "Not yet verified"}
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
                          browseFreshnessStaleEntryAnalyticsEvent(),
                          browseFreshnessStaleEntryAnalyticsData(
                            entry.entryRef,
                            entry.ageDays,
                            entry.verified,
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
                  <span className="shrink-0 font-mono text-ink-muted">{entry.ageDays}d</span>
                </li>
              );
            })}
          </ul>
        </div>
      ) : null}
    </section>
  );
}
