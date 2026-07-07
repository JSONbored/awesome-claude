import type { ReactNode } from "react";
import { DossierTOC } from "@/components/dossier-toc";
import { ProvenanceBlock } from "@/components/provenance-block";
import type { Entry } from "@/types/registry";
import type { EntryQuickLink, EntryTocItem } from "@/lib/entry-detail-sidebar-lib";
import { EntryDetailQuickLinks } from "@/components/entry-detail-quick-links";

export function EntryDetailRail({
  entry,
  tocItems,
  quickLinks,
  className,
  children,
}: {
  entry: Entry;
  tocItems: EntryTocItem[];
  quickLinks?: EntryQuickLink[];
  className?: string;
  children?: ReactNode;
}) {
  return (
    <aside className={className ?? "space-y-6"}>
      {children}
      {quickLinks && quickLinks.length > 0 ? (
        <div className="rounded-xl border border-border bg-surface p-4">
          <div className="eyebrow mb-2">Resource links</div>
          <EntryDetailQuickLinks links={quickLinks} className="mt-0" />
        </div>
      ) : null}
      <div className="hidden lg:block lg:sticky lg:top-20">
        <DossierTOC items={tocItems} />
      </div>
      <ProvenanceBlock entry={entry} />
      <div className="rounded-xl border border-border bg-surface p-4 text-xs text-ink-muted">
        HeyClaude reviews metadata, provenance, and surface-level safety. We don't scan for malware.
        Always read the source before installing tools that touch your filesystem, network, or
        credentials.
      </div>
    </aside>
  );
}
