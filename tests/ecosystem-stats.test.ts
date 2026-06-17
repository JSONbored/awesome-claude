import { describe, expect, it } from "vitest";

import type { Entry } from "../apps/web/src/types/registry";
import {
  installMethodDistribution,
  installMethodOf,
  notesCoverage,
} from "../apps/web/src/lib/ecosystem-stats";

function entry(partial: Partial<Entry>): Entry {
  return partial as Entry;
}

describe("installMethodOf", () => {
  it("classifies common install commands deterministically", () => {
    expect(installMethodOf("npx -y some-mcp")).toBe("npm / npx");
    expect(installMethodOf("npm install -g x")).toBe("npm / npx");
    expect(installMethodOf("pnpm add x")).toBe("pnpm");
    expect(installMethodOf("uvx some-server")).toBe("Python (pip / uv)");
    expect(installMethodOf("pip install x")).toBe("Python (pip / uv)");
    expect(installMethodOf("pipx run x")).toBe("Python (pip / uv)");
    expect(installMethodOf("docker run x")).toBe("Docker");
    expect(installMethodOf("go install x")).toBe("Go");
    expect(installMethodOf("cargo install x")).toBe("Cargo");
    expect(installMethodOf("brew install x")).toBe("Homebrew");
    expect(installMethodOf("bunx x")).toBe("bun");
  });

  it("classifies Claude-native and shell install patterns", () => {
    expect(installMethodOf("claude mcp add x https://...")).toBe(
      "Claude CLI (claude mcp add …)",
    );
    expect(installMethodOf("/agents")).toBe("Claude slash command");
    expect(installMethodOf("git clone https://github.com/x/y")).toBe(
      "Git clone",
    );
    expect(installMethodOf("curl https://example.com | sh")).toBe(
      "Shell (curl / wget)",
    );
    expect(installMethodOf("mkdir -p .claude/commands && cat > x")).toBe(
      "Manual file setup",
    );
  });

  it("returns null for no install command (config/file drop-in)", () => {
    expect(installMethodOf(undefined)).toBeNull();
    expect(installMethodOf("")).toBeNull();
    expect(installMethodOf("   ")).toBeNull();
  });

  it("buckets genuinely unrecognized commands as Other", () => {
    expect(installMethodOf("frobnicate --install x")).toBe("Other");
  });
});

describe("installMethodDistribution", () => {
  it("counts only installable entries and rows sum to the installable total", () => {
    const entries = [
      entry({ installCommand: "npx a" }),
      entry({ installCommand: "npx b" }),
      entry({ installCommand: "pip install c" }),
      entry({ installCommand: "" }), // not installable
      entry({}), // not installable
    ];
    const { rows, total } = installMethodDistribution(entries);
    expect(total).toBe(3);
    expect(rows.reduce((sum, r) => sum + r.count, 0)).toBe(total);
    expect(total).toBeLessThanOrEqual(entries.length);
    // sorted by count desc
    expect(rows[0]).toEqual({ label: "npm / npx", count: 2 });
  });
});

describe("notesCoverage", () => {
  it("bounds every count by the total and both by min(safety, privacy)", () => {
    const entries = [
      entry({ safetyNotes: "x", privacyNotes: "y" }),
      entry({ safetyNotes: "x" }),
      entry({ privacyNotes: "y" }),
      entry({}),
    ];
    const c = notesCoverage(entries);
    expect(c.total).toBe(4);
    expect(c.safety).toBe(2);
    expect(c.privacy).toBe(2);
    expect(c.both).toBe(1);
    expect(c.safety).toBeLessThanOrEqual(c.total);
    expect(c.privacy).toBeLessThanOrEqual(c.total);
    expect(c.both).toBeLessThanOrEqual(Math.min(c.safety, c.privacy));
  });
});
