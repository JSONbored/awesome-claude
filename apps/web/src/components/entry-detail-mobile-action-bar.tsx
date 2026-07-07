import { useCallback } from "react";
import { toast } from "sonner";
import { Copy, ExternalLink, Package, FileText } from "lucide-react";
import type { Entry } from "@/types/registry";
import {
  ENTRY_COMMAND_CENTER_ID,
  resolveDetailMobileActions,
} from "@/lib/entry-detail-command-center";
import { siteConfig } from "@/lib/site";
import { absoluteUrl } from "@/lib/seo";
import { cn } from "@/lib/utils";

type EntryDetailMobileActionBarProps = {
  entry: Entry;
  copyPayload?: string;
};

export function EntryDetailMobileActionBar({
  entry,
  copyPayload,
}: EntryDetailMobileActionBarProps) {
  const entryPageUrl = absoluteUrl(`/entry/${entry.category}/${entry.slug}`);
  const actions = resolveDetailMobileActions(
    entry,
    copyPayload,
    entryPageUrl,
    siteConfig.githubUrl,
  );

  const onAction = useCallback(
    async (actionId: string) => {
      const action = actions.find((item) => item.id === actionId);
      if (!action) return;

      if (action.kind === "scroll" && action.scrollTargetId) {
        const target = document.getElementById(action.scrollTargetId ?? ENTRY_COMMAND_CENTER_ID);
        target?.scrollIntoView({ behavior: "smooth", block: "start" });
        return;
      }

      if (action.kind === "copy" && action.copyValue) {
        try {
          await navigator.clipboard.writeText(action.copyValue);
          toast.success("Copied install command");
        } catch {
          toast.error("Copy failed");
        }
        return;
      }

      if (action.kind === "link" && action.href) {
        if (action.external) {
          window.open(action.href, "_blank", "noopener,noreferrer");
        } else {
          window.location.assign(action.href);
        }
      }
    },
    [actions],
  );

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/95 px-3 py-2 backdrop-blur lg:hidden">
      <div className="pointer-events-auto mx-auto flex max-w-[1200px] gap-2">
        {actions.map((action) => {
          const icon =
            action.id === "install" ? (
              <Package className="h-3.5 w-3.5" />
            ) : action.id === "copy" ? (
              <Copy className="h-3.5 w-3.5" />
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
