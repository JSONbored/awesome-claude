import { describe, expect, it } from "vitest";

import {
  CATEGORY_SCHEMAS,
  CLAIM_STATUS_VALUES,
  DEFAULT_DIRECTORY_REPO_URL,
  FORBIDDEN_CONTENT_FIELDS,
  SAFE_CONTENT_SLUG_PATTERN,
  SKILL_LEVEL_VALUES,
  SKILL_TYPE_VALUES,
  VERIFICATION_STATUS_VALUES,
  deriveCardDescription,
  deriveSeoFields,
  extractCodeBlocks,
  extractHeadings,
  extractSections,
  headingId,
  inferHookTrigger,
  inferLanguageFromCategory,
  inferRepoUrl,
  inferSectionBooleans,
  inferStructuredFields,
  looksLikeRawScript,
  normalizeBody,
  orderFrontmatter,
  stripCodeBlocks,
  validateEntry,
} from "../packages/registry/src/content-schema-lib.js";
import { parseSafeFrontmatter } from "../packages/registry/src/frontmatter-lib.js";

const CATEGORIES = [
  "agents",
  "mcp",
  "tools",
  "skills",
  "rules",
  "commands",
  "hooks",
  "guides",
  "collections",
  "statuslines",
] as const;

const BASE_ENTRY = {
  title: "Demo Entry",
  slug: "demo-entry",
  description: "A reusable test entry for schema validation.",
  cardDescription: "Short card summary for the demo entry.",
  author: "JSONbored",
  dateAdded: "2026-01-01",
};

const VALID_SKILL = {
  ...BASE_ENTRY,
  skillType: "general",
  skillLevel: "advanced",
  verificationStatus: "draft",
  testedPlatforms: ["Claude", "Cursor"],
  usageSnippet: "Use during reviews.",
  copySnippet: "Review checklist.",
};

const VALID_TOOL = {
  ...BASE_ENTRY,
  websiteUrl: "https://example.com",
  pricingModel: "freemium",
  disclosure: "editorial",
};

const HOOK_TRIGGERS = [
  "PreToolUse",
  "PostToolUse",
  "UserPromptSubmit",
  "Notification",
  "Stop",
  "SubagentStop",
  "SessionStart",
] as const;

const CATEGORY_LABELS: Record<(typeof CATEGORIES)[number], string> = {
  agents: "Agents",
  mcp: "MCP Servers",
  tools: "Tools",
  skills: "Skills",
  rules: "Rules",
  commands: "Commands",
  hooks: "Hooks",
  guides: "Guides",
  collections: "Collections",
  statuslines: "Statuslines",
};

const RAW_SCRIPT = [
  "#!/usr/bin/env bash",
  "echo ok",
  "export VALUE=1",
  "read -r input",
  'if [ -n "$input" ]; then',
  "fi",
].join("\n");

describe("exported constants", () => {
  it("defines CATEGORY_SCHEMAS for every category in category-spec", () => {
    expect(Object.keys(CATEGORY_SCHEMAS).sort()).toEqual(
      [...CATEGORIES].sort(),
    );
  });

  it.each(CATEGORIES)(
    "CATEGORY_SCHEMAS[%s] has required and recommended arrays",
    (category) => {
      const schema = CATEGORY_SCHEMAS[category];
      expect(Array.isArray(schema.required)).toBe(true);
      expect(Array.isArray(schema.recommended)).toBe(true);
      expect(schema.required.length).toBeGreaterThan(0);
    },
  );

  it.each(CATEGORIES)(
    "%s requires title, slug, description, and cardDescription",
    (category) => {
      expect(CATEGORY_SCHEMAS[category].required).toEqual(
        expect.arrayContaining([
          "title",
          "slug",
          "description",
          "cardDescription",
        ]),
      );
    },
  );

  it("lists forbidden analytics fields", () => {
    expect(FORBIDDEN_CONTENT_FIELDS).toEqual([
      "viewCount",
      "copyCount",
      "popularityScore",
    ]);
  });

  it("exports skill type enum values from category-spec", () => {
    expect(SKILL_TYPE_VALUES).toEqual(["general", "capability-pack"]);
  });

  it("exports skill level enum values from category-spec", () => {
    expect(SKILL_LEVEL_VALUES).toEqual(["foundational", "advanced", "expert"]);
  });

  it("exports verification status enum values from category-spec", () => {
    expect(VERIFICATION_STATUS_VALUES).toEqual([
      "draft",
      "validated",
      "production",
    ]);
  });

  it("exports claim status values", () => {
    expect(CLAIM_STATUS_VALUES).toEqual(["unclaimed", "pending", "verified"]);
  });

  it.each([
    ["demo-entry", true],
    ["demo", true],
    ["entry-42", true],
    ["a", true],
    ["1", true],
    ["demo--entry", false],
    ["Demo-Entry", false],
    ["demo_entry", false],
    ["-demo", false],
    ["demo-", false],
    ["", false],
    ["demo entry", false],
    ["demo.entry", false],
    ["demo/entry", false],
  ])("SAFE_CONTENT_SLUG_PATTERN accepts %j as %s", (slug, valid) => {
    expect(SAFE_CONTENT_SLUG_PATTERN.test(slug)).toBe(valid);
  });

  it("exports the default directory repo URL", () => {
    expect(DEFAULT_DIRECTORY_REPO_URL).toBe(
      "https://github.com/JSONbored/awesome-claude",
    );
  });
});

