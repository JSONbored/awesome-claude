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

describe("hashSearch delimiter escaping", () => {
  it("does not collide when content shifts across a field boundary", () => {
    // Regression: both inputs previously joined to "foo|bar|baz|||" and hashed
    // to the same value, so two unrelated saved searches shared one alert segment.
    expect(hashSearch(search({ q: "foo", category: "bar|baz" }))).not.toBe(
      hashSearch(search({ q: "foo|bar", category: "baz" })),
    );
  });

  it("does not collide when a field contains the escape character", () => {
    expect(hashSearch(search({ q: "a\\", category: "b" }))).not.toBe(
      hashSearch(search({ q: "a", category: "\b" })),
    );
  });

  it("keeps hashes stable for searches without delimiter characters", () => {
    // Escaping is a no-op for delimiter-free fields, so existing alert
    // segments keep their key.
    expect(
      hashSearch(search({ q: "browser", category: "mcp", trust: "verified" })),
    ).toBe("7l9kg2");
  });
});
