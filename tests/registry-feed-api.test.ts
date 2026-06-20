import { describe, expect, it } from "vitest";

import { GET } from "../apps/web/src/routes/api/registry/feed";

const request = () =>
  new Request("https://heyclau.de/api/registry/feed", {
    headers: { origin: "https://heyclau.de" },
  });

describe("/api/registry/feed", () => {
  it("exposes canonical endpoints and top-level compatibility aliases", async () => {
    const response = await GET(request());
    expect(response.status).toBe(200);

    const body = (await response.json()) as {
      qualityMethodology?: string;
      categoryFeeds?: Record<string, string>;
      platformFeeds?: Record<string, string>;
      jobs?: string;
      endpoints?: Record<string, string>;
      contracts?: Record<string, string>;
      artifacts?: Record<string, unknown>;
      categories?: Array<{
        category?: string;
        label?: string;
        count?: number;
        description?: string;
      }>;
    };

    expect(body.qualityMethodology).toBe("/quality#methodology");
    expect(body.categoryFeeds?.mcp).toBe("/data/feeds/categories/mcp.json");
    expect(body.platformFeeds?.claude).toBe(
      "/data/feeds/platforms/claude.json",
    );
    expect(body.jobs).toBe("/api/jobs?limit=100");

    expect(body.endpoints).toMatchObject({
      qualityMethodology: "/quality#methodology",
      categoryFeed: "/data/feeds/categories/{category}.json",
      platformFeed: "/data/feeds/platforms/{platform}.json",
      jobs: "/api/jobs?limit=100",
    });

    expect(body.contracts).toMatchObject({
      registryEntries: expect.stringContaining("trustSignals"),
      writes: expect.stringContaining("PR-first"),
    });
    expect(Object.keys(body.artifacts ?? {})).toEqual(
      expect.arrayContaining(["directory", "search"]),
    );
    expect(body.categories).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          category: "mcp",
          label: "MCP Servers",
          count: expect.any(Number),
          description: expect.any(String),
        }),
      ]),
    );
  });
});
