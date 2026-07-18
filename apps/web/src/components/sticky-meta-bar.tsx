import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import { Link } from "@tanstack/react-router";
import type { Entry, Harness } from "@/types/registry";
import {
  CategoryPill,
  TrustBadge,
  SourceBadge,
  InstallRiskBadge,
  NotesPresenceChips,
} from "./badges";
import { Star, ArrowUp, Shield, Lock } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  useHarnessPref,
  readScrollPos,
  writeScrollPos,
  clearScrollPos,
  type CopyVariant,
} from "@/lib/dossier-prefs";
import { CopySegmented, variantsForEntry } from "./copy-segmented";
import { EntryBrandMark } from "./entry-brand-mark";
import { trackEvent } from "@/lib/analytics";
import { recordIntentEvent } from "@/lib/intent-event-client";
import {
  ENTRY_DETAIL_STICKY_META_SURFACE,
  entryDetailBrowseCategoryAnalyticsData,
  entryDetailBrowseCategoryAnalyticsEvent,
  entryDetailCopyAnalyticsData,
  entryDetailCopyAnalyticsEvent,
  entryDetailCopyIntentType,
  entryDetailStickyBackToTopAnalyticsData,
  entryDetailStickyBackToTopAnalyticsEvent,
  entryDetailStickyCopyVariantSelectAnalyticsData,
  entryDetailStickyCopyVariantSelectAnalyticsEvent,
} from "@/lib/entry-detail-cta-events";
import {
  badgeChromeInstallRiskAnalyticsData,
  badgeChromeInstallRiskAnalyticsEvent,
  badgeChromeNotesAnalyticsData,
  badgeChromeNotesAnalyticsEvent,
  badgeChromeSourceAnalyticsData,
  badgeChromeSourceAnalyticsEvent,
  badgeChromeTrustAnalyticsData,
  badgeChromeTrustAnalyticsEvent,
} from "@/lib/badge-chrome-cta-events";
import { categoryPillBrowseDestination } from "@/lib/category-pill-cta-events";

/**
 * Appears once the user scrolls past the dossier header.
 * - Wraps cleanly on small viewports.
 * - Shows trust + install risk + safety/privacy presence.
 * - Segmented copy switcher (install / config / full).
 * - Restores per-entry scroll position on revisit.
 * - Slim accent scroll-progress bar across the bottom edge.
 */
