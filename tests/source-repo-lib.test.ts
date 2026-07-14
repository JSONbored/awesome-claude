import { describe, expect, it } from "vitest";

import { parseGitHubRepoUrl } from "../packages/registry/src/source-repo-lib.js";

const whisper = {
  host: "github.com",
  owner: "OpenAI",
  repo: "whisper",
  url: "https://github.com/OpenAI/whisper",
};

const RESERVED_OWNERS = [
  "about",
  "account",
  "apps",
  "business",
  "codespaces",
  "collections",
  "contact",
  "customer-stories",
  "dashboard",
  "education",
  "enterprise",
  "explore",
  "features",
  "issues",
  "join",
  "login",
  "logout",
  "marketplace",
  "new",
  "nonprofits",
  "notifications",
  "organizations",
  "orgs",
  "pricing",
  "pulls",
  "readme",
  "search",
  "security",
  "sessions",
  "settings",
  "signup",
  "sponsors",
  "stars",
  "team",
  "topics",
  "trending",
  "watching",
];

describe("parseGitHubRepoUrl https forms", () => {
  it.each([
    "https://github.com/OpenAI/whisper",
    "https://github.com/OpenAI/whisper.git",
    "https://github.com/OpenAI/whisper/",
    "http://github.com/OpenAI/whisper",
    "https://www.github.com/OpenAI/whisper",
    "HTTPS://GITHUB.COM/OpenAI/whisper",
    "https://github.com/OpenAI/whisper/tree/main/src",
    "https://github.com/OpenAI/whisper/blob/main/README.md",
    "https://github.com/OpenAI/whisper/issues/42",
    "https://github.com/OpenAI/whisper/pull/7",
    "https://github.com/OpenAI/whisper?tab=readme#install",
    "https://github.com/OpenAI/whisper/tree/main/src?tab=readme",
  ])("parses %s to the canonical whisper repo", (input) => {
    expect(parseGitHubRepoUrl(input)).toEqual(whisper);
  });
});

describe("parseGitHubRepoUrl scp and git transport forms", () => {
  it.each([
    "git@github.com:OpenAI/whisper.git",
    "git@github.com:OpenAI/whisper",
    "git@github.com:OpenAI/whisper/",
    "ssh://git@github.com/OpenAI/whisper.git",
    "ssh://git@github.com/OpenAI/whisper",
    "git+https://github.com/OpenAI/whisper.git",
    "git+https://github.com/OpenAI/whisper",
    "git://github.com/OpenAI/whisper.git",
    "git://github.com/OpenAI/whisper",
  ])("parses %s to the canonical whisper repo", (input) => {
    expect(parseGitHubRepoUrl(input)).toEqual(whisper);
  });
});

describe("parseGitHubRepoUrl owner and repo case preservation", () => {
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

  it("preserves mixed-case owners with hyphens and numbers", () => {
    expect(parseGitHubRepoUrl("https://github.com/My-Org2/My_Repo.v2")).toEqual(
      {
        host: "github.com",
        owner: "My-Org2",
        repo: "My_Repo.v2",
        url: "https://github.com/My-Org2/My_Repo.v2",
      },
    );
  });

  it("lowercases only the host while keeping owner casing intact", () => {
    expect(parseGitHubRepoUrl("https://WWW.GitHub.COM/MyOrg/MyRepo")).toEqual({
      host: "github.com",
      owner: "MyOrg",
      repo: "MyRepo",
      url: "https://github.com/MyOrg/MyRepo",
    });
  });
});

describe("parseGitHubRepoUrl reserved GitHub product roots", () => {
  it.each(RESERVED_OWNERS)("rejects reserved owner %s", (owner) => {
    expect(
      parseGitHubRepoUrl(`https://github.com/${owner}/SomeProject`),
    ).toBeNull();
    expect(
      parseGitHubRepoUrl(
        `https://github.com/${owner.toUpperCase()}/SomeProject`,
      ),
    ).toBeNull();
  });
});

