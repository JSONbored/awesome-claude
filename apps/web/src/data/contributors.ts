import { ENTRIES } from "@/data/entries";
import { authorMatchesSubmitter, contributorSlug } from "@/lib/contributor-identity";
import type { Category, Contributor, Entry } from "@/types/registry";

export { authorMatchesSubmitter, contributorSlug };

export function githubHandle(profileUrl?: string) {
  if (!profileUrl) return undefined;
  try {
    const url = new URL(profileUrl);
    if (url.hostname !== "github.com") return undefined;
    return url.pathname.split("/").filter(Boolean)[0];
  } catch {
    return undefined;
  }
}

function identitySlugs(name?: string, profileUrl?: string) {
  const slugs = new Set<string>();
  const add = (value?: string) => {
    if (!value) return;
    const slug = contributorSlug(value);
    if (slug) slugs.add(slug);
  };

  add(name);
  add(githubHandle(profileUrl));
  return slugs;
}

export function contributorMatchesIdentity(
  contributor: Contributor,
  name?: string,
  profileUrl?: string,
) {
  const contributorSlugs = identitySlugs(contributor.name, contributor.github);
  contributorSlugs.add(contributor.slug);
  contributorSlugs.add(contributorSlug(contributor.handle));

  const candidateSlugs = identitySlugs(name, profileUrl);
  return [...candidateSlugs].some((slug) => contributorSlugs.has(slug));
}

export type ContributorAcceptedEntryRole = "submitted" | "authored" | "submitted-authored";

export function contributorAcceptedEntryRole(
  contributor: Contributor,
  entry: Entry,
): ContributorAcceptedEntryRole | undefined {
  const submitted = contributorMatchesIdentity(
    contributor,
    entry.submittedBy,
    entry.submittedByUrl,
  );
  const authored = contributorMatchesIdentity(contributor, entry.author);

  if (submitted && authored) return "submitted-authored";
  if (submitted) return "submitted";
  if (authored) return "authored";
  return undefined;
}

export function contributorReviewedEntry(contributor: Contributor, entry: Entry) {
  return contributorMatchesIdentity(contributor, entry.reviewedBy);
}

type MutableContributor = Contributor & {
  reviewedCount: number;
  sourceSubmissionCount: number;
  categoryCounts: Map<Category, number>;
};

function incrementCategory(contributor: MutableContributor, category: Category) {
  contributor.categoryCounts.set(category, (contributor.categoryCounts.get(category) ?? 0) + 1);
}

function upsertContributor(
  grouped: Map<string, MutableContributor>,
  name: string,
  profileUrl: string | undefined,
  entry: Entry,
  options: { creditSourceSubmission?: boolean } = {},
) {
  const slug = contributorSlug(name);
  if (!slug) return;
  const handle = githubHandle(profileUrl) || name.replace(/^@/, "");
  const existing =
    grouped.get(slug) ??
    ({
      slug,
      handle,
      name,
      github: profileUrl,
      bio: "Contributor credited on accepted HeyClaude registry entries.",
      acceptedCount: 0,
      reviewedCount: 0,
      sourceSubmissionCount: 0,
      categories: [],
      categoryCounts: new Map<Category, number>(),
    } satisfies MutableContributor);

  existing.acceptedCount += 1;
  if (options.creditSourceSubmission && (entry.sourceSubmissionUrl || entry.importPrUrl)) {
    existing.sourceSubmissionCount += 1;
  }
  incrementCategory(existing, entry.category);
  existing.github ||= profileUrl;
  grouped.set(slug, existing);
}

export const CONTRIBUTORS: Contributor[] = (() => {
  const grouped = new Map<string, MutableContributor>();

  for (const entry of ENTRIES) {
    const submitter = String(entry.submittedBy || entry.author || "JSONbored").trim();
    upsertContributor(grouped, submitter, entry.submittedByUrl, entry, {
      creditSourceSubmission: true,
    });

    const author = String(entry.author || "").trim();
    if (shouldRegisterDistinctAuthorProfile(entry, submitter)) {
      upsertContributor(grouped, author, entry.authorProfileUrl, entry);
    }
  }

  for (const entry of ENTRIES) {
    for (const contributor of grouped.values()) {
      if (contributorReviewedEntry(contributor, entry)) {
        contributor.reviewedCount += 1;
      }
    }
  }

  return [...grouped.values()]
    .map(({ categoryCounts, ...contributor }) => ({
      ...contributor,
      categories: [...categoryCounts.entries()]
        .map(([category, count]) => ({ category, count }))
        .sort(
          (left, right) => right.count - left.count || left.category.localeCompare(right.category),
        ),
    }))
    .sort(
      (left, right) =>
        right.acceptedCount - left.acceptedCount || left.name.localeCompare(right.name),
    );
})();

export function getContributor(slug: string) {
  return CONTRIBUTORS.find((c) => c.slug === slug);
}

export function findContributorForIdentity(name?: string, profileUrl?: string) {
  if (!name) return undefined;
  return CONTRIBUTORS.find((contributor) =>
    contributorMatchesIdentity(contributor, name, profileUrl),
  );
}

export function contributorForVerifiedAuthor(author?: string, submittedBy?: string) {
  if (!author || !submittedBy) return undefined;

  const authorSlug = contributorSlug(author);
  const submittedBySlug = contributorSlug(submittedBy);
  if (!authorSlug || authorSlug !== submittedBySlug) return undefined;

  return getContributor(submittedBySlug);
}

export function contributorForSubmitter(entry: Pick<Entry, "submittedBy" | "submittedByUrl">) {
  if (!entry.submittedBy) return undefined;
  return findContributorForIdentity(entry.submittedBy, entry.submittedByUrl);
}

export function shouldRegisterDistinctAuthorProfile(
  entry: Pick<Entry, "author" | "submittedBy" | "authorProfileUrl">,
  submitter: string,
) {
  const author = String(entry.author || "").trim();
  const authorSlug = contributorSlug(author);
  if (!authorSlug || authorSlug === contributorSlug(submitter)) return false;
  if (!entry.authorProfileUrl) return false;
  if (
    entry.submittedBy &&
    !authorMatchesSubmitter(entry.author, entry.submittedBy) &&
    githubHandle(entry.authorProfileUrl) === authorSlug
  ) {
    return false;
  }
  return true;
}

export function contributorForDisplayAuthor(
  entry: Pick<Entry, "author" | "submittedBy" | "authorProfileUrl">,
) {
  const verifiedAuthor = contributorForVerifiedAuthor(entry.author, entry.submittedBy);
  if (verifiedAuthor) return verifiedAuthor;
  if (!entry.submittedBy || authorMatchesSubmitter(entry.author, entry.submittedBy)) {
    return findContributorForIdentity(entry.author, entry.authorProfileUrl);
  }

  const submitter = String(entry.submittedBy).trim();
  if (!shouldRegisterDistinctAuthorProfile(entry, submitter)) {
    return undefined;
  }

  return findContributorForIdentity(entry.author, entry.authorProfileUrl);
}
