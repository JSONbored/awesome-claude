import * as React from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import {
  CategoryPill,
  PlatformChip,
  InstallRiskBadge,
  NotesPresenceChips,
} from "@/components/badges";
import { TrustDrilldown } from "@/components/trust-drilldown";
import { CopyButton } from "@/components/copy-button";
import { SourceCitations } from "@/components/source-citations";
import { formatCompact } from "@/lib/format";
import type { Entry } from "@/types/registry";

export interface RowDef {
  label: string;
  render: (e: Entry) => React.ReactNode;
}

/** Shared comparison field definitions — used by the interactive /compare page and curated pages. */
export const COMPARISON_ROWS: RowDef[] = [
  { label: "Trust", render: (e) => <TrustDrilldown entry={e} /> },
  { label: "Install risk", render: (e) => <InstallRiskBadge entry={e} /> },
  { label: "Notes", render: (e) => <NotesPresenceChips entry={e} /> },
  { label: "Category", render: (e) => <CategoryPill>{e.category}</CategoryPill> },
  {
    label: "Source",
    render: (e) => <span className="text-sm capitalize text-ink">{e.source}</span>,
  },
  { label: "Author", render: (e) => <span className="text-sm text-ink">{e.author}</span> },
  {
    label: "Added",
    render: (e) => <span className="font-mono text-xs text-ink-muted">{e.dateAdded}</span>,
  },
  {
    label: "Platforms",
    render: (e) => (
      <div className="flex flex-wrap gap-1">
        {e.platforms.map((p) => (
          <PlatformChip key={p} id={p} />
        ))}
      </div>
    ),
  },
  {
    label: "Source repo",
    render: (e) => (
      <span className="font-mono text-sm tabular-nums text-ink">
        {e.repoStats?.stars !== undefined ? `${formatCompact(e.repoStats.stars)} repo stars` : "—"}
      </span>
    ),
  },
  {
    label: "Safety notes",
    render: (e) =>
      e.safetyNotes ? (
        <span className="text-xs text-ink">
          <span className="mr-1 text-trust-trusted">✓</span>
          <span className="line-clamp-3">{e.safetyNotes}</span>
        </span>
      ) : (
        <span className="text-xs text-ink-subtle">— missing</span>
      ),
  },
  {
    label: "Privacy notes",
    render: (e) =>
      e.privacyNotes ? (
        <span className="text-xs text-ink">
          <span className="mr-1 text-trust-trusted">✓</span>
          <span className="line-clamp-3">{e.privacyNotes}</span>
        </span>
      ) : (
        <span className="text-xs text-ink-subtle">— missing</span>
      ),
  },
  {
    label: "Prerequisites",
    render: (e) =>
      e.prerequisites && e.prerequisites.length > 0 ? (
        <ul className="list-disc space-y-0.5 pl-4 text-xs text-ink-muted">
          {e.prerequisites.slice(0, 4).map((p) => (
            <li key={p}>{p}</li>
          ))}
        </ul>
      ) : (
        <span className="text-xs text-ink-subtle">— none listed</span>
      ),
  },
  {
    label: "Install",
    render: (e) =>
      e.installCommand ? (
        <div className="space-y-1.5">
          <pre className="max-h-24 overflow-auto rounded-md bg-background p-2 font-mono text-[11px] text-ink">
            <code>{e.installCommand}</code>
          </pre>
          <CopyButton value={e.installCommand} label="Copy install" />
        </div>
      ) : (
        <span className="text-xs text-ink-subtle">—</span>
      ),
  },
  {
    label: "Config",
    render: (e) =>
      e.configSnippet ? (
        <div className="space-y-1.5">
          <pre className="max-h-24 overflow-auto rounded-md bg-background p-2 font-mono text-[11px] text-ink">
            <code>{e.configSnippet}</code>
          </pre>
          <CopyButton value={e.configSnippet} label="Copy config" />
        </div>
      ) : (
        <span className="text-xs text-ink-subtle">—</span>
      ),
  },
  {
    label: "Citations",
    render: (e) => (
      <div className="text-xs">
        <SourceCitations entry={e} />
      </div>
    ),
  },
  {
    label: "Claim",
    render: (e) => (
      <span className="text-xs text-ink-muted">{e.claimed ? "Claimed" : "Unclaimed"}</span>
    ),
  },
];

/** Static side-by-side comparison table (no add/remove controls) for curated comparison pages. */
export function ComparisonTable({ entries }: { entries: Entry[] }) {
  return (
    <div className="overflow-auto rounded-xl border border-border">
      <table className="w-full border-collapse text-sm">
        <thead className="bg-surface">
          <tr>
            <th
              scope="col"
              className="sticky left-0 z-10 w-[150px] border-b border-r border-border bg-surface p-3 text-left text-xs uppercase tracking-wider text-ink-subtle"
            >
              Field
            </th>
            {entries.map((e) => (
              <th
                scope="col"
                key={`${e.category}/${e.slug}`}
                className="min-w-[260px] max-w-[320px] border-b border-r border-border bg-surface p-3 text-left align-top"
              >
                <Link
                  to="/entry/$category/$slug"
                  params={{ category: e.category, slug: e.slug }}
                  className="font-display text-sm font-semibold text-ink hover:underline"
                >
                  {e.title}
                </Link>
                <p className="mt-1 line-clamp-2 text-xs text-ink-muted">{e.description}</p>
                <Link
                  to="/entry/$category/$slug"
                  params={{ category: e.category, slug: e.slug }}
                  className="mt-2 inline-flex items-center gap-1 text-[11px] text-ink-muted hover:text-ink"
                >
                  Open dossier <ArrowRight className="h-3 w-3" />
                </Link>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {COMPARISON_ROWS.map((row, i) => (
            <tr key={row.label} className={i % 2 === 0 ? "bg-surface-2/30" : ""}>
              <th
                scope="row"
                className="sticky left-0 z-10 w-[150px] border-b border-r border-border bg-inherit p-3 text-left align-top text-xs font-medium text-ink-muted"
              >
                {row.label}
              </th>
              {entries.map((e) => (
                <td
                  key={`${e.category}/${e.slug}`}
                  className="min-w-[260px] max-w-[320px] border-b border-r border-border p-3 align-top"
                >
                  {row.render(e)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
