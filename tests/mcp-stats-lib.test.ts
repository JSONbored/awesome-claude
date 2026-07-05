import { describe, expect, it } from "vitest";

import {
  authDistribution,
  classifyAuth,
  classifyTransport,
  hostingDistribution,
  hostingOf,
  supplyChainCoverage,
  transportDistribution,
  type McpAuth,
  type McpTransport,
} from "../apps/web/src/lib/mcp-stats-lib";
import type { Entry } from "@/types/registry";

/** Build a minimal Entry; only the fields the stats helpers read need to be real. */
function mk(partial: Partial<Entry>): Entry {
  return { category: "mcp", slug: "x", title: "X", ...partial } as Entry;
}

describe("classifyTransport", () => {
  describe("stdio (local)", () => {
    it("detects stdio from a local command config", () => {
      expect(
        classifyTransport(
          mk({ configSnippet: '{"command":"npx","args":["-y","srv"]}' }),
        ),
      ).toBe("stdio (local)");
    });

    it.each([
      ['{"command":"uvx","args":["pkg"]}', "uvx launcher"],
      ['{"command":"node","args":["server.js"]}', "node server"],
      ['{"command":"python","args":["-m","mcp"]}', "python module"],
      ['{"command":"docker","args":["run","img"]}', "docker run"],
    ])("classifies command config %s as stdio (%s)", (snippet) => {
      expect(classifyTransport(mk({ configSnippet: snippet }))).toBe(
        "stdio (local)",
      );
    });

    it("reads command from copySnippet when configSnippet is absent", () => {
      expect(
        classifyTransport(mk({ copySnippet: '{"command":"npx","args":[]}' })),
      ).toBe("stdio (local)");
    });
  });

  describe("HTTP", () => {
    it("detects HTTP from an explicit type, a remote url, or the install flag", () => {
      expect(
        classifyTransport(
          mk({ configSnippet: '{"type":"http","url":"https://x/mcp"}' }),
        ),
      ).toBe("HTTP");
      expect(
        classifyTransport(mk({ copySnippet: '{"url":"https://x.app/mcp"}' })),
      ).toBe("HTTP");
      expect(
        classifyTransport(
          mk({
            installCommand: "claude mcp add --transport http x https://x/mcp",
          }),
        ),
      ).toBe("HTTP");
    });

    it.each([
      ['{"type":"http","url":"https://api.example/mcp"}', "explicit type http"],
      ['{"transport":"http","url":"https://host/mcp"}', "transport http"],
      [
        '{"type":"streamable-http","url":"https://host/mcp"}',
        "streamable-http",
      ],
      [
        '{"type":"streamablehttp","url":"https://host/mcp"}',
        "streamablehttp alias",
      ],
      ['{"url":"http://localhost:8080/mcp"}', "bare url field"],
      ['{"url":"https://127.0.0.1/mcp"}', "https url only"],
    ])("classifies %s as HTTP (%s)", (snippet) => {
      expect(classifyTransport(mk({ configSnippet: snippet }))).toBe("HTTP");
    });

    it("detects HTTP from installCommand with --transport=http form", () => {
      expect(
        classifyTransport(
          mk({
            installCommand:
              "claude mcp add my-server --transport=http https://example/mcp",
          }),
        ),
      ).toBe("HTTP");
    });

    it("does not infer HTTP from a bare URL in installCommand without transport flag", () => {
      expect(
        classifyTransport(
          mk({
            installCommand: "npx mcp-remote https://remote.example/mcp",
          }),
        ),
      ).toBe("Unspecified");
    });
  });

  describe("SSE", () => {
    it("detects SSE before HTTP when both signals appear", () => {
      expect(
        classifyTransport(
          mk({ configSnippet: '{"transport":"sse","url":"https://x/sse"}' }),
        ),
      ).toBe("SSE");
    });

    it.each([
      ['{"type":"sse","url":"https://x/events"}', "type sse"],
      ['{"transport":"sse","url":"https://x/sse"}', "transport sse"],
      [
        '{"url":"https://x/sse","sse endpoint":"/events"}',
        "sse endpoint phrase",
      ],
      ["install: claude mcp add --transport sse srv https://x", "install flag"],
    ])("classifies SSE signal in %s (%s)", (raw, _label) => {
      const isInstall = raw.startsWith("install:");
      const entry = isInstall
        ? mk({ installCommand: raw.replace("install: ", "") })
        : mk({ configSnippet: raw });
      expect(classifyTransport(entry)).toBe("SSE");
    });

    it("prefers SSE over HTTP when config mentions both transports", () => {
      expect(
        classifyTransport(
          mk({
            configSnippet:
              '{"type":"http","transport":"sse","url":"https://x/sse"}',
          }),
        ),
      ).toBe("SSE");
    });

    it("prefers SSE over stdio command when SSE marker is present", () => {
      expect(
        classifyTransport(
          mk({
            configSnippet:
              '{"command":"npx","transport":"sse","url":"https://x/sse"}',
          }),
        ),
      ).toBe("SSE");
    });
  });

  describe("Unspecified", () => {
    it("is Unspecified with no config/install signal", () => {
      expect(classifyTransport(mk({}))).toBe("Unspecified");
    });

    it("is Unspecified when all haystack fields are empty strings", () => {
      expect(
        classifyTransport(
          mk({ configSnippet: "", copySnippet: "", installCommand: "" }),
        ),
      ).toBe("Unspecified");
    });

    it("does not infer transport from unrelated non-empty config", () => {
      expect(
        classifyTransport(
          mk({ configSnippet: '{"env":{"API_KEY":"required"}}' }),
        ),
      ).toBe("Unspecified");
      expect(
        classifyTransport(
          mk({ copySnippet: '{"headers":{"authorization":"Bearer token"}}' }),
        ),
      ).toBe("Unspecified");
    });

    it.each([
      '{"name":"my-mcp"}',
      '{"version":"1.0.0"}',
      '{"description":"A tool server"}',
      '{"capabilities":{"tools":true}}',
      '{"stdio":false}',
    ])("does not treat unrelated JSON %s as transport", (snippet) => {
      expect(classifyTransport(mk({ configSnippet: snippet }))).toBe(
        "Unspecified",
      );
    });
  });

  describe("haystack merging", () => {
    it("combines configSnippet, copySnippet, and installCommand", () => {
      expect(
        classifyTransport(
          mk({
            configSnippet: '{"env":{}}',
            copySnippet: '{"url":"https://combined.example/mcp"}',
            installCommand: "",
          }),
        ),
      ).toBe("HTTP");
    });

    it("is case-insensitive when scanning haystack", () => {
      expect(
        classifyTransport(
          mk({ configSnippet: '{"TYPE":"HTTP","URL":"HTTPS://X/MCP"}' }),
        ),
      ).toBe("HTTP");
      expect(
        classifyTransport(
          mk({ configSnippet: '{"TRANSPORT":"SSE","URL":"HTTPS://X/SSE"}' }),
        ),
      ).toBe("SSE");
    });
  });
});

