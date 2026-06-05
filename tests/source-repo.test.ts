import { describe, expect, it } from "vitest";

import { parseGitHubRepoUrl } from "@heyclaude/registry/source-repo";

describe("parseGitHubRepoUrl (canonical source-repo parser)", () => {
  const canonical = {
    host: "github.com",
    owner: "OpenAI",
    repo: "whisper",
    url: "https://github.com/OpenAI/whisper",
  };

  it("parses the common https forms to the same canonical repo", () => {
    for (const input of [
      "https://github.com/OpenAI/whisper",
      "https://github.com/OpenAI/whisper.git",
      "https://github.com/OpenAI/whisper/",
      "http://github.com/OpenAI/whisper",
      "https://www.github.com/OpenAI/whisper",
      "https://github.com/OpenAI/whisper/tree/main/src",
      "https://github.com/OpenAI/whisper?tab=readme#install",
    ]) {
      expect(parseGitHubRepoUrl(input)).toEqual(canonical);
    }
  });

  it("parses the scp/ssh short form and the git+/git:// schemes", () => {
    for (const input of [
      "git@github.com:OpenAI/whisper.git",
      "git@github.com:OpenAI/whisper",
      "ssh://git@github.com/OpenAI/whisper.git",
      "git+https://github.com/OpenAI/whisper.git",
      "git://github.com/OpenAI/whisper.git",
    ]) {
      expect(parseGitHubRepoUrl(input)).toEqual(canonical);
    }
  });

  it("preserves owner/repo case in the parsed result", () => {
    expect(
      parseGitHubRepoUrl("https://github.com/Microsoft/TypeScript"),
    ).toEqual({
      host: "github.com",
      owner: "Microsoft",
      repo: "TypeScript",
      url: "https://github.com/Microsoft/TypeScript",
    });
  });

  it("rejects non-github hosts and other github subdomains", () => {
    expect(parseGitHubRepoUrl("https://example.com/OpenAI/whisper")).toBeNull();
    expect(
      parseGitHubRepoUrl("https://gist.github.com/OpenAI/whisper"),
    ).toBeNull();
    expect(
      parseGitHubRepoUrl(
        "https://raw.githubusercontent.com/OpenAI/whisper/main/x",
      ),
    ).toBeNull();
  });

  it("rejects reserved GitHub product roots and malformed input", () => {
    expect(parseGitHubRepoUrl("https://github.com/sponsors/OpenAI")).toBeNull();
    expect(parseGitHubRepoUrl("https://github.com/orgs/OpenAI")).toBeNull();
    expect(parseGitHubRepoUrl("https://github.com/OpenAI")).toBeNull();
    expect(parseGitHubRepoUrl("https://github.com/Open AI/whisper")).toBeNull();
    expect(parseGitHubRepoUrl("")).toBeNull();
    expect(parseGitHubRepoUrl(null)).toBeNull();
    expect(parseGitHubRepoUrl("not a url")).toBeNull();
  });
});
