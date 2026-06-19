import { describe, expect, it, vi } from "vitest";

vi.mock("@/lib/feeds", () => ({ etagFor: vi.fn(async () => "test-etag") }));
vi.mock("@/lib/security-headers", () => ({ applySecurityHeaders: (headers: Headers) => headers }));

vi.mock("@/data/entries", () => ({
  REGISTRY_ENTRIES: [
    {
      category: "agents",
      slug: "citation-shape-fixture",
      title: "Citation Shape Fixture",
      description: "Raw entry used for citation facts.",
      author: "Registry Author",
      documentationUrl: "https://example.com/docs",
      repoUrl: "https://github.com/example/citation-shape-fixture",
      safetyNotes: ["Runs local checks before writing files."],
      privacyNotes: ["Reads only files selected by the user."],
      platformCompatibility: [{ platform: "claude-code", supportLevel: "native-skill" }],
      dateAdded: "2026-06-14",
    },
  ],
  ENTRIES: [
    {
      category: "agents",
      slug: "citation-shape-fixture",
      title: "Citation Shape Fixture",
      description: "Normalized entry used for the web export.",
      author: "Registry Author",
      trust: "trusted",
      source: "github",
      sourceUrl: "https://github.com/example/citation-shape-fixture",
      docsUrl: "https://example.com/docs",
      platforms: ["claude-code"],
      safetyNotes: "Runs local checks before writing files.",
      safetyNotesList: ["Runs local checks before writing files."],
      privacyNotes: "Reads only files selected by the user.",
      privacyNotesList: ["Reads only files selected by the user."],
      platformCompatibility: [{ platform: "claude-code", support: "native-skill" }],
    },
  ],
}));

describe("buildLlmsFullTxt", () => {
  it("builds citation facts from raw registry entries, not normalized web entries", async () => {
    const { buildLlmsFullTxt } = await import("@/lib/llms");

    const output = buildLlmsFullTxt("https://heyclau.de");

    expect(output).toContain("Citation facts:\n");
    expect(output).toContain("- Source URLs: https://example.com/docs, https://github.com/example/citation-shape-fixture");
    expect(output).toContain("- Safety notes: Runs local checks before writing files.");
    expect(output).toContain("- Privacy notes: Reads only files selected by the user.");
    expect(output).toContain("- Platform compatibility: claude-code (native-skill)");
    expect(output).not.toContain("(undefined)");
  });
});
