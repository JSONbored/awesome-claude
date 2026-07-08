import { describe, expect, it } from "vitest";
import type { Entry } from "@/types/registry";
import { entryDecisionTimelineState } from "@/lib/entry-decision-timeline-lib";

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

const mid = entry({
  slug: "mid",
  title: "Mid",
  trust: "review",
  source: "source-backed",
  sourceUrl: "https://github.com/acme/mid",
  reviewed: false,
  safetyNotes: "present",
  privacyNotes: undefined,
  packageVerified: undefined,
  installCommand: "npm i mid",
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

describe("entry decision timeline lib", () => {
  it("returns heading per preset", () => {
    expect(
      entryDecisionTimelineState(strong, "fast-track", []).heading,
    ).toContain("fast track");
    expect(
      entryDecisionTimelineState(strong, "balanced", []).heading,
    ).toContain("balanced");
    expect(
      entryDecisionTimelineState(strong, "security-first", []).heading,
    ).toContain("security first");
  });

  it("creates six timeline steps", () => {
    expect(
      entryDecisionTimelineState(strong, "balanced", []).steps,
    ).toHaveLength(6);
  });

  it("marks missing required steps as critical", () => {
    const state = entryDecisionTimelineState(weak, "security-first", []);
    expect(
      state.steps.some((step) => step.required && step.tone === "critical"),
    ).toBe(true);
  });

  it("marks missing optional steps as warning", () => {
    const state = entryDecisionTimelineState(mid, "balanced", []);
    const privacy = state.steps.find((step) => step.id === "privacy");
    expect(privacy?.required).toBe(false);
    expect(privacy?.tone).toBe("warning");
  });

  it("marks complete steps as complete tone", () => {
    const state = entryDecisionTimelineState(strong, "security-first", []);
    expect(state.steps.every((step) => step.tone === "complete")).toBe(true);
  });

  it("sets blockers from required missing steps", () => {
    const state = entryDecisionTimelineState(weak, "security-first", []);
    expect(state.blockers.length).toBeGreaterThan(0);
    expect(state.blockers[0]).toContain("Confirm");
  });

  it("produces no blockers when required signals are present", () => {
    const state = entryDecisionTimelineState(strong, "security-first", []);
    expect(state.blockers).toEqual([]);
  });

  it("computes low risk score for strong entry", () => {
    const state = entryDecisionTimelineState(strong, "security-first", []);
    expect(state.riskScore).toBeLessThan(20);
  });

  it("computes high risk score for weak entry", () => {
    const state = entryDecisionTimelineState(weak, "security-first", []);
    expect(state.riskScore).toBeGreaterThanOrEqual(60);
  });

  it("uses blocker-based summary when gaps exist", () => {
    const state = entryDecisionTimelineState(weak, "balanced", []);
    expect(state.summary).toContain("Blocking gaps");
  });

  it("uses complete summary when no blockers exist", () => {
    const state = entryDecisionTimelineState(strong, "balanced", []);
    expect(state.summary).toContain("steps complete");
  });

  it("keeps privacy optional in fast-track preset", () => {
    const state = entryDecisionTimelineState(weak, "fast-track", []);
    const privacy = state.steps.find((step) => step.id === "privacy");
    expect(privacy?.required).toBe(false);
  });

  it("keeps package required in security-first preset", () => {
    const state = entryDecisionTimelineState(weak, "security-first", []);
    const packageStep = state.steps.find((step) => step.id === "package");
    expect(packageStep?.required).toBe(true);
  });

  it("excludes target entry from benchmarks", () => {
    const state = entryDecisionTimelineState(strong, "balanced", [strong, mid]);
    expect(
      state.benchmarks.some((row) => row.entryRef === "tools/strong"),
    ).toBe(false);
  });

  it("sorts benchmarks by score descending", () => {
    const state = entryDecisionTimelineState(mid, "balanced", [strong, weak]);
    expect(state.benchmarks[0].entryRef).toBe("tools/strong");
  });

  it("limits benchmarks to top four rows", () => {
    const compare = [strong, mid, weak].concat(
      Array.from({ length: 4 }).map((_, idx) =>
        entry({
          slug: `extra-${idx}`,
          title: `Extra ${idx}`,
          source: "source-backed",
          sourceUrl: `https://example.com/${idx}`,
          installCommand: "npm i extra",
        }),
      ),
    );
    const state = entryDecisionTimelineState(mid, "balanced", compare);
    expect(state.benchmarks.length).toBeLessThanOrEqual(4);
  });

  it("creates benchmark summary when compare entries exist", () => {
    const state = entryDecisionTimelineState(mid, "balanced", [strong, weak]);
    expect(state.benchmarkSummary).toBeTruthy();
  });

  it("returns null benchmark summary for no compare entries", () => {
    const state = entryDecisionTimelineState(mid, "balanced", []);
    expect(state.benchmarkSummary).toBeNull();
  });

  it("uses reviewedBy as reviewed signal", () => {
    const reviewedBy = entry({
      slug: "reviewed-by",
      source: "source-backed",
      sourceUrl: "https://example.com/reviewed-by",
      reviewed: false,
      reviewedBy: "team",
      safetyNotes: "present",
      installCommand: "npm i reviewed-by",
    });
    const state = entryDecisionTimelineState(reviewedBy, "balanced", []);
    expect(state.steps.find((step) => step.id === "reviewed")?.done).toBe(true);
  });

  it("uses checksum as package signal", () => {
    const hashed = entry({
      slug: "hashed",
      source: "source-backed",
      sourceUrl: "https://example.com/hashed",
      safetyNotes: "present",
      installCommand: "npm i hashed",
      packageVerified: undefined,
      downloadSha256: "ffff",
    });
    const state = entryDecisionTimelineState(hashed, "balanced", []);
    expect(state.steps.find((step) => step.id === "package")?.done).toBe(true);
  });
});
