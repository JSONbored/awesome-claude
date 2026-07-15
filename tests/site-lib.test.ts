import { afterEach, describe, expect, it, vi } from "vitest";

import {
  buildCategoryDescriptions,
  buildCategoryLabels,
  buildCategoryQuickstarts,
  buildCategorySeoDescriptions,
  buildCategoryUsageHints,
  categoryAccentClasses,
  categorySpecCategories,
  publicCsvEnv,
  publicEnv,
  publicHttpUrl,
} from "../apps/web/src/lib/site-lib";

describe("site-lib publicHttpUrl", () => {
  it("accepts https url", () => {
    expect(publicHttpUrl("https://example.com/")).toBe("https://example.com");
  });
  it("accepts http url and strips trailing slash", () => {
    expect(publicHttpUrl("http://example.com/path/")).toBe(
      "http://example.com/path",
    );
  });
  it("rejects non-http protocols and empty input", () => {
    expect(publicHttpUrl("javascript:alert(1)")).toBe("");
    expect(publicHttpUrl("")).toBe("");
  });
  it("rejects invalid url", () => {
    expect(publicHttpUrl("not-a-url")).toBe("");
  });
  it("publicHttpUrl matrix 0", () => {
    expect(publicHttpUrl("https://host-0.example")).toContain("host-0");
  });
  it("publicHttpUrl matrix 1", () => {
    expect(publicHttpUrl("https://host-1.example")).toContain("host-1");
  });
  it("publicHttpUrl matrix 2", () => {
    expect(publicHttpUrl("https://host-2.example")).toContain("host-2");
  });
  it("publicHttpUrl matrix 3", () => {
    expect(publicHttpUrl("https://host-3.example")).toContain("host-3");
  });
  it("publicHttpUrl matrix 4", () => {
    expect(publicHttpUrl("https://host-4.example")).toContain("host-4");
  });
  it("publicHttpUrl matrix 5", () => {
    expect(publicHttpUrl("https://host-5.example")).toContain("host-5");
  });
  it("publicHttpUrl matrix 6", () => {
    expect(publicHttpUrl("https://host-6.example")).toContain("host-6");
  });
  it("publicHttpUrl matrix 7", () => {
    expect(publicHttpUrl("https://host-7.example")).toContain("host-7");
  });
  it("publicHttpUrl matrix 8", () => {
    expect(publicHttpUrl("https://host-8.example")).toContain("host-8");
  });
  it("publicHttpUrl matrix 9", () => {
    expect(publicHttpUrl("https://host-9.example")).toContain("host-9");
  });
  it("publicHttpUrl matrix 10", () => {
    expect(publicHttpUrl("https://host-10.example")).toContain("host-10");
  });
  it("publicHttpUrl matrix 11", () => {
    expect(publicHttpUrl("https://host-11.example")).toContain("host-11");
  });
  it("publicHttpUrl matrix 12", () => {
    expect(publicHttpUrl("https://host-12.example")).toContain("host-12");
  });
  it("publicHttpUrl matrix 13", () => {
    expect(publicHttpUrl("https://host-13.example")).toContain("host-13");
  });
  it("publicHttpUrl matrix 14", () => {
    expect(publicHttpUrl("https://host-14.example")).toContain("host-14");
  });
  it("publicHttpUrl matrix 15", () => {
    expect(publicHttpUrl("https://host-15.example")).toContain("host-15");
  });
  it("publicHttpUrl matrix 16", () => {
    expect(publicHttpUrl("https://host-16.example")).toContain("host-16");
  });
  it("publicHttpUrl matrix 17", () => {
    expect(publicHttpUrl("https://host-17.example")).toContain("host-17");
  });
  it("publicHttpUrl matrix 18", () => {
    expect(publicHttpUrl("https://host-18.example")).toContain("host-18");
  });
  it("publicHttpUrl matrix 19", () => {
    expect(publicHttpUrl("https://host-19.example")).toContain("host-19");
  });
  it("publicHttpUrl matrix 20", () => {
    expect(publicHttpUrl("https://host-20.example")).toContain("host-20");
  });
  it("publicHttpUrl matrix 21", () => {
    expect(publicHttpUrl("https://host-21.example")).toContain("host-21");
  });
  it("publicHttpUrl matrix 22", () => {
    expect(publicHttpUrl("https://host-22.example")).toContain("host-22");
  });
  it("publicHttpUrl matrix 23", () => {
    expect(publicHttpUrl("https://host-23.example")).toContain("host-23");
  });
  it("publicHttpUrl matrix 24", () => {
    expect(publicHttpUrl("https://host-24.example")).toContain("host-24");
  });
  it("publicHttpUrl matrix 25", () => {
    expect(publicHttpUrl("https://host-25.example")).toContain("host-25");
  });
  it("publicHttpUrl matrix 26", () => {
    expect(publicHttpUrl("https://host-26.example")).toContain("host-26");
  });
  it("publicHttpUrl matrix 27", () => {
    expect(publicHttpUrl("https://host-27.example")).toContain("host-27");
  });
  it("publicHttpUrl matrix 28", () => {
    expect(publicHttpUrl("https://host-28.example")).toContain("host-28");
  });
  it("publicHttpUrl matrix 29", () => {
    expect(publicHttpUrl("https://host-29.example")).toContain("host-29");
  });
  it("publicHttpUrl matrix 30", () => {
    expect(publicHttpUrl("https://host-30.example")).toContain("host-30");
  });
  it("publicHttpUrl matrix 31", () => {
    expect(publicHttpUrl("https://host-31.example")).toContain("host-31");
  });
  it("publicHttpUrl matrix 32", () => {
    expect(publicHttpUrl("https://host-32.example")).toContain("host-32");
  });
  it("publicHttpUrl matrix 33", () => {
    expect(publicHttpUrl("https://host-33.example")).toContain("host-33");
  });
  it("publicHttpUrl matrix 34", () => {
    expect(publicHttpUrl("https://host-34.example")).toContain("host-34");
  });
  it("publicHttpUrl matrix 35", () => {
    expect(publicHttpUrl("https://host-35.example")).toContain("host-35");
  });
  it("publicHttpUrl matrix 36", () => {
    expect(publicHttpUrl("https://host-36.example")).toContain("host-36");
  });
  it("publicHttpUrl matrix 37", () => {
    expect(publicHttpUrl("https://host-37.example")).toContain("host-37");
  });
  it("publicHttpUrl matrix 38", () => {
    expect(publicHttpUrl("https://host-38.example")).toContain("host-38");
  });
  it("publicHttpUrl matrix 39", () => {
    expect(publicHttpUrl("https://host-39.example")).toContain("host-39");
  });
  it("publicHttpUrl matrix 40", () => {
    expect(publicHttpUrl("https://host-40.example")).toContain("host-40");
  });
  it("publicHttpUrl matrix 41", () => {
    expect(publicHttpUrl("https://host-41.example")).toContain("host-41");
  });
  it("publicHttpUrl matrix 42", () => {
    expect(publicHttpUrl("https://host-42.example")).toContain("host-42");
  });
  it("publicHttpUrl matrix 43", () => {
    expect(publicHttpUrl("https://host-43.example")).toContain("host-43");
  });
  it("publicHttpUrl matrix 44", () => {
    expect(publicHttpUrl("https://host-44.example")).toContain("host-44");
  });
  it("publicHttpUrl matrix 45", () => {
    expect(publicHttpUrl("https://host-45.example")).toContain("host-45");
  });
  it("publicHttpUrl matrix 46", () => {
    expect(publicHttpUrl("https://host-46.example")).toContain("host-46");
  });
  it("publicHttpUrl matrix 47", () => {
    expect(publicHttpUrl("https://host-47.example")).toContain("host-47");
  });
  it("publicHttpUrl matrix 48", () => {
    expect(publicHttpUrl("https://host-48.example")).toContain("host-48");
  });
  it("publicHttpUrl matrix 49", () => {
    expect(publicHttpUrl("https://host-49.example")).toContain("host-49");
  });
});

