import { createFileRoute, Link } from "@tanstack/react-router";
import { Rss } from "lucide-react";
import { CATEGORIES } from "@/types/registry";
import { CopyButton } from "@/components/copy-button";
import { SubscribeForm } from "@/components/subscribe-form";
import { FeedHealthPanel } from "@/components/feed-health-panel";

export const Route = createFileRoute("/feeds")({
  head: () => ({
    meta: [
      { title: "Feeds & subscriptions — HeyClaude" },
      {
        name: "description",
        content:
          "Subscribe to HeyClaude registry updates via RSS, Atom, or email. Follow the whole registry, a single category, or a changelog stream.",
      },
      { property: "og:title", content: "Feeds & subscriptions — HeyClaude" },
      {
        property: "og:description",
        content: "RSS, Atom, and email subscriptions for the HeyClaude registry.",
      },
    ],
    links: [
      { rel: "canonical", href: "/feeds" },
      { rel: "alternate", type: "application/rss+xml", href: "/feed.xml", title: "HeyClaude" },
      { rel: "alternate", type: "application/atom+xml", href: "/atom.xml", title: "HeyClaude" },
    ],
  }),
  component: FeedsPage,
});

const STREAMS = [
  { slug: "changelog-release", label: "Release notes" },
  { slug: "changelog-policy", label: "Policy changes" },
  { slug: "changelog-security", label: "Security advisories" },
] as const;

function FeedRow({
  href,
  label,
  blurb,
  segment,
}: {
  href: string;
  label: string;
  blurb: string;
  segment: string;
}) {
  return (
    <div className="grid gap-3 border-b border-border py-4 last:border-b-0 sm:grid-cols-[1fr_auto] sm:items-center">
      <div>
        <div className="flex items-center gap-2">
          <Rss className="h-3.5 w-3.5 text-accent" />
          <span className="font-display text-sm font-semibold text-ink">{label}</span>
        </div>
        <p className="mt-0.5 text-xs text-ink-muted">{blurb}</p>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <a
          href={href}
          className="inline-flex h-8 items-center rounded-md border border-border bg-surface px-2.5 text-xs text-ink hover:bg-surface-2"
        >
          Open feed
        </a>
        <CopyButton value={href} label="Copy URL" />
        <details className="inline-block">
          <summary className="inline-flex h-8 cursor-pointer items-center rounded-md border border-border bg-surface px-2.5 text-xs text-ink hover:bg-surface-2">
            Email
          </summary>
          <div className="mt-2 w-72">
            <SubscribeForm segments={[segment]} source={`feeds:${segment}`} label="Follow" />
          </div>
        </details>
      </div>
    </div>
  );
}

function FeedsPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <div className="eyebrow">Feeds &amp; subscriptions</div>
      <h1 className="mt-2 font-display text-3xl font-semibold tracking-tight text-ink">
        Stay current on registry changes
      </h1>
      <p className="mt-2 text-sm text-ink-muted">
        Subscribe by RSS or Atom in any reader, or get curated updates by email. Every email has
        one-click unsubscribe.
      </p>

      <div className="mt-8">
        <FeedHealthPanel />
      </div>

      <section className="mt-8">
        <h2 className="font-display text-base font-semibold text-ink">Site-wide</h2>
        <div className="mt-2">
          <FeedRow
            href="/feed.xml"
            label="Everything (RSS 2.0)"
            blurb="New entries, updates, removals, and changelog notes across the whole registry."
            segment="all"
          />
          <FeedRow
            href="/atom.xml"
            label="Everything (Atom 1.0)"
            blurb="Same content as the RSS feed in Atom 1.0 format."
            segment="all"
          />
          <FeedRow
            href="/feeds/trending.xml"
            label="Trending"
            blurb="Entries with current public community, vote, and intent signals when live signals are available."
            segment="trending"
          />
        </div>
      </section>

      <section className="mt-8">
        <h2 className="font-display text-base font-semibold text-ink">Categories</h2>
        <div className="mt-2">
          {CATEGORIES.map((c) => (
            <FeedRow
              key={c.id}
              href={`/feeds/${c.id}.xml`}
              label={c.label}
              blurb={c.blurb}
              segment={`category:${c.id}`}
            />
          ))}
        </div>
      </section>

      <section className="mt-8">
        <h2 className="font-display text-base font-semibold text-ink">Changelog streams</h2>
        <div className="mt-2">
          {STREAMS.map((s) => (
            <FeedRow
              key={s.slug}
              href={`/feeds/${s.slug}.xml`}
              label={s.label}
              blurb={`Just the ${s.label.toLowerCase()} stream.`}
              segment={`changelog:${s.slug.replace("changelog-", "")}`}
            />
          ))}
        </div>
      </section>

      <section className="mt-8">
        <h2 className="font-display text-base font-semibold text-ink">For LLMs</h2>
        <div className="mt-2">
          <FeedRow
            href="/llms.txt"
            label="llms.txt"
            blurb="Short link manifest of the whole registry, grouped by category."
            segment="llms"
          />
          <FeedRow
            href="/llms-full.txt"
            label="llms-full.txt"
            blurb="Full text export with descriptions and install/config snippets, sized for context windows."
            segment="llms-full"
          />
        </div>
      </section>

      <p className="mt-10 text-xs text-ink-muted">
        Looking for a JSON feed?{" "}
        <Link to="/api-docs" className="underline">
          See the registry API.
        </Link>
      </p>
    </div>
  );
}
