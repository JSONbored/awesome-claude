import { describe, expect, it } from "vitest";

import {
  parseJsonOutput,
  parseToolPayload,
} from "../scripts/lib/mcp-tool-payload.mjs";

describe("parseJsonOutput", () => {
  it("returns a parsed object as-is", () => {
    expect(parseJsonOutput('{ "name": "pkg" }')).toEqual({ name: "pkg" });
  });

  it("returns the first element of a parsed array", () => {
    expect(parseJsonOutput('[{ "v": 1 }, { "v": 2 }]')).toEqual({ v: 1 });
  });
});

describe("parseToolPayload", () => {
  it("prefers structuredContent when present", () => {
    expect(
      parseToolPayload({
        structuredContent: { entry: { slug: "a" } },
        content: [{ type: "text", text: "{}" }],
      }),
    ).toEqual({ entry: { slug: "a" } });
  });

  it("parses the first text content block when there is no structuredContent", () => {
    expect(
      parseToolPayload({
        content: [
          { type: "image" },
          { type: "text", text: '{ "entry": { "slug": "b" } }' },
        ],
      }),
    ).toEqual({ entry: { slug: "b" } });
  });

  it("throws when the result carries no JSON text", () => {
    expect(() => parseToolPayload({ content: [{ type: "image" }] })).toThrow(
      /did not include JSON text/,
    );
    expect(() => parseToolPayload({})).toThrow(/did not include JSON text/);
    expect(() => parseToolPayload(null)).toThrow(/did not include JSON text/);
  });
});
