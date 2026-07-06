import { describe, expect, it } from "vitest";

import {
  hasEmbeddedUrlUserinfo,
  isPublicGitHubProfileUrl,
  isPublicHttpsUrl,
  publicUrlHostname,
} from "../packages/mcp/src/public-url-lib.js";

describe("hasEmbeddedUrlUserinfo", () => {
  it.each([
    ["https://token@example.com/docs", true],
    ["https://user:pass@example.com/docs", true],
    ["https://user@example.com", true],
    ["https://:pass@example.com", true],
    ["https://example.com/docs", false],
    ["http://user@example.com", true],
    ["", false],
    ["   ", false],
    ["not-a-url", false],
    ["ftp://user@example.com/file", true],
    ["https://user@github.com/octocat", true],
    ["https://user%40name@example.com", true],
  ] as const)("returns %s => %s", (url, expected) => {
    expect(hasEmbeddedUrlUserinfo(url)).toBe(expected);
  });

  it.each([null, undefined, 0, false])(
    "coerces %s to empty string",
    (value) => {
      expect(hasEmbeddedUrlUserinfo(value as unknown as string)).toBe(false);
    },
  );

  it("detects username-only userinfo without password", () => {
    expect(
      hasEmbeddedUrlUserinfo("https://deploy-key@api.example.com/v1"),
    ).toBe(true);
  });

  it("detects password-only userinfo with empty username", () => {
    expect(hasEmbeddedUrlUserinfo("https://:secret@internal.example.com")).toBe(
      true,
    );
  });

  it("returns false when URL parsing fails", () => {
    expect(hasEmbeddedUrlUserinfo("https://[")).toBe(false);
    expect(hasEmbeddedUrlUserinfo("://missing-scheme")).toBe(false);
  });

  it("returns false for plain host strings without scheme", () => {
    expect(hasEmbeddedUrlUserinfo("example.com/path")).toBe(false);
  });

  it("returns false for https URLs with query-only auth hints", () => {
    expect(hasEmbeddedUrlUserinfo("https://example.com?token=abc")).toBe(false);
  });
});

describe("isPublicHttpsUrl", () => {
  it.each([
    ["", true],
    ["   ", true],
    [null, true],
    [undefined, true],
  ] as const)("treats empty-ish input %s as valid", (value) => {
    expect(isPublicHttpsUrl(value as unknown as string)).toBe(true);
  });

  it.each([
    ["https://example.com", true],
    ["https://example.com/docs", true],
    ["https://sub.example.com:8443/path?q=1", true],
    ["HTTPS://EXAMPLE.COM/PATH", true],
    ["https://example.com/path#fragment", true],
  ])("accepts public https URL %s", (url) => {
    expect(isPublicHttpsUrl(url)).toBe(true);
  });

  it.each([
    ["http://example.com/docs", false],
    ["http://example.com", false],
    ["ftp://example.com/file", false],
    ["file:///etc/passwd", false],
    ["ws://example.com/socket", false],
    ["wss://example.com/socket", false],
  ])("rejects non-https scheme %s", (url) => {
    expect(isPublicHttpsUrl(url)).toBe(false);
  });

  it.each([
    ["https://token@example.com/docs", false],
    ["https://user:pass@example.com", false],
    ["https://user@github.com/octocat", false],
    ["https://:pass@example.com", false],
  ])("rejects https URL with embedded credentials %s", (url) => {
    expect(isPublicHttpsUrl(url)).toBe(false);
  });

  it.each([
    ["not-a-url", false],
    ["https://[", false],
    ["://no-scheme", false],
    ["example.com", false],
    ["//example.com/path", false],
    ["https://", false],
  ])("rejects malformed URL %s", (url) => {
    expect(isPublicHttpsUrl(url)).toBe(false);
  });

  it("trims surrounding whitespace before validation", () => {
    expect(isPublicHttpsUrl("  https://example.com/docs  ")).toBe(true);
    expect(isPublicHttpsUrl("  http://example.com  ")).toBe(false);
  });

  it("accepts https localhost URLs without userinfo", () => {
    expect(isPublicHttpsUrl("https://localhost:3000/api")).toBe(true);
    expect(isPublicHttpsUrl("https://127.0.0.1/path")).toBe(true);
  });

  it("rejects https localhost with embedded credentials", () => {
    expect(isPublicHttpsUrl("https://admin:admin@localhost")).toBe(false);
  });
});

