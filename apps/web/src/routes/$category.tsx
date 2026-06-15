import { cache } from "react";
import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { CATEGORIES, type Category } from "@/types/registry";
import { search } from "@/data/search";
import {
  categoryLabels,
  categoryDescriptions,
  categorySeoDescriptions,
  categoryUsageHints,
  categoryQuickstarts,
} from "@/lib/site";
import { ResourceCard } from "@/components/resource-card";
import { PageContainer } from "@/components/page-container";
import { PageHeader } from "@/components/page-header";
import { NewsletterInline } from "@/components/newsletter-inline";
import { HubHighlights, HubSignalStats } from "@/components/hub-highlights";
import { CategoryRankingTable } from "@/components/category-ranking-table";
import { hubHighlights, hubStats } from "@/lib/hub-highlights";
import { stringifyJsonLd } from "@/lib/json-ld";
import { absoluteUrl } from "@/lib/seo";
import { ogImageUrl, categoryAccent } from "@/lib/og-image";

const categoryIds = new Set(CATEGORIES.map((c) => c.id));

// Reuse the canonical registry ranking (recommendedScore) so hub order matches /browse.
// Cached per render pass so head() and the component don't each re-run the search.
const topEntriesFor = cache((id: string) => search({ categories: [id as Category] }));

function faqFor(id: string, label: string) {
  return [
    {
      q: `What are Claude ${label}?`,
      a:
        categoryDescriptions[id] ??
        `Claude ${label} are community-submitted resources curated in the HeyClaude directory.`,
    },
    {
      q: `How do I use ${label} from HeyClaude?`,
      a:
        categoryUsageHints[id] ??
        `Open any entry to see install or usage details, copy the snippet or config, and review the linked source before adding it to your Claude setup.`,
    },
    {
      q: `Are HeyClaude ${label} reviewed before they are listed?`,
      a: "Each entry is metadata-reviewed for source, trust, and safety/privacy signals before it appears. HeyClaude does not scan for malware, so always review the linked source before installing anything that touches your filesystem, network, or credentials.",
    },
  ];
}

export const Route = createFileRoute("/$category")({
  loader: ({ params }) => {
    if (!categoryIds.has(params.category as never)) throw notFound();
    return {};
  },
  head: ({ params }) => {
    const id = params.category;
    if (!categoryIds.has(id as never)) return { meta: [] };
    const label = categoryLabels[id] ?? id;
    const path = `/${id}`;
    const url = absoluteUrl(path);
    const entries = topEntriesFor(id);
    const title = `Claude ${label} — HeyClaude directory`;
    const description =
      categorySeoDescriptions[id] ??
      categoryDescriptions[id] ??
      `Browse ${entries.length} source-backed Claude ${label} in the HeyClaude directory.`;
    const ogImage = ogImageUrl({
      title: `Claude ${label}`,
      eyebrow: label,
      description,
      accent: categoryAccent(id),
    });

    const itemList = {
      "@context": "https://schema.org",
      "@type": "ItemList",
      name: `Claude ${label}`,
      description,
      numberOfItems: entries.length,
      itemListElement: entries.slice(0, 30).map((e, i) => ({
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
        { "@type": "ListItem", position: 2, name: label, item: url },
      ],
    };
    const faq = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: faqFor(id, label).map((item) => ({
        "@type": "Question",
        name: item.q,
        acceptedAnswer: { "@type": "Answer", text: item.a },
      })),
    };

    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:url", content: url },
        { property: "og:image", content: ogImage },
        { property: "og:image:type", content: "image/png" },
        { property: "og:image:width", content: "1200" },
        { property: "og:image:height", content: "630" },
        { property: "og:type", content: "website" },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:image", content: ogImage },
      ],
      links: [
        { rel: "canonical", href: url },
        {
          rel: "alternate",
          type: "application/rss+xml",
          href: absoluteUrl(`/feeds/${id}.xml`),
          title: `Claude ${label} — HeyClaude`,
        },
      ],
      scripts: [
        { type: "application/ld+json", children: stringifyJsonLd(itemList) },
        { type: "application/ld+json", children: stringifyJsonLd(breadcrumbs) },
        { type: "application/ld+json", children: stringifyJsonLd(faq) },
      ],
    };
  },
  component: CategoryHub,
  notFoundComponent: () => (
    <div className="mx-auto max-w-2xl px-6 py-24 text-center">
      <h1 className="h-display-2 text-ink">Category not found</h1>
      <p className="mt-3 text-sm text-ink-muted">
        That category doesn't exist. Browse the full HeyClaude directory instead.
      </p>
      <Link
        to="/browse"
        className="mt-6 inline-flex h-9 items-center gap-1.5 rounded-md bg-ink px-4 font-medium text-background hover:opacity-90"
      >
        Browse all <ArrowRight className="h-4 w-4" />
      </Link>
    </div>
  ),
});

