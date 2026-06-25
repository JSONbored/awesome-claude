import { REGISTRY_GENERATED_AT } from "@/data/entries";
import type { Integration } from "@/types/registry";
import mcpPackage from "../../../../packages/mcp/package.json";

const REGISTRY_UPDATED_DATE = REGISTRY_GENERATED_AT.slice(0, 10);

export const INTEGRATIONS: Integration[] = [
  {
    slug: "web",
    name: "Web directory",
    tagline: "Browse, compare, and claim entries on heyclau.de",
    kind: "extension",
    tier: "Official extension",
    status: "live",
    mark: "anthropic",
    bullets: [
      "Faceted search across every category",
      "Side-by-side comparison and watch lists",
      "Source-backed dossiers with copyable assets",
    ],
    primaryAction: { label: "Open browser", href: "/browse" },
    secondaryAction: { label: "Trending", href: "/trending" },
    updatedAt: REGISTRY_UPDATED_DATE,
    surface: { kind: "web", label: "Web", snippet: "https://heyclau.de" },
    trustPosture:
      "Read-only static + cached responses. No personal data persisted without consent.",
  },
  {
    slug: "raycast",
    name: "Raycast extension",
    tagline: "Search HeyClaude from anywhere on macOS",
    kind: "extension",
    tier: "Official extension",
    status: "live",
    mark: "raycast",
    bullets: [
      "Search every category from a single command",
      "Copy install commands, config, and full assets without leaving Raycast",
      "Browse jobs and submit content inline",
    ],
    primaryAction: {
      label: "Install in Raycast",
      href: "https://www.raycast.com/jsonbored/heyclaude",
    },
    secondaryAction: {
      label: "Source",
      href: "https://github.com/jsonbored/awesome-claude/tree/main/integrations/raycast",
    },
    version: "2.4.0",
    updatedAt: REGISTRY_UPDATED_DATE,
    install: [
      { client: "Raycast Store", snippet: "raycast://extensions/jsonbored/heyclaude" },
      { client: "CLI fallback", snippet: "npx heyclaude search 'postgres mcp'" },
    ],
    surface: {
      kind: "raycast",
      label: "Raycast",
      snippet: "raycast://extensions/jsonbored/heyclaude",
    },
    trustPosture:
      "Read-only consumer of /data/raycast-index.json. No credentials are stored on disk; content writes route through the PR-first submission gate.",
  },
  {
    slug: "mcp-server",
    name: "@heyclaude/mcp",
    tagline: "Bring the registry into Claude, Cursor, Windsurf, and Codex via MCP",
    kind: "mcp-server",
    tier: "First-party server",
    status: "live",
    mark: "mcp",
    // Our own published package — the live badge must reflect @heyclaude/mcp's
    // real version + weekly downloads, NOT the upstream MCP SDK's (which has ~39M/wk).
    npmPackage: "@heyclaude/mcp",
    githubRepo: "jsonbored/awesome-claude",
    bullets: [
      "20+ tools: search, trending, compare, get_entry_detail, prepare_submission_draft, explain_entry_trust",
      "Prompts and resources for workflow planning",
      "Stdio + remote HTTP transport",
    ],
    primaryAction: { label: "Run via npx", href: "https://www.npmjs.com/package/@heyclaude/mcp" },
    secondaryAction: {
      label: "Source",
      href: "https://github.com/jsonbored/awesome-claude/tree/main/packages/mcp",
    },
    version: mcpPackage.version,
    updatedAt: REGISTRY_UPDATED_DATE,
    install: [
      {
        client: "Claude Desktop",
        snippet: `{
  "mcpServers": {
    "heyclaude": { "command": "npx", "args": ["-y", "@heyclaude/mcp"] }
  }
}`,
      },
      {
        client: "Cursor",
        snippet: `{
  "mcpServers": {
    "heyclaude": { "command": "npx", "args": ["-y", "@heyclaude/mcp"] }
  }
}`,
      },
      { client: "Codex / CLI", snippet: "npx -y @heyclaude/mcp" },
      { client: "Remote HTTP", snippet: "https://heyclau.de/api/mcp" },
    ],
    surface: { kind: "mcp", label: "MCP", snippet: "npx -y @heyclaude/mcp" },
    trustPosture:
      "Read-only. Server does not create issues, push to GitHub, install packages, or write local files.",
  },
  {
    slug: "public-api",
    name: "Public REST API",
    tagline: "Registry search, trending, manifest, integrity, diff",
    kind: "api",
    tier: "Public API",
    status: "live",
    mark: "openapi",
    bullets: [
      "Stable JSON shapes with artifact-contract hashes",
      "Cursored diff feed for incremental sync",
      "No auth for read endpoints; rate-limited",
    ],
    primaryAction: { label: "Open API docs", href: "/api-docs" },
    secondaryAction: { label: "Manifest", href: "https://heyclau.de/api/registry/manifest" },
    version: "v1",
    updatedAt: REGISTRY_UPDATED_DATE,
    surface: {
      kind: "api",
      label: "REST API",
      snippet: "curl https://heyclau.de/api/registry/manifest",
    },
    trustPosture:
      "Every artifact ships with a SHA-256 in the registry manifest. Use /api/registry/integrity to verify.",
  },
  {
    slug: "cursor-mdc",
    name: "Cursor .mdc adapter feed",
    tagline: "Auto-generated Cursor adapter for every Claude skill",
    kind: "adapter",
    tier: "Adapter",
    status: "live",
    mark: "cursor",
    bullets: [
      "One .mdc per skill, regenerated on every registry build",
      "Indexed under /data/skill-adapters/cursor/",
      "Drop straight into .cursor/rules/",
    ],
    primaryAction: { label: "Browse adapters", href: "/platforms" },
    secondaryAction: { label: "Spec", href: "/api-docs#cursor-adapter" },
    version: "schema 1",
    updatedAt: REGISTRY_UPDATED_DATE,
  },
  {
    slug: "llms-txt",
    name: "/llms.txt corpus",
    tagline: "LLM-readable index and per-entry text exports",
    kind: "feed",
    tier: "Public feed",
    status: "live",
    mark: "json",
    bullets: [
      "/llms.txt — full directory map for retrieval",
      "/llms-full.txt — entire corpus in one file",
      "/api/registry/entries/<category>/<slug>/llms — per-entry text export",
    ],
    primaryAction: { label: "View llms.txt", href: "https://heyclau.de/llms.txt" },
    secondaryAction: { label: "Full corpus", href: "https://heyclau.de/llms-full.txt" },
    updatedAt: REGISTRY_UPDATED_DATE,
  },
  {
    slug: "rss-changelog",
    name: "Registry changelog feed",
    tagline: "RSS, Atom, and JSON diff of every added / updated / removed entry",
    kind: "feed",
    tier: "Public feed",
    status: "live",
    mark: "rss",
    bullets: [
      "Per-entry artifactHash in RSS GUIDs for integrity-aware consumers",
      "Cursored diff via /api/registry/diff?hash=…",
      "Atom + RSS 2.0",
    ],
    primaryAction: { label: "RSS", href: "https://heyclau.de/feed.xml" },
    secondaryAction: { label: "Atom", href: "https://heyclau.de/atom.xml" },
    updatedAt: REGISTRY_UPDATED_DATE,
  },
  {
    slug: "ecosystem-feed",
    name: "Ecosystem feed",
    tagline: "Machine-readable export of all downstream consumers and mirrors",
    kind: "feed",
    tier: "Public feed",
    status: "live",
    mark: "json",
    bullets: [
      "JSON feed of integrations, plugins, and mirrors that consume HeyClaude",
      "Schema-versioned, SHA-256 in manifest",
    ],
    primaryAction: { label: "Open JSON", href: "https://heyclau.de/data/ecosystem-feed.json" },
    secondaryAction: { label: "Integrations index", href: "/integrations" },
    updatedAt: REGISTRY_UPDATED_DATE,
  },
  {
    slug: "github-actions",
    name: "Submission pipeline",
    tagline: "GitHub Actions for submission validation, PR import, and integrity scans",
    kind: "package",
    tier: "Public feed",
    status: "live",
    mark: "github",
    bullets: [
      "PR-first preflight and private gate flow",
      "Package artifact security scan",
      "Auto-refreshed GitHub stats and README",
    ],
    primaryAction: {
      label: "View workflows",
      href: "https://github.com/jsonbored/awesome-claude/tree/main/.github/workflows",
    },
    secondaryAction: { label: "Submit a resource", href: "/submit" },
    updatedAt: REGISTRY_UPDATED_DATE,
  },
];

export function getIntegration(slug: string): Integration | undefined {
  return INTEGRATIONS.find((i) => i.slug === slug);
}
