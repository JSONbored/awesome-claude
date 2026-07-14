import { describe, expect, it } from "vitest";

import {
  compactCount,
  parseAbbreviatedCount,
  firstUsefulLine,
  extractConfigCommand,
  buildCollectionSequence,
  getPreviewLine,
  appendLabeledBlock,
  getCopyText,
  getDistributionBadges,
  getEntryAccessSummary,
} from "../packages/registry/src/presentation-lib.js";

function entry(overrides: Record<string, unknown> = {}) {
  return {
    category: "skills",
    slug: "demo",
    title: "Demo",
    description: "A demo entry",
    ...overrides,
  };
}

describe("count helpers", () => {
  it("compacts large counts", () => {
    expect(compactCount(999)).toBe("999");
    expect(compactCount(1000)).toBe("1.0k");
    expect(compactCount(1500)).toBe("1.5k");
    expect(compactCount(10000)).toBe("10k");
    expect(compactCount(12500)).toBe("13k");
  });

  it("parses abbreviated counts", () => {
    expect(parseAbbreviatedCount("")).toBeNull();
    expect(parseAbbreviatedCount(null)).toBeNull();
    expect(parseAbbreviatedCount("nope")).toBeNull();
    expect(parseAbbreviatedCount("1.5k")).toBe(1500);
    expect(parseAbbreviatedCount("2M")).toBe(2_000_000);
    expect(parseAbbreviatedCount("1b")).toBe(1_000_000_000);
    expect(parseAbbreviatedCount("42")).toBe(42);
    expect(parseAbbreviatedCount(" 3.2K ")).toBe(3200);
  });
});

describe("line and command helpers", () => {
  it("returns the first useful line", () => {
    expect(firstUsefulLine("")).toBe("");
    expect(firstUsefulLine(null)).toBe("");
    expect(
      firstUsefulLine(
        [
          "```",
          "# heading",
          "// comment",
          "/* block",
          "* star",
          "<!-- html",
          "{",
          "}",
          "[",
          "]",
          "",
          "  useful line  ",
          "second",
        ].join("\n"),
      ),
    ).toBe("useful line");
    expect(firstUsefulLine("# only\n```\n")).toBe("");
  });

  it("extracts config commands from json-like snippets", () => {
    expect(extractConfigCommand("")).toBe("");
    expect(extractConfigCommand('{"command":"npx demo"}')).toBe("npx demo");
    expect(extractConfigCommand("{'command':'uvx demo'}")).toBe("uvx demo");
    expect(extractConfigCommand("# comment\nnpx demo\n")).toBe("npx demo");
  });

  it("builds collection sequences", () => {
    expect(buildCollectionSequence({})).toBe("");
    expect(buildCollectionSequence({ items: [] })).toBe("");
    expect(
      buildCollectionSequence({
        items: [{ slug: "a" }, { slug: "b" }, { slug: "c" }, { slug: "d" }],
      }),
    ).toBe("`a` -> `b` -> `c`");
  });

  it("appends labeled blocks only for non-empty values", () => {
    const lines: string[] = [];
    appendLabeledBlock(lines, "Install", "");
    expect(lines).toEqual([]);
    appendLabeledBlock(lines, "Install", "npm i x");
    appendLabeledBlock(lines, "Usage", "run it");
    expect(lines).toEqual(["Install:", "npm i x", "", "Usage:", "run it"]);
  });
});

