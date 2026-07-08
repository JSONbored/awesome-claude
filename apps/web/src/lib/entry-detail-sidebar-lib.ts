import { TRUST_LABEL, type Entry } from "@/types/registry";
import type { InstallRisk } from "@/lib/trust";

export type EntryReadinessRow = {
  label: string;
  value: string;
  ok: boolean;
};

export type EntryQuickLink = {
  id: string;
  label: string;
  href?: string;
  to?: string;
  external?: boolean;
};

export function entryReadinessRows(entry: Entry): EntryReadinessRow[] {
  return [
    {
      label: "Trust",
      value: TRUST_LABEL[entry.trust],
      ok: entry.trust === "trusted",
    },
    {
      label: "Source",
      value: entry.source,
      ok: entry.source !== "unverified",
    },
    {
      label: "Safety notes",
      value: entry.safetyNotes ? "Present" : "Missing",
      ok: Boolean(entry.safetyNotes),
    },
    {
      label: "Reviewed",
      value: entry.reviewed ? "Yes" : "No",
      ok: Boolean(entry.reviewed),
    },
  ];
}

export function entryQuickLinks(entry: Entry): EntryQuickLink[] {
  const links: EntryQuickLink[] = [];
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
    id: "registry-json",
    label: "Registry JSON · LLM text",
    to: "/browse",
  });
  return links;
}

export type EntryTocItem = {
  id: string;
  label: string;
};

export function buildEntryTocItems(input: {
  risk: InstallRisk;
  hasSafetyNotes: boolean;
  hasPrivacyNotes: boolean;
  hasPrerequisites: boolean;
  hasSchema: boolean;
  hasAlternatives: boolean;
  hasRelated: boolean;
  hasGuides: boolean;
}): EntryTocItem[] {
  const items: EntryTocItem[] = [];
  if (input.risk !== "low") items.push({ id: "risk-callout", label: "Install risk" });
  items.push({ id: "citation-facts", label: "Citation facts" });
  items.push({ id: "adoption-plan", label: "Adoption plan" });
  if (input.hasSafetyNotes) items.push({ id: "safety", label: "Safety notes" });
  if (input.hasPrivacyNotes) items.push({ id: "privacy", label: "Privacy notes" });
  if (input.hasPrerequisites) items.push({ id: "prerequisites", label: "Prerequisites" });
  if (input.hasSchema) items.push({ id: "schema", label: "Schema details" });
  items.push({ id: "about", label: "About this resource" });
  items.push({ id: "citations", label: "Source citations" });
  items.push({ id: "badge", label: "Add a badge" });
  if (input.hasAlternatives) items.push({ id: "compare", label: "How it compares" });
  if (input.hasRelated) items.push({ id: "related", label: "Related" });
  if (input.hasGuides) items.push({ id: "guides", label: "Related guides" });
  items.push({ id: "signals", label: "Signals" });
  return items;
}
