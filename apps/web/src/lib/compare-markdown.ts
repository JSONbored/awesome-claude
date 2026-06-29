import { brandIdentityLabel } from "@/lib/brand-icons";
import { formatCompact } from "@/lib/format";
import { absoluteUrl } from "@/lib/seo";
import { INSTALL_RISK_LABEL, installRiskLevel } from "@/lib/trust";
import type { Entry } from "@/types/registry";

type CompareMarkdownField = {
  label: string;
  value: (entry: Entry) => string;
};

function cell(value: string) {
  const normalized = value.replace(/\s+/g, " ").trim();
  if (!normalized) return "—";
  return normalized.replace(/\|/g, "\\|");
}

function notesPresence(entry: Entry) {
  const parts: string[] = [];
  if (entry.safetyNotes || entry.trustSignals?.hasSafetyNotes) parts.push("safety");
  if (entry.privacyNotes || entry.trustSignals?.hasPrivacyNotes) parts.push("privacy");
  return parts.length ? parts.join(", ") : "none";
}

const COMPARE_MARKDOWN_FIELDS: CompareMarkdownField[] = [
  { label: "Trust", value: (entry) => entry.trust },
  {
    label: "Install risk",
    value: (entry) => INSTALL_RISK_LABEL[installRiskLevel(entry)],
  },
  { label: "Notes", value: notesPresence },
  { label: "Brand", value: (entry) => brandIdentityLabel(entry) || "—" },
  { label: "Category", value: (entry) => entry.category },
  { label: "Source", value: (entry) => entry.source },
  { label: "Author", value: (entry) => entry.author },
  { label: "Added", value: (entry) => entry.dateAdded || "—" },
  {
    label: "Platforms",
    value: (entry) => (entry.platforms.length ? entry.platforms.join(", ") : "—"),
  },
  {
    label: "Source repo",
    value: (entry) =>
      entry.repoStats?.stars !== undefined
        ? `${formatCompact(entry.repoStats.stars)} repo stars`
        : "—",
  },
  { label: "Safety notes", value: (entry) => entry.safetyNotes || "— missing" },
  { label: "Privacy notes", value: (entry) => entry.privacyNotes || "— missing" },
  {
    label: "Prerequisites",
    value: (entry) =>
      entry.prerequisites?.length ? entry.prerequisites.slice(0, 4).join("; ") : "— none listed",
  },
  { label: "Install", value: (entry) => entry.installCommand || "—" },
  { label: "Config", value: (entry) => entry.configSnippet || "—" },
  { label: "Claim", value: (entry) => (entry.claimed ? "Claimed" : "Unclaimed") },
  {
    label: "HeyClaude URL",
    value: (entry) => absoluteUrl(`/entry/${entry.category}/${entry.slug}`),
  },
];

export function formatCompareMarkdown(entries: ReadonlyArray<Entry>) {
  if (entries.length === 0) return "";

  const titles = entries.map((entry) => cell(entry.title));
  const lines = [
    "# HeyClaude resource comparison",
    "",
    `_Generated from ${absoluteUrl("/compare")}_`,
    "",
    `| Field | ${titles.join(" | ")} |`,
    `| --- | ${titles.map(() => "---").join(" | ")} |`,
  ];

  for (const field of COMPARE_MARKDOWN_FIELDS) {
    lines.push(
      `| ${field.label} | ${entries.map((entry) => cell(field.value(entry))).join(" | ")} |`,
    );
  }

  lines.push("", "## Descriptions", "");
  for (const entry of entries) {
    lines.push(`### ${entry.title}`, "", entry.description.trim(), "");
  }

  return lines.join("\n").trimEnd();
}
