import { Link } from "@tanstack/react-router";
import {
  ShieldCheck,
  Sparkles,
  FileText,
  GitBranch,
  Star,
  BadgeCheck,
  type LucideIcon,
} from "lucide-react";
import { TrustBadge, SourceBadge } from "@/components/badges";
import type { Highlight, HighlightKind, HubStat } from "@/lib/hub-highlights";

const HIGHLIGHT_ICON: Record<HighlightKind, LucideIcon> = {
  trusted: ShieldCheck,
  newest: Sparkles,
  documented: FileText,
  sourced: GitBranch,
  popular: Star,
  reviewed: BadgeCheck,
};

/**
 * Data-derived "highlights" strip for hub/tag/intersection pages. Each card is a real
 * registry entry surfaced for a specific, fact-based reason. The optional `caption`
 * lets each page frame the same primitive in page-specific prose.
 */
export function HubHighlights({
  highlights,
  caption,
}: {
  highlights: Highlight[];
  caption?: string;
}) {
  if (highlights.length < 2) return null;
  return (
    <section className="mt-10">
      <div className="flex items-baseline justify-between gap-3">
        <h2 className="h-display-2 text-ink">Highlights from this set</h2>
      </div>
      {caption && <p className="mt-2 max-w-2xl text-sm text-ink-muted">{caption}</p>}
      <ul className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {highlights.map((h) => {
          const Icon = HIGHLIGHT_ICON[h.kind];
          return (
            <li key={`${h.kind}-${h.entry.category}/${h.entry.slug}`}>
              <Link
                to="/entry/$category/$slug"
                params={{ category: h.entry.category, slug: h.entry.slug }}
                className="group flex h-full flex-col rounded-xl border border-border bg-surface p-4 transition-colors hover:border-ink/20 hover:bg-surface-2"
              >
                <div className="flex items-center gap-1.5 eyebrow">
                  <Icon className="h-3.5 w-3.5 text-accent" aria-hidden />
                  {h.label}
                </div>
                <div className="mt-2 font-display text-sm font-semibold text-ink group-hover:underline">
                  {h.entry.title}
                </div>
                <p className="mt-1 flex-1 text-xs text-ink-muted">{h.reason}</p>
                <div className="mt-3 flex flex-wrap items-center gap-1.5">
                  <TrustBadge level={h.entry.trust} />
                  <SourceBadge status={h.entry.source} />
                </div>
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

function StatBar({ stat }: { stat: HubStat }) {
  return (
    <div className="rounded-xl border border-border bg-surface p-4">
      <div className="flex items-baseline justify-between gap-2">
        <span className="text-xs font-medium text-ink-muted">{stat.label}</span>
        <span className="font-mono text-[11px] tabular-nums text-ink-subtle">{stat.pct}%</span>
      </div>
      <div className="mt-1 font-display text-2xl font-semibold tabular-nums text-ink">
        {stat.count}
      </div>
      <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-surface-2">
        <div className="h-full bg-ink" style={{ width: `${stat.pct}%` }} />
      </div>
    </div>
  );
}

/**
 * Signal coverage for a hub's entries — trust tier, source backing, safety/privacy
 * notes, review status. Every number is counted from the entries actually on the page,
 * so no two hubs render the same breakdown unless their data is genuinely identical.
 */
export function HubSignalStats({ stats, total }: { stats: HubStat[]; total: number }) {
  if (stats.length === 0 || total < 2) return null;
  return (
    <section className="mt-12">
      <h2 className="h-display-2 text-ink">Signal coverage</h2>
      <p className="mt-2 max-w-2xl text-sm text-ink-muted">
        How these {total} resources score on the trust and safety signals HeyClaude reviews —
        counted from this set, not the directory as a whole.
      </p>
      <div className="mt-5 grid gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {stats.map((s) => (
          <StatBar key={s.key} stat={s} />
        ))}
      </div>
    </section>
  );
}
