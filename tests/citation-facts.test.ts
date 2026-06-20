import fs from "node:fs";
import path from "node:path";

import { describe, expect, it } from "vitest";

import {
  buildEntryCitationFacts,
  entryCitationFacts,
} from "@heyclaude/registry";
import { repoRoot } from "./helpers/registry-fixtures";

function facts(entry: Record<string, unknown>) {
  return new Map(
    entryCitationFacts(entry as Parameters<typeof entryCitationFacts>[0]),
  );
}

describe("entryCitationFacts (shared citation-fact source)", () => {
  it("derives facts only from real fields — omits absent ones, fabricates nothing", () => {
    const f = facts({ category: "mcp", slug: "postgres" });
    expect(f.get("Canonical URL")).toBe(
      "https://heyclau.de/entry/mcp/postgres",
    );
    expect(f.get("Robots")).toBe("indexable");
    // absent fields are simply not present
    expect(f.has("Safety notes")).toBe(false);
    expect(f.has("License")).toBe(false);
    expect(f.has("Package URL")).toBe(false);
    // never invents ratings / reviews / aggregate scores
    expect(f.has("Rating")).toBe(false);
    expect(f.has("Review")).toBe(false);
    expect(f.get("Robots")).not.toContain("noindex");
  });

  it("handles safety/privacy notes as arrays (raw) AND strings (normalized client)", () => {
    expect(
      facts({
        category: "hooks",
        slug: "a",
        safetyNotes: ["Runs shell logic", "Network access"],
      }).get("Safety notes"),
    ).toBe("Runs shell logic, Network access");

    expect(
      facts({
        category: "hooks",
        slug: "a",
        safetyNotesList: ["Runs shell logic"],
        safetyNotes: "Runs shell logic",
      }).get("Safety notes"),
    ).toBe("Runs shell logic");

    expect(
      facts({
        category: "hooks",
        slug: "a",
        privacyNotes: "Sends telemetry to a third party",
      }).get("Privacy notes"),
    ).toBe("Sends telemetry to a third party");
  });

  it("surfaces source / package / verification / platform facts when present", () => {
    const f = facts({
      category: "mcp",
      slug: "y",
      repoUrl: "https://github.com/x/y",
      downloadUrl: "https://heyclau.de/downloads/y.mcpb",
      downloadSha256: "abc123",
      verifiedAt: "2026-06-01",
      license: "MIT",
      platformCompatibility: [
        { platform: "Claude Code", supportLevel: "full" },
      ],
      reviewedBy: "maintainer",
      robotsIndex: false,
    });
    expect(f.get("Source URLs")).toContain("github.com/x/y");
    expect(f.get("Package URL")).toContain("/downloads/y.mcpb");
    expect(f.get("Package SHA256")).toBe("abc123");
    expect(f.get("Last verified")).toBe("2026-06-01");
    expect(f.get("License")).toBe("MIT");
    expect(f.get("Platform compatibility")).toBe("Claude Code (full)");
    expect(f.get("Reviewed by")).toBe("maintainer");
    expect(f.get("Robots")).toBe("noindex");
  });

  it("buildEntryCitationFacts is exactly the pairs joined — block and LLMS endpoint cannot drift", () => {
    const entry = {
      category: "mcp",
      slug: "z",
      repoUrl: "https://github.com/a/b",
      safetyNotes: ["x"],
      license: "MIT",
    };
    const expected = entryCitationFacts(
      entry as Parameters<typeof entryCitationFacts>[0],
    )
      .map(([label, value]) => `- ${label}: ${value}`)
      .join("\n");
    expect(buildEntryCitationFacts(entry as never)).toBe(expected);
  });
});

describe("entry page wiring", () => {
  const src = fs.readFileSync(
    path.join(repoRoot, "apps/web/src/routes/entry.$category.$slug.tsx"),
    "utf8",
  );

  it("renders the consolidated CitationFacts block in its own section", () => {
    expect(src).toContain("CitationFacts");
    expect(src).toContain('id="citation-facts"');
    expect(src).toContain('label: "Citation facts"');
  });

  it("exposes the per-entry LLMS endpoint both as a visible link and a head alternate", () => {
    expect(src).toContain(
      "/api/registry/entries/${entry.category}/${entry.slug}/llms",
    );
    expect(src).toContain('rel: "alternate"');
    expect(src).toContain('type: "text/plain"');
  });
});
