import * as React from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import {
  CategoryPill,
  PlatformChip,
  InstallRiskBadge,
  NotesPresenceChips,
} from "@/components/badges";
import { TrustDrilldown } from "@/components/trust-drilldown";
import { CopyButton } from "@/components/copy-button";
import { SourceCitations } from "@/components/source-citations";
import { formatCompact } from "@/lib/format";
import { brandIdentityLabel } from "@/lib/brand-icons";
import {
  comparisonDecisionRows,
  displayCompareSignal,
  signalToneClassForDisplay,
} from "@/lib/compare-table-signals-ui-lib";
import { COMPARE_TABLE_SURFACE, type CompareAction } from "@/lib/compare-table-actions-ui-lib";
import { compareTableActionsForEntry } from "@/lib/compare-table-actions-interactive-ui-lib";
import { compareTableInteractiveUiState } from "@/lib/compare-table-interactive-ui-lib";
import { recordCompareIntentEvent } from "@/lib/compare-entry-actions";
import { trackEvent, entryEventKey } from "@/lib/analytics";
import { claimCtaAnalyticsData, claimCtaAnalyticsEvent } from "@/lib/conversion-cta-events";
import { cn } from "@/lib/utils";
import type { Entry } from "@/types/registry";
import { EntryBrandMark } from "./entry-brand-mark";

export interface RowDef {
  label: string;
  render: (e: Entry) => React.ReactNode;
  diverges?: (entries: Entry[]) => boolean;
}

function CompareSignalCell({
  entry,
  resolve,
}: {
  entry: Entry;
  resolve: (entry: Entry) => ReturnType<typeof displayCompareSignal> | undefined;
}) {
  const raw = resolve(entry);
  if (!raw) return <span className="text-xs text-ink-subtle">—</span>;
  const value = displayCompareSignal(raw);
  return (
    <span className={cn("inline-flex flex-col gap-0.5 text-xs", signalToneClassForDisplay(raw))}>
      <span>{value.label}</span>
      {value.detail ? <span className="text-ink-muted">{value.detail}</span> : null}
    </span>
  );
}

function TableCompareActions({
  entry,
  actionCells,
}: {
  entry: Entry;
  actionCells: ReturnType<typeof compareTableInteractiveUiState>["actionCells"];
}) {
  const actions = compareTableActionsForEntry(entry, actionCells);

  return (
    <div className="flex flex-wrap gap-1.5">
      {actions.map((action) => (
        <TableActionButton key={action.id} entry={entry} action={action} />
      ))}
    </div>
  );
}

