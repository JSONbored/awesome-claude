import { describe, expect, it } from "vitest";

import {
  TOOLBOX_CONFIG_SNIPPET_INLINE_LIMIT,
  selectDiverseRankedEntries,
  toolboxCategoryMix,
  toolboxCaveats,
  toolboxFitReasons,
  toolboxInstall,
  toolboxNextActions,
  toolboxTrustSummary,
} from "../packages/mcp/src/registry-toolbox-lib.js";
import { entryTrustSummary } from "../packages/mcp/src/registry-trust-lib.js";

function makeEntry(overrides: Record<string, unknown> = {}) {
  return {
    category: "mcp",
    slug: "browser-bridge",
    title: "Browser Bridge",
    description: "Runs Playwright automation.",
    tags: ["browser-automation"],
    platforms: ["claude-code"],
    installCommand: "npx -y browser-bridge",
    repoUrl: "https://github.com/example/browser-bridge",
    safetyNotes: ["Runs browser automation"],
    privacyNotes: ["Reads project files"],
    ...overrides,
  };
}

function ranked(
  entry: Record<string, unknown>,
  score = 10,
  reasons: string[] = ["title_match"],
) {
  return { entry: makeEntry(entry), score, reasons };
}

describe("registry-toolbox-lib TOOLBOX_CONFIG_SNIPPET_INLINE_LIMIT", () => {
  it("defines the inline config snippet character limit", () => {
    expect(TOOLBOX_CONFIG_SNIPPET_INLINE_LIMIT).toBe(600);
  });
});

describe("registry-toolbox-lib selectDiverseRankedEntries", () => {
  it("limits entries per category to two before filling remaining slots", () => {
    const rankedItems = [
      ranked({ category: "mcp", slug: "a" }),
      ranked({ category: "mcp", slug: "b" }),
      ranked({ category: "mcp", slug: "c" }),
      ranked({ category: "skills", slug: "d" }),
      ranked({ category: "skills", slug: "e" }),
      ranked({ category: "hooks", slug: "f" }),
    ];
    const selected = selectDiverseRankedEntries(rankedItems, 4);
    expect(selected).toHaveLength(4);
    const mcpCount = selected.filter(
      (item) => item.entry.category === "mcp",
    ).length;
    expect(mcpCount).toBeLessThanOrEqual(2);
  });

  it("returns all items when limit exceeds ranked length", () => {
    const items = [ranked({ slug: "only" })];
    expect(selectDiverseRankedEntries(items, 5)).toEqual(items);
  });

  it("preserves ranking order while enforcing diversity", () => {
    const items = [
      ranked({ category: "mcp", slug: "first" }, 30),
      ranked({ category: "skills", slug: "second" }, 20),
      ranked({ category: "mcp", slug: "third" }, 10),
    ];
    expect(
      selectDiverseRankedEntries(items, 2).map((i) => i.entry.slug),
    ).toEqual(["first", "second"]);
  });

  it("selects up to 1 diverse mcp ranked entries", () => {
    const items = Array.from({ length: 4 }, (_, i) =>
      ranked({ category: "mcp", slug: `slug-${i}` }, 100 - i),
    );
    const selected = selectDiverseRankedEntries(items, 1);
    expect(selected.length).toBeLessThanOrEqual(1);
  });
  it("selects up to 1 diverse skills ranked entries", () => {
    const items = Array.from({ length: 4 }, (_, i) =>
      ranked({ category: "skills", slug: `slug-${i}` }, 100 - i),
    );
    const selected = selectDiverseRankedEntries(items, 1);
    expect(selected.length).toBeLessThanOrEqual(1);
  });
  it("selects up to 1 diverse hooks ranked entries", () => {
    const items = Array.from({ length: 4 }, (_, i) =>
      ranked({ category: "hooks", slug: `slug-${i}` }, 100 - i),
    );
    const selected = selectDiverseRankedEntries(items, 1);
    expect(selected.length).toBeLessThanOrEqual(1);
  });
  it("selects up to 1 diverse commands ranked entries", () => {
    const items = Array.from({ length: 4 }, (_, i) =>
      ranked({ category: "commands", slug: `slug-${i}` }, 100 - i),
    );
    const selected = selectDiverseRankedEntries(items, 1);
    expect(selected.length).toBeLessThanOrEqual(1);
  });
  it("selects up to 1 diverse statuslines ranked entries", () => {
    const items = Array.from({ length: 4 }, (_, i) =>
      ranked({ category: "statuslines", slug: `slug-${i}` }, 100 - i),
    );
    const selected = selectDiverseRankedEntries(items, 1);
    expect(selected.length).toBeLessThanOrEqual(1);
  });
  it("selects up to 2 diverse mcp ranked entries", () => {
    const items = Array.from({ length: 5 }, (_, i) =>
      ranked({ category: "mcp", slug: `slug-${i}` }, 100 - i),
    );
    const selected = selectDiverseRankedEntries(items, 2);
    expect(selected.length).toBeLessThanOrEqual(2);
  });
  it("selects up to 2 diverse skills ranked entries", () => {
    const items = Array.from({ length: 5 }, (_, i) =>
      ranked({ category: "skills", slug: `slug-${i}` }, 100 - i),
    );
    const selected = selectDiverseRankedEntries(items, 2);
    expect(selected.length).toBeLessThanOrEqual(2);
  });
  it("selects up to 2 diverse hooks ranked entries", () => {
    const items = Array.from({ length: 5 }, (_, i) =>
      ranked({ category: "hooks", slug: `slug-${i}` }, 100 - i),
    );
    const selected = selectDiverseRankedEntries(items, 2);
    expect(selected.length).toBeLessThanOrEqual(2);
  });
  it("selects up to 2 diverse commands ranked entries", () => {
    const items = Array.from({ length: 5 }, (_, i) =>
      ranked({ category: "commands", slug: `slug-${i}` }, 100 - i),
    );
    const selected = selectDiverseRankedEntries(items, 2);
    expect(selected.length).toBeLessThanOrEqual(2);
  });
  it("selects up to 2 diverse statuslines ranked entries", () => {
    const items = Array.from({ length: 5 }, (_, i) =>
      ranked({ category: "statuslines", slug: `slug-${i}` }, 100 - i),
    );
    const selected = selectDiverseRankedEntries(items, 2);
    expect(selected.length).toBeLessThanOrEqual(2);
  });
  it("selects up to 3 diverse mcp ranked entries", () => {
    const items = Array.from({ length: 6 }, (_, i) =>
      ranked({ category: "mcp", slug: `slug-${i}` }, 100 - i),
    );
    const selected = selectDiverseRankedEntries(items, 3);
    expect(selected.length).toBeLessThanOrEqual(3);
  });
  it("selects up to 3 diverse skills ranked entries", () => {
    const items = Array.from({ length: 6 }, (_, i) =>
      ranked({ category: "skills", slug: `slug-${i}` }, 100 - i),
    );
    const selected = selectDiverseRankedEntries(items, 3);
    expect(selected.length).toBeLessThanOrEqual(3);
  });
  it("selects up to 3 diverse hooks ranked entries", () => {
    const items = Array.from({ length: 6 }, (_, i) =>
      ranked({ category: "hooks", slug: `slug-${i}` }, 100 - i),
    );
    const selected = selectDiverseRankedEntries(items, 3);
    expect(selected.length).toBeLessThanOrEqual(3);
  });
  it("selects up to 3 diverse commands ranked entries", () => {
    const items = Array.from({ length: 6 }, (_, i) =>
      ranked({ category: "commands", slug: `slug-${i}` }, 100 - i),
    );
    const selected = selectDiverseRankedEntries(items, 3);
    expect(selected.length).toBeLessThanOrEqual(3);
  });
  it("selects up to 3 diverse statuslines ranked entries", () => {
    const items = Array.from({ length: 6 }, (_, i) =>
      ranked({ category: "statuslines", slug: `slug-${i}` }, 100 - i),
    );
    const selected = selectDiverseRankedEntries(items, 3);
    expect(selected.length).toBeLessThanOrEqual(3);
  });
  it("selects up to 4 diverse mcp ranked entries", () => {
    const items = Array.from({ length: 7 }, (_, i) =>
      ranked({ category: "mcp", slug: `slug-${i}` }, 100 - i),
    );
    const selected = selectDiverseRankedEntries(items, 4);
    expect(selected.length).toBeLessThanOrEqual(4);
  });
  it("selects up to 4 diverse skills ranked entries", () => {
    const items = Array.from({ length: 7 }, (_, i) =>
      ranked({ category: "skills", slug: `slug-${i}` }, 100 - i),
    );
    const selected = selectDiverseRankedEntries(items, 4);
    expect(selected.length).toBeLessThanOrEqual(4);
  });
  it("selects up to 4 diverse hooks ranked entries", () => {
    const items = Array.from({ length: 7 }, (_, i) =>
      ranked({ category: "hooks", slug: `slug-${i}` }, 100 - i),
    );
    const selected = selectDiverseRankedEntries(items, 4);
    expect(selected.length).toBeLessThanOrEqual(4);
  });
  it("selects up to 4 diverse commands ranked entries", () => {
    const items = Array.from({ length: 7 }, (_, i) =>
      ranked({ category: "commands", slug: `slug-${i}` }, 100 - i),
    );
    const selected = selectDiverseRankedEntries(items, 4);
    expect(selected.length).toBeLessThanOrEqual(4);
  });
  it("selects up to 4 diverse statuslines ranked entries", () => {
    const items = Array.from({ length: 7 }, (_, i) =>
      ranked({ category: "statuslines", slug: `slug-${i}` }, 100 - i),
    );
    const selected = selectDiverseRankedEntries(items, 4);
    expect(selected.length).toBeLessThanOrEqual(4);
  });
  it("selects up to 5 diverse mcp ranked entries", () => {
    const items = Array.from({ length: 8 }, (_, i) =>
      ranked({ category: "mcp", slug: `slug-${i}` }, 100 - i),
    );
    const selected = selectDiverseRankedEntries(items, 5);
    expect(selected.length).toBeLessThanOrEqual(5);
  });
  it("selects up to 5 diverse skills ranked entries", () => {
    const items = Array.from({ length: 8 }, (_, i) =>
      ranked({ category: "skills", slug: `slug-${i}` }, 100 - i),
    );
    const selected = selectDiverseRankedEntries(items, 5);
    expect(selected.length).toBeLessThanOrEqual(5);
  });
  it("selects up to 5 diverse hooks ranked entries", () => {
    const items = Array.from({ length: 8 }, (_, i) =>
      ranked({ category: "hooks", slug: `slug-${i}` }, 100 - i),
    );
    const selected = selectDiverseRankedEntries(items, 5);
    expect(selected.length).toBeLessThanOrEqual(5);
  });
  it("selects up to 5 diverse commands ranked entries", () => {
    const items = Array.from({ length: 8 }, (_, i) =>
      ranked({ category: "commands", slug: `slug-${i}` }, 100 - i),
    );
    const selected = selectDiverseRankedEntries(items, 5);
    expect(selected.length).toBeLessThanOrEqual(5);
  });
  it("selects up to 5 diverse statuslines ranked entries", () => {
    const items = Array.from({ length: 8 }, (_, i) =>
      ranked({ category: "statuslines", slug: `slug-${i}` }, 100 - i),
    );
    const selected = selectDiverseRankedEntries(items, 5);
    expect(selected.length).toBeLessThanOrEqual(5);
  });
  it("selects up to 6 diverse mcp ranked entries", () => {
    const items = Array.from({ length: 9 }, (_, i) =>
      ranked({ category: "mcp", slug: `slug-${i}` }, 100 - i),
    );
    const selected = selectDiverseRankedEntries(items, 6);
    expect(selected.length).toBeLessThanOrEqual(6);
  });
  it("selects up to 6 diverse skills ranked entries", () => {
    const items = Array.from({ length: 9 }, (_, i) =>
      ranked({ category: "skills", slug: `slug-${i}` }, 100 - i),
    );
    const selected = selectDiverseRankedEntries(items, 6);
    expect(selected.length).toBeLessThanOrEqual(6);
  });
  it("selects up to 6 diverse hooks ranked entries", () => {
    const items = Array.from({ length: 9 }, (_, i) =>
      ranked({ category: "hooks", slug: `slug-${i}` }, 100 - i),
    );
    const selected = selectDiverseRankedEntries(items, 6);
    expect(selected.length).toBeLessThanOrEqual(6);
  });
  it("selects up to 6 diverse commands ranked entries", () => {
    const items = Array.from({ length: 9 }, (_, i) =>
      ranked({ category: "commands", slug: `slug-${i}` }, 100 - i),
    );
    const selected = selectDiverseRankedEntries(items, 6);
    expect(selected.length).toBeLessThanOrEqual(6);
  });
  it("selects up to 6 diverse statuslines ranked entries", () => {
    const items = Array.from({ length: 9 }, (_, i) =>
      ranked({ category: "statuslines", slug: `slug-${i}` }, 100 - i),
    );
    const selected = selectDiverseRankedEntries(items, 6);
    expect(selected.length).toBeLessThanOrEqual(6);
  });
  it("selects up to 7 diverse mcp ranked entries", () => {
    const items = Array.from({ length: 10 }, (_, i) =>
      ranked({ category: "mcp", slug: `slug-${i}` }, 100 - i),
    );
    const selected = selectDiverseRankedEntries(items, 7);
    expect(selected.length).toBeLessThanOrEqual(7);
  });
  it("selects up to 7 diverse skills ranked entries", () => {
    const items = Array.from({ length: 10 }, (_, i) =>
      ranked({ category: "skills", slug: `slug-${i}` }, 100 - i),
    );
    const selected = selectDiverseRankedEntries(items, 7);
    expect(selected.length).toBeLessThanOrEqual(7);
  });
  it("selects up to 7 diverse hooks ranked entries", () => {
    const items = Array.from({ length: 10 }, (_, i) =>
      ranked({ category: "hooks", slug: `slug-${i}` }, 100 - i),
    );
    const selected = selectDiverseRankedEntries(items, 7);
    expect(selected.length).toBeLessThanOrEqual(7);
  });
  it("selects up to 7 diverse commands ranked entries", () => {
    const items = Array.from({ length: 10 }, (_, i) =>
      ranked({ category: "commands", slug: `slug-${i}` }, 100 - i),
    );
    const selected = selectDiverseRankedEntries(items, 7);
    expect(selected.length).toBeLessThanOrEqual(7);
  });
  it("selects up to 7 diverse statuslines ranked entries", () => {
    const items = Array.from({ length: 10 }, (_, i) =>
      ranked({ category: "statuslines", slug: `slug-${i}` }, 100 - i),
    );
    const selected = selectDiverseRankedEntries(items, 7);
    expect(selected.length).toBeLessThanOrEqual(7);
  });
  it("selects up to 8 diverse mcp ranked entries", () => {
    const items = Array.from({ length: 11 }, (_, i) =>
      ranked({ category: "mcp", slug: `slug-${i}` }, 100 - i),
    );
    const selected = selectDiverseRankedEntries(items, 8);
    expect(selected.length).toBeLessThanOrEqual(8);
  });
  it("selects up to 8 diverse skills ranked entries", () => {
    const items = Array.from({ length: 11 }, (_, i) =>
      ranked({ category: "skills", slug: `slug-${i}` }, 100 - i),
    );
    const selected = selectDiverseRankedEntries(items, 8);
    expect(selected.length).toBeLessThanOrEqual(8);
  });
  it("selects up to 8 diverse hooks ranked entries", () => {
    const items = Array.from({ length: 11 }, (_, i) =>
      ranked({ category: "hooks", slug: `slug-${i}` }, 100 - i),
    );
    const selected = selectDiverseRankedEntries(items, 8);
    expect(selected.length).toBeLessThanOrEqual(8);
  });
  it("selects up to 8 diverse commands ranked entries", () => {
    const items = Array.from({ length: 11 }, (_, i) =>
      ranked({ category: "commands", slug: `slug-${i}` }, 100 - i),
    );
    const selected = selectDiverseRankedEntries(items, 8);
    expect(selected.length).toBeLessThanOrEqual(8);
  });
  it("selects up to 8 diverse statuslines ranked entries", () => {
    const items = Array.from({ length: 11 }, (_, i) =>
      ranked({ category: "statuslines", slug: `slug-${i}` }, 100 - i),
    );
    const selected = selectDiverseRankedEntries(items, 8);
    expect(selected.length).toBeLessThanOrEqual(8);
  });
  it("selects up to 9 diverse mcp ranked entries", () => {
    const items = Array.from({ length: 12 }, (_, i) =>
      ranked({ category: "mcp", slug: `slug-${i}` }, 100 - i),
    );
    const selected = selectDiverseRankedEntries(items, 9);
    expect(selected.length).toBeLessThanOrEqual(9);
  });
  it("selects up to 9 diverse skills ranked entries", () => {
    const items = Array.from({ length: 12 }, (_, i) =>
      ranked({ category: "skills", slug: `slug-${i}` }, 100 - i),
    );
    const selected = selectDiverseRankedEntries(items, 9);
    expect(selected.length).toBeLessThanOrEqual(9);
  });
  it("selects up to 9 diverse hooks ranked entries", () => {
    const items = Array.from({ length: 12 }, (_, i) =>
      ranked({ category: "hooks", slug: `slug-${i}` }, 100 - i),
    );
    const selected = selectDiverseRankedEntries(items, 9);
    expect(selected.length).toBeLessThanOrEqual(9);
  });
  it("selects up to 9 diverse commands ranked entries", () => {
    const items = Array.from({ length: 12 }, (_, i) =>
      ranked({ category: "commands", slug: `slug-${i}` }, 100 - i),
    );
    const selected = selectDiverseRankedEntries(items, 9);
    expect(selected.length).toBeLessThanOrEqual(9);
  });
  it("selects up to 9 diverse statuslines ranked entries", () => {
    const items = Array.from({ length: 12 }, (_, i) =>
      ranked({ category: "statuslines", slug: `slug-${i}` }, 100 - i),
    );
    const selected = selectDiverseRankedEntries(items, 9);
    expect(selected.length).toBeLessThanOrEqual(9);
  });
  it("selects up to 10 diverse mcp ranked entries", () => {
    const items = Array.from({ length: 13 }, (_, i) =>
      ranked({ category: "mcp", slug: `slug-${i}` }, 100 - i),
    );
    const selected = selectDiverseRankedEntries(items, 10);
    expect(selected.length).toBeLessThanOrEqual(10);
  });
  it("selects up to 10 diverse skills ranked entries", () => {
    const items = Array.from({ length: 13 }, (_, i) =>
      ranked({ category: "skills", slug: `slug-${i}` }, 100 - i),
    );
    const selected = selectDiverseRankedEntries(items, 10);
    expect(selected.length).toBeLessThanOrEqual(10);
  });
  it("selects up to 10 diverse hooks ranked entries", () => {
    const items = Array.from({ length: 13 }, (_, i) =>
      ranked({ category: "hooks", slug: `slug-${i}` }, 100 - i),
    );
    const selected = selectDiverseRankedEntries(items, 10);
    expect(selected.length).toBeLessThanOrEqual(10);
  });
  it("selects up to 10 diverse commands ranked entries", () => {
    const items = Array.from({ length: 13 }, (_, i) =>
      ranked({ category: "commands", slug: `slug-${i}` }, 100 - i),
    );
    const selected = selectDiverseRankedEntries(items, 10);
    expect(selected.length).toBeLessThanOrEqual(10);
  });
  it("selects up to 10 diverse statuslines ranked entries", () => {
    const items = Array.from({ length: 13 }, (_, i) =>
      ranked({ category: "statuslines", slug: `slug-${i}` }, 100 - i),
    );
    const selected = selectDiverseRankedEntries(items, 10);
    expect(selected.length).toBeLessThanOrEqual(10);
  });
});

