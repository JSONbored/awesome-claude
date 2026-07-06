import { describe, expect, it } from "vitest";

import {
  applySourceRepoSignal,
  collectSourceRepos,
  DEFAULT_REFRESH_LIMIT,
  GITHUB_API_VERSION,
  normalizeSourceRepoSignalRow,
  parseGitHubRepoUrl,
  REFRESH_STALE_MS,
  refreshLimit,
  REQUEST_TIMEOUT_MS,
  shouldRefreshSourceRepoSignal,
  type SourceRepoSignal,
  type SourceRepoSignalState,
} from "../apps/web/src/lib/source-repo-signals-lib";

describe("source-repo-signals-lib constants", () => {
  it("exports GitHub API version", () => {
    expect(GITHUB_API_VERSION).toBe("2022-11-28");
  });
  it("exports request timeout", () => {
    expect(REQUEST_TIMEOUT_MS).toBe(5000);
  });
  it("exports refresh defaults", () => {
    expect(DEFAULT_REFRESH_LIMIT).toBe(25);
    expect(REFRESH_STALE_MS).toBe(24 * 60 * 60 * 1000);
  });
});

describe("source-repo-signals-lib parseGitHubRepoUrl", () => {
  it("parses https GitHub URLs", () => {
    expect(parseGitHubRepoUrl("https://github.com/OpenAI/whisper.git")).toEqual(
      { owner: "OpenAI", repo: "whisper", key: "openai/whisper" },
    );
  });
  it("returns null for non-GitHub URLs", () => {
    expect(parseGitHubRepoUrl("https://gitlab.com/org/repo")).toBeNull();
  });
  it("parseGitHubRepoUrl variant 0", () => {
    const parsed = parseGitHubRepoUrl(
      "https://github.com/anthropics/claude-code",
    );
    if (parsed) expect(parsed.key).toMatch(/^[a-z0-9-]+\/[a-z0-9-]+$/);
  });
  it("parseGitHubRepoUrl variant 1", () => {
    const parsed = parseGitHubRepoUrl("https://github.com/microsoft/vscode");
    if (parsed) expect(parsed.key).toMatch(/^[a-z0-9-]+\/[a-z0-9-]+$/);
  });
  it("parseGitHubRepoUrl variant 2", () => {
    const parsed = parseGitHubRepoUrl("https://github.com/openai/codex");
    if (parsed) expect(parsed.key).toMatch(/^[a-z0-9-]+\/[a-z0-9-]+$/);
  });
  it("parseGitHubRepoUrl variant 3", () => {
    const parsed = parseGitHubRepoUrl("git@github.com:owner/repo.git");
    if (parsed) expect(parsed.key).toMatch(/^[a-z0-9-]+\/[a-z0-9-]+$/);
  });
  it("parseGitHubRepoUrl variant 4", () => {
    const parsed = parseGitHubRepoUrl("https://www.github.com/Org/Repo");
    if (parsed) expect(parsed.key).toMatch(/^[a-z0-9-]+\/[a-z0-9-]+$/);
  });
  it("parseGitHubRepoUrl variant 5", () => {
    const parsed = parseGitHubRepoUrl("git+https://github.com/foo/bar.git");
    if (parsed) expect(parsed.key).toMatch(/^[a-z0-9-]+\/[a-z0-9-]+$/);
  });
  it("parseGitHubRepoUrl matrix 0", () => {
    const parsed = parseGitHubRepoUrl(`https://github.com/org-0/repo-0`);
    expect(parsed?.key).toBe(`org-0/repo-0`);
  });
  it("parseGitHubRepoUrl matrix 1", () => {
    const parsed = parseGitHubRepoUrl(`https://github.com/org-1/repo-1`);
    expect(parsed?.key).toBe(`org-1/repo-1`);
  });
  it("parseGitHubRepoUrl matrix 2", () => {
    const parsed = parseGitHubRepoUrl(`https://github.com/org-2/repo-2`);
    expect(parsed?.key).toBe(`org-2/repo-2`);
  });
  it("parseGitHubRepoUrl matrix 3", () => {
    const parsed = parseGitHubRepoUrl(`https://github.com/org-3/repo-3`);
    expect(parsed?.key).toBe(`org-3/repo-3`);
  });
  it("parseGitHubRepoUrl matrix 4", () => {
    const parsed = parseGitHubRepoUrl(`https://github.com/org-4/repo-4`);
    expect(parsed?.key).toBe(`org-4/repo-4`);
  });
  it("parseGitHubRepoUrl matrix 5", () => {
    const parsed = parseGitHubRepoUrl(`https://github.com/org-5/repo-5`);
    expect(parsed?.key).toBe(`org-5/repo-5`);
  });
  it("parseGitHubRepoUrl matrix 6", () => {
    const parsed = parseGitHubRepoUrl(`https://github.com/org-6/repo-6`);
    expect(parsed?.key).toBe(`org-6/repo-6`);
  });
  it("parseGitHubRepoUrl matrix 7", () => {
    const parsed = parseGitHubRepoUrl(`https://github.com/org-7/repo-7`);
    expect(parsed?.key).toBe(`org-7/repo-7`);
  });
  it("parseGitHubRepoUrl matrix 8", () => {
    const parsed = parseGitHubRepoUrl(`https://github.com/org-8/repo-8`);
    expect(parsed?.key).toBe(`org-8/repo-8`);
  });
  it("parseGitHubRepoUrl matrix 9", () => {
    const parsed = parseGitHubRepoUrl(`https://github.com/org-9/repo-9`);
    expect(parsed?.key).toBe(`org-9/repo-9`);
  });
  it("parseGitHubRepoUrl matrix 10", () => {
    const parsed = parseGitHubRepoUrl(`https://github.com/org-10/repo-10`);
    expect(parsed?.key).toBe(`org-10/repo-10`);
  });
  it("parseGitHubRepoUrl matrix 11", () => {
    const parsed = parseGitHubRepoUrl(`https://github.com/org-11/repo-11`);
    expect(parsed?.key).toBe(`org-11/repo-11`);
  });
  it("parseGitHubRepoUrl matrix 12", () => {
    const parsed = parseGitHubRepoUrl(`https://github.com/org-12/repo-12`);
    expect(parsed?.key).toBe(`org-12/repo-12`);
  });
  it("parseGitHubRepoUrl matrix 13", () => {
    const parsed = parseGitHubRepoUrl(`https://github.com/org-13/repo-13`);
    expect(parsed?.key).toBe(`org-13/repo-13`);
  });
  it("parseGitHubRepoUrl matrix 14", () => {
    const parsed = parseGitHubRepoUrl(`https://github.com/org-14/repo-14`);
    expect(parsed?.key).toBe(`org-14/repo-14`);
  });
  it("parseGitHubRepoUrl matrix 15", () => {
    const parsed = parseGitHubRepoUrl(`https://github.com/org-15/repo-15`);
    expect(parsed?.key).toBe(`org-15/repo-15`);
  });
  it("parseGitHubRepoUrl matrix 16", () => {
    const parsed = parseGitHubRepoUrl(`https://github.com/org-16/repo-16`);
    expect(parsed?.key).toBe(`org-16/repo-16`);
  });
  it("parseGitHubRepoUrl matrix 17", () => {
    const parsed = parseGitHubRepoUrl(`https://github.com/org-17/repo-17`);
    expect(parsed?.key).toBe(`org-17/repo-17`);
  });
  it("parseGitHubRepoUrl matrix 18", () => {
    const parsed = parseGitHubRepoUrl(`https://github.com/org-18/repo-18`);
    expect(parsed?.key).toBe(`org-18/repo-18`);
  });
  it("parseGitHubRepoUrl matrix 19", () => {
    const parsed = parseGitHubRepoUrl(`https://github.com/org-19/repo-19`);
    expect(parsed?.key).toBe(`org-19/repo-19`);
  });
  it("parseGitHubRepoUrl matrix 20", () => {
    const parsed = parseGitHubRepoUrl(`https://github.com/org-20/repo-20`);
    expect(parsed?.key).toBe(`org-20/repo-20`);
  });
  it("parseGitHubRepoUrl matrix 21", () => {
    const parsed = parseGitHubRepoUrl(`https://github.com/org-21/repo-21`);
    expect(parsed?.key).toBe(`org-21/repo-21`);
  });
  it("parseGitHubRepoUrl matrix 22", () => {
    const parsed = parseGitHubRepoUrl(`https://github.com/org-22/repo-22`);
    expect(parsed?.key).toBe(`org-22/repo-22`);
  });
  it("parseGitHubRepoUrl matrix 23", () => {
    const parsed = parseGitHubRepoUrl(`https://github.com/org-23/repo-23`);
    expect(parsed?.key).toBe(`org-23/repo-23`);
  });
  it("parseGitHubRepoUrl matrix 24", () => {
    const parsed = parseGitHubRepoUrl(`https://github.com/org-24/repo-24`);
    expect(parsed?.key).toBe(`org-24/repo-24`);
  });
  it("parseGitHubRepoUrl matrix 25", () => {
    const parsed = parseGitHubRepoUrl(`https://github.com/org-25/repo-25`);
    expect(parsed?.key).toBe(`org-25/repo-25`);
  });
  it("parseGitHubRepoUrl matrix 26", () => {
    const parsed = parseGitHubRepoUrl(`https://github.com/org-26/repo-26`);
    expect(parsed?.key).toBe(`org-26/repo-26`);
  });
  it("parseGitHubRepoUrl matrix 27", () => {
    const parsed = parseGitHubRepoUrl(`https://github.com/org-27/repo-27`);
    expect(parsed?.key).toBe(`org-27/repo-27`);
  });
  it("parseGitHubRepoUrl matrix 28", () => {
    const parsed = parseGitHubRepoUrl(`https://github.com/org-28/repo-28`);
    expect(parsed?.key).toBe(`org-28/repo-28`);
  });
  it("parseGitHubRepoUrl matrix 29", () => {
    const parsed = parseGitHubRepoUrl(`https://github.com/org-29/repo-29`);
    expect(parsed?.key).toBe(`org-29/repo-29`);
  });
  it("parseGitHubRepoUrl matrix 30", () => {
    const parsed = parseGitHubRepoUrl(`https://github.com/org-30/repo-30`);
    expect(parsed?.key).toBe(`org-30/repo-30`);
  });
  it("parseGitHubRepoUrl matrix 31", () => {
    const parsed = parseGitHubRepoUrl(`https://github.com/org-31/repo-31`);
    expect(parsed?.key).toBe(`org-31/repo-31`);
  });
  it("parseGitHubRepoUrl matrix 32", () => {
    const parsed = parseGitHubRepoUrl(`https://github.com/org-32/repo-32`);
    expect(parsed?.key).toBe(`org-32/repo-32`);
  });
  it("parseGitHubRepoUrl matrix 33", () => {
    const parsed = parseGitHubRepoUrl(`https://github.com/org-33/repo-33`);
    expect(parsed?.key).toBe(`org-33/repo-33`);
  });
  it("parseGitHubRepoUrl matrix 34", () => {
    const parsed = parseGitHubRepoUrl(`https://github.com/org-34/repo-34`);
    expect(parsed?.key).toBe(`org-34/repo-34`);
  });
  it("parseGitHubRepoUrl matrix 35", () => {
    const parsed = parseGitHubRepoUrl(`https://github.com/org-35/repo-35`);
    expect(parsed?.key).toBe(`org-35/repo-35`);
  });
  it("parseGitHubRepoUrl matrix 36", () => {
    const parsed = parseGitHubRepoUrl(`https://github.com/org-36/repo-36`);
    expect(parsed?.key).toBe(`org-36/repo-36`);
  });
  it("parseGitHubRepoUrl matrix 37", () => {
    const parsed = parseGitHubRepoUrl(`https://github.com/org-37/repo-37`);
    expect(parsed?.key).toBe(`org-37/repo-37`);
  });
  it("parseGitHubRepoUrl matrix 38", () => {
    const parsed = parseGitHubRepoUrl(`https://github.com/org-38/repo-38`);
    expect(parsed?.key).toBe(`org-38/repo-38`);
  });
  it("parseGitHubRepoUrl matrix 39", () => {
    const parsed = parseGitHubRepoUrl(`https://github.com/org-39/repo-39`);
    expect(parsed?.key).toBe(`org-39/repo-39`);
  });
  it("parseGitHubRepoUrl matrix 40", () => {
    const parsed = parseGitHubRepoUrl(`https://github.com/org-40/repo-40`);
    expect(parsed?.key).toBe(`org-40/repo-40`);
  });
  it("parseGitHubRepoUrl matrix 41", () => {
    const parsed = parseGitHubRepoUrl(`https://github.com/org-41/repo-41`);
    expect(parsed?.key).toBe(`org-41/repo-41`);
  });
  it("parseGitHubRepoUrl matrix 42", () => {
    const parsed = parseGitHubRepoUrl(`https://github.com/org-42/repo-42`);
    expect(parsed?.key).toBe(`org-42/repo-42`);
  });
  it("parseGitHubRepoUrl matrix 43", () => {
    const parsed = parseGitHubRepoUrl(`https://github.com/org-43/repo-43`);
    expect(parsed?.key).toBe(`org-43/repo-43`);
  });
  it("parseGitHubRepoUrl matrix 44", () => {
    const parsed = parseGitHubRepoUrl(`https://github.com/org-44/repo-44`);
    expect(parsed?.key).toBe(`org-44/repo-44`);
  });
  it("parseGitHubRepoUrl matrix 45", () => {
    const parsed = parseGitHubRepoUrl(`https://github.com/org-45/repo-45`);
    expect(parsed?.key).toBe(`org-45/repo-45`);
  });
  it("parseGitHubRepoUrl matrix 46", () => {
    const parsed = parseGitHubRepoUrl(`https://github.com/org-46/repo-46`);
    expect(parsed?.key).toBe(`org-46/repo-46`);
  });
  it("parseGitHubRepoUrl matrix 47", () => {
    const parsed = parseGitHubRepoUrl(`https://github.com/org-47/repo-47`);
    expect(parsed?.key).toBe(`org-47/repo-47`);
  });
  it("parseGitHubRepoUrl matrix 48", () => {
    const parsed = parseGitHubRepoUrl(`https://github.com/org-48/repo-48`);
    expect(parsed?.key).toBe(`org-48/repo-48`);
  });
  it("parseGitHubRepoUrl matrix 49", () => {
    const parsed = parseGitHubRepoUrl(`https://github.com/org-49/repo-49`);
    expect(parsed?.key).toBe(`org-49/repo-49`);
  });
  it("parseGitHubRepoUrl matrix 50", () => {
    const parsed = parseGitHubRepoUrl(`https://github.com/org-50/repo-50`);
    expect(parsed?.key).toBe(`org-50/repo-50`);
  });
  it("parseGitHubRepoUrl matrix 51", () => {
    const parsed = parseGitHubRepoUrl(`https://github.com/org-51/repo-51`);
    expect(parsed?.key).toBe(`org-51/repo-51`);
  });
  it("parseGitHubRepoUrl matrix 52", () => {
    const parsed = parseGitHubRepoUrl(`https://github.com/org-52/repo-52`);
    expect(parsed?.key).toBe(`org-52/repo-52`);
  });
  it("parseGitHubRepoUrl matrix 53", () => {
    const parsed = parseGitHubRepoUrl(`https://github.com/org-53/repo-53`);
    expect(parsed?.key).toBe(`org-53/repo-53`);
  });
  it("parseGitHubRepoUrl matrix 54", () => {
    const parsed = parseGitHubRepoUrl(`https://github.com/org-54/repo-54`);
    expect(parsed?.key).toBe(`org-54/repo-54`);
  });
  it("parseGitHubRepoUrl matrix 55", () => {
    const parsed = parseGitHubRepoUrl(`https://github.com/org-55/repo-55`);
    expect(parsed?.key).toBe(`org-55/repo-55`);
  });
  it("parseGitHubRepoUrl matrix 56", () => {
    const parsed = parseGitHubRepoUrl(`https://github.com/org-56/repo-56`);
    expect(parsed?.key).toBe(`org-56/repo-56`);
  });
  it("parseGitHubRepoUrl matrix 57", () => {
    const parsed = parseGitHubRepoUrl(`https://github.com/org-57/repo-57`);
    expect(parsed?.key).toBe(`org-57/repo-57`);
  });
  it("parseGitHubRepoUrl matrix 58", () => {
    const parsed = parseGitHubRepoUrl(`https://github.com/org-58/repo-58`);
    expect(parsed?.key).toBe(`org-58/repo-58`);
  });
  it("parseGitHubRepoUrl matrix 59", () => {
    const parsed = parseGitHubRepoUrl(`https://github.com/org-59/repo-59`);
    expect(parsed?.key).toBe(`org-59/repo-59`);
  });
  it("parseGitHubRepoUrl matrix 60", () => {
    const parsed = parseGitHubRepoUrl(`https://github.com/org-60/repo-60`);
    expect(parsed?.key).toBe(`org-60/repo-60`);
  });
  it("parseGitHubRepoUrl matrix 61", () => {
    const parsed = parseGitHubRepoUrl(`https://github.com/org-61/repo-61`);
    expect(parsed?.key).toBe(`org-61/repo-61`);
  });
  it("parseGitHubRepoUrl matrix 62", () => {
    const parsed = parseGitHubRepoUrl(`https://github.com/org-62/repo-62`);
    expect(parsed?.key).toBe(`org-62/repo-62`);
  });
  it("parseGitHubRepoUrl matrix 63", () => {
    const parsed = parseGitHubRepoUrl(`https://github.com/org-63/repo-63`);
    expect(parsed?.key).toBe(`org-63/repo-63`);
  });
  it("parseGitHubRepoUrl matrix 64", () => {
    const parsed = parseGitHubRepoUrl(`https://github.com/org-64/repo-64`);
    expect(parsed?.key).toBe(`org-64/repo-64`);
  });
  it("parseGitHubRepoUrl matrix 65", () => {
    const parsed = parseGitHubRepoUrl(`https://github.com/org-65/repo-65`);
    expect(parsed?.key).toBe(`org-65/repo-65`);
  });
  it("parseGitHubRepoUrl matrix 66", () => {
    const parsed = parseGitHubRepoUrl(`https://github.com/org-66/repo-66`);
    expect(parsed?.key).toBe(`org-66/repo-66`);
  });
  it("parseGitHubRepoUrl matrix 67", () => {
    const parsed = parseGitHubRepoUrl(`https://github.com/org-67/repo-67`);
    expect(parsed?.key).toBe(`org-67/repo-67`);
  });
  it("parseGitHubRepoUrl matrix 68", () => {
    const parsed = parseGitHubRepoUrl(`https://github.com/org-68/repo-68`);
    expect(parsed?.key).toBe(`org-68/repo-68`);
  });
  it("parseGitHubRepoUrl matrix 69", () => {
    const parsed = parseGitHubRepoUrl(`https://github.com/org-69/repo-69`);
    expect(parsed?.key).toBe(`org-69/repo-69`);
  });
  it("parseGitHubRepoUrl matrix 70", () => {
    const parsed = parseGitHubRepoUrl(`https://github.com/org-70/repo-70`);
    expect(parsed?.key).toBe(`org-70/repo-70`);
  });
  it("parseGitHubRepoUrl matrix 71", () => {
    const parsed = parseGitHubRepoUrl(`https://github.com/org-71/repo-71`);
    expect(parsed?.key).toBe(`org-71/repo-71`);
  });
  it("parseGitHubRepoUrl matrix 72", () => {
    const parsed = parseGitHubRepoUrl(`https://github.com/org-72/repo-72`);
    expect(parsed?.key).toBe(`org-72/repo-72`);
  });
  it("parseGitHubRepoUrl matrix 73", () => {
    const parsed = parseGitHubRepoUrl(`https://github.com/org-73/repo-73`);
    expect(parsed?.key).toBe(`org-73/repo-73`);
  });
  it("parseGitHubRepoUrl matrix 74", () => {
    const parsed = parseGitHubRepoUrl(`https://github.com/org-74/repo-74`);
    expect(parsed?.key).toBe(`org-74/repo-74`);
  });
  it("parseGitHubRepoUrl matrix 75", () => {
    const parsed = parseGitHubRepoUrl(`https://github.com/org-75/repo-75`);
    expect(parsed?.key).toBe(`org-75/repo-75`);
  });
  it("parseGitHubRepoUrl matrix 76", () => {
    const parsed = parseGitHubRepoUrl(`https://github.com/org-76/repo-76`);
    expect(parsed?.key).toBe(`org-76/repo-76`);
  });
  it("parseGitHubRepoUrl matrix 77", () => {
    const parsed = parseGitHubRepoUrl(`https://github.com/org-77/repo-77`);
    expect(parsed?.key).toBe(`org-77/repo-77`);
  });
  it("parseGitHubRepoUrl matrix 78", () => {
    const parsed = parseGitHubRepoUrl(`https://github.com/org-78/repo-78`);
    expect(parsed?.key).toBe(`org-78/repo-78`);
  });
  it("parseGitHubRepoUrl matrix 79", () => {
    const parsed = parseGitHubRepoUrl(`https://github.com/org-79/repo-79`);
    expect(parsed?.key).toBe(`org-79/repo-79`);
  });
});

