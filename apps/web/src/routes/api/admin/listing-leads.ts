import { createApiFileRoute } from "@/lib/api/file-route";

import { nextLeadStatus, normalizeCommercialStatus } from "@heyclaude/registry/commercial";

import {
  adminListingLeadsPatchBodySchema,
  adminListingLeadsQuerySchema,
} from "@/lib/api/contracts";
import {
  apiError,
  apiJson,
  createApiHandler,
  type InferApiBody,
  type InferApiQuery,
} from "@/lib/api/router";
import { isLeadsAdminAuthorized } from "@/lib/admin-auth";
import { logApiError, logApiInfo, logApiWarn } from "@/lib/api-logs";
import { leadsToCsv, normalizeKind } from "@/lib/listing-leads-csv-lib";
import { getSiteDb } from "@/lib/db";

const MAX_LIMIT = 100;

export const GET = createApiHandler(
  "adminListingLeads.list",
  async ({ request, query: parsedQuery, requestId }) => {
    if (!isLeadsAdminAuthorized(request)) {
      logApiWarn(request, "admin.listing_leads.unauthorized");
      return apiError("unauthorized", 401, { requestId });
    }

    const db = getSiteDb();
    if (!db) {
      logApiError(request, "admin.listing_leads.db_not_configured");
      return apiError("site_db_not_configured", 503, { requestId });
    }

    const query = parsedQuery as InferApiQuery<typeof adminListingLeadsQuerySchema>;
    const kind = normalizeKind(query.kind);
    const status = normalizeCommercialStatus(query.status);
    const limit = Math.max(1, Math.min(MAX_LIMIT, Math.trunc(query.limit)));
    const format = query.format;

    const where = [];
    const values: unknown[] = [];
    if (kind) {
      where.push("kind = ?");
      values.push(kind);
    }
    if (query.status) {
      where.push("status = ?");
      values.push(status);
    }

    const whereSql = where.length ? `WHERE ${where.join(" AND ")}` : "";
    const { results } = await db
      .prepare(
        `SELECT
        id,
        kind,
        status,
        tier_interest,
        contact_name,
        contact_email,
        company_name,
        listing_title,
        website_url,
        apply_url,
        message,
        created_at,
        updated_at
      FROM listing_leads
      ${whereSql}
      ORDER BY created_at DESC
      LIMIT ?`,
      )
      .bind(...values, limit)
      .all();

    if (format === "csv") {
      return new Response(`${leadsToCsv(results as Record<string, unknown>[])}\n`, {
        headers: {
          "cache-control": "no-store",
          "content-disposition": 'attachment; filename="heyclaude-listing-leads.csv"',
          "content-type": "text/csv; charset=utf-8",
        },
      });
    }

    return apiJson(
      {
        schemaVersion: 1,
        count: results.length,
        entries: results,
      },
      { headers: { "cache-control": "no-store" } },
    );
  },
);

export const PATCH = createApiHandler(
  "adminListingLeads.update",
  async ({ request, body, requestId }) => {
    if (!isLeadsAdminAuthorized(request)) {
      logApiWarn(request, "admin.listing_leads.unauthorized");
      return apiError("unauthorized", 401, { requestId });
    }

    const db = getSiteDb();
    if (!db) {
      logApiError(request, "admin.listing_leads.db_not_configured");
      return apiError("site_db_not_configured", 503, { requestId });
    }

    const payload = body as InferApiBody<typeof adminListingLeadsPatchBodySchema>;
    const id = payload.id;
    const action = payload.action;
    if (!Number.isInteger(id) || id <= 0 || !action) {
      logApiWarn(request, "admin.listing_leads.invalid_payload");
      return apiError("invalid_payload", 400, { requestId });
    }

    const current = await db
      .prepare("SELECT id, status FROM listing_leads WHERE id = ?")
      .bind(id)
      .first<{ id: number; status: string }>();
    if (!current) {
      return apiError("not_found", 404, { requestId });
    }

    const nextStatus = nextLeadStatus(current.status, action);
    if (nextStatus === current.status) {
      return apiError("invalid_transition", 400, { requestId });
    }

    // Compare-and-swap on the status we read: the UPDATE only matches if the
    // row's status hasn't changed since the SELECT above. If another concurrent
    // request already transitioned it, no row matches (meta.changes === 0) and
    // we return 409 instead of silently reporting success for a write that a
    // lost-update race dropped.
    const update = await db
      .prepare(
        "UPDATE listing_leads SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ? AND status = ?",
      )
      .bind(nextStatus, id, current.status)
      .run();

    if (Number(update.meta?.changes ?? 0) === 0) {
      logApiWarn(request, "admin.listing_leads.status_conflict", {
        id,
        expected: current.status,
        to: nextStatus,
      });
      return apiError("status_conflict", 409, { requestId });
    }

    logApiInfo(request, "admin.listing_leads.status_updated", {
      id,
      from: current.status,
      to: nextStatus,
    });

    return apiJson(
      {
        ok: true,
        id,
        status: nextStatus,
      },
      { headers: { "cache-control": "no-store" } },
    );
  },
);

export const Route = createApiFileRoute("/api/admin/listing-leads")({
  server: {
    handlers: {
      GET: async ({ request, params }) => GET(request, { params }),
      PATCH: async ({ request, params }) => PATCH(request, { params }),
    },
  },
});
