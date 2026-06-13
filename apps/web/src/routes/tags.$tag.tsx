import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { ResourceCard } from "@/components/resource-card";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { NewsletterInline } from "@/components/newsletter-inline";
import { stringifyJsonLd } from "@/lib/json-ld";
import { absoluteUrl } from "@/lib/seo";
import { ogImageUrl } from "@/lib/og-image";
import { getTagGroup } from "@/lib/tags";

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

  return (
    <div className="mx-auto max-w-[1200px] px-4 py-10 sm:px-6">
      <Breadcrumbs
        items={[{ label: "Directory", to: "/browse" }, { label: "Tags", to: "/tags" }, { label: group.name }]}
        home
      />
      <header className="mt-6 max-w-3xl">
        <div className="eyebrow">{entries.length} entries</div>
        <h1 className="mt-2 h-display-1 text-ink text-balance">Claude resources tagged “{group.name}”</h1>
        <p className="mt-4 text-pretty text-base text-ink-muted sm:text-lg">
          Every source-backed Claude Code resource tagged <span className="text-ink">{group.name}</span> in
          the HeyClaude directory — across MCP servers, agents, skills, hooks, commands, and more.
        </p>
      </header>

      <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {entries.map((e) => (
          <ResourceCard key={`${e.category}/${e.slug}`} entry={e} variant="grid" />
        ))}
      </div>

      <NewsletterInline
        variant="quiet"
        title="More resources, weekly"
        description="A short, calm digest of reviewed Claude resources. Unsubscribe any time."
        source={`tag:${group.slug}`}
        className="mt-14"
      />
    </div>
  );
}
