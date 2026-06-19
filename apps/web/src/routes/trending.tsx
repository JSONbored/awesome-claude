import * as React from "react";
import { createFileRoute, Link, stripSearchParams } from "@tanstack/react-router";
import { z } from "zod";
import { ArrowRight, Clock, Flame, Info, Rss, Star, TrendingUp } from "lucide-react";
import { BRIEF_ISSUES } from "@/data/entries";
import { PageContainer } from "@/components/page-container";
import { getEntry, search } from "@/data/search";
import { CategoryPill, SourceBadge, TrustBadge } from "@/components/badges";
import { TrendingPodium } from "@/components/trending-podium";
import { ShareMenu } from "@/components/share-menu";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { CATEGORIES, type Entry } from "@/types/registry";
import { formatCompact } from "@/lib/format";
import { breadcrumbScript } from "@/lib/seo-jsonld";
import { absoluteUrl } from "@/lib/seo";
import { ogImageUrl } from "@/lib/og-image";
import { cn } from "@/lib/utils";

const defaultSearch = {
  window: "7d" as const,
  category: "",
};

const trendingSchema = z.object({
  window: z.enum(["7d", "30d", "all"]).catch(defaultSearch.window).default(defaultSearch.window),
  category: z.string().catch(defaultSearch.category).default(defaultSearch.category),
});

type SignalState = {
  votes?: boolean;
  community?: boolean;
  intent?: boolean;
};

type TrendingEntry = Entry & {
  trendingScore?: number;
  trendingReasons?: string[];
};

type TrendingPayload = {
  signalsAvailable?: SignalState;
  entries?: Array<{
    category: string;
    slug: string;
    score?: number;
    reasons?: string[];
  }>;
};

type TrendingMode = "live" | "fallback" | "unavailable";

const REASON_LABELS: Record<string, string> = {
  upvotes: "reader upvotes",
  community_used: "community usage reports",
  community_works: "community works reports",
  recent_intent: "recent install/copy intent",
  first_party_package: "first-party package metadata",
  production_verified: "production verification metadata",
  source_backed_fallback: "source-backed fallback ranking",
};

export const Route = createFileRoute("/trending")({
  validateSearch: trendingSchema,
  search: {
    middlewares: [stripSearchParams(defaultSearch)],
  },
  head: () => ({
    meta: [
      { title: "Trending Claude workflows — HeyClaude" },
      {
        name: "description",
        content:
          "Trending Claude Code MCP servers, agents, skills, hooks, and commands from live community and intent signals.",
      },
      { property: "og:url", content: absoluteUrl("/trending") },
      {
        property: "og:image",
        content: ogImageUrl({ title: "Trending Claude workflows", eyebrow: "Trending" }),
      },
      { property: "og:image:type", content: "image/png" },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "630" },
      {
        name: "twitter:image",
        content: ogImageUrl({ title: "Trending Claude workflows", eyebrow: "Trending" }),
      },
    ],
    links: [{ rel: "canonical", href: absoluteUrl("/trending") }],
    scripts: [
      breadcrumbScript([
        { name: "Directory", path: "/browse" },
        { name: "Trending", path: "/trending" },
      ]),
    ],
  }),
  component: TrendingPage,
});

function hasLiveSignals(signals?: SignalState) {
  return Boolean(signals?.votes || signals?.community || signals?.intent);
}

function fallbackRows(): TrendingEntry[] {
  return search({ sort: "popular" })
    .filter((entry) => entry.source !== "unverified")
    .slice(0, 100)
    .map((entry) => ({
      ...entry,
      trendingScore: undefined,
      trendingReasons: ["source_backed_fallback"],
    }));
}

function rowsFromPayload(payload: TrendingPayload): TrendingEntry[] {
  const rows: TrendingEntry[] = [];
  for (const item of payload.entries ?? []) {
    const entry = getEntry(item.category, item.slug);
    if (!entry) continue;
    rows.push({
      ...entry,
      trendingScore: Math.round(Number(item.score ?? 0)),
      trendingReasons: item.reasons ?? [],
    });
  }
  return rows;
}

