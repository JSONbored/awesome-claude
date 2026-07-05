import { describe, expect, it } from "vitest";

import {
  parseSafeFrontmatter,
  SAFE_MATTER_OPTIONS,
  UNSAFE_FRONTMATTER_LANGUAGE_ERROR,
} from "../packages/registry/src/frontmatter-lib.js";

const MALFORMED_YAML =
  '---\ntitle: "unclosed\n  bad: : :\n---\nBody after malformed frontmatter';

function fm(yaml: string, body = "Body text") {
  return `---\n${yaml}\n---\n${body}`;
}

describe("UNSAFE_FRONTMATTER_LANGUAGE_ERROR", () => {
  it("is the documented security boundary message", () => {
    expect(UNSAFE_FRONTMATTER_LANGUAGE_ERROR).toBe(
      "Executable JavaScript frontmatter is not allowed in registry content",
    );
  });

  it("is a non-empty string constant", () => {
    expect(typeof UNSAFE_FRONTMATTER_LANGUAGE_ERROR).toBe("string");
    expect(UNSAFE_FRONTMATTER_LANGUAGE_ERROR.length).toBeGreaterThan(0);
  });

  it("matches the error thrown by the javascript engine guard", () => {
    expect(() => SAFE_MATTER_OPTIONS.engines.javascript()).toThrow(
      UNSAFE_FRONTMATTER_LANGUAGE_ERROR,
    );
  });
});

describe("SAFE_MATTER_OPTIONS", () => {
  it("defines a javascript engine override", () => {
    expect(SAFE_MATTER_OPTIONS.engines).toBeDefined();
    expect(typeof SAFE_MATTER_OPTIONS.engines.javascript).toBe("function");
  });

  it("throws the unsafe-language error instead of executing code", () => {
    expect(() => SAFE_MATTER_OPTIONS.engines.javascript()).toThrow(
      UNSAFE_FRONTMATTER_LANGUAGE_ERROR,
    );
  });

  it("does not mutate global state when invoked", () => {
    const sentinel = `__frontmatterLibTest_${process.pid}_${Date.now()}`;
    globalThis[sentinel] = false;
    try {
      expect(() => SAFE_MATTER_OPTIONS.engines.javascript()).toThrow();
      expect(globalThis[sentinel]).toBe(false);
    } finally {
      delete globalThis[sentinel];
    }
  });

  it("always throws an Error instance from the javascript engine", () => {
    try {
      SAFE_MATTER_OPTIONS.engines.javascript();
      expect.fail("expected javascript engine to throw");
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
      expect((error as Error).message).toBe(UNSAFE_FRONTMATTER_LANGUAGE_ERROR);
    }
  });
});