describe("hostingOf", () => {
  it("maps transport to local/remote", () => {
    expect(hostingOf("stdio (local)")).toBe("Local (stdio)");
    expect(hostingOf("HTTP")).toBe("Remote (hosted)");
    expect(hostingOf("SSE")).toBe("Remote (hosted)");
    expect(hostingOf("Unspecified")).toBe("Unspecified");
  });

  it.each<[McpTransport, "Local (stdio)" | "Remote (hosted)" | "Unspecified"]>([
    ["stdio (local)", "Local (stdio)"],
    ["HTTP", "Remote (hosted)"],
    ["SSE", "Remote (hosted)"],
    ["Unspecified", "Unspecified"],
  ])("maps %s → %s", (transport, hosting) => {
    expect(hostingOf(transport)).toBe(hosting);
  });
});

describe("classifyAuth", () => {
  describe("precedence", () => {
    it("prefers OAuth, then API key, then token, else none", () => {
      expect(
        classifyAuth(mk({ prerequisites: ["OAuth2 credentials or a PAT"] })),
      ).toBe("OAuth");
      expect(
        classifyAuth(mk({ prerequisites: ["An API key from the dashboard"] })),
      ).toBe("API key");
      expect(
        classifyAuth(mk({ prerequisites: ["A personal access token (PAT)"] })),
      ).toBe("Token / PAT");
      expect(classifyAuth(mk({ prerequisites: ["Node.js 18+"] }))).toBe(
        "None / unspecified",
      );
    });

    it("chooses OAuth when OAuth and API key both appear", () => {
      expect(
        classifyAuth(
          mk({
            prerequisites: ["OAuth app", "Dashboard API key"],
          }),
        ),
      ).toBe("OAuth");
    });

    it("chooses API key when API key and PAT both appear without OAuth", () => {
      expect(
        classifyAuth(
          mk({
            prerequisites: [
              "API key required",
              "Personal access token optional",
            ],
          }),
        ),
      ).toBe("API key");
    });
  });

  describe("OAuth detection", () => {
    it.each([
      "OAuth2 client credentials",
      "Connect with oauth to your workspace",
      "Requires OAUTH login",
      "oauth1 signing secret",
    ])("detects OAuth in %s", (text) => {
      expect(classifyAuth(mk({ prerequisites: [text] }))).toBe("OAuth");
    });
  });

  describe("API key detection", () => {
    it.each([
      "An API key from the dashboard",
      "Set your api-key in env",
      "Export API_KEY before launch",
      "api keys are scoped per project",
    ])("detects API key in %s", (text) => {
      expect(classifyAuth(mk({ prerequisites: [text] }))).toBe("API key");
    });
  });

  describe("Token / PAT detection", () => {
    it.each([
      "A personal access token (PAT)",
      "Generate a PAT with read scope",
      "Bearer token in Authorization header",
      "Provide an access token for the API",
      "Uses pat-based auth for GitHub",
    ])("detects token auth in %s", (text) => {
      expect(classifyAuth(mk({ prerequisites: [text] }))).toBe("Token / PAT");
    });
  });

  describe("field coverage", () => {
    it("reads from notes and description too, not just prerequisites", () => {
      expect(
        classifyAuth(mk({ safetyNotes: "Scope the API key to read-only." })),
      ).toBe("API key");
      expect(
        classifyAuth(mk({ description: "Connect via OAuth to your account." })),
      ).toBe("OAuth");
      expect(
        classifyAuth(
          mk({ privacyNotes: "Never share your personal access token." }),
        ),
      ).toBe("Token / PAT");
    });

    it("merges prerequisites, safetyNotes, privacyNotes, and description", () => {
      expect(
        classifyAuth(
          mk({
            prerequisites: ["Node 20"],
            safetyNotes: "Rotate keys regularly",
            privacyNotes: "OAuth scopes are minimal",
            description: "No credentials required for local stdio",
          }),
        ),
      ).toBe("OAuth");
    });

    it("treats missing prerequisites as empty", () => {
      expect(classifyAuth(mk({ description: "Fully local, no auth." }))).toBe(
        "None / unspecified",
      );
    });
  });
});

