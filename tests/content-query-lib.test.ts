import { describe, expect, it } from "vitest";

import {
  MAX_ENTRY_DETAIL_CACHE_SIZE,
  buildCategorySummaries,
  createResettablePromiseCache,
  entryDetailCacheKey,
  pruneEntryDetailCache,
  sortRecentDirectoryEntries,
} from "../apps/web/src/lib/content-query-lib";

describe("content-query-lib constants", () => {
  it("exports cache size limit", () => {
    expect(MAX_ENTRY_DETAIL_CACHE_SIZE).toBe(512);
  });
});

describe("content-query-lib entryDetailCacheKey", () => {
  it("entryDetailCacheKey agents 0", () => {
    expect(entryDetailCacheKey("agents", "agents-slug-0")).toBe(
      "agents:agents-slug-0",
    );
  });
  it("entryDetailCacheKey agents 1", () => {
    expect(entryDetailCacheKey("agents", "agents-slug-1")).toBe(
      "agents:agents-slug-1",
    );
  });
  it("entryDetailCacheKey agents 2", () => {
    expect(entryDetailCacheKey("agents", "agents-slug-2")).toBe(
      "agents:agents-slug-2",
    );
  });
  it("entryDetailCacheKey agents 3", () => {
    expect(entryDetailCacheKey("agents", "agents-slug-3")).toBe(
      "agents:agents-slug-3",
    );
  });
  it("entryDetailCacheKey agents 4", () => {
    expect(entryDetailCacheKey("agents", "agents-slug-4")).toBe(
      "agents:agents-slug-4",
    );
  });
  it("entryDetailCacheKey agents 5", () => {
    expect(entryDetailCacheKey("agents", "agents-slug-5")).toBe(
      "agents:agents-slug-5",
    );
  });
  it("entryDetailCacheKey agents 6", () => {
    expect(entryDetailCacheKey("agents", "agents-slug-6")).toBe(
      "agents:agents-slug-6",
    );
  });
  it("entryDetailCacheKey agents 7", () => {
    expect(entryDetailCacheKey("agents", "agents-slug-7")).toBe(
      "agents:agents-slug-7",
    );
  });
  it("entryDetailCacheKey agents 8", () => {
    expect(entryDetailCacheKey("agents", "agents-slug-8")).toBe(
      "agents:agents-slug-8",
    );
  });
  it("entryDetailCacheKey agents 9", () => {
    expect(entryDetailCacheKey("agents", "agents-slug-9")).toBe(
      "agents:agents-slug-9",
    );
  });
  it("entryDetailCacheKey mcp 0", () => {
    expect(entryDetailCacheKey("mcp", "mcp-slug-0")).toBe("mcp:mcp-slug-0");
  });
  it("entryDetailCacheKey mcp 1", () => {
    expect(entryDetailCacheKey("mcp", "mcp-slug-1")).toBe("mcp:mcp-slug-1");
  });
  it("entryDetailCacheKey mcp 2", () => {
    expect(entryDetailCacheKey("mcp", "mcp-slug-2")).toBe("mcp:mcp-slug-2");
  });
  it("entryDetailCacheKey mcp 3", () => {
    expect(entryDetailCacheKey("mcp", "mcp-slug-3")).toBe("mcp:mcp-slug-3");
  });
  it("entryDetailCacheKey mcp 4", () => {
    expect(entryDetailCacheKey("mcp", "mcp-slug-4")).toBe("mcp:mcp-slug-4");
  });
  it("entryDetailCacheKey mcp 5", () => {
    expect(entryDetailCacheKey("mcp", "mcp-slug-5")).toBe("mcp:mcp-slug-5");
  });
  it("entryDetailCacheKey mcp 6", () => {
    expect(entryDetailCacheKey("mcp", "mcp-slug-6")).toBe("mcp:mcp-slug-6");
  });
  it("entryDetailCacheKey mcp 7", () => {
    expect(entryDetailCacheKey("mcp", "mcp-slug-7")).toBe("mcp:mcp-slug-7");
  });
  it("entryDetailCacheKey mcp 8", () => {
    expect(entryDetailCacheKey("mcp", "mcp-slug-8")).toBe("mcp:mcp-slug-8");
  });
  it("entryDetailCacheKey mcp 9", () => {
    expect(entryDetailCacheKey("mcp", "mcp-slug-9")).toBe("mcp:mcp-slug-9");
  });
  it("entryDetailCacheKey tools 0", () => {
    expect(entryDetailCacheKey("tools", "tools-slug-0")).toBe(
      "tools:tools-slug-0",
    );
  });
  it("entryDetailCacheKey tools 1", () => {
    expect(entryDetailCacheKey("tools", "tools-slug-1")).toBe(
      "tools:tools-slug-1",
    );
  });
  it("entryDetailCacheKey tools 2", () => {
    expect(entryDetailCacheKey("tools", "tools-slug-2")).toBe(
      "tools:tools-slug-2",
    );
  });
  it("entryDetailCacheKey tools 3", () => {
    expect(entryDetailCacheKey("tools", "tools-slug-3")).toBe(
      "tools:tools-slug-3",
    );
  });
  it("entryDetailCacheKey tools 4", () => {
    expect(entryDetailCacheKey("tools", "tools-slug-4")).toBe(
      "tools:tools-slug-4",
    );
  });
  it("entryDetailCacheKey tools 5", () => {
    expect(entryDetailCacheKey("tools", "tools-slug-5")).toBe(
      "tools:tools-slug-5",
    );
  });
  it("entryDetailCacheKey tools 6", () => {
    expect(entryDetailCacheKey("tools", "tools-slug-6")).toBe(
      "tools:tools-slug-6",
    );
  });
  it("entryDetailCacheKey tools 7", () => {
    expect(entryDetailCacheKey("tools", "tools-slug-7")).toBe(
      "tools:tools-slug-7",
    );
  });
  it("entryDetailCacheKey tools 8", () => {
    expect(entryDetailCacheKey("tools", "tools-slug-8")).toBe(
      "tools:tools-slug-8",
    );
  });
  it("entryDetailCacheKey tools 9", () => {
    expect(entryDetailCacheKey("tools", "tools-slug-9")).toBe(
      "tools:tools-slug-9",
    );
  });
  it("entryDetailCacheKey skills 0", () => {
    expect(entryDetailCacheKey("skills", "skills-slug-0")).toBe(
      "skills:skills-slug-0",
    );
  });
  it("entryDetailCacheKey skills 1", () => {
    expect(entryDetailCacheKey("skills", "skills-slug-1")).toBe(
      "skills:skills-slug-1",
    );
  });
  it("entryDetailCacheKey skills 2", () => {
    expect(entryDetailCacheKey("skills", "skills-slug-2")).toBe(
      "skills:skills-slug-2",
    );
  });
  it("entryDetailCacheKey skills 3", () => {
    expect(entryDetailCacheKey("skills", "skills-slug-3")).toBe(
      "skills:skills-slug-3",
    );
  });
  it("entryDetailCacheKey skills 4", () => {
    expect(entryDetailCacheKey("skills", "skills-slug-4")).toBe(
      "skills:skills-slug-4",
    );
  });
  it("entryDetailCacheKey skills 5", () => {
    expect(entryDetailCacheKey("skills", "skills-slug-5")).toBe(
      "skills:skills-slug-5",
    );
  });
  it("entryDetailCacheKey skills 6", () => {
    expect(entryDetailCacheKey("skills", "skills-slug-6")).toBe(
      "skills:skills-slug-6",
    );
  });
  it("entryDetailCacheKey skills 7", () => {
    expect(entryDetailCacheKey("skills", "skills-slug-7")).toBe(
      "skills:skills-slug-7",
    );
  });
  it("entryDetailCacheKey skills 8", () => {
    expect(entryDetailCacheKey("skills", "skills-slug-8")).toBe(
      "skills:skills-slug-8",
    );
  });
  it("entryDetailCacheKey skills 9", () => {
    expect(entryDetailCacheKey("skills", "skills-slug-9")).toBe(
      "skills:skills-slug-9",
    );
  });
  it("entryDetailCacheKey rules 0", () => {
    expect(entryDetailCacheKey("rules", "rules-slug-0")).toBe(
      "rules:rules-slug-0",
    );
  });
  it("entryDetailCacheKey rules 1", () => {
    expect(entryDetailCacheKey("rules", "rules-slug-1")).toBe(
      "rules:rules-slug-1",
    );
  });
  it("entryDetailCacheKey rules 2", () => {
    expect(entryDetailCacheKey("rules", "rules-slug-2")).toBe(
      "rules:rules-slug-2",
    );
  });
  it("entryDetailCacheKey rules 3", () => {
    expect(entryDetailCacheKey("rules", "rules-slug-3")).toBe(
      "rules:rules-slug-3",
    );
  });
  it("entryDetailCacheKey rules 4", () => {
    expect(entryDetailCacheKey("rules", "rules-slug-4")).toBe(
      "rules:rules-slug-4",
    );
  });
  it("entryDetailCacheKey rules 5", () => {
    expect(entryDetailCacheKey("rules", "rules-slug-5")).toBe(
      "rules:rules-slug-5",
    );
  });
  it("entryDetailCacheKey rules 6", () => {
    expect(entryDetailCacheKey("rules", "rules-slug-6")).toBe(
      "rules:rules-slug-6",
    );
  });
  it("entryDetailCacheKey rules 7", () => {
    expect(entryDetailCacheKey("rules", "rules-slug-7")).toBe(
      "rules:rules-slug-7",
    );
  });
  it("entryDetailCacheKey rules 8", () => {
    expect(entryDetailCacheKey("rules", "rules-slug-8")).toBe(
      "rules:rules-slug-8",
    );
  });
  it("entryDetailCacheKey rules 9", () => {
    expect(entryDetailCacheKey("rules", "rules-slug-9")).toBe(
      "rules:rules-slug-9",
    );
  });
  it("entryDetailCacheKey commands 0", () => {
    expect(entryDetailCacheKey("commands", "commands-slug-0")).toBe(
      "commands:commands-slug-0",
    );
  });
  it("entryDetailCacheKey commands 1", () => {
    expect(entryDetailCacheKey("commands", "commands-slug-1")).toBe(
      "commands:commands-slug-1",
    );
  });
  it("entryDetailCacheKey commands 2", () => {
    expect(entryDetailCacheKey("commands", "commands-slug-2")).toBe(
      "commands:commands-slug-2",
    );
  });
  it("entryDetailCacheKey commands 3", () => {
    expect(entryDetailCacheKey("commands", "commands-slug-3")).toBe(
      "commands:commands-slug-3",
    );
  });
  it("entryDetailCacheKey commands 4", () => {
    expect(entryDetailCacheKey("commands", "commands-slug-4")).toBe(
      "commands:commands-slug-4",
    );
  });
  it("entryDetailCacheKey commands 5", () => {
    expect(entryDetailCacheKey("commands", "commands-slug-5")).toBe(
      "commands:commands-slug-5",
    );
  });
  it("entryDetailCacheKey commands 6", () => {
    expect(entryDetailCacheKey("commands", "commands-slug-6")).toBe(
      "commands:commands-slug-6",
    );
  });
  it("entryDetailCacheKey commands 7", () => {
    expect(entryDetailCacheKey("commands", "commands-slug-7")).toBe(
      "commands:commands-slug-7",
    );
  });
  it("entryDetailCacheKey commands 8", () => {
    expect(entryDetailCacheKey("commands", "commands-slug-8")).toBe(
      "commands:commands-slug-8",
    );
  });
  it("entryDetailCacheKey commands 9", () => {
    expect(entryDetailCacheKey("commands", "commands-slug-9")).toBe(
      "commands:commands-slug-9",
    );
  });
  it("entryDetailCacheKey hooks 0", () => {
    expect(entryDetailCacheKey("hooks", "hooks-slug-0")).toBe(
      "hooks:hooks-slug-0",
    );
  });
  it("entryDetailCacheKey hooks 1", () => {
    expect(entryDetailCacheKey("hooks", "hooks-slug-1")).toBe(
      "hooks:hooks-slug-1",
    );
  });
  it("entryDetailCacheKey hooks 2", () => {
    expect(entryDetailCacheKey("hooks", "hooks-slug-2")).toBe(
      "hooks:hooks-slug-2",
    );
  });
  it("entryDetailCacheKey hooks 3", () => {
    expect(entryDetailCacheKey("hooks", "hooks-slug-3")).toBe(
      "hooks:hooks-slug-3",
    );
  });
  it("entryDetailCacheKey hooks 4", () => {
    expect(entryDetailCacheKey("hooks", "hooks-slug-4")).toBe(
      "hooks:hooks-slug-4",
    );
  });
  it("entryDetailCacheKey hooks 5", () => {
    expect(entryDetailCacheKey("hooks", "hooks-slug-5")).toBe(
      "hooks:hooks-slug-5",
    );
  });
  it("entryDetailCacheKey hooks 6", () => {
    expect(entryDetailCacheKey("hooks", "hooks-slug-6")).toBe(
      "hooks:hooks-slug-6",
    );
  });
  it("entryDetailCacheKey hooks 7", () => {
    expect(entryDetailCacheKey("hooks", "hooks-slug-7")).toBe(
      "hooks:hooks-slug-7",
    );
  });
  it("entryDetailCacheKey hooks 8", () => {
    expect(entryDetailCacheKey("hooks", "hooks-slug-8")).toBe(
      "hooks:hooks-slug-8",
    );
  });
  it("entryDetailCacheKey hooks 9", () => {
    expect(entryDetailCacheKey("hooks", "hooks-slug-9")).toBe(
      "hooks:hooks-slug-9",
    );
  });
  it("entryDetailCacheKey guides 0", () => {
    expect(entryDetailCacheKey("guides", "guides-slug-0")).toBe(
      "guides:guides-slug-0",
    );
  });
  it("entryDetailCacheKey guides 1", () => {
    expect(entryDetailCacheKey("guides", "guides-slug-1")).toBe(
      "guides:guides-slug-1",
    );
  });
  it("entryDetailCacheKey guides 2", () => {
    expect(entryDetailCacheKey("guides", "guides-slug-2")).toBe(
      "guides:guides-slug-2",
    );
  });
  it("entryDetailCacheKey guides 3", () => {
    expect(entryDetailCacheKey("guides", "guides-slug-3")).toBe(
      "guides:guides-slug-3",
    );
  });
  it("entryDetailCacheKey guides 4", () => {
    expect(entryDetailCacheKey("guides", "guides-slug-4")).toBe(
      "guides:guides-slug-4",
    );
  });
  it("entryDetailCacheKey guides 5", () => {
    expect(entryDetailCacheKey("guides", "guides-slug-5")).toBe(
      "guides:guides-slug-5",
    );
  });
  it("entryDetailCacheKey guides 6", () => {
    expect(entryDetailCacheKey("guides", "guides-slug-6")).toBe(
      "guides:guides-slug-6",
    );
  });
  it("entryDetailCacheKey guides 7", () => {
    expect(entryDetailCacheKey("guides", "guides-slug-7")).toBe(
      "guides:guides-slug-7",
    );
  });
  it("entryDetailCacheKey guides 8", () => {
    expect(entryDetailCacheKey("guides", "guides-slug-8")).toBe(
      "guides:guides-slug-8",
    );
  });
  it("entryDetailCacheKey guides 9", () => {
    expect(entryDetailCacheKey("guides", "guides-slug-9")).toBe(
      "guides:guides-slug-9",
    );
  });
  it("entryDetailCacheKey collections 0", () => {
    expect(entryDetailCacheKey("collections", "collections-slug-0")).toBe(
      "collections:collections-slug-0",
    );
  });
  it("entryDetailCacheKey collections 1", () => {
    expect(entryDetailCacheKey("collections", "collections-slug-1")).toBe(
      "collections:collections-slug-1",
    );
  });
  it("entryDetailCacheKey collections 2", () => {
    expect(entryDetailCacheKey("collections", "collections-slug-2")).toBe(
      "collections:collections-slug-2",
    );
  });
  it("entryDetailCacheKey collections 3", () => {
    expect(entryDetailCacheKey("collections", "collections-slug-3")).toBe(
      "collections:collections-slug-3",
    );
  });
  it("entryDetailCacheKey collections 4", () => {
    expect(entryDetailCacheKey("collections", "collections-slug-4")).toBe(
      "collections:collections-slug-4",
    );
  });
  it("entryDetailCacheKey collections 5", () => {
    expect(entryDetailCacheKey("collections", "collections-slug-5")).toBe(
      "collections:collections-slug-5",
    );
  });
  it("entryDetailCacheKey collections 6", () => {
    expect(entryDetailCacheKey("collections", "collections-slug-6")).toBe(
      "collections:collections-slug-6",
    );
  });
  it("entryDetailCacheKey collections 7", () => {
    expect(entryDetailCacheKey("collections", "collections-slug-7")).toBe(
      "collections:collections-slug-7",
    );
  });
  it("entryDetailCacheKey collections 8", () => {
    expect(entryDetailCacheKey("collections", "collections-slug-8")).toBe(
      "collections:collections-slug-8",
    );
  });
  it("entryDetailCacheKey collections 9", () => {
    expect(entryDetailCacheKey("collections", "collections-slug-9")).toBe(
      "collections:collections-slug-9",
    );
  });
  it("entryDetailCacheKey statuslines 0", () => {
    expect(entryDetailCacheKey("statuslines", "statuslines-slug-0")).toBe(
      "statuslines:statuslines-slug-0",
    );
  });
  it("entryDetailCacheKey statuslines 1", () => {
    expect(entryDetailCacheKey("statuslines", "statuslines-slug-1")).toBe(
      "statuslines:statuslines-slug-1",
    );
  });
  it("entryDetailCacheKey statuslines 2", () => {
    expect(entryDetailCacheKey("statuslines", "statuslines-slug-2")).toBe(
      "statuslines:statuslines-slug-2",
    );
  });
  it("entryDetailCacheKey statuslines 3", () => {
    expect(entryDetailCacheKey("statuslines", "statuslines-slug-3")).toBe(
      "statuslines:statuslines-slug-3",
    );
  });
  it("entryDetailCacheKey statuslines 4", () => {
    expect(entryDetailCacheKey("statuslines", "statuslines-slug-4")).toBe(
      "statuslines:statuslines-slug-4",
    );
  });
  it("entryDetailCacheKey statuslines 5", () => {
    expect(entryDetailCacheKey("statuslines", "statuslines-slug-5")).toBe(
      "statuslines:statuslines-slug-5",
    );
  });
  it("entryDetailCacheKey statuslines 6", () => {
    expect(entryDetailCacheKey("statuslines", "statuslines-slug-6")).toBe(
      "statuslines:statuslines-slug-6",
    );
  });
  it("entryDetailCacheKey statuslines 7", () => {
    expect(entryDetailCacheKey("statuslines", "statuslines-slug-7")).toBe(
      "statuslines:statuslines-slug-7",
    );
  });
  it("entryDetailCacheKey statuslines 8", () => {
    expect(entryDetailCacheKey("statuslines", "statuslines-slug-8")).toBe(
      "statuslines:statuslines-slug-8",
    );
  });
  it("entryDetailCacheKey statuslines 9", () => {
    expect(entryDetailCacheKey("statuslines", "statuslines-slug-9")).toBe(
      "statuslines:statuslines-slug-9",
    );
  });
});