describe("parseSafeFrontmatter — YAML frontmatter", () => {
  it("separates frontmatter data from body content", () => {
    const result = parseSafeFrontmatter(fm("title: Hello\ntags: [a, b]"));
    expect(result.data).toEqual({ title: "Hello", tags: ["a", "b"] });
    expect(result.content.trim()).toBe("Body text");
  });

  it.each([
    ["title", "title: Simple Title", { title: "Simple Title" }],
    ["slug", "slug: my-entry", { slug: "my-entry" }],
    ["category", "category: hooks", { category: "hooks" }],
    [
      "description",
      "description: A short blurb",
      { description: "A short blurb" },
    ],
    ["published", "published: true", { published: true }],
    ["featured", "featured: false", { featured: false }],
    ["count", "count: 42", { count: 42 }],
    ["rating", "rating: 3.14", { rating: 3.14 }],
    ["version", "version: 1.0.0", { version: "1.0.0" }],
    ["empty-string", 'empty: ""', { empty: "" }],
    ["null-value", "nullable: null", { nullable: null }],
  ] as const)("parses scalar field %s", (_label, yaml, expected) => {
    expect(parseSafeFrontmatter(fm(yaml)).data).toEqual(expected);
  });

  it.each([
    ["tags", "tags: [alpha, beta, gamma]", ["alpha", "beta", "gamma"]],
    [
      "platforms",
      "platforms: [macos, linux, windows]",
      ["macos", "linux", "windows"],
    ],
    ["numbers", "values: [1, 2, 3]", [1, 2, 3]],
    ["booleans", "flags: [true, false, true]", [true, false, true]],
    ["empty-array", "items: []", []],
    ["single-item", "items: [only]", ["only"]],
  ] as const)("parses array field %s", (_label, yaml, expected) => {
    expect(parseSafeFrontmatter(fm(yaml)).data).toMatchObject({
      [yaml.split(":")[0]!.trim()]: expected,
    });
  });

  it("parses nested objects", () => {
    const yaml = [
      "metadata:",
      "  author: Jane Doe",
      "  license: MIT",
      "  stats:",
      "    stars: 100",
      "    forks: 25",
    ].join("\n");
    const result = parseSafeFrontmatter(fm(yaml));
    expect(result.data).toEqual({
      metadata: {
        author: "Jane Doe",
        license: "MIT",
        stats: { stars: 100, forks: 25 },
      },
    });
  });

  it.each([
    [
      "folded-block",
      "summary: >\n  Line one\n  Line two",
      { summary: "Line one Line two\n" },
    ],
    [
      "literal-block",
      "readme: |\n  Line one\n  Line two",
      { readme: "Line one\nLine two\n" },
    ],
    [
      "quoted-multiline",
      'notes: "first line\nsecond line"',
      { notes: "first line second line" },
    ],
    [
      "single-quoted-multiline",
      "notes: 'first line\nsecond line'",
      { notes: "first line second line" },
    ],
  ] as const)("parses multiline value style %s", (_label, yaml, expected) => {
    expect(parseSafeFrontmatter(fm(yaml)).data).toEqual(expected);
  });

  it("parses multiple top-level keys together", () => {
    const yaml = [
      "title: Registry Entry",
      "slug: registry-entry",
      "category: mcp",
      "tags: [search, api]",
      "featured: true",
      "priority: 10",
    ].join("\n");
    expect(parseSafeFrontmatter(fm(yaml)).data).toEqual({
      title: "Registry Entry",
      slug: "registry-entry",
      category: "mcp",
      tags: ["search", "api"],
      featured: true,
      priority: 10,
    });
  });

  it("preserves body content including leading and trailing whitespace", () => {
    const body = "\n\n# Heading\n\nParagraph with spaces  \n";
    const result = parseSafeFrontmatter(fm("title: x", body));
    expect(result.content).toBe(body);
  });

  it("returns empty data object when frontmatter block is empty", () => {
    const result = parseSafeFrontmatter("---\n---\nOnly body");
    expect(result.data).toEqual({});
    expect(result.content).toBe("Only body");
  });

  it("treats content without frontmatter fences as plain body", () => {
    const plain = "# No frontmatter\n\nJust markdown.";
    const result = parseSafeFrontmatter(plain);
    expect(result.data).toEqual({});
    expect(result.content).toBe(plain);
  });
});

describe("parseSafeFrontmatter — BOM strip", () => {
  it("strips a leading byte-order mark before parsing", () => {
    const result = parseSafeFrontmatter("\uFEFF---\ntitle: BOM\n---\nx");
    expect(result.data.title).toBe("BOM");
    expect(result.content).toBe("x");
  });

  it.each([
    ["before opening fence", "\uFEFF---\ntitle: One\n---\nbody"],
    ["before yaml key", "---\n\uFEFFtitle: Two\n---\nbody"],
    ["only BOM", "\uFEFF"],
    ["BOM with empty body after fences", "\uFEFF---\n---\n"],
  ] as const)("handles BOM case: %s", (_label, source) => {
    expect(() => parseSafeFrontmatter(source)).not.toThrow();
  });

  it("does not strip BOM characters that appear after the opening fence", () => {
    const result = parseSafeFrontmatter(
      "---\ntitle: \uFEFFPrefixed\n---\nbody",
    );
    expect(result.data.title).toBe("\uFEFFPrefixed");
  });

  it("does not strip BOM from the body content", () => {
    const result = parseSafeFrontmatter("---\ntitle: x\n---\n\uFEFFbody");
    expect(result.content).toBe("\uFEFFbody");
  });
});

