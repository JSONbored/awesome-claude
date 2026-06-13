import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { CATEGORIES, PLATFORM_LABEL, type Platform } from "@/types/registry";
import { search } from "@/data/search";
import { categoryLabels } from "@/lib/site";
import { ResourceCard } from "@/components/resource-card";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { NewsletterInline } from "@/components/newsletter-inline";
import { stringifyJsonLd } from "@/lib/json-ld";
import { absoluteUrl } from "@/lib/seo";
import { ogImageUrl } from "@/lib/og-image";

const PLATFORM_IDS = new Set(Object.keys(PLATFORM_LABEL));

function platformEntries(platform: string) {
  return search({ platforms: [platform as Platform] });
}

export const Route = createFileRoute("/for/$platform")({
  loader: ({ params }) => {
    if (!PLATFORM_IDS.has(params.platform)) throw notFound();
    return {};
  },
  head: ({ params }) => {
    if (!PLATFORM_IDS.has(params.platform)) return { meta: [] };
    const label = PLATFORM_LABEL[params.platform as Platform];
    const entries = platformEntries(params.platform);
    const url = absoluteUrl(`/for/${params.platform}`);
    const title = `Claude resources for ${label} — HeyClaude`;
    const description = `${entries.length} source-backed Claude resources that work with ${label}: MCP servers, agents, skills, hooks, commands, and rules, curated in HeyClaude.`;
    const ogImage = ogImageUrl({ title: `Claude for ${label}`, eyebrow: "Platform", description });
    const itemList = {
      "@context": "https://schema.org",
      "@type": "ItemList",
      name: `Claude resources for ${label}`,
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
        { "@type": "ListItem", position: 2, name: "Platforms", item: absoluteUrl("/for") },
        { "@type": "ListItem", position: 3, name: label, item: url },
      ],
    };
    const faq = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: `What Claude resources work with ${label}?`,
          acceptedAnswer: {
            "@type": "Answer",
            text: `HeyClaude lists ${entries.length} ${label}-compatible resources across MCP servers, agents, skills, hooks, commands, rules, and more — each metadata-reviewed for source and safety signals.`,
          },
        },
      ],
    };
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:url", content: url },
        { property: "og:image", content: ogImage },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:image", content: ogImage },
      ],
      links: [{ rel: "canonical", href: url }],
      scripts: [
        { type: "application/ld+json", children: stringifyJsonLd(itemList) },
        { type: "application/ld+json", children: stringifyJsonLd(breadcrumbs) },
        { type: "application/ld+json", children: stringifyJsonLd(faq) },
      ],
    };
  },
  component: PlatformPage,
  notFoundComponent: () => (
    <div className="mx-auto max-w-2xl px-6 py-24 text-center">
      <h1 className="h-display-2 text-ink">Platform not found</h1>
      <p className="mt-3 text-sm text-ink-muted">That platform isn't tracked yet.</p>
      <Link
        to="/for"
        className="mt-6 inline-flex h-9 items-center gap-1.5 rounded-md bg-ink px-4 font-medium text-background hover:opacity-90"
      >
        All platforms <ArrowRight className="h-4 w-4" />
      </Link>
    </div>
  ),
});

function PlatformPage() {
  const { platform } = Route.useParams();
  const label = PLATFORM_LABEL[platform as Platform] ?? platform;
  const all = platformEntries(platform);
  const sections = CATEGORIES.map((c) => ({
    category: c,
    entries: all.filter((e) => e.category === c.id).slice(0, 6),
  })).filter((s) => s.entries.length > 0);

  return (
    <div className="mx-auto max-w-[1200px] px-4 py-10 sm:px-6">
      <Breadcrumbs
        items={[{ label: "Directory", to: "/browse" }, { label: "Platforms", to: "/for" }, { label }]}
        home
      />
      <header className="mt-6 max-w-3xl">
        <div className="eyebrow">{all.length} compatible resources</div>
        <h1 className="mt-2 h-display-1 text-ink text-balance">Claude resources for {label}</h1>
        <p className="mt-4 text-pretty text-base text-ink-muted sm:text-lg">
          Source-backed MCP servers, agents, skills, hooks, commands, and rules that work with{" "}
          <span className="text-ink">{label}</span> — curated and metadata-reviewed in HeyClaude.
        </p>
        <div className="mt-6">
          <Link
            to="/browse"
            search={{ platform }}
            className="inline-flex h-9 items-center gap-1.5 rounded-md bg-ink px-4 font-medium text-background hover:opacity-90"
          >
            Browse &amp; filter all {label} resources <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </header>

      {sections.map((section) => (
        <section key={section.category.id} className="mt-12">
          <div className="flex items-baseline justify-between gap-3">
            <h2 className="h-display-2 text-ink">
              {categoryLabels[section.category.id] ?? section.category.label}
            </h2>
            <Link
              to="/$category"
              params={{ category: section.category.id }}
              className="story-link text-sm font-medium text-ink"
            >
              All {categoryLabels[section.category.id] ?? section.category.label} →
            </Link>
          </div>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {section.entries.map((e) => (
              <ResourceCard key={`${e.category}/${e.slug}`} entry={e} variant="grid" />
            ))}
          </div>
        </section>
      ))}

      <NewsletterInline
        variant="quiet"
        title={`New ${label} resources, weekly`}
        description="A short, calm digest of reviewed Claude resources. Unsubscribe any time."
        source={`platform:${platform}`}
        className="mt-14"
      />
    </div>
  );
}
