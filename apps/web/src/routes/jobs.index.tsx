import { createFileRoute, Link } from "@tanstack/react-router";
import { PageContainer } from "@/components/page-container";
import { absoluteUrl } from "@/lib/seo";
import { createServerFn } from "@tanstack/react-start";
import { useCallback, useEffect, useMemo, useState } from "react";
import { ArrowUpRight, Search, Sparkles, X } from "lucide-react";
import type { JobListing, JobTier } from "@/types/registry";
import { normalizeJobListing } from "@/lib/job-listing-lib";
import { cn } from "@/lib/utils";
import { JobCard } from "@/components/job-card";
import { isFresh, pickDailySpotlight, relativePosted, sortJobs } from "@/lib/jobs-utils";
import { trackEvent } from "@/lib/analytics";
import {
  jobsErrorRetryAnalyticsData,
  jobsErrorRetryAnalyticsEvent,
  jobsIndexFilterClearAnalyticsData,
  jobsIndexFilterClearAnalyticsEvent,
  jobsIndexFilterSelectAnalyticsData,
  jobsIndexFilterSelectAnalyticsEvent,
  jobsIndexJobAnalyticsData,
  jobsIndexJobAnalyticsEvent,
  jobsIndexPostAnalyticsData,
  jobsIndexPostAnalyticsEvent,
  jobsIndexSortSelectAnalyticsData,
  jobsIndexSortSelectAnalyticsEvent,
  jobsIndexStatAnalyticsData,
  jobsIndexStatAnalyticsEvent,
  jobsIndexStatFilterPatch,
  jobsIndexPostDestination,
  type JobsIndexFilterAxis,
  type JobsIndexStatId,
} from "@/lib/jobs-hub-cta-events";
import { NewsletterInline } from "@/components/newsletter-inline";
import type { ErrorComponentProps } from "@tanstack/react-router";

const loadPublicJobs = createServerFn({ method: "GET" }).handler(async () => {
  const { buildPublicJobsIndex, getJobs } = await import("@/lib/jobs");
  return buildPublicJobsIndex(await getJobs()).entries;
});

export const Route = createFileRoute("/jobs/")({
  loader: async () => {
    return {
      jobs: (await loadPublicJobs()).map(normalizeJobListing).filter((job) => job.slug),
    };
  },
  head: () => ({
    meta: [
      { title: "Claude & AI workflow jobs — HeyClaude" },
      {
        name: "description",
        content: "Source-verified roles building Claude Code, MCP servers, and agent workflows.",
      },
      { property: "og:title", content: "Claude & AI workflow jobs" },
      {
        property: "og:description",
        content: "Source-verified jobs for Claude Code, MCP, and agent workflows.",
      },
      { property: "og:url", content: absoluteUrl("/jobs") },
    ],
    links: [{ rel: "canonical", href: absoluteUrl("/jobs") }],
  }),
  errorComponent: ({ error, reset }: ErrorComponentProps) => (
    <div className="mx-auto max-w-xl px-4 py-16 text-center">
      <h1 className="font-display text-2xl text-ink">Couldn't load jobs</h1>
      <p className="mt-2 text-sm text-ink-muted">{error.message}</p>
      <button
        onClick={() => {
          trackEvent(jobsErrorRetryAnalyticsEvent(), jobsErrorRetryAnalyticsData("jobs-index"));
          reset();
        }}
        className="mt-4 rounded-md border border-border px-4 py-2 text-sm"
      >
        Try again
      </button>
    </div>
  ),
  component: JobsPage,
});

type RemoteFilter = "all" | "remote" | "onsite";
type SortMode = "default" | "newest" | "salary";

type JobsFilterState = {
  q: string;
  tier: JobTier | "all";
  remote: RemoteFilter;
  type: string;
  freshOnly: boolean;
  featuredOnly: boolean;
};

function countJobsForFilters(jobs: JobListing[], slice: Partial<JobsFilterState>) {
  const q = slice.q ?? "";
  const tier = slice.tier ?? "all";
  const remote = slice.remote ?? "all";
  const type = slice.type ?? "all";
  const freshOnly = slice.freshOnly ?? false;
  const featuredOnly = slice.featuredOnly ?? false;

  return jobs.filter((j) => {
    if (tier !== "all" && j.tier !== tier) return false;
    if (remote === "remote" && !j.isRemote) return false;
    if (remote === "onsite" && j.isRemote) return false;
    if (type !== "all" && j.type !== type) return false;
    if (freshOnly && !isFresh(j.postedAt)) return false;
    if (featuredOnly && j.tier !== "featured" && j.tier !== "sponsored") return false;
    if (!q) return true;
    const blob = [j.title, j.company, j.location, j.description, j.type, j.labels?.join(" ")]
      .join(" ")
      .toLowerCase();
    return blob.includes(q.toLowerCase());
  }).length;
}

