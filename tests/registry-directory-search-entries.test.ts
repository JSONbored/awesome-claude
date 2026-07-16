import { describe, expect, it } from "vitest";

import {
  buildDirectoryEntries,
  buildSearchEntries,
} from "../packages/registry/src/artifacts-lib.js";

const minimalEntry = {
  category: "skills",
  slug: "demo",
  title: "Demo Skill",
  description: "A minimal entry with no optional metadata.",
};

const fullEntry = {
  category: "mcp",
  slug: "full",
  title: "Full Entry",
  seoTitle: "Full Entry SEO Title",
  description: "Long description used only when no card description exists.",
  cardDescription: "Short card description.",
  author: "@example",
  dateAdded: "2026-01-01",
  contentUpdatedAt: "2026-02-01",
  tags: ["mcp"],
  keywords: ["demo"],
  documentationUrl: "https://example.com/docs",
  docsUrl: "https://example.com/docs-alt",
  sourceUrl: "https://example.com/source",
  sourceUrls: ["https://example.com/a", "https://example.com/b"],
  packageUrl: "https://example.com/package",
  repositoryUrl: "https://example.com/repo",
  websiteUrl: "https://example.com",
  repoUrl: "https://github.com/example/full",
  githubStars: 5,
  githubForks: 2,
  repoUpdatedAt: "2026-03-01",
  downloadUrl: "https://example.com/full.zip",
  downloadTrust: "first-party",
  verificationStatus: "validated",
};

describe("artifacts-lib buildDirectoryEntries", () => {
  it("defaults optional metadata for a minimal entry", () => {
    const [entry] = buildDirectoryEntries([minimalEntry]);
    expect(entry.description).toBe(minimalEntry.description);
    expect(entry.author).toBe("");
    expect(entry.dateAdded).toBe("");
    expect(entry.tags).toEqual([]);
    expect(entry.keywords).toEqual([]);
    expect(entry.docsUrl).toBeUndefined();
    expect(entry.sourceUrls).toBeUndefined();
  });

  it("prefers the card description and keeps populated optional urls", () => {
    const [entry] = buildDirectoryEntries([fullEntry]);
    expect(entry.description).toBe("Short card description.");
    expect(entry.docsUrl).toBe("https://example.com/docs-alt");
    expect(entry.sourceUrls).toEqual([
      "https://example.com/a",
      "https://example.com/b",
    ]);
  });

  it("drops an empty sourceUrls array", () => {
    const [entry] = buildDirectoryEntries([
      { ...minimalEntry, sourceUrls: [] },
    ]);
    expect(entry.sourceUrls).toBeUndefined();
  });
});

describe("artifacts-lib buildSearchEntries", () => {
  it("falls back to the title and blank author for a minimal entry", () => {
    const [entry] = buildSearchEntries([minimalEntry]);
    expect(entry.seoTitle).toBe("Demo Skill");
    expect(entry.author).toBe("");
    expect(entry.downloadTrust).toBeNull();
    expect(entry.verificationStatus).toBe("");
  });

  it("keeps the seo title and download trust for a full entry", () => {
    const [entry] = buildSearchEntries([fullEntry]);
    expect(entry.seoTitle).toBe("Full Entry SEO Title");
    expect(entry.description).toBe("Short card description.");
    expect(entry.downloadTrust).toBe("first-party");
    expect(entry.verificationStatus).toBe("validated");
  });
});
