import { describe, expect, it } from "vitest";

import {
  buildEntry,
  type RegistryEntry,
} from "../apps/web/src/data/entry-normalize";

function baseEntry(overrides: Partial<RegistryEntry> = {}): RegistryEntry {
  return {
    category: "skills",
    slug: "platform-fixture",
    title: "Platform Fixture",
    description: "Fixture entry for platform compatibility normalization.",
    tags: [],
    ...overrides,
  };
}

describe("buildEntry platform compatibility", () => {
  it("maps common support-level synonyms to canonical platform support values", () => {
    const entry = buildEntry(
      baseEntry({
        platformCompatibility: [
          { platform: "Claude Code", supportLevel: "full" },
          { platform: "Cursor", support: "partial" },
          { platform: "Windsurf", supportLevel: "native" },
          { platform: "Aider", support: "manual" },
          { platform: "Zed", supportLevel: "unsupported" },
        ],
      }),
    );

    expect(entry.platformCompatibility).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          platform: "claude-code",
          support: "native-skill",
        }),
        expect.objectContaining({ platform: "cursor", support: "adapter" }),
        expect.objectContaining({
          platform: "windsurf",
          support: "native-skill",
        }),
        expect.objectContaining({
          platform: "aider",
          support: "manual-context",
        }),
        expect.objectContaining({ platform: "zed", support: "unsupported" }),
      ]),
    );
    expect(entry.platformCompatibility).toHaveLength(5);
  });

  it("normalizes support keys with underscores, spaces, and casing", () => {
    const entry = buildEntry(
      baseEntry({
        platformCompatibility: [
          { platform: "claude-code", supportLevel: "Native_Skill" },
          { platform: "cursor", support: "Manual Context" },
        ],
      }),
    );

    expect(entry.platformCompatibility).toEqual([
      expect.objectContaining({
        platform: "claude-code",
        support: "native-skill",
      }),
      expect.objectContaining({
        platform: "cursor",
        support: "manual-context",
      }),
    ]);
  });

  it("does not inherit prototype property names when normalizing support levels", () => {
    const entry = buildEntry(
      baseEntry({
        platformCompatibility: [
          { platform: "claude-code", supportLevel: "constructor" },
        ],
      }),
    );

    expect(entry.platformCompatibility).toEqual([
      expect.objectContaining({
        platform: "claude-code",
        support: "manual-context",
      }),
    ]);
  });

  it("defaults unknown support strings to manual-context", () => {
    const entry = buildEntry(
      baseEntry({
        platformCompatibility: [
          { platform: "claude-code", supportLevel: "experimental-beta" },
        ],
      }),
    );

    expect(entry.platformCompatibility).toEqual([
      expect.objectContaining({
        platform: "claude-code",
        support: "manual-context",
      }),
    ]);
  });

  it("infers platforms from tags and category when compatibility rows are absent", () => {
    const mcpEntry = buildEntry(
      baseEntry({
        category: "mcp",
        tags: ["mcp", "automation"],
        platformCompatibility: undefined,
      }),
    );
    expect(mcpEntry.platforms).toEqual(
      expect.arrayContaining(["claude-code", "claude-desktop"]),
    );

    const raycastEntry = buildEntry(
      baseEntry({
        category: "tools",
        tags: ["raycast", "launcher"],
        platformCompatibility: undefined,
      }),
    );
    expect(raycastEntry.platforms).toContain("raycast");
  });

  it("normalizes related entry relations and claim status", () => {
    const entry = buildEntry(
      baseEntry({
        claimStatus: "VERIFIED",
        relatedEntries: [
          {
            category: "mcp",
            slug: "related-server",
            title: "Related Server",
            relation: "works-with",
          },
          {
            category: "hooks",
            slug: "invalid",
            title: "",
            relation: "bogus",
          },
        ],
      }),
    );

    expect(entry.claimStatus).toBe("verified");
    expect(entry.relatedEntries).toEqual([
      expect.objectContaining({
        key: "mcp:related-server",
        relation: "works-with",
        url: "/entry/mcp/related-server",
      }),
    ]);
  });

  it("derives source and trust posture from registry fields", () => {
    const entry = buildEntry(
      baseEntry({
        packageVerified: true,
        downloadSha256: "abc123",
        githubUrl: "https://github.com/example/platform-fixture",
        safetyNotes: "Runs local scripts.",
        privacyNotes: "Does not send prompts off-device.",
      }),
    );

    expect(entry.source).toBe("source-backed");
    expect(entry.trust).toBe("trusted");
    expect(entry.safetyNotes).toBe("Runs local scripts.");
    expect(entry.privacyNotes).toBe("Does not send prompts off-device.");
  });

  it("whitelists hook triggers and preserves script metadata", () => {
    const entry = buildEntry(
      baseEntry({
        category: "hooks",
        trigger: "PreToolUse",
        scriptLanguage: "bash",
        scriptBody: "echo hello",
      }),
    );

    expect(entry.trigger).toBe("PreToolUse");
    expect(entry.scriptLanguage).toBe("bash");
    expect(entry.scriptBody).toBe("echo hello");
  });
});

describe("buildEntry provenance fields", () => {
  it("passes through author profile and submitter attribution fields", () => {
    const entry = buildEntry(
      baseEntry({
        author: "ABMeter",
        authorProfileUrl: "https://abmeter.ai",
        submittedBy: "kiannidev",
        submittedByUrl: "https://github.com/kiannidev",
      }),
    );

    expect(entry.authorProfileUrl).toBe("https://abmeter.ai");
    expect(entry.submittedBy).toBe("kiannidev");
    expect(entry.submittedByUrl).toBe("https://github.com/kiannidev");
  });

  it("falls back submittedByUrl to authorProfileUrl when submitter url is absent", () => {
    const entry = buildEntry(
      baseEntry({
        author: "Example",
        authorProfileUrl: "https://github.com/example",
        submittedBy: "example",
      }),
    );

    expect(entry.submittedByUrl).toBe("https://github.com/example");
  });

  it("does not fall back submittedByUrl to authorProfileUrl for split attribution", () => {
    const entry = buildEntry(
      baseEntry({
        author: "ABMeter",
        authorProfileUrl: "https://abmeter.ai",
        submittedBy: "kiannidev",
      }),
    );

    expect(entry.authorProfileUrl).toBe("https://abmeter.ai");
    expect(entry.submittedBy).toBe("kiannidev");
    expect(entry.submittedByUrl).toBeUndefined();
  });

  it("falls back submittedByUrl for authorless submitter entries with a profile URL", () => {
    const entry = buildEntry(
      baseEntry({
        author: undefined,
        authorProfileUrl: "https://github.com/example",
        submittedBy: "example",
      }),
    );

    expect(entry.author).toBe("example");
    expect(entry.submittedByUrl).toBe("https://github.com/example");
  });
});
