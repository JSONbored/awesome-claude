import {
  Action,
  ActionPanel,
  Alert,
  Cache,
  Clipboard,
  Color,
  Icon,
  List,
  LocalStorage,
  PopToRootType,
  Toast,
  confirmAlert,
  getPreferenceValues,
  showHUD,
  showToast,
} from "@raycast/api";
import { useFrecencySorting } from "@raycast/utils";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  FAVORITES_KEY,
  absoluteDataUrl,
  buildEntrySummary,
  buildInstallNotesSummary,
  normalizeNotes,
  buildContributeEntryUrl,
  buildSuggestChangeUrl,
  categoryLabel,
  entryHasConfigSnippet,
  entryHasInstallCommand,
  entryKey,
  filterEntriesBySearchText,
  parseFavoriteKeys,
  resolveConfiguredFeedUrl,
  serializeFavoriteKeys,
  sortedCategoryOptions,
  type RaycastEntry,
} from "./feed";
import {
  CreateConfigSnippetAction,
  CreateInstallSnippetAction,
} from "./create-snippet-actions";
import {
  fetchFreshFeed,
  fetchRegistrySearch,
  loadCachedFeed as loadCachedFeedFromRuntime,
  loadEntryDetail,
} from "./runtime";
import { markdownLink, withRaycastUtm } from "./links";
import { entryDetailMetadata } from "./raycast-ui";
import {
  MCP_INSTALL_TARGETS,
  buildMcpInstallPlan,
  installMcpServer,
  mcpServerExists,
  resolveMcpCli,
  type McpInstallTargetId,
} from "./mcp-installer";

const cache = new Cache();
const SEARCH_PAGE_SIZE = 20;
const SERVER_SEARCH_UNAVAILABLE_MESSAGE =
  "Search is temporarily unavailable. Try again shortly.";
type CliMcpInstallTargetId = Extract<
  McpInstallTargetId,
  "claude-code" | "codex"
>;

function isCliMcpInstallTargetId(
  targetId: McpInstallTargetId,
): targetId is CliMcpInstallTargetId {
  return targetId === "claude-code" || targetId === "codex";
}

type RegistryCommandOptions = {
  fixedCategory?: string;
  searchPlaceholder?: string;
};

type ServerSearchState = {
  status: "idle" | "loading" | "ready" | "failed";
  query: string;
  category: string;
  filterKey: string;
  entries: RaycastEntry[];
  total: number;
  nextOffset: number | null;
  isLoading: boolean;
  error?: string;
};

const categoryIcons: Record<string, Icon> = {
  agents: Icon.Person,
  mcp: Icon.Network,
  tools: Icon.AppWindow,
  skills: Icon.Hammer,
  rules: Icon.TextDocument,
  commands: Icon.Terminal,
  hooks: Icon.Bolt,
  guides: Icon.Book,
  collections: Icon.Folder,
  statuslines: Icon.BarChart,
};

type RegistrySearchFilters = {
  category?: string;
  platform?: string;
  installable?: "true" | "false";
  hasSafetyNotes?: "true" | "false";
  hasPrivacyNotes?: "true" | "false";
  downloadTrust?: "first-party" | "external" | "none";
  sourceStatus?: "available" | "missing";
};

type ResolvedRegistryFilter = {
  favorites: boolean;
  localCategory?: string;
  search: RegistrySearchFilters;
};

const advancedFilterOptions = [
  { value: "installable", title: "Installable" },
  { value: "source:available", title: "Source-backed" },
  { value: "platform:claude-code", title: "Claude Code" },
  { value: "trust:first-party", title: "First-party Packages" },
  { value: "trust:external", title: "External Packages" },
  { value: "safety:true", title: "Has Safety Notes" },
  { value: "privacy:true", title: "Has Privacy Notes" },
];

function hostFromUrl(value?: string) {
  const trimmed = String(value || "").trim();
  if (!trimmed) return "";
  try {
    return new URL(trimmed).hostname.replace(/^www\./, "").toLowerCase();
  } catch {
    return "";
  }
}

function raycastEntryIcon(entry: RaycastEntry, feedUrl: string) {
  const brandIconUrl = String(entry.brandIconUrl || "").trim();
  if (brandIconUrl) return { source: absoluteDataUrl(brandIconUrl, feedUrl) };

  const fallbackDomain =
    entry.brandDomain ||
    hostFromUrl(entry.repoUrl) ||
    hostFromUrl(entry.documentationUrl);
  if (fallbackDomain) {
    return {
      source: absoluteDataUrl(
        `/api/brand-assets/icon/${fallbackDomain}`,
        feedUrl,
      ),
    };
  }

  const fallbackIcon = categoryIcons[entry.category] ?? Icon.Document;
  const fallbackColor =
    entry.category === "mcp"
      ? Color.Blue
      : entry.category === "skills"
        ? Color.Green
        : entry.category === "hooks"
          ? Color.Orange
          : Color.SecondaryText;
  return { source: fallbackIcon, tintColor: fallbackColor };
}

