import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Sparkles,
  ShieldCheck,
  GitBranch,
  Flame,
  Calendar,
  Bot,
  Server,
  BookOpen,
  Terminal,
  Cpu,
  Wrench,
  FileCode,
  Layers,
  Activity,
  Package,
} from "lucide-react";
import { CommandBar } from "@/components/command-bar";
import { IntentChips } from "@/components/intent-chips";
import { ResourceCard } from "@/components/resource-card";
import { CategoryPill, Kbd } from "@/components/badges";
import { CountUp } from "@/components/count-up";
import { HeroStatusRow } from "@/components/hero-status-row";
import { HowItWorks } from "@/components/how-it-works";
import { AgentNativeStrip } from "@/components/agent-native-strip";
import { EcosystemPulse, type EcosystemPulseData } from "@/components/ecosystem-pulse";
import { trackEvent } from "@/lib/analytics";
import {
  homeBriefAnalyticsData,
  homeBriefAnalyticsEvent,
  homeBriefDestination,
  homeBrowseSearchDestination,
  homeCategorySelectAnalyticsData,
  homeCategorySelectAnalyticsEvent,
  homeCategorySelectDestination,
  homeCompareRailCtaAnalyticsData,
  homeCompareRailCtaAnalyticsEvent,
  homeCompareRailCtaDestination,
  homeContributeCtaAnalyticsData,
  homeContributeCtaAnalyticsEvent,
  homeContributeCtaDestination,
  homeHeroCtaAnalyticsData,
  homeHeroCtaAnalyticsEvent,
  homeHeroCtaDestination,
  homeHeroExampleSearchAnalyticsData,
  homeHeroExampleSearchAnalyticsEvent,
  homePopularSearchAnalyticsData,
  homePopularSearchAnalyticsEvent,
  homeRailCtaAnalyticsData,
  homeRailCtaAnalyticsEvent,
  homeRailCtaDestination,
  homeTrustStatAnalyticsData,
  homeTrustStatAnalyticsEvent,
  homeTrustStatDestination,
  type HomeContributeCtaId,
  type HomeTrustStatId,
} from "@/lib/home-page-cta-events";
import { useRecents } from "@/lib/recents";
import { useEffect, useState } from "react";
import { createServerFn } from "@tanstack/react-start";
import { CATEGORIES, type Category, type Entry } from "@/types/registry";
import { absoluteUrl } from "@/lib/seo";
import { ogImageUrl } from "@/lib/og-image";
import { filterRecentPulseEntries } from "@/lib/ecosystem-pulse-window";

// Home featured/brief/stats are computed server-side so the ~1 MB registry dataset stays out of
// the / route's client chunk (the dataset is dynamically imported inside this server handler only).
const loadHomeData = createServerFn({ method: "GET" }).handler(async () => {
  const { ENTRIES, BRIEF_ISSUES, REGISTRY_GENERATED_AT } = await import("@/data/entries");
  const { search } = await import("@/data/search");
  const { CHANGELOG } = await import("@/data/changelog");
  const { CONTRIBUTORS } = await import("@/data/contributors");
  const categoryCounts: Record<string, number> = {};
  for (const e of ENTRIES) categoryCounts[e.category] = (categoryCounts[e.category] ?? 0) + 1;
  const recentChangelog = filterRecentPulseEntries(CHANGELOG);
  const pulseCounts = recentChangelog.reduce(
    (acc, c) => {
      acc[c.kind] = (acc[c.kind] ?? 0) + 1;
      return acc;
    },
    {} as Record<string, number>,
  );
  return {
    stats: {
      total: ENTRIES.length,
      trusted: ENTRIES.filter((e) => e.trust === "trusted").length,
      sourceBacked: ENTRIES.filter((e) => e.source !== "unverified").length,
      reviewed: ENTRIES.filter((e) => e.reviewed).length,
    },
    popular: search({ sort: "popular" }).slice(0, 6),
    newest: search({ sort: "newest" }).slice(0, 4),
    sourceBackedEntries: ENTRIES.filter(
      (e) => e.source !== "unverified" && e.trust === "trusted",
    ).slice(0, 4),
    categoryCounts,
    registryGeneratedAt: REGISTRY_GENERATED_AT,
    brief: BRIEF_ISSUES[0] ?? null,
    pulse: {
      recent: recentChangelog.slice(0, 4).map((item) => ({
        ref: item.ref,
        kind: item.kind,
        category: item.category,
        title: item.title,
        date: item.date,
      })),
      topContributors: [...CONTRIBUTORS]
        .sort((a, b) => (b.acceptedCount ?? 0) - (a.acceptedCount ?? 0))
        .slice(0, 4)
        .map((contributor) => ({
          slug: contributor.slug,
          name: contributor.name,
          acceptedCount: contributor.acceptedCount,
        })),
      counts: pulseCounts,
    } satisfies EcosystemPulseData,
  };
});

