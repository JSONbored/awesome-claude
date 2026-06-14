import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowUpRight, BadgeCheck } from "lucide-react";
import { COMMERCIAL_TOOLS } from "@/data/tools";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { breadcrumbScript, itemListScript } from "@/lib/seo-jsonld";
import { absoluteUrl } from "@/lib/seo";
import { ogImageUrl } from "@/lib/og-image";

export const Route = createFileRoute("/tools")({
  head: () => ({
    meta: [
      { title: "Tools — HeyClaude" },
      {
        name: "description",
        content: "Commercial tools and platforms that work well with Claude.",
      },
      { property: "og:title", content: "Tools that pair well with Claude" },
      {
        property: "og:description",
        content:
          "Editorial picks and disclosed partners. Free, open-source resources live in the directory.",
      },
      { property: "og:url", content: absoluteUrl("/tools") },
      {
        property: "og:image",
        content: ogImageUrl({ title: "Tools that pair well with Claude", eyebrow: "Tools" }),
      },
      { property: "og:image:type", content: "image/png" },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "630" },
      {
        name: "twitter:image",
        content: ogImageUrl({ title: "Tools that pair well with Claude", eyebrow: "Tools" }),
      },
    ],
    links: [{ rel: "canonical", href: absoluteUrl("/tools") }],
    scripts: [
      breadcrumbScript([
        { name: "Directory", path: "/browse" },
        { name: "Tools", path: "/tools" },
      ]),
      itemListScript(
        COMMERCIAL_TOOLS.slice(0, 30).map((t) => ({
          name: t.name,
          path: `/entry/tools/${t.slug}`,
        })),
        { name: "Claude tools" },
      ),
    ],
  }),
  component: ToolsPage,
});

function ToolsPage() {
  return (
    <div className="mx-auto max-w-[1200px] px-4 py-10 sm:px-6">
      <Breadcrumbs home items={[{ label: "Tools" }]} />
      <div className="mt-4 flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="eyebrow">Commercial tools</div>
          <h1 className="mt-2 h-display-1 text-ink text-balance">
            Tools that pair well with Claude
          </h1>
          <p className="mt-2 max-w-2xl text-ink-muted">
            Editorial picks and disclosed partners. Free, open-source community resources live in{" "}
            <Link to="/browse" className="text-ink underline">
              the directory
            </Link>
            .
          </p>
        </div>
        <Link
          to="/tools/submit"
          className="inline-flex h-10 items-center rounded-md bg-ink px-4 text-sm font-medium text-background hover:bg-ink/90"
        >
          Submit a tool
        </Link>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {COMMERCIAL_TOOLS.map((t) => (
          <Link
            key={t.slug}
            to="/entry/$category/$slug"
            params={{ category: "tools", slug: t.slug }}
            className="group flex flex-col gap-3 rounded-xl border border-border bg-surface p-5 transition-colors duration-200 ease-out hover:bg-surface-2"
          >
            <div className="flex items-start justify-between gap-2">
              <div>
                <div className="font-display text-lg font-semibold text-ink">{t.name}</div>
                <div className="mt-0.5 text-xs text-ink-muted">
                  {t.category} · {t.pricingModel}
                </div>
              </div>
              <DisclosureBadge value={t.disclosure} />
            </div>
            <p className="line-clamp-3 text-sm text-ink-muted">{t.tagline}</p>
            <div className="mt-auto flex items-center justify-between text-xs text-ink-muted">
              <div className="flex flex-wrap gap-1">
                {t.tags.slice(0, 3).map((tag) => (
                  <span
                    key={tag}
                    className="rounded border border-border px-1.5 py-0.5 font-mono text-[10px]"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <span className="inline-flex items-center gap-1 text-ink group-hover:underline">
                Open <ArrowUpRight className="h-3 w-3" />
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

function DisclosureBadge({ value }: { value: string }) {
  const tone =
    value === "sponsored" || value === "affiliate"
      ? "text-trust-review border-trust-review/40"
      : "text-trust-trusted border-trust-trusted/40";
  return (
    <span
      className={`inline-flex items-center gap-1 rounded border bg-background px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-wider ${tone}`}
    >
      <BadgeCheck className="h-3 w-3" />
      {value.replace("_", " ")}
    </span>
  );
}