describe("getPreviewLine", () => {
  it("previews agents and rules from body or snippets", () => {
    expect(
      getPreviewLine(
        entry({
          category: "agents",
          body: "# Title\n\nDo the thing carefully.",
        }),
      ),
    ).toBe("Do the thing carefully.");
    expect(
      getPreviewLine(
        entry({
          category: "rules",
          copySnippet: "Always validate input.",
        }),
      ),
    ).toBe("Always validate input.");
    expect(
      getPreviewLine(
        entry({
          category: "agents",
          usageSnippet: "Use this agent for reviews.",
        }),
      ),
    ).toBe("Use this agent for reviews.");
    expect(getPreviewLine(entry({ category: "agents" }))).toBe(
      "Copy the full prompt and use it in Claude Code",
    );
  });

  it("previews hooks from install, config, or trigger", () => {
    expect(
      getPreviewLine(
        entry({
          category: "hooks",
          installCommand: "claude hooks install demo",
        }),
      ),
    ).toBe("claude hooks install demo");
    expect(
      getPreviewLine(
        entry({
          category: "hooks",
          configSnippet: '{"command":"node hook.js"}',
        }),
      ),
    ).toBe("node hook.js");
    expect(
      getPreviewLine(entry({ category: "hooks", trigger: "PreToolUse" })),
    ).toBe("Claude Code hook: PreToolUse");
  });

  it("previews statuslines from config or usage", () => {
    expect(
      getPreviewLine(
        entry({
          category: "statuslines",
          configSnippet: '{"command":"statusline"}',
        }),
      ),
    ).toBe("statusline");
    expect(
      getPreviewLine(
        entry({
          category: "statuslines",
          copySnippet: '{"command":"from-copy"}',
        }),
      ),
    ).toBe("from-copy");
    expect(
      getPreviewLine(
        entry({
          category: "statuslines",
          usageSnippet: "  show status  ",
        }),
      ),
    ).toBe("show status");
  });

  it("previews collections from sequence or usage", () => {
    expect(
      getPreviewLine(
        entry({
          category: "collections",
          items: [{ slug: "one" }, { slug: "two" }],
        }),
      ),
    ).toBe("Start with `one` -> `two`");
    expect(
      getPreviewLine(
        entry({
          category: "collections",
          usageSnippet: "  start here  ",
        }),
      ),
    ).toBe("start here");
  });

  it("previews skills, mcp, and commands from install or syntax", () => {
    for (const category of ["skills", "mcp", "commands"]) {
      expect(
        getPreviewLine(entry({ category, installCommand: "install me" })),
      ).toBe("install me");
      expect(getPreviewLine(entry({ category, commandSyntax: "/demo" }))).toBe(
        "/demo",
      );
      expect(
        getPreviewLine(
          entry({
            category,
            configSnippet: '{"command":"npx demo"}',
          }),
        ),
      ).toBe("npx demo");
    }
  });

  it("falls back through config, script, usage, copy, code, and links", () => {
    expect(
      getPreviewLine(
        entry({
          category: "tools",
          configSnippet: '{"command":"fallback"}',
        }),
      ),
    ).toBe("fallback");
    expect(
      getPreviewLine(
        entry({
          category: "tools",
          scriptBody: "# hi\nuseful script",
        }),
      ),
    ).toBe("useful script");
    expect(
      getPreviewLine(
        entry({
          category: "tools",
          usageSnippet: "# hi\nuseful usage",
        }),
      ),
    ).toBe("useful usage");
    // Whitespace-only usage snippets are truthy, so they win over copySnippet.
    expect(
      getPreviewLine(
        entry({
          category: "tools",
          usageSnippet: "   ",
          copySnippet: "# hi\nuseful copy",
        }),
      ),
    ).toBe("   ");
    expect(
      getPreviewLine(
        entry({
          category: "tools",
          copySnippet: "# hi\nuseful copy",
        }),
      ),
    ).toBe("useful copy");
    expect(
      getPreviewLine(
        entry({
          category: "tools",
          codeBlocks: [{ code: "first-line\nsecond" }],
        }),
      ),
    ).toBe("first-line");
    expect(
      getPreviewLine(
        entry({ category: "tools", documentationUrl: "https://x" }),
      ),
    ).toBe("See docs for setup");
    expect(
      getPreviewLine(entry({ category: "tools", downloadUrl: "https://x" })),
    ).toBe("Download the package");
    expect(
      getPreviewLine(entry({ category: "tools", githubUrl: "https://x" })),
    ).toBe("See GitHub for instructions");
    expect(getPreviewLine(entry({ category: "tools" }))).toBe(
      "Open this entry on HeyClaude",
    );
  });

  it("truncates long preview lines to 112 characters", () => {
    const long = "x".repeat(200);
    expect(
      getPreviewLine(entry({ category: "skills", installCommand: long })),
    ).toHaveLength(112);
  });

  it("falls through category cases when no category-specific preview exists", () => {
    expect(
      getPreviewLine(
        entry({
          category: "hooks",
          documentationUrl: "https://docs",
        }),
      ),
    ).toBe("See docs for setup");
    expect(
      getPreviewLine(
        entry({
          category: "statuslines",
          downloadUrl: "https://dl",
        }),
      ),
    ).toBe("Download the package");
    expect(
      getPreviewLine(
        entry({
          category: "collections",
          items: [],
          githubUrl: "https://gh",
        }),
      ),
    ).toBe("See GitHub for instructions");
    expect(
      getPreviewLine(
        entry({
          category: "skills",
          scriptBody: "# hi\nscript line",
        }),
      ),
    ).toBe("script line");
  });
});