describe("headingId", () => {
  it.each([
    ["Hello World", "hello-world"],
    ["setup-installation", "setup-installation"],
    ["Setup - Installation", "setup-installation"],
    ["Setup---Installation", "setup-installation"],
    ["Setup   Installation", "setup-installation"],
    ["Setup\tInstallation", "setup-installation"],
    ["Setup\nInstallation", "setup-installation"],
    ["Setup\r\nInstallation", "setup-installation"],
    ["  Leading and trailing  ", "leading-and-trailing"],
    ["Multiple   Spaces   Here", "multiple-spaces-here"],
    ["Hyphen-Run-Together", "hyphen-run-together"],
    ["Mixed -   - Separators", "mixed-separators"],
    ["Numbers123And456", "numbers123and456"],
    ["Version 2.0 Release", "version-20-release"],
    ["C++ and C# Notes", "c-and-c-notes"],
    ["Unicode Café Résumé", "unicode-caf-rsum"],
    ["Emoji 🚀 Launch", "emoji-launch"],
    ["Punctuation!!! Marks???", "punctuation-marks"],
    ["Under_score ignored", "underscore-ignored"],
    ["Dots.and.slash/removed", "dotsandslashremoved"],
    ["ALL CAPS TITLE", "all-caps-title"],
    ["kebab-case-already", "kebab-case-already"],
    ["Single", "single"],
    ["a", "a"],
    ["123", "123"],
    ["A1 B2 C3", "a1-b2-c3"],
    ["---only-separators---", "only-separators"],
    ["", ""],
    ["   ", ""],
    ["\t\n\r", ""],
    ["Setup - Installation!", "setup-installation"],
    ["FAQ & Answers", "faq-answers"],
    ["API/HTTP Details", "apihttp-details"],
    ["[Bracketed] Title", "bracketed-title"],
    ["(Parentheses) Title", "parentheses-title"],
    ["Quote 'Single' Words", "quote-single-words"],
    ['Quote "Double" Words', "quote-double-words"],
    ["Backtick `Code` Words", "backtick-code-words"],
    ["Tab\tSeparated\tWords", "tab-separated-words"],
    ["New\nLine\nSeparated", "new-line-separated"],
    ["snake_case_and-kebab", "snakecaseand-kebab"],
    ["line\nbreak\nheading", "line-break-heading"],
    ["final sanity check 2026", "final-sanity-check-2026"],
  ])("normalizes %j to %s", (input, expected) => {
    expect(headingId(input)).toBe(expected);
  });

  it("coerces non-string values through String()", () => {
    expect(headingId(42 as unknown as string)).toBe("42");
    expect(headingId(null as unknown as string)).toBe("");
    expect(headingId(undefined as unknown as string)).toBe("");
  });
});

describe("deriveCardDescription", () => {
  const long = (char: string, count: number) => char.repeat(count);
  const ellipsis = (char: string, count: number) => `${char.repeat(count)}...`;

  it.each([
    ["", ""],
    ["   ", ""],
    ["Short summary.", "Short summary."],
    ["  spaced   words  ", "spaced words"],
    [long("a", 140), long("a", 140)],
    [long("a", 141), ellipsis("a", 137)],
    [long("c", 200), ellipsis("c", 137)],
    [
      "First sentence is complete. Second sentence should be dropped for cards.",
      "First sentence is complete. Second sentence should be dropped for cards.",
    ],
    [
      `Sentence one fits. ${long("x", 120)}`,
      `Sentence one fits. ${long("x", 120)}`,
    ],
    [`Question mark works? ${long("z", 120)}`, "Question mark works?"],
    [
      `Exclamation works! ${long("q", 120)}`,
      `Exclamation works! ${long("q", 120)}`,
    ],
    [
      "Multiple   internal\n\nwhitespace   rows",
      "Multiple internal whitespace rows",
    ],
    [`Ends with period.${long("n", 50)}`, `Ends with period.${long("n", 50)}`],
    [`Almost. ${long("p", 200)}`, "Almost."],
    [`Word ${long("w", 200)}`, `Word ${long("w", 132)}...`],
    [long("a", 138), long("a", 138)],
    [long("a", 139), long("a", 139)],
    [`Stop. ${long("c", 180)}`, "Stop."],
    [`No stop ${long("c", 180)}`, `No stop ${long("c", 129)}...`],
    [`Done. ${long("n", 300)}`, "Done."],
    [`Pad ${long("p", 300)}`, `Pad ${long("p", 133)}...`],
  ])("derives card description for %j", (input, expected) => {
    expect(deriveCardDescription(input)).toBe(expected);
  });

  it.each(Array.from({ length: 30 }, (_, index) => index))(
    "truncates padded description variant %s",
    (index) => {
      const input = `Variant${index} ` + "m".repeat(260);
      const result = deriveCardDescription(input);
      expect(result.endsWith("...")).toBe(true);
      expect(result.length).toBe(140);
      expect(result.startsWith(`Variant${index} `)).toBe(true);
    },
  );
});

