/**
 * Pure entry detail command center helpers.
 *
 * Organizes install/copy actions, trust readiness, quick links, and mobile
 * action bar items from entry metadata. Given the same entry fields the
 * output is deterministic — no network or DOM access.
 */

import type { InstallRisk } from "@/lib/trust-lib";
import type { Entry } from "@/types/registry";
import { TRUST_LABEL } from "@/types/registry";

export const ENTRY_COMMAND_CENTER_ID = "entry-command-center";

export type DetailReadinessItem = {
  id: string;
  label: string;
  value: string;
  ok: boolean;
};

export type DetailQuickLink = {
  id: string;
  label: string;
  href: string;
  external?: boolean;
};

export type DetailMobileActionKind = "scroll" | "copy" | "link";

export type DetailMobileAction = {
  id: string;
  label: string;
  kind: DetailMobileActionKind;
  href?: string;
  copyValue?: string;
  scrollTargetId?: string;
  primary?: boolean;
  external?: boolean;
};

export type DetailCommunityAnchor = {
  id: string;
  label: string;
  targetId: string;
  count?: number;
};

function hasInstallPayload(
  entry: Pick<Entry, "installCommand" | "configSnippet" | "fullCopy" | "copySnippet">,
) {
  return Boolean(
    entry.installCommand || entry.configSnippet || entry.fullCopy || entry.copySnippet,
  );
}

function hasSafetyNotes(entry: Pick<Entry, "safetyNotes" | "safetyNotesList">) {
  return Boolean(entry.safetyNotes || entry.safetyNotesList?.length);
}

function hasPrivacyNotes(entry: Pick<Entry, "privacyNotes" | "privacyNotesList">) {
  return Boolean(entry.privacyNotes || entry.privacyNotesList?.length);
}

export function resolveDetailReadinessItems(
  entry: Pick<Entry, "trust" | "source" | "safetyNotes" | "reviewed">,
): DetailReadinessItem[] {
  return [
    {
      id: "trust",
      label: "Trust",
      value: TRUST_LABEL[entry.trust],
      ok: entry.trust === "trusted",
    },
    {
      id: "source",
      label: "Source",
      value: entry.source,
      ok: entry.source !== "unverified",
    },
    {
      id: "safety",
      label: "Safety notes",
      value: entry.safetyNotes ? "Present" : "Missing",
      ok: Boolean(entry.safetyNotes),
    },
    {
      id: "reviewed",
      label: "Reviewed",
      value: entry.reviewed ? "Yes" : "No",
      ok: Boolean(entry.reviewed),
    },
  ];
}

export function resolveDetailQuickLinks(
  entry: Pick<Entry, "docsUrl" | "sourceUrl" | "category" | "slug">,
): DetailQuickLink[] {
  const links: DetailQuickLink[] = [];

  if (entry.docsUrl) {
    links.push({
      id: "docs",
      label: "Documentation",
      href: entry.docsUrl,
      external: true,
    });
  }

  if (entry.sourceUrl) {
    links.push({
      id: "source",
      label: "Source repository",
      href: entry.sourceUrl,
      external: true,
    });
  }

  links.push({
    id: "registry",
    label: "Registry JSON · LLM text",
    href: "/browse",
    external: false,
  });

  links.push({
    id: "llms",
    label: "LLM plain text",
    href: `/api/registry/entries/${entry.category}/${entry.slug}/llms`,
    external: false,
  });

  return links;
}

export function entryDetailSuggestChangeUrl(
  entry: Pick<Entry, "category" | "slug" | "title">,
  entryPageUrl: string,
  githubUrl: string,
): string {
  const title = encodeURIComponent(`Suggest change: ${entry.title}`);
  const body = encodeURIComponent(
    [
      `Entry: ${entryPageUrl}`,
      `Registry ref: \`${entry.category}/${entry.slug}\``,
      "",
      "Describe the metadata or safety improvement:",
      "",
      "- ",
    ].join("\n"),
  );
  return `${githubUrl}/issues/new?title=${title}&body=${body}`;
}

export function resolveDetailMobileActions(
  entry: Pick<
    Entry,
    | "sourceUrl"
    | "installCommand"
    | "configSnippet"
    | "fullCopy"
    | "copySnippet"
    | "category"
    | "slug"
    | "title"
    | "claimed"
  >,
  copyPayload: string | undefined,
  entryPageUrl: string,
  githubUrl: string,
): DetailMobileAction[] {
  const actions: DetailMobileAction[] = [
    {
      id: "install",
      label: "Install",
      kind: "scroll",
      scrollTargetId: ENTRY_COMMAND_CENTER_ID,
      primary: true,
    },
  ];

  if (copyPayload) {
    actions.push({
      id: "copy",
      label: "Copy",
      kind: "copy",
      copyValue: copyPayload,
    });
  }

  if (entry.sourceUrl) {
    actions.push({
      id: "source",
      label: "Source",
      kind: "link",
      href: entry.sourceUrl,
      external: true,
    });
  }

  actions.push({
    id: "suggest",
    label: "Suggest change",
    kind: "link",
    href: entryDetailSuggestChangeUrl(entry, entryPageUrl, githubUrl),
    external: true,
  });

  if (!entry.claimed) {
    actions.push({
      id: "claim",
      label: "Claim",
      kind: "link",
      href: "/claim",
      external: false,
    });
  }

  return actions;
}

export function shouldElevateDetailSafetyGate(
  risk: InstallRisk,
  entry: Pick<
    Entry,
    | "safetyNotes"
    | "privacyNotes"
    | "safetyNotesList"
    | "privacyNotesList"
    | "installCommand"
    | "configSnippet"
    | "fullCopy"
    | "copySnippet"
  >,
): boolean {
  if (risk !== "low") return true;
  if (!hasInstallPayload(entry)) return false;
  return !hasSafetyNotes(entry) || !hasPrivacyNotes(entry);
}

export function detailSafetyGateMessage(
  risk: InstallRisk,
  entry: Pick<
    Entry,
    | "safetyNotes"
    | "privacyNotes"
    | "safetyNotesList"
    | "privacyNotesList"
    | "installCommand"
    | "configSnippet"
    | "fullCopy"
    | "copySnippet"
  >,
): string | null {
  if (!shouldElevateDetailSafetyGate(risk, entry)) return null;

  if (risk === "high") {
    return "High install risk — read safety and privacy notes before copying or installing.";
  }
  if (risk === "review") {
    return "Review safety and privacy notes before installing or copying commands.";
  }

  const missing: string[] = [];
  if (!hasSafetyNotes(entry)) missing.push("safety");
  if (!hasPrivacyNotes(entry)) missing.push("privacy");
  if (missing.length === 0) {
    return "Review trust signals before installing or copying commands.";
  }
  return `Missing ${missing.join(" and ")} notes — review the source before installing.`;
}

export function resolveDetailCommunityAnchors(
  relatedCount: number,
  guideCount: number,
  signalSectionAvailable: boolean,
): DetailCommunityAnchor[] {
  const anchors: DetailCommunityAnchor[] = [];

  if (relatedCount > 0) {
    anchors.push({
      id: "related",
      label: "Related entries",
      targetId: "related",
      count: relatedCount,
    });
  }

  if (guideCount > 0) {
    anchors.push({
      id: "guides",
      label: "Related guides",
      targetId: "guides",
      count: guideCount,
    });
  }

  if (signalSectionAvailable) {
    anchors.push({
      id: "signals",
      label: "Community signals",
      targetId: "signals",
    });
  }

  return anchors;
}

export function detailMobileActionIds(actions: DetailMobileAction[]): string[] {
  return actions.map((action) => action.id);
}