describe("getCopyText", () => {
  it("copies agents, rules, and guides from body or snippets", () => {
    expect(getCopyText(entry({ category: "agents", body: "Agent body" }))).toBe(
      "Agent body",
    );
    expect(
      getCopyText(
        entry({ category: "rules", copySnippet: "Rule copy", body: "" }),
      ),
    ).toBe("Rule copy");
    expect(
      getCopyText(
        entry({
          category: "guides",
          usageSnippet: "Guide usage",
          body: "",
        }),
      ),
    ).toBe("Guide usage");
    expect(
      getCopyText(
        entry({ category: "guides", description: "Guide desc", body: "" }),
      ),
    ).toBe("Guide desc");
  });

  it("falls through the agents/rules snippet chain to usage then description", () => {
    expect(
      getCopyText(
        entry({
          category: "agents",
          body: "",
          copySnippet: "",
          usageSnippet: "Agent usage",
        }),
      ),
    ).toBe("Agent usage");
    expect(
      getCopyText(
        entry({
          category: "rules",
          body: "",
          copySnippet: "",
          usageSnippet: "",
          description: "Rule desc",
        }),
      ),
    ).toBe("Rule desc");
  });

  it("falls back to copySnippet / body for the hooks and skills asset blocks", () => {
    expect(
      getCopyText(
        entry({ category: "hooks", scriptBody: "", copySnippet: "Hook copy" }),
      ),
    ).toContain("Hook script:\nHook copy");
    expect(
      getCopyText(
        entry({
          category: "skills",
          scriptBody: "",
          copySnippet: "Skill copy",
        }),
      ),
    ).toContain("Asset:\nSkill copy");
    expect(
      getCopyText(
        entry({
          category: "statuslines",
          scriptBody: "",
          copySnippet: "",
          body: "Statusline body",
        }),
      ),
    ).toContain("Asset:\nStatusline body");
  });

  it("copies hooks as labeled blocks", () => {
    const text = getCopyText(
      entry({
        category: "hooks",
        trigger: "PreToolUse",
        installCommand: "install",
        configSnippet: "config",
        scriptBody: "script",
        body: "reference",
      }),
    );
    expect(text).toContain("Trigger:\nPreToolUse");
    expect(text).toContain("Install:\ninstall");
    expect(text).toContain("Claude config:\nconfig");
    expect(text).toContain("Hook script:\nscript");
    expect(text).toContain("Reference:\nreference");
  });

  it("copies mcp entries with install/config/usage fallbacks", () => {
    expect(
      getCopyText(
        entry({
          category: "mcp",
          commandSyntax: "npx demo",
          configSnippet: "cfg",
          usageSnippet: "use it",
        }),
      ),
    ).toContain("Install:\nnpx demo");
    expect(
      getCopyText(
        entry({
          category: "mcp",
          documentationUrl: "https://docs.example",
        }),
      ),
    ).toBe("https://docs.example");
    expect(
      getCopyText(
        entry({ category: "mcp", repoUrl: "https://github.com/a/b" }),
      ),
    ).toBe("https://github.com/a/b");
    expect(getCopyText(entry({ category: "mcp", title: "MCP Title" }))).toBe(
      "MCP Title",
    );
  });

  it("copies skills and statuslines as labeled blocks", () => {
    const text = getCopyText(
      entry({
        category: "skills",
        installCommand: "install",
        configSnippet: "cfg",
        usageSnippet: "usage",
        copySnippet: "asset",
      }),
    );
    expect(text).toContain("Install:\ninstall");
    expect(text).toContain("Usage:\nusage");
    expect(text).toContain("Asset:\nasset");
  });

  it("copies commands and collections", () => {
    expect(
      getCopyText(
        entry({
          category: "commands",
          commandSyntax: "/demo",
          copySnippet: "copy",
          body: "ref",
        }),
      ),
    ).toContain("Command:\n/demo");
    expect(
      getCopyText(
        entry({ category: "commands", description: "desc", body: "" }),
      ),
    ).toBe("desc");

    const collection = getCopyText(
      entry({
        category: "collections",
        usageSnippet: "start",
        items: [{ category: "skills", slug: "a" }],
        body: "ref",
      }),
    );
    expect(collection).toContain("Quick start:\nstart");
    expect(collection).toContain("Included items:\nskills/a");
    expect(
      getCopyText(
        entry({ category: "collections", description: "desc", body: "" }),
      ),
    ).toBe("desc");
  });

  it("falls back through copy, install, usage, code, body, and links", () => {
    expect(getCopyText(entry({ category: "tools", copySnippet: "copy" }))).toBe(
      "copy",
    );
    expect(
      getCopyText(entry({ category: "tools", installCommand: "install" })),
    ).toBe("install");
    expect(
      getCopyText(entry({ category: "tools", usageSnippet: "usage" })),
    ).toBe("usage");
    expect(
      getCopyText(
        entry({
          category: "tools",
          codeBlocks: [{ code: " code " }],
        }),
      ),
    ).toBe("code");
    expect(getCopyText(entry({ category: "tools", body: " body " }))).toBe(
      "body",
    );
    expect(
      getCopyText(
        entry({ category: "tools", documentationUrl: "https://docs" }),
      ),
    ).toBe("https://docs");
    expect(
      getCopyText(entry({ category: "tools", githubUrl: "https://gh" })),
    ).toBe("https://gh");
    expect(
      getCopyText(entry({ category: "tools", title: "T", slug: "s" })),
    ).toBe("T\nhttps://heyclau.de/entry/tools/s");
  });
});

