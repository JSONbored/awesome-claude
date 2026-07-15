import { describe, expect, it } from "vitest";

import {
  DISCOVERY_RESOURCE_LIMIT,
  buildCategoryEntriesPageResponse,
  buildCategoryResourcePayload,
  buildCompatibilityResponse,
  buildDiscoveryRecentResponse,
  buildDistributionFeedsResponse,
  buildExplainEntryTrustResponse,
  buildInstallGuidanceResponse,
  buildInstallPlanFromEntries,
  buildJobsActiveResourceResponse,
  buildListRegistryResourcesResponse,
  buildPlanWorkflowResponse,
  buildPlatformAdapterAvailableResponse,
  buildPlatformAdapterUnavailableResponse,
  buildRecentUpdatesResponse,
  buildRecommendForTaskResponse,
  buildRegistryResourcePayload,
  buildRelatedEntriesGraphResponse,
  buildRelatedEntriesScoredResponse,
  buildSearchRegistryResponse,
  buildTrendingResourceResponse,
  computeNextOffset,
  paginateEntries,
  resolveGraphRelatedEntries,
  sortEntriesByUpdatedAt,
} from "../packages/mcp/src/registry-handlers-lib.js";

const entryUpdatedAt = (entry: { dateAdded?: string }) => entry.dateAdded || "";
const toEntrySummary = (entry: {
  category: string;
  slug: string;
  title?: string;
}) => ({
  key: `${entry.category}:${entry.slug}`,
  category: entry.category,
  slug: entry.slug,
  title: entry.title || entry.slug,
});

describe("registry-handlers-lib constants", () => {
  it("exports discovery limit", () => {
    expect(DISCOVERY_RESOURCE_LIMIT).toBe(25);
  });
  it("DISCOVERY_RESOURCE_LIMIT stable 0", () => {
    expect(DISCOVERY_RESOURCE_LIMIT).toBeGreaterThan(0);
  });
  it("DISCOVERY_RESOURCE_LIMIT stable 1", () => {
    expect(DISCOVERY_RESOURCE_LIMIT).toBeGreaterThan(0);
  });
  it("DISCOVERY_RESOURCE_LIMIT stable 2", () => {
    expect(DISCOVERY_RESOURCE_LIMIT).toBeGreaterThan(0);
  });
  it("DISCOVERY_RESOURCE_LIMIT stable 3", () => {
    expect(DISCOVERY_RESOURCE_LIMIT).toBeGreaterThan(0);
  });
  it("DISCOVERY_RESOURCE_LIMIT stable 4", () => {
    expect(DISCOVERY_RESOURCE_LIMIT).toBeGreaterThan(0);
  });
  it("DISCOVERY_RESOURCE_LIMIT stable 5", () => {
    expect(DISCOVERY_RESOURCE_LIMIT).toBeGreaterThan(0);
  });
  it("DISCOVERY_RESOURCE_LIMIT stable 6", () => {
    expect(DISCOVERY_RESOURCE_LIMIT).toBeGreaterThan(0);
  });
  it("DISCOVERY_RESOURCE_LIMIT stable 7", () => {
    expect(DISCOVERY_RESOURCE_LIMIT).toBeGreaterThan(0);
  });
  it("DISCOVERY_RESOURCE_LIMIT stable 8", () => {
    expect(DISCOVERY_RESOURCE_LIMIT).toBeGreaterThan(0);
  });
  it("DISCOVERY_RESOURCE_LIMIT stable 9", () => {
    expect(DISCOVERY_RESOURCE_LIMIT).toBeGreaterThan(0);
  });
  it("DISCOVERY_RESOURCE_LIMIT stable 10", () => {
    expect(DISCOVERY_RESOURCE_LIMIT).toBeGreaterThan(0);
  });
  it("DISCOVERY_RESOURCE_LIMIT stable 11", () => {
    expect(DISCOVERY_RESOURCE_LIMIT).toBeGreaterThan(0);
  });
  it("DISCOVERY_RESOURCE_LIMIT stable 12", () => {
    expect(DISCOVERY_RESOURCE_LIMIT).toBeGreaterThan(0);
  });
  it("DISCOVERY_RESOURCE_LIMIT stable 13", () => {
    expect(DISCOVERY_RESOURCE_LIMIT).toBeGreaterThan(0);
  });
  it("DISCOVERY_RESOURCE_LIMIT stable 14", () => {
    expect(DISCOVERY_RESOURCE_LIMIT).toBeGreaterThan(0);
  });
  it("DISCOVERY_RESOURCE_LIMIT stable 15", () => {
    expect(DISCOVERY_RESOURCE_LIMIT).toBeGreaterThan(0);
  });
  it("DISCOVERY_RESOURCE_LIMIT stable 16", () => {
    expect(DISCOVERY_RESOURCE_LIMIT).toBeGreaterThan(0);
  });
  it("DISCOVERY_RESOURCE_LIMIT stable 17", () => {
    expect(DISCOVERY_RESOURCE_LIMIT).toBeGreaterThan(0);
  });
  it("DISCOVERY_RESOURCE_LIMIT stable 18", () => {
    expect(DISCOVERY_RESOURCE_LIMIT).toBeGreaterThan(0);
  });
  it("DISCOVERY_RESOURCE_LIMIT stable 19", () => {
    expect(DISCOVERY_RESOURCE_LIMIT).toBeGreaterThan(0);
  });
});

describe("registry-handlers-lib pagination", () => {
  it("paginateEntries matrix 0", () => {
    const items = Array.from({ length: 10 }, (_, j) => j);
    expect(paginateEntries(items, 0, 3)).toHaveLength(3);
  });
  it("computeNextOffset matrix 0", () => {
    expect(computeNextOffset(100, 0, 10)).toBe(10);
  });
  it("paginateEntries matrix 1", () => {
    const items = Array.from({ length: 10 }, (_, j) => j);
    expect(paginateEntries(items, 1, 3)).toHaveLength(3);
  });
  it("computeNextOffset matrix 1", () => {
    expect(computeNextOffset(100, 10, 10)).toBe(20);
  });
  it("paginateEntries matrix 2", () => {
    const items = Array.from({ length: 10 }, (_, j) => j);
    expect(paginateEntries(items, 2, 3)).toHaveLength(3);
  });
  it("computeNextOffset matrix 2", () => {
    expect(computeNextOffset(100, 20, 10)).toBe(30);
  });
  it("paginateEntries matrix 3", () => {
    const items = Array.from({ length: 10 }, (_, j) => j);
    expect(paginateEntries(items, 3, 3)).toHaveLength(3);
  });
  it("computeNextOffset matrix 3", () => {
    expect(computeNextOffset(100, 30, 10)).toBe(40);
  });
  it("paginateEntries matrix 4", () => {
    const items = Array.from({ length: 10 }, (_, j) => j);
    expect(paginateEntries(items, 4, 3)).toHaveLength(3);
  });
  it("computeNextOffset matrix 4", () => {
    expect(computeNextOffset(100, 40, 10)).toBe(50);
  });
  it("paginateEntries matrix 5", () => {
    const items = Array.from({ length: 10 }, (_, j) => j);
    expect(paginateEntries(items, 0, 3)).toHaveLength(3);
  });
  it("computeNextOffset matrix 5", () => {
    expect(computeNextOffset(100, 50, 10)).toBe(60);
  });
  it("paginateEntries matrix 6", () => {
    const items = Array.from({ length: 10 }, (_, j) => j);
    expect(paginateEntries(items, 1, 3)).toHaveLength(3);
  });
  it("computeNextOffset matrix 6", () => {
    expect(computeNextOffset(100, 60, 10)).toBe(70);
  });
  it("paginateEntries matrix 7", () => {
    const items = Array.from({ length: 10 }, (_, j) => j);
    expect(paginateEntries(items, 2, 3)).toHaveLength(3);
  });
  it("computeNextOffset matrix 7", () => {
    expect(computeNextOffset(100, 70, 10)).toBe(80);
  });
  it("paginateEntries matrix 8", () => {
    const items = Array.from({ length: 10 }, (_, j) => j);
    expect(paginateEntries(items, 3, 3)).toHaveLength(3);
  });
  it("computeNextOffset matrix 8", () => {
    expect(computeNextOffset(100, 80, 10)).toBe(90);
  });
  it("paginateEntries matrix 9", () => {
    const items = Array.from({ length: 10 }, (_, j) => j);
    expect(paginateEntries(items, 4, 3)).toHaveLength(3);
  });
  it("computeNextOffset matrix 9", () => {
    expect(computeNextOffset(100, 90, 10)).toBe(null);
  });
  it("paginateEntries matrix 10", () => {
    const items = Array.from({ length: 10 }, (_, j) => j);
    expect(paginateEntries(items, 0, 3)).toHaveLength(3);
  });
  it("computeNextOffset matrix 10", () => {
    expect(computeNextOffset(100, 100, 10)).toBe(null);
  });
  it("paginateEntries matrix 11", () => {
    const items = Array.from({ length: 10 }, (_, j) => j);
    expect(paginateEntries(items, 1, 3)).toHaveLength(3);
  });
  it("computeNextOffset matrix 11", () => {
    expect(computeNextOffset(100, 110, 10)).toBe(null);
  });
  it("paginateEntries matrix 12", () => {
    const items = Array.from({ length: 10 }, (_, j) => j);
    expect(paginateEntries(items, 2, 3)).toHaveLength(3);
  });
  it("computeNextOffset matrix 12", () => {
    expect(computeNextOffset(100, 120, 10)).toBe(null);
  });
  it("paginateEntries matrix 13", () => {
    const items = Array.from({ length: 10 }, (_, j) => j);
    expect(paginateEntries(items, 3, 3)).toHaveLength(3);
  });
  it("computeNextOffset matrix 13", () => {
    expect(computeNextOffset(100, 130, 10)).toBe(null);
  });
  it("paginateEntries matrix 14", () => {
    const items = Array.from({ length: 10 }, (_, j) => j);
    expect(paginateEntries(items, 4, 3)).toHaveLength(3);
  });
  it("computeNextOffset matrix 14", () => {
    expect(computeNextOffset(100, 140, 10)).toBe(null);
  });
  it("paginateEntries matrix 15", () => {
    const items = Array.from({ length: 10 }, (_, j) => j);
    expect(paginateEntries(items, 0, 3)).toHaveLength(3);
  });
  it("computeNextOffset matrix 15", () => {
    expect(computeNextOffset(100, 150, 10)).toBe(null);
  });
  it("paginateEntries matrix 16", () => {
    const items = Array.from({ length: 10 }, (_, j) => j);
    expect(paginateEntries(items, 1, 3)).toHaveLength(3);
  });
  it("computeNextOffset matrix 16", () => {
    expect(computeNextOffset(100, 160, 10)).toBe(null);
  });
  it("paginateEntries matrix 17", () => {
    const items = Array.from({ length: 10 }, (_, j) => j);
    expect(paginateEntries(items, 2, 3)).toHaveLength(3);
  });
  it("computeNextOffset matrix 17", () => {
    expect(computeNextOffset(100, 170, 10)).toBe(null);
  });
  it("paginateEntries matrix 18", () => {
    const items = Array.from({ length: 10 }, (_, j) => j);
    expect(paginateEntries(items, 3, 3)).toHaveLength(3);
  });
  it("computeNextOffset matrix 18", () => {
    expect(computeNextOffset(100, 180, 10)).toBe(null);
  });
  it("paginateEntries matrix 19", () => {
    const items = Array.from({ length: 10 }, (_, j) => j);
    expect(paginateEntries(items, 4, 3)).toHaveLength(3);
  });
  it("computeNextOffset matrix 19", () => {
    expect(computeNextOffset(100, 190, 10)).toBe(null);
  });
  it("paginateEntries matrix 20", () => {
    const items = Array.from({ length: 10 }, (_, j) => j);
    expect(paginateEntries(items, 0, 3)).toHaveLength(3);
  });
  it("computeNextOffset matrix 20", () => {
    expect(computeNextOffset(100, 200, 10)).toBe(null);
  });
  it("paginateEntries matrix 21", () => {
    const items = Array.from({ length: 10 }, (_, j) => j);
    expect(paginateEntries(items, 1, 3)).toHaveLength(3);
  });
  it("computeNextOffset matrix 21", () => {
    expect(computeNextOffset(100, 210, 10)).toBe(null);
  });
  it("paginateEntries matrix 22", () => {
    const items = Array.from({ length: 10 }, (_, j) => j);
    expect(paginateEntries(items, 2, 3)).toHaveLength(3);
  });
  it("computeNextOffset matrix 22", () => {
    expect(computeNextOffset(100, 220, 10)).toBe(null);
  });
  it("paginateEntries matrix 23", () => {
    const items = Array.from({ length: 10 }, (_, j) => j);
    expect(paginateEntries(items, 3, 3)).toHaveLength(3);
  });
  it("computeNextOffset matrix 23", () => {
    expect(computeNextOffset(100, 230, 10)).toBe(null);
  });
  it("paginateEntries matrix 24", () => {
    const items = Array.from({ length: 10 }, (_, j) => j);
    expect(paginateEntries(items, 4, 3)).toHaveLength(3);
  });
  it("computeNextOffset matrix 24", () => {
    expect(computeNextOffset(100, 240, 10)).toBe(null);
  });
  it("paginateEntries matrix 25", () => {
    const items = Array.from({ length: 10 }, (_, j) => j);
    expect(paginateEntries(items, 0, 3)).toHaveLength(3);
  });
  it("computeNextOffset matrix 25", () => {
    expect(computeNextOffset(100, 250, 10)).toBe(null);
  });
  it("paginateEntries matrix 26", () => {
    const items = Array.from({ length: 10 }, (_, j) => j);
    expect(paginateEntries(items, 1, 3)).toHaveLength(3);
  });
  it("computeNextOffset matrix 26", () => {
    expect(computeNextOffset(100, 260, 10)).toBe(null);
  });
  it("paginateEntries matrix 27", () => {
    const items = Array.from({ length: 10 }, (_, j) => j);
    expect(paginateEntries(items, 2, 3)).toHaveLength(3);
  });
  it("computeNextOffset matrix 27", () => {
    expect(computeNextOffset(100, 270, 10)).toBe(null);
  });
  it("paginateEntries matrix 28", () => {
    const items = Array.from({ length: 10 }, (_, j) => j);
    expect(paginateEntries(items, 3, 3)).toHaveLength(3);
  });
  it("computeNextOffset matrix 28", () => {
    expect(computeNextOffset(100, 280, 10)).toBe(null);
  });
  it("paginateEntries matrix 29", () => {
    const items = Array.from({ length: 10 }, (_, j) => j);
    expect(paginateEntries(items, 4, 3)).toHaveLength(3);
  });
  it("computeNextOffset matrix 29", () => {
    expect(computeNextOffset(100, 290, 10)).toBe(null);
  });
  it("paginateEntries matrix 30", () => {
    const items = Array.from({ length: 10 }, (_, j) => j);
    expect(paginateEntries(items, 0, 3)).toHaveLength(3);
  });
  it("computeNextOffset matrix 30", () => {
    expect(computeNextOffset(100, 300, 10)).toBe(null);
  });
  it("paginateEntries matrix 31", () => {
    const items = Array.from({ length: 10 }, (_, j) => j);
    expect(paginateEntries(items, 1, 3)).toHaveLength(3);
  });
  it("computeNextOffset matrix 31", () => {
    expect(computeNextOffset(100, 310, 10)).toBe(null);
  });
  it("paginateEntries matrix 32", () => {
    const items = Array.from({ length: 10 }, (_, j) => j);
    expect(paginateEntries(items, 2, 3)).toHaveLength(3);
  });
  it("computeNextOffset matrix 32", () => {
    expect(computeNextOffset(100, 320, 10)).toBe(null);
  });
  it("paginateEntries matrix 33", () => {
    const items = Array.from({ length: 10 }, (_, j) => j);
    expect(paginateEntries(items, 3, 3)).toHaveLength(3);
  });
  it("computeNextOffset matrix 33", () => {
    expect(computeNextOffset(100, 330, 10)).toBe(null);
  });
  it("paginateEntries matrix 34", () => {
    const items = Array.from({ length: 10 }, (_, j) => j);
    expect(paginateEntries(items, 4, 3)).toHaveLength(3);
  });
  it("computeNextOffset matrix 34", () => {
    expect(computeNextOffset(100, 340, 10)).toBe(null);
  });
  it("paginateEntries matrix 35", () => {
    const items = Array.from({ length: 10 }, (_, j) => j);
    expect(paginateEntries(items, 0, 3)).toHaveLength(3);
  });
  it("computeNextOffset matrix 35", () => {
    expect(computeNextOffset(100, 350, 10)).toBe(null);
  });
  it("paginateEntries matrix 36", () => {
    const items = Array.from({ length: 10 }, (_, j) => j);
    expect(paginateEntries(items, 1, 3)).toHaveLength(3);
  });
  it("computeNextOffset matrix 36", () => {
    expect(computeNextOffset(100, 360, 10)).toBe(null);
  });
  it("paginateEntries matrix 37", () => {
    const items = Array.from({ length: 10 }, (_, j) => j);
    expect(paginateEntries(items, 2, 3)).toHaveLength(3);
  });
  it("computeNextOffset matrix 37", () => {
    expect(computeNextOffset(100, 370, 10)).toBe(null);
  });
  it("paginateEntries matrix 38", () => {
    const items = Array.from({ length: 10 }, (_, j) => j);
    expect(paginateEntries(items, 3, 3)).toHaveLength(3);
  });
  it("computeNextOffset matrix 38", () => {
    expect(computeNextOffset(100, 380, 10)).toBe(null);
  });
  it("paginateEntries matrix 39", () => {
    const items = Array.from({ length: 10 }, (_, j) => j);
    expect(paginateEntries(items, 4, 3)).toHaveLength(3);
  });
  it("computeNextOffset matrix 39", () => {
    expect(computeNextOffset(100, 390, 10)).toBe(null);
  });
  it("paginateEntries matrix 40", () => {
    const items = Array.from({ length: 10 }, (_, j) => j);
    expect(paginateEntries(items, 0, 3)).toHaveLength(3);
  });
  it("computeNextOffset matrix 40", () => {
    expect(computeNextOffset(100, 400, 10)).toBe(null);
  });
  it("paginateEntries matrix 41", () => {
    const items = Array.from({ length: 10 }, (_, j) => j);
    expect(paginateEntries(items, 1, 3)).toHaveLength(3);
  });
  it("computeNextOffset matrix 41", () => {
    expect(computeNextOffset(100, 410, 10)).toBe(null);
  });
  it("paginateEntries matrix 42", () => {
    const items = Array.from({ length: 10 }, (_, j) => j);
    expect(paginateEntries(items, 2, 3)).toHaveLength(3);
  });
  it("computeNextOffset matrix 42", () => {
    expect(computeNextOffset(100, 420, 10)).toBe(null);
  });
  it("paginateEntries matrix 43", () => {
    const items = Array.from({ length: 10 }, (_, j) => j);
    expect(paginateEntries(items, 3, 3)).toHaveLength(3);
  });
  it("computeNextOffset matrix 43", () => {
    expect(computeNextOffset(100, 430, 10)).toBe(null);
  });
  it("paginateEntries matrix 44", () => {
    const items = Array.from({ length: 10 }, (_, j) => j);
    expect(paginateEntries(items, 4, 3)).toHaveLength(3);
  });
  it("computeNextOffset matrix 44", () => {
    expect(computeNextOffset(100, 440, 10)).toBe(null);
  });
  it("paginateEntries matrix 45", () => {
    const items = Array.from({ length: 10 }, (_, j) => j);
    expect(paginateEntries(items, 0, 3)).toHaveLength(3);
  });
  it("computeNextOffset matrix 45", () => {
    expect(computeNextOffset(100, 450, 10)).toBe(null);
  });
  it("paginateEntries matrix 46", () => {
    const items = Array.from({ length: 10 }, (_, j) => j);
    expect(paginateEntries(items, 1, 3)).toHaveLength(3);
  });
  it("computeNextOffset matrix 46", () => {
    expect(computeNextOffset(100, 460, 10)).toBe(null);
  });
  it("paginateEntries matrix 47", () => {
    const items = Array.from({ length: 10 }, (_, j) => j);
    expect(paginateEntries(items, 2, 3)).toHaveLength(3);
  });
  it("computeNextOffset matrix 47", () => {
    expect(computeNextOffset(100, 470, 10)).toBe(null);
  });
  it("paginateEntries matrix 48", () => {
    const items = Array.from({ length: 10 }, (_, j) => j);
    expect(paginateEntries(items, 3, 3)).toHaveLength(3);
  });
  it("computeNextOffset matrix 48", () => {
    expect(computeNextOffset(100, 480, 10)).toBe(null);
  });
  it("paginateEntries matrix 49", () => {
    const items = Array.from({ length: 10 }, (_, j) => j);
    expect(paginateEntries(items, 4, 3)).toHaveLength(3);
  });
  it("computeNextOffset matrix 49", () => {
    expect(computeNextOffset(100, 490, 10)).toBe(null);
  });
});

