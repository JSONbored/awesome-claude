import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";

import appCss from "../styles.css?url";
import { ThemeProvider } from "@/lib/theme";
import { CompareProvider } from "@/lib/compare";
import { WatchProvider } from "@/lib/watch";
import { RecentsProvider } from "@/lib/recents";
import { TopBar, Footer } from "@/components/app-shell";
import { ComparisonTray } from "@/components/comparison-tray";
import { CompareDrawer } from "@/components/compare-drawer";
import { BackToTop } from "@/components/back-to-top";
import { Toaster } from "@/components/ui/sonner";
import { ShortcutsProvider } from "@/components/shortcuts-dialog";
import { SkipLink } from "@/components/skip-link";
import { RouteProgress } from "@/components/route-progress";
import { WebMcpProvider } from "@/components/webmcp-provider";
import { WebVitals } from "@/components/web-vitals";
import { siteConfig } from "@/lib/site";
import { absoluteUrl } from "@/lib/seo";
import { stringifyJsonLd } from "@/lib/json-ld";
import { buildOrganizationJsonLd, buildWebsiteJsonLd } from "@heyclaude/registry/seo";

const twitterHandle = (() => {
  try {
    const handle = new URL(siteConfig.twitterUrl).pathname.split("/").filter(Boolean)[0];
    return handle ? `@${handle.replace(/^@/, "")}` : undefined;
  } catch {
    return undefined;
  }
})();

// Sitewide default OG/Twitter card. Routes that render a page-specific card override og:image.
const defaultOgImage = absoluteUrl("/og-image.png");

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen flex-col">
      <TopBar />
      <div className="flex flex-1 items-center justify-center px-4">
        <div className="max-w-md text-center">
          <div className="eyebrow">404 · Not found</div>
          <h1 className="mt-2 font-display text-4xl font-semibold tracking-tight text-ink">
            That resource isn't in the registry.
          </h1>
          <p className="mt-3 text-sm text-ink-muted">
            It might have been moved, renamed, or never indexed. Try searching the directory.
          </p>
          <div className="mt-6 flex justify-center gap-2">
            <Link
              to="/browse"
              className="inline-flex h-9 items-center rounded-md bg-ink px-4 text-sm font-medium text-background hover:bg-ink/90"
            >
              Browse directory
            </Link>
            <Link
              to="/"
              className="inline-flex h-9 items-center rounded-md border border-border bg-surface px-4 text-sm font-medium text-ink hover:bg-surface-2"
            >
              Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <div className="eyebrow text-trust-blocked">Something broke</div>
        <h1 className="mt-2 h-display-2 text-ink text-balance">This page didn't load</h1>
        <p className="mt-2 text-sm text-ink-muted">Try refreshing — your filters are preserved.</p>
        <div className="mt-6 flex justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex h-9 items-center rounded-md bg-ink px-4 text-sm font-medium text-background hover:bg-ink/90"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex h-9 items-center rounded-md border border-border bg-surface px-4 text-sm font-medium text-ink hover:bg-surface-2"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "HeyClaude — directory for Claude Code, MCP, agents, skills & hooks" },
      {
        name: "description",
        content:
          "The decision layer for Claude Code and AI agent workflows. Search, compare, and inspect trust on MCP servers, skills, hooks, commands, agents, rules, and tools.",
      },
      { name: "theme-color", content: "#f7f5ef" },
      { property: "og:title", content: "HeyClaude — directory for Claude workflows" },
      {
        property: "og:description",
        content:
          "Search, compare, and inspect trust on Claude Code MCP servers, skills, hooks, commands, agents, and tools.",
      },
      { property: "og:type", content: "website" },
      { property: "og:site_name", content: siteConfig.name },
      { property: "og:locale", content: "en_US" },
      { property: "og:image", content: defaultOgImage },
      { property: "og:image:type", content: "image/png" },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "630" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:image", content: defaultOgImage },
      ...(twitterHandle
        ? [
            { name: "twitter:site", content: twitterHandle },
            { name: "twitter:creator", content: twitterHandle },
          ]
        : []),
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "manifest", href: "/manifest.webmanifest" },
      { rel: "icon", href: "/favicon.svg", type: "image/svg+xml" },
      { rel: "apple-touch-icon", href: "/apple-touch-icon.png" },
      { rel: "alternate", type: "application/rss+xml", href: "/feed.xml", title: "HeyClaude" },
      { rel: "alternate", type: "application/atom+xml", href: "/atom.xml", title: "HeyClaude" },
      // Self-hosted fonts (public/fonts.css mirrors Google's exact woff2 + unicode-ranges),
      // so no third-party request. Preload the most-used latin display + body faces.
      { rel: "stylesheet", href: "/fonts.css" },
      {
        rel: "preload",
        href: "/fonts/space-grotesk-700-latin.woff2",
        as: "font",
        type: "font/woff2",
        crossOrigin: "anonymous",
      },
      {
        rel: "preload",
        href: "/fonts/dm-sans-400-latin.woff2",
        as: "font",
        type: "font/woff2",
        crossOrigin: "anonymous",
      },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: stringifyJsonLd(
          buildOrganizationJsonLd({
            siteUrl: siteConfig.url,
            name: siteConfig.name,
            githubUrl: siteConfig.githubUrl,
            twitterUrl: siteConfig.twitterUrl,
            discordUrl: siteConfig.discordUrl,
            logo: `${siteConfig.url}/apple-touch-icon.png`,
          }),
        ),
      },
      {
        type: "application/ld+json",
        children: stringifyJsonLd(
          buildWebsiteJsonLd({
            siteUrl: siteConfig.url,
            name: siteConfig.name,
            description: siteConfig.description,
          }),
        ),
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
        <script
          id="umami-analytics"
          defer
          src={siteConfig.umamiScriptUrl}
          data-website-id={siteConfig.umamiWebsiteId}
        />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <WatchProvider>
          <RecentsProvider>
            <CompareProvider>
              <ShortcutsProvider>
                <div className="flex min-h-screen flex-col bg-background">
                  <RouteProgress />
                  <SkipLink />
                  <TopBar />
                  <main id="main" tabIndex={-1} className="flex-1 focus:outline-none">
                    <Outlet />
                  </main>
                  <Footer />
                </div>
                <ComparisonTray />
                <CompareDrawer />
                <BackToTop />
                <WebMcpProvider />
                <WebVitals />
                <Toaster
                  position="bottom-right"
                  mobileOffset={{ bottom: "16px" }}
                  richColors
                  closeButton
                />
              </ShortcutsProvider>
            </CompareProvider>
          </RecentsProvider>
        </WatchProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
