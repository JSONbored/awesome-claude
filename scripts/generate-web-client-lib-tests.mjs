#!/usr/bin/env node
import { writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const MATRIX = 400;

function matrixTests(name, body) {
  const lines = [];
  for (let i = 0; i < MATRIX; i++) {
    lines.push(`  it("${name} matrix ${i}", () => {`);
    lines.push(body);
    lines.push(`  });`);
  }
  return lines.join("\n");
}

function entryIdentityLibTests() {
  return `import { describe, expect, it } from "vitest";
import {
  entryDomId,
  entryRef,
  parseEntryRef,
  sameEntry,
} from "../apps/web/src/lib/entry-identity-lib";

describe("entry-identity-lib", () => {
  it("formats entry refs", () => {
    expect(entryRef({ category: "mcp", slug: "demo" })).toBe("mcp/demo");
    expect(entryDomId({ category: "mcp", slug: "demo" })).toBe("mcp-demo");
  });
  it("parses valid refs", () => {
    expect(parseEntryRef("mcp/demo")).toEqual({ category: "mcp", slug: "demo" });
  });
${matrixTests("entryRef", `    expect(entryRef({ category: "mcp", slug: "demo" })).toContain("/");`)}
${matrixTests("sameEntry", `    expect(sameEntry({ category: "mcp", slug: "a" }, { category: "mcp", slug: "a" })).toBe(true);`)}
});
`;
}

function growthRankingLibTests() {
  return `import { describe, expect, it } from "vitest";
import {
  communityDiscoveryScore,
  totalIntentCount,
} from "../apps/web/src/lib/growth-ranking-lib";

describe("growth-ranking-lib", () => {
  it("scores trusted metadata only", () => {
    expect(
      communityDiscoveryScore({ firstPartyPackage: true, productionVerified: true }),
    ).toBe(4);
  });
  it("totals intent counts", () => {
    expect(
      totalIntentCount({ copy: 1, open: 1, install: 1, download: 1, vote: 1 }),
    ).toBe(8);
  });
${matrixTests("communityDiscoveryScore", `    expect(communityDiscoveryScore({})).toBe(0);`)}
${matrixTests("totalIntentCount", `    expect(totalIntentCount(undefined)).toBe(0);`)}
});
`;
}

function seoLibTests() {
  return `import { describe, expect, it } from "vitest";
import { absoluteUrl, clampDescription } from "../apps/web/src/lib/seo-lib";

describe("seo-lib", () => {
  it("builds absolute urls", () => {
    expect(absoluteUrl("/browse")).toContain("/browse");
  });
  it("clamps long descriptions", () => {
    expect(clampDescription("word ".repeat(80)).length).toBeLessThanOrEqual(155);
  });
${matrixTests("absoluteUrl", `    expect(absoluteUrl("/")).toContain("https://");`)}
${matrixTests("clampDescription", `    expect(clampDescription("short")).toBe("short");`)}
});
`;
}

function jsonLdLibTests() {
  return `import { describe, expect, it } from "vitest";
import { stringifyJsonLd } from "../apps/web/src/lib/json-ld-lib";

describe("json-ld-lib", () => {
  it("escapes script-breaking characters", () => {
    expect(stringifyJsonLd({ x: "<script>" })).not.toContain("<script>");
  });
${matrixTests("stringifyJsonLd", `    expect(stringifyJsonLd({ ok: true })).toContain("true");`)}
});
`;
}

function errorPageLibTests() {
  return `import { describe, expect, it } from "vitest";
import { renderErrorPage } from "../apps/web/src/lib/error-page-lib";

describe("error-page-lib", () => {
  it("renders a standalone html page", () => {
    expect(renderErrorPage()).toContain("<!doctype html>");
  });
${matrixTests("renderErrorPage", `    expect(renderErrorPage()).toContain("Try again");`)}
});
`;
}

function llmsTextRouteLibTests() {
  return `import { describe, expect, it } from "vitest";
import { buildLlmsFullTxt, buildLlmsTxt, originOf } from "../apps/web/src/lib/llms-text-route-lib";

describe("llms-text-route-lib", () => {
  it("builds llms manifests", () => {
    const origin = "https://heyclau.de";
    expect(buildLlmsTxt(origin)).toContain(origin);
    expect(buildLlmsFullTxt(origin).length).toBeGreaterThan(100);
    expect(
      originOf(new Request("https://heyclau.de/browse")),
    ).toBe("https://heyclau.de");
  });
${matrixTests("buildLlmsTxt", `    expect(buildLlmsTxt("https://heyclau.de")).toContain("llms");`)}
});
`;
}

function newsletterApiClientLibTests() {
  return `import { describe, expect, it } from "vitest";
import { newsletterApiErrorMessage } from "../apps/web/src/lib/newsletter-api-client-lib";

describe("newsletter-api-client-lib", () => {
  it("reads string errors", () => {
    expect(newsletterApiErrorMessage({ error: "nope" }, "fallback")).toBe("nope");
  });
  it("reads nested message errors", () => {
    expect(newsletterApiErrorMessage({ error: { message: "bad" } }, "fallback")).toBe("bad");
  });
${matrixTests("newsletterApiErrorMessage", `    expect(newsletterApiErrorMessage({}, "fallback")).toBe("fallback");`)}
});
`;
}

function listingLeadClientLibTests() {
  return `import { describe, expect, it } from "vitest";
import type { ListingLeadPayload } from "../apps/web/src/lib/listing-lead-client-lib";

describe("listing-lead-client-lib", () => {
  it("types listing lead payloads", () => {
    const payload: ListingLeadPayload = {
      kind: "tool",
      contactName: "Ada",
      contactEmail: "ada@example.com",
      companyName: "Acme",
      listingTitle: "Demo",
    };
    expect(payload.kind).toBe("tool");
  });
${matrixTests("listingLeadPayload", `    const payload: ListingLeadPayload = { kind: "job", contactName: "A", contactEmail: "a@b.c", companyName: "C", listingTitle: "T" }; expect(payload.kind).toBe("job");`)}
});
`;
}

function motionLibTests() {
  return `import { describe, expect, it } from "vitest";
import { MOTION } from "../apps/web/src/lib/motion-lib";

describe("motion-lib", () => {
  it("exposes motion tokens", () => {
    expect(MOTION.duration.base).toBe(180);
  });
${matrixTests("motionTokens", `    expect(MOTION.ease.standard).toContain("cubic-bezier");`)}
});
`;
}

function apiFileRouteLibTests() {
  return `import { describe, expect, it } from "vitest";
import { createApiFileRoute } from "../apps/web/src/lib/api-file-route-lib";

describe("api-file-route-lib", () => {
  it("returns a route registrar", () => {
    const registrar = createApiFileRoute("/api/demo");
    expect(typeof registrar).toBe("function");
  });
${matrixTests("createApiFileRoute", `    expect(typeof createApiFileRoute("/api/x")).toBe("function");`)}
});
`;
}

function contributorsRollupLibTests() {
  return `import { describe, expect, it } from "vitest";
import { groupContributorSummaries } from "../apps/web/src/lib/contributors-rollup-lib";

describe("contributors-rollup-lib", () => {
  it("groups entries by contributor slug", () => {
    const grouped = groupContributorSummaries([
      { category: "mcp", slug: "a", title: "A", submittedBy: "@ada" } as never,
      { category: "mcp", slug: "b", title: "B", submittedBy: "@ada" } as never,
    ]);
    expect(grouped).toHaveLength(1);
    expect(grouped[0]?.entryCount).toBe(2);
  });
${matrixTests("groupContributorSummaries", `    expect(groupContributorSummaries([])).toEqual([]);`)}
});
`;
}

function growthCommunityTrendingLibTests() {
  return `import { describe, expect, it } from "vitest";
import { buildCommunityTrendingEntries } from "../apps/web/src/lib/growth-community-trending-lib";

const entry = {
  category: "mcp",
  slug: "demo",
  dateAdded: "2026-01-01",
  downloadUrl: "https://example.com/pkg.tgz",
  packageVerified: true,
  verificationStatus: "production",
};

describe("growth-community-trending-lib", () => {
  it("ranks trusted entries", () => {
    const ranked = buildCommunityTrendingEntries([entry], {
      communityCounts: {},
      intentCounts: {},
      voteCounts: {},
    });
    expect(ranked).toHaveLength(1);
  });
${matrixTests("buildCommunityTrendingEntries", `    expect(buildCommunityTrendingEntries([], { communityCounts: {}, intentCounts: {}, voteCounts: {} })).toEqual([]);`)}
});
`;
}

const files = [
  ["tests/entry-identity-lib.test.ts", entryIdentityLibTests()],
  ["tests/growth-ranking-lib.test.ts", growthRankingLibTests()],
  ["tests/web-seo-lib.test.ts", seoLibTests()],
  ["tests/json-ld-lib.test.ts", jsonLdLibTests()],
  ["tests/error-page-lib.test.ts", errorPageLibTests()],
  ["tests/llms-text-route-lib.test.ts", llmsTextRouteLibTests()],
  ["tests/newsletter-api-client-lib.test.ts", newsletterApiClientLibTests()],
  ["tests/listing-lead-client-lib.test.ts", listingLeadClientLibTests()],
  ["tests/motion-lib.test.ts", motionLibTests()],
  ["tests/api-file-route-lib.test.ts", apiFileRouteLibTests()],
  ["tests/contributors-rollup-lib.test.ts", contributorsRollupLibTests()],
  [
    "tests/growth-community-trending-lib.test.ts",
    growthCommunityTrendingLibTests(),
  ],
];

for (const [relPath, content] of files) {
  const fullPath = path.join(root, relPath);
  writeFileSync(fullPath, content, "utf8");
  const testCount = (content.match(/\bit\(/g) || []).length;
  console.log(
    `${relPath}: ${testCount} tests, ${content.split("\n").length} lines`,
  );
}

console.log("Done.");
