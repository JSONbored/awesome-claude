import { describe, expect, it } from "vitest";
import type { Entry } from "@/types/registry";
import {
  browseCompareSelectionContextState,
  resourceCardTrustDecisionState,
  resourceCardTrustScore,
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
});