describe("deriveSeoFields", () => {
  it.each(CATEGORIES)(
    "builds seoTitle for %s using the category label",
    (category) => {
      const seo = deriveSeoFields(
        { title: "Example Asset", description: "Short description." },
        category,
      );
      expect(seo.seoTitle).toContain("Example Asset");
      expect(seo.seoTitle).toContain(CATEGORY_LABELS[category]);
      expect(seo.seoTitle).toContain("Claude");
      expect(seo.seoTitle.length).toBeLessThanOrEqual(70);
    },
  );

  it.each(CATEGORIES)("includes category keyword for %s", (category) => {
    const seo = deriveSeoFields({ title: "Keyword Test" }, category);
    expect(seo.keywords).toContain(category);
    expect(seo.keywords).toContain("claude");
    expect(seo.keywords).toContain("heyclaude");
  });

  it.each(CATEGORIES)(
    "pads short descriptions with HeyClaude suffix for %s",
    (category) => {
      const seo = deriveSeoFields(
        { title: "Short SEO", description: "Brief." },
        category,
      );
      expect(seo.seoDescription).toContain("HeyClaude");
      expect(seo.seoDescription.length).toBeLessThanOrEqual(160);
    },
  );

  it.each(CATEGORIES)(
    "uses seoDescription when provided for %s",
    (category) => {
      const seo = deriveSeoFields(
        { title: "Long SEO", seoDescription: "A".repeat(150) },
        category,
      );
      expect(seo.seoDescription.length).toBeLessThanOrEqual(160);
      expect(seo.seoDescription.startsWith("A")).toBe(true);
    },
  );

  it("uses cardDescription before description", () => {
    const seo = deriveSeoFields(
      {
        title: "Priority",
        cardDescription: "Card wins",
        description: "Description loses",
      },
      "guides",
    );
    expect(seo.seoDescription).toContain("Card wins");
  });
});

describe("extractCodeBlocks", () => {
  it.each([
    ["", []],
    ["No fences here", []],
    ["```\ncode only\n```", [{ language: "text", code: "code only" }]],
    ["```bash\necho hi\n```", [{ language: "bash", code: "echo hi" }]],
    ["```js\nconst x = 1;\n```", [{ language: "js", code: "const x = 1;" }]],
    [
      "```text\nline1\nline2\n```",
      [{ language: "text", code: "line1\nline2" }],
    ],
    [
      "Before\n```sh\nexport FOO=1\n```\nAfter",
      [{ language: "sh", code: "export FOO=1" }],
    ],
    [
      "```python\nprint('ok')\n```\n\n```json\n{}\n```",
      [
        { language: "python", code: "print('ok')" },
        { language: "json", code: "{}" },
      ],
    ],
    [
      "```markdown\n## Not extracted as heading\n```",
      [{ language: "markdown", code: "## Not extracted as heading" }],
    ],
    [
      "Intro\n```bash\na\n```\nMiddle\n```text\nb\n```",
      [
        { language: "bash", code: "a" },
        { language: "text", code: "b" },
      ],
    ],
    ["Text only with ```inline``` mention", []],
    ["```unclosed\nnever ends", []],
    [
      "```bash\ntrailing spaces   \n```",
      [{ language: "bash", code: "trailing spaces" }],
    ],
    [
      "```sh\n#!/bin/sh\necho hi\n```",
      [{ language: "sh", code: "#!/bin/sh\necho hi" }],
    ],
    ['```json\n{"a":1}\n```', [{ language: "json", code: '{"a":1}' }]],
    [
      "```bash\necho one\n```\n```bash\necho two\n```",
      [
        { language: "bash", code: "echo one" },
        { language: "bash", code: "echo two" },
      ],
    ],
  ])("extracts fenced blocks from %j", (body, expected) => {
    expect(extractCodeBlocks(body)).toEqual(expected);
  });
});

describe("extractHeadings", () => {
  it("ignores headings inside fenced code blocks", () => {
    expect(
      extractHeadings(
        [
          "Intro",
          "",
          "## Real",
          "",
          "```bash",
          "## Fake",
          "```",
          "",
          "## Real",
        ].join("\n"),
      ).map((heading) => heading.id),
    ).toEqual(["real", "real-2"]);
  });

  it.each([
    ["", []],
    ["# H1 only\n\nParagraph", []],
    [
      "## Single Heading",
      [{ depth: 2, text: "Single Heading", id: "single-heading" }],
    ],
    ["### Depth Three", [{ depth: 3, text: "Depth Three", id: "depth-three" }]],
    ["#### Depth Four", [{ depth: 4, text: "Depth Four", id: "depth-four" }]],
    ["##### Depth Five", [{ depth: 5, text: "Depth Five", id: "depth-five" }]],
    ["###### Depth Six", [{ depth: 6, text: "Depth Six", id: "depth-six" }]],
    ["##NoSpace", []],
    ["## ", []],
    ["Not a heading", []],
    [
      "## First\n\n## Second",
      [
        { depth: 2, text: "First", id: "first" },
        { depth: 2, text: "Second", id: "second" },
      ],
    ],
    [
      "## Duplicate\n\n## Duplicate",
      [
        { depth: 2, text: "Duplicate", id: "duplicate" },
        { depth: 2, text: "Duplicate", id: "duplicate-2" },
      ],
    ],
    [
      "  ## Indented Heading",
      [{ depth: 2, text: "Indented Heading", id: "indented-heading" }],
    ],
    [
      "### Nested\n\n#### Child",
      [
        { depth: 3, text: "Nested", id: "nested" },
        { depth: 4, text: "Child", id: "child" },
      ],
    ],
    [
      "## Usage\n\n```bash\n## Fake\n```\n\n## Install",
      [
        { depth: 2, text: "Usage", id: "usage" },
        { depth: 2, text: "Install", id: "install" },
      ],
    ],
  ])("extracts headings from %j", (body, expected) => {
    expect(extractHeadings(body)).toEqual(expected);
  });
});

