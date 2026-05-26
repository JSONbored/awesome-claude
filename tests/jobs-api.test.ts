import { beforeEach, describe, expect, it, vi } from "vitest";

import type { JobListing } from "../apps/web/src/lib/jobs";

const jobsMock = vi.hoisted(() => ({
  value: [] as JobListing[],
}));

vi.mock("@opennextjs/cloudflare", () => ({
  getCloudflareContext: () => ({ env: {} }),
}));

vi.mock("@/lib/jobs", async () => {
  const actual =
    await vi.importActual<typeof import("@/lib/jobs")>("@/lib/jobs");
  return {
    ...actual,
    getJobs: () => Promise.resolve(jobsMock.value),
  };
});

function makeJob(overrides: Partial<JobListing> = {}): JobListing {
  return {
    slug: "fixture-job",
    title: "Fixture Engineer",
    company: "Fixture Co",
    location: "Remote",
    description: "Build fixture-grade products.",
    applyUrl: "https://example.com/apply/fixture",
    featured: false,
    tier: "standard",
    status: "active",
    source: "manual",
    sourceKind: "employer_submitted",
    sourceUrl: "https://example.com/apply/fixture",
    postedAt: "2026-05-20T00:00:00.000Z",
    firstSeenAt: "2026-05-20T00:00:00.000Z",
    isRemote: true,
    isWorldwide: false,
    claimedEmployer: false,
    ...overrides,
  };
}

function request(query: string) {
  return new Request(`https://heyclau.de/api/jobs${query}`, {
    headers: { origin: "https://heyclau.de" },
  });
}

describe("/api/jobs", () => {
  beforeEach(() => {
    vi.resetModules();
    jobsMock.value = [
      makeJob({
        slug: "remote-eu-compensated",
        title: "Senior Platform Engineer",
        company: "Aether",
        location: "Remote (EU)",
        type: "Full-time",
        compensation: "€90k–€130k",
        sourceKind: "official_ats",
        claimedEmployer: true,
        postedAt: "2026-05-22T00:00:00.000Z",
        firstSeenAt: "2026-05-22T00:00:00.000Z",
        isRemote: true,
      }),
      makeJob({
        slug: "onsite-us-no-comp",
        title: "Staff Frontend Engineer",
        company: "Borealis",
        location: "New York City, NY, US",
        type: "Full-time",
        compensation: undefined,
        sourceKind: "employer_careers",
        claimedEmployer: false,
        postedAt: "2026-04-30T00:00:00.000Z",
        firstSeenAt: "2026-04-30T00:00:00.000Z",
        isRemote: false,
      }),
      makeJob({
        slug: "remote-worldwide-contract",
        title: "Contract MCP Engineer",
        company: "Cirrus",
        location: "Worldwide",
        type: "Contract",
        compensation: "$120/hr",
        sourceKind: "employer_submitted",
        claimedEmployer: false,
        postedAt: "2026-03-10T00:00:00.000Z",
        firstSeenAt: "2026-03-10T00:00:00.000Z",
        isRemote: true,
        isWorldwide: true,
      }),
    ];
  });

  it("returns every active job with pagination metadata when no filters are applied", async () => {
    const { GET } = await import("../apps/web/src/app/api/jobs/route");
    const response = await GET(request(""));

    expect(response.status).toBe(200);
    const body = await response.json();
    expect(body).toMatchObject({
      kind: "jobs-index",
      count: 3,
      total: 3,
      totalAvailable: 3,
      limit: 100,
      offset: 0,
      nextOffset: null,
    });
    expect(body.entries).toHaveLength(3);
  });

  it("combines region, compensation, sourceKind, and claimedEmployer filters", async () => {
    const { GET } = await import("../apps/web/src/app/api/jobs/route");
    const response = await GET(
      request(
        "?location=eu&compensation=true&sourceKind=official_ats&claimedEmployer=true",
      ),
    );

    expect(response.status).toBe(200);
    const body = await response.json();
    expect(body).toMatchObject({
      count: 1,
      total: 1,
      filters: {
        location: "eu",
        sourceKind: "official_ats",
        compensation: "true",
        claimedEmployer: "true",
      },
    });
    expect(body.entries[0].slug).toBe("remote-eu-compensated");
  });

  it("falls back to firstSeenAt when postedAt is missing for the postedAfter cursor", async () => {
    jobsMock.value = [
      makeJob({
        slug: "first-seen-only",
        title: "Edge case engineer",
        postedAt: undefined,
        firstSeenAt: "2026-05-22T00:00:00.000Z",
      }),
      makeJob({
        slug: "old-first-seen-only",
        title: "Older engineer",
        postedAt: undefined,
        firstSeenAt: "2025-12-01T00:00:00.000Z",
      }),
    ];

    const { GET } = await import("../apps/web/src/app/api/jobs/route");
    const response = await GET(
      request("?postedAfter=2026-05-01T00:00:00.000Z"),
    );

    const body = await response.json();
    expect(body.count).toBe(1);
    expect(body.entries.map((job: { slug: string }) => job.slug)).toEqual([
      "first-seen-only",
    ]);
  });

  it("applies postedAfter as an inclusive date cursor", async () => {
    const { GET } = await import("../apps/web/src/app/api/jobs/route");
    const response = await GET(
      request("?postedAfter=2026-05-01T00:00:00.000Z"),
    );

    const body = await response.json();
    expect(body.count).toBe(1);
    expect(body.entries.map((job: { slug: string }) => job.slug)).toEqual([
      "remote-eu-compensated",
    ]);
  });

  it("filters by job type via case-insensitive substring", async () => {
    const { GET } = await import("../apps/web/src/app/api/jobs/route");
    const response = await GET(request("?type=contract"));

    const body = await response.json();
    expect(body.count).toBe(1);
    expect(body.entries[0].slug).toBe("remote-worldwide-contract");
  });

  it("returns an empty entries array but valid metadata when filters match nothing", async () => {
    const { GET } = await import("../apps/web/src/app/api/jobs/route");
    const response = await GET(
      request(
        "?location=mars&compensation=true&sourceKind=official_ats&claimedEmployer=true",
      ),
    );

    expect(response.status).toBe(200);
    const body = await response.json();
    expect(body).toMatchObject({
      count: 0,
      total: 0,
      totalAvailable: 3,
      offset: 0,
      nextOffset: null,
    });
    expect(body.entries).toEqual([]);
  });

  it("paginates with offset/limit and advertises nextOffset only when more results remain", async () => {
    const { GET } = await import("../apps/web/src/app/api/jobs/route");
    const first = await GET(request("?limit=2&offset=0"));
    const firstBody = await first.json();
    expect(firstBody).toMatchObject({
      count: 2,
      total: 3,
      limit: 2,
      offset: 0,
      nextOffset: 2,
    });

    const second = await GET(request("?limit=2&offset=2"));
    const secondBody = await second.json();
    expect(secondBody).toMatchObject({
      count: 1,
      total: 3,
      limit: 2,
      offset: 2,
      nextOffset: null,
    });
  });

  it("rejects an invalid postedAfter value", async () => {
    const { GET } = await import("../apps/web/src/app/api/jobs/route");
    const response = await GET(request("?postedAfter=not-a-date"));
    expect(response.status).toBe(400);
  });
});
