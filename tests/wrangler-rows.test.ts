import { describe, expect, it } from "vitest";

import { parseWranglerRows } from "../scripts/lib/wrangler-rows.mjs";

describe("parseWranglerRows", () => {
  it("returns the first statement's results from wrangler output", () => {
    const output = [
      "🌀 Executing on local database SITE_DB",
      '[ { "results": [ { "entry_key": "agents/x", "upvote_count": 3 } ], "success": true } ]',
    ].join("\n");
    expect(parseWranglerRows(output, "local")).toEqual([
      { entry_key: "agents/x", upvote_count: 3 },
    ]);
  });

  it("defaults to [] when the first statement has no results", () => {
    expect(parseWranglerRows('[ { "success": true } ]', "remote")).toEqual([]);
  });

  it("throws with the run label when no JSON array is present", () => {
    expect(() => parseWranglerRows("no json here", "remote")).toThrow(
      /Could not parse wrangler output for remote/,
    );
  });
});
