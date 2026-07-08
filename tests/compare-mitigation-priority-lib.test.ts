import { describe, expect, it } from "vitest";
import type { Entry } from "@/types/registry";
import {
  compareMitigationPriorityState,
  mitigationPriorityTierClass,
} from "@/lib/compare-mitigation-priority-lib";

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
  trust: "trusted",
  source: "source-backed",
  sourceUrl: "https://github.com/acme/strong",
  reviewed: true,
  safetyNotes: "present",
  privacyNotes: "present",
  packageVerified: true,
  downloadSha256: "abc",
  installCommand: "npm i strong",
});

const weak = entry({
  slug: "weak",
  title: "Weak",
  trust: "limited",
  source: "unverified",
  sourceUrl: undefined,
  reviewed: false,
  safetyNotes: undefined,
  privacyNotes: undefined,
  packageVerified: undefined,
  installCommand: undefined,
  configSnippet: undefined,
  copySnippet: undefined,
  fullCopy: undefined,
});

describe("compare mitigation priority lib", () => {
  it("returns empty summary when no entries", () => {
    const state = compareMitigationPriorityState([], "balanced");
    expect(state.entries).toEqual([]);
    expect(state.topEntryRef).toBeNull();
    expect(state.summary).toContain("Add entries");
  });

  it("returns heading per preset", () => {
    expect(
      compareMitigationPriorityState([strong], "balanced").heading,
    ).toContain("balanced");
    expect(
      compareMitigationPriorityState([strong], "security-first").heading,
    ).toContain("security");
    expect(
      compareMitigationPriorityState([strong], "rollout-first").heading,
    ).toContain("rollout");
  });

  it("ranks weak entry above strong entry", () => {
    const state = compareMitigationPriorityState([strong, weak], "balanced");
    expect(state.entries[0].entryRef).toBe("tools/weak");
    expect(state.entries[1].entryRef).toBe("tools/strong");
  });

  it("assigns urgent tier to weak limited-trust entry", () => {
    const state = compareMitigationPriorityState([weak], "security-first");
    expect(state.entries[0].tier).toBe("urgent");
    expect(state.urgentCount).toBe(1);
  });

  it("assigns optional tier to complete trusted entry", () => {
    const state = compareMitigationPriorityState([strong], "balanced");
    expect(state.entries[0].tier).toBe("optional");
    expect(state.entries[0].actions).toHaveLength(0);
  });

  it("tracks top entry ref", () => {
    const state = compareMitigationPriorityState([strong, weak], "balanced");
    expect(state.topEntryRef).toBe("tools/weak");
  });

  it("creates actions for each missing signal", () => {
    const state = compareMitigationPriorityState([weak], "balanced");
    expect(state.entries[0].actions.length).toBe(6);
    expect(state.entries[0].actions.map((action) => action.signalId)).toContain(
      "source",
    );
    expect(state.entries[0].actions.map((action) => action.signalId)).toContain(
      "install",
    );
  });

  it("includes action detail copy", () => {
    const state = compareMitigationPriorityState([weak], "balanced");
    const source = state.entries[0].actions.find(
      (action) => action.signalId === "source",
    );
    expect(source?.detail).toContain("source URL");
  });

  it("changes score profile between security and rollout presets", () => {
    const installOnly = entry({
      slug: "install-only",
      title: "Install only",
      trust: "review",
      source: "source-backed",
      sourceUrl: "https://github.com/acme/install-only",
      reviewed: true,
      safetyNotes: "present",
      privacyNotes: "present",
      packageVerified: true,
      downloadSha256: "abc",
      installCommand: undefined,
      configSnippet: undefined,
      copySnippet: undefined,
      fullCopy: undefined,
    });
    const security = compareMitigationPriorityState(
      [installOnly],
      "security-first",
    );
    const rollout = compareMitigationPriorityState(
      [installOnly],
      "rollout-first",
    );
    expect(security.entries[0].priorityScore).not.toBe(
      rollout.entries[0].priorityScore,
    );
  });

  it("uses reviewedBy as reviewed signal", () => {
    const reviewedBy = entry({
      slug: "reviewed-by",
      source: "source-backed",
      sourceUrl: "https://github.com/acme/reviewed-by",
      reviewed: false,
      reviewedBy: "ops",
      safetyNotes: "present",
      installCommand: "npm i reviewed-by",
    });
    const state = compareMitigationPriorityState([reviewedBy], "balanced");
    expect(
      state.entries[0].actions.some((action) => action.signalId === "reviewed"),
    ).toBe(false);
  });

  it("uses checksum as package signal", () => {
    const hashed = entry({
      slug: "hashed",
      source: "source-backed",
      sourceUrl: "https://github.com/acme/hashed",
      safetyNotes: "present",
      installCommand: "npm i hashed",
      packageVerified: undefined,
      downloadSha256: "ffff",
    });
    const state = compareMitigationPriorityState([hashed], "balanced");
    expect(
      state.entries[0].actions.some((action) => action.signalId === "package"),
    ).toBe(false);
  });

  it("returns deterministic title ordering on ties", () => {
    const a = entry({ slug: "a", title: "A" });
    const b = entry({ slug: "b", title: "B" });
    const state = compareMitigationPriorityState([b, a], "balanced");
    expect(state.entries[0].title).toBe("A");
  });

  it("generates urgent summary when urgent entries exist", () => {
    const state = compareMitigationPriorityState([weak], "security-first");
    expect(state.summary).toContain("urgent mitigation");
  });

  it("generates optional summary when all entries are low priority", () => {
    const state = compareMitigationPriorityState([strong], "balanced");
    expect(state.summary).toContain("optional mitigation");
  });

  it("maps tier classes for presentation", () => {
    expect(mitigationPriorityTierClass("urgent")).toContain("trust-blocked");
    expect(mitigationPriorityTierClass("watch")).toContain("amber");
    expect(mitigationPriorityTierClass("optional")).toContain("trust-trusted");
  });

  it("includes rationale for watch tier entries", () => {
    const watchEntry = entry({
      slug: "watch",
      title: "Watch",
      trust: "review",
      source: "source-backed",
      sourceUrl: "https://github.com/acme/watch",
      reviewed: true,
      safetyNotes: "present",
      privacyNotes: undefined,
      packageVerified: undefined,
      installCommand: undefined,
    });
    const state = compareMitigationPriorityState([watchEntry], "balanced");
    expect(state.entries[0].rationale).toContain("pilot");
  });
});
