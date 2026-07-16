import { describe, expect, it } from "vitest";

import { buildCursorSkillAdapter } from "../packages/registry/src/artifacts-lib.js";

const baseEntry = {
  category: "skills",
  slug: "demo",
  title: "Demo Skill",
  description: "A reusable skill workflow used for adapter coverage.",
};

function sourceLine(markdown: string) {
  const lines = markdown.split("\n");
  return lines[lines.length - 1];
}

describe("artifacts-lib buildCursorSkillAdapter source resolution", () => {
  it("falls back to the canonical entry url when no source is present", () => {
    expect(sourceLine(buildCursorSkillAdapter(baseEntry))).toBe(
      "https://heyclau.de/entry/skills/demo",
    );
  });

  it("prefers the documentation url over the canonical url", () => {
    expect(
      sourceLine(
        buildCursorSkillAdapter({
          ...baseEntry,
          documentationUrl: "https://example.com/docs",
        }),
      ),
    ).toBe("https://example.com/docs");
  });

  it("prefers the repo url over the documentation url", () => {
    expect(
      sourceLine(
        buildCursorSkillAdapter({
          ...baseEntry,
          repoUrl: "https://github.com/example/demo",
          documentationUrl: "https://example.com/docs",
        }),
      ),
    ).toBe("https://github.com/example/demo");
  });

  it("prefers an absolute download url over the repo url", () => {
    expect(
      sourceLine(
        buildCursorSkillAdapter({
          ...baseEntry,
          downloadUrl: "https://cdn.example.com/demo.zip",
          repoUrl: "https://github.com/example/demo",
        }),
      ),
    ).toBe("https://cdn.example.com/demo.zip");
  });

  it("absolutizes a site-relative download url", () => {
    expect(
      sourceLine(
        buildCursorSkillAdapter({
          ...baseEntry,
          downloadUrl: "/downloads/demo.zip",
        }),
      ),
    ).toBe("https://heyclau.de/downloads/demo.zip");
  });
});

describe("artifacts-lib buildCursorSkillAdapter body", () => {
  it("renders an install section when an install command exists", () => {
    const adapter = buildCursorSkillAdapter({
      ...baseEntry,
      installCommand: "npx -y demo",
    });
    expect(adapter).toContain("## Install");
    expect(adapter).toContain("```bash\nnpx -y demo\n```");
  });

  it("omits the install section when no install command exists", () => {
    expect(buildCursorSkillAdapter(baseEntry)).not.toContain("## Install");
  });

  it("prefers the card description and escapes quotes in frontmatter", () => {
    const adapter = buildCursorSkillAdapter({
      ...baseEntry,
      cardDescription: 'He said "hi"',
    });
    expect(adapter.split("\n")[1]).toBe('description: "He said \\"hi\\""');
  });
});
