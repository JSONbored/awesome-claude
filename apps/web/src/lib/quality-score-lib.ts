// Pure quality-scoring for a registry entry, split out of the quality route so
// the scoring rules can be unit-tested without the route or the full dataset.

import type { Entry } from "@/types/registry";

export interface QualityRow {
  entry: Entry;
  score: number;
  recommendations: string[];
}

/**
 * Score an entry out of 100, deducting for missing provenance/safety/privacy/
 * review/install/tag signals (some only for the risk-bearing categories), and
 * collect the matching recommendations. The score is clamped to a 0 floor.
 */
export function scoreEntry(e: Entry): QualityRow {
  const recs: string[] = [];
  let score = 100;
  if (e.source === "unverified") {
    score -= 30;
    recs.push("Add a verifiable source URL.");
  }
  if (
    !e.safetyNotes &&
    (e.category === "mcp" ||
      e.category === "hooks" ||
      e.category === "skills" ||
      e.category === "commands")
  ) {
    score -= 20;
    recs.push("Add safety notes for this risk-bearing category.");
  }
  if (!e.privacyNotes && (e.category === "mcp" || e.category === "skills")) {
    score -= 10;
    recs.push("Add privacy notes covering data flow.");
  }
  if (!e.reviewed) {
    score -= 10;
    recs.push("Awaiting maintainer review.");
  }
  if (
    !e.installCommand &&
    (e.category === "mcp" || e.category === "skills" || e.category === "commands")
  ) {
    score -= 10;
    recs.push("Add an install command.");
  }
  if (!e.tags || e.tags.length < 2) {
    score -= 5;
    recs.push("Add more tags for discoverability.");
  }
  return { entry: e, score: Math.max(0, score), recommendations: recs };
}
