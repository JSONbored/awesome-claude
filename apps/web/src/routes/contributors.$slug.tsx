import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import type { ElementType } from "react";
import {
  ArrowUpRight,
  Calendar,
  FileCheck2,
  Github,
  GitPullRequest,
  Layers3,
  ShieldCheck,
  UserRound,
} from "lucide-react";
import {
  contributorAcceptedEntryRole,
  contributorReviewedEntry,
  getContributor,
  CONTRIBUTORS,
  type ContributorAcceptedEntryRole,
} from "@/data/contributors";
import { ENTRIES } from "@/data/entries";
import { CategoryPill, SourceBadge, TrustBadge } from "@/components/badges";
import { Monogram } from "@/components/monogram";
import { absoluteUrl } from "@/lib/seo";
import { stringifyJsonLd } from "@/lib/json-ld";
import { ogImageUrl } from "@/lib/og-image";
import type { Category, Contributor, Entry } from "@/types/registry";

export const Route = createFileRoute("/contributors/$slug")({
  loader: ({ params }) => {
    const contributor = getContributor(params.slug);
    if (!contributor) throw notFound();
    return { contributor };
  },
  head: ({ params, loaderData }) => {
    const c = loaderData?.contributor;
    if (!c) return { meta: [{ title: "Contributor — HeyClaude" }] };
    const url = absoluteUrl(`/contributors/${params.slug}`);
    const name = c.name ?? c.handle ?? params.slug;
    const description =
      c.bio ?? `Resources contributed to the HeyClaude registry by ${name} (@${c.handle}).`;
    const ogImage = ogImageUrl({ title: name, eyebrow: "Contributor", description });
    const person = {
      "@context": "https://schema.org",
      "@type": "Person",
      "@id": `${url}#person`,
      name,
      url,
      ...(c.handle ? { alternateName: `@${c.handle}` } : {}),
      ...(c.bio ? { description: c.bio } : {}),
      ...(c.github ? { sameAs: [c.github] } : {}),
    };
    const profilePage = {
      "@context": "https://schema.org",
      "@type": "ProfilePage",
      url,
      mainEntity: { "@id": `${url}#person` },
    };
    const breadcrumbs = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Contributors",
          item: absoluteUrl("/contributors"),
        },
        { "@type": "ListItem", position: 2, name, item: url },
      ],
    };
    return {
      meta: [
        { title: `${name} — HeyClaude contributor` },
        { name: "description", content: description },
        { property: "og:title", content: `${name} — HeyClaude` },
        { property: "og:description", content: description },
        { property: "og:url", content: url },
        { property: "og:image", content: ogImage },
        { property: "og:image:type", content: "image/png" },
        { property: "og:image:width", content: "1200" },
        { property: "og:image:height", content: "630" },
        { property: "og:type", content: "profile" },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:image", content: ogImage },
      ],
      links: [{ rel: "canonical", href: url }],
      scripts: [
        { type: "application/ld+json", children: stringifyJsonLd(person) },
        { type: "application/ld+json", children: stringifyJsonLd(profilePage) },
        { type: "application/ld+json", children: stringifyJsonLd(breadcrumbs) },
      ],
    };
  },
  component: ContributorPage,
});

