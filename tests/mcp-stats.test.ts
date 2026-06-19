import { describe, expect, it } from "vitest";

import {
  authDistribution,
  classifyAuth,
  classifyTransport,
  hostingDistribution,
  hostingOf,
  supplyChainCoverage,
  transportDistribution,
} from "@/lib/mcp-stats";
import type { Entry } from "@/types/registry";

/** Build a minimal Entry; only the fields the stats helpers read need to be real. */
function mk(partial: Partial<Entry>): Entry {
  return { category: "mcp", slug: "x", title: "X", ...partial } as Entry;
}

describe("classifyTransport", () => {
  it("detects stdio from a local command config", () => {
    expect(
      classifyTransport(
        mk({ configSnippet: '{"command":"npx","args":["-y","srv"]}' }),
      ),
    ).toBe("stdio (local)");
  });

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

  it("detects SSE before HTTP", () => {
    expect(
      classifyTransport(
        mk({ configSnippet: '{"transport":"sse","url":"https://x/sse"}' }),
      ),
    ).toBe("SSE");
  });

  it("is Unspecified with no config/install signal", () => {
    expect(classifyTransport(mk({}))).toBe("Unspecified");
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
});

describe("hostingOf", () => {
  it("maps transport to local/remote", () => {
    expect(hostingOf("stdio (local)")).toBe("Local (stdio)");
    expect(hostingOf("HTTP")).toBe("Remote (hosted)");
    expect(hostingOf("SSE")).toBe("Remote (hosted)");
    expect(hostingOf("Unspecified")).toBe("Unspecified");
  });
});

describe("classifyAuth", () => {
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

  it("reads from notes and description too, not just prerequisites", () => {
    expect(
      classifyAuth(mk({ safetyNotes: "Scope the API key to read-only." })),
    ).toBe("API key");
    expect(
      classifyAuth(mk({ description: "Connect via OAuth to your account." })),
    ).toBe("OAuth");
  });
});

describe("distributions", () => {
  const entries = [
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
    const { rows, total } = transportDistribution(entries);
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

  it("derives local-vs-remote hosting", () => {
    const rows = hostingDistribution(entries).rows;
    expect(rows.find((r) => r.label === "Local (stdio)")?.count).toBe(2);
    expect(rows.find((r) => r.label === "Remote (hosted)")?.count).toBe(2);
  });

  it("counts auth methods", () => {
    const rows = authDistribution(entries).rows;
    expect(rows.find((r) => r.label === "OAuth")?.count).toBe(1);
    expect(rows.find((r) => r.label === "API key")?.count).toBe(1);
    expect(rows.find((r) => r.label === "Token / PAT")?.count).toBe(1);
    expect(rows.find((r) => r.label === "None / unspecified")?.count).toBe(1);
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
      mk({ downloadUrl: "/d.mcpb" }), // no checksum → not counted
      mk({}),
    ]);
    expect(cov).toEqual({
      total: 4,
      packageVerified: 2,
      checksummedDownload: 1,
    });
  });
});
