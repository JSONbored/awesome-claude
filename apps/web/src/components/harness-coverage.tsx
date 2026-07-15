import { Link } from "@tanstack/react-router";
import { HARNESSES } from "@/types/registry";
import { ENTRIES } from "@/data/entries";
import { platformMark, IntegrationMark } from "@/components/integration-marks";
import { cn } from "@/lib/utils";

// An entry "covers" a harness when it lists the harness in `harness[]` OR in its
// `platforms[]` (matches how Browse filters). Precomputed once at module load —
// registry data is static, so this no longer runs a full ENTRIES.filter per
// harness on every SSR render of /ecosystem.
const HARNESS_COVERAGE: Record<string, { count: number; pct: number }> = Object.fromEntries(
  HARNESSES.map((h) => {
    const matches = ENTRIES.filter(
      (e) => e.harness?.includes(h.id) || e.platforms.includes(h.id),
    ).length;
    return [
      h.id,
      { count: matches, pct: ENTRIES.length ? Math.round((matches / ENTRIES.length) * 100) : 0 },
    ];
  }),
);

export function HarnessCoverage({
  onBrowseClick,
}: {
  onBrowseClick?: (
    platformId: string,
    entryCount: number,
    coveragePct: number,
    rowIndex: number,
    harnessCount: number,
  ) => void;
}) {
  return (
    <div className="grid gap-px overflow-hidden rounded-xl border border-border bg-border sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {HARNESSES.map((h, rowIndex) => {
        const { count, pct } = HARNESS_COVERAGE[h.id];
        const mark = platformMark(h.id);
        return (
          <Link
            key={h.id}
            to="/browse"
            search={{ platform: h.id }}
            onClick={() => onBrowseClick?.(h.id, count, pct, rowIndex, HARNESSES.length)}
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
                  <div className="truncate font-display text-sm font-semibold text-ink">
                    {h.label}
                  </div>
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
              <span className="text-[10px] uppercase tracking-wider text-ink-subtle">
                Current registry snapshot
              </span>
              <span className="font-mono text-[11px] text-ink-muted">
                {count}/{ENTRIES.length}
              </span>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
