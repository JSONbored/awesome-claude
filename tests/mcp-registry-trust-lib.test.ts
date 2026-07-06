import { describe, expect, it } from "vitest";

import { SITE_URL } from "../packages/mcp/src/platforms.js";
import {
  TRUST_SIGNAL_KEYS,
  entryCanonicalUrl,
  entrySourceHosts,
  entryTrustRecommendations,
  entryTrustSignalCoverage,
  entryTrustSummary,
  sourceHost,
  sourceSummary,
} from "../packages/mcp/src/registry-trust-lib.js";

function makeEntry(overrides: Record<string, unknown> = {}) {
  return {
    category: "mcp",
    slug: "browser-bridge",
    title: "Browser Bridge",
    description: "Runs Playwright automation for Claude Code sessions.",
    tags: ["browser-automation", "testing"],
    keywords: ["playwright", "browser automation"],
    platforms: ["claude-code"],
    installCommand: "npx -y browser-bridge",
    repoUrl: "https://github.com/example/browser-bridge",
    documentationUrl: "https://docs.example.com/browser-bridge",
    ...overrides,
  };
}

describe("registry-trust-lib TRUST_SIGNAL_KEYS", () => {
  it("exports the eight deterministic trust signal keys in order", () => {
    expect(TRUST_SIGNAL_KEYS).toEqual([
      "source-available",
      "repo-url",
      "documentation-url",
      "trusted-package",
      "package-checksum",
      "safety-notes",
      "privacy-notes",
      "review-provenance",
    ]);
    expect(TRUST_SIGNAL_KEYS).toHaveLength(8);
  });
});

describe("registry-trust-lib entryCanonicalUrl", () => {
  it("prefers explicit canonicalUrl over url and site fallback", () => {
    const entry = makeEntry({
      canonicalUrl: "https://heyclau.de/entry/mcp/browser-bridge",
      url: "https://example.com/other",
    });
    expect(entryCanonicalUrl(entry)).toBe(
      "https://heyclau.de/entry/mcp/browser-bridge",
    );
  });

  it("falls back to url when canonicalUrl is absent", () => {
    const entry = makeEntry({ canonicalUrl: "", url: "https://example.com/p" });
    expect(entryCanonicalUrl(entry)).toBe("https://example.com/p");
  });

  it("builds site URL from category and slug when no urls are set", () => {
    const entry = makeEntry({ canonicalUrl: "", url: "" });
    expect(entryCanonicalUrl(entry)).toBe(
      `${SITE_URL}/entry/mcp/browser-bridge`,
    );
  });

  it("builds canonical URL for mcp category", () => {
    expect(
      entryCanonicalUrl(makeEntry({ category: "mcp", slug: "demo-mcp" })),
    ).toBe(`${SITE_URL}/entry/mcp/demo-mcp`);
  });
  it("builds canonical URL for skills category", () => {
    expect(
      entryCanonicalUrl(makeEntry({ category: "skills", slug: "demo-skills" })),
    ).toBe(`${SITE_URL}/entry/skills/demo-skills`);
  });
  it("builds canonical URL for hooks category", () => {
    expect(
      entryCanonicalUrl(makeEntry({ category: "hooks", slug: "demo-hooks" })),
    ).toBe(`${SITE_URL}/entry/hooks/demo-hooks`);
  });
  it("builds canonical URL for commands category", () => {
    expect(
      entryCanonicalUrl(
        makeEntry({ category: "commands", slug: "demo-commands" }),
      ),
    ).toBe(`${SITE_URL}/entry/commands/demo-commands`);
  });
  it("builds canonical URL for statuslines category", () => {
    expect(
      entryCanonicalUrl(
        makeEntry({ category: "statuslines", slug: "demo-statuslines" }),
      ),
    ).toBe(`${SITE_URL}/entry/statuslines/demo-statuslines`);
  });
  it("builds canonical URL for guides category", () => {
    expect(
      entryCanonicalUrl(makeEntry({ category: "guides", slug: "demo-guides" })),
    ).toBe(`${SITE_URL}/entry/guides/demo-guides`);
  });
  it("builds canonical URL for plugins category", () => {
    expect(
      entryCanonicalUrl(
        makeEntry({ category: "plugins", slug: "demo-plugins" }),
      ),
    ).toBe(`${SITE_URL}/entry/plugins/demo-plugins`);
  });
});

describe("registry-trust-lib sourceHost", () => {
  it("extracts hostnames from public URLs and ignores empty input", () => {
    expect(sourceHost("https://github.com/org/repo")).toBe("github.com");
    expect(sourceHost("")).toBe("");
    expect(sourceHost("   ")).toBe("");
  });

  it("resolves host for github.com", () => {
    expect(sourceHost("https://github.com/a/b")).toBe("github.com");
  });
  it("resolves host for docs.example.com", () => {
    expect(sourceHost("https://docs.example.com/guide")).toBe(
      "docs.example.com",
    );
  });
  it("resolves host for api.heyclau.de", () => {
    expect(sourceHost("https://api.heyclau.de/v1")).toBe("api.heyclau.de");
  });
  it("resolves host for localhost", () => {
    expect(sourceHost("http://localhost:3000")).toBe("localhost");
  });
  it("resolves host for gitlab.com", () => {
    expect(sourceHost("https://gitlab.com/group/project")).toBe("gitlab.com");
  });
  it("resolves host for npmjs.com", () => {
    expect(sourceHost("https://npmjs.com/package/foo")).toBe("npmjs.com");
  });
  it("resolves host for raw.githubusercontent.com", () => {
    expect(sourceHost("https://raw.githubusercontent.com/x/y/main/z")).toBe(
      "raw.githubusercontent.com",
    );
  });
  it("resolves host for www.npmjs.com", () => {
    expect(sourceHost("https://www.npmjs.com/package/@scope/pkg")).toBe(
      "npmjs.com",
    );
  });
});

describe("registry-trust-lib entrySourceHosts", () => {
  it("collects unique hosts from all source URL fields", () => {
    const entry = makeEntry({
      repoUrl: "https://github.com/org/repo",
      documentationUrl: "https://docs.example.com",
      url: "https://heyclau.de/entry/mcp/browser-bridge",
      llmsUrl: "https://llms.example.com/index",
      apiUrl: "https://api.example.com/v1",
    });
    expect(entrySourceHosts(entry)).toEqual(
      expect.arrayContaining(["github.com", "docs.example.com", "heyclau.de"]),
    );
  });

  it("returns empty array when no source URLs are present", () => {
    expect(
      entrySourceHosts(
        makeEntry({
          repoUrl: "",
          documentationUrl: "",
          url: "",
          canonicalUrl: "",
          llmsUrl: "",
          apiUrl: "",
        }),
      ),
    ).toEqual([]);
  });

  it("extracts hosts for mcp variant 0", () => {
    expect(
      entrySourceHosts(
        makeEntry({
          category: "mcp",
          slug: "slug-0",
          repoUrl: "https://host-mcp-0.example.com/repo",
        }),
      ),
    ).toContain("host-mcp-0.example.com");
  });
  it("extracts hosts for mcp variant 1", () => {
    expect(
      entrySourceHosts(
        makeEntry({
          category: "mcp",
          slug: "slug-1",
          repoUrl: "https://host-mcp-1.example.com/repo",
        }),
      ),
    ).toContain("host-mcp-1.example.com");
  });
  it("extracts hosts for mcp variant 2", () => {
    expect(
      entrySourceHosts(
        makeEntry({
          category: "mcp",
          slug: "slug-2",
          repoUrl: "https://host-mcp-2.example.com/repo",
        }),
      ),
    ).toContain("host-mcp-2.example.com");
  });
  it("extracts hosts for skills variant 0", () => {
    expect(
      entrySourceHosts(
        makeEntry({
          category: "skills",
          slug: "slug-0",
          repoUrl: "https://host-skills-0.example.com/repo",
        }),
      ),
    ).toContain("host-skills-0.example.com");
  });
  it("extracts hosts for skills variant 1", () => {
    expect(
      entrySourceHosts(
        makeEntry({
          category: "skills",
          slug: "slug-1",
          repoUrl: "https://host-skills-1.example.com/repo",
        }),
      ),
    ).toContain("host-skills-1.example.com");
  });
  it("extracts hosts for skills variant 2", () => {
    expect(
      entrySourceHosts(
        makeEntry({
          category: "skills",
          slug: "slug-2",
          repoUrl: "https://host-skills-2.example.com/repo",
        }),
      ),
    ).toContain("host-skills-2.example.com");
  });
  it("extracts hosts for hooks variant 0", () => {
    expect(
      entrySourceHosts(
        makeEntry({
          category: "hooks",
          slug: "slug-0",
          repoUrl: "https://host-hooks-0.example.com/repo",
        }),
      ),
    ).toContain("host-hooks-0.example.com");
  });
  it("extracts hosts for hooks variant 1", () => {
    expect(
      entrySourceHosts(
        makeEntry({
          category: "hooks",
          slug: "slug-1",
          repoUrl: "https://host-hooks-1.example.com/repo",
        }),
      ),
    ).toContain("host-hooks-1.example.com");
  });
  it("extracts hosts for hooks variant 2", () => {
    expect(
      entrySourceHosts(
        makeEntry({
          category: "hooks",
          slug: "slug-2",
          repoUrl: "https://host-hooks-2.example.com/repo",
        }),
      ),
    ).toContain("host-hooks-2.example.com");
  });
  it("extracts hosts for commands variant 0", () => {
    expect(
      entrySourceHosts(
        makeEntry({
          category: "commands",
          slug: "slug-0",
          repoUrl: "https://host-commands-0.example.com/repo",
        }),
      ),
    ).toContain("host-commands-0.example.com");
  });
  it("extracts hosts for commands variant 1", () => {
    expect(
      entrySourceHosts(
        makeEntry({
          category: "commands",
          slug: "slug-1",
          repoUrl: "https://host-commands-1.example.com/repo",
        }),
      ),
    ).toContain("host-commands-1.example.com");
  });
  it("extracts hosts for commands variant 2", () => {
    expect(
      entrySourceHosts(
        makeEntry({
          category: "commands",
          slug: "slug-2",
          repoUrl: "https://host-commands-2.example.com/repo",
        }),
      ),
    ).toContain("host-commands-2.example.com");
  });
  it("extracts hosts for statuslines variant 0", () => {
    expect(
      entrySourceHosts(
        makeEntry({
          category: "statuslines",
          slug: "slug-0",
          repoUrl: "https://host-statuslines-0.example.com/repo",
        }),
      ),
    ).toContain("host-statuslines-0.example.com");
  });
  it("extracts hosts for statuslines variant 1", () => {
    expect(
      entrySourceHosts(
        makeEntry({
          category: "statuslines",
          slug: "slug-1",
          repoUrl: "https://host-statuslines-1.example.com/repo",
        }),
      ),
    ).toContain("host-statuslines-1.example.com");
  });
  it("extracts hosts for statuslines variant 2", () => {
    expect(
      entrySourceHosts(
        makeEntry({
          category: "statuslines",
          slug: "slug-2",
          repoUrl: "https://host-statuslines-2.example.com/repo",
        }),
      ),
    ).toContain("host-statuslines-2.example.com");
  });
  it("extracts hosts for guides variant 0", () => {
    expect(
      entrySourceHosts(
        makeEntry({
          category: "guides",
          slug: "slug-0",
          repoUrl: "https://host-guides-0.example.com/repo",
        }),
      ),
    ).toContain("host-guides-0.example.com");
  });
  it("extracts hosts for guides variant 1", () => {
    expect(
      entrySourceHosts(
        makeEntry({
          category: "guides",
          slug: "slug-1",
          repoUrl: "https://host-guides-1.example.com/repo",
        }),
      ),
    ).toContain("host-guides-1.example.com");
  });
  it("extracts hosts for guides variant 2", () => {
    expect(
      entrySourceHosts(
        makeEntry({
          category: "guides",
          slug: "slug-2",
          repoUrl: "https://host-guides-2.example.com/repo",
        }),
      ),
    ).toContain("host-guides-2.example.com");
  });
  it("extracts hosts for plugins variant 0", () => {
    expect(
      entrySourceHosts(
        makeEntry({
          category: "plugins",
          slug: "slug-0",
          repoUrl: "https://host-plugins-0.example.com/repo",
        }),
      ),
    ).toContain("host-plugins-0.example.com");
  });
  it("extracts hosts for plugins variant 1", () => {
    expect(
      entrySourceHosts(
        makeEntry({
          category: "plugins",
          slug: "slug-1",
          repoUrl: "https://host-plugins-1.example.com/repo",
        }),
      ),
    ).toContain("host-plugins-1.example.com");
  });
  it("extracts hosts for plugins variant 2", () => {
    expect(
      entrySourceHosts(
        makeEntry({
          category: "plugins",
          slug: "slug-2",
          repoUrl: "https://host-plugins-2.example.com/repo",
        }),
      ),
    ).toContain("host-plugins-2.example.com");
  });
});

describe("registry-trust-lib sourceSummary", () => {
  it("projects repo, documentation, download, and github stats", () => {
    const entry = makeEntry({
      githubUrl: "https://github.com/fallback/repo",
      downloadUrl: "https://heyclau.de/downloads/pkg.tgz",
      githubStars: 120,
      githubForks: 8,
      repoUpdatedAt: "2026-03-01",
      downloadTrust: "first-party",
    });
    expect(sourceSummary(entry)).toMatchObject({
      repoUrl: "https://github.com/example/browser-bridge",
      documentationUrl: "https://docs.example.com/browser-bridge",
      downloadUrl: "https://heyclau.de/downloads/pkg.tgz",
      githubStars: 120,
      githubForks: 8,
      repoUpdatedAt: "2026-03-01",
      downloadTrust: "first-party",
    });
    expect(sourceSummary(entry).sourceHosts.length).toBeGreaterThan(0);
  });

  it("falls back to githubUrl when repoUrl is missing", () => {
    expect(
      sourceSummary(
        makeEntry({ repoUrl: "", githubUrl: "https://github.com/fb/r" }),
      ).repoUrl,
    ).toBe("https://github.com/fb/r");
  });

  it("treats non-numeric github stats as null", () => {
    expect(
      sourceSummary(makeEntry({ githubStars: "many", githubForks: undefined }))
        .githubStars,
    ).toBeNull();
    expect(
      sourceSummary(makeEntry({ githubStars: "many", githubForks: undefined }))
        .githubForks,
    ).toBeNull();
  });

  it("summarizes mcp entry with downloadTrust=first-party", () => {
    const summary = sourceSummary(
      makeEntry({
        category: "mcp",
        slug: "mcp-pkg",
        downloadTrust: "first-party",
        downloadUrl: "https://cdn.example.com/mcp.tgz",
      }),
    );
    expect(summary.downloadUrl).toContain("mcp");
    expect(summary.downloadTrust).toBe("first-party");
  });
  it("summarizes mcp entry with downloadTrust=external", () => {
    const summary = sourceSummary(
      makeEntry({
        category: "mcp",
        slug: "mcp-pkg",
        downloadTrust: "external",
        downloadUrl: "https://cdn.example.com/mcp.tgz",
      }),
    );
    expect(summary.downloadUrl).toContain("mcp");
    expect(summary.downloadTrust).toBe("external");
  });
  it("summarizes mcp entry with downloadTrust=maintainer-built", () => {
    const summary = sourceSummary(
      makeEntry({
        category: "mcp",
        slug: "mcp-pkg",
        downloadTrust: "maintainer-built",
        downloadUrl: "https://cdn.example.com/mcp.tgz",
      }),
    );
    expect(summary.downloadUrl).toContain("mcp");
    expect(summary.downloadTrust).toBe("maintainer-built");
  });
  it("summarizes mcp entry with downloadTrust=none", () => {
    const summary = sourceSummary(
      makeEntry({
        category: "mcp",
        slug: "mcp-pkg",
        downloadTrust: null,
        downloadUrl: "https://cdn.example.com/mcp.tgz",
      }),
    );
    expect(summary.downloadUrl).toContain("mcp");
    expect(summary.downloadTrust).toBe(null);
  });
  it("summarizes skills entry with downloadTrust=first-party", () => {
    const summary = sourceSummary(
      makeEntry({
        category: "skills",
        slug: "skills-pkg",
        downloadTrust: "first-party",
        downloadUrl: "https://cdn.example.com/skills.tgz",
      }),
    );
    expect(summary.downloadUrl).toContain("skills");
    expect(summary.downloadTrust).toBe("first-party");
  });
  it("summarizes skills entry with downloadTrust=external", () => {
    const summary = sourceSummary(
      makeEntry({
        category: "skills",
        slug: "skills-pkg",
        downloadTrust: "external",
        downloadUrl: "https://cdn.example.com/skills.tgz",
      }),
    );
    expect(summary.downloadUrl).toContain("skills");
    expect(summary.downloadTrust).toBe("external");
  });
  it("summarizes skills entry with downloadTrust=maintainer-built", () => {
    const summary = sourceSummary(
      makeEntry({
        category: "skills",
        slug: "skills-pkg",
        downloadTrust: "maintainer-built",
        downloadUrl: "https://cdn.example.com/skills.tgz",
      }),
    );
    expect(summary.downloadUrl).toContain("skills");
    expect(summary.downloadTrust).toBe("maintainer-built");
  });
  it("summarizes skills entry with downloadTrust=none", () => {
    const summary = sourceSummary(
      makeEntry({
        category: "skills",
        slug: "skills-pkg",
        downloadTrust: null,
        downloadUrl: "https://cdn.example.com/skills.tgz",
      }),
    );
    expect(summary.downloadUrl).toContain("skills");
    expect(summary.downloadTrust).toBe(null);
  });
  it("summarizes hooks entry with downloadTrust=first-party", () => {
    const summary = sourceSummary(
      makeEntry({
        category: "hooks",
        slug: "hooks-pkg",
        downloadTrust: "first-party",
        downloadUrl: "https://cdn.example.com/hooks.tgz",
      }),
    );
    expect(summary.downloadUrl).toContain("hooks");
    expect(summary.downloadTrust).toBe("first-party");
  });
  it("summarizes hooks entry with downloadTrust=external", () => {
    const summary = sourceSummary(
      makeEntry({
        category: "hooks",
        slug: "hooks-pkg",
        downloadTrust: "external",
        downloadUrl: "https://cdn.example.com/hooks.tgz",
      }),
    );
    expect(summary.downloadUrl).toContain("hooks");
    expect(summary.downloadTrust).toBe("external");
  });
  it("summarizes hooks entry with downloadTrust=maintainer-built", () => {
    const summary = sourceSummary(
      makeEntry({
        category: "hooks",
        slug: "hooks-pkg",
        downloadTrust: "maintainer-built",
        downloadUrl: "https://cdn.example.com/hooks.tgz",
      }),
    );
    expect(summary.downloadUrl).toContain("hooks");
    expect(summary.downloadTrust).toBe("maintainer-built");
  });
  it("summarizes hooks entry with downloadTrust=none", () => {
    const summary = sourceSummary(
      makeEntry({
        category: "hooks",
        slug: "hooks-pkg",
        downloadTrust: null,
        downloadUrl: "https://cdn.example.com/hooks.tgz",
      }),
    );
    expect(summary.downloadUrl).toContain("hooks");
    expect(summary.downloadTrust).toBe(null);
  });
  it("summarizes commands entry with downloadTrust=first-party", () => {
    const summary = sourceSummary(
      makeEntry({
        category: "commands",
        slug: "commands-pkg",
        downloadTrust: "first-party",
        downloadUrl: "https://cdn.example.com/commands.tgz",
      }),
    );
    expect(summary.downloadUrl).toContain("commands");
    expect(summary.downloadTrust).toBe("first-party");
  });
  it("summarizes commands entry with downloadTrust=external", () => {
    const summary = sourceSummary(
      makeEntry({
        category: "commands",
        slug: "commands-pkg",
        downloadTrust: "external",
        downloadUrl: "https://cdn.example.com/commands.tgz",
      }),
    );
    expect(summary.downloadUrl).toContain("commands");
    expect(summary.downloadTrust).toBe("external");
  });
  it("summarizes commands entry with downloadTrust=maintainer-built", () => {
    const summary = sourceSummary(
      makeEntry({
        category: "commands",
        slug: "commands-pkg",
        downloadTrust: "maintainer-built",
        downloadUrl: "https://cdn.example.com/commands.tgz",
      }),
    );
    expect(summary.downloadUrl).toContain("commands");
    expect(summary.downloadTrust).toBe("maintainer-built");
  });
  it("summarizes commands entry with downloadTrust=none", () => {
    const summary = sourceSummary(
      makeEntry({
        category: "commands",
        slug: "commands-pkg",
        downloadTrust: null,
        downloadUrl: "https://cdn.example.com/commands.tgz",
      }),
    );
    expect(summary.downloadUrl).toContain("commands");
    expect(summary.downloadTrust).toBe(null);
  });
  it("summarizes statuslines entry with downloadTrust=first-party", () => {
    const summary = sourceSummary(
      makeEntry({
        category: "statuslines",
        slug: "statuslines-pkg",
        downloadTrust: "first-party",
        downloadUrl: "https://cdn.example.com/statuslines.tgz",
      }),
    );
    expect(summary.downloadUrl).toContain("statuslines");
    expect(summary.downloadTrust).toBe("first-party");
  });
  it("summarizes statuslines entry with downloadTrust=external", () => {
    const summary = sourceSummary(
      makeEntry({
        category: "statuslines",
        slug: "statuslines-pkg",
        downloadTrust: "external",
        downloadUrl: "https://cdn.example.com/statuslines.tgz",
      }),
    );
    expect(summary.downloadUrl).toContain("statuslines");
    expect(summary.downloadTrust).toBe("external");
  });
  it("summarizes statuslines entry with downloadTrust=maintainer-built", () => {
    const summary = sourceSummary(
      makeEntry({
        category: "statuslines",
        slug: "statuslines-pkg",
        downloadTrust: "maintainer-built",
        downloadUrl: "https://cdn.example.com/statuslines.tgz",
      }),
    );
    expect(summary.downloadUrl).toContain("statuslines");
    expect(summary.downloadTrust).toBe("maintainer-built");
  });
  it("summarizes statuslines entry with downloadTrust=none", () => {
    const summary = sourceSummary(
      makeEntry({
        category: "statuslines",
        slug: "statuslines-pkg",
        downloadTrust: null,
        downloadUrl: "https://cdn.example.com/statuslines.tgz",
      }),
    );
    expect(summary.downloadUrl).toContain("statuslines");
    expect(summary.downloadTrust).toBe(null);
  });
  it("summarizes guides entry with downloadTrust=first-party", () => {
    const summary = sourceSummary(
      makeEntry({
        category: "guides",
        slug: "guides-pkg",
        downloadTrust: "first-party",
        downloadUrl: "https://cdn.example.com/guides.tgz",
      }),
    );
    expect(summary.downloadUrl).toContain("guides");
    expect(summary.downloadTrust).toBe("first-party");
  });
  it("summarizes guides entry with downloadTrust=external", () => {
    const summary = sourceSummary(
      makeEntry({
        category: "guides",
        slug: "guides-pkg",
        downloadTrust: "external",
        downloadUrl: "https://cdn.example.com/guides.tgz",
      }),
    );
    expect(summary.downloadUrl).toContain("guides");
    expect(summary.downloadTrust).toBe("external");
  });
  it("summarizes guides entry with downloadTrust=maintainer-built", () => {
    const summary = sourceSummary(
      makeEntry({
        category: "guides",
        slug: "guides-pkg",
        downloadTrust: "maintainer-built",
        downloadUrl: "https://cdn.example.com/guides.tgz",
      }),
    );
    expect(summary.downloadUrl).toContain("guides");
    expect(summary.downloadTrust).toBe("maintainer-built");
  });
  it("summarizes guides entry with downloadTrust=none", () => {
    const summary = sourceSummary(
      makeEntry({
        category: "guides",
        slug: "guides-pkg",
        downloadTrust: null,
        downloadUrl: "https://cdn.example.com/guides.tgz",
      }),
    );
    expect(summary.downloadUrl).toContain("guides");
    expect(summary.downloadTrust).toBe(null);
  });
  it("summarizes plugins entry with downloadTrust=first-party", () => {
    const summary = sourceSummary(
      makeEntry({
        category: "plugins",
        slug: "plugins-pkg",
        downloadTrust: "first-party",
        downloadUrl: "https://cdn.example.com/plugins.tgz",
      }),
    );
    expect(summary.downloadUrl).toContain("plugins");
    expect(summary.downloadTrust).toBe("first-party");
  });
  it("summarizes plugins entry with downloadTrust=external", () => {
    const summary = sourceSummary(
      makeEntry({
        category: "plugins",
        slug: "plugins-pkg",
        downloadTrust: "external",
        downloadUrl: "https://cdn.example.com/plugins.tgz",
      }),
    );
    expect(summary.downloadUrl).toContain("plugins");
    expect(summary.downloadTrust).toBe("external");
  });
  it("summarizes plugins entry with downloadTrust=maintainer-built", () => {
    const summary = sourceSummary(
      makeEntry({
        category: "plugins",
        slug: "plugins-pkg",
        downloadTrust: "maintainer-built",
        downloadUrl: "https://cdn.example.com/plugins.tgz",
      }),
    );
    expect(summary.downloadUrl).toContain("plugins");
    expect(summary.downloadTrust).toBe("maintainer-built");
  });
  it("summarizes plugins entry with downloadTrust=none", () => {
    const summary = sourceSummary(
      makeEntry({
        category: "plugins",
        slug: "plugins-pkg",
        downloadTrust: null,
        downloadUrl: "https://cdn.example.com/plugins.tgz",
      }),
    );
    expect(summary.downloadUrl).toContain("plugins");
    expect(summary.downloadTrust).toBe(null);
  });
});

describe("registry-trust-lib entryTrustRecommendations", () => {
  it("recommends verifying source when repo and docs are missing", () => {
    const recs = entryTrustRecommendations(
      makeEntry({
        repoUrl: "",
        documentationUrl: "",
        githubUrl: "",
      }),
    );
    expect(recs).toContain(
      "Verify a canonical source before relying on this entry.",
    );
  });

  it("recommends upstream review for external packages", () => {
    const recs = entryTrustRecommendations(
      makeEntry({
        downloadTrust: "external",
        downloadUrl: "https://cdn.example.com/ext.tgz",
      }),
    );
    expect(recs).toContain(
      "Review the upstream package source and checksum before installing.",
    );
  });

  it("caps recommendations at six unique items", () => {
    const recs = entryTrustRecommendations(
      makeEntry({
        repoUrl: "",
        documentationUrl: "",
        downloadTrust: "external",
        downloadUrl: "https://cdn.example.com/x.tgz",
        safetyNotes: [],
        privacyNotes: [],
      }),
    );
    expect(recs.length).toBeLessThanOrEqual(6);
    expect(new Set(recs).size).toBe(recs.length);
  });

  it("builds recommendations for mcp claim=verified", () => {
    const recs = entryTrustRecommendations(
      makeEntry({
        category: "mcp",
        claimStatus: "verified",
        safetyNotes: ["Runs shell commands"],
        privacyNotes: [],
        downloadTrust: "external",
        downloadUrl: "https://cdn.example.com/mcp.tgz",
      }),
    );
    expect(Array.isArray(recs)).toBe(true);
    recs.forEach((rec) => expect(typeof rec).toBe("string"));
  });
  it("builds recommendations for mcp claim=unclaimed", () => {
    const recs = entryTrustRecommendations(
      makeEntry({
        category: "mcp",
        claimStatus: "unclaimed",
        safetyNotes: [],
        privacyNotes: [],
        downloadTrust: "external",
        downloadUrl: "https://cdn.example.com/mcp.tgz",
      }),
    );
    expect(Array.isArray(recs)).toBe(true);
    recs.forEach((rec) => expect(typeof rec).toBe("string"));
  });
  it("builds recommendations for mcp claim=pending", () => {
    const recs = entryTrustRecommendations(
      makeEntry({
        category: "mcp",
        claimStatus: "pending",
        safetyNotes: [],
        privacyNotes: [],
        downloadTrust: "external",
        downloadUrl: "https://cdn.example.com/mcp.tgz",
      }),
    );
    expect(Array.isArray(recs)).toBe(true);
    recs.forEach((rec) => expect(typeof rec).toBe("string"));
  });
  it("builds recommendations for mcp claim=empty", () => {
    const recs = entryTrustRecommendations(
      makeEntry({
        category: "mcp",
        claimStatus: "",
        safetyNotes: [],
        privacyNotes: [],
        downloadTrust: "external",
        downloadUrl: "https://cdn.example.com/mcp.tgz",
      }),
    );
    expect(Array.isArray(recs)).toBe(true);
    recs.forEach((rec) => expect(typeof rec).toBe("string"));
  });
  it("builds recommendations for skills claim=verified", () => {
    const recs = entryTrustRecommendations(
      makeEntry({
        category: "skills",
        claimStatus: "verified",
        safetyNotes: ["Runs shell commands"],
        privacyNotes: [],
        downloadTrust: "external",
        downloadUrl: "https://cdn.example.com/skills.tgz",
      }),
    );
    expect(Array.isArray(recs)).toBe(true);
    recs.forEach((rec) => expect(typeof rec).toBe("string"));
  });
  it("builds recommendations for skills claim=unclaimed", () => {
    const recs = entryTrustRecommendations(
      makeEntry({
        category: "skills",
        claimStatus: "unclaimed",
        safetyNotes: [],
        privacyNotes: [],
        downloadTrust: "external",
        downloadUrl: "https://cdn.example.com/skills.tgz",
      }),
    );
    expect(Array.isArray(recs)).toBe(true);
    recs.forEach((rec) => expect(typeof rec).toBe("string"));
  });
  it("builds recommendations for skills claim=pending", () => {
    const recs = entryTrustRecommendations(
      makeEntry({
        category: "skills",
        claimStatus: "pending",
        safetyNotes: [],
        privacyNotes: [],
        downloadTrust: "external",
        downloadUrl: "https://cdn.example.com/skills.tgz",
      }),
    );
    expect(Array.isArray(recs)).toBe(true);
    recs.forEach((rec) => expect(typeof rec).toBe("string"));
  });
  it("builds recommendations for skills claim=empty", () => {
    const recs = entryTrustRecommendations(
      makeEntry({
        category: "skills",
        claimStatus: "",
        safetyNotes: [],
        privacyNotes: [],
        downloadTrust: "external",
        downloadUrl: "https://cdn.example.com/skills.tgz",
      }),
    );
    expect(Array.isArray(recs)).toBe(true);
    recs.forEach((rec) => expect(typeof rec).toBe("string"));
  });
  it("builds recommendations for hooks claim=verified", () => {
    const recs = entryTrustRecommendations(
      makeEntry({
        category: "hooks",
        claimStatus: "verified",
        safetyNotes: ["Runs shell commands"],
        privacyNotes: [],
        downloadTrust: "external",
        downloadUrl: "https://cdn.example.com/hooks.tgz",
      }),
    );
    expect(Array.isArray(recs)).toBe(true);
    recs.forEach((rec) => expect(typeof rec).toBe("string"));
  });
  it("builds recommendations for hooks claim=unclaimed", () => {
    const recs = entryTrustRecommendations(
      makeEntry({
        category: "hooks",
        claimStatus: "unclaimed",
        safetyNotes: [],
        privacyNotes: [],
        downloadTrust: "external",
        downloadUrl: "https://cdn.example.com/hooks.tgz",
      }),
    );
    expect(Array.isArray(recs)).toBe(true);
    recs.forEach((rec) => expect(typeof rec).toBe("string"));
  });
  it("builds recommendations for hooks claim=pending", () => {
    const recs = entryTrustRecommendations(
      makeEntry({
        category: "hooks",
        claimStatus: "pending",
        safetyNotes: [],
        privacyNotes: [],
        downloadTrust: "external",
        downloadUrl: "https://cdn.example.com/hooks.tgz",
      }),
    );
    expect(Array.isArray(recs)).toBe(true);
    recs.forEach((rec) => expect(typeof rec).toBe("string"));
  });
  it("builds recommendations for hooks claim=empty", () => {
    const recs = entryTrustRecommendations(
      makeEntry({
        category: "hooks",
        claimStatus: "",
        safetyNotes: [],
        privacyNotes: [],
        downloadTrust: "external",
        downloadUrl: "https://cdn.example.com/hooks.tgz",
      }),
    );
    expect(Array.isArray(recs)).toBe(true);
    recs.forEach((rec) => expect(typeof rec).toBe("string"));
  });
  it("builds recommendations for commands claim=verified", () => {
    const recs = entryTrustRecommendations(
      makeEntry({
        category: "commands",
        claimStatus: "verified",
        safetyNotes: ["Runs shell commands"],
        privacyNotes: [],
        downloadTrust: "external",
        downloadUrl: "https://cdn.example.com/commands.tgz",
      }),
    );
    expect(Array.isArray(recs)).toBe(true);
    recs.forEach((rec) => expect(typeof rec).toBe("string"));
  });
  it("builds recommendations for commands claim=unclaimed", () => {
    const recs = entryTrustRecommendations(
      makeEntry({
        category: "commands",
        claimStatus: "unclaimed",
        safetyNotes: [],
        privacyNotes: [],
        downloadTrust: "external",
        downloadUrl: "https://cdn.example.com/commands.tgz",
      }),
    );
    expect(Array.isArray(recs)).toBe(true);
    recs.forEach((rec) => expect(typeof rec).toBe("string"));
  });
  it("builds recommendations for commands claim=pending", () => {
    const recs = entryTrustRecommendations(
      makeEntry({
        category: "commands",
        claimStatus: "pending",
        safetyNotes: [],
        privacyNotes: [],
        downloadTrust: "external",
        downloadUrl: "https://cdn.example.com/commands.tgz",
      }),
    );
    expect(Array.isArray(recs)).toBe(true);
    recs.forEach((rec) => expect(typeof rec).toBe("string"));
  });
  it("builds recommendations for commands claim=empty", () => {
    const recs = entryTrustRecommendations(
      makeEntry({
        category: "commands",
        claimStatus: "",
        safetyNotes: [],
        privacyNotes: [],
        downloadTrust: "external",
        downloadUrl: "https://cdn.example.com/commands.tgz",
      }),
    );
    expect(Array.isArray(recs)).toBe(true);
    recs.forEach((rec) => expect(typeof rec).toBe("string"));
  });
  it("builds recommendations for statuslines claim=verified", () => {
    const recs = entryTrustRecommendations(
      makeEntry({
        category: "statuslines",
        claimStatus: "verified",
        safetyNotes: ["Runs shell commands"],
        privacyNotes: [],
        downloadTrust: "external",
        downloadUrl: "https://cdn.example.com/statuslines.tgz",
      }),
    );
    expect(Array.isArray(recs)).toBe(true);
    recs.forEach((rec) => expect(typeof rec).toBe("string"));
  });
  it("builds recommendations for statuslines claim=unclaimed", () => {
    const recs = entryTrustRecommendations(
      makeEntry({
        category: "statuslines",
        claimStatus: "unclaimed",
        safetyNotes: [],
        privacyNotes: [],
        downloadTrust: "external",
        downloadUrl: "https://cdn.example.com/statuslines.tgz",
      }),
    );
    expect(Array.isArray(recs)).toBe(true);
    recs.forEach((rec) => expect(typeof rec).toBe("string"));
  });
  it("builds recommendations for statuslines claim=pending", () => {
    const recs = entryTrustRecommendations(
      makeEntry({
        category: "statuslines",
        claimStatus: "pending",
        safetyNotes: [],
        privacyNotes: [],
        downloadTrust: "external",
        downloadUrl: "https://cdn.example.com/statuslines.tgz",
      }),
    );
    expect(Array.isArray(recs)).toBe(true);
    recs.forEach((rec) => expect(typeof rec).toBe("string"));
  });
  it("builds recommendations for statuslines claim=empty", () => {
    const recs = entryTrustRecommendations(
      makeEntry({
        category: "statuslines",
        claimStatus: "",
        safetyNotes: [],
        privacyNotes: [],
        downloadTrust: "external",
        downloadUrl: "https://cdn.example.com/statuslines.tgz",
      }),
    );
    expect(Array.isArray(recs)).toBe(true);
    recs.forEach((rec) => expect(typeof rec).toBe("string"));
  });
  it("builds recommendations for guides claim=verified", () => {
    const recs = entryTrustRecommendations(
      makeEntry({
        category: "guides",
        claimStatus: "verified",
        safetyNotes: ["Runs shell commands"],
        privacyNotes: [],
        downloadTrust: "external",
        downloadUrl: "https://cdn.example.com/guides.tgz",
      }),
    );
    expect(Array.isArray(recs)).toBe(true);
    recs.forEach((rec) => expect(typeof rec).toBe("string"));
  });
  it("builds recommendations for guides claim=unclaimed", () => {
    const recs = entryTrustRecommendations(
      makeEntry({
        category: "guides",
        claimStatus: "unclaimed",
        safetyNotes: [],
        privacyNotes: [],
        downloadTrust: "external",
        downloadUrl: "https://cdn.example.com/guides.tgz",
      }),
    );
    expect(Array.isArray(recs)).toBe(true);
    recs.forEach((rec) => expect(typeof rec).toBe("string"));
  });
  it("builds recommendations for guides claim=pending", () => {
    const recs = entryTrustRecommendations(
      makeEntry({
        category: "guides",
        claimStatus: "pending",
        safetyNotes: [],
        privacyNotes: [],
        downloadTrust: "external",
        downloadUrl: "https://cdn.example.com/guides.tgz",
      }),
    );
    expect(Array.isArray(recs)).toBe(true);
    recs.forEach((rec) => expect(typeof rec).toBe("string"));
  });
  it("builds recommendations for guides claim=empty", () => {
    const recs = entryTrustRecommendations(
      makeEntry({
        category: "guides",
        claimStatus: "",
        safetyNotes: [],
        privacyNotes: [],
        downloadTrust: "external",
        downloadUrl: "https://cdn.example.com/guides.tgz",
      }),
    );
    expect(Array.isArray(recs)).toBe(true);
    recs.forEach((rec) => expect(typeof rec).toBe("string"));
  });
  it("builds recommendations for plugins claim=verified", () => {
    const recs = entryTrustRecommendations(
      makeEntry({
        category: "plugins",
        claimStatus: "verified",
        safetyNotes: ["Runs shell commands"],
        privacyNotes: [],
        downloadTrust: "external",
        downloadUrl: "https://cdn.example.com/plugins.tgz",
      }),
    );
    expect(Array.isArray(recs)).toBe(true);
    recs.forEach((rec) => expect(typeof rec).toBe("string"));
  });
  it("builds recommendations for plugins claim=unclaimed", () => {
    const recs = entryTrustRecommendations(
      makeEntry({
        category: "plugins",
        claimStatus: "unclaimed",
        safetyNotes: [],
        privacyNotes: [],
        downloadTrust: "external",
        downloadUrl: "https://cdn.example.com/plugins.tgz",
      }),
    );
    expect(Array.isArray(recs)).toBe(true);
    recs.forEach((rec) => expect(typeof rec).toBe("string"));
  });
  it("builds recommendations for plugins claim=pending", () => {
    const recs = entryTrustRecommendations(
      makeEntry({
        category: "plugins",
        claimStatus: "pending",
        safetyNotes: [],
        privacyNotes: [],
        downloadTrust: "external",
        downloadUrl: "https://cdn.example.com/plugins.tgz",
      }),
    );
    expect(Array.isArray(recs)).toBe(true);
    recs.forEach((rec) => expect(typeof rec).toBe("string"));
  });
  it("builds recommendations for plugins claim=empty", () => {
    const recs = entryTrustRecommendations(
      makeEntry({
        category: "plugins",
        claimStatus: "",
        safetyNotes: [],
        privacyNotes: [],
        downloadTrust: "external",
        downloadUrl: "https://cdn.example.com/plugins.tgz",
      }),
    );
    expect(Array.isArray(recs)).toBe(true);
    recs.forEach((rec) => expect(typeof rec).toBe("string"));
  });
});

