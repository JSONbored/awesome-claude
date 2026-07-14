import { describe, expect, it } from "vitest";

import {
  intersection,
  normalizeDateFloor,
  parsedTrustArgs,
  unique,
} from "../packages/mcp/src/registry-collection-lib.js";

describe("registry-collection-lib trust args", () => {
  it("defaults trust filter args to all", () => {
    expect(parsedTrustArgs({})).toEqual({
      hasSafetyNotes: "all",
      hasPrivacyNotes: "all",
      downloadTrust: "all",
      claimStatus: "all",
      sourceStatus: "all",
    });
    expect(
      parsedTrustArgs({
        hasSafetyNotes: "yes",
        claimStatus: "claimed",
      }),
    ).toEqual({
      hasSafetyNotes: "yes",
      hasPrivacyNotes: "all",
      downloadTrust: "all",
      claimStatus: "claimed",
      sourceStatus: "all",
    });
  });
});

describe("registry-collection-lib array helpers", () => {
  it("deduplicates and intersects normalized values", () => {
    expect(unique(["mcp", "mcp", "", "skills"])).toEqual(["mcp", "skills"]);
    expect(
      intersection(["Codex", "codex", "Cursor"], ["cursor", "vscode"]),
    ).toEqual(["cursor"]);
  });

  it("treats null array arguments as empty", () => {
    expect(intersection(null, null)).toEqual([]);
    expect(intersection(["a"], null)).toEqual([]);
    expect(intersection(null, ["a"])).toEqual([]);
  });
});

describe("registry-collection-lib date floors", () => {
  it("normalizes valid dates to YYYY-MM-DD and rejects invalid input", () => {
    expect(normalizeDateFloor("2026-03-15T12:00:00.000Z")).toBe("2026-03-15");
    expect(normalizeDateFloor("")).toBe("");
    expect(normalizeDateFloor("not-a-date")).toBe("");
  });
});
