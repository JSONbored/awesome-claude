import * as React from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { z } from "zod";
import { zodValidator, fallback } from "@tanstack/zod-adapter";
import { Flame, TrendingUp, ArrowUpRight, ArrowRight, Rss, Star, Clock, Info } from "lucide-react";
import { search } from "@/mocks/search";
import { CategoryPill, SourceBadge, TrustBadge } from "@/components/badges";
import { CATEGORIES } from "@/types/registry";
import { BRIEF_ISSUES } from "@/mocks/entries";
import { formatCompact, timeAgo } from "@/lib/format";
import { cn } from "@/lib/utils";
import { Sparkline } from "@/components/sparkline";
import { TrendingPodium, sparklineFor } from "@/components/trending-podium";
import { ShareMenu } from "@/components/share-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const trendingSchema = z.object({
  window: fallback(z.enum(["7d", "30d", "all"]), "7d").default("7d"),
  category: fallback(z.string(), "").default(""),
});

export const Route = createFileRoute("/trending")({
  validateSearch: zodValidator(trendingSchema),
  head: () => ({
    meta: [
      { title: "Trending Claude workflows — HeyClaude" },
      {
        name: "description",
        content:
          "Trending Claude Code MCP servers, agents, skills, hooks, and commands this week.",
      },
    ],
  }),
  component: TrendingPage,
});

