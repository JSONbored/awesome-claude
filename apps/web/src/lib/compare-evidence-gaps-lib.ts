/**
 * Pure compare evidence-gap helpers.
 *
 * Highlights missing trust evidence across compared entries so users can spot
 * what to verify before choosing a candidate.
 */

import type { Entry } from "@/types/registry";

export type CompareEvidenceGapId =
  | "source"
  | "reviewed"
  | "safety"
  | "privacy"
  | "package"
  | "install";

export type CompareEvidenceGapRow = {
  id: CompareEvidenceGapId;
  label: string;
  missingCount: number;
  presentCount: number;
  coveragePercent: number;
  severity: "low" | "medium" | "high";
  missingRefs: string[];
  hint: string;
};

export type CompareEntryEvidenceCell = {
  entryRef: string;
  title: string;
  signals: Record<CompareEvidenceGapId, boolean>;
  missingLabels: string[];
};

export type CompareEvidenceGapsState = {
  comparedCount: number;
  headline: string;
  summary: string;
  rows: CompareEvidenceGapRow[];
  entries: CompareEntryEvidenceCell[];
  highSeverityCount: number;
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

function hasSource(entry: Pick<Entry, "source" | "sourceUrl">): boolean {
  return entry.source !== "unverified" || Boolean(entry.sourceUrl);
}

function hasReviewed(entry: Pick<Entry, "reviewed" | "reviewedBy">): boolean {
  return Boolean(entry.reviewed || entry.reviewedBy);
}

function hasPackage(entry: Pick<Entry, "packageVerified" | "downloadSha256">): boolean {
  return entry.packageVerified === true || Boolean(entry.downloadSha256);
}

const GAP_LABELS: Record<CompareEvidenceGapId, string> = {
  source: "Source provenance",
  reviewed: "Metadata review",
  safety: "Safety notes",
  privacy: "Privacy notes",
  package: "Package integrity",
  install: "Install payload",
};

function gapHint(id: CompareEvidenceGapId, missingCount: number): string {
  if (missingCount === 0) return "No gap detected in current selection.";
  if (id === "source") return "Verify ownership/source before adopting missing entries.";
  if (id === "reviewed") return "Prioritize reviewed entries for production rollout.";
  if (id === "safety") return "Missing safety notes require manual code and behavior review.";
  if (id === "privacy") return "Missing privacy notes require data-flow validation.";
  if (id === "package") return "Missing package metadata increases integrity risk.";
  return "Missing install payload may slow adoption and verification.";
}

function severityForCoverage(coveragePercent: number): "low" | "medium" | "high" {
  if (coveragePercent >= 80) return "low";
  if (coveragePercent >= 50) return "medium";
  return "high";
}

function signalMap(entry: Entry): Record<CompareEvidenceGapId, boolean> {
  return {
    source: hasSource(entry),
    reviewed: hasReviewed(entry),
    safety: hasSafety(entry),
    privacy: hasPrivacy(entry),
    package: hasPackage(entry),
    install: hasInstallPayload(entry),
  };
}

function entryRef(entry: Entry): string {
  return `${entry.category}/${entry.slug}`;
}

function summarize(
  rows: CompareEvidenceGapRow[],
  comparedCount: number,
): {
  headline: string;
  summary: string;
  highSeverityCount: number;
} {
  if (comparedCount < 2) {
    return {
      headline: "Add more entries to compare evidence gaps",
      summary: "Select at least two entries to inspect trust-evidence coverage differences.",
      highSeverityCount: 0,
    };
  }
  const highSeverity = rows.filter((row) => row.severity === "high");
  if (highSeverity.length === 0) {
    return {
      headline: "Evidence coverage is strong across compared entries",
      summary: "Most trust signals are present for each candidate in this selection.",
      highSeverityCount: 0,
    };
  }
  const labels = highSeverity.slice(0, 3).map((row) => row.label.toLowerCase());
  return {
    headline: `${highSeverity.length} high-severity evidence gap${highSeverity.length === 1 ? "" : "s"}`,
    summary: `Largest gaps: ${labels.join(", ")}.`,
    highSeverityCount: highSeverity.length,
  };
}

export function compareEvidenceGapsState(entries: Entry[]): CompareEvidenceGapsState {
  const entryCells: CompareEntryEvidenceCell[] = entries.map((entry) => {
    const signals = signalMap(entry);
    const missingLabels = (Object.keys(signals) as CompareEvidenceGapId[])
      .filter((id) => !signals[id])
      .map((id) => GAP_LABELS[id]);
    return {
      entryRef: entryRef(entry),
      title: entry.title,
      signals,
      missingLabels,
    };
  });

  const rows: CompareEvidenceGapRow[] = (Object.keys(GAP_LABELS) as CompareEvidenceGapId[]).map(
    (id) => {
      const missingRefs = entryCells
        .filter((cell) => !cell.signals[id])
        .map((cell) => cell.entryRef);
      const missingCount = missingRefs.length;
      const presentCount = entries.length - missingCount;
      const coveragePercent =
        entries.length === 0 ? 100 : Math.round((presentCount / entries.length) * 100);
      return {
        id,
        label: GAP_LABELS[id],
        missingCount,
        presentCount,
        coveragePercent,
        severity: severityForCoverage(coveragePercent),
        missingRefs,
        hint: gapHint(id, missingCount),
      };
    },
  );

  const summary = summarize(rows, entries.length);
  return {
    comparedCount: entries.length,
    headline: summary.headline,
    summary: summary.summary,
    rows,
    entries: entryCells,
    highSeverityCount: summary.highSeverityCount,
  };
}
