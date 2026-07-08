import { describe, expect, it } from "vitest";
import type { Entry } from "@/types/registry";
import {
  compareBriefEntryScore,
  compareDecisionBriefState,
} from "@/lib/compare-decision-brief-lib";

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

describe("compare decision brief lib", () => {
  it("scores trusted reviewed entries above sparse entries", () => {
    const strong = entry({
      trust: "trusted",
      reviewed: true,
      source: "source-backed",
      sourceUrl: "https://github.com/acme/strong",
      safetyNotes: "Use env var",
      privacyNotes: "No telemetry",
      packageVerified: true,
      downloadSha256: "abc",
      claimed: true,
      installCommand: "npm i strong",
    });
    const weak = entry({ slug: "weak", trust: "limited" });
    expect(compareBriefEntryScore(strong)).toBeGreaterThan(
      compareBriefEntryScore(weak),
    );
  });

  it("returns empty-like summary for no entries", () => {
    const state = compareDecisionBriefState([]);
    expect(state.comparedCount).toBe(0);
    expect(state.entryBriefs).toEqual([]);
    expect(state.topEntryRef).toBeNull();
  });

  it("builds single-entry brief with rank one", () => {
    const single = entry({ title: "Only" });
    const state = compareDecisionBriefState([single]);
    expect(state.entryBriefs).toHaveLength(1);
    expect(state.entryBriefs[0].rank).toBe(1);
    expect(state.entryBriefs[0].entryRef).toBe("tools/fixture");
  });

  it("ranks entries by score and marks top ref", () => {
    const top = entry({
      slug: "top",
      title: "Top",
      trust: "trusted",
      reviewed: true,
      source: "source-backed",
      sourceUrl: "https://github.com/acme/top",
      safetyNotes: "yes",
      privacyNotes: "yes",
      packageVerified: true,
    });
    const mid = entry({
      slug: "mid",
      title: "Mid",
      trust: "review",
      source: "source-backed",
      sourceUrl: "https://github.com/acme/mid",
    });
    const low = entry({ slug: "low", title: "Low", trust: "limited" });
    const state = compareDecisionBriefState([low, mid, top]);
    expect(state.topEntryRef).toBe("tools/top");
    expect(state.entryBriefs.map((brief) => brief.title)).toEqual([
      "Top",
      "Mid",
      "Low",
    ]);
  });

  it("marks blocked tone and blocked recommendation", () => {
    const blocked = entry({ trust: "blocked", title: "Blocked" });
    const state = compareDecisionBriefState([blocked]);
    expect(state.entryBriefs[0].tone).toBe("blocked");
    expect(state.entryBriefs[0].recommendation).toContain("Do not install");
  });

  it("marks ready tone for high-score trusted entries", () => {
    const ready = entry({
      trust: "trusted",
      reviewed: true,
      source: "source-backed",
      sourceUrl: "https://github.com/acme/ready",
      safetyNotes: "yes",
      privacyNotes: "yes",
      packageVerified: true,
      downloadSha256: "abc",
      claimed: true,
      installCommand: "npm i ready",
    });
    const state = compareDecisionBriefState([ready]);
    expect(state.entryBriefs[0].tone).toBe("ready");
    expect(state.entryBriefs[0].headline).toContain("Strong candidate");
  });

  it("marks caution tone for limited trust entries", () => {
    const caution = entry({
      trust: "limited",
      title: "Caution",
      source: "source-backed",
      sourceUrl: "https://github.com/acme/caution",
    });
    const state = compareDecisionBriefState([caution]);
    expect(state.entryBriefs[0].tone).toBe("caution");
  });

  it("marks review tone for mixed-check review entries", () => {
    const review = entry({
      trust: "review",
      title: "Review",
      source: "source-backed",
      sourceUrl: "https://github.com/acme/review",
    });
    const state = compareDecisionBriefState([review]);
    expect(state.entryBriefs[0].tone).toBe("review");
  });

  it("includes required checklist items", () => {
    const sample = entry({ title: "Checklist" });
    const state = compareDecisionBriefState([sample]);
    const required = state.entryBriefs[0].checklist.filter(
      (item) => item.required,
    );
    expect(required.map((item) => item.id)).toEqual([
      "source",
      "safety",
      "privacy",
    ]);
  });

  it("sets score delta from top to zero for top entry", () => {
    const top = entry({
      slug: "top",
      title: "Top",
      trust: "trusted",
      reviewed: true,
      source: "source-backed",
      sourceUrl: "https://github.com/acme/top",
      safetyNotes: "yes",
      privacyNotes: "yes",
      packageVerified: true,
    });
    const low = entry({ slug: "low", title: "Low", trust: "limited" });
    const state = compareDecisionBriefState([top, low]);
    expect(state.entryBriefs[0].scoreDeltaFromTop).toBe(0);
    expect(state.entryBriefs[1].scoreDeltaFromTop).toBeLessThan(0);
  });

  it("provides top-ranked compare delta summary for top entry", () => {
    const top = entry({
      slug: "top",
      title: "Top",
      trust: "trusted",
      reviewed: true,
      source: "source-backed",
      sourceUrl: "https://github.com/acme/top",
      safetyNotes: "yes",
      privacyNotes: "yes",
      packageVerified: true,
    });
    const low = entry({ slug: "low", title: "Low", trust: "limited" });
    const state = compareDecisionBriefState([top, low]);
    expect(state.entryBriefs[0].compareDeltaSummary).toContain("Top-ranked");
    expect(state.entryBriefs[1].compareDeltaSummary).toContain(
      "below top-ranked",
    );
  });

  it("surfaces decision divergence labels when entries differ", () => {
    const a = entry({
      slug: "a",
      title: "A",
      reviewed: true,
      source: "source-backed",
      claimed: true,
    });
    const b = entry({
      slug: "b",
      title: "B",
      reviewed: false,
      source: "unverified",
      claimed: false,
    });
    const state = compareDecisionBriefState([a, b]);
    expect(state.hasDecisionDivergence).toBe(true);
    expect(state.divergingLabels.length).toBeGreaterThan(0);
  });

  it("reports action divergence when installability differs", () => {
    const installable = entry({
      slug: "installable",
      title: "Installable",
      installCommand: "npm i installable",
      sourceUrl: "https://github.com/acme/installable",
      source: "source-backed",
      safetyNotes: "yes",
      privacyNotes: "yes",
    });
    const docsOnly = entry({
      slug: "docs",
      title: "Docs",
      installCommand: undefined,
      sourceUrl: "https://github.com/acme/docs",
      source: "source-backed",
      safetyNotes: "yes",
      privacyNotes: "yes",
    });
    const state = compareDecisionBriefState([installable, docsOnly]);
    expect(state.hasActionDivergence).toBe(true);
  });

  it("uses aligned summary when no divergence exists", () => {
    const a = entry({
      slug: "a",
      title: "A",
      reviewed: true,
      source: "source-backed",
      sourceUrl: "https://github.com/acme/a",
      safetyNotes: "yes",
      privacyNotes: "yes",
      installCommand: "npm i a",
    });
    const b = entry({
      slug: "b",
      title: "B",
      reviewed: true,
      source: "source-backed",
      sourceUrl: "https://github.com/acme/b",
      safetyNotes: "yes",
      privacyNotes: "yes",
      installCommand: "npm i b",
    });
    const state = compareDecisionBriefState([a, b]);
    expect(state.summary).toContain("closely aligned");
  });

  it("uses divergence summary when decision labels differ", () => {
    const a = entry({
      slug: "a",
      title: "A",
      reviewed: true,
      source: "source-backed",
      sourceUrl: "https://github.com/acme/a",
      safetyNotes: "yes",
      privacyNotes: "yes",
    });
    const b = entry({
      slug: "b",
      title: "B",
      reviewed: false,
      source: "unverified",
      sourceUrl: undefined,
    });
    const state = compareDecisionBriefState([a, b]);
    expect(state.summary).toContain("Signals diverge");
  });

  it("includes sparse-entry reasons when trust metadata is limited", () => {
    const sparse = entry({
      trust: "review",
      source: "unverified",
      sourceUrl: undefined,
      reviewed: false,
      reviewedBy: undefined,
      safetyNotes: undefined,
      privacyNotes: undefined,
      packageVerified: undefined,
      downloadSha256: undefined,
      installCommand: undefined,
      configSnippet: undefined,
      fullCopy: undefined,
      copySnippet: undefined,
      claimed: false,
    });
    const state = compareDecisionBriefState([sparse]);
    expect(state.entryBriefs[0].reasons).toContain("No install payload listed");
  });

  it("promotes complete-source recommendation for ready entries", () => {
    const ready = entry({
      trust: "trusted",
      reviewed: true,
      source: "source-backed",
      sourceUrl: "https://github.com/acme/ready",
      safetyNotes: "yes",
      privacyNotes: "yes",
      packageVerified: true,
      downloadSha256: "abc",
      installCommand: "npm i ready",
    });
    const state = compareDecisionBriefState([ready]);
    expect(state.entryBriefs[0].recommendation).toContain("Best candidate");
  });
});
