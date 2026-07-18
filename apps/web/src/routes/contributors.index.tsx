import { createFileRoute, Link } from "@tanstack/react-router";
import { Github } from "lucide-react";
import { CONTRIBUTORS } from "@/data/contributors";
import { trackEvent } from "@/lib/analytics";
import {
  contributorsIndexFeaturedProfileAnalyticsData,
  contributorsIndexFeaturedProfileAnalyticsEvent,
  contributorsIndexGithubAnalyticsData,
  contributorsIndexGithubAnalyticsEvent,
  contributorsIndexProfileAnalyticsData,
  contributorsIndexProfileAnalyticsEvent,
  contributorsIndexStatAnalyticsData,
  contributorsIndexStatAnalyticsEvent,
  contributorsIndexStatDestination,
  contributorsIndexSubmitAnalyticsData,
  contributorsIndexSubmitAnalyticsEvent,
  contributorsIndexProfileDestination,
  contributorsIndexSubmitDestination,
  type ContributorsIndexStatId,
} from "@/lib/contributors-index-cta-events";
import { contributorCardSummary } from "@/lib/contributor-profile-summary";
import { PageContainer } from "@/components/page-container";
import { PageHeader } from "@/components/page-header";
import { Monogram } from "@/components/monogram";
import { breadcrumbScript, itemListScript } from "@/lib/seo-jsonld";
import { absoluteUrl } from "@/lib/seo";
import { ogImageUrl } from "@/lib/og-image";

// Same card for og:image and twitter:image; the inputs are static.
const OG_IMAGE = ogImageUrl({ title: "Contributors", eyebrow: "HeyClaude" });

