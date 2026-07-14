import { describe, expect, it } from "vitest";

import { parseWranglerQueryResults } from "../scripts/lib/wrangler-query-results.mjs";

describe("parseWranglerQueryResults", () => {
  it("returns results from an object payload", () => {
    expect(
      parseWranglerQueryResults(
        '{ "results": [{ "pruned": 3 }], "success": true }',
      ),
    ).toEqual([{ pruned: 3 }]);
  });

  it("returns [] from an object payload without a results array", () => {
    expect(parseWranglerQueryResults('{ "success": true }')).toEqual([]);
    expect(parseWranglerQueryResults('{ "results": "nope" }')).toEqual([]);
  });

  it("uses the last statement carrying results from an array payload", () => {
    const output = JSON.stringify([
      { results: [{ a: 1 }] },
      { results: [{ b: 2 }] },
      { success: true },
    ]);
    expect(parseWranglerQueryResults(output)).toEqual([{ b: 2 }]);
  });

  it("returns [] from an array payload with no statement carrying results", () => {
    expect(parseWranglerQueryResults('[{ "success": true }]')).toEqual([]);
  });

  it("throws on empty/whitespace output", () => {
    expect(() => parseWranglerQueryResults("   ")).toThrow(
      /Could not parse wrangler prune output/,
    );
    expect(() => parseWranglerQueryResults(null)).toThrow(
      /Could not parse wrangler prune output/,
    );
  });
});
