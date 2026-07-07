import { describe, expect, it } from "vitest";
import type { Entry } from "@/types/registry";
import {
  detailIntegrationLinkIcon,
  detailIntegrationLinkIds,
  entryLlmsApiPath,
  entryRegistryApiPath,
  resolveDetailIntegrationLinks,
} from "@/lib/entry-detail-integration-links-lib";

function entry(overrides: Partial<Entry> = {}): Entry {
  return {
    category: "skills",
    slug: "fixture",
    title: "Fixture",
    description: "Fixture description",
    author: "Author",
    tags: [],
    platforms: ["claude-code"],
    installType: "manual",
    trust: "review",
    source: "unverified",
    dateAdded: "2026-01-01",
    ...overrides,
  } as Entry;
}

describe("entry detail integration links lib", () => {
  it("builds registry API paths for an entry", () => {
    expect(entryRegistryApiPath("mcp", "browser")).toBe(
      "/api/registry/entries/mcp/browser",
    );
    expect(entryLlmsApiPath("mcp", "browser")).toBe(
      "/api/registry/entries/mcp/browser/llms",
    );
  });

  it("always includes API, LLM, and manifest links", () => {
    expect(
      detailIntegrationLinkIds(resolveDetailIntegrationLinks(entry())),
    ).toEqual(["api-json", "llms", "manifest"]);
  });

  it("adds MCP ecosystem links for MCP entries", () => {
    expect(
      detailIntegrationLinkIds(
        resolveDetailIntegrationLinks(entry({ category: "mcp" })),
      ),
    ).toEqual(["api-json", "llms", "manifest", "mcp-feed", "ecosystem"]);
  });

  it("maps integration link ids to icon tokens", () => {
    expect(detailIntegrationLinkIcon("api-json")).toBe("code");
    expect(detailIntegrationLinkIcon("llms")).toBe("terminal");
    expect(detailIntegrationLinkIcon("manifest")).toBe("manifest");
    expect(detailIntegrationLinkIcon("mcp-feed")).toBe("feed");
    expect(detailIntegrationLinkIcon("ecosystem")).toBe("ecosystem");
    expect(detailIntegrationLinkIcon("raycast")).toBe("raycast");
    expect(detailIntegrationLinkIcon("unknown")).toBe("terminal");
  });

  it("adds Raycast handoff when the entry supports Raycast", () => {
    expect(
      detailIntegrationLinkIds(
        resolveDetailIntegrationLinks(
          entry({
            platforms: ["claude-code", "raycast"],
            category: "commands",
          }),
        ),
      ),
    ).toEqual(["api-json", "llms", "manifest", "raycast"]);
    expect(
      resolveDetailIntegrationLinks(
        entry({ platforms: ["claude-code", "raycast"], category: "commands" }),
      ).find((link) => link.id === "raycast"),
    ).toMatchObject({
      href: "https://www.raycast.com/jsonbored/heyclaude",
      external: true,
    });
  });
});
