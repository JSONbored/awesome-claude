import { describe, expect, it, vi } from "vitest";

// Controlled registry fixtures so the data-bound selectors are deterministic and
// every branch (kind mapping, optional category/ref/href/cardDescription) is
// exercised regardless of the real registry snapshot. The integration test in
// `feeds.test.ts` still runs the same selectors over the real data.
// Intentionally left unsorted so the newest-first comparators exercise both
// ternary branches during sorting.
vi.mock("@/data/entries", () => ({
  ENTRIES: [
    {
      category: "skills",
      slug: "beta",
      title: "Beta",
      dateAdded: "2025-06-01",
      description: "Beta description",
    },
    {
      category: "skills",
      slug: "delta",
      title: "Delta",
      dateAdded: "2026-05-05",
      cardDescription: "Delta card",
      description: "Delta description",
    },
    {
      category: "skills",
      slug: "alpha",
      title: "Alpha",
      dateAdded: "2026-01-02",
      cardDescription: "Alpha card",
      description: "Alpha description",
    },
    {
      category: "mcp",
      slug: "gamma",
      title: "Gamma",
      dateAdded: "2026-03-03",
      cardDescription: "Gamma card",
      description: "Gamma description",
    },
  ],
}));

vi.mock("@/data/changelog", () => ({
  CHANGELOG: [
    {
      kind: "added",
      title: "Added Entry",
      category: "skills",
      ref: "skills/alpha",
      hash: "abc123",
      date: "2026-01-05T00:00:00.000Z",
    },
    {
      kind: "updated",
      title: "Updated Entry",
      category: null,
      ref: "mcp/gamma",
      date: "2026-02-01T00:00:00.000Z",
    },
    {
      kind: "removed",
      title: "Removed Entry",
      ref: "",
      date: "2026-03-01T00:00:00.000Z",
    },
  ],
  RELEASE_NOTES: [
    {
      title: "Release One",
      stream: "release",
      date: "2026-01-10T00:00:00.000Z",
      body: "First release note.",
      href: "/notes/release-one",
    },
    {
      title: "Policy One",
      stream: "policy",
      date: "2026-02-10T00:00:00.000Z",
      body: "First policy note.",
    },
    {
      title: "Security One",
      stream: "security",
      date: "2026-03-10T00:00:00.000Z",
      body: "First security note.",
      href: "/notes/security-one",
    },
  ],
}));

vi.mock("@/data/search", () => ({
  filterSearchEntries: vi.fn((_query: unknown, entries: unknown[]) => entries),
  normalizeSearchQuery: vi.fn((q: string) => `norm:${q}`),
}));

import { filterSearchEntries, normalizeSearchQuery } from "@/data/search";
import {
  applySavedSearch,
  buildAtom,
  buildRss,
  categoryItems,
  changelogStreamItems,
  esc,
  FEED_CATEGORIES,
  type FeedItem,
  latestPubDate,
  origin,
  rfc822,
  SITE_NAME,
  SITE_TAGLINE,
  siteWideItems,
} from "@/lib/feeds-lib";

const ITEM_A: FeedItem = {
  title: 'A & B <"x">',
  link: "/entry/skills/a",
  guid: "entry:skills/a",
  pubDate: "2026-01-02T03:04:05.000Z",
  description: "desc & <x>",
  category: "skills",
};

const ITEM_B: FeedItem = {
  title: "Older",
  link: "/entry/skills/b",
  guid: "entry:skills/b",
  pubDate: "2025-06-01T00:00:00.000Z",
  description: "older",
};

const OPTS = {
  title: "Feed & Title",
  description: "Feed <desc>",
  link: "https://heyclau.de",
  selfLink: "https://heyclau.de/feed.xml",
  items: [ITEM_A, ITEM_B],
};

describe("esc", () => {
  it("escapes all five XML metacharacters", () => {
    expect(esc(`& < > " '`)).toBe("&amp; &lt; &gt; &quot; &apos;");
  });

  it("passes plain text through untouched", () => {
    expect(esc("plain text 123")).toBe("plain text 123");
  });

  it("returns an empty string unchanged", () => {
    expect(esc("")).toBe("");
  });
});

describe("rfc822", () => {
  it("renders an ISO timestamp as an RFC 822 UTC date", () => {
    expect(rfc822("2026-01-02T03:04:05.000Z")).toBe(
      "Fri, 02 Jan 2026 03:04:05 GMT",
    );
  });
});

