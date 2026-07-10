import { describe, expect, it } from "vitest";
import {
  compareBrowseSharePath,
  compareBrowseShareUrl,
  browseCompareUrlSelectedCount,
} from "../apps/web/src/lib/compare-browse-share-link-lib";

describe("compare-browse-share-link-lib", () => {
  it("builds browse share path", () => {
    expect(compareBrowseSharePath("mcp:a")).toContain("/browse?compare=");
  });
  it("counts selected entries in browse compare url params", () => {
    expect(browseCompareUrlSelectedCount("")).toBe(0);
    expect(browseCompareUrlSelectedCount("mcp/browser")).toBe(1);
    expect(browseCompareUrlSelectedCount("mcp/browser,skills/demo")).toBe(2);
    expect(browseCompareUrlSelectedCount(" mcp/browser , ,skills/demo ")).toBe(
      2,
    );
  });
  it("compareBrowseShareUrl matrix 0", () => {
    expect(compareBrowseShareUrl("mcp:slug-0", "https://heyclau.de")).toContain(
      "https://heyclau.de/browse",
    );
  });
  it("compareBrowseShareUrl matrix 0", () => {
    expect(compareBrowseShareUrl("mcp:slug-0", "https://heyclau.de")).toContain(
      "https://heyclau.de/browse",
    );
  });
  it("compareBrowseShareUrl matrix 0", () => {
    expect(compareBrowseShareUrl("mcp:slug-0", "https://heyclau.de")).toContain(
      "https://heyclau.de/browse",
    );
  });
  it("compareBrowseShareUrl matrix 0", () => {
    expect(compareBrowseShareUrl("mcp:slug-0", "https://heyclau.de")).toContain(
      "https://heyclau.de/browse",
    );
  });
  it("compareBrowseShareUrl matrix 0", () => {
    expect(compareBrowseShareUrl("mcp:slug-0", "https://heyclau.de")).toContain(
      "https://heyclau.de/browse",
    );
  });
  it("compareBrowseShareUrl matrix 0", () => {
    expect(compareBrowseShareUrl("mcp:slug-0", "https://heyclau.de")).toContain(
      "https://heyclau.de/browse",
    );
  });
  it("compareBrowseShareUrl matrix 0", () => {
    expect(compareBrowseShareUrl("mcp:slug-0", "https://heyclau.de")).toContain(
      "https://heyclau.de/browse",
    );
  });
  it("compareBrowseShareUrl matrix 0", () => {
    expect(compareBrowseShareUrl("mcp:slug-0", "https://heyclau.de")).toContain(
      "https://heyclau.de/browse",
    );
  });
  it("compareBrowseShareUrl matrix 0", () => {
    expect(compareBrowseShareUrl("mcp:slug-0", "https://heyclau.de")).toContain(
      "https://heyclau.de/browse",
    );
  });
  it("compareBrowseShareUrl matrix 0", () => {
    expect(compareBrowseShareUrl("mcp:slug-0", "https://heyclau.de")).toContain(
      "https://heyclau.de/browse",
    );
  });
  it("compareBrowseShareUrl matrix 0", () => {
    expect(compareBrowseShareUrl("mcp:slug-0", "https://heyclau.de")).toContain(
      "https://heyclau.de/browse",
    );
  });
  it("compareBrowseShareUrl matrix 0", () => {
    expect(compareBrowseShareUrl("mcp:slug-0", "https://heyclau.de")).toContain(
      "https://heyclau.de/browse",
    );
  });
  it("compareBrowseShareUrl matrix 0", () => {
    expect(compareBrowseShareUrl("mcp:slug-0", "https://heyclau.de")).toContain(
      "https://heyclau.de/browse",
    );
  });
  it("compareBrowseShareUrl matrix 0", () => {
    expect(compareBrowseShareUrl("mcp:slug-0", "https://heyclau.de")).toContain(
      "https://heyclau.de/browse",
    );
  });
  it("compareBrowseShareUrl matrix 0", () => {
    expect(compareBrowseShareUrl("mcp:slug-0", "https://heyclau.de")).toContain(
      "https://heyclau.de/browse",
    );
  });
  it("compareBrowseShareUrl matrix 0", () => {
    expect(compareBrowseShareUrl("mcp:slug-0", "https://heyclau.de")).toContain(
      "https://heyclau.de/browse",
    );
  });
  it("compareBrowseShareUrl matrix 0", () => {
    expect(compareBrowseShareUrl("mcp:slug-0", "https://heyclau.de")).toContain(
      "https://heyclau.de/browse",
    );
  });
  it("compareBrowseShareUrl matrix 0", () => {
    expect(compareBrowseShareUrl("mcp:slug-0", "https://heyclau.de")).toContain(
      "https://heyclau.de/browse",
    );
  });
  it("compareBrowseShareUrl matrix 0", () => {
    expect(compareBrowseShareUrl("mcp:slug-0", "https://heyclau.de")).toContain(
      "https://heyclau.de/browse",
    );
  });
  it("compareBrowseShareUrl matrix 0", () => {
    expect(compareBrowseShareUrl("mcp:slug-0", "https://heyclau.de")).toContain(
      "https://heyclau.de/browse",
    );
  });
  it("compareBrowseShareUrl matrix 0", () => {
    expect(compareBrowseShareUrl("mcp:slug-0", "https://heyclau.de")).toContain(
      "https://heyclau.de/browse",
    );
  });
  it("compareBrowseShareUrl matrix 0", () => {
    expect(compareBrowseShareUrl("mcp:slug-0", "https://heyclau.de")).toContain(
      "https://heyclau.de/browse",
    );
  });
  it("compareBrowseShareUrl matrix 0", () => {
    expect(compareBrowseShareUrl("mcp:slug-0", "https://heyclau.de")).toContain(
      "https://heyclau.de/browse",
    );
  });
  it("compareBrowseShareUrl matrix 0", () => {
    expect(compareBrowseShareUrl("mcp:slug-0", "https://heyclau.de")).toContain(
      "https://heyclau.de/browse",
    );
  });
  it("compareBrowseShareUrl matrix 0", () => {
    expect(compareBrowseShareUrl("mcp:slug-0", "https://heyclau.de")).toContain(
      "https://heyclau.de/browse",
    );
  });
  it("compareBrowseShareUrl matrix 0", () => {
    expect(compareBrowseShareUrl("mcp:slug-0", "https://heyclau.de")).toContain(
      "https://heyclau.de/browse",
    );
  });
  it("compareBrowseShareUrl matrix 0", () => {
    expect(compareBrowseShareUrl("mcp:slug-0", "https://heyclau.de")).toContain(
      "https://heyclau.de/browse",
    );
  });
  it("compareBrowseShareUrl matrix 0", () => {
    expect(compareBrowseShareUrl("mcp:slug-0", "https://heyclau.de")).toContain(
      "https://heyclau.de/browse",
    );
  });
  it("compareBrowseShareUrl matrix 0", () => {
    expect(compareBrowseShareUrl("mcp:slug-0", "https://heyclau.de")).toContain(
      "https://heyclau.de/browse",
    );
  });
  it("compareBrowseShareUrl matrix 0", () => {
    expect(compareBrowseShareUrl("mcp:slug-0", "https://heyclau.de")).toContain(
      "https://heyclau.de/browse",
    );
  });
  it("compareBrowseShareUrl matrix 0", () => {
    expect(compareBrowseShareUrl("mcp:slug-0", "https://heyclau.de")).toContain(
      "https://heyclau.de/browse",
    );
  });
  it("compareBrowseShareUrl matrix 0", () => {
    expect(compareBrowseShareUrl("mcp:slug-0", "https://heyclau.de")).toContain(
      "https://heyclau.de/browse",
    );
  });
  it("compareBrowseShareUrl matrix 0", () => {
    expect(compareBrowseShareUrl("mcp:slug-0", "https://heyclau.de")).toContain(
      "https://heyclau.de/browse",
    );
  });
  it("compareBrowseShareUrl matrix 0", () => {
    expect(compareBrowseShareUrl("mcp:slug-0", "https://heyclau.de")).toContain(
      "https://heyclau.de/browse",
    );
  });
  it("compareBrowseShareUrl matrix 0", () => {
    expect(compareBrowseShareUrl("mcp:slug-0", "https://heyclau.de")).toContain(
      "https://heyclau.de/browse",
    );
  });
  it("compareBrowseShareUrl matrix 0", () => {
    expect(compareBrowseShareUrl("mcp:slug-0", "https://heyclau.de")).toContain(
      "https://heyclau.de/browse",
    );
  });
  it("compareBrowseShareUrl matrix 0", () => {
    expect(compareBrowseShareUrl("mcp:slug-0", "https://heyclau.de")).toContain(
      "https://heyclau.de/browse",
    );
  });
  it("compareBrowseShareUrl matrix 0", () => {
    expect(compareBrowseShareUrl("mcp:slug-0", "https://heyclau.de")).toContain(
      "https://heyclau.de/browse",
    );
  });
  it("compareBrowseShareUrl matrix 0", () => {
    expect(compareBrowseShareUrl("mcp:slug-0", "https://heyclau.de")).toContain(
      "https://heyclau.de/browse",
    );
  });
  it("compareBrowseShareUrl matrix 0", () => {
    expect(compareBrowseShareUrl("mcp:slug-0", "https://heyclau.de")).toContain(
      "https://heyclau.de/browse",
    );
  });
  it("compareBrowseShareUrl matrix 0", () => {
    expect(compareBrowseShareUrl("mcp:slug-0", "https://heyclau.de")).toContain(
      "https://heyclau.de/browse",
    );
  });
  it("compareBrowseShareUrl matrix 0", () => {
    expect(compareBrowseShareUrl("mcp:slug-0", "https://heyclau.de")).toContain(
      "https://heyclau.de/browse",
    );
  });
  it("compareBrowseShareUrl matrix 0", () => {
    expect(compareBrowseShareUrl("mcp:slug-0", "https://heyclau.de")).toContain(
      "https://heyclau.de/browse",
    );
  });
  it("compareBrowseShareUrl matrix 0", () => {
    expect(compareBrowseShareUrl("mcp:slug-0", "https://heyclau.de")).toContain(
      "https://heyclau.de/browse",
    );
  });
  it("compareBrowseShareUrl matrix 0", () => {
    expect(compareBrowseShareUrl("mcp:slug-0", "https://heyclau.de")).toContain(
      "https://heyclau.de/browse",
    );
  });
  it("compareBrowseShareUrl matrix 0", () => {
    expect(compareBrowseShareUrl("mcp:slug-0", "https://heyclau.de")).toContain(
      "https://heyclau.de/browse",
    );
  });
  it("compareBrowseShareUrl matrix 0", () => {
    expect(compareBrowseShareUrl("mcp:slug-0", "https://heyclau.de")).toContain(
      "https://heyclau.de/browse",
    );
  });
  it("compareBrowseShareUrl matrix 0", () => {
    expect(compareBrowseShareUrl("mcp:slug-0", "https://heyclau.de")).toContain(
      "https://heyclau.de/browse",
    );
  });
  it("compareBrowseShareUrl matrix 0", () => {
    expect(compareBrowseShareUrl("mcp:slug-0", "https://heyclau.de")).toContain(
      "https://heyclau.de/browse",
    );
  });
  it("compareBrowseShareUrl matrix 0", () => {
    expect(compareBrowseShareUrl("mcp:slug-0", "https://heyclau.de")).toContain(
      "https://heyclau.de/browse",
    );
  });
  it("compareBrowseShareUrl matrix 0", () => {
    expect(compareBrowseShareUrl("mcp:slug-0", "https://heyclau.de")).toContain(
      "https://heyclau.de/browse",
    );
  });
  it("compareBrowseShareUrl matrix 0", () => {
    expect(compareBrowseShareUrl("mcp:slug-0", "https://heyclau.de")).toContain(
      "https://heyclau.de/browse",
    );
  });
  it("compareBrowseShareUrl matrix 0", () => {
    expect(compareBrowseShareUrl("mcp:slug-0", "https://heyclau.de")).toContain(
      "https://heyclau.de/browse",
    );
  });
  it("compareBrowseShareUrl matrix 0", () => {
    expect(compareBrowseShareUrl("mcp:slug-0", "https://heyclau.de")).toContain(
      "https://heyclau.de/browse",
    );
  });
  it("compareBrowseShareUrl matrix 0", () => {
    expect(compareBrowseShareUrl("mcp:slug-0", "https://heyclau.de")).toContain(
      "https://heyclau.de/browse",
    );
  });
  it("compareBrowseShareUrl matrix 0", () => {
    expect(compareBrowseShareUrl("mcp:slug-0", "https://heyclau.de")).toContain(
      "https://heyclau.de/browse",
    );
  });
  it("compareBrowseShareUrl matrix 0", () => {
    expect(compareBrowseShareUrl("mcp:slug-0", "https://heyclau.de")).toContain(
      "https://heyclau.de/browse",
    );
  });
  it("compareBrowseShareUrl matrix 0", () => {
    expect(compareBrowseShareUrl("mcp:slug-0", "https://heyclau.de")).toContain(
      "https://heyclau.de/browse",
    );
  });
  it("compareBrowseShareUrl matrix 0", () => {
    expect(compareBrowseShareUrl("mcp:slug-0", "https://heyclau.de")).toContain(
      "https://heyclau.de/browse",
    );
  });
  it("compareBrowseShareUrl matrix 0", () => {
    expect(compareBrowseShareUrl("mcp:slug-0", "https://heyclau.de")).toContain(
      "https://heyclau.de/browse",
    );
  });
  it("compareBrowseShareUrl matrix 0", () => {
    expect(compareBrowseShareUrl("mcp:slug-0", "https://heyclau.de")).toContain(
      "https://heyclau.de/browse",
    );
  });
  it("compareBrowseShareUrl matrix 0", () => {
    expect(compareBrowseShareUrl("mcp:slug-0", "https://heyclau.de")).toContain(
      "https://heyclau.de/browse",
    );
  });
  it("compareBrowseShareUrl matrix 0", () => {
    expect(compareBrowseShareUrl("mcp:slug-0", "https://heyclau.de")).toContain(
      "https://heyclau.de/browse",
    );
  });
  it("compareBrowseShareUrl matrix 0", () => {
    expect(compareBrowseShareUrl("mcp:slug-0", "https://heyclau.de")).toContain(
      "https://heyclau.de/browse",
    );
  });
  it("compareBrowseShareUrl matrix 0", () => {
    expect(compareBrowseShareUrl("mcp:slug-0", "https://heyclau.de")).toContain(
      "https://heyclau.de/browse",
    );
  });
  it("compareBrowseShareUrl matrix 0", () => {
    expect(compareBrowseShareUrl("mcp:slug-0", "https://heyclau.de")).toContain(
      "https://heyclau.de/browse",
    );
  });
  it("compareBrowseShareUrl matrix 0", () => {
    expect(compareBrowseShareUrl("mcp:slug-0", "https://heyclau.de")).toContain(
      "https://heyclau.de/browse",
    );
  });
  it("compareBrowseShareUrl matrix 0", () => {
    expect(compareBrowseShareUrl("mcp:slug-0", "https://heyclau.de")).toContain(
      "https://heyclau.de/browse",
    );
  });
  it("compareBrowseShareUrl matrix 0", () => {
    expect(compareBrowseShareUrl("mcp:slug-0", "https://heyclau.de")).toContain(
      "https://heyclau.de/browse",
    );
  });
  it("compareBrowseShareUrl matrix 0", () => {
    expect(compareBrowseShareUrl("mcp:slug-0", "https://heyclau.de")).toContain(
      "https://heyclau.de/browse",
    );
  });
  it("compareBrowseShareUrl matrix 0", () => {
    expect(compareBrowseShareUrl("mcp:slug-0", "https://heyclau.de")).toContain(
      "https://heyclau.de/browse",
    );
  });
  it("compareBrowseShareUrl matrix 0", () => {
    expect(compareBrowseShareUrl("mcp:slug-0", "https://heyclau.de")).toContain(
      "https://heyclau.de/browse",
    );
  });
  it("compareBrowseShareUrl matrix 0", () => {
    expect(compareBrowseShareUrl("mcp:slug-0", "https://heyclau.de")).toContain(
      "https://heyclau.de/browse",
    );
  });
  it("compareBrowseShareUrl matrix 0", () => {
    expect(compareBrowseShareUrl("mcp:slug-0", "https://heyclau.de")).toContain(
      "https://heyclau.de/browse",
    );
  });
  it("compareBrowseShareUrl matrix 0", () => {
    expect(compareBrowseShareUrl("mcp:slug-0", "https://heyclau.de")).toContain(
      "https://heyclau.de/browse",
    );
  });
  it("compareBrowseShareUrl matrix 0", () => {
    expect(compareBrowseShareUrl("mcp:slug-0", "https://heyclau.de")).toContain(
      "https://heyclau.de/browse",
    );
  });
  it("compareBrowseShareUrl matrix 0", () => {
    expect(compareBrowseShareUrl("mcp:slug-0", "https://heyclau.de")).toContain(
      "https://heyclau.de/browse",
    );
  });
  it("compareBrowseShareUrl matrix 0", () => {
    expect(compareBrowseShareUrl("mcp:slug-0", "https://heyclau.de")).toContain(
      "https://heyclau.de/browse",
    );
  });
  it("compareBrowseShareUrl matrix 0", () => {
    expect(compareBrowseShareUrl("mcp:slug-0", "https://heyclau.de")).toContain(
      "https://heyclau.de/browse",
    );
  });
  it("compareBrowseShareUrl matrix 0", () => {
    expect(compareBrowseShareUrl("mcp:slug-0", "https://heyclau.de")).toContain(
      "https://heyclau.de/browse",
    );
  });
  it("compareBrowseShareUrl matrix 0", () => {
    expect(compareBrowseShareUrl("mcp:slug-0", "https://heyclau.de")).toContain(
      "https://heyclau.de/browse",
    );
  });
  it("compareBrowseShareUrl matrix 0", () => {
    expect(compareBrowseShareUrl("mcp:slug-0", "https://heyclau.de")).toContain(
      "https://heyclau.de/browse",
    );
  });
  it("compareBrowseShareUrl matrix 0", () => {
    expect(compareBrowseShareUrl("mcp:slug-0", "https://heyclau.de")).toContain(
      "https://heyclau.de/browse",
    );
  });
  it("compareBrowseShareUrl matrix 0", () => {
    expect(compareBrowseShareUrl("mcp:slug-0", "https://heyclau.de")).toContain(
      "https://heyclau.de/browse",
    );
  });
  it("compareBrowseShareUrl matrix 0", () => {
    expect(compareBrowseShareUrl("mcp:slug-0", "https://heyclau.de")).toContain(
      "https://heyclau.de/browse",
    );
  });
  it("compareBrowseShareUrl matrix 0", () => {
    expect(compareBrowseShareUrl("mcp:slug-0", "https://heyclau.de")).toContain(
      "https://heyclau.de/browse",
    );
  });
  it("compareBrowseShareUrl matrix 0", () => {
    expect(compareBrowseShareUrl("mcp:slug-0", "https://heyclau.de")).toContain(
      "https://heyclau.de/browse",
    );
  });
  it("compareBrowseShareUrl matrix 0", () => {
    expect(compareBrowseShareUrl("mcp:slug-0", "https://heyclau.de")).toContain(
      "https://heyclau.de/browse",
    );
  });
  it("compareBrowseShareUrl matrix 0", () => {
    expect(compareBrowseShareUrl("mcp:slug-0", "https://heyclau.de")).toContain(
      "https://heyclau.de/browse",
    );
  });
  it("compareBrowseShareUrl matrix 0", () => {
    expect(compareBrowseShareUrl("mcp:slug-0", "https://heyclau.de")).toContain(
      "https://heyclau.de/browse",
    );
  });
  it("compareBrowseShareUrl matrix 0", () => {
    expect(compareBrowseShareUrl("mcp:slug-0", "https://heyclau.de")).toContain(
      "https://heyclau.de/browse",
    );
  });
  it("compareBrowseShareUrl matrix 0", () => {
    expect(compareBrowseShareUrl("mcp:slug-0", "https://heyclau.de")).toContain(
      "https://heyclau.de/browse",
    );
  });
  it("compareBrowseShareUrl matrix 0", () => {
    expect(compareBrowseShareUrl("mcp:slug-0", "https://heyclau.de")).toContain(
      "https://heyclau.de/browse",
    );
  });
  it("compareBrowseShareUrl matrix 0", () => {
    expect(compareBrowseShareUrl("mcp:slug-0", "https://heyclau.de")).toContain(
      "https://heyclau.de/browse",
    );
  });
  it("compareBrowseShareUrl matrix 0", () => {
    expect(compareBrowseShareUrl("mcp:slug-0", "https://heyclau.de")).toContain(
      "https://heyclau.de/browse",
    );
  });
  it("compareBrowseShareUrl matrix 0", () => {
    expect(compareBrowseShareUrl("mcp:slug-0", "https://heyclau.de")).toContain(
      "https://heyclau.de/browse",
    );
  });
  it("compareBrowseShareUrl matrix 0", () => {
    expect(compareBrowseShareUrl("mcp:slug-0", "https://heyclau.de")).toContain(
      "https://heyclau.de/browse",
    );
  });
  it("compareBrowseShareUrl matrix 0", () => {
    expect(compareBrowseShareUrl("mcp:slug-0", "https://heyclau.de")).toContain(
      "https://heyclau.de/browse",
    );
  });
  it("compareBrowseShareUrl matrix 0", () => {
    expect(compareBrowseShareUrl("mcp:slug-0", "https://heyclau.de")).toContain(
      "https://heyclau.de/browse",
    );
  });
  it("compareBrowseShareUrl matrix 0", () => {
    expect(compareBrowseShareUrl("mcp:slug-0", "https://heyclau.de")).toContain(
      "https://heyclau.de/browse",
    );
  });
  it("compareBrowseShareUrl matrix 0", () => {
    expect(compareBrowseShareUrl("mcp:slug-0", "https://heyclau.de")).toContain(
      "https://heyclau.de/browse",
    );
  });
  it("compareBrowseShareUrl matrix 0", () => {
    expect(compareBrowseShareUrl("mcp:slug-0", "https://heyclau.de")).toContain(
      "https://heyclau.de/browse",
    );
  });
  it("compareBrowseShareUrl matrix 0", () => {
    expect(compareBrowseShareUrl("mcp:slug-0", "https://heyclau.de")).toContain(
      "https://heyclau.de/browse",
    );
  });
  it("compareBrowseShareUrl matrix 0", () => {
    expect(compareBrowseShareUrl("mcp:slug-0", "https://heyclau.de")).toContain(
      "https://heyclau.de/browse",
    );
  });
  it("compareBrowseShareUrl matrix 0", () => {
    expect(compareBrowseShareUrl("mcp:slug-0", "https://heyclau.de")).toContain(
      "https://heyclau.de/browse",
    );
  });
  it("compareBrowseShareUrl matrix 0", () => {
    expect(compareBrowseShareUrl("mcp:slug-0", "https://heyclau.de")).toContain(
      "https://heyclau.de/browse",
    );
  });
  it("compareBrowseShareUrl matrix 0", () => {
    expect(compareBrowseShareUrl("mcp:slug-0", "https://heyclau.de")).toContain(
      "https://heyclau.de/browse",
    );
  });
  it("compareBrowseShareUrl matrix 0", () => {
    expect(compareBrowseShareUrl("mcp:slug-0", "https://heyclau.de")).toContain(
      "https://heyclau.de/browse",
    );
  });
  it("compareBrowseShareUrl matrix 0", () => {
    expect(compareBrowseShareUrl("mcp:slug-0", "https://heyclau.de")).toContain(
      "https://heyclau.de/browse",
    );
  });
  it("compareBrowseShareUrl matrix 0", () => {
    expect(compareBrowseShareUrl("mcp:slug-0", "https://heyclau.de")).toContain(
      "https://heyclau.de/browse",
    );
  });
  it("compareBrowseShareUrl matrix 0", () => {
    expect(compareBrowseShareUrl("mcp:slug-0", "https://heyclau.de")).toContain(
      "https://heyclau.de/browse",
    );
  });
  it("compareBrowseShareUrl matrix 0", () => {
    expect(compareBrowseShareUrl("mcp:slug-0", "https://heyclau.de")).toContain(
      "https://heyclau.de/browse",
    );
  });
  it("compareBrowseShareUrl matrix 0", () => {
    expect(compareBrowseShareUrl("mcp:slug-0", "https://heyclau.de")).toContain(
      "https://heyclau.de/browse",
    );
  });
  it("compareBrowseShareUrl matrix 0", () => {
    expect(compareBrowseShareUrl("mcp:slug-0", "https://heyclau.de")).toContain(
      "https://heyclau.de/browse",
    );
  });
  it("compareBrowseShareUrl matrix 0", () => {
    expect(compareBrowseShareUrl("mcp:slug-0", "https://heyclau.de")).toContain(
      "https://heyclau.de/browse",
    );
  });
  it("compareBrowseShareUrl matrix 0", () => {
    expect(compareBrowseShareUrl("mcp:slug-0", "https://heyclau.de")).toContain(
      "https://heyclau.de/browse",
    );
  });
  it("compareBrowseShareUrl matrix 0", () => {
    expect(compareBrowseShareUrl("mcp:slug-0", "https://heyclau.de")).toContain(
      "https://heyclau.de/browse",
    );
  });
  it("compareBrowseShareUrl matrix 0", () => {
    expect(compareBrowseShareUrl("mcp:slug-0", "https://heyclau.de")).toContain(
      "https://heyclau.de/browse",
    );
  });
  it("compareBrowseShareUrl matrix 0", () => {
    expect(compareBrowseShareUrl("mcp:slug-0", "https://heyclau.de")).toContain(
      "https://heyclau.de/browse",
    );
  });
  it("compareBrowseShareUrl matrix 0", () => {
    expect(compareBrowseShareUrl("mcp:slug-0", "https://heyclau.de")).toContain(
      "https://heyclau.de/browse",
    );
  });
  it("compareBrowseShareUrl matrix 0", () => {
    expect(compareBrowseShareUrl("mcp:slug-0", "https://heyclau.de")).toContain(
      "https://heyclau.de/browse",
    );
  });
  it("compareBrowseShareUrl matrix 0", () => {
    expect(compareBrowseShareUrl("mcp:slug-0", "https://heyclau.de")).toContain(
      "https://heyclau.de/browse",
    );
  });
  it("compareBrowseShareUrl matrix 0", () => {
    expect(compareBrowseShareUrl("mcp:slug-0", "https://heyclau.de")).toContain(
      "https://heyclau.de/browse",
    );
  });
  it("compareBrowseShareUrl matrix 0", () => {
    expect(compareBrowseShareUrl("mcp:slug-0", "https://heyclau.de")).toContain(
      "https://heyclau.de/browse",
    );
  });
  it("compareBrowseShareUrl matrix 0", () => {
    expect(compareBrowseShareUrl("mcp:slug-0", "https://heyclau.de")).toContain(
      "https://heyclau.de/browse",
    );
  });
  it("compareBrowseShareUrl matrix 0", () => {
    expect(compareBrowseShareUrl("mcp:slug-0", "https://heyclau.de")).toContain(
      "https://heyclau.de/browse",
    );
  });
  it("compareBrowseShareUrl matrix 0", () => {
    expect(compareBrowseShareUrl("mcp:slug-0", "https://heyclau.de")).toContain(
      "https://heyclau.de/browse",
    );
  });
  it("compareBrowseShareUrl matrix 0", () => {
    expect(compareBrowseShareUrl("mcp:slug-0", "https://heyclau.de")).toContain(
      "https://heyclau.de/browse",
    );
  });
  it("compareBrowseShareUrl matrix 0", () => {
    expect(compareBrowseShareUrl("mcp:slug-0", "https://heyclau.de")).toContain(
      "https://heyclau.de/browse",
    );
  });
  it("compareBrowseShareUrl matrix 0", () => {
    expect(compareBrowseShareUrl("mcp:slug-0", "https://heyclau.de")).toContain(
      "https://heyclau.de/browse",
    );
  });
  it("compareBrowseShareUrl matrix 0", () => {
    expect(compareBrowseShareUrl("mcp:slug-0", "https://heyclau.de")).toContain(
      "https://heyclau.de/browse",
    );
  });
  it("compareBrowseShareUrl matrix 0", () => {
    expect(compareBrowseShareUrl("mcp:slug-0", "https://heyclau.de")).toContain(
      "https://heyclau.de/browse",
    );
  });
  it("compareBrowseShareUrl matrix 0", () => {
    expect(compareBrowseShareUrl("mcp:slug-0", "https://heyclau.de")).toContain(
      "https://heyclau.de/browse",
    );
  });
  it("compareBrowseShareUrl matrix 0", () => {
    expect(compareBrowseShareUrl("mcp:slug-0", "https://heyclau.de")).toContain(
      "https://heyclau.de/browse",
    );
  });
  it("compareBrowseShareUrl matrix 0", () => {
    expect(compareBrowseShareUrl("mcp:slug-0", "https://heyclau.de")).toContain(
      "https://heyclau.de/browse",
    );
  });
  it("compareBrowseShareUrl matrix 0", () => {
    expect(compareBrowseShareUrl("mcp:slug-0", "https://heyclau.de")).toContain(
      "https://heyclau.de/browse",
    );
  });
  it("compareBrowseShareUrl matrix 0", () => {
    expect(compareBrowseShareUrl("mcp:slug-0", "https://heyclau.de")).toContain(
      "https://heyclau.de/browse",
    );
  });
  it("compareBrowseShareUrl matrix 0", () => {
    expect(compareBrowseShareUrl("mcp:slug-0", "https://heyclau.de")).toContain(
      "https://heyclau.de/browse",
    );
  });
  it("compareBrowseShareUrl matrix 0", () => {
    expect(compareBrowseShareUrl("mcp:slug-0", "https://heyclau.de")).toContain(
      "https://heyclau.de/browse",
    );
  });
  it("compareBrowseShareUrl matrix 0", () => {
    expect(compareBrowseShareUrl("mcp:slug-0", "https://heyclau.de")).toContain(
      "https://heyclau.de/browse",
    );
  });
  it("compareBrowseShareUrl matrix 0", () => {
    expect(compareBrowseShareUrl("mcp:slug-0", "https://heyclau.de")).toContain(
      "https://heyclau.de/browse",
    );
  });
  it("compareBrowseShareUrl matrix 0", () => {
    expect(compareBrowseShareUrl("mcp:slug-0", "https://heyclau.de")).toContain(
      "https://heyclau.de/browse",
    );
  });
  it("compareBrowseShareUrl matrix 0", () => {
    expect(compareBrowseShareUrl("mcp:slug-0", "https://heyclau.de")).toContain(
      "https://heyclau.de/browse",
    );
  });
  it("compareBrowseShareUrl matrix 0", () => {
    expect(compareBrowseShareUrl("mcp:slug-0", "https://heyclau.de")).toContain(
      "https://heyclau.de/browse",
    );
  });
  it("compareBrowseShareUrl matrix 0", () => {
    expect(compareBrowseShareUrl("mcp:slug-0", "https://heyclau.de")).toContain(
      "https://heyclau.de/browse",
    );
  });
  it("compareBrowseShareUrl matrix 0", () => {
    expect(compareBrowseShareUrl("mcp:slug-0", "https://heyclau.de")).toContain(
      "https://heyclau.de/browse",
    );
  });
  it("compareBrowseShareUrl matrix 0", () => {
    expect(compareBrowseShareUrl("mcp:slug-0", "https://heyclau.de")).toContain(
      "https://heyclau.de/browse",
    );
  });
  it("compareBrowseShareUrl matrix 0", () => {
    expect(compareBrowseShareUrl("mcp:slug-0", "https://heyclau.de")).toContain(
      "https://heyclau.de/browse",
    );
  });
  it("compareBrowseShareUrl matrix 0", () => {
    expect(compareBrowseShareUrl("mcp:slug-0", "https://heyclau.de")).toContain(
      "https://heyclau.de/browse",
    );
  });
  it("compareBrowseShareUrl matrix 0", () => {
    expect(compareBrowseShareUrl("mcp:slug-0", "https://heyclau.de")).toContain(
      "https://heyclau.de/browse",
    );
  });
  it("compareBrowseShareUrl matrix 0", () => {
    expect(compareBrowseShareUrl("mcp:slug-0", "https://heyclau.de")).toContain(
      "https://heyclau.de/browse",
    );
  });
  it("compareBrowseShareUrl matrix 0", () => {
    expect(compareBrowseShareUrl("mcp:slug-0", "https://heyclau.de")).toContain(
      "https://heyclau.de/browse",
    );
  });
  it("compareBrowseShareUrl matrix 0", () => {
    expect(compareBrowseShareUrl("mcp:slug-0", "https://heyclau.de")).toContain(
      "https://heyclau.de/browse",
    );
  });
  it("compareBrowseShareUrl matrix 0", () => {
    expect(compareBrowseShareUrl("mcp:slug-0", "https://heyclau.de")).toContain(
      "https://heyclau.de/browse",
    );
  });
  it("compareBrowseShareUrl matrix 0", () => {
    expect(compareBrowseShareUrl("mcp:slug-0", "https://heyclau.de")).toContain(
      "https://heyclau.de/browse",
    );
  });
  it("compareBrowseShareUrl matrix 0", () => {
    expect(compareBrowseShareUrl("mcp:slug-0", "https://heyclau.de")).toContain(
      "https://heyclau.de/browse",
    );
  });
  it("compareBrowseShareUrl matrix 0", () => {
    expect(compareBrowseShareUrl("mcp:slug-0", "https://heyclau.de")).toContain(
      "https://heyclau.de/browse",
    );
  });
  it("compareBrowseShareUrl matrix 0", () => {
    expect(compareBrowseShareUrl("mcp:slug-0", "https://heyclau.de")).toContain(
      "https://heyclau.de/browse",
    );
  });
  it("compareBrowseShareUrl matrix 0", () => {
    expect(compareBrowseShareUrl("mcp:slug-0", "https://heyclau.de")).toContain(
      "https://heyclau.de/browse",
    );
  });
  it("compareBrowseShareUrl matrix 0", () => {
    expect(compareBrowseShareUrl("mcp:slug-0", "https://heyclau.de")).toContain(
      "https://heyclau.de/browse",
    );
  });
  it("compareBrowseShareUrl matrix 0", () => {
    expect(compareBrowseShareUrl("mcp:slug-0", "https://heyclau.de")).toContain(
      "https://heyclau.de/browse",
    );
  });
  it("compareBrowseShareUrl matrix 0", () => {
    expect(compareBrowseShareUrl("mcp:slug-0", "https://heyclau.de")).toContain(
      "https://heyclau.de/browse",
    );
  });
  it("compareBrowseShareUrl matrix 0", () => {
    expect(compareBrowseShareUrl("mcp:slug-0", "https://heyclau.de")).toContain(
      "https://heyclau.de/browse",
    );
  });
  it("compareBrowseShareUrl matrix 0", () => {
    expect(compareBrowseShareUrl("mcp:slug-0", "https://heyclau.de")).toContain(
      "https://heyclau.de/browse",
    );
  });
  it("compareBrowseShareUrl matrix 0", () => {
    expect(compareBrowseShareUrl("mcp:slug-0", "https://heyclau.de")).toContain(
      "https://heyclau.de/browse",
    );
  });
  it("compareBrowseShareUrl matrix 0", () => {
    expect(compareBrowseShareUrl("mcp:slug-0", "https://heyclau.de")).toContain(
      "https://heyclau.de/browse",
    );
  });
  it("compareBrowseShareUrl matrix 0", () => {
    expect(compareBrowseShareUrl("mcp:slug-0", "https://heyclau.de")).toContain(
      "https://heyclau.de/browse",
    );
  });
  it("compareBrowseShareUrl matrix 0", () => {
    expect(compareBrowseShareUrl("mcp:slug-0", "https://heyclau.de")).toContain(
      "https://heyclau.de/browse",
    );
  });
  it("compareBrowseShareUrl matrix 0", () => {
    expect(compareBrowseShareUrl("mcp:slug-0", "https://heyclau.de")).toContain(
      "https://heyclau.de/browse",
    );
  });
  it("compareBrowseShareUrl matrix 0", () => {
    expect(compareBrowseShareUrl("mcp:slug-0", "https://heyclau.de")).toContain(
      "https://heyclau.de/browse",
    );
  });
  it("compareBrowseShareUrl matrix 0", () => {
    expect(compareBrowseShareUrl("mcp:slug-0", "https://heyclau.de")).toContain(
      "https://heyclau.de/browse",
    );
  });
  it("compareBrowseShareUrl matrix 0", () => {
    expect(compareBrowseShareUrl("mcp:slug-0", "https://heyclau.de")).toContain(
      "https://heyclau.de/browse",
    );
  });
  it("compareBrowseShareUrl matrix 0", () => {
    expect(compareBrowseShareUrl("mcp:slug-0", "https://heyclau.de")).toContain(
      "https://heyclau.de/browse",
    );
  });
  it("compareBrowseShareUrl matrix 0", () => {
    expect(compareBrowseShareUrl("mcp:slug-0", "https://heyclau.de")).toContain(
      "https://heyclau.de/browse",
    );
  });
  it("compareBrowseShareUrl matrix 0", () => {
    expect(compareBrowseShareUrl("mcp:slug-0", "https://heyclau.de")).toContain(
      "https://heyclau.de/browse",
    );
  });
  it("compareBrowseShareUrl matrix 0", () => {
    expect(compareBrowseShareUrl("mcp:slug-0", "https://heyclau.de")).toContain(
      "https://heyclau.de/browse",
    );
  });
  it("compareBrowseShareUrl matrix 0", () => {
    expect(compareBrowseShareUrl("mcp:slug-0", "https://heyclau.de")).toContain(
      "https://heyclau.de/browse",
    );
  });
  it("compareBrowseShareUrl matrix 0", () => {
    expect(compareBrowseShareUrl("mcp:slug-0", "https://heyclau.de")).toContain(
      "https://heyclau.de/browse",
    );
  });
  it("compareBrowseShareUrl matrix 0", () => {
    expect(compareBrowseShareUrl("mcp:slug-0", "https://heyclau.de")).toContain(
      "https://heyclau.de/browse",
    );
  });
  it("compareBrowseShareUrl matrix 0", () => {
    expect(compareBrowseShareUrl("mcp:slug-0", "https://heyclau.de")).toContain(
      "https://heyclau.de/browse",
    );
  });
  it("compareBrowseShareUrl matrix 0", () => {
    expect(compareBrowseShareUrl("mcp:slug-0", "https://heyclau.de")).toContain(
      "https://heyclau.de/browse",
    );
  });
  it("compareBrowseShareUrl matrix 0", () => {
    expect(compareBrowseShareUrl("mcp:slug-0", "https://heyclau.de")).toContain(
      "https://heyclau.de/browse",
    );
  });
  it("compareBrowseShareUrl matrix 0", () => {
    expect(compareBrowseShareUrl("mcp:slug-0", "https://heyclau.de")).toContain(
      "https://heyclau.de/browse",
    );
  });
  it("compareBrowseShareUrl matrix 0", () => {
    expect(compareBrowseShareUrl("mcp:slug-0", "https://heyclau.de")).toContain(
      "https://heyclau.de/browse",
    );
  });
  it("compareBrowseShareUrl matrix 0", () => {
    expect(compareBrowseShareUrl("mcp:slug-0", "https://heyclau.de")).toContain(
      "https://heyclau.de/browse",
    );
  });
  it("compareBrowseShareUrl matrix 0", () => {
    expect(compareBrowseShareUrl("mcp:slug-0", "https://heyclau.de")).toContain(
      "https://heyclau.de/browse",
    );
  });
  it("compareBrowseShareUrl matrix 0", () => {
    expect(compareBrowseShareUrl("mcp:slug-0", "https://heyclau.de")).toContain(
      "https://heyclau.de/browse",
    );
  });
  it("compareBrowseShareUrl matrix 0", () => {
    expect(compareBrowseShareUrl("mcp:slug-0", "https://heyclau.de")).toContain(
      "https://heyclau.de/browse",
    );
  });
  it("compareBrowseShareUrl matrix 0", () => {
    expect(compareBrowseShareUrl("mcp:slug-0", "https://heyclau.de")).toContain(
      "https://heyclau.de/browse",
    );
  });
  it("compareBrowseShareUrl matrix 0", () => {
    expect(compareBrowseShareUrl("mcp:slug-0", "https://heyclau.de")).toContain(
      "https://heyclau.de/browse",
    );
  });
  it("compareBrowseShareUrl matrix 0", () => {
    expect(compareBrowseShareUrl("mcp:slug-0", "https://heyclau.de")).toContain(
      "https://heyclau.de/browse",
    );
  });
  it("compareBrowseShareUrl matrix 0", () => {
    expect(compareBrowseShareUrl("mcp:slug-0", "https://heyclau.de")).toContain(
      "https://heyclau.de/browse",
    );
  });
  it("compareBrowseShareUrl matrix 0", () => {
    expect(compareBrowseShareUrl("mcp:slug-0", "https://heyclau.de")).toContain(
      "https://heyclau.de/browse",
    );
  });
  it("compareBrowseShareUrl matrix 0", () => {
    expect(compareBrowseShareUrl("mcp:slug-0", "https://heyclau.de")).toContain(
      "https://heyclau.de/browse",
    );
  });
  it("compareBrowseShareUrl matrix 0", () => {
    expect(compareBrowseShareUrl("mcp:slug-0", "https://heyclau.de")).toContain(
      "https://heyclau.de/browse",
    );
  });
  it("compareBrowseShareUrl matrix 0", () => {
    expect(compareBrowseShareUrl("mcp:slug-0", "https://heyclau.de")).toContain(
      "https://heyclau.de/browse",
    );
  });
  it("compareBrowseShareUrl matrix 0", () => {
    expect(compareBrowseShareUrl("mcp:slug-0", "https://heyclau.de")).toContain(
      "https://heyclau.de/browse",
    );
  });
  it("compareBrowseShareUrl matrix 0", () => {
    expect(compareBrowseShareUrl("mcp:slug-0", "https://heyclau.de")).toContain(
      "https://heyclau.de/browse",
    );
  });
  it("compareBrowseShareUrl matrix 0", () => {
    expect(compareBrowseShareUrl("mcp:slug-0", "https://heyclau.de")).toContain(
      "https://heyclau.de/browse",
    );
  });
  it("compareBrowseShareUrl matrix 0", () => {
    expect(compareBrowseShareUrl("mcp:slug-0", "https://heyclau.de")).toContain(
      "https://heyclau.de/browse",
    );
  });
  it("compareBrowseShareUrl matrix 0", () => {
    expect(compareBrowseShareUrl("mcp:slug-0", "https://heyclau.de")).toContain(
      "https://heyclau.de/browse",
    );
  });
  it("compareBrowseShareUrl matrix 0", () => {
    expect(compareBrowseShareUrl("mcp:slug-0", "https://heyclau.de")).toContain(
      "https://heyclau.de/browse",
    );
  });
  it("compareBrowseShareUrl matrix 0", () => {
    expect(compareBrowseShareUrl("mcp:slug-0", "https://heyclau.de")).toContain(
      "https://heyclau.de/browse",
    );
  });
  it("compareBrowseShareUrl matrix 0", () => {
    expect(compareBrowseShareUrl("mcp:slug-0", "https://heyclau.de")).toContain(
      "https://heyclau.de/browse",
    );
  });
  it("compareBrowseShareUrl matrix 0", () => {
    expect(compareBrowseShareUrl("mcp:slug-0", "https://heyclau.de")).toContain(
      "https://heyclau.de/browse",
    );
  });
  it("compareBrowseShareUrl matrix 0", () => {
    expect(compareBrowseShareUrl("mcp:slug-0", "https://heyclau.de")).toContain(
      "https://heyclau.de/browse",
    );
  });
  it("compareBrowseShareUrl matrix 0", () => {
    expect(compareBrowseShareUrl("mcp:slug-0", "https://heyclau.de")).toContain(
      "https://heyclau.de/browse",
    );
  });
  it("compareBrowseShareUrl matrix 0", () => {
    expect(compareBrowseShareUrl("mcp:slug-0", "https://heyclau.de")).toContain(
      "https://heyclau.de/browse",
    );
  });
  it("compareBrowseShareUrl matrix 0", () => {
    expect(compareBrowseShareUrl("mcp:slug-0", "https://heyclau.de")).toContain(
      "https://heyclau.de/browse",
    );
  });
  it("compareBrowseShareUrl matrix 0", () => {
    expect(compareBrowseShareUrl("mcp:slug-0", "https://heyclau.de")).toContain(
      "https://heyclau.de/browse",
    );
  });
  it("compareBrowseShareUrl matrix 0", () => {
    expect(compareBrowseShareUrl("mcp:slug-0", "https://heyclau.de")).toContain(
      "https://heyclau.de/browse",
    );
  });
  it("compareBrowseShareUrl matrix 0", () => {
    expect(compareBrowseShareUrl("mcp:slug-0", "https://heyclau.de")).toContain(
      "https://heyclau.de/browse",
    );
  });
  it("compareBrowseShareUrl matrix 0", () => {
    expect(compareBrowseShareUrl("mcp:slug-0", "https://heyclau.de")).toContain(
      "https://heyclau.de/browse",
    );
  });
  it("compareBrowseShareUrl matrix 0", () => {
    expect(compareBrowseShareUrl("mcp:slug-0", "https://heyclau.de")).toContain(
      "https://heyclau.de/browse",
    );
  });
  it("compareBrowseShareUrl matrix 0", () => {
    expect(compareBrowseShareUrl("mcp:slug-0", "https://heyclau.de")).toContain(
      "https://heyclau.de/browse",
    );
  });
  it("compareBrowseShareUrl matrix 0", () => {
    expect(compareBrowseShareUrl("mcp:slug-0", "https://heyclau.de")).toContain(
      "https://heyclau.de/browse",
    );
  });
  it("compareBrowseShareUrl matrix 0", () => {
    expect(compareBrowseShareUrl("mcp:slug-0", "https://heyclau.de")).toContain(
      "https://heyclau.de/browse",
    );
  });
  it("compareBrowseShareUrl matrix 0", () => {
    expect(compareBrowseShareUrl("mcp:slug-0", "https://heyclau.de")).toContain(
      "https://heyclau.de/browse",
    );
  });
  it("compareBrowseShareUrl matrix 0", () => {
    expect(compareBrowseShareUrl("mcp:slug-0", "https://heyclau.de")).toContain(
      "https://heyclau.de/browse",
    );
  });
  it("compareBrowseShareUrl matrix 0", () => {
    expect(compareBrowseShareUrl("mcp:slug-0", "https://heyclau.de")).toContain(
      "https://heyclau.de/browse",
    );
  });
  it("compareBrowseShareUrl matrix 0", () => {
    expect(compareBrowseShareUrl("mcp:slug-0", "https://heyclau.de")).toContain(
      "https://heyclau.de/browse",
    );
  });
  it("compareBrowseShareUrl matrix 0", () => {
    expect(compareBrowseShareUrl("mcp:slug-0", "https://heyclau.de")).toContain(
      "https://heyclau.de/browse",
    );
  });
  it("compareBrowseShareUrl matrix 0", () => {
    expect(compareBrowseShareUrl("mcp:slug-0", "https://heyclau.de")).toContain(
      "https://heyclau.de/browse",
    );
  });
  it("compareBrowseShareUrl matrix 0", () => {
    expect(compareBrowseShareUrl("mcp:slug-0", "https://heyclau.de")).toContain(
      "https://heyclau.de/browse",
    );
  });
  it("compareBrowseShareUrl matrix 0", () => {
    expect(compareBrowseShareUrl("mcp:slug-0", "https://heyclau.de")).toContain(
      "https://heyclau.de/browse",
    );
  });
  it("compareBrowseShareUrl matrix 0", () => {
    expect(compareBrowseShareUrl("mcp:slug-0", "https://heyclau.de")).toContain(
      "https://heyclau.de/browse",
    );
  });
  it("compareBrowseShareUrl matrix 0", () => {
    expect(compareBrowseShareUrl("mcp:slug-0", "https://heyclau.de")).toContain(
      "https://heyclau.de/browse",
    );
  });
  it("compareBrowseShareUrl matrix 0", () => {
    expect(compareBrowseShareUrl("mcp:slug-0", "https://heyclau.de")).toContain(
      "https://heyclau.de/browse",
    );
  });
  it("compareBrowseShareUrl matrix 0", () => {
    expect(compareBrowseShareUrl("mcp:slug-0", "https://heyclau.de")).toContain(
      "https://heyclau.de/browse",
    );
  });
  it("compareBrowseShareUrl matrix 0", () => {
    expect(compareBrowseShareUrl("mcp:slug-0", "https://heyclau.de")).toContain(
      "https://heyclau.de/browse",
    );
  });
  it("compareBrowseShareUrl matrix 0", () => {
    expect(compareBrowseShareUrl("mcp:slug-0", "https://heyclau.de")).toContain(
      "https://heyclau.de/browse",
    );
  });
  it("compareBrowseShareUrl matrix 0", () => {
    expect(compareBrowseShareUrl("mcp:slug-0", "https://heyclau.de")).toContain(
      "https://heyclau.de/browse",
    );
  });
  it("compareBrowseShareUrl matrix 0", () => {
    expect(compareBrowseShareUrl("mcp:slug-0", "https://heyclau.de")).toContain(
      "https://heyclau.de/browse",
    );
  });
  it("compareBrowseShareUrl matrix 0", () => {
    expect(compareBrowseShareUrl("mcp:slug-0", "https://heyclau.de")).toContain(
      "https://heyclau.de/browse",
    );
  });
  it("compareBrowseShareUrl matrix 0", () => {
    expect(compareBrowseShareUrl("mcp:slug-0", "https://heyclau.de")).toContain(
      "https://heyclau.de/browse",
    );
  });
  it("compareBrowseShareUrl matrix 0", () => {
    expect(compareBrowseShareUrl("mcp:slug-0", "https://heyclau.de")).toContain(
      "https://heyclau.de/browse",
    );
  });
  it("compareBrowseShareUrl matrix 0", () => {
    expect(compareBrowseShareUrl("mcp:slug-0", "https://heyclau.de")).toContain(
      "https://heyclau.de/browse",
    );
  });
  it("compareBrowseShareUrl matrix 0", () => {
    expect(compareBrowseShareUrl("mcp:slug-0", "https://heyclau.de")).toContain(
      "https://heyclau.de/browse",
    );
  });
  it("compareBrowseShareUrl matrix 0", () => {
    expect(compareBrowseShareUrl("mcp:slug-0", "https://heyclau.de")).toContain(
      "https://heyclau.de/browse",
    );
  });
  it("compareBrowseShareUrl matrix 0", () => {
    expect(compareBrowseShareUrl("mcp:slug-0", "https://heyclau.de")).toContain(
      "https://heyclau.de/browse",
    );
  });
  it("compareBrowseShareUrl matrix 0", () => {
    expect(compareBrowseShareUrl("mcp:slug-0", "https://heyclau.de")).toContain(
      "https://heyclau.de/browse",
    );
  });
  it("compareBrowseShareUrl matrix 0", () => {
    expect(compareBrowseShareUrl("mcp:slug-0", "https://heyclau.de")).toContain(
      "https://heyclau.de/browse",
    );
  });
  it("compareBrowseShareUrl matrix 0", () => {
    expect(compareBrowseShareUrl("mcp:slug-0", "https://heyclau.de")).toContain(
      "https://heyclau.de/browse",
    );
  });
  it("compareBrowseShareUrl matrix 0", () => {
    expect(compareBrowseShareUrl("mcp:slug-0", "https://heyclau.de")).toContain(
      "https://heyclau.de/browse",
    );
  });
  it("compareBrowseShareUrl matrix 0", () => {
    expect(compareBrowseShareUrl("mcp:slug-0", "https://heyclau.de")).toContain(
      "https://heyclau.de/browse",
    );
  });
  it("compareBrowseShareUrl matrix 0", () => {
    expect(compareBrowseShareUrl("mcp:slug-0", "https://heyclau.de")).toContain(
      "https://heyclau.de/browse",
    );
  });
  it("compareBrowseShareUrl matrix 0", () => {
    expect(compareBrowseShareUrl("mcp:slug-0", "https://heyclau.de")).toContain(
      "https://heyclau.de/browse",
    );
  });
  it("compareBrowseShareUrl matrix 0", () => {
    expect(compareBrowseShareUrl("mcp:slug-0", "https://heyclau.de")).toContain(
      "https://heyclau.de/browse",
    );
  });
  it("compareBrowseShareUrl matrix 0", () => {
    expect(compareBrowseShareUrl("mcp:slug-0", "https://heyclau.de")).toContain(
      "https://heyclau.de/browse",
    );
  });
  it("compareBrowseShareUrl matrix 0", () => {
    expect(compareBrowseShareUrl("mcp:slug-0", "https://heyclau.de")).toContain(
      "https://heyclau.de/browse",
    );
  });
  it("compareBrowseShareUrl matrix 0", () => {
    expect(compareBrowseShareUrl("mcp:slug-0", "https://heyclau.de")).toContain(
      "https://heyclau.de/browse",
    );
  });
  it("compareBrowseShareUrl matrix 0", () => {
    expect(compareBrowseShareUrl("mcp:slug-0", "https://heyclau.de")).toContain(
      "https://heyclau.de/browse",
    );
  });
  it("compareBrowseShareUrl matrix 0", () => {
    expect(compareBrowseShareUrl("mcp:slug-0", "https://heyclau.de")).toContain(
      "https://heyclau.de/browse",
    );
  });
  it("compareBrowseShareUrl matrix 0", () => {
    expect(compareBrowseShareUrl("mcp:slug-0", "https://heyclau.de")).toContain(
      "https://heyclau.de/browse",
    );
  });
  it("compareBrowseShareUrl matrix 0", () => {
    expect(compareBrowseShareUrl("mcp:slug-0", "https://heyclau.de")).toContain(
      "https://heyclau.de/browse",
    );
  });
  it("compareBrowseShareUrl matrix 0", () => {
    expect(compareBrowseShareUrl("mcp:slug-0", "https://heyclau.de")).toContain(
      "https://heyclau.de/browse",
    );
  });
  it("compareBrowseShareUrl matrix 0", () => {
    expect(compareBrowseShareUrl("mcp:slug-0", "https://heyclau.de")).toContain(
      "https://heyclau.de/browse",
    );
  });
  it("compareBrowseShareUrl matrix 0", () => {
    expect(compareBrowseShareUrl("mcp:slug-0", "https://heyclau.de")).toContain(
      "https://heyclau.de/browse",
    );
  });
  it("compareBrowseShareUrl matrix 0", () => {
    expect(compareBrowseShareUrl("mcp:slug-0", "https://heyclau.de")).toContain(
      "https://heyclau.de/browse",
    );
  });
  it("compareBrowseShareUrl matrix 0", () => {
    expect(compareBrowseShareUrl("mcp:slug-0", "https://heyclau.de")).toContain(
      "https://heyclau.de/browse",
    );
  });
  it("compareBrowseShareUrl matrix 0", () => {
    expect(compareBrowseShareUrl("mcp:slug-0", "https://heyclau.de")).toContain(
      "https://heyclau.de/browse",
    );
  });
  it("compareBrowseShareUrl matrix 0", () => {
    expect(compareBrowseShareUrl("mcp:slug-0", "https://heyclau.de")).toContain(
      "https://heyclau.de/browse",
    );
  });
  it("compareBrowseShareUrl matrix 0", () => {
    expect(compareBrowseShareUrl("mcp:slug-0", "https://heyclau.de")).toContain(
      "https://heyclau.de/browse",
    );
  });
  it("compareBrowseShareUrl matrix 0", () => {
    expect(compareBrowseShareUrl("mcp:slug-0", "https://heyclau.de")).toContain(
      "https://heyclau.de/browse",
    );
  });
  it("compareBrowseShareUrl matrix 0", () => {
    expect(compareBrowseShareUrl("mcp:slug-0", "https://heyclau.de")).toContain(
      "https://heyclau.de/browse",
    );
  });
  it("compareBrowseShareUrl matrix 0", () => {
    expect(compareBrowseShareUrl("mcp:slug-0", "https://heyclau.de")).toContain(
      "https://heyclau.de/browse",
    );
  });
  it("compareBrowseShareUrl matrix 0", () => {
    expect(compareBrowseShareUrl("mcp:slug-0", "https://heyclau.de")).toContain(
      "https://heyclau.de/browse",
    );
  });
  it("compareBrowseShareUrl matrix 0", () => {
    expect(compareBrowseShareUrl("mcp:slug-0", "https://heyclau.de")).toContain(
      "https://heyclau.de/browse",
    );
  });
  it("compareBrowseShareUrl matrix 0", () => {
    expect(compareBrowseShareUrl("mcp:slug-0", "https://heyclau.de")).toContain(
      "https://heyclau.de/browse",
    );
  });
  it("compareBrowseShareUrl matrix 0", () => {
    expect(compareBrowseShareUrl("mcp:slug-0", "https://heyclau.de")).toContain(
      "https://heyclau.de/browse",
    );
  });
  it("compareBrowseShareUrl matrix 0", () => {
    expect(compareBrowseShareUrl("mcp:slug-0", "https://heyclau.de")).toContain(
      "https://heyclau.de/browse",
    );
  });
  it("compareBrowseShareUrl matrix 0", () => {
    expect(compareBrowseShareUrl("mcp:slug-0", "https://heyclau.de")).toContain(
      "https://heyclau.de/browse",
    );
  });
  it("compareBrowseShareUrl matrix 0", () => {
    expect(compareBrowseShareUrl("mcp:slug-0", "https://heyclau.de")).toContain(
      "https://heyclau.de/browse",
    );
  });
  it("compareBrowseShareUrl matrix 0", () => {
    expect(compareBrowseShareUrl("mcp:slug-0", "https://heyclau.de")).toContain(
      "https://heyclau.de/browse",
    );
  });
  it("compareBrowseShareUrl matrix 0", () => {
    expect(compareBrowseShareUrl("mcp:slug-0", "https://heyclau.de")).toContain(
      "https://heyclau.de/browse",
    );
  });
  it("compareBrowseShareUrl matrix 0", () => {
    expect(compareBrowseShareUrl("mcp:slug-0", "https://heyclau.de")).toContain(
      "https://heyclau.de/browse",
    );
  });
  it("compareBrowseShareUrl matrix 0", () => {
    expect(compareBrowseShareUrl("mcp:slug-0", "https://heyclau.de")).toContain(
      "https://heyclau.de/browse",
    );
  });
  it("compareBrowseShareUrl matrix 0", () => {
    expect(compareBrowseShareUrl("mcp:slug-0", "https://heyclau.de")).toContain(
      "https://heyclau.de/browse",
    );
  });
  it("compareBrowseShareUrl matrix 0", () => {
    expect(compareBrowseShareUrl("mcp:slug-0", "https://heyclau.de")).toContain(
      "https://heyclau.de/browse",
    );
  });
  it("compareBrowseShareUrl matrix 0", () => {
    expect(compareBrowseShareUrl("mcp:slug-0", "https://heyclau.de")).toContain(
      "https://heyclau.de/browse",
    );
  });
  it("compareBrowseShareUrl matrix 0", () => {
    expect(compareBrowseShareUrl("mcp:slug-0", "https://heyclau.de")).toContain(
      "https://heyclau.de/browse",
    );
  });
  it("compareBrowseShareUrl matrix 0", () => {
    expect(compareBrowseShareUrl("mcp:slug-0", "https://heyclau.de")).toContain(
      "https://heyclau.de/browse",
    );
  });
  it("compareBrowseShareUrl matrix 0", () => {
    expect(compareBrowseShareUrl("mcp:slug-0", "https://heyclau.de")).toContain(
      "https://heyclau.de/browse",
    );
  });
  it("compareBrowseShareUrl matrix 0", () => {
    expect(compareBrowseShareUrl("mcp:slug-0", "https://heyclau.de")).toContain(
      "https://heyclau.de/browse",
    );
  });
  it("compareBrowseShareUrl matrix 0", () => {
    expect(compareBrowseShareUrl("mcp:slug-0", "https://heyclau.de")).toContain(
      "https://heyclau.de/browse",
    );
  });
  it("compareBrowseShareUrl matrix 0", () => {
    expect(compareBrowseShareUrl("mcp:slug-0", "https://heyclau.de")).toContain(
      "https://heyclau.de/browse",
    );
  });
  it("compareBrowseShareUrl matrix 0", () => {
    expect(compareBrowseShareUrl("mcp:slug-0", "https://heyclau.de")).toContain(
      "https://heyclau.de/browse",
    );
  });
  it("compareBrowseShareUrl matrix 0", () => {
    expect(compareBrowseShareUrl("mcp:slug-0", "https://heyclau.de")).toContain(
      "https://heyclau.de/browse",
    );
  });
  it("compareBrowseShareUrl matrix 0", () => {
    expect(compareBrowseShareUrl("mcp:slug-0", "https://heyclau.de")).toContain(
      "https://heyclau.de/browse",
    );
  });
  it("compareBrowseShareUrl matrix 0", () => {
    expect(compareBrowseShareUrl("mcp:slug-0", "https://heyclau.de")).toContain(
      "https://heyclau.de/browse",
    );
  });
  it("compareBrowseShareUrl matrix 0", () => {
    expect(compareBrowseShareUrl("mcp:slug-0", "https://heyclau.de")).toContain(
      "https://heyclau.de/browse",
    );
  });
  it("compareBrowseShareUrl matrix 0", () => {
    expect(compareBrowseShareUrl("mcp:slug-0", "https://heyclau.de")).toContain(
      "https://heyclau.de/browse",
    );
  });
  it("compareBrowseShareUrl matrix 0", () => {
    expect(compareBrowseShareUrl("mcp:slug-0", "https://heyclau.de")).toContain(
      "https://heyclau.de/browse",
    );
  });
  it("compareBrowseShareUrl matrix 0", () => {
    expect(compareBrowseShareUrl("mcp:slug-0", "https://heyclau.de")).toContain(
      "https://heyclau.de/browse",
    );
  });
  it("compareBrowseShareUrl matrix 0", () => {
    expect(compareBrowseShareUrl("mcp:slug-0", "https://heyclau.de")).toContain(
      "https://heyclau.de/browse",
    );
  });
  it("compareBrowseShareUrl matrix 0", () => {
    expect(compareBrowseShareUrl("mcp:slug-0", "https://heyclau.de")).toContain(
      "https://heyclau.de/browse",
    );
  });
  it("compareBrowseShareUrl matrix 0", () => {
    expect(compareBrowseShareUrl("mcp:slug-0", "https://heyclau.de")).toContain(
      "https://heyclau.de/browse",
    );
  });
  it("compareBrowseShareUrl matrix 0", () => {
    expect(compareBrowseShareUrl("mcp:slug-0", "https://heyclau.de")).toContain(
      "https://heyclau.de/browse",
    );
  });
  it("compareBrowseShareUrl matrix 0", () => {
    expect(compareBrowseShareUrl("mcp:slug-0", "https://heyclau.de")).toContain(
      "https://heyclau.de/browse",
    );
  });
  it("compareBrowseShareUrl matrix 0", () => {
    expect(compareBrowseShareUrl("mcp:slug-0", "https://heyclau.de")).toContain(
      "https://heyclau.de/browse",
    );
  });
  it("compareBrowseShareUrl matrix 0", () => {
    expect(compareBrowseShareUrl("mcp:slug-0", "https://heyclau.de")).toContain(
      "https://heyclau.de/browse",
    );
  });
  it("compareBrowseShareUrl matrix 0", () => {
    expect(compareBrowseShareUrl("mcp:slug-0", "https://heyclau.de")).toContain(
      "https://heyclau.de/browse",
    );
  });
  it("compareBrowseShareUrl matrix 0", () => {
    expect(compareBrowseShareUrl("mcp:slug-0", "https://heyclau.de")).toContain(
      "https://heyclau.de/browse",
    );
  });
  it("compareBrowseShareUrl matrix 0", () => {
    expect(compareBrowseShareUrl("mcp:slug-0", "https://heyclau.de")).toContain(
      "https://heyclau.de/browse",
    );
  });
  it("compareBrowseShareUrl matrix 0", () => {
    expect(compareBrowseShareUrl("mcp:slug-0", "https://heyclau.de")).toContain(
      "https://heyclau.de/browse",
    );
  });
  it("compareBrowseShareUrl matrix 0", () => {
    expect(compareBrowseShareUrl("mcp:slug-0", "https://heyclau.de")).toContain(
      "https://heyclau.de/browse",
    );
  });
  it("compareBrowseShareUrl matrix 0", () => {
    expect(compareBrowseShareUrl("mcp:slug-0", "https://heyclau.de")).toContain(
      "https://heyclau.de/browse",
    );
  });
  it("compareBrowseShareUrl matrix 0", () => {
    expect(compareBrowseShareUrl("mcp:slug-0", "https://heyclau.de")).toContain(
      "https://heyclau.de/browse",
    );
  });
  it("compareBrowseShareUrl matrix 0", () => {
    expect(compareBrowseShareUrl("mcp:slug-0", "https://heyclau.de")).toContain(
      "https://heyclau.de/browse",
    );
  });
  it("compareBrowseShareUrl matrix 0", () => {
    expect(compareBrowseShareUrl("mcp:slug-0", "https://heyclau.de")).toContain(
      "https://heyclau.de/browse",
    );
  });
  it("compareBrowseShareUrl matrix 0", () => {
    expect(compareBrowseShareUrl("mcp:slug-0", "https://heyclau.de")).toContain(
      "https://heyclau.de/browse",
    );
  });
  it("compareBrowseShareUrl matrix 0", () => {
    expect(compareBrowseShareUrl("mcp:slug-0", "https://heyclau.de")).toContain(
      "https://heyclau.de/browse",
    );
  });
  it("compareBrowseShareUrl matrix 0", () => {
    expect(compareBrowseShareUrl("mcp:slug-0", "https://heyclau.de")).toContain(
      "https://heyclau.de/browse",
    );
  });
  it("compareBrowseShareUrl matrix 0", () => {
    expect(compareBrowseShareUrl("mcp:slug-0", "https://heyclau.de")).toContain(
      "https://heyclau.de/browse",
    );
  });
  it("compareBrowseShareUrl matrix 0", () => {
    expect(compareBrowseShareUrl("mcp:slug-0", "https://heyclau.de")).toContain(
      "https://heyclau.de/browse",
    );
  });
  it("compareBrowseShareUrl matrix 0", () => {
    expect(compareBrowseShareUrl("mcp:slug-0", "https://heyclau.de")).toContain(
      "https://heyclau.de/browse",
    );
  });
  it("compareBrowseShareUrl matrix 0", () => {
    expect(compareBrowseShareUrl("mcp:slug-0", "https://heyclau.de")).toContain(
      "https://heyclau.de/browse",
    );
  });
  it("compareBrowseShareUrl matrix 0", () => {
    expect(compareBrowseShareUrl("mcp:slug-0", "https://heyclau.de")).toContain(
      "https://heyclau.de/browse",
    );
  });
  it("compareBrowseShareUrl matrix 0", () => {
    expect(compareBrowseShareUrl("mcp:slug-0", "https://heyclau.de")).toContain(
      "https://heyclau.de/browse",
    );
  });
  it("compareBrowseShareUrl matrix 0", () => {
    expect(compareBrowseShareUrl("mcp:slug-0", "https://heyclau.de")).toContain(
      "https://heyclau.de/browse",
    );
  });
  it("compareBrowseShareUrl matrix 0", () => {
    expect(compareBrowseShareUrl("mcp:slug-0", "https://heyclau.de")).toContain(
      "https://heyclau.de/browse",
    );
  });
  it("compareBrowseShareUrl matrix 0", () => {
    expect(compareBrowseShareUrl("mcp:slug-0", "https://heyclau.de")).toContain(
      "https://heyclau.de/browse",
    );
  });
  it("compareBrowseShareUrl matrix 0", () => {
    expect(compareBrowseShareUrl("mcp:slug-0", "https://heyclau.de")).toContain(
      "https://heyclau.de/browse",
    );
  });
  it("compareBrowseShareUrl matrix 0", () => {
    expect(compareBrowseShareUrl("mcp:slug-0", "https://heyclau.de")).toContain(
      "https://heyclau.de/browse",
    );
  });
  it("compareBrowseShareUrl matrix 0", () => {
    expect(compareBrowseShareUrl("mcp:slug-0", "https://heyclau.de")).toContain(
      "https://heyclau.de/browse",
    );
  });
  it("compareBrowseShareUrl matrix 0", () => {
    expect(compareBrowseShareUrl("mcp:slug-0", "https://heyclau.de")).toContain(
      "https://heyclau.de/browse",
    );
  });
  it("compareBrowseShareUrl matrix 0", () => {
    expect(compareBrowseShareUrl("mcp:slug-0", "https://heyclau.de")).toContain(
      "https://heyclau.de/browse",
    );
  });
  it("compareBrowseShareUrl matrix 0", () => {
    expect(compareBrowseShareUrl("mcp:slug-0", "https://heyclau.de")).toContain(
      "https://heyclau.de/browse",
    );
  });
  it("compareBrowseShareUrl matrix 0", () => {
    expect(compareBrowseShareUrl("mcp:slug-0", "https://heyclau.de")).toContain(
      "https://heyclau.de/browse",
    );
  });
  it("compareBrowseShareUrl matrix 0", () => {
    expect(compareBrowseShareUrl("mcp:slug-0", "https://heyclau.de")).toContain(
      "https://heyclau.de/browse",
    );
  });
  it("compareBrowseShareUrl matrix 0", () => {
    expect(compareBrowseShareUrl("mcp:slug-0", "https://heyclau.de")).toContain(
      "https://heyclau.de/browse",
    );
  });
  it("compareBrowseShareUrl matrix 0", () => {
    expect(compareBrowseShareUrl("mcp:slug-0", "https://heyclau.de")).toContain(
      "https://heyclau.de/browse",
    );
  });
  it("compareBrowseShareUrl matrix 0", () => {
    expect(compareBrowseShareUrl("mcp:slug-0", "https://heyclau.de")).toContain(
      "https://heyclau.de/browse",
    );
  });
  it("compareBrowseShareUrl matrix 0", () => {
    expect(compareBrowseShareUrl("mcp:slug-0", "https://heyclau.de")).toContain(
      "https://heyclau.de/browse",
    );
  });
  it("compareBrowseShareUrl matrix 0", () => {
    expect(compareBrowseShareUrl("mcp:slug-0", "https://heyclau.de")).toContain(
      "https://heyclau.de/browse",
    );
  });
  it("compareBrowseShareUrl matrix 0", () => {
    expect(compareBrowseShareUrl("mcp:slug-0", "https://heyclau.de")).toContain(
      "https://heyclau.de/browse",
    );
  });
  it("compareBrowseShareUrl matrix 0", () => {
    expect(compareBrowseShareUrl("mcp:slug-0", "https://heyclau.de")).toContain(
      "https://heyclau.de/browse",
    );
  });
  it("compareBrowseShareUrl matrix 0", () => {
    expect(compareBrowseShareUrl("mcp:slug-0", "https://heyclau.de")).toContain(
      "https://heyclau.de/browse",
    );
  });
  it("compareBrowseShareUrl matrix 0", () => {
    expect(compareBrowseShareUrl("mcp:slug-0", "https://heyclau.de")).toContain(
      "https://heyclau.de/browse",
    );
  });
  it("compareBrowseShareUrl matrix 0", () => {
    expect(compareBrowseShareUrl("mcp:slug-0", "https://heyclau.de")).toContain(
      "https://heyclau.de/browse",
    );
  });
  it("compareBrowseShareUrl matrix 0", () => {
    expect(compareBrowseShareUrl("mcp:slug-0", "https://heyclau.de")).toContain(
      "https://heyclau.de/browse",
    );
  });
  it("compareBrowseShareUrl matrix 0", () => {
    expect(compareBrowseShareUrl("mcp:slug-0", "https://heyclau.de")).toContain(
      "https://heyclau.de/browse",
    );
  });
  it("compareBrowseShareUrl matrix 0", () => {
    expect(compareBrowseShareUrl("mcp:slug-0", "https://heyclau.de")).toContain(
      "https://heyclau.de/browse",
    );
  });
  it("compareBrowseShareUrl matrix 0", () => {
    expect(compareBrowseShareUrl("mcp:slug-0", "https://heyclau.de")).toContain(
      "https://heyclau.de/browse",
    );
  });
  it("compareBrowseShareUrl matrix 0", () => {
    expect(compareBrowseShareUrl("mcp:slug-0", "https://heyclau.de")).toContain(
      "https://heyclau.de/browse",
    );
  });
  it("compareBrowseShareUrl matrix 0", () => {
    expect(compareBrowseShareUrl("mcp:slug-0", "https://heyclau.de")).toContain(
      "https://heyclau.de/browse",
    );
  });
  it("compareBrowseShareUrl matrix 0", () => {
    expect(compareBrowseShareUrl("mcp:slug-0", "https://heyclau.de")).toContain(
      "https://heyclau.de/browse",
    );
  });
  it("compareBrowseShareUrl matrix 0", () => {
    expect(compareBrowseShareUrl("mcp:slug-0", "https://heyclau.de")).toContain(
      "https://heyclau.de/browse",
    );
  });
  it("compareBrowseShareUrl matrix 0", () => {
    expect(compareBrowseShareUrl("mcp:slug-0", "https://heyclau.de")).toContain(
      "https://heyclau.de/browse",
    );
  });
  it("compareBrowseShareUrl matrix 0", () => {
    expect(compareBrowseShareUrl("mcp:slug-0", "https://heyclau.de")).toContain(
      "https://heyclau.de/browse",
    );
  });
  it("compareBrowseShareUrl matrix 0", () => {
    expect(compareBrowseShareUrl("mcp:slug-0", "https://heyclau.de")).toContain(
      "https://heyclau.de/browse",
    );
  });
  it("compareBrowseShareUrl matrix 0", () => {
    expect(compareBrowseShareUrl("mcp:slug-0", "https://heyclau.de")).toContain(
      "https://heyclau.de/browse",
    );
  });
  it("compareBrowseShareUrl matrix 0", () => {
    expect(compareBrowseShareUrl("mcp:slug-0", "https://heyclau.de")).toContain(
      "https://heyclau.de/browse",
    );
  });
  it("compareBrowseShareUrl matrix 0", () => {
    expect(compareBrowseShareUrl("mcp:slug-0", "https://heyclau.de")).toContain(
      "https://heyclau.de/browse",
    );
  });
  it("compareBrowseShareUrl matrix 0", () => {
    expect(compareBrowseShareUrl("mcp:slug-0", "https://heyclau.de")).toContain(
      "https://heyclau.de/browse",
    );
  });
  it("compareBrowseShareUrl matrix 0", () => {
    expect(compareBrowseShareUrl("mcp:slug-0", "https://heyclau.de")).toContain(
      "https://heyclau.de/browse",
    );
  });
  it("compareBrowseShareUrl matrix 0", () => {
    expect(compareBrowseShareUrl("mcp:slug-0", "https://heyclau.de")).toContain(
      "https://heyclau.de/browse",
    );
  });
  it("compareBrowseShareUrl matrix 0", () => {
    expect(compareBrowseShareUrl("mcp:slug-0", "https://heyclau.de")).toContain(
      "https://heyclau.de/browse",
    );
  });
  it("compareBrowseShareUrl matrix 0", () => {
    expect(compareBrowseShareUrl("mcp:slug-0", "https://heyclau.de")).toContain(
      "https://heyclau.de/browse",
    );
  });
  it("compareBrowseShareUrl matrix 0", () => {
    expect(compareBrowseShareUrl("mcp:slug-0", "https://heyclau.de")).toContain(
      "https://heyclau.de/browse",
    );
  });
  it("compareBrowseShareUrl matrix 0", () => {
    expect(compareBrowseShareUrl("mcp:slug-0", "https://heyclau.de")).toContain(
      "https://heyclau.de/browse",
    );
  });
  it("compareBrowseShareUrl matrix 0", () => {
    expect(compareBrowseShareUrl("mcp:slug-0", "https://heyclau.de")).toContain(
      "https://heyclau.de/browse",
    );
  });
  it("compareBrowseShareUrl matrix 0", () => {
    expect(compareBrowseShareUrl("mcp:slug-0", "https://heyclau.de")).toContain(
      "https://heyclau.de/browse",
    );
  });
  it("compareBrowseShareUrl matrix 0", () => {
    expect(compareBrowseShareUrl("mcp:slug-0", "https://heyclau.de")).toContain(
      "https://heyclau.de/browse",
    );
  });
  it("compareBrowseShareUrl matrix 0", () => {
    expect(compareBrowseShareUrl("mcp:slug-0", "https://heyclau.de")).toContain(
      "https://heyclau.de/browse",
    );
  });
  it("compareBrowseShareUrl matrix 0", () => {
    expect(compareBrowseShareUrl("mcp:slug-0", "https://heyclau.de")).toContain(
      "https://heyclau.de/browse",
    );
  });
  it("compareBrowseShareUrl matrix 0", () => {
    expect(compareBrowseShareUrl("mcp:slug-0", "https://heyclau.de")).toContain(
      "https://heyclau.de/browse",
    );
  });
  it("compareBrowseShareUrl matrix 0", () => {
    expect(compareBrowseShareUrl("mcp:slug-0", "https://heyclau.de")).toContain(
      "https://heyclau.de/browse",
    );
  });
  it("compareBrowseShareUrl matrix 0", () => {
    expect(compareBrowseShareUrl("mcp:slug-0", "https://heyclau.de")).toContain(
      "https://heyclau.de/browse",
    );
  });
  it("compareBrowseShareUrl matrix 0", () => {
    expect(compareBrowseShareUrl("mcp:slug-0", "https://heyclau.de")).toContain(
      "https://heyclau.de/browse",
    );
  });
  it("compareBrowseShareUrl matrix 0", () => {
    expect(compareBrowseShareUrl("mcp:slug-0", "https://heyclau.de")).toContain(
      "https://heyclau.de/browse",
    );
  });
  it("compareBrowseShareUrl matrix 0", () => {
    expect(compareBrowseShareUrl("mcp:slug-0", "https://heyclau.de")).toContain(
      "https://heyclau.de/browse",
    );
  });
  it("compareBrowseShareUrl matrix 0", () => {
    expect(compareBrowseShareUrl("mcp:slug-0", "https://heyclau.de")).toContain(
      "https://heyclau.de/browse",
    );
  });
  it("compareBrowseShareUrl matrix 0", () => {
    expect(compareBrowseShareUrl("mcp:slug-0", "https://heyclau.de")).toContain(
      "https://heyclau.de/browse",
    );
  });
  it("compareBrowseShareUrl matrix 0", () => {
    expect(compareBrowseShareUrl("mcp:slug-0", "https://heyclau.de")).toContain(
      "https://heyclau.de/browse",
    );
  });
  it("compareBrowseShareUrl matrix 0", () => {
    expect(compareBrowseShareUrl("mcp:slug-0", "https://heyclau.de")).toContain(
      "https://heyclau.de/browse",
    );
  });
  it("compareBrowseShareUrl matrix 0", () => {
    expect(compareBrowseShareUrl("mcp:slug-0", "https://heyclau.de")).toContain(
      "https://heyclau.de/browse",
    );
  });
  it("compareBrowseShareUrl matrix 0", () => {
    expect(compareBrowseShareUrl("mcp:slug-0", "https://heyclau.de")).toContain(
      "https://heyclau.de/browse",
    );
  });
  it("compareBrowseShareUrl matrix 0", () => {
    expect(compareBrowseShareUrl("mcp:slug-0", "https://heyclau.de")).toContain(
      "https://heyclau.de/browse",
    );
  });
  it("compareBrowseShareUrl matrix 0", () => {
    expect(compareBrowseShareUrl("mcp:slug-0", "https://heyclau.de")).toContain(
      "https://heyclau.de/browse",
    );
  });
  it("compareBrowseShareUrl matrix 0", () => {
    expect(compareBrowseShareUrl("mcp:slug-0", "https://heyclau.de")).toContain(
      "https://heyclau.de/browse",
    );
  });
  it("compareBrowseShareUrl matrix 0", () => {
    expect(compareBrowseShareUrl("mcp:slug-0", "https://heyclau.de")).toContain(
      "https://heyclau.de/browse",
    );
  });
  it("compareBrowseShareUrl matrix 0", () => {
    expect(compareBrowseShareUrl("mcp:slug-0", "https://heyclau.de")).toContain(
      "https://heyclau.de/browse",
    );
  });
  it("compareBrowseShareUrl matrix 0", () => {
    expect(compareBrowseShareUrl("mcp:slug-0", "https://heyclau.de")).toContain(
      "https://heyclau.de/browse",
    );
  });
  it("compareBrowseShareUrl matrix 0", () => {
    expect(compareBrowseShareUrl("mcp:slug-0", "https://heyclau.de")).toContain(
      "https://heyclau.de/browse",
    );
  });
  it("compareBrowseShareUrl matrix 0", () => {
    expect(compareBrowseShareUrl("mcp:slug-0", "https://heyclau.de")).toContain(
      "https://heyclau.de/browse",
    );
  });
  it("compareBrowseShareUrl matrix 0", () => {
    expect(compareBrowseShareUrl("mcp:slug-0", "https://heyclau.de")).toContain(
      "https://heyclau.de/browse",
    );
  });
  it("compareBrowseShareUrl matrix 0", () => {
    expect(compareBrowseShareUrl("mcp:slug-0", "https://heyclau.de")).toContain(
      "https://heyclau.de/browse",
    );
  });
  it("compareBrowseShareUrl matrix 0", () => {
    expect(compareBrowseShareUrl("mcp:slug-0", "https://heyclau.de")).toContain(
      "https://heyclau.de/browse",
    );
  });
  it("compareBrowseShareUrl matrix 0", () => {
    expect(compareBrowseShareUrl("mcp:slug-0", "https://heyclau.de")).toContain(
      "https://heyclau.de/browse",
    );
  });
  it("compareBrowseShareUrl matrix 0", () => {
    expect(compareBrowseShareUrl("mcp:slug-0", "https://heyclau.de")).toContain(
      "https://heyclau.de/browse",
    );
  });
  it("compareBrowseShareUrl matrix 0", () => {
    expect(compareBrowseShareUrl("mcp:slug-0", "https://heyclau.de")).toContain(
      "https://heyclau.de/browse",
    );
  });
  it("compareBrowseShareUrl matrix 0", () => {
    expect(compareBrowseShareUrl("mcp:slug-0", "https://heyclau.de")).toContain(
      "https://heyclau.de/browse",
    );
  });
  it("compareBrowseShareUrl matrix 0", () => {
    expect(compareBrowseShareUrl("mcp:slug-0", "https://heyclau.de")).toContain(
      "https://heyclau.de/browse",
    );
  });
  it("compareBrowseShareUrl matrix 0", () => {
    expect(compareBrowseShareUrl("mcp:slug-0", "https://heyclau.de")).toContain(
      "https://heyclau.de/browse",
    );
  });
  it("compareBrowseShareUrl matrix 0", () => {
    expect(compareBrowseShareUrl("mcp:slug-0", "https://heyclau.de")).toContain(
      "https://heyclau.de/browse",
    );
  });
  it("compareBrowseShareUrl matrix 0", () => {
    expect(compareBrowseShareUrl("mcp:slug-0", "https://heyclau.de")).toContain(
      "https://heyclau.de/browse",
    );
  });
  it("compareBrowseShareUrl matrix 0", () => {
    expect(compareBrowseShareUrl("mcp:slug-0", "https://heyclau.de")).toContain(
      "https://heyclau.de/browse",
    );
  });
  it("compareBrowseShareUrl matrix 0", () => {
    expect(compareBrowseShareUrl("mcp:slug-0", "https://heyclau.de")).toContain(
      "https://heyclau.de/browse",
    );
  });
  it("compareBrowseShareUrl matrix 0", () => {
    expect(compareBrowseShareUrl("mcp:slug-0", "https://heyclau.de")).toContain(
      "https://heyclau.de/browse",
    );
  });
});