describe("isPublicGitHubProfileUrl", () => {
  it.each([
    ["https://github.com/octocat", true],
    ["https://github.com/OctoCat", true],
    ["https://github.com/user-name", true],
    ["https://github.com/user_name", true],
    ["https://github.com/a", true],
    ["https://GITHUB.COM/octocat", true],
  ])("accepts single-segment profile URL %s", (url) => {
    expect(isPublicGitHubProfileUrl(url)).toBe(true);
  });

  it.each([
    ["https://github.com/octocat/repo", false],
    ["https://github.com/org/repo/tree/main", false],
    ["https://github.com/settings/profile", false],
    ["https://github.com/octocat/repo/issues", false],
    ["https://github.com/", false],
    ["https://github.com", false],
    ["https://www.github.com/octocat", false],
    ["https://gist.github.com/octocat", false],
    ["https://raw.githubusercontent.com/user/repo/main/file", false],
  ])("rejects non-profile GitHub URL %s", (url) => {
    expect(isPublicGitHubProfileUrl(url)).toBe(false);
  });

  it.each([
    ["http://github.com/octocat", false],
    ["https://token@github.com/octocat", false],
    ["https://user:pass@github.com/octocat", false],
  ])("rejects insecure or credentialed profile URL %s", (url) => {
    expect(isPublicGitHubProfileUrl(url)).toBe(false);
  });

  it.each([
    ["", false],
    ["not-a-url", false],
    ["https://[", false],
    ["https://example.com/octocat", false],
    [null, false],
    [undefined, false],
  ] as const)("rejects invalid or empty input %s", (value) => {
    expect(isPublicGitHubProfileUrl(value as unknown as string)).toBe(false);
  });

  it("accepts profile URLs with a trailing slash and no extra segments", () => {
    expect(isPublicGitHubProfileUrl("https://github.com/octocat/")).toBe(true);
  });

  it("rejects profile URLs with query strings that add no path segments", () => {
    expect(
      isPublicGitHubProfileUrl("https://github.com/octocat?tab=repositories"),
    ).toBe(true);
  });

  it("rejects enterprise GitHub hostnames", () => {
    expect(isPublicGitHubProfileUrl("https://github.example.com/octocat")).toBe(
      false,
    );
  });
});

describe("publicUrlHostname", () => {
  it.each([
    ["https://www.Example.com/path", "example.com"],
    ["https://EXAMPLE.COM", "example.com"],
    ["https://api.example.com/v1", "api.example.com"],
    ["https://sub.www.example.com", "sub.www.example.com"],
    ["http://www.example.com", "example.com"],
    ["https://localhost", "localhost"],
    ["https://127.0.0.1", "127.0.0.1"],
  ])("extracts normalized hostname from %s", (url, expected) => {
    expect(publicUrlHostname(url)).toBe(expected);
  });

  it.each([
    ["https://token@example.com/path", ""],
    ["https://user:pass@example.com", ""],
    ["https://:pass@example.com", ""],
    ["", ""],
    ["   ", ""],
    ["not-a-url", ""],
    ["https://[", ""],
    [null, ""],
    [undefined, ""],
  ] as const)(
    "returns empty hostname for blocked or invalid input %s",
    (value) => {
      expect(publicUrlHostname(value as unknown as string)).toBe("");
    },
  );

  it("strips only a leading www. prefix", () => {
    expect(publicUrlHostname("https://www.api.example.com")).toBe(
      "api.example.com",
    );
    expect(publicUrlHostname("https://www2.example.com")).toBe(
      "www2.example.com",
    );
  });

  it("lowercases mixed-case hostnames", () => {
    expect(publicUrlHostname("https://WWW.MyProject.IO/docs")).toBe(
      "myproject.io",
    );
  });

  it("preserves port numbers in hostname extraction", () => {
    expect(publicUrlHostname("https://example.com:8443/path")).toBe(
      "example.com",
    );
  });

  it("returns github.com for public profile URLs", () => {
    expect(publicUrlHostname("https://github.com/octocat")).toBe("github.com");
  });

  it("returns empty string when credentials are embedded in github URLs", () => {
    expect(publicUrlHostname("https://token@github.com/octocat")).toBe("");
  });

  it("handles internationalized domain hostnames", () => {
    expect(publicUrlHostname("https://www.xn--bcher-kva.example")).toBe(
      "xn--bcher-kva.example",
    );
  });

  it("trims input before parsing", () => {
    expect(publicUrlHostname("  https://www.Example.com/path  ")).toBe(
      "example.com",
    );
  });
});

