import { describe, expect, it } from "vitest";

import {
  currentUrlPath,
  externalReferrer,
} from "../apps/web/src/lib/umami-nav-lib";

describe("currentUrlPath", () => {
  it("joins pathname and search", () => {
    expect(currentUrlPath({ pathname: "/browse", search: "?q=mcp" })).toBe(
      "/browse?q=mcp",
    );
  });

  it("returns just the pathname when there is no query", () => {
    expect(currentUrlPath({ pathname: "/entry/mcp/foo", search: "" })).toBe(
      "/entry/mcp/foo",
    );
  });
});

describe("externalReferrer", () => {
  const ORIGIN = "https://heyclaude.com";

  it("returns '' when there is no referrer", () => {
    expect(externalReferrer("", ORIGIN)).toBe("");
  });

  it("returns '' for a same-origin referrer", () => {
    expect(externalReferrer("https://heyclaude.com/browse", ORIGIN)).toBe("");
  });

  it("returns the referrer for an external origin", () => {
    expect(externalReferrer("https://news.ycombinator.com/", ORIGIN)).toBe(
      "https://news.ycombinator.com/",
    );
  });

  it("returns '' for a malformed referrer", () => {
    expect(externalReferrer("not a url", ORIGIN)).toBe("");
  });
});
