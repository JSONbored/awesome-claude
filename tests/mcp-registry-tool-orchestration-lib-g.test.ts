import { describe, expect, it } from "vitest";

import {
  compareEntries,
  getClientSetup,
  getEntryDetail,
  getRecentUpdates,
  getRelatedEntries,
  planWorkflowToolbox,
  recommendForTask,
} from "../packages/mcp/src/registry-tool-orchestration-lib.js";

const artifactOptions = {
  readJsonArtifact: async () => ({
    entries: [
      {
        category: "mcp",
        slug: "browser-bridge",
        title: "Browser Bridge",
        description: "playwright browser automation for Claude Code",
        tags: ["browser"],
        platforms: ["claude-code"],
      },
      {
        category: "skills",
        slug: "code-review",
        title: "Code Review",
        description: "code review helper skill",
        tags: ["review"],
        platforms: ["claude-code"],
      },
    ],
  }),
  readTextArtifact: async () => "artifact body",
};

describe("registry-tool-orchestration planWorkflowToolbox", () => {
  it("rejects goals shorter than two characters", async () => {
    expect(
      (await planWorkflowToolbox({ goal: "a" }, artifactOptions)).error.code,
    ).toBe("invalid_request");
    expect((await planWorkflowToolbox({}, artifactOptions)).error.code).toBe(
      "invalid_request",
    );
  });

  it("plans a toolbox for a usable goal", async () => {
    const result = await planWorkflowToolbox(
      { goal: "browser automation" },
      artifactOptions,
    );
    expect(result.ok).toBe(true);
  });
});

describe("registry-tool-orchestration recommendForTask", () => {
  it("rejects task descriptions shorter than two characters", async () => {
    expect(
      (await recommendForTask({ task: "" }, artifactOptions)).error.code,
    ).toBe("invalid_request");
  });

  it("scopes recommendations to a requested category", async () => {
    const result = await recommendForTask(
      { task: "browser automation", category: "mcp" },
      artifactOptions,
    );
    expect(result.ok).toBe(true);
  });
});

describe("registry-tool-orchestration getEntryDetail", () => {
  it("requires both category and slug", async () => {
    expect((await getEntryDetail({}, artifactOptions)).error.code).toBe(
      "invalid_request",
    );
  });

  it("reports unknown entries as not found", async () => {
    expect(
      (await getEntryDetail({ category: "mcp", slug: "nope" }, artifactOptions))
        .error.code,
    ).toBe("not_found");
  });
});

describe("registry-tool-orchestration getRecentUpdates", () => {
  it("rejects an unparseable since date", async () => {
    expect(
      (await getRecentUpdates({ since: "nonsense" }, artifactOptions)).error
        .code,
    ).toBe("invalid_request");
  });

  it("accepts a parseable since date", async () => {
    expect(
      (await getRecentUpdates({ since: "2026-01-01" }, artifactOptions)).ok,
    ).toBe(true);
  });
});

describe("registry-tool-orchestration getRelatedEntries", () => {
  it("reports a missing target entry as not found", async () => {
    expect(
      (
        await getRelatedEntries(
          { category: "mcp", slug: "nope" },
          artifactOptions,
        )
      ).error.code,
    ).toBe("not_found");
  });

  // Three-scenario matrix for the graph vs ad-hoc-scorer fallback decision.
  // Search index shared by all three: a target plus a same-category peer that
  // the ad-hoc scorer WOULD relate (same category alone scores > 0). The peer
  // is what makes the "zero relations" scenario meaningful — it proves the
  // graph's empty verdict is honoured rather than silently overridden.
  const relatedSearchIndex = {
    entries: [
      {
        category: "skills",
        slug: "target-skill",
        title: "Target Skill",
        description: "Shared lint automation.",
        tags: ["lint"],
        keywords: [],
        platforms: ["Claude"],
        updatedAt: "2026-01-01T00:00:00.000Z",
      },
      {
        category: "skills",
        slug: "same-category-peer",
        title: "Same Category Peer",
        description: "Shared lint automation.",
        tags: ["lint"],
        keywords: [],
        platforms: ["Claude"],
        updatedAt: "2026-01-02T00:00:00.000Z",
      },
    ],
  };

  it("returns real graph relations when the graph row has relations", async () => {
    const readJsonArtifact = async (relativePath: string) => {
      if (relativePath === "relation-graph.json") {
        return {
          entries: [
            {
              key: "skills:target-skill",
              related: [
                {
                  key: "skills:same-category-peer",
                  relation: "similar",
                  score: 42,
                  reasons: ["tag:lint"],
                },
              ],
            },
          ],
        };
      }
      if (relativePath !== "search-index.json") return null;
      return relatedSearchIndex;
    };

    const result = await getRelatedEntries(
      { category: "skills", slug: "target-skill", limit: 8 },
      { readJsonArtifact },
    );

    expect(result.ok).toBe(true);
    expect(result.relationGraph).toBe(true);
    expect(result.count).toBe(1);
    expect(result.entries[0].slug).toBe("same-category-peer");
    expect(result.entries[0].relatedScore).toBe(42);
  });

  it("returns a genuine no-related result (no ad-hoc fallback) when the graph row has zero relations", async () => {
    const readJsonArtifact = async (relativePath: string) => {
      if (relativePath === "relation-graph.json") {
        return {
          entries: [{ key: "skills:target-skill", related: [] }],
        };
      }
      if (relativePath !== "search-index.json") return null;
      return relatedSearchIndex;
    };

    const result = await getRelatedEntries(
      { category: "skills", slug: "target-skill", limit: 8 },
      { readJsonArtifact },
    );

    expect(result.ok).toBe(true);
    // relationGraph:true + count:0 proves it honoured the graph's "zero
    // relations" verdict rather than falling through to the ad-hoc scorer,
    // which would have surfaced the same-category peer.
    expect(result.relationGraph).toBe(true);
    expect(result.count).toBe(0);
    expect(result.entries).toEqual([]);
  });

  it("falls back to the ad-hoc scorer when there is no graph row at all", async () => {
    const readJsonArtifact = async (relativePath: string) => {
      // Graph data exists but has no row for this target (missing/corrupt data).
      if (relativePath === "relation-graph.json") {
        return { entries: [{ key: "skills:someone-else", related: [] }] };
      }
      if (relativePath !== "search-index.json") return null;
      return relatedSearchIndex;
    };

    const result = await getRelatedEntries(
      { category: "skills", slug: "target-skill", limit: 8 },
      { readJsonArtifact },
    );

    expect(result.ok).toBe(true);
    // No graph row → ad-hoc scorer runs, surfacing the same-category peer.
    expect(result.relationGraph).toBe(false);
    expect(result.count).toBe(1);
    expect(result.entries[0].slug).toBe("same-category-peer");
  });
});

describe("registry-tool-orchestration compareEntries", () => {
  it("defaults to an empty entry list", async () => {
    expect((await compareEntries({}, artifactOptions)).ok).toBe(true);
  });

  it("reports a missing compare target as not found", async () => {
    expect(
      (
        await compareEntries(
          { entries: [{ category: "mcp", slug: "nope" }] },
          artifactOptions,
        )
      ).error.code,
    ).toBe("not_found");
  });
});

describe("registry-tool-orchestration getClientSetup", () => {
  it("rejects an unparseable endpoint url", async () => {
    expect(
      (await getClientSetup({ endpointUrl: "not a url" })).error.code,
    ).toBe("invalid_request");
  });

  it("falls back to the default endpoint and blank client", async () => {
    const result = await getClientSetup({});
    expect(result.ok).toBe(true);
  });
});
