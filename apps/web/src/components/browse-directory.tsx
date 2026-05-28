"use client";

import { useDeferredValue, useEffect, useMemo, useRef, useState } from "react";
import {
  Check,
  ClipboardCopy,
  Download,
  Link2,
  Star,
  Trash2,
} from "lucide-react";

import { DirectoryEntryCard } from "@/components/directory-entry-card";
import { SearchBar } from "@/components/search-bar";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { DirectoryEntry } from "@/lib/content";
import { useBrowseUrlSync } from "@/hooks/use-browse-url-sync";
import { useClientId } from "@/hooks/use-client-id";
import { useLoggedAsync } from "@/hooks/use-logged-async";
import { logClientError } from "@/lib/client-logs";
import { categoryLabels, siteConfig } from "@/lib/site";
import { categorySpec } from "@heyclaude/registry";

type BrowseDirectoryProps = {
  entries: DirectoryEntry[];
  initialQuery?: string;
  initialCategory?: string;
  initialUtilityFilter?: string;
  initialPlatformFilter?: string;
  initialSortMode?: string;
  initialCollection?: string;
  syncUrl?: boolean;
  limit?: number;
  entriesUrl?: string;
};

const COLLECTION_STORAGE_KEY = "heyclaude-local-collection-v1";
const COLLECTION_QUERY_PARAM = "collection";
const VOTE_QUERY_BATCH_SIZE = 120;
const VOTE_QUERY_MAX_ATTEMPTS = 3;
const VOTE_QUERY_RETRY_DELAYS_MS = [250, 900, 1800] as const;
const utilityFilterOptions = [
  { value: "all", label: "All Utility" },
  { value: "installable", label: "Installable" },
  { value: "trusted-package", label: "Trusted Package" },
  { value: "source-backed", label: "Source-backed" },
  { value: "brand-metadata", label: "Brand Metadata" },
  { value: "checksum", label: "Checksum" },
  { value: "adapter", label: "Adapter" },
  { value: "reviewed", label: "Reviewed" },
  { value: "verified", label: "Verified/Prod" },
  { value: "draft", label: "Draft" },
  { value: "hook-trigger", label: "Hook Trigger" },
  { value: "prerequisites", label: "Prerequisites" },
  { value: "safety-notes", label: "Safety Notes" },
  { value: "privacy-notes", label: "Privacy Notes" },
  { value: "troubleshooting", label: "Troubleshooting" },
] as const;
const quickTrustFilterOptions = [
  { value: "source-backed", label: "Source-backed" },
  { value: "trusted-package", label: "Trusted package" },
  { value: "safety-notes", label: "Safety notes" },
  { value: "privacy-notes", label: "Privacy notes" },
  { value: "reviewed", label: "Reviewed" },
  { value: "checksum", label: "Checksum" },
] as const;
const platformFilterOptions = [
  { value: "all", label: "All Platforms" },
  ...categorySpec.defaultTestedPlatforms.map((platform) => ({
    value: platform.toLowerCase(),
    label: platform,
  })),
] as const;
const sortModeOptions = ["popular", "newest", "title"] as const;

type DirectoryEntriesPayload = {
  entries?: DirectoryEntry[];
};

function normalizeCategory(value?: string) {
  const normalized = String(value || "")
    .trim()
    .toLowerCase();
  if (normalized === "all") return "all";
  return siteConfig.categoryOrder.includes(normalized) ? normalized : "all";
}

function normalizeUtilityFilter(value?: string) {
  const normalized = String(value || "")
    .trim()
    .toLowerCase();
  return utilityFilterOptions.some((option) => option.value === normalized)
    ? normalized
    : "all";
}

function normalizePlatformFilter(value?: string) {
  const normalized = String(value || "")
    .trim()
    .toLowerCase();
  return platformFilterOptions.some((option) => option.value === normalized)
    ? normalized
    : "all";
}

function readDirectoryEntries(payload: DirectoryEntriesPayload) {
  if (Array.isArray(payload.entries)) return payload.entries;
  return [];
}

function normalizeCollectionKeys(value?: string | null) {
  return String(value || "")
    .split(",")
    .map((item) => item.trim().toLowerCase())
    .filter((item, index, list) => {
      if (!/^[a-z0-9-]+:[a-z0-9-]+$/.test(item)) return false;
      return list.indexOf(item) === index;
    })
    .slice(0, 24);
}

