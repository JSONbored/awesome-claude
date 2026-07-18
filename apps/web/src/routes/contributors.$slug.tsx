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
import {
  CategoryPill,
  InstallRiskBadge,
  NotesPresenceChips,
  SourceBadge,
  TrustBadge,
} from "@/components/badges";
import { Monogram } from "@/components/monogram";
import { absoluteUrl } from "@/lib/seo";
import { stringifyJsonLd } from "@/lib/json-ld";
import { breadcrumbListJsonLd } from "@/lib/breadcrumb-jsonld-lib";
import { trackEvent } from "@/lib/analytics";
import {
  badgeChromeCategoryAnalyticsData,
  badgeChromeCategoryAnalyticsEvent,
  badgeChromeSourceAnalyticsData,
  badgeChromeSourceAnalyticsEvent,
  badgeChromeTrustAnalyticsData,
  badgeChromeTrustAnalyticsEvent,
} from "@/lib/badge-chrome-cta-events";
import {
  contributorProfileEntryAnalyticsData,
  contributorProfileEntryAnalyticsEvent,
  insightsPageEntryDestination,
} from "@/lib/insights-page-entry-cta-events";
import {
  contributorProfileCategoryAnalyticsData,
  contributorProfileCategoryAnalyticsEvent,
  contributorProfileGithubAnalyticsData,
  contributorProfileGithubAnalyticsEvent,
  contributorProfileIndexAnalyticsData,
  contributorProfileIndexAnalyticsEvent,
  contributorProfilePeerAnalyticsData,
  contributorProfilePeerAnalyticsEvent,
  contributorProfileSubmitAnalyticsData,
  contributorProfileSubmitAnalyticsEvent,
  contributorProfileSubmitterAnalyticsData,
  contributorProfileSubmitterAnalyticsEvent,
  contributorProfileTraceEgressAnalyticsData,
  contributorProfileTraceEgressAnalyticsEvent,
  contributorProfileStatAnalyticsData,
  contributorProfileStatAnalyticsEvent,
  contributorProfileStatDestination,
  contributorProfileIndexDestination,
  contributorProfileCategoryDestination,
  contributorProfileSubmitDestination,
  contributorProfilePeerDestination,
  type ContributorProfileStatId,
  type ContributorProfileTraceDestination,
} from "@/lib/contributor-profile-cta-events";
import { contributorPersonJsonLd } from "@/lib/contributor-person-jsonld-lib";
import { ogImageUrl } from "@/lib/og-image";
import { ogImageMetaTags } from "@/lib/og-meta-lib";
import { submitterAttribution } from "@/lib/contributor-profile-summary";
import type { Category, Contributor, Entry } from "@/types/registry";
import { categoryBreakdown } from "@/lib/contributor-category-breakdown-lib";

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
    const person = contributorPersonJsonLd(c, url, name);
    const profilePage = {
      "@context": "https://schema.org",
      "@type": "ProfilePage",
      url,
      mainEntity: { "@id": `${url}#person` },
    };
    const breadcrumbs = breadcrumbListJsonLd([
      { name: "Contributors", item: absoluteUrl("/contributors") },
      { name, item: url },
    ]);
    return {
      meta: [
        { title: `${name} — HeyClaude contributor` },
        { name: "description", content: description },
        { property: "og:title", content: `${name} — HeyClaude` },
        { property: "og:description", content: description },
        { property: "og:url", content: url },
        ...ogImageMetaTags(ogImage, "profile"),
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
  const peers = CONTRIBUTORS.filter((c) => c.slug !== contributor.slug);

  return (
    <div className="mx-auto max-w-[1100px] px-4 py-12 sm:px-6">
      <nav className="text-xs text-ink-muted">
        {(() => {
          const destination = contributorProfileIndexDestination("contributors");
          if (!destination) return <span className="hover:text-ink">Contributors</span>;
          return (
            <Link
              to={destination.to}
              onClick={() =>
                trackEvent(
                  contributorProfileIndexAnalyticsEvent(),
                  contributorProfileIndexAnalyticsData(contributor.slug, acceptedEntries.length),
                )
              }
              className="hover:text-ink"
            >
              Contributors
            </Link>
          );
        })()}
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
                onClick={() =>
                  trackEvent(
                    contributorProfileGithubAnalyticsEvent(),
                    contributorProfileGithubAnalyticsData(contributor.slug, acceptedEntries.length),
                  )
                }
                className="inline-flex items-center gap-1 rounded-md border border-border bg-surface px-2 py-0.5 text-ink-muted hover:text-ink"
              >
                <Github className="h-3 w-3" /> GitHub <ArrowUpRight className="h-3 w-3" />
              </a>
            )}
          </div>
        </div>
      </header>

      <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <ContributorStat
          icon={FileCheck2}
          label="Accepted"
          value={acceptedEntries.length}
          contributorSlug={contributor.slug}
          statId="accepted"
        />
        <ContributorStat
          icon={ShieldCheck}
          label="Reviewed"
          value={reviewedEntries.length}
          contributorSlug={contributor.slug}
          statId="reviewed"
        />
        <ContributorStat
          icon={Layers3}
          label="Categories"
          value={categorySummaries.length}
          contributorSlug={contributor.slug}
          statId="categories"
        />
        <ContributorStat
          icon={GitPullRequest}
          label="Source-linked"
          value={sourceLinkedCount}
          contributorSlug={contributor.slug}
          statId="source-linked"
        />
      </div>

      {categorySummaries.length > 0 && (
        <section id="category-credits" className="mt-10 scroll-mt-24">
          <h2 className="font-display text-xl font-semibold tracking-tight text-ink">
            Category Credits
          </h2>
          <div className="mt-4 flex flex-wrap gap-2">
            {categorySummaries.map((item) => {
              const destination = contributorProfileCategoryDestination(item.category);
              if (!destination) return null;
              return (
                <Link
                  key={item.category}
                  to={destination.to}
                  params={destination.params}
                  onClick={() =>
                    trackEvent(
                      contributorProfileCategoryAnalyticsEvent(),
                      contributorProfileCategoryAnalyticsData(
                        contributor.slug,
                        item.category,
                        item.count,
                      ),
                    )
                  }
                  className="inline-flex items-center gap-2 rounded-md border border-border bg-surface px-3 py-1.5 text-sm text-ink-muted hover:border-border-strong hover:text-ink"
                >
                  <CategoryPill>{item.category}</CategoryPill>
                  <span>{item.count}</span>
                </Link>
              );
            })}
          </div>
        </section>
      )}

      <ContributionSection
        id="accepted"
        title="Accepted Entries"
        entries={acceptedEntries}
        contributor={contributor}
        empty="No accepted entries yet."
      />

      <ContributionSection
        id="reviewed"
        title="Reviewed Entries"
        entries={reviewedEntries}
        contributor={contributor}
        role="reviewed"
        empty="No reviewed entries yet."
      />

      <div className="mt-12 rounded-xl border border-border bg-surface p-6 text-sm text-ink-muted">
        Want to contribute?{" "}
        {(() => {
          const destination = contributorProfileSubmitDestination("submit");
          if (!destination) return <span className="text-ink underline">Submit a resource</span>;
          return (
            <Link
              to={destination.to}
              onClick={() =>
                trackEvent(
                  contributorProfileSubmitAnalyticsEvent(),
                  contributorProfileSubmitAnalyticsData(contributor.slug, acceptedEntries.length),
                )
              }
              className="text-ink underline"
            >
              Submit a resource
            </Link>
          );
        })()}{" "}
        — every accepted entry credits its author and submitter.
      </div>

      <div className="mt-6 flex flex-wrap gap-2 text-xs text-ink-subtle">
        Other contributors:{" "}
        {peers.map((c, rowIndex) => {
          const destination = contributorProfilePeerDestination(c.slug);
          if (!destination) return null;
          return (
            <Link
              key={c.slug}
              to={destination.to}
              params={destination.params}
              onClick={() =>
                trackEvent(
                  contributorProfilePeerAnalyticsEvent(),
                  contributorProfilePeerAnalyticsData(
                    contributor.slug,
                    c.slug,
                    rowIndex,
                    peers.length,
                  ),
                )
              }
              className="text-ink-muted hover:text-ink"
            >
              {c.handle}
            </Link>
          );
        })}
      </div>
    </div>
  );
}

