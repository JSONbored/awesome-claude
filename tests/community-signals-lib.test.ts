import { describe, expect, it } from "vitest";

import {
  COMMUNITY_SIGNAL_TYPES,
  COMMUNITY_TARGET_KINDS,
  ZERO_COMMUNITY_SIGNAL_COUNTS,
  communitySignalTargetId,
  entryCommunityTarget,
  getFallbackCommunitySignalCounts,
  isExpectedUnavailableCommunitySignalError,
  normalizeCommunityClientId,
  normalizeCommunitySignalTarget,
  normalizeCommunitySignalType,
  normalizeCommunityTargetKey,
  normalizeCommunityTargetKind,
  type CommunitySignalTarget,
} from "../apps/web/src/lib/community-signals-lib";

describe("signal vocabulary constants", () => {
  it("fixes the community signal type vocabulary", () => {
    expect(COMMUNITY_SIGNAL_TYPES).toEqual(["used", "works", "broken"]);
  });

  it("fixes the community target kind vocabulary", () => {
    expect(COMMUNITY_TARGET_KINDS).toEqual(["entry", "tool"]);
  });

  it("seeds zero counts for every signal type", () => {
    expect(ZERO_COMMUNITY_SIGNAL_COUNTS).toEqual({
      used: 0,
      works: 0,
      broken: 0,
    });
  });
});

describe("normalizeCommunityTargetKind", () => {
  it.each(["entry", "tool"] as const)("accepts %s", (kind) => {
    expect(normalizeCommunityTargetKind(kind)).toBe(kind);
  });

  it.each([
    "Entry",
    "TOOL",
    "mcp",
    "skill",
    "",
    "   ",
    "entry-tool",
    "null",
    "undefined",
  ])("rejects invalid kind %s", (value) => {
    expect(normalizeCommunityTargetKind(value)).toBeNull();
  });

  it.each([null, undefined])("rejects %s", (value) => {
    expect(normalizeCommunityTargetKind(value)).toBeNull();
  });
});

describe("normalizeCommunitySignalType", () => {
  it.each(COMMUNITY_SIGNAL_TYPES)("accepts %s", (signal) => {
    expect(normalizeCommunitySignalType(signal)).toBe(signal);
  });

  it.each([
    "Works",
    "USED",
    "Broken",
    "helpful",
    "vote",
    "upvote",
    "downvote",
    "",
    "used ",
  ])("rejects invalid signal %s", (value) => {
    expect(normalizeCommunitySignalType(value)).toBeNull();
  });

  it.each([null, undefined])("rejects %s", (value) => {
    expect(normalizeCommunitySignalType(value)).toBeNull();
  });
});

describe("normalizeCommunityTargetKey", () => {
  describe("valid entry keys", () => {
    it.each([
      "entry:agents/my-slug",
      "entry:mcp/demo-server",
      "entry:skills/writing-assistant",
      "entry:hooks/pre-commit",
      "entry:agents/multi-part-slug",
      "ENTRY:Agents/Slug",
    ])("accepts %s", (key) => {
      const normalized = normalizeCommunityTargetKey(key);
      expect(normalized).toBe(key.toLowerCase());
    });
  });

  describe("valid tool keys", () => {
    it.each(["tool:my-tool", "tool:search", "tool:agent-99", "TOOL:Cursor"])(
      "accepts %s",
      (key) => {
        const normalized = normalizeCommunityTargetKey(key);
        expect(normalized).toBe(key.toLowerCase());
      },
    );
  });

  describe("invalid keys", () => {
    it.each([
      "entry:",
      "tool:",
      "mcp:demo",
      "agents/demo",
      "entry:/missing-category",
      "entry:bad_/slug",
      "",
      "   ",
    ])("rejects %s", (key) => {
      expect(normalizeCommunityTargetKey(key)).toBeNull();
    });

    it("accepts single-segment entry keys at the key layer but not the target layer", () => {
      expect(normalizeCommunityTargetKey("entry:agents")).toBe("entry:agents");
      expect(
        normalizeCommunitySignalTarget("entry", "entry:agents"),
      ).toBeNull();
    });

    it("accepts slash tool keys at the key layer but not the target layer", () => {
      expect(normalizeCommunityTargetKey("tool:a/b")).toBe("tool:a/b");
      expect(normalizeCommunitySignalTarget("tool", "tool:a/b")).toBeNull();
    });

    it.each([null, undefined])("rejects %s", (value) => {
      expect(normalizeCommunityTargetKey(value)).toBeNull();
    });
  });

  it("trims surrounding whitespace before validation", () => {
    expect(normalizeCommunityTargetKey("  entry:agents/demo  ")).toBe(
      "entry:agents/demo",
    );
  });
});

