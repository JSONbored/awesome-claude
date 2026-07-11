import * as React from "react";
import { Link } from "@tanstack/react-router";
import { X, ExternalLink, ArrowRight, Shield, Lock } from "lucide-react";
import { toast } from "sonner";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { useCompare } from "@/lib/compare";
import { CategoryPill, PlatformChip, NotesPresenceChips } from "@/components/badges";
import { HarnessBadgeRow } from "@/components/harness-badge";
import { HarnessVariantPicker } from "@/components/harness-variant-picker";
import { TrustDrilldown } from "./trust-drilldown";
import { CopyButton } from "./copy-button";
import { CopySegmented, variantsForEntry } from "./copy-segmented";
import { EntryBrandMark } from "./entry-brand-mark";
import { useCopyPref, useHarnessPref, type CopyVariant } from "@/lib/dossier-prefs";
import { COMPARE_DRAWER_SURFACE, type CompareAction } from "@/lib/compare-drawer-actions-ui-lib";
import { compareDrawerActionsForEntry } from "@/lib/compare-drawer-actions-interactive-ui-lib";
import { compareDrawerInteractiveUiState } from "@/lib/compare-drawer-interactive-ui-lib";
import { recordCompareIntentEvent } from "@/lib/compare-entry-actions";
import { trackEvent, entryEventKey, outboundHost } from "@/lib/analytics";
import {
  compareDrawerClearAnalyticsData,
  compareDrawerClearAnalyticsEvent,
  compareDrawerUndoRestoreAnalyticsData,
  compareDrawerUndoRestoreAnalyticsEvent,
  compareDrawerSourceAnalyticsData,
  compareDrawerSourceAnalyticsEvent,
  compareDrawerShareLinkCopyAnalyticsData,
  compareDrawerShareLinkCopyAnalyticsEvent,
  compareDrawerRemoveAnalyticsData,
  compareDrawerRemoveAnalyticsEvent,
  compareDrawerFullViewAnalyticsData,
  compareDrawerFullViewAnalyticsEvent,
  compareDrawerOpenDossierAnalyticsData,
  compareDrawerOpenDossierAnalyticsEvent,
} from "@/lib/compare-drawer-cta-events";
import {
  compareDrawerDecisionPresetAnalyticsData,
  compareDrawerDecisionPresetAnalyticsEvent,
} from "@/lib/compare-drawer-decision-preset-cta-events";
import {
  compareDrawerScenarioAnalyticsData,
  compareDrawerScenarioAnalyticsEvent,
} from "@/lib/compare-drawer-scenario-cta-events";
import {
  compareDrawerSnippetCopyAnalyticsData,
  compareDrawerSnippetCopyAnalyticsEvent,
  compareDrawerSnippetVariantAnalyticsData,
  compareDrawerSnippetVariantAnalyticsEvent,
} from "@/lib/compare-drawer-snippet-cta-events";
import { claimCtaAnalyticsData, claimCtaAnalyticsEvent } from "@/lib/conversion-cta-events";
import type { Entry, Harness } from "@/types/registry";
import { cn } from "@/lib/utils";
import { sameEntry } from "@/lib/entry-identity";
import { brandIdentityLabel } from "@/lib/brand-icons";
import { compareDecisionBriefState } from "@/lib/compare-decision-brief";
import { CompareDecisionBriefPanel } from "@/components/compare-decision-brief-panel";
import {
  compareScenarioRankingState,
  type CompareScenarioId,
} from "@/lib/compare-scenario-ranking";
import { CompareScenarioRankingPanel } from "@/components/compare-scenario-ranking-panel";
import { compareEvidenceGapsState } from "@/lib/compare-evidence-gaps";
import { CompareEvidenceGapsPanel } from "@/components/compare-evidence-gaps-panel";
import {
  compareRolloutReadinessState,
  type RolloutPresetId,
} from "@/lib/compare-rollout-readiness";
import { CompareRolloutReadinessPanel } from "@/components/compare-rollout-readiness-panel";
import {
  compareOperationalFitHeatmapState,
  type OperationalFitPresetId,
} from "@/lib/compare-operational-fit-heatmap";
import { CompareOperationalFitHeatmapPanel } from "@/components/compare-operational-fit-heatmap-panel";
import {
  compareDeploymentRiskMapState,
  type DeploymentRiskPresetId,
} from "@/lib/compare-deployment-risk-map";
import { CompareDeploymentRiskMapPanel } from "@/components/compare-deployment-risk-map-panel";
import {
  compareMitigationPriorityState,
  type MitigationPriorityPresetId,
} from "@/lib/compare-mitigation-priority";
import { CompareMitigationPriorityPanel } from "@/components/compare-mitigation-priority-panel";
import {
  compareDrawerDecisionRows,
  compareSignalToneClass,
  type CompareSignalValue,
} from "@/lib/compare-drawer-signals-ui-lib";

