import { describe, expect, it } from "vitest";

import type { Entry } from "../apps/web/src/types/registry";
import { scoreEntry } from "../apps/web/src/lib/quality-score-lib";

const entry = (over: Partial<Entry>) =>
  ({
    category: "agents",
    tags: ["a", "b"],
    reviewed: true,
    ...over,
  }) as Entry;

describe("scoreEntry", () => {
  it("gives a fully-populated entry a perfect score with no recommendations", () => {
    const row = scoreEntry(
      entry({
        category: "mcp",
        source: "verified",
        safetyNotes: ["be careful"],
        privacyNotes: ["local only"],
        installCommand: "npx x",
        reviewed: true,
        tags: ["a", "b"],
      }),
    );
    expect(row.score).toBe(100);
    expect(row.recommendations).toEqual([]);
  });

  it("deducts 30 for an unverified source", () => {
    const row = scoreEntry(entry({ source: "unverified" }));
    expect(row.score).toBe(70);
    expect(row.recommendations).toContain("Add a verifiable source URL.");
  });

  it("deducts safety/privacy/install only for risk-bearing categories", () => {
    const mcp = scoreEntry(entry({ category: "mcp" }));
    // -20 safety, -10 privacy, -10 install (reviewed:true, tags ok, source ok)
    expect(mcp.score).toBe(60);
    expect(mcp.recommendations).toEqual([
      "Add safety notes for this risk-bearing category.",
      "Add privacy notes covering data flow.",
      "Add an install command.",
    ]);

    // A non-risk category with the same gaps loses none of those points.
    expect(scoreEntry(entry({ category: "rules" })).score).toBe(100);
  });

  it("covers hooks (safety only) and commands (safety + install) categories", () => {
    expect(scoreEntry(entry({ category: "hooks" })).score).toBe(80); // -20 safety
    expect(scoreEntry(entry({ category: "commands" })).score).toBe(70); // -20 safety -10 install
  });

  it("deducts 10 for an unreviewed entry", () => {
    const row = scoreEntry(entry({ reviewed: false }));
    expect(row.score).toBe(90);
    expect(row.recommendations).toContain("Awaiting maintainer review.");
  });

  it("deducts 5 when there are fewer than two tags", () => {
    expect(scoreEntry(entry({ tags: ["only"] })).score).toBe(95);
    expect(scoreEntry(entry({ tags: undefined })).score).toBe(95);
  });

  it("sums every applicable deduction for a worst-case entry", () => {
    const row = scoreEntry(
      entry({
        category: "mcp",
        source: "unverified",
        reviewed: false,
        tags: [],
      }),
    );
    // 100 -30 -20 -10 -10 -10 -5 = 15 (never negative for these rules).
    expect(row.score).toBe(15);
    expect(row.recommendations).toHaveLength(6);
  });
});
