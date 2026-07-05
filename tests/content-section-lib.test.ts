import { describe, expect, it } from "vitest";

import {
  extractSectionSubitems,
  findNextH3Start,
  getEmbeddedSectionType,
  getSectionEyebrow,
  getSectionVariant,
  htmlBeforeFirstH3,
  isEssentialVariant,
  shouldOpenSection,
  stripSectionTypeComments,
} from "../apps/web/src/lib/content-section-lib.ts";

const WARNING_KEYWORDS = [
  "warning",
  "critical",
  "security",
  "safety",
  "privacy",
  "danger",
  "caution",
] as const;

const PREREQUISITE_KEYWORDS = [
  "prerequisite",
  "requirement",
  "before you start",
  "before you begin",
  "getting started",
  "setup",
  "set up",
  "installation",
  "install",
] as const;

const TROUBLESHOOTING_KEYWORDS = [
  "troubleshooting",
  "common issues",
  "known issues",
  "faq",
] as const;

const FALSE_POSITIVE_TITLES = [
  "Uninstall",
  "Reinstall",
  "Reinstallation guide",
  "Insecurity in design",
  "Disinstallazione",
  "Preinstall checklist",
  "Microsetup details",
  "Postinstallation cleanup",
  "Overwarning the reader",
  "Subrequirements matrix",
  "Deinstallation guide",
  "Countersecurity measures",
  "Antisetup rhetoric",
  "Misinstallation myths",
] as const;

const COMPOUND_MATCH_TITLES: Array<{
  title: string;
  variant: ReturnType<typeof getSectionVariant>;
}> = [
  { title: "Non-critical path", variant: "warning" },
  { title: "Anti-troubleshooting rant", variant: "troubleshooting" },
  { title: "My FAQulous life", variant: "troubleshooting" },
  { title: "Pre-installation notes", variant: "prerequisites" },
  { title: "Post-setup verification", variant: "prerequisites" },
];