interface RowDef {
  label: string;
  render: (e: Entry) => React.ReactNode;
}

function CompareDrawerSourceCell({ entry }: { entry: Entry }) {
  if (!entry.sourceUrl) {
    return <span className="text-xs text-ink-subtle">—</span>;
  }

  return (
    <a
      href={entry.sourceUrl}
      target="_blank"
      rel="noreferrer"
      onClick={() => {
        trackEvent(
          compareDrawerSourceAnalyticsEvent(),
          compareDrawerSourceAnalyticsData(
            entry.category,
            entry.slug,
            outboundHost(entry.sourceUrl!),
          ),
        );
        void recordCompareIntentEvent("open", entry);
      }}
      className="inline-flex items-center gap-1 text-xs text-ink-muted hover:text-ink"
    >
      Repository <ExternalLink className="h-3 w-3" />
    </a>
  );
}

const ROWS: RowDef[] = [
  {
    label: "Trust",
    render: (e) => <TrustDrilldown entry={e} />,
  },
  ...compareDrawerDecisionRows().map((row) => ({
    label: row.label,
    render: (e: Entry) => {
      const value = row.resolve(e);
      if (!value) return <span className="text-xs text-ink-subtle">—</span>;
      return <CompareSignalCell value={value} />;
    },
  })),
  {
    label: "Safety",
    render: (e) =>
      e.safetyNotes || e.safetyNotesList?.length ? (
        <span className="inline-flex items-center gap-1 text-xs text-trust-trusted">
          <Shield className="h-3.5 w-3.5" aria-hidden /> Notes present
        </span>
      ) : (
        <span className="inline-flex items-center gap-1 text-xs text-ink-subtle">
          <Shield className="h-3.5 w-3.5 opacity-50" aria-hidden /> Missing
        </span>
      ),
  },
  {
    label: "Privacy",
    render: (e) =>
      e.privacyNotes || e.privacyNotesList?.length ? (
        <span className="inline-flex items-center gap-1 text-xs text-trust-trusted">
          <Lock className="h-3.5 w-3.5" aria-hidden /> Notes present
        </span>
      ) : (
        <span className="inline-flex items-center gap-1 text-xs text-ink-subtle">
          <Lock className="h-3.5 w-3.5 opacity-50" aria-hidden /> Missing
        </span>
      ),
  },
  {
    label: "Brand",
    render: (e) => {
      const label = brandIdentityLabel(e);
      return label ? (
        <span className="inline-flex items-center gap-2 text-sm text-ink">
          <EntryBrandMark entry={e} size="sm" />
          <span>{label}</span>
        </span>
      ) : (
        <span className="text-xs text-ink-subtle">—</span>
      );
    },
  },
  {
    label: "Category",
    render: (e) => <CategoryPill>{e.category}</CategoryPill>,
  },
  {
    label: "Author",
    render: (e) => <span className="text-sm text-ink">{e.author}</span>,
  },
  {
    label: "Platforms",
    render: (e) => (
      <div className="flex flex-wrap gap-1">
        {e.platforms.map((p) => (
          <PlatformChip key={p} id={p} />
        ))}
      </div>
    ),
  },
  {
    label: "Harness",
    render: (e) =>
      e.harness && e.harness.length > 0 ? (
        <HarnessBadgeRow ids={e.harness} />
      ) : (
        <span className="text-xs text-ink-subtle">—</span>
      ),
  },
  {
    label: "Notes",
    render: (e) => <NotesPresenceChips entry={e} />,
  },
  {
    label: "Source repo",
    render: (e) => (
      <span className="font-mono text-sm text-ink">
        {e.repoStats?.stars !== undefined
          ? `${e.repoStats.stars.toLocaleString()} repo stars`
          : "—"}
      </span>
    ),
  },
  {
    label: "Snippet",
    render: (e) => <SnippetCell entry={e} />,
  },
  {
    label: "Source",
    render: (e) => <CompareDrawerSourceCell entry={e} />,
  },
  {
    label: "Claim",
    render: (e) => (
      <span className="text-xs text-ink-muted">{e.claimed ? "Claimed" : "Unclaimed"}</span>
    ),
  },
];