describe("public URL helper integration", () => {
  it.each([
    "https://docs.example.com/guide",
    "https://api.example.com/v2",
    "https://releases.example.com/latest",
  ])("public https URL %s has no embedded userinfo", (url) => {
    expect(hasEmbeddedUrlUserinfo(url)).toBe(false);
    expect(isPublicHttpsUrl(url)).toBe(true);
    expect(publicUrlHostname(url)).not.toBe("");
  });

  it.each([
    "https://user@example.com/private",
    "https://user:pass@example.com/private",
  ])("credentialed URL %s fails public checks", (url) => {
    expect(hasEmbeddedUrlUserinfo(url)).toBe(true);
    expect(isPublicHttpsUrl(url)).toBe(false);
    expect(publicUrlHostname(url)).toBe("");
  });

  it("github profile URLs pass profile and hostname checks together", () => {
    const url = "https://github.com/octocat";
    expect(isPublicGitHubProfileUrl(url)).toBe(true);
    expect(isPublicHttpsUrl(url)).toBe(true);
    expect(publicUrlHostname(url)).toBe("github.com");
    expect(hasEmbeddedUrlUserinfo(url)).toBe(false);
  });
});

describe("isPublicGitHubProfileUrl reserved paths", () => {
  it.each([
    ["https://github.com/login", true],
    ["https://github.com/explore", true],
    ["https://github.com/marketplace", true],
  ])("treats single-segment reserved path %s as profile-shaped URL", (url) => {
    expect(isPublicGitHubProfileUrl(url)).toBe(true);
  });
});

describe("isPublicHttpsUrl scheme edge cases", () => {
  it.each([
    ["javascript:alert(1)", false],
    ["data:text/plain,hello", false],
    ["mailto:user@example.com", false],
  ])("rejects non-http(s) URL scheme %s", (url) => {
    expect(isPublicHttpsUrl(url)).toBe(false);
  });

  it("accepts https URL with encoded path segments", () => {
    expect(isPublicHttpsUrl("https://example.com/path%20with%20spaces")).toBe(
      true,
    );
  });
});

describe("publicUrlHostname edge cases", () => {
  it.each([["https://user:pass@sub.example.com/x", ""]])(
    "hostname for %s is %s",
    (url, expected) => {
      expect(publicUrlHostname(url)).toBe(expected);
    },
  );

  it("preserves trailing dot in hostname when URL parser includes it", () => {
    expect(publicUrlHostname("https://example.com.")).toBe("example.com.");
  });

  it("returns punycode hostname for unicode domains", () => {
    expect(publicUrlHostname("https://www.münchen.de")).toBe(
      "xn--mnchen-3ya.de",
    );
  });
});

describe("hasEmbeddedUrlUserinfo edge cases", () => {
  it.each([
    ["https://example.com/user@home", false],
    ["https://example.com#user@home", false],
  ])("does not treat @ in path or fragment as userinfo for %s", (url) => {
    expect(hasEmbeddedUrlUserinfo(url)).toBe(false);
  });

  it.each([
    "https://apikey:secret@hooks.slack.com/services/T/B/X",
    "https://oauth2:token@git.example.com/repo.git",
    "https://deploy@registry.npmjs.org/",
  ])("detects credentials in deployment URL %s", (url) => {
    expect(hasEmbeddedUrlUserinfo(url)).toBe(true);
  });
});

