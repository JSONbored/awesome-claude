/**
 * Pure compare decision-brief helpers.
 *
 * Produces per-entry "what to do next" guidance from compare selection
 * metadata, so users can choose quickly without reading every compare row.
 */

import type { Entry, TrustLevel } from "@/types/registry";
import { sameEntry } from "@/lib/entry-identity";
import { compareDecisionSummary } from "@/lib/compare-table-decision-rows";
import { compareActionsDiverge } from "@/lib/compare-entry-actions";

const TRUST_SCORE: Record<TrustLevel, number> = {
  trusted: 4,
  review: 3,
  limited: 2,
  blocked: 1,
};

export type CompareBriefTone = "ready" | "review" | "caution" | "blocked";

export type CompareBriefChecklistItem = {
  id: string;
  label: string;
  detail: string;
  done: boolean;
  required: boolean;
};

export type CompareEntryBrief = {
  entryRef: string;
  title: string;
  tone: CompareBriefTone;
  score: number;
  rank: number;
  scoreDeltaFromTop: number;
  headline: string;
  recommendation: string;
  reasons: string[];
  checklist: CompareBriefChecklistItem[];
  compareDeltaSummary: string;
};

export type CompareDecisionBriefState = {
  comparedCount: number;
  hasDecisionDivergence: boolean;
  hasActionDivergence: boolean;
  divergingLabels: string[];
  topEntryRef: string | null;
  summary: string;
  entryBriefs: CompareEntryBrief[];
};

function hasSafety(entry: Pick<Entry, "safetyNotes" | "safetyNotesList">): boolean {
  return Boolean(entry.safetyNotes || entry.safetyNotesList?.length);
}

function hasPrivacy(entry: Pick<Entry, "privacyNotes" | "privacyNotesList">): boolean {
  return Boolean(entry.privacyNotes || entry.privacyNotesList?.length);
}

function hasInstallPayload(
  entry: Pick<Entry, "installCommand" | "configSnippet" | "fullCopy" | "copySnippet">,
): boolean {
  return Boolean(
    entry.installCommand || entry.configSnippet || entry.fullCopy || entry.copySnippet,
  );
}

function sourceReady(entry: Pick<Entry, "source" | "sourceUrl">): boolean {
  return entry.source !== "unverified" || Boolean(entry.sourceUrl);
}

function packageReady(entry: Pick<Entry, "packageVerified" | "downloadSha256">): boolean {
  return entry.packageVerified === true || Boolean(entry.downloadSha256);
}

export function compareBriefEntryScore(entry: Entry): number {
  let score = TRUST_SCORE[entry.trust] * 10;
  if (entry.reviewed || entry.reviewedBy) score += 15;
  if (sourceReady(entry)) score += 12;
  if (hasSafety(entry)) score += 10;
  if (hasPrivacy(entry)) score += 10;
  if (packageReady(entry)) score += 8;
  if (entry.claimed) score += 4;
  if (hasInstallPayload(entry)) score += 3;
  return score;
}

function entryTone(entry: Entry, score: number): CompareBriefTone {
  if (entry.trust === "blocked") return "blocked";
  if (entry.trust === "limited") return "caution";
  if (score >= 75 && entry.trust === "trusted") return "ready";
  return "review";
}

function toneHeadline(tone: CompareBriefTone): string {
  if (tone === "ready") return "Strong candidate";
  if (tone === "review") return "Needs targeted review";
  if (tone === "caution") return "Use with caution";
  return "Blocked for install";
}

function entryReasons(entry: Entry, score: number): string[] {
  const reasons: string[] = [];
  if (entry.trust === "trusted") reasons.push("Trusted trust level");
  if (entry.trust === "blocked") reasons.push("Blocked trust level");
  if (sourceReady(entry)) reasons.push("Source provenance is present");
  if (entry.reviewed || entry.reviewedBy) reasons.push("Metadata review signal present");
  if (hasSafety(entry)) reasons.push("Safety notes available");
  if (hasPrivacy(entry)) reasons.push("Privacy notes available");
  if (packageReady(entry)) reasons.push("Package integrity metadata available");
  if (!hasInstallPayload(entry)) reasons.push("No install payload listed");
  if (reasons.length === 0) reasons.push(`Decision score ${score}`);
  return reasons.slice(0, 4);
}

