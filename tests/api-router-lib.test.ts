import { describe, expect, it, vi } from "vitest";
import { ZodError, z } from "zod";

import { getApiRouteDefinition } from "../apps/web/src/lib/api/contracts";
import {
  apiError,
  apiJson,
  enforceApiRateLimit,
  errorMessage,
  getApiRequestId,
  getQueryObject,
  getRequestId,
  normalizeZodIssues,
  parseRequest,
  withApiHeaders,
} from "../apps/web/src/lib/api/router-lib";

describe("router-lib getRequestId", () => {
  it("getRequestId matrix 0", () => {
    const request = new Request("https://example.com/api?q=0", {
      headers: { "x-request-id": "req-0" },
    });
    expect(getRequestId(request)).toBe("req-0");
  });
  it("getApiRequestId matrix 0", () => {
    const request = new Request("https://example.com/api?q=0", {
      headers: { "cf-ray": "ray-0" },
    });
    expect(getApiRequestId(request)).toBe("ray-0");
  });
  it("getRequestId matrix 1", () => {
    const request = new Request("https://example.com/api?q=1", {
      headers: { "x-request-id": "req-1" },
    });
    expect(getRequestId(request)).toBe("req-1");
  });
  it("getApiRequestId matrix 1", () => {
    const request = new Request("https://example.com/api?q=1", {
      headers: { "cf-ray": "ray-1" },
    });
    expect(getApiRequestId(request)).toBe("ray-1");
  });
  it("getRequestId matrix 2", () => {
    const request = new Request("https://example.com/api?q=2", {
      headers: { "x-request-id": "req-2" },
    });
    expect(getRequestId(request)).toBe("req-2");
  });
  it("getApiRequestId matrix 2", () => {
    const request = new Request("https://example.com/api?q=2", {
      headers: { "cf-ray": "ray-2" },
    });
    expect(getApiRequestId(request)).toBe("ray-2");
  });
  it("getRequestId matrix 3", () => {
    const request = new Request("https://example.com/api?q=3", {
      headers: { "x-request-id": "req-3" },
    });
    expect(getRequestId(request)).toBe("req-3");
  });
  it("getApiRequestId matrix 3", () => {
    const request = new Request("https://example.com/api?q=3", {
      headers: { "cf-ray": "ray-3" },
    });
    expect(getApiRequestId(request)).toBe("ray-3");
  });
  it("getRequestId matrix 4", () => {
    const request = new Request("https://example.com/api?q=4", {
      headers: { "x-request-id": "req-4" },
    });
    expect(getRequestId(request)).toBe("req-4");
  });
  it("getApiRequestId matrix 4", () => {
    const request = new Request("https://example.com/api?q=4", {
      headers: { "cf-ray": "ray-4" },
    });
    expect(getApiRequestId(request)).toBe("ray-4");
  });
  it("getRequestId matrix 5", () => {
    const request = new Request("https://example.com/api?q=5", {
      headers: { "x-request-id": "req-5" },
    });
    expect(getRequestId(request)).toBe("req-5");
  });
  it("getApiRequestId matrix 5", () => {
    const request = new Request("https://example.com/api?q=5", {
      headers: { "cf-ray": "ray-5" },
    });
    expect(getApiRequestId(request)).toBe("ray-5");
  });
  it("getRequestId matrix 6", () => {
    const request = new Request("https://example.com/api?q=6", {
      headers: { "x-request-id": "req-6" },
    });
    expect(getRequestId(request)).toBe("req-6");
  });
  it("getApiRequestId matrix 6", () => {
    const request = new Request("https://example.com/api?q=6", {
      headers: { "cf-ray": "ray-6" },
    });
    expect(getApiRequestId(request)).toBe("ray-6");
  });
  it("getRequestId matrix 7", () => {
    const request = new Request("https://example.com/api?q=7", {
      headers: { "x-request-id": "req-7" },
    });
    expect(getRequestId(request)).toBe("req-7");
  });
  it("getApiRequestId matrix 7", () => {
    const request = new Request("https://example.com/api?q=7", {
      headers: { "cf-ray": "ray-7" },
    });
    expect(getApiRequestId(request)).toBe("ray-7");
  });
  it("getRequestId matrix 8", () => {
    const request = new Request("https://example.com/api?q=8", {
      headers: { "x-request-id": "req-8" },
    });
    expect(getRequestId(request)).toBe("req-8");
  });
  it("getApiRequestId matrix 8", () => {
    const request = new Request("https://example.com/api?q=8", {
      headers: { "cf-ray": "ray-8" },
    });
    expect(getApiRequestId(request)).toBe("ray-8");
  });
  it("getRequestId matrix 9", () => {
    const request = new Request("https://example.com/api?q=9", {
      headers: { "x-request-id": "req-9" },
    });
    expect(getRequestId(request)).toBe("req-9");
  });
  it("getApiRequestId matrix 9", () => {
    const request = new Request("https://example.com/api?q=9", {
      headers: { "cf-ray": "ray-9" },
    });
    expect(getApiRequestId(request)).toBe("ray-9");
  });
  it("getRequestId matrix 10", () => {
    const request = new Request("https://example.com/api?q=10", {
      headers: { "x-request-id": "req-10" },
    });
    expect(getRequestId(request)).toBe("req-10");
  });
  it("getApiRequestId matrix 10", () => {
    const request = new Request("https://example.com/api?q=10", {
      headers: { "cf-ray": "ray-10" },
    });
    expect(getApiRequestId(request)).toBe("ray-10");
  });
  it("getRequestId matrix 11", () => {
    const request = new Request("https://example.com/api?q=11", {
      headers: { "x-request-id": "req-11" },
    });
    expect(getRequestId(request)).toBe("req-11");
  });
  it("getApiRequestId matrix 11", () => {
    const request = new Request("https://example.com/api?q=11", {
      headers: { "cf-ray": "ray-11" },
    });
    expect(getApiRequestId(request)).toBe("ray-11");
  });
  it("getRequestId matrix 12", () => {
    const request = new Request("https://example.com/api?q=12", {
      headers: { "x-request-id": "req-12" },
    });
    expect(getRequestId(request)).toBe("req-12");
  });
  it("getApiRequestId matrix 12", () => {
    const request = new Request("https://example.com/api?q=12", {
      headers: { "cf-ray": "ray-12" },
    });
    expect(getApiRequestId(request)).toBe("ray-12");
  });
  it("getRequestId matrix 13", () => {
    const request = new Request("https://example.com/api?q=13", {
      headers: { "x-request-id": "req-13" },
    });
    expect(getRequestId(request)).toBe("req-13");
  });
  it("getApiRequestId matrix 13", () => {
    const request = new Request("https://example.com/api?q=13", {
      headers: { "cf-ray": "ray-13" },
    });
    expect(getApiRequestId(request)).toBe("ray-13");
  });
  it("getRequestId matrix 14", () => {
    const request = new Request("https://example.com/api?q=14", {
      headers: { "x-request-id": "req-14" },
    });
    expect(getRequestId(request)).toBe("req-14");
  });
  it("getApiRequestId matrix 14", () => {
    const request = new Request("https://example.com/api?q=14", {
      headers: { "cf-ray": "ray-14" },
    });
    expect(getApiRequestId(request)).toBe("ray-14");
  });
  it("getRequestId matrix 15", () => {
    const request = new Request("https://example.com/api?q=15", {
      headers: { "x-request-id": "req-15" },
    });
    expect(getRequestId(request)).toBe("req-15");
  });
  it("getApiRequestId matrix 15", () => {
    const request = new Request("https://example.com/api?q=15", {
      headers: { "cf-ray": "ray-15" },
    });
    expect(getApiRequestId(request)).toBe("ray-15");
  });
  it("getRequestId matrix 16", () => {
    const request = new Request("https://example.com/api?q=16", {
      headers: { "x-request-id": "req-16" },
    });
    expect(getRequestId(request)).toBe("req-16");
  });
  it("getApiRequestId matrix 16", () => {
    const request = new Request("https://example.com/api?q=16", {
      headers: { "cf-ray": "ray-16" },
    });
    expect(getApiRequestId(request)).toBe("ray-16");
  });
  it("getRequestId matrix 17", () => {
    const request = new Request("https://example.com/api?q=17", {
      headers: { "x-request-id": "req-17" },
    });
    expect(getRequestId(request)).toBe("req-17");
  });
  it("getApiRequestId matrix 17", () => {
    const request = new Request("https://example.com/api?q=17", {
      headers: { "cf-ray": "ray-17" },
    });
    expect(getApiRequestId(request)).toBe("ray-17");
  });
  it("getRequestId matrix 18", () => {
    const request = new Request("https://example.com/api?q=18", {
      headers: { "x-request-id": "req-18" },
    });
    expect(getRequestId(request)).toBe("req-18");
  });
  it("getApiRequestId matrix 18", () => {
    const request = new Request("https://example.com/api?q=18", {
      headers: { "cf-ray": "ray-18" },
    });
    expect(getApiRequestId(request)).toBe("ray-18");
  });
  it("getRequestId matrix 19", () => {
    const request = new Request("https://example.com/api?q=19", {
      headers: { "x-request-id": "req-19" },
    });
    expect(getRequestId(request)).toBe("req-19");
  });
  it("getApiRequestId matrix 19", () => {
    const request = new Request("https://example.com/api?q=19", {
      headers: { "cf-ray": "ray-19" },
    });
    expect(getApiRequestId(request)).toBe("ray-19");
  });
  it("getRequestId matrix 20", () => {
    const request = new Request("https://example.com/api?q=20", {
      headers: { "x-request-id": "req-20" },
    });
    expect(getRequestId(request)).toBe("req-20");
  });
  it("getApiRequestId matrix 20", () => {
    const request = new Request("https://example.com/api?q=20", {
      headers: { "cf-ray": "ray-20" },
    });
    expect(getApiRequestId(request)).toBe("ray-20");
  });
  it("getRequestId matrix 21", () => {
    const request = new Request("https://example.com/api?q=21", {
      headers: { "x-request-id": "req-21" },
    });
    expect(getRequestId(request)).toBe("req-21");
  });
  it("getApiRequestId matrix 21", () => {
    const request = new Request("https://example.com/api?q=21", {
      headers: { "cf-ray": "ray-21" },
    });
    expect(getApiRequestId(request)).toBe("ray-21");
  });
  it("getRequestId matrix 22", () => {
    const request = new Request("https://example.com/api?q=22", {
      headers: { "x-request-id": "req-22" },
    });
    expect(getRequestId(request)).toBe("req-22");
  });
  it("getApiRequestId matrix 22", () => {
    const request = new Request("https://example.com/api?q=22", {
      headers: { "cf-ray": "ray-22" },
    });
    expect(getApiRequestId(request)).toBe("ray-22");
  });
  it("getRequestId matrix 23", () => {
    const request = new Request("https://example.com/api?q=23", {
      headers: { "x-request-id": "req-23" },
    });
    expect(getRequestId(request)).toBe("req-23");
  });
  it("getApiRequestId matrix 23", () => {
    const request = new Request("https://example.com/api?q=23", {
      headers: { "cf-ray": "ray-23" },
    });
    expect(getApiRequestId(request)).toBe("ray-23");
  });
  it("getRequestId matrix 24", () => {
    const request = new Request("https://example.com/api?q=24", {
      headers: { "x-request-id": "req-24" },
    });
    expect(getRequestId(request)).toBe("req-24");
  });
  it("getApiRequestId matrix 24", () => {
    const request = new Request("https://example.com/api?q=24", {
      headers: { "cf-ray": "ray-24" },
    });
    expect(getApiRequestId(request)).toBe("ray-24");
  });
  it("getRequestId matrix 25", () => {
    const request = new Request("https://example.com/api?q=25", {
      headers: { "x-request-id": "req-25" },
    });
    expect(getRequestId(request)).toBe("req-25");
  });
  it("getApiRequestId matrix 25", () => {
    const request = new Request("https://example.com/api?q=25", {
      headers: { "cf-ray": "ray-25" },
    });
    expect(getApiRequestId(request)).toBe("ray-25");
  });
  it("getRequestId matrix 26", () => {
    const request = new Request("https://example.com/api?q=26", {
      headers: { "x-request-id": "req-26" },
    });
    expect(getRequestId(request)).toBe("req-26");
  });
  it("getApiRequestId matrix 26", () => {
    const request = new Request("https://example.com/api?q=26", {
      headers: { "cf-ray": "ray-26" },
    });
    expect(getApiRequestId(request)).toBe("ray-26");
  });
  it("getRequestId matrix 27", () => {
    const request = new Request("https://example.com/api?q=27", {
      headers: { "x-request-id": "req-27" },
    });
    expect(getRequestId(request)).toBe("req-27");
  });
  it("getApiRequestId matrix 27", () => {
    const request = new Request("https://example.com/api?q=27", {
      headers: { "cf-ray": "ray-27" },
    });
    expect(getApiRequestId(request)).toBe("ray-27");
  });
  it("getRequestId matrix 28", () => {
    const request = new Request("https://example.com/api?q=28", {
      headers: { "x-request-id": "req-28" },
    });
    expect(getRequestId(request)).toBe("req-28");
  });
  it("getApiRequestId matrix 28", () => {
    const request = new Request("https://example.com/api?q=28", {
      headers: { "cf-ray": "ray-28" },
    });
    expect(getApiRequestId(request)).toBe("ray-28");
  });
  it("getRequestId matrix 29", () => {
    const request = new Request("https://example.com/api?q=29", {
      headers: { "x-request-id": "req-29" },
    });
    expect(getRequestId(request)).toBe("req-29");
  });
  it("getApiRequestId matrix 29", () => {
    const request = new Request("https://example.com/api?q=29", {
      headers: { "cf-ray": "ray-29" },
    });
    expect(getApiRequestId(request)).toBe("ray-29");
  });
  it("getRequestId matrix 30", () => {
    const request = new Request("https://example.com/api?q=30", {
      headers: { "x-request-id": "req-30" },
    });
    expect(getRequestId(request)).toBe("req-30");
  });
  it("getApiRequestId matrix 30", () => {
    const request = new Request("https://example.com/api?q=30", {
      headers: { "cf-ray": "ray-30" },
    });
    expect(getApiRequestId(request)).toBe("ray-30");
  });
  it("getRequestId matrix 31", () => {
    const request = new Request("https://example.com/api?q=31", {
      headers: { "x-request-id": "req-31" },
    });
    expect(getRequestId(request)).toBe("req-31");
  });
  it("getApiRequestId matrix 31", () => {
    const request = new Request("https://example.com/api?q=31", {
      headers: { "cf-ray": "ray-31" },
    });
    expect(getApiRequestId(request)).toBe("ray-31");
  });
  it("getRequestId matrix 32", () => {
    const request = new Request("https://example.com/api?q=32", {
      headers: { "x-request-id": "req-32" },
    });
    expect(getRequestId(request)).toBe("req-32");
  });
  it("getApiRequestId matrix 32", () => {
    const request = new Request("https://example.com/api?q=32", {
      headers: { "cf-ray": "ray-32" },
    });
    expect(getApiRequestId(request)).toBe("ray-32");
  });
  it("getRequestId matrix 33", () => {
    const request = new Request("https://example.com/api?q=33", {
      headers: { "x-request-id": "req-33" },
    });
    expect(getRequestId(request)).toBe("req-33");
  });
  it("getApiRequestId matrix 33", () => {
    const request = new Request("https://example.com/api?q=33", {
      headers: { "cf-ray": "ray-33" },
    });
    expect(getApiRequestId(request)).toBe("ray-33");
  });
  it("getRequestId matrix 34", () => {
    const request = new Request("https://example.com/api?q=34", {
      headers: { "x-request-id": "req-34" },
    });
    expect(getRequestId(request)).toBe("req-34");
  });
  it("getApiRequestId matrix 34", () => {
    const request = new Request("https://example.com/api?q=34", {
      headers: { "cf-ray": "ray-34" },
    });
    expect(getApiRequestId(request)).toBe("ray-34");
  });
  it("getRequestId matrix 35", () => {
    const request = new Request("https://example.com/api?q=35", {
      headers: { "x-request-id": "req-35" },
    });
    expect(getRequestId(request)).toBe("req-35");
  });
  it("getApiRequestId matrix 35", () => {
    const request = new Request("https://example.com/api?q=35", {
      headers: { "cf-ray": "ray-35" },
    });
    expect(getApiRequestId(request)).toBe("ray-35");
  });
  it("getRequestId matrix 36", () => {
    const request = new Request("https://example.com/api?q=36", {
      headers: { "x-request-id": "req-36" },
    });
    expect(getRequestId(request)).toBe("req-36");
  });
  it("getApiRequestId matrix 36", () => {
    const request = new Request("https://example.com/api?q=36", {
      headers: { "cf-ray": "ray-36" },
    });
    expect(getApiRequestId(request)).toBe("ray-36");
  });
  it("getRequestId matrix 37", () => {
    const request = new Request("https://example.com/api?q=37", {
      headers: { "x-request-id": "req-37" },
    });
    expect(getRequestId(request)).toBe("req-37");
  });
  it("getApiRequestId matrix 37", () => {
    const request = new Request("https://example.com/api?q=37", {
      headers: { "cf-ray": "ray-37" },
    });
    expect(getApiRequestId(request)).toBe("ray-37");
  });
  it("getRequestId matrix 38", () => {
    const request = new Request("https://example.com/api?q=38", {
      headers: { "x-request-id": "req-38" },
    });
    expect(getRequestId(request)).toBe("req-38");
  });
  it("getApiRequestId matrix 38", () => {
    const request = new Request("https://example.com/api?q=38", {
      headers: { "cf-ray": "ray-38" },
    });
    expect(getApiRequestId(request)).toBe("ray-38");
  });
  it("getRequestId matrix 39", () => {
    const request = new Request("https://example.com/api?q=39", {
      headers: { "x-request-id": "req-39" },
    });
    expect(getRequestId(request)).toBe("req-39");
  });
  it("getApiRequestId matrix 39", () => {
    const request = new Request("https://example.com/api?q=39", {
      headers: { "cf-ray": "ray-39" },
    });
    expect(getApiRequestId(request)).toBe("ray-39");
  });
  it("getRequestId matrix 40", () => {
    const request = new Request("https://example.com/api?q=40", {
      headers: { "x-request-id": "req-40" },
    });
    expect(getRequestId(request)).toBe("req-40");
  });
  it("getApiRequestId matrix 40", () => {
    const request = new Request("https://example.com/api?q=40", {
      headers: { "cf-ray": "ray-40" },
    });
    expect(getApiRequestId(request)).toBe("ray-40");
  });
  it("getRequestId matrix 41", () => {
    const request = new Request("https://example.com/api?q=41", {
      headers: { "x-request-id": "req-41" },
    });
    expect(getRequestId(request)).toBe("req-41");
  });
  it("getApiRequestId matrix 41", () => {
    const request = new Request("https://example.com/api?q=41", {
      headers: { "cf-ray": "ray-41" },
    });
    expect(getApiRequestId(request)).toBe("ray-41");
  });
  it("getRequestId matrix 42", () => {
    const request = new Request("https://example.com/api?q=42", {
      headers: { "x-request-id": "req-42" },
    });
    expect(getRequestId(request)).toBe("req-42");
  });
  it("getApiRequestId matrix 42", () => {
    const request = new Request("https://example.com/api?q=42", {
      headers: { "cf-ray": "ray-42" },
    });
    expect(getApiRequestId(request)).toBe("ray-42");
  });
  it("getRequestId matrix 43", () => {
    const request = new Request("https://example.com/api?q=43", {
      headers: { "x-request-id": "req-43" },
    });
    expect(getRequestId(request)).toBe("req-43");
  });
  it("getApiRequestId matrix 43", () => {
    const request = new Request("https://example.com/api?q=43", {
      headers: { "cf-ray": "ray-43" },
    });
    expect(getApiRequestId(request)).toBe("ray-43");
  });
  it("getRequestId matrix 44", () => {
    const request = new Request("https://example.com/api?q=44", {
      headers: { "x-request-id": "req-44" },
    });
    expect(getRequestId(request)).toBe("req-44");
  });
  it("getApiRequestId matrix 44", () => {
    const request = new Request("https://example.com/api?q=44", {
      headers: { "cf-ray": "ray-44" },
    });
    expect(getApiRequestId(request)).toBe("ray-44");
  });
  it("getRequestId matrix 45", () => {
    const request = new Request("https://example.com/api?q=45", {
      headers: { "x-request-id": "req-45" },
    });
    expect(getRequestId(request)).toBe("req-45");
  });
  it("getApiRequestId matrix 45", () => {
    const request = new Request("https://example.com/api?q=45", {
      headers: { "cf-ray": "ray-45" },
    });
    expect(getApiRequestId(request)).toBe("ray-45");
  });
  it("getRequestId matrix 46", () => {
    const request = new Request("https://example.com/api?q=46", {
      headers: { "x-request-id": "req-46" },
    });
    expect(getRequestId(request)).toBe("req-46");
  });
  it("getApiRequestId matrix 46", () => {
    const request = new Request("https://example.com/api?q=46", {
      headers: { "cf-ray": "ray-46" },
    });
    expect(getApiRequestId(request)).toBe("ray-46");
  });
  it("getRequestId matrix 47", () => {
    const request = new Request("https://example.com/api?q=47", {
      headers: { "x-request-id": "req-47" },
    });
    expect(getRequestId(request)).toBe("req-47");
  });
  it("getApiRequestId matrix 47", () => {
    const request = new Request("https://example.com/api?q=47", {
      headers: { "cf-ray": "ray-47" },
    });
    expect(getApiRequestId(request)).toBe("ray-47");
  });
  it("getRequestId matrix 48", () => {
    const request = new Request("https://example.com/api?q=48", {
      headers: { "x-request-id": "req-48" },
    });
    expect(getRequestId(request)).toBe("req-48");
  });
  it("getApiRequestId matrix 48", () => {
    const request = new Request("https://example.com/api?q=48", {
      headers: { "cf-ray": "ray-48" },
    });
    expect(getApiRequestId(request)).toBe("ray-48");
  });
  it("getRequestId matrix 49", () => {
    const request = new Request("https://example.com/api?q=49", {
      headers: { "x-request-id": "req-49" },
    });
    expect(getRequestId(request)).toBe("req-49");
  });
  it("getApiRequestId matrix 49", () => {
    const request = new Request("https://example.com/api?q=49", {
      headers: { "cf-ray": "ray-49" },
    });
    expect(getApiRequestId(request)).toBe("ray-49");
  });
});

