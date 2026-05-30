import * as React from "react";
import { Download, Search, X } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CopyButton } from "@/components/copy-button";
import { cn } from "@/lib/utils";

export type Support = "native" | "adapter" | "manual" | "none";

export interface MatrixClient {
  id: string;
  label: string;
}

export interface MatrixRow {
  capability: string;
  blurb: string;
  cells: Record<string, Support>;
}

export interface CellDetail {
  /** Short why-line shown above the snippet. */
  why?: string;
  /** Copyable snippet (JSON, CLI, URL). */
  snippet?: string;
  /** External doc link. */
  docUrl?: string;
}

export const SUPPORT_META: Record<
  Support,
  { label: string; glyph: string; tone: string; cellBg: string }
> = {
  native: { label: "Native", glyph: "●", tone: "text-trust-trusted", cellBg: "bg-trust-trusted/8" },
  adapter: {
    label: "Adapter",
    glyph: "◐",
    tone: "text-accent-ink dark:text-accent",
    cellBg: "bg-accent/10",
  },
  manual: { label: "Manual", glyph: "○", tone: "text-ink-muted", cellBg: "" },
  none: { label: "Unsupported", glyph: "—", tone: "text-ink-subtle", cellBg: "" },
};

export function CompatibilityMatrix({
  clients,
  rows,
  details,
}: {
  clients: readonly MatrixClient[];
  rows: MatrixRow[];
  /** Keyed by `${capability}::${clientId}` */
  details?: Record<string, CellDetail>;
}) {
  const [query, setQuery] = React.useState("");
  const [focusClient, setFocusClient] = React.useState<string | null>(null);
  const [focusSupport, setFocusSupport] = React.useState<Support | null>(null);

  const filtered = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter(
      (r) => r.capability.toLowerCase().includes(q) || r.blurb.toLowerCase().includes(q),
    );
  }, [rows, query]);

  const downloadCsv = () => {
    const header = ["Capability", "Detail", ...clients.map((c) => c.label)].join(",");
    const body = rows
      .map((r) =>
        [
          csv(r.capability),
          csv(r.blurb),
          ...clients.map((c) => SUPPORT_META[r.cells[c.id]].label),
        ].join(","),
      )
      .join("\n");
    const blob = new Blob([`${header}\n${body}\n`], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "heyclaude-compatibility.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col gap-3">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-2">
        <div className="relative min-w-[220px] flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-ink-subtle" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Filter capabilities…"
            className="h-9 w-full rounded-md border border-border bg-background pl-8 pr-3 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-accent/40"
          />
        </div>
        {(focusClient || focusSupport) && (
          <button
            type="button"
            onClick={() => {
              setFocusClient(null);
              setFocusSupport(null);
            }}
            className="inline-flex h-9 items-center gap-1.5 rounded-md border border-border bg-surface px-2.5 text-xs text-ink-muted hover:text-ink"
          >
            <X className="h-3 w-3" /> Clear focus
          </button>
        )}
        <button
          type="button"
          onClick={downloadCsv}
          className="inline-flex h-9 items-center gap-1.5 rounded-md border border-border bg-surface px-2.5 text-xs text-ink-muted hover:text-ink"
        >
          <Download className="h-3 w-3" /> CSV
        </button>
      </div>

      {/* Matrix */}
      <div className="overflow-x-auto rounded-xl border border-border bg-surface">
        <table className="w-full min-w-[760px] border-collapse text-sm">
          <thead>
            <tr className="border-b border-border bg-surface-2">
              <th className="w-[260px] px-4 py-3 text-left text-[11px] font-medium uppercase tracking-wider text-ink-subtle">
                Capability
              </th>
              {clients.map((c) => {
                const active = focusClient === c.id;
                return (
                  <th
                    key={c.id}
                    className={cn(
                      "px-3 py-3 text-center text-[11px] font-medium uppercase tracking-wider transition-colors duration-200 ease-out",
                      active ? "bg-accent/15 text-ink" : "text-ink-subtle",
                    )}
                  >
                    <button
                      type="button"
                      onClick={() => setFocusClient(active ? null : c.id)}
                      className="hover:text-ink"
                      title={active ? `Clear focus on ${c.label}` : `Focus ${c.label}`}
                    >
                      {c.label}
                    </button>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {filtered.map((row) => (
              <tr
                key={row.capability}
                className="border-b border-border last:border-0 hover:bg-surface-2/40"
              >
                <th scope="row" className="px-4 py-3 text-left align-top">
                  <div className="text-sm font-medium text-ink">{row.capability}</div>
                  <div className="text-xs text-ink-subtle">{row.blurb}</div>
                </th>
                {clients.map((c) => {
                  const v = row.cells[c.id];
                  const meta = SUPPORT_META[v];
                  const dim =
                    (focusClient && focusClient !== c.id) || (focusSupport && focusSupport !== v);
                  const detail = details?.[`${row.capability}::${c.id}`];
                  const hasDetail = !!(detail?.snippet || detail?.docUrl || detail?.why);
                  return (
                    <td
                      key={c.id}
                      className={cn(
                        "px-3 py-3 text-center align-middle transition-opacity",
                        meta.cellBg,
                        focusClient === c.id && "bg-accent/15",
                        dim && "opacity-30",
                      )}
                    >
                      {hasDetail ? (
                        <Popover>
                          <PopoverTrigger asChild>
                            <button
                              type="button"
                              className={cn(
                                "rounded-md px-1.5 font-mono text-base leading-none transition-colors duration-200 ease-out hover:bg-background",
                                meta.tone,
                              )}
                              title={`${meta.label} · click for details`}
                            >
                              {meta.glyph}
                            </button>
                          </PopoverTrigger>
                          <PopoverContent align="center" className="w-[320px] p-0">
                            <CellPopover
                              capability={row.capability}
                              client={c.label}
                              support={v}
                              detail={detail!}
                            />
                          </PopoverContent>
                        </Popover>
                      ) : (
                        <span
                          title={meta.label}
                          className={cn("inline-block font-mono text-base leading-none", meta.tone)}
                        >
                          {meta.glyph}
                        </span>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td
                  colSpan={clients.length + 1}
                  className="px-4 py-8 text-center text-sm text-ink-muted"
                >
                  No capabilities match "{query}".
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Legend — also acts as a quick filter */}
      <div className="flex flex-wrap items-center gap-3 text-xs text-ink-muted">
        <span className="text-ink-subtle">Filter by status:</span>
        {(Object.keys(SUPPORT_META) as Support[]).map((k) => {
          const m = SUPPORT_META[k];
          const active = focusSupport === k;
          return (
            <button
              key={k}
              type="button"
              onClick={() => setFocusSupport(active ? null : k)}
              className={cn(
                "inline-flex items-center gap-1.5 rounded-md border px-2 py-1 transition-colors duration-200 ease-out",
                active
                  ? "border-accent bg-accent/10 text-ink"
                  : "border-border bg-surface hover:text-ink",
              )}
            >
              <span className={cn("font-mono text-base leading-none", m.tone)}>{m.glyph}</span>
              {m.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function CellPopover({
  capability,
  client,
  support,
  detail,
}: {
  capability: string;
  client: string;
  support: Support;
  detail: CellDetail;
}) {
  const meta = SUPPORT_META[support];
  return (
    <div className="flex flex-col gap-3 p-4 text-sm">
      <div>
        <div className="eyebrow">{client}</div>
        <div className="mt-0.5 font-display text-sm font-semibold text-ink">{capability}</div>
        <div className={cn("mt-0.5 text-xs font-medium", meta.tone)}>{meta.label}</div>
      </div>
      {detail.why && <p className="text-xs text-ink-muted">{detail.why}</p>}
      {detail.snippet && (
        <div className="overflow-hidden rounded-md border border-border bg-surface-2">
          <pre className="max-h-40 overflow-auto p-2 font-mono text-[11px] leading-snug text-ink">
            <code>{detail.snippet}</code>
          </pre>
          <div className="border-t border-border bg-background p-1.5">
            <CopyButton
              value={detail.snippet}
              label="Copy snippet"
              size="sm"
              className="w-full justify-center"
            />
          </div>
        </div>
      )}
      {detail.docUrl && (
        <a
          href={detail.docUrl}
          target="_blank"
          rel="noreferrer"
          className="text-xs font-medium text-ink-muted hover:text-ink"
        >
          Open docs →
        </a>
      )}
    </div>
  );
}

function csv(v: string) {
  if (/[",\n]/.test(v)) return `"${v.replace(/"/g, '""')}"`;
  return v;
}
