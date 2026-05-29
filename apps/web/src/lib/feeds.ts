/**
 * Hand-built RSS 2.0 / Atom 1.0 builders. No dependencies — string templates
 * with strict XML escaping. Mirrors the pattern used in the legacy
 * jsonbored/awesome-claude site.
 *
 * Feed bodies are deterministic for a given registry snapshot so that an
 * ETag derived from the body bytes is stable across requests. The dispatcher
 * helper `respondFeed` handles `If-None-Match` and emits cache headers.
 */
import { ENTRIES } from "@/data/entries";
import { CHANGELOG, RELEASE_NOTES } from "@/data/changelog";
import { getGrowthSurfaces } from "@/lib/growth-surfaces";
import { CATEGORIES, type Category } from "@/types/registry";

export const SITE_NAME = "HeyClaude";
export const SITE_TAGLINE =
  "Directory for Claude Code, MCP servers, agents, skills, hooks, and rules.";

export interface FeedItem {
  title: string;
  link: string;
  guid: string;
  pubDate: string; // ISO 8601
  description: string;
  category?: string;
}

function esc(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function rfc822(iso: string): string {
  return new Date(iso).toUTCString();
}

function latestPubDate(items: FeedItem[], fallback = "2025-01-01T00:00:00.000Z"): string {
  if (items.length === 0) return fallback;
  return items.reduce((acc, i) => (i.pubDate > acc ? i.pubDate : acc), items[0].pubDate);
}

export function buildRss(opts: {
  title: string;
  description: string;
  link: string;
  selfLink: string;
  items: FeedItem[];
  /** Stable build timestamp. Defaults to newest item's pubDate so the body is deterministic. */
  lastBuilt?: string;
}): string {
  const items = opts.items
    .map(
      (i) => `    <item>
      <title>${esc(i.title)}</title>
      <link>${esc(i.link)}</link>
      <guid isPermaLink="false">${esc(i.guid)}</guid>
      <pubDate>${rfc822(i.pubDate)}</pubDate>${i.category ? `\n      <category>${esc(i.category)}</category>` : ""}
      <description>${esc(i.description)}</description>
    </item>`,
    )
    .join("\n");

  const built = opts.lastBuilt ?? latestPubDate(opts.items);

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${esc(opts.title)}</title>
    <link>${esc(opts.link)}</link>
    <description>${esc(opts.description)}</description>
    <language>en-US</language>
    <lastBuildDate>${rfc822(built)}</lastBuildDate>
    <atom:link href="${esc(opts.selfLink)}" rel="self" type="application/rss+xml"/>
${items}
  </channel>
</rss>`;
}

export function buildAtom(opts: {
  title: string;
  description: string;
  link: string;
  selfLink: string;
  items: FeedItem[];
  lastBuilt?: string;
}): string {
  const entries = opts.items
    .map(
      (i) => `  <entry>
    <title>${esc(i.title)}</title>
    <link href="${esc(i.link)}" rel="alternate"/>
    <id>${esc(i.guid)}</id>
    <updated>${new Date(i.pubDate).toISOString()}</updated>
    <author><name>${esc(SITE_NAME)}</name></author>
    <summary>${esc(i.description)}</summary>
  </entry>`,
    )
    .join("\n");

  const built = opts.lastBuilt ?? latestPubDate(opts.items);

  return `<?xml version="1.0" encoding="UTF-8"?>
<feed xmlns="http://www.w3.org/2005/Atom">
  <title>${esc(opts.title)}</title>
  <link href="${esc(opts.link)}" rel="alternate"/>
  <link href="${esc(opts.selfLink)}" rel="self"/>
  <id>${esc(opts.link)}</id>
  <updated>${new Date(built).toISOString()}</updated>
  <subtitle>${esc(opts.description)}</subtitle>
${entries}
</feed>`;
}

/* --------- ETag + response helpers -------- */

async function sha1Hex(input: string): Promise<string> {
  const bytes = new TextEncoder().encode(input);
  const buf = await crypto.subtle.digest("SHA-1", bytes);
  let out = "";
  const view = new Uint8Array(buf);
  for (let i = 0; i < view.length; i++) out += view[i].toString(16).padStart(2, "0");
  return out;
}

export async function etagFor(body: string): Promise<string> {
  return `"${(await sha1Hex(body)).slice(0, 16)}"`;
}

const XML_CACHE = "public, max-age=300, stale-while-revalidate=3600";

/**
 * Send an XML feed body with conditional-GET support. Returns 304 when the
 * client's If-None-Match matches the body's ETag.
 */
export async function respondFeed(
  request: Request,
  body: string,
  lastBuilt: string,
  contentType = "application/rss+xml; charset=utf-8",
): Promise<Response> {
  const etag = await etagFor(body);
  const ifNoneMatch = request.headers.get("if-none-match");
  const headers: Record<string, string> = {
    "Content-Type": contentType,
    "Cache-Control": XML_CACHE,
    ETag: etag,
    "Last-Modified": new Date(lastBuilt).toUTCString(),
  };
  if (ifNoneMatch && ifNoneMatch === etag) {
    return new Response(null, { status: 304, headers });
  }
  return new Response(body, { headers });
}

/* --------- Source-of-truth item builders -------- */

export function origin(request: Request): string {
  const u = new URL(request.url);
  return `${u.protocol}//${u.host}`;
}

export function siteWideItems(): FeedItem[] {
  const changes: FeedItem[] = CHANGELOG.map((c) => ({
    title: `${c.kind === "added" ? "Added" : c.kind === "updated" ? "Updated" : "Removed"} ${c.title}`,
    link: c.category && c.ref ? `/entry/${c.ref}` : "/changelog",
    guid: `change:${c.ref}:${c.hash ?? c.date}`,
    pubDate: c.date,
    description: `${c.ref} ${c.kind} in the HeyClaude registry.`,
    category: c.category ?? undefined,
  }));

  const notes: FeedItem[] = RELEASE_NOTES.map((n) => ({
    title: n.title,
    link: n.href ?? "/changelog",
    guid: `note:${n.stream}:${n.date}:${n.title}`,
    pubDate: n.date,
    description: n.body,
    category: n.stream,
  }));

  return [...changes, ...notes].sort((a, b) => (a.pubDate < b.pubDate ? 1 : -1)).slice(0, 100);
}

export function categoryItems(category: Category): FeedItem[] {
  return ENTRIES.filter((e) => e.category === category)
    .sort((a, b) => (a.dateAdded < b.dateAdded ? 1 : -1))
    .slice(0, 100)
    .map((e) => ({
      title: e.title,
      link: `/entry/${e.category}/${e.slug}`,
      guid: `entry:${e.category}/${e.slug}`,
      pubDate: e.dateAdded,
      description: e.cardDescription ?? e.description,
      category: e.category,
    }));
}

export function changelogStreamItems(stream: "release" | "policy" | "security"): FeedItem[] {
  return RELEASE_NOTES.filter((n) => n.stream === stream).map((n) => ({
    title: n.title,
    link: n.href ?? "/changelog",
    guid: `note:${stream}:${n.date}:${n.title}`,
    pubDate: n.date,
    description: n.body,
    category: stream,
  }));
}

export async function trendingItems(): Promise<FeedItem[]> {
  const surfaces = await getGrowthSurfaces();
  const hasLiveSignals =
    surfaces.communitySignalsAvailable || surfaces.votesAvailable || surfaces.intentEventsAvailable;
  if (!hasLiveSignals) return [];
  return surfaces.communityTrending.slice(0, 100).map((entry) => ({
    title: entry.title,
    link: `/entry/${entry.category}/${entry.slug}`,
    guid: `trending:${entry.category}/${entry.slug}`,
    pubDate: entry.dateAdded || new Date(0).toISOString(),
    description: entry.description,
    category: entry.category,
  }));
}

export const FEED_CATEGORIES = CATEGORIES.map((c) => c.id);

/* --------- Saved-search materialization (URL-encoded) -------- */

export interface SavedSearchQuery {
  q?: string;
  category?: string;
  trust?: string;
  source?: string;
  platform?: string;
}

export function applySavedSearch(q: SavedSearchQuery): FeedItem[] {
  const needle = (q.q ?? "").trim().toLowerCase();
  return ENTRIES.filter((e) => {
    if (q.category && e.category !== q.category) return false;
    if (q.trust && e.trust !== q.trust) return false;
    if (q.source && e.source !== q.source) return false;
    if (q.platform && !(e.platforms ?? []).some((p) => p === q.platform)) return false;
    if (needle) {
      const hay = [
        e.title,
        e.description,
        e.cardDescription ?? "",
        (e.tags ?? []).join(" "),
        e.author ?? "",
      ]
        .join(" ")
        .toLowerCase();
      if (!hay.includes(needle)) return false;
    }
    return true;
  })
    .sort((a, b) => (a.dateAdded < b.dateAdded ? 1 : -1))
    .slice(0, 50)
    .map((e) => ({
      title: e.title,
      link: `/entry/${e.category}/${e.slug}`,
      guid: `entry:${e.category}/${e.slug}`,
      pubDate: e.dateAdded,
      description: e.cardDescription ?? e.description,
      category: e.category,
    }));
}

/* --------- Health metadata --------- */

export interface FeedHealth {
  id: string;
  title: string;
  url: string;
  itemCount: number;
  latestItemAt: string | null;
  lastBuilt: string;
  etag: string;
  isCurrent: boolean;
}

const FRESHNESS_DAYS = 30;

function isCurrent(latest: string | null): boolean {
  if (!latest) return false;
  const ageMs = Date.now() - new Date(latest).getTime();
  return ageMs <= FRESHNESS_DAYS * 24 * 60 * 60 * 1000;
}

async function healthFor(
  id: string,
  title: string,
  url: string,
  items: FeedItem[],
  body: string,
): Promise<FeedHealth> {
  const latest = items.length > 0 ? latestPubDate(items) : null;
  return {
    id,
    title,
    url,
    itemCount: items.length,
    latestItemAt: latest,
    lastBuilt: latest ?? new Date(0).toISOString(),
    etag: await etagFor(body),
    isCurrent: isCurrent(latest),
  };
}

/** Build the full health report for every feed the site exposes. */
export async function allFeedHealth(base: string): Promise<FeedHealth[]> {
  const out: FeedHealth[] = [];

  const site = siteWideItems();
  out.push(
    await healthFor(
      "feed",
      "Everything (RSS)",
      "/feed.xml",
      site,
      buildRss({
        title: SITE_NAME,
        description: SITE_TAGLINE,
        link: base,
        selfLink: `${base}/feed.xml`,
        items: site,
      }),
    ),
  );
  out.push(
    await healthFor(
      "atom",
      "Everything (Atom)",
      "/atom.xml",
      site,
      buildAtom({
        title: SITE_NAME,
        description: SITE_TAGLINE,
        link: base,
        selfLink: `${base}/atom.xml`,
        items: site,
      }),
    ),
  );

  for (const c of CATEGORIES) {
    const items = categoryItems(c.id);
    out.push(
      await healthFor(
        `category:${c.id}`,
        c.label,
        `/feeds/${c.id}.xml`,
        items,
        buildRss({
          title: c.label,
          description: c.blurb,
          link: base,
          selfLink: `${base}/feeds/${c.id}.xml`,
          items,
        }),
      ),
    );
  }

  for (const stream of ["release", "policy", "security"] as const) {
    const items = changelogStreamItems(stream);
    out.push(
      await healthFor(
        `changelog:${stream}`,
        `${stream[0].toUpperCase()}${stream.slice(1)} notes`,
        `/feeds/changelog-${stream}.xml`,
        items,
        buildRss({
          title: stream,
          description: stream,
          link: base,
          selfLink: `${base}/feeds/changelog-${stream}.xml`,
          items,
        }),
      ),
    );
  }

  const trending = await trendingItems();
  out.push(
    await healthFor(
      "trending",
      "Trending",
      "/feeds/trending.xml",
      trending,
      buildRss({
        title: `${SITE_NAME} trending`,
        description: "Registry entries with current public community, vote, and intent signals.",
        link: base,
        selfLink: `${base}/feeds/trending.xml`,
        items: trending,
      }),
    ),
  );

  return out;
}