describe("router-lib getQueryObject", () => {
  it("getQueryObject matrix 0", () => {
    const request = new Request("https://example.com/api?foo=bar0&baz=qux");
    expect(getQueryObject(request).foo).toBe("bar0");
  });
  it("getQueryObject matrix 1", () => {
    const request = new Request("https://example.com/api?foo=bar1&baz=qux");
    expect(getQueryObject(request).foo).toBe("bar1");
  });
  it("getQueryObject matrix 2", () => {
    const request = new Request("https://example.com/api?foo=bar2&baz=qux");
    expect(getQueryObject(request).foo).toBe("bar2");
  });
  it("getQueryObject matrix 3", () => {
    const request = new Request("https://example.com/api?foo=bar3&baz=qux");
    expect(getQueryObject(request).foo).toBe("bar3");
  });
  it("getQueryObject matrix 4", () => {
    const request = new Request("https://example.com/api?foo=bar4&baz=qux");
    expect(getQueryObject(request).foo).toBe("bar4");
  });
  it("getQueryObject matrix 5", () => {
    const request = new Request("https://example.com/api?foo=bar5&baz=qux");
    expect(getQueryObject(request).foo).toBe("bar5");
  });
  it("getQueryObject matrix 6", () => {
    const request = new Request("https://example.com/api?foo=bar6&baz=qux");
    expect(getQueryObject(request).foo).toBe("bar6");
  });
  it("getQueryObject matrix 7", () => {
    const request = new Request("https://example.com/api?foo=bar7&baz=qux");
    expect(getQueryObject(request).foo).toBe("bar7");
  });
  it("getQueryObject matrix 8", () => {
    const request = new Request("https://example.com/api?foo=bar8&baz=qux");
    expect(getQueryObject(request).foo).toBe("bar8");
  });
  it("getQueryObject matrix 9", () => {
    const request = new Request("https://example.com/api?foo=bar9&baz=qux");
    expect(getQueryObject(request).foo).toBe("bar9");
  });
  it("getQueryObject matrix 10", () => {
    const request = new Request("https://example.com/api?foo=bar10&baz=qux");
    expect(getQueryObject(request).foo).toBe("bar10");
  });
  it("getQueryObject matrix 11", () => {
    const request = new Request("https://example.com/api?foo=bar11&baz=qux");
    expect(getQueryObject(request).foo).toBe("bar11");
  });
  it("getQueryObject matrix 12", () => {
    const request = new Request("https://example.com/api?foo=bar12&baz=qux");
    expect(getQueryObject(request).foo).toBe("bar12");
  });
  it("getQueryObject matrix 13", () => {
    const request = new Request("https://example.com/api?foo=bar13&baz=qux");
    expect(getQueryObject(request).foo).toBe("bar13");
  });
  it("getQueryObject matrix 14", () => {
    const request = new Request("https://example.com/api?foo=bar14&baz=qux");
    expect(getQueryObject(request).foo).toBe("bar14");
  });
  it("getQueryObject matrix 15", () => {
    const request = new Request("https://example.com/api?foo=bar15&baz=qux");
    expect(getQueryObject(request).foo).toBe("bar15");
  });
  it("getQueryObject matrix 16", () => {
    const request = new Request("https://example.com/api?foo=bar16&baz=qux");
    expect(getQueryObject(request).foo).toBe("bar16");
  });
  it("getQueryObject matrix 17", () => {
    const request = new Request("https://example.com/api?foo=bar17&baz=qux");
    expect(getQueryObject(request).foo).toBe("bar17");
  });
  it("getQueryObject matrix 18", () => {
    const request = new Request("https://example.com/api?foo=bar18&baz=qux");
    expect(getQueryObject(request).foo).toBe("bar18");
  });
  it("getQueryObject matrix 19", () => {
    const request = new Request("https://example.com/api?foo=bar19&baz=qux");
    expect(getQueryObject(request).foo).toBe("bar19");
  });
  it("getQueryObject matrix 20", () => {
    const request = new Request("https://example.com/api?foo=bar20&baz=qux");
    expect(getQueryObject(request).foo).toBe("bar20");
  });
  it("getQueryObject matrix 21", () => {
    const request = new Request("https://example.com/api?foo=bar21&baz=qux");
    expect(getQueryObject(request).foo).toBe("bar21");
  });
  it("getQueryObject matrix 22", () => {
    const request = new Request("https://example.com/api?foo=bar22&baz=qux");
    expect(getQueryObject(request).foo).toBe("bar22");
  });
  it("getQueryObject matrix 23", () => {
    const request = new Request("https://example.com/api?foo=bar23&baz=qux");
    expect(getQueryObject(request).foo).toBe("bar23");
  });
  it("getQueryObject matrix 24", () => {
    const request = new Request("https://example.com/api?foo=bar24&baz=qux");
    expect(getQueryObject(request).foo).toBe("bar24");
  });
  it("getQueryObject matrix 25", () => {
    const request = new Request("https://example.com/api?foo=bar25&baz=qux");
    expect(getQueryObject(request).foo).toBe("bar25");
  });
  it("getQueryObject matrix 26", () => {
    const request = new Request("https://example.com/api?foo=bar26&baz=qux");
    expect(getQueryObject(request).foo).toBe("bar26");
  });
  it("getQueryObject matrix 27", () => {
    const request = new Request("https://example.com/api?foo=bar27&baz=qux");
    expect(getQueryObject(request).foo).toBe("bar27");
  });
  it("getQueryObject matrix 28", () => {
    const request = new Request("https://example.com/api?foo=bar28&baz=qux");
    expect(getQueryObject(request).foo).toBe("bar28");
  });
  it("getQueryObject matrix 29", () => {
    const request = new Request("https://example.com/api?foo=bar29&baz=qux");
    expect(getQueryObject(request).foo).toBe("bar29");
  });
  it("getQueryObject matrix 30", () => {
    const request = new Request("https://example.com/api?foo=bar30&baz=qux");
    expect(getQueryObject(request).foo).toBe("bar30");
  });
  it("getQueryObject matrix 31", () => {
    const request = new Request("https://example.com/api?foo=bar31&baz=qux");
    expect(getQueryObject(request).foo).toBe("bar31");
  });
  it("getQueryObject matrix 32", () => {
    const request = new Request("https://example.com/api?foo=bar32&baz=qux");
    expect(getQueryObject(request).foo).toBe("bar32");
  });
  it("getQueryObject matrix 33", () => {
    const request = new Request("https://example.com/api?foo=bar33&baz=qux");
    expect(getQueryObject(request).foo).toBe("bar33");
  });
  it("getQueryObject matrix 34", () => {
    const request = new Request("https://example.com/api?foo=bar34&baz=qux");
    expect(getQueryObject(request).foo).toBe("bar34");
  });
  it("getQueryObject matrix 35", () => {
    const request = new Request("https://example.com/api?foo=bar35&baz=qux");
    expect(getQueryObject(request).foo).toBe("bar35");
  });
  it("getQueryObject matrix 36", () => {
    const request = new Request("https://example.com/api?foo=bar36&baz=qux");
    expect(getQueryObject(request).foo).toBe("bar36");
  });
  it("getQueryObject matrix 37", () => {
    const request = new Request("https://example.com/api?foo=bar37&baz=qux");
    expect(getQueryObject(request).foo).toBe("bar37");
  });
  it("getQueryObject matrix 38", () => {
    const request = new Request("https://example.com/api?foo=bar38&baz=qux");
    expect(getQueryObject(request).foo).toBe("bar38");
  });
  it("getQueryObject matrix 39", () => {
    const request = new Request("https://example.com/api?foo=bar39&baz=qux");
    expect(getQueryObject(request).foo).toBe("bar39");
  });
  it("getQueryObject matrix 40", () => {
    const request = new Request("https://example.com/api?foo=bar40&baz=qux");
    expect(getQueryObject(request).foo).toBe("bar40");
  });
  it("getQueryObject matrix 41", () => {
    const request = new Request("https://example.com/api?foo=bar41&baz=qux");
    expect(getQueryObject(request).foo).toBe("bar41");
  });
  it("getQueryObject matrix 42", () => {
    const request = new Request("https://example.com/api?foo=bar42&baz=qux");
    expect(getQueryObject(request).foo).toBe("bar42");
  });
  it("getQueryObject matrix 43", () => {
    const request = new Request("https://example.com/api?foo=bar43&baz=qux");
    expect(getQueryObject(request).foo).toBe("bar43");
  });
  it("getQueryObject matrix 44", () => {
    const request = new Request("https://example.com/api?foo=bar44&baz=qux");
    expect(getQueryObject(request).foo).toBe("bar44");
  });
  it("getQueryObject matrix 45", () => {
    const request = new Request("https://example.com/api?foo=bar45&baz=qux");
    expect(getQueryObject(request).foo).toBe("bar45");
  });
  it("getQueryObject matrix 46", () => {
    const request = new Request("https://example.com/api?foo=bar46&baz=qux");
    expect(getQueryObject(request).foo).toBe("bar46");
  });
  it("getQueryObject matrix 47", () => {
    const request = new Request("https://example.com/api?foo=bar47&baz=qux");
    expect(getQueryObject(request).foo).toBe("bar47");
  });
  it("getQueryObject matrix 48", () => {
    const request = new Request("https://example.com/api?foo=bar48&baz=qux");
    expect(getQueryObject(request).foo).toBe("bar48");
  });
  it("getQueryObject matrix 49", () => {
    const request = new Request("https://example.com/api?foo=bar49&baz=qux");
    expect(getQueryObject(request).foo).toBe("bar49");
  });
});

