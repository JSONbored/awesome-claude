import { describe, expect, it } from "vitest";

import {
  getPlatformAdapter,
  readRegistryResource,
} from "../packages/mcp/src/registry-tool-orchestration-lib.js";

const artifactOptions = {
  readJsonArtifact: async (relativePath: string) =>
    relativePath === "directory-index.json"
      ? { feeds: [] }
      : { entries: [{ category: "mcp", slug: "browser-bridge", title: "BB" }] },
  readTextArtifact: async () => "adapter body",
};

function resourcePayload(result: { contents: Array<{ text: string }> }) {
  return JSON.parse(result.contents[0].text);
}

describe("registry-tool-orchestration readRegistryResource uri routing", () => {
  it("reports not found for a missing or unparseable uri", async () => {
    expect(
      resourcePayload(await readRegistryResource({}, artifactOptions)).error
        .code,
    ).toBe("not_found");
  });

  it("rejects non-heyclaude protocols", async () => {
    expect(
      resourcePayload(
        await readRegistryResource(
          { uri: "https://example.com" },
          artifactOptions,
        ),
      ).error.code,
    ).toBe("not_found");
  });

  it("rejects category paths that are not slug-safe", async () => {
    expect(
      resourcePayload(
        await readRegistryResource(
          { uri: "heyclaude://category/a.b" },
          artifactOptions,
        ),
      ).error.code,
    ).toBe("invalid_request");
  });

  it("reads the directory feed index", async () => {
    const payload = resourcePayload(
      await readRegistryResource(
        { uri: "heyclaude://feeds/directory" },
        artifactOptions,
      ),
    );
    expect(payload.feeds).toEqual([]);
  });

  it("reads a category resource payload", async () => {
    const payload = resourcePayload(
      await readRegistryResource(
        { uri: "heyclaude://category/mcp" },
        artifactOptions,
      ),
    );
    expect(payload.ok).toBe(true);
    expect(payload.category).toBe("mcp");
  });
});

describe("registry-tool-orchestration getPlatformAdapter", () => {
  it("requires a slug", async () => {
    expect((await getPlatformAdapter({}, artifactOptions)).error.code).toBe(
      "invalid_request",
    );
  });

  it("reports adapters as unavailable for non-cursor platforms", async () => {
    const result = await getPlatformAdapter(
      { slug: "browser-bridge", platform: "vscode" },
      artifactOptions,
    );
    expect(result.ok).toBe(true);
    expect(result.platform).toBe("vscode");
  });

  it("defaults to cursor and reports missing skills as not found", async () => {
    expect(
      (await getPlatformAdapter({ slug: "nope" }, artifactOptions)).error.code,
    ).toBe("not_found");
  });
});