export const Route = createFileRoute("/contributors/")({
  head: () => ({
    meta: [
      { title: "Contributors — HeyClaude" },
      { name: "description", content: "People whose submissions power the HeyClaude registry." },
      { property: "og:title", content: "Contributors — HeyClaude" },
      { property: "og:description", content: "Provenance is preserved on every entry." },
      { property: "og:url", content: absoluteUrl("/contributors") },
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
    links: [{ rel: "canonical", href: absoluteUrl("/contributors") }],
    scripts: [
      breadcrumbScript([
        { name: "Directory", path: "/browse" },
        { name: "Contributors", path: "/contributors" },
      ]),
      itemListScript(
        CONTRIBUTORS.map((c) => ({
          name: c.name ?? c.slug,
          path: `/contributors/${c.slug}`,
        })),
        { name: "HeyClaude contributors" },
      ),
    ],
  }),
  component: ContributorsPage,
});

function ContributorsPage() {
  const sorted = [...CONTRIBUTORS].sort((a, b) => b.acceptedCount - a.acceptedCount);
  const top = sorted[0];
  const rest = sorted.slice(1);
  const total = sorted.reduce((s, c) => s + c.acceptedCount, 0);

  const headlineStats: Array<{ id: ContributorsIndexStatId; label: string; value: number }> = [
    { id: "contributors", label: "Contributors", value: sorted.length },
    { id: "accepted-entries", label: "Accepted entries", value: total },
  ];

  return (
    <PageContainer>
      <PageHeader
        eyebrow="People"
        title="Contributors"
        description="Derived from accepted submissions. Provenance is preserved on every entry."
      />

      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        {headlineStats.map((stat) => {
          const destination = contributorsIndexStatDestination(stat.id);
          if (!destination) return null;
          return (
            <Link
              key={stat.id}
              to={destination.to}
              hash={destination.hash}
              onClick={() =>
                trackEvent(
                  contributorsIndexStatAnalyticsEvent(),
                  contributorsIndexStatAnalyticsData(stat.id, stat.value, sorted.length, total),
                )
              }
              className="rounded-xl border border-border bg-surface p-4 transition-colors duration-200 ease-out hover:border-border-strong hover:bg-surface-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60"
            >
              <div className="text-xs uppercase tracking-wider text-ink-subtle">{stat.label}</div>
              <div className="mt-2 font-display text-2xl font-semibold tabular-nums text-ink">
                {stat.value}
              </div>
            </Link>
          );
        })}
      </div>

      {top &&
        (() => {
          const destination = contributorsIndexProfileDestination(top.slug);
          if (!destination) return null;
          return (
            <div className="mt-8 surface-raised rounded-xl border border-accent/30 bg-gradient-to-br from-surface to-accent/[0.06] p-6">
              <div className="eyebrow text-accent-ink dark:text-accent">Top contributor</div>
              <div className="mt-3 flex items-center gap-4">
                <Link
                  to={destination.to}
                  params={destination.params}
                  onClick={() =>
                    trackEvent(
                      contributorsIndexFeaturedProfileAnalyticsEvent(),
                      contributorsIndexFeaturedProfileAnalyticsData(
                        top.slug,
                        top.acceptedCount,
                        sorted.length,
                      ),
                    )
                  }
                  className="flex min-w-0 flex-1 items-center gap-4 rounded-lg outline-none transition-colors focus-visible:ring-2 focus-visible:ring-accent/60"
                >
                  <Monogram name={top.name || top.handle} size={56} className="rounded-full" />
                  <div className="min-w-0 flex-1">
                    <div className="font-display text-xl font-semibold text-ink">{top.name}</div>
                    <div className="text-sm text-ink-muted">
                      @{top.handle} · {contributorCardSummary(top)}
                    </div>
                    {top.bio && <p className="mt-1 text-sm text-ink-muted">{top.bio}</p>}
                  </div>
                </Link>
                {top.github && (
                  <a
                    href={top.github}
                    target="_blank"
                    rel="noreferrer"
                    onClick={() =>
                      trackEvent(
                        contributorsIndexGithubAnalyticsEvent(),
                        contributorsIndexGithubAnalyticsData(
                          top.slug,
                          top.acceptedCount,
                          "featured",
                          null,
                          sorted.length,
                        ),
                      )
                    }
                    className="inline-flex h-9 shrink-0 items-center gap-1.5 rounded-md border border-border bg-background px-3 text-sm text-ink hover:bg-surface-2"
                  >
                    <Github className="h-3.5 w-3.5" /> GitHub
                  </a>
                )}
              </div>
            </div>
          );
        })()}

      <div
        id="contributor-grid"
        className="mt-8 grid scroll-mt-24 gap-3 stagger-children sm:grid-cols-2 lg:grid-cols-3"
      >
        {rest.map((c, rowIndex) => {
          const destination = contributorsIndexProfileDestination(c.slug);
          if (!destination) return null;
          return (
            <Link
              key={c.slug}
              to={destination.to}
              params={destination.params}
              onClick={() =>
                trackEvent(
                  contributorsIndexProfileAnalyticsEvent(),
                  contributorsIndexProfileAnalyticsData(
                    c.slug,
                    c.acceptedCount,
                    rowIndex,
                    sorted.length,
                  ),
                )
              }
              className="group hover-lift flex items-center gap-3 rounded-xl border border-border bg-surface p-4 transition-[border-color,background-color] duration-200 ease-out hover:border-ink/20 hover:bg-surface-2"
            >
              <Monogram name={c.name || c.handle} size={40} className="rounded-full" />
              <div className="min-w-0 flex-1">
                <div className="truncate font-display text-sm font-semibold text-ink transition-colors duration-200 ease-out group-hover:text-ink-hover">
                  {c.name}
                </div>
                <div className="truncate text-xs text-ink-muted">
                  @{c.handle} · {contributorCardSummary(c)}
                </div>
              </div>
              {c.github && (
                <a
                  href={c.github}
                  target="_blank"
                  rel="noreferrer"
                  onClick={(e) => {
                    e.stopPropagation();
                    trackEvent(
                      contributorsIndexGithubAnalyticsEvent(),
                      contributorsIndexGithubAnalyticsData(
                        c.slug,
                        c.acceptedCount,
                        "card",
                        rowIndex,
                        sorted.length,
                      ),
                    );
                  }}
                  className="text-ink-subtle hover:text-ink"
                  aria-label={`${c.handle} on GitHub`}
                >
                  <Github className="h-3.5 w-3.5" />
                </a>
              )}
            </Link>
          );
        })}
      </div>

      <div className="mt-10 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border bg-surface p-6">
        <div>
          <h2 className="font-display text-lg font-semibold text-ink">Want to be on this list?</h2>
          <p className="mt-1 max-w-md text-sm text-ink-muted">
            Submit a resource you've built or curated. Maintainer review is required, but provenance
            is always preserved.
          </p>
        </div>
        {(() => {
          const destination = contributorsIndexSubmitDestination("submit");
          if (!destination) return null;
          return (
            <Link
              to={destination.to}
              onClick={() =>
                trackEvent(
                  contributorsIndexSubmitAnalyticsEvent(),
                  contributorsIndexSubmitAnalyticsData(sorted.length, total),
                )
              }
              className="inline-flex h-10 items-center rounded-md bg-ink px-4 text-sm font-medium text-background hover:bg-ink/90"
            >
              Submit a resource
            </Link>
          );
        })()}
      </div>
    </PageContainer>
  );
}
