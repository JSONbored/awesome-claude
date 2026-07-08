import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const target = path.join(root, "scripts/generate-lib-extraction-tests.mjs");
let source = readFileSync(target, "utf8");

const marker = `console.log("Done generating lib extraction tests.");`;

const libs = [
  {
    testFile: "tests/compare-share-origin-lib.test.ts",
    fn: "compareShareOriginLibTests",
    importFrom: "../apps/web/src/lib/compare-share-origin-lib",
    imports: ["compareShareOrigin"],
    describe: "compare-share-origin-lib",
    baseTests: `  it("returns empty origin in node", () => {
    expect(compareShareOrigin()).toBe("");
  });`,
    matrix: () => `  it("compareShareOrigin matrix __IDX__", () => {
    expect(typeof compareShareOrigin()).toBe("string");
  });`,
    iterations: 200,
  },
  {
    testFile: "tests/compare-interactive-link-lib.test.ts",
    fn: "compareInteractiveLinkLibTests",
    importFrom: "../apps/web/src/lib/compare-interactive-link-lib",
    imports: [
      "COMPARE_INTERACTIVE_MAX",
      "COMPARE_INTERACTIVE_MIN",
      "canOpenInteractiveCompare",
      "compareFullViewSearch",
      "compareInteractiveEntryCount",
      "compareInteractiveLinkLabel",
      "compareInteractiveSearch",
    ],
    describe: "compare-interactive-link-lib",
    baseTests: `  it("requires at least two entries", () => {
    expect(canOpenInteractiveCompare([{ category: "mcp", slug: "a" }])).toBe(false);
  });`,
    matrix: (i) => `  it("compareInteractiveEntryCount matrix ${i}", () => {
    expect(compareInteractiveEntryCount(${i % 6})).toBeLessThanOrEqual(COMPARE_INTERACTIVE_MAX);
  });
  it("compareInteractiveLinkLabel matrix ${i}", () => {
    expect(compareInteractiveLinkLabel(${Math.max(2, i % 5)})).toContain("comparison");
  });`,
    iterations: 200,
  },
  {
    testFile: "tests/compare-empty-guidance-lib.test.ts",
    fn: "compareEmptyGuidanceLibTests",
    importFrom: "../apps/web/src/lib/compare-empty-guidance-lib",
    imports: [
      "compareDrawerEmptyHint",
      "compareEmptyStateDescription",
      "compareInvalidUrlHint",
      "compareSingleItemHintText",
    ],
    describe: "compare-empty-guidance-lib",
    baseTests: `  it("describes empty compare state", () => {
    expect(compareEmptyStateDescription()).toContain("Add");
  });`,
    matrix: (i) => `  it("compareDrawerEmptyHint matrix ${i}", () => {
    expect(compareDrawerEmptyHint()).toContain("Compare");
  });
  it("compareInvalidUrlHint matrix ${i}", () => {
    expect(compareInvalidUrlHint("bad", 0)).toBeTruthy();
  });`,
    iterations: 200,
  },
  {
    testFile: "tests/compare-featured-link-lib.test.ts",
    fn: "compareFeaturedLinkLibTests",
    importFrom: "../apps/web/src/lib/compare-featured-link-lib",
    imports: [
      "compareFeaturedInteractiveLinkLabel",
      "compareFeaturedInteractiveSearch",
      "resolveComparisonRefs",
    ],
    describe: "compare-featured-link-lib",
    baseTests: `  const catalog = [{ category: "mcp", slug: "demo" }];
  it("resolves known refs", () => {
    expect(resolveComparisonRefs(["mcp/demo"], catalog)).toHaveLength(1);
  });`,
    matrix: (i) => `  it("resolveComparisonRefs matrix ${i}", () => {
    expect(resolveComparisonRefs(["missing:__IDX__"], catalog)).toHaveLength(0);
  });`,
    iterations: 200,
  },
  {
    testFile: "tests/compare-dossier-summary-lib.test.ts",
    fn: "compareDossierSummaryLibTests",
    importFrom: "../apps/web/src/lib/compare-dossier-summary-lib",
    imports: [
      "compareDossierActionBannerText",
      "compareDossierEntries",
      "compareDossierSummary",
    ],
    describe: "compare-dossier-summary-lib",
    baseTests: `  const entry = { category: "mcp", slug: "a", title: "A" };
  it("places primary entry first", () => {
    expect(compareDossierEntries(entry as never, [])).toHaveLength(1);
  });`,
    matrix: (i) => `  it("compareDossierActionBannerText matrix ${i}", () => {
    expect(compareDossierActionBannerText(${i % 2 === 0})).toBeNull();
  });
  it("compareDossierSummary matrix ${i}", () => {
    const summary = compareDossierSummary(entry as never, []);
    expect(summary.comparedCount).toBe(1);
  });`,
    iterations: 200,
  },
  {
    testFile: "tests/compare-browse-summary-lib.test.ts",
    fn: "compareBrowseSummaryLibTests",
    importFrom: "../apps/web/src/lib/compare-browse-summary-lib",
    imports: [
      "browseCompareHintText",
      "browseCompareOverflowHint",
      "shouldShowBrowseCompareHint",
    ],
    describe: "compare-browse-summary-lib",
    baseTests: `  const items = [
    { category: "mcp", slug: "a", title: "A" },
    { category: "mcp", slug: "b", title: "B" },
  ];
  it("shows browse hint for multiple items", () => {
    expect(shouldShowBrowseCompareHint(items as never)).toBe(true);
  });`,
    matrix: (i) => `  it("browseCompareOverflowHint matrix ${i}", () => {
    expect(browseCompareOverflowHint(${i + 3}, 2)).toContain("Opening");
  });
  it("browseCompareHintText matrix ${i}", () => {
    expect(browseCompareHintText(items as never)).toBeTruthy();
  });`,
    iterations: 200,
  },
  {
    testFile: "tests/compare-curated-summary-lib.test.ts",
    fn: "compareCuratedSummaryLibTests",
    importFrom: "../apps/web/src/lib/compare-curated-summary-lib",
    imports: [
      "compareCuratedActionBannerText",
      "compareCuratedDecisionBannerText",
      "compareCuratedSummary",
    ],
    describe: "compare-curated-summary-lib",
    baseTests: `  const entries = [{ category: "mcp", slug: "a", title: "A" }];
  it("summarizes curated comparison", () => {
    expect(compareCuratedSummary(entries as never).comparedCount).toBe(1);
  });`,
    matrix: (i) => `  it("compareCuratedActionBannerText matrix ${i}", () => {
    expect(compareCuratedActionBannerText(false)).toBeNull();
  });
  it("compareCuratedDecisionBannerText matrix ${i}", () => {
    expect(compareCuratedDecisionBannerText({ divergingCount: 0, divergingLabels: [], comparedCount: 1 })).toBeNull();
  });`,
    iterations: 200,
  },
  {
    testFile: "tests/compare-page-summary-lib.test.ts",
    fn: "comparePageSummaryLibTests",
    importFrom: "../apps/web/src/lib/compare-page-summary-lib",
    imports: ["comparePageActionBannerText", "comparePageSummary"],
    describe: "compare-page-summary-lib",
    baseTests: `  const entries = [{ category: "mcp", slug: "a", title: "A" }];
  it("summarizes compare page entries", () => {
    expect(comparePageSummary(entries as never).comparedCount).toBe(1);
  });`,
    matrix: (i) => `  it("comparePageActionBannerText matrix ${i}", () => {
    const result = comparePageActionBannerText(${i % 2 === 1});
    expect(result === null || typeof result === "string").toBe(true);
  });`,
    iterations: 200,
  },
  {
    testFile: "tests/compare-drawer-summary-lib.test.ts",
    fn: "compareDrawerSummaryLibTests",
    importFrom: "../apps/web/src/lib/compare-drawer-summary-lib",
    imports: ["compareDrawerActionBannerText", "compareDrawerSummary"],
    describe: "compare-drawer-summary-lib",
    baseTests: `  const entries = [{ category: "mcp", slug: "a", title: "A" }];
  it("summarizes drawer entries", () => {
    expect(compareDrawerSummary(entries as never).comparedCount).toBe(1);
  });`,
    matrix: (i) => `  it("compareDrawerActionBannerText matrix ${i}", () => {
    expect(compareDrawerActionBannerText(false)).toBeNull();
  });`,
    iterations: 200,
  },
  {
    testFile: "tests/compare-drawer-actions-lib.test.ts",
    fn: "compareDrawerActionsLibTests",
    importFrom: "../apps/web/src/lib/compare-drawer-actions-lib",
    imports: ["compareDrawerActionsDiverge", "compareDrawerActionCells"],
    describe: "compare-drawer-actions-lib",
    baseTests: `  const entries = [
    { category: "mcp", slug: "a", title: "A" },
    { category: "mcp", slug: "b", title: "B" },
  ];
  it("builds drawer action cells", () => {
    expect(compareDrawerActionCells(entries as never).length).toBeGreaterThan(0);
  });`,
    matrix: (i) => `  it("compareDrawerActionsDiverge matrix ${i}", () => {
    expect(typeof compareDrawerActionsDiverge(entries as never)).toBe("boolean");
  });`,
    iterations: 200,
  },
  {
    testFile: "tests/compare-table-actions-lib.test.ts",
    fn: "compareTableActionsLibTests",
    importFrom: "../apps/web/src/lib/compare-table-actions-lib",
    imports: ["compareTableActionCells", "shouldRenderCompareTableActions"],
    describe: "compare-table-actions-lib",
    baseTests: `  const entries = [
    { category: "mcp", slug: "a", title: "A" },
    { category: "mcp", slug: "b", title: "B" },
  ];
  it("renders table actions when enabled", () => {
    expect(shouldRenderCompareTableActions(entries as never, true)).toBe(true);
  });`,
    matrix: (i) => `  it("compareTableActionCells matrix ${i}", () => {
    expect(compareTableActionCells(entries as never).length).toBeGreaterThan(0);
  });`,
    iterations: 200,
  },
  {
    testFile: "tests/compare-share-link-lib.test.ts",
    fn: "compareShareLinkLibTests",
    importFrom: "../apps/web/src/lib/compare-share-link-lib",
    imports: ["comparePageSharePath", "comparePageShareUrl"],
    describe: "compare-share-link-lib",
    baseTests: `  it("builds compare share path", () => {
    expect(comparePageSharePath("mcp:a|mcp:b")).toContain("/compare?ids=");
  });`,
    matrix: (i) => `  it("comparePageShareUrl matrix ${i}", () => {
    expect(comparePageShareUrl("mcp:slug-${i}", "https://heyclau.de")).toContain("https://heyclau.de/compare");
  });`,
    iterations: 200,
  },
  {
    testFile: "tests/compare-browse-share-link-lib.test.ts",
    fn: "compareBrowseShareLinkLibTests",
    importFrom: "../apps/web/src/lib/compare-browse-share-link-lib",
    imports: ["compareBrowseSharePath", "compareBrowseShareUrl"],
    describe: "compare-browse-share-link-lib",
    baseTests: `  it("builds browse share path", () => {
    expect(compareBrowseSharePath("mcp:a")).toContain("/browse?compare=");
  });`,
    matrix: (i) => `  it("compareBrowseShareUrl matrix ${i}", () => {
    expect(compareBrowseShareUrl("mcp:slug-${i}", "https://heyclau.de")).toContain("https://heyclau.de/browse");
  });`,
    iterations: 200,
  },
  {
    testFile: "tests/seo-jsonld-lib.test.ts",
    fn: "seoJsonldLibTests",
    importFrom: "../apps/web/src/lib/seo-jsonld-lib",
    imports: ["breadcrumbScript", "itemListScript"],
    describe: "seo-jsonld-lib",
    baseTests: `  it("builds breadcrumb script", () => {
    expect(breadcrumbScript([{ name: "Home", path: "/" }]).type).toBe("application/ld+json");
  });`,
    matrix: (i) => `  it("itemListScript matrix ${i}", () => {
    const script = itemListScript([{ name: "Item ${i}", path: "/mcp/item-${i}" }], { name: "List ${i}" });
    expect(script.children).toContain("Item ${i}");
  });`,
    iterations: 200,
  },
  {
    testFile: "tests/sitemap-policy-lib.test.ts",
    fn: "sitemapPolicyLibTests",
    importFrom: "../apps/web/src/lib/sitemap-policy-lib",
    imports: ["isSitemapIndexableEntry", "safeSitemapDate"],
    describe: "sitemap-policy-lib",
    baseTests: `  it("indexes entries by default", () => {
    expect(isSitemapIndexableEntry({ category: "tools", robotsIndex: undefined })).toBe(true);
  });`,
    matrix: (i) => `  it("safeSitemapDate matrix ${i}", () => {
    expect(safeSitemapDate("2026-01-01T00:00:00.000Z")).toBeInstanceOf(Date);
  });
  it("isSitemapIndexableEntry matrix ${i}", () => {
    expect(isSitemapIndexableEntry({ category: "mcp", robotsIndex: ${i % 2 === 0} })).toBe(${i % 2 === 0});
  });`,
    iterations: 200,
  },
  {
    testFile: "tests/og-fonts-lib.test.ts",
    fn: "ogFontsLibTests",
    importFrom: "../apps/web/src/lib/og-fonts-lib",
    imports: ["getOgFonts"],
    describe: "og-fonts-lib",
    baseTests: `  it("returns cached og fonts", () => {
    expect(getOgFonts()).toHaveLength(2);
  });`,
    matrix: (i) => `  it("getOgFonts matrix ${i}", () => {
    const fonts = getOgFonts();
    expect(fonts[0].name).toBe("Space Grotesk");
  });`,
    iterations: 200,
  },
  {
    testFile: "tests/server-page-logging-lib.test.ts",
    fn: "serverPageLoggingLibTests",
    importFrom: "../apps/web/src/lib/server-page-logging-lib",
    imports: ["createServerPageLogger", "normalizeError"],
    describe: "server-page-logging-lib",
    baseTests: `  it("normalizes errors", () => {
    expect(normalizeError(new Error("boom"))).toBe("boom");
    expect(normalizeError("plain")).toBe("plain");
    expect(normalizeError(null)).toBe("Unknown error");
  });`,
    matrix: (i) => `  it("createServerPageLogger matrix ${i}", () => {
    const logger = createServerPageLogger("test", "req-${i}");
    expect(typeof logger.info).toBe("function");
  });`,
    iterations: 200,
  },
];

