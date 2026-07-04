/**
 * Pure, dependency-light feed builders and registry item selectors.
 *
 * This module holds the deterministic string/data layer of the feed system:
 * hand-built RSS 2.0 / Atom 1.0 envelope builders (no XML library, strict
 * escaping) plus the source-of-truth item selectors that read from the static
 * registry snapshot. Everything here is synchronous and side-effect free so a
 * feed body is deterministic for a given registry snapshot — which is what
 * makes a body-derived ETag stable.
 *
 * The request/IO layer (SHA-1 ETag hashing, conditional-GET responses, live
 * growth-surface trending, and feed-health aggregation) lives in `feeds.ts`,
 * which re-exports everything below so existing `@/lib/feeds` imports keep
 * working unchanged.
 */
import { ENTRIES } from "@/data/entries";
import { filterSearchEntries, normalizeSearchQuery } from "@/data/search";
import { CHANGELOG, RELEASE_NOTES } from "@/data/changelog";
import {
  CATEGORIES,
  type Category,
  type Platform,
  type SourceStatus,
  type TrustLevel,
} from "@/types/registry";

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

/** Escape the five XML metacharacters so raw registry text is body-safe. */
export function esc(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

/** Render an ISO 8601 timestamp as an RFC 822 date for RSS `pubDate`. */
export function rfc822(iso: string): string {
  return new Date(iso).toUTCString();
}

/**
 * The newest `pubDate` across items, used as a deterministic build timestamp.
 * Falls back to a fixed epoch-ish date when the feed has no items so the body
 * (and therefore its ETag) stays stable.
 */
export function latestPubDate(items: FeedItem[], fallback = "2025-01-01T00:00:00.000Z"): string {
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
  return filterSearchEntries(
    {
      q: q.q ? normalizeSearchQuery(q.q) : q.q,
      categories: q.category ? [q.category as Category] : undefined,
      trust: q.trust ? [q.trust as TrustLevel] : undefined,
      source: q.source ? [q.source as SourceStatus] : undefined,
      platforms: q.platform ? [q.platform as Platform] : undefined,
    },
    ENTRIES,
  )
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
