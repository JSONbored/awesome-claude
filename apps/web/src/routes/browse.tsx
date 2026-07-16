import * as React from "react";
import {
  createFileRoute,
  Link,
  redirect,
  stripSearchParams,
  useNavigate,
} from "@tanstack/react-router";
import { z } from "zod";
import { useMemo, useCallback } from "react";
import { toast } from "sonner";
import { ResourceCard } from "@/components/resource-card";
import { FilterChip, FilterChipGroup } from "@/components/filter-chip";
import {
  countSearchResults,
  normalizeSearchQuery,
  search,
  type TrustSignalFilter,
} from "@/data/search";
import {
  BROWSE_TRUST_SIGNAL_OPTIONS,
  browseTrustRelaxationTrials,
  browseTrustSignalLabel,
  buildBrowseTrustSignalCounts,
  buildBrowseTrustUtilityOptions,
  isBrowseTrustSignalFilter,
  toggleBrowseTrustSignal,
} from "@/lib/browse-trust-filters";
import { browseFilterDecisionUiState } from "@/lib/browse-filter-decision-hints";
import { browseResultsTrustDecisionUiState } from "@/lib/browse-results-trust-decision";
import { BrowseResultsTrustPanel } from "@/components/browse-results-trust-panel";
import { BrowseCompareSelectionBanner } from "@/components/browse-compare-selection-banner";
import { browseCompareSelectionContextState } from "@/lib/resource-card-trust-decision";
import { browseRolloutSignalsState } from "@/lib/browse-rollout-signals";
import { BrowseRolloutSignalsPanel } from "@/components/browse-rollout-signals-panel";
import { browseAdoptionQueueState, type BrowseAdoptionPresetId } from "@/lib/browse-adoption-queue";
import { BrowseAdoptionQueuePanel } from "@/components/browse-adoption-queue-panel";
import {
  browseDecisionConfidenceState,
  type BrowseConfidencePresetId,
} from "@/lib/browse-decision-confidence";
import { BrowseDecisionConfidencePanel } from "@/components/browse-decision-confidence-panel";
import { browseFreshnessDistributionState } from "@/lib/browse-freshness-distribution";
import { BrowseFreshnessDistributionPanel } from "@/components/browse-freshness-distribution-panel";
import { browseThemeDistributionState } from "@/lib/browse-theme-distribution";
import { BrowseThemeDistributionPanel } from "@/components/browse-theme-distribution-panel";
import {
  CATEGORIES,
  type Category,
  type Platform,
  type SourceStatus,
  type TrustLevel,
} from "@/types/registry";
import {
  Search as SearchIcon,
  SlidersHorizontal,
  ArrowDownNarrowWide,
  Clock,
  Star,
  X,
  Settings2,
  Bell,
  ExternalLink,
} from "lucide-react";
import { useCompare } from "@/lib/compare";
import { browseCompareInteractiveUiState } from "@/lib/compare-browse-interactive-ui-lib";
import { browseCompareUrlSelectedCount } from "@/lib/compare-browse-share-link";
import {
  browseCompareOpenAnalyticsData,
  browseCompareOpenAnalyticsEvent,
} from "@/lib/entry-detail-cta-events";
import {
  browseDecisionPresetAnalyticsData,
  browseDecisionPresetAnalyticsEvent,
} from "@/lib/browse-decision-preset-cta-events";
import {
  browseFilterClearAllAnalyticsData,
  browseFilterClearAllAnalyticsEvent,
  browseFilterSelectAnalyticsData,
  browseFilterSelectAnalyticsEvent,
  browseSearchClearAnalyticsData,
  browseSearchClearAnalyticsEvent,
  browseSortSelectAnalyticsData,
  browseSortSelectAnalyticsEvent,
  browseViewSelectAnalyticsData,
  browseViewSelectAnalyticsEvent,
  type BrowseFilterAxis,
} from "@/lib/browse-filter-cta-events";
import {
  browseEmptyEgressAnalyticsData,
  browseEmptyEgressAnalyticsEvent,
  browseEmptySuggestionApplyAnalyticsData,
  browseEmptySuggestionApplyAnalyticsEvent,
  browseLoadMoreAnalyticsData,
  browseLoadMoreAnalyticsEvent,
  browseRecentEntryClickAnalyticsData,
  browseRecentEntryClickAnalyticsEvent,
  browseRecentsPanelToggleAnalyticsData,
  browseRecentsPanelToggleAnalyticsEvent,
  browseSavedSearchApplyAnalyticsData,
  browseSavedSearchApplyAnalyticsEvent,
  browseSavedSearchLinkClickAnalyticsData,
  browseSavedSearchLinkClickAnalyticsEvent,
  browseSavedSearchRemoveAnalyticsData,
  browseSavedSearchRemoveAnalyticsEvent,
  browseSavedSearchSaveAnalyticsData,
  browseSavedSearchSaveAnalyticsEvent,
} from "@/lib/browse-saved-search-cta-events";
import { trackEvent } from "@/lib/analytics";
import { useRecents, type SavedSearch } from "@/lib/recents";
import { entryByRef } from "@/data/entries";
import { SavedSearchManager } from "@/components/saved-search-manager";
import { FilterSummaryBar, type ActiveFilter } from "@/components/filter-summary-bar";
import { useKeyboardShortcuts } from "@/hooks/use-keyboard-shortcuts";
import { cn } from "@/lib/utils";
import { absoluteUrl } from "@/lib/seo";

