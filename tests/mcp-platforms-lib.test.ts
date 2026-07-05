import { describe, expect, it } from "vitest";

import {
  SITE_URL,
  buildSkillPlatformCompatibility,
  platformFeedSlug,
} from "../packages/mcp/src/platforms-lib.js";
import {
  SITE_URL as SITE_URLFromWrapper,
  buildSkillPlatformCompatibility as buildSkillPlatformCompatibilityFromWrapper,
  platformFeedSlug as platformFeedSlugFromWrapper,
} from "../packages/mcp/src/platforms.js";

const DEFAULT_SKILL_PLATFORMS = [
  "Claude",
  "Codex",
  "Windsurf",
  "Gemini",
  "Cursor",
  "Generic AGENTS",
] as const;

function skillEntry(overrides: Record<string, unknown> = {}) {
  return {
    category: "skills",
    slug: "branch-matrix",
    title: "Branch Matrix",
    ...overrides,
  };
}

describe("platforms-lib SITE_URL", () => {
  it.each([
    ["value", SITE_URL, "https://heyclau.de"],
    ["protocol", SITE_URL.startsWith("https://"), true],
    ["no trailing slash", SITE_URL.endsWith("/"), false],
    ["hostname", new URL(SITE_URL).hostname, "heyclau.de"],
    ["pathname root", new URL(SITE_URL).pathname, "/"],
  ] as const)("%s is correct", (_label, actual, expected) => {
    expect(actual).toBe(expected);
  });

  it("is a stable string constant", () => {
    expect(typeof SITE_URL).toBe("string");
    expect(SITE_URL.length).toBeGreaterThan(0);
  });

  it("matches the public platforms.js re-export", () => {
    expect(SITE_URLFromWrapper).toBe(SITE_URL);
  });
});

describe("platforms-lib platformFeedSlug ampersand expansion", () => {
  it.each([
    ["Claude & Cursor", "claude-and-cursor"],
    ["A & B", "a-and-b"],
    ["A&B", "a-andb"],
    ["A&B&C", "a-andb-andc"],
    ["Tools & Rules & Hooks", "tools-and-rules-and-hooks"],
    ["R&D", "r-andd"],
    ["Q&A Platform", "q-anda-platform"],
    ["Design & Build", "design-and-build"],
    ["  Claude & Codex  ", "claude-and-codex"],
    ["Foo&Bar", "foo-andbar"],
    ["alpha&beta&gamma", "alpha-andbeta-andgamma"],
    ["&leading", "andleading"],
    ["trailing&", "trailing-and"],
    ["&&", "and-and"],
    ["a && b", "a-and-and-b"],
    ["Tom & Jerry", "tom-and-jerry"],
    ["VS Code & Cursor", "vs-code-and-cursor"],
    ["MCP & Skills", "mcp-and-skills"],
    ["one&two&three&four", "one-andtwo-andthree-andfour"],
    ["A &", "a-and"],
    ["& B", "and-b"],
    ["Mixed &Case", "mixed-andcase"],
    ["UPPER & lower", "upper-and-lower"],
    ["1 & 2", "1-and-2"],
    ["x&", "x-and"],
    ["&x", "andx"],
    ["a&b c", "a-andb-c"],
    ["a & b &", "a-and-b-and"],
  ])("expands %j to %j", (input, expected) => {
    expect(platformFeedSlug(input)).toBe(expected);
  });
});

