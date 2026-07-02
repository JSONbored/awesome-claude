import { Link } from "@tanstack/react-router";
import type { Contributor, Entry } from "@/types/registry";
import {
  authorMatchesSubmitter,
  contributorForDisplayAuthor,
  contributorForSubmitter,
  contributorForVerifiedAuthor,
  findContributorForIdentity,
} from "@/data/contributors";

function ContributorProfileLink({
  contributor,
  label,
  className = "text-ink hover:underline",
}: {
  contributor: Contributor;
  label: string;
  className?: string;
}) {
  return (
    <Link to="/contributors/$slug" params={{ slug: contributor.slug }} className={className}>
      {label}
    </Link>
  );
}

function ExternalSubmitterLink({
  entry,
  className = "text-ink hover:underline",
}: {
  entry: Pick<Entry, "submittedBy" | "submittedByUrl">;
  className?: string;
}) {
  if (!entry.submittedBy) return null;
  const href = entry.submittedByUrl ?? `https://github.com/${entry.submittedBy}`;
  return (
    <a href={href} target="_blank" rel="noreferrer" className={className}>
      {entry.submittedBy}
    </a>
  );
}

function UnverifiedAuthorLabel({
  entry,
  className = "text-ink hover:underline",
}: {
  entry: Pick<Entry, "author" | "authorProfileUrl">;
  className?: string;
}) {
  if (entry.authorProfileUrl) {
    return (
      <a href={entry.authorProfileUrl} target="_blank" rel="noreferrer" className={className}>
        {entry.author}
      </a>
    );
  }

  return <span className={className.replace("hover:underline", "").trim()}>{entry.author}</span>;
}

export function EntryAuthorAttribution({ entry, className }: { entry: Entry; className?: string }) {
  const verifiedAuthor = contributorForVerifiedAuthor(entry.author, entry.submittedBy);
  const submitterContributor = contributorForSubmitter(entry);
  const sameIdentity = authorMatchesSubmitter(entry.author, entry.submittedBy);
  const authorContributor = contributorForDisplayAuthor(entry);

  if (verifiedAuthor) {
    return (
      <span className={className}>
        by <ContributorProfileLink contributor={verifiedAuthor} label={entry.author} />
      </span>
    );
  }

  const authorLabel = authorContributor ? (
    <ContributorProfileLink contributor={authorContributor} label={entry.author} />
  ) : (
    <UnverifiedAuthorLabel entry={entry} />
  );

  if (!entry.submittedBy || sameIdentity) {
    return <span className={className}>by {authorLabel}</span>;
  }

  return (
    <span className={className}>
      by {authorLabel}
      {" · submitted by "}
      {submitterContributor ? (
        <ContributorProfileLink contributor={submitterContributor} label={entry.submittedBy} />
      ) : (
        <ExternalSubmitterLink entry={entry} />
      )}
    </span>
  );
}

export function ProvenanceAuthorAttribution({
  entry,
  className = "text-ink hover:underline",
}: {
  entry: Entry;
  className?: string;
}) {
  const verifiedAuthor = contributorForVerifiedAuthor(entry.author, entry.submittedBy);
  const authorContributor = contributorForDisplayAuthor(entry);

  if (verifiedAuthor) {
    return (
      <ContributorProfileLink
        contributor={verifiedAuthor}
        label={entry.author}
        className={className}
      />
    );
  }

  if (authorContributor) {
    return (
      <ContributorProfileLink
        contributor={authorContributor}
        label={entry.author}
        className={className}
      />
    );
  }

  return <UnverifiedAuthorLabel entry={entry} className={className} />;
}

export function ContributorIdentityLink({
  name,
  profileUrl,
  className = "text-ink hover:underline",
}: {
  name: string;
  profileUrl?: string;
  className?: string;
}) {
  const contributor = findContributorForIdentity(name, profileUrl);
  if (contributor) {
    return <ContributorProfileLink contributor={contributor} label={name} className={className} />;
  }
  if (profileUrl) {
    return (
      <a href={profileUrl} target="_blank" rel="noreferrer" className={className}>
        {name}
      </a>
    );
  }
  return <span className={className.replace("hover:underline", "").trim()}>{name}</span>;
}
