import { Link } from "@tanstack/react-router";
import { GitCompare, Shield, Lock, BadgeCheck, GitBranch, UserCheck } from "lucide-react";
import type { BrowseResultsTrustDecisionUiState } from "@/lib/browse-results-trust-decision";
import {
  browseCompareOpenAnalyticsData,
  browseCompareOpenAnalyticsEvent,
} from "@/lib/entry-detail-cta-events";
import {
  browseTrustCoverageFilterAnalyticsData,
  browseTrustCoverageFilterAnalyticsEvent,
  browseTrustCoverageSignal,
  browseTrustLevelFilterAnalyticsData,
  browseTrustLevelFilterAnalyticsEvent,
} from "@/lib/browse-trust-panel-cta-events";
import { trackEvent } from "@/lib/analytics";
import { cn } from "@/lib/utils";

const COVERAGE_ICONS = {
  safety: Shield,
  privacy: Lock,
  reviewed: BadgeCheck,
  "source-backed": GitBranch,
  claimed: UserCheck,
} as const;

type CompareLink = {
  search: { ids: string };
  selectedCount: number;
};

export function BrowseResultsTrustPanel({
  state,
  compareLink,
  onTrustLevelSelect,
  onCoverageSelect,
  className,
}: {
  state: Extract<BrowseResultsTrustDecisionUiState, { showPanel: true }>;
  compareLink?: CompareLink | null;
  onTrustLevelSelect?: (level: string) => void;
  onCoverageSelect?: (coverageId: string, signal: string) => void;
  className?: string;
}) {
  const hint = state.decisionHint ?? state.compareNudge;

  return (
    <section
      aria-label="Browse results trust summary"
      className={cn("rounded-xl border border-border bg-surface/80 px-4 py-4 sm:px-5", className)}
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <div className="eyebrow">Trust snapshot</div>
          <p className="mt-1 text-sm text-ink">
            {state.resultCount === state.sampleCount
              ? `${state.resultCount} results in this view`
              : `Trust signals across ${state.sampleCount} of ${state.resultCount} results`}
          </p>
          {state.hasMixedTrust ? (
            <div className="mt-2 flex flex-wrap gap-1.5">
              {state.trustLevels.map((item) => {
                const chip = (
                  <>
                    {item.count} {item.level}
                  </>
                );
                const classes =
                  "inline-flex items-center rounded-full border border-border bg-background px-2 py-0.5 text-[11px] font-medium capitalize text-ink";
                if (onTrustLevelSelect) {
                  return (
                    <button
                      key={item.level}
                      type="button"
                      onClick={() => {
                        trackEvent(
                          browseTrustLevelFilterAnalyticsEvent(),
                          browseTrustLevelFilterAnalyticsData(
                            item.level,
                            item.count,
                            state.resultCount,
                          ),
                        );
                        onTrustLevelSelect(item.level);
                      }}
                      className={cn(
                        classes,
                        "transition-colors hover:border-ink/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60",
                      )}
                    >
                      {chip}
                    </button>
                  );
                }
                return (
                  <span key={item.level} className={classes}>
                    {chip}
                  </span>
                );
              })}
            </div>
          ) : null}
        </div>

        {compareLink && compareLink.selectedCount >= 2 ? (
          <Link
            to="/compare"
            search={compareLink.search}
            onClick={() => {
              trackEvent(
                browseCompareOpenAnalyticsEvent(),
                browseCompareOpenAnalyticsData(compareLink.selectedCount, "browse-trust-panel"),
              );
            }}
            className="inline-flex shrink-0 items-center gap-1.5 self-start rounded-full border border-accent bg-accent/10 px-3 py-1.5 text-xs font-medium text-ink hover:bg-accent/15"
          >
            <GitCompare className="h-3.5 w-3.5" aria-hidden />
            Compare {compareLink.selectedCount} selected
          </Link>
        ) : null}
      </div>

      <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-5">
        {state.coverage.map((chip) => {
          const Icon = COVERAGE_ICONS[chip.id as keyof typeof COVERAGE_ICONS] ?? Shield;
          const signal = browseTrustCoverageSignal(chip.id);
          const classes = cn(
            "rounded-lg border px-3 py-2 text-left",
            chip.emphasis === "high"
              ? "border-trust-trusted/30 bg-trust-trusted/5"
              : chip.emphasis === "low"
                ? "border-trust-review/30 bg-trust-review/5"
                : "border-border bg-background",
          );
          const body = (
            <>
              <div className="flex items-center gap-1.5 text-[11px] font-medium text-ink">
                <Icon className="h-3.5 w-3.5 text-ink-muted" aria-hidden />
                {chip.label}
              </div>
              <div className="mt-1 font-mono text-sm text-ink">
                {chip.percent}%
                <span className="ml-1 text-[11px] font-normal text-ink-muted">
                  ({chip.count}/{chip.total})
                </span>
              </div>
            </>
          );
          if (onCoverageSelect && signal) {
            return (
              <button
                key={chip.id}
                type="button"
                onClick={() => {
                  trackEvent(
                    browseTrustCoverageFilterAnalyticsEvent(),
                    browseTrustCoverageFilterAnalyticsData(
                      chip.id,
                      chip.count,
                      chip.percent,
                      state.resultCount,
                    ),
                  );
                  onCoverageSelect(chip.id, signal);
                }}
                className={cn(
                  classes,
                  "transition-colors hover:border-ink/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60",
                )}
              >
                {body}
              </button>
            );
          }
          return (
            <div key={chip.id} className={classes}>
              {body}
            </div>
          );
        })}
      </div>

      {state.divergingCount > 0 ? (
        <p className="mt-3 text-xs text-amber-800">
          {state.divergingCount} trust{" "}
          {state.divergingCount === 1 ? "signal differs" : "signals differ"} in this sample
          {state.divergingLabels.length > 0 ? `: ${state.divergingLabels.join(", ")}` : "."}
        </p>
      ) : null}

      {hint ? (
        <p className="mt-2 text-xs text-ink-muted" role="status">
          {hint}
        </p>
      ) : null}
    </section>
  );
}
