import type { Entry } from "@/types/registry";

export type BrowseRolloutSignalId =
  | "source"
  | "reviewed"
  | "safety"
  | "privacy"
  | "package"
  | "install";

export type BrowseRolloutSignalTone = "good" | "watch" | "risk";

export type BrowseRolloutSignalRow = {
  id: BrowseRolloutSignalId;
  label: string;
  presentCount: number;
  missingCount: number;
  coveragePercent: number;
  tone: BrowseRolloutSignalTone;
  message: string;
};

export type BrowseRolloutEntryFlag = {
  entryRef: string;
  title: string;
  missingRequired: string[];
  signalCoveragePercent: number;
};

export type BrowseRolloutSignalsState = {
  showPanel: boolean;
  heading: string;
  summary: string;
  scannedCount: number;
  strongCount: number;
  riskCount: number;
  rows: BrowseRolloutSignalRow[];
  flaggedEntries: BrowseRolloutEntryFlag[];
};

function hasSource(entry: Entry): boolean {
  return entry.source !== "unverified" || Boolean(entry.sourceUrl);
}

function hasReviewed(entry: Entry): boolean {
  return Boolean(entry.reviewed || entry.reviewedBy);
}

function hasSafety(entry: Entry): boolean {
  return Boolean(entry.safetyNotes || entry.safetyNotesList?.length);
}

function hasPrivacy(entry: Entry): boolean {
  return Boolean(entry.privacyNotes || entry.privacyNotesList?.length);
}

function hasPackage(entry: Entry): boolean {
  return entry.packageVerified === true || Boolean(entry.downloadSha256);
}

function hasInstall(entry: Entry): boolean {
  return Boolean(
    entry.installCommand || entry.configSnippet || entry.copySnippet || entry.fullCopy,
  );
}

function signalMap(entry: Entry): Record<BrowseRolloutSignalId, boolean> {
  return {
    source: hasSource(entry),
    reviewed: hasReviewed(entry),
    safety: hasSafety(entry),
    privacy: hasPrivacy(entry),
    package: hasPackage(entry),
    install: hasInstall(entry),
  };
}

function signalLabel(id: BrowseRolloutSignalId): string {
  if (id === "source") return "Source provenance";
  if (id === "reviewed") return "Metadata review";
  if (id === "safety") return "Safety notes";
  if (id === "privacy") return "Privacy notes";
  if (id === "package") return "Package integrity";
  return "Install payload";
}

function toneFromCoverage(coverage: number): BrowseRolloutSignalTone {
  if (coverage >= 75) return "good";
  if (coverage >= 45) return "watch";
  return "risk";
}

function rowMessage(id: BrowseRolloutSignalId, tone: BrowseRolloutSignalTone): string {
  if (tone === "good") return `${signalLabel(id)} is broadly covered in current results.`;
  if (tone === "watch") return `${signalLabel(id)} is mixed and needs spot-checking.`;
  return `${signalLabel(id)} is sparse; verify before rollout decisions.`;
}

function entryRef(entry: Entry): string {
  return `${entry.category}/${entry.slug}`;
}

function requiredMissingLabels(signals: Record<BrowseRolloutSignalId, boolean>): string[] {
  const required: BrowseRolloutSignalId[] = ["source", "safety", "install"];
  return required.filter((id) => !signals[id]).map((id) => signalLabel(id));
}

function summarize(
  rows: BrowseRolloutSignalRow[],
  entryFlags: BrowseRolloutEntryFlag[],
): {
  heading: string;
  summary: string;
  strongCount: number;
  riskCount: number;
} {
  const riskRows = rows.filter((row) => row.tone === "risk");
  const goodRows = rows.filter((row) => row.tone === "good");
  const strongEntries = entryFlags.filter((flag) => flag.missingRequired.length === 0).length;
  const riskEntries = entryFlags.filter((flag) => flag.missingRequired.length >= 2).length;

  if (entryFlags.length === 0) {
    return {
      heading: "Add filters to inspect rollout signals",
      summary: "Rollout guidance appears once browse results are available.",
      strongCount: 0,
      riskCount: 0,
    };
  }
  if (riskRows.length === 0) {
    return {
      heading: "Rollout signals look strong across current browse results",
      summary: `${goodRows.length} strong signal groups and ${strongEntries} entries with no required gaps.`,
      strongCount: strongEntries,
      riskCount: riskEntries,
    };
  }
  const topRisk = riskRows
    .slice(0, 2)
    .map((row) => row.label.toLowerCase())
    .join(", ");
  return {
    heading: `${riskRows.length} rollout risk signal${riskRows.length === 1 ? "" : "s"} in current results`,
    summary: `Biggest gaps: ${topRisk}. ${riskEntries} entries have 2+ required gaps.`,
    strongCount: strongEntries,
    riskCount: riskEntries,
  };
}

export function browseRolloutSignalsState(
  entries: Entry[],
  scannedCount = 12,
): BrowseRolloutSignalsState {
  const scoped = entries.slice(0, scannedCount);
  const entryFlags: BrowseRolloutEntryFlag[] = scoped
    .map((entry) => {
      const signals = signalMap(entry);
      const present = Object.values(signals).filter(Boolean).length;
      const signalCoveragePercent = Math.round((present / 6) * 100);
      return {
        entryRef: entryRef(entry),
        title: entry.title,
        missingRequired: requiredMissingLabels(signals),
        signalCoveragePercent,
      };
    })
    .sort(
      (a, b) =>
        b.missingRequired.length - a.missingRequired.length ||
        a.signalCoveragePercent - b.signalCoveragePercent,
    );

  const rows: BrowseRolloutSignalRow[] = (
    ["source", "reviewed", "safety", "privacy", "package", "install"] as BrowseRolloutSignalId[]
  ).map((id) => {
    const presentCount = scoped.filter((entry) => signalMap(entry)[id]).length;
    const missingCount = scoped.length - presentCount;
    const coveragePercent =
      scoped.length === 0 ? 100 : Math.round((presentCount / scoped.length) * 100);
    const tone = toneFromCoverage(coveragePercent);
    return {
      id,
      label: signalLabel(id),
      presentCount,
      missingCount,
      coveragePercent,
      tone,
      message: rowMessage(id, tone),
    };
  });

  const summary = summarize(rows, entryFlags);
  return {
    showPanel: scoped.length >= 2,
    heading: summary.heading,
    summary: summary.summary,
    scannedCount: scoped.length,
    strongCount: summary.strongCount,
    riskCount: summary.riskCount,
    rows,
    flaggedEntries: entryFlags.slice(0, 5),
  };
}
