import { describe, expect, it } from "vitest";

import {
  emptyWatchState,
  parseWatchState,
  WATCH_EPOCH,
} from "../apps/web/src/lib/watch-storage-lib";

describe("emptyWatchState", () => {
  it("has no targets and sits at the epoch", () => {
    expect(emptyWatchState()).toEqual({ targets: [], lastSeenAt: WATCH_EPOCH });
  });

  it("returns a fresh object each call", () => {
    emptyWatchState().targets.push({
      id: "x",
      kind: "entry",
      label: "X",
      addedAt: "2026-01-01",
    });
    expect(emptyWatchState().targets).toEqual([]);
  });
});

describe("parseWatchState", () => {
  it("returns the empty state for a missing value", () => {
    expect(parseWatchState(null)).toEqual(emptyWatchState());
    expect(parseWatchState(undefined)).toEqual(emptyWatchState());
    expect(parseWatchState("")).toEqual(emptyWatchState());
  });

  it("returns the empty state for malformed JSON", () => {
    expect(parseWatchState("{not json")).toEqual(emptyWatchState());
  });

  it("round-trips a well-formed payload", () => {
    const state = {
      targets: [
        {
          id: "entry:agents/a",
          kind: "entry" as const,
          label: "A",
          addedAt: "2026-01-01",
        },
      ],
      lastSeenAt: "2026-02-02",
    };
    expect(parseWatchState(JSON.stringify(state))).toEqual(state);
  });

  it("replaces a non-array targets with an empty list", () => {
    expect(
      parseWatchState(JSON.stringify({ targets: "nope" })).targets,
    ).toEqual([]);
  });

  it("falls back to the epoch for a missing or non-string lastSeenAt", () => {
    expect(parseWatchState(JSON.stringify({ targets: [] })).lastSeenAt).toBe(
      WATCH_EPOCH,
    );
    expect(parseWatchState(JSON.stringify({ lastSeenAt: 5 })).lastSeenAt).toBe(
      WATCH_EPOCH,
    );
  });
});
