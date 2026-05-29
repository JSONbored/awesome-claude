import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { getCommercialTool } from "@/mocks/tools";
import { Breadcrumbs } from "@/components/breadcrumbs";

export const Route = createFileRoute("/tools/$slug")({
  loader: ({ params }) => {
    const tool = getCommercialTool(params.slug);
    if (!tool) throw notFound();
    return { tool };
  },
  head: ({ loaderData }) => {
    if (!loaderData) return { meta: [] };
    const tool = loaderData.tool;
    return {
      meta: [
        { title: `${tool.name} — HeyClaude tools` },
        { name: "description", content: tool.description },
        { property: "og:title", content: `${tool.name} — HeyClaude tools` },
        { property: "og:description", content: tool.description },
      ],
    };
  },
  component: ToolDetail,
});

function ToolDetail() {
  const { tool } = Route.useLoaderData();
  const href = tool.affiliateUrl ?? tool.websiteUrl;

  return (
    <div className="mx-auto max-w-[900px] px-4 py-10 sm:px-6">
      <Breadcrumbs home items={[{ label: "Tools", to: "/tools" }, { label: tool.name }]} />
      <Link to="/tools" className="mt-6 inline-flex items-center gap-1.5 text-sm text-ink-muted hover:text-ink">
        <ArrowLeft className="h-4 w-4" /> Back to tools
      </Link>

      <section className="mt-6 rounded-2xl border border-border bg-surface p-6">
        <div className="eyebrow">{tool.category} · {tool.pricingModel}</div>
        <h1 className="mt-3 h-display-1 text-ink text-balance">{tool.name}</h1>
        <p className="mt-4 text-lg text-ink-muted">{tool.tagline}</p>
        <p className="mt-5 max-w-2xl text-sm leading-7 text-ink-muted">{tool.description}</p>
        <div className="mt-5 flex flex-wrap gap-2">
          {tool.tags.map((tag) => (
            <span key={tag} className="rounded-md border border-border bg-background px-2 py-1 font-mono text-xs text-ink-muted">
              {tag}
            </span>
          ))}
        </div>
        <div className="mt-8 flex flex-wrap items-center gap-3">
          <a
            href={href}
            target="_blank"
            rel="noreferrer"
            className="inline-flex h-10 items-center gap-1.5 rounded-md bg-ink px-4 text-sm font-medium text-background hover:bg-ink/90"
          >
            Open website <ArrowUpRight className="h-4 w-4" />
          </a>
          <span className="text-xs text-ink-subtle">
            Disclosure: {tool.disclosure.replace("_", " ")}
          </span>
        </div>
      </section>
    </div>
  );
}
