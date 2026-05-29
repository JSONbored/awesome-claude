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
    return (b.stars ?? 0) - (a.stars ?? 0);
  });
  return rows;
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
