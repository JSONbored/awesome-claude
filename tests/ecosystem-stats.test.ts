import { describe, expect, it } from "vitest";

import type { Entry } from "../apps/web/src/types/registry";
import {
  difficultyDistribution,
  installMethodDistribution,
  installMethodOf,
  notesCoverage,
  notesCoverageByCategory,
  platformDistribution,
  tagDistribution,
} from "../apps/web/src/lib/ecosystem-stats";

function entry(partial: Partial<Entry>): Entry {
  return partial as Entry;
}

describe("installMethodOf", () => {
  it("classifies common install commands deterministically", () => {
    expect(installMethodOf("npx -y some-mcp")).toBe("npm / npx");
    expect(installMethodOf("npm install -g x")).toBe("npm / npx");
    expect(installMethodOf("pnpm add x")).toBe("pnpm");
    expect(installMethodOf("uvx some-server")).toBe("Python (pip / uv)");
    expect(installMethodOf("pip install x")).toBe("Python (pip / uv)");
    expect(installMethodOf("pipx run x")).toBe("Python (pip / uv)");
    expect(installMethodOf("docker run x")).toBe("Docker");
    expect(installMethodOf("go install x")).toBe("Go");
    expect(installMethodOf("cargo install x")).toBe("Cargo");
    expect(installMethodOf("brew install x")).toBe("Homebrew");
    expect(installMethodOf("bunx x")).toBe("bun");
  });

  it("classifies Claude-native and shell install patterns", () => {
    expect(installMethodOf("claude mcp add x https://...")).toBe(
      "Claude CLI (claude mcp add …)",
    );
    expect(installMethodOf("/agents")).toBe("Claude slash command");
    expect(installMethodOf("git clone https://github.com/x/y")).toBe(
      "Git clone",
    );
    expect(installMethodOf("curl https://example.com | sh")).toBe(
      "Shell (curl / wget)",
    );
    expect(installMethodOf("mkdir -p .claude/commands && cat > x")).toBe(
      "Manual file setup",
    );
  });

  it("returns null for no install command (config/file drop-in)", () => {
    expect(installMethodOf(undefined)).toBeNull();
    expect(installMethodOf("")).toBeNull();
    expect(installMethodOf("   ")).toBeNull();
  });

  it("buckets genuinely unrecognized commands as Other", () => {
    expect(installMethodOf("frobnicate --install x")).toBe("Other");
  });
});

describe("installMethodDistribution", () => {
  it("counts only installable entries and rows sum to the installable total", () => {
    const entries = [
      entry({ installCommand: "npx a" }),
      entry({ installCommand: "npx b" }),
      entry({ installCommand: "pip install c" }),
      entry({ installCommand: "" }), // not installable
      entry({}), // not installable
    ];
    const { rows, total } = installMethodDistribution(entries);
    expect(total).toBe(3);
    expect(rows.reduce((sum, r) => sum + r.count, 0)).toBe(total);
    expect(total).toBeLessThanOrEqual(entries.length);
    // sorted by count desc
    expect(rows[0]).toEqual({ label: "npm / npx", count: 2 });
  });
});

describe("notesCoverage", () => {
  it("bounds every count by the total and both by min(safety, privacy)", () => {
    const entries = [
      entry({ safetyNotes: "x", privacyNotes: "y" }),
      entry({ safetyNotes: "x" }),
      entry({ privacyNotes: "y" }),
      entry({}),
    ];
    const c = notesCoverage(entries);
    expect(c.total).toBe(4);
    expect(c.safety).toBe(2);
    expect(c.privacy).toBe(2);
    expect(c.both).toBe(1);
    expect(c.safety).toBeLessThanOrEqual(c.total);
    expect(c.privacy).toBeLessThanOrEqual(c.total);
    expect(c.both).toBeLessThanOrEqual(Math.min(c.safety, c.privacy));
  });
});

describe("tagDistribution", () => {
  it("counts each tag once per entry and sorts by frequency descending", () => {
    const entries = [
      entry({ tags: ["security", "ai"] }),
      entry({ tags: ["security", "review"] }),
      entry({ tags: ["ai", "review"] }),
      entry({ tags: [] }),
      entry({}),
    ];
    const { rows, uniqueTags, total } = tagDistribution(entries);
    expect(total).toBe(5);
    expect(uniqueTags).toBe(3);
    expect(rows[0]).toEqual({ label: "ai", count: 2 });
    expect(rows[0].count).toBeGreaterThanOrEqual(rows[1].count);
    const rowCounts = rows.reduce((sum, r) => sum + r.count, 0);
    // Each of the 3 unique tags appears in 2 entries
    expect(rowCounts).toBe(6);
  });

  it("normalises tags to lowercase and deduplicates within an entry", () => {
    const entries = [
      entry({ tags: ["Security", "SECURITY", "security"] }),
    ];
    const { rows, uniqueTags } = tagDistribution(entries);
    expect(uniqueTags).toBe(1);
    expect(rows).toEqual([{ label: "security", count: 1 }]);
  });

  it("respects the topN option", () => {
    const entries = [
      entry({ tags: ["a", "b", "c"] }),
      entry({ tags: ["a", "b"] }),
      entry({ tags: ["a"] }),
    ];
    const { rows } = tagDistribution(entries, { topN: 2 });
    expect(rows).toHaveLength(2);
    expect(rows[0]).toEqual({ label: "a", count: 3 });
  });

  it("returns empty rows for a catalog with no tags", () => {
    const { rows, uniqueTags, total } = tagDistribution([
      entry({}),
      entry({ tags: [] }),
    ]);
    expect(rows).toHaveLength(0);
    expect(uniqueTags).toBe(0);
    expect(total).toBe(2);
  });
});

