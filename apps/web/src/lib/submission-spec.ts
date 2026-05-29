import type { Category } from "@/types/registry";

export type FieldKind = "text" | "textarea" | "url" | "code" | "tags" | "select";

export interface SpecField {
  key: string;
  label: string;
  help?: string;
  kind: FieldKind;
  required?: boolean;
  options?: string[];
  maxLen?: number;
  placeholder?: string;
}

export interface CategorySpec {
  category: Category;
  blurb: string;
  fields: SpecField[];
  riskBearing: boolean;
  exampleSafety?: string[];
  examplePrivacy?: string[];
}

const COMMON: SpecField[] = [
  { key: "title", label: "Title", kind: "text", required: true, maxLen: 80 },
  { key: "description", label: "One-line description", kind: "text", required: true, maxLen: 160 },
  { key: "author", label: "Author or organization", kind: "text", required: true },
  { key: "sourceUrl", label: "Source URL (GitHub)", kind: "url", required: true, placeholder: "https://github.com/…" },
  { key: "tags", label: "Tags", kind: "tags", help: "Comma-separated, up to 8" },
];

export const SUBMISSION_SPEC: Record<Category, CategorySpec> = {
  agents: {
    category: "agents",
    blurb: "Reusable Claude agents with a defined role, system prompt, and tool surface.",
    riskBearing: false,
    fields: [
      ...COMMON,
      { key: "full_copyable_content", label: "Full agent content", kind: "code", required: true, help: "Markdown or YAML the user will copy verbatim.", maxLen: 8000 },
    ],
  },
  rules: {
    category: "rules",
    blurb: "CLAUDE.md or AGENTS.md rule sets the model should follow.",
    riskBearing: false,
    fields: [
      ...COMMON,
      { key: "full_copyable_content", label: "Full rule content", kind: "code", required: true, maxLen: 8000 },
    ],
  },
  mcp: {
    category: "mcp",
    blurb: "MCP servers exposing tools, resources, or prompts.",
    riskBearing: true,
    fields: [
      ...COMMON,
      { key: "installCommand", label: "Install command", kind: "code", required: true, placeholder: "npx -y @org/mcp-server" },
      { key: "configSnippet", label: "Client config snippet (JSON)", kind: "code", required: true, maxLen: 2000 },
      { key: "credentials", label: "Required credentials or scopes", kind: "textarea", help: "Env vars, API keys, OAuth scopes." },
    ],
    exampleSafety: [
      "Executes shell commands; review before granting tool access.",
      "Writes to local filesystem outside the project root.",
    ],
    examplePrivacy: [
      "Sends queried data to a third-party API.",
      "Stores OAuth tokens in plain text under ~/.config.",
    ],
  },
  hooks: {
    category: "hooks",
    blurb: "Claude Code lifecycle hooks (PreToolUse, PostToolUse, Stop, …).",
    riskBearing: true,
    fields: [
      ...COMMON,
      { key: "trigger", label: "Trigger", kind: "select", required: true, options: ["PreToolUse", "PostToolUse", "Stop", "SubagentStop", "Notification"] },
      { key: "full_copyable_content", label: "Hook script", kind: "code", required: true, maxLen: 6000 },
    ],
    exampleSafety: ["Runs on every tool use; keep idempotent.", "Shells out to external binaries."],
    examplePrivacy: ["Logs tool inputs to local file."],
  },
  skills: {
    category: "skills",
    blurb: "Skill packages with a SKILL.md plus optional scripts and resources.",
    riskBearing: true,
    fields: [
      ...COMMON,
      { key: "skillType", label: "Skill type", kind: "select", required: true, options: ["procedural", "reference", "tool-wrapper", "domain"] },
      { key: "skillLevel", label: "Skill level", kind: "select", required: true, options: ["intro", "intermediate", "advanced"] },
      { key: "verificationStatus", label: "Verification status", kind: "select", required: true, options: ["author-tested", "community-tested", "unverified"] },
      { key: "retrievalSources", label: "Retrieval sources (optional)", kind: "tags" },
      { key: "testedPlatforms", label: "Tested platforms", kind: "tags", help: "claude-code, codex, cursor, windsurf, …" },
    ],
    exampleSafety: ["Bundled scripts execute on the user's machine."],
    examplePrivacy: ["Reads project files into context."],
  },
  commands: {
    category: "commands",
    blurb: "Slash commands for Claude Code.",
    riskBearing: true,
    fields: [
      ...COMMON,
      { key: "commandSyntax", label: "Command syntax", kind: "code", required: true, placeholder: "/refactor <path> [--dry-run]" },
      { key: "full_copyable_content", label: "Full command file", kind: "code", required: true, maxLen: 6000 },
    ],
    exampleSafety: ["Modifies files in the working tree."],
    examplePrivacy: ["Sends file contents to the model."],
  },
  statuslines: {
    category: "statuslines",
    blurb: "Custom statusline scripts.",
    riskBearing: true,
    fields: [
      ...COMMON,
      { key: "scriptLanguage", label: "Script language", kind: "select", required: true, options: ["bash", "zsh", "python", "node", "deno"] },
      { key: "full_copyable_content", label: "Script", kind: "code", required: true, maxLen: 4000 },
    ],
    exampleSafety: ["Runs on every prompt render — keep fast and side-effect free."],
  },
  guides: {
    category: "guides",
    blurb: "Long-form guides and tutorials.",
    riskBearing: false,
    fields: [
      ...COMMON,
      { key: "guide_content", label: "Guide content (Markdown)", kind: "code", required: true, maxLen: 30_000 },
    ],
  },
  collections: {
    category: "collections",
    blurb: "Curated collections of other registry entries.",
    riskBearing: false,
    fields: [
      ...COMMON,
      { key: "items", label: "Items (one slug per line)", kind: "textarea", required: true, placeholder: "agents/code-reviewer\nmcp/postgres-mcp" },
    ],
  },
  tools: {
    category: "tools",
    blurb: "Commercial or hosted tools. These go through the commercial intake.",
    riskBearing: false,
    fields: [...COMMON],
  },
  plugins: {
    category: "plugins",
    blurb: "Cross-harness plugin bundles (Claude Code, Codex, Gemini, Cursor, Zed). A plugin packages MCP servers, skills, commands, and hooks together.",
    riskBearing: true,
    fields: [
      ...COMMON,
      { key: "harness", label: "Harness compatibility", kind: "tags", required: true, help: "claude-code, codex, gemini, cursor, …" },
      { key: "bundleContents", label: "What the bundle contains", kind: "tags", required: true, help: "mcp, skill, command, hook, agent, rule" },
      { key: "installCommand", label: "Install command", kind: "code", required: true },
      { key: "configSnippet", label: "Marketplace manifest or config (JSON)", kind: "code", required: true, maxLen: 4000 },
    ],
    exampleSafety: ["Bundle installs MCP servers — review each server's safety notes."],
    examplePrivacy: ["Forwards prompts and tool outputs to bundled MCP servers."],
  },
  automations: {
    category: "automations",
    blurb: "Scheduled or event-triggered agent workflows that run without a human in the loop.",
    riskBearing: true,
    fields: [
      ...COMMON,
      { key: "harness", label: "Harness compatibility", kind: "tags", required: true },
      { key: "triggerKind", label: "Trigger kind", kind: "select", required: true, options: ["scheduled", "event", "manual"] },
      { key: "schedule", label: "Cadence or trigger description", kind: "text", required: true, placeholder: "daily 09:00 UTC, on PR open" },
      { key: "full_copyable_content", label: "Automation definition", kind: "code", required: true, maxLen: 6000 },
    ],
    exampleSafety: ["Runs unattended — confirm the agent cannot take destructive actions.", "Bound the cost and rate-limit retries."],
    examplePrivacy: ["May send repository or inbox content to the model on every run."],
  },
  "codex-plugins": {
    category: "codex-plugins",
    blurb: "Plugins that extend OpenAI's Codex CLI/agent.",
    riskBearing: true,
    fields: [
      ...COMMON,
      { key: "full_copyable_content", label: "Plugin manifest", kind: "code", required: true, maxLen: 4000 },
    ],
  },
  "codex-automations": {
    category: "codex-automations",
    blurb: "Scheduled or event-triggered Codex automations.",
    riskBearing: true,
    fields: [
      ...COMMON,
      { key: "full_copyable_content", label: "Automation definition", kind: "code", required: true, maxLen: 4000 },
    ],
  },
  "harness-configs": {
    category: "harness-configs",
    blurb: "Reusable agent harness/runtime configurations.",
    riskBearing: true,
    fields: [
      ...COMMON,
      { key: "full_copyable_content", label: "Harness config", kind: "code", required: true, maxLen: 8000 },
    ],
  },
  "aider-recipes": {
    category: "aider-recipes",
    blurb: "Aider playbooks, conventions, and configs.",
    riskBearing: false,
    fields: [
      ...COMMON,
      { key: "full_copyable_content", label: "Recipe (markdown or YAML)", kind: "code", required: true, maxLen: 6000 },
    ],
  },
  "continue-configs": {
    category: "continue-configs",
    blurb: "Continue.dev model and rule configurations.",
    riskBearing: false,
    fields: [
      ...COMMON,
      { key: "full_copyable_content", label: "Continue config.json", kind: "code", required: true, maxLen: 6000 },
    ],
  },
  "zed-extensions": {
    category: "zed-extensions",
    blurb: "Extensions for Zed's agent panel and assistant.",
    riskBearing: false,
    fields: [
      ...COMMON,
      { key: "full_copyable_content", label: "Extension manifest", kind: "code", required: true, maxLen: 4000 },
    ],
  },
};

