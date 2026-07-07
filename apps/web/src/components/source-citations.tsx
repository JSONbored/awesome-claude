import * as React from "react";
import {
  ExternalLink,
  GitBranch,
  BookOpen,
  Package,
  ShieldCheck,
  User,
  Calendar,
} from "lucide-react";
import { Link } from "@tanstack/react-router";
import type { Entry } from "@/types/registry";
import { hostOf } from "@/lib/source-citations-lib";

type Citation = {
  label: string;
  href?: string;
  hint?: string;
  Icon: React.ElementType;
  verifiedAt?: string;
  contributorSlug?: string;
};

export function SourceCitations({
  entry,
  resolveContributorSlug,
}: {
  entry: Entry;
  resolveContributorSlug?: (name: string, profileUrl?: string) => string | undefined;
}) {
  const cites: Citation[] = [];
  if (entry.sourceUrl) {
    cites.push({
      label: "Source repository",
      href: entry.sourceUrl,
      hint: hostOf(entry.sourceUrl),
      Icon: GitBranch,
      verifiedAt: entry.brandVerifiedAt ?? entry.reviewedAt,
    });
  } else if (entry.repoUrl) {
    cites.push({
      label: "Repository",
      href: entry.repoUrl,
      hint: hostOf(entry.repoUrl),
      Icon: GitBranch,
    });
  }
  if (entry.docsUrl) {
    cites.push({
      label: "Documentation",
      href: entry.docsUrl,
      hint: hostOf(entry.docsUrl),
      Icon: BookOpen,
    });
  }
  if (
    entry.websiteUrl &&
    entry.websiteUrl !== entry.docsUrl &&
    entry.websiteUrl !== entry.sourceUrl
  ) {
    cites.push({
      label: "Website",
      href: entry.websiteUrl,
      hint: hostOf(entry.websiteUrl),
      Icon: ExternalLink,
    });
  }
  if (entry.downloadUrl) {
    cites.push({
      label: entry.downloadSha256 ? "Package (SHA-256 pinned)" : "Package download",
      href: entry.downloadUrl,
      hint: hostOf(entry.downloadUrl),
      Icon: Package,
    });
  }
  if (entry.reviewedBy) {
    cites.push({
      label: `Reviewed by ${entry.reviewedBy}`,
      hint: entry.reviewedAt,
      Icon: ShieldCheck,
    });
  }
  if (entry.submittedBy) {
    const contributorSlug = resolveContributorSlug?.(entry.submittedBy, entry.submittedByUrl);
    cites.push({
      label: `Submitted by ${entry.submittedBy}`,
      href: contributorSlug ? undefined : entry.submittedByUrl,
      hint: entry.submittedAt,
      Icon: User,
      contributorSlug,
    });
  }

  if (cites.length === 0) {
    return (
      <p className="text-sm text-ink-subtle">No external citations recorded for this entry.</p>
    );
  }

  return (
    <div>
      <ul className="divide-y divide-border">
        {cites.map((c) => {
          const Icon = c.Icon;
          const body = (
            <span className="flex items-center gap-3 py-2.5">
              <Icon className="h-3.5 w-3.5 shrink-0 text-ink-muted" aria-hidden />
              <span className="min-w-0 flex-1">
                <span className="block text-sm font-medium text-ink">{c.label}</span>
                {c.hint && (
                  <span className="block font-mono text-[11px] text-ink-subtle">{c.hint}</span>
                )}
              </span>
              {c.verifiedAt && (
                <span className="hidden items-center gap-1 font-mono text-[10px] text-ink-subtle sm:inline-flex">
                  <Calendar className="h-3 w-3" aria-hidden /> {c.verifiedAt}
                </span>
              )}
              {c.href && <ExternalLink className="h-3 w-3 text-ink-subtle" aria-hidden />}
            </span>
          );
          return (
            <li key={c.label}>
              {c.contributorSlug ? (
                <Link
                  to="/contributors/$slug"
                  params={{ slug: c.contributorSlug }}
                  className="block rounded-md px-2 transition-colors duration-200 hover:bg-surface-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60"
                >
                  {body}
                </Link>
              ) : c.href ? (
                <a
                  href={c.href}
                  target="_blank"
                  rel="noreferrer"
                  className="block rounded-md px-2 transition-colors duration-200 hover:bg-surface-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60"
                >
                  {body}
                </a>
              ) : (
                <div className="px-2">{body}</div>
              )}
            </li>
          );
        })}
      </ul>
      <Link
        to="/quality"
        hash="source-provenance"
        className="mt-2 inline-flex text-xs text-ink-muted hover:text-ink"
      >
        Source methodology →
      </Link>
    </div>
  );
}
