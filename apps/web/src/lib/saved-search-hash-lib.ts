// Pure, deterministic hash for a saved search, split out of
// saved-search-manager.tsx so it can be unit-tested without React.

import type { SavedSearch } from "@/lib/recents";

/**
 * Escape the `|` field delimiter (and the `\` escape character itself) so no
 * field's content can shift across a boundary and forge another search's hash
 * input. Fields containing neither character are returned unchanged, so
 * existing delimiter-free searches keep their current hash.
 */
function escapeField(value: string | undefined): string {
  return (value ?? "").replaceAll("\\", "\\\\").replaceAll("|", "\\|");
}

/**
 * Stable base36 hash of a saved search's identifying fields (query plus the
 * category / trust / source / platform / signal filters). Used to key
 * saved-search alert segments: equal searches hash equally, and differing
 * searches hash differently because each field is delimiter-escaped before
 * joining. Deterministic — no ordering or clock dependence.
 *
 * `signal` is appended only when set, so two searches differing solely by
 * trust-signal filter hash differently while searches with no signal keep their
 * existing hash (no alert-segment churn / migration).
 */
export function hashSearch(s: SavedSearch): string {
  const fields = [s.q, s.category, s.trust, s.source, s.platform];
  if (s.signal) fields.push(s.signal);
  const raw = fields.map(escapeField).join("|");
  let h = 0;
  for (let i = 0; i < raw.length; i++) h = (h * 31 + raw.charCodeAt(i)) | 0;
  return Math.abs(h).toString(36);
}
