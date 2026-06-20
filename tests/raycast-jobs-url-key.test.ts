import { describe, expect, it } from "vitest";

import {
  resolveJobsUrl,
  jobKey,
  type RaycastJob,
} from "../integrations/raycast/src/jobs-feed.js";

describe("resolveJobsUrl", () => {
  it("builds the jobs API URL with the 100-item limit", () => {
    const url = new URL(resolveJobsUrl());
    expect(url.pathname).toBe("/api/jobs");
    // The view requests a fixed page size of 100.
    expect(url.searchParams.get("limit")).toBe("100");
  });

  it("returns an absolute URL", () => {
    expect(resolveJobsUrl().startsWith("https://")).toBe(true);
  });
});

describe("jobKey", () => {
  it("uses the job slug as its stable identity key", () => {
    const job = { slug: "my-job-slug" } as Pick<RaycastJob, "slug">;
    expect(jobKey(job)).toBe("my-job-slug");
  });
});
