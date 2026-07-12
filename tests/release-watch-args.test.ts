import { describe, expect, it } from "vitest";

import { parseReleaseWatchArgs } from "../scripts/lib/release-watch-core.mjs";

describe("parseReleaseWatchArgs", () => {
  it("defaults every flag off for no args", () => {
    expect(parseReleaseWatchArgs([])).toEqual({
      json: false,
      output: null,
      upsertIssue: false,
    });
  });

  it("sets --json and --upsert-issue booleans", () => {
    expect(parseReleaseWatchArgs(["--json", "--upsert-issue"])).toEqual({
      json: true,
      output: null,
      upsertIssue: true,
    });
  });

  it("consumes the value after --output", () => {
    expect(parseReleaseWatchArgs(["--output", "report.json"])).toEqual({
      json: false,
      output: "report.json",
      upsertIssue: false,
    });
  });

  it("parses a full combination in order", () => {
    expect(
      parseReleaseWatchArgs([
        "--json",
        "--output",
        "out.json",
        "--upsert-issue",
      ]),
    ).toEqual({ json: true, output: "out.json", upsertIssue: true });
  });

  it("throws on an unknown option", () => {
    expect(() => parseReleaseWatchArgs(["--nope"])).toThrow(
      /Unknown option: --nope/,
    );
  });
});