describe("stripCodeBlocks", () => {
  it.each([
    ["", ""],
    ["Plain prose only.", "Plain prose only."],
    ["```bash\necho hi\n```", ""],
    ["Before\n```bash\necho hi\n```\nAfter", "Before\nAfter"],
    ["Keep\n\n```js\nconst x = 1\n```\n\nLines", "Keep\n\n\nLines"],
    ["Heading\n\n## Usage\n\n```text\n/demo\n```", "Heading\n\n## Usage"],
    ["A\n\n\n\nB\n\n\n\nC", "A\n\n\nB\n\n\nC"],
    ["Triple\n\n\n\n\n\nGap", "Triple\n\n\nGap"],
    ["Code\n```\nline1\nline2\n```\nTail", "Code\nTail"],
    ["Unclosed\n```bash\nstill here", "Unclosed"],
    ["Multiple\n```a\n1\n```\nMid\n```b\n2\n```\nEnd", "Multiple\nMid\nEnd"],
  ])("strips fenced code from %j", (markdown, expected) => {
    expect(stripCodeBlocks(markdown)).toBe(expected);
  });
});

describe("extractSections", () => {
  it.each([
    ["", []],
    [
      "Intro only.",
      [{ title: "Overview", id: "overview", markdown: "Intro only." }],
    ],
    [
      "## Alpha\n\nAlpha body.",
      [{ title: "Alpha", id: "alpha", markdown: "Alpha body." }],
    ],
    ["## One\n\nA\n\n## Two\n\nB", ["one", "two"]],
    ["## Duplicate\n\nA\n\n## Duplicate\n\nB", ["duplicate", "duplicate-2"]],
    ["## Usage\n\nText\n\n## Install\n\nMore", ["usage", "install"]],
    ["Preamble\n\n## First\n\nBody", ["overview", "first"]],
    ["## Only\n\nContent", ["only"]],
  ])("maps section ids for %j", (body, expected) => {
    const ids = extractSections(body).map((section) => section.id);
    if (
      Array.isArray(expected) &&
      expected.length &&
      typeof expected[0] === "string"
    ) {
      expect(ids).toEqual(expected);
      return;
    }
    expect(extractSections(body)).toEqual(expected);
  });

  it("splits markdown into overview and level-two sections", () => {
    const markdown = [
      "Intro paragraph.",
      "",
      "## Setup - Installation",
      "",
      "## Setup - Installation",
      "",
      "More setup.",
    ].join("\n");

    expect(extractSections(markdown).map((section) => section.id)).toEqual([
      "overview",
      "setup-installation",
    ]);
  });
});

describe("inferLanguageFromCategory", () => {
  it.each([
    ["hooks", "bash"],
    ["statuslines", "bash"],
    ["commands", "text"],
    ["agents", "text"],
    ["mcp", "text"],
    ["tools", "text"],
    ["skills", "text"],
    ["rules", "text"],
    ["guides", "text"],
    ["collections", "text"],
  ])("maps %s to %s", (category, language) => {
    expect(inferLanguageFromCategory(category)).toBe(language);
  });
});

describe("looksLikeRawScript", () => {
  it.each([
    ["", false],
    ["Plain prose without shell signals.", false],
    ["```bash\necho hi\n```", false],
    ["# comment only", false],
    ["echo once", false],
    ["#!/usr/bin/env bash\necho hi", true],
    [RAW_SCRIPT, true],
    ['echo start\nexport FOO=1\nread -r BAR\nif [ -n "$BAR" ]; then\nfi', true],
    [
      'statusline+="branch"\njq -r .name\necho \\033[32mok\\033[0m\nexport PATH=/bin\n2>/dev/null',
      true,
    ],
    ["#!/bin/sh\necho one", true],
    ["echo a\nexport b\nread -r c\nif [\nfi", true],
    ["Just markdown prose.\n\n## Heading\n\nMore text.", false],
    ["#!/usr/bin/env node\nconsole.log(1)", true],
  ])("detects raw script signals in %j as %s", (body, expected) => {
    expect(looksLikeRawScript(body)).toBe(expected);
  });
});

describe("normalizeBody", () => {
  it.each([
    ["", ""],
    ["   ", ""],
    ["*(No content)*", ""],
    ["(No content)", ""],
    [
      "Already fenced\n\n```bash\necho hi\n```",
      "Already fenced\n\n```bash\necho hi\n```",
    ],
    [
      "Guide prose only.\n\n## Usage\n\nSteps.",
      "Guide prose only.\n\n## Usage\n\nSteps.",
    ],
  ])("normalizes %j", (body, expected) => {
    expect(normalizeBody(body, "guides")).toBe(expected);
  });

  it("wraps raw hook scripts in fenced bash blocks", () => {
    expect(normalizeBody(RAW_SCRIPT, "hooks")).toBe(
      "```bash\n" + RAW_SCRIPT + "\n```",
    );
  });
});

