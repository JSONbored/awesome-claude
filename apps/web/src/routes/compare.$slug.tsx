import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { ENTRIES } from "@/data/entries";
import { ComparisonTable } from "@/components/comparison-table";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { NewsletterInline } from "@/components/newsletter-inline";
import { stringifyJsonLd } from "@/lib/json-ld";
import { breadcrumbListJsonLd } from "@/lib/breadcrumb-jsonld-lib";
import { comparisonItemListJsonLd } from "@/lib/comparison-itemlist-jsonld-lib";
import { absoluteUrl } from "@/lib/seo";
import { ogImageUrl } from "@/lib/og-image";
import { ogImageMetaTags } from "@/lib/og-meta-lib";
import { getComparison } from "@/data/comparisons";
import {
  compareCuratedInteractivePageRenderable,
  compareCuratedInteractiveUiState,
} from "@/lib/compare-curated-interactive-ui-lib";
import { compareCuratedResolvedEntries } from "@/lib/compare-curated-ui-lib";
import { trackEvent } from "@/lib/analytics";
import {
  compareCuratedEgressAnalyticsData,
  compareCuratedEgressAnalyticsEvent,
  compareCuratedEgressDestination,
  compareCuratedNotFoundEgressAnalyticsData,
  compareCuratedNotFoundEgressAnalyticsEvent,
} from "@/lib/compare-curated-egress-cta-events";

export const Route = createFileRoute("/compare/$slug")({
  loader: ({ params }) => {
    const comparison = getComparison(params.slug);
    if (!comparison || !compareCuratedInteractivePageRenderable(comparison.refs, ENTRIES)) {
      throw notFound();
    }
    return {};
  },
  head: ({ params }) => {
    const comparison = getComparison(params.slug);
    if (!comparison) return { meta: [] };
    const entries = compareCuratedResolvedEntries(comparison.refs, ENTRIES);
    const url = absoluteUrl(`/compare/${comparison.slug}`);
    const ogImage = ogImageUrl({
      title: comparison.heading,
      eyebrow: "Compare",
      description: comparison.seoDescription,
    });
    const itemList = comparisonItemListJsonLd(comparison, entries, absoluteUrl);
    const breadcrumbs = breadcrumbListJsonLd([
      { name: "Directory", item: absoluteUrl("/browse") },
      { name: "Compare", item: absoluteUrl("/compare") },
      { name: comparison.heading, item: url },
    ]);
    return {
      meta: [
        { title: `${comparison.title} — HeyClaude` },
        { name: "description", content: comparison.seoDescription },
        { property: "og:title", content: comparison.title },
        { property: "og:description", content: comparison.seoDescription },
        { property: "og:url", content: url },
        ...ogImageMetaTags(ogImage, "article"),
      ],
      links: [{ rel: "canonical", href: url }],
      scripts: [
        { type: "application/ld+json", children: stringifyJsonLd(itemList) },
        { type: "application/ld+json", children: stringifyJsonLd(breadcrumbs) },
      ],
    };
  },
  component: ComparisonPage,
  notFoundComponent: () => {
    const destination = compareCuratedEgressDestination("not-found");
    return (
      <div className="mx-auto max-w-2xl px-6 py-24 text-center">
        <h1 className="h-display-2 text-ink">Comparison not found</h1>
        {destination ? (
          <Link
            to={destination.to}
            className="mt-4 inline-block text-ink-muted hover:text-ink"
            onClick={() =>
              trackEvent(
                compareCuratedNotFoundEgressAnalyticsEvent(),
                compareCuratedNotFoundEgressAnalyticsData(),
              )
            }
          >
            ← Build your own comparison
          </Link>
        ) : null}
      </div>
    );
  },
});

function ComparisonPage() {
  const { slug } = Route.useParams();
  const comparison = getComparison(slug);
  if (!comparison) return null;
  const curatedUi = compareCuratedInteractiveUiState(comparison.refs, ENTRIES);
  if (!curatedUi.renderable) return null;
  const { entries, bannerTexts, interactiveSearch, interactiveLinkLabel } = curatedUi;

  return (
    <div className="mx-auto max-w-page px-4 py-10 sm:px-6">
      <Breadcrumbs
        items={[
          { label: "Directory", to: "/browse" },
          { label: "Compare", to: "/compare" },
          { label: comparison.heading },
        ]}
        home
      />
      <header className="mt-6 max-w-3xl">
        <div className="eyebrow">{entries.length} compared</div>
        <h1 className="mt-2 h-display-1 text-ink text-balance">{comparison.heading}</h1>
        <p className="mt-4 text-pretty text-base text-ink-muted sm:text-lg">{comparison.intro}</p>
        {bannerTexts.length > 0 ? (
          <div className="mt-4 space-y-1.5">
            {bannerTexts.map((text) => (
              <p key={text} className="text-sm text-ink-muted">
                {text}
              </p>
            ))}
          </div>
        ) : null}
        {interactiveSearch
          ? (() => {
              const destination = compareCuratedEgressDestination(
                "interactive",
                interactiveSearch.ids,
              );
              if (!destination || !("search" in destination)) return null;
              return (
                <Link
                  to={destination.to}
                  search={destination.search}
                  className="mt-4 inline-flex items-center gap-1.5 text-sm text-ink-muted hover:text-ink"
                  onClick={() =>
                    trackEvent(
                      compareCuratedEgressAnalyticsEvent(),
                      compareCuratedEgressAnalyticsData("interactive", entries.length, true),
                    )
                  }
                >
                  <ArrowLeft className="h-4 w-4" /> {interactiveLinkLabel}
                </Link>
              );
            })()
          : null}
      </header>

      <div className="mt-8">
        <ComparisonTable entries={entries} showNextActions />
      </div>

      <NewsletterInline
        variant="quiet"
        title="More comparisons, weekly"
        description="A short, calm digest of reviewed Claude resources. Unsubscribe any time."
        source={`compare:${comparison.slug}`}
        className="mt-14"
      />
    </div>
  );
}
