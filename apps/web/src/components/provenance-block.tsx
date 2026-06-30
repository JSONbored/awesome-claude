import type { Entry } from "@/types/registry";
import {
  ContributorIdentityLink,
  ProvenanceAuthorAttribution,
} from "@/components/contributor-attribution";
import { CLAIM_LABEL } from "@/types/registry";
import { Github, ExternalLink } from "lucide-react";

export function ProvenanceBlock({ entry }: { entry: Entry }) {
  const claim = entry.claimStatus ?? (entry.claimed ? "verified" : "unclaimed");
  return (
    <div className="rounded-xl border border-border bg-surface p-4 text-xs text-ink-muted">
      <div className="eyebrow mb-3">Provenance</div>
      <dl className="grid grid-cols-2 gap-3">
        <Row label="Author" value={<ProvenanceAuthorAttribution entry={entry} />} />
        {entry.submittedBy && (
          <Row
            label="Submitted by"
            value={
              <span className="inline-flex items-center gap-1">
                <Github className="h-3 w-3" aria-hidden />
                <ContributorIdentityLink
                  name={entry.submittedBy}
                  profileUrl={entry.submittedByUrl ?? `https://github.com/${entry.submittedBy}`}
                />
              </span>
            }
          />
        )}
        {entry.reviewedBy && <Row label="Reviewed by" value={entry.reviewedBy} />}
        {entry.reviewedAt && <Row label="Reviewed at" value={entry.reviewedAt} />}
        <Row label="Added" value={entry.dateAdded} />
        <Row label="Claim" value={CLAIM_LABEL[claim]} />
      </dl>
      <div className="mt-3 flex flex-wrap gap-2 border-t border-border pt-3 text-xs">
        {entry.sourceSubmissionUrl && (
          <a
            href={entry.sourceSubmissionUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 text-ink-muted hover:text-ink"
          >
            Original submission <ExternalLink className="h-3 w-3" />
          </a>
        )}
        {entry.importPrUrl && (
          <a
            href={entry.importPrUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 text-ink-muted hover:text-ink"
          >
            Import PR <ExternalLink className="h-3 w-3" />
          </a>
        )}
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div>
      <dt className="text-[10px] uppercase tracking-wider text-ink-subtle">{label}</dt>
      <dd className="mt-0.5 text-sm text-ink">{value}</dd>
    </div>
  );
}