function activeJobsFilterCount(filters: JobsFilterState): number {
  let count = 0;
  if (filters.q) count++;
  if (filters.tier !== "all") count++;
  if (filters.remote !== "all") count++;
  if (filters.type !== "all") count++;
  if (filters.freshOnly) count++;
  if (filters.featuredOnly) count++;
  return count;
}

function JobsPage() {
  const loaderData = Route.useLoaderData();
  const [jobs, setJobs] = useState<JobListing[]>(loaderData.jobs);
  const [loadingJobs, setLoadingJobs] = useState(loaderData.jobs.length === 0);
  const [q, setQ] = useState("");
  const [tier, setTier] = useState<JobTier | "all">("all");
  const [remote, setRemote] = useState<RemoteFilter>("all");
  const [type, setType] = useState<string>("all");
  const [freshOnly, setFreshOnly] = useState(false);
  const [featuredOnly, setFeaturedOnly] = useState(false);
  const [sortMode, setSortMode] = useState<SortMode>("default");

  useEffect(() => {
    let cancelled = false;
    async function loadJobs() {
      try {
        const response = await fetch("/api/jobs?limit=100", {
          headers: { accept: "application/json" },
        });
        if (!response.ok) throw new Error(`jobs API returned ${response.status}`);
        const payload = (await response.json()) as {
          entries?: Array<Partial<JobListing> & Record<string, unknown>>;
        };
        if (!cancelled)
          setJobs((payload.entries ?? []).map(normalizeJobListing).filter((job) => job.slug));
      } catch {
        if (!cancelled) setJobs([]);
      } finally {
        if (!cancelled) setLoadingJobs(false);
      }
    }
    void loadJobs();
    return () => {
      cancelled = true;
    };
  }, []);

  const allTypes = useMemo(() => Array.from(new Set(jobs.map((j) => j.type))).sort(), [jobs]);

  const filtered = useMemo(() => {
    return jobs.filter((j) => {
      if (tier !== "all" && j.tier !== tier) return false;
      if (remote === "remote" && !j.isRemote) return false;
      if (remote === "onsite" && j.isRemote) return false;
      if (type !== "all" && j.type !== type) return false;
      if (freshOnly && !isFresh(j.postedAt)) return false;
      if (featuredOnly && j.tier !== "featured" && j.tier !== "sponsored") return false;
      if (!q) return true;
      const blob = [j.title, j.company, j.location, j.description, j.type, j.labels?.join(" ")]
        .join(" ")
        .toLowerCase();
      return blob.includes(q.toLowerCase());
    });
  }, [jobs, q, tier, remote, type, freshOnly, featuredOnly]);

  const sorted = useMemo(() => {
    if (sortMode === "newest") {
      return [...filtered].sort((a, b) => b.postedAt.localeCompare(a.postedAt));
    }
    if (sortMode === "salary") {
      const sval = (j: JobListing) => {
        if (!j.compensation) return -1;
        const m = j.compensation.match(/\$?(\d[\d,]*)k?/i);
        return m ? parseInt(m[1].replace(/,/g, ""), 10) : 0;
      };
      return [...filtered].sort((a, b) => sval(b) - sval(a));
    }
    return sortJobs(filtered);
  }, [filtered, sortMode]);

  const spotlight = useMemo(() => pickDailySpotlight(jobs), [jobs]);

  // Counts for facets
  const counts = useMemo(() => {
    const base = (extra: (j: JobListing) => boolean) => jobs.filter(extra).length;
    return {
      total: jobs.length,
      remote: base((j) => !!j.isRemote),
      fresh: base((j) => isFresh(j.postedAt)),
      featured: base((j) => j.tier === "featured" || j.tier === "sponsored"),
      byTier: {
        featured: base((j) => j.tier === "featured"),
        standard: base((j) => j.tier === "standard"),
        free: base((j) => j.tier === "free"),
      },
    };
  }, [jobs]);

  const hasFilters =
    q || tier !== "all" || remote !== "all" || type !== "all" || freshOnly || featuredOnly;

  const filterState = useMemo(
    () => ({ q, tier, remote, type, freshOnly, featuredOnly }),
    [q, tier, remote, type, freshOnly, featuredOnly],
  );

  const countForFilters = useCallback(
    (slice: Partial<JobsFilterState>) => countJobsForFilters(jobs, { ...filterState, ...slice }),
    [filterState, jobs],
  );

  const onFilterSelect = useCallback(
    (
      axis: JobsIndexFilterAxis,
      value: string,
      active: boolean,
      slice: Partial<JobsFilterState>,
    ) => {
      trackEvent(
        jobsIndexFilterSelectAnalyticsEvent(),
        jobsIndexFilterSelectAnalyticsData(
          axis,
          value,
          active,
          countForFilters(slice),
          jobs.length,
        ),
      );
    },
    [countForFilters, jobs.length],
  );

  const onTierFilter = useCallback(
    (value: string) => {
      const next = value as JobTier | "all";
      if (next === tier) return;
      onFilterSelect("tier", next, next !== "all", { tier: next });
      setTier(next);
    },
    [onFilterSelect, tier],
  );

  const onRemoteFilter = useCallback(
    (value: string) => {
      const next = value as RemoteFilter;
      if (next === remote) return;
      onFilterSelect("remote", next, next !== "all", { remote: next });
      setRemote(next);
    },
    [onFilterSelect, remote],
  );

  const onTypeFilter = useCallback(
    (value: string) => {
      if (value === type) return;
      onFilterSelect("type", value, value !== "all", { type: value });
      setType(value);
    },
    [onFilterSelect, type],
  );

  const onFreshToggle = useCallback(() => {
    const next = !freshOnly;
    onFilterSelect("fresh", next ? "on" : "off", next, { freshOnly: next });
    setFreshOnly(next);
  }, [freshOnly, onFilterSelect]);

  const onFeaturedToggle = useCallback(() => {
    const next = !featuredOnly;
    onFilterSelect("featured", next ? "on" : "off", next, { featuredOnly: next });
    setFeaturedOnly(next);
  }, [featuredOnly, onFilterSelect]);

  const onSortSelect = useCallback(
    (value: SortMode) => {
      if (value === sortMode) return;
      trackEvent(
        jobsIndexSortSelectAnalyticsEvent(),
        jobsIndexSortSelectAnalyticsData(value, filtered.length, jobs.length),
      );
      setSortMode(value);
    },
    [filtered.length, jobs.length, sortMode],
  );

  const onClearFilters = useCallback(() => {
    trackEvent(
      jobsIndexFilterClearAnalyticsEvent(),
      jobsIndexFilterClearAnalyticsData(
        activeJobsFilterCount(filterState),
        jobs.length,
        jobs.length,
      ),
    );
    setQ("");
    setTier("all");
    setRemote("all");
    setType("all");
    setFreshOnly(false);
    setFeaturedOnly(false);
  }, [filterState, jobs.length]);

  const onStatClick = useCallback(
    (statId: JobsIndexStatId, count: number) => {
      const patch = jobsIndexStatFilterPatch(statId);
      if (!patch) return;
      trackEvent(
        jobsIndexStatAnalyticsEvent(),
        jobsIndexStatAnalyticsData(statId, count, jobs.length),
      );
      if (patch.q !== undefined) setQ(patch.q);
      if (patch.tier !== undefined) setTier(patch.tier as JobTier | "all");
      if (patch.remote !== undefined) setRemote(patch.remote as RemoteFilter);
      if (patch.type !== undefined) setType(patch.type);
      if (patch.freshOnly !== undefined) setFreshOnly(patch.freshOnly);
      if (patch.featuredOnly !== undefined) setFeaturedOnly(patch.featuredOnly);
    },
    [jobs.length],
  );

  const headlineStats: Array<{ id: JobsIndexStatId; label: string; count: number }> = [
    { id: "total", label: "Open roles", count: counts.total },
    { id: "remote", label: "Remote", count: counts.remote },
    { id: "fresh", label: "This week", count: counts.fresh },
    { id: "featured", label: "Featured", count: counts.featured },
  ];

  return (
    <PageContainer>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="min-w-0">
          <div className="eyebrow">Hiring</div>
          <h1 className="mt-2 h-display-1 text-ink text-balance">Roles building with Claude.</h1>
          <p className="mt-2 max-w-2xl text-ink-muted">
            Source-verified jobs from teams shipping agent workflows, MCP servers, and Claude Code
            platforms. Click a headline stat to focus the board.
          </p>
        </div>
        {(() => {
          const destination = jobsIndexPostDestination("post");
          if (!destination) return null;
          return (
            <Link
              to={destination.to}
              onClick={() =>
                trackEvent(
                  jobsIndexPostAnalyticsEvent(),
                  jobsIndexPostAnalyticsData(jobs.length, "header"),
                )
              }
              className="inline-flex h-10 items-center gap-1.5 rounded-md bg-ink px-4 text-sm font-medium text-background hover:bg-ink/90"
            >
              Post a role <ArrowUpRight className="h-4 w-4" />
            </Link>
          );
        })()}
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {headlineStats.map((stat) => (
          <button
            key={stat.id}
            type="button"
            onClick={() => onStatClick(stat.id, stat.count)}
            className="rounded-xl border border-border bg-surface p-4 text-left transition-colors duration-200 ease-out hover:border-border-strong hover:bg-surface-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60"
          >
            <div className="text-xs uppercase tracking-wider text-ink-subtle">{stat.label}</div>
            <div className="mt-2 font-display text-2xl font-semibold tabular-nums text-ink">
              {stat.count}
            </div>
          </button>
        ))}
      </div>

      {/* Sticky filter bar */}
      <div className="sticky top-0 z-20 -mx-4 mt-8 bg-background/80 px-4 py-2 backdrop-blur sm:-mx-6 sm:px-6">
        <div className="flex flex-wrap items-center gap-2 rounded-xl border border-border bg-surface p-2.5">
          <div className="relative min-w-[200px] flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-ink-subtle" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search title, company, stack…"
              aria-label="Search jobs by title, company, or stack"
              className="h-9 w-full rounded-md border border-border bg-background pl-8 pr-3 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-accent/40"
            />
          </div>
          <Segmented
            options={[
              { id: "all", label: `All · ${counts.total}` },
              { id: "featured", label: `Featured · ${counts.byTier.featured}` },
              { id: "standard", label: `Standard · ${counts.byTier.standard}` },
              { id: "free", label: `Community · ${counts.byTier.free}` },
            ]}
            value={tier}
            onChange={onTierFilter}
          />
          <Segmented
            options={[
              { id: "all", label: "Any" },
              { id: "remote", label: "Remote" },
              { id: "onsite", label: "Onsite" },
            ]}
            value={remote}
            onChange={onRemoteFilter}
          />
          <select
            value={type}
            onChange={(e) => onTypeFilter(e.target.value)}
            aria-label="Filter by job type"
            className="h-9 rounded-md border border-border bg-background px-2 text-xs text-ink-muted focus:outline-none focus:ring-2 focus:ring-accent/40"
          >
            <option value="all">Any type</option>
            {allTypes.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
          <button
            type="button"
            onClick={onFreshToggle}
            className={cn(
              "h-9 rounded-md border px-2.5 text-xs font-medium transition-colors duration-200 ease-out",
              freshOnly
                ? "border-accent bg-accent text-accent-ink"
                : "border-border bg-background text-ink-muted hover:text-ink",
            )}
          >
            is:fresh · {counts.fresh}
          </button>
          <button
            type="button"
            onClick={onFeaturedToggle}
            className={cn(
              "h-9 rounded-md border px-2.5 text-xs font-medium transition-colors duration-200 ease-out",
              featuredOnly
                ? "border-accent bg-accent text-accent-ink"
                : "border-border bg-background text-ink-muted hover:text-ink",
            )}
          >
            Featured only · {counts.featured}
          </button>
          <div className="ml-auto flex items-center gap-1.5">
            <span className="text-[10px] uppercase tracking-wider text-ink-subtle">Sort</span>
            <select
              value={sortMode}
              onChange={(e) => onSortSelect(e.target.value as SortMode)}
              className="h-9 rounded-md border border-border bg-background px-2 text-xs text-ink-muted focus:outline-none focus:ring-2 focus:ring-accent/40"
            >
              <option value="default">Featured first</option>
              <option value="newest">Newest</option>
              <option value="salary">Salary</option>
            </select>
          </div>
          {hasFilters && (
            <button
              type="button"
              onClick={onClearFilters}
              className="inline-flex h-9 items-center gap-1 rounded-md px-2 text-xs text-ink-muted hover:text-ink"
            >
              <X className="h-3 w-3" /> Clear
            </button>
          )}
        </div>
      </div>

      {/* Main two-column layout: list + spotlight rail */}
      <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_300px]">
        <section className="min-w-0">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="eyebrow">{hasFilters ? "Results" : "All roles"}</h2>
            <span className="text-xs text-ink-subtle">
              {sorted.length} role{sorted.length === 1 ? "" : "s"}
            </span>
          </div>
          <div className="space-y-2.5">
            {sorted.map((j, rowIndex) => (
              <JobCard
                key={j.slug}
                job={j}
                onNavigate={() =>
                  trackEvent(
                    jobsIndexJobAnalyticsEvent(),
                    jobsIndexJobAnalyticsData(j.slug, j.tier, rowIndex, sorted.length, "row"),
                  )
                }
              />
            ))}
            {sorted.length === 0 && (
              <div className="rounded-xl border border-dashed border-border bg-surface px-5 py-12 text-center text-sm text-ink-muted">
                {loadingJobs ? "Loading active roles..." : "No roles match these filters."}
              </div>
            )}
          </div>

          <div className="mt-8">
            <NewsletterInline
              variant="quiet"
              title="Get new Claude roles by email"
              description="A short, weekly digest of newly verified roles. No recruiter spam."
              source="jobs-index"
            />
          </div>
        </section>

        {/* Spotlight rail */}
        <aside className="hidden min-w-0 lg:block">
          <div className="sticky top-24 space-y-5">
            {(() => {
              const current = spotlight.current;
              if (!current) return null;
              return (
                <div className="rounded-xl border border-accent/30 bg-gradient-to-br from-surface to-accent/[0.06] p-4">
                  <div className="flex items-center gap-1.5">
                    <Sparkles className="h-3.5 w-3.5 text-accent-ink" />
                    <span className="font-mono text-[10px] uppercase tracking-wider text-accent-ink">
                      In the spotlight
                    </span>
                  </div>
                  <p className="mt-1 text-[11px] text-ink-muted">
                    Rotates daily from verified, salary-disclosed, remote-friendly roles.
                  </p>
                  <div className="mt-3">
                    <JobCard
                      job={current}
                      variant="rail"
                      onNavigate={() =>
                        trackEvent(
                          jobsIndexJobAnalyticsEvent(),
                          jobsIndexJobAnalyticsData(
                            current.slug,
                            current.tier,
                            0,
                            jobs.length,
                            "rail",
                          ),
                        )
                      }
                    />
                  </div>
                  <div className="mt-2 text-[10px] text-ink-subtle">
                    Posted {relativePosted(current.postedAt)}
                    {current.lastVerifiedAt ? " · employer verified" : ""}
                  </div>
                  {spotlight.next && (
                    <div className="mt-3 border-t border-border pt-2 text-[10px] text-ink-subtle">
                      Up next: <span className="text-ink-muted">{spotlight.next.title}</span>
                    </div>
                  )}
                </div>
              );
            })()}

            <div className="rounded-xl border border-border bg-surface p-4 text-xs">
              <div className="eyebrow mb-2">Why post here</div>
              <ul className="space-y-1.5 text-ink-muted">
                <li>· Reaches Claude Code, MCP, and agent builders</li>
                <li>· Verified employer badge on every paid tier</li>
                <li>· Carried in the weekly brief and RSS feed</li>
              </ul>
              {(() => {
                const destination = jobsIndexPostDestination("post");
                if (!destination) return null;
                return (
                  <Link
                    to={destination.to}
                    onClick={() =>
                      trackEvent(
                        jobsIndexPostAnalyticsEvent(),
                        jobsIndexPostAnalyticsData(jobs.length, "sidebar"),
                      )
                    }
                    className="mt-3 inline-flex h-9 w-full items-center justify-center gap-1 rounded-md bg-ink text-xs font-medium text-background hover:bg-ink/90"
                  >
                    Post a role <ArrowUpRight className="h-3 w-3" />
                  </Link>
                );
              })()}
            </div>
          </div>
        </aside>
      </div>
    </PageContainer>
  );
}

function Segmented({
  options,
  value,
  onChange,
}: {
  options: { id: string; label: string }[];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="inline-flex rounded-md border border-border bg-background p-0.5">
      {options.map((o) => (
        <button
          key={o.id}
          type="button"
          onClick={() => onChange(o.id)}
          className={cn(
            "rounded px-2.5 py-1 text-xs font-medium transition-colors duration-200 ease-out",
            value === o.id ? "bg-ink text-background" : "text-ink-muted hover:text-ink",
          )}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}
