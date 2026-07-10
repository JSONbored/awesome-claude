import { Link } from "@tanstack/react-router";
import { BookOpen, Code2, ExternalLink, GitBranch } from "lucide-react";
import type { EntryQuickLink } from "@/lib/entry-detail-sidebar-lib";
import { trackEvent, outboundHost } from "@/lib/analytics";
import {
  ENTRY_DETAIL_RAIL_SURFACE,
  entryDetailDocsAnalyticsData,
  entryDetailDocsAnalyticsEvent,
  entryDetailRegistryJsonAnalyticsData,
  entryDetailRegistryJsonAnalyticsEvent,
  entryDetailSourceAnalyticsData,
  entryDetailSourceAnalyticsEvent,
} from "@/lib/entry-detail-cta-events";
import { recordIntentEvent } from "@/lib/intent-event-client";
import type { Entry } from "@/types/registry";

const QUICK_LINK_ICONS = {
  docs: BookOpen,
  source: GitBranch,
  "registry-json": Code2,
} as const;

export function EntryDetailQuickLinks({
  entry,
  links,
  className,
}: {
  entry: Pick<Entry, "category" | "slug">;
  links: EntryQuickLink[];
  className?: string;
}) {
  if (!links.length) return null;
  return (
    <nav
      aria-label="Entry resource links"
      className={className ?? "mt-3 flex flex-col gap-1.5 text-xs"}
    >
      {links.map((link) => {
        const Icon = QUICK_LINK_ICONS[link.id as keyof typeof QUICK_LINK_ICONS] ?? Code2;
        if (link.href) {
          const href = link.href;
          return (
            <a
              key={link.id}
              href={href}
              target="_blank"
              rel="noreferrer"
              onClick={() => {
                if (link.id === "docs") {
                  trackEvent(
                    entryDetailDocsAnalyticsEvent(),
                    entryDetailDocsAnalyticsData(
                      entry.category,
                      entry.slug,
                      outboundHost(href),
                      ENTRY_DETAIL_RAIL_SURFACE,
                    ),
                  );
                } else if (link.id === "source") {
                  trackEvent(
                    entryDetailSourceAnalyticsEvent(),
                    entryDetailSourceAnalyticsData(
                      entry.category,
                      entry.slug,
                      outboundHost(href),
                      ENTRY_DETAIL_RAIL_SURFACE,
                    ),
                  );
                }
                void recordIntentEvent("open", entry);
              }}
              className="inline-flex items-center gap-1.5 text-ink-muted hover:text-ink"
            >
              <Icon className="h-3.5 w-3.5" aria-hidden />
              {link.label}
              <ExternalLink className="h-3 w-3" aria-hidden />
            </a>
          );
        }
        if (link.to) {
          return (
            <Link
              key={link.id}
              to={link.to}
              onClick={() => {
                if (link.id === "registry-json") {
                  trackEvent(
                    entryDetailRegistryJsonAnalyticsEvent(),
                    entryDetailRegistryJsonAnalyticsData(
                      entry.category,
                      entry.slug,
                      ENTRY_DETAIL_RAIL_SURFACE,
                    ),
                  );
                }
              }}
              className="inline-flex items-center gap-1.5 text-ink-muted hover:text-ink"
            >
              <Icon className="h-3.5 w-3.5" aria-hidden />
              {link.label}
            </Link>
          );
        }
        return null;
      })}
    </nav>
  );
}
