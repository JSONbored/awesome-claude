import { describe, expect, it } from "vitest";

import { assertReadmeEntryExtraction } from "../scripts/build-readme-refresh-body.mjs";

// README catalog lines are added diff lines beginning with `+- **[`.
const catalogDiff = [
  "+- **[Foo](x) — desc",
  "+- **[Bar](y) — desc",
  "+++ b/README.md",
  "-removed line",
].join("\n");

describe("assertReadmeEntryExtraction", () => {
  it("passes when the parsed change count matches the added catalog lines", () => {
    // Two added catalog lines + two parsed changes is consistent.
    expect(() =>
      assertReadmeEntryExtraction(catalogDiff, [{}, {}]),
    ).not.toThrow();
  });

  it("throws when the parsed change count is too low", () => {
    expect(() => assertReadmeEntryExtraction(catalogDiff, [{}])).toThrow(
      "README diff includes",
    );
  });

  it("throws when the parsed change count is too high", () => {
    expect(() =>
      assertReadmeEntryExtraction(catalogDiff, [{}, {}, {}]),
    ).toThrow("parsed change");
  });

  it("ignores diff headers and removed lines (empty diff is consistent with no changes)", () => {
    expect(() => assertReadmeEntryExtraction("", [])).not.toThrow();
  });
});