describe("parseSafeFrontmatter — javascript engine blocked", () => {
  it("rejects executable JavaScript frontmatter as a security boundary", () => {
    expect(() =>
      parseSafeFrontmatter('---js\nmodule.exports = { title: "x" }\n---\nbody'),
    ).toThrow(UNSAFE_FRONTMATTER_LANGUAGE_ERROR);
  });

  it.each([
    ["---js", '---js\nmodule.exports = { title: "js" }\n---\nbody'],
    [
      "---javascript",
      '---javascript\nmodule.exports = { title: "javascript" }\n---\nbody',
    ],
    [
      "assignment side effect",
      "---js\nglobalThis.__pwned = true;\nmodule.exports = {};\n---\nbody",
    ],
    [
      "require attempt",
      '---js\nconst fs = require("fs");\nmodule.exports = {};\n---\nbody',
    ],
    [
      "function export",
      "---js\nmodule.exports = function () { return { evil: true }; };\n---\nbody",
    ],
  ] as const)("blocks javascript frontmatter variant: %s", (_label, source) => {
    expect(() => parseSafeFrontmatter(source)).toThrow(
      UNSAFE_FRONTMATTER_LANGUAGE_ERROR,
    );
  });

  it("rejects spaced javascript fence labels without executing code", () => {
    expect(() =>
      parseSafeFrontmatter(
        '--- js ---\nmodule.exports = { title: "spaced" }\n---\nbody',
      ),
    ).toThrow(/not registered|Executable JavaScript frontmatter/);
  });

  it("does not execute javascript frontmatter body code", () => {
    const sentinel = `__frontmatterLibExecuted_${process.pid}_${Date.now()}`;
    globalThis[sentinel] = false;
    const source = [
      "---js",
      `globalThis[${JSON.stringify(sentinel)}] = true;`,
      'module.exports = { title: "Pwned" };',
      "---",
      "Body content.",
    ].join("\n");

    try {
      expect(() => parseSafeFrontmatter(source)).toThrow(
        UNSAFE_FRONTMATTER_LANGUAGE_ERROR,
      );
      expect(globalThis[sentinel]).toBe(false);
    } finally {
      delete globalThis[sentinel];
    }
  });

  it("still parses standard YAML after rejecting javascript engines", () => {
    const result = parseSafeFrontmatter(fm("title: Safe YAML"));
    expect(result.data).toEqual({ title: "Safe YAML" });
  });
});

describe("parseSafeFrontmatter — fallbackOnError", () => {
  it("returns a safe fallback for malformed YAML when fallbackOnError is set", () => {
    const result = parseSafeFrontmatter(MALFORMED_YAML, {
      fallbackOnError: true,
    });
    expect(result.data).toEqual({});
    expect(result.error).toBeTruthy();
    expect(result.content).toBe(MALFORMED_YAML);
  });

  it("rethrows malformed YAML when no fallback is requested", () => {
    expect(() => parseSafeFrontmatter(MALFORMED_YAML)).toThrow();
  });

  it.each([
    ["unclosed flow sequence", "---\ntags: [a, b\n---\nbody"],
    ["duplicate colons", "---\nkey: value: extra: broken\n---\nbody"],
    ["binary tag", "---\n!!binary |\n  ???\n---\nbody"],
    ["unclosed double quote", '---\ntitle: "open\n---\nbody'],
    ["unclosed single quote", "---\ntitle: 'open\n---\nbody"],
    ["invalid escape", '---\ntitle: "\\q"\n---\nbody'],
    ["flow mapping typo", "---\nmeta: {a: 1,\n---\nbody"],
  ] as const)("uses fallback for invalid YAML: %s", (_label, source) => {
    const result = parseSafeFrontmatter(source, { fallbackOnError: true });
    expect(result.data).toEqual({});
    expect(result.error).toBeTruthy();
    expect(result.content).toBe(source);
  });

  it("does not swallow the javascript security error when fallbackOnError is set", () => {
    expect(() =>
      parseSafeFrontmatter(
        '---js\nmodule.exports = { title: "x" }\n---\nbody',
        { fallbackOnError: true },
      ),
    ).toThrow(UNSAFE_FRONTMATTER_LANGUAGE_ERROR);
  });

  it("preserves the original input string in fallback content", () => {
    const source = "---\n: bad\n---\nTail";
    const result = parseSafeFrontmatter(source, { fallbackOnError: true });
    expect(result.content).toBe(source);
  });

  it("returns an error value without excerpt, language, or matter fields", () => {
    const result = parseSafeFrontmatter(MALFORMED_YAML, {
      fallbackOnError: true,
    });
    expect(result.error).toBeDefined();
    expect(result.excerpt).toBeUndefined();
    expect(result.language).toBeUndefined();
    expect(result.matter).toBeUndefined();
  });
});