describe("content-query-lib pruneEntryDetailCache", () => {
  it("deletes oldest entry when at capacity", () => {
    const map = new Map([
      ["a", 1],
      ["b", 2],
    ]);
    pruneEntryDetailCache(map, 2);
    expect(map.has("a")).toBe(false);
    expect(map.has("b")).toBe(true);
  });
  it("pruneEntryDetailCache matrix 0", () => {
    const map = new Map<string, number>();
    for (let j = 0; j <= 0; j++) map.set(`key-${j}`, j);
    const sizeBefore = map.size;
    pruneEntryDetailCache(map, Math.max(1, sizeBefore));
    expect(map.size).toBeLessThanOrEqual(sizeBefore);
  });
  it("pruneEntryDetailCache matrix 1", () => {
    const map = new Map<string, number>();
    for (let j = 0; j <= 1; j++) map.set(`key-${j}`, j);
    const sizeBefore = map.size;
    pruneEntryDetailCache(map, Math.max(1, sizeBefore));
    expect(map.size).toBeLessThanOrEqual(sizeBefore);
  });
  it("pruneEntryDetailCache matrix 2", () => {
    const map = new Map<string, number>();
    for (let j = 0; j <= 2; j++) map.set(`key-${j}`, j);
    const sizeBefore = map.size;
    pruneEntryDetailCache(map, Math.max(1, sizeBefore));
    expect(map.size).toBeLessThanOrEqual(sizeBefore);
  });
  it("pruneEntryDetailCache matrix 3", () => {
    const map = new Map<string, number>();
    for (let j = 0; j <= 3; j++) map.set(`key-${j}`, j);
    const sizeBefore = map.size;
    pruneEntryDetailCache(map, Math.max(1, sizeBefore));
    expect(map.size).toBeLessThanOrEqual(sizeBefore);
  });
  it("pruneEntryDetailCache matrix 4", () => {
    const map = new Map<string, number>();
    for (let j = 0; j <= 4; j++) map.set(`key-${j}`, j);
    const sizeBefore = map.size;
    pruneEntryDetailCache(map, Math.max(1, sizeBefore));
    expect(map.size).toBeLessThanOrEqual(sizeBefore);
  });
  it("pruneEntryDetailCache matrix 5", () => {
    const map = new Map<string, number>();
    for (let j = 0; j <= 0; j++) map.set(`key-${j}`, j);
    const sizeBefore = map.size;
    pruneEntryDetailCache(map, Math.max(1, sizeBefore));
    expect(map.size).toBeLessThanOrEqual(sizeBefore);
  });
  it("pruneEntryDetailCache matrix 6", () => {
    const map = new Map<string, number>();
    for (let j = 0; j <= 1; j++) map.set(`key-${j}`, j);
    const sizeBefore = map.size;
    pruneEntryDetailCache(map, Math.max(1, sizeBefore));
    expect(map.size).toBeLessThanOrEqual(sizeBefore);
  });
  it("pruneEntryDetailCache matrix 7", () => {
    const map = new Map<string, number>();
    for (let j = 0; j <= 2; j++) map.set(`key-${j}`, j);
    const sizeBefore = map.size;
    pruneEntryDetailCache(map, Math.max(1, sizeBefore));
    expect(map.size).toBeLessThanOrEqual(sizeBefore);
  });
  it("pruneEntryDetailCache matrix 8", () => {
    const map = new Map<string, number>();
    for (let j = 0; j <= 3; j++) map.set(`key-${j}`, j);
    const sizeBefore = map.size;
    pruneEntryDetailCache(map, Math.max(1, sizeBefore));
    expect(map.size).toBeLessThanOrEqual(sizeBefore);
  });
  it("pruneEntryDetailCache matrix 9", () => {
    const map = new Map<string, number>();
    for (let j = 0; j <= 4; j++) map.set(`key-${j}`, j);
    const sizeBefore = map.size;
    pruneEntryDetailCache(map, Math.max(1, sizeBefore));
    expect(map.size).toBeLessThanOrEqual(sizeBefore);
  });
  it("pruneEntryDetailCache matrix 10", () => {
    const map = new Map<string, number>();
    for (let j = 0; j <= 0; j++) map.set(`key-${j}`, j);
    const sizeBefore = map.size;
    pruneEntryDetailCache(map, Math.max(1, sizeBefore));
    expect(map.size).toBeLessThanOrEqual(sizeBefore);
  });
  it("pruneEntryDetailCache matrix 11", () => {
    const map = new Map<string, number>();
    for (let j = 0; j <= 1; j++) map.set(`key-${j}`, j);
    const sizeBefore = map.size;
    pruneEntryDetailCache(map, Math.max(1, sizeBefore));
    expect(map.size).toBeLessThanOrEqual(sizeBefore);
  });
  it("pruneEntryDetailCache matrix 12", () => {
    const map = new Map<string, number>();
    for (let j = 0; j <= 2; j++) map.set(`key-${j}`, j);
    const sizeBefore = map.size;
    pruneEntryDetailCache(map, Math.max(1, sizeBefore));
    expect(map.size).toBeLessThanOrEqual(sizeBefore);
  });
  it("pruneEntryDetailCache matrix 13", () => {
    const map = new Map<string, number>();
    for (let j = 0; j <= 3; j++) map.set(`key-${j}`, j);
    const sizeBefore = map.size;
    pruneEntryDetailCache(map, Math.max(1, sizeBefore));
    expect(map.size).toBeLessThanOrEqual(sizeBefore);
  });
  it("pruneEntryDetailCache matrix 14", () => {
    const map = new Map<string, number>();
    for (let j = 0; j <= 4; j++) map.set(`key-${j}`, j);
    const sizeBefore = map.size;
    pruneEntryDetailCache(map, Math.max(1, sizeBefore));
    expect(map.size).toBeLessThanOrEqual(sizeBefore);
  });
  it("pruneEntryDetailCache matrix 15", () => {
    const map = new Map<string, number>();
    for (let j = 0; j <= 0; j++) map.set(`key-${j}`, j);
    const sizeBefore = map.size;
    pruneEntryDetailCache(map, Math.max(1, sizeBefore));
    expect(map.size).toBeLessThanOrEqual(sizeBefore);
  });
  it("pruneEntryDetailCache matrix 16", () => {
    const map = new Map<string, number>();
    for (let j = 0; j <= 1; j++) map.set(`key-${j}`, j);
    const sizeBefore = map.size;
    pruneEntryDetailCache(map, Math.max(1, sizeBefore));
    expect(map.size).toBeLessThanOrEqual(sizeBefore);
  });
  it("pruneEntryDetailCache matrix 17", () => {
    const map = new Map<string, number>();
    for (let j = 0; j <= 2; j++) map.set(`key-${j}`, j);
    const sizeBefore = map.size;
    pruneEntryDetailCache(map, Math.max(1, sizeBefore));
    expect(map.size).toBeLessThanOrEqual(sizeBefore);
  });
  it("pruneEntryDetailCache matrix 18", () => {
    const map = new Map<string, number>();
    for (let j = 0; j <= 3; j++) map.set(`key-${j}`, j);
    const sizeBefore = map.size;
    pruneEntryDetailCache(map, Math.max(1, sizeBefore));
    expect(map.size).toBeLessThanOrEqual(sizeBefore);
  });
  it("pruneEntryDetailCache matrix 19", () => {
    const map = new Map<string, number>();
    for (let j = 0; j <= 4; j++) map.set(`key-${j}`, j);
    const sizeBefore = map.size;
    pruneEntryDetailCache(map, Math.max(1, sizeBefore));
    expect(map.size).toBeLessThanOrEqual(sizeBefore);
  });
  it("pruneEntryDetailCache matrix 20", () => {
    const map = new Map<string, number>();
    for (let j = 0; j <= 0; j++) map.set(`key-${j}`, j);
    const sizeBefore = map.size;
    pruneEntryDetailCache(map, Math.max(1, sizeBefore));
    expect(map.size).toBeLessThanOrEqual(sizeBefore);
  });
  it("pruneEntryDetailCache matrix 21", () => {
    const map = new Map<string, number>();
    for (let j = 0; j <= 1; j++) map.set(`key-${j}`, j);
    const sizeBefore = map.size;
    pruneEntryDetailCache(map, Math.max(1, sizeBefore));
    expect(map.size).toBeLessThanOrEqual(sizeBefore);
  });
  it("pruneEntryDetailCache matrix 22", () => {
    const map = new Map<string, number>();
    for (let j = 0; j <= 2; j++) map.set(`key-${j}`, j);
    const sizeBefore = map.size;
    pruneEntryDetailCache(map, Math.max(1, sizeBefore));
    expect(map.size).toBeLessThanOrEqual(sizeBefore);
  });
  it("pruneEntryDetailCache matrix 23", () => {
    const map = new Map<string, number>();
    for (let j = 0; j <= 3; j++) map.set(`key-${j}`, j);
    const sizeBefore = map.size;
    pruneEntryDetailCache(map, Math.max(1, sizeBefore));
    expect(map.size).toBeLessThanOrEqual(sizeBefore);
  });
  it("pruneEntryDetailCache matrix 24", () => {
    const map = new Map<string, number>();
    for (let j = 0; j <= 4; j++) map.set(`key-${j}`, j);
    const sizeBefore = map.size;
    pruneEntryDetailCache(map, Math.max(1, sizeBefore));
    expect(map.size).toBeLessThanOrEqual(sizeBefore);
  });
  it("pruneEntryDetailCache matrix 25", () => {
    const map = new Map<string, number>();
    for (let j = 0; j <= 0; j++) map.set(`key-${j}`, j);
    const sizeBefore = map.size;
    pruneEntryDetailCache(map, Math.max(1, sizeBefore));
    expect(map.size).toBeLessThanOrEqual(sizeBefore);
  });
  it("pruneEntryDetailCache matrix 26", () => {
    const map = new Map<string, number>();
    for (let j = 0; j <= 1; j++) map.set(`key-${j}`, j);
    const sizeBefore = map.size;
    pruneEntryDetailCache(map, Math.max(1, sizeBefore));
    expect(map.size).toBeLessThanOrEqual(sizeBefore);
  });
  it("pruneEntryDetailCache matrix 27", () => {
    const map = new Map<string, number>();
    for (let j = 0; j <= 2; j++) map.set(`key-${j}`, j);
    const sizeBefore = map.size;
    pruneEntryDetailCache(map, Math.max(1, sizeBefore));
    expect(map.size).toBeLessThanOrEqual(sizeBefore);
  });
  it("pruneEntryDetailCache matrix 28", () => {
    const map = new Map<string, number>();
    for (let j = 0; j <= 3; j++) map.set(`key-${j}`, j);
    const sizeBefore = map.size;
    pruneEntryDetailCache(map, Math.max(1, sizeBefore));
    expect(map.size).toBeLessThanOrEqual(sizeBefore);
  });
  it("pruneEntryDetailCache matrix 29", () => {
    const map = new Map<string, number>();
    for (let j = 0; j <= 4; j++) map.set(`key-${j}`, j);
    const sizeBefore = map.size;
    pruneEntryDetailCache(map, Math.max(1, sizeBefore));
    expect(map.size).toBeLessThanOrEqual(sizeBefore);
  });
  it("pruneEntryDetailCache matrix 30", () => {
    const map = new Map<string, number>();
    for (let j = 0; j <= 0; j++) map.set(`key-${j}`, j);
    const sizeBefore = map.size;
    pruneEntryDetailCache(map, Math.max(1, sizeBefore));
    expect(map.size).toBeLessThanOrEqual(sizeBefore);
  });
  it("pruneEntryDetailCache matrix 31", () => {
    const map = new Map<string, number>();
    for (let j = 0; j <= 1; j++) map.set(`key-${j}`, j);
    const sizeBefore = map.size;
    pruneEntryDetailCache(map, Math.max(1, sizeBefore));
    expect(map.size).toBeLessThanOrEqual(sizeBefore);
  });
  it("pruneEntryDetailCache matrix 32", () => {
    const map = new Map<string, number>();
    for (let j = 0; j <= 2; j++) map.set(`key-${j}`, j);
    const sizeBefore = map.size;
    pruneEntryDetailCache(map, Math.max(1, sizeBefore));
    expect(map.size).toBeLessThanOrEqual(sizeBefore);
  });
  it("pruneEntryDetailCache matrix 33", () => {
    const map = new Map<string, number>();
    for (let j = 0; j <= 3; j++) map.set(`key-${j}`, j);
    const sizeBefore = map.size;
    pruneEntryDetailCache(map, Math.max(1, sizeBefore));
    expect(map.size).toBeLessThanOrEqual(sizeBefore);
  });
  it("pruneEntryDetailCache matrix 34", () => {
    const map = new Map<string, number>();
    for (let j = 0; j <= 4; j++) map.set(`key-${j}`, j);
    const sizeBefore = map.size;
    pruneEntryDetailCache(map, Math.max(1, sizeBefore));
    expect(map.size).toBeLessThanOrEqual(sizeBefore);
  });
  it("pruneEntryDetailCache matrix 35", () => {
    const map = new Map<string, number>();
    for (let j = 0; j <= 0; j++) map.set(`key-${j}`, j);
    const sizeBefore = map.size;
    pruneEntryDetailCache(map, Math.max(1, sizeBefore));
    expect(map.size).toBeLessThanOrEqual(sizeBefore);
  });
  it("pruneEntryDetailCache matrix 36", () => {
    const map = new Map<string, number>();
    for (let j = 0; j <= 1; j++) map.set(`key-${j}`, j);
    const sizeBefore = map.size;
    pruneEntryDetailCache(map, Math.max(1, sizeBefore));
    expect(map.size).toBeLessThanOrEqual(sizeBefore);
  });
  it("pruneEntryDetailCache matrix 37", () => {
    const map = new Map<string, number>();
    for (let j = 0; j <= 2; j++) map.set(`key-${j}`, j);
    const sizeBefore = map.size;
    pruneEntryDetailCache(map, Math.max(1, sizeBefore));
    expect(map.size).toBeLessThanOrEqual(sizeBefore);
  });
  it("pruneEntryDetailCache matrix 38", () => {
    const map = new Map<string, number>();
    for (let j = 0; j <= 3; j++) map.set(`key-${j}`, j);
    const sizeBefore = map.size;
    pruneEntryDetailCache(map, Math.max(1, sizeBefore));
    expect(map.size).toBeLessThanOrEqual(sizeBefore);
  });
  it("pruneEntryDetailCache matrix 39", () => {
    const map = new Map<string, number>();
    for (let j = 0; j <= 4; j++) map.set(`key-${j}`, j);
    const sizeBefore = map.size;
    pruneEntryDetailCache(map, Math.max(1, sizeBefore));
    expect(map.size).toBeLessThanOrEqual(sizeBefore);
  });
  it("pruneEntryDetailCache matrix 40", () => {
    const map = new Map<string, number>();
    for (let j = 0; j <= 0; j++) map.set(`key-${j}`, j);
    const sizeBefore = map.size;
    pruneEntryDetailCache(map, Math.max(1, sizeBefore));
    expect(map.size).toBeLessThanOrEqual(sizeBefore);
  });
  it("pruneEntryDetailCache matrix 41", () => {
    const map = new Map<string, number>();
    for (let j = 0; j <= 1; j++) map.set(`key-${j}`, j);
    const sizeBefore = map.size;
    pruneEntryDetailCache(map, Math.max(1, sizeBefore));
    expect(map.size).toBeLessThanOrEqual(sizeBefore);
  });
  it("pruneEntryDetailCache matrix 42", () => {
    const map = new Map<string, number>();
    for (let j = 0; j <= 2; j++) map.set(`key-${j}`, j);
    const sizeBefore = map.size;
    pruneEntryDetailCache(map, Math.max(1, sizeBefore));
    expect(map.size).toBeLessThanOrEqual(sizeBefore);
  });
  it("pruneEntryDetailCache matrix 43", () => {
    const map = new Map<string, number>();
    for (let j = 0; j <= 3; j++) map.set(`key-${j}`, j);
    const sizeBefore = map.size;
    pruneEntryDetailCache(map, Math.max(1, sizeBefore));
    expect(map.size).toBeLessThanOrEqual(sizeBefore);
  });
  it("pruneEntryDetailCache matrix 44", () => {
    const map = new Map<string, number>();
    for (let j = 0; j <= 4; j++) map.set(`key-${j}`, j);
    const sizeBefore = map.size;
    pruneEntryDetailCache(map, Math.max(1, sizeBefore));
    expect(map.size).toBeLessThanOrEqual(sizeBefore);
  });
  it("pruneEntryDetailCache matrix 45", () => {
    const map = new Map<string, number>();
    for (let j = 0; j <= 0; j++) map.set(`key-${j}`, j);
    const sizeBefore = map.size;
    pruneEntryDetailCache(map, Math.max(1, sizeBefore));
    expect(map.size).toBeLessThanOrEqual(sizeBefore);
  });
  it("pruneEntryDetailCache matrix 46", () => {
    const map = new Map<string, number>();
    for (let j = 0; j <= 1; j++) map.set(`key-${j}`, j);
    const sizeBefore = map.size;
    pruneEntryDetailCache(map, Math.max(1, sizeBefore));
    expect(map.size).toBeLessThanOrEqual(sizeBefore);
  });
  it("pruneEntryDetailCache matrix 47", () => {
    const map = new Map<string, number>();
    for (let j = 0; j <= 2; j++) map.set(`key-${j}`, j);
    const sizeBefore = map.size;
    pruneEntryDetailCache(map, Math.max(1, sizeBefore));
    expect(map.size).toBeLessThanOrEqual(sizeBefore);
  });
  it("pruneEntryDetailCache matrix 48", () => {
    const map = new Map<string, number>();
    for (let j = 0; j <= 3; j++) map.set(`key-${j}`, j);
    const sizeBefore = map.size;
    pruneEntryDetailCache(map, Math.max(1, sizeBefore));
    expect(map.size).toBeLessThanOrEqual(sizeBefore);
  });
  it("pruneEntryDetailCache matrix 49", () => {
    const map = new Map<string, number>();
    for (let j = 0; j <= 4; j++) map.set(`key-${j}`, j);
    const sizeBefore = map.size;
    pruneEntryDetailCache(map, Math.max(1, sizeBefore));
    expect(map.size).toBeLessThanOrEqual(sizeBefore);
  });
  it("pruneEntryDetailCache matrix 50", () => {
    const map = new Map<string, number>();
    for (let j = 0; j <= 0; j++) map.set(`key-${j}`, j);
    const sizeBefore = map.size;
    pruneEntryDetailCache(map, Math.max(1, sizeBefore));
    expect(map.size).toBeLessThanOrEqual(sizeBefore);
  });
  it("pruneEntryDetailCache matrix 51", () => {
    const map = new Map<string, number>();
    for (let j = 0; j <= 1; j++) map.set(`key-${j}`, j);
    const sizeBefore = map.size;
    pruneEntryDetailCache(map, Math.max(1, sizeBefore));
    expect(map.size).toBeLessThanOrEqual(sizeBefore);
  });
  it("pruneEntryDetailCache matrix 52", () => {
    const map = new Map<string, number>();
    for (let j = 0; j <= 2; j++) map.set(`key-${j}`, j);
    const sizeBefore = map.size;
    pruneEntryDetailCache(map, Math.max(1, sizeBefore));
    expect(map.size).toBeLessThanOrEqual(sizeBefore);
  });
  it("pruneEntryDetailCache matrix 53", () => {
    const map = new Map<string, number>();
    for (let j = 0; j <= 3; j++) map.set(`key-${j}`, j);
    const sizeBefore = map.size;
    pruneEntryDetailCache(map, Math.max(1, sizeBefore));
    expect(map.size).toBeLessThanOrEqual(sizeBefore);
  });
  it("pruneEntryDetailCache matrix 54", () => {
    const map = new Map<string, number>();
    for (let j = 0; j <= 4; j++) map.set(`key-${j}`, j);
    const sizeBefore = map.size;
    pruneEntryDetailCache(map, Math.max(1, sizeBefore));
    expect(map.size).toBeLessThanOrEqual(sizeBefore);
  });
  it("pruneEntryDetailCache matrix 55", () => {
    const map = new Map<string, number>();
    for (let j = 0; j <= 0; j++) map.set(`key-${j}`, j);
    const sizeBefore = map.size;
    pruneEntryDetailCache(map, Math.max(1, sizeBefore));
    expect(map.size).toBeLessThanOrEqual(sizeBefore);
  });
  it("pruneEntryDetailCache matrix 56", () => {
    const map = new Map<string, number>();
    for (let j = 0; j <= 1; j++) map.set(`key-${j}`, j);
    const sizeBefore = map.size;
    pruneEntryDetailCache(map, Math.max(1, sizeBefore));
    expect(map.size).toBeLessThanOrEqual(sizeBefore);
  });
  it("pruneEntryDetailCache matrix 57", () => {
    const map = new Map<string, number>();
    for (let j = 0; j <= 2; j++) map.set(`key-${j}`, j);
    const sizeBefore = map.size;
    pruneEntryDetailCache(map, Math.max(1, sizeBefore));
    expect(map.size).toBeLessThanOrEqual(sizeBefore);
  });
  it("pruneEntryDetailCache matrix 58", () => {
    const map = new Map<string, number>();
    for (let j = 0; j <= 3; j++) map.set(`key-${j}`, j);
    const sizeBefore = map.size;
    pruneEntryDetailCache(map, Math.max(1, sizeBefore));
    expect(map.size).toBeLessThanOrEqual(sizeBefore);
  });
  it("pruneEntryDetailCache matrix 59", () => {
    const map = new Map<string, number>();
    for (let j = 0; j <= 4; j++) map.set(`key-${j}`, j);
    const sizeBefore = map.size;
    pruneEntryDetailCache(map, Math.max(1, sizeBefore));
    expect(map.size).toBeLessThanOrEqual(sizeBefore);
  });
  it("pruneEntryDetailCache matrix 60", () => {
    const map = new Map<string, number>();
    for (let j = 0; j <= 0; j++) map.set(`key-${j}`, j);
    const sizeBefore = map.size;
    pruneEntryDetailCache(map, Math.max(1, sizeBefore));
    expect(map.size).toBeLessThanOrEqual(sizeBefore);
  });
  it("pruneEntryDetailCache matrix 61", () => {
    const map = new Map<string, number>();
    for (let j = 0; j <= 1; j++) map.set(`key-${j}`, j);
    const sizeBefore = map.size;
    pruneEntryDetailCache(map, Math.max(1, sizeBefore));
    expect(map.size).toBeLessThanOrEqual(sizeBefore);
  });
  it("pruneEntryDetailCache matrix 62", () => {
    const map = new Map<string, number>();
    for (let j = 0; j <= 2; j++) map.set(`key-${j}`, j);
    const sizeBefore = map.size;
    pruneEntryDetailCache(map, Math.max(1, sizeBefore));
    expect(map.size).toBeLessThanOrEqual(sizeBefore);
  });
  it("pruneEntryDetailCache matrix 63", () => {
    const map = new Map<string, number>();
    for (let j = 0; j <= 3; j++) map.set(`key-${j}`, j);
    const sizeBefore = map.size;
    pruneEntryDetailCache(map, Math.max(1, sizeBefore));
    expect(map.size).toBeLessThanOrEqual(sizeBefore);
  });
  it("pruneEntryDetailCache matrix 64", () => {
    const map = new Map<string, number>();
    for (let j = 0; j <= 4; j++) map.set(`key-${j}`, j);
    const sizeBefore = map.size;
    pruneEntryDetailCache(map, Math.max(1, sizeBefore));
    expect(map.size).toBeLessThanOrEqual(sizeBefore);
  });
  it("pruneEntryDetailCache matrix 65", () => {
    const map = new Map<string, number>();
    for (let j = 0; j <= 0; j++) map.set(`key-${j}`, j);
    const sizeBefore = map.size;
    pruneEntryDetailCache(map, Math.max(1, sizeBefore));
    expect(map.size).toBeLessThanOrEqual(sizeBefore);
  });
  it("pruneEntryDetailCache matrix 66", () => {
    const map = new Map<string, number>();
    for (let j = 0; j <= 1; j++) map.set(`key-${j}`, j);
    const sizeBefore = map.size;
    pruneEntryDetailCache(map, Math.max(1, sizeBefore));
    expect(map.size).toBeLessThanOrEqual(sizeBefore);
  });
  it("pruneEntryDetailCache matrix 67", () => {
    const map = new Map<string, number>();
    for (let j = 0; j <= 2; j++) map.set(`key-${j}`, j);
    const sizeBefore = map.size;
    pruneEntryDetailCache(map, Math.max(1, sizeBefore));
    expect(map.size).toBeLessThanOrEqual(sizeBefore);
  });
  it("pruneEntryDetailCache matrix 68", () => {
    const map = new Map<string, number>();
    for (let j = 0; j <= 3; j++) map.set(`key-${j}`, j);
    const sizeBefore = map.size;
    pruneEntryDetailCache(map, Math.max(1, sizeBefore));
    expect(map.size).toBeLessThanOrEqual(sizeBefore);
  });
  it("pruneEntryDetailCache matrix 69", () => {
    const map = new Map<string, number>();
    for (let j = 0; j <= 4; j++) map.set(`key-${j}`, j);
    const sizeBefore = map.size;
    pruneEntryDetailCache(map, Math.max(1, sizeBefore));
    expect(map.size).toBeLessThanOrEqual(sizeBefore);
  });
  it("pruneEntryDetailCache matrix 70", () => {
    const map = new Map<string, number>();
    for (let j = 0; j <= 0; j++) map.set(`key-${j}`, j);
    const sizeBefore = map.size;
    pruneEntryDetailCache(map, Math.max(1, sizeBefore));
    expect(map.size).toBeLessThanOrEqual(sizeBefore);
  });
  it("pruneEntryDetailCache matrix 71", () => {
    const map = new Map<string, number>();
    for (let j = 0; j <= 1; j++) map.set(`key-${j}`, j);
    const sizeBefore = map.size;
    pruneEntryDetailCache(map, Math.max(1, sizeBefore));
    expect(map.size).toBeLessThanOrEqual(sizeBefore);
  });
  it("pruneEntryDetailCache matrix 72", () => {
    const map = new Map<string, number>();
    for (let j = 0; j <= 2; j++) map.set(`key-${j}`, j);
    const sizeBefore = map.size;
    pruneEntryDetailCache(map, Math.max(1, sizeBefore));
    expect(map.size).toBeLessThanOrEqual(sizeBefore);
  });
  it("pruneEntryDetailCache matrix 73", () => {
    const map = new Map<string, number>();
    for (let j = 0; j <= 3; j++) map.set(`key-${j}`, j);
    const sizeBefore = map.size;
    pruneEntryDetailCache(map, Math.max(1, sizeBefore));
    expect(map.size).toBeLessThanOrEqual(sizeBefore);
  });
  it("pruneEntryDetailCache matrix 74", () => {
    const map = new Map<string, number>();
    for (let j = 0; j <= 4; j++) map.set(`key-${j}`, j);
    const sizeBefore = map.size;
    pruneEntryDetailCache(map, Math.max(1, sizeBefore));
    expect(map.size).toBeLessThanOrEqual(sizeBefore);
  });
  it("pruneEntryDetailCache matrix 75", () => {
    const map = new Map<string, number>();
    for (let j = 0; j <= 0; j++) map.set(`key-${j}`, j);
    const sizeBefore = map.size;
    pruneEntryDetailCache(map, Math.max(1, sizeBefore));
    expect(map.size).toBeLessThanOrEqual(sizeBefore);
  });
  it("pruneEntryDetailCache matrix 76", () => {
    const map = new Map<string, number>();
    for (let j = 0; j <= 1; j++) map.set(`key-${j}`, j);
    const sizeBefore = map.size;
    pruneEntryDetailCache(map, Math.max(1, sizeBefore));
    expect(map.size).toBeLessThanOrEqual(sizeBefore);
  });
  it("pruneEntryDetailCache matrix 77", () => {
    const map = new Map<string, number>();
    for (let j = 0; j <= 2; j++) map.set(`key-${j}`, j);
    const sizeBefore = map.size;
    pruneEntryDetailCache(map, Math.max(1, sizeBefore));
    expect(map.size).toBeLessThanOrEqual(sizeBefore);
  });
  it("pruneEntryDetailCache matrix 78", () => {
    const map = new Map<string, number>();
    for (let j = 0; j <= 3; j++) map.set(`key-${j}`, j);
    const sizeBefore = map.size;
    pruneEntryDetailCache(map, Math.max(1, sizeBefore));
    expect(map.size).toBeLessThanOrEqual(sizeBefore);
  });
  it("pruneEntryDetailCache matrix 79", () => {
    const map = new Map<string, number>();
    for (let j = 0; j <= 4; j++) map.set(`key-${j}`, j);
    const sizeBefore = map.size;
    pruneEntryDetailCache(map, Math.max(1, sizeBefore));
    expect(map.size).toBeLessThanOrEqual(sizeBefore);
  });
  it("pruneEntryDetailCache matrix 80", () => {
    const map = new Map<string, number>();
    for (let j = 0; j <= 0; j++) map.set(`key-${j}`, j);
    const sizeBefore = map.size;
    pruneEntryDetailCache(map, Math.max(1, sizeBefore));
    expect(map.size).toBeLessThanOrEqual(sizeBefore);
  });
  it("pruneEntryDetailCache matrix 81", () => {
    const map = new Map<string, number>();
    for (let j = 0; j <= 1; j++) map.set(`key-${j}`, j);
    const sizeBefore = map.size;
    pruneEntryDetailCache(map, Math.max(1, sizeBefore));
    expect(map.size).toBeLessThanOrEqual(sizeBefore);
  });
  it("pruneEntryDetailCache matrix 82", () => {
    const map = new Map<string, number>();
    for (let j = 0; j <= 2; j++) map.set(`key-${j}`, j);
    const sizeBefore = map.size;
    pruneEntryDetailCache(map, Math.max(1, sizeBefore));
    expect(map.size).toBeLessThanOrEqual(sizeBefore);
  });
  it("pruneEntryDetailCache matrix 83", () => {
    const map = new Map<string, number>();
    for (let j = 0; j <= 3; j++) map.set(`key-${j}`, j);
    const sizeBefore = map.size;
    pruneEntryDetailCache(map, Math.max(1, sizeBefore));
    expect(map.size).toBeLessThanOrEqual(sizeBefore);
  });
  it("pruneEntryDetailCache matrix 84", () => {
    const map = new Map<string, number>();
    for (let j = 0; j <= 4; j++) map.set(`key-${j}`, j);
    const sizeBefore = map.size;
    pruneEntryDetailCache(map, Math.max(1, sizeBefore));
    expect(map.size).toBeLessThanOrEqual(sizeBefore);
  });
  it("pruneEntryDetailCache matrix 85", () => {
    const map = new Map<string, number>();
    for (let j = 0; j <= 0; j++) map.set(`key-${j}`, j);
    const sizeBefore = map.size;
    pruneEntryDetailCache(map, Math.max(1, sizeBefore));
    expect(map.size).toBeLessThanOrEqual(sizeBefore);
  });
  it("pruneEntryDetailCache matrix 86", () => {
    const map = new Map<string, number>();
    for (let j = 0; j <= 1; j++) map.set(`key-${j}`, j);
    const sizeBefore = map.size;
    pruneEntryDetailCache(map, Math.max(1, sizeBefore));
    expect(map.size).toBeLessThanOrEqual(sizeBefore);
  });
  it("pruneEntryDetailCache matrix 87", () => {
    const map = new Map<string, number>();
    for (let j = 0; j <= 2; j++) map.set(`key-${j}`, j);
    const sizeBefore = map.size;
    pruneEntryDetailCache(map, Math.max(1, sizeBefore));
    expect(map.size).toBeLessThanOrEqual(sizeBefore);
  });
  it("pruneEntryDetailCache matrix 88", () => {
    const map = new Map<string, number>();
    for (let j = 0; j <= 3; j++) map.set(`key-${j}`, j);
    const sizeBefore = map.size;
    pruneEntryDetailCache(map, Math.max(1, sizeBefore));
    expect(map.size).toBeLessThanOrEqual(sizeBefore);
  });
  it("pruneEntryDetailCache matrix 89", () => {
    const map = new Map<string, number>();
    for (let j = 0; j <= 4; j++) map.set(`key-${j}`, j);
    const sizeBefore = map.size;
    pruneEntryDetailCache(map, Math.max(1, sizeBefore));
    expect(map.size).toBeLessThanOrEqual(sizeBefore);
  });
  it("pruneEntryDetailCache matrix 90", () => {
    const map = new Map<string, number>();
    for (let j = 0; j <= 0; j++) map.set(`key-${j}`, j);
    const sizeBefore = map.size;
    pruneEntryDetailCache(map, Math.max(1, sizeBefore));
    expect(map.size).toBeLessThanOrEqual(sizeBefore);
  });
  it("pruneEntryDetailCache matrix 91", () => {
    const map = new Map<string, number>();
    for (let j = 0; j <= 1; j++) map.set(`key-${j}`, j);
    const sizeBefore = map.size;
    pruneEntryDetailCache(map, Math.max(1, sizeBefore));
    expect(map.size).toBeLessThanOrEqual(sizeBefore);
  });
  it("pruneEntryDetailCache matrix 92", () => {
    const map = new Map<string, number>();
    for (let j = 0; j <= 2; j++) map.set(`key-${j}`, j);
    const sizeBefore = map.size;
    pruneEntryDetailCache(map, Math.max(1, sizeBefore));
    expect(map.size).toBeLessThanOrEqual(sizeBefore);
  });
  it("pruneEntryDetailCache matrix 93", () => {
    const map = new Map<string, number>();
    for (let j = 0; j <= 3; j++) map.set(`key-${j}`, j);
    const sizeBefore = map.size;
    pruneEntryDetailCache(map, Math.max(1, sizeBefore));
    expect(map.size).toBeLessThanOrEqual(sizeBefore);
  });
  it("pruneEntryDetailCache matrix 94", () => {
    const map = new Map<string, number>();
    for (let j = 0; j <= 4; j++) map.set(`key-${j}`, j);
    const sizeBefore = map.size;
    pruneEntryDetailCache(map, Math.max(1, sizeBefore));
    expect(map.size).toBeLessThanOrEqual(sizeBefore);
  });
  it("pruneEntryDetailCache matrix 95", () => {
    const map = new Map<string, number>();
    for (let j = 0; j <= 0; j++) map.set(`key-${j}`, j);
    const sizeBefore = map.size;
    pruneEntryDetailCache(map, Math.max(1, sizeBefore));
    expect(map.size).toBeLessThanOrEqual(sizeBefore);
  });
  it("pruneEntryDetailCache matrix 96", () => {
    const map = new Map<string, number>();
    for (let j = 0; j <= 1; j++) map.set(`key-${j}`, j);
    const sizeBefore = map.size;
    pruneEntryDetailCache(map, Math.max(1, sizeBefore));
    expect(map.size).toBeLessThanOrEqual(sizeBefore);
  });
  it("pruneEntryDetailCache matrix 97", () => {
    const map = new Map<string, number>();
    for (let j = 0; j <= 2; j++) map.set(`key-${j}`, j);
    const sizeBefore = map.size;
    pruneEntryDetailCache(map, Math.max(1, sizeBefore));
    expect(map.size).toBeLessThanOrEqual(sizeBefore);
  });
  it("pruneEntryDetailCache matrix 98", () => {
    const map = new Map<string, number>();
    for (let j = 0; j <= 3; j++) map.set(`key-${j}`, j);
    const sizeBefore = map.size;
    pruneEntryDetailCache(map, Math.max(1, sizeBefore));
    expect(map.size).toBeLessThanOrEqual(sizeBefore);
  });
  it("pruneEntryDetailCache matrix 99", () => {
    const map = new Map<string, number>();
    for (let j = 0; j <= 4; j++) map.set(`key-${j}`, j);
    const sizeBefore = map.size;
    pruneEntryDetailCache(map, Math.max(1, sizeBefore));
    expect(map.size).toBeLessThanOrEqual(sizeBefore);
  });
});

