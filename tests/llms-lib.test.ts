import { describe, expect, it } from "vitest";

import {
  LLMS_ARTIFACT_SCHEMA_VERSION,
  clean,
  trimLineEndings,
  sectionText,
  listValue,
  bulletList,
  entrySourceUrls,
  entryLastVerified,
  entryCitationFacts,
  buildEntryCitationFacts,
  renderEntryLlms,
  renderCorpusLlms,
} from "../packages/registry/src/llms-lib.js";

function entry(overrides: Record<string, unknown> = {}) {
  return {
    category: "agents",
    slug: "demo-agent",
    title: "Demo Agent",
    description: "A helpful demo agent for testing LLMS exports.",
    ...overrides,
  };
}

describe("constants and text helpers", () => {
  it("exposes the LLMS schema version", () => {
    expect(LLMS_ARTIFACT_SCHEMA_VERSION).toBe(3);
  });

  it("cleans nullable strings", () => {
    expect(clean("  hi ")).toBe("hi");
    expect(clean(null)).toBe("");
    expect(clean(undefined)).toBe("");
  });

  it("trims trailing whitespace per line", () => {
    expect(trimLineEndings("alpha  \nbeta   \n")).toBe("alpha\nbeta\n");
  });
});

describe("listValue and bulletList", () => {
  it("joins array values and accepts single strings", () => {
    expect(listValue(["a", " b ", ""])).toBe("a, b");
    expect(listValue("solo")).toBe("solo");
    expect(listValue("")).toBe("");
    expect(listValue(null)).toBe("");
    expect(listValue(undefined)).toBe("");
  });

  it("builds markdown bullet lists from arrays only", () => {
    expect(bulletList(["one", " two ", ""])).toEqual(["- one", "- two"]);
    expect(bulletList("not-array")).toEqual([]);
    expect(bulletList(null)).toEqual([]);
  });
});

describe("entrySourceUrls", () => {
  it("deduplicates documentation, repo, github, and website urls", () => {
    expect(
      entrySourceUrls({
        documentationUrl: "https://docs.example.com",
        repoUrl: "https://github.com/example/repo",
        githubUrl: "https://github.com/example/repo",
        websiteUrl: "https://example.com",
      }),
    ).toEqual([
      "https://docs.example.com",
      "https://github.com/example/repo",
      "https://example.com",
    ]);
  });

  it("falls back to docsUrl and sourceUrl aliases", () => {
    expect(
      entrySourceUrls({
        docsUrl: "https://docs.example.com/guide",
        sourceUrl: "https://github.com/example/source",
      }),
    ).toEqual([
      "https://docs.example.com/guide",
      "https://github.com/example/source",
    ]);
  });

  it("uses aliases when the primary url fields are empty strings", () => {
    expect(
      entrySourceUrls({
        documentationUrl: "",
        docsUrl: "https://docs.example.com/guide",
        githubUrl: "",
        sourceUrl: "https://github.com/example/source",
      }),
    ).toEqual([
      "https://docs.example.com/guide",
      "https://github.com/example/source",
    ]);
  });
});

describe("entryLastVerified", () => {
  it("prefers verifiedAt, then contentUpdatedAt, repoUpdatedAt, dateAdded", () => {
    expect(entryLastVerified({ verifiedAt: "2026-01-01" })).toBe("2026-01-01");
    expect(
      entryLastVerified({
        contentUpdatedAt: "2026-02-01",
        repoUpdatedAt: "2026-03-01",
        dateAdded: "2026-04-01",
      }),
    ).toBe("2026-02-01");
    expect(entryLastVerified({ repoUpdatedAt: "2026-03-01" })).toBe(
      "2026-03-01",
    );
    expect(entryLastVerified({ dateAdded: "2026-04-01" })).toBe("2026-04-01");
    expect(entryLastVerified({})).toBe("");
  });
});

describe("sectionText", () => {
  it("renders titled sections with markdown bodies", () => {
    expect(
      sectionText({
        sections: [
          { title: "Intro", markdown: "Hello world." },
          { title: "", markdown: "" },
          { title: "Usage", markdown: "Run the agent." },
        ],
      }),
    ).toBe("## Intro\nHello world.\n\n## Usage\nRun the agent.");
  });

  it("falls back to code blocks when markdown is empty", () => {
    expect(
      sectionText({
        sections: [
          {
            title: "Config",
            markdown: "",
            codeBlocks: [
              { language: "json", code: '{"x":1}' },
              { language: "", code: "" },
              { code: "plain" },
            ],
          },
        ],
      }),
    ).toBe('## Config\n```json\n{"x":1}\n```\n```text\nplain\n```');
  });

  it("uses a default section title when only markdown is present", () => {
    expect(
      sectionText({
        sections: [{ title: "", markdown: "Body only." }],
      }),
    ).toBe("## Section\nBody only.");
  });

  it("falls back to entry body when no sections exist", () => {
    expect(sectionText({ body: "  Raw body content  " })).toBe(
      "Raw body content",
    );
    expect(sectionText({ sections: [], body: "" })).toBe("");
  });
});