describe("parseSafeFrontmatter — empty and nullish input", () => {
  it("treats nullish input as empty frontmatter and body", () => {
    const nullResult = parseSafeFrontmatter(null);
    expect(nullResult.data).toEqual({});
    expect(nullResult.content).toBe("");

    const undefinedResult = parseSafeFrontmatter(undefined);
    expect(undefinedResult.data).toEqual({});
    expect(undefinedResult.content).toBe("");
  });

  it.each([
    ["empty string", ""],
    ["whitespace only", "   \n\t  "],
    ["single newline", "\n"],
  ] as const)("coerces %s to empty parse result", (_label, value) => {
    const result = parseSafeFrontmatter(value);
    expect(result.data).toEqual({});
    expect(result.content).toBe(String(value).replace(/^\uFEFF/, ""));
  });

  it("coerces numeric input through String()", () => {
    const result = parseSafeFrontmatter(0);
    expect(result.data).toEqual({});
    expect(result.content).toBe("0");
  });

  it("coerces boolean input through String()", () => {
    expect(parseSafeFrontmatter(false).content).toBe("false");
    expect(parseSafeFrontmatter(true).content).toBe("true");
  });
});

describe("parseSafeFrontmatter — return shape", () => {
  it("normalizes missing parsed.data to an empty object", () => {
    const result = parseSafeFrontmatter("---\n---\nBody");
    expect(result.data).toEqual({});
  });

  it("normalizes missing parsed.content to an empty string", () => {
    const result = parseSafeFrontmatter("---\ntitle: only\n---\n");
    expect(result.content).toBe("");
  });

  it("includes gray-matter metadata fields on successful parse", () => {
    const result = parseSafeFrontmatter(fm("title: Meta"));
    expect(result.language).toBeDefined();
    expect(result.matter).toBeDefined();
    expect(typeof result.matter).toBe("string");
  });

  it("does not attach an error field on successful parse", () => {
    const result = parseSafeFrontmatter(fm("title: Clean"));
    expect("error" in result).toBe(false);
  });
});

describe("parseSafeFrontmatter — registry-like fixtures", () => {
  const REGISTRY_FIXTURES = [
    {
      name: "hook entry",
      yaml: [
        "title: Statusline Hook",
        "slug: statusline-hook",
        "category: hooks",
        "platforms: [macos, linux]",
        "tags: [statusline, productivity]",
      ].join("\n"),
      expected: {
        title: "Statusline Hook",
        slug: "statusline-hook",
        category: "hooks",
        platforms: ["macos", "linux"],
        tags: ["statusline", "productivity"],
      },
    },
    {
      name: "mcp entry",
      yaml: [
        "title: GitHub MCP",
        "slug: github-mcp",
        "category: mcp",
        "featured: true",
        "metadata:",
        "  publisher: Example Org",
      ].join("\n"),
      expected: {
        title: "GitHub MCP",
        slug: "github-mcp",
        category: "mcp",
        featured: true,
        metadata: { publisher: "Example Org" },
      },
    },
    {
      name: "skill entry",
      yaml: [
        "title: Code Review Skill",
        "slug: code-review-skill",
        "category: skills",
        "description: |",
        "  Helps review pull requests",
        "  with consistent criteria.",
      ].join("\n"),
      expected: {
        title: "Code Review Skill",
        slug: "code-review-skill",
        category: "skills",
        description: "Helps review pull requests\nwith consistent criteria.\n",
      },
    },
  ] as const;

  it.each(REGISTRY_FIXTURES)(
    "parses realistic registry frontmatter: $name",
    ({ yaml, expected }) => {
      expect(parseSafeFrontmatter(fm(yaml)).data).toEqual(expected);
    },
  );
});

