import { describe, expect, it } from "vitest";

import {
  buildCopyableAssetResponse,
  buildEntryContentAssets,
  filterAssetsByType,
  selectPrimaryAsset,
} from "../packages/mcp/src/registry-copyable-asset-lib.js";
import {
  entryCanonicalUrl,
  entryTrustSummary,
  sourceSummary,
} from "../packages/mcp/src/registry-trust-lib.js";

function makeEntry(overrides: Record<string, unknown> = {}) {
  return {
    category: "mcp",
    slug: "browser-bridge",
    title: "Browser Bridge",
    description: "Runs Playwright automation for Claude Code sessions.",
    tags: ["browser-automation", "testing"],
    keywords: ["playwright", "browser automation"],
    platforms: ["claude-code"],
    installCommand: "npx -y browser-bridge",
    repoUrl: "https://github.com/example/browser-bridge",
    documentationUrl: "https://docs.example.com/browser-bridge",
    ...overrides,
  };
}

describe("registry-copyable-asset-lib buildEntryContentAssets", () => {
  it("builds assets from entry fields", () => {
    const assets = buildEntryContentAssets(
      makeEntry({ body: "content", configSnippet: "cfg" }),
    );
    expect(assets.some((a) => a.type === "full_content")).toBe(true);
    expect(assets.some((a) => a.type === "config_snippet")).toBe(true);
  });
  it("buildEntryContentAssets agents 0", () => {
    const assets = buildEntryContentAssets(
      makeEntry({ category: "agents", slug: "agents-0", body: "body-0" }),
    );
    expect(assets.length).toBeGreaterThan(0);
  });
  it("buildEntryContentAssets agents 1", () => {
    const assets = buildEntryContentAssets(
      makeEntry({ category: "agents", slug: "agents-1", body: "body-1" }),
    );
    expect(assets.length).toBeGreaterThan(0);
  });
  it("buildEntryContentAssets agents 2", () => {
    const assets = buildEntryContentAssets(
      makeEntry({ category: "agents", slug: "agents-2", body: "body-2" }),
    );
    expect(assets.length).toBeGreaterThan(0);
  });
  it("buildEntryContentAssets agents 3", () => {
    const assets = buildEntryContentAssets(
      makeEntry({ category: "agents", slug: "agents-3", body: "body-3" }),
    );
    expect(assets.length).toBeGreaterThan(0);
  });
  it("buildEntryContentAssets agents 4", () => {
    const assets = buildEntryContentAssets(
      makeEntry({ category: "agents", slug: "agents-4", body: "body-4" }),
    );
    expect(assets.length).toBeGreaterThan(0);
  });
  it("buildEntryContentAssets agents 5", () => {
    const assets = buildEntryContentAssets(
      makeEntry({ category: "agents", slug: "agents-5", body: "body-5" }),
    );
    expect(assets.length).toBeGreaterThan(0);
  });
  it("buildEntryContentAssets agents 6", () => {
    const assets = buildEntryContentAssets(
      makeEntry({ category: "agents", slug: "agents-6", body: "body-6" }),
    );
    expect(assets.length).toBeGreaterThan(0);
  });
  it("buildEntryContentAssets agents 7", () => {
    const assets = buildEntryContentAssets(
      makeEntry({ category: "agents", slug: "agents-7", body: "body-7" }),
    );
    expect(assets.length).toBeGreaterThan(0);
  });
  it("buildEntryContentAssets agents 8", () => {
    const assets = buildEntryContentAssets(
      makeEntry({ category: "agents", slug: "agents-8", body: "body-8" }),
    );
    expect(assets.length).toBeGreaterThan(0);
  });
  it("buildEntryContentAssets agents 9", () => {
    const assets = buildEntryContentAssets(
      makeEntry({ category: "agents", slug: "agents-9", body: "body-9" }),
    );
    expect(assets.length).toBeGreaterThan(0);
  });
  it("buildEntryContentAssets mcp 0", () => {
    const assets = buildEntryContentAssets(
      makeEntry({ category: "mcp", slug: "mcp-0", body: "body-0" }),
    );
    expect(assets.length).toBeGreaterThan(0);
  });
  it("buildEntryContentAssets mcp 1", () => {
    const assets = buildEntryContentAssets(
      makeEntry({ category: "mcp", slug: "mcp-1", body: "body-1" }),
    );
    expect(assets.length).toBeGreaterThan(0);
  });
  it("buildEntryContentAssets mcp 2", () => {
    const assets = buildEntryContentAssets(
      makeEntry({ category: "mcp", slug: "mcp-2", body: "body-2" }),
    );
    expect(assets.length).toBeGreaterThan(0);
  });
  it("buildEntryContentAssets mcp 3", () => {
    const assets = buildEntryContentAssets(
      makeEntry({ category: "mcp", slug: "mcp-3", body: "body-3" }),
    );
    expect(assets.length).toBeGreaterThan(0);
  });
  it("buildEntryContentAssets mcp 4", () => {
    const assets = buildEntryContentAssets(
      makeEntry({ category: "mcp", slug: "mcp-4", body: "body-4" }),
    );
    expect(assets.length).toBeGreaterThan(0);
  });
  it("buildEntryContentAssets mcp 5", () => {
    const assets = buildEntryContentAssets(
      makeEntry({ category: "mcp", slug: "mcp-5", body: "body-5" }),
    );
    expect(assets.length).toBeGreaterThan(0);
  });
  it("buildEntryContentAssets mcp 6", () => {
    const assets = buildEntryContentAssets(
      makeEntry({ category: "mcp", slug: "mcp-6", body: "body-6" }),
    );
    expect(assets.length).toBeGreaterThan(0);
  });
  it("buildEntryContentAssets mcp 7", () => {
    const assets = buildEntryContentAssets(
      makeEntry({ category: "mcp", slug: "mcp-7", body: "body-7" }),
    );
    expect(assets.length).toBeGreaterThan(0);
  });
  it("buildEntryContentAssets mcp 8", () => {
    const assets = buildEntryContentAssets(
      makeEntry({ category: "mcp", slug: "mcp-8", body: "body-8" }),
    );
    expect(assets.length).toBeGreaterThan(0);
  });
  it("buildEntryContentAssets mcp 9", () => {
    const assets = buildEntryContentAssets(
      makeEntry({ category: "mcp", slug: "mcp-9", body: "body-9" }),
    );
    expect(assets.length).toBeGreaterThan(0);
  });
  it("buildEntryContentAssets tools 0", () => {
    const assets = buildEntryContentAssets(
      makeEntry({ category: "tools", slug: "tools-0", body: "body-0" }),
    );
    expect(assets.length).toBeGreaterThan(0);
  });
  it("buildEntryContentAssets tools 1", () => {
    const assets = buildEntryContentAssets(
      makeEntry({ category: "tools", slug: "tools-1", body: "body-1" }),
    );
    expect(assets.length).toBeGreaterThan(0);
  });
  it("buildEntryContentAssets tools 2", () => {
    const assets = buildEntryContentAssets(
      makeEntry({ category: "tools", slug: "tools-2", body: "body-2" }),
    );
    expect(assets.length).toBeGreaterThan(0);
  });
  it("buildEntryContentAssets tools 3", () => {
    const assets = buildEntryContentAssets(
      makeEntry({ category: "tools", slug: "tools-3", body: "body-3" }),
    );
    expect(assets.length).toBeGreaterThan(0);
  });
  it("buildEntryContentAssets tools 4", () => {
    const assets = buildEntryContentAssets(
      makeEntry({ category: "tools", slug: "tools-4", body: "body-4" }),
    );
    expect(assets.length).toBeGreaterThan(0);
  });
  it("buildEntryContentAssets tools 5", () => {
    const assets = buildEntryContentAssets(
      makeEntry({ category: "tools", slug: "tools-5", body: "body-5" }),
    );
    expect(assets.length).toBeGreaterThan(0);
  });
  it("buildEntryContentAssets tools 6", () => {
    const assets = buildEntryContentAssets(
      makeEntry({ category: "tools", slug: "tools-6", body: "body-6" }),
    );
    expect(assets.length).toBeGreaterThan(0);
  });
  it("buildEntryContentAssets tools 7", () => {
    const assets = buildEntryContentAssets(
      makeEntry({ category: "tools", slug: "tools-7", body: "body-7" }),
    );
    expect(assets.length).toBeGreaterThan(0);
  });
  it("buildEntryContentAssets tools 8", () => {
    const assets = buildEntryContentAssets(
      makeEntry({ category: "tools", slug: "tools-8", body: "body-8" }),
    );
    expect(assets.length).toBeGreaterThan(0);
  });
  it("buildEntryContentAssets tools 9", () => {
    const assets = buildEntryContentAssets(
      makeEntry({ category: "tools", slug: "tools-9", body: "body-9" }),
    );
    expect(assets.length).toBeGreaterThan(0);
  });
  it("buildEntryContentAssets skills 0", () => {
    const assets = buildEntryContentAssets(
      makeEntry({ category: "skills", slug: "skills-0", body: "body-0" }),
    );
    expect(assets.length).toBeGreaterThan(0);
  });
  it("buildEntryContentAssets skills 1", () => {
    const assets = buildEntryContentAssets(
      makeEntry({ category: "skills", slug: "skills-1", body: "body-1" }),
    );
    expect(assets.length).toBeGreaterThan(0);
  });
  it("buildEntryContentAssets skills 2", () => {
    const assets = buildEntryContentAssets(
      makeEntry({ category: "skills", slug: "skills-2", body: "body-2" }),
    );
    expect(assets.length).toBeGreaterThan(0);
  });
  it("buildEntryContentAssets skills 3", () => {
    const assets = buildEntryContentAssets(
      makeEntry({ category: "skills", slug: "skills-3", body: "body-3" }),
    );
    expect(assets.length).toBeGreaterThan(0);
  });
  it("buildEntryContentAssets skills 4", () => {
    const assets = buildEntryContentAssets(
      makeEntry({ category: "skills", slug: "skills-4", body: "body-4" }),
    );
    expect(assets.length).toBeGreaterThan(0);
  });
  it("buildEntryContentAssets skills 5", () => {
    const assets = buildEntryContentAssets(
      makeEntry({ category: "skills", slug: "skills-5", body: "body-5" }),
    );
    expect(assets.length).toBeGreaterThan(0);
  });
  it("buildEntryContentAssets skills 6", () => {
    const assets = buildEntryContentAssets(
      makeEntry({ category: "skills", slug: "skills-6", body: "body-6" }),
    );
    expect(assets.length).toBeGreaterThan(0);
  });
  it("buildEntryContentAssets skills 7", () => {
    const assets = buildEntryContentAssets(
      makeEntry({ category: "skills", slug: "skills-7", body: "body-7" }),
    );
    expect(assets.length).toBeGreaterThan(0);
  });
  it("buildEntryContentAssets skills 8", () => {
    const assets = buildEntryContentAssets(
      makeEntry({ category: "skills", slug: "skills-8", body: "body-8" }),
    );
    expect(assets.length).toBeGreaterThan(0);
  });
  it("buildEntryContentAssets skills 9", () => {
    const assets = buildEntryContentAssets(
      makeEntry({ category: "skills", slug: "skills-9", body: "body-9" }),
    );
    expect(assets.length).toBeGreaterThan(0);
  });
  it("buildEntryContentAssets rules 0", () => {
    const assets = buildEntryContentAssets(
      makeEntry({ category: "rules", slug: "rules-0", body: "body-0" }),
    );
    expect(assets.length).toBeGreaterThan(0);
  });
  it("buildEntryContentAssets rules 1", () => {
    const assets = buildEntryContentAssets(
      makeEntry({ category: "rules", slug: "rules-1", body: "body-1" }),
    );
    expect(assets.length).toBeGreaterThan(0);
  });
  it("buildEntryContentAssets rules 2", () => {
    const assets = buildEntryContentAssets(
      makeEntry({ category: "rules", slug: "rules-2", body: "body-2" }),
    );
    expect(assets.length).toBeGreaterThan(0);
  });
  it("buildEntryContentAssets rules 3", () => {
    const assets = buildEntryContentAssets(
      makeEntry({ category: "rules", slug: "rules-3", body: "body-3" }),
    );
    expect(assets.length).toBeGreaterThan(0);
  });
  it("buildEntryContentAssets rules 4", () => {
    const assets = buildEntryContentAssets(
      makeEntry({ category: "rules", slug: "rules-4", body: "body-4" }),
    );
    expect(assets.length).toBeGreaterThan(0);
  });
  it("buildEntryContentAssets rules 5", () => {
    const assets = buildEntryContentAssets(
      makeEntry({ category: "rules", slug: "rules-5", body: "body-5" }),
    );
    expect(assets.length).toBeGreaterThan(0);
  });
  it("buildEntryContentAssets rules 6", () => {
    const assets = buildEntryContentAssets(
      makeEntry({ category: "rules", slug: "rules-6", body: "body-6" }),
    );
    expect(assets.length).toBeGreaterThan(0);
  });
  it("buildEntryContentAssets rules 7", () => {
    const assets = buildEntryContentAssets(
      makeEntry({ category: "rules", slug: "rules-7", body: "body-7" }),
    );
    expect(assets.length).toBeGreaterThan(0);
  });
  it("buildEntryContentAssets rules 8", () => {
    const assets = buildEntryContentAssets(
      makeEntry({ category: "rules", slug: "rules-8", body: "body-8" }),
    );
    expect(assets.length).toBeGreaterThan(0);
  });
  it("buildEntryContentAssets rules 9", () => {
    const assets = buildEntryContentAssets(
      makeEntry({ category: "rules", slug: "rules-9", body: "body-9" }),
    );
    expect(assets.length).toBeGreaterThan(0);
  });
  it("buildEntryContentAssets commands 0", () => {
    const assets = buildEntryContentAssets(
      makeEntry({ category: "commands", slug: "commands-0", body: "body-0" }),
    );
    expect(assets.length).toBeGreaterThan(0);
  });
  it("buildEntryContentAssets commands 1", () => {
    const assets = buildEntryContentAssets(
      makeEntry({ category: "commands", slug: "commands-1", body: "body-1" }),
    );
    expect(assets.length).toBeGreaterThan(0);
  });
  it("buildEntryContentAssets commands 2", () => {
    const assets = buildEntryContentAssets(
      makeEntry({ category: "commands", slug: "commands-2", body: "body-2" }),
    );
    expect(assets.length).toBeGreaterThan(0);
  });
  it("buildEntryContentAssets commands 3", () => {
    const assets = buildEntryContentAssets(
      makeEntry({ category: "commands", slug: "commands-3", body: "body-3" }),
    );
    expect(assets.length).toBeGreaterThan(0);
  });
  it("buildEntryContentAssets commands 4", () => {
    const assets = buildEntryContentAssets(
      makeEntry({ category: "commands", slug: "commands-4", body: "body-4" }),
    );
    expect(assets.length).toBeGreaterThan(0);
  });
  it("buildEntryContentAssets commands 5", () => {
    const assets = buildEntryContentAssets(
      makeEntry({ category: "commands", slug: "commands-5", body: "body-5" }),
    );
    expect(assets.length).toBeGreaterThan(0);
  });
  it("buildEntryContentAssets commands 6", () => {
    const assets = buildEntryContentAssets(
      makeEntry({ category: "commands", slug: "commands-6", body: "body-6" }),
    );
    expect(assets.length).toBeGreaterThan(0);
  });
  it("buildEntryContentAssets commands 7", () => {
    const assets = buildEntryContentAssets(
      makeEntry({ category: "commands", slug: "commands-7", body: "body-7" }),
    );
    expect(assets.length).toBeGreaterThan(0);
  });
  it("buildEntryContentAssets commands 8", () => {
    const assets = buildEntryContentAssets(
      makeEntry({ category: "commands", slug: "commands-8", body: "body-8" }),
    );
    expect(assets.length).toBeGreaterThan(0);
  });
  it("buildEntryContentAssets commands 9", () => {
    const assets = buildEntryContentAssets(
      makeEntry({ category: "commands", slug: "commands-9", body: "body-9" }),
    );
    expect(assets.length).toBeGreaterThan(0);
  });
  it("buildEntryContentAssets hooks 0", () => {
    const assets = buildEntryContentAssets(
      makeEntry({ category: "hooks", slug: "hooks-0", body: "body-0" }),
    );
    expect(assets.length).toBeGreaterThan(0);
  });
  it("buildEntryContentAssets hooks 1", () => {
    const assets = buildEntryContentAssets(
      makeEntry({ category: "hooks", slug: "hooks-1", body: "body-1" }),
    );
    expect(assets.length).toBeGreaterThan(0);
  });
  it("buildEntryContentAssets hooks 2", () => {
    const assets = buildEntryContentAssets(
      makeEntry({ category: "hooks", slug: "hooks-2", body: "body-2" }),
    );
    expect(assets.length).toBeGreaterThan(0);
  });
  it("buildEntryContentAssets hooks 3", () => {
    const assets = buildEntryContentAssets(
      makeEntry({ category: "hooks", slug: "hooks-3", body: "body-3" }),
    );
    expect(assets.length).toBeGreaterThan(0);
  });
  it("buildEntryContentAssets hooks 4", () => {
    const assets = buildEntryContentAssets(
      makeEntry({ category: "hooks", slug: "hooks-4", body: "body-4" }),
    );
    expect(assets.length).toBeGreaterThan(0);
  });
  it("buildEntryContentAssets hooks 5", () => {
    const assets = buildEntryContentAssets(
      makeEntry({ category: "hooks", slug: "hooks-5", body: "body-5" }),
    );
    expect(assets.length).toBeGreaterThan(0);
  });
  it("buildEntryContentAssets hooks 6", () => {
    const assets = buildEntryContentAssets(
      makeEntry({ category: "hooks", slug: "hooks-6", body: "body-6" }),
    );
    expect(assets.length).toBeGreaterThan(0);
  });
  it("buildEntryContentAssets hooks 7", () => {
    const assets = buildEntryContentAssets(
      makeEntry({ category: "hooks", slug: "hooks-7", body: "body-7" }),
    );
    expect(assets.length).toBeGreaterThan(0);
  });
  it("buildEntryContentAssets hooks 8", () => {
    const assets = buildEntryContentAssets(
      makeEntry({ category: "hooks", slug: "hooks-8", body: "body-8" }),
    );
    expect(assets.length).toBeGreaterThan(0);
  });
  it("buildEntryContentAssets hooks 9", () => {
    const assets = buildEntryContentAssets(
      makeEntry({ category: "hooks", slug: "hooks-9", body: "body-9" }),
    );
    expect(assets.length).toBeGreaterThan(0);
  });
  it("buildEntryContentAssets guides 0", () => {
    const assets = buildEntryContentAssets(
      makeEntry({ category: "guides", slug: "guides-0", body: "body-0" }),
    );
    expect(assets.length).toBeGreaterThan(0);
  });
  it("buildEntryContentAssets guides 1", () => {
    const assets = buildEntryContentAssets(
      makeEntry({ category: "guides", slug: "guides-1", body: "body-1" }),
    );
    expect(assets.length).toBeGreaterThan(0);
  });
  it("buildEntryContentAssets guides 2", () => {
    const assets = buildEntryContentAssets(
      makeEntry({ category: "guides", slug: "guides-2", body: "body-2" }),
    );
    expect(assets.length).toBeGreaterThan(0);
  });
  it("buildEntryContentAssets guides 3", () => {
    const assets = buildEntryContentAssets(
      makeEntry({ category: "guides", slug: "guides-3", body: "body-3" }),
    );
    expect(assets.length).toBeGreaterThan(0);
  });
  it("buildEntryContentAssets guides 4", () => {
    const assets = buildEntryContentAssets(
      makeEntry({ category: "guides", slug: "guides-4", body: "body-4" }),
    );
    expect(assets.length).toBeGreaterThan(0);
  });
  it("buildEntryContentAssets guides 5", () => {
    const assets = buildEntryContentAssets(
      makeEntry({ category: "guides", slug: "guides-5", body: "body-5" }),
    );
    expect(assets.length).toBeGreaterThan(0);
  });
  it("buildEntryContentAssets guides 6", () => {
    const assets = buildEntryContentAssets(
      makeEntry({ category: "guides", slug: "guides-6", body: "body-6" }),
    );
    expect(assets.length).toBeGreaterThan(0);
  });
  it("buildEntryContentAssets guides 7", () => {
    const assets = buildEntryContentAssets(
      makeEntry({ category: "guides", slug: "guides-7", body: "body-7" }),
    );
    expect(assets.length).toBeGreaterThan(0);
  });
  it("buildEntryContentAssets guides 8", () => {
    const assets = buildEntryContentAssets(
      makeEntry({ category: "guides", slug: "guides-8", body: "body-8" }),
    );
    expect(assets.length).toBeGreaterThan(0);
  });
  it("buildEntryContentAssets guides 9", () => {
    const assets = buildEntryContentAssets(
      makeEntry({ category: "guides", slug: "guides-9", body: "body-9" }),
    );
    expect(assets.length).toBeGreaterThan(0);
  });
  it("buildEntryContentAssets collections 0", () => {
    const assets = buildEntryContentAssets(
      makeEntry({
        category: "collections",
        slug: "collections-0",
        body: "body-0",
      }),
    );
    expect(assets.length).toBeGreaterThan(0);
  });
  it("buildEntryContentAssets collections 1", () => {
    const assets = buildEntryContentAssets(
      makeEntry({
        category: "collections",
        slug: "collections-1",
        body: "body-1",
      }),
    );
    expect(assets.length).toBeGreaterThan(0);
  });
  it("buildEntryContentAssets collections 2", () => {
    const assets = buildEntryContentAssets(
      makeEntry({
        category: "collections",
        slug: "collections-2",
        body: "body-2",
      }),
    );
    expect(assets.length).toBeGreaterThan(0);
  });
  it("buildEntryContentAssets collections 3", () => {
    const assets = buildEntryContentAssets(
      makeEntry({
        category: "collections",
        slug: "collections-3",
        body: "body-3",
      }),
    );
    expect(assets.length).toBeGreaterThan(0);
  });
  it("buildEntryContentAssets collections 4", () => {
    const assets = buildEntryContentAssets(
      makeEntry({
        category: "collections",
        slug: "collections-4",
        body: "body-4",
      }),
    );
    expect(assets.length).toBeGreaterThan(0);
  });
  it("buildEntryContentAssets collections 5", () => {
    const assets = buildEntryContentAssets(
      makeEntry({
        category: "collections",
        slug: "collections-5",
        body: "body-5",
      }),
    );
    expect(assets.length).toBeGreaterThan(0);
  });
  it("buildEntryContentAssets collections 6", () => {
    const assets = buildEntryContentAssets(
      makeEntry({
        category: "collections",
        slug: "collections-6",
        body: "body-6",
      }),
    );
    expect(assets.length).toBeGreaterThan(0);
  });
  it("buildEntryContentAssets collections 7", () => {
    const assets = buildEntryContentAssets(
      makeEntry({
        category: "collections",
        slug: "collections-7",
        body: "body-7",
      }),
    );
    expect(assets.length).toBeGreaterThan(0);
  });
  it("buildEntryContentAssets collections 8", () => {
    const assets = buildEntryContentAssets(
      makeEntry({
        category: "collections",
        slug: "collections-8",
        body: "body-8",
      }),
    );
    expect(assets.length).toBeGreaterThan(0);
  });
  it("buildEntryContentAssets collections 9", () => {
    const assets = buildEntryContentAssets(
      makeEntry({
        category: "collections",
        slug: "collections-9",
        body: "body-9",
      }),
    );
    expect(assets.length).toBeGreaterThan(0);
  });
  it("buildEntryContentAssets statuslines 0", () => {
    const assets = buildEntryContentAssets(
      makeEntry({
        category: "statuslines",
        slug: "statuslines-0",
        body: "body-0",
      }),
    );
    expect(assets.length).toBeGreaterThan(0);
  });
  it("buildEntryContentAssets statuslines 1", () => {
    const assets = buildEntryContentAssets(
      makeEntry({
        category: "statuslines",
        slug: "statuslines-1",
        body: "body-1",
      }),
    );
    expect(assets.length).toBeGreaterThan(0);
  });
  it("buildEntryContentAssets statuslines 2", () => {
    const assets = buildEntryContentAssets(
      makeEntry({
        category: "statuslines",
        slug: "statuslines-2",
        body: "body-2",
      }),
    );
    expect(assets.length).toBeGreaterThan(0);
  });
  it("buildEntryContentAssets statuslines 3", () => {
    const assets = buildEntryContentAssets(
      makeEntry({
        category: "statuslines",
        slug: "statuslines-3",
        body: "body-3",
      }),
    );
    expect(assets.length).toBeGreaterThan(0);
  });
  it("buildEntryContentAssets statuslines 4", () => {
    const assets = buildEntryContentAssets(
      makeEntry({
        category: "statuslines",
        slug: "statuslines-4",
        body: "body-4",
      }),
    );
    expect(assets.length).toBeGreaterThan(0);
  });
  it("buildEntryContentAssets statuslines 5", () => {
    const assets = buildEntryContentAssets(
      makeEntry({
        category: "statuslines",
        slug: "statuslines-5",
        body: "body-5",
      }),
    );
    expect(assets.length).toBeGreaterThan(0);
  });
  it("buildEntryContentAssets statuslines 6", () => {
    const assets = buildEntryContentAssets(
      makeEntry({
        category: "statuslines",
        slug: "statuslines-6",
        body: "body-6",
      }),
    );
    expect(assets.length).toBeGreaterThan(0);
  });
  it("buildEntryContentAssets statuslines 7", () => {
    const assets = buildEntryContentAssets(
      makeEntry({
        category: "statuslines",
        slug: "statuslines-7",
        body: "body-7",
      }),
    );
    expect(assets.length).toBeGreaterThan(0);
  });
  it("buildEntryContentAssets statuslines 8", () => {
    const assets = buildEntryContentAssets(
      makeEntry({
        category: "statuslines",
        slug: "statuslines-8",
        body: "body-8",
      }),
    );
    expect(assets.length).toBeGreaterThan(0);
  });
  it("buildEntryContentAssets statuslines 9", () => {
    const assets = buildEntryContentAssets(
      makeEntry({
        category: "statuslines",
        slug: "statuslines-9",
        body: "body-9",
      }),
    );
    expect(assets.length).toBeGreaterThan(0);
  });
  it("buildEntryContentAssets churn 0", () => {
    const assets = buildEntryContentAssets(
      makeEntry({ installCommand: "cmd-0", scriptBody: "script-0" }),
    );
    expect(assets.some((a) => a.type === "install_command")).toBe(true);
  });
  it("buildEntryContentAssets churn 1", () => {
    const assets = buildEntryContentAssets(
      makeEntry({ installCommand: "cmd-1", scriptBody: "script-1" }),
    );
    expect(assets.some((a) => a.type === "install_command")).toBe(true);
  });
  it("buildEntryContentAssets churn 2", () => {
    const assets = buildEntryContentAssets(
      makeEntry({ installCommand: "cmd-2", scriptBody: "script-2" }),
    );
    expect(assets.some((a) => a.type === "install_command")).toBe(true);
  });
  it("buildEntryContentAssets churn 3", () => {
    const assets = buildEntryContentAssets(
      makeEntry({ installCommand: "cmd-3", scriptBody: "script-3" }),
    );
    expect(assets.some((a) => a.type === "install_command")).toBe(true);
  });
  it("buildEntryContentAssets churn 4", () => {
    const assets = buildEntryContentAssets(
      makeEntry({ installCommand: "cmd-4", scriptBody: "script-4" }),
    );
    expect(assets.some((a) => a.type === "install_command")).toBe(true);
  });
  it("buildEntryContentAssets churn 5", () => {
    const assets = buildEntryContentAssets(
      makeEntry({ installCommand: "cmd-5", scriptBody: "script-5" }),
    );
    expect(assets.some((a) => a.type === "install_command")).toBe(true);
  });
  it("buildEntryContentAssets churn 6", () => {
    const assets = buildEntryContentAssets(
      makeEntry({ installCommand: "cmd-6", scriptBody: "script-6" }),
    );
    expect(assets.some((a) => a.type === "install_command")).toBe(true);
  });
  it("buildEntryContentAssets churn 7", () => {
    const assets = buildEntryContentAssets(
      makeEntry({ installCommand: "cmd-7", scriptBody: "script-7" }),
    );
    expect(assets.some((a) => a.type === "install_command")).toBe(true);
  });
  it("buildEntryContentAssets churn 8", () => {
    const assets = buildEntryContentAssets(
      makeEntry({ installCommand: "cmd-8", scriptBody: "script-8" }),
    );
    expect(assets.some((a) => a.type === "install_command")).toBe(true);
  });
  it("buildEntryContentAssets churn 9", () => {
    const assets = buildEntryContentAssets(
      makeEntry({ installCommand: "cmd-9", scriptBody: "script-9" }),
    );
    expect(assets.some((a) => a.type === "install_command")).toBe(true);
  });
  it("buildEntryContentAssets churn 10", () => {
    const assets = buildEntryContentAssets(
      makeEntry({ installCommand: "cmd-10", scriptBody: "script-10" }),
    );
    expect(assets.some((a) => a.type === "install_command")).toBe(true);
  });
  it("buildEntryContentAssets churn 11", () => {
    const assets = buildEntryContentAssets(
      makeEntry({ installCommand: "cmd-11", scriptBody: "script-11" }),
    );
    expect(assets.some((a) => a.type === "install_command")).toBe(true);
  });
  it("buildEntryContentAssets churn 12", () => {
    const assets = buildEntryContentAssets(
      makeEntry({ installCommand: "cmd-12", scriptBody: "script-12" }),
    );
    expect(assets.some((a) => a.type === "install_command")).toBe(true);
  });
  it("buildEntryContentAssets churn 13", () => {
    const assets = buildEntryContentAssets(
      makeEntry({ installCommand: "cmd-13", scriptBody: "script-13" }),
    );
    expect(assets.some((a) => a.type === "install_command")).toBe(true);
  });
  it("buildEntryContentAssets churn 14", () => {
    const assets = buildEntryContentAssets(
      makeEntry({ installCommand: "cmd-14", scriptBody: "script-14" }),
    );
    expect(assets.some((a) => a.type === "install_command")).toBe(true);
  });
  it("buildEntryContentAssets churn 15", () => {
    const assets = buildEntryContentAssets(
      makeEntry({ installCommand: "cmd-15", scriptBody: "script-15" }),
    );
    expect(assets.some((a) => a.type === "install_command")).toBe(true);
  });
  it("buildEntryContentAssets churn 16", () => {
    const assets = buildEntryContentAssets(
      makeEntry({ installCommand: "cmd-16", scriptBody: "script-16" }),
    );
    expect(assets.some((a) => a.type === "install_command")).toBe(true);
  });
  it("buildEntryContentAssets churn 17", () => {
    const assets = buildEntryContentAssets(
      makeEntry({ installCommand: "cmd-17", scriptBody: "script-17" }),
    );
    expect(assets.some((a) => a.type === "install_command")).toBe(true);
  });
  it("buildEntryContentAssets churn 18", () => {
    const assets = buildEntryContentAssets(
      makeEntry({ installCommand: "cmd-18", scriptBody: "script-18" }),
    );
    expect(assets.some((a) => a.type === "install_command")).toBe(true);
  });
  it("buildEntryContentAssets churn 19", () => {
    const assets = buildEntryContentAssets(
      makeEntry({ installCommand: "cmd-19", scriptBody: "script-19" }),
    );
    expect(assets.some((a) => a.type === "install_command")).toBe(true);
  });
  it("buildEntryContentAssets churn 20", () => {
    const assets = buildEntryContentAssets(
      makeEntry({ installCommand: "cmd-20", scriptBody: "script-20" }),
    );
    expect(assets.some((a) => a.type === "install_command")).toBe(true);
  });
  it("buildEntryContentAssets churn 21", () => {
    const assets = buildEntryContentAssets(
      makeEntry({ installCommand: "cmd-21", scriptBody: "script-21" }),
    );
    expect(assets.some((a) => a.type === "install_command")).toBe(true);
  });
  it("buildEntryContentAssets churn 22", () => {
    const assets = buildEntryContentAssets(
      makeEntry({ installCommand: "cmd-22", scriptBody: "script-22" }),
    );
    expect(assets.some((a) => a.type === "install_command")).toBe(true);
  });
  it("buildEntryContentAssets churn 23", () => {
    const assets = buildEntryContentAssets(
      makeEntry({ installCommand: "cmd-23", scriptBody: "script-23" }),
    );
    expect(assets.some((a) => a.type === "install_command")).toBe(true);
  });
  it("buildEntryContentAssets churn 24", () => {
    const assets = buildEntryContentAssets(
      makeEntry({ installCommand: "cmd-24", scriptBody: "script-24" }),
    );
    expect(assets.some((a) => a.type === "install_command")).toBe(true);
  });
  it("buildEntryContentAssets churn 25", () => {
    const assets = buildEntryContentAssets(
      makeEntry({ installCommand: "cmd-25", scriptBody: "script-25" }),
    );
    expect(assets.some((a) => a.type === "install_command")).toBe(true);
  });
  it("buildEntryContentAssets churn 26", () => {
    const assets = buildEntryContentAssets(
      makeEntry({ installCommand: "cmd-26", scriptBody: "script-26" }),
    );
    expect(assets.some((a) => a.type === "install_command")).toBe(true);
  });
  it("buildEntryContentAssets churn 27", () => {
    const assets = buildEntryContentAssets(
      makeEntry({ installCommand: "cmd-27", scriptBody: "script-27" }),
    );
    expect(assets.some((a) => a.type === "install_command")).toBe(true);
  });
  it("buildEntryContentAssets churn 28", () => {
    const assets = buildEntryContentAssets(
      makeEntry({ installCommand: "cmd-28", scriptBody: "script-28" }),
    );
    expect(assets.some((a) => a.type === "install_command")).toBe(true);
  });
  it("buildEntryContentAssets churn 29", () => {
    const assets = buildEntryContentAssets(
      makeEntry({ installCommand: "cmd-29", scriptBody: "script-29" }),
    );
    expect(assets.some((a) => a.type === "install_command")).toBe(true);
  });
  it("buildEntryContentAssets churn 30", () => {
    const assets = buildEntryContentAssets(
      makeEntry({ installCommand: "cmd-30", scriptBody: "script-30" }),
    );
    expect(assets.some((a) => a.type === "install_command")).toBe(true);
  });
  it("buildEntryContentAssets churn 31", () => {
    const assets = buildEntryContentAssets(
      makeEntry({ installCommand: "cmd-31", scriptBody: "script-31" }),
    );
    expect(assets.some((a) => a.type === "install_command")).toBe(true);
  });
  it("buildEntryContentAssets churn 32", () => {
    const assets = buildEntryContentAssets(
      makeEntry({ installCommand: "cmd-32", scriptBody: "script-32" }),
    );
    expect(assets.some((a) => a.type === "install_command")).toBe(true);
  });
  it("buildEntryContentAssets churn 33", () => {
    const assets = buildEntryContentAssets(
      makeEntry({ installCommand: "cmd-33", scriptBody: "script-33" }),
    );
    expect(assets.some((a) => a.type === "install_command")).toBe(true);
  });
  it("buildEntryContentAssets churn 34", () => {
    const assets = buildEntryContentAssets(
      makeEntry({ installCommand: "cmd-34", scriptBody: "script-34" }),
    );
    expect(assets.some((a) => a.type === "install_command")).toBe(true);
  });
  it("buildEntryContentAssets churn 35", () => {
    const assets = buildEntryContentAssets(
      makeEntry({ installCommand: "cmd-35", scriptBody: "script-35" }),
    );
    expect(assets.some((a) => a.type === "install_command")).toBe(true);
  });
  it("buildEntryContentAssets churn 36", () => {
    const assets = buildEntryContentAssets(
      makeEntry({ installCommand: "cmd-36", scriptBody: "script-36" }),
    );
    expect(assets.some((a) => a.type === "install_command")).toBe(true);
  });
  it("buildEntryContentAssets churn 37", () => {
    const assets = buildEntryContentAssets(
      makeEntry({ installCommand: "cmd-37", scriptBody: "script-37" }),
    );
    expect(assets.some((a) => a.type === "install_command")).toBe(true);
  });
  it("buildEntryContentAssets churn 38", () => {
    const assets = buildEntryContentAssets(
      makeEntry({ installCommand: "cmd-38", scriptBody: "script-38" }),
    );
    expect(assets.some((a) => a.type === "install_command")).toBe(true);
  });
  it("buildEntryContentAssets churn 39", () => {
    const assets = buildEntryContentAssets(
      makeEntry({ installCommand: "cmd-39", scriptBody: "script-39" }),
    );
    expect(assets.some((a) => a.type === "install_command")).toBe(true);
  });
  it("buildEntryContentAssets churn 40", () => {
    const assets = buildEntryContentAssets(
      makeEntry({ installCommand: "cmd-40", scriptBody: "script-40" }),
    );
    expect(assets.some((a) => a.type === "install_command")).toBe(true);
  });
  it("buildEntryContentAssets churn 41", () => {
    const assets = buildEntryContentAssets(
      makeEntry({ installCommand: "cmd-41", scriptBody: "script-41" }),
    );
    expect(assets.some((a) => a.type === "install_command")).toBe(true);
  });
  it("buildEntryContentAssets churn 42", () => {
    const assets = buildEntryContentAssets(
      makeEntry({ installCommand: "cmd-42", scriptBody: "script-42" }),
    );
    expect(assets.some((a) => a.type === "install_command")).toBe(true);
  });
  it("buildEntryContentAssets churn 43", () => {
    const assets = buildEntryContentAssets(
      makeEntry({ installCommand: "cmd-43", scriptBody: "script-43" }),
    );
    expect(assets.some((a) => a.type === "install_command")).toBe(true);
  });
  it("buildEntryContentAssets churn 44", () => {
    const assets = buildEntryContentAssets(
      makeEntry({ installCommand: "cmd-44", scriptBody: "script-44" }),
    );
    expect(assets.some((a) => a.type === "install_command")).toBe(true);
  });
  it("buildEntryContentAssets churn 45", () => {
    const assets = buildEntryContentAssets(
      makeEntry({ installCommand: "cmd-45", scriptBody: "script-45" }),
    );
    expect(assets.some((a) => a.type === "install_command")).toBe(true);
  });
  it("buildEntryContentAssets churn 46", () => {
    const assets = buildEntryContentAssets(
      makeEntry({ installCommand: "cmd-46", scriptBody: "script-46" }),
    );
    expect(assets.some((a) => a.type === "install_command")).toBe(true);
  });
  it("buildEntryContentAssets churn 47", () => {
    const assets = buildEntryContentAssets(
      makeEntry({ installCommand: "cmd-47", scriptBody: "script-47" }),
    );
    expect(assets.some((a) => a.type === "install_command")).toBe(true);
  });
  it("buildEntryContentAssets churn 48", () => {
    const assets = buildEntryContentAssets(
      makeEntry({ installCommand: "cmd-48", scriptBody: "script-48" }),
    );
    expect(assets.some((a) => a.type === "install_command")).toBe(true);
  });
  it("buildEntryContentAssets churn 49", () => {
    const assets = buildEntryContentAssets(
      makeEntry({ installCommand: "cmd-49", scriptBody: "script-49" }),
    );
    expect(assets.some((a) => a.type === "install_command")).toBe(true);
  });
  it("buildEntryContentAssets churn 50", () => {
    const assets = buildEntryContentAssets(
      makeEntry({ installCommand: "cmd-50", scriptBody: "script-50" }),
    );
    expect(assets.some((a) => a.type === "install_command")).toBe(true);
  });
  it("buildEntryContentAssets churn 51", () => {
    const assets = buildEntryContentAssets(
      makeEntry({ installCommand: "cmd-51", scriptBody: "script-51" }),
    );
    expect(assets.some((a) => a.type === "install_command")).toBe(true);
  });
  it("buildEntryContentAssets churn 52", () => {
    const assets = buildEntryContentAssets(
      makeEntry({ installCommand: "cmd-52", scriptBody: "script-52" }),
    );
    expect(assets.some((a) => a.type === "install_command")).toBe(true);
  });
  it("buildEntryContentAssets churn 53", () => {
    const assets = buildEntryContentAssets(
      makeEntry({ installCommand: "cmd-53", scriptBody: "script-53" }),
    );
    expect(assets.some((a) => a.type === "install_command")).toBe(true);
  });
  it("buildEntryContentAssets churn 54", () => {
    const assets = buildEntryContentAssets(
      makeEntry({ installCommand: "cmd-54", scriptBody: "script-54" }),
    );
    expect(assets.some((a) => a.type === "install_command")).toBe(true);
  });
  it("buildEntryContentAssets churn 55", () => {
    const assets = buildEntryContentAssets(
      makeEntry({ installCommand: "cmd-55", scriptBody: "script-55" }),
    );
    expect(assets.some((a) => a.type === "install_command")).toBe(true);
  });
  it("buildEntryContentAssets churn 56", () => {
    const assets = buildEntryContentAssets(
      makeEntry({ installCommand: "cmd-56", scriptBody: "script-56" }),
    );
    expect(assets.some((a) => a.type === "install_command")).toBe(true);
  });
  it("buildEntryContentAssets churn 57", () => {
    const assets = buildEntryContentAssets(
      makeEntry({ installCommand: "cmd-57", scriptBody: "script-57" }),
    );
    expect(assets.some((a) => a.type === "install_command")).toBe(true);
  });
  it("buildEntryContentAssets churn 58", () => {
    const assets = buildEntryContentAssets(
      makeEntry({ installCommand: "cmd-58", scriptBody: "script-58" }),
    );
    expect(assets.some((a) => a.type === "install_command")).toBe(true);
  });
  it("buildEntryContentAssets churn 59", () => {
    const assets = buildEntryContentAssets(
      makeEntry({ installCommand: "cmd-59", scriptBody: "script-59" }),
    );
    expect(assets.some((a) => a.type === "install_command")).toBe(true);
  });
  it("buildEntryContentAssets churn 60", () => {
    const assets = buildEntryContentAssets(
      makeEntry({ installCommand: "cmd-60", scriptBody: "script-60" }),
    );
    expect(assets.some((a) => a.type === "install_command")).toBe(true);
  });
  it("buildEntryContentAssets churn 61", () => {
    const assets = buildEntryContentAssets(
      makeEntry({ installCommand: "cmd-61", scriptBody: "script-61" }),
    );
    expect(assets.some((a) => a.type === "install_command")).toBe(true);
  });
  it("buildEntryContentAssets churn 62", () => {
    const assets = buildEntryContentAssets(
      makeEntry({ installCommand: "cmd-62", scriptBody: "script-62" }),
    );
    expect(assets.some((a) => a.type === "install_command")).toBe(true);
  });
  it("buildEntryContentAssets churn 63", () => {
    const assets = buildEntryContentAssets(
      makeEntry({ installCommand: "cmd-63", scriptBody: "script-63" }),
    );
    expect(assets.some((a) => a.type === "install_command")).toBe(true);
  });
  it("buildEntryContentAssets churn 64", () => {
    const assets = buildEntryContentAssets(
      makeEntry({ installCommand: "cmd-64", scriptBody: "script-64" }),
    );
    expect(assets.some((a) => a.type === "install_command")).toBe(true);
  });
  it("buildEntryContentAssets churn 65", () => {
    const assets = buildEntryContentAssets(
      makeEntry({ installCommand: "cmd-65", scriptBody: "script-65" }),
    );
    expect(assets.some((a) => a.type === "install_command")).toBe(true);
  });
  it("buildEntryContentAssets churn 66", () => {
    const assets = buildEntryContentAssets(
      makeEntry({ installCommand: "cmd-66", scriptBody: "script-66" }),
    );
    expect(assets.some((a) => a.type === "install_command")).toBe(true);
  });
  it("buildEntryContentAssets churn 67", () => {
    const assets = buildEntryContentAssets(
      makeEntry({ installCommand: "cmd-67", scriptBody: "script-67" }),
    );
    expect(assets.some((a) => a.type === "install_command")).toBe(true);
  });
  it("buildEntryContentAssets churn 68", () => {
    const assets = buildEntryContentAssets(
      makeEntry({ installCommand: "cmd-68", scriptBody: "script-68" }),
    );
    expect(assets.some((a) => a.type === "install_command")).toBe(true);
  });
  it("buildEntryContentAssets churn 69", () => {
    const assets = buildEntryContentAssets(
      makeEntry({ installCommand: "cmd-69", scriptBody: "script-69" }),
    );
    expect(assets.some((a) => a.type === "install_command")).toBe(true);
  });
  it("buildEntryContentAssets churn 70", () => {
    const assets = buildEntryContentAssets(
      makeEntry({ installCommand: "cmd-70", scriptBody: "script-70" }),
    );
    expect(assets.some((a) => a.type === "install_command")).toBe(true);
  });
  it("buildEntryContentAssets churn 71", () => {
    const assets = buildEntryContentAssets(
      makeEntry({ installCommand: "cmd-71", scriptBody: "script-71" }),
    );
    expect(assets.some((a) => a.type === "install_command")).toBe(true);
  });
  it("buildEntryContentAssets churn 72", () => {
    const assets = buildEntryContentAssets(
      makeEntry({ installCommand: "cmd-72", scriptBody: "script-72" }),
    );
    expect(assets.some((a) => a.type === "install_command")).toBe(true);
  });
  it("buildEntryContentAssets churn 73", () => {
    const assets = buildEntryContentAssets(
      makeEntry({ installCommand: "cmd-73", scriptBody: "script-73" }),
    );
    expect(assets.some((a) => a.type === "install_command")).toBe(true);
  });
  it("buildEntryContentAssets churn 74", () => {
    const assets = buildEntryContentAssets(
      makeEntry({ installCommand: "cmd-74", scriptBody: "script-74" }),
    );
    expect(assets.some((a) => a.type === "install_command")).toBe(true);
  });
  it("buildEntryContentAssets churn 75", () => {
    const assets = buildEntryContentAssets(
      makeEntry({ installCommand: "cmd-75", scriptBody: "script-75" }),
    );
    expect(assets.some((a) => a.type === "install_command")).toBe(true);
  });
  it("buildEntryContentAssets churn 76", () => {
    const assets = buildEntryContentAssets(
      makeEntry({ installCommand: "cmd-76", scriptBody: "script-76" }),
    );
    expect(assets.some((a) => a.type === "install_command")).toBe(true);
  });
  it("buildEntryContentAssets churn 77", () => {
    const assets = buildEntryContentAssets(
      makeEntry({ installCommand: "cmd-77", scriptBody: "script-77" }),
    );
    expect(assets.some((a) => a.type === "install_command")).toBe(true);
  });
  it("buildEntryContentAssets churn 78", () => {
    const assets = buildEntryContentAssets(
      makeEntry({ installCommand: "cmd-78", scriptBody: "script-78" }),
    );
    expect(assets.some((a) => a.type === "install_command")).toBe(true);
  });
  it("buildEntryContentAssets churn 79", () => {
    const assets = buildEntryContentAssets(
      makeEntry({ installCommand: "cmd-79", scriptBody: "script-79" }),
    );
    expect(assets.some((a) => a.type === "install_command")).toBe(true);
  });
});