const CATEGORY_ICONS: Partial<Record<Category, typeof Bot>> = {
  agents: Bot,
  mcp: Server,
  skills: Sparkles,
  commands: Terminal,
  hooks: Activity,
  rules: BookOpen,
  statuslines: Cpu,
  guides: FileCode,
  collections: Layers,
  tools: Wrench,
};

const EXAMPLE_QUERIES = [
  "postgres mcp",
  "secret scanner hook",
  "release notes agent",
  "swiftui skill",
  "code review agent",
];

const POPULAR_SEARCHES = [
  "mcp",
  "code review",
  "secret scanner",
  "release notes",
  "test runner",
  "react rules",
];

// Same card for og:image and twitter:image; the inputs are static.
const OG_IMAGE = ogImageUrl({ title: "The directory for Claude workflows", eyebrow: "HeyClaude" });

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "HeyClaude — directory for Claude Code, MCP, agents, skills & hooks" },
      {
        name: "description",
        content:
          "Search, compare, and inspect trust on Claude Code MCP servers, skills, hooks, commands, agents, and tools. GitHub-native, source-backed, reviewed.",
      },
      { property: "og:title", content: "HeyClaude — the directory for Claude workflows" },
      {
        property: "og:description",
        content:
          "Source-backed registry of MCP servers, agents, skills, hooks, commands, and rules. Reviewed before installing.",
      },
      { property: "og:url", content: absoluteUrl("/") },
      {
        property: "og:image",
        content: OG_IMAGE,
      },
      { property: "og:image:type", content: "image/png" },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "630" },
      {
        name: "twitter:image",
        content: OG_IMAGE,
      },
    ],
    links: [{ rel: "canonical", href: absoluteUrl("/") }],
  }),
  loader: () => loadHomeData(),
  component: Home,
});

