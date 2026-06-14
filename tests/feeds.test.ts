import { describe, expect, it } from "vitest";
import {
  applySavedSearch,
  buildAtom,
  buildRss,
  categoryItems,
  etagFor,
  type FeedItem,
  respondFeed,
  siteWideItems,
} from "@/lib/feeds";

const ITEMS: FeedItem[] = [
  {
    title: 'Tom & Jerry <"best">',
    link: "/entry/skills/a",
    guid: "entry:skills/a",
    pubDate: "2026-01-02T03:04:05.000Z",
    description: "A & B < C",
    category: "skills",
  },
  {
    title: "Older",
    link: "/entry/skills/b",
    guid: "entry:skills/b",
    pubDate: "2025-06-01T00:00:00.000Z",
    description: "older item",
  },
];

const rssOpts = {
  title: "Feed & Title",
  description: "desc <x>",
  link: "https://heyclau.de",
  selfLink: "https://heyclau.de/feed.xml",
  items: ITEMS,
};

describe("buildRss", () => {
  it("produces a well-formed RSS 2.0 envelope", () => {
    const xml = buildRss(rssOpts);
    expect(xml.startsWith('<?xml version="1.0" encoding="UTF-8"?>')).toBe(true);
    expect(xml).toContain('<rss version="2.0"');
    expect(xml).toContain("<channel>");
    expect(xml).toContain("<item>");
    expect(xml).toContain("<guid isPermaLink=\"false\">entry:skills/a</guid>");
    // rfc822 pubDate
    expect(xml).toContain("<pubDate>Fri, 02 Jan 2026 03:04:05 GMT</pubDate>");
  });

  it("escapes XML metacharacters in titles and descriptions", () => {
    const xml = buildRss(rssOpts);
    expect(xml).toContain("Tom &amp; Jerry &lt;&quot;best&quot;&gt;");
    expect(xml).toContain("<description>A &amp; B &lt; C</description>");
    // No raw unescaped angle bracket from the data leaks into the body.
    expect(xml).not.toContain('<"best">');
  });

  it("emits a <category> only when the item has one", () => {
    const xml = buildRss(rssOpts);
    expect(xml).toContain("<category>skills</category>");
    // second item has no category -> exactly one category element
    expect(xml.match(/<category>/g)?.length).toBe(1);
  });

  it("is deterministic for the same input (stable ETag source)", () => {
    expect(buildRss(rssOpts)).toBe(buildRss(rssOpts));
  });

  it("defaults lastBuildDate to the newest item pubDate", () => {
    const xml = buildRss(rssOpts);
    expect(xml).toContain("<lastBuildDate>Fri, 02 Jan 2026 03:04:05 GMT</lastBuildDate>");
  });
});

describe("buildAtom", () => {
  it("produces a well-formed Atom 1.0 envelope with ISO timestamps", () => {
    const xml = buildAtom(rssOpts);
    expect(xml).toContain('<feed xmlns="http://www.w3.org/2005/Atom">');
    expect(xml).toContain("<id>entry:skills/a</id>");
    expect(xml).toContain("<updated>2026-01-02T03:04:05.000Z</updated>");
    expect(xml).toContain("Tom &amp; Jerry &lt;&quot;best&quot;&gt;");
  });

  it("is deterministic for the same input", () => {
    expect(buildAtom(rssOpts)).toBe(buildAtom(rssOpts));
  });
});

describe("etagFor", () => {
  it("is stable for identical bodies", async () => {
    const a = await etagFor("hello");
    const b = await etagFor("hello");
    expect(a).toBe(b);
  });

  it("differs for different bodies and is a quoted 16-hex string", async () => {
    const a = await etagFor("hello");
    const b = await etagFor("world");
    expect(a).not.toBe(b);
    expect(a).toMatch(/^"[0-9a-f]{16}"$/);
  });
});

describe("respondFeed conditional GET", () => {
  const body = buildRss(rssOpts);
  const lastBuilt = "2026-01-02T03:04:05.000Z";

  it("returns 200 with cache + validator headers when unconditional", async () => {
    const res = await respondFeed(new Request("https://heyclau.de/feed.xml"), body, lastBuilt);
    expect(res.status).toBe(200);
    expect(res.headers.get("ETag")).toMatch(/^"[0-9a-f]{16}"$/);
    expect(res.headers.get("Cache-Control")).toContain("max-age=300");
    expect(res.headers.get("Last-Modified")).toBe(new Date(lastBuilt).toUTCString());
    expect(await res.text()).toBe(body);
  });

  it("returns 304 with an empty body when If-None-Match matches", async () => {
    const etag = await etagFor(body);
    const res = await respondFeed(
      new Request("https://heyclau.de/feed.xml", { headers: { "if-none-match": etag } }),
      body,
      lastBuilt,
    );
    expect(res.status).toBe(304);
    expect(res.headers.get("ETag")).toBe(etag);
    expect(await res.text()).toBe("");
  });

  it("returns 200 when If-None-Match does not match", async () => {
    const res = await respondFeed(
      new Request("https://heyclau.de/feed.xml", { headers: { "if-none-match": '"deadbeef"' } }),
      body,
      lastBuilt,
    );
    expect(res.status).toBe(200);
  });

  it("honors a custom content type (atom)", async () => {
    const res = await respondFeed(
      new Request("https://heyclau.de/atom.xml"),
      buildAtom(rssOpts),
      lastBuilt,
      "application/atom+xml; charset=utf-8",
    );
    expect(res.headers.get("Content-Type")).toContain("application/atom+xml");
  });
});

describe("item builders over the real registry", () => {
  it("categoryItems returns only that category, newest first, capped at 100", () => {
    const items = categoryItems("skills");
    expect(items.length).toBeGreaterThan(0);
    expect(items.length).toBeLessThanOrEqual(100);
    for (const i of items) {
      expect(i.category).toBe("skills");
      expect(i.link.startsWith("/entry/skills/")).toBe(true);
    }
    // sorted descending by pubDate
    for (let n = 1; n < items.length; n++) {
      expect(items[n - 1].pubDate >= items[n].pubDate).toBe(true);
    }
  });

  it("applySavedSearch filters by category and caps at 50", () => {
    const items = applySavedSearch({ category: "mcp" });
    expect(items.length).toBeLessThanOrEqual(50);
    for (const i of items) expect(i.link.startsWith("/entry/mcp/")).toBe(true);
  });

  it("applySavedSearch with no filters returns the newest slice", () => {
    const items = applySavedSearch({});
    expect(items.length).toBeLessThanOrEqual(50);
    for (let n = 1; n < items.length; n++) {
      expect(items[n - 1].pubDate >= items[n].pubDate).toBe(true);
    }
  });

  it("siteWideItems is capped at 100 and newest-first", () => {
    const items = siteWideItems();
    expect(items.length).toBeLessThanOrEqual(100);
    for (let n = 1; n < items.length; n++) {
      expect(items[n - 1].pubDate >= items[n].pubDate).toBe(true);
    }
  });
});