describe("entryCitationFacts", () => {
  it("includes canonical url and populated registry fields", () => {
    const facts = entryCitationFacts(
      entry({
        author: "Ada",
        brandName: "Example",
        brandDomain: "example.com",
        brandAssetSource: "manual",
        downloadUrl: "https://example.com/pkg.tgz",
        downloadSha256: "abc123",
        safetyNotesList: ["Runs locally"],
        privacyNotes: "No telemetry",
        platformCompatibility: [
          { platform: "claude-code", supportLevel: "native-skill" },
          { platform: "cursor", support: "compatible" },
        ],
        submittedBy: "bob",
        sourceSubmissionUrl: "https://github.com/org/repo/pull/1",
        importPrUrl: "https://github.com/org/awesome/pull/2",
        reviewedBy: "maintainer",
        claimStatus: "claimed",
        claimedBy: "owner",
        license: "MIT",
        verifiedAt: "2026-06-01",
        documentationUrl: "https://docs.example.com",
        repoUrl: "https://github.com/example/repo",
      }),
      { siteUrl: "https://heyclau.de/" },
    );

    expect(facts).toEqual(
      expect.arrayContaining([
        ["Canonical URL", "https://heyclau.de/entry/agents/demo-agent"],
        [
          "Source URLs",
          "https://docs.example.com, https://github.com/example/repo",
        ],
        ["Brand", "Example"],
        ["Brand domain", "example.com"],
        ["Brand asset source", "manual"],
        ["Package URL", "https://example.com/pkg.tgz"],
        ["Package SHA256", "abc123"],
        ["Safety notes", "Runs locally"],
        ["Privacy notes", "No telemetry"],
        [
          "Platform compatibility",
          "claude-code (native-skill), cursor (compatible)",
        ],
        ["Author", "Ada"],
        ["Submitted by", "bob"],
        ["Original submission", "https://github.com/org/repo/pull/1"],
        ["Import PR", "https://github.com/org/awesome/pull/2"],
        ["Reviewed by", "maintainer"],
        ["Claim status", "claimed"],
        ["Claimed by", "owner"],
        ["License", "MIT"],
        ["Last verified", "2026-06-01"],
        ["Robots", "indexable"],
      ]),
    );
  });

  it("omits empty values and marks noindex entries", () => {
    const facts = entryCitationFacts(entry({ robotsIndex: false }), {
      siteUrl: "https://example.com",
    });
    expect(facts.map(([label]) => label)).not.toContain("Author");
    expect(facts).toContainEqual(["Robots", "noindex"]);
  });

  it("accepts safety and privacy notes as arrays or strings", () => {
    expect(
      entryCitationFacts(entry({ safetyNotes: ["a", "b"] })).find(
        ([label]) => label === "Safety notes",
      ),
    ).toEqual(["Safety notes", "a, b"]);
    expect(
      entryCitationFacts(entry({ privacyNotesList: ["x"] })).find(
        ([label]) => label === "Privacy notes",
      ),
    ).toEqual(["Privacy notes", "x"]);
  });
});

describe("buildEntryCitationFacts", () => {
  it("formats citation facts as markdown bullets", () => {
    const text = buildEntryCitationFacts(
      entry({
        author: "Ada",
        documentationUrl: "https://docs.example.com",
      }),
      { siteUrl: "https://heyclau.de" },
    );
    expect(text).toContain(
      "- Canonical URL: https://heyclau.de/entry/agents/demo-agent",
    );
    expect(text).toContain("- Author: Ada");
    expect(text).toContain("- Source URLs: https://docs.example.com");
  });
});

