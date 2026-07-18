import { Link } from "@tanstack/react-router";
import { LiveVersionBadge } from "./live-version-badge";
import { trackEvent } from "@/lib/analytics";
import {
  heroStatusRowDestination,
  heroStatusRowEgressAnalyticsData,
  heroStatusRowEgressAnalyticsEvent,
  type HeroStatusRowDestination,
} from "@/lib/hero-status-row-cta-events";

/**
 * Hero status row: live-ish signals stitched together as a single line.
 * - Indexed timestamp from the generated registry manifest
 * - @heyclaude/mcp version (live from npm)
 * - Latest weekly brief
 */
export function HeroStatusRow({
  resourceCount,
  reviewedCount,
  briefNumber,
  briefDate,
  indexedAt,
}: {
  resourceCount: number;
  reviewedCount: number;
  briefNumber: number;
  briefDate: string;
  indexedAt: string;
}) {
  const indexedLabel = indexedAt ? indexedAt.slice(0, 16).replace("T", " ") : "latest build";
  const egressData = (destination: HeroStatusRowDestination) =>
    heroStatusRowEgressAnalyticsData(destination, resourceCount, reviewedCount, briefNumber);

  const mcpDestination = heroStatusRowDestination("mcp-server");
  const briefDestination = heroStatusRowDestination("brief");

  return (
    <div className="flex flex-wrap items-center gap-2 text-xs">
      <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface px-2.5 py-1 font-mono text-ink-muted">
        <span className="relative flex h-1.5 w-1.5">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-trust-trusted/60" />
          <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-trust-trusted" />
        </span>
        Indexed {indexedLabel} · {resourceCount} resources · {reviewedCount} reviewed
      </span>
      {mcpDestination?.to === "/integrations/$slug" ? (
        <Link
          to={mcpDestination.to}
          params={mcpDestination.params}
          className="hidden sm:inline-flex"
          onClick={() => trackEvent(heroStatusRowEgressAnalyticsEvent(), egressData("mcp-server"))}
        >
          <LiveVersionBadge pkg="@heyclaude/mcp" fallbackVersion="0.3.1" showDownloads={false} />
        </Link>
      ) : null}
      {briefDestination?.to === "/brief" ? (
        <Link
          to={briefDestination.to}
          className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface px-2.5 py-1 text-ink-muted hover:text-ink"
          onClick={() => trackEvent(heroStatusRowEgressAnalyticsEvent(), egressData("brief"))}
        >
          <span className="font-mono text-ink">Brief #{briefNumber}</span>
          <span className="text-ink-subtle">·</span>
          <span>{briefDate}</span>
          <span aria-hidden>→</span>
        </Link>
      ) : null}
    </div>
  );
}
