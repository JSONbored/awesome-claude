import { describe, expect, it } from "vitest";

import { SITE_URL } from "../packages/mcp/src/platforms.js";
import {
  toTrendingEntry,
  toJobEntry,
} from "../packages/mcp/src/registry-discovery-projection-lib.js";

function makeTrendingEntry(overrides = {}) {
  return {
    category: "mcp",
    slug: "browser-bridge",
    title: "Browser Bridge",
    description: "Runs Playwright automation.",
    platforms: ["claude-code"],
    tags: ["browser-automation"],
    dateAdded: "2026-01-15",
    score: 42,
    reasons: ["recent_activity"],
    trustSignals: { sourceStatus: "available" },
    ...overrides,
  };
}

function makeJob(overrides = {}) {
  return {
    id: "job-123",
    slug: "job-slug",
    title: "Senior MCP Engineer",
    company: "HeyClaude",
    location: "Remote",
    type: "full-time",
    isRemote: true,
    tier: "featured",
    applyUrl: "https://jobs.example.com/apply",
    sourceLabel: "HeyClaude Jobs",
    postedAt: "2026-06-01",
    labels: ["mcp", "typescript"],
    ...overrides,
  };
}

describe("registry-discovery-projection-lib toTrendingEntry", () => {
  it("projects stable trending shape", () => {
    const entry = makeTrendingEntry();
    expect(toTrendingEntry(entry)).toEqual({
      key: "mcp:browser-bridge",
      category: "mcp",
      slug: "browser-bridge",
      title: "Browser Bridge",
      description: "Runs Playwright automation.",
      canonicalUrl: `${SITE_URL}/entry/mcp/browser-bridge`,
      platforms: ["claude-code"],
      tags: ["browser-automation"],
      dateAdded: "2026-01-15",
      score: 42,
      reasons: ["recent_activity"],
      trustSignals: { sourceStatus: "available" },
    });
  });
  it("defaults missing arrays and non-numeric score", () => {
    const entry = makeTrendingEntry({
      platforms: null,
      tags: undefined,
      score: "high",
      reasons: "not-array",
      trustSignals: undefined,
    });
    const projected = toTrendingEntry(entry);
    expect(projected.platforms).toEqual([]);
    expect(projected.tags).toEqual([]);
    expect(projected.score).toBe(0);
    expect(projected.reasons).toEqual([]);
    expect(projected.trustSignals).toEqual({ sourceStatus: "missing" });
  });

  it("toTrendingEntry agents variant 0", () => {
    const entry = makeTrendingEntry({
      category: "agents",
      slug: "agents-trend-0",
      title: "agents Trend 0",
      score: 0,
    });
    const projected = toTrendingEntry(entry);
    expect(projected.key).toBe("agents:agents-trend-0");
    expect(projected.category).toBe("agents");
    expect(projected.slug).toBe("agents-trend-0");
    expect(projected.canonicalUrl).toContain("agents-trend-0");
    expect(projected.score).toBe(0);
  });
  it("toTrendingEntry agents variant 1", () => {
    const entry = makeTrendingEntry({
      category: "agents",
      slug: "agents-trend-1",
      title: "agents Trend 1",
      score: 10,
    });
    const projected = toTrendingEntry(entry);
    expect(projected.key).toBe("agents:agents-trend-1");
    expect(projected.category).toBe("agents");
    expect(projected.slug).toBe("agents-trend-1");
    expect(projected.canonicalUrl).toContain("agents-trend-1");
    expect(projected.score).toBe(10);
  });
  it("toTrendingEntry agents variant 2", () => {
    const entry = makeTrendingEntry({
      category: "agents",
      slug: "agents-trend-2",
      title: "agents Trend 2",
      score: 20,
    });
    const projected = toTrendingEntry(entry);
    expect(projected.key).toBe("agents:agents-trend-2");
    expect(projected.category).toBe("agents");
    expect(projected.slug).toBe("agents-trend-2");
    expect(projected.canonicalUrl).toContain("agents-trend-2");
    expect(projected.score).toBe(20);
  });
  it("toTrendingEntry agents variant 3", () => {
    const entry = makeTrendingEntry({
      category: "agents",
      slug: "agents-trend-3",
      title: "agents Trend 3",
      score: 30,
    });
    const projected = toTrendingEntry(entry);
    expect(projected.key).toBe("agents:agents-trend-3");
    expect(projected.category).toBe("agents");
    expect(projected.slug).toBe("agents-trend-3");
    expect(projected.canonicalUrl).toContain("agents-trend-3");
    expect(projected.score).toBe(30);
  });
  it("toTrendingEntry agents variant 4", () => {
    const entry = makeTrendingEntry({
      category: "agents",
      slug: "agents-trend-4",
      title: "agents Trend 4",
      score: 40,
    });
    const projected = toTrendingEntry(entry);
    expect(projected.key).toBe("agents:agents-trend-4");
    expect(projected.category).toBe("agents");
    expect(projected.slug).toBe("agents-trend-4");
    expect(projected.canonicalUrl).toContain("agents-trend-4");
    expect(projected.score).toBe(40);
  });
  it("toTrendingEntry agents variant 5", () => {
    const entry = makeTrendingEntry({
      category: "agents",
      slug: "agents-trend-5",
      title: "agents Trend 5",
      score: 50,
    });
    const projected = toTrendingEntry(entry);
    expect(projected.key).toBe("agents:agents-trend-5");
    expect(projected.category).toBe("agents");
    expect(projected.slug).toBe("agents-trend-5");
    expect(projected.canonicalUrl).toContain("agents-trend-5");
    expect(projected.score).toBe(50);
  });
  it("toTrendingEntry agents variant 6", () => {
    const entry = makeTrendingEntry({
      category: "agents",
      slug: "agents-trend-6",
      title: "agents Trend 6",
      score: 60,
    });
    const projected = toTrendingEntry(entry);
    expect(projected.key).toBe("agents:agents-trend-6");
    expect(projected.category).toBe("agents");
    expect(projected.slug).toBe("agents-trend-6");
    expect(projected.canonicalUrl).toContain("agents-trend-6");
    expect(projected.score).toBe(60);
  });
  it("toTrendingEntry agents variant 7", () => {
    const entry = makeTrendingEntry({
      category: "agents",
      slug: "agents-trend-7",
      title: "agents Trend 7",
      score: 70,
    });
    const projected = toTrendingEntry(entry);
    expect(projected.key).toBe("agents:agents-trend-7");
    expect(projected.category).toBe("agents");
    expect(projected.slug).toBe("agents-trend-7");
    expect(projected.canonicalUrl).toContain("agents-trend-7");
    expect(projected.score).toBe(70);
  });
  it("toTrendingEntry agents variant 8", () => {
    const entry = makeTrendingEntry({
      category: "agents",
      slug: "agents-trend-8",
      title: "agents Trend 8",
      score: 80,
    });
    const projected = toTrendingEntry(entry);
    expect(projected.key).toBe("agents:agents-trend-8");
    expect(projected.category).toBe("agents");
    expect(projected.slug).toBe("agents-trend-8");
    expect(projected.canonicalUrl).toContain("agents-trend-8");
    expect(projected.score).toBe(80);
  });
  it("toTrendingEntry agents variant 9", () => {
    const entry = makeTrendingEntry({
      category: "agents",
      slug: "agents-trend-9",
      title: "agents Trend 9",
      score: 90,
    });
    const projected = toTrendingEntry(entry);
    expect(projected.key).toBe("agents:agents-trend-9");
    expect(projected.category).toBe("agents");
    expect(projected.slug).toBe("agents-trend-9");
    expect(projected.canonicalUrl).toContain("agents-trend-9");
    expect(projected.score).toBe(90);
  });
  it("toTrendingEntry agents variant 10", () => {
    const entry = makeTrendingEntry({
      category: "agents",
      slug: "agents-trend-10",
      title: "agents Trend 10",
      score: 100,
    });
    const projected = toTrendingEntry(entry);
    expect(projected.key).toBe("agents:agents-trend-10");
    expect(projected.category).toBe("agents");
    expect(projected.slug).toBe("agents-trend-10");
    expect(projected.canonicalUrl).toContain("agents-trend-10");
    expect(projected.score).toBe(100);
  });
  it("toTrendingEntry agents variant 11", () => {
    const entry = makeTrendingEntry({
      category: "agents",
      slug: "agents-trend-11",
      title: "agents Trend 11",
      score: 110,
    });
    const projected = toTrendingEntry(entry);
    expect(projected.key).toBe("agents:agents-trend-11");
    expect(projected.category).toBe("agents");
    expect(projected.slug).toBe("agents-trend-11");
    expect(projected.canonicalUrl).toContain("agents-trend-11");
    expect(projected.score).toBe(110);
  });
  it("toTrendingEntry mcp variant 0", () => {
    const entry = makeTrendingEntry({
      category: "mcp",
      slug: "mcp-trend-0",
      title: "mcp Trend 0",
      score: 0,
    });
    const projected = toTrendingEntry(entry);
    expect(projected.key).toBe("mcp:mcp-trend-0");
    expect(projected.category).toBe("mcp");
    expect(projected.slug).toBe("mcp-trend-0");
    expect(projected.canonicalUrl).toContain("mcp-trend-0");
    expect(projected.score).toBe(0);
  });
  it("toTrendingEntry mcp variant 1", () => {
    const entry = makeTrendingEntry({
      category: "mcp",
      slug: "mcp-trend-1",
      title: "mcp Trend 1",
      score: 10,
    });
    const projected = toTrendingEntry(entry);
    expect(projected.key).toBe("mcp:mcp-trend-1");
    expect(projected.category).toBe("mcp");
    expect(projected.slug).toBe("mcp-trend-1");
    expect(projected.canonicalUrl).toContain("mcp-trend-1");
    expect(projected.score).toBe(10);
  });
  it("toTrendingEntry mcp variant 2", () => {
    const entry = makeTrendingEntry({
      category: "mcp",
      slug: "mcp-trend-2",
      title: "mcp Trend 2",
      score: 20,
    });
    const projected = toTrendingEntry(entry);
    expect(projected.key).toBe("mcp:mcp-trend-2");
    expect(projected.category).toBe("mcp");
    expect(projected.slug).toBe("mcp-trend-2");
    expect(projected.canonicalUrl).toContain("mcp-trend-2");
    expect(projected.score).toBe(20);
  });
  it("toTrendingEntry mcp variant 3", () => {
    const entry = makeTrendingEntry({
      category: "mcp",
      slug: "mcp-trend-3",
      title: "mcp Trend 3",
      score: 30,
    });
    const projected = toTrendingEntry(entry);
    expect(projected.key).toBe("mcp:mcp-trend-3");
    expect(projected.category).toBe("mcp");
    expect(projected.slug).toBe("mcp-trend-3");
    expect(projected.canonicalUrl).toContain("mcp-trend-3");
    expect(projected.score).toBe(30);
  });
  it("toTrendingEntry mcp variant 4", () => {
    const entry = makeTrendingEntry({
      category: "mcp",
      slug: "mcp-trend-4",
      title: "mcp Trend 4",
      score: 40,
    });
    const projected = toTrendingEntry(entry);
    expect(projected.key).toBe("mcp:mcp-trend-4");
    expect(projected.category).toBe("mcp");
    expect(projected.slug).toBe("mcp-trend-4");
    expect(projected.canonicalUrl).toContain("mcp-trend-4");
    expect(projected.score).toBe(40);
  });
  it("toTrendingEntry mcp variant 5", () => {
    const entry = makeTrendingEntry({
      category: "mcp",
      slug: "mcp-trend-5",
      title: "mcp Trend 5",
      score: 50,
    });
    const projected = toTrendingEntry(entry);
    expect(projected.key).toBe("mcp:mcp-trend-5");
    expect(projected.category).toBe("mcp");
    expect(projected.slug).toBe("mcp-trend-5");
    expect(projected.canonicalUrl).toContain("mcp-trend-5");
    expect(projected.score).toBe(50);
  });
  it("toTrendingEntry mcp variant 6", () => {
    const entry = makeTrendingEntry({
      category: "mcp",
      slug: "mcp-trend-6",
      title: "mcp Trend 6",
      score: 60,
    });
    const projected = toTrendingEntry(entry);
    expect(projected.key).toBe("mcp:mcp-trend-6");
    expect(projected.category).toBe("mcp");
    expect(projected.slug).toBe("mcp-trend-6");
    expect(projected.canonicalUrl).toContain("mcp-trend-6");
    expect(projected.score).toBe(60);
  });
  it("toTrendingEntry mcp variant 7", () => {
    const entry = makeTrendingEntry({
      category: "mcp",
      slug: "mcp-trend-7",
      title: "mcp Trend 7",
      score: 70,
    });
    const projected = toTrendingEntry(entry);
    expect(projected.key).toBe("mcp:mcp-trend-7");
    expect(projected.category).toBe("mcp");
    expect(projected.slug).toBe("mcp-trend-7");
    expect(projected.canonicalUrl).toContain("mcp-trend-7");
    expect(projected.score).toBe(70);
  });
  it("toTrendingEntry mcp variant 8", () => {
    const entry = makeTrendingEntry({
      category: "mcp",
      slug: "mcp-trend-8",
      title: "mcp Trend 8",
      score: 80,
    });
    const projected = toTrendingEntry(entry);
    expect(projected.key).toBe("mcp:mcp-trend-8");
    expect(projected.category).toBe("mcp");
    expect(projected.slug).toBe("mcp-trend-8");
    expect(projected.canonicalUrl).toContain("mcp-trend-8");
    expect(projected.score).toBe(80);
  });
  it("toTrendingEntry mcp variant 9", () => {
    const entry = makeTrendingEntry({
      category: "mcp",
      slug: "mcp-trend-9",
      title: "mcp Trend 9",
      score: 90,
    });
    const projected = toTrendingEntry(entry);
    expect(projected.key).toBe("mcp:mcp-trend-9");
    expect(projected.category).toBe("mcp");
    expect(projected.slug).toBe("mcp-trend-9");
    expect(projected.canonicalUrl).toContain("mcp-trend-9");
    expect(projected.score).toBe(90);
  });
  it("toTrendingEntry mcp variant 10", () => {
    const entry = makeTrendingEntry({
      category: "mcp",
      slug: "mcp-trend-10",
      title: "mcp Trend 10",
      score: 100,
    });
    const projected = toTrendingEntry(entry);
    expect(projected.key).toBe("mcp:mcp-trend-10");
    expect(projected.category).toBe("mcp");
    expect(projected.slug).toBe("mcp-trend-10");
    expect(projected.canonicalUrl).toContain("mcp-trend-10");
    expect(projected.score).toBe(100);
  });
  it("toTrendingEntry mcp variant 11", () => {
    const entry = makeTrendingEntry({
      category: "mcp",
      slug: "mcp-trend-11",
      title: "mcp Trend 11",
      score: 110,
    });
    const projected = toTrendingEntry(entry);
    expect(projected.key).toBe("mcp:mcp-trend-11");
    expect(projected.category).toBe("mcp");
    expect(projected.slug).toBe("mcp-trend-11");
    expect(projected.canonicalUrl).toContain("mcp-trend-11");
    expect(projected.score).toBe(110);
  });
  it("toTrendingEntry tools variant 0", () => {
    const entry = makeTrendingEntry({
      category: "tools",
      slug: "tools-trend-0",
      title: "tools Trend 0",
      score: 0,
    });
    const projected = toTrendingEntry(entry);
    expect(projected.key).toBe("tools:tools-trend-0");
    expect(projected.category).toBe("tools");
    expect(projected.slug).toBe("tools-trend-0");
    expect(projected.canonicalUrl).toContain("tools-trend-0");
    expect(projected.score).toBe(0);
  });
  it("toTrendingEntry tools variant 1", () => {
    const entry = makeTrendingEntry({
      category: "tools",
      slug: "tools-trend-1",
      title: "tools Trend 1",
      score: 10,
    });
    const projected = toTrendingEntry(entry);
    expect(projected.key).toBe("tools:tools-trend-1");
    expect(projected.category).toBe("tools");
    expect(projected.slug).toBe("tools-trend-1");
    expect(projected.canonicalUrl).toContain("tools-trend-1");
    expect(projected.score).toBe(10);
  });
  it("toTrendingEntry tools variant 2", () => {
    const entry = makeTrendingEntry({
      category: "tools",
      slug: "tools-trend-2",
      title: "tools Trend 2",
      score: 20,
    });
    const projected = toTrendingEntry(entry);
    expect(projected.key).toBe("tools:tools-trend-2");
    expect(projected.category).toBe("tools");
    expect(projected.slug).toBe("tools-trend-2");
    expect(projected.canonicalUrl).toContain("tools-trend-2");
    expect(projected.score).toBe(20);
  });
  it("toTrendingEntry tools variant 3", () => {
    const entry = makeTrendingEntry({
      category: "tools",
      slug: "tools-trend-3",
      title: "tools Trend 3",
      score: 30,
    });
    const projected = toTrendingEntry(entry);
    expect(projected.key).toBe("tools:tools-trend-3");
    expect(projected.category).toBe("tools");
    expect(projected.slug).toBe("tools-trend-3");
    expect(projected.canonicalUrl).toContain("tools-trend-3");
    expect(projected.score).toBe(30);
  });
  it("toTrendingEntry tools variant 4", () => {
    const entry = makeTrendingEntry({
      category: "tools",
      slug: "tools-trend-4",
      title: "tools Trend 4",
      score: 40,
    });
    const projected = toTrendingEntry(entry);
    expect(projected.key).toBe("tools:tools-trend-4");
    expect(projected.category).toBe("tools");
    expect(projected.slug).toBe("tools-trend-4");
    expect(projected.canonicalUrl).toContain("tools-trend-4");
    expect(projected.score).toBe(40);
  });
  it("toTrendingEntry tools variant 5", () => {
    const entry = makeTrendingEntry({
      category: "tools",
      slug: "tools-trend-5",
      title: "tools Trend 5",
      score: 50,
    });
    const projected = toTrendingEntry(entry);
    expect(projected.key).toBe("tools:tools-trend-5");
    expect(projected.category).toBe("tools");
    expect(projected.slug).toBe("tools-trend-5");
    expect(projected.canonicalUrl).toContain("tools-trend-5");
    expect(projected.score).toBe(50);
  });
  it("toTrendingEntry tools variant 6", () => {
    const entry = makeTrendingEntry({
      category: "tools",
      slug: "tools-trend-6",
      title: "tools Trend 6",
      score: 60,
    });
    const projected = toTrendingEntry(entry);
    expect(projected.key).toBe("tools:tools-trend-6");
    expect(projected.category).toBe("tools");
    expect(projected.slug).toBe("tools-trend-6");
    expect(projected.canonicalUrl).toContain("tools-trend-6");
    expect(projected.score).toBe(60);
  });
  it("toTrendingEntry tools variant 7", () => {
    const entry = makeTrendingEntry({
      category: "tools",
      slug: "tools-trend-7",
      title: "tools Trend 7",
      score: 70,
    });
    const projected = toTrendingEntry(entry);
    expect(projected.key).toBe("tools:tools-trend-7");
    expect(projected.category).toBe("tools");
    expect(projected.slug).toBe("tools-trend-7");
    expect(projected.canonicalUrl).toContain("tools-trend-7");
    expect(projected.score).toBe(70);
  });
  it("toTrendingEntry tools variant 8", () => {
    const entry = makeTrendingEntry({
      category: "tools",
      slug: "tools-trend-8",
      title: "tools Trend 8",
      score: 80,
    });
    const projected = toTrendingEntry(entry);
    expect(projected.key).toBe("tools:tools-trend-8");
    expect(projected.category).toBe("tools");
    expect(projected.slug).toBe("tools-trend-8");
    expect(projected.canonicalUrl).toContain("tools-trend-8");
    expect(projected.score).toBe(80);
  });
  it("toTrendingEntry tools variant 9", () => {
    const entry = makeTrendingEntry({
      category: "tools",
      slug: "tools-trend-9",
      title: "tools Trend 9",
      score: 90,
    });
    const projected = toTrendingEntry(entry);
    expect(projected.key).toBe("tools:tools-trend-9");
    expect(projected.category).toBe("tools");
    expect(projected.slug).toBe("tools-trend-9");
    expect(projected.canonicalUrl).toContain("tools-trend-9");
    expect(projected.score).toBe(90);
  });
  it("toTrendingEntry tools variant 10", () => {
    const entry = makeTrendingEntry({
      category: "tools",
      slug: "tools-trend-10",
      title: "tools Trend 10",
      score: 100,
    });
    const projected = toTrendingEntry(entry);
    expect(projected.key).toBe("tools:tools-trend-10");
    expect(projected.category).toBe("tools");
    expect(projected.slug).toBe("tools-trend-10");
    expect(projected.canonicalUrl).toContain("tools-trend-10");
    expect(projected.score).toBe(100);
  });
  it("toTrendingEntry tools variant 11", () => {
    const entry = makeTrendingEntry({
      category: "tools",
      slug: "tools-trend-11",
      title: "tools Trend 11",
      score: 110,
    });
    const projected = toTrendingEntry(entry);
    expect(projected.key).toBe("tools:tools-trend-11");
    expect(projected.category).toBe("tools");
    expect(projected.slug).toBe("tools-trend-11");
    expect(projected.canonicalUrl).toContain("tools-trend-11");
    expect(projected.score).toBe(110);
  });
  it("toTrendingEntry skills variant 0", () => {
    const entry = makeTrendingEntry({
      category: "skills",
      slug: "skills-trend-0",
      title: "skills Trend 0",
      score: 0,
    });
    const projected = toTrendingEntry(entry);
    expect(projected.key).toBe("skills:skills-trend-0");
    expect(projected.category).toBe("skills");
    expect(projected.slug).toBe("skills-trend-0");
    expect(projected.canonicalUrl).toContain("skills-trend-0");
    expect(projected.score).toBe(0);
  });
  it("toTrendingEntry skills variant 1", () => {
    const entry = makeTrendingEntry({
      category: "skills",
      slug: "skills-trend-1",
      title: "skills Trend 1",
      score: 10,
    });
    const projected = toTrendingEntry(entry);
    expect(projected.key).toBe("skills:skills-trend-1");
    expect(projected.category).toBe("skills");
    expect(projected.slug).toBe("skills-trend-1");
    expect(projected.canonicalUrl).toContain("skills-trend-1");
    expect(projected.score).toBe(10);
  });
  it("toTrendingEntry skills variant 2", () => {
    const entry = makeTrendingEntry({
      category: "skills",
      slug: "skills-trend-2",
      title: "skills Trend 2",
      score: 20,
    });
    const projected = toTrendingEntry(entry);
    expect(projected.key).toBe("skills:skills-trend-2");
    expect(projected.category).toBe("skills");
    expect(projected.slug).toBe("skills-trend-2");
    expect(projected.canonicalUrl).toContain("skills-trend-2");
    expect(projected.score).toBe(20);
  });
  it("toTrendingEntry skills variant 3", () => {
    const entry = makeTrendingEntry({
      category: "skills",
      slug: "skills-trend-3",
      title: "skills Trend 3",
      score: 30,
    });
    const projected = toTrendingEntry(entry);
    expect(projected.key).toBe("skills:skills-trend-3");
    expect(projected.category).toBe("skills");
    expect(projected.slug).toBe("skills-trend-3");
    expect(projected.canonicalUrl).toContain("skills-trend-3");
    expect(projected.score).toBe(30);
  });
  it("toTrendingEntry skills variant 4", () => {
    const entry = makeTrendingEntry({
      category: "skills",
      slug: "skills-trend-4",
      title: "skills Trend 4",
      score: 40,
    });
    const projected = toTrendingEntry(entry);
    expect(projected.key).toBe("skills:skills-trend-4");
    expect(projected.category).toBe("skills");
    expect(projected.slug).toBe("skills-trend-4");
    expect(projected.canonicalUrl).toContain("skills-trend-4");
    expect(projected.score).toBe(40);
  });
  it("toTrendingEntry skills variant 5", () => {
    const entry = makeTrendingEntry({
      category: "skills",
      slug: "skills-trend-5",
      title: "skills Trend 5",
      score: 50,
    });
    const projected = toTrendingEntry(entry);
    expect(projected.key).toBe("skills:skills-trend-5");
    expect(projected.category).toBe("skills");
    expect(projected.slug).toBe("skills-trend-5");
    expect(projected.canonicalUrl).toContain("skills-trend-5");
    expect(projected.score).toBe(50);
  });
  it("toTrendingEntry skills variant 6", () => {
    const entry = makeTrendingEntry({
      category: "skills",
      slug: "skills-trend-6",
      title: "skills Trend 6",
      score: 60,
    });
    const projected = toTrendingEntry(entry);
    expect(projected.key).toBe("skills:skills-trend-6");
    expect(projected.category).toBe("skills");
    expect(projected.slug).toBe("skills-trend-6");
    expect(projected.canonicalUrl).toContain("skills-trend-6");
    expect(projected.score).toBe(60);
  });
  it("toTrendingEntry skills variant 7", () => {
    const entry = makeTrendingEntry({
      category: "skills",
      slug: "skills-trend-7",
      title: "skills Trend 7",
      score: 70,
    });
    const projected = toTrendingEntry(entry);
    expect(projected.key).toBe("skills:skills-trend-7");
    expect(projected.category).toBe("skills");
    expect(projected.slug).toBe("skills-trend-7");
    expect(projected.canonicalUrl).toContain("skills-trend-7");
    expect(projected.score).toBe(70);
  });
  it("toTrendingEntry skills variant 8", () => {
    const entry = makeTrendingEntry({
      category: "skills",
      slug: "skills-trend-8",
      title: "skills Trend 8",
      score: 80,
    });
    const projected = toTrendingEntry(entry);
    expect(projected.key).toBe("skills:skills-trend-8");
    expect(projected.category).toBe("skills");
    expect(projected.slug).toBe("skills-trend-8");
    expect(projected.canonicalUrl).toContain("skills-trend-8");
    expect(projected.score).toBe(80);
  });
  it("toTrendingEntry skills variant 9", () => {
    const entry = makeTrendingEntry({
      category: "skills",
      slug: "skills-trend-9",
      title: "skills Trend 9",
      score: 90,
    });
    const projected = toTrendingEntry(entry);
    expect(projected.key).toBe("skills:skills-trend-9");
    expect(projected.category).toBe("skills");
    expect(projected.slug).toBe("skills-trend-9");
    expect(projected.canonicalUrl).toContain("skills-trend-9");
    expect(projected.score).toBe(90);
  });
  it("toTrendingEntry skills variant 10", () => {
    const entry = makeTrendingEntry({
      category: "skills",
      slug: "skills-trend-10",
      title: "skills Trend 10",
      score: 100,
    });
    const projected = toTrendingEntry(entry);
    expect(projected.key).toBe("skills:skills-trend-10");
    expect(projected.category).toBe("skills");
    expect(projected.slug).toBe("skills-trend-10");
    expect(projected.canonicalUrl).toContain("skills-trend-10");
    expect(projected.score).toBe(100);
  });
  it("toTrendingEntry skills variant 11", () => {
    const entry = makeTrendingEntry({
      category: "skills",
      slug: "skills-trend-11",
      title: "skills Trend 11",
      score: 110,
    });
    const projected = toTrendingEntry(entry);
    expect(projected.key).toBe("skills:skills-trend-11");
    expect(projected.category).toBe("skills");
    expect(projected.slug).toBe("skills-trend-11");
    expect(projected.canonicalUrl).toContain("skills-trend-11");
    expect(projected.score).toBe(110);
  });
  it("toTrendingEntry rules variant 0", () => {
    const entry = makeTrendingEntry({
      category: "rules",
      slug: "rules-trend-0",
      title: "rules Trend 0",
      score: 0,
    });
    const projected = toTrendingEntry(entry);
    expect(projected.key).toBe("rules:rules-trend-0");
    expect(projected.category).toBe("rules");
    expect(projected.slug).toBe("rules-trend-0");
    expect(projected.canonicalUrl).toContain("rules-trend-0");
    expect(projected.score).toBe(0);
  });
  it("toTrendingEntry rules variant 1", () => {
    const entry = makeTrendingEntry({
      category: "rules",
      slug: "rules-trend-1",
      title: "rules Trend 1",
      score: 10,
    });
    const projected = toTrendingEntry(entry);
    expect(projected.key).toBe("rules:rules-trend-1");
    expect(projected.category).toBe("rules");
    expect(projected.slug).toBe("rules-trend-1");
    expect(projected.canonicalUrl).toContain("rules-trend-1");
    expect(projected.score).toBe(10);
  });
  it("toTrendingEntry rules variant 2", () => {
    const entry = makeTrendingEntry({
      category: "rules",
      slug: "rules-trend-2",
      title: "rules Trend 2",
      score: 20,
    });
    const projected = toTrendingEntry(entry);
    expect(projected.key).toBe("rules:rules-trend-2");
    expect(projected.category).toBe("rules");
    expect(projected.slug).toBe("rules-trend-2");
    expect(projected.canonicalUrl).toContain("rules-trend-2");
    expect(projected.score).toBe(20);
  });
  it("toTrendingEntry rules variant 3", () => {
    const entry = makeTrendingEntry({
      category: "rules",
      slug: "rules-trend-3",
      title: "rules Trend 3",
      score: 30,
    });
    const projected = toTrendingEntry(entry);
    expect(projected.key).toBe("rules:rules-trend-3");
    expect(projected.category).toBe("rules");
    expect(projected.slug).toBe("rules-trend-3");
    expect(projected.canonicalUrl).toContain("rules-trend-3");
    expect(projected.score).toBe(30);
  });
  it("toTrendingEntry rules variant 4", () => {
    const entry = makeTrendingEntry({
      category: "rules",
      slug: "rules-trend-4",
      title: "rules Trend 4",
      score: 40,
    });
    const projected = toTrendingEntry(entry);
    expect(projected.key).toBe("rules:rules-trend-4");
    expect(projected.category).toBe("rules");
    expect(projected.slug).toBe("rules-trend-4");
    expect(projected.canonicalUrl).toContain("rules-trend-4");
    expect(projected.score).toBe(40);
  });
  it("toTrendingEntry rules variant 5", () => {
    const entry = makeTrendingEntry({
      category: "rules",
      slug: "rules-trend-5",
      title: "rules Trend 5",
      score: 50,
    });
    const projected = toTrendingEntry(entry);
    expect(projected.key).toBe("rules:rules-trend-5");
    expect(projected.category).toBe("rules");
    expect(projected.slug).toBe("rules-trend-5");
    expect(projected.canonicalUrl).toContain("rules-trend-5");
    expect(projected.score).toBe(50);
  });
  it("toTrendingEntry rules variant 6", () => {
    const entry = makeTrendingEntry({
      category: "rules",
      slug: "rules-trend-6",
      title: "rules Trend 6",
      score: 60,
    });
    const projected = toTrendingEntry(entry);
    expect(projected.key).toBe("rules:rules-trend-6");
    expect(projected.category).toBe("rules");
    expect(projected.slug).toBe("rules-trend-6");
    expect(projected.canonicalUrl).toContain("rules-trend-6");
    expect(projected.score).toBe(60);
  });
  it("toTrendingEntry rules variant 7", () => {
    const entry = makeTrendingEntry({
      category: "rules",
      slug: "rules-trend-7",
      title: "rules Trend 7",
      score: 70,
    });
    const projected = toTrendingEntry(entry);
    expect(projected.key).toBe("rules:rules-trend-7");
    expect(projected.category).toBe("rules");
    expect(projected.slug).toBe("rules-trend-7");
    expect(projected.canonicalUrl).toContain("rules-trend-7");
    expect(projected.score).toBe(70);
  });
  it("toTrendingEntry rules variant 8", () => {
    const entry = makeTrendingEntry({
      category: "rules",
      slug: "rules-trend-8",
      title: "rules Trend 8",
      score: 80,
    });
    const projected = toTrendingEntry(entry);
    expect(projected.key).toBe("rules:rules-trend-8");
    expect(projected.category).toBe("rules");
    expect(projected.slug).toBe("rules-trend-8");
    expect(projected.canonicalUrl).toContain("rules-trend-8");
    expect(projected.score).toBe(80);
  });
  it("toTrendingEntry rules variant 9", () => {
    const entry = makeTrendingEntry({
      category: "rules",
      slug: "rules-trend-9",
      title: "rules Trend 9",
      score: 90,
    });
    const projected = toTrendingEntry(entry);
    expect(projected.key).toBe("rules:rules-trend-9");
    expect(projected.category).toBe("rules");
    expect(projected.slug).toBe("rules-trend-9");
    expect(projected.canonicalUrl).toContain("rules-trend-9");
    expect(projected.score).toBe(90);
  });
  it("toTrendingEntry rules variant 10", () => {
    const entry = makeTrendingEntry({
      category: "rules",
      slug: "rules-trend-10",
      title: "rules Trend 10",
      score: 100,
    });
    const projected = toTrendingEntry(entry);
    expect(projected.key).toBe("rules:rules-trend-10");
    expect(projected.category).toBe("rules");
    expect(projected.slug).toBe("rules-trend-10");
    expect(projected.canonicalUrl).toContain("rules-trend-10");
    expect(projected.score).toBe(100);
  });
  it("toTrendingEntry rules variant 11", () => {
    const entry = makeTrendingEntry({
      category: "rules",
      slug: "rules-trend-11",
      title: "rules Trend 11",
      score: 110,
    });
    const projected = toTrendingEntry(entry);
    expect(projected.key).toBe("rules:rules-trend-11");
    expect(projected.category).toBe("rules");
    expect(projected.slug).toBe("rules-trend-11");
    expect(projected.canonicalUrl).toContain("rules-trend-11");
    expect(projected.score).toBe(110);
  });
  it("toTrendingEntry commands variant 0", () => {
    const entry = makeTrendingEntry({
      category: "commands",
      slug: "commands-trend-0",
      title: "commands Trend 0",
      score: 0,
    });
    const projected = toTrendingEntry(entry);
    expect(projected.key).toBe("commands:commands-trend-0");
    expect(projected.category).toBe("commands");
    expect(projected.slug).toBe("commands-trend-0");
    expect(projected.canonicalUrl).toContain("commands-trend-0");
    expect(projected.score).toBe(0);
  });
  it("toTrendingEntry commands variant 1", () => {
    const entry = makeTrendingEntry({
      category: "commands",
      slug: "commands-trend-1",
      title: "commands Trend 1",
      score: 10,
    });
    const projected = toTrendingEntry(entry);
    expect(projected.key).toBe("commands:commands-trend-1");
    expect(projected.category).toBe("commands");
    expect(projected.slug).toBe("commands-trend-1");
    expect(projected.canonicalUrl).toContain("commands-trend-1");
    expect(projected.score).toBe(10);
  });
  it("toTrendingEntry commands variant 2", () => {
    const entry = makeTrendingEntry({
      category: "commands",
      slug: "commands-trend-2",
      title: "commands Trend 2",
      score: 20,
    });
    const projected = toTrendingEntry(entry);
    expect(projected.key).toBe("commands:commands-trend-2");
    expect(projected.category).toBe("commands");
    expect(projected.slug).toBe("commands-trend-2");
    expect(projected.canonicalUrl).toContain("commands-trend-2");
    expect(projected.score).toBe(20);
  });
  it("toTrendingEntry commands variant 3", () => {
    const entry = makeTrendingEntry({
      category: "commands",
      slug: "commands-trend-3",
      title: "commands Trend 3",
      score: 30,
    });
    const projected = toTrendingEntry(entry);
    expect(projected.key).toBe("commands:commands-trend-3");
    expect(projected.category).toBe("commands");
    expect(projected.slug).toBe("commands-trend-3");
    expect(projected.canonicalUrl).toContain("commands-trend-3");
    expect(projected.score).toBe(30);
  });
  it("toTrendingEntry commands variant 4", () => {
    const entry = makeTrendingEntry({
      category: "commands",
      slug: "commands-trend-4",
      title: "commands Trend 4",
      score: 40,
    });
    const projected = toTrendingEntry(entry);
    expect(projected.key).toBe("commands:commands-trend-4");
    expect(projected.category).toBe("commands");
    expect(projected.slug).toBe("commands-trend-4");
    expect(projected.canonicalUrl).toContain("commands-trend-4");
    expect(projected.score).toBe(40);
  });
  it("toTrendingEntry commands variant 5", () => {
    const entry = makeTrendingEntry({
      category: "commands",
      slug: "commands-trend-5",
      title: "commands Trend 5",
      score: 50,
    });
    const projected = toTrendingEntry(entry);
    expect(projected.key).toBe("commands:commands-trend-5");
    expect(projected.category).toBe("commands");
    expect(projected.slug).toBe("commands-trend-5");
    expect(projected.canonicalUrl).toContain("commands-trend-5");
    expect(projected.score).toBe(50);
  });
  it("toTrendingEntry commands variant 6", () => {
    const entry = makeTrendingEntry({
      category: "commands",
      slug: "commands-trend-6",
      title: "commands Trend 6",
      score: 60,
    });
    const projected = toTrendingEntry(entry);
    expect(projected.key).toBe("commands:commands-trend-6");
    expect(projected.category).toBe("commands");
    expect(projected.slug).toBe("commands-trend-6");
    expect(projected.canonicalUrl).toContain("commands-trend-6");
    expect(projected.score).toBe(60);
  });
  it("toTrendingEntry commands variant 7", () => {
    const entry = makeTrendingEntry({
      category: "commands",
      slug: "commands-trend-7",
      title: "commands Trend 7",
      score: 70,
    });
    const projected = toTrendingEntry(entry);
    expect(projected.key).toBe("commands:commands-trend-7");
    expect(projected.category).toBe("commands");
    expect(projected.slug).toBe("commands-trend-7");
    expect(projected.canonicalUrl).toContain("commands-trend-7");
    expect(projected.score).toBe(70);
  });
  it("toTrendingEntry commands variant 8", () => {
    const entry = makeTrendingEntry({
      category: "commands",
      slug: "commands-trend-8",
      title: "commands Trend 8",
      score: 80,
    });
    const projected = toTrendingEntry(entry);
    expect(projected.key).toBe("commands:commands-trend-8");
    expect(projected.category).toBe("commands");
    expect(projected.slug).toBe("commands-trend-8");
    expect(projected.canonicalUrl).toContain("commands-trend-8");
    expect(projected.score).toBe(80);
  });
  it("toTrendingEntry commands variant 9", () => {
    const entry = makeTrendingEntry({
      category: "commands",
      slug: "commands-trend-9",
      title: "commands Trend 9",
      score: 90,
    });
    const projected = toTrendingEntry(entry);
    expect(projected.key).toBe("commands:commands-trend-9");
    expect(projected.category).toBe("commands");
    expect(projected.slug).toBe("commands-trend-9");
    expect(projected.canonicalUrl).toContain("commands-trend-9");
    expect(projected.score).toBe(90);
  });
  it("toTrendingEntry commands variant 10", () => {
    const entry = makeTrendingEntry({
      category: "commands",
      slug: "commands-trend-10",
      title: "commands Trend 10",
      score: 100,
    });
    const projected = toTrendingEntry(entry);
    expect(projected.key).toBe("commands:commands-trend-10");
    expect(projected.category).toBe("commands");
    expect(projected.slug).toBe("commands-trend-10");
    expect(projected.canonicalUrl).toContain("commands-trend-10");
    expect(projected.score).toBe(100);
  });
  it("toTrendingEntry commands variant 11", () => {
    const entry = makeTrendingEntry({
      category: "commands",
      slug: "commands-trend-11",
      title: "commands Trend 11",
      score: 110,
    });
    const projected = toTrendingEntry(entry);
    expect(projected.key).toBe("commands:commands-trend-11");
    expect(projected.category).toBe("commands");
    expect(projected.slug).toBe("commands-trend-11");
    expect(projected.canonicalUrl).toContain("commands-trend-11");
    expect(projected.score).toBe(110);
  });
  it("toTrendingEntry hooks variant 0", () => {
    const entry = makeTrendingEntry({
      category: "hooks",
      slug: "hooks-trend-0",
      title: "hooks Trend 0",
      score: 0,
    });
    const projected = toTrendingEntry(entry);
    expect(projected.key).toBe("hooks:hooks-trend-0");
    expect(projected.category).toBe("hooks");
    expect(projected.slug).toBe("hooks-trend-0");
    expect(projected.canonicalUrl).toContain("hooks-trend-0");
    expect(projected.score).toBe(0);
  });
  it("toTrendingEntry hooks variant 1", () => {
    const entry = makeTrendingEntry({
      category: "hooks",
      slug: "hooks-trend-1",
      title: "hooks Trend 1",
      score: 10,
    });
    const projected = toTrendingEntry(entry);
    expect(projected.key).toBe("hooks:hooks-trend-1");
    expect(projected.category).toBe("hooks");
    expect(projected.slug).toBe("hooks-trend-1");
    expect(projected.canonicalUrl).toContain("hooks-trend-1");
    expect(projected.score).toBe(10);
  });
  it("toTrendingEntry hooks variant 2", () => {
    const entry = makeTrendingEntry({
      category: "hooks",
      slug: "hooks-trend-2",
      title: "hooks Trend 2",
      score: 20,
    });
    const projected = toTrendingEntry(entry);
    expect(projected.key).toBe("hooks:hooks-trend-2");
    expect(projected.category).toBe("hooks");
    expect(projected.slug).toBe("hooks-trend-2");
    expect(projected.canonicalUrl).toContain("hooks-trend-2");
    expect(projected.score).toBe(20);
  });
  it("toTrendingEntry hooks variant 3", () => {
    const entry = makeTrendingEntry({
      category: "hooks",
      slug: "hooks-trend-3",
      title: "hooks Trend 3",
      score: 30,
    });
    const projected = toTrendingEntry(entry);
    expect(projected.key).toBe("hooks:hooks-trend-3");
    expect(projected.category).toBe("hooks");
    expect(projected.slug).toBe("hooks-trend-3");
    expect(projected.canonicalUrl).toContain("hooks-trend-3");
    expect(projected.score).toBe(30);
  });
  it("toTrendingEntry hooks variant 4", () => {
    const entry = makeTrendingEntry({
      category: "hooks",
      slug: "hooks-trend-4",
      title: "hooks Trend 4",
      score: 40,
    });
    const projected = toTrendingEntry(entry);
    expect(projected.key).toBe("hooks:hooks-trend-4");
    expect(projected.category).toBe("hooks");
    expect(projected.slug).toBe("hooks-trend-4");
    expect(projected.canonicalUrl).toContain("hooks-trend-4");
    expect(projected.score).toBe(40);
  });
  it("toTrendingEntry hooks variant 5", () => {
    const entry = makeTrendingEntry({
      category: "hooks",
      slug: "hooks-trend-5",
      title: "hooks Trend 5",
      score: 50,
    });
    const projected = toTrendingEntry(entry);
    expect(projected.key).toBe("hooks:hooks-trend-5");
    expect(projected.category).toBe("hooks");
    expect(projected.slug).toBe("hooks-trend-5");
    expect(projected.canonicalUrl).toContain("hooks-trend-5");
    expect(projected.score).toBe(50);
  });
  it("toTrendingEntry hooks variant 6", () => {
    const entry = makeTrendingEntry({
      category: "hooks",
      slug: "hooks-trend-6",
      title: "hooks Trend 6",
      score: 60,
    });
    const projected = toTrendingEntry(entry);
    expect(projected.key).toBe("hooks:hooks-trend-6");
    expect(projected.category).toBe("hooks");
    expect(projected.slug).toBe("hooks-trend-6");
    expect(projected.canonicalUrl).toContain("hooks-trend-6");
    expect(projected.score).toBe(60);
  });
  it("toTrendingEntry hooks variant 7", () => {
    const entry = makeTrendingEntry({
      category: "hooks",
      slug: "hooks-trend-7",
      title: "hooks Trend 7",
      score: 70,
    });
    const projected = toTrendingEntry(entry);
    expect(projected.key).toBe("hooks:hooks-trend-7");
    expect(projected.category).toBe("hooks");
    expect(projected.slug).toBe("hooks-trend-7");
    expect(projected.canonicalUrl).toContain("hooks-trend-7");
    expect(projected.score).toBe(70);
  });
  it("toTrendingEntry hooks variant 8", () => {
    const entry = makeTrendingEntry({
      category: "hooks",
      slug: "hooks-trend-8",
      title: "hooks Trend 8",
      score: 80,
    });
    const projected = toTrendingEntry(entry);
    expect(projected.key).toBe("hooks:hooks-trend-8");
    expect(projected.category).toBe("hooks");
    expect(projected.slug).toBe("hooks-trend-8");
    expect(projected.canonicalUrl).toContain("hooks-trend-8");
    expect(projected.score).toBe(80);
  });
  it("toTrendingEntry hooks variant 9", () => {
    const entry = makeTrendingEntry({
      category: "hooks",
      slug: "hooks-trend-9",
      title: "hooks Trend 9",
      score: 90,
    });
    const projected = toTrendingEntry(entry);
    expect(projected.key).toBe("hooks:hooks-trend-9");
    expect(projected.category).toBe("hooks");
    expect(projected.slug).toBe("hooks-trend-9");
    expect(projected.canonicalUrl).toContain("hooks-trend-9");
    expect(projected.score).toBe(90);
  });
  it("toTrendingEntry hooks variant 10", () => {
    const entry = makeTrendingEntry({
      category: "hooks",
      slug: "hooks-trend-10",
      title: "hooks Trend 10",
      score: 100,
    });
    const projected = toTrendingEntry(entry);
    expect(projected.key).toBe("hooks:hooks-trend-10");
    expect(projected.category).toBe("hooks");
    expect(projected.slug).toBe("hooks-trend-10");
    expect(projected.canonicalUrl).toContain("hooks-trend-10");
    expect(projected.score).toBe(100);
  });
  it("toTrendingEntry hooks variant 11", () => {
    const entry = makeTrendingEntry({
      category: "hooks",
      slug: "hooks-trend-11",
      title: "hooks Trend 11",
      score: 110,
    });
    const projected = toTrendingEntry(entry);
    expect(projected.key).toBe("hooks:hooks-trend-11");
    expect(projected.category).toBe("hooks");
    expect(projected.slug).toBe("hooks-trend-11");
    expect(projected.canonicalUrl).toContain("hooks-trend-11");
    expect(projected.score).toBe(110);
  });
  it("toTrendingEntry guides variant 0", () => {
    const entry = makeTrendingEntry({
      category: "guides",
      slug: "guides-trend-0",
      title: "guides Trend 0",
      score: 0,
    });
    const projected = toTrendingEntry(entry);
    expect(projected.key).toBe("guides:guides-trend-0");
    expect(projected.category).toBe("guides");
    expect(projected.slug).toBe("guides-trend-0");
    expect(projected.canonicalUrl).toContain("guides-trend-0");
    expect(projected.score).toBe(0);
  });
  it("toTrendingEntry guides variant 1", () => {
    const entry = makeTrendingEntry({
      category: "guides",
      slug: "guides-trend-1",
      title: "guides Trend 1",
      score: 10,
    });
    const projected = toTrendingEntry(entry);
    expect(projected.key).toBe("guides:guides-trend-1");
    expect(projected.category).toBe("guides");
    expect(projected.slug).toBe("guides-trend-1");
    expect(projected.canonicalUrl).toContain("guides-trend-1");
    expect(projected.score).toBe(10);
  });
  it("toTrendingEntry guides variant 2", () => {
    const entry = makeTrendingEntry({
      category: "guides",
      slug: "guides-trend-2",
      title: "guides Trend 2",
      score: 20,
    });
    const projected = toTrendingEntry(entry);
    expect(projected.key).toBe("guides:guides-trend-2");
    expect(projected.category).toBe("guides");
    expect(projected.slug).toBe("guides-trend-2");
    expect(projected.canonicalUrl).toContain("guides-trend-2");
    expect(projected.score).toBe(20);
  });
  it("toTrendingEntry guides variant 3", () => {
    const entry = makeTrendingEntry({
      category: "guides",
      slug: "guides-trend-3",
      title: "guides Trend 3",
      score: 30,
    });
    const projected = toTrendingEntry(entry);
    expect(projected.key).toBe("guides:guides-trend-3");
    expect(projected.category).toBe("guides");
    expect(projected.slug).toBe("guides-trend-3");
    expect(projected.canonicalUrl).toContain("guides-trend-3");
    expect(projected.score).toBe(30);
  });
  it("toTrendingEntry guides variant 4", () => {
    const entry = makeTrendingEntry({
      category: "guides",
      slug: "guides-trend-4",
      title: "guides Trend 4",
      score: 40,
    });
    const projected = toTrendingEntry(entry);
    expect(projected.key).toBe("guides:guides-trend-4");
    expect(projected.category).toBe("guides");
    expect(projected.slug).toBe("guides-trend-4");
    expect(projected.canonicalUrl).toContain("guides-trend-4");
    expect(projected.score).toBe(40);
  });
  it("toTrendingEntry guides variant 5", () => {
    const entry = makeTrendingEntry({
      category: "guides",
      slug: "guides-trend-5",
      title: "guides Trend 5",
      score: 50,
    });
    const projected = toTrendingEntry(entry);
    expect(projected.key).toBe("guides:guides-trend-5");
    expect(projected.category).toBe("guides");
    expect(projected.slug).toBe("guides-trend-5");
    expect(projected.canonicalUrl).toContain("guides-trend-5");
    expect(projected.score).toBe(50);
  });
  it("toTrendingEntry guides variant 6", () => {
    const entry = makeTrendingEntry({
      category: "guides",
      slug: "guides-trend-6",
      title: "guides Trend 6",
      score: 60,
    });
    const projected = toTrendingEntry(entry);
    expect(projected.key).toBe("guides:guides-trend-6");
    expect(projected.category).toBe("guides");
    expect(projected.slug).toBe("guides-trend-6");
    expect(projected.canonicalUrl).toContain("guides-trend-6");
    expect(projected.score).toBe(60);
  });
  it("toTrendingEntry guides variant 7", () => {
    const entry = makeTrendingEntry({
      category: "guides",
      slug: "guides-trend-7",
      title: "guides Trend 7",
      score: 70,
    });
    const projected = toTrendingEntry(entry);
    expect(projected.key).toBe("guides:guides-trend-7");
    expect(projected.category).toBe("guides");
    expect(projected.slug).toBe("guides-trend-7");
    expect(projected.canonicalUrl).toContain("guides-trend-7");
    expect(projected.score).toBe(70);
  });
  it("toTrendingEntry guides variant 8", () => {
    const entry = makeTrendingEntry({
      category: "guides",
      slug: "guides-trend-8",
      title: "guides Trend 8",
      score: 80,
    });
    const projected = toTrendingEntry(entry);
    expect(projected.key).toBe("guides:guides-trend-8");
    expect(projected.category).toBe("guides");
    expect(projected.slug).toBe("guides-trend-8");
    expect(projected.canonicalUrl).toContain("guides-trend-8");
    expect(projected.score).toBe(80);
  });
  it("toTrendingEntry guides variant 9", () => {
    const entry = makeTrendingEntry({
      category: "guides",
      slug: "guides-trend-9",
      title: "guides Trend 9",
      score: 90,
    });
    const projected = toTrendingEntry(entry);
    expect(projected.key).toBe("guides:guides-trend-9");
    expect(projected.category).toBe("guides");
    expect(projected.slug).toBe("guides-trend-9");
    expect(projected.canonicalUrl).toContain("guides-trend-9");
    expect(projected.score).toBe(90);
  });
  it("toTrendingEntry guides variant 10", () => {
    const entry = makeTrendingEntry({
      category: "guides",
      slug: "guides-trend-10",
      title: "guides Trend 10",
      score: 100,
    });
    const projected = toTrendingEntry(entry);
    expect(projected.key).toBe("guides:guides-trend-10");
    expect(projected.category).toBe("guides");
    expect(projected.slug).toBe("guides-trend-10");
    expect(projected.canonicalUrl).toContain("guides-trend-10");
    expect(projected.score).toBe(100);
  });
  it("toTrendingEntry guides variant 11", () => {
    const entry = makeTrendingEntry({
      category: "guides",
      slug: "guides-trend-11",
      title: "guides Trend 11",
      score: 110,
    });
    const projected = toTrendingEntry(entry);
    expect(projected.key).toBe("guides:guides-trend-11");
    expect(projected.category).toBe("guides");
    expect(projected.slug).toBe("guides-trend-11");
    expect(projected.canonicalUrl).toContain("guides-trend-11");
    expect(projected.score).toBe(110);
  });
  it("toTrendingEntry collections variant 0", () => {
    const entry = makeTrendingEntry({
      category: "collections",
      slug: "collections-trend-0",
      title: "collections Trend 0",
      score: 0,
    });
    const projected = toTrendingEntry(entry);
    expect(projected.key).toBe("collections:collections-trend-0");
    expect(projected.category).toBe("collections");
    expect(projected.slug).toBe("collections-trend-0");
    expect(projected.canonicalUrl).toContain("collections-trend-0");
    expect(projected.score).toBe(0);
  });
  it("toTrendingEntry collections variant 1", () => {
    const entry = makeTrendingEntry({
      category: "collections",
      slug: "collections-trend-1",
      title: "collections Trend 1",
      score: 10,
    });
    const projected = toTrendingEntry(entry);
    expect(projected.key).toBe("collections:collections-trend-1");
    expect(projected.category).toBe("collections");
    expect(projected.slug).toBe("collections-trend-1");
    expect(projected.canonicalUrl).toContain("collections-trend-1");
    expect(projected.score).toBe(10);
  });
  it("toTrendingEntry collections variant 2", () => {
    const entry = makeTrendingEntry({
      category: "collections",
      slug: "collections-trend-2",
      title: "collections Trend 2",
      score: 20,
    });
    const projected = toTrendingEntry(entry);
    expect(projected.key).toBe("collections:collections-trend-2");
    expect(projected.category).toBe("collections");
    expect(projected.slug).toBe("collections-trend-2");
    expect(projected.canonicalUrl).toContain("collections-trend-2");
    expect(projected.score).toBe(20);
  });
  it("toTrendingEntry collections variant 3", () => {
    const entry = makeTrendingEntry({
      category: "collections",
      slug: "collections-trend-3",
      title: "collections Trend 3",
      score: 30,
    });
    const projected = toTrendingEntry(entry);
    expect(projected.key).toBe("collections:collections-trend-3");
    expect(projected.category).toBe("collections");
    expect(projected.slug).toBe("collections-trend-3");
    expect(projected.canonicalUrl).toContain("collections-trend-3");
    expect(projected.score).toBe(30);
  });
  it("toTrendingEntry collections variant 4", () => {
    const entry = makeTrendingEntry({
      category: "collections",
      slug: "collections-trend-4",
      title: "collections Trend 4",
      score: 40,
    });
    const projected = toTrendingEntry(entry);
    expect(projected.key).toBe("collections:collections-trend-4");
    expect(projected.category).toBe("collections");
    expect(projected.slug).toBe("collections-trend-4");
    expect(projected.canonicalUrl).toContain("collections-trend-4");
    expect(projected.score).toBe(40);
  });
  it("toTrendingEntry collections variant 5", () => {
    const entry = makeTrendingEntry({
      category: "collections",
      slug: "collections-trend-5",
      title: "collections Trend 5",
      score: 50,
    });
    const projected = toTrendingEntry(entry);
    expect(projected.key).toBe("collections:collections-trend-5");
    expect(projected.category).toBe("collections");
    expect(projected.slug).toBe("collections-trend-5");
    expect(projected.canonicalUrl).toContain("collections-trend-5");
    expect(projected.score).toBe(50);
  });
  it("toTrendingEntry collections variant 6", () => {
    const entry = makeTrendingEntry({
      category: "collections",
      slug: "collections-trend-6",
      title: "collections Trend 6",
      score: 60,
    });
    const projected = toTrendingEntry(entry);
    expect(projected.key).toBe("collections:collections-trend-6");
    expect(projected.category).toBe("collections");
    expect(projected.slug).toBe("collections-trend-6");
    expect(projected.canonicalUrl).toContain("collections-trend-6");
    expect(projected.score).toBe(60);
  });
  it("toTrendingEntry collections variant 7", () => {
    const entry = makeTrendingEntry({
      category: "collections",
      slug: "collections-trend-7",
      title: "collections Trend 7",
      score: 70,
    });
    const projected = toTrendingEntry(entry);
    expect(projected.key).toBe("collections:collections-trend-7");
    expect(projected.category).toBe("collections");
    expect(projected.slug).toBe("collections-trend-7");
    expect(projected.canonicalUrl).toContain("collections-trend-7");
    expect(projected.score).toBe(70);
  });
  it("toTrendingEntry collections variant 8", () => {
    const entry = makeTrendingEntry({
      category: "collections",
      slug: "collections-trend-8",
      title: "collections Trend 8",
      score: 80,
    });
    const projected = toTrendingEntry(entry);
    expect(projected.key).toBe("collections:collections-trend-8");
    expect(projected.category).toBe("collections");
    expect(projected.slug).toBe("collections-trend-8");
    expect(projected.canonicalUrl).toContain("collections-trend-8");
    expect(projected.score).toBe(80);
  });
  it("toTrendingEntry collections variant 9", () => {
    const entry = makeTrendingEntry({
      category: "collections",
      slug: "collections-trend-9",
      title: "collections Trend 9",
      score: 90,
    });
    const projected = toTrendingEntry(entry);
    expect(projected.key).toBe("collections:collections-trend-9");
    expect(projected.category).toBe("collections");
    expect(projected.slug).toBe("collections-trend-9");
    expect(projected.canonicalUrl).toContain("collections-trend-9");
    expect(projected.score).toBe(90);
  });
  it("toTrendingEntry collections variant 10", () => {
    const entry = makeTrendingEntry({
      category: "collections",
      slug: "collections-trend-10",
      title: "collections Trend 10",
      score: 100,
    });
    const projected = toTrendingEntry(entry);
    expect(projected.key).toBe("collections:collections-trend-10");
    expect(projected.category).toBe("collections");
    expect(projected.slug).toBe("collections-trend-10");
    expect(projected.canonicalUrl).toContain("collections-trend-10");
    expect(projected.score).toBe(100);
  });
  it("toTrendingEntry collections variant 11", () => {
    const entry = makeTrendingEntry({
      category: "collections",
      slug: "collections-trend-11",
      title: "collections Trend 11",
      score: 110,
    });
    const projected = toTrendingEntry(entry);
    expect(projected.key).toBe("collections:collections-trend-11");
    expect(projected.category).toBe("collections");
    expect(projected.slug).toBe("collections-trend-11");
    expect(projected.canonicalUrl).toContain("collections-trend-11");
    expect(projected.score).toBe(110);
  });
  it("toTrendingEntry statuslines variant 0", () => {
    const entry = makeTrendingEntry({
      category: "statuslines",
      slug: "statuslines-trend-0",
      title: "statuslines Trend 0",
      score: 0,
    });
    const projected = toTrendingEntry(entry);
    expect(projected.key).toBe("statuslines:statuslines-trend-0");
    expect(projected.category).toBe("statuslines");
    expect(projected.slug).toBe("statuslines-trend-0");
    expect(projected.canonicalUrl).toContain("statuslines-trend-0");
    expect(projected.score).toBe(0);
  });
  it("toTrendingEntry statuslines variant 1", () => {
    const entry = makeTrendingEntry({
      category: "statuslines",
      slug: "statuslines-trend-1",
      title: "statuslines Trend 1",
      score: 10,
    });
    const projected = toTrendingEntry(entry);
    expect(projected.key).toBe("statuslines:statuslines-trend-1");
    expect(projected.category).toBe("statuslines");
    expect(projected.slug).toBe("statuslines-trend-1");
    expect(projected.canonicalUrl).toContain("statuslines-trend-1");
    expect(projected.score).toBe(10);
  });
  it("toTrendingEntry statuslines variant 2", () => {
    const entry = makeTrendingEntry({
      category: "statuslines",
      slug: "statuslines-trend-2",
      title: "statuslines Trend 2",
      score: 20,
    });
    const projected = toTrendingEntry(entry);
    expect(projected.key).toBe("statuslines:statuslines-trend-2");
    expect(projected.category).toBe("statuslines");
    expect(projected.slug).toBe("statuslines-trend-2");
    expect(projected.canonicalUrl).toContain("statuslines-trend-2");
    expect(projected.score).toBe(20);
  });
  it("toTrendingEntry statuslines variant 3", () => {
    const entry = makeTrendingEntry({
      category: "statuslines",
      slug: "statuslines-trend-3",
      title: "statuslines Trend 3",
      score: 30,
    });
    const projected = toTrendingEntry(entry);
    expect(projected.key).toBe("statuslines:statuslines-trend-3");
    expect(projected.category).toBe("statuslines");
    expect(projected.slug).toBe("statuslines-trend-3");
    expect(projected.canonicalUrl).toContain("statuslines-trend-3");
    expect(projected.score).toBe(30);
  });
  it("toTrendingEntry statuslines variant 4", () => {
    const entry = makeTrendingEntry({
      category: "statuslines",
      slug: "statuslines-trend-4",
      title: "statuslines Trend 4",
      score: 40,
    });
    const projected = toTrendingEntry(entry);
    expect(projected.key).toBe("statuslines:statuslines-trend-4");
    expect(projected.category).toBe("statuslines");
    expect(projected.slug).toBe("statuslines-trend-4");
    expect(projected.canonicalUrl).toContain("statuslines-trend-4");
    expect(projected.score).toBe(40);
  });
  it("toTrendingEntry statuslines variant 5", () => {
    const entry = makeTrendingEntry({
      category: "statuslines",
      slug: "statuslines-trend-5",
      title: "statuslines Trend 5",
      score: 50,
    });
    const projected = toTrendingEntry(entry);
    expect(projected.key).toBe("statuslines:statuslines-trend-5");
    expect(projected.category).toBe("statuslines");
    expect(projected.slug).toBe("statuslines-trend-5");
    expect(projected.canonicalUrl).toContain("statuslines-trend-5");
    expect(projected.score).toBe(50);
  });
  it("toTrendingEntry statuslines variant 6", () => {
    const entry = makeTrendingEntry({
      category: "statuslines",
      slug: "statuslines-trend-6",
      title: "statuslines Trend 6",
      score: 60,
    });
    const projected = toTrendingEntry(entry);
    expect(projected.key).toBe("statuslines:statuslines-trend-6");
    expect(projected.category).toBe("statuslines");
    expect(projected.slug).toBe("statuslines-trend-6");
    expect(projected.canonicalUrl).toContain("statuslines-trend-6");
    expect(projected.score).toBe(60);
  });
  it("toTrendingEntry statuslines variant 7", () => {
    const entry = makeTrendingEntry({
      category: "statuslines",
      slug: "statuslines-trend-7",
      title: "statuslines Trend 7",
      score: 70,
    });
    const projected = toTrendingEntry(entry);
    expect(projected.key).toBe("statuslines:statuslines-trend-7");
    expect(projected.category).toBe("statuslines");
    expect(projected.slug).toBe("statuslines-trend-7");
    expect(projected.canonicalUrl).toContain("statuslines-trend-7");
    expect(projected.score).toBe(70);
  });
  it("toTrendingEntry statuslines variant 8", () => {
    const entry = makeTrendingEntry({
      category: "statuslines",
      slug: "statuslines-trend-8",
      title: "statuslines Trend 8",
      score: 80,
    });
    const projected = toTrendingEntry(entry);
    expect(projected.key).toBe("statuslines:statuslines-trend-8");
    expect(projected.category).toBe("statuslines");
    expect(projected.slug).toBe("statuslines-trend-8");
    expect(projected.canonicalUrl).toContain("statuslines-trend-8");
    expect(projected.score).toBe(80);
  });
  it("toTrendingEntry statuslines variant 9", () => {
    const entry = makeTrendingEntry({
      category: "statuslines",
      slug: "statuslines-trend-9",
      title: "statuslines Trend 9",
      score: 90,
    });
    const projected = toTrendingEntry(entry);
    expect(projected.key).toBe("statuslines:statuslines-trend-9");
    expect(projected.category).toBe("statuslines");
    expect(projected.slug).toBe("statuslines-trend-9");
    expect(projected.canonicalUrl).toContain("statuslines-trend-9");
    expect(projected.score).toBe(90);
  });
  it("toTrendingEntry statuslines variant 10", () => {
    const entry = makeTrendingEntry({
      category: "statuslines",
      slug: "statuslines-trend-10",
      title: "statuslines Trend 10",
      score: 100,
    });
    const projected = toTrendingEntry(entry);
    expect(projected.key).toBe("statuslines:statuslines-trend-10");
    expect(projected.category).toBe("statuslines");
    expect(projected.slug).toBe("statuslines-trend-10");
    expect(projected.canonicalUrl).toContain("statuslines-trend-10");
    expect(projected.score).toBe(100);
  });
  it("toTrendingEntry statuslines variant 11", () => {
    const entry = makeTrendingEntry({
      category: "statuslines",
      slug: "statuslines-trend-11",
      title: "statuslines Trend 11",
      score: 110,
    });
    const projected = toTrendingEntry(entry);
    expect(projected.key).toBe("statuslines:statuslines-trend-11");
    expect(projected.category).toBe("statuslines");
    expect(projected.slug).toBe("statuslines-trend-11");
    expect(projected.canonicalUrl).toContain("statuslines-trend-11");
    expect(projected.score).toBe(110);
  });
  it("toTrendingEntry platform claude-code 0", () => {
    const entry = makeTrendingEntry({
      platforms: ["claude-code"],
      tags: ["tag-0"],
      reasons: ["reason-0"],
    });
    const projected = toTrendingEntry(entry);
    expect(projected.platforms).toEqual(["claude-code"]);
    expect(projected.tags).toEqual(["tag-0"]);
    expect(projected.reasons).toEqual(["reason-0"]);
  });
  it("toTrendingEntry platform claude-code 1", () => {
    const entry = makeTrendingEntry({
      platforms: ["claude-code"],
      tags: ["tag-1"],
      reasons: ["reason-1"],
    });
    const projected = toTrendingEntry(entry);
    expect(projected.platforms).toEqual(["claude-code"]);
    expect(projected.tags).toEqual(["tag-1"]);
    expect(projected.reasons).toEqual(["reason-1"]);
  });
  it("toTrendingEntry platform claude-code 2", () => {
    const entry = makeTrendingEntry({
      platforms: ["claude-code"],
      tags: ["tag-2"],
      reasons: ["reason-2"],
    });
    const projected = toTrendingEntry(entry);
    expect(projected.platforms).toEqual(["claude-code"]);
    expect(projected.tags).toEqual(["tag-2"]);
    expect(projected.reasons).toEqual(["reason-2"]);
  });
  it("toTrendingEntry platform claude-code 3", () => {
    const entry = makeTrendingEntry({
      platforms: ["claude-code"],
      tags: ["tag-3"],
      reasons: ["reason-3"],
    });
    const projected = toTrendingEntry(entry);
    expect(projected.platforms).toEqual(["claude-code"]);
    expect(projected.tags).toEqual(["tag-3"]);
    expect(projected.reasons).toEqual(["reason-3"]);
  });
  it("toTrendingEntry platform claude-code 4", () => {
    const entry = makeTrendingEntry({
      platforms: ["claude-code"],
      tags: ["tag-4"],
      reasons: ["reason-4"],
    });
    const projected = toTrendingEntry(entry);
    expect(projected.platforms).toEqual(["claude-code"]);
    expect(projected.tags).toEqual(["tag-4"]);
    expect(projected.reasons).toEqual(["reason-4"]);
  });
  it("toTrendingEntry platform claude-desktop 0", () => {
    const entry = makeTrendingEntry({
      platforms: ["claude-desktop"],
      tags: ["tag-0"],
      reasons: ["reason-0"],
    });
    const projected = toTrendingEntry(entry);
    expect(projected.platforms).toEqual(["claude-desktop"]);
    expect(projected.tags).toEqual(["tag-0"]);
    expect(projected.reasons).toEqual(["reason-0"]);
  });
  it("toTrendingEntry platform claude-desktop 1", () => {
    const entry = makeTrendingEntry({
      platforms: ["claude-desktop"],
      tags: ["tag-1"],
      reasons: ["reason-1"],
    });
    const projected = toTrendingEntry(entry);
    expect(projected.platforms).toEqual(["claude-desktop"]);
    expect(projected.tags).toEqual(["tag-1"]);
    expect(projected.reasons).toEqual(["reason-1"]);
  });
  it("toTrendingEntry platform claude-desktop 2", () => {
    const entry = makeTrendingEntry({
      platforms: ["claude-desktop"],
      tags: ["tag-2"],
      reasons: ["reason-2"],
    });
    const projected = toTrendingEntry(entry);
    expect(projected.platforms).toEqual(["claude-desktop"]);
    expect(projected.tags).toEqual(["tag-2"]);
    expect(projected.reasons).toEqual(["reason-2"]);
  });
  it("toTrendingEntry platform claude-desktop 3", () => {
    const entry = makeTrendingEntry({
      platforms: ["claude-desktop"],
      tags: ["tag-3"],
      reasons: ["reason-3"],
    });
    const projected = toTrendingEntry(entry);
    expect(projected.platforms).toEqual(["claude-desktop"]);
    expect(projected.tags).toEqual(["tag-3"]);
    expect(projected.reasons).toEqual(["reason-3"]);
  });
  it("toTrendingEntry platform claude-desktop 4", () => {
    const entry = makeTrendingEntry({
      platforms: ["claude-desktop"],
      tags: ["tag-4"],
      reasons: ["reason-4"],
    });
    const projected = toTrendingEntry(entry);
    expect(projected.platforms).toEqual(["claude-desktop"]);
    expect(projected.tags).toEqual(["tag-4"]);
    expect(projected.reasons).toEqual(["reason-4"]);
  });
  it("toTrendingEntry platform cursor 0", () => {
    const entry = makeTrendingEntry({
      platforms: ["cursor"],
      tags: ["tag-0"],
      reasons: ["reason-0"],
    });
    const projected = toTrendingEntry(entry);
    expect(projected.platforms).toEqual(["cursor"]);
    expect(projected.tags).toEqual(["tag-0"]);
    expect(projected.reasons).toEqual(["reason-0"]);
  });
  it("toTrendingEntry platform cursor 1", () => {
    const entry = makeTrendingEntry({
      platforms: ["cursor"],
      tags: ["tag-1"],
      reasons: ["reason-1"],
    });
    const projected = toTrendingEntry(entry);
    expect(projected.platforms).toEqual(["cursor"]);
    expect(projected.tags).toEqual(["tag-1"]);
    expect(projected.reasons).toEqual(["reason-1"]);
  });
  it("toTrendingEntry platform cursor 2", () => {
    const entry = makeTrendingEntry({
      platforms: ["cursor"],
      tags: ["tag-2"],
      reasons: ["reason-2"],
    });
    const projected = toTrendingEntry(entry);
    expect(projected.platforms).toEqual(["cursor"]);
    expect(projected.tags).toEqual(["tag-2"]);
    expect(projected.reasons).toEqual(["reason-2"]);
  });
  it("toTrendingEntry platform cursor 3", () => {
    const entry = makeTrendingEntry({
      platforms: ["cursor"],
      tags: ["tag-3"],
      reasons: ["reason-3"],
    });
    const projected = toTrendingEntry(entry);
    expect(projected.platforms).toEqual(["cursor"]);
    expect(projected.tags).toEqual(["tag-3"]);
    expect(projected.reasons).toEqual(["reason-3"]);
  });
  it("toTrendingEntry platform cursor 4", () => {
    const entry = makeTrendingEntry({
      platforms: ["cursor"],
      tags: ["tag-4"],
      reasons: ["reason-4"],
    });
    const projected = toTrendingEntry(entry);
    expect(projected.platforms).toEqual(["cursor"]);
    expect(projected.tags).toEqual(["tag-4"]);
    expect(projected.reasons).toEqual(["reason-4"]);
  });
  it("toTrendingEntry platform vscode 0", () => {
    const entry = makeTrendingEntry({
      platforms: ["vscode"],
      tags: ["tag-0"],
      reasons: ["reason-0"],
    });
    const projected = toTrendingEntry(entry);
    expect(projected.platforms).toEqual(["vscode"]);
    expect(projected.tags).toEqual(["tag-0"]);
    expect(projected.reasons).toEqual(["reason-0"]);
  });
  it("toTrendingEntry platform vscode 1", () => {
    const entry = makeTrendingEntry({
      platforms: ["vscode"],
      tags: ["tag-1"],
      reasons: ["reason-1"],
    });
    const projected = toTrendingEntry(entry);
    expect(projected.platforms).toEqual(["vscode"]);
    expect(projected.tags).toEqual(["tag-1"]);
    expect(projected.reasons).toEqual(["reason-1"]);
  });
  it("toTrendingEntry platform vscode 2", () => {
    const entry = makeTrendingEntry({
      platforms: ["vscode"],
      tags: ["tag-2"],
      reasons: ["reason-2"],
    });
    const projected = toTrendingEntry(entry);
    expect(projected.platforms).toEqual(["vscode"]);
    expect(projected.tags).toEqual(["tag-2"]);
    expect(projected.reasons).toEqual(["reason-2"]);
  });
  it("toTrendingEntry platform vscode 3", () => {
    const entry = makeTrendingEntry({
      platforms: ["vscode"],
      tags: ["tag-3"],
      reasons: ["reason-3"],
    });
    const projected = toTrendingEntry(entry);
    expect(projected.platforms).toEqual(["vscode"]);
    expect(projected.tags).toEqual(["tag-3"]);
    expect(projected.reasons).toEqual(["reason-3"]);
  });
  it("toTrendingEntry platform vscode 4", () => {
    const entry = makeTrendingEntry({
      platforms: ["vscode"],
      tags: ["tag-4"],
      reasons: ["reason-4"],
    });
    const projected = toTrendingEntry(entry);
    expect(projected.platforms).toEqual(["vscode"]);
    expect(projected.tags).toEqual(["tag-4"]);
    expect(projected.reasons).toEqual(["reason-4"]);
  });
  it("toTrendingEntry platform windsurf 0", () => {
    const entry = makeTrendingEntry({
      platforms: ["windsurf"],
      tags: ["tag-0"],
      reasons: ["reason-0"],
    });
    const projected = toTrendingEntry(entry);
    expect(projected.platforms).toEqual(["windsurf"]);
    expect(projected.tags).toEqual(["tag-0"]);
    expect(projected.reasons).toEqual(["reason-0"]);
  });
  it("toTrendingEntry platform windsurf 1", () => {
    const entry = makeTrendingEntry({
      platforms: ["windsurf"],
      tags: ["tag-1"],
      reasons: ["reason-1"],
    });
    const projected = toTrendingEntry(entry);
    expect(projected.platforms).toEqual(["windsurf"]);
    expect(projected.tags).toEqual(["tag-1"]);
    expect(projected.reasons).toEqual(["reason-1"]);
  });
  it("toTrendingEntry platform windsurf 2", () => {
    const entry = makeTrendingEntry({
      platforms: ["windsurf"],
      tags: ["tag-2"],
      reasons: ["reason-2"],
    });
    const projected = toTrendingEntry(entry);
    expect(projected.platforms).toEqual(["windsurf"]);
    expect(projected.tags).toEqual(["tag-2"]);
    expect(projected.reasons).toEqual(["reason-2"]);
  });
  it("toTrendingEntry platform windsurf 3", () => {
    const entry = makeTrendingEntry({
      platforms: ["windsurf"],
      tags: ["tag-3"],
      reasons: ["reason-3"],
    });
    const projected = toTrendingEntry(entry);
    expect(projected.platforms).toEqual(["windsurf"]);
    expect(projected.tags).toEqual(["tag-3"]);
    expect(projected.reasons).toEqual(["reason-3"]);
  });
  it("toTrendingEntry platform windsurf 4", () => {
    const entry = makeTrendingEntry({
      platforms: ["windsurf"],
      tags: ["tag-4"],
      reasons: ["reason-4"],
    });
    const projected = toTrendingEntry(entry);
    expect(projected.platforms).toEqual(["windsurf"]);
    expect(projected.tags).toEqual(["tag-4"]);
    expect(projected.reasons).toEqual(["reason-4"]);
  });
  it("toTrendingEntry platform codex 0", () => {
    const entry = makeTrendingEntry({
      platforms: ["codex"],
      tags: ["tag-0"],
      reasons: ["reason-0"],
    });
    const projected = toTrendingEntry(entry);
    expect(projected.platforms).toEqual(["codex"]);
    expect(projected.tags).toEqual(["tag-0"]);
    expect(projected.reasons).toEqual(["reason-0"]);
  });
  it("toTrendingEntry platform codex 1", () => {
    const entry = makeTrendingEntry({
      platforms: ["codex"],
      tags: ["tag-1"],
      reasons: ["reason-1"],
    });
    const projected = toTrendingEntry(entry);
    expect(projected.platforms).toEqual(["codex"]);
    expect(projected.tags).toEqual(["tag-1"]);
    expect(projected.reasons).toEqual(["reason-1"]);
  });
  it("toTrendingEntry platform codex 2", () => {
    const entry = makeTrendingEntry({
      platforms: ["codex"],
      tags: ["tag-2"],
      reasons: ["reason-2"],
    });
    const projected = toTrendingEntry(entry);
    expect(projected.platforms).toEqual(["codex"]);
    expect(projected.tags).toEqual(["tag-2"]);
    expect(projected.reasons).toEqual(["reason-2"]);
  });
  it("toTrendingEntry platform codex 3", () => {
    const entry = makeTrendingEntry({
      platforms: ["codex"],
      tags: ["tag-3"],
      reasons: ["reason-3"],
    });
    const projected = toTrendingEntry(entry);
    expect(projected.platforms).toEqual(["codex"]);
    expect(projected.tags).toEqual(["tag-3"]);
    expect(projected.reasons).toEqual(["reason-3"]);
  });
  it("toTrendingEntry platform codex 4", () => {
    const entry = makeTrendingEntry({
      platforms: ["codex"],
      tags: ["tag-4"],
      reasons: ["reason-4"],
    });
    const projected = toTrendingEntry(entry);
    expect(projected.platforms).toEqual(["codex"]);
    expect(projected.tags).toEqual(["tag-4"]);
    expect(projected.reasons).toEqual(["reason-4"]);
  });
  it("toTrendingEntry platform gemini 0", () => {
    const entry = makeTrendingEntry({
      platforms: ["gemini"],
      tags: ["tag-0"],
      reasons: ["reason-0"],
    });
    const projected = toTrendingEntry(entry);
    expect(projected.platforms).toEqual(["gemini"]);
    expect(projected.tags).toEqual(["tag-0"]);
    expect(projected.reasons).toEqual(["reason-0"]);
  });
  it("toTrendingEntry platform gemini 1", () => {
    const entry = makeTrendingEntry({
      platforms: ["gemini"],
      tags: ["tag-1"],
      reasons: ["reason-1"],
    });
    const projected = toTrendingEntry(entry);
    expect(projected.platforms).toEqual(["gemini"]);
    expect(projected.tags).toEqual(["tag-1"]);
    expect(projected.reasons).toEqual(["reason-1"]);
  });
  it("toTrendingEntry platform gemini 2", () => {
    const entry = makeTrendingEntry({
      platforms: ["gemini"],
      tags: ["tag-2"],
      reasons: ["reason-2"],
    });
    const projected = toTrendingEntry(entry);
    expect(projected.platforms).toEqual(["gemini"]);
    expect(projected.tags).toEqual(["tag-2"]);
    expect(projected.reasons).toEqual(["reason-2"]);
  });
  it("toTrendingEntry platform gemini 3", () => {
    const entry = makeTrendingEntry({
      platforms: ["gemini"],
      tags: ["tag-3"],
      reasons: ["reason-3"],
    });
    const projected = toTrendingEntry(entry);
    expect(projected.platforms).toEqual(["gemini"]);
    expect(projected.tags).toEqual(["tag-3"]);
    expect(projected.reasons).toEqual(["reason-3"]);
  });
  it("toTrendingEntry platform gemini 4", () => {
    const entry = makeTrendingEntry({
      platforms: ["gemini"],
      tags: ["tag-4"],
      reasons: ["reason-4"],
    });
    const projected = toTrendingEntry(entry);
    expect(projected.platforms).toEqual(["gemini"]);
    expect(projected.tags).toEqual(["tag-4"]);
    expect(projected.reasons).toEqual(["reason-4"]);
  });
  it("toTrendingEntry platform raycast 0", () => {
    const entry = makeTrendingEntry({
      platforms: ["raycast"],
      tags: ["tag-0"],
      reasons: ["reason-0"],
    });
    const projected = toTrendingEntry(entry);
    expect(projected.platforms).toEqual(["raycast"]);
    expect(projected.tags).toEqual(["tag-0"]);
    expect(projected.reasons).toEqual(["reason-0"]);
  });
  it("toTrendingEntry platform raycast 1", () => {
    const entry = makeTrendingEntry({
      platforms: ["raycast"],
      tags: ["tag-1"],
      reasons: ["reason-1"],
    });
    const projected = toTrendingEntry(entry);
    expect(projected.platforms).toEqual(["raycast"]);
    expect(projected.tags).toEqual(["tag-1"]);
    expect(projected.reasons).toEqual(["reason-1"]);
  });
  it("toTrendingEntry platform raycast 2", () => {
    const entry = makeTrendingEntry({
      platforms: ["raycast"],
      tags: ["tag-2"],
      reasons: ["reason-2"],
    });
    const projected = toTrendingEntry(entry);
    expect(projected.platforms).toEqual(["raycast"]);
    expect(projected.tags).toEqual(["tag-2"]);
    expect(projected.reasons).toEqual(["reason-2"]);
  });
  it("toTrendingEntry platform raycast 3", () => {
    const entry = makeTrendingEntry({
      platforms: ["raycast"],
      tags: ["tag-3"],
      reasons: ["reason-3"],
    });
    const projected = toTrendingEntry(entry);
    expect(projected.platforms).toEqual(["raycast"]);
    expect(projected.tags).toEqual(["tag-3"]);
    expect(projected.reasons).toEqual(["reason-3"]);
  });
  it("toTrendingEntry platform raycast 4", () => {
    const entry = makeTrendingEntry({
      platforms: ["raycast"],
      tags: ["tag-4"],
      reasons: ["reason-4"],
    });
    const projected = toTrendingEntry(entry);
    expect(projected.platforms).toEqual(["raycast"]);
    expect(projected.tags).toEqual(["tag-4"]);
    expect(projected.reasons).toEqual(["reason-4"]);
  });
  it("toTrendingEntry platform cli 0", () => {
    const entry = makeTrendingEntry({
      platforms: ["cli"],
      tags: ["tag-0"],
      reasons: ["reason-0"],
    });
    const projected = toTrendingEntry(entry);
    expect(projected.platforms).toEqual(["cli"]);
    expect(projected.tags).toEqual(["tag-0"]);
    expect(projected.reasons).toEqual(["reason-0"]);
  });
  it("toTrendingEntry platform cli 1", () => {
    const entry = makeTrendingEntry({
      platforms: ["cli"],
      tags: ["tag-1"],
      reasons: ["reason-1"],
    });
    const projected = toTrendingEntry(entry);
    expect(projected.platforms).toEqual(["cli"]);
    expect(projected.tags).toEqual(["tag-1"]);
    expect(projected.reasons).toEqual(["reason-1"]);
  });
  it("toTrendingEntry platform cli 2", () => {
    const entry = makeTrendingEntry({
      platforms: ["cli"],
      tags: ["tag-2"],
      reasons: ["reason-2"],
    });
    const projected = toTrendingEntry(entry);
    expect(projected.platforms).toEqual(["cli"]);
    expect(projected.tags).toEqual(["tag-2"]);
    expect(projected.reasons).toEqual(["reason-2"]);
  });
  it("toTrendingEntry platform cli 3", () => {
    const entry = makeTrendingEntry({
      platforms: ["cli"],
      tags: ["tag-3"],
      reasons: ["reason-3"],
    });
    const projected = toTrendingEntry(entry);
    expect(projected.platforms).toEqual(["cli"]);
    expect(projected.tags).toEqual(["tag-3"]);
    expect(projected.reasons).toEqual(["reason-3"]);
  });
  it("toTrendingEntry platform cli 4", () => {
    const entry = makeTrendingEntry({
      platforms: ["cli"],
      tags: ["tag-4"],
      reasons: ["reason-4"],
    });
    const projected = toTrendingEntry(entry);
    expect(projected.platforms).toEqual(["cli"]);
    expect(projected.tags).toEqual(["tag-4"]);
    expect(projected.reasons).toEqual(["reason-4"]);
  });
  it("toTrendingEntry platform aider 0", () => {
    const entry = makeTrendingEntry({
      platforms: ["aider"],
      tags: ["tag-0"],
      reasons: ["reason-0"],
    });
    const projected = toTrendingEntry(entry);
    expect(projected.platforms).toEqual(["aider"]);
    expect(projected.tags).toEqual(["tag-0"]);
    expect(projected.reasons).toEqual(["reason-0"]);
  });
  it("toTrendingEntry platform aider 1", () => {
    const entry = makeTrendingEntry({
      platforms: ["aider"],
      tags: ["tag-1"],
      reasons: ["reason-1"],
    });
    const projected = toTrendingEntry(entry);
    expect(projected.platforms).toEqual(["aider"]);
    expect(projected.tags).toEqual(["tag-1"]);
    expect(projected.reasons).toEqual(["reason-1"]);
  });
  it("toTrendingEntry platform aider 2", () => {
    const entry = makeTrendingEntry({
      platforms: ["aider"],
      tags: ["tag-2"],
      reasons: ["reason-2"],
    });
    const projected = toTrendingEntry(entry);
    expect(projected.platforms).toEqual(["aider"]);
    expect(projected.tags).toEqual(["tag-2"]);
    expect(projected.reasons).toEqual(["reason-2"]);
  });
  it("toTrendingEntry platform aider 3", () => {
    const entry = makeTrendingEntry({
      platforms: ["aider"],
      tags: ["tag-3"],
      reasons: ["reason-3"],
    });
    const projected = toTrendingEntry(entry);
    expect(projected.platforms).toEqual(["aider"]);
    expect(projected.tags).toEqual(["tag-3"]);
    expect(projected.reasons).toEqual(["reason-3"]);
  });
  it("toTrendingEntry platform aider 4", () => {
    const entry = makeTrendingEntry({
      platforms: ["aider"],
      tags: ["tag-4"],
      reasons: ["reason-4"],
    });
    const projected = toTrendingEntry(entry);
    expect(projected.platforms).toEqual(["aider"]);
    expect(projected.tags).toEqual(["tag-4"]);
    expect(projected.reasons).toEqual(["reason-4"]);
  });
  it("toTrendingEntry platform zed 0", () => {
    const entry = makeTrendingEntry({
      platforms: ["zed"],
      tags: ["tag-0"],
      reasons: ["reason-0"],
    });
    const projected = toTrendingEntry(entry);
    expect(projected.platforms).toEqual(["zed"]);
    expect(projected.tags).toEqual(["tag-0"]);
    expect(projected.reasons).toEqual(["reason-0"]);
  });
  it("toTrendingEntry platform zed 1", () => {
    const entry = makeTrendingEntry({
      platforms: ["zed"],
      tags: ["tag-1"],
      reasons: ["reason-1"],
    });
    const projected = toTrendingEntry(entry);
    expect(projected.platforms).toEqual(["zed"]);
    expect(projected.tags).toEqual(["tag-1"]);
    expect(projected.reasons).toEqual(["reason-1"]);
  });
  it("toTrendingEntry platform zed 2", () => {
    const entry = makeTrendingEntry({
      platforms: ["zed"],
      tags: ["tag-2"],
      reasons: ["reason-2"],
    });
    const projected = toTrendingEntry(entry);
    expect(projected.platforms).toEqual(["zed"]);
    expect(projected.tags).toEqual(["tag-2"]);
    expect(projected.reasons).toEqual(["reason-2"]);
  });
  it("toTrendingEntry platform zed 3", () => {
    const entry = makeTrendingEntry({
      platforms: ["zed"],
      tags: ["tag-3"],
      reasons: ["reason-3"],
    });
    const projected = toTrendingEntry(entry);
    expect(projected.platforms).toEqual(["zed"]);
    expect(projected.tags).toEqual(["tag-3"]);
    expect(projected.reasons).toEqual(["reason-3"]);
  });
  it("toTrendingEntry platform zed 4", () => {
    const entry = makeTrendingEntry({
      platforms: ["zed"],
      tags: ["tag-4"],
      reasons: ["reason-4"],
    });
    const projected = toTrendingEntry(entry);
    expect(projected.platforms).toEqual(["zed"]);
    expect(projected.tags).toEqual(["tag-4"]);
    expect(projected.reasons).toEqual(["reason-4"]);
  });
  it("toTrendingEntry platform continue 0", () => {
    const entry = makeTrendingEntry({
      platforms: ["continue"],
      tags: ["tag-0"],
      reasons: ["reason-0"],
    });
    const projected = toTrendingEntry(entry);
    expect(projected.platforms).toEqual(["continue"]);
    expect(projected.tags).toEqual(["tag-0"]);
    expect(projected.reasons).toEqual(["reason-0"]);
  });
  it("toTrendingEntry platform continue 1", () => {
    const entry = makeTrendingEntry({
      platforms: ["continue"],
      tags: ["tag-1"],
      reasons: ["reason-1"],
    });
    const projected = toTrendingEntry(entry);
    expect(projected.platforms).toEqual(["continue"]);
    expect(projected.tags).toEqual(["tag-1"]);
    expect(projected.reasons).toEqual(["reason-1"]);
  });
  it("toTrendingEntry platform continue 2", () => {
    const entry = makeTrendingEntry({
      platforms: ["continue"],
      tags: ["tag-2"],
      reasons: ["reason-2"],
    });
    const projected = toTrendingEntry(entry);
    expect(projected.platforms).toEqual(["continue"]);
    expect(projected.tags).toEqual(["tag-2"]);
    expect(projected.reasons).toEqual(["reason-2"]);
  });
  it("toTrendingEntry platform continue 3", () => {
    const entry = makeTrendingEntry({
      platforms: ["continue"],
      tags: ["tag-3"],
      reasons: ["reason-3"],
    });
    const projected = toTrendingEntry(entry);
    expect(projected.platforms).toEqual(["continue"]);
    expect(projected.tags).toEqual(["tag-3"]);
    expect(projected.reasons).toEqual(["reason-3"]);
  });
  it("toTrendingEntry platform continue 4", () => {
    const entry = makeTrendingEntry({
      platforms: ["continue"],
      tags: ["tag-4"],
      reasons: ["reason-4"],
    });
    const projected = toTrendingEntry(entry);
    expect(projected.platforms).toEqual(["continue"]);
    expect(projected.tags).toEqual(["tag-4"]);
    expect(projected.reasons).toEqual(["reason-4"]);
  });
  it("toTrendingEntry churn matrix 0", () => {
    const entry = makeTrendingEntry({
      title: "",
      description: "",
      dateAdded: "",
      score: 0,
    });
    const projected = toTrendingEntry(entry);
    expect(projected.title).toBe("");
    expect(typeof projected.score).toBe("number");
    expect(projected.trustSignals).toBeDefined();
  });
  it("toTrendingEntry churn matrix 1", () => {
    const entry = makeTrendingEntry({
      title: "",
      description: "",
      dateAdded: "",
      score: "1",
    });
    const projected = toTrendingEntry(entry);
    expect(projected.title).toBe("");
    expect(typeof projected.score).toBe("number");
    expect(projected.trustSignals).toBeDefined();
  });
  it("toTrendingEntry churn matrix 2", () => {
    const entry = makeTrendingEntry({
      title: "",
      description: "",
      dateAdded: "",
      score: 2,
    });
    const projected = toTrendingEntry(entry);
    expect(projected.title).toBe("");
    expect(typeof projected.score).toBe("number");
    expect(projected.trustSignals).toBeDefined();
  });
  it("toTrendingEntry churn matrix 3", () => {
    const entry = makeTrendingEntry({
      title: "",
      description: "",
      dateAdded: "",
      score: "3",
    });
    const projected = toTrendingEntry(entry);
    expect(projected.title).toBe("");
    expect(typeof projected.score).toBe("number");
    expect(projected.trustSignals).toBeDefined();
  });
  it("toTrendingEntry churn matrix 4", () => {
    const entry = makeTrendingEntry({
      title: "",
      description: "",
      dateAdded: "",
      score: 4,
    });
    const projected = toTrendingEntry(entry);
    expect(projected.title).toBe("");
    expect(typeof projected.score).toBe("number");
    expect(projected.trustSignals).toBeDefined();
  });
  it("toTrendingEntry churn matrix 5", () => {
    const entry = makeTrendingEntry({
      title: "",
      description: "",
      dateAdded: "",
      score: "5",
    });
    const projected = toTrendingEntry(entry);
    expect(projected.title).toBe("");
    expect(typeof projected.score).toBe("number");
    expect(projected.trustSignals).toBeDefined();
  });
  it("toTrendingEntry churn matrix 6", () => {
    const entry = makeTrendingEntry({
      title: "",
      description: "",
      dateAdded: "",
      score: 6,
    });
    const projected = toTrendingEntry(entry);
    expect(projected.title).toBe("");
    expect(typeof projected.score).toBe("number");
    expect(projected.trustSignals).toBeDefined();
  });
  it("toTrendingEntry churn matrix 7", () => {
    const entry = makeTrendingEntry({
      title: "",
      description: "",
      dateAdded: "",
      score: "7",
    });
    const projected = toTrendingEntry(entry);
    expect(projected.title).toBe("");
    expect(typeof projected.score).toBe("number");
    expect(projected.trustSignals).toBeDefined();
  });
  it("toTrendingEntry churn matrix 8", () => {
    const entry = makeTrendingEntry({
      title: "",
      description: "",
      dateAdded: "",
      score: 8,
    });
    const projected = toTrendingEntry(entry);
    expect(projected.title).toBe("");
    expect(typeof projected.score).toBe("number");
    expect(projected.trustSignals).toBeDefined();
  });
  it("toTrendingEntry churn matrix 9", () => {
    const entry = makeTrendingEntry({
      title: "",
      description: "",
      dateAdded: "",
      score: "9",
    });
    const projected = toTrendingEntry(entry);
    expect(projected.title).toBe("");
    expect(typeof projected.score).toBe("number");
    expect(projected.trustSignals).toBeDefined();
  });
  it("toTrendingEntry churn matrix 10", () => {
    const entry = makeTrendingEntry({
      title: "",
      description: "",
      dateAdded: "",
      score: 10,
    });
    const projected = toTrendingEntry(entry);
    expect(projected.title).toBe("");
    expect(typeof projected.score).toBe("number");
    expect(projected.trustSignals).toBeDefined();
  });
  it("toTrendingEntry churn matrix 11", () => {
    const entry = makeTrendingEntry({
      title: "",
      description: "",
      dateAdded: "",
      score: "11",
    });
    const projected = toTrendingEntry(entry);
    expect(projected.title).toBe("");
    expect(typeof projected.score).toBe("number");
    expect(projected.trustSignals).toBeDefined();
  });
  it("toTrendingEntry churn matrix 12", () => {
    const entry = makeTrendingEntry({
      title: "",
      description: "",
      dateAdded: "",
      score: 12,
    });
    const projected = toTrendingEntry(entry);
    expect(projected.title).toBe("");
    expect(typeof projected.score).toBe("number");
    expect(projected.trustSignals).toBeDefined();
  });
  it("toTrendingEntry churn matrix 13", () => {
    const entry = makeTrendingEntry({
      title: "",
      description: "",
      dateAdded: "",
      score: "13",
    });
    const projected = toTrendingEntry(entry);
    expect(projected.title).toBe("");
    expect(typeof projected.score).toBe("number");
    expect(projected.trustSignals).toBeDefined();
  });
  it("toTrendingEntry churn matrix 14", () => {
    const entry = makeTrendingEntry({
      title: "",
      description: "",
      dateAdded: "",
      score: 14,
    });
    const projected = toTrendingEntry(entry);
    expect(projected.title).toBe("");
    expect(typeof projected.score).toBe("number");
    expect(projected.trustSignals).toBeDefined();
  });
  it("toTrendingEntry churn matrix 15", () => {
    const entry = makeTrendingEntry({
      title: "",
      description: "",
      dateAdded: "",
      score: "15",
    });
    const projected = toTrendingEntry(entry);
    expect(projected.title).toBe("");
    expect(typeof projected.score).toBe("number");
    expect(projected.trustSignals).toBeDefined();
  });
  it("toTrendingEntry churn matrix 16", () => {
    const entry = makeTrendingEntry({
      title: "",
      description: "",
      dateAdded: "",
      score: 16,
    });
    const projected = toTrendingEntry(entry);
    expect(projected.title).toBe("");
    expect(typeof projected.score).toBe("number");
    expect(projected.trustSignals).toBeDefined();
  });
  it("toTrendingEntry churn matrix 17", () => {
    const entry = makeTrendingEntry({
      title: "",
      description: "",
      dateAdded: "",
      score: "17",
    });
    const projected = toTrendingEntry(entry);
    expect(projected.title).toBe("");
    expect(typeof projected.score).toBe("number");
    expect(projected.trustSignals).toBeDefined();
  });
  it("toTrendingEntry churn matrix 18", () => {
    const entry = makeTrendingEntry({
      title: "",
      description: "",
      dateAdded: "",
      score: 18,
    });
    const projected = toTrendingEntry(entry);
    expect(projected.title).toBe("");
    expect(typeof projected.score).toBe("number");
    expect(projected.trustSignals).toBeDefined();
  });
  it("toTrendingEntry churn matrix 19", () => {
    const entry = makeTrendingEntry({
      title: "",
      description: "",
      dateAdded: "",
      score: "19",
    });
    const projected = toTrendingEntry(entry);
    expect(projected.title).toBe("");
    expect(typeof projected.score).toBe("number");
    expect(projected.trustSignals).toBeDefined();
  });
  it("toTrendingEntry churn matrix 20", () => {
    const entry = makeTrendingEntry({
      title: "",
      description: "",
      dateAdded: "",
      score: 20,
    });
    const projected = toTrendingEntry(entry);
    expect(projected.title).toBe("");
    expect(typeof projected.score).toBe("number");
    expect(projected.trustSignals).toBeDefined();
  });
  it("toTrendingEntry churn matrix 21", () => {
    const entry = makeTrendingEntry({
      title: "",
      description: "",
      dateAdded: "",
      score: "21",
    });
    const projected = toTrendingEntry(entry);
    expect(projected.title).toBe("");
    expect(typeof projected.score).toBe("number");
    expect(projected.trustSignals).toBeDefined();
  });
  it("toTrendingEntry churn matrix 22", () => {
    const entry = makeTrendingEntry({
      title: "",
      description: "",
      dateAdded: "",
      score: 22,
    });
    const projected = toTrendingEntry(entry);
    expect(projected.title).toBe("");
    expect(typeof projected.score).toBe("number");
    expect(projected.trustSignals).toBeDefined();
  });
  it("toTrendingEntry churn matrix 23", () => {
    const entry = makeTrendingEntry({
      title: "",
      description: "",
      dateAdded: "",
      score: "23",
    });
    const projected = toTrendingEntry(entry);
    expect(projected.title).toBe("");
    expect(typeof projected.score).toBe("number");
    expect(projected.trustSignals).toBeDefined();
  });
  it("toTrendingEntry churn matrix 24", () => {
    const entry = makeTrendingEntry({
      title: "",
      description: "",
      dateAdded: "",
      score: 24,
    });
    const projected = toTrendingEntry(entry);
    expect(projected.title).toBe("");
    expect(typeof projected.score).toBe("number");
    expect(projected.trustSignals).toBeDefined();
  });
  it("toTrendingEntry churn matrix 25", () => {
    const entry = makeTrendingEntry({
      title: "",
      description: "",
      dateAdded: "",
      score: "25",
    });
    const projected = toTrendingEntry(entry);
    expect(projected.title).toBe("");
    expect(typeof projected.score).toBe("number");
    expect(projected.trustSignals).toBeDefined();
  });
  it("toTrendingEntry churn matrix 26", () => {
    const entry = makeTrendingEntry({
      title: "",
      description: "",
      dateAdded: "",
      score: 26,
    });
    const projected = toTrendingEntry(entry);
    expect(projected.title).toBe("");
    expect(typeof projected.score).toBe("number");
    expect(projected.trustSignals).toBeDefined();
  });
  it("toTrendingEntry churn matrix 27", () => {
    const entry = makeTrendingEntry({
      title: "",
      description: "",
      dateAdded: "",
      score: "27",
    });
    const projected = toTrendingEntry(entry);
    expect(projected.title).toBe("");
    expect(typeof projected.score).toBe("number");
    expect(projected.trustSignals).toBeDefined();
  });
  it("toTrendingEntry churn matrix 28", () => {
    const entry = makeTrendingEntry({
      title: "",
      description: "",
      dateAdded: "",
      score: 28,
    });
    const projected = toTrendingEntry(entry);
    expect(projected.title).toBe("");
    expect(typeof projected.score).toBe("number");
    expect(projected.trustSignals).toBeDefined();
  });
  it("toTrendingEntry churn matrix 29", () => {
    const entry = makeTrendingEntry({
      title: "",
      description: "",
      dateAdded: "",
      score: "29",
    });
    const projected = toTrendingEntry(entry);
    expect(projected.title).toBe("");
    expect(typeof projected.score).toBe("number");
    expect(projected.trustSignals).toBeDefined();
  });
  it("toTrendingEntry churn matrix 30", () => {
    const entry = makeTrendingEntry({
      title: "",
      description: "",
      dateAdded: "",
      score: 30,
    });
    const projected = toTrendingEntry(entry);
    expect(projected.title).toBe("");
    expect(typeof projected.score).toBe("number");
    expect(projected.trustSignals).toBeDefined();
  });
  it("toTrendingEntry churn matrix 31", () => {
    const entry = makeTrendingEntry({
      title: "",
      description: "",
      dateAdded: "",
      score: "31",
    });
    const projected = toTrendingEntry(entry);
    expect(projected.title).toBe("");
    expect(typeof projected.score).toBe("number");
    expect(projected.trustSignals).toBeDefined();
  });
  it("toTrendingEntry churn matrix 32", () => {
    const entry = makeTrendingEntry({
      title: "",
      description: "",
      dateAdded: "",
      score: 32,
    });
    const projected = toTrendingEntry(entry);
    expect(projected.title).toBe("");
    expect(typeof projected.score).toBe("number");
    expect(projected.trustSignals).toBeDefined();
  });
  it("toTrendingEntry churn matrix 33", () => {
    const entry = makeTrendingEntry({
      title: "",
      description: "",
      dateAdded: "",
      score: "33",
    });
    const projected = toTrendingEntry(entry);
    expect(projected.title).toBe("");
    expect(typeof projected.score).toBe("number");
    expect(projected.trustSignals).toBeDefined();
  });
  it("toTrendingEntry churn matrix 34", () => {
    const entry = makeTrendingEntry({
      title: "",
      description: "",
      dateAdded: "",
      score: 34,
    });
    const projected = toTrendingEntry(entry);
    expect(projected.title).toBe("");
    expect(typeof projected.score).toBe("number");
    expect(projected.trustSignals).toBeDefined();
  });
  it("toTrendingEntry churn matrix 35", () => {
    const entry = makeTrendingEntry({
      title: "",
      description: "",
      dateAdded: "",
      score: "35",
    });
    const projected = toTrendingEntry(entry);
    expect(projected.title).toBe("");
    expect(typeof projected.score).toBe("number");
    expect(projected.trustSignals).toBeDefined();
  });
  it("toTrendingEntry churn matrix 36", () => {
    const entry = makeTrendingEntry({
      title: "",
      description: "",
      dateAdded: "",
      score: 36,
    });
    const projected = toTrendingEntry(entry);
    expect(projected.title).toBe("");
    expect(typeof projected.score).toBe("number");
    expect(projected.trustSignals).toBeDefined();
  });
  it("toTrendingEntry churn matrix 37", () => {
    const entry = makeTrendingEntry({
      title: "",
      description: "",
      dateAdded: "",
      score: "37",
    });
    const projected = toTrendingEntry(entry);
    expect(projected.title).toBe("");
    expect(typeof projected.score).toBe("number");
    expect(projected.trustSignals).toBeDefined();
  });
  it("toTrendingEntry churn matrix 38", () => {
    const entry = makeTrendingEntry({
      title: "",
      description: "",
      dateAdded: "",
      score: 38,
    });
    const projected = toTrendingEntry(entry);
    expect(projected.title).toBe("");
    expect(typeof projected.score).toBe("number");
    expect(projected.trustSignals).toBeDefined();
  });
  it("toTrendingEntry churn matrix 39", () => {
    const entry = makeTrendingEntry({
      title: "",
      description: "",
      dateAdded: "",
      score: "39",
    });
    const projected = toTrendingEntry(entry);
    expect(projected.title).toBe("");
    expect(typeof projected.score).toBe("number");
    expect(projected.trustSignals).toBeDefined();
  });
  it("toTrendingEntry churn matrix 40", () => {
    const entry = makeTrendingEntry({
      title: "",
      description: "",
      dateAdded: "",
      score: 40,
    });
    const projected = toTrendingEntry(entry);
    expect(projected.title).toBe("");
    expect(typeof projected.score).toBe("number");
    expect(projected.trustSignals).toBeDefined();
  });
  it("toTrendingEntry churn matrix 41", () => {
    const entry = makeTrendingEntry({
      title: "",
      description: "",
      dateAdded: "",
      score: "41",
    });
    const projected = toTrendingEntry(entry);
    expect(projected.title).toBe("");
    expect(typeof projected.score).toBe("number");
    expect(projected.trustSignals).toBeDefined();
  });
  it("toTrendingEntry churn matrix 42", () => {
    const entry = makeTrendingEntry({
      title: "",
      description: "",
      dateAdded: "",
      score: 42,
    });
    const projected = toTrendingEntry(entry);
    expect(projected.title).toBe("");
    expect(typeof projected.score).toBe("number");
    expect(projected.trustSignals).toBeDefined();
  });
  it("toTrendingEntry churn matrix 43", () => {
    const entry = makeTrendingEntry({
      title: "",
      description: "",
      dateAdded: "",
      score: "43",
    });
    const projected = toTrendingEntry(entry);
    expect(projected.title).toBe("");
    expect(typeof projected.score).toBe("number");
    expect(projected.trustSignals).toBeDefined();
  });
  it("toTrendingEntry churn matrix 44", () => {
    const entry = makeTrendingEntry({
      title: "",
      description: "",
      dateAdded: "",
      score: 44,
    });
    const projected = toTrendingEntry(entry);
    expect(projected.title).toBe("");
    expect(typeof projected.score).toBe("number");
    expect(projected.trustSignals).toBeDefined();
  });
  it("toTrendingEntry churn matrix 45", () => {
    const entry = makeTrendingEntry({
      title: "",
      description: "",
      dateAdded: "",
      score: "45",
    });
    const projected = toTrendingEntry(entry);
    expect(projected.title).toBe("");
    expect(typeof projected.score).toBe("number");
    expect(projected.trustSignals).toBeDefined();
  });
  it("toTrendingEntry churn matrix 46", () => {
    const entry = makeTrendingEntry({
      title: "",
      description: "",
      dateAdded: "",
      score: 46,
    });
    const projected = toTrendingEntry(entry);
    expect(projected.title).toBe("");
    expect(typeof projected.score).toBe("number");
    expect(projected.trustSignals).toBeDefined();
  });
  it("toTrendingEntry churn matrix 47", () => {
    const entry = makeTrendingEntry({
      title: "",
      description: "",
      dateAdded: "",
      score: "47",
    });
    const projected = toTrendingEntry(entry);
    expect(projected.title).toBe("");
    expect(typeof projected.score).toBe("number");
    expect(projected.trustSignals).toBeDefined();
  });
  it("toTrendingEntry churn matrix 48", () => {
    const entry = makeTrendingEntry({
      title: "",
      description: "",
      dateAdded: "",
      score: 48,
    });
    const projected = toTrendingEntry(entry);
    expect(projected.title).toBe("");
    expect(typeof projected.score).toBe("number");
    expect(projected.trustSignals).toBeDefined();
  });
  it("toTrendingEntry churn matrix 49", () => {
    const entry = makeTrendingEntry({
      title: "",
      description: "",
      dateAdded: "",
      score: "49",
    });
    const projected = toTrendingEntry(entry);
    expect(projected.title).toBe("");
    expect(typeof projected.score).toBe("number");
    expect(projected.trustSignals).toBeDefined();
  });
});

