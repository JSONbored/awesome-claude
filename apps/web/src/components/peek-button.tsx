import * as React from "react";
import { Link } from "@tanstack/react-router";
import { Eye, ExternalLink, Star, ArrowUpRight, BookOpen, GitBranch } from "lucide-react";
import type { Entry, Harness } from "@/types/registry";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Kbd } from "@/components/badges";
import {
  CategoryPill,
  TrustBadge,
  InstallRiskBadge,
  NotesPresenceChips,
  SourceBadge,
  PlatformChip,
} from "./badges";
import { CopySegmented, variantsForEntry } from "./copy-segmented";
import { EntryBrandMark } from "./entry-brand-mark";
import { HarnessVariantPicker } from "./harness-variant-picker";
import { useHarnessPref, useCopyPref, type CopyVariant } from "@/lib/dossier-prefs";
import { entryDomId } from "@/lib/entry-identity";
import { cn } from "@/lib/utils";
import { setHotPeek, clearHotPeek, installPeekShortcut } from "@/lib/peek-hotkey";
import { LazyEntryAuthorAttribution, LazyLinkedSourceCitations } from "./lazy-linked-attribution";
import { trackEvent } from "@/lib/analytics";
import {
  peekCopyAnalyticsData,
  peekCopyAnalyticsEvent,
  peekCopyIntentType,
  peekPanelActionAnalyticsData,
  peekPanelActionAnalyticsEvent,
  peekPanelOpenAnalyticsData,
  peekPanelOpenAnalyticsEvent,
  peekSnippetVariantSelectAnalyticsData,
  peekSnippetVariantSelectAnalyticsEvent,
  PEEK_PANEL_SURFACE,
} from "@/lib/peek-panel-cta-events";
import {
  badgeChromeCategoryAnalyticsData,
  badgeChromeCategoryAnalyticsEvent,
  badgeChromeSourceAnalyticsData,
  badgeChromeSourceAnalyticsEvent,
  badgeChromeTrustAnalyticsData,
  badgeChromeTrustAnalyticsEvent,
} from "@/lib/badge-chrome-cta-events";
import {
  harnessVariantSelectAnalyticsData,
  harnessVariantSelectAnalyticsEvent,
} from "@/lib/harness-variant-cta-events";
import { recordIntentEvent } from "@/lib/intent-event-client";

export interface PeekHandle {
  open: () => void;
}

interface Props {
  entry: Entry;
  className?: string;
}

/**
 * Quick-peek drawer trigger. Renders an icon-only button and an attached Sheet
 * with a mini dossier. Exposes an imperative `open()` so cards can wire the
 * global `P` hotkey to the focused/hovered card.
 */
export const PeekButton = React.forwardRef<PeekHandle, Props>(function PeekButton(
  { entry, className },
  ref,
) {
  const peekId = entryDomId(entry);
  const [open, setOpen] = React.useState(false);
  const openRef = React.useRef(open);
  openRef.current = open;

  const handleOpenChange = React.useCallback(
    (next: boolean) => {
      if (next && !openRef.current) {
        trackEvent(
          peekPanelOpenAnalyticsEvent(),
          peekPanelOpenAnalyticsData(entry.category, entry.slug),
        );
      }
      setOpen(next);
    },
    [entry.category, entry.slug],
  );

  React.useImperativeHandle(ref, () => ({ open: () => handleOpenChange(true) }), [
    handleOpenChange,
  ]);
  React.useEffect(() => {
    installPeekShortcut();
  }, []);
  return (
    <Sheet open={open} onOpenChange={handleOpenChange}>
      <TooltipProvider delayDuration={300}>
        <Tooltip>
          <TooltipTrigger asChild>
            <SheetTrigger asChild>
              <button
                type="button"
                aria-label={`Peek ${entry.title} (press P)`}
                aria-haspopup="dialog"
                aria-keyshortcuts="P"
                onClick={(e) => e.stopPropagation()}
                className={cn(
                  "inline-flex h-7 w-7 items-center justify-center rounded-md border border-border bg-surface text-ink-muted transition-colors hover:border-border-strong hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60",
                  className,
                )}
              >
                <Eye className="h-3.5 w-3.5" aria-hidden />
              </button>
            </SheetTrigger>
          </TooltipTrigger>
          <TooltipContent side="top" className="flex items-center gap-1.5">
            <span>Peek</span>
            <Kbd>P</Kbd>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <SheetContent
        side="right"
        className="w-full overflow-y-auto sm:max-w-md"
        aria-labelledby={`peek-title-${peekId}`}
      >
        <PeekBody entry={entry} peekId={peekId} />
      </SheetContent>
    </Sheet>
  );
});