function MovementCell({ score, window }: { score: number; window: "7d" | "30d" | "all" }) {
  const icon =
    score > 20 ? (
      <TrendingUp className="h-3.5 w-3.5 text-trust-trusted" aria-label="Rising fast" />
    ) : score > 0 ? (
      <ArrowUpRight className="h-3.5 w-3.5 text-trust-trusted" aria-label="Rising" />
    ) : (
      <ArrowRight className="h-3.5 w-3.5 text-ink-subtle" aria-label="Steady" />
    );
  const delta = score > 0 ? `+${score}` : `${score}`;
  return (
    <TooltipProvider delayDuration={150}>
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            type="button"
            className="inline-flex items-center gap-1 font-mono text-sm text-trust-trusted tabular-nums focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60 rounded-sm"
            aria-label="Why is this trending?"
          >
            {icon}
            <span>{window === "all" ? "—" : delta}</span>
            <Info className="h-3 w-3 text-ink-subtle" />
          </button>
        </TooltipTrigger>
        <TooltipContent side="left" className="max-w-[220px] bg-ink text-background">
          <div className="space-y-1 text-[11px]">
            <div className="font-medium">Why is this trending?</div>
            <div className="opacity-80">Install velocity, upvote delta, and source-backed weight over the selected window.</div>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

function TrendingPage() {
  const sp = Route.useSearch();
  const navigate = Route.useNavigate();
  const latestBrief = BRIEF_ISSUES[0];

  const all =
    sp.window === "all"
      ? search({ sort: "popular" }).slice(0, 50)
      : search({ sort: "trending" }).filter((e) => (e.trending ?? 0) > 0);
  const rows = sp.category ? all.filter((e) => e.category === sp.category) : all;
  const podium = rows.slice(0, 3);
  const list = rows.slice(3);

  // Per-category counts for chip strip
  const countsByCategory = React.useMemo(() => {
    const m: Record<string, number> = {};
    for (const e of all) m[e.category] = (m[e.category] ?? 0) + 1;
    return m;
  }, [all]);

  // "Fell off" rail: deterministic small set from popular-but-not-trending
  const fellOff = React.useMemo(() => {
    const trendingSet = new Set(all.map((e) => `${e.category}/${e.slug}`));
    return search({ sort: "popular" })
      .filter((e) => !trendingSet.has(`${e.category}/${e.slug}`))
      .slice(0, 3);
  }, [all]);

  const set = (patch: Partial<typeof sp>) =>
    navigate({ search: (prev: typeof sp) => ({ ...prev, ...patch }) });

  const shareUrl = `/trending?window=${sp.window}${sp.category ? `&category=${sp.category}` : ""}`;
  const windowLabel =
    sp.window === "all" ? "all-time" : sp.window === "30d" ? "last 30 days" : "last 7 days";

  return (
    <div className="mx-auto max-w-[1280px] px-4 py-12 sm:px-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <Flame className="h-4 w-4 text-trust-limited" />
            <span className="eyebrow">Trending · {windowLabel}</span>
          </div>
          <h1 className="mt-2 h-display-1 text-ink text-balance">
            What developers are pinning
          </h1>
          <p className="mt-4 max-w-2xl text-pretty text-base text-ink-muted sm:text-lg">
            Ranked by install velocity, upvote movement, and source-backed signal.{" "}
            <span className="font-mono text-xs text-ink-subtle">
              {rows.length} resources · updated{" "}
              {timeAgo(new Date(Date.now() - 12 * 60_000).toISOString())}
            </span>
          </p>
          {latestBrief && (
            <Link
              to="/brief"
              className="mt-3 inline-flex items-center gap-2 text-sm text-ink-muted hover:text-ink"
            >
              Featured in Brief #{latestBrief.number} · {latestBrief.title} →
            </Link>
          )}
        </div>
        <div className="flex items-center gap-2">
          <ShareMenu
            url={shareUrl}
            title={`Trending Claude workflows · ${windowLabel}`}
            description="Live ranking of MCP servers, agents, skills, and commands."
          />
          <a
            href="/feeds/trending.xml"
            className="inline-flex h-8 items-center gap-1.5 rounded-md border border-border bg-surface px-3 text-xs font-medium text-ink-muted hover:bg-surface-2 hover:text-ink"
          >
            <Rss className="h-3.5 w-3.5" /> RSS
          </a>
        </div>
      </div>

      {/* Sticky toolbar */}
      <div className="sticky top-16 z-20 -mx-4 mt-8 border-y border-border bg-background/95 px-4 py-3 backdrop-blur sm:-mx-6 sm:px-6">
        <div className="flex flex-wrap items-center gap-3">
          <div
            className="inline-flex overflow-hidden rounded-md border border-border"
            role="radiogroup"
            aria-label="Time window"
          >
            {(["7d", "30d", "all"] as const).map((w) => (
              <button
                key={w}
                type="button"
                onClick={() => set({ window: w })}
                aria-pressed={sp.window === w}
                className={cn(
                  "px-2.5 py-1 text-xs font-medium transition-colors duration-200 ease-out motion-safe:active:scale-[0.97]",
                  sp.window === w
                    ? "bg-ink text-background"
                    : "bg-surface text-ink-muted hover:text-ink",
                )}
              >
                {w === "all" ? "All-time" : w}
              </button>
            ))}
          </div>
          <div className="ml-auto inline-flex items-center gap-1 font-mono text-[11px] text-ink-subtle">
            <Clock className="h-3 w-3" /> updated 12m ago
          </div>
        </div>

        {/* Category chip strip with counts */}
        <div className="relative mt-3 -mx-1">
          <div className="flex gap-1.5 overflow-x-auto px-1 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <button
              type="button"
              onClick={() => set({ category: "" })}
              aria-pressed={!sp.category}
              className={cn(
                "shrink-0 rounded-full border px-2.5 py-1 text-[11px] font-medium transition-colors duration-200 ease-out motion-safe:active:scale-[0.97]",
                !sp.category
                  ? "border-ink bg-ink text-background"
                  : "border-border bg-surface text-ink-muted hover:text-ink",
              )}
            >
              All · {all.length}
            </button>
            {CATEGORIES.map((c) => {
              const n = countsByCategory[c.id] ?? 0;
              const active = sp.category === c.id;
              return (
                <button
                  key={c.id}
                  type="button"
                  disabled={n === 0 && !active}
                  onClick={() => set({ category: active ? "" : c.id })}
                  aria-pressed={active}
                  className={cn(
                    "shrink-0 rounded-full border px-2.5 py-1 text-[11px] font-medium transition-colors duration-200 ease-out motion-safe:active:scale-[0.97]",
                    active
                      ? "border-ink bg-ink text-background"
                      : "border-border bg-surface text-ink-muted hover:text-ink",
                    n === 0 && !active && "opacity-40",
                  )}
                >
                  {c.label} <span className="text-ink-subtle">· {n}</span>
                </button>
              );
            })}
          </div>
          <div className="pointer-events-none absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-background to-transparent" />
        </div>
      </div>

      {/* Podium */}
      {podium.length > 0 && <TrendingPodium entries={podium} />}

      {rows.length === 0 ? (
        <div className="mt-12 flex flex-col items-center gap-3 rounded-lg border border-dashed border-border p-12 text-center">
          <div className="font-display text-lg font-semibold text-ink">
            No trending resources in this slice
          </div>
          <p className="max-w-sm text-sm text-ink-muted">
            Try a wider window or another category.
          </p>
          <button
            type="button"
            onClick={() => set({ window: "7d", category: "" })}
            className="mt-2 inline-flex h-8 items-center gap-1.5 rounded-md bg-ink px-3 text-xs font-medium text-background transition-transform hover:bg-ink/90 active:translate-y-px"
          >
            Reset filters
          </button>
        </div>
      ) : list.length > 0 ? (
        <ol className="mt-6 overflow-hidden rounded-xl border border-border bg-surface">
          {list.map((e, i) => (
            <li
              key={`${e.category}/${e.slug}`}
              className="grid grid-cols-[48px_1fr_auto] items-center gap-4 border-b border-border px-5 py-4 last:border-0 hover:bg-surface-2 sm:grid-cols-[56px_1fr_90px_140px_auto]"
            >
              <div className="font-display text-3xl font-semibold tabular-nums text-ink-subtle">
                {String(i + 4).padStart(2, "0")}
              </div>
              <Link
                to="/entry/$category/$slug"
                params={{ category: e.category, slug: e.slug }}
                className="min-w-0 rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60"
              >
                <div className="flex flex-wrap items-center gap-2">
                  <CategoryPill>{e.category}</CategoryPill>
                  <TrustBadge level={e.trust} />
                  <SourceBadge status={e.source} />
                </div>
                <div className="mt-1 font-display text-base font-semibold text-ink hover:underline">
                  {e.title}
                </div>
                <p className="line-clamp-1 text-sm text-ink-muted">{e.description}</p>
              </Link>
              <div className="hidden sm:block">
                <Sparkline
                  data={sparklineFor(e)}
                  width={80}
                  height={22}
                  strokeClassName="stroke-trust-trusted"
                  fillClassName="fill-trust-trusted/10"
                  ariaLabel={`Momentum for ${e.title}`}
                />
              </div>
              <div className="hidden flex-col items-end gap-0.5 font-mono text-xs text-ink-muted tabular-nums sm:flex">
                <div className="flex items-center gap-1">
                  <Star className="h-3 w-3" /> {formatCompact(e.stars ?? 0)}
                </div>
                {e.signals?.weeklyInstalls ? (
                  <div className="text-ink-subtle">
                    {formatCompact(e.signals.weeklyInstalls)}/wk
                  </div>
                ) : null}
              </div>
              <MovementCell score={e.trending ?? 0} window={sp.window} />
            </li>
          ))}
        </ol>
      ) : null}

      {/* Fell off this period */}
      {fellOff.length > 0 && sp.window !== "all" && (
        <div className="mt-10 rounded-xl border border-dashed border-border bg-surface/50 p-4">
          <div className="flex items-center justify-between gap-2">
            <div>
              <div className="eyebrow">Cooled off</div>
              <div className="font-display text-base font-semibold text-ink">
                Trended last period, not this one
              </div>
            </div>
            <Link to="/browse" className="text-xs text-ink-muted hover:text-ink">
              See all →
            </Link>
          </div>
          <ul className="mt-3 grid gap-2 sm:grid-cols-3">
            {fellOff.map((e) => (
              <li key={`${e.category}/${e.slug}`}>
                <Link
                  to="/entry/$category/$slug"
                  params={{ category: e.category, slug: e.slug }}
                  className="block rounded-lg border border-border bg-surface p-3 transition-colors duration-200 ease-out hover:bg-surface-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60"
                >
                  <div className="flex items-center gap-1.5">
                    <CategoryPill>{e.category}</CategoryPill>
                  </div>
                  <div className="mt-1 line-clamp-1 font-display text-sm font-semibold text-ink">
                    {e.title}
                  </div>
                  <p className="line-clamp-1 text-xs text-ink-muted">{e.description}</p>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Bottom CTAs */}
      <div className="mt-8 flex flex-wrap items-center justify-between gap-3 rounded-lg border border-border bg-surface px-4 py-3 text-sm">
        <div className="flex items-center gap-2 text-ink-muted">
          <Rss className="h-4 w-4" /> Subscribe to weekly trending
        </div>
        <div className="flex flex-wrap gap-2">
          <a
            href="/feeds/trending.xml"
            className="inline-flex h-8 items-center gap-1.5 rounded-md border border-border bg-surface px-3 text-xs font-medium text-ink transition-transform hover:bg-surface-2 active:translate-y-px"
          >
            <Rss className="h-3.5 w-3.5" /> RSS
          </a>
          <Link
            to="/brief"
            className="inline-flex h-8 items-center gap-1.5 rounded-md border border-border bg-surface px-3 text-xs font-medium text-ink transition-transform hover:bg-surface-2 active:translate-y-px"
          >
            Weekly Brief →
          </Link>
          <Link
            to="/browse"
            className="inline-flex h-8 items-center gap-1.5 rounded-md bg-ink px-3 text-xs font-medium text-background transition-transform hover:opacity-90 active:translate-y-px"
          >
            Browse all <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
