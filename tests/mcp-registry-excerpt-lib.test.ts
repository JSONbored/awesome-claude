import { describe, expect, it } from "vitest";

import {
  ENTRY_ASSET_FIELDS,
  ENTRY_BODY_EXCERPT_CHARS,
  excerptText,
  projectEntryBody,
} from "../packages/mcp/src/registry-excerpt-lib.js";

describe("registry-excerpt-lib excerpt trimming", () => {
  it("returns short text unchanged and trims long text at boundaries", () => {
    expect(excerptText("hello", 10)).toBe("hello");
    const long = "First paragraph.\n\nSecond paragraph with more detail.";
    const excerpt = excerptText(long, 20);
    expect(excerpt.endsWith("…")).toBe(true);
    expect(excerpt.length).toBeLessThanOrEqual(21);
  });
});

describe("registry-excerpt-lib body projection", () => {
  const entry = {
    body: "x".repeat(ENTRY_BODY_EXCERPT_CHARS + 50),
    scriptBody: "y".repeat(ENTRY_BODY_EXCERPT_CHARS + 10),
    fullCopyableContent: "small",
    title: "Example",
  };

  it("exports excerpt constants and asset field names", () => {
    expect(ENTRY_BODY_EXCERPT_CHARS).toBe(1200);
    expect(ENTRY_ASSET_FIELDS).toEqual([
      "scriptBody",
      "fullCopyableContent",
      "copySnippet",
    ]);
  });

  it("returns full entries without truncation in full mode", () => {
    const { entry: projected, bodyMeta } = projectEntryBody(entry, "full");
    expect(projected.body).toBe(entry.body);
    expect(bodyMeta).toEqual({
      bodyMode: "full",
      bodyChars: entry.body.length,
      bodyTruncated: false,
      omittedFields: [],
    });
  });

  it("omits body and large asset fields in none mode", () => {
    const { entry: projected, bodyMeta } = projectEntryBody(entry, "none");
    expect(projected.body).toBeUndefined();
    expect(projected.scriptBody).toBeUndefined();
    expect(projected.fullCopyableContent).toBe("small");
    expect(bodyMeta.bodyMode).toBe("none");
    expect(bodyMeta.omittedFields).toEqual([
      { field: "scriptBody", chars: entry.scriptBody.length },
    ]);
    expect(bodyMeta.assetHint).toMatch(/entry\.asset/i);
  });

  it("excerpts long bodies and marks truncation in excerpt mode", () => {
    const { entry: projected, bodyMeta } = projectEntryBody(entry, "excerpt");
    expect(projected.body.endsWith("…")).toBe(true);
    expect(bodyMeta.bodyMode).toBe("excerpt");
    expect(bodyMeta.bodyTruncated).toBe(true);
  });

  it("treats a non-string body as empty", () => {
    const { bodyMeta } = projectEntryBody(
      { slug: "s", body: 123 as unknown as string },
      "excerpt",
    );
    expect(bodyMeta.bodyChars).toBe(0);
  });

  it("falls back to excerpt mode for an unrecognized requested mode", () => {
    const { bodyMeta } = projectEntryBody(
      { slug: "s", body: "hello" },
      "bogus-mode" as unknown as "excerpt",
    );
    expect(bodyMeta.bodyMode).toBe("excerpt");
  });
});
