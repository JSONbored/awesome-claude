import { afterEach, beforeEach, describe, expect, it } from "vitest";

import {
  getAdminToken,
  getAdminTokens,
  isAdminAuthorized,
  isJobsAdminAuthorized,
  isLeadsAdminAuthorized,
} from "../apps/web/src/lib/admin-auth-lib";

const TOKEN_NAMES = [
  "ADMIN_API_TOKEN",
  "JOBS_ADMIN_API_TOKEN",
  "LEADS_ADMIN_TOKEN",
  "ADMIN_LEADS_TOKEN",
] as const;

const originalEnv: Record<string, string | undefined> = {};

beforeEach(() => {
  for (const name of TOKEN_NAMES) {
    originalEnv[name] = process.env[name];
    delete process.env[name];
  }
});

afterEach(() => {
  for (const name of TOKEN_NAMES) {
    if (originalEnv[name] === undefined) delete process.env[name];
    else process.env[name] = originalEnv[name];
  }
});

function bearerRequest(token: string) {
  return new Request("https://example.com/api/admin", {
    headers: { authorization: `Bearer ${token}` },
  });
}

function headerRequest(token: string) {
  return new Request("https://example.com/api/admin", {
    headers: { "x-admin-token": token },
  });
}

describe("admin-auth-lib token discovery", () => {
  it("reads the primary admin token from the environment", () => {
    process.env.ADMIN_API_TOKEN = "primary-token";
    expect(getAdminToken()).toBe("primary-token");
    expect(getAdminTokens()).toEqual(["primary-token"]);
  });

  it("trims surrounding whitespace and ignores blank tokens", () => {
    process.env.ADMIN_API_TOKEN = "  spaced-token  ";
    expect(getAdminTokens()).toEqual(["spaced-token"]);

    process.env.ADMIN_API_TOKEN = "   ";
    expect(getAdminTokens()).toEqual([]);
  });
});

describe("admin-auth-lib isAdminAuthorized", () => {
  beforeEach(() => {
    process.env.ADMIN_API_TOKEN = "primary-token";
  });

  it("accepts a matching bearer token", () => {
    expect(isAdminAuthorized(bearerRequest("primary-token"))).toBe(true);
  });

  it("accepts a matching x-admin-token header", () => {
    expect(isAdminAuthorized(headerRequest("primary-token"))).toBe(true);
  });

  it("rejects a mismatched token of the same length", () => {
    expect(isAdminAuthorized(bearerRequest("primary-tokeX"))).toBe(false);
  });

  it("rejects a token that is only a prefix of the real token", () => {
    expect(isAdminAuthorized(bearerRequest("primary"))).toBe(false);
  });

  it("rejects a request with no credentials", () => {
    expect(
      isAdminAuthorized(new Request("https://example.com/api/admin")),
    ).toBe(false);
  });
});

describe("admin-auth-lib scoped authorization", () => {
  it("accepts the jobs-scoped token for jobs admin only", () => {
    process.env.JOBS_ADMIN_API_TOKEN = "jobs-token";
    expect(isJobsAdminAuthorized(bearerRequest("jobs-token"))).toBe(true);
    expect(isAdminAuthorized(bearerRequest("jobs-token"))).toBe(false);
  });

  it("accepts either leads token alias for leads admin only", () => {
    process.env.LEADS_ADMIN_TOKEN = "leads-token";
    process.env.ADMIN_LEADS_TOKEN = "leads-alias";
    expect(isLeadsAdminAuthorized(headerRequest("leads-token"))).toBe(true);
    expect(isLeadsAdminAuthorized(headerRequest("leads-alias"))).toBe(true);
    expect(isAdminAuthorized(headerRequest("leads-token"))).toBe(false);
  });

  it("accepts the primary token for every scope", () => {
    process.env.ADMIN_API_TOKEN = "primary-token";
    expect(isAdminAuthorized(bearerRequest("primary-token"))).toBe(true);
    expect(isJobsAdminAuthorized(bearerRequest("primary-token"))).toBe(true);
    expect(isLeadsAdminAuthorized(bearerRequest("primary-token"))).toBe(true);
  });
});
