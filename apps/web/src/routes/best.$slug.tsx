import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, CalendarDays, User } from "lucide-react";
import { BEST_LISTS, ENTRIES, type BestList, type BestPick } from "@/data/entries";
import type { Entry } from "@/types/registry";
import { ResourceCard } from "@/components/resource-card";
import { NewsletterInline } from "@/components/newsletter-inline";
import { stringifyJsonLd } from "@/lib/json-ld";
import { absoluteUrl } from "@/lib/seo";
import { ogImageUrl } from "@/lib/og-image";
import { breadcrumbScript } from "@/lib/seo-jsonld";

export const Route = createFileRoute("/best/$slug")({
  loader: ({ params }) => {
    const list = BEST_LISTS.find((b) => b.slug === params.slug);
    if (!list) throw notFound();
    return { list };
  },
  head: ({ params, loaderData }) => {
    if (!loaderData) return { meta: [] };
    const l = loaderData.list;
    const url = absoluteUrl(`/best/${params.slug}`);
    const ogImage = ogImageUrl({ title: l.title, eyebrow: "Best", description: l.seoDescription });
    const ld = {
      "@context": "https://schema.org",
      "@type": "ItemList",
      name: l.title,
      description: l.subtitle,
      numberOfItems: l.picks.length,
      itemListElement: l.picks.map((p, i) => ({
        "@type": "ListItem",
        position: i + 1,
        url: absoluteUrl(`/entry/${p.ref}`),
      })),
    };
    return {
      meta: [
        { title: `${l.seoTitle} — HeyClaude` },
        { name: "description", content: l.seoDescription },
        { property: "og:title", content: l.title },
        { property: "og:description", content: l.seoDescription },
        { property: "og:url", content: url },
        { property: "og:image", content: ogImage },
        { property: "og:type", content: "article" },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:image", content: ogImage },
      ],
      links: [{ rel: "canonical", href: url }],
      scripts: [
        { type: "application/ld+json", children: stringifyJsonLd(ld) },
        breadcrumbScript([
          { name: "Directory", path: "/browse" },
          { name: "Best", path: "/best" },
          { name: l.title, path: `/best/${params.slug}` },
        ]),
      ],
    };
  },
  notFoundComponent: () => (
    <div className="mx-auto max-w-2xl px-6 py-24 text-center">
      <h1 className="font-display text-3xl text-ink">List not found</h1>
      <Link to="/best" className="mt-4 inline-block text-ink-muted hover:text-ink">
        ← Back to all lists
      </Link>
    </div>
  ),
  component: BestDetail,
});

function BestDetail() {
  const { list } = Route.useLoaderData() as { list: BestList };

  type Resolved = BestPick & { entry: Entry };
  const resolved: Resolved[] = list.picks
    .map((p: BestPick): Resolved | null => {
      const [cat, slug] = p.ref.split("/");
      const entry = ENTRIES.find((e) => e.category === cat && e.slug === slug);
      return entry ? { ...p, entry } : null;
    })
    .filter((p): p is Resolved => p !== null);

  return (
    <div className="mx-auto max-w-[1100px] px-4 py-12 sm:px-6">
      <Link
        to="/best"
        className="inline-flex items-center gap-1.5 text-sm text-ink-muted hover:text-ink"
      >
        <ArrowLeft className="h-4 w-4" /> All best lists
      </Link>

      <div className="mt-6 eyebrow">
        {list.eyebrow} · {list.category} · {resolved.length} picks
      </div>
      <h1 className="mt-2 h-display-1 text-ink text-balance">{list.title}</h1>
      <p className="mt-4 max-w-2xl text-pretty text-lg text-ink-muted">{list.subtitle}</p>

      <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-ink-subtle">
        <span className="inline-flex items-center gap-1.5">
          <User className="h-3.5 w-3.5" /> Curated by {list.curator}
        </span>
        <span className="inline-flex items-center gap-1.5">
          <CalendarDays className="h-3.5 w-3.5" /> Updated {list.updatedAt}
        </span>
      </div>

      <blockquote className="mt-8 max-w-3xl border-l-2 border-accent pl-5">
        <p className="drop-cap text-pretty text-ink-muted">{list.intro}</p>
      </blockquote>

      <ol className="mt-10 flex flex-col gap-6 stagger-children">
        {resolved.map((p: Resolved, i: number) => (
          <li
            key={p.ref}
            className="surface-raised grid gap-4 rounded-xl border border-border bg-surface p-5 sm:grid-cols-[3rem_1fr]"
          >
            <div className="font-display text-4xl font-semibold leading-none tabular-nums text-ink-subtle">
              {String(i + 1).padStart(2, "0")}
            </div>
            <div className="flex flex-col gap-3">
              <ResourceCard entry={p.entry} variant="grid" />
              <div className="rounded-lg border border-border bg-surface-2 p-4 text-sm">
                <div className="eyebrow mb-1 text-accent-ink dark:text-accent">
                  Why it made the cut
                </div>
                <p className="text-pretty text-ink">{p.why}</p>
                {p.reachForInstead && (
                  <>
                    <div className="eyebrow mb-1 mt-3">Reach for instead</div>
                    <p className="text-pretty text-ink-muted">{p.reachForInstead}</p>
                  </>
                )}
              </div>
            </div>
          </li>
        ))}
      </ol>

      <div className="mt-12 flex items-center justify-between rounded-xl border border-dashed border-border p-5 text-sm">
        <p className="text-ink-muted">
          Missing a pick? Propose an edit to this list — every change goes through the same review
          queue as new entries.
        </p>
        <Link
          to="/submit"
          className="inline-flex h-9 items-center rounded-md bg-ink px-3 text-sm font-medium text-background hover:bg-ink/90"
        >
          Suggest a pick
        </Link>
      </div>

      <div className="mt-12">
        <NewsletterInline variant="card" source={`best:${list.slug}`} />
      </div>
    </div>
  );
}
