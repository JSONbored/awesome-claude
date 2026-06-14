import * as React from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { Moon, Sun, Send, Github, Rss, Menu } from "lucide-react";
import { CommandBar, useGlobalCommandKey } from "./command-bar";
import { AlertsDropdown } from "./alerts-dropdown";
import { useShortcuts } from "./shortcuts-dialog";
import { ScrollProgress } from "./scroll-progress";
import { useTheme } from "@/lib/theme";
import { cn } from "@/lib/utils";
import { NewsletterInline } from "./newsletter-inline";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { CATEGORIES } from "@/types/registry";

const NAV = [
  { to: "/browse", label: "Browse" },
  { to: "/trending", label: "Trending" },
  { to: "/best", label: "Best" },
  { to: "/tags", label: "Tags" },
  { to: "/for", label: "Platforms" },
  { to: "/ecosystem", label: "Ecosystem" },
  { to: "/jobs", label: "Jobs" },
  { to: "/quality", label: "Quality" },
] as const;

export function TopBar() {
  const { theme, toggle } = useTheme();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const isHome = pathname === "/";
  const [elevated, setElevated] = React.useState(false);
  const [mobileNavOpen, setMobileNavOpen] = React.useState(false);
  React.useEffect(() => {
    const onScroll = () => setElevated(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  useGlobalCommandKey();

  return (
    <header
      className={cn(
        "sticky top-0 z-40 bg-background/85 backdrop-blur transition-shadow duration-200",
        elevated
          ? "border-b border-border shadow-[0_1px_0_0_rgb(0_0_0_/_0.03)]"
          : "border-b border-transparent",
      )}
    >
      <ScrollProgress />
      <div className="mx-auto flex h-14 max-w-page items-center gap-4 px-4 sm:px-6">
        <button
          type="button"
          onClick={() => setMobileNavOpen(true)}
          aria-label="Open menu"
          className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-border bg-surface text-ink-muted hover:text-ink md:hidden"
        >
          <Menu className="h-4 w-4" />
        </button>

        <Link to="/" className="flex items-center gap-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-md bg-ink text-background">
            <span className="font-display text-sm font-bold">hc</span>
          </span>
          <span className="hidden font-display text-[15px] font-semibold tracking-tight text-ink sm:inline">
            HeyClaude
          </span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {NAV.map((item) => {
            const active = pathname.startsWith(item.to);
            return (
              <Link
                key={item.to}
                to={item.to}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "relative rounded-md px-2.5 py-1.5 text-sm transition-colors duration-200 ease-out",
                  active ? "text-ink" : "text-ink-muted hover:bg-surface-2 hover:text-ink",
                )}
              >
                {item.label}
                {active && (
                  <span
                    aria-hidden
                    className="absolute inset-x-2.5 -bottom-px h-0.5 rounded-full bg-accent"
                  />
                )}
              </Link>
            );
          })}
        </nav>

        <div className="ml-auto flex flex-1 items-center justify-end gap-2 md:max-w-md">
          {!isHome && (
            <div className="hidden flex-1 sm:block">
              <CommandBar size="md" showHint={false} />
            </div>
          )}
          <AlertsDropdown />
          <button
            type="button"
            onClick={toggle}
            aria-label="Toggle theme"
            className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-border bg-surface text-ink-muted hover:text-ink"
          >
            {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>
          <a
            href="https://github.com/jsonbored/awesome-claude"
            target="_blank"
            rel="noreferrer"
            className="hidden h-9 w-9 items-center justify-center rounded-md border border-border bg-surface text-ink-muted hover:text-ink sm:inline-flex"
            aria-label="GitHub"
          >
            <Github className="h-4 w-4" />
          </a>
          <Link
            to="/submit"
            className="inline-flex h-9 items-center gap-1.5 rounded-md bg-ink px-3 text-sm font-medium text-background hover:bg-ink/90"
          >
            <Send className="h-3.5 w-3.5" />
            Submit
          </Link>
        </div>
      </div>

      <Sheet open={mobileNavOpen} onOpenChange={setMobileNavOpen}>
        <SheetContent side="left" className="w-72">
          <SheetHeader>
            <SheetTitle className="font-display text-base font-semibold text-ink">Menu</SheetTitle>
            <SheetDescription className="sr-only">Primary site navigation links.</SheetDescription>
          </SheetHeader>
          <nav className="mt-6 flex flex-col gap-1">
            {NAV.map((item) => {
              const active = pathname.startsWith(item.to);
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={() => setMobileNavOpen(false)}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "rounded-md px-3 py-2 text-sm transition-colors duration-200 ease-out",
                    active
                      ? "bg-surface-2 text-ink"
                      : "text-ink-muted hover:bg-surface-2 hover:text-ink",
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </SheetContent>
      </Sheet>
    </header>
  );
}

export function Footer() {
  return (
    <footer className="mt-24 border-t border-border bg-surface">
      <NewsletterInline
        variant="footer-strip"
        source="footer"
        className="border-0 border-b border-border bg-background"
      />
      <div className="mx-auto grid max-w-page gap-10 px-4 py-12 sm:grid-cols-2 sm:px-6 md:grid-cols-12">
        <div className="sm:col-span-2 md:col-span-3">
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-md bg-ink text-background">
              <span className="font-display text-sm font-bold">hc</span>
            </span>
            <span className="font-display text-[15px] font-semibold text-ink">HeyClaude</span>
          </div>
          <p className="mt-3 max-w-sm text-sm text-ink-muted">
            The decision layer for Claude Code and agent workflows. GitHub-native, source-backed,
            reviewed before installing.
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-1.5 text-[11px]">
            <FeedChip href="/feed.xml" label="RSS" />
            <FeedChip href="/atom.xml" label="Atom" />
            <FeedChip href="/data/feeds/index.json" label="JSON Feed" />
            <FeedChip href="/llms.txt" label="llms.txt" />
          </div>
        </div>
        <FooterCol
          title="Product"
          links={[
            { to: "/browse", label: "Browse" },
            { to: "/trending", label: "Trending" },
            { to: "/tags", label: "Tags" },
            { to: "/for", label: "Platforms" },
            { to: "/best", label: "Best lists" },
            { to: "/compare", label: "Compare" },
            { to: "/quality", label: "Quality" },
            { to: "/state-of-claude-tooling", label: "State of tooling" },
            { to: "/changelog", label: "Changelog" },
            { to: "/brief", label: "Weekly Brief" },
          ]}
          span={3}
        />
        <FooterCol
          title="Integrations"
          links={[
            { to: "/integrations", label: "All integrations" },
            { to: "/integrations/mcp-server", label: "MCP server" },
            { to: "/ecosystem", label: "Ecosystem" },
            { to: "/api-docs", label: "API docs" },
            { to: "/feeds", label: "Feeds" },
            { to: "/subscriptions", label: "Subscriptions" },
          ]}
          span={3}
        />
        <FooterCol
          title="Resources"
          links={[
            { to: "/submit", label: "Submit a resource" },
            { to: "/claim", label: "Claim a listing" },
            { to: "/contributors", label: "Contributors" },
            { to: "/validators", label: "Review coverage" },
            { to: "/advertise", label: "Advertise" },
            { to: "/about", label: "About" },
          ]}
          span={3}
        />
      </div>
      <div className="border-t border-border">
        <div className="mx-auto max-w-page px-4 py-4 sm:px-6">
          <div className="eyebrow mb-2">Categories</div>
          <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-sm text-ink-muted">
            {CATEGORIES.map((c) => (
              <Link
                key={c.id}
                to="/$category"
                params={{ category: c.id }}
                className="hover:text-ink"
              >
                {c.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
      <div className="border-t border-border">
        <div className="mx-auto flex max-w-page flex-col items-start gap-3 px-4 py-5 text-xs text-ink-subtle sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <span>© {new Date().getFullYear()} HeyClaude · heyclau.de</span>
          <nav className="flex flex-wrap items-center gap-x-3 gap-y-1">
            <Link to="/legal" className="hover:text-ink">
              Legal
            </Link>
            <span aria-hidden className="text-ink-subtle/60">
              ·
            </span>
            <Link to="/legal" hash="privacy" className="hover:text-ink">
              Privacy
            </Link>
            <span aria-hidden className="text-ink-subtle/60">
              ·
            </span>
            <ShortcutsFooterLink />
            <span aria-hidden className="text-ink-subtle/60">
              ·
            </span>
            <span className="font-mono">Not affiliated with Anthropic.</span>
          </nav>
        </div>
      </div>
    </footer>
  );
}

function FeedChip({ href, label }: { href: string; label: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="inline-flex items-center gap-1 rounded-md border border-border bg-background px-1.5 py-0.5 font-mono text-ink-muted hover:text-ink"
    >
      <Rss className="h-2.5 w-2.5" aria-hidden />
      {label}
    </a>
  );
}

function ShortcutsFooterLink() {
  const shortcuts = useShortcuts();
  return (
    <button type="button" onClick={() => shortcuts?.open()} className="hover:text-ink">
      Keyboard shortcuts
    </button>
  );
}

function FooterCol({
  title,
  links,
  span = 2,
}: {
  title: string;
  links: { to: string; label: string }[];
  span?: number;
}) {
  const spanClass = span === 3 ? "md:col-span-3" : span === 4 ? "md:col-span-4" : "md:col-span-2";
  return (
    <div className={spanClass}>
      <div className="eyebrow mb-3">{title}</div>
      <ul className="flex flex-col gap-2">
        {links.map((l) => (
          <li key={l.to}>
            <Link to={l.to} className="text-sm text-ink-muted hover:text-ink">
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