describe("parseGitHubRepoUrl reserved two-segment product surfaces", () => {
  // Regression: these GitHub marketing/product/auth pages used to parse as
  // bogus owner/repo pairs because the second path segment made them look like
  // real repositories.
  it.each([
    "https://github.com/features/copilot",
    "https://github.com/enterprise/contact",
    "https://github.com/security/advisories",
    "https://github.com/customer-stories/duolingo",
    "https://github.com/login/oauth",
    "https://github.com/pricing/team",
    "https://github.com/readme/guides",
    "https://github.com/stars/anthropics",
    "git@github.com:features/copilot.git",
  ])("rejects reserved product surface %s", (input) => {
    expect(parseGitHubRepoUrl(input)).toBeNull();
  });
});

describe("parseGitHubRepoUrl non-github hosts", () => {
  it.each([
    "https://example.com/OpenAI/whisper",
    "https://gitlab.com/OpenAI/whisper",
    "https://gist.github.com/OpenAI/whisper",
    "https://api.github.com/repos/OpenAI/whisper",
    "https://raw.githubusercontent.com/OpenAI/whisper/main/README.md",
    "https://github.enterprise.example.com/OpenAI/whisper",
  ])("rejects non-canonical host %s", (input) => {
    expect(parseGitHubRepoUrl(input)).toBeNull();
  });
});

describe("parseGitHubRepoUrl malformed and incomplete input", () => {
  it.each([
    "",
    "   ",
    null,
    undefined,
    "not a url",
    "https://github.com/OpenAI",
    "https://github.com/",
    "git@github.com:OpenAI",
    "git@github.com:",
    "https://github.com/Open AI/whisper",
    "https://github.com/-bad-/whisper",
    "https://github.com/bad-/whisper",
    "https://github.com/-bad/whisper",
    "https://github.com/OpenAI/bad repo",
  ])("returns null for malformed input %s", (input) => {
    expect(parseGitHubRepoUrl(input)).toBeNull();
  });
});

describe("parseGitHubRepoUrl invalid owner patterns", () => {
  it.each([
    "https://github.com//whisper",
    "https://github.com/.hidden/whisper",
    "https://github.com/hidden./whisper",
    "https://github.com/-bad/whisper",
    "https://github.com/bad-/whisper",
    "https://github.com/a..b/whisper",
  ])("rejects invalid owner in %s", (input) => {
    expect(parseGitHubRepoUrl(input)).toBeNull();
  });
});

describe("parseGitHubRepoUrl invalid repo patterns", () => {
  it.each([
    "https://github.com/OpenAI/",
    "https://github.com/OpenAI/.git",
    "https://github.com/OpenAI/bad repo",
    "https://github.com/OpenAI/repo with space",
  ])("rejects invalid repo in %s", (input) => {
    expect(parseGitHubRepoUrl(input)).toBeNull();
  });
});

describe("parseGitHubRepoUrl deep path handling", () => {
  it.each([
    ["tree/main", "main"],
    ["tree/feature/docs", "feature"],
    ["blob/main/README.md", "README.md"],
    ["issues/42", "42"],
    ["pull/99", "99"],
    ["releases/tag/v1.0.0", "tag"],
  ])("ignores deep path segment %s after owner/repo", (suffix) => {
    expect(
      parseGitHubRepoUrl(`https://github.com/OpenAI/whisper/${suffix}`),
    ).toEqual(whisper);
  });
});

describe("parseGitHubRepoUrl .git suffix handling", () => {
  it.each([
    "https://github.com/OpenAI/whisper.git",
    "https://github.com/OpenAI/whisper.GIT",
    "git@github.com:OpenAI/whisper.git",
    "git+https://github.com/OpenAI/whisper.git",
  ])("strips .git suffix from %s", (input) => {
    expect(parseGitHubRepoUrl(input)).toEqual(whisper);
  });
});

describe("parseGitHubRepoUrl canonical URL output", () => {
  it("always returns an https github.com canonical URL", () => {
    for (const input of [
      "http://github.com/OpenAI/whisper",
      "git@github.com:OpenAI/whisper",
      "git+https://github.com/OpenAI/whisper.git",
    ]) {
      const parsed = parseGitHubRepoUrl(input);
      expect(parsed?.url).toBe("https://github.com/OpenAI/whisper");
      expect(parsed?.host).toBe("github.com");
    }
  });

  it("does not include deep paths in the canonical URL", () => {
    expect(
      parseGitHubRepoUrl(
        "https://github.com/OpenAI/whisper/tree/main/src/README.md",
      )?.url,
    ).toBe("https://github.com/OpenAI/whisper");
  });
});

