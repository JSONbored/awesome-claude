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
}

function abs(url: string) {
  if (typeof window === "undefined") return url;
  if (/^https?:\/\//.test(url)) return url;
  return `${window.location.origin}${url}`;
}

async function copy(value: string, label: string) {
  try {
    await navigator.clipboard.writeText(value);
    toast.success(label);
  } catch {
    toast.error("Could not copy to clipboard");
  }
}

export function ShareMenu({ url, title, description, llmsUrl, ogUrl, raycastUrl }: ShareMenuProps) {
  const absolute = abs(url);
  const citation = description
    ? `[${title}](${absolute}) — ${description}`
    : `[${title}](${absolute})`;

  const onNativeShare = async () => {
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
        <DropdownMenuItem onSelect={() => copy(absolute, "Link copied")}>
          <Link2 className="mr-2 h-3.5 w-3.5" />
          Copy link
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={() => copy(citation, "Markdown citation copied")}>
          <FileText className="mr-2 h-3.5 w-3.5" />
          Copy as markdown
        </DropdownMenuItem>
        {llmsUrl && (
          <DropdownMenuItem asChild>
            <a href={llmsUrl} target="_blank" rel="noreferrer">
              <Code2 className="mr-2 h-3.5 w-3.5" />
              Open llms.txt
            </a>
          </DropdownMenuItem>
        )}
        {ogUrl && (
          <DropdownMenuItem asChild>
            <a href={ogUrl} target="_blank" rel="noreferrer">
              <ImageIcon className="mr-2 h-3.5 w-3.5" />
              View share image
            </a>
          </DropdownMenuItem>
        )}
        {raycastUrl && (
          <DropdownMenuItem asChild>
            <a href={raycastUrl}>
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
