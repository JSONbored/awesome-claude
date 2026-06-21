import { describe, expect, it } from "vitest";

import {
  buildEntrySummary,
  type RaycastEntry,
} from "../integrations/raycast/src/feed.js";

function entry(overrides: Partial<RaycastEntry>): RaycastEntry {
  return {
    category: "agents",
    slug: "s",
    title: "T",
    description: "Desc",
    tags: [],
    installable: false,
    hasInstallCommand: false,
    hasConfigSnippet: false,
    installCommand: "",
    configSnippet: "",
    copyText: "",
    detailMarkdown: "",
    webUrl: "https://w.example",
    repoUrl: "",
    documentationUrl: "",
    downloadTrust: "external",
    verificationStatus: "validated",
    ...overrides,
  } as RaycastEntry;
}

describe("buildEntrySummary", () => {
  it("renders the title, category label, description, and URL", () => {
    expect(buildEntrySummary(entry({ category: "agents" }))).toBe(
      "T — Agents\nDesc\nURL: https://w.example",
    );
  });

  it("includes a Brand line only when a brand name is present", () => {
    const withBrand = buildEntrySummary(entry({ brandName: "Acme" }));
    expect(withBrand).toContain("Brand: Acme");

    const withoutBrand = buildEntrySummary(entry({}));
    expect(withoutBrand).not.toContain("Brand:");
  });

  it("uses the human category label (e.g. MCP Servers)", () => {
    expect(buildEntrySummary(entry({ category: "mcp" }))).toContain(
      "MCP Servers",
    );
  });
});