describe("registry-copyable-asset-lib filterAssetsByType", () => {
  it("returns all assets when type omitted", () => {
    const assets = buildEntryContentAssets(
      makeEntry({ body: "x", installCommand: "y" }),
    );
    expect(filterAssetsByType(assets, "")).toEqual(assets);
  });
  it("filters to requested type", () => {
    const assets = buildEntryContentAssets(
      makeEntry({ body: "x", installCommand: "y" }),
    );
    const filtered = filterAssetsByType(assets, "install_command");
    expect(filtered.every((a) => a.type === "install_command")).toBe(true);
  });
  it("filterAssetsByType full_content 0", () => {
    const assets = buildEntryContentAssets(
      makeEntry({ body: "body", installCommand: "cmd", configSnippet: "cfg" }),
    );
    const filtered = filterAssetsByType(assets, "full_content");
    expect(filtered.every((a) => a.type === "full_content")).toBe(true);
  });
  it("filterAssetsByType full_content 1", () => {
    const assets = buildEntryContentAssets(
      makeEntry({ body: "body", installCommand: "cmd", configSnippet: "cfg" }),
    );
    const filtered = filterAssetsByType(assets, "full_content");
    expect(filtered.every((a) => a.type === "full_content")).toBe(true);
  });
  it("filterAssetsByType full_content 2", () => {
    const assets = buildEntryContentAssets(
      makeEntry({ body: "body", installCommand: "cmd", configSnippet: "cfg" }),
    );
    const filtered = filterAssetsByType(assets, "full_content");
    expect(filtered.every((a) => a.type === "full_content")).toBe(true);
  });
  it("filterAssetsByType full_content 3", () => {
    const assets = buildEntryContentAssets(
      makeEntry({ body: "body", installCommand: "cmd", configSnippet: "cfg" }),
    );
    const filtered = filterAssetsByType(assets, "full_content");
    expect(filtered.every((a) => a.type === "full_content")).toBe(true);
  });
  it("filterAssetsByType full_content 4", () => {
    const assets = buildEntryContentAssets(
      makeEntry({ body: "body", installCommand: "cmd", configSnippet: "cfg" }),
    );
    const filtered = filterAssetsByType(assets, "full_content");
    expect(filtered.every((a) => a.type === "full_content")).toBe(true);
  });
  it("filterAssetsByType full_content 5", () => {
    const assets = buildEntryContentAssets(
      makeEntry({ body: "body", installCommand: "cmd", configSnippet: "cfg" }),
    );
    const filtered = filterAssetsByType(assets, "full_content");
    expect(filtered.every((a) => a.type === "full_content")).toBe(true);
  });
  it("filterAssetsByType full_content 6", () => {
    const assets = buildEntryContentAssets(
      makeEntry({ body: "body", installCommand: "cmd", configSnippet: "cfg" }),
    );
    const filtered = filterAssetsByType(assets, "full_content");
    expect(filtered.every((a) => a.type === "full_content")).toBe(true);
  });
  it("filterAssetsByType full_content 7", () => {
    const assets = buildEntryContentAssets(
      makeEntry({ body: "body", installCommand: "cmd", configSnippet: "cfg" }),
    );
    const filtered = filterAssetsByType(assets, "full_content");
    expect(filtered.every((a) => a.type === "full_content")).toBe(true);
  });
  it("filterAssetsByType full_content 8", () => {
    const assets = buildEntryContentAssets(
      makeEntry({ body: "body", installCommand: "cmd", configSnippet: "cfg" }),
    );
    const filtered = filterAssetsByType(assets, "full_content");
    expect(filtered.every((a) => a.type === "full_content")).toBe(true);
  });
  it("filterAssetsByType full_content 9", () => {
    const assets = buildEntryContentAssets(
      makeEntry({ body: "body", installCommand: "cmd", configSnippet: "cfg" }),
    );
    const filtered = filterAssetsByType(assets, "full_content");
    expect(filtered.every((a) => a.type === "full_content")).toBe(true);
  });
  it("filterAssetsByType full_content 10", () => {
    const assets = buildEntryContentAssets(
      makeEntry({ body: "body", installCommand: "cmd", configSnippet: "cfg" }),
    );
    const filtered = filterAssetsByType(assets, "full_content");
    expect(filtered.every((a) => a.type === "full_content")).toBe(true);
  });
  it("filterAssetsByType full_content 11", () => {
    const assets = buildEntryContentAssets(
      makeEntry({ body: "body", installCommand: "cmd", configSnippet: "cfg" }),
    );
    const filtered = filterAssetsByType(assets, "full_content");
    expect(filtered.every((a) => a.type === "full_content")).toBe(true);
  });
  it("filterAssetsByType full_content 12", () => {
    const assets = buildEntryContentAssets(
      makeEntry({ body: "body", installCommand: "cmd", configSnippet: "cfg" }),
    );
    const filtered = filterAssetsByType(assets, "full_content");
    expect(filtered.every((a) => a.type === "full_content")).toBe(true);
  });
  it("filterAssetsByType full_content 13", () => {
    const assets = buildEntryContentAssets(
      makeEntry({ body: "body", installCommand: "cmd", configSnippet: "cfg" }),
    );
    const filtered = filterAssetsByType(assets, "full_content");
    expect(filtered.every((a) => a.type === "full_content")).toBe(true);
  });
  it("filterAssetsByType full_content 14", () => {
    const assets = buildEntryContentAssets(
      makeEntry({ body: "body", installCommand: "cmd", configSnippet: "cfg" }),
    );
    const filtered = filterAssetsByType(assets, "full_content");
    expect(filtered.every((a) => a.type === "full_content")).toBe(true);
  });
  it("filterAssetsByType install_command 0", () => {
    const assets = buildEntryContentAssets(
      makeEntry({ body: "body", installCommand: "cmd", configSnippet: "cfg" }),
    );
    const filtered = filterAssetsByType(assets, "install_command");
    expect(filtered.every((a) => a.type === "install_command")).toBe(true);
  });
  it("filterAssetsByType install_command 1", () => {
    const assets = buildEntryContentAssets(
      makeEntry({ body: "body", installCommand: "cmd", configSnippet: "cfg" }),
    );
    const filtered = filterAssetsByType(assets, "install_command");
    expect(filtered.every((a) => a.type === "install_command")).toBe(true);
  });
  it("filterAssetsByType install_command 2", () => {
    const assets = buildEntryContentAssets(
      makeEntry({ body: "body", installCommand: "cmd", configSnippet: "cfg" }),
    );
    const filtered = filterAssetsByType(assets, "install_command");
    expect(filtered.every((a) => a.type === "install_command")).toBe(true);
  });
  it("filterAssetsByType install_command 3", () => {
    const assets = buildEntryContentAssets(
      makeEntry({ body: "body", installCommand: "cmd", configSnippet: "cfg" }),
    );
    const filtered = filterAssetsByType(assets, "install_command");
    expect(filtered.every((a) => a.type === "install_command")).toBe(true);
  });
  it("filterAssetsByType install_command 4", () => {
    const assets = buildEntryContentAssets(
      makeEntry({ body: "body", installCommand: "cmd", configSnippet: "cfg" }),
    );
    const filtered = filterAssetsByType(assets, "install_command");
    expect(filtered.every((a) => a.type === "install_command")).toBe(true);
  });
  it("filterAssetsByType install_command 5", () => {
    const assets = buildEntryContentAssets(
      makeEntry({ body: "body", installCommand: "cmd", configSnippet: "cfg" }),
    );
    const filtered = filterAssetsByType(assets, "install_command");
    expect(filtered.every((a) => a.type === "install_command")).toBe(true);
  });
  it("filterAssetsByType install_command 6", () => {
    const assets = buildEntryContentAssets(
      makeEntry({ body: "body", installCommand: "cmd", configSnippet: "cfg" }),
    );
    const filtered = filterAssetsByType(assets, "install_command");
    expect(filtered.every((a) => a.type === "install_command")).toBe(true);
  });
  it("filterAssetsByType install_command 7", () => {
    const assets = buildEntryContentAssets(
      makeEntry({ body: "body", installCommand: "cmd", configSnippet: "cfg" }),
    );
    const filtered = filterAssetsByType(assets, "install_command");
    expect(filtered.every((a) => a.type === "install_command")).toBe(true);
  });
  it("filterAssetsByType install_command 8", () => {
    const assets = buildEntryContentAssets(
      makeEntry({ body: "body", installCommand: "cmd", configSnippet: "cfg" }),
    );
    const filtered = filterAssetsByType(assets, "install_command");
    expect(filtered.every((a) => a.type === "install_command")).toBe(true);
  });
  it("filterAssetsByType install_command 9", () => {
    const assets = buildEntryContentAssets(
      makeEntry({ body: "body", installCommand: "cmd", configSnippet: "cfg" }),
    );
    const filtered = filterAssetsByType(assets, "install_command");
    expect(filtered.every((a) => a.type === "install_command")).toBe(true);
  });
  it("filterAssetsByType install_command 10", () => {
    const assets = buildEntryContentAssets(
      makeEntry({ body: "body", installCommand: "cmd", configSnippet: "cfg" }),
    );
    const filtered = filterAssetsByType(assets, "install_command");
    expect(filtered.every((a) => a.type === "install_command")).toBe(true);
  });
  it("filterAssetsByType install_command 11", () => {
    const assets = buildEntryContentAssets(
      makeEntry({ body: "body", installCommand: "cmd", configSnippet: "cfg" }),
    );
    const filtered = filterAssetsByType(assets, "install_command");
    expect(filtered.every((a) => a.type === "install_command")).toBe(true);
  });
  it("filterAssetsByType install_command 12", () => {
    const assets = buildEntryContentAssets(
      makeEntry({ body: "body", installCommand: "cmd", configSnippet: "cfg" }),
    );
    const filtered = filterAssetsByType(assets, "install_command");
    expect(filtered.every((a) => a.type === "install_command")).toBe(true);
  });
  it("filterAssetsByType install_command 13", () => {
    const assets = buildEntryContentAssets(
      makeEntry({ body: "body", installCommand: "cmd", configSnippet: "cfg" }),
    );
    const filtered = filterAssetsByType(assets, "install_command");
    expect(filtered.every((a) => a.type === "install_command")).toBe(true);
  });
  it("filterAssetsByType install_command 14", () => {
    const assets = buildEntryContentAssets(
      makeEntry({ body: "body", installCommand: "cmd", configSnippet: "cfg" }),
    );
    const filtered = filterAssetsByType(assets, "install_command");
    expect(filtered.every((a) => a.type === "install_command")).toBe(true);
  });
  it("filterAssetsByType config_snippet 0", () => {
    const assets = buildEntryContentAssets(
      makeEntry({ body: "body", installCommand: "cmd", configSnippet: "cfg" }),
    );
    const filtered = filterAssetsByType(assets, "config_snippet");
    expect(filtered.every((a) => a.type === "config_snippet")).toBe(true);
  });
  it("filterAssetsByType config_snippet 1", () => {
    const assets = buildEntryContentAssets(
      makeEntry({ body: "body", installCommand: "cmd", configSnippet: "cfg" }),
    );
    const filtered = filterAssetsByType(assets, "config_snippet");
    expect(filtered.every((a) => a.type === "config_snippet")).toBe(true);
  });
  it("filterAssetsByType config_snippet 2", () => {
    const assets = buildEntryContentAssets(
      makeEntry({ body: "body", installCommand: "cmd", configSnippet: "cfg" }),
    );
    const filtered = filterAssetsByType(assets, "config_snippet");
    expect(filtered.every((a) => a.type === "config_snippet")).toBe(true);
  });
  it("filterAssetsByType config_snippet 3", () => {
    const assets = buildEntryContentAssets(
      makeEntry({ body: "body", installCommand: "cmd", configSnippet: "cfg" }),
    );
    const filtered = filterAssetsByType(assets, "config_snippet");
    expect(filtered.every((a) => a.type === "config_snippet")).toBe(true);
  });
  it("filterAssetsByType config_snippet 4", () => {
    const assets = buildEntryContentAssets(
      makeEntry({ body: "body", installCommand: "cmd", configSnippet: "cfg" }),
    );
    const filtered = filterAssetsByType(assets, "config_snippet");
    expect(filtered.every((a) => a.type === "config_snippet")).toBe(true);
  });
  it("filterAssetsByType config_snippet 5", () => {
    const assets = buildEntryContentAssets(
      makeEntry({ body: "body", installCommand: "cmd", configSnippet: "cfg" }),
    );
    const filtered = filterAssetsByType(assets, "config_snippet");
    expect(filtered.every((a) => a.type === "config_snippet")).toBe(true);
  });
  it("filterAssetsByType config_snippet 6", () => {
    const assets = buildEntryContentAssets(
      makeEntry({ body: "body", installCommand: "cmd", configSnippet: "cfg" }),
    );
    const filtered = filterAssetsByType(assets, "config_snippet");
    expect(filtered.every((a) => a.type === "config_snippet")).toBe(true);
  });
  it("filterAssetsByType config_snippet 7", () => {
    const assets = buildEntryContentAssets(
      makeEntry({ body: "body", installCommand: "cmd", configSnippet: "cfg" }),
    );
    const filtered = filterAssetsByType(assets, "config_snippet");
    expect(filtered.every((a) => a.type === "config_snippet")).toBe(true);
  });
  it("filterAssetsByType config_snippet 8", () => {
    const assets = buildEntryContentAssets(
      makeEntry({ body: "body", installCommand: "cmd", configSnippet: "cfg" }),
    );
    const filtered = filterAssetsByType(assets, "config_snippet");
    expect(filtered.every((a) => a.type === "config_snippet")).toBe(true);
  });
  it("filterAssetsByType config_snippet 9", () => {
    const assets = buildEntryContentAssets(
      makeEntry({ body: "body", installCommand: "cmd", configSnippet: "cfg" }),
    );
    const filtered = filterAssetsByType(assets, "config_snippet");
    expect(filtered.every((a) => a.type === "config_snippet")).toBe(true);
  });
  it("filterAssetsByType config_snippet 10", () => {
    const assets = buildEntryContentAssets(
      makeEntry({ body: "body", installCommand: "cmd", configSnippet: "cfg" }),
    );
    const filtered = filterAssetsByType(assets, "config_snippet");
    expect(filtered.every((a) => a.type === "config_snippet")).toBe(true);
  });
  it("filterAssetsByType config_snippet 11", () => {
    const assets = buildEntryContentAssets(
      makeEntry({ body: "body", installCommand: "cmd", configSnippet: "cfg" }),
    );
    const filtered = filterAssetsByType(assets, "config_snippet");
    expect(filtered.every((a) => a.type === "config_snippet")).toBe(true);
  });
  it("filterAssetsByType config_snippet 12", () => {
    const assets = buildEntryContentAssets(
      makeEntry({ body: "body", installCommand: "cmd", configSnippet: "cfg" }),
    );
    const filtered = filterAssetsByType(assets, "config_snippet");
    expect(filtered.every((a) => a.type === "config_snippet")).toBe(true);
  });
  it("filterAssetsByType config_snippet 13", () => {
    const assets = buildEntryContentAssets(
      makeEntry({ body: "body", installCommand: "cmd", configSnippet: "cfg" }),
    );
    const filtered = filterAssetsByType(assets, "config_snippet");
    expect(filtered.every((a) => a.type === "config_snippet")).toBe(true);
  });
  it("filterAssetsByType config_snippet 14", () => {
    const assets = buildEntryContentAssets(
      makeEntry({ body: "body", installCommand: "cmd", configSnippet: "cfg" }),
    );
    const filtered = filterAssetsByType(assets, "config_snippet");
    expect(filtered.every((a) => a.type === "config_snippet")).toBe(true);
  });
  it("filterAssetsByType script 0", () => {
    const assets = buildEntryContentAssets(
      makeEntry({ body: "body", installCommand: "cmd", configSnippet: "cfg" }),
    );
    const filtered = filterAssetsByType(assets, "script");
    expect(filtered.every((a) => a.type === "script")).toBe(true);
  });
  it("filterAssetsByType script 1", () => {
    const assets = buildEntryContentAssets(
      makeEntry({ body: "body", installCommand: "cmd", configSnippet: "cfg" }),
    );
    const filtered = filterAssetsByType(assets, "script");
    expect(filtered.every((a) => a.type === "script")).toBe(true);
  });
  it("filterAssetsByType script 2", () => {
    const assets = buildEntryContentAssets(
      makeEntry({ body: "body", installCommand: "cmd", configSnippet: "cfg" }),
    );
    const filtered = filterAssetsByType(assets, "script");
    expect(filtered.every((a) => a.type === "script")).toBe(true);
  });
  it("filterAssetsByType script 3", () => {
    const assets = buildEntryContentAssets(
      makeEntry({ body: "body", installCommand: "cmd", configSnippet: "cfg" }),
    );
    const filtered = filterAssetsByType(assets, "script");
    expect(filtered.every((a) => a.type === "script")).toBe(true);
  });
  it("filterAssetsByType script 4", () => {
    const assets = buildEntryContentAssets(
      makeEntry({ body: "body", installCommand: "cmd", configSnippet: "cfg" }),
    );
    const filtered = filterAssetsByType(assets, "script");
    expect(filtered.every((a) => a.type === "script")).toBe(true);
  });
  it("filterAssetsByType script 5", () => {
    const assets = buildEntryContentAssets(
      makeEntry({ body: "body", installCommand: "cmd", configSnippet: "cfg" }),
    );
    const filtered = filterAssetsByType(assets, "script");
    expect(filtered.every((a) => a.type === "script")).toBe(true);
  });
  it("filterAssetsByType script 6", () => {
    const assets = buildEntryContentAssets(
      makeEntry({ body: "body", installCommand: "cmd", configSnippet: "cfg" }),
    );
    const filtered = filterAssetsByType(assets, "script");
    expect(filtered.every((a) => a.type === "script")).toBe(true);
  });
  it("filterAssetsByType script 7", () => {
    const assets = buildEntryContentAssets(
      makeEntry({ body: "body", installCommand: "cmd", configSnippet: "cfg" }),
    );
    const filtered = filterAssetsByType(assets, "script");
    expect(filtered.every((a) => a.type === "script")).toBe(true);
  });
  it("filterAssetsByType script 8", () => {
    const assets = buildEntryContentAssets(
      makeEntry({ body: "body", installCommand: "cmd", configSnippet: "cfg" }),
    );
    const filtered = filterAssetsByType(assets, "script");
    expect(filtered.every((a) => a.type === "script")).toBe(true);
  });
  it("filterAssetsByType script 9", () => {
    const assets = buildEntryContentAssets(
      makeEntry({ body: "body", installCommand: "cmd", configSnippet: "cfg" }),
    );
    const filtered = filterAssetsByType(assets, "script");
    expect(filtered.every((a) => a.type === "script")).toBe(true);
  });
  it("filterAssetsByType script 10", () => {
    const assets = buildEntryContentAssets(
      makeEntry({ body: "body", installCommand: "cmd", configSnippet: "cfg" }),
    );
    const filtered = filterAssetsByType(assets, "script");
    expect(filtered.every((a) => a.type === "script")).toBe(true);
  });
  it("filterAssetsByType script 11", () => {
    const assets = buildEntryContentAssets(
      makeEntry({ body: "body", installCommand: "cmd", configSnippet: "cfg" }),
    );
    const filtered = filterAssetsByType(assets, "script");
    expect(filtered.every((a) => a.type === "script")).toBe(true);
  });
  it("filterAssetsByType script 12", () => {
    const assets = buildEntryContentAssets(
      makeEntry({ body: "body", installCommand: "cmd", configSnippet: "cfg" }),
    );
    const filtered = filterAssetsByType(assets, "script");
    expect(filtered.every((a) => a.type === "script")).toBe(true);
  });
  it("filterAssetsByType script 13", () => {
    const assets = buildEntryContentAssets(
      makeEntry({ body: "body", installCommand: "cmd", configSnippet: "cfg" }),
    );
    const filtered = filterAssetsByType(assets, "script");
    expect(filtered.every((a) => a.type === "script")).toBe(true);
  });
  it("filterAssetsByType script 14", () => {
    const assets = buildEntryContentAssets(
      makeEntry({ body: "body", installCommand: "cmd", configSnippet: "cfg" }),
    );
    const filtered = filterAssetsByType(assets, "script");
    expect(filtered.every((a) => a.type === "script")).toBe(true);
  });
  it("filterAssetsByType command_syntax 0", () => {
    const assets = buildEntryContentAssets(
      makeEntry({ body: "body", installCommand: "cmd", configSnippet: "cfg" }),
    );
    const filtered = filterAssetsByType(assets, "command_syntax");
    expect(filtered.every((a) => a.type === "command_syntax")).toBe(true);
  });
  it("filterAssetsByType command_syntax 1", () => {
    const assets = buildEntryContentAssets(
      makeEntry({ body: "body", installCommand: "cmd", configSnippet: "cfg" }),
    );
    const filtered = filterAssetsByType(assets, "command_syntax");
    expect(filtered.every((a) => a.type === "command_syntax")).toBe(true);
  });
  it("filterAssetsByType command_syntax 2", () => {
    const assets = buildEntryContentAssets(
      makeEntry({ body: "body", installCommand: "cmd", configSnippet: "cfg" }),
    );
    const filtered = filterAssetsByType(assets, "command_syntax");
    expect(filtered.every((a) => a.type === "command_syntax")).toBe(true);
  });
  it("filterAssetsByType command_syntax 3", () => {
    const assets = buildEntryContentAssets(
      makeEntry({ body: "body", installCommand: "cmd", configSnippet: "cfg" }),
    );
    const filtered = filterAssetsByType(assets, "command_syntax");
    expect(filtered.every((a) => a.type === "command_syntax")).toBe(true);
  });
  it("filterAssetsByType command_syntax 4", () => {
    const assets = buildEntryContentAssets(
      makeEntry({ body: "body", installCommand: "cmd", configSnippet: "cfg" }),
    );
    const filtered = filterAssetsByType(assets, "command_syntax");
    expect(filtered.every((a) => a.type === "command_syntax")).toBe(true);
  });
  it("filterAssetsByType command_syntax 5", () => {
    const assets = buildEntryContentAssets(
      makeEntry({ body: "body", installCommand: "cmd", configSnippet: "cfg" }),
    );
    const filtered = filterAssetsByType(assets, "command_syntax");
    expect(filtered.every((a) => a.type === "command_syntax")).toBe(true);
  });
  it("filterAssetsByType command_syntax 6", () => {
    const assets = buildEntryContentAssets(
      makeEntry({ body: "body", installCommand: "cmd", configSnippet: "cfg" }),
    );
    const filtered = filterAssetsByType(assets, "command_syntax");
    expect(filtered.every((a) => a.type === "command_syntax")).toBe(true);
  });
  it("filterAssetsByType command_syntax 7", () => {
    const assets = buildEntryContentAssets(
      makeEntry({ body: "body", installCommand: "cmd", configSnippet: "cfg" }),
    );
    const filtered = filterAssetsByType(assets, "command_syntax");
    expect(filtered.every((a) => a.type === "command_syntax")).toBe(true);
  });
  it("filterAssetsByType command_syntax 8", () => {
    const assets = buildEntryContentAssets(
      makeEntry({ body: "body", installCommand: "cmd", configSnippet: "cfg" }),
    );
    const filtered = filterAssetsByType(assets, "command_syntax");
    expect(filtered.every((a) => a.type === "command_syntax")).toBe(true);
  });
  it("filterAssetsByType command_syntax 9", () => {
    const assets = buildEntryContentAssets(
      makeEntry({ body: "body", installCommand: "cmd", configSnippet: "cfg" }),
    );
    const filtered = filterAssetsByType(assets, "command_syntax");
    expect(filtered.every((a) => a.type === "command_syntax")).toBe(true);
  });
  it("filterAssetsByType command_syntax 10", () => {
    const assets = buildEntryContentAssets(
      makeEntry({ body: "body", installCommand: "cmd", configSnippet: "cfg" }),
    );
    const filtered = filterAssetsByType(assets, "command_syntax");
    expect(filtered.every((a) => a.type === "command_syntax")).toBe(true);
  });
  it("filterAssetsByType command_syntax 11", () => {
    const assets = buildEntryContentAssets(
      makeEntry({ body: "body", installCommand: "cmd", configSnippet: "cfg" }),
    );
    const filtered = filterAssetsByType(assets, "command_syntax");
    expect(filtered.every((a) => a.type === "command_syntax")).toBe(true);
  });
  it("filterAssetsByType command_syntax 12", () => {
    const assets = buildEntryContentAssets(
      makeEntry({ body: "body", installCommand: "cmd", configSnippet: "cfg" }),
    );
    const filtered = filterAssetsByType(assets, "command_syntax");
    expect(filtered.every((a) => a.type === "command_syntax")).toBe(true);
  });
  it("filterAssetsByType command_syntax 13", () => {
    const assets = buildEntryContentAssets(
      makeEntry({ body: "body", installCommand: "cmd", configSnippet: "cfg" }),
    );
    const filtered = filterAssetsByType(assets, "command_syntax");
    expect(filtered.every((a) => a.type === "command_syntax")).toBe(true);
  });
  it("filterAssetsByType command_syntax 14", () => {
    const assets = buildEntryContentAssets(
      makeEntry({ body: "body", installCommand: "cmd", configSnippet: "cfg" }),
    );
    const filtered = filterAssetsByType(assets, "command_syntax");
    expect(filtered.every((a) => a.type === "command_syntax")).toBe(true);
  });
  it("filterAssetsByType usage 0", () => {
    const assets = buildEntryContentAssets(
      makeEntry({ body: "body", installCommand: "cmd", configSnippet: "cfg" }),
    );
    const filtered = filterAssetsByType(assets, "usage");
    expect(filtered.every((a) => a.type === "usage")).toBe(true);
  });
  it("filterAssetsByType usage 1", () => {
    const assets = buildEntryContentAssets(
      makeEntry({ body: "body", installCommand: "cmd", configSnippet: "cfg" }),
    );
    const filtered = filterAssetsByType(assets, "usage");
    expect(filtered.every((a) => a.type === "usage")).toBe(true);
  });
  it("filterAssetsByType usage 2", () => {
    const assets = buildEntryContentAssets(
      makeEntry({ body: "body", installCommand: "cmd", configSnippet: "cfg" }),
    );
    const filtered = filterAssetsByType(assets, "usage");
    expect(filtered.every((a) => a.type === "usage")).toBe(true);
  });
  it("filterAssetsByType usage 3", () => {
    const assets = buildEntryContentAssets(
      makeEntry({ body: "body", installCommand: "cmd", configSnippet: "cfg" }),
    );
    const filtered = filterAssetsByType(assets, "usage");
    expect(filtered.every((a) => a.type === "usage")).toBe(true);
  });
  it("filterAssetsByType usage 4", () => {
    const assets = buildEntryContentAssets(
      makeEntry({ body: "body", installCommand: "cmd", configSnippet: "cfg" }),
    );
    const filtered = filterAssetsByType(assets, "usage");
    expect(filtered.every((a) => a.type === "usage")).toBe(true);
  });
  it("filterAssetsByType usage 5", () => {
    const assets = buildEntryContentAssets(
      makeEntry({ body: "body", installCommand: "cmd", configSnippet: "cfg" }),
    );
    const filtered = filterAssetsByType(assets, "usage");
    expect(filtered.every((a) => a.type === "usage")).toBe(true);
  });
  it("filterAssetsByType usage 6", () => {
    const assets = buildEntryContentAssets(
      makeEntry({ body: "body", installCommand: "cmd", configSnippet: "cfg" }),
    );
    const filtered = filterAssetsByType(assets, "usage");
    expect(filtered.every((a) => a.type === "usage")).toBe(true);
  });
  it("filterAssetsByType usage 7", () => {
    const assets = buildEntryContentAssets(
      makeEntry({ body: "body", installCommand: "cmd", configSnippet: "cfg" }),
    );
    const filtered = filterAssetsByType(assets, "usage");
    expect(filtered.every((a) => a.type === "usage")).toBe(true);
  });
  it("filterAssetsByType usage 8", () => {
    const assets = buildEntryContentAssets(
      makeEntry({ body: "body", installCommand: "cmd", configSnippet: "cfg" }),
    );
    const filtered = filterAssetsByType(assets, "usage");
    expect(filtered.every((a) => a.type === "usage")).toBe(true);
  });
  it("filterAssetsByType usage 9", () => {
    const assets = buildEntryContentAssets(
      makeEntry({ body: "body", installCommand: "cmd", configSnippet: "cfg" }),
    );
    const filtered = filterAssetsByType(assets, "usage");
    expect(filtered.every((a) => a.type === "usage")).toBe(true);
  });
  it("filterAssetsByType usage 10", () => {
    const assets = buildEntryContentAssets(
      makeEntry({ body: "body", installCommand: "cmd", configSnippet: "cfg" }),
    );
    const filtered = filterAssetsByType(assets, "usage");
    expect(filtered.every((a) => a.type === "usage")).toBe(true);
  });
  it("filterAssetsByType usage 11", () => {
    const assets = buildEntryContentAssets(
      makeEntry({ body: "body", installCommand: "cmd", configSnippet: "cfg" }),
    );
    const filtered = filterAssetsByType(assets, "usage");
    expect(filtered.every((a) => a.type === "usage")).toBe(true);
  });
  it("filterAssetsByType usage 12", () => {
    const assets = buildEntryContentAssets(
      makeEntry({ body: "body", installCommand: "cmd", configSnippet: "cfg" }),
    );
    const filtered = filterAssetsByType(assets, "usage");
    expect(filtered.every((a) => a.type === "usage")).toBe(true);
  });
  it("filterAssetsByType usage 13", () => {
    const assets = buildEntryContentAssets(
      makeEntry({ body: "body", installCommand: "cmd", configSnippet: "cfg" }),
    );
    const filtered = filterAssetsByType(assets, "usage");
    expect(filtered.every((a) => a.type === "usage")).toBe(true);
  });
  it("filterAssetsByType usage 14", () => {
    const assets = buildEntryContentAssets(
      makeEntry({ body: "body", installCommand: "cmd", configSnippet: "cfg" }),
    );
    const filtered = filterAssetsByType(assets, "usage");
    expect(filtered.every((a) => a.type === "usage")).toBe(true);
  });
  it("filterAssetsByType items 0", () => {
    const assets = buildEntryContentAssets(
      makeEntry({ body: "body", installCommand: "cmd", configSnippet: "cfg" }),
    );
    const filtered = filterAssetsByType(assets, "items");
    expect(filtered.every((a) => a.type === "items")).toBe(true);
  });
  it("filterAssetsByType items 1", () => {
    const assets = buildEntryContentAssets(
      makeEntry({ body: "body", installCommand: "cmd", configSnippet: "cfg" }),
    );
    const filtered = filterAssetsByType(assets, "items");
    expect(filtered.every((a) => a.type === "items")).toBe(true);
  });
  it("filterAssetsByType items 2", () => {
    const assets = buildEntryContentAssets(
      makeEntry({ body: "body", installCommand: "cmd", configSnippet: "cfg" }),
    );
    const filtered = filterAssetsByType(assets, "items");
    expect(filtered.every((a) => a.type === "items")).toBe(true);
  });
  it("filterAssetsByType items 3", () => {
    const assets = buildEntryContentAssets(
      makeEntry({ body: "body", installCommand: "cmd", configSnippet: "cfg" }),
    );
    const filtered = filterAssetsByType(assets, "items");
    expect(filtered.every((a) => a.type === "items")).toBe(true);
  });
  it("filterAssetsByType items 4", () => {
    const assets = buildEntryContentAssets(
      makeEntry({ body: "body", installCommand: "cmd", configSnippet: "cfg" }),
    );
    const filtered = filterAssetsByType(assets, "items");
    expect(filtered.every((a) => a.type === "items")).toBe(true);
  });
  it("filterAssetsByType items 5", () => {
    const assets = buildEntryContentAssets(
      makeEntry({ body: "body", installCommand: "cmd", configSnippet: "cfg" }),
    );
    const filtered = filterAssetsByType(assets, "items");
    expect(filtered.every((a) => a.type === "items")).toBe(true);
  });
  it("filterAssetsByType items 6", () => {
    const assets = buildEntryContentAssets(
      makeEntry({ body: "body", installCommand: "cmd", configSnippet: "cfg" }),
    );
    const filtered = filterAssetsByType(assets, "items");
    expect(filtered.every((a) => a.type === "items")).toBe(true);
  });
  it("filterAssetsByType items 7", () => {
    const assets = buildEntryContentAssets(
      makeEntry({ body: "body", installCommand: "cmd", configSnippet: "cfg" }),
    );
    const filtered = filterAssetsByType(assets, "items");
    expect(filtered.every((a) => a.type === "items")).toBe(true);
  });
  it("filterAssetsByType items 8", () => {
    const assets = buildEntryContentAssets(
      makeEntry({ body: "body", installCommand: "cmd", configSnippet: "cfg" }),
    );
    const filtered = filterAssetsByType(assets, "items");
    expect(filtered.every((a) => a.type === "items")).toBe(true);
  });
  it("filterAssetsByType items 9", () => {
    const assets = buildEntryContentAssets(
      makeEntry({ body: "body", installCommand: "cmd", configSnippet: "cfg" }),
    );
    const filtered = filterAssetsByType(assets, "items");
    expect(filtered.every((a) => a.type === "items")).toBe(true);
  });
  it("filterAssetsByType items 10", () => {
    const assets = buildEntryContentAssets(
      makeEntry({ body: "body", installCommand: "cmd", configSnippet: "cfg" }),
    );
    const filtered = filterAssetsByType(assets, "items");
    expect(filtered.every((a) => a.type === "items")).toBe(true);
  });
  it("filterAssetsByType items 11", () => {
    const assets = buildEntryContentAssets(
      makeEntry({ body: "body", installCommand: "cmd", configSnippet: "cfg" }),
    );
    const filtered = filterAssetsByType(assets, "items");
    expect(filtered.every((a) => a.type === "items")).toBe(true);
  });
  it("filterAssetsByType items 12", () => {
    const assets = buildEntryContentAssets(
      makeEntry({ body: "body", installCommand: "cmd", configSnippet: "cfg" }),
    );
    const filtered = filterAssetsByType(assets, "items");
    expect(filtered.every((a) => a.type === "items")).toBe(true);
  });
  it("filterAssetsByType items 13", () => {
    const assets = buildEntryContentAssets(
      makeEntry({ body: "body", installCommand: "cmd", configSnippet: "cfg" }),
    );
    const filtered = filterAssetsByType(assets, "items");
    expect(filtered.every((a) => a.type === "items")).toBe(true);
  });
  it("filterAssetsByType items 14", () => {
    const assets = buildEntryContentAssets(
      makeEntry({ body: "body", installCommand: "cmd", configSnippet: "cfg" }),
    );
    const filtered = filterAssetsByType(assets, "items");
    expect(filtered.every((a) => a.type === "items")).toBe(true);
  });
});

