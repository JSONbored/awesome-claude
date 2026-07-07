/**
 * Pure entry detail integration link helpers.
 *
 * Builds API, assistant, and platform handoff links for the entry command
 * center. Given the same entry metadata the output is deterministic.
 */

import type { Entry, Platform } from "@/types/registry";
import type { DetailQuickLink } from "@/lib/entry-detail-command-center-lib";

export const RAYCAST_EXTENSION_URL = "https://www.raycast.com/jsonbored/heyclaude";

export type DetailIntegrationLinkIcon =
  | "code"
  | "terminal"
  | "manifest"
  | "feed"
  | "ecosystem"
  | "raycast";

export function detailIntegrationLinkIcon(linkId: string): DetailIntegrationLinkIcon {
  switch (linkId) {
    case "api-json":
      return "code";
    case "llms":
      return "terminal";
    case "manifest":
      return "manifest";
    case "mcp-feed":
      return "feed";
    case "ecosystem":
      return "ecosystem";
    case "raycast":
      return "raycast";
    default:
      return "terminal";
  }
}

export function entryRegistryApiPath(category: string, slug: string): string {
  return `/api/registry/entries/${category}/${slug}`;
}

export function entryLlmsApiPath(category: string, slug: string): string {
  return `${entryRegistryApiPath(category, slug)}/llms`;
}

export function entrySupportsRaycast(platforms: Platform[]): boolean {
  return platforms.includes("raycast");
}

export function entryIsMcpCategory(category: string): boolean {
  return category === "mcp";
}

export function resolveDetailIntegrationLinks(
  entry: Pick<Entry, "category" | "slug" | "platforms">,
): DetailQuickLink[] {
  const links: DetailQuickLink[] = [
    {
      id: "api-json",
      label: "Registry API JSON",
      href: entryRegistryApiPath(entry.category, entry.slug),
      external: false,
    },
    {
      id: "llms",
      label: "LLM plain text",
      href: entryLlmsApiPath(entry.category, entry.slug),
      external: false,
    },
    {
      id: "manifest",
      label: "Registry manifest",
      href: "/api/registry/manifest",
      external: false,
    },
  ];

  if (entryIsMcpCategory(entry.category)) {
    links.push({
      id: "mcp-feed",
      label: "MCP registry feed",
      href: "/data/mcp-registry-feed.json",
      external: false,
    });
    links.push({
      id: "ecosystem",
      label: "MCP ecosystem guide",
      href: "/ecosystem",
      external: false,
    });
  }

  if (entrySupportsRaycast(entry.platforms)) {
    links.push({
      id: "raycast",
      label: "Open in Raycast",
      href: RAYCAST_EXTENSION_URL,
      external: true,
    });
  }

  return links;
}

export function detailIntegrationLinkIds(links: DetailQuickLink[]): string[] {
  return links.map((link) => link.id);
}
