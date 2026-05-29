import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import {
  ArrowUpRight,
  BookOpen,
  ExternalLink,
  GitBranch,
  ShieldCheck,
  AlertTriangle,
  ListChecks,
  Code2,
  Sparkles,
  Star,
  FileText,
  OctagonX,
} from "lucide-react";
import { getEntry, related } from "@/data/search";
import {
  CategoryPill,
  PlatformChip,
  SourceBadge,
  InstallRiskBadge,
  NotesPresenceChips,
} from "@/components/badges";
import { TrustDrilldown } from "@/components/trust-drilldown";
import { WatchButton } from "@/components/watch-button";
import { CopyButton } from "@/components/copy-button";
import { ResourceCard } from "@/components/resource-card";
// (HoverChevrons removed — related uses static grid)
import { ShareMenu } from "@/components/share-menu";
import { DossierTOC, type TocItem } from "@/components/dossier-toc";
import { EntryFacets } from "@/components/entry-facets";
import { HarnessBadge } from "@/components/harness-badge";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { NewsletterInline } from "@/components/newsletter-inline";
import { SourceCitations } from "@/components/source-citations";
import { StickyMetaBar } from "@/components/sticky-meta-bar";
import { EntrySignalsPanel } from "@/components/entry-signals-panel";
import { TRUST_LABEL } from "@/types/registry";
import { installRiskLevel, INSTALL_RISK_LABEL, INSTALL_RISK_DETAIL } from "@/lib/trust";
import { useEffect, useMemo, useState } from "react";
import { useRecents } from "@/lib/recents";
import { useCopyPref, useHarnessPref, type CopyVariant } from "@/lib/dossier-prefs";
import { variantsForEntry } from "@/components/copy-segmented";
import { HarnessVariantPicker } from "@/components/harness-variant-picker";
import type { Harness } from "@/types/registry";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/entry/$category/$slug")({
  loader: ({ params }): { entry: import("@/types/registry").Entry } => {
    const entry = getEntry(params.category, params.slug);
    if (!entry) throw notFound();
    return { entry };
  },
  head: ({ params, loaderData }) => {
    if (!loaderData) return { meta: [] };
    const e = loaderData.entry;
    const url = `/entry/${params.category}/${params.slug}`;
    const ld = {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      name: e.title,
      description: e.description,
      applicationCategory: e.category,
      operatingSystem: e.platforms.join(", "),
      author: { "@type": "Person", name: e.author },
      ...(e.stars
        ? {
            aggregateRating: {
              "@type": "AggregateRating",
              ratingValue: "4.5",
              ratingCount: e.stars,
            },
          }
        : {}),
      ...(e.sourceUrl ? { url: e.sourceUrl } : {}),
    };
    const breadcrumbs = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Directory", item: "/browse" },
        {
          "@type": "ListItem",
          position: 2,
          name: e.category,
          item: `/browse?category=${e.category}`,
        },
        { "@type": "ListItem", position: 3, name: e.title, item: url },
      ],
    };
    const ogUrl = `/og/${params.category}/${params.slug}`;
    return {
      meta: [
        { title: `${e.title} — HeyClaude` },
        { name: "description", content: e.description },
        { property: "og:title", content: `${e.title} — HeyClaude` },
        { property: "og:description", content: e.description },
        { property: "og:url", content: url },
        { property: "og:type", content: "article" },
        { property: "og:image", content: ogUrl },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:title", content: e.title },
        { name: "twitter:description", content: e.description },
        { name: "twitter:image", content: ogUrl },
      ],
      links: [{ rel: "canonical", href: url }],
      scripts: [
        { type: "application/ld+json", children: JSON.stringify(ld) },
        { type: "application/ld+json", children: JSON.stringify(breadcrumbs) },
      ],
    };
  },
  component: Dossier,
});