describe("normalizeCommunitySignalTarget", () => {
  describe("entry targets", () => {
    it.each([
      ["entry", "entry:agents/my-slug"],
      ["entry", "entry:mcp/demo"],
      ["entry", "entry:skills/writing"],
    ])("accepts kind=%s key=%s", (kind, key) => {
      expect(normalizeCommunitySignalTarget(kind, key)).toEqual({
        targetKind: "entry",
        targetKey: key,
      });
    });

    it.each([
      ["entry", "entry:agents"],
      ["entry", "entry:only-one-segment"],
      ["entry", "tool:agents/demo"],
      ["entry", "entry:bad category/slug"],
    ])("rejects kind=%s key=%s", (kind, key) => {
      expect(normalizeCommunitySignalTarget(kind, key)).toBeNull();
    });
  });

  describe("tool targets", () => {
    it.each([
      ["tool", "tool:search"],
      ["tool", "tool:my-tool"],
      ["tool", "tool:agent99"],
    ])("accepts kind=%s key=%s", (kind, key) => {
      expect(normalizeCommunitySignalTarget(kind, key)).toEqual({
        targetKind: "tool",
        targetKey: key,
      });
    });

    it.each([
      ["tool", "tool:a/b"],
      ["tool", "entry:agents/demo"],
      ["tool", "tool:"],
    ])("rejects kind=%s key=%s", (kind, key) => {
      expect(normalizeCommunitySignalTarget(kind, key)).toBeNull();
    });
  });

  it("rejects when either kind or key is invalid", () => {
    expect(
      normalizeCommunitySignalTarget("invalid", "entry:agents/demo"),
    ).toBeNull();
    expect(normalizeCommunitySignalTarget("entry", "not-a-key")).toBeNull();
    expect(normalizeCommunitySignalTarget(null, null)).toBeNull();
  });

  it("normalizes uppercase entry keys before shape checks", () => {
    expect(
      normalizeCommunitySignalTarget("entry", "ENTRY:Agents/Demo"),
    ).toEqual({
      targetKind: "entry",
      targetKey: "entry:agents/demo",
    });
  });
});

describe("normalizeCommunityClientId", () => {
  it("accepts ids between 16 and 96 alphanumeric/underscore/dash characters", () => {
    const min = "a".repeat(16);
    const max = "b".repeat(96);
    expect(normalizeCommunityClientId(min)).toBe(min);
    expect(normalizeCommunityClientId(max)).toBe(max);
    expect(normalizeCommunityClientId("abc_def-1234567890")).toBe(
      "abc_def-1234567890",
    );
  });

  it("trims surrounding whitespace", () => {
    expect(normalizeCommunityClientId("  abcdef0123456789  ")).toBe(
      "abcdef0123456789",
    );
  });

  it.each([
    "short",
    "only15chars!!!!",
    "a".repeat(97),
    "",
    "   ",
    "spaces inside id value",
    "emoji🔥abcdef012345",
  ])("rejects invalid client id %s", (value) => {
    expect(normalizeCommunityClientId(value)).toBeNull();
  });

  it.each([null, undefined])("rejects %s", (value) => {
    expect(normalizeCommunityClientId(value)).toBeNull();
  });
});

describe("communitySignalTargetId", () => {
  it("uses the target key as the stable id", () => {
    expect(
      communitySignalTargetId({ targetKind: "tool", targetKey: "tool:x" }),
    ).toBe("tool:x");
    expect(
      communitySignalTargetId({
        targetKind: "entry",
        targetKey: "entry:agents/demo",
      }),
    ).toBe("entry:agents/demo");
  });
});

describe("entryCommunityTarget", () => {
  it.each([
    ["agents", "my-slug", "entry:agents/my-slug"],
    ["mcp", "demo-server", "entry:mcp/demo-server"],
    ["skills", "writing", "entry:skills/writing"],
    ["hooks", "pre-commit", "entry:hooks/pre-commit"],
  ])("builds entry:%s/%s → %s", (category, slug, expected) => {
    expect(entryCommunityTarget(category, slug)).toBe(expected);
  });
});