describe("registry-discovery-projection-lib toJobEntry", () => {
  it("projects stable job shape", () => {
    expect(toJobEntry(makeJob())).toEqual({
      id: "job-123",
      title: "Senior MCP Engineer",
      company: "HeyClaude",
      location: "Remote",
      type: "full-time",
      isRemote: true,
      tier: "featured",
      applyUrl: "https://jobs.example.com/apply",
      sourceLabel: "HeyClaude Jobs",
      postedAt: "2026-06-01",
      labels: ["mcp", "typescript"],
    });
  });
  it("falls back id to slug and applyUrl to url", () => {
    const projected = toJobEntry({
      slug: "fallback-slug",
      url: "https://apply.example.com",
      labels: "not-array",
    });
    expect(projected.id).toBe("fallback-slug");
    expect(projected.applyUrl).toBe("https://apply.example.com");
    expect(projected.labels).toEqual([]);
  });
  it("falls back postedAt to publishedAt", () => {
    expect(toJobEntry({ publishedAt: "2026-05-01" }).postedAt).toBe(
      "2026-05-01",
    );
  });
  it("coerces isRemote to boolean", () => {
    expect(toJobEntry({ isRemote: 1 }).isRemote).toBe(true);
    expect(toJobEntry({ isRemote: 0 }).isRemote).toBe(false);
    expect(toJobEntry({ isRemote: "yes" }).isRemote).toBe(true);
  });

  it("toJobEntry matrix 0", () => {
    const job = makeJob({
      id: "job-0",
      title: "Role 0",
      company: "HeyClaude",
      type: "full-time",
      tier: "featured",
      isRemote: true,
      labels: ["label-0"],
    });
    const projected = toJobEntry(job);
    expect(projected.id).toBe("job-0");
    expect(projected.company).toBe("HeyClaude");
    expect(projected.type).toBe("full-time");
    expect(projected.tier).toBe("featured");
    expect(projected.labels).toEqual(["label-0"]);
  });
  it("toJobEntry matrix 1", () => {
    const job = makeJob({
      id: "job-1",
      title: "Role 1",
      company: "Acme Corp",
      type: "part-time",
      tier: "standard",
      isRemote: false,
      labels: ["label-1"],
    });
    const projected = toJobEntry(job);
    expect(projected.id).toBe("job-1");
    expect(projected.company).toBe("Acme Corp");
    expect(projected.type).toBe("part-time");
    expect(projected.tier).toBe("standard");
    expect(projected.labels).toEqual(["label-1"]);
  });
  it("toJobEntry matrix 2", () => {
    const job = makeJob({
      id: "job-2",
      title: "Role 2",
      company: "Example Inc",
      type: "contract",
      tier: "community",
      isRemote: true,
      labels: ["label-2"],
    });
    const projected = toJobEntry(job);
    expect(projected.id).toBe("job-2");
    expect(projected.company).toBe("Example Inc");
    expect(projected.type).toBe("contract");
    expect(projected.tier).toBe("community");
    expect(projected.labels).toEqual(["label-2"]);
  });
  it("toJobEntry matrix 3", () => {
    const job = makeJob({
      id: "job-3",
      title: "Role 3",
      company: "Startup Labs",
      type: "internship",
      tier: "sponsored",
      isRemote: false,
      labels: ["label-3"],
    });
    const projected = toJobEntry(job);
    expect(projected.id).toBe("job-3");
    expect(projected.company).toBe("Startup Labs");
    expect(projected.type).toBe("internship");
    expect(projected.tier).toBe("sponsored");
    expect(projected.labels).toEqual(["label-3"]);
  });
  it("toJobEntry matrix 4", () => {
    const job = makeJob({
      id: "job-4",
      title: "Role 4",
      company: "Big Tech",
      type: "freelance",
      tier: "premium",
      isRemote: true,
      labels: ["label-4"],
    });
    const projected = toJobEntry(job);
    expect(projected.id).toBe("job-4");
    expect(projected.company).toBe("Big Tech");
    expect(projected.type).toBe("freelance");
    expect(projected.tier).toBe("premium");
    expect(projected.labels).toEqual(["label-4"]);
  });
  it("toJobEntry matrix 5", () => {
    const job = makeJob({
      id: "job-5",
      title: "Role 5",
      company: "Consulting Co",
      type: "temporary",
      tier: "basic",
      isRemote: false,
      labels: ["label-5"],
    });
    const projected = toJobEntry(job);
    expect(projected.id).toBe("job-5");
    expect(projected.company).toBe("Consulting Co");
    expect(projected.type).toBe("temporary");
    expect(projected.tier).toBe("basic");
    expect(projected.labels).toEqual(["label-5"]);
  });
  it("toJobEntry matrix 6", () => {
    const job = makeJob({
      id: "job-6",
      title: "Role 6",
      company: "Agency Ltd",
      type: "volunteer",
      tier: "free",
      isRemote: true,
      labels: ["label-6"],
    });
    const projected = toJobEntry(job);
    expect(projected.id).toBe("job-6");
    expect(projected.company).toBe("Agency Ltd");
    expect(projected.type).toBe("volunteer");
    expect(projected.tier).toBe("free");
    expect(projected.labels).toEqual(["label-6"]);
  });
  it("toJobEntry matrix 7", () => {
    const job = makeJob({
      id: "job-7",
      title: "Role 7",
      company: "Nonprofit Org",
      type: "apprenticeship",
      tier: "trial",
      isRemote: false,
      labels: ["label-7"],
    });
    const projected = toJobEntry(job);
    expect(projected.id).toBe("job-7");
    expect(projected.company).toBe("Nonprofit Org");
    expect(projected.type).toBe("apprenticeship");
    expect(projected.tier).toBe("trial");
    expect(projected.labels).toEqual(["label-7"]);
  });
  it("toJobEntry matrix 8", () => {
    const job = makeJob({
      id: "job-8",
      title: "Role 8",
      company: "HeyClaude",
      type: "full-time",
      tier: "featured",
      isRemote: true,
      labels: ["label-8"],
    });
    const projected = toJobEntry(job);
    expect(projected.id).toBe("job-8");
    expect(projected.company).toBe("HeyClaude");
    expect(projected.type).toBe("full-time");
    expect(projected.tier).toBe("featured");
    expect(projected.labels).toEqual(["label-8"]);
  });
  it("toJobEntry matrix 9", () => {
    const job = makeJob({
      id: "job-9",
      title: "Role 9",
      company: "Acme Corp",
      type: "part-time",
      tier: "standard",
      isRemote: false,
      labels: ["label-9"],
    });
    const projected = toJobEntry(job);
    expect(projected.id).toBe("job-9");
    expect(projected.company).toBe("Acme Corp");
    expect(projected.type).toBe("part-time");
    expect(projected.tier).toBe("standard");
    expect(projected.labels).toEqual(["label-9"]);
  });
  it("toJobEntry matrix 10", () => {
    const job = makeJob({
      id: "job-10",
      title: "Role 10",
      company: "Example Inc",
      type: "contract",
      tier: "community",
      isRemote: true,
      labels: ["label-10"],
    });
    const projected = toJobEntry(job);
    expect(projected.id).toBe("job-10");
    expect(projected.company).toBe("Example Inc");
    expect(projected.type).toBe("contract");
    expect(projected.tier).toBe("community");
    expect(projected.labels).toEqual(["label-10"]);
  });
  it("toJobEntry matrix 11", () => {
    const job = makeJob({
      id: "job-11",
      title: "Role 11",
      company: "Startup Labs",
      type: "internship",
      tier: "sponsored",
      isRemote: false,
      labels: ["label-11"],
    });
    const projected = toJobEntry(job);
    expect(projected.id).toBe("job-11");
    expect(projected.company).toBe("Startup Labs");
    expect(projected.type).toBe("internship");
    expect(projected.tier).toBe("sponsored");
    expect(projected.labels).toEqual(["label-11"]);
  });
  it("toJobEntry matrix 12", () => {
    const job = makeJob({
      id: "job-12",
      title: "Role 12",
      company: "Big Tech",
      type: "freelance",
      tier: "premium",
      isRemote: true,
      labels: ["label-12"],
    });
    const projected = toJobEntry(job);
    expect(projected.id).toBe("job-12");
    expect(projected.company).toBe("Big Tech");
    expect(projected.type).toBe("freelance");
    expect(projected.tier).toBe("premium");
    expect(projected.labels).toEqual(["label-12"]);
  });
  it("toJobEntry matrix 13", () => {
    const job = makeJob({
      id: "job-13",
      title: "Role 13",
      company: "Consulting Co",
      type: "temporary",
      tier: "basic",
      isRemote: false,
      labels: ["label-13"],
    });
    const projected = toJobEntry(job);
    expect(projected.id).toBe("job-13");
    expect(projected.company).toBe("Consulting Co");
    expect(projected.type).toBe("temporary");
    expect(projected.tier).toBe("basic");
    expect(projected.labels).toEqual(["label-13"]);
  });
  it("toJobEntry matrix 14", () => {
    const job = makeJob({
      id: "job-14",
      title: "Role 14",
      company: "Agency Ltd",
      type: "volunteer",
      tier: "free",
      isRemote: true,
      labels: ["label-14"],
    });
    const projected = toJobEntry(job);
    expect(projected.id).toBe("job-14");
    expect(projected.company).toBe("Agency Ltd");
    expect(projected.type).toBe("volunteer");
    expect(projected.tier).toBe("free");
    expect(projected.labels).toEqual(["label-14"]);
  });
  it("toJobEntry matrix 15", () => {
    const job = makeJob({
      id: "job-15",
      title: "Role 15",
      company: "Nonprofit Org",
      type: "apprenticeship",
      tier: "trial",
      isRemote: false,
      labels: ["label-15"],
    });
    const projected = toJobEntry(job);
    expect(projected.id).toBe("job-15");
    expect(projected.company).toBe("Nonprofit Org");
    expect(projected.type).toBe("apprenticeship");
    expect(projected.tier).toBe("trial");
    expect(projected.labels).toEqual(["label-15"]);
  });
  it("toJobEntry matrix 16", () => {
    const job = makeJob({
      id: "job-16",
      title: "Role 16",
      company: "HeyClaude",
      type: "full-time",
      tier: "featured",
      isRemote: true,
      labels: ["label-16"],
    });
    const projected = toJobEntry(job);
    expect(projected.id).toBe("job-16");
    expect(projected.company).toBe("HeyClaude");
    expect(projected.type).toBe("full-time");
    expect(projected.tier).toBe("featured");
    expect(projected.labels).toEqual(["label-16"]);
  });
  it("toJobEntry matrix 17", () => {
    const job = makeJob({
      id: "job-17",
      title: "Role 17",
      company: "Acme Corp",
      type: "part-time",
      tier: "standard",
      isRemote: false,
      labels: ["label-17"],
    });
    const projected = toJobEntry(job);
    expect(projected.id).toBe("job-17");
    expect(projected.company).toBe("Acme Corp");
    expect(projected.type).toBe("part-time");
    expect(projected.tier).toBe("standard");
    expect(projected.labels).toEqual(["label-17"]);
  });
  it("toJobEntry matrix 18", () => {
    const job = makeJob({
      id: "job-18",
      title: "Role 18",
      company: "Example Inc",
      type: "contract",
      tier: "community",
      isRemote: true,
      labels: ["label-18"],
    });
    const projected = toJobEntry(job);
    expect(projected.id).toBe("job-18");
    expect(projected.company).toBe("Example Inc");
    expect(projected.type).toBe("contract");
    expect(projected.tier).toBe("community");
    expect(projected.labels).toEqual(["label-18"]);
  });
  it("toJobEntry matrix 19", () => {
    const job = makeJob({
      id: "job-19",
      title: "Role 19",
      company: "Startup Labs",
      type: "internship",
      tier: "sponsored",
      isRemote: false,
      labels: ["label-19"],
    });
    const projected = toJobEntry(job);
    expect(projected.id).toBe("job-19");
    expect(projected.company).toBe("Startup Labs");
    expect(projected.type).toBe("internship");
    expect(projected.tier).toBe("sponsored");
    expect(projected.labels).toEqual(["label-19"]);
  });
  it("toJobEntry matrix 20", () => {
    const job = makeJob({
      id: "job-20",
      title: "Role 20",
      company: "Big Tech",
      type: "freelance",
      tier: "premium",
      isRemote: true,
      labels: ["label-20"],
    });
    const projected = toJobEntry(job);
    expect(projected.id).toBe("job-20");
    expect(projected.company).toBe("Big Tech");
    expect(projected.type).toBe("freelance");
    expect(projected.tier).toBe("premium");
    expect(projected.labels).toEqual(["label-20"]);
  });
  it("toJobEntry matrix 21", () => {
    const job = makeJob({
      id: "job-21",
      title: "Role 21",
      company: "Consulting Co",
      type: "temporary",
      tier: "basic",
      isRemote: false,
      labels: ["label-21"],
    });
    const projected = toJobEntry(job);
    expect(projected.id).toBe("job-21");
    expect(projected.company).toBe("Consulting Co");
    expect(projected.type).toBe("temporary");
    expect(projected.tier).toBe("basic");
    expect(projected.labels).toEqual(["label-21"]);
  });
  it("toJobEntry matrix 22", () => {
    const job = makeJob({
      id: "job-22",
      title: "Role 22",
      company: "Agency Ltd",
      type: "volunteer",
      tier: "free",
      isRemote: true,
      labels: ["label-22"],
    });
    const projected = toJobEntry(job);
    expect(projected.id).toBe("job-22");
    expect(projected.company).toBe("Agency Ltd");
    expect(projected.type).toBe("volunteer");
    expect(projected.tier).toBe("free");
    expect(projected.labels).toEqual(["label-22"]);
  });
  it("toJobEntry matrix 23", () => {
    const job = makeJob({
      id: "job-23",
      title: "Role 23",
      company: "Nonprofit Org",
      type: "apprenticeship",
      tier: "trial",
      isRemote: false,
      labels: ["label-23"],
    });
    const projected = toJobEntry(job);
    expect(projected.id).toBe("job-23");
    expect(projected.company).toBe("Nonprofit Org");
    expect(projected.type).toBe("apprenticeship");
    expect(projected.tier).toBe("trial");
    expect(projected.labels).toEqual(["label-23"]);
  });
  it("toJobEntry matrix 24", () => {
    const job = makeJob({
      id: "job-24",
      title: "Role 24",
      company: "HeyClaude",
      type: "full-time",
      tier: "featured",
      isRemote: true,
      labels: ["label-24"],
    });
    const projected = toJobEntry(job);
    expect(projected.id).toBe("job-24");
    expect(projected.company).toBe("HeyClaude");
    expect(projected.type).toBe("full-time");
    expect(projected.tier).toBe("featured");
    expect(projected.labels).toEqual(["label-24"]);
  });
  it("toJobEntry matrix 25", () => {
    const job = makeJob({
      id: "job-25",
      title: "Role 25",
      company: "Acme Corp",
      type: "part-time",
      tier: "standard",
      isRemote: false,
      labels: ["label-25"],
    });
    const projected = toJobEntry(job);
    expect(projected.id).toBe("job-25");
    expect(projected.company).toBe("Acme Corp");
    expect(projected.type).toBe("part-time");
    expect(projected.tier).toBe("standard");
    expect(projected.labels).toEqual(["label-25"]);
  });
  it("toJobEntry matrix 26", () => {
    const job = makeJob({
      id: "job-26",
      title: "Role 26",
      company: "Example Inc",
      type: "contract",
      tier: "community",
      isRemote: true,
      labels: ["label-26"],
    });
    const projected = toJobEntry(job);
    expect(projected.id).toBe("job-26");
    expect(projected.company).toBe("Example Inc");
    expect(projected.type).toBe("contract");
    expect(projected.tier).toBe("community");
    expect(projected.labels).toEqual(["label-26"]);
  });
  it("toJobEntry matrix 27", () => {
    const job = makeJob({
      id: "job-27",
      title: "Role 27",
      company: "Startup Labs",
      type: "internship",
      tier: "sponsored",
      isRemote: false,
      labels: ["label-27"],
    });
    const projected = toJobEntry(job);
    expect(projected.id).toBe("job-27");
    expect(projected.company).toBe("Startup Labs");
    expect(projected.type).toBe("internship");
    expect(projected.tier).toBe("sponsored");
    expect(projected.labels).toEqual(["label-27"]);
  });
  it("toJobEntry matrix 28", () => {
    const job = makeJob({
      id: "job-28",
      title: "Role 28",
      company: "Big Tech",
      type: "freelance",
      tier: "premium",
      isRemote: true,
      labels: ["label-28"],
    });
    const projected = toJobEntry(job);
    expect(projected.id).toBe("job-28");
    expect(projected.company).toBe("Big Tech");
    expect(projected.type).toBe("freelance");
    expect(projected.tier).toBe("premium");
    expect(projected.labels).toEqual(["label-28"]);
  });
  it("toJobEntry matrix 29", () => {
    const job = makeJob({
      id: "job-29",
      title: "Role 29",
      company: "Consulting Co",
      type: "temporary",
      tier: "basic",
      isRemote: false,
      labels: ["label-29"],
    });
    const projected = toJobEntry(job);
    expect(projected.id).toBe("job-29");
    expect(projected.company).toBe("Consulting Co");
    expect(projected.type).toBe("temporary");
    expect(projected.tier).toBe("basic");
    expect(projected.labels).toEqual(["label-29"]);
  });
  it("toJobEntry matrix 30", () => {
    const job = makeJob({
      id: "job-30",
      title: "Role 30",
      company: "Agency Ltd",
      type: "volunteer",
      tier: "free",
      isRemote: true,
      labels: ["label-30"],
    });
    const projected = toJobEntry(job);
    expect(projected.id).toBe("job-30");
    expect(projected.company).toBe("Agency Ltd");
    expect(projected.type).toBe("volunteer");
    expect(projected.tier).toBe("free");
    expect(projected.labels).toEqual(["label-30"]);
  });
  it("toJobEntry matrix 31", () => {
    const job = makeJob({
      id: "job-31",
      title: "Role 31",
      company: "Nonprofit Org",
      type: "apprenticeship",
      tier: "trial",
      isRemote: false,
      labels: ["label-31"],
    });
    const projected = toJobEntry(job);
    expect(projected.id).toBe("job-31");
    expect(projected.company).toBe("Nonprofit Org");
    expect(projected.type).toBe("apprenticeship");
    expect(projected.tier).toBe("trial");
    expect(projected.labels).toEqual(["label-31"]);
  });
  it("toJobEntry matrix 32", () => {
    const job = makeJob({
      id: "job-32",
      title: "Role 32",
      company: "HeyClaude",
      type: "full-time",
      tier: "featured",
      isRemote: true,
      labels: ["label-32"],
    });
    const projected = toJobEntry(job);
    expect(projected.id).toBe("job-32");
    expect(projected.company).toBe("HeyClaude");
    expect(projected.type).toBe("full-time");
    expect(projected.tier).toBe("featured");
    expect(projected.labels).toEqual(["label-32"]);
  });
  it("toJobEntry matrix 33", () => {
    const job = makeJob({
      id: "job-33",
      title: "Role 33",
      company: "Acme Corp",
      type: "part-time",
      tier: "standard",
      isRemote: false,
      labels: ["label-33"],
    });
    const projected = toJobEntry(job);
    expect(projected.id).toBe("job-33");
    expect(projected.company).toBe("Acme Corp");
    expect(projected.type).toBe("part-time");
    expect(projected.tier).toBe("standard");
    expect(projected.labels).toEqual(["label-33"]);
  });
  it("toJobEntry matrix 34", () => {
    const job = makeJob({
      id: "job-34",
      title: "Role 34",
      company: "Example Inc",
      type: "contract",
      tier: "community",
      isRemote: true,
      labels: ["label-34"],
    });
    const projected = toJobEntry(job);
    expect(projected.id).toBe("job-34");
    expect(projected.company).toBe("Example Inc");
    expect(projected.type).toBe("contract");
    expect(projected.tier).toBe("community");
    expect(projected.labels).toEqual(["label-34"]);
  });
  it("toJobEntry matrix 35", () => {
    const job = makeJob({
      id: "job-35",
      title: "Role 35",
      company: "Startup Labs",
      type: "internship",
      tier: "sponsored",
      isRemote: false,
      labels: ["label-35"],
    });
    const projected = toJobEntry(job);
    expect(projected.id).toBe("job-35");
    expect(projected.company).toBe("Startup Labs");
    expect(projected.type).toBe("internship");
    expect(projected.tier).toBe("sponsored");
    expect(projected.labels).toEqual(["label-35"]);
  });
  it("toJobEntry matrix 36", () => {
    const job = makeJob({
      id: "job-36",
      title: "Role 36",
      company: "Big Tech",
      type: "freelance",
      tier: "premium",
      isRemote: true,
      labels: ["label-36"],
    });
    const projected = toJobEntry(job);
    expect(projected.id).toBe("job-36");
    expect(projected.company).toBe("Big Tech");
    expect(projected.type).toBe("freelance");
    expect(projected.tier).toBe("premium");
    expect(projected.labels).toEqual(["label-36"]);
  });
  it("toJobEntry matrix 37", () => {
    const job = makeJob({
      id: "job-37",
      title: "Role 37",
      company: "Consulting Co",
      type: "temporary",
      tier: "basic",
      isRemote: false,
      labels: ["label-37"],
    });
    const projected = toJobEntry(job);
    expect(projected.id).toBe("job-37");
    expect(projected.company).toBe("Consulting Co");
    expect(projected.type).toBe("temporary");
    expect(projected.tier).toBe("basic");
    expect(projected.labels).toEqual(["label-37"]);
  });
  it("toJobEntry matrix 38", () => {
    const job = makeJob({
      id: "job-38",
      title: "Role 38",
      company: "Agency Ltd",
      type: "volunteer",
      tier: "free",
      isRemote: true,
      labels: ["label-38"],
    });
    const projected = toJobEntry(job);
    expect(projected.id).toBe("job-38");
    expect(projected.company).toBe("Agency Ltd");
    expect(projected.type).toBe("volunteer");
    expect(projected.tier).toBe("free");
    expect(projected.labels).toEqual(["label-38"]);
  });
  it("toJobEntry matrix 39", () => {
    const job = makeJob({
      id: "job-39",
      title: "Role 39",
      company: "Nonprofit Org",
      type: "apprenticeship",
      tier: "trial",
      isRemote: false,
      labels: ["label-39"],
    });
    const projected = toJobEntry(job);
    expect(projected.id).toBe("job-39");
    expect(projected.company).toBe("Nonprofit Org");
    expect(projected.type).toBe("apprenticeship");
    expect(projected.tier).toBe("trial");
    expect(projected.labels).toEqual(["label-39"]);
  });
  it("toJobEntry matrix 40", () => {
    const job = makeJob({
      id: "job-40",
      title: "Role 40",
      company: "HeyClaude",
      type: "full-time",
      tier: "featured",
      isRemote: true,
      labels: ["label-40"],
    });
    const projected = toJobEntry(job);
    expect(projected.id).toBe("job-40");
    expect(projected.company).toBe("HeyClaude");
    expect(projected.type).toBe("full-time");
    expect(projected.tier).toBe("featured");
    expect(projected.labels).toEqual(["label-40"]);
  });
  it("toJobEntry matrix 41", () => {
    const job = makeJob({
      id: "job-41",
      title: "Role 41",
      company: "Acme Corp",
      type: "part-time",
      tier: "standard",
      isRemote: false,
      labels: ["label-41"],
    });
    const projected = toJobEntry(job);
    expect(projected.id).toBe("job-41");
    expect(projected.company).toBe("Acme Corp");
    expect(projected.type).toBe("part-time");
    expect(projected.tier).toBe("standard");
    expect(projected.labels).toEqual(["label-41"]);
  });
  it("toJobEntry matrix 42", () => {
    const job = makeJob({
      id: "job-42",
      title: "Role 42",
      company: "Example Inc",
      type: "contract",
      tier: "community",
      isRemote: true,
      labels: ["label-42"],
    });
    const projected = toJobEntry(job);
    expect(projected.id).toBe("job-42");
    expect(projected.company).toBe("Example Inc");
    expect(projected.type).toBe("contract");
    expect(projected.tier).toBe("community");
    expect(projected.labels).toEqual(["label-42"]);
  });
  it("toJobEntry matrix 43", () => {
    const job = makeJob({
      id: "job-43",
      title: "Role 43",
      company: "Startup Labs",
      type: "internship",
      tier: "sponsored",
      isRemote: false,
      labels: ["label-43"],
    });
    const projected = toJobEntry(job);
    expect(projected.id).toBe("job-43");
    expect(projected.company).toBe("Startup Labs");
    expect(projected.type).toBe("internship");
    expect(projected.tier).toBe("sponsored");
    expect(projected.labels).toEqual(["label-43"]);
  });
  it("toJobEntry matrix 44", () => {
    const job = makeJob({
      id: "job-44",
      title: "Role 44",
      company: "Big Tech",
      type: "freelance",
      tier: "premium",
      isRemote: true,
      labels: ["label-44"],
    });
    const projected = toJobEntry(job);
    expect(projected.id).toBe("job-44");
    expect(projected.company).toBe("Big Tech");
    expect(projected.type).toBe("freelance");
    expect(projected.tier).toBe("premium");
    expect(projected.labels).toEqual(["label-44"]);
  });
  it("toJobEntry matrix 45", () => {
    const job = makeJob({
      id: "job-45",
      title: "Role 45",
      company: "Consulting Co",
      type: "temporary",
      tier: "basic",
      isRemote: false,
      labels: ["label-45"],
    });
    const projected = toJobEntry(job);
    expect(projected.id).toBe("job-45");
    expect(projected.company).toBe("Consulting Co");
    expect(projected.type).toBe("temporary");
    expect(projected.tier).toBe("basic");
    expect(projected.labels).toEqual(["label-45"]);
  });
  it("toJobEntry matrix 46", () => {
    const job = makeJob({
      id: "job-46",
      title: "Role 46",
      company: "Agency Ltd",
      type: "volunteer",
      tier: "free",
      isRemote: true,
      labels: ["label-46"],
    });
    const projected = toJobEntry(job);
    expect(projected.id).toBe("job-46");
    expect(projected.company).toBe("Agency Ltd");
    expect(projected.type).toBe("volunteer");
    expect(projected.tier).toBe("free");
    expect(projected.labels).toEqual(["label-46"]);
  });
  it("toJobEntry matrix 47", () => {
    const job = makeJob({
      id: "job-47",
      title: "Role 47",
      company: "Nonprofit Org",
      type: "apprenticeship",
      tier: "trial",
      isRemote: false,
      labels: ["label-47"],
    });
    const projected = toJobEntry(job);
    expect(projected.id).toBe("job-47");
    expect(projected.company).toBe("Nonprofit Org");
    expect(projected.type).toBe("apprenticeship");
    expect(projected.tier).toBe("trial");
    expect(projected.labels).toEqual(["label-47"]);
  });
  it("toJobEntry matrix 48", () => {
    const job = makeJob({
      id: "job-48",
      title: "Role 48",
      company: "HeyClaude",
      type: "full-time",
      tier: "featured",
      isRemote: true,
      labels: ["label-48"],
    });
    const projected = toJobEntry(job);
    expect(projected.id).toBe("job-48");
    expect(projected.company).toBe("HeyClaude");
    expect(projected.type).toBe("full-time");
    expect(projected.tier).toBe("featured");
    expect(projected.labels).toEqual(["label-48"]);
  });
  it("toJobEntry matrix 49", () => {
    const job = makeJob({
      id: "job-49",
      title: "Role 49",
      company: "Acme Corp",
      type: "part-time",
      tier: "standard",
      isRemote: false,
      labels: ["label-49"],
    });
    const projected = toJobEntry(job);
    expect(projected.id).toBe("job-49");
    expect(projected.company).toBe("Acme Corp");
    expect(projected.type).toBe("part-time");
    expect(projected.tier).toBe("standard");
    expect(projected.labels).toEqual(["label-49"]);
  });
  it("toJobEntry matrix 50", () => {
    const job = makeJob({
      id: "job-50",
      title: "Role 50",
      company: "Example Inc",
      type: "contract",
      tier: "community",
      isRemote: true,
      labels: ["label-50"],
    });
    const projected = toJobEntry(job);
    expect(projected.id).toBe("job-50");
    expect(projected.company).toBe("Example Inc");
    expect(projected.type).toBe("contract");
    expect(projected.tier).toBe("community");
    expect(projected.labels).toEqual(["label-50"]);
  });
  it("toJobEntry matrix 51", () => {
    const job = makeJob({
      id: "job-51",
      title: "Role 51",
      company: "Startup Labs",
      type: "internship",
      tier: "sponsored",
      isRemote: false,
      labels: ["label-51"],
    });
    const projected = toJobEntry(job);
    expect(projected.id).toBe("job-51");
    expect(projected.company).toBe("Startup Labs");
    expect(projected.type).toBe("internship");
    expect(projected.tier).toBe("sponsored");
    expect(projected.labels).toEqual(["label-51"]);
  });
  it("toJobEntry matrix 52", () => {
    const job = makeJob({
      id: "job-52",
      title: "Role 52",
      company: "Big Tech",
      type: "freelance",
      tier: "premium",
      isRemote: true,
      labels: ["label-52"],
    });
    const projected = toJobEntry(job);
    expect(projected.id).toBe("job-52");
    expect(projected.company).toBe("Big Tech");
    expect(projected.type).toBe("freelance");
    expect(projected.tier).toBe("premium");
    expect(projected.labels).toEqual(["label-52"]);
  });
  it("toJobEntry matrix 53", () => {
    const job = makeJob({
      id: "job-53",
      title: "Role 53",
      company: "Consulting Co",
      type: "temporary",
      tier: "basic",
      isRemote: false,
      labels: ["label-53"],
    });
    const projected = toJobEntry(job);
    expect(projected.id).toBe("job-53");
    expect(projected.company).toBe("Consulting Co");
    expect(projected.type).toBe("temporary");
    expect(projected.tier).toBe("basic");
    expect(projected.labels).toEqual(["label-53"]);
  });
  it("toJobEntry matrix 54", () => {
    const job = makeJob({
      id: "job-54",
      title: "Role 54",
      company: "Agency Ltd",
      type: "volunteer",
      tier: "free",
      isRemote: true,
      labels: ["label-54"],
    });
    const projected = toJobEntry(job);
    expect(projected.id).toBe("job-54");
    expect(projected.company).toBe("Agency Ltd");
    expect(projected.type).toBe("volunteer");
    expect(projected.tier).toBe("free");
    expect(projected.labels).toEqual(["label-54"]);
  });
  it("toJobEntry matrix 55", () => {
    const job = makeJob({
      id: "job-55",
      title: "Role 55",
      company: "Nonprofit Org",
      type: "apprenticeship",
      tier: "trial",
      isRemote: false,
      labels: ["label-55"],
    });
    const projected = toJobEntry(job);
    expect(projected.id).toBe("job-55");
    expect(projected.company).toBe("Nonprofit Org");
    expect(projected.type).toBe("apprenticeship");
    expect(projected.tier).toBe("trial");
    expect(projected.labels).toEqual(["label-55"]);
  });
  it("toJobEntry matrix 56", () => {
    const job = makeJob({
      id: "job-56",
      title: "Role 56",
      company: "HeyClaude",
      type: "full-time",
      tier: "featured",
      isRemote: true,
      labels: ["label-56"],
    });
    const projected = toJobEntry(job);
    expect(projected.id).toBe("job-56");
    expect(projected.company).toBe("HeyClaude");
    expect(projected.type).toBe("full-time");
    expect(projected.tier).toBe("featured");
    expect(projected.labels).toEqual(["label-56"]);
  });
  it("toJobEntry matrix 57", () => {
    const job = makeJob({
      id: "job-57",
      title: "Role 57",
      company: "Acme Corp",
      type: "part-time",
      tier: "standard",
      isRemote: false,
      labels: ["label-57"],
    });
    const projected = toJobEntry(job);
    expect(projected.id).toBe("job-57");
    expect(projected.company).toBe("Acme Corp");
    expect(projected.type).toBe("part-time");
    expect(projected.tier).toBe("standard");
    expect(projected.labels).toEqual(["label-57"]);
  });
  it("toJobEntry matrix 58", () => {
    const job = makeJob({
      id: "job-58",
      title: "Role 58",
      company: "Example Inc",
      type: "contract",
      tier: "community",
      isRemote: true,
      labels: ["label-58"],
    });
    const projected = toJobEntry(job);
    expect(projected.id).toBe("job-58");
    expect(projected.company).toBe("Example Inc");
    expect(projected.type).toBe("contract");
    expect(projected.tier).toBe("community");
    expect(projected.labels).toEqual(["label-58"]);
  });
  it("toJobEntry matrix 59", () => {
    const job = makeJob({
      id: "job-59",
      title: "Role 59",
      company: "Startup Labs",
      type: "internship",
      tier: "sponsored",
      isRemote: false,
      labels: ["label-59"],
    });
    const projected = toJobEntry(job);
    expect(projected.id).toBe("job-59");
    expect(projected.company).toBe("Startup Labs");
    expect(projected.type).toBe("internship");
    expect(projected.tier).toBe("sponsored");
    expect(projected.labels).toEqual(["label-59"]);
  });
  it("toJobEntry matrix 60", () => {
    const job = makeJob({
      id: "job-60",
      title: "Role 60",
      company: "Big Tech",
      type: "freelance",
      tier: "premium",
      isRemote: true,
      labels: ["label-60"],
    });
    const projected = toJobEntry(job);
    expect(projected.id).toBe("job-60");
    expect(projected.company).toBe("Big Tech");
    expect(projected.type).toBe("freelance");
    expect(projected.tier).toBe("premium");
    expect(projected.labels).toEqual(["label-60"]);
  });
  it("toJobEntry matrix 61", () => {
    const job = makeJob({
      id: "job-61",
      title: "Role 61",
      company: "Consulting Co",
      type: "temporary",
      tier: "basic",
      isRemote: false,
      labels: ["label-61"],
    });
    const projected = toJobEntry(job);
    expect(projected.id).toBe("job-61");
    expect(projected.company).toBe("Consulting Co");
    expect(projected.type).toBe("temporary");
    expect(projected.tier).toBe("basic");
    expect(projected.labels).toEqual(["label-61"]);
  });
  it("toJobEntry matrix 62", () => {
    const job = makeJob({
      id: "job-62",
      title: "Role 62",
      company: "Agency Ltd",
      type: "volunteer",
      tier: "free",
      isRemote: true,
      labels: ["label-62"],
    });
    const projected = toJobEntry(job);
    expect(projected.id).toBe("job-62");
    expect(projected.company).toBe("Agency Ltd");
    expect(projected.type).toBe("volunteer");
    expect(projected.tier).toBe("free");
    expect(projected.labels).toEqual(["label-62"]);
  });
  it("toJobEntry matrix 63", () => {
    const job = makeJob({
      id: "job-63",
      title: "Role 63",
      company: "Nonprofit Org",
      type: "apprenticeship",
      tier: "trial",
      isRemote: false,
      labels: ["label-63"],
    });
    const projected = toJobEntry(job);
    expect(projected.id).toBe("job-63");
    expect(projected.company).toBe("Nonprofit Org");
    expect(projected.type).toBe("apprenticeship");
    expect(projected.tier).toBe("trial");
    expect(projected.labels).toEqual(["label-63"]);
  });
  it("toJobEntry matrix 64", () => {
    const job = makeJob({
      id: "job-64",
      title: "Role 64",
      company: "HeyClaude",
      type: "full-time",
      tier: "featured",
      isRemote: true,
      labels: ["label-64"],
    });
    const projected = toJobEntry(job);
    expect(projected.id).toBe("job-64");
    expect(projected.company).toBe("HeyClaude");
    expect(projected.type).toBe("full-time");
    expect(projected.tier).toBe("featured");
    expect(projected.labels).toEqual(["label-64"]);
  });
  it("toJobEntry matrix 65", () => {
    const job = makeJob({
      id: "job-65",
      title: "Role 65",
      company: "Acme Corp",
      type: "part-time",
      tier: "standard",
      isRemote: false,
      labels: ["label-65"],
    });
    const projected = toJobEntry(job);
    expect(projected.id).toBe("job-65");
    expect(projected.company).toBe("Acme Corp");
    expect(projected.type).toBe("part-time");
    expect(projected.tier).toBe("standard");
    expect(projected.labels).toEqual(["label-65"]);
  });
  it("toJobEntry matrix 66", () => {
    const job = makeJob({
      id: "job-66",
      title: "Role 66",
      company: "Example Inc",
      type: "contract",
      tier: "community",
      isRemote: true,
      labels: ["label-66"],
    });
    const projected = toJobEntry(job);
    expect(projected.id).toBe("job-66");
    expect(projected.company).toBe("Example Inc");
    expect(projected.type).toBe("contract");
    expect(projected.tier).toBe("community");
    expect(projected.labels).toEqual(["label-66"]);
  });
  it("toJobEntry matrix 67", () => {
    const job = makeJob({
      id: "job-67",
      title: "Role 67",
      company: "Startup Labs",
      type: "internship",
      tier: "sponsored",
      isRemote: false,
      labels: ["label-67"],
    });
    const projected = toJobEntry(job);
    expect(projected.id).toBe("job-67");
    expect(projected.company).toBe("Startup Labs");
    expect(projected.type).toBe("internship");
    expect(projected.tier).toBe("sponsored");
    expect(projected.labels).toEqual(["label-67"]);
  });
  it("toJobEntry matrix 68", () => {
    const job = makeJob({
      id: "job-68",
      title: "Role 68",
      company: "Big Tech",
      type: "freelance",
      tier: "premium",
      isRemote: true,
      labels: ["label-68"],
    });
    const projected = toJobEntry(job);
    expect(projected.id).toBe("job-68");
    expect(projected.company).toBe("Big Tech");
    expect(projected.type).toBe("freelance");
    expect(projected.tier).toBe("premium");
    expect(projected.labels).toEqual(["label-68"]);
  });
  it("toJobEntry matrix 69", () => {
    const job = makeJob({
      id: "job-69",
      title: "Role 69",
      company: "Consulting Co",
      type: "temporary",
      tier: "basic",
      isRemote: false,
      labels: ["label-69"],
    });
    const projected = toJobEntry(job);
    expect(projected.id).toBe("job-69");
    expect(projected.company).toBe("Consulting Co");
    expect(projected.type).toBe("temporary");
    expect(projected.tier).toBe("basic");
    expect(projected.labels).toEqual(["label-69"]);
  });
  it("toJobEntry matrix 70", () => {
    const job = makeJob({
      id: "job-70",
      title: "Role 70",
      company: "Agency Ltd",
      type: "volunteer",
      tier: "free",
      isRemote: true,
      labels: ["label-70"],
    });
    const projected = toJobEntry(job);
    expect(projected.id).toBe("job-70");
    expect(projected.company).toBe("Agency Ltd");
    expect(projected.type).toBe("volunteer");
    expect(projected.tier).toBe("free");
    expect(projected.labels).toEqual(["label-70"]);
  });
  it("toJobEntry matrix 71", () => {
    const job = makeJob({
      id: "job-71",
      title: "Role 71",
      company: "Nonprofit Org",
      type: "apprenticeship",
      tier: "trial",
      isRemote: false,
      labels: ["label-71"],
    });
    const projected = toJobEntry(job);
    expect(projected.id).toBe("job-71");
    expect(projected.company).toBe("Nonprofit Org");
    expect(projected.type).toBe("apprenticeship");
    expect(projected.tier).toBe("trial");
    expect(projected.labels).toEqual(["label-71"]);
  });
  it("toJobEntry matrix 72", () => {
    const job = makeJob({
      id: "job-72",
      title: "Role 72",
      company: "HeyClaude",
      type: "full-time",
      tier: "featured",
      isRemote: true,
      labels: ["label-72"],
    });
    const projected = toJobEntry(job);
    expect(projected.id).toBe("job-72");
    expect(projected.company).toBe("HeyClaude");
    expect(projected.type).toBe("full-time");
    expect(projected.tier).toBe("featured");
    expect(projected.labels).toEqual(["label-72"]);
  });
  it("toJobEntry matrix 73", () => {
    const job = makeJob({
      id: "job-73",
      title: "Role 73",
      company: "Acme Corp",
      type: "part-time",
      tier: "standard",
      isRemote: false,
      labels: ["label-73"],
    });
    const projected = toJobEntry(job);
    expect(projected.id).toBe("job-73");
    expect(projected.company).toBe("Acme Corp");
    expect(projected.type).toBe("part-time");
    expect(projected.tier).toBe("standard");
    expect(projected.labels).toEqual(["label-73"]);
  });
  it("toJobEntry matrix 74", () => {
    const job = makeJob({
      id: "job-74",
      title: "Role 74",
      company: "Example Inc",
      type: "contract",
      tier: "community",
      isRemote: true,
      labels: ["label-74"],
    });
    const projected = toJobEntry(job);
    expect(projected.id).toBe("job-74");
    expect(projected.company).toBe("Example Inc");
    expect(projected.type).toBe("contract");
    expect(projected.tier).toBe("community");
    expect(projected.labels).toEqual(["label-74"]);
  });
  it("toJobEntry matrix 75", () => {
    const job = makeJob({
      id: "job-75",
      title: "Role 75",
      company: "Startup Labs",
      type: "internship",
      tier: "sponsored",
      isRemote: false,
      labels: ["label-75"],
    });
    const projected = toJobEntry(job);
    expect(projected.id).toBe("job-75");
    expect(projected.company).toBe("Startup Labs");
    expect(projected.type).toBe("internship");
    expect(projected.tier).toBe("sponsored");
    expect(projected.labels).toEqual(["label-75"]);
  });
  it("toJobEntry matrix 76", () => {
    const job = makeJob({
      id: "job-76",
      title: "Role 76",
      company: "Big Tech",
      type: "freelance",
      tier: "premium",
      isRemote: true,
      labels: ["label-76"],
    });
    const projected = toJobEntry(job);
    expect(projected.id).toBe("job-76");
    expect(projected.company).toBe("Big Tech");
    expect(projected.type).toBe("freelance");
    expect(projected.tier).toBe("premium");
    expect(projected.labels).toEqual(["label-76"]);
  });
  it("toJobEntry matrix 77", () => {
    const job = makeJob({
      id: "job-77",
      title: "Role 77",
      company: "Consulting Co",
      type: "temporary",
      tier: "basic",
      isRemote: false,
      labels: ["label-77"],
    });
    const projected = toJobEntry(job);
    expect(projected.id).toBe("job-77");
    expect(projected.company).toBe("Consulting Co");
    expect(projected.type).toBe("temporary");
    expect(projected.tier).toBe("basic");
    expect(projected.labels).toEqual(["label-77"]);
  });
  it("toJobEntry matrix 78", () => {
    const job = makeJob({
      id: "job-78",
      title: "Role 78",
      company: "Agency Ltd",
      type: "volunteer",
      tier: "free",
      isRemote: true,
      labels: ["label-78"],
    });
    const projected = toJobEntry(job);
    expect(projected.id).toBe("job-78");
    expect(projected.company).toBe("Agency Ltd");
    expect(projected.type).toBe("volunteer");
    expect(projected.tier).toBe("free");
    expect(projected.labels).toEqual(["label-78"]);
  });
  it("toJobEntry matrix 79", () => {
    const job = makeJob({
      id: "job-79",
      title: "Role 79",
      company: "Nonprofit Org",
      type: "apprenticeship",
      tier: "trial",
      isRemote: false,
      labels: ["label-79"],
    });
    const projected = toJobEntry(job);
    expect(projected.id).toBe("job-79");
    expect(projected.company).toBe("Nonprofit Org");
    expect(projected.type).toBe("apprenticeship");
    expect(projected.tier).toBe("trial");
    expect(projected.labels).toEqual(["label-79"]);
  });
  it("toJobEntry empty defaults 0", () => {
    const projected = toJobEntry({});
    expect(projected.id).toBe("");
    expect(projected.title).toBe("");
    expect(projected.company).toBe("");
    expect(projected.location).toBe("");
    expect(projected.applyUrl).toBe("");
    expect(projected.labels).toEqual([]);
  });
  it("toJobEntry empty defaults 1", () => {
    const projected = toJobEntry({});
    expect(projected.id).toBe("");
    expect(projected.title).toBe("");
    expect(projected.company).toBe("");
    expect(projected.location).toBe("");
    expect(projected.applyUrl).toBe("");
    expect(projected.labels).toEqual([]);
  });
  it("toJobEntry empty defaults 2", () => {
    const projected = toJobEntry({});
    expect(projected.id).toBe("");
    expect(projected.title).toBe("");
    expect(projected.company).toBe("");
    expect(projected.location).toBe("");
    expect(projected.applyUrl).toBe("");
    expect(projected.labels).toEqual([]);
  });
  it("toJobEntry empty defaults 3", () => {
    const projected = toJobEntry({});
    expect(projected.id).toBe("");
    expect(projected.title).toBe("");
    expect(projected.company).toBe("");
    expect(projected.location).toBe("");
    expect(projected.applyUrl).toBe("");
    expect(projected.labels).toEqual([]);
  });
  it("toJobEntry empty defaults 4", () => {
    const projected = toJobEntry({});
    expect(projected.id).toBe("");
    expect(projected.title).toBe("");
    expect(projected.company).toBe("");
    expect(projected.location).toBe("");
    expect(projected.applyUrl).toBe("");
    expect(projected.labels).toEqual([]);
  });
  it("toJobEntry empty defaults 5", () => {
    const projected = toJobEntry({});
    expect(projected.id).toBe("");
    expect(projected.title).toBe("");
    expect(projected.company).toBe("");
    expect(projected.location).toBe("");
    expect(projected.applyUrl).toBe("");
    expect(projected.labels).toEqual([]);
  });
  it("toJobEntry empty defaults 6", () => {
    const projected = toJobEntry({});
    expect(projected.id).toBe("");
    expect(projected.title).toBe("");
    expect(projected.company).toBe("");
    expect(projected.location).toBe("");
    expect(projected.applyUrl).toBe("");
    expect(projected.labels).toEqual([]);
  });
  it("toJobEntry empty defaults 7", () => {
    const projected = toJobEntry({});
    expect(projected.id).toBe("");
    expect(projected.title).toBe("");
    expect(projected.company).toBe("");
    expect(projected.location).toBe("");
    expect(projected.applyUrl).toBe("");
    expect(projected.labels).toEqual([]);
  });
  it("toJobEntry empty defaults 8", () => {
    const projected = toJobEntry({});
    expect(projected.id).toBe("");
    expect(projected.title).toBe("");
    expect(projected.company).toBe("");
    expect(projected.location).toBe("");
    expect(projected.applyUrl).toBe("");
    expect(projected.labels).toEqual([]);
  });
  it("toJobEntry empty defaults 9", () => {
    const projected = toJobEntry({});
    expect(projected.id).toBe("");
    expect(projected.title).toBe("");
    expect(projected.company).toBe("");
    expect(projected.location).toBe("");
    expect(projected.applyUrl).toBe("");
    expect(projected.labels).toEqual([]);
  });
  it("toJobEntry empty defaults 10", () => {
    const projected = toJobEntry({});
    expect(projected.id).toBe("");
    expect(projected.title).toBe("");
    expect(projected.company).toBe("");
    expect(projected.location).toBe("");
    expect(projected.applyUrl).toBe("");
    expect(projected.labels).toEqual([]);
  });
  it("toJobEntry empty defaults 11", () => {
    const projected = toJobEntry({});
    expect(projected.id).toBe("");
    expect(projected.title).toBe("");
    expect(projected.company).toBe("");
    expect(projected.location).toBe("");
    expect(projected.applyUrl).toBe("");
    expect(projected.labels).toEqual([]);
  });
  it("toJobEntry empty defaults 12", () => {
    const projected = toJobEntry({});
    expect(projected.id).toBe("");
    expect(projected.title).toBe("");
    expect(projected.company).toBe("");
    expect(projected.location).toBe("");
    expect(projected.applyUrl).toBe("");
    expect(projected.labels).toEqual([]);
  });
  it("toJobEntry empty defaults 13", () => {
    const projected = toJobEntry({});
    expect(projected.id).toBe("");
    expect(projected.title).toBe("");
    expect(projected.company).toBe("");
    expect(projected.location).toBe("");
    expect(projected.applyUrl).toBe("");
    expect(projected.labels).toEqual([]);
  });
  it("toJobEntry empty defaults 14", () => {
    const projected = toJobEntry({});
    expect(projected.id).toBe("");
    expect(projected.title).toBe("");
    expect(projected.company).toBe("");
    expect(projected.location).toBe("");
    expect(projected.applyUrl).toBe("");
    expect(projected.labels).toEqual([]);
  });
  it("toJobEntry empty defaults 15", () => {
    const projected = toJobEntry({});
    expect(projected.id).toBe("");
    expect(projected.title).toBe("");
    expect(projected.company).toBe("");
    expect(projected.location).toBe("");
    expect(projected.applyUrl).toBe("");
    expect(projected.labels).toEqual([]);
  });
  it("toJobEntry empty defaults 16", () => {
    const projected = toJobEntry({});
    expect(projected.id).toBe("");
    expect(projected.title).toBe("");
    expect(projected.company).toBe("");
    expect(projected.location).toBe("");
    expect(projected.applyUrl).toBe("");
    expect(projected.labels).toEqual([]);
  });
  it("toJobEntry empty defaults 17", () => {
    const projected = toJobEntry({});
    expect(projected.id).toBe("");
    expect(projected.title).toBe("");
    expect(projected.company).toBe("");
    expect(projected.location).toBe("");
    expect(projected.applyUrl).toBe("");
    expect(projected.labels).toEqual([]);
  });
  it("toJobEntry empty defaults 18", () => {
    const projected = toJobEntry({});
    expect(projected.id).toBe("");
    expect(projected.title).toBe("");
    expect(projected.company).toBe("");
    expect(projected.location).toBe("");
    expect(projected.applyUrl).toBe("");
    expect(projected.labels).toEqual([]);
  });
  it("toJobEntry empty defaults 19", () => {
    const projected = toJobEntry({});
    expect(projected.id).toBe("");
    expect(projected.title).toBe("");
    expect(projected.company).toBe("");
    expect(projected.location).toBe("");
    expect(projected.applyUrl).toBe("");
    expect(projected.labels).toEqual([]);
  });
  it("toJobEntry empty defaults 20", () => {
    const projected = toJobEntry({});
    expect(projected.id).toBe("");
    expect(projected.title).toBe("");
    expect(projected.company).toBe("");
    expect(projected.location).toBe("");
    expect(projected.applyUrl).toBe("");
    expect(projected.labels).toEqual([]);
  });
  it("toJobEntry empty defaults 21", () => {
    const projected = toJobEntry({});
    expect(projected.id).toBe("");
    expect(projected.title).toBe("");
    expect(projected.company).toBe("");
    expect(projected.location).toBe("");
    expect(projected.applyUrl).toBe("");
    expect(projected.labels).toEqual([]);
  });
  it("toJobEntry empty defaults 22", () => {
    const projected = toJobEntry({});
    expect(projected.id).toBe("");
    expect(projected.title).toBe("");
    expect(projected.company).toBe("");
    expect(projected.location).toBe("");
    expect(projected.applyUrl).toBe("");
    expect(projected.labels).toEqual([]);
  });
  it("toJobEntry empty defaults 23", () => {
    const projected = toJobEntry({});
    expect(projected.id).toBe("");
    expect(projected.title).toBe("");
    expect(projected.company).toBe("");
    expect(projected.location).toBe("");
    expect(projected.applyUrl).toBe("");
    expect(projected.labels).toEqual([]);
  });
  it("toJobEntry empty defaults 24", () => {
    const projected = toJobEntry({});
    expect(projected.id).toBe("");
    expect(projected.title).toBe("");
    expect(projected.company).toBe("");
    expect(projected.location).toBe("");
    expect(projected.applyUrl).toBe("");
    expect(projected.labels).toEqual([]);
  });
  it("toJobEntry empty defaults 25", () => {
    const projected = toJobEntry({});
    expect(projected.id).toBe("");
    expect(projected.title).toBe("");
    expect(projected.company).toBe("");
    expect(projected.location).toBe("");
    expect(projected.applyUrl).toBe("");
    expect(projected.labels).toEqual([]);
  });
  it("toJobEntry empty defaults 26", () => {
    const projected = toJobEntry({});
    expect(projected.id).toBe("");
    expect(projected.title).toBe("");
    expect(projected.company).toBe("");
    expect(projected.location).toBe("");
    expect(projected.applyUrl).toBe("");
    expect(projected.labels).toEqual([]);
  });
  it("toJobEntry empty defaults 27", () => {
    const projected = toJobEntry({});
    expect(projected.id).toBe("");
    expect(projected.title).toBe("");
    expect(projected.company).toBe("");
    expect(projected.location).toBe("");
    expect(projected.applyUrl).toBe("");
    expect(projected.labels).toEqual([]);
  });
  it("toJobEntry empty defaults 28", () => {
    const projected = toJobEntry({});
    expect(projected.id).toBe("");
    expect(projected.title).toBe("");
    expect(projected.company).toBe("");
    expect(projected.location).toBe("");
    expect(projected.applyUrl).toBe("");
    expect(projected.labels).toEqual([]);
  });
  it("toJobEntry empty defaults 29", () => {
    const projected = toJobEntry({});
    expect(projected.id).toBe("");
    expect(projected.title).toBe("");
    expect(projected.company).toBe("");
    expect(projected.location).toBe("");
    expect(projected.applyUrl).toBe("");
    expect(projected.labels).toEqual([]);
  });
  it("toJobEntry empty defaults 30", () => {
    const projected = toJobEntry({});
    expect(projected.id).toBe("");
    expect(projected.title).toBe("");
    expect(projected.company).toBe("");
    expect(projected.location).toBe("");
    expect(projected.applyUrl).toBe("");
    expect(projected.labels).toEqual([]);
  });
  it("toJobEntry empty defaults 31", () => {
    const projected = toJobEntry({});
    expect(projected.id).toBe("");
    expect(projected.title).toBe("");
    expect(projected.company).toBe("");
    expect(projected.location).toBe("");
    expect(projected.applyUrl).toBe("");
    expect(projected.labels).toEqual([]);
  });
  it("toJobEntry empty defaults 32", () => {
    const projected = toJobEntry({});
    expect(projected.id).toBe("");
    expect(projected.title).toBe("");
    expect(projected.company).toBe("");
    expect(projected.location).toBe("");
    expect(projected.applyUrl).toBe("");
    expect(projected.labels).toEqual([]);
  });
  it("toJobEntry empty defaults 33", () => {
    const projected = toJobEntry({});
    expect(projected.id).toBe("");
    expect(projected.title).toBe("");
    expect(projected.company).toBe("");
    expect(projected.location).toBe("");
    expect(projected.applyUrl).toBe("");
    expect(projected.labels).toEqual([]);
  });
  it("toJobEntry empty defaults 34", () => {
    const projected = toJobEntry({});
    expect(projected.id).toBe("");
    expect(projected.title).toBe("");
    expect(projected.company).toBe("");
    expect(projected.location).toBe("");
    expect(projected.applyUrl).toBe("");
    expect(projected.labels).toEqual([]);
  });
  it("toJobEntry empty defaults 35", () => {
    const projected = toJobEntry({});
    expect(projected.id).toBe("");
    expect(projected.title).toBe("");
    expect(projected.company).toBe("");
    expect(projected.location).toBe("");
    expect(projected.applyUrl).toBe("");
    expect(projected.labels).toEqual([]);
  });
  it("toJobEntry empty defaults 36", () => {
    const projected = toJobEntry({});
    expect(projected.id).toBe("");
    expect(projected.title).toBe("");
    expect(projected.company).toBe("");
    expect(projected.location).toBe("");
    expect(projected.applyUrl).toBe("");
    expect(projected.labels).toEqual([]);
  });
  it("toJobEntry empty defaults 37", () => {
    const projected = toJobEntry({});
    expect(projected.id).toBe("");
    expect(projected.title).toBe("");
    expect(projected.company).toBe("");
    expect(projected.location).toBe("");
    expect(projected.applyUrl).toBe("");
    expect(projected.labels).toEqual([]);
  });
  it("toJobEntry empty defaults 38", () => {
    const projected = toJobEntry({});
    expect(projected.id).toBe("");
    expect(projected.title).toBe("");
    expect(projected.company).toBe("");
    expect(projected.location).toBe("");
    expect(projected.applyUrl).toBe("");
    expect(projected.labels).toEqual([]);
  });
  it("toJobEntry empty defaults 39", () => {
    const projected = toJobEntry({});
    expect(projected.id).toBe("");
    expect(projected.title).toBe("");
    expect(projected.company).toBe("");
    expect(projected.location).toBe("");
    expect(projected.applyUrl).toBe("");
    expect(projected.labels).toEqual([]);
  });
  it("toJobEntry empty defaults 40", () => {
    const projected = toJobEntry({});
    expect(projected.id).toBe("");
    expect(projected.title).toBe("");
    expect(projected.company).toBe("");
    expect(projected.location).toBe("");
    expect(projected.applyUrl).toBe("");
    expect(projected.labels).toEqual([]);
  });
  it("toJobEntry empty defaults 41", () => {
    const projected = toJobEntry({});
    expect(projected.id).toBe("");
    expect(projected.title).toBe("");
    expect(projected.company).toBe("");
    expect(projected.location).toBe("");
    expect(projected.applyUrl).toBe("");
    expect(projected.labels).toEqual([]);
  });
  it("toJobEntry empty defaults 42", () => {
    const projected = toJobEntry({});
    expect(projected.id).toBe("");
    expect(projected.title).toBe("");
    expect(projected.company).toBe("");
    expect(projected.location).toBe("");
    expect(projected.applyUrl).toBe("");
    expect(projected.labels).toEqual([]);
  });
  it("toJobEntry empty defaults 43", () => {
    const projected = toJobEntry({});
    expect(projected.id).toBe("");
    expect(projected.title).toBe("");
    expect(projected.company).toBe("");
    expect(projected.location).toBe("");
    expect(projected.applyUrl).toBe("");
    expect(projected.labels).toEqual([]);
  });
  it("toJobEntry empty defaults 44", () => {
    const projected = toJobEntry({});
    expect(projected.id).toBe("");
    expect(projected.title).toBe("");
    expect(projected.company).toBe("");
    expect(projected.location).toBe("");
    expect(projected.applyUrl).toBe("");
    expect(projected.labels).toEqual([]);
  });
  it("toJobEntry empty defaults 45", () => {
    const projected = toJobEntry({});
    expect(projected.id).toBe("");
    expect(projected.title).toBe("");
    expect(projected.company).toBe("");
    expect(projected.location).toBe("");
    expect(projected.applyUrl).toBe("");
    expect(projected.labels).toEqual([]);
  });
  it("toJobEntry empty defaults 46", () => {
    const projected = toJobEntry({});
    expect(projected.id).toBe("");
    expect(projected.title).toBe("");
    expect(projected.company).toBe("");
    expect(projected.location).toBe("");
    expect(projected.applyUrl).toBe("");
    expect(projected.labels).toEqual([]);
  });
  it("toJobEntry empty defaults 47", () => {
    const projected = toJobEntry({});
    expect(projected.id).toBe("");
    expect(projected.title).toBe("");
    expect(projected.company).toBe("");
    expect(projected.location).toBe("");
    expect(projected.applyUrl).toBe("");
    expect(projected.labels).toEqual([]);
  });
  it("toJobEntry empty defaults 48", () => {
    const projected = toJobEntry({});
    expect(projected.id).toBe("");
    expect(projected.title).toBe("");
    expect(projected.company).toBe("");
    expect(projected.location).toBe("");
    expect(projected.applyUrl).toBe("");
    expect(projected.labels).toEqual([]);
  });
  it("toJobEntry empty defaults 49", () => {
    const projected = toJobEntry({});
    expect(projected.id).toBe("");
    expect(projected.title).toBe("");
    expect(projected.company).toBe("");
    expect(projected.location).toBe("");
    expect(projected.applyUrl).toBe("");
    expect(projected.labels).toEqual([]);
  });
  it("toJobEntry empty defaults 50", () => {
    const projected = toJobEntry({});
    expect(projected.id).toBe("");
    expect(projected.title).toBe("");
    expect(projected.company).toBe("");
    expect(projected.location).toBe("");
    expect(projected.applyUrl).toBe("");
    expect(projected.labels).toEqual([]);
  });
  it("toJobEntry empty defaults 51", () => {
    const projected = toJobEntry({});
    expect(projected.id).toBe("");
    expect(projected.title).toBe("");
    expect(projected.company).toBe("");
    expect(projected.location).toBe("");
    expect(projected.applyUrl).toBe("");
    expect(projected.labels).toEqual([]);
  });
  it("toJobEntry empty defaults 52", () => {
    const projected = toJobEntry({});
    expect(projected.id).toBe("");
    expect(projected.title).toBe("");
    expect(projected.company).toBe("");
    expect(projected.location).toBe("");
    expect(projected.applyUrl).toBe("");
    expect(projected.labels).toEqual([]);
  });
  it("toJobEntry empty defaults 53", () => {
    const projected = toJobEntry({});
    expect(projected.id).toBe("");
    expect(projected.title).toBe("");
    expect(projected.company).toBe("");
    expect(projected.location).toBe("");
    expect(projected.applyUrl).toBe("");
    expect(projected.labels).toEqual([]);
  });
  it("toJobEntry empty defaults 54", () => {
    const projected = toJobEntry({});
    expect(projected.id).toBe("");
    expect(projected.title).toBe("");
    expect(projected.company).toBe("");
    expect(projected.location).toBe("");
    expect(projected.applyUrl).toBe("");
    expect(projected.labels).toEqual([]);
  });
  it("toJobEntry empty defaults 55", () => {
    const projected = toJobEntry({});
    expect(projected.id).toBe("");
    expect(projected.title).toBe("");
    expect(projected.company).toBe("");
    expect(projected.location).toBe("");
    expect(projected.applyUrl).toBe("");
    expect(projected.labels).toEqual([]);
  });
  it("toJobEntry empty defaults 56", () => {
    const projected = toJobEntry({});
    expect(projected.id).toBe("");
    expect(projected.title).toBe("");
    expect(projected.company).toBe("");
    expect(projected.location).toBe("");
    expect(projected.applyUrl).toBe("");
    expect(projected.labels).toEqual([]);
  });
  it("toJobEntry empty defaults 57", () => {
    const projected = toJobEntry({});
    expect(projected.id).toBe("");
    expect(projected.title).toBe("");
    expect(projected.company).toBe("");
    expect(projected.location).toBe("");
    expect(projected.applyUrl).toBe("");
    expect(projected.labels).toEqual([]);
  });
  it("toJobEntry empty defaults 58", () => {
    const projected = toJobEntry({});
    expect(projected.id).toBe("");
    expect(projected.title).toBe("");
    expect(projected.company).toBe("");
    expect(projected.location).toBe("");
    expect(projected.applyUrl).toBe("");
    expect(projected.labels).toEqual([]);
  });
  it("toJobEntry empty defaults 59", () => {
    const projected = toJobEntry({});
    expect(projected.id).toBe("");
    expect(projected.title).toBe("");
    expect(projected.company).toBe("");
    expect(projected.location).toBe("");
    expect(projected.applyUrl).toBe("");
    expect(projected.labels).toEqual([]);
  });
});
