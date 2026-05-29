import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

import { ARTIFACT_CONTRACTS } from "@/data/changelog";
import { ECOSYSTEM_FEEDS } from "@/data/ecosystem-feeds";
import { BEST_LISTS, ENTRIES, WEEKLY_BRIEF } from "@/data/entries";
import { getIntegration } from "@/data/integrations";
import { PLATFORM_MATRIX } from "@/data/platforms";
import { REVIEW_COVERAGE, REVIEW_SUMMARY } from "@/data/validators";
import { repoRoot } from "./helpers/registry-fixtures";

describe("Atlas production data wiring", () => {
  it("builds platform rows only from real registry entries", () => {
    const entryKeys = new Set(
      ENTRIES.map((entry) => `${entry.category}/${entry.slug}`),
    );
    const rows = Object.values(PLATFORM_MATRIX).flat();
    expect(rows.length).toBeGreaterThan(0);
    for (const row of rows) {
      expect(
        entryKeys.has(`${row.category}/${row.slug}`),
        `${row.category}/${row.slug}`,
      ).toBe(true);
    }
  });

  it("does not publish the old fake validator roster", () => {
    const source = fs.readFileSync(
      path.join(repoRoot, "apps/web/src/data/validators.ts"),
      "utf8",
    );
    for (const fakeName of [
      "Jeremy Harris",
      "Marvin Wong",
      "Nora Patel",
      "Ops Guild",
      "Claude Workflows",
    ]) {
      expect(source).not.toContain(fakeName);
    }
    expect(REVIEW_SUMMARY.publicRosterAvailable).toBe(false);
    expect(REVIEW_COVERAGE.length).toBeGreaterThan(0);
  });

  it("derives ecosystem feed metadata from artifact contracts", () => {
    const contractsByPath = new Map(
      ARTIFACT_CONTRACTS.map((artifact) => [artifact.path, artifact]),
    );
    expect(ECOSYSTEM_FEEDS.length).toBeGreaterThan(0);
    for (const feed of ECOSYSTEM_FEEDS) {
      const contract = contractsByPath.get(feed.path);
      expect(contract, feed.path).toBeTruthy();
      expect(feed.bytes).toBe(contract?.bytes);
      expect(feed.sha256).toBe(contract?.sha256);
      expect(feed.sha256).not.toContain("…");
    }
  });

  it("keeps linked public feed URLs backed by real routes or artifacts", () => {
    const appShell = fs.readFileSync(
      path.join(repoRoot, "apps/web/src/components/app-shell.tsx"),
      "utf8",
    );
    const feedsRoute = fs.readFileSync(
      path.join(repoRoot, "apps/web/src/routes/feeds.$slug.ts"),
      "utf8",
    );
    const sitemapRoute = fs.readFileSync(
      path.join(repoRoot, "apps/web/src/routes/sitemap[.]xml.ts"),
      "utf8",
    );
    const retiredFeedPath = ["/feeds", "ecosystem.json"].join("/");

    expect(appShell).toContain("/data/feeds/index.json");
    expect(appShell).not.toContain(retiredFeedPath);
    expect(feedsRoute).toContain('slug === "trending"');
    expect(sitemapRoute).toContain('"/feeds/trending.xml"');
    expect(sitemapRoute).toContain('"/data/feeds/index.json"');
  });

  it("keeps first-party MCP integration metadata aligned with the package", () => {
    const packageJson = JSON.parse(
      fs.readFileSync(path.join(repoRoot, "packages/mcp/package.json"), "utf8"),
    ) as { version: string };
    expect(getIntegration("mcp-server")?.version).toBe(packageJson.version);
  });

  it("keeps generated best lists and weekly brief backed by registry entries", () => {
    const entryRefs = new Set(
      ENTRIES.map((entry) => `${entry.category}/${entry.slug}`),
    );
    expect(BEST_LISTS.length).toBeGreaterThanOrEqual(20);
    expect(BEST_LISTS.map((list) => list.slug)).toContain(
      "agent-workflow-starter-kits",
    );

    for (const list of BEST_LISTS) {
      expect(list.picks.length, list.slug).toBeGreaterThan(0);
      for (const pick of list.picks) {
        expect(entryRefs.has(pick.ref), `${list.slug}:${pick.ref}`).toBe(true);
      }
    }

    for (const section of [
      WEEKLY_BRIEF.newEntries,
      WEEKLY_BRIEF.trustedInstalls,
      WEEKLY_BRIEF.sourceBackedPicks,
    ]) {
      expect(section.length).toBeGreaterThan(0);
      for (const item of section) {
        expect(entryRefs.has(item.ref), item.ref).toBe(true);
      }
    }
  });
});
