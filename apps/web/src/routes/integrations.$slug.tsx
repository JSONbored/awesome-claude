import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import { getIntegration, INTEGRATIONS } from "@/data/integrations";
import { IntegrationMarkTile } from "@/components/integration-marks";
import { IntegrationCard } from "@/components/integration-card";
import { LiveVersionBadge } from "@/components/live-version-badge";
import { CopyButton } from "@/components/copy-button";

export const Route = createFileRoute("/integrations/$slug")({
  loader: ({ params }) => {
    const integration = getIntegration(params.slug);
    if (!integration) throw notFound();
    return { integration };
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          { title: `${loaderData.integration.name} — HeyClaude integration` },
          { name: "description", content: loaderData.integration.tagline },
          { property: "og:title", content: `${loaderData.integration.name} — HeyClaude` },
          { property: "og:description", content: loaderData.integration.tagline },
        ]
      : [],
  }),
  component: IntegrationDetail,
});

function IntegrationDetail() {
  const { integration } = Route.useLoaderData();
  const related = INTEGRATIONS.filter((i) => i.slug !== integration.slug).slice(0, 3);

  return (
    <div className="mx-auto max-w-[1100px] px-4 py-10 sm:px-6">
      <nav className="text-xs text-ink-muted">
        <Link to="/integrations" className="hover:text-ink">
          Integrations
        </Link>
        <span className="mx-1.5">/</span>
        <span className="text-ink">{integration.slug}</span>
      </nav>

      <header className="mt-6 flex flex-wrap items-start gap-6 border-b border-border pb-8">
        <IntegrationMarkTile name={integration.mark} size={80} />
        <div className="flex-1">
          <div className="eyebrow">{integration.tier}</div>
          <h1 className="mt-1 font-display text-4xl font-semibold tracking-tight text-ink">
            {integration.name}
          </h1>
          <p className="mt-2 max-w-2xl text-ink-muted">{integration.tagline}</p>
          <div className="mt-4 flex flex-wrap gap-2">
            <a
              href={integration.primaryAction.href}
              target="_blank"
              rel="noreferrer"
              className="inline-flex h-9 items-center gap-1.5 rounded-md bg-ink px-3 text-sm font-medium text-background hover:bg-ink/90"
            >
              {integration.primaryAction.label} <ArrowUpRight className="h-3.5 w-3.5" />
            </a>
            {integration.secondaryAction && (
              <a
                href={integration.secondaryAction.href}
                target="_blank"
                rel="noreferrer"
                className="inline-flex h-9 items-center gap-1.5 rounded-md border border-border bg-surface px-3 text-sm text-ink hover:bg-surface-2"
              >
                {integration.secondaryAction.label}
              </a>
            )}
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3 text-xs">
          {integration.npmPackage ? (
            <div className="col-span-2">
              <LiveVersionBadge
                pkg={integration.npmPackage}
                fallbackVersion={integration.version}
                fallbackUpdatedAt={integration.updatedAt}
              />
            </div>
          ) : null}
          <Meta label="Status" value={integration.status} />
          <Meta label="Version" value={integration.version ?? "—"} />
          <Meta label="Updated" value={integration.updatedAt ?? "—"} />
          <Meta label="Kind" value={integration.kind} />
        </div>
      </header>

      <section className="mt-8 grid gap-8 lg:grid-cols-[1fr_320px]">
        <div className="space-y-6">
          <Block title="What it gives you">
            <ul className="space-y-2 text-sm text-ink-muted">
              {integration.bullets.map((b: string) => (
                <li key={b} className="flex gap-2">
                  <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-ink" />
                  {b}
                </li>
              ))}
            </ul>
          </Block>

          {integration.install && integration.install.length > 0 && (
            <Block title="Install">
              <div className="space-y-3">
                {integration.install.map((i: { client: string; snippet: string }) => (
                  <div key={i.client} className="rounded-md border border-border bg-surface">
                    <div className="flex items-center justify-between border-b border-border px-3 py-1.5">
                      <span className="text-xs font-medium text-ink">{i.client}</span>
                      <CopyButton value={i.snippet} label="Copy" />
                    </div>
                    <pre className="overflow-auto p-3 font-mono text-[11px] text-ink">
                      <code>{i.snippet}</code>
                    </pre>
                  </div>
                ))}
              </div>
            </Block>
          )}

          {integration.trustPosture && (
            <Block title="Trust posture">
              <p className="text-sm text-ink-muted">{integration.trustPosture}</p>
            </Block>
          )}
        </div>

        <aside className="space-y-4">
          <div className="rounded-xl border border-border bg-surface p-4 text-xs text-ink-muted">
            <div className="eyebrow mb-2">All integrations are read-only by default</div>
            HeyClaude integrations consume the registry. Writes (submissions, claims, paid
            placements) route through reviewed flows on the site, never through extensions.
          </div>
          <div>
            <div className="eyebrow mb-2">Related</div>
            <div className="space-y-3">
              {related.map((r) => (
                <IntegrationCard key={r.slug} integration={r} compact />
              ))}
            </div>
          </div>
        </aside>
      </section>
    </div>
  );
}

function Meta({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border border-border bg-surface px-2.5 py-1.5">
      <div className="text-[10px] uppercase tracking-wider text-ink-subtle">{label}</div>
      <div className="font-mono text-xs text-ink">{value}</div>
    </div>
  );
}

function Block({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-xl border border-border bg-surface p-5">
      <h2 className="font-display text-base font-semibold tracking-tight text-ink">{title}</h2>
      <div className="mt-3">{children}</div>
    </section>
  );
}
