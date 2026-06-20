import { describe, expect, it } from "vitest";

import { htmlToPlainText, getDownloadHref } from "@/lib/detail-assembly";

describe("htmlToPlainText", () => {
  it("strips all markup and keeps only the visible text", () => {
    // sanitizeHtml runs with no allowed tags, so only text content survives.
    expect(
      htmlToPlainText("<p>Hello <b>world</b></p> <a href='x'>link</a>"),
    ).toBe("Hello world link");
  });

  it("collapses runs of whitespace and newlines into single spaces", () => {
    expect(htmlToPlainText("a\n\n  b   c")).toBe("a b c");
  });

  it("returns an empty string for empty input", () => {
    expect(htmlToPlainText("")).toBe("");
  });
});

describe("getDownloadHref", () => {
  it("routes local /downloads/ assets through the download proxy", () => {
    // First-party packages are served via the API so access/headers are controlled.
    expect(getDownloadHref("/downloads/skills/x.zip")).toBe(
      "/api/download?asset=%2Fdownloads%2Fskills%2Fx.zip",
    );
  });

  it("leaves external URLs untouched", () => {
    expect(getDownloadHref("https://example.com/x.zip")).toBe(
      "https://example.com/x.zip",
    );
  });
});
