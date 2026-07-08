import type {
  CompareDeploymentRiskMapState,
  DeploymentRiskPresetId,
} from "@/lib/compare-deployment-risk-map";
import { deploymentRiskBandClass } from "@/lib/compare-deployment-risk-map-lib";
import { cn } from "@/lib/utils";

const PRESETS: { id: DeploymentRiskPresetId; label: string }[] = [
  { id: "balanced", label: "Balanced" },
  { id: "security", label: "Security" },
  { id: "speed", label: "Speed" },
];

export function CompareDeploymentRiskMapPanel({
  state,
  selectedPreset,
  onSelectPreset,
  compact = false,
  className,
}: {
  state: CompareDeploymentRiskMapState;
  selectedPreset: DeploymentRiskPresetId;
  onSelectPreset: (preset: DeploymentRiskPresetId) => void;
  compact?: boolean;
  className?: string;
}) {
  if (state.entries.length === 0) return null;

  return (
    <section className={cn("rounded-xl border border-border bg-surface p-4 sm:p-5", className)}>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="eyebrow">Deployment risk map</p>
          <h3 className="mt-1 text-base font-semibold text-ink sm:text-lg">{state.heading}</h3>
          <p className="mt-1 text-sm text-ink-muted">{state.summary}</p>
        </div>
        <span className="rounded-full border border-border bg-background px-2 py-0.5 font-mono text-[10px] text-ink-subtle">
          high {state.highRiskCount} · low {state.lowRiskCount}
        </span>
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        {PRESETS.map((preset) => (
          <button
            key={preset.id}
            type="button"
            onClick={() => onSelectPreset(preset.id)}
            className={cn(
              "rounded-full border px-3 py-1.5 text-xs transition-colors",
              selectedPreset === preset.id
                ? "border-accent bg-accent/10 text-ink"
                : "border-border bg-background text-ink-muted hover:text-ink",
            )}
          >
            {preset.label}
          </button>
        ))}
      </div>

      <div className="mt-3 grid gap-2">
        {state.entries.map((entry) => (
          <article
            key={entry.entryRef}
            className="rounded-md border border-border bg-background p-3"
          >
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div className="min-w-0">
                <h4 className="text-sm font-semibold text-ink">{entry.title}</h4>
                <p className="mt-0.5 text-[11px] text-ink-muted">{entry.mitigationSummary}</p>
              </div>
              <div className="text-right">
                <span
                  className={cn(
                    "inline-flex rounded-full border px-2 py-0.5 text-[10px] uppercase tracking-wide",
                    deploymentRiskBandClass(entry.riskBand),
                  )}
                >
                  {entry.riskBand}
                </span>
                <p className="mt-1 font-mono text-xs text-ink">risk {entry.riskScore}</p>
              </div>
            </div>

            {!compact && entry.topRiskReasons.length > 0 ? (
              <p className="mt-2 text-[11px] text-ink-subtle">
                Top reasons: {entry.topRiskReasons.join(", ")}
              </p>
            ) : null}

            <p className="mt-1 text-[11px] text-ink-muted">Confidence {entry.confidenceScore}%</p>
          </article>
        ))}
      </div>
    </section>
  );
}