export function StickyMetaBar({
  entry,
  watchSentinelId,
}: {
  entry: Entry;
  watchSentinelId: string;
}) {
  const [visible, setVisible] = useState(false);
  const [progress, setProgress] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const harnessAvailable = useMemo<Harness[]>(
    () => (entry.harnessVariants ? (Object.keys(entry.harnessVariants) as Harness[]) : []),
    [entry.harnessVariants],
  );
  const [harness] = useHarnessPref(entry.category, entry.slug, harnessAvailable);
  const variants = useMemo(() => variantsForEntry(entry, harness), [entry, harness]);
  const onStickyCopy = useCallback(
    (variant: CopyVariant) => {
      trackEvent(
        entryDetailCopyAnalyticsEvent(variant),
        entryDetailCopyAnalyticsData(entry.category, entry.slug, ENTRY_DETAIL_STICKY_META_SURFACE),
      );
      void recordIntentEvent(entryDetailCopyIntentType(variant), entry);
    },
    [entry],
  );
  const onStickyVariantSelect = useCallback(
    (variant: CopyVariant) => {
      trackEvent(
        entryDetailStickyCopyVariantSelectAnalyticsEvent(),
        entryDetailStickyCopyVariantSelectAnalyticsData(entry.category, entry.slug, variant),
      );
    },
    [entry.category, entry.slug],
  );
  const onStickyBrowseCategory = useCallback(() => {
    trackEvent(
      entryDetailBrowseCategoryAnalyticsEvent(),
      entryDetailBrowseCategoryAnalyticsData(
        entry.category,
        entry.slug,
        ENTRY_DETAIL_STICKY_META_SURFACE,
      ),
    );
  }, [entry.category, entry.slug]);
  const onStickyBackToTop = useCallback(() => {
    trackEvent(
      entryDetailStickyBackToTopAnalyticsEvent(),
      entryDetailStickyBackToTopAnalyticsData(entry.category, entry.slug, progress),
    );
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [entry.category, entry.slug, progress]);

  // Visibility observer on the header sentinel.
  useEffect(() => {
    const sentinel = document.getElementById(watchSentinelId);
    if (!sentinel) return;
    const io = new IntersectionObserver(([e]) => setVisible(!e.isIntersecting), {
      threshold: 0,
      rootMargin: "-72px 0px 0px 0px",
    });
    io.observe(sentinel);
    return () => io.disconnect();
  }, [watchSentinelId]);

  // Restore scroll position on mount; persist on scroll.
  useEffect(() => {
    const saved = readScrollPos(entry.category, entry.slug);
    if (saved && saved > 0) {
      // Wait two frames so layout / images settle before jumping.
      const raf1 = requestAnimationFrame(() => {
        const raf2 = requestAnimationFrame(() => {
          const max = document.documentElement.scrollHeight - window.innerHeight;
          window.scrollTo({ top: Math.min(saved, max), behavior: "instant" as ScrollBehavior });
        });
        return () => cancelAnimationFrame(raf2);
      });
      return () => cancelAnimationFrame(raf1);
    }
  }, [entry.category, entry.slug]);

  useEffect(() => {
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const doc = document.documentElement;
        const max = doc.scrollHeight - window.innerHeight;
        const y = window.scrollY;
        const pct = max > 0 ? Math.min(100, Math.max(0, (y / max) * 100)) : 0;
        setProgress(pct);
        if (pct >= 99) clearScrollPos(entry.category, entry.slug);
        else writeScrollPos(entry.category, entry.slug, y);
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, [entry.category, entry.slug]);

  const hasSafety = !!(entry.safetyNotes || entry.safetyNotesList?.length);
  const hasPrivacy = !!(entry.privacyNotes || entry.privacyNotesList?.length);

  return (
    <div
      ref={ref}
      aria-hidden={!visible}
      className={cn(
        "pointer-events-none fixed inset-x-0 top-16 z-30 transition-all duration-200",
        visible ? "translate-y-0 opacity-100" : "-translate-y-2 opacity-0",
      )}
    >
      <div className="mx-auto max-w-[1200px] px-3 sm:px-6">
        <div className="pointer-events-auto relative overflow-hidden rounded-xl border border-border bg-surface/95 shadow-sm backdrop-blur">
          {/* Row 1: identity */}
          <div className="flex min-w-0 items-start gap-2 px-3 pt-2 sm:items-center sm:gap-3">
            {(() => {
              const destination = categoryPillBrowseDestination(entry.category);
              if (!destination) {
                return <CategoryPill>{entry.category}</CategoryPill>;
              }
              return (
                <Link
                  to={destination.to}
                  search={destination.search}
                  className="shrink-0"
                  aria-label={`Back to ${entry.category}`}
                  onClick={onStickyBrowseCategory}
                >
                  <CategoryPill>{entry.category}</CategoryPill>
                </Link>
              );
            })()}
            <EntryBrandMark entry={entry} size="xs" />
            <span className="min-w-0 flex-1 truncate text-sm font-medium text-ink sm:truncate">
              <span className="line-clamp-2 sm:line-clamp-1">{entry.title}</span>
            </span>
            {typeof entry.repoStats?.stars === "number" && (
              <span className="hidden shrink-0 items-center gap-1 text-[11px] tabular-nums text-ink-muted lg:inline-flex">
                <Star className="h-3 w-3" aria-hidden />
                {entry.repoStats.stars.toLocaleString()} repo
              </span>
            )}
            {/* Compact safety/privacy icons under md */}
            <span className="ml-auto inline-flex shrink-0 items-center gap-1 md:hidden">
              <Shield
                className={cn(
                  "h-3.5 w-3.5",
                  hasSafety ? "text-trust-trusted" : "text-ink-subtle/50",
                )}
                aria-label={hasSafety ? "Safety notes present" : "Safety notes missing"}
              />
              <Lock
                className={cn(
                  "h-3.5 w-3.5",
                  hasPrivacy ? "text-trust-trusted" : "text-ink-subtle/50",
                )}
                aria-label={hasPrivacy ? "Privacy notes present" : "Privacy notes missing"}
              />
            </span>
            <button
              type="button"
              onClick={onStickyBackToTop}
              className="hidden h-7 shrink-0 items-center gap-1 rounded-md border border-border bg-surface px-2 text-[11px] text-ink-muted hover:border-border-strong hover:text-ink sm:inline-flex"
              aria-label="Back to top"
            >
              <ArrowUp className="h-3 w-3" aria-hidden />
              <span className="hidden md:inline">Top</span>
            </button>
          </div>

          {/* Row 2: trust + risk + copy switcher */}
          <div className="flex flex-wrap items-center gap-2 px-3 pb-2 pt-1.5">
            <TrustBadge
              level={entry.trust}
              asLink
              onNavigate={() =>
                trackEvent(
                  badgeChromeTrustAnalyticsEvent(),
                  badgeChromeTrustAnalyticsData(entry.trust, "detail-sticky-meta"),
                )
              }
            />
            <SourceBadge
              status={entry.source}
              asLink
              onNavigate={() =>
                trackEvent(
                  badgeChromeSourceAnalyticsEvent(),
                  badgeChromeSourceAnalyticsData(entry.source, "detail-sticky-meta"),
                )
              }
            />
            <InstallRiskBadge
              entry={entry}
              size="xs"
              asButton
              onActivate={(risk) =>
                trackEvent(
                  badgeChromeInstallRiskAnalyticsEvent(),
                  badgeChromeInstallRiskAnalyticsData(risk, "detail-sticky-meta"),
                )
              }
            />
            <span className="hidden md:inline-flex">
              <NotesPresenceChips
                entry={entry}
                interactive
                onNoteClick={(noteKind, present) =>
                  trackEvent(
                    badgeChromeNotesAnalyticsEvent(),
                    badgeChromeNotesAnalyticsData(noteKind, present, "detail-sticky-meta"),
                  )
                }
              />
            </span>

            <div className="ml-auto inline-flex items-center gap-1.5">
              <span className="hidden sm:inline-flex">
                <CopySegmented
                  variants={variants}
                  entryTitle={entry.title}
                  onCopied={onStickyCopy}
                  onVariantSelect={onStickyVariantSelect}
                />
              </span>
              {/* Mobile: only a single copy button, no segmented control */}
              <button
                type="button"
                onClick={onStickyBackToTop}
                className="inline-flex h-7 shrink-0 items-center gap-1 rounded-md border border-border bg-surface px-2 text-[11px] text-ink-muted hover:border-border-strong hover:text-ink sm:hidden"
                aria-label="Back to top"
              >
                <ArrowUp className="h-3 w-3" aria-hidden />
              </button>
            </div>
          </div>

          {/* Scroll progress */}
          <div
            className="h-0.5 bg-accent/80 transition-[width] duration-150 ease-out"
            style={{ width: `${progress}%` }}
            role="progressbar"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={Math.round(progress)}
            aria-label="Page scroll progress"
          />
        </div>
      </div>
    </div>
  );
}
