import { describe, expect, it } from "vitest";

import {
  buildRegistryStatsResponse,
  computeRegistryFreshness,
  computeSourceSignalCounts,
  countPlatformsAndTags,
} from "../packages/mcp/src/registry-stats-lib.js";

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

describe("registry-stats-lib countPlatformsAndTags", () => {
  it("counts platforms and tags", () => {
    const entries = [
      makeEntry({ platforms: ["cursor", "vscode"], tags: ["a", "b"] }),
      makeEntry({ slug: "other", platforms: ["cursor"], tags: ["b", "c"] }),
    ];
    const { platformCounts, tagCounts } = countPlatformsAndTags(entries);
    expect(platformCounts.get("cursor")).toBe(2);
    expect(tagCounts.get("b")).toBe(2);
  });
  it("countPlatformsAndTags claude-code 0", () => {
    const entries = [makeEntry({ platforms: ["claude-code"] })];
    const { platformCounts } = countPlatformsAndTags(entries);
    expect(platformCounts.get("claude-code")).toBe(1);
  });
  it("countPlatformsAndTags claude-code 1", () => {
    const entries = [makeEntry({ platforms: ["claude-code"] })];
    const { platformCounts } = countPlatformsAndTags(entries);
    expect(platformCounts.get("claude-code")).toBe(1);
  });
  it("countPlatformsAndTags claude-code 2", () => {
    const entries = [makeEntry({ platforms: ["claude-code"] })];
    const { platformCounts } = countPlatformsAndTags(entries);
    expect(platformCounts.get("claude-code")).toBe(1);
  });
  it("countPlatformsAndTags claude-code 3", () => {
    const entries = [makeEntry({ platforms: ["claude-code"] })];
    const { platformCounts } = countPlatformsAndTags(entries);
    expect(platformCounts.get("claude-code")).toBe(1);
  });
  it("countPlatformsAndTags claude-code 4", () => {
    const entries = [makeEntry({ platforms: ["claude-code"] })];
    const { platformCounts } = countPlatformsAndTags(entries);
    expect(platformCounts.get("claude-code")).toBe(1);
  });
  it("countPlatformsAndTags claude-code 5", () => {
    const entries = [makeEntry({ platforms: ["claude-code"] })];
    const { platformCounts } = countPlatformsAndTags(entries);
    expect(platformCounts.get("claude-code")).toBe(1);
  });
  it("countPlatformsAndTags claude-code 6", () => {
    const entries = [makeEntry({ platforms: ["claude-code"] })];
    const { platformCounts } = countPlatformsAndTags(entries);
    expect(platformCounts.get("claude-code")).toBe(1);
  });
  it("countPlatformsAndTags claude-code 7", () => {
    const entries = [makeEntry({ platforms: ["claude-code"] })];
    const { platformCounts } = countPlatformsAndTags(entries);
    expect(platformCounts.get("claude-code")).toBe(1);
  });
  it("countPlatformsAndTags claude-desktop 0", () => {
    const entries = [makeEntry({ platforms: ["claude-desktop"] })];
    const { platformCounts } = countPlatformsAndTags(entries);
    expect(platformCounts.get("claude-desktop")).toBe(1);
  });
  it("countPlatformsAndTags claude-desktop 1", () => {
    const entries = [makeEntry({ platforms: ["claude-desktop"] })];
    const { platformCounts } = countPlatformsAndTags(entries);
    expect(platformCounts.get("claude-desktop")).toBe(1);
  });
  it("countPlatformsAndTags claude-desktop 2", () => {
    const entries = [makeEntry({ platforms: ["claude-desktop"] })];
    const { platformCounts } = countPlatformsAndTags(entries);
    expect(platformCounts.get("claude-desktop")).toBe(1);
  });
  it("countPlatformsAndTags claude-desktop 3", () => {
    const entries = [makeEntry({ platforms: ["claude-desktop"] })];
    const { platformCounts } = countPlatformsAndTags(entries);
    expect(platformCounts.get("claude-desktop")).toBe(1);
  });
  it("countPlatformsAndTags claude-desktop 4", () => {
    const entries = [makeEntry({ platforms: ["claude-desktop"] })];
    const { platformCounts } = countPlatformsAndTags(entries);
    expect(platformCounts.get("claude-desktop")).toBe(1);
  });
  it("countPlatformsAndTags claude-desktop 5", () => {
    const entries = [makeEntry({ platforms: ["claude-desktop"] })];
    const { platformCounts } = countPlatformsAndTags(entries);
    expect(platformCounts.get("claude-desktop")).toBe(1);
  });
  it("countPlatformsAndTags claude-desktop 6", () => {
    const entries = [makeEntry({ platforms: ["claude-desktop"] })];
    const { platformCounts } = countPlatformsAndTags(entries);
    expect(platformCounts.get("claude-desktop")).toBe(1);
  });
  it("countPlatformsAndTags claude-desktop 7", () => {
    const entries = [makeEntry({ platforms: ["claude-desktop"] })];
    const { platformCounts } = countPlatformsAndTags(entries);
    expect(platformCounts.get("claude-desktop")).toBe(1);
  });
  it("countPlatformsAndTags cursor 0", () => {
    const entries = [makeEntry({ platforms: ["cursor"] })];
    const { platformCounts } = countPlatformsAndTags(entries);
    expect(platformCounts.get("cursor")).toBe(1);
  });
  it("countPlatformsAndTags cursor 1", () => {
    const entries = [makeEntry({ platforms: ["cursor"] })];
    const { platformCounts } = countPlatformsAndTags(entries);
    expect(platformCounts.get("cursor")).toBe(1);
  });
  it("countPlatformsAndTags cursor 2", () => {
    const entries = [makeEntry({ platforms: ["cursor"] })];
    const { platformCounts } = countPlatformsAndTags(entries);
    expect(platformCounts.get("cursor")).toBe(1);
  });
  it("countPlatformsAndTags cursor 3", () => {
    const entries = [makeEntry({ platforms: ["cursor"] })];
    const { platformCounts } = countPlatformsAndTags(entries);
    expect(platformCounts.get("cursor")).toBe(1);
  });
  it("countPlatformsAndTags cursor 4", () => {
    const entries = [makeEntry({ platforms: ["cursor"] })];
    const { platformCounts } = countPlatformsAndTags(entries);
    expect(platformCounts.get("cursor")).toBe(1);
  });
  it("countPlatformsAndTags cursor 5", () => {
    const entries = [makeEntry({ platforms: ["cursor"] })];
    const { platformCounts } = countPlatformsAndTags(entries);
    expect(platformCounts.get("cursor")).toBe(1);
  });
  it("countPlatformsAndTags cursor 6", () => {
    const entries = [makeEntry({ platforms: ["cursor"] })];
    const { platformCounts } = countPlatformsAndTags(entries);
    expect(platformCounts.get("cursor")).toBe(1);
  });
  it("countPlatformsAndTags cursor 7", () => {
    const entries = [makeEntry({ platforms: ["cursor"] })];
    const { platformCounts } = countPlatformsAndTags(entries);
    expect(platformCounts.get("cursor")).toBe(1);
  });
  it("countPlatformsAndTags vscode 0", () => {
    const entries = [makeEntry({ platforms: ["vscode"] })];
    const { platformCounts } = countPlatformsAndTags(entries);
    expect(platformCounts.get("vscode")).toBe(1);
  });
  it("countPlatformsAndTags vscode 1", () => {
    const entries = [makeEntry({ platforms: ["vscode"] })];
    const { platformCounts } = countPlatformsAndTags(entries);
    expect(platformCounts.get("vscode")).toBe(1);
  });
  it("countPlatformsAndTags vscode 2", () => {
    const entries = [makeEntry({ platforms: ["vscode"] })];
    const { platformCounts } = countPlatformsAndTags(entries);
    expect(platformCounts.get("vscode")).toBe(1);
  });
  it("countPlatformsAndTags vscode 3", () => {
    const entries = [makeEntry({ platforms: ["vscode"] })];
    const { platformCounts } = countPlatformsAndTags(entries);
    expect(platformCounts.get("vscode")).toBe(1);
  });
  it("countPlatformsAndTags vscode 4", () => {
    const entries = [makeEntry({ platforms: ["vscode"] })];
    const { platformCounts } = countPlatformsAndTags(entries);
    expect(platformCounts.get("vscode")).toBe(1);
  });
  it("countPlatformsAndTags vscode 5", () => {
    const entries = [makeEntry({ platforms: ["vscode"] })];
    const { platformCounts } = countPlatformsAndTags(entries);
    expect(platformCounts.get("vscode")).toBe(1);
  });
  it("countPlatformsAndTags vscode 6", () => {
    const entries = [makeEntry({ platforms: ["vscode"] })];
    const { platformCounts } = countPlatformsAndTags(entries);
    expect(platformCounts.get("vscode")).toBe(1);
  });
  it("countPlatformsAndTags vscode 7", () => {
    const entries = [makeEntry({ platforms: ["vscode"] })];
    const { platformCounts } = countPlatformsAndTags(entries);
    expect(platformCounts.get("vscode")).toBe(1);
  });
  it("countPlatformsAndTags windsurf 0", () => {
    const entries = [makeEntry({ platforms: ["windsurf"] })];
    const { platformCounts } = countPlatformsAndTags(entries);
    expect(platformCounts.get("windsurf")).toBe(1);
  });
  it("countPlatformsAndTags windsurf 1", () => {
    const entries = [makeEntry({ platforms: ["windsurf"] })];
    const { platformCounts } = countPlatformsAndTags(entries);
    expect(platformCounts.get("windsurf")).toBe(1);
  });
  it("countPlatformsAndTags windsurf 2", () => {
    const entries = [makeEntry({ platforms: ["windsurf"] })];
    const { platformCounts } = countPlatformsAndTags(entries);
    expect(platformCounts.get("windsurf")).toBe(1);
  });
  it("countPlatformsAndTags windsurf 3", () => {
    const entries = [makeEntry({ platforms: ["windsurf"] })];
    const { platformCounts } = countPlatformsAndTags(entries);
    expect(platformCounts.get("windsurf")).toBe(1);
  });
  it("countPlatformsAndTags windsurf 4", () => {
    const entries = [makeEntry({ platforms: ["windsurf"] })];
    const { platformCounts } = countPlatformsAndTags(entries);
    expect(platformCounts.get("windsurf")).toBe(1);
  });
  it("countPlatformsAndTags windsurf 5", () => {
    const entries = [makeEntry({ platforms: ["windsurf"] })];
    const { platformCounts } = countPlatformsAndTags(entries);
    expect(platformCounts.get("windsurf")).toBe(1);
  });
  it("countPlatformsAndTags windsurf 6", () => {
    const entries = [makeEntry({ platforms: ["windsurf"] })];
    const { platformCounts } = countPlatformsAndTags(entries);
    expect(platformCounts.get("windsurf")).toBe(1);
  });
  it("countPlatformsAndTags windsurf 7", () => {
    const entries = [makeEntry({ platforms: ["windsurf"] })];
    const { platformCounts } = countPlatformsAndTags(entries);
    expect(platformCounts.get("windsurf")).toBe(1);
  });
  it("countPlatformsAndTags codex 0", () => {
    const entries = [makeEntry({ platforms: ["codex"] })];
    const { platformCounts } = countPlatformsAndTags(entries);
    expect(platformCounts.get("codex")).toBe(1);
  });
  it("countPlatformsAndTags codex 1", () => {
    const entries = [makeEntry({ platforms: ["codex"] })];
    const { platformCounts } = countPlatformsAndTags(entries);
    expect(platformCounts.get("codex")).toBe(1);
  });
  it("countPlatformsAndTags codex 2", () => {
    const entries = [makeEntry({ platforms: ["codex"] })];
    const { platformCounts } = countPlatformsAndTags(entries);
    expect(platformCounts.get("codex")).toBe(1);
  });
  it("countPlatformsAndTags codex 3", () => {
    const entries = [makeEntry({ platforms: ["codex"] })];
    const { platformCounts } = countPlatformsAndTags(entries);
    expect(platformCounts.get("codex")).toBe(1);
  });
  it("countPlatformsAndTags codex 4", () => {
    const entries = [makeEntry({ platforms: ["codex"] })];
    const { platformCounts } = countPlatformsAndTags(entries);
    expect(platformCounts.get("codex")).toBe(1);
  });
  it("countPlatformsAndTags codex 5", () => {
    const entries = [makeEntry({ platforms: ["codex"] })];
    const { platformCounts } = countPlatformsAndTags(entries);
    expect(platformCounts.get("codex")).toBe(1);
  });
  it("countPlatformsAndTags codex 6", () => {
    const entries = [makeEntry({ platforms: ["codex"] })];
    const { platformCounts } = countPlatformsAndTags(entries);
    expect(platformCounts.get("codex")).toBe(1);
  });
  it("countPlatformsAndTags codex 7", () => {
    const entries = [makeEntry({ platforms: ["codex"] })];
    const { platformCounts } = countPlatformsAndTags(entries);
    expect(platformCounts.get("codex")).toBe(1);
  });
  it("countPlatformsAndTags gemini 0", () => {
    const entries = [makeEntry({ platforms: ["gemini"] })];
    const { platformCounts } = countPlatformsAndTags(entries);
    expect(platformCounts.get("gemini")).toBe(1);
  });
  it("countPlatformsAndTags gemini 1", () => {
    const entries = [makeEntry({ platforms: ["gemini"] })];
    const { platformCounts } = countPlatformsAndTags(entries);
    expect(platformCounts.get("gemini")).toBe(1);
  });
  it("countPlatformsAndTags gemini 2", () => {
    const entries = [makeEntry({ platforms: ["gemini"] })];
    const { platformCounts } = countPlatformsAndTags(entries);
    expect(platformCounts.get("gemini")).toBe(1);
  });
  it("countPlatformsAndTags gemini 3", () => {
    const entries = [makeEntry({ platforms: ["gemini"] })];
    const { platformCounts } = countPlatformsAndTags(entries);
    expect(platformCounts.get("gemini")).toBe(1);
  });
  it("countPlatformsAndTags gemini 4", () => {
    const entries = [makeEntry({ platforms: ["gemini"] })];
    const { platformCounts } = countPlatformsAndTags(entries);
    expect(platformCounts.get("gemini")).toBe(1);
  });
  it("countPlatformsAndTags gemini 5", () => {
    const entries = [makeEntry({ platforms: ["gemini"] })];
    const { platformCounts } = countPlatformsAndTags(entries);
    expect(platformCounts.get("gemini")).toBe(1);
  });
  it("countPlatformsAndTags gemini 6", () => {
    const entries = [makeEntry({ platforms: ["gemini"] })];
    const { platformCounts } = countPlatformsAndTags(entries);
    expect(platformCounts.get("gemini")).toBe(1);
  });
  it("countPlatformsAndTags gemini 7", () => {
    const entries = [makeEntry({ platforms: ["gemini"] })];
    const { platformCounts } = countPlatformsAndTags(entries);
    expect(platformCounts.get("gemini")).toBe(1);
  });
  it("countPlatformsAndTags raycast 0", () => {
    const entries = [makeEntry({ platforms: ["raycast"] })];
    const { platformCounts } = countPlatformsAndTags(entries);
    expect(platformCounts.get("raycast")).toBe(1);
  });
  it("countPlatformsAndTags raycast 1", () => {
    const entries = [makeEntry({ platforms: ["raycast"] })];
    const { platformCounts } = countPlatformsAndTags(entries);
    expect(platformCounts.get("raycast")).toBe(1);
  });
  it("countPlatformsAndTags raycast 2", () => {
    const entries = [makeEntry({ platforms: ["raycast"] })];
    const { platformCounts } = countPlatformsAndTags(entries);
    expect(platformCounts.get("raycast")).toBe(1);
  });
  it("countPlatformsAndTags raycast 3", () => {
    const entries = [makeEntry({ platforms: ["raycast"] })];
    const { platformCounts } = countPlatformsAndTags(entries);
    expect(platformCounts.get("raycast")).toBe(1);
  });
  it("countPlatformsAndTags raycast 4", () => {
    const entries = [makeEntry({ platforms: ["raycast"] })];
    const { platformCounts } = countPlatformsAndTags(entries);
    expect(platformCounts.get("raycast")).toBe(1);
  });
  it("countPlatformsAndTags raycast 5", () => {
    const entries = [makeEntry({ platforms: ["raycast"] })];
    const { platformCounts } = countPlatformsAndTags(entries);
    expect(platformCounts.get("raycast")).toBe(1);
  });
  it("countPlatformsAndTags raycast 6", () => {
    const entries = [makeEntry({ platforms: ["raycast"] })];
    const { platformCounts } = countPlatformsAndTags(entries);
    expect(platformCounts.get("raycast")).toBe(1);
  });
  it("countPlatformsAndTags raycast 7", () => {
    const entries = [makeEntry({ platforms: ["raycast"] })];
    const { platformCounts } = countPlatformsAndTags(entries);
    expect(platformCounts.get("raycast")).toBe(1);
  });
  it("countPlatformsAndTags cli 0", () => {
    const entries = [makeEntry({ platforms: ["cli"] })];
    const { platformCounts } = countPlatformsAndTags(entries);
    expect(platformCounts.get("cli")).toBe(1);
  });
  it("countPlatformsAndTags cli 1", () => {
    const entries = [makeEntry({ platforms: ["cli"] })];
    const { platformCounts } = countPlatformsAndTags(entries);
    expect(platformCounts.get("cli")).toBe(1);
  });
  it("countPlatformsAndTags cli 2", () => {
    const entries = [makeEntry({ platforms: ["cli"] })];
    const { platformCounts } = countPlatformsAndTags(entries);
    expect(platformCounts.get("cli")).toBe(1);
  });
  it("countPlatformsAndTags cli 3", () => {
    const entries = [makeEntry({ platforms: ["cli"] })];
    const { platformCounts } = countPlatformsAndTags(entries);
    expect(platformCounts.get("cli")).toBe(1);
  });
  it("countPlatformsAndTags cli 4", () => {
    const entries = [makeEntry({ platforms: ["cli"] })];
    const { platformCounts } = countPlatformsAndTags(entries);
    expect(platformCounts.get("cli")).toBe(1);
  });
  it("countPlatformsAndTags cli 5", () => {
    const entries = [makeEntry({ platforms: ["cli"] })];
    const { platformCounts } = countPlatformsAndTags(entries);
    expect(platformCounts.get("cli")).toBe(1);
  });
  it("countPlatformsAndTags cli 6", () => {
    const entries = [makeEntry({ platforms: ["cli"] })];
    const { platformCounts } = countPlatformsAndTags(entries);
    expect(platformCounts.get("cli")).toBe(1);
  });
  it("countPlatformsAndTags cli 7", () => {
    const entries = [makeEntry({ platforms: ["cli"] })];
    const { platformCounts } = countPlatformsAndTags(entries);
    expect(platformCounts.get("cli")).toBe(1);
  });
  it("countPlatformsAndTags aider 0", () => {
    const entries = [makeEntry({ platforms: ["aider"] })];
    const { platformCounts } = countPlatformsAndTags(entries);
    expect(platformCounts.get("aider")).toBe(1);
  });
  it("countPlatformsAndTags aider 1", () => {
    const entries = [makeEntry({ platforms: ["aider"] })];
    const { platformCounts } = countPlatformsAndTags(entries);
    expect(platformCounts.get("aider")).toBe(1);
  });
  it("countPlatformsAndTags aider 2", () => {
    const entries = [makeEntry({ platforms: ["aider"] })];
    const { platformCounts } = countPlatformsAndTags(entries);
    expect(platformCounts.get("aider")).toBe(1);
  });
  it("countPlatformsAndTags aider 3", () => {
    const entries = [makeEntry({ platforms: ["aider"] })];
    const { platformCounts } = countPlatformsAndTags(entries);
    expect(platformCounts.get("aider")).toBe(1);
  });
  it("countPlatformsAndTags aider 4", () => {
    const entries = [makeEntry({ platforms: ["aider"] })];
    const { platformCounts } = countPlatformsAndTags(entries);
    expect(platformCounts.get("aider")).toBe(1);
  });
  it("countPlatformsAndTags aider 5", () => {
    const entries = [makeEntry({ platforms: ["aider"] })];
    const { platformCounts } = countPlatformsAndTags(entries);
    expect(platformCounts.get("aider")).toBe(1);
  });
  it("countPlatformsAndTags aider 6", () => {
    const entries = [makeEntry({ platforms: ["aider"] })];
    const { platformCounts } = countPlatformsAndTags(entries);
    expect(platformCounts.get("aider")).toBe(1);
  });
  it("countPlatformsAndTags aider 7", () => {
    const entries = [makeEntry({ platforms: ["aider"] })];
    const { platformCounts } = countPlatformsAndTags(entries);
    expect(platformCounts.get("aider")).toBe(1);
  });
  it("countPlatformsAndTags zed 0", () => {
    const entries = [makeEntry({ platforms: ["zed"] })];
    const { platformCounts } = countPlatformsAndTags(entries);
    expect(platformCounts.get("zed")).toBe(1);
  });
  it("countPlatformsAndTags zed 1", () => {
    const entries = [makeEntry({ platforms: ["zed"] })];
    const { platformCounts } = countPlatformsAndTags(entries);
    expect(platformCounts.get("zed")).toBe(1);
  });
  it("countPlatformsAndTags zed 2", () => {
    const entries = [makeEntry({ platforms: ["zed"] })];
    const { platformCounts } = countPlatformsAndTags(entries);
    expect(platformCounts.get("zed")).toBe(1);
  });
  it("countPlatformsAndTags zed 3", () => {
    const entries = [makeEntry({ platforms: ["zed"] })];
    const { platformCounts } = countPlatformsAndTags(entries);
    expect(platformCounts.get("zed")).toBe(1);
  });
  it("countPlatformsAndTags zed 4", () => {
    const entries = [makeEntry({ platforms: ["zed"] })];
    const { platformCounts } = countPlatformsAndTags(entries);
    expect(platformCounts.get("zed")).toBe(1);
  });
  it("countPlatformsAndTags zed 5", () => {
    const entries = [makeEntry({ platforms: ["zed"] })];
    const { platformCounts } = countPlatformsAndTags(entries);
    expect(platformCounts.get("zed")).toBe(1);
  });
  it("countPlatformsAndTags zed 6", () => {
    const entries = [makeEntry({ platforms: ["zed"] })];
    const { platformCounts } = countPlatformsAndTags(entries);
    expect(platformCounts.get("zed")).toBe(1);
  });
  it("countPlatformsAndTags zed 7", () => {
    const entries = [makeEntry({ platforms: ["zed"] })];
    const { platformCounts } = countPlatformsAndTags(entries);
    expect(platformCounts.get("zed")).toBe(1);
  });
  it("countPlatformsAndTags continue 0", () => {
    const entries = [makeEntry({ platforms: ["continue"] })];
    const { platformCounts } = countPlatformsAndTags(entries);
    expect(platformCounts.get("continue")).toBe(1);
  });
  it("countPlatformsAndTags continue 1", () => {
    const entries = [makeEntry({ platforms: ["continue"] })];
    const { platformCounts } = countPlatformsAndTags(entries);
    expect(platformCounts.get("continue")).toBe(1);
  });
  it("countPlatformsAndTags continue 2", () => {
    const entries = [makeEntry({ platforms: ["continue"] })];
    const { platformCounts } = countPlatformsAndTags(entries);
    expect(platformCounts.get("continue")).toBe(1);
  });
  it("countPlatformsAndTags continue 3", () => {
    const entries = [makeEntry({ platforms: ["continue"] })];
    const { platformCounts } = countPlatformsAndTags(entries);
    expect(platformCounts.get("continue")).toBe(1);
  });
  it("countPlatformsAndTags continue 4", () => {
    const entries = [makeEntry({ platforms: ["continue"] })];
    const { platformCounts } = countPlatformsAndTags(entries);
    expect(platformCounts.get("continue")).toBe(1);
  });
  it("countPlatformsAndTags continue 5", () => {
    const entries = [makeEntry({ platforms: ["continue"] })];
    const { platformCounts } = countPlatformsAndTags(entries);
    expect(platformCounts.get("continue")).toBe(1);
  });
  it("countPlatformsAndTags continue 6", () => {
    const entries = [makeEntry({ platforms: ["continue"] })];
    const { platformCounts } = countPlatformsAndTags(entries);
    expect(platformCounts.get("continue")).toBe(1);
  });
  it("countPlatformsAndTags continue 7", () => {
    const entries = [makeEntry({ platforms: ["continue"] })];
    const { platformCounts } = countPlatformsAndTags(entries);
    expect(platformCounts.get("continue")).toBe(1);
  });
  it("countPlatformsAndTags churn 0", () => {
    const entries = Array.from({ length: 1 }, (_, idx) =>
      makeEntry({ slug: "s-" + idx, tags: ["tag-0"] }),
    );
    const { tagCounts } = countPlatformsAndTags(entries);
    expect(tagCounts.get("tag-0")).toBe(1);
  });
  it("countPlatformsAndTags churn 1", () => {
    const entries = Array.from({ length: 2 }, (_, idx) =>
      makeEntry({ slug: "s-" + idx, tags: ["tag-1"] }),
    );
    const { tagCounts } = countPlatformsAndTags(entries);
    expect(tagCounts.get("tag-1")).toBe(2);
  });
  it("countPlatformsAndTags churn 2", () => {
    const entries = Array.from({ length: 3 }, (_, idx) =>
      makeEntry({ slug: "s-" + idx, tags: ["tag-2"] }),
    );
    const { tagCounts } = countPlatformsAndTags(entries);
    expect(tagCounts.get("tag-2")).toBe(3);
  });
  it("countPlatformsAndTags churn 3", () => {
    const entries = Array.from({ length: 4 }, (_, idx) =>
      makeEntry({ slug: "s-" + idx, tags: ["tag-3"] }),
    );
    const { tagCounts } = countPlatformsAndTags(entries);
    expect(tagCounts.get("tag-3")).toBe(4);
  });
  it("countPlatformsAndTags churn 4", () => {
    const entries = Array.from({ length: 5 }, (_, idx) =>
      makeEntry({ slug: "s-" + idx, tags: ["tag-4"] }),
    );
    const { tagCounts } = countPlatformsAndTags(entries);
    expect(tagCounts.get("tag-4")).toBe(5);
  });
  it("countPlatformsAndTags churn 5", () => {
    const entries = Array.from({ length: 1 }, (_, idx) =>
      makeEntry({ slug: "s-" + idx, tags: ["tag-5"] }),
    );
    const { tagCounts } = countPlatformsAndTags(entries);
    expect(tagCounts.get("tag-5")).toBe(1);
  });
  it("countPlatformsAndTags churn 6", () => {
    const entries = Array.from({ length: 2 }, (_, idx) =>
      makeEntry({ slug: "s-" + idx, tags: ["tag-6"] }),
    );
    const { tagCounts } = countPlatformsAndTags(entries);
    expect(tagCounts.get("tag-6")).toBe(2);
  });
  it("countPlatformsAndTags churn 7", () => {
    const entries = Array.from({ length: 3 }, (_, idx) =>
      makeEntry({ slug: "s-" + idx, tags: ["tag-7"] }),
    );
    const { tagCounts } = countPlatformsAndTags(entries);
    expect(tagCounts.get("tag-7")).toBe(3);
  });
  it("countPlatformsAndTags churn 8", () => {
    const entries = Array.from({ length: 4 }, (_, idx) =>
      makeEntry({ slug: "s-" + idx, tags: ["tag-8"] }),
    );
    const { tagCounts } = countPlatformsAndTags(entries);
    expect(tagCounts.get("tag-8")).toBe(4);
  });
  it("countPlatformsAndTags churn 9", () => {
    const entries = Array.from({ length: 5 }, (_, idx) =>
      makeEntry({ slug: "s-" + idx, tags: ["tag-9"] }),
    );
    const { tagCounts } = countPlatformsAndTags(entries);
    expect(tagCounts.get("tag-9")).toBe(5);
  });
  it("countPlatformsAndTags churn 10", () => {
    const entries = Array.from({ length: 1 }, (_, idx) =>
      makeEntry({ slug: "s-" + idx, tags: ["tag-10"] }),
    );
    const { tagCounts } = countPlatformsAndTags(entries);
    expect(tagCounts.get("tag-10")).toBe(1);
  });
  it("countPlatformsAndTags churn 11", () => {
    const entries = Array.from({ length: 2 }, (_, idx) =>
      makeEntry({ slug: "s-" + idx, tags: ["tag-11"] }),
    );
    const { tagCounts } = countPlatformsAndTags(entries);
    expect(tagCounts.get("tag-11")).toBe(2);
  });
  it("countPlatformsAndTags churn 12", () => {
    const entries = Array.from({ length: 3 }, (_, idx) =>
      makeEntry({ slug: "s-" + idx, tags: ["tag-12"] }),
    );
    const { tagCounts } = countPlatformsAndTags(entries);
    expect(tagCounts.get("tag-12")).toBe(3);
  });
  it("countPlatformsAndTags churn 13", () => {
    const entries = Array.from({ length: 4 }, (_, idx) =>
      makeEntry({ slug: "s-" + idx, tags: ["tag-13"] }),
    );
    const { tagCounts } = countPlatformsAndTags(entries);
    expect(tagCounts.get("tag-13")).toBe(4);
  });
  it("countPlatformsAndTags churn 14", () => {
    const entries = Array.from({ length: 5 }, (_, idx) =>
      makeEntry({ slug: "s-" + idx, tags: ["tag-14"] }),
    );
    const { tagCounts } = countPlatformsAndTags(entries);
    expect(tagCounts.get("tag-14")).toBe(5);
  });
  it("countPlatformsAndTags churn 15", () => {
    const entries = Array.from({ length: 1 }, (_, idx) =>
      makeEntry({ slug: "s-" + idx, tags: ["tag-15"] }),
    );
    const { tagCounts } = countPlatformsAndTags(entries);
    expect(tagCounts.get("tag-15")).toBe(1);
  });
  it("countPlatformsAndTags churn 16", () => {
    const entries = Array.from({ length: 2 }, (_, idx) =>
      makeEntry({ slug: "s-" + idx, tags: ["tag-16"] }),
    );
    const { tagCounts } = countPlatformsAndTags(entries);
    expect(tagCounts.get("tag-16")).toBe(2);
  });
  it("countPlatformsAndTags churn 17", () => {
    const entries = Array.from({ length: 3 }, (_, idx) =>
      makeEntry({ slug: "s-" + idx, tags: ["tag-17"] }),
    );
    const { tagCounts } = countPlatformsAndTags(entries);
    expect(tagCounts.get("tag-17")).toBe(3);
  });
  it("countPlatformsAndTags churn 18", () => {
    const entries = Array.from({ length: 4 }, (_, idx) =>
      makeEntry({ slug: "s-" + idx, tags: ["tag-18"] }),
    );
    const { tagCounts } = countPlatformsAndTags(entries);
    expect(tagCounts.get("tag-18")).toBe(4);
  });
  it("countPlatformsAndTags churn 19", () => {
    const entries = Array.from({ length: 5 }, (_, idx) =>
      makeEntry({ slug: "s-" + idx, tags: ["tag-19"] }),
    );
    const { tagCounts } = countPlatformsAndTags(entries);
    expect(tagCounts.get("tag-19")).toBe(5);
  });
  it("countPlatformsAndTags churn 20", () => {
    const entries = Array.from({ length: 1 }, (_, idx) =>
      makeEntry({ slug: "s-" + idx, tags: ["tag-20"] }),
    );
    const { tagCounts } = countPlatformsAndTags(entries);
    expect(tagCounts.get("tag-20")).toBe(1);
  });
  it("countPlatformsAndTags churn 21", () => {
    const entries = Array.from({ length: 2 }, (_, idx) =>
      makeEntry({ slug: "s-" + idx, tags: ["tag-21"] }),
    );
    const { tagCounts } = countPlatformsAndTags(entries);
    expect(tagCounts.get("tag-21")).toBe(2);
  });
  it("countPlatformsAndTags churn 22", () => {
    const entries = Array.from({ length: 3 }, (_, idx) =>
      makeEntry({ slug: "s-" + idx, tags: ["tag-22"] }),
    );
    const { tagCounts } = countPlatformsAndTags(entries);
    expect(tagCounts.get("tag-22")).toBe(3);
  });
  it("countPlatformsAndTags churn 23", () => {
    const entries = Array.from({ length: 4 }, (_, idx) =>
      makeEntry({ slug: "s-" + idx, tags: ["tag-23"] }),
    );
    const { tagCounts } = countPlatformsAndTags(entries);
    expect(tagCounts.get("tag-23")).toBe(4);
  });
  it("countPlatformsAndTags churn 24", () => {
    const entries = Array.from({ length: 5 }, (_, idx) =>
      makeEntry({ slug: "s-" + idx, tags: ["tag-24"] }),
    );
    const { tagCounts } = countPlatformsAndTags(entries);
    expect(tagCounts.get("tag-24")).toBe(5);
  });
  it("countPlatformsAndTags churn 25", () => {
    const entries = Array.from({ length: 1 }, (_, idx) =>
      makeEntry({ slug: "s-" + idx, tags: ["tag-25"] }),
    );
    const { tagCounts } = countPlatformsAndTags(entries);
    expect(tagCounts.get("tag-25")).toBe(1);
  });
  it("countPlatformsAndTags churn 26", () => {
    const entries = Array.from({ length: 2 }, (_, idx) =>
      makeEntry({ slug: "s-" + idx, tags: ["tag-26"] }),
    );
    const { tagCounts } = countPlatformsAndTags(entries);
    expect(tagCounts.get("tag-26")).toBe(2);
  });
  it("countPlatformsAndTags churn 27", () => {
    const entries = Array.from({ length: 3 }, (_, idx) =>
      makeEntry({ slug: "s-" + idx, tags: ["tag-27"] }),
    );
    const { tagCounts } = countPlatformsAndTags(entries);
    expect(tagCounts.get("tag-27")).toBe(3);
  });
  it("countPlatformsAndTags churn 28", () => {
    const entries = Array.from({ length: 4 }, (_, idx) =>
      makeEntry({ slug: "s-" + idx, tags: ["tag-28"] }),
    );
    const { tagCounts } = countPlatformsAndTags(entries);
    expect(tagCounts.get("tag-28")).toBe(4);
  });
  it("countPlatformsAndTags churn 29", () => {
    const entries = Array.from({ length: 5 }, (_, idx) =>
      makeEntry({ slug: "s-" + idx, tags: ["tag-29"] }),
    );
    const { tagCounts } = countPlatformsAndTags(entries);
    expect(tagCounts.get("tag-29")).toBe(5);
  });
  it("countPlatformsAndTags churn 30", () => {
    const entries = Array.from({ length: 1 }, (_, idx) =>
      makeEntry({ slug: "s-" + idx, tags: ["tag-30"] }),
    );
    const { tagCounts } = countPlatformsAndTags(entries);
    expect(tagCounts.get("tag-30")).toBe(1);
  });
  it("countPlatformsAndTags churn 31", () => {
    const entries = Array.from({ length: 2 }, (_, idx) =>
      makeEntry({ slug: "s-" + idx, tags: ["tag-31"] }),
    );
    const { tagCounts } = countPlatformsAndTags(entries);
    expect(tagCounts.get("tag-31")).toBe(2);
  });
  it("countPlatformsAndTags churn 32", () => {
    const entries = Array.from({ length: 3 }, (_, idx) =>
      makeEntry({ slug: "s-" + idx, tags: ["tag-32"] }),
    );
    const { tagCounts } = countPlatformsAndTags(entries);
    expect(tagCounts.get("tag-32")).toBe(3);
  });
  it("countPlatformsAndTags churn 33", () => {
    const entries = Array.from({ length: 4 }, (_, idx) =>
      makeEntry({ slug: "s-" + idx, tags: ["tag-33"] }),
    );
    const { tagCounts } = countPlatformsAndTags(entries);
    expect(tagCounts.get("tag-33")).toBe(4);
  });
  it("countPlatformsAndTags churn 34", () => {
    const entries = Array.from({ length: 5 }, (_, idx) =>
      makeEntry({ slug: "s-" + idx, tags: ["tag-34"] }),
    );
    const { tagCounts } = countPlatformsAndTags(entries);
    expect(tagCounts.get("tag-34")).toBe(5);
  });
  it("countPlatformsAndTags churn 35", () => {
    const entries = Array.from({ length: 1 }, (_, idx) =>
      makeEntry({ slug: "s-" + idx, tags: ["tag-35"] }),
    );
    const { tagCounts } = countPlatformsAndTags(entries);
    expect(tagCounts.get("tag-35")).toBe(1);
  });
  it("countPlatformsAndTags churn 36", () => {
    const entries = Array.from({ length: 2 }, (_, idx) =>
      makeEntry({ slug: "s-" + idx, tags: ["tag-36"] }),
    );
    const { tagCounts } = countPlatformsAndTags(entries);
    expect(tagCounts.get("tag-36")).toBe(2);
  });
  it("countPlatformsAndTags churn 37", () => {
    const entries = Array.from({ length: 3 }, (_, idx) =>
      makeEntry({ slug: "s-" + idx, tags: ["tag-37"] }),
    );
    const { tagCounts } = countPlatformsAndTags(entries);
    expect(tagCounts.get("tag-37")).toBe(3);
  });
  it("countPlatformsAndTags churn 38", () => {
    const entries = Array.from({ length: 4 }, (_, idx) =>
      makeEntry({ slug: "s-" + idx, tags: ["tag-38"] }),
    );
    const { tagCounts } = countPlatformsAndTags(entries);
    expect(tagCounts.get("tag-38")).toBe(4);
  });
  it("countPlatformsAndTags churn 39", () => {
    const entries = Array.from({ length: 5 }, (_, idx) =>
      makeEntry({ slug: "s-" + idx, tags: ["tag-39"] }),
    );
    const { tagCounts } = countPlatformsAndTags(entries);
    expect(tagCounts.get("tag-39")).toBe(5);
  });
  it("countPlatformsAndTags churn 40", () => {
    const entries = Array.from({ length: 1 }, (_, idx) =>
      makeEntry({ slug: "s-" + idx, tags: ["tag-40"] }),
    );
    const { tagCounts } = countPlatformsAndTags(entries);
    expect(tagCounts.get("tag-40")).toBe(1);
  });
  it("countPlatformsAndTags churn 41", () => {
    const entries = Array.from({ length: 2 }, (_, idx) =>
      makeEntry({ slug: "s-" + idx, tags: ["tag-41"] }),
    );
    const { tagCounts } = countPlatformsAndTags(entries);
    expect(tagCounts.get("tag-41")).toBe(2);
  });
  it("countPlatformsAndTags churn 42", () => {
    const entries = Array.from({ length: 3 }, (_, idx) =>
      makeEntry({ slug: "s-" + idx, tags: ["tag-42"] }),
    );
    const { tagCounts } = countPlatformsAndTags(entries);
    expect(tagCounts.get("tag-42")).toBe(3);
  });
  it("countPlatformsAndTags churn 43", () => {
    const entries = Array.from({ length: 4 }, (_, idx) =>
      makeEntry({ slug: "s-" + idx, tags: ["tag-43"] }),
    );
    const { tagCounts } = countPlatformsAndTags(entries);
    expect(tagCounts.get("tag-43")).toBe(4);
  });
  it("countPlatformsAndTags churn 44", () => {
    const entries = Array.from({ length: 5 }, (_, idx) =>
      makeEntry({ slug: "s-" + idx, tags: ["tag-44"] }),
    );
    const { tagCounts } = countPlatformsAndTags(entries);
    expect(tagCounts.get("tag-44")).toBe(5);
  });
  it("countPlatformsAndTags churn 45", () => {
    const entries = Array.from({ length: 1 }, (_, idx) =>
      makeEntry({ slug: "s-" + idx, tags: ["tag-45"] }),
    );
    const { tagCounts } = countPlatformsAndTags(entries);
    expect(tagCounts.get("tag-45")).toBe(1);
  });
  it("countPlatformsAndTags churn 46", () => {
    const entries = Array.from({ length: 2 }, (_, idx) =>
      makeEntry({ slug: "s-" + idx, tags: ["tag-46"] }),
    );
    const { tagCounts } = countPlatformsAndTags(entries);
    expect(tagCounts.get("tag-46")).toBe(2);
  });
  it("countPlatformsAndTags churn 47", () => {
    const entries = Array.from({ length: 3 }, (_, idx) =>
      makeEntry({ slug: "s-" + idx, tags: ["tag-47"] }),
    );
    const { tagCounts } = countPlatformsAndTags(entries);
    expect(tagCounts.get("tag-47")).toBe(3);
  });
  it("countPlatformsAndTags churn 48", () => {
    const entries = Array.from({ length: 4 }, (_, idx) =>
      makeEntry({ slug: "s-" + idx, tags: ["tag-48"] }),
    );
    const { tagCounts } = countPlatformsAndTags(entries);
    expect(tagCounts.get("tag-48")).toBe(4);
  });
  it("countPlatformsAndTags churn 49", () => {
    const entries = Array.from({ length: 5 }, (_, idx) =>
      makeEntry({ slug: "s-" + idx, tags: ["tag-49"] }),
    );
    const { tagCounts } = countPlatformsAndTags(entries);
    expect(tagCounts.get("tag-49")).toBe(5);
  });
  it("countPlatformsAndTags churn 50", () => {
    const entries = Array.from({ length: 1 }, (_, idx) =>
      makeEntry({ slug: "s-" + idx, tags: ["tag-50"] }),
    );
    const { tagCounts } = countPlatformsAndTags(entries);
    expect(tagCounts.get("tag-50")).toBe(1);
  });
  it("countPlatformsAndTags churn 51", () => {
    const entries = Array.from({ length: 2 }, (_, idx) =>
      makeEntry({ slug: "s-" + idx, tags: ["tag-51"] }),
    );
    const { tagCounts } = countPlatformsAndTags(entries);
    expect(tagCounts.get("tag-51")).toBe(2);
  });
  it("countPlatformsAndTags churn 52", () => {
    const entries = Array.from({ length: 3 }, (_, idx) =>
      makeEntry({ slug: "s-" + idx, tags: ["tag-52"] }),
    );
    const { tagCounts } = countPlatformsAndTags(entries);
    expect(tagCounts.get("tag-52")).toBe(3);
  });
  it("countPlatformsAndTags churn 53", () => {
    const entries = Array.from({ length: 4 }, (_, idx) =>
      makeEntry({ slug: "s-" + idx, tags: ["tag-53"] }),
    );
    const { tagCounts } = countPlatformsAndTags(entries);
    expect(tagCounts.get("tag-53")).toBe(4);
  });
  it("countPlatformsAndTags churn 54", () => {
    const entries = Array.from({ length: 5 }, (_, idx) =>
      makeEntry({ slug: "s-" + idx, tags: ["tag-54"] }),
    );
    const { tagCounts } = countPlatformsAndTags(entries);
    expect(tagCounts.get("tag-54")).toBe(5);
  });
  it("countPlatformsAndTags churn 55", () => {
    const entries = Array.from({ length: 1 }, (_, idx) =>
      makeEntry({ slug: "s-" + idx, tags: ["tag-55"] }),
    );
    const { tagCounts } = countPlatformsAndTags(entries);
    expect(tagCounts.get("tag-55")).toBe(1);
  });
  it("countPlatformsAndTags churn 56", () => {
    const entries = Array.from({ length: 2 }, (_, idx) =>
      makeEntry({ slug: "s-" + idx, tags: ["tag-56"] }),
    );
    const { tagCounts } = countPlatformsAndTags(entries);
    expect(tagCounts.get("tag-56")).toBe(2);
  });
  it("countPlatformsAndTags churn 57", () => {
    const entries = Array.from({ length: 3 }, (_, idx) =>
      makeEntry({ slug: "s-" + idx, tags: ["tag-57"] }),
    );
    const { tagCounts } = countPlatformsAndTags(entries);
    expect(tagCounts.get("tag-57")).toBe(3);
  });
  it("countPlatformsAndTags churn 58", () => {
    const entries = Array.from({ length: 4 }, (_, idx) =>
      makeEntry({ slug: "s-" + idx, tags: ["tag-58"] }),
    );
    const { tagCounts } = countPlatformsAndTags(entries);
    expect(tagCounts.get("tag-58")).toBe(4);
  });
  it("countPlatformsAndTags churn 59", () => {
    const entries = Array.from({ length: 5 }, (_, idx) =>
      makeEntry({ slug: "s-" + idx, tags: ["tag-59"] }),
    );
    const { tagCounts } = countPlatformsAndTags(entries);
    expect(tagCounts.get("tag-59")).toBe(5);
  });
});