describe("latestPubDate", () => {
  it("returns the default fallback for an empty list", () => {
    expect(latestPubDate([])).toBe("2025-01-01T00:00:00.000Z");
  });

  it("returns a custom fallback for an empty list", () => {
    expect(latestPubDate([], "1999-12-31T00:00:00.000Z")).toBe(
      "1999-12-31T00:00:00.000Z",
    );
  });

  it("returns the newest pubDate when the newest is not first", () => {
    expect(latestPubDate([ITEM_B, ITEM_A])).toBe(ITEM_A.pubDate);
  });

  it("returns the newest pubDate when the newest is already first", () => {
    expect(latestPubDate([ITEM_A, ITEM_B])).toBe(ITEM_A.pubDate);
  });
});

describe("buildRss", () => {
  it("produces a well-formed RSS 2.0 envelope", () => {
    const xml = buildRss(OPTS);
    expect(xml.startsWith('<?xml version="1.0" encoding="UTF-8"?>')).toBe(true);
    expect(xml).toContain('<rss version="2.0"');
    expect(xml).toContain("<channel>");
    expect(xml).toContain("<language>en-US</language>");
    expect(xml).toContain(
      '<atom:link href="https://heyclau.de/feed.xml" rel="self"',
    );
    expect(xml).toContain('<guid isPermaLink="false">entry:skills/a</guid>');
  });

  it("escapes metacharacters in channel and item fields", () => {
    const xml = buildRss(OPTS);
    expect(xml).toContain("<title>Feed &amp; Title</title>");
    expect(xml).toContain("A &amp; B &lt;&quot;x&quot;&gt;");
    expect(xml).toContain("<description>desc &amp; &lt;x&gt;</description>");
    expect(xml).not.toContain('<"x">');
  });

  it("emits a <category> only for items that have one", () => {
    const xml = buildRss(OPTS);
    expect(xml).toContain("<category>skills</category>");
    expect(xml.match(/<category>/g)?.length).toBe(1);
  });

  it("defaults lastBuildDate to the newest item pubDate", () => {
    const xml = buildRss(OPTS);
    expect(xml).toContain(
      "<lastBuildDate>Fri, 02 Jan 2026 03:04:05 GMT</lastBuildDate>",
    );
  });

  it("honors an explicit lastBuilt override", () => {
    const xml = buildRss({ ...OPTS, lastBuilt: "2020-05-05T00:00:00.000Z" });
    expect(xml).toContain(
      "<lastBuildDate>Tue, 05 May 2020 00:00:00 GMT</lastBuildDate>",
    );
  });

  it("uses the fallback build date for an empty feed", () => {
    const xml = buildRss({ ...OPTS, items: [] });
    expect(xml).toContain(
      "<lastBuildDate>Wed, 01 Jan 2025 00:00:00 GMT</lastBuildDate>",
    );
    expect(xml).not.toContain("<item>");
  });

  it("is deterministic for identical input", () => {
    expect(buildRss(OPTS)).toBe(buildRss(OPTS));
  });
});

describe("buildAtom", () => {
  it("produces a well-formed Atom 1.0 envelope with ISO timestamps", () => {
    const xml = buildAtom(OPTS);
    expect(xml).toContain('<feed xmlns="http://www.w3.org/2005/Atom">');
    expect(xml).toContain("<id>entry:skills/a</id>");
    expect(xml).toContain("<updated>2026-01-02T03:04:05.000Z</updated>");
    expect(xml).toContain(`<author><name>${SITE_NAME}</name></author>`);
    expect(xml).toContain("A &amp; B &lt;&quot;x&quot;&gt;");
  });

  it("honors an explicit lastBuilt override", () => {
    const xml = buildAtom({ ...OPTS, lastBuilt: "2020-05-05T00:00:00.000Z" });
    expect(xml).toContain("<updated>2020-05-05T00:00:00.000Z</updated>");
  });

  it("uses the fallback build date for an empty feed", () => {
    const xml = buildAtom({ ...OPTS, items: [] });
    expect(xml).toContain("<updated>2025-01-01T00:00:00.000Z</updated>");
    expect(xml).not.toContain("<entry>");
  });

  it("is deterministic for identical input", () => {
    expect(buildAtom(OPTS)).toBe(buildAtom(OPTS));
  });
});

describe("origin", () => {
  it("derives protocol + host from an https request", () => {
    expect(origin(new Request("https://heyclau.de/feed.xml?x=1"))).toBe(
      "https://heyclau.de",
    );
  });

  it("preserves a non-default port and http scheme", () => {
    expect(origin(new Request("http://localhost:4321/atom.xml"))).toBe(
      "http://localhost:4321",
    );
  });
});

