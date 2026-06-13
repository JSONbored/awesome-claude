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
import { EcosystemPulse } from "@/components/ecosystem-pulse";
import { useRecents } from "@/lib/recents";
import { CATEGORIES, type Category } from "@/types/registry";
import { ENTRIES, BRIEF_ISSUES, REGISTRY_GENERATED_AT } from "@/data/entries";
import { search } from "@/data/search";
import { absoluteUrl } from "@/lib/seo";

// Pre-computed counts at module scope so SSR + first paint show real numbers.
const TRUSTED_COUNT = ENTRIES.filter((e) => e.trust === "trusted").length;
const SOURCE_BACKED_COUNT = ENTRIES.filter((e) => e.source !== "unverified").length;
const REVIEWED_COUNT = ENTRIES.filter((e) => e.reviewed).length;
const TOTAL = ENTRIES.length;

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
    ],
    links: [{ rel: "canonical", href: absoluteUrl("/") }],
  }),
  component: Home,
});

function Home() {
  const popular = search({ sort: "popular" }).slice(0, 6);
  const newest = search({ sort: "newest" }).slice(0, 4);
  const sourceBacked = ENTRIES.filter(
    (e) => e.source !== "unverified" && e.trust === "trusted",
  ).slice(0, 4);
  const latestBrief = BRIEF_ISSUES[0];
  const recents = useRecents();
  const recentEntries = recents.entries
    .slice(0, 3)
    .map((r) => ENTRIES.find((e) => e.category === r.category && e.slug === r.slug))
    .filter((e): e is NonNullable<typeof e> => !!e);

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
              {EXAMPLE_QUERIES.slice(0, 4).map((q) => (
                <Link
                  key={q}
                  to="/browse"
                  search={{ q }}
                  className="rounded-full border border-border bg-surface px-2.5 py-1 font-mono text-ink-muted transition-colors duration-200 ease-out hover:border-border-strong hover:text-ink"
                >
                  {q}
                </Link>
              ))}
            </div>
            <div className="mt-5 flex flex-wrap items-center gap-2 text-sm">
              <Link
                to="/browse"
                className="inline-flex h-9 items-center gap-1.5 rounded-md bg-ink px-4 font-medium text-background hover:opacity-90"
              >
                Browse all <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/integrations/$slug"
                params={{ slug: "mcp-server" }}
                title="View the MCP setup snippet and config"
                aria-label="Set up the HeyClaude MCP server inside Claude Code"
                className="inline-flex h-9 items-center gap-1.5 rounded-md border border-border bg-surface px-4 font-medium text-ink hover:bg-surface-2"
              >
                <Server className="h-4 w-4" /> Set up MCP
              </Link>
              <Link
                to="/best"
                className="inline-flex h-9 items-center gap-1.5 rounded-md border border-transparent px-2 font-medium text-ink-muted hover:text-ink"
              >
                Best of HeyClaude →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Trust strip — moved up under hero */}
      <section className="mx-auto max-w-[1400px] px-4 py-8 sm:px-6">
        <div className="grid gap-px overflow-hidden rounded-xl border border-border bg-border sm:grid-cols-2 lg:grid-cols-5">
          <TrustStat
            icon={ShieldCheck}
            label="Trusted"
            value={TRUSTED_COUNT}
            hint="metadata reviewed"
            to="/browse"
            search={{ trust: "trusted" }}
          />
          <TrustStat
            icon={GitBranch}
            label="Source-backed"
            value={SOURCE_BACKED_COUNT}
            hint="repo verified"
            to="/browse"
            search={{ source: "source-backed" }}
          />
          <TrustStat
            icon={Sparkles}
            label="Reviewed"
            value={REVIEWED_COUNT}
            hint="maintainer-checked"
            to="/browse"
            search={{ sort: "newest" }}
          />
          <TrustStat
            icon={Flame}
            label="Live signals"
            value={TOTAL}
            hint="tracked entries"
            to="/trending"
          />
          <TrustStat
            icon={Package}
            label="Categories"
            value={CATEGORIES.length}
            hint="surfaces indexed"
            to="/browse"
          />
        </div>
      </section>

      {/* How it works */}
      <HowItWorks />

      {/* Category shortcuts — Claude-native primary */}
      <section className="mx-auto max-w-[1400px] px-4 py-6 sm:px-6">
        <RailHeader
          eyebrow="Categories"
          title="Browse by surface"
          to="/browse"
          ctaLabel="All categories"
        />
        <div className="mt-6 grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-border bg-border stagger-children sm:grid-cols-3 lg:grid-cols-5">
          {CATEGORIES.map((c) => {
            const count = ENTRIES.filter((e) => e.category === c.id).length;
            const Icon = CATEGORY_ICONS[c.id] ?? Sparkles;
            return (
              <Link
                key={c.id}
                to="/$category"
                params={{ category: c.id }}
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
        <section className="mx-auto max-w-[1400px] px-4 py-6 sm:px-6">
          <div className="mb-3 flex items-baseline justify-between gap-3">
            <div className="eyebrow">Recently viewed</div>
            <Link to="/browse" className="text-xs text-ink-muted hover:text-ink">
              Browse all →
            </Link>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {recentEntries.map((e) => (
              <ResourceCard key={`${e.category}/${e.slug}`} entry={e} variant="grid" />
            ))}
          </div>
        </section>
      )}

      {/* Popular */}
      <section className="mx-auto max-w-[1400px] px-4 py-6 sm:px-6">
        <RailHeader
          eyebrow="Popular starting points"
          title="What developers inspect first"
          icon={Flame}
          to="/trending"
        />
        <div className="mt-3 flex flex-wrap items-center gap-1.5 text-xs">
          <span className="eyebrow mr-1">Popular searches</span>
          {POPULAR_SEARCHES.map((q) => (
            <Link
              key={q}
              to="/browse"
              search={{ q }}
              className="inline-flex items-center rounded-full border border-border bg-surface px-2.5 py-1 font-mono text-ink-muted hover:border-border-strong hover:text-ink"
            >
              {q}
            </Link>
          ))}
        </div>
        <div className="mt-4 grid gap-4 stagger-children sm:grid-cols-2 lg:grid-cols-3">
          {popular.map((e) => (
            <ResourceCard key={e.slug} entry={e} variant="grid" />
          ))}
        </div>
      </section>

      {/* Compare-ready rail (was: source-backed dup) */}
      <section className="mx-auto max-w-[1400px] px-4 py-12 sm:px-6">
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
            <Link
              to="/compare"
              search={{ ids: sourceBacked.map((e) => `${e.category}/${e.slug}`).join(",") }}
              className="text-xs text-ink-muted hover:text-ink"
            >
              Open in compare →
            </Link>
          </div>
          <div className="divide-y divide-border">
            {sourceBacked.map((e) => (
              <ResourceCard key={e.slug} entry={e} />
            ))}
          </div>
          <div className="flex items-center justify-between border-t border-border bg-surface-2 px-5 py-3 text-xs text-ink-muted">
            <span>Pick any 4 to see install, trust, source, and platforms in one table.</span>
            <Link to="/compare" className="story-link font-medium text-ink">
              Build a comparison →
            </Link>
          </div>
        </div>
      </section>

      {/* Agent-native */}
      <AgentNativeStrip />

      {/* Two-up: new + pulse */}
      <section className="mx-auto grid max-w-[1400px] gap-8 px-4 py-6 sm:px-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <RailHeader
            eyebrow="New this week"
            title="Just added"
            icon={Sparkles}
            to="/browse"
            ctaLabel="Browse all"
          />
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {newest.map((e) => (
              <ResourceCard key={e.slug} entry={e} variant="grid" />
            ))}
          </div>
          {latestBrief && (
            <Link
              to="/brief"
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
          )}
        </div>
        <aside>
          <EcosystemPulse />
        </aside>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-[1400px] px-4 py-16 sm:px-6">
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
              <Link
                to="/submit"
                className="inline-flex h-10 items-center gap-1.5 rounded-md bg-accent px-4 text-sm font-semibold text-accent-ink hover:opacity-90"
              >
                Submit a resource <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/claim"
                className="inline-flex h-10 items-center rounded-md border border-background/20 px-4 text-sm font-medium hover:bg-background/10"
              >
                Claim listing
              </Link>
              <Link
                to="/api-docs"
                className="inline-flex h-10 items-center rounded-md border border-transparent px-2 text-sm font-medium text-background/70 hover:text-background"
              >
                Submission spec →
              </Link>
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
  to,
  ctaLabel = "See all",
  icon: Icon,
}: {
  eyebrow: string;
  title: string;
  to?: string;
  ctaLabel?: string;
  icon?: React.ElementType;
}) {
  return (
    <div className="flex items-end justify-between gap-4">
      <div>
        <div className="eyebrow flex items-center gap-1.5">
          {Icon ? <Icon className="h-3 w-3" /> : null}
          {eyebrow}
        </div>
        <h2 className="mt-1 h-display-2 text-ink text-balance">{title}</h2>
      </div>
      {to && (
        <Link to={to} className="text-sm text-ink-muted hover:text-ink">
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
}: {
  icon: React.ElementType;
  label: string;
  value: number;
  hint?: string;
  to?: string;
  search?: Record<string, string>;
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
      <Link to={to} search={search as never} className={cls}>
        {inner}
      </Link>
    );
  }
  return <div className={cls}>{inner}</div>;
}