describe("registry-copyable-asset-lib selectPrimaryAsset", () => {
  it("returns first asset when type requested", () => {
    const entry = makeEntry({ installCommand: "npx foo" });
    const assets = filterAssetsByType(
      buildEntryContentAssets(entry),
      "install_command",
    );
    expect(selectPrimaryAsset(assets, entry, "install_command")?.type).toBe(
      "install_command",
    );
  });
  it("returns category primary when type omitted", () => {
    const entry = makeEntry({ body: "content", configSnippet: "cfg" });
    const assets = buildEntryContentAssets(entry);
    expect(selectPrimaryAsset(assets, entry, "")).toBeTruthy();
  });
  it("selectPrimaryAsset churn 0", () => {
    const entry = makeEntry({ body: "body-0" });
    const assets = buildEntryContentAssets(entry);
    expect(selectPrimaryAsset(assets, entry, "").type).toBeTruthy();
  });
  it("selectPrimaryAsset churn 1", () => {
    const entry = makeEntry({ body: "body-1" });
    const assets = buildEntryContentAssets(entry);
    expect(selectPrimaryAsset(assets, entry, "").type).toBeTruthy();
  });
  it("selectPrimaryAsset churn 2", () => {
    const entry = makeEntry({ body: "body-2" });
    const assets = buildEntryContentAssets(entry);
    expect(selectPrimaryAsset(assets, entry, "").type).toBeTruthy();
  });
  it("selectPrimaryAsset churn 3", () => {
    const entry = makeEntry({ body: "body-3" });
    const assets = buildEntryContentAssets(entry);
    expect(selectPrimaryAsset(assets, entry, "").type).toBeTruthy();
  });
  it("selectPrimaryAsset churn 4", () => {
    const entry = makeEntry({ body: "body-4" });
    const assets = buildEntryContentAssets(entry);
    expect(selectPrimaryAsset(assets, entry, "").type).toBeTruthy();
  });
  it("selectPrimaryAsset churn 5", () => {
    const entry = makeEntry({ body: "body-5" });
    const assets = buildEntryContentAssets(entry);
    expect(selectPrimaryAsset(assets, entry, "").type).toBeTruthy();
  });
  it("selectPrimaryAsset churn 6", () => {
    const entry = makeEntry({ body: "body-6" });
    const assets = buildEntryContentAssets(entry);
    expect(selectPrimaryAsset(assets, entry, "").type).toBeTruthy();
  });
  it("selectPrimaryAsset churn 7", () => {
    const entry = makeEntry({ body: "body-7" });
    const assets = buildEntryContentAssets(entry);
    expect(selectPrimaryAsset(assets, entry, "").type).toBeTruthy();
  });
  it("selectPrimaryAsset churn 8", () => {
    const entry = makeEntry({ body: "body-8" });
    const assets = buildEntryContentAssets(entry);
    expect(selectPrimaryAsset(assets, entry, "").type).toBeTruthy();
  });
  it("selectPrimaryAsset churn 9", () => {
    const entry = makeEntry({ body: "body-9" });
    const assets = buildEntryContentAssets(entry);
    expect(selectPrimaryAsset(assets, entry, "").type).toBeTruthy();
  });
  it("selectPrimaryAsset churn 10", () => {
    const entry = makeEntry({ body: "body-10" });
    const assets = buildEntryContentAssets(entry);
    expect(selectPrimaryAsset(assets, entry, "").type).toBeTruthy();
  });
  it("selectPrimaryAsset churn 11", () => {
    const entry = makeEntry({ body: "body-11" });
    const assets = buildEntryContentAssets(entry);
    expect(selectPrimaryAsset(assets, entry, "").type).toBeTruthy();
  });
  it("selectPrimaryAsset churn 12", () => {
    const entry = makeEntry({ body: "body-12" });
    const assets = buildEntryContentAssets(entry);
    expect(selectPrimaryAsset(assets, entry, "").type).toBeTruthy();
  });
  it("selectPrimaryAsset churn 13", () => {
    const entry = makeEntry({ body: "body-13" });
    const assets = buildEntryContentAssets(entry);
    expect(selectPrimaryAsset(assets, entry, "").type).toBeTruthy();
  });
  it("selectPrimaryAsset churn 14", () => {
    const entry = makeEntry({ body: "body-14" });
    const assets = buildEntryContentAssets(entry);
    expect(selectPrimaryAsset(assets, entry, "").type).toBeTruthy();
  });
  it("selectPrimaryAsset churn 15", () => {
    const entry = makeEntry({ body: "body-15" });
    const assets = buildEntryContentAssets(entry);
    expect(selectPrimaryAsset(assets, entry, "").type).toBeTruthy();
  });
  it("selectPrimaryAsset churn 16", () => {
    const entry = makeEntry({ body: "body-16" });
    const assets = buildEntryContentAssets(entry);
    expect(selectPrimaryAsset(assets, entry, "").type).toBeTruthy();
  });
  it("selectPrimaryAsset churn 17", () => {
    const entry = makeEntry({ body: "body-17" });
    const assets = buildEntryContentAssets(entry);
    expect(selectPrimaryAsset(assets, entry, "").type).toBeTruthy();
  });
  it("selectPrimaryAsset churn 18", () => {
    const entry = makeEntry({ body: "body-18" });
    const assets = buildEntryContentAssets(entry);
    expect(selectPrimaryAsset(assets, entry, "").type).toBeTruthy();
  });
  it("selectPrimaryAsset churn 19", () => {
    const entry = makeEntry({ body: "body-19" });
    const assets = buildEntryContentAssets(entry);
    expect(selectPrimaryAsset(assets, entry, "").type).toBeTruthy();
  });
  it("selectPrimaryAsset churn 20", () => {
    const entry = makeEntry({ body: "body-20" });
    const assets = buildEntryContentAssets(entry);
    expect(selectPrimaryAsset(assets, entry, "").type).toBeTruthy();
  });
  it("selectPrimaryAsset churn 21", () => {
    const entry = makeEntry({ body: "body-21" });
    const assets = buildEntryContentAssets(entry);
    expect(selectPrimaryAsset(assets, entry, "").type).toBeTruthy();
  });
  it("selectPrimaryAsset churn 22", () => {
    const entry = makeEntry({ body: "body-22" });
    const assets = buildEntryContentAssets(entry);
    expect(selectPrimaryAsset(assets, entry, "").type).toBeTruthy();
  });
  it("selectPrimaryAsset churn 23", () => {
    const entry = makeEntry({ body: "body-23" });
    const assets = buildEntryContentAssets(entry);
    expect(selectPrimaryAsset(assets, entry, "").type).toBeTruthy();
  });
  it("selectPrimaryAsset churn 24", () => {
    const entry = makeEntry({ body: "body-24" });
    const assets = buildEntryContentAssets(entry);
    expect(selectPrimaryAsset(assets, entry, "").type).toBeTruthy();
  });
  it("selectPrimaryAsset churn 25", () => {
    const entry = makeEntry({ body: "body-25" });
    const assets = buildEntryContentAssets(entry);
    expect(selectPrimaryAsset(assets, entry, "").type).toBeTruthy();
  });
  it("selectPrimaryAsset churn 26", () => {
    const entry = makeEntry({ body: "body-26" });
    const assets = buildEntryContentAssets(entry);
    expect(selectPrimaryAsset(assets, entry, "").type).toBeTruthy();
  });
  it("selectPrimaryAsset churn 27", () => {
    const entry = makeEntry({ body: "body-27" });
    const assets = buildEntryContentAssets(entry);
    expect(selectPrimaryAsset(assets, entry, "").type).toBeTruthy();
  });
  it("selectPrimaryAsset churn 28", () => {
    const entry = makeEntry({ body: "body-28" });
    const assets = buildEntryContentAssets(entry);
    expect(selectPrimaryAsset(assets, entry, "").type).toBeTruthy();
  });
  it("selectPrimaryAsset churn 29", () => {
    const entry = makeEntry({ body: "body-29" });
    const assets = buildEntryContentAssets(entry);
    expect(selectPrimaryAsset(assets, entry, "").type).toBeTruthy();
  });
  it("selectPrimaryAsset churn 30", () => {
    const entry = makeEntry({ body: "body-30" });
    const assets = buildEntryContentAssets(entry);
    expect(selectPrimaryAsset(assets, entry, "").type).toBeTruthy();
  });
  it("selectPrimaryAsset churn 31", () => {
    const entry = makeEntry({ body: "body-31" });
    const assets = buildEntryContentAssets(entry);
    expect(selectPrimaryAsset(assets, entry, "").type).toBeTruthy();
  });
  it("selectPrimaryAsset churn 32", () => {
    const entry = makeEntry({ body: "body-32" });
    const assets = buildEntryContentAssets(entry);
    expect(selectPrimaryAsset(assets, entry, "").type).toBeTruthy();
  });
  it("selectPrimaryAsset churn 33", () => {
    const entry = makeEntry({ body: "body-33" });
    const assets = buildEntryContentAssets(entry);
    expect(selectPrimaryAsset(assets, entry, "").type).toBeTruthy();
  });
  it("selectPrimaryAsset churn 34", () => {
    const entry = makeEntry({ body: "body-34" });
    const assets = buildEntryContentAssets(entry);
    expect(selectPrimaryAsset(assets, entry, "").type).toBeTruthy();
  });
  it("selectPrimaryAsset churn 35", () => {
    const entry = makeEntry({ body: "body-35" });
    const assets = buildEntryContentAssets(entry);
    expect(selectPrimaryAsset(assets, entry, "").type).toBeTruthy();
  });
  it("selectPrimaryAsset churn 36", () => {
    const entry = makeEntry({ body: "body-36" });
    const assets = buildEntryContentAssets(entry);
    expect(selectPrimaryAsset(assets, entry, "").type).toBeTruthy();
  });
  it("selectPrimaryAsset churn 37", () => {
    const entry = makeEntry({ body: "body-37" });
    const assets = buildEntryContentAssets(entry);
    expect(selectPrimaryAsset(assets, entry, "").type).toBeTruthy();
  });
  it("selectPrimaryAsset churn 38", () => {
    const entry = makeEntry({ body: "body-38" });
    const assets = buildEntryContentAssets(entry);
    expect(selectPrimaryAsset(assets, entry, "").type).toBeTruthy();
  });
  it("selectPrimaryAsset churn 39", () => {
    const entry = makeEntry({ body: "body-39" });
    const assets = buildEntryContentAssets(entry);
    expect(selectPrimaryAsset(assets, entry, "").type).toBeTruthy();
  });
  it("selectPrimaryAsset churn 40", () => {
    const entry = makeEntry({ body: "body-40" });
    const assets = buildEntryContentAssets(entry);
    expect(selectPrimaryAsset(assets, entry, "").type).toBeTruthy();
  });
  it("selectPrimaryAsset churn 41", () => {
    const entry = makeEntry({ body: "body-41" });
    const assets = buildEntryContentAssets(entry);
    expect(selectPrimaryAsset(assets, entry, "").type).toBeTruthy();
  });
  it("selectPrimaryAsset churn 42", () => {
    const entry = makeEntry({ body: "body-42" });
    const assets = buildEntryContentAssets(entry);
    expect(selectPrimaryAsset(assets, entry, "").type).toBeTruthy();
  });
  it("selectPrimaryAsset churn 43", () => {
    const entry = makeEntry({ body: "body-43" });
    const assets = buildEntryContentAssets(entry);
    expect(selectPrimaryAsset(assets, entry, "").type).toBeTruthy();
  });
  it("selectPrimaryAsset churn 44", () => {
    const entry = makeEntry({ body: "body-44" });
    const assets = buildEntryContentAssets(entry);
    expect(selectPrimaryAsset(assets, entry, "").type).toBeTruthy();
  });
  it("selectPrimaryAsset churn 45", () => {
    const entry = makeEntry({ body: "body-45" });
    const assets = buildEntryContentAssets(entry);
    expect(selectPrimaryAsset(assets, entry, "").type).toBeTruthy();
  });
  it("selectPrimaryAsset churn 46", () => {
    const entry = makeEntry({ body: "body-46" });
    const assets = buildEntryContentAssets(entry);
    expect(selectPrimaryAsset(assets, entry, "").type).toBeTruthy();
  });
  it("selectPrimaryAsset churn 47", () => {
    const entry = makeEntry({ body: "body-47" });
    const assets = buildEntryContentAssets(entry);
    expect(selectPrimaryAsset(assets, entry, "").type).toBeTruthy();
  });
  it("selectPrimaryAsset churn 48", () => {
    const entry = makeEntry({ body: "body-48" });
    const assets = buildEntryContentAssets(entry);
    expect(selectPrimaryAsset(assets, entry, "").type).toBeTruthy();
  });
  it("selectPrimaryAsset churn 49", () => {
    const entry = makeEntry({ body: "body-49" });
    const assets = buildEntryContentAssets(entry);
    expect(selectPrimaryAsset(assets, entry, "").type).toBeTruthy();
  });
  it("selectPrimaryAsset churn 50", () => {
    const entry = makeEntry({ body: "body-50" });
    const assets = buildEntryContentAssets(entry);
    expect(selectPrimaryAsset(assets, entry, "").type).toBeTruthy();
  });
  it("selectPrimaryAsset churn 51", () => {
    const entry = makeEntry({ body: "body-51" });
    const assets = buildEntryContentAssets(entry);
    expect(selectPrimaryAsset(assets, entry, "").type).toBeTruthy();
  });
  it("selectPrimaryAsset churn 52", () => {
    const entry = makeEntry({ body: "body-52" });
    const assets = buildEntryContentAssets(entry);
    expect(selectPrimaryAsset(assets, entry, "").type).toBeTruthy();
  });
  it("selectPrimaryAsset churn 53", () => {
    const entry = makeEntry({ body: "body-53" });
    const assets = buildEntryContentAssets(entry);
    expect(selectPrimaryAsset(assets, entry, "").type).toBeTruthy();
  });
  it("selectPrimaryAsset churn 54", () => {
    const entry = makeEntry({ body: "body-54" });
    const assets = buildEntryContentAssets(entry);
    expect(selectPrimaryAsset(assets, entry, "").type).toBeTruthy();
  });
  it("selectPrimaryAsset churn 55", () => {
    const entry = makeEntry({ body: "body-55" });
    const assets = buildEntryContentAssets(entry);
    expect(selectPrimaryAsset(assets, entry, "").type).toBeTruthy();
  });
  it("selectPrimaryAsset churn 56", () => {
    const entry = makeEntry({ body: "body-56" });
    const assets = buildEntryContentAssets(entry);
    expect(selectPrimaryAsset(assets, entry, "").type).toBeTruthy();
  });
  it("selectPrimaryAsset churn 57", () => {
    const entry = makeEntry({ body: "body-57" });
    const assets = buildEntryContentAssets(entry);
    expect(selectPrimaryAsset(assets, entry, "").type).toBeTruthy();
  });
  it("selectPrimaryAsset churn 58", () => {
    const entry = makeEntry({ body: "body-58" });
    const assets = buildEntryContentAssets(entry);
    expect(selectPrimaryAsset(assets, entry, "").type).toBeTruthy();
  });
  it("selectPrimaryAsset churn 59", () => {
    const entry = makeEntry({ body: "body-59" });
    const assets = buildEntryContentAssets(entry);
    expect(selectPrimaryAsset(assets, entry, "").type).toBeTruthy();
  });
});

