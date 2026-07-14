import { describe, expect, it } from "vitest";

import { SITE_URL } from "../packages/mcp/src/platforms.js";
import {
  entryUpdatedAt,
  scoreRelatedEntry,
  toEntrySummary,
  toSearchResult,
  unwrapEntries,
} from "../packages/mcp/src/registry-projection-lib.js";

function makeEntry(overrides: Record<string, unknown> = {}) {
  return {
    category: "mcp",
    slug: "browser-bridge",
    title: "Browser Bridge",
    description: "Runs Playwright automation.",
    tags: ["browser-automation", "testing"],
    keywords: ["playwright", "browser"],
    platforms: ["claude-code", "cursor"],
    installCommand: "npx -y browser-bridge",
    repoUrl: "https://github.com/example/browser-bridge",
    dateAdded: "2026-01-15",
    safetyNotes: ["Runs browser automation"],
    privacyNotes: ["Reads project files"],
    installable: true,
    ...overrides,
  };
}

describe("registry-projection-lib unwrapEntries", () => {
  it("returns entries array from artifact envelope", () => {
    const entries = [makeEntry(), makeEntry({ slug: "other" })];
    expect(unwrapEntries({ entries })).toEqual(entries);
  });

  it("throws when payload is missing entries array", () => {
    expect(() => unwrapEntries(null)).toThrow(/entries array/);
    expect(() => unwrapEntries({ entries: "nope" })).toThrow(/entries array/);
    expect(() => unwrapEntries({})).toThrow(/entries array/);
  });
});

describe("registry-projection-lib entryUpdatedAt", () => {
  it("prefers repoUpdatedAt over updatedAt and dateAdded", () => {
    expect(
      entryUpdatedAt(
        makeEntry({
          repoUpdatedAt: "2026-03-01",
          updatedAt: "2026-02-01",
          dateAdded: "2026-01-01",
        }),
      ),
    ).toBe("2026-03-01");
  });

  it("falls back through updatedAt and dateAdded", () => {
    expect(
      entryUpdatedAt(
        makeEntry({
          repoUpdatedAt: null,
          updatedAt: "2026-02-01",
          dateAdded: "2026-01-01",
        }),
      ),
    ).toBe("2026-02-01");
    expect(
      entryUpdatedAt(
        makeEntry({
          repoUpdatedAt: null,
          updatedAt: "",
          dateAdded: "2026-01-01",
        }),
      ),
    ).toBe("2026-01-01");
    expect(
      entryUpdatedAt(
        makeEntry({ repoUpdatedAt: null, updatedAt: "", dateAdded: "" }),
      ),
    ).toBe("");
  });

  it("updatedAt for mcp variant 0", () => {
    expect(
      entryUpdatedAt(
        makeEntry({
          category: "mcp",
          slug: "mcp-0",
          repoUpdatedAt: "2026-01-15",
        }),
      ),
    ).toMatch(/^2026-/);
  });
  it("updatedAt for mcp variant 1", () => {
    expect(
      entryUpdatedAt(
        makeEntry({
          category: "mcp",
          slug: "mcp-1",
          repoUpdatedAt: "2026-02-15",
        }),
      ),
    ).toMatch(/^2026-/);
  });
  it("updatedAt for mcp variant 2", () => {
    expect(
      entryUpdatedAt(
        makeEntry({
          category: "mcp",
          slug: "mcp-2",
          repoUpdatedAt: "2026-03-15",
        }),
      ),
    ).toMatch(/^2026-/);
  });
  it("updatedAt for skills variant 0", () => {
    expect(
      entryUpdatedAt(
        makeEntry({
          category: "skills",
          slug: "skills-0",
          repoUpdatedAt: "2026-01-15",
        }),
      ),
    ).toMatch(/^2026-/);
  });
  it("updatedAt for skills variant 1", () => {
    expect(
      entryUpdatedAt(
        makeEntry({
          category: "skills",
          slug: "skills-1",
          repoUpdatedAt: "2026-02-15",
        }),
      ),
    ).toMatch(/^2026-/);
  });
  it("updatedAt for skills variant 2", () => {
    expect(
      entryUpdatedAt(
        makeEntry({
          category: "skills",
          slug: "skills-2",
          repoUpdatedAt: "2026-03-15",
        }),
      ),
    ).toMatch(/^2026-/);
  });
  it("updatedAt for hooks variant 0", () => {
    expect(
      entryUpdatedAt(
        makeEntry({
          category: "hooks",
          slug: "hooks-0",
          repoUpdatedAt: "2026-01-15",
        }),
      ),
    ).toMatch(/^2026-/);
  });
  it("updatedAt for hooks variant 1", () => {
    expect(
      entryUpdatedAt(
        makeEntry({
          category: "hooks",
          slug: "hooks-1",
          repoUpdatedAt: "2026-02-15",
        }),
      ),
    ).toMatch(/^2026-/);
  });
  it("updatedAt for hooks variant 2", () => {
    expect(
      entryUpdatedAt(
        makeEntry({
          category: "hooks",
          slug: "hooks-2",
          repoUpdatedAt: "2026-03-15",
        }),
      ),
    ).toMatch(/^2026-/);
  });
  it("updatedAt for commands variant 0", () => {
    expect(
      entryUpdatedAt(
        makeEntry({
          category: "commands",
          slug: "commands-0",
          repoUpdatedAt: "2026-01-15",
        }),
      ),
    ).toMatch(/^2026-/);
  });
  it("updatedAt for commands variant 1", () => {
    expect(
      entryUpdatedAt(
        makeEntry({
          category: "commands",
          slug: "commands-1",
          repoUpdatedAt: "2026-02-15",
        }),
      ),
    ).toMatch(/^2026-/);
  });
  it("updatedAt for commands variant 2", () => {
    expect(
      entryUpdatedAt(
        makeEntry({
          category: "commands",
          slug: "commands-2",
          repoUpdatedAt: "2026-03-15",
        }),
      ),
    ).toMatch(/^2026-/);
  });
  it("updatedAt for statuslines variant 0", () => {
    expect(
      entryUpdatedAt(
        makeEntry({
          category: "statuslines",
          slug: "statuslines-0",
          repoUpdatedAt: "2026-01-15",
        }),
      ),
    ).toMatch(/^2026-/);
  });
  it("updatedAt for statuslines variant 1", () => {
    expect(
      entryUpdatedAt(
        makeEntry({
          category: "statuslines",
          slug: "statuslines-1",
          repoUpdatedAt: "2026-02-15",
        }),
      ),
    ).toMatch(/^2026-/);
  });
  it("updatedAt for statuslines variant 2", () => {
    expect(
      entryUpdatedAt(
        makeEntry({
          category: "statuslines",
          slug: "statuslines-2",
          repoUpdatedAt: "2026-03-15",
        }),
      ),
    ).toMatch(/^2026-/);
  });
  it("updatedAt for guides variant 0", () => {
    expect(
      entryUpdatedAt(
        makeEntry({
          category: "guides",
          slug: "guides-0",
          repoUpdatedAt: "2026-01-15",
        }),
      ),
    ).toMatch(/^2026-/);
  });
  it("updatedAt for guides variant 1", () => {
    expect(
      entryUpdatedAt(
        makeEntry({
          category: "guides",
          slug: "guides-1",
          repoUpdatedAt: "2026-02-15",
        }),
      ),
    ).toMatch(/^2026-/);
  });
  it("updatedAt for guides variant 2", () => {
    expect(
      entryUpdatedAt(
        makeEntry({
          category: "guides",
          slug: "guides-2",
          repoUpdatedAt: "2026-03-15",
        }),
      ),
    ).toMatch(/^2026-/);
  });
  it("updatedAt for plugins variant 0", () => {
    expect(
      entryUpdatedAt(
        makeEntry({
          category: "plugins",
          slug: "plugins-0",
          repoUpdatedAt: "2026-01-15",
        }),
      ),
    ).toMatch(/^2026-/);
  });
  it("updatedAt for plugins variant 1", () => {
    expect(
      entryUpdatedAt(
        makeEntry({
          category: "plugins",
          slug: "plugins-1",
          repoUpdatedAt: "2026-02-15",
        }),
      ),
    ).toMatch(/^2026-/);
  });
  it("updatedAt for plugins variant 2", () => {
    expect(
      entryUpdatedAt(
        makeEntry({
          category: "plugins",
          slug: "plugins-2",
          repoUpdatedAt: "2026-03-15",
        }),
      ),
    ).toMatch(/^2026-/);
  });
});

describe("registry-projection-lib toSearchResult", () => {
  it("projects search result shape with trust and ranking metadata", () => {
    const entry = makeEntry({
      brandName: "Example",
      brandDomain: "example.com",
      submittedBy: "contributor",
      claimStatus: "verified",
      downloadTrust: "first-party",
    });
    const result = toSearchResult(entry, {
      score: 42,
      reasons: ["title_match"],
    });
    expect(result).toMatchObject({
      key: "mcp:browser-bridge",
      category: "mcp",
      slug: "browser-bridge",
      title: "Browser Bridge",
      searchScore: 42,
      searchReasons: ["title_match"],
      brandName: "Example",
      claimStatus: "verified",
    });
    expect(result.trust.source.status).toBe("available");
    expect(result.canonicalUrl).toContain("browser-bridge");
  });

  it("defaults ranking fields and note arrays when ranking is omitted", () => {
    const result = toSearchResult(
      makeEntry({ safetyNotes: null, privacyNotes: undefined }),
    );
    expect(result.searchScore).toBe(0);
    expect(result.searchReasons).toEqual([]);
    expect(result.safetyNotes).toEqual([]);
    expect(result.privacyNotes).toEqual([]);
  });

  it("uses entry url when present else canonical url", () => {
    expect(
      toSearchResult(makeEntry({ url: "https://custom.example/x" })).url,
    ).toBe("https://custom.example/x");
    expect(toSearchResult(makeEntry({ url: "" })).url).toBe(
      `${SITE_URL}/entry/mcp/browser-bridge`,
    );
  });

  it("search result for mcp on claude-code", () => {
    const result = toSearchResult(
      makeEntry({
        category: "mcp",
        slug: "mcp-demo",
        platforms: ["claude-code"],
      }),
      { score: 10, reasons: ["tag"] },
    );
    expect(result.key).toBe("mcp:mcp-demo");
    expect(result.platforms).toEqual(["claude-code"]);
    expect(result.trust).toBeDefined();
  });
  it("search result for mcp on cursor", () => {
    const result = toSearchResult(
      makeEntry({
        category: "mcp",
        slug: "mcp-demo",
        platforms: ["cursor"],
      }),
      { score: 10, reasons: ["tag"] },
    );
    expect(result.key).toBe("mcp:mcp-demo");
    expect(result.platforms).toEqual(["cursor"]);
    expect(result.trust).toBeDefined();
  });
  it("search result for mcp on codex", () => {
    const result = toSearchResult(
      makeEntry({
        category: "mcp",
        slug: "mcp-demo",
        platforms: ["codex"],
      }),
      { score: 10, reasons: ["tag"] },
    );
    expect(result.key).toBe("mcp:mcp-demo");
    expect(result.platforms).toEqual(["codex"]);
    expect(result.trust).toBeDefined();
  });
  it("search result for mcp on windsurf", () => {
    const result = toSearchResult(
      makeEntry({
        category: "mcp",
        slug: "mcp-demo",
        platforms: ["windsurf"],
      }),
      { score: 10, reasons: ["tag"] },
    );
    expect(result.key).toBe("mcp:mcp-demo");
    expect(result.platforms).toEqual(["windsurf"]);
    expect(result.trust).toBeDefined();
  });
  it("search result for skills on claude-code", () => {
    const result = toSearchResult(
      makeEntry({
        category: "skills",
        slug: "skills-demo",
        platforms: ["claude-code"],
      }),
      { score: 10, reasons: ["tag"] },
    );
    expect(result.key).toBe("skills:skills-demo");
    expect(result.platforms).toEqual(["claude-code"]);
    expect(result.trust).toBeDefined();
  });
  it("search result for skills on cursor", () => {
    const result = toSearchResult(
      makeEntry({
        category: "skills",
        slug: "skills-demo",
        platforms: ["cursor"],
      }),
      { score: 10, reasons: ["tag"] },
    );
    expect(result.key).toBe("skills:skills-demo");
    expect(result.platforms).toEqual(["cursor"]);
    expect(result.trust).toBeDefined();
  });
  it("search result for skills on codex", () => {
    const result = toSearchResult(
      makeEntry({
        category: "skills",
        slug: "skills-demo",
        platforms: ["codex"],
      }),
      { score: 10, reasons: ["tag"] },
    );
    expect(result.key).toBe("skills:skills-demo");
    expect(result.platforms).toEqual(["codex"]);
    expect(result.trust).toBeDefined();
  });
  it("search result for skills on windsurf", () => {
    const result = toSearchResult(
      makeEntry({
        category: "skills",
        slug: "skills-demo",
        platforms: ["windsurf"],
      }),
      { score: 10, reasons: ["tag"] },
    );
    expect(result.key).toBe("skills:skills-demo");
    expect(result.platforms).toEqual(["windsurf"]);
    expect(result.trust).toBeDefined();
  });
  it("search result for hooks on claude-code", () => {
    const result = toSearchResult(
      makeEntry({
        category: "hooks",
        slug: "hooks-demo",
        platforms: ["claude-code"],
      }),
      { score: 10, reasons: ["tag"] },
    );
    expect(result.key).toBe("hooks:hooks-demo");
    expect(result.platforms).toEqual(["claude-code"]);
    expect(result.trust).toBeDefined();
  });
  it("search result for hooks on cursor", () => {
    const result = toSearchResult(
      makeEntry({
        category: "hooks",
        slug: "hooks-demo",
        platforms: ["cursor"],
      }),
      { score: 10, reasons: ["tag"] },
    );
    expect(result.key).toBe("hooks:hooks-demo");
    expect(result.platforms).toEqual(["cursor"]);
    expect(result.trust).toBeDefined();
  });
  it("search result for hooks on codex", () => {
    const result = toSearchResult(
      makeEntry({
        category: "hooks",
        slug: "hooks-demo",
        platforms: ["codex"],
      }),
      { score: 10, reasons: ["tag"] },
    );
    expect(result.key).toBe("hooks:hooks-demo");
    expect(result.platforms).toEqual(["codex"]);
    expect(result.trust).toBeDefined();
  });
  it("search result for hooks on windsurf", () => {
    const result = toSearchResult(
      makeEntry({
        category: "hooks",
        slug: "hooks-demo",
        platforms: ["windsurf"],
      }),
      { score: 10, reasons: ["tag"] },
    );
    expect(result.key).toBe("hooks:hooks-demo");
    expect(result.platforms).toEqual(["windsurf"]);
    expect(result.trust).toBeDefined();
  });
  it("search result for commands on claude-code", () => {
    const result = toSearchResult(
      makeEntry({
        category: "commands",
        slug: "commands-demo",
        platforms: ["claude-code"],
      }),
      { score: 10, reasons: ["tag"] },
    );
    expect(result.key).toBe("commands:commands-demo");
    expect(result.platforms).toEqual(["claude-code"]);
    expect(result.trust).toBeDefined();
  });
  it("search result for commands on cursor", () => {
    const result = toSearchResult(
      makeEntry({
        category: "commands",
        slug: "commands-demo",
        platforms: ["cursor"],
      }),
      { score: 10, reasons: ["tag"] },
    );
    expect(result.key).toBe("commands:commands-demo");
    expect(result.platforms).toEqual(["cursor"]);
    expect(result.trust).toBeDefined();
  });
  it("search result for commands on codex", () => {
    const result = toSearchResult(
      makeEntry({
        category: "commands",
        slug: "commands-demo",
        platforms: ["codex"],
      }),
      { score: 10, reasons: ["tag"] },
    );
    expect(result.key).toBe("commands:commands-demo");
    expect(result.platforms).toEqual(["codex"]);
    expect(result.trust).toBeDefined();
  });
  it("search result for commands on windsurf", () => {
    const result = toSearchResult(
      makeEntry({
        category: "commands",
        slug: "commands-demo",
        platforms: ["windsurf"],
      }),
      { score: 10, reasons: ["tag"] },
    );
    expect(result.key).toBe("commands:commands-demo");
    expect(result.platforms).toEqual(["windsurf"]);
    expect(result.trust).toBeDefined();
  });
  it("search result for statuslines on claude-code", () => {
    const result = toSearchResult(
      makeEntry({
        category: "statuslines",
        slug: "statuslines-demo",
        platforms: ["claude-code"],
      }),
      { score: 10, reasons: ["tag"] },
    );
    expect(result.key).toBe("statuslines:statuslines-demo");
    expect(result.platforms).toEqual(["claude-code"]);
    expect(result.trust).toBeDefined();
  });
  it("search result for statuslines on cursor", () => {
    const result = toSearchResult(
      makeEntry({
        category: "statuslines",
        slug: "statuslines-demo",
        platforms: ["cursor"],
      }),
      { score: 10, reasons: ["tag"] },
    );
    expect(result.key).toBe("statuslines:statuslines-demo");
    expect(result.platforms).toEqual(["cursor"]);
    expect(result.trust).toBeDefined();
  });
  it("search result for statuslines on codex", () => {
    const result = toSearchResult(
      makeEntry({
        category: "statuslines",
        slug: "statuslines-demo",
        platforms: ["codex"],
      }),
      { score: 10, reasons: ["tag"] },
    );
    expect(result.key).toBe("statuslines:statuslines-demo");
    expect(result.platforms).toEqual(["codex"]);
    expect(result.trust).toBeDefined();
  });
  it("search result for statuslines on windsurf", () => {
    const result = toSearchResult(
      makeEntry({
        category: "statuslines",
        slug: "statuslines-demo",
        platforms: ["windsurf"],
      }),
      { score: 10, reasons: ["tag"] },
    );
    expect(result.key).toBe("statuslines:statuslines-demo");
    expect(result.platforms).toEqual(["windsurf"]);
    expect(result.trust).toBeDefined();
  });
  it("search result for guides on claude-code", () => {
    const result = toSearchResult(
      makeEntry({
        category: "guides",
        slug: "guides-demo",
        platforms: ["claude-code"],
      }),
      { score: 10, reasons: ["tag"] },
    );
    expect(result.key).toBe("guides:guides-demo");
    expect(result.platforms).toEqual(["claude-code"]);
    expect(result.trust).toBeDefined();
  });
  it("search result for guides on cursor", () => {
    const result = toSearchResult(
      makeEntry({
        category: "guides",
        slug: "guides-demo",
        platforms: ["cursor"],
      }),
      { score: 10, reasons: ["tag"] },
    );
    expect(result.key).toBe("guides:guides-demo");
    expect(result.platforms).toEqual(["cursor"]);
    expect(result.trust).toBeDefined();
  });
  it("search result for guides on codex", () => {
    const result = toSearchResult(
      makeEntry({
        category: "guides",
        slug: "guides-demo",
        platforms: ["codex"],
      }),
      { score: 10, reasons: ["tag"] },
    );
    expect(result.key).toBe("guides:guides-demo");
    expect(result.platforms).toEqual(["codex"]);
    expect(result.trust).toBeDefined();
  });
  it("search result for guides on windsurf", () => {
    const result = toSearchResult(
      makeEntry({
        category: "guides",
        slug: "guides-demo",
        platforms: ["windsurf"],
      }),
      { score: 10, reasons: ["tag"] },
    );
    expect(result.key).toBe("guides:guides-demo");
    expect(result.platforms).toEqual(["windsurf"]);
    expect(result.trust).toBeDefined();
  });
  it("search result for plugins on claude-code", () => {
    const result = toSearchResult(
      makeEntry({
        category: "plugins",
        slug: "plugins-demo",
        platforms: ["claude-code"],
      }),
      { score: 10, reasons: ["tag"] },
    );
    expect(result.key).toBe("plugins:plugins-demo");
    expect(result.platforms).toEqual(["claude-code"]);
    expect(result.trust).toBeDefined();
  });
  it("search result for plugins on cursor", () => {
    const result = toSearchResult(
      makeEntry({
        category: "plugins",
        slug: "plugins-demo",
        platforms: ["cursor"],
      }),
      { score: 10, reasons: ["tag"] },
    );
    expect(result.key).toBe("plugins:plugins-demo");
    expect(result.platforms).toEqual(["cursor"]);
    expect(result.trust).toBeDefined();
  });
  it("search result for plugins on codex", () => {
    const result = toSearchResult(
      makeEntry({
        category: "plugins",
        slug: "plugins-demo",
        platforms: ["codex"],
      }),
      { score: 10, reasons: ["tag"] },
    );
    expect(result.key).toBe("plugins:plugins-demo");
    expect(result.platforms).toEqual(["codex"]);
    expect(result.trust).toBeDefined();
  });
  it("search result for plugins on windsurf", () => {
    const result = toSearchResult(
      makeEntry({
        category: "plugins",
        slug: "plugins-demo",
        platforms: ["windsurf"],
      }),
      { score: 10, reasons: ["tag"] },
    );
    expect(result.key).toBe("plugins:plugins-demo");
    expect(result.platforms).toEqual(["windsurf"]);
    expect(result.trust).toBeDefined();
  });
});

describe("registry-projection-lib toEntrySummary", () => {
  it("extends search result with summary-only fields", () => {
    const summary = toEntrySummary(
      makeEntry({
        dateAdded: "2026-01-15",
        repoUpdatedAt: "2026-03-01",
        verificationStatus: "verified",
        supportLevels: ["community", "commercial"],
      }),
    );
    expect(summary.dateAdded).toBe("2026-01-15");
    expect(summary.repoUpdatedAt).toBe("2026-03-01");
    expect(summary.verificationStatus).toBe("verified");
    expect(summary.installable).toBe(true);
    expect(summary.supportLevels).toEqual(["community", "commercial"]);
    expect(summary.key).toBe("mcp:browser-bridge");
  });

  it("entry summary for mcp claim=verified", () => {
    const summary = toEntrySummary(
      makeEntry({
        category: "mcp",
        slug: "mcp-sum",
        claimStatus: "verified",
        installable: true,
      }),
    );
    expect(summary.category).toBe("mcp");
    expect(summary.trust.review.claimStatus).toBeDefined();
  });
  it("entry summary for mcp claim=unclaimed", () => {
    const summary = toEntrySummary(
      makeEntry({
        category: "mcp",
        slug: "mcp-sum",
        claimStatus: "unclaimed",
        installable: false,
      }),
    );
    expect(summary.category).toBe("mcp");
    expect(summary.trust.review.claimStatus).toBeDefined();
  });
  it("entry summary for mcp claim=pending", () => {
    const summary = toEntrySummary(
      makeEntry({
        category: "mcp",
        slug: "mcp-sum",
        claimStatus: "pending",
        installable: false,
      }),
    );
    expect(summary.category).toBe("mcp");
    expect(summary.trust.review.claimStatus).toBeDefined();
  });
  it("entry summary for skills claim=verified", () => {
    const summary = toEntrySummary(
      makeEntry({
        category: "skills",
        slug: "skills-sum",
        claimStatus: "verified",
        installable: true,
      }),
    );
    expect(summary.category).toBe("skills");
    expect(summary.trust.review.claimStatus).toBeDefined();
  });
  it("entry summary for skills claim=unclaimed", () => {
    const summary = toEntrySummary(
      makeEntry({
        category: "skills",
        slug: "skills-sum",
        claimStatus: "unclaimed",
        installable: false,
      }),
    );
    expect(summary.category).toBe("skills");
    expect(summary.trust.review.claimStatus).toBeDefined();
  });
  it("entry summary for skills claim=pending", () => {
    const summary = toEntrySummary(
      makeEntry({
        category: "skills",
        slug: "skills-sum",
        claimStatus: "pending",
        installable: false,
      }),
    );
    expect(summary.category).toBe("skills");
    expect(summary.trust.review.claimStatus).toBeDefined();
  });
  it("entry summary for hooks claim=verified", () => {
    const summary = toEntrySummary(
      makeEntry({
        category: "hooks",
        slug: "hooks-sum",
        claimStatus: "verified",
        installable: true,
      }),
    );
    expect(summary.category).toBe("hooks");
    expect(summary.trust.review.claimStatus).toBeDefined();
  });
  it("entry summary for hooks claim=unclaimed", () => {
    const summary = toEntrySummary(
      makeEntry({
        category: "hooks",
        slug: "hooks-sum",
        claimStatus: "unclaimed",
        installable: false,
      }),
    );
    expect(summary.category).toBe("hooks");
    expect(summary.trust.review.claimStatus).toBeDefined();
  });
  it("entry summary for hooks claim=pending", () => {
    const summary = toEntrySummary(
      makeEntry({
        category: "hooks",
        slug: "hooks-sum",
        claimStatus: "pending",
        installable: false,
      }),
    );
    expect(summary.category).toBe("hooks");
    expect(summary.trust.review.claimStatus).toBeDefined();
  });
  it("entry summary for commands claim=verified", () => {
    const summary = toEntrySummary(
      makeEntry({
        category: "commands",
        slug: "commands-sum",
        claimStatus: "verified",
        installable: true,
      }),
    );
    expect(summary.category).toBe("commands");
    expect(summary.trust.review.claimStatus).toBeDefined();
  });
  it("entry summary for commands claim=unclaimed", () => {
    const summary = toEntrySummary(
      makeEntry({
        category: "commands",
        slug: "commands-sum",
        claimStatus: "unclaimed",
        installable: false,
      }),
    );
    expect(summary.category).toBe("commands");
    expect(summary.trust.review.claimStatus).toBeDefined();
  });
  it("entry summary for commands claim=pending", () => {
    const summary = toEntrySummary(
      makeEntry({
        category: "commands",
        slug: "commands-sum",
        claimStatus: "pending",
        installable: false,
      }),
    );
    expect(summary.category).toBe("commands");
    expect(summary.trust.review.claimStatus).toBeDefined();
  });
  it("entry summary for statuslines claim=verified", () => {
    const summary = toEntrySummary(
      makeEntry({
        category: "statuslines",
        slug: "statuslines-sum",
        claimStatus: "verified",
        installable: true,
      }),
    );
    expect(summary.category).toBe("statuslines");
    expect(summary.trust.review.claimStatus).toBeDefined();
  });
  it("entry summary for statuslines claim=unclaimed", () => {
    const summary = toEntrySummary(
      makeEntry({
        category: "statuslines",
        slug: "statuslines-sum",
        claimStatus: "unclaimed",
        installable: false,
      }),
    );
    expect(summary.category).toBe("statuslines");
    expect(summary.trust.review.claimStatus).toBeDefined();
  });
  it("entry summary for statuslines claim=pending", () => {
    const summary = toEntrySummary(
      makeEntry({
        category: "statuslines",
        slug: "statuslines-sum",
        claimStatus: "pending",
        installable: false,
      }),
    );
    expect(summary.category).toBe("statuslines");
    expect(summary.trust.review.claimStatus).toBeDefined();
  });
  it("entry summary for guides claim=verified", () => {
    const summary = toEntrySummary(
      makeEntry({
        category: "guides",
        slug: "guides-sum",
        claimStatus: "verified",
        installable: true,
      }),
    );
    expect(summary.category).toBe("guides");
    expect(summary.trust.review.claimStatus).toBeDefined();
  });
  it("entry summary for guides claim=unclaimed", () => {
    const summary = toEntrySummary(
      makeEntry({
        category: "guides",
        slug: "guides-sum",
        claimStatus: "unclaimed",
        installable: false,
      }),
    );
    expect(summary.category).toBe("guides");
    expect(summary.trust.review.claimStatus).toBeDefined();
  });
  it("entry summary for guides claim=pending", () => {
    const summary = toEntrySummary(
      makeEntry({
        category: "guides",
        slug: "guides-sum",
        claimStatus: "pending",
        installable: false,
      }),
    );
    expect(summary.category).toBe("guides");
    expect(summary.trust.review.claimStatus).toBeDefined();
  });
  it("entry summary for plugins claim=verified", () => {
    const summary = toEntrySummary(
      makeEntry({
        category: "plugins",
        slug: "plugins-sum",
        claimStatus: "verified",
        installable: true,
      }),
    );
    expect(summary.category).toBe("plugins");
    expect(summary.trust.review.claimStatus).toBeDefined();
  });
  it("entry summary for plugins claim=unclaimed", () => {
    const summary = toEntrySummary(
      makeEntry({
        category: "plugins",
        slug: "plugins-sum",
        claimStatus: "unclaimed",
        installable: false,
      }),
    );
    expect(summary.category).toBe("plugins");
    expect(summary.trust.review.claimStatus).toBeDefined();
  });
  it("entry summary for plugins claim=pending", () => {
    const summary = toEntrySummary(
      makeEntry({
        category: "plugins",
        slug: "plugins-sum",
        claimStatus: "pending",
        installable: false,
      }),
    );
    expect(summary.category).toBe("plugins");
    expect(summary.trust.review.claimStatus).toBeDefined();
  });
});