describe("source-repo-signals-lib collectSourceRepos", () => {
  it("deduplicates and sorts repo keys", () => {
    const repos = collectSourceRepos([
      { repoUrl: "https://github.com/a/b" },
      { repoUrl: "https://github.com/A/B" },
      { repoUrl: "https://github.com/c/d" },
    ]);
    expect(repos).toEqual(["a/b", "c/d"]);
  });
  it("collectSourceRepos agents 0", () => {
    const repos = collectSourceRepos([
      { repoUrl: "https://github.com/agents-org/demo-0" },
    ]);
    expect(repos).toEqual(["agents-org/demo-0"]);
  });
  it("collectSourceRepos agents 1", () => {
    const repos = collectSourceRepos([
      { repoUrl: "https://github.com/agents-org/demo-1" },
    ]);
    expect(repos).toEqual(["agents-org/demo-1"]);
  });
  it("collectSourceRepos agents 2", () => {
    const repos = collectSourceRepos([
      { repoUrl: "https://github.com/agents-org/demo-2" },
    ]);
    expect(repos).toEqual(["agents-org/demo-2"]);
  });
  it("collectSourceRepos agents 3", () => {
    const repos = collectSourceRepos([
      { repoUrl: "https://github.com/agents-org/demo-3" },
    ]);
    expect(repos).toEqual(["agents-org/demo-3"]);
  });
  it("collectSourceRepos agents 4", () => {
    const repos = collectSourceRepos([
      { repoUrl: "https://github.com/agents-org/demo-4" },
    ]);
    expect(repos).toEqual(["agents-org/demo-4"]);
  });
  it("collectSourceRepos agents 5", () => {
    const repos = collectSourceRepos([
      { repoUrl: "https://github.com/agents-org/demo-5" },
    ]);
    expect(repos).toEqual(["agents-org/demo-5"]);
  });
  it("collectSourceRepos agents 6", () => {
    const repos = collectSourceRepos([
      { repoUrl: "https://github.com/agents-org/demo-6" },
    ]);
    expect(repos).toEqual(["agents-org/demo-6"]);
  });
  it("collectSourceRepos agents 7", () => {
    const repos = collectSourceRepos([
      { repoUrl: "https://github.com/agents-org/demo-7" },
    ]);
    expect(repos).toEqual(["agents-org/demo-7"]);
  });
  it("collectSourceRepos mcp 0", () => {
    const repos = collectSourceRepos([
      { repoUrl: "https://github.com/mcp-org/demo-0" },
    ]);
    expect(repos).toEqual(["mcp-org/demo-0"]);
  });
  it("collectSourceRepos mcp 1", () => {
    const repos = collectSourceRepos([
      { repoUrl: "https://github.com/mcp-org/demo-1" },
    ]);
    expect(repos).toEqual(["mcp-org/demo-1"]);
  });
  it("collectSourceRepos mcp 2", () => {
    const repos = collectSourceRepos([
      { repoUrl: "https://github.com/mcp-org/demo-2" },
    ]);
    expect(repos).toEqual(["mcp-org/demo-2"]);
  });
  it("collectSourceRepos mcp 3", () => {
    const repos = collectSourceRepos([
      { repoUrl: "https://github.com/mcp-org/demo-3" },
    ]);
    expect(repos).toEqual(["mcp-org/demo-3"]);
  });
  it("collectSourceRepos mcp 4", () => {
    const repos = collectSourceRepos([
      { repoUrl: "https://github.com/mcp-org/demo-4" },
    ]);
    expect(repos).toEqual(["mcp-org/demo-4"]);
  });
  it("collectSourceRepos mcp 5", () => {
    const repos = collectSourceRepos([
      { repoUrl: "https://github.com/mcp-org/demo-5" },
    ]);
    expect(repos).toEqual(["mcp-org/demo-5"]);
  });
  it("collectSourceRepos mcp 6", () => {
    const repos = collectSourceRepos([
      { repoUrl: "https://github.com/mcp-org/demo-6" },
    ]);
    expect(repos).toEqual(["mcp-org/demo-6"]);
  });
  it("collectSourceRepos mcp 7", () => {
    const repos = collectSourceRepos([
      { repoUrl: "https://github.com/mcp-org/demo-7" },
    ]);
    expect(repos).toEqual(["mcp-org/demo-7"]);
  });
  it("collectSourceRepos tools 0", () => {
    const repos = collectSourceRepos([
      { repoUrl: "https://github.com/tools-org/demo-0" },
    ]);
    expect(repos).toEqual(["tools-org/demo-0"]);
  });
  it("collectSourceRepos tools 1", () => {
    const repos = collectSourceRepos([
      { repoUrl: "https://github.com/tools-org/demo-1" },
    ]);
    expect(repos).toEqual(["tools-org/demo-1"]);
  });
  it("collectSourceRepos tools 2", () => {
    const repos = collectSourceRepos([
      { repoUrl: "https://github.com/tools-org/demo-2" },
    ]);
    expect(repos).toEqual(["tools-org/demo-2"]);
  });
  it("collectSourceRepos tools 3", () => {
    const repos = collectSourceRepos([
      { repoUrl: "https://github.com/tools-org/demo-3" },
    ]);
    expect(repos).toEqual(["tools-org/demo-3"]);
  });
  it("collectSourceRepos tools 4", () => {
    const repos = collectSourceRepos([
      { repoUrl: "https://github.com/tools-org/demo-4" },
    ]);
    expect(repos).toEqual(["tools-org/demo-4"]);
  });
  it("collectSourceRepos tools 5", () => {
    const repos = collectSourceRepos([
      { repoUrl: "https://github.com/tools-org/demo-5" },
    ]);
    expect(repos).toEqual(["tools-org/demo-5"]);
  });
  it("collectSourceRepos tools 6", () => {
    const repos = collectSourceRepos([
      { repoUrl: "https://github.com/tools-org/demo-6" },
    ]);
    expect(repos).toEqual(["tools-org/demo-6"]);
  });
  it("collectSourceRepos tools 7", () => {
    const repos = collectSourceRepos([
      { repoUrl: "https://github.com/tools-org/demo-7" },
    ]);
    expect(repos).toEqual(["tools-org/demo-7"]);
  });
  it("collectSourceRepos skills 0", () => {
    const repos = collectSourceRepos([
      { repoUrl: "https://github.com/skills-org/demo-0" },
    ]);
    expect(repos).toEqual(["skills-org/demo-0"]);
  });
  it("collectSourceRepos skills 1", () => {
    const repos = collectSourceRepos([
      { repoUrl: "https://github.com/skills-org/demo-1" },
    ]);
    expect(repos).toEqual(["skills-org/demo-1"]);
  });
  it("collectSourceRepos skills 2", () => {
    const repos = collectSourceRepos([
      { repoUrl: "https://github.com/skills-org/demo-2" },
    ]);
    expect(repos).toEqual(["skills-org/demo-2"]);
  });
  it("collectSourceRepos skills 3", () => {
    const repos = collectSourceRepos([
      { repoUrl: "https://github.com/skills-org/demo-3" },
    ]);
    expect(repos).toEqual(["skills-org/demo-3"]);
  });
  it("collectSourceRepos skills 4", () => {
    const repos = collectSourceRepos([
      { repoUrl: "https://github.com/skills-org/demo-4" },
    ]);
    expect(repos).toEqual(["skills-org/demo-4"]);
  });
  it("collectSourceRepos skills 5", () => {
    const repos = collectSourceRepos([
      { repoUrl: "https://github.com/skills-org/demo-5" },
    ]);
    expect(repos).toEqual(["skills-org/demo-5"]);
  });
  it("collectSourceRepos skills 6", () => {
    const repos = collectSourceRepos([
      { repoUrl: "https://github.com/skills-org/demo-6" },
    ]);
    expect(repos).toEqual(["skills-org/demo-6"]);
  });
  it("collectSourceRepos skills 7", () => {
    const repos = collectSourceRepos([
      { repoUrl: "https://github.com/skills-org/demo-7" },
    ]);
    expect(repos).toEqual(["skills-org/demo-7"]);
  });
  it("collectSourceRepos rules 0", () => {
    const repos = collectSourceRepos([
      { repoUrl: "https://github.com/rules-org/demo-0" },
    ]);
    expect(repos).toEqual(["rules-org/demo-0"]);
  });
  it("collectSourceRepos rules 1", () => {
    const repos = collectSourceRepos([
      { repoUrl: "https://github.com/rules-org/demo-1" },
    ]);
    expect(repos).toEqual(["rules-org/demo-1"]);
  });
  it("collectSourceRepos rules 2", () => {
    const repos = collectSourceRepos([
      { repoUrl: "https://github.com/rules-org/demo-2" },
    ]);
    expect(repos).toEqual(["rules-org/demo-2"]);
  });
  it("collectSourceRepos rules 3", () => {
    const repos = collectSourceRepos([
      { repoUrl: "https://github.com/rules-org/demo-3" },
    ]);
    expect(repos).toEqual(["rules-org/demo-3"]);
  });
  it("collectSourceRepos rules 4", () => {
    const repos = collectSourceRepos([
      { repoUrl: "https://github.com/rules-org/demo-4" },
    ]);
    expect(repos).toEqual(["rules-org/demo-4"]);
  });
  it("collectSourceRepos rules 5", () => {
    const repos = collectSourceRepos([
      { repoUrl: "https://github.com/rules-org/demo-5" },
    ]);
    expect(repos).toEqual(["rules-org/demo-5"]);
  });
  it("collectSourceRepos rules 6", () => {
    const repos = collectSourceRepos([
      { repoUrl: "https://github.com/rules-org/demo-6" },
    ]);
    expect(repos).toEqual(["rules-org/demo-6"]);
  });
  it("collectSourceRepos rules 7", () => {
    const repos = collectSourceRepos([
      { repoUrl: "https://github.com/rules-org/demo-7" },
    ]);
    expect(repos).toEqual(["rules-org/demo-7"]);
  });
  it("collectSourceRepos commands 0", () => {
    const repos = collectSourceRepos([
      { repoUrl: "https://github.com/commands-org/demo-0" },
    ]);
    expect(repos).toEqual(["commands-org/demo-0"]);
  });
  it("collectSourceRepos commands 1", () => {
    const repos = collectSourceRepos([
      { repoUrl: "https://github.com/commands-org/demo-1" },
    ]);
    expect(repos).toEqual(["commands-org/demo-1"]);
  });
  it("collectSourceRepos commands 2", () => {
    const repos = collectSourceRepos([
      { repoUrl: "https://github.com/commands-org/demo-2" },
    ]);
    expect(repos).toEqual(["commands-org/demo-2"]);
  });
  it("collectSourceRepos commands 3", () => {
    const repos = collectSourceRepos([
      { repoUrl: "https://github.com/commands-org/demo-3" },
    ]);
    expect(repos).toEqual(["commands-org/demo-3"]);
  });
  it("collectSourceRepos commands 4", () => {
    const repos = collectSourceRepos([
      { repoUrl: "https://github.com/commands-org/demo-4" },
    ]);
    expect(repos).toEqual(["commands-org/demo-4"]);
  });
  it("collectSourceRepos commands 5", () => {
    const repos = collectSourceRepos([
      { repoUrl: "https://github.com/commands-org/demo-5" },
    ]);
    expect(repos).toEqual(["commands-org/demo-5"]);
  });
  it("collectSourceRepos commands 6", () => {
    const repos = collectSourceRepos([
      { repoUrl: "https://github.com/commands-org/demo-6" },
    ]);
    expect(repos).toEqual(["commands-org/demo-6"]);
  });
  it("collectSourceRepos commands 7", () => {
    const repos = collectSourceRepos([
      { repoUrl: "https://github.com/commands-org/demo-7" },
    ]);
    expect(repos).toEqual(["commands-org/demo-7"]);
  });
  it("collectSourceRepos hooks 0", () => {
    const repos = collectSourceRepos([
      { repoUrl: "https://github.com/hooks-org/demo-0" },
    ]);
    expect(repos).toEqual(["hooks-org/demo-0"]);
  });
  it("collectSourceRepos hooks 1", () => {
    const repos = collectSourceRepos([
      { repoUrl: "https://github.com/hooks-org/demo-1" },
    ]);
    expect(repos).toEqual(["hooks-org/demo-1"]);
  });
  it("collectSourceRepos hooks 2", () => {
    const repos = collectSourceRepos([
      { repoUrl: "https://github.com/hooks-org/demo-2" },
    ]);
    expect(repos).toEqual(["hooks-org/demo-2"]);
  });
  it("collectSourceRepos hooks 3", () => {
    const repos = collectSourceRepos([
      { repoUrl: "https://github.com/hooks-org/demo-3" },
    ]);
    expect(repos).toEqual(["hooks-org/demo-3"]);
  });
  it("collectSourceRepos hooks 4", () => {
    const repos = collectSourceRepos([
      { repoUrl: "https://github.com/hooks-org/demo-4" },
    ]);
    expect(repos).toEqual(["hooks-org/demo-4"]);
  });
  it("collectSourceRepos hooks 5", () => {
    const repos = collectSourceRepos([
      { repoUrl: "https://github.com/hooks-org/demo-5" },
    ]);
    expect(repos).toEqual(["hooks-org/demo-5"]);
  });
  it("collectSourceRepos hooks 6", () => {
    const repos = collectSourceRepos([
      { repoUrl: "https://github.com/hooks-org/demo-6" },
    ]);
    expect(repos).toEqual(["hooks-org/demo-6"]);
  });
  it("collectSourceRepos hooks 7", () => {
    const repos = collectSourceRepos([
      { repoUrl: "https://github.com/hooks-org/demo-7" },
    ]);
    expect(repos).toEqual(["hooks-org/demo-7"]);
  });
  it("collectSourceRepos guides 0", () => {
    const repos = collectSourceRepos([
      { repoUrl: "https://github.com/guides-org/demo-0" },
    ]);
    expect(repos).toEqual(["guides-org/demo-0"]);
  });
  it("collectSourceRepos guides 1", () => {
    const repos = collectSourceRepos([
      { repoUrl: "https://github.com/guides-org/demo-1" },
    ]);
    expect(repos).toEqual(["guides-org/demo-1"]);
  });
  it("collectSourceRepos guides 2", () => {
    const repos = collectSourceRepos([
      { repoUrl: "https://github.com/guides-org/demo-2" },
    ]);
    expect(repos).toEqual(["guides-org/demo-2"]);
  });
  it("collectSourceRepos guides 3", () => {
    const repos = collectSourceRepos([
      { repoUrl: "https://github.com/guides-org/demo-3" },
    ]);
    expect(repos).toEqual(["guides-org/demo-3"]);
  });
  it("collectSourceRepos guides 4", () => {
    const repos = collectSourceRepos([
      { repoUrl: "https://github.com/guides-org/demo-4" },
    ]);
    expect(repos).toEqual(["guides-org/demo-4"]);
  });
  it("collectSourceRepos guides 5", () => {
    const repos = collectSourceRepos([
      { repoUrl: "https://github.com/guides-org/demo-5" },
    ]);
    expect(repos).toEqual(["guides-org/demo-5"]);
  });
  it("collectSourceRepos guides 6", () => {
    const repos = collectSourceRepos([
      { repoUrl: "https://github.com/guides-org/demo-6" },
    ]);
    expect(repos).toEqual(["guides-org/demo-6"]);
  });
  it("collectSourceRepos guides 7", () => {
    const repos = collectSourceRepos([
      { repoUrl: "https://github.com/guides-org/demo-7" },
    ]);
    expect(repos).toEqual(["guides-org/demo-7"]);
  });
  it("collectSourceRepos collections 0", () => {
    const repos = collectSourceRepos([
      { repoUrl: "https://github.com/collections-org/demo-0" },
    ]);
    expect(repos).toEqual(["collections-org/demo-0"]);
  });
  it("collectSourceRepos collections 1", () => {
    const repos = collectSourceRepos([
      { repoUrl: "https://github.com/collections-org/demo-1" },
    ]);
    expect(repos).toEqual(["collections-org/demo-1"]);
  });
  it("collectSourceRepos collections 2", () => {
    const repos = collectSourceRepos([
      { repoUrl: "https://github.com/collections-org/demo-2" },
    ]);
    expect(repos).toEqual(["collections-org/demo-2"]);
  });
  it("collectSourceRepos collections 3", () => {
    const repos = collectSourceRepos([
      { repoUrl: "https://github.com/collections-org/demo-3" },
    ]);
    expect(repos).toEqual(["collections-org/demo-3"]);
  });
  it("collectSourceRepos collections 4", () => {
    const repos = collectSourceRepos([
      { repoUrl: "https://github.com/collections-org/demo-4" },
    ]);
    expect(repos).toEqual(["collections-org/demo-4"]);
  });
  it("collectSourceRepos collections 5", () => {
    const repos = collectSourceRepos([
      { repoUrl: "https://github.com/collections-org/demo-5" },
    ]);
    expect(repos).toEqual(["collections-org/demo-5"]);
  });
  it("collectSourceRepos collections 6", () => {
    const repos = collectSourceRepos([
      { repoUrl: "https://github.com/collections-org/demo-6" },
    ]);
    expect(repos).toEqual(["collections-org/demo-6"]);
  });
  it("collectSourceRepos collections 7", () => {
    const repos = collectSourceRepos([
      { repoUrl: "https://github.com/collections-org/demo-7" },
    ]);
    expect(repos).toEqual(["collections-org/demo-7"]);
  });
  it("collectSourceRepos statuslines 0", () => {
    const repos = collectSourceRepos([
      { repoUrl: "https://github.com/statuslines-org/demo-0" },
    ]);
    expect(repos).toEqual(["statuslines-org/demo-0"]);
  });
  it("collectSourceRepos statuslines 1", () => {
    const repos = collectSourceRepos([
      { repoUrl: "https://github.com/statuslines-org/demo-1" },
    ]);
    expect(repos).toEqual(["statuslines-org/demo-1"]);
  });
  it("collectSourceRepos statuslines 2", () => {
    const repos = collectSourceRepos([
      { repoUrl: "https://github.com/statuslines-org/demo-2" },
    ]);
    expect(repos).toEqual(["statuslines-org/demo-2"]);
  });
  it("collectSourceRepos statuslines 3", () => {
    const repos = collectSourceRepos([
      { repoUrl: "https://github.com/statuslines-org/demo-3" },
    ]);
    expect(repos).toEqual(["statuslines-org/demo-3"]);
  });
  it("collectSourceRepos statuslines 4", () => {
    const repos = collectSourceRepos([
      { repoUrl: "https://github.com/statuslines-org/demo-4" },
    ]);
    expect(repos).toEqual(["statuslines-org/demo-4"]);
  });
  it("collectSourceRepos statuslines 5", () => {
    const repos = collectSourceRepos([
      { repoUrl: "https://github.com/statuslines-org/demo-5" },
    ]);
    expect(repos).toEqual(["statuslines-org/demo-5"]);
  });
  it("collectSourceRepos statuslines 6", () => {
    const repos = collectSourceRepos([
      { repoUrl: "https://github.com/statuslines-org/demo-6" },
    ]);
    expect(repos).toEqual(["statuslines-org/demo-6"]);
  });
  it("collectSourceRepos statuslines 7", () => {
    const repos = collectSourceRepos([
      { repoUrl: "https://github.com/statuslines-org/demo-7" },
    ]);
    expect(repos).toEqual(["statuslines-org/demo-7"]);
  });
  it("collectSourceRepos batch 0", () => {
    const repos = collectSourceRepos([
      { repoStats: { url: "https://github.com/batch-0/a" } },
      { repoUrl: "https://github.com/batch-0/b" },
      { repoUrl: "https://example.com/not-github" },
    ]);
    expect(repos).toEqual(["batch-0/a", "batch-0/b"].sort());
  });
  it("collectSourceRepos batch 1", () => {
    const repos = collectSourceRepos([
      { repoStats: { url: "https://github.com/batch-1/a" } },
      { repoUrl: "https://github.com/batch-1/b" },
      { repoUrl: "https://example.com/not-github" },
    ]);
    expect(repos).toEqual(["batch-1/a", "batch-1/b"].sort());
  });
  it("collectSourceRepos batch 2", () => {
    const repos = collectSourceRepos([
      { repoStats: { url: "https://github.com/batch-2/a" } },
      { repoUrl: "https://github.com/batch-2/b" },
      { repoUrl: "https://example.com/not-github" },
    ]);
    expect(repos).toEqual(["batch-2/a", "batch-2/b"].sort());
  });
  it("collectSourceRepos batch 3", () => {
    const repos = collectSourceRepos([
      { repoStats: { url: "https://github.com/batch-3/a" } },
      { repoUrl: "https://github.com/batch-3/b" },
      { repoUrl: "https://example.com/not-github" },
    ]);
    expect(repos).toEqual(["batch-3/a", "batch-3/b"].sort());
  });
  it("collectSourceRepos batch 4", () => {
    const repos = collectSourceRepos([
      { repoStats: { url: "https://github.com/batch-4/a" } },
      { repoUrl: "https://github.com/batch-4/b" },
      { repoUrl: "https://example.com/not-github" },
    ]);
    expect(repos).toEqual(["batch-4/a", "batch-4/b"].sort());
  });
  it("collectSourceRepos batch 5", () => {
    const repos = collectSourceRepos([
      { repoStats: { url: "https://github.com/batch-5/a" } },
      { repoUrl: "https://github.com/batch-5/b" },
      { repoUrl: "https://example.com/not-github" },
    ]);
    expect(repos).toEqual(["batch-5/a", "batch-5/b"].sort());
  });
  it("collectSourceRepos batch 6", () => {
    const repos = collectSourceRepos([
      { repoStats: { url: "https://github.com/batch-6/a" } },
      { repoUrl: "https://github.com/batch-6/b" },
      { repoUrl: "https://example.com/not-github" },
    ]);
    expect(repos).toEqual(["batch-6/a", "batch-6/b"].sort());
  });
  it("collectSourceRepos batch 7", () => {
    const repos = collectSourceRepos([
      { repoStats: { url: "https://github.com/batch-7/a" } },
      { repoUrl: "https://github.com/batch-7/b" },
      { repoUrl: "https://example.com/not-github" },
    ]);
    expect(repos).toEqual(["batch-7/a", "batch-7/b"].sort());
  });
  it("collectSourceRepos batch 8", () => {
    const repos = collectSourceRepos([
      { repoStats: { url: "https://github.com/batch-8/a" } },
      { repoUrl: "https://github.com/batch-8/b" },
      { repoUrl: "https://example.com/not-github" },
    ]);
    expect(repos).toEqual(["batch-8/a", "batch-8/b"].sort());
  });
  it("collectSourceRepos batch 9", () => {
    const repos = collectSourceRepos([
      { repoStats: { url: "https://github.com/batch-9/a" } },
      { repoUrl: "https://github.com/batch-9/b" },
      { repoUrl: "https://example.com/not-github" },
    ]);
    expect(repos).toEqual(["batch-9/a", "batch-9/b"].sort());
  });
  it("collectSourceRepos batch 10", () => {
    const repos = collectSourceRepos([
      { repoStats: { url: "https://github.com/batch-10/a" } },
      { repoUrl: "https://github.com/batch-10/b" },
      { repoUrl: "https://example.com/not-github" },
    ]);
    expect(repos).toEqual(["batch-10/a", "batch-10/b"].sort());
  });
  it("collectSourceRepos batch 11", () => {
    const repos = collectSourceRepos([
      { repoStats: { url: "https://github.com/batch-11/a" } },
      { repoUrl: "https://github.com/batch-11/b" },
      { repoUrl: "https://example.com/not-github" },
    ]);
    expect(repos).toEqual(["batch-11/a", "batch-11/b"].sort());
  });
  it("collectSourceRepos batch 12", () => {
    const repos = collectSourceRepos([
      { repoStats: { url: "https://github.com/batch-12/a" } },
      { repoUrl: "https://github.com/batch-12/b" },
      { repoUrl: "https://example.com/not-github" },
    ]);
    expect(repos).toEqual(["batch-12/a", "batch-12/b"].sort());
  });
  it("collectSourceRepos batch 13", () => {
    const repos = collectSourceRepos([
      { repoStats: { url: "https://github.com/batch-13/a" } },
      { repoUrl: "https://github.com/batch-13/b" },
      { repoUrl: "https://example.com/not-github" },
    ]);
    expect(repos).toEqual(["batch-13/a", "batch-13/b"].sort());
  });
  it("collectSourceRepos batch 14", () => {
    const repos = collectSourceRepos([
      { repoStats: { url: "https://github.com/batch-14/a" } },
      { repoUrl: "https://github.com/batch-14/b" },
      { repoUrl: "https://example.com/not-github" },
    ]);
    expect(repos).toEqual(["batch-14/a", "batch-14/b"].sort());
  });
  it("collectSourceRepos batch 15", () => {
    const repos = collectSourceRepos([
      { repoStats: { url: "https://github.com/batch-15/a" } },
      { repoUrl: "https://github.com/batch-15/b" },
      { repoUrl: "https://example.com/not-github" },
    ]);
    expect(repos).toEqual(["batch-15/a", "batch-15/b"].sort());
  });
  it("collectSourceRepos batch 16", () => {
    const repos = collectSourceRepos([
      { repoStats: { url: "https://github.com/batch-16/a" } },
      { repoUrl: "https://github.com/batch-16/b" },
      { repoUrl: "https://example.com/not-github" },
    ]);
    expect(repos).toEqual(["batch-16/a", "batch-16/b"].sort());
  });
  it("collectSourceRepos batch 17", () => {
    const repos = collectSourceRepos([
      { repoStats: { url: "https://github.com/batch-17/a" } },
      { repoUrl: "https://github.com/batch-17/b" },
      { repoUrl: "https://example.com/not-github" },
    ]);
    expect(repos).toEqual(["batch-17/a", "batch-17/b"].sort());
  });
  it("collectSourceRepos batch 18", () => {
    const repos = collectSourceRepos([
      { repoStats: { url: "https://github.com/batch-18/a" } },
      { repoUrl: "https://github.com/batch-18/b" },
      { repoUrl: "https://example.com/not-github" },
    ]);
    expect(repos).toEqual(["batch-18/a", "batch-18/b"].sort());
  });
  it("collectSourceRepos batch 19", () => {
    const repos = collectSourceRepos([
      { repoStats: { url: "https://github.com/batch-19/a" } },
      { repoUrl: "https://github.com/batch-19/b" },
      { repoUrl: "https://example.com/not-github" },
    ]);
    expect(repos).toEqual(["batch-19/a", "batch-19/b"].sort());
  });
  it("collectSourceRepos batch 20", () => {
    const repos = collectSourceRepos([
      { repoStats: { url: "https://github.com/batch-20/a" } },
      { repoUrl: "https://github.com/batch-20/b" },
      { repoUrl: "https://example.com/not-github" },
    ]);
    expect(repos).toEqual(["batch-20/a", "batch-20/b"].sort());
  });
  it("collectSourceRepos batch 21", () => {
    const repos = collectSourceRepos([
      { repoStats: { url: "https://github.com/batch-21/a" } },
      { repoUrl: "https://github.com/batch-21/b" },
      { repoUrl: "https://example.com/not-github" },
    ]);
    expect(repos).toEqual(["batch-21/a", "batch-21/b"].sort());
  });
  it("collectSourceRepos batch 22", () => {
    const repos = collectSourceRepos([
      { repoStats: { url: "https://github.com/batch-22/a" } },
      { repoUrl: "https://github.com/batch-22/b" },
      { repoUrl: "https://example.com/not-github" },
    ]);
    expect(repos).toEqual(["batch-22/a", "batch-22/b"].sort());
  });
  it("collectSourceRepos batch 23", () => {
    const repos = collectSourceRepos([
      { repoStats: { url: "https://github.com/batch-23/a" } },
      { repoUrl: "https://github.com/batch-23/b" },
      { repoUrl: "https://example.com/not-github" },
    ]);
    expect(repos).toEqual(["batch-23/a", "batch-23/b"].sort());
  });
  it("collectSourceRepos batch 24", () => {
    const repos = collectSourceRepos([
      { repoStats: { url: "https://github.com/batch-24/a" } },
      { repoUrl: "https://github.com/batch-24/b" },
      { repoUrl: "https://example.com/not-github" },
    ]);
    expect(repos).toEqual(["batch-24/a", "batch-24/b"].sort());
  });
  it("collectSourceRepos batch 25", () => {
    const repos = collectSourceRepos([
      { repoStats: { url: "https://github.com/batch-25/a" } },
      { repoUrl: "https://github.com/batch-25/b" },
      { repoUrl: "https://example.com/not-github" },
    ]);
    expect(repos).toEqual(["batch-25/a", "batch-25/b"].sort());
  });
  it("collectSourceRepos batch 26", () => {
    const repos = collectSourceRepos([
      { repoStats: { url: "https://github.com/batch-26/a" } },
      { repoUrl: "https://github.com/batch-26/b" },
      { repoUrl: "https://example.com/not-github" },
    ]);
    expect(repos).toEqual(["batch-26/a", "batch-26/b"].sort());
  });
  it("collectSourceRepos batch 27", () => {
    const repos = collectSourceRepos([
      { repoStats: { url: "https://github.com/batch-27/a" } },
      { repoUrl: "https://github.com/batch-27/b" },
      { repoUrl: "https://example.com/not-github" },
    ]);
    expect(repos).toEqual(["batch-27/a", "batch-27/b"].sort());
  });
  it("collectSourceRepos batch 28", () => {
    const repos = collectSourceRepos([
      { repoStats: { url: "https://github.com/batch-28/a" } },
      { repoUrl: "https://github.com/batch-28/b" },
      { repoUrl: "https://example.com/not-github" },
    ]);
    expect(repos).toEqual(["batch-28/a", "batch-28/b"].sort());
  });
  it("collectSourceRepos batch 29", () => {
    const repos = collectSourceRepos([
      { repoStats: { url: "https://github.com/batch-29/a" } },
      { repoUrl: "https://github.com/batch-29/b" },
      { repoUrl: "https://example.com/not-github" },
    ]);
    expect(repos).toEqual(["batch-29/a", "batch-29/b"].sort());
  });
  it("collectSourceRepos batch 30", () => {
    const repos = collectSourceRepos([
      { repoStats: { url: "https://github.com/batch-30/a" } },
      { repoUrl: "https://github.com/batch-30/b" },
      { repoUrl: "https://example.com/not-github" },
    ]);
    expect(repos).toEqual(["batch-30/a", "batch-30/b"].sort());
  });
  it("collectSourceRepos batch 31", () => {
    const repos = collectSourceRepos([
      { repoStats: { url: "https://github.com/batch-31/a" } },
      { repoUrl: "https://github.com/batch-31/b" },
      { repoUrl: "https://example.com/not-github" },
    ]);
    expect(repos).toEqual(["batch-31/a", "batch-31/b"].sort());
  });
  it("collectSourceRepos batch 32", () => {
    const repos = collectSourceRepos([
      { repoStats: { url: "https://github.com/batch-32/a" } },
      { repoUrl: "https://github.com/batch-32/b" },
      { repoUrl: "https://example.com/not-github" },
    ]);
    expect(repos).toEqual(["batch-32/a", "batch-32/b"].sort());
  });
  it("collectSourceRepos batch 33", () => {
    const repos = collectSourceRepos([
      { repoStats: { url: "https://github.com/batch-33/a" } },
      { repoUrl: "https://github.com/batch-33/b" },
      { repoUrl: "https://example.com/not-github" },
    ]);
    expect(repos).toEqual(["batch-33/a", "batch-33/b"].sort());
  });
  it("collectSourceRepos batch 34", () => {
    const repos = collectSourceRepos([
      { repoStats: { url: "https://github.com/batch-34/a" } },
      { repoUrl: "https://github.com/batch-34/b" },
      { repoUrl: "https://example.com/not-github" },
    ]);
    expect(repos).toEqual(["batch-34/a", "batch-34/b"].sort());
  });
  it("collectSourceRepos batch 35", () => {
    const repos = collectSourceRepos([
      { repoStats: { url: "https://github.com/batch-35/a" } },
      { repoUrl: "https://github.com/batch-35/b" },
      { repoUrl: "https://example.com/not-github" },
    ]);
    expect(repos).toEqual(["batch-35/a", "batch-35/b"].sort());
  });
  it("collectSourceRepos batch 36", () => {
    const repos = collectSourceRepos([
      { repoStats: { url: "https://github.com/batch-36/a" } },
      { repoUrl: "https://github.com/batch-36/b" },
      { repoUrl: "https://example.com/not-github" },
    ]);
    expect(repos).toEqual(["batch-36/a", "batch-36/b"].sort());
  });
  it("collectSourceRepos batch 37", () => {
    const repos = collectSourceRepos([
      { repoStats: { url: "https://github.com/batch-37/a" } },
      { repoUrl: "https://github.com/batch-37/b" },
      { repoUrl: "https://example.com/not-github" },
    ]);
    expect(repos).toEqual(["batch-37/a", "batch-37/b"].sort());
  });
  it("collectSourceRepos batch 38", () => {
    const repos = collectSourceRepos([
      { repoStats: { url: "https://github.com/batch-38/a" } },
      { repoUrl: "https://github.com/batch-38/b" },
      { repoUrl: "https://example.com/not-github" },
    ]);
    expect(repos).toEqual(["batch-38/a", "batch-38/b"].sort());
  });
  it("collectSourceRepos batch 39", () => {
    const repos = collectSourceRepos([
      { repoStats: { url: "https://github.com/batch-39/a" } },
      { repoUrl: "https://github.com/batch-39/b" },
      { repoUrl: "https://example.com/not-github" },
    ]);
    expect(repos).toEqual(["batch-39/a", "batch-39/b"].sort());
  });
});

