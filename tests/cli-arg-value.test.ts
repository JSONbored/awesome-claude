import { describe, expect, it } from "vitest";

import { argValue } from "../scripts/lib/cli-arg-value.mjs";

describe("argValue", () => {
  it("returns the token following the flag", () => {
    expect(argValue("--pr-json", ["--pr-json", "pr.json"])).toBe("pr.json");
    expect(
      argValue("--output", ["--pr-json", "pr.json", "--output", "out.json"]),
    ).toBe("out.json");
  });

  it("returns '' when the flag is absent", () => {
    expect(argValue("--missing", ["--pr-json", "pr.json"])).toBe("");
    expect(argValue("--x", [])).toBe("");
  });

  it("returns '' when the flag is the last token with no value", () => {
    expect(argValue("--output", ["--pr-json", "pr.json", "--output"])).toBe("");
  });

  it("returns the first flag's value when it appears more than once", () => {
    expect(argValue("--f", ["--f", "one", "--f", "two"])).toBe("one");
  });
});