describe("router-lib normalizeZodIssues and errorMessage", () => {
  it("normalizes zod issues", () => {
    try {
      z.object({ slug: z.string().min(3) }).parse({ slug: "a" });
    } catch (error) {
      const issues = normalizeZodIssues(error as ZodError);
      expect(issues[0].path).toBe("slug");
    }
  });
  it("errorMessage matrix 0", () => {
    expect(errorMessage("rate_limited_0")).toContain("Rate");
  });
  it("normalizeZodIssues matrix 0", () => {
    const error = new ZodError([
      { code: "custom", path: ["field0"], message: "bad" },
    ]);
    expect(normalizeZodIssues(error)[0].path).toBe("field0");
  });
  it("errorMessage matrix 1", () => {
    expect(errorMessage("rate_limited_1")).toContain("Rate");
  });
  it("normalizeZodIssues matrix 1", () => {
    const error = new ZodError([
      { code: "custom", path: ["field1"], message: "bad" },
    ]);
    expect(normalizeZodIssues(error)[0].path).toBe("field1");
  });
  it("errorMessage matrix 2", () => {
    expect(errorMessage("rate_limited_2")).toContain("Rate");
  });
  it("normalizeZodIssues matrix 2", () => {
    const error = new ZodError([
      { code: "custom", path: ["field2"], message: "bad" },
    ]);
    expect(normalizeZodIssues(error)[0].path).toBe("field2");
  });
  it("errorMessage matrix 3", () => {
    expect(errorMessage("rate_limited_3")).toContain("Rate");
  });
  it("normalizeZodIssues matrix 3", () => {
    const error = new ZodError([
      { code: "custom", path: ["field3"], message: "bad" },
    ]);
    expect(normalizeZodIssues(error)[0].path).toBe("field3");
  });
  it("errorMessage matrix 4", () => {
    expect(errorMessage("rate_limited_4")).toContain("Rate");
  });
  it("normalizeZodIssues matrix 4", () => {
    const error = new ZodError([
      { code: "custom", path: ["field4"], message: "bad" },
    ]);
    expect(normalizeZodIssues(error)[0].path).toBe("field4");
  });
  it("errorMessage matrix 5", () => {
    expect(errorMessage("rate_limited_5")).toContain("Rate");
  });
  it("normalizeZodIssues matrix 5", () => {
    const error = new ZodError([
      { code: "custom", path: ["field5"], message: "bad" },
    ]);
    expect(normalizeZodIssues(error)[0].path).toBe("field5");
  });
  it("errorMessage matrix 6", () => {
    expect(errorMessage("rate_limited_6")).toContain("Rate");
  });
  it("normalizeZodIssues matrix 6", () => {
    const error = new ZodError([
      { code: "custom", path: ["field6"], message: "bad" },
    ]);
    expect(normalizeZodIssues(error)[0].path).toBe("field6");
  });
  it("errorMessage matrix 7", () => {
    expect(errorMessage("rate_limited_7")).toContain("Rate");
  });
  it("normalizeZodIssues matrix 7", () => {
    const error = new ZodError([
      { code: "custom", path: ["field7"], message: "bad" },
    ]);
    expect(normalizeZodIssues(error)[0].path).toBe("field7");
  });
  it("errorMessage matrix 8", () => {
    expect(errorMessage("rate_limited_8")).toContain("Rate");
  });
  it("normalizeZodIssues matrix 8", () => {
    const error = new ZodError([
      { code: "custom", path: ["field8"], message: "bad" },
    ]);
    expect(normalizeZodIssues(error)[0].path).toBe("field8");
  });
  it("errorMessage matrix 9", () => {
    expect(errorMessage("rate_limited_9")).toContain("Rate");
  });
  it("normalizeZodIssues matrix 9", () => {
    const error = new ZodError([
      { code: "custom", path: ["field9"], message: "bad" },
    ]);
    expect(normalizeZodIssues(error)[0].path).toBe("field9");
  });
  it("errorMessage matrix 10", () => {
    expect(errorMessage("rate_limited_10")).toContain("Rate");
  });
  it("normalizeZodIssues matrix 10", () => {
    const error = new ZodError([
      { code: "custom", path: ["field10"], message: "bad" },
    ]);
    expect(normalizeZodIssues(error)[0].path).toBe("field10");
  });
  it("errorMessage matrix 11", () => {
    expect(errorMessage("rate_limited_11")).toContain("Rate");
  });
  it("normalizeZodIssues matrix 11", () => {
    const error = new ZodError([
      { code: "custom", path: ["field11"], message: "bad" },
    ]);
    expect(normalizeZodIssues(error)[0].path).toBe("field11");
  });
  it("errorMessage matrix 12", () => {
    expect(errorMessage("rate_limited_12")).toContain("Rate");
  });
  it("normalizeZodIssues matrix 12", () => {
    const error = new ZodError([
      { code: "custom", path: ["field12"], message: "bad" },
    ]);
    expect(normalizeZodIssues(error)[0].path).toBe("field12");
  });
  it("errorMessage matrix 13", () => {
    expect(errorMessage("rate_limited_13")).toContain("Rate");
  });
  it("normalizeZodIssues matrix 13", () => {
    const error = new ZodError([
      { code: "custom", path: ["field13"], message: "bad" },
    ]);
    expect(normalizeZodIssues(error)[0].path).toBe("field13");
  });
  it("errorMessage matrix 14", () => {
    expect(errorMessage("rate_limited_14")).toContain("Rate");
  });
  it("normalizeZodIssues matrix 14", () => {
    const error = new ZodError([
      { code: "custom", path: ["field14"], message: "bad" },
    ]);
    expect(normalizeZodIssues(error)[0].path).toBe("field14");
  });
  it("errorMessage matrix 15", () => {
    expect(errorMessage("rate_limited_15")).toContain("Rate");
  });
  it("normalizeZodIssues matrix 15", () => {
    const error = new ZodError([
      { code: "custom", path: ["field15"], message: "bad" },
    ]);
    expect(normalizeZodIssues(error)[0].path).toBe("field15");
  });
  it("errorMessage matrix 16", () => {
    expect(errorMessage("rate_limited_16")).toContain("Rate");
  });
  it("normalizeZodIssues matrix 16", () => {
    const error = new ZodError([
      { code: "custom", path: ["field16"], message: "bad" },
    ]);
    expect(normalizeZodIssues(error)[0].path).toBe("field16");
  });
  it("errorMessage matrix 17", () => {
    expect(errorMessage("rate_limited_17")).toContain("Rate");
  });
  it("normalizeZodIssues matrix 17", () => {
    const error = new ZodError([
      { code: "custom", path: ["field17"], message: "bad" },
    ]);
    expect(normalizeZodIssues(error)[0].path).toBe("field17");
  });
  it("errorMessage matrix 18", () => {
    expect(errorMessage("rate_limited_18")).toContain("Rate");
  });
  it("normalizeZodIssues matrix 18", () => {
    const error = new ZodError([
      { code: "custom", path: ["field18"], message: "bad" },
    ]);
    expect(normalizeZodIssues(error)[0].path).toBe("field18");
  });
  it("errorMessage matrix 19", () => {
    expect(errorMessage("rate_limited_19")).toContain("Rate");
  });
  it("normalizeZodIssues matrix 19", () => {
    const error = new ZodError([
      { code: "custom", path: ["field19"], message: "bad" },
    ]);
    expect(normalizeZodIssues(error)[0].path).toBe("field19");
  });
  it("errorMessage matrix 20", () => {
    expect(errorMessage("rate_limited_20")).toContain("Rate");
  });
  it("normalizeZodIssues matrix 20", () => {
    const error = new ZodError([
      { code: "custom", path: ["field20"], message: "bad" },
    ]);
    expect(normalizeZodIssues(error)[0].path).toBe("field20");
  });
  it("errorMessage matrix 21", () => {
    expect(errorMessage("rate_limited_21")).toContain("Rate");
  });
  it("normalizeZodIssues matrix 21", () => {
    const error = new ZodError([
      { code: "custom", path: ["field21"], message: "bad" },
    ]);
    expect(normalizeZodIssues(error)[0].path).toBe("field21");
  });
  it("errorMessage matrix 22", () => {
    expect(errorMessage("rate_limited_22")).toContain("Rate");
  });
  it("normalizeZodIssues matrix 22", () => {
    const error = new ZodError([
      { code: "custom", path: ["field22"], message: "bad" },
    ]);
    expect(normalizeZodIssues(error)[0].path).toBe("field22");
  });
  it("errorMessage matrix 23", () => {
    expect(errorMessage("rate_limited_23")).toContain("Rate");
  });
  it("normalizeZodIssues matrix 23", () => {
    const error = new ZodError([
      { code: "custom", path: ["field23"], message: "bad" },
    ]);
    expect(normalizeZodIssues(error)[0].path).toBe("field23");
  });
  it("errorMessage matrix 24", () => {
    expect(errorMessage("rate_limited_24")).toContain("Rate");
  });
  it("normalizeZodIssues matrix 24", () => {
    const error = new ZodError([
      { code: "custom", path: ["field24"], message: "bad" },
    ]);
    expect(normalizeZodIssues(error)[0].path).toBe("field24");
  });
  it("errorMessage matrix 25", () => {
    expect(errorMessage("rate_limited_25")).toContain("Rate");
  });
  it("normalizeZodIssues matrix 25", () => {
    const error = new ZodError([
      { code: "custom", path: ["field25"], message: "bad" },
    ]);
    expect(normalizeZodIssues(error)[0].path).toBe("field25");
  });
  it("errorMessage matrix 26", () => {
    expect(errorMessage("rate_limited_26")).toContain("Rate");
  });
  it("normalizeZodIssues matrix 26", () => {
    const error = new ZodError([
      { code: "custom", path: ["field26"], message: "bad" },
    ]);
    expect(normalizeZodIssues(error)[0].path).toBe("field26");
  });
  it("errorMessage matrix 27", () => {
    expect(errorMessage("rate_limited_27")).toContain("Rate");
  });
  it("normalizeZodIssues matrix 27", () => {
    const error = new ZodError([
      { code: "custom", path: ["field27"], message: "bad" },
    ]);
    expect(normalizeZodIssues(error)[0].path).toBe("field27");
  });
  it("errorMessage matrix 28", () => {
    expect(errorMessage("rate_limited_28")).toContain("Rate");
  });
  it("normalizeZodIssues matrix 28", () => {
    const error = new ZodError([
      { code: "custom", path: ["field28"], message: "bad" },
    ]);
    expect(normalizeZodIssues(error)[0].path).toBe("field28");
  });
  it("errorMessage matrix 29", () => {
    expect(errorMessage("rate_limited_29")).toContain("Rate");
  });
  it("normalizeZodIssues matrix 29", () => {
    const error = new ZodError([
      { code: "custom", path: ["field29"], message: "bad" },
    ]);
    expect(normalizeZodIssues(error)[0].path).toBe("field29");
  });
  it("errorMessage matrix 30", () => {
    expect(errorMessage("rate_limited_30")).toContain("Rate");
  });
  it("normalizeZodIssues matrix 30", () => {
    const error = new ZodError([
      { code: "custom", path: ["field30"], message: "bad" },
    ]);
    expect(normalizeZodIssues(error)[0].path).toBe("field30");
  });
  it("errorMessage matrix 31", () => {
    expect(errorMessage("rate_limited_31")).toContain("Rate");
  });
  it("normalizeZodIssues matrix 31", () => {
    const error = new ZodError([
      { code: "custom", path: ["field31"], message: "bad" },
    ]);
    expect(normalizeZodIssues(error)[0].path).toBe("field31");
  });
  it("errorMessage matrix 32", () => {
    expect(errorMessage("rate_limited_32")).toContain("Rate");
  });
  it("normalizeZodIssues matrix 32", () => {
    const error = new ZodError([
      { code: "custom", path: ["field32"], message: "bad" },
    ]);
    expect(normalizeZodIssues(error)[0].path).toBe("field32");
  });
  it("errorMessage matrix 33", () => {
    expect(errorMessage("rate_limited_33")).toContain("Rate");
  });
  it("normalizeZodIssues matrix 33", () => {
    const error = new ZodError([
      { code: "custom", path: ["field33"], message: "bad" },
    ]);
    expect(normalizeZodIssues(error)[0].path).toBe("field33");
  });
  it("errorMessage matrix 34", () => {
    expect(errorMessage("rate_limited_34")).toContain("Rate");
  });
  it("normalizeZodIssues matrix 34", () => {
    const error = new ZodError([
      { code: "custom", path: ["field34"], message: "bad" },
    ]);
    expect(normalizeZodIssues(error)[0].path).toBe("field34");
  });
  it("errorMessage matrix 35", () => {
    expect(errorMessage("rate_limited_35")).toContain("Rate");
  });
  it("normalizeZodIssues matrix 35", () => {
    const error = new ZodError([
      { code: "custom", path: ["field35"], message: "bad" },
    ]);
    expect(normalizeZodIssues(error)[0].path).toBe("field35");
  });
  it("errorMessage matrix 36", () => {
    expect(errorMessage("rate_limited_36")).toContain("Rate");
  });
  it("normalizeZodIssues matrix 36", () => {
    const error = new ZodError([
      { code: "custom", path: ["field36"], message: "bad" },
    ]);
    expect(normalizeZodIssues(error)[0].path).toBe("field36");
  });
  it("errorMessage matrix 37", () => {
    expect(errorMessage("rate_limited_37")).toContain("Rate");
  });
  it("normalizeZodIssues matrix 37", () => {
    const error = new ZodError([
      { code: "custom", path: ["field37"], message: "bad" },
    ]);
    expect(normalizeZodIssues(error)[0].path).toBe("field37");
  });
  it("errorMessage matrix 38", () => {
    expect(errorMessage("rate_limited_38")).toContain("Rate");
  });
  it("normalizeZodIssues matrix 38", () => {
    const error = new ZodError([
      { code: "custom", path: ["field38"], message: "bad" },
    ]);
    expect(normalizeZodIssues(error)[0].path).toBe("field38");
  });
  it("errorMessage matrix 39", () => {
    expect(errorMessage("rate_limited_39")).toContain("Rate");
  });
  it("normalizeZodIssues matrix 39", () => {
    const error = new ZodError([
      { code: "custom", path: ["field39"], message: "bad" },
    ]);
    expect(normalizeZodIssues(error)[0].path).toBe("field39");
  });
  it("errorMessage matrix 40", () => {
    expect(errorMessage("rate_limited_40")).toContain("Rate");
  });
  it("normalizeZodIssues matrix 40", () => {
    const error = new ZodError([
      { code: "custom", path: ["field40"], message: "bad" },
    ]);
    expect(normalizeZodIssues(error)[0].path).toBe("field40");
  });
  it("errorMessage matrix 41", () => {
    expect(errorMessage("rate_limited_41")).toContain("Rate");
  });
  it("normalizeZodIssues matrix 41", () => {
    const error = new ZodError([
      { code: "custom", path: ["field41"], message: "bad" },
    ]);
    expect(normalizeZodIssues(error)[0].path).toBe("field41");
  });
  it("errorMessage matrix 42", () => {
    expect(errorMessage("rate_limited_42")).toContain("Rate");
  });
  it("normalizeZodIssues matrix 42", () => {
    const error = new ZodError([
      { code: "custom", path: ["field42"], message: "bad" },
    ]);
    expect(normalizeZodIssues(error)[0].path).toBe("field42");
  });
  it("errorMessage matrix 43", () => {
    expect(errorMessage("rate_limited_43")).toContain("Rate");
  });
  it("normalizeZodIssues matrix 43", () => {
    const error = new ZodError([
      { code: "custom", path: ["field43"], message: "bad" },
    ]);
    expect(normalizeZodIssues(error)[0].path).toBe("field43");
  });
  it("errorMessage matrix 44", () => {
    expect(errorMessage("rate_limited_44")).toContain("Rate");
  });
  it("normalizeZodIssues matrix 44", () => {
    const error = new ZodError([
      { code: "custom", path: ["field44"], message: "bad" },
    ]);
    expect(normalizeZodIssues(error)[0].path).toBe("field44");
  });
  it("errorMessage matrix 45", () => {
    expect(errorMessage("rate_limited_45")).toContain("Rate");
  });
  it("normalizeZodIssues matrix 45", () => {
    const error = new ZodError([
      { code: "custom", path: ["field45"], message: "bad" },
    ]);
    expect(normalizeZodIssues(error)[0].path).toBe("field45");
  });
  it("errorMessage matrix 46", () => {
    expect(errorMessage("rate_limited_46")).toContain("Rate");
  });
  it("normalizeZodIssues matrix 46", () => {
    const error = new ZodError([
      { code: "custom", path: ["field46"], message: "bad" },
    ]);
    expect(normalizeZodIssues(error)[0].path).toBe("field46");
  });
  it("errorMessage matrix 47", () => {
    expect(errorMessage("rate_limited_47")).toContain("Rate");
  });
  it("normalizeZodIssues matrix 47", () => {
    const error = new ZodError([
      { code: "custom", path: ["field47"], message: "bad" },
    ]);
    expect(normalizeZodIssues(error)[0].path).toBe("field47");
  });
  it("errorMessage matrix 48", () => {
    expect(errorMessage("rate_limited_48")).toContain("Rate");
  });
  it("normalizeZodIssues matrix 48", () => {
    const error = new ZodError([
      { code: "custom", path: ["field48"], message: "bad" },
    ]);
    expect(normalizeZodIssues(error)[0].path).toBe("field48");
  });
  it("errorMessage matrix 49", () => {
    expect(errorMessage("rate_limited_49")).toContain("Rate");
  });
  it("normalizeZodIssues matrix 49", () => {
    const error = new ZodError([
      { code: "custom", path: ["field49"], message: "bad" },
    ]);
    expect(normalizeZodIssues(error)[0].path).toBe("field49");
  });
});

