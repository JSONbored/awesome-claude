import { describe, expect, it } from "vitest";

import {
  authDistribution,
  classifyAuth,
  classifyTransport,
  hostingOf,
  supplyChainCoverage,
  transportDistribution,
} from "@/lib/mcp-stats";

describe("mcp-stats re-export surface", () => {
  it("keeps the public import path wired to the extracted lib", () => {
    const entry = {
      category: "mcp",
      slug: "demo",
      title: "Demo",
      configSnippet: '{"type":"http","url":"https://example/mcp"}',
      prerequisites: ["API key"],
    } as const;

    expect(classifyTransport(entry)).toBe("HTTP");
    expect(hostingOf("HTTP")).toBe("Remote (hosted)");
    expect(classifyAuth(entry)).toBe("API key");
    expect(transportDistribution([entry]).total).toBe(1);
    expect(authDistribution([entry]).rows[0]?.label).toBe("API key");
    expect(supplyChainCoverage([entry]).total).toBe(1);
  });
});
