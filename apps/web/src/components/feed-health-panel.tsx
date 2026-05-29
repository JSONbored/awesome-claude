import * as React from "react";
import { CheckCircle2, AlertTriangle, ExternalLink, Loader2 } from "lucide-react";
import { CopyButton } from "@/components/copy-button";
import { cn } from "@/lib/utils";

interface FeedHealth {
  id: string;
  title: string;
  url: string;
  itemCount: number;
  latestItemAt: string | null;
  lastBuilt: string;
  etag: string;
  isCurrent: boolean;
}

interface HealthPayload {
  generatedAt: string;
  count: number;
  feeds: FeedHealth[];
}

function formatAgo(iso: string | null): string {
  if (!iso) return "—";
  const ms = Date.now() - new Date(iso).getTime();
  const m = Math.round(ms / 60000);
  if (m < 1) return "just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.round(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.round(h / 24);
  return `${d}d ago`;
}

export function FeedHealthPanel({ compact = false }: { compact?: boolean }) {
  const [data, setData] = React.useState<HealthPayload | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    let cancelled = false;
    fetch("/api/public/feeds/health", { headers: { Accept: "application/json" } })
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(`HTTP ${r.status}`))))
      .then((j: HealthPayload) => {
        if (!cancelled) setData(j);
      })
      .catch((e) => {
        if (!cancelled) setError(e instanceof Error ? e.message : "Failed to load");
      });
    return () => {
      cancelled = true;
    };
  }, []);

  if (error) {
    return (
      <div className="rounded-lg border border-border bg-surface p-4 text-sm text-ink-muted">
        Feed health unavailable: {error}
      </div>
    );
  }
  if (!data) {
    return (
      <div className="flex items-center gap-2 rounded-lg border border-border bg-surface p-4 text-sm text-ink-muted">
        <Loader2 className="h-3.5 w-3.5 animate-spin" /> Loading feed health…
      </div>
    );
  }

  const total = data.feeds.length;
  const current = data.feeds.filter((f) => f.isCurrent).length;
  const visible = compact ? data.feeds.slice(0, 5) : data.feeds;

  return (
    <div className="rounded-xl border border-border bg-surface">
      <div className="flex items-center justify-between gap-3 border-b border-border px-4 py-3">
        <div>
          <div className="font-display text-sm font-semibold text-ink">Feed health</div>
          <p className="text-xs text-ink-muted">
            {current}/{total} feeds current · last checked {formatAgo(data.generatedAt)}
          </p>
        </div>
        <a
          href="/api/public/feeds/health"
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1 text-xs text-ink-muted hover:text-ink"
        >
          JSON <ExternalLink className="h-3 w-3" />
        </a>
      </div>
      <div className="divide-y divide-border">
        {visible.map((f) => (
          <div
            key={f.id}
            className={cn(
              "grid gap-1 border-l-2 px-4 py-3 text-xs tabular-nums sm:grid-cols-[1.4fr_repeat(4,minmax(0,1fr))_auto] sm:items-center",
              f.isCurrent
                ? "border-l-trust-trusted/50"
                : "border-l-trust-blocked/60 bg-trust-blocked/[0.02]",
            )}
          >
            <div className="flex items-center gap-2">
              <span
                className={cn(
                  "inline-flex h-4 items-center gap-1 rounded-full px-1.5 text-[10px] font-medium",
                  f.isCurrent
                    ? "bg-trust-trusted/10 text-trust-trusted"
                    : "bg-trust-blocked/10 text-trust-blocked",
                )}
                aria-label={f.isCurrent ? "Current" : "Stale"}
              >
                {f.isCurrent ? (
                  <CheckCircle2 className="h-2.5 w-2.5" />
                ) : (
                  <AlertTriangle className="h-2.5 w-2.5" />
                )}
                {f.isCurrent ? "Current" : "Stale"}
              </span>
              <a href={f.url} className="truncate font-medium text-ink hover:underline">
                {f.title}
              </a>
            </div>
            <div className="text-ink-muted">{f.itemCount} items</div>
            <div className="text-ink-muted">latest {formatAgo(f.latestItemAt)}</div>
            <div className="text-ink-muted">built {formatAgo(f.lastBuilt)}</div>
            <div className="truncate font-mono text-ink-subtle" title={f.etag}>
              {f.etag.replace(/"/g, "")}
            </div>
            <CopyButton value={f.url} label="Copy" />
          </div>
        ))}
      </div>
      {compact && data.feeds.length > visible.length && (
        <div className="border-t border-border px-4 py-2 text-right text-xs">
          <a href="/feeds" className="text-ink-muted hover:text-ink">
            See all {data.feeds.length} feeds →
          </a>
        </div>
      )}
    </div>
  );
}
