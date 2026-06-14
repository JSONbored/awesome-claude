import { createFileRoute, Link } from "@tanstack/react-router";
import { PageContainer } from "@/components/page-container";
import { absoluteUrl } from "@/lib/seo";
import { createServerFn } from "@tanstack/react-start";
import { useEffect, useMemo, useState } from "react";
import { ArrowUpRight, Search, Sparkles, X } from "lucide-react";
import type { JobListing, JobTier } from "@/types/registry";
import { cn } from "@/lib/utils";
import { JobCard } from "@/components/job-card";
import { isFresh, pickDailySpotlight, relativePosted, sortJobs } from "@/lib/jobs-utils";
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
      <button onClick={reset} className="mt-4 rounded-md border border-border px-4 py-2 text-sm">
        Try again
      </button>
    </div>
  ),
  component: JobsPage,
});

type RemoteFilter = "all" | "remote" | "onsite";
type SortMode = "default" | "newest" | "salary";

function normalizeJobListing(value: Partial<JobListing> & Record<string, unknown>): JobListing {
  const postedAt = String(value.postedAt || value.lastVerifiedAt || new Date(0).toISOString());
  return {
    slug: String(value.slug || ""),
    title: String(value.title || "Untitled role"),
    company: String(value.company || "Unknown company"),
    companyUrl: typeof value.companyUrl === "string" ? value.companyUrl : undefined,
    location: String(value.location || "Remote"),
    isRemote: Boolean(value.isRemote),
    isWorldwide: Boolean(value.isWorldwide),
    type: String(value.type || "Role"),
    postedAt,
    lastVerifiedAt: typeof value.lastVerifiedAt === "string" ? value.lastVerifiedAt : undefined,
    compensation: typeof value.compensation === "string" ? value.compensation : undefined,
    equity: typeof value.equity === "string" ? value.equity : undefined,
    bonus: typeof value.bonus === "string" ? value.bonus : undefined,
    description: String(value.description || ""),
    benefits: Array.isArray(value.benefits) ? value.benefits.map(String) : undefined,
    responsibilities: Array.isArray(value.responsibilities)
      ? value.responsibilities.map(String)
      : undefined,
    requirements: Array.isArray(value.requirements) ? value.requirements.map(String) : undefined,
    labels: Array.isArray(value.labels) ? value.labels.map(String) : undefined,
    applyUrl: typeof value.applyUrl === "string" ? value.applyUrl : undefined,
    tier: (value.tier as JobTier) || "free",
    sourceKind: value.sourceKind as JobListing["sourceKind"],
    sourceUrl: typeof value.sourceUrl === "string" ? value.sourceUrl : undefined,
    curationNote: typeof value.curationNote === "string" ? value.curationNote : undefined,
    featured: Boolean(value.featured),
    sponsored: Boolean(value.sponsored),
  };
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

  return (
    <PageContainer>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="min-w-0">
          <div className="eyebrow">Hiring</div>
          <h1 className="mt-2 h-display-1 text-ink text-balance">Roles building with Claude.</h1>
          <p className="mt-2 max-w-2xl text-ink-muted">
            Source-verified jobs from teams shipping agent workflows, MCP servers, and Claude Code
            platforms.
            <span className="ml-1 text-ink-subtle">
              {counts.total} open · {counts.remote} remote · {counts.fresh} this week.
            </span>
          </p>
        </div>
        <Link
          to="/jobs/post"
          className="inline-flex h-10 items-center gap-1.5 rounded-md bg-ink px-4 text-sm font-medium text-background hover:bg-ink/90"
        >
          Post a role <ArrowUpRight className="h-4 w-4" />
        </Link>
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
            onChange={(v) => setTier(v as JobTier | "all")}
          />
          <Segmented
            options={[
              { id: "all", label: "Any" },
              { id: "remote", label: "Remote" },
              { id: "onsite", label: "Onsite" },
            ]}
            value={remote}
            onChange={(v) => setRemote(v as RemoteFilter)}
          />
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
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
            onClick={() => setFreshOnly((v) => !v)}
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
            onClick={() => setFeaturedOnly((v) => !v)}
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
              onChange={(e) => setSortMode(e.target.value as SortMode)}
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
              onClick={() => {
                setQ("");
                setTier("all");
                setRemote("all");
                setType("all");
                setFreshOnly(false);
                setFeaturedOnly(false);
              }}
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
            {sorted.map((j) => (
              <JobCard key={j.slug} job={j} />
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
            {spotlight.current && (
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
                  <JobCard job={spotlight.current} variant="rail" />
                </div>
                <div className="mt-2 text-[10px] text-ink-subtle">
                  Posted {relativePosted(spotlight.current.postedAt)}
                  {spotlight.current.lastVerifiedAt ? " · employer verified" : ""}
                </div>
                {spotlight.next && (
                  <div className="mt-3 border-t border-border pt-2 text-[10px] text-ink-subtle">
                    Up next: <span className="text-ink-muted">{spotlight.next.title}</span>
                  </div>
                )}
              </div>
            )}

            <div className="rounded-xl border border-border bg-surface p-4 text-xs">
              <div className="eyebrow mb-2">Why post here</div>
              <ul className="space-y-1.5 text-ink-muted">
                <li>· Reaches Claude Code, MCP, and agent builders</li>
                <li>· Verified employer badge on every paid tier</li>
                <li>· Carried in the weekly brief and RSS feed</li>
              </ul>
              <Link
                to="/jobs/post"
                className="mt-3 inline-flex h-9 w-full items-center justify-center gap-1 rounded-md bg-ink text-xs font-medium text-background hover:bg-ink/90"
              >
                Post a role <ArrowUpRight className="h-3 w-3" />
              </Link>
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
