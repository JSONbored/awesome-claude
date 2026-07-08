import type { Entry } from "@/types/registry";
import { sameEntry } from "@/lib/entry-identity";

export type DecisionTimelinePresetId = "fast-track" | "balanced" | "security-first";

export type DecisionTimelineStepTone = "complete" | "warning" | "critical";

export type DecisionTimelineStep = {
  id: string;
  phase: "triage" | "verify" | "rollout";
  title: string;
  detail: string;
  required: boolean;
  done: boolean;
  tone: DecisionTimelineStepTone;
};

export type DecisionTimelineBenchmark = {
  entryRef: string;
  title: string;
  trust: Entry["trust"];
  score: number;
  delta: number;
};

export type EntryDecisionTimelineState = {
  preset: DecisionTimelinePresetId;
  heading: string;
  summary: string;
  riskScore: number;
  steps: DecisionTimelineStep[];
  blockers: string[];
  benchmarkSummary: string | null;
  benchmarks: DecisionTimelineBenchmark[];
};

const STEP_DEFS: Array<{
  id: string;
  phase: "triage" | "verify" | "rollout";
  title: string;
  signal: "source" | "reviewed" | "safety" | "privacy" | "package" | "install";
}> = [
  { id: "source", phase: "triage", title: "Confirm source provenance", signal: "source" },
  { id: "reviewed", phase: "triage", title: "Check metadata review status", signal: "reviewed" },
  { id: "safety", phase: "verify", title: "Review safety notes", signal: "safety" },
  { id: "privacy", phase: "verify", title: "Review privacy notes", signal: "privacy" },
  {
    id: "package",
    phase: "verify",
    title: "Validate package integrity metadata",
    signal: "package",
  },
  {
    id: "install",
    phase: "rollout",
    title: "Verify install payload and commands",
    signal: "install",
  },
];

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

function signalPresent(
  entry: Entry,
  signal: "source" | "reviewed" | "safety" | "privacy" | "package" | "install",
): boolean {
  if (signal === "source") return hasSource(entry);
  if (signal === "reviewed") return hasReviewed(entry);
  if (signal === "safety") return hasSafety(entry);
  if (signal === "privacy") return hasPrivacy(entry);
  if (signal === "package") return hasPackage(entry);
  return hasInstall(entry);
}

function requiredMap(
  preset: DecisionTimelinePresetId,
): Record<"source" | "reviewed" | "safety" | "privacy" | "package" | "install", boolean> {
  if (preset === "fast-track") {
    return {
      source: true,
      reviewed: false,
      safety: true,
      privacy: false,
      package: false,
      install: true,
    };
  }
  if (preset === "security-first") {
    return {
      source: true,
      reviewed: true,
      safety: true,
      privacy: true,
      package: true,
      install: true,
    };
  }
  return {
    source: true,
    reviewed: true,
    safety: true,
    privacy: false,
    package: false,
    install: true,
  };
}

function detail(signal: DecisionTimelineStep["id"], done: boolean): string {
  if (done) {
    if (signal === "source") return "Source/provenance metadata is available.";
    if (signal === "reviewed") return "Review metadata is available.";
    if (signal === "safety") return "Safety notes are available.";
    if (signal === "privacy") return "Privacy notes are available.";
    if (signal === "package") return "Package integrity metadata is available.";
    return "Install payload is available.";
  }
  if (signal === "source") return "Source/provenance metadata is missing.";
  if (signal === "reviewed") return "Review metadata is missing.";
  if (signal === "safety") return "Safety notes are missing.";
  if (signal === "privacy") return "Privacy notes are missing.";
  if (signal === "package") return "Package integrity metadata is missing.";
  return "Install payload is missing.";
}

function stepTone(required: boolean, done: boolean): DecisionTimelineStepTone {
  if (done) return "complete";
  return required ? "critical" : "warning";
}

function trustPenalty(trust: Entry["trust"]): number {
  if (trust === "blocked") return 42;
  if (trust === "limited") return 24;
  if (trust === "review") return 10;
  return 0;
}

function scoreEntry(entry: Entry): number {
  let score = 0;
  if (hasSource(entry)) score += 24;
  if (hasReviewed(entry)) score += 16;
  if (hasSafety(entry)) score += 20;
  if (hasPrivacy(entry)) score += 12;
  if (hasPackage(entry)) score += 10;
  if (hasInstall(entry)) score += 18;
  return score;
}

function headingForPreset(preset: DecisionTimelinePresetId): string {
  if (preset === "fast-track") return "Decision timeline · fast track";
  if (preset === "security-first") return "Decision timeline · security first";
  return "Decision timeline · balanced";
}

function summarize(input: {
  preset: DecisionTimelinePresetId;
  riskScore: number;
  blockers: string[];
  completeCount: number;
}): string {
  if (input.blockers.length === 0) {
    return `${input.completeCount}/6 steps complete with no blocking gaps for this preset.`;
  }
  if (input.preset === "security-first") {
    return `Security-first blockers: ${input.blockers.slice(0, 2).join(", ")}.`;
  }
  return `Blocking gaps: ${input.blockers.slice(0, 2).join(", ")}. Risk ${input.riskScore}.`;
}

function benchmarkSummary(benchmarks: DecisionTimelineBenchmark[]): string | null {
  if (benchmarks.length === 0) return null;
  const stronger = benchmarks.filter((item) => item.delta > 0).length;
  const weaker = benchmarks.filter((item) => item.delta < 0).length;
  if (stronger === 0 && weaker === 0)
    return "Compared entries are tied on timeline evidence score.";
  if (stronger > weaker)
    return `${stronger} compared entries currently score higher on timeline evidence.`;
  if (weaker > stronger)
    return `${weaker} compared entries currently score lower on timeline evidence.`;
  return "Compared entries show mixed timeline evidence scores.";
}

export function entryDecisionTimelineState(
  entry: Entry,
  preset: DecisionTimelinePresetId,
  compareItems: Entry[],
): EntryDecisionTimelineState {
  const required = requiredMap(preset);
  const steps: DecisionTimelineStep[] = STEP_DEFS.map((def) => {
    const done = signalPresent(entry, def.signal);
    const needed = required[def.signal];
    return {
      id: def.id,
      phase: def.phase,
      title: def.title,
      required: needed,
      done,
      tone: stepTone(needed, done),
      detail: detail(def.id, done),
    };
  });

  const blockers = steps.filter((step) => step.required && !step.done).map((step) => step.title);
  const completeCount = steps.filter((step) => step.done).length;
  const riskScore = Math.min(
    100,
    trustPenalty(entry.trust) +
      blockers.length * 14 +
      steps.filter((step) => !step.required && !step.done).length * 4,
  );

  const targetScore = scoreEntry(entry);
  const benchmarks: DecisionTimelineBenchmark[] = compareItems
    .filter((candidate) => !sameEntry(candidate, entry))
    .map((candidate) => {
      const score = scoreEntry(candidate);
      return {
        entryRef: `${candidate.category}/${candidate.slug}`,
        title: candidate.title,
        trust: candidate.trust,
        score,
        delta: score - targetScore,
      };
    })
    .sort((a, b) => b.score - a.score || a.title.localeCompare(b.title))
    .slice(0, 4);

  return {
    preset,
    heading: headingForPreset(preset),
    summary: summarize({ preset, riskScore, blockers, completeCount }),
    riskScore,
    steps,
    blockers,
    benchmarkSummary: benchmarkSummary(benchmarks),
    benchmarks,
  };
}