describe("difficultyDistribution", () => {
  it("orders canonical levels beginner → intermediate → advanced, then others, then unspecified", () => {
    const entries = [
      entry({ difficulty: "advanced" }),
      entry({ difficulty: "beginner" }),
      entry({ difficulty: "intermediate" }),
      entry({ difficulty: "intermediate" }),
      entry({}),
      entry({ difficulty: "" }),
    ];
    const { rows, total } = difficultyDistribution(entries);
    expect(total).toBe(6);
    expect(rows[0].label).toBe("beginner");
    expect(rows[1].label).toBe("intermediate");
    expect(rows[2].label).toBe("advanced");
    expect(rows.at(-1)?.label).toBe("unspecified");
  });

  it("groups entries with no or empty difficulty into unspecified", () => {
    const entries = [entry({}), entry({ difficulty: "" }), entry({ difficulty: "  " })];
    const { rows } = difficultyDistribution(entries);
    expect(rows).toHaveLength(1);
    expect(rows[0]).toEqual({ label: "unspecified", count: 3 });
  });

  it("row counts sum to total", () => {
    const entries = [
      entry({ difficulty: "beginner" }),
      entry({ difficulty: "advanced" }),
      entry({}),
    ];
    const { rows, total } = difficultyDistribution(entries);
    expect(rows.reduce((s, r) => s + r.count, 0)).toBe(total);
  });
});

describe("platformDistribution", () => {
  it("counts each platform once per entry and reports entries with at least one platform", () => {
    const entries = [
      entry({ platforms: ["claude-code", "cursor"] }),
      entry({ platforms: ["claude-code"] }),
      entry({ platforms: [] }),
      entry({}),
    ];
    const { rows, total } = platformDistribution(entries);
    expect(total).toBe(2);
    expect(rows.find((r) => r.label === "claude-code")?.count).toBe(2);
    expect(rows.find((r) => r.label === "cursor")?.count).toBe(1);
  });

  it("deduplicates repeated platforms within a single entry", () => {
    const entries = [entry({ platforms: ["claude-code", "claude-code"] as never })];
    const { rows } = platformDistribution(entries);
    expect(rows.find((r) => r.label === "claude-code")?.count).toBe(1);
  });

  it("sorts by descending count then alphabetically", () => {
    const entries = [
      entry({ platforms: ["cursor", "vscode"] }),
      entry({ platforms: ["cursor"] }),
    ];
    const { rows } = platformDistribution(entries);
    expect(rows[0].label).toBe("cursor");
    expect(rows[0].count).toBe(2);
  });
});

describe("notesCoverageByCategory", () => {
  it("groups notes coverage by category and sorts by total descending", () => {
    const entries = [
      entry({ category: "mcp", safetyNotes: "x", privacyNotes: "y" }),
      entry({ category: "mcp" }),
      entry({ category: "skills", safetyNotes: "x" }),
    ];
    const rows = notesCoverageByCategory(entries);
    expect(rows[0].category).toBe("mcp");
    expect(rows[0].total).toBe(2);
    expect(rows[0].safety).toBe(1);
    expect(rows[0].privacy).toBe(1);
    expect(rows[0].both).toBe(1);
    expect(rows[1].category).toBe("skills");
    expect(rows[1].total).toBe(1);
    expect(rows[1].safety).toBe(1);
    expect(rows[1].privacy).toBe(0);
    expect(rows[1].both).toBe(0);
  });

  it("satisfies both ≤ min(safety, privacy) for every category row", () => {
    const entries = [
      entry({ category: "rules", safetyNotes: "a", privacyNotes: "b" }),
      entry({ category: "rules", safetyNotes: "a" }),
      entry({ category: "rules" }),
    ];
    const rows = notesCoverageByCategory(entries);
    for (const row of rows) {
      expect(row.both).toBeLessThanOrEqual(Math.min(row.safety, row.privacy));
      expect(row.safety).toBeLessThanOrEqual(row.total);
      expect(row.privacy).toBeLessThanOrEqual(row.total);
    }
  });
});
