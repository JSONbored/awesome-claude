import { describe, expect, it } from "vitest";
import type { Entry } from "@/types/registry";
import {
  ENTRY_ADOPTION_PLAN_PRESETS,
  entryAdoptionPlanState,
  entryAdoptionRiskScore,
} from "@/lib/entry-adoption-plan-lib";

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

describe("entry adoption plan lib", () => {
  it("exposes expected preset ids", () => {
    expect(ENTRY_ADOPTION_PLAN_PRESETS.map((preset) => preset.id)).toEqual([
      "pilot-fast",
      "balanced-rollout",
      "strict-security",
      "reference-only",
    ]);
  });

  it("computes lower risk scores for strong trust metadata", () => {
    const strong = entry({
      trust: "trusted",
      source: "source-backed",
      sourceUrl: "https://github.com/acme/strong",
      safetyNotes: "yes",
      privacyNotes: "yes",
      reviewed: true,
      packageVerified: true,
      downloadSha256: "abc",
      installCommand: "npm i strong",
    });
    const weak = entry({
      slug: "weak",
      trust: "blocked",
      source: "unverified",
    });
    expect(entryAdoptionRiskScore(strong)).toBeLessThan(
      entryAdoptionRiskScore(weak),
    );
  });

  it("builds baseline plan state with stages", () => {
    const state = entryAdoptionPlanState(entry(), "balanced-rollout", []);
    expect(state.stages.map((stage) => stage.id)).toEqual([
      "prereq",
      "security",
      "rollout",
    ]);
  });

  it("uses strict-security heading and summary", () => {
    const state = entryAdoptionPlanState(entry(), "strict-security", []);
    expect(state.heading).toContain("Strict security");
    expect(state.summary).toContain("Require all critical checks");
  });

  it("uses pilot-fast heading and summary", () => {
    const state = entryAdoptionPlanState(entry(), "pilot-fast", []);
    expect(state.heading).toContain("Fast pilot");
    expect(state.summary).toContain("Move quickly");
  });

  it("uses reference-only heading and summary", () => {
    const state = entryAdoptionPlanState(entry(), "reference-only", []);
    expect(state.heading).toContain("Reference-only");
    expect(state.summary).toContain("reference baseline");
  });

  it("adds blockers for blocked trust and missing notes", () => {
    const state = entryAdoptionPlanState(
      entry({
        trust: "blocked",
        source: "unverified",
        sourceUrl: undefined,
        safetyNotes: undefined,
        privacyNotes: undefined,
      }),
      "strict-security",
      [],
    );
    expect(state.blockers.length).toBeGreaterThanOrEqual(3);
    expect(state.blockers.some((blocker) => blocker.includes("blocked"))).toBe(
      true,
    );
  });

  it("produces no blockers when critical signals are present", () => {
    const state = entryAdoptionPlanState(
      entry({
        trust: "trusted",
        source: "source-backed",
        sourceUrl: "https://github.com/acme/entry",
        safetyNotes: "yes",
        privacyNotes: "yes",
      }),
      "balanced-rollout",
      [],
    );
    expect(state.blockers).toEqual([]);
  });

  it("marks strict-security review and package steps as required", () => {
    const state = entryAdoptionPlanState(entry(), "strict-security", []);
    const prereq = state.stages.find((stage) => stage.id === "prereq");
    const security = state.stages.find((stage) => stage.id === "security");
    expect(prereq?.steps.find((step) => step.id === "reviewed")?.required).toBe(
      true,
    );
    expect(
      security?.steps.find((step) => step.id === "package")?.required,
    ).toBe(true);
  });

  it("marks balanced review and package steps as optional", () => {
    const state = entryAdoptionPlanState(entry(), "balanced-rollout", []);
    const prereq = state.stages.find((stage) => stage.id === "prereq");
    const security = state.stages.find((stage) => stage.id === "security");
    expect(prereq?.steps.find((step) => step.id === "reviewed")?.required).toBe(
      false,
    );
    expect(
      security?.steps.find((step) => step.id === "package")?.required,
    ).toBe(false);
  });

  it("returns reference-only rollout stage with single completed step", () => {
    const state = entryAdoptionPlanState(entry(), "reference-only", []);
    const rollout = state.stages.find((stage) => stage.id === "rollout");
    expect(rollout?.steps).toHaveLength(1);
    expect(rollout?.steps[0].done).toBe(true);
  });

  it("returns compare summary when compare peers exist and current is riskier", () => {
    const current = entry({
      title: "Current",
      trust: "review",
      source: "unverified",
    });
    const peer = entry({
      slug: "peer",
      title: "Peer",
      trust: "trusted",
      source: "source-backed",
      sourceUrl: "https://github.com/acme/peer",
      safetyNotes: "yes",
      privacyNotes: "yes",
    });
    const state = entryAdoptionPlanState(current, "balanced-rollout", [
      current,
      peer,
    ]);
    expect(state.compareSummary).toContain("Higher risk");
  });

  it("returns compare summary when current has lower or equal risk", () => {
    const current = entry({
      title: "Current",
      trust: "trusted",
      source: "source-backed",
      sourceUrl: "https://github.com/acme/current",
      safetyNotes: "yes",
      privacyNotes: "yes",
    });
    const peer = entry({
      slug: "peer",
      title: "Peer",
      trust: "review",
      source: "unverified",
    });
    const state = entryAdoptionPlanState(current, "balanced-rollout", [
      current,
      peer,
    ]);
    expect(state.compareSummary).toContain("Lower or equal risk");
  });

  it("returns null compare summary when no peers are selected", () => {
    const current = entry();
    const state = entryAdoptionPlanState(current, "balanced-rollout", [
      current,
    ]);
    expect(state.compareSummary).toBeNull();
  });

  it("keeps risk score bounded to 100", () => {
    const risky = entry({
      trust: "blocked",
      source: "unverified",
      safetyNotes: undefined,
      privacyNotes: undefined,
      reviewed: false,
      reviewedBy: undefined,
      packageVerified: undefined,
      downloadSha256: undefined,
      installCommand: undefined,
      configSnippet: undefined,
      fullCopy: undefined,
      copySnippet: undefined,
    });
    expect(entryAdoptionRiskScore(risky)).toBeLessThanOrEqual(100);
  });

  it("marks source step done when source metadata is present", () => {
    const state = entryAdoptionPlanState(
      entry({
        source: "source-backed",
        sourceUrl: "https://github.com/acme/source",
      }),
      "balanced-rollout",
      [],
    );
    const sourceStep = state.stages
      .find((stage) => stage.id === "prereq")
      ?.steps.find((step) => step.id === "source");
    expect(sourceStep?.done).toBe(true);
  });

  it("marks privacy step pending when privacy notes are missing", () => {
    const state = entryAdoptionPlanState(
      entry({ privacyNotes: undefined, privacyNotesList: undefined }),
      "balanced-rollout",
      [],
    );
    const privacyStep = state.stages
      .find((stage) => stage.id === "security")
      ?.steps.find((step) => step.id === "privacy");
    expect(privacyStep?.done).toBe(false);
    expect(privacyStep?.severity).toBe("critical");
  });

  it("marks rollout steps as pending in non-reference presets", () => {
    const state = entryAdoptionPlanState(entry(), "pilot-fast", []);
    const rollout = state.stages.find((stage) => stage.id === "rollout");
    expect(rollout?.steps.every((step) => step.done === false)).toBe(true);
  });
});
