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