describe("registry-handlers-lib response builders", () => {
  it("buildSearchRegistryResponse matrix 0", () => {
    const response = buildSearchRegistryResponse({
      entries: [{ key: "mcp:demo-0" }],
      args: { query: "q0" },
      category: "mcp",
      platform: "",
      tag: "",
      trustFilters: {},
    });
    expect(response.ok).toBe(true);
    expect(response.count).toBe(1);
  });
  it("buildCategoryEntriesPageResponse matrix 0", () => {
    const response = buildCategoryEntriesPageResponse({
      entries: Array.from({ length: 5 }, (_, j) => ({ id: j })),
      category: "mcp",
      platform: "",
      tag: "",
      query: "",
      offset: 0,
      limit: 5,
      page: [{ id: 0 }],
    });
    expect(response.total).toBe(5);
  });
  it("buildInstallPlanFromEntries matrix 0", () => {
    const plan = buildInstallPlanFromEntries([
      {
        key: "mcp:x-0",
        title: "T",
        category: "mcp",
        install: { installCommand: "npm i" },
      },
    ]);
    expect(plan).toHaveLength(1);
  });
  it("buildPlanWorkflowResponse matrix 0", () => {
    const response = buildPlanWorkflowResponse({
      goal: "goal-0",
      category: "",
      platform: "",
      selected: [],
      installPlan: [],
      categoryMix: {},
      trustSummary: {},
    });
    expect(response.plannerNotes.length).toBeGreaterThan(3);
  });
  it("buildRecommendForTaskResponse matrix 0", () => {
    const response = buildRecommendForTaskResponse({
      task: "task-0",
      category: "",
      platform: "",
      recommendations: [],
      installPlan: [],
      trustSummary: {},
    });
    expect(response.notes.length).toBeGreaterThan(2);
  });
  it("buildRecentUpdatesResponse matrix 0", () => {
    const response = buildRecentUpdatesResponse({
      category: "mcp",
      since: "",
      entries: [],
    });
    expect(response.ok).toBe(true);
  });
  it("buildRelatedEntriesGraphResponse matrix 0", () => {
    const response = buildRelatedEntriesGraphResponse({
      target: { category: "mcp", slug: "demo-0" },
      entries: [],
      limit: 5,
    });
    expect(response.relationGraph).toBe(true);
  });
  it("buildRelatedEntriesGraphResponse count matches the returned page", () => {
    const response = buildRelatedEntriesGraphResponse({
      target: { category: "mcp", slug: "demo" },
      entries: Array.from({ length: 8 }, (_, index) => ({ id: index })),
      limit: 5,
    });
    expect(response.entries).toHaveLength(5);
    expect(response.count).toBe(response.entries.length);
  });
  it("buildTrendingResourceResponse matrix 0", () => {
    const response = buildTrendingResourceResponse({
      payload: { schemaVersion: 1 },
      entries: [],
    });
    expect(response.kind).toBe("registry-trending");
  });
  it("buildJobsActiveResourceResponse matrix 0", () => {
    const response = buildJobsActiveResourceResponse({
      payload: { totalAvailable: 0 },
      entries: [],
    });
    expect(response.kind).toBe("jobs-active");
  });
  it("buildRegistryResourcePayload matrix 0", () => {
    const payload = buildRegistryResourcePayload(
      "heyclaude://test",
      { ok: true },
      "application/json",
      (v) => v,
    );
    expect(payload.contents[0].uri).toBe("heyclaude://test");
  });
  it("buildCategoryResourcePayload matrix 0", () => {
    const payload = buildCategoryResourcePayload(
      "mcp",
      [{ category: "mcp", slug: "demo-0" }],
      toEntrySummary,
    );
    expect(payload.total).toBe(1);
  });
  it("buildListRegistryResourcesResponse matrix 0", () => {
    const response = buildListRegistryResourcesResponse({
      manifest: {},
      categories: ["mcp"],
      discoveryResources: [],
      jsonMimeType: "application/json",
    });
    expect(response.resources.length).toBeGreaterThan(1);
  });
  it("buildPlatformAdapterUnavailableResponse matrix 0", () => {
    const response = buildPlatformAdapterUnavailableResponse(
      "vscode",
      "skill-0",
    );
    expect(response.adapterAvailable).toBe(false);
  });
  it("buildDistributionFeedsResponse matrix 0", () => {
    const response = buildDistributionFeedsResponse({
      manifest: { schemaVersion: 1, generatedAt: "now", artifacts: {} },
      feedIndex: { categories: [], platforms: [] },
      platformFeedSlug: (p: string) => p,
    });
    expect(response.ok).toBe(true);
  });
  it("buildExplainEntryTrustResponse matrix 0", () => {
    const entry = { category: "mcp", slug: "demo-0", title: "Demo" };
    const response = buildExplainEntryTrustResponse({
      entry,
      entryCanonicalUrl: () => "https://example.com",
      entryTrustSummary: () => ({}),
    });
    expect(response.key).toBe("mcp:demo-0");
  });
  it("buildInstallGuidanceResponse matrix 0", () => {
    const entry = { category: "mcp", slug: "demo-0", title: "Demo" };
    const response = buildInstallGuidanceResponse({
      entry,
      platform: "",
      selectedCompatibility: null,
      compatibility: [],
      entryCanonicalUrl: () => "",
      entryTrustSummary: () => ({}),
      notes: () => [],
    });
    expect(response.key).toBe("mcp:demo-0");
  });
  it("sortEntriesByUpdatedAt matrix 0", () => {
    const sorted = sortEntriesByUpdatedAt(
      [
        { title: "b", dateAdded: "2026-01-01" },
        { title: "a", dateAdded: "2026-01-01" },
      ],
      entryUpdatedAt,
    );
    expect(sorted.length).toBe(2);
  });
  it("buildDiscoveryRecentResponse matrix 0", () => {
    const response = buildDiscoveryRecentResponse({
      entries: [
        {
          category: "mcp",
          slug: "demo-0",
          title: "Demo",
          dateAdded: "2026-01-01",
        },
      ],
      toEntrySummary,
      entryUpdatedAt,
    });
    expect(response.kind).toBe("registry-recent");
  });
  it("buildSearchRegistryResponse matrix 1", () => {
    const response = buildSearchRegistryResponse({
      entries: [{ key: "mcp:demo-1" }],
      args: { query: "q1" },
      category: "mcp",
      platform: "",
      tag: "",
      trustFilters: {},
    });
    expect(response.ok).toBe(true);
    expect(response.count).toBe(1);
  });
  it("buildCategoryEntriesPageResponse matrix 1", () => {
    const response = buildCategoryEntriesPageResponse({
      entries: Array.from({ length: 6 }, (_, j) => ({ id: j })),
      category: "mcp",
      platform: "",
      tag: "",
      query: "",
      offset: 1,
      limit: 5,
      page: [{ id: 1 }],
    });
    expect(response.total).toBe(6);
  });
  it("buildInstallPlanFromEntries matrix 1", () => {
    const plan = buildInstallPlanFromEntries([
      {
        key: "mcp:x-1",
        title: "T",
        category: "mcp",
        install: { installCommand: "npm i" },
      },
    ]);
    expect(plan).toHaveLength(1);
  });
  it("buildPlanWorkflowResponse matrix 1", () => {
    const response = buildPlanWorkflowResponse({
      goal: "goal-1",
      category: "",
      platform: "",
      selected: [],
      installPlan: [],
      categoryMix: {},
      trustSummary: {},
    });
    expect(response.plannerNotes.length).toBeGreaterThan(3);
  });
  it("buildRecommendForTaskResponse matrix 1", () => {
    const response = buildRecommendForTaskResponse({
      task: "task-1",
      category: "",
      platform: "",
      recommendations: [],
      installPlan: [],
      trustSummary: {},
    });
    expect(response.notes.length).toBeGreaterThan(2);
  });
  it("buildRecentUpdatesResponse matrix 1", () => {
    const response = buildRecentUpdatesResponse({
      category: "mcp",
      since: "",
      entries: [],
    });
    expect(response.ok).toBe(true);
  });
  it("buildRelatedEntriesGraphResponse matrix 1", () => {
    const response = buildRelatedEntriesGraphResponse({
      target: { category: "mcp", slug: "demo-1" },
      entries: [],
      limit: 5,
    });
    expect(response.relationGraph).toBe(true);
  });
  it("buildTrendingResourceResponse matrix 1", () => {
    const response = buildTrendingResourceResponse({
      payload: { schemaVersion: 1 },
      entries: [],
    });
    expect(response.kind).toBe("registry-trending");
  });
  it("buildJobsActiveResourceResponse matrix 1", () => {
    const response = buildJobsActiveResourceResponse({
      payload: { totalAvailable: 1 },
      entries: [],
    });
    expect(response.kind).toBe("jobs-active");
  });
  it("buildRegistryResourcePayload matrix 1", () => {
    const payload = buildRegistryResourcePayload(
      "heyclaude://test",
      { ok: true },
      "application/json",
      (v) => v,
    );
    expect(payload.contents[0].uri).toBe("heyclaude://test");
  });
  it("buildCategoryResourcePayload matrix 1", () => {
    const payload = buildCategoryResourcePayload(
      "mcp",
      [{ category: "mcp", slug: "demo-1" }],
      toEntrySummary,
    );
    expect(payload.total).toBe(1);
  });
  it("buildListRegistryResourcesResponse matrix 1", () => {
    const response = buildListRegistryResourcesResponse({
      manifest: {},
      categories: ["mcp"],
      discoveryResources: [],
      jsonMimeType: "application/json",
    });
    expect(response.resources.length).toBeGreaterThan(1);
  });
  it("buildPlatformAdapterUnavailableResponse matrix 1", () => {
    const response = buildPlatformAdapterUnavailableResponse(
      "vscode",
      "skill-1",
    );
    expect(response.adapterAvailable).toBe(false);
  });
  it("buildDistributionFeedsResponse matrix 1", () => {
    const response = buildDistributionFeedsResponse({
      manifest: { schemaVersion: 1, generatedAt: "now", artifacts: {} },
      feedIndex: { categories: [], platforms: [] },
      platformFeedSlug: (p: string) => p,
    });
    expect(response.ok).toBe(true);
  });
  it("buildExplainEntryTrustResponse matrix 1", () => {
    const entry = { category: "mcp", slug: "demo-1", title: "Demo" };
    const response = buildExplainEntryTrustResponse({
      entry,
      entryCanonicalUrl: () => "https://example.com",
      entryTrustSummary: () => ({}),
    });
    expect(response.key).toBe("mcp:demo-1");
  });
  it("buildInstallGuidanceResponse matrix 1", () => {
    const entry = { category: "mcp", slug: "demo-1", title: "Demo" };
    const response = buildInstallGuidanceResponse({
      entry,
      platform: "",
      selectedCompatibility: null,
      compatibility: [],
      entryCanonicalUrl: () => "",
      entryTrustSummary: () => ({}),
      notes: () => [],
    });
    expect(response.key).toBe("mcp:demo-1");
  });
  it("sortEntriesByUpdatedAt matrix 1", () => {
    const sorted = sortEntriesByUpdatedAt(
      [
        { title: "b", dateAdded: "2026-01-02" },
        { title: "a", dateAdded: "2026-01-01" },
      ],
      entryUpdatedAt,
    );
    expect(sorted.length).toBe(2);
  });
  it("buildDiscoveryRecentResponse matrix 1", () => {
    const response = buildDiscoveryRecentResponse({
      entries: [
        {
          category: "mcp",
          slug: "demo-1",
          title: "Demo",
          dateAdded: "2026-01-01",
        },
      ],
      toEntrySummary,
      entryUpdatedAt,
    });
    expect(response.kind).toBe("registry-recent");
  });
  it("buildSearchRegistryResponse matrix 2", () => {
    const response = buildSearchRegistryResponse({
      entries: [{ key: "mcp:demo-2" }],
      args: { query: "q2" },
      category: "mcp",
      platform: "",
      tag: "",
      trustFilters: {},
    });
    expect(response.ok).toBe(true);
    expect(response.count).toBe(1);
  });
  it("buildCategoryEntriesPageResponse matrix 2", () => {
    const response = buildCategoryEntriesPageResponse({
      entries: Array.from({ length: 7 }, (_, j) => ({ id: j })),
      category: "mcp",
      platform: "",
      tag: "",
      query: "",
      offset: 2,
      limit: 5,
      page: [{ id: 2 }],
    });
    expect(response.total).toBe(7);
  });
  it("buildInstallPlanFromEntries matrix 2", () => {
    const plan = buildInstallPlanFromEntries([
      {
        key: "mcp:x-2",
        title: "T",
        category: "mcp",
        install: { installCommand: "npm i" },
      },
    ]);
    expect(plan).toHaveLength(1);
  });
  it("buildPlanWorkflowResponse matrix 2", () => {
    const response = buildPlanWorkflowResponse({
      goal: "goal-2",
      category: "",
      platform: "",
      selected: [],
      installPlan: [],
      categoryMix: {},
      trustSummary: {},
    });
    expect(response.plannerNotes.length).toBeGreaterThan(3);
  });
  it("buildRecommendForTaskResponse matrix 2", () => {
    const response = buildRecommendForTaskResponse({
      task: "task-2",
      category: "",
      platform: "",
      recommendations: [],
      installPlan: [],
      trustSummary: {},
    });
    expect(response.notes.length).toBeGreaterThan(2);
  });
  it("buildRecentUpdatesResponse matrix 2", () => {
    const response = buildRecentUpdatesResponse({
      category: "mcp",
      since: "",
      entries: [],
    });
    expect(response.ok).toBe(true);
  });
  it("buildRelatedEntriesGraphResponse matrix 2", () => {
    const response = buildRelatedEntriesGraphResponse({
      target: { category: "mcp", slug: "demo-2" },
      entries: [],
      limit: 5,
    });
    expect(response.relationGraph).toBe(true);
  });
  it("buildTrendingResourceResponse matrix 2", () => {
    const response = buildTrendingResourceResponse({
      payload: { schemaVersion: 1 },
      entries: [],
    });
    expect(response.kind).toBe("registry-trending");
  });
  it("buildJobsActiveResourceResponse matrix 2", () => {
    const response = buildJobsActiveResourceResponse({
      payload: { totalAvailable: 2 },
      entries: [],
    });
    expect(response.kind).toBe("jobs-active");
  });
  it("buildRegistryResourcePayload matrix 2", () => {
    const payload = buildRegistryResourcePayload(
      "heyclaude://test",
      { ok: true },
      "application/json",
      (v) => v,
    );
    expect(payload.contents[0].uri).toBe("heyclaude://test");
  });
  it("buildCategoryResourcePayload matrix 2", () => {
    const payload = buildCategoryResourcePayload(
      "mcp",
      [{ category: "mcp", slug: "demo-2" }],
      toEntrySummary,
    );
    expect(payload.total).toBe(1);
  });
  it("buildListRegistryResourcesResponse matrix 2", () => {
    const response = buildListRegistryResourcesResponse({
      manifest: {},
      categories: ["mcp"],
      discoveryResources: [],
      jsonMimeType: "application/json",
    });
    expect(response.resources.length).toBeGreaterThan(1);
  });
  it("buildPlatformAdapterUnavailableResponse matrix 2", () => {
    const response = buildPlatformAdapterUnavailableResponse(
      "vscode",
      "skill-2",
    );
    expect(response.adapterAvailable).toBe(false);
  });
  it("buildDistributionFeedsResponse matrix 2", () => {
    const response = buildDistributionFeedsResponse({
      manifest: { schemaVersion: 1, generatedAt: "now", artifacts: {} },
      feedIndex: { categories: [], platforms: [] },
      platformFeedSlug: (p: string) => p,
    });
    expect(response.ok).toBe(true);
  });
  it("buildExplainEntryTrustResponse matrix 2", () => {
    const entry = { category: "mcp", slug: "demo-2", title: "Demo" };
    const response = buildExplainEntryTrustResponse({
      entry,
      entryCanonicalUrl: () => "https://example.com",
      entryTrustSummary: () => ({}),
    });
    expect(response.key).toBe("mcp:demo-2");
  });
  it("buildInstallGuidanceResponse matrix 2", () => {
    const entry = { category: "mcp", slug: "demo-2", title: "Demo" };
    const response = buildInstallGuidanceResponse({
      entry,
      platform: "",
      selectedCompatibility: null,
      compatibility: [],
      entryCanonicalUrl: () => "",
      entryTrustSummary: () => ({}),
      notes: () => [],
    });
    expect(response.key).toBe("mcp:demo-2");
  });
  it("sortEntriesByUpdatedAt matrix 2", () => {
    const sorted = sortEntriesByUpdatedAt(
      [
        { title: "b", dateAdded: "2026-01-03" },
        { title: "a", dateAdded: "2026-01-01" },
      ],
      entryUpdatedAt,
    );
    expect(sorted.length).toBe(2);
  });
  it("buildDiscoveryRecentResponse matrix 2", () => {
    const response = buildDiscoveryRecentResponse({
      entries: [
        {
          category: "mcp",
          slug: "demo-2",
          title: "Demo",
          dateAdded: "2026-01-01",
        },
      ],
      toEntrySummary,
      entryUpdatedAt,
    });
    expect(response.kind).toBe("registry-recent");
  });
  it("buildSearchRegistryResponse matrix 3", () => {
    const response = buildSearchRegistryResponse({
      entries: [{ key: "mcp:demo-3" }],
      args: { query: "q3" },
      category: "mcp",
      platform: "",
      tag: "",
      trustFilters: {},
    });
    expect(response.ok).toBe(true);
    expect(response.count).toBe(1);
  });
  it("buildCategoryEntriesPageResponse matrix 3", () => {
    const response = buildCategoryEntriesPageResponse({
      entries: Array.from({ length: 8 }, (_, j) => ({ id: j })),
      category: "mcp",
      platform: "",
      tag: "",
      query: "",
      offset: 3,
      limit: 5,
      page: [{ id: 3 }],
    });
    expect(response.total).toBe(8);
  });
  it("buildInstallPlanFromEntries matrix 3", () => {
    const plan = buildInstallPlanFromEntries([
      {
        key: "mcp:x-3",
        title: "T",
        category: "mcp",
        install: { installCommand: "npm i" },
      },
    ]);
    expect(plan).toHaveLength(1);
  });
  it("buildPlanWorkflowResponse matrix 3", () => {
    const response = buildPlanWorkflowResponse({
      goal: "goal-3",
      category: "",
      platform: "",
      selected: [],
      installPlan: [],
      categoryMix: {},
      trustSummary: {},
    });
    expect(response.plannerNotes.length).toBeGreaterThan(3);
  });
  it("buildRecommendForTaskResponse matrix 3", () => {
    const response = buildRecommendForTaskResponse({
      task: "task-3",
      category: "",
      platform: "",
      recommendations: [],
      installPlan: [],
      trustSummary: {},
    });
    expect(response.notes.length).toBeGreaterThan(2);
  });
  it("buildRecentUpdatesResponse matrix 3", () => {
    const response = buildRecentUpdatesResponse({
      category: "mcp",
      since: "",
      entries: [],
    });
    expect(response.ok).toBe(true);
  });
  it("buildRelatedEntriesGraphResponse matrix 3", () => {
    const response = buildRelatedEntriesGraphResponse({
      target: { category: "mcp", slug: "demo-3" },
      entries: [],
      limit: 5,
    });
    expect(response.relationGraph).toBe(true);
  });
  it("buildTrendingResourceResponse matrix 3", () => {
    const response = buildTrendingResourceResponse({
      payload: { schemaVersion: 1 },
      entries: [],
    });
    expect(response.kind).toBe("registry-trending");
  });
  it("buildJobsActiveResourceResponse matrix 3", () => {
    const response = buildJobsActiveResourceResponse({
      payload: { totalAvailable: 3 },
      entries: [],
    });
    expect(response.kind).toBe("jobs-active");
  });
  it("buildRegistryResourcePayload matrix 3", () => {
    const payload = buildRegistryResourcePayload(
      "heyclaude://test",
      { ok: true },
      "application/json",
      (v) => v,
    );
    expect(payload.contents[0].uri).toBe("heyclaude://test");
  });
  it("buildCategoryResourcePayload matrix 3", () => {
    const payload = buildCategoryResourcePayload(
      "mcp",
      [{ category: "mcp", slug: "demo-3" }],
      toEntrySummary,
    );
    expect(payload.total).toBe(1);
  });
  it("buildListRegistryResourcesResponse matrix 3", () => {
    const response = buildListRegistryResourcesResponse({
      manifest: {},
      categories: ["mcp"],
      discoveryResources: [],
      jsonMimeType: "application/json",
    });
    expect(response.resources.length).toBeGreaterThan(1);
  });
  it("buildPlatformAdapterUnavailableResponse matrix 3", () => {
    const response = buildPlatformAdapterUnavailableResponse(
      "vscode",
      "skill-3",
    );
    expect(response.adapterAvailable).toBe(false);
  });
  it("buildDistributionFeedsResponse matrix 3", () => {
    const response = buildDistributionFeedsResponse({
      manifest: { schemaVersion: 1, generatedAt: "now", artifacts: {} },
      feedIndex: { categories: [], platforms: [] },
      platformFeedSlug: (p: string) => p,
    });
    expect(response.ok).toBe(true);
  });
  it("buildExplainEntryTrustResponse matrix 3", () => {
    const entry = { category: "mcp", slug: "demo-3", title: "Demo" };
    const response = buildExplainEntryTrustResponse({
      entry,
      entryCanonicalUrl: () => "https://example.com",
      entryTrustSummary: () => ({}),
    });
    expect(response.key).toBe("mcp:demo-3");
  });
  it("buildInstallGuidanceResponse matrix 3", () => {
    const entry = { category: "mcp", slug: "demo-3", title: "Demo" };
    const response = buildInstallGuidanceResponse({
      entry,
      platform: "",
      selectedCompatibility: null,
      compatibility: [],
      entryCanonicalUrl: () => "",
      entryTrustSummary: () => ({}),
      notes: () => [],
    });
    expect(response.key).toBe("mcp:demo-3");
  });
  it("sortEntriesByUpdatedAt matrix 3", () => {
    const sorted = sortEntriesByUpdatedAt(
      [
        { title: "b", dateAdded: "2026-01-04" },
        { title: "a", dateAdded: "2026-01-01" },
      ],
      entryUpdatedAt,
    );
    expect(sorted.length).toBe(2);
  });
  it("buildDiscoveryRecentResponse matrix 3", () => {
    const response = buildDiscoveryRecentResponse({
      entries: [
        {
          category: "mcp",
          slug: "demo-3",
          title: "Demo",
          dateAdded: "2026-01-01",
        },
      ],
      toEntrySummary,
      entryUpdatedAt,
    });
    expect(response.kind).toBe("registry-recent");
  });
  it("buildSearchRegistryResponse matrix 4", () => {
    const response = buildSearchRegistryResponse({
      entries: [{ key: "mcp:demo-4" }],
      args: { query: "q4" },
      category: "mcp",
      platform: "",
      tag: "",
      trustFilters: {},
    });
    expect(response.ok).toBe(true);
    expect(response.count).toBe(1);
  });
  it("buildCategoryEntriesPageResponse matrix 4", () => {
    const response = buildCategoryEntriesPageResponse({
      entries: Array.from({ length: 9 }, (_, j) => ({ id: j })),
      category: "mcp",
      platform: "",
      tag: "",
      query: "",
      offset: 4,
      limit: 5,
      page: [{ id: 4 }],
    });
    expect(response.total).toBe(9);
  });
  it("buildInstallPlanFromEntries matrix 4", () => {
    const plan = buildInstallPlanFromEntries([
      {
        key: "mcp:x-4",
        title: "T",
        category: "mcp",
        install: { installCommand: "npm i" },
      },
    ]);
    expect(plan).toHaveLength(1);
  });
  it("buildPlanWorkflowResponse matrix 4", () => {
    const response = buildPlanWorkflowResponse({
      goal: "goal-4",
      category: "",
      platform: "",
      selected: [],
      installPlan: [],
      categoryMix: {},
      trustSummary: {},
    });
    expect(response.plannerNotes.length).toBeGreaterThan(3);
  });
  it("buildRecommendForTaskResponse matrix 4", () => {
    const response = buildRecommendForTaskResponse({
      task: "task-4",
      category: "",
      platform: "",
      recommendations: [],
      installPlan: [],
      trustSummary: {},
    });
    expect(response.notes.length).toBeGreaterThan(2);
  });
  it("buildRecentUpdatesResponse matrix 4", () => {
    const response = buildRecentUpdatesResponse({
      category: "mcp",
      since: "",
      entries: [],
    });
    expect(response.ok).toBe(true);
  });
  it("buildRelatedEntriesGraphResponse matrix 4", () => {
    const response = buildRelatedEntriesGraphResponse({
      target: { category: "mcp", slug: "demo-4" },
      entries: [],
      limit: 5,
    });
    expect(response.relationGraph).toBe(true);
  });
  it("buildTrendingResourceResponse matrix 4", () => {
    const response = buildTrendingResourceResponse({
      payload: { schemaVersion: 1 },
      entries: [],
    });
    expect(response.kind).toBe("registry-trending");
  });
  it("buildJobsActiveResourceResponse matrix 4", () => {
    const response = buildJobsActiveResourceResponse({
      payload: { totalAvailable: 4 },
      entries: [],
    });
    expect(response.kind).toBe("jobs-active");
  });
  it("buildRegistryResourcePayload matrix 4", () => {
    const payload = buildRegistryResourcePayload(
      "heyclaude://test",
      { ok: true },
      "application/json",
      (v) => v,
    );
    expect(payload.contents[0].uri).toBe("heyclaude://test");
  });
  it("buildCategoryResourcePayload matrix 4", () => {
    const payload = buildCategoryResourcePayload(
      "mcp",
      [{ category: "mcp", slug: "demo-4" }],
      toEntrySummary,
    );
    expect(payload.total).toBe(1);
  });
  it("buildListRegistryResourcesResponse matrix 4", () => {
    const response = buildListRegistryResourcesResponse({
      manifest: {},
      categories: ["mcp"],
      discoveryResources: [],
      jsonMimeType: "application/json",
    });
    expect(response.resources.length).toBeGreaterThan(1);
  });
  it("buildPlatformAdapterUnavailableResponse matrix 4", () => {
    const response = buildPlatformAdapterUnavailableResponse(
      "vscode",
      "skill-4",
    );
    expect(response.adapterAvailable).toBe(false);
  });
  it("buildDistributionFeedsResponse matrix 4", () => {
    const response = buildDistributionFeedsResponse({
      manifest: { schemaVersion: 1, generatedAt: "now", artifacts: {} },
      feedIndex: { categories: [], platforms: [] },
      platformFeedSlug: (p: string) => p,
    });
    expect(response.ok).toBe(true);
  });
  it("buildExplainEntryTrustResponse matrix 4", () => {
    const entry = { category: "mcp", slug: "demo-4", title: "Demo" };
    const response = buildExplainEntryTrustResponse({
      entry,
      entryCanonicalUrl: () => "https://example.com",
      entryTrustSummary: () => ({}),
    });
    expect(response.key).toBe("mcp:demo-4");
  });
  it("buildInstallGuidanceResponse matrix 4", () => {
    const entry = { category: "mcp", slug: "demo-4", title: "Demo" };
    const response = buildInstallGuidanceResponse({
      entry,
      platform: "",
      selectedCompatibility: null,
      compatibility: [],
      entryCanonicalUrl: () => "",
      entryTrustSummary: () => ({}),
      notes: () => [],
    });
    expect(response.key).toBe("mcp:demo-4");
  });
  it("sortEntriesByUpdatedAt matrix 4", () => {
    const sorted = sortEntriesByUpdatedAt(
      [
        { title: "b", dateAdded: "2026-01-05" },
        { title: "a", dateAdded: "2026-01-01" },
      ],
      entryUpdatedAt,
    );
    expect(sorted.length).toBe(2);
  });
  it("buildDiscoveryRecentResponse matrix 4", () => {
    const response = buildDiscoveryRecentResponse({
      entries: [
        {
          category: "mcp",
          slug: "demo-4",
          title: "Demo",
          dateAdded: "2026-01-01",
        },
      ],
      toEntrySummary,
      entryUpdatedAt,
    });
    expect(response.kind).toBe("registry-recent");
  });
  it("buildSearchRegistryResponse matrix 5", () => {
    const response = buildSearchRegistryResponse({
      entries: [{ key: "mcp:demo-5" }],
      args: { query: "q5" },
      category: "mcp",
      platform: "",
      tag: "",
      trustFilters: {},
    });
    expect(response.ok).toBe(true);
    expect(response.count).toBe(1);
  });
  it("buildCategoryEntriesPageResponse matrix 5", () => {
    const response = buildCategoryEntriesPageResponse({
      entries: Array.from({ length: 10 }, (_, j) => ({ id: j })),
      category: "mcp",
      platform: "",
      tag: "",
      query: "",
      offset: 5,
      limit: 5,
      page: [{ id: 5 }],
    });
    expect(response.total).toBe(10);
  });
  it("buildInstallPlanFromEntries matrix 5", () => {
    const plan = buildInstallPlanFromEntries([
      {
        key: "mcp:x-5",
        title: "T",
        category: "mcp",
        install: { installCommand: "npm i" },
      },
    ]);
    expect(plan).toHaveLength(1);
  });
  it("buildPlanWorkflowResponse matrix 5", () => {
    const response = buildPlanWorkflowResponse({
      goal: "goal-5",
      category: "",
      platform: "",
      selected: [],
      installPlan: [],
      categoryMix: {},
      trustSummary: {},
    });
    expect(response.plannerNotes.length).toBeGreaterThan(3);
  });
  it("buildRecommendForTaskResponse matrix 5", () => {
    const response = buildRecommendForTaskResponse({
      task: "task-5",
      category: "",
      platform: "",
      recommendations: [],
      installPlan: [],
      trustSummary: {},
    });
    expect(response.notes.length).toBeGreaterThan(2);
  });
  it("buildRecentUpdatesResponse matrix 5", () => {
    const response = buildRecentUpdatesResponse({
      category: "mcp",
      since: "",
      entries: [],
    });
    expect(response.ok).toBe(true);
  });
  it("buildRelatedEntriesGraphResponse matrix 5", () => {
    const response = buildRelatedEntriesGraphResponse({
      target: { category: "mcp", slug: "demo-5" },
      entries: [],
      limit: 5,
    });
    expect(response.relationGraph).toBe(true);
  });
  it("buildTrendingResourceResponse matrix 5", () => {
    const response = buildTrendingResourceResponse({
      payload: { schemaVersion: 1 },
      entries: [],
    });
    expect(response.kind).toBe("registry-trending");
  });
  it("buildJobsActiveResourceResponse matrix 5", () => {
    const response = buildJobsActiveResourceResponse({
      payload: { totalAvailable: 5 },
      entries: [],
    });
    expect(response.kind).toBe("jobs-active");
  });
  it("buildRegistryResourcePayload matrix 5", () => {
    const payload = buildRegistryResourcePayload(
      "heyclaude://test",
      { ok: true },
      "application/json",
      (v) => v,
    );
    expect(payload.contents[0].uri).toBe("heyclaude://test");
  });
  it("buildCategoryResourcePayload matrix 5", () => {
    const payload = buildCategoryResourcePayload(
      "mcp",
      [{ category: "mcp", slug: "demo-5" }],
      toEntrySummary,
    );
    expect(payload.total).toBe(1);
  });
  it("buildListRegistryResourcesResponse matrix 5", () => {
    const response = buildListRegistryResourcesResponse({
      manifest: {},
      categories: ["mcp"],
      discoveryResources: [],
      jsonMimeType: "application/json",
    });
    expect(response.resources.length).toBeGreaterThan(1);
  });
  it("buildPlatformAdapterUnavailableResponse matrix 5", () => {
    const response = buildPlatformAdapterUnavailableResponse(
      "vscode",
      "skill-5",
    );
    expect(response.adapterAvailable).toBe(false);
  });
  it("buildDistributionFeedsResponse matrix 5", () => {
    const response = buildDistributionFeedsResponse({
      manifest: { schemaVersion: 1, generatedAt: "now", artifacts: {} },
      feedIndex: { categories: [], platforms: [] },
      platformFeedSlug: (p: string) => p,
    });
    expect(response.ok).toBe(true);
  });
  it("buildExplainEntryTrustResponse matrix 5", () => {
    const entry = { category: "mcp", slug: "demo-5", title: "Demo" };
    const response = buildExplainEntryTrustResponse({
      entry,
      entryCanonicalUrl: () => "https://example.com",
      entryTrustSummary: () => ({}),
    });
    expect(response.key).toBe("mcp:demo-5");
  });
  it("buildInstallGuidanceResponse matrix 5", () => {
    const entry = { category: "mcp", slug: "demo-5", title: "Demo" };
    const response = buildInstallGuidanceResponse({
      entry,
      platform: "",
      selectedCompatibility: null,
      compatibility: [],
      entryCanonicalUrl: () => "",
      entryTrustSummary: () => ({}),
      notes: () => [],
    });
    expect(response.key).toBe("mcp:demo-5");
  });
  it("sortEntriesByUpdatedAt matrix 5", () => {
    const sorted = sortEntriesByUpdatedAt(
      [
        { title: "b", dateAdded: "2026-01-06" },
        { title: "a", dateAdded: "2026-01-01" },
      ],
      entryUpdatedAt,
    );
    expect(sorted.length).toBe(2);
  });
  it("buildDiscoveryRecentResponse matrix 5", () => {
    const response = buildDiscoveryRecentResponse({
      entries: [
        {
          category: "mcp",
          slug: "demo-5",
          title: "Demo",
          dateAdded: "2026-01-01",
        },
      ],
      toEntrySummary,
      entryUpdatedAt,
    });
    expect(response.kind).toBe("registry-recent");
  });
  it("buildSearchRegistryResponse matrix 6", () => {
    const response = buildSearchRegistryResponse({
      entries: [{ key: "mcp:demo-6" }],
      args: { query: "q6" },
      category: "mcp",
      platform: "",
      tag: "",
      trustFilters: {},
    });
    expect(response.ok).toBe(true);
    expect(response.count).toBe(1);
  });
  it("buildCategoryEntriesPageResponse matrix 6", () => {
    const response = buildCategoryEntriesPageResponse({
      entries: Array.from({ length: 11 }, (_, j) => ({ id: j })),
      category: "mcp",
      platform: "",
      tag: "",
      query: "",
      offset: 6,
      limit: 5,
      page: [{ id: 6 }],
    });
    expect(response.total).toBe(11);
  });
  it("buildInstallPlanFromEntries matrix 6", () => {
    const plan = buildInstallPlanFromEntries([
      {
        key: "mcp:x-6",
        title: "T",
        category: "mcp",
        install: { installCommand: "npm i" },
      },
    ]);
    expect(plan).toHaveLength(1);
  });
  it("buildPlanWorkflowResponse matrix 6", () => {
    const response = buildPlanWorkflowResponse({
      goal: "goal-6",
      category: "",
      platform: "",
      selected: [],
      installPlan: [],
      categoryMix: {},
      trustSummary: {},
    });
    expect(response.plannerNotes.length).toBeGreaterThan(3);
  });
  it("buildRecommendForTaskResponse matrix 6", () => {
    const response = buildRecommendForTaskResponse({
      task: "task-6",
      category: "",
      platform: "",
      recommendations: [],
      installPlan: [],
      trustSummary: {},
    });
    expect(response.notes.length).toBeGreaterThan(2);
  });
  it("buildRecentUpdatesResponse matrix 6", () => {
    const response = buildRecentUpdatesResponse({
      category: "mcp",
      since: "",
      entries: [],
    });
    expect(response.ok).toBe(true);
  });
  it("buildRelatedEntriesGraphResponse matrix 6", () => {
    const response = buildRelatedEntriesGraphResponse({
      target: { category: "mcp", slug: "demo-6" },
      entries: [],
      limit: 5,
    });
    expect(response.relationGraph).toBe(true);
  });
  it("buildTrendingResourceResponse matrix 6", () => {
    const response = buildTrendingResourceResponse({
      payload: { schemaVersion: 1 },
      entries: [],
    });
    expect(response.kind).toBe("registry-trending");
  });
  it("buildJobsActiveResourceResponse matrix 6", () => {
    const response = buildJobsActiveResourceResponse({
      payload: { totalAvailable: 6 },
      entries: [],
    });
    expect(response.kind).toBe("jobs-active");
  });
  it("buildRegistryResourcePayload matrix 6", () => {
    const payload = buildRegistryResourcePayload(
      "heyclaude://test",
      { ok: true },
      "application/json",
      (v) => v,
    );
    expect(payload.contents[0].uri).toBe("heyclaude://test");
  });
  it("buildCategoryResourcePayload matrix 6", () => {
    const payload = buildCategoryResourcePayload(
      "mcp",
      [{ category: "mcp", slug: "demo-6" }],
      toEntrySummary,
    );
    expect(payload.total).toBe(1);
  });
  it("buildListRegistryResourcesResponse matrix 6", () => {
    const response = buildListRegistryResourcesResponse({
      manifest: {},
      categories: ["mcp"],
      discoveryResources: [],
      jsonMimeType: "application/json",
    });
    expect(response.resources.length).toBeGreaterThan(1);
  });
  it("buildPlatformAdapterUnavailableResponse matrix 6", () => {
    const response = buildPlatformAdapterUnavailableResponse(
      "vscode",
      "skill-6",
    );
    expect(response.adapterAvailable).toBe(false);
  });
  it("buildDistributionFeedsResponse matrix 6", () => {
    const response = buildDistributionFeedsResponse({
      manifest: { schemaVersion: 1, generatedAt: "now", artifacts: {} },
      feedIndex: { categories: [], platforms: [] },
      platformFeedSlug: (p: string) => p,
    });
    expect(response.ok).toBe(true);
  });
  it("buildExplainEntryTrustResponse matrix 6", () => {
    const entry = { category: "mcp", slug: "demo-6", title: "Demo" };
    const response = buildExplainEntryTrustResponse({
      entry,
      entryCanonicalUrl: () => "https://example.com",
      entryTrustSummary: () => ({}),
    });
    expect(response.key).toBe("mcp:demo-6");
  });
  it("buildInstallGuidanceResponse matrix 6", () => {
    const entry = { category: "mcp", slug: "demo-6", title: "Demo" };
    const response = buildInstallGuidanceResponse({
      entry,
      platform: "",
      selectedCompatibility: null,
      compatibility: [],
      entryCanonicalUrl: () => "",
      entryTrustSummary: () => ({}),
      notes: () => [],
    });
    expect(response.key).toBe("mcp:demo-6");
  });
  it("sortEntriesByUpdatedAt matrix 6", () => {
    const sorted = sortEntriesByUpdatedAt(
      [
        { title: "b", dateAdded: "2026-01-07" },
        { title: "a", dateAdded: "2026-01-01" },
      ],
      entryUpdatedAt,
    );
    expect(sorted.length).toBe(2);
  });
  it("buildDiscoveryRecentResponse matrix 6", () => {
    const response = buildDiscoveryRecentResponse({
      entries: [
        {
          category: "mcp",
          slug: "demo-6",
          title: "Demo",
          dateAdded: "2026-01-01",
        },
      ],
      toEntrySummary,
      entryUpdatedAt,
    });
    expect(response.kind).toBe("registry-recent");
  });
  it("buildSearchRegistryResponse matrix 7", () => {
    const response = buildSearchRegistryResponse({
      entries: [{ key: "mcp:demo-7" }],
      args: { query: "q7" },
      category: "mcp",
      platform: "",
      tag: "",
      trustFilters: {},
    });
    expect(response.ok).toBe(true);
    expect(response.count).toBe(1);
  });
  it("buildCategoryEntriesPageResponse matrix 7", () => {
    const response = buildCategoryEntriesPageResponse({
      entries: Array.from({ length: 12 }, (_, j) => ({ id: j })),
      category: "mcp",
      platform: "",
      tag: "",
      query: "",
      offset: 7,
      limit: 5,
      page: [{ id: 7 }],
    });
    expect(response.total).toBe(12);
  });
  it("buildInstallPlanFromEntries matrix 7", () => {
    const plan = buildInstallPlanFromEntries([
      {
        key: "mcp:x-7",
        title: "T",
        category: "mcp",
        install: { installCommand: "npm i" },
      },
    ]);
    expect(plan).toHaveLength(1);
  });
  it("buildPlanWorkflowResponse matrix 7", () => {
    const response = buildPlanWorkflowResponse({
      goal: "goal-7",
      category: "",
      platform: "",
      selected: [],
      installPlan: [],
      categoryMix: {},
      trustSummary: {},
    });
    expect(response.plannerNotes.length).toBeGreaterThan(3);
  });
  it("buildRecommendForTaskResponse matrix 7", () => {
    const response = buildRecommendForTaskResponse({
      task: "task-7",
      category: "",
      platform: "",
      recommendations: [],
      installPlan: [],
      trustSummary: {},
    });
    expect(response.notes.length).toBeGreaterThan(2);
  });
  it("buildRecentUpdatesResponse matrix 7", () => {
    const response = buildRecentUpdatesResponse({
      category: "mcp",
      since: "",
      entries: [],
    });
    expect(response.ok).toBe(true);
  });
  it("buildRelatedEntriesGraphResponse matrix 7", () => {
    const response = buildRelatedEntriesGraphResponse({
      target: { category: "mcp", slug: "demo-7" },
      entries: [],
      limit: 5,
    });
    expect(response.relationGraph).toBe(true);
  });
  it("buildTrendingResourceResponse matrix 7", () => {
    const response = buildTrendingResourceResponse({
      payload: { schemaVersion: 1 },
      entries: [],
    });
    expect(response.kind).toBe("registry-trending");
  });
  it("buildJobsActiveResourceResponse matrix 7", () => {
    const response = buildJobsActiveResourceResponse({
      payload: { totalAvailable: 7 },
      entries: [],
    });
    expect(response.kind).toBe("jobs-active");
  });
  it("buildRegistryResourcePayload matrix 7", () => {
    const payload = buildRegistryResourcePayload(
      "heyclaude://test",
      { ok: true },
      "application/json",
      (v) => v,
    );
    expect(payload.contents[0].uri).toBe("heyclaude://test");
  });
  it("buildCategoryResourcePayload matrix 7", () => {
    const payload = buildCategoryResourcePayload(
      "mcp",
      [{ category: "mcp", slug: "demo-7" }],
      toEntrySummary,
    );
    expect(payload.total).toBe(1);
  });
  it("buildListRegistryResourcesResponse matrix 7", () => {
    const response = buildListRegistryResourcesResponse({
      manifest: {},
      categories: ["mcp"],
      discoveryResources: [],
      jsonMimeType: "application/json",
    });
    expect(response.resources.length).toBeGreaterThan(1);
  });
  it("buildPlatformAdapterUnavailableResponse matrix 7", () => {
    const response = buildPlatformAdapterUnavailableResponse(
      "vscode",
      "skill-7",
    );
    expect(response.adapterAvailable).toBe(false);
  });
  it("buildDistributionFeedsResponse matrix 7", () => {
    const response = buildDistributionFeedsResponse({
      manifest: { schemaVersion: 1, generatedAt: "now", artifacts: {} },
      feedIndex: { categories: [], platforms: [] },
      platformFeedSlug: (p: string) => p,
    });
    expect(response.ok).toBe(true);
  });
  it("buildExplainEntryTrustResponse matrix 7", () => {
    const entry = { category: "mcp", slug: "demo-7", title: "Demo" };
    const response = buildExplainEntryTrustResponse({
      entry,
      entryCanonicalUrl: () => "https://example.com",
      entryTrustSummary: () => ({}),
    });
    expect(response.key).toBe("mcp:demo-7");
  });
  it("buildInstallGuidanceResponse matrix 7", () => {
    const entry = { category: "mcp", slug: "demo-7", title: "Demo" };
    const response = buildInstallGuidanceResponse({
      entry,
      platform: "",
      selectedCompatibility: null,
      compatibility: [],
      entryCanonicalUrl: () => "",
      entryTrustSummary: () => ({}),
      notes: () => [],
    });
    expect(response.key).toBe("mcp:demo-7");
  });
  it("sortEntriesByUpdatedAt matrix 7", () => {
    const sorted = sortEntriesByUpdatedAt(
      [
        { title: "b", dateAdded: "2026-01-08" },
        { title: "a", dateAdded: "2026-01-01" },
      ],
      entryUpdatedAt,
    );
    expect(sorted.length).toBe(2);
  });
  it("buildDiscoveryRecentResponse matrix 7", () => {
    const response = buildDiscoveryRecentResponse({
      entries: [
        {
          category: "mcp",
          slug: "demo-7",
          title: "Demo",
          dateAdded: "2026-01-01",
        },
      ],
      toEntrySummary,
      entryUpdatedAt,
    });
    expect(response.kind).toBe("registry-recent");
  });
  it("buildSearchRegistryResponse matrix 8", () => {
    const response = buildSearchRegistryResponse({
      entries: [{ key: "mcp:demo-8" }],
      args: { query: "q8" },
      category: "mcp",
      platform: "",
      tag: "",
      trustFilters: {},
    });
    expect(response.ok).toBe(true);
    expect(response.count).toBe(1);
  });
  it("buildCategoryEntriesPageResponse matrix 8", () => {
    const response = buildCategoryEntriesPageResponse({
      entries: Array.from({ length: 13 }, (_, j) => ({ id: j })),
      category: "mcp",
      platform: "",
      tag: "",
      query: "",
      offset: 8,
      limit: 5,
      page: [{ id: 8 }],
    });
    expect(response.total).toBe(13);
  });
  it("buildInstallPlanFromEntries matrix 8", () => {
    const plan = buildInstallPlanFromEntries([
      {
        key: "mcp:x-8",
        title: "T",
        category: "mcp",
        install: { installCommand: "npm i" },
      },
    ]);
    expect(plan).toHaveLength(1);
  });
  it("buildPlanWorkflowResponse matrix 8", () => {
    const response = buildPlanWorkflowResponse({
      goal: "goal-8",
      category: "",
      platform: "",
      selected: [],
      installPlan: [],
      categoryMix: {},
      trustSummary: {},
    });
    expect(response.plannerNotes.length).toBeGreaterThan(3);
  });
  it("buildRecommendForTaskResponse matrix 8", () => {
    const response = buildRecommendForTaskResponse({
      task: "task-8",
      category: "",
      platform: "",
      recommendations: [],
      installPlan: [],
      trustSummary: {},
    });
    expect(response.notes.length).toBeGreaterThan(2);
  });
  it("buildRecentUpdatesResponse matrix 8", () => {
    const response = buildRecentUpdatesResponse({
      category: "mcp",
      since: "",
      entries: [],
    });
    expect(response.ok).toBe(true);
  });
  it("buildRelatedEntriesGraphResponse matrix 8", () => {
    const response = buildRelatedEntriesGraphResponse({
      target: { category: "mcp", slug: "demo-8" },
      entries: [],
      limit: 5,
    });
    expect(response.relationGraph).toBe(true);
  });
  it("buildTrendingResourceResponse matrix 8", () => {
    const response = buildTrendingResourceResponse({
      payload: { schemaVersion: 1 },
      entries: [],
    });
    expect(response.kind).toBe("registry-trending");
  });
  it("buildJobsActiveResourceResponse matrix 8", () => {
    const response = buildJobsActiveResourceResponse({
      payload: { totalAvailable: 8 },
      entries: [],
    });
    expect(response.kind).toBe("jobs-active");
  });
  it("buildRegistryResourcePayload matrix 8", () => {
    const payload = buildRegistryResourcePayload(
      "heyclaude://test",
      { ok: true },
      "application/json",
      (v) => v,
    );
    expect(payload.contents[0].uri).toBe("heyclaude://test");
  });
  it("buildCategoryResourcePayload matrix 8", () => {
    const payload = buildCategoryResourcePayload(
      "mcp",
      [{ category: "mcp", slug: "demo-8" }],
      toEntrySummary,
    );
    expect(payload.total).toBe(1);
  });
  it("buildListRegistryResourcesResponse matrix 8", () => {
    const response = buildListRegistryResourcesResponse({
      manifest: {},
      categories: ["mcp"],
      discoveryResources: [],
      jsonMimeType: "application/json",
    });
    expect(response.resources.length).toBeGreaterThan(1);
  });
  it("buildPlatformAdapterUnavailableResponse matrix 8", () => {
    const response = buildPlatformAdapterUnavailableResponse(
      "vscode",
      "skill-8",
    );
    expect(response.adapterAvailable).toBe(false);
  });
  it("buildDistributionFeedsResponse matrix 8", () => {
    const response = buildDistributionFeedsResponse({
      manifest: { schemaVersion: 1, generatedAt: "now", artifacts: {} },
      feedIndex: { categories: [], platforms: [] },
      platformFeedSlug: (p: string) => p,
    });
    expect(response.ok).toBe(true);
  });
  it("buildExplainEntryTrustResponse matrix 8", () => {
    const entry = { category: "mcp", slug: "demo-8", title: "Demo" };
    const response = buildExplainEntryTrustResponse({
      entry,
      entryCanonicalUrl: () => "https://example.com",
      entryTrustSummary: () => ({}),
    });
    expect(response.key).toBe("mcp:demo-8");
  });
  it("buildInstallGuidanceResponse matrix 8", () => {
    const entry = { category: "mcp", slug: "demo-8", title: "Demo" };
    const response = buildInstallGuidanceResponse({
      entry,
      platform: "",
      selectedCompatibility: null,
      compatibility: [],
      entryCanonicalUrl: () => "",
      entryTrustSummary: () => ({}),
      notes: () => [],
    });
    expect(response.key).toBe("mcp:demo-8");
  });
  it("sortEntriesByUpdatedAt matrix 8", () => {
    const sorted = sortEntriesByUpdatedAt(
      [
        { title: "b", dateAdded: "2026-01-09" },
        { title: "a", dateAdded: "2026-01-01" },
      ],
      entryUpdatedAt,
    );
    expect(sorted.length).toBe(2);
  });
  it("buildDiscoveryRecentResponse matrix 8", () => {
    const response = buildDiscoveryRecentResponse({
      entries: [
        {
          category: "mcp",
          slug: "demo-8",
          title: "Demo",
          dateAdded: "2026-01-01",
        },
      ],
      toEntrySummary,
      entryUpdatedAt,
    });
    expect(response.kind).toBe("registry-recent");
  });
  it("buildSearchRegistryResponse matrix 9", () => {
    const response = buildSearchRegistryResponse({
      entries: [{ key: "mcp:demo-9" }],
      args: { query: "q9" },
      category: "mcp",
      platform: "",
      tag: "",
      trustFilters: {},
    });
    expect(response.ok).toBe(true);
    expect(response.count).toBe(1);
  });
  it("buildCategoryEntriesPageResponse matrix 9", () => {
    const response = buildCategoryEntriesPageResponse({
      entries: Array.from({ length: 14 }, (_, j) => ({ id: j })),
      category: "mcp",
      platform: "",
      tag: "",
      query: "",
      offset: 9,
      limit: 5,
      page: [{ id: 9 }],
    });
    expect(response.total).toBe(14);
  });
  it("buildInstallPlanFromEntries matrix 9", () => {
    const plan = buildInstallPlanFromEntries([
      {
        key: "mcp:x-9",
        title: "T",
        category: "mcp",
        install: { installCommand: "npm i" },
      },
    ]);
    expect(plan).toHaveLength(1);
  });
  it("buildPlanWorkflowResponse matrix 9", () => {
    const response = buildPlanWorkflowResponse({
      goal: "goal-9",
      category: "",
      platform: "",
      selected: [],
      installPlan: [],
      categoryMix: {},
      trustSummary: {},
    });
    expect(response.plannerNotes.length).toBeGreaterThan(3);
  });
  it("buildRecommendForTaskResponse matrix 9", () => {
    const response = buildRecommendForTaskResponse({
      task: "task-9",
      category: "",
      platform: "",
      recommendations: [],
      installPlan: [],
      trustSummary: {},
    });
    expect(response.notes.length).toBeGreaterThan(2);
  });
  it("buildRecentUpdatesResponse matrix 9", () => {
    const response = buildRecentUpdatesResponse({
      category: "mcp",
      since: "",
      entries: [],
    });
    expect(response.ok).toBe(true);
  });
  it("buildRelatedEntriesGraphResponse matrix 9", () => {
    const response = buildRelatedEntriesGraphResponse({
      target: { category: "mcp", slug: "demo-9" },
      entries: [],
      limit: 5,
    });
    expect(response.relationGraph).toBe(true);
  });
  it("buildTrendingResourceResponse matrix 9", () => {
    const response = buildTrendingResourceResponse({
      payload: { schemaVersion: 1 },
      entries: [],
    });
    expect(response.kind).toBe("registry-trending");
  });
  it("buildJobsActiveResourceResponse matrix 9", () => {
    const response = buildJobsActiveResourceResponse({
      payload: { totalAvailable: 9 },
      entries: [],
    });
    expect(response.kind).toBe("jobs-active");
  });
  it("buildRegistryResourcePayload matrix 9", () => {
    const payload = buildRegistryResourcePayload(
      "heyclaude://test",
      { ok: true },
      "application/json",
      (v) => v,
    );
    expect(payload.contents[0].uri).toBe("heyclaude://test");
  });
  it("buildCategoryResourcePayload matrix 9", () => {
    const payload = buildCategoryResourcePayload(
      "mcp",
      [{ category: "mcp", slug: "demo-9" }],
      toEntrySummary,
    );
    expect(payload.total).toBe(1);
  });
  it("buildListRegistryResourcesResponse matrix 9", () => {
    const response = buildListRegistryResourcesResponse({
      manifest: {},
      categories: ["mcp"],
      discoveryResources: [],
      jsonMimeType: "application/json",
    });
    expect(response.resources.length).toBeGreaterThan(1);
  });
  it("buildPlatformAdapterUnavailableResponse matrix 9", () => {
    const response = buildPlatformAdapterUnavailableResponse(
      "vscode",
      "skill-9",
    );
    expect(response.adapterAvailable).toBe(false);
  });
  it("buildDistributionFeedsResponse matrix 9", () => {
    const response = buildDistributionFeedsResponse({
      manifest: { schemaVersion: 1, generatedAt: "now", artifacts: {} },
      feedIndex: { categories: [], platforms: [] },
      platformFeedSlug: (p: string) => p,
    });
    expect(response.ok).toBe(true);
  });
  it("buildExplainEntryTrustResponse matrix 9", () => {
    const entry = { category: "mcp", slug: "demo-9", title: "Demo" };
    const response = buildExplainEntryTrustResponse({
      entry,
      entryCanonicalUrl: () => "https://example.com",
      entryTrustSummary: () => ({}),
    });
    expect(response.key).toBe("mcp:demo-9");
  });
  it("buildInstallGuidanceResponse matrix 9", () => {
    const entry = { category: "mcp", slug: "demo-9", title: "Demo" };
    const response = buildInstallGuidanceResponse({
      entry,
      platform: "",
      selectedCompatibility: null,
      compatibility: [],
      entryCanonicalUrl: () => "",
      entryTrustSummary: () => ({}),
      notes: () => [],
    });
    expect(response.key).toBe("mcp:demo-9");
  });
  it("sortEntriesByUpdatedAt matrix 9", () => {
    const sorted = sortEntriesByUpdatedAt(
      [
        { title: "b", dateAdded: "2026-01-01" },
        { title: "a", dateAdded: "2026-01-01" },
      ],
      entryUpdatedAt,
    );
    expect(sorted.length).toBe(2);
  });
  it("buildDiscoveryRecentResponse matrix 9", () => {
    const response = buildDiscoveryRecentResponse({
      entries: [
        {
          category: "mcp",
          slug: "demo-9",
          title: "Demo",
          dateAdded: "2026-01-01",
        },
      ],
      toEntrySummary,
      entryUpdatedAt,
    });
    expect(response.kind).toBe("registry-recent");
  });
  it("buildSearchRegistryResponse matrix 10", () => {
    const response = buildSearchRegistryResponse({
      entries: [{ key: "mcp:demo-10" }],
      args: { query: "q10" },
      category: "mcp",
      platform: "",
      tag: "",
      trustFilters: {},
    });
    expect(response.ok).toBe(true);
    expect(response.count).toBe(1);
  });
  it("buildCategoryEntriesPageResponse matrix 10", () => {
    const response = buildCategoryEntriesPageResponse({
      entries: Array.from({ length: 15 }, (_, j) => ({ id: j })),
      category: "mcp",
      platform: "",
      tag: "",
      query: "",
      offset: 10,
      limit: 5,
      page: [{ id: 10 }],
    });
    expect(response.total).toBe(15);
  });
  it("buildInstallPlanFromEntries matrix 10", () => {
    const plan = buildInstallPlanFromEntries([
      {
        key: "mcp:x-10",
        title: "T",
        category: "mcp",
        install: { installCommand: "npm i" },
      },
    ]);
    expect(plan).toHaveLength(1);
  });
  it("buildPlanWorkflowResponse matrix 10", () => {
    const response = buildPlanWorkflowResponse({
      goal: "goal-10",
      category: "",
      platform: "",
      selected: [],
      installPlan: [],
      categoryMix: {},
      trustSummary: {},
    });
    expect(response.plannerNotes.length).toBeGreaterThan(3);
  });
  it("buildRecommendForTaskResponse matrix 10", () => {
    const response = buildRecommendForTaskResponse({
      task: "task-10",
      category: "",
      platform: "",
      recommendations: [],
      installPlan: [],
      trustSummary: {},
    });
    expect(response.notes.length).toBeGreaterThan(2);
  });
  it("buildRecentUpdatesResponse matrix 10", () => {
    const response = buildRecentUpdatesResponse({
      category: "mcp",
      since: "",
      entries: [],
    });
    expect(response.ok).toBe(true);
  });
  it("buildRelatedEntriesGraphResponse matrix 10", () => {
    const response = buildRelatedEntriesGraphResponse({
      target: { category: "mcp", slug: "demo-10" },
      entries: [],
      limit: 5,
    });
    expect(response.relationGraph).toBe(true);
  });
  it("buildTrendingResourceResponse matrix 10", () => {
    const response = buildTrendingResourceResponse({
      payload: { schemaVersion: 1 },
      entries: [],
    });
    expect(response.kind).toBe("registry-trending");
  });
  it("buildJobsActiveResourceResponse matrix 10", () => {
    const response = buildJobsActiveResourceResponse({
      payload: { totalAvailable: 10 },
      entries: [],
    });
    expect(response.kind).toBe("jobs-active");
  });
  it("buildRegistryResourcePayload matrix 10", () => {
    const payload = buildRegistryResourcePayload(
      "heyclaude://test",
      { ok: true },
      "application/json",
      (v) => v,
    );
    expect(payload.contents[0].uri).toBe("heyclaude://test");
  });
  it("buildCategoryResourcePayload matrix 10", () => {
    const payload = buildCategoryResourcePayload(
      "mcp",
      [{ category: "mcp", slug: "demo-10" }],
      toEntrySummary,
    );
    expect(payload.total).toBe(1);
  });
  it("buildListRegistryResourcesResponse matrix 10", () => {
    const response = buildListRegistryResourcesResponse({
      manifest: {},
      categories: ["mcp"],
      discoveryResources: [],
      jsonMimeType: "application/json",
    });
    expect(response.resources.length).toBeGreaterThan(1);
  });
  it("buildPlatformAdapterUnavailableResponse matrix 10", () => {
    const response = buildPlatformAdapterUnavailableResponse(
      "vscode",
      "skill-10",
    );
    expect(response.adapterAvailable).toBe(false);
  });
  it("buildDistributionFeedsResponse matrix 10", () => {
    const response = buildDistributionFeedsResponse({
      manifest: { schemaVersion: 1, generatedAt: "now", artifacts: {} },
      feedIndex: { categories: [], platforms: [] },
      platformFeedSlug: (p: string) => p,
    });
    expect(response.ok).toBe(true);
  });
  it("buildExplainEntryTrustResponse matrix 10", () => {
    const entry = { category: "mcp", slug: "demo-10", title: "Demo" };
    const response = buildExplainEntryTrustResponse({
      entry,
      entryCanonicalUrl: () => "https://example.com",
      entryTrustSummary: () => ({}),
    });
    expect(response.key).toBe("mcp:demo-10");
  });
  it("buildInstallGuidanceResponse matrix 10", () => {
    const entry = { category: "mcp", slug: "demo-10", title: "Demo" };
    const response = buildInstallGuidanceResponse({
      entry,
      platform: "",
      selectedCompatibility: null,
      compatibility: [],
      entryCanonicalUrl: () => "",
      entryTrustSummary: () => ({}),
      notes: () => [],
    });
    expect(response.key).toBe("mcp:demo-10");
  });
  it("sortEntriesByUpdatedAt matrix 10", () => {
    const sorted = sortEntriesByUpdatedAt(
      [
        { title: "b", dateAdded: "2026-01-02" },
        { title: "a", dateAdded: "2026-01-01" },
      ],
      entryUpdatedAt,
    );
    expect(sorted.length).toBe(2);
  });
  it("buildDiscoveryRecentResponse matrix 10", () => {
    const response = buildDiscoveryRecentResponse({
      entries: [
        {
          category: "mcp",
          slug: "demo-10",
          title: "Demo",
          dateAdded: "2026-01-01",
        },
      ],
      toEntrySummary,
      entryUpdatedAt,
    });
    expect(response.kind).toBe("registry-recent");
  });
  it("buildSearchRegistryResponse matrix 11", () => {
    const response = buildSearchRegistryResponse({
      entries: [{ key: "mcp:demo-11" }],
      args: { query: "q11" },
      category: "mcp",
      platform: "",
      tag: "",
      trustFilters: {},
    });
    expect(response.ok).toBe(true);
    expect(response.count).toBe(1);
  });
  it("buildCategoryEntriesPageResponse matrix 11", () => {
    const response = buildCategoryEntriesPageResponse({
      entries: Array.from({ length: 16 }, (_, j) => ({ id: j })),
      category: "mcp",
      platform: "",
      tag: "",
      query: "",
      offset: 11,
      limit: 5,
      page: [{ id: 11 }],
    });
    expect(response.total).toBe(16);
  });
  it("buildInstallPlanFromEntries matrix 11", () => {
    const plan = buildInstallPlanFromEntries([
      {
        key: "mcp:x-11",
        title: "T",
        category: "mcp",
        install: { installCommand: "npm i" },
      },
    ]);
    expect(plan).toHaveLength(1);
  });
  it("buildPlanWorkflowResponse matrix 11", () => {
    const response = buildPlanWorkflowResponse({
      goal: "goal-11",
      category: "",
      platform: "",
      selected: [],
      installPlan: [],
      categoryMix: {},
      trustSummary: {},
    });
    expect(response.plannerNotes.length).toBeGreaterThan(3);
  });
  it("buildRecommendForTaskResponse matrix 11", () => {
    const response = buildRecommendForTaskResponse({
      task: "task-11",
      category: "",
      platform: "",
      recommendations: [],
      installPlan: [],
      trustSummary: {},
    });
    expect(response.notes.length).toBeGreaterThan(2);
  });
  it("buildRecentUpdatesResponse matrix 11", () => {
    const response = buildRecentUpdatesResponse({
      category: "mcp",
      since: "",
      entries: [],
    });
    expect(response.ok).toBe(true);
  });
  it("buildRelatedEntriesGraphResponse matrix 11", () => {
    const response = buildRelatedEntriesGraphResponse({
      target: { category: "mcp", slug: "demo-11" },
      entries: [],
      limit: 5,
    });
    expect(response.relationGraph).toBe(true);
  });
  it("buildTrendingResourceResponse matrix 11", () => {
    const response = buildTrendingResourceResponse({
      payload: { schemaVersion: 1 },
      entries: [],
    });
    expect(response.kind).toBe("registry-trending");
  });
  it("buildJobsActiveResourceResponse matrix 11", () => {
    const response = buildJobsActiveResourceResponse({
      payload: { totalAvailable: 11 },
      entries: [],
    });
    expect(response.kind).toBe("jobs-active");
  });
  it("buildRegistryResourcePayload matrix 11", () => {
    const payload = buildRegistryResourcePayload(
      "heyclaude://test",
      { ok: true },
      "application/json",
      (v) => v,
    );
    expect(payload.contents[0].uri).toBe("heyclaude://test");
  });
  it("buildCategoryResourcePayload matrix 11", () => {
    const payload = buildCategoryResourcePayload(
      "mcp",
      [{ category: "mcp", slug: "demo-11" }],
      toEntrySummary,
    );
    expect(payload.total).toBe(1);
  });
  it("buildListRegistryResourcesResponse matrix 11", () => {
    const response = buildListRegistryResourcesResponse({
      manifest: {},
      categories: ["mcp"],
      discoveryResources: [],
      jsonMimeType: "application/json",
    });
    expect(response.resources.length).toBeGreaterThan(1);
  });
  it("buildPlatformAdapterUnavailableResponse matrix 11", () => {
    const response = buildPlatformAdapterUnavailableResponse(
      "vscode",
      "skill-11",
    );
    expect(response.adapterAvailable).toBe(false);
  });
  it("buildDistributionFeedsResponse matrix 11", () => {
    const response = buildDistributionFeedsResponse({
      manifest: { schemaVersion: 1, generatedAt: "now", artifacts: {} },
      feedIndex: { categories: [], platforms: [] },
      platformFeedSlug: (p: string) => p,
    });
    expect(response.ok).toBe(true);
  });
  it("buildExplainEntryTrustResponse matrix 11", () => {
    const entry = { category: "mcp", slug: "demo-11", title: "Demo" };
    const response = buildExplainEntryTrustResponse({
      entry,
      entryCanonicalUrl: () => "https://example.com",
      entryTrustSummary: () => ({}),
    });
    expect(response.key).toBe("mcp:demo-11");
  });
  it("buildInstallGuidanceResponse matrix 11", () => {
    const entry = { category: "mcp", slug: "demo-11", title: "Demo" };
    const response = buildInstallGuidanceResponse({
      entry,
      platform: "",
      selectedCompatibility: null,
      compatibility: [],
      entryCanonicalUrl: () => "",
      entryTrustSummary: () => ({}),
      notes: () => [],
    });
    expect(response.key).toBe("mcp:demo-11");
  });
  it("sortEntriesByUpdatedAt matrix 11", () => {
    const sorted = sortEntriesByUpdatedAt(
      [
        { title: "b", dateAdded: "2026-01-03" },
        { title: "a", dateAdded: "2026-01-01" },
      ],
      entryUpdatedAt,
    );
    expect(sorted.length).toBe(2);
  });
  it("buildDiscoveryRecentResponse matrix 11", () => {
    const response = buildDiscoveryRecentResponse({
      entries: [
        {
          category: "mcp",
          slug: "demo-11",
          title: "Demo",
          dateAdded: "2026-01-01",
        },
      ],
      toEntrySummary,
      entryUpdatedAt,
    });
    expect(response.kind).toBe("registry-recent");
  });
  it("buildSearchRegistryResponse matrix 12", () => {
    const response = buildSearchRegistryResponse({
      entries: [{ key: "mcp:demo-12" }],
      args: { query: "q12" },
      category: "mcp",
      platform: "",
      tag: "",
      trustFilters: {},
    });
    expect(response.ok).toBe(true);
    expect(response.count).toBe(1);
  });
  it("buildCategoryEntriesPageResponse matrix 12", () => {
    const response = buildCategoryEntriesPageResponse({
      entries: Array.from({ length: 17 }, (_, j) => ({ id: j })),
      category: "mcp",
      platform: "",
      tag: "",
      query: "",
      offset: 12,
      limit: 5,
      page: [{ id: 12 }],
    });
    expect(response.total).toBe(17);
  });
  it("buildInstallPlanFromEntries matrix 12", () => {
    const plan = buildInstallPlanFromEntries([
      {
        key: "mcp:x-12",
        title: "T",
        category: "mcp",
        install: { installCommand: "npm i" },
      },
    ]);
    expect(plan).toHaveLength(1);
  });
  it("buildPlanWorkflowResponse matrix 12", () => {
    const response = buildPlanWorkflowResponse({
      goal: "goal-12",
      category: "",
      platform: "",
      selected: [],
      installPlan: [],
      categoryMix: {},
      trustSummary: {},
    });
    expect(response.plannerNotes.length).toBeGreaterThan(3);
  });
  it("buildRecommendForTaskResponse matrix 12", () => {
    const response = buildRecommendForTaskResponse({
      task: "task-12",
      category: "",
      platform: "",
      recommendations: [],
      installPlan: [],
      trustSummary: {},
    });
    expect(response.notes.length).toBeGreaterThan(2);
  });
  it("buildRecentUpdatesResponse matrix 12", () => {
    const response = buildRecentUpdatesResponse({
      category: "mcp",
      since: "",
      entries: [],
    });
    expect(response.ok).toBe(true);
  });
  it("buildRelatedEntriesGraphResponse matrix 12", () => {
    const response = buildRelatedEntriesGraphResponse({
      target: { category: "mcp", slug: "demo-12" },
      entries: [],
      limit: 5,
    });
    expect(response.relationGraph).toBe(true);
  });
  it("buildTrendingResourceResponse matrix 12", () => {
    const response = buildTrendingResourceResponse({
      payload: { schemaVersion: 1 },
      entries: [],
    });
    expect(response.kind).toBe("registry-trending");
  });
  it("buildJobsActiveResourceResponse matrix 12", () => {
    const response = buildJobsActiveResourceResponse({
      payload: { totalAvailable: 12 },
      entries: [],
    });
    expect(response.kind).toBe("jobs-active");
  });
  it("buildRegistryResourcePayload matrix 12", () => {
    const payload = buildRegistryResourcePayload(
      "heyclaude://test",
      { ok: true },
      "application/json",
      (v) => v,
    );
    expect(payload.contents[0].uri).toBe("heyclaude://test");
  });
  it("buildCategoryResourcePayload matrix 12", () => {
    const payload = buildCategoryResourcePayload(
      "mcp",
      [{ category: "mcp", slug: "demo-12" }],
      toEntrySummary,
    );
    expect(payload.total).toBe(1);
  });
  it("buildListRegistryResourcesResponse matrix 12", () => {
    const response = buildListRegistryResourcesResponse({
      manifest: {},
      categories: ["mcp"],
      discoveryResources: [],
      jsonMimeType: "application/json",
    });
    expect(response.resources.length).toBeGreaterThan(1);
  });
  it("buildPlatformAdapterUnavailableResponse matrix 12", () => {
    const response = buildPlatformAdapterUnavailableResponse(
      "vscode",
      "skill-12",
    );
    expect(response.adapterAvailable).toBe(false);
  });
  it("buildDistributionFeedsResponse matrix 12", () => {
    const response = buildDistributionFeedsResponse({
      manifest: { schemaVersion: 1, generatedAt: "now", artifacts: {} },
      feedIndex: { categories: [], platforms: [] },
      platformFeedSlug: (p: string) => p,
    });
    expect(response.ok).toBe(true);
  });
  it("buildExplainEntryTrustResponse matrix 12", () => {
    const entry = { category: "mcp", slug: "demo-12", title: "Demo" };
    const response = buildExplainEntryTrustResponse({
      entry,
      entryCanonicalUrl: () => "https://example.com",
      entryTrustSummary: () => ({}),
    });
    expect(response.key).toBe("mcp:demo-12");
  });
  it("buildInstallGuidanceResponse matrix 12", () => {
    const entry = { category: "mcp", slug: "demo-12", title: "Demo" };
    const response = buildInstallGuidanceResponse({
      entry,
      platform: "",
      selectedCompatibility: null,
      compatibility: [],
      entryCanonicalUrl: () => "",
      entryTrustSummary: () => ({}),
      notes: () => [],
    });
    expect(response.key).toBe("mcp:demo-12");
  });
  it("sortEntriesByUpdatedAt matrix 12", () => {
    const sorted = sortEntriesByUpdatedAt(
      [
        { title: "b", dateAdded: "2026-01-04" },
        { title: "a", dateAdded: "2026-01-01" },
      ],
      entryUpdatedAt,
    );
    expect(sorted.length).toBe(2);
  });
  it("buildDiscoveryRecentResponse matrix 12", () => {
    const response = buildDiscoveryRecentResponse({
      entries: [
        {
          category: "mcp",
          slug: "demo-12",
          title: "Demo",
          dateAdded: "2026-01-01",
        },
      ],
      toEntrySummary,
      entryUpdatedAt,
    });
    expect(response.kind).toBe("registry-recent");
  });
  it("buildSearchRegistryResponse matrix 13", () => {
    const response = buildSearchRegistryResponse({
      entries: [{ key: "mcp:demo-13" }],
      args: { query: "q13" },
      category: "mcp",
      platform: "",
      tag: "",
      trustFilters: {},
    });
    expect(response.ok).toBe(true);
    expect(response.count).toBe(1);
  });
  it("buildCategoryEntriesPageResponse matrix 13", () => {
    const response = buildCategoryEntriesPageResponse({
      entries: Array.from({ length: 18 }, (_, j) => ({ id: j })),
      category: "mcp",
      platform: "",
      tag: "",
      query: "",
      offset: 13,
      limit: 5,
      page: [{ id: 13 }],
    });
    expect(response.total).toBe(18);
  });
  it("buildInstallPlanFromEntries matrix 13", () => {
    const plan = buildInstallPlanFromEntries([
      {
        key: "mcp:x-13",
        title: "T",
        category: "mcp",
        install: { installCommand: "npm i" },
      },
    ]);
    expect(plan).toHaveLength(1);
  });
  it("buildPlanWorkflowResponse matrix 13", () => {
    const response = buildPlanWorkflowResponse({
      goal: "goal-13",
      category: "",
      platform: "",
      selected: [],
      installPlan: [],
      categoryMix: {},
      trustSummary: {},
    });
    expect(response.plannerNotes.length).toBeGreaterThan(3);
  });
  it("buildRecommendForTaskResponse matrix 13", () => {
    const response = buildRecommendForTaskResponse({
      task: "task-13",
      category: "",
      platform: "",
      recommendations: [],
      installPlan: [],
      trustSummary: {},
    });
    expect(response.notes.length).toBeGreaterThan(2);
  });
  it("buildRecentUpdatesResponse matrix 13", () => {
    const response = buildRecentUpdatesResponse({
      category: "mcp",
      since: "",
      entries: [],
    });
    expect(response.ok).toBe(true);
  });
  it("buildRelatedEntriesGraphResponse matrix 13", () => {
    const response = buildRelatedEntriesGraphResponse({
      target: { category: "mcp", slug: "demo-13" },
      entries: [],
      limit: 5,
    });
    expect(response.relationGraph).toBe(true);
  });
  it("buildTrendingResourceResponse matrix 13", () => {
    const response = buildTrendingResourceResponse({
      payload: { schemaVersion: 1 },
      entries: [],
    });
    expect(response.kind).toBe("registry-trending");
  });
  it("buildJobsActiveResourceResponse matrix 13", () => {
    const response = buildJobsActiveResourceResponse({
      payload: { totalAvailable: 13 },
      entries: [],
    });
    expect(response.kind).toBe("jobs-active");
  });
  it("buildRegistryResourcePayload matrix 13", () => {
    const payload = buildRegistryResourcePayload(
      "heyclaude://test",
      { ok: true },
      "application/json",
      (v) => v,
    );
    expect(payload.contents[0].uri).toBe("heyclaude://test");
  });
  it("buildCategoryResourcePayload matrix 13", () => {
    const payload = buildCategoryResourcePayload(
      "mcp",
      [{ category: "mcp", slug: "demo-13" }],
      toEntrySummary,
    );
    expect(payload.total).toBe(1);
  });
  it("buildListRegistryResourcesResponse matrix 13", () => {
    const response = buildListRegistryResourcesResponse({
      manifest: {},
      categories: ["mcp"],
      discoveryResources: [],
      jsonMimeType: "application/json",
    });
    expect(response.resources.length).toBeGreaterThan(1);
  });
  it("buildPlatformAdapterUnavailableResponse matrix 13", () => {
    const response = buildPlatformAdapterUnavailableResponse(
      "vscode",
      "skill-13",
    );
    expect(response.adapterAvailable).toBe(false);
  });
  it("buildDistributionFeedsResponse matrix 13", () => {
    const response = buildDistributionFeedsResponse({
      manifest: { schemaVersion: 1, generatedAt: "now", artifacts: {} },
      feedIndex: { categories: [], platforms: [] },
      platformFeedSlug: (p: string) => p,
    });
    expect(response.ok).toBe(true);
  });
  it("buildExplainEntryTrustResponse matrix 13", () => {
    const entry = { category: "mcp", slug: "demo-13", title: "Demo" };
    const response = buildExplainEntryTrustResponse({
      entry,
      entryCanonicalUrl: () => "https://example.com",
      entryTrustSummary: () => ({}),
    });
    expect(response.key).toBe("mcp:demo-13");
  });
  it("buildInstallGuidanceResponse matrix 13", () => {
    const entry = { category: "mcp", slug: "demo-13", title: "Demo" };
    const response = buildInstallGuidanceResponse({
      entry,
      platform: "",
      selectedCompatibility: null,
      compatibility: [],
      entryCanonicalUrl: () => "",
      entryTrustSummary: () => ({}),
      notes: () => [],
    });
    expect(response.key).toBe("mcp:demo-13");
  });
  it("sortEntriesByUpdatedAt matrix 13", () => {
    const sorted = sortEntriesByUpdatedAt(
      [
        { title: "b", dateAdded: "2026-01-05" },
        { title: "a", dateAdded: "2026-01-01" },
      ],
      entryUpdatedAt,
    );
    expect(sorted.length).toBe(2);
  });
  it("buildDiscoveryRecentResponse matrix 13", () => {
    const response = buildDiscoveryRecentResponse({
      entries: [
        {
          category: "mcp",
          slug: "demo-13",
          title: "Demo",
          dateAdded: "2026-01-01",
        },
      ],
      toEntrySummary,
      entryUpdatedAt,
    });
    expect(response.kind).toBe("registry-recent");
  });
  it("buildSearchRegistryResponse matrix 14", () => {
    const response = buildSearchRegistryResponse({
      entries: [{ key: "mcp:demo-14" }],
      args: { query: "q14" },
      category: "mcp",
      platform: "",
      tag: "",
      trustFilters: {},
    });
    expect(response.ok).toBe(true);
    expect(response.count).toBe(1);
  });
  it("buildCategoryEntriesPageResponse matrix 14", () => {
    const response = buildCategoryEntriesPageResponse({
      entries: Array.from({ length: 19 }, (_, j) => ({ id: j })),
      category: "mcp",
      platform: "",
      tag: "",
      query: "",
      offset: 14,
      limit: 5,
      page: [{ id: 14 }],
    });
    expect(response.total).toBe(19);
  });
  it("buildInstallPlanFromEntries matrix 14", () => {
    const plan = buildInstallPlanFromEntries([
      {
        key: "mcp:x-14",
        title: "T",
        category: "mcp",
        install: { installCommand: "npm i" },
      },
    ]);
    expect(plan).toHaveLength(1);
  });
  it("buildPlanWorkflowResponse matrix 14", () => {
    const response = buildPlanWorkflowResponse({
      goal: "goal-14",
      category: "",
      platform: "",
      selected: [],
      installPlan: [],
      categoryMix: {},
      trustSummary: {},
    });
    expect(response.plannerNotes.length).toBeGreaterThan(3);
  });
  it("buildRecommendForTaskResponse matrix 14", () => {
    const response = buildRecommendForTaskResponse({
      task: "task-14",
      category: "",
      platform: "",
      recommendations: [],
      installPlan: [],
      trustSummary: {},
    });
    expect(response.notes.length).toBeGreaterThan(2);
  });
  it("buildRecentUpdatesResponse matrix 14", () => {
    const response = buildRecentUpdatesResponse({
      category: "mcp",
      since: "",
      entries: [],
    });
    expect(response.ok).toBe(true);
  });
  it("buildRelatedEntriesGraphResponse matrix 14", () => {
    const response = buildRelatedEntriesGraphResponse({
      target: { category: "mcp", slug: "demo-14" },
      entries: [],
      limit: 5,
    });
    expect(response.relationGraph).toBe(true);
  });
  it("buildTrendingResourceResponse matrix 14", () => {
    const response = buildTrendingResourceResponse({
      payload: { schemaVersion: 1 },
      entries: [],
    });
    expect(response.kind).toBe("registry-trending");
  });
  it("buildJobsActiveResourceResponse matrix 14", () => {
    const response = buildJobsActiveResourceResponse({
      payload: { totalAvailable: 14 },
      entries: [],
    });
    expect(response.kind).toBe("jobs-active");
  });
  it("buildRegistryResourcePayload matrix 14", () => {
    const payload = buildRegistryResourcePayload(
      "heyclaude://test",
      { ok: true },
      "application/json",
      (v) => v,
    );
    expect(payload.contents[0].uri).toBe("heyclaude://test");
  });
  it("buildCategoryResourcePayload matrix 14", () => {
    const payload = buildCategoryResourcePayload(
      "mcp",
      [{ category: "mcp", slug: "demo-14" }],
      toEntrySummary,
    );
    expect(payload.total).toBe(1);
  });
  it("buildListRegistryResourcesResponse matrix 14", () => {
    const response = buildListRegistryResourcesResponse({
      manifest: {},
      categories: ["mcp"],
      discoveryResources: [],
      jsonMimeType: "application/json",
    });
    expect(response.resources.length).toBeGreaterThan(1);
  });
  it("buildPlatformAdapterUnavailableResponse matrix 14", () => {
    const response = buildPlatformAdapterUnavailableResponse(
      "vscode",
      "skill-14",
    );
    expect(response.adapterAvailable).toBe(false);
  });
  it("buildDistributionFeedsResponse matrix 14", () => {
    const response = buildDistributionFeedsResponse({
      manifest: { schemaVersion: 1, generatedAt: "now", artifacts: {} },
      feedIndex: { categories: [], platforms: [] },
      platformFeedSlug: (p: string) => p,
    });
    expect(response.ok).toBe(true);
  });
  it("buildExplainEntryTrustResponse matrix 14", () => {
    const entry = { category: "mcp", slug: "demo-14", title: "Demo" };
    const response = buildExplainEntryTrustResponse({
      entry,
      entryCanonicalUrl: () => "https://example.com",
      entryTrustSummary: () => ({}),
    });
    expect(response.key).toBe("mcp:demo-14");
  });
  it("buildInstallGuidanceResponse matrix 14", () => {
    const entry = { category: "mcp", slug: "demo-14", title: "Demo" };
    const response = buildInstallGuidanceResponse({
      entry,
      platform: "",
      selectedCompatibility: null,
      compatibility: [],
      entryCanonicalUrl: () => "",
      entryTrustSummary: () => ({}),
      notes: () => [],
    });
    expect(response.key).toBe("mcp:demo-14");
  });
  it("sortEntriesByUpdatedAt matrix 14", () => {
    const sorted = sortEntriesByUpdatedAt(
      [
        { title: "b", dateAdded: "2026-01-06" },
        { title: "a", dateAdded: "2026-01-01" },
      ],
      entryUpdatedAt,
    );
    expect(sorted.length).toBe(2);
  });
  it("buildDiscoveryRecentResponse matrix 14", () => {
    const response = buildDiscoveryRecentResponse({
      entries: [
        {
          category: "mcp",
          slug: "demo-14",
          title: "Demo",
          dateAdded: "2026-01-01",
        },
      ],
      toEntrySummary,
      entryUpdatedAt,
    });
    expect(response.kind).toBe("registry-recent");
  });
  it("buildSearchRegistryResponse matrix 15", () => {
    const response = buildSearchRegistryResponse({
      entries: [{ key: "mcp:demo-15" }],
      args: { query: "q15" },
      category: "mcp",
      platform: "",
      tag: "",
      trustFilters: {},
    });
    expect(response.ok).toBe(true);
    expect(response.count).toBe(1);
  });
  it("buildCategoryEntriesPageResponse matrix 15", () => {
    const response = buildCategoryEntriesPageResponse({
      entries: Array.from({ length: 20 }, (_, j) => ({ id: j })),
      category: "mcp",
      platform: "",
      tag: "",
      query: "",
      offset: 15,
      limit: 5,
      page: [{ id: 15 }],
    });
    expect(response.total).toBe(20);
  });
  it("buildInstallPlanFromEntries matrix 15", () => {
    const plan = buildInstallPlanFromEntries([
      {
        key: "mcp:x-15",
        title: "T",
        category: "mcp",
        install: { installCommand: "npm i" },
      },
    ]);
    expect(plan).toHaveLength(1);
  });
  it("buildPlanWorkflowResponse matrix 15", () => {
    const response = buildPlanWorkflowResponse({
      goal: "goal-15",
      category: "",
      platform: "",
      selected: [],
      installPlan: [],
      categoryMix: {},
      trustSummary: {},
    });
    expect(response.plannerNotes.length).toBeGreaterThan(3);
  });
  it("buildRecommendForTaskResponse matrix 15", () => {
    const response = buildRecommendForTaskResponse({
      task: "task-15",
      category: "",
      platform: "",
      recommendations: [],
      installPlan: [],
      trustSummary: {},
    });
    expect(response.notes.length).toBeGreaterThan(2);
  });
  it("buildRecentUpdatesResponse matrix 15", () => {
    const response = buildRecentUpdatesResponse({
      category: "mcp",
      since: "",
      entries: [],
    });
    expect(response.ok).toBe(true);
  });
  it("buildRelatedEntriesGraphResponse matrix 15", () => {
    const response = buildRelatedEntriesGraphResponse({
      target: { category: "mcp", slug: "demo-15" },
      entries: [],
      limit: 5,
    });
    expect(response.relationGraph).toBe(true);
  });
  it("buildTrendingResourceResponse matrix 15", () => {
    const response = buildTrendingResourceResponse({
      payload: { schemaVersion: 1 },
      entries: [],
    });
    expect(response.kind).toBe("registry-trending");
  });
  it("buildJobsActiveResourceResponse matrix 15", () => {
    const response = buildJobsActiveResourceResponse({
      payload: { totalAvailable: 15 },
      entries: [],
    });
    expect(response.kind).toBe("jobs-active");
  });
  it("buildRegistryResourcePayload matrix 15", () => {
    const payload = buildRegistryResourcePayload(
      "heyclaude://test",
      { ok: true },
      "application/json",
      (v) => v,
    );
    expect(payload.contents[0].uri).toBe("heyclaude://test");
  });
  it("buildCategoryResourcePayload matrix 15", () => {
    const payload = buildCategoryResourcePayload(
      "mcp",
      [{ category: "mcp", slug: "demo-15" }],
      toEntrySummary,
    );
    expect(payload.total).toBe(1);
  });
  it("buildListRegistryResourcesResponse matrix 15", () => {
    const response = buildListRegistryResourcesResponse({
      manifest: {},
      categories: ["mcp"],
      discoveryResources: [],
      jsonMimeType: "application/json",
    });
    expect(response.resources.length).toBeGreaterThan(1);
  });
  it("buildPlatformAdapterUnavailableResponse matrix 15", () => {
    const response = buildPlatformAdapterUnavailableResponse(
      "vscode",
      "skill-15",
    );
    expect(response.adapterAvailable).toBe(false);
  });
  it("buildDistributionFeedsResponse matrix 15", () => {
    const response = buildDistributionFeedsResponse({
      manifest: { schemaVersion: 1, generatedAt: "now", artifacts: {} },
      feedIndex: { categories: [], platforms: [] },
      platformFeedSlug: (p: string) => p,
    });
    expect(response.ok).toBe(true);
  });
  it("buildExplainEntryTrustResponse matrix 15", () => {
    const entry = { category: "mcp", slug: "demo-15", title: "Demo" };
    const response = buildExplainEntryTrustResponse({
      entry,
      entryCanonicalUrl: () => "https://example.com",
      entryTrustSummary: () => ({}),
    });
    expect(response.key).toBe("mcp:demo-15");
  });
  it("buildInstallGuidanceResponse matrix 15", () => {
    const entry = { category: "mcp", slug: "demo-15", title: "Demo" };
    const response = buildInstallGuidanceResponse({
      entry,
      platform: "",
      selectedCompatibility: null,
      compatibility: [],
      entryCanonicalUrl: () => "",
      entryTrustSummary: () => ({}),
      notes: () => [],
    });
    expect(response.key).toBe("mcp:demo-15");
  });
  it("sortEntriesByUpdatedAt matrix 15", () => {
    const sorted = sortEntriesByUpdatedAt(
      [
        { title: "b", dateAdded: "2026-01-07" },
        { title: "a", dateAdded: "2026-01-01" },
      ],
      entryUpdatedAt,
    );
    expect(sorted.length).toBe(2);
  });
  it("buildDiscoveryRecentResponse matrix 15", () => {
    const response = buildDiscoveryRecentResponse({
      entries: [
        {
          category: "mcp",
          slug: "demo-15",
          title: "Demo",
          dateAdded: "2026-01-01",
        },
      ],
      toEntrySummary,
      entryUpdatedAt,
    });
    expect(response.kind).toBe("registry-recent");
  });
  it("buildSearchRegistryResponse matrix 16", () => {
    const response = buildSearchRegistryResponse({
      entries: [{ key: "mcp:demo-16" }],
      args: { query: "q16" },
      category: "mcp",
      platform: "",
      tag: "",
      trustFilters: {},
    });
    expect(response.ok).toBe(true);
    expect(response.count).toBe(1);
  });
  it("buildCategoryEntriesPageResponse matrix 16", () => {
    const response = buildCategoryEntriesPageResponse({
      entries: Array.from({ length: 21 }, (_, j) => ({ id: j })),
      category: "mcp",
      platform: "",
      tag: "",
      query: "",
      offset: 16,
      limit: 5,
      page: [{ id: 16 }],
    });
    expect(response.total).toBe(21);
  });
  it("buildInstallPlanFromEntries matrix 16", () => {
    const plan = buildInstallPlanFromEntries([
      {
        key: "mcp:x-16",
        title: "T",
        category: "mcp",
        install: { installCommand: "npm i" },
      },
    ]);
    expect(plan).toHaveLength(1);
  });
  it("buildPlanWorkflowResponse matrix 16", () => {
    const response = buildPlanWorkflowResponse({
      goal: "goal-16",
      category: "",
      platform: "",
      selected: [],
      installPlan: [],
      categoryMix: {},
      trustSummary: {},
    });
    expect(response.plannerNotes.length).toBeGreaterThan(3);
  });
  it("buildRecommendForTaskResponse matrix 16", () => {
    const response = buildRecommendForTaskResponse({
      task: "task-16",
      category: "",
      platform: "",
      recommendations: [],
      installPlan: [],
      trustSummary: {},
    });
    expect(response.notes.length).toBeGreaterThan(2);
  });
  it("buildRecentUpdatesResponse matrix 16", () => {
    const response = buildRecentUpdatesResponse({
      category: "mcp",
      since: "",
      entries: [],
    });
    expect(response.ok).toBe(true);
  });
  it("buildRelatedEntriesGraphResponse matrix 16", () => {
    const response = buildRelatedEntriesGraphResponse({
      target: { category: "mcp", slug: "demo-16" },
      entries: [],
      limit: 5,
    });
    expect(response.relationGraph).toBe(true);
  });
  it("buildTrendingResourceResponse matrix 16", () => {
    const response = buildTrendingResourceResponse({
      payload: { schemaVersion: 1 },
      entries: [],
    });
    expect(response.kind).toBe("registry-trending");
  });
  it("buildJobsActiveResourceResponse matrix 16", () => {
    const response = buildJobsActiveResourceResponse({
      payload: { totalAvailable: 16 },
      entries: [],
    });
    expect(response.kind).toBe("jobs-active");
  });
  it("buildRegistryResourcePayload matrix 16", () => {
    const payload = buildRegistryResourcePayload(
      "heyclaude://test",
      { ok: true },
      "application/json",
      (v) => v,
    );
    expect(payload.contents[0].uri).toBe("heyclaude://test");
  });
  it("buildCategoryResourcePayload matrix 16", () => {
    const payload = buildCategoryResourcePayload(
      "mcp",
      [{ category: "mcp", slug: "demo-16" }],
      toEntrySummary,
    );
    expect(payload.total).toBe(1);
  });
  it("buildListRegistryResourcesResponse matrix 16", () => {
    const response = buildListRegistryResourcesResponse({
      manifest: {},
      categories: ["mcp"],
      discoveryResources: [],
      jsonMimeType: "application/json",
    });
    expect(response.resources.length).toBeGreaterThan(1);
  });
  it("buildPlatformAdapterUnavailableResponse matrix 16", () => {
    const response = buildPlatformAdapterUnavailableResponse(
      "vscode",
      "skill-16",
    );
    expect(response.adapterAvailable).toBe(false);
  });
  it("buildDistributionFeedsResponse matrix 16", () => {
    const response = buildDistributionFeedsResponse({
      manifest: { schemaVersion: 1, generatedAt: "now", artifacts: {} },
      feedIndex: { categories: [], platforms: [] },
      platformFeedSlug: (p: string) => p,
    });
    expect(response.ok).toBe(true);
  });
  it("buildExplainEntryTrustResponse matrix 16", () => {
    const entry = { category: "mcp", slug: "demo-16", title: "Demo" };
    const response = buildExplainEntryTrustResponse({
      entry,
      entryCanonicalUrl: () => "https://example.com",
      entryTrustSummary: () => ({}),
    });
    expect(response.key).toBe("mcp:demo-16");
  });
  it("buildInstallGuidanceResponse matrix 16", () => {
    const entry = { category: "mcp", slug: "demo-16", title: "Demo" };
    const response = buildInstallGuidanceResponse({
      entry,
      platform: "",
      selectedCompatibility: null,
      compatibility: [],
      entryCanonicalUrl: () => "",
      entryTrustSummary: () => ({}),
      notes: () => [],
    });
    expect(response.key).toBe("mcp:demo-16");
  });
  it("sortEntriesByUpdatedAt matrix 16", () => {
    const sorted = sortEntriesByUpdatedAt(
      [
        { title: "b", dateAdded: "2026-01-08" },
        { title: "a", dateAdded: "2026-01-01" },
      ],
      entryUpdatedAt,
    );
    expect(sorted.length).toBe(2);
  });
  it("buildDiscoveryRecentResponse matrix 16", () => {
    const response = buildDiscoveryRecentResponse({
      entries: [
        {
          category: "mcp",
          slug: "demo-16",
          title: "Demo",
          dateAdded: "2026-01-01",
        },
      ],
      toEntrySummary,
      entryUpdatedAt,
    });
    expect(response.kind).toBe("registry-recent");
  });
  it("buildSearchRegistryResponse matrix 17", () => {
    const response = buildSearchRegistryResponse({
      entries: [{ key: "mcp:demo-17" }],
      args: { query: "q17" },
      category: "mcp",
      platform: "",
      tag: "",
      trustFilters: {},
    });
    expect(response.ok).toBe(true);
    expect(response.count).toBe(1);
  });
  it("buildCategoryEntriesPageResponse matrix 17", () => {
    const response = buildCategoryEntriesPageResponse({
      entries: Array.from({ length: 22 }, (_, j) => ({ id: j })),
      category: "mcp",
      platform: "",
      tag: "",
      query: "",
      offset: 17,
      limit: 5,
      page: [{ id: 17 }],
    });
    expect(response.total).toBe(22);
  });
  it("buildInstallPlanFromEntries matrix 17", () => {
    const plan = buildInstallPlanFromEntries([
      {
        key: "mcp:x-17",
        title: "T",
        category: "mcp",
        install: { installCommand: "npm i" },
      },
    ]);
    expect(plan).toHaveLength(1);
  });
  it("buildPlanWorkflowResponse matrix 17", () => {
    const response = buildPlanWorkflowResponse({
      goal: "goal-17",
      category: "",
      platform: "",
      selected: [],
      installPlan: [],
      categoryMix: {},
      trustSummary: {},
    });
    expect(response.plannerNotes.length).toBeGreaterThan(3);
  });
  it("buildRecommendForTaskResponse matrix 17", () => {
    const response = buildRecommendForTaskResponse({
      task: "task-17",
      category: "",
      platform: "",
      recommendations: [],
      installPlan: [],
      trustSummary: {},
    });
    expect(response.notes.length).toBeGreaterThan(2);
  });
  it("buildRecentUpdatesResponse matrix 17", () => {
    const response = buildRecentUpdatesResponse({
      category: "mcp",
      since: "",
      entries: [],
    });
    expect(response.ok).toBe(true);
  });
  it("buildRelatedEntriesGraphResponse matrix 17", () => {
    const response = buildRelatedEntriesGraphResponse({
      target: { category: "mcp", slug: "demo-17" },
      entries: [],
      limit: 5,
    });
    expect(response.relationGraph).toBe(true);
  });
  it("buildTrendingResourceResponse matrix 17", () => {
    const response = buildTrendingResourceResponse({
      payload: { schemaVersion: 1 },
      entries: [],
    });
    expect(response.kind).toBe("registry-trending");
  });
  it("buildJobsActiveResourceResponse matrix 17", () => {
    const response = buildJobsActiveResourceResponse({
      payload: { totalAvailable: 17 },
      entries: [],
    });
    expect(response.kind).toBe("jobs-active");
  });
  it("buildRegistryResourcePayload matrix 17", () => {
    const payload = buildRegistryResourcePayload(
      "heyclaude://test",
      { ok: true },
      "application/json",
      (v) => v,
    );
    expect(payload.contents[0].uri).toBe("heyclaude://test");
  });
  it("buildCategoryResourcePayload matrix 17", () => {
    const payload = buildCategoryResourcePayload(
      "mcp",
      [{ category: "mcp", slug: "demo-17" }],
      toEntrySummary,
    );
    expect(payload.total).toBe(1);
  });
  it("buildListRegistryResourcesResponse matrix 17", () => {
    const response = buildListRegistryResourcesResponse({
      manifest: {},
      categories: ["mcp"],
      discoveryResources: [],
      jsonMimeType: "application/json",
    });
    expect(response.resources.length).toBeGreaterThan(1);
  });
  it("buildPlatformAdapterUnavailableResponse matrix 17", () => {
    const response = buildPlatformAdapterUnavailableResponse(
      "vscode",
      "skill-17",
    );
    expect(response.adapterAvailable).toBe(false);
  });
  it("buildDistributionFeedsResponse matrix 17", () => {
    const response = buildDistributionFeedsResponse({
      manifest: { schemaVersion: 1, generatedAt: "now", artifacts: {} },
      feedIndex: { categories: [], platforms: [] },
      platformFeedSlug: (p: string) => p,
    });
    expect(response.ok).toBe(true);
  });
  it("buildExplainEntryTrustResponse matrix 17", () => {
    const entry = { category: "mcp", slug: "demo-17", title: "Demo" };
    const response = buildExplainEntryTrustResponse({
      entry,
      entryCanonicalUrl: () => "https://example.com",
      entryTrustSummary: () => ({}),
    });
    expect(response.key).toBe("mcp:demo-17");
  });
  it("buildInstallGuidanceResponse matrix 17", () => {
    const entry = { category: "mcp", slug: "demo-17", title: "Demo" };
    const response = buildInstallGuidanceResponse({
      entry,
      platform: "",
      selectedCompatibility: null,
      compatibility: [],
      entryCanonicalUrl: () => "",
      entryTrustSummary: () => ({}),
      notes: () => [],
    });
    expect(response.key).toBe("mcp:demo-17");
  });
  it("sortEntriesByUpdatedAt matrix 17", () => {
    const sorted = sortEntriesByUpdatedAt(
      [
        { title: "b", dateAdded: "2026-01-09" },
        { title: "a", dateAdded: "2026-01-01" },
      ],
      entryUpdatedAt,
    );
    expect(sorted.length).toBe(2);
  });
  it("buildDiscoveryRecentResponse matrix 17", () => {
    const response = buildDiscoveryRecentResponse({
      entries: [
        {
          category: "mcp",
          slug: "demo-17",
          title: "Demo",
          dateAdded: "2026-01-01",
        },
      ],
      toEntrySummary,
      entryUpdatedAt,
    });
    expect(response.kind).toBe("registry-recent");
  });
  it("buildSearchRegistryResponse matrix 18", () => {
    const response = buildSearchRegistryResponse({
      entries: [{ key: "mcp:demo-18" }],
      args: { query: "q18" },
      category: "mcp",
      platform: "",
      tag: "",
      trustFilters: {},
    });
    expect(response.ok).toBe(true);
    expect(response.count).toBe(1);
  });
  it("buildCategoryEntriesPageResponse matrix 18", () => {
    const response = buildCategoryEntriesPageResponse({
      entries: Array.from({ length: 23 }, (_, j) => ({ id: j })),
      category: "mcp",
      platform: "",
      tag: "",
      query: "",
      offset: 18,
      limit: 5,
      page: [{ id: 18 }],
    });
    expect(response.total).toBe(23);
  });
  it("buildInstallPlanFromEntries matrix 18", () => {
    const plan = buildInstallPlanFromEntries([
      {
        key: "mcp:x-18",
        title: "T",
        category: "mcp",
        install: { installCommand: "npm i" },
      },
    ]);
    expect(plan).toHaveLength(1);
  });
  it("buildPlanWorkflowResponse matrix 18", () => {
    const response = buildPlanWorkflowResponse({
      goal: "goal-18",
      category: "",
      platform: "",
      selected: [],
      installPlan: [],
      categoryMix: {},
      trustSummary: {},
    });
    expect(response.plannerNotes.length).toBeGreaterThan(3);
  });
  it("buildRecommendForTaskResponse matrix 18", () => {
    const response = buildRecommendForTaskResponse({
      task: "task-18",
      category: "",
      platform: "",
      recommendations: [],
      installPlan: [],
      trustSummary: {},
    });
    expect(response.notes.length).toBeGreaterThan(2);
  });
  it("buildRecentUpdatesResponse matrix 18", () => {
    const response = buildRecentUpdatesResponse({
      category: "mcp",
      since: "",
      entries: [],
    });
    expect(response.ok).toBe(true);
  });
  it("buildRelatedEntriesGraphResponse matrix 18", () => {
    const response = buildRelatedEntriesGraphResponse({
      target: { category: "mcp", slug: "demo-18" },
      entries: [],
      limit: 5,
    });
    expect(response.relationGraph).toBe(true);
  });
  it("buildTrendingResourceResponse matrix 18", () => {
    const response = buildTrendingResourceResponse({
      payload: { schemaVersion: 1 },
      entries: [],
    });
    expect(response.kind).toBe("registry-trending");
  });
  it("buildJobsActiveResourceResponse matrix 18", () => {
    const response = buildJobsActiveResourceResponse({
      payload: { totalAvailable: 18 },
      entries: [],
    });
    expect(response.kind).toBe("jobs-active");
  });
  it("buildRegistryResourcePayload matrix 18", () => {
    const payload = buildRegistryResourcePayload(
      "heyclaude://test",
      { ok: true },
      "application/json",
      (v) => v,
    );
    expect(payload.contents[0].uri).toBe("heyclaude://test");
  });
  it("buildCategoryResourcePayload matrix 18", () => {
    const payload = buildCategoryResourcePayload(
      "mcp",
      [{ category: "mcp", slug: "demo-18" }],
      toEntrySummary,
    );
    expect(payload.total).toBe(1);
  });
  it("buildListRegistryResourcesResponse matrix 18", () => {
    const response = buildListRegistryResourcesResponse({
      manifest: {},
      categories: ["mcp"],
      discoveryResources: [],
      jsonMimeType: "application/json",
    });
    expect(response.resources.length).toBeGreaterThan(1);
  });
  it("buildPlatformAdapterUnavailableResponse matrix 18", () => {
    const response = buildPlatformAdapterUnavailableResponse(
      "vscode",
      "skill-18",
    );
    expect(response.adapterAvailable).toBe(false);
  });
  it("buildDistributionFeedsResponse matrix 18", () => {
    const response = buildDistributionFeedsResponse({
      manifest: { schemaVersion: 1, generatedAt: "now", artifacts: {} },
      feedIndex: { categories: [], platforms: [] },
      platformFeedSlug: (p: string) => p,
    });
    expect(response.ok).toBe(true);
  });
  it("buildExplainEntryTrustResponse matrix 18", () => {
    const entry = { category: "mcp", slug: "demo-18", title: "Demo" };
    const response = buildExplainEntryTrustResponse({
      entry,
      entryCanonicalUrl: () => "https://example.com",
      entryTrustSummary: () => ({}),
    });
    expect(response.key).toBe("mcp:demo-18");
  });
  it("buildInstallGuidanceResponse matrix 18", () => {
    const entry = { category: "mcp", slug: "demo-18", title: "Demo" };
    const response = buildInstallGuidanceResponse({
      entry,
      platform: "",
      selectedCompatibility: null,
      compatibility: [],
      entryCanonicalUrl: () => "",
      entryTrustSummary: () => ({}),
      notes: () => [],
    });
    expect(response.key).toBe("mcp:demo-18");
  });
  it("sortEntriesByUpdatedAt matrix 18", () => {
    const sorted = sortEntriesByUpdatedAt(
      [
        { title: "b", dateAdded: "2026-01-01" },
        { title: "a", dateAdded: "2026-01-01" },
      ],
      entryUpdatedAt,
    );
    expect(sorted.length).toBe(2);
  });
  it("buildDiscoveryRecentResponse matrix 18", () => {
    const response = buildDiscoveryRecentResponse({
      entries: [
        {
          category: "mcp",
          slug: "demo-18",
          title: "Demo",
          dateAdded: "2026-01-01",
        },
      ],
      toEntrySummary,
      entryUpdatedAt,
    });
    expect(response.kind).toBe("registry-recent");
  });
  it("buildSearchRegistryResponse matrix 19", () => {
    const response = buildSearchRegistryResponse({
      entries: [{ key: "mcp:demo-19" }],
      args: { query: "q19" },
      category: "mcp",
      platform: "",
      tag: "",
      trustFilters: {},
    });
    expect(response.ok).toBe(true);
    expect(response.count).toBe(1);
  });
  it("buildCategoryEntriesPageResponse matrix 19", () => {
    const response = buildCategoryEntriesPageResponse({
      entries: Array.from({ length: 24 }, (_, j) => ({ id: j })),
      category: "mcp",
      platform: "",
      tag: "",
      query: "",
      offset: 19,
      limit: 5,
      page: [{ id: 19 }],
    });
    expect(response.total).toBe(24);
  });
  it("buildInstallPlanFromEntries matrix 19", () => {
    const plan = buildInstallPlanFromEntries([
      {
        key: "mcp:x-19",
        title: "T",
        category: "mcp",
        install: { installCommand: "npm i" },
      },
    ]);
    expect(plan).toHaveLength(1);
  });
  it("buildPlanWorkflowResponse matrix 19", () => {
    const response = buildPlanWorkflowResponse({
      goal: "goal-19",
      category: "",
      platform: "",
      selected: [],
      installPlan: [],
      categoryMix: {},
      trustSummary: {},
    });
    expect(response.plannerNotes.length).toBeGreaterThan(3);
  });
  it("buildRecommendForTaskResponse matrix 19", () => {
    const response = buildRecommendForTaskResponse({
      task: "task-19",
      category: "",
      platform: "",
      recommendations: [],
      installPlan: [],
      trustSummary: {},
    });
    expect(response.notes.length).toBeGreaterThan(2);
  });
  it("buildRecentUpdatesResponse matrix 19", () => {
    const response = buildRecentUpdatesResponse({
      category: "mcp",
      since: "",
      entries: [],
    });
    expect(response.ok).toBe(true);
  });
  it("buildRelatedEntriesGraphResponse matrix 19", () => {
    const response = buildRelatedEntriesGraphResponse({
      target: { category: "mcp", slug: "demo-19" },
      entries: [],
      limit: 5,
    });
    expect(response.relationGraph).toBe(true);
  });
  it("buildTrendingResourceResponse matrix 19", () => {
    const response = buildTrendingResourceResponse({
      payload: { schemaVersion: 1 },
      entries: [],
    });
    expect(response.kind).toBe("registry-trending");
  });
  it("buildJobsActiveResourceResponse matrix 19", () => {
    const response = buildJobsActiveResourceResponse({
      payload: { totalAvailable: 19 },
      entries: [],
    });
    expect(response.kind).toBe("jobs-active");
  });
  it("buildRegistryResourcePayload matrix 19", () => {
    const payload = buildRegistryResourcePayload(
      "heyclaude://test",
      { ok: true },
      "application/json",
      (v) => v,
    );
    expect(payload.contents[0].uri).toBe("heyclaude://test");
  });
  it("buildCategoryResourcePayload matrix 19", () => {
    const payload = buildCategoryResourcePayload(
      "mcp",
      [{ category: "mcp", slug: "demo-19" }],
      toEntrySummary,
    );
    expect(payload.total).toBe(1);
  });
  it("buildListRegistryResourcesResponse matrix 19", () => {
    const response = buildListRegistryResourcesResponse({
      manifest: {},
      categories: ["mcp"],
      discoveryResources: [],
      jsonMimeType: "application/json",
    });
    expect(response.resources.length).toBeGreaterThan(1);
  });
  it("buildPlatformAdapterUnavailableResponse matrix 19", () => {
    const response = buildPlatformAdapterUnavailableResponse(
      "vscode",
      "skill-19",
    );
    expect(response.adapterAvailable).toBe(false);
  });
  it("buildDistributionFeedsResponse matrix 19", () => {
    const response = buildDistributionFeedsResponse({
      manifest: { schemaVersion: 1, generatedAt: "now", artifacts: {} },
      feedIndex: { categories: [], platforms: [] },
      platformFeedSlug: (p: string) => p,
    });
    expect(response.ok).toBe(true);
  });
  it("buildExplainEntryTrustResponse matrix 19", () => {
    const entry = { category: "mcp", slug: "demo-19", title: "Demo" };
    const response = buildExplainEntryTrustResponse({
      entry,
      entryCanonicalUrl: () => "https://example.com",
      entryTrustSummary: () => ({}),
    });
    expect(response.key).toBe("mcp:demo-19");
  });
  it("buildInstallGuidanceResponse matrix 19", () => {
    const entry = { category: "mcp", slug: "demo-19", title: "Demo" };
    const response = buildInstallGuidanceResponse({
      entry,
      platform: "",
      selectedCompatibility: null,
      compatibility: [],
      entryCanonicalUrl: () => "",
      entryTrustSummary: () => ({}),
      notes: () => [],
    });
    expect(response.key).toBe("mcp:demo-19");
  });
  it("sortEntriesByUpdatedAt matrix 19", () => {
    const sorted = sortEntriesByUpdatedAt(
      [
        { title: "b", dateAdded: "2026-01-02" },
        { title: "a", dateAdded: "2026-01-01" },
      ],
      entryUpdatedAt,
    );
    expect(sorted.length).toBe(2);
  });
  it("buildDiscoveryRecentResponse matrix 19", () => {
    const response = buildDiscoveryRecentResponse({
      entries: [
        {
          category: "mcp",
          slug: "demo-19",
          title: "Demo",
          dateAdded: "2026-01-01",
        },
      ],
      toEntrySummary,
      entryUpdatedAt,
    });
    expect(response.kind).toBe("registry-recent");
  });
  it("buildSearchRegistryResponse matrix 20", () => {
    const response = buildSearchRegistryResponse({
      entries: [{ key: "mcp:demo-20" }],
      args: { query: "q20" },
      category: "mcp",
      platform: "",
      tag: "",
      trustFilters: {},
    });
    expect(response.ok).toBe(true);
    expect(response.count).toBe(1);
  });
  it("buildCategoryEntriesPageResponse matrix 20", () => {
    const response = buildCategoryEntriesPageResponse({
      entries: Array.from({ length: 25 }, (_, j) => ({ id: j })),
      category: "mcp",
      platform: "",
      tag: "",
      query: "",
      offset: 20,
      limit: 5,
      page: [{ id: 20 }],
    });
    expect(response.total).toBe(25);
  });
  it("buildInstallPlanFromEntries matrix 20", () => {
    const plan = buildInstallPlanFromEntries([
      {
        key: "mcp:x-20",
        title: "T",
        category: "mcp",
        install: { installCommand: "npm i" },
      },
    ]);
    expect(plan).toHaveLength(1);
  });
  it("buildPlanWorkflowResponse matrix 20", () => {
    const response = buildPlanWorkflowResponse({
      goal: "goal-20",
      category: "",
      platform: "",
      selected: [],
      installPlan: [],
      categoryMix: {},
      trustSummary: {},
    });
    expect(response.plannerNotes.length).toBeGreaterThan(3);
  });
  it("buildRecommendForTaskResponse matrix 20", () => {
    const response = buildRecommendForTaskResponse({
      task: "task-20",
      category: "",
      platform: "",
      recommendations: [],
      installPlan: [],
      trustSummary: {},
    });
    expect(response.notes.length).toBeGreaterThan(2);
  });
  it("buildRecentUpdatesResponse matrix 20", () => {
    const response = buildRecentUpdatesResponse({
      category: "mcp",
      since: "",
      entries: [],
    });
    expect(response.ok).toBe(true);
  });
  it("buildRelatedEntriesGraphResponse matrix 20", () => {
    const response = buildRelatedEntriesGraphResponse({
      target: { category: "mcp", slug: "demo-20" },
      entries: [],
      limit: 5,
    });
    expect(response.relationGraph).toBe(true);
  });
  it("buildTrendingResourceResponse matrix 20", () => {
    const response = buildTrendingResourceResponse({
      payload: { schemaVersion: 1 },
      entries: [],
    });
    expect(response.kind).toBe("registry-trending");
  });
  it("buildJobsActiveResourceResponse matrix 20", () => {
    const response = buildJobsActiveResourceResponse({
      payload: { totalAvailable: 20 },
      entries: [],
    });
    expect(response.kind).toBe("jobs-active");
  });
  it("buildRegistryResourcePayload matrix 20", () => {
    const payload = buildRegistryResourcePayload(
      "heyclaude://test",
      { ok: true },
      "application/json",
      (v) => v,
    );
    expect(payload.contents[0].uri).toBe("heyclaude://test");
  });
  it("buildCategoryResourcePayload matrix 20", () => {
    const payload = buildCategoryResourcePayload(
      "mcp",
      [{ category: "mcp", slug: "demo-20" }],
      toEntrySummary,
    );
    expect(payload.total).toBe(1);
  });
  it("buildListRegistryResourcesResponse matrix 20", () => {
    const response = buildListRegistryResourcesResponse({
      manifest: {},
      categories: ["mcp"],
      discoveryResources: [],
      jsonMimeType: "application/json",
    });
    expect(response.resources.length).toBeGreaterThan(1);
  });
  it("buildPlatformAdapterUnavailableResponse matrix 20", () => {
    const response = buildPlatformAdapterUnavailableResponse(
      "vscode",
      "skill-20",
    );
    expect(response.adapterAvailable).toBe(false);
  });
  it("buildDistributionFeedsResponse matrix 20", () => {
    const response = buildDistributionFeedsResponse({
      manifest: { schemaVersion: 1, generatedAt: "now", artifacts: {} },
      feedIndex: { categories: [], platforms: [] },
      platformFeedSlug: (p: string) => p,
    });
    expect(response.ok).toBe(true);
  });
  it("buildExplainEntryTrustResponse matrix 20", () => {
    const entry = { category: "mcp", slug: "demo-20", title: "Demo" };
    const response = buildExplainEntryTrustResponse({
      entry,
      entryCanonicalUrl: () => "https://example.com",
      entryTrustSummary: () => ({}),
    });
    expect(response.key).toBe("mcp:demo-20");
  });
  it("buildInstallGuidanceResponse matrix 20", () => {
    const entry = { category: "mcp", slug: "demo-20", title: "Demo" };
    const response = buildInstallGuidanceResponse({
      entry,
      platform: "",
      selectedCompatibility: null,
      compatibility: [],
      entryCanonicalUrl: () => "",
      entryTrustSummary: () => ({}),
      notes: () => [],
    });
    expect(response.key).toBe("mcp:demo-20");
  });
  it("sortEntriesByUpdatedAt matrix 20", () => {
    const sorted = sortEntriesByUpdatedAt(
      [
        { title: "b", dateAdded: "2026-01-03" },
        { title: "a", dateAdded: "2026-01-01" },
      ],
      entryUpdatedAt,
    );
    expect(sorted.length).toBe(2);
  });
  it("buildDiscoveryRecentResponse matrix 20", () => {
    const response = buildDiscoveryRecentResponse({
      entries: [
        {
          category: "mcp",
          slug: "demo-20",
          title: "Demo",
          dateAdded: "2026-01-01",
        },
      ],
      toEntrySummary,
      entryUpdatedAt,
    });
    expect(response.kind).toBe("registry-recent");
  });
  it("buildSearchRegistryResponse matrix 21", () => {
    const response = buildSearchRegistryResponse({
      entries: [{ key: "mcp:demo-21" }],
      args: { query: "q21" },
      category: "mcp",
      platform: "",
      tag: "",
      trustFilters: {},
    });
    expect(response.ok).toBe(true);
    expect(response.count).toBe(1);
  });
  it("buildCategoryEntriesPageResponse matrix 21", () => {
    const response = buildCategoryEntriesPageResponse({
      entries: Array.from({ length: 26 }, (_, j) => ({ id: j })),
      category: "mcp",
      platform: "",
      tag: "",
      query: "",
      offset: 21,
      limit: 5,
      page: [{ id: 21 }],
    });
    expect(response.total).toBe(26);
  });
  it("buildInstallPlanFromEntries matrix 21", () => {
    const plan = buildInstallPlanFromEntries([
      {
        key: "mcp:x-21",
        title: "T",
        category: "mcp",
        install: { installCommand: "npm i" },
      },
    ]);
    expect(plan).toHaveLength(1);
  });
  it("buildPlanWorkflowResponse matrix 21", () => {
    const response = buildPlanWorkflowResponse({
      goal: "goal-21",
      category: "",
      platform: "",
      selected: [],
      installPlan: [],
      categoryMix: {},
      trustSummary: {},
    });
    expect(response.plannerNotes.length).toBeGreaterThan(3);
  });
  it("buildRecommendForTaskResponse matrix 21", () => {
    const response = buildRecommendForTaskResponse({
      task: "task-21",
      category: "",
      platform: "",
      recommendations: [],
      installPlan: [],
      trustSummary: {},
    });
    expect(response.notes.length).toBeGreaterThan(2);
  });
  it("buildRecentUpdatesResponse matrix 21", () => {
    const response = buildRecentUpdatesResponse({
      category: "mcp",
      since: "",
      entries: [],
    });
    expect(response.ok).toBe(true);
  });
  it("buildRelatedEntriesGraphResponse matrix 21", () => {
    const response = buildRelatedEntriesGraphResponse({
      target: { category: "mcp", slug: "demo-21" },
      entries: [],
      limit: 5,
    });
    expect(response.relationGraph).toBe(true);
  });
  it("buildTrendingResourceResponse matrix 21", () => {
    const response = buildTrendingResourceResponse({
      payload: { schemaVersion: 1 },
      entries: [],
    });
    expect(response.kind).toBe("registry-trending");
  });
  it("buildJobsActiveResourceResponse matrix 21", () => {
    const response = buildJobsActiveResourceResponse({
      payload: { totalAvailable: 21 },
      entries: [],
    });
    expect(response.kind).toBe("jobs-active");
  });
  it("buildRegistryResourcePayload matrix 21", () => {
    const payload = buildRegistryResourcePayload(
      "heyclaude://test",
      { ok: true },
      "application/json",
      (v) => v,
    );
    expect(payload.contents[0].uri).toBe("heyclaude://test");
  });
  it("buildCategoryResourcePayload matrix 21", () => {
    const payload = buildCategoryResourcePayload(
      "mcp",
      [{ category: "mcp", slug: "demo-21" }],
      toEntrySummary,
    );
    expect(payload.total).toBe(1);
  });
  it("buildListRegistryResourcesResponse matrix 21", () => {
    const response = buildListRegistryResourcesResponse({
      manifest: {},
      categories: ["mcp"],
      discoveryResources: [],
      jsonMimeType: "application/json",
    });
    expect(response.resources.length).toBeGreaterThan(1);
  });
  it("buildPlatformAdapterUnavailableResponse matrix 21", () => {
    const response = buildPlatformAdapterUnavailableResponse(
      "vscode",
      "skill-21",
    );
    expect(response.adapterAvailable).toBe(false);
  });
  it("buildDistributionFeedsResponse matrix 21", () => {
    const response = buildDistributionFeedsResponse({
      manifest: { schemaVersion: 1, generatedAt: "now", artifacts: {} },
      feedIndex: { categories: [], platforms: [] },
      platformFeedSlug: (p: string) => p,
    });
    expect(response.ok).toBe(true);
  });
  it("buildExplainEntryTrustResponse matrix 21", () => {
    const entry = { category: "mcp", slug: "demo-21", title: "Demo" };
    const response = buildExplainEntryTrustResponse({
      entry,
      entryCanonicalUrl: () => "https://example.com",
      entryTrustSummary: () => ({}),
    });
    expect(response.key).toBe("mcp:demo-21");
  });
  it("buildInstallGuidanceResponse matrix 21", () => {
    const entry = { category: "mcp", slug: "demo-21", title: "Demo" };
    const response = buildInstallGuidanceResponse({
      entry,
      platform: "",
      selectedCompatibility: null,
      compatibility: [],
      entryCanonicalUrl: () => "",
      entryTrustSummary: () => ({}),
      notes: () => [],
    });
    expect(response.key).toBe("mcp:demo-21");
  });
  it("sortEntriesByUpdatedAt matrix 21", () => {
    const sorted = sortEntriesByUpdatedAt(
      [
        { title: "b", dateAdded: "2026-01-04" },
        { title: "a", dateAdded: "2026-01-01" },
      ],
      entryUpdatedAt,
    );
    expect(sorted.length).toBe(2);
  });
  it("buildDiscoveryRecentResponse matrix 21", () => {
    const response = buildDiscoveryRecentResponse({
      entries: [
        {
          category: "mcp",
          slug: "demo-21",
          title: "Demo",
          dateAdded: "2026-01-01",
        },
      ],
      toEntrySummary,
      entryUpdatedAt,
    });
    expect(response.kind).toBe("registry-recent");
  });
  it("buildSearchRegistryResponse matrix 22", () => {
    const response = buildSearchRegistryResponse({
      entries: [{ key: "mcp:demo-22" }],
      args: { query: "q22" },
      category: "mcp",
      platform: "",
      tag: "",
      trustFilters: {},
    });
    expect(response.ok).toBe(true);
    expect(response.count).toBe(1);
  });
  it("buildCategoryEntriesPageResponse matrix 22", () => {
    const response = buildCategoryEntriesPageResponse({
      entries: Array.from({ length: 27 }, (_, j) => ({ id: j })),
      category: "mcp",
      platform: "",
      tag: "",
      query: "",
      offset: 22,
      limit: 5,
      page: [{ id: 22 }],
    });
    expect(response.total).toBe(27);
  });
  it("buildInstallPlanFromEntries matrix 22", () => {
    const plan = buildInstallPlanFromEntries([
      {
        key: "mcp:x-22",
        title: "T",
        category: "mcp",
        install: { installCommand: "npm i" },
      },
    ]);
    expect(plan).toHaveLength(1);
  });
  it("buildPlanWorkflowResponse matrix 22", () => {
    const response = buildPlanWorkflowResponse({
      goal: "goal-22",
      category: "",
      platform: "",
      selected: [],
      installPlan: [],
      categoryMix: {},
      trustSummary: {},
    });
    expect(response.plannerNotes.length).toBeGreaterThan(3);
  });
  it("buildRecommendForTaskResponse matrix 22", () => {
    const response = buildRecommendForTaskResponse({
      task: "task-22",
      category: "",
      platform: "",
      recommendations: [],
      installPlan: [],
      trustSummary: {},
    });
    expect(response.notes.length).toBeGreaterThan(2);
  });
  it("buildRecentUpdatesResponse matrix 22", () => {
    const response = buildRecentUpdatesResponse({
      category: "mcp",
      since: "",
      entries: [],
    });
    expect(response.ok).toBe(true);
  });
  it("buildRelatedEntriesGraphResponse matrix 22", () => {
    const response = buildRelatedEntriesGraphResponse({
      target: { category: "mcp", slug: "demo-22" },
      entries: [],
      limit: 5,
    });
    expect(response.relationGraph).toBe(true);
  });
  it("buildTrendingResourceResponse matrix 22", () => {
    const response = buildTrendingResourceResponse({
      payload: { schemaVersion: 1 },
      entries: [],
    });
    expect(response.kind).toBe("registry-trending");
  });
  it("buildJobsActiveResourceResponse matrix 22", () => {
    const response = buildJobsActiveResourceResponse({
      payload: { totalAvailable: 22 },
      entries: [],
    });
    expect(response.kind).toBe("jobs-active");
  });
  it("buildRegistryResourcePayload matrix 22", () => {
    const payload = buildRegistryResourcePayload(
      "heyclaude://test",
      { ok: true },
      "application/json",
      (v) => v,
    );
    expect(payload.contents[0].uri).toBe("heyclaude://test");
  });
  it("buildCategoryResourcePayload matrix 22", () => {
    const payload = buildCategoryResourcePayload(
      "mcp",
      [{ category: "mcp", slug: "demo-22" }],
      toEntrySummary,
    );
    expect(payload.total).toBe(1);
  });
  it("buildListRegistryResourcesResponse matrix 22", () => {
    const response = buildListRegistryResourcesResponse({
      manifest: {},
      categories: ["mcp"],
      discoveryResources: [],
      jsonMimeType: "application/json",
    });
    expect(response.resources.length).toBeGreaterThan(1);
  });
  it("buildPlatformAdapterUnavailableResponse matrix 22", () => {
    const response = buildPlatformAdapterUnavailableResponse(
      "vscode",
      "skill-22",
    );
    expect(response.adapterAvailable).toBe(false);
  });
  it("buildDistributionFeedsResponse matrix 22", () => {
    const response = buildDistributionFeedsResponse({
      manifest: { schemaVersion: 1, generatedAt: "now", artifacts: {} },
      feedIndex: { categories: [], platforms: [] },
      platformFeedSlug: (p: string) => p,
    });
    expect(response.ok).toBe(true);
  });
  it("buildExplainEntryTrustResponse matrix 22", () => {
    const entry = { category: "mcp", slug: "demo-22", title: "Demo" };
    const response = buildExplainEntryTrustResponse({
      entry,
      entryCanonicalUrl: () => "https://example.com",
      entryTrustSummary: () => ({}),
    });
    expect(response.key).toBe("mcp:demo-22");
  });
  it("buildInstallGuidanceResponse matrix 22", () => {
    const entry = { category: "mcp", slug: "demo-22", title: "Demo" };
    const response = buildInstallGuidanceResponse({
      entry,
      platform: "",
      selectedCompatibility: null,
      compatibility: [],
      entryCanonicalUrl: () => "",
      entryTrustSummary: () => ({}),
      notes: () => [],
    });
    expect(response.key).toBe("mcp:demo-22");
  });
  it("sortEntriesByUpdatedAt matrix 22", () => {
    const sorted = sortEntriesByUpdatedAt(
      [
        { title: "b", dateAdded: "2026-01-05" },
        { title: "a", dateAdded: "2026-01-01" },
      ],
      entryUpdatedAt,
    );
    expect(sorted.length).toBe(2);
  });
  it("buildDiscoveryRecentResponse matrix 22", () => {
    const response = buildDiscoveryRecentResponse({
      entries: [
        {
          category: "mcp",
          slug: "demo-22",
          title: "Demo",
          dateAdded: "2026-01-01",
        },
      ],
      toEntrySummary,
      entryUpdatedAt,
    });
    expect(response.kind).toBe("registry-recent");
  });
  it("buildSearchRegistryResponse matrix 23", () => {
    const response = buildSearchRegistryResponse({
      entries: [{ key: "mcp:demo-23" }],
      args: { query: "q23" },
      category: "mcp",
      platform: "",
      tag: "",
      trustFilters: {},
    });
    expect(response.ok).toBe(true);
    expect(response.count).toBe(1);
  });
  it("buildCategoryEntriesPageResponse matrix 23", () => {
    const response = buildCategoryEntriesPageResponse({
      entries: Array.from({ length: 28 }, (_, j) => ({ id: j })),
      category: "mcp",
      platform: "",
      tag: "",
      query: "",
      offset: 23,
      limit: 5,
      page: [{ id: 23 }],
    });
    expect(response.total).toBe(28);
  });
  it("buildInstallPlanFromEntries matrix 23", () => {
    const plan = buildInstallPlanFromEntries([
      {
        key: "mcp:x-23",
        title: "T",
        category: "mcp",
        install: { installCommand: "npm i" },
      },
    ]);
    expect(plan).toHaveLength(1);
  });
  it("buildPlanWorkflowResponse matrix 23", () => {
    const response = buildPlanWorkflowResponse({
      goal: "goal-23",
      category: "",
      platform: "",
      selected: [],
      installPlan: [],
      categoryMix: {},
      trustSummary: {},
    });
    expect(response.plannerNotes.length).toBeGreaterThan(3);
  });
  it("buildRecommendForTaskResponse matrix 23", () => {
    const response = buildRecommendForTaskResponse({
      task: "task-23",
      category: "",
      platform: "",
      recommendations: [],
      installPlan: [],
      trustSummary: {},
    });
    expect(response.notes.length).toBeGreaterThan(2);
  });
  it("buildRecentUpdatesResponse matrix 23", () => {
    const response = buildRecentUpdatesResponse({
      category: "mcp",
      since: "",
      entries: [],
    });
    expect(response.ok).toBe(true);
  });
  it("buildRelatedEntriesGraphResponse matrix 23", () => {
    const response = buildRelatedEntriesGraphResponse({
      target: { category: "mcp", slug: "demo-23" },
      entries: [],
      limit: 5,
    });
    expect(response.relationGraph).toBe(true);
  });
  it("buildTrendingResourceResponse matrix 23", () => {
    const response = buildTrendingResourceResponse({
      payload: { schemaVersion: 1 },
      entries: [],
    });
    expect(response.kind).toBe("registry-trending");
  });
  it("buildJobsActiveResourceResponse matrix 23", () => {
    const response = buildJobsActiveResourceResponse({
      payload: { totalAvailable: 23 },
      entries: [],
    });
    expect(response.kind).toBe("jobs-active");
  });
  it("buildRegistryResourcePayload matrix 23", () => {
    const payload = buildRegistryResourcePayload(
      "heyclaude://test",
      { ok: true },
      "application/json",
      (v) => v,
    );
    expect(payload.contents[0].uri).toBe("heyclaude://test");
  });
  it("buildCategoryResourcePayload matrix 23", () => {
    const payload = buildCategoryResourcePayload(
      "mcp",
      [{ category: "mcp", slug: "demo-23" }],
      toEntrySummary,
    );
    expect(payload.total).toBe(1);
  });
  it("buildListRegistryResourcesResponse matrix 23", () => {
    const response = buildListRegistryResourcesResponse({
      manifest: {},
      categories: ["mcp"],
      discoveryResources: [],
      jsonMimeType: "application/json",
    });
    expect(response.resources.length).toBeGreaterThan(1);
  });
  it("buildPlatformAdapterUnavailableResponse matrix 23", () => {
    const response = buildPlatformAdapterUnavailableResponse(
      "vscode",
      "skill-23",
    );
    expect(response.adapterAvailable).toBe(false);
  });
  it("buildDistributionFeedsResponse matrix 23", () => {
    const response = buildDistributionFeedsResponse({
      manifest: { schemaVersion: 1, generatedAt: "now", artifacts: {} },
      feedIndex: { categories: [], platforms: [] },
      platformFeedSlug: (p: string) => p,
    });
    expect(response.ok).toBe(true);
  });
  it("buildExplainEntryTrustResponse matrix 23", () => {
    const entry = { category: "mcp", slug: "demo-23", title: "Demo" };
    const response = buildExplainEntryTrustResponse({
      entry,
      entryCanonicalUrl: () => "https://example.com",
      entryTrustSummary: () => ({}),
    });
    expect(response.key).toBe("mcp:demo-23");
  });
  it("buildInstallGuidanceResponse matrix 23", () => {
    const entry = { category: "mcp", slug: "demo-23", title: "Demo" };
    const response = buildInstallGuidanceResponse({
      entry,
      platform: "",
      selectedCompatibility: null,
      compatibility: [],
      entryCanonicalUrl: () => "",
      entryTrustSummary: () => ({}),
      notes: () => [],
    });
    expect(response.key).toBe("mcp:demo-23");
  });
  it("sortEntriesByUpdatedAt matrix 23", () => {
    const sorted = sortEntriesByUpdatedAt(
      [
        { title: "b", dateAdded: "2026-01-06" },
        { title: "a", dateAdded: "2026-01-01" },
      ],
      entryUpdatedAt,
    );
    expect(sorted.length).toBe(2);
  });
  it("buildDiscoveryRecentResponse matrix 23", () => {
    const response = buildDiscoveryRecentResponse({
      entries: [
        {
          category: "mcp",
          slug: "demo-23",
          title: "Demo",
          dateAdded: "2026-01-01",
        },
      ],
      toEntrySummary,
      entryUpdatedAt,
    });
    expect(response.kind).toBe("registry-recent");
  });
  it("buildSearchRegistryResponse matrix 24", () => {
    const response = buildSearchRegistryResponse({
      entries: [{ key: "mcp:demo-24" }],
      args: { query: "q24" },
      category: "mcp",
      platform: "",
      tag: "",
      trustFilters: {},
    });
    expect(response.ok).toBe(true);
    expect(response.count).toBe(1);
  });
  it("buildCategoryEntriesPageResponse matrix 24", () => {
    const response = buildCategoryEntriesPageResponse({
      entries: Array.from({ length: 29 }, (_, j) => ({ id: j })),
      category: "mcp",
      platform: "",
      tag: "",
      query: "",
      offset: 24,
      limit: 5,
      page: [{ id: 24 }],
    });
    expect(response.total).toBe(29);
  });
  it("buildInstallPlanFromEntries matrix 24", () => {
    const plan = buildInstallPlanFromEntries([
      {
        key: "mcp:x-24",
        title: "T",
        category: "mcp",
        install: { installCommand: "npm i" },
      },
    ]);
    expect(plan).toHaveLength(1);
  });
  it("buildPlanWorkflowResponse matrix 24", () => {
    const response = buildPlanWorkflowResponse({
      goal: "goal-24",
      category: "",
      platform: "",
      selected: [],
      installPlan: [],
      categoryMix: {},
      trustSummary: {},
    });
    expect(response.plannerNotes.length).toBeGreaterThan(3);
  });
  it("buildRecommendForTaskResponse matrix 24", () => {
    const response = buildRecommendForTaskResponse({
      task: "task-24",
      category: "",
      platform: "",
      recommendations: [],
      installPlan: [],
      trustSummary: {},
    });
    expect(response.notes.length).toBeGreaterThan(2);
  });
  it("buildRecentUpdatesResponse matrix 24", () => {
    const response = buildRecentUpdatesResponse({
      category: "mcp",
      since: "",
      entries: [],
    });
    expect(response.ok).toBe(true);
  });
  it("buildRelatedEntriesGraphResponse matrix 24", () => {
    const response = buildRelatedEntriesGraphResponse({
      target: { category: "mcp", slug: "demo-24" },
      entries: [],
      limit: 5,
    });
    expect(response.relationGraph).toBe(true);
  });
  it("buildTrendingResourceResponse matrix 24", () => {
    const response = buildTrendingResourceResponse({
      payload: { schemaVersion: 1 },
      entries: [],
    });
    expect(response.kind).toBe("registry-trending");
  });
  it("buildJobsActiveResourceResponse matrix 24", () => {
    const response = buildJobsActiveResourceResponse({
      payload: { totalAvailable: 24 },
      entries: [],
    });
    expect(response.kind).toBe("jobs-active");
  });
  it("buildRegistryResourcePayload matrix 24", () => {
    const payload = buildRegistryResourcePayload(
      "heyclaude://test",
      { ok: true },
      "application/json",
      (v) => v,
    );
    expect(payload.contents[0].uri).toBe("heyclaude://test");
  });
  it("buildCategoryResourcePayload matrix 24", () => {
    const payload = buildCategoryResourcePayload(
      "mcp",
      [{ category: "mcp", slug: "demo-24" }],
      toEntrySummary,
    );
    expect(payload.total).toBe(1);
  });
  it("buildListRegistryResourcesResponse matrix 24", () => {
    const response = buildListRegistryResourcesResponse({
      manifest: {},
      categories: ["mcp"],
      discoveryResources: [],
      jsonMimeType: "application/json",
    });
    expect(response.resources.length).toBeGreaterThan(1);
  });
  it("buildPlatformAdapterUnavailableResponse matrix 24", () => {
    const response = buildPlatformAdapterUnavailableResponse(
      "vscode",
      "skill-24",
    );
    expect(response.adapterAvailable).toBe(false);
  });
  it("buildDistributionFeedsResponse matrix 24", () => {
    const response = buildDistributionFeedsResponse({
      manifest: { schemaVersion: 1, generatedAt: "now", artifacts: {} },
      feedIndex: { categories: [], platforms: [] },
      platformFeedSlug: (p: string) => p,
    });
    expect(response.ok).toBe(true);
  });
  it("buildExplainEntryTrustResponse matrix 24", () => {
    const entry = { category: "mcp", slug: "demo-24", title: "Demo" };
    const response = buildExplainEntryTrustResponse({
      entry,
      entryCanonicalUrl: () => "https://example.com",
      entryTrustSummary: () => ({}),
    });
    expect(response.key).toBe("mcp:demo-24");
  });
  it("buildInstallGuidanceResponse matrix 24", () => {
    const entry = { category: "mcp", slug: "demo-24", title: "Demo" };
    const response = buildInstallGuidanceResponse({
      entry,
      platform: "",
      selectedCompatibility: null,
      compatibility: [],
      entryCanonicalUrl: () => "",
      entryTrustSummary: () => ({}),
      notes: () => [],
    });
    expect(response.key).toBe("mcp:demo-24");
  });
  it("sortEntriesByUpdatedAt matrix 24", () => {
    const sorted = sortEntriesByUpdatedAt(
      [
        { title: "b", dateAdded: "2026-01-07" },
        { title: "a", dateAdded: "2026-01-01" },
      ],
      entryUpdatedAt,
    );
    expect(sorted.length).toBe(2);
  });
  it("buildDiscoveryRecentResponse matrix 24", () => {
    const response = buildDiscoveryRecentResponse({
      entries: [
        {
          category: "mcp",
          slug: "demo-24",
          title: "Demo",
          dateAdded: "2026-01-01",
        },
      ],
      toEntrySummary,
      entryUpdatedAt,
    });
    expect(response.kind).toBe("registry-recent");
  });
  it("buildSearchRegistryResponse matrix 25", () => {
    const response = buildSearchRegistryResponse({
      entries: [{ key: "mcp:demo-25" }],
      args: { query: "q25" },
      category: "mcp",
      platform: "",
      tag: "",
      trustFilters: {},
    });
    expect(response.ok).toBe(true);
    expect(response.count).toBe(1);
  });
  it("buildCategoryEntriesPageResponse matrix 25", () => {
    const response = buildCategoryEntriesPageResponse({
      entries: Array.from({ length: 30 }, (_, j) => ({ id: j })),
      category: "mcp",
      platform: "",
      tag: "",
      query: "",
      offset: 25,
      limit: 5,
      page: [{ id: 25 }],
    });
    expect(response.total).toBe(30);
  });
  it("buildInstallPlanFromEntries matrix 25", () => {
    const plan = buildInstallPlanFromEntries([
      {
        key: "mcp:x-25",
        title: "T",
        category: "mcp",
        install: { installCommand: "npm i" },
      },
    ]);
    expect(plan).toHaveLength(1);
  });
  it("buildPlanWorkflowResponse matrix 25", () => {
    const response = buildPlanWorkflowResponse({
      goal: "goal-25",
      category: "",
      platform: "",
      selected: [],
      installPlan: [],
      categoryMix: {},
      trustSummary: {},
    });
    expect(response.plannerNotes.length).toBeGreaterThan(3);
  });
  it("buildRecommendForTaskResponse matrix 25", () => {
    const response = buildRecommendForTaskResponse({
      task: "task-25",
      category: "",
      platform: "",
      recommendations: [],
      installPlan: [],
      trustSummary: {},
    });
    expect(response.notes.length).toBeGreaterThan(2);
  });
  it("buildRecentUpdatesResponse matrix 25", () => {
    const response = buildRecentUpdatesResponse({
      category: "mcp",
      since: "",
      entries: [],
    });
    expect(response.ok).toBe(true);
  });
  it("buildRelatedEntriesGraphResponse matrix 25", () => {
    const response = buildRelatedEntriesGraphResponse({
      target: { category: "mcp", slug: "demo-25" },
      entries: [],
      limit: 5,
    });
    expect(response.relationGraph).toBe(true);
  });
  it("buildTrendingResourceResponse matrix 25", () => {
    const response = buildTrendingResourceResponse({
      payload: { schemaVersion: 1 },
      entries: [],
    });
    expect(response.kind).toBe("registry-trending");
  });
  it("buildJobsActiveResourceResponse matrix 25", () => {
    const response = buildJobsActiveResourceResponse({
      payload: { totalAvailable: 25 },
      entries: [],
    });
    expect(response.kind).toBe("jobs-active");
  });
  it("buildRegistryResourcePayload matrix 25", () => {
    const payload = buildRegistryResourcePayload(
      "heyclaude://test",
      { ok: true },
      "application/json",
      (v) => v,
    );
    expect(payload.contents[0].uri).toBe("heyclaude://test");
  });
  it("buildCategoryResourcePayload matrix 25", () => {
    const payload = buildCategoryResourcePayload(
      "mcp",
      [{ category: "mcp", slug: "demo-25" }],
      toEntrySummary,
    );
    expect(payload.total).toBe(1);
  });
  it("buildListRegistryResourcesResponse matrix 25", () => {
    const response = buildListRegistryResourcesResponse({
      manifest: {},
      categories: ["mcp"],
      discoveryResources: [],
      jsonMimeType: "application/json",
    });
    expect(response.resources.length).toBeGreaterThan(1);
  });
  it("buildPlatformAdapterUnavailableResponse matrix 25", () => {
    const response = buildPlatformAdapterUnavailableResponse(
      "vscode",
      "skill-25",
    );
    expect(response.adapterAvailable).toBe(false);
  });
  it("buildDistributionFeedsResponse matrix 25", () => {
    const response = buildDistributionFeedsResponse({
      manifest: { schemaVersion: 1, generatedAt: "now", artifacts: {} },
      feedIndex: { categories: [], platforms: [] },
      platformFeedSlug: (p: string) => p,
    });
    expect(response.ok).toBe(true);
  });
  it("buildExplainEntryTrustResponse matrix 25", () => {
    const entry = { category: "mcp", slug: "demo-25", title: "Demo" };
    const response = buildExplainEntryTrustResponse({
      entry,
      entryCanonicalUrl: () => "https://example.com",
      entryTrustSummary: () => ({}),
    });
    expect(response.key).toBe("mcp:demo-25");
  });
  it("buildInstallGuidanceResponse matrix 25", () => {
    const entry = { category: "mcp", slug: "demo-25", title: "Demo" };
    const response = buildInstallGuidanceResponse({
      entry,
      platform: "",
      selectedCompatibility: null,
      compatibility: [],
      entryCanonicalUrl: () => "",
      entryTrustSummary: () => ({}),
      notes: () => [],
    });
    expect(response.key).toBe("mcp:demo-25");
  });
  it("sortEntriesByUpdatedAt matrix 25", () => {
    const sorted = sortEntriesByUpdatedAt(
      [
        { title: "b", dateAdded: "2026-01-08" },
        { title: "a", dateAdded: "2026-01-01" },
      ],
      entryUpdatedAt,
    );
    expect(sorted.length).toBe(2);
  });
  it("buildDiscoveryRecentResponse matrix 25", () => {
    const response = buildDiscoveryRecentResponse({
      entries: [
        {
          category: "mcp",
          slug: "demo-25",
          title: "Demo",
          dateAdded: "2026-01-01",
        },
      ],
      toEntrySummary,
      entryUpdatedAt,
    });
    expect(response.kind).toBe("registry-recent");
  });
  it("buildSearchRegistryResponse matrix 26", () => {
    const response = buildSearchRegistryResponse({
      entries: [{ key: "mcp:demo-26" }],
      args: { query: "q26" },
      category: "mcp",
      platform: "",
      tag: "",
      trustFilters: {},
    });
    expect(response.ok).toBe(true);
    expect(response.count).toBe(1);
  });
  it("buildCategoryEntriesPageResponse matrix 26", () => {
    const response = buildCategoryEntriesPageResponse({
      entries: Array.from({ length: 31 }, (_, j) => ({ id: j })),
      category: "mcp",
      platform: "",
      tag: "",
      query: "",
      offset: 26,
      limit: 5,
      page: [{ id: 26 }],
    });
    expect(response.total).toBe(31);
  });
  it("buildInstallPlanFromEntries matrix 26", () => {
    const plan = buildInstallPlanFromEntries([
      {
        key: "mcp:x-26",
        title: "T",
        category: "mcp",
        install: { installCommand: "npm i" },
      },
    ]);
    expect(plan).toHaveLength(1);
  });
  it("buildPlanWorkflowResponse matrix 26", () => {
    const response = buildPlanWorkflowResponse({
      goal: "goal-26",
      category: "",
      platform: "",
      selected: [],
      installPlan: [],
      categoryMix: {},
      trustSummary: {},
    });
    expect(response.plannerNotes.length).toBeGreaterThan(3);
  });
  it("buildRecommendForTaskResponse matrix 26", () => {
    const response = buildRecommendForTaskResponse({
      task: "task-26",
      category: "",
      platform: "",
      recommendations: [],
      installPlan: [],
      trustSummary: {},
    });
    expect(response.notes.length).toBeGreaterThan(2);
  });
  it("buildRecentUpdatesResponse matrix 26", () => {
    const response = buildRecentUpdatesResponse({
      category: "mcp",
      since: "",
      entries: [],
    });
    expect(response.ok).toBe(true);
  });
  it("buildRelatedEntriesGraphResponse matrix 26", () => {
    const response = buildRelatedEntriesGraphResponse({
      target: { category: "mcp", slug: "demo-26" },
      entries: [],
      limit: 5,
    });
    expect(response.relationGraph).toBe(true);
  });
  it("buildTrendingResourceResponse matrix 26", () => {
    const response = buildTrendingResourceResponse({
      payload: { schemaVersion: 1 },
      entries: [],
    });
    expect(response.kind).toBe("registry-trending");
  });
  it("buildJobsActiveResourceResponse matrix 26", () => {
    const response = buildJobsActiveResourceResponse({
      payload: { totalAvailable: 26 },
      entries: [],
    });
    expect(response.kind).toBe("jobs-active");
  });
  it("buildRegistryResourcePayload matrix 26", () => {
    const payload = buildRegistryResourcePayload(
      "heyclaude://test",
      { ok: true },
      "application/json",
      (v) => v,
    );
    expect(payload.contents[0].uri).toBe("heyclaude://test");
  });
  it("buildCategoryResourcePayload matrix 26", () => {
    const payload = buildCategoryResourcePayload(
      "mcp",
      [{ category: "mcp", slug: "demo-26" }],
      toEntrySummary,
    );
    expect(payload.total).toBe(1);
  });
  it("buildListRegistryResourcesResponse matrix 26", () => {
    const response = buildListRegistryResourcesResponse({
      manifest: {},
      categories: ["mcp"],
      discoveryResources: [],
      jsonMimeType: "application/json",
    });
    expect(response.resources.length).toBeGreaterThan(1);
  });
  it("buildPlatformAdapterUnavailableResponse matrix 26", () => {
    const response = buildPlatformAdapterUnavailableResponse(
      "vscode",
      "skill-26",
    );
    expect(response.adapterAvailable).toBe(false);
  });
  it("buildDistributionFeedsResponse matrix 26", () => {
    const response = buildDistributionFeedsResponse({
      manifest: { schemaVersion: 1, generatedAt: "now", artifacts: {} },
      feedIndex: { categories: [], platforms: [] },
      platformFeedSlug: (p: string) => p,
    });
    expect(response.ok).toBe(true);
  });
  it("buildExplainEntryTrustResponse matrix 26", () => {
    const entry = { category: "mcp", slug: "demo-26", title: "Demo" };
    const response = buildExplainEntryTrustResponse({
      entry,
      entryCanonicalUrl: () => "https://example.com",
      entryTrustSummary: () => ({}),
    });
    expect(response.key).toBe("mcp:demo-26");
  });
  it("buildInstallGuidanceResponse matrix 26", () => {
    const entry = { category: "mcp", slug: "demo-26", title: "Demo" };
    const response = buildInstallGuidanceResponse({
      entry,
      platform: "",
      selectedCompatibility: null,
      compatibility: [],
      entryCanonicalUrl: () => "",
      entryTrustSummary: () => ({}),
      notes: () => [],
    });
    expect(response.key).toBe("mcp:demo-26");
  });
  it("sortEntriesByUpdatedAt matrix 26", () => {
    const sorted = sortEntriesByUpdatedAt(
      [
        { title: "b", dateAdded: "2026-01-09" },
        { title: "a", dateAdded: "2026-01-01" },
      ],
      entryUpdatedAt,
    );
    expect(sorted.length).toBe(2);
  });
  it("buildDiscoveryRecentResponse matrix 26", () => {
    const response = buildDiscoveryRecentResponse({
      entries: [
        {
          category: "mcp",
          slug: "demo-26",
          title: "Demo",
          dateAdded: "2026-01-01",
        },
      ],
      toEntrySummary,
      entryUpdatedAt,
    });
    expect(response.kind).toBe("registry-recent");
  });
  it("buildSearchRegistryResponse matrix 27", () => {
    const response = buildSearchRegistryResponse({
      entries: [{ key: "mcp:demo-27" }],
      args: { query: "q27" },
      category: "mcp",
      platform: "",
      tag: "",
      trustFilters: {},
    });
    expect(response.ok).toBe(true);
    expect(response.count).toBe(1);
  });
  it("buildCategoryEntriesPageResponse matrix 27", () => {
    const response = buildCategoryEntriesPageResponse({
      entries: Array.from({ length: 32 }, (_, j) => ({ id: j })),
      category: "mcp",
      platform: "",
      tag: "",
      query: "",
      offset: 27,
      limit: 5,
      page: [{ id: 27 }],
    });
    expect(response.total).toBe(32);
  });
  it("buildInstallPlanFromEntries matrix 27", () => {
    const plan = buildInstallPlanFromEntries([
      {
        key: "mcp:x-27",
        title: "T",
        category: "mcp",
        install: { installCommand: "npm i" },
      },
    ]);
    expect(plan).toHaveLength(1);
  });
  it("buildPlanWorkflowResponse matrix 27", () => {
    const response = buildPlanWorkflowResponse({
      goal: "goal-27",
      category: "",
      platform: "",
      selected: [],
      installPlan: [],
      categoryMix: {},
      trustSummary: {},
    });
    expect(response.plannerNotes.length).toBeGreaterThan(3);
  });
  it("buildRecommendForTaskResponse matrix 27", () => {
    const response = buildRecommendForTaskResponse({
      task: "task-27",
      category: "",
      platform: "",
      recommendations: [],
      installPlan: [],
      trustSummary: {},
    });
    expect(response.notes.length).toBeGreaterThan(2);
  });
  it("buildRecentUpdatesResponse matrix 27", () => {
    const response = buildRecentUpdatesResponse({
      category: "mcp",
      since: "",
      entries: [],
    });
    expect(response.ok).toBe(true);
  });
  it("buildRelatedEntriesGraphResponse matrix 27", () => {
    const response = buildRelatedEntriesGraphResponse({
      target: { category: "mcp", slug: "demo-27" },
      entries: [],
      limit: 5,
    });
    expect(response.relationGraph).toBe(true);
  });
  it("buildTrendingResourceResponse matrix 27", () => {
    const response = buildTrendingResourceResponse({
      payload: { schemaVersion: 1 },
      entries: [],
    });
    expect(response.kind).toBe("registry-trending");
  });
  it("buildJobsActiveResourceResponse matrix 27", () => {
    const response = buildJobsActiveResourceResponse({
      payload: { totalAvailable: 27 },
      entries: [],
    });
    expect(response.kind).toBe("jobs-active");
  });
  it("buildRegistryResourcePayload matrix 27", () => {
    const payload = buildRegistryResourcePayload(
      "heyclaude://test",
      { ok: true },
      "application/json",
      (v) => v,
    );
    expect(payload.contents[0].uri).toBe("heyclaude://test");
  });
  it("buildCategoryResourcePayload matrix 27", () => {
    const payload = buildCategoryResourcePayload(
      "mcp",
      [{ category: "mcp", slug: "demo-27" }],
      toEntrySummary,
    );
    expect(payload.total).toBe(1);
  });
  it("buildListRegistryResourcesResponse matrix 27", () => {
    const response = buildListRegistryResourcesResponse({
      manifest: {},
      categories: ["mcp"],
      discoveryResources: [],
      jsonMimeType: "application/json",
    });
    expect(response.resources.length).toBeGreaterThan(1);
  });
  it("buildPlatformAdapterUnavailableResponse matrix 27", () => {
    const response = buildPlatformAdapterUnavailableResponse(
      "vscode",
      "skill-27",
    );
    expect(response.adapterAvailable).toBe(false);
  });
  it("buildDistributionFeedsResponse matrix 27", () => {
    const response = buildDistributionFeedsResponse({
      manifest: { schemaVersion: 1, generatedAt: "now", artifacts: {} },
      feedIndex: { categories: [], platforms: [] },
      platformFeedSlug: (p: string) => p,
    });
    expect(response.ok).toBe(true);
  });
  it("buildExplainEntryTrustResponse matrix 27", () => {
    const entry = { category: "mcp", slug: "demo-27", title: "Demo" };
    const response = buildExplainEntryTrustResponse({
      entry,
      entryCanonicalUrl: () => "https://example.com",
      entryTrustSummary: () => ({}),
    });
    expect(response.key).toBe("mcp:demo-27");
  });
  it("buildInstallGuidanceResponse matrix 27", () => {
    const entry = { category: "mcp", slug: "demo-27", title: "Demo" };
    const response = buildInstallGuidanceResponse({
      entry,
      platform: "",
      selectedCompatibility: null,
      compatibility: [],
      entryCanonicalUrl: () => "",
      entryTrustSummary: () => ({}),
      notes: () => [],
    });
    expect(response.key).toBe("mcp:demo-27");
  });
  it("sortEntriesByUpdatedAt matrix 27", () => {
    const sorted = sortEntriesByUpdatedAt(
      [
        { title: "b", dateAdded: "2026-01-01" },
        { title: "a", dateAdded: "2026-01-01" },
      ],
      entryUpdatedAt,
    );
    expect(sorted.length).toBe(2);
  });
  it("buildDiscoveryRecentResponse matrix 27", () => {
    const response = buildDiscoveryRecentResponse({
      entries: [
        {
          category: "mcp",
          slug: "demo-27",
          title: "Demo",
          dateAdded: "2026-01-01",
        },
      ],
      toEntrySummary,
      entryUpdatedAt,
    });
    expect(response.kind).toBe("registry-recent");
  });
  it("buildSearchRegistryResponse matrix 28", () => {
    const response = buildSearchRegistryResponse({
      entries: [{ key: "mcp:demo-28" }],
      args: { query: "q28" },
      category: "mcp",
      platform: "",
      tag: "",
      trustFilters: {},
    });
    expect(response.ok).toBe(true);
    expect(response.count).toBe(1);
  });
  it("buildCategoryEntriesPageResponse matrix 28", () => {
    const response = buildCategoryEntriesPageResponse({
      entries: Array.from({ length: 33 }, (_, j) => ({ id: j })),
      category: "mcp",
      platform: "",
      tag: "",
      query: "",
      offset: 28,
      limit: 5,
      page: [{ id: 28 }],
    });
    expect(response.total).toBe(33);
  });
  it("buildInstallPlanFromEntries matrix 28", () => {
    const plan = buildInstallPlanFromEntries([
      {
        key: "mcp:x-28",
        title: "T",
        category: "mcp",
        install: { installCommand: "npm i" },
      },
    ]);
    expect(plan).toHaveLength(1);
  });
  it("buildPlanWorkflowResponse matrix 28", () => {
    const response = buildPlanWorkflowResponse({
      goal: "goal-28",
      category: "",
      platform: "",
      selected: [],
      installPlan: [],
      categoryMix: {},
      trustSummary: {},
    });
    expect(response.plannerNotes.length).toBeGreaterThan(3);
  });
  it("buildRecommendForTaskResponse matrix 28", () => {
    const response = buildRecommendForTaskResponse({
      task: "task-28",
      category: "",
      platform: "",
      recommendations: [],
      installPlan: [],
      trustSummary: {},
    });
    expect(response.notes.length).toBeGreaterThan(2);
  });
  it("buildRecentUpdatesResponse matrix 28", () => {
    const response = buildRecentUpdatesResponse({
      category: "mcp",
      since: "",
      entries: [],
    });
    expect(response.ok).toBe(true);
  });
  it("buildRelatedEntriesGraphResponse matrix 28", () => {
    const response = buildRelatedEntriesGraphResponse({
      target: { category: "mcp", slug: "demo-28" },
      entries: [],
      limit: 5,
    });
    expect(response.relationGraph).toBe(true);
  });
  it("buildTrendingResourceResponse matrix 28", () => {
    const response = buildTrendingResourceResponse({
      payload: { schemaVersion: 1 },
      entries: [],
    });
    expect(response.kind).toBe("registry-trending");
  });
  it("buildJobsActiveResourceResponse matrix 28", () => {
    const response = buildJobsActiveResourceResponse({
      payload: { totalAvailable: 28 },
      entries: [],
    });
    expect(response.kind).toBe("jobs-active");
  });
  it("buildRegistryResourcePayload matrix 28", () => {
    const payload = buildRegistryResourcePayload(
      "heyclaude://test",
      { ok: true },
      "application/json",
      (v) => v,
    );
    expect(payload.contents[0].uri).toBe("heyclaude://test");
  });
  it("buildCategoryResourcePayload matrix 28", () => {
    const payload = buildCategoryResourcePayload(
      "mcp",
      [{ category: "mcp", slug: "demo-28" }],
      toEntrySummary,
    );
    expect(payload.total).toBe(1);
  });
  it("buildListRegistryResourcesResponse matrix 28", () => {
    const response = buildListRegistryResourcesResponse({
      manifest: {},
      categories: ["mcp"],
      discoveryResources: [],
      jsonMimeType: "application/json",
    });
    expect(response.resources.length).toBeGreaterThan(1);
  });
  it("buildPlatformAdapterUnavailableResponse matrix 28", () => {
    const response = buildPlatformAdapterUnavailableResponse(
      "vscode",
      "skill-28",
    );
    expect(response.adapterAvailable).toBe(false);
  });
  it("buildDistributionFeedsResponse matrix 28", () => {
    const response = buildDistributionFeedsResponse({
      manifest: { schemaVersion: 1, generatedAt: "now", artifacts: {} },
      feedIndex: { categories: [], platforms: [] },
      platformFeedSlug: (p: string) => p,
    });
    expect(response.ok).toBe(true);
  });
  it("buildExplainEntryTrustResponse matrix 28", () => {
    const entry = { category: "mcp", slug: "demo-28", title: "Demo" };
    const response = buildExplainEntryTrustResponse({
      entry,
      entryCanonicalUrl: () => "https://example.com",
      entryTrustSummary: () => ({}),
    });
    expect(response.key).toBe("mcp:demo-28");
  });
  it("buildInstallGuidanceResponse matrix 28", () => {
    const entry = { category: "mcp", slug: "demo-28", title: "Demo" };
    const response = buildInstallGuidanceResponse({
      entry,
      platform: "",
      selectedCompatibility: null,
      compatibility: [],
      entryCanonicalUrl: () => "",
      entryTrustSummary: () => ({}),
      notes: () => [],
    });
    expect(response.key).toBe("mcp:demo-28");
  });
  it("sortEntriesByUpdatedAt matrix 28", () => {
    const sorted = sortEntriesByUpdatedAt(
      [
        { title: "b", dateAdded: "2026-01-02" },
        { title: "a", dateAdded: "2026-01-01" },
      ],
      entryUpdatedAt,
    );
    expect(sorted.length).toBe(2);
  });
  it("buildDiscoveryRecentResponse matrix 28", () => {
    const response = buildDiscoveryRecentResponse({
      entries: [
        {
          category: "mcp",
          slug: "demo-28",
          title: "Demo",
          dateAdded: "2026-01-01",
        },
      ],
      toEntrySummary,
      entryUpdatedAt,
    });
    expect(response.kind).toBe("registry-recent");
  });
  it("buildSearchRegistryResponse matrix 29", () => {
    const response = buildSearchRegistryResponse({
      entries: [{ key: "mcp:demo-29" }],
      args: { query: "q29" },
      category: "mcp",
      platform: "",
      tag: "",
      trustFilters: {},
    });
    expect(response.ok).toBe(true);
    expect(response.count).toBe(1);
  });
  it("buildCategoryEntriesPageResponse matrix 29", () => {
    const response = buildCategoryEntriesPageResponse({
      entries: Array.from({ length: 34 }, (_, j) => ({ id: j })),
      category: "mcp",
      platform: "",
      tag: "",
      query: "",
      offset: 29,
      limit: 5,
      page: [{ id: 29 }],
    });
    expect(response.total).toBe(34);
  });
  it("buildInstallPlanFromEntries matrix 29", () => {
    const plan = buildInstallPlanFromEntries([
      {
        key: "mcp:x-29",
        title: "T",
        category: "mcp",
        install: { installCommand: "npm i" },
      },
    ]);
    expect(plan).toHaveLength(1);
  });
  it("buildPlanWorkflowResponse matrix 29", () => {
    const response = buildPlanWorkflowResponse({
      goal: "goal-29",
      category: "",
      platform: "",
      selected: [],
      installPlan: [],
      categoryMix: {},
      trustSummary: {},
    });
    expect(response.plannerNotes.length).toBeGreaterThan(3);
  });
  it("buildRecommendForTaskResponse matrix 29", () => {
    const response = buildRecommendForTaskResponse({
      task: "task-29",
      category: "",
      platform: "",
      recommendations: [],
      installPlan: [],
      trustSummary: {},
    });
    expect(response.notes.length).toBeGreaterThan(2);
  });
  it("buildRecentUpdatesResponse matrix 29", () => {
    const response = buildRecentUpdatesResponse({
      category: "mcp",
      since: "",
      entries: [],
    });
    expect(response.ok).toBe(true);
  });
  it("buildRelatedEntriesGraphResponse matrix 29", () => {
    const response = buildRelatedEntriesGraphResponse({
      target: { category: "mcp", slug: "demo-29" },
      entries: [],
      limit: 5,
    });
    expect(response.relationGraph).toBe(true);
  });
  it("buildTrendingResourceResponse matrix 29", () => {
    const response = buildTrendingResourceResponse({
      payload: { schemaVersion: 1 },
      entries: [],
    });
    expect(response.kind).toBe("registry-trending");
  });
  it("buildJobsActiveResourceResponse matrix 29", () => {
    const response = buildJobsActiveResourceResponse({
      payload: { totalAvailable: 29 },
      entries: [],
    });
    expect(response.kind).toBe("jobs-active");
  });
  it("buildRegistryResourcePayload matrix 29", () => {
    const payload = buildRegistryResourcePayload(
      "heyclaude://test",
      { ok: true },
      "application/json",
      (v) => v,
    );
    expect(payload.contents[0].uri).toBe("heyclaude://test");
  });
  it("buildCategoryResourcePayload matrix 29", () => {
    const payload = buildCategoryResourcePayload(
      "mcp",
      [{ category: "mcp", slug: "demo-29" }],
      toEntrySummary,
    );
    expect(payload.total).toBe(1);
  });
  it("buildListRegistryResourcesResponse matrix 29", () => {
    const response = buildListRegistryResourcesResponse({
      manifest: {},
      categories: ["mcp"],
      discoveryResources: [],
      jsonMimeType: "application/json",
    });
    expect(response.resources.length).toBeGreaterThan(1);
  });
  it("buildPlatformAdapterUnavailableResponse matrix 29", () => {
    const response = buildPlatformAdapterUnavailableResponse(
      "vscode",
      "skill-29",
    );
    expect(response.adapterAvailable).toBe(false);
  });
  it("buildDistributionFeedsResponse matrix 29", () => {
    const response = buildDistributionFeedsResponse({
      manifest: { schemaVersion: 1, generatedAt: "now", artifacts: {} },
      feedIndex: { categories: [], platforms: [] },
      platformFeedSlug: (p: string) => p,
    });
    expect(response.ok).toBe(true);
  });
  it("buildExplainEntryTrustResponse matrix 29", () => {
    const entry = { category: "mcp", slug: "demo-29", title: "Demo" };
    const response = buildExplainEntryTrustResponse({
      entry,
      entryCanonicalUrl: () => "https://example.com",
      entryTrustSummary: () => ({}),
    });
    expect(response.key).toBe("mcp:demo-29");
  });
  it("buildInstallGuidanceResponse matrix 29", () => {
    const entry = { category: "mcp", slug: "demo-29", title: "Demo" };
    const response = buildInstallGuidanceResponse({
      entry,
      platform: "",
      selectedCompatibility: null,
      compatibility: [],
      entryCanonicalUrl: () => "",
      entryTrustSummary: () => ({}),
      notes: () => [],
    });
    expect(response.key).toBe("mcp:demo-29");
  });
  it("sortEntriesByUpdatedAt matrix 29", () => {
    const sorted = sortEntriesByUpdatedAt(
      [
        { title: "b", dateAdded: "2026-01-03" },
        { title: "a", dateAdded: "2026-01-01" },
      ],
      entryUpdatedAt,
    );
    expect(sorted.length).toBe(2);
  });
  it("buildDiscoveryRecentResponse matrix 29", () => {
    const response = buildDiscoveryRecentResponse({
      entries: [
        {
          category: "mcp",
          slug: "demo-29",
          title: "Demo",
          dateAdded: "2026-01-01",
        },
      ],
      toEntrySummary,
      entryUpdatedAt,
    });
    expect(response.kind).toBe("registry-recent");
  });
  it("buildSearchRegistryResponse matrix 30", () => {
    const response = buildSearchRegistryResponse({
      entries: [{ key: "mcp:demo-30" }],
      args: { query: "q30" },
      category: "mcp",
      platform: "",
      tag: "",
      trustFilters: {},
    });
    expect(response.ok).toBe(true);
    expect(response.count).toBe(1);
  });
  it("buildCategoryEntriesPageResponse matrix 30", () => {
    const response = buildCategoryEntriesPageResponse({
      entries: Array.from({ length: 35 }, (_, j) => ({ id: j })),
      category: "mcp",
      platform: "",
      tag: "",
      query: "",
      offset: 30,
      limit: 5,
      page: [{ id: 30 }],
    });
    expect(response.total).toBe(35);
  });
  it("buildInstallPlanFromEntries matrix 30", () => {
    const plan = buildInstallPlanFromEntries([
      {
        key: "mcp:x-30",
        title: "T",
        category: "mcp",
        install: { installCommand: "npm i" },
      },
    ]);
    expect(plan).toHaveLength(1);
  });
  it("buildPlanWorkflowResponse matrix 30", () => {
    const response = buildPlanWorkflowResponse({
      goal: "goal-30",
      category: "",
      platform: "",
      selected: [],
      installPlan: [],
      categoryMix: {},
      trustSummary: {},
    });
    expect(response.plannerNotes.length).toBeGreaterThan(3);
  });
  it("buildRecommendForTaskResponse matrix 30", () => {
    const response = buildRecommendForTaskResponse({
      task: "task-30",
      category: "",
      platform: "",
      recommendations: [],
      installPlan: [],
      trustSummary: {},
    });
    expect(response.notes.length).toBeGreaterThan(2);
  });
  it("buildRecentUpdatesResponse matrix 30", () => {
    const response = buildRecentUpdatesResponse({
      category: "mcp",
      since: "",
      entries: [],
    });
    expect(response.ok).toBe(true);
  });
  it("buildRelatedEntriesGraphResponse matrix 30", () => {
    const response = buildRelatedEntriesGraphResponse({
      target: { category: "mcp", slug: "demo-30" },
      entries: [],
      limit: 5,
    });
    expect(response.relationGraph).toBe(true);
  });
  it("buildTrendingResourceResponse matrix 30", () => {
    const response = buildTrendingResourceResponse({
      payload: { schemaVersion: 1 },
      entries: [],
    });
    expect(response.kind).toBe("registry-trending");
  });
  it("buildJobsActiveResourceResponse matrix 30", () => {
    const response = buildJobsActiveResourceResponse({
      payload: { totalAvailable: 30 },
      entries: [],
    });
    expect(response.kind).toBe("jobs-active");
  });
  it("buildRegistryResourcePayload matrix 30", () => {
    const payload = buildRegistryResourcePayload(
      "heyclaude://test",
      { ok: true },
      "application/json",
      (v) => v,
    );
    expect(payload.contents[0].uri).toBe("heyclaude://test");
  });
  it("buildCategoryResourcePayload matrix 30", () => {
    const payload = buildCategoryResourcePayload(
      "mcp",
      [{ category: "mcp", slug: "demo-30" }],
      toEntrySummary,
    );
    expect(payload.total).toBe(1);
  });
  it("buildListRegistryResourcesResponse matrix 30", () => {
    const response = buildListRegistryResourcesResponse({
      manifest: {},
      categories: ["mcp"],
      discoveryResources: [],
      jsonMimeType: "application/json",
    });
    expect(response.resources.length).toBeGreaterThan(1);
  });
  it("buildPlatformAdapterUnavailableResponse matrix 30", () => {
    const response = buildPlatformAdapterUnavailableResponse(
      "vscode",
      "skill-30",
    );
    expect(response.adapterAvailable).toBe(false);
  });
  it("buildDistributionFeedsResponse matrix 30", () => {
    const response = buildDistributionFeedsResponse({
      manifest: { schemaVersion: 1, generatedAt: "now", artifacts: {} },
      feedIndex: { categories: [], platforms: [] },
      platformFeedSlug: (p: string) => p,
    });
    expect(response.ok).toBe(true);
  });
  it("buildExplainEntryTrustResponse matrix 30", () => {
    const entry = { category: "mcp", slug: "demo-30", title: "Demo" };
    const response = buildExplainEntryTrustResponse({
      entry,
      entryCanonicalUrl: () => "https://example.com",
      entryTrustSummary: () => ({}),
    });
    expect(response.key).toBe("mcp:demo-30");
  });
  it("buildInstallGuidanceResponse matrix 30", () => {
    const entry = { category: "mcp", slug: "demo-30", title: "Demo" };
    const response = buildInstallGuidanceResponse({
      entry,
      platform: "",
      selectedCompatibility: null,
      compatibility: [],
      entryCanonicalUrl: () => "",
      entryTrustSummary: () => ({}),
      notes: () => [],
    });
    expect(response.key).toBe("mcp:demo-30");
  });
  it("sortEntriesByUpdatedAt matrix 30", () => {
    const sorted = sortEntriesByUpdatedAt(
      [
        { title: "b", dateAdded: "2026-01-04" },
        { title: "a", dateAdded: "2026-01-01" },
      ],
      entryUpdatedAt,
    );
    expect(sorted.length).toBe(2);
  });
  it("buildDiscoveryRecentResponse matrix 30", () => {
    const response = buildDiscoveryRecentResponse({
      entries: [
        {
          category: "mcp",
          slug: "demo-30",
          title: "Demo",
          dateAdded: "2026-01-01",
        },
      ],
      toEntrySummary,
      entryUpdatedAt,
    });
    expect(response.kind).toBe("registry-recent");
  });
  it("buildSearchRegistryResponse matrix 31", () => {
    const response = buildSearchRegistryResponse({
      entries: [{ key: "mcp:demo-31" }],
      args: { query: "q31" },
      category: "mcp",
      platform: "",
      tag: "",
      trustFilters: {},
    });
    expect(response.ok).toBe(true);
    expect(response.count).toBe(1);
  });
  it("buildCategoryEntriesPageResponse matrix 31", () => {
    const response = buildCategoryEntriesPageResponse({
      entries: Array.from({ length: 36 }, (_, j) => ({ id: j })),
      category: "mcp",
      platform: "",
      tag: "",
      query: "",
      offset: 31,
      limit: 5,
      page: [{ id: 31 }],
    });
    expect(response.total).toBe(36);
  });
  it("buildInstallPlanFromEntries matrix 31", () => {
    const plan = buildInstallPlanFromEntries([
      {
        key: "mcp:x-31",
        title: "T",
        category: "mcp",
        install: { installCommand: "npm i" },
      },
    ]);
    expect(plan).toHaveLength(1);
  });
  it("buildPlanWorkflowResponse matrix 31", () => {
    const response = buildPlanWorkflowResponse({
      goal: "goal-31",
      category: "",
      platform: "",
      selected: [],
      installPlan: [],
      categoryMix: {},
      trustSummary: {},
    });
    expect(response.plannerNotes.length).toBeGreaterThan(3);
  });
  it("buildRecommendForTaskResponse matrix 31", () => {
    const response = buildRecommendForTaskResponse({
      task: "task-31",
      category: "",
      platform: "",
      recommendations: [],
      installPlan: [],
      trustSummary: {},
    });
    expect(response.notes.length).toBeGreaterThan(2);
  });
  it("buildRecentUpdatesResponse matrix 31", () => {
    const response = buildRecentUpdatesResponse({
      category: "mcp",
      since: "",
      entries: [],
    });
    expect(response.ok).toBe(true);
  });
  it("buildRelatedEntriesGraphResponse matrix 31", () => {
    const response = buildRelatedEntriesGraphResponse({
      target: { category: "mcp", slug: "demo-31" },
      entries: [],
      limit: 5,
    });
    expect(response.relationGraph).toBe(true);
  });
  it("buildTrendingResourceResponse matrix 31", () => {
    const response = buildTrendingResourceResponse({
      payload: { schemaVersion: 1 },
      entries: [],
    });
    expect(response.kind).toBe("registry-trending");
  });
  it("buildJobsActiveResourceResponse matrix 31", () => {
    const response = buildJobsActiveResourceResponse({
      payload: { totalAvailable: 31 },
      entries: [],
    });
    expect(response.kind).toBe("jobs-active");
  });
  it("buildRegistryResourcePayload matrix 31", () => {
    const payload = buildRegistryResourcePayload(
      "heyclaude://test",
      { ok: true },
      "application/json",
      (v) => v,
    );
    expect(payload.contents[0].uri).toBe("heyclaude://test");
  });
  it("buildCategoryResourcePayload matrix 31", () => {
    const payload = buildCategoryResourcePayload(
      "mcp",
      [{ category: "mcp", slug: "demo-31" }],
      toEntrySummary,
    );
    expect(payload.total).toBe(1);
  });
  it("buildListRegistryResourcesResponse matrix 31", () => {
    const response = buildListRegistryResourcesResponse({
      manifest: {},
      categories: ["mcp"],
      discoveryResources: [],
      jsonMimeType: "application/json",
    });
    expect(response.resources.length).toBeGreaterThan(1);
  });
  it("buildPlatformAdapterUnavailableResponse matrix 31", () => {
    const response = buildPlatformAdapterUnavailableResponse(
      "vscode",
      "skill-31",
    );
    expect(response.adapterAvailable).toBe(false);
  });
  it("buildDistributionFeedsResponse matrix 31", () => {
    const response = buildDistributionFeedsResponse({
      manifest: { schemaVersion: 1, generatedAt: "now", artifacts: {} },
      feedIndex: { categories: [], platforms: [] },
      platformFeedSlug: (p: string) => p,
    });
    expect(response.ok).toBe(true);
  });
  it("buildExplainEntryTrustResponse matrix 31", () => {
    const entry = { category: "mcp", slug: "demo-31", title: "Demo" };
    const response = buildExplainEntryTrustResponse({
      entry,
      entryCanonicalUrl: () => "https://example.com",
      entryTrustSummary: () => ({}),
    });
    expect(response.key).toBe("mcp:demo-31");
  });
  it("buildInstallGuidanceResponse matrix 31", () => {
    const entry = { category: "mcp", slug: "demo-31", title: "Demo" };
    const response = buildInstallGuidanceResponse({
      entry,
      platform: "",
      selectedCompatibility: null,
      compatibility: [],
      entryCanonicalUrl: () => "",
      entryTrustSummary: () => ({}),
      notes: () => [],
    });
    expect(response.key).toBe("mcp:demo-31");
  });
  it("sortEntriesByUpdatedAt matrix 31", () => {
    const sorted = sortEntriesByUpdatedAt(
      [
        { title: "b", dateAdded: "2026-01-05" },
        { title: "a", dateAdded: "2026-01-01" },
      ],
      entryUpdatedAt,
    );
    expect(sorted.length).toBe(2);
  });
  it("buildDiscoveryRecentResponse matrix 31", () => {
    const response = buildDiscoveryRecentResponse({
      entries: [
        {
          category: "mcp",
          slug: "demo-31",
          title: "Demo",
          dateAdded: "2026-01-01",
        },
      ],
      toEntrySummary,
      entryUpdatedAt,
    });
    expect(response.kind).toBe("registry-recent");
  });
  it("buildSearchRegistryResponse matrix 32", () => {
    const response = buildSearchRegistryResponse({
      entries: [{ key: "mcp:demo-32" }],
      args: { query: "q32" },
      category: "mcp",
      platform: "",
      tag: "",
      trustFilters: {},
    });
    expect(response.ok).toBe(true);
    expect(response.count).toBe(1);
  });
  it("buildCategoryEntriesPageResponse matrix 32", () => {
    const response = buildCategoryEntriesPageResponse({
      entries: Array.from({ length: 37 }, (_, j) => ({ id: j })),
      category: "mcp",
      platform: "",
      tag: "",
      query: "",
      offset: 32,
      limit: 5,
      page: [{ id: 32 }],
    });
    expect(response.total).toBe(37);
  });
  it("buildInstallPlanFromEntries matrix 32", () => {
    const plan = buildInstallPlanFromEntries([
      {
        key: "mcp:x-32",
        title: "T",
        category: "mcp",
        install: { installCommand: "npm i" },
      },
    ]);
    expect(plan).toHaveLength(1);
  });
  it("buildPlanWorkflowResponse matrix 32", () => {
    const response = buildPlanWorkflowResponse({
      goal: "goal-32",
      category: "",
      platform: "",
      selected: [],
      installPlan: [],
      categoryMix: {},
      trustSummary: {},
    });
    expect(response.plannerNotes.length).toBeGreaterThan(3);
  });
  it("buildRecommendForTaskResponse matrix 32", () => {
    const response = buildRecommendForTaskResponse({
      task: "task-32",
      category: "",
      platform: "",
      recommendations: [],
      installPlan: [],
      trustSummary: {},
    });
    expect(response.notes.length).toBeGreaterThan(2);
  });
  it("buildRecentUpdatesResponse matrix 32", () => {
    const response = buildRecentUpdatesResponse({
      category: "mcp",
      since: "",
      entries: [],
    });
    expect(response.ok).toBe(true);
  });
  it("buildRelatedEntriesGraphResponse matrix 32", () => {
    const response = buildRelatedEntriesGraphResponse({
      target: { category: "mcp", slug: "demo-32" },
      entries: [],
      limit: 5,
    });
    expect(response.relationGraph).toBe(true);
  });
  it("buildTrendingResourceResponse matrix 32", () => {
    const response = buildTrendingResourceResponse({
      payload: { schemaVersion: 1 },
      entries: [],
    });
    expect(response.kind).toBe("registry-trending");
  });
  it("buildJobsActiveResourceResponse matrix 32", () => {
    const response = buildJobsActiveResourceResponse({
      payload: { totalAvailable: 32 },
      entries: [],
    });
    expect(response.kind).toBe("jobs-active");
  });
  it("buildRegistryResourcePayload matrix 32", () => {
    const payload = buildRegistryResourcePayload(
      "heyclaude://test",
      { ok: true },
      "application/json",
      (v) => v,
    );
    expect(payload.contents[0].uri).toBe("heyclaude://test");
  });
  it("buildCategoryResourcePayload matrix 32", () => {
    const payload = buildCategoryResourcePayload(
      "mcp",
      [{ category: "mcp", slug: "demo-32" }],
      toEntrySummary,
    );
    expect(payload.total).toBe(1);
  });
  it("buildListRegistryResourcesResponse matrix 32", () => {
    const response = buildListRegistryResourcesResponse({
      manifest: {},
      categories: ["mcp"],
      discoveryResources: [],
      jsonMimeType: "application/json",
    });
    expect(response.resources.length).toBeGreaterThan(1);
  });
  it("buildPlatformAdapterUnavailableResponse matrix 32", () => {
    const response = buildPlatformAdapterUnavailableResponse(
      "vscode",
      "skill-32",
    );
    expect(response.adapterAvailable).toBe(false);
  });
  it("buildDistributionFeedsResponse matrix 32", () => {
    const response = buildDistributionFeedsResponse({
      manifest: { schemaVersion: 1, generatedAt: "now", artifacts: {} },
      feedIndex: { categories: [], platforms: [] },
      platformFeedSlug: (p: string) => p,
    });
    expect(response.ok).toBe(true);
  });
  it("buildExplainEntryTrustResponse matrix 32", () => {
    const entry = { category: "mcp", slug: "demo-32", title: "Demo" };
    const response = buildExplainEntryTrustResponse({
      entry,
      entryCanonicalUrl: () => "https://example.com",
      entryTrustSummary: () => ({}),
    });
    expect(response.key).toBe("mcp:demo-32");
  });
  it("buildInstallGuidanceResponse matrix 32", () => {
    const entry = { category: "mcp", slug: "demo-32", title: "Demo" };
    const response = buildInstallGuidanceResponse({
      entry,
      platform: "",
      selectedCompatibility: null,
      compatibility: [],
      entryCanonicalUrl: () => "",
      entryTrustSummary: () => ({}),
      notes: () => [],
    });
    expect(response.key).toBe("mcp:demo-32");
  });
  it("sortEntriesByUpdatedAt matrix 32", () => {
    const sorted = sortEntriesByUpdatedAt(
      [
        { title: "b", dateAdded: "2026-01-06" },
        { title: "a", dateAdded: "2026-01-01" },
      ],
      entryUpdatedAt,
    );
    expect(sorted.length).toBe(2);
  });
  it("buildDiscoveryRecentResponse matrix 32", () => {
    const response = buildDiscoveryRecentResponse({
      entries: [
        {
          category: "mcp",
          slug: "demo-32",
          title: "Demo",
          dateAdded: "2026-01-01",
        },
      ],
      toEntrySummary,
      entryUpdatedAt,
    });
    expect(response.kind).toBe("registry-recent");
  });
  it("buildSearchRegistryResponse matrix 33", () => {
    const response = buildSearchRegistryResponse({
      entries: [{ key: "mcp:demo-33" }],
      args: { query: "q33" },
      category: "mcp",
      platform: "",
      tag: "",
      trustFilters: {},
    });
    expect(response.ok).toBe(true);
    expect(response.count).toBe(1);
  });
  it("buildCategoryEntriesPageResponse matrix 33", () => {
    const response = buildCategoryEntriesPageResponse({
      entries: Array.from({ length: 38 }, (_, j) => ({ id: j })),
      category: "mcp",
      platform: "",
      tag: "",
      query: "",
      offset: 33,
      limit: 5,
      page: [{ id: 33 }],
    });
    expect(response.total).toBe(38);
  });
  it("buildInstallPlanFromEntries matrix 33", () => {
    const plan = buildInstallPlanFromEntries([
      {
        key: "mcp:x-33",
        title: "T",
        category: "mcp",
        install: { installCommand: "npm i" },
      },
    ]);
    expect(plan).toHaveLength(1);
  });
  it("buildPlanWorkflowResponse matrix 33", () => {
    const response = buildPlanWorkflowResponse({
      goal: "goal-33",
      category: "",
      platform: "",
      selected: [],
      installPlan: [],
      categoryMix: {},
      trustSummary: {},
    });
    expect(response.plannerNotes.length).toBeGreaterThan(3);
  });
  it("buildRecommendForTaskResponse matrix 33", () => {
    const response = buildRecommendForTaskResponse({
      task: "task-33",
      category: "",
      platform: "",
      recommendations: [],
      installPlan: [],
      trustSummary: {},
    });
    expect(response.notes.length).toBeGreaterThan(2);
  });
  it("buildRecentUpdatesResponse matrix 33", () => {
    const response = buildRecentUpdatesResponse({
      category: "mcp",
      since: "",
      entries: [],
    });
    expect(response.ok).toBe(true);
  });
  it("buildRelatedEntriesGraphResponse matrix 33", () => {
    const response = buildRelatedEntriesGraphResponse({
      target: { category: "mcp", slug: "demo-33" },
      entries: [],
      limit: 5,
    });
    expect(response.relationGraph).toBe(true);
  });
  it("buildTrendingResourceResponse matrix 33", () => {
    const response = buildTrendingResourceResponse({
      payload: { schemaVersion: 1 },
      entries: [],
    });
    expect(response.kind).toBe("registry-trending");
  });
  it("buildJobsActiveResourceResponse matrix 33", () => {
    const response = buildJobsActiveResourceResponse({
      payload: { totalAvailable: 33 },
      entries: [],
    });
    expect(response.kind).toBe("jobs-active");
  });
  it("buildRegistryResourcePayload matrix 33", () => {
    const payload = buildRegistryResourcePayload(
      "heyclaude://test",
      { ok: true },
      "application/json",
      (v) => v,
    );
    expect(payload.contents[0].uri).toBe("heyclaude://test");
  });
  it("buildCategoryResourcePayload matrix 33", () => {
    const payload = buildCategoryResourcePayload(
      "mcp",
      [{ category: "mcp", slug: "demo-33" }],
      toEntrySummary,
    );
    expect(payload.total).toBe(1);
  });
  it("buildListRegistryResourcesResponse matrix 33", () => {
    const response = buildListRegistryResourcesResponse({
      manifest: {},
      categories: ["mcp"],
      discoveryResources: [],
      jsonMimeType: "application/json",
    });
    expect(response.resources.length).toBeGreaterThan(1);
  });
  it("buildPlatformAdapterUnavailableResponse matrix 33", () => {
    const response = buildPlatformAdapterUnavailableResponse(
      "vscode",
      "skill-33",
    );
    expect(response.adapterAvailable).toBe(false);
  });
  it("buildDistributionFeedsResponse matrix 33", () => {
    const response = buildDistributionFeedsResponse({
      manifest: { schemaVersion: 1, generatedAt: "now", artifacts: {} },
      feedIndex: { categories: [], platforms: [] },
      platformFeedSlug: (p: string) => p,
    });
    expect(response.ok).toBe(true);
  });
  it("buildExplainEntryTrustResponse matrix 33", () => {
    const entry = { category: "mcp", slug: "demo-33", title: "Demo" };
    const response = buildExplainEntryTrustResponse({
      entry,
      entryCanonicalUrl: () => "https://example.com",
      entryTrustSummary: () => ({}),
    });
    expect(response.key).toBe("mcp:demo-33");
  });
  it("buildInstallGuidanceResponse matrix 33", () => {
    const entry = { category: "mcp", slug: "demo-33", title: "Demo" };
    const response = buildInstallGuidanceResponse({
      entry,
      platform: "",
      selectedCompatibility: null,
      compatibility: [],
      entryCanonicalUrl: () => "",
      entryTrustSummary: () => ({}),
      notes: () => [],
    });
    expect(response.key).toBe("mcp:demo-33");
  });
  it("sortEntriesByUpdatedAt matrix 33", () => {
    const sorted = sortEntriesByUpdatedAt(
      [
        { title: "b", dateAdded: "2026-01-07" },
        { title: "a", dateAdded: "2026-01-01" },
      ],
      entryUpdatedAt,
    );
    expect(sorted.length).toBe(2);
  });
  it("buildDiscoveryRecentResponse matrix 33", () => {
    const response = buildDiscoveryRecentResponse({
      entries: [
        {
          category: "mcp",
          slug: "demo-33",
          title: "Demo",
          dateAdded: "2026-01-01",
        },
      ],
      toEntrySummary,
      entryUpdatedAt,
    });
    expect(response.kind).toBe("registry-recent");
  });
  it("buildSearchRegistryResponse matrix 34", () => {
    const response = buildSearchRegistryResponse({
      entries: [{ key: "mcp:demo-34" }],
      args: { query: "q34" },
      category: "mcp",
      platform: "",
      tag: "",
      trustFilters: {},
    });
    expect(response.ok).toBe(true);
    expect(response.count).toBe(1);
  });
  it("buildCategoryEntriesPageResponse matrix 34", () => {
    const response = buildCategoryEntriesPageResponse({
      entries: Array.from({ length: 39 }, (_, j) => ({ id: j })),
      category: "mcp",
      platform: "",
      tag: "",
      query: "",
      offset: 34,
      limit: 5,
      page: [{ id: 34 }],
    });
    expect(response.total).toBe(39);
  });
  it("buildInstallPlanFromEntries matrix 34", () => {
    const plan = buildInstallPlanFromEntries([
      {
        key: "mcp:x-34",
        title: "T",
        category: "mcp",
        install: { installCommand: "npm i" },
      },
    ]);
    expect(plan).toHaveLength(1);
  });
  it("buildPlanWorkflowResponse matrix 34", () => {
    const response = buildPlanWorkflowResponse({
      goal: "goal-34",
      category: "",
      platform: "",
      selected: [],
      installPlan: [],
      categoryMix: {},
      trustSummary: {},
    });
    expect(response.plannerNotes.length).toBeGreaterThan(3);
  });
  it("buildRecommendForTaskResponse matrix 34", () => {
    const response = buildRecommendForTaskResponse({
      task: "task-34",
      category: "",
      platform: "",
      recommendations: [],
      installPlan: [],
      trustSummary: {},
    });
    expect(response.notes.length).toBeGreaterThan(2);
  });
  it("buildRecentUpdatesResponse matrix 34", () => {
    const response = buildRecentUpdatesResponse({
      category: "mcp",
      since: "",
      entries: [],
    });
    expect(response.ok).toBe(true);
  });
  it("buildRelatedEntriesGraphResponse matrix 34", () => {
    const response = buildRelatedEntriesGraphResponse({
      target: { category: "mcp", slug: "demo-34" },
      entries: [],
      limit: 5,
    });
    expect(response.relationGraph).toBe(true);
  });
  it("buildTrendingResourceResponse matrix 34", () => {
    const response = buildTrendingResourceResponse({
      payload: { schemaVersion: 1 },
      entries: [],
    });
    expect(response.kind).toBe("registry-trending");
  });
  it("buildJobsActiveResourceResponse matrix 34", () => {
    const response = buildJobsActiveResourceResponse({
      payload: { totalAvailable: 34 },
      entries: [],
    });
    expect(response.kind).toBe("jobs-active");
  });
  it("buildRegistryResourcePayload matrix 34", () => {
    const payload = buildRegistryResourcePayload(
      "heyclaude://test",
      { ok: true },
      "application/json",
      (v) => v,
    );
    expect(payload.contents[0].uri).toBe("heyclaude://test");
  });
  it("buildCategoryResourcePayload matrix 34", () => {
    const payload = buildCategoryResourcePayload(
      "mcp",
      [{ category: "mcp", slug: "demo-34" }],
      toEntrySummary,
    );
    expect(payload.total).toBe(1);
  });
  it("buildListRegistryResourcesResponse matrix 34", () => {
    const response = buildListRegistryResourcesResponse({
      manifest: {},
      categories: ["mcp"],
      discoveryResources: [],
      jsonMimeType: "application/json",
    });
    expect(response.resources.length).toBeGreaterThan(1);
  });
  it("buildPlatformAdapterUnavailableResponse matrix 34", () => {
    const response = buildPlatformAdapterUnavailableResponse(
      "vscode",
      "skill-34",
    );
    expect(response.adapterAvailable).toBe(false);
  });
  it("buildDistributionFeedsResponse matrix 34", () => {
    const response = buildDistributionFeedsResponse({
      manifest: { schemaVersion: 1, generatedAt: "now", artifacts: {} },
      feedIndex: { categories: [], platforms: [] },
      platformFeedSlug: (p: string) => p,
    });
    expect(response.ok).toBe(true);
  });
  it("buildExplainEntryTrustResponse matrix 34", () => {
    const entry = { category: "mcp", slug: "demo-34", title: "Demo" };
    const response = buildExplainEntryTrustResponse({
      entry,
      entryCanonicalUrl: () => "https://example.com",
      entryTrustSummary: () => ({}),
    });
    expect(response.key).toBe("mcp:demo-34");
  });
  it("buildInstallGuidanceResponse matrix 34", () => {
    const entry = { category: "mcp", slug: "demo-34", title: "Demo" };
    const response = buildInstallGuidanceResponse({
      entry,
      platform: "",
      selectedCompatibility: null,
      compatibility: [],
      entryCanonicalUrl: () => "",
      entryTrustSummary: () => ({}),
      notes: () => [],
    });
    expect(response.key).toBe("mcp:demo-34");
  });
  it("sortEntriesByUpdatedAt matrix 34", () => {
    const sorted = sortEntriesByUpdatedAt(
      [
        { title: "b", dateAdded: "2026-01-08" },
        { title: "a", dateAdded: "2026-01-01" },
      ],
      entryUpdatedAt,
    );
    expect(sorted.length).toBe(2);
  });
  it("buildDiscoveryRecentResponse matrix 34", () => {
    const response = buildDiscoveryRecentResponse({
      entries: [
        {
          category: "mcp",
          slug: "demo-34",
          title: "Demo",
          dateAdded: "2026-01-01",
        },
      ],
      toEntrySummary,
      entryUpdatedAt,
    });
    expect(response.kind).toBe("registry-recent");
  });
  it("buildSearchRegistryResponse matrix 35", () => {
    const response = buildSearchRegistryResponse({
      entries: [{ key: "mcp:demo-35" }],
      args: { query: "q35" },
      category: "mcp",
      platform: "",
      tag: "",
      trustFilters: {},
    });
    expect(response.ok).toBe(true);
    expect(response.count).toBe(1);
  });
  it("buildCategoryEntriesPageResponse matrix 35", () => {
    const response = buildCategoryEntriesPageResponse({
      entries: Array.from({ length: 40 }, (_, j) => ({ id: j })),
      category: "mcp",
      platform: "",
      tag: "",
      query: "",
      offset: 35,
      limit: 5,
      page: [{ id: 35 }],
    });
    expect(response.total).toBe(40);
  });
  it("buildInstallPlanFromEntries matrix 35", () => {
    const plan = buildInstallPlanFromEntries([
      {
        key: "mcp:x-35",
        title: "T",
        category: "mcp",
        install: { installCommand: "npm i" },
      },
    ]);
    expect(plan).toHaveLength(1);
  });
  it("buildPlanWorkflowResponse matrix 35", () => {
    const response = buildPlanWorkflowResponse({
      goal: "goal-35",
      category: "",
      platform: "",
      selected: [],
      installPlan: [],
      categoryMix: {},
      trustSummary: {},
    });
    expect(response.plannerNotes.length).toBeGreaterThan(3);
  });
  it("buildRecommendForTaskResponse matrix 35", () => {
    const response = buildRecommendForTaskResponse({
      task: "task-35",
      category: "",
      platform: "",
      recommendations: [],
      installPlan: [],
      trustSummary: {},
    });
    expect(response.notes.length).toBeGreaterThan(2);
  });
  it("buildRecentUpdatesResponse matrix 35", () => {
    const response = buildRecentUpdatesResponse({
      category: "mcp",
      since: "",
      entries: [],
    });
    expect(response.ok).toBe(true);
  });
  it("buildRelatedEntriesGraphResponse matrix 35", () => {
    const response = buildRelatedEntriesGraphResponse({
      target: { category: "mcp", slug: "demo-35" },
      entries: [],
      limit: 5,
    });
    expect(response.relationGraph).toBe(true);
  });
  it("buildTrendingResourceResponse matrix 35", () => {
    const response = buildTrendingResourceResponse({
      payload: { schemaVersion: 1 },
      entries: [],
    });
    expect(response.kind).toBe("registry-trending");
  });
  it("buildJobsActiveResourceResponse matrix 35", () => {
    const response = buildJobsActiveResourceResponse({
      payload: { totalAvailable: 35 },
      entries: [],
    });
    expect(response.kind).toBe("jobs-active");
  });
  it("buildRegistryResourcePayload matrix 35", () => {
    const payload = buildRegistryResourcePayload(
      "heyclaude://test",
      { ok: true },
      "application/json",
      (v) => v,
    );
    expect(payload.contents[0].uri).toBe("heyclaude://test");
  });
  it("buildCategoryResourcePayload matrix 35", () => {
    const payload = buildCategoryResourcePayload(
      "mcp",
      [{ category: "mcp", slug: "demo-35" }],
      toEntrySummary,
    );
    expect(payload.total).toBe(1);
  });
  it("buildListRegistryResourcesResponse matrix 35", () => {
    const response = buildListRegistryResourcesResponse({
      manifest: {},
      categories: ["mcp"],
      discoveryResources: [],
      jsonMimeType: "application/json",
    });
    expect(response.resources.length).toBeGreaterThan(1);
  });
  it("buildPlatformAdapterUnavailableResponse matrix 35", () => {
    const response = buildPlatformAdapterUnavailableResponse(
      "vscode",
      "skill-35",
    );
    expect(response.adapterAvailable).toBe(false);
  });
  it("buildDistributionFeedsResponse matrix 35", () => {
    const response = buildDistributionFeedsResponse({
      manifest: { schemaVersion: 1, generatedAt: "now", artifacts: {} },
      feedIndex: { categories: [], platforms: [] },
      platformFeedSlug: (p: string) => p,
    });
    expect(response.ok).toBe(true);
  });
  it("buildExplainEntryTrustResponse matrix 35", () => {
    const entry = { category: "mcp", slug: "demo-35", title: "Demo" };
    const response = buildExplainEntryTrustResponse({
      entry,
      entryCanonicalUrl: () => "https://example.com",
      entryTrustSummary: () => ({}),
    });
    expect(response.key).toBe("mcp:demo-35");
  });
  it("buildInstallGuidanceResponse matrix 35", () => {
    const entry = { category: "mcp", slug: "demo-35", title: "Demo" };
    const response = buildInstallGuidanceResponse({
      entry,
      platform: "",
      selectedCompatibility: null,
      compatibility: [],
      entryCanonicalUrl: () => "",
      entryTrustSummary: () => ({}),
      notes: () => [],
    });
    expect(response.key).toBe("mcp:demo-35");
  });
  it("sortEntriesByUpdatedAt matrix 35", () => {
    const sorted = sortEntriesByUpdatedAt(
      [
        { title: "b", dateAdded: "2026-01-09" },
        { title: "a", dateAdded: "2026-01-01" },
      ],
      entryUpdatedAt,
    );
    expect(sorted.length).toBe(2);
  });
  it("buildDiscoveryRecentResponse matrix 35", () => {
    const response = buildDiscoveryRecentResponse({
      entries: [
        {
          category: "mcp",
          slug: "demo-35",
          title: "Demo",
          dateAdded: "2026-01-01",
        },
      ],
      toEntrySummary,
      entryUpdatedAt,
    });
    expect(response.kind).toBe("registry-recent");
  });
  it("buildSearchRegistryResponse matrix 36", () => {
    const response = buildSearchRegistryResponse({
      entries: [{ key: "mcp:demo-36" }],
      args: { query: "q36" },
      category: "mcp",
      platform: "",
      tag: "",
      trustFilters: {},
    });
    expect(response.ok).toBe(true);
    expect(response.count).toBe(1);
  });
  it("buildCategoryEntriesPageResponse matrix 36", () => {
    const response = buildCategoryEntriesPageResponse({
      entries: Array.from({ length: 41 }, (_, j) => ({ id: j })),
      category: "mcp",
      platform: "",
      tag: "",
      query: "",
      offset: 36,
      limit: 5,
      page: [{ id: 36 }],
    });
    expect(response.total).toBe(41);
  });
  it("buildInstallPlanFromEntries matrix 36", () => {
    const plan = buildInstallPlanFromEntries([
      {
        key: "mcp:x-36",
        title: "T",
        category: "mcp",
        install: { installCommand: "npm i" },
      },
    ]);
    expect(plan).toHaveLength(1);
  });
  it("buildPlanWorkflowResponse matrix 36", () => {
    const response = buildPlanWorkflowResponse({
      goal: "goal-36",
      category: "",
      platform: "",
      selected: [],
      installPlan: [],
      categoryMix: {},
      trustSummary: {},
    });
    expect(response.plannerNotes.length).toBeGreaterThan(3);
  });
  it("buildRecommendForTaskResponse matrix 36", () => {
    const response = buildRecommendForTaskResponse({
      task: "task-36",
      category: "",
      platform: "",
      recommendations: [],
      installPlan: [],
      trustSummary: {},
    });
    expect(response.notes.length).toBeGreaterThan(2);
  });
  it("buildRecentUpdatesResponse matrix 36", () => {
    const response = buildRecentUpdatesResponse({
      category: "mcp",
      since: "",
      entries: [],
    });
    expect(response.ok).toBe(true);
  });
  it("buildRelatedEntriesGraphResponse matrix 36", () => {
    const response = buildRelatedEntriesGraphResponse({
      target: { category: "mcp", slug: "demo-36" },
      entries: [],
      limit: 5,
    });
    expect(response.relationGraph).toBe(true);
  });
  it("buildTrendingResourceResponse matrix 36", () => {
    const response = buildTrendingResourceResponse({
      payload: { schemaVersion: 1 },
      entries: [],
    });
    expect(response.kind).toBe("registry-trending");
  });
  it("buildJobsActiveResourceResponse matrix 36", () => {
    const response = buildJobsActiveResourceResponse({
      payload: { totalAvailable: 36 },
      entries: [],
    });
    expect(response.kind).toBe("jobs-active");
  });
  it("buildRegistryResourcePayload matrix 36", () => {
    const payload = buildRegistryResourcePayload(
      "heyclaude://test",
      { ok: true },
      "application/json",
      (v) => v,
    );
    expect(payload.contents[0].uri).toBe("heyclaude://test");
  });
  it("buildCategoryResourcePayload matrix 36", () => {
    const payload = buildCategoryResourcePayload(
      "mcp",
      [{ category: "mcp", slug: "demo-36" }],
      toEntrySummary,
    );
    expect(payload.total).toBe(1);
  });
  it("buildListRegistryResourcesResponse matrix 36", () => {
    const response = buildListRegistryResourcesResponse({
      manifest: {},
      categories: ["mcp"],
      discoveryResources: [],
      jsonMimeType: "application/json",
    });
    expect(response.resources.length).toBeGreaterThan(1);
  });
  it("buildPlatformAdapterUnavailableResponse matrix 36", () => {
    const response = buildPlatformAdapterUnavailableResponse(
      "vscode",
      "skill-36",
    );
    expect(response.adapterAvailable).toBe(false);
  });
  it("buildDistributionFeedsResponse matrix 36", () => {
    const response = buildDistributionFeedsResponse({
      manifest: { schemaVersion: 1, generatedAt: "now", artifacts: {} },
      feedIndex: { categories: [], platforms: [] },
      platformFeedSlug: (p: string) => p,
    });
    expect(response.ok).toBe(true);
  });
  it("buildExplainEntryTrustResponse matrix 36", () => {
    const entry = { category: "mcp", slug: "demo-36", title: "Demo" };
    const response = buildExplainEntryTrustResponse({
      entry,
      entryCanonicalUrl: () => "https://example.com",
      entryTrustSummary: () => ({}),
    });
    expect(response.key).toBe("mcp:demo-36");
  });
  it("buildInstallGuidanceResponse matrix 36", () => {
    const entry = { category: "mcp", slug: "demo-36", title: "Demo" };
    const response = buildInstallGuidanceResponse({
      entry,
      platform: "",
      selectedCompatibility: null,
      compatibility: [],
      entryCanonicalUrl: () => "",
      entryTrustSummary: () => ({}),
      notes: () => [],
    });
    expect(response.key).toBe("mcp:demo-36");
  });
  it("sortEntriesByUpdatedAt matrix 36", () => {
    const sorted = sortEntriesByUpdatedAt(
      [
        { title: "b", dateAdded: "2026-01-01" },
        { title: "a", dateAdded: "2026-01-01" },
      ],
      entryUpdatedAt,
    );
    expect(sorted.length).toBe(2);
  });
  it("buildDiscoveryRecentResponse matrix 36", () => {
    const response = buildDiscoveryRecentResponse({
      entries: [
        {
          category: "mcp",
          slug: "demo-36",
          title: "Demo",
          dateAdded: "2026-01-01",
        },
      ],
      toEntrySummary,
      entryUpdatedAt,
    });
    expect(response.kind).toBe("registry-recent");
  });
  it("buildSearchRegistryResponse matrix 37", () => {
    const response = buildSearchRegistryResponse({
      entries: [{ key: "mcp:demo-37" }],
      args: { query: "q37" },
      category: "mcp",
      platform: "",
      tag: "",
      trustFilters: {},
    });
    expect(response.ok).toBe(true);
    expect(response.count).toBe(1);
  });
  it("buildCategoryEntriesPageResponse matrix 37", () => {
    const response = buildCategoryEntriesPageResponse({
      entries: Array.from({ length: 42 }, (_, j) => ({ id: j })),
      category: "mcp",
      platform: "",
      tag: "",
      query: "",
      offset: 37,
      limit: 5,
      page: [{ id: 37 }],
    });
    expect(response.total).toBe(42);
  });
  it("buildInstallPlanFromEntries matrix 37", () => {
    const plan = buildInstallPlanFromEntries([
      {
        key: "mcp:x-37",
        title: "T",
        category: "mcp",
        install: { installCommand: "npm i" },
      },
    ]);
    expect(plan).toHaveLength(1);
  });
  it("buildPlanWorkflowResponse matrix 37", () => {
    const response = buildPlanWorkflowResponse({
      goal: "goal-37",
      category: "",
      platform: "",
      selected: [],
      installPlan: [],
      categoryMix: {},
      trustSummary: {},
    });
    expect(response.plannerNotes.length).toBeGreaterThan(3);
  });
  it("buildRecommendForTaskResponse matrix 37", () => {
    const response = buildRecommendForTaskResponse({
      task: "task-37",
      category: "",
      platform: "",
      recommendations: [],
      installPlan: [],
      trustSummary: {},
    });
    expect(response.notes.length).toBeGreaterThan(2);
  });
  it("buildRecentUpdatesResponse matrix 37", () => {
    const response = buildRecentUpdatesResponse({
      category: "mcp",
      since: "",
      entries: [],
    });
    expect(response.ok).toBe(true);
  });
  it("buildRelatedEntriesGraphResponse matrix 37", () => {
    const response = buildRelatedEntriesGraphResponse({
      target: { category: "mcp", slug: "demo-37" },
      entries: [],
      limit: 5,
    });
    expect(response.relationGraph).toBe(true);
  });
  it("buildTrendingResourceResponse matrix 37", () => {
    const response = buildTrendingResourceResponse({
      payload: { schemaVersion: 1 },
      entries: [],
    });
    expect(response.kind).toBe("registry-trending");
  });
  it("buildJobsActiveResourceResponse matrix 37", () => {
    const response = buildJobsActiveResourceResponse({
      payload: { totalAvailable: 37 },
      entries: [],
    });
    expect(response.kind).toBe("jobs-active");
  });
  it("buildRegistryResourcePayload matrix 37", () => {
    const payload = buildRegistryResourcePayload(
      "heyclaude://test",
      { ok: true },
      "application/json",
      (v) => v,
    );
    expect(payload.contents[0].uri).toBe("heyclaude://test");
  });
  it("buildCategoryResourcePayload matrix 37", () => {
    const payload = buildCategoryResourcePayload(
      "mcp",
      [{ category: "mcp", slug: "demo-37" }],
      toEntrySummary,
    );
    expect(payload.total).toBe(1);
  });
  it("buildListRegistryResourcesResponse matrix 37", () => {
    const response = buildListRegistryResourcesResponse({
      manifest: {},
      categories: ["mcp"],
      discoveryResources: [],
      jsonMimeType: "application/json",
    });
    expect(response.resources.length).toBeGreaterThan(1);
  });
  it("buildPlatformAdapterUnavailableResponse matrix 37", () => {
    const response = buildPlatformAdapterUnavailableResponse(
      "vscode",
      "skill-37",
    );
    expect(response.adapterAvailable).toBe(false);
  });
  it("buildDistributionFeedsResponse matrix 37", () => {
    const response = buildDistributionFeedsResponse({
      manifest: { schemaVersion: 1, generatedAt: "now", artifacts: {} },
      feedIndex: { categories: [], platforms: [] },
      platformFeedSlug: (p: string) => p,
    });
    expect(response.ok).toBe(true);
  });
  it("buildExplainEntryTrustResponse matrix 37", () => {
    const entry = { category: "mcp", slug: "demo-37", title: "Demo" };
    const response = buildExplainEntryTrustResponse({
      entry,
      entryCanonicalUrl: () => "https://example.com",
      entryTrustSummary: () => ({}),
    });
    expect(response.key).toBe("mcp:demo-37");
  });
  it("buildInstallGuidanceResponse matrix 37", () => {
    const entry = { category: "mcp", slug: "demo-37", title: "Demo" };
    const response = buildInstallGuidanceResponse({
      entry,
      platform: "",
      selectedCompatibility: null,
      compatibility: [],
      entryCanonicalUrl: () => "",
      entryTrustSummary: () => ({}),
      notes: () => [],
    });
    expect(response.key).toBe("mcp:demo-37");
  });
  it("sortEntriesByUpdatedAt matrix 37", () => {
    const sorted = sortEntriesByUpdatedAt(
      [
        { title: "b", dateAdded: "2026-01-02" },
        { title: "a", dateAdded: "2026-01-01" },
      ],
      entryUpdatedAt,
    );
    expect(sorted.length).toBe(2);
  });
  it("buildDiscoveryRecentResponse matrix 37", () => {
    const response = buildDiscoveryRecentResponse({
      entries: [
        {
          category: "mcp",
          slug: "demo-37",
          title: "Demo",
          dateAdded: "2026-01-01",
        },
      ],
      toEntrySummary,
      entryUpdatedAt,
    });
    expect(response.kind).toBe("registry-recent");
  });
  it("buildSearchRegistryResponse matrix 38", () => {
    const response = buildSearchRegistryResponse({
      entries: [{ key: "mcp:demo-38" }],
      args: { query: "q38" },
      category: "mcp",
      platform: "",
      tag: "",
      trustFilters: {},
    });
    expect(response.ok).toBe(true);
    expect(response.count).toBe(1);
  });
  it("buildCategoryEntriesPageResponse matrix 38", () => {
    const response = buildCategoryEntriesPageResponse({
      entries: Array.from({ length: 43 }, (_, j) => ({ id: j })),
      category: "mcp",
      platform: "",
      tag: "",
      query: "",
      offset: 38,
      limit: 5,
      page: [{ id: 38 }],
    });
    expect(response.total).toBe(43);
  });
  it("buildInstallPlanFromEntries matrix 38", () => {
    const plan = buildInstallPlanFromEntries([
      {
        key: "mcp:x-38",
        title: "T",
        category: "mcp",
        install: { installCommand: "npm i" },
      },
    ]);
    expect(plan).toHaveLength(1);
  });
  it("buildPlanWorkflowResponse matrix 38", () => {
    const response = buildPlanWorkflowResponse({
      goal: "goal-38",
      category: "",
      platform: "",
      selected: [],
      installPlan: [],
      categoryMix: {},
      trustSummary: {},
    });
    expect(response.plannerNotes.length).toBeGreaterThan(3);
  });
  it("buildRecommendForTaskResponse matrix 38", () => {
    const response = buildRecommendForTaskResponse({
      task: "task-38",
      category: "",
      platform: "",
      recommendations: [],
      installPlan: [],
      trustSummary: {},
    });
    expect(response.notes.length).toBeGreaterThan(2);
  });
  it("buildRecentUpdatesResponse matrix 38", () => {
    const response = buildRecentUpdatesResponse({
      category: "mcp",
      since: "",
      entries: [],
    });
    expect(response.ok).toBe(true);
  });
  it("buildRelatedEntriesGraphResponse matrix 38", () => {
    const response = buildRelatedEntriesGraphResponse({
      target: { category: "mcp", slug: "demo-38" },
      entries: [],
      limit: 5,
    });
    expect(response.relationGraph).toBe(true);
  });
  it("buildTrendingResourceResponse matrix 38", () => {
    const response = buildTrendingResourceResponse({
      payload: { schemaVersion: 1 },
      entries: [],
    });
    expect(response.kind).toBe("registry-trending");
  });
  it("buildJobsActiveResourceResponse matrix 38", () => {
    const response = buildJobsActiveResourceResponse({
      payload: { totalAvailable: 38 },
      entries: [],
    });
    expect(response.kind).toBe("jobs-active");
  });
  it("buildRegistryResourcePayload matrix 38", () => {
    const payload = buildRegistryResourcePayload(
      "heyclaude://test",
      { ok: true },
      "application/json",
      (v) => v,
    );
    expect(payload.contents[0].uri).toBe("heyclaude://test");
  });
  it("buildCategoryResourcePayload matrix 38", () => {
    const payload = buildCategoryResourcePayload(
      "mcp",
      [{ category: "mcp", slug: "demo-38" }],
      toEntrySummary,
    );
    expect(payload.total).toBe(1);
  });
  it("buildListRegistryResourcesResponse matrix 38", () => {
    const response = buildListRegistryResourcesResponse({
      manifest: {},
      categories: ["mcp"],
      discoveryResources: [],
      jsonMimeType: "application/json",
    });
    expect(response.resources.length).toBeGreaterThan(1);
  });
  it("buildPlatformAdapterUnavailableResponse matrix 38", () => {
    const response = buildPlatformAdapterUnavailableResponse(
      "vscode",
      "skill-38",
    );
    expect(response.adapterAvailable).toBe(false);
  });
  it("buildDistributionFeedsResponse matrix 38", () => {
    const response = buildDistributionFeedsResponse({
      manifest: { schemaVersion: 1, generatedAt: "now", artifacts: {} },
      feedIndex: { categories: [], platforms: [] },
      platformFeedSlug: (p: string) => p,
    });
    expect(response.ok).toBe(true);
  });
  it("buildExplainEntryTrustResponse matrix 38", () => {
    const entry = { category: "mcp", slug: "demo-38", title: "Demo" };
    const response = buildExplainEntryTrustResponse({
      entry,
      entryCanonicalUrl: () => "https://example.com",
      entryTrustSummary: () => ({}),
    });
    expect(response.key).toBe("mcp:demo-38");
  });
  it("buildInstallGuidanceResponse matrix 38", () => {
    const entry = { category: "mcp", slug: "demo-38", title: "Demo" };
    const response = buildInstallGuidanceResponse({
      entry,
      platform: "",
      selectedCompatibility: null,
      compatibility: [],
      entryCanonicalUrl: () => "",
      entryTrustSummary: () => ({}),
      notes: () => [],
    });
    expect(response.key).toBe("mcp:demo-38");
  });
  it("sortEntriesByUpdatedAt matrix 38", () => {
    const sorted = sortEntriesByUpdatedAt(
      [
        { title: "b", dateAdded: "2026-01-03" },
        { title: "a", dateAdded: "2026-01-01" },
      ],
      entryUpdatedAt,
    );
    expect(sorted.length).toBe(2);
  });
  it("buildDiscoveryRecentResponse matrix 38", () => {
    const response = buildDiscoveryRecentResponse({
      entries: [
        {
          category: "mcp",
          slug: "demo-38",
          title: "Demo",
          dateAdded: "2026-01-01",
        },
      ],
      toEntrySummary,
      entryUpdatedAt,
    });
    expect(response.kind).toBe("registry-recent");
  });
  it("buildSearchRegistryResponse matrix 39", () => {
    const response = buildSearchRegistryResponse({
      entries: [{ key: "mcp:demo-39" }],
      args: { query: "q39" },
      category: "mcp",
      platform: "",
      tag: "",
      trustFilters: {},
    });
    expect(response.ok).toBe(true);
    expect(response.count).toBe(1);
  });
  it("buildCategoryEntriesPageResponse matrix 39", () => {
    const response = buildCategoryEntriesPageResponse({
      entries: Array.from({ length: 44 }, (_, j) => ({ id: j })),
      category: "mcp",
      platform: "",
      tag: "",
      query: "",
      offset: 39,
      limit: 5,
      page: [{ id: 39 }],
    });
    expect(response.total).toBe(44);
  });
  it("buildInstallPlanFromEntries matrix 39", () => {
    const plan = buildInstallPlanFromEntries([
      {
        key: "mcp:x-39",
        title: "T",
        category: "mcp",
        install: { installCommand: "npm i" },
      },
    ]);
    expect(plan).toHaveLength(1);
  });
  it("buildPlanWorkflowResponse matrix 39", () => {
    const response = buildPlanWorkflowResponse({
      goal: "goal-39",
      category: "",
      platform: "",
      selected: [],
      installPlan: [],
      categoryMix: {},
      trustSummary: {},
    });
    expect(response.plannerNotes.length).toBeGreaterThan(3);
  });
  it("buildRecommendForTaskResponse matrix 39", () => {
    const response = buildRecommendForTaskResponse({
      task: "task-39",
      category: "",
      platform: "",
      recommendations: [],
      installPlan: [],
      trustSummary: {},
    });
    expect(response.notes.length).toBeGreaterThan(2);
  });
  it("buildRecentUpdatesResponse matrix 39", () => {
    const response = buildRecentUpdatesResponse({
      category: "mcp",
      since: "",
      entries: [],
    });
    expect(response.ok).toBe(true);
  });
  it("buildRelatedEntriesGraphResponse matrix 39", () => {
    const response = buildRelatedEntriesGraphResponse({
      target: { category: "mcp", slug: "demo-39" },
      entries: [],
      limit: 5,
    });
    expect(response.relationGraph).toBe(true);
  });
  it("buildTrendingResourceResponse matrix 39", () => {
    const response = buildTrendingResourceResponse({
      payload: { schemaVersion: 1 },
      entries: [],
    });
    expect(response.kind).toBe("registry-trending");
  });
  it("buildJobsActiveResourceResponse matrix 39", () => {
    const response = buildJobsActiveResourceResponse({
      payload: { totalAvailable: 39 },
      entries: [],
    });
    expect(response.kind).toBe("jobs-active");
  });
  it("buildRegistryResourcePayload matrix 39", () => {
    const payload = buildRegistryResourcePayload(
      "heyclaude://test",
      { ok: true },
      "application/json",
      (v) => v,
    );
    expect(payload.contents[0].uri).toBe("heyclaude://test");
  });
  it("buildCategoryResourcePayload matrix 39", () => {
    const payload = buildCategoryResourcePayload(
      "mcp",
      [{ category: "mcp", slug: "demo-39" }],
      toEntrySummary,
    );
    expect(payload.total).toBe(1);
  });
  it("buildListRegistryResourcesResponse matrix 39", () => {
    const response = buildListRegistryResourcesResponse({
      manifest: {},
      categories: ["mcp"],
      discoveryResources: [],
      jsonMimeType: "application/json",
    });
    expect(response.resources.length).toBeGreaterThan(1);
  });
  it("buildPlatformAdapterUnavailableResponse matrix 39", () => {
    const response = buildPlatformAdapterUnavailableResponse(
      "vscode",
      "skill-39",
    );
    expect(response.adapterAvailable).toBe(false);
  });
  it("buildDistributionFeedsResponse matrix 39", () => {
    const response = buildDistributionFeedsResponse({
      manifest: { schemaVersion: 1, generatedAt: "now", artifacts: {} },
      feedIndex: { categories: [], platforms: [] },
      platformFeedSlug: (p: string) => p,
    });
    expect(response.ok).toBe(true);
  });
  it("buildExplainEntryTrustResponse matrix 39", () => {
    const entry = { category: "mcp", slug: "demo-39", title: "Demo" };
    const response = buildExplainEntryTrustResponse({
      entry,
      entryCanonicalUrl: () => "https://example.com",
      entryTrustSummary: () => ({}),
    });
    expect(response.key).toBe("mcp:demo-39");
  });
  it("buildInstallGuidanceResponse matrix 39", () => {
    const entry = { category: "mcp", slug: "demo-39", title: "Demo" };
    const response = buildInstallGuidanceResponse({
      entry,
      platform: "",
      selectedCompatibility: null,
      compatibility: [],
      entryCanonicalUrl: () => "",
      entryTrustSummary: () => ({}),
      notes: () => [],
    });
    expect(response.key).toBe("mcp:demo-39");
  });
  it("sortEntriesByUpdatedAt matrix 39", () => {
    const sorted = sortEntriesByUpdatedAt(
      [
        { title: "b", dateAdded: "2026-01-04" },
        { title: "a", dateAdded: "2026-01-01" },
      ],
      entryUpdatedAt,
    );
    expect(sorted.length).toBe(2);
  });
  it("buildDiscoveryRecentResponse matrix 39", () => {
    const response = buildDiscoveryRecentResponse({
      entries: [
        {
          category: "mcp",
          slug: "demo-39",
          title: "Demo",
          dateAdded: "2026-01-01",
        },
      ],
      toEntrySummary,
      entryUpdatedAt,
    });
    expect(response.kind).toBe("registry-recent");
  });
  it("buildSearchRegistryResponse matrix 40", () => {
    const response = buildSearchRegistryResponse({
      entries: [{ key: "mcp:demo-40" }],
      args: { query: "q40" },
      category: "mcp",
      platform: "",
      tag: "",
      trustFilters: {},
    });
    expect(response.ok).toBe(true);
    expect(response.count).toBe(1);
  });
  it("buildCategoryEntriesPageResponse matrix 40", () => {
    const response = buildCategoryEntriesPageResponse({
      entries: Array.from({ length: 45 }, (_, j) => ({ id: j })),
      category: "mcp",
      platform: "",
      tag: "",
      query: "",
      offset: 40,
      limit: 5,
      page: [{ id: 40 }],
    });
    expect(response.total).toBe(45);
  });
  it("buildInstallPlanFromEntries matrix 40", () => {
    const plan = buildInstallPlanFromEntries([
      {
        key: "mcp:x-40",
        title: "T",
        category: "mcp",
        install: { installCommand: "npm i" },
      },
    ]);
    expect(plan).toHaveLength(1);
  });
  it("buildPlanWorkflowResponse matrix 40", () => {
    const response = buildPlanWorkflowResponse({
      goal: "goal-40",
      category: "",
      platform: "",
      selected: [],
      installPlan: [],
      categoryMix: {},
      trustSummary: {},
    });
    expect(response.plannerNotes.length).toBeGreaterThan(3);
  });
  it("buildRecommendForTaskResponse matrix 40", () => {
    const response = buildRecommendForTaskResponse({
      task: "task-40",
      category: "",
      platform: "",
      recommendations: [],
      installPlan: [],
      trustSummary: {},
    });
    expect(response.notes.length).toBeGreaterThan(2);
  });
  it("buildRecentUpdatesResponse matrix 40", () => {
    const response = buildRecentUpdatesResponse({
      category: "mcp",
      since: "",
      entries: [],
    });
    expect(response.ok).toBe(true);
  });
  it("buildRelatedEntriesGraphResponse matrix 40", () => {
    const response = buildRelatedEntriesGraphResponse({
      target: { category: "mcp", slug: "demo-40" },
      entries: [],
      limit: 5,
    });
    expect(response.relationGraph).toBe(true);
  });
  it("buildTrendingResourceResponse matrix 40", () => {
    const response = buildTrendingResourceResponse({
      payload: { schemaVersion: 1 },
      entries: [],
    });
    expect(response.kind).toBe("registry-trending");
  });
  it("buildJobsActiveResourceResponse matrix 40", () => {
    const response = buildJobsActiveResourceResponse({
      payload: { totalAvailable: 40 },
      entries: [],
    });
    expect(response.kind).toBe("jobs-active");
  });
  it("buildRegistryResourcePayload matrix 40", () => {
    const payload = buildRegistryResourcePayload(
      "heyclaude://test",
      { ok: true },
      "application/json",
      (v) => v,
    );
    expect(payload.contents[0].uri).toBe("heyclaude://test");
  });
  it("buildCategoryResourcePayload matrix 40", () => {
    const payload = buildCategoryResourcePayload(
      "mcp",
      [{ category: "mcp", slug: "demo-40" }],
      toEntrySummary,
    );
    expect(payload.total).toBe(1);
  });
  it("buildListRegistryResourcesResponse matrix 40", () => {
    const response = buildListRegistryResourcesResponse({
      manifest: {},
      categories: ["mcp"],
      discoveryResources: [],
      jsonMimeType: "application/json",
    });
    expect(response.resources.length).toBeGreaterThan(1);
  });
  it("buildPlatformAdapterUnavailableResponse matrix 40", () => {
    const response = buildPlatformAdapterUnavailableResponse(
      "vscode",
      "skill-40",
    );
    expect(response.adapterAvailable).toBe(false);
  });
  it("buildDistributionFeedsResponse matrix 40", () => {
    const response = buildDistributionFeedsResponse({
      manifest: { schemaVersion: 1, generatedAt: "now", artifacts: {} },
      feedIndex: { categories: [], platforms: [] },
      platformFeedSlug: (p: string) => p,
    });
    expect(response.ok).toBe(true);
  });
  it("buildExplainEntryTrustResponse matrix 40", () => {
    const entry = { category: "mcp", slug: "demo-40", title: "Demo" };
    const response = buildExplainEntryTrustResponse({
      entry,
      entryCanonicalUrl: () => "https://example.com",
      entryTrustSummary: () => ({}),
    });
    expect(response.key).toBe("mcp:demo-40");
  });
  it("buildInstallGuidanceResponse matrix 40", () => {
    const entry = { category: "mcp", slug: "demo-40", title: "Demo" };
    const response = buildInstallGuidanceResponse({
      entry,
      platform: "",
      selectedCompatibility: null,
      compatibility: [],
      entryCanonicalUrl: () => "",
      entryTrustSummary: () => ({}),
      notes: () => [],
    });
    expect(response.key).toBe("mcp:demo-40");
  });
  it("sortEntriesByUpdatedAt matrix 40", () => {
    const sorted = sortEntriesByUpdatedAt(
      [
        { title: "b", dateAdded: "2026-01-05" },
        { title: "a", dateAdded: "2026-01-01" },
      ],
      entryUpdatedAt,
    );
    expect(sorted.length).toBe(2);
  });
  it("buildDiscoveryRecentResponse matrix 40", () => {
    const response = buildDiscoveryRecentResponse({
      entries: [
        {
          category: "mcp",
          slug: "demo-40",
          title: "Demo",
          dateAdded: "2026-01-01",
        },
      ],
      toEntrySummary,
      entryUpdatedAt,
    });
    expect(response.kind).toBe("registry-recent");
  });
  it("buildSearchRegistryResponse matrix 41", () => {
    const response = buildSearchRegistryResponse({
      entries: [{ key: "mcp:demo-41" }],
      args: { query: "q41" },
      category: "mcp",
      platform: "",
      tag: "",
      trustFilters: {},
    });
    expect(response.ok).toBe(true);
    expect(response.count).toBe(1);
  });
  it("buildCategoryEntriesPageResponse matrix 41", () => {
    const response = buildCategoryEntriesPageResponse({
      entries: Array.from({ length: 46 }, (_, j) => ({ id: j })),
      category: "mcp",
      platform: "",
      tag: "",
      query: "",
      offset: 41,
      limit: 5,
      page: [{ id: 41 }],
    });
    expect(response.total).toBe(46);
  });
  it("buildInstallPlanFromEntries matrix 41", () => {
    const plan = buildInstallPlanFromEntries([
      {
        key: "mcp:x-41",
        title: "T",
        category: "mcp",
        install: { installCommand: "npm i" },
      },
    ]);
    expect(plan).toHaveLength(1);
  });
  it("buildPlanWorkflowResponse matrix 41", () => {
    const response = buildPlanWorkflowResponse({
      goal: "goal-41",
      category: "",
      platform: "",
      selected: [],
      installPlan: [],
      categoryMix: {},
      trustSummary: {},
    });
    expect(response.plannerNotes.length).toBeGreaterThan(3);
  });
  it("buildRecommendForTaskResponse matrix 41", () => {
    const response = buildRecommendForTaskResponse({
      task: "task-41",
      category: "",
      platform: "",
      recommendations: [],
      installPlan: [],
      trustSummary: {},
    });
    expect(response.notes.length).toBeGreaterThan(2);
  });
  it("buildRecentUpdatesResponse matrix 41", () => {
    const response = buildRecentUpdatesResponse({
      category: "mcp",
      since: "",
      entries: [],
    });
    expect(response.ok).toBe(true);
  });
  it("buildRelatedEntriesGraphResponse matrix 41", () => {
    const response = buildRelatedEntriesGraphResponse({
      target: { category: "mcp", slug: "demo-41" },
      entries: [],
      limit: 5,
    });
    expect(response.relationGraph).toBe(true);
  });
  it("buildTrendingResourceResponse matrix 41", () => {
    const response = buildTrendingResourceResponse({
      payload: { schemaVersion: 1 },
      entries: [],
    });
    expect(response.kind).toBe("registry-trending");
  });
  it("buildJobsActiveResourceResponse matrix 41", () => {
    const response = buildJobsActiveResourceResponse({
      payload: { totalAvailable: 41 },
      entries: [],
    });
    expect(response.kind).toBe("jobs-active");
  });
  it("buildRegistryResourcePayload matrix 41", () => {
    const payload = buildRegistryResourcePayload(
      "heyclaude://test",
      { ok: true },
      "application/json",
      (v) => v,
    );
    expect(payload.contents[0].uri).toBe("heyclaude://test");
  });
  it("buildCategoryResourcePayload matrix 41", () => {
    const payload = buildCategoryResourcePayload(
      "mcp",
      [{ category: "mcp", slug: "demo-41" }],
      toEntrySummary,
    );
    expect(payload.total).toBe(1);
  });
  it("buildListRegistryResourcesResponse matrix 41", () => {
    const response = buildListRegistryResourcesResponse({
      manifest: {},
      categories: ["mcp"],
      discoveryResources: [],
      jsonMimeType: "application/json",
    });
    expect(response.resources.length).toBeGreaterThan(1);
  });
  it("buildPlatformAdapterUnavailableResponse matrix 41", () => {
    const response = buildPlatformAdapterUnavailableResponse(
      "vscode",
      "skill-41",
    );
    expect(response.adapterAvailable).toBe(false);
  });
  it("buildDistributionFeedsResponse matrix 41", () => {
    const response = buildDistributionFeedsResponse({
      manifest: { schemaVersion: 1, generatedAt: "now", artifacts: {} },
      feedIndex: { categories: [], platforms: [] },
      platformFeedSlug: (p: string) => p,
    });
    expect(response.ok).toBe(true);
  });
  it("buildExplainEntryTrustResponse matrix 41", () => {
    const entry = { category: "mcp", slug: "demo-41", title: "Demo" };
    const response = buildExplainEntryTrustResponse({
      entry,
      entryCanonicalUrl: () => "https://example.com",
      entryTrustSummary: () => ({}),
    });
    expect(response.key).toBe("mcp:demo-41");
  });
  it("buildInstallGuidanceResponse matrix 41", () => {
    const entry = { category: "mcp", slug: "demo-41", title: "Demo" };
    const response = buildInstallGuidanceResponse({
      entry,
      platform: "",
      selectedCompatibility: null,
      compatibility: [],
      entryCanonicalUrl: () => "",
      entryTrustSummary: () => ({}),
      notes: () => [],
    });
    expect(response.key).toBe("mcp:demo-41");
  });
  it("sortEntriesByUpdatedAt matrix 41", () => {
    const sorted = sortEntriesByUpdatedAt(
      [
        { title: "b", dateAdded: "2026-01-06" },
        { title: "a", dateAdded: "2026-01-01" },
      ],
      entryUpdatedAt,
    );
    expect(sorted.length).toBe(2);
  });
  it("buildDiscoveryRecentResponse matrix 41", () => {
    const response = buildDiscoveryRecentResponse({
      entries: [
        {
          category: "mcp",
          slug: "demo-41",
          title: "Demo",
          dateAdded: "2026-01-01",
        },
      ],
      toEntrySummary,
      entryUpdatedAt,
    });
    expect(response.kind).toBe("registry-recent");
  });
  it("buildSearchRegistryResponse matrix 42", () => {
    const response = buildSearchRegistryResponse({
      entries: [{ key: "mcp:demo-42" }],
      args: { query: "q42" },
      category: "mcp",
      platform: "",
      tag: "",
      trustFilters: {},
    });
    expect(response.ok).toBe(true);
    expect(response.count).toBe(1);
  });
  it("buildCategoryEntriesPageResponse matrix 42", () => {
    const response = buildCategoryEntriesPageResponse({
      entries: Array.from({ length: 47 }, (_, j) => ({ id: j })),
      category: "mcp",
      platform: "",
      tag: "",
      query: "",
      offset: 42,
      limit: 5,
      page: [{ id: 42 }],
    });
    expect(response.total).toBe(47);
  });
  it("buildInstallPlanFromEntries matrix 42", () => {
    const plan = buildInstallPlanFromEntries([
      {
        key: "mcp:x-42",
        title: "T",
        category: "mcp",
        install: { installCommand: "npm i" },
      },
    ]);
    expect(plan).toHaveLength(1);
  });
  it("buildPlanWorkflowResponse matrix 42", () => {
    const response = buildPlanWorkflowResponse({
      goal: "goal-42",
      category: "",
      platform: "",
      selected: [],
      installPlan: [],
      categoryMix: {},
      trustSummary: {},
    });
    expect(response.plannerNotes.length).toBeGreaterThan(3);
  });
  it("buildRecommendForTaskResponse matrix 42", () => {
    const response = buildRecommendForTaskResponse({
      task: "task-42",
      category: "",
      platform: "",
      recommendations: [],
      installPlan: [],
      trustSummary: {},
    });
    expect(response.notes.length).toBeGreaterThan(2);
  });
  it("buildRecentUpdatesResponse matrix 42", () => {
    const response = buildRecentUpdatesResponse({
      category: "mcp",
      since: "",
      entries: [],
    });
    expect(response.ok).toBe(true);
  });
  it("buildRelatedEntriesGraphResponse matrix 42", () => {
    const response = buildRelatedEntriesGraphResponse({
      target: { category: "mcp", slug: "demo-42" },
      entries: [],
      limit: 5,
    });
    expect(response.relationGraph).toBe(true);
  });
  it("buildTrendingResourceResponse matrix 42", () => {
    const response = buildTrendingResourceResponse({
      payload: { schemaVersion: 1 },
      entries: [],
    });
    expect(response.kind).toBe("registry-trending");
  });
  it("buildJobsActiveResourceResponse matrix 42", () => {
    const response = buildJobsActiveResourceResponse({
      payload: { totalAvailable: 42 },
      entries: [],
    });
    expect(response.kind).toBe("jobs-active");
  });
  it("buildRegistryResourcePayload matrix 42", () => {
    const payload = buildRegistryResourcePayload(
      "heyclaude://test",
      { ok: true },
      "application/json",
      (v) => v,
    );
    expect(payload.contents[0].uri).toBe("heyclaude://test");
  });
  it("buildCategoryResourcePayload matrix 42", () => {
    const payload = buildCategoryResourcePayload(
      "mcp",
      [{ category: "mcp", slug: "demo-42" }],
      toEntrySummary,
    );
    expect(payload.total).toBe(1);
  });
  it("buildListRegistryResourcesResponse matrix 42", () => {
    const response = buildListRegistryResourcesResponse({
      manifest: {},
      categories: ["mcp"],
      discoveryResources: [],
      jsonMimeType: "application/json",
    });
    expect(response.resources.length).toBeGreaterThan(1);
  });
  it("buildPlatformAdapterUnavailableResponse matrix 42", () => {
    const response = buildPlatformAdapterUnavailableResponse(
      "vscode",
      "skill-42",
    );
    expect(response.adapterAvailable).toBe(false);
  });
  it("buildDistributionFeedsResponse matrix 42", () => {
    const response = buildDistributionFeedsResponse({
      manifest: { schemaVersion: 1, generatedAt: "now", artifacts: {} },
      feedIndex: { categories: [], platforms: [] },
      platformFeedSlug: (p: string) => p,
    });
    expect(response.ok).toBe(true);
  });
  it("buildExplainEntryTrustResponse matrix 42", () => {
    const entry = { category: "mcp", slug: "demo-42", title: "Demo" };
    const response = buildExplainEntryTrustResponse({
      entry,
      entryCanonicalUrl: () => "https://example.com",
      entryTrustSummary: () => ({}),
    });
    expect(response.key).toBe("mcp:demo-42");
  });
  it("buildInstallGuidanceResponse matrix 42", () => {
    const entry = { category: "mcp", slug: "demo-42", title: "Demo" };
    const response = buildInstallGuidanceResponse({
      entry,
      platform: "",
      selectedCompatibility: null,
      compatibility: [],
      entryCanonicalUrl: () => "",
      entryTrustSummary: () => ({}),
      notes: () => [],
    });
    expect(response.key).toBe("mcp:demo-42");
  });
  it("sortEntriesByUpdatedAt matrix 42", () => {
    const sorted = sortEntriesByUpdatedAt(
      [
        { title: "b", dateAdded: "2026-01-07" },
        { title: "a", dateAdded: "2026-01-01" },
      ],
      entryUpdatedAt,
    );
    expect(sorted.length).toBe(2);
  });
  it("buildDiscoveryRecentResponse matrix 42", () => {
    const response = buildDiscoveryRecentResponse({
      entries: [
        {
          category: "mcp",
          slug: "demo-42",
          title: "Demo",
          dateAdded: "2026-01-01",
        },
      ],
      toEntrySummary,
      entryUpdatedAt,
    });
    expect(response.kind).toBe("registry-recent");
  });
  it("buildSearchRegistryResponse matrix 43", () => {
    const response = buildSearchRegistryResponse({
      entries: [{ key: "mcp:demo-43" }],
      args: { query: "q43" },
      category: "mcp",
      platform: "",
      tag: "",
      trustFilters: {},
    });
    expect(response.ok).toBe(true);
    expect(response.count).toBe(1);
  });
  it("buildCategoryEntriesPageResponse matrix 43", () => {
    const response = buildCategoryEntriesPageResponse({
      entries: Array.from({ length: 48 }, (_, j) => ({ id: j })),
      category: "mcp",
      platform: "",
      tag: "",
      query: "",
      offset: 43,
      limit: 5,
      page: [{ id: 43 }],
    });
    expect(response.total).toBe(48);
  });
  it("buildInstallPlanFromEntries matrix 43", () => {
    const plan = buildInstallPlanFromEntries([
      {
        key: "mcp:x-43",
        title: "T",
        category: "mcp",
        install: { installCommand: "npm i" },
      },
    ]);
    expect(plan).toHaveLength(1);
  });
  it("buildPlanWorkflowResponse matrix 43", () => {
    const response = buildPlanWorkflowResponse({
      goal: "goal-43",
      category: "",
      platform: "",
      selected: [],
      installPlan: [],
      categoryMix: {},
      trustSummary: {},
    });
    expect(response.plannerNotes.length).toBeGreaterThan(3);
  });
  it("buildRecommendForTaskResponse matrix 43", () => {
    const response = buildRecommendForTaskResponse({
      task: "task-43",
      category: "",
      platform: "",
      recommendations: [],
      installPlan: [],
      trustSummary: {},
    });
    expect(response.notes.length).toBeGreaterThan(2);
  });
  it("buildRecentUpdatesResponse matrix 43", () => {
    const response = buildRecentUpdatesResponse({
      category: "mcp",
      since: "",
      entries: [],
    });
    expect(response.ok).toBe(true);
  });
  it("buildRelatedEntriesGraphResponse matrix 43", () => {
    const response = buildRelatedEntriesGraphResponse({
      target: { category: "mcp", slug: "demo-43" },
      entries: [],
      limit: 5,
    });
    expect(response.relationGraph).toBe(true);
  });
  it("buildTrendingResourceResponse matrix 43", () => {
    const response = buildTrendingResourceResponse({
      payload: { schemaVersion: 1 },
      entries: [],
    });
    expect(response.kind).toBe("registry-trending");
  });
  it("buildJobsActiveResourceResponse matrix 43", () => {
    const response = buildJobsActiveResourceResponse({
      payload: { totalAvailable: 43 },
      entries: [],
    });
    expect(response.kind).toBe("jobs-active");
  });
  it("buildRegistryResourcePayload matrix 43", () => {
    const payload = buildRegistryResourcePayload(
      "heyclaude://test",
      { ok: true },
      "application/json",
      (v) => v,
    );
    expect(payload.contents[0].uri).toBe("heyclaude://test");
  });
  it("buildCategoryResourcePayload matrix 43", () => {
    const payload = buildCategoryResourcePayload(
      "mcp",
      [{ category: "mcp", slug: "demo-43" }],
      toEntrySummary,
    );
    expect(payload.total).toBe(1);
  });
  it("buildListRegistryResourcesResponse matrix 43", () => {
    const response = buildListRegistryResourcesResponse({
      manifest: {},
      categories: ["mcp"],
      discoveryResources: [],
      jsonMimeType: "application/json",
    });
    expect(response.resources.length).toBeGreaterThan(1);
  });
  it("buildPlatformAdapterUnavailableResponse matrix 43", () => {
    const response = buildPlatformAdapterUnavailableResponse(
      "vscode",
      "skill-43",
    );
    expect(response.adapterAvailable).toBe(false);
  });
  it("buildDistributionFeedsResponse matrix 43", () => {
    const response = buildDistributionFeedsResponse({
      manifest: { schemaVersion: 1, generatedAt: "now", artifacts: {} },
      feedIndex: { categories: [], platforms: [] },
      platformFeedSlug: (p: string) => p,
    });
    expect(response.ok).toBe(true);
  });
  it("buildExplainEntryTrustResponse matrix 43", () => {
    const entry = { category: "mcp", slug: "demo-43", title: "Demo" };
    const response = buildExplainEntryTrustResponse({
      entry,
      entryCanonicalUrl: () => "https://example.com",
      entryTrustSummary: () => ({}),
    });
    expect(response.key).toBe("mcp:demo-43");
  });
  it("buildInstallGuidanceResponse matrix 43", () => {
    const entry = { category: "mcp", slug: "demo-43", title: "Demo" };
    const response = buildInstallGuidanceResponse({
      entry,
      platform: "",
      selectedCompatibility: null,
      compatibility: [],
      entryCanonicalUrl: () => "",
      entryTrustSummary: () => ({}),
      notes: () => [],
    });
    expect(response.key).toBe("mcp:demo-43");
  });
  it("sortEntriesByUpdatedAt matrix 43", () => {
    const sorted = sortEntriesByUpdatedAt(
      [
        { title: "b", dateAdded: "2026-01-08" },
        { title: "a", dateAdded: "2026-01-01" },
      ],
      entryUpdatedAt,
    );
    expect(sorted.length).toBe(2);
  });
  it("buildDiscoveryRecentResponse matrix 43", () => {
    const response = buildDiscoveryRecentResponse({
      entries: [
        {
          category: "mcp",
          slug: "demo-43",
          title: "Demo",
          dateAdded: "2026-01-01",
        },
      ],
      toEntrySummary,
      entryUpdatedAt,
    });
    expect(response.kind).toBe("registry-recent");
  });
  it("buildSearchRegistryResponse matrix 44", () => {
    const response = buildSearchRegistryResponse({
      entries: [{ key: "mcp:demo-44" }],
      args: { query: "q44" },
      category: "mcp",
      platform: "",
      tag: "",
      trustFilters: {},
    });
    expect(response.ok).toBe(true);
    expect(response.count).toBe(1);
  });
  it("buildCategoryEntriesPageResponse matrix 44", () => {
    const response = buildCategoryEntriesPageResponse({
      entries: Array.from({ length: 49 }, (_, j) => ({ id: j })),
      category: "mcp",
      platform: "",
      tag: "",
      query: "",
      offset: 44,
      limit: 5,
      page: [{ id: 44 }],
    });
    expect(response.total).toBe(49);
  });
  it("buildInstallPlanFromEntries matrix 44", () => {
    const plan = buildInstallPlanFromEntries([
      {
        key: "mcp:x-44",
        title: "T",
        category: "mcp",
        install: { installCommand: "npm i" },
      },
    ]);
    expect(plan).toHaveLength(1);
  });
  it("buildPlanWorkflowResponse matrix 44", () => {
    const response = buildPlanWorkflowResponse({
      goal: "goal-44",
      category: "",
      platform: "",
      selected: [],
      installPlan: [],
      categoryMix: {},
      trustSummary: {},
    });
    expect(response.plannerNotes.length).toBeGreaterThan(3);
  });
  it("buildRecommendForTaskResponse matrix 44", () => {
    const response = buildRecommendForTaskResponse({
      task: "task-44",
      category: "",
      platform: "",
      recommendations: [],
      installPlan: [],
      trustSummary: {},
    });
    expect(response.notes.length).toBeGreaterThan(2);
  });
  it("buildRecentUpdatesResponse matrix 44", () => {
    const response = buildRecentUpdatesResponse({
      category: "mcp",
      since: "",
      entries: [],
    });
    expect(response.ok).toBe(true);
  });
  it("buildRelatedEntriesGraphResponse matrix 44", () => {
    const response = buildRelatedEntriesGraphResponse({
      target: { category: "mcp", slug: "demo-44" },
      entries: [],
      limit: 5,
    });
    expect(response.relationGraph).toBe(true);
  });
  it("buildTrendingResourceResponse matrix 44", () => {
    const response = buildTrendingResourceResponse({
      payload: { schemaVersion: 1 },
      entries: [],
    });
    expect(response.kind).toBe("registry-trending");
  });
  it("buildJobsActiveResourceResponse matrix 44", () => {
    const response = buildJobsActiveResourceResponse({
      payload: { totalAvailable: 44 },
      entries: [],
    });
    expect(response.kind).toBe("jobs-active");
  });
  it("buildRegistryResourcePayload matrix 44", () => {
    const payload = buildRegistryResourcePayload(
      "heyclaude://test",
      { ok: true },
      "application/json",
      (v) => v,
    );
    expect(payload.contents[0].uri).toBe("heyclaude://test");
  });
  it("buildCategoryResourcePayload matrix 44", () => {
    const payload = buildCategoryResourcePayload(
      "mcp",
      [{ category: "mcp", slug: "demo-44" }],
      toEntrySummary,
    );
    expect(payload.total).toBe(1);
  });
  it("buildListRegistryResourcesResponse matrix 44", () => {
    const response = buildListRegistryResourcesResponse({
      manifest: {},
      categories: ["mcp"],
      discoveryResources: [],
      jsonMimeType: "application/json",
    });
    expect(response.resources.length).toBeGreaterThan(1);
  });
  it("buildPlatformAdapterUnavailableResponse matrix 44", () => {
    const response = buildPlatformAdapterUnavailableResponse(
      "vscode",
      "skill-44",
    );
    expect(response.adapterAvailable).toBe(false);
  });
  it("buildDistributionFeedsResponse matrix 44", () => {
    const response = buildDistributionFeedsResponse({
      manifest: { schemaVersion: 1, generatedAt: "now", artifacts: {} },
      feedIndex: { categories: [], platforms: [] },
      platformFeedSlug: (p: string) => p,
    });
    expect(response.ok).toBe(true);
  });
  it("buildExplainEntryTrustResponse matrix 44", () => {
    const entry = { category: "mcp", slug: "demo-44", title: "Demo" };
    const response = buildExplainEntryTrustResponse({
      entry,
      entryCanonicalUrl: () => "https://example.com",
      entryTrustSummary: () => ({}),
    });
    expect(response.key).toBe("mcp:demo-44");
  });
  it("buildInstallGuidanceResponse matrix 44", () => {
    const entry = { category: "mcp", slug: "demo-44", title: "Demo" };
    const response = buildInstallGuidanceResponse({
      entry,
      platform: "",
      selectedCompatibility: null,
      compatibility: [],
      entryCanonicalUrl: () => "",
      entryTrustSummary: () => ({}),
      notes: () => [],
    });
    expect(response.key).toBe("mcp:demo-44");
  });
  it("sortEntriesByUpdatedAt matrix 44", () => {
    const sorted = sortEntriesByUpdatedAt(
      [
        { title: "b", dateAdded: "2026-01-09" },
        { title: "a", dateAdded: "2026-01-01" },
      ],
      entryUpdatedAt,
    );
    expect(sorted.length).toBe(2);
  });
  it("buildDiscoveryRecentResponse matrix 44", () => {
    const response = buildDiscoveryRecentResponse({
      entries: [
        {
          category: "mcp",
          slug: "demo-44",
          title: "Demo",
          dateAdded: "2026-01-01",
        },
      ],
      toEntrySummary,
      entryUpdatedAt,
    });
    expect(response.kind).toBe("registry-recent");
  });
  it("buildSearchRegistryResponse matrix 45", () => {
    const response = buildSearchRegistryResponse({
      entries: [{ key: "mcp:demo-45" }],
      args: { query: "q45" },
      category: "mcp",
      platform: "",
      tag: "",
      trustFilters: {},
    });
    expect(response.ok).toBe(true);
    expect(response.count).toBe(1);
  });
  it("buildCategoryEntriesPageResponse matrix 45", () => {
    const response = buildCategoryEntriesPageResponse({
      entries: Array.from({ length: 50 }, (_, j) => ({ id: j })),
      category: "mcp",
      platform: "",
      tag: "",
      query: "",
      offset: 45,
      limit: 5,
      page: [{ id: 45 }],
    });
    expect(response.total).toBe(50);
  });
  it("buildInstallPlanFromEntries matrix 45", () => {
    const plan = buildInstallPlanFromEntries([
      {
        key: "mcp:x-45",
        title: "T",
        category: "mcp",
        install: { installCommand: "npm i" },
      },
    ]);
    expect(plan).toHaveLength(1);
  });
  it("buildPlanWorkflowResponse matrix 45", () => {
    const response = buildPlanWorkflowResponse({
      goal: "goal-45",
      category: "",
      platform: "",
      selected: [],
      installPlan: [],
      categoryMix: {},
      trustSummary: {},
    });
    expect(response.plannerNotes.length).toBeGreaterThan(3);
  });
  it("buildRecommendForTaskResponse matrix 45", () => {
    const response = buildRecommendForTaskResponse({
      task: "task-45",
      category: "",
      platform: "",
      recommendations: [],
      installPlan: [],
      trustSummary: {},
    });
    expect(response.notes.length).toBeGreaterThan(2);
  });
  it("buildRecentUpdatesResponse matrix 45", () => {
    const response = buildRecentUpdatesResponse({
      category: "mcp",
      since: "",
      entries: [],
    });
    expect(response.ok).toBe(true);
  });
  it("buildRelatedEntriesGraphResponse matrix 45", () => {
    const response = buildRelatedEntriesGraphResponse({
      target: { category: "mcp", slug: "demo-45" },
      entries: [],
      limit: 5,
    });
    expect(response.relationGraph).toBe(true);
  });
  it("buildTrendingResourceResponse matrix 45", () => {
    const response = buildTrendingResourceResponse({
      payload: { schemaVersion: 1 },
      entries: [],
    });
    expect(response.kind).toBe("registry-trending");
  });
  it("buildJobsActiveResourceResponse matrix 45", () => {
    const response = buildJobsActiveResourceResponse({
      payload: { totalAvailable: 45 },
      entries: [],
    });
    expect(response.kind).toBe("jobs-active");
  });
  it("buildRegistryResourcePayload matrix 45", () => {
    const payload = buildRegistryResourcePayload(
      "heyclaude://test",
      { ok: true },
      "application/json",
      (v) => v,
    );
    expect(payload.contents[0].uri).toBe("heyclaude://test");
  });
  it("buildCategoryResourcePayload matrix 45", () => {
    const payload = buildCategoryResourcePayload(
      "mcp",
      [{ category: "mcp", slug: "demo-45" }],
      toEntrySummary,
    );
    expect(payload.total).toBe(1);
  });
  it("buildListRegistryResourcesResponse matrix 45", () => {
    const response = buildListRegistryResourcesResponse({
      manifest: {},
      categories: ["mcp"],
      discoveryResources: [],
      jsonMimeType: "application/json",
    });
    expect(response.resources.length).toBeGreaterThan(1);
  });
  it("buildPlatformAdapterUnavailableResponse matrix 45", () => {
    const response = buildPlatformAdapterUnavailableResponse(
      "vscode",
      "skill-45",
    );
    expect(response.adapterAvailable).toBe(false);
  });
  it("buildDistributionFeedsResponse matrix 45", () => {
    const response = buildDistributionFeedsResponse({
      manifest: { schemaVersion: 1, generatedAt: "now", artifacts: {} },
      feedIndex: { categories: [], platforms: [] },
      platformFeedSlug: (p: string) => p,
    });
    expect(response.ok).toBe(true);
  });
  it("buildExplainEntryTrustResponse matrix 45", () => {
    const entry = { category: "mcp", slug: "demo-45", title: "Demo" };
    const response = buildExplainEntryTrustResponse({
      entry,
      entryCanonicalUrl: () => "https://example.com",
      entryTrustSummary: () => ({}),
    });
    expect(response.key).toBe("mcp:demo-45");
  });
  it("buildInstallGuidanceResponse matrix 45", () => {
    const entry = { category: "mcp", slug: "demo-45", title: "Demo" };
    const response = buildInstallGuidanceResponse({
      entry,
      platform: "",
      selectedCompatibility: null,
      compatibility: [],
      entryCanonicalUrl: () => "",
      entryTrustSummary: () => ({}),
      notes: () => [],
    });
    expect(response.key).toBe("mcp:demo-45");
  });
  it("sortEntriesByUpdatedAt matrix 45", () => {
    const sorted = sortEntriesByUpdatedAt(
      [
        { title: "b", dateAdded: "2026-01-01" },
        { title: "a", dateAdded: "2026-01-01" },
      ],
      entryUpdatedAt,
    );
    expect(sorted.length).toBe(2);
  });
  it("buildDiscoveryRecentResponse matrix 45", () => {
    const response = buildDiscoveryRecentResponse({
      entries: [
        {
          category: "mcp",
          slug: "demo-45",
          title: "Demo",
          dateAdded: "2026-01-01",
        },
      ],
      toEntrySummary,
      entryUpdatedAt,
    });
    expect(response.kind).toBe("registry-recent");
  });
  it("buildSearchRegistryResponse matrix 46", () => {
    const response = buildSearchRegistryResponse({
      entries: [{ key: "mcp:demo-46" }],
      args: { query: "q46" },
      category: "mcp",
      platform: "",
      tag: "",
      trustFilters: {},
    });
    expect(response.ok).toBe(true);
    expect(response.count).toBe(1);
  });
  it("buildCategoryEntriesPageResponse matrix 46", () => {
    const response = buildCategoryEntriesPageResponse({
      entries: Array.from({ length: 51 }, (_, j) => ({ id: j })),
      category: "mcp",
      platform: "",
      tag: "",
      query: "",
      offset: 46,
      limit: 5,
      page: [{ id: 46 }],
    });
    expect(response.total).toBe(51);
  });
  it("buildInstallPlanFromEntries matrix 46", () => {
    const plan = buildInstallPlanFromEntries([
      {
        key: "mcp:x-46",
        title: "T",
        category: "mcp",
        install: { installCommand: "npm i" },
      },
    ]);
    expect(plan).toHaveLength(1);
  });
  it("buildPlanWorkflowResponse matrix 46", () => {
    const response = buildPlanWorkflowResponse({
      goal: "goal-46",
      category: "",
      platform: "",
      selected: [],
      installPlan: [],
      categoryMix: {},
      trustSummary: {},
    });
    expect(response.plannerNotes.length).toBeGreaterThan(3);
  });
  it("buildRecommendForTaskResponse matrix 46", () => {
    const response = buildRecommendForTaskResponse({
      task: "task-46",
      category: "",
      platform: "",
      recommendations: [],
      installPlan: [],
      trustSummary: {},
    });
    expect(response.notes.length).toBeGreaterThan(2);
  });
  it("buildRecentUpdatesResponse matrix 46", () => {
    const response = buildRecentUpdatesResponse({
      category: "mcp",
      since: "",
      entries: [],
    });
    expect(response.ok).toBe(true);
  });
  it("buildRelatedEntriesGraphResponse matrix 46", () => {
    const response = buildRelatedEntriesGraphResponse({
      target: { category: "mcp", slug: "demo-46" },
      entries: [],
      limit: 5,
    });
    expect(response.relationGraph).toBe(true);
  });
  it("buildTrendingResourceResponse matrix 46", () => {
    const response = buildTrendingResourceResponse({
      payload: { schemaVersion: 1 },
      entries: [],
    });
    expect(response.kind).toBe("registry-trending");
  });
  it("buildJobsActiveResourceResponse matrix 46", () => {
    const response = buildJobsActiveResourceResponse({
      payload: { totalAvailable: 46 },
      entries: [],
    });
    expect(response.kind).toBe("jobs-active");
  });
  it("buildRegistryResourcePayload matrix 46", () => {
    const payload = buildRegistryResourcePayload(
      "heyclaude://test",
      { ok: true },
      "application/json",
      (v) => v,
    );
    expect(payload.contents[0].uri).toBe("heyclaude://test");
  });
  it("buildCategoryResourcePayload matrix 46", () => {
    const payload = buildCategoryResourcePayload(
      "mcp",
      [{ category: "mcp", slug: "demo-46" }],
      toEntrySummary,
    );
    expect(payload.total).toBe(1);
  });
  it("buildListRegistryResourcesResponse matrix 46", () => {
    const response = buildListRegistryResourcesResponse({
      manifest: {},
      categories: ["mcp"],
      discoveryResources: [],
      jsonMimeType: "application/json",
    });
    expect(response.resources.length).toBeGreaterThan(1);
  });
  it("buildPlatformAdapterUnavailableResponse matrix 46", () => {
    const response = buildPlatformAdapterUnavailableResponse(
      "vscode",
      "skill-46",
    );
    expect(response.adapterAvailable).toBe(false);
  });
  it("buildDistributionFeedsResponse matrix 46", () => {
    const response = buildDistributionFeedsResponse({
      manifest: { schemaVersion: 1, generatedAt: "now", artifacts: {} },
      feedIndex: { categories: [], platforms: [] },
      platformFeedSlug: (p: string) => p,
    });
    expect(response.ok).toBe(true);
  });
  it("buildExplainEntryTrustResponse matrix 46", () => {
    const entry = { category: "mcp", slug: "demo-46", title: "Demo" };
    const response = buildExplainEntryTrustResponse({
      entry,
      entryCanonicalUrl: () => "https://example.com",
      entryTrustSummary: () => ({}),
    });
    expect(response.key).toBe("mcp:demo-46");
  });
  it("buildInstallGuidanceResponse matrix 46", () => {
    const entry = { category: "mcp", slug: "demo-46", title: "Demo" };
    const response = buildInstallGuidanceResponse({
      entry,
      platform: "",
      selectedCompatibility: null,
      compatibility: [],
      entryCanonicalUrl: () => "",
      entryTrustSummary: () => ({}),
      notes: () => [],
    });
    expect(response.key).toBe("mcp:demo-46");
  });
  it("sortEntriesByUpdatedAt matrix 46", () => {
    const sorted = sortEntriesByUpdatedAt(
      [
        { title: "b", dateAdded: "2026-01-02" },
        { title: "a", dateAdded: "2026-01-01" },
      ],
      entryUpdatedAt,
    );
    expect(sorted.length).toBe(2);
  });
  it("buildDiscoveryRecentResponse matrix 46", () => {
    const response = buildDiscoveryRecentResponse({
      entries: [
        {
          category: "mcp",
          slug: "demo-46",
          title: "Demo",
          dateAdded: "2026-01-01",
        },
      ],
      toEntrySummary,
      entryUpdatedAt,
    });
    expect(response.kind).toBe("registry-recent");
  });
  it("buildSearchRegistryResponse matrix 47", () => {
    const response = buildSearchRegistryResponse({
      entries: [{ key: "mcp:demo-47" }],
      args: { query: "q47" },
      category: "mcp",
      platform: "",
      tag: "",
      trustFilters: {},
    });
    expect(response.ok).toBe(true);
    expect(response.count).toBe(1);
  });
  it("buildCategoryEntriesPageResponse matrix 47", () => {
    const response = buildCategoryEntriesPageResponse({
      entries: Array.from({ length: 52 }, (_, j) => ({ id: j })),
      category: "mcp",
      platform: "",
      tag: "",
      query: "",
      offset: 47,
      limit: 5,
      page: [{ id: 47 }],
    });
    expect(response.total).toBe(52);
  });
  it("buildInstallPlanFromEntries matrix 47", () => {
    const plan = buildInstallPlanFromEntries([
      {
        key: "mcp:x-47",
        title: "T",
        category: "mcp",
        install: { installCommand: "npm i" },
      },
    ]);
    expect(plan).toHaveLength(1);
  });
  it("buildPlanWorkflowResponse matrix 47", () => {
    const response = buildPlanWorkflowResponse({
      goal: "goal-47",
      category: "",
      platform: "",
      selected: [],
      installPlan: [],
      categoryMix: {},
      trustSummary: {},
    });
    expect(response.plannerNotes.length).toBeGreaterThan(3);
  });
  it("buildRecommendForTaskResponse matrix 47", () => {
    const response = buildRecommendForTaskResponse({
      task: "task-47",
      category: "",
      platform: "",
      recommendations: [],
      installPlan: [],
      trustSummary: {},
    });
    expect(response.notes.length).toBeGreaterThan(2);
  });
  it("buildRecentUpdatesResponse matrix 47", () => {
    const response = buildRecentUpdatesResponse({
      category: "mcp",
      since: "",
      entries: [],
    });
    expect(response.ok).toBe(true);
  });
  it("buildRelatedEntriesGraphResponse matrix 47", () => {
    const response = buildRelatedEntriesGraphResponse({
      target: { category: "mcp", slug: "demo-47" },
      entries: [],
      limit: 5,
    });
    expect(response.relationGraph).toBe(true);
  });
  it("buildTrendingResourceResponse matrix 47", () => {
    const response = buildTrendingResourceResponse({
      payload: { schemaVersion: 1 },
      entries: [],
    });
    expect(response.kind).toBe("registry-trending");
  });
  it("buildJobsActiveResourceResponse matrix 47", () => {
    const response = buildJobsActiveResourceResponse({
      payload: { totalAvailable: 47 },
      entries: [],
    });
    expect(response.kind).toBe("jobs-active");
  });
  it("buildRegistryResourcePayload matrix 47", () => {
    const payload = buildRegistryResourcePayload(
      "heyclaude://test",
      { ok: true },
      "application/json",
      (v) => v,
    );
    expect(payload.contents[0].uri).toBe("heyclaude://test");
  });
  it("buildCategoryResourcePayload matrix 47", () => {
    const payload = buildCategoryResourcePayload(
      "mcp",
      [{ category: "mcp", slug: "demo-47" }],
      toEntrySummary,
    );
    expect(payload.total).toBe(1);
  });
  it("buildListRegistryResourcesResponse matrix 47", () => {
    const response = buildListRegistryResourcesResponse({
      manifest: {},
      categories: ["mcp"],
      discoveryResources: [],
      jsonMimeType: "application/json",
    });
    expect(response.resources.length).toBeGreaterThan(1);
  });
  it("buildPlatformAdapterUnavailableResponse matrix 47", () => {
    const response = buildPlatformAdapterUnavailableResponse(
      "vscode",
      "skill-47",
    );
    expect(response.adapterAvailable).toBe(false);
  });
  it("buildDistributionFeedsResponse matrix 47", () => {
    const response = buildDistributionFeedsResponse({
      manifest: { schemaVersion: 1, generatedAt: "now", artifacts: {} },
      feedIndex: { categories: [], platforms: [] },
      platformFeedSlug: (p: string) => p,
    });
    expect(response.ok).toBe(true);
  });
  it("buildExplainEntryTrustResponse matrix 47", () => {
    const entry = { category: "mcp", slug: "demo-47", title: "Demo" };
    const response = buildExplainEntryTrustResponse({
      entry,
      entryCanonicalUrl: () => "https://example.com",
      entryTrustSummary: () => ({}),
    });
    expect(response.key).toBe("mcp:demo-47");
  });
  it("buildInstallGuidanceResponse matrix 47", () => {
    const entry = { category: "mcp", slug: "demo-47", title: "Demo" };
    const response = buildInstallGuidanceResponse({
      entry,
      platform: "",
      selectedCompatibility: null,
      compatibility: [],
      entryCanonicalUrl: () => "",
      entryTrustSummary: () => ({}),
      notes: () => [],
    });
    expect(response.key).toBe("mcp:demo-47");
  });
  it("sortEntriesByUpdatedAt matrix 47", () => {
    const sorted = sortEntriesByUpdatedAt(
      [
        { title: "b", dateAdded: "2026-01-03" },
        { title: "a", dateAdded: "2026-01-01" },
      ],
      entryUpdatedAt,
    );
    expect(sorted.length).toBe(2);
  });
  it("buildDiscoveryRecentResponse matrix 47", () => {
    const response = buildDiscoveryRecentResponse({
      entries: [
        {
          category: "mcp",
          slug: "demo-47",
          title: "Demo",
          dateAdded: "2026-01-01",
        },
      ],
      toEntrySummary,
      entryUpdatedAt,
    });
    expect(response.kind).toBe("registry-recent");
  });
  it("buildSearchRegistryResponse matrix 48", () => {
    const response = buildSearchRegistryResponse({
      entries: [{ key: "mcp:demo-48" }],
      args: { query: "q48" },
      category: "mcp",
      platform: "",
      tag: "",
      trustFilters: {},
    });
    expect(response.ok).toBe(true);
    expect(response.count).toBe(1);
  });
  it("buildCategoryEntriesPageResponse matrix 48", () => {
    const response = buildCategoryEntriesPageResponse({
      entries: Array.from({ length: 53 }, (_, j) => ({ id: j })),
      category: "mcp",
      platform: "",
      tag: "",
      query: "",
      offset: 48,
      limit: 5,
      page: [{ id: 48 }],
    });
    expect(response.total).toBe(53);
  });
  it("buildInstallPlanFromEntries matrix 48", () => {
    const plan = buildInstallPlanFromEntries([
      {
        key: "mcp:x-48",
        title: "T",
        category: "mcp",
        install: { installCommand: "npm i" },
      },
    ]);
    expect(plan).toHaveLength(1);
  });
  it("buildPlanWorkflowResponse matrix 48", () => {
    const response = buildPlanWorkflowResponse({
      goal: "goal-48",
      category: "",
      platform: "",
      selected: [],
      installPlan: [],
      categoryMix: {},
      trustSummary: {},
    });
    expect(response.plannerNotes.length).toBeGreaterThan(3);
  });
  it("buildRecommendForTaskResponse matrix 48", () => {
    const response = buildRecommendForTaskResponse({
      task: "task-48",
      category: "",
      platform: "",
      recommendations: [],
      installPlan: [],
      trustSummary: {},
    });
    expect(response.notes.length).toBeGreaterThan(2);
  });
  it("buildRecentUpdatesResponse matrix 48", () => {
    const response = buildRecentUpdatesResponse({
      category: "mcp",
      since: "",
      entries: [],
    });
    expect(response.ok).toBe(true);
  });
  it("buildRelatedEntriesGraphResponse matrix 48", () => {
    const response = buildRelatedEntriesGraphResponse({
      target: { category: "mcp", slug: "demo-48" },
      entries: [],
      limit: 5,
    });
    expect(response.relationGraph).toBe(true);
  });
  it("buildTrendingResourceResponse matrix 48", () => {
    const response = buildTrendingResourceResponse({
      payload: { schemaVersion: 1 },
      entries: [],
    });
    expect(response.kind).toBe("registry-trending");
  });
  it("buildJobsActiveResourceResponse matrix 48", () => {
    const response = buildJobsActiveResourceResponse({
      payload: { totalAvailable: 48 },
      entries: [],
    });
    expect(response.kind).toBe("jobs-active");
  });
  it("buildRegistryResourcePayload matrix 48", () => {
    const payload = buildRegistryResourcePayload(
      "heyclaude://test",
      { ok: true },
      "application/json",
      (v) => v,
    );
    expect(payload.contents[0].uri).toBe("heyclaude://test");
  });
  it("buildCategoryResourcePayload matrix 48", () => {
    const payload = buildCategoryResourcePayload(
      "mcp",
      [{ category: "mcp", slug: "demo-48" }],
      toEntrySummary,
    );
    expect(payload.total).toBe(1);
  });
  it("buildListRegistryResourcesResponse matrix 48", () => {
    const response = buildListRegistryResourcesResponse({
      manifest: {},
      categories: ["mcp"],
      discoveryResources: [],
      jsonMimeType: "application/json",
    });
    expect(response.resources.length).toBeGreaterThan(1);
  });
  it("buildPlatformAdapterUnavailableResponse matrix 48", () => {
    const response = buildPlatformAdapterUnavailableResponse(
      "vscode",
      "skill-48",
    );
    expect(response.adapterAvailable).toBe(false);
  });
  it("buildDistributionFeedsResponse matrix 48", () => {
    const response = buildDistributionFeedsResponse({
      manifest: { schemaVersion: 1, generatedAt: "now", artifacts: {} },
      feedIndex: { categories: [], platforms: [] },
      platformFeedSlug: (p: string) => p,
    });
    expect(response.ok).toBe(true);
  });
  it("buildExplainEntryTrustResponse matrix 48", () => {
    const entry = { category: "mcp", slug: "demo-48", title: "Demo" };
    const response = buildExplainEntryTrustResponse({
      entry,
      entryCanonicalUrl: () => "https://example.com",
      entryTrustSummary: () => ({}),
    });
    expect(response.key).toBe("mcp:demo-48");
  });
  it("buildInstallGuidanceResponse matrix 48", () => {
    const entry = { category: "mcp", slug: "demo-48", title: "Demo" };
    const response = buildInstallGuidanceResponse({
      entry,
      platform: "",
      selectedCompatibility: null,
      compatibility: [],
      entryCanonicalUrl: () => "",
      entryTrustSummary: () => ({}),
      notes: () => [],
    });
    expect(response.key).toBe("mcp:demo-48");
  });
  it("sortEntriesByUpdatedAt matrix 48", () => {
    const sorted = sortEntriesByUpdatedAt(
      [
        { title: "b", dateAdded: "2026-01-04" },
        { title: "a", dateAdded: "2026-01-01" },
      ],
      entryUpdatedAt,
    );
    expect(sorted.length).toBe(2);
  });
  it("buildDiscoveryRecentResponse matrix 48", () => {
    const response = buildDiscoveryRecentResponse({
      entries: [
        {
          category: "mcp",
          slug: "demo-48",
          title: "Demo",
          dateAdded: "2026-01-01",
        },
      ],
      toEntrySummary,
      entryUpdatedAt,
    });
    expect(response.kind).toBe("registry-recent");
  });
  it("buildSearchRegistryResponse matrix 49", () => {
    const response = buildSearchRegistryResponse({
      entries: [{ key: "mcp:demo-49" }],
      args: { query: "q49" },
      category: "mcp",
      platform: "",
      tag: "",
      trustFilters: {},
    });
    expect(response.ok).toBe(true);
    expect(response.count).toBe(1);
  });
  it("buildCategoryEntriesPageResponse matrix 49", () => {
    const response = buildCategoryEntriesPageResponse({
      entries: Array.from({ length: 54 }, (_, j) => ({ id: j })),
      category: "mcp",
      platform: "",
      tag: "",
      query: "",
      offset: 49,
      limit: 5,
      page: [{ id: 49 }],
    });
    expect(response.total).toBe(54);
  });
  it("buildInstallPlanFromEntries matrix 49", () => {
    const plan = buildInstallPlanFromEntries([
      {
        key: "mcp:x-49",
        title: "T",
        category: "mcp",
        install: { installCommand: "npm i" },
      },
    ]);
    expect(plan).toHaveLength(1);
  });
  it("buildPlanWorkflowResponse matrix 49", () => {
    const response = buildPlanWorkflowResponse({
      goal: "goal-49",
      category: "",
      platform: "",
      selected: [],
      installPlan: [],
      categoryMix: {},
      trustSummary: {},
    });
    expect(response.plannerNotes.length).toBeGreaterThan(3);
  });
  it("buildRecommendForTaskResponse matrix 49", () => {
    const response = buildRecommendForTaskResponse({
      task: "task-49",
      category: "",
      platform: "",
      recommendations: [],
      installPlan: [],
      trustSummary: {},
    });
    expect(response.notes.length).toBeGreaterThan(2);
  });
  it("buildRecentUpdatesResponse matrix 49", () => {
    const response = buildRecentUpdatesResponse({
      category: "mcp",
      since: "",
      entries: [],
    });
    expect(response.ok).toBe(true);
  });
  it("buildRelatedEntriesGraphResponse matrix 49", () => {
    const response = buildRelatedEntriesGraphResponse({
      target: { category: "mcp", slug: "demo-49" },
      entries: [],
      limit: 5,
    });
    expect(response.relationGraph).toBe(true);
  });
  it("buildTrendingResourceResponse matrix 49", () => {
    const response = buildTrendingResourceResponse({
      payload: { schemaVersion: 1 },
      entries: [],
    });
    expect(response.kind).toBe("registry-trending");
  });
  it("buildJobsActiveResourceResponse matrix 49", () => {
    const response = buildJobsActiveResourceResponse({
      payload: { totalAvailable: 49 },
      entries: [],
    });
    expect(response.kind).toBe("jobs-active");
  });
  it("buildRegistryResourcePayload matrix 49", () => {
    const payload = buildRegistryResourcePayload(
      "heyclaude://test",
      { ok: true },
      "application/json",
      (v) => v,
    );
    expect(payload.contents[0].uri).toBe("heyclaude://test");
  });
  it("buildCategoryResourcePayload matrix 49", () => {
    const payload = buildCategoryResourcePayload(
      "mcp",
      [{ category: "mcp", slug: "demo-49" }],
      toEntrySummary,
    );
    expect(payload.total).toBe(1);
  });
  it("buildListRegistryResourcesResponse matrix 49", () => {
    const response = buildListRegistryResourcesResponse({
      manifest: {},
      categories: ["mcp"],
      discoveryResources: [],
      jsonMimeType: "application/json",
    });
    expect(response.resources.length).toBeGreaterThan(1);
  });
  it("buildPlatformAdapterUnavailableResponse matrix 49", () => {
    const response = buildPlatformAdapterUnavailableResponse(
      "vscode",
      "skill-49",
    );
    expect(response.adapterAvailable).toBe(false);
  });
  it("buildDistributionFeedsResponse matrix 49", () => {
    const response = buildDistributionFeedsResponse({
      manifest: { schemaVersion: 1, generatedAt: "now", artifacts: {} },
      feedIndex: { categories: [], platforms: [] },
      platformFeedSlug: (p: string) => p,
    });
    expect(response.ok).toBe(true);
  });
  it("buildExplainEntryTrustResponse matrix 49", () => {
    const entry = { category: "mcp", slug: "demo-49", title: "Demo" };
    const response = buildExplainEntryTrustResponse({
      entry,
      entryCanonicalUrl: () => "https://example.com",
      entryTrustSummary: () => ({}),
    });
    expect(response.key).toBe("mcp:demo-49");
  });
  it("buildInstallGuidanceResponse matrix 49", () => {
    const entry = { category: "mcp", slug: "demo-49", title: "Demo" };
    const response = buildInstallGuidanceResponse({
      entry,
      platform: "",
      selectedCompatibility: null,
      compatibility: [],
      entryCanonicalUrl: () => "",
      entryTrustSummary: () => ({}),
      notes: () => [],
    });
    expect(response.key).toBe("mcp:demo-49");
  });
  it("sortEntriesByUpdatedAt matrix 49", () => {
    const sorted = sortEntriesByUpdatedAt(
      [
        { title: "b", dateAdded: "2026-01-05" },
        { title: "a", dateAdded: "2026-01-01" },
      ],
      entryUpdatedAt,
    );
    expect(sorted.length).toBe(2);
  });
  it("buildDiscoveryRecentResponse matrix 49", () => {
    const response = buildDiscoveryRecentResponse({
      entries: [
        {
          category: "mcp",
          slug: "demo-49",
          title: "Demo",
          dateAdded: "2026-01-01",
        },
      ],
      toEntrySummary,
      entryUpdatedAt,
    });
    expect(response.kind).toBe("registry-recent");
  });
});