function getConfiguredFeed() {
  return {
    feedUrl: resolveConfiguredFeedUrl(
      getPreferenceValues<{ feedUrlOverride?: string }>(),
    ),
  };
}

function loadCachedFeed(feedUrl: string) {
  return loadCachedFeedFromRuntime(cache, feedUrl);
}

async function loadFavorites() {
  const raw = await LocalStorage.getItem<string>(FAVORITES_KEY);
  if (!raw) return new Set<string>();

  try {
    return new Set(parseFavoriteKeys(raw));
  } catch {
    await LocalStorage.removeItem(FAVORITES_KEY);
    return new Set<string>();
  }
}

async function persistFavorites(favorites: Set<string>) {
  await LocalStorage.setItem(FAVORITES_KEY, serializeFavoriteKeys(favorites));
}

function metadataAccessories(entry: RaycastEntry, isFavorite: boolean) {
  const accessories: List.Item.Accessory[] = [];

  if (isFavorite) {
    accessories.push({
      icon: { source: Icon.Star, tintColor: Color.Yellow },
      tooltip: "Favorite",
    });
  }
  if (entry.downloadTrust === "first-party") {
    accessories.push({
      icon: { source: Icon.CheckCircle, tintColor: Color.Green },
      tooltip: "First-party package",
    });
  }
  if (entry.installable || entry.hasConfigSnippet || entry.hasInstallCommand) {
    accessories.push({
      icon: { source: Icon.Download, tintColor: Color.Blue },
      tooltip: "Installable — has an install command or config snippet",
    });
  }
  if (entry.trustSignals?.sourceStatus === "available" || entry.repoUrl) {
    accessories.push({
      icon: { source: Icon.Shield, tintColor: Color.Green },
      tooltip: "Source-backed",
    });
  }
  if (
    entry.trustSignals?.hasSafetyNotes ||
    entry.trustSignals?.hasPrivacyNotes ||
    entry.safetyNotes?.length ||
    entry.privacyNotes?.length
  ) {
    accessories.push({
      icon: { source: Icon.ExclamationMark, tintColor: Color.Orange },
      tooltip: "Has safety / privacy notes — review before installing",
    });
  }

  return accessories;
}

function fixedCategoryOptions(category: string) {
  return [
    { value: "all", title: `All ${categoryLabel(category)}` },
    { value: "favorites", title: "Favorites" },
    ...advancedFilterOptions,
  ];
}

function resolveRegistryFilter(
  filter: string,
  fixedCategory?: string,
): ResolvedRegistryFilter {
  const resolved: ResolvedRegistryFilter = {
    favorites: filter === "favorites",
    localCategory: fixedCategory,
    search: {},
  };
  if (fixedCategory) resolved.search.category = fixedCategory;

  if (!fixedCategory && filter !== "all" && filter !== "favorites") {
    resolved.localCategory = filter.includes(":") ? undefined : filter;
    if (!filter.includes(":")) resolved.search.category = filter;
  }

  if (filter === "installable") resolved.search.installable = "true";
  if (filter === "source:available") resolved.search.sourceStatus = "available";
  if (filter === "platform:claude-code")
    resolved.search.platform = "claude-code";
  if (filter === "trust:first-party")
    resolved.search.downloadTrust = "first-party";
  if (filter === "trust:external") resolved.search.downloadTrust = "external";
  if (filter === "safety:true") resolved.search.hasSafetyNotes = "true";
  if (filter === "privacy:true") resolved.search.hasPrivacyNotes = "true";

  return resolved;
}

function registryFilterKey(filters: RegistrySearchFilters) {
  return [
    filters.category || "",
    filters.platform || "",
    filters.installable || "",
    filters.hasSafetyNotes || "",
    filters.hasPrivacyNotes || "",
    filters.downloadTrust || "",
    filters.sourceStatus || "",
  ].join("|");
}

