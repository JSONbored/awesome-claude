import { createFileRoute, Link } from "@tanstack/react-router";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { stringifyJsonLd } from "@/lib/json-ld";
import { absoluteUrl } from "@/lib/seo";
import { getIndexableTagGroups } from "@/lib/tags";

export const Route = createFileRoute("/tags/")({
  head: () => {
    const url = absoluteUrl("/tags");
    const title = "Browse Claude resources by tag — HeyClaude";
    const description =
      "Topic index for the HeyClaude directory: browse Claude Code MCP servers, agents, skills, hooks, commands, and rules by tag.";
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:url", content: url },
        { name: "twitter:card", content: "summary_large_image" },
      ],
      links: [{ rel: "canonical", href: url }],
      scripts: [
        {
          type: "application/ld+json",
          children: stringifyJsonLd({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Directory", item: absoluteUrl("/browse") },
              { "@type": "ListItem", position: 2, name: "Tags", item: url },
            ],
          }),
        },
      ],
    };
  },
  component: TagsIndex,
});

function TagsIndex() {
  const groups = getIndexableTagGroups();
  return (
    <div className="mx-auto max-w-[1100px] px-4 py-10 sm:px-6">
      <Breadcrumbs items={[{ label: "Directory", to: "/browse" }, { label: "Tags" }]} home />
      <header className="mt-6 max-w-3xl">
        <div className="eyebrow">{groups.length} topics</div>
        <h1 className="mt-2 h-display-1 text-ink text-balance">Browse by tag</h1>
        <p className="mt-4 text-pretty text-base text-ink-muted sm:text-lg">
          Jump to a topic to see every Claude Code resource tagged with it across the directory.
        </p>
      </header>
      <div className="mt-8 flex flex-wrap gap-2">
        {groups.map((group) => (
          <Link
            key={group.slug}
            to="/tags/$tag"
            params={{ tag: group.slug }}
            className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface px-3 py-1.5 text-sm text-ink hover:bg-surface-2"
          >
            {group.name}
            <span className="font-mono text-xs text-ink-subtle">{group.entries.length}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