function CategoryHub() {
  const { category: id } = Route.useParams();
  const label = categoryLabels[id] ?? id;
  const entries = topEntriesFor(id);
  const top = entries.slice(0, 24);
  const quickstart = categoryQuickstarts[id] ?? [];
  const faqs = faqFor(id, label);

  // Data-derived signals computed across the full category set.
  const highlights = hubHighlights(entries);
  const stats = hubStats(entries);
  // Extractable, citeable lead facts computed from the reviewed metadata.
  const sourcedPct = stats.find((s) => s.key === "sourced")?.pct;
  const safetyPct = stats.find((s) => s.key === "safety")?.pct;
  const installableCount = entries.filter((e) => Boolean(e.installCommand)).length;

  return (
    <PageContainer>
      <PageHeader
        breadcrumbs={[{ label: "Directory", to: "/browse" }]}
        eyebrow={`${entries.length} entries`}
        title={`Claude ${label}`}
        description={categorySeoDescriptions[id] ?? categoryDescriptions[id]}
      />

      <div className="mt-6 max-w-3xl">
        <div className="flex flex-wrap items-center gap-2 text-sm">
          <Link
            to="/browse"
            search={{ category: id }}
            className="inline-flex h-9 items-center gap-1.5 rounded-md bg-ink px-4 font-medium text-background hover:opacity-90"
          >
            Browse &amp; filter all {label} <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        {quickstart.length > 0 && (
          <div className="mt-6 rounded-xl border border-border bg-surface p-4">
            <div className="eyebrow mb-2">Quick start</div>
            <ul className="space-y-1.5 text-sm text-ink-muted">
              {quickstart.map((step) => (
                <li key={step} className="flex items-start gap-2">
                  <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" aria-hidden />
                  <span>{step}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {sourcedPct !== undefined && (
        <p className="mt-6 max-w-3xl text-pretty text-sm text-ink-muted">
          Of {entries.length} Claude {label.toLowerCase()} in the directory,{" "}
          <strong className="font-medium text-ink">{sourcedPct}% are source-backed</strong>
          {safetyPct !== undefined ? <>, {safetyPct}% disclose safety notes</> : null}, and{" "}
          <strong className="font-medium text-ink">{installableCount}</strong> ship a one-line
          install command.
        </p>
      )}

      <HubHighlights
        highlights={highlights}
        caption={`Standout Claude ${label}, picked from their own metadata — trust tier, provenance, documentation, and recency.`}
      />

      <section className="mt-12">
        <h2 className="h-display-2 text-ink">Top {label}</h2>
        <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {top.map((e) => (
            <ResourceCard key={`${e.category}/${e.slug}`} entry={e} variant="grid" />
          ))}
        </div>
        {entries.length > top.length && (
          <div className="mt-5 text-right">
            <Link
              to="/browse"
              search={{ category: id }}
              className="story-link text-sm font-medium text-ink"
            >
              See all {entries.length} {label} →
            </Link>
          </div>
        )}
      </section>

      <CategoryRankingTable entries={entries.slice(0, 12)} label={label} />

      <HubSignalStats stats={stats} total={entries.length} />

      <section className="mt-14">
        <h2 className="h-display-2 text-ink">Frequently asked</h2>
        <dl className="mt-5 space-y-4">
          {faqs.map((item) => (
            <div key={item.q} className="rounded-xl border border-border bg-surface p-5">
              <dt className="font-display text-base font-semibold text-ink">{item.q}</dt>
              <dd className="mt-2 text-sm text-ink-muted">{item.a}</dd>
            </div>
          ))}
        </dl>
      </section>

      <NewsletterInline
        variant="quiet"
        title={`New ${label}, weekly`}
        description="A short, calm digest of reviewed Claude resources. Unsubscribe any time."
        source={`category:${id}`}
        className="mt-14"
      />
    </PageContainer>
  );
}