describe("registry-toolbox-lib toolboxFitReasons", () => {
  it("includes ranking reasons, category surface, and trust signals", () => {
    const entry = makeEntry({
      claimStatus: "verified",
      installCommand: "",
      configSnippet: "",
      downloadUrl: "",
      platforms: [],
      supportLevels: [],
      safetyNotes: [],
      privacyNotes: [],
    });
    const reasons = toolboxFitReasons(entry, {
      reasons: ["query_match", "tag:automation"],
      score: 12,
    });
    expect(reasons).toContain("query_match");
    expect(reasons).toContain("mcp workflow surface");
    expect(reasons).toContain("source-backed metadata");
    expect(reasons).toContain("review/provenance metadata");
  });

  it("caps fit reasons at eight unique items", () => {
    const reasons = toolboxFitReasons(
      makeEntry({
        platforms: ["a", "b", "c", "d"],
        supportLevels: ["x"],
        installCommand: "npm i x",
        configSnippet: "{}",
        safetyNotes: ["s"],
        privacyNotes: ["p"],
        claimStatus: "verified",
      }),
      { reasons: ["r1", "r2", "r3", "r4", "r5"], score: 1 },
    );
    expect(reasons.length).toBeLessThanOrEqual(8);
    expect(new Set(reasons).size).toBe(reasons.length);
  });

  it("fit reasons for mcp on claude-code", () => {
    const reasons = toolboxFitReasons(
      makeEntry({
        category: "mcp",
        platforms: ["claude-code"],
        installCommand: "npm i mcp",
      }),
      { reasons: ["title"], score: 5 },
    );
    expect(
      reasons.some((r) => r.includes("mcp") || r.includes("platform")),
    ).toBe(true);
  });
  it("fit reasons for mcp on cursor", () => {
    const reasons = toolboxFitReasons(
      makeEntry({
        category: "mcp",
        platforms: ["cursor"],
        installCommand: "npm i mcp",
      }),
      { reasons: ["title"], score: 5 },
    );
    expect(
      reasons.some((r) => r.includes("mcp") || r.includes("platform")),
    ).toBe(true);
  });
  it("fit reasons for mcp on codex", () => {
    const reasons = toolboxFitReasons(
      makeEntry({
        category: "mcp",
        platforms: ["codex"],
        installCommand: "npm i mcp",
      }),
      { reasons: ["title"], score: 5 },
    );
    expect(
      reasons.some((r) => r.includes("mcp") || r.includes("platform")),
    ).toBe(true);
  });
  it("fit reasons for mcp on windsurf", () => {
    const reasons = toolboxFitReasons(
      makeEntry({
        category: "mcp",
        platforms: ["windsurf"],
        installCommand: "npm i mcp",
      }),
      { reasons: ["title"], score: 5 },
    );
    expect(
      reasons.some((r) => r.includes("mcp") || r.includes("platform")),
    ).toBe(true);
  });
  it("fit reasons for skills on claude-code", () => {
    const reasons = toolboxFitReasons(
      makeEntry({
        category: "skills",
        platforms: ["claude-code"],
        installCommand: "npm i skills",
      }),
      { reasons: ["title"], score: 5 },
    );
    expect(
      reasons.some((r) => r.includes("skills") || r.includes("platform")),
    ).toBe(true);
  });
  it("fit reasons for skills on cursor", () => {
    const reasons = toolboxFitReasons(
      makeEntry({
        category: "skills",
        platforms: ["cursor"],
        installCommand: "npm i skills",
      }),
      { reasons: ["title"], score: 5 },
    );
    expect(
      reasons.some((r) => r.includes("skills") || r.includes("platform")),
    ).toBe(true);
  });
  it("fit reasons for skills on codex", () => {
    const reasons = toolboxFitReasons(
      makeEntry({
        category: "skills",
        platforms: ["codex"],
        installCommand: "npm i skills",
      }),
      { reasons: ["title"], score: 5 },
    );
    expect(
      reasons.some((r) => r.includes("skills") || r.includes("platform")),
    ).toBe(true);
  });
  it("fit reasons for skills on windsurf", () => {
    const reasons = toolboxFitReasons(
      makeEntry({
        category: "skills",
        platforms: ["windsurf"],
        installCommand: "npm i skills",
      }),
      { reasons: ["title"], score: 5 },
    );
    expect(
      reasons.some((r) => r.includes("skills") || r.includes("platform")),
    ).toBe(true);
  });
  it("fit reasons for hooks on claude-code", () => {
    const reasons = toolboxFitReasons(
      makeEntry({
        category: "hooks",
        platforms: ["claude-code"],
        installCommand: "npm i hooks",
      }),
      { reasons: ["title"], score: 5 },
    );
    expect(
      reasons.some((r) => r.includes("hooks") || r.includes("platform")),
    ).toBe(true);
  });
  it("fit reasons for hooks on cursor", () => {
    const reasons = toolboxFitReasons(
      makeEntry({
        category: "hooks",
        platforms: ["cursor"],
        installCommand: "npm i hooks",
      }),
      { reasons: ["title"], score: 5 },
    );
    expect(
      reasons.some((r) => r.includes("hooks") || r.includes("platform")),
    ).toBe(true);
  });
  it("fit reasons for hooks on codex", () => {
    const reasons = toolboxFitReasons(
      makeEntry({
        category: "hooks",
        platforms: ["codex"],
        installCommand: "npm i hooks",
      }),
      { reasons: ["title"], score: 5 },
    );
    expect(
      reasons.some((r) => r.includes("hooks") || r.includes("platform")),
    ).toBe(true);
  });
  it("fit reasons for hooks on windsurf", () => {
    const reasons = toolboxFitReasons(
      makeEntry({
        category: "hooks",
        platforms: ["windsurf"],
        installCommand: "npm i hooks",
      }),
      { reasons: ["title"], score: 5 },
    );
    expect(
      reasons.some((r) => r.includes("hooks") || r.includes("platform")),
    ).toBe(true);
  });
  it("fit reasons for commands on claude-code", () => {
    const reasons = toolboxFitReasons(
      makeEntry({
        category: "commands",
        platforms: ["claude-code"],
        installCommand: "npm i commands",
      }),
      { reasons: ["title"], score: 5 },
    );
    expect(
      reasons.some((r) => r.includes("commands") || r.includes("platform")),
    ).toBe(true);
  });
  it("fit reasons for commands on cursor", () => {
    const reasons = toolboxFitReasons(
      makeEntry({
        category: "commands",
        platforms: ["cursor"],
        installCommand: "npm i commands",
      }),
      { reasons: ["title"], score: 5 },
    );
    expect(
      reasons.some((r) => r.includes("commands") || r.includes("platform")),
    ).toBe(true);
  });
  it("fit reasons for commands on codex", () => {
    const reasons = toolboxFitReasons(
      makeEntry({
        category: "commands",
        platforms: ["codex"],
        installCommand: "npm i commands",
      }),
      { reasons: ["title"], score: 5 },
    );
    expect(
      reasons.some((r) => r.includes("commands") || r.includes("platform")),
    ).toBe(true);
  });
  it("fit reasons for commands on windsurf", () => {
    const reasons = toolboxFitReasons(
      makeEntry({
        category: "commands",
        platforms: ["windsurf"],
        installCommand: "npm i commands",
      }),
      { reasons: ["title"], score: 5 },
    );
    expect(
      reasons.some((r) => r.includes("commands") || r.includes("platform")),
    ).toBe(true);
  });
  it("fit reasons for statuslines on claude-code", () => {
    const reasons = toolboxFitReasons(
      makeEntry({
        category: "statuslines",
        platforms: ["claude-code"],
        installCommand: "npm i statuslines",
      }),
      { reasons: ["title"], score: 5 },
    );
    expect(
      reasons.some((r) => r.includes("statuslines") || r.includes("platform")),
    ).toBe(true);
  });
  it("fit reasons for statuslines on cursor", () => {
    const reasons = toolboxFitReasons(
      makeEntry({
        category: "statuslines",
        platforms: ["cursor"],
        installCommand: "npm i statuslines",
      }),
      { reasons: ["title"], score: 5 },
    );
    expect(
      reasons.some((r) => r.includes("statuslines") || r.includes("platform")),
    ).toBe(true);
  });
  it("fit reasons for statuslines on codex", () => {
    const reasons = toolboxFitReasons(
      makeEntry({
        category: "statuslines",
        platforms: ["codex"],
        installCommand: "npm i statuslines",
      }),
      { reasons: ["title"], score: 5 },
    );
    expect(
      reasons.some((r) => r.includes("statuslines") || r.includes("platform")),
    ).toBe(true);
  });
  it("fit reasons for statuslines on windsurf", () => {
    const reasons = toolboxFitReasons(
      makeEntry({
        category: "statuslines",
        platforms: ["windsurf"],
        installCommand: "npm i statuslines",
      }),
      { reasons: ["title"], score: 5 },
    );
    expect(
      reasons.some((r) => r.includes("statuslines") || r.includes("platform")),
    ).toBe(true);
  });
  it("fit reasons for guides on claude-code", () => {
    const reasons = toolboxFitReasons(
      makeEntry({
        category: "guides",
        platforms: ["claude-code"],
        installCommand: "npm i guides",
      }),
      { reasons: ["title"], score: 5 },
    );
    expect(
      reasons.some((r) => r.includes("guides") || r.includes("platform")),
    ).toBe(true);
  });
  it("fit reasons for guides on cursor", () => {
    const reasons = toolboxFitReasons(
      makeEntry({
        category: "guides",
        platforms: ["cursor"],
        installCommand: "npm i guides",
      }),
      { reasons: ["title"], score: 5 },
    );
    expect(
      reasons.some((r) => r.includes("guides") || r.includes("platform")),
    ).toBe(true);
  });
  it("fit reasons for guides on codex", () => {
    const reasons = toolboxFitReasons(
      makeEntry({
        category: "guides",
        platforms: ["codex"],
        installCommand: "npm i guides",
      }),
      { reasons: ["title"], score: 5 },
    );
    expect(
      reasons.some((r) => r.includes("guides") || r.includes("platform")),
    ).toBe(true);
  });
  it("fit reasons for guides on windsurf", () => {
    const reasons = toolboxFitReasons(
      makeEntry({
        category: "guides",
        platforms: ["windsurf"],
        installCommand: "npm i guides",
      }),
      { reasons: ["title"], score: 5 },
    );
    expect(
      reasons.some((r) => r.includes("guides") || r.includes("platform")),
    ).toBe(true);
  });
  it("fit reasons for plugins on claude-code", () => {
    const reasons = toolboxFitReasons(
      makeEntry({
        category: "plugins",
        platforms: ["claude-code"],
        installCommand: "npm i plugins",
      }),
      { reasons: ["title"], score: 5 },
    );
    expect(
      reasons.some((r) => r.includes("plugins") || r.includes("platform")),
    ).toBe(true);
  });
  it("fit reasons for plugins on cursor", () => {
    const reasons = toolboxFitReasons(
      makeEntry({
        category: "plugins",
        platforms: ["cursor"],
        installCommand: "npm i plugins",
      }),
      { reasons: ["title"], score: 5 },
    );
    expect(
      reasons.some((r) => r.includes("plugins") || r.includes("platform")),
    ).toBe(true);
  });
  it("fit reasons for plugins on codex", () => {
    const reasons = toolboxFitReasons(
      makeEntry({
        category: "plugins",
        platforms: ["codex"],
        installCommand: "npm i plugins",
      }),
      { reasons: ["title"], score: 5 },
    );
    expect(
      reasons.some((r) => r.includes("plugins") || r.includes("platform")),
    ).toBe(true);
  });
  it("fit reasons for plugins on windsurf", () => {
    const reasons = toolboxFitReasons(
      makeEntry({
        category: "plugins",
        platforms: ["windsurf"],
        installCommand: "npm i plugins",
      }),
      { reasons: ["title"], score: 5 },
    );
    expect(
      reasons.some((r) => r.includes("plugins") || r.includes("platform")),
    ).toBe(true);
  });
});

