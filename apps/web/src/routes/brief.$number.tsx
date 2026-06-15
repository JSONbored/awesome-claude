import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { BriefSections, type BriefSectionsData } from "@/components/brief-sections";
import { absoluteUrl } from "@/lib/seo";

const loadBriefIssue = createServerFn({ method: "GET" })
  .inputValidator(z.object({ number: z.number().int() }))
  .handler(async ({ data }) => {
    const { getBriefByNumber } = await import("@/lib/brief-issues.server");
    const issue = await getBriefByNumber(data.number);
    if (!issue) return { found: false as const };
    const payload = issue.payload as { title?: string; sections?: BriefSectionsData };
    return {
      found: true as const,
      number: issue.number,
      periodThrough: issue.period_through,
      title: typeof payload.title === "string" ? payload.title : `Weekly Brief #${issue.number}`,
      sections: payload.sections ?? {},
    };
  });

function parseNumber(value: string): number {
  return /^\d+$/.test(value) ? Number(value) : NaN;
}

export const Route = createFileRoute("/brief/$number")({
  loader: async ({ params }) => {
    const number = parseNumber(params.number);
    if (!Number.isInteger(number)) throw notFound();
    const issue = await loadBriefIssue({ data: { number } });
    if (!issue.found) throw notFound();
    return issue;
  },
  head: ({ loaderData }) => {
    if (!loaderData || !loaderData.found) return { meta: [] };
    const url = absoluteUrl(`/brief/${loaderData.number}`);
    const description = `Weekly Brief #${loaderData.number} — reviewed Claude workflow picks and registry changes for the week of ${loaderData.periodThrough}.`;
    return {
      meta: [
        { title: `${loaderData.title} — HeyClaude Weekly Brief` },
        { name: "description", content: description },
        { property: "og:title", content: loaderData.title },
        { property: "og:description", content: description },
        { property: "og:url", content: url },
        { property: "og:type", content: "article" },
      ],
      links: [{ rel: "canonical", href: url }],
    };
  },
  component: BriefIssuePage,
  notFoundComponent: () => (
    <div className="mx-auto max-w-2xl px-6 py-24 text-center">
      <h1 className="h-display-2 text-ink">Issue not found</h1>
      <Link to="/brief" className="mt-4 inline-block text-ink-muted hover:text-ink">
        ← All Weekly Brief issues
      </Link>
    </div>
  ),
});

function BriefIssuePage() {
  const issue = Route.useLoaderData();
  return (
    <div className="mx-auto max-w-[1100px] px-4 py-10 sm:px-6">
      <Breadcrumbs
        home
        items={[{ label: "Weekly Brief", to: "/brief" }, { label: `Issue #${issue.number}` }]}
      />
      <header className="mt-6 max-w-3xl">
        <div className="eyebrow text-ink-subtle">
          Issue #{String(issue.number).padStart(2, "0")} · Week of {issue.periodThrough}
        </div>
        <h1 className="mt-2 h-display-1 text-ink text-balance">{issue.title}</h1>
      </header>
      <div className="mt-8">
        <BriefSections sections={issue.found ? issue.sections : {}} />
      </div>
    </div>
  );
}
