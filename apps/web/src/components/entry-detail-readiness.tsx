import { CheckCircle2, Circle } from "lucide-react";
import { cn } from "@/lib/utils";
import { trackEvent } from "@/lib/analytics";
import type { EntryReadinessRow } from "@/lib/entry-detail-sidebar-lib";
import {
  entryReadinessRowAnalyticsData,
  entryReadinessRowAnalyticsEvent,
} from "@/lib/entry-readiness-cta-events";

export function EntryDetailReadinessPanel({
  rows,
  category,
  slug,
  className,
}: {
  rows: EntryReadinessRow[];
  category: string;
  slug: string;
  className?: string;
}) {
  return (
    <div className={cn("border-t border-border px-4 py-3", className)}>
      <div className="eyebrow mb-2">Readiness</div>
      <ul className="space-y-1.5 text-xs">
        {rows.map((row) => (
          <li key={row.id}>
            <button
              type="button"
              onClick={() => {
                trackEvent(
                  entryReadinessRowAnalyticsEvent(),
                  entryReadinessRowAnalyticsData(
                    category,
                    slug,
                    row.id,
                    row.ok,
                    row.scrollTargetId,
                  ),
                );
                document.getElementById(row.scrollTargetId)?.scrollIntoView({
                  behavior: "smooth",
                  block: "start",
                });
              }}
              className="flex w-full items-center justify-between gap-2 rounded-sm text-left transition-colors hover:bg-surface-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60"
            >
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
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