describe("registry-stats-lib computeRegistryFreshness", () => {
  it("counts repo updates and recent additions", () => {
    const now = Date.parse("2026-06-15T00:00:00.000Z");
    const entries = [
      makeEntry({ repoUpdatedAt: "2026-06-01", dateAdded: "2026-06-01" }),
      makeEntry({ slug: "old", dateAdded: "2025-01-01" }),
    ];
    const freshness = computeRegistryFreshness(entries, now);
    expect(freshness.entriesWithRepoUpdatedAt).toBe(1);
    expect(freshness.entriesAddedLast30Days).toBe(1);
  });
  it("computeRegistryFreshness matrix 0", () => {
    const now = Date.parse("2026-06-15T00:00:00.000Z");
    const added = new Date(now - 0 * 24 * 60 * 60 * 1000).toISOString();
    const entries = [makeEntry({ dateAdded: added })];
    const freshness = computeRegistryFreshness(entries, now);
    expect(freshness.entriesAddedLast30Days).toBe(1);
  });
  it("computeRegistryFreshness matrix 1", () => {
    const now = Date.parse("2026-06-15T00:00:00.000Z");
    const added = new Date(now - 1 * 24 * 60 * 60 * 1000).toISOString();
    const entries = [makeEntry({ dateAdded: added })];
    const freshness = computeRegistryFreshness(entries, now);
    expect(freshness.entriesAddedLast30Days).toBe(1);
  });
  it("computeRegistryFreshness matrix 2", () => {
    const now = Date.parse("2026-06-15T00:00:00.000Z");
    const added = new Date(now - 2 * 24 * 60 * 60 * 1000).toISOString();
    const entries = [makeEntry({ dateAdded: added })];
    const freshness = computeRegistryFreshness(entries, now);
    expect(freshness.entriesAddedLast30Days).toBe(1);
  });
  it("computeRegistryFreshness matrix 3", () => {
    const now = Date.parse("2026-06-15T00:00:00.000Z");
    const added = new Date(now - 3 * 24 * 60 * 60 * 1000).toISOString();
    const entries = [makeEntry({ dateAdded: added })];
    const freshness = computeRegistryFreshness(entries, now);
    expect(freshness.entriesAddedLast30Days).toBe(1);
  });
  it("computeRegistryFreshness matrix 4", () => {
    const now = Date.parse("2026-06-15T00:00:00.000Z");
    const added = new Date(now - 4 * 24 * 60 * 60 * 1000).toISOString();
    const entries = [makeEntry({ dateAdded: added })];
    const freshness = computeRegistryFreshness(entries, now);
    expect(freshness.entriesAddedLast30Days).toBe(1);
  });
  it("computeRegistryFreshness matrix 5", () => {
    const now = Date.parse("2026-06-15T00:00:00.000Z");
    const added = new Date(now - 5 * 24 * 60 * 60 * 1000).toISOString();
    const entries = [makeEntry({ dateAdded: added })];
    const freshness = computeRegistryFreshness(entries, now);
    expect(freshness.entriesAddedLast30Days).toBe(1);
  });
  it("computeRegistryFreshness matrix 6", () => {
    const now = Date.parse("2026-06-15T00:00:00.000Z");
    const added = new Date(now - 6 * 24 * 60 * 60 * 1000).toISOString();
    const entries = [makeEntry({ dateAdded: added })];
    const freshness = computeRegistryFreshness(entries, now);
    expect(freshness.entriesAddedLast30Days).toBe(1);
  });
  it("computeRegistryFreshness matrix 7", () => {
    const now = Date.parse("2026-06-15T00:00:00.000Z");
    const added = new Date(now - 7 * 24 * 60 * 60 * 1000).toISOString();
    const entries = [makeEntry({ dateAdded: added })];
    const freshness = computeRegistryFreshness(entries, now);
    expect(freshness.entriesAddedLast30Days).toBe(1);
  });
  it("computeRegistryFreshness matrix 8", () => {
    const now = Date.parse("2026-06-15T00:00:00.000Z");
    const added = new Date(now - 8 * 24 * 60 * 60 * 1000).toISOString();
    const entries = [makeEntry({ dateAdded: added })];
    const freshness = computeRegistryFreshness(entries, now);
    expect(freshness.entriesAddedLast30Days).toBe(1);
  });
  it("computeRegistryFreshness matrix 9", () => {
    const now = Date.parse("2026-06-15T00:00:00.000Z");
    const added = new Date(now - 9 * 24 * 60 * 60 * 1000).toISOString();
    const entries = [makeEntry({ dateAdded: added })];
    const freshness = computeRegistryFreshness(entries, now);
    expect(freshness.entriesAddedLast30Days).toBe(1);
  });
  it("computeRegistryFreshness matrix 10", () => {
    const now = Date.parse("2026-06-15T00:00:00.000Z");
    const added = new Date(now - 10 * 24 * 60 * 60 * 1000).toISOString();
    const entries = [makeEntry({ dateAdded: added })];
    const freshness = computeRegistryFreshness(entries, now);
    expect(freshness.entriesAddedLast30Days).toBe(1);
  });
  it("computeRegistryFreshness matrix 11", () => {
    const now = Date.parse("2026-06-15T00:00:00.000Z");
    const added = new Date(now - 11 * 24 * 60 * 60 * 1000).toISOString();
    const entries = [makeEntry({ dateAdded: added })];
    const freshness = computeRegistryFreshness(entries, now);
    expect(freshness.entriesAddedLast30Days).toBe(1);
  });
  it("computeRegistryFreshness matrix 12", () => {
    const now = Date.parse("2026-06-15T00:00:00.000Z");
    const added = new Date(now - 12 * 24 * 60 * 60 * 1000).toISOString();
    const entries = [makeEntry({ dateAdded: added })];
    const freshness = computeRegistryFreshness(entries, now);
    expect(freshness.entriesAddedLast30Days).toBe(1);
  });
  it("computeRegistryFreshness matrix 13", () => {
    const now = Date.parse("2026-06-15T00:00:00.000Z");
    const added = new Date(now - 13 * 24 * 60 * 60 * 1000).toISOString();
    const entries = [makeEntry({ dateAdded: added })];
    const freshness = computeRegistryFreshness(entries, now);
    expect(freshness.entriesAddedLast30Days).toBe(1);
  });
  it("computeRegistryFreshness matrix 14", () => {
    const now = Date.parse("2026-06-15T00:00:00.000Z");
    const added = new Date(now - 14 * 24 * 60 * 60 * 1000).toISOString();
    const entries = [makeEntry({ dateAdded: added })];
    const freshness = computeRegistryFreshness(entries, now);
    expect(freshness.entriesAddedLast30Days).toBe(1);
  });
  it("computeRegistryFreshness matrix 15", () => {
    const now = Date.parse("2026-06-15T00:00:00.000Z");
    const added = new Date(now - 15 * 24 * 60 * 60 * 1000).toISOString();
    const entries = [makeEntry({ dateAdded: added })];
    const freshness = computeRegistryFreshness(entries, now);
    expect(freshness.entriesAddedLast30Days).toBe(1);
  });
  it("computeRegistryFreshness matrix 16", () => {
    const now = Date.parse("2026-06-15T00:00:00.000Z");
    const added = new Date(now - 16 * 24 * 60 * 60 * 1000).toISOString();
    const entries = [makeEntry({ dateAdded: added })];
    const freshness = computeRegistryFreshness(entries, now);
    expect(freshness.entriesAddedLast30Days).toBe(1);
  });
  it("computeRegistryFreshness matrix 17", () => {
    const now = Date.parse("2026-06-15T00:00:00.000Z");
    const added = new Date(now - 17 * 24 * 60 * 60 * 1000).toISOString();
    const entries = [makeEntry({ dateAdded: added })];
    const freshness = computeRegistryFreshness(entries, now);
    expect(freshness.entriesAddedLast30Days).toBe(1);
  });
  it("computeRegistryFreshness matrix 18", () => {
    const now = Date.parse("2026-06-15T00:00:00.000Z");
    const added = new Date(now - 18 * 24 * 60 * 60 * 1000).toISOString();
    const entries = [makeEntry({ dateAdded: added })];
    const freshness = computeRegistryFreshness(entries, now);
    expect(freshness.entriesAddedLast30Days).toBe(1);
  });
  it("computeRegistryFreshness matrix 19", () => {
    const now = Date.parse("2026-06-15T00:00:00.000Z");
    const added = new Date(now - 19 * 24 * 60 * 60 * 1000).toISOString();
    const entries = [makeEntry({ dateAdded: added })];
    const freshness = computeRegistryFreshness(entries, now);
    expect(freshness.entriesAddedLast30Days).toBe(1);
  });
  it("computeRegistryFreshness matrix 20", () => {
    const now = Date.parse("2026-06-15T00:00:00.000Z");
    const added = new Date(now - 20 * 24 * 60 * 60 * 1000).toISOString();
    const entries = [makeEntry({ dateAdded: added })];
    const freshness = computeRegistryFreshness(entries, now);
    expect(freshness.entriesAddedLast30Days).toBe(1);
  });
  it("computeRegistryFreshness matrix 21", () => {
    const now = Date.parse("2026-06-15T00:00:00.000Z");
    const added = new Date(now - 21 * 24 * 60 * 60 * 1000).toISOString();
    const entries = [makeEntry({ dateAdded: added })];
    const freshness = computeRegistryFreshness(entries, now);
    expect(freshness.entriesAddedLast30Days).toBe(1);
  });
  it("computeRegistryFreshness matrix 22", () => {
    const now = Date.parse("2026-06-15T00:00:00.000Z");
    const added = new Date(now - 22 * 24 * 60 * 60 * 1000).toISOString();
    const entries = [makeEntry({ dateAdded: added })];
    const freshness = computeRegistryFreshness(entries, now);
    expect(freshness.entriesAddedLast30Days).toBe(1);
  });
  it("computeRegistryFreshness matrix 23", () => {
    const now = Date.parse("2026-06-15T00:00:00.000Z");
    const added = new Date(now - 23 * 24 * 60 * 60 * 1000).toISOString();
    const entries = [makeEntry({ dateAdded: added })];
    const freshness = computeRegistryFreshness(entries, now);
    expect(freshness.entriesAddedLast30Days).toBe(1);
  });
  it("computeRegistryFreshness matrix 24", () => {
    const now = Date.parse("2026-06-15T00:00:00.000Z");
    const added = new Date(now - 24 * 24 * 60 * 60 * 1000).toISOString();
    const entries = [makeEntry({ dateAdded: added })];
    const freshness = computeRegistryFreshness(entries, now);
    expect(freshness.entriesAddedLast30Days).toBe(1);
  });
  it("computeRegistryFreshness matrix 25", () => {
    const now = Date.parse("2026-06-15T00:00:00.000Z");
    const added = new Date(now - 25 * 24 * 60 * 60 * 1000).toISOString();
    const entries = [makeEntry({ dateAdded: added })];
    const freshness = computeRegistryFreshness(entries, now);
    expect(freshness.entriesAddedLast30Days).toBe(1);
  });
  it("computeRegistryFreshness matrix 26", () => {
    const now = Date.parse("2026-06-15T00:00:00.000Z");
    const added = new Date(now - 26 * 24 * 60 * 60 * 1000).toISOString();
    const entries = [makeEntry({ dateAdded: added })];
    const freshness = computeRegistryFreshness(entries, now);
    expect(freshness.entriesAddedLast30Days).toBe(1);
  });
  it("computeRegistryFreshness matrix 27", () => {
    const now = Date.parse("2026-06-15T00:00:00.000Z");
    const added = new Date(now - 27 * 24 * 60 * 60 * 1000).toISOString();
    const entries = [makeEntry({ dateAdded: added })];
    const freshness = computeRegistryFreshness(entries, now);
    expect(freshness.entriesAddedLast30Days).toBe(1);
  });
  it("computeRegistryFreshness matrix 28", () => {
    const now = Date.parse("2026-06-15T00:00:00.000Z");
    const added = new Date(now - 28 * 24 * 60 * 60 * 1000).toISOString();
    const entries = [makeEntry({ dateAdded: added })];
    const freshness = computeRegistryFreshness(entries, now);
    expect(freshness.entriesAddedLast30Days).toBe(1);
  });
  it("computeRegistryFreshness matrix 29", () => {
    const now = Date.parse("2026-06-15T00:00:00.000Z");
    const added = new Date(now - 29 * 24 * 60 * 60 * 1000).toISOString();
    const entries = [makeEntry({ dateAdded: added })];
    const freshness = computeRegistryFreshness(entries, now);
    expect(freshness.entriesAddedLast30Days).toBe(1);
  });
  it("computeRegistryFreshness matrix 30", () => {
    const now = Date.parse("2026-06-15T00:00:00.000Z");
    const added = new Date(now - 30 * 24 * 60 * 60 * 1000).toISOString();
    const entries = [makeEntry({ dateAdded: added })];
    const freshness = computeRegistryFreshness(entries, now);
    expect(freshness.entriesAddedLast30Days).toBe(1);
  });
  it("computeRegistryFreshness matrix 31", () => {
    const now = Date.parse("2026-06-15T00:00:00.000Z");
    const added = new Date(now - 31 * 24 * 60 * 60 * 1000).toISOString();
    const entries = [makeEntry({ dateAdded: added })];
    const freshness = computeRegistryFreshness(entries, now);
    expect(freshness.entriesAddedLast30Days).toBe(0);
  });
  it("computeRegistryFreshness matrix 32", () => {
    const now = Date.parse("2026-06-15T00:00:00.000Z");
    const added = new Date(now - 32 * 24 * 60 * 60 * 1000).toISOString();
    const entries = [makeEntry({ dateAdded: added })];
    const freshness = computeRegistryFreshness(entries, now);
    expect(freshness.entriesAddedLast30Days).toBe(0);
  });
  it("computeRegistryFreshness matrix 33", () => {
    const now = Date.parse("2026-06-15T00:00:00.000Z");
    const added = new Date(now - 33 * 24 * 60 * 60 * 1000).toISOString();
    const entries = [makeEntry({ dateAdded: added })];
    const freshness = computeRegistryFreshness(entries, now);
    expect(freshness.entriesAddedLast30Days).toBe(0);
  });
  it("computeRegistryFreshness matrix 34", () => {
    const now = Date.parse("2026-06-15T00:00:00.000Z");
    const added = new Date(now - 34 * 24 * 60 * 60 * 1000).toISOString();
    const entries = [makeEntry({ dateAdded: added })];
    const freshness = computeRegistryFreshness(entries, now);
    expect(freshness.entriesAddedLast30Days).toBe(0);
  });
  it("computeRegistryFreshness matrix 35", () => {
    const now = Date.parse("2026-06-15T00:00:00.000Z");
    const added = new Date(now - 35 * 24 * 60 * 60 * 1000).toISOString();
    const entries = [makeEntry({ dateAdded: added })];
    const freshness = computeRegistryFreshness(entries, now);
    expect(freshness.entriesAddedLast30Days).toBe(0);
  });
  it("computeRegistryFreshness matrix 36", () => {
    const now = Date.parse("2026-06-15T00:00:00.000Z");
    const added = new Date(now - 36 * 24 * 60 * 60 * 1000).toISOString();
    const entries = [makeEntry({ dateAdded: added })];
    const freshness = computeRegistryFreshness(entries, now);
    expect(freshness.entriesAddedLast30Days).toBe(0);
  });
  it("computeRegistryFreshness matrix 37", () => {
    const now = Date.parse("2026-06-15T00:00:00.000Z");
    const added = new Date(now - 37 * 24 * 60 * 60 * 1000).toISOString();
    const entries = [makeEntry({ dateAdded: added })];
    const freshness = computeRegistryFreshness(entries, now);
    expect(freshness.entriesAddedLast30Days).toBe(0);
  });
  it("computeRegistryFreshness matrix 38", () => {
    const now = Date.parse("2026-06-15T00:00:00.000Z");
    const added = new Date(now - 38 * 24 * 60 * 60 * 1000).toISOString();
    const entries = [makeEntry({ dateAdded: added })];
    const freshness = computeRegistryFreshness(entries, now);
    expect(freshness.entriesAddedLast30Days).toBe(0);
  });
  it("computeRegistryFreshness matrix 39", () => {
    const now = Date.parse("2026-06-15T00:00:00.000Z");
    const added = new Date(now - 39 * 24 * 60 * 60 * 1000).toISOString();
    const entries = [makeEntry({ dateAdded: added })];
    const freshness = computeRegistryFreshness(entries, now);
    expect(freshness.entriesAddedLast30Days).toBe(0);
  });
  it("computeRegistryFreshness matrix 40", () => {
    const now = Date.parse("2026-06-15T00:00:00.000Z");
    const added = new Date(now - 0 * 24 * 60 * 60 * 1000).toISOString();
    const entries = [makeEntry({ dateAdded: added })];
    const freshness = computeRegistryFreshness(entries, now);
    expect(freshness.entriesAddedLast30Days).toBe(1);
  });
  it("computeRegistryFreshness matrix 41", () => {
    const now = Date.parse("2026-06-15T00:00:00.000Z");
    const added = new Date(now - 1 * 24 * 60 * 60 * 1000).toISOString();
    const entries = [makeEntry({ dateAdded: added })];
    const freshness = computeRegistryFreshness(entries, now);
    expect(freshness.entriesAddedLast30Days).toBe(1);
  });
  it("computeRegistryFreshness matrix 42", () => {
    const now = Date.parse("2026-06-15T00:00:00.000Z");
    const added = new Date(now - 2 * 24 * 60 * 60 * 1000).toISOString();
    const entries = [makeEntry({ dateAdded: added })];
    const freshness = computeRegistryFreshness(entries, now);
    expect(freshness.entriesAddedLast30Days).toBe(1);
  });
  it("computeRegistryFreshness matrix 43", () => {
    const now = Date.parse("2026-06-15T00:00:00.000Z");
    const added = new Date(now - 3 * 24 * 60 * 60 * 1000).toISOString();
    const entries = [makeEntry({ dateAdded: added })];
    const freshness = computeRegistryFreshness(entries, now);
    expect(freshness.entriesAddedLast30Days).toBe(1);
  });
  it("computeRegistryFreshness matrix 44", () => {
    const now = Date.parse("2026-06-15T00:00:00.000Z");
    const added = new Date(now - 4 * 24 * 60 * 60 * 1000).toISOString();
    const entries = [makeEntry({ dateAdded: added })];
    const freshness = computeRegistryFreshness(entries, now);
    expect(freshness.entriesAddedLast30Days).toBe(1);
  });
  it("computeRegistryFreshness matrix 45", () => {
    const now = Date.parse("2026-06-15T00:00:00.000Z");
    const added = new Date(now - 5 * 24 * 60 * 60 * 1000).toISOString();
    const entries = [makeEntry({ dateAdded: added })];
    const freshness = computeRegistryFreshness(entries, now);
    expect(freshness.entriesAddedLast30Days).toBe(1);
  });
  it("computeRegistryFreshness matrix 46", () => {
    const now = Date.parse("2026-06-15T00:00:00.000Z");
    const added = new Date(now - 6 * 24 * 60 * 60 * 1000).toISOString();
    const entries = [makeEntry({ dateAdded: added })];
    const freshness = computeRegistryFreshness(entries, now);
    expect(freshness.entriesAddedLast30Days).toBe(1);
  });
  it("computeRegistryFreshness matrix 47", () => {
    const now = Date.parse("2026-06-15T00:00:00.000Z");
    const added = new Date(now - 7 * 24 * 60 * 60 * 1000).toISOString();
    const entries = [makeEntry({ dateAdded: added })];
    const freshness = computeRegistryFreshness(entries, now);
    expect(freshness.entriesAddedLast30Days).toBe(1);
  });
  it("computeRegistryFreshness matrix 48", () => {
    const now = Date.parse("2026-06-15T00:00:00.000Z");
    const added = new Date(now - 8 * 24 * 60 * 60 * 1000).toISOString();
    const entries = [makeEntry({ dateAdded: added })];
    const freshness = computeRegistryFreshness(entries, now);
    expect(freshness.entriesAddedLast30Days).toBe(1);
  });
  it("computeRegistryFreshness matrix 49", () => {
    const now = Date.parse("2026-06-15T00:00:00.000Z");
    const added = new Date(now - 9 * 24 * 60 * 60 * 1000).toISOString();
    const entries = [makeEntry({ dateAdded: added })];
    const freshness = computeRegistryFreshness(entries, now);
    expect(freshness.entriesAddedLast30Days).toBe(1);
  });
  it("computeRegistryFreshness matrix 50", () => {
    const now = Date.parse("2026-06-15T00:00:00.000Z");
    const added = new Date(now - 10 * 24 * 60 * 60 * 1000).toISOString();
    const entries = [makeEntry({ dateAdded: added })];
    const freshness = computeRegistryFreshness(entries, now);
    expect(freshness.entriesAddedLast30Days).toBe(1);
  });
  it("computeRegistryFreshness matrix 51", () => {
    const now = Date.parse("2026-06-15T00:00:00.000Z");
    const added = new Date(now - 11 * 24 * 60 * 60 * 1000).toISOString();
    const entries = [makeEntry({ dateAdded: added })];
    const freshness = computeRegistryFreshness(entries, now);
    expect(freshness.entriesAddedLast30Days).toBe(1);
  });
  it("computeRegistryFreshness matrix 52", () => {
    const now = Date.parse("2026-06-15T00:00:00.000Z");
    const added = new Date(now - 12 * 24 * 60 * 60 * 1000).toISOString();
    const entries = [makeEntry({ dateAdded: added })];
    const freshness = computeRegistryFreshness(entries, now);
    expect(freshness.entriesAddedLast30Days).toBe(1);
  });
  it("computeRegistryFreshness matrix 53", () => {
    const now = Date.parse("2026-06-15T00:00:00.000Z");
    const added = new Date(now - 13 * 24 * 60 * 60 * 1000).toISOString();
    const entries = [makeEntry({ dateAdded: added })];
    const freshness = computeRegistryFreshness(entries, now);
    expect(freshness.entriesAddedLast30Days).toBe(1);
  });
  it("computeRegistryFreshness matrix 54", () => {
    const now = Date.parse("2026-06-15T00:00:00.000Z");
    const added = new Date(now - 14 * 24 * 60 * 60 * 1000).toISOString();
    const entries = [makeEntry({ dateAdded: added })];
    const freshness = computeRegistryFreshness(entries, now);
    expect(freshness.entriesAddedLast30Days).toBe(1);
  });
  it("computeRegistryFreshness matrix 55", () => {
    const now = Date.parse("2026-06-15T00:00:00.000Z");
    const added = new Date(now - 15 * 24 * 60 * 60 * 1000).toISOString();
    const entries = [makeEntry({ dateAdded: added })];
    const freshness = computeRegistryFreshness(entries, now);
    expect(freshness.entriesAddedLast30Days).toBe(1);
  });
  it("computeRegistryFreshness matrix 56", () => {
    const now = Date.parse("2026-06-15T00:00:00.000Z");
    const added = new Date(now - 16 * 24 * 60 * 60 * 1000).toISOString();
    const entries = [makeEntry({ dateAdded: added })];
    const freshness = computeRegistryFreshness(entries, now);
    expect(freshness.entriesAddedLast30Days).toBe(1);
  });
  it("computeRegistryFreshness matrix 57", () => {
    const now = Date.parse("2026-06-15T00:00:00.000Z");
    const added = new Date(now - 17 * 24 * 60 * 60 * 1000).toISOString();
    const entries = [makeEntry({ dateAdded: added })];
    const freshness = computeRegistryFreshness(entries, now);
    expect(freshness.entriesAddedLast30Days).toBe(1);
  });
  it("computeRegistryFreshness matrix 58", () => {
    const now = Date.parse("2026-06-15T00:00:00.000Z");
    const added = new Date(now - 18 * 24 * 60 * 60 * 1000).toISOString();
    const entries = [makeEntry({ dateAdded: added })];
    const freshness = computeRegistryFreshness(entries, now);
    expect(freshness.entriesAddedLast30Days).toBe(1);
  });
  it("computeRegistryFreshness matrix 59", () => {
    const now = Date.parse("2026-06-15T00:00:00.000Z");
    const added = new Date(now - 19 * 24 * 60 * 60 * 1000).toISOString();
    const entries = [makeEntry({ dateAdded: added })];
    const freshness = computeRegistryFreshness(entries, now);
    expect(freshness.entriesAddedLast30Days).toBe(1);
  });
  it("computeRegistryFreshness matrix 60", () => {
    const now = Date.parse("2026-06-15T00:00:00.000Z");
    const added = new Date(now - 20 * 24 * 60 * 60 * 1000).toISOString();
    const entries = [makeEntry({ dateAdded: added })];
    const freshness = computeRegistryFreshness(entries, now);
    expect(freshness.entriesAddedLast30Days).toBe(1);
  });
  it("computeRegistryFreshness matrix 61", () => {
    const now = Date.parse("2026-06-15T00:00:00.000Z");
    const added = new Date(now - 21 * 24 * 60 * 60 * 1000).toISOString();
    const entries = [makeEntry({ dateAdded: added })];
    const freshness = computeRegistryFreshness(entries, now);
    expect(freshness.entriesAddedLast30Days).toBe(1);
  });
  it("computeRegistryFreshness matrix 62", () => {
    const now = Date.parse("2026-06-15T00:00:00.000Z");
    const added = new Date(now - 22 * 24 * 60 * 60 * 1000).toISOString();
    const entries = [makeEntry({ dateAdded: added })];
    const freshness = computeRegistryFreshness(entries, now);
    expect(freshness.entriesAddedLast30Days).toBe(1);
  });
  it("computeRegistryFreshness matrix 63", () => {
    const now = Date.parse("2026-06-15T00:00:00.000Z");
    const added = new Date(now - 23 * 24 * 60 * 60 * 1000).toISOString();
    const entries = [makeEntry({ dateAdded: added })];
    const freshness = computeRegistryFreshness(entries, now);
    expect(freshness.entriesAddedLast30Days).toBe(1);
  });
  it("computeRegistryFreshness matrix 64", () => {
    const now = Date.parse("2026-06-15T00:00:00.000Z");
    const added = new Date(now - 24 * 24 * 60 * 60 * 1000).toISOString();
    const entries = [makeEntry({ dateAdded: added })];
    const freshness = computeRegistryFreshness(entries, now);
    expect(freshness.entriesAddedLast30Days).toBe(1);
  });
  it("computeRegistryFreshness matrix 65", () => {
    const now = Date.parse("2026-06-15T00:00:00.000Z");
    const added = new Date(now - 25 * 24 * 60 * 60 * 1000).toISOString();
    const entries = [makeEntry({ dateAdded: added })];
    const freshness = computeRegistryFreshness(entries, now);
    expect(freshness.entriesAddedLast30Days).toBe(1);
  });
  it("computeRegistryFreshness matrix 66", () => {
    const now = Date.parse("2026-06-15T00:00:00.000Z");
    const added = new Date(now - 26 * 24 * 60 * 60 * 1000).toISOString();
    const entries = [makeEntry({ dateAdded: added })];
    const freshness = computeRegistryFreshness(entries, now);
    expect(freshness.entriesAddedLast30Days).toBe(1);
  });
  it("computeRegistryFreshness matrix 67", () => {
    const now = Date.parse("2026-06-15T00:00:00.000Z");
    const added = new Date(now - 27 * 24 * 60 * 60 * 1000).toISOString();
    const entries = [makeEntry({ dateAdded: added })];
    const freshness = computeRegistryFreshness(entries, now);
    expect(freshness.entriesAddedLast30Days).toBe(1);
  });
  it("computeRegistryFreshness matrix 68", () => {
    const now = Date.parse("2026-06-15T00:00:00.000Z");
    const added = new Date(now - 28 * 24 * 60 * 60 * 1000).toISOString();
    const entries = [makeEntry({ dateAdded: added })];
    const freshness = computeRegistryFreshness(entries, now);
    expect(freshness.entriesAddedLast30Days).toBe(1);
  });
  it("computeRegistryFreshness matrix 69", () => {
    const now = Date.parse("2026-06-15T00:00:00.000Z");
    const added = new Date(now - 29 * 24 * 60 * 60 * 1000).toISOString();
    const entries = [makeEntry({ dateAdded: added })];
    const freshness = computeRegistryFreshness(entries, now);
    expect(freshness.entriesAddedLast30Days).toBe(1);
  });
  it("computeRegistryFreshness matrix 70", () => {
    const now = Date.parse("2026-06-15T00:00:00.000Z");
    const added = new Date(now - 30 * 24 * 60 * 60 * 1000).toISOString();
    const entries = [makeEntry({ dateAdded: added })];
    const freshness = computeRegistryFreshness(entries, now);
    expect(freshness.entriesAddedLast30Days).toBe(1);
  });
  it("computeRegistryFreshness matrix 71", () => {
    const now = Date.parse("2026-06-15T00:00:00.000Z");
    const added = new Date(now - 31 * 24 * 60 * 60 * 1000).toISOString();
    const entries = [makeEntry({ dateAdded: added })];
    const freshness = computeRegistryFreshness(entries, now);
    expect(freshness.entriesAddedLast30Days).toBe(0);
  });
  it("computeRegistryFreshness matrix 72", () => {
    const now = Date.parse("2026-06-15T00:00:00.000Z");
    const added = new Date(now - 32 * 24 * 60 * 60 * 1000).toISOString();
    const entries = [makeEntry({ dateAdded: added })];
    const freshness = computeRegistryFreshness(entries, now);
    expect(freshness.entriesAddedLast30Days).toBe(0);
  });
  it("computeRegistryFreshness matrix 73", () => {
    const now = Date.parse("2026-06-15T00:00:00.000Z");
    const added = new Date(now - 33 * 24 * 60 * 60 * 1000).toISOString();
    const entries = [makeEntry({ dateAdded: added })];
    const freshness = computeRegistryFreshness(entries, now);
    expect(freshness.entriesAddedLast30Days).toBe(0);
  });
  it("computeRegistryFreshness matrix 74", () => {
    const now = Date.parse("2026-06-15T00:00:00.000Z");
    const added = new Date(now - 34 * 24 * 60 * 60 * 1000).toISOString();
    const entries = [makeEntry({ dateAdded: added })];
    const freshness = computeRegistryFreshness(entries, now);
    expect(freshness.entriesAddedLast30Days).toBe(0);
  });
  it("computeRegistryFreshness matrix 75", () => {
    const now = Date.parse("2026-06-15T00:00:00.000Z");
    const added = new Date(now - 35 * 24 * 60 * 60 * 1000).toISOString();
    const entries = [makeEntry({ dateAdded: added })];
    const freshness = computeRegistryFreshness(entries, now);
    expect(freshness.entriesAddedLast30Days).toBe(0);
  });
  it("computeRegistryFreshness matrix 76", () => {
    const now = Date.parse("2026-06-15T00:00:00.000Z");
    const added = new Date(now - 36 * 24 * 60 * 60 * 1000).toISOString();
    const entries = [makeEntry({ dateAdded: added })];
    const freshness = computeRegistryFreshness(entries, now);
    expect(freshness.entriesAddedLast30Days).toBe(0);
  });
  it("computeRegistryFreshness matrix 77", () => {
    const now = Date.parse("2026-06-15T00:00:00.000Z");
    const added = new Date(now - 37 * 24 * 60 * 60 * 1000).toISOString();
    const entries = [makeEntry({ dateAdded: added })];
    const freshness = computeRegistryFreshness(entries, now);
    expect(freshness.entriesAddedLast30Days).toBe(0);
  });
  it("computeRegistryFreshness matrix 78", () => {
    const now = Date.parse("2026-06-15T00:00:00.000Z");
    const added = new Date(now - 38 * 24 * 60 * 60 * 1000).toISOString();
    const entries = [makeEntry({ dateAdded: added })];
    const freshness = computeRegistryFreshness(entries, now);
    expect(freshness.entriesAddedLast30Days).toBe(0);
  });
  it("computeRegistryFreshness matrix 79", () => {
    const now = Date.parse("2026-06-15T00:00:00.000Z");
    const added = new Date(now - 39 * 24 * 60 * 60 * 1000).toISOString();
    const entries = [makeEntry({ dateAdded: added })];
    const freshness = computeRegistryFreshness(entries, now);
    expect(freshness.entriesAddedLast30Days).toBe(0);
  });
});