describe("platforms-lib platformFeedSlug special characters", () => {
  it.each([
    [" Claude---Code!! ", "claude-code"],
    ["Generic AGENTS", "generic-agents"],
    ["VS Code", "vs-code"],
    ["", ""],
    ["   ", ""],
    ["trailing---", "trailing"],
    ["___mixed___", "mixed"],
    ["!!!", ""],
    ["---", ""],
    ["___", ""],
    ["Hello!!!World???", "hello-world"],
    ["foo...bar", "foo-bar"],
    ["tabs\there", "tabs-here"],
    ["line\nbreak", "line-break"],
    ["under_score", "under-score"],
    ["dot.name", "dot-name"],
    ["comma,separated", "comma-separated"],
    ["colon:parts", "colon-parts"],
    ["semi;colon", "semi-colon"],
    ["pipe|split", "pipe-split"],
    ["plus+sign", "plus-sign"],
    ["equals=sign", "equals-sign"],
    ["at@sign", "at-sign"],
    ["hash#tag", "hash-tag"],
    ["dollar$sign", "dollar-sign"],
    ["percent%sign", "percent-sign"],
    ["caret^sign", "caret-sign"],
    ["tilde~sign", "tilde-sign"],
    ["back`tick", "back-tick"],
    ["quote'mark", "quote-mark"],
    ['double"quote', "double-quote"],
    ["paren(thesis)", "paren-thesis"],
    ["bracket[test]", "bracket-test"],
    ["brace{test}", "brace-test"],
    ["slash/test", "slash-test"],
    ["back\\slash", "back-slash"],
    ["emoji 🚀 launch", "emoji-launch"],
    ["café résumé", "caf-r-sum"],
    ["日本語", ""],
    ["123-456", "123-456"],
    ["v2.0 release", "v2-0-release"],
  ])("normalizes %j to %j", (input, expected) => {
    expect(platformFeedSlug(input)).toBe(expected);
  });

  it.each([
    ["claude-code", "claude-code"],
    ["codex", "codex"],
    ["cursor", "cursor"],
    ["windsurf", "windsurf"],
    ["gemini", "gemini"],
    ["generic-agents", "generic-agents"],
    ["claude-code-cli", "claude-code-cli"],
    ["mcp-server", "mcp-server"],
    ["rule-pack", "rule-pack"],
    ["hook-runner", "hook-runner"],
    ["agent-toolkit", "agent-toolkit"],
    ["command-suite", "command-suite"],
    ["plugin-bridge", "plugin-bridge"],
    ["workflow-helper", "workflow-helper"],
    ["lint-helper", "lint-helper"],
    ["branch-matrix", "branch-matrix"],
    ["demo-server", "demo-server"],
    ["qa-automation", "qa-automation"],
    ["repo-review", "repo-review"],
    ["browser-bridge", "browser-bridge"],
  ])("keeps canonical slug %s unchanged", (slug) => {
    expect(platformFeedSlug(slug)).toBe(slug);
  });

  it.each([
    ["UPPERCASE", "uppercase"],
    ["MixedCaseLabel", "mixedcaselabel"],
    ["  padded label  ", "padded-label"],
    ["multiple   spaces", "multiple-spaces"],
    ["a-b-c", "a-b-c"],
    ["already-kebab", "already-kebab"],
    ["0123numeric", "0123numeric"],
    ["9lives", "9lives"],
    ["a1b2c3", "a1b2c3"],
    ["x", "x"],
    ["A", "a"],
    ["1", "1"],
    ["a-", "a"],
    ["-a", "a"],
    ["-a-", "a"],
    ["a--b", "a-b"],
    ["a---b---c", "a-b-c"],
    ["___a___b___", "a-b"],
    ["...dots...", "dots"],
    ["((nested))", "nested"],
    ["[[nested]]", "nested"],
    ["{{nested}}", "nested"],
    ["<<nested>>", "nested"],
    ['"quoted label"', "quoted-label"],
    ["'quoted label'", "quoted-label"],
    ["label/with/slashes", "label-with-slashes"],
    ["label\\with\\slashes", "label-with-slashes"],
    ["label.with.dots", "label-with-dots"],
    ["label_with_underscores", "label-with-underscores"],
    ["label+with+plus", "label-with-plus"],
    ["label=with=equals", "label-with-equals"],
    ["label@with@at", "label-with-at"],
    ["label#with#hash", "label-with-hash"],
    ["label$with$dollar", "label-with-dollar"],
    ["label%with%percent", "label-with-percent"],
    ["label^with^caret", "label-with-caret"],
    ["label~with~tilde", "label-with-tilde"],
    ["label`with`backtick", "label-with-backtick"],
    ["label|with|pipe", "label-with-pipe"],
    ["label;with;semi", "label-with-semi"],
    ["label:with:colon", "label-with-colon"],
    ["label,with,comma", "label-with-comma"],
    ["label?with?question", "label-with-question"],
    ["label!with!bang", "label-with-bang"],
  ])("slugifies %j to %j", (input, expected) => {
    expect(platformFeedSlug(input)).toBe(expected);
  });

  it("matches the public platforms.js re-export", () => {
    expect(platformFeedSlugFromWrapper("Claude & Cursor")).toBe(
      platformFeedSlug("Claude & Cursor"),
    );
    expect(platformFeedSlugFromWrapper(" Claude---Code!! ")).toBe(
      platformFeedSlug(" Claude---Code!! "),
    );
  });
});

