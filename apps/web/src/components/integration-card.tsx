import { Link } from "@tanstack/react-router";
import { ArrowUpRight, Globe2, Layers, Sparkles, Terminal } from "lucide-react";
import type { Integration } from "@/types/registry";
import { IntegrationMarkTile } from "./integration-marks";
import { LiveVersionBadge } from "./live-version-badge";
import { CopyButton } from "./copy-button";
import { cn } from "@/lib/utils";
import {
  integrationCardCopyAnalyticsData,
  integrationCardCopyAnalyticsEvent,
} from "@/lib/integration-card-cta-events";

const STATUS_STYLES: Record<Integration["status"], string> = {
  live: "text-trust-trusted",
  beta: "text-trust-review",
  "read-only": "text-ink-muted",
};

const SURFACE_ICON = {
  web: Globe2,
  mcp: Layers,
  raycast: Sparkles,
  api: Terminal,
} as const;

type IntegrationCardLinkDestination = {
  to: "/integrations/$slug";
  params: { slug: string };
};

export function IntegrationCard({
  integration,
  compact,
  onNavigate,
  linkDestination,
}: {
  integration: Integration;
  compact?: boolean;
  onNavigate?: () => void;
  linkDestination?: IntegrationCardLinkDestination | null;
}) {
  const surface = integration.surface;
  const SurfaceIcon = surface ? SURFACE_ICON[surface.kind] : null;
  const cardClassName =
    "group relative flex min-w-0 flex-col gap-4 rounded-xl border border-border bg-surface p-5 transition-colors duration-200 ease-out hover:bg-surface-2";

  const inner = (
    <>
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <IntegrationMarkTile name={integration.mark} size={compact ? 44 : 56} />
          <div className="min-w-0">
            <div className="truncate font-display text-base font-semibold tracking-tight text-ink">
              {integration.name}
            </div>
            <div className="mt-0.5 flex flex-wrap items-center gap-1.5 text-xs text-ink-muted">
              <span className="truncate">{integration.tier}</span>
              {surface && SurfaceIcon && (
                <span className="inline-flex items-center gap-1 rounded-md border border-border bg-background px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-wider text-ink">
                  <SurfaceIcon className="h-2.5 w-2.5" />
                  {surface.label}
                </span>
              )}
            </div>
          </div>
        </div>
        <span
          className={cn(
            "inline-flex shrink-0 items-center gap-1 text-[11px] font-medium uppercase tracking-wider",
            STATUS_STYLES[integration.status],
          )}
        >
          <span className="h-1.5 w-1.5 rounded-full bg-current" />
          {integration.status}
        </span>
      </div>
      <p className="text-sm text-ink-muted">{integration.tagline}</p>
      {surface && (
        <div
          className="flex min-w-0 items-center gap-1.5 rounded-md border border-border bg-background px-2 py-1.5"
          onClick={(e) => e.preventDefault()}
        >
          <code className="min-w-0 flex-1 truncate font-mono text-[11px] text-ink">
            {surface.snippet}
          </code>
          <CopyButton
            value={surface.snippet}
            label="Copy"
            size="sm"
            event={integrationCardCopyAnalyticsEvent()}
            eventData={integrationCardCopyAnalyticsData(
              integration.slug,
              surface.kind,
              integration.status,
            )}
          />
        </div>
      )}
      {!compact && (
        <ul className="space-y-1.5 text-xs text-ink-muted">
          {integration.bullets.slice(0, 3).map((b) => (
            <li key={b} className="flex gap-2">
              <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-ink-subtle" />
              {b}
            </li>
          ))}
        </ul>
      )}
      <div className="mt-auto flex items-center justify-between border-t border-border pt-3 text-xs text-ink-muted">
        <div className="flex min-w-0 items-center gap-2 font-mono">
          {integration.npmPackage ? (
            <LiveVersionBadge
              pkg={integration.npmPackage}
              fallbackVersion={integration.version}
              fallbackUpdatedAt={integration.updatedAt}
              showDownloads={false}
              asLink
              analyticsSurface="integration-card"
            />
          ) : (
            <>
              {integration.version && <span>{integration.version}</span>}
              {integration.updatedAt && (
                <span className="text-ink-subtle">· {integration.updatedAt}</span>
              )}
            </>
          )}
        </div>
        <span className="inline-flex shrink-0 items-center gap-1 text-ink group-hover:underline">
          Details <ArrowUpRight className="h-3 w-3" />
        </span>
      </div>
    </>
  );

  if (linkDestination === null) {
    return <div className={cardClassName}>{inner}</div>;
  }

  const destination = linkDestination ?? {
    to: "/integrations/$slug" as const,
    params: { slug: integration.slug },
  };

  return (
    <Link
      to={destination.to}
      params={destination.params}
      onClick={onNavigate}
      className={cardClassName}
    >
      {inner}
    </Link>
  );
}