describe("parseSafeFrontmatter — body extraction edge cases", () => {
  it.each([
    ["markdown heading", "# Title\n\nParagraph"],
    ["code fence", "```ts\nconst x = 1;\n```"],
    ["html block", "<div>content</div>"],
    ["frontmatter-like text in body", "---\nnot: frontmatter\n---"],
    ["windows newlines", "line1\r\nline2"],
  ] as const)("preserves body variant: %s", (_label, body) => {
    const result = parseSafeFrontmatter(fm("title: x", body));
    expect(result.content).toBe(body);
  });

  it("extracts body after closing fence even with trailing document content", () => {
    const body = "First paragraph.\n\nSecond paragraph.";
    const result = parseSafeFrontmatter(fm("title: x", body));
    expect(result.content).toBe(body);
    expect(result.data.title).toBe("x");
  });

  it("leaves markdown horizontal rules untouched when no opening fence exists", () => {
    const source = "-- -\n\nParagraph after a horizontal rule.";
    const result = parseSafeFrontmatter(source);
    expect(result.data).toEqual({});
    expect(result.content).toBe(source);
  });
});

describe("parseSafeFrontmatter — YAML scalar coercion", () => {
  it.each([
    ["yaml-bool-yes", "enabled: yes", "yes"],
    ["yaml-bool-no", "enabled: no", "no"],
    ["yaml-bool-on", "enabled: on", "on"],
    ["yaml-bool-off", "enabled: off", "off"],
    ["true-string", "enabled: true", true],
    ["false-string", "enabled: false", false],
    ["integer", "count: 0", 0],
    ["negative", "offset: -5", -5],
    ["float", "ratio: 0.5", 0.5],
    ["scientific", "scale: 1e3", 1000],
  ] as const)("coerces yaml scalar %s", (_label, yaml, expected) => {
    const key = yaml.split(":")[0]!.trim();
    expect(parseSafeFrontmatter(fm(yaml)).data[key]).toEqual(expected);
  });
});

describe("parseSafeFrontmatter — duplicate and ordering behavior", () => {
  it("throws when duplicate mapping keys appear in YAML", () => {
    const yaml = "title: First\ntitle: Second\ntitle: Final";
    expect(() => parseSafeFrontmatter(fm(yaml))).toThrow(
      /duplicated mapping key/,
    );
  });

  it("falls back when duplicate mapping keys appear and fallbackOnError is set", () => {
    const yaml = "title: First\ntitle: Second";
    const source = fm(yaml);
    const result = parseSafeFrontmatter(source, { fallbackOnError: true });
    expect(result.data).toEqual({});
    expect(result.error).toBeTruthy();
    expect(result.content).toBe(source);
  });

  it("preserves array order", () => {
    const yaml = "tags: [z, a, m, b]";
    expect(parseSafeFrontmatter(fm(yaml)).data.tags).toEqual([
      "z",
      "a",
      "m",
      "b",
    ]);
  });

  it("preserves nested key order in object values", () => {
    const yaml = ["meta:", "  first: 1", "  second: 2", "  third: 3"].join(
      "\n",
    );
    expect(parseSafeFrontmatter(fm(yaml)).data.meta).toEqual({
      first: 1,
      second: 2,
      third: 3,
    });
  });
});

describe("parseSafeFrontmatter — options handling", () => {
  it("accepts an empty options object", () => {
    const result = parseSafeFrontmatter(fm("title: ok"), {});
    expect(result.data).toEqual({ title: "ok" });
  });

  it("ignores unknown option keys", () => {
    const result = parseSafeFrontmatter(fm("title: ok"), {
      fallbackOnError: false,
      // @ts-expect-error exercising runtime tolerance for extra keys
      unknownOption: true,
    });
    expect(result.data).toEqual({ title: "ok" });
  });

  it("does not use fallback when fallbackOnError is explicitly false", () => {
    expect(() =>
      parseSafeFrontmatter(MALFORMED_YAML, { fallbackOnError: false }),
    ).toThrow();
  });
});

