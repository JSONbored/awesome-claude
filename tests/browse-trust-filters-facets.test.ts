import { describe, expect, it } from "vitest";

import {
  BROWSE_TRUST_SIGNAL_OPTIONS,
  buildBrowseTrustSignalCounts,
  buildBrowseTrustUtilityOptions,
  type BrowseTrustSearchSlice,
} from "../apps/web/src/lib/browse-trust-filters-lib";

const emptySlice: BrowseTrustSearchSlice = {
  q: "",
  category: "",
  trust: "",
  source: "",
  signal: "",
  platform: "",
  sort: "newest",
};

const fullSlice: BrowseTrustSearchSlice = {
  q: "browser",
  category: "mcp",
  trust: "verified",
  source: "available",
  signal: "",
  platform: "cursor",
  sort: "popular",
};

function recordingCountFn() {
  const calls: Record<string, unknown>[] = [];
  const countFn = ((filters: Record<string, unknown>) => {
    calls.push(filters);
    return 1;
  }) as never;
  return { calls, countFn };
}

describe("browse-trust-filters-lib buildBrowseTrustSignalCounts", () => {
  it("counts every trust signal option once", () => {
    const { calls, countFn } = recordingCountFn();
    const counts = buildBrowseTrustSignalCounts(fullSlice, countFn);
    expect(calls).toHaveLength(BROWSE_TRUST_SIGNAL_OPTIONS.length);
    expect(Object.keys(counts)).toEqual(
      BROWSE_TRUST_SIGNAL_OPTIONS.map((option) => option.id),
    );
    expect(calls.map((call) => call.signal)).toEqual(
      BROWSE_TRUST_SIGNAL_OPTIONS.map((option) => option.id),
    );
  });

  it("wraps populated facets into arrays for the search filters", () => {
    const { calls, countFn } = recordingCountFn();
    buildBrowseTrustSignalCounts(fullSlice, countFn);
    expect(calls[0]).toMatchObject({
      q: "browser",
      categories: ["mcp"],
      trust: ["verified"],
      source: ["available"],
      platforms: ["cursor"],
      sort: "popular",
    });
  });

  it("omits blank facets instead of sending empty arrays", () => {
    const { calls, countFn } = recordingCountFn();
    buildBrowseTrustSignalCounts(emptySlice, countFn);
    expect(calls[0].categories).toBeUndefined();
    expect(calls[0].trust).toBeUndefined();
    expect(calls[0].source).toBeUndefined();
    expect(calls[0].platforms).toBeUndefined();
  });
});

describe("browse-trust-filters-lib buildBrowseTrustUtilityOptions", () => {
  it("prepends an all-signals option and labels each count", () => {
    const options = buildBrowseTrustUtilityOptions({
      "safety-notes": 3,
    } as never);
    expect(options[0]).toEqual({
      id: "",
      label: "All trust signals",
      count: 0,
    });
    expect(options[1]).toEqual({
      id: "safety-notes",
      label: "Safety notes (3)",
      count: 3,
    });
  });

  it("defaults a missing count to zero", () => {
    const options = buildBrowseTrustUtilityOptions({} as never);
    const privacy = options.find((option) => option.id === "privacy-notes");
    expect(privacy).toEqual({
      id: "privacy-notes",
      label: "Privacy notes (0)",
      count: 0,
    });
  });
});
