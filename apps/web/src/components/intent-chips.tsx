import * as React from "react";
import { Link } from "@tanstack/react-router";
import { Rocket, ShieldCheck, Database, Zap, Wrench } from "lucide-react";
import { trackEvent } from "@/lib/analytics";
import {
  homeIntentBrowseSearch,
  homeIntentSelectAnalyticsData,
  homeIntentSelectAnalyticsEvent,
} from "@/lib/home-page-cta-events";
import { cn } from "@/lib/utils";

export type Intent = {
  id: string;
  label: string;
  Icon: React.ElementType;
};

export const INTENTS: Intent[] = [
  {
    id: "ship-faster",
    label: "Ship faster",
    Icon: Rocket,
  },
  {
    id: "review-safely",
    label: "Review code safely",
    Icon: ShieldCheck,
  },
  {
    id: "connect-data",
    label: "Connect data",
    Icon: Database,
  },
  {
    id: "automate",
    label: "Automate workflows",
    Icon: Zap,
  },
  {
    id: "harden-agents",
    label: "Harden agents",
    Icon: Wrench,
  },
];

export function IntentChips({
  className,
  size = "md",
}: {
  className?: string;
  size?: "sm" | "md";
}) {
  return (
    <div className={cn("flex flex-wrap items-center gap-1.5", className)}>
      <span className="eyebrow mr-1">What are you building?</span>
      {INTENTS.map((i) => {
        const Icon = i.Icon;
        const search = homeIntentBrowseSearch(i.id);
        if (!search) return null;
        return (
          <Link
            key={i.id}
            to="/browse"
            search={search}
            onClick={() =>
              trackEvent(
                homeIntentSelectAnalyticsEvent(),
                homeIntentSelectAnalyticsData(
                  i.id,
                  Boolean(search.q),
                  Boolean(search.category),
                  Boolean(search.trust),
                ),
              )
            }
            className={cn(
              "group inline-flex items-center gap-1.5 rounded-full border border-border bg-surface text-ink-muted transition-colors duration-200 ease-out hover:border-accent/40 hover:bg-accent/5 hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60",
              size === "sm" ? "h-6 px-2 text-[11px]" : "h-7 px-2.5 text-xs",
            )}
          >
            <Icon
              className="h-3 w-3 text-ink-subtle transition-colors group-hover:text-ink"
              aria-hidden
            />
            {i.label}
          </Link>
        );
      })}
    </div>
  );
}
