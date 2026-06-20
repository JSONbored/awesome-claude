import { afterEach, describe, expect, it, vi } from "vitest";

import {
  getAdminToken,
  getAdminTokens,
  isAdminAuthorized,
  isJobsAdminAuthorized,
  isLeadsAdminAuthorized,
} from "@/lib/admin-auth";

afterEach(() => {
  vi.unstubAllEnvs();
  delete (globalThis as typeof globalThis & { __env__?: unknown }).__env__;
});

describe("admin auth helpers", () => {
  it("authorizes primary admin tokens from process env using bearer or admin headers", () => {
    vi.stubEnv("ADMIN_API_TOKEN", " primary-secret ");

    expect(getAdminToken()).toBe("primary-secret");
    expect(getAdminTokens()).toEqual(["primary-secret"]);
    expect(
      isAdminAuthorized(
        new Request("https://heyclau.de/api/admin/jobs", {
          headers: { authorization: "Bearer primary-secret" },
        }),
      ),
    ).toBe(true);
    expect(
      isAdminAuthorized(
        new Request("https://heyclau.de/api/admin/jobs", {
          headers: { "x-admin-token": "primary-secret" },
        }),
      ),
    ).toBe(true);
    expect(
      isAdminAuthorized(
        new Request("https://heyclau.de/api/admin/jobs", {
          headers: { authorization: "Bearer primary-secret-extra" },
        }),
      ),
    ).toBe(false);
  });

  it("keeps jobs and leads scoped tokens separate while accepting primary admin tokens", () => {
    vi.stubEnv("ADMIN_API_TOKEN", "primary-secret");
    vi.stubEnv("JOBS_ADMIN_API_TOKEN", "jobs-secret");
    (globalThis as typeof globalThis & { __env__?: unknown }).__env__ = {
      LEADS_ADMIN_TOKEN: "leads-secret",
      ADMIN_LEADS_TOKEN: "legacy-leads-secret",
    };

    expect(
      isJobsAdminAuthorized(
        new Request("https://heyclau.de/api/admin/jobs", {
          headers: { "x-admin-token": "jobs-secret" },
        }),
      ),
    ).toBe(true);
    expect(
      isJobsAdminAuthorized(
        new Request("https://heyclau.de/api/admin/jobs", {
          headers: { authorization: "Bearer primary-secret" },
        }),
      ),
    ).toBe(true);
    expect(
      isJobsAdminAuthorized(
        new Request("https://heyclau.de/api/admin/jobs", {
          headers: { "x-admin-token": "leads-secret" },
        }),
      ),
    ).toBe(false);

    expect(
      isLeadsAdminAuthorized(
        new Request("https://heyclau.de/api/admin/listing-leads", {
          headers: { authorization: "Bearer leads-secret" },
        }),
      ),
    ).toBe(true);
    expect(
      isLeadsAdminAuthorized(
        new Request("https://heyclau.de/api/admin/listing-leads", {
          headers: { "x-admin-token": "legacy-leads-secret" },
        }),
      ),
    ).toBe(true);
    expect(
      isLeadsAdminAuthorized(
        new Request("https://heyclau.de/api/admin/listing-leads", {
          headers: { "x-admin-token": "jobs-secret" },
        }),
      ),
    ).toBe(false);
  });

  it("fails closed when no admin tokens are configured", () => {
    expect(
      isAdminAuthorized(
        new Request("https://heyclau.de/api/admin/jobs", {
          headers: { authorization: "Bearer anything" },
        }),
      ),
    ).toBe(false);
  });
});
