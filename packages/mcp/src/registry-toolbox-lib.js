import { categoryPrimaryAsset } from "./registry-asset-lib.js";
import { unique } from "./registry-collection-lib.js";
import { notes } from "./registry-response-lib.js";
import { entryTrustSummary } from "./registry-trust-lib.js";
import {
  entryPackageTrustValue,
  entrySourceStatusValue,
} from "./search-ranking.js";

export const TOOLBOX_CONFIG_SNIPPET_INLINE_LIMIT = 600;

export function selectDiverseRankedEntries(ranked, limit) {
  const selected = [];
  const byCategory = new Map();

  for (const item of ranked) {
    const category = item.entry.category || "";
    const current = byCategory.get(category) || 0;
    if (current >= 2) continue;
    selected.push(item);
    byCategory.set(category, current + 1);
    if (selected.length >= limit) return selected;
  }

  for (const item of ranked) {
    if (selected.includes(item)) continue;
    selected.push(item);
    if (selected.length >= limit) return selected;
  }

  return selected;
}

export function toolboxFitReasons(entry, ranking) {
  const reasons = [...(ranking.reasons || []).slice(0, 4)];
  if (entry.category) {
    reasons.push(`${entry.category} workflow surface`);
  }
  if (entrySourceStatusValue(entry) === "available") {
    reasons.push("source-backed metadata");
  }
  if (
    entryPackageTrustValue(entry) === "first-party" ||
    entry.packageVerified ||
    entry.trustSignals?.packageVerified
  ) {
    reasons.push("first-party or verified package signal");
  }
  if (notes(entry.safetyNotes).length && notes(entry.privacyNotes).length) {
    reasons.push("safety and privacy notes present");
  } else if (notes(entry.safetyNotes).length) {
    reasons.push("safety notes present");
  } else if (notes(entry.privacyNotes).length) {
    reasons.push("privacy notes present");
  }
  if (entry.installCommand || entry.downloadUrl || entry.configSnippet) {
    reasons.push("actionable setup surface");
  }
  if ((entry.platforms || []).length) {
    reasons.push(
      `platform compatibility: ${(entry.platforms || []).slice(0, 3).join(", ")}`,
    );
  }
  if ((entry.supportLevels || []).length) {
    reasons.push("support levels documented");
  }
  if (entry.claimStatus === "verified" || entry.reviewedBy) {
    reasons.push("review/provenance metadata");
  }
  return unique(reasons).slice(0, 8);
}

export function toolboxCaveats(entry) {
  const caveats = [];
  const packageTrust = entryPackageTrustValue(entry);
  const safetyNotes = notes(entry.safetyNotes);
  const privacyNotes = notes(entry.privacyNotes);
  if (entrySourceStatusValue(entry) !== "available") {
    caveats.push("Source metadata is missing or incomplete.");
  }
  if (packageTrust === "external") {
    caveats.push("Package/download is external; verify upstream before use.");
  }
  if (entry.downloadUrl && !entryTrustSummary(entry).package.checksum) {
    caveats.push("Download checksum metadata is not present.");
  }
  if (!safetyNotes.length) {
    caveats.push("No structured safety notes are present.");
  }
  if (!privacyNotes.length) {
    caveats.push("No structured privacy notes are present.");
  }
  if (
    ["mcp", "hooks", "commands", "skills", "statuslines"].includes(
      entry.category,
    )
  ) {
    caveats.push(
      "Risk-bearing workflow surface; inspect commands, permissions, and data access before use.",
    );
  }
  return unique(caveats).slice(0, 5);
}

export function toolboxNextActions(entry) {
  return [
    `Inspect entry.detail with category=${entry.category} and slug=${entry.slug}.`,
    `Run entry.trust with category=${entry.category} and slug=${entry.slug}; this is still metadata review only.`,
    "Use entry.compare with nearby candidates before recommending a final stack.",
    `Use entry.asset with category=${entry.category} and slug=${entry.slug} only after trust review.`,
  ];
}

// Distills the ready-to-run install surface for a toolbox entry from its full
// payload so the planner returns copy-pasteable commands instead of pointing at
// more tool calls. Large config snippets are summarized rather than inlined to
// preserve the lean response contract (callers use entry.asset for them).
export function toolboxInstall(entry) {
  if (!entry) return null;
  const installCommand = String(
    entry.installCommand || entry.commandSyntax || "",
  ).trim();
  const configSnippet = String(entry.configSnippet || "").trim();
  const downloadUrl = String(entry.downloadUrl || "").trim();
  const usageSnippet = String(entry.usageSnippet || "").trim();

  const install = {
    installable: Boolean(entry.installable),
    primaryAssetType: categoryPrimaryAsset(entry)?.type || "",
  };
  if (installCommand) install.installCommand = installCommand;
  if (downloadUrl) install.downloadUrl = downloadUrl;
  if (usageSnippet) install.usageSnippet = usageSnippet;
  if (configSnippet) {
    if (configSnippet.length <= TOOLBOX_CONFIG_SNIPPET_INLINE_LIMIT) {
      install.configSnippet = configSnippet;
    } else {
      install.configSnippetChars = configSnippet.length;
      install.configHint =
        "Config snippet is large; call entry.asset for the full snippet.";
    }
  }
  if (!installCommand && !downloadUrl && !configSnippet && !usageSnippet) {
    install.note =
      "No install command published; use the source or canonical URL.";
  }
  return install;
}

export function toolboxCategoryMix(entries) {
  const counts = new Map();
  for (const entry of entries) {
    const category = entry.category || "unknown";
    counts.set(category, (counts.get(category) || 0) + 1);
  }
  return [...counts]
    .map(([category, count]) => ({ category, count }))
    .sort((left, right) => left.category.localeCompare(right.category));
}

export function toolboxTrustSummary(entries) {
  return {
    sourceBacked: entries.filter(
      (entry) => entry.trust?.source?.status === "available",
    ).length,
    firstPartyOrVerifiedPackages: entries.filter(
      (entry) =>
        entry.trust?.package?.downloadTrust === "first-party" ||
        entry.trust?.package?.packageVerified,
    ).length,
    entriesWithSafetyNotes: entries.filter(
      (entry) => entry.trust?.disclosures?.hasSafetyNotes,
    ).length,
    entriesWithPrivacyNotes: entries.filter(
      (entry) => entry.trust?.disclosures?.hasPrivacyNotes,
    ).length,
    externalPackages: entries.filter(
      (entry) => entry.trust?.package?.downloadTrust === "external",
    ).length,
    missingSource: entries.filter(
      (entry) => entry.trust?.source?.status !== "available",
    ).length,
  };
}
