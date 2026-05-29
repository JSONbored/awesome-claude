import type { Platform, PlatformSupport } from "@/types/registry";

export const SUPPORTED_PLATFORMS: { id: Platform; label: string; tagline: string }[] = [
  { id: "claude-code", label: "Claude Code", tagline: "Native skills, hooks, commands, rules" },
  { id: "claude-desktop", label: "Claude Desktop", tagline: "MCP servers, projects, skills" },
  { id: "cursor", label: "Cursor", tagline: "Auto-generated .mdc adapters for every skill" },
  { id: "windsurf", label: "Windsurf", tagline: "Manual context + adapter rules" },
  { id: "codex", label: "Codex", tagline: "CLI + MCP support" },
  { id: "gemini", label: "Gemini", tagline: "Manual context import" },
];

export interface PlatformRowEntry {
  category: string;
  slug: string;
  title: string;
  support: PlatformSupport;
  installPath?: string;
  adapterPath?: string;
  verifiedAt?: string;
}

export const PLATFORM_MATRIX: Record<Platform, PlatformRowEntry[]> = {
  "claude-code": [
    { category: "skills", slug: "scaffold-skill", title: "Scaffold a Skill", support: "native-skill", installPath: ".claude/skills/scaffold", verifiedAt: "2026-05-20" },
    { category: "commands", slug: "review-pr", title: "/review-pr", support: "native-skill", installPath: ".claude/commands/review-pr.md", verifiedAt: "2026-05-22" },
    { category: "hooks", slug: "pre-edit-test", title: "Run tests before edits", support: "native-skill", installPath: ".claude/hooks/pre-edit-test", verifiedAt: "2026-05-21" },
  ],
  "claude-desktop": [
    { category: "mcp", slug: "postgres-mcp", title: "Postgres MCP", support: "native-skill", installPath: "claude_desktop_config.json", verifiedAt: "2026-05-24" },
    { category: "mcp", slug: "github-mcp", title: "GitHub MCP", support: "native-skill", verifiedAt: "2026-05-24" },
  ],
  cursor: [
    { category: "skills", slug: "scaffold-skill", title: "Scaffold a Skill", support: "adapter", adapterPath: "/data/skill-adapters/cursor/scaffold-skill.mdc", verifiedAt: "2026-05-25" },
    { category: "rules", slug: "claude-md-baseline", title: "CLAUDE.md baseline", support: "adapter", adapterPath: ".cursor/rules/baseline.mdc", verifiedAt: "2026-05-22" },
  ],
  windsurf: [
    { category: "rules", slug: "claude-md-baseline", title: "CLAUDE.md baseline", support: "manual-context", verifiedAt: "2026-05-10" },
  ],
  codex: [
    { category: "mcp", slug: "postgres-mcp", title: "Postgres MCP", support: "native-skill", verifiedAt: "2026-05-18" },
  ],
  gemini: [
    { category: "rules", slug: "claude-md-baseline", title: "CLAUDE.md baseline", support: "manual-context", verifiedAt: "2026-05-05" },
  ],
  vscode: [],
  raycast: [],
  cli: [],
  aider: [
    { category: "aider-recipes", slug: "aider-typescript-recipe", title: "Aider TypeScript recipe", support: "native-skill", verifiedAt: "2026-05-26" },
  ],
  zed: [
    { category: "zed-extensions", slug: "zed-claude-assist", title: "Zed Claude assist", support: "adapter", verifiedAt: "2026-05-26" },
  ],
  continue: [
    { category: "continue-configs", slug: "continue-claude-config", title: "Continue Claude config", support: "manual-context", verifiedAt: "2026-05-26" },
  ],
};
