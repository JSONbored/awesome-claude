import { describe, expect, it } from "vitest";

import {
  hasEmbeddedUrlUserinfo,
  isPublicHttpsUrl,
  publicUrlHostname,
} from "../integrations/raycast/src/public-url-lib";

describe("Raycast public URL helpers", () => {
  it("detects embedded userinfo credentials", () => {
    expect(hasEmbeddedUrlUserinfo("https://token@example.com/docs")).toBe(true);
    expect(hasEmbeddedUrlUserinfo("https://example.com/docs")).toBe(false);
  });

  it("validates public https URLs without userinfo", () => {
    expect(isPublicHttpsUrl("https://example.com/docs")).toBe(true);
    expect(isPublicHttpsUrl("http://example.com/docs")).toBe(false);
    expect(isPublicHttpsUrl("https://token@example.com/docs")).toBe(false);
  });

  it("extracts hostnames only from credential-free URLs", () => {
    expect(publicUrlHostname("https://www.Example.com/path")).toBe(
      "example.com",
    );
    expect(publicUrlHostname("https://token@example.com/path")).toBe("");
  });
});
