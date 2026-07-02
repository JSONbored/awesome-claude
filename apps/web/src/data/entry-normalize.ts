import { authorMatchesSubmitter } from "@/lib/contributor-identity";
import { buildEntryFromRegistry, type RegistryEntry } from "@/lib/entry-normalize-lib";

export type { RegistryEntry } from "@/lib/entry-normalize-lib";

export function buildEntry(entry: RegistryEntry) {
  const authorProfileUrl = entry.authorProfileUrl;
  const author = entry.author ?? entry.submittedBy ?? entry.brandName ?? "Unknown";
  const submittedByUrl =
    entry.submittedByUrl ??
    (authorMatchesSubmitter(author, entry.submittedBy) ? authorProfileUrl : undefined);

  return buildEntryFromRegistry(entry, {
    author,
    authorProfileUrl,
    submittedByUrl,
  });
}
