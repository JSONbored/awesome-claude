import { describe, expect, it } from "vitest";

import {
  isFirstPartyPackage,
  isLocalDownloadUrl,
  normalizeDownloadUrl,
} from "../scripts/lib/download-package-url.mjs";

describe("isFirstPartyPackage", () => {
  it("is true only when packageVerified is strictly true", () => {
    expect(isFirstPartyPackage({ packageVerified: true })).toBe(true);
  });

  it("is false for missing, false, or truthy-but-not-true values", () => {
    expect(isFirstPartyPackage()).toBe(false);
    expect(isFirstPartyPackage({})).toBe(false);
    expect(isFirstPartyPackage({ packageVerified: false })).toBe(false);
    expect(isFirstPartyPackage({ packageVerified: "true" })).toBe(false);
    expect(isFirstPartyPackage({ packageVerified: 1 })).toBe(false);
  });
});

describe("normalizeDownloadUrl", () => {
  it("trims surrounding whitespace", () => {
    expect(normalizeDownloadUrl("  /downloads/a.zip  ")).toBe(
      "/downloads/a.zip",
    );
  });

  it("coerces null and undefined to an empty string", () => {
    expect(normalizeDownloadUrl(null)).toBe("");
    expect(normalizeDownloadUrl(undefined)).toBe("");
    expect(normalizeDownloadUrl()).toBe("");
  });

  it("stringifies non-string values", () => {
    expect(normalizeDownloadUrl(123)).toBe("123");
  });
});

describe("isLocalDownloadUrl", () => {
  it("is true for a /downloads/ path, including one needing trimming", () => {
    expect(isLocalDownloadUrl("/downloads/pkg.zip")).toBe(true);
    expect(isLocalDownloadUrl("  /downloads/pkg.zip")).toBe(true);
  });

  it("is false for remote URLs, other paths, and empty input", () => {
    expect(isLocalDownloadUrl("https://example.com/downloads/pkg.zip")).toBe(
      false,
    );
    expect(isLocalDownloadUrl("/assets/pkg.zip")).toBe(false);
    expect(isLocalDownloadUrl("")).toBe(false);
    expect(isLocalDownloadUrl(null)).toBe(false);
  });
});
