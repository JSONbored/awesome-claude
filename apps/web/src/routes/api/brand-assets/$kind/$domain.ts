import { createApiFileRoute } from "@/lib/api/file-route";

import { normalizeBrandDomain } from "@heyclaude/registry/brand-assets";

import { brandAssetParamsSchema } from "@/lib/api/contracts";
import { apiError, createApiHandler, type InferApiParams } from "@/lib/api/router";
import { getEnvString } from "@/lib/cloudflare-env.server";
import { applySecurityHeaders } from "@/lib/security-headers";

const CACHE_CONTROL = "public, max-age=86400, stale-while-revalidate=604800";
const MAX_BRAND_ASSET_BYTES = 1024 * 1024;
const TRUSTED_BRAND_ASSET_HOSTS = new Set(["asset.brandfetch.io", "cdn.brandfetch.io"]);
const TRUSTED_BRAND_ASSET_CONTENT_TYPES = new Set([
  "image/avif",
  "image/jpeg",
  "image/png",
  "image/webp",
]);

function brandfetchClientId() {
  return getEnvString("BRANDFETCH_CLIENT_ID", "NEXT_PUBLIC_BRANDFETCH_CLIENT_ID");
}

type BrandSearchResult = {
  icon?: string | null;
  domain?: string | null;
  name?: string | null;
};

async function resolveBrandIconUrl(domain: string, clientId: string) {
  const searchUrl = new URL(`https://api.brandfetch.io/v2/search/${encodeURIComponent(domain)}`);
  searchUrl.searchParams.set("c", clientId);

  const searchResponse = await fetch(searchUrl, {
    headers: { accept: "application/json" },
    signal: AbortSignal.timeout(6000),
  });
  if (!searchResponse.ok) return "";

  const results = (await searchResponse.json()) as BrandSearchResult[];
  if (!Array.isArray(results)) return "";

  const exact =
    results.find((result) => normalizeBrandDomain(result.domain) === domain) || results[0];
  return typeof exact?.icon === "string" ? exact.icon : "";
}

function normalizeTrustedBrandAssetUrl(value: string) {
  try {
    const parsed = new URL(value);
    if (parsed.protocol !== "https:") return "";
    if (!TRUSTED_BRAND_ASSET_HOSTS.has(parsed.hostname.toLowerCase())) {
      return "";
    }
    return parsed.toString();
  } catch {
    return "";
  }
}

async function fetchTrustedBrandAsset(value: string) {
  let upstreamUrl = normalizeTrustedBrandAssetUrl(value);
  if (!upstreamUrl) return null;

  for (let redirectCount = 0; redirectCount <= 3; redirectCount += 1) {
    const upstream = await fetch(upstreamUrl, {
      headers: {
        accept: "image/avif,image/webp,image/png,image/jpeg,image/*;q=0.8",
      },
      redirect: "manual",
      signal: AbortSignal.timeout(6000),
    });

    if (upstream.status >= 300 && upstream.status < 400 && upstream.headers.has("location")) {
      const nextUrl = new URL(upstream.headers.get("location") || "", upstreamUrl).toString();
      upstreamUrl = normalizeTrustedBrandAssetUrl(nextUrl);
      if (!upstreamUrl) return null;
      continue;
    }

    return upstream;
  }

  return null;
}

async function readArrayBufferWithinLimit(response: Response, maxBytes: number) {
  const declaredLength = Number(response.headers.get("content-length"));
  if (Number.isFinite(declaredLength) && declaredLength > maxBytes) {
    return null;
  }

  if (!response.body) {
    const buffer = await response.arrayBuffer();
    return buffer.byteLength <= maxBytes ? buffer : null;
  }

  const reader = response.body.getReader();
  const chunks: Uint8Array[] = [];
  let receivedBytes = 0;

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    receivedBytes += value.byteLength;
    if (receivedBytes > maxBytes) {
      await reader.cancel();
      return null;
    }
    chunks.push(value);
  }

  const body = new Uint8Array(receivedBytes);
  let offset = 0;
  for (const chunk of chunks) {
    body.set(chunk, offset);
    offset += chunk.byteLength;
  }
  return body.buffer;
}

export const GET = createApiHandler("brandAsset.read", async ({ params, requestId }) => {
  const { domain } = params as InferApiParams<typeof brandAssetParamsSchema>;
  const normalizedDomain = normalizeBrandDomain(domain);
  const clientId = brandfetchClientId();

  if (!normalizedDomain) {
    return apiError("invalid_brand_domain", 400, { requestId });
  }
  if (!clientId) {
    return apiError("brand_asset_not_configured", 503, { requestId });
  }

  const upstreamCandidate = await resolveBrandIconUrl(normalizedDomain, clientId);
  if (!upstreamCandidate) {
    return apiError("brand_asset_not_found", 404, { requestId });
  }

  const upstream = await fetchTrustedBrandAsset(upstreamCandidate);
  if (!upstream) {
    return apiError("brand_asset_invalid", 502, { requestId });
  }

  if (!upstream.ok) {
    return apiError("brand_asset_not_found", 404, { requestId });
  }

  const contentType = upstream.headers.get("content-type") || "image/png";
  const normalizedContentType = contentType.toLowerCase().split(";")[0].trim();
  if (!TRUSTED_BRAND_ASSET_CONTENT_TYPES.has(normalizedContentType)) {
    return apiError("brand_asset_invalid", 502, { requestId });
  }

  const body = await readArrayBufferWithinLimit(upstream, MAX_BRAND_ASSET_BYTES);
  if (!body) {
    return apiError("brand_asset_too_large", 502, { requestId });
  }

  const headers = applySecurityHeaders(new Headers());
  headers.set("cache-control", CACHE_CONTROL);
  headers.set("content-type", normalizedContentType);
  headers.set("x-brand-asset-source", "brandfetch");

  return new Response(body, {
    status: 200,
    headers,
  });
});

export const Route = createApiFileRoute("/api/brand-assets/$kind/$domain")({
  server: {
    handlers: {
      GET: async ({ request, params }) => GET(request, { params }),
    },
  },
});
