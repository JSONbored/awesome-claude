import { describe, expect, it } from "vitest";

import {
  joinAnalyticsUpstreamUrl,
  scrubSensitiveUrlSearch,
  sensitiveSearchParamsForPath,
} from "../apps/web/src/lib/analytics-proxy-lib";

describe("analytics-proxy-lib joinAnalyticsUpstreamUrl", () => {
  it("joins upstream and path", () => {
    expect(joinAnalyticsUpstreamUrl("https://u.example/", "/api/send")).toBe(
      "https://u.example/api/send",
    );
  });
  it("joinAnalyticsUpstreamUrl matrix 0", () => {
    const url = joinAnalyticsUpstreamUrl("https://u0.example", "path-0");
    expect(url).toContain("path-0");
  });
  it("joinAnalyticsUpstreamUrl matrix 1", () => {
    const url = joinAnalyticsUpstreamUrl("https://u1.example", "path-1");
    expect(url).toContain("path-1");
  });
  it("joinAnalyticsUpstreamUrl matrix 2", () => {
    const url = joinAnalyticsUpstreamUrl("https://u2.example", "path-2");
    expect(url).toContain("path-2");
  });
  it("joinAnalyticsUpstreamUrl matrix 3", () => {
    const url = joinAnalyticsUpstreamUrl("https://u3.example", "path-3");
    expect(url).toContain("path-3");
  });
  it("joinAnalyticsUpstreamUrl matrix 4", () => {
    const url = joinAnalyticsUpstreamUrl("https://u4.example", "path-4");
    expect(url).toContain("path-4");
  });
  it("joinAnalyticsUpstreamUrl matrix 5", () => {
    const url = joinAnalyticsUpstreamUrl("https://u5.example", "path-5");
    expect(url).toContain("path-5");
  });
  it("joinAnalyticsUpstreamUrl matrix 6", () => {
    const url = joinAnalyticsUpstreamUrl("https://u6.example", "path-6");
    expect(url).toContain("path-6");
  });
  it("joinAnalyticsUpstreamUrl matrix 7", () => {
    const url = joinAnalyticsUpstreamUrl("https://u7.example", "path-7");
    expect(url).toContain("path-7");
  });
  it("joinAnalyticsUpstreamUrl matrix 8", () => {
    const url = joinAnalyticsUpstreamUrl("https://u8.example", "path-8");
    expect(url).toContain("path-8");
  });
  it("joinAnalyticsUpstreamUrl matrix 9", () => {
    const url = joinAnalyticsUpstreamUrl("https://u9.example", "path-9");
    expect(url).toContain("path-9");
  });
  it("joinAnalyticsUpstreamUrl matrix 10", () => {
    const url = joinAnalyticsUpstreamUrl("https://u10.example", "path-10");
    expect(url).toContain("path-10");
  });
  it("joinAnalyticsUpstreamUrl matrix 11", () => {
    const url = joinAnalyticsUpstreamUrl("https://u11.example", "path-11");
    expect(url).toContain("path-11");
  });
  it("joinAnalyticsUpstreamUrl matrix 12", () => {
    const url = joinAnalyticsUpstreamUrl("https://u12.example", "path-12");
    expect(url).toContain("path-12");
  });
  it("joinAnalyticsUpstreamUrl matrix 13", () => {
    const url = joinAnalyticsUpstreamUrl("https://u13.example", "path-13");
    expect(url).toContain("path-13");
  });
  it("joinAnalyticsUpstreamUrl matrix 14", () => {
    const url = joinAnalyticsUpstreamUrl("https://u14.example", "path-14");
    expect(url).toContain("path-14");
  });
  it("joinAnalyticsUpstreamUrl matrix 15", () => {
    const url = joinAnalyticsUpstreamUrl("https://u15.example", "path-15");
    expect(url).toContain("path-15");
  });
  it("joinAnalyticsUpstreamUrl matrix 16", () => {
    const url = joinAnalyticsUpstreamUrl("https://u16.example", "path-16");
    expect(url).toContain("path-16");
  });
  it("joinAnalyticsUpstreamUrl matrix 17", () => {
    const url = joinAnalyticsUpstreamUrl("https://u17.example", "path-17");
    expect(url).toContain("path-17");
  });
  it("joinAnalyticsUpstreamUrl matrix 18", () => {
    const url = joinAnalyticsUpstreamUrl("https://u18.example", "path-18");
    expect(url).toContain("path-18");
  });
  it("joinAnalyticsUpstreamUrl matrix 19", () => {
    const url = joinAnalyticsUpstreamUrl("https://u19.example", "path-19");
    expect(url).toContain("path-19");
  });
  it("joinAnalyticsUpstreamUrl matrix 20", () => {
    const url = joinAnalyticsUpstreamUrl("https://u20.example", "path-20");
    expect(url).toContain("path-20");
  });
  it("joinAnalyticsUpstreamUrl matrix 21", () => {
    const url = joinAnalyticsUpstreamUrl("https://u21.example", "path-21");
    expect(url).toContain("path-21");
  });
  it("joinAnalyticsUpstreamUrl matrix 22", () => {
    const url = joinAnalyticsUpstreamUrl("https://u22.example", "path-22");
    expect(url).toContain("path-22");
  });
  it("joinAnalyticsUpstreamUrl matrix 23", () => {
    const url = joinAnalyticsUpstreamUrl("https://u23.example", "path-23");
    expect(url).toContain("path-23");
  });
  it("joinAnalyticsUpstreamUrl matrix 24", () => {
    const url = joinAnalyticsUpstreamUrl("https://u24.example", "path-24");
    expect(url).toContain("path-24");
  });
  it("joinAnalyticsUpstreamUrl matrix 25", () => {
    const url = joinAnalyticsUpstreamUrl("https://u25.example", "path-25");
    expect(url).toContain("path-25");
  });
  it("joinAnalyticsUpstreamUrl matrix 26", () => {
    const url = joinAnalyticsUpstreamUrl("https://u26.example", "path-26");
    expect(url).toContain("path-26");
  });
  it("joinAnalyticsUpstreamUrl matrix 27", () => {
    const url = joinAnalyticsUpstreamUrl("https://u27.example", "path-27");
    expect(url).toContain("path-27");
  });
  it("joinAnalyticsUpstreamUrl matrix 28", () => {
    const url = joinAnalyticsUpstreamUrl("https://u28.example", "path-28");
    expect(url).toContain("path-28");
  });
  it("joinAnalyticsUpstreamUrl matrix 29", () => {
    const url = joinAnalyticsUpstreamUrl("https://u29.example", "path-29");
    expect(url).toContain("path-29");
  });
  it("joinAnalyticsUpstreamUrl matrix 30", () => {
    const url = joinAnalyticsUpstreamUrl("https://u30.example", "path-30");
    expect(url).toContain("path-30");
  });
  it("joinAnalyticsUpstreamUrl matrix 31", () => {
    const url = joinAnalyticsUpstreamUrl("https://u31.example", "path-31");
    expect(url).toContain("path-31");
  });
  it("joinAnalyticsUpstreamUrl matrix 32", () => {
    const url = joinAnalyticsUpstreamUrl("https://u32.example", "path-32");
    expect(url).toContain("path-32");
  });
  it("joinAnalyticsUpstreamUrl matrix 33", () => {
    const url = joinAnalyticsUpstreamUrl("https://u33.example", "path-33");
    expect(url).toContain("path-33");
  });
  it("joinAnalyticsUpstreamUrl matrix 34", () => {
    const url = joinAnalyticsUpstreamUrl("https://u34.example", "path-34");
    expect(url).toContain("path-34");
  });
  it("joinAnalyticsUpstreamUrl matrix 35", () => {
    const url = joinAnalyticsUpstreamUrl("https://u35.example", "path-35");
    expect(url).toContain("path-35");
  });
  it("joinAnalyticsUpstreamUrl matrix 36", () => {
    const url = joinAnalyticsUpstreamUrl("https://u36.example", "path-36");
    expect(url).toContain("path-36");
  });
  it("joinAnalyticsUpstreamUrl matrix 37", () => {
    const url = joinAnalyticsUpstreamUrl("https://u37.example", "path-37");
    expect(url).toContain("path-37");
  });
  it("joinAnalyticsUpstreamUrl matrix 38", () => {
    const url = joinAnalyticsUpstreamUrl("https://u38.example", "path-38");
    expect(url).toContain("path-38");
  });
  it("joinAnalyticsUpstreamUrl matrix 39", () => {
    const url = joinAnalyticsUpstreamUrl("https://u39.example", "path-39");
    expect(url).toContain("path-39");
  });
  it("joinAnalyticsUpstreamUrl matrix 40", () => {
    const url = joinAnalyticsUpstreamUrl("https://u40.example", "path-40");
    expect(url).toContain("path-40");
  });
  it("joinAnalyticsUpstreamUrl matrix 41", () => {
    const url = joinAnalyticsUpstreamUrl("https://u41.example", "path-41");
    expect(url).toContain("path-41");
  });
  it("joinAnalyticsUpstreamUrl matrix 42", () => {
    const url = joinAnalyticsUpstreamUrl("https://u42.example", "path-42");
    expect(url).toContain("path-42");
  });
  it("joinAnalyticsUpstreamUrl matrix 43", () => {
    const url = joinAnalyticsUpstreamUrl("https://u43.example", "path-43");
    expect(url).toContain("path-43");
  });
  it("joinAnalyticsUpstreamUrl matrix 44", () => {
    const url = joinAnalyticsUpstreamUrl("https://u44.example", "path-44");
    expect(url).toContain("path-44");
  });
  it("joinAnalyticsUpstreamUrl matrix 45", () => {
    const url = joinAnalyticsUpstreamUrl("https://u45.example", "path-45");
    expect(url).toContain("path-45");
  });
  it("joinAnalyticsUpstreamUrl matrix 46", () => {
    const url = joinAnalyticsUpstreamUrl("https://u46.example", "path-46");
    expect(url).toContain("path-46");
  });
  it("joinAnalyticsUpstreamUrl matrix 47", () => {
    const url = joinAnalyticsUpstreamUrl("https://u47.example", "path-47");
    expect(url).toContain("path-47");
  });
  it("joinAnalyticsUpstreamUrl matrix 48", () => {
    const url = joinAnalyticsUpstreamUrl("https://u48.example", "path-48");
    expect(url).toContain("path-48");
  });
  it("joinAnalyticsUpstreamUrl matrix 49", () => {
    const url = joinAnalyticsUpstreamUrl("https://u49.example", "path-49");
    expect(url).toContain("path-49");
  });
});

