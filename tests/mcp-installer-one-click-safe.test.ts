import { describe, expect, it } from "vitest";

import { isOneClickSafeStdioCommand } from "../integrations/raycast/src/mcp-installer.js";

describe("isOneClickSafeStdioCommand", () => {
  it("allows the known package-runner commands", () => {
    // Only npx/uvx are safe to run unattended for one-click install.
    expect(isOneClickSafeStdioCommand("npx")).toBe(true);
    expect(isOneClickSafeStdioCommand("uvx")).toBe(true);
  });

  it("is case-insensitive and trims surrounding whitespace", () => {
    expect(isOneClickSafeStdioCommand("UVX")).toBe(true);
    expect(isOneClickSafeStdioCommand("  npx  ")).toBe(true);
  });

  it("rejects commands outside the allow-list", () => {
    expect(isOneClickSafeStdioCommand("node")).toBe(false);
    expect(isOneClickSafeStdioCommand("bash")).toBe(false);
    expect(isOneClickSafeStdioCommand("")).toBe(false);
  });

  it("rejects path-qualified commands to block arbitrary executables", () => {
    // A path separator means a specific binary on disk, not the trusted runner.
    expect(isOneClickSafeStdioCommand("/usr/bin/npx")).toBe(false);
    expect(isOneClickSafeStdioCommand("./npx")).toBe(false);
    expect(isOneClickSafeStdioCommand("C:\\tools\\npx")).toBe(false);
  });

  it("rejects non-string inputs", () => {
    expect(isOneClickSafeStdioCommand(42)).toBe(false);
    expect(isOneClickSafeStdioCommand({ command: "npx" })).toBe(false);
  });
});
