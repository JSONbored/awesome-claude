# Atlas Registry Sharding Plan

Status: decision doc (planning). No behavior change until adopted.
Tracking: #2269.

## TL;DR

`apps/web/src/generated/atlas-registry.json` is a single ~3.64 MiB
(3,814,620 bytes, 948 entries) JSON blob that is **statically imported** into
the SSR/build bundle by four modules. It is already off the client (the browser
never downloads it), but a static `import` inlines the whole file into every
server chunk that touches it, so SSR module-eval cost and build memory grow
linearly with the registry. Today this is comfortable. The recommended action is
to **defer a rewrite** and instead **decouple the cold consumers from the hot
path now** (cheap, low-risk), then move the hot path (`ENTRIES`) to lazy,
fetch-backed loading **only when** the file crosses **~6 MB or ~1,800 entries**,
whichever comes first. Concrete trigger thresholds are in
[Trigger threshold](#trigger-threshold).

## Current state

### What the file contains

`atlas-registry.json` is produced by `scripts/build-content-index.mjs`
(`atlasRegistryPayload`, written via `writePrettierJsonFile`). It holds:

- `schemaVersion`, `generatedAt`
- `artifactContracts[]` — 31 entries: `{ path, bytes, sha256, builtAt }` for the
  public `/data/*.json` artifacts (integrity manifest).
- `entries[]` — 948 entries, each the `pickAtlasEntry()` projection (title,
  description, SEO fields, tags, install/config snippets, trust signals, repo
  stats, etc.). Average ~3.4 KB/entry, max ~10.8 KB.
- `changelog[]` — last 25 registry changes.

The `entries[]` array is ~99% of the bytes; everything else is small.

### Where it is loaded

Four modules statically `import atlasRegistry from "@/generated/atlas-registry.json"`:

| Importer                               | What it uses                                                            | Hot? |
| -------------------------------------- | ----------------------------------------------------------------------- | ---- |
| `apps/web/src/data/entries.ts`         | full `entries[]` → `ENTRIES`, `ENTRY_BY_REF`, best-lists, quality stats | yes  |
| `apps/web/src/data/changelog.ts`       | `changelog[]` (25 items) + `generatedAt` scalar                         | no   |
| `apps/web/src/routes/validators.tsx`   | `generatedAt` scalar only                                               | no   |
| `apps/web/src/routes/sitemap[.]xml.ts` | `generatedAt` scalar only                                               | no   |

`entries.ts` is the hot one: it builds `ENTRIES`, the `ENTRY_BY_REF` O(1) map,
`BEST_LISTS`, `WEEKLY_BRIEF`, and `QUALITY_STATS` at module load. These feed the
SSR entry loader, the `/og` route, the `$category/$slug` redirect,
`related()`/`relatedGroups()`, and trending — all synchronous, all expecting an
in-memory array.

The other three importers only read `changelog` or the `generatedAt` string, yet
the static `import` pulls the entire 3.64 MiB module into each of their chunks.

### What is already decoupled (prior art)

The public API search path does **not** use `atlas-registry.json`. The
`registry.search` route (`apps/web/src/routes/api/registry/search.ts`) calls
`getSearchIndex()` in `apps/web/src/lib/content.server.ts`, which loads the
prebuilt `/data/search-index.json` (~1.4 MiB) artifact at runtime via
`loadJsonDataFile`. That helper reads from the local filesystem in dev/build and
falls back to the Cloudflare `ASSETS` binding (`assets.fetch`) in the Worker
runtime, with a `react` `cache()`/promise-memo layer. Per-entry detail pages
already fetch `/data/entries/<category>/<slug>.json` the same way (LRU-capped at
512). So a fetch-backed, lazily-loaded registry is **a pattern this codebase
already runs in production**, not a new mechanism to invent.

Related prebuilt artifacts that exist today (all under `apps/web/public/data/`):

- `search-index.json` (~1.4 MiB) — search documents.
- `directory-index.json` (~1.9 MiB) — listing rows.
- `relation-graph.json` (~1.3 MiB) — relation edges.
- `entries/<category>/<slug>.json` (948 files, ~15 MiB total) — per-entry detail.

## Scaling risk

The file is fine on the client (never shipped) but the cost is on the server/build:

1. **SSR module-eval + memory.** A static JSON `import` is parsed and held
   resident for the lifetime of the server module. `entries.ts` then derives
   `ENTRIES`, `ENTRY_BY_REF`, and the best-lists eagerly at import time. On
   Cloudflare Workers, larger isolates mean slower cold starts and more memory
   pressure per isolate. The registry is the single largest in-memory structure
   in the SSR bundle.
2. **Build time / build memory.** Vite must read, transform, and embed the JSON;
   bundle/serialize steps scale with it. The three cold importers each inline the
   full blob into their chunk for the sake of a 25-item array or one date string,
   multiplying the embedded bytes across chunks.
3. **Bundle-size guardrails.** As the file grows toward and past Worker
   script-size limits (current Workers paid limit is 10 MiB compressed), the
   inlined registry eats into that budget even though end users never download it.

The growth driver is purely entry count: ~3.4 KB per entry, currently 948
entries. Linear projection: ~1,500 entries ≈ 5.1 MiB; ~1,800 ≈ 6.1 MiB; ~3,000 ≈
10.2 MiB. Category mix today (`mcp` 330, `tools` 128, `skills` 108, `hooks` 85,
`agents` 84, `guides` 65, `rules` 50, `statuslines` 42, `commands` 33,
`collections` 23) shows `mcp` already a third of the corpus — per-category shards
would be lopsided.

## Options

### Option A — Per-category shards, lazy-loaded

Split `entries[]` into `atlas-registry/<category>.json` shards plus a small
`atlas-registry.index.json` (schemaVersion, generatedAt, counts, artifact
contracts, changelog). Load shards on demand and merge.

- **Pros:** No single huge module. Routes scoped to one category (category
  listing, per-entry pages) load only that shard. Naturally extends the existing
  `/data/entries/<category>/` fan-out.
- **Cons:** The hot paths are **cross-category**: `ENTRY_BY_REF`,
  `related()`/`relatedGroups()` (relations cross categories), best-lists,
  trending, and `WEEKLY_BRIEF` all need many/all shards, so they would re-merge
  most of the corpus anyway and re-introduce the full in-memory structure. Shards
  are uneven (`mcp` ≈ 35%). Adds a merge/caching layer for marginal hot-path
  benefit. Best value is for the **cold** importers, which need no entries at all.

### Option B — Backing store for cold lookups (D1 / KV / ASSETS-fetch)

Keep a small synchronous core in-bundle; move bulk/cold lookups to a runtime
store.

- **B1 — ASSETS-fetch (extend current pattern).** Stop statically importing
  `entries[]`; serve it (whole or sharded) as a `/data/*.json` artifact and load
  it through the existing `loadJsonDataFile` + `cache()` path. Lowest-friction:
  reuses the exact mechanism `getSearchIndex()` already uses. Cost: hot callers
  become async (or a warm-once memo), which is the real refactor surface for the
  synchronous `entryByRef`/best-list consumers.
- **B2 — KV for point lookups.** Put `entryByRef` (`category/slug → entry`) in
  Workers KV. Great for single-entry reads (entry loader, `/og`, redirect); poor
  for set operations (best-lists, search, trending) that scan the whole corpus.
- **B3 — D1 for queryable reads.** Put entries in D1 and push filtering/sorting
  into SQL. Best long-term fit for search/facets/best-lists at large scale, but
  the heaviest lift: schema, migrations, query layer, and the build step becomes
  a DB sync. Overkill until the corpus is much larger.

- **Pros:** Removes bulk JSON from the SSR bundle; build/cold-start cost stops
  tracking entry count. B3 unlocks true server-side query.
- **Cons:** Introduces async + cache management on currently-synchronous hot
  paths. KV/D1 add infra and a build→store sync step. Risk of N+1 / per-request
  fetch latency if caching is wrong.

### Option C — Hybrid (recommended shape)

Combine the cheap wins from A/B without a premature rewrite:

1. **Now (cheap, low-risk): cut the cold importers off the blob.** Have
   `changelog.ts`, `validators.tsx`, and `sitemap[.]xml.ts` import a tiny
   `atlas-registry.meta.json` (`generatedAt` + the 25-item `changelog`) emitted
   by `build-content-index.mjs`, instead of the full registry. Removes ~3.6 MiB
   of inlined bytes from three chunks for near-zero effort and no async changes.
2. **At the trigger threshold: move the hot path to fetch-backed loading (B1).**
   Stop statically importing `entries[]`; serve it via a `/data/` artifact loaded
   through `loadJsonDataFile` with a warm-once server memo, so `ENTRIES` /
   `ENTRY_BY_REF` / best-lists build from the fetched array on first use and stay
   cached. This is the same pattern the search API already runs.
3. **Later, only if query load demands it:** layer KV (B2) for hot single-entry
   `entryByRef` and/or D1 (B3) for server-side search/facets. Defer until B1 is in
   place and metrics justify it.

## Recommendation

Adopt **Option C (hybrid)**:

- **Do step 1 opportunistically** (it is a self-contained, safe refactor that can
  ship independently of any threshold). It removes the largest avoidable cost —
  three chunks each inlining 3.6 MiB to read a date string — with no async churn.
- **Hold steps 2–3** until the [trigger threshold](#trigger-threshold) is hit.
  The hot path genuinely needs a cross-category in-memory structure today; B1
  preserves that behavior while removing the static inline, and it reuses an
  already-proven loader. Pure per-category sharding (Option A) is **not**
  recommended for the hot path because the cross-category lookups re-merge the
  corpus anyway. D1 (B3) is the right end state for large-scale querying but is
  premature now.

This sequences risk: a trivial win now, a proven-pattern migration at a measured
threshold, and infra (KV/D1) only when justified by data.

## Trigger threshold

Act on step 1 whenever convenient (no threshold). Begin step 2 (fetch-backed hot
path) when **any** of the following is true:

- `atlas-registry.json` ≥ **6 MiB** (currently 3.64 MiB; ~75% headroom), **or**
- entry count ≥ **1,800** (currently 948; ~1.9x headroom), **or**
- the deployed Worker script size enters **20%** of the platform limit (10 MiB
  compressed → act at **8 MiB compressed**), **or**
- SSR cold-start p95 regresses **>20%** vs. the prior month and the registry is
  on the critical import path.

Escalate to step 3 (KV/D1) only after step 2 ships **and** server-side
search/facet/best-list query time becomes the bottleneck (e.g. `registry.search`
p95 over its SLO under realistic load).

### How to check current values

```sh
# regenerate, then measure size + entry count
ENABLE_GITHUB_REPO_STATS=0 node scripts/build-content-index.mjs
wc -c < apps/web/src/generated/atlas-registry.json   # bytes
node -e "console.log(require('./apps/web/src/generated/atlas-registry.json').entries.length)"
```

A lightweight CI guard (warn when bytes/entries cross 80% of the trigger) would
turn this from a doc into an enforced signal; out of scope here but recommended
as a follow-up.

## Non-goals

- No change to the public `/data/*.json` artifact contracts or their consumers.
- No change to per-entry detail loading (`/data/entries/...`), which already
  scales independently.
- No client-side behavior change; the registry stays off the client either way.
