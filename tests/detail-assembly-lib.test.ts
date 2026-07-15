import { describe, expect, it } from "vitest";

import {
  getCollectionItems,
  getDownloadHref,
  getMetadataFallback,
  getPrimarySnippet,
  getRelatedEntries,
  getSourceSignals,
  getTopFacts,
  htmlToPlainText,
  renderMarkdown,
  stripCodeBlocks,
} from "@/lib/detail-assembly-lib";
import type { ContentEntry, DirectoryEntry } from "@heyclaude/registry";

function entry(overrides: Partial<ContentEntry>): ContentEntry {
  return {
    category: "agents",
    slug: "s",
    title: "t",
    description: "d",
    tags: [],
    keywords: [],
    body: "",
    sections: [],
    headings: [],
    codeBlocks: [],
    ...overrides,
  } as ContentEntry;
}

function directory(
  category: string,
  slug: string,
  tags: string[] = [],
  extras: Partial<DirectoryEntry> = {},
): DirectoryEntry {
  return {
    category,
    slug,
    title: `${category}/${slug}`,
    description: "d",
    tags,
    ...extras,
  } as DirectoryEntry;
}

describe("detail-assembly-lib stripCodeBlocks", () => {
  it("removes fenced code blocks and keeps surrounding prose", () => {
    const input = "Intro\n```js\nsecret();\n```\nOutro";
    expect(stripCodeBlocks(input)).toBe("Intro\nOutro");
  });

  it("keeps up to two blank lines outside code fences", () => {
    const input = "a\n\n\n\nb";
    expect(stripCodeBlocks(input)).toBe("a\n\n\nb");
  });

  it("ignores lines inside an open fence until the closing fence", () => {
    const input = "```\nkeep? no\n```\nvisible";
    expect(stripCodeBlocks(input)).toBe("visible");
  });

  it("returns an empty string for blank input", () => {
    expect(stripCodeBlocks("")).toBe("");
  });
});

