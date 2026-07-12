import { Link } from "@tanstack/react-router";
import type { BrowseThemeDistributionState } from "@/lib/browse-theme-distribution";
import {
  browseThemeDistributionSelectAnalyticsData,
  browseThemeDistributionSelectAnalyticsEvent,
} from "@/lib/browse-distribution-cta-events";
import { trackEvent } from "@/lib/analytics";
import { cn } from "@/lib/utils";

const CONCENTRATION_LABEL: Record<BrowseThemeDistributionState["concentration"], string> = {
  focused: "Focused",
  mixed: "Mixed",
  diverse: "Diverse",
};

export function BrowseThemeDistributionPanel({
  state,
  className,
}: {
  state: BrowseThemeDistributionState;
  className?: string;
}) {
  if (!state.showPanel) return null;
  return (
    <section className={cn("rounded-xl border border-border bg-surface p-4", className)}>
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <p className="eyebrow">Theme distribution</p>
          <h3 className="mt-1 text-sm font-semibold text-ink">{state.heading}</h3>
          <p className="mt-1 text-xs text-ink-muted">{state.summary}</p>
        </div>
        <span className="rounded-full border border-border bg-background px-2 py-0.5 font-mono text-[10px] uppercase tracking-wide text-ink-subtle">
          {CONCENTRATION_LABEL[state.concentration]}
        </span>
      </div>

      <ul className="mt-3 space-y-1.5">
        {state.topThemes.map((theme, index) => (
          <li key={theme.slug} className="flex items-center gap-2">
            <Link
              to="/tags/$tag"
              params={{ tag: theme.slug }}
              onClick={() =>
                trackEvent(
                  browseThemeDistributionSelectAnalyticsEvent(),
                  browseThemeDistributionSelectAnalyticsData(
                    theme.slug,
                    theme.percent,
                    index + 1,
                    state.concentration,
                    state.scannedCount,
                  ),
                )
              }
              className="w-28 shrink-0 truncate text-xs text-ink underline-offset-2 hover:text-accent hover:underline"
              title={`Browse ${theme.tag} tag hub`}
            >
              {theme.tag}
            </Link>
            <span className="relative h-2 flex-1 overflow-hidden rounded-full bg-background">
              <span
                className="absolute inset-y-0 left-0 rounded-full bg-accent/60"
                style={{ width: `${Math.max(theme.percent, 4)}%` }}
              />
            </span>
            <span className="w-16 shrink-0 text-right font-mono text-[11px] text-ink-muted">
              {theme.percent}% ({theme.count})
            </span>
          </li>
        ))}
      </ul>

      <p className="mt-2.5 text-[11px] text-ink-subtle">
        {state.distinctThemes} distinct theme{state.distinctThemes === 1 ? "" : "s"} across{" "}
        {state.scannedCount} scanned
      </p>
    </section>
  );
}
