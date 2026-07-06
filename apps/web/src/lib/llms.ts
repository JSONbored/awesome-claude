/**
 * Generators for /llms.txt and /llms-full.txt.
 *
 * - llms.txt: short, link-only manifest of the registry, grouped by category.
 * - llms-full.txt: full descriptions + install/config snippets, ready to drop
 *   into a model's context window.
 *
 * Both are deterministic for a given registry snapshot so ETags are stable.
 */
import { ENTRIES, REGISTRY_ENTRIES } from "@/data/entries";
import { CATEGORIES } from "@/types/registry";
import { etagFor } from "@/lib/feeds";
import { ifNoneMatchMatches } from "@/lib/http-cache";
import { applySecurityHeaders } from "@/lib/security-headers";
import { buildEntryCitationFacts } from "@heyclaude/registry";
import {
  buildLlmsFullTxt as buildLlmsFullTxtFromContext,
  buildLlmsTxt as buildLlmsTxtFromContext,
  originOf,
} from "@/lib/llms-surface-lib";

export { originOf };

export function buildLlmsTxt(origin: string): string {
  return buildLlmsTxtFromContext(origin, {
    categories: CATEGORIES,
    entries: ENTRIES,
  });
}

export function buildLlmsFullTxt(origin: string): string {
  return buildLlmsFullTxtFromContext(origin, {
    categories: CATEGORIES,
    entries: ENTRIES,
    registryEntries: REGISTRY_ENTRIES,
    buildCitationFacts: buildEntryCitationFacts,
  });
}

const TEXT_CACHE = "public, max-age=300, stale-while-revalidate=3600";

export async function respondText(request: Request, body: string): Promise<Response> {
  const etag = await etagFor(body);
  const headers = applySecurityHeaders(
    new Headers({
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": TEXT_CACHE,
      ETag: etag,
    }),
  );
  if (ifNoneMatchMatches(request.headers.get("if-none-match"), etag)) {
    return new Response(null, { status: 304, headers });
  }
  return new Response(body, { headers });
}
