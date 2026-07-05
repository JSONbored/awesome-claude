import { describe, expect, it } from "vitest";

import { parseGitHubRepoUrl } from "@heyclaude/registry/source-repo";

describe("source-repo re-export surface", () => {
  it("keeps the public import path wired to the extracted lib", () => {
    expect(parseGitHubRepoUrl("https://github.com/OpenAI/whisper")).toEqual({
      host: "github.com",
      owner: "OpenAI",
      repo: "whisper",
      url: "https://github.com/OpenAI/whisper",
    });
    expect(parseGitHubRepoUrl("https://github.com/sponsors/OpenAI")).toBeNull();
  });
});
