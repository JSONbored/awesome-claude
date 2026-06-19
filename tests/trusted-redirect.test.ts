import { describe, expect, it } from "vitest";
import { isTrustedRedirect, safeRedirectTarget } from "../apps/web/src/lib/trusted-redirect";

describe("trusted redirect", () => {
  it("accepts our own host", () => {
    expect(isTrustedRedirect("https://heyclau.de/dashboard")).toBe(true);
  });
  it("falls back to home when target is missing", () => {
    expect(safeRedirectTarget(null)).toBe("/");
  });
  it("returns the target when trusted", () => {
    expect(safeRedirectTarget("https://heyclau.de/x")).toBe("https://heyclau.de/x");
  });
});
