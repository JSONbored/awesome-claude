import * as React from "react";
import { Link } from "@tanstack/react-router";
import { Star, ArrowUpRight, Plus, Check, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import type { Entry } from "@/types/registry";
import {
  CategoryPill,
  PlatformChip,
  SourceBadge,
  TrustBadge,
  InstallRiskBadge,
  NotesPresenceChips,
} from "./badges";
import { CopyButton } from "./copy-button";
import { EntryBrandMark } from "./entry-brand-mark";
import { EntryFacets } from "./entry-facets";
import { PeekButton, setHotPeek, clearHotPeek, type PeekHandle } from "./peek-button";
import { PeekHint } from "./peek-hint";
import { LazyEntryAuthorAttribution } from "./lazy-linked-attribution";
import { useCompareActions, useIsCompared } from "@/lib/compare";
import { recordIntentEvent } from "@/lib/intent-event-client";
import {
  resourceCardCompareAnalyticsData,
  resourceCardCompareAnalyticsEvent,
  resourceCardCompareToastOpenAnalyticsData,
  resourceCardCompareToastOpenAnalyticsEvent,
  resourceCardEntryAnalyticsData,
  resourceCardEntryAnalyticsEvent,
  resourceCardSourceAnalyticsData,
  resourceCardSourceAnalyticsEvent,
  resourceCardInstallAnalyticsData,
  resourceCardInstallAnalyticsEvent,
  resourceCardInstallIntentType,
  resourceCardTrustHintAnalyticsData,
  resourceCardTrustHintAnalyticsEvent,
  RESOURCE_CARD_SURFACE,
  type ResourceCardSurface,
} from "@/lib/resource-card-cta-events";
import { resourceCardCompareFullMessage } from "@/lib/resource-card-compare-ui";
import { resourceCardTrustDecisionState } from "@/lib/resource-card-trust-decision";
import { ResourceCardTrustHint } from "@/components/resource-card-trust-hint";
import { cn } from "@/lib/utils";
import { trackEvent, outboundHost } from "@/lib/analytics";

import { formatCompact, timeAgo } from "@/lib/format";
const fmtNum = (n?: number) => formatCompact(n);

function SourceRepoStars({ entry, compact = false }: { entry: Entry; compact?: boolean }) {
  if (entry.repoStats?.stars === undefined) return null;
  return (
    <span
      className="inline-flex items-center gap-1 font-mono text-[11px] text-ink-subtle"
      title="Source repository stars"
    >
      <Star className="h-3 w-3" aria-hidden /> {fmtNum(entry.repoStats.stars)}
      {!compact && <span className="hidden sm:inline"> repo</span>}
    </span>
  );
}

function ResourceCardInner({
  entry,
  variant = "row",
  rank,
  compareItems = [],
  analyticsSurface = RESOURCE_CARD_SURFACE,
}: {
  entry: Entry;
  variant?: "row" | "grid" | "compact";
  rank?: number;
  compareItems?: Entry[];
  analyticsSurface?: ResourceCardSurface;
}) {
  const { toggle, setOpen } = useCompareActions();
  const inCompare = useIsCompared(entry);
  const trustDecision = React.useMemo(
    () => resourceCardTrustDecisionState(entry, compareItems),
    [entry, compareItems],
  );
  const peekRef = React.useRef<PeekHandle>(null);
  const handle = React.useMemo(() => ({ open: () => peekRef.current?.open() }), []);
  const [hovered, setHovered] = React.useState(false);
  const peekListeners = {
    onMouseEnter: () => {
      setHotPeek(handle);
      setHovered(true);
    },
    onMouseLeave: () => {
      clearHotPeek(handle);
      setHovered(false);
    },
    onFocus: () => {
      setHotPeek(handle);
      setHovered(true);
    },
    onBlur: () => {
      clearHotPeek(handle);
      setHovered(false);
    },
  };

  const installPayload = entry.installCommand ?? entry.configSnippet ?? entry.fullCopy ?? "";

  const onEntryClick = () => {
    trackEvent(
      resourceCardEntryAnalyticsEvent(),
      resourceCardEntryAnalyticsData(
        entry.category,
        entry.slug,
        variant,
        typeof rank === "number" ? rank : null,
        compareItems.length,
        analyticsSurface,
      ),
    );
  };

  const onCompareToggle = () => {
    const wasIn = inCompare;
    const changed = toggle(entry);
    if (!changed) {
      toast.error(resourceCardCompareFullMessage());
      return;
    }
    trackEvent(resourceCardCompareAnalyticsEvent(!wasIn), {
      ...resourceCardCompareAnalyticsData(entry.category, entry.slug, analyticsSurface),
    });
    if (wasIn) {
      toast(`Removed “${entry.title}” from compare`);
    } else {
      const compareCount = compareItems.length + 1;
      toast.success("Added to compare", {
        description: entry.title,
        action: {
          label: "View",
          onClick: () => {
            setOpen(true);
            trackEvent(
              resourceCardCompareToastOpenAnalyticsEvent(),
              resourceCardCompareToastOpenAnalyticsData(
                entry.category,
                entry.slug,
                compareCount,
                analyticsSurface,
              ),
            );
          },
        },
      });
    }
  };

  const onTrustHintActivate = () => {
    if (!trustDecision) return;
    trackEvent(
      resourceCardTrustHintAnalyticsEvent(),
      resourceCardTrustHintAnalyticsData(
        entry.category,
        entry.slug,
        trustDecision.kind,
        inCompare,
        compareItems.length,
        analyticsSurface,
      ),
    );
    if (!inCompare) {
      const changed = toggle(entry);
      if (!changed) {
        toast.error(resourceCardCompareFullMessage());
        return;
      }
    }
    setOpen(true);
  };

  const onInstallCopied = () => {
    void recordIntentEvent(resourceCardInstallIntentType(entry), entry);
  };

  const installAnalyticsData = resourceCardInstallAnalyticsData(
    entry.category,
    entry.slug,
    analyticsSurface,
  );

  if (variant === "compact") {
    return (
      <div
        {...peekListeners}
        className="group relative flex items-center gap-3 border-b border-border px-4 py-2 text-sm transition-colors duration-200 ease-out hover:bg-surface-2 sm:px-6"
      >
        <Link
          to="/entry/$category/$slug"
          params={{ category: entry.category, slug: entry.slug }}
          onClick={onEntryClick}
          className="flex min-w-0 flex-1 items-center gap-3 focus-visible:outline-none"
        >
          {typeof rank === "number" && (
            <span className="w-7 shrink-0 font-mono text-[11px] tabular-nums text-ink-subtle">
              {String(rank).padStart(2, "0")}
            </span>
          )}
          <EntryBrandMark entry={entry} size="xs" />
          <CategoryPill>{entry.category}</CategoryPill>
          <span className="min-w-0 flex-1 truncate font-medium text-ink group-hover:underline">
            {entry.title}
          </span>
          <span className="hidden min-w-0 max-w-[40%] truncate text-xs text-ink-muted sm:inline">
            {entry.cardDescription ?? entry.description}
          </span>
          <span className="hidden sm:inline-flex">
            <SourceRepoStars entry={entry} compact />
          </span>
          <TrustBadge level={entry.trust} />
        </Link>
        <span className="hidden min-w-0 shrink md:inline-flex">
          <LazyEntryAuthorAttribution entry={entry} className="truncate text-xs text-ink-subtle" />
        </span>
        <PeekButton
          ref={peekRef}
          entry={entry}
          className="opacity-0 transition-opacity group-hover:opacity-100 focus-within:opacity-100"
        />
      </div>
    );
  }

  if (variant === "grid") {
    return (
      <div
        {...peekListeners}
        className={cn(
          "group relative flex flex-col rounded-lg border bg-surface transition-colors duration-200 ease-out hover:border-border-strong hover:bg-surface-2",
          inCompare ? "border-accent ring-1 ring-accent/40" : "border-border",
        )}
      >
        <div className="flex flex-1 flex-col gap-3 p-4">
          <Link
            to="/entry/$category/$slug"
            params={{ category: entry.category, slug: entry.slug }}
            onClick={onEntryClick}
            className="flex flex-1 flex-col gap-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-accent/60 rounded-lg"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex min-w-0 items-center gap-2">
                <EntryBrandMark entry={entry} size="xs" />
                <CategoryPill>{entry.category}</CategoryPill>
              </div>
              <div className="flex min-h-4 items-center text-xs text-ink-muted tabular-nums">
                <SourceRepoStars entry={entry} compact />
              </div>
            </div>
            <div>
              <h3 className="font-display text-base font-semibold leading-tight text-ink">
                {entry.title}
              </h3>
              <p className="mt-1.5 line-clamp-2 text-sm text-ink-muted">
                {entry.cardDescription ?? entry.description}
              </p>
            </div>
            <EntryFacets entry={entry} density="card" />
            <div className="mt-auto flex flex-wrap items-center gap-1.5">
              <TrustBadge level={entry.trust} />
              <SourceBadge status={entry.source} />
              <InstallRiskBadge entry={entry} size="xs" />
              {entry.dateAdded && (
                <span className="ml-auto font-mono text-[10px] text-ink-subtle">
                  Added {timeAgo(entry.dateAdded)}
                </span>
              )}
            </div>
            <NotesPresenceChips entry={entry} />
          </Link>
          {trustDecision ? (
            <ResourceCardTrustHint
              state={trustDecision}
              className="mt-1"
              onActivate={onTrustHintActivate}
            />
          ) : null}
          <LazyEntryAuthorAttribution entry={entry} className="text-xs text-ink-subtle" />
        </div>
        <div className="pointer-events-none absolute right-2 top-2 z-10 flex items-center gap-1 rounded-md border border-border bg-surface/95 p-0.5 opacity-0 shadow-sm backdrop-blur transition-opacity duration-150 group-hover:opacity-100 focus-within:opacity-100 group-focus-within:opacity-100">
          <div className="pointer-events-auto">
            <PeekButton ref={peekRef} entry={entry} />
          </div>
          {installPayload && (
            <div className="pointer-events-auto">
              <CopyButton
                iconOnly
                value={installPayload}
                label="Copy install"
                toastLabel={`Copied install — ${entry.title}`}
                event={resourceCardInstallAnalyticsEvent()}
                eventData={installAnalyticsData}
                onCopied={onInstallCopied}
              />
            </div>
          )}
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onCompareToggle();
            }}
            aria-pressed={inCompare}
            aria-label={inCompare ? "Remove from compare" : "Add to compare"}
            title={inCompare ? "Remove from compare" : "Add to compare"}
            className={cn(
              "pointer-events-auto inline-flex h-7 w-7 items-center justify-center rounded-md border transition-colors",
              inCompare
                ? "border-accent bg-accent text-accent-ink"
                : "border-border bg-surface text-ink-muted hover:border-border-strong hover:text-ink",
            )}
          >
            {inCompare ? <Check className="h-3.5 w-3.5" /> : <Plus className="h-3.5 w-3.5" />}
          </button>
        </div>
        <PeekHint hovered={hovered} />
      </div>
    );
  }

  return (
    <div
      {...peekListeners}
      className={cn(
        "group relative flex flex-col gap-3 border-b border-border px-4 py-4 transition-colors duration-200 ease-out hover:bg-surface-2 sm:flex-row sm:items-center sm:gap-5 sm:px-6",
        inCompare &&
          "bg-accent/5 before:absolute before:inset-y-0 before:left-0 before:w-0.5 before:bg-accent",
      )}
    >
      <div className="flex min-w-0 flex-1 items-start gap-3">
        <EntryBrandMark entry={entry} size="sm" className="mt-0.5" />
        <div className="flex min-w-0 flex-1 flex-col gap-1.5">
          <div className="flex flex-wrap items-center gap-1.5">
            <CategoryPill>{entry.category}</CategoryPill>
            <TrustBadge level={entry.trust} />
            <SourceBadge status={entry.source} />
            <InstallRiskBadge entry={entry} size="xs" />
            {entry.platforms.slice(0, 2).map((p) => (
              <PlatformChip key={p} id={p} />
            ))}
          </div>

          <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
            <Link
              to="/entry/$category/$slug"
              params={{ category: entry.category, slug: entry.slug }}
              onClick={onEntryClick}
              className="font-display text-[15px] font-semibold tracking-tight text-ink group-hover:underline"
            >
              {entry.title}
            </Link>
            <LazyEntryAuthorAttribution entry={entry} />
          </div>
          <p className="line-clamp-2 max-w-3xl text-sm text-ink-muted">{entry.description}</p>
          {trustDecision ? (
            <ResourceCardTrustHint
              state={trustDecision}
              className="mt-1"
              onActivate={onTrustHintActivate}
            />
          ) : null}
          <div className="flex flex-wrap items-center gap-2 pt-0.5">
            <EntryFacets entry={entry} density="card" />
            <NotesPresenceChips entry={entry} />
          </div>
        </div>
      </div>

      {/* Right cluster: fixed-width slots so missing buttons don't shift the stats column */}
      <div className="flex flex-shrink-0 flex-wrap items-center justify-end gap-x-3 gap-y-1.5 text-xs text-ink-muted sm:gap-x-4">
        <div className="flex w-[90px] flex-col items-end gap-0.5 tabular-nums">
          {entry.repoStats?.stars !== undefined ? (
            <>
              <div className="flex items-center gap-1 font-mono">
                <Star className="h-3 w-3" aria-hidden /> {fmtNum(entry.repoStats.stars)}
              </div>
              <div className="font-mono text-ink-subtle">repo stars</div>
            </>
          ) : (
            <span aria-hidden className="block h-7" />
          )}
        </div>
        <div className="flex items-center gap-1.5">
          <PeekButton ref={peekRef} entry={entry} />
          <div className="w-[78px]">
            {installPayload ? (
              <CopyButton
                value={installPayload}
                label="Install"
                className="w-full justify-center"
                event={resourceCardInstallAnalyticsEvent()}
                eventData={installAnalyticsData}
                onCopied={onInstallCopied}
              />
            ) : (
              <span aria-hidden className="block h-7 w-full" />
            )}
          </div>
          <button
            type="button"
            onClick={onCompareToggle}
            aria-pressed={inCompare}
            className={cn(
              "inline-flex h-7 w-[88px] items-center justify-center gap-1 rounded-md border px-2 text-xs font-medium transition-colors duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60",
              inCompare
                ? "border-accent bg-accent text-accent-ink"
                : "border-border bg-surface text-ink hover:border-border-strong",
            )}
          >
            {inCompare ? <Check className="h-3.5 w-3.5" /> : <Plus className="h-3.5 w-3.5" />}
            {inCompare ? "Added" : "Compare"}
          </button>
          <div className="w-[78px]">
            {entry.sourceUrl ? (
              <a
                href={entry.sourceUrl}
                target="_blank"
                rel="noreferrer"
                onClick={() =>
                  trackEvent(
                    resourceCardSourceAnalyticsEvent(),
                    resourceCardSourceAnalyticsData(
                      entry.category,
                      entry.slug,
                      outboundHost(entry.sourceUrl!),
                      analyticsSurface,
                    ),
                  )
                }
                className="inline-flex h-7 w-full items-center justify-center gap-1 rounded-md border border-border bg-surface px-2 text-xs font-medium text-ink hover:border-border-strong focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60"
              >
                Source <ArrowUpRight className="h-3 w-3" />
              </a>
            ) : (
              <span aria-hidden className="block h-7 w-full" />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Memoized so that selecting/deselecting one card in the compare set does not
 * re-render every other visible card. Cards subscribe to their own compare
 * membership via `useIsCompared`, and `entry`/`variant`/`rank` props are stable
 * references from the registry, so the shallow prop compare is effective.
 */
export const ResourceCard = React.memo(ResourceCardInner);