describe("inferRepoUrl", () => {
  it.each([
    [{}, ""],
    [{ repoUrl: "" }, ""],
    [{ repoUrl: DEFAULT_DIRECTORY_REPO_URL }, ""],
    [{ repoUrl: "  " + DEFAULT_DIRECTORY_REPO_URL + "  " }, ""],
    [
      { repoUrl: "https://github.com/example/repo" },
      "https://github.com/example/repo",
    ],
    [
      { repoUrl: "https://gitlab.com/example/repo" },
      "https://gitlab.com/example/repo",
    ],
    [{ documentationUrl: "https://github.com/example/repo" }, ""],
    [
      { repoUrl: "https://github.com/custom/project", slug: "demo" },
      "https://github.com/custom/project",
    ],
    [
      { repoUrl: "http://github.com/legacy/repo" },
      "http://github.com/legacy/repo",
    ],
    [
      { repoUrl: "https://github.com/a/b", sourceUrl: "https://other" },
      "https://github.com/a/b",
    ],
  ])("infers repo URL from %j", (data, expected) => {
    expect(inferRepoUrl(data)).toBe(expected);
  });
});

describe("inferSectionBooleans", () => {
  it.each([
    ["", { hasPrerequisites: false, hasTroubleshooting: false }],
    [
      "## Usage\n\nBody",
      { hasPrerequisites: false, hasTroubleshooting: false },
    ],
    [
      "## Prerequisites\n\nNeed tool",
      { hasPrerequisites: true, hasTroubleshooting: false },
    ],
    [
      "## Prerequisites & Setup",
      { hasPrerequisites: true, hasTroubleshooting: false },
    ],
    [
      "## Prerequisites and Dependencies",
      { hasPrerequisites: true, hasTroubleshooting: false },
    ],
    [
      "## Troubleshooting\n\nFix",
      { hasPrerequisites: false, hasTroubleshooting: true },
    ],
    [
      "## Troubleshooting Guide",
      { hasPrerequisites: false, hasTroubleshooting: true },
    ],
    [
      "## Troubleshooting Common Issues",
      { hasPrerequisites: false, hasTroubleshooting: true },
    ],
    [
      "## Prerequisites\n\nA\n\n## Troubleshooting Guide\n\nB",
      { hasPrerequisites: true, hasTroubleshooting: true },
    ],
    [
      "### Not prerequisites",
      { hasPrerequisites: false, hasTroubleshooting: false },
    ],
    ["# Prerequisites", { hasPrerequisites: false, hasTroubleshooting: false }],
    [
      "Text about prerequisites inline",
      { hasPrerequisites: false, hasTroubleshooting: false },
    ],
    ["## PREREQUISITES", { hasPrerequisites: true, hasTroubleshooting: false }],
    [
      "## troubleshooting",
      { hasPrerequisites: false, hasTroubleshooting: true },
    ],
    [
      "## Troubleshooting\n\n## Prerequisites",
      { hasPrerequisites: false, hasTroubleshooting: true },
    ],
  ])("detects guide sections in %j", (body, expected) => {
    expect(inferSectionBooleans(body)).toEqual(expected);
  });
});

describe("inferHookTrigger", () => {
  it.each(HOOK_TRIGGERS)("finds %s when isolated in text", (trigger) => {
    const expected = trigger === "SubagentStop" ? "Stop" : trigger;
    expect(inferHookTrigger(`Configured for ${trigger} only`)).toBe(expected);
  });

  it.each([
    ["", ""],
    ["No trigger mentioned", ""],
    ["PreToolUse and PostToolUse", "PreToolUse"],
    ["Notification after Stop", "Notification"],
    ["SessionStart at beginning", "SessionStart"],
    ["UserPromptSubmit hook", "UserPromptSubmit"],
    ["SubagentStop cleanup", "Stop"],
    ["pretooluse lowercase", ""],
    ["Random PreToolUseExtra", "PreToolUse"],
  ])("returns %j for %j", (text, expected) => {
    expect(inferHookTrigger(text)).toBe(expected);
  });
});

