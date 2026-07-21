import { siteConfig } from "@/lib/site";

function normalizePath(path: string) {
  if (!path || path === "/") return "/";
  return path.startsWith("/") ? path : `/${path}`;
}

export function absoluteUrl(path: string) {
  const normalized = normalizePath(path);
  return new URL(normalized, siteConfig.url).toString();
}

/**
 * Clamp a meta/OG description to a search-display-safe length (~155 chars; Google
 * truncates around 160). Collapses whitespace and cuts on a word boundary.
 */
export function clampDescription(value: string, max = 155) {
  const normalized = value.replace(/\s+/g, " ").trim();
  if (normalized.length <= max) return normalized;
  const slice = normalized.slice(0, max - 1);
  const lastSpace = slice.lastIndexOf(" ");
  return `${(lastSpace > 40 ? slice.slice(0, lastSpace) : slice).trimEnd()}…`;
}
