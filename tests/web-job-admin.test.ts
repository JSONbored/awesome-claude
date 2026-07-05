import { describe, expect, it } from "vitest";

import { REQUIRED_JOB_COLUMNS } from "@/lib/job-admin";

describe("web job-admin re-export", () => {
  it("re-exports REQUIRED_JOB_COLUMNS from job-admin-lib", () => {
    expect(REQUIRED_JOB_COLUMNS).toContain("slug");
    expect(REQUIRED_JOB_COLUMNS).toContain("compensation_summary");
  });
});