describe("analytics-proxy-lib scrubSensitiveUrlSearch", () => {
  it("redacts token query param", () => {
    const scrubbed = scrubSensitiveUrlSearch(
      "https://heyclau.de/brief/approve?token=abc",
    );
    expect(String(scrubbed)).toMatch(/redacted/i);
  });
  it("scrubSensitiveUrlSearch matrix 0", () => {
    const scrubbed = scrubSensitiveUrlSearch("/page?token=value-0");
    expect(String(scrubbed)).toMatch(/redacted/i);
  });
  it("scrubSensitiveUrlSearch matrix 1", () => {
    const scrubbed = scrubSensitiveUrlSearch("/page?token=value-1");
    expect(String(scrubbed)).toMatch(/redacted/i);
  });
  it("scrubSensitiveUrlSearch matrix 2", () => {
    const scrubbed = scrubSensitiveUrlSearch("/page?token=value-2");
    expect(String(scrubbed)).toMatch(/redacted/i);
  });
  it("scrubSensitiveUrlSearch matrix 3", () => {
    const scrubbed = scrubSensitiveUrlSearch("/page?token=value-3");
    expect(String(scrubbed)).toMatch(/redacted/i);
  });
  it("scrubSensitiveUrlSearch matrix 4", () => {
    const scrubbed = scrubSensitiveUrlSearch("/page?token=value-4");
    expect(String(scrubbed)).toMatch(/redacted/i);
  });
  it("scrubSensitiveUrlSearch matrix 5", () => {
    const scrubbed = scrubSensitiveUrlSearch("/page?token=value-5");
    expect(String(scrubbed)).toMatch(/redacted/i);
  });
  it("scrubSensitiveUrlSearch matrix 6", () => {
    const scrubbed = scrubSensitiveUrlSearch("/page?token=value-6");
    expect(String(scrubbed)).toMatch(/redacted/i);
  });
  it("scrubSensitiveUrlSearch matrix 7", () => {
    const scrubbed = scrubSensitiveUrlSearch("/page?token=value-7");
    expect(String(scrubbed)).toMatch(/redacted/i);
  });
  it("scrubSensitiveUrlSearch matrix 8", () => {
    const scrubbed = scrubSensitiveUrlSearch("/page?token=value-8");
    expect(String(scrubbed)).toMatch(/redacted/i);
  });
  it("scrubSensitiveUrlSearch matrix 9", () => {
    const scrubbed = scrubSensitiveUrlSearch("/page?token=value-9");
    expect(String(scrubbed)).toMatch(/redacted/i);
  });
  it("scrubSensitiveUrlSearch matrix 10", () => {
    const scrubbed = scrubSensitiveUrlSearch("/page?token=value-10");
    expect(String(scrubbed)).toMatch(/redacted/i);
  });
  it("scrubSensitiveUrlSearch matrix 11", () => {
    const scrubbed = scrubSensitiveUrlSearch("/page?token=value-11");
    expect(String(scrubbed)).toMatch(/redacted/i);
  });
  it("scrubSensitiveUrlSearch matrix 12", () => {
    const scrubbed = scrubSensitiveUrlSearch("/page?token=value-12");
    expect(String(scrubbed)).toMatch(/redacted/i);
  });
  it("scrubSensitiveUrlSearch matrix 13", () => {
    const scrubbed = scrubSensitiveUrlSearch("/page?token=value-13");
    expect(String(scrubbed)).toMatch(/redacted/i);
  });
  it("scrubSensitiveUrlSearch matrix 14", () => {
    const scrubbed = scrubSensitiveUrlSearch("/page?token=value-14");
    expect(String(scrubbed)).toMatch(/redacted/i);
  });
  it("scrubSensitiveUrlSearch matrix 15", () => {
    const scrubbed = scrubSensitiveUrlSearch("/page?token=value-15");
    expect(String(scrubbed)).toMatch(/redacted/i);
  });
  it("scrubSensitiveUrlSearch matrix 16", () => {
    const scrubbed = scrubSensitiveUrlSearch("/page?token=value-16");
    expect(String(scrubbed)).toMatch(/redacted/i);
  });
  it("scrubSensitiveUrlSearch matrix 17", () => {
    const scrubbed = scrubSensitiveUrlSearch("/page?token=value-17");
    expect(String(scrubbed)).toMatch(/redacted/i);
  });
  it("scrubSensitiveUrlSearch matrix 18", () => {
    const scrubbed = scrubSensitiveUrlSearch("/page?token=value-18");
    expect(String(scrubbed)).toMatch(/redacted/i);
  });
  it("scrubSensitiveUrlSearch matrix 19", () => {
    const scrubbed = scrubSensitiveUrlSearch("/page?token=value-19");
    expect(String(scrubbed)).toMatch(/redacted/i);
  });
  it("scrubSensitiveUrlSearch matrix 20", () => {
    const scrubbed = scrubSensitiveUrlSearch("/page?token=value-20");
    expect(String(scrubbed)).toMatch(/redacted/i);
  });
  it("scrubSensitiveUrlSearch matrix 21", () => {
    const scrubbed = scrubSensitiveUrlSearch("/page?token=value-21");
    expect(String(scrubbed)).toMatch(/redacted/i);
  });
  it("scrubSensitiveUrlSearch matrix 22", () => {
    const scrubbed = scrubSensitiveUrlSearch("/page?token=value-22");
    expect(String(scrubbed)).toMatch(/redacted/i);
  });
  it("scrubSensitiveUrlSearch matrix 23", () => {
    const scrubbed = scrubSensitiveUrlSearch("/page?token=value-23");
    expect(String(scrubbed)).toMatch(/redacted/i);
  });
  it("scrubSensitiveUrlSearch matrix 24", () => {
    const scrubbed = scrubSensitiveUrlSearch("/page?token=value-24");
    expect(String(scrubbed)).toMatch(/redacted/i);
  });
  it("scrubSensitiveUrlSearch matrix 25", () => {
    const scrubbed = scrubSensitiveUrlSearch("/page?token=value-25");
    expect(String(scrubbed)).toMatch(/redacted/i);
  });
  it("scrubSensitiveUrlSearch matrix 26", () => {
    const scrubbed = scrubSensitiveUrlSearch("/page?token=value-26");
    expect(String(scrubbed)).toMatch(/redacted/i);
  });
  it("scrubSensitiveUrlSearch matrix 27", () => {
    const scrubbed = scrubSensitiveUrlSearch("/page?token=value-27");
    expect(String(scrubbed)).toMatch(/redacted/i);
  });
  it("scrubSensitiveUrlSearch matrix 28", () => {
    const scrubbed = scrubSensitiveUrlSearch("/page?token=value-28");
    expect(String(scrubbed)).toMatch(/redacted/i);
  });
  it("scrubSensitiveUrlSearch matrix 29", () => {
    const scrubbed = scrubSensitiveUrlSearch("/page?token=value-29");
    expect(String(scrubbed)).toMatch(/redacted/i);
  });
  it("scrubSensitiveUrlSearch matrix 30", () => {
    const scrubbed = scrubSensitiveUrlSearch("/page?token=value-30");
    expect(String(scrubbed)).toMatch(/redacted/i);
  });
  it("scrubSensitiveUrlSearch matrix 31", () => {
    const scrubbed = scrubSensitiveUrlSearch("/page?token=value-31");
    expect(String(scrubbed)).toMatch(/redacted/i);
  });
  it("scrubSensitiveUrlSearch matrix 32", () => {
    const scrubbed = scrubSensitiveUrlSearch("/page?token=value-32");
    expect(String(scrubbed)).toMatch(/redacted/i);
  });
  it("scrubSensitiveUrlSearch matrix 33", () => {
    const scrubbed = scrubSensitiveUrlSearch("/page?token=value-33");
    expect(String(scrubbed)).toMatch(/redacted/i);
  });
  it("scrubSensitiveUrlSearch matrix 34", () => {
    const scrubbed = scrubSensitiveUrlSearch("/page?token=value-34");
    expect(String(scrubbed)).toMatch(/redacted/i);
  });
  it("scrubSensitiveUrlSearch matrix 35", () => {
    const scrubbed = scrubSensitiveUrlSearch("/page?token=value-35");
    expect(String(scrubbed)).toMatch(/redacted/i);
  });
  it("scrubSensitiveUrlSearch matrix 36", () => {
    const scrubbed = scrubSensitiveUrlSearch("/page?token=value-36");
    expect(String(scrubbed)).toMatch(/redacted/i);
  });
  it("scrubSensitiveUrlSearch matrix 37", () => {
    const scrubbed = scrubSensitiveUrlSearch("/page?token=value-37");
    expect(String(scrubbed)).toMatch(/redacted/i);
  });
  it("scrubSensitiveUrlSearch matrix 38", () => {
    const scrubbed = scrubSensitiveUrlSearch("/page?token=value-38");
    expect(String(scrubbed)).toMatch(/redacted/i);
  });
  it("scrubSensitiveUrlSearch matrix 39", () => {
    const scrubbed = scrubSensitiveUrlSearch("/page?token=value-39");
    expect(String(scrubbed)).toMatch(/redacted/i);
  });
  it("scrubSensitiveUrlSearch matrix 40", () => {
    const scrubbed = scrubSensitiveUrlSearch("/page?token=value-40");
    expect(String(scrubbed)).toMatch(/redacted/i);
  });
  it("scrubSensitiveUrlSearch matrix 41", () => {
    const scrubbed = scrubSensitiveUrlSearch("/page?token=value-41");
    expect(String(scrubbed)).toMatch(/redacted/i);
  });
  it("scrubSensitiveUrlSearch matrix 42", () => {
    const scrubbed = scrubSensitiveUrlSearch("/page?token=value-42");
    expect(String(scrubbed)).toMatch(/redacted/i);
  });
  it("scrubSensitiveUrlSearch matrix 43", () => {
    const scrubbed = scrubSensitiveUrlSearch("/page?token=value-43");
    expect(String(scrubbed)).toMatch(/redacted/i);
  });
  it("scrubSensitiveUrlSearch matrix 44", () => {
    const scrubbed = scrubSensitiveUrlSearch("/page?token=value-44");
    expect(String(scrubbed)).toMatch(/redacted/i);
  });
  it("scrubSensitiveUrlSearch matrix 45", () => {
    const scrubbed = scrubSensitiveUrlSearch("/page?token=value-45");
    expect(String(scrubbed)).toMatch(/redacted/i);
  });
  it("scrubSensitiveUrlSearch matrix 46", () => {
    const scrubbed = scrubSensitiveUrlSearch("/page?token=value-46");
    expect(String(scrubbed)).toMatch(/redacted/i);
  });
  it("scrubSensitiveUrlSearch matrix 47", () => {
    const scrubbed = scrubSensitiveUrlSearch("/page?token=value-47");
    expect(String(scrubbed)).toMatch(/redacted/i);
  });
  it("scrubSensitiveUrlSearch matrix 48", () => {
    const scrubbed = scrubSensitiveUrlSearch("/page?token=value-48");
    expect(String(scrubbed)).toMatch(/redacted/i);
  });
  it("scrubSensitiveUrlSearch matrix 49", () => {
    const scrubbed = scrubSensitiveUrlSearch("/page?token=value-49");
    expect(String(scrubbed)).toMatch(/redacted/i);
  });
});

