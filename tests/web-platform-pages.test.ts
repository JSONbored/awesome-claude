import { describe, expect, it } from "vitest";

import {
  buildPlatformPage,
  findPlatformPageDefinition,
  getPlatformPageDefinitions,
} from "@/lib/platform-pages";

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