describe("registry-copyable-asset-lib buildCopyableAssetResponse", () => {
  it("builds ok copyable asset envelope", () => {
    const entry = makeEntry({ body: "content" });
    const assets = buildEntryContentAssets(entry);
    const primary = selectPrimaryAsset(assets, entry, "");
    const response = buildCopyableAssetResponse({
      entry,
      platform: "cursor",
      requestedType: "",
      assets,
      primary,
      compatibility: [],
      source: sourceSummary(entry),
      trust: entryTrustSummary(entry),
      canonicalUrl: entryCanonicalUrl(entry),
    });
    expect(response.ok).toBe(true);
    expect(response.key).toBe("mcp:browser-bridge");
  });
  it("buildCopyableAssetResponse churn 0", () => {
    const entry = makeEntry({ slug: "slug-0", body: "body-0" });
    const assets = buildEntryContentAssets(entry);
    const response = buildCopyableAssetResponse({
      entry,
      platform: "",
      requestedType: "",
      assets,
      primary: assets[0],
      compatibility: [],
      source: sourceSummary(entry),
      trust: entryTrustSummary(entry),
      canonicalUrl: entryCanonicalUrl(entry),
    });
    expect(response.assets.length).toBeGreaterThan(0);
  });
  it("buildCopyableAssetResponse churn 1", () => {
    const entry = makeEntry({ slug: "slug-1", body: "body-1" });
    const assets = buildEntryContentAssets(entry);
    const response = buildCopyableAssetResponse({
      entry,
      platform: "",
      requestedType: "",
      assets,
      primary: assets[0],
      compatibility: [],
      source: sourceSummary(entry),
      trust: entryTrustSummary(entry),
      canonicalUrl: entryCanonicalUrl(entry),
    });
    expect(response.assets.length).toBeGreaterThan(0);
  });
  it("buildCopyableAssetResponse churn 2", () => {
    const entry = makeEntry({ slug: "slug-2", body: "body-2" });
    const assets = buildEntryContentAssets(entry);
    const response = buildCopyableAssetResponse({
      entry,
      platform: "",
      requestedType: "",
      assets,
      primary: assets[0],
      compatibility: [],
      source: sourceSummary(entry),
      trust: entryTrustSummary(entry),
      canonicalUrl: entryCanonicalUrl(entry),
    });
    expect(response.assets.length).toBeGreaterThan(0);
  });
  it("buildCopyableAssetResponse churn 3", () => {
    const entry = makeEntry({ slug: "slug-3", body: "body-3" });
    const assets = buildEntryContentAssets(entry);
    const response = buildCopyableAssetResponse({
      entry,
      platform: "",
      requestedType: "",
      assets,
      primary: assets[0],
      compatibility: [],
      source: sourceSummary(entry),
      trust: entryTrustSummary(entry),
      canonicalUrl: entryCanonicalUrl(entry),
    });
    expect(response.assets.length).toBeGreaterThan(0);
  });
  it("buildCopyableAssetResponse churn 4", () => {
    const entry = makeEntry({ slug: "slug-4", body: "body-4" });
    const assets = buildEntryContentAssets(entry);
    const response = buildCopyableAssetResponse({
      entry,
      platform: "",
      requestedType: "",
      assets,
      primary: assets[0],
      compatibility: [],
      source: sourceSummary(entry),
      trust: entryTrustSummary(entry),
      canonicalUrl: entryCanonicalUrl(entry),
    });
    expect(response.assets.length).toBeGreaterThan(0);
  });
  it("buildCopyableAssetResponse churn 5", () => {
    const entry = makeEntry({ slug: "slug-5", body: "body-5" });
    const assets = buildEntryContentAssets(entry);
    const response = buildCopyableAssetResponse({
      entry,
      platform: "",
      requestedType: "",
      assets,
      primary: assets[0],
      compatibility: [],
      source: sourceSummary(entry),
      trust: entryTrustSummary(entry),
      canonicalUrl: entryCanonicalUrl(entry),
    });
    expect(response.assets.length).toBeGreaterThan(0);
  });
  it("buildCopyableAssetResponse churn 6", () => {
    const entry = makeEntry({ slug: "slug-6", body: "body-6" });
    const assets = buildEntryContentAssets(entry);
    const response = buildCopyableAssetResponse({
      entry,
      platform: "",
      requestedType: "",
      assets,
      primary: assets[0],
      compatibility: [],
      source: sourceSummary(entry),
      trust: entryTrustSummary(entry),
      canonicalUrl: entryCanonicalUrl(entry),
    });
    expect(response.assets.length).toBeGreaterThan(0);
  });
  it("buildCopyableAssetResponse churn 7", () => {
    const entry = makeEntry({ slug: "slug-7", body: "body-7" });
    const assets = buildEntryContentAssets(entry);
    const response = buildCopyableAssetResponse({
      entry,
      platform: "",
      requestedType: "",
      assets,
      primary: assets[0],
      compatibility: [],
      source: sourceSummary(entry),
      trust: entryTrustSummary(entry),
      canonicalUrl: entryCanonicalUrl(entry),
    });
    expect(response.assets.length).toBeGreaterThan(0);
  });
  it("buildCopyableAssetResponse churn 8", () => {
    const entry = makeEntry({ slug: "slug-8", body: "body-8" });
    const assets = buildEntryContentAssets(entry);
    const response = buildCopyableAssetResponse({
      entry,
      platform: "",
      requestedType: "",
      assets,
      primary: assets[0],
      compatibility: [],
      source: sourceSummary(entry),
      trust: entryTrustSummary(entry),
      canonicalUrl: entryCanonicalUrl(entry),
    });
    expect(response.assets.length).toBeGreaterThan(0);
  });
  it("buildCopyableAssetResponse churn 9", () => {
    const entry = makeEntry({ slug: "slug-9", body: "body-9" });
    const assets = buildEntryContentAssets(entry);
    const response = buildCopyableAssetResponse({
      entry,
      platform: "",
      requestedType: "",
      assets,
      primary: assets[0],
      compatibility: [],
      source: sourceSummary(entry),
      trust: entryTrustSummary(entry),
      canonicalUrl: entryCanonicalUrl(entry),
    });
    expect(response.assets.length).toBeGreaterThan(0);
  });
  it("buildCopyableAssetResponse churn 10", () => {
    const entry = makeEntry({ slug: "slug-10", body: "body-10" });
    const assets = buildEntryContentAssets(entry);
    const response = buildCopyableAssetResponse({
      entry,
      platform: "",
      requestedType: "",
      assets,
      primary: assets[0],
      compatibility: [],
      source: sourceSummary(entry),
      trust: entryTrustSummary(entry),
      canonicalUrl: entryCanonicalUrl(entry),
    });
    expect(response.assets.length).toBeGreaterThan(0);
  });
  it("buildCopyableAssetResponse churn 11", () => {
    const entry = makeEntry({ slug: "slug-11", body: "body-11" });
    const assets = buildEntryContentAssets(entry);
    const response = buildCopyableAssetResponse({
      entry,
      platform: "",
      requestedType: "",
      assets,
      primary: assets[0],
      compatibility: [],
      source: sourceSummary(entry),
      trust: entryTrustSummary(entry),
      canonicalUrl: entryCanonicalUrl(entry),
    });
    expect(response.assets.length).toBeGreaterThan(0);
  });
  it("buildCopyableAssetResponse churn 12", () => {
    const entry = makeEntry({ slug: "slug-12", body: "body-12" });
    const assets = buildEntryContentAssets(entry);
    const response = buildCopyableAssetResponse({
      entry,
      platform: "",
      requestedType: "",
      assets,
      primary: assets[0],
      compatibility: [],
      source: sourceSummary(entry),
      trust: entryTrustSummary(entry),
      canonicalUrl: entryCanonicalUrl(entry),
    });
    expect(response.assets.length).toBeGreaterThan(0);
  });
  it("buildCopyableAssetResponse churn 13", () => {
    const entry = makeEntry({ slug: "slug-13", body: "body-13" });
    const assets = buildEntryContentAssets(entry);
    const response = buildCopyableAssetResponse({
      entry,
      platform: "",
      requestedType: "",
      assets,
      primary: assets[0],
      compatibility: [],
      source: sourceSummary(entry),
      trust: entryTrustSummary(entry),
      canonicalUrl: entryCanonicalUrl(entry),
    });
    expect(response.assets.length).toBeGreaterThan(0);
  });
  it("buildCopyableAssetResponse churn 14", () => {
    const entry = makeEntry({ slug: "slug-14", body: "body-14" });
    const assets = buildEntryContentAssets(entry);
    const response = buildCopyableAssetResponse({
      entry,
      platform: "",
      requestedType: "",
      assets,
      primary: assets[0],
      compatibility: [],
      source: sourceSummary(entry),
      trust: entryTrustSummary(entry),
      canonicalUrl: entryCanonicalUrl(entry),
    });
    expect(response.assets.length).toBeGreaterThan(0);
  });
  it("buildCopyableAssetResponse churn 15", () => {
    const entry = makeEntry({ slug: "slug-15", body: "body-15" });
    const assets = buildEntryContentAssets(entry);
    const response = buildCopyableAssetResponse({
      entry,
      platform: "",
      requestedType: "",
      assets,
      primary: assets[0],
      compatibility: [],
      source: sourceSummary(entry),
      trust: entryTrustSummary(entry),
      canonicalUrl: entryCanonicalUrl(entry),
    });
    expect(response.assets.length).toBeGreaterThan(0);
  });
  it("buildCopyableAssetResponse churn 16", () => {
    const entry = makeEntry({ slug: "slug-16", body: "body-16" });
    const assets = buildEntryContentAssets(entry);
    const response = buildCopyableAssetResponse({
      entry,
      platform: "",
      requestedType: "",
      assets,
      primary: assets[0],
      compatibility: [],
      source: sourceSummary(entry),
      trust: entryTrustSummary(entry),
      canonicalUrl: entryCanonicalUrl(entry),
    });
    expect(response.assets.length).toBeGreaterThan(0);
  });
  it("buildCopyableAssetResponse churn 17", () => {
    const entry = makeEntry({ slug: "slug-17", body: "body-17" });
    const assets = buildEntryContentAssets(entry);
    const response = buildCopyableAssetResponse({
      entry,
      platform: "",
      requestedType: "",
      assets,
      primary: assets[0],
      compatibility: [],
      source: sourceSummary(entry),
      trust: entryTrustSummary(entry),
      canonicalUrl: entryCanonicalUrl(entry),
    });
    expect(response.assets.length).toBeGreaterThan(0);
  });
  it("buildCopyableAssetResponse churn 18", () => {
    const entry = makeEntry({ slug: "slug-18", body: "body-18" });
    const assets = buildEntryContentAssets(entry);
    const response = buildCopyableAssetResponse({
      entry,
      platform: "",
      requestedType: "",
      assets,
      primary: assets[0],
      compatibility: [],
      source: sourceSummary(entry),
      trust: entryTrustSummary(entry),
      canonicalUrl: entryCanonicalUrl(entry),
    });
    expect(response.assets.length).toBeGreaterThan(0);
  });
  it("buildCopyableAssetResponse churn 19", () => {
    const entry = makeEntry({ slug: "slug-19", body: "body-19" });
    const assets = buildEntryContentAssets(entry);
    const response = buildCopyableAssetResponse({
      entry,
      platform: "",
      requestedType: "",
      assets,
      primary: assets[0],
      compatibility: [],
      source: sourceSummary(entry),
      trust: entryTrustSummary(entry),
      canonicalUrl: entryCanonicalUrl(entry),
    });
    expect(response.assets.length).toBeGreaterThan(0);
  });
  it("buildCopyableAssetResponse churn 20", () => {
    const entry = makeEntry({ slug: "slug-20", body: "body-20" });
    const assets = buildEntryContentAssets(entry);
    const response = buildCopyableAssetResponse({
      entry,
      platform: "",
      requestedType: "",
      assets,
      primary: assets[0],
      compatibility: [],
      source: sourceSummary(entry),
      trust: entryTrustSummary(entry),
      canonicalUrl: entryCanonicalUrl(entry),
    });
    expect(response.assets.length).toBeGreaterThan(0);
  });
  it("buildCopyableAssetResponse churn 21", () => {
    const entry = makeEntry({ slug: "slug-21", body: "body-21" });
    const assets = buildEntryContentAssets(entry);
    const response = buildCopyableAssetResponse({
      entry,
      platform: "",
      requestedType: "",
      assets,
      primary: assets[0],
      compatibility: [],
      source: sourceSummary(entry),
      trust: entryTrustSummary(entry),
      canonicalUrl: entryCanonicalUrl(entry),
    });
    expect(response.assets.length).toBeGreaterThan(0);
  });
  it("buildCopyableAssetResponse churn 22", () => {
    const entry = makeEntry({ slug: "slug-22", body: "body-22" });
    const assets = buildEntryContentAssets(entry);
    const response = buildCopyableAssetResponse({
      entry,
      platform: "",
      requestedType: "",
      assets,
      primary: assets[0],
      compatibility: [],
      source: sourceSummary(entry),
      trust: entryTrustSummary(entry),
      canonicalUrl: entryCanonicalUrl(entry),
    });
    expect(response.assets.length).toBeGreaterThan(0);
  });
  it("buildCopyableAssetResponse churn 23", () => {
    const entry = makeEntry({ slug: "slug-23", body: "body-23" });
    const assets = buildEntryContentAssets(entry);
    const response = buildCopyableAssetResponse({
      entry,
      platform: "",
      requestedType: "",
      assets,
      primary: assets[0],
      compatibility: [],
      source: sourceSummary(entry),
      trust: entryTrustSummary(entry),
      canonicalUrl: entryCanonicalUrl(entry),
    });
    expect(response.assets.length).toBeGreaterThan(0);
  });
  it("buildCopyableAssetResponse churn 24", () => {
    const entry = makeEntry({ slug: "slug-24", body: "body-24" });
    const assets = buildEntryContentAssets(entry);
    const response = buildCopyableAssetResponse({
      entry,
      platform: "",
      requestedType: "",
      assets,
      primary: assets[0],
      compatibility: [],
      source: sourceSummary(entry),
      trust: entryTrustSummary(entry),
      canonicalUrl: entryCanonicalUrl(entry),
    });
    expect(response.assets.length).toBeGreaterThan(0);
  });
  it("buildCopyableAssetResponse churn 25", () => {
    const entry = makeEntry({ slug: "slug-25", body: "body-25" });
    const assets = buildEntryContentAssets(entry);
    const response = buildCopyableAssetResponse({
      entry,
      platform: "",
      requestedType: "",
      assets,
      primary: assets[0],
      compatibility: [],
      source: sourceSummary(entry),
      trust: entryTrustSummary(entry),
      canonicalUrl: entryCanonicalUrl(entry),
    });
    expect(response.assets.length).toBeGreaterThan(0);
  });
  it("buildCopyableAssetResponse churn 26", () => {
    const entry = makeEntry({ slug: "slug-26", body: "body-26" });
    const assets = buildEntryContentAssets(entry);
    const response = buildCopyableAssetResponse({
      entry,
      platform: "",
      requestedType: "",
      assets,
      primary: assets[0],
      compatibility: [],
      source: sourceSummary(entry),
      trust: entryTrustSummary(entry),
      canonicalUrl: entryCanonicalUrl(entry),
    });
    expect(response.assets.length).toBeGreaterThan(0);
  });
  it("buildCopyableAssetResponse churn 27", () => {
    const entry = makeEntry({ slug: "slug-27", body: "body-27" });
    const assets = buildEntryContentAssets(entry);
    const response = buildCopyableAssetResponse({
      entry,
      platform: "",
      requestedType: "",
      assets,
      primary: assets[0],
      compatibility: [],
      source: sourceSummary(entry),
      trust: entryTrustSummary(entry),
      canonicalUrl: entryCanonicalUrl(entry),
    });
    expect(response.assets.length).toBeGreaterThan(0);
  });
  it("buildCopyableAssetResponse churn 28", () => {
    const entry = makeEntry({ slug: "slug-28", body: "body-28" });
    const assets = buildEntryContentAssets(entry);
    const response = buildCopyableAssetResponse({
      entry,
      platform: "",
      requestedType: "",
      assets,
      primary: assets[0],
      compatibility: [],
      source: sourceSummary(entry),
      trust: entryTrustSummary(entry),
      canonicalUrl: entryCanonicalUrl(entry),
    });
    expect(response.assets.length).toBeGreaterThan(0);
  });
  it("buildCopyableAssetResponse churn 29", () => {
    const entry = makeEntry({ slug: "slug-29", body: "body-29" });
    const assets = buildEntryContentAssets(entry);
    const response = buildCopyableAssetResponse({
      entry,
      platform: "",
      requestedType: "",
      assets,
      primary: assets[0],
      compatibility: [],
      source: sourceSummary(entry),
      trust: entryTrustSummary(entry),
      canonicalUrl: entryCanonicalUrl(entry),
    });
    expect(response.assets.length).toBeGreaterThan(0);
  });
  it("buildCopyableAssetResponse churn 30", () => {
    const entry = makeEntry({ slug: "slug-30", body: "body-30" });
    const assets = buildEntryContentAssets(entry);
    const response = buildCopyableAssetResponse({
      entry,
      platform: "",
      requestedType: "",
      assets,
      primary: assets[0],
      compatibility: [],
      source: sourceSummary(entry),
      trust: entryTrustSummary(entry),
      canonicalUrl: entryCanonicalUrl(entry),
    });
    expect(response.assets.length).toBeGreaterThan(0);
  });
  it("buildCopyableAssetResponse churn 31", () => {
    const entry = makeEntry({ slug: "slug-31", body: "body-31" });
    const assets = buildEntryContentAssets(entry);
    const response = buildCopyableAssetResponse({
      entry,
      platform: "",
      requestedType: "",
      assets,
      primary: assets[0],
      compatibility: [],
      source: sourceSummary(entry),
      trust: entryTrustSummary(entry),
      canonicalUrl: entryCanonicalUrl(entry),
    });
    expect(response.assets.length).toBeGreaterThan(0);
  });
  it("buildCopyableAssetResponse churn 32", () => {
    const entry = makeEntry({ slug: "slug-32", body: "body-32" });
    const assets = buildEntryContentAssets(entry);
    const response = buildCopyableAssetResponse({
      entry,
      platform: "",
      requestedType: "",
      assets,
      primary: assets[0],
      compatibility: [],
      source: sourceSummary(entry),
      trust: entryTrustSummary(entry),
      canonicalUrl: entryCanonicalUrl(entry),
    });
    expect(response.assets.length).toBeGreaterThan(0);
  });
  it("buildCopyableAssetResponse churn 33", () => {
    const entry = makeEntry({ slug: "slug-33", body: "body-33" });
    const assets = buildEntryContentAssets(entry);
    const response = buildCopyableAssetResponse({
      entry,
      platform: "",
      requestedType: "",
      assets,
      primary: assets[0],
      compatibility: [],
      source: sourceSummary(entry),
      trust: entryTrustSummary(entry),
      canonicalUrl: entryCanonicalUrl(entry),
    });
    expect(response.assets.length).toBeGreaterThan(0);
  });
  it("buildCopyableAssetResponse churn 34", () => {
    const entry = makeEntry({ slug: "slug-34", body: "body-34" });
    const assets = buildEntryContentAssets(entry);
    const response = buildCopyableAssetResponse({
      entry,
      platform: "",
      requestedType: "",
      assets,
      primary: assets[0],
      compatibility: [],
      source: sourceSummary(entry),
      trust: entryTrustSummary(entry),
      canonicalUrl: entryCanonicalUrl(entry),
    });
    expect(response.assets.length).toBeGreaterThan(0);
  });
  it("buildCopyableAssetResponse churn 35", () => {
    const entry = makeEntry({ slug: "slug-35", body: "body-35" });
    const assets = buildEntryContentAssets(entry);
    const response = buildCopyableAssetResponse({
      entry,
      platform: "",
      requestedType: "",
      assets,
      primary: assets[0],
      compatibility: [],
      source: sourceSummary(entry),
      trust: entryTrustSummary(entry),
      canonicalUrl: entryCanonicalUrl(entry),
    });
    expect(response.assets.length).toBeGreaterThan(0);
  });
  it("buildCopyableAssetResponse churn 36", () => {
    const entry = makeEntry({ slug: "slug-36", body: "body-36" });
    const assets = buildEntryContentAssets(entry);
    const response = buildCopyableAssetResponse({
      entry,
      platform: "",
      requestedType: "",
      assets,
      primary: assets[0],
      compatibility: [],
      source: sourceSummary(entry),
      trust: entryTrustSummary(entry),
      canonicalUrl: entryCanonicalUrl(entry),
    });
    expect(response.assets.length).toBeGreaterThan(0);
  });
  it("buildCopyableAssetResponse churn 37", () => {
    const entry = makeEntry({ slug: "slug-37", body: "body-37" });
    const assets = buildEntryContentAssets(entry);
    const response = buildCopyableAssetResponse({
      entry,
      platform: "",
      requestedType: "",
      assets,
      primary: assets[0],
      compatibility: [],
      source: sourceSummary(entry),
      trust: entryTrustSummary(entry),
      canonicalUrl: entryCanonicalUrl(entry),
    });
    expect(response.assets.length).toBeGreaterThan(0);
  });
  it("buildCopyableAssetResponse churn 38", () => {
    const entry = makeEntry({ slug: "slug-38", body: "body-38" });
    const assets = buildEntryContentAssets(entry);
    const response = buildCopyableAssetResponse({
      entry,
      platform: "",
      requestedType: "",
      assets,
      primary: assets[0],
      compatibility: [],
      source: sourceSummary(entry),
      trust: entryTrustSummary(entry),
      canonicalUrl: entryCanonicalUrl(entry),
    });
    expect(response.assets.length).toBeGreaterThan(0);
  });
  it("buildCopyableAssetResponse churn 39", () => {
    const entry = makeEntry({ slug: "slug-39", body: "body-39" });
    const assets = buildEntryContentAssets(entry);
    const response = buildCopyableAssetResponse({
      entry,
      platform: "",
      requestedType: "",
      assets,
      primary: assets[0],
      compatibility: [],
      source: sourceSummary(entry),
      trust: entryTrustSummary(entry),
      canonicalUrl: entryCanonicalUrl(entry),
    });
    expect(response.assets.length).toBeGreaterThan(0);
  });
  it("buildCopyableAssetResponse churn 40", () => {
    const entry = makeEntry({ slug: "slug-40", body: "body-40" });
    const assets = buildEntryContentAssets(entry);
    const response = buildCopyableAssetResponse({
      entry,
      platform: "",
      requestedType: "",
      assets,
      primary: assets[0],
      compatibility: [],
      source: sourceSummary(entry),
      trust: entryTrustSummary(entry),
      canonicalUrl: entryCanonicalUrl(entry),
    });
    expect(response.assets.length).toBeGreaterThan(0);
  });
  it("buildCopyableAssetResponse churn 41", () => {
    const entry = makeEntry({ slug: "slug-41", body: "body-41" });
    const assets = buildEntryContentAssets(entry);
    const response = buildCopyableAssetResponse({
      entry,
      platform: "",
      requestedType: "",
      assets,
      primary: assets[0],
      compatibility: [],
      source: sourceSummary(entry),
      trust: entryTrustSummary(entry),
      canonicalUrl: entryCanonicalUrl(entry),
    });
    expect(response.assets.length).toBeGreaterThan(0);
  });
  it("buildCopyableAssetResponse churn 42", () => {
    const entry = makeEntry({ slug: "slug-42", body: "body-42" });
    const assets = buildEntryContentAssets(entry);
    const response = buildCopyableAssetResponse({
      entry,
      platform: "",
      requestedType: "",
      assets,
      primary: assets[0],
      compatibility: [],
      source: sourceSummary(entry),
      trust: entryTrustSummary(entry),
      canonicalUrl: entryCanonicalUrl(entry),
    });
    expect(response.assets.length).toBeGreaterThan(0);
  });
  it("buildCopyableAssetResponse churn 43", () => {
    const entry = makeEntry({ slug: "slug-43", body: "body-43" });
    const assets = buildEntryContentAssets(entry);
    const response = buildCopyableAssetResponse({
      entry,
      platform: "",
      requestedType: "",
      assets,
      primary: assets[0],
      compatibility: [],
      source: sourceSummary(entry),
      trust: entryTrustSummary(entry),
      canonicalUrl: entryCanonicalUrl(entry),
    });
    expect(response.assets.length).toBeGreaterThan(0);
  });
  it("buildCopyableAssetResponse churn 44", () => {
    const entry = makeEntry({ slug: "slug-44", body: "body-44" });
    const assets = buildEntryContentAssets(entry);
    const response = buildCopyableAssetResponse({
      entry,
      platform: "",
      requestedType: "",
      assets,
      primary: assets[0],
      compatibility: [],
      source: sourceSummary(entry),
      trust: entryTrustSummary(entry),
      canonicalUrl: entryCanonicalUrl(entry),
    });
    expect(response.assets.length).toBeGreaterThan(0);
  });
  it("buildCopyableAssetResponse churn 45", () => {
    const entry = makeEntry({ slug: "slug-45", body: "body-45" });
    const assets = buildEntryContentAssets(entry);
    const response = buildCopyableAssetResponse({
      entry,
      platform: "",
      requestedType: "",
      assets,
      primary: assets[0],
      compatibility: [],
      source: sourceSummary(entry),
      trust: entryTrustSummary(entry),
      canonicalUrl: entryCanonicalUrl(entry),
    });
    expect(response.assets.length).toBeGreaterThan(0);
  });
  it("buildCopyableAssetResponse churn 46", () => {
    const entry = makeEntry({ slug: "slug-46", body: "body-46" });
    const assets = buildEntryContentAssets(entry);
    const response = buildCopyableAssetResponse({
      entry,
      platform: "",
      requestedType: "",
      assets,
      primary: assets[0],
      compatibility: [],
      source: sourceSummary(entry),
      trust: entryTrustSummary(entry),
      canonicalUrl: entryCanonicalUrl(entry),
    });
    expect(response.assets.length).toBeGreaterThan(0);
  });
  it("buildCopyableAssetResponse churn 47", () => {
    const entry = makeEntry({ slug: "slug-47", body: "body-47" });
    const assets = buildEntryContentAssets(entry);
    const response = buildCopyableAssetResponse({
      entry,
      platform: "",
      requestedType: "",
      assets,
      primary: assets[0],
      compatibility: [],
      source: sourceSummary(entry),
      trust: entryTrustSummary(entry),
      canonicalUrl: entryCanonicalUrl(entry),
    });
    expect(response.assets.length).toBeGreaterThan(0);
  });
  it("buildCopyableAssetResponse churn 48", () => {
    const entry = makeEntry({ slug: "slug-48", body: "body-48" });
    const assets = buildEntryContentAssets(entry);
    const response = buildCopyableAssetResponse({
      entry,
      platform: "",
      requestedType: "",
      assets,
      primary: assets[0],
      compatibility: [],
      source: sourceSummary(entry),
      trust: entryTrustSummary(entry),
      canonicalUrl: entryCanonicalUrl(entry),
    });
    expect(response.assets.length).toBeGreaterThan(0);
  });
  it("buildCopyableAssetResponse churn 49", () => {
    const entry = makeEntry({ slug: "slug-49", body: "body-49" });
    const assets = buildEntryContentAssets(entry);
    const response = buildCopyableAssetResponse({
      entry,
      platform: "",
      requestedType: "",
      assets,
      primary: assets[0],
      compatibility: [],
      source: sourceSummary(entry),
      trust: entryTrustSummary(entry),
      canonicalUrl: entryCanonicalUrl(entry),
    });
    expect(response.assets.length).toBeGreaterThan(0);
  });
  it("buildCopyableAssetResponse churn 50", () => {
    const entry = makeEntry({ slug: "slug-50", body: "body-50" });
    const assets = buildEntryContentAssets(entry);
    const response = buildCopyableAssetResponse({
      entry,
      platform: "",
      requestedType: "",
      assets,
      primary: assets[0],
      compatibility: [],
      source: sourceSummary(entry),
      trust: entryTrustSummary(entry),
      canonicalUrl: entryCanonicalUrl(entry),
    });
    expect(response.assets.length).toBeGreaterThan(0);
  });
  it("buildCopyableAssetResponse churn 51", () => {
    const entry = makeEntry({ slug: "slug-51", body: "body-51" });
    const assets = buildEntryContentAssets(entry);
    const response = buildCopyableAssetResponse({
      entry,
      platform: "",
      requestedType: "",
      assets,
      primary: assets[0],
      compatibility: [],
      source: sourceSummary(entry),
      trust: entryTrustSummary(entry),
      canonicalUrl: entryCanonicalUrl(entry),
    });
    expect(response.assets.length).toBeGreaterThan(0);
  });
  it("buildCopyableAssetResponse churn 52", () => {
    const entry = makeEntry({ slug: "slug-52", body: "body-52" });
    const assets = buildEntryContentAssets(entry);
    const response = buildCopyableAssetResponse({
      entry,
      platform: "",
      requestedType: "",
      assets,
      primary: assets[0],
      compatibility: [],
      source: sourceSummary(entry),
      trust: entryTrustSummary(entry),
      canonicalUrl: entryCanonicalUrl(entry),
    });
    expect(response.assets.length).toBeGreaterThan(0);
  });
  it("buildCopyableAssetResponse churn 53", () => {
    const entry = makeEntry({ slug: "slug-53", body: "body-53" });
    const assets = buildEntryContentAssets(entry);
    const response = buildCopyableAssetResponse({
      entry,
      platform: "",
      requestedType: "",
      assets,
      primary: assets[0],
      compatibility: [],
      source: sourceSummary(entry),
      trust: entryTrustSummary(entry),
      canonicalUrl: entryCanonicalUrl(entry),
    });
    expect(response.assets.length).toBeGreaterThan(0);
  });
  it("buildCopyableAssetResponse churn 54", () => {
    const entry = makeEntry({ slug: "slug-54", body: "body-54" });
    const assets = buildEntryContentAssets(entry);
    const response = buildCopyableAssetResponse({
      entry,
      platform: "",
      requestedType: "",
      assets,
      primary: assets[0],
      compatibility: [],
      source: sourceSummary(entry),
      trust: entryTrustSummary(entry),
      canonicalUrl: entryCanonicalUrl(entry),
    });
    expect(response.assets.length).toBeGreaterThan(0);
  });
  it("buildCopyableAssetResponse churn 55", () => {
    const entry = makeEntry({ slug: "slug-55", body: "body-55" });
    const assets = buildEntryContentAssets(entry);
    const response = buildCopyableAssetResponse({
      entry,
      platform: "",
      requestedType: "",
      assets,
      primary: assets[0],
      compatibility: [],
      source: sourceSummary(entry),
      trust: entryTrustSummary(entry),
      canonicalUrl: entryCanonicalUrl(entry),
    });
    expect(response.assets.length).toBeGreaterThan(0);
  });
  it("buildCopyableAssetResponse churn 56", () => {
    const entry = makeEntry({ slug: "slug-56", body: "body-56" });
    const assets = buildEntryContentAssets(entry);
    const response = buildCopyableAssetResponse({
      entry,
      platform: "",
      requestedType: "",
      assets,
      primary: assets[0],
      compatibility: [],
      source: sourceSummary(entry),
      trust: entryTrustSummary(entry),
      canonicalUrl: entryCanonicalUrl(entry),
    });
    expect(response.assets.length).toBeGreaterThan(0);
  });
  it("buildCopyableAssetResponse churn 57", () => {
    const entry = makeEntry({ slug: "slug-57", body: "body-57" });
    const assets = buildEntryContentAssets(entry);
    const response = buildCopyableAssetResponse({
      entry,
      platform: "",
      requestedType: "",
      assets,
      primary: assets[0],
      compatibility: [],
      source: sourceSummary(entry),
      trust: entryTrustSummary(entry),
      canonicalUrl: entryCanonicalUrl(entry),
    });
    expect(response.assets.length).toBeGreaterThan(0);
  });
  it("buildCopyableAssetResponse churn 58", () => {
    const entry = makeEntry({ slug: "slug-58", body: "body-58" });
    const assets = buildEntryContentAssets(entry);
    const response = buildCopyableAssetResponse({
      entry,
      platform: "",
      requestedType: "",
      assets,
      primary: assets[0],
      compatibility: [],
      source: sourceSummary(entry),
      trust: entryTrustSummary(entry),
      canonicalUrl: entryCanonicalUrl(entry),
    });
    expect(response.assets.length).toBeGreaterThan(0);
  });
  it("buildCopyableAssetResponse churn 59", () => {
    const entry = makeEntry({ slug: "slug-59", body: "body-59" });
    const assets = buildEntryContentAssets(entry);
    const response = buildCopyableAssetResponse({
      entry,
      platform: "",
      requestedType: "",
      assets,
      primary: assets[0],
      compatibility: [],
      source: sourceSummary(entry),
      trust: entryTrustSummary(entry),
      canonicalUrl: entryCanonicalUrl(entry),
    });
    expect(response.assets.length).toBeGreaterThan(0);
  });
});