function entryChecklist(entry: Entry): CompareBriefChecklistItem[] {
  return [
    {
      id: "source",
      label: "Source & provenance",
      detail: sourceReady(entry)
        ? "Source appears linked and provenance is not unverified."
        : "Source is unverified. Validate ownership manually.",
      done: sourceReady(entry),
      required: true,
    },
    {
      id: "safety",
      label: "Safety notes",
      detail: hasSafety(entry) ? "Safety notes are present." : "No safety notes listed.",
      done: hasSafety(entry),
      required: true,
    },
    {
      id: "privacy",
      label: "Privacy notes",
      detail: hasPrivacy(entry) ? "Privacy notes are present." : "No privacy notes listed.",
      done: hasPrivacy(entry),
      required: true,
    },
    {
      id: "package",
      label: "Package integrity",
      detail: packageReady(entry)
        ? "Package verification/checksum metadata exists."
        : "No package verification or checksum metadata.",
      done: packageReady(entry),
      required: false,
    },
    {
      id: "installable",
      label: "Install payload",
      detail: hasInstallPayload(entry)
        ? "Install/config payload available for review."
        : "No install payload to validate.",
      done: hasInstallPayload(entry),
      required: false,
    },
  ];
}

function compareDeltaSummary(entry: Entry, top: Entry, topScore: number): string {
  if (sameEntry(entry, top)) return "Top-ranked in this comparison.";
  const delta = compareBriefEntryScore(entry) - topScore;
  if (delta === 0) return "Score parity with top-ranked entry.";
  if (delta > 0) return `Scores ${delta} points above current top candidate.`;
  return `${Math.abs(delta)} points below top-ranked candidate.`;
}

function recommendation(
  entry: Entry,
  tone: CompareBriefTone,
  checklist: CompareBriefChecklistItem[],
): string {
  const requiredMissing = checklist.filter((item) => item.required && !item.done).length;
  if (tone === "blocked") {
    return "Do not install. Keep this as reference only until trust status changes.";
  }
  if (requiredMissing >= 2) {
    return "Complete source, safety, and privacy checks before adopting this option.";
  }
  if (tone === "caution") {
    return "Use only after validating source ownership and runtime impact in a sandbox.";
  }
  if (tone === "ready") {
    return "Best candidate for trial; still run through your normal security and compatibility checks.";
  }
  if (entry.trust === "review") {
    return "Reasonable candidate, but compare remaining trust differences before deciding.";
  }
  return "Use compare details to confirm fit for your workflow.";
}

function summaryLine(
  comparedCount: number,
  divergingLabels: string[],
  hasActionDivergence: boolean,
): string {
  if (comparedCount < 2) return "Add one more resource to see a decision brief comparison.";
  if (divergingLabels.length === 0 && !hasActionDivergence) {
    return "Compared entries are closely aligned on trust and next-step actions.";
  }
  const labels = divergingLabels.slice(0, 3).join(", ");
  if (divergingLabels.length > 0 && hasActionDivergence) {
    return `Signals diverge on ${labels}; next-step actions also differ across entries.`;
  }
  if (divergingLabels.length > 0) {
    return `Signals diverge on ${labels}; use briefs below to select your strongest option.`;
  }
  return "Trust signals are similar, but next-step actions differ by entry.";
}

export function compareDecisionBriefState(entries: Entry[]): CompareDecisionBriefState {
  const decision = compareDecisionSummary(entries);
  const hasActionDivergence = compareActionsDiverge(entries);
  const ranked = entries
    .map((entry) => ({ entry, score: compareBriefEntryScore(entry) }))
    .sort((left, right) => right.score - left.score);
  const top = ranked[0]?.entry ?? null;
  const topScore = ranked[0]?.score ?? 0;

  const entryBriefs = ranked.map((row, index) => {
    const checklist = entryChecklist(row.entry);
    const tone = entryTone(row.entry, row.score);
    return {
      entryRef: `${row.entry.category}/${row.entry.slug}`,
      title: row.entry.title,
      tone,
      score: row.score,
      rank: index + 1,
      scoreDeltaFromTop: row.score - topScore,
      headline: toneHeadline(tone),
      recommendation: recommendation(row.entry, tone, checklist),
      reasons: entryReasons(row.entry, row.score),
      checklist,
      compareDeltaSummary: top
        ? compareDeltaSummary(row.entry, top, topScore)
        : "No baseline available.",
    };
  });

  return {
    comparedCount: entries.length,
    hasDecisionDivergence: decision.divergingCount > 0,
    hasActionDivergence,
    divergingLabels: decision.divergingLabels,
    topEntryRef: top ? `${top.category}/${top.slug}` : null,
    summary: summaryLine(entries.length, decision.divergingLabels, hasActionDivergence),
    entryBriefs,
  };
}