describe("getFallbackCommunitySignalCounts", () => {
  it("returns an empty object for an empty target list", () => {
    expect(getFallbackCommunitySignalCounts([])).toEqual({});
  });

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
    expect(counts["tool:a"].works).toBe(0);
  });

  it("overwrites duplicate target keys with a fresh zeroed object", () => {
    const target: CommunitySignalTarget = {
      targetKind: "tool",
      targetKey: "tool:dup",
    };
    const counts = getFallbackCommunitySignalCounts([target, target]);
    expect(Object.keys(counts)).toEqual(["tool:dup"]);
    expect(counts["tool:dup"]).toEqual(ZERO_COMMUNITY_SIGNAL_COUNTS);
  });

  it("handles many targets deterministically", () => {
    const targets = Array.from({ length: 25 }, (_, index) => ({
      targetKind: index % 2 === 0 ? ("entry" as const) : ("tool" as const),
      targetKey:
        index % 2 === 0 ? `entry:agents/skill-${index}` : `tool:tool-${index}`,
    }));
    const counts = getFallbackCommunitySignalCounts(targets);
    expect(Object.keys(counts)).toHaveLength(25);
    for (const target of targets) {
      expect(counts[target.targetKey]).toEqual(ZERO_COMMUNITY_SIGNAL_COUNTS);
    }
  });
});

describe("isExpectedUnavailableCommunitySignalError", () => {
  it("treats missing-table errors as expected", () => {
    expect(
      isExpectedUnavailableCommunitySignalError(
        new Error("no such table: community_signals"),
      ),
    ).toBe(true);
    expect(
      isExpectedUnavailableCommunitySignalError(
        new Error("Sqlite error: no such table: community_signals (1)"),
      ),
    ).toBe(true);
  });

  it("treats missing SITE_DB binding errors as expected", () => {
    expect(
      isExpectedUnavailableCommunitySignalError(
        new Error("SITE_DB binding is not available"),
      ),
    ).toBe(true);
    expect(isExpectedUnavailableCommunitySignalError("SITE_DB")).toBe(true);
  });

  it("handles non-Error values by stringifying them", () => {
    expect(isExpectedUnavailableCommunitySignalError(null)).toBe(false);
    expect(isExpectedUnavailableCommunitySignalError(undefined)).toBe(false);
    expect(isExpectedUnavailableCommunitySignalError(404)).toBe(false);
  });

  it.each([
    new Error("network down"),
    new Error("D1 timeout"),
    new Error("permission denied"),
    new Error("no such table: votes"),
    "random failure",
  ])("does not swallow unrelated errors (%s)", (error) => {
    expect(isExpectedUnavailableCommunitySignalError(error)).toBe(false);
  });
});

describe("normalization integration", () => {
  it("round-trips a valid entry target through all normalizers", () => {
    const key = entryCommunityTarget("agents", "demo");
    const kind = normalizeCommunityTargetKind("entry");
    const normalizedKey = normalizeCommunityTargetKey(key);
    const target = normalizeCommunitySignalTarget("entry", key);
    expect(kind).toBe("entry");
    expect(normalizedKey).toBe("entry:agents/demo");
    expect(target).toEqual({
      targetKind: "entry",
      targetKey: "entry:agents/demo",
    });
    expect(communitySignalTargetId(target!)).toBe("entry:agents/demo");
  });

  it("round-trips a valid tool target through all normalizers", () => {
    const key = "tool:search";
    const target = normalizeCommunitySignalTarget("tool", key);
    expect(target).toEqual({ targetKind: "tool", targetKey: "tool:search" });
    const counts = getFallbackCommunitySignalCounts([target!]);
    expect(counts["tool:search"]).toEqual(ZERO_COMMUNITY_SIGNAL_COUNTS);
  });

  it("rejects signal types outside the fixed vocabulary after target validation", () => {
    const target = normalizeCommunitySignalTarget("entry", "entry:agents/demo");
    expect(target).not.toBeNull();
    expect(normalizeCommunitySignalType("works")).toBe("works");
    expect(normalizeCommunitySignalType("liked")).toBeNull();
  });
});

