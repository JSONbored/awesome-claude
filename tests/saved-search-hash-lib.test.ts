import { describe, expect, it } from "vitest";

import type { SavedSearch } from "../apps/web/src/lib/recents";
import { hashSearch } from "../apps/web/src/lib/saved-search-hash-lib";

const search = (over: Partial<SavedSearch> = {}) =>
  ({ q: "", ...over }) as SavedSearch;

describe("hashSearch", () => {
  it("is deterministic for the same search", () => {
    const s = search({ q: "mcp", category: "mcp", trust: "trusted" });
    expect(hashSearch(s)).toBe(hashSearch(s));
  });

  it("produces a base36 string", () => {
    expect(hashSearch(search({ q: "hello world" }))).toMatch(/^[0-9a-z]+$/);
  });

  it("differs when the query differs", () => {
    expect(hashSearch(search({ q: "a" }))).not.toBe(
      hashSearch(search({ q: "b" })),
    );
  });

  it("differs when a filter is added", () => {
    expect(hashSearch(search({ q: "x" }))).not.toBe(
      hashSearch(search({ q: "x", category: "hooks" })),
    );
  });

  it("treats an undefined filter the same as an empty string", () => {
    expect(hashSearch(search({ q: "x", category: undefined }))).toBe(
      hashSearch(search({ q: "x", category: "" as SavedSearch["category"] })),
    );
  });

  it("distinguishes which filter field a value sits in", () => {
    expect(hashSearch(search({ q: "x", trust: "trusted" }))).not.toBe(
      hashSearch(
        search({ q: "x", source: "trusted" as SavedSearch["source"] }),
      ),
    );
  });
});
