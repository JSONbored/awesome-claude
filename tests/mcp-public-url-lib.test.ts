import { describe, expect, it } from "vitest";

import {
  isPublicGitHubProfileUrl,
  isPublicHttpsUrl,
  publicUrlHostname,
} from "../packages/mcp/src/public-url-lib.js";

describe("MCP public URL helpers", () => {
  it("validates public https URLs without userinfo", () => {
    expect(isPublicHttpsUrl("")).toBe(true);
    expect(isPublicHttpsUrl("https://example.com/docs")).toBe(true);
    expect(isPublicHttpsUrl("http://example.com/docs")).toBe(false);
    expect(isPublicHttpsUrl("https://token@example.com/docs")).toBe(false);
  });

  it("validates GitHub profile URLs without userinfo", () => {
    expect(isPublicGitHubProfileUrl("https://github.com/octocat")).toBe(true);
    expect(isPublicGitHubProfileUrl("https://token@github.com/octocat")).toBe(
      false,
    );
    expect(isPublicGitHubProfileUrl("https://github.com/octocat/repo")).toBe(
      false,
    );
  });

  it("extracts hostnames only from credential-free URLs", () => {
    expect(publicUrlHostname("https://www.Example.com/path")).toBe(
      "example.com",
    );
    expect(publicUrlHostname("https://token@example.com/path")).toBe("");
  });
});
