import type { DirectoryEntry } from "@/lib/content.server";
import { contributorSlug } from "@/lib/contributor-identity-lib";

export type ContributorSummary = {
  slug: string;
  name: string;
  profileUrl?: string;
  entryCount: number;
  entries: DirectoryEntry[];
};

export function groupContributorSummaries(entries: DirectoryEntry[]): ContributorSummary[] {
  const grouped = new Map<string, ContributorSummary>();

  for (const entry of entries) {
    const name = String(entry.submittedBy || entry.author || "JSONbored").trim();
    if (!name) continue;
    const slug = contributorSlug(name);
    if (!slug) continue;
    const profileUrl = entry.submittedByUrl || entry.authorProfileUrl;
    const existing = grouped.get(slug) ?? {
      slug,
      name,
      profileUrl,
      entryCount: 0,
      entries: [],
    };
    existing.entries.push(entry);
    existing.entryCount = existing.entries.length;
    existing.profileUrl ||= profileUrl;
    grouped.set(slug, existing);
  }

  return [...grouped.values()].sort(
    (left, right) => right.entryCount - left.entryCount || left.name.localeCompare(right.name),
  );
}
