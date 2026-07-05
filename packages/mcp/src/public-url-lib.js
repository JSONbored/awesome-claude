/**
 * Pure public URL helpers for the publishable MCP package.
 *
 * Mirrors the registry source-url userinfo guards without importing
 * @heyclaude/registry, so packed tarballs stay self-contained.
 */

function parseUrl(value) {
  const text = String(value ?? "").trim();
  if (!text) return null;
  try {
    return new URL(text);
  } catch {
    return null;
  }
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

export function isPublicGitHubProfileUrl(value) {
  const url = parseUrl(value);
  if (!url) return false;
  return (
    url.protocol === "https:" &&
    url.username === "" &&
    url.password === "" &&
    url.hostname === "github.com" &&
    url.pathname.split("/").filter(Boolean).length === 1
  );
}

export function publicUrlHostname(value) {
  const url = parseUrl(value);
  if (!url || url.username || url.password) return "";
  return url.hostname.replace(/^www\./i, "").toLowerCase();
}