describe("inferStructuredFields", () => {
  it("infers single-line MCP install commands from the first code block", () => {
    const inferred = inferStructuredFields(
      {},
      ["## Install", "", "```bash", "npx -y example-mcp", "```"].join("\n"),
      "mcp",
    );
    expect(inferred.installCommand).toBe("npx -y example-mcp");
    expect(inferred.installable).toBe(true);
    expect(inferred.copySnippet).toBe("npx -y example-mcp");
  });

  it("infers command syntax from usage code block and slash title", () => {
    const inferred = inferStructuredFields(
      { title: "/demo run" },
      ["## Usage", "", "```text", "/demo run target", "```"].join("\n"),
      "commands",
    );
    expect(inferred).toMatchObject({
      commandSyntax: "/demo run target",
      installCommand: "/demo run target",
      usageSnippet: "/demo run target",
    });
  });

  it("infers capability-pack skill metadata and download install command", () => {
    const inferred = inferStructuredFields(
      {
        slug: "review-capability-pack",
        downloadUrl: "/downloads/skills/review.zip",
        documentationUrl: "https://docs.example/skill",
      },
      "Lead paragraph for the skill.\n\n## Usage\n\nUse it.",
      "skills",
    );
    expect(inferred).toMatchObject({
      installable: true,
      skillType: "capability-pack",
      skillLevel: "expert",
      verificationStatus: "validated",
      retrievalSources: ["https://docs.example/skill"],
      usageSnippet: "Lead paragraph for the skill.",
    });
    expect(inferred.installCommand).toContain("curl -L");
    expect(inferred.installCommand).toContain("review.zip");
  });

  it("uses body as copySnippet for rules without explicit copySnippet", () => {
    const body = "## Rule Body\n\nUse these rules.";
    const inferred = inferStructuredFields(
      { usageSnippet: "Short usage" },
      body,
      "rules",
    );
    expect(inferred.copySnippet).toBe(body);
  });

  it("infers hook trigger from combined text", () => {
    const inferred = inferStructuredFields(
      { description: "Runs on PreToolUse" },
      "#!/bin/bash\necho ok",
      "hooks",
    );
    expect(inferred.trigger).toBe("PreToolUse");
  });

  it.each([
    ["agents", false],
    ["guides", false],
    ["collections", false],
    ["mcp", true],
    ["skills", true],
    ["hooks", true],
    ["commands", true],
    ["statuslines", true],
    ["rules", false],
    ["tools", false],
  ])("sets default installable for %s to %s", (category, installable) => {
    const inferred = inferStructuredFields({}, "", category);
    expect(inferred.installable).toBe(installable);
  });

  it.each(SKILL_TYPE_VALUES)("accepts explicit skillType %s", (skillType) => {
    const inferred = inferStructuredFields(
      { skillType, description: "Skill" },
      "",
      "skills",
    );
    expect(inferred.skillType).toBe(skillType);
  });

  it.each(SKILL_LEVEL_VALUES)(
    "accepts explicit skillLevel %s",
    (skillLevel) => {
      const inferred = inferStructuredFields(
        { skillLevel, description: "Skill" },
        "",
        "skills",
      );
      expect(inferred.skillLevel).toBe(skillLevel);
    },
  );

  it.each(VERIFICATION_STATUS_VALUES)(
    "accepts explicit verificationStatus %s",
    (status) => {
      const inferred = inferStructuredFields(
        { verificationStatus: status, description: "Skill" },
        "",
        "skills",
      );
      expect(inferred.verificationStatus).toBe(status);
    },
  );
});

describe("validateEntry", () => {
  it.each(CATEGORIES)(
    "reports missing required fields for incomplete %s entries",
    (category) => {
      const result = validateEntry(category, { slug: "demo" });
      expect(result.missingRequired.length).toBeGreaterThan(0);
      expect(result.missingRequired).toContain("title");
      expect(result.missingRequired).toContain("description");
      expect(result.missingRequired).toContain("cardDescription");
    },
  );

  it.each(CATEGORIES)(
    "accepts complete base entries for %s when requirements are met",
    (category) => {
      const data =
        category === "tools"
          ? VALID_TOOL
          : category === "skills"
            ? VALID_SKILL
            : BASE_ENTRY;
      const inferred =
        category === "skills"
          ? {
              testedPlatforms: VALID_SKILL.testedPlatforms,
              skillType: VALID_SKILL.skillType,
              skillLevel: VALID_SKILL.skillLevel,
              verificationStatus: VALID_SKILL.verificationStatus,
            }
          : {};
      const result = validateEntry(category, data, inferred);
      expect(result.missingRequired).toEqual([]);
    },
  );

  it.each([
    "Bad Slug",
    "demo--entry",
    "Demo",
    "demo_underscore",
    "-leading",
    "trailing-",
    "has space",
    "UPPER",
  ])("rejects invalid slug %j", (slug) => {
    const result = validateEntry("agents", { ...BASE_ENTRY, slug });
    expect(result.semanticErrors).toContain(
      "slug must contain only lowercase letters, numbers, and single hyphens",
    );
  });

  it.each(["bogus", "template"])(
    "rejects invalid skillType %j",
    (skillType) => {
      const result = validateEntry(
        "skills",
        { ...VALID_SKILL, skillType },
        { skillType },
      );
      expect(
        result.enumErrors.some((error) => error.includes("skillType")),
      ).toBe(true);
    },
  );

  it.each([
    ["editorial", ""],
    ["heyclaude_pick", ""],
    ["sponsored", ""],
    ["claimed", ""],
    ["affiliate", "affiliateUrl"],
    ["bogus", "disclosure"],
  ])("validates tools disclosure %s", (disclosure, missingField) => {
    const result = validateEntry("tools", {
      ...VALID_TOOL,
      disclosure,
      affiliateUrl: disclosure === "affiliate" ? "" : "https://example.com/aff",
    });
    if (missingField === "affiliateUrl") {
      expect(result.semanticErrors).toContain(
        "affiliate tool listings must include affiliateUrl",
      );
      return;
    }
    if (missingField === "disclosure") {
      expect(result.semanticErrors).toContain(
        "disclosure must be editorial, heyclaude_pick, affiliate, sponsored, or claimed",
      );
      return;
    }
    expect(result.semanticErrors).not.toContain(
      "disclosure must be editorial, heyclaude_pick, affiliate, sponsored, or claimed",
    );
  });

  it.each([
    "free",
    "freemium",
    "paid",
    "open-source",
    "subscription",
    "usage-based",
    "contact-sales",
  ])("accepts tools pricingModel %s", (pricingModel) => {
    const result = validateEntry("tools", { ...VALID_TOOL, pricingModel });
    expect(result.semanticErrors).not.toContain(
      "pricingModel is not recognized",
    );
  });

  it("rejects unknown tools pricingModel", () => {
    const result = validateEntry("tools", {
      ...VALID_TOOL,
      pricingModel: "mystery",
    });
    expect(result.semanticErrors).toContain("pricingModel is not recognized");
  });

  it.each(["http://example.com", "ftp://example.com"])(
    "requires https websiteUrl for tools: %s",
    (websiteUrl) => {
      const result = validateEntry("tools", { ...VALID_TOOL, websiteUrl });
      expect(result.semanticErrors).toContain("websiteUrl must use https");
    },
  );

  it("requires https affiliateUrl for tools", () => {
    const result = validateEntry("tools", {
      ...VALID_TOOL,
      affiliateUrl: "http://example.com/affiliate",
      disclosure: "affiliate",
    });
    expect(result.semanticErrors).toContain("affiliateUrl must use https");
  });

  it("rejects affiliateUrl values with embedded userinfo credentials", () => {
    const result = validateEntry("tools", {
      ...VALID_TOOL,
      affiliateUrl: "https://token@example.com/affiliate",
      disclosure: "affiliate",
    });
    expect(result.semanticErrors).toContain("affiliateUrl must use https");
  });
});