describe("renderEntryLlms", () => {
  it("renders a full per-entry LLMS document", () => {
    const output = renderEntryLlms(
      entry({
        author: "Ada",
        submittedBy: "bob",
        sourceSubmissionUrl: "https://github.com/org/repo/pull/1",
        importPrUrl: "https://github.com/org/awesome/pull/2",
        dateAdded: "2026-06-14",
        documentationUrl: "https://docs.example.com",
        repoUrl: "https://github.com/example/repo",
        githubUrl: "https://github.com/example/dir",
        downloadUrl: "https://example.com/pkg.tgz",
        tags: ["claude", "agent"],
        safetyNotes: ["Runs locally"],
        privacyNotes: ["No telemetry"],
        body: "Do helpful things.",
      }),
      { siteUrl: "https://heyclau.de" },
    );

    expect(output).toContain("# Demo Agent");
    expect(output).toContain("URL: https://heyclau.de/entry/agents/demo-agent");
    expect(output).toContain("Author: Ada");
    expect(output).toContain("Submitted by: bob");
    expect(output).toContain(
      "Original submission: https://github.com/org/repo/pull/1",
    );
    expect(output).toContain(
      "Import PR: https://github.com/org/awesome/pull/2",
    );
    expect(output).toContain("Date added: 2026-06-14");
    expect(output).toContain("Documentation: https://docs.example.com");
    expect(output).toContain("Repository: https://github.com/example/repo");
    expect(output).toContain(
      "Directory source: https://github.com/example/dir",
    );
    expect(output).toContain("Download: https://example.com/pkg.tgz");
    expect(output).toContain("## Citation Facts");
    expect(output).toContain("## Summary");
    expect(output).toContain("A helpful demo agent for testing LLMS exports.");
    expect(output).toContain("## Tags");
    expect(output).toContain("- claude");
    expect(output).toContain("## Safety Notes");
    expect(output).toContain("- Runs locally");
    expect(output).toContain("## Privacy Notes");
    expect(output).toContain("- No telemetry");
    expect(output).toContain("## Content");
    expect(output).toContain("Do helpful things.");
  });

  it("omits optional metadata and uses tag fallback", () => {
    const output = renderEntryLlms(entry({ tags: [] }));
    expect(output).not.toContain("Author:");
    expect(output).toContain("## Tags\n- none");
    expect(output).not.toContain("## Safety Notes");
    expect(output).not.toContain("## Privacy Notes");
  });

  it("keeps blank-line separators between every section", () => {
    const output = renderEntryLlms(
      entry({
        author: "Ada",
        tags: ["claude"],
        safetyNotes: ["Runs locally"],
        privacyNotes: ["No telemetry"],
        body: "Do helpful things.",
      }),
    );
    // A blank line follows the title and precedes each section header, rather
    // than every blank line being stripped by the old `.filter(Boolean)`.
    expect(output).toContain("# Demo Agent\n\n");
    for (const header of [
      "Citation Facts",
      "Summary",
      "Tags",
      "Safety Notes",
      "Privacy Notes",
      "Content",
    ]) {
      expect(output).toContain(`\n\n## ${header}\n`);
    }
  });

  it("renders structured section content instead of raw body", () => {
    const output = renderEntryLlms(
      entry({
        body: "ignored when sections exist",
        sections: [{ title: "Setup", markdown: "Install first." }],
      }),
    );
    expect(output).toContain("## Setup\nInstall first.");
    expect(output).not.toContain("ignored when sections exist");
  });
});

describe("renderCorpusLlms", () => {
  it("renders a corpus index and full entry content", () => {
    const output = renderCorpusLlms(
      [
        entry({ slug: "alpha", title: "Alpha" }),
        entry({ slug: "beta", title: "Beta", category: "skills" }),
      ],
      {
        siteName: "TestDir",
        siteDescription: "Test corpus.",
        siteUrl: "https://example.com/",
      },
    );

    expect(output).toContain("# TestDir Full Corpus");
    expect(output).toContain("Test corpus.");
    expect(output).toContain("Base URL: https://example.com");
    expect(output).toContain("Total entries: 2");
    expect(output).toContain("## Entry Index");
    expect(output).toContain(
      "- [Alpha](https://example.com/entry/agents/alpha) (agents)",
    );
    expect(output).toContain(
      "- [Beta](https://example.com/entry/skills/beta) (skills)",
    );
    expect(output).toContain("## Entry Content");
    expect(output).toContain("# Alpha");
    expect(output).toContain("# Beta");
  });

  it("uses default site metadata", () => {
    const output = renderCorpusLlms([entry()]);
    expect(output).toContain("# HeyClaude Full Corpus");
    expect(output).toContain("Base URL: https://heyclau.de");
    expect(output).toContain("Total entries: 1");
  });
});
