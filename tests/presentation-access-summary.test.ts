import { describe, expect, it } from "vitest";

import { getEntryAccessSummary } from "@heyclaude/registry";

describe("getEntryAccessSummary", () => {
  it("summarizes a fully specified MCP entry", () => {
    const summary = getEntryAccessSummary({
      category: "mcp",
      installCommand: "claude mcp add demo -- npx -y demo-mcp",
      configSnippet: '{ "demo": { "command": "npx" } }',
      documentationUrl: "https://www.npmjs.com/package/demo-mcp",
      repoUrl: "https://github.com/demo/demo-mcp",
      safetyNotes: ["Makes outbound network requests."],
      privacyNotes: ["Sends queries to a third-party service."],
      prerequisites: ["Node.js 18+ and npx available."],
    });

    expect(summary).toEqual({
      hasInstall: true,
      hasConfig: true,
      hasDownload: false,
      hasDocs: true,
      hasSource: true,
      hasSafetyNotes: true,
      hasPrivacyNotes: true,
      hasPrerequisites: true,
      copyOnly: false,
    });
  });

  it("marks copy-only assets when there is no install, config, or download", () => {
    const summary = getEntryAccessSummary({
      category: "agents",
      copySnippet: "You are a helpful reviewer...",
    });

    expect(summary.hasInstall).toBe(false);
    expect(summary.hasConfig).toBe(false);
    expect(summary.hasDownload).toBe(false);
    expect(summary.copyOnly).toBe(true);
  });

  it("treats a downloadable package as not copy-only", () => {
    const summary = getEntryAccessSummary({
      category: "skills",
      downloadUrl: "/downloads/skills/demo.zip",
    });

    expect(summary.hasDownload).toBe(true);
    expect(summary.copyOnly).toBe(false);
  });

  it("counts commandSyntax as an install path", () => {
    const summary = getEntryAccessSummary({
      category: "commands",
      commandSyntax: "/demo run",
    });

    expect(summary.hasInstall).toBe(true);
    expect(summary.copyOnly).toBe(false);
  });

  it("detects a source link from githubUrl", () => {
    const summary = getEntryAccessSummary({
      category: "tools",
      githubUrl: "https://github.com/demo/tool",
    });

    expect(summary.hasSource).toBe(true);
  });

  it("ignores empty note and prerequisite arrays", () => {
    const summary = getEntryAccessSummary({
      category: "hooks",
      safetyNotes: [],
      privacyNotes: [],
      prerequisites: [],
    });

    expect(summary.hasSafetyNotes).toBe(false);
    expect(summary.hasPrivacyNotes).toBe(false);
    expect(summary.hasPrerequisites).toBe(false);
  });

  it("returns an all-false, copy-only summary for an empty entry", () => {
    expect(getEntryAccessSummary({})).toEqual({
      hasInstall: false,
      hasConfig: false,
      hasDownload: false,
      hasDocs: false,
      hasSource: false,
      hasSafetyNotes: false,
      hasPrivacyNotes: false,
      hasPrerequisites: false,
      copyOnly: true,
    });
  });

  it("does not throw when called with no argument", () => {
    expect(() => getEntryAccessSummary(undefined as never)).not.toThrow();
    expect(getEntryAccessSummary(undefined as never).copyOnly).toBe(true);
  });
});
