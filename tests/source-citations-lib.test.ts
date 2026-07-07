import { describe, expect, it } from "vitest";

import { hostOf } from "../apps/web/src/lib/source-citations-lib";

describe("hostOf", () => {
  it("returns undefined for an empty or missing url", () => {
    expect(hostOf(undefined)).toBeUndefined();
    expect(hostOf("")).toBeUndefined();
  });

  it("returns the host of a plain https url", () => {
    expect(hostOf("https://example.com/path?q=1")).toBe("example.com");
  });

  it("strips a leading www. prefix", () => {
    expect(hostOf("https://www.example.com")).toBe("example.com");
  });

  it("keeps non-www subdomains intact", () => {
    expect(hostOf("https://docs.example.com/x")).toBe("docs.example.com");
  });

  it("preserves a non-default port in the host", () => {
    expect(hostOf("http://localhost:3000/x")).toBe("localhost:3000");
  });

  it("returns the original string when the url cannot be parsed", () => {
    expect(hostOf("not a url")).toBe("not a url");
  });
});
