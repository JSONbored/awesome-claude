// Pure resolution of the canonical website URL used when claiming an entry,
// split out of the claim route so the candidate/proof precedence can be
// unit-tested. Only https URLs are accepted; a `owner/repo` (or GitHub URL)
// proof is normalized to a canonical github.com URL.

import type { Entry } from "@/types/registry";

export function resolveClaimWebsiteUrl(entry: Entry, proof: Record<string, string>): string {
  const candidates = [entry.sourceUrl, entry.repoUrl, entry.docsUrl, entry.websiteUrl];
  for (const url of candidates) {
    const trimmed = (url ?? "").trim();
    if (/^https:\/\//i.test(trimmed)) return trimmed;
  }
  const repo = (proof.repo ?? "").trim();
  if (repo) {
    const normalized = repo
      .replace(/^https?:\/\/github\.com\//i, "")
      .replace(/^github\.com\//i, "")
      .replace(/^\//, "")
      .replace(/[?#].*$/, "");
    if (/^[\w.-]+\/[\w.-]+$/.test(normalized)) {
      return `https://github.com/${normalized}`;
    }
  }
  const link = (proof.link ?? "").trim();
  if (/^https:\/\//i.test(link)) return link;
  return "";
}
