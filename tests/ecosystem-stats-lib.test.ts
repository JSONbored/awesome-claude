import { describe, expect, it } from "vitest";

import type { Entry } from "@/types/registry";
import {
  installMethodDistribution,
  installMethodOf,
  notesCoverage,
} from "../apps/web/src/lib/ecosystem-stats-lib";

function entry(partial: Partial<Entry> = {}): Entry {
  return { category: "mcp", slug: "x", title: "X", ...partial } as Entry;
}

describe("installMethodOf", () => {
  describe("npm / npx", () => {
    it.each([
      "npx -y some-mcp",
      "npx @scope/pkg",
      "npm install -g x",
      "npm i package",
      "NPM install global-tool",
    ])("classifies %s as npm / npx", (command) => {
      expect(installMethodOf(command)).toBe("npm / npx");
    });
  });

  describe("pnpm", () => {
    it.each(["pnpm add x", "pnpm install pkg", "PNPM dlx tool"])(
      "classifies %s as pnpm",
      (command) => {
        expect(installMethodOf(command)).toBe("pnpm");
      },
    );
  });

  describe("yarn", () => {
    it.each(["yarn add x", "yarn global add pkg", "YARN dlx tool"])(
      "classifies %s as yarn",
      (command) => {
        expect(installMethodOf(command)).toBe("yarn");
      },
    );
  });

  describe("bun", () => {
    it.each(["bunx x", "bun x pkg", "BUN install tool"])(
      "classifies %s as bun",
      (command) => {
        expect(installMethodOf(command)).toBe("bun");
      },
    );
  });

  describe("deno", () => {
    it.each(["deno run mod.ts", "deno install -g pkg"])(
      "classifies %s as deno",
      (command) => {
        expect(installMethodOf(command)).toBe("deno");
      },
    );
  });

  describe("Python (pip / uv)", () => {
    it.each([
      "uvx some-server",
      "uv tool install pkg",
      "pip install x",
      "pip3 install package",
      "pipx run x",
      "pipx install tool",
      "python -m pip install x",
    ])("classifies %s as Python (pip / uv)", (command) => {
      expect(installMethodOf(command)).toBe("Python (pip / uv)");
    });
  });

  describe("Docker", () => {
    it.each(["docker run img", "docker compose up", "DOCKER pull image"])(
      "classifies %s as Docker",
      (command) => {
        expect(installMethodOf(command)).toBe("Docker");
      },
    );
  });

  describe("Go", () => {
    it.each(["go install example.com/pkg@latest", "go get tool"])(
      "classifies %s as Go",
      (command) => {
        expect(installMethodOf(command)).toBe("Go");
      },
    );
  });

  describe("Cargo", () => {
    it.each(["cargo install crate", "cargo binstall tool"])(
      "classifies %s as Cargo",
      (command) => {
        expect(installMethodOf(command)).toBe("Cargo");
      },
    );
  });

  describe("Homebrew", () => {
    it.each(["brew install x", "brew tap org/repo"])(
      "classifies %s as Homebrew",
      (command) => {
        expect(installMethodOf(command)).toBe("Homebrew");
      },
    );
  });

  describe("Claude CLI", () => {
    it.each([
      "claude mcp add x https://example/mcp",
      "claude mcp add --transport http srv url",
      "CLAUDE mcp list",
    ])("classifies %s as Claude CLI", (command) => {
      expect(installMethodOf(command)).toBe("Claude CLI (claude mcp add …)");
    });
  });

  describe("Claude slash command", () => {
    it.each(["/agents", "/commit", "/review-pr"])(
      "classifies %s as slash command",
      (command) => {
        expect(installMethodOf(command)).toBe("Claude slash command");
      },
    );
  });

  describe("Git clone", () => {
    it.each(["git clone https://github.com/x/y", "git clone --depth 1 repo"])(
      "classifies %s as Git clone",
      (command) => {
        expect(installMethodOf(command)).toBe("Git clone");
      },
    );
  });

  describe("Shell (curl / wget)", () => {
    it.each([
      "curl https://example.com | sh",
      "curl -fsSL https://install.example | bash",
      "wget https://example.com/script.sh",
    ])("classifies %s as Shell", (command) => {
      expect(installMethodOf(command)).toBe("Shell (curl / wget)");
    });
  });

  describe("Manual file setup", () => {
    it.each([
      "mkdir -p .claude/commands && cat > x",
      "cp template.md ./rules/rule.mdc",
      "mv download.zip ./skills/",
      "echo '{}' > config.json",
      "touch .claude/settings.json",
      "tee .mcp.json <<EOF",
    ])("classifies %s as Manual file setup", (command) => {
      expect(installMethodOf(command)).toBe("Manual file setup");
    });
  });

  describe("empty and unrecognized", () => {
    it.each([undefined, null, "", "   "])(
      "returns null for empty install command %j",
      (command) => {
        expect(installMethodOf(command)).toBeNull();
      },
    );

    it.each([
      "frobnicate --install x",
      "make install",
      "just setup",
      "ansible-playbook site.yml",
    ])("buckets unrecognized command %s as Other", (command) => {
      expect(installMethodOf(command)).toBe("Other");
    });
  });

  describe("normalization", () => {
    it("trims surrounding whitespace before classification", () => {
      expect(installMethodOf("  npx pkg  ")).toBe("npm / npx");
    });

    it("is case-insensitive when matching the first token", () => {
      expect(installMethodOf("NPX pkg")).toBe("npm / npx");
      expect(installMethodOf("Docker run x")).toBe("Docker");
    });
  });

  describe("rule precedence", () => {
    it("prefers npm/npx over later rules in compound commands", () => {
      expect(installMethodOf("npx docker-tool")).toBe("npm / npx");
    });

    it("prefers Claude CLI over git when command starts with claude", () => {
      expect(installMethodOf("claude mcp add via git")).toBe(
        "Claude CLI (claude mcp add …)",
      );
    });

    it("classifies pip install mid-command via Python rule", () => {
      expect(installMethodOf("sudo pip install pkg")).toBe("Python (pip / uv)");
    });
  });
});

