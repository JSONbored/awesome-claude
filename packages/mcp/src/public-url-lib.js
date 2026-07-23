/**
 * Pure public URL helpers for the publishable MCP package.
 *
 * Mirrors the registry source-url userinfo guards without importing
 * @heyclaude/registry, so packed tarballs stay self-contained.
 */

/**
 * Single-segment github.com paths that are product/marketing surfaces, not
 * user accounts. Kept in sync with `RESERVED_OWNERS` in
 * `packages/registry/src/source-repo-lib.js` — inlined here so the MCP tarball
 * stays free of a registry dependency.
 */
export const RESERVED_OWNERS = new Set([
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

function parseUrl(value) {
  const text = String(value ?? "").trim();
  if (!text) return null;
  try {
    return new URL(text);
  } catch {
    return null;
  }
}

export function hasEmbeddedUrlUserinfo(value) {
  const url = parseUrl(value);
  if (!url) return false;
  return Boolean(url.username || url.password);
}

export function isPublicHttpsUrl(value) {
  const text = String(value ?? "").trim();
  if (!text) return true;
  const url = parseUrl(value);
  if (!url) return false;
  return (
    url.protocol === "https:" && url.username === "" && url.password === ""
  );
}

/**
 * Return true for a single-segment GitHub profile URL without embedded userinfo.
 *
 * The single path segment must be a real account name, not a GitHub product
 * surface (`github.com/features`, `/sponsors`, `/about`, …). Mirrors the
 * registry `isPublicGitHubProfileUrl` classifier.
 *
 * @param {unknown} value
 * @returns {boolean}
 */
export function isPublicGitHubProfileUrl(value) {
  const url = parseUrl(value);
  if (!url) return false;
  const segments = url.pathname.split("/").filter(Boolean);
  const hostname = url.hostname.replace(/^www\./i, "").toLowerCase();
  return (
    url.protocol === "https:" &&
    url.username === "" &&
    url.password === "" &&
    hostname === "github.com" &&
    segments.length === 1 &&
    !RESERVED_OWNERS.has(segments[0].toLowerCase())
  );
}

export function publicUrlHostname(value) {
  const url = parseUrl(value);
  if (!url || url.username || url.password) return "";
  return url.hostname.replace(/^www\./i, "").toLowerCase();
}
