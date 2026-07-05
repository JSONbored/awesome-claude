import { describe, expect, it } from "vitest";
import type { Entry } from "@/types/registry";
import {
  comparePageSharePath,
  comparePageShareUrl,
  comparePageShareUrlFromEntries,
} from "@/lib/compare-share-link";

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

describe("compare share link", () => {
  it("builds compare page share paths", () => {
    expect(comparePageSharePath("")).toBe("/compare");
    expect(comparePageSharePath("   ")).toBe("/compare");
    expect(comparePageSharePath("skills/alpha,hooks/beta")).toBe(
      "/compare?ids=skills%2Falpha%2Chooks%2Fbeta",
    );
  });

  it("builds absolute compare page share URLs", () => {
    expect(comparePageShareUrl("", "https://heyclaude.dev")).toBe(
      "https://heyclaude.dev/compare",
    );
    expect(comparePageShareUrl("mcp/fixture", "https://heyclaude.dev")).toBe(
      "https://heyclaude.dev/compare?ids=mcp%2Ffixture",
    );
  });

  it("serializes compared entries into share URLs", () => {
    expect(
      comparePageShareUrlFromEntries(
        [
          entry({ category: "skills", slug: "alpha" }),
          entry({ category: "hooks", slug: "beta" }),
        ],
        "https://heyclaude.dev",
      ),
    ).toBe("https://heyclaude.dev/compare?ids=skills%2Falpha%2Chooks%2Fbeta");
    expect(comparePageShareUrlFromEntries([], "https://heyclaude.dev")).toBe(
      "https://heyclaude.dev/compare",
    );
  });
});