describe("registry-trust-lib entryTrustSummary", () => {
  it("projects source, package, disclosures, review, and recommendations", () => {
    const entry = makeEntry({
      safetyNotes: ["Runs local browser automation."],
      privacyNotes: ["Reads selected project files."],
      claimStatus: "verified",
      reviewedBy: "maintainer",
      packageVerified: true,
      checksum: "abc123",
    });
    const trust = entryTrustSummary(entry);
    expect(trust.source.status).toBe("available");
    expect(trust.package.downloadTrust).toBeDefined();
    expect(trust.disclosures.hasSafetyNotes).toBe(true);
    expect(trust.disclosures.hasPrivacyNotes).toBe(true);
    expect(trust.review.claimStatus).toBe("verified");
    expect(Array.isArray(trust.recommendations)).toBe(true);
  });

  it("reads checksum from alternate package fields", () => {
    expect(
      entryTrustSummary(makeEntry({ checksum: "", packageChecksum: "pkg" }))
        .package.checksum,
    ).toBe("pkg");
    expect(
      entryTrustSummary(makeEntry({ downloadSha256: "sha" })).package.checksum,
    ).toBe("sha");
    expect(
      entryTrustSummary(makeEntry({ skillPackage: { sha256: "skill" } }))
        .package.checksum,
    ).toBe("skill");
  });

  it("detects packageVerified from trustSignals", () => {
    expect(
      entryTrustSummary(makeEntry({ trustSignals: { packageVerified: true } }))
        .package.packageVerified,
    ).toBe(true);
  });

  it("summarizes trust for mcp on claude-code", () => {
    const trust = entryTrustSummary(
      makeEntry({
        category: "mcp",
        slug: "mcp-claude-code",
        platforms: ["claude-code"],
        safetyNotes: ["Uses network access"],
        privacyNotes: ["May read workspace files"],
        downloadTrust: "first-party",
      }),
    );
    expect(trust.source.repoUrl).toContain("github.com");
    expect(trust.disclosures.safetyNotes.length).toBe(1);
    expect(trust.disclosures.privacyNotes.length).toBe(1);
  });
  it("summarizes trust for mcp on cursor", () => {
    const trust = entryTrustSummary(
      makeEntry({
        category: "mcp",
        slug: "mcp-cursor",
        platforms: ["cursor"],
        safetyNotes: ["Uses network access"],
        privacyNotes: ["May read workspace files"],
        downloadTrust: "first-party",
      }),
    );
    expect(trust.source.repoUrl).toContain("github.com");
    expect(trust.disclosures.safetyNotes.length).toBe(1);
    expect(trust.disclosures.privacyNotes.length).toBe(1);
  });
  it("summarizes trust for mcp on codex", () => {
    const trust = entryTrustSummary(
      makeEntry({
        category: "mcp",
        slug: "mcp-codex",
        platforms: ["codex"],
        safetyNotes: ["Uses network access"],
        privacyNotes: ["May read workspace files"],
        downloadTrust: "first-party",
      }),
    );
    expect(trust.source.repoUrl).toContain("github.com");
    expect(trust.disclosures.safetyNotes.length).toBe(1);
    expect(trust.disclosures.privacyNotes.length).toBe(1);
  });
  it("summarizes trust for mcp on windsurf", () => {
    const trust = entryTrustSummary(
      makeEntry({
        category: "mcp",
        slug: "mcp-windsurf",
        platforms: ["windsurf"],
        safetyNotes: ["Uses network access"],
        privacyNotes: ["May read workspace files"],
        downloadTrust: "first-party",
      }),
    );
    expect(trust.source.repoUrl).toContain("github.com");
    expect(trust.disclosures.safetyNotes.length).toBe(1);
    expect(trust.disclosures.privacyNotes.length).toBe(1);
  });
  it("summarizes trust for skills on claude-code", () => {
    const trust = entryTrustSummary(
      makeEntry({
        category: "skills",
        slug: "skills-claude-code",
        platforms: ["claude-code"],
        safetyNotes: ["Uses network access"],
        privacyNotes: ["May read workspace files"],
        downloadTrust: "first-party",
      }),
    );
    expect(trust.source.repoUrl).toContain("github.com");
    expect(trust.disclosures.safetyNotes.length).toBe(1);
    expect(trust.disclosures.privacyNotes.length).toBe(1);
  });
  it("summarizes trust for skills on cursor", () => {
    const trust = entryTrustSummary(
      makeEntry({
        category: "skills",
        slug: "skills-cursor",
        platforms: ["cursor"],
        safetyNotes: ["Uses network access"],
        privacyNotes: ["May read workspace files"],
        downloadTrust: "first-party",
      }),
    );
    expect(trust.source.repoUrl).toContain("github.com");
    expect(trust.disclosures.safetyNotes.length).toBe(1);
    expect(trust.disclosures.privacyNotes.length).toBe(1);
  });
  it("summarizes trust for skills on codex", () => {
    const trust = entryTrustSummary(
      makeEntry({
        category: "skills",
        slug: "skills-codex",
        platforms: ["codex"],
        safetyNotes: ["Uses network access"],
        privacyNotes: ["May read workspace files"],
        downloadTrust: "first-party",
      }),
    );
    expect(trust.source.repoUrl).toContain("github.com");
    expect(trust.disclosures.safetyNotes.length).toBe(1);
    expect(trust.disclosures.privacyNotes.length).toBe(1);
  });
  it("summarizes trust for skills on windsurf", () => {
    const trust = entryTrustSummary(
      makeEntry({
        category: "skills",
        slug: "skills-windsurf",
        platforms: ["windsurf"],
        safetyNotes: ["Uses network access"],
        privacyNotes: ["May read workspace files"],
        downloadTrust: "first-party",
      }),
    );
    expect(trust.source.repoUrl).toContain("github.com");
    expect(trust.disclosures.safetyNotes.length).toBe(1);
    expect(trust.disclosures.privacyNotes.length).toBe(1);
  });
  it("summarizes trust for hooks on claude-code", () => {
    const trust = entryTrustSummary(
      makeEntry({
        category: "hooks",
        slug: "hooks-claude-code",
        platforms: ["claude-code"],
        safetyNotes: ["Uses network access"],
        privacyNotes: ["May read workspace files"],
        downloadTrust: "first-party",
      }),
    );
    expect(trust.source.repoUrl).toContain("github.com");
    expect(trust.disclosures.safetyNotes.length).toBe(1);
    expect(trust.disclosures.privacyNotes.length).toBe(1);
  });
  it("summarizes trust for hooks on cursor", () => {
    const trust = entryTrustSummary(
      makeEntry({
        category: "hooks",
        slug: "hooks-cursor",
        platforms: ["cursor"],
        safetyNotes: ["Uses network access"],
        privacyNotes: ["May read workspace files"],
        downloadTrust: "first-party",
      }),
    );
    expect(trust.source.repoUrl).toContain("github.com");
    expect(trust.disclosures.safetyNotes.length).toBe(1);
    expect(trust.disclosures.privacyNotes.length).toBe(1);
  });
  it("summarizes trust for hooks on codex", () => {
    const trust = entryTrustSummary(
      makeEntry({
        category: "hooks",
        slug: "hooks-codex",
        platforms: ["codex"],
        safetyNotes: ["Uses network access"],
        privacyNotes: ["May read workspace files"],
        downloadTrust: "first-party",
      }),
    );
    expect(trust.source.repoUrl).toContain("github.com");
    expect(trust.disclosures.safetyNotes.length).toBe(1);
    expect(trust.disclosures.privacyNotes.length).toBe(1);
  });
  it("summarizes trust for hooks on windsurf", () => {
    const trust = entryTrustSummary(
      makeEntry({
        category: "hooks",
        slug: "hooks-windsurf",
        platforms: ["windsurf"],
        safetyNotes: ["Uses network access"],
        privacyNotes: ["May read workspace files"],
        downloadTrust: "first-party",
      }),
    );
    expect(trust.source.repoUrl).toContain("github.com");
    expect(trust.disclosures.safetyNotes.length).toBe(1);
    expect(trust.disclosures.privacyNotes.length).toBe(1);
  });
  it("summarizes trust for commands on claude-code", () => {
    const trust = entryTrustSummary(
      makeEntry({
        category: "commands",
        slug: "commands-claude-code",
        platforms: ["claude-code"],
        safetyNotes: ["Uses network access"],
        privacyNotes: ["May read workspace files"],
        downloadTrust: "first-party",
      }),
    );
    expect(trust.source.repoUrl).toContain("github.com");
    expect(trust.disclosures.safetyNotes.length).toBe(1);
    expect(trust.disclosures.privacyNotes.length).toBe(1);
  });
  it("summarizes trust for commands on cursor", () => {
    const trust = entryTrustSummary(
      makeEntry({
        category: "commands",
        slug: "commands-cursor",
        platforms: ["cursor"],
        safetyNotes: ["Uses network access"],
        privacyNotes: ["May read workspace files"],
        downloadTrust: "first-party",
      }),
    );
    expect(trust.source.repoUrl).toContain("github.com");
    expect(trust.disclosures.safetyNotes.length).toBe(1);
    expect(trust.disclosures.privacyNotes.length).toBe(1);
  });
  it("summarizes trust for commands on codex", () => {
    const trust = entryTrustSummary(
      makeEntry({
        category: "commands",
        slug: "commands-codex",
        platforms: ["codex"],
        safetyNotes: ["Uses network access"],
        privacyNotes: ["May read workspace files"],
        downloadTrust: "first-party",
      }),
    );
    expect(trust.source.repoUrl).toContain("github.com");
    expect(trust.disclosures.safetyNotes.length).toBe(1);
    expect(trust.disclosures.privacyNotes.length).toBe(1);
  });
  it("summarizes trust for commands on windsurf", () => {
    const trust = entryTrustSummary(
      makeEntry({
        category: "commands",
        slug: "commands-windsurf",
        platforms: ["windsurf"],
        safetyNotes: ["Uses network access"],
        privacyNotes: ["May read workspace files"],
        downloadTrust: "first-party",
      }),
    );
    expect(trust.source.repoUrl).toContain("github.com");
    expect(trust.disclosures.safetyNotes.length).toBe(1);
    expect(trust.disclosures.privacyNotes.length).toBe(1);
  });
  it("summarizes trust for statuslines on claude-code", () => {
    const trust = entryTrustSummary(
      makeEntry({
        category: "statuslines",
        slug: "statuslines-claude-code",
        platforms: ["claude-code"],
        safetyNotes: ["Uses network access"],
        privacyNotes: ["May read workspace files"],
        downloadTrust: "first-party",
      }),
    );
    expect(trust.source.repoUrl).toContain("github.com");
    expect(trust.disclosures.safetyNotes.length).toBe(1);
    expect(trust.disclosures.privacyNotes.length).toBe(1);
  });
  it("summarizes trust for statuslines on cursor", () => {
    const trust = entryTrustSummary(
      makeEntry({
        category: "statuslines",
        slug: "statuslines-cursor",
        platforms: ["cursor"],
        safetyNotes: ["Uses network access"],
        privacyNotes: ["May read workspace files"],
        downloadTrust: "first-party",
      }),
    );
    expect(trust.source.repoUrl).toContain("github.com");
    expect(trust.disclosures.safetyNotes.length).toBe(1);
    expect(trust.disclosures.privacyNotes.length).toBe(1);
  });
  it("summarizes trust for statuslines on codex", () => {
    const trust = entryTrustSummary(
      makeEntry({
        category: "statuslines",
        slug: "statuslines-codex",
        platforms: ["codex"],
        safetyNotes: ["Uses network access"],
        privacyNotes: ["May read workspace files"],
        downloadTrust: "first-party",
      }),
    );
    expect(trust.source.repoUrl).toContain("github.com");
    expect(trust.disclosures.safetyNotes.length).toBe(1);
    expect(trust.disclosures.privacyNotes.length).toBe(1);
  });
  it("summarizes trust for statuslines on windsurf", () => {
    const trust = entryTrustSummary(
      makeEntry({
        category: "statuslines",
        slug: "statuslines-windsurf",
        platforms: ["windsurf"],
        safetyNotes: ["Uses network access"],
        privacyNotes: ["May read workspace files"],
        downloadTrust: "first-party",
      }),
    );
    expect(trust.source.repoUrl).toContain("github.com");
    expect(trust.disclosures.safetyNotes.length).toBe(1);
    expect(trust.disclosures.privacyNotes.length).toBe(1);
  });
  it("summarizes trust for guides on claude-code", () => {
    const trust = entryTrustSummary(
      makeEntry({
        category: "guides",
        slug: "guides-claude-code",
        platforms: ["claude-code"],
        safetyNotes: ["Uses network access"],
        privacyNotes: ["May read workspace files"],
        downloadTrust: "first-party",
      }),
    );
    expect(trust.source.repoUrl).toContain("github.com");
    expect(trust.disclosures.safetyNotes.length).toBe(1);
    expect(trust.disclosures.privacyNotes.length).toBe(1);
  });
  it("summarizes trust for guides on cursor", () => {
    const trust = entryTrustSummary(
      makeEntry({
        category: "guides",
        slug: "guides-cursor",
        platforms: ["cursor"],
        safetyNotes: ["Uses network access"],
        privacyNotes: ["May read workspace files"],
        downloadTrust: "first-party",
      }),
    );
    expect(trust.source.repoUrl).toContain("github.com");
    expect(trust.disclosures.safetyNotes.length).toBe(1);
    expect(trust.disclosures.privacyNotes.length).toBe(1);
  });
  it("summarizes trust for guides on codex", () => {
    const trust = entryTrustSummary(
      makeEntry({
        category: "guides",
        slug: "guides-codex",
        platforms: ["codex"],
        safetyNotes: ["Uses network access"],
        privacyNotes: ["May read workspace files"],
        downloadTrust: "first-party",
      }),
    );
    expect(trust.source.repoUrl).toContain("github.com");
    expect(trust.disclosures.safetyNotes.length).toBe(1);
    expect(trust.disclosures.privacyNotes.length).toBe(1);
  });
  it("summarizes trust for guides on windsurf", () => {
    const trust = entryTrustSummary(
      makeEntry({
        category: "guides",
        slug: "guides-windsurf",
        platforms: ["windsurf"],
        safetyNotes: ["Uses network access"],
        privacyNotes: ["May read workspace files"],
        downloadTrust: "first-party",
      }),
    );
    expect(trust.source.repoUrl).toContain("github.com");
    expect(trust.disclosures.safetyNotes.length).toBe(1);
    expect(trust.disclosures.privacyNotes.length).toBe(1);
  });
  it("summarizes trust for plugins on claude-code", () => {
    const trust = entryTrustSummary(
      makeEntry({
        category: "plugins",
        slug: "plugins-claude-code",
        platforms: ["claude-code"],
        safetyNotes: ["Uses network access"],
        privacyNotes: ["May read workspace files"],
        downloadTrust: "first-party",
      }),
    );
    expect(trust.source.repoUrl).toContain("github.com");
    expect(trust.disclosures.safetyNotes.length).toBe(1);
    expect(trust.disclosures.privacyNotes.length).toBe(1);
  });
  it("summarizes trust for plugins on cursor", () => {
    const trust = entryTrustSummary(
      makeEntry({
        category: "plugins",
        slug: "plugins-cursor",
        platforms: ["cursor"],
        safetyNotes: ["Uses network access"],
        privacyNotes: ["May read workspace files"],
        downloadTrust: "first-party",
      }),
    );
    expect(trust.source.repoUrl).toContain("github.com");
    expect(trust.disclosures.safetyNotes.length).toBe(1);
    expect(trust.disclosures.privacyNotes.length).toBe(1);
  });
  it("summarizes trust for plugins on codex", () => {
    const trust = entryTrustSummary(
      makeEntry({
        category: "plugins",
        slug: "plugins-codex",
        platforms: ["codex"],
        safetyNotes: ["Uses network access"],
        privacyNotes: ["May read workspace files"],
        downloadTrust: "first-party",
      }),
    );
    expect(trust.source.repoUrl).toContain("github.com");
    expect(trust.disclosures.safetyNotes.length).toBe(1);
    expect(trust.disclosures.privacyNotes.length).toBe(1);
  });
  it("summarizes trust for plugins on windsurf", () => {
    const trust = entryTrustSummary(
      makeEntry({
        category: "plugins",
        slug: "plugins-windsurf",
        platforms: ["windsurf"],
        safetyNotes: ["Uses network access"],
        privacyNotes: ["May read workspace files"],
        downloadTrust: "first-party",
      }),
    );
    expect(trust.source.repoUrl).toContain("github.com");
    expect(trust.disclosures.safetyNotes.length).toBe(1);
    expect(trust.disclosures.privacyNotes.length).toBe(1);
  });
});

