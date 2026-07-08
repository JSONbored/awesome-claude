import { AlertTriangle, CheckCircle2, Circle, GitCompare, ShieldAlert } from "lucide-react";
import type {
  DecisionChecklistItem,
  DecisionChecklistTone,
  EntryDetailDecisionPlaybookState,
} from "@/lib/entry-detail-decision-playbook";
import { cn } from "@/lib/utils";

const TONE_STYLES: Record<DecisionChecklistTone, string> = {
  complete: "border-trust-trusted/30 bg-trust-trusted/5",
  warning: "border-amber-500/30 bg-amber-500/5",
  critical: "border-trust-blocked/30 bg-trust-blocked/5",
};

const TONE_LABELS: Record<DecisionChecklistTone, string> = {
  complete: "Complete",
  warning: "Needs review",
  critical: "Required checks missing",
};

function ChecklistRow({ item }: { item: DecisionChecklistItem }) {
  return (
    <li className="flex items-start justify-between gap-3 rounded-md border border-border/70 bg-background/70 px-2.5 py-2">
      <div className="min-w-0">
        <p className="text-xs font-medium text-ink">
          {item.label}
          {item.required ? (
            <span className="ml-1 rounded bg-ink/10 px-1.5 py-0.5 text-[10px] uppercase tracking-wide text-ink-muted">
              Required
            </span>
          ) : null}
        </p>
        <p className="mt-0.5 text-[11px] text-ink-muted">{item.detail}</p>
      </div>
      <span
        className={cn(
          "mt-0.5 inline-flex shrink-0 items-center gap-1 text-[11px] font-medium",
          item.done
            ? "text-trust-trusted"
            : item.required
              ? "text-trust-blocked"
              : "text-ink-muted",
        )}
      >
        {item.done ? (
          <CheckCircle2 className="h-3.5 w-3.5" aria-hidden />
        ) : (
          <Circle className="h-3.5 w-3.5" aria-hidden />
        )}
        {item.done ? "Done" : "Pending"}
      </span>
    </li>
  );
}

function SectionCard({
  title,
  summary,
  tone,
  items,
}: {
  title: string;
  summary: string;
  tone: DecisionChecklistTone;
  items: DecisionChecklistItem[];
}) {
  return (
    <section className={cn("rounded-lg border p-3", TONE_STYLES[tone])}>
      <div className="mb-2 flex items-center justify-between gap-2">
        <h4 className="text-sm font-semibold text-ink">{title}</h4>
        <span className="rounded-full border border-border bg-background px-2 py-0.5 text-[10px] uppercase tracking-wide text-ink-muted">
          {TONE_LABELS[tone]}
        </span>
      </div>
      <p className="mb-2.5 text-xs text-ink-muted">{summary}</p>
      <ul className="space-y-1.5">
        {items.map((item) => (
          <ChecklistRow key={item.id} item={item} />
        ))}
      </ul>
    </section>
  );
}

function compareScoreLabel(scoreDelta: number | null) {
  if (scoreDelta === null) return "No baseline selected";
  if (scoreDelta > 0) return `+${scoreDelta} vs baseline`;
  if (scoreDelta < 0) return `${scoreDelta} vs baseline`;
  return "Score parity with baseline";
}

export function EntryDetailDecisionPlaybook({
  state,
  className,
}: {
  state: EntryDetailDecisionPlaybookState;
  className?: string;
}) {
  return (
    <section
      id="decision-playbook"
      aria-label="Decision playbook"
      className={cn("rounded-xl border border-border bg-surface p-4 sm:p-5", className)}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="eyebrow">Decision playbook</p>
          <h3 className="mt-1 text-lg font-semibold text-ink">{state.heading}</h3>
          <p className="mt-2 text-sm text-ink-muted">{state.summary}</p>
        </div>
        <ShieldAlert className="mt-1 hidden h-5 w-5 shrink-0 text-ink-muted sm:block" aria-hidden />
      </div>

      {state.showEscalationCallout && state.escalationText ? (
        <div className="mt-4 flex items-start gap-2 rounded-lg border border-trust-blocked/40 bg-trust-blocked/5 px-3 py-2.5 text-xs">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-trust-blocked" aria-hidden />
          <p className="text-ink-muted">{state.escalationText}</p>
        </div>
      ) : null}

      <div className="mt-4 rounded-lg border border-border bg-background px-3 py-2.5">
        <div className="flex items-center gap-2 text-xs font-medium text-ink">
          <GitCompare className="h-3.5 w-3.5" aria-hidden />
          Compare context
        </div>
        <div className="mt-2 grid gap-2 text-xs text-ink-muted sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <span className="text-ink-subtle">Selected</span>
            <p className="font-mono text-ink">{state.compare.selectedCount}</p>
          </div>
          <div>
            <span className="text-ink-subtle">Current score</span>
            <p className="font-mono text-ink">{state.compare.currentScore}</p>
          </div>
          <div>
            <span className="text-ink-subtle">Baseline</span>
            <p className="truncate text-ink">{state.compare.baselineTitle ?? "—"}</p>
          </div>
          <div>
            <span className="text-ink-subtle">Delta</span>
            <p className="font-mono text-ink">{compareScoreLabel(state.compare.scoreDelta)}</p>
          </div>
        </div>
        {state.compare.divergingSignals.length > 0 ? (
          <p className="mt-2 text-[11px] text-amber-800">
            Diverges on: {state.compare.divergingSignals.join(", ")}
          </p>
        ) : (
          <p className="mt-2 text-[11px] text-ink-subtle">
            No major trust-signal divergence detected in the current selection.
          </p>
        )}
      </div>

      <div className="mt-4 grid gap-3 lg:grid-cols-2">
        {state.sections.map((section) => (
          <SectionCard
            key={section.id}
            title={section.title}
            summary={section.summary}
            tone={section.tone}
            items={section.items}
          />
        ))}
      </div>
    </section>
  );
}
