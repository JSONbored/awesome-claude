import { describe, expect, it } from "vitest";

import { joinList } from "../apps/web/src/lib/join-list-lib";

describe("joinList", () => {
  it("returns '' for an empty list and the sole item for one", () => {
    expect(joinList([])).toBe("");
    expect(joinList(["mcp"])).toBe("mcp");
  });

  it("joins two items with 'and'", () => {
    expect(joinList(["mcp", "hooks"])).toBe("mcp and hooks");
  });

  it("uses an Oxford comma for three or more", () => {
    expect(joinList(["mcp", "hooks", "skills"])).toBe("mcp, hooks, and skills");
  });
});
