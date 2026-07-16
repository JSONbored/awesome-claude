import { describe, expect, it } from "vitest";

import {
  explainEntryTrust,
  getServerInfo,
  listJobsActive,
  listRegistryResources,
  listRegistryTrending,
  readRegistryResource,
  reviewEntrySafety,
} from "../packages/mcp/src/registry-tool-orchestration-lib.js";

const entry = {
  category: "skills",
  slug: "demo",
  title: "Demo Skill",
  description: "demo skill used for orchestration coverage",
  platforms: ["claude-code"],
};

const artifactOptions = {
  readJsonArtifact: async (relativePath: string) => {
    if (relativePath === "entries/skills/demo.json") return { entry };
    if (relativePath === "registry-manifest.json") {
      return { schemaVersion: 1, generatedAt: "2026-01-01", totalEntries: 1 };
    }
    return { entries: [entry] };
  },
  readTextArtifact: async () => JSON.stringify({ entry }),
};

function resourcePayload(result: { contents: Array<{ text: string }> }) {
  return JSON.parse(result.contents[0].text);
}

describe("registry-tool-orchestration manifest defaults", () => {
  it("defaults server info categories to an empty object", async () => {
    const info = await getServerInfo({}, artifactOptions);
    expect(info.ok).toBe(true);
    expect(info.registry.categories).toEqual({});
  });

  it("lists registry resources when the manifest has no categories", async () => {
    const result = await listRegistryResources({}, artifactOptions);
    expect(Array.isArray(result.resources)).toBe(true);
  });
});

describe("registry-tool-orchestration discovery upstream failures", () => {
  const failingOptions = {
    ...artifactOptions,
    fetchPublicApi: async () => {
      throw new Error("upstream down");
    },
  };

  it("degrades trending to an unavailable envelope", async () => {
    const result = await listRegistryTrending(failingOptions);
    expect(result.error.code).toBe("unavailable");
    expect(result.error.details).toContain("upstream down");
  });

  it("degrades active jobs to an unavailable envelope", async () => {
    const result = await listJobsActive(failingOptions);
    expect(result.error.code).toBe("unavailable");
    expect(result.error.details).toContain("upstream down");
  });
});

describe("registry-tool-orchestration unsupported resource host", () => {
  it("reports an unknown heyclaude host as not found", async () => {
    expect(
      resourcePayload(
        await readRegistryResource(
          { uri: "heyclaude://unknown/x" },
          artifactOptions,
        ),
      ).error.code,
    ).toBe("not_found");
  });
});

describe("registry-tool-orchestration explainEntryTrust", () => {
  it("requires both category and slug", async () => {
    expect((await explainEntryTrust({}, artifactOptions)).error.code).toBe(
      "invalid_request",
    );
  });

  it("reports unknown entries as not found", async () => {
    expect(
      (
        await explainEntryTrust(
          { category: "skills", slug: "nope" },
          artifactOptions,
        )
      ).error.code,
    ).toBe("not_found");
  });

  it("explains trust for a known entry", async () => {
    const result = await explainEntryTrust(
      { category: "skills", slug: "demo" },
      artifactOptions,
    );
    expect(result.ok).toBe(true);
  });
});

describe("registry-tool-orchestration reviewEntrySafety", () => {
  it("defaults to an empty entry list", async () => {
    expect((await reviewEntrySafety({}, artifactOptions)).ok).toBe(true);
  });

  it("reports a missing review target as not found", async () => {
    expect(
      (
        await reviewEntrySafety(
          { entries: [{ category: "skills", slug: "nope" }] },
          artifactOptions,
        )
      ).error.code,
    ).toBe("not_found");
  });
});
