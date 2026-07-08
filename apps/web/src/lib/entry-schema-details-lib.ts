// Pure predicate for whether an entry carries any of the optional, category-
// specific schema fields worth rendering a "details" section for. Split out of
// the entry route so the check can be unit-tested without the page.

import type { Entry } from "@/types/registry";

export function hasSchemaDetails(entry: Entry): boolean {
  return Boolean(
    entry.skillType ||
    entry.skillLevel ||
    entry.verificationStatus ||
    entry.verifiedAt ||
    entry.retrievalSources?.length ||
    entry.testedPlatforms?.length ||
    entry.platformCompatibility?.length ||
    entry.trigger ||
    entry.commandSyntax ||
    entry.argumentHint ||
    entry.allowedTools?.length ||
    entry.scriptLanguage ||
    entry.scriptBody ||
    entry.items?.length ||
    entry.installationOrder?.length ||
    entry.estimatedSetupTime ||
    entry.difficulty ||
    entry.websiteUrl ||
    entry.pricingModel ||
    entry.disclosure ||
    entry.applicationCategory ||
    entry.operatingSystem ||
    entry.repoStats ||
    entry.downloadUrl ||
    entry.packageVerified !== undefined ||
    entry.downloadSha256 ||
    entry.copySnippet ||
    entry.fullCopy,
  );
}
