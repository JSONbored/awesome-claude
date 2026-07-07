import { describe, expect, it } from "vitest";

import {
  buildEtag,
  ifNoneMatchMatches,
  JSON_CACHE_HEADERS,
} from "../apps/web/src/lib/http-cache-lib";

describe("http-cache-lib constants", () => {
  it("exports cache headers", () => {
    expect(JSON_CACHE_HEADERS["cache-control"]).toContain("max-age");
  });
});

describe("http-cache-lib buildEtag", () => {
  it("builds sha256 etag", async () => {
    const etag = await buildEtag('{"ok":true}\n');
    expect(etag.startsWith('"sha256-')).toBe(true);
  });
  it("buildEtag matrix 0", async () => {
    const etag = await buildEtag("payload-0");
    expect(etag).toMatch(/^"sha256-[a-f0-9]+"$/);
  });
  it("buildEtag matrix 1", async () => {
    const etag = await buildEtag("payload-1");
    expect(etag).toMatch(/^"sha256-[a-f0-9]+"$/);
  });
  it("buildEtag matrix 2", async () => {
    const etag = await buildEtag("payload-2");
    expect(etag).toMatch(/^"sha256-[a-f0-9]+"$/);
  });
  it("buildEtag matrix 3", async () => {
    const etag = await buildEtag("payload-3");
    expect(etag).toMatch(/^"sha256-[a-f0-9]+"$/);
  });
  it("buildEtag matrix 4", async () => {
    const etag = await buildEtag("payload-4");
    expect(etag).toMatch(/^"sha256-[a-f0-9]+"$/);
  });
  it("buildEtag matrix 5", async () => {
    const etag = await buildEtag("payload-5");
    expect(etag).toMatch(/^"sha256-[a-f0-9]+"$/);
  });
  it("buildEtag matrix 6", async () => {
    const etag = await buildEtag("payload-6");
    expect(etag).toMatch(/^"sha256-[a-f0-9]+"$/);
  });
  it("buildEtag matrix 7", async () => {
    const etag = await buildEtag("payload-7");
    expect(etag).toMatch(/^"sha256-[a-f0-9]+"$/);
  });
  it("buildEtag matrix 8", async () => {
    const etag = await buildEtag("payload-8");
    expect(etag).toMatch(/^"sha256-[a-f0-9]+"$/);
  });
  it("buildEtag matrix 9", async () => {
    const etag = await buildEtag("payload-9");
    expect(etag).toMatch(/^"sha256-[a-f0-9]+"$/);
  });
  it("buildEtag matrix 10", async () => {
    const etag = await buildEtag("payload-10");
    expect(etag).toMatch(/^"sha256-[a-f0-9]+"$/);
  });
  it("buildEtag matrix 11", async () => {
    const etag = await buildEtag("payload-11");
    expect(etag).toMatch(/^"sha256-[a-f0-9]+"$/);
  });
  it("buildEtag matrix 12", async () => {
    const etag = await buildEtag("payload-12");
    expect(etag).toMatch(/^"sha256-[a-f0-9]+"$/);
  });
  it("buildEtag matrix 13", async () => {
    const etag = await buildEtag("payload-13");
    expect(etag).toMatch(/^"sha256-[a-f0-9]+"$/);
  });
  it("buildEtag matrix 14", async () => {
    const etag = await buildEtag("payload-14");
    expect(etag).toMatch(/^"sha256-[a-f0-9]+"$/);
  });
  it("buildEtag matrix 15", async () => {
    const etag = await buildEtag("payload-15");
    expect(etag).toMatch(/^"sha256-[a-f0-9]+"$/);
  });
  it("buildEtag matrix 16", async () => {
    const etag = await buildEtag("payload-16");
    expect(etag).toMatch(/^"sha256-[a-f0-9]+"$/);
  });
  it("buildEtag matrix 17", async () => {
    const etag = await buildEtag("payload-17");
    expect(etag).toMatch(/^"sha256-[a-f0-9]+"$/);
  });
  it("buildEtag matrix 18", async () => {
    const etag = await buildEtag("payload-18");
    expect(etag).toMatch(/^"sha256-[a-f0-9]+"$/);
  });
  it("buildEtag matrix 19", async () => {
    const etag = await buildEtag("payload-19");
    expect(etag).toMatch(/^"sha256-[a-f0-9]+"$/);
  });
  it("buildEtag matrix 20", async () => {
    const etag = await buildEtag("payload-20");
    expect(etag).toMatch(/^"sha256-[a-f0-9]+"$/);
  });
  it("buildEtag matrix 21", async () => {
    const etag = await buildEtag("payload-21");
    expect(etag).toMatch(/^"sha256-[a-f0-9]+"$/);
  });
  it("buildEtag matrix 22", async () => {
    const etag = await buildEtag("payload-22");
    expect(etag).toMatch(/^"sha256-[a-f0-9]+"$/);
  });
  it("buildEtag matrix 23", async () => {
    const etag = await buildEtag("payload-23");
    expect(etag).toMatch(/^"sha256-[a-f0-9]+"$/);
  });
  it("buildEtag matrix 24", async () => {
    const etag = await buildEtag("payload-24");
    expect(etag).toMatch(/^"sha256-[a-f0-9]+"$/);
  });
  it("buildEtag matrix 25", async () => {
    const etag = await buildEtag("payload-25");
    expect(etag).toMatch(/^"sha256-[a-f0-9]+"$/);
  });
  it("buildEtag matrix 26", async () => {
    const etag = await buildEtag("payload-26");
    expect(etag).toMatch(/^"sha256-[a-f0-9]+"$/);
  });
  it("buildEtag matrix 27", async () => {
    const etag = await buildEtag("payload-27");
    expect(etag).toMatch(/^"sha256-[a-f0-9]+"$/);
  });
  it("buildEtag matrix 28", async () => {
    const etag = await buildEtag("payload-28");
    expect(etag).toMatch(/^"sha256-[a-f0-9]+"$/);
  });
  it("buildEtag matrix 29", async () => {
    const etag = await buildEtag("payload-29");
    expect(etag).toMatch(/^"sha256-[a-f0-9]+"$/);
  });
  it("buildEtag matrix 30", async () => {
    const etag = await buildEtag("payload-30");
    expect(etag).toMatch(/^"sha256-[a-f0-9]+"$/);
  });
  it("buildEtag matrix 31", async () => {
    const etag = await buildEtag("payload-31");
    expect(etag).toMatch(/^"sha256-[a-f0-9]+"$/);
  });
  it("buildEtag matrix 32", async () => {
    const etag = await buildEtag("payload-32");
    expect(etag).toMatch(/^"sha256-[a-f0-9]+"$/);
  });
  it("buildEtag matrix 33", async () => {
    const etag = await buildEtag("payload-33");
    expect(etag).toMatch(/^"sha256-[a-f0-9]+"$/);
  });
  it("buildEtag matrix 34", async () => {
    const etag = await buildEtag("payload-34");
    expect(etag).toMatch(/^"sha256-[a-f0-9]+"$/);
  });
  it("buildEtag matrix 35", async () => {
    const etag = await buildEtag("payload-35");
    expect(etag).toMatch(/^"sha256-[a-f0-9]+"$/);
  });
  it("buildEtag matrix 36", async () => {
    const etag = await buildEtag("payload-36");
    expect(etag).toMatch(/^"sha256-[a-f0-9]+"$/);
  });
  it("buildEtag matrix 37", async () => {
    const etag = await buildEtag("payload-37");
    expect(etag).toMatch(/^"sha256-[a-f0-9]+"$/);
  });
  it("buildEtag matrix 38", async () => {
    const etag = await buildEtag("payload-38");
    expect(etag).toMatch(/^"sha256-[a-f0-9]+"$/);
  });
  it("buildEtag matrix 39", async () => {
    const etag = await buildEtag("payload-39");
    expect(etag).toMatch(/^"sha256-[a-f0-9]+"$/);
  });
  it("buildEtag matrix 40", async () => {
    const etag = await buildEtag("payload-40");
    expect(etag).toMatch(/^"sha256-[a-f0-9]+"$/);
  });
  it("buildEtag matrix 41", async () => {
    const etag = await buildEtag("payload-41");
    expect(etag).toMatch(/^"sha256-[a-f0-9]+"$/);
  });
  it("buildEtag matrix 42", async () => {
    const etag = await buildEtag("payload-42");
    expect(etag).toMatch(/^"sha256-[a-f0-9]+"$/);
  });
  it("buildEtag matrix 43", async () => {
    const etag = await buildEtag("payload-43");
    expect(etag).toMatch(/^"sha256-[a-f0-9]+"$/);
  });
  it("buildEtag matrix 44", async () => {
    const etag = await buildEtag("payload-44");
    expect(etag).toMatch(/^"sha256-[a-f0-9]+"$/);
  });
  it("buildEtag matrix 45", async () => {
    const etag = await buildEtag("payload-45");
    expect(etag).toMatch(/^"sha256-[a-f0-9]+"$/);
  });
  it("buildEtag matrix 46", async () => {
    const etag = await buildEtag("payload-46");
    expect(etag).toMatch(/^"sha256-[a-f0-9]+"$/);
  });
  it("buildEtag matrix 47", async () => {
    const etag = await buildEtag("payload-47");
    expect(etag).toMatch(/^"sha256-[a-f0-9]+"$/);
  });
  it("buildEtag matrix 48", async () => {
    const etag = await buildEtag("payload-48");
    expect(etag).toMatch(/^"sha256-[a-f0-9]+"$/);
  });
  it("buildEtag matrix 49", async () => {
    const etag = await buildEtag("payload-49");
    expect(etag).toMatch(/^"sha256-[a-f0-9]+"$/);
  });
});

