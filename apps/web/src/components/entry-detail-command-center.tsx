import {
  ArrowUpRight,
  BookOpen,
  ExternalLink,
  GitBranch,
  Code2,
  AlertTriangle,
  OctagonX,
  FileText,
  GitCompare,
  Terminal,
  Database,
  Globe,
  ScrollText,
} from "lucide-react";
import { Link } from "@tanstack/react-router";
import type { Entry, Harness } from "@/types/registry";
import { CopyButton } from "@/components/copy-button";
import { HarnessVariantPicker } from "@/components/harness-variant-picker";
import type { VariantOption } from "@/components/copy-segmented";
import type { CopyVariant } from "@/lib/dossier-prefs";
import {
  ENTRY_COMMAND_CENTER_ID,
  detailSafetyGateMessage,
  entryDetailSuggestChangeUrl,
  resolveDetailCommunityAnchors,
  resolveDetailQuickLinks,
  resolveDetailReadinessItems,
  shouldElevateDetailSafetyGate,
} from "@/lib/entry-detail-command-center";
import {
  entryDetailCompareCtaState,
  ENTRY_DETAIL_COMPARE_MAX,
} from "@/lib/entry-detail-compare-ui";
import {
  entryDetailCopyAnalyticsData,
  entryDetailCopyAnalyticsEvent,
  entryDetailCopyIntentType,
  entryDetailIntegrationAnalyticsData,
  entryDetailIntegrationAnalyticsEvent,
  entryDetailSourceAnalyticsData,
  entryDetailSourceAnalyticsEvent,
  entryDetailDocsAnalyticsData,
  entryDetailDocsAnalyticsEvent,
  entryDetailSuggestChangeAnalyticsData,
  entryDetailSuggestChangeAnalyticsEvent,
} from "@/lib/entry-detail-cta-events";
import {
  detailIntegrationLinkIcon,
  resolveDetailIntegrationLinks,
  type DetailIntegrationLinkIcon,
} from "@/lib/entry-detail-integration-links";
import { recordIntentEvent } from "@/lib/intent-event-client";
import { trackEvent, outboundHost } from "@/lib/analytics";
import { claimCtaAnalyticsData, claimCtaAnalyticsEvent } from "@/lib/conversion-cta-events";
import { INSTALL_RISK_LABEL } from "@/lib/trust";
import type { InstallRisk } from "@/lib/trust-lib";
import { siteConfig } from "@/lib/site";
import { absoluteUrl } from "@/lib/seo";
import { cn } from "@/lib/utils";

type EntryDetailCommandCenterProps = {
  entry: Entry;
  risk: InstallRisk;
  harnessAvailable: Harness[];
  harness: Harness | null;
  onHarnessChange: (value: Harness) => void;
  liveVariants: VariantOption[];
  tab: CopyVariant;
  onTabChange: (value: CopyVariant) => void;
  tabPayload?: string;
  relatedCount: number;
  guideCount: number;
  compareCta: {
    inCompare: boolean;
    compareCount: number;
    compareIds: string;
    onToggle: () => void;
    onOpenCompare: () => void;
    onOpenFullCompare: () => void;
  };
};

