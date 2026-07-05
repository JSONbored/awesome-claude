import { CheckCircle2, Circle } from "lucide-react";
import { cn } from "@/lib/utils";
import type { EntryReadinessRow } from "@/lib/entry-detail-sidebar-lib";

export function EntryDetailReadinessPanel({
  rows,
  className,
}: {
  rows: EntryReadinessRow[];
  className?: string;
}) {
  return (
    <div className={cn("border-t border-border px-4 py-3", className)}>
      <div className="eyebrow mb-2">Readiness</div>
      <ul className="space-y-1.5 text-xs">
        {rows.map((row) => (
          <li key={row.label} className="flex items-center justify-between gap-2">
            <span className="text-ink-muted">{row.label}</span>
            <span
              className={cn(
                "inline-flex items-center gap-1 font-medium",
                row.ok ? "text-trust-trusted" : "text-ink-muted",
              )}
            >
              {row.ok ? (
                <CheckCircle2 className="h-3 w-3" aria-hidden />
              ) : (
                <Circle className="h-3 w-3" aria-hidden />
              )}
              {row.value}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
