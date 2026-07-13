import { describe, expect, it } from "vitest";

import { getBaseUrl, getToken } from "../scripts/lib/job-sources-admin.mjs";

describe("getToken", () => {
  it("prefers ADMIN_API_TOKEN, then the fallbacks, and trims", () => {
    expect(getToken({ ADMIN_API_TOKEN: "  a  " })).toBe("a");
    expect(getToken({ JOBS_ADMIN_API_TOKEN: "b" })).toBe("b");
    expect(getToken({ LEADS_ADMIN_TOKEN: "c" })).toBe("c");
    expect(getToken({ ADMIN_LEADS_TOKEN: "d" })).toBe("d");
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
    expect(() => getBaseUrl({}, {})).toThrow(/Missing --base-url/);
  });
});