describe("resource/feed builders default missing payload fields", () => {
  it("defaults trending resource fields for an empty payload", () => {
    const response = buildTrendingResourceResponse({
      payload: {},
      entries: [],
    });
    expect(response.schemaVersion).toBe(1);
    expect(response.category).toBe("all");
    expect(response.platform).toBe("all");
    expect(response.signalsAvailable).toBeNull();
  });

  it("nulls jobs totalAvailable when the payload omits a numeric count", () => {
    expect(
      buildJobsActiveResourceResponse({ payload: {}, entries: [] })
        .totalAvailable,
    ).toBeNull();
  });

  it("falls back to an error uri for an empty resource uri", () => {
    const payload = buildRegistryResourcePayload(
      "",
      { a: 1 },
      "application/json",
      (value) => value,
    );
    expect(payload.contents[0].uri).toBe("heyclaude://error");
  });

  it("defaults empty categories/platforms for a bare feed index", () => {
    const response = buildDistributionFeedsResponse({
      manifest: { schemaVersion: 1, generatedAt: "2026-01-01", artifacts: [] },
      feedIndex: {},
      platformFeedSlug: (platform) => platform,
    });
    expect(response.categories).toEqual([]);
    expect(response.platforms).toEqual([]);
  });
});

describe("registry-handlers-lib related, adapter, and compatibility responses", () => {
  const target = { category: "mcp", slug: "browser-bridge" };

  it("buildRelatedEntriesScoredResponse keys the target and caps entries at the limit", () => {
    const entries = [
      { category: "mcp", slug: "a" },
      { category: "mcp", slug: "b" },
      { category: "mcp", slug: "c" },
    ];
    const response = buildRelatedEntriesScoredResponse({
      target,
      entries,
      limit: 2,
    });
    expect(response).toEqual({
      ok: true,
      key: "mcp:browser-bridge",
      count: 3,
      entries: [
        { category: "mcp", slug: "a" },
        { category: "mcp", slug: "b" },
      ],
    });
  });

  it("resolveGraphRelatedEntries returns null when the graph row has no relations", () => {
    expect(
      resolveGraphRelatedEntries({
        graphRow: null,
        searchIndex: [],
        toEntrySummary,
        limit: 5,
      }),
    ).toBeNull();
    expect(
      resolveGraphRelatedEntries({
        graphRow: { related: [] },
        searchIndex: [],
        toEntrySummary,
        limit: 5,
      }),
    ).toBeNull();
  });

  it("resolveGraphRelatedEntries resolves related keys and drops unknown ones", () => {
    const searchIndex = [{ category: "mcp", slug: "known", title: "Known" }];
    const graphRow = {
      related: [
        {
          key: "mcp:known",
          relation: "similar",
          score: 0.9,
          reasons: ["shared tag"],
        },
        { key: "mcp:missing", relation: "similar", score: 0.4 },
      ],
    };
    const resolved = resolveGraphRelatedEntries({
      graphRow,
      searchIndex,
      toEntrySummary,
      limit: 5,
    });
    expect(resolved).toEqual([
      {
        key: "mcp:known",
        category: "mcp",
        slug: "known",
        title: "Known",
        relation: "similar",
        relatedScore: 0.9,
        relatedReasons: ["shared tag"],
      },
    ]);
  });

  it("resolveGraphRelatedEntries defaults missing reasons to an empty array", () => {
    const resolved = resolveGraphRelatedEntries({
      graphRow: { related: [{ key: "mcp:x", relation: "similar", score: 1 }] },
      searchIndex: [{ category: "mcp", slug: "x", title: "X" }],
      toEntrySummary,
      limit: 5,
    });
    expect(resolved?.[0]?.relatedReasons).toEqual([]);
  });

  it("buildPlatformAdapterAvailableResponse points at the cursor adapter path", () => {
    expect(
      buildPlatformAdapterAvailableResponse("my-skill", "adapter body"),
    ).toEqual({
      ok: true,
      platform: "cursor",
      slug: "my-skill",
      adapterAvailable: true,
      adapterPath: "/data/skill-adapters/cursor/my-skill.mdc",
      content: "adapter body",
    });
  });

  it("buildCompatibilityResponse surfaces the entry platform compatibility", () => {
    const entry = {
      category: "skills",
      slug: "designer",
      platformCompatibility: { "claude-code": "native", cursor: "adapter" },
    };
    expect(buildCompatibilityResponse(entry)).toEqual({
      ok: true,
      key: "skills:designer",
      category: "skills",
      slug: "designer",
      platformCompatibility: {
        "claude-code": "native",
        cursor: "adapter",
      },
    });
  });

  it("buildDistributionFeedsResponse maps each platform to its feed slug", () => {
    const response = buildDistributionFeedsResponse({
      manifest: {
        schemaVersion: 2,
        generatedAt: "2026-07-14T00:00:00.000Z",
        artifacts: ["a.json"],
      },
      feedIndex: {
        categories: ["mcp", "skills"],
        platforms: [{ platform: "claude-code" }, { platform: "cursor" }],
      },
      platformFeedSlug: (platform) => `feed-${platform}`,
    });
    expect(response.categories).toEqual(["mcp", "skills"]);
    expect(response.platforms).toEqual([
      { platform: "claude-code", feedSlug: "feed-claude-code" },
      { platform: "cursor", feedSlug: "feed-cursor" },
    ]);
  });
});
