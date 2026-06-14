import { ENTRIES, entryByRef } from "./entries";
import type {
  Category,
  Entry,
  EntryRelationType,
  Platform,
  SourceStatus,
  TrustLevel,
} from "@/types/registry";

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
  return entryByRef(category, slug);
}

export function related(entry: Entry, limit = 4): Entry[] {
  const graphEntries = (entry.relatedEntries ?? [])
    .map((relation) => entryByRef(relation.category, relation.slug))
    .filter((candidate): candidate is Entry => Boolean(candidate))
    .filter((candidate) => candidate.category !== entry.category || candidate.slug !== entry.slug)
    .slice(0, limit);

  if (graphEntries.length > 0) return graphEntries;

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

// Order for surfacing relation groups (most decision-relevant first). "duplicate" is excluded.
const RELATION_ORDER: EntryRelationType[] = [
  "alternative",
  "works-with",
  "complementary",
  "extends",
  "prerequisite",
  "same-project",
  "same-ecosystem",
  "collection-member",
  "related",
];

// Group an entry's graph relations by their typed relation, so the entry page can render labeled
// "Works with" / "Alternatives" / "Prerequisites" sections. Returns [] when there's no graph
// relation data (the caller falls back to the flat related() grid).
export function relatedGroups(
  entry: Entry,
  perGroup = 6,
): { relation: EntryRelationType; entries: Entry[] }[] {
  const byRelation = new Map<EntryRelationType, Entry[]>();
  for (const rel of entry.relatedEntries ?? []) {
    if (rel.relation === "duplicate") continue;
    const candidate = entryByRef(rel.category, rel.slug);
    if (!candidate) continue;
    if (candidate.category === entry.category && candidate.slug === entry.slug) continue;
    const list = byRelation.get(rel.relation) ?? [];
    if (!byRelation.has(rel.relation)) byRelation.set(rel.relation, list);
    if (
      list.length < perGroup &&
      !list.some((e) => e.category === candidate.category && e.slug === candidate.slug)
    ) {
      list.push(candidate);
    }
  }
  return RELATION_ORDER.map((relation) => ({
    relation,
    entries: byRelation.get(relation) ?? [],
  })).filter((g) => g.entries.length > 0);
}