function ReadinessRow({ label, value, ok }: { label: string; value: string; ok: boolean }) {
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

function IntegrationLinkIcon({ icon }: { icon: DetailIntegrationLinkIcon }) {
  const className = "h-3.5 w-3.5";
  switch (icon) {
    case "code":
      return <Code2 className={className} />;
    case "manifest":
      return <ScrollText className={className} />;
    case "feed":
      return <Database className={className} />;
    case "ecosystem":
      return <Globe className={className} />;
    case "raycast":
      return <ExternalLink className={className} />;
    case "terminal":
    default:
      return <Terminal className={className} />;
  }
}

export function EntryDetailCommandCenter({
  entry,
  risk,
  harnessAvailable,
  harness,
  onHarnessChange,
  liveVariants,
  tab,
  onTabChange,
  tabPayload,
  relatedCount,
  guideCount,
  compareCta,
}: EntryDetailCommandCenterProps) {
  const readiness = resolveDetailReadinessItems(entry);
  const quickLinks = resolveDetailQuickLinks(entry);
  const integrationLinks = resolveDetailIntegrationLinks(entry);
  const communityAnchors = resolveDetailCommunityAnchors(relatedCount, guideCount, true);
  const compareState = entryDetailCompareCtaState(
    compareCta.inCompare,
    compareCta.compareCount,
    compareCta.compareIds,
  );
  const safetyGate = detailSafetyGateMessage(risk, entry);
  const elevateSafety = shouldElevateDetailSafetyGate(risk, entry);
  const suggestUrl = entryDetailSuggestChangeUrl(
    entry,
    absoluteUrl(`/entry/${entry.category}/${entry.slug}`),
    siteConfig.githubUrl,
  );

  return (
    <aside
      id={ENTRY_COMMAND_CENTER_ID}
      className="min-w-0 scroll-mt-24 lg:sticky lg:top-20 lg:self-start"
    >
      <div className="overflow-hidden rounded-xl border border-border bg-surface">
        <div className="flex items-center justify-between border-b border-border px-4 py-2.5">
          <div className="eyebrow">Command center</div>
          {entry.sourceUrl && (
            <a
              href={entry.sourceUrl}
              target="_blank"
              rel="noreferrer"
              onClick={() => {
                trackEvent(
                  entryDetailSourceAnalyticsEvent(),
                  entryDetailSourceAnalyticsData(
                    entry.category,
                    entry.slug,
                    outboundHost(entry.sourceUrl!),
                  ),
                );
                void recordIntentEvent("open", entry);
              }}
              className="inline-flex items-center gap-1 text-xs text-ink-muted hover:text-ink"
            >
              Source <ArrowUpRight className="h-3 w-3" />
            </a>
          )}
        </div>

        {elevateSafety && safetyGate && (
          <div
            className={cn(
              "flex items-start gap-2 border-b border-border px-4 py-3 text-xs",
              risk === "high"
                ? "bg-trust-blocked/5 text-trust-blocked"
                : "bg-trust-review/5 text-trust-review",
            )}
          >
            {risk === "high" ? (
              <OctagonX className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden />
            ) : (
              <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden />
            )}
            <div className="min-w-0">
              <div className="font-semibold text-ink">
                {risk !== "low" ? INSTALL_RISK_LABEL[risk] : "Review before installing"}
              </div>
              <p className="mt-0.5 text-ink-muted">{safetyGate}</p>
              {(entry.safetyNotes || entry.privacyNotes) && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {entry.safetyNotes && (
                    <a
                      href="#safety"
                      className="font-medium text-ink underline-offset-2 hover:underline"
                    >
                      Safety notes
                    </a>
                  )}
                  {entry.privacyNotes && (
                    <a
                      href="#privacy"
                      className="font-medium text-ink underline-offset-2 hover:underline"
                    >
                      Privacy notes
                    </a>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        <div className="border-b border-border px-4 py-3">
          <div className="eyebrow mb-2">Install & copy</div>
          {harnessAvailable.length >= 2 && (
            <div className="mb-3">
              <div className="mb-1.5 text-[10px] uppercase tracking-wider text-ink-subtle">
                Harness variant
              </div>
              <HarnessVariantPicker
                available={harnessAvailable}
                value={harness}
                onChange={onHarnessChange}
              />
            </div>
          )}
          <div className="flex gap-1">
            {(["install", "config", "full"] as const).map((t) => {
              const payload = liveVariants.find((v) => v.id === t)?.value;
              if (!payload) return null;
              return (
                <button
                  key={t}
                  type="button"
                  onClick={() => onTabChange(t)}
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
          <div className="rounded-b-md bg-background p-3">
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
                    event={entryDetailCopyAnalyticsEvent(tab)}
                    eventData={entryDetailCopyAnalyticsData(entry.category, entry.slug)}
                    onCopied={() => {
                      void recordIntentEvent(entryDetailCopyIntentType(tab), entry);
                    }}
                  />
                </div>
              </>
            ) : (
              <div className="rounded-md bg-surface-2 p-4 text-xs text-ink-muted">
                No installable payload for this tab.
              </div>
            )}
          </div>
        </div>

        <div className="border-b border-border px-4 py-3">
          <div className="eyebrow mb-2">Trust & readiness</div>
          <ul className="space-y-1.5 text-xs">
            {readiness.map((item) => (
              <ReadinessRow key={item.id} label={item.label} value={item.value} ok={item.ok} />
            ))}
          </ul>
        </div>

        {communityAnchors.length > 0 && (
          <div className="border-b border-border px-4 py-3">
            <div className="eyebrow mb-2">Community context</div>
            <ul className="space-y-1.5 text-xs">
              {communityAnchors.map((anchor) => (
                <li key={anchor.id}>
                  <a
                    href={`#${anchor.targetId}`}
                    className="inline-flex items-center gap-1.5 text-ink-muted hover:text-ink"
                  >
                    {anchor.label}
                    {typeof anchor.count === "number" && (
                      <span className="font-mono text-[10px] text-ink-subtle">
                        ({anchor.count})
                      </span>
                    )}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="border-b border-border px-4 py-3">
          <div className="eyebrow mb-2">Compare</div>
          <div className="flex flex-col gap-1.5 text-xs">
            <button
              type="button"
              onClick={compareCta.onToggle}
              disabled={compareState.disabled}
              className={cn(
                "inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1.5 font-medium",
                compareState.disabled
                  ? "cursor-not-allowed border-border bg-surface text-ink-subtle"
                  : compareCta.inCompare
                    ? "border-accent bg-accent/10 text-ink hover:bg-accent/15"
                    : "border-border bg-background text-ink hover:bg-surface-2",
              )}
            >
              <GitCompare className="h-3.5 w-3.5" />
              {compareState.label}
              <span className="font-mono text-[10px] text-ink-subtle">
                {compareCta.compareCount}/{ENTRY_DETAIL_COMPARE_MAX}
              </span>
            </button>
            {compareState.hint ? (
              <p className="text-[11px] text-ink-muted">{compareState.hint}</p>
            ) : null}
            {compareState.showOpenCompare ? (
              <button
                type="button"
                onClick={compareCta.onOpenCompare}
                className="inline-flex items-center gap-1.5 text-ink-muted hover:text-ink"
              >
                Open compare tray
              </button>
            ) : null}
            {compareState.showOpenFullCompare && compareState.compareSearch ? (
              <Link
                to="/compare"
                search={compareState.compareSearch}
                onClick={compareCta.onOpenFullCompare}
                className="inline-flex items-center gap-1.5 text-ink-muted hover:text-ink"
              >
                Open full compare
              </Link>
            ) : null}
          </div>
        </div>

        <div className="border-b border-border px-4 py-3">
          <div className="eyebrow mb-2">Integrations & API</div>
          <ul className="space-y-1.5 text-xs">
            {integrationLinks.map((link) => (
              <li key={link.id}>
                <a
                  href={link.href}
                  target={link.external ? "_blank" : undefined}
                  rel={link.external ? "noreferrer" : undefined}
                  onClick={() => {
                    trackEvent(
                      entryDetailIntegrationAnalyticsEvent(link.id),
                      entryDetailIntegrationAnalyticsData(entry.category, entry.slug, link.id),
                    );
                    void recordIntentEvent("open", entry);
                  }}
                  className="inline-flex items-center gap-1.5 text-ink-muted hover:text-ink"
                >
                  <IntegrationLinkIcon icon={detailIntegrationLinkIcon(link.id)} />
                  {link.label}
                  {link.external ? <ExternalLink className="h-3 w-3" /> : null}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div className="px-4 py-3">
          <div className="eyebrow mb-2">Contribute</div>
          <div className="flex flex-col gap-1.5 text-xs">
            <a
              href={suggestUrl}
              target="_blank"
              rel="noreferrer"
              onClick={() => {
                trackEvent(
                  entryDetailSuggestChangeAnalyticsEvent(),
                  entryDetailSuggestChangeAnalyticsData(entry.category, entry.slug),
                );
                void recordIntentEvent("open", entry);
              }}
              className="inline-flex items-center gap-1.5 text-ink-muted hover:text-ink"
            >
              <FileText className="h-3.5 w-3.5" /> Suggest a metadata change{" "}
              <ExternalLink className="h-3 w-3" />
            </a>
            {!entry.claimed && (
              <Link
                to="/claim"
                className="inline-flex items-center gap-1.5 text-ink-muted hover:text-ink"
                onClick={() =>
                  trackEvent(
                    claimCtaAnalyticsEvent(),
                    claimCtaAnalyticsData("detail-command-center", entry.category, entry.slug),
                  )
                }
              >
                Claim this listing
              </Link>
            )}
          </div>
        </div>
      </div>

      <div className="mt-3 flex flex-col gap-1.5 text-xs">
        {quickLinks.map((link) => {
          if (link.id === "docs") {
            return (
              <a
                key={link.id}
                href={link.href}
                target="_blank"
                rel="noreferrer"
                onClick={() => {
                  trackEvent(
                    entryDetailDocsAnalyticsEvent(),
                    entryDetailDocsAnalyticsData(
                      entry.category,
                      entry.slug,
                      outboundHost(link.href),
                    ),
                  );
                  void recordIntentEvent("open", entry);
                }}
                className="inline-flex items-center gap-1.5 text-ink-muted hover:text-ink"
              >
                <BookOpen className="h-3.5 w-3.5" /> {link.label}{" "}
                <ExternalLink className="h-3 w-3" />
              </a>
            );
          }
          if (link.id === "source") {
            return (
              <a
                key={link.id}
                href={link.href}
                target="_blank"
                rel="noreferrer"
                onClick={() => {
                  trackEvent(
                    entryDetailSourceAnalyticsEvent(),
                    entryDetailSourceAnalyticsData(
                      entry.category,
                      entry.slug,
                      outboundHost(link.href),
                    ),
                  );
                  void recordIntentEvent("open", entry);
                }}
                className="inline-flex items-center gap-1.5 text-ink-muted hover:text-ink"
              >
                <GitBranch className="h-3.5 w-3.5" /> {link.label}{" "}
                <ExternalLink className="h-3 w-3" />
              </a>
            );
          }
          if (link.id === "browse") {
            return (
              <Link
                key={link.id}
                to={link.href}
                search={{ category: entry.category }}
                className="inline-flex items-center gap-1.5 text-ink-muted hover:text-ink"
              >
                <Code2 className="h-3.5 w-3.5" /> {link.label}
              </Link>
            );
          }
          return null;
        })}
      </div>
    </aside>
  );
}
