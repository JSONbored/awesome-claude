import { describe, expect, it } from "vitest";

import {
  COMMUNITY_SIGNAL_TYPES,
  entryCommunityTarget,
  getFallbackCommunitySignalCounts,
  normalizeCommunitySignalTarget,
} from "@/lib/community-signals";

describe("community-signals re-export surface", () => {
  it("keeps the public import path wired to the extracted lib", () => {
    expect(COMMUNITY_SIGNAL_TYPES).toEqual(["used", "works", "broken"]);
    expect(entryCommunityTarget("agents", "demo")).toBe("entry:agents/demo");
    expect(
      normalizeCommunitySignalTarget("entry", "entry:agents/demo"),
    ).toEqual({
      targetKind: "entry",
      targetKey: "entry:agents/demo",
    });
    expect(
      getFallbackCommunitySignalCounts([
        { targetKind: "tool", targetKey: "tool:x" },
      ])["tool:x"],
    ).toEqual({ used: 0, works: 0, broken: 0 });
  });
});
