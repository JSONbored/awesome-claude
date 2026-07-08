import { describe, expect, it } from "vitest";

import { safeGitHubAuthUrl } from "../apps/web/src/lib/github-auth-url-lib";

describe("safeGitHubAuthUrl", () => {
  it("accepts an https github.com URL and returns it normalized", () => {
    expect(
      safeGitHubAuthUrl("https://github.com/login/oauth/authorize?client_id=x"),
    ).toBe("https://github.com/login/oauth/authorize?client_id=x");
  });

  it("rejects a non-https scheme", () => {
    expect(safeGitHubAuthUrl("http://github.com/login/oauth/authorize")).toBe(
      "",
    );
  });

  it("rejects a host that is not on the allowlist", () => {
    expect(
      safeGitHubAuthUrl("https://evil.example/login/oauth/authorize"),
    ).toBe("");
    expect(safeGitHubAuthUrl("https://github.com.evil.example/authorize")).toBe(
      "",
    );
  });

  it("returns '' for an unparseable value", () => {
    expect(safeGitHubAuthUrl("not a url")).toBe("");
    expect(safeGitHubAuthUrl("")).toBe("");
  });
});