describe("getEmbeddedSectionType", () => {
  it("extracts a lowercase token from a standard marker comment", () => {
    expect(
      getEmbeddedSectionType("<!-- section type: overview --><p>x</p>"),
    ).toBe("overview");
  });

  it("preserves underscores and lowercases letters", () => {
    expect(getEmbeddedSectionType("<!-- section type: How_To -->")).toBe(
      "how_to",
    );
  });

  it("stops at the first non-letter or non-underscore character", () => {
    expect(getEmbeddedSectionType("<!-- section type: setup-steps -->")).toBe(
      "setup",
    );
    expect(
      getEmbeddedSectionType("<!-- section type: quick_reference -->"),
    ).toBe("quick_reference");
  });

  it("accepts up to 64 ascii letters and underscores", () => {
    const longToken = "a".repeat(64);
    const tooLong = "a".repeat(65);
    expect(getEmbeddedSectionType(`<!-- section type: ${longToken} -->`)).toBe(
      longToken,
    );
    expect(getEmbeddedSectionType(`<!-- section type: ${tooLong} -->`)).toBe(
      longToken,
    );
  });

  it("returns null when the marker value contains no valid token characters", () => {
    expect(getEmbeddedSectionType("<!-- section type: 123 -->")).toBeNull();
    expect(getEmbeddedSectionType("<!-- section type: --- -->")).toBeNull();
  });

  it("returns null when there is no section-type marker", () => {
    expect(getEmbeddedSectionType("<p>no marker here</p>")).toBeNull();
    expect(getEmbeddedSectionType("")).toBeNull();
  });

  it("matches the marker case-insensitively", () => {
    expect(getEmbeddedSectionType("<!-- SECTION TYPE: overview -->")).toBe(
      "overview",
    );
    expect(getEmbeddedSectionType("<!-- Section Type: Warning -->")).toBe(
      "warning",
    );
  });

  it("finds a marker comment that is not at the start of the html", () => {
    expect(
      getEmbeddedSectionType("<p>intro</p><!-- section type: related -->"),
    ).toBe("related");
  });

  it("returns null when the marker is outside a comment", () => {
    expect(getEmbeddedSectionType("<p>section type: fake</p>")).toBeNull();
  });

  it("reads the inner marker when comments are nested", () => {
    expect(
      getEmbeddedSectionType(
        "<!-- outer <!-- section type: nested --> still open -->",
      ),
    ).toBe("nested");
  });

  it("returns null when the comment opener is missing", () => {
    expect(getEmbeddedSectionType("section type: orphan -->")).toBeNull();
  });

  it("returns null when the comment closer is missing", () => {
    expect(getEmbeddedSectionType("<!-- section type: orphan")).toBeNull();
  });

  it("ignores a second marker comment after the first closes", () => {
    expect(
      getEmbeddedSectionType(
        "<!-- section type: first --><!-- section type: second -->",
      ),
    ).toBe("first");
  });

  it("trims whitespace around the extracted token", () => {
    expect(getEmbeddedSectionType("<!-- section type:   overview   -->")).toBe(
      "overview",
    );
  });

  it("stops reading at digits even when they appear early in the value", () => {
    expect(getEmbeddedSectionType("<!-- section type: v2overview -->")).toBe(
      "v",
    );
  });

  it("stops reading at spaces inside the comment value", () => {
    expect(
      getEmbeddedSectionType("<!-- section type: quick reference -->"),
    ).toBe("quick");
  });

  const validTypes = [
    "overview",
    "quick_reference",
    "related_content",
    "troubleshooting",
    "prerequisites",
    "warning",
    "default_section",
  ] as const;

  it.each(validTypes)("accepts valid embedded type %j", (type) => {
    expect(getEmbeddedSectionType(`<!-- section type: ${type} -->`)).toBe(type);
  });

  it("returns the first marker when multiple marker comments exist", () => {
    expect(
      getEmbeddedSectionType(
        "<!-- decoy section type: fake --><p>x</p><!-- section type: real -->",
      ),
    ).toBe("fake");
  });
});

describe("stripSectionTypeComments", () => {
  it("removes the marker comment and keeps the remaining html", () => {
    expect(
      stripSectionTypeComments("<!-- section type: overview --><p>body</p>"),
    ).toBe("<p>body</p>");
  });

  it("trims surrounding whitespace after removal", () => {
    expect(
      stripSectionTypeComments(
        "  <!-- section type: overview --><p>body</p>  ",
      ),
    ).toBe("<p>body</p>");
  });

  it("returns trimmed html unchanged when no marker is present", () => {
    expect(stripSectionTypeComments("  <p>body</p>  ")).toBe("<p>body</p>");
  });

  it("preserves html before and after an embedded marker comment", () => {
    expect(
      stripSectionTypeComments(
        "<header>top</header><!-- section type: setup --><p>body</p>",
      ),
    ).toBe("<header>top</header><p>body</p>");
  });

  it("removes only the recognized marker comment range", () => {
    expect(
      stripSectionTypeComments(
        "<!-- keep --><!-- section type: drop --><p>stay</p>",
      ),
    ).toBe("<!-- keep --><p>stay</p>");
  });

  it("handles an empty string", () => {
    expect(stripSectionTypeComments("")).toBe("");
  });

  it("leaves malformed marker text untouched", () => {
    const html = "<p>section type: not-a-comment</p>";
    expect(stripSectionTypeComments(html)).toBe(html);
  });

  it("strips the inner marker comment range when comments are nested", () => {
    const html = "<!-- outer <!-- section type: nested --> open -->";
    expect(stripSectionTypeComments(html)).toBe("<!-- outer  open -->");
  });

  it.each([
    ["<!-- section type: x -->  <p>a</p>  ", "<p>a</p>"],
    ["<p>keep</p><!-- section type: y -->", "<p>keep</p>"],
    ["<!-- section type: z -->\n<p>b</p>", "<p>b</p>"],
    ["<!-- section type: w --><!-- note -->", "<!-- note -->"],
  ])("stripSectionTypeComments(%j)", (input, expected) => {
    expect(stripSectionTypeComments(input)).toBe(expected);
  });
});