function Dossier() {
  const data = Route.useLoaderData() as { entry: import("@/types/registry").Entry };
  const entry = data.entry;
  const rel = related(entry);
  const recents = useRecents();
  useEffect(() => {
    recents.pushEntry({ category: entry.category, slug: entry.slug, title: entry.title });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [entry.category, entry.slug]);
  const harnessAvailable = useMemo<Harness[]>(
    () => (entry.harnessVariants ? (Object.keys(entry.harnessVariants) as Harness[]) : []),
    [entry.harnessVariants],
  );
  const [harness, setHarness] = useHarnessPref(entry.category, entry.slug, harnessAvailable);
  const liveVariants = useMemo(() => variantsForEntry(entry, harness), [entry, harness]);
  const firstAvailable: CopyVariant = liveVariants.find((v) => v.value)?.id ?? "install";
  const [pref, setPref] = useCopyPref();
  const variantHas = (v: CopyVariant) => !!liveVariants.find((x) => x.id === v)?.value;
  const tab: CopyVariant = pref && variantHas(pref) ? pref : firstAvailable;
  const setTab = (v: CopyVariant) => setPref(v);

  const tabPayload = liveVariants.find((v) => v.id === tab)?.value;

  const risk = installRiskLevel(entry);

  const tocItems = useMemo<TocItem[]>(() => {
    const items: TocItem[] = [];
    if (risk !== "low") items.push({ id: "risk-callout", label: "Install risk" });
    if (entry.safetyNotes) items.push({ id: "safety", label: "Safety notes" });
    if (entry.privacyNotes) items.push({ id: "privacy", label: "Privacy notes" });
    if (entry.prerequisites && entry.prerequisites.length > 0)
      items.push({ id: "prerequisites", label: "Prerequisites" });
    items.push({ id: "about", label: "About this resource" });
    items.push({ id: "citations", label: "Source citations" });
    if (rel.length > 0) items.push({ id: "related", label: "Related" });
    items.push({ id: "signals", label: "Signals" });
    return items;
  }, [risk, entry.safetyNotes, entry.privacyNotes, entry.prerequisites, rel.length]);

  const entryUrl = `/entry/${entry.category}/${entry.slug}`;

  return (
    <div className="mx-auto max-w-[1200px] px-4 py-8 sm:px-6">
      <StickyMetaBar entry={entry} watchSentinelId="dossier-header-sentinel" />
      {/* Breadcrumb */}
      <Breadcrumbs
        items={[
          { label: "Directory", to: "/browse" },
          { label: entry.category, to: "/browse", search: { category: entry.category } },
          { label: entry.title },
        ]}
      />

      {/* Header */}
      <header className="mt-6 grid gap-6 border-b border-border pb-8 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <CategoryPill>{entry.category}</CategoryPill>
            <TrustDrilldown entry={entry} />
            <SourceBadge status={entry.source} />
            <InstallRiskBadge entry={entry} />
            <NotesPresenceChips entry={entry} className="ml-1" />
            {entry.claimed && (
              <span className="inline-flex items-center gap-1 rounded-md bg-surface-2 px-1.5 py-0.5 text-[11px] text-ink-muted">
                <Sparkles className="h-3 w-3" />
                Claimed
              </span>
            )}
            <WatchButton
              id={`entry:${entry.category}/${entry.slug}`}
              kind="entry"
              label={entry.title}
              href={`/entry/${entry.category}/${entry.slug}`}
              size="sm"
            />
            <ShareMenu
              url={entryUrl}
              title={entry.title}
              description={entry.description}
              ogUrl={`/og/${entry.category}/${entry.slug}`}
              llmsUrl={`/data/llms/${entry.category}/${entry.slug}.txt`}
            />
          </div>

          <h1 className="mt-4 h-display-1 text-ink text-balance">{entry.title}</h1>
          <p className="mt-4 max-w-2xl text-pretty text-base text-ink-muted sm:text-lg">
            {entry.description}
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-ink-muted">
            <span>
              by <span className="text-ink">{entry.author}</span>
            </span>
            <span>·</span>
            <span>added {entry.dateAdded}</span>
            {entry.stars !== undefined && (
              <>
                <span>·</span>
                <span className="inline-flex items-center gap-1">
                  <Star className="h-3 w-3" />
                  {entry.stars.toLocaleString()}
                </span>
              </>
            )}
            <span>·</span>
            <div className="flex flex-wrap gap-1">
              {entry.platforms.map((p) => (
                <PlatformChip key={p} id={p} />
              ))}
            </div>
          </div>
          {entry.harness && entry.harness.length > 0 && (
            <div className="mt-3 flex flex-wrap items-center gap-1.5">
              <span className="eyebrow mr-1">Harness</span>
              {entry.harness.map((h) => (
                <HarnessBadge key={h} id={h} />
              ))}
            </div>
          )}
          <EntryFacets entry={entry} density="card" className="mt-3" />
        </div>

        {/* Sticky install panel */}
        <aside className="lg:sticky lg:top-20 lg:self-start">
          <div className="overflow-hidden rounded-xl border border-border bg-surface">
            <div className="flex items-center justify-between border-b border-border px-4 py-2.5">
              <div className="eyebrow">Install</div>
              {entry.sourceUrl && (
                <a
                  href={entry.sourceUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-xs text-ink-muted hover:text-ink"
                >
                  Source <ArrowUpRight className="h-3 w-3" />
                </a>
              )}
            </div>
            {harnessAvailable.length >= 2 && (
              <div className="border-b border-border px-3 py-2">
                <div className="mb-1.5 text-[10px] uppercase tracking-wider text-ink-subtle">
                  Harness variant
                </div>
                <HarnessVariantPicker
                  available={harnessAvailable}
                  value={harness as Harness | null}
                  onChange={setHarness}
                />
              </div>
            )}
            <div className="flex gap-1 border-b border-border px-3 pt-2">
              {(["install", "config", "full"] as const).map((t) => {
                const payload = liveVariants.find((v) => v.id === t)?.value;
                if (!payload) return null;
                return (
                  <button
                    key={t}
                    onClick={() => setTab(t)}
                    aria-pressed={tab === t}
                    className={cn(
                      "rounded-t-md px-2.5 py-1.5 text-xs font-medium capitalize focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60",
                      tab === t ? "bg-background text-ink" : "text-ink-muted hover:text-ink",
                    )}
                  >
                    {t}
                  </button>
                );
              })}
            </div>
            <div className="bg-background p-3">
              {tabPayload ? (
                <>
                  <pre className="max-h-64 overflow-auto rounded-md bg-surface-2 p-3 font-mono text-[12px] leading-relaxed text-ink">
                    <code>{tabPayload}</code>
                  </pre>
                  <div className="mt-3 flex items-center gap-2">
                    <CopyButton
                      value={tabPayload}
                      label={`Copy ${tab}`}
                      size="md"
                      className="flex-1 justify-center"
                    />
                  </div>
                </>
              ) : (
                <div className="rounded-md bg-surface-2 p-4 text-xs text-ink-muted">
                  No installable payload for this tab.
                </div>
              )}
            </div>

            <div className="border-t border-border px-4 py-3">
              <div className="eyebrow mb-2">Readiness</div>
              <ul className="space-y-1.5 text-xs">
                <Readiness
                  label="Trust"
                  value={TRUST_LABEL[entry.trust]}
                  ok={entry.trust === "trusted"}
                />
                <Readiness label="Source" value={entry.source} ok={entry.source !== "unverified"} />
                <Readiness
                  label="Safety notes"
                  value={entry.safetyNotes ? "Present" : "Missing"}
                  ok={!!entry.safetyNotes}
                />
                <Readiness
                  label="Reviewed"
                  value={entry.reviewed ? "Yes" : "No"}
                  ok={!!entry.reviewed}
                />
              </ul>
            </div>
          </div>

          <div className="mt-3 flex flex-col gap-1.5 text-xs">
            {entry.docsUrl && (
              <a
                href={entry.docsUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-ink-muted hover:text-ink"
              >
                <BookOpen className="h-3.5 w-3.5" /> Documentation{" "}
                <ExternalLink className="h-3 w-3" />
              </a>
            )}
            {entry.sourceUrl && (
              <a
                href={entry.sourceUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-ink-muted hover:text-ink"
              >
                <GitBranch className="h-3.5 w-3.5" /> Source repository{" "}
                <ExternalLink className="h-3 w-3" />
              </a>
            )}
            <Link
              to="/browse"
              className="inline-flex items-center gap-1.5 text-ink-muted hover:text-ink"
            >
              <Code2 className="h-3.5 w-3.5" /> Registry JSON · LLM text
            </Link>
          </div>
        </aside>
      </header>
      <div id="dossier-header-sentinel" aria-hidden className="h-px w-full" />

      {/* Body */}
      <div className="grid gap-8 py-8 lg:grid-cols-[minmax(0,1fr)_280px]">
        <div className="min-w-0 space-y-8">
          {risk !== "low" && (
            <section
              id="risk-callout"
              className={cn(
                "scroll-mt-24 flex items-start gap-3 rounded-xl border p-4 text-sm",
                risk === "high"
                  ? "border-trust-blocked/40 bg-trust-blocked/5"
                  : "border-trust-review/40 bg-trust-review/5",
              )}
            >
              {risk === "high" ? (
                <OctagonX className="mt-0.5 h-4 w-4 shrink-0 text-trust-blocked" aria-hidden />
              ) : (
                <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-trust-review" aria-hidden />
              )}
              <div className="min-w-0 flex-1">
                <div className="font-semibold text-ink">
                  {INSTALL_RISK_LABEL[risk]} —{" "}
                  {risk === "high" ? "do not install without review" : "review before installing"}
                </div>
                <p className="mt-1 text-ink-muted">{INSTALL_RISK_DETAIL[risk]}</p>
              </div>
            </section>
          )}
          {entry.safetyNotes && (
            <DossierSection id="safety" icon={ShieldCheck} title="Safety notes" tone="trust">
              <p>{entry.safetyNotes}</p>
            </DossierSection>
          )}
          {entry.privacyNotes && (
            <DossierSection id="privacy" icon={AlertTriangle} title="Privacy notes">
              <p>{entry.privacyNotes}</p>
            </DossierSection>
          )}
          {entry.prerequisites && entry.prerequisites.length > 0 && (
            <DossierSection id="prerequisites" icon={ListChecks} title="Prerequisites">
              <ul className="space-y-1.5">
                {entry.prerequisites.map((p) => (
                  <li key={p} className="flex items-start gap-2">
                    <ListChecks
                      className="mt-0.5 h-3.5 w-3.5 shrink-0 text-ink-muted"
                      aria-hidden
                    />
                    <span>{p}</span>
                  </li>
                ))}
              </ul>
            </DossierSection>
          )}
          <DossierSection id="about" title="About this resource">
            <p>
              {entry.body ??
                `${entry.title} is curated in the HeyClaude registry. Review the source repository before installing. Trust and source signals are derived from metadata review, not from runtime scanning.`}
            </p>
            <div className="mt-4 flex flex-wrap gap-1.5">
              {entry.tags.map((t) => (
                <span
                  key={t}
                  className="inline-flex rounded-md border border-border bg-surface px-2 py-0.5 text-xs text-ink-muted"
                >
                  #{t}
                </span>
              ))}
            </div>
          </DossierSection>

          <DossierSection id="citations" icon={FileText} title="Source citations">
            <SourceCitations entry={entry} />
          </DossierSection>

          {rel.length > 0 && (
            <DossierSection id="related" title="Related resources">
              <div className="grid gap-3 sm:grid-cols-2">
                {rel.slice(0, 4).map((e) => (
                  <ResourceCard key={`${e.category}/${e.slug}`} entry={e} variant="grid" />
                ))}
              </div>
              <div className="mt-3 text-right">
                <Link
                  to="/browse"
                  search={{ category: entry.category }}
                  className="story-link text-xs font-medium text-ink"
                >
                  More in {entry.category} →
                </Link>
              </div>
            </DossierSection>
          )}

          <DossierSection id="signals" title="Signals">
            <EntrySignalsPanel category={entry.category} slug={entry.slug} />
          </DossierSection>

          <NewsletterInline
            variant="quiet"
            title="More like this, weekly"
            description="A short, calm digest of reviewed Claude resources. Unsubscribe any time."
            source={`entry:${entry.category}/${entry.slug}`}
          />
        </div>

        <aside className="space-y-6">
          <div className="hidden lg:block lg:sticky lg:top-20">
            <DossierTOC items={tocItems} />
          </div>
          <div className="rounded-xl border border-border bg-surface p-4 text-xs text-ink-muted">
            HeyClaude reviews metadata, provenance, and surface-level safety. We don't scan for
            malware. Always read the source before installing tools that touch your filesystem,
            network, or credentials.
          </div>
        </aside>
      </div>
    </div>
  );
}

function DossierSection({
  id,
  title,
  icon: Icon,
  tone,
  children,
}: {
  id?: string;
  title: string;
  icon?: React.ElementType;
  tone?: "trust";
  children: React.ReactNode;
}) {
  return (
    <section
      id={id}
      className={cn(
        "surface-raised scroll-mt-24 rounded-xl border bg-surface p-5",
        tone === "trust" ? "border-trust-trusted/40" : "border-border",
      )}
    >
      <div className="mb-3 flex items-center gap-2">
        {Icon && <Icon className="h-4 w-4 text-ink" />}
        <h2 className="font-display text-base font-semibold tracking-tight text-ink">{title}</h2>
      </div>
      <div className="prose-editorial text-sm">{children}</div>
    </section>
  );
}

function Readiness({ label, value, ok }: { label: string; value: string; ok: boolean }) {
  return (
    <li className="flex items-center justify-between">
      <span className="text-ink-muted">{label}</span>
      <span
        className={cn("font-medium capitalize", ok ? "text-trust-trusted" : "text-trust-review")}
      >
        {value}
      </span>
    </li>
  );
}
