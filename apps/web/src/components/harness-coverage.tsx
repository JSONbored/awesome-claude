import { Link } from "@tanstack/react-router";
import { HARNESSES, type Harness } from "@/types/registry";
import { ENTRIES } from "@/mocks/entries";
import { Sparkline } from "@/components/sparkline";
import { platformMark, IntegrationMark } from "@/components/integration-marks";
import { cn } from "@/lib/utils";

/**
 * Deterministic faux 14-build trend per harness, seeded by count, so the
 * sparkline is stable across renders without needing a backing time series.
 */
function trend(seed: number, target: number): number[] {
  const out: number[] = [];
  let v = Math.max(0, target - 6);
  for (let i = 0; i < 14; i++) {
    v += ((seed * (i + 1)) % 5) - 1;
    if (v < 0) v = 0;
    if (i === 13) v = target;
    out.push(v);
  }
  return out;
}

function coverageFor(h: Harness) {
  // An entry "covers" a harness when it lists the harness in `harness[]`
  // OR in its `platforms[]`. This matches how Browse filters.
  const matches = ENTRIES.filter(
    (e) => e.harness?.includes(h) || e.platforms.includes(h),
  ).length;
  const pct = ENTRIES.length ? Math.round((matches / ENTRIES.length) * 100) : 0;
  return { count: matches, pct };
}

export function HarnessCoverage() {
  return (
    <div className="grid gap-px overflow-hidden rounded-xl border border-border bg-border sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {HARNESSES.map((h, i) => {
        const { count, pct } = coverageFor(h.id);
        const mark = platformMark(h.id);
        return (
          <Link
            key={h.id}
            to="/browse"
            search={{ platform: h.id }}
            className="group flex flex-col gap-3 bg-surface p-4 transition-colors duration-200 ease-out hover:bg-surface-2"
            aria-label={`Browse ${count} entries compatible with ${h.label}`}
          >
            <div className="flex items-center justify-between gap-2">
              <div className="flex min-w-0 items-center gap-2">
                {mark ? (
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md border border-border bg-surface-2 text-ink">
                    <IntegrationMark name={mark} size={14} />
                  </span>
                ) : (
                  <span className="h-7 w-7 shrink-0 rounded-md border border-border bg-surface-2" />
                )}
                <div className="min-w-0">
                  <div className="truncate font-display text-sm font-semibold text-ink">{h.label}</div>
                  <div className="font-mono text-[10px] text-ink-subtle">{count} entries</div>
                </div>
              </div>
              <span className="shrink-0 font-mono text-xs tabular-nums text-ink-muted">{pct}%</span>
            </div>

            <div className="h-1.5 overflow-hidden rounded-full bg-surface-2">
              <div
                className={cn("h-full bg-ink transition-all", pct === 0 && "bg-ink-subtle/30")}
                style={{ width: `${Math.max(pct, 2)}%` }}
              />
            </div>

            <div className="flex items-end justify-between gap-2">
              <span className="text-[10px] uppercase tracking-wider text-ink-subtle">14-build trend</span>
              <Sparkline
                data={trend((i + 1) * 7, count)}
                width={72}
                height={18}
                ariaLabel={`${h.label} coverage trend`}
                strokeClassName="stroke-accent"
                fillClassName="fill-accent/15"
              />
            </div>
          </Link>
        );
      })}
    </div>
  );
}