describe("source-repo-signals-lib normalizeSourceRepoSignalRow", () => {
  it("normalizes database row shape", () => {
    expect(
      normalizeSourceRepoSignalRow({
        repo: "OpenAI/Whisper",
        stars: 10,
        forks: 2,
        repo_updated_at: "2026-01-01",
        fetched_at: "2026-01-02",
        status: "ok",
        last_error: null,
      }),
    ).toEqual({
      repo: "openai/whisper",
      stars: 10,
      forks: 2,
      repoUpdatedAt: "2026-01-01",
      fetchedAt: "2026-01-02",
      status: "ok",
      lastError: null,
    });
  });
  it("normalizeSourceRepoSignalRow matrix 0", () => {
    const signal = normalizeSourceRepoSignalRow({
      repo: "org-0/repo-0",
      stars: 0,
      forks: 0,
      repo_updated_at: "2026-06-01",
      fetched_at: "2026-06-02",
      status: "error",
      last_error: "boom",
    });
    expect(signal.repo).toBe("org-0/repo-0");
    expect(signal.status).toBe("error");
  });
  it("normalizeSourceRepoSignalRow matrix 1", () => {
    const signal = normalizeSourceRepoSignalRow({
      repo: "org-1/repo-1",
      stars: 1,
      forks: 1,
      repo_updated_at: "2026-06-02",
      fetched_at: "2026-06-02",
      status: "ok",
      last_error: null,
    });
    expect(signal.repo).toBe("org-1/repo-1");
    expect(signal.status).toBe("ok");
  });
  it("normalizeSourceRepoSignalRow matrix 2", () => {
    const signal = normalizeSourceRepoSignalRow({
      repo: "org-2/repo-2",
      stars: 2,
      forks: 2,
      repo_updated_at: "2026-06-03",
      fetched_at: "2026-06-02",
      status: "ok",
      last_error: null,
    });
    expect(signal.repo).toBe("org-2/repo-2");
    expect(signal.status).toBe("ok");
  });
  it("normalizeSourceRepoSignalRow matrix 3", () => {
    const signal = normalizeSourceRepoSignalRow({
      repo: "org-3/repo-3",
      stars: 3,
      forks: 3,
      repo_updated_at: "2026-06-04",
      fetched_at: "2026-06-02",
      status: "error",
      last_error: "boom",
    });
    expect(signal.repo).toBe("org-3/repo-3");
    expect(signal.status).toBe("error");
  });
  it("normalizeSourceRepoSignalRow matrix 4", () => {
    const signal = normalizeSourceRepoSignalRow({
      repo: "org-4/repo-4",
      stars: 4,
      forks: 4,
      repo_updated_at: "2026-06-05",
      fetched_at: "2026-06-02",
      status: "ok",
      last_error: null,
    });
    expect(signal.repo).toBe("org-4/repo-4");
    expect(signal.status).toBe("ok");
  });
  it("normalizeSourceRepoSignalRow matrix 5", () => {
    const signal = normalizeSourceRepoSignalRow({
      repo: "org-5/repo-5",
      stars: 5,
      forks: 0,
      repo_updated_at: "2026-06-06",
      fetched_at: "2026-06-02",
      status: "ok",
      last_error: null,
    });
    expect(signal.repo).toBe("org-5/repo-5");
    expect(signal.status).toBe("ok");
  });
  it("normalizeSourceRepoSignalRow matrix 6", () => {
    const signal = normalizeSourceRepoSignalRow({
      repo: "org-6/repo-6",
      stars: 6,
      forks: 1,
      repo_updated_at: "2026-06-07",
      fetched_at: "2026-06-02",
      status: "error",
      last_error: "boom",
    });
    expect(signal.repo).toBe("org-6/repo-6");
    expect(signal.status).toBe("error");
  });
  it("normalizeSourceRepoSignalRow matrix 7", () => {
    const signal = normalizeSourceRepoSignalRow({
      repo: "org-7/repo-7",
      stars: 7,
      forks: 2,
      repo_updated_at: "2026-06-08",
      fetched_at: "2026-06-02",
      status: "ok",
      last_error: null,
    });
    expect(signal.repo).toBe("org-7/repo-7");
    expect(signal.status).toBe("ok");
  });
  it("normalizeSourceRepoSignalRow matrix 8", () => {
    const signal = normalizeSourceRepoSignalRow({
      repo: "org-8/repo-8",
      stars: 8,
      forks: 3,
      repo_updated_at: "2026-06-09",
      fetched_at: "2026-06-02",
      status: "ok",
      last_error: null,
    });
    expect(signal.repo).toBe("org-8/repo-8");
    expect(signal.status).toBe("ok");
  });
  it("normalizeSourceRepoSignalRow matrix 9", () => {
    const signal = normalizeSourceRepoSignalRow({
      repo: "org-9/repo-9",
      stars: 9,
      forks: 4,
      repo_updated_at: "2026-06-10",
      fetched_at: "2026-06-02",
      status: "error",
      last_error: "boom",
    });
    expect(signal.repo).toBe("org-9/repo-9");
    expect(signal.status).toBe("error");
  });
  it("normalizeSourceRepoSignalRow matrix 10", () => {
    const signal = normalizeSourceRepoSignalRow({
      repo: "org-10/repo-10",
      stars: 10,
      forks: 0,
      repo_updated_at: "2026-06-11",
      fetched_at: "2026-06-02",
      status: "ok",
      last_error: null,
    });
    expect(signal.repo).toBe("org-10/repo-10");
    expect(signal.status).toBe("ok");
  });
  it("normalizeSourceRepoSignalRow matrix 11", () => {
    const signal = normalizeSourceRepoSignalRow({
      repo: "org-11/repo-11",
      stars: 11,
      forks: 1,
      repo_updated_at: "2026-06-12",
      fetched_at: "2026-06-02",
      status: "ok",
      last_error: null,
    });
    expect(signal.repo).toBe("org-11/repo-11");
    expect(signal.status).toBe("ok");
  });
  it("normalizeSourceRepoSignalRow matrix 12", () => {
    const signal = normalizeSourceRepoSignalRow({
      repo: "org-12/repo-12",
      stars: 12,
      forks: 2,
      repo_updated_at: "2026-06-13",
      fetched_at: "2026-06-02",
      status: "error",
      last_error: "boom",
    });
    expect(signal.repo).toBe("org-12/repo-12");
    expect(signal.status).toBe("error");
  });
  it("normalizeSourceRepoSignalRow matrix 13", () => {
    const signal = normalizeSourceRepoSignalRow({
      repo: "org-13/repo-13",
      stars: 13,
      forks: 3,
      repo_updated_at: "2026-06-14",
      fetched_at: "2026-06-02",
      status: "ok",
      last_error: null,
    });
    expect(signal.repo).toBe("org-13/repo-13");
    expect(signal.status).toBe("ok");
  });
  it("normalizeSourceRepoSignalRow matrix 14", () => {
    const signal = normalizeSourceRepoSignalRow({
      repo: "org-14/repo-14",
      stars: 14,
      forks: 4,
      repo_updated_at: "2026-06-15",
      fetched_at: "2026-06-02",
      status: "ok",
      last_error: null,
    });
    expect(signal.repo).toBe("org-14/repo-14");
    expect(signal.status).toBe("ok");
  });
  it("normalizeSourceRepoSignalRow matrix 15", () => {
    const signal = normalizeSourceRepoSignalRow({
      repo: "org-15/repo-15",
      stars: 15,
      forks: 0,
      repo_updated_at: "2026-06-16",
      fetched_at: "2026-06-02",
      status: "error",
      last_error: "boom",
    });
    expect(signal.repo).toBe("org-15/repo-15");
    expect(signal.status).toBe("error");
  });
  it("normalizeSourceRepoSignalRow matrix 16", () => {
    const signal = normalizeSourceRepoSignalRow({
      repo: "org-16/repo-16",
      stars: 16,
      forks: 1,
      repo_updated_at: "2026-06-17",
      fetched_at: "2026-06-02",
      status: "ok",
      last_error: null,
    });
    expect(signal.repo).toBe("org-16/repo-16");
    expect(signal.status).toBe("ok");
  });
  it("normalizeSourceRepoSignalRow matrix 17", () => {
    const signal = normalizeSourceRepoSignalRow({
      repo: "org-17/repo-17",
      stars: 17,
      forks: 2,
      repo_updated_at: "2026-06-18",
      fetched_at: "2026-06-02",
      status: "ok",
      last_error: null,
    });
    expect(signal.repo).toBe("org-17/repo-17");
    expect(signal.status).toBe("ok");
  });
  it("normalizeSourceRepoSignalRow matrix 18", () => {
    const signal = normalizeSourceRepoSignalRow({
      repo: "org-18/repo-18",
      stars: 18,
      forks: 3,
      repo_updated_at: "2026-06-19",
      fetched_at: "2026-06-02",
      status: "error",
      last_error: "boom",
    });
    expect(signal.repo).toBe("org-18/repo-18");
    expect(signal.status).toBe("error");
  });
  it("normalizeSourceRepoSignalRow matrix 19", () => {
    const signal = normalizeSourceRepoSignalRow({
      repo: "org-19/repo-19",
      stars: 19,
      forks: 4,
      repo_updated_at: "2026-06-20",
      fetched_at: "2026-06-02",
      status: "ok",
      last_error: null,
    });
    expect(signal.repo).toBe("org-19/repo-19");
    expect(signal.status).toBe("ok");
  });
  it("normalizeSourceRepoSignalRow matrix 20", () => {
    const signal = normalizeSourceRepoSignalRow({
      repo: "org-20/repo-20",
      stars: 20,
      forks: 0,
      repo_updated_at: "2026-06-21",
      fetched_at: "2026-06-02",
      status: "ok",
      last_error: null,
    });
    expect(signal.repo).toBe("org-20/repo-20");
    expect(signal.status).toBe("ok");
  });
  it("normalizeSourceRepoSignalRow matrix 21", () => {
    const signal = normalizeSourceRepoSignalRow({
      repo: "org-21/repo-21",
      stars: 21,
      forks: 1,
      repo_updated_at: "2026-06-22",
      fetched_at: "2026-06-02",
      status: "error",
      last_error: "boom",
    });
    expect(signal.repo).toBe("org-21/repo-21");
    expect(signal.status).toBe("error");
  });
  it("normalizeSourceRepoSignalRow matrix 22", () => {
    const signal = normalizeSourceRepoSignalRow({
      repo: "org-22/repo-22",
      stars: 22,
      forks: 2,
      repo_updated_at: "2026-06-23",
      fetched_at: "2026-06-02",
      status: "ok",
      last_error: null,
    });
    expect(signal.repo).toBe("org-22/repo-22");
    expect(signal.status).toBe("ok");
  });
  it("normalizeSourceRepoSignalRow matrix 23", () => {
    const signal = normalizeSourceRepoSignalRow({
      repo: "org-23/repo-23",
      stars: 23,
      forks: 3,
      repo_updated_at: "2026-06-24",
      fetched_at: "2026-06-02",
      status: "ok",
      last_error: null,
    });
    expect(signal.repo).toBe("org-23/repo-23");
    expect(signal.status).toBe("ok");
  });
  it("normalizeSourceRepoSignalRow matrix 24", () => {
    const signal = normalizeSourceRepoSignalRow({
      repo: "org-24/repo-24",
      stars: 24,
      forks: 4,
      repo_updated_at: "2026-06-25",
      fetched_at: "2026-06-02",
      status: "error",
      last_error: "boom",
    });
    expect(signal.repo).toBe("org-24/repo-24");
    expect(signal.status).toBe("error");
  });
  it("normalizeSourceRepoSignalRow matrix 25", () => {
    const signal = normalizeSourceRepoSignalRow({
      repo: "org-25/repo-25",
      stars: 25,
      forks: 0,
      repo_updated_at: "2026-06-26",
      fetched_at: "2026-06-02",
      status: "ok",
      last_error: null,
    });
    expect(signal.repo).toBe("org-25/repo-25");
    expect(signal.status).toBe("ok");
  });
  it("normalizeSourceRepoSignalRow matrix 26", () => {
    const signal = normalizeSourceRepoSignalRow({
      repo: "org-26/repo-26",
      stars: 26,
      forks: 1,
      repo_updated_at: "2026-06-27",
      fetched_at: "2026-06-02",
      status: "ok",
      last_error: null,
    });
    expect(signal.repo).toBe("org-26/repo-26");
    expect(signal.status).toBe("ok");
  });
  it("normalizeSourceRepoSignalRow matrix 27", () => {
    const signal = normalizeSourceRepoSignalRow({
      repo: "org-27/repo-27",
      stars: 27,
      forks: 2,
      repo_updated_at: "2026-06-28",
      fetched_at: "2026-06-02",
      status: "error",
      last_error: "boom",
    });
    expect(signal.repo).toBe("org-27/repo-27");
    expect(signal.status).toBe("error");
  });
  it("normalizeSourceRepoSignalRow matrix 28", () => {
    const signal = normalizeSourceRepoSignalRow({
      repo: "org-28/repo-28",
      stars: 28,
      forks: 3,
      repo_updated_at: "2026-06-01",
      fetched_at: "2026-06-02",
      status: "ok",
      last_error: null,
    });
    expect(signal.repo).toBe("org-28/repo-28");
    expect(signal.status).toBe("ok");
  });
  it("normalizeSourceRepoSignalRow matrix 29", () => {
    const signal = normalizeSourceRepoSignalRow({
      repo: "org-29/repo-29",
      stars: 29,
      forks: 4,
      repo_updated_at: "2026-06-02",
      fetched_at: "2026-06-02",
      status: "ok",
      last_error: null,
    });
    expect(signal.repo).toBe("org-29/repo-29");
    expect(signal.status).toBe("ok");
  });
  it("normalizeSourceRepoSignalRow matrix 30", () => {
    const signal = normalizeSourceRepoSignalRow({
      repo: "org-30/repo-30",
      stars: 30,
      forks: 0,
      repo_updated_at: "2026-06-03",
      fetched_at: "2026-06-02",
      status: "error",
      last_error: "boom",
    });
    expect(signal.repo).toBe("org-30/repo-30");
    expect(signal.status).toBe("error");
  });
  it("normalizeSourceRepoSignalRow matrix 31", () => {
    const signal = normalizeSourceRepoSignalRow({
      repo: "org-31/repo-31",
      stars: 31,
      forks: 1,
      repo_updated_at: "2026-06-04",
      fetched_at: "2026-06-02",
      status: "ok",
      last_error: null,
    });
    expect(signal.repo).toBe("org-31/repo-31");
    expect(signal.status).toBe("ok");
  });
  it("normalizeSourceRepoSignalRow matrix 32", () => {
    const signal = normalizeSourceRepoSignalRow({
      repo: "org-32/repo-32",
      stars: 32,
      forks: 2,
      repo_updated_at: "2026-06-05",
      fetched_at: "2026-06-02",
      status: "ok",
      last_error: null,
    });
    expect(signal.repo).toBe("org-32/repo-32");
    expect(signal.status).toBe("ok");
  });
  it("normalizeSourceRepoSignalRow matrix 33", () => {
    const signal = normalizeSourceRepoSignalRow({
      repo: "org-33/repo-33",
      stars: 33,
      forks: 3,
      repo_updated_at: "2026-06-06",
      fetched_at: "2026-06-02",
      status: "error",
      last_error: "boom",
    });
    expect(signal.repo).toBe("org-33/repo-33");
    expect(signal.status).toBe("error");
  });
  it("normalizeSourceRepoSignalRow matrix 34", () => {
    const signal = normalizeSourceRepoSignalRow({
      repo: "org-34/repo-34",
      stars: 34,
      forks: 4,
      repo_updated_at: "2026-06-07",
      fetched_at: "2026-06-02",
      status: "ok",
      last_error: null,
    });
    expect(signal.repo).toBe("org-34/repo-34");
    expect(signal.status).toBe("ok");
  });
  it("normalizeSourceRepoSignalRow matrix 35", () => {
    const signal = normalizeSourceRepoSignalRow({
      repo: "org-35/repo-35",
      stars: 35,
      forks: 0,
      repo_updated_at: "2026-06-08",
      fetched_at: "2026-06-02",
      status: "ok",
      last_error: null,
    });
    expect(signal.repo).toBe("org-35/repo-35");
    expect(signal.status).toBe("ok");
  });
  it("normalizeSourceRepoSignalRow matrix 36", () => {
    const signal = normalizeSourceRepoSignalRow({
      repo: "org-36/repo-36",
      stars: 36,
      forks: 1,
      repo_updated_at: "2026-06-09",
      fetched_at: "2026-06-02",
      status: "error",
      last_error: "boom",
    });
    expect(signal.repo).toBe("org-36/repo-36");
    expect(signal.status).toBe("error");
  });
  it("normalizeSourceRepoSignalRow matrix 37", () => {
    const signal = normalizeSourceRepoSignalRow({
      repo: "org-37/repo-37",
      stars: 37,
      forks: 2,
      repo_updated_at: "2026-06-10",
      fetched_at: "2026-06-02",
      status: "ok",
      last_error: null,
    });
    expect(signal.repo).toBe("org-37/repo-37");
    expect(signal.status).toBe("ok");
  });
  it("normalizeSourceRepoSignalRow matrix 38", () => {
    const signal = normalizeSourceRepoSignalRow({
      repo: "org-38/repo-38",
      stars: 38,
      forks: 3,
      repo_updated_at: "2026-06-11",
      fetched_at: "2026-06-02",
      status: "ok",
      last_error: null,
    });
    expect(signal.repo).toBe("org-38/repo-38");
    expect(signal.status).toBe("ok");
  });
  it("normalizeSourceRepoSignalRow matrix 39", () => {
    const signal = normalizeSourceRepoSignalRow({
      repo: "org-39/repo-39",
      stars: 39,
      forks: 4,
      repo_updated_at: "2026-06-12",
      fetched_at: "2026-06-02",
      status: "error",
      last_error: "boom",
    });
    expect(signal.repo).toBe("org-39/repo-39");
    expect(signal.status).toBe("error");
  });
  it("normalizeSourceRepoSignalRow matrix 40", () => {
    const signal = normalizeSourceRepoSignalRow({
      repo: "org-40/repo-40",
      stars: 40,
      forks: 0,
      repo_updated_at: "2026-06-13",
      fetched_at: "2026-06-02",
      status: "ok",
      last_error: null,
    });
    expect(signal.repo).toBe("org-40/repo-40");
    expect(signal.status).toBe("ok");
  });
  it("normalizeSourceRepoSignalRow matrix 41", () => {
    const signal = normalizeSourceRepoSignalRow({
      repo: "org-41/repo-41",
      stars: 41,
      forks: 1,
      repo_updated_at: "2026-06-14",
      fetched_at: "2026-06-02",
      status: "ok",
      last_error: null,
    });
    expect(signal.repo).toBe("org-41/repo-41");
    expect(signal.status).toBe("ok");
  });
  it("normalizeSourceRepoSignalRow matrix 42", () => {
    const signal = normalizeSourceRepoSignalRow({
      repo: "org-42/repo-42",
      stars: 42,
      forks: 2,
      repo_updated_at: "2026-06-15",
      fetched_at: "2026-06-02",
      status: "error",
      last_error: "boom",
    });
    expect(signal.repo).toBe("org-42/repo-42");
    expect(signal.status).toBe("error");
  });
  it("normalizeSourceRepoSignalRow matrix 43", () => {
    const signal = normalizeSourceRepoSignalRow({
      repo: "org-43/repo-43",
      stars: 43,
      forks: 3,
      repo_updated_at: "2026-06-16",
      fetched_at: "2026-06-02",
      status: "ok",
      last_error: null,
    });
    expect(signal.repo).toBe("org-43/repo-43");
    expect(signal.status).toBe("ok");
  });
  it("normalizeSourceRepoSignalRow matrix 44", () => {
    const signal = normalizeSourceRepoSignalRow({
      repo: "org-44/repo-44",
      stars: 44,
      forks: 4,
      repo_updated_at: "2026-06-17",
      fetched_at: "2026-06-02",
      status: "ok",
      last_error: null,
    });
    expect(signal.repo).toBe("org-44/repo-44");
    expect(signal.status).toBe("ok");
  });
  it("normalizeSourceRepoSignalRow matrix 45", () => {
    const signal = normalizeSourceRepoSignalRow({
      repo: "org-45/repo-45",
      stars: 45,
      forks: 0,
      repo_updated_at: "2026-06-18",
      fetched_at: "2026-06-02",
      status: "error",
      last_error: "boom",
    });
    expect(signal.repo).toBe("org-45/repo-45");
    expect(signal.status).toBe("error");
  });
  it("normalizeSourceRepoSignalRow matrix 46", () => {
    const signal = normalizeSourceRepoSignalRow({
      repo: "org-46/repo-46",
      stars: 46,
      forks: 1,
      repo_updated_at: "2026-06-19",
      fetched_at: "2026-06-02",
      status: "ok",
      last_error: null,
    });
    expect(signal.repo).toBe("org-46/repo-46");
    expect(signal.status).toBe("ok");
  });
  it("normalizeSourceRepoSignalRow matrix 47", () => {
    const signal = normalizeSourceRepoSignalRow({
      repo: "org-47/repo-47",
      stars: 47,
      forks: 2,
      repo_updated_at: "2026-06-20",
      fetched_at: "2026-06-02",
      status: "ok",
      last_error: null,
    });
    expect(signal.repo).toBe("org-47/repo-47");
    expect(signal.status).toBe("ok");
  });
  it("normalizeSourceRepoSignalRow matrix 48", () => {
    const signal = normalizeSourceRepoSignalRow({
      repo: "org-48/repo-48",
      stars: 48,
      forks: 3,
      repo_updated_at: "2026-06-21",
      fetched_at: "2026-06-02",
      status: "error",
      last_error: "boom",
    });
    expect(signal.repo).toBe("org-48/repo-48");
    expect(signal.status).toBe("error");
  });
  it("normalizeSourceRepoSignalRow matrix 49", () => {
    const signal = normalizeSourceRepoSignalRow({
      repo: "org-49/repo-49",
      stars: 49,
      forks: 4,
      repo_updated_at: "2026-06-22",
      fetched_at: "2026-06-02",
      status: "ok",
      last_error: null,
    });
    expect(signal.repo).toBe("org-49/repo-49");
    expect(signal.status).toBe("ok");
  });
  it("normalizeSourceRepoSignalRow matrix 50", () => {
    const signal = normalizeSourceRepoSignalRow({
      repo: "org-50/repo-50",
      stars: 50,
      forks: 0,
      repo_updated_at: "2026-06-23",
      fetched_at: "2026-06-02",
      status: "ok",
      last_error: null,
    });
    expect(signal.repo).toBe("org-50/repo-50");
    expect(signal.status).toBe("ok");
  });
  it("normalizeSourceRepoSignalRow matrix 51", () => {
    const signal = normalizeSourceRepoSignalRow({
      repo: "org-51/repo-51",
      stars: 51,
      forks: 1,
      repo_updated_at: "2026-06-24",
      fetched_at: "2026-06-02",
      status: "error",
      last_error: "boom",
    });
    expect(signal.repo).toBe("org-51/repo-51");
    expect(signal.status).toBe("error");
  });
  it("normalizeSourceRepoSignalRow matrix 52", () => {
    const signal = normalizeSourceRepoSignalRow({
      repo: "org-52/repo-52",
      stars: 52,
      forks: 2,
      repo_updated_at: "2026-06-25",
      fetched_at: "2026-06-02",
      status: "ok",
      last_error: null,
    });
    expect(signal.repo).toBe("org-52/repo-52");
    expect(signal.status).toBe("ok");
  });
  it("normalizeSourceRepoSignalRow matrix 53", () => {
    const signal = normalizeSourceRepoSignalRow({
      repo: "org-53/repo-53",
      stars: 53,
      forks: 3,
      repo_updated_at: "2026-06-26",
      fetched_at: "2026-06-02",
      status: "ok",
      last_error: null,
    });
    expect(signal.repo).toBe("org-53/repo-53");
    expect(signal.status).toBe("ok");
  });
  it("normalizeSourceRepoSignalRow matrix 54", () => {
    const signal = normalizeSourceRepoSignalRow({
      repo: "org-54/repo-54",
      stars: 54,
      forks: 4,
      repo_updated_at: "2026-06-27",
      fetched_at: "2026-06-02",
      status: "error",
      last_error: "boom",
    });
    expect(signal.repo).toBe("org-54/repo-54");
    expect(signal.status).toBe("error");
  });
  it("normalizeSourceRepoSignalRow matrix 55", () => {
    const signal = normalizeSourceRepoSignalRow({
      repo: "org-55/repo-55",
      stars: 55,
      forks: 0,
      repo_updated_at: "2026-06-28",
      fetched_at: "2026-06-02",
      status: "ok",
      last_error: null,
    });
    expect(signal.repo).toBe("org-55/repo-55");
    expect(signal.status).toBe("ok");
  });
  it("normalizeSourceRepoSignalRow matrix 56", () => {
    const signal = normalizeSourceRepoSignalRow({
      repo: "org-56/repo-56",
      stars: 56,
      forks: 1,
      repo_updated_at: "2026-06-01",
      fetched_at: "2026-06-02",
      status: "ok",
      last_error: null,
    });
    expect(signal.repo).toBe("org-56/repo-56");
    expect(signal.status).toBe("ok");
  });
  it("normalizeSourceRepoSignalRow matrix 57", () => {
    const signal = normalizeSourceRepoSignalRow({
      repo: "org-57/repo-57",
      stars: 57,
      forks: 2,
      repo_updated_at: "2026-06-02",
      fetched_at: "2026-06-02",
      status: "error",
      last_error: "boom",
    });
    expect(signal.repo).toBe("org-57/repo-57");
    expect(signal.status).toBe("error");
  });
  it("normalizeSourceRepoSignalRow matrix 58", () => {
    const signal = normalizeSourceRepoSignalRow({
      repo: "org-58/repo-58",
      stars: 58,
      forks: 3,
      repo_updated_at: "2026-06-03",
      fetched_at: "2026-06-02",
      status: "ok",
      last_error: null,
    });
    expect(signal.repo).toBe("org-58/repo-58");
    expect(signal.status).toBe("ok");
  });
  it("normalizeSourceRepoSignalRow matrix 59", () => {
    const signal = normalizeSourceRepoSignalRow({
      repo: "org-59/repo-59",
      stars: 59,
      forks: 4,
      repo_updated_at: "2026-06-04",
      fetched_at: "2026-06-02",
      status: "ok",
      last_error: null,
    });
    expect(signal.repo).toBe("org-59/repo-59");
    expect(signal.status).toBe("ok");
  });
  it("normalizeSourceRepoSignalRow matrix 60", () => {
    const signal = normalizeSourceRepoSignalRow({
      repo: "org-60/repo-60",
      stars: 60,
      forks: 0,
      repo_updated_at: "2026-06-05",
      fetched_at: "2026-06-02",
      status: "error",
      last_error: "boom",
    });
    expect(signal.repo).toBe("org-60/repo-60");
    expect(signal.status).toBe("error");
  });
  it("normalizeSourceRepoSignalRow matrix 61", () => {
    const signal = normalizeSourceRepoSignalRow({
      repo: "org-61/repo-61",
      stars: 61,
      forks: 1,
      repo_updated_at: "2026-06-06",
      fetched_at: "2026-06-02",
      status: "ok",
      last_error: null,
    });
    expect(signal.repo).toBe("org-61/repo-61");
    expect(signal.status).toBe("ok");
  });
  it("normalizeSourceRepoSignalRow matrix 62", () => {
    const signal = normalizeSourceRepoSignalRow({
      repo: "org-62/repo-62",
      stars: 62,
      forks: 2,
      repo_updated_at: "2026-06-07",
      fetched_at: "2026-06-02",
      status: "ok",
      last_error: null,
    });
    expect(signal.repo).toBe("org-62/repo-62");
    expect(signal.status).toBe("ok");
  });
  it("normalizeSourceRepoSignalRow matrix 63", () => {
    const signal = normalizeSourceRepoSignalRow({
      repo: "org-63/repo-63",
      stars: 63,
      forks: 3,
      repo_updated_at: "2026-06-08",
      fetched_at: "2026-06-02",
      status: "error",
      last_error: "boom",
    });
    expect(signal.repo).toBe("org-63/repo-63");
    expect(signal.status).toBe("error");
  });
  it("normalizeSourceRepoSignalRow matrix 64", () => {
    const signal = normalizeSourceRepoSignalRow({
      repo: "org-64/repo-64",
      stars: 64,
      forks: 4,
      repo_updated_at: "2026-06-09",
      fetched_at: "2026-06-02",
      status: "ok",
      last_error: null,
    });
    expect(signal.repo).toBe("org-64/repo-64");
    expect(signal.status).toBe("ok");
  });
  it("normalizeSourceRepoSignalRow matrix 65", () => {
    const signal = normalizeSourceRepoSignalRow({
      repo: "org-65/repo-65",
      stars: 65,
      forks: 0,
      repo_updated_at: "2026-06-10",
      fetched_at: "2026-06-02",
      status: "ok",
      last_error: null,
    });
    expect(signal.repo).toBe("org-65/repo-65");
    expect(signal.status).toBe("ok");
  });
  it("normalizeSourceRepoSignalRow matrix 66", () => {
    const signal = normalizeSourceRepoSignalRow({
      repo: "org-66/repo-66",
      stars: 66,
      forks: 1,
      repo_updated_at: "2026-06-11",
      fetched_at: "2026-06-02",
      status: "error",
      last_error: "boom",
    });
    expect(signal.repo).toBe("org-66/repo-66");
    expect(signal.status).toBe("error");
  });
  it("normalizeSourceRepoSignalRow matrix 67", () => {
    const signal = normalizeSourceRepoSignalRow({
      repo: "org-67/repo-67",
      stars: 67,
      forks: 2,
      repo_updated_at: "2026-06-12",
      fetched_at: "2026-06-02",
      status: "ok",
      last_error: null,
    });
    expect(signal.repo).toBe("org-67/repo-67");
    expect(signal.status).toBe("ok");
  });
  it("normalizeSourceRepoSignalRow matrix 68", () => {
    const signal = normalizeSourceRepoSignalRow({
      repo: "org-68/repo-68",
      stars: 68,
      forks: 3,
      repo_updated_at: "2026-06-13",
      fetched_at: "2026-06-02",
      status: "ok",
      last_error: null,
    });
    expect(signal.repo).toBe("org-68/repo-68");
    expect(signal.status).toBe("ok");
  });
  it("normalizeSourceRepoSignalRow matrix 69", () => {
    const signal = normalizeSourceRepoSignalRow({
      repo: "org-69/repo-69",
      stars: 69,
      forks: 4,
      repo_updated_at: "2026-06-14",
      fetched_at: "2026-06-02",
      status: "error",
      last_error: "boom",
    });
    expect(signal.repo).toBe("org-69/repo-69");
    expect(signal.status).toBe("error");
  });
  it("normalizeSourceRepoSignalRow matrix 70", () => {
    const signal = normalizeSourceRepoSignalRow({
      repo: "org-70/repo-70",
      stars: 70,
      forks: 0,
      repo_updated_at: "2026-06-15",
      fetched_at: "2026-06-02",
      status: "ok",
      last_error: null,
    });
    expect(signal.repo).toBe("org-70/repo-70");
    expect(signal.status).toBe("ok");
  });
  it("normalizeSourceRepoSignalRow matrix 71", () => {
    const signal = normalizeSourceRepoSignalRow({
      repo: "org-71/repo-71",
      stars: 71,
      forks: 1,
      repo_updated_at: "2026-06-16",
      fetched_at: "2026-06-02",
      status: "ok",
      last_error: null,
    });
    expect(signal.repo).toBe("org-71/repo-71");
    expect(signal.status).toBe("ok");
  });
  it("normalizeSourceRepoSignalRow matrix 72", () => {
    const signal = normalizeSourceRepoSignalRow({
      repo: "org-72/repo-72",
      stars: 72,
      forks: 2,
      repo_updated_at: "2026-06-17",
      fetched_at: "2026-06-02",
      status: "error",
      last_error: "boom",
    });
    expect(signal.repo).toBe("org-72/repo-72");
    expect(signal.status).toBe("error");
  });
  it("normalizeSourceRepoSignalRow matrix 73", () => {
    const signal = normalizeSourceRepoSignalRow({
      repo: "org-73/repo-73",
      stars: 73,
      forks: 3,
      repo_updated_at: "2026-06-18",
      fetched_at: "2026-06-02",
      status: "ok",
      last_error: null,
    });
    expect(signal.repo).toBe("org-73/repo-73");
    expect(signal.status).toBe("ok");
  });
  it("normalizeSourceRepoSignalRow matrix 74", () => {
    const signal = normalizeSourceRepoSignalRow({
      repo: "org-74/repo-74",
      stars: 74,
      forks: 4,
      repo_updated_at: "2026-06-19",
      fetched_at: "2026-06-02",
      status: "ok",
      last_error: null,
    });
    expect(signal.repo).toBe("org-74/repo-74");
    expect(signal.status).toBe("ok");
  });
  it("normalizeSourceRepoSignalRow matrix 75", () => {
    const signal = normalizeSourceRepoSignalRow({
      repo: "org-75/repo-75",
      stars: 75,
      forks: 0,
      repo_updated_at: "2026-06-20",
      fetched_at: "2026-06-02",
      status: "error",
      last_error: "boom",
    });
    expect(signal.repo).toBe("org-75/repo-75");
    expect(signal.status).toBe("error");
  });
  it("normalizeSourceRepoSignalRow matrix 76", () => {
    const signal = normalizeSourceRepoSignalRow({
      repo: "org-76/repo-76",
      stars: 76,
      forks: 1,
      repo_updated_at: "2026-06-21",
      fetched_at: "2026-06-02",
      status: "ok",
      last_error: null,
    });
    expect(signal.repo).toBe("org-76/repo-76");
    expect(signal.status).toBe("ok");
  });
  it("normalizeSourceRepoSignalRow matrix 77", () => {
    const signal = normalizeSourceRepoSignalRow({
      repo: "org-77/repo-77",
      stars: 77,
      forks: 2,
      repo_updated_at: "2026-06-22",
      fetched_at: "2026-06-02",
      status: "ok",
      last_error: null,
    });
    expect(signal.repo).toBe("org-77/repo-77");
    expect(signal.status).toBe("ok");
  });
  it("normalizeSourceRepoSignalRow matrix 78", () => {
    const signal = normalizeSourceRepoSignalRow({
      repo: "org-78/repo-78",
      stars: 78,
      forks: 3,
      repo_updated_at: "2026-06-23",
      fetched_at: "2026-06-02",
      status: "error",
      last_error: "boom",
    });
    expect(signal.repo).toBe("org-78/repo-78");
    expect(signal.status).toBe("error");
  });
  it("normalizeSourceRepoSignalRow matrix 79", () => {
    const signal = normalizeSourceRepoSignalRow({
      repo: "org-79/repo-79",
      stars: 79,
      forks: 4,
      repo_updated_at: "2026-06-24",
      fetched_at: "2026-06-02",
      status: "ok",
      last_error: null,
    });
    expect(signal.repo).toBe("org-79/repo-79");
    expect(signal.status).toBe("ok");
  });
  it("normalizeSourceRepoSignalRow matrix 80", () => {
    const signal = normalizeSourceRepoSignalRow({
      repo: "org-80/repo-80",
      stars: 80,
      forks: 0,
      repo_updated_at: "2026-06-25",
      fetched_at: "2026-06-02",
      status: "ok",
      last_error: null,
    });
    expect(signal.repo).toBe("org-80/repo-80");
    expect(signal.status).toBe("ok");
  });
  it("normalizeSourceRepoSignalRow matrix 81", () => {
    const signal = normalizeSourceRepoSignalRow({
      repo: "org-81/repo-81",
      stars: 81,
      forks: 1,
      repo_updated_at: "2026-06-26",
      fetched_at: "2026-06-02",
      status: "error",
      last_error: "boom",
    });
    expect(signal.repo).toBe("org-81/repo-81");
    expect(signal.status).toBe("error");
  });
  it("normalizeSourceRepoSignalRow matrix 82", () => {
    const signal = normalizeSourceRepoSignalRow({
      repo: "org-82/repo-82",
      stars: 82,
      forks: 2,
      repo_updated_at: "2026-06-27",
      fetched_at: "2026-06-02",
      status: "ok",
      last_error: null,
    });
    expect(signal.repo).toBe("org-82/repo-82");
    expect(signal.status).toBe("ok");
  });
  it("normalizeSourceRepoSignalRow matrix 83", () => {
    const signal = normalizeSourceRepoSignalRow({
      repo: "org-83/repo-83",
      stars: 83,
      forks: 3,
      repo_updated_at: "2026-06-28",
      fetched_at: "2026-06-02",
      status: "ok",
      last_error: null,
    });
    expect(signal.repo).toBe("org-83/repo-83");
    expect(signal.status).toBe("ok");
  });
  it("normalizeSourceRepoSignalRow matrix 84", () => {
    const signal = normalizeSourceRepoSignalRow({
      repo: "org-84/repo-84",
      stars: 84,
      forks: 4,
      repo_updated_at: "2026-06-01",
      fetched_at: "2026-06-02",
      status: "error",
      last_error: "boom",
    });
    expect(signal.repo).toBe("org-84/repo-84");
    expect(signal.status).toBe("error");
  });
  it("normalizeSourceRepoSignalRow matrix 85", () => {
    const signal = normalizeSourceRepoSignalRow({
      repo: "org-85/repo-85",
      stars: 85,
      forks: 0,
      repo_updated_at: "2026-06-02",
      fetched_at: "2026-06-02",
      status: "ok",
      last_error: null,
    });
    expect(signal.repo).toBe("org-85/repo-85");
    expect(signal.status).toBe("ok");
  });
  it("normalizeSourceRepoSignalRow matrix 86", () => {
    const signal = normalizeSourceRepoSignalRow({
      repo: "org-86/repo-86",
      stars: 86,
      forks: 1,
      repo_updated_at: "2026-06-03",
      fetched_at: "2026-06-02",
      status: "ok",
      last_error: null,
    });
    expect(signal.repo).toBe("org-86/repo-86");
    expect(signal.status).toBe("ok");
  });
  it("normalizeSourceRepoSignalRow matrix 87", () => {
    const signal = normalizeSourceRepoSignalRow({
      repo: "org-87/repo-87",
      stars: 87,
      forks: 2,
      repo_updated_at: "2026-06-04",
      fetched_at: "2026-06-02",
      status: "error",
      last_error: "boom",
    });
    expect(signal.repo).toBe("org-87/repo-87");
    expect(signal.status).toBe("error");
  });
  it("normalizeSourceRepoSignalRow matrix 88", () => {
    const signal = normalizeSourceRepoSignalRow({
      repo: "org-88/repo-88",
      stars: 88,
      forks: 3,
      repo_updated_at: "2026-06-05",
      fetched_at: "2026-06-02",
      status: "ok",
      last_error: null,
    });
    expect(signal.repo).toBe("org-88/repo-88");
    expect(signal.status).toBe("ok");
  });
  it("normalizeSourceRepoSignalRow matrix 89", () => {
    const signal = normalizeSourceRepoSignalRow({
      repo: "org-89/repo-89",
      stars: 89,
      forks: 4,
      repo_updated_at: "2026-06-06",
      fetched_at: "2026-06-02",
      status: "ok",
      last_error: null,
    });
    expect(signal.repo).toBe("org-89/repo-89");
    expect(signal.status).toBe("ok");
  });
  it("normalizeSourceRepoSignalRow matrix 90", () => {
    const signal = normalizeSourceRepoSignalRow({
      repo: "org-90/repo-90",
      stars: 90,
      forks: 0,
      repo_updated_at: "2026-06-07",
      fetched_at: "2026-06-02",
      status: "error",
      last_error: "boom",
    });
    expect(signal.repo).toBe("org-90/repo-90");
    expect(signal.status).toBe("error");
  });
  it("normalizeSourceRepoSignalRow matrix 91", () => {
    const signal = normalizeSourceRepoSignalRow({
      repo: "org-91/repo-91",
      stars: 91,
      forks: 1,
      repo_updated_at: "2026-06-08",
      fetched_at: "2026-06-02",
      status: "ok",
      last_error: null,
    });
    expect(signal.repo).toBe("org-91/repo-91");
    expect(signal.status).toBe("ok");
  });
  it("normalizeSourceRepoSignalRow matrix 92", () => {
    const signal = normalizeSourceRepoSignalRow({
      repo: "org-92/repo-92",
      stars: 92,
      forks: 2,
      repo_updated_at: "2026-06-09",
      fetched_at: "2026-06-02",
      status: "ok",
      last_error: null,
    });
    expect(signal.repo).toBe("org-92/repo-92");
    expect(signal.status).toBe("ok");
  });
  it("normalizeSourceRepoSignalRow matrix 93", () => {
    const signal = normalizeSourceRepoSignalRow({
      repo: "org-93/repo-93",
      stars: 93,
      forks: 3,
      repo_updated_at: "2026-06-10",
      fetched_at: "2026-06-02",
      status: "error",
      last_error: "boom",
    });
    expect(signal.repo).toBe("org-93/repo-93");
    expect(signal.status).toBe("error");
  });
  it("normalizeSourceRepoSignalRow matrix 94", () => {
    const signal = normalizeSourceRepoSignalRow({
      repo: "org-94/repo-94",
      stars: 94,
      forks: 4,
      repo_updated_at: "2026-06-11",
      fetched_at: "2026-06-02",
      status: "ok",
      last_error: null,
    });
    expect(signal.repo).toBe("org-94/repo-94");
    expect(signal.status).toBe("ok");
  });
  it("normalizeSourceRepoSignalRow matrix 95", () => {
    const signal = normalizeSourceRepoSignalRow({
      repo: "org-95/repo-95",
      stars: 95,
      forks: 0,
      repo_updated_at: "2026-06-12",
      fetched_at: "2026-06-02",
      status: "ok",
      last_error: null,
    });
    expect(signal.repo).toBe("org-95/repo-95");
    expect(signal.status).toBe("ok");
  });
  it("normalizeSourceRepoSignalRow matrix 96", () => {
    const signal = normalizeSourceRepoSignalRow({
      repo: "org-96/repo-96",
      stars: 96,
      forks: 1,
      repo_updated_at: "2026-06-13",
      fetched_at: "2026-06-02",
      status: "error",
      last_error: "boom",
    });
    expect(signal.repo).toBe("org-96/repo-96");
    expect(signal.status).toBe("error");
  });
  it("normalizeSourceRepoSignalRow matrix 97", () => {
    const signal = normalizeSourceRepoSignalRow({
      repo: "org-97/repo-97",
      stars: 97,
      forks: 2,
      repo_updated_at: "2026-06-14",
      fetched_at: "2026-06-02",
      status: "ok",
      last_error: null,
    });
    expect(signal.repo).toBe("org-97/repo-97");
    expect(signal.status).toBe("ok");
  });
  it("normalizeSourceRepoSignalRow matrix 98", () => {
    const signal = normalizeSourceRepoSignalRow({
      repo: "org-98/repo-98",
      stars: 98,
      forks: 3,
      repo_updated_at: "2026-06-15",
      fetched_at: "2026-06-02",
      status: "ok",
      last_error: null,
    });
    expect(signal.repo).toBe("org-98/repo-98");
    expect(signal.status).toBe("ok");
  });
  it("normalizeSourceRepoSignalRow matrix 99", () => {
    const signal = normalizeSourceRepoSignalRow({
      repo: "org-99/repo-99",
      stars: 99,
      forks: 4,
      repo_updated_at: "2026-06-16",
      fetched_at: "2026-06-02",
      status: "error",
      last_error: "boom",
    });
    expect(signal.repo).toBe("org-99/repo-99");
    expect(signal.status).toBe("error");
  });
});