function ContributorStat({
  icon: Icon,
  label,
  value,
  contributorSlug,
  statId,
}: {
  icon: ElementType;
  label: string;
  value: number;
  contributorSlug: string;
  statId: ContributorProfileStatId;
}) {
  const destination = contributorProfileStatDestination(statId);
  return (
    <Link
      to={destination.to}
      params={destination.to === "/contributors/$slug" ? { slug: contributorSlug } : undefined}
      hash={destination.hash}
      search={destination.to === "/browse" ? destination.search : undefined}
      onClick={() =>
        trackEvent(
          contributorProfileStatAnalyticsEvent(),
          contributorProfileStatAnalyticsData(contributorSlug, statId, value),
        )
      }
      className="rounded-xl border border-border bg-surface p-4 transition-colors duration-200 ease-out hover:border-border-strong hover:bg-surface-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60"
    >
      <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-ink-subtle">
        <Icon className="h-3.5 w-3.5" aria-hidden />
        {label}
      </div>
      <div className="mt-2 font-display text-2xl font-semibold text-ink tabular-nums">{value}</div>
    </Link>
  );
}

function ContributionSection({
  id,
  title,
  entries,
  contributor,
  role,
  empty,
}: {
  id: string;
  title: string;
  entries: Entry[];
  contributor: Contributor;
  role?: "reviewed";
  empty?: string;
}) {
  return (
    <section id={id} className="mt-10 scroll-mt-24">
      <h2 className="font-display text-xl font-semibold tracking-tight text-ink">
        {title} ({entries.length})
      </h2>
      {entries.length === 0 ? (
        <p className="mt-3 text-sm text-ink-muted">{empty ?? "No entries yet."}</p>
      ) : (
        <div className="mt-4 divide-y divide-border overflow-hidden rounded-xl border border-border bg-surface">
          {entries.map((entry, rowIndex) => (
            <ContributionRow
              key={`${role ?? "accepted"}-${entry.category}-${entry.slug}`}
              entry={entry}
              contributor={contributor}
              role={role ?? contributorAcceptedEntryRole(contributor, entry) ?? "authored"}
              rowIndex={rowIndex}
              rowCount={entries.length}
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
  rowIndex,
  rowCount,
}: {
  entry: Entry;
  contributor: Contributor;
  role: ContributionRole;
  rowIndex: number;
  rowCount: number;
}) {
  const RoleIcon = roleIcon[role];
  const submitter = submitterAttribution(entry);

  return (
    <article className="group px-4 py-4 transition-colors duration-200 hover:bg-surface-2 sm:px-6">
      <div className="flex flex-wrap items-center gap-1.5">
        <span className="inline-flex items-center gap-1 rounded-md border border-border bg-background px-2 py-0.5 text-[11px] font-medium text-ink-muted">
          <RoleIcon className="h-3 w-3" aria-hidden />
          {roleLabel[role]}
        </span>
        <CategoryPill
          asLink
          category={entry.category}
          onNavigate={() =>
            trackEvent(
              badgeChromeCategoryAnalyticsEvent(),
              badgeChromeCategoryAnalyticsData(entry.category, "contributor-profile"),
            )
          }
        >
          {entry.category}
        </CategoryPill>
        <TrustBadge
          level={entry.trust}
          asLink
          onNavigate={() =>
            trackEvent(
              badgeChromeTrustAnalyticsEvent(),
              badgeChromeTrustAnalyticsData(entry.trust, "contributor-profile"),
            )
          }
        />
        <SourceBadge
          status={entry.source}
          asLink
          onNavigate={() =>
            trackEvent(
              badgeChromeSourceAnalyticsEvent(),
              badgeChromeSourceAnalyticsData(entry.source, "contributor-profile"),
            )
          }
        />
        <InstallRiskBadge entry={entry} size="xs" asLink surface="contributor-profile" />
        <NotesPresenceChips entry={entry} asLink surface="contributor-profile" />
      </div>

      <div className="mt-3">
        {(() => {
          const destination = insightsPageEntryDestination(entry.category, entry.slug);
          if (!destination) {
            return (
              <div className="inline-flex max-w-full flex-wrap items-baseline gap-x-2">
                <h3 className="font-display text-[15px] font-semibold tracking-tight text-ink">
                  {entry.title}
                </h3>
                <span className="hidden text-xs text-ink-subtle sm:inline">by {entry.author}</span>
              </div>
            );
          }
          return (
            <Link
              to={destination.to}
              params={destination.params}
              onClick={() =>
                trackEvent(
                  contributorProfileEntryAnalyticsEvent(),
                  contributorProfileEntryAnalyticsData(
                    entry.category,
                    entry.slug,
                    contributor.slug,
                    role,
                    rowIndex,
                    rowCount,
                  ),
                )
              }
              className="inline-flex max-w-full flex-wrap items-baseline gap-x-2"
            >
              <h3 className="font-display text-[15px] font-semibold tracking-tight text-ink group-hover:underline">
                {entry.title}
              </h3>
              <span className="hidden text-xs text-ink-subtle sm:inline">by {entry.author}</span>
            </Link>
          );
        })()}
        <p className="mt-1 line-clamp-2 max-w-3xl text-sm text-ink-muted">{entry.description}</p>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-ink-subtle">
        {submitter && (
          <span className="inline-flex items-center gap-1">
            <UserRound className="h-3 w-3" aria-hidden />
            submitted by{" "}
            {submitter.kind === "contributor" ? (
              (() => {
                const destination = contributorProfilePeerDestination(submitter.slug);
                if (!destination) return <span className="text-ink-muted">{submitter.label}</span>;
                return (
                  <Link
                    to={destination.to}
                    params={destination.params}
                    onClick={() =>
                      trackEvent(
                        contributorProfileSubmitterAnalyticsEvent(),
                        contributorProfileSubmitterAnalyticsData(
                          contributor.slug,
                          submitter.slug,
                          role,
                          rowIndex,
                          rowCount,
                        ),
                      )
                    }
                    className="text-ink-muted hover:text-ink"
                  >
                    {submitter.label}
                  </Link>
                );
              })()
            ) : submitter.kind === "external" ? (
              <a
                href={submitter.href}
                target="_blank"
                rel="noreferrer"
                onClick={() =>
                  trackEvent(
                    contributorProfileTraceEgressAnalyticsEvent(),
                    contributorProfileTraceEgressAnalyticsData(
                      contributor.slug,
                      "external-submitter",
                      role,
                      rowIndex,
                      rowCount,
                    ),
                  )
                }
                className="text-ink-muted hover:text-ink"
              >
                {submitter.label}
              </a>
            ) : (
              <span className="text-ink-muted">{submitter.label}</span>
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
            <ExternalTraceLink
              href={entry.sourceSubmissionUrl}
              label="Original submission"
              destination="original-submission"
              contributorSlug={contributor.slug}
              role={role}
              rowIndex={rowIndex}
              rowCount={rowCount}
            />
          )}
          {entry.importPrUrl && (
            <ExternalTraceLink
              href={entry.importPrUrl}
              label="Import PR"
              icon={GitPullRequest}
              destination="import-pr"
              contributorSlug={contributor.slug}
              role={role}
              rowIndex={rowIndex}
              rowCount={rowCount}
            />
          )}
          {entry.sourceUrl && (
            <ExternalTraceLink
              href={entry.sourceUrl}
              label="Source"
              icon={ArrowUpRight}
              destination="source"
              contributorSlug={contributor.slug}
              role={role}
              rowIndex={rowIndex}
              rowCount={rowCount}
            />
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
  destination,
  contributorSlug,
  role,
  rowIndex,
  rowCount,
}: {
  href: string;
  label: string;
  icon?: ElementType;
  destination: ContributorProfileTraceDestination;
  contributorSlug: string;
  role: string;
  rowIndex: number;
  rowCount: number;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      onClick={() =>
        trackEvent(
          contributorProfileTraceEgressAnalyticsEvent(),
          contributorProfileTraceEgressAnalyticsData(
            contributorSlug,
            destination,
            role,
            rowIndex,
            rowCount,
          ),
        )
      }
      className="inline-flex h-7 items-center gap-1 rounded-md border border-border bg-background px-2 text-ink-muted hover:border-border-strong hover:text-ink"
    >
      {label}
      <Icon className="h-3 w-3" aria-hidden />
    </a>
  );
}
