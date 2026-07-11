import { describe, expect, it } from "vitest";
import type { Entry } from "@/types/registry";
import {
  SAFETY_RISK_KIND_LABEL,
  classifySafetyNote,
  entrySafetySurfaceState,
} from "@/lib/entry-safety-surface-lib";

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

describe("classifySafetyNote", () => {
  it("routes credential and permission phrasing first", () => {
    expect(classifySafetyNote("Requires an API token to authenticate")).toBe(
      "credentials",
    );
    expect(classifySafetyNote("Needs elevated permission scopes")).toBe(
      "permissions",
    );
  });

  it("classifies network, filesystem, execution, retention, telemetry", () => {
    expect(
      classifySafetyNote("Makes outbound network requests to an endpoint"),
    ).toBe("network");
    expect(classifySafetyNote("Writes files to a local directory")).toBe(
      "filesystem",
    );
    expect(classifySafetyNote("Runs a shell command in the background")).toBe(
      "execution",
    );
    expect(classifySafetyNote("Data is retained and stored in a cache")).toBe(
      "retention",
    );
    expect(classifySafetyNote("Collects anonymous usage analytics")).toBe(
      "telemetry",
    );
  });

  it("classifies third-party handling", () => {
    expect(
      classifySafetyNote("Sends data to an external service provider"),
    ).toBe("third-party");
  });

  it("falls back to general and is case-insensitive", () => {
    expect(classifySafetyNote("General informational note")).toBe("general");
    expect(classifySafetyNote("MAKES NETWORK REQUESTS")).toBe("network");
  });

  it("exposes a label for every kind", () => {
    for (const kind of [
      "execution",
      "network",
      "filesystem",
      "credentials",
      "permissions",
      "retention",
      "telemetry",
      "third-party",
      "general",
    ] as const) {
      expect(SAFETY_RISK_KIND_LABEL[kind]).toBeTruthy();
    }
  });
});

describe("entrySafetySurfaceState", () => {
  it("hides the panel when no notes are declared", () => {
    const state = entrySafetySurfaceState(entry());
    expect(state.showPanel).toBe(false);
    expect(state.summary).toContain("No safety or privacy");
  });

  it("prefers list fields, trims, and drops blanks with stable ids", () => {
    const state = entrySafetySurfaceState(
      entry({
        safetyNotesList: ["  Runs a shell command  ", "   "],
        privacyNotesList: ["Stores logs locally"],
      }),
    );
    expect(state.safetyCount).toBe(1);
    expect(state.privacyCount).toBe(1);
    expect(state.items.map((item) => item.id)).toEqual([
      "safety-1",
      "privacy-1",
    ]);
    expect(state.items[0]?.text).toBe("Runs a shell command");
  });

  it("falls back to the single-string note fields", () => {
    const state = entrySafetySurfaceState(
      entry({ safetyNotes: "Makes network requests" }),
    );
    expect(state.safetyCount).toBe(1);
    expect(state.items[0]?.source).toBe("safety");
    expect(state.items[0]?.kind).toBe("network");
  });

  it("summarizes counts, coverage, and flags sensitive kinds", () => {
    const state = entrySafetySurfaceState(
      entry({
        safetyNotesList: [
          "Runs a shell command",
          "Requires an API token",
          "Makes network requests",
        ],
        privacyNotesList: ["Sends data to an external provider"],
        disclosure: "Editorial listing",
      }),
    );
    expect(state.showPanel).toBe(true);
    expect(state.safetyCount).toBe(3);
    expect(state.privacyCount).toBe(1);
    expect(state.coverageCount).toBe(4);
    expect(state.kinds.map((k) => k.kind)).toEqual([
      "execution",
      "network",
      "credentials",
      "third-party",
    ]);
    expect(state.sensitiveKinds).toEqual([
      "credentials",
      "network",
      "third-party",
    ]);
    expect(state.summary).toContain("3 safety and 1 privacy");
    expect(state.summary).toContain("Review closely");
    expect(state.disclosure).toBe("Editorial listing");
  });

  it("returns null disclosure when absent or blank", () => {
    const state = entrySafetySurfaceState(
      entry({ safetyNotes: "Runs a command", disclosure: "   " }),
    );
    expect(state.disclosure).toBeNull();
  });

  it("collapses duplicate kinds into one summary entry with a count", () => {
    const state = entrySafetySurfaceState(
      entry({ safetyNotesList: ["Writes a file", "Reads from a file"] }),
    );
    expect(state.kinds).toHaveLength(1);
    expect(state.kinds[0]).toMatchObject({ kind: "filesystem", count: 2 });
  });
});
