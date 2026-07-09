import { createFileRoute, Link, notFound, redirect } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import {
  ExternalLink,
  ShieldCheck,
  AlertTriangle,
  ListChecks,
  Sparkles,
  Star,
  FileText,
  OctagonX,
  Package,
  Terminal,
  Layers,
  BadgeCheck,
  Globe2,
  ArrowLeft,
} from "lucide-react";
import { getEntry, related, relatedGroups, relatedGuides } from "@/data/search";
import { getEntryRedirectTarget } from "@/lib/entry-redirects";
import { BEST_LISTS, ENTRIES } from "@/data/entries";
import { COMPARISONS } from "@/data/comparisons";
import { EntryAuthorAttribution } from "@/components/contributor-attribution";
import { findContributorForIdentity } from "@/data/contributors";
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
import { ComparisonTable } from "@/components/comparison-table";
import { compareEntryInteractiveUiState } from "@/lib/compare-entry-interactive-ui-lib";
import { buildEntryJsonLd } from "@heyclaude/registry";
import { stringifyJsonLd } from "@/lib/json-ld";
import { entryWebPageJsonLd } from "@/lib/entry-webpage-jsonld-lib";
import { hasSchemaDetails } from "@/lib/entry-schema-details-lib";
import { booleanLabel } from "@/lib/boolean-label-lib";
import { absoluteUrl, clampDescription } from "@/lib/seo";
import { categoryLabels, categoryUsageHints, siteConfig } from "@/lib/site";
import { tagSlug } from "@/lib/tags";
// (HoverChevrons removed — related uses static grid)
import { ShareMenu } from "@/components/share-menu";
import type { TocItem } from "@/components/dossier-toc";
import { EntryDetailRail } from "@/components/entry-detail-rail";
import { EntryFacets } from "@/components/entry-facets";
import { HarnessBadge } from "@/components/harness-badge";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { NewsletterInline } from "@/components/newsletter-inline";
import { SourceCitations } from "@/components/source-citations";
import { CitationFacts } from "@/components/citation-facts";
import { StickyMetaBar } from "@/components/sticky-meta-bar";
import { EntryDetailCommandCenter } from "@/components/entry-detail-command-center";
import { EntryDetailMobileActionBar } from "@/components/entry-detail-mobile-action-bar";
import { EntrySignalsPanel } from "@/components/entry-signals-panel";
import { EntryDetailDecisionPlaybook } from "@/components/entry-detail-decision-playbook";
import { EntryDecisionTimelinePanel } from "@/components/entry-decision-timeline-panel";
import { EntryBrandMark } from "@/components/entry-brand-mark";
import { EntryAdoptionPlanPanel } from "@/components/entry-adoption-plan-panel";
import { EntryEvidenceReadinessMatrix } from "@/components/entry-evidence-readiness-matrix";
import { EntryCompareBenchmarkPanel } from "@/components/entry-compare-benchmark-panel";
import { PLATFORM_SUPPORT_LABEL, type Entry } from "@/types/registry";
import {
  buildEntryTocItems,
  entryQuickLinks,
  entryReadinessRows,
} from "@/lib/entry-detail-sidebar-lib";
import { installRiskLevel, INSTALL_RISK_LABEL, INSTALL_RISK_DETAIL } from "@/lib/trust";
import { useEffect, useMemo, useState, useCallback } from "react";
import { toast } from "sonner";
import { useRecents } from "@/lib/recents";
import { useCompare, useIsCompared } from "@/lib/compare";
import { serializeCompareItems } from "@/lib/compare-selection";
import { trackEvent } from "@/lib/analytics";
import {
  entryDetailCompareAnalyticsData,
  entryDetailCompareAnalyticsEvent,
  entryDetailMobileCompareAnalyticsData,
  entryDetailMobileCompareAnalyticsEvent,
  entryDetailPlaybookActionAnalyticsData,
  entryDetailPlaybookActionAnalyticsEvent,
} from "@/lib/entry-detail-cta-events";
import { resourceCardCompareFullMessage } from "@/lib/resource-card-compare-ui";
import { useCopyPref, useHarnessPref, type CopyVariant } from "@/lib/dossier-prefs";
import { variantsForEntry } from "@/components/copy-segmented";
import type { Harness } from "@/types/registry";
import { cn } from "@/lib/utils";
import { entryAdoptionPlanState, type AdoptionPlanPresetId } from "@/lib/entry-adoption-plan";
import { entryDetailDecisionPlaybookState } from "@/lib/entry-detail-decision-playbook";
import {
  entryEvidenceReadinessMatrixState,
  type EvidenceMatrixPresetId,
} from "@/lib/entry-evidence-readiness-matrix";
import {
  entryDecisionTimelineState,
  type DecisionTimelinePresetId,
} from "@/lib/entry-decision-timeline";
import {
  entryCompareBenchmarkState,
  type CompareBenchmarkPresetId,
} from "@/lib/entry-compare-benchmark";

