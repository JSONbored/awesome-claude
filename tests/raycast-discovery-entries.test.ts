import { describe, expect, it } from "vitest";

// Deep-relative test imports use the `.js` specifier across this repo's suite;
// the bundler maps it to the TypeScript source.
import {
  attachDiscoveryEntries,
  filterDiscoveryEntries,
  type RaycastEntry,
} from "../integrations/raycast/src/feed.js";

function entry(slug: string, category = "agents"): RaycastEntry {
  return {
    category,
    slug,
    title: slug,
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
  } as RaycastEntry;
}

const ref = (slug: string, extra: Record<string, unknown> = {}) =>
  ({
    key: `agents:${slug}`,
    category: "agents",
    slug,
    title: slug,
    reasons: [],
    ...extra,
  }) as never;

describe("attachDiscoveryEntries", () => {
  it("attaches discovery metadata to matching entries and drops unmatched refs", () => {
    const attached = attachDiscoveryEntries(
      [entry("a"), entry("b")],
      [ref("a"), ref("missing")],
    );
    expect(attached.map((item) => item.slug)).toEqual(["a"]);
    expect(attached[0]).toHaveProperty("discovery");
  });

  it("synthesizes a fallback entry for removed refs only when requested", () => {
    const removed = [ref("removed", { updateKind: "removed" })];
    expect(
      attachDiscoveryEntries([], removed, { fallbackForRemoved: true }),
    ).toHaveLength(1);
    // Without the opt-in, a removed ref with no live entry is dropped.
    expect(attachDiscoveryEntries([], removed)).toHaveLength(0);
  });
});

describe("filterDiscoveryEntries", () => {
  it("keeps only entries in the requested category", () => {
    const filtered = filterDiscoveryEntries(
      [entry("a", "agents"), entry("b", "mcp")] as never,
      "agents",
      new Set<string>(),
    );
    expect(filtered.map((item) => item.slug)).toEqual(["a"]);
  });
});