function SavedSearchChipRow({
  currentLabel,
  canSave,
  onSave,
  onApplySaved,
}: {
  currentLabel: string;
  canSave: boolean;
  onSave: () => void;
  onApplySaved: (search: SavedSearch) => void;
}) {
  const recents = useRecents();
  const [managerOpen, setManagerOpen] = React.useState(false);

  if (recents.saved.length === 0 && !canSave) return null;

  return (
    <>
      <div className="flex flex-wrap items-center gap-1.5">
        <Star className="h-3 w-3 text-ink-subtle" aria-hidden />
        <span className="text-[11px] uppercase tracking-wider text-ink-subtle">Saved</span>
        {recents.saved.slice(0, 6).map((s) => (
          <button
            key={s.id}
            type="button"
            onClick={() => onApplySaved(s)}
            className="inline-flex h-6 items-center gap-1 rounded-full border border-border bg-surface px-2 text-[11px] text-ink hover:bg-surface-2"
            title={`Open: ${s.label}`}
          >
            {s.alerts?.enabled && (
              <Bell className="h-2.5 w-2.5 text-accent" aria-label="Alerts on" />
            )}
            {s.label}
          </button>
        ))}
        {canSave && (
          <button
            type="button"
            onClick={onSave}
            className="inline-flex h-6 items-center gap-1 rounded-full border border-dashed border-border bg-surface px-2 text-[11px] text-ink-muted hover:bg-surface-2 hover:text-ink"
            title={currentLabel ? `Save "${currentLabel}"` : "Save this search"}
          >
            <Star className="h-3 w-3" /> Save this search
          </button>
        )}
        <button
          type="button"
          onClick={() => setManagerOpen(true)}
          className="ml-auto inline-flex h-6 items-center gap-1 rounded-full border border-border bg-surface px-2 text-[11px] text-ink-muted hover:bg-surface-2 hover:text-ink"
        >
          <Settings2 className="h-3 w-3" /> Manage
        </button>
      </div>
      <SavedSearchManager open={managerOpen} onOpenChange={setManagerOpen} />
    </>
  );
}

const defaultSearch = {
  q: "",
  category: "",
  trust: "",
  source: "",
  signal: "",
  platform: "",
  sort: "popular" as const,
  view: "row" as const,
  compare: "",
};

const searchSchema = z.object({
  q: z.string().transform(normalizeSearchQuery).catch(defaultSearch.q).default(defaultSearch.q),
  category: z.string().catch(defaultSearch.category).default(defaultSearch.category),
  trust: z.string().catch(defaultSearch.trust).default(defaultSearch.trust),
  source: z.string().catch(defaultSearch.source).default(defaultSearch.source),
  signal: z.string().catch(defaultSearch.signal).default(defaultSearch.signal),
  platform: z.string().catch(defaultSearch.platform).default(defaultSearch.platform),
  sort: z
    .enum(["popular", "newest", "title"])
    .catch(defaultSearch.sort)
    .default(defaultSearch.sort),
  view: z.enum(["row", "grid", "compact"]).catch(defaultSearch.view).default(defaultSearch.view),
  compare: z.string().catch(defaultSearch.compare).default(defaultSearch.compare),
});

export const Route = createFileRoute("/browse")({
  validateSearch: searchSchema,
  search: {
    middlewares: [stripSearchParams(defaultSearch)],
  },
  beforeLoad: ({ search }) => {
    // Stale/external links with unknown category values (e.g. ?category=plugins) render an
    // empty result set that Google flags as a soft 404. Redirect them to clean /browse.
    const invalidCategory = search.category && !CATEGORIES.some((c) => c.id === search.category);
    const invalidSignal = search.signal && !isBrowseTrustSignalFilter(search.signal);
    if (invalidCategory || invalidSignal) {
      throw redirect({
        to: "/browse",
        search: {
          ...search,
          category: invalidCategory ? "" : search.category,
          signal: invalidSignal ? "" : search.signal,
        },
        statusCode: 301,
        replace: true,
      });
    }
  },
  head: () => ({
    meta: [
      { title: "Browse — HeyClaude directory" },
      {
        name: "description",
        content: "Search and filter every resource in the HeyClaude registry.",
      },
      { property: "og:title", content: "Browse — HeyClaude directory" },
      {
        property: "og:description",
        content: "Search and filter every resource in the HeyClaude registry.",
      },
      { property: "og:url", content: absoluteUrl("/browse") },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: absoluteUrl("/browse") }],
  }),
  component: Browse,
});

const TRUST_LEVELS: TrustLevel[] = ["trusted", "review", "limited", "blocked"];
const SOURCE_STATUSES: SourceStatus[] = ["first-party", "source-backed", "external"];
const PLATFORM_IDS: Platform[] = [
  "claude-code",
  "claude-desktop",
  "cursor",
  "vscode",
  "cli",
  "raycast",
];