function TableActionButton({ entry, action }: { entry: Entry; action: CompareAction }) {
  const eventKey = entryEventKey(entry.category, entry.slug);

  if (action.kind === "copy" && action.copyValue) {
    return (
      <CopyButton
        value={action.copyValue}
        label={action.label}
        event={action.analyticsEvent}
        eventData={{ entry: eventKey, surface: COMPARE_TABLE_SURFACE }}
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
                surface: COMPARE_TABLE_SURFACE,
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
              claimCtaAnalyticsData("compare-table", entry.category, entry.slug),
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
                surface: COMPARE_TABLE_SURFACE,
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

const DECISION_COMPARISON_ROWS: RowDef[] = comparisonDecisionRows().map((row) => ({
  label: row.label,
  render: (entry) => <CompareSignalCell entry={entry} resolve={row.resolve} />,
  diverges: row.diverges,
}));

/** Shared comparison field definitions — used by the interactive /compare page and curated pages. */
export const COMPARISON_ROWS: RowDef[] = [
  { label: "Trust", render: (e) => <TrustDrilldown entry={e} /> },
  ...DECISION_COMPARISON_ROWS,
  { label: "Install risk", render: (e) => <InstallRiskBadge entry={e} /> },
  { label: "Notes", render: (e) => <NotesPresenceChips entry={e} /> },
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
  { label: "Category", render: (e) => <CategoryPill>{e.category}</CategoryPill> },
  {
    label: "Source",
    render: (e) => <span className="text-sm capitalize text-ink">{e.source}</span>,
  },
  { label: "Author", render: (e) => <span className="text-sm text-ink">{e.author}</span> },
  {
    label: "Added",
    render: (e) => <span className="font-mono text-xs text-ink-muted">{e.dateAdded}</span>,
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
    label: "Source repo",
    render: (e) => (
      <span className="font-mono text-sm tabular-nums text-ink">
        {e.repoStats?.stars !== undefined ? `${formatCompact(e.repoStats.stars)} repo stars` : "—"}
      </span>
    ),
  },
  {
    label: "Safety notes",
    render: (e) =>
      e.safetyNotes ? (
        <span className="text-xs text-ink">
          <span className="mr-1 text-trust-trusted">✓</span>
          <span className="line-clamp-3">{e.safetyNotes}</span>
        </span>
      ) : (
        <span className="text-xs text-ink-subtle">— missing</span>
      ),
  },
  {
    label: "Privacy notes",
    render: (e) =>
      e.privacyNotes ? (
        <span className="text-xs text-ink">
          <span className="mr-1 text-trust-trusted">✓</span>
          <span className="line-clamp-3">{e.privacyNotes}</span>
        </span>
      ) : (
        <span className="text-xs text-ink-subtle">— missing</span>
      ),
  },
  {
    label: "Prerequisites",
    render: (e) =>
      e.prerequisites && e.prerequisites.length > 0 ? (
        <ul className="list-disc space-y-0.5 pl-4 text-xs text-ink-muted">
          {e.prerequisites.slice(0, 4).map((p) => (
            <li key={p}>{p}</li>
          ))}
        </ul>
      ) : (
        <span className="text-xs text-ink-subtle">— none listed</span>
      ),
  },
  {
    label: "Install",
    render: (e) =>
      e.installCommand ? (
        <div className="space-y-1.5">
          <pre className="max-h-24 overflow-auto rounded-md bg-background p-2 font-mono text-[11px] text-ink">
            <code>{e.installCommand}</code>
          </pre>
          <CopyButton value={e.installCommand} label="Copy install" />
        </div>
      ) : (
        <span className="text-xs text-ink-subtle">—</span>
      ),
  },
  {
    label: "Config",
    render: (e) =>
      e.configSnippet ? (
        <div className="space-y-1.5">
          <pre className="max-h-24 overflow-auto rounded-md bg-background p-2 font-mono text-[11px] text-ink">
            <code>{e.configSnippet}</code>
          </pre>
          <CopyButton value={e.configSnippet} label="Copy config" />
        </div>
      ) : (
        <span className="text-xs text-ink-subtle">—</span>
      ),
  },
  {
    label: "Citations",
    render: (e) => (
      <div className="text-xs">
        <SourceCitations entry={e} />
      </div>
    ),
  },
  {
    label: "Claim",
    render: (e) => (
      <span className="text-xs text-ink-muted">{e.claimed ? "Claimed" : "Unclaimed"}</span>
    ),
  },
];

/** Static side-by-side comparison table (no add/remove controls) for curated comparison pages. */
export function ComparisonTable({
  entries,
  showNextActions = false,
}: {
  entries: Entry[];
  showNextActions?: boolean;
}) {
  const { divergingDecisionLabels, renderNextActions, actionRowDiverges, actionCells } =
    compareTableInteractiveUiState(entries, showNextActions);

  return (
    <div className="overflow-auto rounded-xl border border-border">
      <table className="w-full border-collapse text-sm">
        <thead className="bg-surface">
          <tr>
            <th
              scope="col"
              className="sticky left-0 z-10 w-[150px] border-b border-r border-border bg-surface p-3 text-left text-xs uppercase tracking-wider text-ink-subtle"
            >
              Field
            </th>
            {entries.map((e) => (
              <th
                scope="col"
                key={`${e.category}/${e.slug}`}
                className="min-w-[260px] max-w-[320px] border-b border-r border-border bg-surface p-3 text-left align-top"
              >
                <div className="flex min-w-0 items-start gap-2">
                  <EntryBrandMark entry={e} size="sm" className="mt-0.5" />
                  <Link
                    to="/entry/$category/$slug"
                    params={{ category: e.category, slug: e.slug }}
                    className="min-w-0 font-display text-sm font-semibold text-ink hover:underline"
                  >
                    {e.title}
                  </Link>
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
          </tr>
        </thead>
        <tbody>
          {renderNextActions ? (
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
              {entries.map((e) => (
                <td
                  key={`actions-${e.category}/${e.slug}`}
                  className={cn(
                    "min-w-[260px] max-w-[320px] border-b border-r border-border p-3 align-top",
                    actionRowDiverges && "bg-amber-500/5",
                  )}
                >
                  <TableCompareActions entry={e} actionCells={actionCells} />
                </td>
              ))}
            </tr>
          ) : null}
          {COMPARISON_ROWS.map((row, i) => {
            const rowDiverges = divergingDecisionLabels.has(row.label);
            return (
              <tr
                key={row.label}
                className={cn(i % 2 === 0 && "bg-surface-2/30", rowDiverges && "bg-amber-500/5")}
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
                {entries.map((e) => (
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
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
