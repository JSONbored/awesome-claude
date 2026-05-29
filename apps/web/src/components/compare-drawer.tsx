import * as React from "react";
import { Link } from "@tanstack/react-router";
import { X, ExternalLink, ArrowRight, Shield, Lock } from "lucide-react";
import { toast } from "sonner";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useCompare } from "@/lib/compare";
import { CategoryPill, PlatformChip, NotesPresenceChips } from "@/components/badges";
import { HarnessBadgeRow } from "@/components/harness-badge";
import { HarnessVariantPicker } from "@/components/harness-variant-picker";
import { TrustDrilldown } from "./trust-drilldown";
import { CopyButton } from "./copy-button";
import { CopySegmented, variantsForEntry } from "./copy-segmented";
import { useCopyPref, useHarnessPref } from "@/lib/dossier-prefs";
import type { Entry, Harness } from "@/types/registry";
import { cn } from "@/lib/utils";

interface RowDef {
  label: string;
  render: (e: Entry) => React.ReactNode;
}

const ROWS: RowDef[] = [
  {
    label: "Trust",
    render: (e) => <TrustDrilldown entry={e} />,
  },
  {
    label: "Safety",
    render: (e) =>
      e.safetyNotes || e.safetyNotesList?.length ? (
        <span className="inline-flex items-center gap-1 text-xs text-trust-trusted">
          <Shield className="h-3.5 w-3.5" aria-hidden /> Notes present
        </span>
      ) : (
        <span className="inline-flex items-center gap-1 text-xs text-ink-subtle">
          <Shield className="h-3.5 w-3.5 opacity-50" aria-hidden /> Missing
        </span>
      ),
  },
  {
    label: "Privacy",
    render: (e) =>
      e.privacyNotes || e.privacyNotesList?.length ? (
        <span className="inline-flex items-center gap-1 text-xs text-trust-trusted">
          <Lock className="h-3.5 w-3.5" aria-hidden /> Notes present
        </span>
      ) : (
        <span className="inline-flex items-center gap-1 text-xs text-ink-subtle">
          <Lock className="h-3.5 w-3.5 opacity-50" aria-hidden /> Missing
        </span>
      ),
  },
  {
    label: "Category",
    render: (e) => <CategoryPill>{e.category}</CategoryPill>,
  },
  {
    label: "Author",
    render: (e) => <span className="text-sm text-ink">{e.author}</span>,
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
    label: "Harness",
    render: (e) =>
      e.harness && e.harness.length > 0 ? (
        <HarnessBadgeRow ids={e.harness} />
      ) : (
        <span className="text-xs text-ink-subtle">—</span>
      ),
  },
  {
    label: "Notes",
    render: (e) => <NotesPresenceChips entry={e} />,
  },
  {
    label: "Source repo",
    render: (e) => (
      <span className="font-mono text-sm text-ink">
        {e.repoStats?.stars !== undefined
          ? `${e.repoStats.stars.toLocaleString()} repo stars`
          : "—"}
      </span>
    ),
  },
  {
    label: "Snippet",
    render: (e) => <SnippetCell entry={e} />,
  },
  {
    label: "Source",
    render: (e) =>
      e.sourceUrl ? (
        <a
          href={e.sourceUrl}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1 text-xs text-ink-muted hover:text-ink"
        >
          Repository <ExternalLink className="h-3 w-3" />
        </a>
      ) : (
        <span className="text-xs text-ink-subtle">—</span>
      ),
  },
  {
    label: "Claim",
    render: (e) => (
      <span className="text-xs text-ink-muted">{e.claimed ? "Claimed" : "Unclaimed"}</span>
    ),
  },
];

/** Per-entry snippet cell that honors the global copy variant + harness pref. */
function SnippetCell({ entry }: { entry: Entry }) {
  const harnessAvailable = React.useMemo<Harness[]>(
    () => (entry.harnessVariants ? (Object.keys(entry.harnessVariants) as Harness[]) : []),
    [entry.harnessVariants],
  );
  const [harness, setHarness] = useHarnessPref(entry.category, entry.slug, harnessAvailable);
  const variants = React.useMemo(() => variantsForEntry(entry, harness), [entry, harness]);
  const [pref] = useCopyPref();
  const firstAvailable = variants.find((v) => v.value)?.id ?? "install";
  const active = pref && variants.find((v) => v.id === pref)?.value ? pref : firstAvailable;
  const payload = variants.find((v) => v.id === active)?.value;
  if (!payload && harnessAvailable.length < 2) {
    return <span className="text-xs text-ink-subtle">—</span>;
  }
  return (
    <div className="space-y-1.5">
      {harnessAvailable.length >= 2 && (
        <HarnessVariantPicker
          available={harnessAvailable}
          value={harness as Harness | null}
          onChange={setHarness}
        />
      )}
      {payload ? (
        <>
          <pre className="max-h-24 overflow-auto rounded-md bg-background p-2 font-mono text-[11px] text-ink">
            <code>{payload}</code>
          </pre>
          <CopyButton
            value={payload}
            label={`Copy ${active}`}
            toastLabel={`Copied ${active} — ${entry.title}`}
          />
        </>
      ) : (
        <span className="text-xs text-ink-subtle">No {active} snippet for this harness.</span>
      )}
    </div>
  );
}