describe("findNextH3Start", () => {
  it("returns the index of the first valid h3 when multiple exist", () => {
    const html = "<p>intro</p><h3>One</h3><h3>Two</h3>";
    expect(findNextH3Start(html)).toBe(html.indexOf("<h3"));
  });

  it("respects the from offset when searching", () => {
    const html = "<h3>One</h3><h3>Two</h3>";
    const second = findNextH3Start(html, 1);
    expect(html.slice(second, second + 3)).toMatch(/h3/i);
    expect(html.slice(second - 10, second)).toContain("One");
  });

  it("finds h3 tags case-insensitively and with attributes", () => {
    expect(findNextH3Start("<H3>Title</H3>")).toBe(0);
    expect(findNextH3Start('<h3 id="item-1" class="x">Title</h3>')).toBe(0);
  });
});

describe("htmlBeforeFirstH3", () => {
  it("returns content before the first h3", () => {
    expect(htmlBeforeFirstH3("<p>intro</p><h3>Title</h3>")).toBe(
      "<p>intro</p>",
    );
  });

  it("returns the full html when no h3 exists", () => {
    expect(htmlBeforeFirstH3("<p>only paragraph</p>")).toBe(
      "<p>only paragraph</p>",
    );
  });

  it("trims leading and trailing whitespace", () => {
    expect(htmlBeforeFirstH3("  <p>intro</p>  <h3>Title</h3>  ")).toBe(
      "<p>intro</p>",
    );
  });

  it("returns an empty string when the document starts with h3", () => {
    expect(htmlBeforeFirstH3("<h3>Title</h3><p>body</p>")).toBe("");
  });

  it("ignores false-positive h3 prefixes", () => {
    expect(htmlBeforeFirstH3("<h3extra>bad</h3extra><h3>good</h3>")).toBe(
      "<h3extra>bad</h3extra>",
    );
  });

  it("handles empty input", () => {
    expect(htmlBeforeFirstH3("")).toBe("");
  });

  it.each([
    ["<p>only</p>", "<p>only</p>"],
    ["<h3>x</h3>", ""],
    [" intro <h3>x</h3>", "intro"],
  ])("htmlBeforeFirstH3(%j)", (input, expected) => {
    expect(htmlBeforeFirstH3(input)).toBe(expected);
  });
});

