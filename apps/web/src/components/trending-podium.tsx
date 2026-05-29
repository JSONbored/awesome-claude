import * as React from "react";
import { Link } from "@tanstack/react-router";
import { Star, ArrowUpRight, TrendingUp } from "lucide-react";
import { CategoryPill, TrustBadge, SourceBadge } from "@/components/badges";
import { formatCompact } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { Entry } from "@/types/registry";

type TrendingEntry = Entry & {
  trendingScore?: number;
  trendingReasons?: string[];
};

const RANK_STYLES = [
  { ring: "ring-2 ring-trust-trusted/50", chip: "bg-trust-trusted text-background", label: "01" },
  { ring: "ring-1 ring-accent/40", chip: "bg-accent text-ink", label: "02" },
  { ring: "ring-1 ring-trust-limited/40", chip: "bg-trust-limited text-background", label: "03" },
];

export function TrendingPodium({ entries }: { entries: TrendingEntry[] }) {
  const top = entries.slice(0, 3);
  if (top.length === 0) return null;

  return (
    <div className="mt-8 grid gap-3 stagger-children sm:grid-cols-3">
      {top.map((e, i) => {
        const style = RANK_STYLES[i] ?? RANK_STYLES[2];
        const isFirst = i === 0;
        return (
          <div
            key={`${e.category}/${e.slug}`}
            className={cn(
              "group hover-lift surface-raised relative flex flex-col overflow-hidden rounded-xl border border-border bg-surface p-4 transition-colors duration-200 ease-out hover:bg-surface-2",
              style.ring,
            )}
          >
            {isFirst && (
              <span
                aria-hidden
                className="pointer-events-none absolute -inset-x-8 -top-24 h-40 rounded-full bg-accent/15 blur-3xl"
              />
            )}
            <div className="flex items-start justify-between gap-2">
              <span
                className={cn(
                  "inline-flex h-6 items-center rounded-md px-2 font-mono text-[11px] font-semibold",
                  style.chip,
                )}
              >
                #{style.label}
              </span>
              <div className="inline-flex items-center gap-1 font-mono text-xs text-trust-trusted tabular-nums">
                <TrendingUp className="h-3 w-3" />
                {typeof e.trendingScore === "number" ? `+${e.trendingScore}` : "static"}
              </div>
            </div>

            <Link
              to="/entry/$category/$slug"
              params={{ category: e.category, slug: e.slug }}
              className="mt-3 min-w-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60 rounded-sm"
            >
              <div className="flex flex-wrap items-center gap-1.5">
                <CategoryPill>{e.category}</CategoryPill>
                <TrustBadge level={e.trust} />
                <SourceBadge status={e.source} />
              </div>
              <div className="mt-2 font-display text-lg font-semibold leading-snug text-ink group-hover:underline">
                {e.title}
              </div>
              <p className="mt-1 line-clamp-2 text-sm text-ink-muted">{e.description}</p>
            </Link>

            <div className="mt-3 flex items-end justify-between gap-3">
              <div className="min-w-0 text-[11px] text-ink-subtle">
                {(e.trendingReasons ?? ["source-backed ranking"]).slice(0, 2).join(" · ")}
              </div>
              <div className="flex flex-col items-end gap-0.5 font-mono text-[11px] text-ink-muted tabular-nums">
                {e.repoStats?.stars !== undefined && (
                  <div className="inline-flex items-center gap-1" title="Source repository stars">
                    <Star className="h-3 w-3" /> {formatCompact(e.repoStats.stars)}
                  </div>
                )}
                <div className="text-ink-subtle">
                  {e.source === "unverified" ? "unverified" : "source-backed"}
                </div>
              </div>
            </div>

            <Link
              to="/entry/$category/$slug"
              params={{ category: e.category, slug: e.slug }}
              className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-ink-muted hover:text-ink"
            >
              Inspect <ArrowUpRight className="h-3 w-3" />
            </Link>
          </div>
        );
      })}
    </div>
  );
}
