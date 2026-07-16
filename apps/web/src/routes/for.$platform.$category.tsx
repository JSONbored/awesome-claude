import { cache } from "react";
import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { PageContainer } from "@/components/page-container";
import { ArrowRight } from "lucide-react";
import { CATEGORIES, PLATFORM_LABEL, type Platform, type Category } from "@/types/registry";
import { search } from "@/data/search";
import { categoryLabels } from "@/lib/site";
import { ResourceCard } from "@/components/resource-card";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { NewsletterInline } from "@/components/newsletter-inline";
import { HubHighlights, HubSignalStats } from "@/components/hub-highlights";
import { hubHighlights, hubStats, trustPosture } from "@/lib/hub-highlights";
import { trackEvent } from "@/lib/analytics";
import {
  platformCategoryCategoryAnalyticsData,
  platformCategoryCategoryAnalyticsEvent,
  platformCategoryNotFoundEgressAnalyticsData,
  platformCategoryNotFoundEgressAnalyticsEvent,
  platformCategoryPlatformAnalyticsData,
  platformCategoryPlatformAnalyticsEvent,
} from "@/lib/directory-hub-cta-events";
import { stringifyJsonLd } from "@/lib/json-ld";
import { breadcrumbListJsonLd } from "@/lib/breadcrumb-jsonld-lib";
import { platformCategoryItemListJsonLd } from "@/lib/platform-category-itemlist-jsonld-lib";
import { absoluteUrl } from "@/lib/seo";
import { ogImageUrl } from "@/lib/og-image";
import { ogImageMetaTags } from "@/lib/og-meta-lib";

const PLATFORM_IDS = new Set(Object.keys(PLATFORM_LABEL));
const CATEGORY_IDS = new Set(CATEGORIES.map((c) => c.id));

// Cached per render pass so loader + head() + the component don't each re-run the
// full search() scan (matches the React.cache pattern on the sibling hub routes).
const intersection = cache((platform: string, category: string) =>
  search({ platforms: [platform as Platform], categories: [category as Category] }),
);

export const Route = createFileRoute("/for/$platform/$category")({
  loader: ({ params }) => {
    if (!PLATFORM_IDS.has(params.platform) || !CATEGORY_IDS.has(params.category as Category)) {
      throw notFound();
    }
    // Never generate a page for an empty (platform × category) intersection.
    if (intersection(params.platform, params.category).length === 0) throw notFound();
    return {};
  },
  head: ({ params }) => {
    if (!PLATFORM_IDS.has(params.platform) || !CATEGORY_IDS.has(params.category as Category)) {
      return { meta: [] };
    }
    const pLabel = PLATFORM_LABEL[params.platform as Platform];
    const cLabel = categoryLabels[params.category] ?? params.category;
    const entries = intersection(params.platform, params.category);
    if (entries.length === 0) return { meta: [] };
    const url = absoluteUrl(`/for/${params.platform}/${params.category}`);
    const title = `Claude ${cLabel} for ${pLabel} — HeyClaude`;
    const description = `${entries.length} source-backed Claude ${cLabel} that work with ${pLabel}, curated and metadata-reviewed in HeyClaude.`;
    const ogImage = ogImageUrl({ title: `${cLabel} for ${pLabel}`, eyebrow: pLabel, description });
    const itemList = platformCategoryItemListJsonLd(
      pLabel,
      cLabel,
      description,
      entries,
      absoluteUrl,
    );
    const breadcrumbs = breadcrumbListJsonLd([
      { name: "Directory", item: absoluteUrl("/browse") },
      { name: "Platforms", item: absoluteUrl("/for") },
      { name: pLabel, item: absoluteUrl(`/for/${params.platform}`) },
      { name: cLabel, item: url },
    ]);
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:url", content: url },
        ...ogImageMetaTags(ogImage),
        // Single-entry intersections render (linked from the platform hub) but stay out of the
        // index to avoid thin pages — matches the sitemap policy below.
        ...(entries.length < 2 ? [{ name: "robots", content: "noindex, follow" }] : []),
      ],
      links: [{ rel: "canonical", href: url }],
      scripts: [
        { type: "application/ld+json", children: stringifyJsonLd(itemList) },
        { type: "application/ld+json", children: stringifyJsonLd(breadcrumbs) },
      ],
    };
  },
  component: IntersectionPage,
  notFoundComponent: () => (
    <div className="mx-auto max-w-2xl px-6 py-24 text-center">
      <h1 className="h-display-2 text-ink">Nothing here yet</h1>
      <p className="mt-3 text-sm text-ink-muted">
        No resources match that platform and category combination.
      </p>
      <Link
        to="/for"
        onClick={() =>
          trackEvent(
            platformCategoryNotFoundEgressAnalyticsEvent(),
            platformCategoryNotFoundEgressAnalyticsData(),
          )
        }
        className="mt-6 inline-flex h-9 items-center gap-1.5 rounded-md bg-ink px-4 font-medium text-background hover:opacity-90"
      >
        All platforms <ArrowRight className="h-4 w-4" />
      </Link>
    </div>
  ),
});

