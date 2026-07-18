import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { SUPPORTED_PLATFORMS, PLATFORM_MATRIX } from "@/data/platforms";
import { PLATFORM_LABEL, PLATFORM_SUPPORT_LABEL, type Platform } from "@/types/registry";
import { PageContainer } from "@/components/page-container";
import { PageHeader } from "@/components/page-header";
import { breadcrumbScript, itemListScript } from "@/lib/seo-jsonld";
import { absoluteUrl } from "@/lib/seo";
import { ogImageUrl } from "@/lib/og-image";
import { trackEvent } from "@/lib/analytics";
import {
  directoryPageEntryDestination,
  platformsMatrixEntryAnalyticsData,
  platformsMatrixEntryAnalyticsEvent,
} from "@/lib/directory-page-entry-cta-events";
import {
  platformsPageHubAnalyticsData,
  platformsPageHubAnalyticsEvent,
  platformsPageHubDestination,
} from "@/lib/platforms-page-cta-events";

// Same card for og:image and twitter:image; the inputs are static.
const OG_IMAGE = ogImageUrl({ title: "Platform compatibility", eyebrow: "Platforms" });

export const Route = createFileRoute("/platforms")({
  head: () => ({
    meta: [
      { title: "Platform compatibility — HeyClaude" },
      {
        name: "description",
        content: "Where each Claude resource works: Claude Code, Cursor, Windsurf, Codex, Gemini.",
      },
      { property: "og:title", content: "Platform compatibility — HeyClaude" },
      {
        property: "og:description",
        content:
          "Native skills, generated adapters, and manual-context fallbacks across every supported client.",
      },
      { property: "og:url", content: absoluteUrl("/platforms") },
      {
        property: "og:image",
        content: OG_IMAGE,
      },
      { property: "og:image:type", content: "image/png" },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "630" },
      {
        name: "twitter:image",
        content: OG_IMAGE,
      },
    ],
    links: [{ rel: "canonical", href: absoluteUrl("/platforms") }],
    scripts: [
      breadcrumbScript([
        { name: "Directory", path: "/browse" },
        { name: "Platforms", path: "/platforms" },
      ]),
      itemListScript(
        (Object.keys(PLATFORM_LABEL) as Platform[]).map((id) => ({
          name: PLATFORM_LABEL[id],
          path: `/for/${id}`,
        })),
        { name: "Claude platforms" },
      ),
    ],
  }),
  component: PlatformsPage,
});

function PlatformsPage() {
  return (
    <PageContainer>
      <PageHeader
        eyebrow="Compatibility"
        title="Platform support matrix"
        description="Native skills, generated adapters, and manual-context fallbacks across every supported client."
      />

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {SUPPORTED_PLATFORMS.map((p, cardIndex) => {
          const rows = PLATFORM_MATRIX[p.id] ?? [];
          const hubDestination = platformsPageHubDestination(p.id);
          return (
            <div key={p.id} className="rounded-xl border border-border bg-surface p-5">
              <div className="font-display text-base font-semibold text-ink">{p.label}</div>
              <p className="mt-1 text-xs text-ink-muted">{p.tagline}</p>
              <ul className="mt-4 space-y-2 text-xs">
                {rows.map((r, rowIndex) => {
                  const destination = directoryPageEntryDestination(r.category, r.slug);
                  if (!destination) {
                    return (
                      <li
                        key={`${r.category}/${r.slug}`}
                        className="flex items-center justify-between gap-2 border-t border-border pt-2 first:border-0 first:pt-0"
                      >
                        <span className="truncate text-ink">{r.title}</span>
                        <span className="shrink-0 rounded border border-border px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-wider text-ink-muted">
                          {PLATFORM_SUPPORT_LABEL[r.support]}
                        </span>
                      </li>
                    );
                  }
                  return (
                    <li
                      key={`${r.category}/${r.slug}`}
                      className="flex items-center justify-between gap-2 border-t border-border pt-2 first:border-0 first:pt-0"
                    >
                      <Link
                        to={destination.to}
                        params={destination.params}
                        onClick={() =>
                          trackEvent(
                            platformsMatrixEntryAnalyticsEvent(),
                            platformsMatrixEntryAnalyticsData(
                              r.category,
                              r.slug,
                              p.id,
                              r.support,
                              rowIndex,
                              rows.length,
                            ),
                          )
                        }
                        className="truncate text-ink hover:underline"
                      >
                        {r.title}
                      </Link>
                      <span className="shrink-0 rounded border border-border px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-wider text-ink-muted">
                        {PLATFORM_SUPPORT_LABEL[r.support]}
                      </span>
                    </li>
                  );
                })}
                {rows.length === 0 && <li className="text-ink-subtle">No entries yet.</li>}
              </ul>
              {hubDestination ? (
                <Link
                  to={hubDestination.to}
                  params={hubDestination.params}
                  onClick={() =>
                    trackEvent(
                      platformsPageHubAnalyticsEvent(),
                      platformsPageHubAnalyticsData(
                        p.id,
                        cardIndex,
                        SUPPORTED_PLATFORMS.length,
                        rows.length,
                      ),
                    )
                  }
                  className="mt-4 inline-flex items-center gap-1 text-[10px] font-medium uppercase tracking-wider text-ink-subtle transition-colors hover:text-ink"
                >
                  {PLATFORM_LABEL[p.id]} hub <ArrowRight className="h-3 w-3" />
                </Link>
              ) : null}
            </div>
          );
        })}
      </div>
    </PageContainer>
  );
}
