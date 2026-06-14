import { createFileRoute, Link } from "@tanstack/react-router";
import { SUPPORTED_PLATFORMS, PLATFORM_MATRIX } from "@/data/platforms";
import { PLATFORM_LABEL, PLATFORM_SUPPORT_LABEL, type Platform } from "@/types/registry";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { breadcrumbScript, itemListScript } from "@/lib/seo-jsonld";
import { absoluteUrl } from "@/lib/seo";
import { ogImageUrl } from "@/lib/og-image";

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
        content: ogImageUrl({ title: "Platform compatibility", eyebrow: "Platforms" }),
      },
      { property: "og:image:type", content: "image/png" },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "630" },
      {
        name: "twitter:image",
        content: ogImageUrl({ title: "Platform compatibility", eyebrow: "Platforms" }),
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
    <div className="mx-auto max-w-[1100px] px-4 py-10 sm:px-6">
      <Breadcrumbs home items={[{ label: "Platforms" }]} />
      <div className="mt-4 eyebrow">Compatibility</div>
      <h1 className="mt-2 h-display-1 text-ink text-balance">Platform support matrix</h1>
      <p className="mt-2 max-w-2xl text-ink-muted">
        Native skills, generated adapters, and manual-context fallbacks across every supported
        client.
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {SUPPORTED_PLATFORMS.map((p) => {
          const rows = PLATFORM_MATRIX[p.id] ?? [];
          return (
            <div key={p.id} className="rounded-xl border border-border bg-surface p-5">
              <div className="font-display text-base font-semibold text-ink">{p.label}</div>
              <p className="mt-1 text-xs text-ink-muted">{p.tagline}</p>
              <ul className="mt-4 space-y-2 text-xs">
                {rows.map((r) => (
                  <li
                    key={`${r.category}/${r.slug}`}
                    className="flex items-center justify-between gap-2 border-t border-border pt-2 first:border-0 first:pt-0"
                  >
                    <Link
                      to="/entry/$category/$slug"
                      params={{ category: r.category, slug: r.slug }}
                      className="truncate text-ink hover:underline"
                    >
                      {r.title}
                    </Link>
                    <span className="shrink-0 rounded border border-border px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-wider text-ink-muted">
                      {PLATFORM_SUPPORT_LABEL[r.support]}
                    </span>
                  </li>
                ))}
                {rows.length === 0 && <li className="text-ink-subtle">No entries yet.</li>}
              </ul>
              <div className="mt-4 text-[10px] uppercase tracking-wider text-ink-subtle">
                {PLATFORM_LABEL[p.id]}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
