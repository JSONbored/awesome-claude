import { createApiFileRoute } from "@/lib/api/file-route";

import { publicJobsQuerySchema } from "@/lib/api/contracts";
import { createApiHandler, type InferApiQuery } from "@/lib/api/router";
import { cachedJsonResponse } from "@/lib/http-cache";
import { buildPublicJobsIndex, getJobs, type PublicJobListing } from "@/lib/jobs";

const MAX_OFFSET = 10_000;

function matchesQuery(job: PublicJobListing, query: string) {
  if (!query) return true;
  const haystack = [
    job.title,
    job.company,
    job.location,
    job.description,
    job.type,
    job.compensation,
    job.equity,
    job.bonus,
    job.sourceLabel,
    ...(job.labels ?? []),
    ...(job.benefits ?? []),
    ...(job.responsibilities ?? []),
    ...(job.requirements ?? []),
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
  return haystack.includes(query);
}

function matchesBoolFilter(filter: "all" | "true" | "false" | "", value: boolean) {
  if (!filter || filter === "all") return true;
  return filter === "true" ? value : !value;
}

function jobPostedAtMs(job: PublicJobListing): number | null {
  const candidates = [job.postedAt, job.firstSeenAt];
  for (const candidate of candidates) {
    if (!candidate) continue;
    const parsed = Date.parse(candidate);
    if (Number.isFinite(parsed)) return parsed;
  }
  return null;
}

export const GET = createApiHandler("jobs.list", async ({ request, query: parsedQuery }) => {
  const {
    q: query,
    tier,
    remote,
    location,
    type,
    sourceKind,
    compensation,
    claimedEmployer,
    postedAfter,
    limit,
    offset,
  } = parsedQuery as InferApiQuery<typeof publicJobsQuerySchema>;

  const postedAfterMs = postedAfter ? Date.parse(postedAfter) : NaN;
  const postedAfterCursor = Number.isFinite(postedAfterMs) ? postedAfterMs : null;
  const locationNeedle = (location ?? "").toLowerCase();
  const typeNeedle = (type ?? "").toLowerCase();

  const payload = buildPublicJobsIndex(await getJobs(), new URL(request.url).origin);

  const matched = payload.entries
    .filter((job) => !tier || tier === "all" || job.tier === tier)
    .filter((job) => {
      if (!remote || remote === "all") return true;
      return remote === "true" ? Boolean(job.isRemote) : !job.isRemote;
    })
    .filter((job) => {
      if (!locationNeedle) return true;
      return (job.location ?? "").toLowerCase().includes(locationNeedle);
    })
    .filter((job) => {
      if (!typeNeedle) return true;
      return (job.type ?? "").toLowerCase().includes(typeNeedle);
    })
    .filter((job) => {
      if (!sourceKind || sourceKind === "all") return true;
      return job.sourceKind === sourceKind;
    })
    .filter((job) => matchesBoolFilter(compensation, Boolean(job.compensation)))
    .filter((job) => matchesBoolFilter(claimedEmployer, Boolean(job.claimedEmployer)))
    .filter((job) => {
      if (postedAfterCursor === null) return true;
      const jobMs = jobPostedAtMs(job);
      return jobMs !== null && jobMs >= postedAfterCursor;
    })
    .filter((job) => matchesQuery(job, query));

  const entries = matched.slice(offset, offset + limit);
  const nextCandidate = Math.min(offset + limit, MAX_OFFSET);
  const nextOffset =
    nextCandidate < matched.length && nextCandidate !== offset ? nextCandidate : null;

  return cachedJsonResponse(
    request,
    {
      ...payload,
      query,
      tier: tier || "all",
      remote: remote || "all",
      filters: {
        location,
        type,
        sourceKind: sourceKind || "all",
        compensation: compensation || "all",
        claimedEmployer: claimedEmployer || "all",
        postedAfter: postedAfter || "",
      },
      count: entries.length,
      total: matched.length,
      totalAvailable: payload.entries.length,
      limit,
      offset,
      nextOffset,
      entries,
    },
    {
      headers: {
        "cache-control": "public, max-age=60, stale-while-revalidate=300",
      },
    },
  );
});

export const Route = createApiFileRoute("/api/jobs")({
  server: {
    handlers: {
      GET: async ({ request, params }) => GET(request, { params }),
    },
  },
});