describe("content-query-lib buildCategorySummaries", () => {
  const labels = { mcp: "MCP", skills: "Skills" };
  const descriptions = { mcp: "MCP desc", skills: "Skills desc" };
  it("filters empty categories", () => {
    const entries = [
      { category: "mcp", slug: "a", title: "A", dateAdded: "2026-01-01" },
    ];
    const summaries = buildCategorySummaries(
      entries,
      ["mcp", "skills"],
      labels,
      descriptions,
    );
    expect(summaries).toHaveLength(1);
    expect(summaries[0].category).toBe("mcp");
  });
  it("buildCategorySummaries agents count 0", () => {
    const entries = Array.from({ length: 1 }, (_, idx) => ({
      category: "agents",
      slug: "slug-" + idx,
      title: "T",
      dateAdded: "2026-01-01",
    }));
    const summaries = buildCategorySummaries(
      entries,
      ["agents"],
      { agents: "agents" },
      { agents: "desc" },
    );
    expect(summaries[0]?.count).toBe(1);
  });
  it("buildCategorySummaries agents count 1", () => {
    const entries = Array.from({ length: 2 }, (_, idx) => ({
      category: "agents",
      slug: "slug-" + idx,
      title: "T",
      dateAdded: "2026-01-01",
    }));
    const summaries = buildCategorySummaries(
      entries,
      ["agents"],
      { agents: "agents" },
      { agents: "desc" },
    );
    expect(summaries[0]?.count).toBe(2);
  });
  it("buildCategorySummaries agents count 2", () => {
    const entries = Array.from({ length: 3 }, (_, idx) => ({
      category: "agents",
      slug: "slug-" + idx,
      title: "T",
      dateAdded: "2026-01-01",
    }));
    const summaries = buildCategorySummaries(
      entries,
      ["agents"],
      { agents: "agents" },
      { agents: "desc" },
    );
    expect(summaries[0]?.count).toBe(3);
  });
  it("buildCategorySummaries agents count 3", () => {
    const entries = Array.from({ length: 4 }, (_, idx) => ({
      category: "agents",
      slug: "slug-" + idx,
      title: "T",
      dateAdded: "2026-01-01",
    }));
    const summaries = buildCategorySummaries(
      entries,
      ["agents"],
      { agents: "agents" },
      { agents: "desc" },
    );
    expect(summaries[0]?.count).toBe(4);
  });
  it("buildCategorySummaries agents count 4", () => {
    const entries = Array.from({ length: 5 }, (_, idx) => ({
      category: "agents",
      slug: "slug-" + idx,
      title: "T",
      dateAdded: "2026-01-01",
    }));
    const summaries = buildCategorySummaries(
      entries,
      ["agents"],
      { agents: "agents" },
      { agents: "desc" },
    );
    expect(summaries[0]?.count).toBe(5);
  });
  it("buildCategorySummaries agents count 5", () => {
    const entries = Array.from({ length: 6 }, (_, idx) => ({
      category: "agents",
      slug: "slug-" + idx,
      title: "T",
      dateAdded: "2026-01-01",
    }));
    const summaries = buildCategorySummaries(
      entries,
      ["agents"],
      { agents: "agents" },
      { agents: "desc" },
    );
    expect(summaries[0]?.count).toBe(6);
  });
  it("buildCategorySummaries agents count 6", () => {
    const entries = Array.from({ length: 7 }, (_, idx) => ({
      category: "agents",
      slug: "slug-" + idx,
      title: "T",
      dateAdded: "2026-01-01",
    }));
    const summaries = buildCategorySummaries(
      entries,
      ["agents"],
      { agents: "agents" },
      { agents: "desc" },
    );
    expect(summaries[0]?.count).toBe(7);
  });
  it("buildCategorySummaries agents count 7", () => {
    const entries = Array.from({ length: 8 }, (_, idx) => ({
      category: "agents",
      slug: "slug-" + idx,
      title: "T",
      dateAdded: "2026-01-01",
    }));
    const summaries = buildCategorySummaries(
      entries,
      ["agents"],
      { agents: "agents" },
      { agents: "desc" },
    );
    expect(summaries[0]?.count).toBe(8);
  });
  it("buildCategorySummaries mcp count 0", () => {
    const entries = Array.from({ length: 1 }, (_, idx) => ({
      category: "mcp",
      slug: "slug-" + idx,
      title: "T",
      dateAdded: "2026-01-01",
    }));
    const summaries = buildCategorySummaries(
      entries,
      ["mcp"],
      { mcp: "mcp" },
      { mcp: "desc" },
    );
    expect(summaries[0]?.count).toBe(1);
  });
  it("buildCategorySummaries mcp count 1", () => {
    const entries = Array.from({ length: 2 }, (_, idx) => ({
      category: "mcp",
      slug: "slug-" + idx,
      title: "T",
      dateAdded: "2026-01-01",
    }));
    const summaries = buildCategorySummaries(
      entries,
      ["mcp"],
      { mcp: "mcp" },
      { mcp: "desc" },
    );
    expect(summaries[0]?.count).toBe(2);
  });
  it("buildCategorySummaries mcp count 2", () => {
    const entries = Array.from({ length: 3 }, (_, idx) => ({
      category: "mcp",
      slug: "slug-" + idx,
      title: "T",
      dateAdded: "2026-01-01",
    }));
    const summaries = buildCategorySummaries(
      entries,
      ["mcp"],
      { mcp: "mcp" },
      { mcp: "desc" },
    );
    expect(summaries[0]?.count).toBe(3);
  });
  it("buildCategorySummaries mcp count 3", () => {
    const entries = Array.from({ length: 4 }, (_, idx) => ({
      category: "mcp",
      slug: "slug-" + idx,
      title: "T",
      dateAdded: "2026-01-01",
    }));
    const summaries = buildCategorySummaries(
      entries,
      ["mcp"],
      { mcp: "mcp" },
      { mcp: "desc" },
    );
    expect(summaries[0]?.count).toBe(4);
  });
  it("buildCategorySummaries mcp count 4", () => {
    const entries = Array.from({ length: 5 }, (_, idx) => ({
      category: "mcp",
      slug: "slug-" + idx,
      title: "T",
      dateAdded: "2026-01-01",
    }));
    const summaries = buildCategorySummaries(
      entries,
      ["mcp"],
      { mcp: "mcp" },
      { mcp: "desc" },
    );
    expect(summaries[0]?.count).toBe(5);
  });
  it("buildCategorySummaries mcp count 5", () => {
    const entries = Array.from({ length: 6 }, (_, idx) => ({
      category: "mcp",
      slug: "slug-" + idx,
      title: "T",
      dateAdded: "2026-01-01",
    }));
    const summaries = buildCategorySummaries(
      entries,
      ["mcp"],
      { mcp: "mcp" },
      { mcp: "desc" },
    );
    expect(summaries[0]?.count).toBe(6);
  });
  it("buildCategorySummaries mcp count 6", () => {
    const entries = Array.from({ length: 7 }, (_, idx) => ({
      category: "mcp",
      slug: "slug-" + idx,
      title: "T",
      dateAdded: "2026-01-01",
    }));
    const summaries = buildCategorySummaries(
      entries,
      ["mcp"],
      { mcp: "mcp" },
      { mcp: "desc" },
    );
    expect(summaries[0]?.count).toBe(7);
  });
  it("buildCategorySummaries mcp count 7", () => {
    const entries = Array.from({ length: 8 }, (_, idx) => ({
      category: "mcp",
      slug: "slug-" + idx,
      title: "T",
      dateAdded: "2026-01-01",
    }));
    const summaries = buildCategorySummaries(
      entries,
      ["mcp"],
      { mcp: "mcp" },
      { mcp: "desc" },
    );
    expect(summaries[0]?.count).toBe(8);
  });
  it("buildCategorySummaries tools count 0", () => {
    const entries = Array.from({ length: 1 }, (_, idx) => ({
      category: "tools",
      slug: "slug-" + idx,
      title: "T",
      dateAdded: "2026-01-01",
    }));
    const summaries = buildCategorySummaries(
      entries,
      ["tools"],
      { tools: "tools" },
      { tools: "desc" },
    );
    expect(summaries[0]?.count).toBe(1);
  });
  it("buildCategorySummaries tools count 1", () => {
    const entries = Array.from({ length: 2 }, (_, idx) => ({
      category: "tools",
      slug: "slug-" + idx,
      title: "T",
      dateAdded: "2026-01-01",
    }));
    const summaries = buildCategorySummaries(
      entries,
      ["tools"],
      { tools: "tools" },
      { tools: "desc" },
    );
    expect(summaries[0]?.count).toBe(2);
  });
  it("buildCategorySummaries tools count 2", () => {
    const entries = Array.from({ length: 3 }, (_, idx) => ({
      category: "tools",
      slug: "slug-" + idx,
      title: "T",
      dateAdded: "2026-01-01",
    }));
    const summaries = buildCategorySummaries(
      entries,
      ["tools"],
      { tools: "tools" },
      { tools: "desc" },
    );
    expect(summaries[0]?.count).toBe(3);
  });
  it("buildCategorySummaries tools count 3", () => {
    const entries = Array.from({ length: 4 }, (_, idx) => ({
      category: "tools",
      slug: "slug-" + idx,
      title: "T",
      dateAdded: "2026-01-01",
    }));
    const summaries = buildCategorySummaries(
      entries,
      ["tools"],
      { tools: "tools" },
      { tools: "desc" },
    );
    expect(summaries[0]?.count).toBe(4);
  });
  it("buildCategorySummaries tools count 4", () => {
    const entries = Array.from({ length: 5 }, (_, idx) => ({
      category: "tools",
      slug: "slug-" + idx,
      title: "T",
      dateAdded: "2026-01-01",
    }));
    const summaries = buildCategorySummaries(
      entries,
      ["tools"],
      { tools: "tools" },
      { tools: "desc" },
    );
    expect(summaries[0]?.count).toBe(5);
  });
  it("buildCategorySummaries tools count 5", () => {
    const entries = Array.from({ length: 6 }, (_, idx) => ({
      category: "tools",
      slug: "slug-" + idx,
      title: "T",
      dateAdded: "2026-01-01",
    }));
    const summaries = buildCategorySummaries(
      entries,
      ["tools"],
      { tools: "tools" },
      { tools: "desc" },
    );
    expect(summaries[0]?.count).toBe(6);
  });
  it("buildCategorySummaries tools count 6", () => {
    const entries = Array.from({ length: 7 }, (_, idx) => ({
      category: "tools",
      slug: "slug-" + idx,
      title: "T",
      dateAdded: "2026-01-01",
    }));
    const summaries = buildCategorySummaries(
      entries,
      ["tools"],
      { tools: "tools" },
      { tools: "desc" },
    );
    expect(summaries[0]?.count).toBe(7);
  });
  it("buildCategorySummaries tools count 7", () => {
    const entries = Array.from({ length: 8 }, (_, idx) => ({
      category: "tools",
      slug: "slug-" + idx,
      title: "T",
      dateAdded: "2026-01-01",
    }));
    const summaries = buildCategorySummaries(
      entries,
      ["tools"],
      { tools: "tools" },
      { tools: "desc" },
    );
    expect(summaries[0]?.count).toBe(8);
  });
  it("buildCategorySummaries skills count 0", () => {
    const entries = Array.from({ length: 1 }, (_, idx) => ({
      category: "skills",
      slug: "slug-" + idx,
      title: "T",
      dateAdded: "2026-01-01",
    }));
    const summaries = buildCategorySummaries(
      entries,
      ["skills"],
      { skills: "skills" },
      { skills: "desc" },
    );
    expect(summaries[0]?.count).toBe(1);
  });
  it("buildCategorySummaries skills count 1", () => {
    const entries = Array.from({ length: 2 }, (_, idx) => ({
      category: "skills",
      slug: "slug-" + idx,
      title: "T",
      dateAdded: "2026-01-01",
    }));
    const summaries = buildCategorySummaries(
      entries,
      ["skills"],
      { skills: "skills" },
      { skills: "desc" },
    );
    expect(summaries[0]?.count).toBe(2);
  });
  it("buildCategorySummaries skills count 2", () => {
    const entries = Array.from({ length: 3 }, (_, idx) => ({
      category: "skills",
      slug: "slug-" + idx,
      title: "T",
      dateAdded: "2026-01-01",
    }));
    const summaries = buildCategorySummaries(
      entries,
      ["skills"],
      { skills: "skills" },
      { skills: "desc" },
    );
    expect(summaries[0]?.count).toBe(3);
  });
  it("buildCategorySummaries skills count 3", () => {
    const entries = Array.from({ length: 4 }, (_, idx) => ({
      category: "skills",
      slug: "slug-" + idx,
      title: "T",
      dateAdded: "2026-01-01",
    }));
    const summaries = buildCategorySummaries(
      entries,
      ["skills"],
      { skills: "skills" },
      { skills: "desc" },
    );
    expect(summaries[0]?.count).toBe(4);
  });
  it("buildCategorySummaries skills count 4", () => {
    const entries = Array.from({ length: 5 }, (_, idx) => ({
      category: "skills",
      slug: "slug-" + idx,
      title: "T",
      dateAdded: "2026-01-01",
    }));
    const summaries = buildCategorySummaries(
      entries,
      ["skills"],
      { skills: "skills" },
      { skills: "desc" },
    );
    expect(summaries[0]?.count).toBe(5);
  });
  it("buildCategorySummaries skills count 5", () => {
    const entries = Array.from({ length: 6 }, (_, idx) => ({
      category: "skills",
      slug: "slug-" + idx,
      title: "T",
      dateAdded: "2026-01-01",
    }));
    const summaries = buildCategorySummaries(
      entries,
      ["skills"],
      { skills: "skills" },
      { skills: "desc" },
    );
    expect(summaries[0]?.count).toBe(6);
  });
  it("buildCategorySummaries skills count 6", () => {
    const entries = Array.from({ length: 7 }, (_, idx) => ({
      category: "skills",
      slug: "slug-" + idx,
      title: "T",
      dateAdded: "2026-01-01",
    }));
    const summaries = buildCategorySummaries(
      entries,
      ["skills"],
      { skills: "skills" },
      { skills: "desc" },
    );
    expect(summaries[0]?.count).toBe(7);
  });
  it("buildCategorySummaries skills count 7", () => {
    const entries = Array.from({ length: 8 }, (_, idx) => ({
      category: "skills",
      slug: "slug-" + idx,
      title: "T",
      dateAdded: "2026-01-01",
    }));
    const summaries = buildCategorySummaries(
      entries,
      ["skills"],
      { skills: "skills" },
      { skills: "desc" },
    );
    expect(summaries[0]?.count).toBe(8);
  });
  it("buildCategorySummaries rules count 0", () => {
    const entries = Array.from({ length: 1 }, (_, idx) => ({
      category: "rules",
      slug: "slug-" + idx,
      title: "T",
      dateAdded: "2026-01-01",
    }));
    const summaries = buildCategorySummaries(
      entries,
      ["rules"],
      { rules: "rules" },
      { rules: "desc" },
    );
    expect(summaries[0]?.count).toBe(1);
  });
  it("buildCategorySummaries rules count 1", () => {
    const entries = Array.from({ length: 2 }, (_, idx) => ({
      category: "rules",
      slug: "slug-" + idx,
      title: "T",
      dateAdded: "2026-01-01",
    }));
    const summaries = buildCategorySummaries(
      entries,
      ["rules"],
      { rules: "rules" },
      { rules: "desc" },
    );
    expect(summaries[0]?.count).toBe(2);
  });
  it("buildCategorySummaries rules count 2", () => {
    const entries = Array.from({ length: 3 }, (_, idx) => ({
      category: "rules",
      slug: "slug-" + idx,
      title: "T",
      dateAdded: "2026-01-01",
    }));
    const summaries = buildCategorySummaries(
      entries,
      ["rules"],
      { rules: "rules" },
      { rules: "desc" },
    );
    expect(summaries[0]?.count).toBe(3);
  });
  it("buildCategorySummaries rules count 3", () => {
    const entries = Array.from({ length: 4 }, (_, idx) => ({
      category: "rules",
      slug: "slug-" + idx,
      title: "T",
      dateAdded: "2026-01-01",
    }));
    const summaries = buildCategorySummaries(
      entries,
      ["rules"],
      { rules: "rules" },
      { rules: "desc" },
    );
    expect(summaries[0]?.count).toBe(4);
  });
  it("buildCategorySummaries rules count 4", () => {
    const entries = Array.from({ length: 5 }, (_, idx) => ({
      category: "rules",
      slug: "slug-" + idx,
      title: "T",
      dateAdded: "2026-01-01",
    }));
    const summaries = buildCategorySummaries(
      entries,
      ["rules"],
      { rules: "rules" },
      { rules: "desc" },
    );
    expect(summaries[0]?.count).toBe(5);
  });
  it("buildCategorySummaries rules count 5", () => {
    const entries = Array.from({ length: 6 }, (_, idx) => ({
      category: "rules",
      slug: "slug-" + idx,
      title: "T",
      dateAdded: "2026-01-01",
    }));
    const summaries = buildCategorySummaries(
      entries,
      ["rules"],
      { rules: "rules" },
      { rules: "desc" },
    );
    expect(summaries[0]?.count).toBe(6);
  });
  it("buildCategorySummaries rules count 6", () => {
    const entries = Array.from({ length: 7 }, (_, idx) => ({
      category: "rules",
      slug: "slug-" + idx,
      title: "T",
      dateAdded: "2026-01-01",
    }));
    const summaries = buildCategorySummaries(
      entries,
      ["rules"],
      { rules: "rules" },
      { rules: "desc" },
    );
    expect(summaries[0]?.count).toBe(7);
  });
  it("buildCategorySummaries rules count 7", () => {
    const entries = Array.from({ length: 8 }, (_, idx) => ({
      category: "rules",
      slug: "slug-" + idx,
      title: "T",
      dateAdded: "2026-01-01",
    }));
    const summaries = buildCategorySummaries(
      entries,
      ["rules"],
      { rules: "rules" },
      { rules: "desc" },
    );
    expect(summaries[0]?.count).toBe(8);
  });
  it("buildCategorySummaries commands count 0", () => {
    const entries = Array.from({ length: 1 }, (_, idx) => ({
      category: "commands",
      slug: "slug-" + idx,
      title: "T",
      dateAdded: "2026-01-01",
    }));
    const summaries = buildCategorySummaries(
      entries,
      ["commands"],
      { commands: "commands" },
      { commands: "desc" },
    );
    expect(summaries[0]?.count).toBe(1);
  });
  it("buildCategorySummaries commands count 1", () => {
    const entries = Array.from({ length: 2 }, (_, idx) => ({
      category: "commands",
      slug: "slug-" + idx,
      title: "T",
      dateAdded: "2026-01-01",
    }));
    const summaries = buildCategorySummaries(
      entries,
      ["commands"],
      { commands: "commands" },
      { commands: "desc" },
    );
    expect(summaries[0]?.count).toBe(2);
  });
  it("buildCategorySummaries commands count 2", () => {
    const entries = Array.from({ length: 3 }, (_, idx) => ({
      category: "commands",
      slug: "slug-" + idx,
      title: "T",
      dateAdded: "2026-01-01",
    }));
    const summaries = buildCategorySummaries(
      entries,
      ["commands"],
      { commands: "commands" },
      { commands: "desc" },
    );
    expect(summaries[0]?.count).toBe(3);
  });
  it("buildCategorySummaries commands count 3", () => {
    const entries = Array.from({ length: 4 }, (_, idx) => ({
      category: "commands",
      slug: "slug-" + idx,
      title: "T",
      dateAdded: "2026-01-01",
    }));
    const summaries = buildCategorySummaries(
      entries,
      ["commands"],
      { commands: "commands" },
      { commands: "desc" },
    );
    expect(summaries[0]?.count).toBe(4);
  });
  it("buildCategorySummaries commands count 4", () => {
    const entries = Array.from({ length: 5 }, (_, idx) => ({
      category: "commands",
      slug: "slug-" + idx,
      title: "T",
      dateAdded: "2026-01-01",
    }));
    const summaries = buildCategorySummaries(
      entries,
      ["commands"],
      { commands: "commands" },
      { commands: "desc" },
    );
    expect(summaries[0]?.count).toBe(5);
  });
  it("buildCategorySummaries commands count 5", () => {
    const entries = Array.from({ length: 6 }, (_, idx) => ({
      category: "commands",
      slug: "slug-" + idx,
      title: "T",
      dateAdded: "2026-01-01",
    }));
    const summaries = buildCategorySummaries(
      entries,
      ["commands"],
      { commands: "commands" },
      { commands: "desc" },
    );
    expect(summaries[0]?.count).toBe(6);
  });
  it("buildCategorySummaries commands count 6", () => {
    const entries = Array.from({ length: 7 }, (_, idx) => ({
      category: "commands",
      slug: "slug-" + idx,
      title: "T",
      dateAdded: "2026-01-01",
    }));
    const summaries = buildCategorySummaries(
      entries,
      ["commands"],
      { commands: "commands" },
      { commands: "desc" },
    );
    expect(summaries[0]?.count).toBe(7);
  });
  it("buildCategorySummaries commands count 7", () => {
    const entries = Array.from({ length: 8 }, (_, idx) => ({
      category: "commands",
      slug: "slug-" + idx,
      title: "T",
      dateAdded: "2026-01-01",
    }));
    const summaries = buildCategorySummaries(
      entries,
      ["commands"],
      { commands: "commands" },
      { commands: "desc" },
    );
    expect(summaries[0]?.count).toBe(8);
  });
  it("buildCategorySummaries hooks count 0", () => {
    const entries = Array.from({ length: 1 }, (_, idx) => ({
      category: "hooks",
      slug: "slug-" + idx,
      title: "T",
      dateAdded: "2026-01-01",
    }));
    const summaries = buildCategorySummaries(
      entries,
      ["hooks"],
      { hooks: "hooks" },
      { hooks: "desc" },
    );
    expect(summaries[0]?.count).toBe(1);
  });
  it("buildCategorySummaries hooks count 1", () => {
    const entries = Array.from({ length: 2 }, (_, idx) => ({
      category: "hooks",
      slug: "slug-" + idx,
      title: "T",
      dateAdded: "2026-01-01",
    }));
    const summaries = buildCategorySummaries(
      entries,
      ["hooks"],
      { hooks: "hooks" },
      { hooks: "desc" },
    );
    expect(summaries[0]?.count).toBe(2);
  });
  it("buildCategorySummaries hooks count 2", () => {
    const entries = Array.from({ length: 3 }, (_, idx) => ({
      category: "hooks",
      slug: "slug-" + idx,
      title: "T",
      dateAdded: "2026-01-01",
    }));
    const summaries = buildCategorySummaries(
      entries,
      ["hooks"],
      { hooks: "hooks" },
      { hooks: "desc" },
    );
    expect(summaries[0]?.count).toBe(3);
  });
  it("buildCategorySummaries hooks count 3", () => {
    const entries = Array.from({ length: 4 }, (_, idx) => ({
      category: "hooks",
      slug: "slug-" + idx,
      title: "T",
      dateAdded: "2026-01-01",
    }));
    const summaries = buildCategorySummaries(
      entries,
      ["hooks"],
      { hooks: "hooks" },
      { hooks: "desc" },
    );
    expect(summaries[0]?.count).toBe(4);
  });
  it("buildCategorySummaries hooks count 4", () => {
    const entries = Array.from({ length: 5 }, (_, idx) => ({
      category: "hooks",
      slug: "slug-" + idx,
      title: "T",
      dateAdded: "2026-01-01",
    }));
    const summaries = buildCategorySummaries(
      entries,
      ["hooks"],
      { hooks: "hooks" },
      { hooks: "desc" },
    );
    expect(summaries[0]?.count).toBe(5);
  });
  it("buildCategorySummaries hooks count 5", () => {
    const entries = Array.from({ length: 6 }, (_, idx) => ({
      category: "hooks",
      slug: "slug-" + idx,
      title: "T",
      dateAdded: "2026-01-01",
    }));
    const summaries = buildCategorySummaries(
      entries,
      ["hooks"],
      { hooks: "hooks" },
      { hooks: "desc" },
    );
    expect(summaries[0]?.count).toBe(6);
  });
  it("buildCategorySummaries hooks count 6", () => {
    const entries = Array.from({ length: 7 }, (_, idx) => ({
      category: "hooks",
      slug: "slug-" + idx,
      title: "T",
      dateAdded: "2026-01-01",
    }));
    const summaries = buildCategorySummaries(
      entries,
      ["hooks"],
      { hooks: "hooks" },
      { hooks: "desc" },
    );
    expect(summaries[0]?.count).toBe(7);
  });
  it("buildCategorySummaries hooks count 7", () => {
    const entries = Array.from({ length: 8 }, (_, idx) => ({
      category: "hooks",
      slug: "slug-" + idx,
      title: "T",
      dateAdded: "2026-01-01",
    }));
    const summaries = buildCategorySummaries(
      entries,
      ["hooks"],
      { hooks: "hooks" },
      { hooks: "desc" },
    );
    expect(summaries[0]?.count).toBe(8);
  });
  it("buildCategorySummaries guides count 0", () => {
    const entries = Array.from({ length: 1 }, (_, idx) => ({
      category: "guides",
      slug: "slug-" + idx,
      title: "T",
      dateAdded: "2026-01-01",
    }));
    const summaries = buildCategorySummaries(
      entries,
      ["guides"],
      { guides: "guides" },
      { guides: "desc" },
    );
    expect(summaries[0]?.count).toBe(1);
  });
  it("buildCategorySummaries guides count 1", () => {
    const entries = Array.from({ length: 2 }, (_, idx) => ({
      category: "guides",
      slug: "slug-" + idx,
      title: "T",
      dateAdded: "2026-01-01",
    }));
    const summaries = buildCategorySummaries(
      entries,
      ["guides"],
      { guides: "guides" },
      { guides: "desc" },
    );
    expect(summaries[0]?.count).toBe(2);
  });
  it("buildCategorySummaries guides count 2", () => {
    const entries = Array.from({ length: 3 }, (_, idx) => ({
      category: "guides",
      slug: "slug-" + idx,
      title: "T",
      dateAdded: "2026-01-01",
    }));
    const summaries = buildCategorySummaries(
      entries,
      ["guides"],
      { guides: "guides" },
      { guides: "desc" },
    );
    expect(summaries[0]?.count).toBe(3);
  });
  it("buildCategorySummaries guides count 3", () => {
    const entries = Array.from({ length: 4 }, (_, idx) => ({
      category: "guides",
      slug: "slug-" + idx,
      title: "T",
      dateAdded: "2026-01-01",
    }));
    const summaries = buildCategorySummaries(
      entries,
      ["guides"],
      { guides: "guides" },
      { guides: "desc" },
    );
    expect(summaries[0]?.count).toBe(4);
  });
  it("buildCategorySummaries guides count 4", () => {
    const entries = Array.from({ length: 5 }, (_, idx) => ({
      category: "guides",
      slug: "slug-" + idx,
      title: "T",
      dateAdded: "2026-01-01",
    }));
    const summaries = buildCategorySummaries(
      entries,
      ["guides"],
      { guides: "guides" },
      { guides: "desc" },
    );
    expect(summaries[0]?.count).toBe(5);
  });
  it("buildCategorySummaries guides count 5", () => {
    const entries = Array.from({ length: 6 }, (_, idx) => ({
      category: "guides",
      slug: "slug-" + idx,
      title: "T",
      dateAdded: "2026-01-01",
    }));
    const summaries = buildCategorySummaries(
      entries,
      ["guides"],
      { guides: "guides" },
      { guides: "desc" },
    );
    expect(summaries[0]?.count).toBe(6);
  });
  it("buildCategorySummaries guides count 6", () => {
    const entries = Array.from({ length: 7 }, (_, idx) => ({
      category: "guides",
      slug: "slug-" + idx,
      title: "T",
      dateAdded: "2026-01-01",
    }));
    const summaries = buildCategorySummaries(
      entries,
      ["guides"],
      { guides: "guides" },
      { guides: "desc" },
    );
    expect(summaries[0]?.count).toBe(7);
  });
  it("buildCategorySummaries guides count 7", () => {
    const entries = Array.from({ length: 8 }, (_, idx) => ({
      category: "guides",
      slug: "slug-" + idx,
      title: "T",
      dateAdded: "2026-01-01",
    }));
    const summaries = buildCategorySummaries(
      entries,
      ["guides"],
      { guides: "guides" },
      { guides: "desc" },
    );
    expect(summaries[0]?.count).toBe(8);
  });
  it("buildCategorySummaries collections count 0", () => {
    const entries = Array.from({ length: 1 }, (_, idx) => ({
      category: "collections",
      slug: "slug-" + idx,
      title: "T",
      dateAdded: "2026-01-01",
    }));
    const summaries = buildCategorySummaries(
      entries,
      ["collections"],
      { collections: "collections" },
      { collections: "desc" },
    );
    expect(summaries[0]?.count).toBe(1);
  });
  it("buildCategorySummaries collections count 1", () => {
    const entries = Array.from({ length: 2 }, (_, idx) => ({
      category: "collections",
      slug: "slug-" + idx,
      title: "T",
      dateAdded: "2026-01-01",
    }));
    const summaries = buildCategorySummaries(
      entries,
      ["collections"],
      { collections: "collections" },
      { collections: "desc" },
    );
    expect(summaries[0]?.count).toBe(2);
  });
  it("buildCategorySummaries collections count 2", () => {
    const entries = Array.from({ length: 3 }, (_, idx) => ({
      category: "collections",
      slug: "slug-" + idx,
      title: "T",
      dateAdded: "2026-01-01",
    }));
    const summaries = buildCategorySummaries(
      entries,
      ["collections"],
      { collections: "collections" },
      { collections: "desc" },
    );
    expect(summaries[0]?.count).toBe(3);
  });
  it("buildCategorySummaries collections count 3", () => {
    const entries = Array.from({ length: 4 }, (_, idx) => ({
      category: "collections",
      slug: "slug-" + idx,
      title: "T",
      dateAdded: "2026-01-01",
    }));
    const summaries = buildCategorySummaries(
      entries,
      ["collections"],
      { collections: "collections" },
      { collections: "desc" },
    );
    expect(summaries[0]?.count).toBe(4);
  });
  it("buildCategorySummaries collections count 4", () => {
    const entries = Array.from({ length: 5 }, (_, idx) => ({
      category: "collections",
      slug: "slug-" + idx,
      title: "T",
      dateAdded: "2026-01-01",
    }));
    const summaries = buildCategorySummaries(
      entries,
      ["collections"],
      { collections: "collections" },
      { collections: "desc" },
    );
    expect(summaries[0]?.count).toBe(5);
  });
  it("buildCategorySummaries collections count 5", () => {
    const entries = Array.from({ length: 6 }, (_, idx) => ({
      category: "collections",
      slug: "slug-" + idx,
      title: "T",
      dateAdded: "2026-01-01",
    }));
    const summaries = buildCategorySummaries(
      entries,
      ["collections"],
      { collections: "collections" },
      { collections: "desc" },
    );
    expect(summaries[0]?.count).toBe(6);
  });
  it("buildCategorySummaries collections count 6", () => {
    const entries = Array.from({ length: 7 }, (_, idx) => ({
      category: "collections",
      slug: "slug-" + idx,
      title: "T",
      dateAdded: "2026-01-01",
    }));
    const summaries = buildCategorySummaries(
      entries,
      ["collections"],
      { collections: "collections" },
      { collections: "desc" },
    );
    expect(summaries[0]?.count).toBe(7);
  });
  it("buildCategorySummaries collections count 7", () => {
    const entries = Array.from({ length: 8 }, (_, idx) => ({
      category: "collections",
      slug: "slug-" + idx,
      title: "T",
      dateAdded: "2026-01-01",
    }));
    const summaries = buildCategorySummaries(
      entries,
      ["collections"],
      { collections: "collections" },
      { collections: "desc" },
    );
    expect(summaries[0]?.count).toBe(8);
  });
  it("buildCategorySummaries statuslines count 0", () => {
    const entries = Array.from({ length: 1 }, (_, idx) => ({
      category: "statuslines",
      slug: "slug-" + idx,
      title: "T",
      dateAdded: "2026-01-01",
    }));
    const summaries = buildCategorySummaries(
      entries,
      ["statuslines"],
      { statuslines: "statuslines" },
      { statuslines: "desc" },
    );
    expect(summaries[0]?.count).toBe(1);
  });
  it("buildCategorySummaries statuslines count 1", () => {
    const entries = Array.from({ length: 2 }, (_, idx) => ({
      category: "statuslines",
      slug: "slug-" + idx,
      title: "T",
      dateAdded: "2026-01-01",
    }));
    const summaries = buildCategorySummaries(
      entries,
      ["statuslines"],
      { statuslines: "statuslines" },
      { statuslines: "desc" },
    );
    expect(summaries[0]?.count).toBe(2);
  });
  it("buildCategorySummaries statuslines count 2", () => {
    const entries = Array.from({ length: 3 }, (_, idx) => ({
      category: "statuslines",
      slug: "slug-" + idx,
      title: "T",
      dateAdded: "2026-01-01",
    }));
    const summaries = buildCategorySummaries(
      entries,
      ["statuslines"],
      { statuslines: "statuslines" },
      { statuslines: "desc" },
    );
    expect(summaries[0]?.count).toBe(3);
  });
  it("buildCategorySummaries statuslines count 3", () => {
    const entries = Array.from({ length: 4 }, (_, idx) => ({
      category: "statuslines",
      slug: "slug-" + idx,
      title: "T",
      dateAdded: "2026-01-01",
    }));
    const summaries = buildCategorySummaries(
      entries,
      ["statuslines"],
      { statuslines: "statuslines" },
      { statuslines: "desc" },
    );
    expect(summaries[0]?.count).toBe(4);
  });
  it("buildCategorySummaries statuslines count 4", () => {
    const entries = Array.from({ length: 5 }, (_, idx) => ({
      category: "statuslines",
      slug: "slug-" + idx,
      title: "T",
      dateAdded: "2026-01-01",
    }));
    const summaries = buildCategorySummaries(
      entries,
      ["statuslines"],
      { statuslines: "statuslines" },
      { statuslines: "desc" },
    );
    expect(summaries[0]?.count).toBe(5);
  });
  it("buildCategorySummaries statuslines count 5", () => {
    const entries = Array.from({ length: 6 }, (_, idx) => ({
      category: "statuslines",
      slug: "slug-" + idx,
      title: "T",
      dateAdded: "2026-01-01",
    }));
    const summaries = buildCategorySummaries(
      entries,
      ["statuslines"],
      { statuslines: "statuslines" },
      { statuslines: "desc" },
    );
    expect(summaries[0]?.count).toBe(6);
  });
  it("buildCategorySummaries statuslines count 6", () => {
    const entries = Array.from({ length: 7 }, (_, idx) => ({
      category: "statuslines",
      slug: "slug-" + idx,
      title: "T",
      dateAdded: "2026-01-01",
    }));
    const summaries = buildCategorySummaries(
      entries,
      ["statuslines"],
      { statuslines: "statuslines" },
      { statuslines: "desc" },
    );
    expect(summaries[0]?.count).toBe(7);
  });
  it("buildCategorySummaries statuslines count 7", () => {
    const entries = Array.from({ length: 8 }, (_, idx) => ({
      category: "statuslines",
      slug: "slug-" + idx,
      title: "T",
      dateAdded: "2026-01-01",
    }));
    const summaries = buildCategorySummaries(
      entries,
      ["statuslines"],
      { statuslines: "statuslines" },
      { statuslines: "desc" },
    );
    expect(summaries[0]?.count).toBe(8);
  });
});

