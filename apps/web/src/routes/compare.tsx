import * as React from "react";
import { createFileRoute, Link, stripSearchParams } from "@tanstack/react-router";
import { z } from "zod";
import { X, ArrowRight, ExternalLink, Plus, Search as SearchIcon } from "lucide-react";
import { ENTRIES } from "@/data/entries";
import {
  CategoryPill,
  PlatformChip,
  InstallRiskBadge,
  NotesPresenceChips,
} from "@/components/badges";
import { TrustDrilldown } from "@/components/trust-drilldown";
import { CopyButton } from "@/components/copy-button";
import { SourceCitations } from "@/components/source-citations";
import { useCompare } from "@/lib/compare";
import { search } from "@/data/search";
import { formatCompact } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { Entry } from "@/types/registry";

const defaultSearch = { ids: "" };

const searchSchema = z.object({
  ids: z.string().catch(defaultSearch.ids).default(defaultSearch.ids),
});

export const Route = createFileRoute("/compare")({
  validateSearch: searchSchema,
  search: {
    middlewares: [stripSearchParams(defaultSearch)],
  },
  head: () => ({
    meta: [
      { title: "Compare resources — HeyClaude" },
      { name: "description", content: "Side-by-side comparison of Claude workflow resources." },
      { property: "og:title", content: "Compare resources — HeyClaude" },
      {
        property: "og:description",
        content: "Side-by-side comparison of Claude workflow resources.",
      },
    ],
    links: [{ rel: "canonical", href: "/compare" }],
  }),
  component: ComparePage,
});

function resolveIds(ids: string): Entry[] {
  if (!ids) return [];
  const seen = new Set<string>();
  const out: Entry[] = [];
  for (const ref of ids
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean)
    .slice(0, 4)) {
    if (seen.has(ref)) continue;
    const [cat, slug] = ref.split("/");
    const e = ENTRIES.find((x) => x.category === cat && x.slug === slug);
    if (e) {
      out.push(e);
      seen.add(ref);
    }
  }
  return out;
}

interface RowDef {
  label: string;
  render: (e: Entry) => React.ReactNode;
}

