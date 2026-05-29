import { ENTRIES } from "@/data/entries";
import type { Contributor } from "@/types/registry";

function contributorSlug(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/^@/, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function githubHandle(profileUrl?: string) {
  if (!profileUrl) return undefined;
  try {
    const url = new URL(profileUrl);
    if (url.hostname !== "github.com") return undefined;
    return url.pathname.split("/").filter(Boolean)[0];
  } catch {
    return undefined;
  }
}

export const CONTRIBUTORS: Contributor[] = (() => {
  const grouped = new Map<string, Contributor>();

  for (const entry of ENTRIES) {
    const name = String(entry.submittedBy || entry.author || "JSONbored").trim();
    if (!name) continue;
    const slug = contributorSlug(name);
    if (!slug) continue;
    const profileUrl = entry.submittedByUrl;
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
      } satisfies Contributor);

    existing.acceptedCount += 1;
    existing.github ||= profileUrl;
    grouped.set(slug, existing);
  }

  return [...grouped.values()].sort(
    (left, right) =>
      right.acceptedCount - left.acceptedCount || left.name.localeCompare(right.name),
  );
})();

export function getContributor(slug: string) {
  return CONTRIBUTORS.find((c) => c.slug === slug);
}
