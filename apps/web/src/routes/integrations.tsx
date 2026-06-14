import { createFileRoute, Link } from "@tanstack/react-router";
import { INTEGRATIONS } from "@/data/integrations";
import { IntegrationCard } from "@/components/integration-card";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { breadcrumbScript, itemListScript } from "@/lib/seo-jsonld";
import { absoluteUrl } from "@/lib/seo";
import { ogImageUrl } from "@/lib/og-image";

export const Route = createFileRoute("/integrations")({
  head: () => ({
    meta: [
      { title: "Integrations — HeyClaude" },
      {
        name: "description",
        content:
          "Raycast, MCP, Cursor adapter, public API, feeds — all official HeyClaude surfaces.",
      },
      { property: "og:title", content: "HeyClaude integrations" },
      {
        property: "og:description",
        content: "Raycast extension, MCP server, Cursor adapter, REST API, and public feeds.",
      },
      { property: "og:url", content: absoluteUrl("/integrations") },
      {
        property: "og:image",
        content: ogImageUrl({ title: "HeyClaude integrations", eyebrow: "Integrations" }),
      },
      { property: "og:image:type", content: "image/png" },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "630" },
      {
        name: "twitter:image",
        content: ogImageUrl({ title: "HeyClaude integrations", eyebrow: "Integrations" }),
      },
    ],
    links: [{ rel: "canonical", href: absoluteUrl("/integrations") }],
    scripts: [
      breadcrumbScript([
        { name: "Directory", path: "/browse" },
        { name: "Integrations", path: "/integrations" },
      ]),
      itemListScript(
        INTEGRATIONS.map((it) => ({ name: it.name, path: `/integrations/${it.slug}` })),
        { name: "HeyClaude integrations" },
      ),
    ],
  }),
  component: IntegrationsPage,
});

function IntegrationsPage() {
  return (
    <div className="mx-auto max-w-[1200px] px-4 py-10 sm:px-6">
      <Breadcrumbs home items={[{ label: "Integrations" }]} />
      <div className="mt-4 eyebrow">Integrations</div>
      <h1 className="mt-2 max-w-3xl h-display-1 text-ink text-balance">
        HeyClaude, where you already work
      </h1>
      <p className="mt-4 max-w-2xl text-pretty text-base text-ink-muted sm:text-lg">
        The registry ships as an extension, a server, an API, and a set of public feeds — so Claude,
        Cursor, Windsurf, Codex, and Raycast can all read from the same source of truth.{" "}
        <Link to="/ecosystem" className="text-ink underline">
          See the ecosystem map
        </Link>
        .
      </p>
      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {INTEGRATIONS.map((i) => (
          <IntegrationCard key={i.slug} integration={i} />
        ))}
      </div>
      <div className="mt-10 flex flex-wrap items-center justify-between gap-4 rounded-xl border border-border bg-surface p-6">
        <div>
          <div className="eyebrow">Build on the registry</div>
          <h2 className="mt-1 font-display text-xl font-semibold text-ink">
            Want to ship your own integration?
          </h2>
          <p className="mt-1 max-w-lg text-sm text-ink-muted">
            Every public feed is schema-versioned with SHA-256 contracts. Pull from the API or the
            manifest and register your downstream consumer in the ecosystem feed.
          </p>
        </div>
        <Link
          to="/api-docs"
          className="inline-flex h-10 items-center rounded-md bg-ink px-4 text-sm font-medium text-background hover:bg-ink/90"
        >
          Open the API docs
        </Link>
      </div>
    </div>
  );
}
