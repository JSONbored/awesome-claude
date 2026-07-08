// Pure normalizer for raw job-listing data, shared by the jobs index and job
// detail routes (previously a byte-for-byte copy in each). Fills defaults and
// coerces field types so the UI always receives a well-formed `JobListing`.

import type { JobListing, JobTier } from "@/types/registry";

export function normalizeJobListing(
  value: Partial<JobListing> & Record<string, unknown>,
): JobListing {
  const postedAt = String(value.postedAt || value.lastVerifiedAt || new Date(0).toISOString());
  return {
    slug: String(value.slug || ""),
    title: String(value.title || "Untitled role"),
    company: String(value.company || "Unknown company"),
    companyUrl: typeof value.companyUrl === "string" ? value.companyUrl : undefined,
    location: String(value.location || "Remote"),
    isRemote: Boolean(value.isRemote),
    isWorldwide: Boolean(value.isWorldwide),
    type: String(value.type || "Role"),
    postedAt,
    lastVerifiedAt: typeof value.lastVerifiedAt === "string" ? value.lastVerifiedAt : undefined,
    compensation: typeof value.compensation === "string" ? value.compensation : undefined,
    equity: typeof value.equity === "string" ? value.equity : undefined,
    bonus: typeof value.bonus === "string" ? value.bonus : undefined,
    description: String(value.description || ""),
    benefits: Array.isArray(value.benefits) ? value.benefits.map(String) : undefined,
    responsibilities: Array.isArray(value.responsibilities)
      ? value.responsibilities.map(String)
      : undefined,
    requirements: Array.isArray(value.requirements) ? value.requirements.map(String) : undefined,
    labels: Array.isArray(value.labels) ? value.labels.map(String) : undefined,
    applyUrl: typeof value.applyUrl === "string" ? value.applyUrl : undefined,
    tier: (value.tier as JobTier) || "free",
    sourceKind: value.sourceKind as JobListing["sourceKind"],
    sourceUrl: typeof value.sourceUrl === "string" ? value.sourceUrl : undefined,
    curationNote: typeof value.curationNote === "string" ? value.curationNote : undefined,
    featured: Boolean(value.featured),
    sponsored: Boolean(value.sponsored),
  };
}
