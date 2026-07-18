import { createFileRoute, Link } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { Calendar } from "lucide-react";
import { BRIEF_ISSUES, WEEKLY_BRIEF } from "@/data/entries";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { NewsletterInline } from "@/components/newsletter-inline";
import { trackEvent } from "@/lib/analytics";
import {
  briefEntryAnalyticsEvent,
  briefHubEntryAnalyticsData,
  briefHubIssueAnalyticsData,
  briefHubIssueAnalyticsEvent,
  briefHubLatestIssueAnalyticsData,
  briefHubLatestIssueAnalyticsEvent,
  briefHubStaticIssueAnalyticsData,
  briefHubStaticIssueAnalyticsEvent,
  briefIssueHubAnalyticsData,
  briefIssueHubAnalyticsEvent,
  briefHubIssueDestination,
  type BriefHubSectionId,
} from "@/lib/brief-entry-cta-events";
import { absoluteUrl } from "@/lib/seo";

type PublishedBriefSummary = { number: number; periodThrough: string; title: string };

// Published (approved/sent) issues from D1. Empty until the first brief is
// approved, at which point the archive lists real persisted issues.
const loadPublishedBriefs = createServerFn({ method: "GET" }).handler(
  async (): Promise<PublishedBriefSummary[]> => {
    const { listPublishedBriefs } = await import("@/lib/brief-issues.server");
    const issues = await listPublishedBriefs(24);
    return issues.map((issue) => {
      const payload = issue.payload as { title?: string };
      return {
        number: issue.number,
        periodThrough: issue.period_through,
        title: typeof payload.title === "string" ? payload.title : `Weekly Brief #${issue.number}`,
      };
    });
  },
);

export const Route = createFileRoute("/brief")({
  loader: () => loadPublishedBriefs(),
  head: () => ({
    meta: [
      { title: "Weekly Brief — HeyClaude" },
      {
        name: "description",
        content: "Weekly Brief on Claude Code, MCP, agents, and reviewed workflows.",
      },
      { property: "og:title", content: "HeyClaude Weekly Brief" },
      {
        property: "og:description",
        content: "Reviewed picks, what shipped, and what to watch. No hype.",
      },
      { property: "og:url", content: absoluteUrl("/brief") },
    ],
    links: [{ rel: "canonical", href: absoluteUrl("/brief") }],
  }),
  component: BriefPage,
});

const latest = BRIEF_ISSUES[0];

