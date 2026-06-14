# Google Search Console Feedback-Loop Runbook

A recurring process for turning Google Search Console (GSC) data into concrete
edits on HeyClaude. The goal is to close the loop: GSC tells us how Google sees
the site, and each review run should produce a short, prioritized list of
actions — title/description tweaks, thin-page fixes, or differentiation work —
rather than a dashboard we admire and forget.

Property: `https://heyclau.de` (domain property preferred so subdomains and the
`www` / apex are covered in one place).

## Why this exists

The site ships a lot of programmatic surface area — category pages, entry detail
pages, `compare/*`, `best/*`, `for/*`, `tags/*`, and collections. Most of these
are good, but the long tail can drift into thin or near-duplicate territory.
GSC is the cheapest signal we have for which pages Google actually values, which
queries we already rank for (and could win with a better snippet), and which
pages Google crawled but declined to index. This runbook converts those three
signals into work.

Related tracking issues this loop feeds:

- Thin-content report — #2260
- Page differentiation — #2261

When a GSC run surfaces thin or duplicate pages, do not fix them ad hoc here.
Record them against #2260 (thin/low-value) or #2261 (near-duplicate / weak
differentiation) so the fix is batched with the systematic work.

## Cadence

- **Monthly** (default): full review using the checklist below. Pick a fixed day
  (e.g. the first business day of the month) and look at the trailing 28 days
  plus a month-over-month comparison.
- **Quarterly**: widen the window to the last 3–6 months to catch slow trends
  (seasonal query shifts, gradual CTR decay, indexing creep) that a 28-day
  window hides.
- **Ad hoc**: after a large content import wave, a sitemap/routing change, or a
  ranking drop reported elsewhere, run the indexing section early instead of
  waiting for the monthly slot.

GSC data lags ~2–3 days, so never read the most recent days as final.

## What to pull

All of these live under **Search results** (Performance) and **Indexing →
Pages** in GSC. Use the UI for triage; export to CSV (or the GSC API) when you
want to sort/filter beyond what the UI allows.

### 1. Top queries

Performance → **Queries** tab. Sort by impressions, then by clicks.

Look for:

- High-impression, low-CTR queries — we are visible but the snippet is not
  winning the click. Candidate for title/description tuning (see "Act on CTR").
- Queries where we rank position 5–15 — a snippet or on-page tweak can push
  these toward the first page.
- Queries we rank for but have no dedicated page — possible new content or a
  better internal link target (route to a maintainer, not into this doc).

### 2. CTR and impressions by page

Performance → **Pages** tab; add the **Average CTR** and **Average position**
columns. Cross-reference with the Queries tab by clicking a page to filter.

Look for:

- Pages with strong impressions but CTR well below the site/page-type median —
  the title/description is underperforming relative to its rank.
- Pages losing impressions month-over-month — possible content decay, lost
  ranking, or a competitor change. Note for investigation; do not assume a code
  cause.
- Pages with rising impressions but flat clicks — snippet ceiling; tune copy.

Compare CTR **within a page type** (entry vs. compare vs. category), not across
types. A 2% CTR on a broad category page and a 2% CTR on a long-tail compare
page mean different things.

### 3. Crawled / discovered – not indexed

Indexing → **Pages** → open the **Why pages aren't indexed** table. The two rows
that matter most here:

- **Crawled – currently not indexed**: Google fetched the page and chose not to
  index it. On HeyClaude this most often means thin or near-duplicate content.
- **Discovered – currently not indexed**: Google knows the URL but hasn't
  crawled it. Often crawl-budget or low perceived value; can also indicate a
  page Google deems not worth fetching yet.

