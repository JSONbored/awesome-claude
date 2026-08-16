import { describe, expect, it } from "vitest";

import { platformLabel, sourceLabel, trustLabel } from "@/lib/facet-label-lib";
import type { Platform } from "@/types/registry";

describe("platformLabel", () => {
  // These are the cases CSS `capitalize` over the raw slug got wrong:
  // "Vscode", "Cli", "Claude-Code".
  it("cases acronyms and product names correctly", () => {
    expect(platformLabel("vscode")).toBe("VS Code");
    expect(platformLabel("cli")).toBe("CLI");
    expect(platformLabel("claude-code")).toBe("Claude Code");
    expect(platformLabel("claude-desktop")).toBe("Claude Desktop");
    expect(platformLabel("cursor")).toBe("Cursor");
    expect(platformLabel("raycast")).toBe("Raycast");
  });

  it("labels every member of the Platform union", () => {
    const platforms: Platform[] = [
      "claude-code",
      "claude-desktop",
      "cursor",
      "vscode",
      "windsurf",
      "codex",
      "gemini",
      "raycast",
      "cli",
      "aider",
      "zed",
      "continue",
    ];
    for (const p of platforms) {
      const label = platformLabel(p);
      expect(label).toBeTruthy();
      // A label equal to the raw id means the map missed it and the humanize
      // fallback produced a slug-shaped string.
      expect(label).not.toBe(p);
    }
  });

  it("humanizes an unknown id instead of leaking the slug", () => {
    expect(platformLabel("jetbrains-ide")).toBe("Jetbrains ide");
  });
});

describe("trustLabel", () => {
  it("labels every trust level", () => {
    expect(trustLabel("trusted")).toBe("Trusted");
    expect(trustLabel("review")).toBe("Review first");
    expect(trustLabel("limited")).toBe("Limited");
    expect(trustLabel("blocked")).toBe("Blocked");
  });
});

describe("sourceLabel", () => {
  it("keeps hyphenated compounds in sentence case", () => {
    expect(sourceLabel("first-party")).toBe("First-party");
    expect(sourceLabel("source-backed")).toBe("Source-backed");
    expect(sourceLabel("external")).toBe("External");
    expect(sourceLabel("unverified")).toBe("Unverified");
  });
});
