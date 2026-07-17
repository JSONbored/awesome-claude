import { Link } from "@tanstack/react-router";
import {
  PlatformChip,
  InstallRiskBadge,
  NotesPresenceChips,
  SourceBadge,
} from "@/components/badges";
import { HarnessBadgeRow } from "@/components/harness-badge";
import { trackEvent } from "@/lib/analytics";
import {
  hubCategoryRankingEntryAnalyticsData,
  hubCategoryRankingEntryAnalyticsEvent,
} from "@/lib/hub-entry-cta-events";
import type { Entry } from "@/types/registry";

/**
 * Scannable, rows-as-entries data table for a category hub. Every cell is
 * rendered from the entry's own reviewed metadata (source provenance, install
 * risk, install availability, platform support, safety/privacy disclosure) so
 * the page is a dense, citeable comparison rather than a card wall. Ordering is
 * the hub's existing metadata-review ranking — never repo popularity.
 */
export function CategoryRankingTable({ entries, label }: { entries: Entry[]; label: string }) {
  if (entries.length < 3) return null;

  return (
    <section className="mt-12">
      <h2 className="h-display-2 text-ink">Top {label}, compared</h2>
      <p className="mt-2 max-w-3xl text-sm text-ink-muted">
        The leading {label.toLowerCase()} side by side on the signals that matter before you install
        — source provenance, install risk, setup, and disclosed safety notes. Ordered by
        HeyClaude&apos;s metadata review, not by repo popularity.
      </p>
      <div className="mt-5 overflow-x-auto rounded-xl border border-border">
        <table className="w-full min-w-[44rem] border-collapse text-left">
          <caption className="sr-only">
            Top Claude {label} compared by source, install risk, setup, platform support, harness,
            and disclosed notes.
          </caption>
          <thead className="bg-surface">
            <tr>
              {["Resource", "Source", "Install risk", "Setup", "Platforms", "Harness", "Notes"].map(
                (head) => (
                <th
                  key={head}
                  scope="col"
                  className="border-b border-border px-3 py-2.5 text-xs font-semibold text-ink-muted"
                >
                  {head}
                </th>
                ),
              )}
            </tr>
          </thead>
          <tbody>
            {entries.map((e, i) => (
              <tr key={`${e.category}/${e.slug}`} className={i % 2 === 1 ? "bg-surface-2/30" : ""}>
                <th scope="row" className="px-3 py-2.5 align-top">
                  <Link
                    to="/entry/$category/$slug"
                    params={{ category: e.category, slug: e.slug }}
                    onClick={() =>
                      trackEvent(
                        hubCategoryRankingEntryAnalyticsEvent(),
                        hubCategoryRankingEntryAnalyticsData(e.category, e.slug, i, entries.length),
                      )
                    }
                    className="story-link text-sm font-medium text-ink"
                  >
                    {e.title}
                  </Link>
                  <div className="mt-0.5 text-xs text-ink-subtle">{e.author}</div>
                </th>
                <td className="px-3 py-2.5 align-top">
                  <SourceBadge status={e.source} asLink surface="category-ranking" />
                </td>
                <td className="px-3 py-2.5 align-top">
                  <InstallRiskBadge entry={e} asLink surface="category-ranking" />
                </td>
                <td className="px-3 py-2.5 align-top">
                  {e.installCommand ? (
                    <span className="text-xs text-ink">
                      <span className="mr-1 text-trust-trusted">✓</span>
                      one-line install
                    </span>
                  ) : (
                    <span className="text-xs text-ink-subtle">—</span>
                  )}
                </td>
                <td className="px-3 py-2.5 align-top">
                  <div className="flex flex-wrap gap-1">
                    {e.platforms.slice(0, 3).map((p) => (
                      <PlatformChip key={p} id={p} asLink surface="category-ranking" />
                    ))}
                    {e.platforms.length > 3 ? (
                      <span className="text-xs text-ink-subtle">+{e.platforms.length - 3}</span>
                    ) : null}
                  </div>
                </td>
                <td className="px-3 py-2.5 align-top">
                  {e.harness && e.harness.length > 0 ? (
                    <HarnessBadgeRow ids={e.harness} asLink surface="category-ranking" />
                  ) : (
                    <span className="text-xs text-ink-subtle">—</span>
                  )}
                </td>
                <td className="px-3 py-2.5 align-top">
                  <NotesPresenceChips entry={e} asLink surface="category-ranking" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
