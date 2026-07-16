import { describe, expect, it } from "vitest";

import {
  buildEntryTrustSignals,
  buildRegistryTrustReport,
} from "../packages/registry/src/artifacts-lib.js";

const minimalEntry = {
  category: "mcp",
  slug: "demo",
  title: "Demo Server",
  description: "A minimal MCP entry with no trust metadata.",
  dateAdded: "2026-01-01",
};

const trustedEntry = {
  ...minimalEntry,
  slug: "trusted",
  disclosure: "heyclaude_pick",
  packageVerified: true,
  downloadTrust: "first-party",
  downloadSha256: "abc123",
  repoUrl: "https://github.com/example/trusted",
  safetyNotes: ["runs user code"],
  privacyNotes: ["reads local files"],
};

describe("artifacts-lib buildEntryTrustSignals", () => {
  it("reports absent trust metadata for a minimal entry", () => {
    const signals = buildEntryTrustSignals(minimalEntry);
    expect(signals.firstPartyEditorial).toBe(false);
    expect(signals.packageVerified).toBe(false);
    expect(signals.packageTrust).toBeNull();
    expect(signals.packageChecksum).toBe("");
    expect(signals.checksumPresent).toBe(false);
    expect(signals.sourceUrlCount).toBe(0);
    expect(signals.sourceStatus).toBe("missing");
    expect(signals.hasSafetyNotes).toBe(false);
    expect(signals.hasPrivacyNotes).toBe(false);
  });

  it("reports present trust metadata for a fully-populated entry", () => {
    const signals = buildEntryTrustSignals(trustedEntry);
    expect(signals.firstPartyEditorial).toBe(true);
    expect(signals.packageVerified).toBe(true);
    expect(signals.packageTrust).toBe("first-party");
    expect(signals.packageChecksum).toBe("abc123");
    expect(signals.checksumPresent).toBe(true);
    expect(signals.sourceStatus).toBe("available");
    expect(signals.hasSafetyNotes).toBe(true);
    expect(signals.hasPrivacyNotes).toBe(true);
  });

  it("falls back to the skill package checksum", () => {
    expect(
      buildEntryTrustSignals({
        ...minimalEntry,
        skillPackage: { sha256: "zzz999" },
      }).packageChecksum,
    ).toBe("zzz999");
  });
});

describe("artifacts-lib buildRegistryTrustReport", () => {
  it("recommends brand and source metadata for an unbranded mcp entry", () => {
    const report = buildRegistryTrustReport([minimalEntry]);
    expect(report.count).toBe(1);
    expect(report.entries[0].recommendations).toEqual([
      "Add brandDomain or reviewed brand asset metadata.",
      "Add source, docs, repository, or editorial provenance.",
    ]);
  });

  it("raises no recommendations for a branded, source-backed entry", () => {
    const report = buildRegistryTrustReport([
      { ...trustedEntry, brandDomain: "example.com" },
    ]);
    expect(report.entries[0].recommendations).toEqual([]);
  });

  it("zeroes percentages for an empty registry", () => {
    const report = buildRegistryTrustReport([]);
    expect(report.count).toBe(0);
    expect(report.summary.brandedPercent).toBe(0);
    expect(report.summary.sourceAvailablePercent).toBe(0);
    expect(report.summary.checksumPresentPercent).toBe(0);
  });
});
