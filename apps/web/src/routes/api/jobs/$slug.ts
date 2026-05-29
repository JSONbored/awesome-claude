import { createApiFileRoute } from "@/lib/api/file-route";

import { publicJobParamsSchema } from "@/lib/api/contracts";
import { apiError, createApiHandler, type InferApiParams } from "@/lib/api/router";
import { cachedJsonResponse } from "@/lib/http-cache";
import { buildPublicJobsIndex, getJobs, toPublicJobListing } from "@/lib/jobs";

export const GET = createApiHandler("jobs.detail", async ({ request, params, requestId }) => {
  const { slug } = params as InferApiParams<typeof publicJobParamsSchema>;
  const jobs = await getJobs();
  const job = jobs.find((item) => item.slug === slug) ?? null;

  if (!job) {
    return apiError("job_not_found", 404, { requestId });
  }

  const siteUrl = new URL(request.url).origin;
  const related = buildPublicJobsIndex(
    jobs.filter((item) => item.slug !== slug),
    siteUrl,
  ).entries.slice(0, 4);
  const entry = toPublicJobListing(job, siteUrl);
  const generatedAt =
    entry.lastVerifiedAt || entry.sourceCheckedAt || entry.lastCheckedAt || entry.postedAt || "";

  return cachedJsonResponse(
    request,
    {
      schemaVersion: 1,
      kind: "jobs-detail",
      slug,
      generatedAt,
      entry,
      related,
    },
    {
      headers: {
        "cache-control": "public, max-age=60, stale-while-revalidate=300",
      },
    },
  );
});

export const Route = createApiFileRoute("/api/jobs/$slug")({
  server: {
    handlers: {
      GET: async ({ request, params }) => GET(request, { params }),
    },
  },
});
