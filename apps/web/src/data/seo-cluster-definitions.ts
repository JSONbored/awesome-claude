export type SeoClusterDefinition = {
  slug: string;
  title: string;
  eyebrow: string;
  description: string;
  seoTitle: string;
  seoDescription: string;
  categories: string[];
  tags?: string[];
  keywords?: string[];
  requireSource?: boolean;
  requireInstallTrust?: boolean;
  itemLimit: number;
};

export type SeoClusterItem = {
  title: string;
  description: string;
  category: string;
  slug: string;
  url: string;
  tags: string[];
  disclosure?: string;
};

export type SeoCluster = SeoClusterDefinition & {
  items: SeoClusterItem[];
};

export const seoClusterDefinitions: SeoClusterDefinition[] = [
  {
    slug: "claude-code-hooks",
    title: "Best Claude Code hooks for safer agent workflows",
    eyebrow: "Claude Code hooks",
    description:
      "Reviewed hooks for testing, security, repository hygiene, and repeatable Claude Code automation.",
    seoTitle: "Best Claude Code hooks for safer agent workflows",
    seoDescription:
      "Find Claude Code hooks for testing, security checks, repository hygiene, and repeatable agent workflows.",
    categories: ["hooks"],
    tags: ["security", "testing", "git", "automation"],
    itemLimit: 12,
  },
  {
    slug: "mcp-servers",
    title: "MCP servers for developer workflows",
    eyebrow: "MCP servers",
    description:
      "Useful MCP servers for files, browsers, APIs, repositories, databases, and developer automation.",
    seoTitle: "MCP servers for Claude developer workflows",
    seoDescription:
      "Browse MCP servers for Claude developer workflows, including files, browsers, APIs, repositories, databases, and automation tools.",
    categories: ["mcp"],
    tags: ["development", "automation", "browser", "database"],
    itemLimit: 16,
  },
  {
    slug: "claude-skills",
    title: "Claude skills for production teams",
    eyebrow: "Claude skills",
    description:
      "Claude skills for repeatable engineering, documentation, design, data, and operational workflows.",
    seoTitle: "Claude skills for production teams",
    seoDescription:
      "Find Claude skills for repeatable engineering, documentation, design, data, and operations workflows.",
    categories: ["skills"],
    tags: ["development", "documentation", "data", "design"],
    itemLimit: 16,
  },
  {
    slug: "security-reviewed-mcp-servers",
    title: "Security-reviewed MCP servers and agent tools",
    eyebrow: "Security",
    description:
      "MCP and agent resources that deserve extra scrutiny for credentials, file access, network access, and operational trust.",
    seoTitle: "Security-reviewed MCP servers and agent tools",
    seoDescription:
      "Review MCP servers and agent tools through a security lens covering credentials, file access, network access, and trust.",
    categories: ["mcp", "hooks", "rules", "tools"],
    tags: ["security", "audit", "guardrails", "red-teaming"],
    itemLimit: 16,
  },
  {
    slug: "agent-workflow-starter-kits",
    title: "Agent workflow starter kits",
    eyebrow: "Starter kits",
    description:
      "A practical starting set for agent workflows: agents, commands, hooks, skills, and supporting tools.",
    seoTitle: "Agent workflow starter kits for Claude teams",
    seoDescription:
      "Build agent workflow starter kits with Claude agents, commands, hooks, skills, and supporting tools.",
    categories: ["agents", "commands", "hooks", "skills", "tools"],
    tags: ["workflow", "automation", "agent-framework", "ai-coding"],
    itemLimit: 18,
  },
  {
    slug: "claude-native-tools",
    title: "Tools for Claude-native teams",
    eyebrow: "Claude tools",
    description:
      "Coding, observability, automation, browser, security, and agent infrastructure tools for Claude-native teams.",
    seoTitle: "Tools for Claude-native teams",
    seoDescription:
      "Browse coding, observability, automation, browser, security, and agent infrastructure tools for Claude-native teams.",
    categories: ["tools"],
    tags: ["ai-coding", "observability", "workflow-automation", "agent-framework"],
    itemLimit: 24,
  },
  {
    slug: "source-backed-agent-workflows",
    title: "Source-backed agent workflow resources",
    eyebrow: "Source-backed",
    description:
      "Agent resources with source metadata that makes review, attribution, and reuse easier before a team adopts them.",
    seoTitle: "Source-backed agent workflow resources",
    seoDescription:
      "Browse source-backed Claude resources for teams that need reviewable agents, MCP servers, skills, hooks, rules, commands, and workflow templates.",
    categories: ["agents", "mcp", "skills", "hooks", "rules", "commands"],
    tags: ["workflow", "automation", "development", "ai-coding"],
    requireSource: true,
    itemLimit: 20,
  },
  {
    slug: "safe-install-agent-skills",
    title: "Safer install paths for Agent Skills",
    eyebrow: "Install trust",
    description:
      "Agent Skills and related resources with package, source, or copyable install metadata that can be reviewed before use.",
    seoTitle: "Safer install paths for Agent Skills",
    seoDescription:
      "Find Agent Skills with safer install signals, source-backed metadata, package verification context, checksums, and copyable setup guidance.",
    categories: ["skills", "rules", "commands", "hooks"],
    tags: ["skills", "security", "workflow", "automation"],
    requireInstallTrust: true,
    itemLimit: 20,
  },
  {
    slug: "privacy-aware-agent-tools",
    title: "Privacy-aware agent tools and configs",
    eyebrow: "Privacy",
    description:
      "Resources that help teams review local files, credentials, logs, telemetry, and third-party access before adopting agent workflows.",
    seoTitle: "Privacy-aware agent tools and configs",
    seoDescription:
      "Review Claude tools, MCP servers, hooks, skills, and rules through a privacy lens covering credentials, local files, logs, and third-party access.",
    categories: ["mcp", "hooks", "skills", "rules", "tools"],
    tags: ["privacy", "security", "audit", "guardrails"],
    itemLimit: 18,
  },
  {
    slug: "team-review-automation",
    title: "Team review automation for agent workflows",
    eyebrow: "Review automation",
    description:
      "Claude resources for teams adding repeatable checks, code review flows, repository hygiene, and operational guardrails.",
    seoTitle: "Team review automation for agent workflows",
    seoDescription:
      "Discover Claude hooks, commands, skills, MCP servers, and tools for repeatable team reviews, repository hygiene, testing, and automation guardrails.",
    categories: ["hooks", "commands", "skills", "mcp", "tools"],
    tags: ["review", "testing", "git", "automation", "quality-gate"],
    itemLimit: 18,
  },
  {
    slug: "mcp-servers-for-code-review",
    title: "MCP servers for code review workflows",
    eyebrow: "Code review MCP",
    description:
      "MCP servers and adjacent agent tools for repository review, pull request triage, quality checks, and source-backed engineering review.",
    seoTitle: "MCP servers for code review workflows",
    seoDescription:
      "Compare MCP servers for code review, pull request triage, source analysis, quality checks, and Claude developer workflow automation.",
    categories: ["mcp"],
    tags: ["review", "code-review", "testing", "security", "quality"],
    keywords: ["pull request", "repository", "code review"],
    itemLimit: 16,
  },
  {
    slug: "mcp-servers-for-browser-automation",
    title: "MCP servers for browser automation",
    eyebrow: "Browser MCP",
    description:
      "MCP servers and tools for browser control, screenshots, crawling, testing, scraping, and web workflow automation with Claude.",
    seoTitle: "MCP servers for browser automation",
    seoDescription:
      "Find MCP servers for browser automation, screenshots, web testing, crawling, scraping, and Claude-controlled web workflows.",
    categories: ["mcp"],
    tags: ["browser", "automation", "testing", "playwright", "web"],
    keywords: ["screenshot", "crawl", "scrape"],
    itemLimit: 16,
  },
  {
    slug: "mcp-servers-for-databases",
    title: "MCP servers for databases and data workflows",
    eyebrow: "Database MCP",
    description:
      "Database, SQL, analytics, and data workflow MCP servers that help Claude inspect, query, transform, or document structured data.",
    seoTitle: "MCP servers for databases and data workflows",
    seoDescription:
      "Browse MCP servers for databases, SQL, analytics, structured data inspection, and Claude-assisted data workflow automation.",
    categories: ["mcp"],
    tags: ["database", "sql", "postgres", "data", "analytics"],
    keywords: ["sqlite", "mysql", "warehouse"],
    itemLimit: 16,
  },
  {
    slug: "claude-code-testing-automation",
    title: "Claude Code testing automation",
    eyebrow: "Testing automation",
    description:
      "Commands, hooks, and skills for generating tests, running checks, enforcing TDD loops, and keeping Claude Code changes verifiable.",
    seoTitle: "Claude Code testing automation",
    seoDescription:
      "Discover Claude Code testing commands, hooks, skills, TDD workflows, and quality checks for safer AI-assisted engineering.",
    categories: ["commands", "hooks", "skills"],
    tags: ["testing", "tdd", "automation", "quality", "workflow"],
    keywords: ["test", "vitest", "unit tests"],
    itemLimit: 18,
  },
  {
    slug: "claude-code-security-workflows",
    title: "Claude Code security workflows",
    eyebrow: "Security workflows",
    description:
      "Security commands, hooks, rules, MCP servers, and skills for auditing code, checking risky changes, and tightening agent behavior.",
    seoTitle: "Claude Code security workflows",
    seoDescription:
      "Find Claude Code security workflows for code audits, risky-change checks, repository guardrails, and agent safety review.",
    categories: ["commands", "hooks", "skills", "rules", "mcp"],
    tags: ["security", "audit", "compliance", "guardrails", "review"],
    keywords: ["vulnerability", "secret", "risk"],
    itemLimit: 18,
  },
  {
    slug: "codex-agent-skills",
    title: "Codex and agent skills for repeatable work",
    eyebrow: "Codex skills",
    description:
      "Skills, commands, and rules that map well to Codex-style repeatable agent workflows across engineering, docs, deployment, and review.",
    seoTitle: "Codex skills and agent workflow resources",
    seoDescription:
      "Browse Codex-compatible skills, commands, and rules for repeatable agent workflows across engineering, documentation, deployment, and review.",
    categories: ["skills", "commands", "rules"],
    tags: ["codex", "workflow", "automation", "openai", "development"],
    keywords: ["agent skill", "deployment", "review"],
    itemLimit: 18,
  },
  {
    slug: "claude-skills-for-design",
    title: "Claude skills for design and frontend work",
    eyebrow: "Design skills",
    description:
      "Claude skills for UI design, frontend implementation, creative direction, visual systems, and repeatable web app production.",
    seoTitle: "Claude skills for design and frontend work",
    seoDescription:
      "Find Claude skills for frontend design, UI implementation, creative direction, visual systems, and repeatable web app production.",
    categories: ["skills"],
    tags: ["design", "frontend", "ui", "visual", "web"],
    keywords: ["tailwind", "react", "component"],
    itemLimit: 16,
  },
  {
    slug: "claude-skills-for-documentation",
    title: "Claude skills for documentation workflows",
    eyebrow: "Documentation skills",
    description:
      "Skills, commands, and guides for writing docs, API references, onboarding content, changelogs, READMEs, and technical explainers.",
    seoTitle: "Claude skills for documentation workflows",
    seoDescription:
      "Discover Claude documentation skills, commands, and guides for API docs, READMEs, changelogs, onboarding, and technical writing.",
    categories: ["skills", "commands", "guides"],
    tags: ["documentation", "docs", "writing", "api", "readme"],
    keywords: ["changelog", "explain", "technical writing"],
    itemLimit: 18,
  },
  {
    slug: "claude-skills-for-data-workflows",
    title: "Claude skills and MCP tools for data workflows",
    eyebrow: "Data workflows",
    description:
      "Claude skills, MCP servers, and tools for data extraction, SQL, analytics, spreadsheet workflows, enrichment, and reporting.",
    seoTitle: "Claude skills and MCP tools for data workflows",
    seoDescription:
      "Browse Claude skills, MCP servers, and tools for SQL, analytics, data extraction, spreadsheet workflows, enrichment, and reporting.",
    categories: ["skills", "mcp", "tools"],
    tags: ["data", "database", "analytics", "spreadsheet", "reporting"],
    keywords: ["csv", "sql", "enrichment"],
    itemLimit: 18,
  },
  {
    slug: "safe-mcp-installs",
    title: "Safe MCP install checklist resources",
    eyebrow: "Safe MCP installs",
    description:
      "MCP servers and install resources that help teams review source, credentials, file access, network behavior, and package trust.",
    seoTitle: "Safe MCP install checklist resources",
    seoDescription:
      "Review MCP install resources by source, credential handling, file access, network behavior, package trust, and privacy notes.",
    categories: ["mcp"],
    tags: ["security", "privacy", "install", "credentials", "source"],
    keywords: ["package", "permissions", "local files"],
    itemLimit: 18,
  },
  {
    slug: "raycast-claude-workflows",
    title: "Raycast-friendly Claude workflow resources",
    eyebrow: "Raycast workflows",
    description:
      "Commands, tools, and skills that fit fast launcher workflows for developers who want Claude resources reachable from Raycast.",
    seoTitle: "Raycast-friendly Claude workflow resources",
    seoDescription:
      "Find Claude commands, tools, and skills for Raycast-friendly launcher workflows, fast search, install handoff, and developer utility.",
    categories: ["commands", "tools", "skills"],
    tags: ["raycast", "launcher", "workflow", "productivity", "search"],
    keywords: ["command palette", "shortcut", "handoff"],
    itemLimit: 18,
  },
  {
    slug: "agent-observability-workflows",
    title: "Agent observability and status workflows",
    eyebrow: "Observability",
    description:
      "Statuslines, tools, hooks, and MCP servers for usage tracking, cost awareness, latency, health checks, and runtime visibility.",
    seoTitle: "Agent observability and status workflows",
    seoDescription:
      "Browse agent observability resources for usage tracking, cost monitoring, latency, health checks, statuslines, and runtime visibility.",
    categories: ["statuslines", "tools", "mcp", "hooks"],
    tags: ["observability", "monitoring", "cost", "usage", "statusline"],
    keywords: ["latency", "tokens", "health"],
    itemLimit: 18,
  },
  {
    slug: "claude-code-statuslines",
    title: "Claude Code statuslines for live workflow context",
    eyebrow: "Statuslines",
    description:
      "Statuslines for model context, costs, timers, git state, MCP health, Docker health, and session-level Claude Code awareness.",
    seoTitle: "Claude Code statuslines for live workflow context",
    seoDescription:
      "Find Claude Code statuslines for costs, timers, git state, MCP health, Docker health, model context, and session awareness.",
    categories: ["statuslines"],
    tags: ["statusline", "usage", "cost", "monitoring", "git"],
    keywords: ["tokens", "timer", "health"],
    itemLimit: 18,
  },
  {
    slug: "prompt-and-context-engineering",
    title: "Prompt and context engineering resources",
    eyebrow: "Context engineering",
    description:
      "Rules, guides, commands, and skills for prompt design, CLAUDE.md setup, context hygiene, instructions, and reusable agent memory.",
    seoTitle: "Prompt and context engineering resources",
    seoDescription:
      "Explore Claude prompt and context engineering resources for rules, guides, commands, CLAUDE.md setup, instructions, and agent memory.",
    categories: ["rules", "guides", "commands", "skills"],
    tags: ["prompt", "context", "documentation", "workflow", "instructions"],
    keywords: ["claude.md", "memory", "system prompt"],
    itemLimit: 18,
  },
  {
    slug: "developer-productivity-agent-stack",
    title: "Developer productivity agent stack",
    eyebrow: "Productivity stack",
    description:
      "Collections, commands, hooks, skills, and MCP servers for faster commits, reviews, refactors, docs, debugging, and daily coding flow.",
    seoTitle: "Developer productivity agent stack",
    seoDescription:
      "Build a developer productivity agent stack with Claude collections, commands, hooks, skills, MCP servers, reviews, refactors, and docs.",
    categories: ["collections", "commands", "hooks", "skills", "mcp"],
    tags: ["productivity", "workflow", "automation", "git", "debugging"],
    keywords: ["refactor", "commit", "review"],
    itemLimit: 20,
  },
  {
    slug: "open-source-claude-resources",
    title: "Open-source Claude workflow resources",
    eyebrow: "Open source",
    description:
      "Source-backed agents, MCP servers, skills, hooks, commands, and guides that teams can inspect before adopting in Claude workflows.",
    seoTitle: "Open-source Claude workflow resources",
    seoDescription:
      "Browse source-backed Claude agents, MCP servers, skills, hooks, commands, and guides that teams can inspect before adoption.",
    categories: ["agents", "mcp", "skills", "hooks", "commands", "guides"],
    tags: ["open-source", "github", "source", "development", "workflow"],
    keywords: ["repository", "source code", "inspect"],
    requireSource: true,
    itemLimit: 20,
  },
  {
    slug: "claude-code-command-center",
    title: "Claude Code command center",
    eyebrow: "Commands",
    description:
      "Slash commands for commits, reviews, tests, docs, security checks, debugging, refactors, MCP setup, and repeatable coding tasks.",
    seoTitle: "Claude Code command center",
    seoDescription:
      "Find Claude Code slash commands for commits, reviews, tests, docs, security checks, debugging, refactors, and MCP setup.",
    categories: ["commands"],
    tags: ["git", "review", "testing", "security", "documentation"],
    keywords: ["slash command", "commit", "refactor"],
    itemLimit: 20,
  },
  {
    slug: "source-verified-mcp-tools",
    title: "Source-verified MCP tools and listings",
    eyebrow: "Source verified",
    description:
      "MCP servers and tool listings with visible source metadata for teams that want reviewable install paths and attribution before adoption.",
    seoTitle: "Source-verified MCP tools and listings",
    seoDescription:
      "Compare MCP servers and Claude tools with visible source metadata, reviewable install paths, attribution, and trust signals.",
    categories: ["mcp", "tools"],
    tags: ["source", "github", "security", "install", "trust"],
    keywords: ["source-backed", "repository", "reviewable"],
    requireSource: true,
    itemLimit: 20,
  },
  {
    slug: "claude-code-workflow-starter-kit",
    title: "Claude Code workflow starter kit",
    eyebrow: "Workflow starter kit",
    description:
      "A starter kit of collections, agents, commands, hooks, and skills for teams setting up practical Claude Code workflows.",
    seoTitle: "Claude Code workflow starter kit",
    seoDescription:
      "Build a Claude Code workflow starter kit with collections, agents, commands, hooks, skills, install signals, and reviewable setup paths.",
    categories: ["collections", "agents", "commands", "hooks", "skills"],
    tags: ["starter", "workflow", "productivity", "setup", "automation"],
    keywords: ["starter kit", "onboarding", "team"],
    itemLimit: 20,
  },
  {
    slug: "local-first-ai-workflows",
    title: "Local-first AI workflow resources",
    eyebrow: "Local-first",
    description:
      "Claude resources for local files, privacy-aware workflows, repository automation, offline-friendly setup, and reviewable local execution.",
    seoTitle: "Local-first AI workflow resources",
    seoDescription:
      "Find local-first Claude workflow resources for files, privacy-aware automation, repository work, offline-friendly setup, and reviewable execution.",
    categories: ["mcp", "hooks", "commands", "skills"],
    tags: ["local", "privacy", "files", "workflow", "automation"],
    keywords: ["offline", "filesystem", "repository"],
    itemLimit: 18,
  },
];
