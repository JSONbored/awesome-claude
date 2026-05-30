import { X } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ActiveFilter {
  key: string;
  label: string;
  value: string;
  onClear: () => void;
}

export function FilterSummaryBar({
  filters,
  onClearAll,
  className,
}: {
  filters: ActiveFilter[];
  onClearAll: () => void;
  className?: string;
}) {
  if (filters.length === 0) return null;
  return (
    <div
      className={cn(
        "flex flex-wrap items-center gap-1.5 rounded-lg border border-border bg-surface px-2.5 py-1.5",
        className,
      )}
    >
      <span className="text-[11px] uppercase tracking-wider text-ink-subtle">Active</span>
      {filters.map((f) => (
        <button
          key={f.key}
          type="button"
          onClick={f.onClear}
          className="inline-flex h-6 items-center gap-1 rounded-full border border-border bg-background pl-2 pr-1 text-[11px] text-ink hover:bg-surface-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60"
          aria-label={`Remove filter ${f.label}: ${f.value}`}
        >
          <span className="text-ink-subtle">{f.label}</span>
          <span className="font-medium">{f.value}</span>
          <X className="h-3 w-3 text-ink-subtle" aria-hidden />
        </button>
      ))}
      <button
        type="button"
        onClick={onClearAll}
        className="ml-1 inline-flex h-6 items-center gap-1 rounded-full border border-dashed border-border px-2 text-[11px] text-ink-muted hover:bg-surface-2 hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60"
      >
        Clear all
      </button>
    </div>
  );
}
