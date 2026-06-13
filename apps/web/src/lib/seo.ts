import { siteConfig } from "@/lib/site";

function normalizePath(path: string) {
  if (!path || path === "/") return "/";
  return path.startsWith("/") ? path : `/${path}`;
}

export function absoluteUrl(path: string) {
  const normalized = normalizePath(path);
  return new URL(normalized, siteConfig.url).toString();
}