describe("registry-stats-lib computeSourceSignalCounts", () => {
  it("counts github stats and installable entries", () => {
    const entries = [
      makeEntry({ githubStars: 10, installable: true }),
      makeEntry({ slug: "plain" }),
    ];
    const signals = computeSourceSignalCounts(entries);
    expect(signals.entriesWithGithubStats).toBe(1);
    expect(signals.installableEntries).toBe(1);
  });
  it("computeSourceSignalCounts churn 0", () => {
    const entries = [makeEntry({ githubStars: 0, installable: true })];
    const signals = computeSourceSignalCounts(entries);
    expect(signals.entriesWithGithubStats).toBe(1);
  });
  it("computeSourceSignalCounts churn 1", () => {
    const entries = [makeEntry({ githubStars: 1, installable: false })];
    const signals = computeSourceSignalCounts(entries);
    expect(signals.entriesWithGithubStats).toBe(1);
  });
  it("computeSourceSignalCounts churn 2", () => {
    const entries = [makeEntry({ githubStars: 2, installable: true })];
    const signals = computeSourceSignalCounts(entries);
    expect(signals.entriesWithGithubStats).toBe(1);
  });
  it("computeSourceSignalCounts churn 3", () => {
    const entries = [makeEntry({ githubStars: 3, installable: false })];
    const signals = computeSourceSignalCounts(entries);
    expect(signals.entriesWithGithubStats).toBe(1);
  });
  it("computeSourceSignalCounts churn 4", () => {
    const entries = [makeEntry({ githubStars: 4, installable: true })];
    const signals = computeSourceSignalCounts(entries);
    expect(signals.entriesWithGithubStats).toBe(1);
  });
  it("computeSourceSignalCounts churn 5", () => {
    const entries = [makeEntry({ githubStars: 5, installable: false })];
    const signals = computeSourceSignalCounts(entries);
    expect(signals.entriesWithGithubStats).toBe(1);
  });
  it("computeSourceSignalCounts churn 6", () => {
    const entries = [makeEntry({ githubStars: 6, installable: true })];
    const signals = computeSourceSignalCounts(entries);
    expect(signals.entriesWithGithubStats).toBe(1);
  });
  it("computeSourceSignalCounts churn 7", () => {
    const entries = [makeEntry({ githubStars: 7, installable: false })];
    const signals = computeSourceSignalCounts(entries);
    expect(signals.entriesWithGithubStats).toBe(1);
  });
  it("computeSourceSignalCounts churn 8", () => {
    const entries = [makeEntry({ githubStars: 8, installable: true })];
    const signals = computeSourceSignalCounts(entries);
    expect(signals.entriesWithGithubStats).toBe(1);
  });
  it("computeSourceSignalCounts churn 9", () => {
    const entries = [makeEntry({ githubStars: 9, installable: false })];
    const signals = computeSourceSignalCounts(entries);
    expect(signals.entriesWithGithubStats).toBe(1);
  });
  it("computeSourceSignalCounts churn 10", () => {
    const entries = [makeEntry({ githubStars: 10, installable: true })];
    const signals = computeSourceSignalCounts(entries);
    expect(signals.entriesWithGithubStats).toBe(1);
  });
  it("computeSourceSignalCounts churn 11", () => {
    const entries = [makeEntry({ githubStars: 11, installable: false })];
    const signals = computeSourceSignalCounts(entries);
    expect(signals.entriesWithGithubStats).toBe(1);
  });
  it("computeSourceSignalCounts churn 12", () => {
    const entries = [makeEntry({ githubStars: 12, installable: true })];
    const signals = computeSourceSignalCounts(entries);
    expect(signals.entriesWithGithubStats).toBe(1);
  });
  it("computeSourceSignalCounts churn 13", () => {
    const entries = [makeEntry({ githubStars: 13, installable: false })];
    const signals = computeSourceSignalCounts(entries);
    expect(signals.entriesWithGithubStats).toBe(1);
  });
  it("computeSourceSignalCounts churn 14", () => {
    const entries = [makeEntry({ githubStars: 14, installable: true })];
    const signals = computeSourceSignalCounts(entries);
    expect(signals.entriesWithGithubStats).toBe(1);
  });
  it("computeSourceSignalCounts churn 15", () => {
    const entries = [makeEntry({ githubStars: 15, installable: false })];
    const signals = computeSourceSignalCounts(entries);
    expect(signals.entriesWithGithubStats).toBe(1);
  });
  it("computeSourceSignalCounts churn 16", () => {
    const entries = [makeEntry({ githubStars: 16, installable: true })];
    const signals = computeSourceSignalCounts(entries);
    expect(signals.entriesWithGithubStats).toBe(1);
  });
  it("computeSourceSignalCounts churn 17", () => {
    const entries = [makeEntry({ githubStars: 17, installable: false })];
    const signals = computeSourceSignalCounts(entries);
    expect(signals.entriesWithGithubStats).toBe(1);
  });
  it("computeSourceSignalCounts churn 18", () => {
    const entries = [makeEntry({ githubStars: 18, installable: true })];
    const signals = computeSourceSignalCounts(entries);
    expect(signals.entriesWithGithubStats).toBe(1);
  });
  it("computeSourceSignalCounts churn 19", () => {
    const entries = [makeEntry({ githubStars: 19, installable: false })];
    const signals = computeSourceSignalCounts(entries);
    expect(signals.entriesWithGithubStats).toBe(1);
  });
  it("computeSourceSignalCounts churn 20", () => {
    const entries = [makeEntry({ githubStars: 20, installable: true })];
    const signals = computeSourceSignalCounts(entries);
    expect(signals.entriesWithGithubStats).toBe(1);
  });
  it("computeSourceSignalCounts churn 21", () => {
    const entries = [makeEntry({ githubStars: 21, installable: false })];
    const signals = computeSourceSignalCounts(entries);
    expect(signals.entriesWithGithubStats).toBe(1);
  });
  it("computeSourceSignalCounts churn 22", () => {
    const entries = [makeEntry({ githubStars: 22, installable: true })];
    const signals = computeSourceSignalCounts(entries);
    expect(signals.entriesWithGithubStats).toBe(1);
  });
  it("computeSourceSignalCounts churn 23", () => {
    const entries = [makeEntry({ githubStars: 23, installable: false })];
    const signals = computeSourceSignalCounts(entries);
    expect(signals.entriesWithGithubStats).toBe(1);
  });
  it("computeSourceSignalCounts churn 24", () => {
    const entries = [makeEntry({ githubStars: 24, installable: true })];
    const signals = computeSourceSignalCounts(entries);
    expect(signals.entriesWithGithubStats).toBe(1);
  });
  it("computeSourceSignalCounts churn 25", () => {
    const entries = [makeEntry({ githubStars: 25, installable: false })];
    const signals = computeSourceSignalCounts(entries);
    expect(signals.entriesWithGithubStats).toBe(1);
  });
  it("computeSourceSignalCounts churn 26", () => {
    const entries = [makeEntry({ githubStars: 26, installable: true })];
    const signals = computeSourceSignalCounts(entries);
    expect(signals.entriesWithGithubStats).toBe(1);
  });
  it("computeSourceSignalCounts churn 27", () => {
    const entries = [makeEntry({ githubStars: 27, installable: false })];
    const signals = computeSourceSignalCounts(entries);
    expect(signals.entriesWithGithubStats).toBe(1);
  });
  it("computeSourceSignalCounts churn 28", () => {
    const entries = [makeEntry({ githubStars: 28, installable: true })];
    const signals = computeSourceSignalCounts(entries);
    expect(signals.entriesWithGithubStats).toBe(1);
  });
  it("computeSourceSignalCounts churn 29", () => {
    const entries = [makeEntry({ githubStars: 29, installable: false })];
    const signals = computeSourceSignalCounts(entries);
    expect(signals.entriesWithGithubStats).toBe(1);
  });
  it("computeSourceSignalCounts churn 30", () => {
    const entries = [makeEntry({ githubStars: 30, installable: true })];
    const signals = computeSourceSignalCounts(entries);
    expect(signals.entriesWithGithubStats).toBe(1);
  });
  it("computeSourceSignalCounts churn 31", () => {
    const entries = [makeEntry({ githubStars: 31, installable: false })];
    const signals = computeSourceSignalCounts(entries);
    expect(signals.entriesWithGithubStats).toBe(1);
  });
  it("computeSourceSignalCounts churn 32", () => {
    const entries = [makeEntry({ githubStars: 32, installable: true })];
    const signals = computeSourceSignalCounts(entries);
    expect(signals.entriesWithGithubStats).toBe(1);
  });
  it("computeSourceSignalCounts churn 33", () => {
    const entries = [makeEntry({ githubStars: 33, installable: false })];
    const signals = computeSourceSignalCounts(entries);
    expect(signals.entriesWithGithubStats).toBe(1);
  });
  it("computeSourceSignalCounts churn 34", () => {
    const entries = [makeEntry({ githubStars: 34, installable: true })];
    const signals = computeSourceSignalCounts(entries);
    expect(signals.entriesWithGithubStats).toBe(1);
  });
  it("computeSourceSignalCounts churn 35", () => {
    const entries = [makeEntry({ githubStars: 35, installable: false })];
    const signals = computeSourceSignalCounts(entries);
    expect(signals.entriesWithGithubStats).toBe(1);
  });
  it("computeSourceSignalCounts churn 36", () => {
    const entries = [makeEntry({ githubStars: 36, installable: true })];
    const signals = computeSourceSignalCounts(entries);
    expect(signals.entriesWithGithubStats).toBe(1);
  });
  it("computeSourceSignalCounts churn 37", () => {
    const entries = [makeEntry({ githubStars: 37, installable: false })];
    const signals = computeSourceSignalCounts(entries);
    expect(signals.entriesWithGithubStats).toBe(1);
  });
  it("computeSourceSignalCounts churn 38", () => {
    const entries = [makeEntry({ githubStars: 38, installable: true })];
    const signals = computeSourceSignalCounts(entries);
    expect(signals.entriesWithGithubStats).toBe(1);
  });
  it("computeSourceSignalCounts churn 39", () => {
    const entries = [makeEntry({ githubStars: 39, installable: false })];
    const signals = computeSourceSignalCounts(entries);
    expect(signals.entriesWithGithubStats).toBe(1);
  });
  it("computeSourceSignalCounts churn 40", () => {
    const entries = [makeEntry({ githubStars: 40, installable: true })];
    const signals = computeSourceSignalCounts(entries);
    expect(signals.entriesWithGithubStats).toBe(1);
  });
  it("computeSourceSignalCounts churn 41", () => {
    const entries = [makeEntry({ githubStars: 41, installable: false })];
    const signals = computeSourceSignalCounts(entries);
    expect(signals.entriesWithGithubStats).toBe(1);
  });
  it("computeSourceSignalCounts churn 42", () => {
    const entries = [makeEntry({ githubStars: 42, installable: true })];
    const signals = computeSourceSignalCounts(entries);
    expect(signals.entriesWithGithubStats).toBe(1);
  });
  it("computeSourceSignalCounts churn 43", () => {
    const entries = [makeEntry({ githubStars: 43, installable: false })];
    const signals = computeSourceSignalCounts(entries);
    expect(signals.entriesWithGithubStats).toBe(1);
  });
  it("computeSourceSignalCounts churn 44", () => {
    const entries = [makeEntry({ githubStars: 44, installable: true })];
    const signals = computeSourceSignalCounts(entries);
    expect(signals.entriesWithGithubStats).toBe(1);
  });
  it("computeSourceSignalCounts churn 45", () => {
    const entries = [makeEntry({ githubStars: 45, installable: false })];
    const signals = computeSourceSignalCounts(entries);
    expect(signals.entriesWithGithubStats).toBe(1);
  });
  it("computeSourceSignalCounts churn 46", () => {
    const entries = [makeEntry({ githubStars: 46, installable: true })];
    const signals = computeSourceSignalCounts(entries);
    expect(signals.entriesWithGithubStats).toBe(1);
  });
  it("computeSourceSignalCounts churn 47", () => {
    const entries = [makeEntry({ githubStars: 47, installable: false })];
    const signals = computeSourceSignalCounts(entries);
    expect(signals.entriesWithGithubStats).toBe(1);
  });
  it("computeSourceSignalCounts churn 48", () => {
    const entries = [makeEntry({ githubStars: 48, installable: true })];
    const signals = computeSourceSignalCounts(entries);
    expect(signals.entriesWithGithubStats).toBe(1);
  });
  it("computeSourceSignalCounts churn 49", () => {
    const entries = [makeEntry({ githubStars: 49, installable: false })];
    const signals = computeSourceSignalCounts(entries);
    expect(signals.entriesWithGithubStats).toBe(1);
  });
  it("computeSourceSignalCounts churn 50", () => {
    const entries = [makeEntry({ githubStars: 50, installable: true })];
    const signals = computeSourceSignalCounts(entries);
    expect(signals.entriesWithGithubStats).toBe(1);
  });
  it("computeSourceSignalCounts churn 51", () => {
    const entries = [makeEntry({ githubStars: 51, installable: false })];
    const signals = computeSourceSignalCounts(entries);
    expect(signals.entriesWithGithubStats).toBe(1);
  });
  it("computeSourceSignalCounts churn 52", () => {
    const entries = [makeEntry({ githubStars: 52, installable: true })];
    const signals = computeSourceSignalCounts(entries);
    expect(signals.entriesWithGithubStats).toBe(1);
  });
  it("computeSourceSignalCounts churn 53", () => {
    const entries = [makeEntry({ githubStars: 53, installable: false })];
    const signals = computeSourceSignalCounts(entries);
    expect(signals.entriesWithGithubStats).toBe(1);
  });
  it("computeSourceSignalCounts churn 54", () => {
    const entries = [makeEntry({ githubStars: 54, installable: true })];
    const signals = computeSourceSignalCounts(entries);
    expect(signals.entriesWithGithubStats).toBe(1);
  });
  it("computeSourceSignalCounts churn 55", () => {
    const entries = [makeEntry({ githubStars: 55, installable: false })];
    const signals = computeSourceSignalCounts(entries);
    expect(signals.entriesWithGithubStats).toBe(1);
  });
  it("computeSourceSignalCounts churn 56", () => {
    const entries = [makeEntry({ githubStars: 56, installable: true })];
    const signals = computeSourceSignalCounts(entries);
    expect(signals.entriesWithGithubStats).toBe(1);
  });
  it("computeSourceSignalCounts churn 57", () => {
    const entries = [makeEntry({ githubStars: 57, installable: false })];
    const signals = computeSourceSignalCounts(entries);
    expect(signals.entriesWithGithubStats).toBe(1);
  });
  it("computeSourceSignalCounts churn 58", () => {
    const entries = [makeEntry({ githubStars: 58, installable: true })];
    const signals = computeSourceSignalCounts(entries);
    expect(signals.entriesWithGithubStats).toBe(1);
  });
  it("computeSourceSignalCounts churn 59", () => {
    const entries = [makeEntry({ githubStars: 59, installable: false })];
    const signals = computeSourceSignalCounts(entries);
    expect(signals.entriesWithGithubStats).toBe(1);
  });
  it("computeSourceSignalCounts churn 60", () => {
    const entries = [makeEntry({ githubStars: 60, installable: true })];
    const signals = computeSourceSignalCounts(entries);
    expect(signals.entriesWithGithubStats).toBe(1);
  });
  it("computeSourceSignalCounts churn 61", () => {
    const entries = [makeEntry({ githubStars: 61, installable: false })];
    const signals = computeSourceSignalCounts(entries);
    expect(signals.entriesWithGithubStats).toBe(1);
  });
  it("computeSourceSignalCounts churn 62", () => {
    const entries = [makeEntry({ githubStars: 62, installable: true })];
    const signals = computeSourceSignalCounts(entries);
    expect(signals.entriesWithGithubStats).toBe(1);
  });
  it("computeSourceSignalCounts churn 63", () => {
    const entries = [makeEntry({ githubStars: 63, installable: false })];
    const signals = computeSourceSignalCounts(entries);
    expect(signals.entriesWithGithubStats).toBe(1);
  });
  it("computeSourceSignalCounts churn 64", () => {
    const entries = [makeEntry({ githubStars: 64, installable: true })];
    const signals = computeSourceSignalCounts(entries);
    expect(signals.entriesWithGithubStats).toBe(1);
  });
  it("computeSourceSignalCounts churn 65", () => {
    const entries = [makeEntry({ githubStars: 65, installable: false })];
    const signals = computeSourceSignalCounts(entries);
    expect(signals.entriesWithGithubStats).toBe(1);
  });
  it("computeSourceSignalCounts churn 66", () => {
    const entries = [makeEntry({ githubStars: 66, installable: true })];
    const signals = computeSourceSignalCounts(entries);
    expect(signals.entriesWithGithubStats).toBe(1);
  });
  it("computeSourceSignalCounts churn 67", () => {
    const entries = [makeEntry({ githubStars: 67, installable: false })];
    const signals = computeSourceSignalCounts(entries);
    expect(signals.entriesWithGithubStats).toBe(1);
  });
  it("computeSourceSignalCounts churn 68", () => {
    const entries = [makeEntry({ githubStars: 68, installable: true })];
    const signals = computeSourceSignalCounts(entries);
    expect(signals.entriesWithGithubStats).toBe(1);
  });
  it("computeSourceSignalCounts churn 69", () => {
    const entries = [makeEntry({ githubStars: 69, installable: false })];
    const signals = computeSourceSignalCounts(entries);
    expect(signals.entriesWithGithubStats).toBe(1);
  });
  it("computeSourceSignalCounts churn 70", () => {
    const entries = [makeEntry({ githubStars: 70, installable: true })];
    const signals = computeSourceSignalCounts(entries);
    expect(signals.entriesWithGithubStats).toBe(1);
  });
  it("computeSourceSignalCounts churn 71", () => {
    const entries = [makeEntry({ githubStars: 71, installable: false })];
    const signals = computeSourceSignalCounts(entries);
    expect(signals.entriesWithGithubStats).toBe(1);
  });
  it("computeSourceSignalCounts churn 72", () => {
    const entries = [makeEntry({ githubStars: 72, installable: true })];
    const signals = computeSourceSignalCounts(entries);
    expect(signals.entriesWithGithubStats).toBe(1);
  });
  it("computeSourceSignalCounts churn 73", () => {
    const entries = [makeEntry({ githubStars: 73, installable: false })];
    const signals = computeSourceSignalCounts(entries);
    expect(signals.entriesWithGithubStats).toBe(1);
  });
  it("computeSourceSignalCounts churn 74", () => {
    const entries = [makeEntry({ githubStars: 74, installable: true })];
    const signals = computeSourceSignalCounts(entries);
    expect(signals.entriesWithGithubStats).toBe(1);
  });
  it("computeSourceSignalCounts churn 75", () => {
    const entries = [makeEntry({ githubStars: 75, installable: false })];
    const signals = computeSourceSignalCounts(entries);
    expect(signals.entriesWithGithubStats).toBe(1);
  });
  it("computeSourceSignalCounts churn 76", () => {
    const entries = [makeEntry({ githubStars: 76, installable: true })];
    const signals = computeSourceSignalCounts(entries);
    expect(signals.entriesWithGithubStats).toBe(1);
  });
  it("computeSourceSignalCounts churn 77", () => {
    const entries = [makeEntry({ githubStars: 77, installable: false })];
    const signals = computeSourceSignalCounts(entries);
    expect(signals.entriesWithGithubStats).toBe(1);
  });
  it("computeSourceSignalCounts churn 78", () => {
    const entries = [makeEntry({ githubStars: 78, installable: true })];
    const signals = computeSourceSignalCounts(entries);
    expect(signals.entriesWithGithubStats).toBe(1);
  });
  it("computeSourceSignalCounts churn 79", () => {
    const entries = [makeEntry({ githubStars: 79, installable: false })];
    const signals = computeSourceSignalCounts(entries);
    expect(signals.entriesWithGithubStats).toBe(1);
  });
});

