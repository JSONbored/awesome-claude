import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { ResourceCard } from "@/components/resource-card";
import { PageContainer } from "@/components/page-container";
import { PageHeader } from "@/components/page-header";
import { NewsletterInline } from "@/components/newsletter-inline";
import { HubHighlights, HubSignalStats } from "@/components/hub-highlights";
import { hubHighlights, hubStats, trustPosture } from "@/lib/hub-highlights";
import { categoryLabels } from "@/lib/site";
import { CATEGORIES, type Entry } from "@/types/registry";
import { stringifyJsonLd } from "@/lib/json-ld";
import { absoluteUrl } from "@/lib/seo";
import { ogImageUrl } from "@/lib/og-image";
import { getTagGroup, relatedTags } from "@/lib/tags";

// The categories a tag's entries actually span — used to vary intro copy per tag so no
// two indexable tag pages emit the same boilerplate sentence.
function categorySpread(entries: Entry[], limit = 3): string[] {
  const counts = new Map<string, number>();
  for (const e of entries) counts.set(e.category, (counts.get(e.category) ?? 0) + 1);
  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([id]) => categoryLabels[id] ?? CATEGORIES.find((c) => c.id === id)?.label ?? id);
}

function joinList(items: string[]): string {
  if (items.length <= 1) return items[0] ?? "";
  if (items.length === 2) return `${items[0]} and ${items[1]}`;
  return `${items.slice(0, -1).join(", ")}, and ${items[items.length - 1]}`;
}

export const Route = createFileRoute("/tags/$tag")({
  loader: ({ params }) => {
    if (!getTagGroup(params.tag)) throw notFound();
    return {};
  },
  head: ({ params }) => {
    const group = getTagGroup(params.tag);
    if (!group) return { meta: [] };
    const url = absoluteUrl(`/tags/${params.tag}`);
    const title = `Claude ${group.name} resources — HeyClaude`;
    const description = `${group.entries.length} Claude Code resources tagged "${group.name}" — MCP servers, agents, skills, hooks, commands, rules, and more, curated in HeyClaude.`;
    const ogImage = ogImageUrl({ title: `Tagged "${group.name}"`, eyebrow: "Tag", description });
    const itemList = {
      "@context": "https://schema.org",
      "@type": "ItemList",
      name: `Claude resources tagged ${group.name}`,
      description,
      numberOfItems: group.entries.length,
      itemListElement: group.entries.slice(0, 30).map((e, i) => ({
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
        { "@type": "ListItem", position: 2, name: "Tags", item: absoluteUrl("/tags") },
        { "@type": "ListItem", position: 3, name: group.name, item: url },
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
        { property: "og:image:type", content: "image/png" },
        { property: "og:image:width", content: "1200" },
        { property: "og:image:height", content: "630" },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:image", content: ogImage },
        // Single-entry tag pages are thin and excluded from the sitemap; keep them usable for
        // in-page tag links but out of the index to match the sitemap policy.
        ...(group.entries.length < 2 ? [{ name: "robots", content: "noindex, follow" }] : []),
      ],
      links: [{ rel: "canonical", href: url }],
      scripts: [
        { type: "application/ld+json", children: stringifyJsonLd(itemList) },
        { type: "application/ld+json", children: stringifyJsonLd(breadcrumbs) },
      ],
    };
  },
  component: TagHub,
  notFoundComponent: () => (
    <div className="mx-auto max-w-2xl px-6 py-24 text-center">
      <h1 className="h-display-2 text-ink">Tag not found</h1>
      <p className="mt-3 text-sm text-ink-muted">No resources use that tag yet.</p>
      <Link
        to="/tags"
        className="mt-6 inline-flex h-9 items-center gap-1.5 rounded-md bg-ink px-4 font-medium text-background hover:opacity-90"
      >
        Browse all tags <ArrowRight className="h-4 w-4" />
      </Link>
    </div>
  ),
});

function TagHub() {
  const { tag } = Route.useParams();
  const group = getTagGroup(tag);
  if (!group) return null;
  const entries = group.entries;
  const related = relatedTags(group.slug);

  // Distinct, data-derived intro: name the categories this tag actually spans and its
  // trusted-tier share, so each indexable tag page reads differently from the next.
  const spread = categorySpread(entries);
  const posture = trustPosture(entries);
  const highlights = hubHighlights(entries);
  const stats = hubStats(entries);

  return (
    <PageContainer>
      <PageHeader
        breadcrumbs={[
          { label: "Directory", to: "/browse" },
          { label: "Tags", to: "/tags" },
        ]}
        eyebrow={`${entries.length} entries`}
        title={<>Claude resources tagged “{group.name}”</>}
        description={
          <>
            {entries.length} curated Claude Code {entries.length === 1 ? "resource" : "resources"}{" "}
            tagged <span className="text-ink">{group.name}</span> in the HeyClaude directory
            {spread.length > 0 ? (
              <> — mostly {joinList(spread.map((s) => s.toLowerCase()))}</>
            ) : null}
            .
            {posture.trusted > 0 ? (
              <>
                {" "}
                {posture.trusted} of them {posture.trusted === 1 ? "sits" : "sit"} in the trusted
                tier.
              </>
            ) : null}
          </>
        }
      />

      {related.length > 0 && (
        <div className="mt-6 flex flex-wrap items-center gap-2">
          <span className="eyebrow mr-1">Related topics</span>
          {related.map((g) => (
            <Link
              key={g.slug}
              to="/tags/$tag"
              params={{ tag: g.slug }}
              className="rounded-md border border-border bg-surface px-2 py-0.5 text-xs text-ink-muted transition-colors hover:border-ink/20 hover:text-ink"
            >
              {g.name}
            </Link>
          ))}
        </div>
      )}

      <HubHighlights
        highlights={highlights}
        caption={`Standout entries tagged ${group.name}, picked by their own metadata — trust tier, provenance, documentation, and recency.`}
      />

      <h2 className="mt-12 h-display-2 text-ink">All {group.name} resources</h2>
      <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {entries.map((e) => (
          <ResourceCard key={`${e.category}/${e.slug}`} entry={e} variant="grid" />
        ))}
      </div>

      <HubSignalStats stats={stats} total={entries.length} />

      <NewsletterInline
        variant="quiet"
        title="More resources, weekly"
        description="A short, calm digest of reviewed Claude resources. Unsubscribe any time."
        source={`tag:${group.slug}`}
        className="mt-14"
      />
    </PageContainer>
  );
}
