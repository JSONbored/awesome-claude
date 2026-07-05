import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { ENTRIES } from "@/data/entries";
import type { Entry } from "@/types/registry";
import { ComparisonTable } from "@/components/comparison-table";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { NewsletterInline } from "@/components/newsletter-inline";
import { stringifyJsonLd } from "@/lib/json-ld";
import { absoluteUrl } from "@/lib/seo";
import { ogImageUrl } from "@/lib/og-image";
import { getComparison } from "@/data/comparisons";
import { compareCuratedBannerTexts } from "@/lib/compare-curated-summary";

function resolveRefs(refs: string[]): Entry[] {
  const out: Entry[] = [];
  for (const ref of refs) {
    const [category, slug] = ref.split("/");
    const entry = ENTRIES.find((e) => e.category === category && e.slug === slug);
    if (entry) out.push(entry);
  }
  return out;
}

export const Route = createFileRoute("/compare/$slug")({
  loader: ({ params }) => {
    const comparison = getComparison(params.slug);
    if (!comparison || resolveRefs(comparison.refs).length < 2) throw notFound();
    return {};
  },
  head: ({ params }) => {
    const comparison = getComparison(params.slug);
    if (!comparison) return { meta: [] };
    const entries = resolveRefs(comparison.refs);
    const url = absoluteUrl(`/compare/${comparison.slug}`);
    const ogImage = ogImageUrl({
      title: comparison.heading,
      eyebrow: "Compare",
      description: comparison.seoDescription,
    });
    const itemList = {
      "@context": "https://schema.org",
      "@type": "ItemList",
      name: comparison.heading,
      description: comparison.seoDescription,
      numberOfItems: entries.length,
      itemListElement: entries.map((e, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: e.title,
        url: absoluteUrl(`/entry/${e.category}/${e.slug}`),
      })),
    };
    const breadcrumbs = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Directory", item: absoluteUrl("/browse") },
        { "@type": "ListItem", position: 2, name: "Compare", item: absoluteUrl("/compare") },
        { "@type": "ListItem", position: 3, name: comparison.heading, item: url },
      ],
    };
    return {
      meta: [
        { title: `${comparison.title} — HeyClaude` },
        { name: "description", content: comparison.seoDescription },
        { property: "og:title", content: comparison.title },
        { property: "og:description", content: comparison.seoDescription },
        { property: "og:url", content: url },
        { property: "og:image", content: ogImage },
        { property: "og:image:type", content: "image/png" },
        { property: "og:image:width", content: "1200" },
        { property: "og:image:height", content: "630" },
        { property: "og:type", content: "article" },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:image", content: ogImage },
      ],
      links: [{ rel: "canonical", href: url }],
      scripts: [
        { type: "application/ld+json", children: stringifyJsonLd(itemList) },
        { type: "application/ld+json", children: stringifyJsonLd(breadcrumbs) },
      ],
    };
  },
  component: ComparisonPage,
  notFoundComponent: () => (
    <div className="mx-auto max-w-2xl px-6 py-24 text-center">
      <h1 className="h-display-2 text-ink">Comparison not found</h1>
      <Link to="/compare" className="mt-4 inline-block text-ink-muted hover:text-ink">
        ← Build your own comparison
      </Link>
    </div>
  ),
});

function ComparisonPage() {
  const { slug } = Route.useParams();
  const comparison = getComparison(slug);
  if (!comparison) return null;
  const entries = resolveRefs(comparison.refs);
  const bannerTexts = compareCuratedBannerTexts(entries);

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
        <Link
          to="/compare"
          search={{ ids: entries.map((e) => `${e.category}/${e.slug}`).join(",") }}
          className="mt-4 inline-flex items-center gap-1.5 text-sm text-ink-muted hover:text-ink"
        >
          <ArrowLeft className="h-4 w-4" /> Open in the interactive comparison tool
        </Link>
      </header>

      <div className="mt-8">
        <ComparisonTable entries={entries} />
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