describe("parseSafeFrontmatter — verified invalid YAML corpus", () => {
  const INVALID_YAML = [
    '---\ntitle: "open string\n---\nbody',
    "---\ntags: [a, b\n---\nbody",
    "---\nkey: value: extra: broken\n---\nbody",
    "---\n!!binary |\n  ???\n---\nbody",
    '---\ntitle: "\\q"\n---\nbody',
    "---\nmeta: {a: 1,\n---\nbody",
    "---\n[unclosed\n---\nbody",
    "---\nkey: \n  nested: [\n---\nbody",
    "---\n*bad\n---\nbody",
    '---\ntitle: "unclosed\n  bad: : :\n---\nbody',
  ] as const;

  it.each(INVALID_YAML)("throws on invalid YAML: %s", (source) => {
    expect(() => parseSafeFrontmatter(source)).toThrow();
  });

  it.each(INVALID_YAML)(
    "fallbackOnError recovers invalid YAML: %s",
    (source) => {
      const result = parseSafeFrontmatter(source, { fallbackOnError: true });
      expect(result.data).toEqual({});
      expect(result.error).toBeTruthy();
      expect(result.content).toBe(source);
    },
  );
});

describe("parseSafeFrontmatter — multiline and whitespace in keys/values", () => {
  it.each([
    [
      "quoted key path",
      'author.name: "Jane Doe"',
      { "author.name": "Jane Doe" },
    ],
    [
      "value with colon",
      'url: "https://example.com/path:segment"',
      { url: "https://example.com/path:segment" },
    ],
    ["value with hash", 'note: "contains # hash"', { note: "contains # hash" }],
    [
      "leading spaces in quoted value",
      'title: "  padded  "',
      { title: "  padded  " },
    ],
    ["empty key mapping", "empty-key: ''", { "empty-key": "" }],
  ] as const)("handles special scalar %s", (_label, yaml, expected) => {
    expect(parseSafeFrontmatter(fm(yaml)).data).toEqual(expected);
  });

  it("parses long multiline literal blocks", () => {
    const lines = Array.from(
      { length: 8 },
      (_, index) => `  line-${index + 1}`,
    );
    const yaml = ["description: |", ...lines].join("\n");
    const expected = `${lines.map((line) => line.trimStart()).join("\n")}\n`;
    expect(parseSafeFrontmatter(fm(yaml)).data.description).toBe(expected);
  });
});

describe("parseSafeFrontmatter — array and object combinations", () => {
  it("parses arrays of objects", () => {
    const yaml = [
      "links:",
      "  - label: Docs",
      "    url: https://example.com/docs",
      "  - label: Repo",
      "    url: https://example.com/repo",
    ].join("\n");
    expect(parseSafeFrontmatter(fm(yaml)).data.links).toEqual([
      { label: "Docs", url: "https://example.com/docs" },
      { label: "Repo", url: "https://example.com/repo" },
    ]);
  });

  it("parses objects containing arrays of scalars and objects", () => {
    const yaml = [
      "bundle:",
      "  name: toolkit",
      "  tags: [a, b]",
      "  items:",
      "    - id: one",
      "    - id: two",
    ].join("\n");
    expect(parseSafeFrontmatter(fm(yaml)).data.bundle).toEqual({
      name: "toolkit",
      tags: ["a", "b"],
      items: [{ id: "one" }, { id: "two" }],
    });
  });

  it.each([
    [
      "nested arrays",
      "matrix: [[1, 2], [3, 4]]",
      [
        [1, 2],
        [3, 4],
      ],
    ],
    ["mixed array", "mixed: [1, true, null, foo]", [1, true, null, "foo"]],
    ["inline object", "meta: { a: 1, b: two }", { a: 1, b: "two" }],
  ] as const)("parses structured value %s", (_label, yaml, expected) => {
    const key = yaml.split(":")[0]!.trim();
    expect(parseSafeFrontmatter(fm(yaml)).data[key]).toEqual(expected);
  });
});

describe("parseSafeFrontmatter — stable behavior across repeated calls", () => {
  const SOURCE = fm("title: Stable\ncount: 3", "Same body");

  it("returns equivalent data on repeated parses", () => {
    const first = parseSafeFrontmatter(SOURCE);
    const second = parseSafeFrontmatter(SOURCE);
    expect(second.data).toEqual(first.data);
    expect(second.content).toBe(first.content);
  });

  it("does not mutate the input string", () => {
    const copy = SOURCE;
    parseSafeFrontmatter(copy);
    expect(copy).toBe(SOURCE);
  });
});