function BriefPage() {
  const published = Route.useLoaderData();
  return (
    <div className="mx-auto max-w-[1100px] px-4 py-10 sm:px-6">
      <Breadcrumbs home items={[{ label: "Weekly Brief" }]} />
      <div className="mt-4 grid gap-10 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="min-w-0">
          <div className="eyebrow flex items-center gap-1.5">
            <Calendar className="h-3 w-3" /> Weekly Brief
          </div>
          <h1 className="mt-2 h-display-1 text-ink text-balance">
            One concise read on Claude workflows.
          </h1>
          <p className="mt-4 max-w-2xl text-pretty text-base text-ink-muted sm:text-lg">
            Reviewed picks, what shipped, and what to watch. Sundays. No hype, no listicle filler.
          </p>

          {latest &&
            (() => {
              const destination = briefHubIssueDestination(latest.number);
              if (!destination) return null;
              return (
                <Link
                  to={destination.to}
                  params={destination.params}
                  onClick={() =>
                    trackEvent(
                      briefHubLatestIssueAnalyticsEvent(),
                      briefHubLatestIssueAnalyticsData(
                        latest.number,
                        WEEKLY_BRIEF.newEntries.length +
                          WEEKLY_BRIEF.trustedInstalls.length +
                          WEEKLY_BRIEF.sourceBackedPicks.length,
                      ),
                    )
                  }
                  className="mt-10 block overflow-hidden rounded-2xl border border-accent/30 bg-gradient-to-br from-surface to-accent/[0.06] surface-raised transition-[border-color,background-color] duration-200 ease-out hover:border-accent/50 hover:bg-accent/[0.08]"
                >
                  <article>
                    <div className="grid gap-0 sm:grid-cols-[120px_minmax(0,1fr)]">
                      <div className="flex flex-col items-center justify-center border-b border-accent/20 bg-accent/[0.04] p-5 sm:border-b-0 sm:border-r">
                        <div className="eyebrow text-ink-subtle">Issue</div>
                        <div className="font-display text-5xl font-semibold leading-none tracking-tight text-ink">
                          {String(latest.number).padStart(2, "0")}
                        </div>
                        <div className="mt-2 font-mono text-[11px] text-ink-subtle">
                          {latest.date}
                        </div>
                      </div>
                      <div className="p-6">
                        <div className="eyebrow text-accent-ink dark:text-accent">Latest issue</div>
                        <h2 className="mt-1 h-display-2 text-ink text-balance">{latest.title}</h2>
                        <p className="mt-2 text-pretty text-sm text-ink-muted">{latest.summary}</p>
                        <div className="mt-5 grid gap-3 sm:grid-cols-3">
                          <BriefMetric label="New entries" value={WEEKLY_BRIEF.newEntries.length} />
                          <BriefMetric
                            label="Trusted installs"
                            value={WEEKLY_BRIEF.trustedInstalls.length}
                          />
                          <BriefMetric
                            label="Source-backed picks"
                            value={WEEKLY_BRIEF.sourceBackedPicks.length}
                          />
                        </div>
                        <div className="mt-4 flex flex-wrap gap-1.5">
                          {latest.tags.map((t) => (
                            <span
                              key={t}
                              className="inline-flex rounded-md border border-border bg-background px-2 py-0.5 text-[11px] text-ink-muted"
                            >
                              #{t}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </article>
                </Link>
              );
            })()}

          <div className="mt-8 grid gap-5 md:grid-cols-3">
            <BriefList
              title="New in the registry"
              sectionId="new-entries"
              items={WEEKLY_BRIEF.newEntries}
            />
            <BriefList
              title="Trusted installs"
              sectionId="trusted-installs"
              items={WEEKLY_BRIEF.trustedInstalls}
            />
            <BriefList
              title="Source-backed picks"
              sectionId="source-backed-picks"
              items={WEEKLY_BRIEF.sourceBackedPicks}
            />
          </div>

          <div className="mt-12 flex items-end justify-between border-b border-border pb-3">
            <h2 className="font-display text-xl font-semibold tracking-tight text-ink">Archive</h2>
            <span className="font-mono text-[11px] text-ink-subtle">
              {published.length > 0 ? published.length : BRIEF_ISSUES.length - 1} past issues
            </span>
          </div>
          {published.length > 0 ? (
            <ol className="mt-4 space-y-3 stagger-children">
              {published.map((issue: PublishedBriefSummary, rowIndex: number) => {
                const destination = briefHubIssueDestination(issue.number);
                if (!destination) return null;
                return (
                  <li
                    key={issue.number}
                    className="group hover-lift rounded-xl border border-border bg-surface p-5 transition-[border-color,background-color] duration-200 ease-out hover:border-ink/20 hover:bg-surface-2"
                  >
                    <Link
                      to={destination.to}
                      params={destination.params}
                      onClick={() =>
                        trackEvent(
                          briefHubIssueAnalyticsEvent(),
                          briefHubIssueAnalyticsData(issue.number, rowIndex, published.length),
                        )
                      }
                      className="block"
                    >
                      <div className="flex items-center justify-between text-xs text-ink-subtle">
                        <span className="font-mono">
                          Issue #{String(issue.number).padStart(2, "0")}
                        </span>
                        <span>{issue.periodThrough}</span>
                      </div>
                      <h3 className="mt-2 font-display text-lg font-semibold text-ink transition-colors duration-200 ease-out group-hover:text-ink-hover">
                        {issue.title}
                      </h3>
                    </Link>
                  </li>
                );
              })}
            </ol>
          ) : (
            <ol className="mt-4 space-y-3 stagger-children">
              {BRIEF_ISSUES.slice(1).map((b, rowIndex) => {
                const destination = briefHubIssueDestination(b.number);
                if (!destination) return null;
                return (
                  <li
                    key={b.slug}
                    className="group hover-lift rounded-xl border border-border bg-surface p-5 transition-[border-color,background-color] duration-200 ease-out hover:border-ink/20 hover:bg-surface-2"
                  >
                    <Link
                      to={destination.to}
                      params={destination.params}
                      onClick={() =>
                        trackEvent(
                          briefHubStaticIssueAnalyticsEvent(),
                          briefHubStaticIssueAnalyticsData(
                            b.number,
                            rowIndex,
                            BRIEF_ISSUES.length - 1,
                          ),
                        )
                      }
                      className="block"
                    >
                      <div className="flex items-center justify-between text-xs text-ink-subtle">
                        <span className="font-mono">
                          Issue #{String(b.number).padStart(2, "0")}
                        </span>
                        <span>{b.date}</span>
                      </div>
                      <h3 className="mt-2 font-display text-lg font-semibold text-ink transition-colors duration-200 ease-out group-hover:text-ink-hover">
                        {b.title}
                      </h3>
                      <p className="mt-1 text-pretty text-sm text-ink-muted">{b.summary}</p>
                      <div className="mt-3 flex flex-wrap gap-1.5">
                        {b.tags.map((t) => (
                          <span
                            key={t}
                            className="inline-flex rounded-md border border-border bg-background px-2 py-0.5 text-[11px] text-ink-muted"
                          >
                            #{t}
                          </span>
                        ))}
                      </div>
                    </Link>
                  </li>
                );
              })}
            </ol>
          )}
        </div>

        <aside className="lg:sticky lg:top-20 lg:self-start">
          <NewsletterInline
            variant="card"
            title="Subscribe"
            description="Free, weekly, one read. Reviewed Claude workflow picks delivered every Sunday."
            cadence="Weekly · Sundays"
            source="brief"
          />
          <div className="mt-5 rounded-xl border border-border bg-surface p-5 text-xs text-ink-muted">
            <div className="eyebrow mb-2">What to expect</div>
            <ul className="space-y-1.5">
              <li>· 5–7 reviewed picks across MCP, skills, hooks, and commands</li>
              <li>· What changed in the registry this week</li>
              <li>· One workflow walkthrough worth stealing</li>
              <li>· Open roles from teams building with Claude</li>
            </ul>
          </div>
        </aside>
      </div>
    </div>
  );
}

function BriefMetric({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-lg border border-border bg-background p-3">
      <div className="font-mono text-lg font-semibold tabular-nums text-ink">{value}</div>
      <div className="text-[10px] uppercase tracking-wider text-ink-subtle">{label}</div>
    </div>
  );
}

function BriefList({
  title,
  sectionId,
  items,
}: {
  title: string;
  sectionId: BriefHubSectionId;
  items: Array<{ ref: string; title: string; reason?: string; date?: string }>;
}) {
  return (
    <section className="rounded-xl border border-border bg-surface p-5">
      <h2 className="font-display text-base font-semibold text-ink">{title}</h2>
      <ul className="mt-4 divide-y divide-border/60 text-sm">
        {items.map((item, rowIndex) => (
          <li key={item.ref} className="py-3 first:pt-0 last:pb-0">
            <a
              href={`/entry/${item.ref}`}
              onClick={() =>
                trackEvent(
                  briefEntryAnalyticsEvent(),
                  briefHubEntryAnalyticsData(item.ref, sectionId, rowIndex, items.length),
                )
              }
              className="font-medium text-ink hover:underline"
            >
              {item.title}
            </a>
            <div className="mt-1 font-mono text-[11px] text-ink-subtle">{item.ref}</div>
            {(item.reason || item.date) && (
              <p className="mt-1.5 text-xs text-ink-muted">{item.reason ?? item.date}</p>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}
