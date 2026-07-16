import * as React from "react";
import { useQuery } from "@tanstack/react-query";
import { Package } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatCompact, timeAgo } from "@/lib/format";
import { trackEvent } from "@/lib/analytics";
import {
  liveVersionBadgeAnalyticsData,
  liveVersionBadgeAnalyticsEvent,
  type LiveVersionBadgeSurface,
} from "@/lib/live-version-cta-events";

interface NpmMeta {
  name: string;
  version: string;
  publishedAt: string | null;
  weeklyDownloads: number | null;
}

async function fetchNpm(pkg: string): Promise<NpmMeta> {
  const res = await fetch(`/api/public/npm/${pkg}`);
  if (!res.ok) throw new Error(`npm fetch failed: ${res.status}`);
  return res.json();
}

/**
 * Compact live version chip backed by /api/public/npm proxy.
 * Falls back to `fallbackVersion` and `fallbackUpdatedAt` while loading or
 * if the proxy fails. Always renders something — never blank.
 *
 * `asLink` is opt-in so callers that already wrap the badge in a `<Link>`
 * (e.g. home hero) do not nest anchors.
 */
export function LiveVersionBadge({
  pkg,
  fallbackVersion,
  fallbackUpdatedAt,
  showDownloads = true,
  className,
  asLink = false,
  analyticsSurface = "integration-card",
}: {
  pkg: string;
  fallbackVersion?: string;
  fallbackUpdatedAt?: string;
  showDownloads?: boolean;
  className?: string;
  asLink?: boolean;
  analyticsSurface?: LiveVersionBadgeSurface;
}) {
  const { data, isError } = useQuery({
    queryKey: ["npm", pkg],
    queryFn: () => fetchNpm(pkg),
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    retry: 1,
  });

  const version = data?.version ?? fallbackVersion;
  const updatedAt = data?.publishedAt ?? fallbackUpdatedAt;
  const downloads = data?.weeklyDownloads;
  const live = !!data && !isError;

  const body = (
    <>
      <Package className="h-3 w-3" aria-hidden />
      {version ? <span className="text-ink">v{version.replace(/^v/, "")}</span> : <span>—</span>}
      {showDownloads && downloads != null && (
        <>
          <span className="text-ink-subtle">·</span>
          <span>{formatCompact(downloads)}/wk</span>
        </>
      )}
      {live && (
        <span
          aria-hidden
          className="ml-0.5 h-1.5 w-1.5 rounded-full bg-trust-trusted"
          title="Live from npm registry"
        />
      )}
    </>
  );

  const classes = cn(
    "inline-flex items-center gap-1.5 rounded-md border border-border bg-surface px-2 py-0.5 font-mono text-[11px] text-ink-muted",
    className,
  );
  const title = live ? `Latest on npm · published ${timeAgo(updatedAt)}` : "Last known release";

  if (asLink) {
    return (
      <a
        href={`https://www.npmjs.com/package/${encodeURIComponent(pkg)}`}
        target="_blank"
        rel="noreferrer"
        onClick={() =>
          trackEvent(
            liveVersionBadgeAnalyticsEvent(),
            liveVersionBadgeAnalyticsData(analyticsSurface, live),
          )
        }
        className={cn(classes, "transition-colors hover:border-ink/20 hover:text-ink")}
        title={title}
      >
        {body}
      </a>
    );
  }

  return (
    <span className={classes} title={title}>
      {body}
    </span>
  );
}