function entryMatchesResolvedFilter(
  entry: RaycastEntry,
  resolved: ResolvedRegistryFilter,
  favorites: Set<string>,
) {
  if (resolved.favorites && !favorites.has(entryKey(entry))) return false;
  if (resolved.localCategory && entry.category !== resolved.localCategory) {
    return false;
  }
  if (
    resolved.search.platform &&
    !(entry.platformCompatibility || []).some((platform) =>
      platform.toLowerCase().includes(resolved.search.platform || ""),
    )
  ) {
    return false;
  }
  if (
    resolved.search.installable === "true" &&
    !entry.installable &&
    !entry.hasConfigSnippet &&
    !entry.hasInstallCommand
  ) {
    return false;
  }
  if (
    resolved.search.sourceStatus === "available" &&
    entry.trustSignals?.sourceStatus !== "available" &&
    !entry.repoUrl
  ) {
    return false;
  }
  if (
    resolved.search.downloadTrust &&
    entry.downloadTrust !== resolved.search.downloadTrust
  ) {
    return false;
  }
  if (
    resolved.search.hasSafetyNotes === "true" &&
    !entry.trustSignals?.hasSafetyNotes &&
    !entry.safetyNotes?.length
  ) {
    return false;
  }
  if (
    resolved.search.hasPrivacyNotes === "true" &&
    !entry.trustSignals?.hasPrivacyNotes &&
    !entry.privacyNotes?.length
  ) {
    return false;
  }
  return true;
}

function filterRegistryEntries(
  entries: RaycastEntry[],
  filter: string,
  favorites: Set<string>,
  fixedCategory?: string,
) {
  const resolved = resolveRegistryFilter(filter, fixedCategory);
  return entries.filter((entry) =>
    entryMatchesResolvedFilter(entry, resolved, favorites),
  );
}

function createEmptyServerSearchState(): ServerSearchState {
  return {
    status: "idle",
    query: "",
    category: "",
    filterKey: "",
    entries: [],
    total: 0,
    nextOffset: null,
    isLoading: false,
  };
}

