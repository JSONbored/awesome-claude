import * as React from "react";
import { GitCompare, X, ArrowRight, Shield, Lock, Package } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { useCompare } from "@/lib/compare";
import { comparisonTrayChipSignals, comparisonTrayUiState } from "@/lib/comparison-tray-ui";
import {
  comparisonTrayFullCompareAnalyticsData,
  comparisonTrayQuickCompareAnalyticsData,
} from "@/lib/entry-detail-cta-events";
import { trackEvent } from "@/lib/analytics";
import { TrustBadge, SourceBadge, ReadinessDot } from "./badges";
import { cn } from "@/lib/utils";
import type { Entry } from "@/types/registry";

function TrayChip({ entry, onRemove }: { entry: Entry; onRemove: () => void }) {
  const signals = comparisonTrayChipSignals(entry);

  return (
    <span className="inline-flex shrink-0 items-center gap-1.5 rounded-md border border-border bg-background px-2 py-1 text-xs">
      <ReadinessDot entry={entry} />
      <span className="max-w-[9rem] truncate font-medium text-ink sm:max-w-[12rem]">
        {entry.title}
      </span>
      <TrustBadge level={entry.trust} />
      <SourceBadge status={entry.source} className="hidden sm:inline-flex" />
      <span className="inline-flex items-center gap-0.5 text-ink-subtle" aria-hidden>
        <Shield
          className={cn("h-3 w-3", signals.hasSafetyNotes ? "text-trust-trusted" : "opacity-40")}
        />
        <Lock
          className={cn("h-3 w-3", signals.hasPrivacyNotes ? "text-trust-trusted" : "opacity-40")}
        />
        {signals.installable ? <Package className="h-3 w-3 text-ink-muted" /> : null}
      </span>
      <button
        type="button"
        onClick={onRemove}
        className="text-ink-subtle hover:text-ink"
        aria-label={`Remove ${entry.title} from compare`}
      >
        <X className="h-3 w-3" />
      </button>
    </span>
  );
}

export function ComparisonTray() {
  const { items, toggle, clear, open, setOpen } = useCompare();
  const tray = React.useMemo(() => comparisonTrayUiState(items), [items]);

  if (items.length === 0) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-surface/95 backdrop-blur">
      <div className="mx-auto max-w-page px-4 py-3 sm:px-6">
        {tray.primaryHint ? (
          <p className="mb-2 line-clamp-2 text-[11px] text-amber-800 sm:line-clamp-1">
            {tray.primaryHint}
          </p>
        ) : null}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-sm font-medium text-ink">
            <GitCompare className="h-4 w-4" />
            Compare
            <span className="rounded bg-ink px-1.5 py-0.5 font-mono text-[10px] text-background">
              {tray.count}/{tray.maxCount}
            </span>
          </div>
          <div className="flex min-w-0 flex-1 items-center gap-2 overflow-x-auto">
            {items.map((entry) => (
              <TrayChip
                key={`${entry.category}/${entry.slug}`}
                entry={entry}
                onRemove={() => toggle(entry)}
              />
            ))}
          </div>
          <button
            type="button"
            onClick={clear}
            className="hidden text-xs text-ink-muted hover:text-ink sm:inline"
          >
            Clear
          </button>
          {tray.canQuickCompare ? (
            <button
              type="button"
              onClick={() => {
                trackEvent("compare_tray_quick_compare", {
                  ...comparisonTrayQuickCompareAnalyticsData(tray.count),
                });
                setOpen(true);
              }}
              className="inline-flex h-8 items-center gap-1 rounded-md border border-border bg-background px-3 text-xs font-medium text-ink hover:bg-surface-2"
            >
              Quick compare
            </button>
          ) : null}
          {tray.canOpenFullCompare ? (
            <Link
              to="/compare"
              search={{ ids: tray.compareIds }}
              onClick={() => {
                trackEvent("compare_tray_full_compare", {
                  ...comparisonTrayFullCompareAnalyticsData(tray.count),
                });
                setOpen(false);
              }}
              className="inline-flex h-8 items-center gap-1 rounded-md bg-accent px-3 text-xs font-semibold text-accent-ink hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink/40"
            >
              Full compare <ArrowRight className="h-3 w-3" />
            </Link>
          ) : (
            <button
              type="button"
              onClick={() => setOpen(true)}
              className="inline-flex h-8 items-center gap-1 rounded-md bg-accent px-3 text-xs font-semibold text-accent-ink hover:opacity-90"
            >
              View selection
            </button>
          )}
          <span className="sr-only" aria-hidden>
            {open ? "open" : "closed"}
          </span>
        </div>
      </div>
    </div>
  );
}
