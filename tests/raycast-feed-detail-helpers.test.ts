import { describe, expect, it } from "vitest";

// Deep-relative test imports use the `.js` specifier across this repo's suite
// (e.g. tests importing from ../packages/registry/src/*.js); the bundler maps
// it to the TypeScript source.
import {
  categoryLabel,
  entryHasConfigSnippet,
  entryHasInstallCommand,
  isRaycastDetail,
  fallbackDetail,
  hasValidDiscoveryEntries,
  type RaycastEntry,
} from "../integrations/raycast/src/feed.js";

function entry(overrides: Partial<RaycastEntry>): RaycastEntry {
  return {
    category: "agents",
    slug: "s",
    title: "T",
    description: "D",
    tags: [],
    installable: false,
    hasInstallCommand: false,
    hasConfigSnippet: false,
    installCommand: "",
    configSnippet: "",
    copyText: "CT",
    detailMarkdown: "MD",
    webUrl: "https://w.example",
    repoUrl: "",
    documentationUrl: "",
    downloadTrust: "external",
    verificationStatus: "validated",
    ...overrides,
  } as RaycastEntry;
}

describe("categoryLabel", () => {
  it("maps known categories to human labels and passes unknowns through", () => {
    expect(categoryLabel("agents")).toBe("Agents");
    expect(categoryLabel("mcp")).toBe("MCP Servers");
    // An unrecognized category is returned unchanged rather than blanked.
    expect(categoryLabel("zzz")).toBe("zzz");
  });
});

describe("isRaycastDetail", () => {
  it("accepts a well-formed detail object", () => {
    expect(
      isRaycastDetail({
        category: "agents",
        slug: "s",
        title: "t",
        description: "d",
        webUrl: "https://w.example",
        detailMarkdown: "m",
      }),
    ).toBe(true);
  });

  it("rejects incomplete objects and non-objects", () => {
    expect(isRaycastDetail({ foo: 1 })).toBe(false);
    expect(isRaycastDetail("x")).toBe(false);
  });
});

describe("fallbackDetail", () => {
  it("derives a detail payload from the list entry's fields", () => {
    const detail = fallbackDetail(
      entry({ copyText: "CT", detailMarkdown: "MD" }),
    );
    expect(detail.copyText).toBe("CT");
    expect(detail.detailMarkdown).toBe("MD");
  });
});

describe("hasValidDiscoveryEntries", () => {
  it("is true when the JSON envelope has at least one resolvable entry", () => {
    expect(
      hasValidDiscoveryEntries(
        JSON.stringify({ entries: [{ category: "agents", slug: "a" }] }),
      ),
    ).toBe(true);
  });

  it("is false for an empty or reference-less entries array", () => {
    expect(hasValidDiscoveryEntries(JSON.stringify({ entries: [] }))).toBe(
      false,
    );
    expect(hasValidDiscoveryEntries(JSON.stringify({ other: 1 }))).toBe(false);
  });

  it("throws on malformed JSON (callers pass trusted feed payloads)", () => {
    expect(() => hasValidDiscoveryEntries("not json")).toThrow();
  });
});

describe("entryHasInstallCommand / entryHasConfigSnippet", () => {
  it("gates on compact-feed boolean flags when raw text is empty", () => {
    expect(
      entryHasInstallCommand(
        entry({ hasInstallCommand: true, installCommand: "" }),
      ),
    ).toBe(true);
    expect(
      entryHasConfigSnippet(
        entry({ hasConfigSnippet: true, configSnippet: "" }),
      ),
    ).toBe(true);
    expect(
      entryHasInstallCommand(
        entry({ hasInstallCommand: false, installCommand: "" }),
      ),
    ).toBe(false);
    expect(
      entryHasConfigSnippet(
        entry({ hasConfigSnippet: false, configSnippet: "" }),
      ),
    ).toBe(false);
  });

  it("still gates on non-empty detail text when flags are false", () => {
    expect(
      entryHasInstallCommand(
        entry({
          hasInstallCommand: false,
          installCommand: "npx heyclaude-skill",
        }),
      ),
    ).toBe(true);
    expect(
      entryHasConfigSnippet(
        entry({
          hasConfigSnippet: false,
          configSnippet: '{ "mcpServers": {} }',
        }),
      ),
    ).toBe(true);
  });

  it("treats whitespace-only text as absent", () => {
    expect(
      entryHasInstallCommand(
        entry({ hasInstallCommand: false, installCommand: "   " }),
      ),
    ).toBe(false);
    expect(
      entryHasConfigSnippet(
        entry({ hasConfigSnippet: false, configSnippet: "\n\t" }),
      ),
    ).toBe(false);
  });
});
