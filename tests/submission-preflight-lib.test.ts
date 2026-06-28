import { describe, expect, it } from "vitest";

import type { DirectoryEntry } from "@/lib/content.server";
import {
  buildPreflightIssues,
  buildSubmissionPrPreview,
  duplicateReasonLabels,
  findDuplicateCandidates,
  isSimilarSubmissionTitle,
  isToolsRouteError,
  looksLikeCommercialListing,
  resolvePreflightRouteSuggestion,
  submittedSourceUrls,
} from "../apps/web/src/lib/submission-preflight-lib";

function directoryEntry(
  overrides: Partial<DirectoryEntry> &
    Pick<DirectoryEntry, "category" | "slug" | "title">,
): DirectoryEntry {
  return {
    description: "Fixture directory entry.",
    author: "Fixture",
    dateAdded: "2026-01-01",
    tags: [],
    ...overrides,
  } as DirectoryEntry;
}

describe("submission preflight duplicate detection", () => {
  it("labels duplicate reasons without inheriting prototype property names", () => {
    expect(duplicateReasonLabels(["slug", "source_url"])).toEqual([
      "same slug",
      "same source",
    ]);
    expect(duplicateReasonLabels(["constructor"])).toEqual(["constructor"]);
  });

  it("detects slug, title, source-url, repo, and host duplicates", () => {
    const entries = [
      directoryEntry({
        category: "mcp",
        slug: "demo-server",
        title: "Demo MCP Server",
        githubUrl: "https://github.com/example/demo-server",
      }),
      directoryEntry({
        category: "mcp",
        slug: "related-server",
        title: "Related Memory Server",
        githubUrl: "https://github.com/example/related-server",
        websiteUrl: "https://docs.vendor.example.com/install",
      }),
    ];

    const slugDuplicate = findDuplicateCandidates({
      entries,
      category: "mcp",
      slug: "demo-server",
      fields: {
        name: "Different Name",
        github_url: "https://github.com/other/new-server",
      },
    });
    expect(slugDuplicate).toEqual([
      expect.objectContaining({
        key: "mcp:demo-server",
        reasons: ["slug"],
      }),
    ]);

    const sourceDuplicate = findDuplicateCandidates({
      entries,
      category: "mcp",
      slug: "new-server",
      fields: {
        name: "Brand New Server",
        github_url: "https://github.com/example/demo-server",
      },
    });
    expect(sourceDuplicate).toEqual([
      expect.objectContaining({
        key: "mcp:demo-server",
        reasons: expect.arrayContaining(["source_url", "same_repo"]),
      }),
    ]);

    const hostDuplicate = findDuplicateCandidates({
      entries,
      category: "skills",
      slug: "vendor-skill",
      fields: {
        name: "Vendor Skill Pack",
        docs_url: "https://docs.vendor.example.com/guide",
      },
    });
    expect(hostDuplicate).toEqual([
      expect.objectContaining({
        key: "mcp:related-server",
        reasons: ["same_host"],
      }),
    ]);
  });

  it("flags similar titles without treating exact matches as similar-title warnings", () => {
    expect(
      isSimilarSubmissionTitle(
        "Browser Automation MCP",
        "Browser Automation Server",
      ),
    ).toBe(true);
    expect(
      isSimilarSubmissionTitle(
        "Browser Automation MCP",
        "Browser Automation MCP",
      ),
    ).toBe(false);

    const entries = [
      directoryEntry({
        category: "mcp",
        slug: "browser-automation",
        title: "Browser Automation MCP",
      }),
    ];
    const exactTitle = findDuplicateCandidates({
      entries,
      category: "mcp",
      slug: "browser-copy",
      fields: { name: "Browser Automation MCP" },
    });
    expect(exactTitle[0]?.reasons).toEqual(["title"]);

    const similarTitle = findDuplicateCandidates({
      entries,
      category: "mcp",
      slug: "browser-copy",
      fields: { name: "Browser Automation Server" },
    });
    expect(similarTitle[0]?.reasons).toEqual(["similar_title"]);
  });

  it("canonicalizes submitted source URLs for duplicate comparison", () => {
    expect(
      submittedSourceUrls({
        github_url:
          "https://www.GitHub.com/example/demo/?utm_source=newsletter",
      }),
    ).toEqual(["https://github.com/example/demo"]);
  });
});

