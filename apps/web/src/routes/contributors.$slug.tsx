import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowUpRight, Github } from "lucide-react";
import { getContributor, CONTRIBUTORS } from "@/data/contributors";
import { ENTRIES } from "@/data/entries";
import { ResourceCard } from "@/components/resource-card";
import { Monogram } from "@/components/monogram";
import { absoluteUrl } from "@/lib/seo";
import { stringifyJsonLd } from "@/lib/json-ld";
import { ogImageUrl } from "@/lib/og-image";

export const Route = createFileRoute("/contributors/$slug")({
  loader: ({ params }) => {
    const contributor = getContributor(params.slug);
    if (!contributor) throw notFound();
    return { contributor };
  },
  head: ({ params, loaderData }) => {
    const c = loaderData?.contributor;
    if (!c) return { meta: [{ title: "Contributor — HeyClaude" }] };
    const url = absoluteUrl(`/contributors/${params.slug}`);
    const name = c.name ?? c.handle ?? params.slug;
    const description =
      c.bio ?? `Resources contributed to the HeyClaude registry by ${name} (@${c.handle}).`;
    const ogImage = ogImageUrl({ title: name, eyebrow: "Contributor", description });
    const person = {
      "@context": "https://schema.org",
      "@type": "Person",
      "@id": `${url}#person`,
      name,
      url,
      ...(c.handle ? { alternateName: `@${c.handle}` } : {}),
      ...(c.bio ? { description: c.bio } : {}),
      ...(c.github ? { sameAs: [c.github] } : {}),
    };
    const profilePage = {
      "@context": "https://schema.org",
      "@type": "ProfilePage",
      url,
      mainEntity: { "@id": `${url}#person` },
    };
    const breadcrumbs = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Contributors",
          item: absoluteUrl("/contributors"),
        },
        { "@type": "ListItem", position: 2, name, item: url },
      ],
    };
    return {
      meta: [
        { title: `${name} — HeyClaude contributor` },
        { name: "description", content: description },
        { property: "og:title", content: `${name} — HeyClaude` },
        { property: "og:description", content: description },
        { property: "og:url", content: url },
        { property: "og:image", content: ogImage },
        { property: "og:image:type", content: "image/png" },
        { property: "og:image:width", content: "1200" },
        { property: "og:image:height", content: "630" },
        { property: "og:type", content: "profile" },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:image", content: ogImage },
      ],
      links: [{ rel: "canonical", href: url }],
      scripts: [
        { type: "application/ld+json", children: stringifyJsonLd(person) },
        { type: "application/ld+json", children: stringifyJsonLd(profilePage) },
        { type: "application/ld+json", children: stringifyJsonLd(breadcrumbs) },
      ],
    };
  },
  component: ContributorPage,
});

function ContributorPage() {
  const { contributor } = Route.useLoaderData();
  const entries = ENTRIES.filter(
    (e) => e.author === contributor.handle || e.submittedBy === contributor.handle,
  );
  const reviewed = ENTRIES.filter((e) => e.reviewedBy === contributor.handle);

  return (
    <div className="mx-auto max-w-[1100px] px-4 py-12 sm:px-6">
      <nav className="text-xs text-ink-muted">
        <Link to="/contributors" className="hover:text-ink">
          Contributors
        </Link>
        <span className="mx-1.5">/</span>
        <span className="text-ink">{contributor.handle}</span>
      </nav>

      <header className="mt-6 flex flex-wrap items-start gap-6 border-b border-border pb-8">
        <Monogram name={contributor.name || contributor.handle} size={72} />
        <div className="flex-1">
          <div className="eyebrow">Contributor</div>
          <h1 className="mt-1 h-display-1 text-ink text-balance">{contributor.name}</h1>
          {contributor.bio && (
            <p className="mt-3 max-w-2xl text-pretty text-base text-ink-muted">{contributor.bio}</p>
          )}
          <div className="mt-4 flex flex-wrap items-center gap-2 text-xs">
            <span className="rounded-md border border-border bg-surface px-2 py-0.5 font-mono text-ink-muted">
              @{contributor.handle}
            </span>
            <span className="rounded-md border border-border bg-surface px-2 py-0.5 text-ink-muted">
              {contributor.acceptedCount} accepted
            </span>
            {contributor.github && (
              <a
                href={contributor.github}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 rounded-md border border-border bg-surface px-2 py-0.5 text-ink-muted hover:text-ink"
              >
                <Github className="h-3 w-3" /> GitHub <ArrowUpRight className="h-3 w-3" />
              </a>
            )}
          </div>
        </div>
      </header>

      <section className="mt-10">
        <h2 className="font-display text-xl font-semibold tracking-tight text-ink">
          Authored ({entries.length})
        </h2>
        {entries.length === 0 ? (
          <p className="mt-3 text-sm text-ink-muted">No authored entries yet.</p>
        ) : (
          <div className="mt-4 divide-y divide-border overflow-hidden rounded-xl border border-border bg-surface">
            {entries.map((e) => (
              <ResourceCard key={`${e.category}-${e.slug}`} entry={e} variant="row" />
            ))}
          </div>
        )}
      </section>

      {reviewed.length > 0 && (
        <section className="mt-10">
          <h2 className="font-display text-xl font-semibold tracking-tight text-ink">
            Reviewed ({reviewed.length})
          </h2>
          <div className="mt-4 divide-y divide-border overflow-hidden rounded-xl border border-border bg-surface">
            {reviewed.map((e) => (
              <ResourceCard key={`r-${e.category}-${e.slug}`} entry={e} variant="row" />
            ))}
          </div>
        </section>
      )}

      <div className="mt-12 rounded-xl border border-border bg-surface p-6 text-sm text-ink-muted">
        Want to contribute?{" "}
        <Link to="/submit" className="text-ink underline">
          Submit a resource
        </Link>{" "}
        — every accepted entry credits its author and submitter.
      </div>

      <div className="mt-6 flex flex-wrap gap-2 text-xs text-ink-subtle">
        Other contributors:{" "}
        {CONTRIBUTORS.filter((c) => c.slug !== contributor.slug).map((c) => (
          <Link
            key={c.slug}
            to="/contributors/$slug"
            params={{ slug: c.slug }}
            className="text-ink-muted hover:text-ink"
          >
            {c.handle}
          </Link>
        ))}
      </div>
    </div>
  );
}
