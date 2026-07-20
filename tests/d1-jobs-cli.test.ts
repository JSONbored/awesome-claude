import { describe, expect, it } from "vitest";

import {
  getBaseUrl,
  getToken,
  parseArgs,
} from "../scripts/lib/d1-jobs-cli.mjs";

describe("parseArgs", () => {
  it("reads the leading command and defaults it to ''", () => {
    expect(parseArgs(["health"]).command).toBe("health");
    expect(parseArgs([]).command).toBe("");
  });

  it("takes a following non-flag token as a flag value and consumes it", () => {
    expect(parseArgs(["list", "--status", "active"])).toEqual({
      command: "list",
      status: "active",
    });
  });

  it("treats a flag with no value, or one followed by another flag, as '1'", () => {
    expect(parseArgs(["list", "--json"])).toEqual({
      command: "list",
      json: "1",
    });
    expect(parseArgs(["list", "--json", "--status", "active"])).toEqual({
      command: "list",
      json: "1",
      status: "active",
    });
  });

  it("ignores stray non-flag tokens after the command", () => {
    expect(parseArgs(["upsert", "stray", "--file", "job.json"])).toEqual({
      command: "upsert",
      file: "job.json",
    });
  });
});

describe("getToken", () => {
  it("prefers ADMIN_API_TOKEN, then the fallbacks, and trims", () => {
    expect(getToken({ ADMIN_API_TOKEN: "  a  " })).toBe("a");
    expect(getToken({ JOBS_ADMIN_API_TOKEN: "jobs" })).toBe("jobs");
    expect(getToken({ LEADS_ADMIN_TOKEN: "b" })).toBe("b");
    expect(getToken({ ADMIN_LEADS_TOKEN: "c" })).toBe("c");
  });

  it("returns '' when no token env var is set", () => {
    expect(getToken({})).toBe("");
  });
});

describe("getBaseUrl", () => {
  it("prefers --base-url and strips a trailing slash", () => {
    expect(getBaseUrl({ "base-url": "https://x.dev/" }, {})).toBe(
      "https://x.dev",
    );
  });

  it("falls back through the accepted environment variables", () => {
    expect(getBaseUrl({}, { HEYCLAUDE_ADMIN_BASE_URL: "https://a.dev" })).toBe(
      "https://a.dev",
    );
    expect(getBaseUrl({}, { HEYCLAUDE_BASE_URL: "https://b.dev" })).toBe(
      "https://b.dev",
    );
  });

  it("throws when neither a flag nor an env var provides a base URL", () => {
    expect(() => getBaseUrl({}, {})).toThrow(
      /Missing --base-url or HEYCLAUDE_ADMIN_BASE_URL/,
    );
  });
});
