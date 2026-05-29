export interface EcosystemFeed {
  path: string;
  purpose: string;
  contentType: "json" | "xml" | "txt";
  lastBuilt: string;
  bytes: number;
  sha256: string;
  consumers: string[];
}

/**
 * Public artifact feeds consumed by ecosystem clients (Raycast, MCP, Cursor
 * adapters, RSS subscribers). Numbers mirror what /api/registry/manifest
 * publishes once wired; for now they're consistent with /quality mocks.
 */
export const ECOSYSTEM_FEEDS: EcosystemFeed[] = [
  {
    path: "/data/ecosystem-feed.json",
    purpose: "Cross-harness ecosystem manifest (integrations, adapters, surfaces).",
    contentType: "json",
    lastBuilt: "2026-05-26T08:12:00Z",
    bytes: 24_512,
    sha256: "9e1aef…02b1",
    consumers: ["Web", "MCP"],
  },
  {
    path: "/data/raycast-index.json",
    purpose: "Flat index optimized for Raycast's search command.",
    contentType: "json",
    lastBuilt: "2026-05-26T08:12:00Z",
    bytes: 96_440,
    sha256: "5c1029…7a55",
    consumers: ["Raycast"],
  },
  {
    path: "/data/mcp-registry-feed.json",
    purpose: "MCP server entries with install + verification metadata.",
    contentType: "json",
    lastBuilt: "2026-05-26T08:12:00Z",
    bytes: 142_804,
    sha256: "33aa12…ff10",
    consumers: ["MCP hosts", "Smithery", "Glama"],
  },
  {
    path: "/data/plugin-export-feed.json",
    purpose: "Cross-harness plugin bundles with harness compatibility.",
    contentType: "json",
    lastBuilt: "2026-05-26T08:12:00Z",
    bytes: 38_120,
    sha256: "a91be3…d802",
    consumers: ["Claude Code", "Cursor", "Codex"],
  },
  {
    path: "/data/registry-changelog.json",
    purpose: "Ordered diff feed for incremental sync.",
    contentType: "json",
    lastBuilt: "2026-05-26T08:12:00Z",
    bytes: 11_220,
    sha256: "b71c4a…02f9",
    consumers: ["MCP", "Raycast", "RSS"],
  },
  {
    path: "/feed.xml",
    purpose: "RSS feed for registry deltas.",
    contentType: "xml",
    lastBuilt: "2026-05-26T08:12:00Z",
    bytes: 8_402,
    sha256: "ee01a4…cd22",
    consumers: ["RSS readers"],
  },
  {
    path: "/llms-full.txt",
    purpose: "LLM-ingestible directory corpus.",
    contentType: "txt",
    lastBuilt: "2026-05-26T08:12:00Z",
    bytes: 1_204_512,
    sha256: "ee01a4…cd22",
    consumers: ["LLM ingestion"],
  },
];
