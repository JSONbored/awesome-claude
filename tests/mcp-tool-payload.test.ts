import { describe, expect, it } from "vitest";

import {
  assertSafetyMetadataShape,
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

describe("assertSafetyMetadataShape", () => {
  it("passes when safetyNotes and privacyNotes are arrays", () => {
    expect(() =>
      assertSafetyMetadataShape(
        { safetyNotes: [], privacyNotes: ["x"] },
        "entry",
      ),
    ).not.toThrow();
  });

  it("throws a labelled error when safetyNotes is not an array", () => {
    expect(() =>
      assertSafetyMetadataShape({ privacyNotes: [] }, "search entry"),
    ).toThrow(/search entry did not expose safetyNotes as an array/);
    expect(() => assertSafetyMetadataShape(null, "x")).toThrow(
      /x did not expose safetyNotes as an array/,
    );
  });

  it("throws when privacyNotes is not an array (safetyNotes ok)", () => {
    expect(() =>
      assertSafetyMetadataShape(
        { safetyNotes: [], privacyNotes: "nope" },
        "detail",
      ),
    ).toThrow(/detail did not expose privacyNotes as an array/);
  });
});
