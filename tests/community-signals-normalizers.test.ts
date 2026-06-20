import { describe, expect, it } from "vitest";

import {
  normalizeCommunityTargetKind,
  normalizeCommunitySignalType,
  normalizeCommunityTargetKey,
  normalizeCommunitySignalTarget,
  normalizeCommunityClientId,
} from "@/lib/community-signals";

describe("normalizeCommunityTargetKind", () => {
  it("passes known kinds and rejects everything else", () => {
    expect(normalizeCommunityTargetKind("entry")).toBe("entry");
    expect(normalizeCommunityTargetKind("tool")).toBe("tool");
    expect(normalizeCommunityTargetKind("xxx")).toBeNull();
    expect(normalizeCommunityTargetKind(null)).toBeNull();
  });
});

describe("normalizeCommunitySignalType", () => {
  it("passes the fixed signal vocabulary and rejects others", () => {
    expect(normalizeCommunitySignalType("works")).toBe("works");
    expect(normalizeCommunitySignalType("used")).toBe("used");
    expect(normalizeCommunitySignalType("broken")).toBe("broken");
    expect(normalizeCommunitySignalType("nope")).toBeNull();
  });
});

describe("normalizeCommunityTargetKey", () => {
  it("lowercases and validates the prefixed key shape", () => {
    expect(normalizeCommunityTargetKey("entry:agents/my-slug")).toBe(
      "entry:agents/my-slug",
    );
    expect(normalizeCommunityTargetKey("tool:my-tool")).toBe("tool:my-tool");
    // Input is normalized to lowercase before the shape check.
    expect(normalizeCommunityTargetKey("ENTRY:Agents/Slug")).toBe(
      "entry:agents/slug",
    );
  });

  it("rejects keys missing a body after the prefix", () => {
    expect(normalizeCommunityTargetKey("entry:")).toBeNull();
    expect(normalizeCommunityTargetKey("")).toBeNull();
  });
});

describe("normalizeCommunitySignalTarget", () => {
  it("requires an entry key to carry a category/slug path", () => {
    // entry targets address a specific entry, so the key must be cat/slug.
    expect(
      normalizeCommunitySignalTarget("entry", "entry:agents/my-slug"),
    ).toEqual({ targetKind: "entry", targetKey: "entry:agents/my-slug" });
    expect(normalizeCommunitySignalTarget("entry", "entry:agents")).toBeNull();
  });

  it("requires a tool key to be a single segment", () => {
    // tool targets are a flat slug, so a slash path is invalid.
    expect(normalizeCommunitySignalTarget("tool", "tool:my-tool")).toEqual({
      targetKind: "tool",
      targetKey: "tool:my-tool",
    });
    expect(normalizeCommunitySignalTarget("tool", "tool:a/b")).toBeNull();
  });

  it("rejects a kind/key prefix mismatch", () => {
    // The kind and the key prefix must agree.
    expect(
      normalizeCommunitySignalTarget("tool", "entry:agents/my-slug"),
    ).toBeNull();
  });
});

describe("normalizeCommunityClientId", () => {
  it("accepts 16-96 char ids and trims surrounding whitespace", () => {
    expect(normalizeCommunityClientId("abcdef0123456789")).toBe(
      "abcdef0123456789",
    );
    expect(normalizeCommunityClientId("  abcdef0123456789  ")).toBe(
      "abcdef0123456789",
    );
  });

  it("rejects ids that are too short or absent", () => {
    expect(normalizeCommunityClientId("short")).toBeNull();
    expect(normalizeCommunityClientId(null)).toBeNull();
  });
});