function normalizeSortMode(value?: string) {
  const normalized = String(value || "")
    .trim()
    .toLowerCase();
  return sortModeOptions.includes(
    normalized as (typeof sortModeOptions)[number],
  )
    ? normalized
    : "popular";
}

function matchesUtilityFilter(entry: DirectoryEntry, filter: string) {
  switch (filter) {
    case "installable":
      return Boolean(
        entry.installable || entry.installCommand || entry.downloadUrl,
      );
    case "trusted-package":
      return (
        entry.downloadTrust === "first-party" || entry.packageVerified === true
      );
    case "source-backed":
      return entry.trustSignals?.sourceStatus === "available";
    case "brand-metadata":
      return Boolean(entry.brandDomain || entry.brandIconUrl);
    case "checksum":
      return entry.trustSignals?.checksumPresent === true;
    case "adapter":
      return entry.trustSignals?.adapterGenerated === true;
    case "reviewed":
      return Boolean(entry.reviewedBy || entry.claimStatus === "verified");
    case "verified":
      return (
        entry.verificationStatus === "validated" ||
        entry.verificationStatus === "production"
      );
    case "draft":
      return entry.verificationStatus === "draft";
    case "hook-trigger":
      return Boolean(entry.trigger);
    case "prerequisites":
      return Boolean(entry.hasPrerequisites || entry.prerequisites?.length);
    case "safety-notes":
      return Boolean(entry.safetyNotes?.length);
    case "privacy-notes":
      return Boolean(entry.privacyNotes?.length);
    case "troubleshooting":
      return entry.hasTroubleshooting === true;
    default:
      return true;
  }
}

function matchesPlatformFilter(entry: DirectoryEntry, filter: string) {
  if (filter === "all") return true;
  return (entry.platformCompatibility ?? []).some(
    (item) => item.platform.trim().toLowerCase() === filter,
  );
}

