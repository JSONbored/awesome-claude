import { createFileRoute, Link } from "@tanstack/react-router";
import { PLATFORM_LABEL, type Platform } from "@/types/registry";
import { ENTRIES } from "@/data/entries";
import { PageContainer } from "@/components/page-container";
import { PageHeader } from "@/components/page-header";
import { trackEvent } from "@/lib/analytics";
import {
  platformIndexSelectAnalyticsData,
  platformIndexSelectAnalyticsEvent,
  platformIndexSelectDestination,
} from "@/lib/directory-hub-cta-events";
import { breadcrumbScript, itemListScript } from "@/lib/seo-jsonld";
import { absoluteUrl } from "@/lib/seo";

const PLATFORMS = Object.keys(PLATFORM_LABEL) as Platform[];

// Per-platform entry counts via a single pass over the static registry, computed
// once at module load — was one full search() (filter+sort) per platform on
// every SSR render of /for.
const PLATFORM_COUNTS = new Map<string, number>(PLATFORMS.map((p) => [p, 0]));
for (const entry of ENTRIES) {
  for (const platform of entry.platforms ?? []) {
    if (PLATFORM_COUNTS.has(platform)) {
      PLATFORM_COUNTS.set(platform, (PLATFORM_COUNTS.get(platform) ?? 0) + 1);
    }
  }
}

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
      // BreadcrumbList + ItemList for every /for/$platform link rendered below —
      // same platform set /platforms already emits (#5630).
      scripts: [
        breadcrumbScript([
          { name: "Directory", path: "/browse" },
          { name: "Platforms", path: "/for" },
        ]),
        itemListScript(
          PLATFORMS.map((id) => ({
            name: PLATFORM_LABEL[id],
            path: `/for/${id}`,
          })),
          { name: "Claude platforms" },
        ),
      ],
    };
  },
  component: PlatformsIndex,
});

function PlatformsIndex() {
  const counts = PLATFORM_COUNTS;
  return (
    <PageContainer>
      <PageHeader
        breadcrumbs={[{ label: "Directory", to: "/browse" }]}
        eyebrow={`${PLATFORMS.length} platforms`}
        title="Claude resources by platform"
        description="Pick your editor or runtime to see every compatible Claude resource in the directory."
      />
      <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {PLATFORMS.map((p, rowIndex) => {
          const destination = platformIndexSelectDestination(p);
          if (!destination) return null;
          return (
            <Link
              key={p}
              to={destination.to}
              params={destination.params}
              onClick={() =>
                trackEvent(
                  platformIndexSelectAnalyticsEvent(),
                  platformIndexSelectAnalyticsData(
                    p,
                    counts.get(p) ?? 0,
                    rowIndex,
                    PLATFORMS.length,
                  ),
                )
              }
              className="group flex items-center justify-between rounded-xl border border-border bg-surface p-4 hover:bg-surface-2"
            >
              <span className="font-display text-base font-semibold text-ink">
                {PLATFORM_LABEL[p]}
              </span>
              <span className="font-mono text-xs text-ink-subtle">{counts.get(p) ?? 0}</span>
            </Link>
          );
        })}
      </div>
    </PageContainer>
  );
}
