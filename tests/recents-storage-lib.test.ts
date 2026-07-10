import { describe, expect, it } from "vitest";

import {
  emptyRecentsState,
  parseRecentsState,
} from "../apps/web/src/lib/recents-storage-lib";

describe("emptyRecentsState", () => {
  it("has every list empty", () => {
    expect(emptyRecentsState()).toEqual({
      entries: [],
      saved: [],
      follows: [],
      segments: [],
    });
  });

  it("returns a fresh object each call", () => {
    const a = emptyRecentsState();
    a.entries.push({
      category: "agents",
      slug: "x",
      title: "X",
      visitedAt: "",
    });
    expect(emptyRecentsState().entries).toEqual([]);
  });
});

describe("parseRecentsState", () => {
  it("returns the empty state for a missing value", () => {
    expect(parseRecentsState(null)).toEqual(emptyRecentsState());
    expect(parseRecentsState(undefined)).toEqual(emptyRecentsState());
    expect(parseRecentsState("")).toEqual(emptyRecentsState());
  });

  it("returns the empty state for malformed JSON", () => {
    expect(parseRecentsState("{not json")).toEqual(emptyRecentsState());
  });

  it("round-trips a well-formed payload", () => {
    const state = {
      entries: [
        { category: "agents", slug: "a", title: "A", visitedAt: "2026-01-01" },
      ],
      saved: [],
      follows: [],
      segments: [],
    };
    expect(parseRecentsState(JSON.stringify(state))).toEqual(state);
  });

  it("replaces non-array fields with empty lists", () => {
    expect(
      parseRecentsState(
        JSON.stringify({ entries: "nope", saved: 5, follows: null }),
      ),
    ).toEqual(emptyRecentsState());
  });

  it("fills in fields missing from the payload", () => {
    const parsed = parseRecentsState(JSON.stringify({ saved: [{ id: "s1" }] }));
    expect(parsed.saved).toHaveLength(1);
    expect(parsed.entries).toEqual([]);
    expect(parsed.follows).toEqual([]);
    expect(parsed.segments).toEqual([]);
  });
});
