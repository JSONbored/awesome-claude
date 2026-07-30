import { describe, expect, it } from "vitest";

import { buildEntryTrustSignals } from "../packages/registry/src/artifacts-lib.js";

describe("buildEntryTrustSignals sourceStatus", () => {
  it("does not treat marketing websiteUrl alone as available source provenance", () => {
    expect(
      buildEntryTrustSignals({
        websiteUrl: "https://example.com/marketing",
        downloadUrl: "https://registry.npmjs.org/example/-/example-1.0.0.tgz",
      }).sourceStatus,
    ).toBe("missing");
  });

  it("rejects cleartext http source URLs for sourceStatus", () => {
    expect(
      buildEntryTrustSignals({
        sourceUrl: "http://example.com/repo",
        documentationUrl: "http://docs.example.com",
      }).sourceStatus,
    ).toBe("missing");
  });

  it("marks HTTPS reviewable sources as available", () => {
    const signals = buildEntryTrustSignals({
      repoUrl: "https://github.com/example/project",
      websiteUrl: "https://example.com",
    });
    expect(signals.sourceStatus).toBe("available");
    expect(signals.sourceUrls).toEqual(
      expect.arrayContaining([
        "https://github.com/example/project",
        "https://example.com",
      ]),
    );
  });
});
