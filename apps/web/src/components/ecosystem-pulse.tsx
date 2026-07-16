import { Link } from "@tanstack/react-router";
import { GitCommit, Users } from "lucide-react";
import { CategoryPill } from "./badges";
import { trackEvent } from "@/lib/analytics";
import {
  homePulseChangelogEgressAnalyticsData,
  homePulseChangelogEgressAnalyticsEvent,
  homePulseChangelogRowAnalyticsData,
  homePulseChangelogRowAnalyticsEvent,
  homePulseContributorClickAnalyticsData,
  homePulseContributorClickAnalyticsEvent,
  homePulseContributorsIndexAnalyticsData,
  homePulseContributorsIndexAnalyticsEvent,
} from "@/lib/home-page-cta-events";

export type EcosystemPulseData = {
  recent: Array<{
    ref: string;
    kind: string;
    category?: string;
    title: string;
    date: string;
  }>;
  topContributors: Array<{
    slug: string;
    name: string;
    acceptedCount?: number;
  }>;
  counts: Record<string, number>;
};

const KIND_DOT: Record<string, string> = {
  added: "bg-trust-trusted",
  updated: "bg-accent",
  removed: "bg-trust-blocked",
};

export function EcosystemPulse({ data }: { data: EcosystemPulseData }) {
  const { recent, topContributors, counts } = data;
  return (
    <div className="flex flex-col gap-4">
      <div className="rounded-xl border border-border bg-surface">
        <div className="flex items-center justify-between border-b border-border px-4 py-3">
          <div className="flex items-center gap-2">
            <GitCommit className="h-3.5 w-3.5 text-ink-muted" />
            <div className="eyebrow">Registry pulse</div>
          </div>
          <Link
            to="/changelog"
            onClick={() =>
              trackEvent(
                homePulseChangelogEgressAnalyticsEvent(),
                homePulseChangelogEgressAnalyticsData(),
              )
            }
            className="text-xs text-ink-muted hover:text-ink"
          >
            Changelog →
          </Link>
        </div>
        <div className="flex items-center gap-4 border-b border-border px-4 py-3 text-xs tabular-nums">
          <span className="text-ink-muted">
            <span className="font-mono font-semibold text-ink">{counts.added ?? 0}</span> added
          </span>
          <span className="text-ink-muted">
            <span className="font-mono font-semibold text-ink">{counts.updated ?? 0}</span> updated
          </span>
          <span className="text-ink-muted">
            <span className="font-mono font-semibold text-ink">{counts.removed ?? 0}</span> removed
          </span>
          <span className="ml-auto text-ink-subtle">last 14 days</span>
        </div>
        <ul className="divide-y divide-border">
          {recent.map((c, rowIndex) => {
            const slash = c.ref.indexOf("/");
            const category = slash > 0 ? c.ref.slice(0, slash) : null;
            const slug = slash > 0 ? c.ref.slice(slash + 1) : null;
            const inner = (
              <>
                <span
                  aria-hidden
                  className={`mt-0.5 inline-block h-1.5 w-1.5 shrink-0 rounded-full ${KIND_DOT[c.kind] ?? "bg-ink-subtle"}`}
                />
                {c.category ? <CategoryPill>{c.category}</CategoryPill> : null}
                <span className="line-clamp-1 flex-1 text-ink">{c.title}</span>
                <span className="font-mono text-[11px] text-ink-subtle">{c.date.slice(5)}</span>
              </>
            );
            return (
              <li key={c.ref}>
                {category && slug ? (
                  <Link
                    to="/entry/$category/$slug"
                    params={{ category, slug }}
                    onClick={() =>
                      trackEvent(
                        homePulseChangelogRowAnalyticsEvent(),
                        homePulseChangelogRowAnalyticsData(c.kind, rowIndex, recent.length),
                      )
                    }
                    className="flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-surface-2"
                  >
                    {inner}
                  </Link>
                ) : (
                  <Link
                    to="/changelog"
                    onClick={() =>
                      trackEvent(
                        homePulseChangelogRowAnalyticsEvent(),
                        homePulseChangelogRowAnalyticsData(c.kind, rowIndex, recent.length),
                      )
                    }
                    className="flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-surface-2"
                  >
                    {inner}
                  </Link>
                )}
              </li>
            );
          })}
        </ul>
      </div>

      <div className="rounded-xl border border-border bg-surface">
        <div className="flex items-center justify-between border-b border-border px-4 py-3">
          <div className="flex items-center gap-2">
            <Users className="h-3.5 w-3.5 text-ink-muted" />
            <div className="eyebrow">Top contributors</div>
          </div>
          <Link
            to="/contributors"
            onClick={() =>
              trackEvent(
                homePulseContributorsIndexAnalyticsEvent(),
                homePulseContributorsIndexAnalyticsData(),
              )
            }
            className="text-xs text-ink-muted hover:text-ink"
          >
            All →
          </Link>
        </div>
        <ul className="divide-y divide-border">
          {topContributors.map((c, rowIndex) => (
            <li key={c.slug}>
              <Link
                to="/contributors/$slug"
                params={{ slug: c.slug }}
                onClick={() =>
                  trackEvent(
                    homePulseContributorClickAnalyticsEvent(),
                    homePulseContributorClickAnalyticsData(
                      c.slug,
                      rowIndex,
                      topContributors.length,
                    ),
                  )
                }
                className="flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-surface-2"
              >
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-surface-2 font-mono text-[10px] font-semibold uppercase text-ink-muted">
                  {c.name.slice(0, 2)}
                </span>
                <span className="flex-1 truncate text-ink">{c.name}</span>
                <span className="font-mono text-[11px] text-ink-subtle">
                  {c.acceptedCount ?? 0} accepted
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
