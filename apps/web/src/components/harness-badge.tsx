import { Link } from "@tanstack/react-router";
import { cn } from "@/lib/utils";
import { IntegrationMark, platformMark } from "./integration-marks";
import { PLATFORM_LABEL, type Harness } from "@/types/registry";
import { trackEvent } from "@/lib/analytics";
import {
  harnessBadgeAnalyticsData,
  harnessBadgeAnalyticsEvent,
  harnessBadgeHubDestination,
} from "@/lib/harness-badge-cta-events";

export function HarnessBadge({
  id,
  size = "sm",
  className,
  asLink = false,
  surface,
}: {
  id: Harness;
  size?: "xs" | "sm";
  className?: string;
  /** Opt-in platform hub link — never use inside card `<Link>`s. */
  asLink?: boolean;
  /** Optional analytics surface when asLink is set. */
  surface?: string;
}) {
  const mark = platformMark(id);
  const px = size === "xs" ? "px-1.5 py-0.5 text-[10px]" : "px-2 py-0.5 text-[11px]";
  const classes = cn(
    "inline-flex items-center gap-1 rounded-md border border-border bg-surface text-ink-muted",
    px,
    className,
  );
  const content = (
    <>
      {mark && (
        <IntegrationMark name={mark} size={size === "xs" ? 10 : 11} className="opacity-80" />
      )}
      {PLATFORM_LABEL[id]}
    </>
  );
  if (asLink) {
    const destination = harnessBadgeHubDestination(id);
    if (!destination) {
      return (
        <span className={classes} title={`Works with ${PLATFORM_LABEL[id]}`}>
          {content}
        </span>
      );
    }
    return (
      <Link
        to={destination.to}
        params={destination.params}
        title={`Works with ${PLATFORM_LABEL[id]} — open platform hub`}
        onClick={() =>
          trackEvent(harnessBadgeAnalyticsEvent(), harnessBadgeAnalyticsData(id, surface))
        }
        className={cn(classes, "transition-colors hover:border-ink/20 hover:text-ink")}
      >
        {content}
      </Link>
    );
  }
  return (
    <span className={classes} title={`Works with ${PLATFORM_LABEL[id]}`}>
      {content}
    </span>
  );
}

export function HarnessBadgeRow({
  ids,
  className,
  asLink = false,
  surface,
}: {
  ids: Harness[];
  className?: string;
  asLink?: boolean;
  surface?: string;
}) {
  if (!ids?.length) return null;
  return (
    <div className={cn("flex flex-wrap gap-1", className)}>
      {ids.map((id) => (
        <HarnessBadge key={id} id={id} asLink={asLink} surface={surface} />
      ))}
    </div>
  );
}
