import { describe, expect, it } from "vitest";

// Deep-relative test imports use the `.js` specifier across this repo's suite;
// the bundler maps it to the TypeScript source.
import { buildMcpInstallPlan } from "../integrations/raycast/src/mcp-installer.js";
import type {
  RaycastEntry,
  RaycastDetail,
} from "../integrations/raycast/src/feed.js";

const stdioConfig = JSON.stringify({
  mcpServers: { "my-server": { command: "npx", args: ["-y", "my-mcp"] } },
});

function mcpEntry(overrides: Partial<RaycastEntry> = {}): RaycastEntry {
  return {
    category: "mcp",
    slug: "my-server",
    title: "My Server",
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
    ...overrides,
  } as RaycastEntry;
}

function detailFor(
  configSnippet: string,
  overrides: Partial<RaycastDetail> = {},
): RaycastDetail {
  return {
    detailMarkdown: "md",
    configSnippet,
    ...overrides,
  } as RaycastDetail;
}

describe("buildMcpInstallPlan", () => {
  it("builds a CLI install plan for Claude Code from a stdio config", () => {
    const plan = buildMcpInstallPlan(
      "claude-code",
      mcpEntry(),
      detailFor(stdioConfig),
    );
    expect(plan.target).toBe("claude-code");
    expect(plan.targetLabel).toBe("Claude Code");
    expect(plan.installKind).toBe("cli");
    expect(plan.name).toBe("my-server");
  });

  it("surfaces the entry's safety notes as plan warnings", () => {
    const plan = buildMcpInstallPlan(
      "claude-code",
      mcpEntry(),
      detailFor(stdioConfig, { safetyNotes: ["Be careful"] }),
    );
    expect(plan.warnings).toContain("Be careful");
  });

  it("warns about and reports environment placeholders in the config", () => {
    const envConfig = JSON.stringify({
      mcpServers: {
        srv: {
          command: "npx",
          args: ["-y", "p"],
          env: { TOKEN: "${MY_TOKEN}" },
        },
      },
    });
    const plan = buildMcpInstallPlan(
      "claude-code",
      mcpEntry({ slug: "srv", configSnippet: envConfig }),
      detailFor(envConfig),
    );
    expect(plan.envPlaceholders).toContain("${MY_TOKEN}");
    expect(plan.warnings.join("\n")).toContain("environment placeholders");
  });

  it("rejects non-MCP entries", () => {
    expect(() =>
      buildMcpInstallPlan(
        "claude-code",
        mcpEntry({ category: "agents" }),
        detailFor(stdioConfig),
      ),
    ).toThrow("MCP entries");
  });

  it("rejects a target the config does not advertise", () => {
    expect(() =>
      buildMcpInstallPlan(
        "codex",
        mcpEntry({ mcpInstallTargets: ["cursor"] }),
        detailFor(stdioConfig, { mcpInstallTargets: ["cursor"] }),
      ),
    ).toThrow("not available");
  });
});