describe("installMethodDistribution", () => {
  it("returns empty rows for an empty catalog", () => {
    expect(installMethodDistribution([])).toEqual({ rows: [], total: 0 });
  });

  it("counts only installable entries and rows sum to the installable total", () => {
    const entries = [
      entry({ installCommand: "npx a" }),
      entry({ installCommand: "npx b" }),
      entry({ installCommand: "pip install c" }),
      entry({ installCommand: "" }),
      entry({}),
    ];
    const { rows, total } = installMethodDistribution(entries);
    expect(total).toBe(3);
    expect(rows.reduce((sum, row) => sum + row.count, 0)).toBe(total);
    expect(rows[0]).toEqual({ label: "npm / npx", count: 2 });
  });

  it("sorts rows by count descending, then label ascending", () => {
    const entries = [
      entry({ installCommand: "pnpm a" }),
      entry({ installCommand: "pnpm b" }),
      entry({ installCommand: "yarn c" }),
      entry({ installCommand: "npx d" }),
      entry({ installCommand: "docker run e" }),
    ];
    const { rows, total } = installMethodDistribution(entries);
    expect(total).toBe(5);
    expect(rows.map((row) => row.label)).toEqual([
      "pnpm",
      "Docker",
      "npm / npx",
      "yarn",
    ]);
  });

  it("breaks count ties alphabetically by label", () => {
    const entries = [
      entry({ installCommand: "yarn a" }),
      entry({ installCommand: "pnpm b" }),
      entry({ installCommand: "npx c" }),
    ];
    const labels = installMethodDistribution(entries).rows.map(
      (row) => row.label,
    );
    expect(labels).toEqual(["npm / npx", "pnpm", "yarn"]);
  });

  it("includes Other bucket for unrecognized install commands", () => {
    const { rows, total } = installMethodDistribution([
      entry({ installCommand: "make install" }),
      entry({ installCommand: "just run" }),
    ]);
    expect(total).toBe(2);
    expect(rows).toEqual([{ label: "Other", count: 2 }]);
  });

  it("aggregates many install methods across a large catalog", () => {
    const entries = [
      ...Array.from({ length: 5 }, (_, i) =>
        entry({ slug: `npx-${i}`, installCommand: "npx pkg" }),
      ),
      ...Array.from({ length: 3 }, (_, i) =>
        entry({ slug: `pip-${i}`, installCommand: "pip install pkg" }),
      ),
      entry({ slug: "claude", installCommand: "claude mcp add x url" }),
      entry({ slug: "slash", installCommand: "/agents" }),
    ];
    const { rows, total } = installMethodDistribution(entries);
    expect(total).toBe(10);
    expect(rows[0]).toEqual({ label: "npm / npx", count: 5 });
    expect(rows.find((row) => row.label === "Python (pip / uv)")?.count).toBe(
      3,
    );
  });

  it("ignores entries without installCommand entirely", () => {
    const { total } = installMethodDistribution([
      entry({ installCommand: "npx a" }),
      entry({ safetyNotes: "config only" }),
      entry({ installCommand: null }),
    ]);
    expect(total).toBe(1);
  });
});

