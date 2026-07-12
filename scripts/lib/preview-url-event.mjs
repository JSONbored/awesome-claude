// Pure event/environment helpers behind scripts/resolve-pr-preview-url.mjs:
// deriving preview-URL candidates and PR/commit identity from the GitHub Actions
// event payload and environment. Split out - with event and env injected - so the
// identity logic can be unit-tested without the GitHub API or a live workflow.

/** Ordered env-provided preview URL candidates; the shared dev worker is opt-in. */
export function previewCandidatesFromEnv(env = process.env) {
  const candidates = [
    { url: env.PREVIEW_DEPLOYMENT_URL, source: "PREVIEW_DEPLOYMENT_URL" },
    {
      url: env.DEPLOYMENT_PREVIEW_BASE_URL,
      source: "DEPLOYMENT_PREVIEW_BASE_URL",
    },
    { url: env.CLOUDFLARE_PREVIEW_URL, source: "CLOUDFLARE_PREVIEW_URL" },
  ];
  if (env.ALLOW_SHARED_DEV_WORKER_PREVIEW === "1") {
    candidates.push({
      url: env.CLOUDFLARE_DEV_WORKER_URL,
      source: "CLOUDFLARE_DEV_WORKER_URL",
    });
  }
  return candidates;
}

/** GitHub deployment lookup queries (by sha/ref) from the event and environment. */
export function deploymentQueries(event, env = process.env) {
  const pullRequest = event.pull_request || {};
  return [
    pullRequest.head?.sha ? { sha: pullRequest.head.sha } : null,
    pullRequest.head?.ref ? { ref: pullRequest.head.ref } : null,
    env.GITHUB_HEAD_REF ? { ref: env.GITHUB_HEAD_REF } : null,
    env.GITHUB_REF_NAME ? { ref: env.GITHUB_REF_NAME } : null,
    env.GITHUB_SHA ? { sha: env.GITHUB_SHA } : null,
  ].filter(Boolean);
}

/** The PR head SHA from the event, falling back to GITHUB_SHA, else "". */
export function headSha(event, env = process.env) {
  const pullRequest = event.pull_request || {};
  return pullRequest.head?.sha || env.GITHUB_SHA || "";
}

/** The PR number from the event, or parsed from a refs/pull/<n>/ ref, else null. */
export function prNumber(event, env = process.env) {
  const fromEvent = event?.pull_request?.number ?? event?.number;
  if (fromEvent) return Number(fromEvent);
  // refs/pull/<n>/merge (or /head) when no event file is present.
  const match = String(env.GITHUB_REF || "").match(/refs\/pull\/(\d+)\//);
  return match ? Number(match[1]) : null;
}

/**
 * True when a comment body references the current head SHA (full, 8- or 7-char
 * prefix). With no resolvable head SHA the check passes so nothing is filtered.
 */
export function commentMatchesHeadSha(body, event, env = process.env) {
  const sha = headSha(event, env).trim().toLowerCase();
  if (!sha) return true;
  const normalizedBody = String(body || "").toLowerCase();
  return [sha, sha.slice(0, 8), sha.slice(0, 7)].some(
    (candidate) => candidate.length >= 7 && normalizedBody.includes(candidate),
  );
}
