import { ENTRIES } from "@/data/entries";
import type { CommercialTool, Disclosure, PricingModel } from "@/types/registry";

function pricingModelFor(entry: (typeof ENTRIES)[number]): PricingModel {
  if (entry.repoUrl || isGithubUrl(entry.sourceUrl)) return "open-source";
  return "freemium";
}

function isGithubUrl(value: string | undefined) {
  if (!value) return false;
  try {
    const hostname = new URL(value).hostname.toLowerCase();
    return hostname === "github.com" || hostname.endsWith(".github.com");
  } catch {
    return false;
  }
}

function disclosureFor(entry: (typeof ENTRIES)[number]): Disclosure {
  if (entry.claimed || entry.claimStatus === "verified") return "claimed";
  if (entry.trust === "trusted") return "heyclaude_pick";
  return "editorial";
}

function toolWebsite(entry: (typeof ENTRIES)[number]) {
  return entry.docsUrl || entry.sourceUrl || entry.repoUrl || `/entry/tools/${entry.slug}`;
}

export const COMMERCIAL_TOOLS: CommercialTool[] = ENTRIES.filter(
  (entry) => entry.category === "tools",
).map((entry) => ({
  slug: entry.slug,
  name: entry.title,
  tagline: entry.cardDescription || entry.description,
  description: entry.description,
  websiteUrl: toolWebsite(entry),
  brandDomain: entry.brandDomain,
  brandIconUrl: entry.brandIconUrl,
  pricingModel: pricingModelFor(entry),
  disclosure: disclosureFor(entry),
  category: entry.tags[0] || "Claude tool",
  tags: entry.tags,
  operatingSystem: entry.platforms,
  dateAdded: entry.dateAdded,
  featured: entry.trust === "trusted" || entry.source === "first-party",
}));

export function getCommercialTool(slug: string) {
  return COMMERCIAL_TOOLS.find((t) => t.slug === slug);
}
