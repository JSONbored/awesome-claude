import { describe, expect, it } from "vitest";

import {
  parseAllowedUpstreamOrigins,
  validateUpstreamOrigin,
} from "../apps/web/src/lib/upstream-origin-lib";

const DEFAULTS = ["https://tasty.aethereal.dev"] as const;

describe("parseAllowedUpstreamOrigins", () => {
  it("splits, trims, and drops empties from a configured list", () => {
    expect(
      parseAllowedUpstreamOrigins("https://a.dev , https://b.dev ,", DEFAULTS),
    ).toEqual(["https://a.dev", "https://b.dev"]);
  });

  it("falls back to the defaults when unset or empty", () => {
    expect(parseAllowedUpstreamOrigins(undefined, DEFAULTS)).toEqual([
      "https://tasty.aethereal.dev",
    ]);
    expect(parseAllowedUpstreamOrigins("", DEFAULTS)).toEqual([
      "https://tasty.aethereal.dev",
    ]);
  });
});

describe("validateUpstreamOrigin", () => {
  const allowed = ["https://tasty.aethereal.dev"];

  it("returns the origin when allow-listed", () => {
    expect(
      validateUpstreamOrigin("https://tasty.aethereal.dev/collect", allowed),
    ).toBe("https://tasty.aethereal.dev");
  });

  it("returns '' for a non-allow-listed origin", () => {
    expect(validateUpstreamOrigin("https://evil.example/x", allowed)).toBe("");
  });

  it("returns '' for an unparseable upstream", () => {
    expect(validateUpstreamOrigin("not a url", allowed)).toBe("");
  });
});
