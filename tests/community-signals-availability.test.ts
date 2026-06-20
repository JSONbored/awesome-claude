import { describe, expect, it } from "vitest";

import {
  communitySignalTargetId,
  isExpectedUnavailableCommunitySignalError,
  getFallbackCommunitySignalCounts,
  entryCommunityTarget,
  ZERO_COMMUNITY_SIGNAL_COUNTS,
} from "@/lib/community-signals";

describe("communitySignalTargetId", () => {
  it("uses the target key as the stable id", () => {
    expect(
      communitySignalTargetId({ targetKind: "tool", targetKey: "tool:x" }),
    ).toBe("tool:x");
  });
});

describe("entryCommunityTarget", () => {
  it("builds the entry:category/slug key", () => {
    expect(entryCommunityTarget("agents", "my-slug")).toBe(
      "entry:agents/my-slug",
    );
  });
});

describe("isExpectedUnavailableCommunitySignalError", () => {
  it("treats missing-table and missing-binding errors as expected", () => {
    // These mean the signals store simply isn't provisioned; callers degrade
    // gracefully instead of logging them as real failures.
    expect(
      isExpectedUnavailableCommunitySignalError(
        new Error("no such table: community_signals"),
      ),
    ).toBe(true);
    expect(
      isExpectedUnavailableCommunitySignalError(
        new Error("SITE_DB binding is not available"),
      ),
    ).toBe(true);
  });

  it("handles non-Error values by stringifying them", () => {
    expect(isExpectedUnavailableCommunitySignalError("SITE_DB")).toBe(true);
    expect(isExpectedUnavailableCommunitySignalError(null)).toBe(false);
  });

  it("does not swallow unrelated errors", () => {
    expect(
      isExpectedUnavailableCommunitySignalError(new Error("network down")),
    ).toBe(false);
  });
});

describe("getFallbackCommunitySignalCounts", () => {
  it("seeds a zeroed count record keyed by target id", () => {
    const counts = getFallbackCommunitySignalCounts([
      { targetKind: "tool", targetKey: "tool:x" },
      { targetKind: "entry", targetKey: "entry:agents/y" },
    ]);
    expect(counts["tool:x"]).toEqual(ZERO_COMMUNITY_SIGNAL_COUNTS);
    expect(counts["entry:agents/y"]).toEqual(ZERO_COMMUNITY_SIGNAL_COUNTS);
  });

  it("gives each target an independent counts object", () => {
    const counts = getFallbackCommunitySignalCounts([
      { targetKind: "tool", targetKey: "tool:a" },
      { targetKind: "tool", targetKey: "tool:b" },
    ]);
    counts["tool:a"].used = 3;
    expect(counts["tool:b"].used).toBe(0);
  });
});