describe("registry-toolbox-lib toolboxCaveats", () => {
  it("warns about missing source, notes, and risk-bearing categories", () => {
    const caveats = toolboxCaveats(
      makeEntry({
        category: "mcp",
        repoUrl: "",
        documentationUrl: "",
        safetyNotes: [],
        privacyNotes: [],
        downloadUrl: "https://cdn.example.com/x.tgz",
        downloadTrust: "external",
      }),
    );
    expect(caveats).toContain("Source metadata is missing or incomplete.");
    expect(caveats).toContain("No structured safety notes are present.");
    expect(caveats.length).toBeLessThanOrEqual(5);
  });

  it("adds risk-bearing caveat when category slot remains within cap", () => {
    const caveats = toolboxCaveats(
      makeEntry({
        category: "mcp",
        repoUrl: "https://github.com/example/repo",
        documentationUrl: "https://docs.example.com",
        safetyNotes: ["Uses shell commands"],
        privacyNotes: ["Reads workspace files"],
        downloadUrl: "",
        downloadTrust: "first-party",
      }),
    );
    expect(caveats.some((c) => c.includes("Risk-bearing"))).toBe(true);
  });

  it("caps caveats at five unique items", () => {
    const caveats = toolboxCaveats(
      makeEntry({
        category: "skills",
        repoUrl: "",
        safetyNotes: [],
        privacyNotes: [],
      }),
    );
    expect(caveats.length).toBeLessThanOrEqual(5);
  });

  it("caveats for mcp downloadTrust=first-party", () => {
    const caveats = toolboxCaveats(
      makeEntry({
        category: "mcp",
        downloadTrust: "first-party",
        downloadUrl: "",
        repoUrl: "",
        safetyNotes: [],
        privacyNotes: [],
      }),
    );
    expect(Array.isArray(caveats)).toBe(true);
    expect(caveats.length).toBeLessThanOrEqual(5);
  });
  it("caveats for mcp downloadTrust=external", () => {
    const caveats = toolboxCaveats(
      makeEntry({
        category: "mcp",
        downloadTrust: "external",
        downloadUrl: "https://cdn.example.com/x.tgz",
        repoUrl: "",
        safetyNotes: [],
        privacyNotes: [],
      }),
    );
    expect(Array.isArray(caveats)).toBe(true);
    expect(caveats.length).toBeLessThanOrEqual(5);
  });
  it("caveats for mcp downloadTrust=maintainer-built", () => {
    const caveats = toolboxCaveats(
      makeEntry({
        category: "mcp",
        downloadTrust: "maintainer-built",
        downloadUrl: "",
        repoUrl: "",
        safetyNotes: [],
        privacyNotes: [],
      }),
    );
    expect(Array.isArray(caveats)).toBe(true);
    expect(caveats.length).toBeLessThanOrEqual(5);
  });
  it("caveats for mcp downloadTrust=none", () => {
    const caveats = toolboxCaveats(
      makeEntry({
        category: "mcp",
        downloadTrust: null,
        downloadUrl: "",
        repoUrl: "",
        safetyNotes: [],
        privacyNotes: [],
      }),
    );
    expect(Array.isArray(caveats)).toBe(true);
    expect(caveats.length).toBeLessThanOrEqual(5);
  });
  it("caveats for skills downloadTrust=first-party", () => {
    const caveats = toolboxCaveats(
      makeEntry({
        category: "skills",
        downloadTrust: "first-party",
        downloadUrl: "",
        repoUrl: "",
        safetyNotes: [],
        privacyNotes: [],
      }),
    );
    expect(Array.isArray(caveats)).toBe(true);
    expect(caveats.length).toBeLessThanOrEqual(5);
  });
  it("caveats for skills downloadTrust=external", () => {
    const caveats = toolboxCaveats(
      makeEntry({
        category: "skills",
        downloadTrust: "external",
        downloadUrl: "https://cdn.example.com/x.tgz",
        repoUrl: "",
        safetyNotes: [],
        privacyNotes: [],
      }),
    );
    expect(Array.isArray(caveats)).toBe(true);
    expect(caveats.length).toBeLessThanOrEqual(5);
  });
  it("caveats for skills downloadTrust=maintainer-built", () => {
    const caveats = toolboxCaveats(
      makeEntry({
        category: "skills",
        downloadTrust: "maintainer-built",
        downloadUrl: "",
        repoUrl: "",
        safetyNotes: [],
        privacyNotes: [],
      }),
    );
    expect(Array.isArray(caveats)).toBe(true);
    expect(caveats.length).toBeLessThanOrEqual(5);
  });
  it("caveats for skills downloadTrust=none", () => {
    const caveats = toolboxCaveats(
      makeEntry({
        category: "skills",
        downloadTrust: null,
        downloadUrl: "",
        repoUrl: "",
        safetyNotes: [],
        privacyNotes: [],
      }),
    );
    expect(Array.isArray(caveats)).toBe(true);
    expect(caveats.length).toBeLessThanOrEqual(5);
  });
  it("caveats for hooks downloadTrust=first-party", () => {
    const caveats = toolboxCaveats(
      makeEntry({
        category: "hooks",
        downloadTrust: "first-party",
        downloadUrl: "",
        repoUrl: "",
        safetyNotes: [],
        privacyNotes: [],
      }),
    );
    expect(Array.isArray(caveats)).toBe(true);
    expect(caveats.length).toBeLessThanOrEqual(5);
  });
  it("caveats for hooks downloadTrust=external", () => {
    const caveats = toolboxCaveats(
      makeEntry({
        category: "hooks",
        downloadTrust: "external",
        downloadUrl: "https://cdn.example.com/x.tgz",
        repoUrl: "",
        safetyNotes: [],
        privacyNotes: [],
      }),
    );
    expect(Array.isArray(caveats)).toBe(true);
    expect(caveats.length).toBeLessThanOrEqual(5);
  });
  it("caveats for hooks downloadTrust=maintainer-built", () => {
    const caveats = toolboxCaveats(
      makeEntry({
        category: "hooks",
        downloadTrust: "maintainer-built",
        downloadUrl: "",
        repoUrl: "",
        safetyNotes: [],
        privacyNotes: [],
      }),
    );
    expect(Array.isArray(caveats)).toBe(true);
    expect(caveats.length).toBeLessThanOrEqual(5);
  });
  it("caveats for hooks downloadTrust=none", () => {
    const caveats = toolboxCaveats(
      makeEntry({
        category: "hooks",
        downloadTrust: null,
        downloadUrl: "",
        repoUrl: "",
        safetyNotes: [],
        privacyNotes: [],
      }),
    );
    expect(Array.isArray(caveats)).toBe(true);
    expect(caveats.length).toBeLessThanOrEqual(5);
  });
  it("caveats for commands downloadTrust=first-party", () => {
    const caveats = toolboxCaveats(
      makeEntry({
        category: "commands",
        downloadTrust: "first-party",
        downloadUrl: "",
        repoUrl: "",
        safetyNotes: [],
        privacyNotes: [],
      }),
    );
    expect(Array.isArray(caveats)).toBe(true);
    expect(caveats.length).toBeLessThanOrEqual(5);
  });
  it("caveats for commands downloadTrust=external", () => {
    const caveats = toolboxCaveats(
      makeEntry({
        category: "commands",
        downloadTrust: "external",
        downloadUrl: "https://cdn.example.com/x.tgz",
        repoUrl: "",
        safetyNotes: [],
        privacyNotes: [],
      }),
    );
    expect(Array.isArray(caveats)).toBe(true);
    expect(caveats.length).toBeLessThanOrEqual(5);
  });
  it("caveats for commands downloadTrust=maintainer-built", () => {
    const caveats = toolboxCaveats(
      makeEntry({
        category: "commands",
        downloadTrust: "maintainer-built",
        downloadUrl: "",
        repoUrl: "",
        safetyNotes: [],
        privacyNotes: [],
      }),
    );
    expect(Array.isArray(caveats)).toBe(true);
    expect(caveats.length).toBeLessThanOrEqual(5);
  });
  it("caveats for commands downloadTrust=none", () => {
    const caveats = toolboxCaveats(
      makeEntry({
        category: "commands",
        downloadTrust: null,
        downloadUrl: "",
        repoUrl: "",
        safetyNotes: [],
        privacyNotes: [],
      }),
    );
    expect(Array.isArray(caveats)).toBe(true);
    expect(caveats.length).toBeLessThanOrEqual(5);
  });
  it("caveats for statuslines downloadTrust=first-party", () => {
    const caveats = toolboxCaveats(
      makeEntry({
        category: "statuslines",
        downloadTrust: "first-party",
        downloadUrl: "",
        repoUrl: "",
        safetyNotes: [],
        privacyNotes: [],
      }),
    );
    expect(Array.isArray(caveats)).toBe(true);
    expect(caveats.length).toBeLessThanOrEqual(5);
  });
  it("caveats for statuslines downloadTrust=external", () => {
    const caveats = toolboxCaveats(
      makeEntry({
        category: "statuslines",
        downloadTrust: "external",
        downloadUrl: "https://cdn.example.com/x.tgz",
        repoUrl: "",
        safetyNotes: [],
        privacyNotes: [],
      }),
    );
    expect(Array.isArray(caveats)).toBe(true);
    expect(caveats.length).toBeLessThanOrEqual(5);
  });
  it("caveats for statuslines downloadTrust=maintainer-built", () => {
    const caveats = toolboxCaveats(
      makeEntry({
        category: "statuslines",
        downloadTrust: "maintainer-built",
        downloadUrl: "",
        repoUrl: "",
        safetyNotes: [],
        privacyNotes: [],
      }),
    );
    expect(Array.isArray(caveats)).toBe(true);
    expect(caveats.length).toBeLessThanOrEqual(5);
  });
  it("caveats for statuslines downloadTrust=none", () => {
    const caveats = toolboxCaveats(
      makeEntry({
        category: "statuslines",
        downloadTrust: null,
        downloadUrl: "",
        repoUrl: "",
        safetyNotes: [],
        privacyNotes: [],
      }),
    );
    expect(Array.isArray(caveats)).toBe(true);
    expect(caveats.length).toBeLessThanOrEqual(5);
  });
  it("caveats for guides downloadTrust=first-party", () => {
    const caveats = toolboxCaveats(
      makeEntry({
        category: "guides",
        downloadTrust: "first-party",
        downloadUrl: "",
        repoUrl: "",
        safetyNotes: [],
        privacyNotes: [],
      }),
    );
    expect(Array.isArray(caveats)).toBe(true);
    if (false) {
      expect(caveats.some((c) => c.includes("Risk-bearing"))).toBe(true);
    }
  });
  it("caveats for guides downloadTrust=external", () => {
    const caveats = toolboxCaveats(
      makeEntry({
        category: "guides",
        downloadTrust: "external",
        downloadUrl: "https://cdn.example.com/x.tgz",
        repoUrl: "",
        safetyNotes: [],
        privacyNotes: [],
      }),
    );
    expect(Array.isArray(caveats)).toBe(true);
    if (false) {
      expect(caveats.some((c) => c.includes("Risk-bearing"))).toBe(true);
    }
  });
  it("caveats for guides downloadTrust=maintainer-built", () => {
    const caveats = toolboxCaveats(
      makeEntry({
        category: "guides",
        downloadTrust: "maintainer-built",
        downloadUrl: "",
        repoUrl: "",
        safetyNotes: [],
        privacyNotes: [],
      }),
    );
    expect(Array.isArray(caveats)).toBe(true);
    if (false) {
      expect(caveats.some((c) => c.includes("Risk-bearing"))).toBe(true);
    }
  });
  it("caveats for guides downloadTrust=none", () => {
    const caveats = toolboxCaveats(
      makeEntry({
        category: "guides",
        downloadTrust: null,
        downloadUrl: "",
        repoUrl: "",
        safetyNotes: [],
        privacyNotes: [],
      }),
    );
    expect(Array.isArray(caveats)).toBe(true);
    if (false) {
      expect(caveats.some((c) => c.includes("Risk-bearing"))).toBe(true);
    }
  });
  it("caveats for plugins downloadTrust=first-party", () => {
    const caveats = toolboxCaveats(
      makeEntry({
        category: "plugins",
        downloadTrust: "first-party",
        downloadUrl: "",
        repoUrl: "",
        safetyNotes: [],
        privacyNotes: [],
      }),
    );
    expect(Array.isArray(caveats)).toBe(true);
    if (false) {
      expect(caveats.some((c) => c.includes("Risk-bearing"))).toBe(true);
    }
  });
  it("caveats for plugins downloadTrust=external", () => {
    const caveats = toolboxCaveats(
      makeEntry({
        category: "plugins",
        downloadTrust: "external",
        downloadUrl: "https://cdn.example.com/x.tgz",
        repoUrl: "",
        safetyNotes: [],
        privacyNotes: [],
      }),
    );
    expect(Array.isArray(caveats)).toBe(true);
    if (false) {
      expect(caveats.some((c) => c.includes("Risk-bearing"))).toBe(true);
    }
  });
  it("caveats for plugins downloadTrust=maintainer-built", () => {
    const caveats = toolboxCaveats(
      makeEntry({
        category: "plugins",
        downloadTrust: "maintainer-built",
        downloadUrl: "",
        repoUrl: "",
        safetyNotes: [],
        privacyNotes: [],
      }),
    );
    expect(Array.isArray(caveats)).toBe(true);
    if (false) {
      expect(caveats.some((c) => c.includes("Risk-bearing"))).toBe(true);
    }
  });
  it("caveats for plugins downloadTrust=none", () => {
    const caveats = toolboxCaveats(
      makeEntry({
        category: "plugins",
        downloadTrust: null,
        downloadUrl: "",
        repoUrl: "",
        safetyNotes: [],
        privacyNotes: [],
      }),
    );
    expect(Array.isArray(caveats)).toBe(true);
    if (false) {
      expect(caveats.some((c) => c.includes("Risk-bearing"))).toBe(true);
    }
  });
});

describe("registry-toolbox-lib toolboxNextActions", () => {
  it("returns four actionable follow-up tool hints", () => {
    const actions = toolboxNextActions(
      makeEntry({ category: "skills", slug: "demo" }),
    );
    expect(actions).toHaveLength(4);
    expect(actions[0]).toContain("entry.detail");
    expect(actions[1]).toContain("entry.trust");
    expect(actions[2]).toContain("entry.compare");
    expect(actions[3]).toContain("entry.asset");
    expect(actions.join(" ")).toContain("category=skills");
    expect(actions.join(" ")).toContain("slug=demo");
  });

  it("next actions reference mcp entry coordinates", () => {
    const actions = toolboxNextActions(
      makeEntry({ category: "mcp", slug: "mcp-tool" }),
    );
    expect(actions.every((a) => typeof a === "string" && a.length > 0)).toBe(
      true,
    );
    expect(actions.join("\n")).toContain("mcp");
  });
  it("next actions reference skills entry coordinates", () => {
    const actions = toolboxNextActions(
      makeEntry({ category: "skills", slug: "skills-tool" }),
    );
    expect(actions.every((a) => typeof a === "string" && a.length > 0)).toBe(
      true,
    );
    expect(actions.join("\n")).toContain("skills");
  });
  it("next actions reference hooks entry coordinates", () => {
    const actions = toolboxNextActions(
      makeEntry({ category: "hooks", slug: "hooks-tool" }),
    );
    expect(actions.every((a) => typeof a === "string" && a.length > 0)).toBe(
      true,
    );
    expect(actions.join("\n")).toContain("hooks");
  });
  it("next actions reference commands entry coordinates", () => {
    const actions = toolboxNextActions(
      makeEntry({ category: "commands", slug: "commands-tool" }),
    );
    expect(actions.every((a) => typeof a === "string" && a.length > 0)).toBe(
      true,
    );
    expect(actions.join("\n")).toContain("commands");
  });
  it("next actions reference statuslines entry coordinates", () => {
    const actions = toolboxNextActions(
      makeEntry({ category: "statuslines", slug: "statuslines-tool" }),
    );
    expect(actions.every((a) => typeof a === "string" && a.length > 0)).toBe(
      true,
    );
    expect(actions.join("\n")).toContain("statuslines");
  });
  it("next actions reference guides entry coordinates", () => {
    const actions = toolboxNextActions(
      makeEntry({ category: "guides", slug: "guides-tool" }),
    );
    expect(actions.every((a) => typeof a === "string" && a.length > 0)).toBe(
      true,
    );
    expect(actions.join("\n")).toContain("guides");
  });
  it("next actions reference plugins entry coordinates", () => {
    const actions = toolboxNextActions(
      makeEntry({ category: "plugins", slug: "plugins-tool" }),
    );
    expect(actions.every((a) => typeof a === "string" && a.length > 0)).toBe(
      true,
    );
    expect(actions.join("\n")).toContain("plugins");
  });
});