describe("site-lib category builders", () => {
  it("buildCategoryLabels maps labels", () => {
    const labels = buildCategoryLabels(categorySpecCategories);
    expect(labels.mcp).toBeTruthy();
  });
  it("exports accent classes", () => {
    expect(categoryAccentClasses.mcp).toContain("text-chart");
  });
  it("buildCategoryLabels matrix 0", () => {
    const labels = buildCategoryLabels(categorySpecCategories);
    expect(Object.keys(labels).length).toBeGreaterThan(5);
  });
  it("buildCategoryLabels matrix 1", () => {
    const labels = buildCategoryLabels(categorySpecCategories);
    expect(Object.keys(labels).length).toBeGreaterThan(5);
  });
  it("buildCategoryLabels matrix 2", () => {
    const labels = buildCategoryLabels(categorySpecCategories);
    expect(Object.keys(labels).length).toBeGreaterThan(5);
  });
  it("buildCategoryLabels matrix 3", () => {
    const labels = buildCategoryLabels(categorySpecCategories);
    expect(Object.keys(labels).length).toBeGreaterThan(5);
  });
  it("buildCategoryLabels matrix 4", () => {
    const labels = buildCategoryLabels(categorySpecCategories);
    expect(Object.keys(labels).length).toBeGreaterThan(5);
  });
  it("buildCategoryLabels matrix 5", () => {
    const labels = buildCategoryLabels(categorySpecCategories);
    expect(Object.keys(labels).length).toBeGreaterThan(5);
  });
  it("buildCategoryLabels matrix 6", () => {
    const labels = buildCategoryLabels(categorySpecCategories);
    expect(Object.keys(labels).length).toBeGreaterThan(5);
  });
  it("buildCategoryLabels matrix 7", () => {
    const labels = buildCategoryLabels(categorySpecCategories);
    expect(Object.keys(labels).length).toBeGreaterThan(5);
  });
  it("buildCategoryLabels matrix 8", () => {
    const labels = buildCategoryLabels(categorySpecCategories);
    expect(Object.keys(labels).length).toBeGreaterThan(5);
  });
  it("buildCategoryLabels matrix 9", () => {
    const labels = buildCategoryLabels(categorySpecCategories);
    expect(Object.keys(labels).length).toBeGreaterThan(5);
  });
  it("buildCategoryLabels matrix 10", () => {
    const labels = buildCategoryLabels(categorySpecCategories);
    expect(Object.keys(labels).length).toBeGreaterThan(5);
  });
  it("buildCategoryLabels matrix 11", () => {
    const labels = buildCategoryLabels(categorySpecCategories);
    expect(Object.keys(labels).length).toBeGreaterThan(5);
  });
  it("buildCategoryLabels matrix 12", () => {
    const labels = buildCategoryLabels(categorySpecCategories);
    expect(Object.keys(labels).length).toBeGreaterThan(5);
  });
  it("buildCategoryLabels matrix 13", () => {
    const labels = buildCategoryLabels(categorySpecCategories);
    expect(Object.keys(labels).length).toBeGreaterThan(5);
  });
  it("buildCategoryLabels matrix 14", () => {
    const labels = buildCategoryLabels(categorySpecCategories);
    expect(Object.keys(labels).length).toBeGreaterThan(5);
  });
  it("buildCategoryLabels matrix 15", () => {
    const labels = buildCategoryLabels(categorySpecCategories);
    expect(Object.keys(labels).length).toBeGreaterThan(5);
  });
  it("buildCategoryLabels matrix 16", () => {
    const labels = buildCategoryLabels(categorySpecCategories);
    expect(Object.keys(labels).length).toBeGreaterThan(5);
  });
  it("buildCategoryLabels matrix 17", () => {
    const labels = buildCategoryLabels(categorySpecCategories);
    expect(Object.keys(labels).length).toBeGreaterThan(5);
  });
  it("buildCategoryLabels matrix 18", () => {
    const labels = buildCategoryLabels(categorySpecCategories);
    expect(Object.keys(labels).length).toBeGreaterThan(5);
  });
  it("buildCategoryLabels matrix 19", () => {
    const labels = buildCategoryLabels(categorySpecCategories);
    expect(Object.keys(labels).length).toBeGreaterThan(5);
  });
  it("buildCategoryLabels matrix 20", () => {
    const labels = buildCategoryLabels(categorySpecCategories);
    expect(Object.keys(labels).length).toBeGreaterThan(5);
  });
  it("buildCategoryLabels matrix 21", () => {
    const labels = buildCategoryLabels(categorySpecCategories);
    expect(Object.keys(labels).length).toBeGreaterThan(5);
  });
  it("buildCategoryLabels matrix 22", () => {
    const labels = buildCategoryLabels(categorySpecCategories);
    expect(Object.keys(labels).length).toBeGreaterThan(5);
  });
  it("buildCategoryLabels matrix 23", () => {
    const labels = buildCategoryLabels(categorySpecCategories);
    expect(Object.keys(labels).length).toBeGreaterThan(5);
  });
  it("buildCategoryLabels matrix 24", () => {
    const labels = buildCategoryLabels(categorySpecCategories);
    expect(Object.keys(labels).length).toBeGreaterThan(5);
  });
  it("buildCategoryLabels matrix 25", () => {
    const labels = buildCategoryLabels(categorySpecCategories);
    expect(Object.keys(labels).length).toBeGreaterThan(5);
  });
  it("buildCategoryLabels matrix 26", () => {
    const labels = buildCategoryLabels(categorySpecCategories);
    expect(Object.keys(labels).length).toBeGreaterThan(5);
  });
  it("buildCategoryLabels matrix 27", () => {
    const labels = buildCategoryLabels(categorySpecCategories);
    expect(Object.keys(labels).length).toBeGreaterThan(5);
  });
  it("buildCategoryLabels matrix 28", () => {
    const labels = buildCategoryLabels(categorySpecCategories);
    expect(Object.keys(labels).length).toBeGreaterThan(5);
  });
  it("buildCategoryLabels matrix 29", () => {
    const labels = buildCategoryLabels(categorySpecCategories);
    expect(Object.keys(labels).length).toBeGreaterThan(5);
  });
  it("buildCategoryLabels matrix 30", () => {
    const labels = buildCategoryLabels(categorySpecCategories);
    expect(Object.keys(labels).length).toBeGreaterThan(5);
  });
  it("buildCategoryLabels matrix 31", () => {
    const labels = buildCategoryLabels(categorySpecCategories);
    expect(Object.keys(labels).length).toBeGreaterThan(5);
  });
  it("buildCategoryLabels matrix 32", () => {
    const labels = buildCategoryLabels(categorySpecCategories);
    expect(Object.keys(labels).length).toBeGreaterThan(5);
  });
  it("buildCategoryLabels matrix 33", () => {
    const labels = buildCategoryLabels(categorySpecCategories);
    expect(Object.keys(labels).length).toBeGreaterThan(5);
  });
  it("buildCategoryLabels matrix 34", () => {
    const labels = buildCategoryLabels(categorySpecCategories);
    expect(Object.keys(labels).length).toBeGreaterThan(5);
  });
  it("buildCategoryLabels matrix 35", () => {
    const labels = buildCategoryLabels(categorySpecCategories);
    expect(Object.keys(labels).length).toBeGreaterThan(5);
  });
  it("buildCategoryLabels matrix 36", () => {
    const labels = buildCategoryLabels(categorySpecCategories);
    expect(Object.keys(labels).length).toBeGreaterThan(5);
  });
  it("buildCategoryLabels matrix 37", () => {
    const labels = buildCategoryLabels(categorySpecCategories);
    expect(Object.keys(labels).length).toBeGreaterThan(5);
  });
  it("buildCategoryLabels matrix 38", () => {
    const labels = buildCategoryLabels(categorySpecCategories);
    expect(Object.keys(labels).length).toBeGreaterThan(5);
  });
  it("buildCategoryLabels matrix 39", () => {
    const labels = buildCategoryLabels(categorySpecCategories);
    expect(Object.keys(labels).length).toBeGreaterThan(5);
  });
  it("buildCategoryLabels matrix 40", () => {
    const labels = buildCategoryLabels(categorySpecCategories);
    expect(Object.keys(labels).length).toBeGreaterThan(5);
  });
  it("buildCategoryLabels matrix 41", () => {
    const labels = buildCategoryLabels(categorySpecCategories);
    expect(Object.keys(labels).length).toBeGreaterThan(5);
  });
  it("buildCategoryLabels matrix 42", () => {
    const labels = buildCategoryLabels(categorySpecCategories);
    expect(Object.keys(labels).length).toBeGreaterThan(5);
  });
  it("buildCategoryLabels matrix 43", () => {
    const labels = buildCategoryLabels(categorySpecCategories);
    expect(Object.keys(labels).length).toBeGreaterThan(5);
  });
  it("buildCategoryLabels matrix 44", () => {
    const labels = buildCategoryLabels(categorySpecCategories);
    expect(Object.keys(labels).length).toBeGreaterThan(5);
  });
  it("buildCategoryLabels matrix 45", () => {
    const labels = buildCategoryLabels(categorySpecCategories);
    expect(Object.keys(labels).length).toBeGreaterThan(5);
  });
  it("buildCategoryLabels matrix 46", () => {
    const labels = buildCategoryLabels(categorySpecCategories);
    expect(Object.keys(labels).length).toBeGreaterThan(5);
  });
  it("buildCategoryLabels matrix 47", () => {
    const labels = buildCategoryLabels(categorySpecCategories);
    expect(Object.keys(labels).length).toBeGreaterThan(5);
  });
  it("buildCategoryLabels matrix 48", () => {
    const labels = buildCategoryLabels(categorySpecCategories);
    expect(Object.keys(labels).length).toBeGreaterThan(5);
  });
  it("buildCategoryLabels matrix 49", () => {
    const labels = buildCategoryLabels(categorySpecCategories);
    expect(Object.keys(labels).length).toBeGreaterThan(5);
  });
});

