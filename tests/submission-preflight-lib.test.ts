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
  missingNoteWarnings,
  normalizePreflightError,
  normalizePreflightText,
  preflightBlocker,
  preflightWarning,
  resolvePreflightRouteSuggestion,
  submittedSourceUrls,
  submittedSourceValues,
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
    expect(
      submittedSourceUrls({
        github_url: "https://token@github.com/example/demo",
      }),
    ).toEqual(["https://github.com/example/demo"]);
    expect(
      submittedSourceValues({ website_url: "https://example.com" }),
    ).toEqual([
      undefined,
      undefined,
      undefined,
      undefined,
      "https://example.com",
    ]);
  });

  it("ignores source values that canonicalize but fail URL parsing", () => {
    expect(
      findDuplicateCandidates({
        entries: [
          directoryEntry({
            category: "mcp",
            slug: "existing",
            title: "Existing",
          }),
        ],
        category: "mcp",
        slug: "new-entry",
        fields: {
          name: "New Entry",
          docs_url: "not a url",
        },
      }),
    ).toEqual([]);
  });

  it("matches duplicates using title when name is absent", () => {
    const entries = [
      directoryEntry({
        category: "mcp",
        slug: "title-only",
        title: "Title Only MCP",
      }),
    ];
    expect(
      findDuplicateCandidates({
        entries,
        category: "mcp",
        slug: "other",
        fields: { title: "Title Only MCP" },
      }),
    ).toEqual([
      expect.objectContaining({
        key: "mcp:title-only",
        reasons: ["title"],
      }),
    ]);
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
    expect(looksLikeCommercialListing({})).toBe(false);
    expect(
      looksLikeCommercialListing({
        name: "Open MCP Server",
        description: "Runs locally without subscription tiers.",
      }),
    ).toBe(false);
    expect(isToolsRouteError("Use the tools/app listing flow instead.")).toBe(
      true,
    );
    expect(
      isToolsRouteError("Use the tools/app lead form for paid listings."),
    ).toBe(true);
    expect(
      isToolsRouteError(
        "not merged from the free resource queue without maintainer approval",
      ),
    ).toBe(true);
    expect(isToolsRouteError("change the category to tools")).toBe(true);
    expect(isToolsRouteError("Missing required field: safety_notes")).toBe(
      false,
    );
  });

  it("builds validation, commercial, and privacy warnings", () => {
    const skipped = buildPreflightIssues({
      validationSkipped: true,
      validationErrors: ["Missing required field: slug"],
      category: "prompts",
      fields: {},
      duplicates: [],
    });
    expect(skipped.blockers.map((item) => item.code)).toEqual([
      "unsupported_category",
      "schema_invalid",
    ]);

    const commercial = buildPreflightIssues({
      validationSkipped: false,
      validationErrors: [],
      category: "mcp",
      fields: {
        name: "Paid SaaS Platform",
        description: "Enterprise pricing and sponsorship options.",
      },
      duplicates: [],
    });
    expect(commercial.shouldRouteCommercial).toBe(true);
    expect(commercial.blockers).toEqual([
      expect.objectContaining({ code: "route_away" }),
    ]);

    const toolsCategory = buildPreflightIssues({
      validationSkipped: false,
      validationErrors: [],
      category: "tools",
      fields: {
        name: "Paid SaaS Platform",
        description: "Enterprise pricing and sponsorship options.",
      },
      duplicates: [],
    });
    expect(toolsCategory.shouldRouteCommercial).toBe(false);

    const privacy = buildPreflightIssues({
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
          reasons: ["title"],
          reasonLabels: ["same title"],
        },
      ],
      missingPrivacySummary: "Add privacy notes.",
    });
    expect(privacy.warnings).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          code: "possible_duplicate_title",
        }),
        expect.objectContaining({
          code: "missing_privacy_notes",
          message: "Add privacy notes.",
        }),
      ]),
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
        policyDecision: "maintainer_review",
      }),
    ).toBe("manual_review");
    expect(
      resolvePreflightRouteSuggestion({
        validationErrors: [],
        shouldRouteCommercial: false,
        blockers: [],
        riskTier: "critical",
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

  it("normalizes preflight helper values and errors", () => {
    expect(normalizePreflightText("  Demo  ")).toBe("Demo");
    expect(preflightBlocker("code", "message")).toEqual({
      code: "code",
      message: "message",
    });
    expect(preflightWarning("code", "message")).toEqual({
      code: "code",
      message: "message",
    });
    expect(normalizePreflightError(new Error("directory offline"))).toEqual({
      name: "Error",
      message: "directory offline",
    });
    expect(normalizePreflightError("directory offline")).toEqual({
      message: "directory offline",
    });
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
    expect(
      buildSubmissionPrPreview(
        { title: "Add MCP Server: Demo", body: "### Name\n\nDemo" },
        "",
        "",
      ),
    ).toMatchObject({
      targetPath: "",
      branchHint: "",
    });
  });
});

describe("missingNoteWarnings", () => {
  const risk = (ids: string[]) =>
    ({
      classificationWarnings: ids.map((id) => ({ id })),
    }) as unknown as Parameters<typeof missingNoteWarnings>[0];

  it("surfaces both note warnings when present", () => {
    const result = missingNoteWarnings(
      risk(["missing_safety_notes", "missing_privacy_notes"]),
    );
    expect(result.safety?.id).toBe("missing_safety_notes");
    expect(result.privacy?.id).toBe("missing_privacy_notes");
  });

  it("returns undefined for a note type that was not flagged", () => {
    const result = missingNoteWarnings(risk(["missing_safety_notes"]));
    expect(result.safety?.id).toBe("missing_safety_notes");
    expect(result.privacy).toBeUndefined();
  });

  it("returns both undefined when there are no classification warnings", () => {
    expect(missingNoteWarnings(risk([]))).toEqual({
      safety: undefined,
      privacy: undefined,
    });
  });
});

describe("submission-preflight-lib coverage gaps", () => {
  it("missingNoteWarnings defaults to no warnings when classificationWarnings is absent", () => {
    const result = missingNoteWarnings(
      {} as Parameters<typeof missingNoteWarnings>[0],
    );
    expect(result).toEqual({ safety: undefined, privacy: undefined });
  });

  it("isSimilarSubmissionTitle returns false when either title tokenizes to nothing", () => {
    expect(isSimilarSubmissionTitle("", "Browser Bridge")).toBe(false);
    expect(isSimilarSubmissionTitle("Browser Bridge", "")).toBe(false);
  });

  it("isSimilarSubmissionTitle returns false when a title has only short words", () => {
    // "ai ml" is non-empty and differs from the other title, but every token is
    // <= 2 chars, so titleWords() is empty and the size guard returns false.
    expect(isSimilarSubmissionTitle("ai ml", "Browser Bridge Tool")).toBe(
      false,
    );
  });

  it("findDuplicateCandidates falls back from name to title to empty", () => {
    const entry = directoryEntry({
      category: "mcp",
      slug: "x",
      title: "Browser Bridge",
    });
    // No name field -> the comparable title comes from `title` and matches.
    const byTitle = findDuplicateCandidates({
      entries: [entry],
      fields: { title: "Browser Bridge" },
      category: "mcp",
      slug: "y",
    });
    expect(byTitle.some((c) => c.reasons.includes("title"))).toBe(true);
    // Neither name nor title -> empty comparable title, no title-based match.
    const noTitle = findDuplicateCandidates({
      entries: [entry],
      fields: {},
      category: "mcp",
      slug: "y",
    });
    expect(noTitle.every((c) => !c.reasons.includes("title"))).toBe(true);
  });

  it("findDuplicateCandidates skips the slug reason when category or slug is blank", () => {
    const entry = directoryEntry({ category: "mcp", slug: "x", title: "X" });
    const result = findDuplicateCandidates({
      entries: [entry],
      fields: { name: "X" },
      category: "",
      slug: "",
    });
    expect(result.every((c) => !c.reasons.includes("slug"))).toBe(true);
  });

  it("buildPreflightIssues uses a default source-review message when no summary is given", () => {
    const result = buildPreflightIssues({
      validationSkipped: false,
      validationErrors: [],
      category: "mcp",
      fields: {},
      duplicates: [],
      sourceGateStatus: "fail",
    });
    const warning = result.warnings.find(
      (w) => w.code === "source_needs_review",
    );
    expect(warning?.message).toContain("Add a canonical GitHub");
  });
});
