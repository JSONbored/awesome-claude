import { ENTRIES } from "./entries";
import type { Category, Entry, Platform, SourceStatus, TrustLevel } from "@/types/registry";

export interface SearchFilters {
  q?: string;
  categories?: Category[];
  platforms?: Platform[];
  trust?: TrustLevel[];
  source?: SourceStatus[];
  installable?: boolean;
  hasSafetyNotes?: boolean;
  sort?: "popular" | "newest" | "title";
}

export function search(filters: SearchFilters = {}): Entry[] {
  const q = filters.q?.trim().toLowerCase() ?? "";
  let rows = ENTRIES.filter((e) => {
    if (filters.categories?.length && !filters.categories.includes(e.category)) return false;
    if (filters.platforms?.length && !e.platforms.some((p) => filters.platforms!.includes(p)))
      return false;
    if (filters.trust?.length && !filters.trust.includes(e.trust)) return false;
    if (filters.source?.length && !filters.source.includes(e.source)) return false;
    if (filters.installable && !e.installCommand && !e.configSnippet && !e.fullCopy) return false;
    if (filters.hasSafetyNotes && !e.safetyNotes) return false;
    if (q) {
      const hay = [
        e.title,
        e.description,
        e.author,
        e.category,
        ...(e.tags ?? []),
        ...(e.keywords ?? []),
      ]
        .join(" ")
        .toLowerCase();
      if (!hay.includes(q)) return false;
    }
    return true;
  });

  const sort = filters.sort ?? "popular";
  rows = [...rows].sort((a, b) => {
    if (sort === "newest") return a.dateAdded < b.dateAdded ? 1 : -1;
    if (sort === "title") return a.title.localeCompare(b.title);
    return recommendedScore(b) - recommendedScore(a);
  });
  return rows;
}

function recommendedScore(entry: Entry) {
  const dateScore = Number.isNaN(Date.parse(entry.dateAdded || ""))
    ? 0
    : Date.parse(entry.dateAdded) / 86_400_000_000_000;
  return (
    (entry.packageVerified ? 20 : 0) +
    (entry.source === "first-party" ? 12 : entry.source === "source-backed" ? 8 : 0) +
    (entry.safetyNotes ? 6 : 0) +
    (entry.privacyNotes ? 4 : 0) +
    (entry.reviewed ? 4 : 0) +
    dateScore
  );
}

export function getEntry(category: string, slug: string): Entry | undefined {
  return ENTRIES.find((e) => e.category === category && e.slug === slug);
}

export function related(entry: Entry, limit = 4): Entry[] {
  return ENTRIES.filter((e) => e.slug !== entry.slug)
    .map((e) => {
      let score = 0;
      if (e.category === entry.category) score += 3;
      const overlap = e.tags.filter((t) => entry.tags.includes(t)).length;
      score += overlap * 2;
      return { e, score };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((x) => x.e);
}
