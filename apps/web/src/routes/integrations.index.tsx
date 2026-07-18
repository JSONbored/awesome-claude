import { createFileRoute, Link } from "@tanstack/react-router";
import { INTEGRATIONS } from "@/data/integrations";
import { IntegrationCard } from "@/components/integration-card";
import { PageContainer } from "@/components/page-container";
import { PageHeader } from "@/components/page-header";
import { trackEvent } from "@/lib/analytics";
import {
  integrationsIndexApiDocsAnalyticsData,
  integrationsIndexApiDocsAnalyticsEvent,
  integrationsIndexCardAnalyticsData,
  integrationsIndexCardAnalyticsEvent,
  integrationsIndexEcosystemAnalyticsData,
  integrationsIndexEcosystemAnalyticsEvent,
  integrationsIndexCardDestination,
  integrationsIndexChromeDestination,
} from "@/lib/integrations-hub-cta-events";
import { breadcrumbScript, itemListScript } from "@/lib/seo-jsonld";
import { absoluteUrl } from "@/lib/seo";
import { ogImageUrl } from "@/lib/og-image";

// Same card for og:image and twitter:image; the inputs are static.
const OG_IMAGE = ogImageUrl({ title: "HeyClaude integrations", eyebrow: "Integrations" });

export const Route = createFileRoute("/integrations/")({
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
    <PageContainer>
      <PageHeader
        eyebrow="Integrations"
        title="HeyClaude, where you already work"
        description={
          <>
            The registry ships as an extension, a server, an API, and a set of public feeds — so
            Claude, Cursor, Windsurf, Codex, and Raycast can all read from the same source of truth.{" "}
            {(() => {
              const destination = integrationsIndexChromeDestination("ecosystem");
              if (!destination) return <>See the ecosystem map</>;
              return (
                <Link
                  to={destination.to}
                  onClick={() =>
                    trackEvent(
                      integrationsIndexEcosystemAnalyticsEvent(),
                      integrationsIndexEcosystemAnalyticsData(INTEGRATIONS.length),
                    )
                  }
                  className="text-ink underline"
                >
                  See the ecosystem map
                </Link>
              );
            })()}
            .
          </>
        }
      />
      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {INTEGRATIONS.map((i, rowIndex) => (
          <IntegrationCard
            key={i.slug}
            integration={i}
            linkDestination={integrationsIndexCardDestination(i.slug)}
            onNavigate={() =>
              trackEvent(
                integrationsIndexCardAnalyticsEvent(),
                integrationsIndexCardAnalyticsData(
                  i.slug,
                  rowIndex,
                  INTEGRATIONS.length,
                  i.status,
                  i.kind,
                ),
              )
            }
          />
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
        {(() => {
          const destination = integrationsIndexChromeDestination("api-docs");
          if (!destination) return null;
          return (
            <Link
              to={destination.to}
              onClick={() =>
                trackEvent(
                  integrationsIndexApiDocsAnalyticsEvent(),
                  integrationsIndexApiDocsAnalyticsData(INTEGRATIONS.length),
                )
              }
              className="inline-flex h-10 items-center rounded-md bg-ink px-4 text-sm font-medium text-background hover:bg-ink/90"
            >
              Open the API docs
            </Link>
          );
        })()}
      </div>
    </PageContainer>
  );
}
