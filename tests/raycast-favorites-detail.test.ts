import { describe, expect, it } from "vitest";

// Deep-relative test imports use the `.js` specifier across this repo's suite;
// the bundler maps it to the TypeScript source.
import {
  parseFavoriteKeys,
  serializeFavoriteKeys,
  parseDetail,
} from "../integrations/raycast/src/feed.js";

describe("favorite key storage", () => {
  it("round-trips through serialize -> parse as a sorted, unique list", () => {
    expect(
      parseFavoriteKeys(serializeFavoriteKeys(["z", "a", "a", "m"])),
    ).toEqual(["a", "m", "z"]);
  });

  it("returns an empty list for blank or non-array payloads", () => {
    expect(parseFavoriteKeys("")).toEqual([]);
    expect(parseFavoriteKeys("[]")).toEqual([]);
    expect(parseFavoriteKeys('{"x":1}')).toEqual([]);
  });

  it("throws on malformed JSON (callers persist trusted storage)", () => {
    expect(() => parseFavoriteKeys("not json")).toThrow();
  });
});

describe("parseDetail", () => {
  it("parses the detail payload fields", () => {
    const detail = parseDetail(
      JSON.stringify({
        detailMarkdown: "# Heading",
        copyText: "CT",
        installable: true,
      }),
    );
    expect(detail.detailMarkdown).toBe("# Heading");
    expect(detail.copyText).toBe("CT");
    expect(detail.installable).toBe(true);
  });

  it("normalizes mcpInstallTargets to an array", () => {
    // A missing/invalid targets list becomes an empty array rather than undefined.
    const detail = parseDetail(JSON.stringify({ detailMarkdown: "x" }));
    expect(Array.isArray(detail.mcpInstallTargets)).toBe(true);
  });
});
