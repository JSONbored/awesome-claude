import * as React from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { Moon, Sun, Send, Github, Rss, Menu } from "lucide-react";
import { CommandBar, useGlobalCommandKey } from "./command-bar";
import { AlertsDropdown } from "./alerts-dropdown";
import { useShortcuts } from "./shortcuts-dialog";
import { ScrollProgress } from "./scroll-progress";
import { useTheme } from "@/lib/theme";
import { cn } from "@/lib/utils";
import { trackEvent } from "@/lib/analytics";
import {
  appShellCategoryAnalyticsData,
  appShellCategoryAnalyticsEvent,
  appShellFeedChipAnalyticsData,
  appShellFeedChipAnalyticsEvent,
  appShellFooterLinkAnalyticsData,
  appShellFooterLinkAnalyticsEvent,
  appShellHeaderAnalyticsData,
  appShellHeaderAnalyticsEvent,
  appShellLegalAnalyticsData,
  appShellLegalAnalyticsEvent,
  appShellNavAnalyticsData,
  appShellNavAnalyticsEvent,
  type AppShellFeedChip,
} from "@/lib/app-shell-cta-events";
import { NewsletterInline } from "./newsletter-inline";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { CATEGORIES } from "@/types/registry";
import {
  SHELL_MOBILE_NAV_SECTIONS,
  SHELL_PRIMARY_NAV,
  shellNavItemActive,
} from "@/lib/app-shell-nav-lib";
import {
  footerColumnSpanClass,
  SHELL_FOOTER_COLUMNS,
  shellFooterBrandSpanClass,
} from "@/lib/app-shell-footer-lib";

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
          onClick={() => {
            trackEvent(appShellHeaderAnalyticsEvent(), appShellHeaderAnalyticsData("menu"));
            setMobileNavOpen(true);
          }}
          aria-label="Open menu"
          aria-expanded={mobileNavOpen}
          aria-controls="mobile-primary-nav"
          className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-border bg-surface text-ink-muted hover:text-ink md:hidden"
        >
          <Menu className="h-4 w-4" />
        </button>

        <Link
          to="/"
          className="flex items-center gap-2"
          onClick={() =>
            trackEvent(appShellHeaderAnalyticsEvent(), appShellHeaderAnalyticsData("logo"))
          }
        >
          <span className="flex h-7 w-7 items-center justify-center rounded-md bg-ink text-background">
            <span className="font-display text-sm font-bold">hc</span>
          </span>
          <span className="hidden font-display text-[15px] font-semibold tracking-tight text-ink sm:inline">
            HeyClaude
          </span>
        </Link>

        <nav aria-label="Primary" className="hidden items-center gap-1 md:flex">
          {SHELL_PRIMARY_NAV.map((item) => {
            const active = shellNavItemActive(pathname, item.to);
            return (
              <Link
                key={item.to}
                to={item.to}
                aria-current={active ? "page" : undefined}
                onClick={() =>
                  trackEvent(
                    appShellNavAnalyticsEvent(),
                    appShellNavAnalyticsData(item.to, "desktop"),
                  )
                }
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
            onClick={() => {
              trackEvent(appShellHeaderAnalyticsEvent(), appShellHeaderAnalyticsData("theme"));
              toggle();
            }}
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
            onClick={() =>
              trackEvent(appShellHeaderAnalyticsEvent(), appShellHeaderAnalyticsData("github"))
            }
          >
            <Github className="h-4 w-4" />
          </a>
          <Link
            to="/submit"
            className="inline-flex h-9 items-center gap-1.5 rounded-md bg-ink px-3 text-sm font-medium text-background hover:bg-ink/90"
            onClick={() =>
              trackEvent(appShellHeaderAnalyticsEvent(), appShellHeaderAnalyticsData("submit"))
            }
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
            <SheetDescription className="sr-only">
              Primary site navigation grouped by product area.
            </SheetDescription>
          </SheetHeader>
          <nav id="mobile-primary-nav" aria-label="Primary" className="mt-6 flex flex-col gap-6">
            {SHELL_MOBILE_NAV_SECTIONS.map((section) => (
              <div key={section.id}>
                <div className="eyebrow mb-2">{section.label}</div>
                <div className="flex flex-col gap-1">
                  {section.links.map((item) => {
                    const active = shellNavItemActive(pathname, item.to);
                    return (
                      <Link
                        key={item.to}
                        to={item.to}
                        onClick={() => {
                          trackEvent(
                            appShellNavAnalyticsEvent(),
                            appShellNavAnalyticsData(item.to, "mobile", section.id),
                          );
                          setMobileNavOpen(false);
                        }}
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
                </div>
              </div>
            ))}
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
        <div className={cn("sm:col-span-2", shellFooterBrandSpanClass())}>
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
            <FeedChip href="/feed.xml" label="RSS" feed="rss" />
            <FeedChip href="/atom.xml" label="Atom" feed="atom" />
            <FeedChip href="/data/feeds/index.json" label="JSON Feed" feed="json" />
            <FeedChip href="/llms.txt" label="llms.txt" feed="llms" />
          </div>
        </div>
        {SHELL_FOOTER_COLUMNS.map((column) => (
          <FooterCol
            key={column.id}
            title={column.title}
            links={column.links}
            span={column.span}
            columnId={column.id}
          />
        ))}
      </div>
      <div className="border-t border-border">
        <div className="mx-auto max-w-page px-4 py-4 sm:px-6">
          <div className="eyebrow mb-2">Categories</div>
          <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-sm text-ink-muted">
            {CATEGORIES.map((c, i) => (
              <Link
                key={c.id}
                to="/$category"
                params={{ category: c.id }}
                className="hover:text-ink"
                onClick={() =>
                  trackEvent(
                    appShellCategoryAnalyticsEvent(),
                    appShellCategoryAnalyticsData(c.id, i, CATEGORIES.length),
                  )
                }
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
          <nav aria-label="Legal" className="flex flex-wrap items-center gap-x-3 gap-y-1">
            <Link
              to="/legal"
              className="hover:text-ink"
              onClick={() =>
                trackEvent(appShellLegalAnalyticsEvent(), appShellLegalAnalyticsData("legal"))
              }
            >
              Legal
            </Link>
            <span aria-hidden className="text-ink-subtle/60">
              ·
            </span>
            <Link
              to="/legal"
              hash="privacy"
              className="hover:text-ink"
              onClick={() =>
                trackEvent(appShellLegalAnalyticsEvent(), appShellLegalAnalyticsData("privacy"))
              }
            >
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

function FeedChip({ href, label, feed }: { href: string; label: string; feed: AppShellFeedChip }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="inline-flex items-center gap-1 rounded-md border border-border bg-background px-1.5 py-0.5 font-mono text-ink-muted hover:text-ink"
      onClick={() =>
        trackEvent(appShellFeedChipAnalyticsEvent(), appShellFeedChipAnalyticsData(feed))
      }
    >
      <Rss className="h-2.5 w-2.5" aria-hidden />
      {label}
    </a>
  );
}

function ShortcutsFooterLink() {
  const shortcuts = useShortcuts();
  return (
    <button
      type="button"
      onClick={() => {
        trackEvent(appShellHeaderAnalyticsEvent(), appShellHeaderAnalyticsData("shortcuts"));
        shortcuts?.open();
      }}
      className="hover:text-ink"
    >
      Keyboard shortcuts
    </button>
  );
}

function FooterCol({
  title,
  links,
  span = 2,
  columnId,
}: {
  title: string;
  links: { to: string; label: string }[];
  span?: 2 | 3 | 4;
  columnId: string;
}) {
  return (
    <div className={footerColumnSpanClass(span)}>
      <div className="eyebrow mb-3">{title}</div>
      <ul className="flex flex-col gap-2">
        {links.map((l) => (
          <li key={l.to}>
            <Link
              to={l.to}
              className="text-sm text-ink-muted hover:text-ink"
              onClick={() =>
                trackEvent(
                  appShellFooterLinkAnalyticsEvent(),
                  appShellFooterLinkAnalyticsData(columnId, l.to),
                )
              }
            >
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
