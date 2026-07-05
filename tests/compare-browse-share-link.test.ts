import { describe, expect, it } from "vitest";
import type { Entry } from "@/types/registry";
import {
  compareBrowseSharePath,
  compareBrowseShareUrl,
  compareBrowseShareUrlForWindow,
  compareBrowseShareUrlFromEntries,
} from "@/lib/compare-browse-share-link";

function entry(overrides: Partial<Entry> = {}): Entry {
  return {
    category: "mcp",
    slug: "fixture",
    title: "Fixture",
    description: "Fixture description",
    author: "Author",
    tags: [],
    platforms: ["claude-code"],
    installType: "manual",
    trust: "review",
    source: "unverified",
    dateAdded: "2026-01-01",
    ...overrides,
  } as Entry;
}

describe("compare browse share link", () => {
  it("builds browse compare share paths", () => {
    expect(compareBrowseSharePath("")).toBe("/browse");
    expect(compareBrowseSharePath("   ")).toBe("/browse");
    expect(compareBrowseSharePath("skills/alpha,hooks/beta")).toBe(
      "/browse?compare=skills%2Falpha%2Chooks%2Fbeta",
    );
  });

  it("builds absolute browse compare share URLs", () => {
    expect(compareBrowseShareUrl("", "https://heyclaude.dev")).toBe(
      "https://heyclaude.dev/browse",
    );
    expect(compareBrowseShareUrl("mcp/fixture", "https://heyclaude.dev")).toBe(
      "https://heyclaude.dev/browse?compare=mcp%2Ffixture",
    );
  });

  it("serializes compared entries into browse share URLs", () => {
    expect(
      compareBrowseShareUrlFromEntries(
        [
          entry({ category: "skills", slug: "alpha" }),
          entry({ category: "hooks", slug: "beta" }),
        ],
        "https://heyclaude.dev",
      ),
    ).toBe(
      "https://heyclaude.dev/browse?compare=skills%2Falpha%2Chooks%2Fbeta",
    );
    expect(compareBrowseShareUrlFromEntries([], "https://heyclaude.dev")).toBe(
      "https://heyclaude.dev/browse",
    );
  });

  it("builds window-backed browse share URLs without an explicit origin", () => {
    expect(
      compareBrowseShareUrlForWindow([
        entry({ category: "skills", slug: "alpha" }),
      ]),
    ).toBe("/browse?compare=skills%2Falpha");
    expect(compareBrowseShareUrlForWindow([])).toBe("/browse");
  });
});
