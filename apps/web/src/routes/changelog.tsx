import * as React from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Rss, Plus, RefreshCw, Minus, Shield, FileText, Package } from "lucide-react";
import { CHANGELOG, RELEASE_NOTES, type ReleaseStream } from "@/data/changelog";
import { FilterChip, FilterChipGroup } from "@/components/filter-chip";
import { PageContainer } from "@/components/page-container";
import { cn } from "@/lib/utils";
import { trackEvent } from "@/lib/analytics";
import {
  changelogDiffEntryAnalyticsData,
  changelogDiffEntryAnalyticsEvent,
  directoryPageEntryDestination,
} from "@/lib/directory-page-entry-cta-events";
import {
  changelogDiffDisclosureAnalyticsData,
  changelogDiffDisclosureAnalyticsEvent,
  changelogDiffEgressAnalyticsData,
  changelogDiffEgressAnalyticsEvent,
  changelogFeedEgressAnalyticsData,
  changelogFeedEgressAnalyticsEvent,
  changelogFeedEgressDestination,
  changelogPollCopyAnalyticsData,
  changelogPollCopyAnalyticsEvent,
  changelogQualityEgressAnalyticsData,
  changelogQualityEgressAnalyticsEvent,
  changelogQualityEgressDestination,
  changelogReadMoreAnalyticsData,
  changelogReadMoreAnalyticsEvent,
  changelogStreamFilterAnalyticsData,
  changelogStreamFilterAnalyticsEvent,
  type ChangelogStreamFilter,
} from "@/lib/changelog-page-cta-events";
import { CopyButton } from "@/components/copy-button";
import { stringifyJsonLd } from "@/lib/json-ld";
import { changelogItemListJsonLd } from "@/lib/changelog-jsonld-lib";
import { absoluteUrl } from "@/lib/seo";

export const Route = createFileRoute("/changelog")({
  head: () => ({
    meta: [
      { title: "Changelog — HeyClaude" },
      {
        name: "description",
        content: "Registry releases, content policy updates, and integrity/security changes.",
      },
      { property: "og:title", content: "Changelog — HeyClaude" },
      {
        property: "og:description",
        content: "What changed in the registry, content policy, and integrity controls.",
      },
      { property: "og:url", content: absoluteUrl("/changelog") },
      { property: "og:type", content: "article" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "canonical", href: absoluteUrl("/changelog") },
      {
        rel: "alternate",
        type: "application/rss+xml",
        href: "/feed.xml",
        title: "HeyClaude changelog (RSS)",
      },
      {
        rel: "alternate",
        type: "application/atom+xml",
        href: "/atom.xml",
        title: "HeyClaude changelog (Atom)",
      },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: stringifyJsonLd(changelogItemListJsonLd(RELEASE_NOTES)),
      },
    ],
  }),
  component: ChangelogPage,
});

const STREAM_META: Record<
  ReleaseStream,
  { label: string; tone: string; dot: string; Icon: typeof Package }
> = {
  release: {
    label: "Release",
    tone: "border-accent/40 bg-accent/15 text-ink",
    dot: "bg-accent",
    Icon: Package,
  },
  policy: {
    label: "Policy",
    tone: "border-border bg-surface text-ink-muted",
    dot: "bg-ink/60",
    Icon: FileText,
  },
  security: {
    label: "Security",
    tone: "border-trust-review/40 bg-trust-review/10 text-ink",
    dot: "bg-trust-review",
    Icon: Shield,
  },
};

const FILTERS: { id: "all" | ReleaseStream; label: string }[] = [
  { id: "all", label: "All" },
  { id: "release", label: "Releases" },
  { id: "policy", label: "Policy" },
  { id: "security", label: "Security" },
];

const KIND_ICON = { added: Plus, updated: RefreshCw, removed: Minus } as const;

