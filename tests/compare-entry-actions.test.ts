import { describe, expect, it, vi } from "vitest";
import type { Entry } from "@/types/registry";
import {
  compareActionSignature,
  compareActionsDiverge,
  recordCompareIntentEvent,
  resolveCompareEntryActions,
} from "@/lib/compare-entry-actions";

function entry(overrides: Partial<Entry> = {}): Entry {
  return {
    category: "mcp",
    slug: "fixture",
    title: "Fixture",
    description: "Fixture description",
    author: "Author",
    tags: [],
    platforms: ["claude-code"],
    installType: "manual",
    trust: "review",
    source: "unverified",
    dateAdded: "2026-01-01",
    ...overrides,
  } as Entry;
}

describe("compare entry actions", () => {
  it("always offers dossier navigation and optional install, config, source, and claim CTAs", () => {
    expect(
      resolveCompareEntryActions(entry()).map((action) => action.id),
    ).toEqual(["dossier", "claim"]);
    expect(
      resolveCompareEntryActions(
        entry({
          installCommand: "npm i fixture",
          configSnippet: '{ "mcp": true }',
          sourceUrl: "https://github.com/org/repo",
          claimed: true,
        }),
      ).map((action) => action.id),
    ).toEqual(["dossier", "install", "config", "source"]);
  });

  it("detects when compared entries expose different next-action sets", () => {
    expect(
      compareActionsDiverge([
        entry({ installCommand: "npm i fixture" }),
        entry(),
      ]),
    ).toBe(true);
    expect(
      compareActionsDiverge([
        entry({ installCommand: "npm i fixture" }),
        entry({ installCommand: "pnpm add fixture" }),
      ]),
    ).toBe(false);
    expect(compareActionSignature(entry())).toBe("dossier|claim");
  });

  it("records compare intent events with entry keys only and degrades safely", async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ stored: true }),
      })
      .mockRejectedValueOnce(new Error("offline"));
    vi.stubGlobal("fetch", fetchMock);

    await expect(
      recordCompareIntentEvent(
        "install",
        entry({ category: "skills", slug: "demo" }),
      ),
    ).resolves.toBe(true);
    expect(fetchMock).toHaveBeenCalledWith("/api/intent-events", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ type: "install", entryKey: "skills/demo" }),
    });

    await expect(recordCompareIntentEvent("open", entry())).resolves.toBe(
      false,
    );

    vi.unstubAllGlobals();
  });
});
