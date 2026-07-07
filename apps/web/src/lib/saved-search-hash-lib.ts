// Pure, deterministic hash for a saved search, split out of
// saved-search-manager.tsx so it can be unit-tested without React.

import type { SavedSearch } from "@/lib/recents";

/**
 * Stable base36 hash of a saved search's identifying fields (query plus the
 * category / trust / source / platform filters). Used to key saved-search alert
 * segments: equal searches hash equally; different searches (almost) always
 * differ. Deterministic — no ordering or clock dependence.
 */
export function hashSearch(s: SavedSearch): string {
  const raw = `${s.q}|${s.category ?? ""}|${s.trust ?? ""}|${s.source ?? ""}|${s.platform ?? ""}`;
  let h = 0;
  for (let i = 0; i < raw.length; i++) h = (h * 31 + raw.charCodeAt(i)) | 0;
  return Math.abs(h).toString(36);
}
