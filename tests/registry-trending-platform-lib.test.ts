import { describe, expect, it } from "vitest";

import type { Entry } from "../apps/web/src/types/registry";
import {
  entryPlatforms,
  matchesPlatform,
  normalizePlatform,
  platformAliases,
} from "../apps/web/src/lib/registry-trending-platform-lib";

const entry = (over: Record<string, unknown> = {}): Entry =>
  ({ category: "agents", slug: "a", ...over }) as Entry;

describe("normalizePlatform", () => {
  it("trims and lowercases", () => {
    expect(normalizePlatform("  Claude-Code ")).toBe("claude-code");
  });
});

describe("platformAliases", () => {
  it("expands claude and vs code, passes others through, empty for blank", () => {
    expect(platformAliases("claude")).toEqual([
      "claude",
      "claude-code",
      "claude-desktop",
    ]);
    expect(platformAliases("VS Code")).toEqual(["vscode"]);
    expect(platformAliases("cursor")).toEqual(["cursor"]);
    expect(platformAliases("   ")).toEqual([]);
  });
});

describe("entryPlatforms", () => {
  it("normalizes and dedupes platforms + compatibility", () => {
    const result = entryPlatforms(
      entry({
        platforms: ["Claude-Code", "cursor"],
        platformCompatibility: [{ platform: "CURSOR" }, { platform: "zed" }],
      }),
    );
    expect(result.sort()).toEqual(["claude-code", "cursor", "zed"]);
  });

  it("is empty when no platforms are present", () => {
    expect(entryPlatforms(entry())).toEqual([]);
  });
});

describe("matchesPlatform", () => {
  const e = entry({ platforms: ["claude-code"] });

  it("matches everything for a blank query", () => {
    expect(matchesPlatform(e, "")).toBe(true);
  });

  it("matches via alias expansion", () => {
    expect(matchesPlatform(e, "claude")).toBe(true);
  });

  it("is false when unsupported", () => {
    expect(matchesPlatform(e, "cursor")).toBe(false);
  });
});