function entryMatchesBrowseQuery(
  entry: DirectoryEntry,
  normalizedQuery: string,
) {
  if (!normalizedQuery) return true;

  const haystack = [
    entry.title,
    entry.description,
    entry.author,
    entry.submittedBy,
    entry.brandName,
    entry.brandDomain,
    entry.trigger,
    entry.skillType,
    entry.skillLevel,
    entry.verificationStatus,
    entry.downloadTrust,
    ...(entry.platformCompatibility ?? []).flatMap((item) => [
      item.platform,
      item.supportLevel,
    ]),
    ...(entry.safetyNotes ?? []),
    ...(entry.privacyNotes ?? []),
    ...entry.tags,
    ...entry.keywords,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  return haystack.includes(normalizedQuery);
}

export function BrowseDirectory({
  entries,
  initialQuery = "",
  initialCategory: initialCategoryProp = "all",
  initialUtilityFilter: initialUtilityFilterProp = "all",
  initialPlatformFilter: initialPlatformFilterProp = "all",
  initialSortMode: initialSortModeProp = "popular",
  initialCollection = "",
  syncUrl = false,
  limit,
  entriesUrl,
}: BrowseDirectoryProps) {
  const isDefaultQuery = initialQuery.trim().length === 0;
  const initialSortMode = normalizeSortMode(initialSortModeProp);
  const initialCategory = normalizeCategory(initialCategoryProp);
  const initialUtilityFilter = normalizeUtilityFilter(initialUtilityFilterProp);
  const initialPlatformFilter = normalizePlatformFilter(
    initialPlatformFilterProp,
  );
  const [allEntries, setAllEntries] = useState(entries);
  const [hasLoadedFullEntries, setHasLoadedFullEntries] = useState(false);
  const [isLoadingFullEntries, setIsLoadingFullEntries] = useState(false);
  const getEntryKey = (entry: DirectoryEntry) =>
    `${entry.category}:${entry.slug}`;
  const [query, setQuery] = useState(initialQuery);
  const [category, setCategory] = useState(initialCategory);
  const [utilityFilter, setUtilityFilter] = useState(initialUtilityFilter);
  const [platformFilter, setPlatformFilter] = useState(initialPlatformFilter);
  const [sortMode, setSortMode] = useState(initialSortMode);
  const [visibleCount, setVisibleCount] = useState(limit ?? allEntries.length);
  const [clientId, setClientId] = useClientId("heyclaude-client-id");
  const [votesAvailable, setVotesAvailable] = useState(true);
  const [voteCounts, setVoteCounts] = useState<Record<string, number>>({});
  const [popularSortSnapshot, setPopularSortSnapshot] = useState<
    Record<string, number>
  >({});
  const [votedByMe, setVotedByMe] = useState<Record<string, boolean>>({});
  const [collectionKeys, setCollectionKeys] = useState<string[]>([]);
  const [collectionHydrated, setCollectionHydrated] = useState(false);
  const [collectionAction, setCollectionAction] = useState<string | null>(null);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);
  const deferredQuery = useDeferredValue(query);
  const normalizedQuery = deferredQuery.trim().toLowerCase();
  const initialCollectionKeys = useMemo(
    () => normalizeCollectionKeys(initialCollection),
    [initialCollection],
  );
  const collectionKeysFingerprint = useMemo(
    () => collectionKeys.join(","),
    [collectionKeys],
  );

  useEffect(() => {
    setAllEntries(entries);
    setHasLoadedFullEntries(false);
    setIsLoadingFullEntries(false);
  }, [entries]);

  const loadFullEntriesIfNeeded = async () => {
    if (!entriesUrl || hasLoadedFullEntries || isLoadingFullEntries) return;

    setIsLoadingFullEntries(true);
    try {
      const response = await fetch(entriesUrl, {
        method: "GET",
        cache: "force-cache",
      });
      if (!response.ok) return;

      const payload = (await response.json()) as DirectoryEntriesPayload;
      const nextEntries = readDirectoryEntries(payload);
      if (!Array.isArray(nextEntries) || nextEntries.length === 0) return;

      setAllEntries(nextEntries);
      setHasLoadedFullEntries(true);
    } catch (error) {
      logClientError("browse.full_entries_load_failed", error);
    } finally {
      setIsLoadingFullEntries(false);
    }
  };

  useEffect(() => {
    if (!entriesUrl) return;
    if (!isDefaultQuery) {
      void loadFullEntriesIfNeeded();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [entriesUrl, isDefaultQuery]);

  useEffect(() => {
    if (!entriesUrl || !collectionHydrated || !collectionKeysFingerprint)
      return;
    void loadFullEntriesIfNeeded();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [entriesUrl, collectionHydrated, collectionKeysFingerprint]);

  useBrowseUrlSync({
    enabled: syncUrl,
    query,
    category,
    utilityFilter,
    platformFilter,
    sortMode,
    normalizeCategory,
    normalizeUtilityFilter,
    normalizePlatformFilter,
    normalizeSortMode,
    setQuery,
    setCategory,
    setUtilityFilter,
    setPlatformFilter,
    setSortMode,
  });

  useEffect(() => {
    const urlKeys =
      initialCollectionKeys.length > 0
        ? initialCollectionKeys
        : normalizeCollectionKeys(
            new URLSearchParams(window.location.search).get(
              COLLECTION_QUERY_PARAM,
            ),
          );
    const storedKeys = normalizeCollectionKeys(
      window.localStorage.getItem(COLLECTION_STORAGE_KEY),
    );
    setCollectionKeys(urlKeys.length > 0 ? urlKeys : storedKeys);
    setCollectionHydrated(true);
  }, [initialCollectionKeys]);

  useEffect(() => {
    if (!collectionHydrated) return;
    if (collectionKeys.length > 0) {
      window.localStorage.setItem(
        COLLECTION_STORAGE_KEY,
        collectionKeys.join(","),
      );
    } else {
      window.localStorage.removeItem(COLLECTION_STORAGE_KEY);
    }
  }, [collectionHydrated, collectionKeys]);

  useEffect(() => {
    if (!collectionAction) return;
    const timer = window.setTimeout(() => setCollectionAction(null), 1600);
    return () => window.clearTimeout(timer);
  }, [collectionAction]);

  useEffect(() => {
    const baseScores: Record<string, number> = {};
    for (const entry of allEntries) {
      const key = getEntryKey(entry);
      baseScores[key] = 0;
    }
    setPopularSortSnapshot(baseScores);
  }, [allEntries]);

  useEffect(() => {
    if (!clientId || !allEntries.length) return;
    const keys = allEntries.map(getEntryKey);
    let cancelled = false;

    const loadVotesBatch = async (batchKeys: string[]) => {
      const response = await fetch("/api/votes/query", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          keys: batchKeys,
          clientId,
        }),
      });
      if (!response.ok) {
        throw new Error(`votes query failed: ${response.status}`);
      }
      return (await response.json()) as {
        counts?: Record<string, number>;
        voted?: Record<string, boolean>;
        available?: boolean;
      };
    };

    const loadVotesAllBatches = async () => {
      const counts: Record<string, number> = {};
      const voted: Record<string, boolean> = {};
      let available = true;

      for (let index = 0; index < keys.length; index += VOTE_QUERY_BATCH_SIZE) {
        const batch = keys.slice(index, index + VOTE_QUERY_BATCH_SIZE);
        const payload = await loadVotesBatch(batch);
        Object.assign(counts, payload.counts ?? {});
        Object.assign(voted, payload.voted ?? {});
        available = available && payload.available !== false;
      }

      return { counts, voted, available };
    };

    const loadVotes = async () => {
      for (let attempt = 1; attempt <= VOTE_QUERY_MAX_ATTEMPTS; attempt += 1) {
        try {
          const payload = await loadVotesAllBatches();
          if (cancelled) return;

          setVotesAvailable(Boolean(payload.available));
          setVoteCounts(payload.counts ?? {});
          setVotedByMe(payload.voted ?? {});
          if (payload.available) {
            setPopularSortSnapshot(payload.counts ?? {});
          }
          return;
        } catch {
          if (attempt >= VOTE_QUERY_MAX_ATTEMPTS || cancelled) break;
          const delay =
            VOTE_QUERY_RETRY_DELAYS_MS[
              Math.min(attempt - 1, VOTE_QUERY_RETRY_DELAYS_MS.length - 1)
            ];
          await new Promise((resolve) => window.setTimeout(resolve, delay));
        }
      }

      if (cancelled) return;
      setVotesAvailable(false);
    };

    void loadVotes();
    return () => {
      cancelled = true;
    };
  }, [allEntries, clientId]);

  const filteredEntries = useMemo(() => {
    const matched = allEntries.filter((entry) => {
      if (category !== "all" && entry.category !== category) return false;
      if (!matchesUtilityFilter(entry, utilityFilter)) return false;
      if (!matchesPlatformFilter(entry, platformFilter)) return false;
      return entryMatchesBrowseQuery(entry, normalizedQuery);
    });

    const sorted = [...matched].sort((left, right) => {
      const rightKey = getEntryKey(right);
      const leftKey = getEntryKey(left);
      const rightVotes = popularSortSnapshot[rightKey] ?? 0;
      const leftVotes = popularSortSnapshot[leftKey] ?? 0;

      if (sortMode === "newest") {
        return String(right.dateAdded ?? "").localeCompare(
          String(left.dateAdded ?? ""),
        );
      }
      if (sortMode === "title") {
        return left.title.localeCompare(right.title);
      }
      return rightVotes - leftVotes;
    });

    return sorted;
  }, [
    allEntries,
    category,
    normalizedQuery,
    popularSortSnapshot,
    platformFilter,
    sortMode,
    utilityFilter,
  ]);

  const trustChipCounts = useMemo(() => {
    const scopedEntries = allEntries.filter((entry) => {
      if (category !== "all" && entry.category !== category) return false;
      if (!matchesPlatformFilter(entry, platformFilter)) return false;
      return entryMatchesBrowseQuery(entry, normalizedQuery);
    });

    return Object.fromEntries(
      quickTrustFilterOptions.map((option) => [
        option.value,
        scopedEntries.filter((entry) =>
          matchesUtilityFilter(entry, option.value),
        ).length,
      ]),
    ) as Record<(typeof quickTrustFilterOptions)[number]["value"], number>;
  }, [allEntries, category, normalizedQuery, platformFilter]);

  const entryByKey = useMemo(() => {
    return new Map(allEntries.map((entry) => [getEntryKey(entry), entry]));
  }, [allEntries]);

  const collectionEntries = useMemo(() => {
    return collectionKeys
      .map((key) => entryByKey.get(key))
      .filter((entry): entry is DirectoryEntry => Boolean(entry));
  }, [collectionKeys, entryByKey]);

  useEffect(() => {
    setVisibleCount(limit ?? filteredEntries.length);
  }, [
    category,
    deferredQuery,
    filteredEntries.length,
    limit,
    platformFilter,
    sortMode,
    utilityFilter,
  ]);

  useEffect(() => {
    if (!limit) return;
    const target = loadMoreRef.current;
    if (!target) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries[0]?.isIntersecting) return;
        if (entriesUrl && !hasLoadedFullEntries && !isLoadingFullEntries) {
          void loadFullEntriesIfNeeded();
          return;
        }
        setVisibleCount((current) =>
          Math.min(current + limit, filteredEntries.length),
        );
      },
      { rootMargin: "400px 0px" },
    );

    observer.observe(target);
    return () => observer.disconnect();
  }, [
    entriesUrl,
    filteredEntries.length,
    hasLoadedFullEntries,
    isLoadingFullEntries,
    limit,
  ]);

  useEffect(() => {
    if (!entriesUrl) return;
    if (
      category !== initialCategory ||
      utilityFilter !== initialUtilityFilter ||
      platformFilter !== initialPlatformFilter ||
      sortMode !== initialSortMode ||
      query.trim().length > 0
    ) {
      void loadFullEntriesIfNeeded();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [entriesUrl, category, utilityFilter, platformFilter, sortMode, query]);

  const displayedEntries = useMemo(() => {
    if (!limit) return filteredEntries;
    return filteredEntries.slice(0, visibleCount);
  }, [filteredEntries, limit, visibleCount]);

  const handleToggleVote = async (entry: DirectoryEntry, nextVote: boolean) => {
    const key = getEntryKey(entry);
    let effectiveClientId = clientId;
    if (!effectiveClientId) {
      effectiveClientId =
        window.localStorage.getItem("heyclaude-client-id") ??
        crypto.randomUUID();
      window.localStorage.setItem("heyclaude-client-id", effectiveClientId);
      setClientId(effectiveClientId);
    }

    const previousCount = votesAvailable ? (voteCounts[key] ?? 0) : 0;
    const previousVoted = votedByMe[key] ?? false;
    const optimisticCount = Math.max(0, previousCount + (nextVote ? 1 : -1));

    setVoteCounts((current) => ({ ...current, [key]: optimisticCount }));
    setVotedByMe((current) => ({ ...current, [key]: nextVote }));

    try {
      const response = await fetch("/api/votes/toggle", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          key,
          clientId: effectiveClientId,
          vote: nextVote,
        }),
      });

      if (!response.ok) {
        throw new Error(`toggle failed with ${response.status}`);
      }

      const payload = (await response.json()) as {
        count: number;
        voted: boolean;
      };

      setVoteCounts((current) => ({
        ...current,
        [key]: Number(payload.count ?? 0),
      }));
      setVotedByMe((current) => ({
        ...current,
        [key]: Boolean(payload.voted),
      }));
      window.dispatchEvent(
        new CustomEvent("heyclaude:intent", {
          detail: { type: "vote", entryKey: key },
        }),
      );

      return {
        count: Number(payload.count ?? 0),
        voted: Boolean(payload.voted),
      };
    } catch {
      setVoteCounts((current) => ({ ...current, [key]: previousCount }));
      setVotedByMe((current) => ({ ...current, [key]: previousVoted }));
      return {
        count: previousCount,
        voted: previousVoted,
      };
    }
  };

  const toggleCollectionEntry = (entry: DirectoryEntry) => {
    const key = getEntryKey(entry);
    setCollectionKeys((current) => {
      if (current.includes(key)) {
        return current.filter((item) => item !== key);
      }
      return [...current, key].slice(0, 24);
    });
  };

  const buildCollectionUrl = () => {
    const url = new URL(window.location.href);
    url.pathname = "/browse";
    url.search = "";
    if (collectionKeys.length > 0) {
      url.searchParams.set(COLLECTION_QUERY_PARAM, collectionKeys.join(","));
    }
    return url.toString();
  };

  const buildCollectionMarkdown = () => {
    return [
      "# HeyClaude collection",
      "",
      ...collectionEntries.map((entry) => {
        const href = `${window.location.origin}/${entry.category}/${entry.slug}`;
        return `- [${entry.title}](${href}) - ${entry.cardDescription || entry.description}`;
      }),
      "",
    ].join("\n");
  };

  const copyCollection = useLoggedAsync(
    "browse.collection.copy_failed",
    async (kind: "markdown" | "share") => {
      const value =
        kind === "share" ? buildCollectionUrl() : buildCollectionMarkdown();
      await navigator.clipboard.writeText(value.trim());
      setCollectionAction(kind);
    },
  );

  const exportCollectionJson = () => {
    const payload = {
      schemaVersion: 1,
      kind: "heyclaude-local-collection",
      generatedAt: new Date().toISOString(),
      entries: collectionEntries.map((entry) => ({
        key: getEntryKey(entry),
        title: entry.title,
        category: entry.category,
        slug: entry.slug,
        url: `/${entry.category}/${entry.slug}`,
        description: entry.cardDescription || entry.description,
        sourceStatus: entry.trustSignals?.sourceStatus ?? null,
        downloadTrust: entry.downloadTrust ?? null,
      })),
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "heyclaude-collection.json";
    anchor.click();
    URL.revokeObjectURL(url);
    setCollectionAction("json");
  };

  return (
    <div className="space-y-6">
      <div className="hero-search">
        <SearchBar
          value={query}
          onChange={setQuery}
          placeholder="Search tools, agents, skills, authors..."
        />
        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger
            aria-label="Category"
            className="directory-select-trigger"
          >
            <SelectValue placeholder="All Categories" />
          </SelectTrigger>
          <SelectContent className="directory-select-content">
            <SelectItem value="all">All Categories</SelectItem>
            {siteConfig.categoryOrder.map((item) => (
              <SelectItem key={item} value={item}>
                {categoryLabels[item]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={utilityFilter} onValueChange={setUtilityFilter}>
          <SelectTrigger
            aria-label="Utility filter"
            className="directory-select-trigger sm:w-[12rem]"
          >
            <SelectValue placeholder="All Utility" />
          </SelectTrigger>
          <SelectContent className="directory-select-content">
            {utilityFilterOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={platformFilter} onValueChange={setPlatformFilter}>
          <SelectTrigger
            aria-label="Platform filter"
            className="directory-select-trigger sm:w-[12rem]"
          >
            <SelectValue placeholder="All Platforms" />
          </SelectTrigger>
          <SelectContent className="directory-select-content">
            {platformFilterOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={sortMode} onValueChange={setSortMode}>
          <SelectTrigger aria-label="Sort" className="directory-select-trigger">
            <SelectValue placeholder="Most Popular" />
          </SelectTrigger>
          <SelectContent className="directory-select-content">
            <SelectItem value="popular">Most Popular</SelectItem>
            <SelectItem value="newest">Newest</SelectItem>
            <SelectItem value="title">A-Z</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center justify-between gap-4 text-sm text-muted-foreground">
        <p>{filteredEntries.length} results found</p>
        {normalizedQuery ? <p>Filtering for “{deferredQuery}”</p> : null}
      </div>

      <div className="surface-panel p-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold text-foreground">
              Trust quick filters
            </p>
            <p className="mt-1 text-xs leading-6 text-muted-foreground">
              Narrow discovery by source, install, safety, privacy, and review
              signals before opening a listing.
            </p>
          </div>
          {utilityFilter !== "all" ? (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setUtilityFilter("all")}
              className="h-8 rounded-lg px-3 text-[11px]"
            >
              Clear utility filter
            </Button>
          ) : null}
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          {quickTrustFilterOptions.map((option) => {
            const isActive = utilityFilter === option.value;
            return (
              <button
                key={option.value}
                type="button"
                onClick={() =>
                  setUtilityFilter(isActive ? "all" : option.value)
                }
                className={
                  isActive
                    ? "rounded-full border border-primary bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground"
                    : "rounded-full border border-border bg-background px-3 py-1.5 text-xs font-medium text-muted-foreground transition hover:border-primary/45 hover:text-foreground"
                }
              >
                {option.label} ({trustChipCounts[option.value] ?? 0})
              </button>
            );
          })}
        </div>
      </div>

      {collectionKeys.length > 0 ? (
        <section className="surface-panel space-y-4 p-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-sm font-semibold text-foreground">
                Compare tray - {collectionEntries.length} saved
              </p>
              <p className="mt-1 text-xs leading-6 text-muted-foreground">
                Stored locally in this browser.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => copyCollection("share")}
                className="h-8 rounded-lg px-3 text-[11px]"
              >
                {collectionAction === "share" ? (
                  <Check className="mr-1.5 size-3.5" />
                ) : (
                  <Link2 className="mr-1.5 size-3.5" />
                )}
                Share
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => copyCollection("markdown")}
                className="h-8 rounded-lg px-3 text-[11px]"
              >
                {collectionAction === "markdown" ? (
                  <Check className="mr-1.5 size-3.5" />
                ) : (
                  <ClipboardCopy className="mr-1.5 size-3.5" />
                )}
                Markdown
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={exportCollectionJson}
                className="h-8 rounded-lg px-3 text-[11px]"
              >
                {collectionAction === "json" ? (
                  <Check className="mr-1.5 size-3.5" />
                ) : (
                  <Download className="mr-1.5 size-3.5" />
                )}
                JSON
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setCollectionKeys([])}
                className="h-8 rounded-lg px-3 text-[11px]"
              >
                <Trash2 className="mr-1.5 size-3.5" />
                Clear
              </Button>
            </div>
          </div>

          {collectionEntries.length > 0 ? (
            <>
              <div className="flex flex-wrap gap-2">
                {collectionEntries.map((entry) => (
                  <a
                    key={getEntryKey(entry)}
                    href={`/${entry.category}/${entry.slug}`}
                    className="rounded-full border border-border bg-background px-2.5 py-1 text-xs text-foreground transition hover:border-primary/45"
                  >
                    {entry.title}
                  </a>
                ))}
              </div>
              <div className="overflow-x-auto rounded-xl border border-border bg-background">
                <table className="min-w-full divide-y divide-border text-left text-xs">
                  <thead className="bg-card/80 text-muted-foreground">
                    <tr>
                      <th className="px-3 py-2 font-medium">Entry</th>
                      <th className="px-3 py-2 font-medium">Category</th>
                      <th className="px-3 py-2 font-medium">Source</th>
                      <th className="px-3 py-2 font-medium">Install</th>
                      <th className="px-3 py-2 font-medium">Safety</th>
                      <th className="px-3 py-2 font-medium">Privacy</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {collectionEntries.map((entry) => (
                      <tr key={`compare:${getEntryKey(entry)}`}>
                        <td className="max-w-[14rem] px-3 py-2">
                          <a
                            href={`/${entry.category}/${entry.slug}`}
                            className="font-medium text-foreground transition hover:text-primary"
                          >
                            {entry.title}
                          </a>
                        </td>
                        <td className="px-3 py-2 text-muted-foreground">
                          {categoryLabels[entry.category] ?? entry.category}
                        </td>
                        <td className="px-3 py-2 text-muted-foreground">
                          {entry.trustSignals?.sourceStatus === "available"
                            ? "Available"
                            : "Missing"}
                        </td>
                        <td className="px-3 py-2 text-muted-foreground">
                          {entry.downloadTrust === "first-party" ||
                          entry.packageVerified
                            ? "Trusted"
                            : entry.installCommand || entry.downloadUrl
                              ? "Review"
                              : "None"}
                        </td>
                        <td className="px-3 py-2 text-muted-foreground">
                          {entry.safetyNotes?.length
                            ? `${entry.safetyNotes.length} note(s)`
                            : "Missing"}
                        </td>
                        <td className="px-3 py-2 text-muted-foreground">
                          {entry.privacyNotes?.length
                            ? `${entry.privacyNotes.length} note(s)`
                            : "Missing"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          ) : null}
        </section>
      ) : null}

      <div className="space-y-4">
        {displayedEntries.map((entry) => (
          <div key={`${entry.category}-${entry.slug}`} className="space-y-2">
            <div className="flex justify-end">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => toggleCollectionEntry(entry)}
                aria-pressed={collectionKeys.includes(getEntryKey(entry))}
                className="h-8 rounded-lg px-3 text-[11px]"
              >
                <Star className="mr-1.5 size-3.5" />
                {collectionKeys.includes(getEntryKey(entry)) ? "Saved" : "Save"}
              </Button>
            </div>
            <DirectoryEntryCard
              entry={entry}
              voteCount={
                votesAvailable ? (voteCounts[getEntryKey(entry)] ?? 0) : 0
              }
              hasVoted={votedByMe[getEntryKey(entry)] ?? false}
              onToggleVote={handleToggleVote}
            />
          </div>
        ))}

        {filteredEntries.length === 0 ? (
          <div className="surface-panel p-8 text-sm text-muted-foreground">
            No entries matched that search.
          </div>
        ) : null}

        {limit && displayedEntries.length < filteredEntries.length ? (
          <div
            ref={loadMoreRef}
            className="py-4 text-center text-sm text-muted-foreground"
          >
            Loading more entries...
          </div>
        ) : null}
      </div>
    </div>
  );
}
