import type { Entry } from "@/types/registry";

export type DeploymentRiskPresetId = "balanced" | "security" | "speed";
export type DeploymentRiskBand = "low" | "medium" | "high";

export type DeploymentRiskRow = {
  id: string;
  label: string;
  weight: number;
};

export type DeploymentRiskEntry = {
  entryRef: string;
  title: string;
  riskScore: number;
  riskBand: DeploymentRiskBand;
  confidenceScore: number;
  topRiskReasons: string[];
  mitigationSummary: string;
};

export type CompareDeploymentRiskMapState = {
  preset: DeploymentRiskPresetId;
  heading: string;
  summary: string;
  rows: DeploymentRiskRow[];
  entries: DeploymentRiskEntry[];
  lowRiskCount: number;
  highRiskCount: number;
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

function entryRef(entry: Entry): string {
  return `${entry.category}/${entry.slug}`;
}

function riskBand(score: number): DeploymentRiskBand {
  if (score >= 60) return "high";
  if (score >= 30) return "medium";
  return "low";
}

function headingForPreset(preset: DeploymentRiskPresetId): string {
  if (preset === "security") return "Deployment risk map · security-first";
  if (preset === "speed") return "Deployment risk map · speed-first";
  return "Deployment risk map · balanced";
}

function rowWeights(preset: DeploymentRiskPresetId): DeploymentRiskRow[] {
  if (preset === "security") {
    return [
      { id: "source", label: "Source provenance", weight: 22 },
      { id: "reviewed", label: "Review signal", weight: 16 },
      { id: "safety", label: "Safety notes", weight: 18 },
      { id: "privacy", label: "Privacy notes", weight: 16 },
      { id: "package", label: "Package integrity", weight: 16 },
      { id: "install", label: "Install payload", weight: 12 },
    ];
  }
  if (preset === "speed") {
    return [
      { id: "source", label: "Source provenance", weight: 18 },
      { id: "reviewed", label: "Review signal", weight: 10 },
      { id: "safety", label: "Safety notes", weight: 14 },
      { id: "privacy", label: "Privacy notes", weight: 10 },
      { id: "package", label: "Package integrity", weight: 8 },
      { id: "install", label: "Install payload", weight: 40 },
    ];
  }
  return [
    { id: "source", label: "Source provenance", weight: 20 },
    { id: "reviewed", label: "Review signal", weight: 14 },
    { id: "safety", label: "Safety notes", weight: 18 },
    { id: "privacy", label: "Privacy notes", weight: 12 },
    { id: "package", label: "Package integrity", weight: 12 },
    { id: "install", label: "Install payload", weight: 24 },
  ];
}

function riskScoreFor(
  entry: Entry,
  rows: DeploymentRiskRow[],
): {
  score: number;
  reasons: string[];
  confidence: number;
} {
  let score = 0;
  let covered = 0;
  const reasons: string[] = [];

  for (const row of rows) {
    let present = false;
    if (row.id === "source") present = hasSource(entry);
    if (row.id === "reviewed") present = hasReviewed(entry);
    if (row.id === "safety") present = hasSafety(entry);
    if (row.id === "privacy") present = hasPrivacy(entry);
    if (row.id === "package") present = hasPackage(entry);
    if (row.id === "install") present = hasInstall(entry);

    if (!present) {
      score += row.weight;
      reasons.push(`${row.label} missing`);
    } else {
      covered += row.weight;
    }
  }

  if (entry.trust === "blocked") {
    score += 25;
    reasons.push("Trust flagged blocked");
  } else if (entry.trust === "limited") {
    score += 14;
    reasons.push("Trust flagged limited");
  } else if (entry.trust === "review") {
    score += 6;
    reasons.push("Trust still review-first");
  }

  const normalized = Math.min(100, score);
  const confidence = Math.max(0, Math.min(100, covered));
  return { score: normalized, reasons, confidence };
}

function mitigationSummary(entry: DeploymentRiskEntry): string {
  if (entry.riskBand === "low") return "Suitable for staged rollout with routine checks.";
  if (entry.riskBand === "medium")
    return "Run additional source and safety review before broader rollout.";
  return "Hold deployment until required trust and integrity gaps are resolved.";
}

function summary(entries: DeploymentRiskEntry[]): string {
  if (entries.length === 0) return "Add entries to generate a deployment risk map.";
  const high = entries.filter((entry) => entry.riskBand === "high").length;
  const low = entries.filter((entry) => entry.riskBand === "low").length;
  if (high === 0) return `No high-risk entries detected; ${low}/${entries.length} are low risk.`;
  return `${high}/${entries.length} entries are high risk and need mitigation before rollout.`;
}

export function compareDeploymentRiskMapState(
  entries: Entry[],
  preset: DeploymentRiskPresetId,
): CompareDeploymentRiskMapState {
  const rows = rowWeights(preset);
  const mapped: DeploymentRiskEntry[] = entries
    .map((entry) => {
      const risk = riskScoreFor(entry, rows);
      const band = riskBand(risk.score);
      return {
        entryRef: entryRef(entry),
        title: entry.title,
        riskScore: risk.score,
        riskBand: band,
        confidenceScore: risk.confidence,
        topRiskReasons: risk.reasons.slice(0, 3),
        mitigationSummary: mitigationSummary({
          entryRef: entryRef(entry),
          title: entry.title,
          riskScore: risk.score,
          riskBand: band,
          confidenceScore: risk.confidence,
          topRiskReasons: risk.reasons.slice(0, 3),
          mitigationSummary: "",
        }),
      };
    })
    .sort((a, b) => b.riskScore - a.riskScore || a.title.localeCompare(b.title));

  return {
    preset,
    heading: headingForPreset(preset),
    summary: summary(mapped),
    rows,
    entries: mapped,
    lowRiskCount: mapped.filter((entry) => entry.riskBand === "low").length,
    highRiskCount: mapped.filter((entry) => entry.riskBand === "high").length,
  };
}
