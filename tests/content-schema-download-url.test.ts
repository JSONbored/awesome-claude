import { describe, expect, it } from "vitest";

import { validateEntry } from "../packages/registry/src/content-schema-lib.js";

describe("downloadUrl scheme validation", () => {
  it("rejects javascript and data download URLs", () => {
    for (const downloadUrl of [
      "javascript:alert(1)",
      "data:text/html,owned",
      "http://example.com/pkg.zip",
    ]) {
      expect(
        validateEntry("skills", {
          slug: "s",
          title: "S",
          description: "D",
          downloadUrl,
        }).semanticErrors,
      ).toContain("downloadUrl must be an HTTPS URL or a /downloads/... path");
    }
  });

  it("allows HTTPS and hosted /downloads paths", () => {
    expect(
      validateEntry("skills", {
        slug: "s",
        title: "S",
        description: "D",
        downloadUrl: "https://example.com/pkg.zip",
      }).semanticErrors,
    ).not.toContain(
      "downloadUrl must be an HTTPS URL or a /downloads/... path",
    );
    expect(
      validateEntry("skills", {
        slug: "s",
        title: "S",
        description: "D",
        downloadUrl: "/downloads/skills/example.zip",
      }).semanticErrors,
    ).not.toContain(
      "downloadUrl must be an HTTPS URL or a /downloads/... path",
    );
  });

  it("rejects path traversal hosted downloads", () => {
    expect(
      validateEntry("skills", {
        slug: "s",
        title: "S",
        description: "D",
        downloadUrl: "/downloads/../etc/passwd",
      }).semanticErrors,
    ).toContain("downloadUrl must be an HTTPS URL or a /downloads/... path");
  });
});
