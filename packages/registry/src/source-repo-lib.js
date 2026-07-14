/**
 * Pure GitHub repository URL parsing helpers.
 *
 * Canonicalizes the repo URL formats authors paste into submissions so registry
 * builders and website source-repo lookups never drift. Nothing here touches the
 * network — given the same URL string the output is deterministic.
 *
 * The public surface (`source-repo.js` / `@heyclaude/registry/source-repo`)
 * re-exports everything below so existing imports stay unchanged.
 */

import { hasEmbeddedUrlUserinfo } from "./source-url-lib.js";

const GITHUB_HOST = "github.com";

// GitHub usernames/orgs: alphanumeric with single internal hyphens.
const OWNER_PATTERN = /^[A-Za-z0-9](?:[A-Za-z0-9-]*[A-Za-z0-9])?$/;
// GitHub repository names: alphanumeric plus "-", "_", and ".".
const REPO_PATTERN = /^[A-Za-z0-9._-]+$/;

// First path segments that are GitHub product surfaces, never repo owners.
// GitHub reserves these names, so "github.com/sponsors/x" or
// "github.com/features/copilot" is a product/marketing/auth page, not a
// repository. Two-segment marketing URLs (features/*, enterprise/*,
// customer-stories/*) otherwise slip through as bogus owner/repo pairs, which
// inflates source-provenance scoring and makes the source-repo signal refresher
// query repos that cannot exist. Keep lowercase; membership is case-folded.
const RESERVED_OWNERS = new Set([
  "about",
  "account",
  "apps",
  "business",
  "codespaces",
  "collections",
  "contact",
  "customer-stories",
  "dashboard",
  "education",
  "enterprise",
  "explore",
  "features",
  "issues",
  "join",
  "login",
  "logout",
  "marketplace",
  "new",
  "nonprofits",
  "notifications",
  "organizations",
  "orgs",
  "pricing",
  "pulls",
  "readme",
  "search",
  "security",
  "sessions",
  "settings",
  "signup",
  "sponsors",
  "stars",
  "team",
  "topics",
  "trending",
  "watching",
]);

// Strip a single leading "www." so the www alias resolves to the bare host,
// while other subdomains (gist., api., raw.) stay distinct and get rejected.
function normalizeHost(host) {
  return String(host)
    .toLowerCase()
    .replace(/^www\./, "");
}

// Pull "owner" and "repo" from the first two non-empty path segments, dropping a
// trailing ".git". Deep paths (tree/blob/issues) keep their owner/repo prefix.
function ownerRepoFromPath(pathname) {
  const parts = String(pathname).split("/").filter(Boolean);
  if (parts.length < 2) return null;
  return { owner: parts[0], repo: parts[1].replace(/\.git$/i, "") };
}

// Parse the scp short form "user@host:owner/repo(.git)", which is not a URL and
// therefore cannot go through the URL parser.
function fromScpLike(value) {
  const match = /^[^/@\s]+@([^:/\s]+):(.+)$/.exec(value);
  if (!match) return null;
  // No trailing-slash regex: split("/").filter(Boolean) already drops empty
  // segments from trailing slashes, so we avoid the polynomial /\/+$/ scan
  // (CodeQL js/polynomial-redos) entirely.
  const segments = match[2].split("/").filter(Boolean);
  if (segments.length < 2) return null;
  return {
    host: normalizeHost(match[1]),
    owner: segments[0],
    repo: segments[1].replace(/\.git$/i, ""),
  };
}

/**
 * Parse a GitHub repository reference into its canonical parts.
 *
 * @param {unknown} value A repo URL in any of the supported formats.
 * @returns {{ host: string, owner: string, repo: string, url: string } | null}
 */
export function parseGitHubRepoUrl(value) {
  const raw = String(value ?? "").trim();
  if (!raw) return null;

  let parsed = fromScpLike(raw);

  if (!parsed) {
    let url;
    const parseableUrl = raw.replace(/^git\+/i, "");
    try {
      // Drop a "git+" prefix so "git+https://..." parses; "git://" and "ssh://"
      // are already valid URL schemes that keep their host and path.
      url = new URL(parseableUrl);
    } catch {
      return null;
    }
    const ownerRepo = ownerRepoFromPath(url.pathname);
    if (!ownerRepo) return null;
    if (
      (url.protocol === "http:" || url.protocol === "https:") &&
      hasEmbeddedUrlUserinfo(parseableUrl)
    ) {
      return null;
    }
    parsed = { host: normalizeHost(url.hostname), ...ownerRepo };
  }

  const { host, owner, repo } = parsed;
  if (host !== GITHUB_HOST) return null;
  if (RESERVED_OWNERS.has(owner.toLowerCase())) return null;
  if (!OWNER_PATTERN.test(owner) || !REPO_PATTERN.test(repo)) return null;

  return { host, owner, repo, url: `https://github.com/${owner}/${repo}` };
}
