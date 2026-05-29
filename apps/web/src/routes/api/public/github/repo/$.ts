import { createFileRoute } from "@tanstack/react-router";

import { getEnvString } from "@/lib/cloudflare-env";

/**
 * GET /api/public/github/repo/<owner>/<repo>
 * Lightweight GitHub repo metadata: stars, forks, pushed_at, html_url.
 */

interface RepoMeta {
  fullName: string;
  stars: number;
  forks: number;
  pushedAt: string | null;
  htmlUrl: string;
  description: string | null;
  fetchedAt: string;
}

const cache = new Map<string, { at: number; data: RepoMeta }>();
const TTL_MS = 10 * 60 * 1000;

async function fetchRepo(slug: string): Promise<RepoMeta> {
  const cached = cache.get(slug);
  if (cached && Date.now() - cached.at < TTL_MS) return cached.data;

  const headers: HeadersInit = { accept: "application/vnd.github+json" };
  const token = getEnvString("GITHUB_TOKEN");
  if (token) headers.authorization = `Bearer ${token}`;

  const res = await fetch(`https://api.github.com/repos/${slug}`, { headers });
  if (!res.ok) throw new Error(`GitHub repo fetch failed (${res.status})`);
  const r = (await res.json()) as {
    full_name: string;
    stargazers_count: number;
    forks_count: number;
    pushed_at: string;
    html_url: string;
    description: string | null;
  };
  const data: RepoMeta = {
    fullName: r.full_name,
    stars: r.stargazers_count,
    forks: r.forks_count,
    pushedAt: r.pushed_at,
    htmlUrl: r.html_url,
    description: r.description,
    fetchedAt: new Date().toISOString(),
  };
  cache.set(slug, { at: Date.now(), data });
  return data;
}

// @ts-ignore Generated API route is added to routeTree during Vite build.
export const Route = createFileRoute("/api/public/github/repo/$")({
  server: {
    handlers: {
      GET: async ({ params }) => {
        const splat = params._splat ?? "";
        // Expect "owner/repo".
        if (!/^[\w.-]+\/[\w.-]+$/.test(splat)) {
          return new Response(JSON.stringify({ error: "Expected owner/repo" }), {
            status: 400,
            headers: { "Content-Type": "application/json" },
          });
        }
        try {
          const data = await fetchRepo(splat);
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