const loadFullEntry = createServerFn({ method: "GET" })
  .inputValidator(z.object({ category: z.string().min(1), slug: z.string().min(1) }))
  .handler(async ({ data }) => {
    const { getEntry } = await import("@/lib/content.server");
    const { renderMarkdown } = await import("@/lib/detail-assembly");
    const { buildEntry } = await import("@/data/entry-normalize");
    const entry = await getEntry(data.category, data.slug);
    if (!entry) return null;

    const [bodyHtml, sections] = await Promise.all([
      entry.body ? renderMarkdown(entry.body) : Promise.resolve(undefined),
      Promise.all(
        (entry.sections ?? []).map(async (section) => ({
          ...section,
          html: section.markdown ? await renderMarkdown(section.markdown) : undefined,
        })),
      ),
    ]);

    return buildEntry({ ...entry, bodyHtml, sections });
  });

// Entry JSON-LD is generated by the registry's canonical `buildEntryJsonLd`
// (packages/registry/src/seo.js) so the page can't drift from the shared type
// policy (guides -> TechArticle, code-like -> SoftwareSourceCode, else
// CreativeWork) or the generated-artifact schema. That helper only emits
// visible, source-backed fields and never fabricates ratings/reviews/scores;
// see tests/seo-jsonld.test.ts.
const entryJsonLd = (e: Entry) =>
  buildEntryJsonLd(e as Parameters<typeof buildEntryJsonLd>[0], {
    siteUrl: siteConfig.url,
  });

export const Route = createFileRoute("/entry/$category/$slug")({
  loader: async ({ params }): Promise<{ entry: import("@/types/registry").Entry }> => {
    // Consolidated/removed entries 301 to their surviving canonical page so the
    // old URL keeps its SEO signal instead of 404ing.
    const consolidated = getEntryRedirectTarget(params.category, params.slug);
    if (consolidated) {
      throw redirect({
        to: "/entry/$category/$slug",
        params: consolidated,
        replace: true,
        statusCode: 301,
      });
    }
    const fullEntry = await loadFullEntry({
      data: { category: params.category, slug: params.slug },
    }).catch(() => null);
    const entry = fullEntry ?? getEntry(params.category, params.slug);
    if (!entry) throw notFound();
    return { entry };
  },
  head: ({ params, loaderData }) => {
    if (!loaderData) return { meta: [] };
    const e = loaderData.entry;
    const path = `/entry/${params.category}/${params.slug}`;
    const url = absoluteUrl(path);
    const ld = entryWebPageJsonLd(e, url);
    const breadcrumbs = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Directory", item: absoluteUrl("/browse") },
        {
          "@type": "ListItem",
          position: 2,
          name: e.category,
          item: absoluteUrl(`/${e.category}`),
        },
        { "@type": "ListItem", position: 3, name: e.title, item: url },
      ],
    };
    const ogUrl = absoluteUrl(`/og/${params.category}/${params.slug}`);
    const ogTitle = `${e.title} — HeyClaude`;
    const metaDescription = clampDescription(e.seoDescription ?? e.description);
    return {
      meta: [
        { title: e.seoTitle ? `${e.seoTitle} — HeyClaude` : ogTitle },
        { name: "description", content: metaDescription },
        { property: "og:title", content: ogTitle },
        { property: "og:description", content: metaDescription },
        { property: "og:url", content: url },
        { property: "og:type", content: "article" },
        { property: "og:image", content: ogUrl },
        { property: "og:image:type", content: "image/png" },
        { property: "og:image:width", content: "1200" },
        { property: "og:image:height", content: "630" },
        { property: "article:published_time", content: e.dateAdded },
        { property: "article:modified_time", content: e.reviewedAt ?? e.dateAdded },
        ...(e.author ? [{ property: "article:author", content: e.author }] : []),
        { property: "article:section", content: e.category },
        ...(e.tags ?? []).map((tag) => ({ property: "article:tag", content: tag })),
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:title", content: ogTitle },
        { name: "twitter:description", content: metaDescription },
        { name: "twitter:image", content: ogUrl },
      ],
      links: [
        { rel: "canonical", href: url },
        {
          rel: "alternate",
          type: "text/plain",
          href: absoluteUrl(`/api/registry/entries/${params.category}/${params.slug}/llms`),
          title: "Citation facts (plain text)",
        },
      ],
      scripts: [
        { type: "application/ld+json", children: stringifyJsonLd(ld) },
        { type: "application/ld+json", children: stringifyJsonLd(breadcrumbs) },
        { type: "application/ld+json", children: stringifyJsonLd(entryJsonLd(e)) },
      ],
    };
  },
  component: Dossier,
});

const RELATION_LABELS: Record<string, string> = {
  alternative: "Alternatives",
  "works-with": "Works with",
  complementary: "Complementary",
  extends: "Extends",
  prerequisite: "Prerequisites",
  "same-project": "Same project",
  "same-ecosystem": "Same ecosystem",
  "collection-member": "In the same collection",
  related: "Related",
};

