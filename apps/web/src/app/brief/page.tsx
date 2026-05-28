import type { Metadata } from "next";
import Link from "next/link";

import { Breadcrumbs } from "@/components/breadcrumbs";
import { JsonLd } from "@/components/json-ld";
import { NewsletterSignup } from "@/components/newsletter-signup";
import { getGrowthSurfaces } from "@/lib/growth-surfaces";
import { buildPageMetadata } from "@/lib/seo";
import { withDuration } from "@/lib/server-page-logging";
import { siteConfig } from "@/lib/site";
import {
  buildBreadcrumbJsonLd,
  buildCollectionPageJsonLd,
  buildItemListJsonLd,
} from "@heyclaude/registry/seo";

export const revalidate = 300;

export const metadata: Metadata = buildPageMetadata({
  title: "Weekly Claude workflow brief",
  description:
    "Subscribe to a practical weekly Claude workflow brief built from new, source-backed, trusted, and trending HeyClaude registry signals.",
  path: "/brief",
});

export default async function WeeklyBriefPage() {
  return withDuration("brief.page", async ({ getDurationMs, logger }) => {
    const surfaces = await getGrowthSurfaces();
    const featured = [
      ...surfaces.newThisWeek,
      ...surfaces.recentlyVerified,
      ...surfaces.safeInstall,
    ].filter(
      (entry, index, list) =>
        list.findIndex(
          (item) =>
            item.category === entry.category && item.slug === entry.slug,
        ) === index,
    );
    const groups = [
      ["New this week", surfaces.newThisWeek],
      ["Recently verified", surfaces.recentlyVerified],
      ["Safe install signals", surfaces.safeInstall],
      ["Source-backed picks", surfaces.sourceBacked],
    ] as const;
    const jsonLd = [
      buildBreadcrumbJsonLd([
        { name: "Home", url: siteConfig.url },
        { name: "Brief", url: `${siteConfig.url}/brief` },
      ]),
      buildCollectionPageJsonLd({
        siteUrl: siteConfig.url,
        path: "/brief",
        name: "Weekly Claude workflow brief",
        description:
          "A recurring editorial surface built from current HeyClaude registry signals.",
        breadcrumbId: `${siteConfig.url}/brief#breadcrumb`,
      }),
      buildItemListJsonLd(
        featured.slice(0, 12).map((entry) => ({
          name: entry.title,
          url: `${siteConfig.url}/${entry.category}/${entry.slug}`,
        })),
        {
          name: "Weekly Claude workflow brief picks",
          description:
            "New, trusted, source-backed, and practical Claude workflow resources.",
        },
      ),
    ];

    logger.info("summary", {
      durationMs: getDurationMs(),
      featuredCount: featured.length,
      newThisWeekCount: surfaces.newThisWeek.length,
      recentlyVerifiedCount: surfaces.recentlyVerified.length,
      safeInstallCount: surfaces.safeInstall.length,
      sourceBackedCount: surfaces.sourceBacked.length,
    });

    return (
      <main className="container-shell space-y-10 py-12">
        <JsonLd data={jsonLd} />
        <section className="space-y-4 border-b border-border/80 pb-8">
          <Breadcrumbs
            items={[{ label: "Home", href: "/" }, { label: "Brief" }]}
          />
          <span className="eyebrow">Weekly brief</span>
          <h1 className="section-title text-balance">
            Claude workflow updates worth actually checking.
          </h1>
          <p className="max-w-3xl text-sm leading-8 text-muted-foreground">
            A compact brief generated from registry changes, trust signals,
            source-backed updates, and practical install surfaces. The goal is
            to surface useful Claude Code, MCP, skill, hook, and command
            resources without turning the directory into a low-signal feed.
          </p>
          <div className="flex flex-wrap gap-2">
            <Link
              href="/trending"
              className="inline-flex items-center rounded-full border border-border bg-card px-4 py-2 text-sm text-foreground transition hover:border-primary/40"
            >
              Open trending
            </Link>
            <Link
              href="/best/agent-workflow-starter-kits"
              className="inline-flex items-center rounded-full border border-border bg-card px-4 py-2 text-sm text-foreground transition hover:border-primary/40"
            >
              Workflow starter kits
            </Link>
            <Link
              href="/browse?utility=trusted-package"
              className="inline-flex items-center rounded-full border border-border bg-card px-4 py-2 text-sm text-foreground transition hover:border-primary/40"
            >
              Safe install picks
            </Link>
          </div>
        </section>

        <section className="grid gap-4 lg:grid-cols-[1fr_22rem]">
          <div className="space-y-8">
            {groups
              .filter(([, entries]) => entries.length > 0)
              .map(([title, entries]) => (
                <section key={title} className="space-y-3">
                  <h2 className="text-2xl font-semibold tracking-tight text-foreground">
                    {title}
                  </h2>
                  <div className="grid gap-3 md:grid-cols-2">
                    {entries.slice(0, 6).map((entry) => (
                      <Link
                        key={`${title}:${entry.category}:${entry.slug}`}
                        href={`/${entry.category}/${entry.slug}`}
                        className="rounded-2xl border border-border bg-card p-4 transition hover:border-primary/45"
                      >
                        <p className="text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
                          {entry.category}
                        </p>
                        <p className="mt-2 text-sm font-semibold text-foreground">
                          {entry.title}
                        </p>
                        <p className="mt-2 line-clamp-2 text-xs leading-6 text-muted-foreground">
                          {entry.cardDescription || entry.description}
                        </p>
                      </Link>
                    ))}
                  </div>
                </section>
              ))}
          </div>

          <aside className="surface-panel h-fit p-5">
            <p className="text-xs uppercase tracking-[0.18em] text-primary">
              Distribution
            </p>
            <h2 className="mt-2 text-xl font-semibold tracking-tight text-foreground">
              Subscribe for the brief.
            </h2>
            <p className="mt-3 text-sm leading-7 text-muted-foreground">
              Weekly means selective: new useful entries, trust metadata
              changes, practical install picks, and contributor work that
              materially improves the registry.
            </p>
            <div className="mt-5">
              <NewsletterSignup source="brief" />
            </div>
          </aside>
        </section>
      </main>
    );
  });
}
