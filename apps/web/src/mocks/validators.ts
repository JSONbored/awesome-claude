export type Expertise =
  | "MCP"
  | "Hooks"
  | "Skills"
  | "Commands"
  | "Statuslines"
  | "Security"
  | "Privacy"
  | "Rules";

export interface ValidatorProfile {
  slug: string;
  handle: string;
  name: string;
  bio: string;
  expertise: Expertise[];
  verifiedCount: number;
  activeSince: string;
  github: string;
  recent: { ref: string; title: string; category: string; verifiedAt: string }[];
}

export const VALIDATORS: ValidatorProfile[] = [
  {
    slug: "jzombie",
    handle: "jzombie",
    name: "Jeremy Harris",
    bio: "Reads every hook line-by-line. Maintains the pre-edit-test baseline.",
    expertise: ["Hooks", "Security", "Commands"],
    verifiedCount: 84,
    activeSince: "2025-09",
    github: "https://github.com/jzombie",
    recent: [
      { ref: "hooks/pre-edit-test", title: "Run tests before edits", category: "hooks", verifiedAt: "2026-05-24" },
      { ref: "commands/refactor", title: "/refactor", category: "commands", verifiedAt: "2026-05-21" },
      { ref: "hooks/pre-commit-lint", title: "Pre-commit lint hook", category: "hooks", verifiedAt: "2026-05-18" },
    ],
  },
  {
    slug: "wong2",
    handle: "wong2",
    name: "Marvin Wong",
    bio: "MCP server author and reviewer. Focus on credential scoping and transport.",
    expertise: ["MCP", "Security", "Privacy"],
    verifiedCount: 61,
    activeSince: "2025-07",
    github: "https://github.com/wong2",
    recent: [
      { ref: "mcp/postgres-mcp", title: "Postgres MCP", category: "mcp", verifiedAt: "2026-05-26" },
      { ref: "mcp/notion-mcp", title: "Notion MCP", category: "mcp", verifiedAt: "2026-05-20" },
    ],
  },
  {
    slug: "designsystems",
    handle: "designsystems",
    name: "Nora Patel",
    bio: "Skills, tokens, and SKILL.md 1.1 schema. Bridge between writers and reviewers.",
    expertise: ["Skills", "Rules"],
    verifiedCount: 47,
    activeSince: "2025-10",
    github: "https://github.com/designsystems",
    recent: [
      { ref: "skills/scaffold-skill", title: "Scaffold a Skill", category: "skills", verifiedAt: "2026-05-25" },
      { ref: "rules/claude-md-baseline", title: "CLAUDE.md baseline", category: "rules", verifiedAt: "2026-05-20" },
    ],
  },
  {
    slug: "claude-workflows",
    handle: "claude-workflows",
    name: "Claude Workflows",
    bio: "Slash commands and statusline ergonomics. Tests on macOS, Linux, and WSL.",
    expertise: ["Commands", "Statuslines"],
    verifiedCount: 39,
    activeSince: "2025-11",
    github: "https://github.com/claude-workflows",
    recent: [
      { ref: "statuslines/git-battery", title: "Statusline: Git branch + battery", category: "statuslines", verifiedAt: "2026-05-24" },
    ],
  },
  {
    slug: "ops-guild",
    handle: "ops-guild",
    name: "Ops Guild",
    bio: "Agent reviews from an SRE lens — blast radius, idempotency, observability.",
    expertise: ["Security", "MCP"],
    verifiedCount: 22,
    activeSince: "2026-01",
    github: "https://github.com/ops-guild",
    recent: [
      { ref: "agents/sre-on-call", title: "SRE on-call", category: "agents", verifiedAt: "2026-05-21" },
    ],
  },
];

export const EXPERTISE_OPTIONS: Expertise[] = [
  "MCP",
  "Hooks",
  "Skills",
  "Commands",
  "Statuslines",
  "Rules",
  "Security",
  "Privacy",
];
