import type { CompareEvidenceGapsState } from "@/lib/compare-evidence-gaps";
import { cn } from "@/lib/utils";

function severityClass(severity: "low" | "medium" | "high"): string {
  if (severity === "high") return "border-trust-blocked/30 bg-trust-blocked/5 text-trust-blocked";
  if (severity === "medium") return "border-amber-500/30 bg-amber-500/5 text-amber-900";
  return "border-trust-trusted/30 bg-trust-trusted/5 text-trust-trusted";
}

export function CompareEvidenceGapsPanel({
  state,
  compact = false,
  className,
}: {
  state: CompareEvidenceGapsState;
  compact?: boolean;
  className?: string;
}) {
  if (state.comparedCount === 0) return null;

  return (
    <section
      aria-label="Evidence gaps"
      className={cn("rounded-xl border border-border bg-surface p-4 sm:p-5", className)}
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="eyebrow">Evidence gaps</p>
          <h3 className="mt-1 text-base font-semibold text-ink sm:text-lg">{state.headline}</h3>
          <p className="mt-1.5 text-sm text-ink-muted">{state.summary}</p>
        </div>
        <span className="rounded-full border border-border bg-background px-2 py-0.5 font-mono text-[10px] text-ink-subtle">
          {state.comparedCount} compared
        </span>
      </div>

      <div className="mt-3 grid gap-2">
        {state.rows.map((row) => (
          <article key={row.id} className="rounded-lg border border-border bg-background p-3">
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div className="min-w-0">
                <h4 className="text-sm font-semibold text-ink">{row.label}</h4>
                <p className="mt-0.5 text-[11px] text-ink-muted">{row.hint}</p>
              </div>
              <div className="text-right">
                <span
                  className={cn(
                    "inline-flex rounded-full border px-2 py-0.5 text-[10px] uppercase tracking-wide",
                    severityClass(row.severity),
                  )}
                >
                  {row.severity}
                </span>
                <p className="mt-1 font-mono text-xs text-ink">{row.coveragePercent}% covered</p>
              </div>
            </div>

            <div className="mt-2 flex flex-wrap gap-1.5">
              <span className="rounded border border-border bg-surface px-2 py-0.5 text-[10px] text-ink-muted">
                Present: {row.presentCount}
              </span>
              <span className="rounded border border-border bg-surface px-2 py-0.5 text-[10px] text-ink-muted">
                Missing: {row.missingCount}
              </span>
            </div>

            {!compact && row.missingRefs.length > 0 ? (
              <p className="mt-2 text-[11px] text-ink-subtle">
                Missing in: {row.missingRefs.join(", ")}
              </p>
            ) : null}
          </article>
        ))}
      </div>
    </section>
  );
}