describe("getDistributionBadges", () => {
  it("always includes Raycast and adds package badges", () => {
    const badges = getDistributionBadges(
      entry({
        category: "skills",
        downloadUrl: "/downloads/skills/x.zip",
        downloadTrust: "first-party",
      }),
    );
    expect(badges[0].label).toBe("Raycast");
    expect(badges.some((badge) => badge.label === "ZIP")).toBe(true);
    expect(
      getDistributionBadges(
        entry({
          category: "mcp",
          downloadUrl: "/downloads/mcp/x.mcpb",
          downloadTrust: "external",
        }),
      ).some((badge) => badge.label === "MCPB"),
    ).toBe(true);
  });

  it("adds copy-only, docs, source, brand, and trust badges", () => {
    const labels = getDistributionBadges(
      entry({
        documentationUrl: "https://docs",
        repoUrl: "https://github.com/a/b",
        brandDomain: "example.com",
        trustSignals: { checksumPresent: true, adapterGenerated: true },
        safetyNotes: ["safe"],
        privacyNotes: ["private"],
        reviewedBy: "maintainer",
      }),
    ).map((badge) => badge.label);
    expect(labels).toEqual(
      expect.arrayContaining([
        "copy-only",
        "docs",
        "source",
        "brand",
        "checksum",
        "adapter",
        "safety notes",
        "privacy notes",
        "reviewed",
      ]),
    );
  });

  it("uses claimed badge for verified claims and brand icons", () => {
    const labels = getDistributionBadges(
      entry({
        installCommand: "install",
        brandIconUrl: "/icon.png",
        githubUrl: "https://github.com/a/b",
        claimStatus: "verified",
      }),
    ).map((badge) => badge.label);
    expect(labels).toContain("claimed");
    expect(labels).toContain("brand");
    expect(labels).toContain("source");
    expect(labels).not.toContain("copy-only");
  });
});

describe("getEntryAccessSummary", () => {
  it("summarizes access signals and copy-only posture", () => {
    expect(getEntryAccessSummary(null)).toMatchObject({
      hasInstall: false,
      hasConfig: false,
      hasDownload: false,
      copyOnly: true,
    });
    expect(
      getEntryAccessSummary(
        entry({
          installCommand: "install",
          configSnippet: "cfg",
          downloadUrl: "/x",
          documentationUrl: "https://docs",
          repoUrl: "https://github.com/a/b",
          safetyNotes: ["s"],
          privacyNotes: ["p"],
          prerequisites: ["node"],
        }),
      ),
    ).toEqual({
      hasInstall: true,
      hasConfig: true,
      hasDownload: true,
      hasDocs: true,
      hasSource: true,
      hasSafetyNotes: true,
      hasPrivacyNotes: true,
      hasPrerequisites: true,
      copyOnly: false,
    });
    expect(
      getEntryAccessSummary(
        entry({ commandSyntax: "/demo", githubUrl: "https://x" }),
      ),
    ).toMatchObject({
      hasInstall: true,
      hasSource: true,
      copyOnly: false,
    });
  });
});

describe("public wrapper re-exports", () => {
  it("keeps the presentation.js surface identical to the lib", async () => {
    const wrapper = await import("../packages/registry/src/presentation.js");
    expect(wrapper.getPreviewLine).toBe(getPreviewLine);
    expect(wrapper.getCopyText).toBe(getCopyText);
    expect(wrapper.getDistributionBadges).toBe(getDistributionBadges);
    expect(wrapper.getEntryAccessSummary).toBe(getEntryAccessSummary);
    expect(wrapper.compactCount).toBe(compactCount);
  });
});