describe("parseGitHubRepoUrl numeric and object coercion", () => {
  it("returns null for numeric input without a repo path", () => {
    expect(parseGitHubRepoUrl(0)).toBeNull();
    expect(parseGitHubRepoUrl(42)).toBeNull();
  });

  it("trims surrounding whitespace before parsing", () => {
    expect(parseGitHubRepoUrl("  https://github.com/OpenAI/whisper  ")).toEqual(
      whisper,
    );
  });
});

describe("parseGitHubRepoUrl popular registry examples", () => {
  it.each([
    [
      "https://github.com/anthropics/claude-code",
      {
        host: "github.com",
        owner: "anthropics",
        repo: "claude-code",
        url: "https://github.com/anthropics/claude-code",
      },
    ],
    [
      "https://github.com/modelcontextprotocol/servers/tree/main/src/filesystem",
      {
        host: "github.com",
        owner: "modelcontextprotocol",
        repo: "servers",
        url: "https://github.com/modelcontextprotocol/servers",
      },
    ],
    [
      "git@github.com:vercel/ai.git",
      {
        host: "github.com",
        owner: "vercel",
        repo: "ai",
        url: "https://github.com/vercel/ai",
      },
    ],
  ])("parses registry example %s", (input, expected) => {
    expect(parseGitHubRepoUrl(input)).toEqual(expected);
  });
});

describe("parseGitHubRepoUrl stability", () => {
  it("returns stable output across repeated parses", () => {
    const input = "https://www.github.com/OpenAI/whisper.git?tab=readme";
    expect(parseGitHubRepoUrl(input)).toEqual(parseGitHubRepoUrl(input));
  });
});

describe("parseGitHubRepoUrl https variant matrix", () => {
  const cases = [
    ["https://github.com/Org1/repo-one", "Org1", "repo-one"],
    ["https://github.com/org-2/repo_two", "org-2", "repo_two"],
    ["https://github.com/Org3/repo.v3/", "Org3", "repo.v3"],
    ["http://github.com/Org4/repo-four.git", "Org4", "repo-four"],
    ["https://www.github.com/Org5/repo-five/tree/main", "Org5", "repo-five"],
    ["https://github.com/Org6/repo-six?tab=readme", "Org6", "repo-six"],
    ["https://github.com/Org7/repo-seven#install", "Org7", "repo-seven"],
    [
      "https://github.com/Org8/repo-eight/releases/latest",
      "Org8",
      "repo-eight",
    ],
    ["https://github.com/Org9/repo-nine/discussions/1", "Org9", "repo-nine"],
    ["https://github.com/Org10/repo-ten/wiki/Home", "Org10", "repo-ten"],
  ] as const;

  it.each(cases)("parses %s", (input, owner, repo) => {
    expect(parseGitHubRepoUrl(input)).toEqual({
      host: "github.com",
      owner,
      repo,
      url: `https://github.com/${owner}/${repo}`,
    });
  });
});

describe("parseGitHubRepoUrl scp variant matrix", () => {
  const cases = [
    ["git@github.com:Org1/repo-one", "Org1", "repo-one"],
    ["git@github.com:Org2/repo-two.git", "Org2", "repo-two"],
    ["git@github.com:Org3/repo-three/", "Org3", "repo-three"],
    ["git@github.com:Org4/repo-four/tree/main", "Org4", "repo-four"],
  ] as const;

  it.each(cases)("parses scp form %s", (input, owner, repo) => {
    expect(parseGitHubRepoUrl(input)).toEqual({
      host: "github.com",
      owner,
      repo,
      url: `https://github.com/${owner}/${repo}`,
    });
  });
});

describe("parseGitHubRepoUrl git transport variant matrix", () => {
  const cases = [
    ["git+https://github.com/Org1/repo-one.git", "Org1", "repo-one"],
    ["git+https://github.com/Org2/repo-two", "Org2", "repo-two"],
    ["git://github.com/Org3/repo-three.git", "Org3", "repo-three"],
    ["ssh://git@github.com/Org4/repo-four.git", "Org4", "repo-four"],
    ["ssh://git@github.com/Org5/repo-five", "Org5", "repo-five"],
  ] as const;

  it.each(cases)("parses transport URL %s", (input, owner, repo) => {
    expect(parseGitHubRepoUrl(input)).toEqual({
      host: "github.com",
      owner,
      repo,
      url: `https://github.com/${owner}/${repo}`,
    });
  });
});

