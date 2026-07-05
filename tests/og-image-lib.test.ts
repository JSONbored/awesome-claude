import { describe, expect, it } from "vitest";

import {
  OG_ACCENT_INK,
  OG_ACCENT_SOFT,
  OG_BG,
  OG_BORDER,
  OG_HEIGHT,
  OG_INK,
  OG_INK_MUTED,
  OG_INK_SUBTLE,
  OG_TEXT_LIMITS,
  OG_WIDTH,
  categoryAccent,
  clampOgText,
  descriptionLines,
  esc,
  ogImageUrl,
  renderBadgeSvg,
  renderOgSvg,
  safeAccent,
  wrap,
} from "../apps/web/src/lib/og-image-lib";

const DEFAULT_ACCENT = "#e1f32a";
const SITE = "https://heyclau.de";

describe("OG color constants", () => {
  it.each([
    ["OG_BG", OG_BG, "#f8f6ed"],
    ["OG_INK", OG_INK, "#13110d"],
    ["OG_INK_MUTED", OG_INK_MUTED, "#58554e"],
    ["OG_INK_SUBTLE", OG_INK_SUBTLE, "#6d6a63"],
    ["OG_BORDER", OG_BORDER, "#dad7cf"],
    ["OG_ACCENT_SOFT", OG_ACCENT_SOFT, "#effaac"],
    ["OG_ACCENT_INK", OG_ACCENT_INK, "#13110d"],
  ] as const)(
    "%s equals the design-token hex %s",
    (_name, actual, expected) => {
      expect(actual).toBe(expected);
    },
  );

  it.each([
    ["OG_BG", OG_BG],
    ["OG_INK", OG_INK],
    ["OG_INK_MUTED", OG_INK_MUTED],
    ["OG_INK_SUBTLE", OG_INK_SUBTLE],
    ["OG_BORDER", OG_BORDER],
    ["OG_ACCENT_SOFT", OG_ACCENT_SOFT],
    ["OG_ACCENT_INK", OG_ACCENT_INK],
  ] as const)("%s is a strict #rrggbb hex literal", (_name, value) => {
    expect(value).toMatch(/^#[0-9a-f]{6}$/i);
  });
});

describe("OG_TEXT_LIMITS", () => {
  it.each([
    ["eyebrow", OG_TEXT_LIMITS.eyebrow, 40],
    ["title", OG_TEXT_LIMITS.title, 140],
    ["description", OG_TEXT_LIMITS.description, 240],
    ["author", OG_TEXT_LIMITS.author, 80],
  ] as const)("%s limit is %i characters", (key, actual, expected) => {
    expect(actual).toBe(expected);
    expect(OG_TEXT_LIMITS[key]).toBe(expected);
  });

  it("exposes exactly four bounded text fields", () => {
    expect(Object.keys(OG_TEXT_LIMITS).sort()).toEqual([
      "author",
      "description",
      "eyebrow",
      "title",
    ]);
  });

  it.each([
    ["eyebrow", OG_TEXT_LIMITS.eyebrow],
    ["title", OG_TEXT_LIMITS.title],
    ["description", OG_TEXT_LIMITS.description],
    ["author", OG_TEXT_LIMITS.author],
  ] as const)("clampOgText respects the %s ceiling", (field, max) => {
    const long = "x".repeat(max + 50);
    expect(clampOgText(long, max)).toHaveLength(max);
    expect(clampOgText(long, max)).toBe("x".repeat(max));
    expect(
      renderOgSvg({ title: field === "title" ? long : "T" }).length,
    ).toBeGreaterThan(0);
  });
});

describe("OG_WIDTH / OG_HEIGHT", () => {
  it.each([
    ["OG_WIDTH", OG_WIDTH, 1200],
    ["OG_HEIGHT", OG_HEIGHT, 630],
  ] as const)("%s is %i", (_name, actual, expected) => {
    expect(actual).toBe(expected);
  });

  it("uses the standard Open Graph aspect ratio", () => {
    expect(OG_WIDTH / OG_HEIGHT).toBeCloseTo(1200 / 630, 5);
  });

  it.each([
    ["width", String(OG_WIDTH)],
    ["height", String(OG_HEIGHT)],
    ["viewBox", `0 0 ${OG_WIDTH} ${OG_HEIGHT}`],
  ] as const)("renderOgSvg advertises %s=%s", (attr, value) => {
    const svg = renderOgSvg({ title: "Dimensions" });
    if (attr === "viewBox") {
      expect(svg).toContain(`viewBox="${value}"`);
    } else {
      expect(svg).toContain(`${attr}="${value}"`);
    }
  });
});

describe("categoryAccent", () => {
  it.each([
    ["mcp", "#7cd17c"],
    ["agents", "#f3b85a"],
    ["skills", "#8aa9ff"],
    ["rules", "#d4a5ff"],
    ["commands", "#ff9a7a"],
    ["hooks", "#76d7c4"],
    ["guides", "#ffcf72"],
    ["collections", "#b8a4ff"],
    ["statuslines", "#9bd6f0"],
  ] as const)("returns the palette accent for category %s", (category, hex) => {
    expect(categoryAccent(category)).toBe(hex);
    expect(categoryAccent(category)).toMatch(/^#[0-9a-f]{6}$/i);
  });

  it.each([
    [undefined, DEFAULT_ACCENT],
    ["", DEFAULT_ACCENT],
    ["unknown", DEFAULT_ACCENT],
    ["MCP", DEFAULT_ACCENT],
    [" agent ", DEFAULT_ACCENT],
    ["skills-extra", DEFAULT_ACCENT],
    ["null", DEFAULT_ACCENT],
    ["undefined", DEFAULT_ACCENT],
    ["../mcp", DEFAULT_ACCENT],
    ["mcp/agents", DEFAULT_ACCENT],
  ] as const)("falls back to brand citron for %j", (category, expected) => {
    expect(categoryAccent(category)).toBe(expected);
  });

  it.each([
    "mcp",
    "agents",
    "skills",
    "rules",
    "commands",
    "hooks",
    "guides",
    "collections",
    "statuslines",
  ] as const)("category accent %s is accepted by safeAccent", (category) => {
    expect(safeAccent(categoryAccent(category))).toBe(categoryAccent(category));
  });
});

describe("safeAccent", () => {
  it.each([
    ["#fff", "#fff"],
    ["#FFF", "#FFF"],
    ["#abc", "#abc"],
    ["#AbC", "#AbC"],
    ["#c5e84e", "#c5e84e"],
    ["#7CD17C", "#7CD17C"],
    ["#aabbccdd", "#aabbccdd"],
    ["#AABBCCDD", "#AABBCCDD"],
    ["#000000", "#000000"],
    ["#123456", "#123456"],
    ["#fedcba98", "#fedcba98"],
    ["#e1f32a", "#e1f32a"],
    [categoryAccent("mcp"), categoryAccent("mcp")],
    [categoryAccent("hooks"), categoryAccent("hooks")],
  ] as const)("passes through valid hex %j as %s", (input, expected) => {
    expect(safeAccent(input)).toBe(expected);
  });

  it.each([
    [undefined, DEFAULT_ACCENT],
    [null, DEFAULT_ACCENT],
    ["", DEFAULT_ACCENT],
    ["red", DEFAULT_ACCENT],
    ["#ggg", DEFAULT_ACCENT],
    ["#12", DEFAULT_ACCENT],
    ["#1234", DEFAULT_ACCENT],
    ["#12345", DEFAULT_ACCENT],
    ["#1234567", DEFAULT_ACCENT],
    ["e1f32a", DEFAULT_ACCENT],
    ["#e1f32", DEFAULT_ACCENT],
    ["#e1f32a00ff", DEFAULT_ACCENT],
    [" rgb(255,0,0) ", DEFAULT_ACCENT],
    ["hsl(120,100%,50%)", DEFAULT_ACCENT],
    ["transparent", DEFAULT_ACCENT],
    ["currentColor", DEFAULT_ACCENT],
    ["url(#gradient)", DEFAULT_ACCENT],
    ["#fff;", DEFAULT_ACCENT],
    [" #fff ", DEFAULT_ACCENT],
    ["#fff\n", DEFAULT_ACCENT],
    ["#fff\x00", DEFAULT_ACCENT],
  ] as const)("rejects non-hex %j and falls back to %s", (input, expected) => {
    expect(safeAccent(input)).toBe(expected);
  });

  it.each([
    '"><script>alert(1)</script>',
    "' onload='alert(1)",
    '"><rect width="9999" height="9999" fill="red"/>',
    '#fff"><script>',
    "javascript:alert(1)",
    "<img src=x onerror=alert(1)>",
    '"><foreignObject><body xmlns="http://www.w3.org/1999/xhtml">',
    "#abc; fill:red",
    '"><!--',
    "#fff' fill='red",
    "%23fff",
    "&#35;fff",
    "\\#fff",
    "#fff%00",
    "expression(alert(1))",
    "data:text/html,<script>alert(1)</script>",
    "#fff\nfill:red",
    "#fff\rfill:red",
    "#fff fill:red",
    "#fff\tfill:red",
    '"><animate attributeName="fill" to="red"/>',
    "#fff`",
    "#fff${7*7}",
    "#fff{{constructor}}",
  ] as const)("blocks injection payload %j", (payload) => {
    expect(safeAccent(payload)).toBe(DEFAULT_ACCENT);
    const svg = renderOgSvg({ title: "Safe", accent: payload });
    expect(svg).not.toContain("<script>");
    expect(svg).not.toContain("foreignObject");
    expect(svg).toContain(`fill="${DEFAULT_ACCENT}"`);
  });
});

describe("esc", () => {
  it.each([
    ["plain text", "plain text"],
    ["", ""],
    ["no specials", "no specials"],
    ["123 & 456", "123 &amp; 456"],
    ["a < b", "a &lt; b"],
    ["a > b", "a &gt; b"],
    ["a & b < c > d", "a &amp; b &lt; c &gt; d"],
    ["<<>>", "&lt;&lt;&gt;&gt;"],
    ["&amp;", "&amp;amp;"],
    ["&lt;tag&gt;", "&amp;lt;tag&amp;gt;"],
    ['say "hello"', 'say "hello"'],
    ["it's fine", "it's fine"],
    ["back\\slash", "back\\slash"],
    ["emoji 🎉", "emoji 🎉"],
    ["tabs\tand\nnewlines", "tabs\tand\nnewlines"],
    ["<script>alert(1)</script>", "&lt;script&gt;alert(1)&lt;/script&gt;"],
    ["<![CDATA[raw]]>", "&lt;![CDATA[raw]]&gt;"],
    ["<!-- comment -->", "&lt;!-- comment --&gt;"],
    ["AT&T", "AT&amp;T"],
    ["3 < 4 && 5 > 2", "3 &lt; 4 &amp;&amp; 5 &gt; 2"],
    ["<tspan>", "&lt;tspan&gt;"],
    ["</text>", "&lt;/text&gt;"],
    ["&", "&amp;"],
    ["<", "&lt;"],
    [">", "&gt;"],
    ["&<>", "&amp;&lt;&gt;"],
    ["nested <a> & <b>", "nested &lt;a&gt; &amp; &lt;b&gt;"],
    ["unicode — dash", "unicode — dash"],
    ["path/to/file", "path/to/file"],
    ["query?a=1&b=2", "query?a=1&amp;b=2"],
  ] as const)("escapes %j to %j", (input, expected) => {
    expect(esc(input)).toBe(expected);
  });

  it("only escapes &, <, > and leaves quotes untouched", () => {
    const raw = `"single' double" mixed & < >`;
    const escaped = esc(raw);
    expect(escaped).toContain('"');
    expect(escaped).toContain("'");
    expect(escaped).toBe(`"single' double" mixed &amp; &lt; &gt;`);
  });
});

describe("clampOgText", () => {
  it.each([
    ["", 40, ""],
    ["   ", 40, ""],
    ["\t\n\r", 40, ""],
    ["hello", 40, "hello"],
    ["  hello  ", 40, "hello"],
    ["hello\n\tworld", 40, "hello world"],
    ["  a   b   c  ", 40, "a b c"],
    ["one two three", 8, "one two "],
    ["abcdefghij", 5, "abcde"],
    ["x".repeat(100), 10, "x".repeat(10)],
    ["word", 0, ""],
    ["trim me", 7, "trim me"],
    ["multiple   spaces   here", 24, "multiple spaces here"],
    ["leading", 3, "lea"],
    ["café résumé", 20, "café résumé"],
    ["emoji 🎉 party", 20, "emoji 🎉 party"],
    ["hyphenated-word", 10, "hyphenated"],
    ["numbers 12345", 10, "numbers 12"],
    ["UPPER lower MiXeD", 20, "UPPER lower MiXeD"],
    [" punctuation ! ? . ", 20, "punctuation ! ? ."],
    ["tabs\tand\nnewlines", 20, "tabs and newlines"],
    [
      "a".repeat(OG_TEXT_LIMITS.title),
      OG_TEXT_LIMITS.title,
      "a".repeat(OG_TEXT_LIMITS.title),
    ],
    [
      "b".repeat(OG_TEXT_LIMITS.description + 5),
      OG_TEXT_LIMITS.description,
      "b".repeat(OG_TEXT_LIMITS.description),
    ],
    [
      "c".repeat(OG_TEXT_LIMITS.eyebrow + 1),
      OG_TEXT_LIMITS.eyebrow,
      "c".repeat(OG_TEXT_LIMITS.eyebrow),
    ],
    [
      "d".repeat(OG_TEXT_LIMITS.author + 10),
      OG_TEXT_LIMITS.author,
      "d".repeat(OG_TEXT_LIMITS.author),
    ],
    ["  spaced  out  text  ", 12, "spaced out t"],
    ["no-trim-needed", 20, "no-trim-needed"],
    ["end   ", 10, "end"],
    ["   start", 10, "start"],
    ["mid   dle", 10, "mid dle"],
    ["single", 6, "single"],
    ["double  space", 8, "double s"],
    ["triple   space", 10, "triple spa"],
    ["unicode — em dash", 12, "unicode — em"],
    ["path/to/something", 15, "path/to/somethi"],
    ["query?foo=bar", 10, "query?foo="],
  ] as const)("clampOgText(%j, %i) => %j", (input, max, expected) => {
    expect(clampOgText(input, max)).toBe(expected);
  });
});

describe("wrap", () => {
  it.each([
    ["", 10, 3, []],
    ["   ", 10, 3, []],
    ["hello", 10, 3, ["hello"]],
    ["one two", 10, 3, ["one two"]],
    ["one two three", 7, 3, ["one two", "three"]],
    ["alpha beta gamma", 10, 2, ["alpha beta", "gamma"]],
    ["a".repeat(25), 10, 3, ["a".repeat(10), "a".repeat(10), "a".repeat(5)]],
    ["a".repeat(50), 10, 2, ["a".repeat(10), "a".repeat(10)]],
    ["word1 word2 word3 word4", 6, 2, ["word1", "word2"]],
    ["short", 22, 2, ["short"]],
    ["exactlytwentytwochars!", 22, 2, ["exactlytwentytwochars!"]],
    ["twenty three char line xx", 22, 2, ["twenty three char line", "xx"]],
    ["one", 1, 1, ["o"]],
    ["ab cd", 2, 2, ["ab", "cd"]],
    ["superlongwordwithoutspaces", 8, 2, ["superlon", "gwordwit"]],
    ["first second third fourth fifth", 6, 3, ["first", "second", "third"]],
    ["a b c d e f g", 3, 4, ["a b", "c d", "e f", "g"]],
    ["keep within perLine", 10, 1, ["keep"]],
    ["multiple   spaces", 10, 2, ["multiple", "spaces"]],
    ["hyphenated-words here", 12, 2, ["hyphenated-w", "ords here"]],
    ["numbers 123 456 789", 8, 3, ["numbers", "123 456", "789"]],
    ["UPPER lower MiXeD", 10, 2, ["UPPER", "lower"]],
    ["emoji 🎉 test case", 10, 2, ["emoji 🎉", "test case"]],
    ["x".repeat(5), 5, 1, ["x".repeat(5)]],
    ["x".repeat(6), 5, 1, ["xxxxx"]],
    ["aa bb cc dd ee", 4, 3, ["aa", "bb", "cc"]],
    ["one two three four five six", 4, 2, ["one", "two"]],
    ["leading spaces", 8, 2, ["leading", "spaces"]],
    ["trailing test", 8, 1, ["trailing"]],
    ["word", 10, 0, []],
    ["a b", 1, 5, ["a", "b"]],
    ["tiny", 2, 2, ["ti", "ny"]],
    ["four score and seven", 5, 4, ["four", "score", "and", "seven"]],
    [
      "pack my box with five dozen liquor jugs",
      10,
      3,
      ["pack my", "box with", "five dozen"],
    ],
    ["the quick brown fox jumps", 10, 2, ["the quick", "brown fox"]],
    ["renderOgSvg title wrap", 22, 2, ["renderOgSvg title wrap"]],
    ["singleword", 6, 1, ["single"]],
    ["two words", 6, 1, ["two"]],
    ["three small words", 5, 2, ["three", "small"]],
  ] as const)(
    "wrap(%j, perLine=%i, maxLines=%i) => %j",
    (input, perLine, maxLines, expected) => {
      expect(wrap(input, perLine, maxLines)).toEqual(expected);
    },
  );

  it.each([1, 2, 3, 5, 10, 22, 58] as const)(
    "every wrap line respects perLine=%i when words fit",
    (perLine) => {
      const lines = wrap("short text only", perLine, 5);
      for (const line of lines) {
        expect(line.length).toBeLessThanOrEqual(perLine);
      }
    },
  );
});

describe("descriptionLines", () => {
  it.each([
    ["A short description.", 58, 3, ["A short description."]],
    ["Fits on one line easily.", 58, 3, ["Fits on one line easily."]],
    ["", 58, 3, []],
    ["   ", 58, 3, []],
    ["Single word", 58, 1, ["Single word"]],
    ["alpha beta gamma, and delta", 17, 1, ["alpha beta gamma…"]],
    [
      "one two three four five six seven eight",
      10,
      2,
      ["one two", "three four…"],
    ],
    ["ends with and", 8, 1, ["ends…"]],
    ["ends with or", 8, 1, ["ends…"]],
    ["ends with the", 8, 1, ["ends…"]],
    ["ends with for", 8, 1, ["ends…"]],
    ["comma, and more text here please", 12, 1, ["comma…"]],
    ["semicolon; and more", 12, 1, ["semicolon…"]],
    ["colon: and more", 12, 1, ["colon…"]],
    ["ampersand & more", 12, 1, ["ampersand…"]],
    ["trailing comma,", 12, 1, ["trailing…"]],
    ["no ellipsis needed here", 58, 3, ["no ellipsis needed here"]],
    ["tiny", 58, 3, ["tiny"]],
    [
      "x".repeat(OG_TEXT_LIMITS.description),
      58,
      3,
      ["x".repeat(58), "x".repeat(58), `${"x".repeat(58)}…`],
    ],
  ] as const)(
    "descriptionLines(%j, %i, %i) => %j",
    (input, perLine, maxLines, expected) => {
      expect(descriptionLines(input, perLine, maxLines)).toEqual(expected);
    },
  );

  it("never ends the last line on a dangling connector before the ellipsis", () => {
    const text =
      "Official GitHub MCP server providing comprehensive GitHub API access for " +
      "repository management, file operations, and search functionality, plus issues, " +
      "pull requests, branches, releases, and webhooks across all of your repositories";
    const lines = descriptionLines(text, 58, 3);
    expect(lines.length).toBeLessThanOrEqual(3);
    const last = lines[lines.length - 1] ?? "";
    expect(last.endsWith("…")).toBe(true);
    expect(last).not.toMatch(
      /(?:,|\band|\bor|\bthe|\bfor|\bwith|\bin|\bon)\s*…$/i,
    );
  });

  it.each([
    ["short", false],
    ["A".repeat(500), true],
    ["word ".repeat(80), true],
  ] as const)("ellipsis presence for %j overflow=%s", (text, needsEllipsis) => {
    const lines = descriptionLines(text, 20, 2);
    const joined = lines.join("");
    if (needsEllipsis) {
      expect(joined).toContain("…");
    } else {
      expect(joined).not.toContain("…");
    }
  });

  it("clamps to OG_TEXT_LIMITS.description before wrapping", () => {
    const long = "z".repeat(OG_TEXT_LIMITS.description + 100);
    const lines = descriptionLines(long, 58, 3);
    const shown = lines.join(" ").replace(/…$/, "");
    expect(shown.length).toBeLessThanOrEqual(OG_TEXT_LIMITS.description);
  });
});

describe("renderOgSvg structure", () => {
  const minimal = renderOgSvg({ title: "Hello World" });

  it.each([
    ["xml declaration", '<?xml version="1.0" encoding="UTF-8"?>'],
    ["svg root", '<svg xmlns="http://www.w3.org/2000/svg"'],
    ["background fill", `fill="${OG_BG}"`],
    ["grid stroke", `stroke="${OG_BORDER}"`],
    ["default accent bar", `fill="${DEFAULT_ACCENT}"`],
    ["eyebrow font", 'font-family="ui-monospace, Menlo, monospace"'],
    ["title font", 'font-family="Space Grotesk, system-ui, sans-serif"'],
    ["footer domain", "heyclau.de"],
    ["default eyebrow", "HEYCLAUDE"],
  ] as const)("contains %s marker", (_label, marker) => {
    expect(minimal).toContain(marker);
  });

  it.each([
    ["title", { title: "My Card Title" }],
    ["description", { title: "T", description: "A helpful description." }],
    ["author", { title: "T", author: "Jane Doe" }],
    ["eyebrow", { title: "T", eyebrow: "custom" }],
    ["accent", { title: "T", accent: "#7cd17c" }],
  ] as const)("renders optional field %s", (_field, opts) => {
    const svg = renderOgSvg(opts);
    expect(svg.trim().startsWith("<?xml")).toBe(true);
    expect(svg).toContain("</svg>");
    expect(svg).toContain('width="1200"');
    expect(svg).toContain('height="630"');
  });

  it("omits author text when author is not provided", () => {
    const svg = renderOgSvg({ title: "No Author" });
    expect(svg).not.toContain("by <tspan");
  });

  it("includes author markup when author is provided", () => {
    const svg = renderOgSvg({ title: "With Author", author: "Ada Lovelace" });
    expect(svg).toContain("by <tspan");
    expect(svg).toContain("Ada Lovelace");
  });

  it("omits description lines when description is absent", () => {
    const svg = renderOgSvg({ title: "No Description" });
    expect(svg).not.toContain('y="340"');
    expect(svg).not.toContain('font-family="DM Sans, system-ui, sans-serif"');
  });

  it("includes description font when description is present", () => {
    const svg = renderOgSvg({ title: "T", description: "Shown copy" });
    expect(svg).toContain('font-family="DM Sans, system-ui, sans-serif"');
    expect(svg).toContain('y="340"');
  });

  it("uppercases the eyebrow text", () => {
    const svg = renderOgSvg({ title: "T", eyebrow: "custom label" });
    expect(svg).toContain("CUSTOM LABEL");
    expect(svg).not.toContain("custom label");
  });
});

describe("renderOgSvg escaping", () => {
  it.each([
    ["title", { title: "A & B <script>" }, ["A &amp; B &lt;script&gt;"]],
    [
      "description",
      { title: "T", description: "x < y & z > w" },
      ["x &lt; y &amp; z &gt; w"],
    ],
    ["author", { title: "T", author: "O'Brien & Co." }, ["O'Brien &amp; Co."]],
    ["eyebrow", { title: "T", eyebrow: "a < b" }, ["A &lt; B"]],
  ] as const)(
    "escapes %s metacharacters in SVG text",
    (_field, opts, fragments) => {
      const svg = renderOgSvg(opts);
      for (const fragment of fragments) {
        expect(svg).toContain(fragment);
      }
      expect(svg).not.toMatch(/<script/i);
    },
  );

  it.each([
    '"><script>alert(1)</script>',
    "<img src=x onerror=alert(1)>",
    "<!-- injected -->",
    "<![CDATA[x]]>",
    "&lt;not double escaped&gt;",
  ] as const)("neutralizes dangerous title payload %j", (payload) => {
    const svg = renderOgSvg({ title: payload, accent: payload });
    expect(svg).not.toContain("<script>");
    expect(svg).not.toContain("<img");
    expect(svg).toContain(`fill="${DEFAULT_ACCENT}"`);
  });
});

describe("renderOgSvg grid", () => {
  it("renders vertical grid lines from x=32 up to the canvas width", () => {
    const svg = renderOgSvg({ title: "Grid" });
    const vertical = [...svg.matchAll(/M(\d+) 0V630/g)].map((m) =>
      Number(m[1]),
    );
    expect(vertical.length).toBeGreaterThan(0);
    expect(vertical).toContain(32);
    expect(vertical).toContain(64);
    expect(vertical.every((x) => x >= 32 && x < OG_WIDTH && x % 32 === 0)).toBe(
      true,
    );
  });

  it("renders horizontal grid lines from y=32 up to the canvas height", () => {
    const svg = renderOgSvg({ title: "Grid" });
    const horizontal = [...svg.matchAll(/M0 (\d+)H1200/g)].map((m) =>
      Number(m[1]),
    );
    expect(horizontal.length).toBeGreaterThan(0);
    expect(horizontal).toContain(32);
    expect(horizontal).toContain(64);
    expect(
      horizontal.every((y) => y >= 32 && y < OG_HEIGHT && y % 32 === 0),
    ).toBe(true);
  });

  it.each([32, 64, 96, 128] as const)(
    "includes both axis grid markers at %i",
    (step) => {
      const svg = renderOgSvg({ title: "Grid markers" });
      expect(svg).toContain(`M${step} 0V${OG_HEIGHT}`);
      expect(svg).toContain(`M0 ${step}H${OG_WIDTH}`);
    },
  );

  it.each([
    ["stroke-opacity", 'stroke-opacity="0.6"'],
    ["stroke-width", 'stroke-width="1"'],
    ["accent bar x", '<rect x="0" y="0" width="14" height="630"'],
    ["content transform", 'transform="translate(80,90)"'],
    ["footer transform", 'transform="translate(80,540)"'],
  ] as const)("grid/card layer includes %s", (_label, fragment) => {
    expect(renderOgSvg({ title: "Layers" })).toContain(fragment);
  });
});

describe("renderBadgeSvg width calculation", () => {
  const charWidth = 6.4;
  const pad = 12;

  function expectedWidths(label: string, value: string) {
    const labelWidth = Math.ceil(label.length * charWidth) + pad * 2;
    const valueWidth = Math.ceil(value.length * charWidth) + pad * 2;
    return { labelWidth, valueWidth, total: labelWidth + valueWidth };
  }

  it.each([
    ["Listed on HeyClaude", "registry"],
    ["MCP", "Anki"],
    ["Listed on HeyClaude", "mcp"],
    ["A", "B"],
    ["Hey", "Claude"],
    ["Longer Label", "skills"],
    ["X", "Y"],
    ["AB", "CD"],
    ["Listed on HeyClaude", "commands"],
    ["Label", "value"],
    ["Hi", "there"],
    ["Test", "case"],
    ["One", "Two"],
    ["Short", "badge"],
    ["Listed on HeyClaude", "agents"],
  ] as const)("width math for label=%j value=%j", (label, value) => {
    const { total } = expectedWidths(label, value);
    const svg = renderBadgeSvg({ label, value });
    expect(svg).toContain(`width="${total}"`);
    expect(svg).toContain(`viewBox="0 0 ${total} 20"`);
    expect(svg).toContain(`height="20"`);
  });

  it.each([
    ["", "registry"],
    ["   ", "registry"],
    ["", ""],
    ["  ", "  "],
  ] as const)(
    "falls back when label/value are blank: label=%j value=%j",
    (label, value) => {
      const svg = renderBadgeSvg({ label, value });
      expect(svg).toContain("Listed on HeyClaude");
      expect(svg).toContain("registry");
      const { total } = expectedWidths("Listed on HeyClaude", "registry");
      expect(svg).toContain(`width="${total}"`);
    },
  );

  it("positions value segment after the label segment", () => {
    const label = "MCP";
    const value = "Anki";
    const { labelWidth } = expectedWidths(label, value);
    const svg = renderBadgeSvg({ label, value });
    expect(svg).toContain(`<rect x="${labelWidth}"`);
  });
});

describe("renderBadgeSvg escaping and structure", () => {
  it.each([
    ["A & B", "<test>", "&amp;", "&lt;test&gt;"],
    ["Left <", "Right >", "&lt;", "&gt;"],
    ["AT&T", "x < y", "AT&amp;T", "x &lt; y"],
    ["plain", "text", "plain", "text"],
    ["<!--", "-->", "&lt;!--", "--&gt;"],
  ] as const)("escapes label=%j value=%j", (label, value, ...fragments) => {
    const svg = renderBadgeSvg({ label, value });
    for (const fragment of fragments) {
      expect(svg).toContain(fragment);
    }
    expect(svg.trim().startsWith("<svg")).toBe(true);
  });

  it.each([
    ["role", 'role="img"'],
    ["title element", "<title>"],
    ["clip path", 'clip-path="url(#r)"'],
    ["linear gradient", "<linearGradient"],
    ["rx radius", 'rx="3"'],
    ["Verdana font", 'font-family="Verdana,Geneva,DejaVu Sans,sans-serif"'],
    ["scale transform", 'transform="scale(.1)"'],
  ] as const)("badge SVG includes %s", (_label, fragment) => {
    expect(renderBadgeSvg({ value: "mcp" })).toContain(fragment);
  });

  it.each([
    ["#00ff00", "#00ff00"],
    ["#7cd17c", "#7cd17c"],
    ['"/><script>', DEFAULT_ACCENT],
    ["not-a-color", DEFAULT_ACCENT],
  ] as const)(
    "accent %j renders as %s fill on value segment",
    (accent, expectedFill) => {
      const svg = renderBadgeSvg({ value: "mcp", accent });
      expect(svg).toContain(`fill="${expectedFill}"`);
      expect(svg).not.toContain("<script>");
    },
  );

  it("title element combines escaped label and value", () => {
    const svg = renderBadgeSvg({ label: "A & B", value: "C < D" });
    expect(svg).toContain("<title>A &amp; B: C &lt; D</title>");
  });
});

describe("ogImageUrl", () => {
  it.each([
    [{ title: "My Title" }, `${SITE}/og?title=My+Title`],
    [{ title: "T" }, `${SITE}/og?title=T`],
    [{ title: "Hello World" }, `${SITE}/og?title=Hello+World`],
    [{ title: "single" }, `${SITE}/og?title=single`],
  ] as const)("builds base URL for %j", (opts, expected) => {
    expect(ogImageUrl(opts)).toBe(expected);
  });

  it.each([
    ["eyebrow", { title: "T", eyebrow: "E" }, "E"],
    ["description", { title: "T", description: "D" }, "D"],
    ["accent", { title: "T", accent: "#abc" }, "#abc"],
    ["eyebrow", { title: "T", eyebrow: "HeyClaude" }, "HeyClaude"],
    [
      "description",
      { title: "T", description: "A long description." },
      "A long description.",
    ],
    ["accent", { title: "T", accent: "#7cd17c" }, "#7cd17c"],
  ] as const)("includes optional %s param", (key, opts, value) => {
    const url = new URL(ogImageUrl(opts));
    expect(url.searchParams.get(key)).toBe(value);
  });

  it.each([
    ["A & B", "A & B"],
    ["100% done", "100% done"],
    ["emoji 🎉", "emoji 🎉"],
    ["slash/path", "slash/path"],
    ["question?yes", "question?yes"],
    ["hash#tag", "hash#tag"],
    ["plus+sign", "plus+sign"],
    ["equals=x", "equals=x"],
    ["unicode — dash", "unicode — dash"],
    ['quotes "hi"', 'quotes "hi"'],
    ["angle <brackets>", "angle <brackets>"],
    ["tab\there", "tab\there"],
    ["newline\nhere", "newline\nhere"],
  ] as const)("round-trips encoded title %j", (title, decoded) => {
    const url = new URL(ogImageUrl({ title }));
    expect(url.searchParams.get("title")).toBe(decoded);
    expect(url.pathname).toBe("/og");
    expect(url.origin).toBe(SITE);
  });

  it("omits optional params when they are not provided", () => {
    const url = new URL(ogImageUrl({ title: "Only Title" }));
    expect(url.searchParams.has("eyebrow")).toBe(false);
    expect(url.searchParams.has("description")).toBe(false);
    expect(url.searchParams.has("accent")).toBe(false);
  });

  it("can include every optional param at once", () => {
    const url = new URL(
      ogImageUrl({
        title: "Full",
        eyebrow: "E",
        description: "D",
        accent: "#fff",
      }),
    );
    expect(url.searchParams.get("title")).toBe("Full");
    expect(url.searchParams.get("eyebrow")).toBe("E");
    expect(url.searchParams.get("description")).toBe("D");
    expect(url.searchParams.get("accent")).toBe("#fff");
  });

  it("points at the crawlable /og route rather than /api/og", () => {
    const url = ogImageUrl({ title: "Route check" });
    expect(url).toContain("/og?");
    expect(url).not.toContain("/api/og");
  });
});

describe("integration snapshots", () => {
  it.each([
    ["minimal", { title: "Hello" }],
    ["with description", { title: "Hello", description: "World" }],
    ["with author", { title: "Hello", author: "Dev" }],
    ["category accent", { title: "Hello", accent: categoryAccent("mcp") }],
    ["custom eyebrow", { title: "Hello", eyebrow: "registry" }],
  ] as const)(
    "renderOgSvg %s output is stable and well-formed",
    (_label, opts) => {
      const svg = renderOgSvg(opts);
      expect(svg).toMatch(/^<\?xml version="1\.0"/);
      expect(svg.trim().endsWith("</svg>")).toBe(true);
      expect(svg).toContain(OG_BG);
      expect(svg).toContain(OG_INK);
    },
  );

  it.each([
    ["default", { value: "mcp" }],
    ["custom label", { label: "Skills", value: "demo" }],
    ["custom accent", { value: "hooks", accent: "#76d7c4" }],
  ] as const)(
    "renderBadgeSvg %s output is stable and well-formed",
    (_label, opts) => {
      const svg = renderBadgeSvg(opts);
      expect(svg.trim().startsWith("<svg")).toBe(true);
      expect(svg.trim().endsWith("</svg>")).toBe(true);
      expect(svg).toContain("<title>");
    },
  );
});
