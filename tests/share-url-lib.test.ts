import { describe, expect, it } from "vitest";

import { absoluteShareUrl } from "../apps/web/src/lib/share-url-lib";

const ORIGIN = "https://heyclaude.com";

describe("absoluteShareUrl", () => {
  it("prepends the origin to a root-relative url", () => {
    expect(absoluteShareUrl("/entry/mcp/foo", ORIGIN)).toBe(
      "https://heyclaude.com/entry/mcp/foo",
    );
  });

  it("returns an already-absolute https url unchanged", () => {
    expect(absoluteShareUrl("https://example.com/x", ORIGIN)).toBe(
      "https://example.com/x",
    );
  });

  it("returns an already-absolute http url unchanged", () => {
    expect(absoluteShareUrl("http://example.com/x", ORIGIN)).toBe(
      "http://example.com/x",
    );
  });

  it("leaves a relative url unchanged when origin is empty (server render)", () => {
    expect(absoluteShareUrl("/x", "")).toBe("/x");
  });
});
