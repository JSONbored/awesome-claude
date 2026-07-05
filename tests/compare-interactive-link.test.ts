import { describe, expect, it } from "vitest";
import type { Entry } from "@/types/registry";
import {
  COMPARE_INTERACTIVE_MAX,
  COMPARE_INTERACTIVE_MIN,
  canOpenInteractiveCompare,
  compareInteractiveEntryCount,
  compareInteractiveLinkLabel,
  compareInteractiveSearch,
} from "@/lib/compare-interactive-link";

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

describe("compare interactive link", () => {
  it("exposes interactive compare selection limits", () => {
    expect(COMPARE_INTERACTIVE_MIN).toBe(2);
    expect(COMPARE_INTERACTIVE_MAX).toBe(4);
  });

  it("only builds interactive compare links for 2-4 entries", () => {
    expect(canOpenInteractiveCompare([])).toBe(false);
    expect(canOpenInteractiveCompare([entry()])).toBe(false);
    expect(canOpenInteractiveCompare([entry(), entry({ slug: "two" })])).toBe(
      true,
    );
    expect(
      canOpenInteractiveCompare([
        entry(),
        entry({ slug: "two" }),
        entry({ slug: "three" }),
        entry({ slug: "four" }),
      ]),
    ).toBe(true);
    expect(
      canOpenInteractiveCompare([
        entry(),
        entry({ slug: "two" }),
        entry({ slug: "three" }),
        entry({ slug: "four" }),
        entry({ slug: "five" }),
      ]),
    ).toBe(false);
    expect(compareInteractiveSearch([entry()])).toBeNull();
  });

  it("serializes compare search params for the interactive compare page", () => {
    expect(
      compareInteractiveSearch([
        entry({ category: "skills", slug: "alpha" }),
        entry({ category: "hooks", slug: "beta" }),
      ]),
    ).toEqual({ ids: "skills/alpha,hooks/beta" });
  });

  it("caps interactive compare links at four entries", () => {
    const entries = [
      entry({ slug: "one" }),
      entry({ slug: "two" }),
      entry({ slug: "three" }),
      entry({ slug: "four" }),
      entry({ slug: "five" }),
    ];
    expect(compareInteractiveSearch(entries)).toEqual({
      ids: "mcp/one,mcp/two,mcp/three,mcp/four",
    });
    expect(compareInteractiveEntryCount(entries.length)).toBe(4);
  });

  it("formats interactive compare link labels", () => {
    expect(compareInteractiveLinkLabel(2)).toBe(
      "Open in the interactive comparison tool",
    );
    expect(compareInteractiveLinkLabel(3)).toBe(
      "Open 3 picks in the interactive comparison tool",
    );
    expect(compareInteractiveLinkLabel(5)).toBe(
      "Open 4 picks in the interactive comparison tool",
    );
  });
});
