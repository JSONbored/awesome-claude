import type { Contributor } from "@/types/registry";

export const CONTRIBUTORS: Contributor[] = [
  { slug: "jsonbored", handle: "jsonbored", name: "jsonbored", bio: "Maintainer of HeyClaude.", github: "https://github.com/jsonbored", acceptedCount: 42 },
  { slug: "modelcontextprotocol", handle: "modelcontextprotocol", name: "Model Context Protocol", bio: "First-party MCP servers.", github: "https://github.com/modelcontextprotocol", acceptedCount: 12 },
  { slug: "anthropic", handle: "anthropic", name: "Anthropic", bio: "Skills, rules, and reference agents.", github: "https://github.com/anthropics", acceptedCount: 9 },
  { slug: "cursor-team", handle: "cursor", name: "Cursor", bio: "Cursor-flavored skills and rules.", github: "https://github.com/getcursor", acceptedCount: 5 },
  { slug: "jzombie", handle: "jzombie", name: "jzombie", bio: "Hooks and statuslines author.", acceptedCount: 4 },
  { slug: "wong2", handle: "wong2", name: "wong2", bio: "MCP server author.", acceptedCount: 6 },
];

export function getContributor(slug: string) {
  return CONTRIBUTORS.find((c) => c.slug === slug);
}
