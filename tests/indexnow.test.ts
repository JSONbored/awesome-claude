import fs from "node:fs";
import path from "node:path";

import { describe, expect, it } from "vitest";

import {
  DEFAULT_INDEXNOW_KEY,
  buildIndexNowPayload,
  chunkUrls,
  extractSitemapUrls,
  hostFromSiteUrl,
  isProductionIndexNowHost,
  keyLocationFor,
  normalizeSubmittedUrls,
} from "../scripts/lib/indexnow.mjs";
import {
  CATEGORY_REPORTS,
  GLOBAL_REPORTS,
  entryHubPaths,
  entryHubUrls,
  tagSlug,
} from "../scripts/lib/indexnow-hubs.mjs";
import { repoRoot } from "./helpers/registry-fixtures";

describe("IndexNow submission helpers", () => {
  it("builds the production key location from the public key file", () => {
    expect(hostFromSiteUrl("https://heyclau.de")).toBe("heyclau.de");
    expect(isProductionIndexNowHost("heyclau.de")).toBe(true);
    expect(keyLocationFor("https://heyclau.de", DEFAULT_INDEXNOW_KEY)).toBe(
      `https://heyclau.de/${DEFAULT_INDEXNOW_KEY}.txt`,
    );
  });

  it("extracts and normalizes same-host HTTPS sitemap URLs", () => {
    const urls = extractSitemapUrls(`
      <urlset>
        <url><loc>https://heyclau.de/agents</loc></url>
        <url><loc>https://heyclau.de/mcp#ignored</loc></url>
        <url><loc>https://dev.heyclau.de/preview</loc></url>
        <url><loc>http://heyclau.de/insecure</loc></url>
      </urlset>
    `);

    expect(normalizeSubmittedUrls(urls, "heyclau.de")).toEqual([
      "https://heyclau.de/agents",
      "https://heyclau.de/mcp",
    ]);
  });

  it("validates IndexNow payload shape before submission", () => {
    expect(
      buildIndexNowPayload({
        host: "heyclau.de",
        key: DEFAULT_INDEXNOW_KEY,
        keyLocation: keyLocationFor("https://heyclau.de"),
        urlList: ["https://heyclau.de/skills"],
      }),
    ).toMatchObject({
      host: "heyclau.de",
      key: DEFAULT_INDEXNOW_KEY,
      urlList: ["https://heyclau.de/skills"],
    });

    expect(() =>
      buildIndexNowPayload({
        host: "heyclau.de",
        key: "not-a-key",
        keyLocation: "https://heyclau.de/not-a-key.txt",
        urlList: ["https://heyclau.de/skills"],
      }),
    ).toThrow(/32-character/);
  });

  it("chunks URL batches deterministically", () => {
    expect(chunkUrls(["a", "b", "c", "d", "e"], 2)).toEqual([
      ["a", "b"],
      ["c", "d"],
      ["e"],
    ]);
  });
});

describe("IndexNow hub expansion", () => {
  it("expands a changed entry into its category, tag, and report hubs", () => {
    const paths = entryHubPaths({
      category: "hooks",
      slug: "accessibility-checker",
      tags: ["Accessibility", "a11y", "testing"],
    });
    expect(paths).toContain("/hooks"); // category page
    expect(paths).toContain("/state-of-claude-code-hooks"); // category report
    expect(paths).toContain("/state-of-claude-tooling"); // global report
    expect(paths).toContain("/tags/accessibility"); // slugified tags
    expect(paths).toContain("/tags/a11y");
    expect(paths).toContain("/tags/testing");
  });

  it("never includes the entry's own URL and de-duplicates", () => {
    const paths = entryHubPaths({
      category: "hooks",
      slug: "x",
      tags: ["testing", "testing"],
    });
    expect(paths).not.toContain("/entry/hooks/x");
    expect(new Set(paths).size).toBe(paths.length);
  });

  it("emits only the category page + global report for an unknown category", () => {
    const paths = entryHubPaths({ category: "rules", slug: "x", tags: [] });
    expect(paths).toEqual(["/rules", "/state-of-claude-tooling"]);
  });

  it("treats inherited object property names as unknown categories", () => {
    for (const category of ["constructor", "toString", "__proto__"]) {
      expect(entryHubPaths({ category, slug: "x", tags: [] })).toEqual([
        `/${category}`,
        "/state-of-claude-tooling",
      ]);
    }
  });

  it("emits no tag hubs when the entry has no tags", () => {
    const paths = entryHubPaths({ category: "skills", slug: "x" });
    expect(paths.some((p) => p.startsWith("/tags/"))).toBe(false);
  });

  it("slugifies tags the way the site's tag routes do", () => {
    expect(tagSlug("Code Review")).toBe("code-review");
    expect(tagSlug("  C++ / Rust  ")).toBe("c-rust");
    expect(tagSlug("a11y")).toBe("a11y");
  });

  it("builds absolute hub URLs against a base, without a double slash", () => {
    const urls = entryHubUrls(
      { category: "skills", slug: "x", tags: ["testing"] },
      "https://heyclau.de/",
    );
    expect(urls).toContain("https://heyclau.de/skills");
    expect(urls).toContain("https://heyclau.de/tags/testing");
    expect(urls.every((u) => u.startsWith("https://heyclau.de/"))).toBe(true);
    expect(urls.some((u) => u.includes("//tags"))).toBe(false);
  });

  it("maps only to report routes that actually exist (no drift)", () => {
    const reportPaths = [
      ...new Set([
        ...Object.values(CATEGORY_REPORTS).flat(),
        ...GLOBAL_REPORTS,
      ]),
    ];
    for (const reportPath of reportPaths) {
      const routeFile = path.join(
        repoRoot,
        "apps/web/src/routes",
        `${reportPath.replace(/^\//, "")}.tsx`,
      );
      expect(fs.existsSync(routeFile), reportPath).toBe(true);
    }
  });
});