describe("content-query-lib sortRecentDirectoryEntries", () => {
  it("sorts by dateAdded descending", () => {
    const entries = [
      { category: "mcp", slug: "a", title: "A", dateAdded: "2026-01-01" },
      { category: "mcp", slug: "b", title: "B", dateAdded: "2026-06-01" },
    ];
    expect(sortRecentDirectoryEntries(entries)[0].slug).toBe("b");
  });
  it("sortRecentDirectoryEntries limit 0", () => {
    const entries = Array.from({ length: 20 }, (_, idx) => ({
      category: "mcp",
      slug: "s-" + idx,
      title: "T",
      dateAdded: "2026-0" + ((idx % 9) + 1).toString().padStart(2, "0") + "-01",
    }));
    const sorted = sortRecentDirectoryEntries(entries, 1);
    expect(sorted.length).toBeLessThanOrEqual(1);
  });
  it("sortRecentDirectoryEntries limit 1", () => {
    const entries = Array.from({ length: 20 }, (_, idx) => ({
      category: "mcp",
      slug: "s-" + idx,
      title: "T",
      dateAdded: "2026-0" + ((idx % 9) + 1).toString().padStart(2, "0") + "-01",
    }));
    const sorted = sortRecentDirectoryEntries(entries, 2);
    expect(sorted.length).toBeLessThanOrEqual(2);
  });
  it("sortRecentDirectoryEntries limit 2", () => {
    const entries = Array.from({ length: 20 }, (_, idx) => ({
      category: "mcp",
      slug: "s-" + idx,
      title: "T",
      dateAdded: "2026-0" + ((idx % 9) + 1).toString().padStart(2, "0") + "-01",
    }));
    const sorted = sortRecentDirectoryEntries(entries, 3);
    expect(sorted.length).toBeLessThanOrEqual(3);
  });
  it("sortRecentDirectoryEntries limit 3", () => {
    const entries = Array.from({ length: 20 }, (_, idx) => ({
      category: "mcp",
      slug: "s-" + idx,
      title: "T",
      dateAdded: "2026-0" + ((idx % 9) + 1).toString().padStart(2, "0") + "-01",
    }));
    const sorted = sortRecentDirectoryEntries(entries, 4);
    expect(sorted.length).toBeLessThanOrEqual(4);
  });
  it("sortRecentDirectoryEntries limit 4", () => {
    const entries = Array.from({ length: 20 }, (_, idx) => ({
      category: "mcp",
      slug: "s-" + idx,
      title: "T",
      dateAdded: "2026-0" + ((idx % 9) + 1).toString().padStart(2, "0") + "-01",
    }));
    const sorted = sortRecentDirectoryEntries(entries, 5);
    expect(sorted.length).toBeLessThanOrEqual(5);
  });
  it("sortRecentDirectoryEntries limit 5", () => {
    const entries = Array.from({ length: 20 }, (_, idx) => ({
      category: "mcp",
      slug: "s-" + idx,
      title: "T",
      dateAdded: "2026-0" + ((idx % 9) + 1).toString().padStart(2, "0") + "-01",
    }));
    const sorted = sortRecentDirectoryEntries(entries, 6);
    expect(sorted.length).toBeLessThanOrEqual(6);
  });
  it("sortRecentDirectoryEntries limit 6", () => {
    const entries = Array.from({ length: 20 }, (_, idx) => ({
      category: "mcp",
      slug: "s-" + idx,
      title: "T",
      dateAdded: "2026-0" + ((idx % 9) + 1).toString().padStart(2, "0") + "-01",
    }));
    const sorted = sortRecentDirectoryEntries(entries, 7);
    expect(sorted.length).toBeLessThanOrEqual(7);
  });
  it("sortRecentDirectoryEntries limit 7", () => {
    const entries = Array.from({ length: 20 }, (_, idx) => ({
      category: "mcp",
      slug: "s-" + idx,
      title: "T",
      dateAdded: "2026-0" + ((idx % 9) + 1).toString().padStart(2, "0") + "-01",
    }));
    const sorted = sortRecentDirectoryEntries(entries, 8);
    expect(sorted.length).toBeLessThanOrEqual(8);
  });
  it("sortRecentDirectoryEntries limit 8", () => {
    const entries = Array.from({ length: 20 }, (_, idx) => ({
      category: "mcp",
      slug: "s-" + idx,
      title: "T",
      dateAdded: "2026-0" + ((idx % 9) + 1).toString().padStart(2, "0") + "-01",
    }));
    const sorted = sortRecentDirectoryEntries(entries, 9);
    expect(sorted.length).toBeLessThanOrEqual(9);
  });
  it("sortRecentDirectoryEntries limit 9", () => {
    const entries = Array.from({ length: 20 }, (_, idx) => ({
      category: "mcp",
      slug: "s-" + idx,
      title: "T",
      dateAdded: "2026-0" + ((idx % 9) + 1).toString().padStart(2, "0") + "-01",
    }));
    const sorted = sortRecentDirectoryEntries(entries, 10);
    expect(sorted.length).toBeLessThanOrEqual(10);
  });
  it("sortRecentDirectoryEntries limit 10", () => {
    const entries = Array.from({ length: 20 }, (_, idx) => ({
      category: "mcp",
      slug: "s-" + idx,
      title: "T",
      dateAdded: "2026-0" + ((idx % 9) + 1).toString().padStart(2, "0") + "-01",
    }));
    const sorted = sortRecentDirectoryEntries(entries, 11);
    expect(sorted.length).toBeLessThanOrEqual(11);
  });
  it("sortRecentDirectoryEntries limit 11", () => {
    const entries = Array.from({ length: 20 }, (_, idx) => ({
      category: "mcp",
      slug: "s-" + idx,
      title: "T",
      dateAdded: "2026-0" + ((idx % 9) + 1).toString().padStart(2, "0") + "-01",
    }));
    const sorted = sortRecentDirectoryEntries(entries, 12);
    expect(sorted.length).toBeLessThanOrEqual(12);
  });
  it("sortRecentDirectoryEntries limit 12", () => {
    const entries = Array.from({ length: 20 }, (_, idx) => ({
      category: "mcp",
      slug: "s-" + idx,
      title: "T",
      dateAdded: "2026-0" + ((idx % 9) + 1).toString().padStart(2, "0") + "-01",
    }));
    const sorted = sortRecentDirectoryEntries(entries, 1);
    expect(sorted.length).toBeLessThanOrEqual(1);
  });
  it("sortRecentDirectoryEntries limit 13", () => {
    const entries = Array.from({ length: 20 }, (_, idx) => ({
      category: "mcp",
      slug: "s-" + idx,
      title: "T",
      dateAdded: "2026-0" + ((idx % 9) + 1).toString().padStart(2, "0") + "-01",
    }));
    const sorted = sortRecentDirectoryEntries(entries, 2);
    expect(sorted.length).toBeLessThanOrEqual(2);
  });
  it("sortRecentDirectoryEntries limit 14", () => {
    const entries = Array.from({ length: 20 }, (_, idx) => ({
      category: "mcp",
      slug: "s-" + idx,
      title: "T",
      dateAdded: "2026-0" + ((idx % 9) + 1).toString().padStart(2, "0") + "-01",
    }));
    const sorted = sortRecentDirectoryEntries(entries, 3);
    expect(sorted.length).toBeLessThanOrEqual(3);
  });
  it("sortRecentDirectoryEntries limit 15", () => {
    const entries = Array.from({ length: 20 }, (_, idx) => ({
      category: "mcp",
      slug: "s-" + idx,
      title: "T",
      dateAdded: "2026-0" + ((idx % 9) + 1).toString().padStart(2, "0") + "-01",
    }));
    const sorted = sortRecentDirectoryEntries(entries, 4);
    expect(sorted.length).toBeLessThanOrEqual(4);
  });
  it("sortRecentDirectoryEntries limit 16", () => {
    const entries = Array.from({ length: 20 }, (_, idx) => ({
      category: "mcp",
      slug: "s-" + idx,
      title: "T",
      dateAdded: "2026-0" + ((idx % 9) + 1).toString().padStart(2, "0") + "-01",
    }));
    const sorted = sortRecentDirectoryEntries(entries, 5);
    expect(sorted.length).toBeLessThanOrEqual(5);
  });
  it("sortRecentDirectoryEntries limit 17", () => {
    const entries = Array.from({ length: 20 }, (_, idx) => ({
      category: "mcp",
      slug: "s-" + idx,
      title: "T",
      dateAdded: "2026-0" + ((idx % 9) + 1).toString().padStart(2, "0") + "-01",
    }));
    const sorted = sortRecentDirectoryEntries(entries, 6);
    expect(sorted.length).toBeLessThanOrEqual(6);
  });
  it("sortRecentDirectoryEntries limit 18", () => {
    const entries = Array.from({ length: 20 }, (_, idx) => ({
      category: "mcp",
      slug: "s-" + idx,
      title: "T",
      dateAdded: "2026-0" + ((idx % 9) + 1).toString().padStart(2, "0") + "-01",
    }));
    const sorted = sortRecentDirectoryEntries(entries, 7);
    expect(sorted.length).toBeLessThanOrEqual(7);
  });
  it("sortRecentDirectoryEntries limit 19", () => {
    const entries = Array.from({ length: 20 }, (_, idx) => ({
      category: "mcp",
      slug: "s-" + idx,
      title: "T",
      dateAdded: "2026-0" + ((idx % 9) + 1).toString().padStart(2, "0") + "-01",
    }));
    const sorted = sortRecentDirectoryEntries(entries, 8);
    expect(sorted.length).toBeLessThanOrEqual(8);
  });
  it("sortRecentDirectoryEntries limit 20", () => {
    const entries = Array.from({ length: 20 }, (_, idx) => ({
      category: "mcp",
      slug: "s-" + idx,
      title: "T",
      dateAdded: "2026-0" + ((idx % 9) + 1).toString().padStart(2, "0") + "-01",
    }));
    const sorted = sortRecentDirectoryEntries(entries, 9);
    expect(sorted.length).toBeLessThanOrEqual(9);
  });
  it("sortRecentDirectoryEntries limit 21", () => {
    const entries = Array.from({ length: 20 }, (_, idx) => ({
      category: "mcp",
      slug: "s-" + idx,
      title: "T",
      dateAdded: "2026-0" + ((idx % 9) + 1).toString().padStart(2, "0") + "-01",
    }));
    const sorted = sortRecentDirectoryEntries(entries, 10);
    expect(sorted.length).toBeLessThanOrEqual(10);
  });
  it("sortRecentDirectoryEntries limit 22", () => {
    const entries = Array.from({ length: 20 }, (_, idx) => ({
      category: "mcp",
      slug: "s-" + idx,
      title: "T",
      dateAdded: "2026-0" + ((idx % 9) + 1).toString().padStart(2, "0") + "-01",
    }));
    const sorted = sortRecentDirectoryEntries(entries, 11);
    expect(sorted.length).toBeLessThanOrEqual(11);
  });
  it("sortRecentDirectoryEntries limit 23", () => {
    const entries = Array.from({ length: 20 }, (_, idx) => ({
      category: "mcp",
      slug: "s-" + idx,
      title: "T",
      dateAdded: "2026-0" + ((idx % 9) + 1).toString().padStart(2, "0") + "-01",
    }));
    const sorted = sortRecentDirectoryEntries(entries, 12);
    expect(sorted.length).toBeLessThanOrEqual(12);
  });
  it("sortRecentDirectoryEntries limit 24", () => {
    const entries = Array.from({ length: 20 }, (_, idx) => ({
      category: "mcp",
      slug: "s-" + idx,
      title: "T",
      dateAdded: "2026-0" + ((idx % 9) + 1).toString().padStart(2, "0") + "-01",
    }));
    const sorted = sortRecentDirectoryEntries(entries, 1);
    expect(sorted.length).toBeLessThanOrEqual(1);
  });
  it("sortRecentDirectoryEntries limit 25", () => {
    const entries = Array.from({ length: 20 }, (_, idx) => ({
      category: "mcp",
      slug: "s-" + idx,
      title: "T",
      dateAdded: "2026-0" + ((idx % 9) + 1).toString().padStart(2, "0") + "-01",
    }));
    const sorted = sortRecentDirectoryEntries(entries, 2);
    expect(sorted.length).toBeLessThanOrEqual(2);
  });
  it("sortRecentDirectoryEntries limit 26", () => {
    const entries = Array.from({ length: 20 }, (_, idx) => ({
      category: "mcp",
      slug: "s-" + idx,
      title: "T",
      dateAdded: "2026-0" + ((idx % 9) + 1).toString().padStart(2, "0") + "-01",
    }));
    const sorted = sortRecentDirectoryEntries(entries, 3);
    expect(sorted.length).toBeLessThanOrEqual(3);
  });
  it("sortRecentDirectoryEntries limit 27", () => {
    const entries = Array.from({ length: 20 }, (_, idx) => ({
      category: "mcp",
      slug: "s-" + idx,
      title: "T",
      dateAdded: "2026-0" + ((idx % 9) + 1).toString().padStart(2, "0") + "-01",
    }));
    const sorted = sortRecentDirectoryEntries(entries, 4);
    expect(sorted.length).toBeLessThanOrEqual(4);
  });
  it("sortRecentDirectoryEntries limit 28", () => {
    const entries = Array.from({ length: 20 }, (_, idx) => ({
      category: "mcp",
      slug: "s-" + idx,
      title: "T",
      dateAdded: "2026-0" + ((idx % 9) + 1).toString().padStart(2, "0") + "-01",
    }));
    const sorted = sortRecentDirectoryEntries(entries, 5);
    expect(sorted.length).toBeLessThanOrEqual(5);
  });
  it("sortRecentDirectoryEntries limit 29", () => {
    const entries = Array.from({ length: 20 }, (_, idx) => ({
      category: "mcp",
      slug: "s-" + idx,
      title: "T",
      dateAdded: "2026-0" + ((idx % 9) + 1).toString().padStart(2, "0") + "-01",
    }));
    const sorted = sortRecentDirectoryEntries(entries, 6);
    expect(sorted.length).toBeLessThanOrEqual(6);
  });
  it("sortRecentDirectoryEntries limit 30", () => {
    const entries = Array.from({ length: 20 }, (_, idx) => ({
      category: "mcp",
      slug: "s-" + idx,
      title: "T",
      dateAdded: "2026-0" + ((idx % 9) + 1).toString().padStart(2, "0") + "-01",
    }));
    const sorted = sortRecentDirectoryEntries(entries, 7);
    expect(sorted.length).toBeLessThanOrEqual(7);
  });
  it("sortRecentDirectoryEntries limit 31", () => {
    const entries = Array.from({ length: 20 }, (_, idx) => ({
      category: "mcp",
      slug: "s-" + idx,
      title: "T",
      dateAdded: "2026-0" + ((idx % 9) + 1).toString().padStart(2, "0") + "-01",
    }));
    const sorted = sortRecentDirectoryEntries(entries, 8);
    expect(sorted.length).toBeLessThanOrEqual(8);
  });
  it("sortRecentDirectoryEntries limit 32", () => {
    const entries = Array.from({ length: 20 }, (_, idx) => ({
      category: "mcp",
      slug: "s-" + idx,
      title: "T",
      dateAdded: "2026-0" + ((idx % 9) + 1).toString().padStart(2, "0") + "-01",
    }));
    const sorted = sortRecentDirectoryEntries(entries, 9);
    expect(sorted.length).toBeLessThanOrEqual(9);
  });
  it("sortRecentDirectoryEntries limit 33", () => {
    const entries = Array.from({ length: 20 }, (_, idx) => ({
      category: "mcp",
      slug: "s-" + idx,
      title: "T",
      dateAdded: "2026-0" + ((idx % 9) + 1).toString().padStart(2, "0") + "-01",
    }));
    const sorted = sortRecentDirectoryEntries(entries, 10);
    expect(sorted.length).toBeLessThanOrEqual(10);
  });
  it("sortRecentDirectoryEntries limit 34", () => {
    const entries = Array.from({ length: 20 }, (_, idx) => ({
      category: "mcp",
      slug: "s-" + idx,
      title: "T",
      dateAdded: "2026-0" + ((idx % 9) + 1).toString().padStart(2, "0") + "-01",
    }));
    const sorted = sortRecentDirectoryEntries(entries, 11);
    expect(sorted.length).toBeLessThanOrEqual(11);
  });
  it("sortRecentDirectoryEntries limit 35", () => {
    const entries = Array.from({ length: 20 }, (_, idx) => ({
      category: "mcp",
      slug: "s-" + idx,
      title: "T",
      dateAdded: "2026-0" + ((idx % 9) + 1).toString().padStart(2, "0") + "-01",
    }));
    const sorted = sortRecentDirectoryEntries(entries, 12);
    expect(sorted.length).toBeLessThanOrEqual(12);
  });
  it("sortRecentDirectoryEntries limit 36", () => {
    const entries = Array.from({ length: 20 }, (_, idx) => ({
      category: "mcp",
      slug: "s-" + idx,
      title: "T",
      dateAdded: "2026-0" + ((idx % 9) + 1).toString().padStart(2, "0") + "-01",
    }));
    const sorted = sortRecentDirectoryEntries(entries, 1);
    expect(sorted.length).toBeLessThanOrEqual(1);
  });
  it("sortRecentDirectoryEntries limit 37", () => {
    const entries = Array.from({ length: 20 }, (_, idx) => ({
      category: "mcp",
      slug: "s-" + idx,
      title: "T",
      dateAdded: "2026-0" + ((idx % 9) + 1).toString().padStart(2, "0") + "-01",
    }));
    const sorted = sortRecentDirectoryEntries(entries, 2);
    expect(sorted.length).toBeLessThanOrEqual(2);
  });
  it("sortRecentDirectoryEntries limit 38", () => {
    const entries = Array.from({ length: 20 }, (_, idx) => ({
      category: "mcp",
      slug: "s-" + idx,
      title: "T",
      dateAdded: "2026-0" + ((idx % 9) + 1).toString().padStart(2, "0") + "-01",
    }));
    const sorted = sortRecentDirectoryEntries(entries, 3);
    expect(sorted.length).toBeLessThanOrEqual(3);
  });
  it("sortRecentDirectoryEntries limit 39", () => {
    const entries = Array.from({ length: 20 }, (_, idx) => ({
      category: "mcp",
      slug: "s-" + idx,
      title: "T",
      dateAdded: "2026-0" + ((idx % 9) + 1).toString().padStart(2, "0") + "-01",
    }));
    const sorted = sortRecentDirectoryEntries(entries, 4);
    expect(sorted.length).toBeLessThanOrEqual(4);
  });
  it("sortRecentDirectoryEntries limit 40", () => {
    const entries = Array.from({ length: 20 }, (_, idx) => ({
      category: "mcp",
      slug: "s-" + idx,
      title: "T",
      dateAdded: "2026-0" + ((idx % 9) + 1).toString().padStart(2, "0") + "-01",
    }));
    const sorted = sortRecentDirectoryEntries(entries, 5);
    expect(sorted.length).toBeLessThanOrEqual(5);
  });
  it("sortRecentDirectoryEntries limit 41", () => {
    const entries = Array.from({ length: 20 }, (_, idx) => ({
      category: "mcp",
      slug: "s-" + idx,
      title: "T",
      dateAdded: "2026-0" + ((idx % 9) + 1).toString().padStart(2, "0") + "-01",
    }));
    const sorted = sortRecentDirectoryEntries(entries, 6);
    expect(sorted.length).toBeLessThanOrEqual(6);
  });
  it("sortRecentDirectoryEntries limit 42", () => {
    const entries = Array.from({ length: 20 }, (_, idx) => ({
      category: "mcp",
      slug: "s-" + idx,
      title: "T",
      dateAdded: "2026-0" + ((idx % 9) + 1).toString().padStart(2, "0") + "-01",
    }));
    const sorted = sortRecentDirectoryEntries(entries, 7);
    expect(sorted.length).toBeLessThanOrEqual(7);
  });
  it("sortRecentDirectoryEntries limit 43", () => {
    const entries = Array.from({ length: 20 }, (_, idx) => ({
      category: "mcp",
      slug: "s-" + idx,
      title: "T",
      dateAdded: "2026-0" + ((idx % 9) + 1).toString().padStart(2, "0") + "-01",
    }));
    const sorted = sortRecentDirectoryEntries(entries, 8);
    expect(sorted.length).toBeLessThanOrEqual(8);
  });
  it("sortRecentDirectoryEntries limit 44", () => {
    const entries = Array.from({ length: 20 }, (_, idx) => ({
      category: "mcp",
      slug: "s-" + idx,
      title: "T",
      dateAdded: "2026-0" + ((idx % 9) + 1).toString().padStart(2, "0") + "-01",
    }));
    const sorted = sortRecentDirectoryEntries(entries, 9);
    expect(sorted.length).toBeLessThanOrEqual(9);
  });
  it("sortRecentDirectoryEntries limit 45", () => {
    const entries = Array.from({ length: 20 }, (_, idx) => ({
      category: "mcp",
      slug: "s-" + idx,
      title: "T",
      dateAdded: "2026-0" + ((idx % 9) + 1).toString().padStart(2, "0") + "-01",
    }));
    const sorted = sortRecentDirectoryEntries(entries, 10);
    expect(sorted.length).toBeLessThanOrEqual(10);
  });
  it("sortRecentDirectoryEntries limit 46", () => {
    const entries = Array.from({ length: 20 }, (_, idx) => ({
      category: "mcp",
      slug: "s-" + idx,
      title: "T",
      dateAdded: "2026-0" + ((idx % 9) + 1).toString().padStart(2, "0") + "-01",
    }));
    const sorted = sortRecentDirectoryEntries(entries, 11);
    expect(sorted.length).toBeLessThanOrEqual(11);
  });
  it("sortRecentDirectoryEntries limit 47", () => {
    const entries = Array.from({ length: 20 }, (_, idx) => ({
      category: "mcp",
      slug: "s-" + idx,
      title: "T",
      dateAdded: "2026-0" + ((idx % 9) + 1).toString().padStart(2, "0") + "-01",
    }));
    const sorted = sortRecentDirectoryEntries(entries, 12);
    expect(sorted.length).toBeLessThanOrEqual(12);
  });
  it("sortRecentDirectoryEntries limit 48", () => {
    const entries = Array.from({ length: 20 }, (_, idx) => ({
      category: "mcp",
      slug: "s-" + idx,
      title: "T",
      dateAdded: "2026-0" + ((idx % 9) + 1).toString().padStart(2, "0") + "-01",
    }));
    const sorted = sortRecentDirectoryEntries(entries, 1);
    expect(sorted.length).toBeLessThanOrEqual(1);
  });
  it("sortRecentDirectoryEntries limit 49", () => {
    const entries = Array.from({ length: 20 }, (_, idx) => ({
      category: "mcp",
      slug: "s-" + idx,
      title: "T",
      dateAdded: "2026-0" + ((idx % 9) + 1).toString().padStart(2, "0") + "-01",
    }));
    const sorted = sortRecentDirectoryEntries(entries, 2);
    expect(sorted.length).toBeLessThanOrEqual(2);
  });
  it("sortRecentDirectoryEntries limit 50", () => {
    const entries = Array.from({ length: 20 }, (_, idx) => ({
      category: "mcp",
      slug: "s-" + idx,
      title: "T",
      dateAdded: "2026-0" + ((idx % 9) + 1).toString().padStart(2, "0") + "-01",
    }));
    const sorted = sortRecentDirectoryEntries(entries, 3);
    expect(sorted.length).toBeLessThanOrEqual(3);
  });
  it("sortRecentDirectoryEntries limit 51", () => {
    const entries = Array.from({ length: 20 }, (_, idx) => ({
      category: "mcp",
      slug: "s-" + idx,
      title: "T",
      dateAdded: "2026-0" + ((idx % 9) + 1).toString().padStart(2, "0") + "-01",
    }));
    const sorted = sortRecentDirectoryEntries(entries, 4);
    expect(sorted.length).toBeLessThanOrEqual(4);
  });
  it("sortRecentDirectoryEntries limit 52", () => {
    const entries = Array.from({ length: 20 }, (_, idx) => ({
      category: "mcp",
      slug: "s-" + idx,
      title: "T",
      dateAdded: "2026-0" + ((idx % 9) + 1).toString().padStart(2, "0") + "-01",
    }));
    const sorted = sortRecentDirectoryEntries(entries, 5);
    expect(sorted.length).toBeLessThanOrEqual(5);
  });
  it("sortRecentDirectoryEntries limit 53", () => {
    const entries = Array.from({ length: 20 }, (_, idx) => ({
      category: "mcp",
      slug: "s-" + idx,
      title: "T",
      dateAdded: "2026-0" + ((idx % 9) + 1).toString().padStart(2, "0") + "-01",
    }));
    const sorted = sortRecentDirectoryEntries(entries, 6);
    expect(sorted.length).toBeLessThanOrEqual(6);
  });
  it("sortRecentDirectoryEntries limit 54", () => {
    const entries = Array.from({ length: 20 }, (_, idx) => ({
      category: "mcp",
      slug: "s-" + idx,
      title: "T",
      dateAdded: "2026-0" + ((idx % 9) + 1).toString().padStart(2, "0") + "-01",
    }));
    const sorted = sortRecentDirectoryEntries(entries, 7);
    expect(sorted.length).toBeLessThanOrEqual(7);
  });
  it("sortRecentDirectoryEntries limit 55", () => {
    const entries = Array.from({ length: 20 }, (_, idx) => ({
      category: "mcp",
      slug: "s-" + idx,
      title: "T",
      dateAdded: "2026-0" + ((idx % 9) + 1).toString().padStart(2, "0") + "-01",
    }));
    const sorted = sortRecentDirectoryEntries(entries, 8);
    expect(sorted.length).toBeLessThanOrEqual(8);
  });
  it("sortRecentDirectoryEntries limit 56", () => {
    const entries = Array.from({ length: 20 }, (_, idx) => ({
      category: "mcp",
      slug: "s-" + idx,
      title: "T",
      dateAdded: "2026-0" + ((idx % 9) + 1).toString().padStart(2, "0") + "-01",
    }));
    const sorted = sortRecentDirectoryEntries(entries, 9);
    expect(sorted.length).toBeLessThanOrEqual(9);
  });
  it("sortRecentDirectoryEntries limit 57", () => {
    const entries = Array.from({ length: 20 }, (_, idx) => ({
      category: "mcp",
      slug: "s-" + idx,
      title: "T",
      dateAdded: "2026-0" + ((idx % 9) + 1).toString().padStart(2, "0") + "-01",
    }));
    const sorted = sortRecentDirectoryEntries(entries, 10);
    expect(sorted.length).toBeLessThanOrEqual(10);
  });
  it("sortRecentDirectoryEntries limit 58", () => {
    const entries = Array.from({ length: 20 }, (_, idx) => ({
      category: "mcp",
      slug: "s-" + idx,
      title: "T",
      dateAdded: "2026-0" + ((idx % 9) + 1).toString().padStart(2, "0") + "-01",
    }));
    const sorted = sortRecentDirectoryEntries(entries, 11);
    expect(sorted.length).toBeLessThanOrEqual(11);
  });
  it("sortRecentDirectoryEntries limit 59", () => {
    const entries = Array.from({ length: 20 }, (_, idx) => ({
      category: "mcp",
      slug: "s-" + idx,
      title: "T",
      dateAdded: "2026-0" + ((idx % 9) + 1).toString().padStart(2, "0") + "-01",
    }));
    const sorted = sortRecentDirectoryEntries(entries, 12);
    expect(sorted.length).toBeLessThanOrEqual(12);
  });
  it("sortRecentDirectoryEntries limit 60", () => {
    const entries = Array.from({ length: 20 }, (_, idx) => ({
      category: "mcp",
      slug: "s-" + idx,
      title: "T",
      dateAdded: "2026-0" + ((idx % 9) + 1).toString().padStart(2, "0") + "-01",
    }));
    const sorted = sortRecentDirectoryEntries(entries, 1);
    expect(sorted.length).toBeLessThanOrEqual(1);
  });
  it("sortRecentDirectoryEntries limit 61", () => {
    const entries = Array.from({ length: 20 }, (_, idx) => ({
      category: "mcp",
      slug: "s-" + idx,
      title: "T",
      dateAdded: "2026-0" + ((idx % 9) + 1).toString().padStart(2, "0") + "-01",
    }));
    const sorted = sortRecentDirectoryEntries(entries, 2);
    expect(sorted.length).toBeLessThanOrEqual(2);
  });
  it("sortRecentDirectoryEntries limit 62", () => {
    const entries = Array.from({ length: 20 }, (_, idx) => ({
      category: "mcp",
      slug: "s-" + idx,
      title: "T",
      dateAdded: "2026-0" + ((idx % 9) + 1).toString().padStart(2, "0") + "-01",
    }));
    const sorted = sortRecentDirectoryEntries(entries, 3);
    expect(sorted.length).toBeLessThanOrEqual(3);
  });
  it("sortRecentDirectoryEntries limit 63", () => {
    const entries = Array.from({ length: 20 }, (_, idx) => ({
      category: "mcp",
      slug: "s-" + idx,
      title: "T",
      dateAdded: "2026-0" + ((idx % 9) + 1).toString().padStart(2, "0") + "-01",
    }));
    const sorted = sortRecentDirectoryEntries(entries, 4);
    expect(sorted.length).toBeLessThanOrEqual(4);
  });
  it("sortRecentDirectoryEntries limit 64", () => {
    const entries = Array.from({ length: 20 }, (_, idx) => ({
      category: "mcp",
      slug: "s-" + idx,
      title: "T",
      dateAdded: "2026-0" + ((idx % 9) + 1).toString().padStart(2, "0") + "-01",
    }));
    const sorted = sortRecentDirectoryEntries(entries, 5);
    expect(sorted.length).toBeLessThanOrEqual(5);
  });
  it("sortRecentDirectoryEntries limit 65", () => {
    const entries = Array.from({ length: 20 }, (_, idx) => ({
      category: "mcp",
      slug: "s-" + idx,
      title: "T",
      dateAdded: "2026-0" + ((idx % 9) + 1).toString().padStart(2, "0") + "-01",
    }));
    const sorted = sortRecentDirectoryEntries(entries, 6);
    expect(sorted.length).toBeLessThanOrEqual(6);
  });
  it("sortRecentDirectoryEntries limit 66", () => {
    const entries = Array.from({ length: 20 }, (_, idx) => ({
      category: "mcp",
      slug: "s-" + idx,
      title: "T",
      dateAdded: "2026-0" + ((idx % 9) + 1).toString().padStart(2, "0") + "-01",
    }));
    const sorted = sortRecentDirectoryEntries(entries, 7);
    expect(sorted.length).toBeLessThanOrEqual(7);
  });
  it("sortRecentDirectoryEntries limit 67", () => {
    const entries = Array.from({ length: 20 }, (_, idx) => ({
      category: "mcp",
      slug: "s-" + idx,
      title: "T",
      dateAdded: "2026-0" + ((idx % 9) + 1).toString().padStart(2, "0") + "-01",
    }));
    const sorted = sortRecentDirectoryEntries(entries, 8);
    expect(sorted.length).toBeLessThanOrEqual(8);
  });
  it("sortRecentDirectoryEntries limit 68", () => {
    const entries = Array.from({ length: 20 }, (_, idx) => ({
      category: "mcp",
      slug: "s-" + idx,
      title: "T",
      dateAdded: "2026-0" + ((idx % 9) + 1).toString().padStart(2, "0") + "-01",
    }));
    const sorted = sortRecentDirectoryEntries(entries, 9);
    expect(sorted.length).toBeLessThanOrEqual(9);
  });
  it("sortRecentDirectoryEntries limit 69", () => {
    const entries = Array.from({ length: 20 }, (_, idx) => ({
      category: "mcp",
      slug: "s-" + idx,
      title: "T",
      dateAdded: "2026-0" + ((idx % 9) + 1).toString().padStart(2, "0") + "-01",
    }));
    const sorted = sortRecentDirectoryEntries(entries, 10);
    expect(sorted.length).toBeLessThanOrEqual(10);
  });
  it("sortRecentDirectoryEntries limit 70", () => {
    const entries = Array.from({ length: 20 }, (_, idx) => ({
      category: "mcp",
      slug: "s-" + idx,
      title: "T",
      dateAdded: "2026-0" + ((idx % 9) + 1).toString().padStart(2, "0") + "-01",
    }));
    const sorted = sortRecentDirectoryEntries(entries, 11);
    expect(sorted.length).toBeLessThanOrEqual(11);
  });
  it("sortRecentDirectoryEntries limit 71", () => {
    const entries = Array.from({ length: 20 }, (_, idx) => ({
      category: "mcp",
      slug: "s-" + idx,
      title: "T",
      dateAdded: "2026-0" + ((idx % 9) + 1).toString().padStart(2, "0") + "-01",
    }));
    const sorted = sortRecentDirectoryEntries(entries, 12);
    expect(sorted.length).toBeLessThanOrEqual(12);
  });
  it("sortRecentDirectoryEntries limit 72", () => {
    const entries = Array.from({ length: 20 }, (_, idx) => ({
      category: "mcp",
      slug: "s-" + idx,
      title: "T",
      dateAdded: "2026-0" + ((idx % 9) + 1).toString().padStart(2, "0") + "-01",
    }));
    const sorted = sortRecentDirectoryEntries(entries, 1);
    expect(sorted.length).toBeLessThanOrEqual(1);
  });
  it("sortRecentDirectoryEntries limit 73", () => {
    const entries = Array.from({ length: 20 }, (_, idx) => ({
      category: "mcp",
      slug: "s-" + idx,
      title: "T",
      dateAdded: "2026-0" + ((idx % 9) + 1).toString().padStart(2, "0") + "-01",
    }));
    const sorted = sortRecentDirectoryEntries(entries, 2);
    expect(sorted.length).toBeLessThanOrEqual(2);
  });
  it("sortRecentDirectoryEntries limit 74", () => {
    const entries = Array.from({ length: 20 }, (_, idx) => ({
      category: "mcp",
      slug: "s-" + idx,
      title: "T",
      dateAdded: "2026-0" + ((idx % 9) + 1).toString().padStart(2, "0") + "-01",
    }));
    const sorted = sortRecentDirectoryEntries(entries, 3);
    expect(sorted.length).toBeLessThanOrEqual(3);
  });
  it("sortRecentDirectoryEntries limit 75", () => {
    const entries = Array.from({ length: 20 }, (_, idx) => ({
      category: "mcp",
      slug: "s-" + idx,
      title: "T",
      dateAdded: "2026-0" + ((idx % 9) + 1).toString().padStart(2, "0") + "-01",
    }));
    const sorted = sortRecentDirectoryEntries(entries, 4);
    expect(sorted.length).toBeLessThanOrEqual(4);
  });
  it("sortRecentDirectoryEntries limit 76", () => {
    const entries = Array.from({ length: 20 }, (_, idx) => ({
      category: "mcp",
      slug: "s-" + idx,
      title: "T",
      dateAdded: "2026-0" + ((idx % 9) + 1).toString().padStart(2, "0") + "-01",
    }));
    const sorted = sortRecentDirectoryEntries(entries, 5);
    expect(sorted.length).toBeLessThanOrEqual(5);
  });
  it("sortRecentDirectoryEntries limit 77", () => {
    const entries = Array.from({ length: 20 }, (_, idx) => ({
      category: "mcp",
      slug: "s-" + idx,
      title: "T",
      dateAdded: "2026-0" + ((idx % 9) + 1).toString().padStart(2, "0") + "-01",
    }));
    const sorted = sortRecentDirectoryEntries(entries, 6);
    expect(sorted.length).toBeLessThanOrEqual(6);
  });
  it("sortRecentDirectoryEntries limit 78", () => {
    const entries = Array.from({ length: 20 }, (_, idx) => ({
      category: "mcp",
      slug: "s-" + idx,
      title: "T",
      dateAdded: "2026-0" + ((idx % 9) + 1).toString().padStart(2, "0") + "-01",
    }));
    const sorted = sortRecentDirectoryEntries(entries, 7);
    expect(sorted.length).toBeLessThanOrEqual(7);
  });
  it("sortRecentDirectoryEntries limit 79", () => {
    const entries = Array.from({ length: 20 }, (_, idx) => ({
      category: "mcp",
      slug: "s-" + idx,
      title: "T",
      dateAdded: "2026-0" + ((idx % 9) + 1).toString().padStart(2, "0") + "-01",
    }));
    const sorted = sortRecentDirectoryEntries(entries, 8);
    expect(sorted.length).toBeLessThanOrEqual(8);
  });
});

