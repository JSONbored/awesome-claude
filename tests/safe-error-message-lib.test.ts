import { describe, expect, it } from "vitest";

import {
  GENERIC_ERROR_MESSAGE,
  safeErrorMessage,
} from "@/lib/safe-error-message-lib";

const FALLBACK = "custom fallback";

describe("safeErrorMessage", () => {
  it("passes through a short human-readable message", () => {
    expect(safeErrorMessage("jobs API returned 503")).toBe(
      "jobs API returned 503",
    );
  });

  it("collapses internal whitespace", () => {
    expect(safeErrorMessage("  jobs API\n  returned   503  ")).toBe(
      "jobs API returned 503",
    );
  });

  it("falls back on a non-string", () => {
    expect(safeErrorMessage(undefined, FALLBACK)).toBe(FALLBACK);
    expect(safeErrorMessage(null, FALLBACK)).toBe(FALLBACK);
  });

  it("falls back on an empty or whitespace-only message", () => {
    expect(safeErrorMessage("", FALLBACK)).toBe(FALLBACK);
    expect(safeErrorMessage("   \n\t ", FALLBACK)).toBe(FALLBACK);
  });

  it("uses the generic message when no fallback is given", () => {
    expect(safeErrorMessage("", undefined)).toBe(GENERIC_ERROR_MESSAGE);
  });

  it("falls back on an over-long message", () => {
    expect(safeErrorMessage("x".repeat(201), FALLBACK)).toBe(FALLBACK);
    expect(safeErrorMessage("x".repeat(200), FALLBACK)).toBe("x".repeat(200));
  });

  // The regression this guard exists for: TanStack Start's server-fn client
  // throws `new Error(await response.text())`, so an edge block page or the
  // text/html 500 shell arrives as `error.message` and used to be rendered raw.
  it("falls back on a Cloudflare block page", () => {
    const blockPage = [
      "<!DOCTYPE html>",
      '<html class="no-js" lang="en-US">',
      "<head><title>Attention Required! | Cloudflare</title></head>",
      '<body><h1 data-translate="block_headline">Sorry, you have been blocked</h1></body>',
      "</html>",
    ].join("\n");
    expect(safeErrorMessage(blockPage, FALLBACK)).toBe(FALLBACK);
  });

  it("falls back on markup even when it is short enough to pass the length cap", () => {
    expect(safeErrorMessage("<html><body>nope</body></html>", FALLBACK)).toBe(
      FALLBACK,
    );
    expect(safeErrorMessage("<!doctype html>", FALLBACK)).toBe(FALLBACK);
    expect(safeErrorMessage("<script>alert(1)</script>", FALLBACK)).toBe(
      FALLBACK,
    );
    expect(safeErrorMessage("</div>", FALLBACK)).toBe(FALLBACK);
  });

  it("keeps prose that uses a less-than sign", () => {
    expect(safeErrorMessage("limit must be < 100")).toBe("limit must be < 100");
  });
});
