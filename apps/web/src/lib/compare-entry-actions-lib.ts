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

export function resolveCompareEntryActions(
  entry: Pick<
    Entry,
    "category" | "slug" | "installCommand" | "sourceUrl" | "claimed" | "configSnippet"
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
      id: "source",
      label: "Open source",
      kind: "link",
      href: entry.sourceUrl,
      intentType: "open",
      analyticsEvent: "compare_open_source",
      external: true,
    });
  }

  if (!entry.claimed) {
    actions.push({
      id: "claim",
      label: "Claim listing",
      kind: "link",
      analyticsEvent: "compare_claim_cta",
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
