import { describe, expect, it } from "vitest";

// Deep-relative test imports use the `.js` specifier across this repo's suite;
// the bundler maps it to the TypeScript source.
import {
  parseTrendingFeed,
  parseRecentUpdatesFeed,
  type RaycastEntry,
} from "../integrations/raycast/src/feed.js";

function entry(overrides: Partial<RaycastEntry> = {}): RaycastEntry {
  return {
    category: "agents",
    slug: "a",
    title: "T",
    description: "D",
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

describe("parseTrendingFeed", () => {
  it("normalizes entries, drops invalid ones, and carries facets/metadata", () => {
    const feed = parseTrendingFeed(
      JSON.stringify({
        generatedAt: "g",
        category: "all",
        platform: "all",
        entries: [entry(), { bad: 1 }],
      }),
    );
    expect(feed.entries).toHaveLength(1);
    expect(feed.category).toBe("all");
    expect(feed.platform).toBe("all");
    expect(feed.generatedAt).toBe("g");
  });

  it("reports which trend signals are available as booleans", () => {
    const feed = parseTrendingFeed(
      JSON.stringify({ generatedAt: "g", entries: [] }),
    );
    expect(feed.signalsAvailable).toMatchObject({
      votes: expect.any(Boolean),
      community: expect.any(Boolean),
      intent: expect.any(Boolean),
    });
  });
});

describe("parseRecentUpdatesFeed", () => {
  it("normalizes entries and preserves the current signature", () => {
    const feed = parseRecentUpdatesFeed(
      JSON.stringify({
        generatedAt: "g",
        currentSignature: "sig",
        entries: [entry(), { bad: 1 }],
      }),
    );
    expect(feed.entries).toHaveLength(1);
    expect(feed.currentSignature).toBe("sig");
    expect(feed.generatedAt).toBe("g");
  });
});
