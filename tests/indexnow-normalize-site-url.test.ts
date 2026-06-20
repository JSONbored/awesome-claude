import { describe, expect, it } from "vitest";

import { normalizeSiteUrl } from "../scripts/lib/indexnow.mjs";

describe("normalizeSiteUrl", () => {
  it("reduces a URL to its origin, dropping path/query/hash", () => {
    // IndexNow keys on the site origin, so any path/query/fragment is stripped.
    expect(normalizeSiteUrl("https://heyclau.de/some/path?q=1#h")).toBe(
      "https://heyclau.de",
    );
  });

  it("strips a trailing slash", () => {
    expect(normalizeSiteUrl("https://heyclau.de/")).toBe("https://heyclau.de");
  });

  it("falls back to the default base URL when no value is given", () => {
    expect(normalizeSiteUrl()).toBe("https://heyclau.de");
  });

  it("throws on a value that is not a parseable URL", () => {
    expect(() => normalizeSiteUrl("not-a-url")).toThrow();
  });
});
