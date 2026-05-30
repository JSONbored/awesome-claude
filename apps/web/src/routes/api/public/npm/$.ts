import { createApiFileRoute } from "@/lib/api/file-route";

/**
 * GET /api/public/npm/<pkg>
 *
 * Lightweight proxy for npm package metadata.
 * Returns: { name, version, publishedAt, weeklyDownloads, homepage, repository }
 *
 * Cached at the edge: s-maxage 600, stale-while-revalidate 3600.
 */

interface NpmMeta {
  name: string;
  version: string;
  publishedAt: string | null;
  weeklyDownloads: number | null;
  homepage: string | null;
  repository: string | null;
  fetchedAt: string;
}

// In-memory cache (per isolate). Avoids hammering registry.npmjs.org.
const cache = new Map<string, { at: number; data: NpmMeta }>();
const TTL_MS = 10 * 60 * 1000; // 10 minutes

async function fetchMeta(pkg: string): Promise<NpmMeta> {
  const cached = cache.get(pkg);
  if (cached && Date.now() - cached.at < TTL_MS) return cached.data;

  const [latestRes, dlRes] = await Promise.allSettled([
    fetch(`https://registry.npmjs.org/${encodeURIComponent(pkg)}/latest`, {
      headers: { accept: "application/json" },
    }),
    fetch(`https://api.npmjs.org/downloads/point/last-week/${encodeURIComponent(pkg)}`, {
      headers: { accept: "application/json" },
    }),
  ]);

  if (latestRes.status !== "fulfilled" || !latestRes.value.ok) {
    throw new Error(`npm registry fetch failed for ${pkg}`);
  }

  const latest = (await latestRes.value.json()) as {
    name: string;
    version: string;
    homepage?: string;
    repository?: { url?: string } | string;
  };

  // The "latest" endpoint doesn't include time; pull from packument time if needed
  let publishedAt: string | null = null;
  try {
    const packumentRes = await fetch(`https://registry.npmjs.org/${encodeURIComponent(pkg)}`, {
      headers: { accept: "application/vnd.npm.install-v1+json" },
    });
    if (packumentRes.ok) {
      const p = (await packumentRes.json()) as { time?: Record<string, string> };
      publishedAt = p.time?.[latest.version] ?? null;
    }
  } catch {
    /* best effort */
  }

  let weeklyDownloads: number | null = null;
  if (dlRes.status === "fulfilled" && dlRes.value.ok) {
    const dl = (await dlRes.value.json()) as { downloads?: number };
    if (typeof dl.downloads === "number") weeklyDownloads = dl.downloads;
  }

  const repository =
    typeof latest.repository === "string" ? latest.repository : (latest.repository?.url ?? null);

  const data: NpmMeta = {
    name: latest.name,
    version: latest.version,
    publishedAt,
    weeklyDownloads,
    homepage: latest.homepage ?? null,
    repository,
    fetchedAt: new Date().toISOString(),
  };
  cache.set(pkg, { at: Date.now(), data });
  return data;
}

export const Route = createApiFileRoute("/api/public/npm/$")({
  server: {
    handlers: {
      GET: async ({ params }) => {
        const pkg = params._splat ?? "";
        if (!pkg || !/^@?[a-z0-9][\w./@-]{0,213}$/i.test(pkg)) {
          return new Response(JSON.stringify({ error: "Invalid package name" }), {
            status: 400,
            headers: { "Content-Type": "application/json" },
          });
        }
        try {
          const data = await fetchMeta(pkg);
          return new Response(JSON.stringify(data), {
            status: 200,
            headers: {
              "Content-Type": "application/json",
              "Cache-Control": "public, s-maxage=600, stale-while-revalidate=3600",
            },
          });
        } catch (err) {
          return new Response(JSON.stringify({ error: (err as Error).message }), {
            status: 502,
            headers: { "Content-Type": "application/json" },
          });
        }
      },
    },
  },
});