describe("siteWideItems", () => {
  const items = siteWideItems();

  it("maps every changelog kind to a human title prefix", () => {
    const titles = items.map((i) => i.title);
    expect(titles).toContain("Added Added Entry");
    expect(titles).toContain("Updated Updated Entry");
    expect(titles).toContain("Removed Removed Entry");
  });

  it("links to the entry when category and ref are present, else the changelog", () => {
    const added = items.find((i) => i.title === "Added Added Entry");
    const updated = items.find((i) => i.title === "Updated Updated Entry");
    const removed = items.find((i) => i.title === "Removed Removed Entry");
    expect(added?.link).toBe("/entry/skills/alpha");
    // null category -> /changelog
    expect(updated?.link).toBe("/changelog");
    // blank ref -> /changelog
    expect(removed?.link).toBe("/changelog");
  });

  it("uses the hash for the guid when present and the date otherwise", () => {
    const added = items.find((i) => i.title === "Added Added Entry");
    const updated = items.find((i) => i.title === "Updated Updated Entry");
    expect(added?.guid).toBe("change:skills/alpha:abc123");
    expect(updated?.guid).toBe("change:mcp/gamma:2026-02-01T00:00:00.000Z");
  });

  it("includes release-note items keyed by stream", () => {
    const note = items.find((i) => i.guid.startsWith("note:release:"));
    expect(note?.category).toBe("release");
    expect(note?.link).toBe("/notes/release-one");
    // policy note has no href -> /changelog
    const policy = items.find((i) => i.guid.startsWith("note:policy:"));
    expect(policy?.link).toBe("/changelog");
  });

  it("is sorted newest-first", () => {
    for (let n = 1; n < items.length; n++) {
      expect(items[n - 1].pubDate >= items[n].pubDate).toBe(true);
    }
  });
});

describe("categoryItems", () => {
  it("returns only the requested category, newest-first", () => {
    const items = categoryItems("skills");
    expect(items.map((i) => i.guid)).toEqual([
      "entry:skills/delta",
      "entry:skills/alpha",
      "entry:skills/beta",
    ]);
    expect(items[0].link).toBe("/entry/skills/delta");
  });

  it("falls back to description when cardDescription is absent", () => {
    const items = categoryItems("skills");
    const beta = items.find((i) => i.guid === "entry:skills/beta");
    expect(beta?.description).toBe("Beta description");
    const alpha = items.find((i) => i.guid === "entry:skills/alpha");
    expect(alpha?.description).toBe("Alpha card");
  });

  it("returns an empty list for a category with no entries", () => {
    expect(categoryItems("agents")).toEqual([]);
  });
});

describe("changelogStreamItems", () => {
  it("selects notes for the requested stream and keeps hrefs", () => {
    const release = changelogStreamItems("release");
    expect(release).toHaveLength(1);
    expect(release[0].link).toBe("/notes/release-one");
    expect(release[0].category).toBe("release");
  });

  it("falls back to /changelog when a note has no href", () => {
    const policy = changelogStreamItems("policy");
    expect(policy[0].link).toBe("/changelog");
    expect(policy[0].guid).toBe(
      "note:policy:2026-02-10T00:00:00.000Z:Policy One",
    );
  });
});

describe("applySavedSearch", () => {
  it("normalizes the query and forwards all filter facets", () => {
    const items = applySavedSearch({
      q: "hello",
      category: "skills",
      trust: "verified",
      source: "official",
      platform: "claude-code",
    });
    expect(normalizeSearchQuery).toHaveBeenCalledWith("hello");
    expect(filterSearchEntries).toHaveBeenCalledWith(
      expect.objectContaining({
        q: "norm:hello",
        categories: ["skills"],
        trust: ["verified"],
        source: ["official"],
        platforms: ["claude-code"],
      }),
      expect.any(Array),
    );
    expect(items.length).toBeGreaterThan(0);
    expect(items.length).toBeLessThanOrEqual(50);
  });

  it("leaves facets undefined and skips normalization when unset", () => {
    applySavedSearch({});
    expect(filterSearchEntries).toHaveBeenLastCalledWith(
      {
        q: undefined,
        categories: undefined,
        trust: undefined,
        source: undefined,
        platforms: undefined,
      },
      expect.any(Array),
    );
  });

  it("sorts materialized results newest-first", () => {
    const items = applySavedSearch({});
    for (let n = 1; n < items.length; n++) {
      expect(items[n - 1].pubDate >= items[n].pubDate).toBe(true);
    }
  });
});

describe("constants", () => {
  it("exposes the site name and tagline", () => {
    expect(SITE_NAME).toBe("HeyClaude");
    expect(SITE_TAGLINE.length).toBeGreaterThan(0);
  });

  it("exposes a non-empty list of feed category ids", () => {
    expect(Array.isArray(FEED_CATEGORIES)).toBe(true);
    expect(FEED_CATEGORIES.length).toBeGreaterThan(0);
  });
});
