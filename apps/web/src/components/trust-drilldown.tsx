import * as React from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { TrustBadge } from "@/components/badges";
import { getTrustReasons, summarizeTrust, type TrustReason } from "@/lib/trust";
import type { Entry } from "@/types/registry";
import {
  CheckCircle2,
  Info,
  AlertTriangle,
  OctagonX,
  ArrowUpRight,
  ExternalLink,
} from "lucide-react";
import { Link } from "@tanstack/react-router";
import { cn } from "@/lib/utils";

const SEV_META = {
  ok: { Icon: CheckCircle2, className: "text-trust-trusted" },
  info: { Icon: Info, className: "text-ink-muted" },
  warning: { Icon: AlertTriangle, className: "text-trust-review" },
  blocker: { Icon: OctagonX, className: "text-trust-blocked" },
} as const;

export function TrustDrilldown({
  entry,
  align = "start",
}: {
  entry: Entry;
  align?: "start" | "center" | "end";
}) {
  const reasons = React.useMemo(() => getTrustReasons(entry), [entry]);
  const counts = summarizeTrust(reasons);
  const summary = [
    counts.blocker && `${counts.blocker} blocker${counts.blocker === 1 ? "" : "s"}`,
    counts.warning && `${counts.warning} warning${counts.warning === 1 ? "" : "s"}`,
    counts.info && `${counts.info} info`,
  ]
    .filter(Boolean)
    .join(", ");

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          type="button"
          aria-label={`Trust ${entry.trust}${summary ? `: ${summary}` : ""}. Open trust drilldown.`}
          className="rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60"
        >
          <TrustBadge level={entry.trust} />
        </button>
      </PopoverTrigger>
      <PopoverContent align={align} sideOffset={6} className="w-[360px] max-w-[90vw] p-0">
        <header className="flex items-center justify-between border-b border-border bg-surface px-4 py-3">
          <div>
            <div className="eyebrow">Trust drilldown</div>
            <div className="mt-0.5 font-display text-sm font-semibold text-ink">{entry.title}</div>
          </div>
          <Link
            to="/quality"
            hash="preflight"
            className="inline-flex h-7 items-center gap-1 rounded-md border border-border bg-background px-2 text-[11px] font-medium text-ink hover:bg-surface-2"
          >
            Run preflight
            <ArrowUpRight className="h-3 w-3" />
          </Link>
        </header>
        <ul className="max-h-[60vh] divide-y divide-border overflow-y-auto">
          {reasons.map((r) => (
            <TrustReasonRow key={r.id} reason={r} />
          ))}
        </ul>
      </PopoverContent>
    </Popover>
  );
}

function TrustReasonRow({ reason }: { reason: TrustReason }) {
  const meta = SEV_META[reason.severity];
  const { Icon } = meta;
  return (
    <li className="flex gap-3 px-4 py-3">
      <Icon className={cn("mt-0.5 h-4 w-4 shrink-0", meta.className)} aria-hidden />
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-ink">{reason.label}</span>
          <span
            className={cn(
              "rounded px-1 py-0.5 font-mono text-[9px] uppercase tracking-wider",
              meta.className,
              "bg-surface-2",
            )}
          >
            {reason.severity}
          </span>
        </div>
        <p className="mt-1 text-xs leading-relaxed text-ink-muted">{reason.detail}</p>
        <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px]">
          {reason.docHref && (
            <Link to={reason.docHref} className="text-ink-muted hover:text-ink">
              Why this matters →
            </Link>
          )}
          {reason.sourceHref && (
            <a
              href={reason.sourceHref}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 text-ink-muted hover:text-ink"
            >
              {reason.sourceLabel ?? "Source"} <ExternalLink className="h-3 w-3" />
            </a>
          )}
        </div>
      </div>
    </li>
  );
}