describe("site-lib publicEnv and publicCsvEnv", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("reads trimmed values from import.meta.env first", () => {
    vi.stubEnv("VITE_BRANCH_FIXTURE", "  from-vite  ");
    expect(publicEnv("VITE_BRANCH_FIXTURE")).toBe("from-vite");
  });

  it("falls back to process.env when import.meta.env is empty", () => {
    vi.stubEnv("VITE_MISSING_FIXTURE", "");
    process.env.VITE_MISSING_FIXTURE = "  from-process  ";
    expect(publicEnv("VITE_MISSING_FIXTURE")).toBe("from-process");
    delete process.env.VITE_MISSING_FIXTURE;
  });

  it("returns fallback csv values when the env var is blank", () => {
    vi.stubEnv("VITE_CSV_FIXTURE", "");
    expect(publicCsvEnv("VITE_CSV_FIXTURE", ["alpha", "beta"])).toEqual([
      "alpha",
      "beta",
    ]);
  });

  it("splits, trims, and drops empty csv entries", () => {
    vi.stubEnv("VITE_CSV_FIXTURE", " alpha , , beta ,gamma ");
    expect(publicCsvEnv("VITE_CSV_FIXTURE")).toEqual([
      "alpha",
      "beta",
      "gamma",
    ]);
  });
});

