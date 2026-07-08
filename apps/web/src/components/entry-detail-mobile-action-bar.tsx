import { useCallback } from "react";
import { toast } from "sonner";
import { Copy, ExternalLink, Package, FileText, Terminal, GitCompare } from "lucide-react";
import type { Entry } from "@/types/registry";
import {
  ENTRY_COMMAND_CENTER_ID,
  resolveDetailMobileActions,
} from "@/lib/entry-detail-command-center";
import { entryDetailMobileCompareAction } from "@/lib/entry-detail-compare-ui";
import { siteConfig } from "@/lib/site";
import { absoluteUrl } from "@/lib/seo";
import { trackEvent } from "@/lib/analytics";
import {
  entryDetailMobileActionAnalyticsData,
  entryDetailMobileActionAnalyticsEvent,
  entryDetailMobileCopyIntentType,
  entryDetailMobileLinkIntentType,
} from "@/lib/entry-detail-cta-events";
import { recordIntentEvent } from "@/lib/intent-event-client";
import { cn } from "@/lib/utils";

type EntryDetailMobileActionBarProps = {
  entry: Entry;
  copyPayload?: string;
  compareCta: {
    inCompare: boolean;
    compareCount: number;
    onToggle: () => void;
  };
};

export function EntryDetailMobileActionBar({
  entry,
  copyPayload,
  compareCta,
}: EntryDetailMobileActionBarProps) {
  const entryPageUrl = absoluteUrl(`/entry/${entry.category}/${entry.slug}`);
  const actions = resolveDetailMobileActions(
    entry,
    copyPayload,
    entryPageUrl,
    siteConfig.githubUrl,
  );
  const compareAction = entryDetailMobileCompareAction(
    compareCta.inCompare,
    compareCta.compareCount,
  );

  const onCompare = useCallback(() => {
    if (compareAction.disabled) {
      if (compareAction.hint) toast.error(compareAction.hint);
      return;
    }
    compareCta.onToggle();
  }, [compareAction.disabled, compareAction.hint, compareCta]);

  const onAction = useCallback(
    async (actionId: string) => {
      const action = actions.find((item) => item.id === actionId);
      if (!action) return;

      const analyticsData = entryDetailMobileActionAnalyticsData(
        entry.category,
        entry.slug,
        actionId,
      );

      if (action.kind === "scroll" && action.scrollTargetId) {
        trackEvent(entryDetailMobileActionAnalyticsEvent(actionId), analyticsData);
        const target = document.getElementById(action.scrollTargetId ?? ENTRY_COMMAND_CENTER_ID);
        target?.scrollIntoView({ behavior: "smooth", block: "start" });
        return;
      }

      if (action.kind === "copy" && action.copyValue) {
        try {
          await navigator.clipboard.writeText(action.copyValue);
          trackEvent(entryDetailMobileActionAnalyticsEvent(actionId), analyticsData);
          void recordIntentEvent(entryDetailMobileCopyIntentType(entry), entry);
          toast.success("Copied install command");
        } catch {
          toast.error("Copy failed");
        }
        return;
      }

      if (action.kind === "link" && action.href) {
        trackEvent(entryDetailMobileActionAnalyticsEvent(actionId), analyticsData);
        const intentType = entryDetailMobileLinkIntentType(actionId);
        if (intentType) void recordIntentEvent(intentType, entry);
        if (action.external) {
          window.open(action.href, "_blank", "noopener,noreferrer");
        } else {
          window.location.assign(action.href);
        }
      }
    },
    [actions, entry],
  );

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/95 px-3 py-2 backdrop-blur lg:hidden">
      <div className="pointer-events-auto mx-auto flex max-w-[1200px] gap-2">
        <button
          type="button"
          onClick={onCompare}
          disabled={compareAction.disabled}
          aria-label={compareAction.label}
          className={cn(
            "inline-flex h-10 min-w-0 flex-1 items-center justify-center gap-1.5 rounded-md px-2 text-xs font-medium",
            compareAction.inCompare
              ? "border border-accent/40 bg-accent/10 text-ink"
              : "border border-border bg-surface text-ink hover:bg-surface-2",
            compareAction.disabled && "cursor-not-allowed opacity-60",
          )}
        >
          <GitCompare className="h-3.5 w-3.5" />
          <span className="truncate">{compareAction.label}</span>
          <span className="rounded bg-ink/10 px-1 font-mono text-[10px] text-ink-muted">
            {compareAction.compareCount}/{compareAction.maxCount}
          </span>
        </button>
        {actions.map((action) => {
          const icon =
            action.id === "install" ? (
              <Package className="h-3.5 w-3.5" />
            ) : action.id === "copy" ? (
              <Copy className="h-3.5 w-3.5" />
            ) : action.id === "llms" ? (
              <Terminal className="h-3.5 w-3.5" />
            ) : action.id === "source" || action.id === "suggest" ? (
              <ExternalLink className="h-3.5 w-3.5" />
            ) : (
              <FileText className="h-3.5 w-3.5" />
            );

          return (
            <button
              key={action.id}
              type="button"
              onClick={() => onAction(action.id)}
              className={cn(
                "inline-flex h-10 min-w-0 flex-1 items-center justify-center gap-1.5 rounded-md px-2 text-xs font-medium",
                action.primary
                  ? "bg-ink text-background hover:bg-ink/90"
                  : "border border-border bg-surface text-ink hover:bg-surface-2",
              )}
            >
              {icon}
              <span className="truncate">{action.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