describe("transportDistribution", () => {
  const sampleEntries = [
    mk({ configSnippet: '{"command":"npx"}', prerequisites: ["API key"] }),
    mk({
      configSnippet: '{"command":"uvx"}',
      prerequisites: ["A personal access token"],
    }),
    mk({
      configSnippet: '{"type":"http","url":"https://a/mcp"}',
      prerequisites: ["OAuth"],
    }),
    mk({
      configSnippet: '{"transport":"sse","url":"https://b/sse"}',
      prerequisites: ["Node 18"],
    }),
  ];

  it("counts transports and keeps the fixed order, dropping empties", () => {
    const { rows, total } = transportDistribution(sampleEntries);
    expect(total).toBe(4);
    expect(rows.map((r) => [r.label, r.count])).toEqual([
      ["stdio (local)", 2],
      ["HTTP", 1],
      ["SSE", 1],
    ]);
  });

  it("keeps Unspecified last when an entry has no declared transport", () => {
    const { rows, total } = transportDistribution([
      mk({ configSnippet: '{"transport":"sse","url":"https://b/sse"}' }),
      mk({ configSnippet: '{"env":{"TOKEN":"required"}}' }),
    ]);

    expect(total).toBe(2);
    expect(rows.map((r) => [r.label, r.count])).toEqual([
      ["SSE", 1],
      ["Unspecified", 1],
    ]);
  });

  it("returns empty rows for an empty entry list", () => {
    const { rows, total } = transportDistribution([]);
    expect(total).toBe(0);
    expect(rows).toEqual([]);
  });

  it("counts a single stdio entry", () => {
    const { rows, total } = transportDistribution([
      mk({ configSnippet: '{"command":"npx"}' }),
    ]);
    expect(total).toBe(1);
    expect(rows).toEqual([{ label: "stdio (local)", count: 1 }]);
  });

  it("aggregates many HTTP entries", () => {
    const httpEntries = Array.from({ length: 12 }, (_, i) =>
      mk({
        slug: `http-${i}`,
        configSnippet: `{"url":"https://host-${i}.example/mcp"}`,
      }),
    );
    const { rows, total } = transportDistribution(httpEntries);
    expect(total).toBe(12);
    expect(rows).toEqual([{ label: "HTTP", count: 12 }]);
  });

  it("preserves stdio → HTTP → SSE → Unspecified ordering with all buckets", () => {
    const entries = [
      mk({ configSnippet: '{"env":{}}' }),
      mk({ configSnippet: '{"transport":"sse","url":"https://s/sse"}' }),
      mk({ configSnippet: '{"url":"https://h/mcp"}' }),
      mk({ configSnippet: '{"command":"npx"}' }),
    ];
    const labels = transportDistribution(entries).rows.map((r) => r.label);
    expect(labels).toEqual(["stdio (local)", "HTTP", "SSE", "Unspecified"]);
  });
});

