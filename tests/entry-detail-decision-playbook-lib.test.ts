import { describe, expect, it } from "vitest";
import type { Entry } from "@/types/registry";
import {
  entryDecisionCompareContext,
  entryDecisionTrustScore,
  entryDetailDecisionPlaybookState,
} from "@/lib/entry-detail-decision-playbook-lib";

function entry(overrides: Partial<Entry> = {}): Entry {
  return {
    category: "tools",
    slug: "fixture",
    title: "Fixture",
    description: "Fixture description",
    author: "Author",
    tags: [],
    platforms: ["claude-code"],
    installType: "manual",
    trust: "review",
    source: "unverified",
    dateAdded: "2026-01-01",
    ...overrides,
  } as Entry;
}

describe("entry detail decision playbook lib", () => {
  it("scores richer trust metadata above sparse entries", () => {
    const rich = entry({
      trust: "trusted",
      reviewed: true,
      source: "source-backed",
      safetyNotes: "Safety",
      privacyNotes: "Privacy",
      packageVerified: true,
      downloadSha256: "abc123",
      claimed: true,
    });
    const sparse = entry({ slug: "sparse", trust: "limited" });
    expect(entryDecisionTrustScore(rich)).toBeGreaterThan(
      entryDecisionTrustScore(sparse),
    );
  });

  it("builds compare context without baseline when tray has only current entry", () => {
    const current = entry();
    const context = entryDecisionCompareContext(current, [current]);
    expect(context.inCompareTray).toBe(true);
    expect(context.baselineTitle).toBeNull();
    expect(context.scoreDelta).toBeNull();
  });

  it("selects strongest peer as baseline and computes diverging labels", () => {
    const current = entry({
      trust: "review",
      reviewed: false,
      source: "unverified",
    });
    const strong = entry({
      slug: "strong",
      title: "Strong",
      trust: "trusted",
      reviewed: true,
      source: "source-backed",
      claimed: true,
      safetyNotes: "yes",
      privacyNotes: "yes",
      packageVerified: true,
    });
    const weak = entry({ slug: "weak", title: "Weak", trust: "limited" });
    const context = entryDecisionCompareContext(current, [
      current,
      weak,
      strong,
    ]);
    expect(context.baselineTitle).toBe("Strong");
    expect(context.divergingSignals.length).toBeGreaterThan(0);
  });

  it("creates escalation callout for blocked entries", () => {
    const blocked = entry({ trust: "blocked", source: "unverified" });
    const state = entryDetailDecisionPlaybookState(blocked, []);
    expect(state.showEscalationCallout).toBe(true);
    expect(state.escalationText).toContain("Blocked trust");
  });

  it("creates escalation callout when required checks are missing", () => {
    const candidate = entry({
      trust: "review",
      source: "unverified",
      safetyNotes: undefined,
      privacyNotes: undefined,
    });
    const state = entryDetailDecisionPlaybookState(candidate, []);
    expect(state.showEscalationCallout).toBe(true);
    expect(state.escalationText).toContain("Required checks");
  });

  it("clears escalation for trusted entries with required checks complete", () => {
    const trusted = entry({
      trust: "trusted",
      source: "source-backed",
      sourceUrl: "https://example.com/repo",
      safetyNotes: "Do this",
      privacyNotes: "No telemetry",
    });
    const state = entryDetailDecisionPlaybookState(trusted, []);
    expect(state.showEscalationCallout).toBe(false);
    expect(state.escalationText).toBeNull();
  });

  it("builds all checklist sections", () => {
    const state = entryDetailDecisionPlaybookState(entry(), []);
    expect(state.sections.map((section) => section.id)).toEqual([
      "source",
      "safety",
      "package",
      "compare",
    ]);
  });

  it("marks source checklist critical when source link and provenance are missing", () => {
    const state = entryDetailDecisionPlaybookState(
      entry({ source: "unverified" }),
      [],
    );
    const source = state.sections.find((section) => section.id === "source");
    expect(source?.tone).toBe("critical");
  });

  it("marks safety checklist complete when required checks pass", () => {
    const state = entryDetailDecisionPlaybookState(
      entry({
        trust: "limited",
        source: "source-backed",
        sourceUrl: "https://example.com/repo",
        safetyNotes: "ok",
        privacyNotes: "ok",
      }),
      [],
    );
    const safety = state.sections.find((section) => section.id === "safety");
    expect(safety?.tone).toBe("complete");
  });

  it("marks compare checklist complete when baseline and divergence are available", () => {
    const current = entry({
      source: "source-backed",
      sourceUrl: "https://example.com/cur",
    });
    const baseline = entry({
      slug: "peer",
      title: "Peer",
      trust: "trusted",
      reviewed: true,
      source: "source-backed",
      sourceUrl: "https://example.com/peer",
      safetyNotes: "yes",
      privacyNotes: "yes",
      packageVerified: true,
      claimed: true,
    });
    const state = entryDetailDecisionPlaybookState(current, [
      current,
      baseline,
    ]);
    const compare = state.sections.find((section) => section.id === "compare");
    expect(compare?.tone).toBe("complete");
  });

  it("produces compare summary with selected count and score", () => {
    const current = entry();
    const peer = entry({
      slug: "peer",
      title: "Peer",
      trust: "trusted",
      source: "source-backed",
    });
    const state = entryDetailDecisionPlaybookState(current, [current, peer]);
    expect(state.compare.selectedCount).toBe(2);
    expect(typeof state.compare.currentScore).toBe("number");
  });

  it("uses blocked heading for blocked trust", () => {
    const state = entryDetailDecisionPlaybookState(
      entry({ trust: "blocked" }),
      [],
    );
    expect(state.heading).toContain("Do not install");
  });

  it("uses limited heading for limited trust", () => {
    const state = entryDetailDecisionPlaybookState(
      entry({ trust: "limited" }),
      [],
    );
    expect(state.heading).toContain("Evaluate carefully");
  });

  it("uses review heading for review trust", () => {
    const state = entryDetailDecisionPlaybookState(
      entry({ trust: "review" }),
      [],
    );
    expect(state.heading).toContain("Review trust signals");
  });

  it("uses trusted heading for trusted trust", () => {
    const state = entryDetailDecisionPlaybookState(
      entry({ trust: "trusted" }),
      [],
    );
    expect(state.heading).toContain("Ready to evaluate");
  });
});
