import * as React from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Search } from "lucide-react";
import { PageContainer } from "@/components/page-container";
import { PageHeader } from "@/components/page-header";
import { CategoryPill } from "@/components/badges";
import { stringifyJsonLd } from "@/lib/json-ld";
import { absoluteUrl } from "@/lib/seo";
import { getIndexableTagGroups } from "@/lib/tags";
import { trackEvent } from "@/lib/analytics";
import { cn } from "@/lib/utils";

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

type TagView = {
  slug: string;
  name: string;
  count: number;
  topCategory: string;
  categoryCount: number;
};

// Derive a lightweight, sorted view-model (by entry count desc) with the category
// each tag mostly spans — enough context to make the index scannable.
function buildTagViews(): TagView[] {
  return getIndexableTagGroups().map((group) => {
    const catCounts = new Map<string, number>();
    for (const entry of group.entries) {
      catCounts.set(entry.category, (catCounts.get(entry.category) ?? 0) + 1);
    }
    const sorted = [...catCounts.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]));
    return {
      slug: group.slug,
      name: group.name,
      count: group.entries.length,
      topCategory: sorted[0]?.[0] ?? "",
      categoryCount: sorted.length,
    };
  });
}

function FeaturedTagCard({ tag }: { tag: TagView }) {
  return (
    <Link
      to="/tags/$tag"
      params={{ tag: tag.slug }}
      className="group flex flex-col rounded-xl border border-border bg-surface p-4 transition-colors duration-200 ease-out hover:border-border-strong hover:bg-surface-2"
    >
      <div className="flex items-baseline justify-between gap-2">
        <span className="min-w-0 truncate font-display text-base font-semibold text-ink group-hover:underline">
          {tag.name}
        </span>
        <span className="shrink-0 font-mono text-xs text-ink-subtle">{tag.count}</span>
      </div>
      <div className="mt-3 flex flex-wrap items-center gap-1.5">
        {tag.topCategory && <CategoryPill>{tag.topCategory}</CategoryPill>}
        {tag.categoryCount > 1 && (
          <span className="text-xs text-ink-subtle">+{tag.categoryCount - 1} more</span>
        )}
      </div>
    </Link>
  );
}

function TagPill({ tag, strong }: { tag: TagView; strong?: boolean }) {
  return (
    <Link
      to="/tags/$tag"
      params={{ tag: tag.slug }}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm transition-colors duration-200 ease-out",
        strong
          ? "border-border-strong bg-surface-2 font-medium text-ink hover:border-ink/30"
          : "border-border bg-surface text-ink hover:bg-surface-2",
      )}
    >
      {tag.name}
      <span className="font-mono text-xs text-ink-subtle">{tag.count}</span>
    </Link>
  );
}

function TagsIndex() {
  const all = React.useMemo(buildTagViews, []);
  const [query, setQuery] = React.useState("");
  const q = query.trim().toLowerCase();

  const filtered = React.useMemo(
    () => (q ? all.filter((t) => t.name.toLowerCase().includes(q) || t.slug.includes(q)) : all),
    [all, q],
  );

  const featured = all.slice(0, 8);
  // Subtle weighting: tags at/above the featured cutoff read as "strong" pills.
  const strongCutoff = featured[featured.length - 1]?.count ?? 0;

  return (
    <PageContainer>
      <PageHeader
        breadcrumbs={[{ label: "Directory", to: "/browse" }]}
        eyebrow={`${all.length} topics`}
        title="Browse by tag"
        description="Jump to a topic to see every Claude Code resource tagged with it across the directory."
      />

      <div className="relative mt-8 max-w-md">
        <Search
          className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-subtle"
          aria-hidden
        />
        <input
          type="search"
          value={query}
          onChange={(e) => {
            const next = e.target.value;
            setQuery(next);
            if (next.trim().length >= 2) trackEvent("tag-filter", { q: next.trim().slice(0, 64) });
          }}
          placeholder="Filter topics…"
          aria-label="Filter topics"
          className="h-10 w-full rounded-md border border-border bg-surface pl-9 pr-3 text-sm text-ink placeholder:text-ink-subtle focus-visible:border-border-strong focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60"
        />
      </div>

      {!q && (
        <section className="mt-10">
          <div className="eyebrow">Popular topics</div>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {featured.map((tag) => (
              <FeaturedTagCard key={tag.slug} tag={tag} />
            ))}
          </div>
        </section>
      )}

      <section className="mt-10">
        <div className="eyebrow">{q ? `${filtered.length} matching` : "All topics"}</div>
        {filtered.length > 0 ? (
          <div className="mt-4 flex flex-wrap gap-2">
            {filtered.map((tag) => (
              <TagPill key={tag.slug} tag={tag} strong={tag.count >= strongCutoff} />
            ))}
          </div>
        ) : (
          <p className="mt-4 text-sm text-ink-muted">
            No topics match “{query}”. Try a broader term, or{" "}
            <Link to="/browse" className="text-ink underline">
              browse the full directory
            </Link>
            .
          </p>
        )}
      </section>
    </PageContainer>
  );
}