describe("hostingDistribution", () => {
  const entries = [
    mk({ configSnippet: '{"command":"npx"}' }),
    mk({ configSnippet: '{"command":"uvx"}' }),
    mk({ configSnippet: '{"type":"http","url":"https://a/mcp"}' }),
    mk({ configSnippet: '{"transport":"sse","url":"https://b/sse"}' }),
  ];

  it("derives local-vs-remote hosting from transport", () => {
    const rows = hostingDistribution(entries).rows;
    expect(rows.find((r) => r.label === "Local (stdio)")?.count).toBe(2);
    expect(rows.find((r) => r.label === "Remote (hosted)")?.count).toBe(2);
  });

  it("omits Unspecified hosting when every entry has a known transport", () => {
    const labels = hostingDistribution(entries).rows.map((r) => r.label);
    expect(labels).not.toContain("Unspecified");
  });

  it("includes Unspecified hosting for entries without transport signal", () => {
    const { rows } = hostingDistribution([
      mk({ description: "No config yet" }),
    ]);
    expect(rows).toEqual([{ label: "Unspecified", count: 1 }]);
  });

  it("returns empty rows for empty input", () => {
    expect(hostingDistribution([])).toEqual({ rows: [], total: 0 });
  });
});

describe("authDistribution", () => {
  const entries = [
    mk({ prerequisites: ["API key"] }),
    mk({ prerequisites: ["A personal access token"] }),
    mk({ prerequisites: ["OAuth"] }),
    mk({ prerequisites: ["Node 18"] }),
  ];

  it("counts auth methods in fixed precedence order", () => {
    const rows = authDistribution(entries).rows;
    expect(rows.find((r) => r.label === "OAuth")?.count).toBe(1);
    expect(rows.find((r) => r.label === "API key")?.count).toBe(1);
    expect(rows.find((r) => r.label === "Token / PAT")?.count).toBe(1);
    expect(rows.find((r) => r.label === "None / unspecified")?.count).toBe(1);
  });

  it("orders rows OAuth → API key → Token / PAT → None", () => {
    const labels = authDistribution(entries).rows.map((r) => r.label);
    expect(labels).toEqual([
      "OAuth",
      "API key",
      "Token / PAT",
      "None / unspecified",
    ]);
  });

  it("drops auth buckets with zero count", () => {
    const { rows } = authDistribution([mk({ prerequisites: ["OAuth only"] })]);
    expect(rows).toEqual([{ label: "OAuth", count: 1 }]);
  });

  it("returns empty rows for empty input", () => {
    expect(authDistribution([])).toEqual({ rows: [], total: 0 });
  });

  it("counts repeated auth classes across a large batch", () => {
    const batch = [
      ...Array.from({ length: 5 }, () =>
        mk({ prerequisites: ["API key from console"] }),
      ),
      ...Array.from({ length: 3 }, () =>
        mk({ description: "Uses OAuth for sign-in" }),
      ),
    ];
    const rows = authDistribution(batch).rows;
    expect(rows).toEqual([
      { label: "OAuth", count: 3 },
      { label: "API key", count: 5 },
    ]);
  });
});

