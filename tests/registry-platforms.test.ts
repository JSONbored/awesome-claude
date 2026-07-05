import { describe, expect, it } from "vitest";

import {
  PLATFORM_IDS,
  normalizePlatform,
  normalizePlatforms,
} from "@heyclaude/registry";

describe("platforms re-export surface", () => {
  it("keeps the public import path wired to the extracted lib", () => {
    expect(PLATFORM_IDS).toContain("codex");
    expect(normalizePlatform("Claude")).toBe("claude-code");
    expect(normalizePlatforms(["Codex", "codex", "Cursor"])).toEqual([
      "codex",
      "cursor",
    ]);
  });
});