export function CompareDrawer() {
  const { items, open, setOpen, toggle, clear, hydrate, getShareUrl } = useCompare();

  const onClear = () => {
    const snapshot = items.map((e) => `${e.category}/${e.slug}`).join(",");
    if (!snapshot) return clear();
    clear();
    toast("Compare cleared", {
      description: `${items.length} item${items.length === 1 ? "" : "s"} removed`,
      action: {
        label: "Undo",
        onClick: () => {
          hydrate(snapshot);
          setOpen(true);
        },
      },
    });
  };

  const onRemove = (e: Entry) => {
    toggle(e);
    toast(`Removed “${e.title}” from compare`);
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent side="bottom" className="h-[88vh] p-0">
        <SheetHeader className="border-b border-border px-4 py-3 sm:px-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <SheetTitle className="font-display text-base font-semibold text-ink">
              Comparing {items.length} {items.length === 1 ? "resource" : "resources"}
            </SheetTitle>
            <div className="flex flex-wrap items-center gap-2">
              {items.length > 0 && (
                <div className="hidden items-center gap-1.5 sm:flex">
                  <span className="text-[11px] uppercase tracking-wider text-ink-subtle">
                    Snippet
                  </span>
                  <CopySegmented
                    variants={[
                      {
                        id: "install",
                        label: "Install",
                        value: items.find((e) => e.installCommand)?.installCommand,
                      },
                      {
                        id: "config",
                        label: "Config",
                        value: items.find((e) => e.configSnippet)?.configSnippet,
                      },
                      { id: "full", label: "Full", value: items.find((e) => e.fullCopy)?.fullCopy },
                    ]}
                    hideCopy
                  />
                </div>
              )}
              {items.length > 0 && (
                <Link
                  to="/compare"
                  search={{ ids: items.map((e) => `${e.category}/${e.slug}`).join(",") }}
                  onClick={() => setOpen(false)}
                  className="inline-flex h-8 items-center gap-1 rounded-md border border-border bg-surface px-2.5 text-xs text-ink hover:bg-surface-2"
                >
                  Open full view <ArrowRight className="h-3 w-3" />
                </Link>
              )}
              <CopyButton
                value={getShareUrl()}
                label="Copy compare link"
                disabled={items.length === 0}
              />
              <button
                type="button"
                onClick={onClear}
                className="text-xs text-ink-muted hover:text-ink"
              >
                Clear all
              </button>
            </div>
          </div>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex h-[60vh] items-center justify-center px-6 text-sm text-ink-muted">
            Add resources to compare by tapping the Compare button on any card.
          </div>
        ) : (
          <div className="h-[calc(88vh-57px)] overflow-auto">
            <div className="min-w-full">
              <table className="w-full border-collapse text-sm">
                <thead className="sticky top-0 z-10 bg-surface">
                  <tr>
                    <th
                      scope="col"
                      className="sticky left-0 z-20 w-[140px] border-b border-r border-border bg-surface p-3 text-left text-xs uppercase tracking-wider text-ink-subtle"
                    >
                      Field
                    </th>
                    {items.map((e) => (
                      <th
                        scope="col"
                        key={e.slug}
                        className="min-w-[260px] max-w-[320px] border-b border-r border-border bg-surface p-3 text-left align-top last:border-r-0"
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
                            onClick={() => onRemove(e)}
                            aria-label={`Remove ${e.title}`}
                            className="rounded p-0.5 text-ink-subtle hover:text-ink"
                          >
                            <X className="h-3.5 w-3.5" />
                          </button>
                        </div>
                        <Link
                          to="/entry/$category/$slug"
                          params={{ category: e.category, slug: e.slug }}
                          className="mt-1 inline-flex items-center gap-1 text-[11px] text-ink-muted hover:text-ink"
                        >
                          Open dossier <ArrowRight className="h-3 w-3" />
                        </Link>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {ROWS.map((row, i) => (
                    <tr key={row.label} className={cn(i % 2 === 0 && "bg-surface-2/30")}>
                      <th
                        scope="row"
                        className="sticky left-0 z-10 w-[140px] border-b border-r border-border bg-inherit p-3 text-left align-top text-xs font-medium text-ink-muted"
                      >
                        {row.label}
                      </th>
                      {items.map((e) => (
                        <td
                          key={e.slug}
                          className="min-w-[260px] max-w-[320px] border-b border-r border-border p-3 align-top last:border-r-0"
                        >
                          {row.render(e)}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
