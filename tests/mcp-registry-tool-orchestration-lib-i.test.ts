import { describe, expect, it } from "vitest";

import {
  getInstallGuidance,
  listCategoryEntries,
  recommendForTask,
} from "../packages/mcp/src/registry-tool-orchestration-lib.js";

const entry = {
  category: "skills",
  slug: "demo",
  title: "Demo Skill",
  description: "browser automation demo skill",
  installCommand: "npx -y demo",
  platforms: ["claude-code"],
  tags: ["demo"],
};

const artifactOptions = {
  readJsonArtifact: async (relativePath: string) =>
    relativePath === "entries/skills/demo.json"
      ? { entry }
      : { entries: [entry] },
  readTextArtifact: async () => JSON.stringify({ entry }),
};

describe("registry-tool-orchestration unscoped listings", () => {
  it("recommends across every category when none is requested", async () => {
    const result = await recommendForTask(
      { task: "browser automation demo" },
      artifactOptions,
    );
    expect(result.ok).toBe(true);
    expect(result.category).toBe("");
  });

  it("lists entries across every category when none is requested", async () => {
    const result = await listCategoryEntries({}, artifactOptions);
    expect(result.ok).toBe(true);
    expect(result.category).toBe("");
    expect(result.total).toBe(1);
  });
});

describe("registry-tool-orchestration install guidance platform selection", () => {
  it("leaves compatibility unselected when no platform is requested", async () => {
    const result = await getInstallGuidance(
      { category: "skills", slug: "demo" },
      artifactOptions,
    );
    expect(result.ok).toBe(true);
    expect(result.selectedCompatibility).toBeNull();
  });

  it("returns null compatibility when the platform has no matching row", async () => {
    const result = await getInstallGuidance(
      { category: "skills", slug: "demo", platform: "zed" },
      artifactOptions,
    );
    expect(result.ok).toBe(true);
    expect(result.selectedCompatibility).toBeNull();
  });
});
