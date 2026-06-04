import { ARTIFACT_CONTRACTS } from "@/data/changelog";

export interface EcosystemFeed {
  path: string;
  purpose: string;
  contentType: "json" | "xml" | "txt";
  lastBuilt: string;
  bytes: number;
  sha256: string;
  consumers: string[];
}

const PURPOSES: Record<string, Pick<EcosystemFeed, "purpose" | "consumers">> = {
  "/data/ecosystem-feed.json": {
    purpose: "Cross-harness ecosystem manifest for integration surfaces.",
    consumers: ["Web", "MCP"],
  },
  "/data/raycast-index.json": {
    purpose: "Flat index optimized for the Raycast extension.",
    consumers: ["Raycast"],
  },
  "/data/mcp-registry-feed.json": {
    purpose: "MCP entries with install and trust metadata.",
    consumers: ["MCP hosts"],
  },
  "/data/plugin-export-feed.json": {
    purpose: "Cross-harness plugin bundles with compatibility metadata.",
    consumers: ["Claude Code", "Codex", "Cursor"],
  },
  "/data/registry-changelog.json": {
    purpose: "Ordered registry diff feed for incremental sync.",
    consumers: ["MCP", "Raycast", "RSS"],
  },
  "/data/feeds/index.json": {
    purpose: "JSON index of public machine-readable feeds.",
    consumers: ["Web", "API clients"],
  },
};

function contentTypeFor(path: string): EcosystemFeed["contentType"] {
  if (path.endsWith(".xml")) return "xml";
  if (path.endsWith(".txt")) return "txt";
  return "json";
}

export const ECOSYSTEM_FEEDS: EcosystemFeed[] = ARTIFACT_CONTRACTS.filter(
  (artifact) => PURPOSES[artifact.path],
)
  .map((artifact) => {
    const meta = PURPOSES[artifact.path]!;
    return {
      path: artifact.path,
      purpose: meta.purpose,
      contentType: contentTypeFor(artifact.path),
      lastBuilt: artifact.builtAt,
      bytes: artifact.bytes,
      sha256: artifact.sha256,
      consumers: meta.consumers,
    };
  })
  .sort((left, right) => left.path.localeCompare(right.path));