function useTrendingRows() {
  const [rows, setRows] = React.useState<TrendingEntry[]>([]);
  const [mode, setMode] = React.useState<TrendingMode>("unavailable");
  const [signals, setSignals] = React.useState<SignalState>({});
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      try {
        const response = await fetch("/api/registry/trending?limit=50", {
          headers: { accept: "application/json" },
        });
        if (!response.ok) throw new Error(`trending API returned ${response.status}`);
        const payload = (await response.json()) as TrendingPayload;
        const live = hasLiveSignals(payload.signalsAvailable);
        const liveRows = rowsFromPayload(payload);
        if (!cancelled) {
          setSignals(payload.signalsAvailable ?? {});
          setRows(live && liveRows.length > 0 ? liveRows : fallbackRows());
          setMode(live && liveRows.length > 0 ? "live" : "fallback");
        }
      } catch {
        if (!cancelled) {
          setSignals({});
          setRows(fallbackRows());
          setMode("fallback");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    void load();
    return () => {
      cancelled = true;
    };
  }, []);

  return { rows, mode, signals, loading };
}

function MovementCell({ entry, mode }: { entry: TrendingEntry; mode: TrendingMode }) {
  const score = entry.trendingScore ?? 0;
  const reasons = entry.trendingReasons ?? [];
  const live = mode === "live";
  return (
    <TooltipProvider delayDuration={150}>
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            type="button"
            className={cn(
              "inline-flex items-center gap-1 rounded-sm font-mono text-sm tabular-nums focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60",
              live ? "text-trust-trusted" : "text-ink-muted",
            )}
            aria-label="Why is this ranked here?"
          >
            {live ? <TrendingUp className="h-3.5 w-3.5" /> : <ArrowRight className="h-3.5 w-3.5" />}
            <span>{live ? `+${score}` : "static"}</span>
            <Info className="h-3 w-3 text-ink-subtle" />
          </button>
        </TooltipTrigger>
        <TooltipContent side="left" className="max-w-[240px] bg-ink text-background">
          <div className="space-y-1 text-[11px]">
            <div className="font-medium">{live ? "Live ranking inputs" : "Fallback ranking"}</div>
            {reasons.length ? (
              <ul className="space-y-0.5 opacity-80">
                {reasons.map((reason) => (
                  <li key={reason}>{REASON_LABELS[reason] ?? reason}</li>
                ))}
              </ul>
            ) : (
              <div className="opacity-80">No public signal reasons were reported.</div>
            )}
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
  const { rows: allRows, mode, signals, loading } = useTrendingRows();

  const rows = sp.category ? allRows.filter((entry) => entry.category === sp.category) : allRows;
  const podium = rows.slice(0, 3);
  const list = rows.slice(3);
  const liveSignals = hasLiveSignals(signals);

  const countsByCategory = React.useMemo(() => {
    const counts: Record<string, number> = {};
    for (const entry of allRows) counts[entry.category] = (counts[entry.category] ?? 0) + 1;
    return counts;
  }, [allRows]);

  const set = (patch: Partial<typeof sp>) =>
    navigate({ search: (prev: typeof sp) => ({ ...prev, ...patch }) });

  const shareUrl = `/trending${sp.category ? `?category=${sp.category}` : ""}`;

  return (
    <PageContainer className="py-12">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <Flame className="h-4 w-4 text-trust-limited" />
            <span className="eyebrow">Trending · live registry signals</span>
          </div>
          <h1 className="mt-2 h-display-1 text-ink text-balance">What developers are pinning</h1>
          <p className="mt-4 max-w-2xl text-pretty text-base text-ink-muted sm:text-lg">
            Ranked by public upvotes, community usage reports, recent install/copy intent, and
            source-backed trust signals when those live inputs are available.
            <span className="ml-1 font-mono text-xs text-ink-subtle">{rows.length} resources</span>
          </p>
          {mode === "fallback" && (
            <div className="mt-3 max-w-2xl rounded-lg border border-border bg-surface px-3 py-2 text-xs text-ink-muted">
              Live trending signals are unavailable or empty right now, so this view is showing
              source-backed popular entries instead of simulated momentum.
            </div>
          )}
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
            title="Trending Claude workflows"
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

      <div className="sticky top-16 z-20 -mx-4 mt-8 border-y border-border bg-background/95 px-4 py-3 backdrop-blur sm:-mx-6 sm:px-6">
        <div className="flex flex-wrap items-center gap-3">
          <div className="inline-flex items-center gap-1 font-mono text-[11px] text-ink-subtle">
            <Clock className="h-3 w-3" />
            {loading
              ? "loading signals"
              : liveSignals
                ? "live D1/community/intent signals"
                : "source-backed fallback"}
          </div>
          <div className="ml-auto text-[11px] text-ink-subtle">
            Votes {signals.votes ? "on" : "off"} · Community {signals.community ? "on" : "off"} ·
            Intent {signals.intent ? "on" : "off"}
          </div>
        </div>

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
              All · {allRows.length}
            </button>
            {CATEGORIES.map((category) => {
              const count = countsByCategory[category.id] ?? 0;
              const active = sp.category === category.id;
              return (
                <button
                  key={category.id}
                  type="button"
                  disabled={count === 0 && !active}
                  onClick={() => set({ category: active ? "" : category.id })}
                  aria-pressed={active}
                  className={cn(
                    "shrink-0 rounded-full border px-2.5 py-1 text-[11px] font-medium transition-colors duration-200 ease-out motion-safe:active:scale-[0.97]",
                    active
                      ? "border-ink bg-ink text-background"
                      : "border-border bg-surface text-ink-muted hover:text-ink",
                    count === 0 && !active && "opacity-40",
                  )}
                >
                  {category.label} <span className="text-ink-subtle">· {count}</span>
                </button>
              );
            })}
          </div>
          <div className="pointer-events-none absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-background to-transparent" />
        </div>
      </div>

      {podium.length > 0 && <TrendingPodium entries={podium} />}

      {rows.length === 0 ? (
        <div className="mt-12 flex flex-col items-center gap-3 rounded-lg border border-dashed border-border p-12 text-center">
          <div className="font-display text-lg font-semibold text-ink">
            No resources in this slice
          </div>
          <p className="max-w-sm text-sm text-ink-muted">
            Try another category or come back when live signals have new activity.
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
          {list.map((entry, index) => (
            <li
              key={`${entry.category}/${entry.slug}`}
              className="grid grid-cols-[48px_1fr_auto] items-center gap-4 border-b border-border px-5 py-4 last:border-0 hover:bg-surface-2 sm:grid-cols-[56px_1fr_120px_auto]"
            >
              <div className="font-display text-3xl font-semibold tabular-nums text-ink-subtle">
                {String(index + 4).padStart(2, "0")}
              </div>
              <Link
                to="/entry/$category/$slug"
                params={{ category: entry.category, slug: entry.slug }}
                className="min-w-0 rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60"
              >
                <div className="flex flex-wrap items-center gap-2">
                  <CategoryPill>{entry.category}</CategoryPill>
                  <TrustBadge level={entry.trust} />
                  <SourceBadge status={entry.source} />
                </div>
                <div className="mt-1 font-display text-base font-semibold text-ink hover:underline">
                  {entry.title}
                </div>
                <p className="line-clamp-1 text-sm text-ink-muted">{entry.description}</p>
              </Link>
              <div className="hidden flex-col items-end gap-0.5 font-mono text-xs text-ink-muted tabular-nums sm:flex">
                {entry.repoStats?.stars !== undefined && (
                  <div className="flex items-center gap-1" title="Source repository stars">
                    <Star className="h-3 w-3" /> {formatCompact(entry.repoStats.stars)}
                  </div>
                )}
                <div className="text-ink-subtle">
                  {entry.source === "unverified" ? "unverified source" : "source-backed"}
                </div>
              </div>
              <MovementCell entry={entry} mode={mode} />
            </li>
          ))}
        </ol>
      ) : null}

      <div className="mt-8 flex flex-wrap items-center justify-between gap-3 rounded-lg border border-border bg-surface px-4 py-3 text-sm">
        <div className="flex items-center gap-2 text-ink-muted">
          <Rss className="h-4 w-4" /> Subscribe to the trending feed
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
    </PageContainer>
  );
}
