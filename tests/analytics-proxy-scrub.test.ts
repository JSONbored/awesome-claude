import { describe, expect, it } from "vitest";

import {
  joinAnalyticsUpstreamUrl,
  scrubSensitiveUrlSearch,
  scrubSensitiveAnalyticsBody,
} from "@/lib/analytics-proxy";

const paramValue = (urlOrPath: string, name: string) =>
  new URL(urlOrPath, "https://heyclau.de").searchParams.get(name);

describe("joinAnalyticsUpstreamUrl", () => {
  it("joins base and path with exactly one slash regardless of input slashes", () => {
    expect(joinAnalyticsUpstreamUrl("https://up.example/", "track")).toBe(
      "https://up.example/track",
    );
    expect(joinAnalyticsUpstreamUrl("https://up.example", "/track")).toBe(
      "https://up.example/track",
    );
  });
});

describe("scrubSensitiveUrlSearch", () => {
  it("redacts generic sensitive params while keeping the rest", () => {
    const out = scrubSensitiveUrlSearch(
      "https://heyclau.de/x?token=abc&q=1",
    ) as string;
    expect(paramValue(out, "token")).toBe("[redacted]");
    expect(paramValue(out, "q")).toBe("1");
  });

  it("preserves the relative form when the input was relative", () => {
    const out = scrubSensitiveUrlSearch("/x?email=a@b.com&page=2") as string;
    expect(out.startsWith("/x?")).toBe(true);
    expect(paramValue(out, "email")).toBe("[redacted]");
    expect(paramValue(out, "page")).toBe("2");
  });

  it("applies path-specific sensitive params (e.g. /brief/approve token)", () => {
    const out = scrubSensitiveUrlSearch("/brief/approve?token=xyz") as string;
    expect(paramValue(out, "token")).toBe("[redacted]");
  });

  it("returns the input unchanged when nothing is sensitive or not a string", () => {
    expect(scrubSensitiveUrlSearch("/x?q=1")).toBe("/x?q=1");
    // Non-string inputs pass straight through.
    expect(scrubSensitiveUrlSearch(42)).toBe(42);
  });
});

describe("scrubSensitiveAnalyticsBody", () => {
  it("scrubs the sensitive query in payload.url", () => {
    const body = JSON.stringify({ payload: { url: "/x?token=secret" } });
    const out = JSON.parse(scrubSensitiveAnalyticsBody(body)) as {
      payload: { url: string };
    };
    expect(paramValue(out.payload.url, "token")).toBe("[redacted]");
  });

  it("returns the body unchanged for clean urls, non-JSON, or missing payload", () => {
    const clean = JSON.stringify({ payload: { url: "/x?q=1" } });
    expect(scrubSensitiveAnalyticsBody(clean)).toBe(clean);
    expect(scrubSensitiveAnalyticsBody("not json")).toBe("not json");
    const noPayload = JSON.stringify({ foo: 1 });
    expect(scrubSensitiveAnalyticsBody(noPayload)).toBe(noPayload);
  });
});