describe("isPublicHttpsUrl exhaustive matrix", () => {
  it.each([
    ["https://example.com:443/", true],
    ["https://example.com/path/to/resource", true],
    ["https://example.com?redirect=https://evil.com", true],
    ["https://example.com/path;param=value", true],
  ])("accepts well-formed public https URL %s", (url, expected) => {
    expect(isPublicHttpsUrl(url)).toBe(expected);
  });

  it.each([
    ["HTTP://EXAMPLE.COM", false],
    ["https://user:pass@127.0.0.1:8080", false],
    ["https://user@127.0.0.1", false],
  ])("rejects mixed-scheme or credentialed localhost URL %s", (url) => {
    expect(isPublicHttpsUrl(url)).toBe(false);
  });

  it.each([null, undefined, "", []])(
    "treats empty-ish coercible values as valid",
    (value) => {
      expect(isPublicHttpsUrl(value as unknown as string)).toBe(true);
    },
  );

  it.each([0, false, {}])(
    "rejects non-empty coercible values that fail URL parsing",
    (value) => {
      expect(isPublicHttpsUrl(value as unknown as string)).toBe(false);
    },
  );
});

describe("isPublicGitHubProfileUrl path segmentation", () => {
  it.each([
    ["https://github.com/octocat/", true],
    ["https://github.com/octocat?tab=stars", true],
    ["https://github.com/octocat#start-of-content", true],
    ["https://github.com/orgs/acme", false],
    ["https://github.com/orgs/acme/people", false],
    ["https://github.com/sponsors/octocat", false],
    ["https://github.com/features/copilot", false],
    ["https://github.com/enterprise", true],
  ])("profile check for %s => %s", (url, expected) => {
    expect(isPublicGitHubProfileUrl(url)).toBe(expected);
  });

  it.each([
    "https://github.com/a-b-c",
    "https://github.com/abc123",
    "https://github.com/123user",
  ])("accepts hyphenated and numeric github usernames %s", (url) => {
    expect(isPublicGitHubProfileUrl(url)).toBe(true);
  });
});

describe("publicUrlHostname normalization matrix", () => {
  it.each([
    ["https://WWW.EXAMPLE.COM/PATH", "example.com"],
    ["https://www.example.co.uk", "example.co.uk"],
    ["https://cdn.example.com/assets/app.js", "cdn.example.com"],
    ["http://WWW.EXAMPLE.ORG", "example.org"],
    ["https://EXAMPLE.COM", "example.com"],
  ])("normalizes hostname from %s to %s", (url, expected) => {
    expect(publicUrlHostname(url)).toBe(expected);
  });

  it.each([
    "",
    "   ",
    "https://user@internal.corp",
    "https://user:pass@internal.corp",
  ])("returns empty hostname for invalid or credentialed URL %s", (url) => {
    expect(publicUrlHostname(url)).toBe("");
  });

  it("extracts hostname from ftp URLs when no credentials are present", () => {
    expect(publicUrlHostname("ftp://example.com")).toBe("example.com");
  });

  it("returns empty hostname when parseUrl fails on truncated ipv6 literal", () => {
    expect(publicUrlHostname("https://[2001:db8::1")).toBe("");
  });

  it.each([
    ["https://github.com/octocat", "github.com"],
    ["https://raw.githubusercontent.com", "raw.githubusercontent.com"],
  ])("extracts hostname %s from %s", (url, expected) => {
    expect(publicUrlHostname(url)).toBe(expected);
  });
});

describe("cross-helper consistency checks", () => {
  it.each([
    "https://releases.example.com/latest",
    "https://docs.example.com/guide/install",
    "https://api.example.com/v2/search",
  ])("public asset URL %s passes all public checks", (url) => {
    expect(hasEmbeddedUrlUserinfo(url)).toBe(false);
    expect(isPublicHttpsUrl(url)).toBe(true);
    expect(publicUrlHostname(url)).toMatch(/example\.com$/);
  });

  it.each([
    "http://releases.example.com/latest",
    "ftp://releases.example.com/latest",
  ])("non-https asset URL %s fails isPublicHttpsUrl", (url) => {
    expect(isPublicHttpsUrl(url)).toBe(false);
  });
});
