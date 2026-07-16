import * as React from "react";
import { Link } from "@tanstack/react-router";
import { BadgeCheck } from "lucide-react";

import { CountUp } from "@/components/count-up";
import { distBarWidths } from "@/lib/data-report-bars-lib";
import { cn } from "@/lib/utils";

/** Browse filter search used by distribution drill-downs. */
export type DistBrowseSearch = {
  category?: string;
  trust?: string;
  source?: string;
};

/** In-app destination for a clickable distribution row. */
export type DistRowDrilldown =
  | { kind: "browse"; search: DistBrowseSearch }
  | { kind: "tag"; tag: string }
  | { kind: "category"; category: string };

/** A single labelled distribution row: a count and its share of the relevant total. */
export interface DistRow {
  label: string;
  count: number;
  pct: number;
  /** Stable privacy-light key for analytics (enum/slug — not display copy). */
  rowKey?: string;
  /** Optional in-app drill-down destination. */
  drilldown?: DistRowDrilldown;
}

/** Round `n/total` to a whole-number percentage (0 when total is 0). */
export function pctOf(n: number, total: number) {
  return total ? Math.round((n / total) * 100) : 0;
}

/** Headline metric tile used in a data report's stat grid. */
export function DataStat({
  icon: Icon,
  label,
  value,
  hint,
  to,
  search,
  onNavigate,
}: {
  icon: React.ElementType;
  label: string;
  value: number;
  hint: string;
  to?: "/browse" | "/quality";
  search?: DistBrowseSearch;
  onNavigate?: () => void;
}) {
  const body = (
    <>
      <div className="flex items-center justify-between">
        <Icon className="h-4 w-4 text-ink-muted" />
        <BadgeCheck className="h-3.5 w-3.5 text-ink-subtle" aria-hidden />
      </div>
      <div className="mt-3 font-display text-3xl font-semibold tabular-nums text-ink">
        <CountUp value={value} />
      </div>
      <div className="mt-1 flex items-end justify-between gap-2">
        <div className="text-xs text-ink-muted">{label}</div>
        <span className="font-mono text-[11px] text-ink-subtle">{hint}</span>
      </div>
    </>
  );

  if (to) {
    return (
      <Link
        to={to}
        search={to === "/browse" ? search : undefined}
        onClick={onNavigate}
        className="block bg-surface p-5 transition-colors duration-200 ease-out hover:bg-surface-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-accent/60"
      >
        {body}
      </Link>
    );
  }

  return <div className="bg-surface p-5">{body}</div>;
}

/** A titled section with help text and arbitrary content (usually a DistTable). */
export function DataSection({
  title,
  help,
  children,
}: {
  title: string;
  help: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mt-12">
      <h2 className="h-display-2 text-ink text-balance">{title}</h2>
      <p className="mt-2 max-w-2xl text-sm text-ink-muted">{help}</p>
      <div className="mt-4">{children}</div>
    </section>
  );
}

function DistRowShell({
  row,
  className,
  onActivate,
  children,
}: {
  row: DistRow;
  className: string;
  onActivate?: () => void;
  children: React.ReactNode;
}) {
  if (!row.drilldown) {
    return <div className={className}>{children}</div>;
  }

  if (row.drilldown.kind === "browse") {
    return (
      <Link
        to="/browse"
        search={row.drilldown.search}
        onClick={onActivate}
        className={cn(
          className,
          "hover:bg-surface-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-accent/60",
        )}
      >
        {children}
      </Link>
    );
  }

  if (row.drilldown.kind === "tag") {
    return (
      <Link
        to="/tags/$tag"
        params={{ tag: row.drilldown.tag }}
        onClick={onActivate}
        className={cn(
          className,
          "hover:bg-surface-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-accent/60",
        )}
      >
        {children}
      </Link>
    );
  }

  return (
    <Link
      to="/$category"
      params={{ category: row.drilldown.category }}
      onClick={onActivate}
      className={cn(
        className,
        "hover:bg-surface-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-accent/60",
      )}
    >
      {children}
    </Link>
  );
}

/** Horizontal-bar distribution table; bars are scaled to the largest row. */
export function DistTable({
  rows,
  onRowClick,
}: {
  rows: DistRow[];
  onRowClick?: (row: DistRow, index: number) => void;
}) {
  const widths = distBarWidths(rows);
  return (
    <div className="overflow-hidden rounded-xl border border-border bg-surface">
      {rows.map((row, i) => (
        <DistRowShell
          key={row.rowKey ?? row.label}
          row={row}
          className="grid grid-cols-[160px_1fr_56px_56px] items-center gap-4 border-b border-border px-5 py-3 last:border-0"
          onActivate={
            onRowClick
              ? () => {
                  onRowClick(row, i);
                }
              : undefined
          }
        >
          <div className="font-display text-sm font-semibold text-ink">{row.label}</div>
          <div className="h-2 overflow-hidden rounded-full bg-surface-2">
            <div className="h-full bg-ink" style={{ width: `${widths[i]}%` }} />
          </div>
          <div className="text-right font-mono text-xs tabular-nums text-ink">{row.count}</div>
          <div className="text-right font-mono text-xs tabular-nums text-ink-subtle">
            {row.pct}%
          </div>
        </DistRowShell>
      ))}
    </div>
  );
}
