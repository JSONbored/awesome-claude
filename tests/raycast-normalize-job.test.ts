import { describe, expect, it } from "vitest";

import {
  normalizeRaycastJob,
  isValidRaycastJob,
} from "../integrations/raycast/src/jobs-feed.js";

const fullJob = {
  slug: "s",
  title: "t",
  company: "c",
  location: "l",
  description: "d",
  applyUrl: "https://a.example",
  webUrl: "https://w.example",
  sourceLabel: "Employer submitted",
  applySourceLabel: "External apply",
  benefits: ["b1", "b1", " b2 "],
  featured: true,
  sponsored: false,
  type: "full-time",
  companyUrl: "https://co.example",
};

describe("normalizeRaycastJob", () => {
  it("normalizes a complete job, trimming/de-duping list fields", () => {
    const job = normalizeRaycastJob(fullJob);
    expect(job).not.toBeNull();
    expect(job!.benefits).toEqual(["b1", "b2"]);
    expect(job!.featured).toBe(true);
    expect(job!.sponsored).toBe(false);
    expect(job!.type).toBe("full-time");
    expect(job!.companyUrl).toBe("https://co.example");
  });

  it("returns null when a required field is missing", () => {
    // Every core field (slug/title/company/.../applySourceLabel) is required;
    // dropping any one rejects the whole record.
    expect(normalizeRaycastJob({})).toBeNull();
    expect(normalizeRaycastJob({ ...fullJob, title: "" })).toBeNull();
  });

  it("returns null for non-record inputs", () => {
    expect(normalizeRaycastJob("not-an-object")).toBeNull();
    expect(normalizeRaycastJob(42)).toBeNull();
  });
});

describe("isValidRaycastJob", () => {
  it("delegates to normalizeRaycastJob's pass/fail result", () => {
    expect(isValidRaycastJob(fullJob)).toBe(true);
    expect(isValidRaycastJob({})).toBe(false);
    expect(isValidRaycastJob("not-an-object")).toBe(false);
  });
});