function CompareSignalCell({ value }: { value: CompareSignalValue }) {
  return (
    <span
      className={cn("inline-flex flex-col gap-0.5 text-xs", compareSignalToneClass(value.tone))}
    >
      <span>{value.label}</span>
      {value.detail ? <span className="text-ink-muted">{value.detail}</span> : null}
    </span>
  );
}

function DrawerCompareActions({
  entry,
  actionCells,
}: {
  entry: Entry;
  actionCells: ReturnType<typeof compareDrawerInteractiveUiState>["actionCells"];
}) {
  const actions = compareDrawerActionsForEntry(entry, actionCells);

  return (
    <div className="flex flex-wrap gap-1.5">
      {actions.map((action) => (
        <DrawerActionButton key={action.id} entry={entry} action={action} />
      ))}
    </div>
  );
}

function DrawerActionButton({ entry, action }: { entry: Entry; action: CompareAction }) {
  const eventKey = entryEventKey(entry.category, entry.slug);

  if (action.kind === "copy" && action.copyValue) {
    return (
      <CopyButton
        value={action.copyValue}
        label={action.label}
        event={action.analyticsEvent}
        eventData={{ entry: eventKey, surface: COMPARE_DRAWER_SURFACE }}
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
              trackEvent(action.analyticsEvent, {
                entry: eventKey,
                surface: COMPARE_DRAWER_SURFACE,
              });
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
              claimCtaAnalyticsData("compare-drawer", entry.category, entry.slug),
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
              trackEvent(action.analyticsEvent, {
                entry: eventKey,
                surface: COMPARE_DRAWER_SURFACE,
              });
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

/** Per-entry snippet cell that honors the global copy variant + harness pref. */
function SnippetCell({ entry }: { entry: Entry }) {
  const harnessAvailable = React.useMemo<Harness[]>(
    () => (entry.harnessVariants ? (Object.keys(entry.harnessVariants) as Harness[]) : []),
    [entry.harnessVariants],
  );
  const [harness, setHarness] = useHarnessPref(entry.category, entry.slug, harnessAvailable);
  const variants = React.useMemo(() => variantsForEntry(entry, harness), [entry, harness]);
  const [pref] = useCopyPref();
  const firstAvailable = variants.find((v) => v.value)?.id ?? "install";
  const active = pref && variants.find((v) => v.id === pref)?.value ? pref : firstAvailable;
  const payload = variants.find((v) => v.id === active)?.value;
  if (!payload && harnessAvailable.length < 2) {
    return <span className="text-xs text-ink-subtle">—</span>;
  }
  return (
    <div className="space-y-1.5">
      {harnessAvailable.length >= 2 && (
        <HarnessVariantPicker
          available={harnessAvailable}
          value={harness as Harness | null}
          onChange={setHarness}
        />
      )}
      {payload ? (
        <>
          <pre className="max-h-24 overflow-auto rounded-md bg-background p-2 font-mono text-[11px] text-ink">
            <code>{payload}</code>
          </pre>
          <CopyButton
            value={payload}
            label={`Copy ${active}`}
            toastLabel={`Copied ${active} — ${entry.title}`}
            event={compareDrawerSnippetCopyAnalyticsEvent(active as CopyVariant)}
            eventData={compareDrawerSnippetCopyAnalyticsData(
              entry.category,
              entry.slug,
              active as CopyVariant,
            )}
          />
        </>
      ) : (
        <span className="text-xs text-ink-subtle">No {active} snippet for this harness.</span>
      )}
    </div>
  );
}

export function CompareDrawer() {
  const { items, open, setOpen, toggle, clear, hydrate } = useCompare();
  const [scenario, setScenario] = React.useState<CompareScenarioId>("balanced");
  const [rolloutPreset, setRolloutPreset] = React.useState<RolloutPresetId>("team");
  const [fitPreset, setFitPreset] = React.useState<OperationalFitPresetId>("team-default");
  const [riskPreset, setRiskPreset] = React.useState<DeploymentRiskPresetId>("balanced");
  const [mitigationPreset, setMitigationPreset] =
    React.useState<MitigationPriorityPresetId>("balanced");
  const {
    drawerUi,
    emptyHint,
    singleItemHint,
    shareUrl,
    divergingDecisionLabels,
    actionRowDiverges,
    actionCells,
  } = compareDrawerInteractiveUiState(items);
  const decisionBrief = compareDecisionBriefState(items);
  const scenarioRanking = compareScenarioRankingState(items, scenario);
  const evidenceGaps = compareEvidenceGapsState(items);
  const rolloutReadiness = compareRolloutReadinessState(items, rolloutPreset);
  const operationalFitHeatmap = compareOperationalFitHeatmapState(items, fitPreset);
  const deploymentRiskMap = compareDeploymentRiskMapState(items, riskPreset);
  const mitigationPriority = compareMitigationPriorityState(items, mitigationPreset);
  const { bannerTexts, fullViewSearch } = drawerUi;

  const onScenarioSelect = React.useCallback(
    (next: CompareScenarioId) => {
      if (next === scenario) return;
      trackEvent(
        compareDrawerScenarioAnalyticsEvent(),
        compareDrawerScenarioAnalyticsData(next, items.length),
      );
      setScenario(next);
    },
    [items.length, scenario],
  );
  const onRolloutPresetSelect = React.useCallback(
    (preset: RolloutPresetId) => {
      if (preset === rolloutPreset) return;
      trackEvent(
        compareDrawerDecisionPresetAnalyticsEvent(),
        compareDrawerDecisionPresetAnalyticsData("rollout-readiness", preset, items.length),
      );
      setRolloutPreset(preset);
    },
    [items.length, rolloutPreset],
  );
  const onFitPresetSelect = React.useCallback(
    (preset: OperationalFitPresetId) => {
      if (preset === fitPreset) return;
      trackEvent(
        compareDrawerDecisionPresetAnalyticsEvent(),
        compareDrawerDecisionPresetAnalyticsData("operational-fit", preset, items.length),
      );
      setFitPreset(preset);
    },
    [fitPreset, items.length],
  );
  const onRiskPresetSelect = React.useCallback(
    (preset: DeploymentRiskPresetId) => {
      if (preset === riskPreset) return;
      trackEvent(
        compareDrawerDecisionPresetAnalyticsEvent(),
        compareDrawerDecisionPresetAnalyticsData("deployment-risk", preset, items.length),
      );
      setRiskPreset(preset);
    },
    [items.length, riskPreset],
  );
  const onMitigationPresetSelect = React.useCallback(
    (preset: MitigationPriorityPresetId) => {
      if (preset === mitigationPreset) return;
      trackEvent(
        compareDrawerDecisionPresetAnalyticsEvent(),
        compareDrawerDecisionPresetAnalyticsData("mitigation-priority", preset, items.length),
      );
      setMitigationPreset(preset);
    },
    [items.length, mitigationPreset],
  );

  const onSnippetVariantSelect = React.useCallback(
    (variant: CopyVariant) => {
      trackEvent(
        compareDrawerSnippetVariantAnalyticsEvent(),
        compareDrawerSnippetVariantAnalyticsData(variant, items.length),
      );
    },
    [items.length],
  );

  const onClear = () => {
    const snapshot = items.map((e) => `${e.category}/${e.slug}`).join(",");
    if (!snapshot) return clear();
    const clearedCount = items.length;
    trackEvent(compareDrawerClearAnalyticsEvent(), compareDrawerClearAnalyticsData(clearedCount));
    clear();
    toast("Compare cleared", {
      description: `${clearedCount} item${clearedCount === 1 ? "" : "s"} removed`,
      action: {
        label: "Undo",
        onClick: () => {
          hydrate(snapshot);
          setOpen(true);
          trackEvent(
            compareDrawerUndoRestoreAnalyticsEvent(),
            compareDrawerUndoRestoreAnalyticsData(clearedCount),
          );
        },
      },
    });
  };

  const onRemove = (e: Entry) => {
    const remainingCount = items.filter((item) => !sameEntry(item, e)).length;
    trackEvent(
      compareDrawerRemoveAnalyticsEvent(),
      compareDrawerRemoveAnalyticsData(e.category, e.slug, remainingCount),
    );
    toggle(e);
    toast(`Removed “${e.title}” from compare`);
  };

  const onOpenDossier = (entry: Entry) => {
    trackEvent(
      compareDrawerOpenDossierAnalyticsEvent(),
      compareDrawerOpenDossierAnalyticsData(entry.category, entry.slug),
    );
  };

  const onOpenFullView = () => {
    trackEvent(
      compareDrawerFullViewAnalyticsEvent(),
      compareDrawerFullViewAnalyticsData(items.length),
    );
    setOpen(false);
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent side="bottom" className="h-[88vh] p-0">
        <SheetHeader className="border-b border-border px-4 py-3 sm:px-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <SheetTitle className="font-display text-base font-semibold text-ink">
              Comparing {items.length} {items.length === 1 ? "resource" : "resources"}
            </SheetTitle>
            <SheetDescription className="sr-only">
              Side-by-side comparison of the selected resources.
            </SheetDescription>
            {bannerTexts.length > 0 ? (
              <div className="w-full space-y-1">
                {bannerTexts.map((text) => (
                  <p key={text} className="text-xs text-amber-800">
                    {text}
                  </p>
                ))}
              </div>
            ) : null}
            {singleItemHint ? (
              <p className="w-full text-xs text-ink-muted">{singleItemHint}</p>
            ) : null}
            <div className="flex flex-wrap items-center gap-2">
              {items.length > 0 && (
                <div className="hidden items-center gap-1.5 sm:flex">
                  <span className="text-[11px] uppercase tracking-wider text-ink-subtle">
                    Snippet
                  </span>
                  <CopySegmented
                    variants={[
                      {
                        id: "install",
                        label: "Install",
                        value: items.find((e) => e.installCommand)?.installCommand,
                      },
                      {
                        id: "config",
                        label: "Config",
                        value: items.find((e) => e.configSnippet)?.configSnippet,
                      },
                      { id: "full", label: "Full", value: items.find((e) => e.fullCopy)?.fullCopy },
                    ]}
                    hideCopy
                    onVariantSelect={onSnippetVariantSelect}
                  />
                </div>
              )}
              {fullViewSearch ? (
                <Link
                  to="/compare"
                  search={fullViewSearch}
                  onClick={onOpenFullView}
                  className="inline-flex h-8 items-center gap-1 rounded-md border border-border bg-surface px-2.5 text-xs text-ink hover:bg-surface-2"
                >
                  Open full view <ArrowRight className="h-3 w-3" />
                </Link>
              ) : null}
              <CopyButton
                value={shareUrl}
                label="Copy compare link"
                disabled={items.length === 0}
                event={compareDrawerShareLinkCopyAnalyticsEvent()}
                eventData={compareDrawerShareLinkCopyAnalyticsData(items.length)}
              />
              <button
                type="button"
                onClick={onClear}
                className="text-xs text-ink-muted hover:text-ink"
              >
                Clear all
              </button>
            </div>
          </div>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex h-[60vh] items-center justify-center px-6 text-sm text-ink-muted">
            {emptyHint}
          </div>
        ) : (
          <div className="h-[calc(88vh-57px)] overflow-auto">
            <CompareDecisionBriefPanel state={decisionBrief} compact className="m-3" />
            <CompareScenarioRankingPanel
              state={scenarioRanking}
              selectedScenario={scenario}
              onSelectScenario={onScenarioSelect}
              compact
              className="mx-3"
            />
            <CompareEvidenceGapsPanel state={evidenceGaps} compact className="m-3 mt-0" />
            <CompareRolloutReadinessPanel
              state={rolloutReadiness}
              selectedPreset={rolloutPreset}
              onSelectPreset={onRolloutPresetSelect}
              compact
              className="m-3 mt-0"
            />
            <CompareOperationalFitHeatmapPanel
              state={operationalFitHeatmap}
              selectedPreset={fitPreset}
              onSelectPreset={onFitPresetSelect}
              compact
              className="m-3 mt-0"
            />
            <CompareDeploymentRiskMapPanel
              state={deploymentRiskMap}
              selectedPreset={riskPreset}
              onSelectPreset={onRiskPresetSelect}
              compact
              className="m-3 mt-0"
            />
            <CompareMitigationPriorityPanel
              state={mitigationPriority}
              selectedPreset={mitigationPreset}
              onSelectPreset={onMitigationPresetSelect}
              compact
              className="m-3 mt-0"
            />
            <div className="min-w-full">
              <table className="w-full border-collapse text-sm">
                <thead className="sticky top-0 z-10 bg-surface">
                  <tr>
                    <th
                      scope="col"
                      className="sticky left-0 z-20 w-[140px] border-b border-r border-border bg-surface p-3 text-left text-xs uppercase tracking-wider text-ink-subtle"
                    >
                      Field
                    </th>
                    {items.map((e) => (
                      <th
                        scope="col"
                        key={`${e.category}/${e.slug}`}
                        className="min-w-[260px] max-w-[320px] border-b border-r border-border bg-surface p-3 text-left align-top last:border-r-0"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex min-w-0 items-start gap-2">
                            <EntryBrandMark entry={e} size="sm" className="mt-0.5" />
                            <Link
                              to="/entry/$category/$slug"
                              params={{ category: e.category, slug: e.slug }}
                              onClick={() => onOpenDossier(e)}
                              className="min-w-0 font-display text-sm font-semibold text-ink hover:underline"
                            >
                              {e.title}
                            </Link>
                          </div>
                          <button
                            type="button"
                            onClick={() => onRemove(e)}
                            aria-label={`Remove ${e.title}`}
                            className="rounded p-0.5 text-ink-subtle hover:text-ink"
                          >
                            <X className="h-3.5 w-3.5" />
                          </button>
                        </div>
                        <Link
                          to="/entry/$category/$slug"
                          params={{ category: e.category, slug: e.slug }}
                          onClick={() => onOpenDossier(e)}
                          className="mt-1 inline-flex items-center gap-1 text-[11px] text-ink-muted hover:text-ink"
                        >
                          Open dossier <ArrowRight className="h-3 w-3" />
                        </Link>
                      </th>
                    ))}
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
                        "sticky left-0 z-10 w-[140px] border-b border-r border-border bg-inherit p-3 text-left align-top text-xs font-medium text-ink-muted",
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
                          "min-w-[260px] max-w-[320px] border-b border-r border-border p-3 align-top last:border-r-0",
                          actionRowDiverges && "bg-amber-500/5",
                        )}
                      >
                        <DrawerCompareActions entry={e} actionCells={actionCells} />
                      </td>
                    ))}
                  </tr>
                  {ROWS.map((row, i) => {
                    const rowDiverges = divergingDecisionLabels.has(row.label);
                    return (
                      <tr
                        key={row.label}
                        className={cn(
                          i % 2 === 0 && "bg-surface-2/30",
                          rowDiverges && "bg-amber-500/5",
                        )}
                      >
                        <th
                          scope="row"
                          className={cn(
                            "sticky left-0 z-10 w-[140px] border-b border-r border-border bg-inherit p-3 text-left align-top text-xs font-medium text-ink-muted",
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
                              "min-w-[260px] max-w-[320px] border-b border-r border-border p-3 align-top last:border-r-0",
                              rowDiverges && "bg-amber-500/5",
                            )}
                          >
                            {row.render(e)}
                          </td>
                        ))}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