describe("supplyChainCoverage", () => {
  it("counts verified packages and checksummed downloads", () => {
    const cov = supplyChainCoverage([
      mk({
        packageVerified: true,
        downloadUrl: "/d.mcpb",
        downloadSha256: "abc",
      }),
      mk({ packageVerified: true }),
      mk({ downloadUrl: "/d.mcpb" }),
      mk({}),
    ]);
    expect(cov).toEqual({
      total: 4,
      packageVerified: 2,
      checksummedDownload: 1,
    });
  });

  it("returns zeros for an empty list", () => {
    expect(supplyChainCoverage([])).toEqual({
      total: 0,
      packageVerified: 0,
      checksummedDownload: 0,
    });
  });

  it("does not count download without checksum", () => {
    expect(
      supplyChainCoverage([mk({ downloadUrl: "/pkg.mcpb" })])
        .checksummedDownload,
    ).toBe(0);
  });

  it("does not count checksum without download URL", () => {
    expect(
      supplyChainCoverage([mk({ downloadSha256: "deadbeef" })])
        .checksummedDownload,
    ).toBe(0);
  });

  it("counts packageVerified only when truthy", () => {
    const cov = supplyChainCoverage([
      mk({ packageVerified: true }),
      mk({ packageVerified: false }),
      mk({}),
    ]);
    expect(cov.packageVerified).toBe(1);
  });

  it("counts both signals on the same entry independently", () => {
    const cov = supplyChainCoverage([
      mk({
        packageVerified: true,
        downloadUrl: "/bundle.mcpb",
        downloadSha256: "sha",
      }),
    ]);
    expect(cov).toEqual({
      total: 1,
      packageVerified: 1,
      checksummedDownload: 1,
    });
  });

  it("aggregates across many entries", () => {
    const entries = Array.from({ length: 20 }, (_, i) =>
      mk({
        slug: `e-${i}`,
        packageVerified: i % 2 === 0,
        downloadUrl: i % 3 === 0 ? `/f-${i}.mcpb` : undefined,
        downloadSha256: i % 3 === 0 ? `sha-${i}` : undefined,
      }),
    );
    const cov = supplyChainCoverage(entries);
    expect(cov.total).toBe(20);
    expect(cov.packageVerified).toBe(10);
    expect(cov.checksummedDownload).toBe(7);
  });
});

describe("integration snapshots", () => {
  it("produces consistent transport, hosting, and auth breakdowns", () => {
    const entries: Entry[] = [
      mk({
        slug: "local-tools",
        configSnippet: '{"command":"npx","args":["-y","tools"]}',
        prerequisites: ["Node 18+"],
      }),
      mk({
        slug: "remote-http",
        configSnippet: '{"type":"http","url":"https://api.example/mcp"}',
        prerequisites: ["API key"],
        packageVerified: true,
      }),
      mk({
        slug: "remote-sse",
        configSnippet: '{"transport":"sse","url":"https://sse.example/events"}',
        description: "OAuth sign-in required",
        downloadUrl: "/pkg.mcpb",
        downloadSha256: "abc123",
      }),
      mk({
        slug: "unknown",
        description: "Details coming soon",
      }),
    ];

    expect(transportDistribution(entries).rows.map((r) => r.label)).toEqual([
      "stdio (local)",
      "HTTP",
      "SSE",
      "Unspecified",
    ]);
    expect(hostingDistribution(entries).total).toBe(4);
    expect(authDistribution(entries).rows.map((r) => r.label)).toEqual([
      "OAuth",
      "API key",
      "None / unspecified",
    ]);
    expect(supplyChainCoverage(entries)).toEqual({
      total: 4,
      packageVerified: 1,
      checksummedDownload: 1,
    });
  });

  it("classifies a realistic mixed registry batch", () => {
    const batch = [
      mk({
        installCommand: "claude mcp add --transport http srv https://a/mcp",
        prerequisites: ["API_KEY env var"],
      }),
      mk({
        configSnippet: '{"command":"uvx","args":["mcp-server"]}',
        safetyNotes: "Runs locally; no network credentials",
      }),
      mk({
        copySnippet: '{"transport":"sse","url":"https://b/sse"}',
        privacyNotes: "OAuth tokens stored in OS keychain",
      }),
      mk({
        configSnippet: '{"type":"streamable-http","url":"https://c/mcp"}',
        prerequisites: ["Personal access token with read scope"],
      }),
      mk({ title: "Placeholder" }),
    ];

    const transports = transportDistribution(batch).rows;
    expect(transports).toEqual([
      { label: "stdio (local)", count: 1 },
      { label: "HTTP", count: 2 },
      { label: "SSE", count: 1 },
      { label: "Unspecified", count: 1 },
    ]);

    const auths = authDistribution(batch).rows.map((r) => r.label as McpAuth);
    expect(auths).toContain("OAuth");
    expect(auths).toContain("API key");
    expect(auths).toContain("Token / PAT");
    expect(auths).toContain("None / unspecified");
  });
});
