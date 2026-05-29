/**
 * POST /api/public/github/webhook
 *
 * Receives GitHub push/release events from jsonbored/awesome-claude (the
 * canonical content repo). Verifies X-Hub-Signature-256 against
 * GITHUB_WEBHOOK_SECRET, derives registry events from the changed file
 * paths, and writes them into the edge cache so /api/public/alerts can
 * surface them to watchers without a database.
 *
 * The handler uses Web Crypto so webhook verification stays compatible with
 * Workers and does not pull Node crypto into the browser build graph.
 */
import { createApiFileRoute } from "@/lib/api/file-route";

import { getEnvString } from "@/lib/cloudflare-env.server";

const ALLOWED_REPO = "jsonbored/awesome-claude";
const ALLOWED_BRANCH = "main";
const CACHE_KEY = "https://heyclau.de/internal/alerts-cache";

export interface RegistryEvent {
  id: string;
  kind: "entry" | "changelog" | "validator" | "unknown";
  category?: string;
  slug?: string;
  action: "added" | "updated" | "removed";
  commit: string;
  date: string;
  title?: string;
}

interface PushFile {
  added?: string[];
  modified?: string[];
  removed?: string[];
  id?: string;
  timestamp?: string;
  message?: string;
}

function toHex(buffer: ArrayBuffer) {
  return [...new Uint8Array(buffer)].map((byte) => byte.toString(16).padStart(2, "0")).join("");
}

function timingSafeStringEqual(left: string, right: string) {
  if (left.length !== right.length) return false;
  let diff = 0;
  for (let index = 0; index < left.length; index += 1) {
    diff |= left.charCodeAt(index) ^ right.charCodeAt(index);
  }
  return diff === 0;
}

async function verify(secret: string, signature: string | null, body: string): Promise<boolean> {
  if (!signature || !signature.startsWith("sha256=")) return false;
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const digest = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(body));
  const expected = `sha256=${toHex(digest)}`;
  return timingSafeStringEqual(signature, expected);
}

function classify(
  path: string,
  action: "added" | "updated" | "removed",
  commit: string,
  date: string,
): RegistryEvent | null {
  // content/<category>/<slug>.mdx
  const m = path.match(/^content\/([^/]+)\/([^/]+)\.(?:mdx?|json)$/);
  if (m) {
    return {
      id: `${commit}:${path}`,
      kind: "entry",
      category: m[1],
      slug: m[2],
      action,
      commit,
      date,
    };
  }
  if (/^content\/changelog/.test(path) || /registry-changelog\.json$/.test(path)) {
    return { id: `${commit}:${path}`, kind: "changelog", action, commit, date };
  }
  if (/validators/.test(path)) {
    return { id: `${commit}:${path}`, kind: "validator", action, commit, date };
  }
  return null;
}

async function appendEvents(events: RegistryEvent[]): Promise<void> {
  // Best-effort write to the edge cache. On workerd, `caches.default` exists;
  // in local dev it may not, in which case we silently no-op.
  const c = (globalThis as { caches?: CacheStorage }).caches;
  if (!c || !("default" in (c as unknown as Record<string, unknown>))) return;
  const cache = (c as unknown as { default: Cache }).default;
  const req = new Request(CACHE_KEY);
  let existing: RegistryEvent[] = [];
  try {
    const hit = await cache.match(req);
    if (hit) existing = (await hit.json()) as RegistryEvent[];
  } catch {
    /* empty cache */
  }
  const merged = [...events, ...existing].slice(0, 500);
  await cache.put(
    req,
    new Response(JSON.stringify(merged), {
      headers: { "Content-Type": "application/json", "Cache-Control": "max-age=86400" },
    }),
  );
}

export const Route = createApiFileRoute("/api/public/github/webhook")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const secret = getEnvString("GITHUB_WEBHOOK_SECRET");
        if (!secret) return new Response("Webhook not configured", { status: 503 });

        const body = await request.text();
        const sig = request.headers.get("x-hub-signature-256");
        if (!(await verify(secret, sig, body))) {
          return new Response("Invalid signature", { status: 401 });
        }

        const event = request.headers.get("x-github-event") ?? "";
        if (event === "ping") return new Response("pong");

        let payload: Record<string, unknown>;
        try {
          payload = JSON.parse(body);
        } catch {
          return new Response("Invalid JSON", { status: 400 });
        }

        const repo = (payload.repository as { full_name?: string } | undefined)?.full_name;
        if (repo && repo !== ALLOWED_REPO) {
          return new Response("Unknown repo", { status: 403 });
        }

        const events: RegistryEvent[] = [];

        if (event === "push") {
          const ref = String(payload.ref ?? "");
          if (ref !== `refs/heads/${ALLOWED_BRANCH}`) {
            return new Response("Ignored branch", { status: 200 });
          }
          const commits = (payload.commits ?? []) as PushFile[];
          for (const c of commits) {
            const commit = c.id ?? "unknown";
            const date = c.timestamp ?? new Date().toISOString();
            for (const p of c.added ?? []) {
              const ev = classify(p, "added", commit, date);
              if (ev) events.push(ev);
            }
            for (const p of c.modified ?? []) {
              const ev = classify(p, "updated", commit, date);
              if (ev) events.push(ev);
            }
            for (const p of c.removed ?? []) {
              const ev = classify(p, "removed", commit, date);
              if (ev) events.push(ev);
            }
          }
        } else if (event === "release") {
          const rel = payload.release as
            | { tag_name?: string; published_at?: string; html_url?: string }
            | undefined;
          events.push({
            id: `release:${rel?.tag_name ?? Date.now()}`,
            kind: "changelog",
            action: "added",
            commit: rel?.tag_name ?? "release",
            date: rel?.published_at ?? new Date().toISOString(),
            title: rel?.tag_name,
          });
        } else {
          return new Response("Ignored event", { status: 200 });
        }

        if (events.length) await appendEvents(events);
        return new Response(JSON.stringify({ ok: true, count: events.length }), {
          headers: { "Content-Type": "application/json" },
        });
      },
    },
  },
});