describe("registry-projection-lib scoreRelatedEntry", () => {
  it("returns null for the same entry or unrelated candidates", () => {
    const target = makeEntry();
    expect(scoreRelatedEntry(target, target)).toBeNull();
    expect(
      scoreRelatedEntry(
        target,
        makeEntry({
          category: "guides",
          slug: "unrelated",
          tags: [],
          keywords: [],
          platforms: [],
          repoUrl: "",
        }),
      ),
    ).toBeNull();
  });

  it("scores shared category, tags, keywords, platforms, and source hosts", () => {
    const target = makeEntry({
      tags: ["automation", "browser"],
      keywords: ["playwright"],
      platforms: ["claude-code"],
      repoUrl: "https://github.com/shared/org",
    });
    const candidate = makeEntry({
      slug: "playwright-helper",
      tags: ["automation", "testing"],
      keywords: ["playwright", "browser"],
      platforms: ["claude-code", "cursor"],
      repoUrl: "https://github.com/shared/org",
    });
    const related = scoreRelatedEntry(target, candidate);
    expect(related).not.toBeNull();
    expect(related!.score).toBeGreaterThan(4);
    expect(related!.reasons).toContain("same_category");
    expect(related!.reasons.some((r) => r.startsWith("tag:"))).toBe(true);
    expect(related!.reasons.some((r) => r.startsWith("keyword:"))).toBe(true);
    expect(related!.reasons.some((r) => r.startsWith("platform:"))).toBe(true);
    expect(related!.reasons.some((r) => r.startsWith("source:"))).toBe(true);
  });

  it("explains a keyword-only match with keyword reasons", () => {
    const target = makeEntry({
      category: "mcp",
      slug: "kw-target",
      tags: [],
      keywords: ["playwright", "browser"],
      platforms: [],
      repoUrl: "",
    });
    const candidate = makeEntry({
      category: "guides",
      slug: "kw-candidate",
      tags: [],
      keywords: ["playwright", "browser"],
      platforms: [],
      repoUrl: "",
    });
    const related = scoreRelatedEntry(target, candidate);
    expect(related).not.toBeNull();
    expect(related!.score).toBeGreaterThan(0);
    expect(related!.reasons).toEqual(["keyword:playwright", "keyword:browser"]);
  });

  it("caps keyword contribution at six points", () => {
    const keywords = Array.from({ length: 10 }, (_, i) => `kw-${i}`);
    const target = makeEntry({ keywords });
    const candidate = makeEntry({ slug: "kw-heavy", keywords });
    expect(scoreRelatedEntry(target, candidate)?.score).toBeGreaterThanOrEqual(
      6,
    );
  });

  it("related score mcp pair 0", () => {
    const target = makeEntry({
      category: "mcp",
      slug: "mcp-target-0",
      tags: ["shared-0", "tag-a"],
      keywords: ["kw-0"],
      platforms: ["claude-code"],
    });
    const candidate = makeEntry({
      category: "mcp",
      slug: "mcp-candidate-0",
      tags: ["shared-0", "tag-b"],
      keywords: ["kw-0", "extra"],
      platforms: ["claude-code", "cursor"],
      repoUrl: "https://github.com/org/repo-0",
    });
    const related = scoreRelatedEntry(target, candidate);
    if (related) {
      expect(related.score).toBeGreaterThan(0);
      expect(related.reasons.length).toBeGreaterThan(0);
    }
  });
  it("related score mcp pair 1", () => {
    const target = makeEntry({
      category: "mcp",
      slug: "mcp-target-1",
      tags: ["shared-1", "tag-a"],
      keywords: ["kw-1"],
      platforms: ["claude-code"],
    });
    const candidate = makeEntry({
      category: "guides",
      slug: "mcp-candidate-1",
      tags: ["shared-1", "tag-b"],
      keywords: ["kw-1", "extra"],
      platforms: ["claude-code", "cursor"],
      repoUrl: "https://github.com/org/repo-1",
    });
    const related = scoreRelatedEntry(target, candidate);
    if (related) {
      expect(related.score).toBeGreaterThan(0);
      expect(related.reasons.length).toBeGreaterThan(0);
    }
  });
  it("related score mcp pair 2", () => {
    const target = makeEntry({
      category: "mcp",
      slug: "mcp-target-2",
      tags: ["shared-2", "tag-a"],
      keywords: ["kw-2"],
      platforms: ["claude-code"],
    });
    const candidate = makeEntry({
      category: "mcp",
      slug: "mcp-candidate-2",
      tags: ["shared-2", "tag-b"],
      keywords: ["kw-2", "extra"],
      platforms: ["claude-code", "cursor"],
      repoUrl: "https://github.com/org/repo-2",
    });
    const related = scoreRelatedEntry(target, candidate);
    if (related) {
      expect(related.score).toBeGreaterThan(0);
      expect(related.reasons.length).toBeGreaterThan(0);
    }
  });
  it("related score mcp pair 3", () => {
    const target = makeEntry({
      category: "mcp",
      slug: "mcp-target-3",
      tags: ["shared-3", "tag-a"],
      keywords: ["kw-3"],
      platforms: ["claude-code"],
    });
    const candidate = makeEntry({
      category: "guides",
      slug: "mcp-candidate-3",
      tags: ["shared-3", "tag-b"],
      keywords: ["kw-3", "extra"],
      platforms: ["claude-code", "cursor"],
      repoUrl: "https://github.com/org/repo-3",
    });
    const related = scoreRelatedEntry(target, candidate);
    if (related) {
      expect(related.score).toBeGreaterThan(0);
      expect(related.reasons.length).toBeGreaterThan(0);
    }
  });
  it("related score mcp pair 4", () => {
    const target = makeEntry({
      category: "mcp",
      slug: "mcp-target-4",
      tags: ["shared-4", "tag-a"],
      keywords: ["kw-4"],
      platforms: ["claude-code"],
    });
    const candidate = makeEntry({
      category: "mcp",
      slug: "mcp-candidate-4",
      tags: ["shared-4", "tag-b"],
      keywords: ["kw-4", "extra"],
      platforms: ["claude-code", "cursor"],
      repoUrl: "https://github.com/org/repo-4",
    });
    const related = scoreRelatedEntry(target, candidate);
    if (related) {
      expect(related.score).toBeGreaterThan(0);
      expect(related.reasons.length).toBeGreaterThan(0);
    }
  });
  it("related score skills pair 0", () => {
    const target = makeEntry({
      category: "skills",
      slug: "skills-target-0",
      tags: ["shared-0", "tag-a"],
      keywords: ["kw-0"],
      platforms: ["claude-code"],
    });
    const candidate = makeEntry({
      category: "skills",
      slug: "skills-candidate-0",
      tags: ["shared-0", "tag-b"],
      keywords: ["kw-0", "extra"],
      platforms: ["claude-code", "cursor"],
      repoUrl: "https://github.com/org/repo-0",
    });
    const related = scoreRelatedEntry(target, candidate);
    if (related) {
      expect(related.score).toBeGreaterThan(0);
      expect(related.reasons.length).toBeGreaterThan(0);
    }
  });
  it("related score skills pair 1", () => {
    const target = makeEntry({
      category: "skills",
      slug: "skills-target-1",
      tags: ["shared-1", "tag-a"],
      keywords: ["kw-1"],
      platforms: ["claude-code"],
    });
    const candidate = makeEntry({
      category: "guides",
      slug: "skills-candidate-1",
      tags: ["shared-1", "tag-b"],
      keywords: ["kw-1", "extra"],
      platforms: ["claude-code", "cursor"],
      repoUrl: "https://github.com/org/repo-1",
    });
    const related = scoreRelatedEntry(target, candidate);
    if (related) {
      expect(related.score).toBeGreaterThan(0);
      expect(related.reasons.length).toBeGreaterThan(0);
    }
  });
  it("related score skills pair 2", () => {
    const target = makeEntry({
      category: "skills",
      slug: "skills-target-2",
      tags: ["shared-2", "tag-a"],
      keywords: ["kw-2"],
      platforms: ["claude-code"],
    });
    const candidate = makeEntry({
      category: "skills",
      slug: "skills-candidate-2",
      tags: ["shared-2", "tag-b"],
      keywords: ["kw-2", "extra"],
      platforms: ["claude-code", "cursor"],
      repoUrl: "https://github.com/org/repo-2",
    });
    const related = scoreRelatedEntry(target, candidate);
    if (related) {
      expect(related.score).toBeGreaterThan(0);
      expect(related.reasons.length).toBeGreaterThan(0);
    }
  });
  it("related score skills pair 3", () => {
    const target = makeEntry({
      category: "skills",
      slug: "skills-target-3",
      tags: ["shared-3", "tag-a"],
      keywords: ["kw-3"],
      platforms: ["claude-code"],
    });
    const candidate = makeEntry({
      category: "guides",
      slug: "skills-candidate-3",
      tags: ["shared-3", "tag-b"],
      keywords: ["kw-3", "extra"],
      platforms: ["claude-code", "cursor"],
      repoUrl: "https://github.com/org/repo-3",
    });
    const related = scoreRelatedEntry(target, candidate);
    if (related) {
      expect(related.score).toBeGreaterThan(0);
      expect(related.reasons.length).toBeGreaterThan(0);
    }
  });
  it("related score skills pair 4", () => {
    const target = makeEntry({
      category: "skills",
      slug: "skills-target-4",
      tags: ["shared-4", "tag-a"],
      keywords: ["kw-4"],
      platforms: ["claude-code"],
    });
    const candidate = makeEntry({
      category: "skills",
      slug: "skills-candidate-4",
      tags: ["shared-4", "tag-b"],
      keywords: ["kw-4", "extra"],
      platforms: ["claude-code", "cursor"],
      repoUrl: "https://github.com/org/repo-4",
    });
    const related = scoreRelatedEntry(target, candidate);
    if (related) {
      expect(related.score).toBeGreaterThan(0);
      expect(related.reasons.length).toBeGreaterThan(0);
    }
  });
  it("related score hooks pair 0", () => {
    const target = makeEntry({
      category: "hooks",
      slug: "hooks-target-0",
      tags: ["shared-0", "tag-a"],
      keywords: ["kw-0"],
      platforms: ["claude-code"],
    });
    const candidate = makeEntry({
      category: "hooks",
      slug: "hooks-candidate-0",
      tags: ["shared-0", "tag-b"],
      keywords: ["kw-0", "extra"],
      platforms: ["claude-code", "cursor"],
      repoUrl: "https://github.com/org/repo-0",
    });
    const related = scoreRelatedEntry(target, candidate);
    if (related) {
      expect(related.score).toBeGreaterThan(0);
      expect(related.reasons.length).toBeGreaterThan(0);
    }
  });
  it("related score hooks pair 1", () => {
    const target = makeEntry({
      category: "hooks",
      slug: "hooks-target-1",
      tags: ["shared-1", "tag-a"],
      keywords: ["kw-1"],
      platforms: ["claude-code"],
    });
    const candidate = makeEntry({
      category: "guides",
      slug: "hooks-candidate-1",
      tags: ["shared-1", "tag-b"],
      keywords: ["kw-1", "extra"],
      platforms: ["claude-code", "cursor"],
      repoUrl: "https://github.com/org/repo-1",
    });
    const related = scoreRelatedEntry(target, candidate);
    if (related) {
      expect(related.score).toBeGreaterThan(0);
      expect(related.reasons.length).toBeGreaterThan(0);
    }
  });
  it("related score hooks pair 2", () => {
    const target = makeEntry({
      category: "hooks",
      slug: "hooks-target-2",
      tags: ["shared-2", "tag-a"],
      keywords: ["kw-2"],
      platforms: ["claude-code"],
    });
    const candidate = makeEntry({
      category: "hooks",
      slug: "hooks-candidate-2",
      tags: ["shared-2", "tag-b"],
      keywords: ["kw-2", "extra"],
      platforms: ["claude-code", "cursor"],
      repoUrl: "https://github.com/org/repo-2",
    });
    const related = scoreRelatedEntry(target, candidate);
    if (related) {
      expect(related.score).toBeGreaterThan(0);
      expect(related.reasons.length).toBeGreaterThan(0);
    }
  });
  it("related score hooks pair 3", () => {
    const target = makeEntry({
      category: "hooks",
      slug: "hooks-target-3",
      tags: ["shared-3", "tag-a"],
      keywords: ["kw-3"],
      platforms: ["claude-code"],
    });
    const candidate = makeEntry({
      category: "guides",
      slug: "hooks-candidate-3",
      tags: ["shared-3", "tag-b"],
      keywords: ["kw-3", "extra"],
      platforms: ["claude-code", "cursor"],
      repoUrl: "https://github.com/org/repo-3",
    });
    const related = scoreRelatedEntry(target, candidate);
    if (related) {
      expect(related.score).toBeGreaterThan(0);
      expect(related.reasons.length).toBeGreaterThan(0);
    }
  });
  it("related score hooks pair 4", () => {
    const target = makeEntry({
      category: "hooks",
      slug: "hooks-target-4",
      tags: ["shared-4", "tag-a"],
      keywords: ["kw-4"],
      platforms: ["claude-code"],
    });
    const candidate = makeEntry({
      category: "hooks",
      slug: "hooks-candidate-4",
      tags: ["shared-4", "tag-b"],
      keywords: ["kw-4", "extra"],
      platforms: ["claude-code", "cursor"],
      repoUrl: "https://github.com/org/repo-4",
    });
    const related = scoreRelatedEntry(target, candidate);
    if (related) {
      expect(related.score).toBeGreaterThan(0);
      expect(related.reasons.length).toBeGreaterThan(0);
    }
  });
  it("related score commands pair 0", () => {
    const target = makeEntry({
      category: "commands",
      slug: "commands-target-0",
      tags: ["shared-0", "tag-a"],
      keywords: ["kw-0"],
      platforms: ["claude-code"],
    });
    const candidate = makeEntry({
      category: "commands",
      slug: "commands-candidate-0",
      tags: ["shared-0", "tag-b"],
      keywords: ["kw-0", "extra"],
      platforms: ["claude-code", "cursor"],
      repoUrl: "https://github.com/org/repo-0",
    });
    const related = scoreRelatedEntry(target, candidate);
    if (related) {
      expect(related.score).toBeGreaterThan(0);
      expect(related.reasons.length).toBeGreaterThan(0);
    }
  });
  it("related score commands pair 1", () => {
    const target = makeEntry({
      category: "commands",
      slug: "commands-target-1",
      tags: ["shared-1", "tag-a"],
      keywords: ["kw-1"],
      platforms: ["claude-code"],
    });
    const candidate = makeEntry({
      category: "guides",
      slug: "commands-candidate-1",
      tags: ["shared-1", "tag-b"],
      keywords: ["kw-1", "extra"],
      platforms: ["claude-code", "cursor"],
      repoUrl: "https://github.com/org/repo-1",
    });
    const related = scoreRelatedEntry(target, candidate);
    if (related) {
      expect(related.score).toBeGreaterThan(0);
      expect(related.reasons.length).toBeGreaterThan(0);
    }
  });
  it("related score commands pair 2", () => {
    const target = makeEntry({
      category: "commands",
      slug: "commands-target-2",
      tags: ["shared-2", "tag-a"],
      keywords: ["kw-2"],
      platforms: ["claude-code"],
    });
    const candidate = makeEntry({
      category: "commands",
      slug: "commands-candidate-2",
      tags: ["shared-2", "tag-b"],
      keywords: ["kw-2", "extra"],
      platforms: ["claude-code", "cursor"],
      repoUrl: "https://github.com/org/repo-2",
    });
    const related = scoreRelatedEntry(target, candidate);
    if (related) {
      expect(related.score).toBeGreaterThan(0);
      expect(related.reasons.length).toBeGreaterThan(0);
    }
  });
  it("related score commands pair 3", () => {
    const target = makeEntry({
      category: "commands",
      slug: "commands-target-3",
      tags: ["shared-3", "tag-a"],
      keywords: ["kw-3"],
      platforms: ["claude-code"],
    });
    const candidate = makeEntry({
      category: "guides",
      slug: "commands-candidate-3",
      tags: ["shared-3", "tag-b"],
      keywords: ["kw-3", "extra"],
      platforms: ["claude-code", "cursor"],
      repoUrl: "https://github.com/org/repo-3",
    });
    const related = scoreRelatedEntry(target, candidate);
    if (related) {
      expect(related.score).toBeGreaterThan(0);
      expect(related.reasons.length).toBeGreaterThan(0);
    }
  });
  it("related score commands pair 4", () => {
    const target = makeEntry({
      category: "commands",
      slug: "commands-target-4",
      tags: ["shared-4", "tag-a"],
      keywords: ["kw-4"],
      platforms: ["claude-code"],
    });
    const candidate = makeEntry({
      category: "commands",
      slug: "commands-candidate-4",
      tags: ["shared-4", "tag-b"],
      keywords: ["kw-4", "extra"],
      platforms: ["claude-code", "cursor"],
      repoUrl: "https://github.com/org/repo-4",
    });
    const related = scoreRelatedEntry(target, candidate);
    if (related) {
      expect(related.score).toBeGreaterThan(0);
      expect(related.reasons.length).toBeGreaterThan(0);
    }
  });
  it("related score statuslines pair 0", () => {
    const target = makeEntry({
      category: "statuslines",
      slug: "statuslines-target-0",
      tags: ["shared-0", "tag-a"],
      keywords: ["kw-0"],
      platforms: ["claude-code"],
    });
    const candidate = makeEntry({
      category: "statuslines",
      slug: "statuslines-candidate-0",
      tags: ["shared-0", "tag-b"],
      keywords: ["kw-0", "extra"],
      platforms: ["claude-code", "cursor"],
      repoUrl: "https://github.com/org/repo-0",
    });
    const related = scoreRelatedEntry(target, candidate);
    if (related) {
      expect(related.score).toBeGreaterThan(0);
      expect(related.reasons.length).toBeGreaterThan(0);
    }
  });
  it("related score statuslines pair 1", () => {
    const target = makeEntry({
      category: "statuslines",
      slug: "statuslines-target-1",
      tags: ["shared-1", "tag-a"],
      keywords: ["kw-1"],
      platforms: ["claude-code"],
    });
    const candidate = makeEntry({
      category: "guides",
      slug: "statuslines-candidate-1",
      tags: ["shared-1", "tag-b"],
      keywords: ["kw-1", "extra"],
      platforms: ["claude-code", "cursor"],
      repoUrl: "https://github.com/org/repo-1",
    });
    const related = scoreRelatedEntry(target, candidate);
    if (related) {
      expect(related.score).toBeGreaterThan(0);
      expect(related.reasons.length).toBeGreaterThan(0);
    }
  });
  it("related score statuslines pair 2", () => {
    const target = makeEntry({
      category: "statuslines",
      slug: "statuslines-target-2",
      tags: ["shared-2", "tag-a"],
      keywords: ["kw-2"],
      platforms: ["claude-code"],
    });
    const candidate = makeEntry({
      category: "statuslines",
      slug: "statuslines-candidate-2",
      tags: ["shared-2", "tag-b"],
      keywords: ["kw-2", "extra"],
      platforms: ["claude-code", "cursor"],
      repoUrl: "https://github.com/org/repo-2",
    });
    const related = scoreRelatedEntry(target, candidate);
    if (related) {
      expect(related.score).toBeGreaterThan(0);
      expect(related.reasons.length).toBeGreaterThan(0);
    }
  });
  it("related score statuslines pair 3", () => {
    const target = makeEntry({
      category: "statuslines",
      slug: "statuslines-target-3",
      tags: ["shared-3", "tag-a"],
      keywords: ["kw-3"],
      platforms: ["claude-code"],
    });
    const candidate = makeEntry({
      category: "guides",
      slug: "statuslines-candidate-3",
      tags: ["shared-3", "tag-b"],
      keywords: ["kw-3", "extra"],
      platforms: ["claude-code", "cursor"],
      repoUrl: "https://github.com/org/repo-3",
    });
    const related = scoreRelatedEntry(target, candidate);
    if (related) {
      expect(related.score).toBeGreaterThan(0);
      expect(related.reasons.length).toBeGreaterThan(0);
    }
  });
  it("related score statuslines pair 4", () => {
    const target = makeEntry({
      category: "statuslines",
      slug: "statuslines-target-4",
      tags: ["shared-4", "tag-a"],
      keywords: ["kw-4"],
      platforms: ["claude-code"],
    });
    const candidate = makeEntry({
      category: "statuslines",
      slug: "statuslines-candidate-4",
      tags: ["shared-4", "tag-b"],
      keywords: ["kw-4", "extra"],
      platforms: ["claude-code", "cursor"],
      repoUrl: "https://github.com/org/repo-4",
    });
    const related = scoreRelatedEntry(target, candidate);
    if (related) {
      expect(related.score).toBeGreaterThan(0);
      expect(related.reasons.length).toBeGreaterThan(0);
    }
  });
  it("related score guides pair 0", () => {
    const target = makeEntry({
      category: "guides",
      slug: "guides-target-0",
      tags: ["shared-0", "tag-a"],
      keywords: ["kw-0"],
      platforms: ["claude-code"],
    });
    const candidate = makeEntry({
      category: "guides",
      slug: "guides-candidate-0",
      tags: ["shared-0", "tag-b"],
      keywords: ["kw-0", "extra"],
      platforms: ["claude-code", "cursor"],
      repoUrl: "https://github.com/org/repo-0",
    });
    const related = scoreRelatedEntry(target, candidate);
    if (related) {
      expect(related.score).toBeGreaterThan(0);
      expect(related.reasons.length).toBeGreaterThan(0);
    }
  });
  it("related score guides pair 1", () => {
    const target = makeEntry({
      category: "guides",
      slug: "guides-target-1",
      tags: ["shared-1", "tag-a"],
      keywords: ["kw-1"],
      platforms: ["claude-code"],
    });
    const candidate = makeEntry({
      category: "guides",
      slug: "guides-candidate-1",
      tags: ["shared-1", "tag-b"],
      keywords: ["kw-1", "extra"],
      platforms: ["claude-code", "cursor"],
      repoUrl: "https://github.com/org/repo-1",
    });
    const related = scoreRelatedEntry(target, candidate);
    if (related) {
      expect(related.score).toBeGreaterThan(0);
      expect(related.reasons.length).toBeGreaterThan(0);
    }
  });
  it("related score guides pair 2", () => {
    const target = makeEntry({
      category: "guides",
      slug: "guides-target-2",
      tags: ["shared-2", "tag-a"],
      keywords: ["kw-2"],
      platforms: ["claude-code"],
    });
    const candidate = makeEntry({
      category: "guides",
      slug: "guides-candidate-2",
      tags: ["shared-2", "tag-b"],
      keywords: ["kw-2", "extra"],
      platforms: ["claude-code", "cursor"],
      repoUrl: "https://github.com/org/repo-2",
    });
    const related = scoreRelatedEntry(target, candidate);
    if (related) {
      expect(related.score).toBeGreaterThan(0);
      expect(related.reasons.length).toBeGreaterThan(0);
    }
  });
  it("related score guides pair 3", () => {
    const target = makeEntry({
      category: "guides",
      slug: "guides-target-3",
      tags: ["shared-3", "tag-a"],
      keywords: ["kw-3"],
      platforms: ["claude-code"],
    });
    const candidate = makeEntry({
      category: "guides",
      slug: "guides-candidate-3",
      tags: ["shared-3", "tag-b"],
      keywords: ["kw-3", "extra"],
      platforms: ["claude-code", "cursor"],
      repoUrl: "https://github.com/org/repo-3",
    });
    const related = scoreRelatedEntry(target, candidate);
    if (related) {
      expect(related.score).toBeGreaterThan(0);
      expect(related.reasons.length).toBeGreaterThan(0);
    }
  });
  it("related score guides pair 4", () => {
    const target = makeEntry({
      category: "guides",
      slug: "guides-target-4",
      tags: ["shared-4", "tag-a"],
      keywords: ["kw-4"],
      platforms: ["claude-code"],
    });
    const candidate = makeEntry({
      category: "guides",
      slug: "guides-candidate-4",
      tags: ["shared-4", "tag-b"],
      keywords: ["kw-4", "extra"],
      platforms: ["claude-code", "cursor"],
      repoUrl: "https://github.com/org/repo-4",
    });
    const related = scoreRelatedEntry(target, candidate);
    if (related) {
      expect(related.score).toBeGreaterThan(0);
      expect(related.reasons.length).toBeGreaterThan(0);
    }
  });
  it("related score plugins pair 0", () => {
    const target = makeEntry({
      category: "plugins",
      slug: "plugins-target-0",
      tags: ["shared-0", "tag-a"],
      keywords: ["kw-0"],
      platforms: ["claude-code"],
    });
    const candidate = makeEntry({
      category: "plugins",
      slug: "plugins-candidate-0",
      tags: ["shared-0", "tag-b"],
      keywords: ["kw-0", "extra"],
      platforms: ["claude-code", "cursor"],
      repoUrl: "https://github.com/org/repo-0",
    });
    const related = scoreRelatedEntry(target, candidate);
    if (related) {
      expect(related.score).toBeGreaterThan(0);
      expect(related.reasons.length).toBeGreaterThan(0);
    }
  });
  it("related score plugins pair 1", () => {
    const target = makeEntry({
      category: "plugins",
      slug: "plugins-target-1",
      tags: ["shared-1", "tag-a"],
      keywords: ["kw-1"],
      platforms: ["claude-code"],
    });
    const candidate = makeEntry({
      category: "guides",
      slug: "plugins-candidate-1",
      tags: ["shared-1", "tag-b"],
      keywords: ["kw-1", "extra"],
      platforms: ["claude-code", "cursor"],
      repoUrl: "https://github.com/org/repo-1",
    });
    const related = scoreRelatedEntry(target, candidate);
    if (related) {
      expect(related.score).toBeGreaterThan(0);
      expect(related.reasons.length).toBeGreaterThan(0);
    }
  });
  it("related score plugins pair 2", () => {
    const target = makeEntry({
      category: "plugins",
      slug: "plugins-target-2",
      tags: ["shared-2", "tag-a"],
      keywords: ["kw-2"],
      platforms: ["claude-code"],
    });
    const candidate = makeEntry({
      category: "plugins",
      slug: "plugins-candidate-2",
      tags: ["shared-2", "tag-b"],
      keywords: ["kw-2", "extra"],
      platforms: ["claude-code", "cursor"],
      repoUrl: "https://github.com/org/repo-2",
    });
    const related = scoreRelatedEntry(target, candidate);
    if (related) {
      expect(related.score).toBeGreaterThan(0);
      expect(related.reasons.length).toBeGreaterThan(0);
    }
  });
  it("related score plugins pair 3", () => {
    const target = makeEntry({
      category: "plugins",
      slug: "plugins-target-3",
      tags: ["shared-3", "tag-a"],
      keywords: ["kw-3"],
      platforms: ["claude-code"],
    });
    const candidate = makeEntry({
      category: "guides",
      slug: "plugins-candidate-3",
      tags: ["shared-3", "tag-b"],
      keywords: ["kw-3", "extra"],
      platforms: ["claude-code", "cursor"],
      repoUrl: "https://github.com/org/repo-3",
    });
    const related = scoreRelatedEntry(target, candidate);
    if (related) {
      expect(related.score).toBeGreaterThan(0);
      expect(related.reasons.length).toBeGreaterThan(0);
    }
  });
  it("related score plugins pair 4", () => {
    const target = makeEntry({
      category: "plugins",
      slug: "plugins-target-4",
      tags: ["shared-4", "tag-a"],
      keywords: ["kw-4"],
      platforms: ["claude-code"],
    });
    const candidate = makeEntry({
      category: "plugins",
      slug: "plugins-candidate-4",
      tags: ["shared-4", "tag-b"],
      keywords: ["kw-4", "extra"],
      platforms: ["claude-code", "cursor"],
      repoUrl: "https://github.com/org/repo-4",
    });
    const related = scoreRelatedEntry(target, candidate);
    if (related) {
      expect(related.score).toBeGreaterThan(0);
      expect(related.reasons.length).toBeGreaterThan(0);
    }
  });

  describe("registry-projection-lib exhaustive projection matrix", () => {
    it("projection mcp/claude-code/v0", () => {
      const entry = {
        category: "mcp",
        slug: "mcp-claude-code-0",
        title: "mcp 0",
        description: "desc",
        tags: ["t-0", "mcp"],
        keywords: ["k-0"],
        platforms: ["claude-code"],
        repoUrl: "https://github.com/org/mcp-0",
        dateAdded: "2026-01-01",
        safetyNotes: ["note"],
        privacyNotes: ["priv"],
      };
      const search = toSearchResult(entry, { score: 10, reasons: ["r0"] });
      const summary = toEntrySummary(entry);
      expect(search.key).toBe("mcp:mcp-claude-code-0");
      expect(search.searchScore).toBe(10);
      expect(entryUpdatedAt(entry)).toMatch(/^2026-/);
      const other = { ...entry, slug: "other-0", tags: ["t-0"] };
      const related = scoreRelatedEntry(entry, other);
      expect(related?.score).toBeGreaterThan(0);
    });
    it("projection mcp/claude-code/v1", () => {
      const entry = {
        category: "mcp",
        slug: "mcp-claude-code-1",
        title: "mcp 1",
        description: "desc",
        tags: ["t-1", "mcp"],
        keywords: ["k-1"],
        platforms: ["claude-code"],
        repoUrl: "https://github.com/org/mcp-1",
        dateAdded: "2026-01-02",
        safetyNotes: ["note"],
        privacyNotes: ["priv"],
      };
      const search = toSearchResult(entry, { score: 11, reasons: ["r1"] });
      const summary = toEntrySummary(entry);
      expect(search.key).toBe("mcp:mcp-claude-code-1");
      expect(search.searchScore).toBe(11);
      expect(entryUpdatedAt(entry)).toMatch(/^2026-/);
      const other = { ...entry, slug: "other-1", tags: ["t-1"] };
      const related = scoreRelatedEntry(entry, other);
      expect(related?.score).toBeGreaterThan(0);
    });
    it("projection mcp/claude-code/v2", () => {
      const entry = {
        category: "mcp",
        slug: "mcp-claude-code-2",
        title: "mcp 2",
        description: "desc",
        tags: ["t-2", "mcp"],
        keywords: ["k-2"],
        platforms: ["claude-code"],
        repoUrl: "https://github.com/org/mcp-2",
        dateAdded: "2026-01-03",
        safetyNotes: ["note"],
        privacyNotes: ["priv"],
      };
      const search = toSearchResult(entry, { score: 12, reasons: ["r2"] });
      const summary = toEntrySummary(entry);
      expect(search.key).toBe("mcp:mcp-claude-code-2");
      expect(search.searchScore).toBe(12);
      expect(entryUpdatedAt(entry)).toMatch(/^2026-/);
      const other = { ...entry, slug: "other-2", tags: ["t-2"] };
      const related = scoreRelatedEntry(entry, other);
      expect(related?.score).toBeGreaterThan(0);
    });
    it("projection mcp/cursor/v0", () => {
      const entry = {
        category: "mcp",
        slug: "mcp-cursor-0",
        title: "mcp 0",
        description: "desc",
        tags: ["t-0", "mcp"],
        keywords: ["k-0"],
        platforms: ["cursor"],
        repoUrl: "https://github.com/org/mcp-0",
        dateAdded: "2026-01-01",
        safetyNotes: ["note"],
        privacyNotes: ["priv"],
      };
      const search = toSearchResult(entry, { score: 10, reasons: ["r0"] });
      const summary = toEntrySummary(entry);
      expect(search.key).toBe("mcp:mcp-cursor-0");
      expect(search.searchScore).toBe(10);
      expect(entryUpdatedAt(entry)).toMatch(/^2026-/);
      const other = { ...entry, slug: "other-0", tags: ["t-0"] };
      const related = scoreRelatedEntry(entry, other);
      expect(related?.score).toBeGreaterThan(0);
    });
    it("projection mcp/cursor/v1", () => {
      const entry = {
        category: "mcp",
        slug: "mcp-cursor-1",
        title: "mcp 1",
        description: "desc",
        tags: ["t-1", "mcp"],
        keywords: ["k-1"],
        platforms: ["cursor"],
        repoUrl: "https://github.com/org/mcp-1",
        dateAdded: "2026-01-02",
        safetyNotes: ["note"],
        privacyNotes: ["priv"],
      };
      const search = toSearchResult(entry, { score: 11, reasons: ["r1"] });
      const summary = toEntrySummary(entry);
      expect(search.key).toBe("mcp:mcp-cursor-1");
      expect(search.searchScore).toBe(11);
      expect(entryUpdatedAt(entry)).toMatch(/^2026-/);
      const other = { ...entry, slug: "other-1", tags: ["t-1"] };
      const related = scoreRelatedEntry(entry, other);
      expect(related?.score).toBeGreaterThan(0);
    });
    it("projection mcp/cursor/v2", () => {
      const entry = {
        category: "mcp",
        slug: "mcp-cursor-2",
        title: "mcp 2",
        description: "desc",
        tags: ["t-2", "mcp"],
        keywords: ["k-2"],
        platforms: ["cursor"],
        repoUrl: "https://github.com/org/mcp-2",
        dateAdded: "2026-01-03",
        safetyNotes: ["note"],
        privacyNotes: ["priv"],
      };
      const search = toSearchResult(entry, { score: 12, reasons: ["r2"] });
      const summary = toEntrySummary(entry);
      expect(search.key).toBe("mcp:mcp-cursor-2");
      expect(search.searchScore).toBe(12);
      expect(entryUpdatedAt(entry)).toMatch(/^2026-/);
      const other = { ...entry, slug: "other-2", tags: ["t-2"] };
      const related = scoreRelatedEntry(entry, other);
      expect(related?.score).toBeGreaterThan(0);
    });
    it("projection mcp/codex/v0", () => {
      const entry = {
        category: "mcp",
        slug: "mcp-codex-0",
        title: "mcp 0",
        description: "desc",
        tags: ["t-0", "mcp"],
        keywords: ["k-0"],
        platforms: ["codex"],
        repoUrl: "https://github.com/org/mcp-0",
        dateAdded: "2026-01-01",
        safetyNotes: ["note"],
        privacyNotes: ["priv"],
      };
      const search = toSearchResult(entry, { score: 10, reasons: ["r0"] });
      const summary = toEntrySummary(entry);
      expect(search.key).toBe("mcp:mcp-codex-0");
      expect(search.searchScore).toBe(10);
      expect(entryUpdatedAt(entry)).toMatch(/^2026-/);
      const other = { ...entry, slug: "other-0", tags: ["t-0"] };
      const related = scoreRelatedEntry(entry, other);
      expect(related?.score).toBeGreaterThan(0);
    });
    it("projection mcp/codex/v1", () => {
      const entry = {
        category: "mcp",
        slug: "mcp-codex-1",
        title: "mcp 1",
        description: "desc",
        tags: ["t-1", "mcp"],
        keywords: ["k-1"],
        platforms: ["codex"],
        repoUrl: "https://github.com/org/mcp-1",
        dateAdded: "2026-01-02",
        safetyNotes: ["note"],
        privacyNotes: ["priv"],
      };
      const search = toSearchResult(entry, { score: 11, reasons: ["r1"] });
      const summary = toEntrySummary(entry);
      expect(search.key).toBe("mcp:mcp-codex-1");
      expect(search.searchScore).toBe(11);
      expect(entryUpdatedAt(entry)).toMatch(/^2026-/);
      const other = { ...entry, slug: "other-1", tags: ["t-1"] };
      const related = scoreRelatedEntry(entry, other);
      expect(related?.score).toBeGreaterThan(0);
    });
    it("projection mcp/codex/v2", () => {
      const entry = {
        category: "mcp",
        slug: "mcp-codex-2",
        title: "mcp 2",
        description: "desc",
        tags: ["t-2", "mcp"],
        keywords: ["k-2"],
        platforms: ["codex"],
        repoUrl: "https://github.com/org/mcp-2",
        dateAdded: "2026-01-03",
        safetyNotes: ["note"],
        privacyNotes: ["priv"],
      };
      const search = toSearchResult(entry, { score: 12, reasons: ["r2"] });
      const summary = toEntrySummary(entry);
      expect(search.key).toBe("mcp:mcp-codex-2");
      expect(search.searchScore).toBe(12);
      expect(entryUpdatedAt(entry)).toMatch(/^2026-/);
      const other = { ...entry, slug: "other-2", tags: ["t-2"] };
      const related = scoreRelatedEntry(entry, other);
      expect(related?.score).toBeGreaterThan(0);
    });
    it("projection mcp/windsurf/v0", () => {
      const entry = {
        category: "mcp",
        slug: "mcp-windsurf-0",
        title: "mcp 0",
        description: "desc",
        tags: ["t-0", "mcp"],
        keywords: ["k-0"],
        platforms: ["windsurf"],
        repoUrl: "https://github.com/org/mcp-0",
        dateAdded: "2026-01-01",
        safetyNotes: ["note"],
        privacyNotes: ["priv"],
      };
      const search = toSearchResult(entry, { score: 10, reasons: ["r0"] });
      const summary = toEntrySummary(entry);
      expect(search.key).toBe("mcp:mcp-windsurf-0");
      expect(search.searchScore).toBe(10);
      expect(entryUpdatedAt(entry)).toMatch(/^2026-/);
      const other = { ...entry, slug: "other-0", tags: ["t-0"] };
      const related = scoreRelatedEntry(entry, other);
      expect(related?.score).toBeGreaterThan(0);
    });
    it("projection mcp/windsurf/v1", () => {
      const entry = {
        category: "mcp",
        slug: "mcp-windsurf-1",
        title: "mcp 1",
        description: "desc",
        tags: ["t-1", "mcp"],
        keywords: ["k-1"],
        platforms: ["windsurf"],
        repoUrl: "https://github.com/org/mcp-1",
        dateAdded: "2026-01-02",
        safetyNotes: ["note"],
        privacyNotes: ["priv"],
      };
      const search = toSearchResult(entry, { score: 11, reasons: ["r1"] });
      const summary = toEntrySummary(entry);
      expect(search.key).toBe("mcp:mcp-windsurf-1");
      expect(search.searchScore).toBe(11);
      expect(entryUpdatedAt(entry)).toMatch(/^2026-/);
      const other = { ...entry, slug: "other-1", tags: ["t-1"] };
      const related = scoreRelatedEntry(entry, other);
      expect(related?.score).toBeGreaterThan(0);
    });
    it("projection mcp/windsurf/v2", () => {
      const entry = {
        category: "mcp",
        slug: "mcp-windsurf-2",
        title: "mcp 2",
        description: "desc",
        tags: ["t-2", "mcp"],
        keywords: ["k-2"],
        platforms: ["windsurf"],
        repoUrl: "https://github.com/org/mcp-2",
        dateAdded: "2026-01-03",
        safetyNotes: ["note"],
        privacyNotes: ["priv"],
      };
      const search = toSearchResult(entry, { score: 12, reasons: ["r2"] });
      const summary = toEntrySummary(entry);
      expect(search.key).toBe("mcp:mcp-windsurf-2");
      expect(search.searchScore).toBe(12);
      expect(entryUpdatedAt(entry)).toMatch(/^2026-/);
      const other = { ...entry, slug: "other-2", tags: ["t-2"] };
      const related = scoreRelatedEntry(entry, other);
      expect(related?.score).toBeGreaterThan(0);
    });
    it("projection mcp/vscode/v0", () => {
      const entry = {
        category: "mcp",
        slug: "mcp-vscode-0",
        title: "mcp 0",
        description: "desc",
        tags: ["t-0", "mcp"],
        keywords: ["k-0"],
        platforms: ["vscode"],
        repoUrl: "https://github.com/org/mcp-0",
        dateAdded: "2026-01-01",
        safetyNotes: ["note"],
        privacyNotes: ["priv"],
      };
      const search = toSearchResult(entry, { score: 10, reasons: ["r0"] });
      const summary = toEntrySummary(entry);
      expect(search.key).toBe("mcp:mcp-vscode-0");
      expect(search.searchScore).toBe(10);
      expect(entryUpdatedAt(entry)).toMatch(/^2026-/);
      const other = { ...entry, slug: "other-0", tags: ["t-0"] };
      const related = scoreRelatedEntry(entry, other);
      expect(related?.score).toBeGreaterThan(0);
    });
    it("projection mcp/vscode/v1", () => {
      const entry = {
        category: "mcp",
        slug: "mcp-vscode-1",
        title: "mcp 1",
        description: "desc",
        tags: ["t-1", "mcp"],
        keywords: ["k-1"],
        platforms: ["vscode"],
        repoUrl: "https://github.com/org/mcp-1",
        dateAdded: "2026-01-02",
        safetyNotes: ["note"],
        privacyNotes: ["priv"],
      };
      const search = toSearchResult(entry, { score: 11, reasons: ["r1"] });
      const summary = toEntrySummary(entry);
      expect(search.key).toBe("mcp:mcp-vscode-1");
      expect(search.searchScore).toBe(11);
      expect(entryUpdatedAt(entry)).toMatch(/^2026-/);
      const other = { ...entry, slug: "other-1", tags: ["t-1"] };
      const related = scoreRelatedEntry(entry, other);
      expect(related?.score).toBeGreaterThan(0);
    });
    it("projection mcp/vscode/v2", () => {
      const entry = {
        category: "mcp",
        slug: "mcp-vscode-2",
        title: "mcp 2",
        description: "desc",
        tags: ["t-2", "mcp"],
        keywords: ["k-2"],
        platforms: ["vscode"],
        repoUrl: "https://github.com/org/mcp-2",
        dateAdded: "2026-01-03",
        safetyNotes: ["note"],
        privacyNotes: ["priv"],
      };
      const search = toSearchResult(entry, { score: 12, reasons: ["r2"] });
      const summary = toEntrySummary(entry);
      expect(search.key).toBe("mcp:mcp-vscode-2");
      expect(search.searchScore).toBe(12);
      expect(entryUpdatedAt(entry)).toMatch(/^2026-/);
      const other = { ...entry, slug: "other-2", tags: ["t-2"] };
      const related = scoreRelatedEntry(entry, other);
      expect(related?.score).toBeGreaterThan(0);
    });
    it("projection mcp/jetbrains/v0", () => {
      const entry = {
        category: "mcp",
        slug: "mcp-jetbrains-0",
        title: "mcp 0",
        description: "desc",
        tags: ["t-0", "mcp"],
        keywords: ["k-0"],
        platforms: ["jetbrains"],
        repoUrl: "https://github.com/org/mcp-0",
        dateAdded: "2026-01-01",
        safetyNotes: ["note"],
        privacyNotes: ["priv"],
      };
      const search = toSearchResult(entry, { score: 10, reasons: ["r0"] });
      const summary = toEntrySummary(entry);
      expect(search.key).toBe("mcp:mcp-jetbrains-0");
      expect(search.searchScore).toBe(10);
      expect(entryUpdatedAt(entry)).toMatch(/^2026-/);
      const other = { ...entry, slug: "other-0", tags: ["t-0"] };
      const related = scoreRelatedEntry(entry, other);
      expect(related?.score).toBeGreaterThan(0);
    });
    it("projection mcp/jetbrains/v1", () => {
      const entry = {
        category: "mcp",
        slug: "mcp-jetbrains-1",
        title: "mcp 1",
        description: "desc",
        tags: ["t-1", "mcp"],
        keywords: ["k-1"],
        platforms: ["jetbrains"],
        repoUrl: "https://github.com/org/mcp-1",
        dateAdded: "2026-01-02",
        safetyNotes: ["note"],
        privacyNotes: ["priv"],
      };
      const search = toSearchResult(entry, { score: 11, reasons: ["r1"] });
      const summary = toEntrySummary(entry);
      expect(search.key).toBe("mcp:mcp-jetbrains-1");
      expect(search.searchScore).toBe(11);
      expect(entryUpdatedAt(entry)).toMatch(/^2026-/);
      const other = { ...entry, slug: "other-1", tags: ["t-1"] };
      const related = scoreRelatedEntry(entry, other);
      expect(related?.score).toBeGreaterThan(0);
    });
    it("projection mcp/jetbrains/v2", () => {
      const entry = {
        category: "mcp",
        slug: "mcp-jetbrains-2",
        title: "mcp 2",
        description: "desc",
        tags: ["t-2", "mcp"],
        keywords: ["k-2"],
        platforms: ["jetbrains"],
        repoUrl: "https://github.com/org/mcp-2",
        dateAdded: "2026-01-03",
        safetyNotes: ["note"],
        privacyNotes: ["priv"],
      };
      const search = toSearchResult(entry, { score: 12, reasons: ["r2"] });
      const summary = toEntrySummary(entry);
      expect(search.key).toBe("mcp:mcp-jetbrains-2");
      expect(search.searchScore).toBe(12);
      expect(entryUpdatedAt(entry)).toMatch(/^2026-/);
      const other = { ...entry, slug: "other-2", tags: ["t-2"] };
      const related = scoreRelatedEntry(entry, other);
      expect(related?.score).toBeGreaterThan(0);
    });
    it("projection skills/claude-code/v0", () => {
      const entry = {
        category: "skills",
        slug: "skills-claude-code-0",
        title: "skills 0",
        description: "desc",
        tags: ["t-0", "skills"],
        keywords: ["k-0"],
        platforms: ["claude-code"],
        repoUrl: "https://github.com/org/skills-0",
        dateAdded: "2026-01-01",
        safetyNotes: ["note"],
        privacyNotes: ["priv"],
      };
      const search = toSearchResult(entry, { score: 10, reasons: ["r0"] });
      const summary = toEntrySummary(entry);
      expect(search.key).toBe("skills:skills-claude-code-0");
      expect(search.searchScore).toBe(10);
      expect(entryUpdatedAt(entry)).toMatch(/^2026-/);
      const other = { ...entry, slug: "other-0", tags: ["t-0"] };
      const related = scoreRelatedEntry(entry, other);
      expect(related?.score).toBeGreaterThan(0);
    });
    it("projection skills/claude-code/v1", () => {
      const entry = {
        category: "skills",
        slug: "skills-claude-code-1",
        title: "skills 1",
        description: "desc",
        tags: ["t-1", "skills"],
        keywords: ["k-1"],
        platforms: ["claude-code"],
        repoUrl: "https://github.com/org/skills-1",
        dateAdded: "2026-01-02",
        safetyNotes: ["note"],
        privacyNotes: ["priv"],
      };
      const search = toSearchResult(entry, { score: 11, reasons: ["r1"] });
      const summary = toEntrySummary(entry);
      expect(search.key).toBe("skills:skills-claude-code-1");
      expect(search.searchScore).toBe(11);
      expect(entryUpdatedAt(entry)).toMatch(/^2026-/);
      const other = { ...entry, slug: "other-1", tags: ["t-1"] };
      const related = scoreRelatedEntry(entry, other);
      expect(related?.score).toBeGreaterThan(0);
    });
    it("projection skills/claude-code/v2", () => {
      const entry = {
        category: "skills",
        slug: "skills-claude-code-2",
        title: "skills 2",
        description: "desc",
        tags: ["t-2", "skills"],
        keywords: ["k-2"],
        platforms: ["claude-code"],
        repoUrl: "https://github.com/org/skills-2",
        dateAdded: "2026-01-03",
        safetyNotes: ["note"],
        privacyNotes: ["priv"],
      };
      const search = toSearchResult(entry, { score: 12, reasons: ["r2"] });
      const summary = toEntrySummary(entry);
      expect(search.key).toBe("skills:skills-claude-code-2");
      expect(search.searchScore).toBe(12);
      expect(entryUpdatedAt(entry)).toMatch(/^2026-/);
      const other = { ...entry, slug: "other-2", tags: ["t-2"] };
      const related = scoreRelatedEntry(entry, other);
      expect(related?.score).toBeGreaterThan(0);
    });
    it("projection skills/cursor/v0", () => {
      const entry = {
        category: "skills",
        slug: "skills-cursor-0",
        title: "skills 0",
        description: "desc",
        tags: ["t-0", "skills"],
        keywords: ["k-0"],
        platforms: ["cursor"],
        repoUrl: "https://github.com/org/skills-0",
        dateAdded: "2026-01-01",
        safetyNotes: ["note"],
        privacyNotes: ["priv"],
      };
      const search = toSearchResult(entry, { score: 10, reasons: ["r0"] });
      const summary = toEntrySummary(entry);
      expect(search.key).toBe("skills:skills-cursor-0");
      expect(search.searchScore).toBe(10);
      expect(entryUpdatedAt(entry)).toMatch(/^2026-/);
      const other = { ...entry, slug: "other-0", tags: ["t-0"] };
      const related = scoreRelatedEntry(entry, other);
      expect(related?.score).toBeGreaterThan(0);
    });
    it("projection skills/cursor/v1", () => {
      const entry = {
        category: "skills",
        slug: "skills-cursor-1",
        title: "skills 1",
        description: "desc",
        tags: ["t-1", "skills"],
        keywords: ["k-1"],
        platforms: ["cursor"],
        repoUrl: "https://github.com/org/skills-1",
        dateAdded: "2026-01-02",
        safetyNotes: ["note"],
        privacyNotes: ["priv"],
      };
      const search = toSearchResult(entry, { score: 11, reasons: ["r1"] });
      const summary = toEntrySummary(entry);
      expect(search.key).toBe("skills:skills-cursor-1");
      expect(search.searchScore).toBe(11);
      expect(entryUpdatedAt(entry)).toMatch(/^2026-/);
      const other = { ...entry, slug: "other-1", tags: ["t-1"] };
      const related = scoreRelatedEntry(entry, other);
      expect(related?.score).toBeGreaterThan(0);
    });
    it("projection skills/cursor/v2", () => {
      const entry = {
        category: "skills",
        slug: "skills-cursor-2",
        title: "skills 2",
        description: "desc",
        tags: ["t-2", "skills"],
        keywords: ["k-2"],
        platforms: ["cursor"],
        repoUrl: "https://github.com/org/skills-2",
        dateAdded: "2026-01-03",
        safetyNotes: ["note"],
        privacyNotes: ["priv"],
      };
      const search = toSearchResult(entry, { score: 12, reasons: ["r2"] });
      const summary = toEntrySummary(entry);
      expect(search.key).toBe("skills:skills-cursor-2");
      expect(search.searchScore).toBe(12);
      expect(entryUpdatedAt(entry)).toMatch(/^2026-/);
      const other = { ...entry, slug: "other-2", tags: ["t-2"] };
      const related = scoreRelatedEntry(entry, other);
      expect(related?.score).toBeGreaterThan(0);
    });
    it("projection skills/codex/v0", () => {
      const entry = {
        category: "skills",
        slug: "skills-codex-0",
        title: "skills 0",
        description: "desc",
        tags: ["t-0", "skills"],
        keywords: ["k-0"],
        platforms: ["codex"],
        repoUrl: "https://github.com/org/skills-0",
        dateAdded: "2026-01-01",
        safetyNotes: ["note"],
        privacyNotes: ["priv"],
      };
      const search = toSearchResult(entry, { score: 10, reasons: ["r0"] });
      const summary = toEntrySummary(entry);
      expect(search.key).toBe("skills:skills-codex-0");
      expect(search.searchScore).toBe(10);
      expect(entryUpdatedAt(entry)).toMatch(/^2026-/);
      const other = { ...entry, slug: "other-0", tags: ["t-0"] };
      const related = scoreRelatedEntry(entry, other);
      expect(related?.score).toBeGreaterThan(0);
    });
    it("projection skills/codex/v1", () => {
      const entry = {
        category: "skills",
        slug: "skills-codex-1",
        title: "skills 1",
        description: "desc",
        tags: ["t-1", "skills"],
        keywords: ["k-1"],
        platforms: ["codex"],
        repoUrl: "https://github.com/org/skills-1",
        dateAdded: "2026-01-02",
        safetyNotes: ["note"],
        privacyNotes: ["priv"],
      };
      const search = toSearchResult(entry, { score: 11, reasons: ["r1"] });
      const summary = toEntrySummary(entry);
      expect(search.key).toBe("skills:skills-codex-1");
      expect(search.searchScore).toBe(11);
      expect(entryUpdatedAt(entry)).toMatch(/^2026-/);
      const other = { ...entry, slug: "other-1", tags: ["t-1"] };
      const related = scoreRelatedEntry(entry, other);
      expect(related?.score).toBeGreaterThan(0);
    });
    it("projection skills/codex/v2", () => {
      const entry = {
        category: "skills",
        slug: "skills-codex-2",
        title: "skills 2",
        description: "desc",
        tags: ["t-2", "skills"],
        keywords: ["k-2"],
        platforms: ["codex"],
        repoUrl: "https://github.com/org/skills-2",
        dateAdded: "2026-01-03",
        safetyNotes: ["note"],
        privacyNotes: ["priv"],
      };
      const search = toSearchResult(entry, { score: 12, reasons: ["r2"] });
      const summary = toEntrySummary(entry);
      expect(search.key).toBe("skills:skills-codex-2");
      expect(search.searchScore).toBe(12);
      expect(entryUpdatedAt(entry)).toMatch(/^2026-/);
      const other = { ...entry, slug: "other-2", tags: ["t-2"] };
      const related = scoreRelatedEntry(entry, other);
      expect(related?.score).toBeGreaterThan(0);
    });
    it("projection skills/windsurf/v0", () => {
      const entry = {
        category: "skills",
        slug: "skills-windsurf-0",
        title: "skills 0",
        description: "desc",
        tags: ["t-0", "skills"],
        keywords: ["k-0"],
        platforms: ["windsurf"],
        repoUrl: "https://github.com/org/skills-0",
        dateAdded: "2026-01-01",
        safetyNotes: ["note"],
        privacyNotes: ["priv"],
      };
      const search = toSearchResult(entry, { score: 10, reasons: ["r0"] });
      const summary = toEntrySummary(entry);
      expect(search.key).toBe("skills:skills-windsurf-0");
      expect(search.searchScore).toBe(10);
      expect(entryUpdatedAt(entry)).toMatch(/^2026-/);
      const other = { ...entry, slug: "other-0", tags: ["t-0"] };
      const related = scoreRelatedEntry(entry, other);
      expect(related?.score).toBeGreaterThan(0);
    });
    it("projection skills/windsurf/v1", () => {
      const entry = {
        category: "skills",
        slug: "skills-windsurf-1",
        title: "skills 1",
        description: "desc",
        tags: ["t-1", "skills"],
        keywords: ["k-1"],
        platforms: ["windsurf"],
        repoUrl: "https://github.com/org/skills-1",
        dateAdded: "2026-01-02",
        safetyNotes: ["note"],
        privacyNotes: ["priv"],
      };
      const search = toSearchResult(entry, { score: 11, reasons: ["r1"] });
      const summary = toEntrySummary(entry);
      expect(search.key).toBe("skills:skills-windsurf-1");
      expect(search.searchScore).toBe(11);
      expect(entryUpdatedAt(entry)).toMatch(/^2026-/);
      const other = { ...entry, slug: "other-1", tags: ["t-1"] };
      const related = scoreRelatedEntry(entry, other);
      expect(related?.score).toBeGreaterThan(0);
    });
    it("projection skills/windsurf/v2", () => {
      const entry = {
        category: "skills",
        slug: "skills-windsurf-2",
        title: "skills 2",
        description: "desc",
        tags: ["t-2", "skills"],
        keywords: ["k-2"],
        platforms: ["windsurf"],
        repoUrl: "https://github.com/org/skills-2",
        dateAdded: "2026-01-03",
        safetyNotes: ["note"],
        privacyNotes: ["priv"],
      };
      const search = toSearchResult(entry, { score: 12, reasons: ["r2"] });
      const summary = toEntrySummary(entry);
      expect(search.key).toBe("skills:skills-windsurf-2");
      expect(search.searchScore).toBe(12);
      expect(entryUpdatedAt(entry)).toMatch(/^2026-/);
      const other = { ...entry, slug: "other-2", tags: ["t-2"] };
      const related = scoreRelatedEntry(entry, other);
      expect(related?.score).toBeGreaterThan(0);
    });
    it("projection skills/vscode/v0", () => {
      const entry = {
        category: "skills",
        slug: "skills-vscode-0",
        title: "skills 0",
        description: "desc",
        tags: ["t-0", "skills"],
        keywords: ["k-0"],
        platforms: ["vscode"],
        repoUrl: "https://github.com/org/skills-0",
        dateAdded: "2026-01-01",
        safetyNotes: ["note"],
        privacyNotes: ["priv"],
      };
      const search = toSearchResult(entry, { score: 10, reasons: ["r0"] });
      const summary = toEntrySummary(entry);
      expect(search.key).toBe("skills:skills-vscode-0");
      expect(search.searchScore).toBe(10);
      expect(entryUpdatedAt(entry)).toMatch(/^2026-/);
      const other = { ...entry, slug: "other-0", tags: ["t-0"] };
      const related = scoreRelatedEntry(entry, other);
      expect(related?.score).toBeGreaterThan(0);
    });
    it("projection skills/vscode/v1", () => {
      const entry = {
        category: "skills",
        slug: "skills-vscode-1",
        title: "skills 1",
        description: "desc",
        tags: ["t-1", "skills"],
        keywords: ["k-1"],
        platforms: ["vscode"],
        repoUrl: "https://github.com/org/skills-1",
        dateAdded: "2026-01-02",
        safetyNotes: ["note"],
        privacyNotes: ["priv"],
      };
      const search = toSearchResult(entry, { score: 11, reasons: ["r1"] });
      const summary = toEntrySummary(entry);
      expect(search.key).toBe("skills:skills-vscode-1");
      expect(search.searchScore).toBe(11);
      expect(entryUpdatedAt(entry)).toMatch(/^2026-/);
      const other = { ...entry, slug: "other-1", tags: ["t-1"] };
      const related = scoreRelatedEntry(entry, other);
      expect(related?.score).toBeGreaterThan(0);
    });
    it("projection skills/vscode/v2", () => {
      const entry = {
        category: "skills",
        slug: "skills-vscode-2",
        title: "skills 2",
        description: "desc",
        tags: ["t-2", "skills"],
        keywords: ["k-2"],
        platforms: ["vscode"],
        repoUrl: "https://github.com/org/skills-2",
        dateAdded: "2026-01-03",
        safetyNotes: ["note"],
        privacyNotes: ["priv"],
      };
      const search = toSearchResult(entry, { score: 12, reasons: ["r2"] });
      const summary = toEntrySummary(entry);
      expect(search.key).toBe("skills:skills-vscode-2");
      expect(search.searchScore).toBe(12);
      expect(entryUpdatedAt(entry)).toMatch(/^2026-/);
      const other = { ...entry, slug: "other-2", tags: ["t-2"] };
      const related = scoreRelatedEntry(entry, other);
      expect(related?.score).toBeGreaterThan(0);
    });
    it("projection skills/jetbrains/v0", () => {
      const entry = {
        category: "skills",
        slug: "skills-jetbrains-0",
        title: "skills 0",
        description: "desc",
        tags: ["t-0", "skills"],
        keywords: ["k-0"],
        platforms: ["jetbrains"],
        repoUrl: "https://github.com/org/skills-0",
        dateAdded: "2026-01-01",
        safetyNotes: ["note"],
        privacyNotes: ["priv"],
      };
      const search = toSearchResult(entry, { score: 10, reasons: ["r0"] });
      const summary = toEntrySummary(entry);
      expect(search.key).toBe("skills:skills-jetbrains-0");
      expect(search.searchScore).toBe(10);
      expect(entryUpdatedAt(entry)).toMatch(/^2026-/);
      const other = { ...entry, slug: "other-0", tags: ["t-0"] };
      const related = scoreRelatedEntry(entry, other);
      expect(related?.score).toBeGreaterThan(0);
    });
    it("projection skills/jetbrains/v1", () => {
      const entry = {
        category: "skills",
        slug: "skills-jetbrains-1",
        title: "skills 1",
        description: "desc",
        tags: ["t-1", "skills"],
        keywords: ["k-1"],
        platforms: ["jetbrains"],
        repoUrl: "https://github.com/org/skills-1",
        dateAdded: "2026-01-02",
        safetyNotes: ["note"],
        privacyNotes: ["priv"],
      };
      const search = toSearchResult(entry, { score: 11, reasons: ["r1"] });
      const summary = toEntrySummary(entry);
      expect(search.key).toBe("skills:skills-jetbrains-1");
      expect(search.searchScore).toBe(11);
      expect(entryUpdatedAt(entry)).toMatch(/^2026-/);
      const other = { ...entry, slug: "other-1", tags: ["t-1"] };
      const related = scoreRelatedEntry(entry, other);
      expect(related?.score).toBeGreaterThan(0);
    });
    it("projection skills/jetbrains/v2", () => {
      const entry = {
        category: "skills",
        slug: "skills-jetbrains-2",
        title: "skills 2",
        description: "desc",
        tags: ["t-2", "skills"],
        keywords: ["k-2"],
        platforms: ["jetbrains"],
        repoUrl: "https://github.com/org/skills-2",
        dateAdded: "2026-01-03",
        safetyNotes: ["note"],
        privacyNotes: ["priv"],
      };
      const search = toSearchResult(entry, { score: 12, reasons: ["r2"] });
      const summary = toEntrySummary(entry);
      expect(search.key).toBe("skills:skills-jetbrains-2");
      expect(search.searchScore).toBe(12);
      expect(entryUpdatedAt(entry)).toMatch(/^2026-/);
      const other = { ...entry, slug: "other-2", tags: ["t-2"] };
      const related = scoreRelatedEntry(entry, other);
      expect(related?.score).toBeGreaterThan(0);
    });
    it("projection hooks/claude-code/v0", () => {
      const entry = {
        category: "hooks",
        slug: "hooks-claude-code-0",
        title: "hooks 0",
        description: "desc",
        tags: ["t-0", "hooks"],
        keywords: ["k-0"],
        platforms: ["claude-code"],
        repoUrl: "https://github.com/org/hooks-0",
        dateAdded: "2026-01-01",
        safetyNotes: ["note"],
        privacyNotes: ["priv"],
      };
      const search = toSearchResult(entry, { score: 10, reasons: ["r0"] });
      const summary = toEntrySummary(entry);
      expect(search.key).toBe("hooks:hooks-claude-code-0");
      expect(search.searchScore).toBe(10);
      expect(entryUpdatedAt(entry)).toMatch(/^2026-/);
      const other = { ...entry, slug: "other-0", tags: ["t-0"] };
      const related = scoreRelatedEntry(entry, other);
      expect(related?.score).toBeGreaterThan(0);
    });
    it("projection hooks/claude-code/v1", () => {
      const entry = {
        category: "hooks",
        slug: "hooks-claude-code-1",
        title: "hooks 1",
        description: "desc",
        tags: ["t-1", "hooks"],
        keywords: ["k-1"],
        platforms: ["claude-code"],
        repoUrl: "https://github.com/org/hooks-1",
        dateAdded: "2026-01-02",
        safetyNotes: ["note"],
        privacyNotes: ["priv"],
      };
      const search = toSearchResult(entry, { score: 11, reasons: ["r1"] });
      const summary = toEntrySummary(entry);
      expect(search.key).toBe("hooks:hooks-claude-code-1");
      expect(search.searchScore).toBe(11);
      expect(entryUpdatedAt(entry)).toMatch(/^2026-/);
      const other = { ...entry, slug: "other-1", tags: ["t-1"] };
      const related = scoreRelatedEntry(entry, other);
      expect(related?.score).toBeGreaterThan(0);
    });
    it("projection hooks/claude-code/v2", () => {
      const entry = {
        category: "hooks",
        slug: "hooks-claude-code-2",
        title: "hooks 2",
        description: "desc",
        tags: ["t-2", "hooks"],
        keywords: ["k-2"],
        platforms: ["claude-code"],
        repoUrl: "https://github.com/org/hooks-2",
        dateAdded: "2026-01-03",
        safetyNotes: ["note"],
        privacyNotes: ["priv"],
      };
      const search = toSearchResult(entry, { score: 12, reasons: ["r2"] });
      const summary = toEntrySummary(entry);
      expect(search.key).toBe("hooks:hooks-claude-code-2");
      expect(search.searchScore).toBe(12);
      expect(entryUpdatedAt(entry)).toMatch(/^2026-/);
      const other = { ...entry, slug: "other-2", tags: ["t-2"] };
      const related = scoreRelatedEntry(entry, other);
      expect(related?.score).toBeGreaterThan(0);
    });
    it("projection hooks/cursor/v0", () => {
      const entry = {
        category: "hooks",
        slug: "hooks-cursor-0",
        title: "hooks 0",
        description: "desc",
        tags: ["t-0", "hooks"],
        keywords: ["k-0"],
        platforms: ["cursor"],
        repoUrl: "https://github.com/org/hooks-0",
        dateAdded: "2026-01-01",
        safetyNotes: ["note"],
        privacyNotes: ["priv"],
      };
      const search = toSearchResult(entry, { score: 10, reasons: ["r0"] });
      const summary = toEntrySummary(entry);
      expect(search.key).toBe("hooks:hooks-cursor-0");
      expect(search.searchScore).toBe(10);
      expect(entryUpdatedAt(entry)).toMatch(/^2026-/);
      const other = { ...entry, slug: "other-0", tags: ["t-0"] };
      const related = scoreRelatedEntry(entry, other);
      expect(related?.score).toBeGreaterThan(0);
    });
    it("projection hooks/cursor/v1", () => {
      const entry = {
        category: "hooks",
        slug: "hooks-cursor-1",
        title: "hooks 1",
        description: "desc",
        tags: ["t-1", "hooks"],
        keywords: ["k-1"],
        platforms: ["cursor"],
        repoUrl: "https://github.com/org/hooks-1",
        dateAdded: "2026-01-02",
        safetyNotes: ["note"],
        privacyNotes: ["priv"],
      };
      const search = toSearchResult(entry, { score: 11, reasons: ["r1"] });
      const summary = toEntrySummary(entry);
      expect(search.key).toBe("hooks:hooks-cursor-1");
      expect(search.searchScore).toBe(11);
      expect(entryUpdatedAt(entry)).toMatch(/^2026-/);
      const other = { ...entry, slug: "other-1", tags: ["t-1"] };
      const related = scoreRelatedEntry(entry, other);
      expect(related?.score).toBeGreaterThan(0);
    });
    it("projection hooks/cursor/v2", () => {
      const entry = {
        category: "hooks",
        slug: "hooks-cursor-2",
        title: "hooks 2",
        description: "desc",
        tags: ["t-2", "hooks"],
        keywords: ["k-2"],
        platforms: ["cursor"],
        repoUrl: "https://github.com/org/hooks-2",
        dateAdded: "2026-01-03",
        safetyNotes: ["note"],
        privacyNotes: ["priv"],
      };
      const search = toSearchResult(entry, { score: 12, reasons: ["r2"] });
      const summary = toEntrySummary(entry);
      expect(search.key).toBe("hooks:hooks-cursor-2");
      expect(search.searchScore).toBe(12);
      expect(entryUpdatedAt(entry)).toMatch(/^2026-/);
      const other = { ...entry, slug: "other-2", tags: ["t-2"] };
      const related = scoreRelatedEntry(entry, other);
      expect(related?.score).toBeGreaterThan(0);
    });
    it("projection hooks/codex/v0", () => {
      const entry = {
        category: "hooks",
        slug: "hooks-codex-0",
        title: "hooks 0",
        description: "desc",
        tags: ["t-0", "hooks"],
        keywords: ["k-0"],
        platforms: ["codex"],
        repoUrl: "https://github.com/org/hooks-0",
        dateAdded: "2026-01-01",
        safetyNotes: ["note"],
        privacyNotes: ["priv"],
      };
      const search = toSearchResult(entry, { score: 10, reasons: ["r0"] });
      const summary = toEntrySummary(entry);
      expect(search.key).toBe("hooks:hooks-codex-0");
      expect(search.searchScore).toBe(10);
      expect(entryUpdatedAt(entry)).toMatch(/^2026-/);
      const other = { ...entry, slug: "other-0", tags: ["t-0"] };
      const related = scoreRelatedEntry(entry, other);
      expect(related?.score).toBeGreaterThan(0);
    });
    it("projection hooks/codex/v1", () => {
      const entry = {
        category: "hooks",
        slug: "hooks-codex-1",
        title: "hooks 1",
        description: "desc",
        tags: ["t-1", "hooks"],
        keywords: ["k-1"],
        platforms: ["codex"],
        repoUrl: "https://github.com/org/hooks-1",
        dateAdded: "2026-01-02",
        safetyNotes: ["note"],
        privacyNotes: ["priv"],
      };
      const search = toSearchResult(entry, { score: 11, reasons: ["r1"] });
      const summary = toEntrySummary(entry);
      expect(search.key).toBe("hooks:hooks-codex-1");
      expect(search.searchScore).toBe(11);
      expect(entryUpdatedAt(entry)).toMatch(/^2026-/);
      const other = { ...entry, slug: "other-1", tags: ["t-1"] };
      const related = scoreRelatedEntry(entry, other);
      expect(related?.score).toBeGreaterThan(0);
    });
    it("projection hooks/codex/v2", () => {
      const entry = {
        category: "hooks",
        slug: "hooks-codex-2",
        title: "hooks 2",
        description: "desc",
        tags: ["t-2", "hooks"],
        keywords: ["k-2"],
        platforms: ["codex"],
        repoUrl: "https://github.com/org/hooks-2",
        dateAdded: "2026-01-03",
        safetyNotes: ["note"],
        privacyNotes: ["priv"],
      };
      const search = toSearchResult(entry, { score: 12, reasons: ["r2"] });
      const summary = toEntrySummary(entry);
      expect(search.key).toBe("hooks:hooks-codex-2");
      expect(search.searchScore).toBe(12);
      expect(entryUpdatedAt(entry)).toMatch(/^2026-/);
      const other = { ...entry, slug: "other-2", tags: ["t-2"] };
      const related = scoreRelatedEntry(entry, other);
      expect(related?.score).toBeGreaterThan(0);
    });
    it("projection hooks/windsurf/v0", () => {
      const entry = {
        category: "hooks",
        slug: "hooks-windsurf-0",
        title: "hooks 0",
        description: "desc",
        tags: ["t-0", "hooks"],
        keywords: ["k-0"],
        platforms: ["windsurf"],
        repoUrl: "https://github.com/org/hooks-0",
        dateAdded: "2026-01-01",
        safetyNotes: ["note"],
        privacyNotes: ["priv"],
      };
      const search = toSearchResult(entry, { score: 10, reasons: ["r0"] });
      const summary = toEntrySummary(entry);
      expect(search.key).toBe("hooks:hooks-windsurf-0");
      expect(search.searchScore).toBe(10);
      expect(entryUpdatedAt(entry)).toMatch(/^2026-/);
      const other = { ...entry, slug: "other-0", tags: ["t-0"] };
      const related = scoreRelatedEntry(entry, other);
      expect(related?.score).toBeGreaterThan(0);
    });
    it("projection hooks/windsurf/v1", () => {
      const entry = {
        category: "hooks",
        slug: "hooks-windsurf-1",
        title: "hooks 1",
        description: "desc",
        tags: ["t-1", "hooks"],
        keywords: ["k-1"],
        platforms: ["windsurf"],
        repoUrl: "https://github.com/org/hooks-1",
        dateAdded: "2026-01-02",
        safetyNotes: ["note"],
        privacyNotes: ["priv"],
      };
      const search = toSearchResult(entry, { score: 11, reasons: ["r1"] });
      const summary = toEntrySummary(entry);
      expect(search.key).toBe("hooks:hooks-windsurf-1");
      expect(search.searchScore).toBe(11);
      expect(entryUpdatedAt(entry)).toMatch(/^2026-/);
      const other = { ...entry, slug: "other-1", tags: ["t-1"] };
      const related = scoreRelatedEntry(entry, other);
      expect(related?.score).toBeGreaterThan(0);
    });
    it("projection hooks/windsurf/v2", () => {
      const entry = {
        category: "hooks",
        slug: "hooks-windsurf-2",
        title: "hooks 2",
        description: "desc",
        tags: ["t-2", "hooks"],
        keywords: ["k-2"],
        platforms: ["windsurf"],
        repoUrl: "https://github.com/org/hooks-2",
        dateAdded: "2026-01-03",
        safetyNotes: ["note"],
        privacyNotes: ["priv"],
      };
      const search = toSearchResult(entry, { score: 12, reasons: ["r2"] });
      const summary = toEntrySummary(entry);
      expect(search.key).toBe("hooks:hooks-windsurf-2");
      expect(search.searchScore).toBe(12);
      expect(entryUpdatedAt(entry)).toMatch(/^2026-/);
      const other = { ...entry, slug: "other-2", tags: ["t-2"] };
      const related = scoreRelatedEntry(entry, other);
      expect(related?.score).toBeGreaterThan(0);
    });
    it("projection hooks/vscode/v0", () => {
      const entry = {
        category: "hooks",
        slug: "hooks-vscode-0",
        title: "hooks 0",
        description: "desc",
        tags: ["t-0", "hooks"],
        keywords: ["k-0"],
        platforms: ["vscode"],
        repoUrl: "https://github.com/org/hooks-0",
        dateAdded: "2026-01-01",
        safetyNotes: ["note"],
        privacyNotes: ["priv"],
      };
      const search = toSearchResult(entry, { score: 10, reasons: ["r0"] });
      const summary = toEntrySummary(entry);
      expect(search.key).toBe("hooks:hooks-vscode-0");
      expect(search.searchScore).toBe(10);
      expect(entryUpdatedAt(entry)).toMatch(/^2026-/);
      const other = { ...entry, slug: "other-0", tags: ["t-0"] };
      const related = scoreRelatedEntry(entry, other);
      expect(related?.score).toBeGreaterThan(0);
    });
    it("projection hooks/vscode/v1", () => {
      const entry = {
        category: "hooks",
        slug: "hooks-vscode-1",
        title: "hooks 1",
        description: "desc",
        tags: ["t-1", "hooks"],
        keywords: ["k-1"],
        platforms: ["vscode"],
        repoUrl: "https://github.com/org/hooks-1",
        dateAdded: "2026-01-02",
        safetyNotes: ["note"],
        privacyNotes: ["priv"],
      };
      const search = toSearchResult(entry, { score: 11, reasons: ["r1"] });
      const summary = toEntrySummary(entry);
      expect(search.key).toBe("hooks:hooks-vscode-1");
      expect(search.searchScore).toBe(11);
      expect(entryUpdatedAt(entry)).toMatch(/^2026-/);
      const other = { ...entry, slug: "other-1", tags: ["t-1"] };
      const related = scoreRelatedEntry(entry, other);
      expect(related?.score).toBeGreaterThan(0);
    });
    it("projection hooks/vscode/v2", () => {
      const entry = {
        category: "hooks",
        slug: "hooks-vscode-2",
        title: "hooks 2",
        description: "desc",
        tags: ["t-2", "hooks"],
        keywords: ["k-2"],
        platforms: ["vscode"],
        repoUrl: "https://github.com/org/hooks-2",
        dateAdded: "2026-01-03",
        safetyNotes: ["note"],
        privacyNotes: ["priv"],
      };
      const search = toSearchResult(entry, { score: 12, reasons: ["r2"] });
      const summary = toEntrySummary(entry);
      expect(search.key).toBe("hooks:hooks-vscode-2");
      expect(search.searchScore).toBe(12);
      expect(entryUpdatedAt(entry)).toMatch(/^2026-/);
      const other = { ...entry, slug: "other-2", tags: ["t-2"] };
      const related = scoreRelatedEntry(entry, other);
      expect(related?.score).toBeGreaterThan(0);
    });
    it("projection hooks/jetbrains/v0", () => {
      const entry = {
        category: "hooks",
        slug: "hooks-jetbrains-0",
        title: "hooks 0",
        description: "desc",
        tags: ["t-0", "hooks"],
        keywords: ["k-0"],
        platforms: ["jetbrains"],
        repoUrl: "https://github.com/org/hooks-0",
        dateAdded: "2026-01-01",
        safetyNotes: ["note"],
        privacyNotes: ["priv"],
      };
      const search = toSearchResult(entry, { score: 10, reasons: ["r0"] });
      const summary = toEntrySummary(entry);
      expect(search.key).toBe("hooks:hooks-jetbrains-0");
      expect(search.searchScore).toBe(10);
      expect(entryUpdatedAt(entry)).toMatch(/^2026-/);
      const other = { ...entry, slug: "other-0", tags: ["t-0"] };
      const related = scoreRelatedEntry(entry, other);
      expect(related?.score).toBeGreaterThan(0);
    });
    it("projection hooks/jetbrains/v1", () => {
      const entry = {
        category: "hooks",
        slug: "hooks-jetbrains-1",
        title: "hooks 1",
        description: "desc",
        tags: ["t-1", "hooks"],
        keywords: ["k-1"],
        platforms: ["jetbrains"],
        repoUrl: "https://github.com/org/hooks-1",
        dateAdded: "2026-01-02",
        safetyNotes: ["note"],
        privacyNotes: ["priv"],
      };
      const search = toSearchResult(entry, { score: 11, reasons: ["r1"] });
      const summary = toEntrySummary(entry);
      expect(search.key).toBe("hooks:hooks-jetbrains-1");
      expect(search.searchScore).toBe(11);
      expect(entryUpdatedAt(entry)).toMatch(/^2026-/);
      const other = { ...entry, slug: "other-1", tags: ["t-1"] };
      const related = scoreRelatedEntry(entry, other);
      expect(related?.score).toBeGreaterThan(0);
    });
    it("projection hooks/jetbrains/v2", () => {
      const entry = {
        category: "hooks",
        slug: "hooks-jetbrains-2",
        title: "hooks 2",
        description: "desc",
        tags: ["t-2", "hooks"],
        keywords: ["k-2"],
        platforms: ["jetbrains"],
        repoUrl: "https://github.com/org/hooks-2",
        dateAdded: "2026-01-03",
        safetyNotes: ["note"],
        privacyNotes: ["priv"],
      };
      const search = toSearchResult(entry, { score: 12, reasons: ["r2"] });
      const summary = toEntrySummary(entry);
      expect(search.key).toBe("hooks:hooks-jetbrains-2");
      expect(search.searchScore).toBe(12);
      expect(entryUpdatedAt(entry)).toMatch(/^2026-/);
      const other = { ...entry, slug: "other-2", tags: ["t-2"] };
      const related = scoreRelatedEntry(entry, other);
      expect(related?.score).toBeGreaterThan(0);
    });
    it("projection commands/claude-code/v0", () => {
      const entry = {
        category: "commands",
        slug: "commands-claude-code-0",
        title: "commands 0",
        description: "desc",
        tags: ["t-0", "commands"],
        keywords: ["k-0"],
        platforms: ["claude-code"],
        repoUrl: "https://github.com/org/commands-0",
        dateAdded: "2026-01-01",
        safetyNotes: ["note"],
        privacyNotes: ["priv"],
      };
      const search = toSearchResult(entry, { score: 10, reasons: ["r0"] });
      const summary = toEntrySummary(entry);
      expect(search.key).toBe("commands:commands-claude-code-0");
      expect(search.searchScore).toBe(10);
      expect(entryUpdatedAt(entry)).toMatch(/^2026-/);
      const other = { ...entry, slug: "other-0", tags: ["t-0"] };
      const related = scoreRelatedEntry(entry, other);
      expect(related?.score).toBeGreaterThan(0);
    });
    it("projection commands/claude-code/v1", () => {
      const entry = {
        category: "commands",
        slug: "commands-claude-code-1",
        title: "commands 1",
        description: "desc",
        tags: ["t-1", "commands"],
        keywords: ["k-1"],
        platforms: ["claude-code"],
        repoUrl: "https://github.com/org/commands-1",
        dateAdded: "2026-01-02",
        safetyNotes: ["note"],
        privacyNotes: ["priv"],
      };
      const search = toSearchResult(entry, { score: 11, reasons: ["r1"] });
      const summary = toEntrySummary(entry);
      expect(search.key).toBe("commands:commands-claude-code-1");
      expect(search.searchScore).toBe(11);
      expect(entryUpdatedAt(entry)).toMatch(/^2026-/);
      const other = { ...entry, slug: "other-1", tags: ["t-1"] };
      const related = scoreRelatedEntry(entry, other);
      expect(related?.score).toBeGreaterThan(0);
    });
    it("projection commands/claude-code/v2", () => {
      const entry = {
        category: "commands",
        slug: "commands-claude-code-2",
        title: "commands 2",
        description: "desc",
        tags: ["t-2", "commands"],
        keywords: ["k-2"],
        platforms: ["claude-code"],
        repoUrl: "https://github.com/org/commands-2",
        dateAdded: "2026-01-03",
        safetyNotes: ["note"],
        privacyNotes: ["priv"],
      };
      const search = toSearchResult(entry, { score: 12, reasons: ["r2"] });
      const summary = toEntrySummary(entry);
      expect(search.key).toBe("commands:commands-claude-code-2");
      expect(search.searchScore).toBe(12);
      expect(entryUpdatedAt(entry)).toMatch(/^2026-/);
      const other = { ...entry, slug: "other-2", tags: ["t-2"] };
      const related = scoreRelatedEntry(entry, other);
      expect(related?.score).toBeGreaterThan(0);
    });
    it("projection commands/cursor/v0", () => {
      const entry = {
        category: "commands",
        slug: "commands-cursor-0",
        title: "commands 0",
        description: "desc",
        tags: ["t-0", "commands"],
        keywords: ["k-0"],
        platforms: ["cursor"],
        repoUrl: "https://github.com/org/commands-0",
        dateAdded: "2026-01-01",
        safetyNotes: ["note"],
        privacyNotes: ["priv"],
      };
      const search = toSearchResult(entry, { score: 10, reasons: ["r0"] });
      const summary = toEntrySummary(entry);
      expect(search.key).toBe("commands:commands-cursor-0");
      expect(search.searchScore).toBe(10);
      expect(entryUpdatedAt(entry)).toMatch(/^2026-/);
      const other = { ...entry, slug: "other-0", tags: ["t-0"] };
      const related = scoreRelatedEntry(entry, other);
      expect(related?.score).toBeGreaterThan(0);
    });
    it("projection commands/cursor/v1", () => {
      const entry = {
        category: "commands",
        slug: "commands-cursor-1",
        title: "commands 1",
        description: "desc",
        tags: ["t-1", "commands"],
        keywords: ["k-1"],
        platforms: ["cursor"],
        repoUrl: "https://github.com/org/commands-1",
        dateAdded: "2026-01-02",
        safetyNotes: ["note"],
        privacyNotes: ["priv"],
      };
      const search = toSearchResult(entry, { score: 11, reasons: ["r1"] });
      const summary = toEntrySummary(entry);
      expect(search.key).toBe("commands:commands-cursor-1");
      expect(search.searchScore).toBe(11);
      expect(entryUpdatedAt(entry)).toMatch(/^2026-/);
      const other = { ...entry, slug: "other-1", tags: ["t-1"] };
      const related = scoreRelatedEntry(entry, other);
      expect(related?.score).toBeGreaterThan(0);
    });
    it("projection commands/cursor/v2", () => {
      const entry = {
        category: "commands",
        slug: "commands-cursor-2",
        title: "commands 2",
        description: "desc",
        tags: ["t-2", "commands"],
        keywords: ["k-2"],
        platforms: ["cursor"],
        repoUrl: "https://github.com/org/commands-2",
        dateAdded: "2026-01-03",
        safetyNotes: ["note"],
        privacyNotes: ["priv"],
      };
      const search = toSearchResult(entry, { score: 12, reasons: ["r2"] });
      const summary = toEntrySummary(entry);
      expect(search.key).toBe("commands:commands-cursor-2");
      expect(search.searchScore).toBe(12);
      expect(entryUpdatedAt(entry)).toMatch(/^2026-/);
      const other = { ...entry, slug: "other-2", tags: ["t-2"] };
      const related = scoreRelatedEntry(entry, other);
      expect(related?.score).toBeGreaterThan(0);
    });
    it("projection commands/codex/v0", () => {
      const entry = {
        category: "commands",
        slug: "commands-codex-0",
        title: "commands 0",
        description: "desc",
        tags: ["t-0", "commands"],
        keywords: ["k-0"],
        platforms: ["codex"],
        repoUrl: "https://github.com/org/commands-0",
        dateAdded: "2026-01-01",
        safetyNotes: ["note"],
        privacyNotes: ["priv"],
      };
      const search = toSearchResult(entry, { score: 10, reasons: ["r0"] });
      const summary = toEntrySummary(entry);
      expect(search.key).toBe("commands:commands-codex-0");
      expect(search.searchScore).toBe(10);
      expect(entryUpdatedAt(entry)).toMatch(/^2026-/);
      const other = { ...entry, slug: "other-0", tags: ["t-0"] };
      const related = scoreRelatedEntry(entry, other);
      expect(related?.score).toBeGreaterThan(0);
    });
    it("projection commands/codex/v1", () => {
      const entry = {
        category: "commands",
        slug: "commands-codex-1",
        title: "commands 1",
        description: "desc",
        tags: ["t-1", "commands"],
        keywords: ["k-1"],
        platforms: ["codex"],
        repoUrl: "https://github.com/org/commands-1",
        dateAdded: "2026-01-02",
        safetyNotes: ["note"],
        privacyNotes: ["priv"],
      };
      const search = toSearchResult(entry, { score: 11, reasons: ["r1"] });
      const summary = toEntrySummary(entry);
      expect(search.key).toBe("commands:commands-codex-1");
      expect(search.searchScore).toBe(11);
      expect(entryUpdatedAt(entry)).toMatch(/^2026-/);
      const other = { ...entry, slug: "other-1", tags: ["t-1"] };
      const related = scoreRelatedEntry(entry, other);
      expect(related?.score).toBeGreaterThan(0);
    });
    it("projection commands/codex/v2", () => {
      const entry = {
        category: "commands",
        slug: "commands-codex-2",
        title: "commands 2",
        description: "desc",
        tags: ["t-2", "commands"],
        keywords: ["k-2"],
        platforms: ["codex"],
        repoUrl: "https://github.com/org/commands-2",
        dateAdded: "2026-01-03",
        safetyNotes: ["note"],
        privacyNotes: ["priv"],
      };
      const search = toSearchResult(entry, { score: 12, reasons: ["r2"] });
      const summary = toEntrySummary(entry);
      expect(search.key).toBe("commands:commands-codex-2");
      expect(search.searchScore).toBe(12);
      expect(entryUpdatedAt(entry)).toMatch(/^2026-/);
      const other = { ...entry, slug: "other-2", tags: ["t-2"] };
      const related = scoreRelatedEntry(entry, other);
      expect(related?.score).toBeGreaterThan(0);
    });
    it("projection commands/windsurf/v0", () => {
      const entry = {
        category: "commands",
        slug: "commands-windsurf-0",
        title: "commands 0",
        description: "desc",
        tags: ["t-0", "commands"],
        keywords: ["k-0"],
        platforms: ["windsurf"],
        repoUrl: "https://github.com/org/commands-0",
        dateAdded: "2026-01-01",
        safetyNotes: ["note"],
        privacyNotes: ["priv"],
      };
      const search = toSearchResult(entry, { score: 10, reasons: ["r0"] });
      const summary = toEntrySummary(entry);
      expect(search.key).toBe("commands:commands-windsurf-0");
      expect(search.searchScore).toBe(10);
      expect(entryUpdatedAt(entry)).toMatch(/^2026-/);
      const other = { ...entry, slug: "other-0", tags: ["t-0"] };
      const related = scoreRelatedEntry(entry, other);
      expect(related?.score).toBeGreaterThan(0);
    });
    it("projection commands/windsurf/v1", () => {
      const entry = {
        category: "commands",
        slug: "commands-windsurf-1",
        title: "commands 1",
        description: "desc",
        tags: ["t-1", "commands"],
        keywords: ["k-1"],
        platforms: ["windsurf"],
        repoUrl: "https://github.com/org/commands-1",
        dateAdded: "2026-01-02",
        safetyNotes: ["note"],
        privacyNotes: ["priv"],
      };
      const search = toSearchResult(entry, { score: 11, reasons: ["r1"] });
      const summary = toEntrySummary(entry);
      expect(search.key).toBe("commands:commands-windsurf-1");
      expect(search.searchScore).toBe(11);
      expect(entryUpdatedAt(entry)).toMatch(/^2026-/);
      const other = { ...entry, slug: "other-1", tags: ["t-1"] };
      const related = scoreRelatedEntry(entry, other);
      expect(related?.score).toBeGreaterThan(0);
    });
    it("projection commands/windsurf/v2", () => {
      const entry = {
        category: "commands",
        slug: "commands-windsurf-2",
        title: "commands 2",
        description: "desc",
        tags: ["t-2", "commands"],
        keywords: ["k-2"],
        platforms: ["windsurf"],
        repoUrl: "https://github.com/org/commands-2",
        dateAdded: "2026-01-03",
        safetyNotes: ["note"],
        privacyNotes: ["priv"],
      };
      const search = toSearchResult(entry, { score: 12, reasons: ["r2"] });
      const summary = toEntrySummary(entry);
      expect(search.key).toBe("commands:commands-windsurf-2");
      expect(search.searchScore).toBe(12);
      expect(entryUpdatedAt(entry)).toMatch(/^2026-/);
      const other = { ...entry, slug: "other-2", tags: ["t-2"] };
      const related = scoreRelatedEntry(entry, other);
      expect(related?.score).toBeGreaterThan(0);
    });
    it("projection commands/vscode/v0", () => {
      const entry = {
        category: "commands",
        slug: "commands-vscode-0",
        title: "commands 0",
        description: "desc",
        tags: ["t-0", "commands"],
        keywords: ["k-0"],
        platforms: ["vscode"],
        repoUrl: "https://github.com/org/commands-0",
        dateAdded: "2026-01-01",
        safetyNotes: ["note"],
        privacyNotes: ["priv"],
      };
      const search = toSearchResult(entry, { score: 10, reasons: ["r0"] });
      const summary = toEntrySummary(entry);
      expect(search.key).toBe("commands:commands-vscode-0");
      expect(search.searchScore).toBe(10);
      expect(entryUpdatedAt(entry)).toMatch(/^2026-/);
      const other = { ...entry, slug: "other-0", tags: ["t-0"] };
      const related = scoreRelatedEntry(entry, other);
      expect(related?.score).toBeGreaterThan(0);
    });
    it("projection commands/vscode/v1", () => {
      const entry = {
        category: "commands",
        slug: "commands-vscode-1",
        title: "commands 1",
        description: "desc",
        tags: ["t-1", "commands"],
        keywords: ["k-1"],
        platforms: ["vscode"],
        repoUrl: "https://github.com/org/commands-1",
        dateAdded: "2026-01-02",
        safetyNotes: ["note"],
        privacyNotes: ["priv"],
      };
      const search = toSearchResult(entry, { score: 11, reasons: ["r1"] });
      const summary = toEntrySummary(entry);
      expect(search.key).toBe("commands:commands-vscode-1");
      expect(search.searchScore).toBe(11);
      expect(entryUpdatedAt(entry)).toMatch(/^2026-/);
      const other = { ...entry, slug: "other-1", tags: ["t-1"] };
      const related = scoreRelatedEntry(entry, other);
      expect(related?.score).toBeGreaterThan(0);
    });
    it("projection commands/vscode/v2", () => {
      const entry = {
        category: "commands",
        slug: "commands-vscode-2",
        title: "commands 2",
        description: "desc",
        tags: ["t-2", "commands"],
        keywords: ["k-2"],
        platforms: ["vscode"],
        repoUrl: "https://github.com/org/commands-2",
        dateAdded: "2026-01-03",
        safetyNotes: ["note"],
        privacyNotes: ["priv"],
      };
      const search = toSearchResult(entry, { score: 12, reasons: ["r2"] });
      const summary = toEntrySummary(entry);
      expect(search.key).toBe("commands:commands-vscode-2");
      expect(search.searchScore).toBe(12);
      expect(entryUpdatedAt(entry)).toMatch(/^2026-/);
      const other = { ...entry, slug: "other-2", tags: ["t-2"] };
      const related = scoreRelatedEntry(entry, other);
      expect(related?.score).toBeGreaterThan(0);
    });
    it("projection commands/jetbrains/v0", () => {
      const entry = {
        category: "commands",
        slug: "commands-jetbrains-0",
        title: "commands 0",
        description: "desc",
        tags: ["t-0", "commands"],
        keywords: ["k-0"],
        platforms: ["jetbrains"],
        repoUrl: "https://github.com/org/commands-0",
        dateAdded: "2026-01-01",
        safetyNotes: ["note"],
        privacyNotes: ["priv"],
      };
      const search = toSearchResult(entry, { score: 10, reasons: ["r0"] });
      const summary = toEntrySummary(entry);
      expect(search.key).toBe("commands:commands-jetbrains-0");
      expect(search.searchScore).toBe(10);
      expect(entryUpdatedAt(entry)).toMatch(/^2026-/);
      const other = { ...entry, slug: "other-0", tags: ["t-0"] };
      const related = scoreRelatedEntry(entry, other);
      expect(related?.score).toBeGreaterThan(0);
    });
    it("projection commands/jetbrains/v1", () => {
      const entry = {
        category: "commands",
        slug: "commands-jetbrains-1",
        title: "commands 1",
        description: "desc",
        tags: ["t-1", "commands"],
        keywords: ["k-1"],
        platforms: ["jetbrains"],
        repoUrl: "https://github.com/org/commands-1",
        dateAdded: "2026-01-02",
        safetyNotes: ["note"],
        privacyNotes: ["priv"],
      };
      const search = toSearchResult(entry, { score: 11, reasons: ["r1"] });
      const summary = toEntrySummary(entry);
      expect(search.key).toBe("commands:commands-jetbrains-1");
      expect(search.searchScore).toBe(11);
      expect(entryUpdatedAt(entry)).toMatch(/^2026-/);
      const other = { ...entry, slug: "other-1", tags: ["t-1"] };
      const related = scoreRelatedEntry(entry, other);
      expect(related?.score).toBeGreaterThan(0);
    });
    it("projection commands/jetbrains/v2", () => {
      const entry = {
        category: "commands",
        slug: "commands-jetbrains-2",
        title: "commands 2",
        description: "desc",
        tags: ["t-2", "commands"],
        keywords: ["k-2"],
        platforms: ["jetbrains"],
        repoUrl: "https://github.com/org/commands-2",
        dateAdded: "2026-01-03",
        safetyNotes: ["note"],
        privacyNotes: ["priv"],
      };
      const search = toSearchResult(entry, { score: 12, reasons: ["r2"] });
      const summary = toEntrySummary(entry);
      expect(search.key).toBe("commands:commands-jetbrains-2");
      expect(search.searchScore).toBe(12);
      expect(entryUpdatedAt(entry)).toMatch(/^2026-/);
      const other = { ...entry, slug: "other-2", tags: ["t-2"] };
      const related = scoreRelatedEntry(entry, other);
      expect(related?.score).toBeGreaterThan(0);
    });
    it("projection statuslines/claude-code/v0", () => {
      const entry = {
        category: "statuslines",
        slug: "statuslines-claude-code-0",
        title: "statuslines 0",
        description: "desc",
        tags: ["t-0", "statuslines"],
        keywords: ["k-0"],
        platforms: ["claude-code"],
        repoUrl: "https://github.com/org/statuslines-0",
        dateAdded: "2026-01-01",
        safetyNotes: ["note"],
        privacyNotes: ["priv"],
      };
      const search = toSearchResult(entry, { score: 10, reasons: ["r0"] });
      const summary = toEntrySummary(entry);
      expect(search.key).toBe("statuslines:statuslines-claude-code-0");
      expect(search.searchScore).toBe(10);
      expect(entryUpdatedAt(entry)).toMatch(/^2026-/);
      const other = { ...entry, slug: "other-0", tags: ["t-0"] };
      const related = scoreRelatedEntry(entry, other);
      expect(related?.score).toBeGreaterThan(0);
    });
    it("projection statuslines/claude-code/v1", () => {
      const entry = {
        category: "statuslines",
        slug: "statuslines-claude-code-1",
        title: "statuslines 1",
        description: "desc",
        tags: ["t-1", "statuslines"],
        keywords: ["k-1"],
        platforms: ["claude-code"],
        repoUrl: "https://github.com/org/statuslines-1",
        dateAdded: "2026-01-02",
        safetyNotes: ["note"],
        privacyNotes: ["priv"],
      };
      const search = toSearchResult(entry, { score: 11, reasons: ["r1"] });
      const summary = toEntrySummary(entry);
      expect(search.key).toBe("statuslines:statuslines-claude-code-1");
      expect(search.searchScore).toBe(11);
      expect(entryUpdatedAt(entry)).toMatch(/^2026-/);
      const other = { ...entry, slug: "other-1", tags: ["t-1"] };
      const related = scoreRelatedEntry(entry, other);
      expect(related?.score).toBeGreaterThan(0);
    });
    it("projection statuslines/claude-code/v2", () => {
      const entry = {
        category: "statuslines",
        slug: "statuslines-claude-code-2",
        title: "statuslines 2",
        description: "desc",
        tags: ["t-2", "statuslines"],
        keywords: ["k-2"],
        platforms: ["claude-code"],
        repoUrl: "https://github.com/org/statuslines-2",
        dateAdded: "2026-01-03",
        safetyNotes: ["note"],
        privacyNotes: ["priv"],
      };
      const search = toSearchResult(entry, { score: 12, reasons: ["r2"] });
      const summary = toEntrySummary(entry);
      expect(search.key).toBe("statuslines:statuslines-claude-code-2");
      expect(search.searchScore).toBe(12);
      expect(entryUpdatedAt(entry)).toMatch(/^2026-/);
      const other = { ...entry, slug: "other-2", tags: ["t-2"] };
      const related = scoreRelatedEntry(entry, other);
      expect(related?.score).toBeGreaterThan(0);
    });
    it("projection statuslines/cursor/v0", () => {
      const entry = {
        category: "statuslines",
        slug: "statuslines-cursor-0",
        title: "statuslines 0",
        description: "desc",
        tags: ["t-0", "statuslines"],
        keywords: ["k-0"],
        platforms: ["cursor"],
        repoUrl: "https://github.com/org/statuslines-0",
        dateAdded: "2026-01-01",
        safetyNotes: ["note"],
        privacyNotes: ["priv"],
      };
      const search = toSearchResult(entry, { score: 10, reasons: ["r0"] });
      const summary = toEntrySummary(entry);
      expect(search.key).toBe("statuslines:statuslines-cursor-0");
      expect(search.searchScore).toBe(10);
      expect(entryUpdatedAt(entry)).toMatch(/^2026-/);
      const other = { ...entry, slug: "other-0", tags: ["t-0"] };
      const related = scoreRelatedEntry(entry, other);
      expect(related?.score).toBeGreaterThan(0);
    });
    it("projection statuslines/cursor/v1", () => {
      const entry = {
        category: "statuslines",
        slug: "statuslines-cursor-1",
        title: "statuslines 1",
        description: "desc",
        tags: ["t-1", "statuslines"],
        keywords: ["k-1"],
        platforms: ["cursor"],
        repoUrl: "https://github.com/org/statuslines-1",
        dateAdded: "2026-01-02",
        safetyNotes: ["note"],
        privacyNotes: ["priv"],
      };
      const search = toSearchResult(entry, { score: 11, reasons: ["r1"] });
      const summary = toEntrySummary(entry);
      expect(search.key).toBe("statuslines:statuslines-cursor-1");
      expect(search.searchScore).toBe(11);
      expect(entryUpdatedAt(entry)).toMatch(/^2026-/);
      const other = { ...entry, slug: "other-1", tags: ["t-1"] };
      const related = scoreRelatedEntry(entry, other);
      expect(related?.score).toBeGreaterThan(0);
    });
    it("projection statuslines/cursor/v2", () => {
      const entry = {
        category: "statuslines",
        slug: "statuslines-cursor-2",
        title: "statuslines 2",
        description: "desc",
        tags: ["t-2", "statuslines"],
        keywords: ["k-2"],
        platforms: ["cursor"],
        repoUrl: "https://github.com/org/statuslines-2",
        dateAdded: "2026-01-03",
        safetyNotes: ["note"],
        privacyNotes: ["priv"],
      };
      const search = toSearchResult(entry, { score: 12, reasons: ["r2"] });
      const summary = toEntrySummary(entry);
      expect(search.key).toBe("statuslines:statuslines-cursor-2");
      expect(search.searchScore).toBe(12);
      expect(entryUpdatedAt(entry)).toMatch(/^2026-/);
      const other = { ...entry, slug: "other-2", tags: ["t-2"] };
      const related = scoreRelatedEntry(entry, other);
      expect(related?.score).toBeGreaterThan(0);
    });
    it("projection statuslines/codex/v0", () => {
      const entry = {
        category: "statuslines",
        slug: "statuslines-codex-0",
        title: "statuslines 0",
        description: "desc",
        tags: ["t-0", "statuslines"],
        keywords: ["k-0"],
        platforms: ["codex"],
        repoUrl: "https://github.com/org/statuslines-0",
        dateAdded: "2026-01-01",
        safetyNotes: ["note"],
        privacyNotes: ["priv"],
      };
      const search = toSearchResult(entry, { score: 10, reasons: ["r0"] });
      const summary = toEntrySummary(entry);
      expect(search.key).toBe("statuslines:statuslines-codex-0");
      expect(search.searchScore).toBe(10);
      expect(entryUpdatedAt(entry)).toMatch(/^2026-/);
      const other = { ...entry, slug: "other-0", tags: ["t-0"] };
      const related = scoreRelatedEntry(entry, other);
      expect(related?.score).toBeGreaterThan(0);
    });
    it("projection statuslines/codex/v1", () => {
      const entry = {
        category: "statuslines",
        slug: "statuslines-codex-1",
        title: "statuslines 1",
        description: "desc",
        tags: ["t-1", "statuslines"],
        keywords: ["k-1"],
        platforms: ["codex"],
        repoUrl: "https://github.com/org/statuslines-1",
        dateAdded: "2026-01-02",
        safetyNotes: ["note"],
        privacyNotes: ["priv"],
      };
      const search = toSearchResult(entry, { score: 11, reasons: ["r1"] });
      const summary = toEntrySummary(entry);
      expect(search.key).toBe("statuslines:statuslines-codex-1");
      expect(search.searchScore).toBe(11);
      expect(entryUpdatedAt(entry)).toMatch(/^2026-/);
      const other = { ...entry, slug: "other-1", tags: ["t-1"] };
      const related = scoreRelatedEntry(entry, other);
      expect(related?.score).toBeGreaterThan(0);
    });
    it("projection statuslines/codex/v2", () => {
      const entry = {
        category: "statuslines",
        slug: "statuslines-codex-2",
        title: "statuslines 2",
        description: "desc",
        tags: ["t-2", "statuslines"],
        keywords: ["k-2"],
        platforms: ["codex"],
        repoUrl: "https://github.com/org/statuslines-2",
        dateAdded: "2026-01-03",
        safetyNotes: ["note"],
        privacyNotes: ["priv"],
      };
      const search = toSearchResult(entry, { score: 12, reasons: ["r2"] });
      const summary = toEntrySummary(entry);
      expect(search.key).toBe("statuslines:statuslines-codex-2");
      expect(search.searchScore).toBe(12);
      expect(entryUpdatedAt(entry)).toMatch(/^2026-/);
      const other = { ...entry, slug: "other-2", tags: ["t-2"] };
      const related = scoreRelatedEntry(entry, other);
      expect(related?.score).toBeGreaterThan(0);
    });
    it("projection statuslines/windsurf/v0", () => {
      const entry = {
        category: "statuslines",
        slug: "statuslines-windsurf-0",
        title: "statuslines 0",
        description: "desc",
        tags: ["t-0", "statuslines"],
        keywords: ["k-0"],
        platforms: ["windsurf"],
        repoUrl: "https://github.com/org/statuslines-0",
        dateAdded: "2026-01-01",
        safetyNotes: ["note"],
        privacyNotes: ["priv"],
      };
      const search = toSearchResult(entry, { score: 10, reasons: ["r0"] });
      const summary = toEntrySummary(entry);
      expect(search.key).toBe("statuslines:statuslines-windsurf-0");
      expect(search.searchScore).toBe(10);
      expect(entryUpdatedAt(entry)).toMatch(/^2026-/);
      const other = { ...entry, slug: "other-0", tags: ["t-0"] };
      const related = scoreRelatedEntry(entry, other);
      expect(related?.score).toBeGreaterThan(0);
    });
    it("projection statuslines/windsurf/v1", () => {
      const entry = {
        category: "statuslines",
        slug: "statuslines-windsurf-1",
        title: "statuslines 1",
        description: "desc",
        tags: ["t-1", "statuslines"],
        keywords: ["k-1"],
        platforms: ["windsurf"],
        repoUrl: "https://github.com/org/statuslines-1",
        dateAdded: "2026-01-02",
        safetyNotes: ["note"],
        privacyNotes: ["priv"],
      };
      const search = toSearchResult(entry, { score: 11, reasons: ["r1"] });
      const summary = toEntrySummary(entry);
      expect(search.key).toBe("statuslines:statuslines-windsurf-1");
      expect(search.searchScore).toBe(11);
      expect(entryUpdatedAt(entry)).toMatch(/^2026-/);
      const other = { ...entry, slug: "other-1", tags: ["t-1"] };
      const related = scoreRelatedEntry(entry, other);
      expect(related?.score).toBeGreaterThan(0);
    });
    it("projection statuslines/windsurf/v2", () => {
      const entry = {
        category: "statuslines",
        slug: "statuslines-windsurf-2",
        title: "statuslines 2",
        description: "desc",
        tags: ["t-2", "statuslines"],
        keywords: ["k-2"],
        platforms: ["windsurf"],
        repoUrl: "https://github.com/org/statuslines-2",
        dateAdded: "2026-01-03",
        safetyNotes: ["note"],
        privacyNotes: ["priv"],
      };
      const search = toSearchResult(entry, { score: 12, reasons: ["r2"] });
      const summary = toEntrySummary(entry);
      expect(search.key).toBe("statuslines:statuslines-windsurf-2");
      expect(search.searchScore).toBe(12);
      expect(entryUpdatedAt(entry)).toMatch(/^2026-/);
      const other = { ...entry, slug: "other-2", tags: ["t-2"] };
      const related = scoreRelatedEntry(entry, other);
      expect(related?.score).toBeGreaterThan(0);
    });
    it("projection statuslines/vscode/v0", () => {
      const entry = {
        category: "statuslines",
        slug: "statuslines-vscode-0",
        title: "statuslines 0",
        description: "desc",
        tags: ["t-0", "statuslines"],
        keywords: ["k-0"],
        platforms: ["vscode"],
        repoUrl: "https://github.com/org/statuslines-0",
        dateAdded: "2026-01-01",
        safetyNotes: ["note"],
        privacyNotes: ["priv"],
      };
      const search = toSearchResult(entry, { score: 10, reasons: ["r0"] });
      const summary = toEntrySummary(entry);
      expect(search.key).toBe("statuslines:statuslines-vscode-0");
      expect(search.searchScore).toBe(10);
      expect(entryUpdatedAt(entry)).toMatch(/^2026-/);
      const other = { ...entry, slug: "other-0", tags: ["t-0"] };
      const related = scoreRelatedEntry(entry, other);
      expect(related?.score).toBeGreaterThan(0);
    });
    it("projection statuslines/vscode/v1", () => {
      const entry = {
        category: "statuslines",
        slug: "statuslines-vscode-1",
        title: "statuslines 1",
        description: "desc",
        tags: ["t-1", "statuslines"],
        keywords: ["k-1"],
        platforms: ["vscode"],
        repoUrl: "https://github.com/org/statuslines-1",
        dateAdded: "2026-01-02",
        safetyNotes: ["note"],
        privacyNotes: ["priv"],
      };
      const search = toSearchResult(entry, { score: 11, reasons: ["r1"] });
      const summary = toEntrySummary(entry);
      expect(search.key).toBe("statuslines:statuslines-vscode-1");
      expect(search.searchScore).toBe(11);
      expect(entryUpdatedAt(entry)).toMatch(/^2026-/);
      const other = { ...entry, slug: "other-1", tags: ["t-1"] };
      const related = scoreRelatedEntry(entry, other);
      expect(related?.score).toBeGreaterThan(0);
    });
    it("projection statuslines/vscode/v2", () => {
      const entry = {
        category: "statuslines",
        slug: "statuslines-vscode-2",
        title: "statuslines 2",
        description: "desc",
        tags: ["t-2", "statuslines"],
        keywords: ["k-2"],
        platforms: ["vscode"],
        repoUrl: "https://github.com/org/statuslines-2",
        dateAdded: "2026-01-03",
        safetyNotes: ["note"],
        privacyNotes: ["priv"],
      };
      const search = toSearchResult(entry, { score: 12, reasons: ["r2"] });
      const summary = toEntrySummary(entry);
      expect(search.key).toBe("statuslines:statuslines-vscode-2");
      expect(search.searchScore).toBe(12);
      expect(entryUpdatedAt(entry)).toMatch(/^2026-/);
      const other = { ...entry, slug: "other-2", tags: ["t-2"] };
      const related = scoreRelatedEntry(entry, other);
      expect(related?.score).toBeGreaterThan(0);
    });
    it("projection statuslines/jetbrains/v0", () => {
      const entry = {
        category: "statuslines",
        slug: "statuslines-jetbrains-0",
        title: "statuslines 0",
        description: "desc",
        tags: ["t-0", "statuslines"],
        keywords: ["k-0"],
        platforms: ["jetbrains"],
        repoUrl: "https://github.com/org/statuslines-0",
        dateAdded: "2026-01-01",
        safetyNotes: ["note"],
        privacyNotes: ["priv"],
      };
      const search = toSearchResult(entry, { score: 10, reasons: ["r0"] });
      const summary = toEntrySummary(entry);
      expect(search.key).toBe("statuslines:statuslines-jetbrains-0");
      expect(search.searchScore).toBe(10);
      expect(entryUpdatedAt(entry)).toMatch(/^2026-/);
      const other = { ...entry, slug: "other-0", tags: ["t-0"] };
      const related = scoreRelatedEntry(entry, other);
      expect(related?.score).toBeGreaterThan(0);
    });
    it("projection statuslines/jetbrains/v1", () => {
      const entry = {
        category: "statuslines",
        slug: "statuslines-jetbrains-1",
        title: "statuslines 1",
        description: "desc",
        tags: ["t-1", "statuslines"],
        keywords: ["k-1"],
        platforms: ["jetbrains"],
        repoUrl: "https://github.com/org/statuslines-1",
        dateAdded: "2026-01-02",
        safetyNotes: ["note"],
        privacyNotes: ["priv"],
      };
      const search = toSearchResult(entry, { score: 11, reasons: ["r1"] });
      const summary = toEntrySummary(entry);
      expect(search.key).toBe("statuslines:statuslines-jetbrains-1");
      expect(search.searchScore).toBe(11);
      expect(entryUpdatedAt(entry)).toMatch(/^2026-/);
      const other = { ...entry, slug: "other-1", tags: ["t-1"] };
      const related = scoreRelatedEntry(entry, other);
      expect(related?.score).toBeGreaterThan(0);
    });
    it("projection statuslines/jetbrains/v2", () => {
      const entry = {
        category: "statuslines",
        slug: "statuslines-jetbrains-2",
        title: "statuslines 2",
        description: "desc",
        tags: ["t-2", "statuslines"],
        keywords: ["k-2"],
        platforms: ["jetbrains"],
        repoUrl: "https://github.com/org/statuslines-2",
        dateAdded: "2026-01-03",
        safetyNotes: ["note"],
        privacyNotes: ["priv"],
      };
      const search = toSearchResult(entry, { score: 12, reasons: ["r2"] });
      const summary = toEntrySummary(entry);
      expect(search.key).toBe("statuslines:statuslines-jetbrains-2");
      expect(search.searchScore).toBe(12);
      expect(entryUpdatedAt(entry)).toMatch(/^2026-/);
      const other = { ...entry, slug: "other-2", tags: ["t-2"] };
      const related = scoreRelatedEntry(entry, other);
      expect(related?.score).toBeGreaterThan(0);
    });
    it("projection guides/claude-code/v0", () => {
      const entry = {
        category: "guides",
        slug: "guides-claude-code-0",
        title: "guides 0",
        description: "desc",
        tags: ["t-0", "guides"],
        keywords: ["k-0"],
        platforms: ["claude-code"],
        repoUrl: "https://github.com/org/guides-0",
        dateAdded: "2026-01-01",
        safetyNotes: ["note"],
        privacyNotes: ["priv"],
      };
      const search = toSearchResult(entry, { score: 10, reasons: ["r0"] });
      const summary = toEntrySummary(entry);
      expect(search.key).toBe("guides:guides-claude-code-0");
      expect(search.searchScore).toBe(10);
      expect(entryUpdatedAt(entry)).toMatch(/^2026-/);
      const other = { ...entry, slug: "other-0", tags: ["t-0"] };
      const related = scoreRelatedEntry(entry, other);
      expect(related?.score).toBeGreaterThan(0);
    });
    it("projection guides/claude-code/v1", () => {
      const entry = {
        category: "guides",
        slug: "guides-claude-code-1",
        title: "guides 1",
        description: "desc",
        tags: ["t-1", "guides"],
        keywords: ["k-1"],
        platforms: ["claude-code"],
        repoUrl: "https://github.com/org/guides-1",
        dateAdded: "2026-01-02",
        safetyNotes: ["note"],
        privacyNotes: ["priv"],
      };
      const search = toSearchResult(entry, { score: 11, reasons: ["r1"] });
      const summary = toEntrySummary(entry);
      expect(search.key).toBe("guides:guides-claude-code-1");
      expect(search.searchScore).toBe(11);
      expect(entryUpdatedAt(entry)).toMatch(/^2026-/);
      const other = { ...entry, slug: "other-1", tags: ["t-1"] };
      const related = scoreRelatedEntry(entry, other);
      expect(related?.score).toBeGreaterThan(0);
    });
    it("projection guides/claude-code/v2", () => {
      const entry = {
        category: "guides",
        slug: "guides-claude-code-2",
        title: "guides 2",
        description: "desc",
        tags: ["t-2", "guides"],
        keywords: ["k-2"],
        platforms: ["claude-code"],
        repoUrl: "https://github.com/org/guides-2",
        dateAdded: "2026-01-03",
        safetyNotes: ["note"],
        privacyNotes: ["priv"],
      };
      const search = toSearchResult(entry, { score: 12, reasons: ["r2"] });
      const summary = toEntrySummary(entry);
      expect(search.key).toBe("guides:guides-claude-code-2");
      expect(search.searchScore).toBe(12);
      expect(entryUpdatedAt(entry)).toMatch(/^2026-/);
      const other = { ...entry, slug: "other-2", tags: ["t-2"] };
      const related = scoreRelatedEntry(entry, other);
      expect(related?.score).toBeGreaterThan(0);
    });
    it("projection guides/cursor/v0", () => {
      const entry = {
        category: "guides",
        slug: "guides-cursor-0",
        title: "guides 0",
        description: "desc",
        tags: ["t-0", "guides"],
        keywords: ["k-0"],
        platforms: ["cursor"],
        repoUrl: "https://github.com/org/guides-0",
        dateAdded: "2026-01-01",
        safetyNotes: ["note"],
        privacyNotes: ["priv"],
      };
      const search = toSearchResult(entry, { score: 10, reasons: ["r0"] });
      const summary = toEntrySummary(entry);
      expect(search.key).toBe("guides:guides-cursor-0");
      expect(search.searchScore).toBe(10);
      expect(entryUpdatedAt(entry)).toMatch(/^2026-/);
      const other = { ...entry, slug: "other-0", tags: ["t-0"] };
      const related = scoreRelatedEntry(entry, other);
      expect(related?.score).toBeGreaterThan(0);
    });
    it("projection guides/cursor/v1", () => {
      const entry = {
        category: "guides",
        slug: "guides-cursor-1",
        title: "guides 1",
        description: "desc",
        tags: ["t-1", "guides"],
        keywords: ["k-1"],
        platforms: ["cursor"],
        repoUrl: "https://github.com/org/guides-1",
        dateAdded: "2026-01-02",
        safetyNotes: ["note"],
        privacyNotes: ["priv"],
      };
      const search = toSearchResult(entry, { score: 11, reasons: ["r1"] });
      const summary = toEntrySummary(entry);
      expect(search.key).toBe("guides:guides-cursor-1");
      expect(search.searchScore).toBe(11);
      expect(entryUpdatedAt(entry)).toMatch(/^2026-/);
      const other = { ...entry, slug: "other-1", tags: ["t-1"] };
      const related = scoreRelatedEntry(entry, other);
      expect(related?.score).toBeGreaterThan(0);
    });
    it("projection guides/cursor/v2", () => {
      const entry = {
        category: "guides",
        slug: "guides-cursor-2",
        title: "guides 2",
        description: "desc",
        tags: ["t-2", "guides"],
        keywords: ["k-2"],
        platforms: ["cursor"],
        repoUrl: "https://github.com/org/guides-2",
        dateAdded: "2026-01-03",
        safetyNotes: ["note"],
        privacyNotes: ["priv"],
      };
      const search = toSearchResult(entry, { score: 12, reasons: ["r2"] });
      const summary = toEntrySummary(entry);
      expect(search.key).toBe("guides:guides-cursor-2");
      expect(search.searchScore).toBe(12);
      expect(entryUpdatedAt(entry)).toMatch(/^2026-/);
      const other = { ...entry, slug: "other-2", tags: ["t-2"] };
      const related = scoreRelatedEntry(entry, other);
      expect(related?.score).toBeGreaterThan(0);
    });
    it("projection guides/codex/v0", () => {
      const entry = {
        category: "guides",
        slug: "guides-codex-0",
        title: "guides 0",
        description: "desc",
        tags: ["t-0", "guides"],
        keywords: ["k-0"],
        platforms: ["codex"],
        repoUrl: "https://github.com/org/guides-0",
        dateAdded: "2026-01-01",
        safetyNotes: ["note"],
        privacyNotes: ["priv"],
      };
      const search = toSearchResult(entry, { score: 10, reasons: ["r0"] });
      const summary = toEntrySummary(entry);
      expect(search.key).toBe("guides:guides-codex-0");
      expect(search.searchScore).toBe(10);
      expect(entryUpdatedAt(entry)).toMatch(/^2026-/);
      const other = { ...entry, slug: "other-0", tags: ["t-0"] };
      const related = scoreRelatedEntry(entry, other);
      expect(related?.score).toBeGreaterThan(0);
    });
    it("projection guides/codex/v1", () => {
      const entry = {
        category: "guides",
        slug: "guides-codex-1",
        title: "guides 1",
        description: "desc",
        tags: ["t-1", "guides"],
        keywords: ["k-1"],
        platforms: ["codex"],
        repoUrl: "https://github.com/org/guides-1",
        dateAdded: "2026-01-02",
        safetyNotes: ["note"],
        privacyNotes: ["priv"],
      };
      const search = toSearchResult(entry, { score: 11, reasons: ["r1"] });
      const summary = toEntrySummary(entry);
      expect(search.key).toBe("guides:guides-codex-1");
      expect(search.searchScore).toBe(11);
      expect(entryUpdatedAt(entry)).toMatch(/^2026-/);
      const other = { ...entry, slug: "other-1", tags: ["t-1"] };
      const related = scoreRelatedEntry(entry, other);
      expect(related?.score).toBeGreaterThan(0);
    });
    it("projection guides/codex/v2", () => {
      const entry = {
        category: "guides",
        slug: "guides-codex-2",
        title: "guides 2",
        description: "desc",
        tags: ["t-2", "guides"],
        keywords: ["k-2"],
        platforms: ["codex"],
        repoUrl: "https://github.com/org/guides-2",
        dateAdded: "2026-01-03",
        safetyNotes: ["note"],
        privacyNotes: ["priv"],
      };
      const search = toSearchResult(entry, { score: 12, reasons: ["r2"] });
      const summary = toEntrySummary(entry);
      expect(search.key).toBe("guides:guides-codex-2");
      expect(search.searchScore).toBe(12);
      expect(entryUpdatedAt(entry)).toMatch(/^2026-/);
      const other = { ...entry, slug: "other-2", tags: ["t-2"] };
      const related = scoreRelatedEntry(entry, other);
      expect(related?.score).toBeGreaterThan(0);
    });
    it("projection guides/windsurf/v0", () => {
      const entry = {
        category: "guides",
        slug: "guides-windsurf-0",
        title: "guides 0",
        description: "desc",
        tags: ["t-0", "guides"],
        keywords: ["k-0"],
        platforms: ["windsurf"],
        repoUrl: "https://github.com/org/guides-0",
        dateAdded: "2026-01-01",
        safetyNotes: ["note"],
        privacyNotes: ["priv"],
      };
      const search = toSearchResult(entry, { score: 10, reasons: ["r0"] });
      const summary = toEntrySummary(entry);
      expect(search.key).toBe("guides:guides-windsurf-0");
      expect(search.searchScore).toBe(10);
      expect(entryUpdatedAt(entry)).toMatch(/^2026-/);
      const other = { ...entry, slug: "other-0", tags: ["t-0"] };
      const related = scoreRelatedEntry(entry, other);
      expect(related?.score).toBeGreaterThan(0);
    });
    it("projection guides/windsurf/v1", () => {
      const entry = {
        category: "guides",
        slug: "guides-windsurf-1",
        title: "guides 1",
        description: "desc",
        tags: ["t-1", "guides"],
        keywords: ["k-1"],
        platforms: ["windsurf"],
        repoUrl: "https://github.com/org/guides-1",
        dateAdded: "2026-01-02",
        safetyNotes: ["note"],
        privacyNotes: ["priv"],
      };
      const search = toSearchResult(entry, { score: 11, reasons: ["r1"] });
      const summary = toEntrySummary(entry);
      expect(search.key).toBe("guides:guides-windsurf-1");
      expect(search.searchScore).toBe(11);
      expect(entryUpdatedAt(entry)).toMatch(/^2026-/);
      const other = { ...entry, slug: "other-1", tags: ["t-1"] };
      const related = scoreRelatedEntry(entry, other);
      expect(related?.score).toBeGreaterThan(0);
    });
    it("projection guides/windsurf/v2", () => {
      const entry = {
        category: "guides",
        slug: "guides-windsurf-2",
        title: "guides 2",
        description: "desc",
        tags: ["t-2", "guides"],
        keywords: ["k-2"],
        platforms: ["windsurf"],
        repoUrl: "https://github.com/org/guides-2",
        dateAdded: "2026-01-03",
        safetyNotes: ["note"],
        privacyNotes: ["priv"],
      };
      const search = toSearchResult(entry, { score: 12, reasons: ["r2"] });
      const summary = toEntrySummary(entry);
      expect(search.key).toBe("guides:guides-windsurf-2");
      expect(search.searchScore).toBe(12);
      expect(entryUpdatedAt(entry)).toMatch(/^2026-/);
      const other = { ...entry, slug: "other-2", tags: ["t-2"] };
      const related = scoreRelatedEntry(entry, other);
      expect(related?.score).toBeGreaterThan(0);
    });
    it("projection guides/vscode/v0", () => {
      const entry = {
        category: "guides",
        slug: "guides-vscode-0",
        title: "guides 0",
        description: "desc",
        tags: ["t-0", "guides"],
        keywords: ["k-0"],
        platforms: ["vscode"],
        repoUrl: "https://github.com/org/guides-0",
        dateAdded: "2026-01-01",
        safetyNotes: ["note"],
        privacyNotes: ["priv"],
      };
      const search = toSearchResult(entry, { score: 10, reasons: ["r0"] });
      const summary = toEntrySummary(entry);
      expect(search.key).toBe("guides:guides-vscode-0");
      expect(search.searchScore).toBe(10);
      expect(entryUpdatedAt(entry)).toMatch(/^2026-/);
      const other = { ...entry, slug: "other-0", tags: ["t-0"] };
      const related = scoreRelatedEntry(entry, other);
      expect(related?.score).toBeGreaterThan(0);
    });
    it("projection guides/vscode/v1", () => {
      const entry = {
        category: "guides",
        slug: "guides-vscode-1",
        title: "guides 1",
        description: "desc",
        tags: ["t-1", "guides"],
        keywords: ["k-1"],
        platforms: ["vscode"],
        repoUrl: "https://github.com/org/guides-1",
        dateAdded: "2026-01-02",
        safetyNotes: ["note"],
        privacyNotes: ["priv"],
      };
      const search = toSearchResult(entry, { score: 11, reasons: ["r1"] });
      const summary = toEntrySummary(entry);
      expect(search.key).toBe("guides:guides-vscode-1");
      expect(search.searchScore).toBe(11);
      expect(entryUpdatedAt(entry)).toMatch(/^2026-/);
      const other = { ...entry, slug: "other-1", tags: ["t-1"] };
      const related = scoreRelatedEntry(entry, other);
      expect(related?.score).toBeGreaterThan(0);
    });
    it("projection guides/vscode/v2", () => {
      const entry = {
        category: "guides",
        slug: "guides-vscode-2",
        title: "guides 2",
        description: "desc",
        tags: ["t-2", "guides"],
        keywords: ["k-2"],
        platforms: ["vscode"],
        repoUrl: "https://github.com/org/guides-2",
        dateAdded: "2026-01-03",
        safetyNotes: ["note"],
        privacyNotes: ["priv"],
      };
      const search = toSearchResult(entry, { score: 12, reasons: ["r2"] });
      const summary = toEntrySummary(entry);
      expect(search.key).toBe("guides:guides-vscode-2");
      expect(search.searchScore).toBe(12);
      expect(entryUpdatedAt(entry)).toMatch(/^2026-/);
      const other = { ...entry, slug: "other-2", tags: ["t-2"] };
      const related = scoreRelatedEntry(entry, other);
      expect(related?.score).toBeGreaterThan(0);
    });
    it("projection guides/jetbrains/v0", () => {
      const entry = {
        category: "guides",
        slug: "guides-jetbrains-0",
        title: "guides 0",
        description: "desc",
        tags: ["t-0", "guides"],
        keywords: ["k-0"],
        platforms: ["jetbrains"],
        repoUrl: "https://github.com/org/guides-0",
        dateAdded: "2026-01-01",
        safetyNotes: ["note"],
        privacyNotes: ["priv"],
      };
      const search = toSearchResult(entry, { score: 10, reasons: ["r0"] });
      const summary = toEntrySummary(entry);
      expect(search.key).toBe("guides:guides-jetbrains-0");
      expect(search.searchScore).toBe(10);
      expect(entryUpdatedAt(entry)).toMatch(/^2026-/);
      const other = { ...entry, slug: "other-0", tags: ["t-0"] };
      const related = scoreRelatedEntry(entry, other);
      expect(related?.score).toBeGreaterThan(0);
    });
    it("projection guides/jetbrains/v1", () => {
      const entry = {
        category: "guides",
        slug: "guides-jetbrains-1",
        title: "guides 1",
        description: "desc",
        tags: ["t-1", "guides"],
        keywords: ["k-1"],
        platforms: ["jetbrains"],
        repoUrl: "https://github.com/org/guides-1",
        dateAdded: "2026-01-02",
        safetyNotes: ["note"],
        privacyNotes: ["priv"],
      };
      const search = toSearchResult(entry, { score: 11, reasons: ["r1"] });
      const summary = toEntrySummary(entry);
      expect(search.key).toBe("guides:guides-jetbrains-1");
      expect(search.searchScore).toBe(11);
      expect(entryUpdatedAt(entry)).toMatch(/^2026-/);
      const other = { ...entry, slug: "other-1", tags: ["t-1"] };
      const related = scoreRelatedEntry(entry, other);
      expect(related?.score).toBeGreaterThan(0);
    });
    it("projection guides/jetbrains/v2", () => {
      const entry = {
        category: "guides",
        slug: "guides-jetbrains-2",
        title: "guides 2",
        description: "desc",
        tags: ["t-2", "guides"],
        keywords: ["k-2"],
        platforms: ["jetbrains"],
        repoUrl: "https://github.com/org/guides-2",
        dateAdded: "2026-01-03",
        safetyNotes: ["note"],
        privacyNotes: ["priv"],
      };
      const search = toSearchResult(entry, { score: 12, reasons: ["r2"] });
      const summary = toEntrySummary(entry);
      expect(search.key).toBe("guides:guides-jetbrains-2");
      expect(search.searchScore).toBe(12);
      expect(entryUpdatedAt(entry)).toMatch(/^2026-/);
      const other = { ...entry, slug: "other-2", tags: ["t-2"] };
      const related = scoreRelatedEntry(entry, other);
      expect(related?.score).toBeGreaterThan(0);
    });
    it("projection plugins/claude-code/v0", () => {
      const entry = {
        category: "plugins",
        slug: "plugins-claude-code-0",
        title: "plugins 0",
        description: "desc",
        tags: ["t-0", "plugins"],
        keywords: ["k-0"],
        platforms: ["claude-code"],
        repoUrl: "https://github.com/org/plugins-0",
        dateAdded: "2026-01-01",
        safetyNotes: ["note"],
        privacyNotes: ["priv"],
      };
      const search = toSearchResult(entry, { score: 10, reasons: ["r0"] });
      const summary = toEntrySummary(entry);
      expect(search.key).toBe("plugins:plugins-claude-code-0");
      expect(search.searchScore).toBe(10);
      expect(entryUpdatedAt(entry)).toMatch(/^2026-/);
      const other = { ...entry, slug: "other-0", tags: ["t-0"] };
      const related = scoreRelatedEntry(entry, other);
      expect(related?.score).toBeGreaterThan(0);
    });
    it("projection plugins/claude-code/v1", () => {
      const entry = {
        category: "plugins",
        slug: "plugins-claude-code-1",
        title: "plugins 1",
        description: "desc",
        tags: ["t-1", "plugins"],
        keywords: ["k-1"],
        platforms: ["claude-code"],
        repoUrl: "https://github.com/org/plugins-1",
        dateAdded: "2026-01-02",
        safetyNotes: ["note"],
        privacyNotes: ["priv"],
      };
      const search = toSearchResult(entry, { score: 11, reasons: ["r1"] });
      const summary = toEntrySummary(entry);
      expect(search.key).toBe("plugins:plugins-claude-code-1");
      expect(search.searchScore).toBe(11);
      expect(entryUpdatedAt(entry)).toMatch(/^2026-/);
      const other = { ...entry, slug: "other-1", tags: ["t-1"] };
      const related = scoreRelatedEntry(entry, other);
      expect(related?.score).toBeGreaterThan(0);
    });
    it("projection plugins/claude-code/v2", () => {
      const entry = {
        category: "plugins",
        slug: "plugins-claude-code-2",
        title: "plugins 2",
        description: "desc",
        tags: ["t-2", "plugins"],
        keywords: ["k-2"],
        platforms: ["claude-code"],
        repoUrl: "https://github.com/org/plugins-2",
        dateAdded: "2026-01-03",
        safetyNotes: ["note"],
        privacyNotes: ["priv"],
      };
      const search = toSearchResult(entry, { score: 12, reasons: ["r2"] });
      const summary = toEntrySummary(entry);
      expect(search.key).toBe("plugins:plugins-claude-code-2");
      expect(search.searchScore).toBe(12);
      expect(entryUpdatedAt(entry)).toMatch(/^2026-/);
      const other = { ...entry, slug: "other-2", tags: ["t-2"] };
      const related = scoreRelatedEntry(entry, other);
      expect(related?.score).toBeGreaterThan(0);
    });
    it("projection plugins/cursor/v0", () => {
      const entry = {
        category: "plugins",
        slug: "plugins-cursor-0",
        title: "plugins 0",
        description: "desc",
        tags: ["t-0", "plugins"],
        keywords: ["k-0"],
        platforms: ["cursor"],
        repoUrl: "https://github.com/org/plugins-0",
        dateAdded: "2026-01-01",
        safetyNotes: ["note"],
        privacyNotes: ["priv"],
      };
      const search = toSearchResult(entry, { score: 10, reasons: ["r0"] });
      const summary = toEntrySummary(entry);
      expect(search.key).toBe("plugins:plugins-cursor-0");
      expect(search.searchScore).toBe(10);
      expect(entryUpdatedAt(entry)).toMatch(/^2026-/);
      const other = { ...entry, slug: "other-0", tags: ["t-0"] };
      const related = scoreRelatedEntry(entry, other);
      expect(related?.score).toBeGreaterThan(0);
    });
    it("projection plugins/cursor/v1", () => {
      const entry = {
        category: "plugins",
        slug: "plugins-cursor-1",
        title: "plugins 1",
        description: "desc",
        tags: ["t-1", "plugins"],
        keywords: ["k-1"],
        platforms: ["cursor"],
        repoUrl: "https://github.com/org/plugins-1",
        dateAdded: "2026-01-02",
        safetyNotes: ["note"],
        privacyNotes: ["priv"],
      };
      const search = toSearchResult(entry, { score: 11, reasons: ["r1"] });
      const summary = toEntrySummary(entry);
      expect(search.key).toBe("plugins:plugins-cursor-1");
      expect(search.searchScore).toBe(11);
      expect(entryUpdatedAt(entry)).toMatch(/^2026-/);
      const other = { ...entry, slug: "other-1", tags: ["t-1"] };
      const related = scoreRelatedEntry(entry, other);
      expect(related?.score).toBeGreaterThan(0);
    });
    it("projection plugins/cursor/v2", () => {
      const entry = {
        category: "plugins",
        slug: "plugins-cursor-2",
        title: "plugins 2",
        description: "desc",
        tags: ["t-2", "plugins"],
        keywords: ["k-2"],
        platforms: ["cursor"],
        repoUrl: "https://github.com/org/plugins-2",
        dateAdded: "2026-01-03",
        safetyNotes: ["note"],
        privacyNotes: ["priv"],
      };
      const search = toSearchResult(entry, { score: 12, reasons: ["r2"] });
      const summary = toEntrySummary(entry);
      expect(search.key).toBe("plugins:plugins-cursor-2");
      expect(search.searchScore).toBe(12);
      expect(entryUpdatedAt(entry)).toMatch(/^2026-/);
      const other = { ...entry, slug: "other-2", tags: ["t-2"] };
      const related = scoreRelatedEntry(entry, other);
      expect(related?.score).toBeGreaterThan(0);
    });
    it("projection plugins/codex/v0", () => {
      const entry = {
        category: "plugins",
        slug: "plugins-codex-0",
        title: "plugins 0",
        description: "desc",
        tags: ["t-0", "plugins"],
        keywords: ["k-0"],
        platforms: ["codex"],
        repoUrl: "https://github.com/org/plugins-0",
        dateAdded: "2026-01-01",
        safetyNotes: ["note"],
        privacyNotes: ["priv"],
      };
      const search = toSearchResult(entry, { score: 10, reasons: ["r0"] });
      const summary = toEntrySummary(entry);
      expect(search.key).toBe("plugins:plugins-codex-0");
      expect(search.searchScore).toBe(10);
      expect(entryUpdatedAt(entry)).toMatch(/^2026-/);
      const other = { ...entry, slug: "other-0", tags: ["t-0"] };
      const related = scoreRelatedEntry(entry, other);
      expect(related?.score).toBeGreaterThan(0);
    });
    it("projection plugins/codex/v1", () => {
      const entry = {
        category: "plugins",
        slug: "plugins-codex-1",
        title: "plugins 1",
        description: "desc",
        tags: ["t-1", "plugins"],
        keywords: ["k-1"],
        platforms: ["codex"],
        repoUrl: "https://github.com/org/plugins-1",
        dateAdded: "2026-01-02",
        safetyNotes: ["note"],
        privacyNotes: ["priv"],
      };
      const search = toSearchResult(entry, { score: 11, reasons: ["r1"] });
      const summary = toEntrySummary(entry);
      expect(search.key).toBe("plugins:plugins-codex-1");
      expect(search.searchScore).toBe(11);
      expect(entryUpdatedAt(entry)).toMatch(/^2026-/);
      const other = { ...entry, slug: "other-1", tags: ["t-1"] };
      const related = scoreRelatedEntry(entry, other);
      expect(related?.score).toBeGreaterThan(0);
    });
    it("projection plugins/codex/v2", () => {
      const entry = {
        category: "plugins",
        slug: "plugins-codex-2",
        title: "plugins 2",
        description: "desc",
        tags: ["t-2", "plugins"],
        keywords: ["k-2"],
        platforms: ["codex"],
        repoUrl: "https://github.com/org/plugins-2",
        dateAdded: "2026-01-03",
        safetyNotes: ["note"],
        privacyNotes: ["priv"],
      };
      const search = toSearchResult(entry, { score: 12, reasons: ["r2"] });
      const summary = toEntrySummary(entry);
      expect(search.key).toBe("plugins:plugins-codex-2");
      expect(search.searchScore).toBe(12);
      expect(entryUpdatedAt(entry)).toMatch(/^2026-/);
      const other = { ...entry, slug: "other-2", tags: ["t-2"] };
      const related = scoreRelatedEntry(entry, other);
      expect(related?.score).toBeGreaterThan(0);
    });
    it("projection plugins/windsurf/v0", () => {
      const entry = {
        category: "plugins",
        slug: "plugins-windsurf-0",
        title: "plugins 0",
        description: "desc",
        tags: ["t-0", "plugins"],
        keywords: ["k-0"],
        platforms: ["windsurf"],
        repoUrl: "https://github.com/org/plugins-0",
        dateAdded: "2026-01-01",
        safetyNotes: ["note"],
        privacyNotes: ["priv"],
      };
      const search = toSearchResult(entry, { score: 10, reasons: ["r0"] });
      const summary = toEntrySummary(entry);
      expect(search.key).toBe("plugins:plugins-windsurf-0");
      expect(search.searchScore).toBe(10);
      expect(entryUpdatedAt(entry)).toMatch(/^2026-/);
      const other = { ...entry, slug: "other-0", tags: ["t-0"] };
      const related = scoreRelatedEntry(entry, other);
      expect(related?.score).toBeGreaterThan(0);
    });
    it("projection plugins/windsurf/v1", () => {
      const entry = {
        category: "plugins",
        slug: "plugins-windsurf-1",
        title: "plugins 1",
        description: "desc",
        tags: ["t-1", "plugins"],
        keywords: ["k-1"],
        platforms: ["windsurf"],
        repoUrl: "https://github.com/org/plugins-1",
        dateAdded: "2026-01-02",
        safetyNotes: ["note"],
        privacyNotes: ["priv"],
      };
      const search = toSearchResult(entry, { score: 11, reasons: ["r1"] });
      const summary = toEntrySummary(entry);
      expect(search.key).toBe("plugins:plugins-windsurf-1");
      expect(search.searchScore).toBe(11);
      expect(entryUpdatedAt(entry)).toMatch(/^2026-/);
      const other = { ...entry, slug: "other-1", tags: ["t-1"] };
      const related = scoreRelatedEntry(entry, other);
      expect(related?.score).toBeGreaterThan(0);
    });
    it("projection plugins/windsurf/v2", () => {
      const entry = {
        category: "plugins",
        slug: "plugins-windsurf-2",
        title: "plugins 2",
        description: "desc",
        tags: ["t-2", "plugins"],
        keywords: ["k-2"],
        platforms: ["windsurf"],
        repoUrl: "https://github.com/org/plugins-2",
        dateAdded: "2026-01-03",
        safetyNotes: ["note"],
        privacyNotes: ["priv"],
      };
      const search = toSearchResult(entry, { score: 12, reasons: ["r2"] });
      const summary = toEntrySummary(entry);
      expect(search.key).toBe("plugins:plugins-windsurf-2");
      expect(search.searchScore).toBe(12);
      expect(entryUpdatedAt(entry)).toMatch(/^2026-/);
      const other = { ...entry, slug: "other-2", tags: ["t-2"] };
      const related = scoreRelatedEntry(entry, other);
      expect(related?.score).toBeGreaterThan(0);
    });
    it("projection plugins/vscode/v0", () => {
      const entry = {
        category: "plugins",
        slug: "plugins-vscode-0",
        title: "plugins 0",
        description: "desc",
        tags: ["t-0", "plugins"],
        keywords: ["k-0"],
        platforms: ["vscode"],
        repoUrl: "https://github.com/org/plugins-0",
        dateAdded: "2026-01-01",
        safetyNotes: ["note"],
        privacyNotes: ["priv"],
      };
      const search = toSearchResult(entry, { score: 10, reasons: ["r0"] });
      const summary = toEntrySummary(entry);
      expect(search.key).toBe("plugins:plugins-vscode-0");
      expect(search.searchScore).toBe(10);
      expect(entryUpdatedAt(entry)).toMatch(/^2026-/);
      const other = { ...entry, slug: "other-0", tags: ["t-0"] };
      const related = scoreRelatedEntry(entry, other);
      expect(related?.score).toBeGreaterThan(0);
    });
    it("projection plugins/vscode/v1", () => {
      const entry = {
        category: "plugins",
        slug: "plugins-vscode-1",
        title: "plugins 1",
        description: "desc",
        tags: ["t-1", "plugins"],
        keywords: ["k-1"],
        platforms: ["vscode"],
        repoUrl: "https://github.com/org/plugins-1",
        dateAdded: "2026-01-02",
        safetyNotes: ["note"],
        privacyNotes: ["priv"],
      };
      const search = toSearchResult(entry, { score: 11, reasons: ["r1"] });
      const summary = toEntrySummary(entry);
      expect(search.key).toBe("plugins:plugins-vscode-1");
      expect(search.searchScore).toBe(11);
      expect(entryUpdatedAt(entry)).toMatch(/^2026-/);
      const other = { ...entry, slug: "other-1", tags: ["t-1"] };
      const related = scoreRelatedEntry(entry, other);
      expect(related?.score).toBeGreaterThan(0);
    });
    it("projection plugins/vscode/v2", () => {
      const entry = {
        category: "plugins",
        slug: "plugins-vscode-2",
        title: "plugins 2",
        description: "desc",
        tags: ["t-2", "plugins"],
        keywords: ["k-2"],
        platforms: ["vscode"],
        repoUrl: "https://github.com/org/plugins-2",
        dateAdded: "2026-01-03",
        safetyNotes: ["note"],
        privacyNotes: ["priv"],
      };
      const search = toSearchResult(entry, { score: 12, reasons: ["r2"] });
      const summary = toEntrySummary(entry);
      expect(search.key).toBe("plugins:plugins-vscode-2");
      expect(search.searchScore).toBe(12);
      expect(entryUpdatedAt(entry)).toMatch(/^2026-/);
      const other = { ...entry, slug: "other-2", tags: ["t-2"] };
      const related = scoreRelatedEntry(entry, other);
      expect(related?.score).toBeGreaterThan(0);
    });
    it("projection plugins/jetbrains/v0", () => {
      const entry = {
        category: "plugins",
        slug: "plugins-jetbrains-0",
        title: "plugins 0",
        description: "desc",
        tags: ["t-0", "plugins"],
        keywords: ["k-0"],
        platforms: ["jetbrains"],
        repoUrl: "https://github.com/org/plugins-0",
        dateAdded: "2026-01-01",
        safetyNotes: ["note"],
        privacyNotes: ["priv"],
      };
      const search = toSearchResult(entry, { score: 10, reasons: ["r0"] });
      const summary = toEntrySummary(entry);
      expect(search.key).toBe("plugins:plugins-jetbrains-0");
      expect(search.searchScore).toBe(10);
      expect(entryUpdatedAt(entry)).toMatch(/^2026-/);
      const other = { ...entry, slug: "other-0", tags: ["t-0"] };
      const related = scoreRelatedEntry(entry, other);
      expect(related?.score).toBeGreaterThan(0);
    });
    it("projection plugins/jetbrains/v1", () => {
      const entry = {
        category: "plugins",
        slug: "plugins-jetbrains-1",
        title: "plugins 1",
        description: "desc",
        tags: ["t-1", "plugins"],
        keywords: ["k-1"],
        platforms: ["jetbrains"],
        repoUrl: "https://github.com/org/plugins-1",
        dateAdded: "2026-01-02",
        safetyNotes: ["note"],
        privacyNotes: ["priv"],
      };
      const search = toSearchResult(entry, { score: 11, reasons: ["r1"] });
      const summary = toEntrySummary(entry);
      expect(search.key).toBe("plugins:plugins-jetbrains-1");
      expect(search.searchScore).toBe(11);
      expect(entryUpdatedAt(entry)).toMatch(/^2026-/);
      const other = { ...entry, slug: "other-1", tags: ["t-1"] };
      const related = scoreRelatedEntry(entry, other);
      expect(related?.score).toBeGreaterThan(0);
    });
    it("projection plugins/jetbrains/v2", () => {
      const entry = {
        category: "plugins",
        slug: "plugins-jetbrains-2",
        title: "plugins 2",
        description: "desc",
        tags: ["t-2", "plugins"],
        keywords: ["k-2"],
        platforms: ["jetbrains"],
        repoUrl: "https://github.com/org/plugins-2",
        dateAdded: "2026-01-03",
        safetyNotes: ["note"],
        privacyNotes: ["priv"],
      };
      const search = toSearchResult(entry, { score: 12, reasons: ["r2"] });
      const summary = toEntrySummary(entry);
      expect(search.key).toBe("plugins:plugins-jetbrains-2");
      expect(search.searchScore).toBe(12);
      expect(entryUpdatedAt(entry)).toMatch(/^2026-/);
      const other = { ...entry, slug: "other-2", tags: ["t-2"] };
      const related = scoreRelatedEntry(entry, other);
      expect(related?.score).toBeGreaterThan(0);
    });
    it("projection agents/claude-code/v0", () => {
      const entry = {
        category: "agents",
        slug: "agents-claude-code-0",
        title: "agents 0",
        description: "desc",
        tags: ["t-0", "agents"],
        keywords: ["k-0"],
        platforms: ["claude-code"],
        repoUrl: "https://github.com/org/agents-0",
        dateAdded: "2026-01-01",
        safetyNotes: ["note"],
        privacyNotes: ["priv"],
      };
      const search = toSearchResult(entry, { score: 10, reasons: ["r0"] });
      const summary = toEntrySummary(entry);
      expect(search.key).toBe("agents:agents-claude-code-0");
      expect(search.searchScore).toBe(10);
      expect(entryUpdatedAt(entry)).toMatch(/^2026-/);
      const other = { ...entry, slug: "other-0", tags: ["t-0"] };
      const related = scoreRelatedEntry(entry, other);
      expect(related?.score).toBeGreaterThan(0);
    });
    it("projection agents/claude-code/v1", () => {
      const entry = {
        category: "agents",
        slug: "agents-claude-code-1",
        title: "agents 1",
        description: "desc",
        tags: ["t-1", "agents"],
        keywords: ["k-1"],
        platforms: ["claude-code"],
        repoUrl: "https://github.com/org/agents-1",
        dateAdded: "2026-01-02",
        safetyNotes: ["note"],
        privacyNotes: ["priv"],
      };
      const search = toSearchResult(entry, { score: 11, reasons: ["r1"] });
      const summary = toEntrySummary(entry);
      expect(search.key).toBe("agents:agents-claude-code-1");
      expect(search.searchScore).toBe(11);
      expect(entryUpdatedAt(entry)).toMatch(/^2026-/);
      const other = { ...entry, slug: "other-1", tags: ["t-1"] };
      const related = scoreRelatedEntry(entry, other);
      expect(related?.score).toBeGreaterThan(0);
    });
    it("projection agents/claude-code/v2", () => {
      const entry = {
        category: "agents",
        slug: "agents-claude-code-2",
        title: "agents 2",
        description: "desc",
        tags: ["t-2", "agents"],
        keywords: ["k-2"],
        platforms: ["claude-code"],
        repoUrl: "https://github.com/org/agents-2",
        dateAdded: "2026-01-03",
        safetyNotes: ["note"],
        privacyNotes: ["priv"],
      };
      const search = toSearchResult(entry, { score: 12, reasons: ["r2"] });
      const summary = toEntrySummary(entry);
      expect(search.key).toBe("agents:agents-claude-code-2");
      expect(search.searchScore).toBe(12);
      expect(entryUpdatedAt(entry)).toMatch(/^2026-/);
      const other = { ...entry, slug: "other-2", tags: ["t-2"] };
      const related = scoreRelatedEntry(entry, other);
      expect(related?.score).toBeGreaterThan(0);
    });
    it("projection agents/cursor/v0", () => {
      const entry = {
        category: "agents",
        slug: "agents-cursor-0",
        title: "agents 0",
        description: "desc",
        tags: ["t-0", "agents"],
        keywords: ["k-0"],
        platforms: ["cursor"],
        repoUrl: "https://github.com/org/agents-0",
        dateAdded: "2026-01-01",
        safetyNotes: ["note"],
        privacyNotes: ["priv"],
      };
      const search = toSearchResult(entry, { score: 10, reasons: ["r0"] });
      const summary = toEntrySummary(entry);
      expect(search.key).toBe("agents:agents-cursor-0");
      expect(search.searchScore).toBe(10);
      expect(entryUpdatedAt(entry)).toMatch(/^2026-/);
      const other = { ...entry, slug: "other-0", tags: ["t-0"] };
      const related = scoreRelatedEntry(entry, other);
      expect(related?.score).toBeGreaterThan(0);
    });
    it("projection agents/cursor/v1", () => {
      const entry = {
        category: "agents",
        slug: "agents-cursor-1",
        title: "agents 1",
        description: "desc",
        tags: ["t-1", "agents"],
        keywords: ["k-1"],
        platforms: ["cursor"],
        repoUrl: "https://github.com/org/agents-1",
        dateAdded: "2026-01-02",
        safetyNotes: ["note"],
        privacyNotes: ["priv"],
      };
      const search = toSearchResult(entry, { score: 11, reasons: ["r1"] });
      const summary = toEntrySummary(entry);
      expect(search.key).toBe("agents:agents-cursor-1");
      expect(search.searchScore).toBe(11);
      expect(entryUpdatedAt(entry)).toMatch(/^2026-/);
      const other = { ...entry, slug: "other-1", tags: ["t-1"] };
      const related = scoreRelatedEntry(entry, other);
      expect(related?.score).toBeGreaterThan(0);
    });
    it("projection agents/cursor/v2", () => {
      const entry = {
        category: "agents",
        slug: "agents-cursor-2",
        title: "agents 2",
        description: "desc",
        tags: ["t-2", "agents"],
        keywords: ["k-2"],
        platforms: ["cursor"],
        repoUrl: "https://github.com/org/agents-2",
        dateAdded: "2026-01-03",
        safetyNotes: ["note"],
        privacyNotes: ["priv"],
      };
      const search = toSearchResult(entry, { score: 12, reasons: ["r2"] });
      const summary = toEntrySummary(entry);
      expect(search.key).toBe("agents:agents-cursor-2");
      expect(search.searchScore).toBe(12);
      expect(entryUpdatedAt(entry)).toMatch(/^2026-/);
      const other = { ...entry, slug: "other-2", tags: ["t-2"] };
      const related = scoreRelatedEntry(entry, other);
      expect(related?.score).toBeGreaterThan(0);
    });
    it("projection agents/codex/v0", () => {
      const entry = {
        category: "agents",
        slug: "agents-codex-0",
        title: "agents 0",
        description: "desc",
        tags: ["t-0", "agents"],
        keywords: ["k-0"],
        platforms: ["codex"],
        repoUrl: "https://github.com/org/agents-0",
        dateAdded: "2026-01-01",
        safetyNotes: ["note"],
        privacyNotes: ["priv"],
      };
      const search = toSearchResult(entry, { score: 10, reasons: ["r0"] });
      const summary = toEntrySummary(entry);
      expect(search.key).toBe("agents:agents-codex-0");
      expect(search.searchScore).toBe(10);
      expect(entryUpdatedAt(entry)).toMatch(/^2026-/);
      const other = { ...entry, slug: "other-0", tags: ["t-0"] };
      const related = scoreRelatedEntry(entry, other);
      expect(related?.score).toBeGreaterThan(0);
    });
    it("projection agents/codex/v1", () => {
      const entry = {
        category: "agents",
        slug: "agents-codex-1",
        title: "agents 1",
        description: "desc",
        tags: ["t-1", "agents"],
        keywords: ["k-1"],
        platforms: ["codex"],
        repoUrl: "https://github.com/org/agents-1",
        dateAdded: "2026-01-02",
        safetyNotes: ["note"],
        privacyNotes: ["priv"],
      };
      const search = toSearchResult(entry, { score: 11, reasons: ["r1"] });
      const summary = toEntrySummary(entry);
      expect(search.key).toBe("agents:agents-codex-1");
      expect(search.searchScore).toBe(11);
      expect(entryUpdatedAt(entry)).toMatch(/^2026-/);
      const other = { ...entry, slug: "other-1", tags: ["t-1"] };
      const related = scoreRelatedEntry(entry, other);
      expect(related?.score).toBeGreaterThan(0);
    });
    it("projection agents/codex/v2", () => {
      const entry = {
        category: "agents",
        slug: "agents-codex-2",
        title: "agents 2",
        description: "desc",
        tags: ["t-2", "agents"],
        keywords: ["k-2"],
        platforms: ["codex"],
        repoUrl: "https://github.com/org/agents-2",
        dateAdded: "2026-01-03",
        safetyNotes: ["note"],
        privacyNotes: ["priv"],
      };
      const search = toSearchResult(entry, { score: 12, reasons: ["r2"] });
      const summary = toEntrySummary(entry);
      expect(search.key).toBe("agents:agents-codex-2");
      expect(search.searchScore).toBe(12);
      expect(entryUpdatedAt(entry)).toMatch(/^2026-/);
      const other = { ...entry, slug: "other-2", tags: ["t-2"] };
      const related = scoreRelatedEntry(entry, other);
      expect(related?.score).toBeGreaterThan(0);
    });
    it("projection agents/windsurf/v0", () => {
      const entry = {
        category: "agents",
        slug: "agents-windsurf-0",
        title: "agents 0",
        description: "desc",
        tags: ["t-0", "agents"],
        keywords: ["k-0"],
        platforms: ["windsurf"],
        repoUrl: "https://github.com/org/agents-0",
        dateAdded: "2026-01-01",
        safetyNotes: ["note"],
        privacyNotes: ["priv"],
      };
      const search = toSearchResult(entry, { score: 10, reasons: ["r0"] });
      const summary = toEntrySummary(entry);
      expect(search.key).toBe("agents:agents-windsurf-0");
      expect(search.searchScore).toBe(10);
      expect(entryUpdatedAt(entry)).toMatch(/^2026-/);
      const other = { ...entry, slug: "other-0", tags: ["t-0"] };
      const related = scoreRelatedEntry(entry, other);
      expect(related?.score).toBeGreaterThan(0);
    });
    it("projection agents/windsurf/v1", () => {
      const entry = {
        category: "agents",
        slug: "agents-windsurf-1",
        title: "agents 1",
        description: "desc",
        tags: ["t-1", "agents"],
        keywords: ["k-1"],
        platforms: ["windsurf"],
        repoUrl: "https://github.com/org/agents-1",
        dateAdded: "2026-01-02",
        safetyNotes: ["note"],
        privacyNotes: ["priv"],
      };
      const search = toSearchResult(entry, { score: 11, reasons: ["r1"] });
      const summary = toEntrySummary(entry);
      expect(search.key).toBe("agents:agents-windsurf-1");
      expect(search.searchScore).toBe(11);
      expect(entryUpdatedAt(entry)).toMatch(/^2026-/);
      const other = { ...entry, slug: "other-1", tags: ["t-1"] };
      const related = scoreRelatedEntry(entry, other);
      expect(related?.score).toBeGreaterThan(0);
    });
    it("projection agents/windsurf/v2", () => {
      const entry = {
        category: "agents",
        slug: "agents-windsurf-2",
        title: "agents 2",
        description: "desc",
        tags: ["t-2", "agents"],
        keywords: ["k-2"],
        platforms: ["windsurf"],
        repoUrl: "https://github.com/org/agents-2",
        dateAdded: "2026-01-03",
        safetyNotes: ["note"],
        privacyNotes: ["priv"],
      };
      const search = toSearchResult(entry, { score: 12, reasons: ["r2"] });
      const summary = toEntrySummary(entry);
      expect(search.key).toBe("agents:agents-windsurf-2");
      expect(search.searchScore).toBe(12);
      expect(entryUpdatedAt(entry)).toMatch(/^2026-/);
      const other = { ...entry, slug: "other-2", tags: ["t-2"] };
      const related = scoreRelatedEntry(entry, other);
      expect(related?.score).toBeGreaterThan(0);
    });
    it("projection agents/vscode/v0", () => {
      const entry = {
        category: "agents",
        slug: "agents-vscode-0",
        title: "agents 0",
        description: "desc",
        tags: ["t-0", "agents"],
        keywords: ["k-0"],
        platforms: ["vscode"],
        repoUrl: "https://github.com/org/agents-0",
        dateAdded: "2026-01-01",
        safetyNotes: ["note"],
        privacyNotes: ["priv"],
      };
      const search = toSearchResult(entry, { score: 10, reasons: ["r0"] });
      const summary = toEntrySummary(entry);
      expect(search.key).toBe("agents:agents-vscode-0");
      expect(search.searchScore).toBe(10);
      expect(entryUpdatedAt(entry)).toMatch(/^2026-/);
      const other = { ...entry, slug: "other-0", tags: ["t-0"] };
      const related = scoreRelatedEntry(entry, other);
      expect(related?.score).toBeGreaterThan(0);
    });
    it("projection agents/vscode/v1", () => {
      const entry = {
        category: "agents",
        slug: "agents-vscode-1",
        title: "agents 1",
        description: "desc",
        tags: ["t-1", "agents"],
        keywords: ["k-1"],
        platforms: ["vscode"],
        repoUrl: "https://github.com/org/agents-1",
        dateAdded: "2026-01-02",
        safetyNotes: ["note"],
        privacyNotes: ["priv"],
      };
      const search = toSearchResult(entry, { score: 11, reasons: ["r1"] });
      const summary = toEntrySummary(entry);
      expect(search.key).toBe("agents:agents-vscode-1");
      expect(search.searchScore).toBe(11);
      expect(entryUpdatedAt(entry)).toMatch(/^2026-/);
      const other = { ...entry, slug: "other-1", tags: ["t-1"] };
      const related = scoreRelatedEntry(entry, other);
      expect(related?.score).toBeGreaterThan(0);
    });
    it("projection agents/vscode/v2", () => {
      const entry = {
        category: "agents",
        slug: "agents-vscode-2",
        title: "agents 2",
        description: "desc",
        tags: ["t-2", "agents"],
        keywords: ["k-2"],
        platforms: ["vscode"],
        repoUrl: "https://github.com/org/agents-2",
        dateAdded: "2026-01-03",
        safetyNotes: ["note"],
        privacyNotes: ["priv"],
      };
      const search = toSearchResult(entry, { score: 12, reasons: ["r2"] });
      const summary = toEntrySummary(entry);
      expect(search.key).toBe("agents:agents-vscode-2");
      expect(search.searchScore).toBe(12);
      expect(entryUpdatedAt(entry)).toMatch(/^2026-/);
      const other = { ...entry, slug: "other-2", tags: ["t-2"] };
      const related = scoreRelatedEntry(entry, other);
      expect(related?.score).toBeGreaterThan(0);
    });
    it("projection agents/jetbrains/v0", () => {
      const entry = {
        category: "agents",
        slug: "agents-jetbrains-0",
        title: "agents 0",
        description: "desc",
        tags: ["t-0", "agents"],
        keywords: ["k-0"],
        platforms: ["jetbrains"],
        repoUrl: "https://github.com/org/agents-0",
        dateAdded: "2026-01-01",
        safetyNotes: ["note"],
        privacyNotes: ["priv"],
      };
      const search = toSearchResult(entry, { score: 10, reasons: ["r0"] });
      const summary = toEntrySummary(entry);
      expect(search.key).toBe("agents:agents-jetbrains-0");
      expect(search.searchScore).toBe(10);
      expect(entryUpdatedAt(entry)).toMatch(/^2026-/);
      const other = { ...entry, slug: "other-0", tags: ["t-0"] };
      const related = scoreRelatedEntry(entry, other);
      expect(related?.score).toBeGreaterThan(0);
    });
    it("projection agents/jetbrains/v1", () => {
      const entry = {
        category: "agents",
        slug: "agents-jetbrains-1",
        title: "agents 1",
        description: "desc",
        tags: ["t-1", "agents"],
        keywords: ["k-1"],
        platforms: ["jetbrains"],
        repoUrl: "https://github.com/org/agents-1",
        dateAdded: "2026-01-02",
        safetyNotes: ["note"],
        privacyNotes: ["priv"],
      };
      const search = toSearchResult(entry, { score: 11, reasons: ["r1"] });
      const summary = toEntrySummary(entry);
      expect(search.key).toBe("agents:agents-jetbrains-1");
      expect(search.searchScore).toBe(11);
      expect(entryUpdatedAt(entry)).toMatch(/^2026-/);
      const other = { ...entry, slug: "other-1", tags: ["t-1"] };
      const related = scoreRelatedEntry(entry, other);
      expect(related?.score).toBeGreaterThan(0);
    });
    it("projection agents/jetbrains/v2", () => {
      const entry = {
        category: "agents",
        slug: "agents-jetbrains-2",
        title: "agents 2",
        description: "desc",
        tags: ["t-2", "agents"],
        keywords: ["k-2"],
        platforms: ["jetbrains"],
        repoUrl: "https://github.com/org/agents-2",
        dateAdded: "2026-01-03",
        safetyNotes: ["note"],
        privacyNotes: ["priv"],
      };
      const search = toSearchResult(entry, { score: 12, reasons: ["r2"] });
      const summary = toEntrySummary(entry);
      expect(search.key).toBe("agents:agents-jetbrains-2");
      expect(search.searchScore).toBe(12);
      expect(entryUpdatedAt(entry)).toMatch(/^2026-/);
      const other = { ...entry, slug: "other-2", tags: ["t-2"] };
      const related = scoreRelatedEntry(entry, other);
      expect(related?.score).toBeGreaterThan(0);
    });
    it("projection workflows/claude-code/v0", () => {
      const entry = {
        category: "workflows",
        slug: "workflows-claude-code-0",
        title: "workflows 0",
        description: "desc",
        tags: ["t-0", "workflows"],
        keywords: ["k-0"],
        platforms: ["claude-code"],
        repoUrl: "https://github.com/org/workflows-0",
        dateAdded: "2026-01-01",
        safetyNotes: ["note"],
        privacyNotes: ["priv"],
      };
      const search = toSearchResult(entry, { score: 10, reasons: ["r0"] });
      const summary = toEntrySummary(entry);
      expect(search.key).toBe("workflows:workflows-claude-code-0");
      expect(search.searchScore).toBe(10);
      expect(entryUpdatedAt(entry)).toMatch(/^2026-/);
      const other = { ...entry, slug: "other-0", tags: ["t-0"] };
      const related = scoreRelatedEntry(entry, other);
      expect(related?.score).toBeGreaterThan(0);
    });
    it("projection workflows/claude-code/v1", () => {
      const entry = {
        category: "workflows",
        slug: "workflows-claude-code-1",
        title: "workflows 1",
        description: "desc",
        tags: ["t-1", "workflows"],
        keywords: ["k-1"],
        platforms: ["claude-code"],
        repoUrl: "https://github.com/org/workflows-1",
        dateAdded: "2026-01-02",
        safetyNotes: ["note"],
        privacyNotes: ["priv"],
      };
      const search = toSearchResult(entry, { score: 11, reasons: ["r1"] });
      const summary = toEntrySummary(entry);
      expect(search.key).toBe("workflows:workflows-claude-code-1");
      expect(search.searchScore).toBe(11);
      expect(entryUpdatedAt(entry)).toMatch(/^2026-/);
      const other = { ...entry, slug: "other-1", tags: ["t-1"] };
      const related = scoreRelatedEntry(entry, other);
      expect(related?.score).toBeGreaterThan(0);
    });
    it("projection workflows/claude-code/v2", () => {
      const entry = {
        category: "workflows",
        slug: "workflows-claude-code-2",
        title: "workflows 2",
        description: "desc",
        tags: ["t-2", "workflows"],
        keywords: ["k-2"],
        platforms: ["claude-code"],
        repoUrl: "https://github.com/org/workflows-2",
        dateAdded: "2026-01-03",
        safetyNotes: ["note"],
        privacyNotes: ["priv"],
      };
      const search = toSearchResult(entry, { score: 12, reasons: ["r2"] });
      const summary = toEntrySummary(entry);
      expect(search.key).toBe("workflows:workflows-claude-code-2");
      expect(search.searchScore).toBe(12);
      expect(entryUpdatedAt(entry)).toMatch(/^2026-/);
      const other = { ...entry, slug: "other-2", tags: ["t-2"] };
      const related = scoreRelatedEntry(entry, other);
      expect(related?.score).toBeGreaterThan(0);
    });
    it("projection workflows/cursor/v0", () => {
      const entry = {
        category: "workflows",
        slug: "workflows-cursor-0",
        title: "workflows 0",
        description: "desc",
        tags: ["t-0", "workflows"],
        keywords: ["k-0"],
        platforms: ["cursor"],
        repoUrl: "https://github.com/org/workflows-0",
        dateAdded: "2026-01-01",
        safetyNotes: ["note"],
        privacyNotes: ["priv"],
      };
      const search = toSearchResult(entry, { score: 10, reasons: ["r0"] });
      const summary = toEntrySummary(entry);
      expect(search.key).toBe("workflows:workflows-cursor-0");
      expect(search.searchScore).toBe(10);
      expect(entryUpdatedAt(entry)).toMatch(/^2026-/);
      const other = { ...entry, slug: "other-0", tags: ["t-0"] };
      const related = scoreRelatedEntry(entry, other);
      expect(related?.score).toBeGreaterThan(0);
    });
    it("projection workflows/cursor/v1", () => {
      const entry = {
        category: "workflows",
        slug: "workflows-cursor-1",
        title: "workflows 1",
        description: "desc",
        tags: ["t-1", "workflows"],
        keywords: ["k-1"],
        platforms: ["cursor"],
        repoUrl: "https://github.com/org/workflows-1",
        dateAdded: "2026-01-02",
        safetyNotes: ["note"],
        privacyNotes: ["priv"],
      };
      const search = toSearchResult(entry, { score: 11, reasons: ["r1"] });
      const summary = toEntrySummary(entry);
      expect(search.key).toBe("workflows:workflows-cursor-1");
      expect(search.searchScore).toBe(11);
      expect(entryUpdatedAt(entry)).toMatch(/^2026-/);
      const other = { ...entry, slug: "other-1", tags: ["t-1"] };
      const related = scoreRelatedEntry(entry, other);
      expect(related?.score).toBeGreaterThan(0);
    });
    it("projection workflows/cursor/v2", () => {
      const entry = {
        category: "workflows",
        slug: "workflows-cursor-2",
        title: "workflows 2",
        description: "desc",
        tags: ["t-2", "workflows"],
        keywords: ["k-2"],
        platforms: ["cursor"],
        repoUrl: "https://github.com/org/workflows-2",
        dateAdded: "2026-01-03",
        safetyNotes: ["note"],
        privacyNotes: ["priv"],
      };
      const search = toSearchResult(entry, { score: 12, reasons: ["r2"] });
      const summary = toEntrySummary(entry);
      expect(search.key).toBe("workflows:workflows-cursor-2");
      expect(search.searchScore).toBe(12);
      expect(entryUpdatedAt(entry)).toMatch(/^2026-/);
      const other = { ...entry, slug: "other-2", tags: ["t-2"] };
      const related = scoreRelatedEntry(entry, other);
      expect(related?.score).toBeGreaterThan(0);
    });
    it("projection workflows/codex/v0", () => {
      const entry = {
        category: "workflows",
        slug: "workflows-codex-0",
        title: "workflows 0",
        description: "desc",
        tags: ["t-0", "workflows"],
        keywords: ["k-0"],
        platforms: ["codex"],
        repoUrl: "https://github.com/org/workflows-0",
        dateAdded: "2026-01-01",
        safetyNotes: ["note"],
        privacyNotes: ["priv"],
      };
      const search = toSearchResult(entry, { score: 10, reasons: ["r0"] });
      const summary = toEntrySummary(entry);
      expect(search.key).toBe("workflows:workflows-codex-0");
      expect(search.searchScore).toBe(10);
      expect(entryUpdatedAt(entry)).toMatch(/^2026-/);
      const other = { ...entry, slug: "other-0", tags: ["t-0"] };
      const related = scoreRelatedEntry(entry, other);
      expect(related?.score).toBeGreaterThan(0);
    });
    it("projection workflows/codex/v1", () => {
      const entry = {
        category: "workflows",
        slug: "workflows-codex-1",
        title: "workflows 1",
        description: "desc",
        tags: ["t-1", "workflows"],
        keywords: ["k-1"],
        platforms: ["codex"],
        repoUrl: "https://github.com/org/workflows-1",
        dateAdded: "2026-01-02",
        safetyNotes: ["note"],
        privacyNotes: ["priv"],
      };
      const search = toSearchResult(entry, { score: 11, reasons: ["r1"] });
      const summary = toEntrySummary(entry);
      expect(search.key).toBe("workflows:workflows-codex-1");
      expect(search.searchScore).toBe(11);
      expect(entryUpdatedAt(entry)).toMatch(/^2026-/);
      const other = { ...entry, slug: "other-1", tags: ["t-1"] };
      const related = scoreRelatedEntry(entry, other);
      expect(related?.score).toBeGreaterThan(0);
    });
    it("projection workflows/codex/v2", () => {
      const entry = {
        category: "workflows",
        slug: "workflows-codex-2",
        title: "workflows 2",
        description: "desc",
        tags: ["t-2", "workflows"],
        keywords: ["k-2"],
        platforms: ["codex"],
        repoUrl: "https://github.com/org/workflows-2",
        dateAdded: "2026-01-03",
        safetyNotes: ["note"],
        privacyNotes: ["priv"],
      };
      const search = toSearchResult(entry, { score: 12, reasons: ["r2"] });
      const summary = toEntrySummary(entry);
      expect(search.key).toBe("workflows:workflows-codex-2");
      expect(search.searchScore).toBe(12);
      expect(entryUpdatedAt(entry)).toMatch(/^2026-/);
      const other = { ...entry, slug: "other-2", tags: ["t-2"] };
      const related = scoreRelatedEntry(entry, other);
      expect(related?.score).toBeGreaterThan(0);
    });
    it("projection workflows/windsurf/v0", () => {
      const entry = {
        category: "workflows",
        slug: "workflows-windsurf-0",
        title: "workflows 0",
        description: "desc",
        tags: ["t-0", "workflows"],
        keywords: ["k-0"],
        platforms: ["windsurf"],
        repoUrl: "https://github.com/org/workflows-0",
        dateAdded: "2026-01-01",
        safetyNotes: ["note"],
        privacyNotes: ["priv"],
      };
      const search = toSearchResult(entry, { score: 10, reasons: ["r0"] });
      const summary = toEntrySummary(entry);
      expect(search.key).toBe("workflows:workflows-windsurf-0");
      expect(search.searchScore).toBe(10);
      expect(entryUpdatedAt(entry)).toMatch(/^2026-/);
      const other = { ...entry, slug: "other-0", tags: ["t-0"] };
      const related = scoreRelatedEntry(entry, other);
      expect(related?.score).toBeGreaterThan(0);
    });
    it("projection workflows/windsurf/v1", () => {
      const entry = {
        category: "workflows",
        slug: "workflows-windsurf-1",
        title: "workflows 1",
        description: "desc",
        tags: ["t-1", "workflows"],
        keywords: ["k-1"],
        platforms: ["windsurf"],
        repoUrl: "https://github.com/org/workflows-1",
        dateAdded: "2026-01-02",
        safetyNotes: ["note"],
        privacyNotes: ["priv"],
      };
      const search = toSearchResult(entry, { score: 11, reasons: ["r1"] });
      const summary = toEntrySummary(entry);
      expect(search.key).toBe("workflows:workflows-windsurf-1");
      expect(search.searchScore).toBe(11);
      expect(entryUpdatedAt(entry)).toMatch(/^2026-/);
      const other = { ...entry, slug: "other-1", tags: ["t-1"] };
      const related = scoreRelatedEntry(entry, other);
      expect(related?.score).toBeGreaterThan(0);
    });
    it("projection workflows/windsurf/v2", () => {
      const entry = {
        category: "workflows",
        slug: "workflows-windsurf-2",
        title: "workflows 2",
        description: "desc",
        tags: ["t-2", "workflows"],
        keywords: ["k-2"],
        platforms: ["windsurf"],
        repoUrl: "https://github.com/org/workflows-2",
        dateAdded: "2026-01-03",
        safetyNotes: ["note"],
        privacyNotes: ["priv"],
      };
      const search = toSearchResult(entry, { score: 12, reasons: ["r2"] });
      const summary = toEntrySummary(entry);
      expect(search.key).toBe("workflows:workflows-windsurf-2");
      expect(search.searchScore).toBe(12);
      expect(entryUpdatedAt(entry)).toMatch(/^2026-/);
      const other = { ...entry, slug: "other-2", tags: ["t-2"] };
      const related = scoreRelatedEntry(entry, other);
      expect(related?.score).toBeGreaterThan(0);
    });
    it("projection workflows/vscode/v0", () => {
      const entry = {
        category: "workflows",
        slug: "workflows-vscode-0",
        title: "workflows 0",
        description: "desc",
        tags: ["t-0", "workflows"],
        keywords: ["k-0"],
        platforms: ["vscode"],
        repoUrl: "https://github.com/org/workflows-0",
        dateAdded: "2026-01-01",
        safetyNotes: ["note"],
        privacyNotes: ["priv"],
      };
      const search = toSearchResult(entry, { score: 10, reasons: ["r0"] });
      const summary = toEntrySummary(entry);
      expect(search.key).toBe("workflows:workflows-vscode-0");
      expect(search.searchScore).toBe(10);
      expect(entryUpdatedAt(entry)).toMatch(/^2026-/);
      const other = { ...entry, slug: "other-0", tags: ["t-0"] };
      const related = scoreRelatedEntry(entry, other);
      expect(related?.score).toBeGreaterThan(0);
    });
    it("projection workflows/vscode/v1", () => {
      const entry = {
        category: "workflows",
        slug: "workflows-vscode-1",
        title: "workflows 1",
        description: "desc",
        tags: ["t-1", "workflows"],
        keywords: ["k-1"],
        platforms: ["vscode"],
        repoUrl: "https://github.com/org/workflows-1",
        dateAdded: "2026-01-02",
        safetyNotes: ["note"],
        privacyNotes: ["priv"],
      };
      const search = toSearchResult(entry, { score: 11, reasons: ["r1"] });
      const summary = toEntrySummary(entry);
      expect(search.key).toBe("workflows:workflows-vscode-1");
      expect(search.searchScore).toBe(11);
      expect(entryUpdatedAt(entry)).toMatch(/^2026-/);
      const other = { ...entry, slug: "other-1", tags: ["t-1"] };
      const related = scoreRelatedEntry(entry, other);
      expect(related?.score).toBeGreaterThan(0);
    });
    it("projection workflows/vscode/v2", () => {
      const entry = {
        category: "workflows",
        slug: "workflows-vscode-2",
        title: "workflows 2",
        description: "desc",
        tags: ["t-2", "workflows"],
        keywords: ["k-2"],
        platforms: ["vscode"],
        repoUrl: "https://github.com/org/workflows-2",
        dateAdded: "2026-01-03",
        safetyNotes: ["note"],
        privacyNotes: ["priv"],
      };
      const search = toSearchResult(entry, { score: 12, reasons: ["r2"] });
      const summary = toEntrySummary(entry);
      expect(search.key).toBe("workflows:workflows-vscode-2");
      expect(search.searchScore).toBe(12);
      expect(entryUpdatedAt(entry)).toMatch(/^2026-/);
      const other = { ...entry, slug: "other-2", tags: ["t-2"] };
      const related = scoreRelatedEntry(entry, other);
      expect(related?.score).toBeGreaterThan(0);
    });
    it("projection workflows/jetbrains/v0", () => {
      const entry = {
        category: "workflows",
        slug: "workflows-jetbrains-0",
        title: "workflows 0",
        description: "desc",
        tags: ["t-0", "workflows"],
        keywords: ["k-0"],
        platforms: ["jetbrains"],
        repoUrl: "https://github.com/org/workflows-0",
        dateAdded: "2026-01-01",
        safetyNotes: ["note"],
        privacyNotes: ["priv"],
      };
      const search = toSearchResult(entry, { score: 10, reasons: ["r0"] });
      const summary = toEntrySummary(entry);
      expect(search.key).toBe("workflows:workflows-jetbrains-0");
      expect(search.searchScore).toBe(10);
      expect(entryUpdatedAt(entry)).toMatch(/^2026-/);
      const other = { ...entry, slug: "other-0", tags: ["t-0"] };
      const related = scoreRelatedEntry(entry, other);
      expect(related?.score).toBeGreaterThan(0);
    });
    it("projection workflows/jetbrains/v1", () => {
      const entry = {
        category: "workflows",
        slug: "workflows-jetbrains-1",
        title: "workflows 1",
        description: "desc",
        tags: ["t-1", "workflows"],
        keywords: ["k-1"],
        platforms: ["jetbrains"],
        repoUrl: "https://github.com/org/workflows-1",
        dateAdded: "2026-01-02",
        safetyNotes: ["note"],
        privacyNotes: ["priv"],
      };
      const search = toSearchResult(entry, { score: 11, reasons: ["r1"] });
      const summary = toEntrySummary(entry);
      expect(search.key).toBe("workflows:workflows-jetbrains-1");
      expect(search.searchScore).toBe(11);
      expect(entryUpdatedAt(entry)).toMatch(/^2026-/);
      const other = { ...entry, slug: "other-1", tags: ["t-1"] };
      const related = scoreRelatedEntry(entry, other);
      expect(related?.score).toBeGreaterThan(0);
    });
    it("projection workflows/jetbrains/v2", () => {
      const entry = {
        category: "workflows",
        slug: "workflows-jetbrains-2",
        title: "workflows 2",
        description: "desc",
        tags: ["t-2", "workflows"],
        keywords: ["k-2"],
        platforms: ["jetbrains"],
        repoUrl: "https://github.com/org/workflows-2",
        dateAdded: "2026-01-03",
        safetyNotes: ["note"],
        privacyNotes: ["priv"],
      };
      const search = toSearchResult(entry, { score: 12, reasons: ["r2"] });
      const summary = toEntrySummary(entry);
      expect(search.key).toBe("workflows:workflows-jetbrains-2");
      expect(search.searchScore).toBe(12);
      expect(entryUpdatedAt(entry)).toMatch(/^2026-/);
      const other = { ...entry, slug: "other-2", tags: ["t-2"] };
      const related = scoreRelatedEntry(entry, other);
      expect(related?.score).toBeGreaterThan(0);
    });
  });
});

describe("registry-projection missing-field defaults", () => {
  const minimal = {
    category: "mcp",
    slug: "s",
    title: "T",
    description: "D",
  };

  it("defaults array/string fields when the entry omits them", () => {
    const result = toSearchResult(minimal);
    expect(result.tags).toEqual([]);
    expect(result.platforms).toEqual([]);
    expect(result.brandName).toBe("");

    const summary = toEntrySummary(minimal);
    expect(summary.dateAdded).toBe("");
    expect(summary.supportLevels).toEqual([]);
  });

  it("coerces falsy platform values through the intersection mapper", () => {
    const target = {
      category: "mcp",
      slug: "a",
      tags: ["x"],
      keywords: [],
      platforms: [null],
    };
    const candidate = {
      category: "mcp",
      slug: "b",
      tags: ["x"],
      keywords: [],
      platforms: [null],
    };
    expect(scoreRelatedEntry(target, candidate)).not.toBeNull();
  });
});
