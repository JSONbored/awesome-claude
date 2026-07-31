import { afterEach, describe, expect, it, vi } from "vitest";

import { JobInvalidTransitionError } from "../apps/web/src/lib/job-admin-lib";

describe("admin jobs PATCH invalid_transition", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.resetModules();
    vi.clearAllMocks();
  });

  it("returns 400 invalid_transition when the lifecycle guard rejects the action", async () => {
    vi.stubEnv("JOBS_ADMIN_API_TOKEN", "jobs-admin-token");
    vi.stubEnv("ADMIN_API_TOKEN", "");

    const db = {
      prepare() {
        return {
          bind() {
            return this;
          },
          async all() {
            return {
              results: [
                { name: "slug" },
                { name: "title" },
                { name: "company_name" },
                { name: "company_url" },
                { name: "location_text" },
                { name: "summary" },
                { name: "description_md" },
                { name: "employment_type" },
                { name: "compensation_summary" },
                { name: "equity_summary" },
                { name: "bonus_summary" },
                { name: "benefits_json" },
                { name: "responsibilities_json" },
                { name: "requirements_json" },
                { name: "apply_url" },
                { name: "tier" },
                { name: "status" },
                { name: "source" },
                { name: "source_kind" },
                { name: "source_url" },
                { name: "first_seen_at" },
                { name: "last_checked_at" },
                { name: "source_checked_at" },
                { name: "stale_check_count" },
                { name: "curation_note" },
                { name: "paid_placement_expires_at" },
                { name: "claimed_employer" },
                { name: "posted_by_email" },
                { name: "posted_at" },
                { name: "expires_at" },
                { name: "is_remote" },
                { name: "is_worldwide" },
              ],
            };
          },
        };
      },
    };

    vi.doMock("../apps/web/src/lib/db", () => ({ getSiteDb: () => db }));
    vi.doMock("../apps/web/src/lib/job-admin", async () => {
      const actual = await vi.importActual<
        typeof import("../apps/web/src/lib/job-admin")
      >("../apps/web/src/lib/job-admin");
      return {
        ...actual,
        checkJobsSchema: async () => ({
          ok: true,
          checkedAt: "2026-04-28T00:00:00.000Z",
          requiredMigration: actual.REQUIRED_JOBS_MIGRATION,
          columns: [...actual.REQUIRED_JOB_COLUMNS],
          missingColumns: [],
        }),
        updateAdminJobState: async () => {
          throw new JobInvalidTransitionError("archived", "activate");
        },
      };
    });

    const { PATCH } = await import("../apps/web/src/routes/api/admin/jobs");
    const response = await PATCH(
      new Request("https://heyclau.de/api/admin/jobs", {
        method: "PATCH",
        headers: {
          authorization: "Bearer jobs-admin-token",
          "content-type": "application/json",
        },
        body: JSON.stringify({ slug: "archived-role", action: "activate" }),
      }),
    );

    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toMatchObject({
      ok: false,
      error: {
        code: "invalid_transition",
        details: {
          action: "activate",
          currentStatus: "archived",
        },
      },
    });
  });
});
