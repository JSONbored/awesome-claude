import atlasRegistry from "@/generated/atlas-registry.json";
import { seoClusterDefinitions } from "@/data/seo-cluster-definitions";
import type { Category, Entry } from "@/types/registry";
import { buildEntry, type RegistryEntry } from "@/data/entry-normalize";

type RegistryChangelogEntry = {
  category: string;
  slug: string;
  title: string;
  dateAdded?: string;
  type?: string;
};

const registryEntries = (atlasRegistry.entries ?? []) as RegistryEntry[];
const registryChangelog = (atlasRegistry.changelog ?? []) as RegistryChangelogEntry[];
const generatedAt = atlasRegistry.generatedAt;
export const REGISTRY_GENERATED_AT = generatedAt;

export const ENTRIES: Entry[] = registryEntries.map(buildEntry);

export const BRIEF_ISSUES = registryChangelog.slice(0, 6).map((item, index) => ({
  slug: `registry-brief-${String(index + 1).padStart(3, "0")}`,
  number: registryChangelog.length - index,
  date: item.dateAdded ?? generatedAt.slice(0, 10),
  title: `${item.title} joined the registry`,
  summary: `${item.category}/${item.slug} was ${item.type ?? "updated"} in the latest registry snapshot.`,
  tags: [item.category, item.type ?? "updated"],
}));

export const WEEKLY_BRIEF = {
  generatedAt,
  issueNumber: registryChangelog.length,
  date: registryChangelog[0]?.dateAdded ?? generatedAt.slice(0, 10),
  newEntries: registryChangelog
    .filter((item) => item.type === "added")
    .slice(0, 6)
    .map((item) => ({
      ref: `${item.category}/${item.slug}`,
      title: item.title,
      date: item.dateAdded ?? generatedAt.slice(0, 10),
    })),
  trustedInstalls: ENTRIES.filter((entry) => entry.packageVerified || entry.trust === "trusted")
    .slice(0, 6)
    .map((entry) => ({
      ref: `${entry.category}/${entry.slug}`,
      title: entry.title,
      reason: entry.packageVerified
        ? "maintainer-built package metadata"
        : "strong registry trust signals",
    })),
  sourceBackedPicks: ENTRIES.filter(
    (entry) => entry.source !== "unverified" && (entry.safetyNotes || entry.privacyNotes),
  )
    .slice(0, 6)
    .map((entry) => ({
      ref: `${entry.category}/${entry.slug}`,
      title: entry.title,
      reason: "source-backed with safety or privacy notes",
    })),
  notableChanges: BRIEF_ISSUES.slice(0, 4),
};

export interface BestPick {
  ref: string;
  why: string;
  reachForInstead?: string;
}

export interface BestList {
  slug: string;
  title: string;
  subtitle: string;
  eyebrow: string;
  seoTitle: string;
  seoDescription: string;
  category: string;
  curator: string;
  updatedAt: string;
  count: number;
  intro: string;
  picks: BestPick[];
}

type BestListSeed = {
  slug: string;
  title: string;
  subtitle: string;
  eyebrow: string;
  seoTitle: string;
  seoDescription: string;
  categories: Category[];
  tags?: string[];
  keywords?: string[];
  requireSource?: boolean;
  requireInstallTrust?: boolean;
  itemLimit: number;
  intro: string;
};

const BEST_LIST_SEEDS: BestListSeed[] = seoClusterDefinitions.map((definition) => ({
  slug: definition.slug,
  title: definition.title,
  subtitle: definition.description,
  eyebrow: definition.eyebrow,
  seoTitle: definition.seoTitle,
  seoDescription: definition.seoDescription,
  categories: definition.categories as Category[],
  tags: definition.tags,
  keywords: definition.keywords,
  requireSource: definition.requireSource,
  requireInstallTrust: definition.requireInstallTrust,
  itemLimit: definition.itemLimit,
  intro: definition.description,
}));

