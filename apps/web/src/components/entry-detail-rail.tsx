import type { ReactNode } from "react";
import { DossierTOC } from "@/components/dossier-toc";
import { ProvenanceBlock } from "@/components/provenance-block";
import type { Entry } from "@/types/registry";
import type { EntryTocItem } from "@/lib/entry-detail-sidebar-lib";

export function EntryDetailRail({
  entry,
  tocItems,
  className,
  children,
}: {
  entry: Entry;
  tocItems: EntryTocItem[];
  className?: string;
  children?: ReactNode;
}) {
  return (
    <aside className={className ?? "space-y-6"}>
      {children}
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
