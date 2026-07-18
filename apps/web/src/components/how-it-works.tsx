import { Search, ShieldCheck, ClipboardCopy, ArrowRight } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { trackEvent } from "@/lib/analytics";
import {
  howItWorksStepAnalyticsData,
  howItWorksStepAnalyticsEvent,
  howItWorksStepDestination,
  type HowItWorksDestination,
  type HowItWorksStepId,
} from "@/lib/how-it-works-cta-events";

const STEPS: Array<{
  n: string;
  Icon: typeof Search;
  title: string;
  body: string;
  stepId: HowItWorksStepId;
  destination: HowItWorksDestination;
  cta: string;
}> = [
  {
    n: "01",
    Icon: Search,
    title: "Search by intent",
    body: 'Find resources by what they do — "postgres mcp", "release notes", "safe hook". No category-hunting.',
    stepId: "search",
    destination: "browse",
    cta: "Open browse",
  },
  {
    n: "02",
    Icon: ShieldCheck,
    title: "Inspect before installing",
    body: "See trust level, source, safety notes, privacy notes, and prerequisites — surfaced before the install button.",
    stepId: "inspect",
    destination: "quality",
    cta: "See quality signals",
  },
  {
    n: "03",
    Icon: ClipboardCopy,
    title: "Copy what you need",
    body: "Install command, MCP config, or full asset. One click. Configs are pinned to verified package versions.",
    stepId: "copy",
    destination: "platforms",
    cta: "Pick a platform",
  },
];

export function HowItWorks() {
  return (
    <section className="mx-auto max-w-page px-4 py-12 sm:px-6">
      <div className="flex items-end justify-between gap-4">
        <div>
          <div className="eyebrow">How it works</div>
          <h2 className="mt-1 font-display text-2xl font-semibold tracking-tight text-ink">
            Search, inspect, install — in that order
          </h2>
        </div>
      </div>
      <div className="mt-6 grid gap-px overflow-hidden rounded-xl border border-border bg-border sm:grid-cols-3">
        {STEPS.map(({ n, Icon, title, body, stepId, destination, cta }, stepIndex) => {
          const routeDestination = howItWorksStepDestination(stepId);
          if (!routeDestination) return null;
          return (
            <Link
              key={n}
              to={routeDestination.to}
              onClick={() =>
                trackEvent(
                  howItWorksStepAnalyticsEvent(),
                  howItWorksStepAnalyticsData(stepId, destination, stepIndex, STEPS.length),
                )
              }
              className="group relative flex flex-col gap-3 bg-surface p-6 transition-colors duration-200 ease-out hover:bg-surface-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-accent/60"
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-[11px] tracking-wider text-ink-subtle">{n}</span>
                <Icon className="h-4 w-4 text-ink-muted transition-colors duration-200 ease-out group-hover:text-ink-hover" />
              </div>
              <div className="font-display text-base font-semibold text-ink">{title}</div>
              <p className="text-sm text-ink-muted">{body}</p>
              <span className="mt-auto inline-flex items-center gap-1 text-xs font-medium text-ink-muted group-hover:text-ink">
                {cta} <ArrowRight className="h-3 w-3" aria-hidden />
              </span>
              <span
                aria-hidden
                className="absolute inset-x-0 top-0 h-px origin-left scale-x-0 bg-accent transition-transform duration-300 group-hover:scale-x-100"
              />
            </Link>
          );
        })}
      </div>
    </section>
  );
}