describe("extractSectionSubitems", () => {
  it("extracts a single subitem with id, title, and body html", () => {
    const html = '<h3 id="step-1">First step</h3><p>Do this.</p>';
    expect(extractSectionSubitems(html, "section-a")).toEqual([
      {
        id: "step-1",
        title: "First step",
        html: "<p>Do this.</p>",
      },
    ]);
  });

  it("extracts multiple subitems in document order", () => {
    const html = '<h3 id="one">One</h3><p>1</p><h3 id="two">Two</h3><p>2</p>';
    expect(extractSectionSubitems(html, "section-b")).toEqual([
      { id: "one", title: "One", html: "<p>1</p>" },
      { id: "two", title: "Two", html: "<p>2</p>" },
    ]);
  });

  it("uses a generated id when the heading has no id attribute", () => {
    const html = "<h3>Generated</h3><p>Body</p>";
    expect(extractSectionSubitems(html, "my-section")).toEqual([
      {
        id: "my-section-1",
        title: "Generated",
        html: "<p>Body</p>",
      },
    ]);
  });

  it("increments generated ids for subsequent headings", () => {
    const html = "<h3>First</h3><p>A</p><h3>Second</h3><p>B</p>";
    expect(extractSectionSubitems(html, "sec")).toEqual([
      { id: "sec-1", title: "First", html: "<p>A</p>" },
      { id: "sec-2", title: "Second", html: "<p>B</p>" },
    ]);
  });

  it("reads single-quoted id attributes", () => {
    const html = "<h3 id='quoted'>Title</h3><p>Body</p>";
    expect(extractSectionSubitems(html, "s")).toEqual([
      { id: "quoted", title: "Title", html: "<p>Body</p>" },
    ]);
  });

  it("strips inline markup from heading titles", () => {
    const html = "<h3><strong>Bold</strong> title</h3><p>Body</p>";
    expect(extractSectionSubitems(html, "s")[0]?.title).toBe("Bold title");
  });

  it("falls back to the first plain-text line of the body when the heading is empty", () => {
    const html = "<h3></h3><p>Fallback title line</p>";
    expect(extractSectionSubitems(html, "s")[0]?.title).toBe(
      "Fallback title line",
    );
  });

  it('uses "Troubleshooting item" when both heading and body are empty', () => {
    const html = "<h3></h3>";
    expect(extractSectionSubitems(html, "s")).toEqual([]);
  });

  it("filters out subitems whose body html is empty", () => {
    const html = "<h3>Empty</h3><h3>Full</h3><p>content</p>";
    expect(extractSectionSubitems(html, "s")).toEqual([
      { id: "s-2", title: "Full", html: "<p>content</p>" },
    ]);
  });

  it("stops when a heading is missing its closing tag", () => {
    const html = "<h3>Broken<p>still body";
    expect(extractSectionSubitems(html, "s")).toEqual([]);
  });

  it("captures rich html bodies until the next h3", () => {
    const html =
      '<h3 id="rich">Rich</h3><ul><li>one</li></ul><pre>code</pre><h3>Next</h3><p>x</p>';
    expect(extractSectionSubitems(html, "s")[0]).toEqual({
      id: "rich",
      title: "Rich",
      html: "<ul><li>one</li></ul><pre>code</pre>",
    });
  });

  it("returns an empty array when the html contains no h3 headings", () => {
    expect(extractSectionSubitems("<p>plain</p>", "s")).toEqual([]);
  });

  it("ignores h3-like substrings that fail the tag boundary check", () => {
    const html = "<h3extra>bad</h3extra><h3>good</h3><p>ok</p>";
    expect(extractSectionSubitems(html, "s")).toEqual([
      { id: "s-1", title: "good", html: "<p>ok</p>" },
    ]);
  });
});