describe("notesCoverage", () => {
  it("returns zeros for an empty catalog", () => {
    expect(notesCoverage([])).toEqual({
      total: 0,
      safety: 0,
      privacy: 0,
      both: 0,
    });
  });

  it("bounds every count by the total and both by min(safety, privacy)", () => {
    const entries = [
      entry({ safetyNotes: "x", privacyNotes: "y" }),
      entry({ safetyNotes: "x" }),
      entry({ privacyNotes: "y" }),
      entry({}),
    ];
    const coverage = notesCoverage(entries);
    expect(coverage.total).toBe(4);
    expect(coverage.safety).toBe(2);
    expect(coverage.privacy).toBe(2);
    expect(coverage.both).toBe(1);
    expect(coverage.safety).toBeLessThanOrEqual(coverage.total);
    expect(coverage.privacy).toBeLessThanOrEqual(coverage.total);
    expect(coverage.both).toBeLessThanOrEqual(
      Math.min(coverage.safety, coverage.privacy),
    );
  });

  it("counts safety-only entries", () => {
    const coverage = notesCoverage([
      entry({ safetyNotes: "scope API keys" }),
      entry({ safetyNotes: "run locally" }),
      entry({}),
    ]);
    expect(coverage).toEqual({ total: 3, safety: 2, privacy: 0, both: 0 });
  });

  it("counts privacy-only entries", () => {
    const coverage = notesCoverage([
      entry({ privacyNotes: "no telemetry" }),
      entry({}),
    ]);
    expect(coverage).toEqual({ total: 2, safety: 0, privacy: 1, both: 0 });
  });

  it("counts entries with both note types", () => {
    const coverage = notesCoverage([
      entry({ safetyNotes: "a", privacyNotes: "b" }),
      entry({ safetyNotes: "c", privacyNotes: "d" }),
      entry({ safetyNotes: "e" }),
    ]);
    expect(coverage.both).toBe(2);
    expect(coverage.safety).toBe(3);
    expect(coverage.privacy).toBe(2);
  });

  it("treats empty strings as absent notes", () => {
    const coverage = notesCoverage([
      entry({ safetyNotes: "", privacyNotes: "" }),
      entry({ safetyNotes: "real note" }),
    ]);
    expect(coverage.safety).toBe(1);
    expect(coverage.privacy).toBe(0);
  });

  it("aggregates coverage across a large mixed catalog", () => {
    const entries = Array.from({ length: 20 }, (_, index) =>
      entry({
        slug: `e-${index}`,
        safetyNotes: index % 2 === 0 ? "safety" : undefined,
        privacyNotes: index % 3 === 0 ? "privacy" : undefined,
      }),
    );
    const coverage = notesCoverage(entries);
    expect(coverage.total).toBe(20);
    expect(coverage.safety).toBe(10);
    expect(coverage.privacy).toBe(7);
    expect(coverage.both).toBe(4);
  });
});