function PeekBody({ entry, peekId }: { entry: Entry; peekId: string }) {
  const harnessAvailable = React.useMemo<Harness[]>(
    () => (entry.harnessVariants ? (Object.keys(entry.harnessVariants) as Harness[]) : []),
    [entry.harnessVariants],
  );
  const [harness, setHarness] = useHarnessPref(entry.category, entry.slug, harnessAvailable);
  const variants = React.useMemo(() => variantsForEntry(entry, harness), [entry, harness]);

  const onPeekCopy = React.useCallback(
    (variant: CopyVariant) => {
      trackEvent(
        peekCopyAnalyticsEvent(variant),
        peekCopyAnalyticsData(entry.category, entry.slug, variant),
      );
      void recordIntentEvent(peekCopyIntentType(variant), entry);
    },
    [entry],
  );

  const onPeekVariantSelect = React.useCallback(
    (variant: CopyVariant) => {
      trackEvent(
        peekSnippetVariantSelectAnalyticsEvent(),
        peekSnippetVariantSelectAnalyticsData(entry.category, entry.slug, variant),
      );
    },
    [entry.category, entry.slug],
  );

  const onPeekAction = React.useCallback(
    (action: "dossier" | "source" | "docs") => {
      trackEvent(
        peekPanelActionAnalyticsEvent(action),
        peekPanelActionAnalyticsData(entry.category, entry.slug, action),
      );
      if (action === "source") void recordIntentEvent("open", entry);
    },
    [entry],
  );

  return (
    <>
      <SheetHeader className="space-y-3 text-left">
        <div className="flex flex-wrap items-center gap-1.5">
          <Link
            to="/browse"
            search={{ category: entry.category }}
            onClick={() =>
              trackEvent(
                badgeChromeCategoryAnalyticsEvent(),
                badgeChromeCategoryAnalyticsData(entry.category, "peek-panel"),
              )
            }
          >
            <CategoryPill>{entry.category}</CategoryPill>
          </Link>
          <TrustBadge
            level={entry.trust}
            asLink
            onNavigate={() =>
              trackEvent(
                badgeChromeTrustAnalyticsEvent(),
                badgeChromeTrustAnalyticsData(entry.trust, "peek-panel"),
              )
            }
          />
          <SourceBadge
            status={entry.source}
            asLink
            onNavigate={() =>
              trackEvent(
                badgeChromeSourceAnalyticsEvent(),
                badgeChromeSourceAnalyticsData(entry.source, "peek-panel"),
              )
            }
          />
          <InstallRiskBadge entry={entry} size="xs" />
        </div>
        <div className="flex min-w-0 items-start gap-3">
          <EntryBrandMark entry={entry} size="md" priority className="mt-0.5" />
          <div className="min-w-0 flex-1">
            <SheetTitle
              id={`peek-title-${peekId}`}
              className="font-display text-lg leading-tight text-ink"
            >
              {entry.title}
            </SheetTitle>
            <SheetDescription className="mt-1.5 text-sm text-ink-muted">
              {entry.cardDescription ?? entry.description}
            </SheetDescription>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2 text-xs text-ink-muted">
          <LazyEntryAuthorAttribution entry={entry} />
          {typeof entry.repoStats?.stars === "number" && (
            <span className="inline-flex items-center gap-1 tabular-nums" title="Source repo stars">
              <Star className="h-3 w-3" aria-hidden />
              {entry.repoStats.stars.toLocaleString()} repo
            </span>
          )}
          <NotesPresenceChips entry={entry} className="ml-auto" />
        </div>
      </SheetHeader>

      {entry.platforms?.length > 0 && (
        <div className="mt-4 flex flex-wrap items-center gap-1">
          <span className="eyebrow mr-1">Platforms</span>
          {entry.platforms.map((p) => (
            <PlatformChip key={p} id={p} asLink />
          ))}
        </div>
      )}

      {harnessAvailable.length >= 2 && (
        <div className="mt-4">
          <div id={`peek-harness-${peekId}`} className="eyebrow mb-2">
            Harness variant
          </div>
          <HarnessVariantPicker
            available={harnessAvailable}
            value={harness as Harness | null}
            onChange={setHarness}
            labelId={`peek-harness-${peekId}`}
            onVariantSelect={(nextHarness) =>
              trackEvent(
                harnessVariantSelectAnalyticsEvent(),
                harnessVariantSelectAnalyticsData(
                  entry.category,
                  entry.slug,
                  PEEK_PANEL_SURFACE,
                  nextHarness,
                ),
              )
            }
          />
        </div>
      )}

      <div className="mt-4">
        <div className="mb-2 flex flex-wrap items-center gap-2">
          <span id={`peek-snippet-${peekId}`} className="eyebrow mr-1">
            Snippet
          </span>
          <CopySegmented
            variants={variants}
            entryTitle={entry.title}
            labelId={`peek-snippet-${peekId}`}
            onCopied={onPeekCopy}
            onVariantSelect={onPeekVariantSelect}
          />
        </div>
        {variants.find((v) => v.id === variants.find((x) => x.value)?.id)?.value && (
          <SnippetPreview variants={variants} />
        )}
      </div>

      <div className="mt-5">
        <div className="eyebrow mb-2">Sources</div>
        <LazyLinkedSourceCitations entry={entry} />
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-2">
        <Link
          to="/entry/$category/$slug"
          params={{ category: entry.category, slug: entry.slug }}
          onClick={() => onPeekAction("dossier")}
          className="inline-flex h-8 items-center gap-1.5 rounded-md bg-ink px-3 text-xs font-medium text-background hover:bg-ink/90"
        >
          Open dossier <ArrowUpRight className="h-3 w-3" />
        </Link>
        {entry.sourceUrl && (
          <a
            href={entry.sourceUrl}
            target="_blank"
            rel="noreferrer"
            onClick={() => onPeekAction("source")}
            className="inline-flex h-8 items-center gap-1.5 rounded-md border border-border bg-surface px-3 text-xs font-medium text-ink hover:bg-surface-2"
          >
            <GitBranch className="h-3.5 w-3.5" /> Source <ExternalLink className="h-3 w-3" />
          </a>
        )}
        {entry.docsUrl && (
          <a
            href={entry.docsUrl}
            target="_blank"
            rel="noreferrer"
            onClick={() => onPeekAction("docs")}
            className="inline-flex h-8 items-center gap-1.5 rounded-md border border-border bg-surface px-3 text-xs font-medium text-ink hover:bg-surface-2"
          >
            <BookOpen className="h-3.5 w-3.5" /> Docs <ExternalLink className="h-3 w-3" />
          </a>
        )}
      </div>
    </>
  );
}

function SnippetPreview({ variants }: { variants: ReturnType<typeof variantsForEntry> }) {
  const [pref] = useCopyPref();
  const firstAvailable = variants.find((v) => v.value)?.id ?? "install";
  const active: CopyVariant =
    pref && variants.find((v) => v.id === pref)?.value ? pref : firstAvailable;
  const payload = variants.find((v) => v.id === active)?.value;
  if (!payload) return null;
  return (
    <pre className="max-h-48 overflow-auto rounded-md border border-border bg-surface-2 p-3 font-mono text-[11px] leading-relaxed text-ink">
      <code>{payload}</code>
    </pre>
  );
}

/**
 * Re-export hooks for cards that want to register themselves as the "hot"
 * peek target on focus/hover.
 */
export { setHotPeek, clearHotPeek };