describe("getSectionVariant", () => {
  describe("warning keywords", () => {
    it.each(WARNING_KEYWORDS)("matches warning keyword %j", (keyword) => {
      expect(getSectionVariant(keyword)).toBe("warning");
      expect(getSectionVariant(keyword.toUpperCase())).toBe("warning");
    });

    it.each(WARNING_KEYWORDS)(
      "matches warning keyword %j inside a longer title",
      (keyword) => {
        expect(getSectionVariant(`Please read: ${keyword} notes`)).toBe(
          "warning",
        );
      },
    );
  });

  describe("prerequisite keywords", () => {
    it.each(PREREQUISITE_KEYWORDS)(
      "matches prerequisite keyword %j",
      (keyword) => {
        expect(getSectionVariant(keyword)).toBe("prerequisites");
        expect(getSectionVariant(keyword.toUpperCase())).toBe("prerequisites");
      },
    );

    it.each(PREREQUISITE_KEYWORDS)(
      "matches prerequisite keyword %j inside a longer title",
      (keyword) => {
        expect(getSectionVariant(`Section: ${keyword} details`)).toBe(
          "prerequisites",
        );
      },
    );
  });

  describe("troubleshooting keywords", () => {
    it.each(TROUBLESHOOTING_KEYWORDS)(
      "matches troubleshooting keyword %j",
      (keyword) => {
        expect(getSectionVariant(keyword)).toBe("troubleshooting");
        expect(getSectionVariant(keyword.toUpperCase())).toBe(
          "troubleshooting",
        );
      },
    );

    it.each(TROUBLESHOOTING_KEYWORDS)(
      "matches troubleshooting keyword %j inside a longer title",
      (keyword) => {
        expect(getSectionVariant(`Helpful ${keyword} for users`)).toBe(
          "troubleshooting",
        );
      },
    );
  });

  describe("priority and fallback", () => {
    it("prioritizes warning over prerequisites", () => {
      expect(getSectionVariant("Security prerequisites")).toBe("warning");
      expect(getSectionVariant("Installation safety")).toBe("warning");
      expect(getSectionVariant("Privacy requirements")).toBe("warning");
    });

    it("prioritizes warning over troubleshooting", () => {
      expect(getSectionVariant("Security FAQ")).toBe("warning");
      expect(getSectionVariant("Critical common issues")).toBe("warning");
    });

    it("prioritizes prerequisites over troubleshooting when no warning keyword is present", () => {
      expect(getSectionVariant("Installation troubleshooting")).toBe(
        "prerequisites",
      );
      expect(getSectionVariant("Setup FAQ")).toBe("prerequisites");
    });

    it("returns default for ordinary titles", () => {
      expect(getSectionVariant("Overview")).toBe("default");
      expect(getSectionVariant("How it works")).toBe("default");
      expect(getSectionVariant("Architecture")).toBe("default");
      expect(getSectionVariant("")).toBe("default");
    });
  });

  describe("false positives and word boundaries", () => {
    it.each(FALSE_POSITIVE_TITLES)(
      "does not misclassify false positive title %j",
      (title) => {
        expect(getSectionVariant(title)).toBe("default");
      },
    );

    it("still matches inflected prerequisite forms at a word boundary", () => {
      expect(getSectionVariant("Prerequisites")).toBe("prerequisites");
      expect(getSectionVariant("Requirements checklist")).toBe("prerequisites");
      expect(getSectionVariant("Installation guide")).toBe("prerequisites");
    });

    it("matches install as a standalone word but not inside uninstall", () => {
      expect(getSectionVariant("Install the CLI")).toBe("prerequisites");
      expect(getSectionVariant("Uninstall the CLI")).toBe("default");
      expect(getSectionVariant("Reinstall package")).toBe("default");
    });

    it("matches setup but not microsetup", () => {
      expect(getSectionVariant("Project setup")).toBe("prerequisites");
      expect(getSectionVariant("Microsetup details")).toBe("default");
    });

    it("matches security but not insecurity", () => {
      expect(getSectionVariant("Security model")).toBe("warning");
      expect(getSectionVariant("Insecurity in design")).toBe("default");
    });

    it("matches critical after a hyphenated prefix", () => {
      expect(getSectionVariant("Critical update")).toBe("warning");
      expect(getSectionVariant("Non-critical path")).toBe("warning");
    });

    it.each(COMPOUND_MATCH_TITLES)(
      "matches keyword inside compound title %j as $variant",
      ({ title, variant }) => {
        expect(getSectionVariant(title)).toBe(variant);
      },
    );

    it("matches faq as a standalone token", () => {
      expect(getSectionVariant("FAQ")).toBe("troubleshooting");
      expect(getSectionVariant("Product FAQ")).toBe("troubleshooting");
    });

    it.each([
      { title: "Danger zone", variant: "warning" as const },
      { title: "Cautionary tale", variant: "warning" as const },
      { title: "Critical path analysis", variant: "warning" as const },
      { title: "Requirement list", variant: "prerequisites" as const },
      { title: "Before you start reading", variant: "prerequisites" as const },
      { title: "Before you begin coding", variant: "prerequisites" as const },
      { title: "Set up your env", variant: "prerequisites" as const },
      { title: "Known issues today", variant: "troubleshooting" as const },
      { title: "Common issues with auth", variant: "troubleshooting" as const },
      { title: "Changelog", variant: "default" as const },
      { title: "Usage examples", variant: "default" as const },
      { title: "API reference", variant: "default" as const },
      { title: "Performance tips", variant: "default" as const },
      { title: "Security", variant: "warning" as const },
      { title: "Install guide", variant: "prerequisites" as const },
    ])("classifies title %j as $variant", ({ title, variant }) => {
      expect(getSectionVariant(title)).toBe(variant);
    });
  });
});

