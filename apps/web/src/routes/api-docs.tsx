import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { ENDPOINTS, OPENAPI_TAGS } from "@/data/openapi";
import { OpenApiEndpointCard, MethodPill } from "@/components/openapi";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/api-docs")({
  head: () => ({
    meta: [
      { title: "API documentation — HeyClaude" },
      {
        name: "description",
        content: "Public REST API for the HeyClaude registry, with live read-only examples.",
      },
      { property: "og:title", content: "HeyClaude API docs" },
      {
        property: "og:description",
        content:
          "Search, trending, manifest, integrity, diff, submissions, and generated OpenAPI specs.",
      },
    ],
  }),
  component: ApiDocsPage,
});

function ApiDocsPage() {
  const [q, setQ] = useState("");
  const filtered = useMemo(
    () =>
      ENDPOINTS.filter(
        (e) =>
          !q ||
          e.path.toLowerCase().includes(q.toLowerCase()) ||
          e.summary.toLowerCase().includes(q.toLowerCase()),
      ),
    [q],
  );

  return (
    <div className="mx-auto max-w-[1400px] px-4 py-8 sm:px-6">
      <div className="grid gap-8 lg:grid-cols-[260px_1fr]">
        <aside className="lg:sticky lg:top-20 lg:self-start">
          <div className="eyebrow">API · v1</div>
          <h1 className="mt-2 h-display-2 text-ink text-balance">Reference</h1>
          <p className="mt-2 text-xs text-ink-muted">
            Public read endpoints — no auth required. Rate-limited per IP. Verify artifact integrity
            via the registry manifest.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <a
              href="/openapi.json"
              className="rounded-md border border-border bg-surface px-2.5 py-1 text-xs text-ink hover:bg-surface-2"
            >
              OpenAPI JSON
            </a>
            <a
              href="/openapi.yaml"
              className="rounded-md border border-border bg-surface px-2.5 py-1 text-xs text-ink hover:bg-surface-2"
            >
              OpenAPI YAML
            </a>
          </div>
          <div className="mt-4 relative">
            <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-ink-subtle" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Filter endpoints"
              className="h-8 w-full rounded-md border border-border bg-surface pl-8 pr-2 text-xs text-ink focus:outline-none focus:ring-2 focus:ring-accent/40"
            />
          </div>
          <nav className="mt-5 space-y-5 text-sm">
            {OPENAPI_TAGS.map((tag) => {
              const inTag = filtered.filter((e) => e.tag === tag.id);
              if (inTag.length === 0) return null;
              return (
                <div key={tag.id}>
                  <div className="eyebrow mb-2">{tag.label}</div>
                  <ul className="space-y-1">
                    {inTag.map((e) => (
                      <li key={e.id}>
                        <a
                          href={`#${e.id}`}
                          className="flex items-center gap-2 rounded px-1 py-0.5 text-xs text-ink-muted hover:bg-surface-2 hover:text-ink"
                        >
                          <MethodPill method={e.method} />
                          <span className="truncate font-mono">{e.path}</span>
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </nav>
          <div className="mt-6 rounded-md border border-border bg-surface p-3 text-[11px] text-ink-muted">
            <div className="eyebrow mb-1">Integrity-aware sync</div>
            Use{" "}
            <Link to="/api-docs" hash="registry-diff" className="underline">
              /api/registry/diff
            </Link>{" "}
            with a cursor, then verify against the SHA-256 in{" "}
            <Link to="/api-docs" hash="registry-manifest" className="underline">
              /api/registry/manifest
            </Link>
            .
          </div>
        </aside>

        <div>
          {OPENAPI_TAGS.map((tag) => {
            const inTag = filtered.filter((e) => e.tag === tag.id);
            if (inTag.length === 0) return null;
            return (
              <section key={tag.id} className={cn("mb-12")}>
                <div className="eyebrow">{tag.label}</div>
                <h2 className="mt-1 h-display-2 text-ink text-balance">{tag.blurb}</h2>
                <div className="mt-5 space-y-6">
                  {inTag.map((e) => (
                    <OpenApiEndpointCard key={e.id} endpoint={e} />
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      </div>
    </div>
  );
}
