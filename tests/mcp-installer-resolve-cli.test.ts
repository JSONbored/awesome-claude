import { describe, expect, it } from "vitest";

// Deep-relative test imports use the `.js` specifier across this repo's suite;
// the bundler maps it to the TypeScript source.
import {
  resolveClaudeCli,
  mcpCliCandidates,
} from "../integrations/raycast/src/mcp-installer.js";

const claudeCandidates = mcpCliCandidates("claude-code");

describe("resolveClaudeCli", () => {
  it("returns the first candidate whose --version probe succeeds", async () => {
    const first = claudeCandidates[0];
    // Inject an execFile that only the first candidate "responds" to.
    const execFile = async (file: string) => {
      if (file === first) return { stdout: "1.0.0" };
      throw new Error("not found");
    };
    await expect(resolveClaudeCli(execFile as never)).resolves.toBe(first);
  });

  it("falls through to a later candidate when earlier probes fail", async () => {
    const target = claudeCandidates[claudeCandidates.length - 1];
    const execFile = async (file: string) => {
      if (file === target) return { stdout: "1.0.0" };
      throw new Error("not found");
    };
    await expect(resolveClaudeCli(execFile as never)).resolves.toBe(target);
  });

  it("rejects with a helpful error when no candidate is runnable", async () => {
    // Every probe fails, so the helper reports the CLI as not found.
    const execFile = async () => {
      throw new Error("ENOENT");
    };
    await expect(resolveClaudeCli(execFile as never)).rejects.toThrow(
      "CLI was not found",
    );
  });
});
