/**
 * Pure compare entry action helpers.
 *
 * Builds the next-action CTAs shown in compare drawers and tables from entry
 * metadata. Nothing here touches the network — given the same entry fields the
 * output is deterministic.
 *
 * The public surface (`compare-entry-actions.ts` / `@/lib/compare-entry-actions`)
 * re-exports everything below and keeps async intent-event recording in the
 * wrapper.
 */

import type { Entry } from "@/types/registry";
import { claimCtaAnalyticsEvent } from "@/lib/conversion-cta-events-lib";

export type CompareActionKind = "link" | "copy";

export type CompareAction = {
  id: string;
  label: string;
  kind: CompareActionKind;
  href?: string;
  copyValue?: string;
  intentType?: "copy" | "open" | "install";
  analyticsEvent?: string;
  external?: boolean;
};

function entryRegistryApiPath(category: string, slug: string): string {
  return `/api/registry/entries/${category}/${slug}`;
}

function entryLlmsApiPath(category: string, slug: string): string {
  return `${entryRegistryApiPath(category, slug)}/llms`;
}

export function resolveCompareEntryActions(
  entry: Pick<
    Entry,
    "category" | "slug" | "installCommand" | "sourceUrl" | "claimed" | "configSnippet" | "platforms"
  >,
): CompareAction[] {
  const actions: CompareAction[] = [
    {
      id: "dossier",
      label: "Open dossier",
      kind: "link",
      intentType: "open",
      analyticsEvent: "compare_open_dossier",
    },
  ];

  if (entry.installCommand) {
    actions.push({
      id: "install",
      label: "Copy install",
      kind: "copy",
      copyValue: entry.installCommand,
      intentType: "install",
      analyticsEvent: "compare_copy_install",
    });
  }

  if (entry.configSnippet) {
    actions.push({
      id: "config",
      label: "Copy config",
      kind: "copy",
      copyValue: entry.configSnippet,
      intentType: "copy",
      analyticsEvent: "compare_copy_config",
    });
  }

  if (entry.sourceUrl) {
    actions.push({
      id: "api-json",
      label: "API JSON",
      kind: "link",
      href: entryRegistryApiPath(entry.category, entry.slug),
      intentType: "open",
      analyticsEvent: "compare_open_api_json",
    });
    actions.push({
      id: "llms",
      label: "Open LLM",
      kind: "link",
      href: entryLlmsApiPath(entry.category, entry.slug),
      intentType: "open",
      analyticsEvent: "compare_open_llms",
    });
    if (entry.category === "mcp") {
      actions.push({
        id: "mcp-feed",
        label: "MCP feed",
        kind: "link",
        href: "/data/mcp-registry-feed.json",
        intentType: "open",
        analyticsEvent: "compare_open_mcp_feed",
      });
    }
  }

  if (entry.sourceUrl && (entry.platforms ?? []).includes("raycast")) {
    actions.push({
      id: "raycast",
      label: "Open Raycast",
      kind: "link",
      href: "https://www.raycast.com/jsonbored/heyclaude",
      intentType: "open",
      analyticsEvent: "compare_open_raycast",
      external: true,
    });
  }

  if (entry.sourceUrl) {
    actions.push({
      id: "source",
      label: "Open source",
      kind: "link",
      href: entry.sourceUrl,
      intentType: "open",
      analyticsEvent: "compare_open_source",
      external: true,
    });
  }

  if (entry.sourceUrl) {
    actions.push({
      id: "newsletter",
      label: "Newsletter",
      kind: "link",
      href: "/subscriptions",
      analyticsEvent: "compare_open_newsletter",
    });
  }

  if (!entry.claimed) {
    actions.push({
      id: "claim",
      label: "Claim listing",
      kind: "link",
      analyticsEvent: claimCtaAnalyticsEvent(),
    });
  }

  return actions;
}

export function compareActionSignature(entry: Entry): string {
  return resolveCompareEntryActions(entry)
    .map((action) => action.id)
    .join("|");
}

export function compareActionsDiverge(entries: Entry[]): boolean {
  if (entries.length < 2) return false;
  return new Set(entries.map(compareActionSignature)).size > 1;
}