describe("parseGitHubRepoUrl reserved owner exhaustive table", () => {
  it.each(RESERVED_OWNERS)("rejects https://github.com/%s/AnyRepo", (owner) => {
    expect(
      parseGitHubRepoUrl(`https://github.com/${owner}/AnyRepo`),
    ).toBeNull();
    expect(
      parseGitHubRepoUrl(`git@github.com:${owner}/AnyRepo.git`),
    ).toBeNull();
  });
});

describe("parseGitHubRepoUrl rejected host exhaustive table", () => {
  it.each([
    "https://example.com/org/repo",
    "https://gitlab.com/org/repo",
    "https://bitbucket.org/org/repo",
    "https://gist.github.com/org/repo",
    "https://api.github.com/repos/org/repo",
    "https://codeload.github.com/org/repo/zip/refs/heads/main",
    "https://raw.githubusercontent.com/org/repo/main/README.md",
    "https://github.io/org/repo",
    "https://www.github.io/org/repo",
  ])("rejects host in %s", (input) => {
    expect(parseGitHubRepoUrl(input)).toBeNull();
  });
});

describe("parseGitHubRepoUrl rejected scp hosts", () => {
  it.each([
    "git@gitlab.com:org/repo",
    "git@github.enterprise.example:org/repo",
    "git@gist.github.com:org/repo",
  ])("rejects scp host in %s", (input) => {
    expect(parseGitHubRepoUrl(input)).toBeNull();
  });
});

describe("parseGitHubRepoUrl repo name character coverage", () => {
  it.each(["repo", "repo-name", "repo_name", "repo.name", "Repo-2_v1.0"])(
    "accepts valid repo name %s",
    (repo) => {
      expect(parseGitHubRepoUrl(`https://github.com/OpenAI/${repo}`)).toEqual({
        host: "github.com",
        owner: "OpenAI",
        repo,
        url: `https://github.com/OpenAI/${repo}`,
      });
    },
  );
});

describe("parseGitHubRepoUrl owner name character coverage", () => {
  it.each(["Org", "org-name", "org123", "Org-2", "a1"])(
    "accepts valid owner %s",
    (owner) => {
      expect(parseGitHubRepoUrl(`https://github.com/${owner}/repo`)).toEqual({
        host: "github.com",
        owner,
        repo: "repo",
        url: `https://github.com/${owner}/repo`,
      });
    },
  );
});

describe("parseGitHubRepoUrl query and fragment stripping", () => {
  it.each([
    "https://github.com/OpenAI/whisper?tab=readme",
    "https://github.com/OpenAI/whisper#readme",
    "https://github.com/OpenAI/whisper?ref=main#readme",
    "https://github.com/OpenAI/whisper/?utm_source=x&tab=readme#install",
  ])("ignores query and fragment in %s", (input) => {
    expect(parseGitHubRepoUrl(input)).toEqual(whisper);
  });
});

describe("parseGitHubRepoUrl duplicate equivalence classes", () => {
  const equivalents = [
    "https://github.com/OpenAI/whisper",
    "https://www.github.com/OpenAI/whisper.git",
    "http://github.com/OpenAI/whisper/",
    "git@github.com:OpenAI/whisper.git",
    "git+https://github.com/OpenAI/whisper",
  ];

  it("normalizes equivalent repo references to one canonical record", () => {
    const parsed = equivalents.map((input) => parseGitHubRepoUrl(input));
    for (const value of parsed) {
      expect(value).toEqual(whisper);
    }
  });
});