describe("integration snapshots", () => {
  it("produces consistent install and notes breakdowns for a sample catalog", () => {
    const catalog = [
      entry({
        slug: "a",
        installCommand: "npx pkg-a",
        safetyNotes: "s",
        privacyNotes: "p",
      }),
      entry({
        slug: "b",
        installCommand: "pip install pkg-b",
        safetyNotes: "s",
      }),
      entry({
        slug: "c",
        installCommand: "claude mcp add c url",
        privacyNotes: "p",
      }),
      entry({ slug: "d" }),
    ];

    const install = installMethodDistribution(catalog);
    expect(install.total).toBe(3);
    expect(install.rows.map((row) => row.label)).toEqual([
      "Claude CLI (claude mcp add …)",
      "npm / npx",
      "Python (pip / uv)",
    ]);

    const notes = notesCoverage(catalog);
    expect(notes).toEqual({ total: 4, safety: 2, privacy: 2, both: 1 });
  });

  it("handles a tooling-heavy catalog with diverse install methods", () => {
    const commands = [
      "npx a",
      "pnpm b",
      "yarn c",
      "uvx d",
      "docker run e",
      "go install f",
      "cargo install g",
      "brew install h",
      "/agents",
      "git clone i",
      "curl j | sh",
      "mkdir -p k",
      "unknown-tool",
    ];
    const catalog = commands.map((installCommand, index) =>
      entry({ slug: `tool-${index}`, installCommand }),
    );
    const { rows, total } = installMethodDistribution(catalog);
    expect(total).toBe(13);
    expect(rows.length).toBeGreaterThan(8);
    expect(rows.every((row) => row.count >= 1)).toBe(true);
  });
});

describe("install method matrix", () => {
  const cases: Array<[string, string]> = [
    ["npx -y pkg", "npm / npx"],
    ["pnpm add pkg", "pnpm"],
    ["yarn dlx pkg", "yarn"],
    ["bunx pkg", "bun"],
    ["deno task start", "deno"],
    ["uvx server", "Python (pip / uv)"],
    ["docker compose up", "Docker"],
    ["go install pkg", "Go"],
    ["cargo install pkg", "Cargo"],
    ["brew install pkg", "Homebrew"],
    ["claude mcp add x", "Claude CLI (claude mcp add …)"],
    ["/commit", "Claude slash command"],
    ["git clone repo", "Git clone"],
    ["wget url", "Shell (curl / wget)"],
    ["cp file dest", "Manual file setup"],
    ["custom-installer", "Other"],
  ];

  it.each(cases)("maps command %s to %s", (command, label) => {
    expect(installMethodOf(command)).toBe(label);
  });
});

describe("notes coverage invariants", () => {
  it("never exceeds total entry count", () => {
    const catalog = Array.from({ length: 15 }, (_, i) =>
      entry({
        safetyNotes: i % 2 === 0 ? "s" : undefined,
        privacyNotes: i % 3 === 0 ? "p" : undefined,
      }),
    );
    const coverage = notesCoverage(catalog);
    expect(coverage.safety).toBeLessThanOrEqual(coverage.total);
    expect(coverage.privacy).toBeLessThanOrEqual(coverage.total);
    expect(coverage.both).toBeLessThanOrEqual(coverage.total);
  });

  it("counts both only when safety and privacy coexist on the same entry", () => {
    const coverage = notesCoverage([
      entry({ safetyNotes: "only safety" }),
      entry({ privacyNotes: "only privacy" }),
      entry({ safetyNotes: "both", privacyNotes: "both" }),
    ]);
    expect(coverage.both).toBe(1);
  });
});

