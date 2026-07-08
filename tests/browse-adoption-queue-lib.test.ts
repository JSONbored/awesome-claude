import { describe, expect, it } from "vitest";
import type { Entry } from "@/types/registry";
import {
  browseAdoptionQueueState,
  browseAdoptionTierClass,
} from "@/lib/browse-adoption-queue-lib";

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

describe("browse adoption queue lib", () => {
  it("returns empty rows for no entries", () => {
    const state = browseAdoptionQueueState([], "balanced");
    expect(state.rows).toEqual([]);
    expect(state.scannedCount).toBe(0);
  });

  it("returns heading per preset", () => {
    expect(browseAdoptionQueueState([strong], "balanced").heading).toContain(
      "balanced",
    );
    expect(
      browseAdoptionQueueState([strong], "security-first").heading,
    ).toContain("security");
    expect(browseAdoptionQueueState([strong], "fast-pilot").heading).toContain(
      "pilot",
    );
  });

  it("ranks strong entry above weak entry", () => {
    const state = browseAdoptionQueueState([weak, strong], "balanced");
    expect(state.rows[0].entryRef).toBe("tools/strong");
    expect(state.rows[1].entryRef).toBe("tools/weak");
  });

  it("assigns ready and hold tiers", () => {
    const state = browseAdoptionQueueState([strong, weak], "security-first");
    expect(
      state.rows.find((row) => row.entryRef === "tools/strong")?.tier,
    ).toBe("ready");
    expect(state.rows.find((row) => row.entryRef === "tools/weak")?.tier).toBe(
      "hold",
    );
  });

  it("tracks tier counters", () => {
    const state = browseAdoptionQueueState([strong, weak], "balanced");
    expect(state.readyCount).toBeGreaterThanOrEqual(0);
    expect(state.holdCount).toBeGreaterThanOrEqual(0);
  });

  it("creates blockers based on preset requirements", () => {
    const state = browseAdoptionQueueState([weak], "security-first");
    expect(state.rows[0].blockers).toContain("Source provenance");
    expect(state.rows[0].blockers).toContain("Package integrity");
  });

  it("creates next steps for missing signals", () => {
    const state = browseAdoptionQueueState([weak], "balanced");
    expect(state.rows[0].nextSteps.length).toBeGreaterThan(0);
  });

  it("limits rows by maxRows argument", () => {
    const state = browseAdoptionQueueState(
      [strong, weak, strong],
      "balanced",
      2,
    );
    expect(state.rows).toHaveLength(2);
  });

  it("changes scoring profile across presets", () => {
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
      installCommand: undefined,
      configSnippet: undefined,
      copySnippet: undefined,
      fullCopy: undefined,
    });
    const security = browseAdoptionQueueState([installOnly], "security-first");
    const pilot = browseAdoptionQueueState([installOnly], "fast-pilot");
    expect(security.rows[0].readinessScore).not.toBe(
      pilot.rows[0].readinessScore,
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
    const state = browseAdoptionQueueState([reviewedBy], "balanced");
    expect(state.rows[0].blockers).not.toContain("Metadata review");
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
    const state = browseAdoptionQueueState([hashed], "balanced");
    expect(state.rows[0].blockers).not.toContain("Package integrity");
  });

  it("keeps deterministic ordering on equal scores", () => {
    const a = entry({ slug: "a", title: "A" });
    const b = entry({ slug: "b", title: "B" });
    const state = browseAdoptionQueueState([b, a], "balanced");
    expect(state.rows[0].title).toBe("A");
  });

  it("reports hold-heavy summary when hold tiers exist", () => {
    const state = browseAdoptionQueueState([weak], "balanced");
    expect(state.summary).toContain("hold tier");
  });

  it("reports ready summary when no hold tiers exist", () => {
    const state = browseAdoptionQueueState([strong], "balanced");
    expect(state.summary).toContain("ready for staged adoption");
  });

  it("maps tier classes for presentation", () => {
    expect(browseAdoptionTierClass("ready")).toContain("trust-trusted");
    expect(browseAdoptionTierClass("caution")).toContain("amber");
    expect(browseAdoptionTierClass("hold")).toContain("trust-blocked");
  });
});
