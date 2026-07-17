import { describe, expect, it } from "vitest";

import { extractSubmittedSourceUrls } from "../apps/submission-gate/src/source-evidence";

function frontmatter(lines: string[]) {
  return ["---", ...lines, "---", "", "body text", ""].join("\n");
}

describe("submission-gate extractSubmittedSourceUrls", () => {
  it("returns nothing without frontmatter", () => {
    expect(extractSubmittedSourceUrls("no frontmatter here")).toEqual([]);
  });

  it("reads an inline array with mixed quoting", () => {
    expect(
      extractSubmittedSourceUrls(
        frontmatter([
          `sourceUrls: ["https://a.example/x", 'https://b.example/y']`,
          "title: T",
        ]),
      ),
    ).toEqual([
      { field: "sourceUrls", url: "https://a.example/x" },
      { field: "sourceUrls", url: "https://b.example/y" },
    ]);
  });

  it("reads a block list and skips blank items", () => {
    expect(
      extractSubmittedSourceUrls(
        frontmatter([
          "sourceUrls:",
          '  - "https://c.example/z"',
          "  - https://d.example/w",
          "  -",
          "title: T",
        ]),
      ),
    ).toEqual([
      { field: "sourceUrls", url: "https://c.example/z" },
      { field: "sourceUrls", url: "https://d.example/w" },
    ]);
  });

  it("reads a scalar source url field", () => {
    expect(
      extractSubmittedSourceUrls(
        frontmatter(["sourceUrl: https://e.example/s"]),
      ),
    ).toEqual([{ field: "sourceUrl", url: "https://e.example/s" }]);
  });

  it("reads list items under a block scalar marker", () => {
    expect(
      extractSubmittedSourceUrls(
        frontmatter(["sourceUrls: |", "  - https://f.example/p"]),
      ),
    ).toEqual([{ field: "sourceUrls", url: "https://f.example/p" }]);
  });

  it("ignores list items that belong to a non-source field", () => {
    expect(
      extractSubmittedSourceUrls(
        frontmatter(["tags:", "  - https://not-a-source.example/x"]),
      ),
    ).toEqual([]);
  });
});
