import type { Metadata } from "next";

import { Breadcrumbs } from "@/components/breadcrumbs";
import { DirectoryEntryCard } from "@/components/directory-entry-card";
import { JsonLd } from "@/components/json-ld";
import { entryCommunityTarget } from "@/lib/community-signals";
import { getGrowthSurfaces } from "@/lib/growth-surfaces";
import { buildPageMetadata } from "@/lib/seo";
import { siteConfig } from "@/lib/site";
import {
  buildBreadcrumbJsonLd,
  buildCollectionPageJsonLd,
} from "@heyclaude/registry/seo";

export const revalidate = 300;

export const metadata: Metadata = buildPageMetadata({
  title: "Popular, trending, and new Claude resources",
  description:
    "Browse popular, fresh, and copy-ready HeyClaude resources grouped by source-backed signals, registry updates, and practical AI utility.",
  path: "/trending",
});

export default async function TrendingPage() {
  const surfaces = await getGrowthSurfaces();
  const jsonLd = [
    buildBreadcrumbJsonLd([
      { name: "Home", url: siteConfig.url },
      { name: "Trending", url: `${siteConfig.url}/trending` },
    ]),
    buildCollectionPageJsonLd({
      siteUrl: siteConfig.url,
      path: "/trending",
      name: "Popular, trending, and new Claude resources",
      description:
        "Fresh and source-backed HeyClaude discovery surfaces without fabricated popularity.",
      breadcrumbId: `${siteConfig.url}/trending#breadcrumb`,
    }),
  ];

  const groups = [
    ["Community trending", surfaces.communityTrending],
    ["Popular by source signals", surfaces.popularBySourceSignals],
    ["Practical picks", surfaces.practicalPicks],
    ["Newly added", surfaces.newest],
    ["Recently updated upstream", surfaces.recentlyUpdated],
  ] as const;

  return (
    <div className="container-shell space-y-10 py-12">
      <JsonLd data={jsonLd} />
      <div className="space-y-4 border-b border-border/80 pb-8">
        <Breadcrumbs
          items={[{ label: "Home", href: "/" }, { label: "Trending" }]}
        />
        <span className="eyebrow">Discovery</span>
        <h1 className="section-title">Popular, trending, and new resources.</h1>
        <p className="max-w-3xl text-sm leading-8 text-muted-foreground">
          These surfaces use visible registry fields, source-backed repository
          signals when present, and aggregate community actions from the last 30
          days. Empty signal groups are hidden instead of implying popularity
          that has not been measured.
        </p>
      </div>

      {groups
        .filter(([, entries]) => entries.length > 0)
        .map(([title, entries]) => (
          <section key={title} className="space-y-4">
            <h2 className="text-2xl font-semibold tracking-tight text-foreground">
              {title}
            </h2>
            <div className="space-y-4">
              {entries.slice(0, 4).map((entry) => {
                const key = `${entry.category}:${entry.slug}`;
                const signalKey = entryCommunityTarget(
                  entry.category,
                  entry.slug,
                );
                const intentCounts = surfaces.intentCounts[key];
                const intentCount = intentCounts
                  ? intentCounts.copy +
                    intentCounts.open +
                    intentCounts.install +
                    intentCounts.download +
                    intentCounts.vote
                  : 0;
                return (
                  <DirectoryEntryCard
                    key={`${title}:${entry.category}:${entry.slug}`}
                    entry={entry}
                    voteCount={surfaces.voteCounts[key] ?? 0}
                    communitySignals={surfaces.communitySignals[signalKey]}
                    intentCount={intentCount}
                  />
                );
              })}
            </div>
          </section>
        ))}
    </div>
  );
}
