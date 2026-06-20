import { describe, expect, it } from "vitest";

// Deep-relative test imports use the `.js` specifier across this repo's suite;
// the bundler maps it to the TypeScript source.
import { buildClaudeMcpInstallPlan } from "../integrations/raycast/src/mcp-installer.js";
import type {
  RaycastEntry,
  RaycastDetail,
} from "../integrations/raycast/src/feed.js";

const stdioConfig = JSON.stringify({
  mcpServers: { srv: { command: "npx", args: ["-y", "p"] } },
});

const mcpEntry = {
  category: "mcp",
  slug: "srv",
  title: "Server",
  description: "D",
  tags: [],
  installable: true,
  hasInstallCommand: false,
  hasConfigSnippet: true,
  installCommand: "",
  configSnippet: stdioConfig,
  copyText: "",
  detailMarkdown: "",
  webUrl: "https://w.example",
  repoUrl: "",
  documentationUrl: "",
  downloadTrust: "external",
  verificationStatus: "validated",
} as RaycastEntry;

const detail = {
  detailMarkdown: "md",
  configSnippet: stdioConfig,
} as RaycastDetail;

describe("buildClaudeMcpInstallPlan", () => {
  it("produces a Claude Code install plan for an MCP entry", () => {
    const plan = buildClaudeMcpInstallPlan(mcpEntry, detail);
    expect(plan.target).toBe("claude-code");
    expect(plan.targetLabel).toBe("Claude Code");
    expect(plan.installKind).toBe("cli");
  });

  it("rejects non-MCP entries (the harness install is MCP-only)", () => {
    expect(() =>
      buildClaudeMcpInstallPlan(
        { ...mcpEntry, category: "agents" } as RaycastEntry,
        detail,
      ),
    ).toThrow("MCP entries");
  });
});