describe("parseSafeFrontmatter — registry category values", () => {
  it.each([
    "hooks",
    "mcp",
    "skills",
    "agents",
    "rules",
    "commands",
    "plugins",
    "themes",
    "tools",
    "workflows",
    "prompts",
    "templates",
    "guides",
    "integrations",
    "extensions",
  ] as const)("accepts category value %s", (category) => {
    expect(
      parseSafeFrontmatter(fm(`category: ${category}`)).data.category,
    ).toBe(category);
  });
});

describe("parseSafeFrontmatter — slug and title patterns", () => {
  it.each([
    ["kebab-case", "my-entry-slug", "my-entry-slug"],
    ["snake_case", "my_entry_slug", "my_entry_slug"],
    ["digits", "entry-2024", "entry-2024"],
    ["short", "a", "a"],
    ["long", "a".repeat(64), "a".repeat(64)],
    ["mixed separators", "foo-bar_baz.qux", "foo-bar_baz.qux"],
  ] as const)("parses slug pattern %s", (_label, slug, expected) => {
    expect(parseSafeFrontmatter(fm(`slug: ${slug}`)).data.slug).toBe(expected);
  });

  it.each([
    ["plain", "Simple Title", "Simple Title"],
    ["quoted", '"Quoted Title"', "Quoted Title"],
    ["unicode", "Café Résumé", "Café Résumé"],
    ["emoji", "Launch 🚀", "Launch 🚀"],
    ["punctuation", "Build & Deploy (v2)", "Build & Deploy (v2)"],
  ] as const)("parses title pattern %s", (_label, raw, expected) => {
    expect(parseSafeFrontmatter(fm(`title: ${raw}`)).data.title).toBe(expected);
  });
});

describe("parseSafeFrontmatter — YAML comments and ignored lines", () => {
  it("ignores full-line comments in frontmatter", () => {
    const yaml = [
      "# top comment",
      "title: Commented",
      "# trailing comment",
    ].join("\n");
    expect(parseSafeFrontmatter(fm(yaml)).data).toEqual({ title: "Commented" });
  });

  it.each([
    ["inline comment", "title: Hello # greeting", { title: "Hello" }],
    ["comment before key", "# meta\nslug: entry", { slug: "entry" }],
    ["multiple comments", "# a\n# b\ncount: 1", { count: 1 }],
  ] as const)("handles comment case %s", (_label, yaml, expected) => {
    expect(parseSafeFrontmatter(fm(yaml)).data).toEqual(expected);
  });
});

describe("parseSafeFrontmatter — string and unicode values", () => {
  it.each([
    ["german umlaut", "author: Müller", "Müller"],
    ["cjk", "label: 日本語", "日本語"],
    ["rtl", "label: العربية", "العربية"],
    ["escaped newline", 'text: "line\\nbreak"', "line\nbreak"],
    ["escaped tab", 'text: "a\\tb"', "a\tb"],
    ["backslash", 'text: "a\\\\b"', "a\\b"],
  ] as const)("preserves string value for %s", (_label, yaml, expected) => {
    const key = yaml.split(":")[0]!.trim();
    expect(parseSafeFrontmatter(fm(yaml)).data[key]).toBe(expected);
  });
});

describe("parseSafeFrontmatter — gray-matter matter payload", () => {
  it("captures the raw frontmatter block without fences", () => {
    const result = parseSafeFrontmatter(fm("title: Raw\nslug: block"));
    expect(result.matter).toContain("title: Raw");
    expect(result.matter).toContain("slug: block");
    expect(result.matter).not.toContain("---");
  });

  it.each([
    ["yaml default language", fm("title: Lang"), "yaml"],
    ["empty frontmatter", "---\n---\nBody", "yaml"],
  ] as const)(
    "records language metadata for %s",
    (_label, source, expectedLanguage) => {
      const result = parseSafeFrontmatter(source);
      expect(result.language).toBe(expectedLanguage);
    },
  );
});

