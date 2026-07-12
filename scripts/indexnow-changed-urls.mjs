import process from "node:process";

import {
  DEFAULT_INDEXNOW_BASE_URL,
  normalizeSiteUrl,
} from "./lib/indexnow.mjs";
import { entryHubUrls } from "./lib/indexnow-hubs.mjs";
import { parseRefs } from "./lib/indexnow-refs.mjs";

// Expand changed entry refs ("category/slug", passed as CLI args) into the set
// of URLs to notify IndexNow about: each entry plus the generated hubs whose
// content changes with it (category page, tag pages, category state reports).
// The entry's tags are read from the live entry-detail JSON so no registry
// build or extra dependency is needed; tag hubs are simply skipped when that
// JSON has not propagated yet (the daily cron re-catches them). The workflow
// validates every emitted URL (HTTP 200) before submitting.

async function fetchTags(base, ref) {
  try {
    const response = await fetch(
      `${base}/data/entries/${ref.category}/${ref.slug}.json`,
      { signal: AbortSignal.timeout(10_000) },
    );
    if (!response.ok) return [];
    const json = await response.json();
    const entry = json?.entry ?? json;
    return Array.isArray(entry?.tags) ? entry.tags : [];
  } catch {
    // Not propagated / unreachable — emit the entry + path-derived hubs only.
    return [];
  }
}

async function main() {
  const base = normalizeSiteUrl(
    process.env.INDEXNOW_BASE_URL || DEFAULT_INDEXNOW_BASE_URL,
  ).replace(/\/+$/, "");

  const refs = parseRefs(process.argv.slice(2));
  const urls = new Set();

  for (const ref of refs) {
    urls.add(`${base}/entry/${ref.category}/${ref.slug}`);
    const tags = await fetchTags(base, ref);
    for (const url of entryHubUrls({ ...ref, tags }, base)) urls.add(url);
  }

  for (const url of urls) console.log(url);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
});
