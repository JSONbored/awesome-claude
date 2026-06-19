import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { absoluteUrl } from "@/lib/seo";
import { breadcrumbScript, itemListScript } from "@/lib/seo-jsonld";
import { BEST_LISTS, ENTRIES } from "@/data/entries";
import { ResourceCard } from "@/components/resource-card";
import { PageContainer } from "@/components/page-container";
import { PageHeader } from "@/components/page-header";

export const Route = createFileRoute("/best/")({
  head: () => ({
    meta: [
      { title: "Best of HeyClaude — curated Claude workflow lists" },
      {
        name: "description",
        content:
          "Editorial best-of lists for Claude Code MCP servers, agents, skills, hooks, and rules.",
      },
      { property: "og:title", content: "Best of HeyClaude" },
      {
        property: "og:description",
        content: "Curated picks for Claude Code, MCP, agents, skills, and more.",
      },
      { property: "og:url", content: absoluteUrl("/best") },
    ],
    links: [{ rel: "canonical", href: absoluteUrl("/best") }],
    scripts: [
      breadcrumbScript([
        { name: "Directory", path: "/browse" },
        { name: "Best", path: "/best" },
      ]),
      itemListScript(
        BEST_LISTS.map((list) => ({ name: list.title, path: `/best/${list.slug}` })),
        { name: "Best of HeyClaude" },
      ),
    ],
  }),
  component: BestPage,
});

function BestPage() {
  const featured = BEST_LISTS[0];
  const featuredPicks = featured.picks
    .map((p) => {
      const [cat, slug] = p.ref.split("/");
      return ENTRIES.find((e) => e.category === cat && e.slug === slug);
    })
    .filter((e): e is NonNullable<typeof e> => e !== undefined);

  return (
    <PageContainer className="py-12">
      <PageHeader
        eyebrow="Best lists · editorial"
        title="Curated for real workflows"
        description="Tightly scoped picks for specific jobs. Every list explains why each entry made the cut and what you'd reach for instead."
      />

      <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2">
        {BEST_LISTS.map((b) => {
          const previewTitles = b.picks
            .slice(0, 3)
            .map((p) => {
              const [cat, slug] = p.ref.split("/");
              return ENTRIES.find((e) => e.category === cat && e.slug === slug)?.title;
            })
            .filter((t): t is string => !!t);
          return (
            <Link
              key={b.slug}
              to="/best/$slug"
              params={{ slug: b.slug }}
              className="group flex min-w-0 flex-col gap-3 rounded-xl border border-border bg-surface p-6 transition-colors duration-200 ease-out hover:bg-surface-2"
            >
              <div className="eyebrow">
                {b.picks.length} picks · {b.category}
              </div>
              <h2 className="font-display text-xl font-semibold text-ink">{b.title}</h2>
              <p className="text-sm text-ink-muted">{b.subtitle}</p>
              {previewTitles.length > 0 && (
                <ul className="space-y-1 border-t border-border pt-3 text-xs text-ink-muted">
                  {previewTitles.map((t, i) => (
                    <li key={t} className="flex items-baseline gap-2">
                      <span className="font-mono text-[10px] text-ink-subtle">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span className="truncate text-ink">{t}</span>
                    </li>
                  ))}
                  {b.picks.length > 3 && (
                    <li className="text-[11px] text-ink-subtle">+{b.picks.length - 3} more</li>
                  )}
                </ul>
              )}
              <div className="mt-auto flex items-center justify-between pt-2 text-xs text-ink-subtle">
                <span>Curated by {b.curator}</span>
                <span className="inline-flex items-center gap-1.5 text-ink-muted group-hover:text-ink">
                  Read list <ArrowRight className="h-4 w-4" />
                </span>
              </div>
            </Link>
          );
        })}
      </div>

      <h2 className="mt-16 h-display-2 text-ink text-balance">Editor's pick · {featured.title}</h2>
      <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {featuredPicks.map((e) => (
          <ResourceCard key={`${e.category}/${e.slug}`} entry={e} variant="grid" />
        ))}
      </div>
    </PageContainer>
  );
}
