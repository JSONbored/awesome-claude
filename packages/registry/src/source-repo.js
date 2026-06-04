// Canonical parsing of a GitHub repository URL, shared by the registry content
// builder and the website's source-repo signal lookup so the two never drift.
//
// Accepts the formats authors actually paste into `repoUrl`:
//   - https/http, with or without a leading "www."
//   - a trailing slash, a query string, or a fragment
//   - deep paths (".../tree/main", ".../blob/...", ".../issues")
//   - a ".git" suffix
//   - the scp/SSH short form "git@github.com:owner/repo.git"
//   - the "git+https://", "git://", and "ssh://git@github.com/..." schemes
//
// Returns the case-preserved owner/repo plus a canonical https URL, or null.
// Callers derive their own dedup key from `owner`/`repo` (the registry keeps the
// original case; the website lowercases) so this module never dictates casing.

const GITHUB_HOST = "github.com";

// GitHub usernames/orgs: alphanumeric with single internal hyphens.
const OWNER_PATTERN = /^[A-Za-z0-9](?:[A-Za-z0-9-]*[A-Za-z0-9])?$/;
// GitHub repository names: alphanumeric plus "-", "_", and ".".
const REPO_PATTERN = /^[A-Za-z0-9._-]+$/;

// First path segments that are GitHub product surfaces, never repo owners.
// GitHub reserves these, so "github.com/sponsors/x" is never a repository.
const RESERVED_OWNERS = new Set([
  "about",
  "apps",
  "collections",
  "explore",
  "marketplace",
  "notifications",
  "orgs",
  "pulls",
  "settings",
  "sponsors",
  "topics",
]);

// Strip a single leading "www." so the www alias resolves to the bare host,
// while other subdomains (gist., api., raw.) stay distinct and get rejected.
function normalizeHost(host) {
  return String(host).toLowerCase().replace(/^www\./, "");
}

// Pull "owner" and "repo" from the first two non-empty path segments, dropping a
// trailing ".git". Deep paths (tree/blob/issues) keep their owner/repo prefix.
function ownerRepoFromPath(pathname) {
  const parts = String(pathname)
    .split("/")
    .filter(Boolean);
  if (parts.length < 2) return null;
  return { owner: parts[0], repo: parts[1].replace(/\.git$/i, "") };
}

// Parse the scp short form "user@host:owner/repo(.git)", which is not a URL and
// therefore cannot go through the URL parser.
function fromScpLike(value) {
  const match = /^[^/@\s]+@([^:/\s]+):(.+)$/.exec(value);
  if (!match) return null;
  const rest = match[2].replace(/\/+$/, "");
  const segments = rest.split("/").filter(Boolean);
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
    try {
      // Drop a "git+" prefix so "git+https://..." parses; "git://" and "ssh://"
      // are already valid URL schemes that keep their host and path.
      url = new URL(raw.replace(/^git\+/i, ""));
    } catch {
      return null;
    }
    const ownerRepo = ownerRepoFromPath(url.pathname);
    if (!ownerRepo) return null;
    parsed = { host: normalizeHost(url.hostname), ...ownerRepo };
  }

  const { host, owner, repo } = parsed;
  if (host !== GITHUB_HOST) return null;
  if (RESERVED_OWNERS.has(owner.toLowerCase())) return null;
  if (!OWNER_PATTERN.test(owner) || !REPO_PATTERN.test(repo)) return null;

  return { host, owner, repo, url: `https://github.com/${owner}/${repo}` };
}