function Home() {
  const data = Route.useLoaderData();
  const popular = data.popular as Entry[];
  const newest = data.newest as Entry[];
  const sourceBacked = data.sourceBackedEntries as Entry[];
  const categoryCounts = data.categoryCounts as Record<string, number>;
  const pulse = data.pulse as EcosystemPulseData;
  const latestBrief = data.brief;
  const TOTAL = data.stats.total;
  const TRUSTED_COUNT = data.stats.trusted;
  const SOURCE_BACKED_COUNT = data.stats.sourceBacked;
  const REVIEWED_COUNT = data.stats.reviewed;
  const REGISTRY_GENERATED_AT = data.registryGeneratedAt;
  const recents = useRecents();
  // Resolve recently-viewed entries from the dataset lazily (client-only, below the fold) so the
  // registry dataset stays out of the home route chunk.
  const recentsKey = recents.entries
    .slice(0, 3)
    .map((r) => `${r.category}/${r.slug}`)
    .join(",");
  const [recentEntries, setRecentEntries] = useState<Entry[]>([]);
  useEffect(() => {
    const refs = recentsKey ? recentsKey.split(",") : [];
    if (refs.length === 0) {
      setRecentEntries([]);
      return;
    }
    let cancelled = false;
    void import("@/data/entries").then(({ ENTRIES }) => {
      if (cancelled) return;
      setRecentEntries(
        refs
          .map((ref) => {
            const [category, slug] = ref.split("/");
            return ENTRIES.find((e) => e.category === category && e.slug === slug);
          })
          .filter((e): e is Entry => !!e),
      );
    });
    return () => {
      cancelled = true;
    };
  }, [recentsKey]);

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border">
        <div className="grid-bg absolute inset-0 opacity-40" aria-hidden />
        <div className="relative mx-auto max-w-[1100px] px-4 py-16 sm:px-6 sm:py-24">
          <HeroStatusRow
            resourceCount={TOTAL}
            reviewedCount={REVIEWED_COUNT}
            briefNumber={latestBrief?.number ?? 14}
            briefDate={latestBrief?.date ?? "this week"}
            indexedAt={REGISTRY_GENERATED_AT}
          />

          <h1
            className="mt-6 max-w-3xl font-display font-semibold leading-[1.02] tracking-[-0.03em] text-ink text-balance"
            style={{
              fontSize: "clamp(2.5rem, 1.4rem + 4.4vw, 4.25rem)",
              viewTransitionName: "hero-title",
            }}
          >
            What are you{" "}
            <span className="relative inline-block">
              <span className="relative z-10">trying to build</span>
              <span
                className="absolute inset-x-0 bottom-1 h-3 -skew-y-1 bg-accent/70"
                aria-hidden
              />
            </span>
            ?
          </h1>
          <p className="mt-5 max-w-2xl text-pretty text-base text-ink-muted sm:text-lg">
            Search MCP servers, skills, hooks, commands, agents, and rules — or start with an
            intent. GitHub-native. Source-backed. Reviewed before installing.
          </p>

          <div className="mt-8 max-w-2xl">
            <CommandBar size="lg" autoFocus />
            <IntentChips className="mt-4" />
            <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-ink-subtle">
              <span className="hidden sm:inline">
                Press <Kbd>⌘</Kbd> <Kbd>K</Kbd> · try
              </span>
              {EXAMPLE_QUERIES.slice(0, 4).map((q, queryIndex) => {
                const destination = homeBrowseSearchDestination(q);
                if (!destination) return null;
                return (
                  <Link
                    key={q}
                    to={destination.to}
                    search={destination.search}
                    onClick={() =>
                      trackEvent(
                        homeHeroExampleSearchAnalyticsEvent(),
                        homeHeroExampleSearchAnalyticsData(q.length, queryIndex),
                      )
                    }
                    className="rounded-full border border-border bg-surface px-2.5 py-1 font-mono text-ink-muted transition-colors duration-200 ease-out hover:border-border-strong hover:text-ink"
                  >
                    {q}
                  </Link>
                );
              })}
            </div>
            <div className="mt-5 flex flex-wrap items-center gap-2 text-sm">
              {(() => {
                const destination = homeHeroCtaDestination("browse-all");
                if (!destination) return null;
                return (
                  <Link
                    to={destination.to}
                    onClick={() =>
                      trackEvent(
                        homeHeroCtaAnalyticsEvent(),
                        homeHeroCtaAnalyticsData("browse-all"),
                      )
                    }
                    className="inline-flex h-9 items-center gap-1.5 rounded-md bg-ink px-4 font-medium text-background hover:opacity-90"
                  >
                    Browse all <ArrowRight className="h-4 w-4" />
                  </Link>
                );
              })()}
              {(() => {
                const destination = homeHeroCtaDestination("setup-mcp");
                if (!destination || !("params" in destination)) return null;
                return (
                  <Link
                    to={destination.to}
                    params={destination.params}
                    title="View the MCP setup snippet and config"
                    aria-label="Set up the HeyClaude MCP server inside Claude Code"
                    onClick={() =>
                      trackEvent(homeHeroCtaAnalyticsEvent(), homeHeroCtaAnalyticsData("setup-mcp"))
                    }
                    className="inline-flex h-9 items-center gap-1.5 rounded-md border border-border bg-surface px-4 font-medium text-ink hover:bg-surface-2"
                  >
                    <Server className="h-4 w-4" /> Set up MCP
                  </Link>
                );
              })()}
              {(() => {
                const destination = homeHeroCtaDestination("best");
                if (!destination) return null;
                return (
                  <Link
                    to={destination.to}
                    onClick={() =>
                      trackEvent(homeHeroCtaAnalyticsEvent(), homeHeroCtaAnalyticsData("best"))
                    }
                    className="inline-flex h-9 items-center gap-1.5 rounded-md border border-transparent px-2 font-medium text-ink-muted hover:text-ink"
                  >
                    Best of HeyClaude →
                  </Link>
                );
              })()}
            </div>
          </div>
        </div>
      </section>

      {/* Trust strip — moved up under hero */}
      <section className="mx-auto max-w-page px-4 py-8 sm:px-6">
        <div className="grid gap-px overflow-hidden rounded-xl border border-border bg-border sm:grid-cols-2 lg:grid-cols-5">
          {(
            [
              {
                icon: ShieldCheck,
                label: "Trusted",
                value: TRUSTED_COUNT,
                hint: "metadata reviewed",
                statId: "trusted" as const,
              },
              {
                icon: GitBranch,
                label: "Source-backed",
                value: SOURCE_BACKED_COUNT,
                hint: "repo verified",
                statId: "source-backed" as const,
              },
              {
                icon: Sparkles,
                label: "Reviewed",
                value: REVIEWED_COUNT,
                hint: "maintainer-checked",
                statId: "reviewed" as const,
              },
              {
                icon: Flame,
                label: "Live signals",
                value: TOTAL,
                hint: "tracked entries",
                statId: "live-signals" as const,
              },
              {
                icon: Package,
                label: "Categories",
                value: CATEGORIES.length,
                hint: "surfaces indexed",
                statId: "categories" as const,
              },
            ] as const
          ).map((stat) => {
            const destination = homeTrustStatDestination(stat.statId);
            return (
              <TrustStat
                key={stat.statId}
                icon={stat.icon}
                label={stat.label}
                value={stat.value}
                hint={stat.hint}
                to={destination?.to}
                search={destination?.search}
                statId={stat.statId}
              />
            );
          })}
        </div>
      </section>

      {/* How it works */}
      <HowItWorks />

      {/* Category shortcuts — Claude-native primary */}
      <section className="mx-auto max-w-page px-4 py-6 sm:px-6">
        <RailHeader
          eyebrow="Categories"
          title="Browse by surface"
          ctaLabel="All categories"
          railId="categories"
        />
        <div className="mt-6 grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-border bg-border stagger-children sm:grid-cols-3 lg:grid-cols-5">
          {CATEGORIES.map((c) => {
            const count = categoryCounts[c.id] ?? 0;
            const Icon = CATEGORY_ICONS[c.id] ?? Sparkles;
            const destination = homeCategorySelectDestination(c.id);
            if (!destination) return null;
            return (
              <Link
                key={c.id}
                to={destination.to}
                params={destination.params}
                onClick={() =>
                  trackEvent(
                    homeCategorySelectAnalyticsEvent(),
                    homeCategorySelectAnalyticsData(c.id, count),
                  )
                }
                className="group hover-lift relative flex flex-col gap-1 bg-surface p-4 hover:bg-surface-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-accent/60"
              >
                <div className="flex items-center justify-between">
                  <Icon className="h-3.5 w-3.5 text-ink-muted transition-colors duration-200 ease-out group-hover:text-ink-hover" />
                  <span className="font-mono text-xs text-ink-subtle tabular-nums">{count}</span>
                </div>
                <div className="mt-3 font-display text-sm font-semibold text-ink">{c.label}</div>
                <div className="line-clamp-2 text-xs text-ink-muted">{c.blurb}</div>
                <span
                  aria-hidden
                  className="absolute inset-y-0 left-0 w-px origin-bottom scale-y-0 bg-accent transition-transform duration-200 group-hover:scale-y-100"
                />
              </Link>
            );
          })}
        </div>
      </section>

      {recentEntries.length > 0 && (
        <section className="mx-auto max-w-page px-4 py-6 sm:px-6">
          <div className="mb-3 flex items-baseline justify-between gap-3">
            <div className="eyebrow">Recently viewed</div>
            {(() => {
              const destination = homeRailCtaDestination("recent");
              if (!destination) return null;
              return (
                <Link
                  to={destination.to}
                  onClick={() =>
                    trackEvent(
                      homeRailCtaAnalyticsEvent(),
                      homeRailCtaAnalyticsData("recent", destination.to),
                    )
                  }
                  className="text-xs text-ink-muted hover:text-ink"
                >
                  Browse all →
                </Link>
              );
            })()}
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {recentEntries.map((e) => (
              <ResourceCard
                key={`${e.category}/${e.slug}`}
                entry={e}
                variant="grid"
                analyticsSurface="home-recent"
              />
            ))}
          </div>
        </section>
      )}

      {/* Popular */}
      <section className="mx-auto max-w-page px-4 py-6 sm:px-6">
        <RailHeader
          eyebrow="Popular starting points"
          title="What developers inspect first"
          icon={Flame}
          railId="popular"
        />
        <div className="mt-3 flex flex-wrap items-center gap-1.5 text-xs">
          <span className="eyebrow mr-1">Popular searches</span>
          {POPULAR_SEARCHES.map((q, queryIndex) => {
            const destination = homeBrowseSearchDestination(q);
            if (!destination) return null;
            return (
              <Link
                key={q}
                to={destination.to}
                search={destination.search}
                onClick={() =>
                  trackEvent(
                    homePopularSearchAnalyticsEvent(),
                    homePopularSearchAnalyticsData(q.length, queryIndex),
                  )
                }
                className="inline-flex items-center rounded-full border border-border bg-surface px-2.5 py-1 font-mono text-ink-muted hover:border-border-strong hover:text-ink"
              >
                {q}
              </Link>
            );
          })}
        </div>
        <div className="mt-4 grid gap-4 stagger-children sm:grid-cols-2 lg:grid-cols-3">
          {popular.map((e) => (
            <ResourceCard
              key={`${e.category}/${e.slug}`}
              entry={e}
              variant="grid"
              analyticsSurface="home-popular"
            />
          ))}
        </div>
      </section>

      {/* Compare-ready rail (was: source-backed dup) */}
      <section className="mx-auto max-w-page px-4 py-12 sm:px-6">
        <div className="overflow-hidden rounded-xl border border-border bg-surface">
          <div className="flex items-center justify-between gap-4 border-b border-border px-5 py-4">
            <div className="flex items-start gap-2">
              <GitBranch className="mt-0.5 h-4 w-4 text-ink-muted" />
              <div>
                <div className="eyebrow">Compare side-by-side</div>
                <div className="mt-0.5 text-xs text-ink-subtle">
                  Source-backed · safe to install
                </div>
              </div>
            </div>
            {(() => {
              const compareIds = sourceBacked.map((e) => `${e.category}/${e.slug}`).join(",");
              const destination = homeCompareRailCtaDestination("open-compare", compareIds);
              if (!destination) return null;
              return (
                <Link
                  to={destination.to}
                  search={"search" in destination ? destination.search : undefined}
                  onClick={() =>
                    trackEvent(
                      homeCompareRailCtaAnalyticsEvent(),
                      homeCompareRailCtaAnalyticsData("open-compare", sourceBacked.length),
                    )
                  }
                  className="text-xs text-ink-muted hover:text-ink"
                >
                  Open in compare →
                </Link>
              );
            })()}
          </div>
          <div className="divide-y divide-border">
            {sourceBacked.map((e) => (
              <ResourceCard
                key={`${e.category}/${e.slug}`}
                entry={e}
                analyticsSurface="home-compare-rail"
              />
            ))}
          </div>
          <div className="flex items-center justify-between border-t border-border bg-surface-2 px-5 py-3 text-xs text-ink-muted">
            <span>Pick any 4 to see install, trust, source, and platforms in one table.</span>
            {(() => {
              const destination = homeCompareRailCtaDestination("build-comparison");
              if (!destination) return null;
              return (
                <Link
                  to={destination.to}
                  onClick={() =>
                    trackEvent(
                      homeCompareRailCtaAnalyticsEvent(),
                      homeCompareRailCtaAnalyticsData("build-comparison", sourceBacked.length),
                    )
                  }
                  className="story-link font-medium text-ink"
                >
                  Build a comparison →
                </Link>
              );
            })()}
          </div>
        </div>
      </section>

      {/* Agent-native */}
      <AgentNativeStrip />

      {/* Two-up: new + pulse */}
      <section className="mx-auto grid max-w-page gap-8 px-4 py-6 sm:px-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <RailHeader
            eyebrow="New this week"
            title="Just added"
            icon={Sparkles}
            ctaLabel="Browse all"
            railId="newest"
          />
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {newest.map((e) => (
              <ResourceCard
                key={`${e.category}/${e.slug}`}
                entry={e}
                variant="grid"
                analyticsSurface="home-newest"
              />
            ))}
          </div>
          {latestBrief &&
            (() => {
              const destination = homeBriefDestination("brief");
              if (!destination) return null;
              return (
                <Link
                  to={destination.to}
                  onClick={() =>
                    trackEvent(
                      homeBriefAnalyticsEvent(),
                      homeBriefAnalyticsData(latestBrief.number),
                    )
                  }
                  className="mt-4 flex items-center justify-between gap-4 rounded-lg border border-border bg-surface p-4 hover:bg-surface-2"
                >
                  <div className="flex items-center gap-3">
                    <Calendar className="h-4 w-4 text-ink-muted" />
                    <div>
                      <div className="text-xs text-ink-subtle">
                        Weekly Brief #{latestBrief.number} · {latestBrief.date}
                      </div>
                      <div className="font-display text-sm font-semibold text-ink">
                        {latestBrief.title}
                      </div>
                    </div>
                  </div>
                  <span className="text-xs text-ink-muted">Read →</span>
                </Link>
              );
            })()}
        </div>
        <aside>
          <EcosystemPulse data={pulse} />
        </aside>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-page px-4 py-16 sm:px-6">
        <div className="relative overflow-hidden rounded-xl border border-border bg-ink p-8 text-background">
          <span aria-hidden className="absolute inset-x-0 top-0 h-px bg-accent/60" />
          <div className="flex flex-col items-start gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="eyebrow text-background/60">Contribute</div>
              <h2 className="mt-2 font-display text-2xl font-semibold tracking-tight">
                Built something worth pinning?
              </h2>
              <p className="mt-2 max-w-md text-sm text-background/70">
                Free, source-backed, useful. Submissions are reviewed for metadata, safety notes,
                and provenance.
              </p>
              <p className="mt-3 font-mono text-[11px] uppercase tracking-wider text-background/50">
                12 reviewed last week · 3 merged · avg review 36h
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              {(
                [
                  {
                    ctaId: "submit" as const,
                    className:
                      "inline-flex h-10 items-center gap-1.5 rounded-md bg-accent px-4 text-sm font-semibold text-accent-ink hover:opacity-90",
                    children: (
                      <>
                        Submit a resource <ArrowRight className="h-4 w-4" />
                      </>
                    ),
                  },
                  {
                    ctaId: "claim" as const,
                    className:
                      "inline-flex h-10 items-center rounded-md border border-background/20 px-4 text-sm font-medium hover:bg-background/10",
                    children: <>Claim listing</>,
                  },
                  {
                    ctaId: "api-docs" as const,
                    className:
                      "inline-flex h-10 items-center rounded-md border border-transparent px-2 text-sm font-medium text-background/70 hover:text-background",
                    children: <>Submission spec →</>,
                  },
                ] as const
              ).map((cta) => {
                const destination = homeContributeCtaDestination(cta.ctaId);
                if (!destination) return null;
                return (
                  <Link
                    key={cta.ctaId}
                    to={destination.to}
                    onClick={() =>
                      trackEvent(
                        homeContributeCtaAnalyticsEvent(),
                        homeContributeCtaAnalyticsData(cta.ctaId as HomeContributeCtaId),
                      )
                    }
                    className={cta.className}
                  >
                    {cta.children}
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function RailHeader({
  eyebrow,
  title,
  ctaLabel = "See all",
  icon: Icon,
  railId,
}: {
  eyebrow: string;
  title: string;
  ctaLabel?: string;
  icon?: React.ElementType;
  railId: string;
}) {
  const destination = homeRailCtaDestination(railId);
  return (
    <div className="flex items-end justify-between gap-4">
      <div>
        <div className="eyebrow flex items-center gap-1.5">
          {Icon ? <Icon className="h-3 w-3" /> : null}
          {eyebrow}
        </div>
        <h2 className="mt-1 h-display-2 text-ink text-balance">{title}</h2>
      </div>
      {destination && (
        <Link
          to={destination.to}
          onClick={() => {
            trackEvent(
              homeRailCtaAnalyticsEvent(),
              homeRailCtaAnalyticsData(railId, destination.to),
            );
          }}
          className="text-sm text-ink-muted hover:text-ink"
        >
          {ctaLabel} →
        </Link>
      )}
    </div>
  );
}

function TrustStat({
  icon: Icon,
  label,
  value,
  hint,
  to,
  search,
  statId,
}: {
  icon: React.ElementType;
  label: string;
  value: number;
  hint?: string;
  to?: string;
  search?: Record<string, string>;
  statId?: HomeTrustStatId;
}) {
  const inner = (
    <>
      <div className="flex h-9 w-9 items-center justify-center rounded-md bg-surface-2">
        <Icon className="h-4 w-4 text-ink" />
      </div>
      <div className="min-w-0">
        <div className="font-display text-2xl font-semibold tabular-nums leading-none text-ink">
          <CountUp value={value} />
        </div>
        <div className="mt-1 text-xs text-ink-muted">{label}</div>
        {hint && (
          <div className="text-[10px] font-mono uppercase tracking-wider text-ink-subtle">
            {hint}
          </div>
        )}
      </div>
    </>
  );
  const cls =
    "flex items-center gap-3 bg-surface p-5 transition-colors duration-200 ease-out hover:bg-surface-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-accent/60";
  if (to) {
    return (
      <Link
        to={to}
        search={search as never}
        onClick={() => {
          if (!statId) return;
          trackEvent(homeTrustStatAnalyticsEvent(), homeTrustStatAnalyticsData(statId));
        }}
        className={cls}
      >
        {inner}
      </Link>
    );
  }
  return <div className={cls}>{inner}</div>;
}
