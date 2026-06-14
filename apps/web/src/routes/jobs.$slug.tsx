import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { absoluteUrl } from "@/lib/seo";
import { breadcrumbScript } from "@/lib/seo-jsonld";
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { NewsletterInline } from "@/components/newsletter-inline";
import { ArrowUpRight, MapPin, BadgeCheck, ArrowLeft } from "lucide-react";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { companyTint, monogram, relativePosted, sortJobs } from "@/lib/jobs-utils";
import { CopyButton } from "@/components/copy-button";
import type { ReactNode } from "react";
import type { ErrorComponentProps } from "@tanstack/react-router";
import type { JobListing, JobTier } from "@/types/registry";

const loadJobDetailData = createServerFn({ method: "GET" })
  .inputValidator(z.object({ slug: z.string().min(1) }))
  .handler(async ({ data }) => {
    const { buildPublicJobsIndex, getJobBySlug, getJobs, toPublicJobListing } =
      await import("@/lib/jobs");
    const { buildJobPostingJsonLd } = await import("@heyclaude/registry/seo");
    const { stringifyJsonLd } = await import("@/lib/json-ld");
    const [job, jobs] = await Promise.all([getJobBySlug(data.slug), getJobs()]);
    // Built from the raw job (has expiresAt/status); the builder returns null for missing
    // fields or non-active roles, so stale listings never get JobPosting markup. Stringified
    // here so the server fn returns a plain serializable string.
    const jobPostingLd = job
      ? buildJobPostingJsonLd(job as unknown as Record<string, unknown>)
      : null;
    return {
      job: job ? toPublicJobListing(job) : null,
      jobPostingLd: jobPostingLd ? stringifyJsonLd(jobPostingLd) : null,
      related: buildPublicJobsIndex(jobs.filter((item) => item.slug !== data.slug)).entries.slice(
        0,
        4,
      ),
    };
  });

export const Route = createFileRoute("/jobs/$slug")({
  loader: async ({ params }) => {
    const data = await loadJobDetailData({ data: { slug: params.slug } });
    // Unknown/filled/removed slugs return a real 404 (was a soft-404 at HTTP 200, wasting
    // crawl budget and emitting a self-canonical for a dead URL).
    if (!data.job) throw notFound();
    return {
      slug: params.slug,
      job: normalizeJobListing(data.job),
      related: data.related
        .map(normalizeJobListing)
        .filter((item) => item.slug)
        .slice(0, 4),
      jobPostingLd: data.jobPostingLd,
    };
  },
  head: ({ params, loaderData }) => {
    const job = loaderData?.job;
    if (!job) {
      // Not-found path: no canonical for a dead URL.
      return { meta: [{ title: "Role not found — HeyClaude jobs" }] };
    }
    const url = absoluteUrl(`/jobs/${params.slug}`);
    const title = `${job.title} at ${job.company}`;
    const description = job.description || "Source-verified role from the HeyClaude jobs board.";
    return {
      meta: [
        { title: `${title} — HeyClaude jobs` },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:url", content: url },
        { property: "og:type", content: "article" },
      ],
      links: [{ rel: "canonical", href: url }],
      scripts: [
        breadcrumbScript([
          { name: "Jobs", path: "/jobs" },
          { name: title, path: `/jobs/${params.slug}` },
        ]),
        ...(loaderData?.jobPostingLd
          ? [{ type: "application/ld+json", children: loaderData.jobPostingLd }]
          : []),
      ],
    };
  },
  errorComponent: ({ error, reset }: ErrorComponentProps) => (
    <div className="mx-auto max-w-xl px-4 py-16 text-center">
      <h1 className="font-display text-2xl text-ink">Couldn't load this role</h1>
      <p className="mt-2 text-sm text-ink-muted">{error.message}</p>
      <button onClick={reset} className="mt-4 rounded-md border border-border px-4 py-2 text-sm">
        Try again
      </button>
    </div>
  ),
  notFoundComponent: () => {
    const { slug } = Route.useParams();
    return (
      <div className="mx-auto max-w-xl px-4 py-16 text-center">
        <div className="eyebrow">404</div>
        <h1 className="mt-2 font-display text-3xl text-ink">Role not found</h1>
        <p className="mt-2 text-sm text-ink-muted">
          We couldn't find a role matching <code className="font-mono">{slug}</code>. It may have
          been filled or removed.
        </p>
        <Link
          to="/jobs"
          className="mt-5 inline-flex items-center gap-1.5 rounded-md bg-ink px-4 py-2 text-sm font-medium text-background hover:bg-ink/90"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Browse all jobs
        </Link>
      </div>
    );
  },
  component: JobDetail,
});

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

