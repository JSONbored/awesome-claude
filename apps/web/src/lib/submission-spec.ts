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
  webOnly?: boolean;
  exampleSafety?: string[];
  examplePrivacy?: string[];
}

const COMMON: SpecField[] = [
  { key: "name", label: "Name", kind: "text", required: true, maxLen: 120 },
  {
    key: "slug",
    label: "Slug",
    kind: "text",
    required: true,
    maxLen: 120,
    placeholder: "kebab-case-name",
    help: "Kebab-case only. Maintainers may adjust before import.",
  },
  {
    key: "description",
    label: "Description",
    kind: "textarea",
    required: true,
    maxLen: 1000,
    placeholder: "What it does, when to use it, and what makes it useful.",
  },
  {
    key: "card_description",
    label: "Card description",
    kind: "text",
    required: true,
    maxLen: 180,
    placeholder: "Short browse-card preview text.",
  },
  { key: "author", label: "Author or organization", kind: "text", maxLen: 120 },
  {
    key: "github_url",
    label: "GitHub URL",
    kind: "url",
    placeholder: "https://github.com/owner/repo",
  },
  {
    key: "docs_url",
    label: "Docs URL",
    kind: "url",
    placeholder: "https://example.com/docs",
  },
  {
    key: "contact_email",
    label: "Public contact",
    kind: "text",
    maxLen: 120,
    placeholder: "@github-handle or public email",
    help: "This may be copied into a public GitHub PR. Do not enter private contact details.",
  },
  { key: "tags", label: "Tags", kind: "tags", help: "Comma-separated, up to 8." },
];

const SAFETY_EXAMPLES = [
  "Runs local commands; review before installing.",
  "May write files or call third-party APIs depending on configuration.",
];

const PRIVACY_EXAMPLES = [
  "May send prompts, files, logs, or credentials to a third-party service.",
  "Stores local config under the user's home directory.",
];

const COPY_FIELD: SpecField = {
  key: "full_copyable_content",
  label: "Full copyable content",
  kind: "code",
  required: true,
  maxLen: 30_000,
  help: "Paste the complete usable prompt, config, script, rule, or asset.",
};

