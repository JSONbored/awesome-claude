import { describe, expect, it } from "vitest";
import type { Entry } from "@/types/registry";
import { compareRolloutReadinessState } from "@/lib/compare-rollout-readiness-lib";

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

const strong = entry({
  slug: "strong",
  title: "Strong",
  source: "source-backed",
  sourceUrl: "https://github.com/acme/strong",
  reviewed: true,
  safetyNotes: "Present",
  privacyNotes: "Present",
  packageVerified: true,
  downloadSha256: "abc",
  installCommand: "npm i strong",
});

const mid = entry({
  slug: "mid",
  title: "Mid",
  source: "source-backed",
  sourceUrl: "https://github.com/acme/mid",
  reviewed: false,
  safetyNotes: "Present",
  privacyNotes: undefined,
  packageVerified: undefined,
  installCommand: "npm i mid",
});

const weak = entry({
  slug: "weak",
  title: "Weak",
  source: "unverified",
  sourceUrl: undefined,
  reviewed: false,
  safetyNotes: undefined,
  privacyNotes: undefined,
  packageVerified: undefined,
  installCommand: undefined,
  copySnippet: undefined,
  configSnippet: undefined,
  fullCopy: undefined,
});

describe("compare rollout readiness lib", () => {
  it("returns empty summary when no entries compared", () => {
    const state = compareRolloutReadinessState([], "team");
    expect(state.comparedCount).toBe(0);
    expect(state.plans).toEqual([]);
    expect(state.summary).toContain("Add entries");
  });

  it("uses preset heading values", () => {
    expect(
      compareRolloutReadinessState([strong], "prototype").heading,
    ).toContain("Prototype");
    expect(compareRolloutReadinessState([strong], "team").heading).toContain(
      "Team",
    );
    expect(
      compareRolloutReadinessState([strong], "production").heading,
    ).toContain("Production");
  });

  it("scores stronger entries above weaker entries", () => {
    const state = compareRolloutReadinessState([weak, strong], "team");
    expect(state.plans[0].entryRef).toBe("tools/strong");
    expect(state.plans[1].entryRef).toBe("tools/weak");
    expect(state.plans[0].score).toBeGreaterThan(state.plans[1].score);
  });

  it("assigns ready tier for high scores", () => {
    const state = compareRolloutReadinessState([strong], "production");
    expect(state.plans[0].tier).toBe("ready");
  });

  it("assigns hold tier for low scores", () => {
    const state = compareRolloutReadinessState([weak], "production");
    expect(state.plans[0].tier).toBe("hold");
  });

  it("assigns review tier for medium scores", () => {
    const state = compareRolloutReadinessState([mid], "team");
    expect(state.plans[0].tier).toBe("review");
  });

  it("marks missing required signals as blocked", () => {
    const state = compareRolloutReadinessState([weak], "production");
    const plan = state.plans[0];
    expect(
      plan.checklist.some((item) => item.required && item.tone === "blocked"),
    ).toBe(true);
    expect(plan.blockers.length).toBeGreaterThan(0);
  });

  it("marks missing optional signals as warning", () => {
    const state = compareRolloutReadinessState([mid], "team");
    const privacyItem = state.plans[0].checklist.find(
      (item) => item.id === "privacy",
    );
    expect(privacyItem?.required).toBe(false);
    expect(privacyItem?.tone).toBe("warning");
  });

  it("marks present signals as complete", () => {
    const state = compareRolloutReadinessState([strong], "team");
    expect(
      state.plans[0].checklist.every((item) => item.tone === "complete"),
    ).toBe(true);
  });

  it("includes required marker based on preset", () => {
    const prototype = compareRolloutReadinessState([mid], "prototype");
    const production = compareRolloutReadinessState([mid], "production");
    const privacyPrototype = prototype.plans[0].checklist.find(
      (item) => item.id === "privacy",
    );
    const privacyProduction = production.plans[0].checklist.find(
      (item) => item.id === "privacy",
    );
    expect(privacyPrototype?.required).toBe(false);
    expect(privacyProduction?.required).toBe(true);
  });

  it("produces blocker labels from blocked checklist items", () => {
    const state = compareRolloutReadinessState([weak], "production");
    expect(
      state.plans[0].blockers.some((label) => label.includes("missing")),
    ).toBe(true);
  });

  it("creates hold summary with blocker detail", () => {
    const state = compareRolloutReadinessState([weak], "production");
    expect(state.plans[0].summary).toContain("Hold rollout");
    expect(state.plans[0].summary).toContain("blockers");
  });

  it("creates ready summary for high score entries", () => {
    const state = compareRolloutReadinessState([strong], "team");
    expect(state.plans[0].summary).toContain("Ready");
  });

  it("includes trailing refs for lowest scoring plans", () => {
    const state = compareRolloutReadinessState([strong, mid, weak], "team");
    expect(state.trailingEntryRefs.length).toBe(2);
    expect(state.trailingEntryRefs).toContain("tools/weak");
  });

  it("lists highest risk refs for hold entries", () => {
    const state = compareRolloutReadinessState([strong, weak], "production");
    expect(state.highestRiskRefs).toContain("tools/weak");
    expect(state.highestRiskRefs).not.toContain("tools/strong");
  });

  it("uses prototype compare summary phrasing", () => {
    const state = compareRolloutReadinessState([strong, weak], "prototype");
    expect(state.summary).toContain("prototype rollout");
  });

  it("uses production compare summary phrasing", () => {
    const state = compareRolloutReadinessState([strong, weak], "production");
    expect(state.summary).toContain("production rollout");
  });

  it("uses team compare summary phrasing", () => {
    const state = compareRolloutReadinessState([strong, mid, weak], "team");
    expect(state.summary).toContain("ready");
    expect(state.summary).toContain("hold");
  });

  it("emits checklist detail text for missing and present", () => {
    const missingState = compareRolloutReadinessState([weak], "team");
    const presentState = compareRolloutReadinessState([strong], "team");
    const missingSource = missingState.plans[0].checklist.find(
      (item) => item.id === "source",
    );
    const presentSource = presentState.plans[0].checklist.find(
      (item) => item.id === "source",
    );
    expect(missingSource?.detail).toContain("No reliable source");
    expect(presentSource?.detail).toContain("documented");
  });
});