function IntersectionPage() {
  const { platform, category } = Route.useParams();
  const pLabel = PLATFORM_LABEL[platform as Platform] ?? platform;
  const cLabel = categoryLabels[category] ?? category;
  const entries = intersection(platform, category);

  // Data-derived framing unique to this platform×category slice.
  const posture = trustPosture(entries);
  const highlights = hubHighlights(entries);
  const stats = hubStats(entries);
  const newest = entries.reduce<(typeof entries)[number] | undefined>((acc, e) => {
    const t = Date.parse(e.dateAdded || "");
    if (Number.isNaN(t)) return acc;
    const accT = acc ? Date.parse(acc.dateAdded || "") : -Infinity;
    return t > accT ? e : acc;
  }, undefined);

  return (
    <PageContainer>
      <Breadcrumbs
        items={[
          { label: "Directory", to: "/browse" },
          { label: "Platforms", to: "/for" },
          { label: pLabel, to: "/for/$platform", params: { platform } },
          { label: cLabel },
        ]}
        home
      />
      <header className="mt-6 max-w-3xl">
        <div className="eyebrow">{entries.length} compatible resources</div>
        <h1 className="mt-2 h-display-1 text-ink text-balance">
          Claude {cLabel} for {pLabel}
        </h1>
        <p className="mt-4 text-pretty text-base text-ink-muted sm:text-lg">
          {entries.length} Claude {cLabel} that work with <span className="text-ink">{pLabel}</span>
          , curated and metadata-reviewed in HeyClaude.
          {posture.trusted > 0 ? <> {posture.pct}% sit in the trusted tier.</> : null}
          {newest ? <> Most recent addition: {newest.title}.</> : null}
        </p>
        <div className="mt-6 flex flex-wrap items-center gap-2 text-sm">
          <Link
            to="/for/$platform"
            params={{ platform }}
            onClick={() =>
              trackEvent(
                platformCategoryPlatformAnalyticsEvent(),
                platformCategoryPlatformAnalyticsData(platform, category, entries.length),
              )
            }
            className="story-link font-medium text-ink"
          >
            All {pLabel} resources →
          </Link>
          <span aria-hidden className="text-ink-subtle">
            ·
          </span>
          <Link
            to="/$category"
            params={{ category }}
            onClick={() =>
              trackEvent(
                platformCategoryCategoryAnalyticsEvent(),
                platformCategoryCategoryAnalyticsData(platform, category, entries.length),
              )
            }
            className="story-link font-medium text-ink"
          >
            All Claude {cLabel} →
          </Link>
        </div>
      </header>

      <HubHighlights
        highlights={highlights}
        caption={`Standout ${cLabel} for ${pLabel}, picked from this slice's own metadata — trust tier, provenance, documentation, and recency.`}
      />

      <h2 className="mt-12 h-display-2 text-ink">
        All {cLabel} for {pLabel}
      </h2>
      <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {entries.map((e) => (
          <ResourceCard
            key={`${e.category}/${e.slug}`}
            entry={e}
            variant="grid"
            analyticsSurface="platform-category"
          />
        ))}
      </div>

      <HubSignalStats stats={stats} total={entries.length} />

      <NewsletterInline
        variant="quiet"
        title={`New ${pLabel} resources, weekly`}
        description="A short, calm digest of reviewed Claude resources. Unsubscribe any time."
        source={`for:${platform}:${category}`}
        className="mt-14"
      />
    </PageContainer>
  );
}