function ContributorPage() {
  const { contributor } = Route.useLoaderData();
  const acceptedEntries = ENTRIES.filter((entry) =>
    contributorAcceptedEntryRole(contributor, entry),
  );
  const reviewedEntries = ENTRIES.filter((entry) => contributorReviewedEntry(contributor, entry));
  const categorySummaries = categoryBreakdown(acceptedEntries);
  const sourceLinkedCount = acceptedEntries.filter(
    (entry) => entry.sourceSubmissionUrl || entry.importPrUrl,
  ).length;

  return (
    <div className="mx-auto max-w-[1100px] px-4 py-12 sm:px-6">
      <nav className="text-xs text-ink-muted">
        <Link to="/contributors" className="hover:text-ink">
          Contributors
        </Link>
        <span className="mx-1.5">/</span>
        <span className="text-ink">{contributor.handle}</span>
      </nav>

      <header className="mt-6 flex flex-wrap items-start gap-6 border-b border-border pb-8">
        <Monogram name={contributor.name || contributor.handle} size={72} />
        <div className="flex-1">
          <div className="eyebrow">Contributor</div>
          <h1 className="mt-1 h-display-1 text-ink text-balance">{contributor.name}</h1>
          {contributor.bio && (
            <p className="mt-3 max-w-2xl text-pretty text-base text-ink-muted">{contributor.bio}</p>
          )}
          <div className="mt-4 flex flex-wrap items-center gap-2 text-xs">
            <span className="rounded-md border border-border bg-surface px-2 py-0.5 font-mono text-ink-muted">
              @{contributor.handle}
            </span>
            {contributor.github && (
              <a
                href={contributor.github}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 rounded-md border border-border bg-surface px-2 py-0.5 text-ink-muted hover:text-ink"
              >
                <Github className="h-3 w-3" /> GitHub <ArrowUpRight className="h-3 w-3" />
              </a>
            )}
          </div>
        </div>
      </header>

      <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <ContributorStat icon={FileCheck2} label="Accepted" value={acceptedEntries.length} />
        <ContributorStat icon={ShieldCheck} label="Reviewed" value={reviewedEntries.length} />
        <ContributorStat icon={Layers3} label="Categories" value={categorySummaries.length} />
        <ContributorStat icon={GitPullRequest} label="Source-linked" value={sourceLinkedCount} />
      </div>

      {categorySummaries.length > 0 && (
        <section className="mt-10">
          <h2 className="font-display text-xl font-semibold tracking-tight text-ink">
            Category Credits
          </h2>
          <div className="mt-4 flex flex-wrap gap-2">
            {categorySummaries.map((item) => (
              <Link
                key={item.category}
                to="/$category"
                params={{ category: item.category }}
                className="inline-flex items-center gap-2 rounded-md border border-border bg-surface px-3 py-1.5 text-sm text-ink-muted hover:border-border-strong hover:text-ink"
              >
                <CategoryPill>{item.category}</CategoryPill>
                <span>{item.count}</span>
              </Link>
            ))}
          </div>
        </section>
      )}

      <ContributionSection
        title="Accepted Entries"
        entries={acceptedEntries}
        contributor={contributor}
        empty="No accepted entries yet."
      />

      {reviewedEntries.length > 0 && (
        <ContributionSection
          title="Reviewed Entries"
          entries={reviewedEntries}
          contributor={contributor}
          role="reviewed"
        />
      )}

      <div className="mt-12 rounded-xl border border-border bg-surface p-6 text-sm text-ink-muted">
        Want to contribute?{" "}
        <Link to="/submit" className="text-ink underline">
          Submit a resource
        </Link>{" "}
        — every accepted entry credits its author and submitter.
      </div>

      <div className="mt-6 flex flex-wrap gap-2 text-xs text-ink-subtle">
        Other contributors:{" "}
        {CONTRIBUTORS.filter((c) => c.slug !== contributor.slug).map((c) => (
          <Link
            key={c.slug}
            to="/contributors/$slug"
            params={{ slug: c.slug }}
            className="text-ink-muted hover:text-ink"
          >
            {c.handle}
          </Link>
        ))}
      </div>
    </div>
  );
}

function categoryBreakdown(entries: Entry[]) {
  const counts = new Map<Category, number>();
  for (const entry of entries) {
    counts.set(entry.category, (counts.get(entry.category) ?? 0) + 1);
  }

  return [...counts.entries()]
    .map(([category, count]) => ({ category, count }))
    .sort((left, right) => right.count - left.count || left.category.localeCompare(right.category));
}

function ContributorStat({
  icon: Icon,
  label,
  value,
}: {
  icon: ElementType;
  label: string;
  value: number;
}) {
  return (
    <div className="rounded-xl border border-border bg-surface p-4">
      <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-ink-subtle">
        <Icon className="h-3.5 w-3.5" aria-hidden />
        {label}
      </div>
      <div className="mt-2 font-display text-2xl font-semibold text-ink tabular-nums">{value}</div>
    </div>
  );
}

function ContributionSection({
  title,
  entries,
  contributor,
  role,
  empty,
}: {
  title: string;
  entries: Entry[];
  contributor: Contributor;
  role?: "reviewed";
  empty?: string;
}) {
  return (
    <section className="mt-10">
      <h2 className="font-display text-xl font-semibold tracking-tight text-ink">
        {title} ({entries.length})
      </h2>
      {entries.length === 0 ? (
        <p className="mt-3 text-sm text-ink-muted">{empty ?? "No entries yet."}</p>
      ) : (
        <div className="mt-4 divide-y divide-border overflow-hidden rounded-xl border border-border bg-surface">
          {entries.map((entry) => (
            <ContributionRow
              key={`${role ?? "accepted"}-${entry.category}-${entry.slug}`}
              entry={entry}
              contributor={contributor}
              role={role ?? contributorAcceptedEntryRole(contributor, entry) ?? "authored"}
            />
          ))}
        </div>
      )}
    </section>
  );
}

