import type { Metadata } from "next";
import Link from "next/link";
import { Users, GitPullRequest, BookOpen, Trophy, ExternalLink } from "lucide-react";

import { Breadcrumbs } from "@/components/breadcrumbs";
import { JsonLd } from "@/components/json-ld";
import { getContributors } from "@/lib/contributors";
import { buildPageMetadata } from "@/lib/seo";
import { siteConfig } from "@/lib/site";
import { buildBreadcrumbJsonLd, buildWebPageJsonLd } from "@heyclaude/registry/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "HeyClaude community",
  description:
    "Join the HeyClaude community — contribute Claude resources, highlight accepted submissions, and help grow the open-source Claude ecosystem.",
  path: "/community",
  keywords: [
    "heyclaude community",
    "claude contributions",
    "open source claude",
    "claude resources",
  ],
});

// ---------------------------------------------------------------------------
// Server-page instrumentation
// ---------------------------------------------------------------------------

type CommunityPageLogger = {
  info: (event: string, meta?: Record<string, unknown>) => void;
  error: (event: string, meta?: Record<string, unknown>) => void;
};

function writeCommunityPageLog(
  level: "info" | "error",
  event: string,
  requestId: string,
  meta: Record<string, unknown> = {},
) {
  const payload = {
    ts: new Date().toISOString(),
    level,
    event,
    requestId,
    ...meta,
  };
  const line = JSON.stringify(payload);
  if (level === "error") {
    console.error(line);
    return;
  }
  console.info(line);
}

function createCommunityPageLogger(requestId: string): CommunityPageLogger {
  return {
    info(event, meta = {}) {
      writeCommunityPageLog("info", event, requestId, meta);
    },
    error(event, meta = {}) {
      writeCommunityPageLog("error", event, requestId, meta);
    },
  };
}

function normalizeError(error: unknown) {
  if (error instanceof Error) {
    return { name: error.name, message: error.message };
  }
  return { name: "Error", message: String(error || "Unknown error") };
}

async function withDuration<T>(
  callback: (context: {
    getDurationMs: () => number;
    logger: CommunityPageLogger;
    requestId: string;
  }) => Promise<T>,
) {
  const startedAt = Date.now();
  const requestId = crypto.randomUUID();
  const logger = createCommunityPageLogger(requestId);
  const getDurationMs = () => Date.now() - startedAt;

  try {
    return await callback({ getDurationMs, logger, requestId });
  } catch (error) {
    logger.error("community.page.failed", {
      durationMs: getDurationMs(),
      error: normalizeError(error),
    });
    throw error;
  } finally {
    logger.info("community.page.summary", {
      durationMs: getDurationMs(),
      requestId,
    });
  }
}

// ---------------------------------------------------------------------------
// URL validation
// ---------------------------------------------------------------------------