Also scan for **Duplicate without user-selected canonical** and **Duplicate,
Google chose different canonical** — these point straight at differentiation
work (#2261).

For each affected URL, classify the cause before acting:

| Symptom in GSC                           | Likely cause on HeyClaude                          | Where it goes        |
| ---------------------------------------- | -------------------------------------------------- | -------------------- |
| Crawled – not indexed, thin body         | Low-value page (few entries, sparse copy)          | #2260                |
| Duplicate / chose different canonical    | Near-duplicate programmatic pages                  | #2261                |
| Discovered – not indexed, valid page     | Crawl budget / low link equity                     | Internal-link review |
| Crawled – not indexed, `tools` entry     | Intentional (commercial listing, sitemap-excluded) | No action            |
| Page is `noindex` by design (<2 entries) | Intentional thin-page guard                        | No action            |

Some "not indexed" results are **expected and correct**. The site already
excludes thin-by-design surfaces from indexing, so confirm intent before filing:

- `tools` entries are commercial listings: kept crawlable via internal links but
  deliberately excluded from the sitemap (`isSitemapIndexableEntry` in
  `apps/web/src/lib/sitemap-policy.ts`).
- Programmatic pages with fewer than two entries are served `noindex, follow`
  (see `apps/web/src/routes/tags.$tag.tsx` and
  `apps/web/src/routes/for.$platform.$category.tsx`).
- Anything with `robotsIndex: false` is excluded by design.

Only the URLs that are **meant** to be indexed but aren't should generate work.

## How to act

### Act on CTR (title / description tuning)

When a page has good impressions/position but weak CTR:

1. Pull the top 5–10 queries for that page (Queries tab filtered to the page).
2. Check that the page's `<title>` and meta description actually reflect the
   intent of those queries and read well as a search snippet (front-load the
   distinctive term, keep titles ~50–60 chars, descriptions ~140–160 chars,
   avoid boilerplate that repeats across the page type).
3. Make the change in the route/SEO metadata (not in `content/*.mdx`, which is
   submitter-owned and gated). Most page-type titles/descriptions are built in
   the corresponding route under `apps/web/src/routes/` or the SEO helpers in
   `apps/web/src/lib/`.
4. Open a focused PR. After deploy, re-check the same page in GSC ~3–4 weeks
   later — CTR changes need time to accumulate impressions.

Tune copy; do not stuff keywords. The bar is "would a human click this over the
other results," not "does it contain the query verbatim."

### Act on thin pages (feed #2260)

If a page is **crawled – not indexed** because it's thin (sparse copy, very few
entries, little unique value):

1. Confirm it is not already intentionally `noindex`/sitemap-excluded (table
   above).
2. Add it to the thin-content report (#2260) with the URL, the GSC reason, and
   the entry count / what makes it thin.
3. Preferred fixes, in order: enrich the page so it earns indexing; merge it
   into a stronger page; or, if it can't be made valuable, mark it `noindex` so
   it stops competing for crawl budget. Implement the systematic version under
   #2260 rather than one-off edits.

### Act on duplicate / weak-differentiation pages (feed #2261)

If GSC reports **duplicate / Google chose a different canonical**, or two
programmatic pages clearly overlap:

1. Add the URL pair(s) to the page-differentiation issue (#2261) with the GSC
   signal and what overlaps (same entry set, near-identical copy, etc.).
2. Decide per pair: differentiate the content (distinct intro, distinct entry
   ordering/filtering, distinct internal links), set an explicit canonical to
   the stronger page, or consolidate. Land the fix under #2261.

### Act on discovered – not indexed (internal linking / crawl budget)

If a page that _should_ index is **discovered – not indexed**:

1. Verify it's in `sitemap.xml` and not blocked by robots or `noindex`.
2. Strengthen internal links to it from higher-authority pages (category hubs,
   related entries).
3. Use **URL Inspection → Request indexing** sparingly for a few high-value
   URLs; it is not a fix for systemic crawl-budget problems.
4. Confirm the URL is being submitted via IndexNow (see `docs/indexnow.md`) on
   publish.

## Monthly checklist

Copy this into the review note for the run.

```text
GSC review — <YYYY-MM>, window <start>–<end> (last 28d)

Top queries
- [ ] Exported Queries; flagged high-impression / low-CTR queries
- [ ] Flagged position 5–15 queries worth pushing
- [ ] Noted query↔page gaps (no dedicated page) -> routed to maintainer

CTR / impressions by page
- [ ] Compared CTR within page type (entry / compare / category / for / best)
- [ ] Listed pages with strong impressions + weak CTR -> CTR tuning PRs
- [ ] Noted month-over-month impression drops to investigate

Indexing
- [ ] Reviewed Crawled – not indexed
- [ ] Reviewed Discovered – not indexed
- [ ] Reviewed Duplicate / different-canonical
- [ ] Classified each actionable URL (thin / duplicate / crawl-budget / intended)
- [ ] Confirmed intended-noindex / tools / sitemap-excluded URLs (no action)

Routing
- [ ] Thin pages added to #2260
- [ ] Duplicate / weak-differentiation pages added to #2261
- [ ] CTR-tuning PRs opened (focused, no content/*.mdx changes)
- [ ] Internal-link / IndexNow follow-ups noted

Follow-up
- [ ] Re-check last month's CTR-tuning targets (~3–4 weeks after deploy)
- [ ] Compared this run's indexing totals vs. last run
```

## Guardrails

- Never edit `content/*.mdx` from this loop — those are submitter-owned and the
  submission gate auto-closes PRs that touch them. CTR/snippet fixes belong in
  routes and SEO helpers.
- A page being "not indexed" is not automatically a bug. Confirm intent against
  the `noindex` / `tools` / sitemap-policy guards before filing anything.
- Keep each run's output small and actionable: a handful of CTR PRs plus entries
  appended to #2260 / #2261. Do not let the review become a standing dashboard
  with no follow-through.
- Attribute outcomes to deploys, not coincidence: note the date a change shipped
  and only judge it after enough impressions have accumulated.