describe("target key edge matrix", () => {
  const validEntryKeys = [
    "entry:a/b",
    "entry:ab/cd",
    "entry:agents/my-slug",
    "entry:mcp/server-1",
    "entry:skills/skill-99",
  ];

  it.each(validEntryKeys)("accepts entry key shape %s", (key) => {
    expect(normalizeCommunityTargetKey(key)).toBe(key);
    expect(normalizeCommunitySignalTarget("entry", key)).toEqual({
      targetKind: "entry",
      targetKey: key,
    });
  });

  const validToolKeys = ["tool:a", "tool:ab", "tool:my-tool", "tool:search99"];

  it.each(validToolKeys)("accepts tool key shape %s", (key) => {
    expect(normalizeCommunityTargetKey(key)).toBe(key);
    expect(normalizeCommunitySignalTarget("tool", key)).toEqual({
      targetKind: "tool",
      targetKey: key,
    });
  });
});

describe("client id boundary matrix", () => {
  it("accepts length 16 and rejects length 15", () => {
    const ok = "x".repeat(16);
    const short = "x".repeat(15);
    expect(normalizeCommunityClientId(ok)).toBe(ok);
    expect(normalizeCommunityClientId(short)).toBeNull();
  });

  it("accepts length 96 and rejects length 97", () => {
    const ok = "y".repeat(96);
    const long = "y".repeat(97);
    expect(normalizeCommunityClientId(ok)).toBe(ok);
    expect(normalizeCommunityClientId(long)).toBeNull();
  });

  it.each(["_", "-", "0", "9", "A", "z"])(
    "allows client id character class member %s",
    (char) => {
      const id = `${char.repeat(16)}`;
      expect(normalizeCommunityClientId(id)).toBe(id);
    },
  );
});

describe("fallback count invariants", () => {
  it("never mutates ZERO_COMMUNITY_SIGNAL_COUNTS when callers edit a fallback", () => {
    const counts = getFallbackCommunitySignalCounts([
      { targetKind: "tool", targetKey: "tool:x" },
    ]);
    counts["tool:x"].used = 5;
    expect(ZERO_COMMUNITY_SIGNAL_COUNTS.used).toBe(0);
  });

  it("includes every requested target key exactly once", () => {
    const targets: CommunitySignalTarget[] = [
      { targetKind: "entry", targetKey: "entry:agents/a" },
      { targetKind: "entry", targetKey: "entry:mcp/b" },
      { targetKind: "tool", targetKey: "tool:c" },
    ];
    const counts = getFallbackCommunitySignalCounts(targets);
    expect(Object.keys(counts).sort()).toEqual([
      "entry:agents/a",
      "entry:mcp/b",
      "tool:c",
    ]);
  });
});

describe("target kind and key prefix agreement", () => {
  it.each([
    ["entry", "tool:search"],
    ["tool", "entry:agents/demo"],
    ["tool", "entry:mcp/server"],
  ])("rejects prefix mismatch kind=%s key=%s", (kind, key) => {
    expect(normalizeCommunitySignalTarget(kind, key)).toBeNull();
  });
});

describe("entryCommunityTarget catalog matrix", () => {
  const categories = [
    "agents",
    "mcp",
    "skills",
    "hooks",
    "commands",
    "rules",
    "workflows",
  ];

  it.each(categories)("builds stable keys for category %s", (category) => {
    const key = entryCommunityTarget(category, "demo");
    expect(key).toBe(`entry:${category}/demo`);
    expect(normalizeCommunitySignalTarget("entry", key)).toEqual({
      targetKind: "entry",
      targetKey: key,
    });
  });
});

describe("signal type round-trip matrix", () => {
  it.each(COMMUNITY_SIGNAL_TYPES)("preserves signal type %s", (signal) => {
    expect(normalizeCommunitySignalType(signal)).toBe(signal);
    const counts = getFallbackCommunitySignalCounts([
      { targetKind: "tool", targetKey: "tool:demo" },
    ]);
    counts["tool:demo"][signal] = 1;
    expect(counts["tool:demo"][signal]).toBe(1);
  });
});

describe("bulk fallback seeding", () => {
  it("seeds independent buckets for heterogeneous targets", () => {
    const targets: CommunitySignalTarget[] = [
      { targetKind: "entry", targetKey: "entry:agents/a" },
      { targetKind: "entry", targetKey: "entry:mcp/b" },
      { targetKind: "tool", targetKey: "tool:search" },
      { targetKind: "tool", targetKey: "tool:lint" },
    ];
    const counts = getFallbackCommunitySignalCounts(targets);
    counts["entry:agents/a"].works = 2;
    counts["tool:search"].used = 4;
    expect(counts["entry:mcp/b"].works).toBe(0);
    expect(counts["tool:lint"].used).toBe(0);
    expect(counts["tool:search"].broken).toBe(0);
  });

  it("supports reseeding after callers mutate a prior fallback map", () => {
    const first = getFallbackCommunitySignalCounts([
      { targetKind: "tool", targetKey: "tool:x" },
    ]);
    first["tool:x"].broken = 9;
    const second = getFallbackCommunitySignalCounts([
      { targetKind: "tool", targetKey: "tool:x" },
    ]);
    expect(second["tool:x"]).toEqual(ZERO_COMMUNITY_SIGNAL_COUNTS);
  });
});

