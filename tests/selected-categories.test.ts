import { describe, expect, it } from "vitest";

import { parseSelectedCategories } from "../scripts/lib/selected-categories.mjs";

const parse = (argv: string[]) => [...parseSelectedCategories(argv)];

describe("parseSelectedCategories", () => {
  it("is empty when no category flags are present", () => {
    expect(parse([])).toEqual([]);
    expect(parse(["--strict-recommended", "other"])).toEqual([]);
  });

  it("reads the space-separated --category and --categories flags", () => {
    expect(parse(["--category", "mcp"])).toEqual(["mcp"]);
    expect(parse(["--categories", "hooks"])).toEqual(["hooks"]);
  });

  it("reads the =-separated forms", () => {
    expect(parse(["--category=mcp"])).toEqual(["mcp"]);
    expect(parse(["--categories=hooks"])).toEqual(["hooks"]);
  });

  it("splits comma lists and trims each entry, skipping blanks", () => {
    expect(parse(["--category", " mcp , hooks ,, skills"])).toEqual([
      "mcp",
      "hooks",
      "skills",
    ]);
    expect(parse(["--category="])).toEqual([]);
    expect(parse(["--categories=agents,,skills"])).toEqual([
      "agents",
      "skills",
    ]);
  });

  it("de-duplicates across multiple flags", () => {
    expect(
      parse(["--category", "mcp", "--categories=hooks", "--category=mcp"]),
    ).toEqual(["mcp", "hooks"]);
  });

  it("treats a --category with no following value as empty", () => {
    expect(parse(["--category"])).toEqual([]);
  });
});