describe("registry-stats-lib buildRegistryStatsResponse", () => {
  it("builds ok stats envelope", () => {
    const manifest = {
      schemaVersion: 2,
      generatedAt: "2026-01-01",
      totalEntries: 1,
      categories: { mcp: 1 },
    };
    const entries = [makeEntry()];
    const response = buildRegistryStatsResponse({
      manifest,
      entries,
      packageName: "@heyclaude/mcp",
      packageVersion: "1.0.0",
    });
    expect(response.ok).toBe(true);
    expect(response.registry.totalEntries).toBe(1);
    expect(response.topTags.length).toBeGreaterThan(0);
  });
  it("buildRegistryStatsResponse churn 0", () => {
    const manifest = {
      schemaVersion: 2,
      generatedAt: "2026-01-01",
      totalEntries: 1,
      categories: {},
    };
    const entries = Array.from({ length: 1 }, (_, idx) =>
      makeEntry({ slug: "s-" + idx, tags: ["tag-" + idx] }),
    );
    const response = buildRegistryStatsResponse({
      manifest,
      entries,
      packageName: "pkg",
      packageVersion: "0.0.0",
    });
    expect(response.package.version).toBe("0.0.0");
  });
  it("buildRegistryStatsResponse churn 1", () => {
    const manifest = {
      schemaVersion: 2,
      generatedAt: "2026-01-01",
      totalEntries: 2,
      categories: {},
    };
    const entries = Array.from({ length: 2 }, (_, idx) =>
      makeEntry({ slug: "s-" + idx, tags: ["tag-" + idx] }),
    );
    const response = buildRegistryStatsResponse({
      manifest,
      entries,
      packageName: "pkg",
      packageVersion: "0.1.0",
    });
    expect(response.package.version).toBe("0.1.0");
  });
  it("buildRegistryStatsResponse churn 2", () => {
    const manifest = {
      schemaVersion: 2,
      generatedAt: "2026-01-01",
      totalEntries: 3,
      categories: {},
    };
    const entries = Array.from({ length: 3 }, (_, idx) =>
      makeEntry({ slug: "s-" + idx, tags: ["tag-" + idx] }),
    );
    const response = buildRegistryStatsResponse({
      manifest,
      entries,
      packageName: "pkg",
      packageVersion: "0.2.0",
    });
    expect(response.package.version).toBe("0.2.0");
  });
  it("buildRegistryStatsResponse churn 3", () => {
    const manifest = {
      schemaVersion: 2,
      generatedAt: "2026-01-01",
      totalEntries: 4,
      categories: {},
    };
    const entries = Array.from({ length: 4 }, (_, idx) =>
      makeEntry({ slug: "s-" + idx, tags: ["tag-" + idx] }),
    );
    const response = buildRegistryStatsResponse({
      manifest,
      entries,
      packageName: "pkg",
      packageVersion: "0.3.0",
    });
    expect(response.package.version).toBe("0.3.0");
  });
  it("buildRegistryStatsResponse churn 4", () => {
    const manifest = {
      schemaVersion: 2,
      generatedAt: "2026-01-01",
      totalEntries: 5,
      categories: {},
    };
    const entries = Array.from({ length: 5 }, (_, idx) =>
      makeEntry({ slug: "s-" + idx, tags: ["tag-" + idx] }),
    );
    const response = buildRegistryStatsResponse({
      manifest,
      entries,
      packageName: "pkg",
      packageVersion: "0.4.0",
    });
    expect(response.package.version).toBe("0.4.0");
  });
  it("buildRegistryStatsResponse churn 5", () => {
    const manifest = {
      schemaVersion: 2,
      generatedAt: "2026-01-01",
      totalEntries: 6,
      categories: {},
    };
    const entries = Array.from({ length: 6 }, (_, idx) =>
      makeEntry({ slug: "s-" + idx, tags: ["tag-" + idx] }),
    );
    const response = buildRegistryStatsResponse({
      manifest,
      entries,
      packageName: "pkg",
      packageVersion: "0.5.0",
    });
    expect(response.package.version).toBe("0.5.0");
  });
  it("buildRegistryStatsResponse churn 6", () => {
    const manifest = {
      schemaVersion: 2,
      generatedAt: "2026-01-01",
      totalEntries: 7,
      categories: {},
    };
    const entries = Array.from({ length: 7 }, (_, idx) =>
      makeEntry({ slug: "s-" + idx, tags: ["tag-" + idx] }),
    );
    const response = buildRegistryStatsResponse({
      manifest,
      entries,
      packageName: "pkg",
      packageVersion: "0.6.0",
    });
    expect(response.package.version).toBe("0.6.0");
  });
  it("buildRegistryStatsResponse churn 7", () => {
    const manifest = {
      schemaVersion: 2,
      generatedAt: "2026-01-01",
      totalEntries: 8,
      categories: {},
    };
    const entries = Array.from({ length: 8 }, (_, idx) =>
      makeEntry({ slug: "s-" + idx, tags: ["tag-" + idx] }),
    );
    const response = buildRegistryStatsResponse({
      manifest,
      entries,
      packageName: "pkg",
      packageVersion: "0.7.0",
    });
    expect(response.package.version).toBe("0.7.0");
  });
  it("buildRegistryStatsResponse churn 8", () => {
    const manifest = {
      schemaVersion: 2,
      generatedAt: "2026-01-01",
      totalEntries: 9,
      categories: {},
    };
    const entries = Array.from({ length: 9 }, (_, idx) =>
      makeEntry({ slug: "s-" + idx, tags: ["tag-" + idx] }),
    );
    const response = buildRegistryStatsResponse({
      manifest,
      entries,
      packageName: "pkg",
      packageVersion: "0.8.0",
    });
    expect(response.package.version).toBe("0.8.0");
  });
  it("buildRegistryStatsResponse churn 9", () => {
    const manifest = {
      schemaVersion: 2,
      generatedAt: "2026-01-01",
      totalEntries: 10,
      categories: {},
    };
    const entries = Array.from({ length: 10 }, (_, idx) =>
      makeEntry({ slug: "s-" + idx, tags: ["tag-" + idx] }),
    );
    const response = buildRegistryStatsResponse({
      manifest,
      entries,
      packageName: "pkg",
      packageVersion: "0.9.0",
    });
    expect(response.package.version).toBe("0.9.0");
  });
  it("buildRegistryStatsResponse churn 10", () => {
    const manifest = {
      schemaVersion: 2,
      generatedAt: "2026-01-01",
      totalEntries: 11,
      categories: {},
    };
    const entries = Array.from({ length: 11 }, (_, idx) =>
      makeEntry({ slug: "s-" + idx, tags: ["tag-" + idx] }),
    );
    const response = buildRegistryStatsResponse({
      manifest,
      entries,
      packageName: "pkg",
      packageVersion: "0.10.0",
    });
    expect(response.package.version).toBe("0.10.0");
  });
  it("buildRegistryStatsResponse churn 11", () => {
    const manifest = {
      schemaVersion: 2,
      generatedAt: "2026-01-01",
      totalEntries: 12,
      categories: {},
    };
    const entries = Array.from({ length: 12 }, (_, idx) =>
      makeEntry({ slug: "s-" + idx, tags: ["tag-" + idx] }),
    );
    const response = buildRegistryStatsResponse({
      manifest,
      entries,
      packageName: "pkg",
      packageVersion: "0.11.0",
    });
    expect(response.package.version).toBe("0.11.0");
  });
  it("buildRegistryStatsResponse churn 12", () => {
    const manifest = {
      schemaVersion: 2,
      generatedAt: "2026-01-01",
      totalEntries: 13,
      categories: {},
    };
    const entries = Array.from({ length: 13 }, (_, idx) =>
      makeEntry({ slug: "s-" + idx, tags: ["tag-" + idx] }),
    );
    const response = buildRegistryStatsResponse({
      manifest,
      entries,
      packageName: "pkg",
      packageVersion: "0.12.0",
    });
    expect(response.package.version).toBe("0.12.0");
  });
  it("buildRegistryStatsResponse churn 13", () => {
    const manifest = {
      schemaVersion: 2,
      generatedAt: "2026-01-01",
      totalEntries: 14,
      categories: {},
    };
    const entries = Array.from({ length: 14 }, (_, idx) =>
      makeEntry({ slug: "s-" + idx, tags: ["tag-" + idx] }),
    );
    const response = buildRegistryStatsResponse({
      manifest,
      entries,
      packageName: "pkg",
      packageVersion: "0.13.0",
    });
    expect(response.package.version).toBe("0.13.0");
  });
  it("buildRegistryStatsResponse churn 14", () => {
    const manifest = {
      schemaVersion: 2,
      generatedAt: "2026-01-01",
      totalEntries: 15,
      categories: {},
    };
    const entries = Array.from({ length: 15 }, (_, idx) =>
      makeEntry({ slug: "s-" + idx, tags: ["tag-" + idx] }),
    );
    const response = buildRegistryStatsResponse({
      manifest,
      entries,
      packageName: "pkg",
      packageVersion: "0.14.0",
    });
    expect(response.package.version).toBe("0.14.0");
  });
  it("buildRegistryStatsResponse churn 15", () => {
    const manifest = {
      schemaVersion: 2,
      generatedAt: "2026-01-01",
      totalEntries: 16,
      categories: {},
    };
    const entries = Array.from({ length: 16 }, (_, idx) =>
      makeEntry({ slug: "s-" + idx, tags: ["tag-" + idx] }),
    );
    const response = buildRegistryStatsResponse({
      manifest,
      entries,
      packageName: "pkg",
      packageVersion: "0.15.0",
    });
    expect(response.package.version).toBe("0.15.0");
  });
  it("buildRegistryStatsResponse churn 16", () => {
    const manifest = {
      schemaVersion: 2,
      generatedAt: "2026-01-01",
      totalEntries: 17,
      categories: {},
    };
    const entries = Array.from({ length: 17 }, (_, idx) =>
      makeEntry({ slug: "s-" + idx, tags: ["tag-" + idx] }),
    );
    const response = buildRegistryStatsResponse({
      manifest,
      entries,
      packageName: "pkg",
      packageVersion: "0.16.0",
    });
    expect(response.package.version).toBe("0.16.0");
  });
  it("buildRegistryStatsResponse churn 17", () => {
    const manifest = {
      schemaVersion: 2,
      generatedAt: "2026-01-01",
      totalEntries: 18,
      categories: {},
    };
    const entries = Array.from({ length: 18 }, (_, idx) =>
      makeEntry({ slug: "s-" + idx, tags: ["tag-" + idx] }),
    );
    const response = buildRegistryStatsResponse({
      manifest,
      entries,
      packageName: "pkg",
      packageVersion: "0.17.0",
    });
    expect(response.package.version).toBe("0.17.0");
  });
  it("buildRegistryStatsResponse churn 18", () => {
    const manifest = {
      schemaVersion: 2,
      generatedAt: "2026-01-01",
      totalEntries: 19,
      categories: {},
    };
    const entries = Array.from({ length: 19 }, (_, idx) =>
      makeEntry({ slug: "s-" + idx, tags: ["tag-" + idx] }),
    );
    const response = buildRegistryStatsResponse({
      manifest,
      entries,
      packageName: "pkg",
      packageVersion: "0.18.0",
    });
    expect(response.package.version).toBe("0.18.0");
  });
  it("buildRegistryStatsResponse churn 19", () => {
    const manifest = {
      schemaVersion: 2,
      generatedAt: "2026-01-01",
      totalEntries: 20,
      categories: {},
    };
    const entries = Array.from({ length: 20 }, (_, idx) =>
      makeEntry({ slug: "s-" + idx, tags: ["tag-" + idx] }),
    );
    const response = buildRegistryStatsResponse({
      manifest,
      entries,
      packageName: "pkg",
      packageVersion: "0.19.0",
    });
    expect(response.package.version).toBe("0.19.0");
  });
  it("buildRegistryStatsResponse churn 20", () => {
    const manifest = {
      schemaVersion: 2,
      generatedAt: "2026-01-01",
      totalEntries: 21,
      categories: {},
    };
    const entries = Array.from({ length: 21 }, (_, idx) =>
      makeEntry({ slug: "s-" + idx, tags: ["tag-" + idx] }),
    );
    const response = buildRegistryStatsResponse({
      manifest,
      entries,
      packageName: "pkg",
      packageVersion: "0.20.0",
    });
    expect(response.package.version).toBe("0.20.0");
  });
  it("buildRegistryStatsResponse churn 21", () => {
    const manifest = {
      schemaVersion: 2,
      generatedAt: "2026-01-01",
      totalEntries: 22,
      categories: {},
    };
    const entries = Array.from({ length: 22 }, (_, idx) =>
      makeEntry({ slug: "s-" + idx, tags: ["tag-" + idx] }),
    );
    const response = buildRegistryStatsResponse({
      manifest,
      entries,
      packageName: "pkg",
      packageVersion: "0.21.0",
    });
    expect(response.package.version).toBe("0.21.0");
  });
  it("buildRegistryStatsResponse churn 22", () => {
    const manifest = {
      schemaVersion: 2,
      generatedAt: "2026-01-01",
      totalEntries: 23,
      categories: {},
    };
    const entries = Array.from({ length: 23 }, (_, idx) =>
      makeEntry({ slug: "s-" + idx, tags: ["tag-" + idx] }),
    );
    const response = buildRegistryStatsResponse({
      manifest,
      entries,
      packageName: "pkg",
      packageVersion: "0.22.0",
    });
    expect(response.package.version).toBe("0.22.0");
  });
  it("buildRegistryStatsResponse churn 23", () => {
    const manifest = {
      schemaVersion: 2,
      generatedAt: "2026-01-01",
      totalEntries: 24,
      categories: {},
    };
    const entries = Array.from({ length: 24 }, (_, idx) =>
      makeEntry({ slug: "s-" + idx, tags: ["tag-" + idx] }),
    );
    const response = buildRegistryStatsResponse({
      manifest,
      entries,
      packageName: "pkg",
      packageVersion: "0.23.0",
    });
    expect(response.package.version).toBe("0.23.0");
  });
  it("buildRegistryStatsResponse churn 24", () => {
    const manifest = {
      schemaVersion: 2,
      generatedAt: "2026-01-01",
      totalEntries: 25,
      categories: {},
    };
    const entries = Array.from({ length: 25 }, (_, idx) =>
      makeEntry({ slug: "s-" + idx, tags: ["tag-" + idx] }),
    );
    const response = buildRegistryStatsResponse({
      manifest,
      entries,
      packageName: "pkg",
      packageVersion: "0.24.0",
    });
    expect(response.package.version).toBe("0.24.0");
  });
  it("buildRegistryStatsResponse churn 25", () => {
    const manifest = {
      schemaVersion: 2,
      generatedAt: "2026-01-01",
      totalEntries: 26,
      categories: {},
    };
    const entries = Array.from({ length: 26 }, (_, idx) =>
      makeEntry({ slug: "s-" + idx, tags: ["tag-" + idx] }),
    );
    const response = buildRegistryStatsResponse({
      manifest,
      entries,
      packageName: "pkg",
      packageVersion: "0.25.0",
    });
    expect(response.package.version).toBe("0.25.0");
  });
  it("buildRegistryStatsResponse churn 26", () => {
    const manifest = {
      schemaVersion: 2,
      generatedAt: "2026-01-01",
      totalEntries: 27,
      categories: {},
    };
    const entries = Array.from({ length: 27 }, (_, idx) =>
      makeEntry({ slug: "s-" + idx, tags: ["tag-" + idx] }),
    );
    const response = buildRegistryStatsResponse({
      manifest,
      entries,
      packageName: "pkg",
      packageVersion: "0.26.0",
    });
    expect(response.package.version).toBe("0.26.0");
  });
  it("buildRegistryStatsResponse churn 27", () => {
    const manifest = {
      schemaVersion: 2,
      generatedAt: "2026-01-01",
      totalEntries: 28,
      categories: {},
    };
    const entries = Array.from({ length: 28 }, (_, idx) =>
      makeEntry({ slug: "s-" + idx, tags: ["tag-" + idx] }),
    );
    const response = buildRegistryStatsResponse({
      manifest,
      entries,
      packageName: "pkg",
      packageVersion: "0.27.0",
    });
    expect(response.package.version).toBe("0.27.0");
  });
  it("buildRegistryStatsResponse churn 28", () => {
    const manifest = {
      schemaVersion: 2,
      generatedAt: "2026-01-01",
      totalEntries: 29,
      categories: {},
    };
    const entries = Array.from({ length: 29 }, (_, idx) =>
      makeEntry({ slug: "s-" + idx, tags: ["tag-" + idx] }),
    );
    const response = buildRegistryStatsResponse({
      manifest,
      entries,
      packageName: "pkg",
      packageVersion: "0.28.0",
    });
    expect(response.package.version).toBe("0.28.0");
  });
  it("buildRegistryStatsResponse churn 29", () => {
    const manifest = {
      schemaVersion: 2,
      generatedAt: "2026-01-01",
      totalEntries: 30,
      categories: {},
    };
    const entries = Array.from({ length: 30 }, (_, idx) =>
      makeEntry({ slug: "s-" + idx, tags: ["tag-" + idx] }),
    );
    const response = buildRegistryStatsResponse({
      manifest,
      entries,
      packageName: "pkg",
      packageVersion: "0.29.0",
    });
    expect(response.package.version).toBe("0.29.0");
  });
  it("buildRegistryStatsResponse churn 30", () => {
    const manifest = {
      schemaVersion: 2,
      generatedAt: "2026-01-01",
      totalEntries: 31,
      categories: {},
    };
    const entries = Array.from({ length: 31 }, (_, idx) =>
      makeEntry({ slug: "s-" + idx, tags: ["tag-" + idx] }),
    );
    const response = buildRegistryStatsResponse({
      manifest,
      entries,
      packageName: "pkg",
      packageVersion: "0.30.0",
    });
    expect(response.package.version).toBe("0.30.0");
  });
  it("buildRegistryStatsResponse churn 31", () => {
    const manifest = {
      schemaVersion: 2,
      generatedAt: "2026-01-01",
      totalEntries: 32,
      categories: {},
    };
    const entries = Array.from({ length: 32 }, (_, idx) =>
      makeEntry({ slug: "s-" + idx, tags: ["tag-" + idx] }),
    );
    const response = buildRegistryStatsResponse({
      manifest,
      entries,
      packageName: "pkg",
      packageVersion: "0.31.0",
    });
    expect(response.package.version).toBe("0.31.0");
  });
  it("buildRegistryStatsResponse churn 32", () => {
    const manifest = {
      schemaVersion: 2,
      generatedAt: "2026-01-01",
      totalEntries: 33,
      categories: {},
    };
    const entries = Array.from({ length: 33 }, (_, idx) =>
      makeEntry({ slug: "s-" + idx, tags: ["tag-" + idx] }),
    );
    const response = buildRegistryStatsResponse({
      manifest,
      entries,
      packageName: "pkg",
      packageVersion: "0.32.0",
    });
    expect(response.package.version).toBe("0.32.0");
  });
  it("buildRegistryStatsResponse churn 33", () => {
    const manifest = {
      schemaVersion: 2,
      generatedAt: "2026-01-01",
      totalEntries: 34,
      categories: {},
    };
    const entries = Array.from({ length: 34 }, (_, idx) =>
      makeEntry({ slug: "s-" + idx, tags: ["tag-" + idx] }),
    );
    const response = buildRegistryStatsResponse({
      manifest,
      entries,
      packageName: "pkg",
      packageVersion: "0.33.0",
    });
    expect(response.package.version).toBe("0.33.0");
  });
  it("buildRegistryStatsResponse churn 34", () => {
    const manifest = {
      schemaVersion: 2,
      generatedAt: "2026-01-01",
      totalEntries: 35,
      categories: {},
    };
    const entries = Array.from({ length: 35 }, (_, idx) =>
      makeEntry({ slug: "s-" + idx, tags: ["tag-" + idx] }),
    );
    const response = buildRegistryStatsResponse({
      manifest,
      entries,
      packageName: "pkg",
      packageVersion: "0.34.0",
    });
    expect(response.package.version).toBe("0.34.0");
  });
  it("buildRegistryStatsResponse churn 35", () => {
    const manifest = {
      schemaVersion: 2,
      generatedAt: "2026-01-01",
      totalEntries: 36,
      categories: {},
    };
    const entries = Array.from({ length: 36 }, (_, idx) =>
      makeEntry({ slug: "s-" + idx, tags: ["tag-" + idx] }),
    );
    const response = buildRegistryStatsResponse({
      manifest,
      entries,
      packageName: "pkg",
      packageVersion: "0.35.0",
    });
    expect(response.package.version).toBe("0.35.0");
  });
  it("buildRegistryStatsResponse churn 36", () => {
    const manifest = {
      schemaVersion: 2,
      generatedAt: "2026-01-01",
      totalEntries: 37,
      categories: {},
    };
    const entries = Array.from({ length: 37 }, (_, idx) =>
      makeEntry({ slug: "s-" + idx, tags: ["tag-" + idx] }),
    );
    const response = buildRegistryStatsResponse({
      manifest,
      entries,
      packageName: "pkg",
      packageVersion: "0.36.0",
    });
    expect(response.package.version).toBe("0.36.0");
  });
  it("buildRegistryStatsResponse churn 37", () => {
    const manifest = {
      schemaVersion: 2,
      generatedAt: "2026-01-01",
      totalEntries: 38,
      categories: {},
    };
    const entries = Array.from({ length: 38 }, (_, idx) =>
      makeEntry({ slug: "s-" + idx, tags: ["tag-" + idx] }),
    );
    const response = buildRegistryStatsResponse({
      manifest,
      entries,
      packageName: "pkg",
      packageVersion: "0.37.0",
    });
    expect(response.package.version).toBe("0.37.0");
  });
  it("buildRegistryStatsResponse churn 38", () => {
    const manifest = {
      schemaVersion: 2,
      generatedAt: "2026-01-01",
      totalEntries: 39,
      categories: {},
    };
    const entries = Array.from({ length: 39 }, (_, idx) =>
      makeEntry({ slug: "s-" + idx, tags: ["tag-" + idx] }),
    );
    const response = buildRegistryStatsResponse({
      manifest,
      entries,
      packageName: "pkg",
      packageVersion: "0.38.0",
    });
    expect(response.package.version).toBe("0.38.0");
  });
  it("buildRegistryStatsResponse churn 39", () => {
    const manifest = {
      schemaVersion: 2,
      generatedAt: "2026-01-01",
      totalEntries: 40,
      categories: {},
    };
    const entries = Array.from({ length: 40 }, (_, idx) =>
      makeEntry({ slug: "s-" + idx, tags: ["tag-" + idx] }),
    );
    const response = buildRegistryStatsResponse({
      manifest,
      entries,
      packageName: "pkg",
      packageVersion: "0.39.0",
    });
    expect(response.package.version).toBe("0.39.0");
  });
  it("buildRegistryStatsResponse churn 40", () => {
    const manifest = {
      schemaVersion: 2,
      generatedAt: "2026-01-01",
      totalEntries: 41,
      categories: {},
    };
    const entries = Array.from({ length: 41 }, (_, idx) =>
      makeEntry({ slug: "s-" + idx, tags: ["tag-" + idx] }),
    );
    const response = buildRegistryStatsResponse({
      manifest,
      entries,
      packageName: "pkg",
      packageVersion: "0.40.0",
    });
    expect(response.package.version).toBe("0.40.0");
  });
  it("buildRegistryStatsResponse churn 41", () => {
    const manifest = {
      schemaVersion: 2,
      generatedAt: "2026-01-01",
      totalEntries: 42,
      categories: {},
    };
    const entries = Array.from({ length: 42 }, (_, idx) =>
      makeEntry({ slug: "s-" + idx, tags: ["tag-" + idx] }),
    );
    const response = buildRegistryStatsResponse({
      manifest,
      entries,
      packageName: "pkg",
      packageVersion: "0.41.0",
    });
    expect(response.package.version).toBe("0.41.0");
  });
  it("buildRegistryStatsResponse churn 42", () => {
    const manifest = {
      schemaVersion: 2,
      generatedAt: "2026-01-01",
      totalEntries: 43,
      categories: {},
    };
    const entries = Array.from({ length: 43 }, (_, idx) =>
      makeEntry({ slug: "s-" + idx, tags: ["tag-" + idx] }),
    );
    const response = buildRegistryStatsResponse({
      manifest,
      entries,
      packageName: "pkg",
      packageVersion: "0.42.0",
    });
    expect(response.package.version).toBe("0.42.0");
  });
  it("buildRegistryStatsResponse churn 43", () => {
    const manifest = {
      schemaVersion: 2,
      generatedAt: "2026-01-01",
      totalEntries: 44,
      categories: {},
    };
    const entries = Array.from({ length: 44 }, (_, idx) =>
      makeEntry({ slug: "s-" + idx, tags: ["tag-" + idx] }),
    );
    const response = buildRegistryStatsResponse({
      manifest,
      entries,
      packageName: "pkg",
      packageVersion: "0.43.0",
    });
    expect(response.package.version).toBe("0.43.0");
  });
  it("buildRegistryStatsResponse churn 44", () => {
    const manifest = {
      schemaVersion: 2,
      generatedAt: "2026-01-01",
      totalEntries: 45,
      categories: {},
    };
    const entries = Array.from({ length: 45 }, (_, idx) =>
      makeEntry({ slug: "s-" + idx, tags: ["tag-" + idx] }),
    );
    const response = buildRegistryStatsResponse({
      manifest,
      entries,
      packageName: "pkg",
      packageVersion: "0.44.0",
    });
    expect(response.package.version).toBe("0.44.0");
  });
  it("buildRegistryStatsResponse churn 45", () => {
    const manifest = {
      schemaVersion: 2,
      generatedAt: "2026-01-01",
      totalEntries: 46,
      categories: {},
    };
    const entries = Array.from({ length: 46 }, (_, idx) =>
      makeEntry({ slug: "s-" + idx, tags: ["tag-" + idx] }),
    );
    const response = buildRegistryStatsResponse({
      manifest,
      entries,
      packageName: "pkg",
      packageVersion: "0.45.0",
    });
    expect(response.package.version).toBe("0.45.0");
  });
  it("buildRegistryStatsResponse churn 46", () => {
    const manifest = {
      schemaVersion: 2,
      generatedAt: "2026-01-01",
      totalEntries: 47,
      categories: {},
    };
    const entries = Array.from({ length: 47 }, (_, idx) =>
      makeEntry({ slug: "s-" + idx, tags: ["tag-" + idx] }),
    );
    const response = buildRegistryStatsResponse({
      manifest,
      entries,
      packageName: "pkg",
      packageVersion: "0.46.0",
    });
    expect(response.package.version).toBe("0.46.0");
  });
  it("buildRegistryStatsResponse churn 47", () => {
    const manifest = {
      schemaVersion: 2,
      generatedAt: "2026-01-01",
      totalEntries: 48,
      categories: {},
    };
    const entries = Array.from({ length: 48 }, (_, idx) =>
      makeEntry({ slug: "s-" + idx, tags: ["tag-" + idx] }),
    );
    const response = buildRegistryStatsResponse({
      manifest,
      entries,
      packageName: "pkg",
      packageVersion: "0.47.0",
    });
    expect(response.package.version).toBe("0.47.0");
  });
  it("buildRegistryStatsResponse churn 48", () => {
    const manifest = {
      schemaVersion: 2,
      generatedAt: "2026-01-01",
      totalEntries: 49,
      categories: {},
    };
    const entries = Array.from({ length: 49 }, (_, idx) =>
      makeEntry({ slug: "s-" + idx, tags: ["tag-" + idx] }),
    );
    const response = buildRegistryStatsResponse({
      manifest,
      entries,
      packageName: "pkg",
      packageVersion: "0.48.0",
    });
    expect(response.package.version).toBe("0.48.0");
  });
  it("buildRegistryStatsResponse churn 49", () => {
    const manifest = {
      schemaVersion: 2,
      generatedAt: "2026-01-01",
      totalEntries: 50,
      categories: {},
    };
    const entries = Array.from({ length: 50 }, (_, idx) =>
      makeEntry({ slug: "s-" + idx, tags: ["tag-" + idx] }),
    );
    const response = buildRegistryStatsResponse({
      manifest,
      entries,
      packageName: "pkg",
      packageVersion: "0.49.0",
    });
    expect(response.package.version).toBe("0.49.0");
  });
  it("buildRegistryStatsResponse churn 50", () => {
    const manifest = {
      schemaVersion: 2,
      generatedAt: "2026-01-01",
      totalEntries: 51,
      categories: {},
    };
    const entries = Array.from({ length: 51 }, (_, idx) =>
      makeEntry({ slug: "s-" + idx, tags: ["tag-" + idx] }),
    );
    const response = buildRegistryStatsResponse({
      manifest,
      entries,
      packageName: "pkg",
      packageVersion: "0.50.0",
    });
    expect(response.package.version).toBe("0.50.0");
  });
  it("buildRegistryStatsResponse churn 51", () => {
    const manifest = {
      schemaVersion: 2,
      generatedAt: "2026-01-01",
      totalEntries: 52,
      categories: {},
    };
    const entries = Array.from({ length: 52 }, (_, idx) =>
      makeEntry({ slug: "s-" + idx, tags: ["tag-" + idx] }),
    );
    const response = buildRegistryStatsResponse({
      manifest,
      entries,
      packageName: "pkg",
      packageVersion: "0.51.0",
    });
    expect(response.package.version).toBe("0.51.0");
  });
  it("buildRegistryStatsResponse churn 52", () => {
    const manifest = {
      schemaVersion: 2,
      generatedAt: "2026-01-01",
      totalEntries: 53,
      categories: {},
    };
    const entries = Array.from({ length: 53 }, (_, idx) =>
      makeEntry({ slug: "s-" + idx, tags: ["tag-" + idx] }),
    );
    const response = buildRegistryStatsResponse({
      manifest,
      entries,
      packageName: "pkg",
      packageVersion: "0.52.0",
    });
    expect(response.package.version).toBe("0.52.0");
  });
  it("buildRegistryStatsResponse churn 53", () => {
    const manifest = {
      schemaVersion: 2,
      generatedAt: "2026-01-01",
      totalEntries: 54,
      categories: {},
    };
    const entries = Array.from({ length: 54 }, (_, idx) =>
      makeEntry({ slug: "s-" + idx, tags: ["tag-" + idx] }),
    );
    const response = buildRegistryStatsResponse({
      manifest,
      entries,
      packageName: "pkg",
      packageVersion: "0.53.0",
    });
    expect(response.package.version).toBe("0.53.0");
  });
  it("buildRegistryStatsResponse churn 54", () => {
    const manifest = {
      schemaVersion: 2,
      generatedAt: "2026-01-01",
      totalEntries: 55,
      categories: {},
    };
    const entries = Array.from({ length: 55 }, (_, idx) =>
      makeEntry({ slug: "s-" + idx, tags: ["tag-" + idx] }),
    );
    const response = buildRegistryStatsResponse({
      manifest,
      entries,
      packageName: "pkg",
      packageVersion: "0.54.0",
    });
    expect(response.package.version).toBe("0.54.0");
  });
  it("buildRegistryStatsResponse churn 55", () => {
    const manifest = {
      schemaVersion: 2,
      generatedAt: "2026-01-01",
      totalEntries: 56,
      categories: {},
    };
    const entries = Array.from({ length: 56 }, (_, idx) =>
      makeEntry({ slug: "s-" + idx, tags: ["tag-" + idx] }),
    );
    const response = buildRegistryStatsResponse({
      manifest,
      entries,
      packageName: "pkg",
      packageVersion: "0.55.0",
    });
    expect(response.package.version).toBe("0.55.0");
  });
  it("buildRegistryStatsResponse churn 56", () => {
    const manifest = {
      schemaVersion: 2,
      generatedAt: "2026-01-01",
      totalEntries: 57,
      categories: {},
    };
    const entries = Array.from({ length: 57 }, (_, idx) =>
      makeEntry({ slug: "s-" + idx, tags: ["tag-" + idx] }),
    );
    const response = buildRegistryStatsResponse({
      manifest,
      entries,
      packageName: "pkg",
      packageVersion: "0.56.0",
    });
    expect(response.package.version).toBe("0.56.0");
  });
  it("buildRegistryStatsResponse churn 57", () => {
    const manifest = {
      schemaVersion: 2,
      generatedAt: "2026-01-01",
      totalEntries: 58,
      categories: {},
    };
    const entries = Array.from({ length: 58 }, (_, idx) =>
      makeEntry({ slug: "s-" + idx, tags: ["tag-" + idx] }),
    );
    const response = buildRegistryStatsResponse({
      manifest,
      entries,
      packageName: "pkg",
      packageVersion: "0.57.0",
    });
    expect(response.package.version).toBe("0.57.0");
  });
  it("buildRegistryStatsResponse churn 58", () => {
    const manifest = {
      schemaVersion: 2,
      generatedAt: "2026-01-01",
      totalEntries: 59,
      categories: {},
    };
    const entries = Array.from({ length: 59 }, (_, idx) =>
      makeEntry({ slug: "s-" + idx, tags: ["tag-" + idx] }),
    );
    const response = buildRegistryStatsResponse({
      manifest,
      entries,
      packageName: "pkg",
      packageVersion: "0.58.0",
    });
    expect(response.package.version).toBe("0.58.0");
  });
  it("buildRegistryStatsResponse churn 59", () => {
    const manifest = {
      schemaVersion: 2,
      generatedAt: "2026-01-01",
      totalEntries: 60,
      categories: {},
    };
    const entries = Array.from({ length: 60 }, (_, idx) =>
      makeEntry({ slug: "s-" + idx, tags: ["tag-" + idx] }),
    );
    const response = buildRegistryStatsResponse({
      manifest,
      entries,
      packageName: "pkg",
      packageVersion: "0.59.0",
    });
    expect(response.package.version).toBe("0.59.0");
  });
});

