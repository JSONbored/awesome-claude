import * as React from "react";
import { BadgeCheck } from "lucide-react";

import { CountUp } from "@/components/count-up";

/** A single labelled distribution row: a count and its share of the relevant total. */
export interface DistRow {
  label: string;
  count: number;
  pct: number;
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
}: {
  icon: React.ElementType;
  label: string;
  value: number;
  hint: string;
}) {
  return (
    <div className="bg-surface p-5">
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
    </div>
  );
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

/** Horizontal-bar distribution table; bars are scaled to the largest row. */
export function DistTable({ rows }: { rows: DistRow[] }) {
  const max = rows.reduce((m, r) => Math.max(m, r.count), 0);
  return (
    <div className="overflow-hidden rounded-xl border border-border bg-surface">
      {rows.map((row) => (
        <div
          key={row.label}
          className="grid grid-cols-[160px_1fr_56px_56px] items-center gap-4 border-b border-border px-5 py-3 last:border-0"
        >
          <div className="font-display text-sm font-semibold text-ink">{row.label}</div>
          <div className="h-2 overflow-hidden rounded-full bg-surface-2">
            <div
              className="h-full bg-ink"
              style={{ width: `${max ? Math.round((row.count / max) * 100) : 0}%` }}
            />
          </div>
          <div className="text-right font-mono text-xs tabular-nums text-ink">{row.count}</div>
          <div className="text-right font-mono text-xs tabular-nums text-ink-subtle">
            {row.pct}%
          </div>
        </div>
      ))}
    </div>
  );
}