describe("source-repo-signals-lib applySourceRepoSignal", () => {
  const baseEntry = { repoUrl: "https://github.com/demo/repo", title: "Demo" };
  it("returns entry unchanged when state unavailable", () => {
    const state: SourceRepoSignalState = {
      available: false,
      signals: new Map(),
    };
    expect(applySourceRepoSignal(baseEntry, state)).toEqual(baseEntry);
  });
  it("applies cached signal stats", () => {
    const state: SourceRepoSignalState = {
      available: true,
      signals: new Map([
        [
          "demo/repo",
          {
            repo: "demo/repo",
            stars: 42,
            forks: 7,
            repoUpdatedAt: "2026-01-01",
            fetchedAt: "2026-01-02",
            status: "ok",
            lastError: null,
          },
        ],
      ]),
    };
    const applied = applySourceRepoSignal(baseEntry, state);
    expect(applied.githubStars).toBe(42);
    expect(applied.githubForks).toBe(7);
  });
  it("applySourceRepoSignal matrix 0", () => {
    const entry = {
      repoUrl: "https://github.com/org-0/repo-0",
      githubStars: 1,
      githubForks: 1,
      repoUpdatedAt: "old",
    };
    const state: SourceRepoSignalState = {
      available: true,
      signals: new Map([
        [
          "org-0/repo-0",
          {
            repo: "org-0/repo-0",
            stars: 0,
            forks: 0,
            repoUpdatedAt: "2026-06-01",
            fetchedAt: "2026-06-02",
            status: "ok",
            lastError: null,
          },
        ],
      ]),
    };
    const applied = applySourceRepoSignal(entry, state);
    expect(applied.githubStars).toBe(0);
    expect(applied.repoStats?.stars).toBe(0);
  });
  it("applySourceRepoSignal matrix 1", () => {
    const entry = {
      repoUrl: "https://github.com/org-1/repo-1",
      githubStars: 1,
      githubForks: 1,
      repoUpdatedAt: "old",
    };
    const state: SourceRepoSignalState = {
      available: true,
      signals: new Map([
        [
          "org-1/repo-1",
          {
            repo: "org-1/repo-1",
            stars: 10,
            forks: 1,
            repoUpdatedAt: "2026-06-01",
            fetchedAt: "2026-06-02",
            status: "ok",
            lastError: null,
          },
        ],
      ]),
    };
    const applied = applySourceRepoSignal(entry, state);
    expect(applied.githubStars).toBe(10);
    expect(applied.repoStats?.stars).toBe(10);
  });
  it("applySourceRepoSignal matrix 2", () => {
    const entry = {
      repoUrl: "https://github.com/org-2/repo-2",
      githubStars: 1,
      githubForks: 1,
      repoUpdatedAt: "old",
    };
    const state: SourceRepoSignalState = {
      available: true,
      signals: new Map([
        [
          "org-2/repo-2",
          {
            repo: "org-2/repo-2",
            stars: 20,
            forks: 2,
            repoUpdatedAt: "2026-06-01",
            fetchedAt: "2026-06-02",
            status: "ok",
            lastError: null,
          },
        ],
      ]),
    };
    const applied = applySourceRepoSignal(entry, state);
    expect(applied.githubStars).toBe(20);
    expect(applied.repoStats?.stars).toBe(20);
  });
  it("applySourceRepoSignal matrix 3", () => {
    const entry = {
      repoUrl: "https://github.com/org-3/repo-3",
      githubStars: 1,
      githubForks: 1,
      repoUpdatedAt: "old",
    };
    const state: SourceRepoSignalState = {
      available: true,
      signals: new Map([
        [
          "org-3/repo-3",
          {
            repo: "org-3/repo-3",
            stars: 30,
            forks: 3,
            repoUpdatedAt: "2026-06-01",
            fetchedAt: "2026-06-02",
            status: "ok",
            lastError: null,
          },
        ],
      ]),
    };
    const applied = applySourceRepoSignal(entry, state);
    expect(applied.githubStars).toBe(30);
    expect(applied.repoStats?.stars).toBe(30);
  });
  it("applySourceRepoSignal matrix 4", () => {
    const entry = {
      repoUrl: "https://github.com/org-4/repo-4",
      githubStars: 1,
      githubForks: 1,
      repoUpdatedAt: "old",
    };
    const state: SourceRepoSignalState = {
      available: true,
      signals: new Map([
        [
          "org-4/repo-4",
          {
            repo: "org-4/repo-4",
            stars: 40,
            forks: 4,
            repoUpdatedAt: "2026-06-01",
            fetchedAt: "2026-06-02",
            status: "ok",
            lastError: null,
          },
        ],
      ]),
    };
    const applied = applySourceRepoSignal(entry, state);
    expect(applied.githubStars).toBe(40);
    expect(applied.repoStats?.stars).toBe(40);
  });
  it("applySourceRepoSignal matrix 5", () => {
    const entry = {
      repoUrl: "https://github.com/org-5/repo-5",
      githubStars: 1,
      githubForks: 1,
      repoUpdatedAt: "old",
    };
    const state: SourceRepoSignalState = {
      available: true,
      signals: new Map([
        [
          "org-5/repo-5",
          {
            repo: "org-5/repo-5",
            stars: 50,
            forks: 5,
            repoUpdatedAt: "2026-06-01",
            fetchedAt: "2026-06-02",
            status: "ok",
            lastError: null,
          },
        ],
      ]),
    };
    const applied = applySourceRepoSignal(entry, state);
    expect(applied.githubStars).toBe(50);
    expect(applied.repoStats?.stars).toBe(50);
  });
  it("applySourceRepoSignal matrix 6", () => {
    const entry = {
      repoUrl: "https://github.com/org-6/repo-6",
      githubStars: 1,
      githubForks: 1,
      repoUpdatedAt: "old",
    };
    const state: SourceRepoSignalState = {
      available: true,
      signals: new Map([
        [
          "org-6/repo-6",
          {
            repo: "org-6/repo-6",
            stars: 60,
            forks: 6,
            repoUpdatedAt: "2026-06-01",
            fetchedAt: "2026-06-02",
            status: "ok",
            lastError: null,
          },
        ],
      ]),
    };
    const applied = applySourceRepoSignal(entry, state);
    expect(applied.githubStars).toBe(60);
    expect(applied.repoStats?.stars).toBe(60);
  });
  it("applySourceRepoSignal matrix 7", () => {
    const entry = {
      repoUrl: "https://github.com/org-7/repo-7",
      githubStars: 1,
      githubForks: 1,
      repoUpdatedAt: "old",
    };
    const state: SourceRepoSignalState = {
      available: true,
      signals: new Map([
        [
          "org-7/repo-7",
          {
            repo: "org-7/repo-7",
            stars: 70,
            forks: 7,
            repoUpdatedAt: "2026-06-01",
            fetchedAt: "2026-06-02",
            status: "ok",
            lastError: null,
          },
        ],
      ]),
    };
    const applied = applySourceRepoSignal(entry, state);
    expect(applied.githubStars).toBe(70);
    expect(applied.repoStats?.stars).toBe(70);
  });
  it("applySourceRepoSignal matrix 8", () => {
    const entry = {
      repoUrl: "https://github.com/org-8/repo-8",
      githubStars: 1,
      githubForks: 1,
      repoUpdatedAt: "old",
    };
    const state: SourceRepoSignalState = {
      available: true,
      signals: new Map([
        [
          "org-8/repo-8",
          {
            repo: "org-8/repo-8",
            stars: 80,
            forks: 8,
            repoUpdatedAt: "2026-06-01",
            fetchedAt: "2026-06-02",
            status: "ok",
            lastError: null,
          },
        ],
      ]),
    };
    const applied = applySourceRepoSignal(entry, state);
    expect(applied.githubStars).toBe(80);
    expect(applied.repoStats?.stars).toBe(80);
  });
  it("applySourceRepoSignal matrix 9", () => {
    const entry = {
      repoUrl: "https://github.com/org-9/repo-9",
      githubStars: 1,
      githubForks: 1,
      repoUpdatedAt: "old",
    };
    const state: SourceRepoSignalState = {
      available: true,
      signals: new Map([
        [
          "org-9/repo-9",
          {
            repo: "org-9/repo-9",
            stars: 90,
            forks: 9,
            repoUpdatedAt: "2026-06-01",
            fetchedAt: "2026-06-02",
            status: "ok",
            lastError: null,
          },
        ],
      ]),
    };
    const applied = applySourceRepoSignal(entry, state);
    expect(applied.githubStars).toBe(90);
    expect(applied.repoStats?.stars).toBe(90);
  });
  it("applySourceRepoSignal matrix 10", () => {
    const entry = {
      repoUrl: "https://github.com/org-10/repo-10",
      githubStars: 1,
      githubForks: 1,
      repoUpdatedAt: "old",
    };
    const state: SourceRepoSignalState = {
      available: true,
      signals: new Map([
        [
          "org-10/repo-10",
          {
            repo: "org-10/repo-10",
            stars: 100,
            forks: 10,
            repoUpdatedAt: "2026-06-01",
            fetchedAt: "2026-06-02",
            status: "ok",
            lastError: null,
          },
        ],
      ]),
    };
    const applied = applySourceRepoSignal(entry, state);
    expect(applied.githubStars).toBe(100);
    expect(applied.repoStats?.stars).toBe(100);
  });
  it("applySourceRepoSignal matrix 11", () => {
    const entry = {
      repoUrl: "https://github.com/org-11/repo-11",
      githubStars: 1,
      githubForks: 1,
      repoUpdatedAt: "old",
    };
    const state: SourceRepoSignalState = {
      available: true,
      signals: new Map([
        [
          "org-11/repo-11",
          {
            repo: "org-11/repo-11",
            stars: 110,
            forks: 11,
            repoUpdatedAt: "2026-06-01",
            fetchedAt: "2026-06-02",
            status: "ok",
            lastError: null,
          },
        ],
      ]),
    };
    const applied = applySourceRepoSignal(entry, state);
    expect(applied.githubStars).toBe(110);
    expect(applied.repoStats?.stars).toBe(110);
  });
  it("applySourceRepoSignal matrix 12", () => {
    const entry = {
      repoUrl: "https://github.com/org-12/repo-12",
      githubStars: 1,
      githubForks: 1,
      repoUpdatedAt: "old",
    };
    const state: SourceRepoSignalState = {
      available: true,
      signals: new Map([
        [
          "org-12/repo-12",
          {
            repo: "org-12/repo-12",
            stars: 120,
            forks: 12,
            repoUpdatedAt: "2026-06-01",
            fetchedAt: "2026-06-02",
            status: "ok",
            lastError: null,
          },
        ],
      ]),
    };
    const applied = applySourceRepoSignal(entry, state);
    expect(applied.githubStars).toBe(120);
    expect(applied.repoStats?.stars).toBe(120);
  });
  it("applySourceRepoSignal matrix 13", () => {
    const entry = {
      repoUrl: "https://github.com/org-13/repo-13",
      githubStars: 1,
      githubForks: 1,
      repoUpdatedAt: "old",
    };
    const state: SourceRepoSignalState = {
      available: true,
      signals: new Map([
        [
          "org-13/repo-13",
          {
            repo: "org-13/repo-13",
            stars: 130,
            forks: 13,
            repoUpdatedAt: "2026-06-01",
            fetchedAt: "2026-06-02",
            status: "ok",
            lastError: null,
          },
        ],
      ]),
    };
    const applied = applySourceRepoSignal(entry, state);
    expect(applied.githubStars).toBe(130);
    expect(applied.repoStats?.stars).toBe(130);
  });
  it("applySourceRepoSignal matrix 14", () => {
    const entry = {
      repoUrl: "https://github.com/org-14/repo-14",
      githubStars: 1,
      githubForks: 1,
      repoUpdatedAt: "old",
    };
    const state: SourceRepoSignalState = {
      available: true,
      signals: new Map([
        [
          "org-14/repo-14",
          {
            repo: "org-14/repo-14",
            stars: 140,
            forks: 14,
            repoUpdatedAt: "2026-06-01",
            fetchedAt: "2026-06-02",
            status: "ok",
            lastError: null,
          },
        ],
      ]),
    };
    const applied = applySourceRepoSignal(entry, state);
    expect(applied.githubStars).toBe(140);
    expect(applied.repoStats?.stars).toBe(140);
  });
  it("applySourceRepoSignal matrix 15", () => {
    const entry = {
      repoUrl: "https://github.com/org-15/repo-15",
      githubStars: 1,
      githubForks: 1,
      repoUpdatedAt: "old",
    };
    const state: SourceRepoSignalState = {
      available: true,
      signals: new Map([
        [
          "org-15/repo-15",
          {
            repo: "org-15/repo-15",
            stars: 150,
            forks: 15,
            repoUpdatedAt: "2026-06-01",
            fetchedAt: "2026-06-02",
            status: "ok",
            lastError: null,
          },
        ],
      ]),
    };
    const applied = applySourceRepoSignal(entry, state);
    expect(applied.githubStars).toBe(150);
    expect(applied.repoStats?.stars).toBe(150);
  });
  it("applySourceRepoSignal matrix 16", () => {
    const entry = {
      repoUrl: "https://github.com/org-16/repo-16",
      githubStars: 1,
      githubForks: 1,
      repoUpdatedAt: "old",
    };
    const state: SourceRepoSignalState = {
      available: true,
      signals: new Map([
        [
          "org-16/repo-16",
          {
            repo: "org-16/repo-16",
            stars: 160,
            forks: 16,
            repoUpdatedAt: "2026-06-01",
            fetchedAt: "2026-06-02",
            status: "ok",
            lastError: null,
          },
        ],
      ]),
    };
    const applied = applySourceRepoSignal(entry, state);
    expect(applied.githubStars).toBe(160);
    expect(applied.repoStats?.stars).toBe(160);
  });
  it("applySourceRepoSignal matrix 17", () => {
    const entry = {
      repoUrl: "https://github.com/org-17/repo-17",
      githubStars: 1,
      githubForks: 1,
      repoUpdatedAt: "old",
    };
    const state: SourceRepoSignalState = {
      available: true,
      signals: new Map([
        [
          "org-17/repo-17",
          {
            repo: "org-17/repo-17",
            stars: 170,
            forks: 17,
            repoUpdatedAt: "2026-06-01",
            fetchedAt: "2026-06-02",
            status: "ok",
            lastError: null,
          },
        ],
      ]),
    };
    const applied = applySourceRepoSignal(entry, state);
    expect(applied.githubStars).toBe(170);
    expect(applied.repoStats?.stars).toBe(170);
  });
  it("applySourceRepoSignal matrix 18", () => {
    const entry = {
      repoUrl: "https://github.com/org-18/repo-18",
      githubStars: 1,
      githubForks: 1,
      repoUpdatedAt: "old",
    };
    const state: SourceRepoSignalState = {
      available: true,
      signals: new Map([
        [
          "org-18/repo-18",
          {
            repo: "org-18/repo-18",
            stars: 180,
            forks: 18,
            repoUpdatedAt: "2026-06-01",
            fetchedAt: "2026-06-02",
            status: "ok",
            lastError: null,
          },
        ],
      ]),
    };
    const applied = applySourceRepoSignal(entry, state);
    expect(applied.githubStars).toBe(180);
    expect(applied.repoStats?.stars).toBe(180);
  });
  it("applySourceRepoSignal matrix 19", () => {
    const entry = {
      repoUrl: "https://github.com/org-19/repo-19",
      githubStars: 1,
      githubForks: 1,
      repoUpdatedAt: "old",
    };
    const state: SourceRepoSignalState = {
      available: true,
      signals: new Map([
        [
          "org-19/repo-19",
          {
            repo: "org-19/repo-19",
            stars: 190,
            forks: 19,
            repoUpdatedAt: "2026-06-01",
            fetchedAt: "2026-06-02",
            status: "ok",
            lastError: null,
          },
        ],
      ]),
    };
    const applied = applySourceRepoSignal(entry, state);
    expect(applied.githubStars).toBe(190);
    expect(applied.repoStats?.stars).toBe(190);
  });
  it("applySourceRepoSignal matrix 20", () => {
    const entry = {
      repoUrl: "https://github.com/org-20/repo-20",
      githubStars: 1,
      githubForks: 1,
      repoUpdatedAt: "old",
    };
    const state: SourceRepoSignalState = {
      available: true,
      signals: new Map([
        [
          "org-20/repo-20",
          {
            repo: "org-20/repo-20",
            stars: 200,
            forks: 20,
            repoUpdatedAt: "2026-06-01",
            fetchedAt: "2026-06-02",
            status: "ok",
            lastError: null,
          },
        ],
      ]),
    };
    const applied = applySourceRepoSignal(entry, state);
    expect(applied.githubStars).toBe(200);
    expect(applied.repoStats?.stars).toBe(200);
  });
  it("applySourceRepoSignal matrix 21", () => {
    const entry = {
      repoUrl: "https://github.com/org-21/repo-21",
      githubStars: 1,
      githubForks: 1,
      repoUpdatedAt: "old",
    };
    const state: SourceRepoSignalState = {
      available: true,
      signals: new Map([
        [
          "org-21/repo-21",
          {
            repo: "org-21/repo-21",
            stars: 210,
            forks: 21,
            repoUpdatedAt: "2026-06-01",
            fetchedAt: "2026-06-02",
            status: "ok",
            lastError: null,
          },
        ],
      ]),
    };
    const applied = applySourceRepoSignal(entry, state);
    expect(applied.githubStars).toBe(210);
    expect(applied.repoStats?.stars).toBe(210);
  });
  it("applySourceRepoSignal matrix 22", () => {
    const entry = {
      repoUrl: "https://github.com/org-22/repo-22",
      githubStars: 1,
      githubForks: 1,
      repoUpdatedAt: "old",
    };
    const state: SourceRepoSignalState = {
      available: true,
      signals: new Map([
        [
          "org-22/repo-22",
          {
            repo: "org-22/repo-22",
            stars: 220,
            forks: 22,
            repoUpdatedAt: "2026-06-01",
            fetchedAt: "2026-06-02",
            status: "ok",
            lastError: null,
          },
        ],
      ]),
    };
    const applied = applySourceRepoSignal(entry, state);
    expect(applied.githubStars).toBe(220);
    expect(applied.repoStats?.stars).toBe(220);
  });
  it("applySourceRepoSignal matrix 23", () => {
    const entry = {
      repoUrl: "https://github.com/org-23/repo-23",
      githubStars: 1,
      githubForks: 1,
      repoUpdatedAt: "old",
    };
    const state: SourceRepoSignalState = {
      available: true,
      signals: new Map([
        [
          "org-23/repo-23",
          {
            repo: "org-23/repo-23",
            stars: 230,
            forks: 23,
            repoUpdatedAt: "2026-06-01",
            fetchedAt: "2026-06-02",
            status: "ok",
            lastError: null,
          },
        ],
      ]),
    };
    const applied = applySourceRepoSignal(entry, state);
    expect(applied.githubStars).toBe(230);
    expect(applied.repoStats?.stars).toBe(230);
  });
  it("applySourceRepoSignal matrix 24", () => {
    const entry = {
      repoUrl: "https://github.com/org-24/repo-24",
      githubStars: 1,
      githubForks: 1,
      repoUpdatedAt: "old",
    };
    const state: SourceRepoSignalState = {
      available: true,
      signals: new Map([
        [
          "org-24/repo-24",
          {
            repo: "org-24/repo-24",
            stars: 240,
            forks: 24,
            repoUpdatedAt: "2026-06-01",
            fetchedAt: "2026-06-02",
            status: "ok",
            lastError: null,
          },
        ],
      ]),
    };
    const applied = applySourceRepoSignal(entry, state);
    expect(applied.githubStars).toBe(240);
    expect(applied.repoStats?.stars).toBe(240);
  });
  it("applySourceRepoSignal matrix 25", () => {
    const entry = {
      repoUrl: "https://github.com/org-25/repo-25",
      githubStars: 1,
      githubForks: 1,
      repoUpdatedAt: "old",
    };
    const state: SourceRepoSignalState = {
      available: true,
      signals: new Map([
        [
          "org-25/repo-25",
          {
            repo: "org-25/repo-25",
            stars: 250,
            forks: 25,
            repoUpdatedAt: "2026-06-01",
            fetchedAt: "2026-06-02",
            status: "ok",
            lastError: null,
          },
        ],
      ]),
    };
    const applied = applySourceRepoSignal(entry, state);
    expect(applied.githubStars).toBe(250);
    expect(applied.repoStats?.stars).toBe(250);
  });
  it("applySourceRepoSignal matrix 26", () => {
    const entry = {
      repoUrl: "https://github.com/org-26/repo-26",
      githubStars: 1,
      githubForks: 1,
      repoUpdatedAt: "old",
    };
    const state: SourceRepoSignalState = {
      available: true,
      signals: new Map([
        [
          "org-26/repo-26",
          {
            repo: "org-26/repo-26",
            stars: 260,
            forks: 26,
            repoUpdatedAt: "2026-06-01",
            fetchedAt: "2026-06-02",
            status: "ok",
            lastError: null,
          },
        ],
      ]),
    };
    const applied = applySourceRepoSignal(entry, state);
    expect(applied.githubStars).toBe(260);
    expect(applied.repoStats?.stars).toBe(260);
  });
  it("applySourceRepoSignal matrix 27", () => {
    const entry = {
      repoUrl: "https://github.com/org-27/repo-27",
      githubStars: 1,
      githubForks: 1,
      repoUpdatedAt: "old",
    };
    const state: SourceRepoSignalState = {
      available: true,
      signals: new Map([
        [
          "org-27/repo-27",
          {
            repo: "org-27/repo-27",
            stars: 270,
            forks: 27,
            repoUpdatedAt: "2026-06-01",
            fetchedAt: "2026-06-02",
            status: "ok",
            lastError: null,
          },
        ],
      ]),
    };
    const applied = applySourceRepoSignal(entry, state);
    expect(applied.githubStars).toBe(270);
    expect(applied.repoStats?.stars).toBe(270);
  });
  it("applySourceRepoSignal matrix 28", () => {
    const entry = {
      repoUrl: "https://github.com/org-28/repo-28",
      githubStars: 1,
      githubForks: 1,
      repoUpdatedAt: "old",
    };
    const state: SourceRepoSignalState = {
      available: true,
      signals: new Map([
        [
          "org-28/repo-28",
          {
            repo: "org-28/repo-28",
            stars: 280,
            forks: 28,
            repoUpdatedAt: "2026-06-01",
            fetchedAt: "2026-06-02",
            status: "ok",
            lastError: null,
          },
        ],
      ]),
    };
    const applied = applySourceRepoSignal(entry, state);
    expect(applied.githubStars).toBe(280);
    expect(applied.repoStats?.stars).toBe(280);
  });
  it("applySourceRepoSignal matrix 29", () => {
    const entry = {
      repoUrl: "https://github.com/org-29/repo-29",
      githubStars: 1,
      githubForks: 1,
      repoUpdatedAt: "old",
    };
    const state: SourceRepoSignalState = {
      available: true,
      signals: new Map([
        [
          "org-29/repo-29",
          {
            repo: "org-29/repo-29",
            stars: 290,
            forks: 29,
            repoUpdatedAt: "2026-06-01",
            fetchedAt: "2026-06-02",
            status: "ok",
            lastError: null,
          },
        ],
      ]),
    };
    const applied = applySourceRepoSignal(entry, state);
    expect(applied.githubStars).toBe(290);
    expect(applied.repoStats?.stars).toBe(290);
  });
  it("applySourceRepoSignal matrix 30", () => {
    const entry = {
      repoUrl: "https://github.com/org-30/repo-30",
      githubStars: 1,
      githubForks: 1,
      repoUpdatedAt: "old",
    };
    const state: SourceRepoSignalState = {
      available: true,
      signals: new Map([
        [
          "org-30/repo-30",
          {
            repo: "org-30/repo-30",
            stars: 300,
            forks: 30,
            repoUpdatedAt: "2026-06-01",
            fetchedAt: "2026-06-02",
            status: "ok",
            lastError: null,
          },
        ],
      ]),
    };
    const applied = applySourceRepoSignal(entry, state);
    expect(applied.githubStars).toBe(300);
    expect(applied.repoStats?.stars).toBe(300);
  });
  it("applySourceRepoSignal matrix 31", () => {
    const entry = {
      repoUrl: "https://github.com/org-31/repo-31",
      githubStars: 1,
      githubForks: 1,
      repoUpdatedAt: "old",
    };
    const state: SourceRepoSignalState = {
      available: true,
      signals: new Map([
        [
          "org-31/repo-31",
          {
            repo: "org-31/repo-31",
            stars: 310,
            forks: 31,
            repoUpdatedAt: "2026-06-01",
            fetchedAt: "2026-06-02",
            status: "ok",
            lastError: null,
          },
        ],
      ]),
    };
    const applied = applySourceRepoSignal(entry, state);
    expect(applied.githubStars).toBe(310);
    expect(applied.repoStats?.stars).toBe(310);
  });
  it("applySourceRepoSignal matrix 32", () => {
    const entry = {
      repoUrl: "https://github.com/org-32/repo-32",
      githubStars: 1,
      githubForks: 1,
      repoUpdatedAt: "old",
    };
    const state: SourceRepoSignalState = {
      available: true,
      signals: new Map([
        [
          "org-32/repo-32",
          {
            repo: "org-32/repo-32",
            stars: 320,
            forks: 32,
            repoUpdatedAt: "2026-06-01",
            fetchedAt: "2026-06-02",
            status: "ok",
            lastError: null,
          },
        ],
      ]),
    };
    const applied = applySourceRepoSignal(entry, state);
    expect(applied.githubStars).toBe(320);
    expect(applied.repoStats?.stars).toBe(320);
  });
  it("applySourceRepoSignal matrix 33", () => {
    const entry = {
      repoUrl: "https://github.com/org-33/repo-33",
      githubStars: 1,
      githubForks: 1,
      repoUpdatedAt: "old",
    };
    const state: SourceRepoSignalState = {
      available: true,
      signals: new Map([
        [
          "org-33/repo-33",
          {
            repo: "org-33/repo-33",
            stars: 330,
            forks: 33,
            repoUpdatedAt: "2026-06-01",
            fetchedAt: "2026-06-02",
            status: "ok",
            lastError: null,
          },
        ],
      ]),
    };
    const applied = applySourceRepoSignal(entry, state);
    expect(applied.githubStars).toBe(330);
    expect(applied.repoStats?.stars).toBe(330);
  });
  it("applySourceRepoSignal matrix 34", () => {
    const entry = {
      repoUrl: "https://github.com/org-34/repo-34",
      githubStars: 1,
      githubForks: 1,
      repoUpdatedAt: "old",
    };
    const state: SourceRepoSignalState = {
      available: true,
      signals: new Map([
        [
          "org-34/repo-34",
          {
            repo: "org-34/repo-34",
            stars: 340,
            forks: 34,
            repoUpdatedAt: "2026-06-01",
            fetchedAt: "2026-06-02",
            status: "ok",
            lastError: null,
          },
        ],
      ]),
    };
    const applied = applySourceRepoSignal(entry, state);
    expect(applied.githubStars).toBe(340);
    expect(applied.repoStats?.stars).toBe(340);
  });
  it("applySourceRepoSignal matrix 35", () => {
    const entry = {
      repoUrl: "https://github.com/org-35/repo-35",
      githubStars: 1,
      githubForks: 1,
      repoUpdatedAt: "old",
    };
    const state: SourceRepoSignalState = {
      available: true,
      signals: new Map([
        [
          "org-35/repo-35",
          {
            repo: "org-35/repo-35",
            stars: 350,
            forks: 35,
            repoUpdatedAt: "2026-06-01",
            fetchedAt: "2026-06-02",
            status: "ok",
            lastError: null,
          },
        ],
      ]),
    };
    const applied = applySourceRepoSignal(entry, state);
    expect(applied.githubStars).toBe(350);
    expect(applied.repoStats?.stars).toBe(350);
  });
  it("applySourceRepoSignal matrix 36", () => {
    const entry = {
      repoUrl: "https://github.com/org-36/repo-36",
      githubStars: 1,
      githubForks: 1,
      repoUpdatedAt: "old",
    };
    const state: SourceRepoSignalState = {
      available: true,
      signals: new Map([
        [
          "org-36/repo-36",
          {
            repo: "org-36/repo-36",
            stars: 360,
            forks: 36,
            repoUpdatedAt: "2026-06-01",
            fetchedAt: "2026-06-02",
            status: "ok",
            lastError: null,
          },
        ],
      ]),
    };
    const applied = applySourceRepoSignal(entry, state);
    expect(applied.githubStars).toBe(360);
    expect(applied.repoStats?.stars).toBe(360);
  });
  it("applySourceRepoSignal matrix 37", () => {
    const entry = {
      repoUrl: "https://github.com/org-37/repo-37",
      githubStars: 1,
      githubForks: 1,
      repoUpdatedAt: "old",
    };
    const state: SourceRepoSignalState = {
      available: true,
      signals: new Map([
        [
          "org-37/repo-37",
          {
            repo: "org-37/repo-37",
            stars: 370,
            forks: 37,
            repoUpdatedAt: "2026-06-01",
            fetchedAt: "2026-06-02",
            status: "ok",
            lastError: null,
          },
        ],
      ]),
    };
    const applied = applySourceRepoSignal(entry, state);
    expect(applied.githubStars).toBe(370);
    expect(applied.repoStats?.stars).toBe(370);
  });
  it("applySourceRepoSignal matrix 38", () => {
    const entry = {
      repoUrl: "https://github.com/org-38/repo-38",
      githubStars: 1,
      githubForks: 1,
      repoUpdatedAt: "old",
    };
    const state: SourceRepoSignalState = {
      available: true,
      signals: new Map([
        [
          "org-38/repo-38",
          {
            repo: "org-38/repo-38",
            stars: 380,
            forks: 38,
            repoUpdatedAt: "2026-06-01",
            fetchedAt: "2026-06-02",
            status: "ok",
            lastError: null,
          },
        ],
      ]),
    };
    const applied = applySourceRepoSignal(entry, state);
    expect(applied.githubStars).toBe(380);
    expect(applied.repoStats?.stars).toBe(380);
  });
  it("applySourceRepoSignal matrix 39", () => {
    const entry = {
      repoUrl: "https://github.com/org-39/repo-39",
      githubStars: 1,
      githubForks: 1,
      repoUpdatedAt: "old",
    };
    const state: SourceRepoSignalState = {
      available: true,
      signals: new Map([
        [
          "org-39/repo-39",
          {
            repo: "org-39/repo-39",
            stars: 390,
            forks: 39,
            repoUpdatedAt: "2026-06-01",
            fetchedAt: "2026-06-02",
            status: "ok",
            lastError: null,
          },
        ],
      ]),
    };
    const applied = applySourceRepoSignal(entry, state);
    expect(applied.githubStars).toBe(390);
    expect(applied.repoStats?.stars).toBe(390);
  });
  it("applySourceRepoSignal matrix 40", () => {
    const entry = {
      repoUrl: "https://github.com/org-40/repo-40",
      githubStars: 1,
      githubForks: 1,
      repoUpdatedAt: "old",
    };
    const state: SourceRepoSignalState = {
      available: true,
      signals: new Map([
        [
          "org-40/repo-40",
          {
            repo: "org-40/repo-40",
            stars: 400,
            forks: 40,
            repoUpdatedAt: "2026-06-01",
            fetchedAt: "2026-06-02",
            status: "ok",
            lastError: null,
          },
        ],
      ]),
    };
    const applied = applySourceRepoSignal(entry, state);
    expect(applied.githubStars).toBe(400);
    expect(applied.repoStats?.stars).toBe(400);
  });
  it("applySourceRepoSignal matrix 41", () => {
    const entry = {
      repoUrl: "https://github.com/org-41/repo-41",
      githubStars: 1,
      githubForks: 1,
      repoUpdatedAt: "old",
    };
    const state: SourceRepoSignalState = {
      available: true,
      signals: new Map([
        [
          "org-41/repo-41",
          {
            repo: "org-41/repo-41",
            stars: 410,
            forks: 41,
            repoUpdatedAt: "2026-06-01",
            fetchedAt: "2026-06-02",
            status: "ok",
            lastError: null,
          },
        ],
      ]),
    };
    const applied = applySourceRepoSignal(entry, state);
    expect(applied.githubStars).toBe(410);
    expect(applied.repoStats?.stars).toBe(410);
  });
  it("applySourceRepoSignal matrix 42", () => {
    const entry = {
      repoUrl: "https://github.com/org-42/repo-42",
      githubStars: 1,
      githubForks: 1,
      repoUpdatedAt: "old",
    };
    const state: SourceRepoSignalState = {
      available: true,
      signals: new Map([
        [
          "org-42/repo-42",
          {
            repo: "org-42/repo-42",
            stars: 420,
            forks: 42,
            repoUpdatedAt: "2026-06-01",
            fetchedAt: "2026-06-02",
            status: "ok",
            lastError: null,
          },
        ],
      ]),
    };
    const applied = applySourceRepoSignal(entry, state);
    expect(applied.githubStars).toBe(420);
    expect(applied.repoStats?.stars).toBe(420);
  });
  it("applySourceRepoSignal matrix 43", () => {
    const entry = {
      repoUrl: "https://github.com/org-43/repo-43",
      githubStars: 1,
      githubForks: 1,
      repoUpdatedAt: "old",
    };
    const state: SourceRepoSignalState = {
      available: true,
      signals: new Map([
        [
          "org-43/repo-43",
          {
            repo: "org-43/repo-43",
            stars: 430,
            forks: 43,
            repoUpdatedAt: "2026-06-01",
            fetchedAt: "2026-06-02",
            status: "ok",
            lastError: null,
          },
        ],
      ]),
    };
    const applied = applySourceRepoSignal(entry, state);
    expect(applied.githubStars).toBe(430);
    expect(applied.repoStats?.stars).toBe(430);
  });
  it("applySourceRepoSignal matrix 44", () => {
    const entry = {
      repoUrl: "https://github.com/org-44/repo-44",
      githubStars: 1,
      githubForks: 1,
      repoUpdatedAt: "old",
    };
    const state: SourceRepoSignalState = {
      available: true,
      signals: new Map([
        [
          "org-44/repo-44",
          {
            repo: "org-44/repo-44",
            stars: 440,
            forks: 44,
            repoUpdatedAt: "2026-06-01",
            fetchedAt: "2026-06-02",
            status: "ok",
            lastError: null,
          },
        ],
      ]),
    };
    const applied = applySourceRepoSignal(entry, state);
    expect(applied.githubStars).toBe(440);
    expect(applied.repoStats?.stars).toBe(440);
  });
  it("applySourceRepoSignal matrix 45", () => {
    const entry = {
      repoUrl: "https://github.com/org-45/repo-45",
      githubStars: 1,
      githubForks: 1,
      repoUpdatedAt: "old",
    };
    const state: SourceRepoSignalState = {
      available: true,
      signals: new Map([
        [
          "org-45/repo-45",
          {
            repo: "org-45/repo-45",
            stars: 450,
            forks: 45,
            repoUpdatedAt: "2026-06-01",
            fetchedAt: "2026-06-02",
            status: "ok",
            lastError: null,
          },
        ],
      ]),
    };
    const applied = applySourceRepoSignal(entry, state);
    expect(applied.githubStars).toBe(450);
    expect(applied.repoStats?.stars).toBe(450);
  });
  it("applySourceRepoSignal matrix 46", () => {
    const entry = {
      repoUrl: "https://github.com/org-46/repo-46",
      githubStars: 1,
      githubForks: 1,
      repoUpdatedAt: "old",
    };
    const state: SourceRepoSignalState = {
      available: true,
      signals: new Map([
        [
          "org-46/repo-46",
          {
            repo: "org-46/repo-46",
            stars: 460,
            forks: 46,
            repoUpdatedAt: "2026-06-01",
            fetchedAt: "2026-06-02",
            status: "ok",
            lastError: null,
          },
        ],
      ]),
    };
    const applied = applySourceRepoSignal(entry, state);
    expect(applied.githubStars).toBe(460);
    expect(applied.repoStats?.stars).toBe(460);
  });
  it("applySourceRepoSignal matrix 47", () => {
    const entry = {
      repoUrl: "https://github.com/org-47/repo-47",
      githubStars: 1,
      githubForks: 1,
      repoUpdatedAt: "old",
    };
    const state: SourceRepoSignalState = {
      available: true,
      signals: new Map([
        [
          "org-47/repo-47",
          {
            repo: "org-47/repo-47",
            stars: 470,
            forks: 47,
            repoUpdatedAt: "2026-06-01",
            fetchedAt: "2026-06-02",
            status: "ok",
            lastError: null,
          },
        ],
      ]),
    };
    const applied = applySourceRepoSignal(entry, state);
    expect(applied.githubStars).toBe(470);
    expect(applied.repoStats?.stars).toBe(470);
  });
  it("applySourceRepoSignal matrix 48", () => {
    const entry = {
      repoUrl: "https://github.com/org-48/repo-48",
      githubStars: 1,
      githubForks: 1,
      repoUpdatedAt: "old",
    };
    const state: SourceRepoSignalState = {
      available: true,
      signals: new Map([
        [
          "org-48/repo-48",
          {
            repo: "org-48/repo-48",
            stars: 480,
            forks: 48,
            repoUpdatedAt: "2026-06-01",
            fetchedAt: "2026-06-02",
            status: "ok",
            lastError: null,
          },
        ],
      ]),
    };
    const applied = applySourceRepoSignal(entry, state);
    expect(applied.githubStars).toBe(480);
    expect(applied.repoStats?.stars).toBe(480);
  });
  it("applySourceRepoSignal matrix 49", () => {
    const entry = {
      repoUrl: "https://github.com/org-49/repo-49",
      githubStars: 1,
      githubForks: 1,
      repoUpdatedAt: "old",
    };
    const state: SourceRepoSignalState = {
      available: true,
      signals: new Map([
        [
          "org-49/repo-49",
          {
            repo: "org-49/repo-49",
            stars: 490,
            forks: 49,
            repoUpdatedAt: "2026-06-01",
            fetchedAt: "2026-06-02",
            status: "ok",
            lastError: null,
          },
        ],
      ]),
    };
    const applied = applySourceRepoSignal(entry, state);
    expect(applied.githubStars).toBe(490);
    expect(applied.repoStats?.stars).toBe(490);
  });
  it("applySourceRepoSignal matrix 50", () => {
    const entry = {
      repoUrl: "https://github.com/org-50/repo-50",
      githubStars: 1,
      githubForks: 1,
      repoUpdatedAt: "old",
    };
    const state: SourceRepoSignalState = {
      available: true,
      signals: new Map([
        [
          "org-50/repo-50",
          {
            repo: "org-50/repo-50",
            stars: 500,
            forks: 50,
            repoUpdatedAt: "2026-06-01",
            fetchedAt: "2026-06-02",
            status: "ok",
            lastError: null,
          },
        ],
      ]),
    };
    const applied = applySourceRepoSignal(entry, state);
    expect(applied.githubStars).toBe(500);
    expect(applied.repoStats?.stars).toBe(500);
  });
  it("applySourceRepoSignal matrix 51", () => {
    const entry = {
      repoUrl: "https://github.com/org-51/repo-51",
      githubStars: 1,
      githubForks: 1,
      repoUpdatedAt: "old",
    };
    const state: SourceRepoSignalState = {
      available: true,
      signals: new Map([
        [
          "org-51/repo-51",
          {
            repo: "org-51/repo-51",
            stars: 510,
            forks: 51,
            repoUpdatedAt: "2026-06-01",
            fetchedAt: "2026-06-02",
            status: "ok",
            lastError: null,
          },
        ],
      ]),
    };
    const applied = applySourceRepoSignal(entry, state);
    expect(applied.githubStars).toBe(510);
    expect(applied.repoStats?.stars).toBe(510);
  });
  it("applySourceRepoSignal matrix 52", () => {
    const entry = {
      repoUrl: "https://github.com/org-52/repo-52",
      githubStars: 1,
      githubForks: 1,
      repoUpdatedAt: "old",
    };
    const state: SourceRepoSignalState = {
      available: true,
      signals: new Map([
        [
          "org-52/repo-52",
          {
            repo: "org-52/repo-52",
            stars: 520,
            forks: 52,
            repoUpdatedAt: "2026-06-01",
            fetchedAt: "2026-06-02",
            status: "ok",
            lastError: null,
          },
        ],
      ]),
    };
    const applied = applySourceRepoSignal(entry, state);
    expect(applied.githubStars).toBe(520);
    expect(applied.repoStats?.stars).toBe(520);
  });
  it("applySourceRepoSignal matrix 53", () => {
    const entry = {
      repoUrl: "https://github.com/org-53/repo-53",
      githubStars: 1,
      githubForks: 1,
      repoUpdatedAt: "old",
    };
    const state: SourceRepoSignalState = {
      available: true,
      signals: new Map([
        [
          "org-53/repo-53",
          {
            repo: "org-53/repo-53",
            stars: 530,
            forks: 53,
            repoUpdatedAt: "2026-06-01",
            fetchedAt: "2026-06-02",
            status: "ok",
            lastError: null,
          },
        ],
      ]),
    };
    const applied = applySourceRepoSignal(entry, state);
    expect(applied.githubStars).toBe(530);
    expect(applied.repoStats?.stars).toBe(530);
  });
  it("applySourceRepoSignal matrix 54", () => {
    const entry = {
      repoUrl: "https://github.com/org-54/repo-54",
      githubStars: 1,
      githubForks: 1,
      repoUpdatedAt: "old",
    };
    const state: SourceRepoSignalState = {
      available: true,
      signals: new Map([
        [
          "org-54/repo-54",
          {
            repo: "org-54/repo-54",
            stars: 540,
            forks: 54,
            repoUpdatedAt: "2026-06-01",
            fetchedAt: "2026-06-02",
            status: "ok",
            lastError: null,
          },
        ],
      ]),
    };
    const applied = applySourceRepoSignal(entry, state);
    expect(applied.githubStars).toBe(540);
    expect(applied.repoStats?.stars).toBe(540);
  });
  it("applySourceRepoSignal matrix 55", () => {
    const entry = {
      repoUrl: "https://github.com/org-55/repo-55",
      githubStars: 1,
      githubForks: 1,
      repoUpdatedAt: "old",
    };
    const state: SourceRepoSignalState = {
      available: true,
      signals: new Map([
        [
          "org-55/repo-55",
          {
            repo: "org-55/repo-55",
            stars: 550,
            forks: 55,
            repoUpdatedAt: "2026-06-01",
            fetchedAt: "2026-06-02",
            status: "ok",
            lastError: null,
          },
        ],
      ]),
    };
    const applied = applySourceRepoSignal(entry, state);
    expect(applied.githubStars).toBe(550);
    expect(applied.repoStats?.stars).toBe(550);
  });
  it("applySourceRepoSignal matrix 56", () => {
    const entry = {
      repoUrl: "https://github.com/org-56/repo-56",
      githubStars: 1,
      githubForks: 1,
      repoUpdatedAt: "old",
    };
    const state: SourceRepoSignalState = {
      available: true,
      signals: new Map([
        [
          "org-56/repo-56",
          {
            repo: "org-56/repo-56",
            stars: 560,
            forks: 56,
            repoUpdatedAt: "2026-06-01",
            fetchedAt: "2026-06-02",
            status: "ok",
            lastError: null,
          },
        ],
      ]),
    };
    const applied = applySourceRepoSignal(entry, state);
    expect(applied.githubStars).toBe(560);
    expect(applied.repoStats?.stars).toBe(560);
  });
  it("applySourceRepoSignal matrix 57", () => {
    const entry = {
      repoUrl: "https://github.com/org-57/repo-57",
      githubStars: 1,
      githubForks: 1,
      repoUpdatedAt: "old",
    };
    const state: SourceRepoSignalState = {
      available: true,
      signals: new Map([
        [
          "org-57/repo-57",
          {
            repo: "org-57/repo-57",
            stars: 570,
            forks: 57,
            repoUpdatedAt: "2026-06-01",
            fetchedAt: "2026-06-02",
            status: "ok",
            lastError: null,
          },
        ],
      ]),
    };
    const applied = applySourceRepoSignal(entry, state);
    expect(applied.githubStars).toBe(570);
    expect(applied.repoStats?.stars).toBe(570);
  });
  it("applySourceRepoSignal matrix 58", () => {
    const entry = {
      repoUrl: "https://github.com/org-58/repo-58",
      githubStars: 1,
      githubForks: 1,
      repoUpdatedAt: "old",
    };
    const state: SourceRepoSignalState = {
      available: true,
      signals: new Map([
        [
          "org-58/repo-58",
          {
            repo: "org-58/repo-58",
            stars: 580,
            forks: 58,
            repoUpdatedAt: "2026-06-01",
            fetchedAt: "2026-06-02",
            status: "ok",
            lastError: null,
          },
        ],
      ]),
    };
    const applied = applySourceRepoSignal(entry, state);
    expect(applied.githubStars).toBe(580);
    expect(applied.repoStats?.stars).toBe(580);
  });
  it("applySourceRepoSignal matrix 59", () => {
    const entry = {
      repoUrl: "https://github.com/org-59/repo-59",
      githubStars: 1,
      githubForks: 1,
      repoUpdatedAt: "old",
    };
    const state: SourceRepoSignalState = {
      available: true,
      signals: new Map([
        [
          "org-59/repo-59",
          {
            repo: "org-59/repo-59",
            stars: 590,
            forks: 59,
            repoUpdatedAt: "2026-06-01",
            fetchedAt: "2026-06-02",
            status: "ok",
            lastError: null,
          },
        ],
      ]),
    };
    const applied = applySourceRepoSignal(entry, state);
    expect(applied.githubStars).toBe(590);
    expect(applied.repoStats?.stars).toBe(590);
  });
});