function safeHttpUrl(value: string): string {
  try {
    const url = new URL(value);
    if (url.protocol !== "http:" && url.protocol !== "https:") return "";
    return url.toString();
  } catch {
    return "";
  }
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default async function CommunityPage() {
  return withDuration(async ({ getDurationMs, logger }) => {
    const contributors = await getContributors();
    const topContributors = contributors.slice(0, 12);

    logger.info("community.page.loaded", {
      durationMs: getDurationMs(),
      contributorCount: contributors.length,
    });

    const jsonLd = [
      buildBreadcrumbJsonLd([
        { name: "Home", url: siteConfig.url },
        { name: "Community", url: `${siteConfig.url}/community` },
      ]),
      buildWebPageJsonLd({
        siteUrl: siteConfig.url,
        path: "/community",
        title: "HeyClaude community",
        description:
          "Join the HeyClaude community — contribute Claude resources and help grow the open-source ecosystem.",
        breadcrumbId: `${siteConfig.url}/community#breadcrumb`,
      }),
    ];

    return (
      <div className="container-shell space-y-12 py-12">
        <JsonLd data={jsonLd} />

        <div className="space-y-4 border-b border-border/80 pb-8">
          <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Community" }]} />
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
              HeyClaude community
            </h1>
            <p className="max-w-2xl text-muted-foreground">
              HeyClaude is built by contributors who submit, review, and maintain Claude
              resources. Here&apos;s how to get involved.
            </p>
          </div>
        </div>

        {/* How to contribute */}
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold tracking-tight">How to contribute</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <ContributeCard
              icon={<GitPullRequest className="size-5" />}
              title="Submit a resource"
              description="Add a Claude agent, MCP server, skill, hook, command, rule, or guide to the directory."
              href="/submit"
              linkLabel="Submit now"
            />
            <ContributeCard
              icon={<BookOpen className="size-5" />}
              title="Browse open issues"
              description="Find contribution opportunities labeled good-first-issue or help-wanted on GitHub."
              href={`${siteConfig.githubUrl}/contribute`}
              linkLabel="View issues"
              external
            />
            <ContributeCard
              icon={<Users className="size-5" />}
              title="Join the discussion"
              description="Ask questions, propose ideas, and connect with other contributors on Discord."
              href={siteConfig.discordUrl}
              linkLabel="Join Discord"
              external
            />
          </div>
        </section>

        {/* Accepted submissions */}
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold tracking-tight">Accepted submissions</h2>
          <p className="text-muted-foreground">
            All accepted resources are tracked in the{" "}
            <Link href="/browse" className="underline underline-offset-4 hover:text-foreground">
              directory
            </Link>
            . Each entry is file-backed, validated, and attributed to its contributor. Browse
            by category to see what&apos;s been accepted.
          </p>
          <div className="flex flex-wrap gap-2">
            {["agents", "mcp", "tools", "skills", "rules", "commands", "hooks", "guides"].map(
              (cat) => (
                <Link
                  key={cat}
                  href={`/${cat}`}
                  className="rounded-full border border-border bg-secondary/30 px-3 py-1.5 text-sm text-muted-foreground transition hover:border-primary/40 hover:text-foreground"
                >
                  {cat}
                </Link>
              )
            )}
          </div>
        </section>

        {/* Top contributors */}
        {topContributors.length > 0 && (
          <section className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold tracking-tight">Top contributors</h2>
              <Link
                href="/contributors"
                className="text-sm text-muted-foreground underline underline-offset-4 hover:text-foreground"
              >
                View all
              </Link>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {topContributors.map((contributor) => {
                const profileHref = contributor.profileUrl
                  ? safeHttpUrl(contributor.profileUrl)
                  : "";

                return (
                  <div
                    key={contributor.slug}
                    className="flex items-center gap-3 rounded-lg border border-border/60 bg-card/50 p-3"
                  >
                    <div className="flex size-8 items-center justify-center rounded-full bg-secondary text-xs font-medium">
                      {contributor.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">{contributor.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {contributor.entryCount}{" "}
                        {contributor.entryCount === 1 ? "entry" : "entries"}
                      </p>
                    </div>
                    {profileHref && (
                      <a
                        href={profileHref}
                        target="_blank"
                        rel="noreferrer"
                        className="text-muted-foreground hover:text-foreground"
                        aria-label={`${contributor.name} profile`}
                      >
                        <ExternalLink className="size-3.5" />
                      </a>
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* Gittensor */}
        <section className="space-y-4 rounded-lg border border-border/60 bg-card/30 p-6">
          <div className="flex items-center gap-2">
            <Trophy className="size-5 text-muted-foreground" />
            <h2 className="text-lg font-semibold">Gittensor listing</h2>
          </div>
          <p className="text-sm leading-relaxed text-muted-foreground">
            HeyClaude is listed on Gittensor. Eligibility and rewards follow Gittensor&apos;s
            current rules. Contributing to HeyClaude does not guarantee any reward. Check
            Gittensor for the latest terms.
          </p>
        </section>

        {/* Quality standards */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold tracking-tight">Quality standards</h2>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-start gap-2">
              <span className="mt-1 size-1.5 shrink-0 rounded-full bg-primary" />
              Submissions must include a source link, install command, or clear provenance.
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1 size-1.5 shrink-0 rounded-full bg-primary" />
              Entries are validated for safety, privacy, and trust metadata before acceptance.
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1 size-1.5 shrink-0 rounded-full bg-primary" />
              Thin promo, unsupported categories, and affiliate-style submissions are rejected.
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1 size-1.5 shrink-0 rounded-full bg-primary" />
              Accepted entries are attributed to their original contributor.
            </li>
          </ul>
        </section>
      </div>
    );
  });
}

function ContributeCard({
  icon,
  title,
  description,
  href,
  linkLabel,
  external,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  href: string;
  linkLabel: string;
  external?: boolean;
}) {
  return (
    <div className="space-y-3 rounded-lg border border-border/60 bg-card/50 p-5">
      <div className="flex items-center gap-2 text-muted-foreground">
        {icon}
        <h3 className="font-medium text-foreground">{title}</h3>
      </div>
      <p className="text-sm text-muted-foreground">{description}</p>
      <Link
        href={href}
        target={external ? "_blank" : undefined}
        rel={external ? "noreferrer" : undefined}
        className="inline-flex items-center gap-1 text-sm font-medium text-primary underline underline-offset-4 hover:text-primary/80"
      >
        {linkLabel}
        {external && <ExternalLink className="size-3" />}
      </Link>
    </div>
  );
}
