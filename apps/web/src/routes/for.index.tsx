import { createFileRoute, Link } from "@tanstack/react-router";
import { PLATFORM_LABEL, type Platform } from "@/types/registry";
import { search } from "@/data/search";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { stringifyJsonLd } from "@/lib/json-ld";
import { absoluteUrl } from "@/lib/seo";

const PLATFORMS = Object.keys(PLATFORM_LABEL) as Platform[];

export const Route = createFileRoute("/for/")({
  head: () => {
    const url = absoluteUrl("/for");
    const title = "Claude resources by platform — HeyClaude";
    const description =
      "Find Claude Code resources for your platform — Claude Code, Cursor, VS Code, Windsurf, Codex, Gemini, and more.";
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
              { "@type": "ListItem", position: 2, name: "Platforms", item: url },
            ],
          }),
        },
      ],
    };
  },
  component: PlatformsIndex,
});

function PlatformsIndex() {
  const counts = new Map<string, number>(
    PLATFORMS.map((p) => [p, search({ platforms: [p] }).length]),
  );
  return (
    <div className="mx-auto max-w-[1100px] px-4 py-10 sm:px-6">
      <Breadcrumbs items={[{ label: "Directory", to: "/browse" }, { label: "Platforms" }]} home />
      <header className="mt-6 max-w-3xl">
        <div className="eyebrow">{PLATFORMS.length} platforms</div>
        <h1 className="mt-2 h-display-1 text-ink text-balance">Claude resources by platform</h1>
        <p className="mt-4 text-pretty text-base text-ink-muted sm:text-lg">
          Pick your editor or runtime to see every compatible Claude resource in the directory.
        </p>
      </header>
      <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {PLATFORMS.map((p) => (
          <Link
            key={p}
            to="/for/$platform"
            params={{ platform: p }}
            className="group flex items-center justify-between rounded-xl border border-border bg-surface p-4 hover:bg-surface-2"
          >
            <span className="font-display text-base font-semibold text-ink">
              {PLATFORM_LABEL[p]}
            </span>
            <span className="font-mono text-xs text-ink-subtle">{counts.get(p) ?? 0}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