export const SUBMISSION_SPEC: Record<Category, CategorySpec> = {
  agents: {
    category: "agents",
    blurb: "Reusable Claude agents with a defined role, system prompt, and tool surface.",
    riskBearing: false,
    fields: [...COMMON, COPY_FIELD],
  },
  rules: {
    category: "rules",
    blurb: "CLAUDE.md, AGENTS.md, or editor rule sets the model should follow.",
    riskBearing: false,
    fields: [...COMMON, COPY_FIELD],
  },
  mcp: {
    category: "mcp",
    blurb: "MCP servers exposing tools, resources, or prompts.",
    riskBearing: true,
    fields: [
      ...COMMON,
      {
        key: "install_command",
        label: "Install command",
        kind: "code",
        required: true,
        placeholder: "npx -y @org/mcp-server",
      },
      {
        key: "usage_snippet",
        label: "Usage snippet",
        kind: "textarea",
        required: true,
        placeholder: "Show how someone actually uses or configures this server.",
      },
      {
        key: "config_snippet",
        label: "Client config snippet",
        kind: "code",
        maxLen: 4000,
      },
    ],
    exampleSafety: SAFETY_EXAMPLES,
    examplePrivacy: PRIVACY_EXAMPLES,
  },
  skills: {
    category: "skills",
    blurb: "Skill packages with a SKILL.md plus optional scripts and resources.",
    riskBearing: true,
    fields: [
      ...COMMON,
      {
        key: "usage_snippet",
        label: "Usage snippet",
        kind: "textarea",
        required: true,
      },
      {
        key: "skill_type",
        label: "Skill type",
        kind: "select",
        required: true,
        options: ["general", "capability-pack"],
      },
      {
        key: "skill_level",
        label: "Skill level",
        kind: "select",
        required: true,
        options: ["foundational", "advanced", "expert"],
      },
      {
        key: "verification_status",
        label: "Verification status",
        kind: "select",
        required: true,
        options: ["draft", "validated", "production"],
      },
      {
        key: "install_command",
        label: "Install command",
        kind: "code",
        placeholder: "Optional install command if this is package-backed.",
      },
      {
        key: "download_url",
        label: "Download/package URL",
        kind: "url",
        help: "Only use for a real package, archive, or release download. GitHub tree/blob paths belong in source or retrieval sources.",
      },
      COPY_FIELD,
      {
        key: "retrieval_sources",
        label: "Retrieval sources",
        kind: "textarea",
        placeholder: "Official docs or source URLs used for verification.",
      },
      {
        key: "tested_platforms",
        label: "Tested platforms",
        kind: "tags",
        placeholder: "Claude, Codex, Cursor, Windsurf",
      },
    ],
    exampleSafety: SAFETY_EXAMPLES,
    examplePrivacy: PRIVACY_EXAMPLES,
  },
  hooks: {
    category: "hooks",
    blurb: "Claude Code lifecycle hooks.",
    riskBearing: true,
    fields: [
      ...COMMON,
      {
        key: "trigger",
        label: "Trigger",
        kind: "select",
        required: true,
        options: [
          "PreToolUse",
          "PostToolUse",
          "UserPromptSubmit",
          "Notification",
          "Stop",
          "SubagentStop",
          "SessionStart",
        ],
      },
      {
        key: "usage_snippet",
        label: "Usage snippet",
        kind: "textarea",
        required: true,
      },
      COPY_FIELD,
      { key: "config_snippet", label: "Config snippet", kind: "code", maxLen: 4000 },
    ],
    exampleSafety: SAFETY_EXAMPLES,
    examplePrivacy: PRIVACY_EXAMPLES,
  },
  commands: {
    category: "commands",
    blurb: "Slash commands for Claude Code or adjacent agent harnesses.",
    riskBearing: true,
    fields: [
      ...COMMON,
      {
        key: "command_syntax",
        label: "Command syntax",
        kind: "code",
        required: true,
        placeholder: "/refactor <path> [--dry-run]",
      },
      {
        key: "usage_snippet",
        label: "Usage snippet",
        kind: "textarea",
        required: true,
      },
      COPY_FIELD,
    ],
    exampleSafety: SAFETY_EXAMPLES,
    examplePrivacy: PRIVACY_EXAMPLES,
  },
  statuslines: {
    category: "statuslines",
    blurb: "Custom statusline scripts.",
    riskBearing: true,
    fields: [
      ...COMMON,
      {
        key: "script_language",
        label: "Script language",
        kind: "select",
        required: true,
        options: ["bash", "zsh", "fish", "python", "javascript", "other"],
      },
      COPY_FIELD,
      { key: "config_snippet", label: "Config snippet", kind: "code", maxLen: 4000 },
    ],
    exampleSafety: SAFETY_EXAMPLES,
    examplePrivacy: PRIVACY_EXAMPLES,
  },
  guides: {
    category: "guides",
    blurb: "Long-form guides and tutorials.",
    riskBearing: false,
    fields: [
      ...COMMON,
      {
        key: "guide_content",
        label: "Guide content",
        kind: "code",
        required: true,
        maxLen: 30_000,
      },
    ],
  },
  collections: {
    category: "collections",
    blurb: "Curated collections of registry entries.",
    riskBearing: false,
    fields: [
      ...COMMON,
      {
        key: "items",
        label: "Items",
        kind: "textarea",
        required: true,
        placeholder: "agents/code-reviewer\nmcp/postgres-mcp",
      },
    ],
  },
  tools: {
    category: "tools",
    blurb: "Commercial or hosted tools route through the lead intake, not free content import.",
    riskBearing: false,
    webOnly: true,
    fields: [...COMMON],
  },
  plugins: {
    category: "plugins",
    blurb:
      "Cross-harness plugin bundles. This category is not yet enabled for website PR submission.",
    riskBearing: true,
    webOnly: true,
    fields: [...COMMON],
  },
  automations: {
    category: "automations",
    blurb:
      "Scheduled or event-triggered agent workflows. This category is not yet enabled for website PR submission.",
    riskBearing: true,
    webOnly: true,
    fields: [...COMMON],
  },
  "codex-plugins": {
    category: "codex-plugins",
    blurb: "Legacy harness-prefixed category. Submit through GitHub if needed.",
    riskBearing: true,
    webOnly: true,
    fields: [...COMMON],
  },
  "codex-automations": {
    category: "codex-automations",
    blurb: "Legacy harness-prefixed category. Submit through GitHub if needed.",
    riskBearing: true,
    webOnly: true,
    fields: [...COMMON],
  },
  "harness-configs": {
    category: "harness-configs",
    blurb: "Legacy harness config category. Submit through GitHub if needed.",
    riskBearing: true,
    webOnly: true,
    fields: [...COMMON],
  },
  "aider-recipes": {
    category: "aider-recipes",
    blurb: "Legacy Aider recipe category. Submit through GitHub if needed.",
    riskBearing: false,
    webOnly: true,
    fields: [...COMMON],
  },
  "continue-configs": {
    category: "continue-configs",
    blurb: "Legacy Continue config category. Submit through GitHub if needed.",
    riskBearing: false,
    webOnly: true,
    fields: [...COMMON],
  },
  "zed-extensions": {
    category: "zed-extensions",
    blurb: "Legacy Zed extension category. Submit through GitHub if needed.",
    riskBearing: false,
    webOnly: true,
    fields: [...COMMON],
  },
};