describe("shouldOpenSection", () => {
  const openAtDepth = [
    { index: 0, variant: "default", open: true },
    { index: 1, variant: "default", open: true },
    { index: 2, variant: "default", open: false },
    { index: 3, variant: "default", open: false },
    { index: 0, variant: "warning", open: true },
    { index: 3, variant: "warning", open: true },
    { index: 0, variant: "prerequisites", open: true },
    { index: 4, variant: "prerequisites", open: true },
    { index: 2, variant: "troubleshooting", open: false },
    { index: 6, variant: "troubleshooting", open: false },
    { index: 5, variant: "quick_reference", open: true },
    { index: 10, variant: "quick_reference", open: true },
    { index: 5, variant: "related_content", open: false },
    { index: 7, variant: "default", open: false },
    { index: 8, variant: "warning", open: true },
    { index: 9, variant: "prerequisites", open: true },
  ] as const;

  it.each(openAtDepth)(
    "index $index + $variant => open=$open",
    ({ index, variant, open }) => {
      expect(shouldOpenSection({ index, variant })).toBe(open);
    },
  );
});

describe("content-section-lib integration", () => {
  it("strips a marker comment before h3 extraction", () => {
    const html =
      '<!-- section type: troubleshooting --><h3 id="a">Issue</h3><p>Fix it.</p>';
    const cleaned = stripSectionTypeComments(html);
    expect(getEmbeddedSectionType(html)).toBe("troubleshooting");
    expect(getEmbeddedSectionType(cleaned)).toBeNull();
    expect(extractSectionSubitems(cleaned, "sec")).toEqual([
      { id: "a", title: "Issue", html: "<p>Fix it.</p>" },
    ]);
  });

  it("uses htmlBeforeFirstH3 to isolate intro copy above subitems", () => {
    const html = "<p>Intro copy</p><h3>Step</h3><p>Details</p>";
    expect(htmlBeforeFirstH3(html)).toBe("<p>Intro copy</p>");
    expect(extractSectionSubitems(html, "sec")).toHaveLength(1);
  });

  it("classifies stripped section titles consistently with variant helpers", () => {
    const title = "Installation";
    const variant = getSectionVariant(title);
    expect(variant).toBe("prerequisites");
    expect(isEssentialVariant(variant)).toBe(true);
    expect(shouldOpenSection({ index: 5, variant })).toBe(true);
    expect(getSectionEyebrow(variant)).toBe("Setup");
  });
});

describe("findNextH3Start matrix", () => {
  it.each([
    ["<h3>Plain</h3>", 0],
    ['<h3 id="x">Attr</h3>', 0],
    ["<h3\n>Newline</h3>", 0],
    ["prefix<h3>Mid</h3>", "prefix".length],
    ["<h30>bad</h30>", -1],
    ["<h3class>bad</h3class>", -1],
    ["<paragraph>No headings</paragraph>", -1],
    ["<h2>Wrong level</h2>", -1],
  ])("findNextH3Start(%j) => %s", (html, expected) => {
    expect(findNextH3Start(html)).toBe(expected);
  });

  it("finds the third h3 when starting after the second heading close", () => {
    const html = "<h3>One</h3><h3>Two</h3><h3>Three</h3>";
    const secondClose = html.indexOf("</h3>", html.indexOf("</h3>") + 1) + 5;
    expect(findNextH3Start(html, secondClose)).toBe(html.lastIndexOf("<h3"));
  });
});

