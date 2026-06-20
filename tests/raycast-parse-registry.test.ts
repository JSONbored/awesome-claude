import { describe, expect, it } from "vitest";

// Deep-relative test imports use the `.js` specifier across this repo's suite;
// the bundler maps it to the TypeScript source.
import {
  parseRegistrySearch,
  parseRegistryManifestSnapshot,
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

describe("parseRegistrySearch", () => {
  it("normalizes results, drops malformed ones, and carries pagination", () => {
    const search = parseRegistrySearch(
      JSON.stringify({
        results: [entry(), { bad: 1 }],
        total: 5,
        limit: 10,
        offset: 0,
        nextOffset: 10,
      }),
    );
    expect(search.entries).toHaveLength(1);
    expect(search.total).toBe(5);
    expect(search.limit).toBe(10);
    expect(search.offset).toBe(0);
  });

  it("throws when the payload is missing its results array", () => {
    expect(() => parseRegistrySearch(JSON.stringify({ foo: 1 }))).toThrow(
      "malformed",
    );
  });
});

describe("parseRegistryManifestSnapshot", () => {
  it("extracts the raycast feed checksum and generated timestamp", () => {
    const snapshot = parseRegistryManifestSnapshot(
      JSON.stringify({
        generatedAt: "2026-06-01",
        artifactContracts: { "raycast-index.json": { sha256: "abc123" } },
      }),
    );
    expect(snapshot).toMatchObject({
      generatedAt: "2026-06-01",
      feedSha256: "abc123",
    });
  });

  it("returns null when neither a checksum nor a timestamp is present", () => {
    expect(
      parseRegistryManifestSnapshot(JSON.stringify({ foo: 1 })),
    ).toBeNull();
  });
});