describe("router-lib apiError and apiJson", () => {
  it("apiError matrix 0", async () => {
    const response = apiError("test_error_0", 400, { requestId: "rid-0" });
    const body = await response.json();
    expect(body.ok).toBe(false);
    expect(body.requestId).toBe("rid-0");
  });
  it("apiJson matrix 0", async () => {
    const response = apiJson({ ok: true, value: 0 });
    const body = await response.json();
    expect(body.value).toBe(0);
  });
  it("withApiHeaders matrix 0", () => {
    const response = new Response("{}", {
      headers: { "content-type": "application/json" },
    });
    expect(withApiHeaders(response).headers.get("content-type")).toContain(
      "json",
    );
  });
  it("apiError matrix 1", async () => {
    const response = apiError("test_error_1", 400, { requestId: "rid-1" });
    const body = await response.json();
    expect(body.ok).toBe(false);
    expect(body.requestId).toBe("rid-1");
  });
  it("apiJson matrix 1", async () => {
    const response = apiJson({ ok: true, value: 1 });
    const body = await response.json();
    expect(body.value).toBe(1);
  });
  it("withApiHeaders matrix 1", () => {
    const response = new Response("{}", {
      headers: { "content-type": "application/json" },
    });
    expect(withApiHeaders(response).headers.get("content-type")).toContain(
      "json",
    );
  });
  it("apiError matrix 2", async () => {
    const response = apiError("test_error_2", 400, { requestId: "rid-2" });
    const body = await response.json();
    expect(body.ok).toBe(false);
    expect(body.requestId).toBe("rid-2");
  });
  it("apiJson matrix 2", async () => {
    const response = apiJson({ ok: true, value: 2 });
    const body = await response.json();
    expect(body.value).toBe(2);
  });
  it("withApiHeaders matrix 2", () => {
    const response = new Response("{}", {
      headers: { "content-type": "application/json" },
    });
    expect(withApiHeaders(response).headers.get("content-type")).toContain(
      "json",
    );
  });
  it("apiError matrix 3", async () => {
    const response = apiError("test_error_3", 400, { requestId: "rid-3" });
    const body = await response.json();
    expect(body.ok).toBe(false);
    expect(body.requestId).toBe("rid-3");
  });
  it("apiJson matrix 3", async () => {
    const response = apiJson({ ok: true, value: 3 });
    const body = await response.json();
    expect(body.value).toBe(3);
  });
  it("withApiHeaders matrix 3", () => {
    const response = new Response("{}", {
      headers: { "content-type": "application/json" },
    });
    expect(withApiHeaders(response).headers.get("content-type")).toContain(
      "json",
    );
  });
  it("apiError matrix 4", async () => {
    const response = apiError("test_error_4", 400, { requestId: "rid-4" });
    const body = await response.json();
    expect(body.ok).toBe(false);
    expect(body.requestId).toBe("rid-4");
  });
  it("apiJson matrix 4", async () => {
    const response = apiJson({ ok: true, value: 4 });
    const body = await response.json();
    expect(body.value).toBe(4);
  });
  it("withApiHeaders matrix 4", () => {
    const response = new Response("{}", {
      headers: { "content-type": "application/json" },
    });
    expect(withApiHeaders(response).headers.get("content-type")).toContain(
      "json",
    );
  });
  it("apiError matrix 5", async () => {
    const response = apiError("test_error_5", 400, { requestId: "rid-5" });
    const body = await response.json();
    expect(body.ok).toBe(false);
    expect(body.requestId).toBe("rid-5");
  });
  it("apiJson matrix 5", async () => {
    const response = apiJson({ ok: true, value: 5 });
    const body = await response.json();
    expect(body.value).toBe(5);
  });
  it("withApiHeaders matrix 5", () => {
    const response = new Response("{}", {
      headers: { "content-type": "application/json" },
    });
    expect(withApiHeaders(response).headers.get("content-type")).toContain(
      "json",
    );
  });
  it("apiError matrix 6", async () => {
    const response = apiError("test_error_6", 400, { requestId: "rid-6" });
    const body = await response.json();
    expect(body.ok).toBe(false);
    expect(body.requestId).toBe("rid-6");
  });
  it("apiJson matrix 6", async () => {
    const response = apiJson({ ok: true, value: 6 });
    const body = await response.json();
    expect(body.value).toBe(6);
  });
  it("withApiHeaders matrix 6", () => {
    const response = new Response("{}", {
      headers: { "content-type": "application/json" },
    });
    expect(withApiHeaders(response).headers.get("content-type")).toContain(
      "json",
    );
  });
  it("apiError matrix 7", async () => {
    const response = apiError("test_error_7", 400, { requestId: "rid-7" });
    const body = await response.json();
    expect(body.ok).toBe(false);
    expect(body.requestId).toBe("rid-7");
  });
  it("apiJson matrix 7", async () => {
    const response = apiJson({ ok: true, value: 7 });
    const body = await response.json();
    expect(body.value).toBe(7);
  });
  it("withApiHeaders matrix 7", () => {
    const response = new Response("{}", {
      headers: { "content-type": "application/json" },
    });
    expect(withApiHeaders(response).headers.get("content-type")).toContain(
      "json",
    );
  });
  it("apiError matrix 8", async () => {
    const response = apiError("test_error_8", 400, { requestId: "rid-8" });
    const body = await response.json();
    expect(body.ok).toBe(false);
    expect(body.requestId).toBe("rid-8");
  });
  it("apiJson matrix 8", async () => {
    const response = apiJson({ ok: true, value: 8 });
    const body = await response.json();
    expect(body.value).toBe(8);
  });
  it("withApiHeaders matrix 8", () => {
    const response = new Response("{}", {
      headers: { "content-type": "application/json" },
    });
    expect(withApiHeaders(response).headers.get("content-type")).toContain(
      "json",
    );
  });
  it("apiError matrix 9", async () => {
    const response = apiError("test_error_9", 400, { requestId: "rid-9" });
    const body = await response.json();
    expect(body.ok).toBe(false);
    expect(body.requestId).toBe("rid-9");
  });
  it("apiJson matrix 9", async () => {
    const response = apiJson({ ok: true, value: 9 });
    const body = await response.json();
    expect(body.value).toBe(9);
  });
  it("withApiHeaders matrix 9", () => {
    const response = new Response("{}", {
      headers: { "content-type": "application/json" },
    });
    expect(withApiHeaders(response).headers.get("content-type")).toContain(
      "json",
    );
  });
  it("apiError matrix 10", async () => {
    const response = apiError("test_error_10", 400, { requestId: "rid-10" });
    const body = await response.json();
    expect(body.ok).toBe(false);
    expect(body.requestId).toBe("rid-10");
  });
  it("apiJson matrix 10", async () => {
    const response = apiJson({ ok: true, value: 10 });
    const body = await response.json();
    expect(body.value).toBe(10);
  });
  it("withApiHeaders matrix 10", () => {
    const response = new Response("{}", {
      headers: { "content-type": "application/json" },
    });
    expect(withApiHeaders(response).headers.get("content-type")).toContain(
      "json",
    );
  });
  it("apiError matrix 11", async () => {
    const response = apiError("test_error_11", 400, { requestId: "rid-11" });
    const body = await response.json();
    expect(body.ok).toBe(false);
    expect(body.requestId).toBe("rid-11");
  });
  it("apiJson matrix 11", async () => {
    const response = apiJson({ ok: true, value: 11 });
    const body = await response.json();
    expect(body.value).toBe(11);
  });
  it("withApiHeaders matrix 11", () => {
    const response = new Response("{}", {
      headers: { "content-type": "application/json" },
    });
    expect(withApiHeaders(response).headers.get("content-type")).toContain(
      "json",
    );
  });
  it("apiError matrix 12", async () => {
    const response = apiError("test_error_12", 400, { requestId: "rid-12" });
    const body = await response.json();
    expect(body.ok).toBe(false);
    expect(body.requestId).toBe("rid-12");
  });
  it("apiJson matrix 12", async () => {
    const response = apiJson({ ok: true, value: 12 });
    const body = await response.json();
    expect(body.value).toBe(12);
  });
  it("withApiHeaders matrix 12", () => {
    const response = new Response("{}", {
      headers: { "content-type": "application/json" },
    });
    expect(withApiHeaders(response).headers.get("content-type")).toContain(
      "json",
    );
  });
  it("apiError matrix 13", async () => {
    const response = apiError("test_error_13", 400, { requestId: "rid-13" });
    const body = await response.json();
    expect(body.ok).toBe(false);
    expect(body.requestId).toBe("rid-13");
  });
  it("apiJson matrix 13", async () => {
    const response = apiJson({ ok: true, value: 13 });
    const body = await response.json();
    expect(body.value).toBe(13);
  });
  it("withApiHeaders matrix 13", () => {
    const response = new Response("{}", {
      headers: { "content-type": "application/json" },
    });
    expect(withApiHeaders(response).headers.get("content-type")).toContain(
      "json",
    );
  });
  it("apiError matrix 14", async () => {
    const response = apiError("test_error_14", 400, { requestId: "rid-14" });
    const body = await response.json();
    expect(body.ok).toBe(false);
    expect(body.requestId).toBe("rid-14");
  });
  it("apiJson matrix 14", async () => {
    const response = apiJson({ ok: true, value: 14 });
    const body = await response.json();
    expect(body.value).toBe(14);
  });
  it("withApiHeaders matrix 14", () => {
    const response = new Response("{}", {
      headers: { "content-type": "application/json" },
    });
    expect(withApiHeaders(response).headers.get("content-type")).toContain(
      "json",
    );
  });
  it("apiError matrix 15", async () => {
    const response = apiError("test_error_15", 400, { requestId: "rid-15" });
    const body = await response.json();
    expect(body.ok).toBe(false);
    expect(body.requestId).toBe("rid-15");
  });
  it("apiJson matrix 15", async () => {
    const response = apiJson({ ok: true, value: 15 });
    const body = await response.json();
    expect(body.value).toBe(15);
  });
  it("withApiHeaders matrix 15", () => {
    const response = new Response("{}", {
      headers: { "content-type": "application/json" },
    });
    expect(withApiHeaders(response).headers.get("content-type")).toContain(
      "json",
    );
  });
  it("apiError matrix 16", async () => {
    const response = apiError("test_error_16", 400, { requestId: "rid-16" });
    const body = await response.json();
    expect(body.ok).toBe(false);
    expect(body.requestId).toBe("rid-16");
  });
  it("apiJson matrix 16", async () => {
    const response = apiJson({ ok: true, value: 16 });
    const body = await response.json();
    expect(body.value).toBe(16);
  });
  it("withApiHeaders matrix 16", () => {
    const response = new Response("{}", {
      headers: { "content-type": "application/json" },
    });
    expect(withApiHeaders(response).headers.get("content-type")).toContain(
      "json",
    );
  });
  it("apiError matrix 17", async () => {
    const response = apiError("test_error_17", 400, { requestId: "rid-17" });
    const body = await response.json();
    expect(body.ok).toBe(false);
    expect(body.requestId).toBe("rid-17");
  });
  it("apiJson matrix 17", async () => {
    const response = apiJson({ ok: true, value: 17 });
    const body = await response.json();
    expect(body.value).toBe(17);
  });
  it("withApiHeaders matrix 17", () => {
    const response = new Response("{}", {
      headers: { "content-type": "application/json" },
    });
    expect(withApiHeaders(response).headers.get("content-type")).toContain(
      "json",
    );
  });
  it("apiError matrix 18", async () => {
    const response = apiError("test_error_18", 400, { requestId: "rid-18" });
    const body = await response.json();
    expect(body.ok).toBe(false);
    expect(body.requestId).toBe("rid-18");
  });
  it("apiJson matrix 18", async () => {
    const response = apiJson({ ok: true, value: 18 });
    const body = await response.json();
    expect(body.value).toBe(18);
  });
  it("withApiHeaders matrix 18", () => {
    const response = new Response("{}", {
      headers: { "content-type": "application/json" },
    });
    expect(withApiHeaders(response).headers.get("content-type")).toContain(
      "json",
    );
  });
  it("apiError matrix 19", async () => {
    const response = apiError("test_error_19", 400, { requestId: "rid-19" });
    const body = await response.json();
    expect(body.ok).toBe(false);
    expect(body.requestId).toBe("rid-19");
  });
  it("apiJson matrix 19", async () => {
    const response = apiJson({ ok: true, value: 19 });
    const body = await response.json();
    expect(body.value).toBe(19);
  });
  it("withApiHeaders matrix 19", () => {
    const response = new Response("{}", {
      headers: { "content-type": "application/json" },
    });
    expect(withApiHeaders(response).headers.get("content-type")).toContain(
      "json",
    );
  });
  it("apiError matrix 20", async () => {
    const response = apiError("test_error_20", 400, { requestId: "rid-20" });
    const body = await response.json();
    expect(body.ok).toBe(false);
    expect(body.requestId).toBe("rid-20");
  });
  it("apiJson matrix 20", async () => {
    const response = apiJson({ ok: true, value: 20 });
    const body = await response.json();
    expect(body.value).toBe(20);
  });
  it("withApiHeaders matrix 20", () => {
    const response = new Response("{}", {
      headers: { "content-type": "application/json" },
    });
    expect(withApiHeaders(response).headers.get("content-type")).toContain(
      "json",
    );
  });
  it("apiError matrix 21", async () => {
    const response = apiError("test_error_21", 400, { requestId: "rid-21" });
    const body = await response.json();
    expect(body.ok).toBe(false);
    expect(body.requestId).toBe("rid-21");
  });
  it("apiJson matrix 21", async () => {
    const response = apiJson({ ok: true, value: 21 });
    const body = await response.json();
    expect(body.value).toBe(21);
  });
  it("withApiHeaders matrix 21", () => {
    const response = new Response("{}", {
      headers: { "content-type": "application/json" },
    });
    expect(withApiHeaders(response).headers.get("content-type")).toContain(
      "json",
    );
  });
  it("apiError matrix 22", async () => {
    const response = apiError("test_error_22", 400, { requestId: "rid-22" });
    const body = await response.json();
    expect(body.ok).toBe(false);
    expect(body.requestId).toBe("rid-22");
  });
  it("apiJson matrix 22", async () => {
    const response = apiJson({ ok: true, value: 22 });
    const body = await response.json();
    expect(body.value).toBe(22);
  });
  it("withApiHeaders matrix 22", () => {
    const response = new Response("{}", {
      headers: { "content-type": "application/json" },
    });
    expect(withApiHeaders(response).headers.get("content-type")).toContain(
      "json",
    );
  });
  it("apiError matrix 23", async () => {
    const response = apiError("test_error_23", 400, { requestId: "rid-23" });
    const body = await response.json();
    expect(body.ok).toBe(false);
    expect(body.requestId).toBe("rid-23");
  });
  it("apiJson matrix 23", async () => {
    const response = apiJson({ ok: true, value: 23 });
    const body = await response.json();
    expect(body.value).toBe(23);
  });
  it("withApiHeaders matrix 23", () => {
    const response = new Response("{}", {
      headers: { "content-type": "application/json" },
    });
    expect(withApiHeaders(response).headers.get("content-type")).toContain(
      "json",
    );
  });
  it("apiError matrix 24", async () => {
    const response = apiError("test_error_24", 400, { requestId: "rid-24" });
    const body = await response.json();
    expect(body.ok).toBe(false);
    expect(body.requestId).toBe("rid-24");
  });
  it("apiJson matrix 24", async () => {
    const response = apiJson({ ok: true, value: 24 });
    const body = await response.json();
    expect(body.value).toBe(24);
  });
  it("withApiHeaders matrix 24", () => {
    const response = new Response("{}", {
      headers: { "content-type": "application/json" },
    });
    expect(withApiHeaders(response).headers.get("content-type")).toContain(
      "json",
    );
  });
  it("apiError matrix 25", async () => {
    const response = apiError("test_error_25", 400, { requestId: "rid-25" });
    const body = await response.json();
    expect(body.ok).toBe(false);
    expect(body.requestId).toBe("rid-25");
  });
  it("apiJson matrix 25", async () => {
    const response = apiJson({ ok: true, value: 25 });
    const body = await response.json();
    expect(body.value).toBe(25);
  });
  it("withApiHeaders matrix 25", () => {
    const response = new Response("{}", {
      headers: { "content-type": "application/json" },
    });
    expect(withApiHeaders(response).headers.get("content-type")).toContain(
      "json",
    );
  });
  it("apiError matrix 26", async () => {
    const response = apiError("test_error_26", 400, { requestId: "rid-26" });
    const body = await response.json();
    expect(body.ok).toBe(false);
    expect(body.requestId).toBe("rid-26");
  });
  it("apiJson matrix 26", async () => {
    const response = apiJson({ ok: true, value: 26 });
    const body = await response.json();
    expect(body.value).toBe(26);
  });
  it("withApiHeaders matrix 26", () => {
    const response = new Response("{}", {
      headers: { "content-type": "application/json" },
    });
    expect(withApiHeaders(response).headers.get("content-type")).toContain(
      "json",
    );
  });
  it("apiError matrix 27", async () => {
    const response = apiError("test_error_27", 400, { requestId: "rid-27" });
    const body = await response.json();
    expect(body.ok).toBe(false);
    expect(body.requestId).toBe("rid-27");
  });
  it("apiJson matrix 27", async () => {
    const response = apiJson({ ok: true, value: 27 });
    const body = await response.json();
    expect(body.value).toBe(27);
  });
  it("withApiHeaders matrix 27", () => {
    const response = new Response("{}", {
      headers: { "content-type": "application/json" },
    });
    expect(withApiHeaders(response).headers.get("content-type")).toContain(
      "json",
    );
  });
  it("apiError matrix 28", async () => {
    const response = apiError("test_error_28", 400, { requestId: "rid-28" });
    const body = await response.json();
    expect(body.ok).toBe(false);
    expect(body.requestId).toBe("rid-28");
  });
  it("apiJson matrix 28", async () => {
    const response = apiJson({ ok: true, value: 28 });
    const body = await response.json();
    expect(body.value).toBe(28);
  });
  it("withApiHeaders matrix 28", () => {
    const response = new Response("{}", {
      headers: { "content-type": "application/json" },
    });
    expect(withApiHeaders(response).headers.get("content-type")).toContain(
      "json",
    );
  });
  it("apiError matrix 29", async () => {
    const response = apiError("test_error_29", 400, { requestId: "rid-29" });
    const body = await response.json();
    expect(body.ok).toBe(false);
    expect(body.requestId).toBe("rid-29");
  });
  it("apiJson matrix 29", async () => {
    const response = apiJson({ ok: true, value: 29 });
    const body = await response.json();
    expect(body.value).toBe(29);
  });
  it("withApiHeaders matrix 29", () => {
    const response = new Response("{}", {
      headers: { "content-type": "application/json" },
    });
    expect(withApiHeaders(response).headers.get("content-type")).toContain(
      "json",
    );
  });
  it("apiError matrix 30", async () => {
    const response = apiError("test_error_30", 400, { requestId: "rid-30" });
    const body = await response.json();
    expect(body.ok).toBe(false);
    expect(body.requestId).toBe("rid-30");
  });
  it("apiJson matrix 30", async () => {
    const response = apiJson({ ok: true, value: 30 });
    const body = await response.json();
    expect(body.value).toBe(30);
  });
  it("withApiHeaders matrix 30", () => {
    const response = new Response("{}", {
      headers: { "content-type": "application/json" },
    });
    expect(withApiHeaders(response).headers.get("content-type")).toContain(
      "json",
    );
  });
  it("apiError matrix 31", async () => {
    const response = apiError("test_error_31", 400, { requestId: "rid-31" });
    const body = await response.json();
    expect(body.ok).toBe(false);
    expect(body.requestId).toBe("rid-31");
  });
  it("apiJson matrix 31", async () => {
    const response = apiJson({ ok: true, value: 31 });
    const body = await response.json();
    expect(body.value).toBe(31);
  });
  it("withApiHeaders matrix 31", () => {
    const response = new Response("{}", {
      headers: { "content-type": "application/json" },
    });
    expect(withApiHeaders(response).headers.get("content-type")).toContain(
      "json",
    );
  });
  it("apiError matrix 32", async () => {
    const response = apiError("test_error_32", 400, { requestId: "rid-32" });
    const body = await response.json();
    expect(body.ok).toBe(false);
    expect(body.requestId).toBe("rid-32");
  });
  it("apiJson matrix 32", async () => {
    const response = apiJson({ ok: true, value: 32 });
    const body = await response.json();
    expect(body.value).toBe(32);
  });
  it("withApiHeaders matrix 32", () => {
    const response = new Response("{}", {
      headers: { "content-type": "application/json" },
    });
    expect(withApiHeaders(response).headers.get("content-type")).toContain(
      "json",
    );
  });
  it("apiError matrix 33", async () => {
    const response = apiError("test_error_33", 400, { requestId: "rid-33" });
    const body = await response.json();
    expect(body.ok).toBe(false);
    expect(body.requestId).toBe("rid-33");
  });
  it("apiJson matrix 33", async () => {
    const response = apiJson({ ok: true, value: 33 });
    const body = await response.json();
    expect(body.value).toBe(33);
  });
  it("withApiHeaders matrix 33", () => {
    const response = new Response("{}", {
      headers: { "content-type": "application/json" },
    });
    expect(withApiHeaders(response).headers.get("content-type")).toContain(
      "json",
    );
  });
  it("apiError matrix 34", async () => {
    const response = apiError("test_error_34", 400, { requestId: "rid-34" });
    const body = await response.json();
    expect(body.ok).toBe(false);
    expect(body.requestId).toBe("rid-34");
  });
  it("apiJson matrix 34", async () => {
    const response = apiJson({ ok: true, value: 34 });
    const body = await response.json();
    expect(body.value).toBe(34);
  });
  it("withApiHeaders matrix 34", () => {
    const response = new Response("{}", {
      headers: { "content-type": "application/json" },
    });
    expect(withApiHeaders(response).headers.get("content-type")).toContain(
      "json",
    );
  });
  it("apiError matrix 35", async () => {
    const response = apiError("test_error_35", 400, { requestId: "rid-35" });
    const body = await response.json();
    expect(body.ok).toBe(false);
    expect(body.requestId).toBe("rid-35");
  });
  it("apiJson matrix 35", async () => {
    const response = apiJson({ ok: true, value: 35 });
    const body = await response.json();
    expect(body.value).toBe(35);
  });
  it("withApiHeaders matrix 35", () => {
    const response = new Response("{}", {
      headers: { "content-type": "application/json" },
    });
    expect(withApiHeaders(response).headers.get("content-type")).toContain(
      "json",
    );
  });
  it("apiError matrix 36", async () => {
    const response = apiError("test_error_36", 400, { requestId: "rid-36" });
    const body = await response.json();
    expect(body.ok).toBe(false);
    expect(body.requestId).toBe("rid-36");
  });
  it("apiJson matrix 36", async () => {
    const response = apiJson({ ok: true, value: 36 });
    const body = await response.json();
    expect(body.value).toBe(36);
  });
  it("withApiHeaders matrix 36", () => {
    const response = new Response("{}", {
      headers: { "content-type": "application/json" },
    });
    expect(withApiHeaders(response).headers.get("content-type")).toContain(
      "json",
    );
  });
  it("apiError matrix 37", async () => {
    const response = apiError("test_error_37", 400, { requestId: "rid-37" });
    const body = await response.json();
    expect(body.ok).toBe(false);
    expect(body.requestId).toBe("rid-37");
  });
  it("apiJson matrix 37", async () => {
    const response = apiJson({ ok: true, value: 37 });
    const body = await response.json();
    expect(body.value).toBe(37);
  });
  it("withApiHeaders matrix 37", () => {
    const response = new Response("{}", {
      headers: { "content-type": "application/json" },
    });
    expect(withApiHeaders(response).headers.get("content-type")).toContain(
      "json",
    );
  });
  it("apiError matrix 38", async () => {
    const response = apiError("test_error_38", 400, { requestId: "rid-38" });
    const body = await response.json();
    expect(body.ok).toBe(false);
    expect(body.requestId).toBe("rid-38");
  });
  it("apiJson matrix 38", async () => {
    const response = apiJson({ ok: true, value: 38 });
    const body = await response.json();
    expect(body.value).toBe(38);
  });
  it("withApiHeaders matrix 38", () => {
    const response = new Response("{}", {
      headers: { "content-type": "application/json" },
    });
    expect(withApiHeaders(response).headers.get("content-type")).toContain(
      "json",
    );
  });
  it("apiError matrix 39", async () => {
    const response = apiError("test_error_39", 400, { requestId: "rid-39" });
    const body = await response.json();
    expect(body.ok).toBe(false);
    expect(body.requestId).toBe("rid-39");
  });
  it("apiJson matrix 39", async () => {
    const response = apiJson({ ok: true, value: 39 });
    const body = await response.json();
    expect(body.value).toBe(39);
  });
  it("withApiHeaders matrix 39", () => {
    const response = new Response("{}", {
      headers: { "content-type": "application/json" },
    });
    expect(withApiHeaders(response).headers.get("content-type")).toContain(
      "json",
    );
  });
  it("apiError matrix 40", async () => {
    const response = apiError("test_error_40", 400, { requestId: "rid-40" });
    const body = await response.json();
    expect(body.ok).toBe(false);
    expect(body.requestId).toBe("rid-40");
  });
  it("apiJson matrix 40", async () => {
    const response = apiJson({ ok: true, value: 40 });
    const body = await response.json();
    expect(body.value).toBe(40);
  });
  it("withApiHeaders matrix 40", () => {
    const response = new Response("{}", {
      headers: { "content-type": "application/json" },
    });
    expect(withApiHeaders(response).headers.get("content-type")).toContain(
      "json",
    );
  });
  it("apiError matrix 41", async () => {
    const response = apiError("test_error_41", 400, { requestId: "rid-41" });
    const body = await response.json();
    expect(body.ok).toBe(false);
    expect(body.requestId).toBe("rid-41");
  });
  it("apiJson matrix 41", async () => {
    const response = apiJson({ ok: true, value: 41 });
    const body = await response.json();
    expect(body.value).toBe(41);
  });
  it("withApiHeaders matrix 41", () => {
    const response = new Response("{}", {
      headers: { "content-type": "application/json" },
    });
    expect(withApiHeaders(response).headers.get("content-type")).toContain(
      "json",
    );
  });
  it("apiError matrix 42", async () => {
    const response = apiError("test_error_42", 400, { requestId: "rid-42" });
    const body = await response.json();
    expect(body.ok).toBe(false);
    expect(body.requestId).toBe("rid-42");
  });
  it("apiJson matrix 42", async () => {
    const response = apiJson({ ok: true, value: 42 });
    const body = await response.json();
    expect(body.value).toBe(42);
  });
  it("withApiHeaders matrix 42", () => {
    const response = new Response("{}", {
      headers: { "content-type": "application/json" },
    });
    expect(withApiHeaders(response).headers.get("content-type")).toContain(
      "json",
    );
  });
  it("apiError matrix 43", async () => {
    const response = apiError("test_error_43", 400, { requestId: "rid-43" });
    const body = await response.json();
    expect(body.ok).toBe(false);
    expect(body.requestId).toBe("rid-43");
  });
  it("apiJson matrix 43", async () => {
    const response = apiJson({ ok: true, value: 43 });
    const body = await response.json();
    expect(body.value).toBe(43);
  });
  it("withApiHeaders matrix 43", () => {
    const response = new Response("{}", {
      headers: { "content-type": "application/json" },
    });
    expect(withApiHeaders(response).headers.get("content-type")).toContain(
      "json",
    );
  });
  it("apiError matrix 44", async () => {
    const response = apiError("test_error_44", 400, { requestId: "rid-44" });
    const body = await response.json();
    expect(body.ok).toBe(false);
    expect(body.requestId).toBe("rid-44");
  });
  it("apiJson matrix 44", async () => {
    const response = apiJson({ ok: true, value: 44 });
    const body = await response.json();
    expect(body.value).toBe(44);
  });
  it("withApiHeaders matrix 44", () => {
    const response = new Response("{}", {
      headers: { "content-type": "application/json" },
    });
    expect(withApiHeaders(response).headers.get("content-type")).toContain(
      "json",
    );
  });
  it("apiError matrix 45", async () => {
    const response = apiError("test_error_45", 400, { requestId: "rid-45" });
    const body = await response.json();
    expect(body.ok).toBe(false);
    expect(body.requestId).toBe("rid-45");
  });
  it("apiJson matrix 45", async () => {
    const response = apiJson({ ok: true, value: 45 });
    const body = await response.json();
    expect(body.value).toBe(45);
  });
  it("withApiHeaders matrix 45", () => {
    const response = new Response("{}", {
      headers: { "content-type": "application/json" },
    });
    expect(withApiHeaders(response).headers.get("content-type")).toContain(
      "json",
    );
  });
  it("apiError matrix 46", async () => {
    const response = apiError("test_error_46", 400, { requestId: "rid-46" });
    const body = await response.json();
    expect(body.ok).toBe(false);
    expect(body.requestId).toBe("rid-46");
  });
  it("apiJson matrix 46", async () => {
    const response = apiJson({ ok: true, value: 46 });
    const body = await response.json();
    expect(body.value).toBe(46);
  });
  it("withApiHeaders matrix 46", () => {
    const response = new Response("{}", {
      headers: { "content-type": "application/json" },
    });
    expect(withApiHeaders(response).headers.get("content-type")).toContain(
      "json",
    );
  });
  it("apiError matrix 47", async () => {
    const response = apiError("test_error_47", 400, { requestId: "rid-47" });
    const body = await response.json();
    expect(body.ok).toBe(false);
    expect(body.requestId).toBe("rid-47");
  });
  it("apiJson matrix 47", async () => {
    const response = apiJson({ ok: true, value: 47 });
    const body = await response.json();
    expect(body.value).toBe(47);
  });
  it("withApiHeaders matrix 47", () => {
    const response = new Response("{}", {
      headers: { "content-type": "application/json" },
    });
    expect(withApiHeaders(response).headers.get("content-type")).toContain(
      "json",
    );
  });
  it("apiError matrix 48", async () => {
    const response = apiError("test_error_48", 400, { requestId: "rid-48" });
    const body = await response.json();
    expect(body.ok).toBe(false);
    expect(body.requestId).toBe("rid-48");
  });
  it("apiJson matrix 48", async () => {
    const response = apiJson({ ok: true, value: 48 });
    const body = await response.json();
    expect(body.value).toBe(48);
  });
  it("withApiHeaders matrix 48", () => {
    const response = new Response("{}", {
      headers: { "content-type": "application/json" },
    });
    expect(withApiHeaders(response).headers.get("content-type")).toContain(
      "json",
    );
  });
  it("apiError matrix 49", async () => {
    const response = apiError("test_error_49", 400, { requestId: "rid-49" });
    const body = await response.json();
    expect(body.ok).toBe(false);
    expect(body.requestId).toBe("rid-49");
  });
  it("apiJson matrix 49", async () => {
    const response = apiJson({ ok: true, value: 49 });
    const body = await response.json();
    expect(body.value).toBe(49);
  });
  it("withApiHeaders matrix 49", () => {
    const response = new Response("{}", {
      headers: { "content-type": "application/json" },
    });
    expect(withApiHeaders(response).headers.get("content-type")).toContain(
      "json",
    );
  });
});