export function createRegistryCommand(options: RegistryCommandOptions = {}) {
  return function RegistryCommand() {
    const configuredFeed = getConfiguredFeed();
    const cachedFeed = loadCachedFeed(configuredFeed.feedUrl);
    const [entries, setEntries] = useState<RaycastEntry[]>(cachedFeed.entries);
    const [generatedAt, setGeneratedAt] = useState(cachedFeed.generatedAt);
    const [isLoading, setIsLoading] = useState(entries.length === 0);
    const [filter, setFilter] = useState("all");
    const [favorites, setFavorites] = useState<Set<string>>(new Set());
    const [searchText, setSearchText] = useState("");
    const [serverSearch, setServerSearch] = useState<ServerSearchState>(
      createEmptyServerSearchState,
    );
    const entriesCountRef = useRef(entries.length);

    useEffect(() => {
      entriesCountRef.current = entries.length;
    }, [entries.length]);

    async function refreshEntries(showSuccess = false) {
      setIsLoading(true);
      try {
        const nextFeed = await fetchFreshFeed({
          cache,
          feedUrl: configuredFeed.feedUrl,
        });
        entriesCountRef.current = nextFeed.entries.length;
        setEntries(nextFeed.entries);
        setGeneratedAt(nextFeed.generatedAt);
        if (showSuccess) {
          const isCurrent = nextFeed.refreshStatus === "unchanged";
          const isStale = nextFeed.refreshStatus === "stale";
          await showToast({
            style: isStale ? Toast.Style.Failure : Toast.Style.Success,
            title: isStale
              ? "Could not check for feed updates"
              : isCurrent
                ? "HeyClaude feed already current"
                : "HeyClaude feed refreshed",
            message: isStale
              ? nextFeed.refreshWarning
              : `${nextFeed.entries.length} entries`,
          });
        }
      } catch (error) {
        if (entriesCountRef.current === 0) {
          await showToast({
            style: Toast.Style.Failure,
            title: "Could not load HeyClaude",
            message:
              error instanceof Error ? error.message : "Unknown feed error",
          });
        } else if (showSuccess) {
          await showToast({
            style: Toast.Style.Failure,
            title: "Could not refresh feed",
            message:
              error instanceof Error ? error.message : "Unknown feed error",
          });
        }
      } finally {
        setIsLoading(false);
      }
    }

    useEffect(() => {
      void refreshEntries(false);
      // Run only once on command open. Manual refresh is exposed as an action.
    }, []);

    useEffect(() => {
      let cancelled = false;

      async function initializeFavorites() {
        const loaded = await loadFavorites();
        if (!cancelled) setFavorites(loaded);
      }

      void initializeFavorites();
      return () => {
        cancelled = true;
      };
    }, []);

    const normalizedSearchText = searchText.trim();
    const resolvedFilter = useMemo(
      () => resolveRegistryFilter(filter, options.fixedCategory),
      [filter, options.fixedCategory],
    );
    const searchCategory = resolvedFilter.search.category || "";
    const searchFilterKey = registryFilterKey(resolvedFilter.search);
    const canUseServerSearch =
      normalizedSearchText.length > 0 && filter !== "favorites";

    useEffect(() => {
      if (!canUseServerSearch) {
        setServerSearch(createEmptyServerSearchState());
        return;
      }

      let cancelled = false;
      const timeout = setTimeout(() => {
        setServerSearch((previous) => ({
          ...previous,
          status: "loading",
          query: normalizedSearchText,
          category: searchCategory,
          filterKey: searchFilterKey,
          entries: [],
          total: 0,
          nextOffset: null,
          isLoading: true,
          error: undefined,
        }));

        fetchRegistrySearch({
          query: normalizedSearchText,
          ...resolvedFilter.search,
          limit: SEARCH_PAGE_SIZE,
        })
          .then((result) => {
            if (cancelled) return;
            setServerSearch({
              status: "ready",
              query: normalizedSearchText,
              category: searchCategory,
              filterKey: searchFilterKey,
              entries: result.entries,
              total: result.total,
              nextOffset: result.nextOffset,
              isLoading: false,
            });
          })
          .catch((error) => {
            if (cancelled) return;
            setServerSearch({
              status: "failed",
              query: normalizedSearchText,
              category: searchCategory,
              filterKey: searchFilterKey,
              entries: [],
              total: 0,
              nextOffset: null,
              isLoading: false,
              error: error instanceof Error ? error.message : String(error),
            });
          });
      }, 300);

      return () => {
        cancelled = true;
        clearTimeout(timeout);
      };
    }, [
      canUseServerSearch,
      normalizedSearchText,
      resolvedFilter.search,
      searchCategory,
      searchFilterKey,
    ]);

    async function loadMoreSearchResults() {
      if (
        !canUseServerSearch ||
        serverSearch.isLoading ||
        serverSearch.nextOffset === null
      ) {
        return;
      }

      const requestQuery = normalizedSearchText;
      const requestCategory = searchCategory;
      const requestFilterKey = searchFilterKey;
      const requestOffset = serverSearch.nextOffset;
      const isStaleResponse = (state: ServerSearchState) =>
        state.query !== requestQuery ||
        state.category !== requestCategory ||
        state.filterKey !== requestFilterKey;

      setServerSearch((previous) => ({
        ...previous,
        isLoading: true,
        error: undefined,
      }));
      try {
        const result = await fetchRegistrySearch({
          query: requestQuery,
          ...resolvedFilter.search,
          limit: SEARCH_PAGE_SIZE,
          offset: requestOffset,
        });
        setServerSearch((previous) =>
          isStaleResponse(previous)
            ? previous
            : {
                ...previous,
                status: "ready",
                entries: [...previous.entries, ...result.entries],
                total: result.total,
                nextOffset: result.nextOffset,
                isLoading: false,
              },
        );
      } catch (error) {
        setServerSearch((previous) =>
          isStaleResponse(previous)
            ? previous
            : {
                ...previous,
                status: previous.entries.length > 0 ? "ready" : "failed",
                isLoading: false,
                error: error instanceof Error ? error.message : String(error),
              },
        );
      }
    }

    const categoryOptions = useMemo(() => {
      if (options.fixedCategory)
        return fixedCategoryOptions(options.fixedCategory);
      const categories = sortedCategoryOptions(entries);
      const [all, favorites, ...rest] = categories;
      return [all, favorites, ...advancedFilterOptions, ...rest].filter(
        Boolean,
      );
    }, [entries, options.fixedCategory]);
    const localEntries = useMemo(
      () =>
        filterRegistryEntries(
          entries,
          filter,
          favorites,
          options.fixedCategory,
        ),
      [entries, favorites, filter, options.fixedCategory],
    );
    const localSearchEntries = useMemo(
      () => filterEntriesBySearchText(localEntries, searchText),
      [localEntries, searchText],
    );
    const isCurrentServerSearch =
      canUseServerSearch &&
      serverSearch.query === normalizedSearchText &&
      serverSearch.category === searchCategory &&
      serverSearch.filterKey === searchFilterKey &&
      serverSearch.status === "ready" &&
      !serverSearch.error;
    const displayedEntries = isCurrentServerSearch
      ? serverSearch.entries
      : localSearchEntries;
    const {
      data: rankedEntries,
      visitItem,
      resetRanking,
    } = useFrecencySorting(displayedEntries, {
      namespace: `registry:${options.fixedCategory || "all"}`,
      key: entryKey,
    });
    const visibleEntries = isCurrentServerSearch
      ? displayedEntries
      : rankedEntries;
    const visibleSections = isCurrentServerSearch
      ? [
          { title: "Best Matches", entries: visibleEntries.slice(0, 5) },
          { title: "More Matches", entries: visibleEntries.slice(5) },
        ].filter((section) => section.entries.length > 0)
      : [
          {
            title:
              filter === "favorites"
                ? "Favorites"
                : options.fixedCategory
                  ? categoryLabel(options.fixedCategory)
                  : "Entries",
            entries: visibleEntries,
          },
        ];

    async function copyFullAsset(entry: RaycastEntry) {
      try {
        const detail = await loadEntryDetail({
          entry,
          cache,
          feedUrl: configuredFeed.feedUrl,
        });
        await Clipboard.copy(detail.copyText || entry.copyText);
        await visitItem(entry);
        await showHUD(`Copied ${entry.title}`, {
          popToRootType: PopToRootType.Immediate,
        });
      } catch (error) {
        await showToast({
          style: Toast.Style.Failure,
          title: "Could not copy full asset",
          message: error instanceof Error ? error.message : "Unknown error",
        });
      }
    }

    async function pasteFullAsset(entry: RaycastEntry) {
      try {
        const detail = await loadEntryDetail({
          entry,
          cache,
          feedUrl: configuredFeed.feedUrl,
        });
        await Clipboard.paste(detail.copyText || entry.copyText);
        await visitItem(entry);
        await showHUD(`Pasted ${entry.title}`, {
          popToRootType: PopToRootType.Immediate,
        });
      } catch (error) {
        await showToast({
          style: Toast.Style.Failure,
          title: "Could not paste full asset",
          message: error instanceof Error ? error.message : "Unknown error",
        });
      }
    }

    async function copyInstallCommand(entry: RaycastEntry) {
      try {
        const detail = await loadEntryDetail({
          entry,
          cache,
          feedUrl: configuredFeed.feedUrl,
        });
        const installCommand = detail.installCommand || entry.installCommand;
        if (!installCommand.trim()) {
          throw new Error("No install command is available for this entry.");
        }
        await Clipboard.copy(installCommand);
        await visitItem(entry);
        await showHUD(`Copied ${entry.title} install command`, {
          popToRootType: PopToRootType.Immediate,
        });
      } catch (error) {
        await showToast({
          style: Toast.Style.Failure,
          title: "Could not copy install command",
          message: error instanceof Error ? error.message : "Unknown error",
        });
      }
    }

    async function copyConfigSnippet(entry: RaycastEntry) {
      try {
        const detail = await loadEntryDetail({
          entry,
          cache,
          feedUrl: configuredFeed.feedUrl,
        });
        const configSnippet = detail.configSnippet || entry.configSnippet;
        if (!configSnippet.trim()) {
          throw new Error("No config snippet is available for this entry.");
        }
        await Clipboard.copy(configSnippet);
        await visitItem(entry);
        await showHUD(`Copied ${entry.title} config`, {
          popToRootType: PopToRootType.Immediate,
        });
      } catch (error) {
        await showToast({
          style: Toast.Style.Failure,
          title: "Could not copy config",
          message: error instanceof Error ? error.message : "Unknown error",
        });
      }
    }

    async function copyLlmsUrl(entry: RaycastEntry) {
      try {
        const detail = await loadEntryDetail({
          entry,
          cache,
          feedUrl: configuredFeed.feedUrl,
        });
        const llmsUrl = (detail.llmsUrl || "").trim();
        if (!llmsUrl) {
          throw new Error("No LLM context URL is available for this entry.");
        }
        await Clipboard.copy(absoluteDataUrl(llmsUrl, configuredFeed.feedUrl));
        await visitItem(entry);
        await showHUD(`Copied ${entry.title} LLM context URL`, {
          popToRootType: PopToRootType.Immediate,
        });
      } catch (error) {
        await showToast({
          style: Toast.Style.Failure,
          title: "Could not copy LLM context URL",
          message: error instanceof Error ? error.message : "Unknown error",
        });
      }
    }

    async function copyTargetConfig(
      entry: RaycastEntry,
      targetId: McpInstallTargetId,
    ) {
      const target = MCP_INSTALL_TARGETS.find(({ id }) => id === targetId);
      if (!target) return;
      try {
        const detail = await loadEntryDetail({
          entry,
          cache,
          feedUrl: configuredFeed.feedUrl,
        });
        const plan = buildMcpInstallPlan(targetId, entry, detail);
        await Clipboard.copy(plan.configJson);
        await visitItem(entry);
        await showHUD(`Copied ${target.label} config for ${entry.title}`, {
          popToRootType: PopToRootType.Immediate,
        });
      } catch (error) {
        await showToast({
          style: Toast.Style.Failure,
          title: `Could not copy ${target.label} config`,
          message: error instanceof Error ? error.message : "Unknown error",
        });
      }
    }

    async function installMcp(
      entry: RaycastEntry,
      targetId: McpInstallTargetId,
    ) {
      const target = MCP_INSTALL_TARGETS.find(({ id }) => id === targetId);
      if (!target) return;
      const toast = await showToast({
        style: Toast.Style.Animated,
        title: `Preparing ${target.label} install`,
        message: entry.title,
      });
      try {
        const detail = await loadEntryDetail({
          entry,
          cache,
          feedUrl: configuredFeed.feedUrl,
        });
        const plan = buildMcpInstallPlan(targetId, entry, detail);
        const warningSummary = plan.envPlaceholders.length
          ? `\n\nEnvironment placeholders: ${plan.envPlaceholders
              .slice(0, 4)
              .join(", ")}${plan.envPlaceholders.length > 4 ? ", ..." : ""}`
          : "";
        // Surface the entry's disclosed safety/privacy notes before the user
        // commits to writing config or running a server process. Prefer the
        // richer detail payload, but only when it has meaningful (non-blank)
        // notes — otherwise fall back to the compact list entry.
        const pickNotes = (primary?: string[], fallback?: string[]) =>
          normalizeNotes(primary).length ? primary : fallback;
        const notesSummary = buildInstallNotesSummary(
          pickNotes(detail.safetyNotes, entry.safetyNotes),
          pickNotes(detail.privacyNotes, entry.privacyNotes),
        );
        const configPreview = `\n\nServer to install:\n${plan.serverPreview}`;
        const installSummary =
          plan.installKind === "cli"
            ? `This will add a ${plan.scopeLabel}-scoped MCP server through the ${target.label} CLI.`
            : `This will update your ${plan.scopeLabel} ${target.label} MCP config and create a backup before replacing an existing server.`;
        const confirmed = await confirmAlert({
          title: `Install ${plan.name} in ${target.label}?`,
          message: `${installSummary}${configPreview}${notesSummary}${warningSummary}`,
          primaryAction: { title: "Install" },
          dismissAction: { title: "Cancel" },
        });
        if (!confirmed) {
          toast.style = Toast.Style.Success;
          toast.title = "Install cancelled";
          toast.message = entry.title;
          return;
        }

        const cliPath =
          plan.installKind === "cli" && isCliMcpInstallTargetId(targetId)
            ? await resolveMcpCli(targetId)
            : undefined;
        const exists = await mcpServerExists(plan, { cliPath });
        let replaceExisting = false;
        if (exists) {
          replaceExisting = await confirmAlert({
            title: `Replace existing ${plan.name}?`,
            message: `${target.label} already has an MCP server with this name. Replace it with the HeyClaude config?`,
            primaryAction: {
              title: "Replace",
              style: Alert.ActionStyle.Destructive,
            },
            dismissAction: { title: "Cancel" },
          });
          if (!replaceExisting) {
            toast.style = Toast.Style.Success;
            toast.title = "Install cancelled";
            toast.message = `${plan.name} already exists`;
            return;
          }
        }

        await installMcpServer(plan, { replaceExisting, cliPath });
        await visitItem(entry);
        toast.style = Toast.Style.Success;
        toast.title = `Installed in ${target.label}`;
        toast.message = plan.name;
      } catch (error) {
        toast.style = Toast.Style.Failure;
        toast.title = `${target.label} install failed`;
        toast.message =
          error instanceof Error ? error.message : "Unknown install error";
      }
    }

    async function toggleFavorite(entry: RaycastEntry) {
      const key = entryKey(entry);
      const next = new Set(favorites);
      const isFavorite = next.has(key);

      if (isFavorite) {
        next.delete(key);
      } else {
        next.add(key);
      }

      setFavorites(next);
      await persistFavorites(next);
      await visitItem(entry);
      await showToast({
        style: Toast.Style.Success,
        title: isFavorite ? "Removed favorite" : "Added favorite",
        message: entry.title,
      });
    }

    const emptyTitle =
      filter === "favorites"
        ? "No favorites yet"
        : serverSearch.error && canUseServerSearch
          ? "Showing cached matches"
          : options.fixedCategory
            ? `No ${categoryLabel(options.fixedCategory).toLowerCase()} found`
            : "No entries found";
    const emptyDescription =
      filter === "favorites"
        ? "Add favorites from any category to keep them here."
        : serverSearch.error && canUseServerSearch
          ? SERVER_SEARCH_UNAVAILABLE_MESSAGE
          : "Try another query or filter.";

    return (
      <List
        isLoading={isLoading || serverSearch.isLoading}
        isShowingDetail
        filtering={!canUseServerSearch}
        throttle
        searchText={searchText}
        onSearchTextChange={setSearchText}
        searchBarPlaceholder={
          options.searchPlaceholder ||
          "Search Claude agents, MCP servers, skills, hooks..."
        }
        searchBarAccessory={
          <List.Dropdown
            tooltip="Filter entries"
            value={filter}
            onChange={setFilter}
          >
            {categoryOptions.map((option) => (
              <List.Dropdown.Item
                key={option.value}
                value={option.value}
                title={option.title}
              />
            ))}
          </List.Dropdown>
        }
      >
        {visibleSections.map((section) => (
          <List.Section key={section.title} title={section.title}>
            {section.entries.map((entry) => {
              const isFavorite = favorites.has(entryKey(entry));
              const hasInstallCommand = entryHasInstallCommand(entry);
              const hasConfig = entryHasConfigSnippet(entry);
              const installTargets =
                entry.category === "mcp"
                  ? MCP_INSTALL_TARGETS.filter((target) =>
                      entry.mcpInstallTargets?.includes(target.id),
                    )
                  : [];
              const canInstallMcp = installTargets.length > 0;
              const sourceUrl = entry.repoUrl || entry.documentationUrl;
              const webUrl = withRaycastUtm(entry.webUrl, "registry-entry");

              return (
                <List.Item
                  key={entryKey(entry)}
                  title={entry.title}
                  subtitle={categoryLabel(entry.category)}
                  keywords={[
                    entry.category,
                    categoryLabel(entry.category),
                    entry.brandName || "",
                    entry.brandDomain || "",
                    ...(entry.searchReasons || []),
                    ...entry.tags,
                  ].filter(Boolean)}
                  icon={raycastEntryIcon(entry, configuredFeed.feedUrl)}
                  accessories={metadataAccessories(entry, isFavorite)}
                  detail={
                    <List.Item.Detail
                      markdown={entry.detailMarkdown}
                      metadata={entryDetailMetadata(entry, generatedAt)}
                    />
                  }
                  actions={
                    <ActionPanel>
                      <ActionPanel.Section title="Use">
                        {canInstallMcp
                          ? installTargets.map((target, index) => (
                              <Action
                                key={target.id}
                                title={target.actionTitle}
                                icon={Icon.Download}
                                shortcut={
                                  index === 0
                                    ? { modifiers: ["cmd"], key: "return" }
                                    : undefined
                                }
                                onAction={() =>
                                  void installMcp(entry, target.id)
                                }
                              />
                            ))
                          : null}
                        <Action
                          title="Copy Full Asset"
                          icon={Icon.Clipboard}
                          shortcut={{ modifiers: ["cmd"], key: "c" }}
                          onAction={() => void copyFullAsset(entry)}
                        />
                        <Action
                          title="Paste Full Asset"
                          icon={Icon.TextCursor}
                          shortcut={{ modifiers: ["cmd", "shift"], key: "v" }}
                          onAction={() => void pasteFullAsset(entry)}
                        />
                        {hasInstallCommand ? (
                          <Action
                            title="Copy Install Command"
                            icon={Icon.Terminal}
                            shortcut={{ modifiers: ["cmd"], key: "i" }}
                            onAction={() => void copyInstallCommand(entry)}
                          />
                        ) : null}
                        {hasConfig ? (
                          <Action
                            title="Copy Config"
                            icon={Icon.Code}
                            shortcut={{ modifiers: ["cmd"], key: "." }}
                            onAction={() => void copyConfigSnippet(entry)}
                          />
                        ) : null}
                        {canInstallMcp ? (
                          <ActionPanel.Submenu
                            title="Copy MCP Config for…"
                            icon={Icon.Code}
                          >
                            {installTargets.map((target) => (
                              <Action
                                key={target.id}
                                title={target.label}
                                onAction={() =>
                                  void copyTargetConfig(entry, target.id)
                                }
                              />
                            ))}
                          </ActionPanel.Submenu>
                        ) : null}
                        <Action.OpenInBrowser
                          title="Open on HeyClaude"
                          url={webUrl}
                          shortcut={{ modifiers: ["cmd"], key: "o" }}
                          onOpen={() => void visitItem(entry)}
                        />
                        {entry.documentationUrl ? (
                          <Action.OpenInBrowser
                            title="Open Documentation"
                            url={entry.documentationUrl}
                            onOpen={() => void visitItem(entry)}
                          />
                        ) : null}
                        {sourceUrl ? (
                          <Action.OpenInBrowser
                            title="Open Source"
                            url={sourceUrl}
                            onOpen={() => void visitItem(entry)}
                          />
                        ) : null}
                      </ActionPanel.Section>
                      <ActionPanel.Section title="Share">
                        <Action.CopyToClipboard
                          title="Copy Canonical URL"
                          content={entry.webUrl}
                          onCopy={() => void visitItem(entry)}
                        />
                        <Action.CopyToClipboard
                          title="Copy Markdown Link"
                          content={markdownLink(entry.title, entry.webUrl)}
                          onCopy={() => void visitItem(entry)}
                        />
                        <Action.CopyToClipboard
                          title="Copy Summary"
                          content={buildEntrySummary(entry)}
                          onCopy={() => void visitItem(entry)}
                        />
                        <Action
                          title="Copy LLM Context URL"
                          icon={Icon.Snippets}
                          onAction={() => void copyLlmsUrl(entry)}
                        />
                        {entry.brandDomain ? (
                          <Action.CopyToClipboard
                            title="Copy Brand Domain"
                            content={entry.brandDomain}
                            onCopy={() => void visitItem(entry)}
                          />
                        ) : null}
                      </ActionPanel.Section>
                      <ActionPanel.Section title="Create">
                        <Action.CreateQuicklink
                          title="Create Entry Quicklink"
                          quicklink={{
                            name: `HeyClaude: ${entry.title}`,
                            link: webUrl,
                            icon: Icon.Link,
                          }}
                        />
                        <Action.CreateQuicklink
                          title="Create Category Quicklink"
                          quicklink={{
                            name: `HeyClaude ${categoryLabel(entry.category)}`,
                            link: withRaycastUtm(
                              `https://heyclau.de/${entry.category}`,
                              "category-quicklink",
                            ),
                            icon: categoryIcons[entry.category] ?? Icon.Link,
                          }}
                        />
                        {hasInstallCommand ? (
                          <CreateInstallSnippetAction
                            entry={entry}
                            cache={cache}
                            feedUrl={configuredFeed.feedUrl}
                            onVisit={() => visitItem(entry)}
                          />
                        ) : null}
                        {hasConfig ? (
                          <CreateConfigSnippetAction
                            entry={entry}
                            cache={cache}
                            feedUrl={configuredFeed.feedUrl}
                            onVisit={() => visitItem(entry)}
                          />
                        ) : null}
                      </ActionPanel.Section>
                      <ActionPanel.Section title="Save">
                        <Action
                          title={
                            isFavorite ? "Remove Favorite" : "Add Favorite"
                          }
                          icon={isFavorite ? Icon.StarDisabled : Icon.Star}
                          shortcut={{ modifiers: ["cmd"], key: "f" }}
                          onAction={() => void toggleFavorite(entry)}
                        />
                        <Action
                          title="Reset Ranking"
                          icon={Icon.ArrowCounterClockwise}
                          onAction={() => void resetRanking(entry)}
                        />
                      </ActionPanel.Section>
                      <ActionPanel.Section title="Contribute">
                        <Action.OpenInBrowser
                          title="Submit Similar Entry"
                          url={buildContributeEntryUrl({
                            category: entry.category,
                            brandName: entry.brandName,
                            brandDomain: entry.brandDomain,
                            tags: entry.tags,
                          })}
                          icon={Icon.Plus}
                        />
                        <Action.OpenInBrowser
                          title="Suggest Change"
                          url={buildSuggestChangeUrl(entry)}
                          icon={Icon.Pencil}
                        />
                        <Action.OpenInBrowser
                          title="Claim or Update Listing"
                          url={withRaycastUtm(
                            `https://heyclau.de/claim?category=${encodeURIComponent(entry.category)}&slug=${encodeURIComponent(entry.slug)}`,
                            "entry-claim",
                          )}
                          icon={Icon.Person}
                        />
                      </ActionPanel.Section>
                      <ActionPanel.Section title="Refresh">
                        {isCurrentServerSearch &&
                        serverSearch.nextOffset !== null ? (
                          <Action
                            title="Load More Search Results"
                            icon={Icon.Plus}
                            onAction={() => void loadMoreSearchResults()}
                          />
                        ) : null}
                        <Action
                          title="Refresh Feed"
                          icon={Icon.ArrowClockwise}
                          shortcut={{ modifiers: ["cmd"], key: "r" }}
                          onAction={() => void refreshEntries(true)}
                        />
                      </ActionPanel.Section>
                    </ActionPanel>
                  }
                />
              );
            })}
          </List.Section>
        ))}
        {!isLoading &&
        !serverSearch.isLoading &&
        displayedEntries.length === 0 ? (
          <List.EmptyView
            icon={Icon.MagnifyingGlass}
            title={emptyTitle}
            description={emptyDescription}
            actions={
              <ActionPanel>
                <Action
                  title="Refresh Feed"
                  icon={Icon.ArrowClockwise}
                  onAction={() => void refreshEntries(true)}
                />
                <Action.OpenInBrowser
                  title="Contribute Entry"
                  url={buildContributeEntryUrl({
                    category: options.fixedCategory,
                  })}
                  icon={Icon.Plus}
                />
              </ActionPanel>
            }
          />
        ) : null}
      </List>
    );
  };
}
