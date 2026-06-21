import { describe, expect, it } from "vitest";

import { isSafeContentPathPart } from "@/lib/content.server";

describe("isSafeContentPathPart", () => {
  it("accepts lowercase slug-style path parts", () => {
    // Categories and slugs are lowercase kebab/alphanumeric, so these are the
    // only shapes allowed into a content file path.
    expect(isSafeContentPathPart("agents")).toBe(true);
    expect(isSafeContentPathPart("my-slug-1")).toBe(true);
    expect(isSafeContentPathPart("mcp")).toBe(true);
  });

  it("rejects path-traversal and separator characters", () => {
    // The guard exists to keep `category`/`slug` from escaping the content
    // directory when interpolated into `entries/<category>/<slug>.json`.
    expect(isSafeContentPathPart("../etc")).toBe(false);
    expect(isSafeContentPathPart("a/b")).toBe(false);
    expect(isSafeContentPathPart("..")).toBe(false);
  });

  it("rejects uppercase, dots, underscores, and empty input", () => {
    // Anything outside [a-z0-9-] is refused, including extensions and the
    // empty string, so only canonical path parts pass.
    expect(isSafeContentPathPart("Agents")).toBe(false);
    expect(isSafeContentPathPart("file.json")).toBe(false);
    expect(isSafeContentPathPart("a_b")).toBe(false);
    expect(isSafeContentPathPart("")).toBe(false);
  });
});