describe("platforms-lib buildSkillPlatformCompatibility non-skills", () => {
  it.each([
    ["mcp"],
    ["tools"],
    ["agents"],
    ["hooks"],
    ["rules"],
    ["commands"],
    ["plugins"],
    ["workflows"],
    ["guides"],
    ["collections"],
    ["integrations"],
    ["templates"],
  ])("returns empty compatibility for category %s", (category) => {
    expect(
      buildSkillPlatformCompatibility({
        category,
        slug: "example-entry",
      }),
    ).toEqual([]);
  });

  it.each([
    [null],
    [undefined],
    [{}],
    [{ slug: "orphan-slug" }],
    [{ category: "" }],
    [{ category: "skill" }],
    [{ category: "SKILLS" }],
    [{ category: "skills-package" }],
  ])("returns empty compatibility for invalid entry %j", (entry) => {
    expect(buildSkillPlatformCompatibility(entry as never)).toEqual([]);
  });
});

describe("platforms-lib buildSkillPlatformCompatibility custom metadata", () => {
  it("preserves explicit platformCompatibility arrays by reference", () => {
    const explicit = [
      {
        platform: "Custom IDE",
        support: "manual-context",
        artifact: "custom/path",
        installHint: "Use the custom installer.",
      },
      {
        platform: "Another Tool",
        support: "adapter",
        artifact: ".tool/rules/custom.mdc",
        adapterUrl: "/data/skill-adapters/custom/example.mdc",
        installHint: "Copy the generated adapter.",
      },
    ];
    const result = buildSkillPlatformCompatibility({
      category: "skills",
      slug: "ignored-when-explicit",
      platformCompatibility: explicit,
    });
    expect(result).toBe(explicit);
    expect(result).toEqual(explicit);
  });

  it.each([
    [[]],
    [[{ platform: "Solo", support: "native-skill", artifact: "solo" }]],
    [
      [
        { platform: "One", support: "adapter" },
        { platform: "Two", support: "manual-context" },
      ],
    ],
  ])("returns custom platformCompatibility %j unchanged", (explicit) => {
    const result = buildSkillPlatformCompatibility({
      category: "skills",
      platformCompatibility: explicit,
    });
    expect(result).toBe(explicit);
  });

  it("does not synthesize defaults when explicit metadata is provided", () => {
    const explicit = [{ platform: "OnlyOne", support: "native-skill" }];
    const result = buildSkillPlatformCompatibility({
      category: "skills",
      slug: "branch-matrix",
      platformCompatibility: explicit,
    });
    expect(result).toHaveLength(1);
    expect(result[0]).toMatchObject({ platform: "OnlyOne" });
  });
});