function matchesBestListSeed(entry: Entry, seed: BestListSeed) {
  if (!seed.categories.includes(entry.category)) return false;
  if (seed.requireSource && entry.source === "unverified") return false;

  if (seed.requireInstallTrust) {
    const hasInstallSurface = Boolean(
      entry.installCommand || entry.configSnippet || entry.downloadUrl || entry.fullCopy,
    );
    const hasTrustedInstall =
      entry.packageVerified ||
      entry.trust === "trusted" ||
      entry.source === "first-party" ||
      entry.source === "source-backed";
    if (!hasInstallSurface || !hasTrustedInstall) return false;
  }

  return true;
}

function entryScore(entry: Entry, seed: BestListSeed) {
  const terms = [...(seed.tags ?? []), ...(seed.keywords ?? [])];
  const tagSet = new Set(
    [...(entry.tags ?? []), ...(entry.keywords ?? [])].map((tag) => tag.toLowerCase()),
  );
  const tagScore = terms.reduce(
    (score, tag) => score + (tagSet.has(tag.toLowerCase()) ? 10 : 0),
    0,
  );
  const searchableText = [
    entry.title,
    entry.description,
    entry.cardDescription,
    entry.category,
    ...(entry.tags ?? []),
    ...(entry.keywords ?? []),
  ]
    .join(" ")
    .toLowerCase();
  const textScore = terms.reduce(
    (score, term) => score + (searchableText.includes(term.toLowerCase()) ? 3 : 0),
    0,
  );
  return (
    tagScore +
    textScore +
    (entry.packageVerified ? 12 : 0) +
    (entry.safetyNotes ? 8 : 0) +
    (entry.privacyNotes ? 4 : 0) +
    (entry.source === "first-party" ? 6 : entry.source === "source-backed" ? 4 : 0) +
    (entry.reviewed ? 3 : 0)
  );
}

function makeBestPick(entry: Entry): BestPick {
  const reasons = [
    entry.packageVerified ? "maintainer-built package" : undefined,
    entry.safetyNotes ? "safety notes present" : undefined,
    entry.privacyNotes ? "privacy notes present" : undefined,
    entry.source !== "unverified" ? `${entry.source} source posture` : undefined,
  ].filter(Boolean);

  return {
    ref: `${entry.category}/${entry.slug}`,
    why: reasons.length
      ? `${entry.title} is included because it has ${reasons.join(", ")}.`
      : `${entry.title} is relevant to this use case, but should be reviewed before adoption.`,
    reachForInstead:
      entry.trust !== "trusted"
        ? "If this will touch credentials, local files, or production systems, inspect the upstream source first."
        : undefined,
  };
}

export const BEST_LISTS: BestList[] = BEST_LIST_SEEDS.map((seed) => {
  const candidates = ENTRIES.filter((entry) => matchesBestListSeed(entry, seed))
    .sort((a, b) => entryScore(b, seed) - entryScore(a, seed))
    .slice(0, seed.itemLimit);

  return {
    slug: seed.slug,
    title: seed.title,
    subtitle: seed.subtitle,
    eyebrow: seed.eyebrow,
    seoTitle: seed.seoTitle,
    seoDescription: seed.seoDescription,
    category: seed.categories[0] ?? "tools",
    curator: "@heyclaude-editors",
    updatedAt: generatedAt.slice(0, 10),
    count: candidates.length,
    intro: seed.intro,
    picks: candidates.map(makeBestPick),
  };
}).filter((list) => list.picks.length > 0);

export const QUALITY_STATS = {
  totalEntries: ENTRIES.length,
  sourceBacked: ENTRIES.filter((entry) => entry.source !== "unverified").length,
  withSafetyNotes: ENTRIES.filter((entry) => entry.safetyNotes).length,
  reviewed: ENTRIES.filter((entry) => entry.reviewed).length,
  trusted: ENTRIES.filter((entry) => entry.trust === "trusted").length,
  reviewFirst: ENTRIES.filter((entry) => entry.trust === "review").length,
};
