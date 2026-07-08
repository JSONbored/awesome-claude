import type { Entry } from "@/types/registry";

export type OperationalFitPresetId = "team-default" | "security-hardening" | "rapid-adoption";
export type OperationalFitTone = "strong" | "mixed" | "weak";

/** Tailwind border/background/text classes for an operational-fit tone chip. */
export function operationalFitToneClass(tone: OperationalFitTone): string {
  if (tone === "strong") return "border-trust-trusted/35 bg-trust-trusted/5 text-trust-trusted";
  if (tone === "mixed") return "border-amber-500/35 bg-amber-500/5 text-amber-900";
  return "border-trust-blocked/35 bg-trust-blocked/5 text-trust-blocked";
}

export type OperationalFitAxis = {
  id: string;
  label: string;
  weight: number;
  description: string;
};

export type OperationalFitEntryCell = {
  axisId: string;
  score: number;
  tone: OperationalFitTone;
  reason: string;
};

export type OperationalFitEntry = {
  entryRef: string;
  title: string;
  totalScore: number;
  fitTone: OperationalFitTone;
  confidence: number;
  cells: OperationalFitEntryCell[];
  recommendation: string;
};

export type CompareOperationalFitHeatmapState = {
  preset: OperationalFitPresetId;
  heading: string;
  summary: string;
  axes: OperationalFitAxis[];
  entries: OperationalFitEntry[];
  bestEntryRef: string | null;
  weakEntryRefs: string[];
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

function toneFromScore(score: number): OperationalFitTone {
  if (score >= 75) return "strong";
  if (score >= 45) return "mixed";
  return "weak";
}

function headingForPreset(preset: OperationalFitPresetId): string {
  if (preset === "security-hardening") return "Operational fit heatmap · security hardening";
  if (preset === "rapid-adoption") return "Operational fit heatmap · rapid adoption";
  return "Operational fit heatmap · team default";
}

function axesForPreset(preset: OperationalFitPresetId): OperationalFitAxis[] {
  if (preset === "security-hardening") {
    return [
      {
        id: "provenance",
        label: "Provenance",
        weight: 20,
        description: "Source + review confidence.",
      },
      {
        id: "safety",
        label: "Safety posture",
        weight: 20,
        description: "Safety and privacy disclosures.",
      },
      {
        id: "integrity",
        label: "Integrity",
        weight: 20,
        description: "Package verification metadata.",
      },
      {
        id: "operability",
        label: "Operability",
        weight: 12,
        description: "Install and config readiness.",
      },
      {
        id: "trust",
        label: "Trust tier",
        weight: 28,
        description: "Registry trust posture impact.",
      },
    ];
  }
  if (preset === "rapid-adoption") {
    return [
      {
        id: "provenance",
        label: "Provenance",
        weight: 16,
        description: "Source + review confidence.",
      },
      {
        id: "safety",
        label: "Safety posture",
        weight: 14,
        description: "Safety and privacy disclosures.",
      },
      {
        id: "integrity",
        label: "Integrity",
        weight: 10,
        description: "Package verification metadata.",
      },
      {
        id: "operability",
        label: "Operability",
        weight: 40,
        description: "Install and config readiness.",
      },
      {
        id: "trust",
        label: "Trust tier",
        weight: 20,
        description: "Registry trust posture impact.",
      },
    ];
  }
  return [
    {
      id: "provenance",
      label: "Provenance",
      weight: 20,
      description: "Source + review confidence.",
    },
    {
      id: "safety",
      label: "Safety posture",
      weight: 18,
      description: "Safety and privacy disclosures.",
    },
    {
      id: "integrity",
      label: "Integrity",
      weight: 12,
      description: "Package verification metadata.",
    },
    {
      id: "operability",
      label: "Operability",
      weight: 28,
      description: "Install and config readiness.",
    },
    { id: "trust", label: "Trust tier", weight: 22, description: "Registry trust posture impact." },
  ];
}

function trustScore(entry: Entry): number {
  if (entry.trust === "trusted") return 100;
  if (entry.trust === "review") return 60;
  if (entry.trust === "limited") return 32;
  return 0;
}

function axisScore(entry: Entry, axisId: string): { score: number; reason: string } {
  if (axisId === "provenance") {
    const source = hasSource(entry);
    const reviewed = hasReviewed(entry);
    if (source && reviewed) return { score: 100, reason: "Source and review signals present." };
    if (source) return { score: 65, reason: "Source present but review signal missing." };
    if (reviewed) return { score: 35, reason: "Review present without source provenance." };
    return { score: 0, reason: "Source and review signals missing." };
  }
  if (axisId === "safety") {
    const safety = hasSafety(entry);
    const privacy = hasPrivacy(entry);
    if (safety && privacy) return { score: 100, reason: "Safety and privacy notes present." };
    if (safety || privacy)
      return { score: 55, reason: "Only one of safety/privacy notes present." };
    return { score: 0, reason: "Safety and privacy notes missing." };
  }
  if (axisId === "integrity") {
    if (hasPackage(entry)) return { score: 100, reason: "Package integrity metadata present." };
    return { score: 0, reason: "Package integrity metadata missing." };
  }
  if (axisId === "operability") {
    if (hasInstall(entry)) return { score: 100, reason: "Install/config payload present." };
    return { score: 0, reason: "Install/config payload missing." };
  }
  const score = trustScore(entry);
  return {
    score,
    reason:
      score >= 90
        ? "Trusted posture."
        : score >= 50
          ? "Review-first posture."
          : score >= 20
            ? "Limited posture."
            : "Blocked posture.",
  };
}

function recommendation(entry: OperationalFitEntry): string {
  if (entry.fitTone === "strong") return "Good candidate for staged rollout.";
  if (entry.fitTone === "mixed") return "Adopt with targeted mitigations first.";
  return "Keep in hold state until key gaps are resolved.";
}

function summary(entries: OperationalFitEntry[]): string {
  if (entries.length === 0) return "Add entries to generate an operational fit map.";
  const strong = entries.filter((entry) => entry.fitTone === "strong").length;
  const weak = entries.filter((entry) => entry.fitTone === "weak").length;
  if (weak === 0) return `${strong}/${entries.length} entries show strong operational fit.`;
  return `${weak} entries have weak operational fit; prioritize mitigation before deployment.`;
}

export function compareOperationalFitHeatmapState(
  entries: Entry[],
  preset: OperationalFitPresetId,
): CompareOperationalFitHeatmapState {
  const axes = axesForPreset(preset);
  const mapped: OperationalFitEntry[] = entries
    .map((entry) => {
      const cells: OperationalFitEntryCell[] = axes.map((axis) => {
        const result = axisScore(entry, axis.id);
        return {
          axisId: axis.id,
          score: result.score,
          tone: toneFromScore(result.score),
          reason: result.reason,
        };
      });

      const weightedTotal = cells.reduce((sum, cell) => {
        const axis = axes.find((row) => row.id === cell.axisId)!;
        return sum + (cell.score / 100) * axis.weight;
      }, 0);
      const totalScore = Math.round(weightedTotal);
      const confidence = Math.round(
        cells.reduce((sum, cell) => sum + cell.score, 0) / cells.length,
      );
      const fitTone = toneFromScore(totalScore);
      return {
        entryRef: entryRef(entry),
        title: entry.title,
        totalScore,
        fitTone,
        confidence,
        cells,
        recommendation: recommendation({
          entryRef: entryRef(entry),
          title: entry.title,
          totalScore,
          fitTone,
          confidence,
          cells,
          recommendation: "",
        }),
      };
    })
    .sort((a, b) => b.totalScore - a.totalScore || a.title.localeCompare(b.title));

  return {
    preset,
    heading: headingForPreset(preset),
    summary: summary(mapped),
    axes,
    entries: mapped,
    bestEntryRef: mapped[0]?.entryRef ?? null,
    weakEntryRefs: mapped
      .filter((entry) => entry.fitTone === "weak")
      .map((entry) => entry.entryRef),
  };
}
