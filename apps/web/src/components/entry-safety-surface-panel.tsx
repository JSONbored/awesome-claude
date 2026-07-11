import { AlertTriangle, ShieldCheck } from "lucide-react";
import type { EntrySafetySurfaceState } from "@/lib/entry-safety-surface";
import { cn } from "@/lib/utils";

export function EntrySafetySurfacePanel({
  state,
  className,
}: {
  state: EntrySafetySurfaceState;
  className?: string;
}) {
  if (!state.showPanel) {
    return null;
  }
  return (
    <section
      id="safety-surface"
      aria-label="Safety and privacy surface"
      className={cn("rounded-xl border border-border bg-surface p-4 sm:p-5", className)}
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="eyebrow">Safety &amp; privacy surface</p>
          <h3 className="mt-1 text-base font-semibold text-ink sm:text-lg">{state.heading}</h3>
          <p className="mt-1.5 text-sm text-ink-muted">{state.summary}</p>
        </div>
        <span className="inline-flex shrink-0 rounded-full border border-border bg-background px-2.5 py-0.5 font-mono text-[11px] uppercase tracking-wide text-ink-muted">
          {state.coverageCount} area{state.coverageCount === 1 ? "" : "s"}
        </span>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        {state.kinds.map((kind) => {
          const sensitive = state.sensitiveKinds.includes(kind.kind);
          return (
            <span
              key={kind.kind}
              className={cn(
                "inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-[11px]",
                sensitive
                  ? "border-amber-500/40 bg-amber-500/5 text-amber-900"
                  : "border-border bg-background text-ink-muted",
              )}
            >
              {kind.kindLabel}
              <span className="font-mono text-ink">{kind.count}</span>
            </span>
          );
        })}
      </div>

      <ul className="mt-4 space-y-2">
        {state.items.map((item) => (
          <li
            key={item.id}
            className="flex items-start gap-2.5 rounded-lg border border-border bg-background px-3 py-2.5"
          >
            {item.source === "safety" ? (
              <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-trust-trusted" aria-hidden />
            ) : (
              <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-ink-muted" aria-hidden />
            )}
            <span className="min-w-0">
              <span className="flex flex-wrap items-center gap-1.5">
                <span className="rounded bg-ink/10 px-1 py-0.5 text-[9px] uppercase tracking-wide text-ink-muted">
                  {item.source === "safety" ? "Safety" : "Privacy"}
                </span>
                <span className="rounded bg-ink/10 px-1 py-0.5 text-[9px] uppercase tracking-wide text-ink-muted">
                  {item.kindLabel}
                </span>
              </span>
              <span className="mt-1 block text-sm text-ink">{item.text}</span>
            </span>
          </li>
        ))}
      </ul>

      {state.disclosure ? (
        <p className="mt-3 rounded-md border border-border bg-background px-3 py-2 text-xs text-ink-muted">
          Disclosure: {state.disclosure}
        </p>
      ) : null}
    </section>
  );
}