describe("router-lib parseRequest", () => {
  it("parses query schema", async () => {
    const route = getApiRouteDefinition("registry.search");
    const request = new Request(
      "https://example.com/api/registry/search?q=test&limit=5",
    );
    const parsed = await parseRequest(route, request);
    expect((parsed.query as { q: string }).q).toBe("test");
  });
  it("parseRequest matrix 0", async () => {
    const route = getApiRouteDefinition("registry.search");
    const request = new Request(
      "https://example.com/api/registry/search?q=matrix0&limit=1",
    );
    const parsed = await parseRequest(route, request);
    expect((parsed.query as { q: string }).q).toBe("matrix0");
  });
  it("enforceApiRateLimit matrix 0", async () => {
    const route = getApiRouteDefinition("registry.search");
    const request = new Request("https://example.com/api/registry/search?i=0");
    const limited = await enforceApiRateLimit(route, request);
    expect(typeof limited).toBe("boolean");
  });
  it("parseRequest matrix 1", async () => {
    const route = getApiRouteDefinition("registry.search");
    const request = new Request(
      "https://example.com/api/registry/search?q=matrix1&limit=2",
    );
    const parsed = await parseRequest(route, request);
    expect((parsed.query as { q: string }).q).toBe("matrix1");
  });
  it("enforceApiRateLimit matrix 1", async () => {
    const route = getApiRouteDefinition("registry.search");
    const request = new Request("https://example.com/api/registry/search?i=1");
    const limited = await enforceApiRateLimit(route, request);
    expect(typeof limited).toBe("boolean");
  });
  it("parseRequest matrix 2", async () => {
    const route = getApiRouteDefinition("registry.search");
    const request = new Request(
      "https://example.com/api/registry/search?q=matrix2&limit=3",
    );
    const parsed = await parseRequest(route, request);
    expect((parsed.query as { q: string }).q).toBe("matrix2");
  });
  it("enforceApiRateLimit matrix 2", async () => {
    const route = getApiRouteDefinition("registry.search");
    const request = new Request("https://example.com/api/registry/search?i=2");
    const limited = await enforceApiRateLimit(route, request);
    expect(typeof limited).toBe("boolean");
  });
  it("parseRequest matrix 3", async () => {
    const route = getApiRouteDefinition("registry.search");
    const request = new Request(
      "https://example.com/api/registry/search?q=matrix3&limit=4",
    );
    const parsed = await parseRequest(route, request);
    expect((parsed.query as { q: string }).q).toBe("matrix3");
  });
  it("enforceApiRateLimit matrix 3", async () => {
    const route = getApiRouteDefinition("registry.search");
    const request = new Request("https://example.com/api/registry/search?i=3");
    const limited = await enforceApiRateLimit(route, request);
    expect(typeof limited).toBe("boolean");
  });
  it("parseRequest matrix 4", async () => {
    const route = getApiRouteDefinition("registry.search");
    const request = new Request(
      "https://example.com/api/registry/search?q=matrix4&limit=5",
    );
    const parsed = await parseRequest(route, request);
    expect((parsed.query as { q: string }).q).toBe("matrix4");
  });
  it("enforceApiRateLimit matrix 4", async () => {
    const route = getApiRouteDefinition("registry.search");
    const request = new Request("https://example.com/api/registry/search?i=4");
    const limited = await enforceApiRateLimit(route, request);
    expect(typeof limited).toBe("boolean");
  });
  it("parseRequest matrix 5", async () => {
    const route = getApiRouteDefinition("registry.search");
    const request = new Request(
      "https://example.com/api/registry/search?q=matrix5&limit=6",
    );
    const parsed = await parseRequest(route, request);
    expect((parsed.query as { q: string }).q).toBe("matrix5");
  });
  it("enforceApiRateLimit matrix 5", async () => {
    const route = getApiRouteDefinition("registry.search");
    const request = new Request("https://example.com/api/registry/search?i=5");
    const limited = await enforceApiRateLimit(route, request);
    expect(typeof limited).toBe("boolean");
  });
  it("parseRequest matrix 6", async () => {
    const route = getApiRouteDefinition("registry.search");
    const request = new Request(
      "https://example.com/api/registry/search?q=matrix6&limit=7",
    );
    const parsed = await parseRequest(route, request);
    expect((parsed.query as { q: string }).q).toBe("matrix6");
  });
  it("enforceApiRateLimit matrix 6", async () => {
    const route = getApiRouteDefinition("registry.search");
    const request = new Request("https://example.com/api/registry/search?i=6");
    const limited = await enforceApiRateLimit(route, request);
    expect(typeof limited).toBe("boolean");
  });
  it("parseRequest matrix 7", async () => {
    const route = getApiRouteDefinition("registry.search");
    const request = new Request(
      "https://example.com/api/registry/search?q=matrix7&limit=8",
    );
    const parsed = await parseRequest(route, request);
    expect((parsed.query as { q: string }).q).toBe("matrix7");
  });
  it("enforceApiRateLimit matrix 7", async () => {
    const route = getApiRouteDefinition("registry.search");
    const request = new Request("https://example.com/api/registry/search?i=7");
    const limited = await enforceApiRateLimit(route, request);
    expect(typeof limited).toBe("boolean");
  });
  it("parseRequest matrix 8", async () => {
    const route = getApiRouteDefinition("registry.search");
    const request = new Request(
      "https://example.com/api/registry/search?q=matrix8&limit=9",
    );
    const parsed = await parseRequest(route, request);
    expect((parsed.query as { q: string }).q).toBe("matrix8");
  });
  it("enforceApiRateLimit matrix 8", async () => {
    const route = getApiRouteDefinition("registry.search");
    const request = new Request("https://example.com/api/registry/search?i=8");
    const limited = await enforceApiRateLimit(route, request);
    expect(typeof limited).toBe("boolean");
  });
  it("parseRequest matrix 9", async () => {
    const route = getApiRouteDefinition("registry.search");
    const request = new Request(
      "https://example.com/api/registry/search?q=matrix9&limit=10",
    );
    const parsed = await parseRequest(route, request);
    expect((parsed.query as { q: string }).q).toBe("matrix9");
  });
  it("enforceApiRateLimit matrix 9", async () => {
    const route = getApiRouteDefinition("registry.search");
    const request = new Request("https://example.com/api/registry/search?i=9");
    const limited = await enforceApiRateLimit(route, request);
    expect(typeof limited).toBe("boolean");
  });
  it("parseRequest matrix 10", async () => {
    const route = getApiRouteDefinition("registry.search");
    const request = new Request(
      "https://example.com/api/registry/search?q=matrix10&limit=11",
    );
    const parsed = await parseRequest(route, request);
    expect((parsed.query as { q: string }).q).toBe("matrix10");
  });
  it("enforceApiRateLimit matrix 10", async () => {
    const route = getApiRouteDefinition("registry.search");
    const request = new Request("https://example.com/api/registry/search?i=10");
    const limited = await enforceApiRateLimit(route, request);
    expect(typeof limited).toBe("boolean");
  });
  it("parseRequest matrix 11", async () => {
    const route = getApiRouteDefinition("registry.search");
    const request = new Request(
      "https://example.com/api/registry/search?q=matrix11&limit=12",
    );
    const parsed = await parseRequest(route, request);
    expect((parsed.query as { q: string }).q).toBe("matrix11");
  });
  it("enforceApiRateLimit matrix 11", async () => {
    const route = getApiRouteDefinition("registry.search");
    const request = new Request("https://example.com/api/registry/search?i=11");
    const limited = await enforceApiRateLimit(route, request);
    expect(typeof limited).toBe("boolean");
  });
  it("parseRequest matrix 12", async () => {
    const route = getApiRouteDefinition("registry.search");
    const request = new Request(
      "https://example.com/api/registry/search?q=matrix12&limit=13",
    );
    const parsed = await parseRequest(route, request);
    expect((parsed.query as { q: string }).q).toBe("matrix12");
  });
  it("enforceApiRateLimit matrix 12", async () => {
    const route = getApiRouteDefinition("registry.search");
    const request = new Request("https://example.com/api/registry/search?i=12");
    const limited = await enforceApiRateLimit(route, request);
    expect(typeof limited).toBe("boolean");
  });
  it("parseRequest matrix 13", async () => {
    const route = getApiRouteDefinition("registry.search");
    const request = new Request(
      "https://example.com/api/registry/search?q=matrix13&limit=14",
    );
    const parsed = await parseRequest(route, request);
    expect((parsed.query as { q: string }).q).toBe("matrix13");
  });
  it("enforceApiRateLimit matrix 13", async () => {
    const route = getApiRouteDefinition("registry.search");
    const request = new Request("https://example.com/api/registry/search?i=13");
    const limited = await enforceApiRateLimit(route, request);
    expect(typeof limited).toBe("boolean");
  });
  it("parseRequest matrix 14", async () => {
    const route = getApiRouteDefinition("registry.search");
    const request = new Request(
      "https://example.com/api/registry/search?q=matrix14&limit=15",
    );
    const parsed = await parseRequest(route, request);
    expect((parsed.query as { q: string }).q).toBe("matrix14");
  });
  it("enforceApiRateLimit matrix 14", async () => {
    const route = getApiRouteDefinition("registry.search");
    const request = new Request("https://example.com/api/registry/search?i=14");
    const limited = await enforceApiRateLimit(route, request);
    expect(typeof limited).toBe("boolean");
  });
  it("parseRequest matrix 15", async () => {
    const route = getApiRouteDefinition("registry.search");
    const request = new Request(
      "https://example.com/api/registry/search?q=matrix15&limit=16",
    );
    const parsed = await parseRequest(route, request);
    expect((parsed.query as { q: string }).q).toBe("matrix15");
  });
  it("enforceApiRateLimit matrix 15", async () => {
    const route = getApiRouteDefinition("registry.search");
    const request = new Request("https://example.com/api/registry/search?i=15");
    const limited = await enforceApiRateLimit(route, request);
    expect(typeof limited).toBe("boolean");
  });
  it("parseRequest matrix 16", async () => {
    const route = getApiRouteDefinition("registry.search");
    const request = new Request(
      "https://example.com/api/registry/search?q=matrix16&limit=17",
    );
    const parsed = await parseRequest(route, request);
    expect((parsed.query as { q: string }).q).toBe("matrix16");
  });
  it("enforceApiRateLimit matrix 16", async () => {
    const route = getApiRouteDefinition("registry.search");
    const request = new Request("https://example.com/api/registry/search?i=16");
    const limited = await enforceApiRateLimit(route, request);
    expect(typeof limited).toBe("boolean");
  });
  it("parseRequest matrix 17", async () => {
    const route = getApiRouteDefinition("registry.search");
    const request = new Request(
      "https://example.com/api/registry/search?q=matrix17&limit=18",
    );
    const parsed = await parseRequest(route, request);
    expect((parsed.query as { q: string }).q).toBe("matrix17");
  });
  it("enforceApiRateLimit matrix 17", async () => {
    const route = getApiRouteDefinition("registry.search");
    const request = new Request("https://example.com/api/registry/search?i=17");
    const limited = await enforceApiRateLimit(route, request);
    expect(typeof limited).toBe("boolean");
  });
  it("parseRequest matrix 18", async () => {
    const route = getApiRouteDefinition("registry.search");
    const request = new Request(
      "https://example.com/api/registry/search?q=matrix18&limit=19",
    );
    const parsed = await parseRequest(route, request);
    expect((parsed.query as { q: string }).q).toBe("matrix18");
  });
  it("enforceApiRateLimit matrix 18", async () => {
    const route = getApiRouteDefinition("registry.search");
    const request = new Request("https://example.com/api/registry/search?i=18");
    const limited = await enforceApiRateLimit(route, request);
    expect(typeof limited).toBe("boolean");
  });
  it("parseRequest matrix 19", async () => {
    const route = getApiRouteDefinition("registry.search");
    const request = new Request(
      "https://example.com/api/registry/search?q=matrix19&limit=20",
    );
    const parsed = await parseRequest(route, request);
    expect((parsed.query as { q: string }).q).toBe("matrix19");
  });
  it("enforceApiRateLimit matrix 19", async () => {
    const route = getApiRouteDefinition("registry.search");
    const request = new Request("https://example.com/api/registry/search?i=19");
    const limited = await enforceApiRateLimit(route, request);
    expect(typeof limited).toBe("boolean");
  });
  it("parseRequest matrix 20", async () => {
    const route = getApiRouteDefinition("registry.search");
    const request = new Request(
      "https://example.com/api/registry/search?q=matrix20&limit=1",
    );
    const parsed = await parseRequest(route, request);
    expect((parsed.query as { q: string }).q).toBe("matrix20");
  });
  it("enforceApiRateLimit matrix 20", async () => {
    const route = getApiRouteDefinition("registry.search");
    const request = new Request("https://example.com/api/registry/search?i=20");
    const limited = await enforceApiRateLimit(route, request);
    expect(typeof limited).toBe("boolean");
  });
  it("parseRequest matrix 21", async () => {
    const route = getApiRouteDefinition("registry.search");
    const request = new Request(
      "https://example.com/api/registry/search?q=matrix21&limit=2",
    );
    const parsed = await parseRequest(route, request);
    expect((parsed.query as { q: string }).q).toBe("matrix21");
  });
  it("enforceApiRateLimit matrix 21", async () => {
    const route = getApiRouteDefinition("registry.search");
    const request = new Request("https://example.com/api/registry/search?i=21");
    const limited = await enforceApiRateLimit(route, request);
    expect(typeof limited).toBe("boolean");
  });
  it("parseRequest matrix 22", async () => {
    const route = getApiRouteDefinition("registry.search");
    const request = new Request(
      "https://example.com/api/registry/search?q=matrix22&limit=3",
    );
    const parsed = await parseRequest(route, request);
    expect((parsed.query as { q: string }).q).toBe("matrix22");
  });
  it("enforceApiRateLimit matrix 22", async () => {
    const route = getApiRouteDefinition("registry.search");
    const request = new Request("https://example.com/api/registry/search?i=22");
    const limited = await enforceApiRateLimit(route, request);
    expect(typeof limited).toBe("boolean");
  });
  it("parseRequest matrix 23", async () => {
    const route = getApiRouteDefinition("registry.search");
    const request = new Request(
      "https://example.com/api/registry/search?q=matrix23&limit=4",
    );
    const parsed = await parseRequest(route, request);
    expect((parsed.query as { q: string }).q).toBe("matrix23");
  });
  it("enforceApiRateLimit matrix 23", async () => {
    const route = getApiRouteDefinition("registry.search");
    const request = new Request("https://example.com/api/registry/search?i=23");
    const limited = await enforceApiRateLimit(route, request);
    expect(typeof limited).toBe("boolean");
  });
  it("parseRequest matrix 24", async () => {
    const route = getApiRouteDefinition("registry.search");
    const request = new Request(
      "https://example.com/api/registry/search?q=matrix24&limit=5",
    );
    const parsed = await parseRequest(route, request);
    expect((parsed.query as { q: string }).q).toBe("matrix24");
  });
  it("enforceApiRateLimit matrix 24", async () => {
    const route = getApiRouteDefinition("registry.search");
    const request = new Request("https://example.com/api/registry/search?i=24");
    const limited = await enforceApiRateLimit(route, request);
    expect(typeof limited).toBe("boolean");
  });
  it("parseRequest matrix 25", async () => {
    const route = getApiRouteDefinition("registry.search");
    const request = new Request(
      "https://example.com/api/registry/search?q=matrix25&limit=6",
    );
    const parsed = await parseRequest(route, request);
    expect((parsed.query as { q: string }).q).toBe("matrix25");
  });
  it("enforceApiRateLimit matrix 25", async () => {
    const route = getApiRouteDefinition("registry.search");
    const request = new Request("https://example.com/api/registry/search?i=25");
    const limited = await enforceApiRateLimit(route, request);
    expect(typeof limited).toBe("boolean");
  });
  it("parseRequest matrix 26", async () => {
    const route = getApiRouteDefinition("registry.search");
    const request = new Request(
      "https://example.com/api/registry/search?q=matrix26&limit=7",
    );
    const parsed = await parseRequest(route, request);
    expect((parsed.query as { q: string }).q).toBe("matrix26");
  });
  it("enforceApiRateLimit matrix 26", async () => {
    const route = getApiRouteDefinition("registry.search");
    const request = new Request("https://example.com/api/registry/search?i=26");
    const limited = await enforceApiRateLimit(route, request);
    expect(typeof limited).toBe("boolean");
  });
  it("parseRequest matrix 27", async () => {
    const route = getApiRouteDefinition("registry.search");
    const request = new Request(
      "https://example.com/api/registry/search?q=matrix27&limit=8",
    );
    const parsed = await parseRequest(route, request);
    expect((parsed.query as { q: string }).q).toBe("matrix27");
  });
  it("enforceApiRateLimit matrix 27", async () => {
    const route = getApiRouteDefinition("registry.search");
    const request = new Request("https://example.com/api/registry/search?i=27");
    const limited = await enforceApiRateLimit(route, request);
    expect(typeof limited).toBe("boolean");
  });
  it("parseRequest matrix 28", async () => {
    const route = getApiRouteDefinition("registry.search");
    const request = new Request(
      "https://example.com/api/registry/search?q=matrix28&limit=9",
    );
    const parsed = await parseRequest(route, request);
    expect((parsed.query as { q: string }).q).toBe("matrix28");
  });
  it("enforceApiRateLimit matrix 28", async () => {
    const route = getApiRouteDefinition("registry.search");
    const request = new Request("https://example.com/api/registry/search?i=28");
    const limited = await enforceApiRateLimit(route, request);
    expect(typeof limited).toBe("boolean");
  });
  it("parseRequest matrix 29", async () => {
    const route = getApiRouteDefinition("registry.search");
    const request = new Request(
      "https://example.com/api/registry/search?q=matrix29&limit=10",
    );
    const parsed = await parseRequest(route, request);
    expect((parsed.query as { q: string }).q).toBe("matrix29");
  });
  it("enforceApiRateLimit matrix 29", async () => {
    const route = getApiRouteDefinition("registry.search");
    const request = new Request("https://example.com/api/registry/search?i=29");
    const limited = await enforceApiRateLimit(route, request);
    expect(typeof limited).toBe("boolean");
  });
  it("parseRequest matrix 30", async () => {
    const route = getApiRouteDefinition("registry.search");
    const request = new Request(
      "https://example.com/api/registry/search?q=matrix30&limit=11",
    );
    const parsed = await parseRequest(route, request);
    expect((parsed.query as { q: string }).q).toBe("matrix30");
  });
  it("enforceApiRateLimit matrix 30", async () => {
    const route = getApiRouteDefinition("registry.search");
    const request = new Request("https://example.com/api/registry/search?i=30");
    const limited = await enforceApiRateLimit(route, request);
    expect(typeof limited).toBe("boolean");
  });
  it("parseRequest matrix 31", async () => {
    const route = getApiRouteDefinition("registry.search");
    const request = new Request(
      "https://example.com/api/registry/search?q=matrix31&limit=12",
    );
    const parsed = await parseRequest(route, request);
    expect((parsed.query as { q: string }).q).toBe("matrix31");
  });
  it("enforceApiRateLimit matrix 31", async () => {
    const route = getApiRouteDefinition("registry.search");
    const request = new Request("https://example.com/api/registry/search?i=31");
    const limited = await enforceApiRateLimit(route, request);
    expect(typeof limited).toBe("boolean");
  });
  it("parseRequest matrix 32", async () => {
    const route = getApiRouteDefinition("registry.search");
    const request = new Request(
      "https://example.com/api/registry/search?q=matrix32&limit=13",
    );
    const parsed = await parseRequest(route, request);
    expect((parsed.query as { q: string }).q).toBe("matrix32");
  });
  it("enforceApiRateLimit matrix 32", async () => {
    const route = getApiRouteDefinition("registry.search");
    const request = new Request("https://example.com/api/registry/search?i=32");
    const limited = await enforceApiRateLimit(route, request);
    expect(typeof limited).toBe("boolean");
  });
  it("parseRequest matrix 33", async () => {
    const route = getApiRouteDefinition("registry.search");
    const request = new Request(
      "https://example.com/api/registry/search?q=matrix33&limit=14",
    );
    const parsed = await parseRequest(route, request);
    expect((parsed.query as { q: string }).q).toBe("matrix33");
  });
  it("enforceApiRateLimit matrix 33", async () => {
    const route = getApiRouteDefinition("registry.search");
    const request = new Request("https://example.com/api/registry/search?i=33");
    const limited = await enforceApiRateLimit(route, request);
    expect(typeof limited).toBe("boolean");
  });
  it("parseRequest matrix 34", async () => {
    const route = getApiRouteDefinition("registry.search");
    const request = new Request(
      "https://example.com/api/registry/search?q=matrix34&limit=15",
    );
    const parsed = await parseRequest(route, request);
    expect((parsed.query as { q: string }).q).toBe("matrix34");
  });
  it("enforceApiRateLimit matrix 34", async () => {
    const route = getApiRouteDefinition("registry.search");
    const request = new Request("https://example.com/api/registry/search?i=34");
    const limited = await enforceApiRateLimit(route, request);
    expect(typeof limited).toBe("boolean");
  });
  it("parseRequest matrix 35", async () => {
    const route = getApiRouteDefinition("registry.search");
    const request = new Request(
      "https://example.com/api/registry/search?q=matrix35&limit=16",
    );
    const parsed = await parseRequest(route, request);
    expect((parsed.query as { q: string }).q).toBe("matrix35");
  });
  it("enforceApiRateLimit matrix 35", async () => {
    const route = getApiRouteDefinition("registry.search");
    const request = new Request("https://example.com/api/registry/search?i=35");
    const limited = await enforceApiRateLimit(route, request);
    expect(typeof limited).toBe("boolean");
  });
  it("parseRequest matrix 36", async () => {
    const route = getApiRouteDefinition("registry.search");
    const request = new Request(
      "https://example.com/api/registry/search?q=matrix36&limit=17",
    );
    const parsed = await parseRequest(route, request);
    expect((parsed.query as { q: string }).q).toBe("matrix36");
  });
  it("enforceApiRateLimit matrix 36", async () => {
    const route = getApiRouteDefinition("registry.search");
    const request = new Request("https://example.com/api/registry/search?i=36");
    const limited = await enforceApiRateLimit(route, request);
    expect(typeof limited).toBe("boolean");
  });
  it("parseRequest matrix 37", async () => {
    const route = getApiRouteDefinition("registry.search");
    const request = new Request(
      "https://example.com/api/registry/search?q=matrix37&limit=18",
    );
    const parsed = await parseRequest(route, request);
    expect((parsed.query as { q: string }).q).toBe("matrix37");
  });
  it("enforceApiRateLimit matrix 37", async () => {
    const route = getApiRouteDefinition("registry.search");
    const request = new Request("https://example.com/api/registry/search?i=37");
    const limited = await enforceApiRateLimit(route, request);
    expect(typeof limited).toBe("boolean");
  });
  it("parseRequest matrix 38", async () => {
    const route = getApiRouteDefinition("registry.search");
    const request = new Request(
      "https://example.com/api/registry/search?q=matrix38&limit=19",
    );
    const parsed = await parseRequest(route, request);
    expect((parsed.query as { q: string }).q).toBe("matrix38");
  });
  it("enforceApiRateLimit matrix 38", async () => {
    const route = getApiRouteDefinition("registry.search");
    const request = new Request("https://example.com/api/registry/search?i=38");
    const limited = await enforceApiRateLimit(route, request);
    expect(typeof limited).toBe("boolean");
  });
  it("parseRequest matrix 39", async () => {
    const route = getApiRouteDefinition("registry.search");
    const request = new Request(
      "https://example.com/api/registry/search?q=matrix39&limit=20",
    );
    const parsed = await parseRequest(route, request);
    expect((parsed.query as { q: string }).q).toBe("matrix39");
  });
  it("enforceApiRateLimit matrix 39", async () => {
    const route = getApiRouteDefinition("registry.search");
    const request = new Request("https://example.com/api/registry/search?i=39");
    const limited = await enforceApiRateLimit(route, request);
    expect(typeof limited).toBe("boolean");
  });
  it("parseRequest matrix 40", async () => {
    const route = getApiRouteDefinition("registry.search");
    const request = new Request(
      "https://example.com/api/registry/search?q=matrix40&limit=1",
    );
    const parsed = await parseRequest(route, request);
    expect((parsed.query as { q: string }).q).toBe("matrix40");
  });
  it("enforceApiRateLimit matrix 40", async () => {
    const route = getApiRouteDefinition("registry.search");
    const request = new Request("https://example.com/api/registry/search?i=40");
    const limited = await enforceApiRateLimit(route, request);
    expect(typeof limited).toBe("boolean");
  });
  it("parseRequest matrix 41", async () => {
    const route = getApiRouteDefinition("registry.search");
    const request = new Request(
      "https://example.com/api/registry/search?q=matrix41&limit=2",
    );
    const parsed = await parseRequest(route, request);
    expect((parsed.query as { q: string }).q).toBe("matrix41");
  });
  it("enforceApiRateLimit matrix 41", async () => {
    const route = getApiRouteDefinition("registry.search");
    const request = new Request("https://example.com/api/registry/search?i=41");
    const limited = await enforceApiRateLimit(route, request);
    expect(typeof limited).toBe("boolean");
  });
  it("parseRequest matrix 42", async () => {
    const route = getApiRouteDefinition("registry.search");
    const request = new Request(
      "https://example.com/api/registry/search?q=matrix42&limit=3",
    );
    const parsed = await parseRequest(route, request);
    expect((parsed.query as { q: string }).q).toBe("matrix42");
  });
  it("enforceApiRateLimit matrix 42", async () => {
    const route = getApiRouteDefinition("registry.search");
    const request = new Request("https://example.com/api/registry/search?i=42");
    const limited = await enforceApiRateLimit(route, request);
    expect(typeof limited).toBe("boolean");
  });
  it("parseRequest matrix 43", async () => {
    const route = getApiRouteDefinition("registry.search");
    const request = new Request(
      "https://example.com/api/registry/search?q=matrix43&limit=4",
    );
    const parsed = await parseRequest(route, request);
    expect((parsed.query as { q: string }).q).toBe("matrix43");
  });
  it("enforceApiRateLimit matrix 43", async () => {
    const route = getApiRouteDefinition("registry.search");
    const request = new Request("https://example.com/api/registry/search?i=43");
    const limited = await enforceApiRateLimit(route, request);
    expect(typeof limited).toBe("boolean");
  });
  it("parseRequest matrix 44", async () => {
    const route = getApiRouteDefinition("registry.search");
    const request = new Request(
      "https://example.com/api/registry/search?q=matrix44&limit=5",
    );
    const parsed = await parseRequest(route, request);
    expect((parsed.query as { q: string }).q).toBe("matrix44");
  });
  it("enforceApiRateLimit matrix 44", async () => {
    const route = getApiRouteDefinition("registry.search");
    const request = new Request("https://example.com/api/registry/search?i=44");
    const limited = await enforceApiRateLimit(route, request);
    expect(typeof limited).toBe("boolean");
  });
  it("parseRequest matrix 45", async () => {
    const route = getApiRouteDefinition("registry.search");
    const request = new Request(
      "https://example.com/api/registry/search?q=matrix45&limit=6",
    );
    const parsed = await parseRequest(route, request);
    expect((parsed.query as { q: string }).q).toBe("matrix45");
  });
  it("enforceApiRateLimit matrix 45", async () => {
    const route = getApiRouteDefinition("registry.search");
    const request = new Request("https://example.com/api/registry/search?i=45");
    const limited = await enforceApiRateLimit(route, request);
    expect(typeof limited).toBe("boolean");
  });
  it("parseRequest matrix 46", async () => {
    const route = getApiRouteDefinition("registry.search");
    const request = new Request(
      "https://example.com/api/registry/search?q=matrix46&limit=7",
    );
    const parsed = await parseRequest(route, request);
    expect((parsed.query as { q: string }).q).toBe("matrix46");
  });
  it("enforceApiRateLimit matrix 46", async () => {
    const route = getApiRouteDefinition("registry.search");
    const request = new Request("https://example.com/api/registry/search?i=46");
    const limited = await enforceApiRateLimit(route, request);
    expect(typeof limited).toBe("boolean");
  });
  it("parseRequest matrix 47", async () => {
    const route = getApiRouteDefinition("registry.search");
    const request = new Request(
      "https://example.com/api/registry/search?q=matrix47&limit=8",
    );
    const parsed = await parseRequest(route, request);
    expect((parsed.query as { q: string }).q).toBe("matrix47");
  });
  it("enforceApiRateLimit matrix 47", async () => {
    const route = getApiRouteDefinition("registry.search");
    const request = new Request("https://example.com/api/registry/search?i=47");
    const limited = await enforceApiRateLimit(route, request);
    expect(typeof limited).toBe("boolean");
  });
  it("parseRequest matrix 48", async () => {
    const route = getApiRouteDefinition("registry.search");
    const request = new Request(
      "https://example.com/api/registry/search?q=matrix48&limit=9",
    );
    const parsed = await parseRequest(route, request);
    expect((parsed.query as { q: string }).q).toBe("matrix48");
  });
  it("enforceApiRateLimit matrix 48", async () => {
    const route = getApiRouteDefinition("registry.search");
    const request = new Request("https://example.com/api/registry/search?i=48");
    const limited = await enforceApiRateLimit(route, request);
    expect(typeof limited).toBe("boolean");
  });
  it("parseRequest matrix 49", async () => {
    const route = getApiRouteDefinition("registry.search");
    const request = new Request(
      "https://example.com/api/registry/search?q=matrix49&limit=10",
    );
    const parsed = await parseRequest(route, request);
    expect((parsed.query as { q: string }).q).toBe("matrix49");
  });
  it("enforceApiRateLimit matrix 49", async () => {
    const route = getApiRouteDefinition("registry.search");
    const request = new Request("https://example.com/api/registry/search?i=49");
    const limited = await enforceApiRateLimit(route, request);
    expect(typeof limited).toBe("boolean");
  });
});