describe("detail-assembly-lib renderMarkdown", () => {
  it("unwraps relative links so bare paths are not left as anchors", async () => {
    const html = await renderMarkdown(
      "See [.claude/hooks/foo.sh](.claude/hooks/foo.sh)",
    );
    expect(html).toContain(".claude/hooks/foo.sh");
    expect(html).not.toMatch(/<a[^>]+href=["']\.claude/);
  });

  it("unwraps root-relative paths that GFM would autolink", async () => {
    const html = await renderMarkdown(
      "Use [/utils/trpc](/utils/trpc) locally.",
    );
    expect(html).toContain("/utils/trpc");
    expect(html).not.toMatch(/<a[^>]+href=["']\/utils/);
  });

  it("keeps external https links with rel and target attributes", async () => {
    const html = await renderMarkdown("[Docs](https://example.com/docs)");
    expect(html).toContain('href="https://example.com/docs"');
    expect(html).toContain('rel="nofollow noopener noreferrer"');
    expect(html).toContain('target="_blank"');
  });

  it("keeps mailto links as safe external anchors", async () => {
    const html = await renderMarkdown("[Email](mailto:team@example.com)");
    expect(html).toContain('href="mailto:team@example.com"');
    expect(html).toContain('rel="nofollow noopener noreferrer"');
  });

  it("allows https images and strips non-https image sources", async () => {
    const allowed = await renderMarkdown(
      "![ok](https://cdn.example.com/a.png)",
    );
    expect(allowed).toContain("<img");
    expect(allowed).toContain('src="https://cdn.example.com/a.png"');

    const blocked = await renderMarkdown(
      "![bad](http://cdn.example.com/a.png)",
    );
    expect(blocked).not.toContain('src="http://cdn.example.com/a.png"');
  });

  it("renders headings, lists, and inline code", async () => {
    const html = await renderMarkdown(
      "# Title\n\n- one\n- two\n\nUse `npm test`.",
    );
    expect(html).toContain("<h1");
    expect(html).toContain("Title");
    expect(html).toContain("<ul");
    expect(html).toContain("<code");
    expect(html).toContain("npm test");
  });

  it("renders tables and blockquotes from GFM input", async () => {
    const html = await renderMarkdown(
      "> quoted\n\n| a | b |\n| - | - |\n| 1 | 2 |",
    );
    expect(html).toContain("<blockquote");
    expect(html).toContain("<table");
    expect(html).toContain("<td");
  });

  it("preserves http external links the same way as https", async () => {
    const html = await renderMarkdown("[Legacy](http://example.com/legacy)");
    expect(html).toContain('href="http://example.com/legacy"');
    expect(html).toContain('target="_blank"');
  });
});

describe("detail-assembly-lib htmlToPlainText", () => {
  it("strips markup and collapses whitespace", () => {
    expect(htmlToPlainText("<p>Hello <b>world</b></p>")).toBe("Hello world");
    expect(htmlToPlainText("a\n\n  b   c")).toBe("a b c");
    expect(htmlToPlainText("")).toBe("");
  });
});

describe("detail-assembly-lib getPrimarySnippet", () => {
  it("covers agents and rules as markdown copy assets", () => {
    expect(
      getPrimarySnippet(entry({ category: "rules", body: "RULE" })),
    ).toEqual({
      title: "Copyable asset",
      code: "RULE",
      language: "md",
    });
  });

  it("prefers hook config, then script body, then usage snippets", () => {
    expect(
      getPrimarySnippet(entry({ category: "hooks", configSnippet: "{}" })),
    ).toEqual({ title: "Claude config", code: "{}", language: "json" });
    expect(
      getPrimarySnippet(
        entry({
          category: "hooks",
          scriptBody: "echo hi",
          scriptLanguage: "sh",
        }),
      ),
    ).toEqual({ title: "Hook script", code: "echo hi", language: "sh" });
  });

  it("labels install command, command syntax, and usage for mcp/skills/commands", () => {
    expect(
      getPrimarySnippet(entry({ category: "skills", installCommand: "npx x" })),
    ).toEqual({ title: "Install command", code: "npx x", language: "text" });
    expect(
      getPrimarySnippet(entry({ category: "commands", commandSyntax: "/run" })),
    ).toEqual({ title: "Command syntax", code: "/run", language: "text" });
    expect(
      getPrimarySnippet(entry({ category: "mcp", usageSnippet: "use me" })),
    ).toEqual({ title: "Usage", code: "use me", language: "text" });
  });

  it("covers statuslines config, script, and usage fallbacks", () => {
    expect(
      getPrimarySnippet(
        entry({ category: "statuslines", configSnippet: "{}" }),
      ),
    ).toEqual({ title: "Claude config", code: "{}", language: "json" });
    expect(
      getPrimarySnippet(
        entry({
          category: "statuslines",
          scriptBody: "fn()",
          scriptLanguage: "ts",
        }),
      ),
    ).toEqual({ title: "Source asset", code: "fn()", language: "ts" });
  });

  it("summarizes collections and guides from usage snippets", () => {
    expect(
      getPrimarySnippet(
        entry({ category: "collections", usageSnippet: "start" }),
      ),
    ).toEqual({ title: "Quick start", code: "start", language: "text" });
    expect(
      getPrimarySnippet(entry({ category: "guides", copySnippet: "guide" })),
    ).toEqual({ title: "Quick summary", code: "guide", language: "text" });
  });

  it("falls back to copyable or usage assets for unknown categories", () => {
    expect(
      getPrimarySnippet(
        entry({
          category: "tools" as ContentEntry["category"],
          usageSnippet: "US",
        }),
      ),
    ).toEqual({ title: "Usage", code: "US", language: "text" });
  });
});

describe("detail-assembly-lib getMetadataFallback", () => {
  it("gives hook, collection, documentation, and generic guidance", () => {
    expect(
      getMetadataFallback(entry({ category: "hooks", trigger: "Stop" }))
        .points[0],
    ).toContain("Stop");
    expect(getMetadataFallback(entry({ category: "collections" })).title).toBe(
      "How to use this collection",
    );
    expect(
      getMetadataFallback(entry({ documentationUrl: "https://docs.example" }))
        .points[0],
    ).toContain("documentation");
    expect(getMetadataFallback(entry({})).points[0]).toContain("GitHub source");
  });

  it("prefers repository guidance when only repoUrl is present", () => {
    const fallback = getMetadataFallback(
      entry({ repoUrl: "https://github.com/a/b" }),
    );
    expect(fallback.points[0]).toContain("repository");
  });
});

describe("detail-assembly-lib getDownloadHref", () => {
  it("proxies first-party downloads and leaves external URLs untouched", () => {
    expect(getDownloadHref("/downloads/skills/x.zip")).toBe(
      "/api/download?asset=%2Fdownloads%2Fskills%2Fx.zip",
    );
    expect(getDownloadHref("https://example.com/x.zip")).toBe(
      "https://example.com/x.zip",
    );
  });
});

describe("detail-assembly-lib getRelatedEntries", () => {
  it("excludes the anchor entry and returns at most two related items", () => {
    const anchor = entry({ category: "mcp", slug: "anchor", tags: ["alpha"] });
    const same = directory("mcp", "anchor", ["alpha"]);
    const relatedA = directory("skills", "a", ["alpha", "beta"], {
      documentationUrl: "https://docs",
      dateAdded: "2026-01-01",
    });
    const relatedB = directory("mcp", "b", ["alpha"], {
      installCommand: "npx x",
      dateAdded: "2026-02-01",
    });
    const unrelated = directory("guides", "z", ["zzz"]);

    const related = getRelatedEntries(anchor, [
      same,
      relatedA,
      relatedB,
      unrelated,
    ]);
    expect(related).toHaveLength(2);
    expect(related).not.toContain(same);
    expect(related).toEqual(expect.arrayContaining([relatedA, relatedB]));
  });

  it("prefers shared tags and same-category matches in scoring", () => {
    const anchor = entry({ category: "mcp", slug: "x", tags: ["shared"] });
    const high = directory("mcp", "high", ["shared", "extra"], {
      documentationUrl: "https://d",
      installCommand: "npx a",
      dateAdded: "2026-03-01",
    });
    const low = directory("guides", "low", [], { dateAdded: "2026-04-01" });

    const related = getRelatedEntries(anchor, [low, high]);
    expect(related[0]).toBe(high);
  });

  it("breaks score ties with newer dateAdded and stable hash closeness", () => {
    const anchor = entry({ category: "agents", slug: "anchor", tags: [] });
    const older = directory("agents", "older", [], { dateAdded: "2025-01-01" });
    const newer = directory("agents", "newer", [], { dateAdded: "2026-01-01" });

    const related = getRelatedEntries(anchor, [older, newer]);
    expect(related[0]).toBe(newer);
  });
});

describe("detail-assembly-lib getCollectionItems", () => {
  it("resolves string and object refs and drops missing targets", () => {
    const target = directory("agents", "x");
    const items = getCollectionItems(
      entry({
        category: "collections",
        items: ["agents/x", { category: "agents", slug: "missing" }],
      }),
      [target],
    );
    expect(items).toHaveLength(1);
    expect(items[0].ref).toBe("agents/x");
    expect(items[0].target).toMatchObject({ slug: "x" });
  });

  it("returns an empty list for non-collection entries", () => {
    expect(
      getCollectionItems(entry({ category: "agents", items: [] }), []),
    ).toEqual([]);
  });
});

describe("detail-assembly-lib getTopFacts", () => {
  it("keeps present facts in declaration order and skill-only fields for skills", () => {
    expect(
      getTopFacts(
        entry({ author: "Me", dateAdded: "2026-01-01", difficulty: "easy" }),
      ),
    ).toEqual([
      { label: "Author", value: "Me" },
      { label: "Added", value: "2026-01-01" },
      { label: "Difficulty", value: "easy" },
    ]);
    expect(
      getTopFacts(
        entry({
          category: "skills",
          skillType: "capability-pack",
          skillLevel: "intermediate",
          verificationStatus: "validated",
          verifiedAt: "2026-01-02",
        }),
      ),
    ).toEqual(
      expect.arrayContaining([
        { label: "Skill type", value: "capability-pack" },
        { label: "Skill level", value: "intermediate" },
        { label: "Verification", value: "validated" },
        { label: "Verified", value: "2026-01-02" },
      ]),
    );
  });

  it("omits skill-only facts outside the skills category", () => {
    expect(
      getTopFacts(
        entry({ category: "agents", skillType: "capability-pack" }),
      ).some((fact) => fact.label === "Skill type"),
    ).toBe(false);
  });
});

describe("detail-assembly-lib getSourceSignals", () => {
  it("returns no signals when trust/provenance metadata is absent", () => {
    expect(getSourceSignals(entry({}))).toEqual([]);
  });

  it("labels package trust, review, claim, and source URLs", () => {
    const signals = getSourceSignals(
      entry({
        downloadTrust: "external",
        verificationStatus: "validated",
        verifiedAt: "2026-01-01T00:00:00.000Z",
        contentUpdatedAt: "2026-02-01T00:00:00.000Z",
        downloadSha256: "abc",
        sourceSubmissionUrl: "https://github.com/o/r/issues/1",
        importPrUrl: "https://github.com/o/r/pull/2",
        reviewedBy: "maintainer",
        reviewedAt: "2026-03-01T00:00:00.000Z",
        claimStatus: "claimed",
        claimedBy: "owner",
        claimedByUrl: "https://github.com/owner",
        repoUrl: "https://github.com/o/r",
        documentationUrl: "https://docs.example",
        githubUrl: "https://github.com/o/r/blob/main/README.md",
      }),
    );
    const labels = signals.map((signal) => signal.label);
    expect(labels).toEqual(
      expect.arrayContaining([
        "Package trust",
        "Verification",
        "Last verified",
        "Content updated",
        "Package checksum",
        "Original submission",
        "Import PR",
        "Reviewed by",
        "Claim status",
        "Claimed by",
        "Repository",
        "Documentation",
        "Content source",
      ]),
    );
    expect(
      signals.find((signal) => signal.label === "Reviewed by")?.value,
    ).toContain("maintainer");
    expect(
      signals.find((signal) => signal.label === "Content updated")?.value,
    ).toBe("2026-02-01");
  });

  it("labels first-party package trust distinctly from external packages", () => {
    expect(
      getSourceSignals(entry({ downloadTrust: "first-party" })),
    ).toContainEqual({
      label: "Package trust",
      value: "Verified first-party package",
    });
  });
});

describe("detail-assembly-lib branch edge cases", () => {
  it("getPrimarySnippet: agents entry falls back to copy then usage snippets", () => {
    expect(
      getPrimarySnippet(entry({ category: "agents", copySnippet: "CS" })),
    ).toEqual({
      title: "Copyable asset",
      code: "CS",
      language: "md",
    });
    expect(
      getPrimarySnippet(entry({ category: "agents", usageSnippet: "US" })),
    ).toEqual({
      title: "Copyable asset",
      code: "US",
      language: "md",
    });
  });

  it("getPrimarySnippet: hooks without config or script fall back to usage", () => {
    expect(
      getPrimarySnippet(entry({ category: "hooks", copySnippet: "CS" })),
    ).toEqual({
      title: "Usage",
      code: "CS",
      language: "text",
    });
    expect(
      getPrimarySnippet(entry({ category: "hooks", usageSnippet: "US" })),
    ).toEqual({
      title: "Usage",
      code: "US",
      language: "text",
    });
  });

  it("getPrimarySnippet: statuslines without config or script fall back to usage", () => {
    expect(
      getPrimarySnippet(entry({ category: "statuslines", copySnippet: "CS" })),
    ).toEqual({
      title: "Usage",
      code: "CS",
      language: "text",
    });
    expect(
      getPrimarySnippet(entry({ category: "statuslines", usageSnippet: "US" })),
    ).toEqual({
      title: "Usage",
      code: "US",
      language: "text",
    });
  });

  it("getPrimarySnippet: statuslines script without language defaults to text", () => {
    expect(
      getPrimarySnippet(entry({ category: "statuslines", scriptBody: "fn()" })),
    ).toEqual({
      title: "Source asset",
      code: "fn()",
      language: "text",
    });
  });

  it("getPrimarySnippet: collections and guides fall back to copy and body", () => {
    expect(
      getPrimarySnippet(entry({ category: "collections", copySnippet: "CS" })),
    ).toEqual({
      title: "Quick start",
      code: "CS",
      language: "text",
    });
    expect(
      getPrimarySnippet(entry({ category: "collections", body: "B" })),
    ).toEqual({
      title: "Quick start",
      code: "B",
      language: "text",
    });
    expect(getPrimarySnippet(entry({ category: "guides", body: "B" }))).toEqual(
      {
        title: "Quick summary",
        code: "B",
        language: "text",
      },
    );
  });

  it("getPrimarySnippet: unknown category labels copyable and falls back to body", () => {
    expect(
      getPrimarySnippet(
        entry({
          category: "tools" as ContentEntry["category"],
          copySnippet: "CS",
        }),
      ),
    ).toEqual({ title: "Copyable asset", code: "CS", language: "text" });
    expect(
      getPrimarySnippet(
        entry({ category: "tools" as ContentEntry["category"], body: "B" }),
      ),
    ).toEqual({ title: "Usage", code: "B", language: "text" });
  });

  it("getMetadataFallback: hooks without a trigger and with documentation", () => {
    expect(
      getMetadataFallback(entry({ category: "hooks" })).points[0],
    ).toContain("hooks configuration");
    expect(
      getMetadataFallback(
        entry({
          category: "hooks",
          trigger: "Stop",
          documentationUrl: "https://docs",
        }),
      ).points[1],
    ).toContain("documentation link");
  });

  it("getRelatedEntries: tolerates missing tags on the anchor and items", () => {
    const anchor = entry({
      category: "agents",
      slug: "anchor",
      tags: undefined,
    });
    const a = {
      category: "agents",
      slug: "a",
      title: "a",
      description: "d",
    } as DirectoryEntry;
    const b = {
      category: "guides",
      slug: "b",
      title: "b",
      description: "d",
    } as DirectoryEntry;
    const related = getRelatedEntries(anchor, [a, b]);
    expect(related).toHaveLength(2);
  });

  it("getRelatedEntries: breaks fully-tied scores deterministically by hash closeness", () => {
    const anchor = entry({ category: "agents", slug: "anchor", tags: [] });
    const one = directory("agents", "tie-one");
    const two = directory("agents", "tie-two");
    const forward = getRelatedEntries(anchor, [one, two]).map(
      (item) => item.slug,
    );
    const reversed = getRelatedEntries(anchor, [two, one]).map(
      (item) => item.slug,
    );
    expect(forward).toHaveLength(2);
    expect(reversed).toEqual(forward);
  });

  it("getCollectionItems: coerces missing category or slug on object refs to empty", () => {
    const items = getCollectionItems(
      entry({
        category: "collections",
        items: [
          { slug: "only-slug" },
          { category: "agents" },
        ] as ContentEntry["items"],
      }),
      [],
    );
    expect(items).toEqual([]);
  });

  it("getTopFacts: includes trigger, arguments, format, and setup time", () => {
    expect(
      getTopFacts(
        entry({
          trigger: "Stop",
          argumentHint: "<file>",
          scriptLanguage: "sh",
          estimatedSetupTime: "5m",
        }),
      ),
    ).toEqual(
      expect.arrayContaining([
        { label: "Trigger", value: "Stop" },
        { label: "Arguments", value: "<file>" },
        { label: "Format", value: "sh" },
        { label: "Setup time", value: "5m" },
      ]),
    );
  });

  it("getSourceSignals: reviewer without a date and claim without a url use bare values", () => {
    const signals = getSourceSignals(
      entry({ reviewedBy: "maintainer", claimedBy: "owner" }),
    );
    expect(signals).toContainEqual({
      label: "Reviewed by",
      value: "maintainer",
    });
    expect(signals).toContainEqual({ label: "Claimed by", value: "owner" });
  });
});

describe("detail-assembly-lib renderMarkdown anchor without href", () => {
  it("drops a raw anchor tag that has no href attribute", async () => {
    const html = await renderMarkdown("<a>bare link</a>");
    expect(html).toContain("bare link");
    expect(html).not.toMatch(/<a[\s>]/);
  });
});
