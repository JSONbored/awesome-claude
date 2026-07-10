import * as React from "react";
import { createFileRoute, Link, stripSearchParams } from "@tanstack/react-router";
import { absoluteUrl } from "@/lib/seo";
import { z } from "zod";
import { X, ArrowRight, ExternalLink, Plus, Search as SearchIcon } from "lucide-react";
import { ENTRIES } from "@/data/entries";
import { COMPARISONS } from "@/data/comparisons";
import { CategoryPill } from "@/components/badges";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { CopyButton } from "@/components/copy-button";
import { COMPARISON_ROWS as ROWS } from "@/components/comparison-table";
import { useCompare } from "@/lib/compare";
import { resolveCompareParam, serializeCompareItems } from "@/lib/compare-selection";
import { recordCompareIntentEvent } from "@/lib/compare-entry-actions";
import { COMPARE_PAGE_SURFACE, type CompareAction } from "@/lib/compare-page-actions-ui-lib";
import { comparePageActionsForEntry } from "@/lib/compare-page-actions-interactive-ui-lib";
import { comparePageInteractiveUiState } from "@/lib/compare-page-interactive-ui-lib";
import { compareDecisionBriefState } from "@/lib/compare-decision-brief";
import {
  compareScenarioRankingState,
  type CompareScenarioId,
} from "@/lib/compare-scenario-ranking";
import { compareEvidenceGapsState } from "@/lib/compare-evidence-gaps";
import {
  compareRolloutReadinessState,
  type RolloutPresetId,
} from "@/lib/compare-rollout-readiness";
import {
  compareOperationalFitHeatmapState,
  type OperationalFitPresetId,
} from "@/lib/compare-operational-fit-heatmap";
import {
  compareDeploymentRiskMapState,
  type DeploymentRiskPresetId,
} from "@/lib/compare-deployment-risk-map";
import {
  compareMitigationPriorityState,
  type MitigationPriorityPresetId,
} from "@/lib/compare-mitigation-priority";
import { trackEvent, entryEventKey } from "@/lib/analytics";
import {
  comparePageDecisionPresetAnalyticsData,
  comparePageDecisionPresetAnalyticsEvent,
} from "@/lib/compare-page-decision-preset-cta-events";
import { claimCtaAnalyticsData, claimCtaAnalyticsEvent } from "@/lib/conversion-cta-events";
import { sameEntry } from "@/lib/entry-identity";
import { search } from "@/data/search";
import { cn } from "@/lib/utils";
import type { Entry } from "@/types/registry";
import { CompareDecisionBriefPanel } from "@/components/compare-decision-brief-panel";
import { CompareScenarioRankingPanel } from "@/components/compare-scenario-ranking-panel";
import { CompareEvidenceGapsPanel } from "@/components/compare-evidence-gaps-panel";
import { CompareRolloutReadinessPanel } from "@/components/compare-rollout-readiness-panel";
import { CompareOperationalFitHeatmapPanel } from "@/components/compare-operational-fit-heatmap-panel";
import { CompareDeploymentRiskMapPanel } from "@/components/compare-deployment-risk-map-panel";
import { CompareMitigationPriorityPanel } from "@/components/compare-mitigation-priority-panel";
import { NewsletterInline } from "@/components/newsletter-inline";

const defaultSearch = { ids: "" };

const searchSchema = z.object({
  ids: z.string().catch(defaultSearch.ids).default(defaultSearch.ids),
});

export const Route = createFileRoute("/compare/")({
  validateSearch: searchSchema,
  search: {
    middlewares: [stripSearchParams(defaultSearch)],
  },
  head: () => ({
    meta: [
      { title: "Compare resources — HeyClaude" },
      { name: "description", content: "Side-by-side comparison of Claude workflow resources." },
      { property: "og:title", content: "Compare resources — HeyClaude" },
      {
        property: "og:description",
        content: "Side-by-side comparison of Claude workflow resources.",
      },
    ],
    links: [{ rel: "canonical", href: absoluteUrl("/compare") }],
  }),
  component: ComparePage,
});

function resolveIds(ids: string): Entry[] {
  return resolveCompareParam(ENTRIES, ids);
}