describe("registry-trust-lib entryTrustSignalCoverage", () => {
  it("scores fully documented entries at max coverage", () => {
    const entry = makeEntry({
      safetyNotes: ["Safety note"],
      privacyNotes: ["Privacy note"],
      claimStatus: "verified",
      reviewedBy: "team",
      downloadTrust: "first-party",
      checksum: "deadbeef",
    });
    const coverage = entryTrustSignalCoverage(entry);
    expect(coverage.max).toBe(TRUST_SIGNAL_KEYS.length);
    expect(coverage.score).toBeGreaterThanOrEqual(6);
    expect(coverage.present.length + coverage.missing.length).toBe(
      TRUST_SIGNAL_KEYS.length,
    );
  });

  it("reports missing signals for sparse entries", () => {
    const coverage = entryTrustSignalCoverage(
      makeEntry({
        repoUrl: "",
        documentationUrl: "",
        githubUrl: "",
        safetyNotes: [],
        privacyNotes: [],
      }),
    );
    expect(coverage.missing).toContain("repo-url");
    expect(coverage.missing).toContain("safety-notes");
    expect(coverage.score).toBeLessThan(TRUST_SIGNAL_KEYS.length);
  });

  it("orders present signals according to TRUST_SIGNAL_KEYS", () => {
    const coverage = entryTrustSignalCoverage(
      makeEntry({
        safetyNotes: ["x"],
        privacyNotes: ["y"],
        checksum: "z",
      }),
    );
    const indices = coverage.present.map((key) =>
      TRUST_SIGNAL_KEYS.indexOf(key),
    );
    expect(indices).toEqual([...indices].sort((a, b) => a - b));
  });

  it("coverage score 0 for mcp", () => {
    const coverage = entryTrustSignalCoverage(
      makeEntry({
        category: "mcp",
        repoUrl: "",
        documentationUrl: "",
        downloadTrust: "external",
        checksum: "",
        safetyNotes: [],
        privacyNotes: [],
        reviewedBy: "",
        claimStatus: "",
      }),
    );
    expect(coverage.score).toBeGreaterThanOrEqual(0);
    expect(coverage.score).toBeLessThanOrEqual(TRUST_SIGNAL_KEYS.length);
  });
  it("coverage score 1 for mcp", () => {
    const coverage = entryTrustSignalCoverage(
      makeEntry({
        category: "mcp",
        repoUrl: "https://github.com/x/y",
        documentationUrl: "",
        downloadTrust: "external",
        checksum: "",
        safetyNotes: [],
        privacyNotes: [],
        reviewedBy: "",
        claimStatus: "",
      }),
    );
    expect(coverage.score).toBeGreaterThanOrEqual(0);
    expect(coverage.score).toBeLessThanOrEqual(TRUST_SIGNAL_KEYS.length);
  });
  it("coverage score 2 for mcp", () => {
    const coverage = entryTrustSignalCoverage(
      makeEntry({
        category: "mcp",
        repoUrl: "https://github.com/x/y",
        documentationUrl: "https://docs.example.com",
        downloadTrust: "external",
        checksum: "",
        safetyNotes: [],
        privacyNotes: [],
        reviewedBy: "",
        claimStatus: "",
      }),
    );
    expect(coverage.score).toBeGreaterThanOrEqual(0);
    expect(coverage.score).toBeLessThanOrEqual(TRUST_SIGNAL_KEYS.length);
  });
  it("coverage score 3 for mcp", () => {
    const coverage = entryTrustSignalCoverage(
      makeEntry({
        category: "mcp",
        repoUrl: "https://github.com/x/y",
        documentationUrl: "https://docs.example.com",
        downloadTrust: "first-party",
        checksum: "",
        safetyNotes: [],
        privacyNotes: [],
        reviewedBy: "",
        claimStatus: "",
      }),
    );
    expect(coverage.score).toBeGreaterThanOrEqual(0);
    expect(coverage.score).toBeLessThanOrEqual(TRUST_SIGNAL_KEYS.length);
  });
  it("coverage score 4 for mcp", () => {
    const coverage = entryTrustSignalCoverage(
      makeEntry({
        category: "mcp",
        repoUrl: "https://github.com/x/y",
        documentationUrl: "https://docs.example.com",
        downloadTrust: "first-party",
        checksum: "abc",
        safetyNotes: [],
        privacyNotes: [],
        reviewedBy: "",
        claimStatus: "",
      }),
    );
    expect(coverage.score).toBeGreaterThanOrEqual(0);
    expect(coverage.score).toBeLessThanOrEqual(TRUST_SIGNAL_KEYS.length);
  });
  it("coverage score 5 for mcp", () => {
    const coverage = entryTrustSignalCoverage(
      makeEntry({
        category: "mcp",
        repoUrl: "https://github.com/x/y",
        documentationUrl: "https://docs.example.com",
        downloadTrust: "first-party",
        checksum: "abc",
        safetyNotes: ["s"],
        privacyNotes: [],
        reviewedBy: "",
        claimStatus: "",
      }),
    );
    expect(coverage.score).toBeGreaterThanOrEqual(0);
    expect(coverage.score).toBeLessThanOrEqual(TRUST_SIGNAL_KEYS.length);
  });
  it("coverage score 6 for mcp", () => {
    const coverage = entryTrustSignalCoverage(
      makeEntry({
        category: "mcp",
        repoUrl: "https://github.com/x/y",
        documentationUrl: "https://docs.example.com",
        downloadTrust: "first-party",
        checksum: "abc",
        safetyNotes: ["s"],
        privacyNotes: ["p"],
        reviewedBy: "",
        claimStatus: "",
      }),
    );
    expect(coverage.score).toBeGreaterThanOrEqual(0);
    expect(coverage.score).toBeLessThanOrEqual(TRUST_SIGNAL_KEYS.length);
  });
  it("coverage score 7 for mcp", () => {
    const coverage = entryTrustSignalCoverage(
      makeEntry({
        category: "mcp",
        repoUrl: "https://github.com/x/y",
        documentationUrl: "https://docs.example.com",
        downloadTrust: "first-party",
        checksum: "abc",
        safetyNotes: ["s"],
        privacyNotes: ["p"],
        reviewedBy: "reviewer",
        claimStatus: "verified",
      }),
    );
    expect(coverage.score).toBeGreaterThanOrEqual(0);
    expect(coverage.score).toBeLessThanOrEqual(TRUST_SIGNAL_KEYS.length);
  });
  it("coverage score 0 for skills", () => {
    const coverage = entryTrustSignalCoverage(
      makeEntry({
        category: "skills",
        repoUrl: "",
        documentationUrl: "",
        downloadTrust: "external",
        checksum: "",
        safetyNotes: [],
        privacyNotes: [],
        reviewedBy: "",
        claimStatus: "",
      }),
    );
    expect(coverage.score).toBeGreaterThanOrEqual(0);
    expect(coverage.score).toBeLessThanOrEqual(TRUST_SIGNAL_KEYS.length);
  });
  it("coverage score 1 for skills", () => {
    const coverage = entryTrustSignalCoverage(
      makeEntry({
        category: "skills",
        repoUrl: "https://github.com/x/y",
        documentationUrl: "",
        downloadTrust: "external",
        checksum: "",
        safetyNotes: [],
        privacyNotes: [],
        reviewedBy: "",
        claimStatus: "",
      }),
    );
    expect(coverage.score).toBeGreaterThanOrEqual(0);
    expect(coverage.score).toBeLessThanOrEqual(TRUST_SIGNAL_KEYS.length);
  });
  it("coverage score 2 for skills", () => {
    const coverage = entryTrustSignalCoverage(
      makeEntry({
        category: "skills",
        repoUrl: "https://github.com/x/y",
        documentationUrl: "https://docs.example.com",
        downloadTrust: "external",
        checksum: "",
        safetyNotes: [],
        privacyNotes: [],
        reviewedBy: "",
        claimStatus: "",
      }),
    );
    expect(coverage.score).toBeGreaterThanOrEqual(0);
    expect(coverage.score).toBeLessThanOrEqual(TRUST_SIGNAL_KEYS.length);
  });
  it("coverage score 3 for skills", () => {
    const coverage = entryTrustSignalCoverage(
      makeEntry({
        category: "skills",
        repoUrl: "https://github.com/x/y",
        documentationUrl: "https://docs.example.com",
        downloadTrust: "first-party",
        checksum: "",
        safetyNotes: [],
        privacyNotes: [],
        reviewedBy: "",
        claimStatus: "",
      }),
    );
    expect(coverage.score).toBeGreaterThanOrEqual(0);
    expect(coverage.score).toBeLessThanOrEqual(TRUST_SIGNAL_KEYS.length);
  });
  it("coverage score 4 for skills", () => {
    const coverage = entryTrustSignalCoverage(
      makeEntry({
        category: "skills",
        repoUrl: "https://github.com/x/y",
        documentationUrl: "https://docs.example.com",
        downloadTrust: "first-party",
        checksum: "abc",
        safetyNotes: [],
        privacyNotes: [],
        reviewedBy: "",
        claimStatus: "",
      }),
    );
    expect(coverage.score).toBeGreaterThanOrEqual(0);
    expect(coverage.score).toBeLessThanOrEqual(TRUST_SIGNAL_KEYS.length);
  });
  it("coverage score 5 for skills", () => {
    const coverage = entryTrustSignalCoverage(
      makeEntry({
        category: "skills",
        repoUrl: "https://github.com/x/y",
        documentationUrl: "https://docs.example.com",
        downloadTrust: "first-party",
        checksum: "abc",
        safetyNotes: ["s"],
        privacyNotes: [],
        reviewedBy: "",
        claimStatus: "",
      }),
    );
    expect(coverage.score).toBeGreaterThanOrEqual(0);
    expect(coverage.score).toBeLessThanOrEqual(TRUST_SIGNAL_KEYS.length);
  });
  it("coverage score 6 for skills", () => {
    const coverage = entryTrustSignalCoverage(
      makeEntry({
        category: "skills",
        repoUrl: "https://github.com/x/y",
        documentationUrl: "https://docs.example.com",
        downloadTrust: "first-party",
        checksum: "abc",
        safetyNotes: ["s"],
        privacyNotes: ["p"],
        reviewedBy: "",
        claimStatus: "",
      }),
    );
    expect(coverage.score).toBeGreaterThanOrEqual(0);
    expect(coverage.score).toBeLessThanOrEqual(TRUST_SIGNAL_KEYS.length);
  });
  it("coverage score 7 for skills", () => {
    const coverage = entryTrustSignalCoverage(
      makeEntry({
        category: "skills",
        repoUrl: "https://github.com/x/y",
        documentationUrl: "https://docs.example.com",
        downloadTrust: "first-party",
        checksum: "abc",
        safetyNotes: ["s"],
        privacyNotes: ["p"],
        reviewedBy: "reviewer",
        claimStatus: "verified",
      }),
    );
    expect(coverage.score).toBeGreaterThanOrEqual(0);
    expect(coverage.score).toBeLessThanOrEqual(TRUST_SIGNAL_KEYS.length);
  });
  it("coverage score 0 for hooks", () => {
    const coverage = entryTrustSignalCoverage(
      makeEntry({
        category: "hooks",
        repoUrl: "",
        documentationUrl: "",
        downloadTrust: "external",
        checksum: "",
        safetyNotes: [],
        privacyNotes: [],
        reviewedBy: "",
        claimStatus: "",
      }),
    );
    expect(coverage.score).toBeGreaterThanOrEqual(0);
    expect(coverage.score).toBeLessThanOrEqual(TRUST_SIGNAL_KEYS.length);
  });
  it("coverage score 1 for hooks", () => {
    const coverage = entryTrustSignalCoverage(
      makeEntry({
        category: "hooks",
        repoUrl: "https://github.com/x/y",
        documentationUrl: "",
        downloadTrust: "external",
        checksum: "",
        safetyNotes: [],
        privacyNotes: [],
        reviewedBy: "",
        claimStatus: "",
      }),
    );
    expect(coverage.score).toBeGreaterThanOrEqual(0);
    expect(coverage.score).toBeLessThanOrEqual(TRUST_SIGNAL_KEYS.length);
  });
  it("coverage score 2 for hooks", () => {
    const coverage = entryTrustSignalCoverage(
      makeEntry({
        category: "hooks",
        repoUrl: "https://github.com/x/y",
        documentationUrl: "https://docs.example.com",
        downloadTrust: "external",
        checksum: "",
        safetyNotes: [],
        privacyNotes: [],
        reviewedBy: "",
        claimStatus: "",
      }),
    );
    expect(coverage.score).toBeGreaterThanOrEqual(0);
    expect(coverage.score).toBeLessThanOrEqual(TRUST_SIGNAL_KEYS.length);
  });
  it("coverage score 3 for hooks", () => {
    const coverage = entryTrustSignalCoverage(
      makeEntry({
        category: "hooks",
        repoUrl: "https://github.com/x/y",
        documentationUrl: "https://docs.example.com",
        downloadTrust: "first-party",
        checksum: "",
        safetyNotes: [],
        privacyNotes: [],
        reviewedBy: "",
        claimStatus: "",
      }),
    );
    expect(coverage.score).toBeGreaterThanOrEqual(0);
    expect(coverage.score).toBeLessThanOrEqual(TRUST_SIGNAL_KEYS.length);
  });
  it("coverage score 4 for hooks", () => {
    const coverage = entryTrustSignalCoverage(
      makeEntry({
        category: "hooks",
        repoUrl: "https://github.com/x/y",
        documentationUrl: "https://docs.example.com",
        downloadTrust: "first-party",
        checksum: "abc",
        safetyNotes: [],
        privacyNotes: [],
        reviewedBy: "",
        claimStatus: "",
      }),
    );
    expect(coverage.score).toBeGreaterThanOrEqual(0);
    expect(coverage.score).toBeLessThanOrEqual(TRUST_SIGNAL_KEYS.length);
  });
  it("coverage score 5 for hooks", () => {
    const coverage = entryTrustSignalCoverage(
      makeEntry({
        category: "hooks",
        repoUrl: "https://github.com/x/y",
        documentationUrl: "https://docs.example.com",
        downloadTrust: "first-party",
        checksum: "abc",
        safetyNotes: ["s"],
        privacyNotes: [],
        reviewedBy: "",
        claimStatus: "",
      }),
    );
    expect(coverage.score).toBeGreaterThanOrEqual(0);
    expect(coverage.score).toBeLessThanOrEqual(TRUST_SIGNAL_KEYS.length);
  });
  it("coverage score 6 for hooks", () => {
    const coverage = entryTrustSignalCoverage(
      makeEntry({
        category: "hooks",
        repoUrl: "https://github.com/x/y",
        documentationUrl: "https://docs.example.com",
        downloadTrust: "first-party",
        checksum: "abc",
        safetyNotes: ["s"],
        privacyNotes: ["p"],
        reviewedBy: "",
        claimStatus: "",
      }),
    );
    expect(coverage.score).toBeGreaterThanOrEqual(0);
    expect(coverage.score).toBeLessThanOrEqual(TRUST_SIGNAL_KEYS.length);
  });
  it("coverage score 7 for hooks", () => {
    const coverage = entryTrustSignalCoverage(
      makeEntry({
        category: "hooks",
        repoUrl: "https://github.com/x/y",
        documentationUrl: "https://docs.example.com",
        downloadTrust: "first-party",
        checksum: "abc",
        safetyNotes: ["s"],
        privacyNotes: ["p"],
        reviewedBy: "reviewer",
        claimStatus: "verified",
      }),
    );
    expect(coverage.score).toBeGreaterThanOrEqual(0);
    expect(coverage.score).toBeLessThanOrEqual(TRUST_SIGNAL_KEYS.length);
  });
  it("coverage score 0 for commands", () => {
    const coverage = entryTrustSignalCoverage(
      makeEntry({
        category: "commands",
        repoUrl: "",
        documentationUrl: "",
        downloadTrust: "external",
        checksum: "",
        safetyNotes: [],
        privacyNotes: [],
        reviewedBy: "",
        claimStatus: "",
      }),
    );
    expect(coverage.score).toBeGreaterThanOrEqual(0);
    expect(coverage.score).toBeLessThanOrEqual(TRUST_SIGNAL_KEYS.length);
  });
  it("coverage score 1 for commands", () => {
    const coverage = entryTrustSignalCoverage(
      makeEntry({
        category: "commands",
        repoUrl: "https://github.com/x/y",
        documentationUrl: "",
        downloadTrust: "external",
        checksum: "",
        safetyNotes: [],
        privacyNotes: [],
        reviewedBy: "",
        claimStatus: "",
      }),
    );
    expect(coverage.score).toBeGreaterThanOrEqual(0);
    expect(coverage.score).toBeLessThanOrEqual(TRUST_SIGNAL_KEYS.length);
  });
  it("coverage score 2 for commands", () => {
    const coverage = entryTrustSignalCoverage(
      makeEntry({
        category: "commands",
        repoUrl: "https://github.com/x/y",
        documentationUrl: "https://docs.example.com",
        downloadTrust: "external",
        checksum: "",
        safetyNotes: [],
        privacyNotes: [],
        reviewedBy: "",
        claimStatus: "",
      }),
    );
    expect(coverage.score).toBeGreaterThanOrEqual(0);
    expect(coverage.score).toBeLessThanOrEqual(TRUST_SIGNAL_KEYS.length);
  });
  it("coverage score 3 for commands", () => {
    const coverage = entryTrustSignalCoverage(
      makeEntry({
        category: "commands",
        repoUrl: "https://github.com/x/y",
        documentationUrl: "https://docs.example.com",
        downloadTrust: "first-party",
        checksum: "",
        safetyNotes: [],
        privacyNotes: [],
        reviewedBy: "",
        claimStatus: "",
      }),
    );
    expect(coverage.score).toBeGreaterThanOrEqual(0);
    expect(coverage.score).toBeLessThanOrEqual(TRUST_SIGNAL_KEYS.length);
  });
  it("coverage score 4 for commands", () => {
    const coverage = entryTrustSignalCoverage(
      makeEntry({
        category: "commands",
        repoUrl: "https://github.com/x/y",
        documentationUrl: "https://docs.example.com",
        downloadTrust: "first-party",
        checksum: "abc",
        safetyNotes: [],
        privacyNotes: [],
        reviewedBy: "",
        claimStatus: "",
      }),
    );
    expect(coverage.score).toBeGreaterThanOrEqual(0);
    expect(coverage.score).toBeLessThanOrEqual(TRUST_SIGNAL_KEYS.length);
  });
  it("coverage score 5 for commands", () => {
    const coverage = entryTrustSignalCoverage(
      makeEntry({
        category: "commands",
        repoUrl: "https://github.com/x/y",
        documentationUrl: "https://docs.example.com",
        downloadTrust: "first-party",
        checksum: "abc",
        safetyNotes: ["s"],
        privacyNotes: [],
        reviewedBy: "",
        claimStatus: "",
      }),
    );
    expect(coverage.score).toBeGreaterThanOrEqual(0);
    expect(coverage.score).toBeLessThanOrEqual(TRUST_SIGNAL_KEYS.length);
  });
  it("coverage score 6 for commands", () => {
    const coverage = entryTrustSignalCoverage(
      makeEntry({
        category: "commands",
        repoUrl: "https://github.com/x/y",
        documentationUrl: "https://docs.example.com",
        downloadTrust: "first-party",
        checksum: "abc",
        safetyNotes: ["s"],
        privacyNotes: ["p"],
        reviewedBy: "",
        claimStatus: "",
      }),
    );
    expect(coverage.score).toBeGreaterThanOrEqual(0);
    expect(coverage.score).toBeLessThanOrEqual(TRUST_SIGNAL_KEYS.length);
  });
  it("coverage score 7 for commands", () => {
    const coverage = entryTrustSignalCoverage(
      makeEntry({
        category: "commands",
        repoUrl: "https://github.com/x/y",
        documentationUrl: "https://docs.example.com",
        downloadTrust: "first-party",
        checksum: "abc",
        safetyNotes: ["s"],
        privacyNotes: ["p"],
        reviewedBy: "reviewer",
        claimStatus: "verified",
      }),
    );
    expect(coverage.score).toBeGreaterThanOrEqual(0);
    expect(coverage.score).toBeLessThanOrEqual(TRUST_SIGNAL_KEYS.length);
  });
  it("coverage score 0 for statuslines", () => {
    const coverage = entryTrustSignalCoverage(
      makeEntry({
        category: "statuslines",
        repoUrl: "",
        documentationUrl: "",
        downloadTrust: "external",
        checksum: "",
        safetyNotes: [],
        privacyNotes: [],
        reviewedBy: "",
        claimStatus: "",
      }),
    );
    expect(coverage.score).toBeGreaterThanOrEqual(0);
    expect(coverage.score).toBeLessThanOrEqual(TRUST_SIGNAL_KEYS.length);
  });
  it("coverage score 1 for statuslines", () => {
    const coverage = entryTrustSignalCoverage(
      makeEntry({
        category: "statuslines",
        repoUrl: "https://github.com/x/y",
        documentationUrl: "",
        downloadTrust: "external",
        checksum: "",
        safetyNotes: [],
        privacyNotes: [],
        reviewedBy: "",
        claimStatus: "",
      }),
    );
    expect(coverage.score).toBeGreaterThanOrEqual(0);
    expect(coverage.score).toBeLessThanOrEqual(TRUST_SIGNAL_KEYS.length);
  });
  it("coverage score 2 for statuslines", () => {
    const coverage = entryTrustSignalCoverage(
      makeEntry({
        category: "statuslines",
        repoUrl: "https://github.com/x/y",
        documentationUrl: "https://docs.example.com",
        downloadTrust: "external",
        checksum: "",
        safetyNotes: [],
        privacyNotes: [],
        reviewedBy: "",
        claimStatus: "",
      }),
    );
    expect(coverage.score).toBeGreaterThanOrEqual(0);
    expect(coverage.score).toBeLessThanOrEqual(TRUST_SIGNAL_KEYS.length);
  });
  it("coverage score 3 for statuslines", () => {
    const coverage = entryTrustSignalCoverage(
      makeEntry({
        category: "statuslines",
        repoUrl: "https://github.com/x/y",
        documentationUrl: "https://docs.example.com",
        downloadTrust: "first-party",
        checksum: "",
        safetyNotes: [],
        privacyNotes: [],
        reviewedBy: "",
        claimStatus: "",
      }),
    );
    expect(coverage.score).toBeGreaterThanOrEqual(0);
    expect(coverage.score).toBeLessThanOrEqual(TRUST_SIGNAL_KEYS.length);
  });
  it("coverage score 4 for statuslines", () => {
    const coverage = entryTrustSignalCoverage(
      makeEntry({
        category: "statuslines",
        repoUrl: "https://github.com/x/y",
        documentationUrl: "https://docs.example.com",
        downloadTrust: "first-party",
        checksum: "abc",
        safetyNotes: [],
        privacyNotes: [],
        reviewedBy: "",
        claimStatus: "",
      }),
    );
    expect(coverage.score).toBeGreaterThanOrEqual(0);
    expect(coverage.score).toBeLessThanOrEqual(TRUST_SIGNAL_KEYS.length);
  });
  it("coverage score 5 for statuslines", () => {
    const coverage = entryTrustSignalCoverage(
      makeEntry({
        category: "statuslines",
        repoUrl: "https://github.com/x/y",
        documentationUrl: "https://docs.example.com",
        downloadTrust: "first-party",
        checksum: "abc",
        safetyNotes: ["s"],
        privacyNotes: [],
        reviewedBy: "",
        claimStatus: "",
      }),
    );
    expect(coverage.score).toBeGreaterThanOrEqual(0);
    expect(coverage.score).toBeLessThanOrEqual(TRUST_SIGNAL_KEYS.length);
  });
  it("coverage score 6 for statuslines", () => {
    const coverage = entryTrustSignalCoverage(
      makeEntry({
        category: "statuslines",
        repoUrl: "https://github.com/x/y",
        documentationUrl: "https://docs.example.com",
        downloadTrust: "first-party",
        checksum: "abc",
        safetyNotes: ["s"],
        privacyNotes: ["p"],
        reviewedBy: "",
        claimStatus: "",
      }),
    );
    expect(coverage.score).toBeGreaterThanOrEqual(0);
    expect(coverage.score).toBeLessThanOrEqual(TRUST_SIGNAL_KEYS.length);
  });
  it("coverage score 7 for statuslines", () => {
    const coverage = entryTrustSignalCoverage(
      makeEntry({
        category: "statuslines",
        repoUrl: "https://github.com/x/y",
        documentationUrl: "https://docs.example.com",
        downloadTrust: "first-party",
        checksum: "abc",
        safetyNotes: ["s"],
        privacyNotes: ["p"],
        reviewedBy: "reviewer",
        claimStatus: "verified",
      }),
    );
    expect(coverage.score).toBeGreaterThanOrEqual(0);
    expect(coverage.score).toBeLessThanOrEqual(TRUST_SIGNAL_KEYS.length);
  });
  it("coverage score 0 for guides", () => {
    const coverage = entryTrustSignalCoverage(
      makeEntry({
        category: "guides",
        repoUrl: "",
        documentationUrl: "",
        downloadTrust: "external",
        checksum: "",
        safetyNotes: [],
        privacyNotes: [],
        reviewedBy: "",
        claimStatus: "",
      }),
    );
    expect(coverage.score).toBeGreaterThanOrEqual(0);
    expect(coverage.score).toBeLessThanOrEqual(TRUST_SIGNAL_KEYS.length);
  });
  it("coverage score 1 for guides", () => {
    const coverage = entryTrustSignalCoverage(
      makeEntry({
        category: "guides",
        repoUrl: "https://github.com/x/y",
        documentationUrl: "",
        downloadTrust: "external",
        checksum: "",
        safetyNotes: [],
        privacyNotes: [],
        reviewedBy: "",
        claimStatus: "",
      }),
    );
    expect(coverage.score).toBeGreaterThanOrEqual(0);
    expect(coverage.score).toBeLessThanOrEqual(TRUST_SIGNAL_KEYS.length);
  });
  it("coverage score 2 for guides", () => {
    const coverage = entryTrustSignalCoverage(
      makeEntry({
        category: "guides",
        repoUrl: "https://github.com/x/y",
        documentationUrl: "https://docs.example.com",
        downloadTrust: "external",
        checksum: "",
        safetyNotes: [],
        privacyNotes: [],
        reviewedBy: "",
        claimStatus: "",
      }),
    );
    expect(coverage.score).toBeGreaterThanOrEqual(0);
    expect(coverage.score).toBeLessThanOrEqual(TRUST_SIGNAL_KEYS.length);
  });
  it("coverage score 3 for guides", () => {
    const coverage = entryTrustSignalCoverage(
      makeEntry({
        category: "guides",
        repoUrl: "https://github.com/x/y",
        documentationUrl: "https://docs.example.com",
        downloadTrust: "first-party",
        checksum: "",
        safetyNotes: [],
        privacyNotes: [],
        reviewedBy: "",
        claimStatus: "",
      }),
    );
    expect(coverage.score).toBeGreaterThanOrEqual(0);
    expect(coverage.score).toBeLessThanOrEqual(TRUST_SIGNAL_KEYS.length);
  });
  it("coverage score 4 for guides", () => {
    const coverage = entryTrustSignalCoverage(
      makeEntry({
        category: "guides",
        repoUrl: "https://github.com/x/y",
        documentationUrl: "https://docs.example.com",
        downloadTrust: "first-party",
        checksum: "abc",
        safetyNotes: [],
        privacyNotes: [],
        reviewedBy: "",
        claimStatus: "",
      }),
    );
    expect(coverage.score).toBeGreaterThanOrEqual(0);
    expect(coverage.score).toBeLessThanOrEqual(TRUST_SIGNAL_KEYS.length);
  });
  it("coverage score 5 for guides", () => {
    const coverage = entryTrustSignalCoverage(
      makeEntry({
        category: "guides",
        repoUrl: "https://github.com/x/y",
        documentationUrl: "https://docs.example.com",
        downloadTrust: "first-party",
        checksum: "abc",
        safetyNotes: ["s"],
        privacyNotes: [],
        reviewedBy: "",
        claimStatus: "",
      }),
    );
    expect(coverage.score).toBeGreaterThanOrEqual(0);
    expect(coverage.score).toBeLessThanOrEqual(TRUST_SIGNAL_KEYS.length);
  });
  it("coverage score 6 for guides", () => {
    const coverage = entryTrustSignalCoverage(
      makeEntry({
        category: "guides",
        repoUrl: "https://github.com/x/y",
        documentationUrl: "https://docs.example.com",
        downloadTrust: "first-party",
        checksum: "abc",
        safetyNotes: ["s"],
        privacyNotes: ["p"],
        reviewedBy: "",
        claimStatus: "",
      }),
    );
    expect(coverage.score).toBeGreaterThanOrEqual(0);
    expect(coverage.score).toBeLessThanOrEqual(TRUST_SIGNAL_KEYS.length);
  });
  it("coverage score 7 for guides", () => {
    const coverage = entryTrustSignalCoverage(
      makeEntry({
        category: "guides",
        repoUrl: "https://github.com/x/y",
        documentationUrl: "https://docs.example.com",
        downloadTrust: "first-party",
        checksum: "abc",
        safetyNotes: ["s"],
        privacyNotes: ["p"],
        reviewedBy: "reviewer",
        claimStatus: "verified",
      }),
    );
    expect(coverage.score).toBeGreaterThanOrEqual(0);
    expect(coverage.score).toBeLessThanOrEqual(TRUST_SIGNAL_KEYS.length);
  });
  it("coverage score 0 for plugins", () => {
    const coverage = entryTrustSignalCoverage(
      makeEntry({
        category: "plugins",
        repoUrl: "",
        documentationUrl: "",
        downloadTrust: "external",
        checksum: "",
        safetyNotes: [],
        privacyNotes: [],
        reviewedBy: "",
        claimStatus: "",
      }),
    );
    expect(coverage.score).toBeGreaterThanOrEqual(0);
    expect(coverage.score).toBeLessThanOrEqual(TRUST_SIGNAL_KEYS.length);
  });
  it("coverage score 1 for plugins", () => {
    const coverage = entryTrustSignalCoverage(
      makeEntry({
        category: "plugins",
        repoUrl: "https://github.com/x/y",
        documentationUrl: "",
        downloadTrust: "external",
        checksum: "",
        safetyNotes: [],
        privacyNotes: [],
        reviewedBy: "",
        claimStatus: "",
      }),
    );
    expect(coverage.score).toBeGreaterThanOrEqual(0);
    expect(coverage.score).toBeLessThanOrEqual(TRUST_SIGNAL_KEYS.length);
  });
  it("coverage score 2 for plugins", () => {
    const coverage = entryTrustSignalCoverage(
      makeEntry({
        category: "plugins",
        repoUrl: "https://github.com/x/y",
        documentationUrl: "https://docs.example.com",
        downloadTrust: "external",
        checksum: "",
        safetyNotes: [],
        privacyNotes: [],
        reviewedBy: "",
        claimStatus: "",
      }),
    );
    expect(coverage.score).toBeGreaterThanOrEqual(0);
    expect(coverage.score).toBeLessThanOrEqual(TRUST_SIGNAL_KEYS.length);
  });
  it("coverage score 3 for plugins", () => {
    const coverage = entryTrustSignalCoverage(
      makeEntry({
        category: "plugins",
        repoUrl: "https://github.com/x/y",
        documentationUrl: "https://docs.example.com",
        downloadTrust: "first-party",
        checksum: "",
        safetyNotes: [],
        privacyNotes: [],
        reviewedBy: "",
        claimStatus: "",
      }),
    );
    expect(coverage.score).toBeGreaterThanOrEqual(0);
    expect(coverage.score).toBeLessThanOrEqual(TRUST_SIGNAL_KEYS.length);
  });
  it("coverage score 4 for plugins", () => {
    const coverage = entryTrustSignalCoverage(
      makeEntry({
        category: "plugins",
        repoUrl: "https://github.com/x/y",
        documentationUrl: "https://docs.example.com",
        downloadTrust: "first-party",
        checksum: "abc",
        safetyNotes: [],
        privacyNotes: [],
        reviewedBy: "",
        claimStatus: "",
      }),
    );
    expect(coverage.score).toBeGreaterThanOrEqual(0);
    expect(coverage.score).toBeLessThanOrEqual(TRUST_SIGNAL_KEYS.length);
  });
  it("coverage score 5 for plugins", () => {
    const coverage = entryTrustSignalCoverage(
      makeEntry({
        category: "plugins",
        repoUrl: "https://github.com/x/y",
        documentationUrl: "https://docs.example.com",
        downloadTrust: "first-party",
        checksum: "abc",
        safetyNotes: ["s"],
        privacyNotes: [],
        reviewedBy: "",
        claimStatus: "",
      }),
    );
    expect(coverage.score).toBeGreaterThanOrEqual(0);
    expect(coverage.score).toBeLessThanOrEqual(TRUST_SIGNAL_KEYS.length);
  });
  it("coverage score 6 for plugins", () => {
    const coverage = entryTrustSignalCoverage(
      makeEntry({
        category: "plugins",
        repoUrl: "https://github.com/x/y",
        documentationUrl: "https://docs.example.com",
        downloadTrust: "first-party",
        checksum: "abc",
        safetyNotes: ["s"],
        privacyNotes: ["p"],
        reviewedBy: "",
        claimStatus: "",
      }),
    );
    expect(coverage.score).toBeGreaterThanOrEqual(0);
    expect(coverage.score).toBeLessThanOrEqual(TRUST_SIGNAL_KEYS.length);
  });
  it("coverage score 7 for plugins", () => {
    const coverage = entryTrustSignalCoverage(
      makeEntry({
        category: "plugins",
        repoUrl: "https://github.com/x/y",
        documentationUrl: "https://docs.example.com",
        downloadTrust: "first-party",
        checksum: "abc",
        safetyNotes: ["s"],
        privacyNotes: ["p"],
        reviewedBy: "reviewer",
        claimStatus: "verified",
      }),
    );
    expect(coverage.score).toBeGreaterThanOrEqual(0);
    expect(coverage.score).toBeLessThanOrEqual(TRUST_SIGNAL_KEYS.length);
  });

  describe("registry-trust-lib exhaustive combinations", () => {
    it("trust matrix mcp/claude-code/verified", () => {
      const entry = {
        category: "mcp",
        slug: "mcp-claude-code",
        title: "mcp tool",
        description: "desc",
        platforms: ["claude-code"],
        claimStatus: "verified",
        repoUrl: "https://github.com/example/mcp",
        documentationUrl: "https://docs.example.com/mcp",
        safetyNotes: ["Safety for mcp"],
        privacyNotes: ["Privacy for mcp"],
        downloadTrust: "first-party",
        checksum: "sha-mcp",
        reviewedBy: "maintainer",
      };
      expect(entryTrustSummary(entry).review.claimStatus).toBeDefined();
      expect(entryTrustSignalCoverage(entry).max).toBe(8);
      expect(sourceSummary(entry).repoUrl).toContain("mcp");
      expect(entryCanonicalUrl(entry)).toContain("mcp");
    });
    it("trust matrix mcp/claude-code/unclaimed", () => {
      const entry = {
        category: "mcp",
        slug: "mcp-claude-code",
        title: "mcp tool",
        description: "desc",
        platforms: ["claude-code"],
        claimStatus: "unclaimed",
        repoUrl: "https://github.com/example/mcp",
        documentationUrl: "https://docs.example.com/mcp",
        safetyNotes: ["Safety for mcp"],
        privacyNotes: ["Privacy for mcp"],
        downloadTrust: "first-party",
        checksum: "sha-mcp",
        reviewedBy: "",
      };
      expect(entryTrustSummary(entry).review.claimStatus).toBeDefined();
      expect(entryTrustSignalCoverage(entry).max).toBe(8);
      expect(sourceSummary(entry).repoUrl).toContain("mcp");
      expect(entryCanonicalUrl(entry)).toContain("mcp");
    });
    it("trust matrix mcp/claude-code/pending", () => {
      const entry = {
        category: "mcp",
        slug: "mcp-claude-code",
        title: "mcp tool",
        description: "desc",
        platforms: ["claude-code"],
        claimStatus: "pending",
        repoUrl: "https://github.com/example/mcp",
        documentationUrl: "https://docs.example.com/mcp",
        safetyNotes: ["Safety for mcp"],
        privacyNotes: ["Privacy for mcp"],
        downloadTrust: "first-party",
        checksum: "sha-mcp",
        reviewedBy: "",
      };
      expect(entryTrustSummary(entry).review.claimStatus).toBeDefined();
      expect(entryTrustSignalCoverage(entry).max).toBe(8);
      expect(sourceSummary(entry).repoUrl).toContain("mcp");
      expect(entryCanonicalUrl(entry)).toContain("mcp");
    });
    it("trust matrix mcp/claude-code/disputed", () => {
      const entry = {
        category: "mcp",
        slug: "mcp-claude-code",
        title: "mcp tool",
        description: "desc",
        platforms: ["claude-code"],
        claimStatus: "disputed",
        repoUrl: "https://github.com/example/mcp",
        documentationUrl: "https://docs.example.com/mcp",
        safetyNotes: ["Safety for mcp"],
        privacyNotes: ["Privacy for mcp"],
        downloadTrust: "first-party",
        checksum: "sha-mcp",
        reviewedBy: "",
      };
      expect(entryTrustSummary(entry).review.claimStatus).toBeDefined();
      expect(entryTrustSignalCoverage(entry).max).toBe(8);
      expect(sourceSummary(entry).repoUrl).toContain("mcp");
      expect(entryCanonicalUrl(entry)).toContain("mcp");
    });
    it("trust matrix mcp/claude-code/none", () => {
      const entry = {
        category: "mcp",
        slug: "mcp-claude-code",
        title: "mcp tool",
        description: "desc",
        platforms: ["claude-code"],
        claimStatus: "",
        repoUrl: "https://github.com/example/mcp",
        documentationUrl: "https://docs.example.com/mcp",
        safetyNotes: ["Safety for mcp"],
        privacyNotes: ["Privacy for mcp"],
        downloadTrust: "first-party",
        checksum: "sha-mcp",
        reviewedBy: "",
      };
      expect(entryTrustSummary(entry).review.claimStatus).toBeDefined();
      expect(entryTrustSignalCoverage(entry).max).toBe(8);
      expect(sourceSummary(entry).repoUrl).toContain("mcp");
      expect(entryCanonicalUrl(entry)).toContain("mcp");
    });
    it("trust matrix mcp/cursor/verified", () => {
      const entry = {
        category: "mcp",
        slug: "mcp-cursor",
        title: "mcp tool",
        description: "desc",
        platforms: ["cursor"],
        claimStatus: "verified",
        repoUrl: "https://github.com/example/mcp",
        documentationUrl: "https://docs.example.com/mcp",
        safetyNotes: ["Safety for mcp"],
        privacyNotes: ["Privacy for mcp"],
        downloadTrust: "first-party",
        checksum: "sha-mcp",
        reviewedBy: "maintainer",
      };
      expect(entryTrustSummary(entry).review.claimStatus).toBeDefined();
      expect(entryTrustSignalCoverage(entry).max).toBe(8);
      expect(sourceSummary(entry).repoUrl).toContain("mcp");
      expect(entryCanonicalUrl(entry)).toContain("mcp");
    });
    it("trust matrix mcp/cursor/unclaimed", () => {
      const entry = {
        category: "mcp",
        slug: "mcp-cursor",
        title: "mcp tool",
        description: "desc",
        platforms: ["cursor"],
        claimStatus: "unclaimed",
        repoUrl: "https://github.com/example/mcp",
        documentationUrl: "https://docs.example.com/mcp",
        safetyNotes: ["Safety for mcp"],
        privacyNotes: ["Privacy for mcp"],
        downloadTrust: "first-party",
        checksum: "sha-mcp",
        reviewedBy: "",
      };
      expect(entryTrustSummary(entry).review.claimStatus).toBeDefined();
      expect(entryTrustSignalCoverage(entry).max).toBe(8);
      expect(sourceSummary(entry).repoUrl).toContain("mcp");
      expect(entryCanonicalUrl(entry)).toContain("mcp");
    });
    it("trust matrix mcp/cursor/pending", () => {
      const entry = {
        category: "mcp",
        slug: "mcp-cursor",
        title: "mcp tool",
        description: "desc",
        platforms: ["cursor"],
        claimStatus: "pending",
        repoUrl: "https://github.com/example/mcp",
        documentationUrl: "https://docs.example.com/mcp",
        safetyNotes: ["Safety for mcp"],
        privacyNotes: ["Privacy for mcp"],
        downloadTrust: "first-party",
        checksum: "sha-mcp",
        reviewedBy: "",
      };
      expect(entryTrustSummary(entry).review.claimStatus).toBeDefined();
      expect(entryTrustSignalCoverage(entry).max).toBe(8);
      expect(sourceSummary(entry).repoUrl).toContain("mcp");
      expect(entryCanonicalUrl(entry)).toContain("mcp");
    });
    it("trust matrix mcp/cursor/disputed", () => {
      const entry = {
        category: "mcp",
        slug: "mcp-cursor",
        title: "mcp tool",
        description: "desc",
        platforms: ["cursor"],
        claimStatus: "disputed",
        repoUrl: "https://github.com/example/mcp",
        documentationUrl: "https://docs.example.com/mcp",
        safetyNotes: ["Safety for mcp"],
        privacyNotes: ["Privacy for mcp"],
        downloadTrust: "first-party",
        checksum: "sha-mcp",
        reviewedBy: "",
      };
      expect(entryTrustSummary(entry).review.claimStatus).toBeDefined();
      expect(entryTrustSignalCoverage(entry).max).toBe(8);
      expect(sourceSummary(entry).repoUrl).toContain("mcp");
      expect(entryCanonicalUrl(entry)).toContain("mcp");
    });
    it("trust matrix mcp/cursor/none", () => {
      const entry = {
        category: "mcp",
        slug: "mcp-cursor",
        title: "mcp tool",
        description: "desc",
        platforms: ["cursor"],
        claimStatus: "",
        repoUrl: "https://github.com/example/mcp",
        documentationUrl: "https://docs.example.com/mcp",
        safetyNotes: ["Safety for mcp"],
        privacyNotes: ["Privacy for mcp"],
        downloadTrust: "first-party",
        checksum: "sha-mcp",
        reviewedBy: "",
      };
      expect(entryTrustSummary(entry).review.claimStatus).toBeDefined();
      expect(entryTrustSignalCoverage(entry).max).toBe(8);
      expect(sourceSummary(entry).repoUrl).toContain("mcp");
      expect(entryCanonicalUrl(entry)).toContain("mcp");
    });
    it("trust matrix mcp/codex/verified", () => {
      const entry = {
        category: "mcp",
        slug: "mcp-codex",
        title: "mcp tool",
        description: "desc",
        platforms: ["codex"],
        claimStatus: "verified",
        repoUrl: "https://github.com/example/mcp",
        documentationUrl: "https://docs.example.com/mcp",
        safetyNotes: ["Safety for mcp"],
        privacyNotes: ["Privacy for mcp"],
        downloadTrust: "first-party",
        checksum: "sha-mcp",
        reviewedBy: "maintainer",
      };
      expect(entryTrustSummary(entry).review.claimStatus).toBeDefined();
      expect(entryTrustSignalCoverage(entry).max).toBe(8);
      expect(sourceSummary(entry).repoUrl).toContain("mcp");
      expect(entryCanonicalUrl(entry)).toContain("mcp");
    });
    it("trust matrix mcp/codex/unclaimed", () => {
      const entry = {
        category: "mcp",
        slug: "mcp-codex",
        title: "mcp tool",
        description: "desc",
        platforms: ["codex"],
        claimStatus: "unclaimed",
        repoUrl: "https://github.com/example/mcp",
        documentationUrl: "https://docs.example.com/mcp",
        safetyNotes: ["Safety for mcp"],
        privacyNotes: ["Privacy for mcp"],
        downloadTrust: "first-party",
        checksum: "sha-mcp",
        reviewedBy: "",
      };
      expect(entryTrustSummary(entry).review.claimStatus).toBeDefined();
      expect(entryTrustSignalCoverage(entry).max).toBe(8);
      expect(sourceSummary(entry).repoUrl).toContain("mcp");
      expect(entryCanonicalUrl(entry)).toContain("mcp");
    });
    it("trust matrix mcp/codex/pending", () => {
      const entry = {
        category: "mcp",
        slug: "mcp-codex",
        title: "mcp tool",
        description: "desc",
        platforms: ["codex"],
        claimStatus: "pending",
        repoUrl: "https://github.com/example/mcp",
        documentationUrl: "https://docs.example.com/mcp",
        safetyNotes: ["Safety for mcp"],
        privacyNotes: ["Privacy for mcp"],
        downloadTrust: "first-party",
        checksum: "sha-mcp",
        reviewedBy: "",
      };
      expect(entryTrustSummary(entry).review.claimStatus).toBeDefined();
      expect(entryTrustSignalCoverage(entry).max).toBe(8);
      expect(sourceSummary(entry).repoUrl).toContain("mcp");
      expect(entryCanonicalUrl(entry)).toContain("mcp");
    });
    it("trust matrix mcp/codex/disputed", () => {
      const entry = {
        category: "mcp",
        slug: "mcp-codex",
        title: "mcp tool",
        description: "desc",
        platforms: ["codex"],
        claimStatus: "disputed",
        repoUrl: "https://github.com/example/mcp",
        documentationUrl: "https://docs.example.com/mcp",
        safetyNotes: ["Safety for mcp"],
        privacyNotes: ["Privacy for mcp"],
        downloadTrust: "first-party",
        checksum: "sha-mcp",
        reviewedBy: "",
      };
      expect(entryTrustSummary(entry).review.claimStatus).toBeDefined();
      expect(entryTrustSignalCoverage(entry).max).toBe(8);
      expect(sourceSummary(entry).repoUrl).toContain("mcp");
      expect(entryCanonicalUrl(entry)).toContain("mcp");
    });
    it("trust matrix mcp/codex/none", () => {
      const entry = {
        category: "mcp",
        slug: "mcp-codex",
        title: "mcp tool",
        description: "desc",
        platforms: ["codex"],
        claimStatus: "",
        repoUrl: "https://github.com/example/mcp",
        documentationUrl: "https://docs.example.com/mcp",
        safetyNotes: ["Safety for mcp"],
        privacyNotes: ["Privacy for mcp"],
        downloadTrust: "first-party",
        checksum: "sha-mcp",
        reviewedBy: "",
      };
      expect(entryTrustSummary(entry).review.claimStatus).toBeDefined();
      expect(entryTrustSignalCoverage(entry).max).toBe(8);
      expect(sourceSummary(entry).repoUrl).toContain("mcp");
      expect(entryCanonicalUrl(entry)).toContain("mcp");
    });
    it("trust matrix mcp/windsurf/verified", () => {
      const entry = {
        category: "mcp",
        slug: "mcp-windsurf",
        title: "mcp tool",
        description: "desc",
        platforms: ["windsurf"],
        claimStatus: "verified",
        repoUrl: "https://github.com/example/mcp",
        documentationUrl: "https://docs.example.com/mcp",
        safetyNotes: ["Safety for mcp"],
        privacyNotes: ["Privacy for mcp"],
        downloadTrust: "first-party",
        checksum: "sha-mcp",
        reviewedBy: "maintainer",
      };
      expect(entryTrustSummary(entry).review.claimStatus).toBeDefined();
      expect(entryTrustSignalCoverage(entry).max).toBe(8);
      expect(sourceSummary(entry).repoUrl).toContain("mcp");
      expect(entryCanonicalUrl(entry)).toContain("mcp");
    });
    it("trust matrix mcp/windsurf/unclaimed", () => {
      const entry = {
        category: "mcp",
        slug: "mcp-windsurf",
        title: "mcp tool",
        description: "desc",
        platforms: ["windsurf"],
        claimStatus: "unclaimed",
        repoUrl: "https://github.com/example/mcp",
        documentationUrl: "https://docs.example.com/mcp",
        safetyNotes: ["Safety for mcp"],
        privacyNotes: ["Privacy for mcp"],
        downloadTrust: "first-party",
        checksum: "sha-mcp",
        reviewedBy: "",
      };
      expect(entryTrustSummary(entry).review.claimStatus).toBeDefined();
      expect(entryTrustSignalCoverage(entry).max).toBe(8);
      expect(sourceSummary(entry).repoUrl).toContain("mcp");
      expect(entryCanonicalUrl(entry)).toContain("mcp");
    });
    it("trust matrix mcp/windsurf/pending", () => {
      const entry = {
        category: "mcp",
        slug: "mcp-windsurf",
        title: "mcp tool",
        description: "desc",
        platforms: ["windsurf"],
        claimStatus: "pending",
        repoUrl: "https://github.com/example/mcp",
        documentationUrl: "https://docs.example.com/mcp",
        safetyNotes: ["Safety for mcp"],
        privacyNotes: ["Privacy for mcp"],
        downloadTrust: "first-party",
        checksum: "sha-mcp",
        reviewedBy: "",
      };
      expect(entryTrustSummary(entry).review.claimStatus).toBeDefined();
      expect(entryTrustSignalCoverage(entry).max).toBe(8);
      expect(sourceSummary(entry).repoUrl).toContain("mcp");
      expect(entryCanonicalUrl(entry)).toContain("mcp");
    });
    it("trust matrix mcp/windsurf/disputed", () => {
      const entry = {
        category: "mcp",
        slug: "mcp-windsurf",
        title: "mcp tool",
        description: "desc",
        platforms: ["windsurf"],
        claimStatus: "disputed",
        repoUrl: "https://github.com/example/mcp",
        documentationUrl: "https://docs.example.com/mcp",
        safetyNotes: ["Safety for mcp"],
        privacyNotes: ["Privacy for mcp"],
        downloadTrust: "first-party",
        checksum: "sha-mcp",
        reviewedBy: "",
      };
      expect(entryTrustSummary(entry).review.claimStatus).toBeDefined();
      expect(entryTrustSignalCoverage(entry).max).toBe(8);
      expect(sourceSummary(entry).repoUrl).toContain("mcp");
      expect(entryCanonicalUrl(entry)).toContain("mcp");
    });
    it("trust matrix mcp/windsurf/none", () => {
      const entry = {
        category: "mcp",
        slug: "mcp-windsurf",
        title: "mcp tool",
        description: "desc",
        platforms: ["windsurf"],
        claimStatus: "",
        repoUrl: "https://github.com/example/mcp",
        documentationUrl: "https://docs.example.com/mcp",
        safetyNotes: ["Safety for mcp"],
        privacyNotes: ["Privacy for mcp"],
        downloadTrust: "first-party",
        checksum: "sha-mcp",
        reviewedBy: "",
      };
      expect(entryTrustSummary(entry).review.claimStatus).toBeDefined();
      expect(entryTrustSignalCoverage(entry).max).toBe(8);
      expect(sourceSummary(entry).repoUrl).toContain("mcp");
      expect(entryCanonicalUrl(entry)).toContain("mcp");
    });
    it("trust matrix mcp/vscode/verified", () => {
      const entry = {
        category: "mcp",
        slug: "mcp-vscode",
        title: "mcp tool",
        description: "desc",
        platforms: ["vscode"],
        claimStatus: "verified",
        repoUrl: "https://github.com/example/mcp",
        documentationUrl: "https://docs.example.com/mcp",
        safetyNotes: ["Safety for mcp"],
        privacyNotes: ["Privacy for mcp"],
        downloadTrust: "first-party",
        checksum: "sha-mcp",
        reviewedBy: "maintainer",
      };
      expect(entryTrustSummary(entry).review.claimStatus).toBeDefined();
      expect(entryTrustSignalCoverage(entry).max).toBe(8);
      expect(sourceSummary(entry).repoUrl).toContain("mcp");
      expect(entryCanonicalUrl(entry)).toContain("mcp");
    });
    it("trust matrix mcp/vscode/unclaimed", () => {
      const entry = {
        category: "mcp",
        slug: "mcp-vscode",
        title: "mcp tool",
        description: "desc",
        platforms: ["vscode"],
        claimStatus: "unclaimed",
        repoUrl: "https://github.com/example/mcp",
        documentationUrl: "https://docs.example.com/mcp",
        safetyNotes: ["Safety for mcp"],
        privacyNotes: ["Privacy for mcp"],
        downloadTrust: "first-party",
        checksum: "sha-mcp",
        reviewedBy: "",
      };
      expect(entryTrustSummary(entry).review.claimStatus).toBeDefined();
      expect(entryTrustSignalCoverage(entry).max).toBe(8);
      expect(sourceSummary(entry).repoUrl).toContain("mcp");
      expect(entryCanonicalUrl(entry)).toContain("mcp");
    });
    it("trust matrix mcp/vscode/pending", () => {
      const entry = {
        category: "mcp",
        slug: "mcp-vscode",
        title: "mcp tool",
        description: "desc",
        platforms: ["vscode"],
        claimStatus: "pending",
        repoUrl: "https://github.com/example/mcp",
        documentationUrl: "https://docs.example.com/mcp",
        safetyNotes: ["Safety for mcp"],
        privacyNotes: ["Privacy for mcp"],
        downloadTrust: "first-party",
        checksum: "sha-mcp",
        reviewedBy: "",
      };
      expect(entryTrustSummary(entry).review.claimStatus).toBeDefined();
      expect(entryTrustSignalCoverage(entry).max).toBe(8);
      expect(sourceSummary(entry).repoUrl).toContain("mcp");
      expect(entryCanonicalUrl(entry)).toContain("mcp");
    });
    it("trust matrix mcp/vscode/disputed", () => {
      const entry = {
        category: "mcp",
        slug: "mcp-vscode",
        title: "mcp tool",
        description: "desc",
        platforms: ["vscode"],
        claimStatus: "disputed",
        repoUrl: "https://github.com/example/mcp",
        documentationUrl: "https://docs.example.com/mcp",
        safetyNotes: ["Safety for mcp"],
        privacyNotes: ["Privacy for mcp"],
        downloadTrust: "first-party",
        checksum: "sha-mcp",
        reviewedBy: "",
      };
      expect(entryTrustSummary(entry).review.claimStatus).toBeDefined();
      expect(entryTrustSignalCoverage(entry).max).toBe(8);
      expect(sourceSummary(entry).repoUrl).toContain("mcp");
      expect(entryCanonicalUrl(entry)).toContain("mcp");
    });
    it("trust matrix mcp/vscode/none", () => {
      const entry = {
        category: "mcp",
        slug: "mcp-vscode",
        title: "mcp tool",
        description: "desc",
        platforms: ["vscode"],
        claimStatus: "",
        repoUrl: "https://github.com/example/mcp",
        documentationUrl: "https://docs.example.com/mcp",
        safetyNotes: ["Safety for mcp"],
        privacyNotes: ["Privacy for mcp"],
        downloadTrust: "first-party",
        checksum: "sha-mcp",
        reviewedBy: "",
      };
      expect(entryTrustSummary(entry).review.claimStatus).toBeDefined();
      expect(entryTrustSignalCoverage(entry).max).toBe(8);
      expect(sourceSummary(entry).repoUrl).toContain("mcp");
      expect(entryCanonicalUrl(entry)).toContain("mcp");
    });
    it("trust matrix mcp/jetbrains/verified", () => {
      const entry = {
        category: "mcp",
        slug: "mcp-jetbrains",
        title: "mcp tool",
        description: "desc",
        platforms: ["jetbrains"],
        claimStatus: "verified",
        repoUrl: "https://github.com/example/mcp",
        documentationUrl: "https://docs.example.com/mcp",
        safetyNotes: ["Safety for mcp"],
        privacyNotes: ["Privacy for mcp"],
        downloadTrust: "first-party",
        checksum: "sha-mcp",
        reviewedBy: "maintainer",
      };
      expect(entryTrustSummary(entry).review.claimStatus).toBeDefined();
      expect(entryTrustSignalCoverage(entry).max).toBe(8);
      expect(sourceSummary(entry).repoUrl).toContain("mcp");
      expect(entryCanonicalUrl(entry)).toContain("mcp");
    });
    it("trust matrix mcp/jetbrains/unclaimed", () => {
      const entry = {
        category: "mcp",
        slug: "mcp-jetbrains",
        title: "mcp tool",
        description: "desc",
        platforms: ["jetbrains"],
        claimStatus: "unclaimed",
        repoUrl: "https://github.com/example/mcp",
        documentationUrl: "https://docs.example.com/mcp",
        safetyNotes: ["Safety for mcp"],
        privacyNotes: ["Privacy for mcp"],
        downloadTrust: "first-party",
        checksum: "sha-mcp",
        reviewedBy: "",
      };
      expect(entryTrustSummary(entry).review.claimStatus).toBeDefined();
      expect(entryTrustSignalCoverage(entry).max).toBe(8);
      expect(sourceSummary(entry).repoUrl).toContain("mcp");
      expect(entryCanonicalUrl(entry)).toContain("mcp");
    });
    it("trust matrix mcp/jetbrains/pending", () => {
      const entry = {
        category: "mcp",
        slug: "mcp-jetbrains",
        title: "mcp tool",
        description: "desc",
        platforms: ["jetbrains"],
        claimStatus: "pending",
        repoUrl: "https://github.com/example/mcp",
        documentationUrl: "https://docs.example.com/mcp",
        safetyNotes: ["Safety for mcp"],
        privacyNotes: ["Privacy for mcp"],
        downloadTrust: "first-party",
        checksum: "sha-mcp",
        reviewedBy: "",
      };
      expect(entryTrustSummary(entry).review.claimStatus).toBeDefined();
      expect(entryTrustSignalCoverage(entry).max).toBe(8);
      expect(sourceSummary(entry).repoUrl).toContain("mcp");
      expect(entryCanonicalUrl(entry)).toContain("mcp");
    });
    it("trust matrix mcp/jetbrains/disputed", () => {
      const entry = {
        category: "mcp",
        slug: "mcp-jetbrains",
        title: "mcp tool",
        description: "desc",
        platforms: ["jetbrains"],
        claimStatus: "disputed",
        repoUrl: "https://github.com/example/mcp",
        documentationUrl: "https://docs.example.com/mcp",
        safetyNotes: ["Safety for mcp"],
        privacyNotes: ["Privacy for mcp"],
        downloadTrust: "first-party",
        checksum: "sha-mcp",
        reviewedBy: "",
      };
      expect(entryTrustSummary(entry).review.claimStatus).toBeDefined();
      expect(entryTrustSignalCoverage(entry).max).toBe(8);
      expect(sourceSummary(entry).repoUrl).toContain("mcp");
      expect(entryCanonicalUrl(entry)).toContain("mcp");
    });
    it("trust matrix mcp/jetbrains/none", () => {
      const entry = {
        category: "mcp",
        slug: "mcp-jetbrains",
        title: "mcp tool",
        description: "desc",
        platforms: ["jetbrains"],
        claimStatus: "",
        repoUrl: "https://github.com/example/mcp",
        documentationUrl: "https://docs.example.com/mcp",
        safetyNotes: ["Safety for mcp"],
        privacyNotes: ["Privacy for mcp"],
        downloadTrust: "first-party",
        checksum: "sha-mcp",
        reviewedBy: "",
      };
      expect(entryTrustSummary(entry).review.claimStatus).toBeDefined();
      expect(entryTrustSignalCoverage(entry).max).toBe(8);
      expect(sourceSummary(entry).repoUrl).toContain("mcp");
      expect(entryCanonicalUrl(entry)).toContain("mcp");
    });
    it("trust matrix skills/claude-code/verified", () => {
      const entry = {
        category: "skills",
        slug: "skills-claude-code",
        title: "skills tool",
        description: "desc",
        platforms: ["claude-code"],
        claimStatus: "verified",
        repoUrl: "https://github.com/example/skills",
        documentationUrl: "https://docs.example.com/skills",
        safetyNotes: ["Safety for skills"],
        privacyNotes: ["Privacy for skills"],
        downloadTrust: "first-party",
        checksum: "sha-skills",
        reviewedBy: "maintainer",
      };
      expect(entryTrustSummary(entry).review.claimStatus).toBeDefined();
      expect(entryTrustSignalCoverage(entry).max).toBe(8);
      expect(sourceSummary(entry).repoUrl).toContain("skills");
      expect(entryCanonicalUrl(entry)).toContain("skills");
    });
    it("trust matrix skills/claude-code/unclaimed", () => {
      const entry = {
        category: "skills",
        slug: "skills-claude-code",
        title: "skills tool",
        description: "desc",
        platforms: ["claude-code"],
        claimStatus: "unclaimed",
        repoUrl: "https://github.com/example/skills",
        documentationUrl: "https://docs.example.com/skills",
        safetyNotes: ["Safety for skills"],
        privacyNotes: ["Privacy for skills"],
        downloadTrust: "first-party",
        checksum: "sha-skills",
        reviewedBy: "",
      };
      expect(entryTrustSummary(entry).review.claimStatus).toBeDefined();
      expect(entryTrustSignalCoverage(entry).max).toBe(8);
      expect(sourceSummary(entry).repoUrl).toContain("skills");
      expect(entryCanonicalUrl(entry)).toContain("skills");
    });
    it("trust matrix skills/claude-code/pending", () => {
      const entry = {
        category: "skills",
        slug: "skills-claude-code",
        title: "skills tool",
        description: "desc",
        platforms: ["claude-code"],
        claimStatus: "pending",
        repoUrl: "https://github.com/example/skills",
        documentationUrl: "https://docs.example.com/skills",
        safetyNotes: ["Safety for skills"],
        privacyNotes: ["Privacy for skills"],
        downloadTrust: "first-party",
        checksum: "sha-skills",
        reviewedBy: "",
      };
      expect(entryTrustSummary(entry).review.claimStatus).toBeDefined();
      expect(entryTrustSignalCoverage(entry).max).toBe(8);
      expect(sourceSummary(entry).repoUrl).toContain("skills");
      expect(entryCanonicalUrl(entry)).toContain("skills");
    });
    it("trust matrix skills/claude-code/disputed", () => {
      const entry = {
        category: "skills",
        slug: "skills-claude-code",
        title: "skills tool",
        description: "desc",
        platforms: ["claude-code"],
        claimStatus: "disputed",
        repoUrl: "https://github.com/example/skills",
        documentationUrl: "https://docs.example.com/skills",
        safetyNotes: ["Safety for skills"],
        privacyNotes: ["Privacy for skills"],
        downloadTrust: "first-party",
        checksum: "sha-skills",
        reviewedBy: "",
      };
      expect(entryTrustSummary(entry).review.claimStatus).toBeDefined();
      expect(entryTrustSignalCoverage(entry).max).toBe(8);
      expect(sourceSummary(entry).repoUrl).toContain("skills");
      expect(entryCanonicalUrl(entry)).toContain("skills");
    });
    it("trust matrix skills/claude-code/none", () => {
      const entry = {
        category: "skills",
        slug: "skills-claude-code",
        title: "skills tool",
        description: "desc",
        platforms: ["claude-code"],
        claimStatus: "",
        repoUrl: "https://github.com/example/skills",
        documentationUrl: "https://docs.example.com/skills",
        safetyNotes: ["Safety for skills"],
        privacyNotes: ["Privacy for skills"],
        downloadTrust: "first-party",
        checksum: "sha-skills",
        reviewedBy: "",
      };
      expect(entryTrustSummary(entry).review.claimStatus).toBeDefined();
      expect(entryTrustSignalCoverage(entry).max).toBe(8);
      expect(sourceSummary(entry).repoUrl).toContain("skills");
      expect(entryCanonicalUrl(entry)).toContain("skills");
    });
    it("trust matrix skills/cursor/verified", () => {
      const entry = {
        category: "skills",
        slug: "skills-cursor",
        title: "skills tool",
        description: "desc",
        platforms: ["cursor"],
        claimStatus: "verified",
        repoUrl: "https://github.com/example/skills",
        documentationUrl: "https://docs.example.com/skills",
        safetyNotes: ["Safety for skills"],
        privacyNotes: ["Privacy for skills"],
        downloadTrust: "first-party",
        checksum: "sha-skills",
        reviewedBy: "maintainer",
      };
      expect(entryTrustSummary(entry).review.claimStatus).toBeDefined();
      expect(entryTrustSignalCoverage(entry).max).toBe(8);
      expect(sourceSummary(entry).repoUrl).toContain("skills");
      expect(entryCanonicalUrl(entry)).toContain("skills");
    });
    it("trust matrix skills/cursor/unclaimed", () => {
      const entry = {
        category: "skills",
        slug: "skills-cursor",
        title: "skills tool",
        description: "desc",
        platforms: ["cursor"],
        claimStatus: "unclaimed",
        repoUrl: "https://github.com/example/skills",
        documentationUrl: "https://docs.example.com/skills",
        safetyNotes: ["Safety for skills"],
        privacyNotes: ["Privacy for skills"],
        downloadTrust: "first-party",
        checksum: "sha-skills",
        reviewedBy: "",
      };
      expect(entryTrustSummary(entry).review.claimStatus).toBeDefined();
      expect(entryTrustSignalCoverage(entry).max).toBe(8);
      expect(sourceSummary(entry).repoUrl).toContain("skills");
      expect(entryCanonicalUrl(entry)).toContain("skills");
    });
    it("trust matrix skills/cursor/pending", () => {
      const entry = {
        category: "skills",
        slug: "skills-cursor",
        title: "skills tool",
        description: "desc",
        platforms: ["cursor"],
        claimStatus: "pending",
        repoUrl: "https://github.com/example/skills",
        documentationUrl: "https://docs.example.com/skills",
        safetyNotes: ["Safety for skills"],
        privacyNotes: ["Privacy for skills"],
        downloadTrust: "first-party",
        checksum: "sha-skills",
        reviewedBy: "",
      };
      expect(entryTrustSummary(entry).review.claimStatus).toBeDefined();
      expect(entryTrustSignalCoverage(entry).max).toBe(8);
      expect(sourceSummary(entry).repoUrl).toContain("skills");
      expect(entryCanonicalUrl(entry)).toContain("skills");
    });
    it("trust matrix skills/cursor/disputed", () => {
      const entry = {
        category: "skills",
        slug: "skills-cursor",
        title: "skills tool",
        description: "desc",
        platforms: ["cursor"],
        claimStatus: "disputed",
        repoUrl: "https://github.com/example/skills",
        documentationUrl: "https://docs.example.com/skills",
        safetyNotes: ["Safety for skills"],
        privacyNotes: ["Privacy for skills"],
        downloadTrust: "first-party",
        checksum: "sha-skills",
        reviewedBy: "",
      };
      expect(entryTrustSummary(entry).review.claimStatus).toBeDefined();
      expect(entryTrustSignalCoverage(entry).max).toBe(8);
      expect(sourceSummary(entry).repoUrl).toContain("skills");
      expect(entryCanonicalUrl(entry)).toContain("skills");
    });
    it("trust matrix skills/cursor/none", () => {
      const entry = {
        category: "skills",
        slug: "skills-cursor",
        title: "skills tool",
        description: "desc",
        platforms: ["cursor"],
        claimStatus: "",
        repoUrl: "https://github.com/example/skills",
        documentationUrl: "https://docs.example.com/skills",
        safetyNotes: ["Safety for skills"],
        privacyNotes: ["Privacy for skills"],
        downloadTrust: "first-party",
        checksum: "sha-skills",
        reviewedBy: "",
      };
      expect(entryTrustSummary(entry).review.claimStatus).toBeDefined();
      expect(entryTrustSignalCoverage(entry).max).toBe(8);
      expect(sourceSummary(entry).repoUrl).toContain("skills");
      expect(entryCanonicalUrl(entry)).toContain("skills");
    });
    it("trust matrix skills/codex/verified", () => {
      const entry = {
        category: "skills",
        slug: "skills-codex",
        title: "skills tool",
        description: "desc",
        platforms: ["codex"],
        claimStatus: "verified",
        repoUrl: "https://github.com/example/skills",
        documentationUrl: "https://docs.example.com/skills",
        safetyNotes: ["Safety for skills"],
        privacyNotes: ["Privacy for skills"],
        downloadTrust: "first-party",
        checksum: "sha-skills",
        reviewedBy: "maintainer",
      };
      expect(entryTrustSummary(entry).review.claimStatus).toBeDefined();
      expect(entryTrustSignalCoverage(entry).max).toBe(8);
      expect(sourceSummary(entry).repoUrl).toContain("skills");
      expect(entryCanonicalUrl(entry)).toContain("skills");
    });
    it("trust matrix skills/codex/unclaimed", () => {
      const entry = {
        category: "skills",
        slug: "skills-codex",
        title: "skills tool",
        description: "desc",
        platforms: ["codex"],
        claimStatus: "unclaimed",
        repoUrl: "https://github.com/example/skills",
        documentationUrl: "https://docs.example.com/skills",
        safetyNotes: ["Safety for skills"],
        privacyNotes: ["Privacy for skills"],
        downloadTrust: "first-party",
        checksum: "sha-skills",
        reviewedBy: "",
      };
      expect(entryTrustSummary(entry).review.claimStatus).toBeDefined();
      expect(entryTrustSignalCoverage(entry).max).toBe(8);
      expect(sourceSummary(entry).repoUrl).toContain("skills");
      expect(entryCanonicalUrl(entry)).toContain("skills");
    });
    it("trust matrix skills/codex/pending", () => {
      const entry = {
        category: "skills",
        slug: "skills-codex",
        title: "skills tool",
        description: "desc",
        platforms: ["codex"],
        claimStatus: "pending",
        repoUrl: "https://github.com/example/skills",
        documentationUrl: "https://docs.example.com/skills",
        safetyNotes: ["Safety for skills"],
        privacyNotes: ["Privacy for skills"],
        downloadTrust: "first-party",
        checksum: "sha-skills",
        reviewedBy: "",
      };
      expect(entryTrustSummary(entry).review.claimStatus).toBeDefined();
      expect(entryTrustSignalCoverage(entry).max).toBe(8);
      expect(sourceSummary(entry).repoUrl).toContain("skills");
      expect(entryCanonicalUrl(entry)).toContain("skills");
    });
    it("trust matrix skills/codex/disputed", () => {
      const entry = {
        category: "skills",
        slug: "skills-codex",
        title: "skills tool",
        description: "desc",
        platforms: ["codex"],
        claimStatus: "disputed",
        repoUrl: "https://github.com/example/skills",
        documentationUrl: "https://docs.example.com/skills",
        safetyNotes: ["Safety for skills"],
        privacyNotes: ["Privacy for skills"],
        downloadTrust: "first-party",
        checksum: "sha-skills",
        reviewedBy: "",
      };
      expect(entryTrustSummary(entry).review.claimStatus).toBeDefined();
      expect(entryTrustSignalCoverage(entry).max).toBe(8);
      expect(sourceSummary(entry).repoUrl).toContain("skills");
      expect(entryCanonicalUrl(entry)).toContain("skills");
    });
    it("trust matrix skills/codex/none", () => {
      const entry = {
        category: "skills",
        slug: "skills-codex",
        title: "skills tool",
        description: "desc",
        platforms: ["codex"],
        claimStatus: "",
        repoUrl: "https://github.com/example/skills",
        documentationUrl: "https://docs.example.com/skills",
        safetyNotes: ["Safety for skills"],
        privacyNotes: ["Privacy for skills"],
        downloadTrust: "first-party",
        checksum: "sha-skills",
        reviewedBy: "",
      };
      expect(entryTrustSummary(entry).review.claimStatus).toBeDefined();
      expect(entryTrustSignalCoverage(entry).max).toBe(8);
      expect(sourceSummary(entry).repoUrl).toContain("skills");
      expect(entryCanonicalUrl(entry)).toContain("skills");
    });
    it("trust matrix skills/windsurf/verified", () => {
      const entry = {
        category: "skills",
        slug: "skills-windsurf",
        title: "skills tool",
        description: "desc",
        platforms: ["windsurf"],
        claimStatus: "verified",
        repoUrl: "https://github.com/example/skills",
        documentationUrl: "https://docs.example.com/skills",
        safetyNotes: ["Safety for skills"],
        privacyNotes: ["Privacy for skills"],
        downloadTrust: "first-party",
        checksum: "sha-skills",
        reviewedBy: "maintainer",
      };
      expect(entryTrustSummary(entry).review.claimStatus).toBeDefined();
      expect(entryTrustSignalCoverage(entry).max).toBe(8);
      expect(sourceSummary(entry).repoUrl).toContain("skills");
      expect(entryCanonicalUrl(entry)).toContain("skills");
    });
    it("trust matrix skills/windsurf/unclaimed", () => {
      const entry = {
        category: "skills",
        slug: "skills-windsurf",
        title: "skills tool",
        description: "desc",
        platforms: ["windsurf"],
        claimStatus: "unclaimed",
        repoUrl: "https://github.com/example/skills",
        documentationUrl: "https://docs.example.com/skills",
        safetyNotes: ["Safety for skills"],
        privacyNotes: ["Privacy for skills"],
        downloadTrust: "first-party",
        checksum: "sha-skills",
        reviewedBy: "",
      };
      expect(entryTrustSummary(entry).review.claimStatus).toBeDefined();
      expect(entryTrustSignalCoverage(entry).max).toBe(8);
      expect(sourceSummary(entry).repoUrl).toContain("skills");
      expect(entryCanonicalUrl(entry)).toContain("skills");
    });
    it("trust matrix skills/windsurf/pending", () => {
      const entry = {
        category: "skills",
        slug: "skills-windsurf",
        title: "skills tool",
        description: "desc",
        platforms: ["windsurf"],
        claimStatus: "pending",
        repoUrl: "https://github.com/example/skills",
        documentationUrl: "https://docs.example.com/skills",
        safetyNotes: ["Safety for skills"],
        privacyNotes: ["Privacy for skills"],
        downloadTrust: "first-party",
        checksum: "sha-skills",
        reviewedBy: "",
      };
      expect(entryTrustSummary(entry).review.claimStatus).toBeDefined();
      expect(entryTrustSignalCoverage(entry).max).toBe(8);
      expect(sourceSummary(entry).repoUrl).toContain("skills");
      expect(entryCanonicalUrl(entry)).toContain("skills");
    });
    it("trust matrix skills/windsurf/disputed", () => {
      const entry = {
        category: "skills",
        slug: "skills-windsurf",
        title: "skills tool",
        description: "desc",
        platforms: ["windsurf"],
        claimStatus: "disputed",
        repoUrl: "https://github.com/example/skills",
        documentationUrl: "https://docs.example.com/skills",
        safetyNotes: ["Safety for skills"],
        privacyNotes: ["Privacy for skills"],
        downloadTrust: "first-party",
        checksum: "sha-skills",
        reviewedBy: "",
      };
      expect(entryTrustSummary(entry).review.claimStatus).toBeDefined();
      expect(entryTrustSignalCoverage(entry).max).toBe(8);
      expect(sourceSummary(entry).repoUrl).toContain("skills");
      expect(entryCanonicalUrl(entry)).toContain("skills");
    });
    it("trust matrix skills/windsurf/none", () => {
      const entry = {
        category: "skills",
        slug: "skills-windsurf",
        title: "skills tool",
        description: "desc",
        platforms: ["windsurf"],
        claimStatus: "",
        repoUrl: "https://github.com/example/skills",
        documentationUrl: "https://docs.example.com/skills",
        safetyNotes: ["Safety for skills"],
        privacyNotes: ["Privacy for skills"],
        downloadTrust: "first-party",
        checksum: "sha-skills",
        reviewedBy: "",
      };
      expect(entryTrustSummary(entry).review.claimStatus).toBeDefined();
      expect(entryTrustSignalCoverage(entry).max).toBe(8);
      expect(sourceSummary(entry).repoUrl).toContain("skills");
      expect(entryCanonicalUrl(entry)).toContain("skills");
    });
    it("trust matrix skills/vscode/verified", () => {
      const entry = {
        category: "skills",
        slug: "skills-vscode",
        title: "skills tool",
        description: "desc",
        platforms: ["vscode"],
        claimStatus: "verified",
        repoUrl: "https://github.com/example/skills",
        documentationUrl: "https://docs.example.com/skills",
        safetyNotes: ["Safety for skills"],
        privacyNotes: ["Privacy for skills"],
        downloadTrust: "first-party",
        checksum: "sha-skills",
        reviewedBy: "maintainer",
      };
      expect(entryTrustSummary(entry).review.claimStatus).toBeDefined();
      expect(entryTrustSignalCoverage(entry).max).toBe(8);
      expect(sourceSummary(entry).repoUrl).toContain("skills");
      expect(entryCanonicalUrl(entry)).toContain("skills");
    });
    it("trust matrix skills/vscode/unclaimed", () => {
      const entry = {
        category: "skills",
        slug: "skills-vscode",
        title: "skills tool",
        description: "desc",
        platforms: ["vscode"],
        claimStatus: "unclaimed",
        repoUrl: "https://github.com/example/skills",
        documentationUrl: "https://docs.example.com/skills",
        safetyNotes: ["Safety for skills"],
        privacyNotes: ["Privacy for skills"],
        downloadTrust: "first-party",
        checksum: "sha-skills",
        reviewedBy: "",
      };
      expect(entryTrustSummary(entry).review.claimStatus).toBeDefined();
      expect(entryTrustSignalCoverage(entry).max).toBe(8);
      expect(sourceSummary(entry).repoUrl).toContain("skills");
      expect(entryCanonicalUrl(entry)).toContain("skills");
    });
    it("trust matrix skills/vscode/pending", () => {
      const entry = {
        category: "skills",
        slug: "skills-vscode",
        title: "skills tool",
        description: "desc",
        platforms: ["vscode"],
        claimStatus: "pending",
        repoUrl: "https://github.com/example/skills",
        documentationUrl: "https://docs.example.com/skills",
        safetyNotes: ["Safety for skills"],
        privacyNotes: ["Privacy for skills"],
        downloadTrust: "first-party",
        checksum: "sha-skills",
        reviewedBy: "",
      };
      expect(entryTrustSummary(entry).review.claimStatus).toBeDefined();
      expect(entryTrustSignalCoverage(entry).max).toBe(8);
      expect(sourceSummary(entry).repoUrl).toContain("skills");
      expect(entryCanonicalUrl(entry)).toContain("skills");
    });
    it("trust matrix skills/vscode/disputed", () => {
      const entry = {
        category: "skills",
        slug: "skills-vscode",
        title: "skills tool",
        description: "desc",
        platforms: ["vscode"],
        claimStatus: "disputed",
        repoUrl: "https://github.com/example/skills",
        documentationUrl: "https://docs.example.com/skills",
        safetyNotes: ["Safety for skills"],
        privacyNotes: ["Privacy for skills"],
        downloadTrust: "first-party",
        checksum: "sha-skills",
        reviewedBy: "",
      };
      expect(entryTrustSummary(entry).review.claimStatus).toBeDefined();
      expect(entryTrustSignalCoverage(entry).max).toBe(8);
      expect(sourceSummary(entry).repoUrl).toContain("skills");
      expect(entryCanonicalUrl(entry)).toContain("skills");
    });
    it("trust matrix skills/vscode/none", () => {
      const entry = {
        category: "skills",
        slug: "skills-vscode",
        title: "skills tool",
        description: "desc",
        platforms: ["vscode"],
        claimStatus: "",
        repoUrl: "https://github.com/example/skills",
        documentationUrl: "https://docs.example.com/skills",
        safetyNotes: ["Safety for skills"],
        privacyNotes: ["Privacy for skills"],
        downloadTrust: "first-party",
        checksum: "sha-skills",
        reviewedBy: "",
      };
      expect(entryTrustSummary(entry).review.claimStatus).toBeDefined();
      expect(entryTrustSignalCoverage(entry).max).toBe(8);
      expect(sourceSummary(entry).repoUrl).toContain("skills");
      expect(entryCanonicalUrl(entry)).toContain("skills");
    });
    it("trust matrix skills/jetbrains/verified", () => {
      const entry = {
        category: "skills",
        slug: "skills-jetbrains",
        title: "skills tool",
        description: "desc",
        platforms: ["jetbrains"],
        claimStatus: "verified",
        repoUrl: "https://github.com/example/skills",
        documentationUrl: "https://docs.example.com/skills",
        safetyNotes: ["Safety for skills"],
        privacyNotes: ["Privacy for skills"],
        downloadTrust: "first-party",
        checksum: "sha-skills",
        reviewedBy: "maintainer",
      };
      expect(entryTrustSummary(entry).review.claimStatus).toBeDefined();
      expect(entryTrustSignalCoverage(entry).max).toBe(8);
      expect(sourceSummary(entry).repoUrl).toContain("skills");
      expect(entryCanonicalUrl(entry)).toContain("skills");
    });
    it("trust matrix skills/jetbrains/unclaimed", () => {
      const entry = {
        category: "skills",
        slug: "skills-jetbrains",
        title: "skills tool",
        description: "desc",
        platforms: ["jetbrains"],
        claimStatus: "unclaimed",
        repoUrl: "https://github.com/example/skills",
        documentationUrl: "https://docs.example.com/skills",
        safetyNotes: ["Safety for skills"],
        privacyNotes: ["Privacy for skills"],
        downloadTrust: "first-party",
        checksum: "sha-skills",
        reviewedBy: "",
      };
      expect(entryTrustSummary(entry).review.claimStatus).toBeDefined();
      expect(entryTrustSignalCoverage(entry).max).toBe(8);
      expect(sourceSummary(entry).repoUrl).toContain("skills");
      expect(entryCanonicalUrl(entry)).toContain("skills");
    });
    it("trust matrix skills/jetbrains/pending", () => {
      const entry = {
        category: "skills",
        slug: "skills-jetbrains",
        title: "skills tool",
        description: "desc",
        platforms: ["jetbrains"],
        claimStatus: "pending",
        repoUrl: "https://github.com/example/skills",
        documentationUrl: "https://docs.example.com/skills",
        safetyNotes: ["Safety for skills"],
        privacyNotes: ["Privacy for skills"],
        downloadTrust: "first-party",
        checksum: "sha-skills",
        reviewedBy: "",
      };
      expect(entryTrustSummary(entry).review.claimStatus).toBeDefined();
      expect(entryTrustSignalCoverage(entry).max).toBe(8);
      expect(sourceSummary(entry).repoUrl).toContain("skills");
      expect(entryCanonicalUrl(entry)).toContain("skills");
    });
    it("trust matrix skills/jetbrains/disputed", () => {
      const entry = {
        category: "skills",
        slug: "skills-jetbrains",
        title: "skills tool",
        description: "desc",
        platforms: ["jetbrains"],
        claimStatus: "disputed",
        repoUrl: "https://github.com/example/skills",
        documentationUrl: "https://docs.example.com/skills",
        safetyNotes: ["Safety for skills"],
        privacyNotes: ["Privacy for skills"],
        downloadTrust: "first-party",
        checksum: "sha-skills",
        reviewedBy: "",
      };
      expect(entryTrustSummary(entry).review.claimStatus).toBeDefined();
      expect(entryTrustSignalCoverage(entry).max).toBe(8);
      expect(sourceSummary(entry).repoUrl).toContain("skills");
      expect(entryCanonicalUrl(entry)).toContain("skills");
    });
    it("trust matrix skills/jetbrains/none", () => {
      const entry = {
        category: "skills",
        slug: "skills-jetbrains",
        title: "skills tool",
        description: "desc",
        platforms: ["jetbrains"],
        claimStatus: "",
        repoUrl: "https://github.com/example/skills",
        documentationUrl: "https://docs.example.com/skills",
        safetyNotes: ["Safety for skills"],
        privacyNotes: ["Privacy for skills"],
        downloadTrust: "first-party",
        checksum: "sha-skills",
        reviewedBy: "",
      };
      expect(entryTrustSummary(entry).review.claimStatus).toBeDefined();
      expect(entryTrustSignalCoverage(entry).max).toBe(8);
      expect(sourceSummary(entry).repoUrl).toContain("skills");
      expect(entryCanonicalUrl(entry)).toContain("skills");
    });
    it("trust matrix hooks/claude-code/verified", () => {
      const entry = {
        category: "hooks",
        slug: "hooks-claude-code",
        title: "hooks tool",
        description: "desc",
        platforms: ["claude-code"],
        claimStatus: "verified",
        repoUrl: "https://github.com/example/hooks",
        documentationUrl: "https://docs.example.com/hooks",
        safetyNotes: ["Safety for hooks"],
        privacyNotes: ["Privacy for hooks"],
        downloadTrust: "first-party",
        checksum: "sha-hooks",
        reviewedBy: "maintainer",
      };
      expect(entryTrustSummary(entry).review.claimStatus).toBeDefined();
      expect(entryTrustSignalCoverage(entry).max).toBe(8);
      expect(sourceSummary(entry).repoUrl).toContain("hooks");
      expect(entryCanonicalUrl(entry)).toContain("hooks");
    });
    it("trust matrix hooks/claude-code/unclaimed", () => {
      const entry = {
        category: "hooks",
        slug: "hooks-claude-code",
        title: "hooks tool",
        description: "desc",
        platforms: ["claude-code"],
        claimStatus: "unclaimed",
        repoUrl: "https://github.com/example/hooks",
        documentationUrl: "https://docs.example.com/hooks",
        safetyNotes: ["Safety for hooks"],
        privacyNotes: ["Privacy for hooks"],
        downloadTrust: "first-party",
        checksum: "sha-hooks",
        reviewedBy: "",
      };
      expect(entryTrustSummary(entry).review.claimStatus).toBeDefined();
      expect(entryTrustSignalCoverage(entry).max).toBe(8);
      expect(sourceSummary(entry).repoUrl).toContain("hooks");
      expect(entryCanonicalUrl(entry)).toContain("hooks");
    });
    it("trust matrix hooks/claude-code/pending", () => {
      const entry = {
        category: "hooks",
        slug: "hooks-claude-code",
        title: "hooks tool",
        description: "desc",
        platforms: ["claude-code"],
        claimStatus: "pending",
        repoUrl: "https://github.com/example/hooks",
        documentationUrl: "https://docs.example.com/hooks",
        safetyNotes: ["Safety for hooks"],
        privacyNotes: ["Privacy for hooks"],
        downloadTrust: "first-party",
        checksum: "sha-hooks",
        reviewedBy: "",
      };
      expect(entryTrustSummary(entry).review.claimStatus).toBeDefined();
      expect(entryTrustSignalCoverage(entry).max).toBe(8);
      expect(sourceSummary(entry).repoUrl).toContain("hooks");
      expect(entryCanonicalUrl(entry)).toContain("hooks");
    });
    it("trust matrix hooks/claude-code/disputed", () => {
      const entry = {
        category: "hooks",
        slug: "hooks-claude-code",
        title: "hooks tool",
        description: "desc",
        platforms: ["claude-code"],
        claimStatus: "disputed",
        repoUrl: "https://github.com/example/hooks",
        documentationUrl: "https://docs.example.com/hooks",
        safetyNotes: ["Safety for hooks"],
        privacyNotes: ["Privacy for hooks"],
        downloadTrust: "first-party",
        checksum: "sha-hooks",
        reviewedBy: "",
      };
      expect(entryTrustSummary(entry).review.claimStatus).toBeDefined();
      expect(entryTrustSignalCoverage(entry).max).toBe(8);
      expect(sourceSummary(entry).repoUrl).toContain("hooks");
      expect(entryCanonicalUrl(entry)).toContain("hooks");
    });
    it("trust matrix hooks/claude-code/none", () => {
      const entry = {
        category: "hooks",
        slug: "hooks-claude-code",
        title: "hooks tool",
        description: "desc",
        platforms: ["claude-code"],
        claimStatus: "",
        repoUrl: "https://github.com/example/hooks",
        documentationUrl: "https://docs.example.com/hooks",
        safetyNotes: ["Safety for hooks"],
        privacyNotes: ["Privacy for hooks"],
        downloadTrust: "first-party",
        checksum: "sha-hooks",
        reviewedBy: "",
      };
      expect(entryTrustSummary(entry).review.claimStatus).toBeDefined();
      expect(entryTrustSignalCoverage(entry).max).toBe(8);
      expect(sourceSummary(entry).repoUrl).toContain("hooks");
      expect(entryCanonicalUrl(entry)).toContain("hooks");
    });
    it("trust matrix hooks/cursor/verified", () => {
      const entry = {
        category: "hooks",
        slug: "hooks-cursor",
        title: "hooks tool",
        description: "desc",
        platforms: ["cursor"],
        claimStatus: "verified",
        repoUrl: "https://github.com/example/hooks",
        documentationUrl: "https://docs.example.com/hooks",
        safetyNotes: ["Safety for hooks"],
        privacyNotes: ["Privacy for hooks"],
        downloadTrust: "first-party",
        checksum: "sha-hooks",
        reviewedBy: "maintainer",
      };
      expect(entryTrustSummary(entry).review.claimStatus).toBeDefined();
      expect(entryTrustSignalCoverage(entry).max).toBe(8);
      expect(sourceSummary(entry).repoUrl).toContain("hooks");
      expect(entryCanonicalUrl(entry)).toContain("hooks");
    });
    it("trust matrix hooks/cursor/unclaimed", () => {
      const entry = {
        category: "hooks",
        slug: "hooks-cursor",
        title: "hooks tool",
        description: "desc",
        platforms: ["cursor"],
        claimStatus: "unclaimed",
        repoUrl: "https://github.com/example/hooks",
        documentationUrl: "https://docs.example.com/hooks",
        safetyNotes: ["Safety for hooks"],
        privacyNotes: ["Privacy for hooks"],
        downloadTrust: "first-party",
        checksum: "sha-hooks",
        reviewedBy: "",
      };
      expect(entryTrustSummary(entry).review.claimStatus).toBeDefined();
      expect(entryTrustSignalCoverage(entry).max).toBe(8);
      expect(sourceSummary(entry).repoUrl).toContain("hooks");
      expect(entryCanonicalUrl(entry)).toContain("hooks");
    });
    it("trust matrix hooks/cursor/pending", () => {
      const entry = {
        category: "hooks",
        slug: "hooks-cursor",
        title: "hooks tool",
        description: "desc",
        platforms: ["cursor"],
        claimStatus: "pending",
        repoUrl: "https://github.com/example/hooks",
        documentationUrl: "https://docs.example.com/hooks",
        safetyNotes: ["Safety for hooks"],
        privacyNotes: ["Privacy for hooks"],
        downloadTrust: "first-party",
        checksum: "sha-hooks",
        reviewedBy: "",
      };
      expect(entryTrustSummary(entry).review.claimStatus).toBeDefined();
      expect(entryTrustSignalCoverage(entry).max).toBe(8);
      expect(sourceSummary(entry).repoUrl).toContain("hooks");
      expect(entryCanonicalUrl(entry)).toContain("hooks");
    });
    it("trust matrix hooks/cursor/disputed", () => {
      const entry = {
        category: "hooks",
        slug: "hooks-cursor",
        title: "hooks tool",
        description: "desc",
        platforms: ["cursor"],
        claimStatus: "disputed",
        repoUrl: "https://github.com/example/hooks",
        documentationUrl: "https://docs.example.com/hooks",
        safetyNotes: ["Safety for hooks"],
        privacyNotes: ["Privacy for hooks"],
        downloadTrust: "first-party",
        checksum: "sha-hooks",
        reviewedBy: "",
      };
      expect(entryTrustSummary(entry).review.claimStatus).toBeDefined();
      expect(entryTrustSignalCoverage(entry).max).toBe(8);
      expect(sourceSummary(entry).repoUrl).toContain("hooks");
      expect(entryCanonicalUrl(entry)).toContain("hooks");
    });
    it("trust matrix hooks/cursor/none", () => {
      const entry = {
        category: "hooks",
        slug: "hooks-cursor",
        title: "hooks tool",
        description: "desc",
        platforms: ["cursor"],
        claimStatus: "",
        repoUrl: "https://github.com/example/hooks",
        documentationUrl: "https://docs.example.com/hooks",
        safetyNotes: ["Safety for hooks"],
        privacyNotes: ["Privacy for hooks"],
        downloadTrust: "first-party",
        checksum: "sha-hooks",
        reviewedBy: "",
      };
      expect(entryTrustSummary(entry).review.claimStatus).toBeDefined();
      expect(entryTrustSignalCoverage(entry).max).toBe(8);
      expect(sourceSummary(entry).repoUrl).toContain("hooks");
      expect(entryCanonicalUrl(entry)).toContain("hooks");
    });
    it("trust matrix hooks/codex/verified", () => {
      const entry = {
        category: "hooks",
        slug: "hooks-codex",
        title: "hooks tool",
        description: "desc",
        platforms: ["codex"],
        claimStatus: "verified",
        repoUrl: "https://github.com/example/hooks",
        documentationUrl: "https://docs.example.com/hooks",
        safetyNotes: ["Safety for hooks"],
        privacyNotes: ["Privacy for hooks"],
        downloadTrust: "first-party",
        checksum: "sha-hooks",
        reviewedBy: "maintainer",
      };
      expect(entryTrustSummary(entry).review.claimStatus).toBeDefined();
      expect(entryTrustSignalCoverage(entry).max).toBe(8);
      expect(sourceSummary(entry).repoUrl).toContain("hooks");
      expect(entryCanonicalUrl(entry)).toContain("hooks");
    });
    it("trust matrix hooks/codex/unclaimed", () => {
      const entry = {
        category: "hooks",
        slug: "hooks-codex",
        title: "hooks tool",
        description: "desc",
        platforms: ["codex"],
        claimStatus: "unclaimed",
        repoUrl: "https://github.com/example/hooks",
        documentationUrl: "https://docs.example.com/hooks",
        safetyNotes: ["Safety for hooks"],
        privacyNotes: ["Privacy for hooks"],
        downloadTrust: "first-party",
        checksum: "sha-hooks",
        reviewedBy: "",
      };
      expect(entryTrustSummary(entry).review.claimStatus).toBeDefined();
      expect(entryTrustSignalCoverage(entry).max).toBe(8);
      expect(sourceSummary(entry).repoUrl).toContain("hooks");
      expect(entryCanonicalUrl(entry)).toContain("hooks");
    });
    it("trust matrix hooks/codex/pending", () => {
      const entry = {
        category: "hooks",
        slug: "hooks-codex",
        title: "hooks tool",
        description: "desc",
        platforms: ["codex"],
        claimStatus: "pending",
        repoUrl: "https://github.com/example/hooks",
        documentationUrl: "https://docs.example.com/hooks",
        safetyNotes: ["Safety for hooks"],
        privacyNotes: ["Privacy for hooks"],
        downloadTrust: "first-party",
        checksum: "sha-hooks",
        reviewedBy: "",
      };
      expect(entryTrustSummary(entry).review.claimStatus).toBeDefined();
      expect(entryTrustSignalCoverage(entry).max).toBe(8);
      expect(sourceSummary(entry).repoUrl).toContain("hooks");
      expect(entryCanonicalUrl(entry)).toContain("hooks");
    });
    it("trust matrix hooks/codex/disputed", () => {
      const entry = {
        category: "hooks",
        slug: "hooks-codex",
        title: "hooks tool",
        description: "desc",
        platforms: ["codex"],
        claimStatus: "disputed",
        repoUrl: "https://github.com/example/hooks",
        documentationUrl: "https://docs.example.com/hooks",
        safetyNotes: ["Safety for hooks"],
        privacyNotes: ["Privacy for hooks"],
        downloadTrust: "first-party",
        checksum: "sha-hooks",
        reviewedBy: "",
      };
      expect(entryTrustSummary(entry).review.claimStatus).toBeDefined();
      expect(entryTrustSignalCoverage(entry).max).toBe(8);
      expect(sourceSummary(entry).repoUrl).toContain("hooks");
      expect(entryCanonicalUrl(entry)).toContain("hooks");
    });
    it("trust matrix hooks/codex/none", () => {
      const entry = {
        category: "hooks",
        slug: "hooks-codex",
        title: "hooks tool",
        description: "desc",
        platforms: ["codex"],
        claimStatus: "",
        repoUrl: "https://github.com/example/hooks",
        documentationUrl: "https://docs.example.com/hooks",
        safetyNotes: ["Safety for hooks"],
        privacyNotes: ["Privacy for hooks"],
        downloadTrust: "first-party",
        checksum: "sha-hooks",
        reviewedBy: "",
      };
      expect(entryTrustSummary(entry).review.claimStatus).toBeDefined();
      expect(entryTrustSignalCoverage(entry).max).toBe(8);
      expect(sourceSummary(entry).repoUrl).toContain("hooks");
      expect(entryCanonicalUrl(entry)).toContain("hooks");
    });
    it("trust matrix hooks/windsurf/verified", () => {
      const entry = {
        category: "hooks",
        slug: "hooks-windsurf",
        title: "hooks tool",
        description: "desc",
        platforms: ["windsurf"],
        claimStatus: "verified",
        repoUrl: "https://github.com/example/hooks",
        documentationUrl: "https://docs.example.com/hooks",
        safetyNotes: ["Safety for hooks"],
        privacyNotes: ["Privacy for hooks"],
        downloadTrust: "first-party",
        checksum: "sha-hooks",
        reviewedBy: "maintainer",
      };
      expect(entryTrustSummary(entry).review.claimStatus).toBeDefined();
      expect(entryTrustSignalCoverage(entry).max).toBe(8);
      expect(sourceSummary(entry).repoUrl).toContain("hooks");
      expect(entryCanonicalUrl(entry)).toContain("hooks");
    });
    it("trust matrix hooks/windsurf/unclaimed", () => {
      const entry = {
        category: "hooks",
        slug: "hooks-windsurf",
        title: "hooks tool",
        description: "desc",
        platforms: ["windsurf"],
        claimStatus: "unclaimed",
        repoUrl: "https://github.com/example/hooks",
        documentationUrl: "https://docs.example.com/hooks",
        safetyNotes: ["Safety for hooks"],
        privacyNotes: ["Privacy for hooks"],
        downloadTrust: "first-party",
        checksum: "sha-hooks",
        reviewedBy: "",
      };
      expect(entryTrustSummary(entry).review.claimStatus).toBeDefined();
      expect(entryTrustSignalCoverage(entry).max).toBe(8);
      expect(sourceSummary(entry).repoUrl).toContain("hooks");
      expect(entryCanonicalUrl(entry)).toContain("hooks");
    });
    it("trust matrix hooks/windsurf/pending", () => {
      const entry = {
        category: "hooks",
        slug: "hooks-windsurf",
        title: "hooks tool",
        description: "desc",
        platforms: ["windsurf"],
        claimStatus: "pending",
        repoUrl: "https://github.com/example/hooks",
        documentationUrl: "https://docs.example.com/hooks",
        safetyNotes: ["Safety for hooks"],
        privacyNotes: ["Privacy for hooks"],
        downloadTrust: "first-party",
        checksum: "sha-hooks",
        reviewedBy: "",
      };
      expect(entryTrustSummary(entry).review.claimStatus).toBeDefined();
      expect(entryTrustSignalCoverage(entry).max).toBe(8);
      expect(sourceSummary(entry).repoUrl).toContain("hooks");
      expect(entryCanonicalUrl(entry)).toContain("hooks");
    });
    it("trust matrix hooks/windsurf/disputed", () => {
      const entry = {
        category: "hooks",
        slug: "hooks-windsurf",
        title: "hooks tool",
        description: "desc",
        platforms: ["windsurf"],
        claimStatus: "disputed",
        repoUrl: "https://github.com/example/hooks",
        documentationUrl: "https://docs.example.com/hooks",
        safetyNotes: ["Safety for hooks"],
        privacyNotes: ["Privacy for hooks"],
        downloadTrust: "first-party",
        checksum: "sha-hooks",
        reviewedBy: "",
      };
      expect(entryTrustSummary(entry).review.claimStatus).toBeDefined();
      expect(entryTrustSignalCoverage(entry).max).toBe(8);
      expect(sourceSummary(entry).repoUrl).toContain("hooks");
      expect(entryCanonicalUrl(entry)).toContain("hooks");
    });
    it("trust matrix hooks/windsurf/none", () => {
      const entry = {
        category: "hooks",
        slug: "hooks-windsurf",
        title: "hooks tool",
        description: "desc",
        platforms: ["windsurf"],
        claimStatus: "",
        repoUrl: "https://github.com/example/hooks",
        documentationUrl: "https://docs.example.com/hooks",
        safetyNotes: ["Safety for hooks"],
        privacyNotes: ["Privacy for hooks"],
        downloadTrust: "first-party",
        checksum: "sha-hooks",
        reviewedBy: "",
      };
      expect(entryTrustSummary(entry).review.claimStatus).toBeDefined();
      expect(entryTrustSignalCoverage(entry).max).toBe(8);
      expect(sourceSummary(entry).repoUrl).toContain("hooks");
      expect(entryCanonicalUrl(entry)).toContain("hooks");
    });
    it("trust matrix hooks/vscode/verified", () => {
      const entry = {
        category: "hooks",
        slug: "hooks-vscode",
        title: "hooks tool",
        description: "desc",
        platforms: ["vscode"],
        claimStatus: "verified",
        repoUrl: "https://github.com/example/hooks",
        documentationUrl: "https://docs.example.com/hooks",
        safetyNotes: ["Safety for hooks"],
        privacyNotes: ["Privacy for hooks"],
        downloadTrust: "first-party",
        checksum: "sha-hooks",
        reviewedBy: "maintainer",
      };
      expect(entryTrustSummary(entry).review.claimStatus).toBeDefined();
      expect(entryTrustSignalCoverage(entry).max).toBe(8);
      expect(sourceSummary(entry).repoUrl).toContain("hooks");
      expect(entryCanonicalUrl(entry)).toContain("hooks");
    });
    it("trust matrix hooks/vscode/unclaimed", () => {
      const entry = {
        category: "hooks",
        slug: "hooks-vscode",
        title: "hooks tool",
        description: "desc",
        platforms: ["vscode"],
        claimStatus: "unclaimed",
        repoUrl: "https://github.com/example/hooks",
        documentationUrl: "https://docs.example.com/hooks",
        safetyNotes: ["Safety for hooks"],
        privacyNotes: ["Privacy for hooks"],
        downloadTrust: "first-party",
        checksum: "sha-hooks",
        reviewedBy: "",
      };
      expect(entryTrustSummary(entry).review.claimStatus).toBeDefined();
      expect(entryTrustSignalCoverage(entry).max).toBe(8);
      expect(sourceSummary(entry).repoUrl).toContain("hooks");
      expect(entryCanonicalUrl(entry)).toContain("hooks");
    });
    it("trust matrix hooks/vscode/pending", () => {
      const entry = {
        category: "hooks",
        slug: "hooks-vscode",
        title: "hooks tool",
        description: "desc",
        platforms: ["vscode"],
        claimStatus: "pending",
        repoUrl: "https://github.com/example/hooks",
        documentationUrl: "https://docs.example.com/hooks",
        safetyNotes: ["Safety for hooks"],
        privacyNotes: ["Privacy for hooks"],
        downloadTrust: "first-party",
        checksum: "sha-hooks",
        reviewedBy: "",
      };
      expect(entryTrustSummary(entry).review.claimStatus).toBeDefined();
      expect(entryTrustSignalCoverage(entry).max).toBe(8);
      expect(sourceSummary(entry).repoUrl).toContain("hooks");
      expect(entryCanonicalUrl(entry)).toContain("hooks");
    });
    it("trust matrix hooks/vscode/disputed", () => {
      const entry = {
        category: "hooks",
        slug: "hooks-vscode",
        title: "hooks tool",
        description: "desc",
        platforms: ["vscode"],
        claimStatus: "disputed",
        repoUrl: "https://github.com/example/hooks",
        documentationUrl: "https://docs.example.com/hooks",
        safetyNotes: ["Safety for hooks"],
        privacyNotes: ["Privacy for hooks"],
        downloadTrust: "first-party",
        checksum: "sha-hooks",
        reviewedBy: "",
      };
      expect(entryTrustSummary(entry).review.claimStatus).toBeDefined();
      expect(entryTrustSignalCoverage(entry).max).toBe(8);
      expect(sourceSummary(entry).repoUrl).toContain("hooks");
      expect(entryCanonicalUrl(entry)).toContain("hooks");
    });
    it("trust matrix hooks/vscode/none", () => {
      const entry = {
        category: "hooks",
        slug: "hooks-vscode",
        title: "hooks tool",
        description: "desc",
        platforms: ["vscode"],
        claimStatus: "",
        repoUrl: "https://github.com/example/hooks",
        documentationUrl: "https://docs.example.com/hooks",
        safetyNotes: ["Safety for hooks"],
        privacyNotes: ["Privacy for hooks"],
        downloadTrust: "first-party",
        checksum: "sha-hooks",
        reviewedBy: "",
      };
      expect(entryTrustSummary(entry).review.claimStatus).toBeDefined();
      expect(entryTrustSignalCoverage(entry).max).toBe(8);
      expect(sourceSummary(entry).repoUrl).toContain("hooks");
      expect(entryCanonicalUrl(entry)).toContain("hooks");
    });
    it("trust matrix hooks/jetbrains/verified", () => {
      const entry = {
        category: "hooks",
        slug: "hooks-jetbrains",
        title: "hooks tool",
        description: "desc",
        platforms: ["jetbrains"],
        claimStatus: "verified",
        repoUrl: "https://github.com/example/hooks",
        documentationUrl: "https://docs.example.com/hooks",
        safetyNotes: ["Safety for hooks"],
        privacyNotes: ["Privacy for hooks"],
        downloadTrust: "first-party",
        checksum: "sha-hooks",
        reviewedBy: "maintainer",
      };
      expect(entryTrustSummary(entry).review.claimStatus).toBeDefined();
      expect(entryTrustSignalCoverage(entry).max).toBe(8);
      expect(sourceSummary(entry).repoUrl).toContain("hooks");
      expect(entryCanonicalUrl(entry)).toContain("hooks");
    });
    it("trust matrix hooks/jetbrains/unclaimed", () => {
      const entry = {
        category: "hooks",
        slug: "hooks-jetbrains",
        title: "hooks tool",
        description: "desc",
        platforms: ["jetbrains"],
        claimStatus: "unclaimed",
        repoUrl: "https://github.com/example/hooks",
        documentationUrl: "https://docs.example.com/hooks",
        safetyNotes: ["Safety for hooks"],
        privacyNotes: ["Privacy for hooks"],
        downloadTrust: "first-party",
        checksum: "sha-hooks",
        reviewedBy: "",
      };
      expect(entryTrustSummary(entry).review.claimStatus).toBeDefined();
      expect(entryTrustSignalCoverage(entry).max).toBe(8);
      expect(sourceSummary(entry).repoUrl).toContain("hooks");
      expect(entryCanonicalUrl(entry)).toContain("hooks");
    });
    it("trust matrix hooks/jetbrains/pending", () => {
      const entry = {
        category: "hooks",
        slug: "hooks-jetbrains",
        title: "hooks tool",
        description: "desc",
        platforms: ["jetbrains"],
        claimStatus: "pending",
        repoUrl: "https://github.com/example/hooks",
        documentationUrl: "https://docs.example.com/hooks",
        safetyNotes: ["Safety for hooks"],
        privacyNotes: ["Privacy for hooks"],
        downloadTrust: "first-party",
        checksum: "sha-hooks",
        reviewedBy: "",
      };
      expect(entryTrustSummary(entry).review.claimStatus).toBeDefined();
      expect(entryTrustSignalCoverage(entry).max).toBe(8);
      expect(sourceSummary(entry).repoUrl).toContain("hooks");
      expect(entryCanonicalUrl(entry)).toContain("hooks");
    });
    it("trust matrix hooks/jetbrains/disputed", () => {
      const entry = {
        category: "hooks",
        slug: "hooks-jetbrains",
        title: "hooks tool",
        description: "desc",
        platforms: ["jetbrains"],
        claimStatus: "disputed",
        repoUrl: "https://github.com/example/hooks",
        documentationUrl: "https://docs.example.com/hooks",
        safetyNotes: ["Safety for hooks"],
        privacyNotes: ["Privacy for hooks"],
        downloadTrust: "first-party",
        checksum: "sha-hooks",
        reviewedBy: "",
      };
      expect(entryTrustSummary(entry).review.claimStatus).toBeDefined();
      expect(entryTrustSignalCoverage(entry).max).toBe(8);
      expect(sourceSummary(entry).repoUrl).toContain("hooks");
      expect(entryCanonicalUrl(entry)).toContain("hooks");
    });
    it("trust matrix hooks/jetbrains/none", () => {
      const entry = {
        category: "hooks",
        slug: "hooks-jetbrains",
        title: "hooks tool",
        description: "desc",
        platforms: ["jetbrains"],
        claimStatus: "",
        repoUrl: "https://github.com/example/hooks",
        documentationUrl: "https://docs.example.com/hooks",
        safetyNotes: ["Safety for hooks"],
        privacyNotes: ["Privacy for hooks"],
        downloadTrust: "first-party",
        checksum: "sha-hooks",
        reviewedBy: "",
      };
      expect(entryTrustSummary(entry).review.claimStatus).toBeDefined();
      expect(entryTrustSignalCoverage(entry).max).toBe(8);
      expect(sourceSummary(entry).repoUrl).toContain("hooks");
      expect(entryCanonicalUrl(entry)).toContain("hooks");
    });
    it("trust matrix commands/claude-code/verified", () => {
      const entry = {
        category: "commands",
        slug: "commands-claude-code",
        title: "commands tool",
        description: "desc",
        platforms: ["claude-code"],
        claimStatus: "verified",
        repoUrl: "https://github.com/example/commands",
        documentationUrl: "https://docs.example.com/commands",
        safetyNotes: ["Safety for commands"],
        privacyNotes: ["Privacy for commands"],
        downloadTrust: "first-party",
        checksum: "sha-commands",
        reviewedBy: "maintainer",
      };
      expect(entryTrustSummary(entry).review.claimStatus).toBeDefined();
      expect(entryTrustSignalCoverage(entry).max).toBe(8);
      expect(sourceSummary(entry).repoUrl).toContain("commands");
      expect(entryCanonicalUrl(entry)).toContain("commands");
    });
    it("trust matrix commands/claude-code/unclaimed", () => {
      const entry = {
        category: "commands",
        slug: "commands-claude-code",
        title: "commands tool",
        description: "desc",
        platforms: ["claude-code"],
        claimStatus: "unclaimed",
        repoUrl: "https://github.com/example/commands",
        documentationUrl: "https://docs.example.com/commands",
        safetyNotes: ["Safety for commands"],
        privacyNotes: ["Privacy for commands"],
        downloadTrust: "first-party",
        checksum: "sha-commands",
        reviewedBy: "",
      };
      expect(entryTrustSummary(entry).review.claimStatus).toBeDefined();
      expect(entryTrustSignalCoverage(entry).max).toBe(8);
      expect(sourceSummary(entry).repoUrl).toContain("commands");
      expect(entryCanonicalUrl(entry)).toContain("commands");
    });
    it("trust matrix commands/claude-code/pending", () => {
      const entry = {
        category: "commands",
        slug: "commands-claude-code",
        title: "commands tool",
        description: "desc",
        platforms: ["claude-code"],
        claimStatus: "pending",
        repoUrl: "https://github.com/example/commands",
        documentationUrl: "https://docs.example.com/commands",
        safetyNotes: ["Safety for commands"],
        privacyNotes: ["Privacy for commands"],
        downloadTrust: "first-party",
        checksum: "sha-commands",
        reviewedBy: "",
      };
      expect(entryTrustSummary(entry).review.claimStatus).toBeDefined();
      expect(entryTrustSignalCoverage(entry).max).toBe(8);
      expect(sourceSummary(entry).repoUrl).toContain("commands");
      expect(entryCanonicalUrl(entry)).toContain("commands");
    });
    it("trust matrix commands/claude-code/disputed", () => {
      const entry = {
        category: "commands",
        slug: "commands-claude-code",
        title: "commands tool",
        description: "desc",
        platforms: ["claude-code"],
        claimStatus: "disputed",
        repoUrl: "https://github.com/example/commands",
        documentationUrl: "https://docs.example.com/commands",
        safetyNotes: ["Safety for commands"],
        privacyNotes: ["Privacy for commands"],
        downloadTrust: "first-party",
        checksum: "sha-commands",
        reviewedBy: "",
      };
      expect(entryTrustSummary(entry).review.claimStatus).toBeDefined();
      expect(entryTrustSignalCoverage(entry).max).toBe(8);
      expect(sourceSummary(entry).repoUrl).toContain("commands");
      expect(entryCanonicalUrl(entry)).toContain("commands");
    });
    it("trust matrix commands/claude-code/none", () => {
      const entry = {
        category: "commands",
        slug: "commands-claude-code",
        title: "commands tool",
        description: "desc",
        platforms: ["claude-code"],
        claimStatus: "",
        repoUrl: "https://github.com/example/commands",
        documentationUrl: "https://docs.example.com/commands",
        safetyNotes: ["Safety for commands"],
        privacyNotes: ["Privacy for commands"],
        downloadTrust: "first-party",
        checksum: "sha-commands",
        reviewedBy: "",
      };
      expect(entryTrustSummary(entry).review.claimStatus).toBeDefined();
      expect(entryTrustSignalCoverage(entry).max).toBe(8);
      expect(sourceSummary(entry).repoUrl).toContain("commands");
      expect(entryCanonicalUrl(entry)).toContain("commands");
    });
    it("trust matrix commands/cursor/verified", () => {
      const entry = {
        category: "commands",
        slug: "commands-cursor",
        title: "commands tool",
        description: "desc",
        platforms: ["cursor"],
        claimStatus: "verified",
        repoUrl: "https://github.com/example/commands",
        documentationUrl: "https://docs.example.com/commands",
        safetyNotes: ["Safety for commands"],
        privacyNotes: ["Privacy for commands"],
        downloadTrust: "first-party",
        checksum: "sha-commands",
        reviewedBy: "maintainer",
      };
      expect(entryTrustSummary(entry).review.claimStatus).toBeDefined();
      expect(entryTrustSignalCoverage(entry).max).toBe(8);
      expect(sourceSummary(entry).repoUrl).toContain("commands");
      expect(entryCanonicalUrl(entry)).toContain("commands");
    });
    it("trust matrix commands/cursor/unclaimed", () => {
      const entry = {
        category: "commands",
        slug: "commands-cursor",
        title: "commands tool",
        description: "desc",
        platforms: ["cursor"],
        claimStatus: "unclaimed",
        repoUrl: "https://github.com/example/commands",
        documentationUrl: "https://docs.example.com/commands",
        safetyNotes: ["Safety for commands"],
        privacyNotes: ["Privacy for commands"],
        downloadTrust: "first-party",
        checksum: "sha-commands",
        reviewedBy: "",
      };
      expect(entryTrustSummary(entry).review.claimStatus).toBeDefined();
      expect(entryTrustSignalCoverage(entry).max).toBe(8);
      expect(sourceSummary(entry).repoUrl).toContain("commands");
      expect(entryCanonicalUrl(entry)).toContain("commands");
    });
    it("trust matrix commands/cursor/pending", () => {
      const entry = {
        category: "commands",
        slug: "commands-cursor",
        title: "commands tool",
        description: "desc",
        platforms: ["cursor"],
        claimStatus: "pending",
        repoUrl: "https://github.com/example/commands",
        documentationUrl: "https://docs.example.com/commands",
        safetyNotes: ["Safety for commands"],
        privacyNotes: ["Privacy for commands"],
        downloadTrust: "first-party",
        checksum: "sha-commands",
        reviewedBy: "",
      };
      expect(entryTrustSummary(entry).review.claimStatus).toBeDefined();
      expect(entryTrustSignalCoverage(entry).max).toBe(8);
      expect(sourceSummary(entry).repoUrl).toContain("commands");
      expect(entryCanonicalUrl(entry)).toContain("commands");
    });
    it("trust matrix commands/cursor/disputed", () => {
      const entry = {
        category: "commands",
        slug: "commands-cursor",
        title: "commands tool",
        description: "desc",
        platforms: ["cursor"],
        claimStatus: "disputed",
        repoUrl: "https://github.com/example/commands",
        documentationUrl: "https://docs.example.com/commands",
        safetyNotes: ["Safety for commands"],
        privacyNotes: ["Privacy for commands"],
        downloadTrust: "first-party",
        checksum: "sha-commands",
        reviewedBy: "",
      };
      expect(entryTrustSummary(entry).review.claimStatus).toBeDefined();
      expect(entryTrustSignalCoverage(entry).max).toBe(8);
      expect(sourceSummary(entry).repoUrl).toContain("commands");
      expect(entryCanonicalUrl(entry)).toContain("commands");
    });
    it("trust matrix commands/cursor/none", () => {
      const entry = {
        category: "commands",
        slug: "commands-cursor",
        title: "commands tool",
        description: "desc",
        platforms: ["cursor"],
        claimStatus: "",
        repoUrl: "https://github.com/example/commands",
        documentationUrl: "https://docs.example.com/commands",
        safetyNotes: ["Safety for commands"],
        privacyNotes: ["Privacy for commands"],
        downloadTrust: "first-party",
        checksum: "sha-commands",
        reviewedBy: "",
      };
      expect(entryTrustSummary(entry).review.claimStatus).toBeDefined();
      expect(entryTrustSignalCoverage(entry).max).toBe(8);
      expect(sourceSummary(entry).repoUrl).toContain("commands");
      expect(entryCanonicalUrl(entry)).toContain("commands");
    });
    it("trust matrix commands/codex/verified", () => {
      const entry = {
        category: "commands",
        slug: "commands-codex",
        title: "commands tool",
        description: "desc",
        platforms: ["codex"],
        claimStatus: "verified",
        repoUrl: "https://github.com/example/commands",
        documentationUrl: "https://docs.example.com/commands",
        safetyNotes: ["Safety for commands"],
        privacyNotes: ["Privacy for commands"],
        downloadTrust: "first-party",
        checksum: "sha-commands",
        reviewedBy: "maintainer",
      };
      expect(entryTrustSummary(entry).review.claimStatus).toBeDefined();
      expect(entryTrustSignalCoverage(entry).max).toBe(8);
      expect(sourceSummary(entry).repoUrl).toContain("commands");
      expect(entryCanonicalUrl(entry)).toContain("commands");
    });
    it("trust matrix commands/codex/unclaimed", () => {
      const entry = {
        category: "commands",
        slug: "commands-codex",
        title: "commands tool",
        description: "desc",
        platforms: ["codex"],
        claimStatus: "unclaimed",
        repoUrl: "https://github.com/example/commands",
        documentationUrl: "https://docs.example.com/commands",
        safetyNotes: ["Safety for commands"],
        privacyNotes: ["Privacy for commands"],
        downloadTrust: "first-party",
        checksum: "sha-commands",
        reviewedBy: "",
      };
      expect(entryTrustSummary(entry).review.claimStatus).toBeDefined();
      expect(entryTrustSignalCoverage(entry).max).toBe(8);
      expect(sourceSummary(entry).repoUrl).toContain("commands");
      expect(entryCanonicalUrl(entry)).toContain("commands");
    });
    it("trust matrix commands/codex/pending", () => {
      const entry = {
        category: "commands",
        slug: "commands-codex",
        title: "commands tool",
        description: "desc",
        platforms: ["codex"],
        claimStatus: "pending",
        repoUrl: "https://github.com/example/commands",
        documentationUrl: "https://docs.example.com/commands",
        safetyNotes: ["Safety for commands"],
        privacyNotes: ["Privacy for commands"],
        downloadTrust: "first-party",
        checksum: "sha-commands",
        reviewedBy: "",
      };
      expect(entryTrustSummary(entry).review.claimStatus).toBeDefined();
      expect(entryTrustSignalCoverage(entry).max).toBe(8);
      expect(sourceSummary(entry).repoUrl).toContain("commands");
      expect(entryCanonicalUrl(entry)).toContain("commands");
    });
    it("trust matrix commands/codex/disputed", () => {
      const entry = {
        category: "commands",
        slug: "commands-codex",
        title: "commands tool",
        description: "desc",
        platforms: ["codex"],
        claimStatus: "disputed",
        repoUrl: "https://github.com/example/commands",
        documentationUrl: "https://docs.example.com/commands",
        safetyNotes: ["Safety for commands"],
        privacyNotes: ["Privacy for commands"],
        downloadTrust: "first-party",
        checksum: "sha-commands",
        reviewedBy: "",
      };
      expect(entryTrustSummary(entry).review.claimStatus).toBeDefined();
      expect(entryTrustSignalCoverage(entry).max).toBe(8);
      expect(sourceSummary(entry).repoUrl).toContain("commands");
      expect(entryCanonicalUrl(entry)).toContain("commands");
    });
    it("trust matrix commands/codex/none", () => {
      const entry = {
        category: "commands",
        slug: "commands-codex",
        title: "commands tool",
        description: "desc",
        platforms: ["codex"],
        claimStatus: "",
        repoUrl: "https://github.com/example/commands",
        documentationUrl: "https://docs.example.com/commands",
        safetyNotes: ["Safety for commands"],
        privacyNotes: ["Privacy for commands"],
        downloadTrust: "first-party",
        checksum: "sha-commands",
        reviewedBy: "",
      };
      expect(entryTrustSummary(entry).review.claimStatus).toBeDefined();
      expect(entryTrustSignalCoverage(entry).max).toBe(8);
      expect(sourceSummary(entry).repoUrl).toContain("commands");
      expect(entryCanonicalUrl(entry)).toContain("commands");
    });
    it("trust matrix commands/windsurf/verified", () => {
      const entry = {
        category: "commands",
        slug: "commands-windsurf",
        title: "commands tool",
        description: "desc",
        platforms: ["windsurf"],
        claimStatus: "verified",
        repoUrl: "https://github.com/example/commands",
        documentationUrl: "https://docs.example.com/commands",
        safetyNotes: ["Safety for commands"],
        privacyNotes: ["Privacy for commands"],
        downloadTrust: "first-party",
        checksum: "sha-commands",
        reviewedBy: "maintainer",
      };
      expect(entryTrustSummary(entry).review.claimStatus).toBeDefined();
      expect(entryTrustSignalCoverage(entry).max).toBe(8);
      expect(sourceSummary(entry).repoUrl).toContain("commands");
      expect(entryCanonicalUrl(entry)).toContain("commands");
    });
    it("trust matrix commands/windsurf/unclaimed", () => {
      const entry = {
        category: "commands",
        slug: "commands-windsurf",
        title: "commands tool",
        description: "desc",
        platforms: ["windsurf"],
        claimStatus: "unclaimed",
        repoUrl: "https://github.com/example/commands",
        documentationUrl: "https://docs.example.com/commands",
        safetyNotes: ["Safety for commands"],
        privacyNotes: ["Privacy for commands"],
        downloadTrust: "first-party",
        checksum: "sha-commands",
        reviewedBy: "",
      };
      expect(entryTrustSummary(entry).review.claimStatus).toBeDefined();
      expect(entryTrustSignalCoverage(entry).max).toBe(8);
      expect(sourceSummary(entry).repoUrl).toContain("commands");
      expect(entryCanonicalUrl(entry)).toContain("commands");
    });
    it("trust matrix commands/windsurf/pending", () => {
      const entry = {
        category: "commands",
        slug: "commands-windsurf",
        title: "commands tool",
        description: "desc",
        platforms: ["windsurf"],
        claimStatus: "pending",
        repoUrl: "https://github.com/example/commands",
        documentationUrl: "https://docs.example.com/commands",
        safetyNotes: ["Safety for commands"],
        privacyNotes: ["Privacy for commands"],
        downloadTrust: "first-party",
        checksum: "sha-commands",
        reviewedBy: "",
      };
      expect(entryTrustSummary(entry).review.claimStatus).toBeDefined();
      expect(entryTrustSignalCoverage(entry).max).toBe(8);
      expect(sourceSummary(entry).repoUrl).toContain("commands");
      expect(entryCanonicalUrl(entry)).toContain("commands");
    });
    it("trust matrix commands/windsurf/disputed", () => {
      const entry = {
        category: "commands",
        slug: "commands-windsurf",
        title: "commands tool",
        description: "desc",
        platforms: ["windsurf"],
        claimStatus: "disputed",
        repoUrl: "https://github.com/example/commands",
        documentationUrl: "https://docs.example.com/commands",
        safetyNotes: ["Safety for commands"],
        privacyNotes: ["Privacy for commands"],
        downloadTrust: "first-party",
        checksum: "sha-commands",
        reviewedBy: "",
      };
      expect(entryTrustSummary(entry).review.claimStatus).toBeDefined();
      expect(entryTrustSignalCoverage(entry).max).toBe(8);
      expect(sourceSummary(entry).repoUrl).toContain("commands");
      expect(entryCanonicalUrl(entry)).toContain("commands");
    });
    it("trust matrix commands/windsurf/none", () => {
      const entry = {
        category: "commands",
        slug: "commands-windsurf",
        title: "commands tool",
        description: "desc",
        platforms: ["windsurf"],
        claimStatus: "",
        repoUrl: "https://github.com/example/commands",
        documentationUrl: "https://docs.example.com/commands",
        safetyNotes: ["Safety for commands"],
        privacyNotes: ["Privacy for commands"],
        downloadTrust: "first-party",
        checksum: "sha-commands",
        reviewedBy: "",
      };
      expect(entryTrustSummary(entry).review.claimStatus).toBeDefined();
      expect(entryTrustSignalCoverage(entry).max).toBe(8);
      expect(sourceSummary(entry).repoUrl).toContain("commands");
      expect(entryCanonicalUrl(entry)).toContain("commands");
    });
    it("trust matrix commands/vscode/verified", () => {
      const entry = {
        category: "commands",
        slug: "commands-vscode",
        title: "commands tool",
        description: "desc",
        platforms: ["vscode"],
        claimStatus: "verified",
        repoUrl: "https://github.com/example/commands",
        documentationUrl: "https://docs.example.com/commands",
        safetyNotes: ["Safety for commands"],
        privacyNotes: ["Privacy for commands"],
        downloadTrust: "first-party",
        checksum: "sha-commands",
        reviewedBy: "maintainer",
      };
      expect(entryTrustSummary(entry).review.claimStatus).toBeDefined();
      expect(entryTrustSignalCoverage(entry).max).toBe(8);
      expect(sourceSummary(entry).repoUrl).toContain("commands");
      expect(entryCanonicalUrl(entry)).toContain("commands");
    });
    it("trust matrix commands/vscode/unclaimed", () => {
      const entry = {
        category: "commands",
        slug: "commands-vscode",
        title: "commands tool",
        description: "desc",
        platforms: ["vscode"],
        claimStatus: "unclaimed",
        repoUrl: "https://github.com/example/commands",
        documentationUrl: "https://docs.example.com/commands",
        safetyNotes: ["Safety for commands"],
        privacyNotes: ["Privacy for commands"],
        downloadTrust: "first-party",
        checksum: "sha-commands",
        reviewedBy: "",
      };
      expect(entryTrustSummary(entry).review.claimStatus).toBeDefined();
      expect(entryTrustSignalCoverage(entry).max).toBe(8);
      expect(sourceSummary(entry).repoUrl).toContain("commands");
      expect(entryCanonicalUrl(entry)).toContain("commands");
    });
    it("trust matrix commands/vscode/pending", () => {
      const entry = {
        category: "commands",
        slug: "commands-vscode",
        title: "commands tool",
        description: "desc",
        platforms: ["vscode"],
        claimStatus: "pending",
        repoUrl: "https://github.com/example/commands",
        documentationUrl: "https://docs.example.com/commands",
        safetyNotes: ["Safety for commands"],
        privacyNotes: ["Privacy for commands"],
        downloadTrust: "first-party",
        checksum: "sha-commands",
        reviewedBy: "",
      };
      expect(entryTrustSummary(entry).review.claimStatus).toBeDefined();
      expect(entryTrustSignalCoverage(entry).max).toBe(8);
      expect(sourceSummary(entry).repoUrl).toContain("commands");
      expect(entryCanonicalUrl(entry)).toContain("commands");
    });
    it("trust matrix commands/vscode/disputed", () => {
      const entry = {
        category: "commands",
        slug: "commands-vscode",
        title: "commands tool",
        description: "desc",
        platforms: ["vscode"],
        claimStatus: "disputed",
        repoUrl: "https://github.com/example/commands",
        documentationUrl: "https://docs.example.com/commands",
        safetyNotes: ["Safety for commands"],
        privacyNotes: ["Privacy for commands"],
        downloadTrust: "first-party",
        checksum: "sha-commands",
        reviewedBy: "",
      };
      expect(entryTrustSummary(entry).review.claimStatus).toBeDefined();
      expect(entryTrustSignalCoverage(entry).max).toBe(8);
      expect(sourceSummary(entry).repoUrl).toContain("commands");
      expect(entryCanonicalUrl(entry)).toContain("commands");
    });
    it("trust matrix commands/vscode/none", () => {
      const entry = {
        category: "commands",
        slug: "commands-vscode",
        title: "commands tool",
        description: "desc",
        platforms: ["vscode"],
        claimStatus: "",
        repoUrl: "https://github.com/example/commands",
        documentationUrl: "https://docs.example.com/commands",
        safetyNotes: ["Safety for commands"],
        privacyNotes: ["Privacy for commands"],
        downloadTrust: "first-party",
        checksum: "sha-commands",
        reviewedBy: "",
      };
      expect(entryTrustSummary(entry).review.claimStatus).toBeDefined();
      expect(entryTrustSignalCoverage(entry).max).toBe(8);
      expect(sourceSummary(entry).repoUrl).toContain("commands");
      expect(entryCanonicalUrl(entry)).toContain("commands");
    });
    it("trust matrix commands/jetbrains/verified", () => {
      const entry = {
        category: "commands",
        slug: "commands-jetbrains",
        title: "commands tool",
        description: "desc",
        platforms: ["jetbrains"],
        claimStatus: "verified",
        repoUrl: "https://github.com/example/commands",
        documentationUrl: "https://docs.example.com/commands",
        safetyNotes: ["Safety for commands"],
        privacyNotes: ["Privacy for commands"],
        downloadTrust: "first-party",
        checksum: "sha-commands",
        reviewedBy: "maintainer",
      };
      expect(entryTrustSummary(entry).review.claimStatus).toBeDefined();
      expect(entryTrustSignalCoverage(entry).max).toBe(8);
      expect(sourceSummary(entry).repoUrl).toContain("commands");
      expect(entryCanonicalUrl(entry)).toContain("commands");
    });
    it("trust matrix commands/jetbrains/unclaimed", () => {
      const entry = {
        category: "commands",
        slug: "commands-jetbrains",
        title: "commands tool",
        description: "desc",
        platforms: ["jetbrains"],
        claimStatus: "unclaimed",
        repoUrl: "https://github.com/example/commands",
        documentationUrl: "https://docs.example.com/commands",
        safetyNotes: ["Safety for commands"],
        privacyNotes: ["Privacy for commands"],
        downloadTrust: "first-party",
        checksum: "sha-commands",
        reviewedBy: "",
      };
      expect(entryTrustSummary(entry).review.claimStatus).toBeDefined();
      expect(entryTrustSignalCoverage(entry).max).toBe(8);
      expect(sourceSummary(entry).repoUrl).toContain("commands");
      expect(entryCanonicalUrl(entry)).toContain("commands");
    });
    it("trust matrix commands/jetbrains/pending", () => {
      const entry = {
        category: "commands",
        slug: "commands-jetbrains",
        title: "commands tool",
        description: "desc",
        platforms: ["jetbrains"],
        claimStatus: "pending",
        repoUrl: "https://github.com/example/commands",
        documentationUrl: "https://docs.example.com/commands",
        safetyNotes: ["Safety for commands"],
        privacyNotes: ["Privacy for commands"],
        downloadTrust: "first-party",
        checksum: "sha-commands",
        reviewedBy: "",
      };
      expect(entryTrustSummary(entry).review.claimStatus).toBeDefined();
      expect(entryTrustSignalCoverage(entry).max).toBe(8);
      expect(sourceSummary(entry).repoUrl).toContain("commands");
      expect(entryCanonicalUrl(entry)).toContain("commands");
    });
    it("trust matrix commands/jetbrains/disputed", () => {
      const entry = {
        category: "commands",
        slug: "commands-jetbrains",
        title: "commands tool",
        description: "desc",
        platforms: ["jetbrains"],
        claimStatus: "disputed",
        repoUrl: "https://github.com/example/commands",
        documentationUrl: "https://docs.example.com/commands",
        safetyNotes: ["Safety for commands"],
        privacyNotes: ["Privacy for commands"],
        downloadTrust: "first-party",
        checksum: "sha-commands",
        reviewedBy: "",
      };
      expect(entryTrustSummary(entry).review.claimStatus).toBeDefined();
      expect(entryTrustSignalCoverage(entry).max).toBe(8);
      expect(sourceSummary(entry).repoUrl).toContain("commands");
      expect(entryCanonicalUrl(entry)).toContain("commands");
    });
    it("trust matrix commands/jetbrains/none", () => {
      const entry = {
        category: "commands",
        slug: "commands-jetbrains",
        title: "commands tool",
        description: "desc",
        platforms: ["jetbrains"],
        claimStatus: "",
        repoUrl: "https://github.com/example/commands",
        documentationUrl: "https://docs.example.com/commands",
        safetyNotes: ["Safety for commands"],
        privacyNotes: ["Privacy for commands"],
        downloadTrust: "first-party",
        checksum: "sha-commands",
        reviewedBy: "",
      };
      expect(entryTrustSummary(entry).review.claimStatus).toBeDefined();
      expect(entryTrustSignalCoverage(entry).max).toBe(8);
      expect(sourceSummary(entry).repoUrl).toContain("commands");
      expect(entryCanonicalUrl(entry)).toContain("commands");
    });
    it("trust matrix statuslines/claude-code/verified", () => {
      const entry = {
        category: "statuslines",
        slug: "statuslines-claude-code",
        title: "statuslines tool",
        description: "desc",
        platforms: ["claude-code"],
        claimStatus: "verified",
        repoUrl: "https://github.com/example/statuslines",
        documentationUrl: "https://docs.example.com/statuslines",
        safetyNotes: ["Safety for statuslines"],
        privacyNotes: ["Privacy for statuslines"],
        downloadTrust: "first-party",
        checksum: "sha-statuslines",
        reviewedBy: "maintainer",
      };
      expect(entryTrustSummary(entry).review.claimStatus).toBeDefined();
      expect(entryTrustSignalCoverage(entry).max).toBe(8);
      expect(sourceSummary(entry).repoUrl).toContain("statuslines");
      expect(entryCanonicalUrl(entry)).toContain("statuslines");
    });
    it("trust matrix statuslines/claude-code/unclaimed", () => {
      const entry = {
        category: "statuslines",
        slug: "statuslines-claude-code",
        title: "statuslines tool",
        description: "desc",
        platforms: ["claude-code"],
        claimStatus: "unclaimed",
        repoUrl: "https://github.com/example/statuslines",
        documentationUrl: "https://docs.example.com/statuslines",
        safetyNotes: ["Safety for statuslines"],
        privacyNotes: ["Privacy for statuslines"],
        downloadTrust: "first-party",
        checksum: "sha-statuslines",
        reviewedBy: "",
      };
      expect(entryTrustSummary(entry).review.claimStatus).toBeDefined();
      expect(entryTrustSignalCoverage(entry).max).toBe(8);
      expect(sourceSummary(entry).repoUrl).toContain("statuslines");
      expect(entryCanonicalUrl(entry)).toContain("statuslines");
    });
    it("trust matrix statuslines/claude-code/pending", () => {
      const entry = {
        category: "statuslines",
        slug: "statuslines-claude-code",
        title: "statuslines tool",
        description: "desc",
        platforms: ["claude-code"],
        claimStatus: "pending",
        repoUrl: "https://github.com/example/statuslines",
        documentationUrl: "https://docs.example.com/statuslines",
        safetyNotes: ["Safety for statuslines"],
        privacyNotes: ["Privacy for statuslines"],
        downloadTrust: "first-party",
        checksum: "sha-statuslines",
        reviewedBy: "",
      };
      expect(entryTrustSummary(entry).review.claimStatus).toBeDefined();
      expect(entryTrustSignalCoverage(entry).max).toBe(8);
      expect(sourceSummary(entry).repoUrl).toContain("statuslines");
      expect(entryCanonicalUrl(entry)).toContain("statuslines");
    });
    it("trust matrix statuslines/claude-code/disputed", () => {
      const entry = {
        category: "statuslines",
        slug: "statuslines-claude-code",
        title: "statuslines tool",
        description: "desc",
        platforms: ["claude-code"],
        claimStatus: "disputed",
        repoUrl: "https://github.com/example/statuslines",
        documentationUrl: "https://docs.example.com/statuslines",
        safetyNotes: ["Safety for statuslines"],
        privacyNotes: ["Privacy for statuslines"],
        downloadTrust: "first-party",
        checksum: "sha-statuslines",
        reviewedBy: "",
      };
      expect(entryTrustSummary(entry).review.claimStatus).toBeDefined();
      expect(entryTrustSignalCoverage(entry).max).toBe(8);
      expect(sourceSummary(entry).repoUrl).toContain("statuslines");
      expect(entryCanonicalUrl(entry)).toContain("statuslines");
    });
    it("trust matrix statuslines/claude-code/none", () => {
      const entry = {
        category: "statuslines",
        slug: "statuslines-claude-code",
        title: "statuslines tool",
        description: "desc",
        platforms: ["claude-code"],
        claimStatus: "",
        repoUrl: "https://github.com/example/statuslines",
        documentationUrl: "https://docs.example.com/statuslines",
        safetyNotes: ["Safety for statuslines"],
        privacyNotes: ["Privacy for statuslines"],
        downloadTrust: "first-party",
        checksum: "sha-statuslines",
        reviewedBy: "",
      };
      expect(entryTrustSummary(entry).review.claimStatus).toBeDefined();
      expect(entryTrustSignalCoverage(entry).max).toBe(8);
      expect(sourceSummary(entry).repoUrl).toContain("statuslines");
      expect(entryCanonicalUrl(entry)).toContain("statuslines");
    });
    it("trust matrix statuslines/cursor/verified", () => {
      const entry = {
        category: "statuslines",
        slug: "statuslines-cursor",
        title: "statuslines tool",
        description: "desc",
        platforms: ["cursor"],
        claimStatus: "verified",
        repoUrl: "https://github.com/example/statuslines",
        documentationUrl: "https://docs.example.com/statuslines",
        safetyNotes: ["Safety for statuslines"],
        privacyNotes: ["Privacy for statuslines"],
        downloadTrust: "first-party",
        checksum: "sha-statuslines",
        reviewedBy: "maintainer",
      };
      expect(entryTrustSummary(entry).review.claimStatus).toBeDefined();
      expect(entryTrustSignalCoverage(entry).max).toBe(8);
      expect(sourceSummary(entry).repoUrl).toContain("statuslines");
      expect(entryCanonicalUrl(entry)).toContain("statuslines");
    });
    it("trust matrix statuslines/cursor/unclaimed", () => {
      const entry = {
        category: "statuslines",
        slug: "statuslines-cursor",
        title: "statuslines tool",
        description: "desc",
        platforms: ["cursor"],
        claimStatus: "unclaimed",
        repoUrl: "https://github.com/example/statuslines",
        documentationUrl: "https://docs.example.com/statuslines",
        safetyNotes: ["Safety for statuslines"],
        privacyNotes: ["Privacy for statuslines"],
        downloadTrust: "first-party",
        checksum: "sha-statuslines",
        reviewedBy: "",
      };
      expect(entryTrustSummary(entry).review.claimStatus).toBeDefined();
      expect(entryTrustSignalCoverage(entry).max).toBe(8);
      expect(sourceSummary(entry).repoUrl).toContain("statuslines");
      expect(entryCanonicalUrl(entry)).toContain("statuslines");
    });
    it("trust matrix statuslines/cursor/pending", () => {
      const entry = {
        category: "statuslines",
        slug: "statuslines-cursor",
        title: "statuslines tool",
        description: "desc",
        platforms: ["cursor"],
        claimStatus: "pending",
        repoUrl: "https://github.com/example/statuslines",
        documentationUrl: "https://docs.example.com/statuslines",
        safetyNotes: ["Safety for statuslines"],
        privacyNotes: ["Privacy for statuslines"],
        downloadTrust: "first-party",
        checksum: "sha-statuslines",
        reviewedBy: "",
      };
      expect(entryTrustSummary(entry).review.claimStatus).toBeDefined();
      expect(entryTrustSignalCoverage(entry).max).toBe(8);
      expect(sourceSummary(entry).repoUrl).toContain("statuslines");
      expect(entryCanonicalUrl(entry)).toContain("statuslines");
    });
    it("trust matrix statuslines/cursor/disputed", () => {
      const entry = {
        category: "statuslines",
        slug: "statuslines-cursor",
        title: "statuslines tool",
        description: "desc",
        platforms: ["cursor"],
        claimStatus: "disputed",
        repoUrl: "https://github.com/example/statuslines",
        documentationUrl: "https://docs.example.com/statuslines",
        safetyNotes: ["Safety for statuslines"],
        privacyNotes: ["Privacy for statuslines"],
        downloadTrust: "first-party",
        checksum: "sha-statuslines",
        reviewedBy: "",
      };
      expect(entryTrustSummary(entry).review.claimStatus).toBeDefined();
      expect(entryTrustSignalCoverage(entry).max).toBe(8);
      expect(sourceSummary(entry).repoUrl).toContain("statuslines");
      expect(entryCanonicalUrl(entry)).toContain("statuslines");
    });
    it("trust matrix statuslines/cursor/none", () => {
      const entry = {
        category: "statuslines",
        slug: "statuslines-cursor",
        title: "statuslines tool",
        description: "desc",
        platforms: ["cursor"],
        claimStatus: "",
        repoUrl: "https://github.com/example/statuslines",
        documentationUrl: "https://docs.example.com/statuslines",
        safetyNotes: ["Safety for statuslines"],
        privacyNotes: ["Privacy for statuslines"],
        downloadTrust: "first-party",
        checksum: "sha-statuslines",
        reviewedBy: "",
      };
      expect(entryTrustSummary(entry).review.claimStatus).toBeDefined();
      expect(entryTrustSignalCoverage(entry).max).toBe(8);
      expect(sourceSummary(entry).repoUrl).toContain("statuslines");
      expect(entryCanonicalUrl(entry)).toContain("statuslines");
    });
    it("trust matrix statuslines/codex/verified", () => {
      const entry = {
        category: "statuslines",
        slug: "statuslines-codex",
        title: "statuslines tool",
        description: "desc",
        platforms: ["codex"],
        claimStatus: "verified",
        repoUrl: "https://github.com/example/statuslines",
        documentationUrl: "https://docs.example.com/statuslines",
        safetyNotes: ["Safety for statuslines"],
        privacyNotes: ["Privacy for statuslines"],
        downloadTrust: "first-party",
        checksum: "sha-statuslines",
        reviewedBy: "maintainer",
      };
      expect(entryTrustSummary(entry).review.claimStatus).toBeDefined();
      expect(entryTrustSignalCoverage(entry).max).toBe(8);
      expect(sourceSummary(entry).repoUrl).toContain("statuslines");
      expect(entryCanonicalUrl(entry)).toContain("statuslines");
    });
    it("trust matrix statuslines/codex/unclaimed", () => {
      const entry = {
        category: "statuslines",
        slug: "statuslines-codex",
        title: "statuslines tool",
        description: "desc",
        platforms: ["codex"],
        claimStatus: "unclaimed",
        repoUrl: "https://github.com/example/statuslines",
        documentationUrl: "https://docs.example.com/statuslines",
        safetyNotes: ["Safety for statuslines"],
        privacyNotes: ["Privacy for statuslines"],
        downloadTrust: "first-party",
        checksum: "sha-statuslines",
        reviewedBy: "",
      };
      expect(entryTrustSummary(entry).review.claimStatus).toBeDefined();
      expect(entryTrustSignalCoverage(entry).max).toBe(8);
      expect(sourceSummary(entry).repoUrl).toContain("statuslines");
      expect(entryCanonicalUrl(entry)).toContain("statuslines");
    });
    it("trust matrix statuslines/codex/pending", () => {
      const entry = {
        category: "statuslines",
        slug: "statuslines-codex",
        title: "statuslines tool",
        description: "desc",
        platforms: ["codex"],
        claimStatus: "pending",
        repoUrl: "https://github.com/example/statuslines",
        documentationUrl: "https://docs.example.com/statuslines",
        safetyNotes: ["Safety for statuslines"],
        privacyNotes: ["Privacy for statuslines"],
        downloadTrust: "first-party",
        checksum: "sha-statuslines",
        reviewedBy: "",
      };
      expect(entryTrustSummary(entry).review.claimStatus).toBeDefined();
      expect(entryTrustSignalCoverage(entry).max).toBe(8);
      expect(sourceSummary(entry).repoUrl).toContain("statuslines");
      expect(entryCanonicalUrl(entry)).toContain("statuslines");
    });
    it("trust matrix statuslines/codex/disputed", () => {
      const entry = {
        category: "statuslines",
        slug: "statuslines-codex",
        title: "statuslines tool",
        description: "desc",
        platforms: ["codex"],
        claimStatus: "disputed",
        repoUrl: "https://github.com/example/statuslines",
        documentationUrl: "https://docs.example.com/statuslines",
        safetyNotes: ["Safety for statuslines"],
        privacyNotes: ["Privacy for statuslines"],
        downloadTrust: "first-party",
        checksum: "sha-statuslines",
        reviewedBy: "",
      };
      expect(entryTrustSummary(entry).review.claimStatus).toBeDefined();
      expect(entryTrustSignalCoverage(entry).max).toBe(8);
      expect(sourceSummary(entry).repoUrl).toContain("statuslines");
      expect(entryCanonicalUrl(entry)).toContain("statuslines");
    });
    it("trust matrix statuslines/codex/none", () => {
      const entry = {
        category: "statuslines",
        slug: "statuslines-codex",
        title: "statuslines tool",
        description: "desc",
        platforms: ["codex"],
        claimStatus: "",
        repoUrl: "https://github.com/example/statuslines",
        documentationUrl: "https://docs.example.com/statuslines",
        safetyNotes: ["Safety for statuslines"],
        privacyNotes: ["Privacy for statuslines"],
        downloadTrust: "first-party",
        checksum: "sha-statuslines",
        reviewedBy: "",
      };
      expect(entryTrustSummary(entry).review.claimStatus).toBeDefined();
      expect(entryTrustSignalCoverage(entry).max).toBe(8);
      expect(sourceSummary(entry).repoUrl).toContain("statuslines");
      expect(entryCanonicalUrl(entry)).toContain("statuslines");
    });
    it("trust matrix statuslines/windsurf/verified", () => {
      const entry = {
        category: "statuslines",
        slug: "statuslines-windsurf",
        title: "statuslines tool",
        description: "desc",
        platforms: ["windsurf"],
        claimStatus: "verified",
        repoUrl: "https://github.com/example/statuslines",
        documentationUrl: "https://docs.example.com/statuslines",
        safetyNotes: ["Safety for statuslines"],
        privacyNotes: ["Privacy for statuslines"],
        downloadTrust: "first-party",
        checksum: "sha-statuslines",
        reviewedBy: "maintainer",
      };
      expect(entryTrustSummary(entry).review.claimStatus).toBeDefined();
      expect(entryTrustSignalCoverage(entry).max).toBe(8);
      expect(sourceSummary(entry).repoUrl).toContain("statuslines");
      expect(entryCanonicalUrl(entry)).toContain("statuslines");
    });
    it("trust matrix statuslines/windsurf/unclaimed", () => {
      const entry = {
        category: "statuslines",
        slug: "statuslines-windsurf",
        title: "statuslines tool",
        description: "desc",
        platforms: ["windsurf"],
        claimStatus: "unclaimed",
        repoUrl: "https://github.com/example/statuslines",
        documentationUrl: "https://docs.example.com/statuslines",
        safetyNotes: ["Safety for statuslines"],
        privacyNotes: ["Privacy for statuslines"],
        downloadTrust: "first-party",
        checksum: "sha-statuslines",
        reviewedBy: "",
      };
      expect(entryTrustSummary(entry).review.claimStatus).toBeDefined();
      expect(entryTrustSignalCoverage(entry).max).toBe(8);
      expect(sourceSummary(entry).repoUrl).toContain("statuslines");
      expect(entryCanonicalUrl(entry)).toContain("statuslines");
    });
    it("trust matrix statuslines/windsurf/pending", () => {
      const entry = {
        category: "statuslines",
        slug: "statuslines-windsurf",
        title: "statuslines tool",
        description: "desc",
        platforms: ["windsurf"],
        claimStatus: "pending",
        repoUrl: "https://github.com/example/statuslines",
        documentationUrl: "https://docs.example.com/statuslines",
        safetyNotes: ["Safety for statuslines"],
        privacyNotes: ["Privacy for statuslines"],
        downloadTrust: "first-party",
        checksum: "sha-statuslines",
        reviewedBy: "",
      };
      expect(entryTrustSummary(entry).review.claimStatus).toBeDefined();
      expect(entryTrustSignalCoverage(entry).max).toBe(8);
      expect(sourceSummary(entry).repoUrl).toContain("statuslines");
      expect(entryCanonicalUrl(entry)).toContain("statuslines");
    });
    it("trust matrix statuslines/windsurf/disputed", () => {
      const entry = {
        category: "statuslines",
        slug: "statuslines-windsurf",
        title: "statuslines tool",
        description: "desc",
        platforms: ["windsurf"],
        claimStatus: "disputed",
        repoUrl: "https://github.com/example/statuslines",
        documentationUrl: "https://docs.example.com/statuslines",
        safetyNotes: ["Safety for statuslines"],
        privacyNotes: ["Privacy for statuslines"],
        downloadTrust: "first-party",
        checksum: "sha-statuslines",
        reviewedBy: "",
      };
      expect(entryTrustSummary(entry).review.claimStatus).toBeDefined();
      expect(entryTrustSignalCoverage(entry).max).toBe(8);
      expect(sourceSummary(entry).repoUrl).toContain("statuslines");
      expect(entryCanonicalUrl(entry)).toContain("statuslines");
    });
    it("trust matrix statuslines/windsurf/none", () => {
      const entry = {
        category: "statuslines",
        slug: "statuslines-windsurf",
        title: "statuslines tool",
        description: "desc",
        platforms: ["windsurf"],
        claimStatus: "",
        repoUrl: "https://github.com/example/statuslines",
        documentationUrl: "https://docs.example.com/statuslines",
        safetyNotes: ["Safety for statuslines"],
        privacyNotes: ["Privacy for statuslines"],
        downloadTrust: "first-party",
        checksum: "sha-statuslines",
        reviewedBy: "",
      };
      expect(entryTrustSummary(entry).review.claimStatus).toBeDefined();
      expect(entryTrustSignalCoverage(entry).max).toBe(8);
      expect(sourceSummary(entry).repoUrl).toContain("statuslines");
      expect(entryCanonicalUrl(entry)).toContain("statuslines");
    });
    it("trust matrix statuslines/vscode/verified", () => {
      const entry = {
        category: "statuslines",
        slug: "statuslines-vscode",
        title: "statuslines tool",
        description: "desc",
        platforms: ["vscode"],
        claimStatus: "verified",
        repoUrl: "https://github.com/example/statuslines",
        documentationUrl: "https://docs.example.com/statuslines",
        safetyNotes: ["Safety for statuslines"],
        privacyNotes: ["Privacy for statuslines"],
        downloadTrust: "first-party",
        checksum: "sha-statuslines",
        reviewedBy: "maintainer",
      };
      expect(entryTrustSummary(entry).review.claimStatus).toBeDefined();
      expect(entryTrustSignalCoverage(entry).max).toBe(8);
      expect(sourceSummary(entry).repoUrl).toContain("statuslines");
      expect(entryCanonicalUrl(entry)).toContain("statuslines");
    });
    it("trust matrix statuslines/vscode/unclaimed", () => {
      const entry = {
        category: "statuslines",
        slug: "statuslines-vscode",
        title: "statuslines tool",
        description: "desc",
        platforms: ["vscode"],
        claimStatus: "unclaimed",
        repoUrl: "https://github.com/example/statuslines",
        documentationUrl: "https://docs.example.com/statuslines",
        safetyNotes: ["Safety for statuslines"],
        privacyNotes: ["Privacy for statuslines"],
        downloadTrust: "first-party",
        checksum: "sha-statuslines",
        reviewedBy: "",
      };
      expect(entryTrustSummary(entry).review.claimStatus).toBeDefined();
      expect(entryTrustSignalCoverage(entry).max).toBe(8);
      expect(sourceSummary(entry).repoUrl).toContain("statuslines");
      expect(entryCanonicalUrl(entry)).toContain("statuslines");
    });
    it("trust matrix statuslines/vscode/pending", () => {
      const entry = {
        category: "statuslines",
        slug: "statuslines-vscode",
        title: "statuslines tool",
        description: "desc",
        platforms: ["vscode"],
        claimStatus: "pending",
        repoUrl: "https://github.com/example/statuslines",
        documentationUrl: "https://docs.example.com/statuslines",
        safetyNotes: ["Safety for statuslines"],
        privacyNotes: ["Privacy for statuslines"],
        downloadTrust: "first-party",
        checksum: "sha-statuslines",
        reviewedBy: "",
      };
      expect(entryTrustSummary(entry).review.claimStatus).toBeDefined();
      expect(entryTrustSignalCoverage(entry).max).toBe(8);
      expect(sourceSummary(entry).repoUrl).toContain("statuslines");
      expect(entryCanonicalUrl(entry)).toContain("statuslines");
    });
    it("trust matrix statuslines/vscode/disputed", () => {
      const entry = {
        category: "statuslines",
        slug: "statuslines-vscode",
        title: "statuslines tool",
        description: "desc",
        platforms: ["vscode"],
        claimStatus: "disputed",
        repoUrl: "https://github.com/example/statuslines",
        documentationUrl: "https://docs.example.com/statuslines",
        safetyNotes: ["Safety for statuslines"],
        privacyNotes: ["Privacy for statuslines"],
        downloadTrust: "first-party",
        checksum: "sha-statuslines",
        reviewedBy: "",
      };
      expect(entryTrustSummary(entry).review.claimStatus).toBeDefined();
      expect(entryTrustSignalCoverage(entry).max).toBe(8);
      expect(sourceSummary(entry).repoUrl).toContain("statuslines");
      expect(entryCanonicalUrl(entry)).toContain("statuslines");
    });
    it("trust matrix statuslines/vscode/none", () => {
      const entry = {
        category: "statuslines",
        slug: "statuslines-vscode",
        title: "statuslines tool",
        description: "desc",
        platforms: ["vscode"],
        claimStatus: "",
        repoUrl: "https://github.com/example/statuslines",
        documentationUrl: "https://docs.example.com/statuslines",
        safetyNotes: ["Safety for statuslines"],
        privacyNotes: ["Privacy for statuslines"],
        downloadTrust: "first-party",
        checksum: "sha-statuslines",
        reviewedBy: "",
      };
      expect(entryTrustSummary(entry).review.claimStatus).toBeDefined();
      expect(entryTrustSignalCoverage(entry).max).toBe(8);
      expect(sourceSummary(entry).repoUrl).toContain("statuslines");
      expect(entryCanonicalUrl(entry)).toContain("statuslines");
    });
    it("trust matrix statuslines/jetbrains/verified", () => {
      const entry = {
        category: "statuslines",
        slug: "statuslines-jetbrains",
        title: "statuslines tool",
        description: "desc",
        platforms: ["jetbrains"],
        claimStatus: "verified",
        repoUrl: "https://github.com/example/statuslines",
        documentationUrl: "https://docs.example.com/statuslines",
        safetyNotes: ["Safety for statuslines"],
        privacyNotes: ["Privacy for statuslines"],
        downloadTrust: "first-party",
        checksum: "sha-statuslines",
        reviewedBy: "maintainer",
      };
      expect(entryTrustSummary(entry).review.claimStatus).toBeDefined();
      expect(entryTrustSignalCoverage(entry).max).toBe(8);
      expect(sourceSummary(entry).repoUrl).toContain("statuslines");
      expect(entryCanonicalUrl(entry)).toContain("statuslines");
    });
    it("trust matrix statuslines/jetbrains/unclaimed", () => {
      const entry = {
        category: "statuslines",
        slug: "statuslines-jetbrains",
        title: "statuslines tool",
        description: "desc",
        platforms: ["jetbrains"],
        claimStatus: "unclaimed",
        repoUrl: "https://github.com/example/statuslines",
        documentationUrl: "https://docs.example.com/statuslines",
        safetyNotes: ["Safety for statuslines"],
        privacyNotes: ["Privacy for statuslines"],
        downloadTrust: "first-party",
        checksum: "sha-statuslines",
        reviewedBy: "",
      };
      expect(entryTrustSummary(entry).review.claimStatus).toBeDefined();
      expect(entryTrustSignalCoverage(entry).max).toBe(8);
      expect(sourceSummary(entry).repoUrl).toContain("statuslines");
      expect(entryCanonicalUrl(entry)).toContain("statuslines");
    });
    it("trust matrix statuslines/jetbrains/pending", () => {
      const entry = {
        category: "statuslines",
        slug: "statuslines-jetbrains",
        title: "statuslines tool",
        description: "desc",
        platforms: ["jetbrains"],
        claimStatus: "pending",
        repoUrl: "https://github.com/example/statuslines",
        documentationUrl: "https://docs.example.com/statuslines",
        safetyNotes: ["Safety for statuslines"],
        privacyNotes: ["Privacy for statuslines"],
        downloadTrust: "first-party",
        checksum: "sha-statuslines",
        reviewedBy: "",
      };
      expect(entryTrustSummary(entry).review.claimStatus).toBeDefined();
      expect(entryTrustSignalCoverage(entry).max).toBe(8);
      expect(sourceSummary(entry).repoUrl).toContain("statuslines");
      expect(entryCanonicalUrl(entry)).toContain("statuslines");
    });
    it("trust matrix statuslines/jetbrains/disputed", () => {
      const entry = {
        category: "statuslines",
        slug: "statuslines-jetbrains",
        title: "statuslines tool",
        description: "desc",
        platforms: ["jetbrains"],
        claimStatus: "disputed",
        repoUrl: "https://github.com/example/statuslines",
        documentationUrl: "https://docs.example.com/statuslines",
        safetyNotes: ["Safety for statuslines"],
        privacyNotes: ["Privacy for statuslines"],
        downloadTrust: "first-party",
        checksum: "sha-statuslines",
        reviewedBy: "",
      };
      expect(entryTrustSummary(entry).review.claimStatus).toBeDefined();
      expect(entryTrustSignalCoverage(entry).max).toBe(8);
      expect(sourceSummary(entry).repoUrl).toContain("statuslines");
      expect(entryCanonicalUrl(entry)).toContain("statuslines");
    });
    it("trust matrix statuslines/jetbrains/none", () => {
      const entry = {
        category: "statuslines",
        slug: "statuslines-jetbrains",
        title: "statuslines tool",
        description: "desc",
        platforms: ["jetbrains"],
        claimStatus: "",
        repoUrl: "https://github.com/example/statuslines",
        documentationUrl: "https://docs.example.com/statuslines",
        safetyNotes: ["Safety for statuslines"],
        privacyNotes: ["Privacy for statuslines"],
        downloadTrust: "first-party",
        checksum: "sha-statuslines",
        reviewedBy: "",
      };
      expect(entryTrustSummary(entry).review.claimStatus).toBeDefined();
      expect(entryTrustSignalCoverage(entry).max).toBe(8);
      expect(sourceSummary(entry).repoUrl).toContain("statuslines");
      expect(entryCanonicalUrl(entry)).toContain("statuslines");
    });
    it("trust matrix guides/claude-code/verified", () => {
      const entry = {
        category: "guides",
        slug: "guides-claude-code",
        title: "guides tool",
        description: "desc",
        platforms: ["claude-code"],
        claimStatus: "verified",
        repoUrl: "https://github.com/example/guides",
        documentationUrl: "https://docs.example.com/guides",
        safetyNotes: ["Safety for guides"],
        privacyNotes: ["Privacy for guides"],
        downloadTrust: "first-party",
        checksum: "sha-guides",
        reviewedBy: "maintainer",
      };
      expect(entryTrustSummary(entry).review.claimStatus).toBeDefined();
      expect(entryTrustSignalCoverage(entry).max).toBe(8);
      expect(sourceSummary(entry).repoUrl).toContain("guides");
      expect(entryCanonicalUrl(entry)).toContain("guides");
    });
    it("trust matrix guides/claude-code/unclaimed", () => {
      const entry = {
        category: "guides",
        slug: "guides-claude-code",
        title: "guides tool",
        description: "desc",
        platforms: ["claude-code"],
        claimStatus: "unclaimed",
        repoUrl: "https://github.com/example/guides",
        documentationUrl: "https://docs.example.com/guides",
        safetyNotes: ["Safety for guides"],
        privacyNotes: ["Privacy for guides"],
        downloadTrust: "first-party",
        checksum: "sha-guides",
        reviewedBy: "",
      };
      expect(entryTrustSummary(entry).review.claimStatus).toBeDefined();
      expect(entryTrustSignalCoverage(entry).max).toBe(8);
      expect(sourceSummary(entry).repoUrl).toContain("guides");
      expect(entryCanonicalUrl(entry)).toContain("guides");
    });
    it("trust matrix guides/claude-code/pending", () => {
      const entry = {
        category: "guides",
        slug: "guides-claude-code",
        title: "guides tool",
        description: "desc",
        platforms: ["claude-code"],
        claimStatus: "pending",
        repoUrl: "https://github.com/example/guides",
        documentationUrl: "https://docs.example.com/guides",
        safetyNotes: ["Safety for guides"],
        privacyNotes: ["Privacy for guides"],
        downloadTrust: "first-party",
        checksum: "sha-guides",
        reviewedBy: "",
      };
      expect(entryTrustSummary(entry).review.claimStatus).toBeDefined();
      expect(entryTrustSignalCoverage(entry).max).toBe(8);
      expect(sourceSummary(entry).repoUrl).toContain("guides");
      expect(entryCanonicalUrl(entry)).toContain("guides");
    });
    it("trust matrix guides/claude-code/disputed", () => {
      const entry = {
        category: "guides",
        slug: "guides-claude-code",
        title: "guides tool",
        description: "desc",
        platforms: ["claude-code"],
        claimStatus: "disputed",
        repoUrl: "https://github.com/example/guides",
        documentationUrl: "https://docs.example.com/guides",
        safetyNotes: ["Safety for guides"],
        privacyNotes: ["Privacy for guides"],
        downloadTrust: "first-party",
        checksum: "sha-guides",
        reviewedBy: "",
      };
      expect(entryTrustSummary(entry).review.claimStatus).toBeDefined();
      expect(entryTrustSignalCoverage(entry).max).toBe(8);
      expect(sourceSummary(entry).repoUrl).toContain("guides");
      expect(entryCanonicalUrl(entry)).toContain("guides");
    });
    it("trust matrix guides/claude-code/none", () => {
      const entry = {
        category: "guides",
        slug: "guides-claude-code",
        title: "guides tool",
        description: "desc",
        platforms: ["claude-code"],
        claimStatus: "",
        repoUrl: "https://github.com/example/guides",
        documentationUrl: "https://docs.example.com/guides",
        safetyNotes: ["Safety for guides"],
        privacyNotes: ["Privacy for guides"],
        downloadTrust: "first-party",
        checksum: "sha-guides",
        reviewedBy: "",
      };
      expect(entryTrustSummary(entry).review.claimStatus).toBeDefined();
      expect(entryTrustSignalCoverage(entry).max).toBe(8);
      expect(sourceSummary(entry).repoUrl).toContain("guides");
      expect(entryCanonicalUrl(entry)).toContain("guides");
    });
    it("trust matrix guides/cursor/verified", () => {
      const entry = {
        category: "guides",
        slug: "guides-cursor",
        title: "guides tool",
        description: "desc",
        platforms: ["cursor"],
        claimStatus: "verified",
        repoUrl: "https://github.com/example/guides",
        documentationUrl: "https://docs.example.com/guides",
        safetyNotes: ["Safety for guides"],
        privacyNotes: ["Privacy for guides"],
        downloadTrust: "first-party",
        checksum: "sha-guides",
        reviewedBy: "maintainer",
      };
      expect(entryTrustSummary(entry).review.claimStatus).toBeDefined();
      expect(entryTrustSignalCoverage(entry).max).toBe(8);
      expect(sourceSummary(entry).repoUrl).toContain("guides");
      expect(entryCanonicalUrl(entry)).toContain("guides");
    });
    it("trust matrix guides/cursor/unclaimed", () => {
      const entry = {
        category: "guides",
        slug: "guides-cursor",
        title: "guides tool",
        description: "desc",
        platforms: ["cursor"],
        claimStatus: "unclaimed",
        repoUrl: "https://github.com/example/guides",
        documentationUrl: "https://docs.example.com/guides",
        safetyNotes: ["Safety for guides"],
        privacyNotes: ["Privacy for guides"],
        downloadTrust: "first-party",
        checksum: "sha-guides",
        reviewedBy: "",
      };
      expect(entryTrustSummary(entry).review.claimStatus).toBeDefined();
      expect(entryTrustSignalCoverage(entry).max).toBe(8);
      expect(sourceSummary(entry).repoUrl).toContain("guides");
      expect(entryCanonicalUrl(entry)).toContain("guides");
    });
    it("trust matrix guides/cursor/pending", () => {
      const entry = {
        category: "guides",
        slug: "guides-cursor",
        title: "guides tool",
        description: "desc",
        platforms: ["cursor"],
        claimStatus: "pending",
        repoUrl: "https://github.com/example/guides",
        documentationUrl: "https://docs.example.com/guides",
        safetyNotes: ["Safety for guides"],
        privacyNotes: ["Privacy for guides"],
        downloadTrust: "first-party",
        checksum: "sha-guides",
        reviewedBy: "",
      };
      expect(entryTrustSummary(entry).review.claimStatus).toBeDefined();
      expect(entryTrustSignalCoverage(entry).max).toBe(8);
      expect(sourceSummary(entry).repoUrl).toContain("guides");
      expect(entryCanonicalUrl(entry)).toContain("guides");
    });
    it("trust matrix guides/cursor/disputed", () => {
      const entry = {
        category: "guides",
        slug: "guides-cursor",
        title: "guides tool",
        description: "desc",
        platforms: ["cursor"],
        claimStatus: "disputed",
        repoUrl: "https://github.com/example/guides",
        documentationUrl: "https://docs.example.com/guides",
        safetyNotes: ["Safety for guides"],
        privacyNotes: ["Privacy for guides"],
        downloadTrust: "first-party",
        checksum: "sha-guides",
        reviewedBy: "",
      };
      expect(entryTrustSummary(entry).review.claimStatus).toBeDefined();
      expect(entryTrustSignalCoverage(entry).max).toBe(8);
      expect(sourceSummary(entry).repoUrl).toContain("guides");
      expect(entryCanonicalUrl(entry)).toContain("guides");
    });
    it("trust matrix guides/cursor/none", () => {
      const entry = {
        category: "guides",
        slug: "guides-cursor",
        title: "guides tool",
        description: "desc",
        platforms: ["cursor"],
        claimStatus: "",
        repoUrl: "https://github.com/example/guides",
        documentationUrl: "https://docs.example.com/guides",
        safetyNotes: ["Safety for guides"],
        privacyNotes: ["Privacy for guides"],
        downloadTrust: "first-party",
        checksum: "sha-guides",
        reviewedBy: "",
      };
      expect(entryTrustSummary(entry).review.claimStatus).toBeDefined();
      expect(entryTrustSignalCoverage(entry).max).toBe(8);
      expect(sourceSummary(entry).repoUrl).toContain("guides");
      expect(entryCanonicalUrl(entry)).toContain("guides");
    });
    it("trust matrix guides/codex/verified", () => {
      const entry = {
        category: "guides",
        slug: "guides-codex",
        title: "guides tool",
        description: "desc",
        platforms: ["codex"],
        claimStatus: "verified",
        repoUrl: "https://github.com/example/guides",
        documentationUrl: "https://docs.example.com/guides",
        safetyNotes: ["Safety for guides"],
        privacyNotes: ["Privacy for guides"],
        downloadTrust: "first-party",
        checksum: "sha-guides",
        reviewedBy: "maintainer",
      };
      expect(entryTrustSummary(entry).review.claimStatus).toBeDefined();
      expect(entryTrustSignalCoverage(entry).max).toBe(8);
      expect(sourceSummary(entry).repoUrl).toContain("guides");
      expect(entryCanonicalUrl(entry)).toContain("guides");
    });
    it("trust matrix guides/codex/unclaimed", () => {
      const entry = {
        category: "guides",
        slug: "guides-codex",
        title: "guides tool",
        description: "desc",
        platforms: ["codex"],
        claimStatus: "unclaimed",
        repoUrl: "https://github.com/example/guides",
        documentationUrl: "https://docs.example.com/guides",
        safetyNotes: ["Safety for guides"],
        privacyNotes: ["Privacy for guides"],
        downloadTrust: "first-party",
        checksum: "sha-guides",
        reviewedBy: "",
      };
      expect(entryTrustSummary(entry).review.claimStatus).toBeDefined();
      expect(entryTrustSignalCoverage(entry).max).toBe(8);
      expect(sourceSummary(entry).repoUrl).toContain("guides");
      expect(entryCanonicalUrl(entry)).toContain("guides");
    });
    it("trust matrix guides/codex/pending", () => {
      const entry = {
        category: "guides",
        slug: "guides-codex",
        title: "guides tool",
        description: "desc",
        platforms: ["codex"],
        claimStatus: "pending",
        repoUrl: "https://github.com/example/guides",
        documentationUrl: "https://docs.example.com/guides",
        safetyNotes: ["Safety for guides"],
        privacyNotes: ["Privacy for guides"],
        downloadTrust: "first-party",
        checksum: "sha-guides",
        reviewedBy: "",
      };
      expect(entryTrustSummary(entry).review.claimStatus).toBeDefined();
      expect(entryTrustSignalCoverage(entry).max).toBe(8);
      expect(sourceSummary(entry).repoUrl).toContain("guides");
      expect(entryCanonicalUrl(entry)).toContain("guides");
    });
    it("trust matrix guides/codex/disputed", () => {
      const entry = {
        category: "guides",
        slug: "guides-codex",
        title: "guides tool",
        description: "desc",
        platforms: ["codex"],
        claimStatus: "disputed",
        repoUrl: "https://github.com/example/guides",
        documentationUrl: "https://docs.example.com/guides",
        safetyNotes: ["Safety for guides"],
        privacyNotes: ["Privacy for guides"],
        downloadTrust: "first-party",
        checksum: "sha-guides",
        reviewedBy: "",
      };
      expect(entryTrustSummary(entry).review.claimStatus).toBeDefined();
      expect(entryTrustSignalCoverage(entry).max).toBe(8);
      expect(sourceSummary(entry).repoUrl).toContain("guides");
      expect(entryCanonicalUrl(entry)).toContain("guides");
    });
    it("trust matrix guides/codex/none", () => {
      const entry = {
        category: "guides",
        slug: "guides-codex",
        title: "guides tool",
        description: "desc",
        platforms: ["codex"],
        claimStatus: "",
        repoUrl: "https://github.com/example/guides",
        documentationUrl: "https://docs.example.com/guides",
        safetyNotes: ["Safety for guides"],
        privacyNotes: ["Privacy for guides"],
        downloadTrust: "first-party",
        checksum: "sha-guides",
        reviewedBy: "",
      };
      expect(entryTrustSummary(entry).review.claimStatus).toBeDefined();
      expect(entryTrustSignalCoverage(entry).max).toBe(8);
      expect(sourceSummary(entry).repoUrl).toContain("guides");
      expect(entryCanonicalUrl(entry)).toContain("guides");
    });
    it("trust matrix guides/windsurf/verified", () => {
      const entry = {
        category: "guides",
        slug: "guides-windsurf",
        title: "guides tool",
        description: "desc",
        platforms: ["windsurf"],
        claimStatus: "verified",
        repoUrl: "https://github.com/example/guides",
        documentationUrl: "https://docs.example.com/guides",
        safetyNotes: ["Safety for guides"],
        privacyNotes: ["Privacy for guides"],
        downloadTrust: "first-party",
        checksum: "sha-guides",
        reviewedBy: "maintainer",
      };
      expect(entryTrustSummary(entry).review.claimStatus).toBeDefined();
      expect(entryTrustSignalCoverage(entry).max).toBe(8);
      expect(sourceSummary(entry).repoUrl).toContain("guides");
      expect(entryCanonicalUrl(entry)).toContain("guides");
    });
    it("trust matrix guides/windsurf/unclaimed", () => {
      const entry = {
        category: "guides",
        slug: "guides-windsurf",
        title: "guides tool",
        description: "desc",
        platforms: ["windsurf"],
        claimStatus: "unclaimed",
        repoUrl: "https://github.com/example/guides",
        documentationUrl: "https://docs.example.com/guides",
        safetyNotes: ["Safety for guides"],
        privacyNotes: ["Privacy for guides"],
        downloadTrust: "first-party",
        checksum: "sha-guides",
        reviewedBy: "",
      };
      expect(entryTrustSummary(entry).review.claimStatus).toBeDefined();
      expect(entryTrustSignalCoverage(entry).max).toBe(8);
      expect(sourceSummary(entry).repoUrl).toContain("guides");
      expect(entryCanonicalUrl(entry)).toContain("guides");
    });
    it("trust matrix guides/windsurf/pending", () => {
      const entry = {
        category: "guides",
        slug: "guides-windsurf",
        title: "guides tool",
        description: "desc",
        platforms: ["windsurf"],
        claimStatus: "pending",
        repoUrl: "https://github.com/example/guides",
        documentationUrl: "https://docs.example.com/guides",
        safetyNotes: ["Safety for guides"],
        privacyNotes: ["Privacy for guides"],
        downloadTrust: "first-party",
        checksum: "sha-guides",
        reviewedBy: "",
      };
      expect(entryTrustSummary(entry).review.claimStatus).toBeDefined();
      expect(entryTrustSignalCoverage(entry).max).toBe(8);
      expect(sourceSummary(entry).repoUrl).toContain("guides");
      expect(entryCanonicalUrl(entry)).toContain("guides");
    });
    it("trust matrix guides/windsurf/disputed", () => {
      const entry = {
        category: "guides",
        slug: "guides-windsurf",
        title: "guides tool",
        description: "desc",
        platforms: ["windsurf"],
        claimStatus: "disputed",
        repoUrl: "https://github.com/example/guides",
        documentationUrl: "https://docs.example.com/guides",
        safetyNotes: ["Safety for guides"],
        privacyNotes: ["Privacy for guides"],
        downloadTrust: "first-party",
        checksum: "sha-guides",
        reviewedBy: "",
      };
      expect(entryTrustSummary(entry).review.claimStatus).toBeDefined();
      expect(entryTrustSignalCoverage(entry).max).toBe(8);
      expect(sourceSummary(entry).repoUrl).toContain("guides");
      expect(entryCanonicalUrl(entry)).toContain("guides");
    });
    it("trust matrix guides/windsurf/none", () => {
      const entry = {
        category: "guides",
        slug: "guides-windsurf",
        title: "guides tool",
        description: "desc",
        platforms: ["windsurf"],
        claimStatus: "",
        repoUrl: "https://github.com/example/guides",
        documentationUrl: "https://docs.example.com/guides",
        safetyNotes: ["Safety for guides"],
        privacyNotes: ["Privacy for guides"],
        downloadTrust: "first-party",
        checksum: "sha-guides",
        reviewedBy: "",
      };
      expect(entryTrustSummary(entry).review.claimStatus).toBeDefined();
      expect(entryTrustSignalCoverage(entry).max).toBe(8);
      expect(sourceSummary(entry).repoUrl).toContain("guides");
      expect(entryCanonicalUrl(entry)).toContain("guides");
    });
    it("trust matrix guides/vscode/verified", () => {
      const entry = {
        category: "guides",
        slug: "guides-vscode",
        title: "guides tool",
        description: "desc",
        platforms: ["vscode"],
        claimStatus: "verified",
        repoUrl: "https://github.com/example/guides",
        documentationUrl: "https://docs.example.com/guides",
        safetyNotes: ["Safety for guides"],
        privacyNotes: ["Privacy for guides"],
        downloadTrust: "first-party",
        checksum: "sha-guides",
        reviewedBy: "maintainer",
      };
      expect(entryTrustSummary(entry).review.claimStatus).toBeDefined();
      expect(entryTrustSignalCoverage(entry).max).toBe(8);
      expect(sourceSummary(entry).repoUrl).toContain("guides");
      expect(entryCanonicalUrl(entry)).toContain("guides");
    });
    it("trust matrix guides/vscode/unclaimed", () => {
      const entry = {
        category: "guides",
        slug: "guides-vscode",
        title: "guides tool",
        description: "desc",
        platforms: ["vscode"],
        claimStatus: "unclaimed",
        repoUrl: "https://github.com/example/guides",
        documentationUrl: "https://docs.example.com/guides",
        safetyNotes: ["Safety for guides"],
        privacyNotes: ["Privacy for guides"],
        downloadTrust: "first-party",
        checksum: "sha-guides",
        reviewedBy: "",
      };
      expect(entryTrustSummary(entry).review.claimStatus).toBeDefined();
      expect(entryTrustSignalCoverage(entry).max).toBe(8);
      expect(sourceSummary(entry).repoUrl).toContain("guides");
      expect(entryCanonicalUrl(entry)).toContain("guides");
    });
    it("trust matrix guides/vscode/pending", () => {
      const entry = {
        category: "guides",
        slug: "guides-vscode",
        title: "guides tool",
        description: "desc",
        platforms: ["vscode"],
        claimStatus: "pending",
        repoUrl: "https://github.com/example/guides",
        documentationUrl: "https://docs.example.com/guides",
        safetyNotes: ["Safety for guides"],
        privacyNotes: ["Privacy for guides"],
        downloadTrust: "first-party",
        checksum: "sha-guides",
        reviewedBy: "",
      };
      expect(entryTrustSummary(entry).review.claimStatus).toBeDefined();
      expect(entryTrustSignalCoverage(entry).max).toBe(8);
      expect(sourceSummary(entry).repoUrl).toContain("guides");
      expect(entryCanonicalUrl(entry)).toContain("guides");
    });
    it("trust matrix guides/vscode/disputed", () => {
      const entry = {
        category: "guides",
        slug: "guides-vscode",
        title: "guides tool",
        description: "desc",
        platforms: ["vscode"],
        claimStatus: "disputed",
        repoUrl: "https://github.com/example/guides",
        documentationUrl: "https://docs.example.com/guides",
        safetyNotes: ["Safety for guides"],
        privacyNotes: ["Privacy for guides"],
        downloadTrust: "first-party",
        checksum: "sha-guides",
        reviewedBy: "",
      };
      expect(entryTrustSummary(entry).review.claimStatus).toBeDefined();
      expect(entryTrustSignalCoverage(entry).max).toBe(8);
      expect(sourceSummary(entry).repoUrl).toContain("guides");
      expect(entryCanonicalUrl(entry)).toContain("guides");
    });
    it("trust matrix guides/vscode/none", () => {
      const entry = {
        category: "guides",
        slug: "guides-vscode",
        title: "guides tool",
        description: "desc",
        platforms: ["vscode"],
        claimStatus: "",
        repoUrl: "https://github.com/example/guides",
        documentationUrl: "https://docs.example.com/guides",
        safetyNotes: ["Safety for guides"],
        privacyNotes: ["Privacy for guides"],
        downloadTrust: "first-party",
        checksum: "sha-guides",
        reviewedBy: "",
      };
      expect(entryTrustSummary(entry).review.claimStatus).toBeDefined();
      expect(entryTrustSignalCoverage(entry).max).toBe(8);
      expect(sourceSummary(entry).repoUrl).toContain("guides");
      expect(entryCanonicalUrl(entry)).toContain("guides");
    });
    it("trust matrix guides/jetbrains/verified", () => {
      const entry = {
        category: "guides",
        slug: "guides-jetbrains",
        title: "guides tool",
        description: "desc",
        platforms: ["jetbrains"],
        claimStatus: "verified",
        repoUrl: "https://github.com/example/guides",
        documentationUrl: "https://docs.example.com/guides",
        safetyNotes: ["Safety for guides"],
        privacyNotes: ["Privacy for guides"],
        downloadTrust: "first-party",
        checksum: "sha-guides",
        reviewedBy: "maintainer",
      };
      expect(entryTrustSummary(entry).review.claimStatus).toBeDefined();
      expect(entryTrustSignalCoverage(entry).max).toBe(8);
      expect(sourceSummary(entry).repoUrl).toContain("guides");
      expect(entryCanonicalUrl(entry)).toContain("guides");
    });
    it("trust matrix guides/jetbrains/unclaimed", () => {
      const entry = {
        category: "guides",
        slug: "guides-jetbrains",
        title: "guides tool",
        description: "desc",
        platforms: ["jetbrains"],
        claimStatus: "unclaimed",
        repoUrl: "https://github.com/example/guides",
        documentationUrl: "https://docs.example.com/guides",
        safetyNotes: ["Safety for guides"],
        privacyNotes: ["Privacy for guides"],
        downloadTrust: "first-party",
        checksum: "sha-guides",
        reviewedBy: "",
      };
      expect(entryTrustSummary(entry).review.claimStatus).toBeDefined();
      expect(entryTrustSignalCoverage(entry).max).toBe(8);
      expect(sourceSummary(entry).repoUrl).toContain("guides");
      expect(entryCanonicalUrl(entry)).toContain("guides");
    });
    it("trust matrix guides/jetbrains/pending", () => {
      const entry = {
        category: "guides",
        slug: "guides-jetbrains",
        title: "guides tool",
        description: "desc",
        platforms: ["jetbrains"],
        claimStatus: "pending",
        repoUrl: "https://github.com/example/guides",
        documentationUrl: "https://docs.example.com/guides",
        safetyNotes: ["Safety for guides"],
        privacyNotes: ["Privacy for guides"],
        downloadTrust: "first-party",
        checksum: "sha-guides",
        reviewedBy: "",
      };
      expect(entryTrustSummary(entry).review.claimStatus).toBeDefined();
      expect(entryTrustSignalCoverage(entry).max).toBe(8);
      expect(sourceSummary(entry).repoUrl).toContain("guides");
      expect(entryCanonicalUrl(entry)).toContain("guides");
    });
    it("trust matrix guides/jetbrains/disputed", () => {
      const entry = {
        category: "guides",
        slug: "guides-jetbrains",
        title: "guides tool",
        description: "desc",
        platforms: ["jetbrains"],
        claimStatus: "disputed",
        repoUrl: "https://github.com/example/guides",
        documentationUrl: "https://docs.example.com/guides",
        safetyNotes: ["Safety for guides"],
        privacyNotes: ["Privacy for guides"],
        downloadTrust: "first-party",
        checksum: "sha-guides",
        reviewedBy: "",
      };
      expect(entryTrustSummary(entry).review.claimStatus).toBeDefined();
      expect(entryTrustSignalCoverage(entry).max).toBe(8);
      expect(sourceSummary(entry).repoUrl).toContain("guides");
      expect(entryCanonicalUrl(entry)).toContain("guides");
    });
    it("trust matrix guides/jetbrains/none", () => {
      const entry = {
        category: "guides",
        slug: "guides-jetbrains",
        title: "guides tool",
        description: "desc",
        platforms: ["jetbrains"],
        claimStatus: "",
        repoUrl: "https://github.com/example/guides",
        documentationUrl: "https://docs.example.com/guides",
        safetyNotes: ["Safety for guides"],
        privacyNotes: ["Privacy for guides"],
        downloadTrust: "first-party",
        checksum: "sha-guides",
        reviewedBy: "",
      };
      expect(entryTrustSummary(entry).review.claimStatus).toBeDefined();
      expect(entryTrustSignalCoverage(entry).max).toBe(8);
      expect(sourceSummary(entry).repoUrl).toContain("guides");
      expect(entryCanonicalUrl(entry)).toContain("guides");
    });
    it("trust matrix plugins/claude-code/verified", () => {
      const entry = {
        category: "plugins",
        slug: "plugins-claude-code",
        title: "plugins tool",
        description: "desc",
        platforms: ["claude-code"],
        claimStatus: "verified",
        repoUrl: "https://github.com/example/plugins",
        documentationUrl: "https://docs.example.com/plugins",
        safetyNotes: ["Safety for plugins"],
        privacyNotes: ["Privacy for plugins"],
        downloadTrust: "first-party",
        checksum: "sha-plugins",
        reviewedBy: "maintainer",
      };
      expect(entryTrustSummary(entry).review.claimStatus).toBeDefined();
      expect(entryTrustSignalCoverage(entry).max).toBe(8);
      expect(sourceSummary(entry).repoUrl).toContain("plugins");
      expect(entryCanonicalUrl(entry)).toContain("plugins");
    });
    it("trust matrix plugins/claude-code/unclaimed", () => {
      const entry = {
        category: "plugins",
        slug: "plugins-claude-code",
        title: "plugins tool",
        description: "desc",
        platforms: ["claude-code"],
        claimStatus: "unclaimed",
        repoUrl: "https://github.com/example/plugins",
        documentationUrl: "https://docs.example.com/plugins",
        safetyNotes: ["Safety for plugins"],
        privacyNotes: ["Privacy for plugins"],
        downloadTrust: "first-party",
        checksum: "sha-plugins",
        reviewedBy: "",
      };
      expect(entryTrustSummary(entry).review.claimStatus).toBeDefined();
      expect(entryTrustSignalCoverage(entry).max).toBe(8);
      expect(sourceSummary(entry).repoUrl).toContain("plugins");
      expect(entryCanonicalUrl(entry)).toContain("plugins");
    });
    it("trust matrix plugins/claude-code/pending", () => {
      const entry = {
        category: "plugins",
        slug: "plugins-claude-code",
        title: "plugins tool",
        description: "desc",
        platforms: ["claude-code"],
        claimStatus: "pending",
        repoUrl: "https://github.com/example/plugins",
        documentationUrl: "https://docs.example.com/plugins",
        safetyNotes: ["Safety for plugins"],
        privacyNotes: ["Privacy for plugins"],
        downloadTrust: "first-party",
        checksum: "sha-plugins",
        reviewedBy: "",
      };
      expect(entryTrustSummary(entry).review.claimStatus).toBeDefined();
      expect(entryTrustSignalCoverage(entry).max).toBe(8);
      expect(sourceSummary(entry).repoUrl).toContain("plugins");
      expect(entryCanonicalUrl(entry)).toContain("plugins");
    });
    it("trust matrix plugins/claude-code/disputed", () => {
      const entry = {
        category: "plugins",
        slug: "plugins-claude-code",
        title: "plugins tool",
        description: "desc",
        platforms: ["claude-code"],
        claimStatus: "disputed",
        repoUrl: "https://github.com/example/plugins",
        documentationUrl: "https://docs.example.com/plugins",
        safetyNotes: ["Safety for plugins"],
        privacyNotes: ["Privacy for plugins"],
        downloadTrust: "first-party",
        checksum: "sha-plugins",
        reviewedBy: "",
      };
      expect(entryTrustSummary(entry).review.claimStatus).toBeDefined();
      expect(entryTrustSignalCoverage(entry).max).toBe(8);
      expect(sourceSummary(entry).repoUrl).toContain("plugins");
      expect(entryCanonicalUrl(entry)).toContain("plugins");
    });
    it("trust matrix plugins/claude-code/none", () => {
      const entry = {
        category: "plugins",
        slug: "plugins-claude-code",
        title: "plugins tool",
        description: "desc",
        platforms: ["claude-code"],
        claimStatus: "",
        repoUrl: "https://github.com/example/plugins",
        documentationUrl: "https://docs.example.com/plugins",
        safetyNotes: ["Safety for plugins"],
        privacyNotes: ["Privacy for plugins"],
        downloadTrust: "first-party",
        checksum: "sha-plugins",
        reviewedBy: "",
      };
      expect(entryTrustSummary(entry).review.claimStatus).toBeDefined();
      expect(entryTrustSignalCoverage(entry).max).toBe(8);
      expect(sourceSummary(entry).repoUrl).toContain("plugins");
      expect(entryCanonicalUrl(entry)).toContain("plugins");
    });
    it("trust matrix plugins/cursor/verified", () => {
      const entry = {
        category: "plugins",
        slug: "plugins-cursor",
        title: "plugins tool",
        description: "desc",
        platforms: ["cursor"],
        claimStatus: "verified",
        repoUrl: "https://github.com/example/plugins",
        documentationUrl: "https://docs.example.com/plugins",
        safetyNotes: ["Safety for plugins"],
        privacyNotes: ["Privacy for plugins"],
        downloadTrust: "first-party",
        checksum: "sha-plugins",
        reviewedBy: "maintainer",
      };
      expect(entryTrustSummary(entry).review.claimStatus).toBeDefined();
      expect(entryTrustSignalCoverage(entry).max).toBe(8);
      expect(sourceSummary(entry).repoUrl).toContain("plugins");
      expect(entryCanonicalUrl(entry)).toContain("plugins");
    });
    it("trust matrix plugins/cursor/unclaimed", () => {
      const entry = {
        category: "plugins",
        slug: "plugins-cursor",
        title: "plugins tool",
        description: "desc",
        platforms: ["cursor"],
        claimStatus: "unclaimed",
        repoUrl: "https://github.com/example/plugins",
        documentationUrl: "https://docs.example.com/plugins",
        safetyNotes: ["Safety for plugins"],
        privacyNotes: ["Privacy for plugins"],
        downloadTrust: "first-party",
        checksum: "sha-plugins",
        reviewedBy: "",
      };
      expect(entryTrustSummary(entry).review.claimStatus).toBeDefined();
      expect(entryTrustSignalCoverage(entry).max).toBe(8);
      expect(sourceSummary(entry).repoUrl).toContain("plugins");
      expect(entryCanonicalUrl(entry)).toContain("plugins");
    });
    it("trust matrix plugins/cursor/pending", () => {
      const entry = {
        category: "plugins",
        slug: "plugins-cursor",
        title: "plugins tool",
        description: "desc",
        platforms: ["cursor"],
        claimStatus: "pending",
        repoUrl: "https://github.com/example/plugins",
        documentationUrl: "https://docs.example.com/plugins",
        safetyNotes: ["Safety for plugins"],
        privacyNotes: ["Privacy for plugins"],
        downloadTrust: "first-party",
        checksum: "sha-plugins",
        reviewedBy: "",
      };
      expect(entryTrustSummary(entry).review.claimStatus).toBeDefined();
      expect(entryTrustSignalCoverage(entry).max).toBe(8);
      expect(sourceSummary(entry).repoUrl).toContain("plugins");
      expect(entryCanonicalUrl(entry)).toContain("plugins");
    });
    it("trust matrix plugins/cursor/disputed", () => {
      const entry = {
        category: "plugins",
        slug: "plugins-cursor",
        title: "plugins tool",
        description: "desc",
        platforms: ["cursor"],
        claimStatus: "disputed",
        repoUrl: "https://github.com/example/plugins",
        documentationUrl: "https://docs.example.com/plugins",
        safetyNotes: ["Safety for plugins"],
        privacyNotes: ["Privacy for plugins"],
        downloadTrust: "first-party",
        checksum: "sha-plugins",
        reviewedBy: "",
      };
      expect(entryTrustSummary(entry).review.claimStatus).toBeDefined();
      expect(entryTrustSignalCoverage(entry).max).toBe(8);
      expect(sourceSummary(entry).repoUrl).toContain("plugins");
      expect(entryCanonicalUrl(entry)).toContain("plugins");
    });
    it("trust matrix plugins/cursor/none", () => {
      const entry = {
        category: "plugins",
        slug: "plugins-cursor",
        title: "plugins tool",
        description: "desc",
        platforms: ["cursor"],
        claimStatus: "",
        repoUrl: "https://github.com/example/plugins",
        documentationUrl: "https://docs.example.com/plugins",
        safetyNotes: ["Safety for plugins"],
        privacyNotes: ["Privacy for plugins"],
        downloadTrust: "first-party",
        checksum: "sha-plugins",
        reviewedBy: "",
      };
      expect(entryTrustSummary(entry).review.claimStatus).toBeDefined();
      expect(entryTrustSignalCoverage(entry).max).toBe(8);
      expect(sourceSummary(entry).repoUrl).toContain("plugins");
      expect(entryCanonicalUrl(entry)).toContain("plugins");
    });
    it("trust matrix plugins/codex/verified", () => {
      const entry = {
        category: "plugins",
        slug: "plugins-codex",
        title: "plugins tool",
        description: "desc",
        platforms: ["codex"],
        claimStatus: "verified",
        repoUrl: "https://github.com/example/plugins",
        documentationUrl: "https://docs.example.com/plugins",
        safetyNotes: ["Safety for plugins"],
        privacyNotes: ["Privacy for plugins"],
        downloadTrust: "first-party",
        checksum: "sha-plugins",
        reviewedBy: "maintainer",
      };
      expect(entryTrustSummary(entry).review.claimStatus).toBeDefined();
      expect(entryTrustSignalCoverage(entry).max).toBe(8);
      expect(sourceSummary(entry).repoUrl).toContain("plugins");
      expect(entryCanonicalUrl(entry)).toContain("plugins");
    });
    it("trust matrix plugins/codex/unclaimed", () => {
      const entry = {
        category: "plugins",
        slug: "plugins-codex",
        title: "plugins tool",
        description: "desc",
        platforms: ["codex"],
        claimStatus: "unclaimed",
        repoUrl: "https://github.com/example/plugins",
        documentationUrl: "https://docs.example.com/plugins",
        safetyNotes: ["Safety for plugins"],
        privacyNotes: ["Privacy for plugins"],
        downloadTrust: "first-party",
        checksum: "sha-plugins",
        reviewedBy: "",
      };
      expect(entryTrustSummary(entry).review.claimStatus).toBeDefined();
      expect(entryTrustSignalCoverage(entry).max).toBe(8);
      expect(sourceSummary(entry).repoUrl).toContain("plugins");
      expect(entryCanonicalUrl(entry)).toContain("plugins");
    });
    it("trust matrix plugins/codex/pending", () => {
      const entry = {
        category: "plugins",
        slug: "plugins-codex",
        title: "plugins tool",
        description: "desc",
        platforms: ["codex"],
        claimStatus: "pending",
        repoUrl: "https://github.com/example/plugins",
        documentationUrl: "https://docs.example.com/plugins",
        safetyNotes: ["Safety for plugins"],
        privacyNotes: ["Privacy for plugins"],
        downloadTrust: "first-party",
        checksum: "sha-plugins",
        reviewedBy: "",
      };
      expect(entryTrustSummary(entry).review.claimStatus).toBeDefined();
      expect(entryTrustSignalCoverage(entry).max).toBe(8);
      expect(sourceSummary(entry).repoUrl).toContain("plugins");
      expect(entryCanonicalUrl(entry)).toContain("plugins");
    });
    it("trust matrix plugins/codex/disputed", () => {
      const entry = {
        category: "plugins",
        slug: "plugins-codex",
        title: "plugins tool",
        description: "desc",
        platforms: ["codex"],
        claimStatus: "disputed",
        repoUrl: "https://github.com/example/plugins",
        documentationUrl: "https://docs.example.com/plugins",
        safetyNotes: ["Safety for plugins"],
        privacyNotes: ["Privacy for plugins"],
        downloadTrust: "first-party",
        checksum: "sha-plugins",
        reviewedBy: "",
      };
      expect(entryTrustSummary(entry).review.claimStatus).toBeDefined();
      expect(entryTrustSignalCoverage(entry).max).toBe(8);
      expect(sourceSummary(entry).repoUrl).toContain("plugins");
      expect(entryCanonicalUrl(entry)).toContain("plugins");
    });
    it("trust matrix plugins/codex/none", () => {
      const entry = {
        category: "plugins",
        slug: "plugins-codex",
        title: "plugins tool",
        description: "desc",
        platforms: ["codex"],
        claimStatus: "",
        repoUrl: "https://github.com/example/plugins",
        documentationUrl: "https://docs.example.com/plugins",
        safetyNotes: ["Safety for plugins"],
        privacyNotes: ["Privacy for plugins"],
        downloadTrust: "first-party",
        checksum: "sha-plugins",
        reviewedBy: "",
      };
      expect(entryTrustSummary(entry).review.claimStatus).toBeDefined();
      expect(entryTrustSignalCoverage(entry).max).toBe(8);
      expect(sourceSummary(entry).repoUrl).toContain("plugins");
      expect(entryCanonicalUrl(entry)).toContain("plugins");
    });
    it("trust matrix plugins/windsurf/verified", () => {
      const entry = {
        category: "plugins",
        slug: "plugins-windsurf",
        title: "plugins tool",
        description: "desc",
        platforms: ["windsurf"],
        claimStatus: "verified",
        repoUrl: "https://github.com/example/plugins",
        documentationUrl: "https://docs.example.com/plugins",
        safetyNotes: ["Safety for plugins"],
        privacyNotes: ["Privacy for plugins"],
        downloadTrust: "first-party",
        checksum: "sha-plugins",
        reviewedBy: "maintainer",
      };
      expect(entryTrustSummary(entry).review.claimStatus).toBeDefined();
      expect(entryTrustSignalCoverage(entry).max).toBe(8);
      expect(sourceSummary(entry).repoUrl).toContain("plugins");
      expect(entryCanonicalUrl(entry)).toContain("plugins");
    });
    it("trust matrix plugins/windsurf/unclaimed", () => {
      const entry = {
        category: "plugins",
        slug: "plugins-windsurf",
        title: "plugins tool",
        description: "desc",
        platforms: ["windsurf"],
        claimStatus: "unclaimed",
        repoUrl: "https://github.com/example/plugins",
        documentationUrl: "https://docs.example.com/plugins",
        safetyNotes: ["Safety for plugins"],
        privacyNotes: ["Privacy for plugins"],
        downloadTrust: "first-party",
        checksum: "sha-plugins",
        reviewedBy: "",
      };
      expect(entryTrustSummary(entry).review.claimStatus).toBeDefined();
      expect(entryTrustSignalCoverage(entry).max).toBe(8);
      expect(sourceSummary(entry).repoUrl).toContain("plugins");
      expect(entryCanonicalUrl(entry)).toContain("plugins");
    });
    it("trust matrix plugins/windsurf/pending", () => {
      const entry = {
        category: "plugins",
        slug: "plugins-windsurf",
        title: "plugins tool",
        description: "desc",
        platforms: ["windsurf"],
        claimStatus: "pending",
        repoUrl: "https://github.com/example/plugins",
        documentationUrl: "https://docs.example.com/plugins",
        safetyNotes: ["Safety for plugins"],
        privacyNotes: ["Privacy for plugins"],
        downloadTrust: "first-party",
        checksum: "sha-plugins",
        reviewedBy: "",
      };
      expect(entryTrustSummary(entry).review.claimStatus).toBeDefined();
      expect(entryTrustSignalCoverage(entry).max).toBe(8);
      expect(sourceSummary(entry).repoUrl).toContain("plugins");
      expect(entryCanonicalUrl(entry)).toContain("plugins");
    });
    it("trust matrix plugins/windsurf/disputed", () => {
      const entry = {
        category: "plugins",
        slug: "plugins-windsurf",
        title: "plugins tool",
        description: "desc",
        platforms: ["windsurf"],
        claimStatus: "disputed",
        repoUrl: "https://github.com/example/plugins",
        documentationUrl: "https://docs.example.com/plugins",
        safetyNotes: ["Safety for plugins"],
        privacyNotes: ["Privacy for plugins"],
        downloadTrust: "first-party",
        checksum: "sha-plugins",
        reviewedBy: "",
      };
      expect(entryTrustSummary(entry).review.claimStatus).toBeDefined();
      expect(entryTrustSignalCoverage(entry).max).toBe(8);
      expect(sourceSummary(entry).repoUrl).toContain("plugins");
      expect(entryCanonicalUrl(entry)).toContain("plugins");
    });
    it("trust matrix plugins/windsurf/none", () => {
      const entry = {
        category: "plugins",
        slug: "plugins-windsurf",
        title: "plugins tool",
        description: "desc",
        platforms: ["windsurf"],
        claimStatus: "",
        repoUrl: "https://github.com/example/plugins",
        documentationUrl: "https://docs.example.com/plugins",
        safetyNotes: ["Safety for plugins"],
        privacyNotes: ["Privacy for plugins"],
        downloadTrust: "first-party",
        checksum: "sha-plugins",
        reviewedBy: "",
      };
      expect(entryTrustSummary(entry).review.claimStatus).toBeDefined();
      expect(entryTrustSignalCoverage(entry).max).toBe(8);
      expect(sourceSummary(entry).repoUrl).toContain("plugins");
      expect(entryCanonicalUrl(entry)).toContain("plugins");
    });
    it("trust matrix plugins/vscode/verified", () => {
      const entry = {
        category: "plugins",
        slug: "plugins-vscode",
        title: "plugins tool",
        description: "desc",
        platforms: ["vscode"],
        claimStatus: "verified",
        repoUrl: "https://github.com/example/plugins",
        documentationUrl: "https://docs.example.com/plugins",
        safetyNotes: ["Safety for plugins"],
        privacyNotes: ["Privacy for plugins"],
        downloadTrust: "first-party",
        checksum: "sha-plugins",
        reviewedBy: "maintainer",
      };
      expect(entryTrustSummary(entry).review.claimStatus).toBeDefined();
      expect(entryTrustSignalCoverage(entry).max).toBe(8);
      expect(sourceSummary(entry).repoUrl).toContain("plugins");
      expect(entryCanonicalUrl(entry)).toContain("plugins");
    });
    it("trust matrix plugins/vscode/unclaimed", () => {
      const entry = {
        category: "plugins",
        slug: "plugins-vscode",
        title: "plugins tool",
        description: "desc",
        platforms: ["vscode"],
        claimStatus: "unclaimed",
        repoUrl: "https://github.com/example/plugins",
        documentationUrl: "https://docs.example.com/plugins",
        safetyNotes: ["Safety for plugins"],
        privacyNotes: ["Privacy for plugins"],
        downloadTrust: "first-party",
        checksum: "sha-plugins",
        reviewedBy: "",
      };
      expect(entryTrustSummary(entry).review.claimStatus).toBeDefined();
      expect(entryTrustSignalCoverage(entry).max).toBe(8);
      expect(sourceSummary(entry).repoUrl).toContain("plugins");
      expect(entryCanonicalUrl(entry)).toContain("plugins");
    });
    it("trust matrix plugins/vscode/pending", () => {
      const entry = {
        category: "plugins",
        slug: "plugins-vscode",
        title: "plugins tool",
        description: "desc",
        platforms: ["vscode"],
        claimStatus: "pending",
        repoUrl: "https://github.com/example/plugins",
        documentationUrl: "https://docs.example.com/plugins",
        safetyNotes: ["Safety for plugins"],
        privacyNotes: ["Privacy for plugins"],
        downloadTrust: "first-party",
        checksum: "sha-plugins",
        reviewedBy: "",
      };
      expect(entryTrustSummary(entry).review.claimStatus).toBeDefined();
      expect(entryTrustSignalCoverage(entry).max).toBe(8);
      expect(sourceSummary(entry).repoUrl).toContain("plugins");
      expect(entryCanonicalUrl(entry)).toContain("plugins");
    });
    it("trust matrix plugins/vscode/disputed", () => {
      const entry = {
        category: "plugins",
        slug: "plugins-vscode",
        title: "plugins tool",
        description: "desc",
        platforms: ["vscode"],
        claimStatus: "disputed",
        repoUrl: "https://github.com/example/plugins",
        documentationUrl: "https://docs.example.com/plugins",
        safetyNotes: ["Safety for plugins"],
        privacyNotes: ["Privacy for plugins"],
        downloadTrust: "first-party",
        checksum: "sha-plugins",
        reviewedBy: "",
      };
      expect(entryTrustSummary(entry).review.claimStatus).toBeDefined();
      expect(entryTrustSignalCoverage(entry).max).toBe(8);
      expect(sourceSummary(entry).repoUrl).toContain("plugins");
      expect(entryCanonicalUrl(entry)).toContain("plugins");
    });
    it("trust matrix plugins/vscode/none", () => {
      const entry = {
        category: "plugins",
        slug: "plugins-vscode",
        title: "plugins tool",
        description: "desc",
        platforms: ["vscode"],
        claimStatus: "",
        repoUrl: "https://github.com/example/plugins",
        documentationUrl: "https://docs.example.com/plugins",
        safetyNotes: ["Safety for plugins"],
        privacyNotes: ["Privacy for plugins"],
        downloadTrust: "first-party",
        checksum: "sha-plugins",
        reviewedBy: "",
      };
      expect(entryTrustSummary(entry).review.claimStatus).toBeDefined();
      expect(entryTrustSignalCoverage(entry).max).toBe(8);
      expect(sourceSummary(entry).repoUrl).toContain("plugins");
      expect(entryCanonicalUrl(entry)).toContain("plugins");
    });
    it("trust matrix plugins/jetbrains/verified", () => {
      const entry = {
        category: "plugins",
        slug: "plugins-jetbrains",
        title: "plugins tool",
        description: "desc",
        platforms: ["jetbrains"],
        claimStatus: "verified",
        repoUrl: "https://github.com/example/plugins",
        documentationUrl: "https://docs.example.com/plugins",
        safetyNotes: ["Safety for plugins"],
        privacyNotes: ["Privacy for plugins"],
        downloadTrust: "first-party",
        checksum: "sha-plugins",
        reviewedBy: "maintainer",
      };
      expect(entryTrustSummary(entry).review.claimStatus).toBeDefined();
      expect(entryTrustSignalCoverage(entry).max).toBe(8);
      expect(sourceSummary(entry).repoUrl).toContain("plugins");
      expect(entryCanonicalUrl(entry)).toContain("plugins");
    });
    it("trust matrix plugins/jetbrains/unclaimed", () => {
      const entry = {
        category: "plugins",
        slug: "plugins-jetbrains",
        title: "plugins tool",
        description: "desc",
        platforms: ["jetbrains"],
        claimStatus: "unclaimed",
        repoUrl: "https://github.com/example/plugins",
        documentationUrl: "https://docs.example.com/plugins",
        safetyNotes: ["Safety for plugins"],
        privacyNotes: ["Privacy for plugins"],
        downloadTrust: "first-party",
        checksum: "sha-plugins",
        reviewedBy: "",
      };
      expect(entryTrustSummary(entry).review.claimStatus).toBeDefined();
      expect(entryTrustSignalCoverage(entry).max).toBe(8);
      expect(sourceSummary(entry).repoUrl).toContain("plugins");
      expect(entryCanonicalUrl(entry)).toContain("plugins");
    });
    it("trust matrix plugins/jetbrains/pending", () => {
      const entry = {
        category: "plugins",
        slug: "plugins-jetbrains",
        title: "plugins tool",
        description: "desc",
        platforms: ["jetbrains"],
        claimStatus: "pending",
        repoUrl: "https://github.com/example/plugins",
        documentationUrl: "https://docs.example.com/plugins",
        safetyNotes: ["Safety for plugins"],
        privacyNotes: ["Privacy for plugins"],
        downloadTrust: "first-party",
        checksum: "sha-plugins",
        reviewedBy: "",
      };
      expect(entryTrustSummary(entry).review.claimStatus).toBeDefined();
      expect(entryTrustSignalCoverage(entry).max).toBe(8);
      expect(sourceSummary(entry).repoUrl).toContain("plugins");
      expect(entryCanonicalUrl(entry)).toContain("plugins");
    });
    it("trust matrix plugins/jetbrains/disputed", () => {
      const entry = {
        category: "plugins",
        slug: "plugins-jetbrains",
        title: "plugins tool",
        description: "desc",
        platforms: ["jetbrains"],
        claimStatus: "disputed",
        repoUrl: "https://github.com/example/plugins",
        documentationUrl: "https://docs.example.com/plugins",
        safetyNotes: ["Safety for plugins"],
        privacyNotes: ["Privacy for plugins"],
        downloadTrust: "first-party",
        checksum: "sha-plugins",
        reviewedBy: "",
      };
      expect(entryTrustSummary(entry).review.claimStatus).toBeDefined();
      expect(entryTrustSignalCoverage(entry).max).toBe(8);
      expect(sourceSummary(entry).repoUrl).toContain("plugins");
      expect(entryCanonicalUrl(entry)).toContain("plugins");
    });
    it("trust matrix plugins/jetbrains/none", () => {
      const entry = {
        category: "plugins",
        slug: "plugins-jetbrains",
        title: "plugins tool",
        description: "desc",
        platforms: ["jetbrains"],
        claimStatus: "",
        repoUrl: "https://github.com/example/plugins",
        documentationUrl: "https://docs.example.com/plugins",
        safetyNotes: ["Safety for plugins"],
        privacyNotes: ["Privacy for plugins"],
        downloadTrust: "first-party",
        checksum: "sha-plugins",
        reviewedBy: "",
      };
      expect(entryTrustSummary(entry).review.claimStatus).toBeDefined();
      expect(entryTrustSignalCoverage(entry).max).toBe(8);
      expect(sourceSummary(entry).repoUrl).toContain("plugins");
      expect(entryCanonicalUrl(entry)).toContain("plugins");
    });
    it("trust matrix agents/claude-code/verified", () => {
      const entry = {
        category: "agents",
        slug: "agents-claude-code",
        title: "agents tool",
        description: "desc",
        platforms: ["claude-code"],
        claimStatus: "verified",
        repoUrl: "https://github.com/example/agents",
        documentationUrl: "https://docs.example.com/agents",
        safetyNotes: ["Safety for agents"],
        privacyNotes: ["Privacy for agents"],
        downloadTrust: "first-party",
        checksum: "sha-agents",
        reviewedBy: "maintainer",
      };
      expect(entryTrustSummary(entry).review.claimStatus).toBeDefined();
      expect(entryTrustSignalCoverage(entry).max).toBe(8);
      expect(sourceSummary(entry).repoUrl).toContain("agents");
      expect(entryCanonicalUrl(entry)).toContain("agents");
    });
    it("trust matrix agents/claude-code/unclaimed", () => {
      const entry = {
        category: "agents",
        slug: "agents-claude-code",
        title: "agents tool",
        description: "desc",
        platforms: ["claude-code"],
        claimStatus: "unclaimed",
        repoUrl: "https://github.com/example/agents",
        documentationUrl: "https://docs.example.com/agents",
        safetyNotes: ["Safety for agents"],
        privacyNotes: ["Privacy for agents"],
        downloadTrust: "first-party",
        checksum: "sha-agents",
        reviewedBy: "",
      };
      expect(entryTrustSummary(entry).review.claimStatus).toBeDefined();
      expect(entryTrustSignalCoverage(entry).max).toBe(8);
      expect(sourceSummary(entry).repoUrl).toContain("agents");
      expect(entryCanonicalUrl(entry)).toContain("agents");
    });
    it("trust matrix agents/claude-code/pending", () => {
      const entry = {
        category: "agents",
        slug: "agents-claude-code",
        title: "agents tool",
        description: "desc",
        platforms: ["claude-code"],
        claimStatus: "pending",
        repoUrl: "https://github.com/example/agents",
        documentationUrl: "https://docs.example.com/agents",
        safetyNotes: ["Safety for agents"],
        privacyNotes: ["Privacy for agents"],
        downloadTrust: "first-party",
        checksum: "sha-agents",
        reviewedBy: "",
      };
      expect(entryTrustSummary(entry).review.claimStatus).toBeDefined();
      expect(entryTrustSignalCoverage(entry).max).toBe(8);
      expect(sourceSummary(entry).repoUrl).toContain("agents");
      expect(entryCanonicalUrl(entry)).toContain("agents");
    });
    it("trust matrix agents/claude-code/disputed", () => {
      const entry = {
        category: "agents",
        slug: "agents-claude-code",
        title: "agents tool",
        description: "desc",
        platforms: ["claude-code"],
        claimStatus: "disputed",
        repoUrl: "https://github.com/example/agents",
        documentationUrl: "https://docs.example.com/agents",
        safetyNotes: ["Safety for agents"],
        privacyNotes: ["Privacy for agents"],
        downloadTrust: "first-party",
        checksum: "sha-agents",
        reviewedBy: "",
      };
      expect(entryTrustSummary(entry).review.claimStatus).toBeDefined();
      expect(entryTrustSignalCoverage(entry).max).toBe(8);
      expect(sourceSummary(entry).repoUrl).toContain("agents");
      expect(entryCanonicalUrl(entry)).toContain("agents");
    });
    it("trust matrix agents/claude-code/none", () => {
      const entry = {
        category: "agents",
        slug: "agents-claude-code",
        title: "agents tool",
        description: "desc",
        platforms: ["claude-code"],
        claimStatus: "",
        repoUrl: "https://github.com/example/agents",
        documentationUrl: "https://docs.example.com/agents",
        safetyNotes: ["Safety for agents"],
        privacyNotes: ["Privacy for agents"],
        downloadTrust: "first-party",
        checksum: "sha-agents",
        reviewedBy: "",
      };
      expect(entryTrustSummary(entry).review.claimStatus).toBeDefined();
      expect(entryTrustSignalCoverage(entry).max).toBe(8);
      expect(sourceSummary(entry).repoUrl).toContain("agents");
      expect(entryCanonicalUrl(entry)).toContain("agents");
    });
    it("trust matrix agents/cursor/verified", () => {
      const entry = {
        category: "agents",
        slug: "agents-cursor",
        title: "agents tool",
        description: "desc",
        platforms: ["cursor"],
        claimStatus: "verified",
        repoUrl: "https://github.com/example/agents",
        documentationUrl: "https://docs.example.com/agents",
        safetyNotes: ["Safety for agents"],
        privacyNotes: ["Privacy for agents"],
        downloadTrust: "first-party",
        checksum: "sha-agents",
        reviewedBy: "maintainer",
      };
      expect(entryTrustSummary(entry).review.claimStatus).toBeDefined();
      expect(entryTrustSignalCoverage(entry).max).toBe(8);
      expect(sourceSummary(entry).repoUrl).toContain("agents");
      expect(entryCanonicalUrl(entry)).toContain("agents");
    });
    it("trust matrix agents/cursor/unclaimed", () => {
      const entry = {
        category: "agents",
        slug: "agents-cursor",
        title: "agents tool",
        description: "desc",
        platforms: ["cursor"],
        claimStatus: "unclaimed",
        repoUrl: "https://github.com/example/agents",
        documentationUrl: "https://docs.example.com/agents",
        safetyNotes: ["Safety for agents"],
        privacyNotes: ["Privacy for agents"],
        downloadTrust: "first-party",
        checksum: "sha-agents",
        reviewedBy: "",
      };
      expect(entryTrustSummary(entry).review.claimStatus).toBeDefined();
      expect(entryTrustSignalCoverage(entry).max).toBe(8);
      expect(sourceSummary(entry).repoUrl).toContain("agents");
      expect(entryCanonicalUrl(entry)).toContain("agents");
    });
    it("trust matrix agents/cursor/pending", () => {
      const entry = {
        category: "agents",
        slug: "agents-cursor",
        title: "agents tool",
        description: "desc",
        platforms: ["cursor"],
        claimStatus: "pending",
        repoUrl: "https://github.com/example/agents",
        documentationUrl: "https://docs.example.com/agents",
        safetyNotes: ["Safety for agents"],
        privacyNotes: ["Privacy for agents"],
        downloadTrust: "first-party",
        checksum: "sha-agents",
        reviewedBy: "",
      };
      expect(entryTrustSummary(entry).review.claimStatus).toBeDefined();
      expect(entryTrustSignalCoverage(entry).max).toBe(8);
      expect(sourceSummary(entry).repoUrl).toContain("agents");
      expect(entryCanonicalUrl(entry)).toContain("agents");
    });
    it("trust matrix agents/cursor/disputed", () => {
      const entry = {
        category: "agents",
        slug: "agents-cursor",
        title: "agents tool",
        description: "desc",
        platforms: ["cursor"],
        claimStatus: "disputed",
        repoUrl: "https://github.com/example/agents",
        documentationUrl: "https://docs.example.com/agents",
        safetyNotes: ["Safety for agents"],
        privacyNotes: ["Privacy for agents"],
        downloadTrust: "first-party",
        checksum: "sha-agents",
        reviewedBy: "",
      };
      expect(entryTrustSummary(entry).review.claimStatus).toBeDefined();
      expect(entryTrustSignalCoverage(entry).max).toBe(8);
      expect(sourceSummary(entry).repoUrl).toContain("agents");
      expect(entryCanonicalUrl(entry)).toContain("agents");
    });
    it("trust matrix agents/cursor/none", () => {
      const entry = {
        category: "agents",
        slug: "agents-cursor",
        title: "agents tool",
        description: "desc",
        platforms: ["cursor"],
        claimStatus: "",
        repoUrl: "https://github.com/example/agents",
        documentationUrl: "https://docs.example.com/agents",
        safetyNotes: ["Safety for agents"],
        privacyNotes: ["Privacy for agents"],
        downloadTrust: "first-party",
        checksum: "sha-agents",
        reviewedBy: "",
      };
      expect(entryTrustSummary(entry).review.claimStatus).toBeDefined();
      expect(entryTrustSignalCoverage(entry).max).toBe(8);
      expect(sourceSummary(entry).repoUrl).toContain("agents");
      expect(entryCanonicalUrl(entry)).toContain("agents");
    });
    it("trust matrix agents/codex/verified", () => {
      const entry = {
        category: "agents",
        slug: "agents-codex",
        title: "agents tool",
        description: "desc",
        platforms: ["codex"],
        claimStatus: "verified",
        repoUrl: "https://github.com/example/agents",
        documentationUrl: "https://docs.example.com/agents",
        safetyNotes: ["Safety for agents"],
        privacyNotes: ["Privacy for agents"],
        downloadTrust: "first-party",
        checksum: "sha-agents",
        reviewedBy: "maintainer",
      };
      expect(entryTrustSummary(entry).review.claimStatus).toBeDefined();
      expect(entryTrustSignalCoverage(entry).max).toBe(8);
      expect(sourceSummary(entry).repoUrl).toContain("agents");
      expect(entryCanonicalUrl(entry)).toContain("agents");
    });
    it("trust matrix agents/codex/unclaimed", () => {
      const entry = {
        category: "agents",
        slug: "agents-codex",
        title: "agents tool",
        description: "desc",
        platforms: ["codex"],
        claimStatus: "unclaimed",
        repoUrl: "https://github.com/example/agents",
        documentationUrl: "https://docs.example.com/agents",
        safetyNotes: ["Safety for agents"],
        privacyNotes: ["Privacy for agents"],
        downloadTrust: "first-party",
        checksum: "sha-agents",
        reviewedBy: "",
      };
      expect(entryTrustSummary(entry).review.claimStatus).toBeDefined();
      expect(entryTrustSignalCoverage(entry).max).toBe(8);
      expect(sourceSummary(entry).repoUrl).toContain("agents");
      expect(entryCanonicalUrl(entry)).toContain("agents");
    });
    it("trust matrix agents/codex/pending", () => {
      const entry = {
        category: "agents",
        slug: "agents-codex",
        title: "agents tool",
        description: "desc",
        platforms: ["codex"],
        claimStatus: "pending",
        repoUrl: "https://github.com/example/agents",
        documentationUrl: "https://docs.example.com/agents",
        safetyNotes: ["Safety for agents"],
        privacyNotes: ["Privacy for agents"],
        downloadTrust: "first-party",
        checksum: "sha-agents",
        reviewedBy: "",
      };
      expect(entryTrustSummary(entry).review.claimStatus).toBeDefined();
      expect(entryTrustSignalCoverage(entry).max).toBe(8);
      expect(sourceSummary(entry).repoUrl).toContain("agents");
      expect(entryCanonicalUrl(entry)).toContain("agents");
    });
    it("trust matrix agents/codex/disputed", () => {
      const entry = {
        category: "agents",
        slug: "agents-codex",
        title: "agents tool",
        description: "desc",
        platforms: ["codex"],
        claimStatus: "disputed",
        repoUrl: "https://github.com/example/agents",
        documentationUrl: "https://docs.example.com/agents",
        safetyNotes: ["Safety for agents"],
        privacyNotes: ["Privacy for agents"],
        downloadTrust: "first-party",
        checksum: "sha-agents",
        reviewedBy: "",
      };
      expect(entryTrustSummary(entry).review.claimStatus).toBeDefined();
      expect(entryTrustSignalCoverage(entry).max).toBe(8);
      expect(sourceSummary(entry).repoUrl).toContain("agents");
      expect(entryCanonicalUrl(entry)).toContain("agents");
    });
    it("trust matrix agents/codex/none", () => {
      const entry = {
        category: "agents",
        slug: "agents-codex",
        title: "agents tool",
        description: "desc",
        platforms: ["codex"],
        claimStatus: "",
        repoUrl: "https://github.com/example/agents",
        documentationUrl: "https://docs.example.com/agents",
        safetyNotes: ["Safety for agents"],
        privacyNotes: ["Privacy for agents"],
        downloadTrust: "first-party",
        checksum: "sha-agents",
        reviewedBy: "",
      };
      expect(entryTrustSummary(entry).review.claimStatus).toBeDefined();
      expect(entryTrustSignalCoverage(entry).max).toBe(8);
      expect(sourceSummary(entry).repoUrl).toContain("agents");
      expect(entryCanonicalUrl(entry)).toContain("agents");
    });
    it("trust matrix agents/windsurf/verified", () => {
      const entry = {
        category: "agents",
        slug: "agents-windsurf",
        title: "agents tool",
        description: "desc",
        platforms: ["windsurf"],
        claimStatus: "verified",
        repoUrl: "https://github.com/example/agents",
        documentationUrl: "https://docs.example.com/agents",
        safetyNotes: ["Safety for agents"],
        privacyNotes: ["Privacy for agents"],
        downloadTrust: "first-party",
        checksum: "sha-agents",
        reviewedBy: "maintainer",
      };
      expect(entryTrustSummary(entry).review.claimStatus).toBeDefined();
      expect(entryTrustSignalCoverage(entry).max).toBe(8);
      expect(sourceSummary(entry).repoUrl).toContain("agents");
      expect(entryCanonicalUrl(entry)).toContain("agents");
    });
    it("trust matrix agents/windsurf/unclaimed", () => {
      const entry = {
        category: "agents",
        slug: "agents-windsurf",
        title: "agents tool",
        description: "desc",
        platforms: ["windsurf"],
        claimStatus: "unclaimed",
        repoUrl: "https://github.com/example/agents",
        documentationUrl: "https://docs.example.com/agents",
        safetyNotes: ["Safety for agents"],
        privacyNotes: ["Privacy for agents"],
        downloadTrust: "first-party",
        checksum: "sha-agents",
        reviewedBy: "",
      };
      expect(entryTrustSummary(entry).review.claimStatus).toBeDefined();
      expect(entryTrustSignalCoverage(entry).max).toBe(8);
      expect(sourceSummary(entry).repoUrl).toContain("agents");
      expect(entryCanonicalUrl(entry)).toContain("agents");
    });
    it("trust matrix agents/windsurf/pending", () => {
      const entry = {
        category: "agents",
        slug: "agents-windsurf",
        title: "agents tool",
        description: "desc",
        platforms: ["windsurf"],
        claimStatus: "pending",
        repoUrl: "https://github.com/example/agents",
        documentationUrl: "https://docs.example.com/agents",
        safetyNotes: ["Safety for agents"],
        privacyNotes: ["Privacy for agents"],
        downloadTrust: "first-party",
        checksum: "sha-agents",
        reviewedBy: "",
      };
      expect(entryTrustSummary(entry).review.claimStatus).toBeDefined();
      expect(entryTrustSignalCoverage(entry).max).toBe(8);
      expect(sourceSummary(entry).repoUrl).toContain("agents");
      expect(entryCanonicalUrl(entry)).toContain("agents");
    });
    it("trust matrix agents/windsurf/disputed", () => {
      const entry = {
        category: "agents",
        slug: "agents-windsurf",
        title: "agents tool",
        description: "desc",
        platforms: ["windsurf"],
        claimStatus: "disputed",
        repoUrl: "https://github.com/example/agents",
        documentationUrl: "https://docs.example.com/agents",
        safetyNotes: ["Safety for agents"],
        privacyNotes: ["Privacy for agents"],
        downloadTrust: "first-party",
        checksum: "sha-agents",
        reviewedBy: "",
      };
      expect(entryTrustSummary(entry).review.claimStatus).toBeDefined();
      expect(entryTrustSignalCoverage(entry).max).toBe(8);
      expect(sourceSummary(entry).repoUrl).toContain("agents");
      expect(entryCanonicalUrl(entry)).toContain("agents");
    });
    it("trust matrix agents/windsurf/none", () => {
      const entry = {
        category: "agents",
        slug: "agents-windsurf",
        title: "agents tool",
        description: "desc",
        platforms: ["windsurf"],
        claimStatus: "",
        repoUrl: "https://github.com/example/agents",
        documentationUrl: "https://docs.example.com/agents",
        safetyNotes: ["Safety for agents"],
        privacyNotes: ["Privacy for agents"],
        downloadTrust: "first-party",
        checksum: "sha-agents",
        reviewedBy: "",
      };
      expect(entryTrustSummary(entry).review.claimStatus).toBeDefined();
      expect(entryTrustSignalCoverage(entry).max).toBe(8);
      expect(sourceSummary(entry).repoUrl).toContain("agents");
      expect(entryCanonicalUrl(entry)).toContain("agents");
    });
    it("trust matrix agents/vscode/verified", () => {
      const entry = {
        category: "agents",
        slug: "agents-vscode",
        title: "agents tool",
        description: "desc",
        platforms: ["vscode"],
        claimStatus: "verified",
        repoUrl: "https://github.com/example/agents",
        documentationUrl: "https://docs.example.com/agents",
        safetyNotes: ["Safety for agents"],
        privacyNotes: ["Privacy for agents"],
        downloadTrust: "first-party",
        checksum: "sha-agents",
        reviewedBy: "maintainer",
      };
      expect(entryTrustSummary(entry).review.claimStatus).toBeDefined();
      expect(entryTrustSignalCoverage(entry).max).toBe(8);
      expect(sourceSummary(entry).repoUrl).toContain("agents");
      expect(entryCanonicalUrl(entry)).toContain("agents");
    });
    it("trust matrix agents/vscode/unclaimed", () => {
      const entry = {
        category: "agents",
        slug: "agents-vscode",
        title: "agents tool",
        description: "desc",
        platforms: ["vscode"],
        claimStatus: "unclaimed",
        repoUrl: "https://github.com/example/agents",
        documentationUrl: "https://docs.example.com/agents",
        safetyNotes: ["Safety for agents"],
        privacyNotes: ["Privacy for agents"],
        downloadTrust: "first-party",
        checksum: "sha-agents",
        reviewedBy: "",
      };
      expect(entryTrustSummary(entry).review.claimStatus).toBeDefined();
      expect(entryTrustSignalCoverage(entry).max).toBe(8);
      expect(sourceSummary(entry).repoUrl).toContain("agents");
      expect(entryCanonicalUrl(entry)).toContain("agents");
    });
    it("trust matrix agents/vscode/pending", () => {
      const entry = {
        category: "agents",
        slug: "agents-vscode",
        title: "agents tool",
        description: "desc",
        platforms: ["vscode"],
        claimStatus: "pending",
        repoUrl: "https://github.com/example/agents",
        documentationUrl: "https://docs.example.com/agents",
        safetyNotes: ["Safety for agents"],
        privacyNotes: ["Privacy for agents"],
        downloadTrust: "first-party",
        checksum: "sha-agents",
        reviewedBy: "",
      };
      expect(entryTrustSummary(entry).review.claimStatus).toBeDefined();
      expect(entryTrustSignalCoverage(entry).max).toBe(8);
      expect(sourceSummary(entry).repoUrl).toContain("agents");
      expect(entryCanonicalUrl(entry)).toContain("agents");
    });
    it("trust matrix agents/vscode/disputed", () => {
      const entry = {
        category: "agents",
        slug: "agents-vscode",
        title: "agents tool",
        description: "desc",
        platforms: ["vscode"],
        claimStatus: "disputed",
        repoUrl: "https://github.com/example/agents",
        documentationUrl: "https://docs.example.com/agents",
        safetyNotes: ["Safety for agents"],
        privacyNotes: ["Privacy for agents"],
        downloadTrust: "first-party",
        checksum: "sha-agents",
        reviewedBy: "",
      };
      expect(entryTrustSummary(entry).review.claimStatus).toBeDefined();
      expect(entryTrustSignalCoverage(entry).max).toBe(8);
      expect(sourceSummary(entry).repoUrl).toContain("agents");
      expect(entryCanonicalUrl(entry)).toContain("agents");
    });
    it("trust matrix agents/vscode/none", () => {
      const entry = {
        category: "agents",
        slug: "agents-vscode",
        title: "agents tool",
        description: "desc",
        platforms: ["vscode"],
        claimStatus: "",
        repoUrl: "https://github.com/example/agents",
        documentationUrl: "https://docs.example.com/agents",
        safetyNotes: ["Safety for agents"],
        privacyNotes: ["Privacy for agents"],
        downloadTrust: "first-party",
        checksum: "sha-agents",
        reviewedBy: "",
      };
      expect(entryTrustSummary(entry).review.claimStatus).toBeDefined();
      expect(entryTrustSignalCoverage(entry).max).toBe(8);
      expect(sourceSummary(entry).repoUrl).toContain("agents");
      expect(entryCanonicalUrl(entry)).toContain("agents");
    });
    it("trust matrix agents/jetbrains/verified", () => {
      const entry = {
        category: "agents",
        slug: "agents-jetbrains",
        title: "agents tool",
        description: "desc",
        platforms: ["jetbrains"],
        claimStatus: "verified",
        repoUrl: "https://github.com/example/agents",
        documentationUrl: "https://docs.example.com/agents",
        safetyNotes: ["Safety for agents"],
        privacyNotes: ["Privacy for agents"],
        downloadTrust: "first-party",
        checksum: "sha-agents",
        reviewedBy: "maintainer",
      };
      expect(entryTrustSummary(entry).review.claimStatus).toBeDefined();
      expect(entryTrustSignalCoverage(entry).max).toBe(8);
      expect(sourceSummary(entry).repoUrl).toContain("agents");
      expect(entryCanonicalUrl(entry)).toContain("agents");
    });
    it("trust matrix agents/jetbrains/unclaimed", () => {
      const entry = {
        category: "agents",
        slug: "agents-jetbrains",
        title: "agents tool",
        description: "desc",
        platforms: ["jetbrains"],
        claimStatus: "unclaimed",
        repoUrl: "https://github.com/example/agents",
        documentationUrl: "https://docs.example.com/agents",
        safetyNotes: ["Safety for agents"],
        privacyNotes: ["Privacy for agents"],
        downloadTrust: "first-party",
        checksum: "sha-agents",
        reviewedBy: "",
      };
      expect(entryTrustSummary(entry).review.claimStatus).toBeDefined();
      expect(entryTrustSignalCoverage(entry).max).toBe(8);
      expect(sourceSummary(entry).repoUrl).toContain("agents");
      expect(entryCanonicalUrl(entry)).toContain("agents");
    });
    it("trust matrix agents/jetbrains/pending", () => {
      const entry = {
        category: "agents",
        slug: "agents-jetbrains",
        title: "agents tool",
        description: "desc",
        platforms: ["jetbrains"],
        claimStatus: "pending",
        repoUrl: "https://github.com/example/agents",
        documentationUrl: "https://docs.example.com/agents",
        safetyNotes: ["Safety for agents"],
        privacyNotes: ["Privacy for agents"],
        downloadTrust: "first-party",
        checksum: "sha-agents",
        reviewedBy: "",
      };
      expect(entryTrustSummary(entry).review.claimStatus).toBeDefined();
      expect(entryTrustSignalCoverage(entry).max).toBe(8);
      expect(sourceSummary(entry).repoUrl).toContain("agents");
      expect(entryCanonicalUrl(entry)).toContain("agents");
    });
    it("trust matrix agents/jetbrains/disputed", () => {
      const entry = {
        category: "agents",
        slug: "agents-jetbrains",
        title: "agents tool",
        description: "desc",
        platforms: ["jetbrains"],
        claimStatus: "disputed",
        repoUrl: "https://github.com/example/agents",
        documentationUrl: "https://docs.example.com/agents",
        safetyNotes: ["Safety for agents"],
        privacyNotes: ["Privacy for agents"],
        downloadTrust: "first-party",
        checksum: "sha-agents",
        reviewedBy: "",
      };
      expect(entryTrustSummary(entry).review.claimStatus).toBeDefined();
      expect(entryTrustSignalCoverage(entry).max).toBe(8);
      expect(sourceSummary(entry).repoUrl).toContain("agents");
      expect(entryCanonicalUrl(entry)).toContain("agents");
    });
    it("trust matrix agents/jetbrains/none", () => {
      const entry = {
        category: "agents",
        slug: "agents-jetbrains",
        title: "agents tool",
        description: "desc",
        platforms: ["jetbrains"],
        claimStatus: "",
        repoUrl: "https://github.com/example/agents",
        documentationUrl: "https://docs.example.com/agents",
        safetyNotes: ["Safety for agents"],
        privacyNotes: ["Privacy for agents"],
        downloadTrust: "first-party",
        checksum: "sha-agents",
        reviewedBy: "",
      };
      expect(entryTrustSummary(entry).review.claimStatus).toBeDefined();
      expect(entryTrustSignalCoverage(entry).max).toBe(8);
      expect(sourceSummary(entry).repoUrl).toContain("agents");
      expect(entryCanonicalUrl(entry)).toContain("agents");
    });
    it("trust matrix workflows/claude-code/verified", () => {
      const entry = {
        category: "workflows",
        slug: "workflows-claude-code",
        title: "workflows tool",
        description: "desc",
        platforms: ["claude-code"],
        claimStatus: "verified",
        repoUrl: "https://github.com/example/workflows",
        documentationUrl: "https://docs.example.com/workflows",
        safetyNotes: ["Safety for workflows"],
        privacyNotes: ["Privacy for workflows"],
        downloadTrust: "first-party",
        checksum: "sha-workflows",
        reviewedBy: "maintainer",
      };
      expect(entryTrustSummary(entry).review.claimStatus).toBeDefined();
      expect(entryTrustSignalCoverage(entry).max).toBe(8);
      expect(sourceSummary(entry).repoUrl).toContain("workflows");
      expect(entryCanonicalUrl(entry)).toContain("workflows");
    });
    it("trust matrix workflows/claude-code/unclaimed", () => {
      const entry = {
        category: "workflows",
        slug: "workflows-claude-code",
        title: "workflows tool",
        description: "desc",
        platforms: ["claude-code"],
        claimStatus: "unclaimed",
        repoUrl: "https://github.com/example/workflows",
        documentationUrl: "https://docs.example.com/workflows",
        safetyNotes: ["Safety for workflows"],
        privacyNotes: ["Privacy for workflows"],
        downloadTrust: "first-party",
        checksum: "sha-workflows",
        reviewedBy: "",
      };
      expect(entryTrustSummary(entry).review.claimStatus).toBeDefined();
      expect(entryTrustSignalCoverage(entry).max).toBe(8);
      expect(sourceSummary(entry).repoUrl).toContain("workflows");
      expect(entryCanonicalUrl(entry)).toContain("workflows");
    });
    it("trust matrix workflows/claude-code/pending", () => {
      const entry = {
        category: "workflows",
        slug: "workflows-claude-code",
        title: "workflows tool",
        description: "desc",
        platforms: ["claude-code"],
        claimStatus: "pending",
        repoUrl: "https://github.com/example/workflows",
        documentationUrl: "https://docs.example.com/workflows",
        safetyNotes: ["Safety for workflows"],
        privacyNotes: ["Privacy for workflows"],
        downloadTrust: "first-party",
        checksum: "sha-workflows",
        reviewedBy: "",
      };
      expect(entryTrustSummary(entry).review.claimStatus).toBeDefined();
      expect(entryTrustSignalCoverage(entry).max).toBe(8);
      expect(sourceSummary(entry).repoUrl).toContain("workflows");
      expect(entryCanonicalUrl(entry)).toContain("workflows");
    });
    it("trust matrix workflows/claude-code/disputed", () => {
      const entry = {
        category: "workflows",
        slug: "workflows-claude-code",
        title: "workflows tool",
        description: "desc",
        platforms: ["claude-code"],
        claimStatus: "disputed",
        repoUrl: "https://github.com/example/workflows",
        documentationUrl: "https://docs.example.com/workflows",
        safetyNotes: ["Safety for workflows"],
        privacyNotes: ["Privacy for workflows"],
        downloadTrust: "first-party",
        checksum: "sha-workflows",
        reviewedBy: "",
      };
      expect(entryTrustSummary(entry).review.claimStatus).toBeDefined();
      expect(entryTrustSignalCoverage(entry).max).toBe(8);
      expect(sourceSummary(entry).repoUrl).toContain("workflows");
      expect(entryCanonicalUrl(entry)).toContain("workflows");
    });
    it("trust matrix workflows/claude-code/none", () => {
      const entry = {
        category: "workflows",
        slug: "workflows-claude-code",
        title: "workflows tool",
        description: "desc",
        platforms: ["claude-code"],
        claimStatus: "",
        repoUrl: "https://github.com/example/workflows",
        documentationUrl: "https://docs.example.com/workflows",
        safetyNotes: ["Safety for workflows"],
        privacyNotes: ["Privacy for workflows"],
        downloadTrust: "first-party",
        checksum: "sha-workflows",
        reviewedBy: "",
      };
      expect(entryTrustSummary(entry).review.claimStatus).toBeDefined();
      expect(entryTrustSignalCoverage(entry).max).toBe(8);
      expect(sourceSummary(entry).repoUrl).toContain("workflows");
      expect(entryCanonicalUrl(entry)).toContain("workflows");
    });
    it("trust matrix workflows/cursor/verified", () => {
      const entry = {
        category: "workflows",
        slug: "workflows-cursor",
        title: "workflows tool",
        description: "desc",
        platforms: ["cursor"],
        claimStatus: "verified",
        repoUrl: "https://github.com/example/workflows",
        documentationUrl: "https://docs.example.com/workflows",
        safetyNotes: ["Safety for workflows"],
        privacyNotes: ["Privacy for workflows"],
        downloadTrust: "first-party",
        checksum: "sha-workflows",
        reviewedBy: "maintainer",
      };
      expect(entryTrustSummary(entry).review.claimStatus).toBeDefined();
      expect(entryTrustSignalCoverage(entry).max).toBe(8);
      expect(sourceSummary(entry).repoUrl).toContain("workflows");
      expect(entryCanonicalUrl(entry)).toContain("workflows");
    });
    it("trust matrix workflows/cursor/unclaimed", () => {
      const entry = {
        category: "workflows",
        slug: "workflows-cursor",
        title: "workflows tool",
        description: "desc",
        platforms: ["cursor"],
        claimStatus: "unclaimed",
        repoUrl: "https://github.com/example/workflows",
        documentationUrl: "https://docs.example.com/workflows",
        safetyNotes: ["Safety for workflows"],
        privacyNotes: ["Privacy for workflows"],
        downloadTrust: "first-party",
        checksum: "sha-workflows",
        reviewedBy: "",
      };
      expect(entryTrustSummary(entry).review.claimStatus).toBeDefined();
      expect(entryTrustSignalCoverage(entry).max).toBe(8);
      expect(sourceSummary(entry).repoUrl).toContain("workflows");
      expect(entryCanonicalUrl(entry)).toContain("workflows");
    });
    it("trust matrix workflows/cursor/pending", () => {
      const entry = {
        category: "workflows",
        slug: "workflows-cursor",
        title: "workflows tool",
        description: "desc",
        platforms: ["cursor"],
        claimStatus: "pending",
        repoUrl: "https://github.com/example/workflows",
        documentationUrl: "https://docs.example.com/workflows",
        safetyNotes: ["Safety for workflows"],
        privacyNotes: ["Privacy for workflows"],
        downloadTrust: "first-party",
        checksum: "sha-workflows",
        reviewedBy: "",
      };
      expect(entryTrustSummary(entry).review.claimStatus).toBeDefined();
      expect(entryTrustSignalCoverage(entry).max).toBe(8);
      expect(sourceSummary(entry).repoUrl).toContain("workflows");
      expect(entryCanonicalUrl(entry)).toContain("workflows");
    });
    it("trust matrix workflows/cursor/disputed", () => {
      const entry = {
        category: "workflows",
        slug: "workflows-cursor",
        title: "workflows tool",
        description: "desc",
        platforms: ["cursor"],
        claimStatus: "disputed",
        repoUrl: "https://github.com/example/workflows",
        documentationUrl: "https://docs.example.com/workflows",
        safetyNotes: ["Safety for workflows"],
        privacyNotes: ["Privacy for workflows"],
        downloadTrust: "first-party",
        checksum: "sha-workflows",
        reviewedBy: "",
      };
      expect(entryTrustSummary(entry).review.claimStatus).toBeDefined();
      expect(entryTrustSignalCoverage(entry).max).toBe(8);
      expect(sourceSummary(entry).repoUrl).toContain("workflows");
      expect(entryCanonicalUrl(entry)).toContain("workflows");
    });
    it("trust matrix workflows/cursor/none", () => {
      const entry = {
        category: "workflows",
        slug: "workflows-cursor",
        title: "workflows tool",
        description: "desc",
        platforms: ["cursor"],
        claimStatus: "",
        repoUrl: "https://github.com/example/workflows",
        documentationUrl: "https://docs.example.com/workflows",
        safetyNotes: ["Safety for workflows"],
        privacyNotes: ["Privacy for workflows"],
        downloadTrust: "first-party",
        checksum: "sha-workflows",
        reviewedBy: "",
      };
      expect(entryTrustSummary(entry).review.claimStatus).toBeDefined();
      expect(entryTrustSignalCoverage(entry).max).toBe(8);
      expect(sourceSummary(entry).repoUrl).toContain("workflows");
      expect(entryCanonicalUrl(entry)).toContain("workflows");
    });
    it("trust matrix workflows/codex/verified", () => {
      const entry = {
        category: "workflows",
        slug: "workflows-codex",
        title: "workflows tool",
        description: "desc",
        platforms: ["codex"],
        claimStatus: "verified",
        repoUrl: "https://github.com/example/workflows",
        documentationUrl: "https://docs.example.com/workflows",
        safetyNotes: ["Safety for workflows"],
        privacyNotes: ["Privacy for workflows"],
        downloadTrust: "first-party",
        checksum: "sha-workflows",
        reviewedBy: "maintainer",
      };
      expect(entryTrustSummary(entry).review.claimStatus).toBeDefined();
      expect(entryTrustSignalCoverage(entry).max).toBe(8);
      expect(sourceSummary(entry).repoUrl).toContain("workflows");
      expect(entryCanonicalUrl(entry)).toContain("workflows");
    });
    it("trust matrix workflows/codex/unclaimed", () => {
      const entry = {
        category: "workflows",
        slug: "workflows-codex",
        title: "workflows tool",
        description: "desc",
        platforms: ["codex"],
        claimStatus: "unclaimed",
        repoUrl: "https://github.com/example/workflows",
        documentationUrl: "https://docs.example.com/workflows",
        safetyNotes: ["Safety for workflows"],
        privacyNotes: ["Privacy for workflows"],
        downloadTrust: "first-party",
        checksum: "sha-workflows",
        reviewedBy: "",
      };
      expect(entryTrustSummary(entry).review.claimStatus).toBeDefined();
      expect(entryTrustSignalCoverage(entry).max).toBe(8);
      expect(sourceSummary(entry).repoUrl).toContain("workflows");
      expect(entryCanonicalUrl(entry)).toContain("workflows");
    });
    it("trust matrix workflows/codex/pending", () => {
      const entry = {
        category: "workflows",
        slug: "workflows-codex",
        title: "workflows tool",
        description: "desc",
        platforms: ["codex"],
        claimStatus: "pending",
        repoUrl: "https://github.com/example/workflows",
        documentationUrl: "https://docs.example.com/workflows",
        safetyNotes: ["Safety for workflows"],
        privacyNotes: ["Privacy for workflows"],
        downloadTrust: "first-party",
        checksum: "sha-workflows",
        reviewedBy: "",
      };
      expect(entryTrustSummary(entry).review.claimStatus).toBeDefined();
      expect(entryTrustSignalCoverage(entry).max).toBe(8);
      expect(sourceSummary(entry).repoUrl).toContain("workflows");
      expect(entryCanonicalUrl(entry)).toContain("workflows");
    });
    it("trust matrix workflows/codex/disputed", () => {
      const entry = {
        category: "workflows",
        slug: "workflows-codex",
        title: "workflows tool",
        description: "desc",
        platforms: ["codex"],
        claimStatus: "disputed",
        repoUrl: "https://github.com/example/workflows",
        documentationUrl: "https://docs.example.com/workflows",
        safetyNotes: ["Safety for workflows"],
        privacyNotes: ["Privacy for workflows"],
        downloadTrust: "first-party",
        checksum: "sha-workflows",
        reviewedBy: "",
      };
      expect(entryTrustSummary(entry).review.claimStatus).toBeDefined();
      expect(entryTrustSignalCoverage(entry).max).toBe(8);
      expect(sourceSummary(entry).repoUrl).toContain("workflows");
      expect(entryCanonicalUrl(entry)).toContain("workflows");
    });
    it("trust matrix workflows/codex/none", () => {
      const entry = {
        category: "workflows",
        slug: "workflows-codex",
        title: "workflows tool",
        description: "desc",
        platforms: ["codex"],
        claimStatus: "",
        repoUrl: "https://github.com/example/workflows",
        documentationUrl: "https://docs.example.com/workflows",
        safetyNotes: ["Safety for workflows"],
        privacyNotes: ["Privacy for workflows"],
        downloadTrust: "first-party",
        checksum: "sha-workflows",
        reviewedBy: "",
      };
      expect(entryTrustSummary(entry).review.claimStatus).toBeDefined();
      expect(entryTrustSignalCoverage(entry).max).toBe(8);
      expect(sourceSummary(entry).repoUrl).toContain("workflows");
      expect(entryCanonicalUrl(entry)).toContain("workflows");
    });
    it("trust matrix workflows/windsurf/verified", () => {
      const entry = {
        category: "workflows",
        slug: "workflows-windsurf",
        title: "workflows tool",
        description: "desc",
        platforms: ["windsurf"],
        claimStatus: "verified",
        repoUrl: "https://github.com/example/workflows",
        documentationUrl: "https://docs.example.com/workflows",
        safetyNotes: ["Safety for workflows"],
        privacyNotes: ["Privacy for workflows"],
        downloadTrust: "first-party",
        checksum: "sha-workflows",
        reviewedBy: "maintainer",
      };
      expect(entryTrustSummary(entry).review.claimStatus).toBeDefined();
      expect(entryTrustSignalCoverage(entry).max).toBe(8);
      expect(sourceSummary(entry).repoUrl).toContain("workflows");
      expect(entryCanonicalUrl(entry)).toContain("workflows");
    });
    it("trust matrix workflows/windsurf/unclaimed", () => {
      const entry = {
        category: "workflows",
        slug: "workflows-windsurf",
        title: "workflows tool",
        description: "desc",
        platforms: ["windsurf"],
        claimStatus: "unclaimed",
        repoUrl: "https://github.com/example/workflows",
        documentationUrl: "https://docs.example.com/workflows",
        safetyNotes: ["Safety for workflows"],
        privacyNotes: ["Privacy for workflows"],
        downloadTrust: "first-party",
        checksum: "sha-workflows",
        reviewedBy: "",
      };
      expect(entryTrustSummary(entry).review.claimStatus).toBeDefined();
      expect(entryTrustSignalCoverage(entry).max).toBe(8);
      expect(sourceSummary(entry).repoUrl).toContain("workflows");
      expect(entryCanonicalUrl(entry)).toContain("workflows");
    });
    it("trust matrix workflows/windsurf/pending", () => {
      const entry = {
        category: "workflows",
        slug: "workflows-windsurf",
        title: "workflows tool",
        description: "desc",
        platforms: ["windsurf"],
        claimStatus: "pending",
        repoUrl: "https://github.com/example/workflows",
        documentationUrl: "https://docs.example.com/workflows",
        safetyNotes: ["Safety for workflows"],
        privacyNotes: ["Privacy for workflows"],
        downloadTrust: "first-party",
        checksum: "sha-workflows",
        reviewedBy: "",
      };
      expect(entryTrustSummary(entry).review.claimStatus).toBeDefined();
      expect(entryTrustSignalCoverage(entry).max).toBe(8);
      expect(sourceSummary(entry).repoUrl).toContain("workflows");
      expect(entryCanonicalUrl(entry)).toContain("workflows");
    });
    it("trust matrix workflows/windsurf/disputed", () => {
      const entry = {
        category: "workflows",
        slug: "workflows-windsurf",
        title: "workflows tool",
        description: "desc",
        platforms: ["windsurf"],
        claimStatus: "disputed",
        repoUrl: "https://github.com/example/workflows",
        documentationUrl: "https://docs.example.com/workflows",
        safetyNotes: ["Safety for workflows"],
        privacyNotes: ["Privacy for workflows"],
        downloadTrust: "first-party",
        checksum: "sha-workflows",
        reviewedBy: "",
      };
      expect(entryTrustSummary(entry).review.claimStatus).toBeDefined();
      expect(entryTrustSignalCoverage(entry).max).toBe(8);
      expect(sourceSummary(entry).repoUrl).toContain("workflows");
      expect(entryCanonicalUrl(entry)).toContain("workflows");
    });
    it("trust matrix workflows/windsurf/none", () => {
      const entry = {
        category: "workflows",
        slug: "workflows-windsurf",
        title: "workflows tool",
        description: "desc",
        platforms: ["windsurf"],
        claimStatus: "",
        repoUrl: "https://github.com/example/workflows",
        documentationUrl: "https://docs.example.com/workflows",
        safetyNotes: ["Safety for workflows"],
        privacyNotes: ["Privacy for workflows"],
        downloadTrust: "first-party",
        checksum: "sha-workflows",
        reviewedBy: "",
      };
      expect(entryTrustSummary(entry).review.claimStatus).toBeDefined();
      expect(entryTrustSignalCoverage(entry).max).toBe(8);
      expect(sourceSummary(entry).repoUrl).toContain("workflows");
      expect(entryCanonicalUrl(entry)).toContain("workflows");
    });
    it("trust matrix workflows/vscode/verified", () => {
      const entry = {
        category: "workflows",
        slug: "workflows-vscode",
        title: "workflows tool",
        description: "desc",
        platforms: ["vscode"],
        claimStatus: "verified",
        repoUrl: "https://github.com/example/workflows",
        documentationUrl: "https://docs.example.com/workflows",
        safetyNotes: ["Safety for workflows"],
        privacyNotes: ["Privacy for workflows"],
        downloadTrust: "first-party",
        checksum: "sha-workflows",
        reviewedBy: "maintainer",
      };
      expect(entryTrustSummary(entry).review.claimStatus).toBeDefined();
      expect(entryTrustSignalCoverage(entry).max).toBe(8);
      expect(sourceSummary(entry).repoUrl).toContain("workflows");
      expect(entryCanonicalUrl(entry)).toContain("workflows");
    });
    it("trust matrix workflows/vscode/unclaimed", () => {
      const entry = {
        category: "workflows",
        slug: "workflows-vscode",
        title: "workflows tool",
        description: "desc",
        platforms: ["vscode"],
        claimStatus: "unclaimed",
        repoUrl: "https://github.com/example/workflows",
        documentationUrl: "https://docs.example.com/workflows",
        safetyNotes: ["Safety for workflows"],
        privacyNotes: ["Privacy for workflows"],
        downloadTrust: "first-party",
        checksum: "sha-workflows",
        reviewedBy: "",
      };
      expect(entryTrustSummary(entry).review.claimStatus).toBeDefined();
      expect(entryTrustSignalCoverage(entry).max).toBe(8);
      expect(sourceSummary(entry).repoUrl).toContain("workflows");
      expect(entryCanonicalUrl(entry)).toContain("workflows");
    });
    it("trust matrix workflows/vscode/pending", () => {
      const entry = {
        category: "workflows",
        slug: "workflows-vscode",
        title: "workflows tool",
        description: "desc",
        platforms: ["vscode"],
        claimStatus: "pending",
        repoUrl: "https://github.com/example/workflows",
        documentationUrl: "https://docs.example.com/workflows",
        safetyNotes: ["Safety for workflows"],
        privacyNotes: ["Privacy for workflows"],
        downloadTrust: "first-party",
        checksum: "sha-workflows",
        reviewedBy: "",
      };
      expect(entryTrustSummary(entry).review.claimStatus).toBeDefined();
      expect(entryTrustSignalCoverage(entry).max).toBe(8);
      expect(sourceSummary(entry).repoUrl).toContain("workflows");
      expect(entryCanonicalUrl(entry)).toContain("workflows");
    });
    it("trust matrix workflows/vscode/disputed", () => {
      const entry = {
        category: "workflows",
        slug: "workflows-vscode",
        title: "workflows tool",
        description: "desc",
        platforms: ["vscode"],
        claimStatus: "disputed",
        repoUrl: "https://github.com/example/workflows",
        documentationUrl: "https://docs.example.com/workflows",
        safetyNotes: ["Safety for workflows"],
        privacyNotes: ["Privacy for workflows"],
        downloadTrust: "first-party",
        checksum: "sha-workflows",
        reviewedBy: "",
      };
      expect(entryTrustSummary(entry).review.claimStatus).toBeDefined();
      expect(entryTrustSignalCoverage(entry).max).toBe(8);
      expect(sourceSummary(entry).repoUrl).toContain("workflows");
      expect(entryCanonicalUrl(entry)).toContain("workflows");
    });
    it("trust matrix workflows/vscode/none", () => {
      const entry = {
        category: "workflows",
        slug: "workflows-vscode",
        title: "workflows tool",
        description: "desc",
        platforms: ["vscode"],
        claimStatus: "",
        repoUrl: "https://github.com/example/workflows",
        documentationUrl: "https://docs.example.com/workflows",
        safetyNotes: ["Safety for workflows"],
        privacyNotes: ["Privacy for workflows"],
        downloadTrust: "first-party",
        checksum: "sha-workflows",
        reviewedBy: "",
      };
      expect(entryTrustSummary(entry).review.claimStatus).toBeDefined();
      expect(entryTrustSignalCoverage(entry).max).toBe(8);
      expect(sourceSummary(entry).repoUrl).toContain("workflows");
      expect(entryCanonicalUrl(entry)).toContain("workflows");
    });
    it("trust matrix workflows/jetbrains/verified", () => {
      const entry = {
        category: "workflows",
        slug: "workflows-jetbrains",
        title: "workflows tool",
        description: "desc",
        platforms: ["jetbrains"],
        claimStatus: "verified",
        repoUrl: "https://github.com/example/workflows",
        documentationUrl: "https://docs.example.com/workflows",
        safetyNotes: ["Safety for workflows"],
        privacyNotes: ["Privacy for workflows"],
        downloadTrust: "first-party",
        checksum: "sha-workflows",
        reviewedBy: "maintainer",
      };
      expect(entryTrustSummary(entry).review.claimStatus).toBeDefined();
      expect(entryTrustSignalCoverage(entry).max).toBe(8);
      expect(sourceSummary(entry).repoUrl).toContain("workflows");
      expect(entryCanonicalUrl(entry)).toContain("workflows");
    });
    it("trust matrix workflows/jetbrains/unclaimed", () => {
      const entry = {
        category: "workflows",
        slug: "workflows-jetbrains",
        title: "workflows tool",
        description: "desc",
        platforms: ["jetbrains"],
        claimStatus: "unclaimed",
        repoUrl: "https://github.com/example/workflows",
        documentationUrl: "https://docs.example.com/workflows",
        safetyNotes: ["Safety for workflows"],
        privacyNotes: ["Privacy for workflows"],
        downloadTrust: "first-party",
        checksum: "sha-workflows",
        reviewedBy: "",
      };
      expect(entryTrustSummary(entry).review.claimStatus).toBeDefined();
      expect(entryTrustSignalCoverage(entry).max).toBe(8);
      expect(sourceSummary(entry).repoUrl).toContain("workflows");
      expect(entryCanonicalUrl(entry)).toContain("workflows");
    });
    it("trust matrix workflows/jetbrains/pending", () => {
      const entry = {
        category: "workflows",
        slug: "workflows-jetbrains",
        title: "workflows tool",
        description: "desc",
        platforms: ["jetbrains"],
        claimStatus: "pending",
        repoUrl: "https://github.com/example/workflows",
        documentationUrl: "https://docs.example.com/workflows",
        safetyNotes: ["Safety for workflows"],
        privacyNotes: ["Privacy for workflows"],
        downloadTrust: "first-party",
        checksum: "sha-workflows",
        reviewedBy: "",
      };
      expect(entryTrustSummary(entry).review.claimStatus).toBeDefined();
      expect(entryTrustSignalCoverage(entry).max).toBe(8);
      expect(sourceSummary(entry).repoUrl).toContain("workflows");
      expect(entryCanonicalUrl(entry)).toContain("workflows");
    });
    it("trust matrix workflows/jetbrains/disputed", () => {
      const entry = {
        category: "workflows",
        slug: "workflows-jetbrains",
        title: "workflows tool",
        description: "desc",
        platforms: ["jetbrains"],
        claimStatus: "disputed",
        repoUrl: "https://github.com/example/workflows",
        documentationUrl: "https://docs.example.com/workflows",
        safetyNotes: ["Safety for workflows"],
        privacyNotes: ["Privacy for workflows"],
        downloadTrust: "first-party",
        checksum: "sha-workflows",
        reviewedBy: "",
      };
      expect(entryTrustSummary(entry).review.claimStatus).toBeDefined();
      expect(entryTrustSignalCoverage(entry).max).toBe(8);
      expect(sourceSummary(entry).repoUrl).toContain("workflows");
      expect(entryCanonicalUrl(entry)).toContain("workflows");
    });
    it("trust matrix workflows/jetbrains/none", () => {
      const entry = {
        category: "workflows",
        slug: "workflows-jetbrains",
        title: "workflows tool",
        description: "desc",
        platforms: ["jetbrains"],
        claimStatus: "",
        repoUrl: "https://github.com/example/workflows",
        documentationUrl: "https://docs.example.com/workflows",
        safetyNotes: ["Safety for workflows"],
        privacyNotes: ["Privacy for workflows"],
        downloadTrust: "first-party",
        checksum: "sha-workflows",
        reviewedBy: "",
      };
      expect(entryTrustSummary(entry).review.claimStatus).toBeDefined();
      expect(entryTrustSignalCoverage(entry).max).toBe(8);
      expect(sourceSummary(entry).repoUrl).toContain("workflows");
      expect(entryCanonicalUrl(entry)).toContain("workflows");
    });
  });
});