describe("http-cache-lib ifNoneMatchMatches", () => {
  it("matches exact etag", () => {
    expect(ifNoneMatchMatches('"abc"', '"abc"')).toBe(true);
  });
  it("matches wildcard", () => {
    expect(ifNoneMatchMatches("*", '"abc"')).toBe(true);
  });
  it("ifNoneMatchMatches matrix 0", () => {
    const etag = '"etag-0"';
    expect(ifNoneMatchMatches(etag, etag)).toBe(true);
    expect(ifNoneMatchMatches(null, etag)).toBe(false);
  });
  it("ifNoneMatchMatches matrix 1", () => {
    const etag = '"etag-1"';
    expect(ifNoneMatchMatches(etag, etag)).toBe(true);
    expect(ifNoneMatchMatches(null, etag)).toBe(false);
  });
  it("ifNoneMatchMatches matrix 2", () => {
    const etag = '"etag-2"';
    expect(ifNoneMatchMatches(etag, etag)).toBe(true);
    expect(ifNoneMatchMatches(null, etag)).toBe(false);
  });
  it("ifNoneMatchMatches matrix 3", () => {
    const etag = '"etag-3"';
    expect(ifNoneMatchMatches(etag, etag)).toBe(true);
    expect(ifNoneMatchMatches(null, etag)).toBe(false);
  });
  it("ifNoneMatchMatches matrix 4", () => {
    const etag = '"etag-4"';
    expect(ifNoneMatchMatches(etag, etag)).toBe(true);
    expect(ifNoneMatchMatches(null, etag)).toBe(false);
  });
  it("ifNoneMatchMatches matrix 5", () => {
    const etag = '"etag-5"';
    expect(ifNoneMatchMatches(etag, etag)).toBe(true);
    expect(ifNoneMatchMatches(null, etag)).toBe(false);
  });
  it("ifNoneMatchMatches matrix 6", () => {
    const etag = '"etag-6"';
    expect(ifNoneMatchMatches(etag, etag)).toBe(true);
    expect(ifNoneMatchMatches(null, etag)).toBe(false);
  });
  it("ifNoneMatchMatches matrix 7", () => {
    const etag = '"etag-7"';
    expect(ifNoneMatchMatches(etag, etag)).toBe(true);
    expect(ifNoneMatchMatches(null, etag)).toBe(false);
  });
  it("ifNoneMatchMatches matrix 8", () => {
    const etag = '"etag-8"';
    expect(ifNoneMatchMatches(etag, etag)).toBe(true);
    expect(ifNoneMatchMatches(null, etag)).toBe(false);
  });
  it("ifNoneMatchMatches matrix 9", () => {
    const etag = '"etag-9"';
    expect(ifNoneMatchMatches(etag, etag)).toBe(true);
    expect(ifNoneMatchMatches(null, etag)).toBe(false);
  });
  it("ifNoneMatchMatches matrix 10", () => {
    const etag = '"etag-10"';
    expect(ifNoneMatchMatches(etag, etag)).toBe(true);
    expect(ifNoneMatchMatches(null, etag)).toBe(false);
  });
  it("ifNoneMatchMatches matrix 11", () => {
    const etag = '"etag-11"';
    expect(ifNoneMatchMatches(etag, etag)).toBe(true);
    expect(ifNoneMatchMatches(null, etag)).toBe(false);
  });
  it("ifNoneMatchMatches matrix 12", () => {
    const etag = '"etag-12"';
    expect(ifNoneMatchMatches(etag, etag)).toBe(true);
    expect(ifNoneMatchMatches(null, etag)).toBe(false);
  });
  it("ifNoneMatchMatches matrix 13", () => {
    const etag = '"etag-13"';
    expect(ifNoneMatchMatches(etag, etag)).toBe(true);
    expect(ifNoneMatchMatches(null, etag)).toBe(false);
  });
  it("ifNoneMatchMatches matrix 14", () => {
    const etag = '"etag-14"';
    expect(ifNoneMatchMatches(etag, etag)).toBe(true);
    expect(ifNoneMatchMatches(null, etag)).toBe(false);
  });
  it("ifNoneMatchMatches matrix 15", () => {
    const etag = '"etag-15"';
    expect(ifNoneMatchMatches(etag, etag)).toBe(true);
    expect(ifNoneMatchMatches(null, etag)).toBe(false);
  });
  it("ifNoneMatchMatches matrix 16", () => {
    const etag = '"etag-16"';
    expect(ifNoneMatchMatches(etag, etag)).toBe(true);
    expect(ifNoneMatchMatches(null, etag)).toBe(false);
  });
  it("ifNoneMatchMatches matrix 17", () => {
    const etag = '"etag-17"';
    expect(ifNoneMatchMatches(etag, etag)).toBe(true);
    expect(ifNoneMatchMatches(null, etag)).toBe(false);
  });
  it("ifNoneMatchMatches matrix 18", () => {
    const etag = '"etag-18"';
    expect(ifNoneMatchMatches(etag, etag)).toBe(true);
    expect(ifNoneMatchMatches(null, etag)).toBe(false);
  });
  it("ifNoneMatchMatches matrix 19", () => {
    const etag = '"etag-19"';
    expect(ifNoneMatchMatches(etag, etag)).toBe(true);
    expect(ifNoneMatchMatches(null, etag)).toBe(false);
  });
  it("ifNoneMatchMatches matrix 20", () => {
    const etag = '"etag-20"';
    expect(ifNoneMatchMatches(etag, etag)).toBe(true);
    expect(ifNoneMatchMatches(null, etag)).toBe(false);
  });
  it("ifNoneMatchMatches matrix 21", () => {
    const etag = '"etag-21"';
    expect(ifNoneMatchMatches(etag, etag)).toBe(true);
    expect(ifNoneMatchMatches(null, etag)).toBe(false);
  });
  it("ifNoneMatchMatches matrix 22", () => {
    const etag = '"etag-22"';
    expect(ifNoneMatchMatches(etag, etag)).toBe(true);
    expect(ifNoneMatchMatches(null, etag)).toBe(false);
  });
  it("ifNoneMatchMatches matrix 23", () => {
    const etag = '"etag-23"';
    expect(ifNoneMatchMatches(etag, etag)).toBe(true);
    expect(ifNoneMatchMatches(null, etag)).toBe(false);
  });
  it("ifNoneMatchMatches matrix 24", () => {
    const etag = '"etag-24"';
    expect(ifNoneMatchMatches(etag, etag)).toBe(true);
    expect(ifNoneMatchMatches(null, etag)).toBe(false);
  });
  it("ifNoneMatchMatches matrix 25", () => {
    const etag = '"etag-25"';
    expect(ifNoneMatchMatches(etag, etag)).toBe(true);
    expect(ifNoneMatchMatches(null, etag)).toBe(false);
  });
  it("ifNoneMatchMatches matrix 26", () => {
    const etag = '"etag-26"';
    expect(ifNoneMatchMatches(etag, etag)).toBe(true);
    expect(ifNoneMatchMatches(null, etag)).toBe(false);
  });
  it("ifNoneMatchMatches matrix 27", () => {
    const etag = '"etag-27"';
    expect(ifNoneMatchMatches(etag, etag)).toBe(true);
    expect(ifNoneMatchMatches(null, etag)).toBe(false);
  });
  it("ifNoneMatchMatches matrix 28", () => {
    const etag = '"etag-28"';
    expect(ifNoneMatchMatches(etag, etag)).toBe(true);
    expect(ifNoneMatchMatches(null, etag)).toBe(false);
  });
  it("ifNoneMatchMatches matrix 29", () => {
    const etag = '"etag-29"';
    expect(ifNoneMatchMatches(etag, etag)).toBe(true);
    expect(ifNoneMatchMatches(null, etag)).toBe(false);
  });
  it("ifNoneMatchMatches matrix 30", () => {
    const etag = '"etag-30"';
    expect(ifNoneMatchMatches(etag, etag)).toBe(true);
    expect(ifNoneMatchMatches(null, etag)).toBe(false);
  });
  it("ifNoneMatchMatches matrix 31", () => {
    const etag = '"etag-31"';
    expect(ifNoneMatchMatches(etag, etag)).toBe(true);
    expect(ifNoneMatchMatches(null, etag)).toBe(false);
  });
  it("ifNoneMatchMatches matrix 32", () => {
    const etag = '"etag-32"';
    expect(ifNoneMatchMatches(etag, etag)).toBe(true);
    expect(ifNoneMatchMatches(null, etag)).toBe(false);
  });
  it("ifNoneMatchMatches matrix 33", () => {
    const etag = '"etag-33"';
    expect(ifNoneMatchMatches(etag, etag)).toBe(true);
    expect(ifNoneMatchMatches(null, etag)).toBe(false);
  });
  it("ifNoneMatchMatches matrix 34", () => {
    const etag = '"etag-34"';
    expect(ifNoneMatchMatches(etag, etag)).toBe(true);
    expect(ifNoneMatchMatches(null, etag)).toBe(false);
  });
  it("ifNoneMatchMatches matrix 35", () => {
    const etag = '"etag-35"';
    expect(ifNoneMatchMatches(etag, etag)).toBe(true);
    expect(ifNoneMatchMatches(null, etag)).toBe(false);
  });
  it("ifNoneMatchMatches matrix 36", () => {
    const etag = '"etag-36"';
    expect(ifNoneMatchMatches(etag, etag)).toBe(true);
    expect(ifNoneMatchMatches(null, etag)).toBe(false);
  });
  it("ifNoneMatchMatches matrix 37", () => {
    const etag = '"etag-37"';
    expect(ifNoneMatchMatches(etag, etag)).toBe(true);
    expect(ifNoneMatchMatches(null, etag)).toBe(false);
  });
  it("ifNoneMatchMatches matrix 38", () => {
    const etag = '"etag-38"';
    expect(ifNoneMatchMatches(etag, etag)).toBe(true);
    expect(ifNoneMatchMatches(null, etag)).toBe(false);
  });
  it("ifNoneMatchMatches matrix 39", () => {
    const etag = '"etag-39"';
    expect(ifNoneMatchMatches(etag, etag)).toBe(true);
    expect(ifNoneMatchMatches(null, etag)).toBe(false);
  });
  it("ifNoneMatchMatches matrix 40", () => {
    const etag = '"etag-40"';
    expect(ifNoneMatchMatches(etag, etag)).toBe(true);
    expect(ifNoneMatchMatches(null, etag)).toBe(false);
  });
  it("ifNoneMatchMatches matrix 41", () => {
    const etag = '"etag-41"';
    expect(ifNoneMatchMatches(etag, etag)).toBe(true);
    expect(ifNoneMatchMatches(null, etag)).toBe(false);
  });
  it("ifNoneMatchMatches matrix 42", () => {
    const etag = '"etag-42"';
    expect(ifNoneMatchMatches(etag, etag)).toBe(true);
    expect(ifNoneMatchMatches(null, etag)).toBe(false);
  });
  it("ifNoneMatchMatches matrix 43", () => {
    const etag = '"etag-43"';
    expect(ifNoneMatchMatches(etag, etag)).toBe(true);
    expect(ifNoneMatchMatches(null, etag)).toBe(false);
  });
  it("ifNoneMatchMatches matrix 44", () => {
    const etag = '"etag-44"';
    expect(ifNoneMatchMatches(etag, etag)).toBe(true);
    expect(ifNoneMatchMatches(null, etag)).toBe(false);
  });
  it("ifNoneMatchMatches matrix 45", () => {
    const etag = '"etag-45"';
    expect(ifNoneMatchMatches(etag, etag)).toBe(true);
    expect(ifNoneMatchMatches(null, etag)).toBe(false);
  });
  it("ifNoneMatchMatches matrix 46", () => {
    const etag = '"etag-46"';
    expect(ifNoneMatchMatches(etag, etag)).toBe(true);
    expect(ifNoneMatchMatches(null, etag)).toBe(false);
  });
  it("ifNoneMatchMatches matrix 47", () => {
    const etag = '"etag-47"';
    expect(ifNoneMatchMatches(etag, etag)).toBe(true);
    expect(ifNoneMatchMatches(null, etag)).toBe(false);
  });
  it("ifNoneMatchMatches matrix 48", () => {
    const etag = '"etag-48"';
    expect(ifNoneMatchMatches(etag, etag)).toBe(true);
    expect(ifNoneMatchMatches(null, etag)).toBe(false);
  });
  it("ifNoneMatchMatches matrix 49", () => {
    const etag = '"etag-49"';
    expect(ifNoneMatchMatches(etag, etag)).toBe(true);
    expect(ifNoneMatchMatches(null, etag)).toBe(false);
  });
});