export interface PreflightIssue {
  kind: "blocker" | "warning" | "info";
  message: string;
}

export function preflight(category: Category | "", data: Record<string, string>): PreflightIssue[] {
  const issues: PreflightIssue[] = [];
  if (!category) {
    issues.push({ kind: "blocker", message: "Pick a category." });
    return issues;
  }
  const spec = SUBMISSION_SPEC[category];
  for (const f of spec.fields) {
    if (f.required && !data[f.key]?.trim()) {
      issues.push({ kind: "blocker", message: `Missing required field: ${f.label}` });
    }
  }
  if (data.sourceUrl && !/^https?:\/\//.test(data.sourceUrl)) {
    issues.push({ kind: "blocker", message: "Source URL must be a full https:// URL." });
  }
  if (data.sourceUrl && !/github\.com|gitlab\.com|bitbucket\.org/.test(data.sourceUrl)) {
    issues.push({ kind: "warning", message: "Source URL is not on a known Git host. Reviewers may ask for provenance." });
  }
  if (spec.riskBearing) {
    if (!data.safetyNotes?.trim()) {
      issues.push({ kind: "blocker", message: "Safety notes are required for this category." });
    }
    if (!data.privacyNotes?.trim() && category !== "statuslines") {
      issues.push({ kind: "warning", message: "Privacy notes are strongly recommended." });
    }
  }
  // Fuzzy dup mock
  if (data.title && /claude code/i.test(data.title)) {
    issues.push({ kind: "info", message: "A similar title exists in the registry. Reviewers will check for duplicates." });
  }
  return issues;
}

export function buildIssueDraft(category: Category | "", data: Record<string, string>): string {
  const lines = [
    `### Submission: ${data.title || "(untitled)"}`,
    "",
    `- **Category**: ${category || "(none)"}`,
    `- **Author**: ${data.author || ""}`,
    `- **Source**: ${data.sourceUrl || ""}`,
    "",
    "#### Description",
    data.description || "",
  ];
  if (data.safetyNotes) {
    lines.push("", "#### Safety notes", data.safetyNotes);
  }
  if (data.privacyNotes) {
    lines.push("", "#### Privacy notes", data.privacyNotes);
  }
  return lines.join("\n");
}