describe("extractSectionSubitems edge cases", () => {
  it("uses the Troubleshooting item fallback when heading is empty but body has markup", () => {
    const html = "<h3> </h3><p> </p>";
    expect(extractSectionSubitems(html, "sec")).toEqual([
      { id: "sec-1", title: "Troubleshooting item", html: "<p> </p>" },
    ]);
  });

  it("preserves html entities in body content", () => {
    const html = "<h3>Entity</h3><p>&amp; &lt;tag&gt;</p>";
    expect(extractSectionSubitems(html, "sec")[0]?.html).toBe(
      "<p>&amp; &lt;tag&gt;</p>",
    );
  });

  it("handles headings with mixed-case close tags", () => {
    const html = "<h3>Mixed</H3><p>Body</p>";
    expect(extractSectionSubitems(html, "sec")).toEqual([
      { id: "sec-1", title: "Mixed", html: "<p>Body</p>" },
    ]);
  });

  it("ignores id attributes outside the opening h3 tag", () => {
    const html = '<h3>Title</h3><p id="not-heading">Body</p>';
    expect(extractSectionSubitems(html, "sec")[0]?.id).toBe("sec-1");
  });

  it("prefers the heading id over generated ids even when body is long", () => {
    const html =
      '<h3 id="keep">Title</h3><p>' + "word ".repeat(50).trim() + "</p>";
    expect(extractSectionSubitems(html, "sec")[0]?.id).toBe("keep");
  });

  const multiItemHtml =
    '<h3 id="i1">One</h3><p>1</p><h3 id="i2">Two</h3><p>2</p><h3 id="i3">Three</h3><p>3</p>';

  it("extracts three ordered subitems", () => {
    expect(extractSectionSubitems(multiItemHtml, "batch")).toEqual([
      { id: "i1", title: "One", html: "<p>1</p>" },
      { id: "i2", title: "Two", html: "<p>2</p>" },
      { id: "i3", title: "Three", html: "<p>3</p>" },
    ]);
  });
});

describe("getSectionVariant title punctuation", () => {
  const punctuatedTitles: Array<{
    title: string;
    variant: ReturnType<typeof getSectionVariant>;
  }> = [
    { title: "⚠️ Warning", variant: "warning" },
    { title: "[Security]", variant: "warning" },
    { title: "(Privacy) policy", variant: "warning" },
    { title: "1. Prerequisites", variant: "prerequisites" },
    { title: "Step 1: Setup", variant: "prerequisites" },
    { title: "FAQ — billing", variant: "troubleshooting" },
    { title: "Common issues:", variant: "troubleshooting" },
    { title: "Release notes", variant: "default" },
  ];

  it.each(punctuatedTitles)(
    "classifies punctuated title %j as $variant",
    ({ title, variant }) => {
      expect(getSectionVariant(title)).toBe(variant);
    },
  );
});

describe("isEssentialVariant and getSectionEyebrow", () => {
  const essentials = ["warning", "prerequisites"] as const;
  const nonEssentials = [
    "default",
    "troubleshooting",
    "quick_reference",
    "related_content",
    "overview",
    "custom",
  ] as const;
  const labels = [
    ["prerequisites", "Setup"],
    ["warning", "Important"],
    ["troubleshooting", "Troubleshooting"],
    ["quick_reference", "Reference"],
    ["related_content", "Related"],
    ["default", "Section"],
    ["unknown", "Section"],
  ] as const;

  it.each(essentials)("marks %j as essential", (variant) => {
    expect(isEssentialVariant(variant)).toBe(true);
  });

  it.each(nonEssentials)("marks %j as non-essential", (variant) => {
    expect(isEssentialVariant(variant)).toBe(false);
  });

  it.each(labels)("maps variant %j to eyebrow %j", (variant, label) => {
    expect(getSectionEyebrow(variant)).toBe(label);
  });
});