describe("submission preflight routing helpers", () => {
  it("detects commercial listings and tools-route validation errors", () => {
    expect(
      looksLikeCommercialListing({
        name: "Hosted SaaS Platform",
        description: "Enterprise pricing and sponsorship options.",
      }),
    ).toBe(true);
    expect(
      looksLikeCommercialListing({
        name: "Open MCP Server",
        description: "Runs locally without subscription tiers.",
      }),
    ).toBe(false);
    expect(isToolsRouteError("Use the tools/app listing flow instead.")).toBe(
      true,
    );
    expect(isToolsRouteError("Missing required field: safety_notes")).toBe(
      false,
    );
  });

  it("builds blockers and warnings from duplicate and source-review signals", () => {
    const { blockers, warnings, shouldRouteCommercial } = buildPreflightIssues({
      validationSkipped: false,
      validationErrors: [],
      category: "mcp",
      fields: { name: "Demo MCP Server" },
      duplicates: [
        {
          key: "mcp:demo-server",
          category: "mcp",
          slug: "demo-server",
          title: "Demo MCP Server",
          url: "https://heyclau.de/entry/mcp/demo-server",
          reasons: ["slug", "similar_title"],
          reasonLabels: ["same slug", "similar title"],
        },
      ],
      sourceGateStatus: "review",
      sourceGateSummary: "Add a canonical GitHub URL.",
      missingSafetySummary: "Add safety notes.",
    });

    expect(shouldRouteCommercial).toBe(false);
    expect(blockers).toEqual([
      expect.objectContaining({
        code: "duplicate_existing",
        message: expect.stringContaining("same slug"),
      }),
    ]);
    expect(warnings).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ code: "possible_duplicate_existing" }),
        expect.objectContaining({ code: "source_needs_review" }),
        expect.objectContaining({ code: "missing_safety_notes" }),
      ]),
    );
  });

  it("routes commercial and high-risk submissions away from direct PR submit", () => {
    expect(
      resolvePreflightRouteSuggestion({
        validationErrors: [],
        shouldRouteCommercial: true,
        blockers: [],
      }),
    ).toBe("route_away");
    expect(
      resolvePreflightRouteSuggestion({
        validationErrors: ["Use the tools/app listing flow."],
        shouldRouteCommercial: false,
        blockers: [],
      }),
    ).toBe("route_away");
    expect(
      resolvePreflightRouteSuggestion({
        validationErrors: [],
        shouldRouteCommercial: false,
        blockers: [{ code: "duplicate_existing", message: "duplicate" }],
      }),
    ).toBe("fix_required");
    expect(
      resolvePreflightRouteSuggestion({
        validationErrors: [],
        shouldRouteCommercial: false,
        blockers: [],
        riskTier: "high",
      }),
    ).toBe("manual_review");
    expect(
      resolvePreflightRouteSuggestion({
        validationErrors: [],
        shouldRouteCommercial: false,
        blockers: [],
      }),
    ).toBe("submit_pr");
  });

  it("builds PR preview metadata for valid submissions", () => {
    expect(
      buildSubmissionPrPreview(
        { title: "Add MCP Server: Demo", body: "### Name\n\nDemo" },
        "mcp",
        "demo-server",
      ),
    ).toMatchObject({
      title: "Add MCP Server: Demo",
      targetPath: "content/mcp/demo-server.mdx",
      branchHint: "heyclaude/submit-mcp-demo-server",
      baseRef: "main",
    });
  });
});
