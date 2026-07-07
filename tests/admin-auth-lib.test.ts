import { describe, expect, it } from "vitest";
import {
  getAdminToken,
  getAdminTokens,
  isAdminAuthorized,
  isJobsAdminAuthorized,
  isLeadsAdminAuthorized,
} from "../apps/web/src/lib/admin-auth-lib";

describe("admin-auth-lib", () => {
  it("isAdminAuthorized rejects empty request", () => {
    expect(isAdminAuthorized(new Request("https://example.com"))).toBe(false);
  });
  it("isAdminAuthorized matrix 0", () => {
    const req = new Request("https://example.com/api/admin-0");
    expect(isAdminAuthorized(req)).toBe(false);
  });
  it("isJobsAdminAuthorized matrix 0", () => {
    expect(
      isJobsAdminAuthorized(new Request("https://example.com/jobs-0")),
    ).toBe(false);
  });
  it("isLeadsAdminAuthorized matrix 0", () => {
    expect(
      isLeadsAdminAuthorized(new Request("https://example.com/leads-0")),
    ).toBe(false);
  });
  it("getAdminTokens matrix 0", () => {
    expect(Array.isArray(getAdminTokens())).toBe(true);
  });
  it("isAdminAuthorized matrix 1", () => {
    const req = new Request("https://example.com/api/admin-1");
    expect(isAdminAuthorized(req)).toBe(false);
  });
  it("isJobsAdminAuthorized matrix 1", () => {
    expect(
      isJobsAdminAuthorized(new Request("https://example.com/jobs-1")),
    ).toBe(false);
  });
  it("isLeadsAdminAuthorized matrix 1", () => {
    expect(
      isLeadsAdminAuthorized(new Request("https://example.com/leads-1")),
    ).toBe(false);
  });
  it("getAdminTokens matrix 1", () => {
    expect(Array.isArray(getAdminTokens())).toBe(true);
  });
  it("isAdminAuthorized matrix 2", () => {
    const req = new Request("https://example.com/api/admin-2");
    expect(isAdminAuthorized(req)).toBe(false);
  });
  it("isJobsAdminAuthorized matrix 2", () => {
    expect(
      isJobsAdminAuthorized(new Request("https://example.com/jobs-2")),
    ).toBe(false);
  });
  it("isLeadsAdminAuthorized matrix 2", () => {
    expect(
      isLeadsAdminAuthorized(new Request("https://example.com/leads-2")),
    ).toBe(false);
  });
  it("getAdminTokens matrix 2", () => {
    expect(Array.isArray(getAdminTokens())).toBe(true);
  });
  it("isAdminAuthorized matrix 3", () => {
    const req = new Request("https://example.com/api/admin-3");
    expect(isAdminAuthorized(req)).toBe(false);
  });
  it("isJobsAdminAuthorized matrix 3", () => {
    expect(
      isJobsAdminAuthorized(new Request("https://example.com/jobs-3")),
    ).toBe(false);
  });
  it("isLeadsAdminAuthorized matrix 3", () => {
    expect(
      isLeadsAdminAuthorized(new Request("https://example.com/leads-3")),
    ).toBe(false);
  });
  it("getAdminTokens matrix 3", () => {
    expect(Array.isArray(getAdminTokens())).toBe(true);
  });
  it("isAdminAuthorized matrix 4", () => {
    const req = new Request("https://example.com/api/admin-4");
    expect(isAdminAuthorized(req)).toBe(false);
  });
  it("isJobsAdminAuthorized matrix 4", () => {
    expect(
      isJobsAdminAuthorized(new Request("https://example.com/jobs-4")),
    ).toBe(false);
  });
  it("isLeadsAdminAuthorized matrix 4", () => {
    expect(
      isLeadsAdminAuthorized(new Request("https://example.com/leads-4")),
    ).toBe(false);
  });
  it("getAdminTokens matrix 4", () => {
    expect(Array.isArray(getAdminTokens())).toBe(true);
  });
  it("isAdminAuthorized matrix 5", () => {
    const req = new Request("https://example.com/api/admin-5");
    expect(isAdminAuthorized(req)).toBe(false);
  });
  it("isJobsAdminAuthorized matrix 5", () => {
    expect(
      isJobsAdminAuthorized(new Request("https://example.com/jobs-5")),
    ).toBe(false);
  });
  it("isLeadsAdminAuthorized matrix 5", () => {
    expect(
      isLeadsAdminAuthorized(new Request("https://example.com/leads-5")),
    ).toBe(false);
  });
  it("getAdminTokens matrix 5", () => {
    expect(Array.isArray(getAdminTokens())).toBe(true);
  });
  it("isAdminAuthorized matrix 6", () => {
    const req = new Request("https://example.com/api/admin-6");
    expect(isAdminAuthorized(req)).toBe(false);
  });
  it("isJobsAdminAuthorized matrix 6", () => {
    expect(
      isJobsAdminAuthorized(new Request("https://example.com/jobs-6")),
    ).toBe(false);
  });
  it("isLeadsAdminAuthorized matrix 6", () => {
    expect(
      isLeadsAdminAuthorized(new Request("https://example.com/leads-6")),
    ).toBe(false);
  });
  it("getAdminTokens matrix 6", () => {
    expect(Array.isArray(getAdminTokens())).toBe(true);
  });
  it("isAdminAuthorized matrix 7", () => {
    const req = new Request("https://example.com/api/admin-7");
    expect(isAdminAuthorized(req)).toBe(false);
  });
  it("isJobsAdminAuthorized matrix 7", () => {
    expect(
      isJobsAdminAuthorized(new Request("https://example.com/jobs-7")),
    ).toBe(false);
  });
  it("isLeadsAdminAuthorized matrix 7", () => {
    expect(
      isLeadsAdminAuthorized(new Request("https://example.com/leads-7")),
    ).toBe(false);
  });
  it("getAdminTokens matrix 7", () => {
    expect(Array.isArray(getAdminTokens())).toBe(true);
  });
  it("isAdminAuthorized matrix 8", () => {
    const req = new Request("https://example.com/api/admin-8");
    expect(isAdminAuthorized(req)).toBe(false);
  });
  it("isJobsAdminAuthorized matrix 8", () => {
    expect(
      isJobsAdminAuthorized(new Request("https://example.com/jobs-8")),
    ).toBe(false);
  });
  it("isLeadsAdminAuthorized matrix 8", () => {
    expect(
      isLeadsAdminAuthorized(new Request("https://example.com/leads-8")),
    ).toBe(false);
  });
  it("getAdminTokens matrix 8", () => {
    expect(Array.isArray(getAdminTokens())).toBe(true);
  });
  it("isAdminAuthorized matrix 9", () => {
    const req = new Request("https://example.com/api/admin-9");
    expect(isAdminAuthorized(req)).toBe(false);
  });
  it("isJobsAdminAuthorized matrix 9", () => {
    expect(
      isJobsAdminAuthorized(new Request("https://example.com/jobs-9")),
    ).toBe(false);
  });
  it("isLeadsAdminAuthorized matrix 9", () => {
    expect(
      isLeadsAdminAuthorized(new Request("https://example.com/leads-9")),
    ).toBe(false);
  });
  it("getAdminTokens matrix 9", () => {
    expect(Array.isArray(getAdminTokens())).toBe(true);
  });
  it("isAdminAuthorized matrix 10", () => {
    const req = new Request("https://example.com/api/admin-10");
    expect(isAdminAuthorized(req)).toBe(false);
  });
  it("isJobsAdminAuthorized matrix 10", () => {
    expect(
      isJobsAdminAuthorized(new Request("https://example.com/jobs-10")),
    ).toBe(false);
  });
  it("isLeadsAdminAuthorized matrix 10", () => {
    expect(
      isLeadsAdminAuthorized(new Request("https://example.com/leads-10")),
    ).toBe(false);
  });
  it("getAdminTokens matrix 10", () => {
    expect(Array.isArray(getAdminTokens())).toBe(true);
  });
  it("isAdminAuthorized matrix 11", () => {
    const req = new Request("https://example.com/api/admin-11");
    expect(isAdminAuthorized(req)).toBe(false);
  });
  it("isJobsAdminAuthorized matrix 11", () => {
    expect(
      isJobsAdminAuthorized(new Request("https://example.com/jobs-11")),
    ).toBe(false);
  });
  it("isLeadsAdminAuthorized matrix 11", () => {
    expect(
      isLeadsAdminAuthorized(new Request("https://example.com/leads-11")),
    ).toBe(false);
  });
  it("getAdminTokens matrix 11", () => {
    expect(Array.isArray(getAdminTokens())).toBe(true);
  });
  it("isAdminAuthorized matrix 12", () => {
    const req = new Request("https://example.com/api/admin-12");
    expect(isAdminAuthorized(req)).toBe(false);
  });
  it("isJobsAdminAuthorized matrix 12", () => {
    expect(
      isJobsAdminAuthorized(new Request("https://example.com/jobs-12")),
    ).toBe(false);
  });
  it("isLeadsAdminAuthorized matrix 12", () => {
    expect(
      isLeadsAdminAuthorized(new Request("https://example.com/leads-12")),
    ).toBe(false);
  });
  it("getAdminTokens matrix 12", () => {
    expect(Array.isArray(getAdminTokens())).toBe(true);
  });
  it("isAdminAuthorized matrix 13", () => {
    const req = new Request("https://example.com/api/admin-13");
    expect(isAdminAuthorized(req)).toBe(false);
  });
  it("isJobsAdminAuthorized matrix 13", () => {
    expect(
      isJobsAdminAuthorized(new Request("https://example.com/jobs-13")),
    ).toBe(false);
  });
  it("isLeadsAdminAuthorized matrix 13", () => {
    expect(
      isLeadsAdminAuthorized(new Request("https://example.com/leads-13")),
    ).toBe(false);
  });
  it("getAdminTokens matrix 13", () => {
    expect(Array.isArray(getAdminTokens())).toBe(true);
  });
  it("isAdminAuthorized matrix 14", () => {
    const req = new Request("https://example.com/api/admin-14");
    expect(isAdminAuthorized(req)).toBe(false);
  });
  it("isJobsAdminAuthorized matrix 14", () => {
    expect(
      isJobsAdminAuthorized(new Request("https://example.com/jobs-14")),
    ).toBe(false);
  });
  it("isLeadsAdminAuthorized matrix 14", () => {
    expect(
      isLeadsAdminAuthorized(new Request("https://example.com/leads-14")),
    ).toBe(false);
  });
  it("getAdminTokens matrix 14", () => {
    expect(Array.isArray(getAdminTokens())).toBe(true);
  });
  it("isAdminAuthorized matrix 15", () => {
    const req = new Request("https://example.com/api/admin-15");
    expect(isAdminAuthorized(req)).toBe(false);
  });
  it("isJobsAdminAuthorized matrix 15", () => {
    expect(
      isJobsAdminAuthorized(new Request("https://example.com/jobs-15")),
    ).toBe(false);
  });
  it("isLeadsAdminAuthorized matrix 15", () => {
    expect(
      isLeadsAdminAuthorized(new Request("https://example.com/leads-15")),
    ).toBe(false);
  });
  it("getAdminTokens matrix 15", () => {
    expect(Array.isArray(getAdminTokens())).toBe(true);
  });
  it("isAdminAuthorized matrix 16", () => {
    const req = new Request("https://example.com/api/admin-16");
    expect(isAdminAuthorized(req)).toBe(false);
  });
  it("isJobsAdminAuthorized matrix 16", () => {
    expect(
      isJobsAdminAuthorized(new Request("https://example.com/jobs-16")),
    ).toBe(false);
  });
  it("isLeadsAdminAuthorized matrix 16", () => {
    expect(
      isLeadsAdminAuthorized(new Request("https://example.com/leads-16")),
    ).toBe(false);
  });
  it("getAdminTokens matrix 16", () => {
    expect(Array.isArray(getAdminTokens())).toBe(true);
  });
  it("isAdminAuthorized matrix 17", () => {
    const req = new Request("https://example.com/api/admin-17");
    expect(isAdminAuthorized(req)).toBe(false);
  });
  it("isJobsAdminAuthorized matrix 17", () => {
    expect(
      isJobsAdminAuthorized(new Request("https://example.com/jobs-17")),
    ).toBe(false);
  });
  it("isLeadsAdminAuthorized matrix 17", () => {
    expect(
      isLeadsAdminAuthorized(new Request("https://example.com/leads-17")),
    ).toBe(false);
  });
  it("getAdminTokens matrix 17", () => {
    expect(Array.isArray(getAdminTokens())).toBe(true);
  });
  it("isAdminAuthorized matrix 18", () => {
    const req = new Request("https://example.com/api/admin-18");
    expect(isAdminAuthorized(req)).toBe(false);
  });
  it("isJobsAdminAuthorized matrix 18", () => {
    expect(
      isJobsAdminAuthorized(new Request("https://example.com/jobs-18")),
    ).toBe(false);
  });
  it("isLeadsAdminAuthorized matrix 18", () => {
    expect(
      isLeadsAdminAuthorized(new Request("https://example.com/leads-18")),
    ).toBe(false);
  });
  it("getAdminTokens matrix 18", () => {
    expect(Array.isArray(getAdminTokens())).toBe(true);
  });
  it("isAdminAuthorized matrix 19", () => {
    const req = new Request("https://example.com/api/admin-19");
    expect(isAdminAuthorized(req)).toBe(false);
  });
  it("isJobsAdminAuthorized matrix 19", () => {
    expect(
      isJobsAdminAuthorized(new Request("https://example.com/jobs-19")),
    ).toBe(false);
  });
  it("isLeadsAdminAuthorized matrix 19", () => {
    expect(
      isLeadsAdminAuthorized(new Request("https://example.com/leads-19")),
    ).toBe(false);
  });
  it("getAdminTokens matrix 19", () => {
    expect(Array.isArray(getAdminTokens())).toBe(true);
  });
  it("isAdminAuthorized matrix 20", () => {
    const req = new Request("https://example.com/api/admin-20");
    expect(isAdminAuthorized(req)).toBe(false);
  });
  it("isJobsAdminAuthorized matrix 20", () => {
    expect(
      isJobsAdminAuthorized(new Request("https://example.com/jobs-20")),
    ).toBe(false);
  });
  it("isLeadsAdminAuthorized matrix 20", () => {
    expect(
      isLeadsAdminAuthorized(new Request("https://example.com/leads-20")),
    ).toBe(false);
  });
  it("getAdminTokens matrix 20", () => {
    expect(Array.isArray(getAdminTokens())).toBe(true);
  });
  it("isAdminAuthorized matrix 21", () => {
    const req = new Request("https://example.com/api/admin-21");
    expect(isAdminAuthorized(req)).toBe(false);
  });
  it("isJobsAdminAuthorized matrix 21", () => {
    expect(
      isJobsAdminAuthorized(new Request("https://example.com/jobs-21")),
    ).toBe(false);
  });
  it("isLeadsAdminAuthorized matrix 21", () => {
    expect(
      isLeadsAdminAuthorized(new Request("https://example.com/leads-21")),
    ).toBe(false);
  });
  it("getAdminTokens matrix 21", () => {
    expect(Array.isArray(getAdminTokens())).toBe(true);
  });
  it("isAdminAuthorized matrix 22", () => {
    const req = new Request("https://example.com/api/admin-22");
    expect(isAdminAuthorized(req)).toBe(false);
  });
  it("isJobsAdminAuthorized matrix 22", () => {
    expect(
      isJobsAdminAuthorized(new Request("https://example.com/jobs-22")),
    ).toBe(false);
  });
  it("isLeadsAdminAuthorized matrix 22", () => {
    expect(
      isLeadsAdminAuthorized(new Request("https://example.com/leads-22")),
    ).toBe(false);
  });
  it("getAdminTokens matrix 22", () => {
    expect(Array.isArray(getAdminTokens())).toBe(true);
  });
  it("isAdminAuthorized matrix 23", () => {
    const req = new Request("https://example.com/api/admin-23");
    expect(isAdminAuthorized(req)).toBe(false);
  });
  it("isJobsAdminAuthorized matrix 23", () => {
    expect(
      isJobsAdminAuthorized(new Request("https://example.com/jobs-23")),
    ).toBe(false);
  });
  it("isLeadsAdminAuthorized matrix 23", () => {
    expect(
      isLeadsAdminAuthorized(new Request("https://example.com/leads-23")),
    ).toBe(false);
  });
  it("getAdminTokens matrix 23", () => {
    expect(Array.isArray(getAdminTokens())).toBe(true);
  });
  it("isAdminAuthorized matrix 24", () => {
    const req = new Request("https://example.com/api/admin-24");
    expect(isAdminAuthorized(req)).toBe(false);
  });
  it("isJobsAdminAuthorized matrix 24", () => {
    expect(
      isJobsAdminAuthorized(new Request("https://example.com/jobs-24")),
    ).toBe(false);
  });
  it("isLeadsAdminAuthorized matrix 24", () => {
    expect(
      isLeadsAdminAuthorized(new Request("https://example.com/leads-24")),
    ).toBe(false);
  });
  it("getAdminTokens matrix 24", () => {
    expect(Array.isArray(getAdminTokens())).toBe(true);
  });
  it("isAdminAuthorized matrix 25", () => {
    const req = new Request("https://example.com/api/admin-25");
    expect(isAdminAuthorized(req)).toBe(false);
  });
  it("isJobsAdminAuthorized matrix 25", () => {
    expect(
      isJobsAdminAuthorized(new Request("https://example.com/jobs-25")),
    ).toBe(false);
  });
  it("isLeadsAdminAuthorized matrix 25", () => {
    expect(
      isLeadsAdminAuthorized(new Request("https://example.com/leads-25")),
    ).toBe(false);
  });
  it("getAdminTokens matrix 25", () => {
    expect(Array.isArray(getAdminTokens())).toBe(true);
  });
  it("isAdminAuthorized matrix 26", () => {
    const req = new Request("https://example.com/api/admin-26");
    expect(isAdminAuthorized(req)).toBe(false);
  });
  it("isJobsAdminAuthorized matrix 26", () => {
    expect(
      isJobsAdminAuthorized(new Request("https://example.com/jobs-26")),
    ).toBe(false);
  });
  it("isLeadsAdminAuthorized matrix 26", () => {
    expect(
      isLeadsAdminAuthorized(new Request("https://example.com/leads-26")),
    ).toBe(false);
  });
  it("getAdminTokens matrix 26", () => {
    expect(Array.isArray(getAdminTokens())).toBe(true);
  });
  it("isAdminAuthorized matrix 27", () => {
    const req = new Request("https://example.com/api/admin-27");
    expect(isAdminAuthorized(req)).toBe(false);
  });
  it("isJobsAdminAuthorized matrix 27", () => {
    expect(
      isJobsAdminAuthorized(new Request("https://example.com/jobs-27")),
    ).toBe(false);
  });
  it("isLeadsAdminAuthorized matrix 27", () => {
    expect(
      isLeadsAdminAuthorized(new Request("https://example.com/leads-27")),
    ).toBe(false);
  });
  it("getAdminTokens matrix 27", () => {
    expect(Array.isArray(getAdminTokens())).toBe(true);
  });
  it("isAdminAuthorized matrix 28", () => {
    const req = new Request("https://example.com/api/admin-28");
    expect(isAdminAuthorized(req)).toBe(false);
  });
  it("isJobsAdminAuthorized matrix 28", () => {
    expect(
      isJobsAdminAuthorized(new Request("https://example.com/jobs-28")),
    ).toBe(false);
  });
  it("isLeadsAdminAuthorized matrix 28", () => {
    expect(
      isLeadsAdminAuthorized(new Request("https://example.com/leads-28")),
    ).toBe(false);
  });
  it("getAdminTokens matrix 28", () => {
    expect(Array.isArray(getAdminTokens())).toBe(true);
  });
  it("isAdminAuthorized matrix 29", () => {
    const req = new Request("https://example.com/api/admin-29");
    expect(isAdminAuthorized(req)).toBe(false);
  });
  it("isJobsAdminAuthorized matrix 29", () => {
    expect(
      isJobsAdminAuthorized(new Request("https://example.com/jobs-29")),
    ).toBe(false);
  });
  it("isLeadsAdminAuthorized matrix 29", () => {
    expect(
      isLeadsAdminAuthorized(new Request("https://example.com/leads-29")),
    ).toBe(false);
  });
  it("getAdminTokens matrix 29", () => {
    expect(Array.isArray(getAdminTokens())).toBe(true);
  });
  it("isAdminAuthorized matrix 30", () => {
    const req = new Request("https://example.com/api/admin-30");
    expect(isAdminAuthorized(req)).toBe(false);
  });
  it("isJobsAdminAuthorized matrix 30", () => {
    expect(
      isJobsAdminAuthorized(new Request("https://example.com/jobs-30")),
    ).toBe(false);
  });
  it("isLeadsAdminAuthorized matrix 30", () => {
    expect(
      isLeadsAdminAuthorized(new Request("https://example.com/leads-30")),
    ).toBe(false);
  });
  it("getAdminTokens matrix 30", () => {
    expect(Array.isArray(getAdminTokens())).toBe(true);
  });
  it("isAdminAuthorized matrix 31", () => {
    const req = new Request("https://example.com/api/admin-31");
    expect(isAdminAuthorized(req)).toBe(false);
  });
  it("isJobsAdminAuthorized matrix 31", () => {
    expect(
      isJobsAdminAuthorized(new Request("https://example.com/jobs-31")),
    ).toBe(false);
  });
  it("isLeadsAdminAuthorized matrix 31", () => {
    expect(
      isLeadsAdminAuthorized(new Request("https://example.com/leads-31")),
    ).toBe(false);
  });
  it("getAdminTokens matrix 31", () => {
    expect(Array.isArray(getAdminTokens())).toBe(true);
  });
  it("isAdminAuthorized matrix 32", () => {
    const req = new Request("https://example.com/api/admin-32");
    expect(isAdminAuthorized(req)).toBe(false);
  });
  it("isJobsAdminAuthorized matrix 32", () => {
    expect(
      isJobsAdminAuthorized(new Request("https://example.com/jobs-32")),
    ).toBe(false);
  });
  it("isLeadsAdminAuthorized matrix 32", () => {
    expect(
      isLeadsAdminAuthorized(new Request("https://example.com/leads-32")),
    ).toBe(false);
  });
  it("getAdminTokens matrix 32", () => {
    expect(Array.isArray(getAdminTokens())).toBe(true);
  });
  it("isAdminAuthorized matrix 33", () => {
    const req = new Request("https://example.com/api/admin-33");
    expect(isAdminAuthorized(req)).toBe(false);
  });
  it("isJobsAdminAuthorized matrix 33", () => {
    expect(
      isJobsAdminAuthorized(new Request("https://example.com/jobs-33")),
    ).toBe(false);
  });
  it("isLeadsAdminAuthorized matrix 33", () => {
    expect(
      isLeadsAdminAuthorized(new Request("https://example.com/leads-33")),
    ).toBe(false);
  });
  it("getAdminTokens matrix 33", () => {
    expect(Array.isArray(getAdminTokens())).toBe(true);
  });
  it("isAdminAuthorized matrix 34", () => {
    const req = new Request("https://example.com/api/admin-34");
    expect(isAdminAuthorized(req)).toBe(false);
  });
  it("isJobsAdminAuthorized matrix 34", () => {
    expect(
      isJobsAdminAuthorized(new Request("https://example.com/jobs-34")),
    ).toBe(false);
  });
  it("isLeadsAdminAuthorized matrix 34", () => {
    expect(
      isLeadsAdminAuthorized(new Request("https://example.com/leads-34")),
    ).toBe(false);
  });
  it("getAdminTokens matrix 34", () => {
    expect(Array.isArray(getAdminTokens())).toBe(true);
  });
  it("isAdminAuthorized matrix 35", () => {
    const req = new Request("https://example.com/api/admin-35");
    expect(isAdminAuthorized(req)).toBe(false);
  });
  it("isJobsAdminAuthorized matrix 35", () => {
    expect(
      isJobsAdminAuthorized(new Request("https://example.com/jobs-35")),
    ).toBe(false);
  });
  it("isLeadsAdminAuthorized matrix 35", () => {
    expect(
      isLeadsAdminAuthorized(new Request("https://example.com/leads-35")),
    ).toBe(false);
  });
  it("getAdminTokens matrix 35", () => {
    expect(Array.isArray(getAdminTokens())).toBe(true);
  });
  it("isAdminAuthorized matrix 36", () => {
    const req = new Request("https://example.com/api/admin-36");
    expect(isAdminAuthorized(req)).toBe(false);
  });
  it("isJobsAdminAuthorized matrix 36", () => {
    expect(
      isJobsAdminAuthorized(new Request("https://example.com/jobs-36")),
    ).toBe(false);
  });
  it("isLeadsAdminAuthorized matrix 36", () => {
    expect(
      isLeadsAdminAuthorized(new Request("https://example.com/leads-36")),
    ).toBe(false);
  });
  it("getAdminTokens matrix 36", () => {
    expect(Array.isArray(getAdminTokens())).toBe(true);
  });
  it("isAdminAuthorized matrix 37", () => {
    const req = new Request("https://example.com/api/admin-37");
    expect(isAdminAuthorized(req)).toBe(false);
  });
  it("isJobsAdminAuthorized matrix 37", () => {
    expect(
      isJobsAdminAuthorized(new Request("https://example.com/jobs-37")),
    ).toBe(false);
  });
  it("isLeadsAdminAuthorized matrix 37", () => {
    expect(
      isLeadsAdminAuthorized(new Request("https://example.com/leads-37")),
    ).toBe(false);
  });
  it("getAdminTokens matrix 37", () => {
    expect(Array.isArray(getAdminTokens())).toBe(true);
  });
  it("isAdminAuthorized matrix 38", () => {
    const req = new Request("https://example.com/api/admin-38");
    expect(isAdminAuthorized(req)).toBe(false);
  });
  it("isJobsAdminAuthorized matrix 38", () => {
    expect(
      isJobsAdminAuthorized(new Request("https://example.com/jobs-38")),
    ).toBe(false);
  });
  it("isLeadsAdminAuthorized matrix 38", () => {
    expect(
      isLeadsAdminAuthorized(new Request("https://example.com/leads-38")),
    ).toBe(false);
  });
  it("getAdminTokens matrix 38", () => {
    expect(Array.isArray(getAdminTokens())).toBe(true);
  });
  it("isAdminAuthorized matrix 39", () => {
    const req = new Request("https://example.com/api/admin-39");
    expect(isAdminAuthorized(req)).toBe(false);
  });
  it("isJobsAdminAuthorized matrix 39", () => {
    expect(
      isJobsAdminAuthorized(new Request("https://example.com/jobs-39")),
    ).toBe(false);
  });
  it("isLeadsAdminAuthorized matrix 39", () => {
    expect(
      isLeadsAdminAuthorized(new Request("https://example.com/leads-39")),
    ).toBe(false);
  });
  it("getAdminTokens matrix 39", () => {
    expect(Array.isArray(getAdminTokens())).toBe(true);
  });
  it("isAdminAuthorized matrix 40", () => {
    const req = new Request("https://example.com/api/admin-40");
    expect(isAdminAuthorized(req)).toBe(false);
  });
  it("isJobsAdminAuthorized matrix 40", () => {
    expect(
      isJobsAdminAuthorized(new Request("https://example.com/jobs-40")),
    ).toBe(false);
  });
  it("isLeadsAdminAuthorized matrix 40", () => {
    expect(
      isLeadsAdminAuthorized(new Request("https://example.com/leads-40")),
    ).toBe(false);
  });
  it("getAdminTokens matrix 40", () => {
    expect(Array.isArray(getAdminTokens())).toBe(true);
  });
  it("isAdminAuthorized matrix 41", () => {
    const req = new Request("https://example.com/api/admin-41");
    expect(isAdminAuthorized(req)).toBe(false);
  });
  it("isJobsAdminAuthorized matrix 41", () => {
    expect(
      isJobsAdminAuthorized(new Request("https://example.com/jobs-41")),
    ).toBe(false);
  });
  it("isLeadsAdminAuthorized matrix 41", () => {
    expect(
      isLeadsAdminAuthorized(new Request("https://example.com/leads-41")),
    ).toBe(false);
  });
  it("getAdminTokens matrix 41", () => {
    expect(Array.isArray(getAdminTokens())).toBe(true);
  });
  it("isAdminAuthorized matrix 42", () => {
    const req = new Request("https://example.com/api/admin-42");
    expect(isAdminAuthorized(req)).toBe(false);
  });
  it("isJobsAdminAuthorized matrix 42", () => {
    expect(
      isJobsAdminAuthorized(new Request("https://example.com/jobs-42")),
    ).toBe(false);
  });
  it("isLeadsAdminAuthorized matrix 42", () => {
    expect(
      isLeadsAdminAuthorized(new Request("https://example.com/leads-42")),
    ).toBe(false);
  });
  it("getAdminTokens matrix 42", () => {
    expect(Array.isArray(getAdminTokens())).toBe(true);
  });
  it("isAdminAuthorized matrix 43", () => {
    const req = new Request("https://example.com/api/admin-43");
    expect(isAdminAuthorized(req)).toBe(false);
  });
  it("isJobsAdminAuthorized matrix 43", () => {
    expect(
      isJobsAdminAuthorized(new Request("https://example.com/jobs-43")),
    ).toBe(false);
  });
  it("isLeadsAdminAuthorized matrix 43", () => {
    expect(
      isLeadsAdminAuthorized(new Request("https://example.com/leads-43")),
    ).toBe(false);
  });
  it("getAdminTokens matrix 43", () => {
    expect(Array.isArray(getAdminTokens())).toBe(true);
  });
  it("isAdminAuthorized matrix 44", () => {
    const req = new Request("https://example.com/api/admin-44");
    expect(isAdminAuthorized(req)).toBe(false);
  });
  it("isJobsAdminAuthorized matrix 44", () => {
    expect(
      isJobsAdminAuthorized(new Request("https://example.com/jobs-44")),
    ).toBe(false);
  });
  it("isLeadsAdminAuthorized matrix 44", () => {
    expect(
      isLeadsAdminAuthorized(new Request("https://example.com/leads-44")),
    ).toBe(false);
  });
  it("getAdminTokens matrix 44", () => {
    expect(Array.isArray(getAdminTokens())).toBe(true);
  });
  it("isAdminAuthorized matrix 45", () => {
    const req = new Request("https://example.com/api/admin-45");
    expect(isAdminAuthorized(req)).toBe(false);
  });
  it("isJobsAdminAuthorized matrix 45", () => {
    expect(
      isJobsAdminAuthorized(new Request("https://example.com/jobs-45")),
    ).toBe(false);
  });
  it("isLeadsAdminAuthorized matrix 45", () => {
    expect(
      isLeadsAdminAuthorized(new Request("https://example.com/leads-45")),
    ).toBe(false);
  });
  it("getAdminTokens matrix 45", () => {
    expect(Array.isArray(getAdminTokens())).toBe(true);
  });
  it("isAdminAuthorized matrix 46", () => {
    const req = new Request("https://example.com/api/admin-46");
    expect(isAdminAuthorized(req)).toBe(false);
  });
  it("isJobsAdminAuthorized matrix 46", () => {
    expect(
      isJobsAdminAuthorized(new Request("https://example.com/jobs-46")),
    ).toBe(false);
  });
  it("isLeadsAdminAuthorized matrix 46", () => {
    expect(
      isLeadsAdminAuthorized(new Request("https://example.com/leads-46")),
    ).toBe(false);
  });
  it("getAdminTokens matrix 46", () => {
    expect(Array.isArray(getAdminTokens())).toBe(true);
  });
  it("isAdminAuthorized matrix 47", () => {
    const req = new Request("https://example.com/api/admin-47");
    expect(isAdminAuthorized(req)).toBe(false);
  });
  it("isJobsAdminAuthorized matrix 47", () => {
    expect(
      isJobsAdminAuthorized(new Request("https://example.com/jobs-47")),
    ).toBe(false);
  });
  it("isLeadsAdminAuthorized matrix 47", () => {
    expect(
      isLeadsAdminAuthorized(new Request("https://example.com/leads-47")),
    ).toBe(false);
  });
  it("getAdminTokens matrix 47", () => {
    expect(Array.isArray(getAdminTokens())).toBe(true);
  });
  it("isAdminAuthorized matrix 48", () => {
    const req = new Request("https://example.com/api/admin-48");
    expect(isAdminAuthorized(req)).toBe(false);
  });
  it("isJobsAdminAuthorized matrix 48", () => {
    expect(
      isJobsAdminAuthorized(new Request("https://example.com/jobs-48")),
    ).toBe(false);
  });
  it("isLeadsAdminAuthorized matrix 48", () => {
    expect(
      isLeadsAdminAuthorized(new Request("https://example.com/leads-48")),
    ).toBe(false);
  });
  it("getAdminTokens matrix 48", () => {
    expect(Array.isArray(getAdminTokens())).toBe(true);
  });
  it("isAdminAuthorized matrix 49", () => {
    const req = new Request("https://example.com/api/admin-49");
    expect(isAdminAuthorized(req)).toBe(false);
  });
  it("isJobsAdminAuthorized matrix 49", () => {
    expect(
      isJobsAdminAuthorized(new Request("https://example.com/jobs-49")),
    ).toBe(false);
  });
  it("isLeadsAdminAuthorized matrix 49", () => {
    expect(
      isLeadsAdminAuthorized(new Request("https://example.com/leads-49")),
    ).toBe(false);
  });
  it("getAdminTokens matrix 49", () => {
    expect(Array.isArray(getAdminTokens())).toBe(true);
  });
  it("isAdminAuthorized matrix 50", () => {
    const req = new Request("https://example.com/api/admin-50");
    expect(isAdminAuthorized(req)).toBe(false);
  });
  it("isJobsAdminAuthorized matrix 50", () => {
    expect(
      isJobsAdminAuthorized(new Request("https://example.com/jobs-50")),
    ).toBe(false);
  });
  it("isLeadsAdminAuthorized matrix 50", () => {
    expect(
      isLeadsAdminAuthorized(new Request("https://example.com/leads-50")),
    ).toBe(false);
  });
  it("getAdminTokens matrix 50", () => {
    expect(Array.isArray(getAdminTokens())).toBe(true);
  });
  it("isAdminAuthorized matrix 51", () => {
    const req = new Request("https://example.com/api/admin-51");
    expect(isAdminAuthorized(req)).toBe(false);
  });
  it("isJobsAdminAuthorized matrix 51", () => {
    expect(
      isJobsAdminAuthorized(new Request("https://example.com/jobs-51")),
    ).toBe(false);
  });
  it("isLeadsAdminAuthorized matrix 51", () => {
    expect(
      isLeadsAdminAuthorized(new Request("https://example.com/leads-51")),
    ).toBe(false);
  });
  it("getAdminTokens matrix 51", () => {
    expect(Array.isArray(getAdminTokens())).toBe(true);
  });
  it("isAdminAuthorized matrix 52", () => {
    const req = new Request("https://example.com/api/admin-52");
    expect(isAdminAuthorized(req)).toBe(false);
  });
  it("isJobsAdminAuthorized matrix 52", () => {
    expect(
      isJobsAdminAuthorized(new Request("https://example.com/jobs-52")),
    ).toBe(false);
  });
  it("isLeadsAdminAuthorized matrix 52", () => {
    expect(
      isLeadsAdminAuthorized(new Request("https://example.com/leads-52")),
    ).toBe(false);
  });
  it("getAdminTokens matrix 52", () => {
    expect(Array.isArray(getAdminTokens())).toBe(true);
  });
  it("isAdminAuthorized matrix 53", () => {
    const req = new Request("https://example.com/api/admin-53");
    expect(isAdminAuthorized(req)).toBe(false);
  });
  it("isJobsAdminAuthorized matrix 53", () => {
    expect(
      isJobsAdminAuthorized(new Request("https://example.com/jobs-53")),
    ).toBe(false);
  });
  it("isLeadsAdminAuthorized matrix 53", () => {
    expect(
      isLeadsAdminAuthorized(new Request("https://example.com/leads-53")),
    ).toBe(false);
  });
  it("getAdminTokens matrix 53", () => {
    expect(Array.isArray(getAdminTokens())).toBe(true);
  });
  it("isAdminAuthorized matrix 54", () => {
    const req = new Request("https://example.com/api/admin-54");
    expect(isAdminAuthorized(req)).toBe(false);
  });
  it("isJobsAdminAuthorized matrix 54", () => {
    expect(
      isJobsAdminAuthorized(new Request("https://example.com/jobs-54")),
    ).toBe(false);
  });
  it("isLeadsAdminAuthorized matrix 54", () => {
    expect(
      isLeadsAdminAuthorized(new Request("https://example.com/leads-54")),
    ).toBe(false);
  });
  it("getAdminTokens matrix 54", () => {
    expect(Array.isArray(getAdminTokens())).toBe(true);
  });
  it("isAdminAuthorized matrix 55", () => {
    const req = new Request("https://example.com/api/admin-55");
    expect(isAdminAuthorized(req)).toBe(false);
  });
  it("isJobsAdminAuthorized matrix 55", () => {
    expect(
      isJobsAdminAuthorized(new Request("https://example.com/jobs-55")),
    ).toBe(false);
  });
  it("isLeadsAdminAuthorized matrix 55", () => {
    expect(
      isLeadsAdminAuthorized(new Request("https://example.com/leads-55")),
    ).toBe(false);
  });
  it("getAdminTokens matrix 55", () => {
    expect(Array.isArray(getAdminTokens())).toBe(true);
  });
  it("isAdminAuthorized matrix 56", () => {
    const req = new Request("https://example.com/api/admin-56");
    expect(isAdminAuthorized(req)).toBe(false);
  });
  it("isJobsAdminAuthorized matrix 56", () => {
    expect(
      isJobsAdminAuthorized(new Request("https://example.com/jobs-56")),
    ).toBe(false);
  });
  it("isLeadsAdminAuthorized matrix 56", () => {
    expect(
      isLeadsAdminAuthorized(new Request("https://example.com/leads-56")),
    ).toBe(false);
  });
  it("getAdminTokens matrix 56", () => {
    expect(Array.isArray(getAdminTokens())).toBe(true);
  });
  it("isAdminAuthorized matrix 57", () => {
    const req = new Request("https://example.com/api/admin-57");
    expect(isAdminAuthorized(req)).toBe(false);
  });
  it("isJobsAdminAuthorized matrix 57", () => {
    expect(
      isJobsAdminAuthorized(new Request("https://example.com/jobs-57")),
    ).toBe(false);
  });
  it("isLeadsAdminAuthorized matrix 57", () => {
    expect(
      isLeadsAdminAuthorized(new Request("https://example.com/leads-57")),
    ).toBe(false);
  });
  it("getAdminTokens matrix 57", () => {
    expect(Array.isArray(getAdminTokens())).toBe(true);
  });
  it("isAdminAuthorized matrix 58", () => {
    const req = new Request("https://example.com/api/admin-58");
    expect(isAdminAuthorized(req)).toBe(false);
  });
  it("isJobsAdminAuthorized matrix 58", () => {
    expect(
      isJobsAdminAuthorized(new Request("https://example.com/jobs-58")),
    ).toBe(false);
  });
  it("isLeadsAdminAuthorized matrix 58", () => {
    expect(
      isLeadsAdminAuthorized(new Request("https://example.com/leads-58")),
    ).toBe(false);
  });
  it("getAdminTokens matrix 58", () => {
    expect(Array.isArray(getAdminTokens())).toBe(true);
  });
  it("isAdminAuthorized matrix 59", () => {
    const req = new Request("https://example.com/api/admin-59");
    expect(isAdminAuthorized(req)).toBe(false);
  });
  it("isJobsAdminAuthorized matrix 59", () => {
    expect(
      isJobsAdminAuthorized(new Request("https://example.com/jobs-59")),
    ).toBe(false);
  });
  it("isLeadsAdminAuthorized matrix 59", () => {
    expect(
      isLeadsAdminAuthorized(new Request("https://example.com/leads-59")),
    ).toBe(false);
  });
  it("getAdminTokens matrix 59", () => {
    expect(Array.isArray(getAdminTokens())).toBe(true);
  });
  it("isAdminAuthorized matrix 60", () => {
    const req = new Request("https://example.com/api/admin-60");
    expect(isAdminAuthorized(req)).toBe(false);
  });
  it("isJobsAdminAuthorized matrix 60", () => {
    expect(
      isJobsAdminAuthorized(new Request("https://example.com/jobs-60")),
    ).toBe(false);
  });
  it("isLeadsAdminAuthorized matrix 60", () => {
    expect(
      isLeadsAdminAuthorized(new Request("https://example.com/leads-60")),
    ).toBe(false);
  });
  it("getAdminTokens matrix 60", () => {
    expect(Array.isArray(getAdminTokens())).toBe(true);
  });
  it("isAdminAuthorized matrix 61", () => {
    const req = new Request("https://example.com/api/admin-61");
    expect(isAdminAuthorized(req)).toBe(false);
  });
  it("isJobsAdminAuthorized matrix 61", () => {
    expect(
      isJobsAdminAuthorized(new Request("https://example.com/jobs-61")),
    ).toBe(false);
  });
  it("isLeadsAdminAuthorized matrix 61", () => {
    expect(
      isLeadsAdminAuthorized(new Request("https://example.com/leads-61")),
    ).toBe(false);
  });
  it("getAdminTokens matrix 61", () => {
    expect(Array.isArray(getAdminTokens())).toBe(true);
  });
  it("isAdminAuthorized matrix 62", () => {
    const req = new Request("https://example.com/api/admin-62");
    expect(isAdminAuthorized(req)).toBe(false);
  });
  it("isJobsAdminAuthorized matrix 62", () => {
    expect(
      isJobsAdminAuthorized(new Request("https://example.com/jobs-62")),
    ).toBe(false);
  });
  it("isLeadsAdminAuthorized matrix 62", () => {
    expect(
      isLeadsAdminAuthorized(new Request("https://example.com/leads-62")),
    ).toBe(false);
  });
  it("getAdminTokens matrix 62", () => {
    expect(Array.isArray(getAdminTokens())).toBe(true);
  });
  it("isAdminAuthorized matrix 63", () => {
    const req = new Request("https://example.com/api/admin-63");
    expect(isAdminAuthorized(req)).toBe(false);
  });
  it("isJobsAdminAuthorized matrix 63", () => {
    expect(
      isJobsAdminAuthorized(new Request("https://example.com/jobs-63")),
    ).toBe(false);
  });
  it("isLeadsAdminAuthorized matrix 63", () => {
    expect(
      isLeadsAdminAuthorized(new Request("https://example.com/leads-63")),
    ).toBe(false);
  });
  it("getAdminTokens matrix 63", () => {
    expect(Array.isArray(getAdminTokens())).toBe(true);
  });
  it("isAdminAuthorized matrix 64", () => {
    const req = new Request("https://example.com/api/admin-64");
    expect(isAdminAuthorized(req)).toBe(false);
  });
  it("isJobsAdminAuthorized matrix 64", () => {
    expect(
      isJobsAdminAuthorized(new Request("https://example.com/jobs-64")),
    ).toBe(false);
  });
  it("isLeadsAdminAuthorized matrix 64", () => {
    expect(
      isLeadsAdminAuthorized(new Request("https://example.com/leads-64")),
    ).toBe(false);
  });
  it("getAdminTokens matrix 64", () => {
    expect(Array.isArray(getAdminTokens())).toBe(true);
  });
  it("isAdminAuthorized matrix 65", () => {
    const req = new Request("https://example.com/api/admin-65");
    expect(isAdminAuthorized(req)).toBe(false);
  });
  it("isJobsAdminAuthorized matrix 65", () => {
    expect(
      isJobsAdminAuthorized(new Request("https://example.com/jobs-65")),
    ).toBe(false);
  });
  it("isLeadsAdminAuthorized matrix 65", () => {
    expect(
      isLeadsAdminAuthorized(new Request("https://example.com/leads-65")),
    ).toBe(false);
  });
  it("getAdminTokens matrix 65", () => {
    expect(Array.isArray(getAdminTokens())).toBe(true);
  });
  it("isAdminAuthorized matrix 66", () => {
    const req = new Request("https://example.com/api/admin-66");
    expect(isAdminAuthorized(req)).toBe(false);
  });
  it("isJobsAdminAuthorized matrix 66", () => {
    expect(
      isJobsAdminAuthorized(new Request("https://example.com/jobs-66")),
    ).toBe(false);
  });
  it("isLeadsAdminAuthorized matrix 66", () => {
    expect(
      isLeadsAdminAuthorized(new Request("https://example.com/leads-66")),
    ).toBe(false);
  });
  it("getAdminTokens matrix 66", () => {
    expect(Array.isArray(getAdminTokens())).toBe(true);
  });
  it("isAdminAuthorized matrix 67", () => {
    const req = new Request("https://example.com/api/admin-67");
    expect(isAdminAuthorized(req)).toBe(false);
  });
  it("isJobsAdminAuthorized matrix 67", () => {
    expect(
      isJobsAdminAuthorized(new Request("https://example.com/jobs-67")),
    ).toBe(false);
  });
  it("isLeadsAdminAuthorized matrix 67", () => {
    expect(
      isLeadsAdminAuthorized(new Request("https://example.com/leads-67")),
    ).toBe(false);
  });
  it("getAdminTokens matrix 67", () => {
    expect(Array.isArray(getAdminTokens())).toBe(true);
  });
  it("isAdminAuthorized matrix 68", () => {
    const req = new Request("https://example.com/api/admin-68");
    expect(isAdminAuthorized(req)).toBe(false);
  });
  it("isJobsAdminAuthorized matrix 68", () => {
    expect(
      isJobsAdminAuthorized(new Request("https://example.com/jobs-68")),
    ).toBe(false);
  });
  it("isLeadsAdminAuthorized matrix 68", () => {
    expect(
      isLeadsAdminAuthorized(new Request("https://example.com/leads-68")),
    ).toBe(false);
  });
  it("getAdminTokens matrix 68", () => {
    expect(Array.isArray(getAdminTokens())).toBe(true);
  });
  it("isAdminAuthorized matrix 69", () => {
    const req = new Request("https://example.com/api/admin-69");
    expect(isAdminAuthorized(req)).toBe(false);
  });
  it("isJobsAdminAuthorized matrix 69", () => {
    expect(
      isJobsAdminAuthorized(new Request("https://example.com/jobs-69")),
    ).toBe(false);
  });
  it("isLeadsAdminAuthorized matrix 69", () => {
    expect(
      isLeadsAdminAuthorized(new Request("https://example.com/leads-69")),
    ).toBe(false);
  });
  it("getAdminTokens matrix 69", () => {
    expect(Array.isArray(getAdminTokens())).toBe(true);
  });
  it("isAdminAuthorized matrix 70", () => {
    const req = new Request("https://example.com/api/admin-70");
    expect(isAdminAuthorized(req)).toBe(false);
  });
  it("isJobsAdminAuthorized matrix 70", () => {
    expect(
      isJobsAdminAuthorized(new Request("https://example.com/jobs-70")),
    ).toBe(false);
  });
  it("isLeadsAdminAuthorized matrix 70", () => {
    expect(
      isLeadsAdminAuthorized(new Request("https://example.com/leads-70")),
    ).toBe(false);
  });
  it("getAdminTokens matrix 70", () => {
    expect(Array.isArray(getAdminTokens())).toBe(true);
  });
  it("isAdminAuthorized matrix 71", () => {
    const req = new Request("https://example.com/api/admin-71");
    expect(isAdminAuthorized(req)).toBe(false);
  });
  it("isJobsAdminAuthorized matrix 71", () => {
    expect(
      isJobsAdminAuthorized(new Request("https://example.com/jobs-71")),
    ).toBe(false);
  });
  it("isLeadsAdminAuthorized matrix 71", () => {
    expect(
      isLeadsAdminAuthorized(new Request("https://example.com/leads-71")),
    ).toBe(false);
  });
  it("getAdminTokens matrix 71", () => {
    expect(Array.isArray(getAdminTokens())).toBe(true);
  });
  it("isAdminAuthorized matrix 72", () => {
    const req = new Request("https://example.com/api/admin-72");
    expect(isAdminAuthorized(req)).toBe(false);
  });
  it("isJobsAdminAuthorized matrix 72", () => {
    expect(
      isJobsAdminAuthorized(new Request("https://example.com/jobs-72")),
    ).toBe(false);
  });
  it("isLeadsAdminAuthorized matrix 72", () => {
    expect(
      isLeadsAdminAuthorized(new Request("https://example.com/leads-72")),
    ).toBe(false);
  });
  it("getAdminTokens matrix 72", () => {
    expect(Array.isArray(getAdminTokens())).toBe(true);
  });
  it("isAdminAuthorized matrix 73", () => {
    const req = new Request("https://example.com/api/admin-73");
    expect(isAdminAuthorized(req)).toBe(false);
  });
  it("isJobsAdminAuthorized matrix 73", () => {
    expect(
      isJobsAdminAuthorized(new Request("https://example.com/jobs-73")),
    ).toBe(false);
  });
  it("isLeadsAdminAuthorized matrix 73", () => {
    expect(
      isLeadsAdminAuthorized(new Request("https://example.com/leads-73")),
    ).toBe(false);
  });
  it("getAdminTokens matrix 73", () => {
    expect(Array.isArray(getAdminTokens())).toBe(true);
  });
  it("isAdminAuthorized matrix 74", () => {
    const req = new Request("https://example.com/api/admin-74");
    expect(isAdminAuthorized(req)).toBe(false);
  });
  it("isJobsAdminAuthorized matrix 74", () => {
    expect(
      isJobsAdminAuthorized(new Request("https://example.com/jobs-74")),
    ).toBe(false);
  });
  it("isLeadsAdminAuthorized matrix 74", () => {
    expect(
      isLeadsAdminAuthorized(new Request("https://example.com/leads-74")),
    ).toBe(false);
  });
  it("getAdminTokens matrix 74", () => {
    expect(Array.isArray(getAdminTokens())).toBe(true);
  });
  it("isAdminAuthorized matrix 75", () => {
    const req = new Request("https://example.com/api/admin-75");
    expect(isAdminAuthorized(req)).toBe(false);
  });
  it("isJobsAdminAuthorized matrix 75", () => {
    expect(
      isJobsAdminAuthorized(new Request("https://example.com/jobs-75")),
    ).toBe(false);
  });
  it("isLeadsAdminAuthorized matrix 75", () => {
    expect(
      isLeadsAdminAuthorized(new Request("https://example.com/leads-75")),
    ).toBe(false);
  });
  it("getAdminTokens matrix 75", () => {
    expect(Array.isArray(getAdminTokens())).toBe(true);
  });
  it("isAdminAuthorized matrix 76", () => {
    const req = new Request("https://example.com/api/admin-76");
    expect(isAdminAuthorized(req)).toBe(false);
  });
  it("isJobsAdminAuthorized matrix 76", () => {
    expect(
      isJobsAdminAuthorized(new Request("https://example.com/jobs-76")),
    ).toBe(false);
  });
  it("isLeadsAdminAuthorized matrix 76", () => {
    expect(
      isLeadsAdminAuthorized(new Request("https://example.com/leads-76")),
    ).toBe(false);
  });
  it("getAdminTokens matrix 76", () => {
    expect(Array.isArray(getAdminTokens())).toBe(true);
  });
  it("isAdminAuthorized matrix 77", () => {
    const req = new Request("https://example.com/api/admin-77");
    expect(isAdminAuthorized(req)).toBe(false);
  });
  it("isJobsAdminAuthorized matrix 77", () => {
    expect(
      isJobsAdminAuthorized(new Request("https://example.com/jobs-77")),
    ).toBe(false);
  });
  it("isLeadsAdminAuthorized matrix 77", () => {
    expect(
      isLeadsAdminAuthorized(new Request("https://example.com/leads-77")),
    ).toBe(false);
  });
  it("getAdminTokens matrix 77", () => {
    expect(Array.isArray(getAdminTokens())).toBe(true);
  });
  it("isAdminAuthorized matrix 78", () => {
    const req = new Request("https://example.com/api/admin-78");
    expect(isAdminAuthorized(req)).toBe(false);
  });
  it("isJobsAdminAuthorized matrix 78", () => {
    expect(
      isJobsAdminAuthorized(new Request("https://example.com/jobs-78")),
    ).toBe(false);
  });
  it("isLeadsAdminAuthorized matrix 78", () => {
    expect(
      isLeadsAdminAuthorized(new Request("https://example.com/leads-78")),
    ).toBe(false);
  });
  it("getAdminTokens matrix 78", () => {
    expect(Array.isArray(getAdminTokens())).toBe(true);
  });
  it("isAdminAuthorized matrix 79", () => {
    const req = new Request("https://example.com/api/admin-79");
    expect(isAdminAuthorized(req)).toBe(false);
  });
  it("isJobsAdminAuthorized matrix 79", () => {
    expect(
      isJobsAdminAuthorized(new Request("https://example.com/jobs-79")),
    ).toBe(false);
  });
  it("isLeadsAdminAuthorized matrix 79", () => {
    expect(
      isLeadsAdminAuthorized(new Request("https://example.com/leads-79")),
    ).toBe(false);
  });
  it("getAdminTokens matrix 79", () => {
    expect(Array.isArray(getAdminTokens())).toBe(true);
  });
  it("isAdminAuthorized matrix 80", () => {
    const req = new Request("https://example.com/api/admin-80");
    expect(isAdminAuthorized(req)).toBe(false);
  });
  it("isJobsAdminAuthorized matrix 80", () => {
    expect(
      isJobsAdminAuthorized(new Request("https://example.com/jobs-80")),
    ).toBe(false);
  });
  it("isLeadsAdminAuthorized matrix 80", () => {
    expect(
      isLeadsAdminAuthorized(new Request("https://example.com/leads-80")),
    ).toBe(false);
  });
  it("getAdminTokens matrix 80", () => {
    expect(Array.isArray(getAdminTokens())).toBe(true);
  });
  it("isAdminAuthorized matrix 81", () => {
    const req = new Request("https://example.com/api/admin-81");
    expect(isAdminAuthorized(req)).toBe(false);
  });
  it("isJobsAdminAuthorized matrix 81", () => {
    expect(
      isJobsAdminAuthorized(new Request("https://example.com/jobs-81")),
    ).toBe(false);
  });
  it("isLeadsAdminAuthorized matrix 81", () => {
    expect(
      isLeadsAdminAuthorized(new Request("https://example.com/leads-81")),
    ).toBe(false);
  });
  it("getAdminTokens matrix 81", () => {
    expect(Array.isArray(getAdminTokens())).toBe(true);
  });
  it("isAdminAuthorized matrix 82", () => {
    const req = new Request("https://example.com/api/admin-82");
    expect(isAdminAuthorized(req)).toBe(false);
  });
  it("isJobsAdminAuthorized matrix 82", () => {
    expect(
      isJobsAdminAuthorized(new Request("https://example.com/jobs-82")),
    ).toBe(false);
  });
  it("isLeadsAdminAuthorized matrix 82", () => {
    expect(
      isLeadsAdminAuthorized(new Request("https://example.com/leads-82")),
    ).toBe(false);
  });
  it("getAdminTokens matrix 82", () => {
    expect(Array.isArray(getAdminTokens())).toBe(true);
  });
  it("isAdminAuthorized matrix 83", () => {
    const req = new Request("https://example.com/api/admin-83");
    expect(isAdminAuthorized(req)).toBe(false);
  });
  it("isJobsAdminAuthorized matrix 83", () => {
    expect(
      isJobsAdminAuthorized(new Request("https://example.com/jobs-83")),
    ).toBe(false);
  });
  it("isLeadsAdminAuthorized matrix 83", () => {
    expect(
      isLeadsAdminAuthorized(new Request("https://example.com/leads-83")),
    ).toBe(false);
  });
  it("getAdminTokens matrix 83", () => {
    expect(Array.isArray(getAdminTokens())).toBe(true);
  });
  it("isAdminAuthorized matrix 84", () => {
    const req = new Request("https://example.com/api/admin-84");
    expect(isAdminAuthorized(req)).toBe(false);
  });
  it("isJobsAdminAuthorized matrix 84", () => {
    expect(
      isJobsAdminAuthorized(new Request("https://example.com/jobs-84")),
    ).toBe(false);
  });
  it("isLeadsAdminAuthorized matrix 84", () => {
    expect(
      isLeadsAdminAuthorized(new Request("https://example.com/leads-84")),
    ).toBe(false);
  });
  it("getAdminTokens matrix 84", () => {
    expect(Array.isArray(getAdminTokens())).toBe(true);
  });
  it("isAdminAuthorized matrix 85", () => {
    const req = new Request("https://example.com/api/admin-85");
    expect(isAdminAuthorized(req)).toBe(false);
  });
  it("isJobsAdminAuthorized matrix 85", () => {
    expect(
      isJobsAdminAuthorized(new Request("https://example.com/jobs-85")),
    ).toBe(false);
  });
  it("isLeadsAdminAuthorized matrix 85", () => {
    expect(
      isLeadsAdminAuthorized(new Request("https://example.com/leads-85")),
    ).toBe(false);
  });
  it("getAdminTokens matrix 85", () => {
    expect(Array.isArray(getAdminTokens())).toBe(true);
  });
  it("isAdminAuthorized matrix 86", () => {
    const req = new Request("https://example.com/api/admin-86");
    expect(isAdminAuthorized(req)).toBe(false);
  });
  it("isJobsAdminAuthorized matrix 86", () => {
    expect(
      isJobsAdminAuthorized(new Request("https://example.com/jobs-86")),
    ).toBe(false);
  });
  it("isLeadsAdminAuthorized matrix 86", () => {
    expect(
      isLeadsAdminAuthorized(new Request("https://example.com/leads-86")),
    ).toBe(false);
  });
  it("getAdminTokens matrix 86", () => {
    expect(Array.isArray(getAdminTokens())).toBe(true);
  });
  it("isAdminAuthorized matrix 87", () => {
    const req = new Request("https://example.com/api/admin-87");
    expect(isAdminAuthorized(req)).toBe(false);
  });
  it("isJobsAdminAuthorized matrix 87", () => {
    expect(
      isJobsAdminAuthorized(new Request("https://example.com/jobs-87")),
    ).toBe(false);
  });
  it("isLeadsAdminAuthorized matrix 87", () => {
    expect(
      isLeadsAdminAuthorized(new Request("https://example.com/leads-87")),
    ).toBe(false);
  });
  it("getAdminTokens matrix 87", () => {
    expect(Array.isArray(getAdminTokens())).toBe(true);
  });
  it("isAdminAuthorized matrix 88", () => {
    const req = new Request("https://example.com/api/admin-88");
    expect(isAdminAuthorized(req)).toBe(false);
  });
  it("isJobsAdminAuthorized matrix 88", () => {
    expect(
      isJobsAdminAuthorized(new Request("https://example.com/jobs-88")),
    ).toBe(false);
  });
  it("isLeadsAdminAuthorized matrix 88", () => {
    expect(
      isLeadsAdminAuthorized(new Request("https://example.com/leads-88")),
    ).toBe(false);
  });
  it("getAdminTokens matrix 88", () => {
    expect(Array.isArray(getAdminTokens())).toBe(true);
  });
  it("isAdminAuthorized matrix 89", () => {
    const req = new Request("https://example.com/api/admin-89");
    expect(isAdminAuthorized(req)).toBe(false);
  });
  it("isJobsAdminAuthorized matrix 89", () => {
    expect(
      isJobsAdminAuthorized(new Request("https://example.com/jobs-89")),
    ).toBe(false);
  });
  it("isLeadsAdminAuthorized matrix 89", () => {
    expect(
      isLeadsAdminAuthorized(new Request("https://example.com/leads-89")),
    ).toBe(false);
  });
  it("getAdminTokens matrix 89", () => {
    expect(Array.isArray(getAdminTokens())).toBe(true);
  });
  it("isAdminAuthorized matrix 90", () => {
    const req = new Request("https://example.com/api/admin-90");
    expect(isAdminAuthorized(req)).toBe(false);
  });
  it("isJobsAdminAuthorized matrix 90", () => {
    expect(
      isJobsAdminAuthorized(new Request("https://example.com/jobs-90")),
    ).toBe(false);
  });
  it("isLeadsAdminAuthorized matrix 90", () => {
    expect(
      isLeadsAdminAuthorized(new Request("https://example.com/leads-90")),
    ).toBe(false);
  });
  it("getAdminTokens matrix 90", () => {
    expect(Array.isArray(getAdminTokens())).toBe(true);
  });
  it("isAdminAuthorized matrix 91", () => {
    const req = new Request("https://example.com/api/admin-91");
    expect(isAdminAuthorized(req)).toBe(false);
  });
  it("isJobsAdminAuthorized matrix 91", () => {
    expect(
      isJobsAdminAuthorized(new Request("https://example.com/jobs-91")),
    ).toBe(false);
  });
  it("isLeadsAdminAuthorized matrix 91", () => {
    expect(
      isLeadsAdminAuthorized(new Request("https://example.com/leads-91")),
    ).toBe(false);
  });
  it("getAdminTokens matrix 91", () => {
    expect(Array.isArray(getAdminTokens())).toBe(true);
  });
  it("isAdminAuthorized matrix 92", () => {
    const req = new Request("https://example.com/api/admin-92");
    expect(isAdminAuthorized(req)).toBe(false);
  });
  it("isJobsAdminAuthorized matrix 92", () => {
    expect(
      isJobsAdminAuthorized(new Request("https://example.com/jobs-92")),
    ).toBe(false);
  });
  it("isLeadsAdminAuthorized matrix 92", () => {
    expect(
      isLeadsAdminAuthorized(new Request("https://example.com/leads-92")),
    ).toBe(false);
  });
  it("getAdminTokens matrix 92", () => {
    expect(Array.isArray(getAdminTokens())).toBe(true);
  });
  it("isAdminAuthorized matrix 93", () => {
    const req = new Request("https://example.com/api/admin-93");
    expect(isAdminAuthorized(req)).toBe(false);
  });
  it("isJobsAdminAuthorized matrix 93", () => {
    expect(
      isJobsAdminAuthorized(new Request("https://example.com/jobs-93")),
    ).toBe(false);
  });
  it("isLeadsAdminAuthorized matrix 93", () => {
    expect(
      isLeadsAdminAuthorized(new Request("https://example.com/leads-93")),
    ).toBe(false);
  });
  it("getAdminTokens matrix 93", () => {
    expect(Array.isArray(getAdminTokens())).toBe(true);
  });
  it("isAdminAuthorized matrix 94", () => {
    const req = new Request("https://example.com/api/admin-94");
    expect(isAdminAuthorized(req)).toBe(false);
  });
  it("isJobsAdminAuthorized matrix 94", () => {
    expect(
      isJobsAdminAuthorized(new Request("https://example.com/jobs-94")),
    ).toBe(false);
  });
  it("isLeadsAdminAuthorized matrix 94", () => {
    expect(
      isLeadsAdminAuthorized(new Request("https://example.com/leads-94")),
    ).toBe(false);
  });
  it("getAdminTokens matrix 94", () => {
    expect(Array.isArray(getAdminTokens())).toBe(true);
  });
  it("isAdminAuthorized matrix 95", () => {
    const req = new Request("https://example.com/api/admin-95");
    expect(isAdminAuthorized(req)).toBe(false);
  });
  it("isJobsAdminAuthorized matrix 95", () => {
    expect(
      isJobsAdminAuthorized(new Request("https://example.com/jobs-95")),
    ).toBe(false);
  });
  it("isLeadsAdminAuthorized matrix 95", () => {
    expect(
      isLeadsAdminAuthorized(new Request("https://example.com/leads-95")),
    ).toBe(false);
  });
  it("getAdminTokens matrix 95", () => {
    expect(Array.isArray(getAdminTokens())).toBe(true);
  });
  it("isAdminAuthorized matrix 96", () => {
    const req = new Request("https://example.com/api/admin-96");
    expect(isAdminAuthorized(req)).toBe(false);
  });
  it("isJobsAdminAuthorized matrix 96", () => {
    expect(
      isJobsAdminAuthorized(new Request("https://example.com/jobs-96")),
    ).toBe(false);
  });
  it("isLeadsAdminAuthorized matrix 96", () => {
    expect(
      isLeadsAdminAuthorized(new Request("https://example.com/leads-96")),
    ).toBe(false);
  });
  it("getAdminTokens matrix 96", () => {
    expect(Array.isArray(getAdminTokens())).toBe(true);
  });
  it("isAdminAuthorized matrix 97", () => {
    const req = new Request("https://example.com/api/admin-97");
    expect(isAdminAuthorized(req)).toBe(false);
  });
  it("isJobsAdminAuthorized matrix 97", () => {
    expect(
      isJobsAdminAuthorized(new Request("https://example.com/jobs-97")),
    ).toBe(false);
  });
  it("isLeadsAdminAuthorized matrix 97", () => {
    expect(
      isLeadsAdminAuthorized(new Request("https://example.com/leads-97")),
    ).toBe(false);
  });
  it("getAdminTokens matrix 97", () => {
    expect(Array.isArray(getAdminTokens())).toBe(true);
  });
  it("isAdminAuthorized matrix 98", () => {
    const req = new Request("https://example.com/api/admin-98");
    expect(isAdminAuthorized(req)).toBe(false);
  });
  it("isJobsAdminAuthorized matrix 98", () => {
    expect(
      isJobsAdminAuthorized(new Request("https://example.com/jobs-98")),
    ).toBe(false);
  });
  it("isLeadsAdminAuthorized matrix 98", () => {
    expect(
      isLeadsAdminAuthorized(new Request("https://example.com/leads-98")),
    ).toBe(false);
  });
  it("getAdminTokens matrix 98", () => {
    expect(Array.isArray(getAdminTokens())).toBe(true);
  });
  it("isAdminAuthorized matrix 99", () => {
    const req = new Request("https://example.com/api/admin-99");
    expect(isAdminAuthorized(req)).toBe(false);
  });
  it("isJobsAdminAuthorized matrix 99", () => {
    expect(
      isJobsAdminAuthorized(new Request("https://example.com/jobs-99")),
    ).toBe(false);
  });
  it("isLeadsAdminAuthorized matrix 99", () => {
    expect(
      isLeadsAdminAuthorized(new Request("https://example.com/leads-99")),
    ).toBe(false);
  });
  it("getAdminTokens matrix 99", () => {
    expect(Array.isArray(getAdminTokens())).toBe(true);
  });
});