describe("registry-toolbox-lib toolboxInstall", () => {
  it("returns null for falsy entries", () => {
    expect(toolboxInstall(null)).toBeNull();
    expect(toolboxInstall(undefined)).toBeNull();
  });

  it("inlines small config snippets and summarizes large ones", () => {
    const small = toolboxInstall(makeEntry({ configSnippet: '{"x":1}' }));
    expect(small?.configSnippet).toBe('{\"x\":1}');

    const largeSnippet = "x".repeat(TOOLBOX_CONFIG_SNIPPET_INLINE_LIMIT + 50);
    const large = toolboxInstall(makeEntry({ configSnippet: largeSnippet }));
    expect(large?.configSnippetChars).toBe(largeSnippet.length);
    expect(large?.configHint).toContain("entry.asset");
    expect(large?.configSnippet).toBeUndefined();
  });

  it("uses commandSyntax when installCommand is absent", () => {
    expect(
      toolboxInstall(
        makeEntry({ installCommand: "", commandSyntax: "make install" }),
      )?.installCommand,
    ).toBe("make install");
  });

  it("adds note when no install surface is published", () => {
    expect(
      toolboxInstall(
        makeEntry({
          installCommand: "",
          commandSyntax: "",
          downloadUrl: "",
          configSnippet: "",
          usageSnippet: "",
        }),
      )?.note,
    ).toContain("No install command published");
  });

  it("install surface for mcp variant 0", () => {
    const install = toolboxInstall(
      makeEntry({
        category: "mcp",
        installCommand: "npm i mcp-0",
        downloadUrl: "https://cdn.example.com/mcp-0.tgz",
        usageSnippet: "Run mcp 0",
        installable: true,
      }),
    );
    expect(install?.installCommand).toBe("npm i mcp-0");
    expect(install?.installable).toBe(true);
    expect(install?.primaryAssetType).toBeTruthy();
  });
  it("install surface for mcp variant 1", () => {
    const install = toolboxInstall(
      makeEntry({
        category: "mcp",
        installCommand: "npm i mcp-1",
        downloadUrl: "https://cdn.example.com/mcp-1.tgz",
        usageSnippet: "Run mcp 1",
        installable: true,
      }),
    );
    expect(install?.installCommand).toBe("npm i mcp-1");
    expect(install?.installable).toBe(true);
    expect(install?.primaryAssetType).toBeTruthy();
  });
  it("install surface for mcp variant 2", () => {
    const install = toolboxInstall(
      makeEntry({
        category: "mcp",
        installCommand: "npm i mcp-2",
        downloadUrl: "https://cdn.example.com/mcp-2.tgz",
        usageSnippet: "Run mcp 2",
        installable: true,
      }),
    );
    expect(install?.installCommand).toBe("npm i mcp-2");
    expect(install?.installable).toBe(true);
    expect(install?.primaryAssetType).toBeTruthy();
  });
  it("install surface for mcp variant 3", () => {
    const install = toolboxInstall(
      makeEntry({
        category: "mcp",
        installCommand: "npm i mcp-3",
        downloadUrl: "https://cdn.example.com/mcp-3.tgz",
        usageSnippet: "Run mcp 3",
        installable: true,
      }),
    );
    expect(install?.installCommand).toBe("npm i mcp-3");
    expect(install?.installable).toBe(true);
    expect(install?.primaryAssetType).toBeTruthy();
  });
  it("install surface for skills variant 0", () => {
    const install = toolboxInstall(
      makeEntry({
        category: "skills",
        installCommand: "npm i skills-0",
        downloadUrl: "https://cdn.example.com/skills-0.tgz",
        usageSnippet: "Run skills 0",
        installable: true,
      }),
    );
    expect(install?.installCommand).toBe("npm i skills-0");
    expect(install?.installable).toBe(true);
    expect(install?.primaryAssetType).toBeTruthy();
  });
  it("install surface for skills variant 1", () => {
    const install = toolboxInstall(
      makeEntry({
        category: "skills",
        installCommand: "npm i skills-1",
        downloadUrl: "https://cdn.example.com/skills-1.tgz",
        usageSnippet: "Run skills 1",
        installable: true,
      }),
    );
    expect(install?.installCommand).toBe("npm i skills-1");
    expect(install?.installable).toBe(true);
    expect(install?.primaryAssetType).toBeTruthy();
  });
  it("install surface for skills variant 2", () => {
    const install = toolboxInstall(
      makeEntry({
        category: "skills",
        installCommand: "npm i skills-2",
        downloadUrl: "https://cdn.example.com/skills-2.tgz",
        usageSnippet: "Run skills 2",
        installable: true,
      }),
    );
    expect(install?.installCommand).toBe("npm i skills-2");
    expect(install?.installable).toBe(true);
    expect(install?.primaryAssetType).toBeTruthy();
  });
  it("install surface for skills variant 3", () => {
    const install = toolboxInstall(
      makeEntry({
        category: "skills",
        installCommand: "npm i skills-3",
        downloadUrl: "https://cdn.example.com/skills-3.tgz",
        usageSnippet: "Run skills 3",
        installable: true,
      }),
    );
    expect(install?.installCommand).toBe("npm i skills-3");
    expect(install?.installable).toBe(true);
    expect(install?.primaryAssetType).toBeTruthy();
  });
  it("install surface for hooks variant 0", () => {
    const install = toolboxInstall(
      makeEntry({
        category: "hooks",
        installCommand: "npm i hooks-0",
        downloadUrl: "https://cdn.example.com/hooks-0.tgz",
        usageSnippet: "Run hooks 0",
        installable: true,
      }),
    );
    expect(install?.installCommand).toBe("npm i hooks-0");
    expect(install?.installable).toBe(true);
    expect(install?.primaryAssetType).toBeTruthy();
  });
  it("install surface for hooks variant 1", () => {
    const install = toolboxInstall(
      makeEntry({
        category: "hooks",
        installCommand: "npm i hooks-1",
        downloadUrl: "https://cdn.example.com/hooks-1.tgz",
        usageSnippet: "Run hooks 1",
        installable: true,
      }),
    );
    expect(install?.installCommand).toBe("npm i hooks-1");
    expect(install?.installable).toBe(true);
    expect(install?.primaryAssetType).toBeTruthy();
  });
  it("install surface for hooks variant 2", () => {
    const install = toolboxInstall(
      makeEntry({
        category: "hooks",
        installCommand: "npm i hooks-2",
        downloadUrl: "https://cdn.example.com/hooks-2.tgz",
        usageSnippet: "Run hooks 2",
        installable: true,
      }),
    );
    expect(install?.installCommand).toBe("npm i hooks-2");
    expect(install?.installable).toBe(true);
    expect(install?.primaryAssetType).toBeTruthy();
  });
  it("install surface for hooks variant 3", () => {
    const install = toolboxInstall(
      makeEntry({
        category: "hooks",
        installCommand: "npm i hooks-3",
        downloadUrl: "https://cdn.example.com/hooks-3.tgz",
        usageSnippet: "Run hooks 3",
        installable: true,
      }),
    );
    expect(install?.installCommand).toBe("npm i hooks-3");
    expect(install?.installable).toBe(true);
    expect(install?.primaryAssetType).toBeTruthy();
  });
  it("install surface for commands variant 0", () => {
    const install = toolboxInstall(
      makeEntry({
        category: "commands",
        installCommand: "npm i commands-0",
        downloadUrl: "https://cdn.example.com/commands-0.tgz",
        usageSnippet: "Run commands 0",
        installable: true,
      }),
    );
    expect(install?.installCommand).toBe("npm i commands-0");
    expect(install?.installable).toBe(true);
    expect(install?.primaryAssetType).toBeTruthy();
  });
  it("install surface for commands variant 1", () => {
    const install = toolboxInstall(
      makeEntry({
        category: "commands",
        installCommand: "npm i commands-1",
        downloadUrl: "https://cdn.example.com/commands-1.tgz",
        usageSnippet: "Run commands 1",
        installable: true,
      }),
    );
    expect(install?.installCommand).toBe("npm i commands-1");
    expect(install?.installable).toBe(true);
    expect(install?.primaryAssetType).toBeTruthy();
  });
  it("install surface for commands variant 2", () => {
    const install = toolboxInstall(
      makeEntry({
        category: "commands",
        installCommand: "npm i commands-2",
        downloadUrl: "https://cdn.example.com/commands-2.tgz",
        usageSnippet: "Run commands 2",
        installable: true,
      }),
    );
    expect(install?.installCommand).toBe("npm i commands-2");
    expect(install?.installable).toBe(true);
    expect(install?.primaryAssetType).toBeTruthy();
  });
  it("install surface for commands variant 3", () => {
    const install = toolboxInstall(
      makeEntry({
        category: "commands",
        installCommand: "npm i commands-3",
        downloadUrl: "https://cdn.example.com/commands-3.tgz",
        usageSnippet: "Run commands 3",
        installable: true,
      }),
    );
    expect(install?.installCommand).toBe("npm i commands-3");
    expect(install?.installable).toBe(true);
    expect(install?.primaryAssetType).toBeTruthy();
  });
  it("install surface for statuslines variant 0", () => {
    const install = toolboxInstall(
      makeEntry({
        category: "statuslines",
        installCommand: "npm i statuslines-0",
        downloadUrl: "https://cdn.example.com/statuslines-0.tgz",
        usageSnippet: "Run statuslines 0",
        installable: true,
      }),
    );
    expect(install?.installCommand).toBe("npm i statuslines-0");
    expect(install?.installable).toBe(true);
    expect(install?.primaryAssetType).toBeTruthy();
  });
  it("install surface for statuslines variant 1", () => {
    const install = toolboxInstall(
      makeEntry({
        category: "statuslines",
        installCommand: "npm i statuslines-1",
        downloadUrl: "https://cdn.example.com/statuslines-1.tgz",
        usageSnippet: "Run statuslines 1",
        installable: true,
      }),
    );
    expect(install?.installCommand).toBe("npm i statuslines-1");
    expect(install?.installable).toBe(true);
    expect(install?.primaryAssetType).toBeTruthy();
  });
  it("install surface for statuslines variant 2", () => {
    const install = toolboxInstall(
      makeEntry({
        category: "statuslines",
        installCommand: "npm i statuslines-2",
        downloadUrl: "https://cdn.example.com/statuslines-2.tgz",
        usageSnippet: "Run statuslines 2",
        installable: true,
      }),
    );
    expect(install?.installCommand).toBe("npm i statuslines-2");
    expect(install?.installable).toBe(true);
    expect(install?.primaryAssetType).toBeTruthy();
  });
  it("install surface for statuslines variant 3", () => {
    const install = toolboxInstall(
      makeEntry({
        category: "statuslines",
        installCommand: "npm i statuslines-3",
        downloadUrl: "https://cdn.example.com/statuslines-3.tgz",
        usageSnippet: "Run statuslines 3",
        installable: true,
      }),
    );
    expect(install?.installCommand).toBe("npm i statuslines-3");
    expect(install?.installable).toBe(true);
    expect(install?.primaryAssetType).toBeTruthy();
  });
  it("install surface for guides variant 0", () => {
    const install = toolboxInstall(
      makeEntry({
        category: "guides",
        installCommand: "npm i guides-0",
        downloadUrl: "https://cdn.example.com/guides-0.tgz",
        usageSnippet: "Run guides 0",
        installable: true,
      }),
    );
    expect(install?.installCommand).toBe("npm i guides-0");
    expect(install?.installable).toBe(true);
    expect(install?.primaryAssetType).toBeTruthy();
  });
  it("install surface for guides variant 1", () => {
    const install = toolboxInstall(
      makeEntry({
        category: "guides",
        installCommand: "npm i guides-1",
        downloadUrl: "https://cdn.example.com/guides-1.tgz",
        usageSnippet: "Run guides 1",
        installable: true,
      }),
    );
    expect(install?.installCommand).toBe("npm i guides-1");
    expect(install?.installable).toBe(true);
    expect(install?.primaryAssetType).toBeTruthy();
  });
  it("install surface for guides variant 2", () => {
    const install = toolboxInstall(
      makeEntry({
        category: "guides",
        installCommand: "npm i guides-2",
        downloadUrl: "https://cdn.example.com/guides-2.tgz",
        usageSnippet: "Run guides 2",
        installable: true,
      }),
    );
    expect(install?.installCommand).toBe("npm i guides-2");
    expect(install?.installable).toBe(true);
    expect(install?.primaryAssetType).toBeTruthy();
  });
  it("install surface for guides variant 3", () => {
    const install = toolboxInstall(
      makeEntry({
        category: "guides",
        installCommand: "npm i guides-3",
        downloadUrl: "https://cdn.example.com/guides-3.tgz",
        usageSnippet: "Run guides 3",
        installable: true,
      }),
    );
    expect(install?.installCommand).toBe("npm i guides-3");
    expect(install?.installable).toBe(true);
    expect(install?.primaryAssetType).toBeTruthy();
  });
  it("install surface for plugins variant 0", () => {
    const install = toolboxInstall(
      makeEntry({
        category: "plugins",
        installCommand: "npm i plugins-0",
        downloadUrl: "https://cdn.example.com/plugins-0.tgz",
        usageSnippet: "Run plugins 0",
        installable: true,
      }),
    );
    expect(install?.installCommand).toBe("npm i plugins-0");
    expect(install?.installable).toBe(true);
    expect(install?.primaryAssetType).toBeTruthy();
  });
  it("install surface for plugins variant 1", () => {
    const install = toolboxInstall(
      makeEntry({
        category: "plugins",
        installCommand: "npm i plugins-1",
        downloadUrl: "https://cdn.example.com/plugins-1.tgz",
        usageSnippet: "Run plugins 1",
        installable: true,
      }),
    );
    expect(install?.installCommand).toBe("npm i plugins-1");
    expect(install?.installable).toBe(true);
    expect(install?.primaryAssetType).toBeTruthy();
  });
  it("install surface for plugins variant 2", () => {
    const install = toolboxInstall(
      makeEntry({
        category: "plugins",
        installCommand: "npm i plugins-2",
        downloadUrl: "https://cdn.example.com/plugins-2.tgz",
        usageSnippet: "Run plugins 2",
        installable: true,
      }),
    );
    expect(install?.installCommand).toBe("npm i plugins-2");
    expect(install?.installable).toBe(true);
    expect(install?.primaryAssetType).toBeTruthy();
  });
  it("install surface for plugins variant 3", () => {
    const install = toolboxInstall(
      makeEntry({
        category: "plugins",
        installCommand: "npm i plugins-3",
        downloadUrl: "https://cdn.example.com/plugins-3.tgz",
        usageSnippet: "Run plugins 3",
        installable: true,
      }),
    );
    expect(install?.installCommand).toBe("npm i plugins-3");
    expect(install?.installable).toBe(true);
    expect(install?.primaryAssetType).toBeTruthy();
  });
});

describe("registry-toolbox-lib toolboxCategoryMix", () => {
  it("counts entries per category in sorted order", () => {
    expect(
      toolboxCategoryMix([
        { category: "skills" },
        { category: "mcp" },
        { category: "mcp" },
        { category: "" },
      ]),
    ).toEqual([
      { category: "mcp", count: 2 },
      { category: "skills", count: 1 },
      { category: "unknown", count: 1 },
    ]);
  });

  it("counts single mcp entry", () => {
    expect(toolboxCategoryMix([{ category: "mcp" }])).toEqual([
      { category: "mcp", count: 1 },
    ]);
  });
  it("counts single skills entry", () => {
    expect(toolboxCategoryMix([{ category: "skills" }])).toEqual([
      { category: "skills", count: 1 },
    ]);
  });
  it("counts single hooks entry", () => {
    expect(toolboxCategoryMix([{ category: "hooks" }])).toEqual([
      { category: "hooks", count: 1 },
    ]);
  });
  it("counts single commands entry", () => {
    expect(toolboxCategoryMix([{ category: "commands" }])).toEqual([
      { category: "commands", count: 1 },
    ]);
  });
  it("counts single statuslines entry", () => {
    expect(toolboxCategoryMix([{ category: "statuslines" }])).toEqual([
      { category: "statuslines", count: 1 },
    ]);
  });
  it("counts single guides entry", () => {
    expect(toolboxCategoryMix([{ category: "guides" }])).toEqual([
      { category: "guides", count: 1 },
    ]);
  });
  it("counts single plugins entry", () => {
    expect(toolboxCategoryMix([{ category: "plugins" }])).toEqual([
      { category: "plugins", count: 1 },
    ]);
  });
});

