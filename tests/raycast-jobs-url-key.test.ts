import { describe, expect, it } from "vitest";

import {
  resolveJobsUrl,
  jobKey,
  type RaycastJob,
} from "../integrations/raycast/src/jobs-feed.js";

describe("resolveJobsUrl", () => {
  it("targets the jobs API endpoint", () => {
    const url = new URL(resolveJobsUrl());
    expect(url.pathname).toBe("/api/jobs");
  });

  it("requests a bounded page via a positive numeric limit", () => {
    // The exact size is an implementation detail; the contract is that a
    // positive integer page limit is always present.
    const limit = new URL(resolveJobsUrl()).searchParams.get("limit");
    expect(limit).not.toBeNull();
    expect(Number.isInteger(Number(limit))).toBe(true);
    expect(Number(limit)).toBeGreaterThan(0);
  });

  it("returns an absolute https URL", () => {
    expect(resolveJobsUrl().startsWith("https://")).toBe(true);
  });
});

describe("jobKey", () => {
  it("uses the job slug as its stable identity key", () => {
    const job = { slug: "my-job-slug" } as Pick<RaycastJob, "slug">;
    expect(jobKey(job)).toBe("my-job-slug");
  });
});
