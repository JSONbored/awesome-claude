import { describe, expect, it } from "vitest";

import {
  FEATURED_PER_SECTION,
  SECTIONS,
  MONTHS,
  CATEGORY_LABELS,
  escapeHtml,
  absolute,
  categoryLabel,
  shortDate,
  truncate,
  itemBadges,
  cardHtml,
  overflowRowHtml,
  sectionHtml,
  sectionText,
  buildBriefEmail,
  type BriefItem,
  type BriefSection,
} from "../apps/web/src/lib/brief-email-lib";

const siteUrl = "https://heyclau.de";

function item(overrides: Partial<BriefItem> = {}): BriefItem {
  return {
    title: "Demo Entry",
    url: "/entry/mcp/demo",
    category: "mcp",
    description: "A useful MCP server for weekly brief rendering.",
    ...overrides,
  };
}

describe("constants", () => {
  it("exposes section layout constants", () => {
    expect(FEATURED_PER_SECTION).toBe(4);
    expect(SECTIONS).toHaveLength(3);
    expect(SECTIONS.map((section) => section.key)).toEqual([
      "newEntries",
      "sourceBacked",
      "saferInstalls",
    ]);
    expect(MONTHS).toHaveLength(12);
    expect(CATEGORY_LABELS.mcp).toBe("MCP server");
    expect(CATEGORY_LABELS.skills).toBe("Skill");
  });
});

describe("escapeHtml", () => {
  it("escapes HTML metacharacters", () => {
    expect(escapeHtml(`Tom & "Jerry" <script>`)).toBe(
      "Tom &amp; &quot;Jerry&quot; &lt;script&gt;",
    );
  });
});

describe("absolute", () => {
  it("returns the site url for empty paths", () => {
    expect(absolute("", siteUrl)).toBe(siteUrl);
  });

  it("preserves absolute http(s) urls", () => {
    expect(absolute("https://example.com/x", siteUrl)).toBe(
      "https://example.com/x",
    );
  });

  it("joins root-relative and bare relative paths", () => {
    expect(absolute("/entry/mcp/demo", siteUrl)).toBe(
      "https://heyclau.de/entry/mcp/demo",
    );
    expect(absolute("entry/mcp/demo", siteUrl)).toBe(
      "https://heyclau.de/entry/mcp/demo",
    );
  });
});

describe("categoryLabel", () => {
  it("maps known categories and capitalizes unknown ones safely", () => {
    expect(categoryLabel("mcp")).toBe("MCP server");
    expect(categoryLabel("agents")).toBe("Agent");
    expect(categoryLabel("constructor")).toBe("Constructor");
    expect(categoryLabel()).toBe("");
  });

  it("does not read from Object.prototype keys", () => {
    expect(categoryLabel("toString")).toBe("ToString");
    expect(Object.hasOwn(CATEGORY_LABELS, "toString")).toBe(false);
  });
});

describe("shortDate", () => {
  it("formats ISO dates as month/day labels", () => {
    expect(shortDate("2026-06-19")).toBe("Jun 19");
    expect(shortDate("2026-01-08")).toBe("Jan 8");
  });

  it("returns empty text for invalid dates", () => {
    expect(shortDate("not-a-date")).toBe("");
    expect(shortDate("")).toBe("");
    expect(shortDate(undefined)).toBe("");
    expect(shortDate("2026-13-40")).toBe("");
  });
});

describe("truncate", () => {
  it("returns short text unchanged", () => {
    expect(truncate("short text")).toBe("short text");
  });

  it("truncates long text on a word boundary with an ellipsis", () => {
    const long =
      "This is a much longer description that should be shortened before it reaches the email card limit for readability in clients.";
    const result = truncate(long, 40);
    expect(result.endsWith("…")).toBe(true);
    expect(result.length).toBeLessThanOrEqual(41);
    expect(result).not.toContain("clients");
  });
});

describe("itemBadges", () => {
  it("collects source, verification, safety, and date badges", () => {
    expect(
      itemBadges({
        sourceUrls: ["https://example.com/docs"],
        packageVerified: true,
        safetyNotesCount: 2,
        dateAdded: "2026-01-08",
      }),
    ).toEqual([
      "source-backed",
      "verified package",
      "safety notes",
      "added Jan 8",
    ]);
  });

  it("omits badges when metadata is absent", () => {
    expect(itemBadges({})).toEqual([]);
  });
});

describe("cardHtml", () => {
  it("renders category, title, description, and badge metadata", () => {
    const html = cardHtml(
      item({
        title: "Escaped <MCP>",
        description: "Runs <scripts> safely",
        sourceUrls: ["https://example.com"],
        packageVerified: true,
        dateAdded: "2026-01-08",
      }),
      siteUrl,
    );
    expect(html).toContain("MCP server");
    expect(html).toContain("Escaped &lt;MCP&gt;");
    expect(html).toContain("Runs &lt;scripts&gt; safely");
    expect(html).toContain("source-backed");
    expect(html).toContain("verified package");
    expect(html).toContain('href="https://heyclau.de/entry/mcp/demo"');
  });

  it("omits optional rows when category and description are absent", () => {
    const html = cardHtml(
      item({ category: undefined, description: "" }),
      siteUrl,
    );
    expect(html).not.toContain("text-transform:uppercase");
    expect(html).not.toContain("line-height:1.5");
  });
});

describe("overflowRowHtml", () => {
  it("renders compact overflow rows with optional category tags", () => {
    const html = overflowRowHtml(item({ title: "Overflow Item" }), siteUrl);
    expect(html).toContain("Overflow Item");
    expect(html).toContain("MCP server");
    expect(html).toContain("border-bottom:1px solid #f0ede4");

    const bare = overflowRowHtml(
      item({ title: "Bare", category: undefined }),
      siteUrl,
    );
    expect(bare).not.toContain("text-transform:uppercase");
  });
});