describe("availability error matching", () => {
  it.each([
    "no such table: community_signals",
    "Error: no such table: community_signals at line 1",
    "SITE_DB binding missing",
    "SITE_DB is not configured",
  ])("matches expected unavailable message fragment in %s", (fragment) => {
    expect(isExpectedUnavailableCommunitySignalError(new Error(fragment))).toBe(
      true,
    );
  });

  it.each([
    "community_signals constraint failed",
    "no such table: votes",
    "database is unavailable",
    "timeout",
  ])("does not match unrelated fragment %s", (fragment) => {
    expect(isExpectedUnavailableCommunitySignalError(new Error(fragment))).toBe(
      false,
    );
  });
});

describe("normalization defensive cases", () => {
  it("returns null for empty strings across all string normalizers", () => {
    expect(normalizeCommunityTargetKind("")).toBeNull();
    expect(normalizeCommunitySignalType("")).toBeNull();
    expect(normalizeCommunityTargetKey("")).toBeNull();
    expect(normalizeCommunityClientId("")).toBeNull();
    expect(normalizeCommunitySignalTarget("", "")).toBeNull();
  });

  it("returns null for whitespace-only strings across string normalizers", () => {
    expect(normalizeCommunityTargetKind("   ")).toBeNull();
    expect(normalizeCommunitySignalType("   ")).toBeNull();
    expect(normalizeCommunityTargetKey("   ")).toBeNull();
    expect(normalizeCommunityClientId("   ")).toBeNull();
  });
});

describe("client id charset matrix", () => {
  it.each([
    "0123456789abcdef",
    "ABCDEFGHIJKLMNOP",
    "________________",
    "----------------",
    "Aa0_-Aa0_-Aa0_-A",
  ])("accepts charset sample %s", (sample) => {
    const id = sample.length >= 16 ? sample : sample.padEnd(16, "x");
    expect(normalizeCommunityClientId(id)).toBe(id);
  });

  it.each([
    "invalid!chars-here",
    "has spaces inside it now",
    "tab\tinside",
    "newline\ninside",
  ])("rejects disallowed characters in %s", (value) => {
    const id = value.padEnd(16, "x");
    expect(normalizeCommunityClientId(id)).toBeNull();
  });
});

describe("target key whitespace handling", () => {
  it.each([
    ["  entry:agents/demo  ", "entry:agents/demo"],
    ["\ttool:search\t", "tool:search"],
    [" entry:mcp/server ", "entry:mcp/server"],
  ])("normalizes %j to %s", (input, expected) => {
    expect(normalizeCommunityTargetKey(input)).toBe(expected);
  });
});

describe("catalog-wide normalization snapshot", () => {
  it("validates a realistic mixed batch of raw API inputs", () => {
    const rawInputs = [
      {
        kind: "entry",
        key: "entry:agents/demo",
        signal: "works",
        client: "a".repeat(20),
      },
      {
        kind: "tool",
        key: "tool:search",
        signal: "used",
        client: "b".repeat(32),
      },
      { kind: "entry", key: "entry:mcp", signal: "broken", client: "short" },
      {
        kind: "tool",
        key: "tool:a/b",
        signal: "works",
        client: "c".repeat(20),
      },
      {
        kind: "invalid",
        key: "entry:agents/demo",
        signal: "nope",
        client: null,
      },
    ];

    const accepted = rawInputs
      .map((row) => {
        const target = normalizeCommunitySignalTarget(row.kind, row.key);
        const signal = normalizeCommunitySignalType(row.signal);
        const client = normalizeCommunityClientId(row.client);
        if (!target || !signal || !client) return null;
        return { target, signal, client };
      })
      .filter(Boolean);

    expect(accepted).toHaveLength(2);
    expect(accepted[0]).toMatchObject({
      signal: "works",
      target: { targetKey: "entry:agents/demo" },
    });
    expect(accepted[1]).toMatchObject({
      signal: "used",
      target: { targetKey: "tool:search" },
    });
  });
});