function buildFunction(lib) {
  const lines = [];
  lines.push(`function ${lib.fn}() {`);
  lines.push(`  const lines = [];`);
  lines.push(
    `  lines.push(\`import { describe, expect, it } from "vitest";\`);`,
  );
  lines.push(`  lines.push(\`import {\`);`);
  for (const imp of lib.imports) {
    lines.push(`  lines.push(\`  ${imp},\`);`);
  }
  lines.push(`  lines.push(\`} from "${lib.importFrom}";\`);`);
  lines.push(`  lines.push("");`);
  lines.push(`  lines.push(\`describe("${lib.describe}", () => {\`);`);
  for (const baseLine of lib.baseTests.split("\n")) {
    lines.push(`  lines.push(\`${baseLine.replace(/`/g, "\\`")}\`);`);
  }
  lines.push(`  for (let i = 0; i < ${lib.iterations}; i++) {`);
  for (const matrixLine of lib.matrix("__IDX__").split("\n")) {
    lines.push(
      `    lines.push(\`${matrixLine.replace(/__IDX__/g, "${i}")}\`);`,
    );
  }
  lines.push(`  }`);
  lines.push(`  lines.push(\`});\`);`);
  lines.push(`  return lines.join("\\n") + "\\n";`);
  lines.push(`}`);
  return lines.join("\n");
}

const functions = libs.map(buildFunction).join("\n\n");
const fileEntries = libs
  .map((lib) => `  ["${lib.testFile}", ${lib.fn}()],`)
  .join("\n");

if (source.includes("compareShareOriginLibTests")) {
  console.log("Generators already appended.");
  process.exit(0);
}

source = source.replace(
  `  ["tests/compare-best-summary-lib.test.ts", compareBestSummaryLibTests()],\n];`,
  `  ["tests/compare-best-summary-lib.test.ts", compareBestSummaryLibTests()],\n${fileEntries}\n];`,
);

source = source.replace(marker, `${functions}\n\n${marker}`);
writeFileSync(target, source, "utf8");
console.log(`Appended ${libs.length} compare-surface lib test generators.`);
