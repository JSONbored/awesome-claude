import { describe, expect, it } from "vitest";

import { duplicateTopLevelFrontmatterKeys } from "../scripts/lib/frontmatter-dupe-keys.mjs";

const fm = (body: string) => `---\n${body}\n---\n\nbody\n`;

describe("duplicateTopLevelFrontmatterKeys", () => {
  it("returns [] when there is no frontmatter block", () => {
    expect(duplicateTopLevelFrontmatterKeys("no frontmatter here")).toEqual([]);
    expect(duplicateTopLevelFrontmatterKeys("")).toEqual([]);
  });

  it("returns [] for unique top-level keys", () => {
    expect(
      duplicateTopLevelFrontmatterKeys(fm("title: A\nslug: b\ntags:\n  - x")),
    ).toEqual([]);
  });

  it("flags a repeated top-level key", () => {
    expect(
      duplicateTopLevelFrontmatterKeys(fm("title: A\nslug: b\ntitle: C")),
    ).toEqual(["title"]);
  });

  it("normalizes quoted keys before comparing", () => {
    expect(
      duplicateTopLevelFrontmatterKeys(fm('title: A\n"title": B')),
    ).toEqual(["title"]);
  });

  it("ignores comments and sequence item lines", () => {
    expect(
      duplicateTopLevelFrontmatterKeys(
        fm("# a comment\ntitle: A\ntags:\n  - one\n  - two\nslug: s"),
      ),
    ).toEqual([]);
  });

  it("skips indented lines inside a block scalar so nested keys are not counted", () => {
    // the indented "title:" is part of the description block, not a top-level key
    const body = [
      "description: |",
      "  title: not a real key",
      "title: Real",
    ].join("\n");
    expect(duplicateTopLevelFrontmatterKeys(fm(body))).toEqual([]);
  });

  it("skips the indented continuation of an empty-value key", () => {
    const body = ["meta:", "  nested: value", "title: A", "title: B"].join(
      "\n",
    );
    expect(duplicateTopLevelFrontmatterKeys(fm(body))).toEqual(["title"]);
  });

  it("reports each duplicated key once", () => {
    expect(
      duplicateTopLevelFrontmatterKeys(
        fm("title: A\ntitle: B\ntitle: C\nslug: x\nslug: y"),
      ).sort(),
    ).toEqual(["slug", "title"]);
  });
});