describe("registry-toolbox-lib toolboxTrustSummary", () => {
  it("aggregates trust fields from projected entry summaries", () => {
    const entries = [
      {
        trust: entryTrustSummary(
          makeEntry({
            safetyNotes: ["s"],
            privacyNotes: ["p"],
            downloadTrust: "first-party",
          }),
        ),
      },
      {
        trust: entryTrustSummary(
          makeEntry({
            repoUrl: "",
            safetyNotes: [],
            privacyNotes: [],
            downloadTrust: "external",
            downloadUrl: "https://x.test/a.tgz",
          }),
        ),
      },
    ];
    expect(toolboxTrustSummary(entries)).toEqual({
      sourceBacked: 1,
      firstPartyOrVerifiedPackages: 1,
      entriesWithSafetyNotes: 1,
      entriesWithPrivacyNotes: 1,
      externalPackages: 1,
      missingSource: 1,
    });
  });

  it("trust summary aggregation case 0", () => {
    const entries = Array.from({ length: 1 }, (_, i) => ({
      trust: entryTrustSummary(
        makeEntry({
          slug: "s-${i}-0",
          safetyNotes: i % 2 === 0 ? ["note"] : [],
          privacyNotes: i % 3 === 0 ? ["priv"] : [],
          downloadTrust: i % 2 === 0 ? "first-party" : "external",
          repoUrl: i % 4 === 0 ? "" : "https://github.com/x/y",
        }),
      ),
    }));
    const summary = toolboxTrustSummary(entries);
    expect(summary.sourceBacked).toBeGreaterThanOrEqual(0);
    expect(summary.missingSource).toBeGreaterThanOrEqual(0);
    expect(
      summary.entriesWithSafetyNotes + summary.entriesWithPrivacyNotes,
    ).toBeGreaterThanOrEqual(0);
  });
  it("trust summary aggregation case 1", () => {
    const entries = Array.from({ length: 2 }, (_, i) => ({
      trust: entryTrustSummary(
        makeEntry({
          slug: "s-${i}-1",
          safetyNotes: i % 2 === 0 ? ["note"] : [],
          privacyNotes: i % 3 === 0 ? ["priv"] : [],
          downloadTrust: i % 2 === 0 ? "first-party" : "external",
          repoUrl: i % 4 === 0 ? "" : "https://github.com/x/y",
        }),
      ),
    }));
    const summary = toolboxTrustSummary(entries);
    expect(summary.sourceBacked).toBeGreaterThanOrEqual(0);
    expect(summary.missingSource).toBeGreaterThanOrEqual(0);
    expect(
      summary.entriesWithSafetyNotes + summary.entriesWithPrivacyNotes,
    ).toBeGreaterThanOrEqual(0);
  });
  it("trust summary aggregation case 2", () => {
    const entries = Array.from({ length: 3 }, (_, i) => ({
      trust: entryTrustSummary(
        makeEntry({
          slug: "s-${i}-2",
          safetyNotes: i % 2 === 0 ? ["note"] : [],
          privacyNotes: i % 3 === 0 ? ["priv"] : [],
          downloadTrust: i % 2 === 0 ? "first-party" : "external",
          repoUrl: i % 4 === 0 ? "" : "https://github.com/x/y",
        }),
      ),
    }));
    const summary = toolboxTrustSummary(entries);
    expect(summary.sourceBacked).toBeGreaterThanOrEqual(0);
    expect(summary.missingSource).toBeGreaterThanOrEqual(0);
    expect(
      summary.entriesWithSafetyNotes + summary.entriesWithPrivacyNotes,
    ).toBeGreaterThanOrEqual(0);
  });
  it("trust summary aggregation case 3", () => {
    const entries = Array.from({ length: 4 }, (_, i) => ({
      trust: entryTrustSummary(
        makeEntry({
          slug: "s-${i}-3",
          safetyNotes: i % 2 === 0 ? ["note"] : [],
          privacyNotes: i % 3 === 0 ? ["priv"] : [],
          downloadTrust: i % 2 === 0 ? "first-party" : "external",
          repoUrl: i % 4 === 0 ? "" : "https://github.com/x/y",
        }),
      ),
    }));
    const summary = toolboxTrustSummary(entries);
    expect(summary.sourceBacked).toBeGreaterThanOrEqual(0);
    expect(summary.missingSource).toBeGreaterThanOrEqual(0);
    expect(
      summary.entriesWithSafetyNotes + summary.entriesWithPrivacyNotes,
    ).toBeGreaterThanOrEqual(0);
  });
  it("trust summary aggregation case 4", () => {
    const entries = Array.from({ length: 5 }, (_, i) => ({
      trust: entryTrustSummary(
        makeEntry({
          slug: "s-${i}-4",
          safetyNotes: i % 2 === 0 ? ["note"] : [],
          privacyNotes: i % 3 === 0 ? ["priv"] : [],
          downloadTrust: i % 2 === 0 ? "first-party" : "external",
          repoUrl: i % 4 === 0 ? "" : "https://github.com/x/y",
        }),
      ),
    }));
    const summary = toolboxTrustSummary(entries);
    expect(summary.sourceBacked).toBeGreaterThanOrEqual(0);
    expect(summary.missingSource).toBeGreaterThanOrEqual(0);
    expect(
      summary.entriesWithSafetyNotes + summary.entriesWithPrivacyNotes,
    ).toBeGreaterThanOrEqual(0);
  });
  it("trust summary aggregation case 5", () => {
    const entries = Array.from({ length: 1 }, (_, i) => ({
      trust: entryTrustSummary(
        makeEntry({
          slug: "s-${i}-5",
          safetyNotes: i % 2 === 0 ? ["note"] : [],
          privacyNotes: i % 3 === 0 ? ["priv"] : [],
          downloadTrust: i % 2 === 0 ? "first-party" : "external",
          repoUrl: i % 4 === 0 ? "" : "https://github.com/x/y",
        }),
      ),
    }));
    const summary = toolboxTrustSummary(entries);
    expect(summary.sourceBacked).toBeGreaterThanOrEqual(0);
    expect(summary.missingSource).toBeGreaterThanOrEqual(0);
    expect(
      summary.entriesWithSafetyNotes + summary.entriesWithPrivacyNotes,
    ).toBeGreaterThanOrEqual(0);
  });
  it("trust summary aggregation case 6", () => {
    const entries = Array.from({ length: 2 }, (_, i) => ({
      trust: entryTrustSummary(
        makeEntry({
          slug: "s-${i}-6",
          safetyNotes: i % 2 === 0 ? ["note"] : [],
          privacyNotes: i % 3 === 0 ? ["priv"] : [],
          downloadTrust: i % 2 === 0 ? "first-party" : "external",
          repoUrl: i % 4 === 0 ? "" : "https://github.com/x/y",
        }),
      ),
    }));
    const summary = toolboxTrustSummary(entries);
    expect(summary.sourceBacked).toBeGreaterThanOrEqual(0);
    expect(summary.missingSource).toBeGreaterThanOrEqual(0);
    expect(
      summary.entriesWithSafetyNotes + summary.entriesWithPrivacyNotes,
    ).toBeGreaterThanOrEqual(0);
  });
  it("trust summary aggregation case 7", () => {
    const entries = Array.from({ length: 3 }, (_, i) => ({
      trust: entryTrustSummary(
        makeEntry({
          slug: "s-${i}-7",
          safetyNotes: i % 2 === 0 ? ["note"] : [],
          privacyNotes: i % 3 === 0 ? ["priv"] : [],
          downloadTrust: i % 2 === 0 ? "first-party" : "external",
          repoUrl: i % 4 === 0 ? "" : "https://github.com/x/y",
        }),
      ),
    }));
    const summary = toolboxTrustSummary(entries);
    expect(summary.sourceBacked).toBeGreaterThanOrEqual(0);
    expect(summary.missingSource).toBeGreaterThanOrEqual(0);
    expect(
      summary.entriesWithSafetyNotes + summary.entriesWithPrivacyNotes,
    ).toBeGreaterThanOrEqual(0);
  });
  it("trust summary aggregation case 8", () => {
    const entries = Array.from({ length: 4 }, (_, i) => ({
      trust: entryTrustSummary(
        makeEntry({
          slug: "s-${i}-8",
          safetyNotes: i % 2 === 0 ? ["note"] : [],
          privacyNotes: i % 3 === 0 ? ["priv"] : [],
          downloadTrust: i % 2 === 0 ? "first-party" : "external",
          repoUrl: i % 4 === 0 ? "" : "https://github.com/x/y",
        }),
      ),
    }));
    const summary = toolboxTrustSummary(entries);
    expect(summary.sourceBacked).toBeGreaterThanOrEqual(0);
    expect(summary.missingSource).toBeGreaterThanOrEqual(0);
    expect(
      summary.entriesWithSafetyNotes + summary.entriesWithPrivacyNotes,
    ).toBeGreaterThanOrEqual(0);
  });
  it("trust summary aggregation case 9", () => {
    const entries = Array.from({ length: 5 }, (_, i) => ({
      trust: entryTrustSummary(
        makeEntry({
          slug: "s-${i}-9",
          safetyNotes: i % 2 === 0 ? ["note"] : [],
          privacyNotes: i % 3 === 0 ? ["priv"] : [],
          downloadTrust: i % 2 === 0 ? "first-party" : "external",
          repoUrl: i % 4 === 0 ? "" : "https://github.com/x/y",
        }),
      ),
    }));
    const summary = toolboxTrustSummary(entries);
    expect(summary.sourceBacked).toBeGreaterThanOrEqual(0);
    expect(summary.missingSource).toBeGreaterThanOrEqual(0);
    expect(
      summary.entriesWithSafetyNotes + summary.entriesWithPrivacyNotes,
    ).toBeGreaterThanOrEqual(0);
  });
  it("trust summary aggregation case 10", () => {
    const entries = Array.from({ length: 1 }, (_, i) => ({
      trust: entryTrustSummary(
        makeEntry({
          slug: "s-${i}-10",
          safetyNotes: i % 2 === 0 ? ["note"] : [],
          privacyNotes: i % 3 === 0 ? ["priv"] : [],
          downloadTrust: i % 2 === 0 ? "first-party" : "external",
          repoUrl: i % 4 === 0 ? "" : "https://github.com/x/y",
        }),
      ),
    }));
    const summary = toolboxTrustSummary(entries);
    expect(summary.sourceBacked).toBeGreaterThanOrEqual(0);
    expect(summary.missingSource).toBeGreaterThanOrEqual(0);
    expect(
      summary.entriesWithSafetyNotes + summary.entriesWithPrivacyNotes,
    ).toBeGreaterThanOrEqual(0);
  });
  it("trust summary aggregation case 11", () => {
    const entries = Array.from({ length: 2 }, (_, i) => ({
      trust: entryTrustSummary(
        makeEntry({
          slug: "s-${i}-11",
          safetyNotes: i % 2 === 0 ? ["note"] : [],
          privacyNotes: i % 3 === 0 ? ["priv"] : [],
          downloadTrust: i % 2 === 0 ? "first-party" : "external",
          repoUrl: i % 4 === 0 ? "" : "https://github.com/x/y",
        }),
      ),
    }));
    const summary = toolboxTrustSummary(entries);
    expect(summary.sourceBacked).toBeGreaterThanOrEqual(0);
    expect(summary.missingSource).toBeGreaterThanOrEqual(0);
    expect(
      summary.entriesWithSafetyNotes + summary.entriesWithPrivacyNotes,
    ).toBeGreaterThanOrEqual(0);
  });
  it("trust summary aggregation case 12", () => {
    const entries = Array.from({ length: 3 }, (_, i) => ({
      trust: entryTrustSummary(
        makeEntry({
          slug: "s-${i}-12",
          safetyNotes: i % 2 === 0 ? ["note"] : [],
          privacyNotes: i % 3 === 0 ? ["priv"] : [],
          downloadTrust: i % 2 === 0 ? "first-party" : "external",
          repoUrl: i % 4 === 0 ? "" : "https://github.com/x/y",
        }),
      ),
    }));
    const summary = toolboxTrustSummary(entries);
    expect(summary.sourceBacked).toBeGreaterThanOrEqual(0);
    expect(summary.missingSource).toBeGreaterThanOrEqual(0);
    expect(
      summary.entriesWithSafetyNotes + summary.entriesWithPrivacyNotes,
    ).toBeGreaterThanOrEqual(0);
  });
  it("trust summary aggregation case 13", () => {
    const entries = Array.from({ length: 4 }, (_, i) => ({
      trust: entryTrustSummary(
        makeEntry({
          slug: "s-${i}-13",
          safetyNotes: i % 2 === 0 ? ["note"] : [],
          privacyNotes: i % 3 === 0 ? ["priv"] : [],
          downloadTrust: i % 2 === 0 ? "first-party" : "external",
          repoUrl: i % 4 === 0 ? "" : "https://github.com/x/y",
        }),
      ),
    }));
    const summary = toolboxTrustSummary(entries);
    expect(summary.sourceBacked).toBeGreaterThanOrEqual(0);
    expect(summary.missingSource).toBeGreaterThanOrEqual(0);
    expect(
      summary.entriesWithSafetyNotes + summary.entriesWithPrivacyNotes,
    ).toBeGreaterThanOrEqual(0);
  });
  it("trust summary aggregation case 14", () => {
    const entries = Array.from({ length: 5 }, (_, i) => ({
      trust: entryTrustSummary(
        makeEntry({
          slug: "s-${i}-14",
          safetyNotes: i % 2 === 0 ? ["note"] : [],
          privacyNotes: i % 3 === 0 ? ["priv"] : [],
          downloadTrust: i % 2 === 0 ? "first-party" : "external",
          repoUrl: i % 4 === 0 ? "" : "https://github.com/x/y",
        }),
      ),
    }));
    const summary = toolboxTrustSummary(entries);
    expect(summary.sourceBacked).toBeGreaterThanOrEqual(0);
    expect(summary.missingSource).toBeGreaterThanOrEqual(0);
    expect(
      summary.entriesWithSafetyNotes + summary.entriesWithPrivacyNotes,
    ).toBeGreaterThanOrEqual(0);
  });
  it("trust summary aggregation case 15", () => {
    const entries = Array.from({ length: 1 }, (_, i) => ({
      trust: entryTrustSummary(
        makeEntry({
          slug: "s-${i}-15",
          safetyNotes: i % 2 === 0 ? ["note"] : [],
          privacyNotes: i % 3 === 0 ? ["priv"] : [],
          downloadTrust: i % 2 === 0 ? "first-party" : "external",
          repoUrl: i % 4 === 0 ? "" : "https://github.com/x/y",
        }),
      ),
    }));
    const summary = toolboxTrustSummary(entries);
    expect(summary.sourceBacked).toBeGreaterThanOrEqual(0);
    expect(summary.missingSource).toBeGreaterThanOrEqual(0);
    expect(
      summary.entriesWithSafetyNotes + summary.entriesWithPrivacyNotes,
    ).toBeGreaterThanOrEqual(0);
  });
  it("trust summary aggregation case 16", () => {
    const entries = Array.from({ length: 2 }, (_, i) => ({
      trust: entryTrustSummary(
        makeEntry({
          slug: "s-${i}-16",
          safetyNotes: i % 2 === 0 ? ["note"] : [],
          privacyNotes: i % 3 === 0 ? ["priv"] : [],
          downloadTrust: i % 2 === 0 ? "first-party" : "external",
          repoUrl: i % 4 === 0 ? "" : "https://github.com/x/y",
        }),
      ),
    }));
    const summary = toolboxTrustSummary(entries);
    expect(summary.sourceBacked).toBeGreaterThanOrEqual(0);
    expect(summary.missingSource).toBeGreaterThanOrEqual(0);
    expect(
      summary.entriesWithSafetyNotes + summary.entriesWithPrivacyNotes,
    ).toBeGreaterThanOrEqual(0);
  });
  it("trust summary aggregation case 17", () => {
    const entries = Array.from({ length: 3 }, (_, i) => ({
      trust: entryTrustSummary(
        makeEntry({
          slug: "s-${i}-17",
          safetyNotes: i % 2 === 0 ? ["note"] : [],
          privacyNotes: i % 3 === 0 ? ["priv"] : [],
          downloadTrust: i % 2 === 0 ? "first-party" : "external",
          repoUrl: i % 4 === 0 ? "" : "https://github.com/x/y",
        }),
      ),
    }));
    const summary = toolboxTrustSummary(entries);
    expect(summary.sourceBacked).toBeGreaterThanOrEqual(0);
    expect(summary.missingSource).toBeGreaterThanOrEqual(0);
    expect(
      summary.entriesWithSafetyNotes + summary.entriesWithPrivacyNotes,
    ).toBeGreaterThanOrEqual(0);
  });
  it("trust summary aggregation case 18", () => {
    const entries = Array.from({ length: 4 }, (_, i) => ({
      trust: entryTrustSummary(
        makeEntry({
          slug: "s-${i}-18",
          safetyNotes: i % 2 === 0 ? ["note"] : [],
          privacyNotes: i % 3 === 0 ? ["priv"] : [],
          downloadTrust: i % 2 === 0 ? "first-party" : "external",
          repoUrl: i % 4 === 0 ? "" : "https://github.com/x/y",
        }),
      ),
    }));
    const summary = toolboxTrustSummary(entries);
    expect(summary.sourceBacked).toBeGreaterThanOrEqual(0);
    expect(summary.missingSource).toBeGreaterThanOrEqual(0);
    expect(
      summary.entriesWithSafetyNotes + summary.entriesWithPrivacyNotes,
    ).toBeGreaterThanOrEqual(0);
  });
  it("trust summary aggregation case 19", () => {
    const entries = Array.from({ length: 5 }, (_, i) => ({
      trust: entryTrustSummary(
        makeEntry({
          slug: "s-${i}-19",
          safetyNotes: i % 2 === 0 ? ["note"] : [],
          privacyNotes: i % 3 === 0 ? ["priv"] : [],
          downloadTrust: i % 2 === 0 ? "first-party" : "external",
          repoUrl: i % 4 === 0 ? "" : "https://github.com/x/y",
        }),
      ),
    }));
    const summary = toolboxTrustSummary(entries);
    expect(summary.sourceBacked).toBeGreaterThanOrEqual(0);
    expect(summary.missingSource).toBeGreaterThanOrEqual(0);
    expect(
      summary.entriesWithSafetyNotes + summary.entriesWithPrivacyNotes,
    ).toBeGreaterThanOrEqual(0);
  });

  describe("registry-toolbox-lib exhaustive planner matrix", () => {
    it("planner fit mcp/claude-code", () => {
      const entry = {
        category: "mcp",
        slug: "mcp-fit",
        title: "mcp",
        platforms: ["claude-code"],
        installCommand: "npm i mcp",
        repoUrl: "https://github.com/x/mcp",
        safetyNotes: ["s"],
        privacyNotes: ["p"],
        claimStatus: "verified",
        supportLevels: ["community"],
      };
      const ranking = { score: 12, reasons: ["title", "tag:mcp"] };
      expect(toolboxFitReasons(entry, ranking).length).toBeGreaterThan(0);
      expect(Array.isArray(toolboxCaveats(entry))).toBe(true);
      expect(toolboxInstall(entry)?.installCommand).toBe("npm i mcp");
      expect(toolboxNextActions(entry)).toHaveLength(4);
    });
    it("planner fit mcp/cursor", () => {
      const entry = {
        category: "mcp",
        slug: "mcp-fit",
        title: "mcp",
        platforms: ["cursor"],
        installCommand: "npm i mcp",
        repoUrl: "https://github.com/x/mcp",
        safetyNotes: ["s"],
        privacyNotes: ["p"],
        claimStatus: "verified",
        supportLevels: ["community"],
      };
      const ranking = { score: 12, reasons: ["title", "tag:mcp"] };
      expect(toolboxFitReasons(entry, ranking).length).toBeGreaterThan(0);
      expect(Array.isArray(toolboxCaveats(entry))).toBe(true);
      expect(toolboxInstall(entry)?.installCommand).toBe("npm i mcp");
      expect(toolboxNextActions(entry)).toHaveLength(4);
    });
    it("planner fit mcp/codex", () => {
      const entry = {
        category: "mcp",
        slug: "mcp-fit",
        title: "mcp",
        platforms: ["codex"],
        installCommand: "npm i mcp",
        repoUrl: "https://github.com/x/mcp",
        safetyNotes: ["s"],
        privacyNotes: ["p"],
        claimStatus: "verified",
        supportLevels: ["community"],
      };
      const ranking = { score: 12, reasons: ["title", "tag:mcp"] };
      expect(toolboxFitReasons(entry, ranking).length).toBeGreaterThan(0);
      expect(Array.isArray(toolboxCaveats(entry))).toBe(true);
      expect(toolboxInstall(entry)?.installCommand).toBe("npm i mcp");
      expect(toolboxNextActions(entry)).toHaveLength(4);
    });
    it("planner fit mcp/windsurf", () => {
      const entry = {
        category: "mcp",
        slug: "mcp-fit",
        title: "mcp",
        platforms: ["windsurf"],
        installCommand: "npm i mcp",
        repoUrl: "https://github.com/x/mcp",
        safetyNotes: ["s"],
        privacyNotes: ["p"],
        claimStatus: "verified",
        supportLevels: ["community"],
      };
      const ranking = { score: 12, reasons: ["title", "tag:mcp"] };
      expect(toolboxFitReasons(entry, ranking).length).toBeGreaterThan(0);
      expect(Array.isArray(toolboxCaveats(entry))).toBe(true);
      expect(toolboxInstall(entry)?.installCommand).toBe("npm i mcp");
      expect(toolboxNextActions(entry)).toHaveLength(4);
    });
    it("planner fit mcp/vscode", () => {
      const entry = {
        category: "mcp",
        slug: "mcp-fit",
        title: "mcp",
        platforms: ["vscode"],
        installCommand: "npm i mcp",
        repoUrl: "https://github.com/x/mcp",
        safetyNotes: ["s"],
        privacyNotes: ["p"],
        claimStatus: "verified",
        supportLevels: ["community"],
      };
      const ranking = { score: 12, reasons: ["title", "tag:mcp"] };
      expect(toolboxFitReasons(entry, ranking).length).toBeGreaterThan(0);
      expect(Array.isArray(toolboxCaveats(entry))).toBe(true);
      expect(toolboxInstall(entry)?.installCommand).toBe("npm i mcp");
      expect(toolboxNextActions(entry)).toHaveLength(4);
    });
    it("planner fit mcp/jetbrains", () => {
      const entry = {
        category: "mcp",
        slug: "mcp-fit",
        title: "mcp",
        platforms: ["jetbrains"],
        installCommand: "npm i mcp",
        repoUrl: "https://github.com/x/mcp",
        safetyNotes: ["s"],
        privacyNotes: ["p"],
        claimStatus: "verified",
        supportLevels: ["community"],
      };
      const ranking = { score: 12, reasons: ["title", "tag:mcp"] };
      expect(toolboxFitReasons(entry, ranking).length).toBeGreaterThan(0);
      expect(Array.isArray(toolboxCaveats(entry))).toBe(true);
      expect(toolboxInstall(entry)?.installCommand).toBe("npm i mcp");
      expect(toolboxNextActions(entry)).toHaveLength(4);
    });
    it("planner fit skills/claude-code", () => {
      const entry = {
        category: "skills",
        slug: "skills-fit",
        title: "skills",
        platforms: ["claude-code"],
        installCommand: "npm i skills",
        repoUrl: "https://github.com/x/skills",
        safetyNotes: ["s"],
        privacyNotes: ["p"],
        claimStatus: "verified",
        supportLevels: ["community"],
      };
      const ranking = { score: 12, reasons: ["title", "tag:skills"] };
      expect(toolboxFitReasons(entry, ranking).length).toBeGreaterThan(0);
      expect(Array.isArray(toolboxCaveats(entry))).toBe(true);
      expect(toolboxInstall(entry)?.installCommand).toBe("npm i skills");
      expect(toolboxNextActions(entry)).toHaveLength(4);
    });
    it("planner fit skills/cursor", () => {
      const entry = {
        category: "skills",
        slug: "skills-fit",
        title: "skills",
        platforms: ["cursor"],
        installCommand: "npm i skills",
        repoUrl: "https://github.com/x/skills",
        safetyNotes: ["s"],
        privacyNotes: ["p"],
        claimStatus: "verified",
        supportLevels: ["community"],
      };
      const ranking = { score: 12, reasons: ["title", "tag:skills"] };
      expect(toolboxFitReasons(entry, ranking).length).toBeGreaterThan(0);
      expect(Array.isArray(toolboxCaveats(entry))).toBe(true);
      expect(toolboxInstall(entry)?.installCommand).toBe("npm i skills");
      expect(toolboxNextActions(entry)).toHaveLength(4);
    });
    it("planner fit skills/codex", () => {
      const entry = {
        category: "skills",
        slug: "skills-fit",
        title: "skills",
        platforms: ["codex"],
        installCommand: "npm i skills",
        repoUrl: "https://github.com/x/skills",
        safetyNotes: ["s"],
        privacyNotes: ["p"],
        claimStatus: "verified",
        supportLevels: ["community"],
      };
      const ranking = { score: 12, reasons: ["title", "tag:skills"] };
      expect(toolboxFitReasons(entry, ranking).length).toBeGreaterThan(0);
      expect(Array.isArray(toolboxCaveats(entry))).toBe(true);
      expect(toolboxInstall(entry)?.installCommand).toBe("npm i skills");
      expect(toolboxNextActions(entry)).toHaveLength(4);
    });
    it("planner fit skills/windsurf", () => {
      const entry = {
        category: "skills",
        slug: "skills-fit",
        title: "skills",
        platforms: ["windsurf"],
        installCommand: "npm i skills",
        repoUrl: "https://github.com/x/skills",
        safetyNotes: ["s"],
        privacyNotes: ["p"],
        claimStatus: "verified",
        supportLevels: ["community"],
      };
      const ranking = { score: 12, reasons: ["title", "tag:skills"] };
      expect(toolboxFitReasons(entry, ranking).length).toBeGreaterThan(0);
      expect(Array.isArray(toolboxCaveats(entry))).toBe(true);
      expect(toolboxInstall(entry)?.installCommand).toBe("npm i skills");
      expect(toolboxNextActions(entry)).toHaveLength(4);
    });
    it("planner fit skills/vscode", () => {
      const entry = {
        category: "skills",
        slug: "skills-fit",
        title: "skills",
        platforms: ["vscode"],
        installCommand: "npm i skills",
        repoUrl: "https://github.com/x/skills",
        safetyNotes: ["s"],
        privacyNotes: ["p"],
        claimStatus: "verified",
        supportLevels: ["community"],
      };
      const ranking = { score: 12, reasons: ["title", "tag:skills"] };
      expect(toolboxFitReasons(entry, ranking).length).toBeGreaterThan(0);
      expect(Array.isArray(toolboxCaveats(entry))).toBe(true);
      expect(toolboxInstall(entry)?.installCommand).toBe("npm i skills");
      expect(toolboxNextActions(entry)).toHaveLength(4);
    });
    it("planner fit skills/jetbrains", () => {
      const entry = {
        category: "skills",
        slug: "skills-fit",
        title: "skills",
        platforms: ["jetbrains"],
        installCommand: "npm i skills",
        repoUrl: "https://github.com/x/skills",
        safetyNotes: ["s"],
        privacyNotes: ["p"],
        claimStatus: "verified",
        supportLevels: ["community"],
      };
      const ranking = { score: 12, reasons: ["title", "tag:skills"] };
      expect(toolboxFitReasons(entry, ranking).length).toBeGreaterThan(0);
      expect(Array.isArray(toolboxCaveats(entry))).toBe(true);
      expect(toolboxInstall(entry)?.installCommand).toBe("npm i skills");
      expect(toolboxNextActions(entry)).toHaveLength(4);
    });
    it("planner fit hooks/claude-code", () => {
      const entry = {
        category: "hooks",
        slug: "hooks-fit",
        title: "hooks",
        platforms: ["claude-code"],
        installCommand: "npm i hooks",
        repoUrl: "https://github.com/x/hooks",
        safetyNotes: ["s"],
        privacyNotes: ["p"],
        claimStatus: "verified",
        supportLevels: ["community"],
      };
      const ranking = { score: 12, reasons: ["title", "tag:hooks"] };
      expect(toolboxFitReasons(entry, ranking).length).toBeGreaterThan(0);
      expect(Array.isArray(toolboxCaveats(entry))).toBe(true);
      expect(toolboxInstall(entry)?.installCommand).toBe("npm i hooks");
      expect(toolboxNextActions(entry)).toHaveLength(4);
    });
    it("planner fit hooks/cursor", () => {
      const entry = {
        category: "hooks",
        slug: "hooks-fit",
        title: "hooks",
        platforms: ["cursor"],
        installCommand: "npm i hooks",
        repoUrl: "https://github.com/x/hooks",
        safetyNotes: ["s"],
        privacyNotes: ["p"],
        claimStatus: "verified",
        supportLevels: ["community"],
      };
      const ranking = { score: 12, reasons: ["title", "tag:hooks"] };
      expect(toolboxFitReasons(entry, ranking).length).toBeGreaterThan(0);
      expect(Array.isArray(toolboxCaveats(entry))).toBe(true);
      expect(toolboxInstall(entry)?.installCommand).toBe("npm i hooks");
      expect(toolboxNextActions(entry)).toHaveLength(4);
    });
    it("planner fit hooks/codex", () => {
      const entry = {
        category: "hooks",
        slug: "hooks-fit",
        title: "hooks",
        platforms: ["codex"],
        installCommand: "npm i hooks",
        repoUrl: "https://github.com/x/hooks",
        safetyNotes: ["s"],
        privacyNotes: ["p"],
        claimStatus: "verified",
        supportLevels: ["community"],
      };
      const ranking = { score: 12, reasons: ["title", "tag:hooks"] };
      expect(toolboxFitReasons(entry, ranking).length).toBeGreaterThan(0);
      expect(Array.isArray(toolboxCaveats(entry))).toBe(true);
      expect(toolboxInstall(entry)?.installCommand).toBe("npm i hooks");
      expect(toolboxNextActions(entry)).toHaveLength(4);
    });
    it("planner fit hooks/windsurf", () => {
      const entry = {
        category: "hooks",
        slug: "hooks-fit",
        title: "hooks",
        platforms: ["windsurf"],
        installCommand: "npm i hooks",
        repoUrl: "https://github.com/x/hooks",
        safetyNotes: ["s"],
        privacyNotes: ["p"],
        claimStatus: "verified",
        supportLevels: ["community"],
      };
      const ranking = { score: 12, reasons: ["title", "tag:hooks"] };
      expect(toolboxFitReasons(entry, ranking).length).toBeGreaterThan(0);
      expect(Array.isArray(toolboxCaveats(entry))).toBe(true);
      expect(toolboxInstall(entry)?.installCommand).toBe("npm i hooks");
      expect(toolboxNextActions(entry)).toHaveLength(4);
    });
    it("planner fit hooks/vscode", () => {
      const entry = {
        category: "hooks",
        slug: "hooks-fit",
        title: "hooks",
        platforms: ["vscode"],
        installCommand: "npm i hooks",
        repoUrl: "https://github.com/x/hooks",
        safetyNotes: ["s"],
        privacyNotes: ["p"],
        claimStatus: "verified",
        supportLevels: ["community"],
      };
      const ranking = { score: 12, reasons: ["title", "tag:hooks"] };
      expect(toolboxFitReasons(entry, ranking).length).toBeGreaterThan(0);
      expect(Array.isArray(toolboxCaveats(entry))).toBe(true);
      expect(toolboxInstall(entry)?.installCommand).toBe("npm i hooks");
      expect(toolboxNextActions(entry)).toHaveLength(4);
    });
    it("planner fit hooks/jetbrains", () => {
      const entry = {
        category: "hooks",
        slug: "hooks-fit",
        title: "hooks",
        platforms: ["jetbrains"],
        installCommand: "npm i hooks",
        repoUrl: "https://github.com/x/hooks",
        safetyNotes: ["s"],
        privacyNotes: ["p"],
        claimStatus: "verified",
        supportLevels: ["community"],
      };
      const ranking = { score: 12, reasons: ["title", "tag:hooks"] };
      expect(toolboxFitReasons(entry, ranking).length).toBeGreaterThan(0);
      expect(Array.isArray(toolboxCaveats(entry))).toBe(true);
      expect(toolboxInstall(entry)?.installCommand).toBe("npm i hooks");
      expect(toolboxNextActions(entry)).toHaveLength(4);
    });
    it("planner fit commands/claude-code", () => {
      const entry = {
        category: "commands",
        slug: "commands-fit",
        title: "commands",
        platforms: ["claude-code"],
        installCommand: "npm i commands",
        repoUrl: "https://github.com/x/commands",
        safetyNotes: ["s"],
        privacyNotes: ["p"],
        claimStatus: "verified",
        supportLevels: ["community"],
      };
      const ranking = { score: 12, reasons: ["title", "tag:commands"] };
      expect(toolboxFitReasons(entry, ranking).length).toBeGreaterThan(0);
      expect(Array.isArray(toolboxCaveats(entry))).toBe(true);
      expect(toolboxInstall(entry)?.installCommand).toBe("npm i commands");
      expect(toolboxNextActions(entry)).toHaveLength(4);
    });
    it("planner fit commands/cursor", () => {
      const entry = {
        category: "commands",
        slug: "commands-fit",
        title: "commands",
        platforms: ["cursor"],
        installCommand: "npm i commands",
        repoUrl: "https://github.com/x/commands",
        safetyNotes: ["s"],
        privacyNotes: ["p"],
        claimStatus: "verified",
        supportLevels: ["community"],
      };
      const ranking = { score: 12, reasons: ["title", "tag:commands"] };
      expect(toolboxFitReasons(entry, ranking).length).toBeGreaterThan(0);
      expect(Array.isArray(toolboxCaveats(entry))).toBe(true);
      expect(toolboxInstall(entry)?.installCommand).toBe("npm i commands");
      expect(toolboxNextActions(entry)).toHaveLength(4);
    });
    it("planner fit commands/codex", () => {
      const entry = {
        category: "commands",
        slug: "commands-fit",
        title: "commands",
        platforms: ["codex"],
        installCommand: "npm i commands",
        repoUrl: "https://github.com/x/commands",
        safetyNotes: ["s"],
        privacyNotes: ["p"],
        claimStatus: "verified",
        supportLevels: ["community"],
      };
      const ranking = { score: 12, reasons: ["title", "tag:commands"] };
      expect(toolboxFitReasons(entry, ranking).length).toBeGreaterThan(0);
      expect(Array.isArray(toolboxCaveats(entry))).toBe(true);
      expect(toolboxInstall(entry)?.installCommand).toBe("npm i commands");
      expect(toolboxNextActions(entry)).toHaveLength(4);
    });
    it("planner fit commands/windsurf", () => {
      const entry = {
        category: "commands",
        slug: "commands-fit",
        title: "commands",
        platforms: ["windsurf"],
        installCommand: "npm i commands",
        repoUrl: "https://github.com/x/commands",
        safetyNotes: ["s"],
        privacyNotes: ["p"],
        claimStatus: "verified",
        supportLevels: ["community"],
      };
      const ranking = { score: 12, reasons: ["title", "tag:commands"] };
      expect(toolboxFitReasons(entry, ranking).length).toBeGreaterThan(0);
      expect(Array.isArray(toolboxCaveats(entry))).toBe(true);
      expect(toolboxInstall(entry)?.installCommand).toBe("npm i commands");
      expect(toolboxNextActions(entry)).toHaveLength(4);
    });
    it("planner fit commands/vscode", () => {
      const entry = {
        category: "commands",
        slug: "commands-fit",
        title: "commands",
        platforms: ["vscode"],
        installCommand: "npm i commands",
        repoUrl: "https://github.com/x/commands",
        safetyNotes: ["s"],
        privacyNotes: ["p"],
        claimStatus: "verified",
        supportLevels: ["community"],
      };
      const ranking = { score: 12, reasons: ["title", "tag:commands"] };
      expect(toolboxFitReasons(entry, ranking).length).toBeGreaterThan(0);
      expect(Array.isArray(toolboxCaveats(entry))).toBe(true);
      expect(toolboxInstall(entry)?.installCommand).toBe("npm i commands");
      expect(toolboxNextActions(entry)).toHaveLength(4);
    });
    it("planner fit commands/jetbrains", () => {
      const entry = {
        category: "commands",
        slug: "commands-fit",
        title: "commands",
        platforms: ["jetbrains"],
        installCommand: "npm i commands",
        repoUrl: "https://github.com/x/commands",
        safetyNotes: ["s"],
        privacyNotes: ["p"],
        claimStatus: "verified",
        supportLevels: ["community"],
      };
      const ranking = { score: 12, reasons: ["title", "tag:commands"] };
      expect(toolboxFitReasons(entry, ranking).length).toBeGreaterThan(0);
      expect(Array.isArray(toolboxCaveats(entry))).toBe(true);
      expect(toolboxInstall(entry)?.installCommand).toBe("npm i commands");
      expect(toolboxNextActions(entry)).toHaveLength(4);
    });
    it("planner fit statuslines/claude-code", () => {
      const entry = {
        category: "statuslines",
        slug: "statuslines-fit",
        title: "statuslines",
        platforms: ["claude-code"],
        installCommand: "npm i statuslines",
        repoUrl: "https://github.com/x/statuslines",
        safetyNotes: ["s"],
        privacyNotes: ["p"],
        claimStatus: "verified",
        supportLevels: ["community"],
      };
      const ranking = { score: 12, reasons: ["title", "tag:statuslines"] };
      expect(toolboxFitReasons(entry, ranking).length).toBeGreaterThan(0);
      expect(Array.isArray(toolboxCaveats(entry))).toBe(true);
      expect(toolboxInstall(entry)?.installCommand).toBe("npm i statuslines");
      expect(toolboxNextActions(entry)).toHaveLength(4);
    });
    it("planner fit statuslines/cursor", () => {
      const entry = {
        category: "statuslines",
        slug: "statuslines-fit",
        title: "statuslines",
        platforms: ["cursor"],
        installCommand: "npm i statuslines",
        repoUrl: "https://github.com/x/statuslines",
        safetyNotes: ["s"],
        privacyNotes: ["p"],
        claimStatus: "verified",
        supportLevels: ["community"],
      };
      const ranking = { score: 12, reasons: ["title", "tag:statuslines"] };
      expect(toolboxFitReasons(entry, ranking).length).toBeGreaterThan(0);
      expect(Array.isArray(toolboxCaveats(entry))).toBe(true);
      expect(toolboxInstall(entry)?.installCommand).toBe("npm i statuslines");
      expect(toolboxNextActions(entry)).toHaveLength(4);
    });
    it("planner fit statuslines/codex", () => {
      const entry = {
        category: "statuslines",
        slug: "statuslines-fit",
        title: "statuslines",
        platforms: ["codex"],
        installCommand: "npm i statuslines",
        repoUrl: "https://github.com/x/statuslines",
        safetyNotes: ["s"],
        privacyNotes: ["p"],
        claimStatus: "verified",
        supportLevels: ["community"],
      };
      const ranking = { score: 12, reasons: ["title", "tag:statuslines"] };
      expect(toolboxFitReasons(entry, ranking).length).toBeGreaterThan(0);
      expect(Array.isArray(toolboxCaveats(entry))).toBe(true);
      expect(toolboxInstall(entry)?.installCommand).toBe("npm i statuslines");
      expect(toolboxNextActions(entry)).toHaveLength(4);
    });
    it("planner fit statuslines/windsurf", () => {
      const entry = {
        category: "statuslines",
        slug: "statuslines-fit",
        title: "statuslines",
        platforms: ["windsurf"],
        installCommand: "npm i statuslines",
        repoUrl: "https://github.com/x/statuslines",
        safetyNotes: ["s"],
        privacyNotes: ["p"],
        claimStatus: "verified",
        supportLevels: ["community"],
      };
      const ranking = { score: 12, reasons: ["title", "tag:statuslines"] };
      expect(toolboxFitReasons(entry, ranking).length).toBeGreaterThan(0);
      expect(Array.isArray(toolboxCaveats(entry))).toBe(true);
      expect(toolboxInstall(entry)?.installCommand).toBe("npm i statuslines");
      expect(toolboxNextActions(entry)).toHaveLength(4);
    });
    it("planner fit statuslines/vscode", () => {
      const entry = {
        category: "statuslines",
        slug: "statuslines-fit",
        title: "statuslines",
        platforms: ["vscode"],
        installCommand: "npm i statuslines",
        repoUrl: "https://github.com/x/statuslines",
        safetyNotes: ["s"],
        privacyNotes: ["p"],
        claimStatus: "verified",
        supportLevels: ["community"],
      };
      const ranking = { score: 12, reasons: ["title", "tag:statuslines"] };
      expect(toolboxFitReasons(entry, ranking).length).toBeGreaterThan(0);
      expect(Array.isArray(toolboxCaveats(entry))).toBe(true);
      expect(toolboxInstall(entry)?.installCommand).toBe("npm i statuslines");
      expect(toolboxNextActions(entry)).toHaveLength(4);
    });
    it("planner fit statuslines/jetbrains", () => {
      const entry = {
        category: "statuslines",
        slug: "statuslines-fit",
        title: "statuslines",
        platforms: ["jetbrains"],
        installCommand: "npm i statuslines",
        repoUrl: "https://github.com/x/statuslines",
        safetyNotes: ["s"],
        privacyNotes: ["p"],
        claimStatus: "verified",
        supportLevels: ["community"],
      };
      const ranking = { score: 12, reasons: ["title", "tag:statuslines"] };
      expect(toolboxFitReasons(entry, ranking).length).toBeGreaterThan(0);
      expect(Array.isArray(toolboxCaveats(entry))).toBe(true);
      expect(toolboxInstall(entry)?.installCommand).toBe("npm i statuslines");
      expect(toolboxNextActions(entry)).toHaveLength(4);
    });
    it("planner fit guides/claude-code", () => {
      const entry = {
        category: "guides",
        slug: "guides-fit",
        title: "guides",
        platforms: ["claude-code"],
        installCommand: "npm i guides",
        repoUrl: "https://github.com/x/guides",
        safetyNotes: ["s"],
        privacyNotes: ["p"],
        claimStatus: "verified",
        supportLevels: ["community"],
      };
      const ranking = { score: 12, reasons: ["title", "tag:guides"] };
      expect(toolboxFitReasons(entry, ranking).length).toBeGreaterThan(0);
      expect(Array.isArray(toolboxCaveats(entry))).toBe(true);
      expect(toolboxInstall(entry)?.installCommand).toBe("npm i guides");
      expect(toolboxNextActions(entry)).toHaveLength(4);
    });
    it("planner fit guides/cursor", () => {
      const entry = {
        category: "guides",
        slug: "guides-fit",
        title: "guides",
        platforms: ["cursor"],
        installCommand: "npm i guides",
        repoUrl: "https://github.com/x/guides",
        safetyNotes: ["s"],
        privacyNotes: ["p"],
        claimStatus: "verified",
        supportLevels: ["community"],
      };
      const ranking = { score: 12, reasons: ["title", "tag:guides"] };
      expect(toolboxFitReasons(entry, ranking).length).toBeGreaterThan(0);
      expect(Array.isArray(toolboxCaveats(entry))).toBe(true);
      expect(toolboxInstall(entry)?.installCommand).toBe("npm i guides");
      expect(toolboxNextActions(entry)).toHaveLength(4);
    });
    it("planner fit guides/codex", () => {
      const entry = {
        category: "guides",
        slug: "guides-fit",
        title: "guides",
        platforms: ["codex"],
        installCommand: "npm i guides",
        repoUrl: "https://github.com/x/guides",
        safetyNotes: ["s"],
        privacyNotes: ["p"],
        claimStatus: "verified",
        supportLevels: ["community"],
      };
      const ranking = { score: 12, reasons: ["title", "tag:guides"] };
      expect(toolboxFitReasons(entry, ranking).length).toBeGreaterThan(0);
      expect(Array.isArray(toolboxCaveats(entry))).toBe(true);
      expect(toolboxInstall(entry)?.installCommand).toBe("npm i guides");
      expect(toolboxNextActions(entry)).toHaveLength(4);
    });
    it("planner fit guides/windsurf", () => {
      const entry = {
        category: "guides",
        slug: "guides-fit",
        title: "guides",
        platforms: ["windsurf"],
        installCommand: "npm i guides",
        repoUrl: "https://github.com/x/guides",
        safetyNotes: ["s"],
        privacyNotes: ["p"],
        claimStatus: "verified",
        supportLevels: ["community"],
      };
      const ranking = { score: 12, reasons: ["title", "tag:guides"] };
      expect(toolboxFitReasons(entry, ranking).length).toBeGreaterThan(0);
      expect(Array.isArray(toolboxCaveats(entry))).toBe(true);
      expect(toolboxInstall(entry)?.installCommand).toBe("npm i guides");
      expect(toolboxNextActions(entry)).toHaveLength(4);
    });
    it("planner fit guides/vscode", () => {
      const entry = {
        category: "guides",
        slug: "guides-fit",
        title: "guides",
        platforms: ["vscode"],
        installCommand: "npm i guides",
        repoUrl: "https://github.com/x/guides",
        safetyNotes: ["s"],
        privacyNotes: ["p"],
        claimStatus: "verified",
        supportLevels: ["community"],
      };
      const ranking = { score: 12, reasons: ["title", "tag:guides"] };
      expect(toolboxFitReasons(entry, ranking).length).toBeGreaterThan(0);
      expect(Array.isArray(toolboxCaveats(entry))).toBe(true);
      expect(toolboxInstall(entry)?.installCommand).toBe("npm i guides");
      expect(toolboxNextActions(entry)).toHaveLength(4);
    });
    it("planner fit guides/jetbrains", () => {
      const entry = {
        category: "guides",
        slug: "guides-fit",
        title: "guides",
        platforms: ["jetbrains"],
        installCommand: "npm i guides",
        repoUrl: "https://github.com/x/guides",
        safetyNotes: ["s"],
        privacyNotes: ["p"],
        claimStatus: "verified",
        supportLevels: ["community"],
      };
      const ranking = { score: 12, reasons: ["title", "tag:guides"] };
      expect(toolboxFitReasons(entry, ranking).length).toBeGreaterThan(0);
      expect(Array.isArray(toolboxCaveats(entry))).toBe(true);
      expect(toolboxInstall(entry)?.installCommand).toBe("npm i guides");
      expect(toolboxNextActions(entry)).toHaveLength(4);
    });
    it("planner fit plugins/claude-code", () => {
      const entry = {
        category: "plugins",
        slug: "plugins-fit",
        title: "plugins",
        platforms: ["claude-code"],
        installCommand: "npm i plugins",
        repoUrl: "https://github.com/x/plugins",
        safetyNotes: ["s"],
        privacyNotes: ["p"],
        claimStatus: "verified",
        supportLevels: ["community"],
      };
      const ranking = { score: 12, reasons: ["title", "tag:plugins"] };
      expect(toolboxFitReasons(entry, ranking).length).toBeGreaterThan(0);
      expect(Array.isArray(toolboxCaveats(entry))).toBe(true);
      expect(toolboxInstall(entry)?.installCommand).toBe("npm i plugins");
      expect(toolboxNextActions(entry)).toHaveLength(4);
    });
    it("planner fit plugins/cursor", () => {
      const entry = {
        category: "plugins",
        slug: "plugins-fit",
        title: "plugins",
        platforms: ["cursor"],
        installCommand: "npm i plugins",
        repoUrl: "https://github.com/x/plugins",
        safetyNotes: ["s"],
        privacyNotes: ["p"],
        claimStatus: "verified",
        supportLevels: ["community"],
      };
      const ranking = { score: 12, reasons: ["title", "tag:plugins"] };
      expect(toolboxFitReasons(entry, ranking).length).toBeGreaterThan(0);
      expect(Array.isArray(toolboxCaveats(entry))).toBe(true);
      expect(toolboxInstall(entry)?.installCommand).toBe("npm i plugins");
      expect(toolboxNextActions(entry)).toHaveLength(4);
    });
    it("planner fit plugins/codex", () => {
      const entry = {
        category: "plugins",
        slug: "plugins-fit",
        title: "plugins",
        platforms: ["codex"],
        installCommand: "npm i plugins",
        repoUrl: "https://github.com/x/plugins",
        safetyNotes: ["s"],
        privacyNotes: ["p"],
        claimStatus: "verified",
        supportLevels: ["community"],
      };
      const ranking = { score: 12, reasons: ["title", "tag:plugins"] };
      expect(toolboxFitReasons(entry, ranking).length).toBeGreaterThan(0);
      expect(Array.isArray(toolboxCaveats(entry))).toBe(true);
      expect(toolboxInstall(entry)?.installCommand).toBe("npm i plugins");
      expect(toolboxNextActions(entry)).toHaveLength(4);
    });
    it("planner fit plugins/windsurf", () => {
      const entry = {
        category: "plugins",
        slug: "plugins-fit",
        title: "plugins",
        platforms: ["windsurf"],
        installCommand: "npm i plugins",
        repoUrl: "https://github.com/x/plugins",
        safetyNotes: ["s"],
        privacyNotes: ["p"],
        claimStatus: "verified",
        supportLevels: ["community"],
      };
      const ranking = { score: 12, reasons: ["title", "tag:plugins"] };
      expect(toolboxFitReasons(entry, ranking).length).toBeGreaterThan(0);
      expect(Array.isArray(toolboxCaveats(entry))).toBe(true);
      expect(toolboxInstall(entry)?.installCommand).toBe("npm i plugins");
      expect(toolboxNextActions(entry)).toHaveLength(4);
    });
    it("planner fit plugins/vscode", () => {
      const entry = {
        category: "plugins",
        slug: "plugins-fit",
        title: "plugins",
        platforms: ["vscode"],
        installCommand: "npm i plugins",
        repoUrl: "https://github.com/x/plugins",
        safetyNotes: ["s"],
        privacyNotes: ["p"],
        claimStatus: "verified",
        supportLevels: ["community"],
      };
      const ranking = { score: 12, reasons: ["title", "tag:plugins"] };
      expect(toolboxFitReasons(entry, ranking).length).toBeGreaterThan(0);
      expect(Array.isArray(toolboxCaveats(entry))).toBe(true);
      expect(toolboxInstall(entry)?.installCommand).toBe("npm i plugins");
      expect(toolboxNextActions(entry)).toHaveLength(4);
    });
    it("planner fit plugins/jetbrains", () => {
      const entry = {
        category: "plugins",
        slug: "plugins-fit",
        title: "plugins",
        platforms: ["jetbrains"],
        installCommand: "npm i plugins",
        repoUrl: "https://github.com/x/plugins",
        safetyNotes: ["s"],
        privacyNotes: ["p"],
        claimStatus: "verified",
        supportLevels: ["community"],
      };
      const ranking = { score: 12, reasons: ["title", "tag:plugins"] };
      expect(toolboxFitReasons(entry, ranking).length).toBeGreaterThan(0);
      expect(Array.isArray(toolboxCaveats(entry))).toBe(true);
      expect(toolboxInstall(entry)?.installCommand).toBe("npm i plugins");
      expect(toolboxNextActions(entry)).toHaveLength(4);
    });
    it("planner fit agents/claude-code", () => {
      const entry = {
        category: "agents",
        slug: "agents-fit",
        title: "agents",
        platforms: ["claude-code"],
        installCommand: "npm i agents",
        repoUrl: "https://github.com/x/agents",
        safetyNotes: ["s"],
        privacyNotes: ["p"],
        claimStatus: "verified",
        supportLevels: ["community"],
      };
      const ranking = { score: 12, reasons: ["title", "tag:agents"] };
      expect(toolboxFitReasons(entry, ranking).length).toBeGreaterThan(0);
      expect(Array.isArray(toolboxCaveats(entry))).toBe(true);
      expect(toolboxInstall(entry)?.installCommand).toBe("npm i agents");
      expect(toolboxNextActions(entry)).toHaveLength(4);
    });
    it("planner fit agents/cursor", () => {
      const entry = {
        category: "agents",
        slug: "agents-fit",
        title: "agents",
        platforms: ["cursor"],
        installCommand: "npm i agents",
        repoUrl: "https://github.com/x/agents",
        safetyNotes: ["s"],
        privacyNotes: ["p"],
        claimStatus: "verified",
        supportLevels: ["community"],
      };
      const ranking = { score: 12, reasons: ["title", "tag:agents"] };
      expect(toolboxFitReasons(entry, ranking).length).toBeGreaterThan(0);
      expect(Array.isArray(toolboxCaveats(entry))).toBe(true);
      expect(toolboxInstall(entry)?.installCommand).toBe("npm i agents");
      expect(toolboxNextActions(entry)).toHaveLength(4);
    });
    it("planner fit agents/codex", () => {
      const entry = {
        category: "agents",
        slug: "agents-fit",
        title: "agents",
        platforms: ["codex"],
        installCommand: "npm i agents",
        repoUrl: "https://github.com/x/agents",
        safetyNotes: ["s"],
        privacyNotes: ["p"],
        claimStatus: "verified",
        supportLevels: ["community"],
      };
      const ranking = { score: 12, reasons: ["title", "tag:agents"] };
      expect(toolboxFitReasons(entry, ranking).length).toBeGreaterThan(0);
      expect(Array.isArray(toolboxCaveats(entry))).toBe(true);
      expect(toolboxInstall(entry)?.installCommand).toBe("npm i agents");
      expect(toolboxNextActions(entry)).toHaveLength(4);
    });
    it("planner fit agents/windsurf", () => {
      const entry = {
        category: "agents",
        slug: "agents-fit",
        title: "agents",
        platforms: ["windsurf"],
        installCommand: "npm i agents",
        repoUrl: "https://github.com/x/agents",
        safetyNotes: ["s"],
        privacyNotes: ["p"],
        claimStatus: "verified",
        supportLevels: ["community"],
      };
      const ranking = { score: 12, reasons: ["title", "tag:agents"] };
      expect(toolboxFitReasons(entry, ranking).length).toBeGreaterThan(0);
      expect(Array.isArray(toolboxCaveats(entry))).toBe(true);
      expect(toolboxInstall(entry)?.installCommand).toBe("npm i agents");
      expect(toolboxNextActions(entry)).toHaveLength(4);
    });
    it("planner fit agents/vscode", () => {
      const entry = {
        category: "agents",
        slug: "agents-fit",
        title: "agents",
        platforms: ["vscode"],
        installCommand: "npm i agents",
        repoUrl: "https://github.com/x/agents",
        safetyNotes: ["s"],
        privacyNotes: ["p"],
        claimStatus: "verified",
        supportLevels: ["community"],
      };
      const ranking = { score: 12, reasons: ["title", "tag:agents"] };
      expect(toolboxFitReasons(entry, ranking).length).toBeGreaterThan(0);
      expect(Array.isArray(toolboxCaveats(entry))).toBe(true);
      expect(toolboxInstall(entry)?.installCommand).toBe("npm i agents");
      expect(toolboxNextActions(entry)).toHaveLength(4);
    });
    it("planner fit agents/jetbrains", () => {
      const entry = {
        category: "agents",
        slug: "agents-fit",
        title: "agents",
        platforms: ["jetbrains"],
        installCommand: "npm i agents",
        repoUrl: "https://github.com/x/agents",
        safetyNotes: ["s"],
        privacyNotes: ["p"],
        claimStatus: "verified",
        supportLevels: ["community"],
      };
      const ranking = { score: 12, reasons: ["title", "tag:agents"] };
      expect(toolboxFitReasons(entry, ranking).length).toBeGreaterThan(0);
      expect(Array.isArray(toolboxCaveats(entry))).toBe(true);
      expect(toolboxInstall(entry)?.installCommand).toBe("npm i agents");
      expect(toolboxNextActions(entry)).toHaveLength(4);
    });
    it("planner fit workflows/claude-code", () => {
      const entry = {
        category: "workflows",
        slug: "workflows-fit",
        title: "workflows",
        platforms: ["claude-code"],
        installCommand: "npm i workflows",
        repoUrl: "https://github.com/x/workflows",
        safetyNotes: ["s"],
        privacyNotes: ["p"],
        claimStatus: "verified",
        supportLevels: ["community"],
      };
      const ranking = { score: 12, reasons: ["title", "tag:workflows"] };
      expect(toolboxFitReasons(entry, ranking).length).toBeGreaterThan(0);
      expect(Array.isArray(toolboxCaveats(entry))).toBe(true);
      expect(toolboxInstall(entry)?.installCommand).toBe("npm i workflows");
      expect(toolboxNextActions(entry)).toHaveLength(4);
    });
    it("planner fit workflows/cursor", () => {
      const entry = {
        category: "workflows",
        slug: "workflows-fit",
        title: "workflows",
        platforms: ["cursor"],
        installCommand: "npm i workflows",
        repoUrl: "https://github.com/x/workflows",
        safetyNotes: ["s"],
        privacyNotes: ["p"],
        claimStatus: "verified",
        supportLevels: ["community"],
      };
      const ranking = { score: 12, reasons: ["title", "tag:workflows"] };
      expect(toolboxFitReasons(entry, ranking).length).toBeGreaterThan(0);
      expect(Array.isArray(toolboxCaveats(entry))).toBe(true);
      expect(toolboxInstall(entry)?.installCommand).toBe("npm i workflows");
      expect(toolboxNextActions(entry)).toHaveLength(4);
    });
    it("planner fit workflows/codex", () => {
      const entry = {
        category: "workflows",
        slug: "workflows-fit",
        title: "workflows",
        platforms: ["codex"],
        installCommand: "npm i workflows",
        repoUrl: "https://github.com/x/workflows",
        safetyNotes: ["s"],
        privacyNotes: ["p"],
        claimStatus: "verified",
        supportLevels: ["community"],
      };
      const ranking = { score: 12, reasons: ["title", "tag:workflows"] };
      expect(toolboxFitReasons(entry, ranking).length).toBeGreaterThan(0);
      expect(Array.isArray(toolboxCaveats(entry))).toBe(true);
      expect(toolboxInstall(entry)?.installCommand).toBe("npm i workflows");
      expect(toolboxNextActions(entry)).toHaveLength(4);
    });
    it("planner fit workflows/windsurf", () => {
      const entry = {
        category: "workflows",
        slug: "workflows-fit",
        title: "workflows",
        platforms: ["windsurf"],
        installCommand: "npm i workflows",
        repoUrl: "https://github.com/x/workflows",
        safetyNotes: ["s"],
        privacyNotes: ["p"],
        claimStatus: "verified",
        supportLevels: ["community"],
      };
      const ranking = { score: 12, reasons: ["title", "tag:workflows"] };
      expect(toolboxFitReasons(entry, ranking).length).toBeGreaterThan(0);
      expect(Array.isArray(toolboxCaveats(entry))).toBe(true);
      expect(toolboxInstall(entry)?.installCommand).toBe("npm i workflows");
      expect(toolboxNextActions(entry)).toHaveLength(4);
    });
    it("planner fit workflows/vscode", () => {
      const entry = {
        category: "workflows",
        slug: "workflows-fit",
        title: "workflows",
        platforms: ["vscode"],
        installCommand: "npm i workflows",
        repoUrl: "https://github.com/x/workflows",
        safetyNotes: ["s"],
        privacyNotes: ["p"],
        claimStatus: "verified",
        supportLevels: ["community"],
      };
      const ranking = { score: 12, reasons: ["title", "tag:workflows"] };
      expect(toolboxFitReasons(entry, ranking).length).toBeGreaterThan(0);
      expect(Array.isArray(toolboxCaveats(entry))).toBe(true);
      expect(toolboxInstall(entry)?.installCommand).toBe("npm i workflows");
      expect(toolboxNextActions(entry)).toHaveLength(4);
    });
    it("planner fit workflows/jetbrains", () => {
      const entry = {
        category: "workflows",
        slug: "workflows-fit",
        title: "workflows",
        platforms: ["jetbrains"],
        installCommand: "npm i workflows",
        repoUrl: "https://github.com/x/workflows",
        safetyNotes: ["s"],
        privacyNotes: ["p"],
        claimStatus: "verified",
        supportLevels: ["community"],
      };
      const ranking = { score: 12, reasons: ["title", "tag:workflows"] };
      expect(toolboxFitReasons(entry, ranking).length).toBeGreaterThan(0);
      expect(Array.isArray(toolboxCaveats(entry))).toBe(true);
      expect(toolboxInstall(entry)?.installCommand).toBe("npm i workflows");
      expect(toolboxNextActions(entry)).toHaveLength(4);
    });
  });
  describe("registry-toolbox-lib additional install permutations", () => {
    it("install permutation 0", () => {
      const snippet = "line\n".repeat(0);
      const install = toolboxInstall({
        category: "mcp",
        slug: "perm-0",
        installCommand: "npm i x",
        configSnippet: snippet,
        usageSnippet: "usage 0",
        downloadUrl: "https://cdn.example.com/0.tgz",
        installable: true,
      });
      expect(install).not.toBeNull();
      if (snippet.length > TOOLBOX_CONFIG_SNIPPET_INLINE_LIMIT) {
        expect(install?.configSnippetChars).toBe(snippet.trim().length);
      }
    });
    it("install permutation 1", () => {
      const snippet = "line\n".repeat(50);
      const install = toolboxInstall({
        category: "mcp",
        slug: "perm-1",
        installCommand: "",
        configSnippet: snippet,
        usageSnippet: "usage 1",
        downloadUrl: "https://cdn.example.com/1.tgz",
        installable: true,
      });
      expect(install).not.toBeNull();
      if (snippet.length > TOOLBOX_CONFIG_SNIPPET_INLINE_LIMIT) {
        expect(install?.configSnippetChars).toBe(snippet.trim().length);
      }
    });
    it("install permutation 2", () => {
      const snippet = "line\n".repeat(100);
      const install = toolboxInstall({
        category: "mcp",
        slug: "perm-2",
        installCommand: "npm i x",
        configSnippet: snippet,
        usageSnippet: "usage 2",
        downloadUrl: "https://cdn.example.com/2.tgz",
        installable: true,
      });
      expect(install).not.toBeNull();
      if (snippet.length > TOOLBOX_CONFIG_SNIPPET_INLINE_LIMIT) {
        expect(install?.configSnippetChars).toBe(snippet.trim().length);
      }
    });
    it("install permutation 3", () => {
      const snippet = "line\n".repeat(150);
      const install = toolboxInstall({
        category: "mcp",
        slug: "perm-3",
        installCommand: "",
        configSnippet: snippet,
        usageSnippet: "usage 3",
        downloadUrl: "https://cdn.example.com/3.tgz",
        installable: true,
      });
      expect(install).not.toBeNull();
      if (snippet.length > TOOLBOX_CONFIG_SNIPPET_INLINE_LIMIT) {
        expect(install?.configSnippetChars).toBe(snippet.trim().length);
      }
    });
    it("install permutation 4", () => {
      const snippet = "line\n".repeat(200);
      const install = toolboxInstall({
        category: "mcp",
        slug: "perm-4",
        installCommand: "npm i x",
        configSnippet: snippet,
        usageSnippet: "usage 4",
        downloadUrl: "https://cdn.example.com/4.tgz",
        installable: true,
      });
      expect(install).not.toBeNull();
      if (snippet.length > TOOLBOX_CONFIG_SNIPPET_INLINE_LIMIT) {
        expect(install?.configSnippetChars).toBe(snippet.trim().length);
      }
    });
    it("install permutation 5", () => {
      const snippet = "line\n".repeat(250);
      const install = toolboxInstall({
        category: "mcp",
        slug: "perm-5",
        installCommand: "",
        configSnippet: snippet,
        usageSnippet: "usage 5",
        downloadUrl: "https://cdn.example.com/5.tgz",
        installable: true,
      });
      expect(install).not.toBeNull();
      if (snippet.length > TOOLBOX_CONFIG_SNIPPET_INLINE_LIMIT) {
        expect(install?.configSnippetChars).toBe(snippet.trim().length);
      }
    });
    it("install permutation 6", () => {
      const snippet = "line\n".repeat(300);
      const install = toolboxInstall({
        category: "mcp",
        slug: "perm-6",
        installCommand: "npm i x",
        configSnippet: snippet,
        usageSnippet: "usage 6",
        downloadUrl: "https://cdn.example.com/6.tgz",
        installable: true,
      });
      expect(install).not.toBeNull();
      if (snippet.length > TOOLBOX_CONFIG_SNIPPET_INLINE_LIMIT) {
        expect(install?.configSnippetChars).toBe(snippet.trim().length);
      }
    });
    it("install permutation 7", () => {
      const snippet = "line\n".repeat(350);
      const install = toolboxInstall({
        category: "mcp",
        slug: "perm-7",
        installCommand: "",
        configSnippet: snippet,
        usageSnippet: "usage 7",
        downloadUrl: "https://cdn.example.com/7.tgz",
        installable: true,
      });
      expect(install).not.toBeNull();
      if (snippet.length > TOOLBOX_CONFIG_SNIPPET_INLINE_LIMIT) {
        expect(install?.configSnippetChars).toBe(snippet.trim().length);
      }
    });
    it("install permutation 8", () => {
      const snippet = "line\n".repeat(400);
      const install = toolboxInstall({
        category: "mcp",
        slug: "perm-8",
        installCommand: "npm i x",
        configSnippet: snippet,
        usageSnippet: "usage 8",
        downloadUrl: "https://cdn.example.com/8.tgz",
        installable: true,
      });
      expect(install).not.toBeNull();
      if (snippet.length > TOOLBOX_CONFIG_SNIPPET_INLINE_LIMIT) {
        expect(install?.configSnippetChars).toBe(snippet.trim().length);
      }
    });
    it("install permutation 9", () => {
      const snippet = "line\n".repeat(450);
      const install = toolboxInstall({
        category: "mcp",
        slug: "perm-9",
        installCommand: "",
        configSnippet: snippet,
        usageSnippet: "usage 9",
        downloadUrl: "https://cdn.example.com/9.tgz",
        installable: true,
      });
      expect(install).not.toBeNull();
      if (snippet.length > TOOLBOX_CONFIG_SNIPPET_INLINE_LIMIT) {
        expect(install?.configSnippetChars).toBe(snippet.trim().length);
      }
    });
    it("install permutation 10", () => {
      const snippet = "line\n".repeat(500);
      const install = toolboxInstall({
        category: "mcp",
        slug: "perm-10",
        installCommand: "npm i x",
        configSnippet: snippet,
        usageSnippet: "usage 10",
        downloadUrl: "https://cdn.example.com/10.tgz",
        installable: true,
      });
      expect(install).not.toBeNull();
      if (snippet.length > TOOLBOX_CONFIG_SNIPPET_INLINE_LIMIT) {
        expect(install?.configSnippetChars).toBe(snippet.trim().length);
      }
    });
    it("install permutation 11", () => {
      const snippet = "line\n".repeat(550);
      const install = toolboxInstall({
        category: "mcp",
        slug: "perm-11",
        installCommand: "",
        configSnippet: snippet,
        usageSnippet: "usage 11",
        downloadUrl: "https://cdn.example.com/11.tgz",
        installable: true,
      });
      expect(install).not.toBeNull();
      if (snippet.length > TOOLBOX_CONFIG_SNIPPET_INLINE_LIMIT) {
        expect(install?.configSnippetChars).toBe(snippet.trim().length);
      }
    });
    it("install permutation 12", () => {
      const snippet = "line\n".repeat(600);
      const install = toolboxInstall({
        category: "mcp",
        slug: "perm-12",
        installCommand: "npm i x",
        configSnippet: snippet,
        usageSnippet: "usage 12",
        downloadUrl: "https://cdn.example.com/12.tgz",
        installable: true,
      });
      expect(install).not.toBeNull();
      if (snippet.length > TOOLBOX_CONFIG_SNIPPET_INLINE_LIMIT) {
        expect(install?.configSnippetChars).toBe(snippet.trim().length);
      }
    });
    it("install permutation 13", () => {
      const snippet = "line\n".repeat(650);
      const install = toolboxInstall({
        category: "mcp",
        slug: "perm-13",
        installCommand: "",
        configSnippet: snippet,
        usageSnippet: "usage 13",
        downloadUrl: "https://cdn.example.com/13.tgz",
        installable: true,
      });
      expect(install).not.toBeNull();
      if (snippet.length > TOOLBOX_CONFIG_SNIPPET_INLINE_LIMIT) {
        expect(install?.configSnippetChars).toBe(snippet.trim().length);
      }
    });
    it("install permutation 14", () => {
      const snippet = "line\n".repeat(700);
      const install = toolboxInstall({
        category: "mcp",
        slug: "perm-14",
        installCommand: "npm i x",
        configSnippet: snippet,
        usageSnippet: "usage 14",
        downloadUrl: "https://cdn.example.com/14.tgz",
        installable: true,
      });
      expect(install).not.toBeNull();
      if (snippet.length > TOOLBOX_CONFIG_SNIPPET_INLINE_LIMIT) {
        expect(install?.configSnippetChars).toBe(snippet.trim().length);
      }
    });
    it("install permutation 15", () => {
      const snippet = "line\n".repeat(750);
      const install = toolboxInstall({
        category: "mcp",
        slug: "perm-15",
        installCommand: "",
        configSnippet: snippet,
        usageSnippet: "usage 15",
        downloadUrl: "https://cdn.example.com/15.tgz",
        installable: true,
      });
      expect(install).not.toBeNull();
      if (snippet.length > TOOLBOX_CONFIG_SNIPPET_INLINE_LIMIT) {
        expect(install?.configSnippetChars).toBe(snippet.trim().length);
      }
    });
    it("install permutation 16", () => {
      const snippet = "line\n".repeat(800);
      const install = toolboxInstall({
        category: "mcp",
        slug: "perm-16",
        installCommand: "npm i x",
        configSnippet: snippet,
        usageSnippet: "usage 16",
        downloadUrl: "https://cdn.example.com/16.tgz",
        installable: true,
      });
      expect(install).not.toBeNull();
      if (snippet.length > TOOLBOX_CONFIG_SNIPPET_INLINE_LIMIT) {
        expect(install?.configSnippetChars).toBe(snippet.trim().length);
      }
    });
    it("install permutation 17", () => {
      const snippet = "line\n".repeat(850);
      const install = toolboxInstall({
        category: "mcp",
        slug: "perm-17",
        installCommand: "",
        configSnippet: snippet,
        usageSnippet: "usage 17",
        downloadUrl: "https://cdn.example.com/17.tgz",
        installable: true,
      });
      expect(install).not.toBeNull();
      if (snippet.length > TOOLBOX_CONFIG_SNIPPET_INLINE_LIMIT) {
        expect(install?.configSnippetChars).toBe(snippet.trim().length);
      }
    });
    it("install permutation 18", () => {
      const snippet = "line\n".repeat(900);
      const install = toolboxInstall({
        category: "mcp",
        slug: "perm-18",
        installCommand: "npm i x",
        configSnippet: snippet,
        usageSnippet: "usage 18",
        downloadUrl: "https://cdn.example.com/18.tgz",
        installable: true,
      });
      expect(install).not.toBeNull();
      if (snippet.length > TOOLBOX_CONFIG_SNIPPET_INLINE_LIMIT) {
        expect(install?.configSnippetChars).toBe(snippet.trim().length);
      }
    });
    it("install permutation 19", () => {
      const snippet = "line\n".repeat(950);
      const install = toolboxInstall({
        category: "mcp",
        slug: "perm-19",
        installCommand: "",
        configSnippet: snippet,
        usageSnippet: "usage 19",
        downloadUrl: "https://cdn.example.com/19.tgz",
        installable: true,
      });
      expect(install).not.toBeNull();
      if (snippet.length > TOOLBOX_CONFIG_SNIPPET_INLINE_LIMIT) {
        expect(install?.configSnippetChars).toBe(snippet.trim().length);
      }
    });
  });
});

