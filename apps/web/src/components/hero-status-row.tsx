import { Link } from "@tanstack/react-router";
import { LiveVersionBadge } from "./live-version-badge";

/**
 * Hero status row: live-ish signals stitched together as a single line.
 * - Indexed timestamp from the generated registry manifest
 * - MCP SDK version (live from npm)
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
  return (
    <div className="flex flex-wrap items-center gap-2 text-xs">
      <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface px-2.5 py-1 font-mono text-ink-muted">
        <span className="relative flex h-1.5 w-1.5">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-trust-trusted/60" />
          <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-trust-trusted" />
        </span>
        Indexed {indexedLabel} · {resourceCount} resources · {reviewedCount} reviewed
      </span>
      <Link
        to="/integrations/$slug"
        params={{ slug: "mcp-server" }}
        className="hidden sm:inline-flex"
      >
        <LiveVersionBadge
          pkg="@modelcontextprotocol/sdk"
          fallbackVersion="1.0.0"
          showDownloads={false}
        />
      </Link>
      <Link
        to="/brief"
        className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface px-2.5 py-1 text-ink-muted hover:text-ink"
      >
        <span className="font-mono text-ink">Brief #{briefNumber}</span>
        <span className="text-ink-subtle">·</span>
        <span>{briefDate}</span>
        <span aria-hidden>→</span>
      </Link>
    </div>
  );
}