describe("install command edge matrix", () => {
  it.each([
    ["npm ci", "npm / npx"],
    ["npm run setup", "npm / npx"],
    ["npx --yes @scope/pkg", "npm / npx"],
    ["pnpm exec tool", "pnpm"],
    ["yarn plug'n'play add", "yarn"],
    ["bun install", "bun"],
    ["uv pip install pkg", "Python (pip / uv)"],
    ["pipx inject pkg", "Python (pip / uv)"],
    ["docker build -t img .", "Docker"],
    ["go run .", "Go"],
    ["cargo run", "Cargo"],
    ["brew bundle install", "Homebrew"],
    ["claude plugin install x", "Claude CLI (claude mcp add …)"],
    ["/fix", "Claude slash command"],
    ["/lint", "Claude slash command"],
    ["git submodule update", "Git clone"],
    ["curl -L url", "Shell (curl / wget)"],
    ["wget -qO- url", "Shell (curl / wget)"],
    ["mkdir path", "Manual file setup"],
    ["cat file > out", "Manual file setup"],
    ["mv src dest", "Manual file setup"],
    ["echo hi > file", "Manual file setup"],
    ["touch file", "Manual file setup"],
    ["tee outfile", "Manual file setup"],
  ])("classifies edge command %s as %s", (command, label) => {
    expect(installMethodOf(command)).toBe(label);
  });
});

describe("notes field combinations", () => {
  it.each([
    [
      { safetyNotes: "a", privacyNotes: "b" },
      { safety: 1, privacy: 1, both: 1 },
    ],
    [{ safetyNotes: "a" }, { safety: 1, privacy: 0, both: 0 }],
    [{ privacyNotes: "b" }, { safety: 0, privacy: 1, both: 0 }],
    [{}, { safety: 0, privacy: 0, both: 0 }],
  ] as const)("counts notes for %j", (partial, expected) => {
    const coverage = notesCoverage([entry(partial)]);
    expect(coverage.total).toBe(1);
    expect(coverage.safety).toBe(expected.safety);
    expect(coverage.privacy).toBe(expected.privacy);
    expect(coverage.both).toBe(expected.both);
  });
});

describe("large batch install distribution", () => {
  it("handles fifty-entry catalogs deterministically", () => {
    const methods = [
      "npx",
      "pnpm",
      "yarn",
      "pip install",
      "docker run",
      "go install",
    ];
    const catalog = Array.from({ length: 50 }, (_, index) =>
      entry({
        slug: `batch-${index}`,
        installCommand: `${methods[index % methods.length]} pkg-${index}`,
      }),
    );
    const { rows, total } = installMethodDistribution(catalog);
    expect(total).toBe(50);
    expect(rows.reduce((sum, row) => sum + row.count, 0)).toBe(50);
    expect(rows[0]?.count).toBeGreaterThanOrEqual(rows.at(-1)?.count ?? 0);
  });
});

describe("slash command precedence", () => {
  it("classifies leading slash before other tokens", () => {
    expect(installMethodOf("/agents install")).toBe("Claude slash command");
    expect(installMethodOf("/custom-tool")).toBe("Claude slash command");
  });
});

describe("python install mid-string detection", () => {
  it.each([
    "sudo pip install package",
    "python3 -m pip install package",
    "env pip install package",
  ])("detects pip install in %s", (command) => {
    expect(installMethodOf(command)).toBe("Python (pip / uv)");
  });
});

describe("catalog notes snapshot", () => {
  it("summarizes a realistic registry slice", () => {
    const catalog = [
      entry({
        slug: "mcp-a",
        installCommand: "npx a",
        safetyNotes: "scope keys",
      }),
      entry({
        slug: "mcp-b",
        installCommand: "uvx b",
        privacyNotes: "local only",
      }),
      entry({
        slug: "mcp-c",
        installCommand: "claude mcp add c",
        safetyNotes: "oauth",
        privacyNotes: "scopes",
      }),
      entry({ slug: "skill-d", installCommand: "/agents" }),
      entry({ slug: "hook-e" }),
    ];
    expect(installMethodDistribution(catalog).total).toBe(4);
    expect(notesCoverage(catalog)).toEqual({
      total: 5,
      safety: 2,
      privacy: 2,
      both: 1,
    });
  });
});

