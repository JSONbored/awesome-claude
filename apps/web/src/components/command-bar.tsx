import * as React from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import {
  Search,
  ArrowRight,
  Compass,
  Flame,
  ShieldCheck,
  GitBranch,
  Sparkles,
  Sun,
  Moon,
  Keyboard,
  Send,
  Star,
  TerminalSquare,
  Shield,
  Lock,
} from "lucide-react";
import { CategoryPill, Kbd, TrustBadge } from "./badges";
import { useTheme } from "@/lib/theme";
import { useShortcuts } from "./shortcuts-dialog";
import { cn } from "@/lib/utils";

const EXAMPLES = [
  "postgres MCP",
  "code review agent",
  "safety hook",
  "react rules",
  "scaffold command",
];

export const COMMAND_BAR_INPUT_ID = "hc-command-bar-input";

type ActionItem = {
  id: string;
  label: string;
  hint?: string;
  Icon: React.ComponentType<{ className?: string }>;
  run: () => void;
};

export function CommandBar({
  size = "md",
  autoFocus = false,
  showHint = true,
  className,
}: {
  size?: "md" | "lg";
  autoFocus?: boolean;
  showHint?: boolean;
  className?: string;
}) {
  const [q, setQ] = React.useState("");
  const [open, setOpen] = React.useState(false);
  const [placeholderIdx, setPlaceholderIdx] = React.useState(0);
  const [active, setActive] = React.useState(0);
  const [quickCat, setQuickCat] = React.useState<string>("");
  const inputRef = React.useRef<HTMLInputElement>(null);
  const wrapperRef = React.useRef<HTMLDivElement>(null);
  const listboxId = React.useId();
  const navigate = useNavigate();
  const { toggle: toggleTheme } = useTheme();
  const shortcuts = useShortcuts();

  // Lazy-load the in-memory search index (and the registry dataset it pulls in) only when the
  // bar is opened or typed into, so the ~1 MB dataset stays out of the universal client bundle.
  const [searchFn, setSearchFn] = React.useState<
    (typeof import("@/data/search"))["search"] | null
  >(null);
  React.useEffect(() => {
    if ((!open && !q) || searchFn) return;
    let cancelled = false;
    void import("@/data/search").then((m) => {
      if (!cancelled) setSearchFn(() => m.search);
    });
    return () => {
      cancelled = true;
    };
  }, [open, q, searchFn]);

  React.useEffect(() => {
    const id = setInterval(() => setPlaceholderIdx((i) => (i + 1) % EXAMPLES.length), 2800);
    return () => clearInterval(id);
  }, []);

  const results = React.useMemo(
    () =>
      q.trim() && searchFn
        ? searchFn({ q, sort: "popular" })
            .slice(0, 6)
            .filter((r) => !quickCat || r.category === quickCat)
        : [],
    [q, quickCat, searchFn],
  );

  const actions = React.useMemo<ActionItem[]>(() => {
    const all: ActionItem[] = [
      {
        id: "go-browse",
        label: "Browse all resources",
        hint: "/browse",
        Icon: Compass,
        run: () => navigate({ to: "/browse" }),
      },
      {
        id: "go-trending",
        label: "Trending this week",
        hint: "/trending",
        Icon: Flame,
        run: () => navigate({ to: "/trending" }),
      },
      {
        id: "go-ecosystem",
        label: "Ecosystem & integrations",
        hint: "/ecosystem",
        Icon: GitBranch,
        run: () => navigate({ to: "/ecosystem" }),
      },
      {
        id: "go-quality",
        label: "Registry quality",
        hint: "/quality",
        Icon: ShieldCheck,
        run: () => navigate({ to: "/quality" }),
      },
      {
        id: "go-best",
        label: "Best of HeyClaude",
        hint: "/best",
        Icon: Sparkles,
        run: () => navigate({ to: "/best" }),
      },
      {
        id: "go-submit",
        label: "Submit a resource",
        hint: "/submit",
        Icon: Send,
        run: () => navigate({ to: "/submit" }),
      },
      {
        id: "go-feeds",
        label: "RSS feeds & email subscriptions",
        hint: "/feeds",
        Icon: GitBranch,
        run: () => navigate({ to: "/feeds" }),
      },
      {
        id: "go-subscriptions",
        label: "Manage subscriptions",
        hint: "/subscriptions",
        Icon: Sparkles,
        run: () => navigate({ to: "/subscriptions" }),
      },
      {
        id: "go-saved",
        label: "Saved searches",
        hint: "/browse",
        Icon: Sparkles,
        run: () => navigate({ to: "/browse" }),
      },
      { id: "toggle-theme", label: "Toggle theme", Icon: Sun, run: () => toggleTheme() },
      {
        id: "shortcuts",
        label: "Show keyboard shortcuts",
        hint: "?",
        Icon: Keyboard,
        run: () => shortcuts?.open(),
      },
    ];
    if (!q.trim()) return all;
    const needle = q.toLowerCase();
    return all.filter((a) => a.label.toLowerCase().includes(needle)).slice(0, 4);
  }, [q, navigate, toggleTheme, shortcuts]);

  // Build a flat option list (results first, then actions) for keyboard nav.
  type Opt = { kind: "result"; r: (typeof results)[number] } | { kind: "action"; a: ActionItem };
  const options: Opt[] = React.useMemo(
    () => [
      ...results.map((r) => ({ kind: "result" as const, r })),
      ...actions.map((a) => ({ kind: "action" as const, a })),
    ],
    [results, actions],
  );

  React.useEffect(() => {
    setActive(0);
  }, [q]);

  const submit = () => {
    if (q.trim()) navigate({ to: "/browse", search: { q } });
  };

  const handleBlur = (e: React.FocusEvent<HTMLDivElement>) => {
    const next = e.relatedTarget as Node | null;
    if (next && wrapperRef.current?.contains(next)) return;
    setOpen(false);
  };

  const activate = (i: number) => {
    const opt = options[i];
    if (!opt) return submit();
    if (opt.kind === "result") {
      navigate({
        to: "/entry/$category/$slug",
        params: { category: opt.r.category, slug: opt.r.slug },
      });
    } else {
      opt.a.run();
    }
    setOpen(false);
    inputRef.current?.blur();
  };

  const activeOptionId = options[active] ? `${listboxId}-opt-${active}` : undefined;

  const showPanel = open && options.length > 0;

  return (
    <div ref={wrapperRef} onBlur={handleBlur} className={cn("relative w-full", className)}>
      <label htmlFor={COMMAND_BAR_INPUT_ID} className="sr-only">
        Search the HeyClaude registry
      </label>
      <div
        role="combobox"
        aria-expanded={showPanel}
        aria-haspopup="listbox"
        aria-owns={listboxId}
        aria-controls={listboxId}
        className={cn(
          "flex items-center gap-3 rounded-xl border border-border-strong bg-surface px-4 transition-shadow focus-within:ring-2 focus-within:ring-accent/40",
          size === "lg" ? "h-16" : "h-12",
        )}
      >
        <Search
          aria-hidden
          className={cn("text-ink-muted", size === "lg" ? "h-5 w-5" : "h-4 w-4")}
        />
        <input
          id={COMMAND_BAR_INPUT_ID}
          ref={inputRef}
          autoFocus={autoFocus}
          type="search"
          role="searchbox"
          aria-autocomplete="list"
          aria-controls={listboxId}
          aria-keyshortcuts="/ Meta+K Control+K"
          aria-activedescendant={activeOptionId}
          value={q}
          onChange={(e) => {
            setQ(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={(e) => {
            if (e.key === "ArrowDown") {
              e.preventDefault();
              setActive((a) => (options.length ? (a + 1) % options.length : 0));
            } else if (e.key === "ArrowUp") {
              e.preventDefault();
              setActive((a) => (options.length ? (a - 1 + options.length) % options.length : 0));
            } else if (e.key === "Home") {
              e.preventDefault();
              setActive(0);
            } else if (e.key === "End") {
              e.preventDefault();
              setActive(Math.max(options.length - 1, 0));
            } else if (e.key === "Enter") {
              e.preventDefault();
              if (options.length) activate(active);
              else submit();
            } else if (e.key === "Escape") {
              setOpen(false);
              inputRef.current?.blur();
            }
          }}
          placeholder={`Search Claude workflows — try "${EXAMPLES[placeholderIdx]}"`}
          className={cn(
            "flex-1 bg-transparent text-ink placeholder:text-ink-subtle focus:outline-none",
            size === "lg" ? "text-base" : "text-sm",
          )}
        />
        {showHint && (
          <div className="hidden items-center gap-1 text-ink-subtle sm:flex" aria-hidden>
            <Kbd>⌘</Kbd>
            <Kbd>K</Kbd>
          </div>
        )}
      </div>

      <span className="sr-only" aria-live="polite" role="status">
        {q.trim()
          ? `${results.length} ${results.length === 1 ? "result" : "results"} and ${actions.length} ${actions.length === 1 ? "action" : "actions"} for ${q}`
          : ""}
      </span>

      {showPanel && (
        <div className="absolute left-0 right-0 top-full z-50 mt-2 overflow-hidden rounded-xl border border-border bg-surface shadow-lg">
          <div className="flex flex-wrap items-center gap-1.5 border-b border-border bg-surface-2 px-3 py-2">
            <span className="eyebrow mr-1">Scope</span>
            {[
              { id: "", label: "All" },
              { id: "mcp", label: "MCP" },
              { id: "skills", label: "Skills" },
              { id: "hooks", label: "Hooks" },
              { id: "agents", label: "Agents" },
              { id: "commands", label: "Commands" },
              { id: "rules", label: "Rules" },
            ].map((c) => (
              <button
                key={c.id || "all"}
                type="button"
                onMouseDown={(e) => {
                  e.preventDefault();
                  setQuickCat(c.id);
                }}
                className={cn(
                  "inline-flex h-6 items-center rounded-full border px-2 text-[11px] transition-colors",
                  quickCat === c.id
                    ? "border-accent bg-accent text-accent-ink"
                    : "border-border bg-surface text-ink-muted hover:border-border-strong hover:text-ink",
                )}
              >
                {c.label}
              </button>
            ))}
          </div>

          <ul
            id={listboxId}
            role="listbox"
            aria-label="Search results and actions"
            className="max-h-96 overflow-y-auto py-1"
          >
            {results.length > 0 && (
              <li
                role="presentation"
                className="px-3 pb-1 pt-2 text-[10px] font-mono uppercase tracking-wider text-ink-subtle"
              >
                Results
              </li>
            )}
            {results.map((r, i) => {
              const hasSafety = Boolean(r.safetyNotes);
              const hasPrivacy = Boolean(r.privacyNotes);
              const installable = Boolean(r.installCommand);
              const stars = typeof r.repoStats?.stars === "number" ? r.repoStats.stars : null;
              return (
                <li
                  key={`${r.category}/${r.slug}`}
                  id={`${listboxId}-opt-${i}`}
                  role="option"
                  aria-selected={active === i}
                >
                  <Link
                    to="/entry/$category/$slug"
                    params={{ category: r.category, slug: r.slug }}
                    onMouseEnter={() => setActive(i)}
                    className={cn(
                      "flex flex-col gap-1 px-4 py-2 text-sm focus-visible:outline-none",
                      active === i && "bg-surface-2",
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <CategoryPill>{r.category}</CategoryPill>
                      <span className="truncate font-medium text-ink">{r.title}</span>
                      <TrustBadge level={r.trust} />
                    </div>
                    <div className="flex items-center gap-3 pl-1 text-[11px] text-ink-muted">
                      <span className="line-clamp-1 flex-1">{r.description}</span>
                      {installable && (
                        <span className="inline-flex items-center gap-1" title="Installable">
                          <TerminalSquare className="h-3 w-3" aria-hidden /> install
                        </span>
                      )}
                      <span
                        className={cn(
                          "inline-flex items-center gap-1",
                          hasSafety ? "text-ink-muted" : "text-ink-subtle",
                        )}
                        title={hasSafety ? "Safety notes present" : "No safety notes"}
                      >
                        <Shield className="h-3 w-3" aria-hidden /> {hasSafety ? "safety" : "—"}
                      </span>
                      <span
                        className={cn(
                          "inline-flex items-center gap-1",
                          hasPrivacy ? "text-ink-muted" : "text-ink-subtle",
                        )}
                        title={hasPrivacy ? "Privacy notes present" : "No privacy notes"}
                      >
                        <Lock className="h-3 w-3" aria-hidden /> {hasPrivacy ? "privacy" : "—"}
                      </span>
                      {stars !== null && (
                        <span
                          className="inline-flex items-center gap-1 tabular-nums"
                          title={`${stars.toLocaleString()} source repository stars`}
                        >
                          <Star className="h-3 w-3" aria-hidden />
                          {stars >= 1000 ? `${(stars / 1000).toFixed(1)}k` : stars}
                        </span>
                      )}
                    </div>
                  </Link>
                </li>
              );
            })}
            {actions.length > 0 && (
              <li
                role="presentation"
                className="px-3 pb-1 pt-2 text-[10px] font-mono uppercase tracking-wider text-ink-subtle"
              >
                Actions
              </li>
            )}
            {actions.map((a, j) => {
              const i = results.length + j;
              const Icon = a.Icon;
              return (
                <li
                  key={a.id}
                  id={`${listboxId}-opt-${i}`}
                  role="option"
                  aria-selected={active === i}
                >
                  <button
                    type="button"
                    onMouseEnter={() => setActive(i)}
                    onMouseDown={(e) => {
                      e.preventDefault();
                      activate(i);
                    }}
                    className={cn(
                      "flex w-full items-center gap-3 px-4 py-2 text-left text-sm focus-visible:outline-none",
                      active === i && "bg-surface-2",
                    )}
                  >
                    <Icon className="h-3.5 w-3.5 text-ink-muted" aria-hidden />
                    <span className="font-medium text-ink">{a.label}</span>
                    {a.hint && (
                      <span className="ml-auto font-mono text-[11px] text-ink-subtle">
                        {a.hint}
                      </span>
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
          {q.trim() && (
            <button
              type="button"
              onMouseDown={(e) => {
                e.preventDefault();
                submit();
              }}
              className="flex w-full items-center justify-between border-t border-border bg-surface-2 px-4 py-2 text-xs text-ink-muted hover:text-ink"
            >
              <span>
                See all results for <span className="text-ink">"{q}"</span>
              </span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      )}
    </div>
  );
}

/**
 * Global ⌘K / Ctrl+K / "/" focuser. Mount once near the app shell.
 */
export function useGlobalCommandKey() {
  React.useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        const el = document.getElementById(COMMAND_BAR_INPUT_ID) as HTMLInputElement | null;
        el?.focus();
        el?.select();
      } else if (
        e.key === "/" &&
        !e.shiftKey &&
        !(e.target as HTMLElement | null)?.matches("input, textarea, [contenteditable='true']")
      ) {
        e.preventDefault();
        const el = document.getElementById(COMMAND_BAR_INPUT_ID) as HTMLInputElement | null;
        el?.focus();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);
}
