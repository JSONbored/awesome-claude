import { describe, expect, it } from "vitest";

import {
  originFor,
  safeUrlForOrigins,
} from "../apps/web/src/lib/submit-url-safety-lib";

const BASE = "https://base.example";

describe("originFor", () => {
  it("returns the origin of a valid URL", () => {
    expect(originFor("https://a.example/x?y=1")).toBe("https://a.example");
  });

  it("returns '' for an unparseable URL", () => {
    expect(originFor("not a url")).toBe("");
  });
});

describe("safeUrlForOrigins", () => {
  it("returns '' for a missing value", () => {
    expect(safeUrlForOrigins(undefined, new Set([BASE]), BASE)).toBe("");
  });

  it("returns an allowed absolute https URL unchanged", () => {
    expect(
      safeUrlForOrigins(
        "https://ok.example/p?q=1",
        new Set(["https://ok.example"]),
        BASE,
      ),
    ).toBe("https://ok.example/p?q=1");
  });

  it("rejects a cross-origin URL", () => {
    expect(
      safeUrlForOrigins(
        "https://evil.example/p",
        new Set(["https://ok.example"]),
        BASE,
      ),
    ).toBe("");
  });

  it("rejects a non-http(s) protocol even on an allowed origin", () => {
    expect(
      safeUrlForOrigins(
        "ftp://ok.example/p",
        new Set(["ftp://ok.example"]),
        BASE,
      ),
    ).toBe("");
  });

  it("returns a same-origin root-relative input as a path", () => {
    expect(safeUrlForOrigins("/dash?x=1#h", new Set([BASE]), BASE)).toBe(
      "/dash?x=1#h",
    );
  });

  it("returns '' when the URL cannot be parsed (invalid base)", () => {
    expect(safeUrlForOrigins("x", new Set([BASE]), "")).toBe("");
  });
});