describe("platforms-lib buildSkillPlatformCompatibility default skills", () => {
  it("returns the default platform list for skill entries", () => {
    const compatibility = buildSkillPlatformCompatibility(skillEntry());
    expect(compatibility.map((item) => item.platform)).toEqual([
      ...DEFAULT_SKILL_PLATFORMS,
    ]);
  });

  it.each(DEFAULT_SKILL_PLATFORMS)(
    "includes default platform %s",
    (platform) => {
      const compatibility = buildSkillPlatformCompatibility(
        skillEntry({ slug: "lint-helper" }),
      );
      expect(compatibility.map((item) => item.platform)).toContain(platform);
    },
  );

  it.each([
    ["Claude", "native-skill", "SKILL.md package"],
    ["Codex", "native-skill", "SKILL.md package"],
    ["Windsurf", "native-skill", "SKILL.md package"],
    ["Gemini", "native-skill", "SKILL.md package"],
    ["Cursor", "adapter", ".cursor/rules/branch-matrix.mdc"],
    ["Generic AGENTS", "manual-context", "SKILL.md package"],
  ])(
    "sets support and artifact for platform %s",
    (platform, support, artifact) => {
      const row = buildSkillPlatformCompatibility(skillEntry()).find(
        (item) => item.platform === platform,
      );
      expect(row).toMatchObject({ support, artifact });
    },
  );

  it.each([
    ["Claude", "Claude skills folder"],
    ["Codex", "Codex skills folder"],
    ["Windsurf", ".windsurf/skills/<skill-name>/"],
    ["Gemini", "Gemini CLI extension skill support"],
    ["Cursor", "Cursor rule adapter"],
    ["Generic AGENTS", "reusable agent context"],
  ])("includes install hint for platform %s", (platform, fragment) => {
    const row = buildSkillPlatformCompatibility(skillEntry()).find(
      (item) => item.platform === platform,
    );
    expect(String(row?.installHint)).toContain(fragment);
  });

  it("matches the public platforms.js re-export", () => {
    const entry = skillEntry({ slug: "demo-skill" });
    expect(buildSkillPlatformCompatibilityFromWrapper(entry)).toEqual(
      buildSkillPlatformCompatibility(entry),
    );
  });
});

describe("platforms-lib buildSkillPlatformCompatibility cursor adapter slug", () => {
  it.each([
    ["branch-matrix", "branch-matrix"],
    ["lint-helper", "lint-helper"],
    ["demo-skill", "demo-skill"],
    ["qa-automation", "qa-automation"],
    ["repo-review", "repo-review"],
    ["browser-bridge", "browser-bridge"],
    ["  trimmed-slug  ", "trimmed-slug"],
    ["UPPER-SLUG", "UPPER-SLUG"],
    ["mixedCaseSlug", "mixedCaseSlug"],
    ["with_underscore", "with_underscore"],
    ["with.dot", "with.dot"],
    ["a", "a"],
    ["123", "123"],
    ["v2-release", "v2-release"],
    ["multi-part-name", "multi-part-name"],
    ["skill-with-long-descriptive-name", "skill-with-long-descriptive-name"],
    ["", ""],
    ["   ", ""],
    ["special-chars!@#", "special-chars!@#"],
    ["slug/with/slash", "slug/with/slash"],
    ["slug with spaces", "slug with spaces"],
    ["slug&name", "slug&name"],
    ["slug---noise", "slug---noise"],
    ["___slug___", "___slug___"],
    ["emoji-🚀", "emoji-🚀"],
    ["café-skill", "café-skill"],
    ["日本語-slug", "日本語-slug"],
    ["snake_case_skill", "snake_case_skill"],
    ["dot.separated.skill", "dot.separated.skill"],
    ["kebab-case-skill", "kebab-case-skill"],
    ["PascalCaseSkill", "PascalCaseSkill"],
    ["SCREAMING_SNAKE", "SCREAMING_SNAKE"],
    ["1-starting-number", "1-starting-number"],
    ["ends-with-number-9", "ends-with-number-9"],
    ["double--dash", "double--dash"],
    ["triple___underscore", "triple___underscore"],
  ])("uses slug %j in Cursor adapter paths", (slug, expectedSlug) => {
    const cursor = buildSkillPlatformCompatibility(skillEntry({ slug })).find(
      (item) => item.platform === "Cursor",
    );
    expect(cursor).toMatchObject({
      support: "adapter",
      artifact: `.cursor/rules/${expectedSlug}.mdc`,
      adapterUrl: `/data/skill-adapters/cursor/${expectedSlug}.mdc`,
    });
  });

  it("does not mutate slug values when building compatibility", () => {
    const entry = skillEntry({ slug: "branch-matrix" });
    buildSkillPlatformCompatibility(entry);
    expect(entry.slug).toBe("branch-matrix");
  });

  it("only Cursor rows expose adapterUrl", () => {
    const compatibility = buildSkillPlatformCompatibility(skillEntry());
    for (const row of compatibility) {
      if (row.platform === "Cursor") {
        expect(row.adapterUrl).toBe(
          "/data/skill-adapters/cursor/branch-matrix.mdc",
        );
      } else {
        expect(row.adapterUrl).toBeUndefined();
      }
    }
  });
});

