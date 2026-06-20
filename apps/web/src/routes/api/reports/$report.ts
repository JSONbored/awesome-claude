import { createApiFileRoute } from "@/lib/api/file-route";

import { reportExportParamsSchema } from "@/lib/api/contracts";
import { apiError, apiJson, createApiHandler, type InferApiParams } from "@/lib/api/router";
import { ENTRIES, REGISTRY_GENERATED_AT } from "@/data/entries";
import { buildHooksReport } from "@/lib/hooks-stats";
import { buildSkillsReport } from "@/lib/skills-stats";
import { buildAgentsReport } from "@/lib/agents-stats";
import { reportToCsv, reportToJson, type ReportModel } from "@/lib/data-reports";

const AS_OF = String(REGISTRY_GENERATED_AT).slice(0, 10);

// Reports with a `ReportModel` builder are exportable. Keyed by `exportSlug`.
const REPORT_BUILDERS: Record<string, () => ReportModel> = {
  "claude-code-hooks": () => buildHooksReport(ENTRIES, AS_OF),
  "agent-skills": () => buildSkillsReport(ENTRIES, AS_OF),
  "ai-agents": () => buildAgentsReport(ENTRIES, AS_OF),
};

const CACHE_CONTROL = "public, max-age=3600, s-maxage=86400";

export const GET = createApiHandler("reports.export", async ({ params, requestId }) => {
  const { report } = params as InferApiParams<typeof reportExportParamsSchema>;
  // The param schema guarantees "<slug>.<json|csv>".
  const dot = report.lastIndexOf(".");
  const slug = report.slice(0, dot);
  const format = report.slice(dot + 1) as "json" | "csv";

  const build = REPORT_BUILDERS[slug];
  if (!build) {
    return apiError("not_found", 404, { requestId });
  }

  const model = build();

  if (format === "csv") {
    return new Response(reportToCsv(model), {
      headers: {
        "content-type": "text/csv; charset=utf-8",
        "cache-control": CACHE_CONTROL,
        "content-disposition": `inline; filename="${slug}.csv"`,
      },
    });
  }

  return apiJson(reportToJson(model), {
    headers: {
      "cache-control": CACHE_CONTROL,
      "content-disposition": `inline; filename="${slug}.json"`,
    },
  });
});

export const Route = createApiFileRoute("/api/reports/$report")({
  server: {
    handlers: {
      GET: async ({ request, params }) => GET(request, { params }),
    },
  },
});