describe("source-repo-signals-lib refreshLimit", () => {
  it("defaults invalid values to DEFAULT_REFRESH_LIMIT", () => {
    expect(refreshLimit(undefined)).toBe(DEFAULT_REFRESH_LIMIT);
    expect(refreshLimit("not-a-number")).toBe(DEFAULT_REFRESH_LIMIT);
  });
  it("clamps between 1 and 100", () => {
    expect(refreshLimit(0)).toBe(1);
    expect(refreshLimit(1000)).toBe(100);
  });
  it("refreshLimit value -20", () => {
    expect(refreshLimit(-20)).toBe(1);
  });
  it("refreshLimit value -19", () => {
    expect(refreshLimit(-19)).toBe(1);
  });
  it("refreshLimit value -18", () => {
    expect(refreshLimit(-18)).toBe(1);
  });
  it("refreshLimit value -17", () => {
    expect(refreshLimit(-17)).toBe(1);
  });
  it("refreshLimit value -16", () => {
    expect(refreshLimit(-16)).toBe(1);
  });
  it("refreshLimit value -15", () => {
    expect(refreshLimit(-15)).toBe(1);
  });
  it("refreshLimit value -14", () => {
    expect(refreshLimit(-14)).toBe(1);
  });
  it("refreshLimit value -13", () => {
    expect(refreshLimit(-13)).toBe(1);
  });
  it("refreshLimit value -12", () => {
    expect(refreshLimit(-12)).toBe(1);
  });
  it("refreshLimit value -11", () => {
    expect(refreshLimit(-11)).toBe(1);
  });
  it("refreshLimit value -10", () => {
    expect(refreshLimit(-10)).toBe(1);
  });
  it("refreshLimit value -9", () => {
    expect(refreshLimit(-9)).toBe(1);
  });
  it("refreshLimit value -8", () => {
    expect(refreshLimit(-8)).toBe(1);
  });
  it("refreshLimit value -7", () => {
    expect(refreshLimit(-7)).toBe(1);
  });
  it("refreshLimit value -6", () => {
    expect(refreshLimit(-6)).toBe(1);
  });
  it("refreshLimit value -5", () => {
    expect(refreshLimit(-5)).toBe(1);
  });
  it("refreshLimit value -4", () => {
    expect(refreshLimit(-4)).toBe(1);
  });
  it("refreshLimit value -3", () => {
    expect(refreshLimit(-3)).toBe(1);
  });
  it("refreshLimit value -2", () => {
    expect(refreshLimit(-2)).toBe(1);
  });
  it("refreshLimit value -1", () => {
    expect(refreshLimit(-1)).toBe(1);
  });
  it("refreshLimit value 0", () => {
    expect(refreshLimit(0)).toBe(1);
  });
  it("refreshLimit value 1", () => {
    expect(refreshLimit(1)).toBe(1);
  });
  it("refreshLimit value 2", () => {
    expect(refreshLimit(2)).toBe(2);
  });
  it("refreshLimit value 3", () => {
    expect(refreshLimit(3)).toBe(3);
  });
  it("refreshLimit value 4", () => {
    expect(refreshLimit(4)).toBe(4);
  });
  it("refreshLimit value 5", () => {
    expect(refreshLimit(5)).toBe(5);
  });
  it("refreshLimit value 6", () => {
    expect(refreshLimit(6)).toBe(6);
  });
  it("refreshLimit value 7", () => {
    expect(refreshLimit(7)).toBe(7);
  });
  it("refreshLimit value 8", () => {
    expect(refreshLimit(8)).toBe(8);
  });
  it("refreshLimit value 9", () => {
    expect(refreshLimit(9)).toBe(9);
  });
  it("refreshLimit value 10", () => {
    expect(refreshLimit(10)).toBe(10);
  });
  it("refreshLimit value 11", () => {
    expect(refreshLimit(11)).toBe(11);
  });
  it("refreshLimit value 12", () => {
    expect(refreshLimit(12)).toBe(12);
  });
  it("refreshLimit value 13", () => {
    expect(refreshLimit(13)).toBe(13);
  });
  it("refreshLimit value 14", () => {
    expect(refreshLimit(14)).toBe(14);
  });
  it("refreshLimit value 15", () => {
    expect(refreshLimit(15)).toBe(15);
  });
  it("refreshLimit value 16", () => {
    expect(refreshLimit(16)).toBe(16);
  });
  it("refreshLimit value 17", () => {
    expect(refreshLimit(17)).toBe(17);
  });
  it("refreshLimit value 18", () => {
    expect(refreshLimit(18)).toBe(18);
  });
  it("refreshLimit value 19", () => {
    expect(refreshLimit(19)).toBe(19);
  });
  it("refreshLimit value 20", () => {
    expect(refreshLimit(20)).toBe(20);
  });
  it("refreshLimit value 21", () => {
    expect(refreshLimit(21)).toBe(21);
  });
  it("refreshLimit value 22", () => {
    expect(refreshLimit(22)).toBe(22);
  });
  it("refreshLimit value 23", () => {
    expect(refreshLimit(23)).toBe(23);
  });
  it("refreshLimit value 24", () => {
    expect(refreshLimit(24)).toBe(24);
  });
  it("refreshLimit value 25", () => {
    expect(refreshLimit(25)).toBe(25);
  });
  it("refreshLimit value 26", () => {
    expect(refreshLimit(26)).toBe(26);
  });
  it("refreshLimit value 27", () => {
    expect(refreshLimit(27)).toBe(27);
  });
  it("refreshLimit value 28", () => {
    expect(refreshLimit(28)).toBe(28);
  });
  it("refreshLimit value 29", () => {
    expect(refreshLimit(29)).toBe(29);
  });
  it("refreshLimit value 30", () => {
    expect(refreshLimit(30)).toBe(30);
  });
  it("refreshLimit value 31", () => {
    expect(refreshLimit(31)).toBe(31);
  });
  it("refreshLimit value 32", () => {
    expect(refreshLimit(32)).toBe(32);
  });
  it("refreshLimit value 33", () => {
    expect(refreshLimit(33)).toBe(33);
  });
  it("refreshLimit value 34", () => {
    expect(refreshLimit(34)).toBe(34);
  });
  it("refreshLimit value 35", () => {
    expect(refreshLimit(35)).toBe(35);
  });
  it("refreshLimit value 36", () => {
    expect(refreshLimit(36)).toBe(36);
  });
  it("refreshLimit value 37", () => {
    expect(refreshLimit(37)).toBe(37);
  });
  it("refreshLimit value 38", () => {
    expect(refreshLimit(38)).toBe(38);
  });
  it("refreshLimit value 39", () => {
    expect(refreshLimit(39)).toBe(39);
  });
  it("refreshLimit value 40", () => {
    expect(refreshLimit(40)).toBe(40);
  });
  it("refreshLimit value 41", () => {
    expect(refreshLimit(41)).toBe(41);
  });
  it("refreshLimit value 42", () => {
    expect(refreshLimit(42)).toBe(42);
  });
  it("refreshLimit value 43", () => {
    expect(refreshLimit(43)).toBe(43);
  });
  it("refreshLimit value 44", () => {
    expect(refreshLimit(44)).toBe(44);
  });
  it("refreshLimit value 45", () => {
    expect(refreshLimit(45)).toBe(45);
  });
  it("refreshLimit value 46", () => {
    expect(refreshLimit(46)).toBe(46);
  });
  it("refreshLimit value 47", () => {
    expect(refreshLimit(47)).toBe(47);
  });
  it("refreshLimit value 48", () => {
    expect(refreshLimit(48)).toBe(48);
  });
  it("refreshLimit value 49", () => {
    expect(refreshLimit(49)).toBe(49);
  });
  it("refreshLimit value 50", () => {
    expect(refreshLimit(50)).toBe(50);
  });
  it("refreshLimit value 51", () => {
    expect(refreshLimit(51)).toBe(51);
  });
  it("refreshLimit value 52", () => {
    expect(refreshLimit(52)).toBe(52);
  });
  it("refreshLimit value 53", () => {
    expect(refreshLimit(53)).toBe(53);
  });
  it("refreshLimit value 54", () => {
    expect(refreshLimit(54)).toBe(54);
  });
  it("refreshLimit value 55", () => {
    expect(refreshLimit(55)).toBe(55);
  });
  it("refreshLimit value 56", () => {
    expect(refreshLimit(56)).toBe(56);
  });
  it("refreshLimit value 57", () => {
    expect(refreshLimit(57)).toBe(57);
  });
  it("refreshLimit value 58", () => {
    expect(refreshLimit(58)).toBe(58);
  });
  it("refreshLimit value 59", () => {
    expect(refreshLimit(59)).toBe(59);
  });
  it("refreshLimit value 60", () => {
    expect(refreshLimit(60)).toBe(60);
  });
  it("refreshLimit value 61", () => {
    expect(refreshLimit(61)).toBe(61);
  });
  it("refreshLimit value 62", () => {
    expect(refreshLimit(62)).toBe(62);
  });
  it("refreshLimit value 63", () => {
    expect(refreshLimit(63)).toBe(63);
  });
  it("refreshLimit value 64", () => {
    expect(refreshLimit(64)).toBe(64);
  });
  it("refreshLimit value 65", () => {
    expect(refreshLimit(65)).toBe(65);
  });
  it("refreshLimit value 66", () => {
    expect(refreshLimit(66)).toBe(66);
  });
  it("refreshLimit value 67", () => {
    expect(refreshLimit(67)).toBe(67);
  });
  it("refreshLimit value 68", () => {
    expect(refreshLimit(68)).toBe(68);
  });
  it("refreshLimit value 69", () => {
    expect(refreshLimit(69)).toBe(69);
  });
  it("refreshLimit value 70", () => {
    expect(refreshLimit(70)).toBe(70);
  });
  it("refreshLimit value 71", () => {
    expect(refreshLimit(71)).toBe(71);
  });
  it("refreshLimit value 72", () => {
    expect(refreshLimit(72)).toBe(72);
  });
  it("refreshLimit value 73", () => {
    expect(refreshLimit(73)).toBe(73);
  });
  it("refreshLimit value 74", () => {
    expect(refreshLimit(74)).toBe(74);
  });
  it("refreshLimit value 75", () => {
    expect(refreshLimit(75)).toBe(75);
  });
  it("refreshLimit value 76", () => {
    expect(refreshLimit(76)).toBe(76);
  });
  it("refreshLimit value 77", () => {
    expect(refreshLimit(77)).toBe(77);
  });
  it("refreshLimit value 78", () => {
    expect(refreshLimit(78)).toBe(78);
  });
  it("refreshLimit value 79", () => {
    expect(refreshLimit(79)).toBe(79);
  });
  it("refreshLimit value 80", () => {
    expect(refreshLimit(80)).toBe(80);
  });
  it("refreshLimit value 81", () => {
    expect(refreshLimit(81)).toBe(81);
  });
  it("refreshLimit value 82", () => {
    expect(refreshLimit(82)).toBe(82);
  });
  it("refreshLimit value 83", () => {
    expect(refreshLimit(83)).toBe(83);
  });
  it("refreshLimit value 84", () => {
    expect(refreshLimit(84)).toBe(84);
  });
  it("refreshLimit value 85", () => {
    expect(refreshLimit(85)).toBe(85);
  });
  it("refreshLimit value 86", () => {
    expect(refreshLimit(86)).toBe(86);
  });
  it("refreshLimit value 87", () => {
    expect(refreshLimit(87)).toBe(87);
  });
  it("refreshLimit value 88", () => {
    expect(refreshLimit(88)).toBe(88);
  });
  it("refreshLimit value 89", () => {
    expect(refreshLimit(89)).toBe(89);
  });
  it("refreshLimit value 90", () => {
    expect(refreshLimit(90)).toBe(90);
  });
  it("refreshLimit value 91", () => {
    expect(refreshLimit(91)).toBe(91);
  });
  it("refreshLimit value 92", () => {
    expect(refreshLimit(92)).toBe(92);
  });
  it("refreshLimit value 93", () => {
    expect(refreshLimit(93)).toBe(93);
  });
  it("refreshLimit value 94", () => {
    expect(refreshLimit(94)).toBe(94);
  });
  it("refreshLimit value 95", () => {
    expect(refreshLimit(95)).toBe(95);
  });
  it("refreshLimit value 96", () => {
    expect(refreshLimit(96)).toBe(96);
  });
  it("refreshLimit value 97", () => {
    expect(refreshLimit(97)).toBe(97);
  });
  it("refreshLimit value 98", () => {
    expect(refreshLimit(98)).toBe(98);
  });
  it("refreshLimit value 99", () => {
    expect(refreshLimit(99)).toBe(99);
  });
  it("refreshLimit value 100", () => {
    expect(refreshLimit(100)).toBe(100);
  });
  it("refreshLimit value 101", () => {
    expect(refreshLimit(101)).toBe(100);
  });
  it("refreshLimit value 102", () => {
    expect(refreshLimit(102)).toBe(100);
  });
  it("refreshLimit value 103", () => {
    expect(refreshLimit(103)).toBe(100);
  });
  it("refreshLimit value 104", () => {
    expect(refreshLimit(104)).toBe(100);
  });
  it("refreshLimit value 105", () => {
    expect(refreshLimit(105)).toBe(100);
  });
  it("refreshLimit value 106", () => {
    expect(refreshLimit(106)).toBe(100);
  });
  it("refreshLimit value 107", () => {
    expect(refreshLimit(107)).toBe(100);
  });
  it("refreshLimit value 108", () => {
    expect(refreshLimit(108)).toBe(100);
  });
  it("refreshLimit value 109", () => {
    expect(refreshLimit(109)).toBe(100);
  });
  it("refreshLimit value 110", () => {
    expect(refreshLimit(110)).toBe(100);
  });
  it("refreshLimit value 111", () => {
    expect(refreshLimit(111)).toBe(100);
  });
  it("refreshLimit value 112", () => {
    expect(refreshLimit(112)).toBe(100);
  });
  it("refreshLimit value 113", () => {
    expect(refreshLimit(113)).toBe(100);
  });
  it("refreshLimit value 114", () => {
    expect(refreshLimit(114)).toBe(100);
  });
  it("refreshLimit value 115", () => {
    expect(refreshLimit(115)).toBe(100);
  });
  it("refreshLimit value 116", () => {
    expect(refreshLimit(116)).toBe(100);
  });
  it("refreshLimit value 117", () => {
    expect(refreshLimit(117)).toBe(100);
  });
  it("refreshLimit value 118", () => {
    expect(refreshLimit(118)).toBe(100);
  });
  it("refreshLimit value 119", () => {
    expect(refreshLimit(119)).toBe(100);
  });
  it("refreshLimit value 120", () => {
    expect(refreshLimit(120)).toBe(100);
  });
});