describe("parseSafeFrontmatter — coerced non-string inputs", () => {
  it.each([
    ["bigint", 42n, "42"],
    ["array", ["not", "frontmatter"], "not,frontmatter"],
    ["object", { title: "x" }, "[object Object]"],
  ] as const)(
    "stringifies %s input before parsing",
    (_label, value, expectedContent) => {
      const result = parseSafeFrontmatter(value);
      expect(result.data).toEqual({});
      expect(result.content).toBe(expectedContent);
    },
  );
});

describe("parseSafeFrontmatter — tag list normalization", () => {
  it.each([
    ["two tags", "tags: [one, two]", ["one", "two"]],
    ["three tags", "tags: [alpha, beta, gamma]", ["alpha", "beta", "gamma"]],
    ["quoted tags", 'tags: ["one", "two"]', ["one", "two"]],
    ["mixed quoting", "tags: [one, 'two', \"three\"]", ["one", "two", "three"]],
  ] as const)("parses tag list %s", (_label, yaml, expected) => {
    expect(parseSafeFrontmatter(fm(yaml)).data.tags).toEqual(expected);
  });
});

describe("parseSafeFrontmatter — platform and access fields", () => {
  it.each([
    [
      "platforms",
      "platforms: [macos, linux, windows]",
      ["macos", "linux", "windows"],
    ],
    ["access", "access: public", "public"],
    ["license", "license: MIT", "MIT"],
    ["homepage", "homepage: https://example.com", "https://example.com"],
    [
      "repository",
      "repository: https://github.com/org/repo",
      "https://github.com/org/repo",
    ],
  ] as const)("parses metadata field %s", (_label, yaml, expected) => {
    const key = yaml.split(":")[0]!.trim();
    expect(parseSafeFrontmatter(fm(yaml)).data[key]).toEqual(expected);
  });
});

describe("parseSafeFrontmatter — additional scalar fields", () => {
  it.each([
    ["status", "status: active", "active"],
    ["visibility", "visibility: public", "public"],
    ["owner", "owner: team-platform", "team-platform"],
    ["version", "version: 2.1.0", "2.1.0"],
    ["priority", "priority: high", "high"],
    ["kind", "kind: integration", "integration"],
    ["format", "format: mdx", "mdx"],
    ["locale", "locale: en-US", "en-US"],
    ["region", "region: global", "global"],
    ["tier", "tier: community", "community"],
  ] as const)("parses metadata scalar %s", (_label, yaml, expected) => {
    const key = yaml.split(":")[0]!.trim();
    expect(parseSafeFrontmatter(fm(yaml)).data[key]).toBe(expected);
  });
});

describe("parseSafeFrontmatter — excerpt field", () => {
  it("returns an empty excerpt string for standard yaml frontmatter", () => {
    const result = parseSafeFrontmatter(fm("title: No excerpt"));
    expect(result.excerpt).toBe("");
  });

  it("does not populate excerpt in fallback results", () => {
    const result = parseSafeFrontmatter(MALFORMED_YAML, {
      fallbackOnError: true,
    });
    expect(result.excerpt).toBeUndefined();
  });
});

describe("parseSafeFrontmatter — body-only documents", () => {
  it.each([
    ["single line", "Just one line"],
    ["multiple paragraphs", "First\n\nSecond"],
    ["yaml-like prose", "Use three dashes --- in prose"],
    ["json blob", '{"title":"inline"}'],
  ] as const)("returns plain body for %s", (_label, body) => {
    const result = parseSafeFrontmatter(body);
    expect(result.data).toEqual({});
    expect(result.content).toBe(body);
  });
});

describe("parseSafeFrontmatter — indented frontmatter edge cases", () => {
  it("accepts indented mapping entries inside a frontmatter block", () => {
    const source = "---\n  title: Indented\n---\nbody";
    const result = parseSafeFrontmatter(source);
    expect(result.data).toEqual({ title: "Indented" });
    expect(result.content).toBe("body");
  });

  it.each([
    [
      "nested mapping",
      "---\nmeta:\n  tier: pro\n---\nbody",
      { meta: { tier: "pro" } },
    ],
    [
      "nested list",
      "---\nitems:\n  - one\n  - two\n---\nbody",
      { items: ["one", "two"] },
    ],
  ] as const)(
    "parses indented frontmatter shape %s",
    (_label, source, expected) => {
      expect(parseSafeFrontmatter(source).data).toEqual(expected);
    },
  );
});
