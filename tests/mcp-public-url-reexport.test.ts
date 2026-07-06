import { describe, expect, it } from "vitest";

import {
  hasEmbeddedUrlUserinfo,
  isPublicHttpsUrl,
} from "../packages/mcp/src/public-url.js";

describe("mcp public-url re-export", () => {
  it("re-exports hasEmbeddedUrlUserinfo from public-url-lib", () => {
    expect(hasEmbeddedUrlUserinfo("https://token@example.com/docs")).toBe(true);
  });

  it("re-exports isPublicHttpsUrl through the public public-url surface", () => {
    expect(isPublicHttpsUrl("https://example.com/docs")).toBe(true);
  });
});