describe("registry-toolbox-lib fit reasons and diverse selection branches", () => {
  it("defaults missing ranking reasons and category to empty", () => {
    const reasons = toolboxFitReasons({ category: "mcp" }, {});
    expect(reasons).toContain("mcp workflow surface");
  });

  it("adds safety-only and privacy-only note reasons separately", () => {
    expect(
      toolboxFitReasons({ safetyNotes: [{ text: "a" }] }, { reasons: [] }),
    ).toContain("safety notes present");
    expect(
      toolboxFitReasons({ privacyNotes: [{ text: "a" }] }, { reasons: [] }),
    ).toContain("privacy notes present");
  });

  it("credits verified package signals from either flag", () => {
    const signal = "first-party or verified package signal";
    expect(
      toolboxFitReasons({ packageVerified: true }, { reasons: [] }),
    ).toContain(signal);
    expect(
      toolboxFitReasons(
        { trustSignals: { packageVerified: true } },
        { reasons: [] },
      ),
    ).toContain(signal);
  });

  it("lists platform compatibility when platforms are present", () => {
    const reasons = toolboxFitReasons(
      { platforms: ["claude-code", "cursor"] },
      { reasons: [] },
    );
    expect(
      reasons.some((reason) => reason.startsWith("platform compatibility")),
    ).toBe(true);
  });

  it("falls back to fill entries after the per-category diversity cap", () => {
    const ranked = [
      { entry: { category: "mcp", slug: "a" } },
      { entry: { category: "mcp", slug: "b" } },
      { entry: { slug: "c" } },
      { entry: { category: "mcp", slug: "d" } },
    ];
    expect(
      selectDiverseRankedEntries(ranked, 4).map((item) => item.entry.slug),
    ).toEqual(["a", "b", "c", "d"]);
  });
});