describe("platforms-lib wrapper parity", () => {
  it.each([
    ["Claude & Cursor", "claude-and-cursor"],
    ["Generic AGENTS", "generic-agents"],
    ["VS Code", "vs-code"],
    ["", ""],
    ["___", ""],
    ["A&B&C", "a-andb-andc"],
    [" Claude---Code!! ", "claude-code"],
    ["emoji 🚀 launch", "emoji-launch"],
    ["123-456", "123-456"],
    ["label/with/slashes", "label-with-slashes"],
  ])("platformFeedSlug wrapper matches lib for %j", (input, expected) => {
    expect(platformFeedSlugFromWrapper(input)).toBe(expected);
    expect(platformFeedSlugFromWrapper(input)).toBe(platformFeedSlug(input));
  });

  it.each([
    [{ category: "mcp", slug: "demo" }],
    [{ category: "tools", slug: "demo" }],
    [{ category: "skills", slug: "demo-skill" }],
    [
      {
        category: "skills",
        platformCompatibility: [{ platform: "Custom", support: "adapter" }],
      },
    ],
  ])("buildSkillPlatformCompatibility wrapper matches lib for %j", (entry) => {
    expect(buildSkillPlatformCompatibilityFromWrapper(entry)).toEqual(
      buildSkillPlatformCompatibility(entry),
    );
  });
});

describe("platforms-lib feed slug invariants", () => {
  it.each([
    "claude-code",
    "codex",
    "cursor",
    "windsurf",
    "gemini",
    "generic-agents",
  ])("returns lowercase kebab-case slug for %s", (slug) => {
    expect(platformFeedSlug(slug)).toMatch(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);
  });

  it.each([
    ["Claude Code", "claude-code"],
    ["Claude Code CLI", "claude-code-cli"],
    ["Cursor Rules", "cursor-rules"],
    ["Generic Agents", "generic-agents"],
    ["Gemini CLI", "gemini-cli"],
    ["Windsurf Cascade", "windsurf-cascade"],
    ["Codex CLI", "codex-cli"],
    ["Agent Toolkit", "agent-toolkit"],
    ["Rule Pack", "rule-pack"],
    ["Hook Runner", "hook-runner"],
  ])("slugifies human label %j to %j", (label, expected) => {
    expect(platformFeedSlug(label)).toBe(expected);
  });

  it("never produces leading or trailing hyphens for non-empty output", () => {
    const samples = [
      "Claude & Cursor",
      "___mixed___",
      "!!!hello!!!",
      "  spaced  ",
      "a---b---c",
      "foo&bar",
    ];
    for (const sample of samples) {
      const slug = platformFeedSlug(sample);
      if (slug.length === 0) continue;
      expect(slug.startsWith("-")).toBe(false);
      expect(slug.endsWith("-")).toBe(false);
    }
  });
});
