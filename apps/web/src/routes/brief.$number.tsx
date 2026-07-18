import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { BriefSections, type BriefSectionsData } from "@/components/brief-sections";
import { trackEvent } from "@/lib/analytics";
import {
  briefIssueHubAnalyticsData,
  briefIssueHubAnalyticsEvent,
  briefIssueHubDestination,
} from "@/lib/brief-entry-cta-events";
import { parseBriefNumber } from "@/lib/brief-number-parse-lib";
import { absoluteUrl } from "@/lib/seo";

const loadBriefIssue = createServerFn({ method: "GET" })
  .inputValidator(z.object({ number: z.number().int() }))
  .handler(async ({ data }) => {
    const { getBriefByNumber } = await import("@/lib/brief-issues.server");
    const issue = await getBriefByNumber(data.number);
    if (!issue) return { found: false as const };
    const payload = issue.payload as {
      title?: string;
      theme?: string;
      note?: string;
      sections?: BriefSectionsData;
    };
    return {
      found: true as const,
      number: issue.number,
      periodThrough: issue.period_through,
      title: typeof payload.title === "string" ? payload.title : `Weekly Brief #${issue.number}`,
      theme: typeof payload.theme === "string" ? payload.theme : "",
      note: typeof payload.note === "string" ? payload.note : "",
      sections: payload.sections ?? {},
    };
  });

export const Route = createFileRoute("/brief/$number")({
  loader: async ({ params }) => {
    const number = parseBriefNumber(params.number);
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
  notFoundComponent: BriefIssueNotFound,
});

function BriefIssueNotFound() {
  return (
    <div className="mx-auto max-w-2xl px-6 py-24 text-center">
      <h1 className="h-display-2 text-ink">Issue not found</h1>
      {(() => {
        const destination = briefIssueHubDestination("brief");
        if (!destination) return null;
        return (
          <Link
            to={destination.to}
            onClick={() =>
              trackEvent(
                briefIssueHubAnalyticsEvent(),
                briefIssueHubAnalyticsData(null, "not-found"),
              )
            }
            className="mt-4 inline-block text-ink-muted hover:text-ink"
          >
            ← All Weekly Brief issues
          </Link>
        );
      })()}
    </div>
  );
}

function BriefIssuePage() {
  const issue = Route.useLoaderData();
  return (
    <div className="mx-auto max-w-[1100px] px-4 py-10 sm:px-6">
      <Breadcrumbs
        home
        items={[
          {
            label: "Weekly Brief",
            to: briefIssueHubDestination("brief")?.to,
            onClick: () =>
              trackEvent(
                briefIssueHubAnalyticsEvent(),
                briefIssueHubAnalyticsData(issue.number, "breadcrumb"),
              ),
          },
          { label: `Issue #${issue.number}` },
        ]}
      />
      <header className="mt-6 max-w-3xl">
        <div className="eyebrow text-ink-subtle">
          Issue #{String(issue.number).padStart(2, "0")} · Week of {issue.periodThrough}
        </div>
        <h1 className="mt-2 h-display-1 text-ink text-balance">{issue.title}</h1>
        {issue.found && issue.theme ? (
          <p className="mt-4 text-pretty text-lg text-ink-muted">{issue.theme}</p>
        ) : null}
      </header>
      {issue.found && issue.note ? (
        <div className="mt-6 max-w-3xl rounded-xl border-l-2 border-accent bg-surface p-5">
          <div className="eyebrow text-ink-subtle">From the editor</div>
          <p className="mt-1 whitespace-pre-wrap text-pretty text-ink">{issue.note}</p>
        </div>
      ) : null}
      <div className="mt-8">
        <BriefSections sections={issue.found ? issue.sections : {}} issueNumber={issue.number} />
      </div>
    </div>
  );
}
