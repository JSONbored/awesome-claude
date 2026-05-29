import * as React from "react";
import { GitCompare, X, ArrowRight } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { useCompare } from "@/lib/compare";
import { TrustBadge, SourceBadge, ReadinessDot } from "./badges";

export function ComparisonTray() {
  const { items, toggle, clear, open, setOpen } = useCompare();
  if (items.length === 0) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-surface/95 backdrop-blur">
      <div className="mx-auto flex max-w-[1400px] items-center gap-3 px-4 py-3 sm:px-6">
        <div className="flex items-center gap-2 text-sm font-medium text-ink">
          <GitCompare className="h-4 w-4" />
          Compare
          <span className="rounded bg-ink px-1.5 py-0.5 font-mono text-[10px] text-background">
            {items.length}/4
          </span>
        </div>
        <div className="flex min-w-0 flex-1 items-center gap-2 overflow-x-auto">
          {items.map((e) => (
            <span
              key={e.slug}
              className="inline-flex shrink-0 items-center gap-1.5 rounded-md border border-border bg-background px-2 py-1 text-xs"
            >
              <ReadinessDot entry={e} />
              <span className="font-medium text-ink">{e.title}</span>
              <TrustBadge level={e.trust} />
              <SourceBadge status={e.source} className="hidden sm:inline-flex" />
              <button
                type="button"
                onClick={() => toggle(e)}
                className="text-ink-subtle hover:text-ink"
                aria-label={`Remove ${e.title} from compare`}
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          ))}
        </div>
        <button
          type="button"
          onClick={clear}
          className="hidden text-xs text-ink-muted hover:text-ink sm:inline"
        >
          Clear
        </button>
        <Link
          to="/compare"
          search={{ ids: items.map((e) => `${e.category}/${e.slug}`).join(",") }}
          onClick={() => setOpen(false)}
          className="inline-flex h-8 items-center gap-1 rounded-md bg-accent px-3 text-xs font-semibold text-accent-ink hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink/40"
        >
          Compare {items.length} <ArrowRight className="h-3 w-3" />
        </Link>
        <span className="sr-only" aria-hidden>
          {open ? "open" : "closed"}
        </span>
      </div>
    </div>
  );
}