describe("sectionHtml", () => {
  const section: BriefSection = SECTIONS[0];

  it("returns empty output when a section has no titled items", () => {
    expect(sectionHtml(section, [], siteUrl)).toBe("");
    expect(sectionHtml(section, [{ title: "" }], siteUrl)).toBe("");
  });

  it("renders featured cards and overflow rows", () => {
    const rows = Array.from({ length: 6 }, (_, index) =>
      item({ title: `Entry ${index}`, url: `/entry/rules/e${index}` }),
    );
    const html = sectionHtml(section, rows, siteUrl);
    expect(html).toContain("New this week");
    expect(html).toContain("Fresh additions to the registry.");
    expect((html.match(/padding:14px 16px/g) ?? []).length).toBe(
      FEATURED_PER_SECTION,
    );
    expect((html.match(/border-bottom:1px solid #f0ede4/g) ?? []).length).toBe(
      2,
    );
  });
});

describe("sectionText", () => {
  const section: BriefSection = SECTIONS[1];

  it("renders plain-text section headers and links", () => {
    const text = sectionText(
      section,
      [
        item({
          title: "Backed Pick",
          category: "skills",
          description: "A source-backed skill pack.",
        }),
      ],
      siteUrl,
    );
    expect(text).toContain("SOURCE-BACKED PICKS");
    expect(text).toContain(
      "Backed by primary documentation or upstream source.",
    );
    expect(text).toContain("• Backed Pick [Skill]");
    expect(text).toContain("A source-backed skill pack.");
    expect(text).toContain("https://heyclau.de/entry/mcp/demo");
  });

  it("adds compact overflow lines after the featured picks", () => {
    const rows = Array.from({ length: 5 }, (_, index) =>
      item({ title: `Overflow ${index}`, url: `/entry/mcp/o${index}` }),
    );
    const text = sectionText(SECTIONS[0], rows, siteUrl);
    expect((text.match(/^• /gm) ?? []).length).toBe(5);
    expect(text).toContain(
      "Overflow 4 [MCP server] — https://heyclau.de/entry/mcp/o4",
    );
  });
});

describe("buildBriefEmail", () => {
  it("builds review and audience subjects from the date label", () => {
    const review = buildBriefEmail({
      brief: { sections: {} },
      siteUrl,
      dateLabel: "2026-01-09",
      approveUrl: "https://gate.example/approve",
    });
    expect(review.subject).toBe("[Review] Weekly Brief — Jan 9");
    expect(review.html).toContain("Approve &amp; schedule send");
    expect(review.text).toContain(
      "Approve & schedule: https://gate.example/approve",
    );

    const audience = buildBriefEmail({
      brief: { sections: {} },
      siteUrl,
      dateLabel: "not-a-date",
    });
    expect(audience.subject).toBe("HeyClaude Weekly Brief — not-a-date");
    expect(audience.html).not.toContain("Approve &amp; schedule send");
  });

  it("renders summary, theme, editor note, and all section keys", () => {
    const result = buildBriefEmail({
      brief: {
        summary: {
          newEntryCount: 3,
          sourceBackedCount: 2,
          saferInstallCount: 1,
        },
        theme: "Fresh MCP and skills shipped this week.",
        note: "Reply with what to cover next.",
        sections: {
          newEntries: [item({ title: "New MCP" })],
          sourceBacked: [item({ title: "Backed MCP", category: "mcp" })],
          saferInstalls: [item({ title: "Safer MCP", category: "mcp" })],
        },
      },
      siteUrl,
      dateLabel: "2026-06-19",
    });

    expect(result.html).toContain(
      "3 new this week · 2 source-backed · 1 safer installs",
    );
    expect(result.html).toContain("Fresh MCP and skills shipped this week.");
    expect(result.html).toContain("From the editor");
    expect(result.html).toContain("Reply with what to cover next.");
    expect(result.text).toContain("From the editor:");
    expect(result.text).toContain("NEW THIS WEEK");
    expect(result.text).toContain("SOURCE-BACKED PICKS");
    expect(result.text).toContain("SAFER INSTALLS");
    expect(result.html).toContain("New MCP");
    expect(result.html).toContain("Backed MCP");
    expect(result.html).toContain("Safer MCP");
  });

  it("escapes unsafe brief content and shows the empty-state fallback", () => {
    const result = buildBriefEmail({
      brief: {
        theme: `<script>alert("x")</script>`,
        note: `Line one\n<script>bad</script>`,
        sections: {
          newEntries: [
            item({
              title: 'Title "quoted"',
              description: "<unsafe>",
              url: "/entry/mcp/unsafe",
            }),
          ],
        },
      },
      siteUrl,
      dateLabel: "2026-06-19",
    });

    expect(result.html).toContain(
      "&lt;script&gt;alert(&quot;x&quot;)&lt;/script&gt;",
    );
    expect(result.html).toContain("&lt;unsafe&gt;");
    expect(result.html).not.toContain("<script>");

    const empty = buildBriefEmail({
      brief: { sections: {} },
      siteUrl,
      dateLabel: "2026-06-19",
    });
    expect(empty.html).toContain("No notable activity this week.");
    expect(empty.text).toContain("— Reviewed picks from https://heyclau.de");
  });

  it("uses absolute urls for items without leading slashes", () => {
    const result = buildBriefEmail({
      brief: {
        sections: {
          newEntries: [item({ url: "entry/mcp/relative" })],
        },
      },
      siteUrl,
      dateLabel: "2026-06-19",
    });
    expect(result.text).toContain("https://heyclau.de/entry/mcp/relative");
  });
});