const ROWS: RowDef[] = [
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

function ComparePage() {
  const sp = Route.useSearch();
  const navigate = Route.useNavigate();
  const compare = useCompare();

  // Hydrate items from URL on mount/change.
  React.useEffect(() => {
    compare.hydrate(sp.ids);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sp.ids]);

  const items = compare.items;
  const [hoverRow, setHoverRow] = React.useState<number | null>(null);
  const [pickerOpen, setPickerOpen] = React.useState(false);

  const pushIds = (next: Entry[]) => {
    const ids = next.map((e) => `${e.category}/${e.slug}`).join(",");
    navigate({ search: { ids } });
  };

  const removeItem = (e: Entry) => {
    const next = items.filter((x) => !(x.category === e.category && x.slug === e.slug));
    compare.toggle(e);
    pushIds(next);
  };

  const addItem = (e: Entry) => {
    if (items.length >= 4) return;
    if (items.some((x) => x.category === e.category && x.slug === e.slug)) return;
    compare.toggle(e);
    pushIds([...items, e]);
    setPickerOpen(false);
  };

  const copyShare = () => {
    const sig = items.map((e) => `${e.category}/${e.slug}`).join(",");
    const origin = typeof window !== "undefined" ? window.location.origin : "";
    return sig ? `${origin}/compare?ids=${encodeURIComponent(sig)}` : `${origin}/compare`;
  };

  if (items.length === 0) {
    const resolvedFromUrl = resolveIds(sp.ids);
    if (resolvedFromUrl.length > 0) {
      // Render directly from URL while context hydrates.
      return <Skeleton ids={sp.ids} />;
    }
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
        <div className="rounded-xl border border-dashed border-border bg-surface p-10 text-center">
          <div className="eyebrow">Comparison</div>
          <h1 className="mt-2 h-display-2 text-ink text-balance">Nothing to compare yet</h1>
          <p className="mt-2 text-sm text-ink-muted">
            Add 2–4 resources from the directory to see them side by side.
          </p>
          <div className="mt-5 flex justify-center gap-2">
            <Link
              to="/browse"
              className="inline-flex h-9 items-center rounded-md bg-ink px-4 text-sm font-medium text-background hover:bg-ink/90"
            >
              Browse the directory
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[1400px] px-4 py-6 sm:px-6">
      <div className="flex flex-wrap items-end justify-between gap-3 border-b border-border pb-4">
        <div>
          <div className="eyebrow">Compare</div>
          <h1 className="mt-1 h-display-2 text-ink text-balance">
            {items.length} {items.length === 1 ? "resource" : "resources"} side by side
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <CopyButton value={copyShare()} label="Copy share link" />
          <button
            type="button"
            onClick={() => {
              compare.clear();
              navigate({ search: { ids: "" } });
            }}
            className="inline-flex h-8 items-center rounded-md border border-border bg-surface px-3 text-xs text-ink-muted hover:bg-surface-2 hover:text-ink"
          >
            Clear all
          </button>
        </div>
      </div>

      <div className="mt-4 overflow-auto rounded-xl border border-border">
        <table className="w-full border-collapse text-sm">
          <thead className="sticky top-0 z-10 bg-surface">
            <tr>
              <th
                scope="col"
                className="sticky left-0 z-20 w-[150px] border-b border-r border-border bg-surface p-3 text-left text-xs uppercase tracking-wider text-ink-subtle"
              >
                Field
              </th>
              {items.map((e) => (
                <th
                  scope="col"
                  key={`${e.category}/${e.slug}`}
                  className="min-w-[260px] max-w-[320px] border-b border-r border-border bg-surface p-3 text-left align-top"
                >
                  <div className="flex items-start justify-between gap-2">
                    <Link
                      to="/entry/$category/$slug"
                      params={{ category: e.category, slug: e.slug }}
                      className="font-display text-sm font-semibold text-ink hover:underline"
                    >
                      {e.title}
                    </Link>
                    <button
                      type="button"
                      onClick={() => removeItem(e)}
                      aria-label={`Remove ${e.title}`}
                      className="rounded p-0.5 text-ink-subtle hover:text-ink"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>
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
              {items.length < 4 && (
                <th
                  scope="col"
                  className="min-w-[220px] border-b border-border bg-surface p-3 text-left align-top"
                >
                  <AddColumn
                    open={pickerOpen}
                    setOpen={setPickerOpen}
                    onPick={addItem}
                    exclude={items}
                  />
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            {ROWS.map((row, i) => (
              <tr
                key={row.label}
                onMouseEnter={() => setHoverRow(i)}
                onMouseLeave={() => setHoverRow(null)}
                className={cn(
                  "transition-colors duration-200 ease-out",
                  hoverRow === i ? "bg-accent/5" : i % 2 === 0 ? "bg-surface-2/30" : "",
                )}
              >
                <th
                  scope="row"
                  className="sticky left-0 z-10 w-[150px] border-b border-r border-border bg-inherit p-3 text-left align-top text-xs font-medium text-ink-muted"
                >
                  {row.label}
                </th>
                {items.map((e) => (
                  <td
                    key={`${e.category}/${e.slug}`}
                    className="min-w-[260px] max-w-[320px] border-b border-r border-border p-3 align-top"
                  >
                    {row.render(e)}
                  </td>
                ))}
                {items.length < 4 && (
                  <td className="min-w-[220px] border-b border-border p-3 align-top text-xs text-ink-subtle">
                    —
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="mt-3 text-xs text-ink-subtle">
        Share this comparison by copying the link above — the selection is encoded in the URL.
      </p>
    </div>
  );
}

function Skeleton({ ids }: { ids: string }) {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <div className="rounded-xl border border-border bg-surface p-6 text-sm text-ink-muted">
        Loading comparison for <code className="font-mono text-ink">{ids}</code>…
      </div>
    </div>
  );
}

function AddColumn({
  open,
  setOpen,
  onPick,
  exclude,
}: {
  open: boolean;
  setOpen: (v: boolean) => void;
  onPick: (e: Entry) => void;
  exclude: Entry[];
}) {
  const [q, setQ] = React.useState("");
  const results = React.useMemo(() => {
    const list = search({ q, sort: "popular" }).slice(0, 8);
    return list.filter((e) => !exclude.some((x) => x.category === e.category && x.slug === e.slug));
  }, [q, exclude]);

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex h-8 items-center gap-1.5 rounded-md border border-dashed border-border bg-background px-3 text-xs text-ink-muted hover:bg-surface-2 hover:text-ink"
      >
        <Plus className="h-3.5 w-3.5" />
        Add resource
      </button>
    );
  }
  return (
    <div className="flex flex-col gap-2">
      <label className="flex items-center gap-2 rounded-md border border-border bg-background px-2">
        <SearchIcon className="h-3.5 w-3.5 text-ink-subtle" />
        <input
          autoFocus
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search to add…"
          className="h-7 flex-1 bg-transparent text-xs text-ink placeholder:text-ink-subtle focus:outline-none"
        />
        <button
          type="button"
          onClick={() => setOpen(false)}
          aria-label="Close picker"
          className="text-ink-subtle hover:text-ink"
        >
          <X className="h-3 w-3" />
        </button>
      </label>
      <ul className="max-h-56 overflow-auto rounded-md border border-border bg-background">
        {results.length === 0 && (
          <li className="px-2 py-1.5 text-xs text-ink-subtle">No matches.</li>
        )}
        {results.map((e) => (
          <li key={`${e.category}/${e.slug}`}>
            <button
              type="button"
              onClick={() => onPick(e)}
              className="flex w-full items-center gap-2 px-2 py-1.5 text-left text-xs hover:bg-surface-2"
            >
              <CategoryPill>{e.category}</CategoryPill>
              <span className="line-clamp-1 text-ink">{e.title}</span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
