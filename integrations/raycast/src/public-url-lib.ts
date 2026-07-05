/**
 * Pure public URL helpers for the publishable Raycast extension.
 *
 * Mirrors registry source-url userinfo guards without importing
 * @heyclaude/registry so the extension bundle stays self-contained.
 */

function parseUrl(value: unknown) {
  const text = String(value ?? "").trim();
  if (!text) return null;
  try {
    return new URL(text);
  } catch {
    return null;
  }
}

export function hasEmbeddedUrlUserinfo(value: unknown) {
  const url = parseUrl(value);
  if (!url) return false;
  return Boolean(url.username || url.password);
}

export function isPublicHttpsUrl(value: unknown) {
  const text = String(value ?? "").trim();
  if (!text) return false;
  const url = parseUrl(value);
  if (!url) return false;
  return (
    url.protocol === "https:" && url.username === "" && url.password === ""
  );
}

export function publicUrlHostname(value: unknown) {
  const url = parseUrl(value);
  if (!url || url.username || url.password) return "";
  return url.hostname.replace(/^www\./i, "").toLowerCase();
}