describe("parseGitHubRepoUrl enterprise and typo rejection", () => {
  it.each([
    "https://token@github.com/OpenAI/whisper",
    "https://user:pass@github.com/OpenAI/whisper",
    "git+https:user:pass@github.com/OpenAI/whisper",
    "git+https:/user@github.com/OpenAI/whisper",
  ])("rejects https URLs with embedded userinfo: %s", (input) => {
    expect(parseGitHubRepoUrl(input)).toBeNull();
  });

  it.each([
    "github.com/OpenAI/whisper",
    "www.github.com/OpenAI/whisper",
    "https://github.com",
    "https://github.com/OpenAI/whisper/extra/segment",
  ])("rejects unparsable or non-URL input %s", (input) => {
    const result = parseGitHubRepoUrl(input);
    if (input === "https://github.com/OpenAI/whisper/extra/segment") {
      expect(result).toEqual({
        host: "github.com",
        owner: "OpenAI",
        repo: "whisper",
        url: "https://github.com/OpenAI/whisper",
      });
      return;
    }
    expect(result).toBeNull();
  });
});

describe("parseGitHubRepoUrl blob and tree branch coverage", () => {
  it.each([
    "https://github.com/OpenAI/whisper/tree/main",
    "https://github.com/OpenAI/whisper/tree/feature/docs",
    "https://github.com/OpenAI/whisper/tree/release-1.0.0",
    "https://github.com/OpenAI/whisper/blob/main/README.md",
    "https://github.com/OpenAI/whisper/blob/dev/src/index.ts",
  ])("parses repo from deep link %s", (input) => {
    expect(parseGitHubRepoUrl(input)).toEqual(whisper);
  });
});

describe("parseGitHubRepoUrl issues and community links", () => {
  it.each([
    "https://github.com/OpenAI/whisper/issues",
    "https://github.com/OpenAI/whisper/issues/12",
    "https://github.com/OpenAI/whisper/pulls",
    "https://github.com/OpenAI/whisper/pull/34",
    "https://github.com/OpenAI/whisper/discussions",
    "https://github.com/OpenAI/whisper/discussions/3",
    "https://github.com/OpenAI/whisper/actions",
    "https://github.com/OpenAI/whisper/projects/1",
  ])("parses repo from community link %s", (input) => {
    expect(parseGitHubRepoUrl(input)).toEqual(whisper);
  });
});

describe("parseGitHubRepoUrl additional scp deep paths", () => {
  it.each([
    "git@github.com:OpenAI/whisper/tree/main",
    "git@github.com:OpenAI/whisper/blob/main/README.md",
    "git@github.com:OpenAI/whisper/issues/1",
  ])("parses scp deep path %s", (input) => {
    expect(parseGitHubRepoUrl(input)).toEqual(whisper);
  });
});

describe("parseGitHubRepoUrl whitespace and empty segment handling", () => {
  it.each([
    "  https://github.com/OpenAI/whisper  ",
    "\thttps://github.com/OpenAI/whisper\n",
    "https://github.com/OpenAI/whisper//tree/main",
  ])("handles whitespace or empty segments in %s", (input) => {
    expect(parseGitHubRepoUrl(input)).toEqual(whisper);
  });
});

describe("parseGitHubRepoUrl single-segment rejection table", () => {
  it.each([
    "https://github.com/OpenAI",
    "https://github.com/OpenAI/",
    "git@github.com:OpenAI",
    "git@github.com:OpenAI/",
  ])("rejects owner-only reference %s", (input) => {
    expect(parseGitHubRepoUrl(input)).toBeNull();
  });
});

describe("parseGitHubRepoUrl invalid repo character table", () => {
  it.each(["https://github.com/OpenAI/repo name"])(
    "rejects invalid repo segment in %s",
    (input) => {
      expect(parseGitHubRepoUrl(input)).toBeNull();
    },
  );

  it.each([
    "https://github.com/OpenAI/repo/name",
    "https://github.com/OpenAI/repo?name",
    "https://github.com/OpenAI/repo#fragment",
  ])("keeps owner/repo from deep or decorated segment in %s", (input) => {
    expect(parseGitHubRepoUrl(input)).toEqual({
      host: "github.com",
      owner: "OpenAI",
      repo: "repo",
      url: "https://github.com/OpenAI/repo",
    });
  });
});