function JobDetail() {
  const { slug, job: initialJob, related } = Route.useLoaderData();
  const job = initialJob;
  const jobs: JobListing[] = initialJob ? [initialJob, ...related] : related;

  if (!job) {
    return (
      <div className="mx-auto max-w-xl px-4 py-16 text-center">
        <div className="eyebrow">404</div>
        <h1 className="mt-2 font-display text-3xl text-ink">Role not found</h1>
        <p className="mt-2 text-sm text-ink-muted">
          We couldn't find an active role matching {slug}. It may have been filled or removed.
        </p>
        <Link
          to="/jobs"
          className="mt-5 inline-flex items-center gap-1.5 rounded-md bg-ink px-4 py-2 text-sm font-medium text-background hover:bg-ink/90"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Browse all jobs
        </Link>
      </div>
    );
  }

  const tint = companyTint(job.company);
  const more = sortJobs(jobs.filter((j) => j.slug !== job.slug)).slice(0, 4);
  const shareUrl = typeof window !== "undefined" ? window.location.href : `/jobs/${job.slug}`;

  return (
    <div className="mx-auto max-w-[1100px] px-4 py-8 sm:px-6">
      <Breadcrumbs items={[{ label: "Jobs", to: "/jobs" }, { label: job.title }]} />

      <header className="mt-5 overflow-hidden rounded-xl border border-border bg-gradient-to-br from-surface to-accent/[0.04] surface-raised p-6">
        <div className="flex items-start gap-4">
          <div
            aria-hidden
            className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl font-display text-lg font-semibold"
            style={{ background: tint.bg, color: tint.fg }}
          >
            {monogram(job.company)}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-1.5 text-xs text-ink-muted">
              {job.companyUrl ? (
                <a
                  href={job.companyUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="font-medium text-ink transition-colors duration-200 ease-out hover:text-ink-hover"
                >
                  {job.company}
                </a>
              ) : (
                <span className="font-medium text-ink">{job.company}</span>
              )}
              <span>·</span>
              <span>{job.type}</span>
              {job.lastVerifiedAt && (
                <span className="inline-flex items-center gap-1 text-trust-trusted">
                  · <BadgeCheck className="h-3 w-3" /> verified {relativePosted(job.lastVerifiedAt)}
                </span>
              )}
            </div>
            <h1 className="mt-2 h-display-1 text-ink text-balance">{job.title}</h1>
            <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1.5 text-xs text-ink-muted">
              <span className="inline-flex items-center gap-1">
                <MapPin className="h-3 w-3" /> {job.location}
              </span>
              {job.isRemote && (
                <span className="rounded border border-border px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-wider">
                  Remote{job.isWorldwide ? " · worldwide" : ""}
                </span>
              )}
              {job.compensation && (
                <span>
                  · <span className="text-ink">{job.compensation}</span>
                </span>
              )}
              {job.equity && <span>· Equity: {job.equity}</span>}
              <span>· Posted {relativePosted(job.postedAt)}</span>
            </div>
          </div>
        </div>
      </header>

      <section className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_300px]">
        <div className="min-w-0 space-y-5">
          <Block title="About this role">
            <p className="text-sm leading-relaxed text-ink-muted">{job.description}</p>
          </Block>
          {job.responsibilities && (
            <Block title="What you'll do">
              <List items={job.responsibilities} />
            </Block>
          )}
          {job.requirements && (
            <Block title="Requirements">
              <List items={job.requirements} />
            </Block>
          )}
          {job.benefits && (
            <Block title="Benefits">
              <List items={job.benefits} />
            </Block>
          )}
        </div>

        <aside className="space-y-4 lg:sticky lg:top-4 lg:self-start">
          <div className="rounded-xl border border-border bg-surface p-4">
            {job.applyUrl && (
              <a
                href={job.applyUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex h-10 w-full items-center justify-center gap-1.5 rounded-md bg-ink px-4 text-sm font-medium text-background hover:bg-ink/90"
              >
                Apply on {job.company} <ArrowUpRight className="h-4 w-4" />
              </a>
            )}
            <div className="mt-3 flex gap-2">
              <CopyButton
                value={shareUrl}
                label="Copy link"
                size="sm"
                className="inline-flex h-9 flex-1 items-center justify-center gap-1.5 rounded-md border border-border bg-background px-3 text-xs text-ink-muted hover:text-ink"
              />
            </div>
            <p className="mt-3 text-[11px] leading-relaxed text-ink-subtle">
              You'll apply on {job.company}'s site. HeyClaude is not the employer.
            </p>
          </div>

          <div className="rounded-xl border border-border bg-surface p-4 text-xs text-ink-muted">
            <div className="eyebrow mb-2">Source</div>
            {job.sourceKind === "official_ats" && "Official ATS feed"}
            {job.sourceKind === "employer_careers" && "Employer careers page"}
            {job.sourceKind === "employer_submitted" && "Employer-submitted"}
            {job.sourceUrl && (
              <a
                href={job.sourceUrl}
                target="_blank"
                rel="noreferrer"
                className="mt-1.5 block truncate text-ink transition-colors duration-200 ease-out hover:text-ink-hover"
              >
                {job.sourceUrl}
              </a>
            )}
            {job.curationNote && <p className="mt-2 leading-relaxed">{job.curationNote}</p>}
          </div>

          {job.labels && job.labels.length > 0 && (
            <div className="rounded-xl border border-border bg-surface p-4">
              <div className="eyebrow mb-2">Tags</div>
              <div className="flex flex-wrap gap-1.5">
                {job.labels.map((l: string) => (
                  <span
                    key={l}
                    className="rounded-md border border-border bg-background px-2 py-0.5 text-xs text-ink-muted"
                  >
                    {l}
                  </span>
                ))}
              </div>
            </div>
          )}

          {more.length > 0 && (
            <div className="rounded-xl border border-border bg-surface p-4">
              <div className="eyebrow mb-2">More roles</div>
              <ul className="space-y-2.5">
                {more.map((m) => (
                  <li key={m.slug}>
                    <Link to="/jobs/$slug" params={{ slug: m.slug }} className="group block">
                      <div className="text-sm font-medium leading-snug text-ink transition-colors duration-200 ease-out group-hover:text-ink-hover">
                        {m.title}
                      </div>
                      <div className="text-xs text-ink-muted">
                        {m.company} · {relativePosted(m.postedAt)}
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
              <Link
                to="/jobs"
                className="mt-3 inline-flex items-center gap-1 text-xs text-ink-muted hover:text-ink"
              >
                See all roles <ArrowUpRight className="h-3 w-3" />
              </Link>
            </div>
          )}
        </aside>
      </section>

      <div className="mt-12">
        <NewsletterInline
          variant="quiet"
          title="Get new Claude roles by email"
          description="A weekly digest of verified, salary-disclosed roles. No recruiter spam."
          source="jobs-detail"
        />
      </div>
    </div>
  );
}

function Block({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="surface-raised rounded-xl border border-border bg-surface p-5">
      <h2 className="font-display text-base font-semibold tracking-tight text-ink">{title}</h2>
      <div className="prose-editorial mt-3 text-sm">{children}</div>
    </section>
  );
}

function List({ items }: { items: string[] }) {
  return (
    <ul className="space-y-1.5 text-sm text-ink-muted">
      {items.map((i) => (
        <li key={i} className="flex gap-2">
          <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-ink" />
          {i}
        </li>
      ))}
    </ul>
  );
}
