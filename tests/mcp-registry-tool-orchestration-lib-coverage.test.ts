import { afterEach, describe, expect, it, vi } from "vitest";

import * as artifactLoader from "../packages/mcp/src/registry-artifact-loader-lib.js";
import {
  callRegistryTool,
  compareEntries,
  getCompatibility,
  getCopyableAsset,
  getInstallGuidance,
  getPlatformAdapter,
  getRelatedEntries,
  planWorkflowToolbox,
  recommendForTask,
} from "../packages/mcp/src/registry-tool-orchestration-lib.js";
import { expandedTokenCandidates } from "../apps/web/src/lib/search-query-aliases-lib";

describe("registry-tool-orchestration-lib patch coverage", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("covers empty expandedTokenCandidates input", () => {
    expect(expandedTokenCandidates("   ")).toEqual([]);
  });

  it("falls back to token search when the full planner query misses", async () => {
    const readJsonArtifact = async (relativePath: string) => {
      if (relativePath !== "search-index.json") return null;
      return {
        entries: [
          {
            category: "mcp",
            slug: "token-fallback-mcp",
            title: "Token Fallback MCP",
            description: "Handles kubernetes rollouts with guided steps.",
            tags: [],
            keywords: [],
            platforms: ["Claude"],
          },
        ],
      };
    };
    vi.spyOn(artifactLoader, "readEntry").mockRejectedValueOnce(
      new Error("detail read failed"),
    );

    const result = await planWorkflowToolbox(
      { goal: "zz kubernetes zz", limit: 1 },
      { readJsonArtifact },
    );

    expect(result.ok).toBe(true);
    expect(result.entries).toHaveLength(1);
    expect(result.entries[0].slug).toBe("token-fallback-mcp");
  });

  it("falls back to token search for task recommendations", async () => {
    const readJsonArtifact = async (relativePath: string) => {
      if (relativePath !== "search-index.json") return null;
      return {
        entries: [
          {
            category: "skills",
            slug: "token-task-skill",
            title: "Token Task Skill",
            description: "Automates browser testing workflows.",
            tags: [],
            keywords: [],
            platforms: ["Claude"],
          },
        ],
      };
    };
    vi.spyOn(artifactLoader, "readEntry").mockResolvedValueOnce(null);

    const result = await recommendForTask(
      { task: "zz browser zz", limit: 1 },
      { readJsonArtifact },
    );

    expect(result.ok).toBe(true);
    expect(result.recommendations).toHaveLength(1);
    expect(result.recommendations[0].slug).toBe("token-task-skill");
  });

  it("recovers when recommendation detail reads reject", async () => {
    const readJsonArtifact = async (relativePath: string) => {
      if (relativePath !== "search-index.json") return null;
      return {
        entries: [
          {
            category: "skills",
            slug: "reject-read-skill",
            title: "Reject Read Skill",
            description: "Automates browser testing workflows.",
            tags: [],
            keywords: [],
            platforms: ["Claude"],
          },
        ],
      };
    };
    vi.spyOn(artifactLoader, "readEntry").mockRejectedValueOnce(
      new Error("detail read failed"),
    );

    const result = await recommendForTask(
      { task: "browser testing", limit: 1 },
      { readJsonArtifact },
    );

    expect(result.ok).toBe(true);
    expect(result.recommendations[0].slug).toBe("reject-read-skill");
  });

  it("sorts scored related entries by score before updatedAt", async () => {
    const readJsonArtifact = async (relativePath: string) => {
      if (relativePath === "relation-graph.json") return null;
      if (relativePath !== "search-index.json") return null;
      return {
        entries: [
          {
            category: "skills",
            slug: "anchor-skill",
            title: "Anchor Skill",
            description: "Shared lint automation.",
            tags: ["lint"],
            keywords: [],
            platforms: ["Claude"],
            updatedAt: "2026-01-01T00:00:00.000Z",
          },
          {
            category: "skills",
            slug: "lower-score-peer",
            title: "Lower Score Peer",
            description: "Shared lint automation.",
            tags: ["docs"],
            keywords: [],
            platforms: ["Claude"],
            updatedAt: "2026-01-03T00:00:00.000Z",
          },
          {
            category: "skills",
            slug: "higher-score-peer",
            title: "Higher Score Peer",
            description: "Shared lint automation.",
            tags: ["lint", "docs"],
            keywords: [],
            platforms: ["Claude"],
            updatedAt: "2026-01-02T00:00:00.000Z",
          },
        ],
      };
    };

    const result = await getRelatedEntries(
      { category: "skills", slug: "anchor-skill", limit: 2 },
      { readJsonArtifact },
    );

    expect(result.ok).toBe(true);
    expect(result.entries[0].slug).toBe("higher-score-peer");
  });

  it("tie-breaks scored related entries by updatedAt", async () => {
    const readJsonArtifact = async (relativePath: string) => {
      if (relativePath === "relation-graph.json") return null;
      if (relativePath !== "search-index.json") return null;
      return {
        entries: [
          {
            category: "skills",
            slug: "anchor-skill",
            title: "Anchor Skill",
            description: "Shared lint automation.",
            tags: ["lint"],
            keywords: [],
            platforms: ["Claude"],
            dateAdded: "2026-01-01T00:00:00.000Z",
            updatedAt: "2026-01-01T00:00:00.000Z",
          },
          {
            category: "skills",
            slug: "older-peer",
            title: "Older Peer",
            description: "Shared lint automation.",
            tags: ["lint"],
            keywords: [],
            platforms: ["Claude"],
            dateAdded: "2026-01-02T00:00:00.000Z",
            updatedAt: "2026-01-02T00:00:00.000Z",
          },
          {
            category: "skills",
            slug: "newer-peer",
            title: "Newer Peer",
            description: "Shared lint automation.",
            tags: ["lint"],
            keywords: [],
            platforms: ["Claude"],
            dateAdded: "2026-01-03T00:00:00.000Z",
            updatedAt: "2026-01-03T00:00:00.000Z",
          },
        ],
      };
    };

    const result = await getRelatedEntries(
      { category: "skills", slug: "anchor-skill", limit: 2 },
      { readJsonArtifact },
    );

    expect(result.ok).toBe(true);
    expect(result.entries.map((entry: { slug: string }) => entry.slug)).toEqual(
      ["newer-peer", "older-peer"],
    );
  });

  it("rejects copyable asset requests without category or slug", async () => {
    await expect(
      getCopyableAsset({ category: "mcp" }, {}),
    ).resolves.toMatchObject({
      ok: false,
      error: { code: "invalid_request" },
    });
  });

  it("rejects platform adapter requests without slug", async () => {
    await expect(
      getPlatformAdapter({ platform: "cursor" }, {}),
    ).resolves.toMatchObject({
      ok: false,
      error: { code: "invalid_request" },
    });
  });

  it("returns not_found when copyable asset detail is missing", async () => {
    const readJsonArtifact = async (relativePath: string) => {
      if (relativePath.startsWith("entries/")) return null;
      return { entries: [] };
    };

    const result = await getCopyableAsset(
      { category: "mcp", slug: "missing-copyable" },
      { readJsonArtifact },
    );

    expect(result).toMatchObject({
      ok: false,
      error: { code: "not_found" },
    });
  });

  it("returns not_found when compare entry detail is missing", async () => {
    const readJsonArtifact = async () => ({ entries: [] });

    const result = await compareEntries(
      {
        entries: [
          { category: "mcp", slug: "missing-compare-a" },
          { category: "mcp", slug: "missing-compare-b" },
        ],
      },
      { readJsonArtifact },
    );

    expect(result).toMatchObject({
      ok: false,
      error: { code: "not_found" },
    });
  });

  it("returns not_found when compatibility detail is missing", async () => {
    const readJsonArtifact = async () => ({ entries: [] });

    const result = await getCompatibility(
      { category: "skills", slug: "missing-compat" },
      { readJsonArtifact },
    );

    expect(result).toMatchObject({
      ok: false,
      error: { code: "not_found" },
    });
  });

  it("returns not_found when install guidance detail is missing", async () => {
    const readJsonArtifact = async () => ({ entries: [] });

    const result = await getInstallGuidance(
      { category: "skills", slug: "missing-install" },
      { readJsonArtifact },
    );

    expect(result).toMatchObject({
      ok: false,
      error: { code: "not_found" },
    });
  });

  it("rethrows non-zod parse failures from callRegistryTool", async () => {
    const schemas = await import("../packages/mcp/src/schemas.js");
    const parseSpy = vi
      .spyOn(schemas, "parseToolArguments")
      .mockImplementation(() => {
        throw new Error("non-zod parse failure");
      });
    const formatSpy = vi.spyOn(schemas, "formatZodError").mockReturnValue(null);

    await expect(
      callRegistryTool("registry.search", { query: "mcp" }, {}),
    ).rejects.toThrow("non-zod parse failure");

    parseSpy.mockRestore();
    formatSpy.mockRestore();
  });
});