function ChangelogPage() {
  const [filter, setFilter] = React.useState<ChangelogStreamFilter>("all");
  const items = RELEASE_NOTES.filter((n) => filter === "all" || n.stream === filter);

  const onStreamFilter = React.useCallback((next: ChangelogStreamFilter) => {
    setFilter(next);
    const matchCount = RELEASE_NOTES.filter((n) => next === "all" || n.stream === next).length;
    trackEvent(
      changelogStreamFilterAnalyticsEvent(),
      changelogStreamFilterAnalyticsData(next, matchCount),
    );
  }, []);

  return (
    <PageContainer className="py-12">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="eyebrow">Changelog</div>
          <h1 className="mt-2 h-display-1 text-ink text-balance">What changed</h1>
          <p className="mt-3 max-w-xl text-ink-muted">
            One timeline for registry releases, content policy updates, and integrity / security
            changes. Every entry ships a content hash so external clients can verify.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {(["rss", "atom"] as const).map((feedId) => {
            const destination = changelogFeedEgressDestination(feedId);
            if (!destination) return null;
            return (
              <a
                key={feedId}
                href={destination.href}
                onClick={() =>
                  trackEvent(
                    changelogFeedEgressAnalyticsEvent(),
                    changelogFeedEgressAnalyticsData(feedId, items.length),
                  )
                }
                className="inline-flex h-9 items-center gap-1.5 rounded-md border border-border bg-surface px-3 text-sm font-medium text-ink hover:bg-surface-2"
              >
                {feedId === "rss" ? (
                  <>
                    <Rss className="h-3.5 w-3.5" /> RSS
                  </>
                ) : (
                  "Atom"
                )}
              </a>
            );
          })}
        </div>
      </div>

      <div className="mt-8 flex flex-wrap items-center gap-2">
        <FilterChipGroup label="Filter changelog by stream" multi={false}>
          {FILTERS.map((f) => (
            <FilterChip
              key={f.id}
              role="radio"
              size="md"
              active={filter === f.id}
              onClick={() => onStreamFilter(f.id)}
            >
              {f.label}
            </FilterChip>
          ))}
        </FilterChipGroup>
        <span className="ml-1 font-mono text-xs text-ink-subtle" aria-live="polite">
          {items.length} entries
        </span>
      </div>

      <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_280px]">
        <ol className="relative space-y-6 border-l border-border pl-6">
          {items.map((note, i) => {
            const meta = STREAM_META[note.stream];
            const Icon = meta.Icon;
            return (
              <li key={i} className="relative">
                <span
                  className={cn(
                    "absolute -left-[31px] top-2 flex h-3.5 w-3.5 items-center justify-center rounded-full ring-4 ring-background",
                    meta.dot,
                  )}
                  aria-hidden
                />
                <article className="rounded-xl border border-border bg-surface p-5">
                  <header className="flex flex-wrap items-center gap-2 text-xs">
                    <span
                      className={cn(
                        "inline-flex items-center gap-1.5 rounded-md border px-2 py-0.5",
                        meta.tone,
                      )}
                    >
                      <Icon className="h-3 w-3" /> {meta.label}
                    </span>
                    <span className="font-mono text-ink-subtle">{note.date}</span>
                    {note.version && (
                      <code className="rounded bg-background px-1.5 py-0.5 font-mono text-ink-muted">
                        {note.version}
                      </code>
                    )}
                    {note.hash && (
                      <code className="ml-auto rounded bg-background px-1.5 py-0.5 font-mono text-ink-subtle">
                        {note.hash}
                      </code>
                    )}
                  </header>
                  <h2 className="mt-3 font-display text-lg font-semibold tracking-tight text-ink">
                    {note.title}
                  </h2>
                  <p className="mt-1.5 text-sm text-ink-muted">{note.body}</p>
                  {note.counts && (
                    <div className="mt-3 flex flex-wrap gap-2 text-[11px]">
                      {note.counts.added != null && (
                        <span className="inline-flex items-center gap-1 rounded-md border border-trust-trusted/40 bg-trust-trusted/10 px-2 py-0.5 text-ink">
                          <Plus className="h-3 w-3" /> {note.counts.added} added
                        </span>
                      )}
                      {note.counts.updated != null && (
                        <span className="inline-flex items-center gap-1 rounded-md border border-accent/40 bg-accent/15 px-2 py-0.5 text-ink">
                          <RefreshCw className="h-3 w-3" /> {note.counts.updated} updated
                        </span>
                      )}
                      {note.counts.removed != null && (
                        <span className="inline-flex items-center gap-1 rounded-md border border-trust-blocked/40 bg-trust-blocked/10 px-2 py-0.5 text-ink">
                          <Minus className="h-3 w-3" /> {note.counts.removed} removed
                        </span>
                      )}
                    </div>
                  )}
                  {note.diff && (
                    <details
                      className="mt-3 group"
                      onToggle={(e) =>
                        trackEvent(
                          changelogDiffDisclosureAnalyticsEvent(),
                          changelogDiffDisclosureAnalyticsData(
                            note.stream,
                            i,
                            e.currentTarget.open,
                            items.length,
                          ),
                        )
                      }
                    >
                      <summary className="inline-flex cursor-pointer items-center gap-1 text-xs font-medium text-ink-muted hover:text-ink">
                        What changed in this build →
                      </summary>
                      <div className="mt-3 grid gap-3 sm:grid-cols-3">
                        {(["added", "updated", "removed"] as const).map((k) => {
                          const items = note.diff![k];
                          if (!items?.length) return null;
                          const Icon = KIND_ICON[k];
                          return (
                            <div
                              key={k}
                              className="rounded-lg border border-border bg-background p-3"
                            >
                              <div className="mb-2 flex items-center gap-1.5 text-[11px] uppercase tracking-wider text-ink-subtle">
                                <Icon className="h-3 w-3" /> {k} · {items.length}
                              </div>
                              <ul className="space-y-1 text-xs">
                                {items.map((d, rowIndex) => {
                                  const destination = directoryPageEntryDestination(
                                    d.category,
                                    d.slug,
                                  );
                                  if (!destination) {
                                    return (
                                      <li key={`${d.category}/${d.slug}`} className="truncate">
                                        <span className="text-ink">{d.title}</span>
                                      </li>
                                    );
                                  }
                                  return (
                                    <li key={`${d.category}/${d.slug}`} className="truncate">
                                      <Link
                                        to={destination.to}
                                        params={destination.params}
                                        onClick={() =>
                                          trackEvent(
                                            changelogDiffEntryAnalyticsEvent(),
                                            changelogDiffEntryAnalyticsData(
                                              d.category,
                                              d.slug,
                                              k,
                                              rowIndex,
                                              items.length,
                                              note.stream,
                                            ),
                                          )
                                        }
                                        className="text-ink hover:underline"
                                      >
                                        {d.title}
                                      </Link>
                                    </li>
                                  );
                                })}
                              </ul>
                            </div>
                          );
                        })}
                      </div>
                      {note.prevHash && (
                        <a
                          href={`/api/registry/diff?from=${encodeURIComponent(note.prevHash)}&to=${encodeURIComponent(note.hash ?? "")}`}
                          onClick={() =>
                            trackEvent(
                              changelogDiffEgressAnalyticsEvent(),
                              changelogDiffEgressAnalyticsData(note.stream, i, items.length),
                            )
                          }
                          className="mt-3 inline-block text-[11px] font-mono text-ink-muted hover:text-ink"
                        >
                          Compare to {note.prevHash} →
                        </a>
                      )}
                    </details>
                  )}
                  {note.href && (
                    <Link
                      to={note.href}
                      onClick={() =>
                        trackEvent(
                          changelogReadMoreAnalyticsEvent(),
                          changelogReadMoreAnalyticsData(note.stream, i, items.length),
                        )
                      }
                      className="mt-3 inline-block text-xs font-medium text-ink hover:underline"
                    >
                      Read more →
                    </Link>
                  )}
                </article>
              </li>
            );
          })}
        </ol>

        <aside className="space-y-6">
          <div className="rounded-xl border border-border bg-surface p-5">
            <div className="eyebrow mb-2">Subscribe</div>
            <p className="text-xs text-ink-muted">
              Poll the diff endpoint or subscribe via your feed reader. Every payload carries a
              SHA-256.
            </p>
            <div className="mt-3 overflow-hidden rounded-md bg-background">
              <div className="flex justify-end border-b border-border px-3 py-1.5">
                <CopyButton
                  value="curl https://heyclau.de/api/registry/diff?since=2026-05-19"
                  label="Copy"
                  size="sm"
                  event={changelogPollCopyAnalyticsEvent()}
                  eventData={changelogPollCopyAnalyticsData(items.length)}
                />
              </div>
              <pre className="overflow-x-auto p-3 font-mono text-[11px] text-ink">
                {`curl https://heyclau.de/api/registry/diff?since=2026-05-19`}
              </pre>
            </div>
          </div>

          <div className="rounded-xl border border-border bg-surface p-5">
            <div className="eyebrow mb-2">Per-entry log</div>
            <ul className="space-y-2 text-xs">
              {CHANGELOG.map((c, i) => {
                const Icon = KIND_ICON[c.kind];
                return (
                  <li key={i} className="flex items-start gap-2">
                    <Icon
                      className={cn(
                        "mt-0.5 h-3 w-3 shrink-0",
                        c.kind === "added" && "text-trust-trusted",
                        c.kind === "updated" && "text-accent",
                        c.kind === "removed" && "text-trust-blocked",
                      )}
                    />
                    <div className="min-w-0">
                      <div className="truncate text-ink">{c.title}</div>
                      <div className="font-mono text-[10px] text-ink-subtle">
                        {c.date} · {c.hash}
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
            {(() => {
              const destination = changelogQualityEgressDestination("quality");
              if (!destination) return null;
              return (
                <Link
                  to={destination.to}
                  onClick={() =>
                    trackEvent(
                      changelogQualityEgressAnalyticsEvent(),
                      changelogQualityEgressAnalyticsData(items.length),
                    )
                  }
                  className="mt-3 inline-block text-xs font-medium text-ink hover:underline"
                >
                  See registry quality →
                </Link>
              );
            })()}
          </div>
        </aside>
      </div>
    </PageContainer>
  );
}
