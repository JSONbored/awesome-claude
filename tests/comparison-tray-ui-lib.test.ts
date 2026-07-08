import { describe, expect, it } from "vitest";
import type { Entry } from "@/types/registry";
import {
  comparisonTrayChipSignals,
  comparisonTrayClearAriaLabel,
  comparisonTrayHintMessages,
  comparisonTraySecondaryHint,
  comparisonTrayTrustDivergenceBadgeLabel,
  comparisonTrayUiState,
} from "@/lib/comparison-tray-ui-lib";

function entry(overrides: Partial<Entry> = {}): Entry {
  return {
    category: "mcp",
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

describe("comparison tray ui lib", () => {
  it("derives compact chip trust signals from entry metadata", () => {
    expect(
      comparisonTrayChipSignals(
        entry({
          safetyNotes: "Read carefully",
          privacyNotes: "No telemetry",
          reviewedBy: "maintainer",
          claimed: true,
          installCommand: "npm i fixture",
        }),
      ),
    ).toEqual({
      hasSafetyNotes: true,
      hasPrivacyNotes: true,
      reviewed: true,
      claimed: true,
      installable: true,
      packageTrustTone: "missing",
      sourceProvenanceTone: "missing",
    });
  });

  it("maps package trust and source provenance tones from compare signal helpers", () => {
    expect(
      comparisonTrayChipSignals(
        entry({
          packageVerified: true,
          verifiedAt: "2026-01-02",
          sourceSubmissionUrl: "https://github.com/org/repo/issues/1",
        }),
      ),
    ).toEqual({
      hasSafetyNotes: false,
      hasPrivacyNotes: false,
      reviewed: false,
      claimed: false,
      installable: false,
      packageTrustTone: "verified",
      sourceProvenanceTone: "present",
    });
    expect(
      comparisonTrayChipSignals(
        entry({ downloadSha256: "abc", source: "source-backed" }),
      ),
    ).toMatchObject({
      packageTrustTone: "present",
      sourceProvenanceTone: "present",
    });
  });

  it("surfaces package trust divergence hints in the tray", () => {
    expect(
      comparisonTrayHintMessages([
        entry(),
        entry({ packageVerified: true, verifiedAt: "2026-01-02" }),
      ]),
    ).toEqual([
      "1 trust signal differ across this comparison (Package trust).",
    ]);
  });

  it("requires at least two entries before enabling quick compare actions", () => {
    expect(comparisonTrayUiState([entry()])).toMatchObject({
      count: 1,
      canQuickCompare: false,
      canOpenFullCompare: false,
      hasTrustDivergence: false,
      primaryHint: null,
    });
    expect(
      comparisonTrayUiState([entry(), entry({ slug: "other" })]),
    ).toMatchObject({
      count: 2,
      canQuickCompare: true,
      canOpenFullCompare: true,
      compareIds: "mcp/fixture,mcp/other",
    });
  });

  it("surfaces trust divergence hints without opening the drawer", () => {
    const hints = comparisonTrayHintMessages([
      entry(),
      entry({ reviewedBy: "maintainer", reviewedAt: "2026-01-02" }),
    ]);
    expect(hints).toEqual([
      "1 trust signal differ across this comparison (Review status).",
    ]);
    expect(
      comparisonTrayUiState([
        entry(),
        entry({ reviewedBy: "maintainer", reviewedAt: "2026-01-02" }),
      ]),
    ).toMatchObject({
      hasTrustDivergence: true,
      primaryHint: hints[0],
      hints,
    });
  });

  it("combines trust and action divergence hints for the tray", () => {
    expect(
      comparisonTrayHintMessages([
        entry(),
        entry({
          reviewedBy: "maintainer",
          reviewedAt: "2026-01-02",
          installCommand: "npm i fixture",
        }),
      ]),
    ).toEqual([
      "1 trust signal differ across this comparison (Review status).",
      "Next steps differ across entries — open the interactive comparison to compare install/config copy, source links, API JSON, and LLM/MCP handoff links per resource.",
    ]);
  });

  it("builds mobile tray affordance labels from tray state", () => {
    expect(comparisonTrayClearAriaLabel(1)).toBe("Clear 1 entry from compare");
    expect(comparisonTrayClearAriaLabel(3)).toBe(
      "Clear 3 entries from compare",
    );
    expect(comparisonTrayTrustDivergenceBadgeLabel(true)).toBe("Trust gap");
    expect(comparisonTrayTrustDivergenceBadgeLabel(false)).toBeNull();
    expect(
      comparisonTraySecondaryHint([
        "1 trust signal differ across this comparison (Review status).",
        "Next steps differ across entries — open the interactive comparison to compare install/config copy, source links, API JSON, and LLM/MCP handoff links per resource.",
      ]),
    ).toContain("Next steps differ");
  });
});