describe("install method label coverage", () => {
  const expectedLabels = [
    "npm / npx",
    "pnpm",
    "yarn",
    "bun",
    "deno",
    "Python (pip / uv)",
    "Docker",
    "Go",
    "Cargo",
    "Homebrew",
    "Claude CLI (claude mcp add …)",
    "Claude slash command",
    "Git clone",
    "Shell (curl / wget)",
    "Manual file setup",
    "Other",
  ];

  it.each(expectedLabels)(
    "emits bucket label %s from at least one command",
    (label) => {
      const commands: Record<string, string> = {
        "npm / npx": "npx pkg",
        pnpm: "pnpm add pkg",
        yarn: "yarn add pkg",
        bun: "bunx pkg",
        deno: "deno run mod",
        "Python (pip / uv)": "pip install pkg",
        Docker: "docker run img",
        Go: "go install pkg",
        Cargo: "cargo install pkg",
        Homebrew: "brew install pkg",
        "Claude CLI (claude mcp add …)": "claude mcp add x",
        "Claude slash command": "/agents",
        "Git clone": "git clone repo",
        "Shell (curl / wget)": "curl url",
        "Manual file setup": "mkdir dir",
        Other: "unknown-installer",
      };
      expect(installMethodOf(commands[label])).toBe(label);
    },
  );
});

describe("notes coverage batch scenarios", () => {
  it("handles catalogs with only safety notes", () => {
    const coverage = notesCoverage(
      Array.from({ length: 8 }, () => entry({ safetyNotes: "note" })),
    );
    expect(coverage).toEqual({ total: 8, safety: 8, privacy: 0, both: 0 });
  });

  it("handles catalogs with only privacy notes", () => {
    const coverage = notesCoverage(
      Array.from({ length: 6 }, () => entry({ privacyNotes: "note" })),
    );
    expect(coverage).toEqual({ total: 6, safety: 0, privacy: 6, both: 0 });
  });

  it("handles catalogs where every entry has both notes", () => {
    const coverage = notesCoverage(
      Array.from({ length: 4 }, () =>
        entry({ safetyNotes: "s", privacyNotes: "p" }),
      ),
    );
    expect(coverage).toEqual({ total: 4, safety: 4, privacy: 4, both: 4 });
  });
});

describe("install distribution single-bucket catalogs", () => {
  it.each([
    ["npx only", ["npx a", "npx b", "npm i c"]],
    ["pnpm only", ["pnpm a", "pnpm b"]],
    ["python only", ["pip install a", "uvx b"]],
  ])("aggregates %s catalogs", (_label, commands) => {
    const catalog = commands.map((installCommand, index) =>
      entry({ slug: `e-${index}`, installCommand }),
    );
    const { rows, total } = installMethodDistribution(catalog);
    expect(total).toBe(commands.length);
    expect(rows).toHaveLength(1);
    expect(rows[0]?.count).toBe(commands.length);
  });
});

describe("distribution row integrity", () => {
  it("never emits zero-count rows", () => {
    const { rows } = installMethodDistribution([
      entry({ installCommand: "npx a" }),
      entry({ installCommand: "pnpm b" }),
    ]);
    expect(rows.every((row) => row.count > 0)).toBe(true);
  });

  it("preserves deterministic ordering for repeated runs", () => {
    const catalog = [
      entry({ installCommand: "npx a" }),
      entry({ installCommand: "npx b" }),
      entry({ installCommand: "pnpm c" }),
    ];
    const first = installMethodDistribution(catalog);
    const second = installMethodDistribution(catalog);
    expect(second).toEqual(first);
  });
});