function Dossier() {
  const data = Route.useLoaderData() as { entry: Entry };
  const entry = data.entry;
  // Memoized: related() scans all entries (tag-overlap fallback); recomputing on every harness/tab
  // toggle was wasted work. entry is stable per page.
  const rel = useMemo(() => related(entry), [entry]);
  const relGroups = useMemo(() => relatedGroups(entry), [entry]);
  // Up to 3 closest alternatives for a side-by-side comparison table — prefer
  // the typed "alternative" relation, fall back to the flat related set.
  const alternatives = useMemo(() => {
    const altGroup = relGroups.find((g) => g.relation === "alternative");
    const pool = altGroup && altGroup.entries.length > 0 ? altGroup.entries : rel;
    return pool.slice(0, 3);
  }, [relGroups, rel]);
  const entryRef = `${entry.category}/${entry.slug}`;
  const comparedIn = COMPARISONS.filter((c) => c.refs.includes(entryRef));
  const featuredIn = BEST_LISTS.filter((l) => l.picks.some((p) => p.ref === entryRef));
  const {
    dossierUi: dossierCompareUi,
    featuredUi,
    hasFeaturedLinks,
    showDossierCompareSection,
  } = useMemo(
    () => compareEntryInteractiveUiState(entry, alternatives, comparedIn, featuredIn, ENTRIES),
    [entry, alternatives, comparedIn, featuredIn],
  );
  // Deterministic "how do I use this" next-step links — guides sharing a tag,
  // minus any guide already shown in the related grid (no duplicate links).
  const guides = useMemo(() => {
    const shown = new Set(
      (relGroups.length > 0 ? relGroups.flatMap((g) => g.entries) : rel).map(
        (e) => `${e.category}/${e.slug}`,
      ),
    );
    return relatedGuides(entry).filter((g) => !shown.has(`${g.category}/${g.slug}`));
  }, [entry, relGroups, rel]);
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

  const compare = useCompare();
  const [adoptionPreset, setAdoptionPreset] = useState<AdoptionPlanPresetId>("balanced-rollout");
  const [evidencePreset, setEvidencePreset] = useState<EvidenceMatrixPresetId>("balanced");
  const [timelinePreset, setTimelinePreset] = useState<DecisionTimelinePresetId>("balanced");
  const [benchmarkPreset, setBenchmarkPreset] = useState<CompareBenchmarkPresetId>("balanced");
  const inCompare = useIsCompared(entry);
  const onToggleCompare = useCallback(() => {
    const wasIn = inCompare;
    const changed = compare.toggle(entry);
    if (!changed) {
      toast.error(resourceCardCompareFullMessage());
      return;
    }
    trackEvent(entryDetailCompareAnalyticsEvent(!wasIn), {
      ...entryDetailCompareAnalyticsData(entry.category, entry.slug),
      compareCount: wasIn ? Math.max(0, compare.items.length - 1) : compare.items.length + 1,
    });
    if (wasIn) {
      toast(`Removed “${entry.title}” from compare`);
    } else {
      toast.success("Added to compare", {
        action: {
          label: "View",
          onClick: () => compare.setOpen(true),
        },
      });
    }
  }, [compare, entry, inCompare]);
  const onMobileToggleCompare = useCallback(() => {
    const wasIn = inCompare;
    const changed = compare.toggle(entry);
    if (!changed) {
      toast.error(resourceCardCompareFullMessage());
      return;
    }
    trackEvent(entryDetailMobileCompareAnalyticsEvent(!wasIn), {
      ...entryDetailMobileCompareAnalyticsData(
        entry.category,
        entry.slug,
        wasIn ? Math.max(0, compare.items.length - 1) : compare.items.length + 1,
      ),
    });
    if (wasIn) {
      toast(`Removed “${entry.title}” from compare`);
    } else {
      toast.success("Added to compare", {
        action: {
          label: "View",
          onClick: () => compare.setOpen(true),
        },
      });
    }
  }, [compare, entry, inCompare]);
  const onOpenCompare = useCallback(() => {
    compare.setOpen(true);
    trackEvent("detail_compare_open_tray", {
      ...entryDetailCompareAnalyticsData(entry.category, entry.slug),
      compareCount: compare.items.length,
    });
  }, [compare, entry.category, entry.slug]);

  const compareIds = useMemo(() => serializeCompareItems(compare.items), [compare.items]);
  const onPlaybookAction = useCallback(
    (actionId: string) => {
      trackEvent(entryDetailPlaybookActionAnalyticsEvent(actionId), {
        ...entryDetailPlaybookActionAnalyticsData(
          entry.category,
          entry.slug,
          actionId,
          compare.items.length,
        ),
      });
    },
    [compare.items.length, entry.category, entry.slug],
  );
  const onPlaybookToggleCompare = useCallback(() => {
    const wasIn = inCompare;
    const changed = compare.toggle(entry);
    if (!changed) {
      toast.error(resourceCardCompareFullMessage());
      return;
    }
    if (wasIn) {
      toast(`Removed “${entry.title}” from compare`);
    } else {
      toast.success("Added to compare", {
        action: {
          label: "View",
          onClick: () => compare.setOpen(true),
        },
      });
    }
  }, [compare, entry, inCompare]);
  const onPlaybookOpenCompareTray = useCallback(() => {
    compare.setOpen(true);
  }, [compare]);

  const risk = installRiskLevel(entry);
  const hasSchema = hasSchemaDetails(entry);

  const tocItems = useMemo<TocItem[]>(
    () =>
      buildEntryTocItems({
        risk,
        hasSafetyNotes: Boolean(entry.safetyNotes),
        hasPrivacyNotes: Boolean(entry.privacyNotes),
        hasPrerequisites: Boolean(entry.prerequisites?.length),
        hasSchema,
        hasAlternatives: alternatives.length > 0,
        hasRelated: rel.length > 0,
        hasGuides: guides.length > 0,
      }),
    [
      risk,
      entry.safetyNotes,
      entry.privacyNotes,
      entry.prerequisites,
      hasSchema,
      alternatives.length,
      rel.length,
      guides.length,
    ],
  );
  const quickLinks = useMemo(() => entryQuickLinks(entry), [entry]);
  const readinessRows = useMemo(() => entryReadinessRows(entry), [entry]);
  const adoptionPlan = useMemo(
    () => entryAdoptionPlanState(entry, adoptionPreset, compare.items),
    [entry, adoptionPreset, compare.items],
  );
  const decisionPlaybook = useMemo(
    () => entryDetailDecisionPlaybookState(entry, compare.items),
    [entry, compare.items],
  );
  const evidenceMatrix = useMemo(
    () => entryEvidenceReadinessMatrixState(entry, evidencePreset, compare.items),
    [entry, evidencePreset, compare.items],
  );
  const decisionTimeline = useMemo(
    () => entryDecisionTimelineState(entry, timelinePreset, compare.items),
    [entry, timelinePreset, compare.items],
  );
  const compareBenchmark = useMemo(
    () => entryCompareBenchmarkState(entry, benchmarkPreset, compare.items),
    [entry, benchmarkPreset, compare.items],
  );
  const entryUrl = `/entry/${entry.category}/${entry.slug}`;

  return (
    <div className="mx-auto max-w-[1200px] px-4 py-8 sm:px-6">
      <StickyMetaBar entry={entry} watchSentinelId="dossier-header-sentinel" />
      {/* Breadcrumb */}
      <Breadcrumbs
        items={[
          { label: "Directory", to: "/browse" },
          {
            label: categoryLabels[entry.category] ?? entry.category,
            to: "/$category",
            params: { category: entry.category },
          },
          { label: entry.title },
        ]}
      />

      {/* Header */}
      <header className="mt-6 grid grid-cols-[minmax(0,1fr)] gap-6 border-b border-border pb-8 lg:grid-cols-[minmax(0,1fr)_320px]">
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
              llmsUrl={`/api/registry/entries/${entry.category}/${entry.slug}/llms`}
            />
          </div>

          <div className="mt-4 flex min-w-0 items-start gap-4">
            <EntryBrandMark entry={entry} size="lg" priority className="mt-1" />
            <h1 className="min-w-0 flex-1 h-display-1 text-ink text-balance">{entry.title}</h1>
          </div>
          <p className="mt-4 max-w-2xl text-pretty text-base text-ink-muted sm:text-lg">
            {entry.description}
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-ink-muted">
            <EntryAuthorAttribution entry={entry} />
            <span>·</span>
            <span>added {entry.dateAdded}</span>
            {entry.repoStats?.stars !== undefined && (
              <>
                <span>·</span>
                <span className="inline-flex items-center gap-1" title="Source repository stars">
                  <Star className="h-3 w-3" />
                  {entry.repoStats.stars.toLocaleString()} source repo stars
                </span>
              </>
            )}
            <span>·</span>
            <div className="flex flex-wrap gap-1">
              {entry.platforms.map((p) => (
                <PlatformChip key={p} id={p} asLink />
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

        <EntryDetailCommandCenter
          entry={entry}
          risk={risk}
          harnessAvailable={harnessAvailable}
          harness={harness as Harness | null}
          onHarnessChange={(h) => setHarness(h)}
          liveVariants={liveVariants}
          tab={tab}
          onTabChange={setTab}
          tabPayload={tabPayload}
          relatedCount={rel.length}
          guideCount={guides.length}
          compareCta={{
            inCompare,
            compareCount: compare.items.length,
            onToggle: onToggleCompare,
            onOpenCompare,
          }}
        />
      </header>
      <div id="dossier-header-sentinel" aria-hidden className="h-px w-full" />

      {/* Body */}
      <div className="grid grid-cols-[minmax(0,1fr)] gap-8 py-8 lg:grid-cols-[minmax(0,1fr)_280px]">
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
          <DossierSection id="citation-facts" icon={FileText} title="Citation facts">
            <p className="mb-4 max-w-2xl text-sm text-ink-muted">
              Source-backed facts for citing this resource, derived directly from the registry —
              also available as{" "}
              <a
                href={`/api/registry/entries/${entry.category}/${entry.slug}/llms`}
                className="text-ink underline-offset-2 hover:underline"
              >
                plain text
              </a>{" "}
              for AI assistants.
            </p>
            <CitationFacts entry={entry} />
          </DossierSection>
          <EntryDetailDecisionPlaybook
            state={decisionPlaybook}
            compareIds={compareIds}
            onToggleCompare={onPlaybookToggleCompare}
            onOpenCompareTray={onPlaybookOpenCompareTray}
            onAction={onPlaybookAction}
          />
          <EntryAdoptionPlanPanel
            state={adoptionPlan}
            selectedPreset={adoptionPreset}
            onSelectPreset={setAdoptionPreset}
          />
          <EntryEvidenceReadinessMatrix
            state={evidenceMatrix}
            selectedPreset={evidencePreset}
            onSelectPreset={setEvidencePreset}
          />
          <EntryDecisionTimelinePanel
            state={decisionTimeline}
            selectedPreset={timelinePreset}
            onSelectPreset={setTimelinePreset}
          />
          <EntryCompareBenchmarkPanel
            state={compareBenchmark}
            selectedPreset={benchmarkPreset}
            onSelectPreset={setBenchmarkPreset}
          />
          {entry.safetyNotes && (
            <DossierSection id="safety" icon={ShieldCheck} title="Safety notes" tone="trust">
              <NoteList value={entry.safetyNotesList ?? [entry.safetyNotes]} />
            </DossierSection>
          )}
          {entry.privacyNotes && (
            <DossierSection id="privacy" icon={AlertTriangle} title="Privacy notes">
              <NoteList value={entry.privacyNotesList ?? [entry.privacyNotes]} />
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
          {hasSchema && <SchemaDetails entry={entry} />}
          <DossierSection id="about" title="About this resource">
            {entry.bodyHtml ? (
              <MarkdownHtml html={entry.bodyHtml} />
            ) : entry.body ? (
              <pre className="whitespace-pre-wrap rounded-lg border border-border bg-surface-2 p-3 font-mono text-xs">
                {entry.body}
              </pre>
            ) : (
              <div className="space-y-3">
                <p>
                  <strong>{entry.title}</strong> is a{" "}
                  {categoryLabels[entry.category] ?? entry.category} resource for Claude
                  {entry.author ? ` by ${entry.author}` : ""}, curated and metadata-reviewed in the
                  HeyClaude registry.{" "}
                  {categoryUsageHints[entry.category] ??
                    "Open the source to review it before installing."}
                </p>
                {entry.platforms.length > 0 && (
                  <p>
                    Compatible with <span className="text-ink">{entry.platforms.join(", ")}</span>.
                  </p>
                )}
                {entry.tags.length > 0 && <p>Covers {entry.tags.slice(0, 8).join(", ")}.</p>}
                <p className="text-ink-muted">
                  Trust and source signals come from metadata review, not runtime scanning — always
                  read the source before installing anything that touches your filesystem, network,
                  or credentials.
                </p>
              </div>
            )}
            {entry.headings && entry.headings.length > 0 && (
              <div className="mt-5 rounded-lg border border-border bg-surface-2 p-3">
                <div className="eyebrow mb-2">Content outline</div>
                <ul className="grid gap-1 text-xs text-ink-muted sm:grid-cols-2">
                  {entry.headings.slice(0, 16).map((heading) => (
                    <li key={heading.id}>
                      <a href={`#${heading.id}`} className="hover:text-ink">
                        {heading.text}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            <div className="mt-4 flex flex-wrap gap-1.5">
              {entry.tags.map((t) => {
                const slug = tagSlug(t);
                const base =
                  "inline-flex rounded-md border border-border bg-surface px-2 py-0.5 text-xs text-ink-muted";
                // Tags that slugify to empty (all-symbol) have no hub — render a static chip.
                if (!slug) {
                  return (
                    <span key={t} className={base}>
                      #{t}
                    </span>
                  );
                }
                return (
                  <Link
                    key={t}
                    to="/tags/$tag"
                    params={{ tag: slug }}
                    className={`${base} hover:border-border-strong hover:text-ink`}
                  >
                    #{t}
                  </Link>
                );
              })}
            </div>
          </DossierSection>

          <DossierSection id="citations" icon={FileText} title="Source citations">
            <SourceCitations
              entry={entry}
              resolveContributorSlug={(name, profileUrl) =>
                findContributorForIdentity(name, profileUrl)?.slug
              }
            />
          </DossierSection>

          <BadgeSection category={entry.category} slug={entry.slug} title={entry.title} />

          {showDossierCompareSection && (
            <DossierSection id="compare" title="How it compares">
              <p className="mb-4 text-sm text-ink-muted">
                {entry.title} side by side with{" "}
                {alternatives.length === 1
                  ? "its closest alternative"
                  : `${alternatives.length} alternatives`}{" "}
                on trust, install, platform support, and disclosed safety notes — all from reviewed
                registry metadata.
              </p>
              {dossierCompareUi.bannerTexts.length > 0 ? (
                <div className="mb-4 space-y-1.5">
                  {dossierCompareUi.bannerTexts.map((text) => (
                    <p key={text} className="text-sm text-ink-muted">
                      {text}
                    </p>
                  ))}
                </div>
              ) : null}
              <ComparisonTable entries={[entry, ...alternatives]} showNextActions />
              {dossierCompareUi.interactiveSearch ? (
                <Link
                  to="/compare"
                  search={dossierCompareUi.interactiveSearch}
                  className="mt-4 inline-flex items-center gap-1.5 text-sm text-ink-muted hover:text-ink"
                >
                  <ArrowLeft className="h-4 w-4" />
                  {dossierCompareUi.interactiveLinkLabel}
                </Link>
              ) : null}
            </DossierSection>
          )}

          {(relGroups.length > 0 || rel.length > 0) && (
            <DossierSection id="related" title="Related resources">
              {relGroups.length > 0 ? (
                <div className="flex flex-col gap-6">
                  {relGroups.map((g) => (
                    <div key={g.relation}>
                      <div className="eyebrow mb-2">{RELATION_LABELS[g.relation] ?? "Related"}</div>
                      <div className="grid gap-3 sm:grid-cols-2">
                        {g.entries.map((e) => (
                          <ResourceCard key={`${e.category}/${e.slug}`} entry={e} variant="grid" />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="grid gap-3 sm:grid-cols-2">
                  {rel.slice(0, 4).map((e) => (
                    <ResourceCard key={`${e.category}/${e.slug}`} entry={e} variant="grid" />
                  ))}
                </div>
              )}
              <div className="mt-3 text-right">
                <Link
                  to="/$category"
                  params={{ category: entry.category }}
                  className="story-link text-xs font-medium text-ink"
                >
                  More in {categoryLabels[entry.category] ?? entry.category} →
                </Link>
              </div>
            </DossierSection>
          )}

          {guides.length > 0 && (
            <DossierSection id="guides" title="Related guides">
              <p className="mb-3 text-sm text-ink-muted">
                Source-backed guides for putting this to work.
              </p>
              <div className="grid gap-3 sm:grid-cols-2">
                {guides.map((g) => (
                  <ResourceCard key={`${g.category}/${g.slug}`} entry={g} variant="grid" />
                ))}
              </div>
            </DossierSection>
          )}

          {hasFeaturedLinks && (
            <DossierSection id="featured-in" title="Featured in">
              <ul className="flex flex-col gap-2 text-sm">
                {featuredIn.map((l) => {
                  const bestListLink = featuredUi.bestListLinks.find(
                    (link) => link.slug === l.slug,
                  );
                  return (
                    <li
                      key={`best-${l.slug}`}
                      className="flex flex-wrap items-baseline gap-x-2 gap-y-1"
                    >
                      <Link
                        to="/best/$slug"
                        params={{ slug: l.slug }}
                        className="story-link text-ink"
                      >
                        Best list: {l.title}
                      </Link>
                      {bestListLink?.search ? (
                        <Link
                          to="/compare"
                          search={bestListLink.search}
                          className="text-xs text-ink-muted hover:text-ink"
                        >
                          {bestListLink.label}
                        </Link>
                      ) : null}
                    </li>
                  );
                })}
                {comparedIn.map((c) => {
                  const featuredLink = featuredUi.comparisonLinks.find(
                    (link) => link.slug === c.slug,
                  );
                  return (
                    <li
                      key={`cmp-${c.slug}`}
                      className="flex flex-wrap items-baseline gap-x-2 gap-y-1"
                    >
                      <Link
                        to="/compare/$slug"
                        params={{ slug: c.slug }}
                        className="story-link text-ink"
                      >
                        Comparison: {c.title}
                      </Link>
                      {featuredLink?.search ? (
                        <Link
                          to="/compare"
                          search={featuredLink.search}
                          className="text-xs text-ink-muted hover:text-ink"
                        >
                          {featuredLink.label}
                        </Link>
                      ) : null}
                    </li>
                  );
                })}
              </ul>
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

        <EntryDetailRail
          entry={entry}
          tocItems={tocItems}
          quickLinks={quickLinks}
          readinessRows={readinessRows}
        />
      </div>
      <EntryDetailMobileActionBar
        entry={entry}
        copyPayload={tabPayload}
        compareCta={{
          inCompare,
          compareCount: compare.items.length,
          onToggle: onMobileToggleCompare,
        }}
      />
      <div className="h-14 lg:hidden" aria-hidden />
    </div>
  );
}

function BadgeSection({
  category,
  slug,
  title,
}: {
  category: string;
  slug: string;
  title: string;
}) {
  const badgeUrl = absoluteUrl(`/badge/${category}/${slug}.svg`);
  const entryUrl = absoluteUrl(`/entry/${category}/${slug}`);
  const markdown = `[![Listed on HeyClaude](${badgeUrl})](${entryUrl})`;
  return (
    <DossierSection id="badge" icon={BadgeCheck} title="Add this badge to your README">
      <p className="text-ink-muted">
        Show that <span className="text-ink">{title}</span> is listed on HeyClaude. Paste this
        Markdown into your README — it renders the badge and links back to this page.
      </p>
      <div className="mt-3 flex items-center gap-3">
        <a href={entryUrl} target="_blank" rel="noreferrer">
          <img src={badgeUrl} alt="Listed on HeyClaude" height={20} className="h-5 w-auto" />
        </a>
      </div>
      <div className="mt-3 flex items-start gap-2">
        <pre className="min-w-0 flex-1 overflow-auto rounded-md bg-surface-2 p-3 font-mono text-[12px] leading-relaxed text-ink">
          <code>{markdown}</code>
        </pre>
        <CopyButton
          value={markdown}
          label="Copy"
          iconOnly
          size="md"
          toastLabel="Badge Markdown copied"
        />
      </div>
    </DossierSection>
  );
}

function SchemaDetails({ entry }: { entry: Entry }) {
  return (
    <DossierSection id="schema" icon={BadgeCheck} title="Schema details">
      <div className="space-y-5">
        <FieldGrid>
          <FieldRow label="Install type" value={entry.installType} />
          <FieldRow
            label="Reading time"
            value={entry.readingTime ? `${entry.readingTime} min` : undefined}
          />
          <FieldRow label="Difficulty score" value={entry.difficultyScore?.toString()} />
          <FieldRow label="Troubleshooting" value={booleanLabel(entry.hasTroubleshooting)} />
          <FieldRow label="Breaking changes" value={booleanLabel(entry.hasBreakingChanges)} />
        </FieldGrid>

        {entry.repoStats && (
          <MetadataGroup title="Source repository stats" icon={Star}>
            <FieldGrid>
              <FieldRow label="Scope" value={entry.repoStats.label ?? "Source repo"} />
              <FieldRow
                label="Stars"
                value={
                  entry.repoStats.stars !== undefined
                    ? `${entry.repoStats.stars.toLocaleString()} source repo stars`
                    : undefined
                }
              />
              <FieldRow
                label="Forks"
                value={
                  entry.repoStats.forks !== undefined
                    ? entry.repoStats.forks.toLocaleString()
                    : undefined
                }
              />
              <FieldRow label="Updated" value={entry.repoStats.updatedAt} />
            </FieldGrid>
          </MetadataGroup>
        )}

        {(entry.downloadUrl || entry.packageVerified !== undefined || entry.downloadSha256) && (
          <MetadataGroup title="Package metadata" icon={Package}>
            <FieldGrid>
              <FieldRow label="Download URL" value={entry.downloadUrl} href={entry.downloadUrl} />
              <FieldRow label="Package verified" value={booleanLabel(entry.packageVerified)} />
              <FieldRow label="SHA-256" value={entry.downloadSha256} mono />
            </FieldGrid>
          </MetadataGroup>
        )}

        {(entry.skillType ||
          entry.skillLevel ||
          entry.verificationStatus ||
          entry.verifiedAt ||
          entry.retrievalSources?.length ||
          entry.testedPlatforms?.length ||
          entry.platformCompatibility?.length) && (
          <MetadataGroup title="Skill and platform metadata" icon={Package}>
            <FieldGrid>
              <FieldRow label="Skill type" value={entry.skillType} />
              <FieldRow label="Skill level" value={entry.skillLevel} />
              <FieldRow label="Verification" value={entry.verificationStatus} />
              <FieldRow label="Verified at" value={entry.verifiedAt} />
            </FieldGrid>
            <PillList label="Retrieval sources" values={entry.retrievalSources} />
            <PillList label="Tested platforms" values={entry.testedPlatforms} />
            {entry.platformCompatibility?.length ? (
              <div className="mt-3 overflow-x-auto rounded-lg border border-border">
                <table className="w-full text-left text-xs">
                  <thead className="bg-surface-2 text-ink-subtle">
                    <tr>
                      <th className="px-3 py-2 font-medium">Platform</th>
                      <th className="px-3 py-2 font-medium">Support</th>
                      <th className="px-3 py-2 font-medium">Install path</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {entry.platformCompatibility.map((item) => (
                      <tr key={`${item.platform}-${item.installPath ?? ""}`}>
                        <td className="px-3 py-2 text-ink">{item.platform}</td>
                        <td className="px-3 py-2 text-ink-muted">
                          {PLATFORM_SUPPORT_LABEL[item.support]}
                        </td>
                        <td className="px-3 py-2 font-mono text-[11px] text-ink-muted">
                          {item.installPath ?? item.adapterPath ?? "—"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : null}
          </MetadataGroup>
        )}

        {(entry.trigger ||
          entry.commandSyntax ||
          entry.argumentHint ||
          entry.allowedTools?.length ||
          entry.scriptLanguage ||
          entry.scriptBody) && (
          <MetadataGroup title="Runtime and command metadata" icon={Terminal}>
            <FieldGrid>
              <FieldRow label="Trigger" value={entry.trigger} />
              <FieldRow label="Command syntax" value={entry.commandSyntax} mono />
              <FieldRow label="Argument hint" value={entry.argumentHint} />
              <FieldRow label="Script language" value={entry.scriptLanguage} />
            </FieldGrid>
            <PillList label="Allowed tools" values={entry.allowedTools} />
            <CodeDisclosure label="Script body" value={entry.scriptBody} />
          </MetadataGroup>
        )}

        {(entry.items?.length ||
          entry.installationOrder?.length ||
          entry.estimatedSetupTime ||
          entry.difficulty) && (
          <MetadataGroup title="Collection metadata" icon={Layers}>
            <FieldGrid>
              <FieldRow
                label="Items"
                value={entry.items?.length ? `${entry.items.length} entries` : undefined}
              />
              <FieldRow label="Estimated setup" value={entry.estimatedSetupTime} />
              <FieldRow label="Difficulty" value={entry.difficulty} />
            </FieldGrid>
            <CollectionItemList values={entry.items} />
            <PillList label="Installation order" values={entry.installationOrder} />
          </MetadataGroup>
        )}

        {(entry.websiteUrl ||
          entry.pricingModel ||
          entry.disclosure ||
          entry.applicationCategory ||
          entry.operatingSystem) && (
          <MetadataGroup title="Tool listing metadata" icon={Globe2}>
            <FieldGrid>
              <FieldRow label="Website" value={entry.websiteUrl} href={entry.websiteUrl} />
              <FieldRow label="Pricing" value={entry.pricingModel} />
              <FieldRow label="Disclosure" value={entry.disclosure} />
              <FieldRow label="Application category" value={entry.applicationCategory} />
              <FieldRow label="Operating system" value={entry.operatingSystem} />
            </FieldGrid>
          </MetadataGroup>
        )}

        <CodeDisclosure label="Full copyable content" value={entry.fullCopy ?? entry.copySnippet} />
      </div>
    </DossierSection>
  );
}

function MetadataGroup({
  title,
  icon: Icon,
  children,
}: {
  title: string;
  icon: React.ElementType;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-lg border border-border bg-surface-2 p-3">
      <div className="mb-3 flex items-center gap-2 text-sm font-medium text-ink">
        <Icon className="h-3.5 w-3.5" aria-hidden />
        {title}
      </div>
      {children}
    </div>
  );
}

function FieldGrid({ children }: { children: React.ReactNode }) {
  return <dl className="grid gap-3 sm:grid-cols-2">{children}</dl>;
}

function FieldRow({
  label,
  value,
  href,
  mono,
}: {
  label: string;
  value?: string;
  href?: string;
  mono?: boolean;
}) {
  if (!value) return null;
  return (
    <div>
      <dt className="text-[10px] uppercase tracking-wider text-ink-subtle">{label}</dt>
      <dd className={cn("mt-0.5 break-words text-sm text-ink", mono && "font-mono text-xs")}>
        {href ? (
          <a href={href} target="_blank" rel="noreferrer" className="hover:underline">
            {value}
          </a>
        ) : (
          value
        )}
      </dd>
    </div>
  );
}

function PillList({ label, values }: { label: string; values?: string[] }) {
  if (!values?.length) return null;
  return (
    <div className="mt-3">
      <div className="mb-1.5 text-[10px] uppercase tracking-wider text-ink-subtle">{label}</div>
      <div className="flex flex-wrap gap-1.5">
        {values.map((value) => (
          <span
            key={value}
            className="inline-flex rounded-md border border-border bg-surface px-2 py-0.5 text-xs text-ink-muted"
          >
            {value}
          </span>
        ))}
      </div>
    </div>
  );
}

function CollectionItemList({ values }: { values?: string[] }) {
  if (!values?.length) return null;
  return (
    <div className="mt-3">
      <div className="mb-1.5 text-[10px] uppercase tracking-wider text-ink-subtle">
        Included entries
      </div>
      <div className="flex flex-wrap gap-1.5">
        {values.map((value) => {
          const [category, slug] = value.split("/");
          if (category && slug) {
            return (
              <Link
                key={value}
                to="/entry/$category/$slug"
                params={{ category, slug }}
                className="inline-flex rounded-md border border-border bg-surface px-2 py-0.5 font-mono text-xs text-ink-muted hover:text-ink"
              >
                {value}
              </Link>
            );
          }
          return (
            <span
              key={value}
              className="inline-flex rounded-md border border-border bg-surface px-2 py-0.5 font-mono text-xs text-ink-muted"
            >
              {value}
            </span>
          );
        })}
      </div>
    </div>
  );
}

function CodeDisclosure({ label, value }: { label: string; value?: string }) {
  if (!value) return null;
  return (
    <details className="mt-3 rounded-lg border border-border bg-background">
      <summary className="cursor-pointer px-3 py-2 text-xs font-medium text-ink">{label}</summary>
      <pre className="max-h-96 overflow-auto border-t border-border p-3 font-mono text-[12px] leading-relaxed text-ink">
        <code>{value}</code>
      </pre>
    </details>
  );
}

function NoteList({ value }: { value: string[] }) {
  return (
    <ul className="space-y-1.5">
      {value.map((item) => (
        <li key={item} className="flex items-start gap-2">
          <ListChecks className="mt-0.5 h-3.5 w-3.5 shrink-0 text-ink-muted" aria-hidden />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

function MarkdownHtml({ html }: { html: string }) {
  return <div dangerouslySetInnerHTML={{ __html: html }} />;
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