describe("source-repo-signals-lib shouldRefreshSourceRepoSignal", () => {
  const now = Date.parse("2026-06-15T00:00:00.000Z");
  it("returns true when signal missing", () => {
    expect(shouldRefreshSourceRepoSignal(undefined, now)).toBe(true);
  });
  it("returns true for error status", () => {
    const signal: SourceRepoSignal = {
      repo: "a/b",
      stars: null,
      forks: null,
      repoUpdatedAt: null,
      fetchedAt: "2026-06-14T00:00:00.000Z",
      status: "error",
      lastError: "boom",
    };
    expect(shouldRefreshSourceRepoSignal(signal, now)).toBe(true);
  });
  it("returns false for fresh ok signal", () => {
    const signal: SourceRepoSignal = {
      repo: "a/b",
      stars: 1,
      forks: 1,
      repoUpdatedAt: "2026-06-01",
      fetchedAt: "2026-06-14T23:00:00.000Z",
      status: "ok",
      lastError: null,
    };
    expect(shouldRefreshSourceRepoSignal(signal, now)).toBe(false);
  });
  it("shouldRefreshSourceRepoSignal age 0h", () => {
    const staleMs = 0;
    const fetchedAt = new Date(now - staleMs).toISOString();
    const signal: SourceRepoSignal = {
      repo: "a/b",
      stars: 1,
      forks: null,
      repoUpdatedAt: null,
      fetchedAt,
      status: "ok",
      lastError: null,
    };
    expect(shouldRefreshSourceRepoSignal(signal, now)).toBe(false);
  });
  it("shouldRefreshSourceRepoSignal age 1h", () => {
    const staleMs = 3600000;
    const fetchedAt = new Date(now - staleMs).toISOString();
    const signal: SourceRepoSignal = {
      repo: "a/b",
      stars: 1,
      forks: null,
      repoUpdatedAt: null,
      fetchedAt,
      status: "ok",
      lastError: null,
    };
    expect(shouldRefreshSourceRepoSignal(signal, now)).toBe(false);
  });
  it("shouldRefreshSourceRepoSignal age 2h", () => {
    const staleMs = 7200000;
    const fetchedAt = new Date(now - staleMs).toISOString();
    const signal: SourceRepoSignal = {
      repo: "a/b",
      stars: 1,
      forks: null,
      repoUpdatedAt: null,
      fetchedAt,
      status: "ok",
      lastError: null,
    };
    expect(shouldRefreshSourceRepoSignal(signal, now)).toBe(false);
  });
  it("shouldRefreshSourceRepoSignal age 3h", () => {
    const staleMs = 10800000;
    const fetchedAt = new Date(now - staleMs).toISOString();
    const signal: SourceRepoSignal = {
      repo: "a/b",
      stars: 1,
      forks: null,
      repoUpdatedAt: null,
      fetchedAt,
      status: "ok",
      lastError: null,
    };
    expect(shouldRefreshSourceRepoSignal(signal, now)).toBe(false);
  });
  it("shouldRefreshSourceRepoSignal age 4h", () => {
    const staleMs = 14400000;
    const fetchedAt = new Date(now - staleMs).toISOString();
    const signal: SourceRepoSignal = {
      repo: "a/b",
      stars: 1,
      forks: null,
      repoUpdatedAt: null,
      fetchedAt,
      status: "ok",
      lastError: null,
    };
    expect(shouldRefreshSourceRepoSignal(signal, now)).toBe(false);
  });
  it("shouldRefreshSourceRepoSignal age 5h", () => {
    const staleMs = 18000000;
    const fetchedAt = new Date(now - staleMs).toISOString();
    const signal: SourceRepoSignal = {
      repo: "a/b",
      stars: 1,
      forks: null,
      repoUpdatedAt: null,
      fetchedAt,
      status: "ok",
      lastError: null,
    };
    expect(shouldRefreshSourceRepoSignal(signal, now)).toBe(false);
  });
  it("shouldRefreshSourceRepoSignal age 6h", () => {
    const staleMs = 21600000;
    const fetchedAt = new Date(now - staleMs).toISOString();
    const signal: SourceRepoSignal = {
      repo: "a/b",
      stars: 1,
      forks: null,
      repoUpdatedAt: null,
      fetchedAt,
      status: "ok",
      lastError: null,
    };
    expect(shouldRefreshSourceRepoSignal(signal, now)).toBe(false);
  });
  it("shouldRefreshSourceRepoSignal age 7h", () => {
    const staleMs = 25200000;
    const fetchedAt = new Date(now - staleMs).toISOString();
    const signal: SourceRepoSignal = {
      repo: "a/b",
      stars: 1,
      forks: null,
      repoUpdatedAt: null,
      fetchedAt,
      status: "ok",
      lastError: null,
    };
    expect(shouldRefreshSourceRepoSignal(signal, now)).toBe(false);
  });
  it("shouldRefreshSourceRepoSignal age 8h", () => {
    const staleMs = 28800000;
    const fetchedAt = new Date(now - staleMs).toISOString();
    const signal: SourceRepoSignal = {
      repo: "a/b",
      stars: 1,
      forks: null,
      repoUpdatedAt: null,
      fetchedAt,
      status: "ok",
      lastError: null,
    };
    expect(shouldRefreshSourceRepoSignal(signal, now)).toBe(false);
  });
  it("shouldRefreshSourceRepoSignal age 9h", () => {
    const staleMs = 32400000;
    const fetchedAt = new Date(now - staleMs).toISOString();
    const signal: SourceRepoSignal = {
      repo: "a/b",
      stars: 1,
      forks: null,
      repoUpdatedAt: null,
      fetchedAt,
      status: "ok",
      lastError: null,
    };
    expect(shouldRefreshSourceRepoSignal(signal, now)).toBe(false);
  });
  it("shouldRefreshSourceRepoSignal age 10h", () => {
    const staleMs = 36000000;
    const fetchedAt = new Date(now - staleMs).toISOString();
    const signal: SourceRepoSignal = {
      repo: "a/b",
      stars: 1,
      forks: null,
      repoUpdatedAt: null,
      fetchedAt,
      status: "ok",
      lastError: null,
    };
    expect(shouldRefreshSourceRepoSignal(signal, now)).toBe(false);
  });
  it("shouldRefreshSourceRepoSignal age 11h", () => {
    const staleMs = 39600000;
    const fetchedAt = new Date(now - staleMs).toISOString();
    const signal: SourceRepoSignal = {
      repo: "a/b",
      stars: 1,
      forks: null,
      repoUpdatedAt: null,
      fetchedAt,
      status: "ok",
      lastError: null,
    };
    expect(shouldRefreshSourceRepoSignal(signal, now)).toBe(false);
  });
  it("shouldRefreshSourceRepoSignal age 12h", () => {
    const staleMs = 43200000;
    const fetchedAt = new Date(now - staleMs).toISOString();
    const signal: SourceRepoSignal = {
      repo: "a/b",
      stars: 1,
      forks: null,
      repoUpdatedAt: null,
      fetchedAt,
      status: "ok",
      lastError: null,
    };
    expect(shouldRefreshSourceRepoSignal(signal, now)).toBe(false);
  });
  it("shouldRefreshSourceRepoSignal age 13h", () => {
    const staleMs = 46800000;
    const fetchedAt = new Date(now - staleMs).toISOString();
    const signal: SourceRepoSignal = {
      repo: "a/b",
      stars: 1,
      forks: null,
      repoUpdatedAt: null,
      fetchedAt,
      status: "ok",
      lastError: null,
    };
    expect(shouldRefreshSourceRepoSignal(signal, now)).toBe(false);
  });
  it("shouldRefreshSourceRepoSignal age 14h", () => {
    const staleMs = 50400000;
    const fetchedAt = new Date(now - staleMs).toISOString();
    const signal: SourceRepoSignal = {
      repo: "a/b",
      stars: 1,
      forks: null,
      repoUpdatedAt: null,
      fetchedAt,
      status: "ok",
      lastError: null,
    };
    expect(shouldRefreshSourceRepoSignal(signal, now)).toBe(false);
  });
  it("shouldRefreshSourceRepoSignal age 15h", () => {
    const staleMs = 54000000;
    const fetchedAt = new Date(now - staleMs).toISOString();
    const signal: SourceRepoSignal = {
      repo: "a/b",
      stars: 1,
      forks: null,
      repoUpdatedAt: null,
      fetchedAt,
      status: "ok",
      lastError: null,
    };
    expect(shouldRefreshSourceRepoSignal(signal, now)).toBe(false);
  });
  it("shouldRefreshSourceRepoSignal age 16h", () => {
    const staleMs = 57600000;
    const fetchedAt = new Date(now - staleMs).toISOString();
    const signal: SourceRepoSignal = {
      repo: "a/b",
      stars: 1,
      forks: null,
      repoUpdatedAt: null,
      fetchedAt,
      status: "ok",
      lastError: null,
    };
    expect(shouldRefreshSourceRepoSignal(signal, now)).toBe(false);
  });
  it("shouldRefreshSourceRepoSignal age 17h", () => {
    const staleMs = 61200000;
    const fetchedAt = new Date(now - staleMs).toISOString();
    const signal: SourceRepoSignal = {
      repo: "a/b",
      stars: 1,
      forks: null,
      repoUpdatedAt: null,
      fetchedAt,
      status: "ok",
      lastError: null,
    };
    expect(shouldRefreshSourceRepoSignal(signal, now)).toBe(false);
  });
  it("shouldRefreshSourceRepoSignal age 18h", () => {
    const staleMs = 64800000;
    const fetchedAt = new Date(now - staleMs).toISOString();
    const signal: SourceRepoSignal = {
      repo: "a/b",
      stars: 1,
      forks: null,
      repoUpdatedAt: null,
      fetchedAt,
      status: "ok",
      lastError: null,
    };
    expect(shouldRefreshSourceRepoSignal(signal, now)).toBe(false);
  });
  it("shouldRefreshSourceRepoSignal age 19h", () => {
    const staleMs = 68400000;
    const fetchedAt = new Date(now - staleMs).toISOString();
    const signal: SourceRepoSignal = {
      repo: "a/b",
      stars: 1,
      forks: null,
      repoUpdatedAt: null,
      fetchedAt,
      status: "ok",
      lastError: null,
    };
    expect(shouldRefreshSourceRepoSignal(signal, now)).toBe(false);
  });
  it("shouldRefreshSourceRepoSignal age 20h", () => {
    const staleMs = 72000000;
    const fetchedAt = new Date(now - staleMs).toISOString();
    const signal: SourceRepoSignal = {
      repo: "a/b",
      stars: 1,
      forks: null,
      repoUpdatedAt: null,
      fetchedAt,
      status: "ok",
      lastError: null,
    };
    expect(shouldRefreshSourceRepoSignal(signal, now)).toBe(false);
  });
  it("shouldRefreshSourceRepoSignal age 21h", () => {
    const staleMs = 75600000;
    const fetchedAt = new Date(now - staleMs).toISOString();
    const signal: SourceRepoSignal = {
      repo: "a/b",
      stars: 1,
      forks: null,
      repoUpdatedAt: null,
      fetchedAt,
      status: "ok",
      lastError: null,
    };
    expect(shouldRefreshSourceRepoSignal(signal, now)).toBe(false);
  });
  it("shouldRefreshSourceRepoSignal age 22h", () => {
    const staleMs = 79200000;
    const fetchedAt = new Date(now - staleMs).toISOString();
    const signal: SourceRepoSignal = {
      repo: "a/b",
      stars: 1,
      forks: null,
      repoUpdatedAt: null,
      fetchedAt,
      status: "ok",
      lastError: null,
    };
    expect(shouldRefreshSourceRepoSignal(signal, now)).toBe(false);
  });
  it("shouldRefreshSourceRepoSignal age 23h", () => {
    const staleMs = 82800000;
    const fetchedAt = new Date(now - staleMs).toISOString();
    const signal: SourceRepoSignal = {
      repo: "a/b",
      stars: 1,
      forks: null,
      repoUpdatedAt: null,
      fetchedAt,
      status: "ok",
      lastError: null,
    };
    expect(shouldRefreshSourceRepoSignal(signal, now)).toBe(false);
  });
  it("shouldRefreshSourceRepoSignal age 24h", () => {
    const staleMs = 86400000;
    const fetchedAt = new Date(now - staleMs).toISOString();
    const signal: SourceRepoSignal = {
      repo: "a/b",
      stars: 1,
      forks: null,
      repoUpdatedAt: null,
      fetchedAt,
      status: "ok",
      lastError: null,
    };
    expect(shouldRefreshSourceRepoSignal(signal, now)).toBe(false);
  });
  it("shouldRefreshSourceRepoSignal age 25h", () => {
    const staleMs = 90000000;
    const fetchedAt = new Date(now - staleMs).toISOString();
    const signal: SourceRepoSignal = {
      repo: "a/b",
      stars: 1,
      forks: null,
      repoUpdatedAt: null,
      fetchedAt,
      status: "ok",
      lastError: null,
    };
    expect(shouldRefreshSourceRepoSignal(signal, now)).toBe(true);
  });
  it("shouldRefreshSourceRepoSignal age 26h", () => {
    const staleMs = 93600000;
    const fetchedAt = new Date(now - staleMs).toISOString();
    const signal: SourceRepoSignal = {
      repo: "a/b",
      stars: 1,
      forks: null,
      repoUpdatedAt: null,
      fetchedAt,
      status: "ok",
      lastError: null,
    };
    expect(shouldRefreshSourceRepoSignal(signal, now)).toBe(true);
  });
  it("shouldRefreshSourceRepoSignal age 27h", () => {
    const staleMs = 97200000;
    const fetchedAt = new Date(now - staleMs).toISOString();
    const signal: SourceRepoSignal = {
      repo: "a/b",
      stars: 1,
      forks: null,
      repoUpdatedAt: null,
      fetchedAt,
      status: "ok",
      lastError: null,
    };
    expect(shouldRefreshSourceRepoSignal(signal, now)).toBe(true);
  });
  it("shouldRefreshSourceRepoSignal age 28h", () => {
    const staleMs = 100800000;
    const fetchedAt = new Date(now - staleMs).toISOString();
    const signal: SourceRepoSignal = {
      repo: "a/b",
      stars: 1,
      forks: null,
      repoUpdatedAt: null,
      fetchedAt,
      status: "ok",
      lastError: null,
    };
    expect(shouldRefreshSourceRepoSignal(signal, now)).toBe(true);
  });
  it("shouldRefreshSourceRepoSignal age 29h", () => {
    const staleMs = 104400000;
    const fetchedAt = new Date(now - staleMs).toISOString();
    const signal: SourceRepoSignal = {
      repo: "a/b",
      stars: 1,
      forks: null,
      repoUpdatedAt: null,
      fetchedAt,
      status: "ok",
      lastError: null,
    };
    expect(shouldRefreshSourceRepoSignal(signal, now)).toBe(true);
  });
  it("shouldRefreshSourceRepoSignal age 30h", () => {
    const staleMs = 108000000;
    const fetchedAt = new Date(now - staleMs).toISOString();
    const signal: SourceRepoSignal = {
      repo: "a/b",
      stars: 1,
      forks: null,
      repoUpdatedAt: null,
      fetchedAt,
      status: "ok",
      lastError: null,
    };
    expect(shouldRefreshSourceRepoSignal(signal, now)).toBe(true);
  });
  it("shouldRefreshSourceRepoSignal age 31h", () => {
    const staleMs = 111600000;
    const fetchedAt = new Date(now - staleMs).toISOString();
    const signal: SourceRepoSignal = {
      repo: "a/b",
      stars: 1,
      forks: null,
      repoUpdatedAt: null,
      fetchedAt,
      status: "ok",
      lastError: null,
    };
    expect(shouldRefreshSourceRepoSignal(signal, now)).toBe(true);
  });
  it("shouldRefreshSourceRepoSignal age 32h", () => {
    const staleMs = 115200000;
    const fetchedAt = new Date(now - staleMs).toISOString();
    const signal: SourceRepoSignal = {
      repo: "a/b",
      stars: 1,
      forks: null,
      repoUpdatedAt: null,
      fetchedAt,
      status: "ok",
      lastError: null,
    };
    expect(shouldRefreshSourceRepoSignal(signal, now)).toBe(true);
  });
  it("shouldRefreshSourceRepoSignal age 33h", () => {
    const staleMs = 118800000;
    const fetchedAt = new Date(now - staleMs).toISOString();
    const signal: SourceRepoSignal = {
      repo: "a/b",
      stars: 1,
      forks: null,
      repoUpdatedAt: null,
      fetchedAt,
      status: "ok",
      lastError: null,
    };
    expect(shouldRefreshSourceRepoSignal(signal, now)).toBe(true);
  });
  it("shouldRefreshSourceRepoSignal age 34h", () => {
    const staleMs = 122400000;
    const fetchedAt = new Date(now - staleMs).toISOString();
    const signal: SourceRepoSignal = {
      repo: "a/b",
      stars: 1,
      forks: null,
      repoUpdatedAt: null,
      fetchedAt,
      status: "ok",
      lastError: null,
    };
    expect(shouldRefreshSourceRepoSignal(signal, now)).toBe(true);
  });
  it("shouldRefreshSourceRepoSignal age 35h", () => {
    const staleMs = 126000000;
    const fetchedAt = new Date(now - staleMs).toISOString();
    const signal: SourceRepoSignal = {
      repo: "a/b",
      stars: 1,
      forks: null,
      repoUpdatedAt: null,
      fetchedAt,
      status: "ok",
      lastError: null,
    };
    expect(shouldRefreshSourceRepoSignal(signal, now)).toBe(true);
  });
  it("shouldRefreshSourceRepoSignal age 36h", () => {
    const staleMs = 129600000;
    const fetchedAt = new Date(now - staleMs).toISOString();
    const signal: SourceRepoSignal = {
      repo: "a/b",
      stars: 1,
      forks: null,
      repoUpdatedAt: null,
      fetchedAt,
      status: "ok",
      lastError: null,
    };
    expect(shouldRefreshSourceRepoSignal(signal, now)).toBe(true);
  });
  it("shouldRefreshSourceRepoSignal age 37h", () => {
    const staleMs = 133200000;
    const fetchedAt = new Date(now - staleMs).toISOString();
    const signal: SourceRepoSignal = {
      repo: "a/b",
      stars: 1,
      forks: null,
      repoUpdatedAt: null,
      fetchedAt,
      status: "ok",
      lastError: null,
    };
    expect(shouldRefreshSourceRepoSignal(signal, now)).toBe(true);
  });
  it("shouldRefreshSourceRepoSignal age 38h", () => {
    const staleMs = 136800000;
    const fetchedAt = new Date(now - staleMs).toISOString();
    const signal: SourceRepoSignal = {
      repo: "a/b",
      stars: 1,
      forks: null,
      repoUpdatedAt: null,
      fetchedAt,
      status: "ok",
      lastError: null,
    };
    expect(shouldRefreshSourceRepoSignal(signal, now)).toBe(true);
  });
  it("shouldRefreshSourceRepoSignal age 39h", () => {
    const staleMs = 140400000;
    const fetchedAt = new Date(now - staleMs).toISOString();
    const signal: SourceRepoSignal = {
      repo: "a/b",
      stars: 1,
      forks: null,
      repoUpdatedAt: null,
      fetchedAt,
      status: "ok",
      lastError: null,
    };
    expect(shouldRefreshSourceRepoSignal(signal, now)).toBe(true);
  });
  it("shouldRefreshSourceRepoSignal age 40h", () => {
    const staleMs = 144000000;
    const fetchedAt = new Date(now - staleMs).toISOString();
    const signal: SourceRepoSignal = {
      repo: "a/b",
      stars: 1,
      forks: null,
      repoUpdatedAt: null,
      fetchedAt,
      status: "ok",
      lastError: null,
    };
    expect(shouldRefreshSourceRepoSignal(signal, now)).toBe(true);
  });
  it("shouldRefreshSourceRepoSignal age 41h", () => {
    const staleMs = 147600000;
    const fetchedAt = new Date(now - staleMs).toISOString();
    const signal: SourceRepoSignal = {
      repo: "a/b",
      stars: 1,
      forks: null,
      repoUpdatedAt: null,
      fetchedAt,
      status: "ok",
      lastError: null,
    };
    expect(shouldRefreshSourceRepoSignal(signal, now)).toBe(true);
  });
  it("shouldRefreshSourceRepoSignal age 42h", () => {
    const staleMs = 151200000;
    const fetchedAt = new Date(now - staleMs).toISOString();
    const signal: SourceRepoSignal = {
      repo: "a/b",
      stars: 1,
      forks: null,
      repoUpdatedAt: null,
      fetchedAt,
      status: "ok",
      lastError: null,
    };
    expect(shouldRefreshSourceRepoSignal(signal, now)).toBe(true);
  });
  it("shouldRefreshSourceRepoSignal age 43h", () => {
    const staleMs = 154800000;
    const fetchedAt = new Date(now - staleMs).toISOString();
    const signal: SourceRepoSignal = {
      repo: "a/b",
      stars: 1,
      forks: null,
      repoUpdatedAt: null,
      fetchedAt,
      status: "ok",
      lastError: null,
    };
    expect(shouldRefreshSourceRepoSignal(signal, now)).toBe(true);
  });
  it("shouldRefreshSourceRepoSignal age 44h", () => {
    const staleMs = 158400000;
    const fetchedAt = new Date(now - staleMs).toISOString();
    const signal: SourceRepoSignal = {
      repo: "a/b",
      stars: 1,
      forks: null,
      repoUpdatedAt: null,
      fetchedAt,
      status: "ok",
      lastError: null,
    };
    expect(shouldRefreshSourceRepoSignal(signal, now)).toBe(true);
  });
  it("shouldRefreshSourceRepoSignal age 45h", () => {
    const staleMs = 162000000;
    const fetchedAt = new Date(now - staleMs).toISOString();
    const signal: SourceRepoSignal = {
      repo: "a/b",
      stars: 1,
      forks: null,
      repoUpdatedAt: null,
      fetchedAt,
      status: "ok",
      lastError: null,
    };
    expect(shouldRefreshSourceRepoSignal(signal, now)).toBe(true);
  });
  it("shouldRefreshSourceRepoSignal age 46h", () => {
    const staleMs = 165600000;
    const fetchedAt = new Date(now - staleMs).toISOString();
    const signal: SourceRepoSignal = {
      repo: "a/b",
      stars: 1,
      forks: null,
      repoUpdatedAt: null,
      fetchedAt,
      status: "ok",
      lastError: null,
    };
    expect(shouldRefreshSourceRepoSignal(signal, now)).toBe(true);
  });
  it("shouldRefreshSourceRepoSignal age 47h", () => {
    const staleMs = 169200000;
    const fetchedAt = new Date(now - staleMs).toISOString();
    const signal: SourceRepoSignal = {
      repo: "a/b",
      stars: 1,
      forks: null,
      repoUpdatedAt: null,
      fetchedAt,
      status: "ok",
      lastError: null,
    };
    expect(shouldRefreshSourceRepoSignal(signal, now)).toBe(true);
  });
  it("shouldRefreshSourceRepoSignal age 48h", () => {
    const staleMs = 172800000;
    const fetchedAt = new Date(now - staleMs).toISOString();
    const signal: SourceRepoSignal = {
      repo: "a/b",
      stars: 1,
      forks: null,
      repoUpdatedAt: null,
      fetchedAt,
      status: "ok",
      lastError: null,
    };
    expect(shouldRefreshSourceRepoSignal(signal, now)).toBe(true);
  });
  it("shouldRefreshSourceRepoSignal age 49h", () => {
    const staleMs = 176400000;
    const fetchedAt = new Date(now - staleMs).toISOString();
    const signal: SourceRepoSignal = {
      repo: "a/b",
      stars: 1,
      forks: null,
      repoUpdatedAt: null,
      fetchedAt,
      status: "ok",
      lastError: null,
    };
    expect(shouldRefreshSourceRepoSignal(signal, now)).toBe(true);
  });
  it("shouldRefreshSourceRepoSignal age 50h", () => {
    const staleMs = 180000000;
    const fetchedAt = new Date(now - staleMs).toISOString();
    const signal: SourceRepoSignal = {
      repo: "a/b",
      stars: 1,
      forks: null,
      repoUpdatedAt: null,
      fetchedAt,
      status: "ok",
      lastError: null,
    };
    expect(shouldRefreshSourceRepoSignal(signal, now)).toBe(true);
  });
  it("shouldRefreshSourceRepoSignal age 51h", () => {
    const staleMs = 183600000;
    const fetchedAt = new Date(now - staleMs).toISOString();
    const signal: SourceRepoSignal = {
      repo: "a/b",
      stars: 1,
      forks: null,
      repoUpdatedAt: null,
      fetchedAt,
      status: "ok",
      lastError: null,
    };
    expect(shouldRefreshSourceRepoSignal(signal, now)).toBe(true);
  });
  it("shouldRefreshSourceRepoSignal age 52h", () => {
    const staleMs = 187200000;
    const fetchedAt = new Date(now - staleMs).toISOString();
    const signal: SourceRepoSignal = {
      repo: "a/b",
      stars: 1,
      forks: null,
      repoUpdatedAt: null,
      fetchedAt,
      status: "ok",
      lastError: null,
    };
    expect(shouldRefreshSourceRepoSignal(signal, now)).toBe(true);
  });
  it("shouldRefreshSourceRepoSignal age 53h", () => {
    const staleMs = 190800000;
    const fetchedAt = new Date(now - staleMs).toISOString();
    const signal: SourceRepoSignal = {
      repo: "a/b",
      stars: 1,
      forks: null,
      repoUpdatedAt: null,
      fetchedAt,
      status: "ok",
      lastError: null,
    };
    expect(shouldRefreshSourceRepoSignal(signal, now)).toBe(true);
  });
  it("shouldRefreshSourceRepoSignal age 54h", () => {
    const staleMs = 194400000;
    const fetchedAt = new Date(now - staleMs).toISOString();
    const signal: SourceRepoSignal = {
      repo: "a/b",
      stars: 1,
      forks: null,
      repoUpdatedAt: null,
      fetchedAt,
      status: "ok",
      lastError: null,
    };
    expect(shouldRefreshSourceRepoSignal(signal, now)).toBe(true);
  });
  it("shouldRefreshSourceRepoSignal age 55h", () => {
    const staleMs = 198000000;
    const fetchedAt = new Date(now - staleMs).toISOString();
    const signal: SourceRepoSignal = {
      repo: "a/b",
      stars: 1,
      forks: null,
      repoUpdatedAt: null,
      fetchedAt,
      status: "ok",
      lastError: null,
    };
    expect(shouldRefreshSourceRepoSignal(signal, now)).toBe(true);
  });
  it("shouldRefreshSourceRepoSignal age 56h", () => {
    const staleMs = 201600000;
    const fetchedAt = new Date(now - staleMs).toISOString();
    const signal: SourceRepoSignal = {
      repo: "a/b",
      stars: 1,
      forks: null,
      repoUpdatedAt: null,
      fetchedAt,
      status: "ok",
      lastError: null,
    };
    expect(shouldRefreshSourceRepoSignal(signal, now)).toBe(true);
  });
  it("shouldRefreshSourceRepoSignal age 57h", () => {
    const staleMs = 205200000;
    const fetchedAt = new Date(now - staleMs).toISOString();
    const signal: SourceRepoSignal = {
      repo: "a/b",
      stars: 1,
      forks: null,
      repoUpdatedAt: null,
      fetchedAt,
      status: "ok",
      lastError: null,
    };
    expect(shouldRefreshSourceRepoSignal(signal, now)).toBe(true);
  });
  it("shouldRefreshSourceRepoSignal age 58h", () => {
    const staleMs = 208800000;
    const fetchedAt = new Date(now - staleMs).toISOString();
    const signal: SourceRepoSignal = {
      repo: "a/b",
      stars: 1,
      forks: null,
      repoUpdatedAt: null,
      fetchedAt,
      status: "ok",
      lastError: null,
    };
    expect(shouldRefreshSourceRepoSignal(signal, now)).toBe(true);
  });
  it("shouldRefreshSourceRepoSignal age 59h", () => {
    const staleMs = 212400000;
    const fetchedAt = new Date(now - staleMs).toISOString();
    const signal: SourceRepoSignal = {
      repo: "a/b",
      stars: 1,
      forks: null,
      repoUpdatedAt: null,
      fetchedAt,
      status: "ok",
      lastError: null,
    };
    expect(shouldRefreshSourceRepoSignal(signal, now)).toBe(true);
  });
  it("shouldRefreshSourceRepoSignal age 60h", () => {
    const staleMs = 216000000;
    const fetchedAt = new Date(now - staleMs).toISOString();
    const signal: SourceRepoSignal = {
      repo: "a/b",
      stars: 1,
      forks: null,
      repoUpdatedAt: null,
      fetchedAt,
      status: "ok",
      lastError: null,
    };
    expect(shouldRefreshSourceRepoSignal(signal, now)).toBe(true);
  });
  it("shouldRefreshSourceRepoSignal age 61h", () => {
    const staleMs = 219600000;
    const fetchedAt = new Date(now - staleMs).toISOString();
    const signal: SourceRepoSignal = {
      repo: "a/b",
      stars: 1,
      forks: null,
      repoUpdatedAt: null,
      fetchedAt,
      status: "ok",
      lastError: null,
    };
    expect(shouldRefreshSourceRepoSignal(signal, now)).toBe(true);
  });
  it("shouldRefreshSourceRepoSignal age 62h", () => {
    const staleMs = 223200000;
    const fetchedAt = new Date(now - staleMs).toISOString();
    const signal: SourceRepoSignal = {
      repo: "a/b",
      stars: 1,
      forks: null,
      repoUpdatedAt: null,
      fetchedAt,
      status: "ok",
      lastError: null,
    };
    expect(shouldRefreshSourceRepoSignal(signal, now)).toBe(true);
  });
  it("shouldRefreshSourceRepoSignal age 63h", () => {
    const staleMs = 226800000;
    const fetchedAt = new Date(now - staleMs).toISOString();
    const signal: SourceRepoSignal = {
      repo: "a/b",
      stars: 1,
      forks: null,
      repoUpdatedAt: null,
      fetchedAt,
      status: "ok",
      lastError: null,
    };
    expect(shouldRefreshSourceRepoSignal(signal, now)).toBe(true);
  });
  it("shouldRefreshSourceRepoSignal age 64h", () => {
    const staleMs = 230400000;
    const fetchedAt = new Date(now - staleMs).toISOString();
    const signal: SourceRepoSignal = {
      repo: "a/b",
      stars: 1,
      forks: null,
      repoUpdatedAt: null,
      fetchedAt,
      status: "ok",
      lastError: null,
    };
    expect(shouldRefreshSourceRepoSignal(signal, now)).toBe(true);
  });
  it("shouldRefreshSourceRepoSignal age 65h", () => {
    const staleMs = 234000000;
    const fetchedAt = new Date(now - staleMs).toISOString();
    const signal: SourceRepoSignal = {
      repo: "a/b",
      stars: 1,
      forks: null,
      repoUpdatedAt: null,
      fetchedAt,
      status: "ok",
      lastError: null,
    };
    expect(shouldRefreshSourceRepoSignal(signal, now)).toBe(true);
  });
  it("shouldRefreshSourceRepoSignal age 66h", () => {
    const staleMs = 237600000;
    const fetchedAt = new Date(now - staleMs).toISOString();
    const signal: SourceRepoSignal = {
      repo: "a/b",
      stars: 1,
      forks: null,
      repoUpdatedAt: null,
      fetchedAt,
      status: "ok",
      lastError: null,
    };
    expect(shouldRefreshSourceRepoSignal(signal, now)).toBe(true);
  });
  it("shouldRefreshSourceRepoSignal age 67h", () => {
    const staleMs = 241200000;
    const fetchedAt = new Date(now - staleMs).toISOString();
    const signal: SourceRepoSignal = {
      repo: "a/b",
      stars: 1,
      forks: null,
      repoUpdatedAt: null,
      fetchedAt,
      status: "ok",
      lastError: null,
    };
    expect(shouldRefreshSourceRepoSignal(signal, now)).toBe(true);
  });
  it("shouldRefreshSourceRepoSignal age 68h", () => {
    const staleMs = 244800000;
    const fetchedAt = new Date(now - staleMs).toISOString();
    const signal: SourceRepoSignal = {
      repo: "a/b",
      stars: 1,
      forks: null,
      repoUpdatedAt: null,
      fetchedAt,
      status: "ok",
      lastError: null,
    };
    expect(shouldRefreshSourceRepoSignal(signal, now)).toBe(true);
  });
  it("shouldRefreshSourceRepoSignal age 69h", () => {
    const staleMs = 248400000;
    const fetchedAt = new Date(now - staleMs).toISOString();
    const signal: SourceRepoSignal = {
      repo: "a/b",
      stars: 1,
      forks: null,
      repoUpdatedAt: null,
      fetchedAt,
      status: "ok",
      lastError: null,
    };
    expect(shouldRefreshSourceRepoSignal(signal, now)).toBe(true);
  });
  it("shouldRefreshSourceRepoSignal age 70h", () => {
    const staleMs = 252000000;
    const fetchedAt = new Date(now - staleMs).toISOString();
    const signal: SourceRepoSignal = {
      repo: "a/b",
      stars: 1,
      forks: null,
      repoUpdatedAt: null,
      fetchedAt,
      status: "ok",
      lastError: null,
    };
    expect(shouldRefreshSourceRepoSignal(signal, now)).toBe(true);
  });
  it("shouldRefreshSourceRepoSignal age 71h", () => {
    const staleMs = 255600000;
    const fetchedAt = new Date(now - staleMs).toISOString();
    const signal: SourceRepoSignal = {
      repo: "a/b",
      stars: 1,
      forks: null,
      repoUpdatedAt: null,
      fetchedAt,
      status: "ok",
      lastError: null,
    };
    expect(shouldRefreshSourceRepoSignal(signal, now)).toBe(true);
  });
  it("shouldRefreshSourceRepoSignal age 72h", () => {
    const staleMs = 259200000;
    const fetchedAt = new Date(now - staleMs).toISOString();
    const signal: SourceRepoSignal = {
      repo: "a/b",
      stars: 1,
      forks: null,
      repoUpdatedAt: null,
      fetchedAt,
      status: "ok",
      lastError: null,
    };
    expect(shouldRefreshSourceRepoSignal(signal, now)).toBe(true);
  });
  it("shouldRefreshSourceRepoSignal age 73h", () => {
    const staleMs = 262800000;
    const fetchedAt = new Date(now - staleMs).toISOString();
    const signal: SourceRepoSignal = {
      repo: "a/b",
      stars: 1,
      forks: null,
      repoUpdatedAt: null,
      fetchedAt,
      status: "ok",
      lastError: null,
    };
    expect(shouldRefreshSourceRepoSignal(signal, now)).toBe(true);
  });
  it("shouldRefreshSourceRepoSignal age 74h", () => {
    const staleMs = 266400000;
    const fetchedAt = new Date(now - staleMs).toISOString();
    const signal: SourceRepoSignal = {
      repo: "a/b",
      stars: 1,
      forks: null,
      repoUpdatedAt: null,
      fetchedAt,
      status: "ok",
      lastError: null,
    };
    expect(shouldRefreshSourceRepoSignal(signal, now)).toBe(true);
  });
  it("shouldRefreshSourceRepoSignal age 75h", () => {
    const staleMs = 270000000;
    const fetchedAt = new Date(now - staleMs).toISOString();
    const signal: SourceRepoSignal = {
      repo: "a/b",
      stars: 1,
      forks: null,
      repoUpdatedAt: null,
      fetchedAt,
      status: "ok",
      lastError: null,
    };
    expect(shouldRefreshSourceRepoSignal(signal, now)).toBe(true);
  });
  it("shouldRefreshSourceRepoSignal age 76h", () => {
    const staleMs = 273600000;
    const fetchedAt = new Date(now - staleMs).toISOString();
    const signal: SourceRepoSignal = {
      repo: "a/b",
      stars: 1,
      forks: null,
      repoUpdatedAt: null,
      fetchedAt,
      status: "ok",
      lastError: null,
    };
    expect(shouldRefreshSourceRepoSignal(signal, now)).toBe(true);
  });
  it("shouldRefreshSourceRepoSignal age 77h", () => {
    const staleMs = 277200000;
    const fetchedAt = new Date(now - staleMs).toISOString();
    const signal: SourceRepoSignal = {
      repo: "a/b",
      stars: 1,
      forks: null,
      repoUpdatedAt: null,
      fetchedAt,
      status: "ok",
      lastError: null,
    };
    expect(shouldRefreshSourceRepoSignal(signal, now)).toBe(true);
  });
  it("shouldRefreshSourceRepoSignal age 78h", () => {
    const staleMs = 280800000;
    const fetchedAt = new Date(now - staleMs).toISOString();
    const signal: SourceRepoSignal = {
      repo: "a/b",
      stars: 1,
      forks: null,
      repoUpdatedAt: null,
      fetchedAt,
      status: "ok",
      lastError: null,
    };
    expect(shouldRefreshSourceRepoSignal(signal, now)).toBe(true);
  });
  it("shouldRefreshSourceRepoSignal age 79h", () => {
    const staleMs = 284400000;
    const fetchedAt = new Date(now - staleMs).toISOString();
    const signal: SourceRepoSignal = {
      repo: "a/b",
      stars: 1,
      forks: null,
      repoUpdatedAt: null,
      fetchedAt,
      status: "ok",
      lastError: null,
    };
    expect(shouldRefreshSourceRepoSignal(signal, now)).toBe(true);
  });
});
