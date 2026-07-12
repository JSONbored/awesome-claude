import { describe, expect, it } from "vitest";

import { parseRefs } from "../scripts/lib/indexnow-refs.mjs";

describe("parseRefs", () => {
  it("parses category/slug refs and trims surrounding whitespace", () => {
    expect(parseRefs(["agents/example", "  mcp/foo-bar  "])).toEqual([
      { category: "agents", slug: "example" },
      { category: "mcp", slug: "foo-bar" },
    ]);
  });

  it("skips blank refs and refs without a slash", () => {
    expect(parseRefs(["", "   ", "nolash"])).toEqual([]);
  });

  it("skips refs with an empty category or slug", () => {
    expect(parseRefs(["/slug", "category/"])).toEqual([]);
  });

  it("skips refs whose slug contains a nested slash", () => {
    expect(parseRefs(["category/a/b"])).toEqual([]);
  });

  it("keeps valid refs mixed in with invalid ones", () => {
    expect(parseRefs(["bad", "hooks/pre-commit", "/x", "skills/deep"])).toEqual(
      [
        { category: "hooks", slug: "pre-commit" },
        { category: "skills", slug: "deep" },
      ],
    );
  });

  it("returns an empty array for no args", () => {
    expect(parseRefs([])).toEqual([]);
  });
});