describe("orderFrontmatter", () => {
  it("orders known keys and drops empty values", () => {
    expect(
      orderFrontmatter({
        zExtra: "kept last",
        title: "Demo",
        empty: "",
        slug: "demo",
        author: "JSONbored",
        tags: ["mcp"],
      }),
    ).toEqual({
      title: "Demo",
      slug: "demo",
      author: "JSONbored",
      tags: ["mcp"],
      zExtra: "kept last",
    });
  });

  it("keeps null values because only undefined and empty strings are dropped", () => {
    const ordered = orderFrontmatter({
      title: "Demo",
      dropped: null,
      slug: "demo",
    });
    expect(ordered).toEqual({ title: "Demo", slug: "demo", dropped: null });
  });

  it("appends unknown keys after preferred keys", () => {
    const ordered = orderFrontmatter({
      zLast: 1,
      title: "Demo",
      aFirstUnknown: 2,
      slug: "demo",
    });
    expect(Object.keys(ordered)).toEqual([
      "title",
      "slug",
      "zLast",
      "aFirstUnknown",
    ]);
  });
});

describe("inferStructuredFields carries explicit optional fields", () => {
  it("keeps command/script/config fields provided in the frontmatter", () => {
    const inferred = inferStructuredFields(
      {
        title: "T",
        slug: "demo",
        installCommand: "npm i x",
        commandSyntax: "/demo",
        scriptLanguage: "bash",
        scriptBody: "echo hi",
        cardDescription: "Card",
        trigger: "PreToolUse",
        configSnippet: "{}",
        installable: false,
      },
      "Body text.",
      "commands",
    );
    expect(inferred.installCommand).toBe("npm i x");
    expect(inferred.commandSyntax).toBe("/demo");
    expect(inferred.scriptLanguage).toBe("bash");
    expect(inferred.scriptBody).toBe("echo hi");
    expect(inferred.cardDescription).toBe("Card");
    expect(inferred.trigger).toBe("PreToolUse");
    expect(inferred.configSnippet).toBe("{}");
    expect(inferred.installable).toBe(false);
  });

  it("keeps skills verification and tested-platform fields", () => {
    const inferred = inferStructuredFields(
      {
        title: "T",
        slug: "demo",
        verifiedAt: "2026-01-02",
        testedPlatforms: ["Claude", "Codex"],
      },
      "Body.",
      "skills",
    );
    expect(inferred.verifiedAt).toBe("2026-01-02");
    expect(inferred.testedPlatforms).toEqual(["Claude", "Codex"]);
  });

  it("Date-guards unquoted YAML dateAdded when deriving verifiedAt", () => {
    const source = [
      "---",
      "title: Demo skill",
      "slug: demo-skill",
      "description: Demo",
      "dateAdded: 2025-09-18",
      "---",
      "Body.",
    ].join("\n");
    const { data } = parseSafeFrontmatter(source);
    expect(data.dateAdded).toBeInstanceOf(Date);

    const before = String(data.dateAdded).trim();
    expect(before).not.toMatch(/^\d{4}-\d{2}-\d{2}$/);

    const inferred = inferStructuredFields(data, "Body.", "skills");
    expect(inferred.verifiedAt).toBe("2025-09-18");
    expect(inferred.verifiedAt).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });

  it("keeps quoted-string dateAdded verifiedAt fallback unchanged", () => {
    const inferred = inferStructuredFields(
      {
        title: "T",
        slug: "demo",
        dateAdded: "2025-09-18",
      },
      "Body.",
      "skills",
    );
    expect(inferred.verifiedAt).toBe("2025-09-18");
  });

  it("drops copySnippet/usageSnippet from an agents entry's recommended gaps", () => {
    const result = validateEntry("agents", {
      slug: "a",
      title: "A",
      description: "D",
      copySnippet: "CS",
      usageSnippet: "US",
    });
    expect(result.missingRecommended).not.toContain("copySnippet");
    expect(result.missingRecommended).not.toContain("usageSnippet");
  });
});