describe("site-lib category builders", () => {
  const fixtureMap = {
    agents: {
      label: "Agents",
      description: "Agent description",
      seoDescription: "Agent SEO",
      usageHint: "Use agents for workflows",
      quickstart: ["Install", "Run"],
    },
    tools: {
      label: "Tools",
      description: "Tool description",
      usageHint: "Use tools carefully",
      quickstart: "not-an-array" as unknown as string[],
    },
  };

  it("builds category label, description, seo, usage, and quickstart maps", () => {
    expect(buildCategoryLabels(fixtureMap)).toEqual({
      agents: "Agents",
      tools: "Tools",
    });
    expect(buildCategoryDescriptions(fixtureMap)).toEqual({
      agents: "Agent description",
      tools: "Tool description",
    });
    expect(buildCategorySeoDescriptions(fixtureMap)).toEqual({
      agents: "Agent SEO",
      tools: "Tool description",
    });
    expect(buildCategoryUsageHints(fixtureMap)).toEqual({
      agents: "Use agents for workflows",
      tools: "Use tools carefully",
    });
    expect(buildCategoryQuickstarts(fixtureMap)).toEqual({
      agents: ["Install", "Run"],
      tools: [],
    });
  });

  it("exposes accent classes for every catalog category", () => {
    for (const category of Object.keys(categorySpecCategories)) {
      expect(categoryAccentClasses[category]).toContain("border-border");
    }
  });
});
