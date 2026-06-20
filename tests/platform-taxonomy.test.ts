import fs from "node:fs";
import path from "node:path";

import { describe, expect, it } from "vitest";

import {
  PLATFORM_IDS,
  PLATFORM_LABELS,
  normalizePlatform,
  normalizePlatforms,
} from "@heyclaude/registry";
import { PLATFORM_LABEL } from "../apps/web/src/types/registry";
import { repoRoot } from "./helpers/registry-fixtures";

describe("canonical platform taxonomy (#3920)", () => {
  it("normalizes display names and slugs to one canonical ID", () => {
    expect(normalizePlatform("Codex")).toBe("codex");
    expect(normalizePlatform("codex")).toBe("codex");
    expect(normalizePlatform("Claude")).toBe("claude-code");
    expect(normalizePlatform("Generic AGENTS")).toBe("cli");
    expect(normalizePlatform("VS Code")).toBe("vscode");
    expect(normalizePlatform("antigravity")).toBeUndefined();
    expect(normalizePlatform(42)).toBeUndefined();
  });

  it("dedupes equivalent platforms and drops unknowns, preserving order", () => {
    expect(
      normalizePlatforms(["Codex", "codex", "Cursor", "antigravity", "Claude"]),
    ).toEqual(["codex", "cursor", "claude-code"]);
    expect(normalizePlatforms(undefined)).toEqual([]);
  });

  it("registry taxonomy stays in sync with the web Platform labels (no drift)", () => {
    expect([...PLATFORM_IDS].sort()).toEqual(
      Object.keys(PLATFORM_LABEL).sort(),
    );
    for (const id of PLATFORM_IDS) {
      expect(PLATFORM_LABELS[id], id).toBe(
        PLATFORM_LABEL[id as keyof typeof PLATFORM_LABEL],
      );
    }
  });

  it("the generated directory index exposes only canonical platform IDs", () => {
    const index = JSON.parse(
      fs.readFileSync(
        path.join(repoRoot, "apps/web/public/data/directory-index.json"),
        "utf8",
      ),
    );
    const entries = index.entries ?? index;
    const canonical = new Set(PLATFORM_IDS);
    const offenders = new Set<string>();
    for (const entry of entries) {
      for (const platform of entry.trustSignals?.platforms ?? []) {
        if (!canonical.has(platform)) offenders.add(platform);
      }
    }
    expect([...offenders]).toEqual([]);
  });
});