describe("deriveSeoFields title fallbacks", () => {
  it("uses the raw category as the label when it is unknown", () => {
    expect(deriveSeoFields({ title: "T" }, "zzz-unknown").seoTitle).toBe(
      "T - zzz-unknown for Claude",
    );
  });

  it("falls back from title to name, then slug, then 'Entry'", () => {
    expect(deriveSeoFields({ name: "ByName" }, "mcp").seoTitle).toBe(
      "ByName - MCP Servers for Claude",
    );
    expect(deriveSeoFields({ slug: "by-slug" }, "mcp").seoTitle).toBe(
      "by-slug - MCP Servers for Claude",
    );
    expect(deriveSeoFields({}, "mcp").seoTitle).toBe(
      "Entry - MCP Servers for Claude",
    );
  });

  it("omits the label suffix when no category is given", () => {
    expect(deriveSeoFields({ title: "NoCat" }).seoTitle).toBe("NoCat");
  });

  it("includes explicit keywords in the derived keyword set", () => {
    expect(
      deriveSeoFields({ title: "K", keywords: ["a", "b"] }, "mcp").keywords,
    ).toEqual(expect.arrayContaining(["a", "b"]));
  });
});

describe("validateEntry brand color and source URL checks", () => {
  const base = { slug: "a", title: "A", description: "D" };

  it("validates comma-separated brandColors and flags a non-hex value", () => {
    expect(
      validateEntry("mcp", { ...base, brandColors: "#796eff, notahex" })
        .semanticErrors,
    ).toContain("brandColors must be hex colors such as #796eff");
    expect(
      validateEntry("mcp", { ...base, brandColors: "#796eff" }).semanticErrors,
    ).not.toContain("brandColors must be hex colors such as #796eff");
  });

  it("flags a sourceUrls entry that is not an http(s) URL", () => {
    expect(
      validateEntry("mcp", {
        ...base,
        sourceUrls: ["https://ok.dev", "not-a-url"],
      }).semanticErrors,
    ).toContain("sourceUrls must use http or https");
  });
});

describe("content-schema text-utility fallbacks", () => {
  it("falls back to 'section' ids for headings that have no slug", () => {
    const headings = extractHeadings("## !!!\n\ntext\n\n## !!!\n");
    expect(headings.map((h) => h.id)).toEqual(["section", "section-2"]);
  });

  it("ends the usage section at the next ## heading", () => {
    const sections = extractSections("## Usage\n\nintro\n\n## Other\n\nx");
    expect(sections.map((s) => s.title)).toEqual(["Usage", "Other"]);
    expect(sections[0].markdown).toBe("intro");
  });

  it("truncates a long seoDescription at a sentence boundary", () => {
    const longDesc =
      "This is a reasonably long first sentence that should be picked. " +
      "x".repeat(200);
    expect(
      deriveSeoFields({ title: "T", description: longDesc }, "mcp")
        .seoDescription,
    ).toBe("This is a reasonably long first sentence that should be picked.");
  });
});

describe("validateEntry category-specific recommended/semantic rules", () => {
  it("drops installCommand from a skills entry that ships a downloadUrl", () => {
    const result = validateEntry("skills", {
      slug: "s",
      title: "S",
      description: "D",
      downloadUrl: "/downloads/skills/s.zip",
    });
    expect(result.missingRecommended).not.toContain("installCommand");
  });

  it("requires verifiedAt on a capability-pack skill", () => {
    const result = validateEntry("skills", {
      slug: "s",
      title: "S",
      description: "D",
      skillType: "capability-pack",
      retrievalSources: ["https://source.dev"],
    });
    expect(result.semanticErrors).toContain(
      "capability-pack skills must include verifiedAt",
    );
  });

  it("has no required fields for an unknown category", () => {
    const result = validateEntry("totally-unknown-cat", {
      slug: "s",
      title: "S",
    });
    expect(result.missingRequired).toEqual([]);
  });
});

describe("content-schema text-utility edge cases", () => {
  it("hard-truncates a seoDescription with no late word boundary", () => {
    // a long unbroken tail means the last space in the 157-char slice is early,
    // so the description is sliced at the char limit rather than a word boundary
    const description = `short intro then ${"a".repeat(160)}`;
    const seoDescription = deriveSeoFields(
      { title: "T", description },
      "mcp",
    ).seoDescription;
    expect(seoDescription.endsWith("...")).toBe(true);
    expect(seoDescription.length).toBe(160);
  });

  it("does not treat a '## ' line inside a usage code block as a heading", () => {
    const body = [
      "## Usage",
      "",
      "```",
      "## not a heading",
      "run x",
      "```",
    ].join("\n");
    const usageSnippet = inferStructuredFields(
      { title: "T", slug: "s" },
      body,
      "commands",
    ).usageSnippet;
    expect(usageSnippet).toContain("## not a heading");
  });
});
