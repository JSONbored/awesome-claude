import { describe, expect, it } from "vitest";

import {
  buildMcpRegistryFeed,
  buildPluginExportFeed,
  buildReadOnlyEcosystemFeed,
} from "../packages/registry/src/artifacts-lib.js";

const minimalEntry = {
  category: "mcp",
  slug: "demo",
  title: "Demo Server",
  description: "A minimal MCP entry with no optional metadata.",
  dateAdded: "2026-01-01",
};

const fullEntry = {
  category: "mcp",
  slug: "full",
  title: "Full Server",
  description: "Long description used only when no card description exists.",
  cardDescription: "Short card description.",
  dateAdded: "2026-02-01",
  websiteUrl: "https://example.com",
  documentationUrl: "https://example.com/docs",
  repoUrl: "https://github.com/example/full",
  githubUrl: "https://github.com/example/full",
  pricingModel: "free",
  disclosure: "sponsored",
  tags: ["mcp"],
  installCommand: "npx -y full",
  configSnippet: "{}",
  commandSyntax: "/full <input>",
};

describe("artifacts-lib buildReadOnlyEcosystemFeed", () => {
  it("defaults optional urls, disclosure, and tags for a minimal entry", () => {
    const [entry] = buildReadOnlyEcosystemFeed([minimalEntry]).entries;
    expect(entry.key).toBe("mcp:demo");
    expect(entry.description).toBe(minimalEntry.description);
    expect(entry.websiteUrl).toBe("");
    expect(entry.documentationUrl).toBe("");
    expect(entry.repoUrl).toBe("");
    expect(entry.pricingModel).toBe("");
    expect(entry.disclosure).toBe("editorial");
    expect(entry.tags).toEqual([]);
  });

  it("prefers the card description and keeps an explicit disclosure", () => {
    const [entry] = buildReadOnlyEcosystemFeed([fullEntry]).entries;
    expect(entry.description).toBe("Short card description.");
    expect(entry.disclosure).toBe("sponsored");
    expect(entry.pricingModel).toBe("free");
  });
});

describe("artifacts-lib buildMcpRegistryFeed", () => {
  it("keeps only mcp entries and blanks a missing website url", () => {
    const feed = buildMcpRegistryFeed([
      minimalEntry,
      { ...minimalEntry, category: "skills", slug: "not-mcp" },
    ]);
    expect(feed.count).toBe(1);
    expect(feed.servers[0].name).toBe("demo");
    expect(feed.servers[0].websiteUrl).toBe("");
    expect(feed.servers[0].repository).toBeUndefined();
  });

  it("falls back to the documentation url and includes the repository", () => {
    const [server] = buildMcpRegistryFeed([
      { ...fullEntry, websiteUrl: "" },
    ]).servers;
    expect(server.websiteUrl).toBe("https://example.com/docs");
    expect(server.repository.url).toBe("https://github.com/example/full");
  });
});

describe("artifacts-lib buildPluginExportFeed", () => {
  it("blanks a missing install command for a minimal entry", () => {
    const feed = buildPluginExportFeed([minimalEntry]);
    expect(feed.kind).toBe("plugin-export-feed");
    expect(feed.count).toBe(1);
    expect(feed.plugins[0].name).toBe("demo");
    expect(feed.plugins[0].installCommand).toBe("");
  });

  it("prefers the card description and install command for a full entry", () => {
    const [plugin] = buildPluginExportFeed([fullEntry]).plugins;
    expect(plugin.description).toBe("Short card description.");
    expect(plugin.installCommand).toBe("npx -y full");
  });
});
