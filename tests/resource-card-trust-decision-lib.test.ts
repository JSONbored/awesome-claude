import { describe, expect, it } from "vitest";
import type { Entry } from "@/types/registry";
import {
  browseCompareSelectionContextState,
  browseCompareSelectionDivergingLine,
  resourceCardTrustDecisionState,
  resourceCardTrustHintToneClass,
  resourceCardTrustScore,
  resourceCardVersusCompareEntries,
} from "@/lib/resource-card-trust-decision-lib";

function entry(overrides: Partial<Entry> = {}): Entry {
  return {
    category: "skills",
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

describe("resource card trust decision lib", () => {
  it("scores trusted reviewed entries above unverified ones", () => {
    const trusted = entry({
      trust: "trusted",
      reviewed: true,
      source: "source-backed",
      safetyNotes: "Careful",
    });
    const risky = entry({
      slug: "risky",
      trust: "limited",
      source: "unverified",
    });

    expect(resourceCardTrustScore(trusted)).toBeGreaterThan(
      resourceCardTrustScore(risky),
    );
  });

  it("includes optional trust metadata in the score", () => {
    const rich = entry({
      safetyNotesList: ["Careful"],
      privacyNotes: "Local only",
      privacyNotesList: ["No network"],
      reviewedBy: "maintainer",
      installCommand: "npm i fixture",
      claimed: true,
    });

    expect(resourceCardTrustScore(rich)).toBeGreaterThan(
      resourceCardTrustScore(entry()),
    );
  });

  it("maps hint kinds to tone classes", () => {
    expect(resourceCardTrustHintToneClass("aligns")).toContain("border-border");
    expect(resourceCardTrustHintToneClass("stronger")).toContain(
      "trust-trusted",
    );
    expect(resourceCardTrustHintToneClass("weaker")).toContain("trust-review");
    expect(resourceCardTrustHintToneClass("diverges")).toContain("amber-500");
    expect(resourceCardTrustHintToneClass("mixed-trust")).toContain("accent");
  });

  it("filters the active card out of compare peers", () => {
    const left = entry();
    const right = entry({ slug: "right" });
    expect(resourceCardVersusCompareEntries(left, [left, right])).toEqual([
      right,
    ]);
  });

  it("builds browse-card hints against the compare tray", () => {
    const selected = entry({
      title: "Selected",
      trust: "trusted",
      reviewed: true,
      source: "source-backed",
    });
    const candidate = entry({
      slug: "candidate",
      title: "Candidate",
      trust: "review",
      source: "unverified",
    });

    const state = resourceCardTrustDecisionState(candidate, [selected]);
    expect(state?.showHint).toBe(true);
    expect(state?.hint).toContain("Selected");
  });

  it("returns null when the compare tray is empty", () => {
    expect(resourceCardTrustDecisionState(entry(), [])).toBeNull();
  });

  it("marks weaker trust signals versus a stronger compare selection", () => {
    const strong = entry({
      title: "Strong",
      trust: "review",
      reviewed: false,
      source: "unverified",
      safetyNotes: "Audited",
      privacyNotes: "Local only",
      installCommand: "npm i strong",
    });
    const weak = entry({
      slug: "weak",
      title: "Weak",
      trust: "review",
      reviewed: false,
      source: "unverified",
    });

    const state = resourceCardTrustDecisionState(weak, [strong]);
    expect(state?.kind).toBe("weaker");
    expect(state?.hint).toContain("Weaker trust signals");
  });

  it("marks stronger trust signals versus a weaker compare selection", () => {
    const strong = entry({
      title: "Strong",
      trust: "review",
      reviewed: false,
      source: "unverified",
      safetyNotes: "Audited",
      privacyNotes: "Local only",
      installCommand: "npm i strong",
    });
    const weak = entry({
      slug: "weak",
      title: "Weak",
      trust: "review",
      reviewed: false,
      source: "unverified",
    });

    const state = resourceCardTrustDecisionState(strong, [weak]);
    expect(state?.kind).toBe("stronger");
    expect(state?.hint).toContain("Stronger trust signals");
  });

  it("marks aligned trust signals when scores are close", () => {
    const left = entry({ trust: "review", source: "unverified" });
    const right = entry({
      slug: "right",
      trust: "review",
      source: "unverified",
    });

    const state = resourceCardTrustDecisionState(left, [right]);
    expect(state?.kind).toBe("aligns");
    expect(state?.hint).toContain("align with");
  });

  it("marks mixed trust levels when package signals align", () => {
    const left = entry({ trust: "trusted" });
    const right = entry({ slug: "right", trust: "review" });

    const state = resourceCardTrustDecisionState(left, [right]);
    expect(state?.kind).toBe("mixed-trust");
    expect(state?.hint).toContain("Mixed trust levels");
  });

  it("marks diverging decision rows before weaker or stronger hints", () => {
    const reviewed = entry({ reviewed: true, source: "source-backed" });
    const unreviewed = entry({
      slug: "unreviewed",
      reviewed: false,
      source: "unverified",
    });

    const state = resourceCardTrustDecisionState(unreviewed, [reviewed]);
    expect(state?.kind).toBe("diverges");
    expect(state?.divergingLabels.length).toBeGreaterThan(0);
    expect(state?.hint).toContain("open compare");
  });

  it("uses plural compare copy for multi-select trays", () => {
    const candidate = entry();
    const second = entry({ slug: "second" });
    const third = entry({ slug: "third" });

    const state = resourceCardTrustDecisionState(candidate, [second, third]);
    expect(state?.hint).toContain("2 selected entries");
  });

  it("flags when the card is already in the compare tray", () => {
    const left = entry();
    const right = entry({ slug: "right" });

    const state = resourceCardTrustDecisionState(left, [left, right]);
    expect(state?.inCompareTray).toBe(true);
  });

  it("builds browse compare selection banner context for multi-select", () => {
    const left = entry({
      trust: "trusted",
      reviewed: true,
      source: "source-backed",
    });
    const right = entry({
      slug: "right",
      trust: "review",
      source: "unverified",
    });

    const context = browseCompareSelectionContextState([left, right]);
    expect(context.showBanner).toBe(true);
    expect(context.headline).toContain("trust");
    expect(context.hint).toContain("Browse cards below");
  });

  it("hides the compare selection banner until two entries are selected", () => {
    expect(browseCompareSelectionContextState([]).showBanner).toBe(false);
    expect(browseCompareSelectionContextState([entry()]).showBanner).toBe(
      false,
    );
  });

  it("uses aligned headline copy when compare signals match", () => {
    const left = entry({ reviewed: true, source: "source-backed" });
    const right = entry({
      slug: "right",
      reviewed: true,
      source: "source-backed",
    });

    const context = browseCompareSelectionContextState([left, right]);
    expect(context.headline).toContain("same trust signals");
    expect(context.hint).toContain("Add one more entry");
  });

  it("uses singular diverging headline copy for one differing signal", () => {
    const left = entry({ reviewed: true });
    const right = entry({ slug: "right", reviewed: false });

    const context = browseCompareSelectionContextState([left, right]);
    expect(context.headline).toBe(
      "1 trust signal differs across your selection.",
    );
  });

  it("uses plural diverging headline copy for multiple differing signals", () => {
    const left = entry({
      reviewed: true,
      source: "source-backed",
      claimed: true,
    });
    const right = entry({
      slug: "right",
      reviewed: false,
      source: "unverified",
      claimed: false,
    });

    const context = browseCompareSelectionContextState([left, right]);
    expect(context.headline).toContain("trust signals differ");
    expect(context.divergingCount).toBeGreaterThan(1);
  });

  it("formats diverging labels for the selection banner", () => {
    expect(browseCompareSelectionDivergingLine([])).toBeNull();
    expect(browseCompareSelectionDivergingLine(["Review status"])).toBe(
      "Differs on: Review status",
    );
    expect(
      browseCompareSelectionDivergingLine(["Review status", "Submitter"]),
    ).toBe("Differs on: Review status, Submitter");
  });
});