export interface PreflightIssue {
  kind: "blocker" | "warning" | "info";
  message: string;
}

export function slugify(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/['"]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function httpsUrl(value: string) {
  if (!value.trim()) return true;
  return value.trim().toLowerCase().startsWith("https://");
}

export function preflight(category: Category | "", data: Record<string, string>): PreflightIssue[] {
  const issues: PreflightIssue[] = [];
  if (!category) {
    issues.push({ kind: "blocker", message: "Pick a category." });
    return issues;
  }
  const spec = SUBMISSION_SPEC[category];
  if (spec.webOnly) {
    issues.push({
      kind: "warning",
      message: "This category needs maintainer routing before website import is enabled.",
    });
  }
  for (const f of spec.fields) {
    if (f.required && !data[f.key]?.trim()) {
      issues.push({ kind: "blocker", message: `Missing required field: ${f.label}` });
    }
  }
  if (data.slug && slugify(data.slug) !== data.slug.trim()) {
    issues.push({ kind: "blocker", message: "Slug must be lowercase kebab-case." });
  }
  for (const field of ["github_url", "docs_url", "download_url"]) {
    if (!httpsUrl(data[field] || "")) {
      issues.push({ kind: "blocker", message: `${field.replaceAll("_", " ")} must be HTTPS.` });
    }
  }
  if (!data.github_url?.trim() && !data.docs_url?.trim()) {
    issues.push({ kind: "blocker", message: "Add at least one source or docs URL." });
  }
  if (spec.riskBearing) {
    if (!data.safety_notes?.trim()) {
      issues.push({ kind: "blocker", message: "Safety notes are required for this category." });
    }
    if (!data.privacy_notes?.trim()) {
      issues.push({ kind: "blocker", message: "Privacy notes are required for this category." });
    }
  }
  return issues;
}

export function buildSubmissionPacket(
  category: Category | "",
  data: Record<string, string>,
): string {
  const spec = category ? SUBMISSION_SPEC[category] : null;
  const fields = spec?.fields ?? COMMON;
  return fields
    .filter((field) => data[field.key]?.trim() || field.key === "category")
    .flatMap((field) => [
      `### ${field.label}`,
      "",
      field.key === "category" ? category || "" : data[field.key] || "",
      "",
    ])
    .join("\n")
    .trimEnd();
}
