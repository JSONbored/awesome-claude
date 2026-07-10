import * as React from "react";
import { Share2, Link2, FileText, Code2, Image as ImageIcon } from "lucide-react";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { trackEvent } from "@/lib/analytics";
import {
  entryDetailShareAnalyticsData,
  entryDetailShareAnalyticsEvent,
  type EntryDetailShareAction,
} from "@/lib/entry-detail-share-cta-events";
import { absoluteShareUrl } from "@/lib/share-url-lib";

export interface ShareMenuProps {
  /** Absolute or root-relative URL of the entry page. */
  url: string;
  title: string;
  description?: string;
  /** Optional path to llms.txt asset. */
  llmsUrl?: string;
  /** Optional path to OG preview image. */
  ogUrl?: string;
  /** Optional raycast deeplink (e.g. raycast://extensions/...). */
  raycastUrl?: string;
  /** When set, emits detail share analytics for dropdown actions. */
  analyticsEntry?: { category: string; slug: string };
}

async function copy(value: string, label: string) {
  try {
    await navigator.clipboard.writeText(value);
    toast.success(label);
  } catch {
    toast.error("Could not copy to clipboard");
  }
}

export function ShareMenu({
  url,
  title,
  description,
  llmsUrl,
  ogUrl,
  raycastUrl,
  analyticsEntry,
}: ShareMenuProps) {
  const absolute = absoluteShareUrl(
    url,
    typeof window === "undefined" ? "" : window.location.origin,
  );
  const citation = description
    ? `[${title}](${absolute}) — ${description}`
    : `[${title}](${absolute})`;

  const trackShare = React.useCallback(
    (action: EntryDetailShareAction) => {
      if (!analyticsEntry) return;
      trackEvent(
        entryDetailShareAnalyticsEvent(),
        entryDetailShareAnalyticsData(analyticsEntry.category, analyticsEntry.slug, action),
      );
    },
    [analyticsEntry],
  );

  const onNativeShare = async () => {
    trackShare("system-share");
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({ title, text: description, url: absolute });
      } catch {
        /* user cancelled */
      }
    } else {
      copy(absolute, "Link copied");
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          aria-label="Share this resource"
          className="inline-flex h-8 items-center gap-1.5 rounded-md border border-border bg-surface px-2.5 text-xs text-ink-muted transition-colors duration-200 ease-out hover:bg-surface-2 hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60"
        >
          <Share2 className="h-3.5 w-3.5" />
          Share
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-60">
        <DropdownMenuLabel className="text-xs">Share this resource</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onSelect={() => {
            trackShare("copy-link");
            void copy(absolute, "Link copied");
          }}
        >
          <Link2 className="mr-2 h-3.5 w-3.5" />
          Copy link
        </DropdownMenuItem>
        <DropdownMenuItem
          onSelect={() => {
            trackShare("copy-markdown");
            void copy(citation, "Markdown citation copied");
          }}
        >
          <FileText className="mr-2 h-3.5 w-3.5" />
          Copy as markdown
        </DropdownMenuItem>
        {llmsUrl && (
          <DropdownMenuItem asChild>
            <a
              href={llmsUrl}
              target="_blank"
              rel="noreferrer"
              onClick={() => trackShare("open-llms")}
            >
              <Code2 className="mr-2 h-3.5 w-3.5" />
              Open llms.txt
            </a>
          </DropdownMenuItem>
        )}
        {ogUrl && (
          <DropdownMenuItem asChild>
            <a href={ogUrl} target="_blank" rel="noreferrer" onClick={() => trackShare("view-og")}>
              <ImageIcon className="mr-2 h-3.5 w-3.5" />
              View share image
            </a>
          </DropdownMenuItem>
        )}
        {raycastUrl && (
          <DropdownMenuItem asChild>
            <a href={raycastUrl} onClick={() => trackShare("open-raycast")}>
              <Share2 className="mr-2 h-3.5 w-3.5" />
              Open in Raycast
            </a>
          </DropdownMenuItem>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem onSelect={() => void onNativeShare()}>
          <Share2 className="mr-2 h-3.5 w-3.5" />
          System share…
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