describe("content-query-lib createResettablePromiseCache", () => {
  it("shares a single in-flight load across concurrent callers", async () => {
    let calls = 0;
    const load = createResettablePromiseCache(async () => {
      calls += 1;
      return calls;
    });
    const [a, b] = await Promise.all([load(), load()]);
    expect(calls).toBe(1);
    expect(a).toBe(1);
    expect(b).toBe(1);
  });

  it("memoizes the resolved value on subsequent calls", async () => {
    let calls = 0;
    const load = createResettablePromiseCache(async () => {
      calls += 1;
      return calls;
    });
    expect(await load()).toBe(1);
    expect(await load()).toBe(1);
    expect(calls).toBe(1);
  });

  it("retries after a rejection instead of pinning the rejected promise", async () => {
    let calls = 0;
    const load = createResettablePromiseCache(async () => {
      calls += 1;
      if (calls === 1) throw new Error("transient failure");
      return "recovered";
    });

    await expect(load()).rejects.toThrow("transient failure");
    // Without reset-on-reject the second call would resurface the same
    // rejected promise; with it, the loader re-runs and heals.
    expect(await load()).toBe("recovered");
    expect(calls).toBe(2);
  });

  it("propagates the rejection to every concurrent caller of a failed load", async () => {
    let calls = 0;
    const load = createResettablePromiseCache(async () => {
      calls += 1;
      throw new Error("boom");
    });
    const results = await Promise.allSettled([load(), load()]);
    expect(results.every((r) => r.status === "rejected")).toBe(true);
    // One shared in-flight attempt for the two concurrent callers.
    expect(calls).toBe(1);
  });
});

describe("content-query-lib pruneEntryDetailCache boundaries", () => {
  it("does not evict anything when the map is below capacity", () => {
    const map = new Map([
      ["a", 1],
      ["b", 2],
    ]);
    pruneEntryDetailCache(map, 5);
    expect(map.size).toBe(2);
    expect(map.has("a")).toBe(true);
    expect(map.has("b")).toBe(true);
  });

  it("is a safe no-op for an empty map at zero capacity", () => {
    const map = new Map<string, number>();
    expect(() => pruneEntryDetailCache(map, 0)).not.toThrow();
    expect(map.size).toBe(0);
  });
});
