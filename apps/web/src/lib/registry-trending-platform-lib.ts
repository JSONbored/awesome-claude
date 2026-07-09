// Pure platform-matching helpers for the registry trending API route: normalize
// platform strings, expand query aliases, collect an entry's platforms, and test
// membership. Split out of the route so they can be unit-tested without the handler.

import type { Entry } from "@/types/registry";

/** Lowercase + trim a platform string. */
export function normalizePlatform(value: string): string {
  return value.trim().toLowerCase();
}

/** Expand a platform query value to the set of ids it should match. */
export function platformAliases(value: string): string[] {
  const platform = normalizePlatform(value);
  if (!platform) return [];
  if (platform === "claude") return ["claude", "claude-code", "claude-desktop"];
  if (platform === "vs code") return ["vscode"];
  return [platform];
}

/** Normalized set of platforms an entry supports (platforms + compatibility). */
export function entryPlatforms(entry: Entry): string[] {
  const values = new Set<string>();
  for (const platform of entry.platforms ?? []) values.add(normalizePlatform(platform));
  for (const item of entry.platformCompatibility ?? [])
    values.add(normalizePlatform(item.platform));
  return [...values];
}

/** True when the entry supports the queried platform (empty query matches all). */
export function matchesPlatform(entry: Entry, value: string): boolean {
  const platforms = platformAliases(value);
  if (!platforms.length) return true;
  const supported = entryPlatforms(entry);
  return platforms.some((platform) => supported.includes(platform));
}