describe("analytics-proxy-lib sensitiveSearchParamsForPath", () => {
  it("sensitiveSearchParamsForPath matrix 0", () => {
    const params = sensitiveSearchParamsForPath("/brief/approve");
    expect(params.has("token")).toBe(true);
  });
  it("sensitiveSearchParamsForPath matrix 1", () => {
    const params = sensitiveSearchParamsForPath("/brief/approve");
    expect(params.has("token")).toBe(true);
  });
  it("sensitiveSearchParamsForPath matrix 2", () => {
    const params = sensitiveSearchParamsForPath("/brief/approve");
    expect(params.has("token")).toBe(true);
  });
  it("sensitiveSearchParamsForPath matrix 3", () => {
    const params = sensitiveSearchParamsForPath("/brief/approve");
    expect(params.has("token")).toBe(true);
  });
  it("sensitiveSearchParamsForPath matrix 4", () => {
    const params = sensitiveSearchParamsForPath("/brief/approve");
    expect(params.has("token")).toBe(true);
  });
  it("sensitiveSearchParamsForPath matrix 5", () => {
    const params = sensitiveSearchParamsForPath("/brief/approve");
    expect(params.has("token")).toBe(true);
  });
  it("sensitiveSearchParamsForPath matrix 6", () => {
    const params = sensitiveSearchParamsForPath("/brief/approve");
    expect(params.has("token")).toBe(true);
  });
  it("sensitiveSearchParamsForPath matrix 7", () => {
    const params = sensitiveSearchParamsForPath("/brief/approve");
    expect(params.has("token")).toBe(true);
  });
  it("sensitiveSearchParamsForPath matrix 8", () => {
    const params = sensitiveSearchParamsForPath("/brief/approve");
    expect(params.has("token")).toBe(true);
  });
  it("sensitiveSearchParamsForPath matrix 9", () => {
    const params = sensitiveSearchParamsForPath("/brief/approve");
    expect(params.has("token")).toBe(true);
  });
  it("sensitiveSearchParamsForPath matrix 10", () => {
    const params = sensitiveSearchParamsForPath("/brief/approve");
    expect(params.has("token")).toBe(true);
  });
  it("sensitiveSearchParamsForPath matrix 11", () => {
    const params = sensitiveSearchParamsForPath("/brief/approve");
    expect(params.has("token")).toBe(true);
  });
  it("sensitiveSearchParamsForPath matrix 12", () => {
    const params = sensitiveSearchParamsForPath("/brief/approve");
    expect(params.has("token")).toBe(true);
  });
  it("sensitiveSearchParamsForPath matrix 13", () => {
    const params = sensitiveSearchParamsForPath("/brief/approve");
    expect(params.has("token")).toBe(true);
  });
  it("sensitiveSearchParamsForPath matrix 14", () => {
    const params = sensitiveSearchParamsForPath("/brief/approve");
    expect(params.has("token")).toBe(true);
  });
  it("sensitiveSearchParamsForPath matrix 15", () => {
    const params = sensitiveSearchParamsForPath("/brief/approve");
    expect(params.has("token")).toBe(true);
  });
  it("sensitiveSearchParamsForPath matrix 16", () => {
    const params = sensitiveSearchParamsForPath("/brief/approve");
    expect(params.has("token")).toBe(true);
  });
  it("sensitiveSearchParamsForPath matrix 17", () => {
    const params = sensitiveSearchParamsForPath("/brief/approve");
    expect(params.has("token")).toBe(true);
  });
  it("sensitiveSearchParamsForPath matrix 18", () => {
    const params = sensitiveSearchParamsForPath("/brief/approve");
    expect(params.has("token")).toBe(true);
  });
  it("sensitiveSearchParamsForPath matrix 19", () => {
    const params = sensitiveSearchParamsForPath("/brief/approve");
    expect(params.has("token")).toBe(true);
  });
  it("sensitiveSearchParamsForPath matrix 20", () => {
    const params = sensitiveSearchParamsForPath("/brief/approve");
    expect(params.has("token")).toBe(true);
  });
  it("sensitiveSearchParamsForPath matrix 21", () => {
    const params = sensitiveSearchParamsForPath("/brief/approve");
    expect(params.has("token")).toBe(true);
  });
  it("sensitiveSearchParamsForPath matrix 22", () => {
    const params = sensitiveSearchParamsForPath("/brief/approve");
    expect(params.has("token")).toBe(true);
  });
  it("sensitiveSearchParamsForPath matrix 23", () => {
    const params = sensitiveSearchParamsForPath("/brief/approve");
    expect(params.has("token")).toBe(true);
  });
  it("sensitiveSearchParamsForPath matrix 24", () => {
    const params = sensitiveSearchParamsForPath("/brief/approve");
    expect(params.has("token")).toBe(true);
  });
  it("sensitiveSearchParamsForPath matrix 25", () => {
    const params = sensitiveSearchParamsForPath("/brief/approve");
    expect(params.has("token")).toBe(true);
  });
  it("sensitiveSearchParamsForPath matrix 26", () => {
    const params = sensitiveSearchParamsForPath("/brief/approve");
    expect(params.has("token")).toBe(true);
  });
  it("sensitiveSearchParamsForPath matrix 27", () => {
    const params = sensitiveSearchParamsForPath("/brief/approve");
    expect(params.has("token")).toBe(true);
  });
  it("sensitiveSearchParamsForPath matrix 28", () => {
    const params = sensitiveSearchParamsForPath("/brief/approve");
    expect(params.has("token")).toBe(true);
  });
  it("sensitiveSearchParamsForPath matrix 29", () => {
    const params = sensitiveSearchParamsForPath("/brief/approve");
    expect(params.has("token")).toBe(true);
  });
});
