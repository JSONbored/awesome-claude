import { Link } from "@tanstack/react-router";
import { GitCompare } from "lucide-react";
import type { BrowseCompareSelectionContextState } from "@/lib/resource-card-trust-decision";
import { browseCompareSelectionDivergingLine } from "@/lib/resource-card-trust-decision";
import {
  browseCompareOpenAnalyticsData,
  browseCompareOpenAnalyticsEvent,
} from "@/lib/entry-detail-cta-events";
import { trackEvent } from "@/lib/analytics";
import { cn } from "@/lib/utils";

export function BrowseCompareSelectionBanner({
  state,
  compareSearch,
  className,
}: {
  state: BrowseCompareSelectionContextState;
  compareSearch: { ids: string };
  className?: string;
}) {
  if (!state.showBanner) return null;

  const divergingLine = browseCompareSelectionDivergingLine(state.divergingLabels);

  return (
    <section
      aria-label="Compare selection context"
      className={cn("rounded-xl border border-accent/30 bg-accent/5 px-4 py-3 sm:px-5", className)}
    >
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <div className="flex items-center gap-2 text-sm font-medium text-ink">
            <GitCompare className="h-4 w-4" aria-hidden />
            {state.selectedCount} selected for compare
          </div>
          {state.headline ? <p className="mt-1 text-sm text-ink">{state.headline}</p> : null}
          {state.hint ? <p className="mt-1 text-xs text-ink-muted">{state.hint}</p> : null}
          {divergingLine ? <p className="mt-1 text-xs text-amber-800">{divergingLine}</p> : null}
        </div>
        <Link
          to="/compare"
          search={compareSearch}
          onClick={() => {
            trackEvent(
              browseCompareOpenAnalyticsEvent(),
              browseCompareOpenAnalyticsData(
                state.selectedCount,
                "browse-compare-selection-banner",
              ),
            );
          }}
          className="inline-flex shrink-0 items-center gap-1.5 self-start rounded-full border border-accent bg-background px-3 py-1.5 text-xs font-medium text-ink hover:bg-surface"
        >
          Open compare
        </Link>
      </div>
    </section>
  );
}
