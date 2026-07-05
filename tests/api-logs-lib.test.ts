import { describe, expect, it } from "vitest";

import {
  buildLogPayload,
  pickRequestMeta,
  redactEmail,
  sample,
} from "../apps/web/src/lib/api-logs-lib";

describe("pickRequestMeta", () => {
  it("extracts method, path, query presence, and forwarded headers", () => {
    const request = new Request("https://x.dev/api/entries?q=ai", {
      method: "POST",
      headers: { "cf-ray": "abc123", "user-agent": "vitest" },
    });
    expect(pickRequestMeta(request)).toEqual({
      method: "POST",
      path: "/api/entries",
      query: "present",
      cfRay: "abc123",
      userAgent: "vitest",
    });
  });

  it("reports query as 'none' and omits absent headers as undefined", () => {
    const meta = pickRequestMeta(new Request("https://x.dev/api/health"));
    expect(meta.query).toBe("none");
    expect(meta.cfRay).toBeUndefined();
    expect(meta.userAgent).toBeUndefined();
  });
});

describe("buildLogPayload", () => {
  it("stamps an injected timestamp and spreads level/event/meta", () => {
    const now = new Date("2026-07-01T12:00:00.000Z");
    expect(
      buildLogPayload("warn", "rate_limited", { path: "/api", count: 3 }, now),
    ).toEqual({
      ts: "2026-07-01T12:00:00.000Z",
      level: "warn",
      event: "rate_limited",
      path: "/api",
      count: 3,
    });
  });
});

describe("sample", () => {
  it("never samples at rate 0 and always samples at rate 1", () => {
    // Math.random() is in [0, 1): always < 1, never < 0 — deterministic bounds.
    for (let i = 0; i < 50; i++) {
      expect(sample(0)).toBe(false);
      expect(sample(1)).toBe(true);
    }
  });
});

describe("redactEmail", () => {
  it("keeps the first two local chars and the domain, masking the rest", () => {
    expect(redactEmail("alice@example.com")).toBe("al***@example.com");
  });

  it("normalizes case and whitespace before redacting", () => {
    expect(redactEmail("  Bob@Example.COM ")).toBe("bo***@example.com");
  });

  it("returns 'invalid' for non-email input", () => {
    expect(redactEmail("not-an-email")).toBe("invalid");
    expect(redactEmail("")).toBe("invalid");
    expect(redactEmail("@no-local.com")).toBe("invalid");
  });

  it("handles a one-character local part", () => {
    expect(redactEmail("x@d.io")).toBe("x***@d.io");
  });
});
