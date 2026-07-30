import * as React from "react";
import { createFileRoute, Link, stripSearchParams, useNavigate } from "@tanstack/react-router";
import { z } from "zod";
import { Search } from "lucide-react";
import { PageContainer } from "@/components/page-container";
import { PageHeader } from "@/components/page-header";
import { CategoryPill } from "@/components/badges";
import { getIndexableTagGroups } from "@/lib/tags";
import { toTagView, type TagView } from "@/lib/tag-view-lib";
import { trackEvent } from "@/lib/analytics";
import { normalizeSearchQuery } from "@/data/search";
import {
  tagsIndexBrowseEgressAnalyticsData,
  tagsIndexBrowseEgressAnalyticsEvent,
  tagsIndexBrowseEgressDestination,
  tagsIndexFilterAnalyticsData,
  tagsIndexFilterAnalyticsEvent,
  tagsIndexTagSelectAnalyticsData,
  tagsIndexTagSelectAnalyticsEvent,
  tagsIndexTagSelectDestination,
  type TagsIndexTagVariant,
} from "@/lib/tags-index-cta-events";
import { breadcrumbScript, itemListScript } from "@/lib/seo-jsonld";
import { absoluteUrl } from "@/lib/seo";
import { cn } from "@/lib/utils";

const defaultSearch = {
  q: "",
};

const searchSchema = z.object({
  q: z.string().transform(normalizeSearchQuery).catch(defaultSearch.q).default(defaultSearch.q),
});

export const Route = createFileRoute("/tags/")({
  validateSearch: searchSchema,
  search: {
    middlewares: [stripSearchParams(defaultSearch)],
  },
  head: () => {
    const url = absoluteUrl("/tags");
    const title = "Browse Claude resources by tag — HeyClaude";
    const description =
      "Topic index for the HeyClaude directory: browse Claude Code MCP servers, agents, skills, hooks, commands, and rules by tag.";
    // Same indexable tags the page renders (featured strip + All topics grid).
    const tags = getIndexableTagGroups().map(toTagView);
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
      // BreadcrumbList + ItemList for every /tags/$tag link rendered below (#5631).
      scripts: [
        breadcrumbScript([
          { name: "Directory", path: "/browse" },
          { name: "Tags", path: "/tags" },
        ]),
        itemListScript(
          tags.map((tag) => ({
            name: tag.name,
            path: `/tags/${tag.slug}`,
          })),
          { name: "Claude resource tags" },
        ),
      ],
    };
  },
  component: TagsIndex,
});

// Derive a lightweight, sorted view-model (by entry count desc) with the category
// each tag mostly spans — enough context to make the index scannable.
function FeaturedTagCard({ tag, onSelect }: { tag: TagView; onSelect: () => void }) {
  const destination = tagsIndexTagSelectDestination(tag.slug);
  if (!destination) return null;
  return (
    <Link
      to={destination.to}
      params={destination.params}
      onClick={onSelect}
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

function TagPill({
  tag,
  strong,
  onSelect,
}: {
  tag: TagView;
  strong?: boolean;
  onSelect: () => void;
}) {
  const destination = tagsIndexTagSelectDestination(tag.slug);
  if (!destination) return null;
  return (
    <Link
      to={destination.to}
      params={destination.params}
      onClick={onSelect}
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
  const navigate = useNavigate({ from: Route.fullPath });
  const sp = Route.useSearch();
  const all = React.useMemo(() => getIndexableTagGroups().map(toTagView), []);
  // Debounce free-text query: local state drives the input; URL updates 250ms
  // after idle — same pattern as /browse (#5712).
  const [qInput, setQInput] = React.useState(sp.q);
  React.useEffect(() => {
    setQInput(sp.q);
  }, [sp.q]);
  React.useEffect(() => {
    if (qInput === sp.q) return;
    const t = window.setTimeout(() => {
      navigate({ search: (prev) => ({ ...prev, q: qInput }), replace: true });
    }, 250);
    return () => window.clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [qInput]);

  const q = sp.q;

  const filtered = React.useMemo(
    () => (q ? all.filter((t) => t.name.toLowerCase().includes(q) || t.slug.includes(q)) : all),
    [all, q],
  );

  const featured = all.slice(0, 8);
  // Subtle weighting: tags at/above the featured cutoff read as "strong" pills.
  const strongCutoff = featured[featured.length - 1]?.count ?? 0;

  const onTagSelect = React.useCallback((tag: TagView, variant: TagsIndexTagVariant) => {
    trackEvent(
      tagsIndexTagSelectAnalyticsEvent(),
      tagsIndexTagSelectAnalyticsData(tag.slug, tag.count, variant, tag.topCategory || undefined),
    );
  }, []);

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
          value={qInput}
          onChange={(e) => {
            const next = e.target.value;
            setQInput(next);
            const trimmed = next.trim();
            if (trimmed.length >= 2) {
              const needle = trimmed.toLowerCase();
              const matchCount = all.filter(
                (t) => t.name.toLowerCase().includes(needle) || t.slug.includes(needle),
              ).length;
              trackEvent(
                tagsIndexFilterAnalyticsEvent(),
                tagsIndexFilterAnalyticsData(trimmed.length, matchCount),
              );
            }
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
              <FeaturedTagCard
                key={tag.slug}
                tag={tag}
                onSelect={() => onTagSelect(tag, "featured")}
              />
            ))}
          </div>
        </section>
      )}

      <section className="mt-10">
        <div className="eyebrow">{q ? `${filtered.length} matching` : "All topics"}</div>
        {filtered.length > 0 ? (
          <div className="mt-4 flex flex-wrap gap-2">
            {filtered.map((tag) => (
              <TagPill
                key={tag.slug}
                tag={tag}
                strong={tag.count >= strongCutoff}
                onSelect={() => onTagSelect(tag, "pill")}
              />
            ))}
          </div>
        ) : (
          <p className="mt-4 text-sm text-ink-muted">
            No topics match “{qInput}”. Try a broader term, or{" "}
            {(() => {
              const destination = tagsIndexBrowseEgressDestination("browse");
              if (!destination) return "browse the full directory";
              return (
                <Link
                  to={destination.to}
                  className="text-ink underline"
                  onClick={() =>
                    trackEvent(
                      tagsIndexBrowseEgressAnalyticsEvent(),
                      tagsIndexBrowseEgressAnalyticsData(),
                    )
                  }
                >
                  browse the full directory
                </Link>
              );
            })()}
            .
          </p>
        )}
      </section>
    </PageContainer>
  );
}