function ComparePage() {
  const sp = Route.useSearch();
  const navigate = Route.useNavigate();
  const compare = useCompare();

  // Hydrate items from URL on mount/change.
  React.useEffect(() => {
    compare.hydrate(sp.ids);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sp.ids]);

  const items = compare.items;
  const [hoverRow, setHoverRow] = React.useState<number | null>(null);
  const [pickerOpen, setPickerOpen] = React.useState(false);
  const { pageUi, emptyUi, actionRowDiverges, actionCells } = React.useMemo(
    () => comparePageInteractiveUiState(items, sp.ids, COMPARISONS, ENTRIES),
    [items, sp.ids],
  );
  const decisionBrief = React.useMemo(() => compareDecisionBriefState(items), [items]);
  const [scenario, setScenario] = React.useState<CompareScenarioId>("balanced");
  const [rolloutPreset, setRolloutPreset] = React.useState<RolloutPresetId>("team");
  const [fitPreset, setFitPreset] = React.useState<OperationalFitPresetId>("team-default");
  const [riskPreset, setRiskPreset] = React.useState<DeploymentRiskPresetId>("balanced");
  const [mitigationPreset, setMitigationPreset] =
    React.useState<MitigationPriorityPresetId>("balanced");
  const scenarioRanking = React.useMemo(
    () => compareScenarioRankingState(items, scenario),
    [items, scenario],
  );
  const evidenceGaps = React.useMemo(() => compareEvidenceGapsState(items), [items]);
  const rolloutReadiness = React.useMemo(
    () => compareRolloutReadinessState(items, rolloutPreset),
    [items, rolloutPreset],
  );
  const operationalFitHeatmap = React.useMemo(
    () => compareOperationalFitHeatmapState(items, fitPreset),
    [items, fitPreset],
  );
  const deploymentRiskMap = React.useMemo(
    () => compareDeploymentRiskMapState(items, riskPreset),
    [items, riskPreset],
  );
  const mitigationPriority = React.useMemo(
    () => compareMitigationPriorityState(items, mitigationPreset),
    [items, mitigationPreset],
  );

  const onRolloutPresetSelect = React.useCallback(
    (preset: RolloutPresetId) => {
      if (preset === rolloutPreset) return;
      trackEvent(
        comparePageDecisionPresetAnalyticsEvent(),
        comparePageDecisionPresetAnalyticsData("rollout-readiness", preset, items.length),
      );
      setRolloutPreset(preset);
    },
    [items.length, rolloutPreset],
  );
  const onFitPresetSelect = React.useCallback(
    (preset: OperationalFitPresetId) => {
      if (preset === fitPreset) return;
      trackEvent(
        comparePageDecisionPresetAnalyticsEvent(),
        comparePageDecisionPresetAnalyticsData("operational-fit", preset, items.length),
      );
      setFitPreset(preset);
    },
    [fitPreset, items.length],
  );
  const onRiskPresetSelect = React.useCallback(
    (preset: DeploymentRiskPresetId) => {
      if (preset === riskPreset) return;
      trackEvent(
        comparePageDecisionPresetAnalyticsEvent(),
        comparePageDecisionPresetAnalyticsData("deployment-risk", preset, items.length),
      );
      setRiskPreset(preset);
    },
    [items.length, riskPreset],
  );
  const onMitigationPresetSelect = React.useCallback(
    (preset: MitigationPriorityPresetId) => {
      if (preset === mitigationPreset) return;
      trackEvent(
        comparePageDecisionPresetAnalyticsEvent(),
        comparePageDecisionPresetAnalyticsData("mitigation-priority", preset, items.length),
      );
      setMitigationPreset(preset);
    },
    [items.length, mitigationPreset],
  );

  const pushIds = (next: Entry[]) => {
    const ids = serializeCompareItems(next);
    navigate({ search: { ids } });
  };

  const removeItem = (e: Entry) => {
    const next = items.filter((x) => !sameEntry(x, e));
    compare.toggle(e);
    pushIds(next);
  };

  const addItem = (e: Entry) => {
    if (items.length >= 4) return;
    if (items.some((x) => sameEntry(x, e))) return;
    compare.toggle(e);
    pushIds([...items, e]);
    setPickerOpen(false);
  };

  const copyShare = () => pageUi.shareUrl;

  if (items.length === 0) {
    const resolvedFromUrl = resolveIds(sp.ids);
    if (resolvedFromUrl.length > 0) {
      // Render directly from URL while context hydrates.
      return <Skeleton ids={sp.ids} />;
    }
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
        <div className="rounded-xl border border-dashed border-border bg-surface p-10 text-center">
          <div className="eyebrow">Comparison</div>
          <h1 className="mt-2 h-display-2 text-ink text-balance">Nothing to compare yet</h1>
          <p className="mt-2 text-sm text-ink-muted">{emptyUi.description}</p>
          {emptyUi.invalidUrlHint ? (
            <p className="mt-2 text-sm text-amber-800">{emptyUi.invalidUrlHint}</p>
          ) : null}
          <div className="mt-5 flex justify-center gap-2">
            <Link
              to="/browse"
              className="inline-flex h-9 items-center rounded-md bg-ink px-4 text-sm font-medium text-background hover:bg-ink/90"
            >
              Browse the directory
            </Link>
          </div>
          <div className="mt-6">
            <div className="eyebrow mb-2">Popular comparisons</div>
            <div className="flex flex-wrap justify-center gap-2">
              {emptyUi.popularComparisonLinks.map((comparison) => (
                <div
                  key={comparison.slug}
                  className="inline-flex flex-wrap items-center justify-center gap-1.5 rounded-full border border-border bg-background px-3 py-1.5"
                >
                  <Link
                    to="/compare/$slug"
                    params={{ slug: comparison.slug }}
                    className="text-xs text-ink-muted hover:text-ink"
                  >
                    {comparison.heading}
                  </Link>
                  {comparison.interactiveSearch ? (
                    <Link
                      to="/compare"
                      search={comparison.interactiveSearch}
                      className="text-[10px] text-ink-subtle hover:text-ink"
                    >
                      {comparison.interactiveLabel}
                    </Link>
                  ) : null}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-page px-4 py-6 sm:px-6">
      <Breadcrumbs home items={[{ label: "Compare" }]} />
      <div className="mt-4 flex flex-wrap items-end justify-between gap-3 border-b border-border pb-4">
        <div>
          <div className="eyebrow">Compare</div>
          <h1 className="mt-1 h-display-2 text-ink text-balance">
            {items.length} {items.length === 1 ? "resource" : "resources"} side by side
          </h1>
          {pageUi.bannerTexts.length > 0 ? (
            <div className="mt-2 space-y-1.5">
              {pageUi.bannerTexts.map((text) => (
                <p key={text} className="text-sm text-ink-muted">
                  {text}
                </p>
              ))}
            </div>
          ) : null}
          {pageUi.singleItemHint ? (
            <p className="mt-2 text-sm text-ink-muted">{pageUi.singleItemHint}</p>
          ) : null}
        </div>
        <div className="flex items-center gap-2">
          <CopyButton value={copyShare()} label="Copy share link" />
          <button
            type="button"
            onClick={() => {
              compare.clear();
              navigate({ search: { ids: "" } });
            }}
            className="inline-flex h-8 items-center rounded-md border border-border bg-surface px-3 text-xs text-ink-muted hover:bg-surface-2 hover:text-ink"
          >
            Clear all
          </button>
        </div>
      </div>

      <div className="mt-4 overflow-auto rounded-xl border border-border">
        <CompareDecisionBriefPanel state={decisionBrief} className="m-3 mb-0" />
        <CompareScenarioRankingPanel
          state={scenarioRanking}
          selectedScenario={scenario}
          onSelectScenario={setScenario}
          className="m-3"
        />
        <CompareEvidenceGapsPanel state={evidenceGaps} className="m-3 mt-0" />
        <CompareRolloutReadinessPanel
          state={rolloutReadiness}
          selectedPreset={rolloutPreset}
          onSelectPreset={onRolloutPresetSelect}
          className="m-3 mt-0"
        />
        <CompareOperationalFitHeatmapPanel
          state={operationalFitHeatmap}
          selectedPreset={fitPreset}
          onSelectPreset={onFitPresetSelect}
          className="m-3 mt-0"
        />
        <CompareDeploymentRiskMapPanel
          state={deploymentRiskMap}
          selectedPreset={riskPreset}
          onSelectPreset={onRiskPresetSelect}
          className="m-3 mt-0"
        />
        <CompareMitigationPriorityPanel
          state={mitigationPriority}
          selectedPreset={mitigationPreset}
          onSelectPreset={onMitigationPresetSelect}
          className="m-3 mt-0"
        />
      </div>

      <div className="mt-4 overflow-auto rounded-xl border border-border">
        <table className="w-full border-collapse text-sm">
          <thead className="sticky top-0 z-10 bg-surface">
            <tr>
              <th
                scope="col"
                className="sticky left-0 z-20 w-[150px] border-b border-r border-border bg-surface p-3 text-left text-xs uppercase tracking-wider text-ink-subtle"
              >
                Field
              </th>
              {items.map((e) => (
                <th
                  scope="col"
                  key={`${e.category}/${e.slug}`}
                  className="min-w-[260px] max-w-[320px] border-b border-r border-border bg-surface p-3 text-left align-top"
                >
                  <div className="flex items-start justify-between gap-2">
                    <Link
                      to="/entry/$category/$slug"
                      params={{ category: e.category, slug: e.slug }}
                      className="font-display text-sm font-semibold text-ink hover:underline"
                    >
                      {e.title}
                    </Link>
                    <button
                      type="button"
                      onClick={() => removeItem(e)}
                      aria-label={`Remove ${e.title}`}
                      className="rounded p-0.5 text-ink-subtle hover:text-ink"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>
                  <p className="mt-1 line-clamp-2 text-xs text-ink-muted">{e.description}</p>
                  <Link
                    to="/entry/$category/$slug"
                    params={{ category: e.category, slug: e.slug }}
                    className="mt-2 inline-flex items-center gap-1 text-[11px] text-ink-muted hover:text-ink"
                  >
                    Open dossier <ArrowRight className="h-3 w-3" />
                  </Link>
                </th>
              ))}
              {items.length < 4 && (
                <th
                  scope="col"
                  className="min-w-[220px] border-b border-border bg-surface p-3 text-left align-top"
                >
                  <AddColumn
                    open={pickerOpen}
                    setOpen={setPickerOpen}
                    onPick={addItem}
                    exclude={items}
                  />
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            <tr
              className={cn(
                "transition-colors duration-200 ease-out",
                actionRowDiverges ? "bg-amber-500/5" : "bg-surface-2/30",
              )}
            >
              <th
                scope="row"
                className={cn(
                  "sticky left-0 z-10 w-[150px] border-b border-r border-border bg-inherit p-3 text-left align-top text-xs font-medium text-ink-muted",
                  actionRowDiverges && "text-amber-800",
                )}
              >
                Next steps
                {actionRowDiverges ? (
                  <span className="mt-0.5 block text-[10px] font-normal uppercase tracking-wide text-amber-700">
                    Differs
                  </span>
                ) : null}
              </th>
              {items.map((e) => (
                <td
                  key={`actions-${e.category}/${e.slug}`}
                  className={cn(
                    "min-w-[260px] max-w-[320px] border-b border-r border-border p-3 align-top",
                    actionRowDiverges && "bg-amber-500/5",
                  )}
                >
                  <CompareNextActions entry={e} actionCells={actionCells} />
                </td>
              ))}
              {items.length < 4 && (
                <td className="min-w-[220px] border-b border-border p-3 align-top text-xs text-ink-subtle">
                  —
                </td>
              )}
            </tr>
            {ROWS.map((row, i) => {
              const rowDiverges = row.diverges?.(items) ?? false;
              return (
                <tr
                  key={row.label}
                  onMouseEnter={() => setHoverRow(i)}
                  onMouseLeave={() => setHoverRow(null)}
                  className={cn(
                    "transition-colors duration-200 ease-out",
                    rowDiverges
                      ? "bg-amber-500/5"
                      : hoverRow === i
                        ? "bg-accent/5"
                        : i % 2 === 0
                          ? "bg-surface-2/30"
                          : "",
                  )}
                >
                  <th
                    scope="row"
                    className={cn(
                      "sticky left-0 z-10 w-[150px] border-b border-r border-border bg-inherit p-3 text-left align-top text-xs font-medium text-ink-muted",
                      rowDiverges && "text-amber-800",
                    )}
                  >
                    {row.label}
                    {rowDiverges ? (
                      <span className="mt-0.5 block text-[10px] font-normal uppercase tracking-wide text-amber-700">
                        Differs
                      </span>
                    ) : null}
                  </th>
                  {items.map((e) => (
                    <td
                      key={`${e.category}/${e.slug}`}
                      className={cn(
                        "min-w-[260px] max-w-[320px] border-b border-r border-border p-3 align-top",
                        rowDiverges && "bg-amber-500/5",
                      )}
                    >
                      {row.render(e)}
                    </td>
                  ))}
                  {items.length < 4 && (
                    <td className="min-w-[220px] border-b border-border p-3 align-top text-xs text-ink-subtle">
                      —
                    </td>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <p className="mt-3 text-xs text-ink-subtle">
        Share this comparison by copying the link above — the selection is encoded in the URL.
      </p>

      <NewsletterInline
        variant="quiet"
        title="More comparisons, weekly"
        description="A short, calm digest of reviewed Claude resources. Unsubscribe any time."
        source={sp.ids ? `compare:ids:${sp.ids}` : "compare:interactive"}
        className="mt-14"
      />
    </div>
  );
}

function CompareNextActions({
  entry,
  actionCells,
}: {
  entry: Entry;
  actionCells: ReturnType<typeof comparePageInteractiveUiState>["actionCells"];
}) {
  const actions = comparePageActionsForEntry(entry, actionCells);

  return (
    <div className="flex flex-wrap gap-1.5">
      {actions.map((action) => (
        <CompareActionButton key={action.id} entry={entry} action={action} />
      ))}
    </div>
  );
}

function CompareActionButton({ entry, action }: { entry: Entry; action: CompareAction }) {
  const eventKey = entryEventKey(entry.category, entry.slug);

  if (action.kind === "copy" && action.copyValue) {
    return (
      <CopyButton
        value={action.copyValue}
        label={action.label}
        event={action.analyticsEvent}
        eventData={{ entry: eventKey, surface: COMPARE_PAGE_SURFACE }}
        onCopied={() => {
          if (action.intentType) void recordCompareIntentEvent(action.intentType, entry);
        }}
      />
    );
  }

  if (action.kind === "link") {
    if (action.id === "dossier") {
      return (
        <Link
          to="/entry/$category/$slug"
          params={{ category: entry.category, slug: entry.slug }}
          onClick={() => {
            if (action.analyticsEvent) {
              trackEvent(action.analyticsEvent, { entry: eventKey, surface: COMPARE_PAGE_SURFACE });
            }
            if (action.intentType) void recordCompareIntentEvent(action.intentType, entry);
          }}
          className="inline-flex h-7 items-center rounded-md border border-border bg-surface px-2 text-xs font-medium text-ink hover:bg-surface-2"
        >
          {action.label}
        </Link>
      );
    }

    if (action.id === "claim") {
      return (
        <Link
          to="/claim"
          onClick={() => {
            trackEvent(
              claimCtaAnalyticsEvent(),
              claimCtaAnalyticsData("compare-page", entry.category, entry.slug),
            );
          }}
          className="inline-flex h-7 items-center rounded-md border border-border bg-surface px-2 text-xs font-medium text-ink hover:bg-surface-2"
        >
          {action.label}
        </Link>
      );
    }

    if (action.href) {
      return (
        <a
          href={action.href}
          target={action.external ? "_blank" : undefined}
          rel={action.external ? "noreferrer" : undefined}
          onClick={() => {
            if (action.analyticsEvent) {
              trackEvent(action.analyticsEvent, { entry: eventKey, surface: COMPARE_PAGE_SURFACE });
            }
            if (action.intentType) void recordCompareIntentEvent(action.intentType, entry);
          }}
          className="inline-flex h-7 items-center rounded-md border border-border bg-surface px-2 text-xs font-medium text-ink hover:bg-surface-2"
        >
          {action.label}
        </a>
      );
    }
  }

  return null;
}

function Skeleton({ ids }: { ids: string }) {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <div className="rounded-xl border border-border bg-surface p-6 text-sm text-ink-muted">
        Loading comparison for <code className="font-mono text-ink">{ids}</code>…
      </div>
    </div>
  );
}

function AddColumn({
  open,
  setOpen,
  onPick,
  exclude,
}: {
  open: boolean;
  setOpen: (v: boolean) => void;
  onPick: (e: Entry) => void;
  exclude: Entry[];
}) {
  const [q, setQ] = React.useState("");
  const results = React.useMemo(() => {
    const list = search({ q, sort: "popular" }).slice(0, 8);
    return list.filter((e) => !exclude.some((x) => sameEntry(x, e)));
  }, [q, exclude]);

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex h-8 items-center gap-1.5 rounded-md border border-dashed border-border bg-background px-3 text-xs text-ink-muted hover:bg-surface-2 hover:text-ink"
      >
        <Plus className="h-3.5 w-3.5" />
        Add resource
      </button>
    );
  }
  return (
    <div className="flex flex-col gap-2">
      <label className="flex items-center gap-2 rounded-md border border-border bg-background px-2">
        <SearchIcon className="h-3.5 w-3.5 text-ink-subtle" />
        <input
          autoFocus
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search to add…"
          className="h-7 flex-1 bg-transparent text-xs text-ink placeholder:text-ink-subtle focus:outline-none"
        />
        <button
          type="button"
          onClick={() => setOpen(false)}
          aria-label="Close picker"
          className="text-ink-subtle hover:text-ink"
        >
          <X className="h-3 w-3" />
        </button>
      </label>
      <ul className="max-h-56 overflow-auto rounded-md border border-border bg-background">
        {results.length === 0 && (
          <li className="px-2 py-1.5 text-xs text-ink-subtle">No matches.</li>
        )}
        {results.map((e) => (
          <li key={`${e.category}/${e.slug}`}>
            <button
              type="button"
              onClick={() => onPick(e)}
              className="flex w-full items-center gap-2 px-2 py-1.5 text-left text-xs hover:bg-surface-2"
            >
              <CategoryPill>{e.category}</CategoryPill>
              <span className="line-clamp-1 text-ink">{e.title}</span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
