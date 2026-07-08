import { describe, expect, it } from "vitest";
import type { Entry } from "@/types/registry";
import {
  comparisonTrayChipSignals,
  comparisonTrayHintMessages,
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
    });
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
});