describe("registry-stats-lib missing-field fallbacks", () => {
  it("skips entries that omit platforms and tags", () => {
    const { platformCounts, tagCounts } = countPlatformsAndTags([{}]);
    expect(platformCounts.size).toBe(0);
    expect(tagCounts.size).toBe(0);
  });

  it("defaults registry categories to an empty object", () => {
    const response = buildRegistryStatsResponse({
      manifest: {
        schemaVersion: 1,
        generatedAt: "2026-01-01",
        totalEntries: 0,
      },
      entries: [],
      packageName: "pkg",
      packageVersion: "1.0.0",
    });
    expect(response.registry.categories).toEqual({});
  });
});

describe("registry-stats-lib platform sorting", () => {
  const manifest = {
    schemaVersion: 2,
    generatedAt: "2026-07-14",
    totalEntries: 2,
    categories: { mcp: 2 },
  };

  it("returns registry platforms sorted alphabetically by name", () => {
    // Two entries spanning several platforms out of order, so the platform
    // sort comparator runs and the response keys come back alphabetized.
    const entries = [
      makeEntry({ slug: "a", platforms: ["vscode", "cursor"] }),
      makeEntry({ slug: "b", platforms: ["claude-code", "windsurf"] }),
    ];
    const response = buildRegistryStatsResponse({
      manifest,
      entries,
      packageName: "@heyclaude/mcp",
      packageVersion: "1.0.0",
    });
    expect(Object.keys(response.platforms)).toEqual([
      "claude-code",
      "cursor",
      "vscode",
      "windsurf",
    ]);
    expect(response.platforms["cursor"]).toBe(1);
    expect(response.platforms["claude-code"]).toBe(1);
  });
});
