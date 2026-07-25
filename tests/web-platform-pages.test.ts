import { describe, expect, it } from "vitest";
import fs from "node:fs";
import path from "node:path";

import {
  buildPlatformPage,
  findPlatformPageDefinition,
  getPlatformPageDefinitions,
} from "@/lib/platform-pages";
import { repoRoot } from "./helpers/registry-fixtures";

describe("platform-pages re-export surface", () => {
  it("keeps the public import path wired to the extracted lib", () => {
    expect(getPlatformPageDefinitions()).toHaveLength(6);
    const claude = findPlatformPageDefinition("claude");
    expect(claude?.platform).toBe("Claude");
    const page = buildPlatformPage(claude!, [
      {
        category: "skills",
        slug: "demo",
        title: "Demo",
        description: "Demo skill",
      } as const,
    ]);
    expect(page.count).toBe(1);
    expect(page.feedUrl).toContain("/data/feeds/platforms/");
  });
});

describe("platform hub thin-content guard", () => {
  // The platform hub route must apply the same "thin content -> noindex" policy as its
  // sibling routes for.$platform.$category.tsx and tags.$tag.tsx (#5537). Routes are not
  // importable in the node suite, so pin the guard at the source level, the same way
  // sitemap-policy.test.ts pins the sitemap source surfaces.
  const noindexGuard =
    '...(entries.length < 2 ? [{ name: "robots", content: "noindex, follow" }] : []),';

  it("noindexes platform hubs with fewer than 2 entries, like its sibling routes", () => {
    const source = fs.readFileSync(
      path.join(repoRoot, "apps/web/src/routes/for.$platform.tsx"),
      "utf8",
    );
    expect(source).toContain(noindexGuard);
  });

  it("keeps the guard identical to the sibling child route's pattern", () => {
    const sibling = fs.readFileSync(
      path.join(repoRoot, "apps/web/src/routes/for.$platform.$category.tsx"),
      "utf8",
    );
    expect(sibling).toContain(noindexGuard);
  });
});