function Browse() {
  const sp = Route.useSearch();
  const navigate = Route.useNavigate();
  const compare = useCompare();
  const recents = useRecents();

  // Debounce free-text query: local state drives the input; URL updates 250ms after idle.
  const [qInput, setQInput] = React.useState(sp.q);
  React.useEffect(() => {
    setQInput(sp.q);
  }, [sp.q]);
  React.useEffect(() => {
    if (qInput === sp.q) return;
    const t = window.setTimeout(() => {
      navigate({ search: (prev: typeof sp) => ({ ...prev, q: qInput }), replace: true });
    }, 250);
    return () => window.clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [qInput]);

  // Density preference: URL wins; otherwise hydrate from localStorage on mount.
  const urlHasView =
    typeof window !== "undefined" && new URLSearchParams(window.location.search).has("view");
  React.useEffect(() => {
    if (urlHasView) {
      try {
        localStorage.setItem("hc:density", sp.view);
      } catch {
        /* noop */
      }
      return;
    }
    try {
      const stored = localStorage.getItem("hc:density");
      if (
        stored &&
        stored !== sp.view &&
        (stored === "row" || stored === "grid" || stored === "compact")
      ) {
        navigate({
          search: (prev: typeof sp) => ({ ...prev, view: stored as typeof sp.view }),
          replace: true,
        });
      }
    } catch {
      /* noop */
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filters = useMemo(
    () => ({
      q: sp.q,
      categories: sp.category ? [sp.category as Category] : undefined,
      trust: sp.trust ? [sp.trust as TrustLevel] : undefined,
      source: sp.source ? [sp.source as SourceStatus] : undefined,
      signal: isBrowseTrustSignalFilter(sp.signal) ? sp.signal : "",
      platforms: sp.platform ? [sp.platform as Platform] : undefined,
      sort: sp.sort,
    }),
    [sp],
  );

  const results = useMemo(() => search(filters), [filters]);

  const set = (patch: Partial<typeof sp>) => {
    if (patch.view) {
      try {
        localStorage.setItem("hc:density", patch.view);
      } catch {
        /* noop */
      }
    }
    navigate({ search: (prev: typeof sp) => ({ ...prev, ...patch }) });
  };

  const countForSlice = useCallback(
    (slice: typeof sp) =>
      countSearchResults({
        q: slice.q,
        categories: slice.category ? [slice.category as Category] : undefined,
        trust: slice.trust ? [slice.trust as TrustLevel] : undefined,
        source: slice.source ? [slice.source as SourceStatus] : undefined,
        signal: isBrowseTrustSignalFilter(slice.signal) ? slice.signal : "",
        platforms: slice.platform ? [slice.platform as Platform] : undefined,
        sort: slice.sort,
      }),
    [],
  );

  const onCategoryFilter = useCallback(
    (value: string) => {
      if (value === sp.category) return;
      const patch = { category: value };
      trackEvent(
        browseFilterSelectAnalyticsEvent(),
        browseFilterSelectAnalyticsData(
          "category",
          value || "all",
          value !== "",
          countForSlice({ ...sp, ...patch }),
        ),
      );
      set(patch);
    },
    [countForSlice, sp],
  );

  const onToggleAxisFilter = useCallback(
    (axis: Exclude<BrowseFilterAxis, "category" | "signal">, value: string) => {
      const current = sp[axis];
      const next = current === value ? "" : value;
      if (next === current) return;
      const patch = { [axis]: next } as Partial<typeof sp>;
      trackEvent(
        browseFilterSelectAnalyticsEvent(),
        browseFilterSelectAnalyticsData(
          axis,
          value,
          next !== "",
          countForSlice({ ...sp, ...patch }),
        ),
      );
      set(patch);
    },
    [countForSlice, sp],
  );

  const onTrustSignalFilter = useCallback(
    (optionId: TrustSignalFilter) => {
      const next = toggleBrowseTrustSignal(sp.signal, optionId);
      if (next === sp.signal) return;
      const patch = { signal: next };
      trackEvent(
        browseFilterSelectAnalyticsEvent(),
        browseFilterSelectAnalyticsData(
          "signal",
          optionId,
          next !== "",
          countForSlice({ ...sp, ...patch }),
        ),
      );
      set(patch);
    },
    [countForSlice, sp],
  );

  const onTrustUtilityFilter = useCallback(
    (value: string) => {
      if (value === sp.signal) return;
      const patch = { signal: value };
      trackEvent(
        browseFilterSelectAnalyticsEvent(),
        browseFilterSelectAnalyticsData(
          "signal",
          value || "all",
          value !== "",
          countForSlice({ ...sp, ...patch }),
        ),
      );
      set(patch);
    },
    [countForSlice, sp],
  );

  const onSortSelect = useCallback(
    (sort: typeof sp.sort) => {
      if (sort === sp.sort) return;
      const patch = { sort };
      trackEvent(
        browseSortSelectAnalyticsEvent(),
        browseSortSelectAnalyticsData(sort, countForSlice({ ...sp, ...patch })),
      );
      set(patch);
    },
    [countForSlice, sp],
  );

  const onViewSelect = useCallback(
    (view: typeof sp.view) => {
      if (view === sp.view) return;
      trackEvent(browseViewSelectAnalyticsEvent(), browseViewSelectAnalyticsData(view));
      set({ view });
    },
    [sp.view],
  );

  // --- Compare URL <-> context round-trip ----------------------------------
  const compareParam = sp.compare;
  // Hydrate from URL on mount + whenever the param changes externally
  React.useEffect(() => {
    compare.hydrate(compareParam);
    if (compareParam) {
      compare.setOpen(true);
      const selectedCount = browseCompareUrlSelectedCount(compareParam);
      if (selectedCount > 0) {
        trackEvent(
          browseCompareOpenAnalyticsEvent(),
          browseCompareOpenAnalyticsData(selectedCount, "browse-compare-url"),
        );
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [compareParam]);
  // Push selection changes back into the URL (debounced via effect)
  const compareSig = compare.items.map((e) => `${e.category}/${e.slug}`).join(",");
  React.useEffect(() => {
    if (compareSig === compareParam) return;
    navigate({
      search: (prev: typeof sp) => ({ ...prev, compare: compareSig }),
      replace: true,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [compareSig]);

  const browseCompareUi = useMemo(
    () => browseCompareInteractiveUiState(compare.items),
    [compare.items],
  );

  const browseFilterDecision = useMemo(
    () =>
      browseFilterDecisionUiState(
        {
          q: sp.q,
          category: sp.category,
          trust: sp.trust,
          source: sp.source,
          signal: sp.signal,
          platform: sp.platform,
          sort: sp.sort,
        },
        results,
        compare.items.length,
      ),
    [sp, results, compare.items.length],
  );

  const browseResultsTrust = useMemo(
    () => browseResultsTrustDecisionUiState(results, compare.items.length),
    [results, compare.items.length],
  );

  const browseCompareSelection = useMemo(
    () => browseCompareSelectionContextState(compare.items),
    [compare.items],
  );
  const browseRolloutSignals = useMemo(() => browseRolloutSignalsState(results, 12), [results]);
  const [adoptionPreset, setAdoptionPreset] = React.useState<BrowseAdoptionPresetId>("balanced");
  const browseAdoptionQueue = useMemo(
    () => browseAdoptionQueueState(results, adoptionPreset, 8),
    [results, adoptionPreset],
  );
  const [confidencePreset, setConfidencePreset] =
    React.useState<BrowseConfidencePresetId>("balanced");
  const browseDecisionConfidence = useMemo(
    () => browseDecisionConfidenceState(results, confidencePreset, 8),
    [results, confidencePreset],
  );
  const onAdoptionPresetSelect = useCallback(
    (preset: BrowseAdoptionPresetId) => {
      if (preset === adoptionPreset) return;
      trackEvent(
        browseDecisionPresetAnalyticsEvent(),
        browseDecisionPresetAnalyticsData("adoption-queue", preset, results.length),
      );
      setAdoptionPreset(preset);
    },
    [adoptionPreset, results.length],
  );
  const onConfidencePresetSelect = useCallback(
    (preset: BrowseConfidencePresetId) => {
      if (preset === confidencePreset) return;
      trackEvent(
        browseDecisionPresetAnalyticsEvent(),
        browseDecisionPresetAnalyticsData("decision-confidence", preset, results.length),
      );
      setConfidencePreset(preset);
    },
    [confidencePreset, results.length],
  );
  const nowIso = useMemo(() => new Date().toISOString(), []);
  const browseThemes = useMemo(() => browseThemeDistributionState(results, 24), [results]);
  const browseFreshness = useMemo(
    () => browseFreshnessDistributionState(results, nowIso, 12),
    [results, nowIso],
  );

  const activeCount =
    Number(!!sp.q) +
    Number(!!sp.category) +
    Number(!!sp.trust) +
    Number(!!sp.source) +
    Number(!!sp.signal) +
    Number(!!sp.platform);

  const clearAll = () =>
    navigate({
      search: {
        q: "",
        category: "",
        trust: "",
        source: "",
        signal: "",
        platform: "",
        sort: "popular",
        view: sp.view,
        compare: sp.compare,
      },
    });

  const onClearAllFilters = useCallback(() => {
    if (activeCount === 0) return;
    trackEvent(
      browseFilterClearAllAnalyticsEvent(),
      browseFilterClearAllAnalyticsData(
        activeCount,
        countForSlice({
          ...sp,
          q: "",
          category: "",
          trust: "",
          source: "",
          signal: "",
          platform: "",
        }),
      ),
    );
    clearAll();
  }, [activeCount, countForSlice, sp]);

  const applySavedSearch = useCallback(
    (search: SavedSearch) => {
      trackEvent(
        browseSavedSearchApplyAnalyticsEvent(),
        browseSavedSearchApplyAnalyticsData(search),
      );
      navigate({
        to: "/browse",
        search: {
          q: search.q ?? "",
          category: search.category ?? "",
          trust: search.trust ?? "",
          source: search.source ?? "",
          signal: search.signal ?? "",
          platform: search.platform ?? "",
          sort: (search.sort as "popular" | "newest" | "title") ?? "popular",
          view: "row" as const,
          compare: "",
        },
      });
    },
    [navigate],
  );

  const saveCurrent = () => {
    if (activeCount === 0) return;
    trackEvent(
      browseSavedSearchSaveAnalyticsEvent(),
      browseSavedSearchSaveAnalyticsData(activeCount),
    );
    const label = sp.q
      ? `“${sp.q}”${sp.category ? ` · ${sp.category}` : ""}`
      : `${sp.category || sp.trust || sp.source || browseTrustSignalLabel(sp.signal) || sp.platform || "Filter"}`;
    recents.saveSearch({
      label,
      q: sp.q,
      category: sp.category,
      trust: sp.trust,
      source: sp.source,
      signal: sp.signal,
      platform: sp.platform,
      sort: sp.sort,
    });
    toast.success("Search saved", { description: label });
  };

  // Pagination — render in chunks so very-large result sets don't tank perf.
  const PAGE = 30;
  const [shown, setShown] = React.useState(PAGE);
  React.useEffect(() => {
    setShown(PAGE);
  }, [sp.q, sp.category, sp.trust, sp.source, sp.signal, sp.platform, sp.sort]);

  const onLoadMore = useCallback(() => {
    const loadCount = Math.min(PAGE, results.length - shown);
    trackEvent(
      browseLoadMoreAnalyticsEvent(),
      browseLoadMoreAnalyticsData(shown, results.length, loadCount),
    );
    setShown((n) => n + PAGE);
  }, [results.length, shown]);

  // Per-axis facet counts: how many results if this value were the only filter
  // in its axis. Memoized on the search params and counted without sorting so
  // sidebar counts do not pay for result ranking on every filter change.
  const facetCounts = useMemo(() => {
    const countFor = (
      axis: "category" | "trust" | "source" | "signal" | "platform",
      value: string,
    ) => {
      const merged = { ...sp, [axis]: value } as typeof sp;
      return countSearchResults({
        q: merged.q,
        categories: merged.category ? [merged.category as Category] : undefined,
        trust: merged.trust ? [merged.trust as TrustLevel] : undefined,
        source: merged.source ? [merged.source as SourceStatus] : undefined,
        signal: isBrowseTrustSignalFilter(merged.signal) ? merged.signal : "",
        platforms: merged.platform ? [merged.platform as Platform] : undefined,
        sort: merged.sort,
      });
    };
    return {
      category: Object.fromEntries(CATEGORIES.map((c) => [c.id, countFor("category", c.id)])),
      trust: Object.fromEntries(TRUST_LEVELS.map((t) => [t, countFor("trust", t)])),
      source: Object.fromEntries(SOURCE_STATUSES.map((s) => [s, countFor("source", s)])),
      signal: buildBrowseTrustSignalCounts({
        q: sp.q,
        category: sp.category,
        trust: sp.trust,
        source: sp.source,
        signal: sp.signal,
        platform: sp.platform,
        sort: sp.sort,
      }),
      platform: Object.fromEntries(PLATFORM_IDS.map((p) => [p, countFor("platform", p)])),
    } as Record<string, Record<string, number>>;
  }, [sp]);

  const axisCount = (
    axis: "category" | "trust" | "source" | "signal" | "platform",
    value: string,
  ) => facetCounts[axis]?.[value] ?? 0;

  // Focus search on "/" key.
  const searchRef = React.useRef<HTMLInputElement>(null);
  useKeyboardShortcuts({
    "/": () => searchRef.current?.focus(),
    "]": () =>
      set({ view: sp.view === "compact" ? "row" : sp.view === "row" ? "grid" : "compact" }),
    "[": () => set({ view: sp.view === "grid" ? "row" : sp.view === "row" ? "compact" : "grid" }),
  });

  const recentEntries = recents.entries
    .map((r) => entryByRef(r.category, r.slug))
    .filter((e): e is NonNullable<typeof e> => !!e)
    .slice(0, 6);

  const activeFilters: ActiveFilter[] = [];
  if (sp.q)
    activeFilters.push({ key: "q", label: "Search", value: sp.q, onClear: () => set({ q: "" }) });
  if (sp.category)
    activeFilters.push({
      key: "category",
      label: "Category",
      value: sp.category,
      onClear: () => set({ category: "" }),
    });
  if (sp.trust)
    activeFilters.push({
      key: "trust",
      label: "Trust",
      value: sp.trust,
      onClear: () => set({ trust: "" }),
    });
  if (sp.source)
    activeFilters.push({
      key: "source",
      label: "Source",
      value: sp.source,
      onClear: () => set({ source: "" }),
    });
  if (isBrowseTrustSignalFilter(sp.signal))
    activeFilters.push({
      key: "signal",
      label: "Signal",
      value: browseTrustSignalLabel(sp.signal),
      onClear: () => set({ signal: "" }),
    });
  if (sp.platform)
    activeFilters.push({
      key: "platform",
      label: "Platform",
      value: sp.platform,
      onClear: () => set({ platform: "" }),
    });

  // Nearest-match: drop one filter at a time (least likely first) until we have results.
  const suggestions = useMemo(() => {
    if (results.length > 0 || activeFilters.length === 0)
      return [] as { label: string; apply: () => void; count: number }[];
    const trials = browseTrustRelaxationTrials({
      q: sp.q,
      category: sp.category,
      trust: sp.trust,
      source: sp.source,
      signal: sp.signal,
      platform: sp.platform,
      sort: sp.sort,
    });
    return trials
      .map((t) => {
        const merged = { ...sp, ...t.patch };
        const count = countSearchResults({
          q: merged.q,
          categories: merged.category ? [merged.category as Category] : undefined,
          trust: merged.trust ? [merged.trust as TrustLevel] : undefined,
          source: merged.source ? [merged.source as SourceStatus] : undefined,
          signal: isBrowseTrustSignalFilter(merged.signal) ? merged.signal : "",
          platforms: merged.platform ? [merged.platform as Platform] : undefined,
          sort: merged.sort,
        });
        return { label: t.label, count, apply: () => set(t.patch) };
      })
      .filter((s) => s.count > 0)
      .slice(0, 3);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sp, results.length]);

  const trustUtilityOptions = useMemo(
    () => buildBrowseTrustUtilityOptions(facetCounts.signal),
    [facetCounts.signal],
  );

  return (
    <div className="mx-auto max-w-page px-4 py-6 sm:px-6">
      <h1 className="sr-only">Browse the directory</h1>
      <div className="grid gap-6 lg:grid-cols-[260px_1fr]">
        {/* Filter sidebar */}
        <aside className="hidden lg:block">
          <div className="sticky top-20 flex flex-col gap-6">
            <FilterSection title="Category">
              <FilterChipGroup label="Filter by category" multi={false}>
                <FilterChip role="radio" active={!sp.category} onClick={() => onCategoryFilter("")}>
                  All
                </FilterChip>
                {CATEGORIES.map((c) => (
                  <FilterChip
                    key={c.id}
                    role="radio"
                    active={sp.category === c.id}
                    onClick={() => onCategoryFilter(c.id)}
                    count={axisCount("category", c.id)}
                  >
                    {c.label}
                  </FilterChip>
                ))}
              </FilterChipGroup>
            </FilterSection>

            <FilterSection title="Trust">
              <FilterChipGroup label="Filter by trust level">
                {TRUST_LEVELS.map((t) => (
                  <FilterChip
                    key={t}
                    active={sp.trust === t}
                    onClick={() => onToggleAxisFilter("trust", t)}
                    count={axisCount("trust", t)}
                  >
                    {t}
                  </FilterChip>
                ))}
              </FilterChipGroup>
            </FilterSection>

            <FilterSection title="Source">
              <FilterChipGroup label="Filter by source status">
                {SOURCE_STATUSES.map((s) => (
                  <FilterChip
                    key={s}
                    active={sp.source === s}
                    onClick={() => onToggleAxisFilter("source", s)}
                    count={axisCount("source", s)}
                  >
                    {s}
                  </FilterChip>
                ))}
              </FilterChipGroup>
            </FilterSection>

            <FilterSection title="Platform">
              <FilterChipGroup label="Filter by platform">
                {PLATFORM_IDS.map((p) => (
                  <FilterChip
                    key={p}
                    active={sp.platform === p}
                    onClick={() => onToggleAxisFilter("platform", p)}
                    count={axisCount("platform", p)}
                  >
                    {p}
                  </FilterChip>
                ))}
              </FilterChipGroup>
            </FilterSection>

            {activeCount > 0 && (
              <div className="flex flex-col gap-2">
                <span className="sr-only" aria-live="polite">
                  {activeCount} {activeCount === 1 ? "filter" : "filters"} active
                </span>
                <button
                  type="button"
                  onClick={onClearAllFilters}
                  className="inline-flex items-center gap-1 text-xs text-ink-muted hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60"
                >
                  <X className="h-3 w-3" /> Clear {activeCount}{" "}
                  {activeCount === 1 ? "filter" : "filters"}
                </button>
                <button
                  type="button"
                  onClick={saveCurrent}
                  className="inline-flex items-center gap-1 text-xs text-ink-muted hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60"
                >
                  <Star className="h-3 w-3" /> Save this search
                </button>
              </div>
            )}
          </div>
        </aside>

        {/* Results */}
        <div>
          <div className="sticky top-16 z-20 -mx-4 flex flex-col gap-3 border-b border-border bg-background/95 px-4 pb-4 pt-2 backdrop-blur supports-backdrop-filter:bg-background/80 sm:-mx-6 sm:px-6">
            <div className="flex items-center gap-2 rounded-lg border border-border bg-surface px-3 focus-within:border-accent/50 focus-within:ring-2 focus-within:ring-accent/40">
              <SearchIcon className="h-4 w-4 text-ink-muted" />
              <input
                ref={searchRef}
                value={qInput}
                onChange={(e) => setQInput(e.target.value)}
                placeholder="Search title, description, tags, author"
                aria-label="Search the directory"
                className="h-11 flex-1 bg-transparent text-sm text-ink placeholder:text-ink-subtle focus:outline-none"
              />
              <kbd className="hidden rounded border border-border bg-background px-1.5 font-mono text-[10px] text-ink-subtle sm:inline">
                /
              </kbd>
              {qInput && (
                <button
                  type="button"
                  onClick={() => {
                    trackEvent(
                      browseSearchClearAnalyticsEvent(),
                      browseSearchClearAnalyticsData(Boolean(qInput.trim()), results.length),
                    );
                    setQInput("");
                  }}
                  aria-label="Clear search"
                  className="rounded p-1 text-ink-subtle hover:text-ink"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex flex-wrap items-center gap-3 text-xs text-ink-muted">
                <span>
                  Showing{" "}
                  <span className="font-mono text-ink">{Math.min(shown, results.length)}</span>
                  {results.length > shown && (
                    <>
                      {" "}
                      of <span className="font-mono text-ink">{results.length}</span>
                    </>
                  )}{" "}
                  {results.length === 1 ? "resource" : "resources"}
                  {sp.category && (
                    <>
                      {" "}
                      in <span className="font-medium text-ink">{sp.category}</span>
                    </>
                  )}
                  {sp.q && (
                    <>
                      {" "}
                      for <span className="font-medium text-ink">"{sp.q}"</span>
                    </>
                  )}
                </span>
                {browseCompareUi?.showHint ? (
                  <div className="inline-flex flex-col items-end gap-1">
                    {browseCompareUi.overflowHint ? (
                      <span className="max-w-xs text-right text-[11px] text-amber-800">
                        {browseCompareUi.overflowHint}
                      </span>
                    ) : null}
                    {browseCompareUi.hint ? (
                      <span className="max-w-xs text-right text-[11px] text-ink-muted">
                        {browseCompareUi.hint}
                      </span>
                    ) : null}
                    <Link
                      to="/compare"
                      search={browseCompareUi.search}
                      onClick={() => {
                        trackEvent(
                          browseCompareOpenAnalyticsEvent(),
                          browseCompareOpenAnalyticsData(
                            browseCompareUi.selectedCount,
                            "browse-toolbar",
                          ),
                        );
                      }}
                      className="inline-flex items-center gap-1.5 rounded-full border border-accent bg-accent/10 px-2.5 py-1 text-[11px] font-medium text-ink hover:bg-accent/15"
                    >
                      <span className="font-mono">{browseCompareUi.selectedCount}</span> selected ·
                      Compare →
                    </Link>
                  </div>
                ) : null}
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <label className="inline-flex items-center gap-1.5 text-xs text-ink-muted">
                  <SlidersHorizontal className="h-3.5 w-3.5" />
                  Utility
                  <select
                    value={sp.signal}
                    onChange={(e) => onTrustUtilityFilter(e.target.value)}
                    aria-label="Trust signal utility filter"
                    className="h-7 max-w-44 rounded-md border border-border bg-surface px-2 text-xs text-ink focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/40"
                  >
                    {trustUtilityOptions.map((option) => (
                      <option key={option.id || "all"} value={option.id}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="inline-flex items-center gap-1.5 text-xs text-ink-muted">
                  <ArrowDownNarrowWide className="h-3.5 w-3.5" />
                  Sort
                  <select
                    value={sp.sort}
                    onChange={(e) => onSortSelect(e.target.value as typeof sp.sort)}
                    className="h-7 rounded-md border border-border bg-surface px-2 text-xs text-ink focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/40"
                  >
                    <option value="popular">Popular</option>
                    <option value="newest">Newest</option>
                    <option value="title">A–Z</option>
                  </select>
                </label>
                <div
                  className="inline-flex overflow-hidden rounded-md border border-border"
                  role="radiogroup"
                  aria-label="Result density"
                >
                  {(["compact", "row", "grid"] as const).map((v) => (
                    <button
                      key={v}
                      onClick={() => onViewSelect(v)}
                      aria-pressed={sp.view === v}
                      className={cn(
                        "px-2 py-1 text-xs capitalize transition-colors duration-200 ease-out motion-safe:active:scale-[0.97]",
                        sp.view === v
                          ? "bg-ink text-background"
                          : "bg-surface text-ink-muted hover:text-ink",
                      )}
                    >
                      {v === "row" ? "List" : v === "grid" ? "Card" : "Compact"}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <SavedSearchChipRow
              currentLabel={
                sp.q
                  ? `“${sp.q}”${sp.category ? ` · ${sp.category}` : ""}`
                  : sp.category ||
                    sp.trust ||
                    sp.source ||
                    browseTrustSignalLabel(sp.signal) ||
                    sp.platform ||
                    ""
              }
              canSave={activeCount > 0}
              onSave={saveCurrent}
              onApplySaved={applySavedSearch}
            />
            <FilterChipGroup label="Trust signal quick filters" multi={false}>
              {BROWSE_TRUST_SIGNAL_OPTIONS.map((option) => (
                <FilterChip
                  key={option.id}
                  role="radio"
                  active={sp.signal === option.id}
                  onClick={() => onTrustSignalFilter(option.id)}
                  count={axisCount("signal", option.id)}
                >
                  {option.label}
                </FilterChip>
              ))}
            </FilterChipGroup>
            <div className="hidden text-[10px] text-ink-subtle sm:block">
              <kbd className="rounded border border-border bg-surface px-1 font-mono">/</kbd> search
              · <kbd className="rounded border border-border bg-surface px-1 font-mono">[ ]</kbd>{" "}
              view density ·{" "}
              <kbd className="rounded border border-border bg-surface px-1 font-mono">esc</kbd>{" "}
              clear input
            </div>
          </div>

          {activeFilters.length > 0 && (
            <FilterSummaryBar
              filters={activeFilters}
              onClearAll={onClearAllFilters}
              className="mt-3"
            />
          )}

          {browseFilterDecision.hint ? (
            <p className="mt-2 text-xs text-ink-muted" role="status">
              {browseFilterDecision.hint}
            </p>
          ) : null}

          {browseResultsTrust.showPanel ? (
            <BrowseResultsTrustPanel
              state={browseResultsTrust}
              compareLink={
                browseCompareUi?.showHint
                  ? {
                      search: browseCompareUi.search,
                      selectedCount: browseCompareUi.selectedCount,
                    }
                  : null
              }
              className="mt-3"
            />
          ) : null}
          <BrowseRolloutSignalsPanel state={browseRolloutSignals} className="mt-3" />
          <BrowseAdoptionQueuePanel
            state={browseAdoptionQueue}
            selectedPreset={adoptionPreset}
            onSelectPreset={onAdoptionPresetSelect}
            className="mt-3"
          />
          <BrowseDecisionConfidencePanel
            state={browseDecisionConfidence}
            selectedPreset={confidencePreset}
            onSelectPreset={onConfidencePresetSelect}
            className="mt-3"
          />
          <BrowseFreshnessDistributionPanel state={browseFreshness} className="mt-3" />
          <BrowseThemeDistributionPanel state={browseThemes} className="mt-3" />

          {sp.category &&
            (() => {
              const cat = CATEGORIES.find((c) => c.id === sp.category);
              return cat ? (
                <div className="mt-3 rounded-md border border-border bg-surface-2 px-3 py-2 text-xs text-ink-muted">
                  <span className="font-medium text-ink">{cat.label}.</span> {cat.blurb}
                </div>
              ) : null;
            })()}

          {/* Mobile filter chips */}
          <div className="relative mt-4 lg:hidden">
            <div
              className="scrollbar-none flex gap-2 overflow-x-auto pb-2 [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
              role="radiogroup"
              aria-label="Filter by category"
            >
              {[
                { id: "", label: "All" },
                ...CATEGORIES.map((c) => ({ id: c.id, label: c.label })),
              ].map((c) => (
                <span key={c.id || "all"} className="shrink-0">
                  <FilterChip
                    role="radio"
                    active={(sp.category || "") === c.id}
                    onClick={() => onCategoryFilter(c.id)}
                  >
                    {c.label}
                  </FilterChip>
                </span>
              ))}
            </div>
            <span
              aria-hidden
              className="pointer-events-none absolute inset-y-0 right-0 w-8 bg-linear-to-l from-background to-transparent"
            />
          </div>

          <div className="relative mt-2 lg:hidden">
            <div
              className="scrollbar-none flex gap-2 overflow-x-auto pb-2 [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
              role="radiogroup"
              aria-label="Trust signal quick filters"
            >
              {BROWSE_TRUST_SIGNAL_OPTIONS.map((option) => (
                <span key={option.id} className="shrink-0">
                  <FilterChip
                    role="radio"
                    active={sp.signal === option.id}
                    onClick={() => onTrustSignalFilter(option.id)}
                    count={axisCount("signal", option.id)}
                  >
                    {option.label}
                  </FilterChip>
                </span>
              ))}
            </div>
            <span
              aria-hidden
              className="pointer-events-none absolute inset-y-0 right-0 w-8 bg-linear-to-l from-background to-transparent"
            />
          </div>

          {/* Recents + saved searches — collapsed by default to reclaim vertical space */}
          {(recentEntries.length > 0 || recents.saved.length > 0) && (
            <details
              className="mt-4 rounded-lg border border-border bg-surface px-3 py-2 [&[open]>summary>svg]:rotate-90"
              open={recents.saved.some((s) => s.alerts?.enabled)}
              onToggle={(e) => {
                const open = (e.currentTarget as HTMLDetailsElement).open;
                trackEvent(
                  browseRecentsPanelToggleAnalyticsEvent(),
                  browseRecentsPanelToggleAnalyticsData(
                    open,
                    recents.saved.length,
                    recentEntries.length,
                  ),
                );
              }}
            >
              <summary className="flex cursor-pointer list-none items-center gap-2 text-xs text-ink-muted hover:text-ink">
                <Clock className="h-3.5 w-3.5" />
                <span>Recents & saved searches</span>
                <span className="ml-auto font-mono text-[10px] text-ink-subtle">
                  {recents.saved.length} saved · {recentEntries.length} recent
                </span>
              </summary>
              <div className="mt-2 flex flex-col gap-2">
                {recents.saved.length > 0 && (
                  <div className="flex items-start gap-2">
                    <Star className="mt-1 h-3.5 w-3.5 shrink-0 text-ink-subtle" aria-hidden />
                    <div className="flex flex-wrap gap-1.5">
                      {recents.saved.map((s) => (
                        <span
                          key={s.id}
                          className="inline-flex items-center gap-1 rounded-md border border-border bg-background pl-2 pr-1 py-0.5 text-xs"
                        >
                          <Link
                            to="/browse"
                            search={{
                              q: s.q,
                              category: s.category ?? "",
                              trust: s.trust ?? "",
                              source: s.source ?? "",
                              signal: s.signal ?? "",
                              platform: s.platform ?? "",
                              sort: (s.sort as typeof sp.sort) ?? "popular",
                              view: sp.view,
                              compare: sp.compare,
                            }}
                            className="text-ink hover:underline"
                            onClick={() =>
                              trackEvent(
                                browseSavedSearchLinkClickAnalyticsEvent(),
                                browseSavedSearchLinkClickAnalyticsData(s),
                              )
                            }
                          >
                            {s.label}
                          </Link>
                          <button
                            type="button"
                            onClick={() => {
                              trackEvent(
                                browseSavedSearchRemoveAnalyticsEvent(),
                                browseSavedSearchRemoveAnalyticsData(recents.saved.length),
                              );
                              recents.removeSaved(s.id);
                              toast(`Removed “${s.label}”`);
                            }}
                            aria-label={`Remove saved search ${s.label}`}
                            className="text-ink-subtle hover:text-ink"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                {recentEntries.length > 0 && (
                  <div className="flex items-start gap-2">
                    <Clock className="mt-1 h-3.5 w-3.5 shrink-0 text-ink-subtle" aria-hidden />
                    <div className="flex flex-wrap gap-1.5">
                      {recentEntries.map((e, index) => (
                        <Link
                          key={`${e.category}/${e.slug}`}
                          to="/entry/$category/$slug"
                          params={{ category: e.category, slug: e.slug }}
                          className="inline-flex items-center rounded-md border border-border bg-background px-2 py-0.5 text-xs text-ink-muted hover:text-ink"
                          onClick={() =>
                            trackEvent(
                              browseRecentEntryClickAnalyticsEvent(),
                              browseRecentEntryClickAnalyticsData(index, recentEntries.length),
                            )
                          }
                        >
                          {e.title}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </details>
          )}

          {results.length === 0 ? (
            <div className="mt-12 flex flex-col items-center gap-3 rounded-lg border border-dashed border-border p-12 text-center">
              <SlidersHorizontal className="h-5 w-5 text-ink-muted" />
              <div className="font-display text-lg font-semibold text-ink">
                {sp.q ? (
                  <>
                    No matches for <span className="text-accent-ink">"{sp.q}"</span>
                  </>
                ) : (
                  "No matches with current filters"
                )}
              </div>
              <p className="max-w-sm text-sm text-ink-muted">
                The directory is curated, so some long-tail resources may not yet be indexed.
                {suggestions.length > 0 ? " Try relaxing a filter:" : ""}
              </p>
              {suggestions.length > 0 && (
                <ul className="mt-1 flex flex-col items-stretch gap-1.5 text-sm">
                  {suggestions.map((s) => (
                    <li key={s.label}>
                      <button
                        type="button"
                        onClick={() => {
                          trackEvent(
                            browseEmptySuggestionApplyAnalyticsEvent(),
                            browseEmptySuggestionApplyAnalyticsData(s.count),
                          );
                          s.apply();
                        }}
                        className="inline-flex w-full items-center justify-between gap-3 rounded-md border border-border bg-surface px-3 py-1.5 text-ink transition-colors duration-200 ease-out hover:bg-surface-2 motion-safe:active:scale-[0.99]"
                      >
                        <span>{s.label}</span>
                        <span className="font-mono text-xs text-ink-muted">
                          {s.count} match{s.count === 1 ? "" : "es"}
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
              {suggestions.length === 0 && (
                <div className="mt-2 flex flex-wrap items-center justify-center gap-2 text-xs">
                  {sp.q && (
                    <a
                      href={`https://github.com/search?q=${encodeURIComponent(sp.q)}&type=repositories`}
                      target="_blank"
                      rel="noreferrer"
                      onClick={() =>
                        trackEvent(
                          browseEmptyEgressAnalyticsEvent(),
                          browseEmptyEgressAnalyticsData("github-search", true, activeCount),
                        )
                      }
                      className="inline-flex h-8 items-center gap-1.5 rounded-md border border-border bg-surface px-3 font-medium text-ink hover:bg-surface-2"
                    >
                      Search GitHub for "{sp.q}" <ExternalLink className="h-3 w-3" />
                    </a>
                  )}
                  <a
                    href={sp.q ? `/submit?title=${encodeURIComponent(sp.q)}` : "/submit"}
                    onClick={() =>
                      trackEvent(
                        browseEmptyEgressAnalyticsEvent(),
                        browseEmptyEgressAnalyticsData("submit", Boolean(sp.q), activeCount),
                      )
                    }
                    className="inline-flex h-8 items-center gap-1.5 rounded-md bg-ink px-3 font-medium text-background hover:bg-ink/90"
                  >
                    Submit this resource
                  </a>
                </div>
              )}
              {activeCount > 0 && (
                <button
                  type="button"
                  onClick={onClearAllFilters}
                  className="mt-2 inline-flex h-8 items-center gap-1.5 rounded-md border border-border bg-surface px-3 text-xs font-medium text-ink hover:bg-surface-2"
                >
                  <X className="h-3.5 w-3.5" /> Clear all filters
                </button>
              )}
            </div>
          ) : (
            <>
              {browseCompareSelection.showBanner && browseCompareUi ? (
                <BrowseCompareSelectionBanner
                  state={browseCompareSelection}
                  compareSearch={browseCompareUi.search}
                  className="mt-4"
                />
              ) : null}
              {sp.view === "grid" ? (
                <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                  {results.slice(0, shown).map((e) => (
                    <ResourceCard
                      key={`${e.category}/${e.slug}`}
                      entry={e}
                      variant="grid"
                      compareItems={compare.items}
                      analyticsSurface="browse-grid"
                    />
                  ))}
                </div>
              ) : sp.view === "compact" ? (
                <div className="mt-2 overflow-hidden rounded-lg border border-border bg-surface">
                  {results.slice(0, shown).map((e, i) => (
                    <ResourceCard
                      key={`${e.category}/${e.slug}`}
                      entry={e}
                      variant="compact"
                      rank={i + 1}
                      compareItems={compare.items}
                      analyticsSurface="browse-compact"
                    />
                  ))}
                </div>
              ) : (
                <div className="mt-2 overflow-hidden rounded-lg border border-border bg-surface">
                  {results.slice(0, shown).map((e) => (
                    <ResourceCard
                      key={`${e.category}/${e.slug}`}
                      entry={e}
                      compareItems={compare.items}
                      analyticsSurface="browse-row"
                    />
                  ))}
                </div>
              )}
              {results.length > shown && (
                <div className="mt-4 flex justify-center">
                  <button
                    type="button"
                    onClick={onLoadMore}
                    className="inline-flex h-9 items-center gap-1.5 rounded-md border border-border bg-surface px-4 text-sm font-medium text-ink transition-colors duration-200 ease-out hover:bg-surface-2 motion-safe:active:scale-[0.98]"
                  >
                    Load {Math.min(PAGE, results.length - shown)} more · {results.length - shown}{" "}
                    remaining
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function FilterSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="eyebrow mb-2">{title}</div>
      {children}
    </div>
  );
}