type ContributionRole = ContributorAcceptedEntryRole | "reviewed";

const roleLabel: Record<ContributionRole, string> = {
  submitted: "Submitted",
  authored: "Authored",
  "submitted-authored": "Submitted + authored",
  reviewed: "Reviewed",
};

const roleIcon: Record<ContributionRole, ElementType> = {
  submitted: UserRound,
  authored: FileCheck2,
  "submitted-authored": FileCheck2,
  reviewed: ShieldCheck,
};

function ContributionRow({
  entry,
  contributor,
  role,
}: {
  entry: Entry;
  contributor: Contributor;
  role: ContributionRole;
}) {
  const RoleIcon = roleIcon[role];

  return (
    <article className="group px-4 py-4 transition-colors duration-200 hover:bg-surface-2 sm:px-6">
      <div className="flex flex-wrap items-center gap-1.5">
        <span className="inline-flex items-center gap-1 rounded-md border border-border bg-background px-2 py-0.5 text-[11px] font-medium text-ink-muted">
          <RoleIcon className="h-3 w-3" aria-hidden />
          {roleLabel[role]}
        </span>
        <CategoryPill>{entry.category}</CategoryPill>
        <TrustBadge level={entry.trust} />
        <SourceBadge status={entry.source} />
      </div>

      <div className="mt-3">
        <Link
          to="/entry/$category/$slug"
          params={{ category: entry.category, slug: entry.slug }}
          className="inline-flex max-w-full flex-wrap items-baseline gap-x-2"
        >
          <h3 className="font-display text-[15px] font-semibold tracking-tight text-ink group-hover:underline">
            {entry.title}
          </h3>
          <span className="hidden text-xs text-ink-subtle sm:inline">by {entry.author}</span>
        </Link>
        <p className="mt-1 line-clamp-2 max-w-3xl text-sm text-ink-muted">{entry.description}</p>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-ink-subtle">
        {entry.submittedBy && (
          <span className="inline-flex items-center gap-1">
            <UserRound className="h-3 w-3" aria-hidden />
            submitted by{" "}
            {entry.submittedByUrl ? (
              <a
                href={entry.submittedByUrl}
                target="_blank"
                rel="noreferrer"
                className="text-ink-muted hover:text-ink"
              >
                {entry.submittedBy}
              </a>
            ) : (
              <span className="text-ink-muted">{entry.submittedBy}</span>
            )}
          </span>
        )}
        {entry.submittedAt && (
          <span className="inline-flex items-center gap-1">
            <Calendar className="h-3 w-3" aria-hidden />
            {String(entry.submittedAt).slice(0, 10)}
          </span>
        )}
        {entry.reviewedBy && (
          <span className="inline-flex items-center gap-1">
            <ShieldCheck className="h-3 w-3" aria-hidden />
            reviewed by {entry.reviewedBy}
            {entry.reviewedAt ? ` on ${String(entry.reviewedAt).slice(0, 10)}` : ""}
          </span>
        )}
        {role === "authored" && (
          <span className="inline-flex items-center gap-1 text-ink-subtle">
            <FileCheck2 className="h-3 w-3" aria-hidden />
            credited to {contributor.name}
          </span>
        )}
      </div>

      {(entry.sourceSubmissionUrl || entry.importPrUrl || entry.sourceUrl) && (
        <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
          {entry.sourceSubmissionUrl && (
            <ExternalTraceLink href={entry.sourceSubmissionUrl} label="Original submission" />
          )}
          {entry.importPrUrl && (
            <ExternalTraceLink href={entry.importPrUrl} label="Import PR" icon={GitPullRequest} />
          )}
          {entry.sourceUrl && (
            <ExternalTraceLink href={entry.sourceUrl} label="Source" icon={ArrowUpRight} />
          )}
        </div>
      )}
    </article>
  );
}

function ExternalTraceLink({
  href,
  label,
  icon: Icon = ArrowUpRight,
}: {
  href: string;
  label: string;
  icon?: ElementType;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="inline-flex h-7 items-center gap-1 rounded-md border border-border bg-background px-2 text-ink-muted hover:border-border-strong hover:text-ink"
    >
      {label}
      <Icon className="h-3 w-3" aria-hidden />
    </a>
  );
}
