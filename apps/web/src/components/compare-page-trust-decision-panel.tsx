import { Link } from "@tanstack/react-router";
import { Shield, Lock, BadgeCheck, Package, AlertTriangle } from "lucide-react";
import type { ComparePageTrustDecisionUiState } from "@/lib/compare-page-trust-decision";
import type { ComparePageActionCell } from "@/lib/compare-page-actions-ui-lib";
import { comparePageActionsForEntry } from "@/lib/compare-page-actions-interactive-ui-lib";
import { COMPARE_PAGE_SURFACE } from "@/lib/compare-page-summary";
import type { CompareAction } from "@/lib/compare-entry-actions";
import { CopyButton } from "@/components/copy-button";
import { TrustBadge, SourceBadge } from "@/components/badges";
import { recordCompareIntentEvent } from "@/lib/compare-entry-actions";
import { trackEvent, entryEventKey } from "@/lib/analytics";
import { cn } from "@/lib/utils";
import type { Entry } from "@/types/registry";

function ComparePanelActionButton({ entry, action }: { entry: Entry; action: CompareAction }) {
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
            if (action.analyticsEvent) {
              trackEvent(action.analyticsEvent, { entry: eventKey, surface: COMPARE_PAGE_SURFACE });
            }
          }}
          className="inline-flex h-7 items-center rounded-md border border-border bg-surface px-2 text-xs font-medium text-ink hover:bg-surface-2"
        >
          {action.label}
        </Link>
      );
    }

    if (action.href && action.external) {
      return (
        <a
          href={action.href}
          target="_blank"
          rel="noreferrer"
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

export function ComparePageTrustDecisionPanel({
  state,
  entries,
  actionCells,
  variant = "page",
  className,
}: {
  state: Extract<ComparePageTrustDecisionUiState, { showPanel: true }>;
  entries: Entry[];
  actionCells: ComparePageActionCell[];
  variant?: "page" | "compact";
  className?: string;
}) {
  const compact = variant === "compact";
  const entryByKey = new Map(entries.map((entry) => [`${entry.category}/${entry.slug}`, entry]));

  return (
    <section
      aria-label="Compare trust decision summary"
      className={cn(
        "rounded-xl border border-border bg-surface/80",
        compact ? "px-3 py-3" : "px-4 py-4 sm:px-5",
        className,
      )}
    >
      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <div className="eyebrow">Trust decision</div>
          {state.headline ? (
            <p className={cn("mt-1 text-ink", compact ? "text-sm" : "text-base")}>
              {state.headline}
            </p>
          ) : (
            <p className="mt-1 text-sm text-ink-muted">
              Review trust signals side by side before you install or copy anything.
            </p>
          )}
          {state.primaryHint ? (
            <p className="mt-1 text-xs text-ink-muted">{state.primaryHint}</p>
          ) : null}
        </div>
        {state.sharedActionIds.length > 0 ? (
          <div className="text-xs text-ink-muted">
            Shared actions:{" "}
            <span className="font-medium text-ink">{state.sharedActionIds.join(", ")}</span>
          </div>
        ) : null}
      </div>

      <div
        className={cn(
          "mt-4 grid gap-3",
          compact ? "sm:grid-cols-2" : "md:grid-cols-2 xl:grid-cols-4",
        )}
      >
        {state.entrySnapshots.map((snapshot) => {
          const entry = entryByKey.get(snapshot.entryKey);
          if (!entry) return null;
          const actions = comparePageActionsForEntry(entry, actionCells).slice(0, 2);
          const isSafest = snapshot.entryKey === state.safestEntryKey;

          return (
            <article
              key={snapshot.entryKey}
              className={cn(
                "rounded-lg border bg-background p-3",
                isSafest ? "border-accent/50 ring-1 ring-accent/20" : "border-border",
              )}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <Link
                    to="/entry/$category/$slug"
                    params={{ category: snapshot.category, slug: snapshot.slug }}
                    className="line-clamp-2 font-display text-sm font-semibold text-ink hover:underline"
                  >
                    {snapshot.title}
                  </Link>
                  <div className="mt-2 flex flex-wrap items-center gap-1.5">
                    <TrustBadge level={snapshot.trust} />
                    <SourceBadge status={snapshot.sourceBacked ? "source-backed" : "unverified"} />
                  </div>
                </div>
                {isSafest ? (
                  <span className="shrink-0 rounded-full bg-accent/10 px-2 py-0.5 text-[10px] font-medium text-ink">
                    Strongest
                  </span>
                ) : null}
              </div>

              <ul className="mt-3 space-y-1 text-[11px] text-ink-muted">
                <li className="inline-flex items-center gap-1.5">
                  <Shield
                    className={cn(
                      "h-3 w-3",
                      snapshot.hasSafetyNotes ? "text-trust-trusted" : "opacity-40",
                    )}
                    aria-hidden
                  />
                  {snapshot.hasSafetyNotes ? "Safety notes" : "No safety notes"}
                </li>
                <li className="inline-flex items-center gap-1.5">
                  <Lock
                    className={cn(
                      "h-3 w-3",
                      snapshot.hasPrivacyNotes ? "text-trust-trusted" : "opacity-40",
                    )}
                    aria-hidden
                  />
                  {snapshot.hasPrivacyNotes ? "Privacy notes" : "No privacy notes"}
                </li>
                <li className="inline-flex items-center gap-1.5">
                  <BadgeCheck
                    className={cn(
                      "h-3 w-3",
                      snapshot.reviewed ? "text-trust-trusted" : "opacity-40",
                    )}
                    aria-hidden
                  />
                  {snapshot.reviewed ? "Reviewed" : "Not reviewed"}
                </li>
                <li className="inline-flex items-center gap-1.5">
                  <Package
                    className={cn(
                      "h-3 w-3",
                      snapshot.installable ? "text-ink-muted" : "opacity-40",
                    )}
                    aria-hidden
                  />
                  {snapshot.installable ? "Install command" : "Manual setup"}
                </li>
              </ul>

              {snapshot.caution ? (
                <p className="mt-2 inline-flex items-start gap-1 text-[11px] text-amber-800">
                  <AlertTriangle className="mt-0.5 h-3 w-3 shrink-0" aria-hidden />
                  {snapshot.caution}
                </p>
              ) : null}

              <p className="mt-2 text-[11px] text-ink-muted">{snapshot.recommendedAction}</p>

              <div className="mt-3 flex flex-wrap gap-1.5">
                {actions.map((action) => (
                  <ComparePanelActionButton key={action.id} entry={entry} action={action} />
                ))}
              </div>
            </article>
          );
        })}
      </div>

      {state.divergingRows.length > 0 ? (
        <div className="mt-4 overflow-auto rounded-lg border border-border">
          <table className="min-w-full text-left text-xs">
            <thead className="bg-surface-2/60 text-ink-subtle">
              <tr>
                <th className="px-3 py-2 font-medium">Signal</th>
                {state.entrySnapshots.map((snapshot) => (
                  <th key={snapshot.entryKey} className="px-3 py-2 font-medium">
                    {snapshot.title}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {state.divergingRows.map((row) => (
                <tr key={row.label} className="border-t border-border">
                  <th scope="row" className="px-3 py-2 font-medium text-ink-muted">
                    {row.label}
                  </th>
                  {row.cells.map((cell) => (
                    <td key={cell.entryKey} className={cn("px-3 py-2", cell.toneClass)}>
                      {cell.label}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}
    </section>
  );
}