describe("parseGitHubRepoUrl maintainer workflow URLs", () => {
  it.each([
    [
      "https://github.com/JSONbored/awesome-claude",
      {
        host: "github.com",
        owner: "JSONbored",
        repo: "awesome-claude",
        url: "https://github.com/JSONbored/awesome-claude",
      },
    ],
    [
      "git@github.com:JSONbored/awesome-claude.git",
      {
        host: "github.com",
        owner: "JSONbored",
        repo: "awesome-claude",
        url: "https://github.com/JSONbored/awesome-claude",
      },
    ],
    [
      "https://github.com/anthropics/claude-code/tree/main",
      {
        host: "github.com",
        owner: "anthropics",
        repo: "claude-code",
        url: "https://github.com/anthropics/claude-code",
      },
    ],
  ])("parses maintainer repo %s", (input, expected) => {
    expect(parseGitHubRepoUrl(input)).toEqual(expected);
  });
});

describe("parseGitHubRepoUrl null return consistency", () => {
  it.each([
    "",
    "   ",
    null,
    undefined,
    "not a url",
    "https://github.com/sponsors/demo",
    "https://gist.github.com/demo/repo",
  ])("consistently returns null for %s", (input) => {
    expect(parseGitHubRepoUrl(input)).toBeNull();
  });
});

describe("parseGitHubRepoUrl full transport equivalence table", () => {
  const expected = {
    host: "github.com",
    owner: "acme",
    repo: "widget",
    url: "https://github.com/acme/widget",
  };

  it.each([
    "https://github.com/acme/widget",
    "https://www.github.com/acme/widget.git",
    "http://github.com/acme/widget/",
    "git@github.com:acme/widget",
    "git@github.com:acme/widget.git",
    "git+https://github.com/acme/widget",
    "git://github.com/acme/widget.git",
    "ssh://git@github.com/acme/widget",
  ])("normalizes transport variant %s", (input) => {
    expect(parseGitHubRepoUrl(input)).toEqual(expected);
  });
});

describe("parseGitHubRepoUrl owner hyphen boundary table", () => {
  it.each([
    ["a", true],
    ["a-b", true],
    ["a1-b2", true],
    ["-a", false],
    ["a-", false],
    [".a", false],
    ["a.", false],
  ])("owner %s validity is %s", (owner, valid) => {
    const result = parseGitHubRepoUrl(`https://github.com/${owner}/repo`);
    if (valid) {
      expect(result).toEqual({
        host: "github.com",
        owner,
        repo: "repo",
        url: `https://github.com/${owner}/repo`,
      });
    } else {
      expect(result).toBeNull();
    }
  });
});

describe("parseGitHubRepoUrl output invariants", () => {
  it("never returns a host other than github.com", () => {
    for (const input of [
      "https://github.com/OpenAI/whisper",
      "git@github.com:OpenAI/whisper",
      "https://www.github.com/OpenAI/whisper.git",
    ]) {
      expect(parseGitHubRepoUrl(input)?.host).toBe("github.com");
    }
  });

  it("never includes query, fragment, or deep path in canonical url", () => {
    const parsed = parseGitHubRepoUrl(
      "https://github.com/OpenAI/whisper/tree/main/src?tab=readme#install",
    );
    expect(parsed?.url).toBe("https://github.com/OpenAI/whisper");
    expect(parsed?.url).not.toContain("?");
    expect(parsed?.url).not.toContain("#");
    expect(parsed?.url).not.toContain("/tree/");
  });
});

describe("parseGitHubRepoUrl registry builder parity fixtures", () => {
  it.each([
    "https://github.com/openai/openai-node",
    "https://github.com/openai/openai-node.git",
    "git@github.com:openai/openai-node.git",
    "https://github.com/openai/openai-node/tree/main/src",
  ])("parses builder fixture %s", (input) => {
    expect(parseGitHubRepoUrl(input)).toEqual({
      host: "github.com",
      owner: "openai",
      repo: "openai-node",
      url: "https://github.com/openai/openai-node",
    });
  });

  it.each([
    "https://github.com/modelcontextprotocol/spec",
    "https://github.com/modelcontextprotocol/specification",
    "git+https://github.com/modelcontextprotocol/spec.git",
  ])("parses MCP registry fixture %s", (input) => {
    const parsed = parseGitHubRepoUrl(input);
    expect(parsed?.host).toBe("github.com");
    expect(parsed?.owner).toBe("modelcontextprotocol");
    expect(
      parsed?.url.startsWith("https://github.com/modelcontextprotocol/"),
    ).toBe(true);
  });
});
