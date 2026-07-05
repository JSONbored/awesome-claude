import { describe, expect, it } from "vitest";

import {
  PLATFORM_ALIASES,
  PLATFORM_IDS,
  PLATFORM_LABELS,
  normalizePlatform,
  normalizePlatforms,
} from "../packages/registry/src/platforms-lib.js";

const ALIAS_ENTRIES = Object.entries(PLATFORM_ALIASES);

describe("PLATFORM_IDS", () => {
  it("lists every canonical platform id", () => {
    expect(PLATFORM_IDS).toEqual([
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
    ]);
  });

  it("contains no duplicate ids", () => {
    expect(new Set(PLATFORM_IDS).size).toBe(PLATFORM_IDS.length);
  });

  it.each(PLATFORM_IDS)("uses kebab-case id %s", (id) => {
    expect(id).toMatch(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);
  });
});

describe("PLATFORM_LABELS", () => {
  it.each(PLATFORM_IDS)("defines a human label for %s", (id) => {
    expect(PLATFORM_LABELS[id]).toBeTypeOf("string");
    expect(PLATFORM_LABELS[id].length).toBeGreaterThan(0);
  });

  it("maps claude-code and claude-desktop to distinct labels", () => {
    expect(PLATFORM_LABELS["claude-code"]).toBe("Claude Code");
    expect(PLATFORM_LABELS["claude-desktop"]).toBe("Claude Desktop");
  });

  it("labels generic CLI bucket as CLI", () => {
    expect(PLATFORM_LABELS.cli).toBe("CLI");
  });
});

describe("PLATFORM_ALIASES", () => {
  it("freezes alias lookup table", () => {
    expect(Object.isFrozen(PLATFORM_ALIASES)).toBe(true);
  });

  it.each(ALIAS_ENTRIES)("maps alias %j to canonical id %s", (alias, id) => {
    expect(PLATFORM_IDS).toContain(id);
  });

  it("maps multiple aliases onto claude-code", () => {
    const claudeAliases = ALIAS_ENTRIES.filter(
      ([, id]) => id === "claude-code",
    ).map(([alias]) => alias);
    expect(claudeAliases).toEqual(
      expect.arrayContaining(["claude", "claude code", "claude-code"]),
    );
  });

  it("maps generic agents variants onto cli", () => {
    const cliAliases = ALIAS_ENTRIES.filter(([, id]) => id === "cli").map(
      ([alias]) => alias,
    );
    expect(cliAliases).toEqual(
      expect.arrayContaining([
        "generic agents",
        "generic agents.md",
        "generic-agents",
        "agents",
        "agents-md",
        "cli",
      ]),
    );
  });
});

describe("normalizePlatform", () => {
  it.each(ALIAS_ENTRIES)("normalizes %j to %s", (alias, expected) => {
    expect(normalizePlatform(alias)).toBe(expected);
  });

  it.each([
    ["Codex", "codex"],
    ["CODEX", "codex"],
    [" Claude ", "claude-code"],
    [" VS Code ", "vscode"],
    ["Generic AGENTS", "cli"],
    ["Cursor-Rules", "cursor"],
    ["OpenAI", "codex"],
  ])("normalizes display name %s to %s", (input, expected) => {
    expect(normalizePlatform(input)).toBe(expected);
  });

  it.each([
    "antigravity",
    "chatgpt",
    "copilot",
    "unknown",
    "claude code extra",
    "",
    "   ",
  ])("returns undefined for unknown platform %j", (value) => {
    expect(normalizePlatform(value)).toBeUndefined();
  });

  it.each([null, undefined, 42, true, {}, []])(
    "returns undefined for non-string %j",
    (value) => {
      expect(normalizePlatform(value)).toBeUndefined();
    },
  );

  it("treats prototype property names as unknown platform values", () => {
    expect(normalizePlatform("constructor")).toBeUndefined();
    expect(normalizePlatform("__proto__")).toBeUndefined();
    expect(normalizePlatform("prototype")).toBeUndefined();
  });

  it("uses Object.hasOwn for alias lookup", () => {
    expect(normalizePlatform("toString")).toBeUndefined();
  });
});

describe("normalizePlatforms", () => {
  it("returns an empty array for undefined input", () => {
    expect(normalizePlatforms(undefined)).toEqual([]);
  });

  it("returns an empty array for an empty list", () => {
    expect(normalizePlatforms([])).toEqual([]);
  });

  it("dedupes equivalent platforms and drops unknowns, preserving order", () => {
    expect(
      normalizePlatforms(["Codex", "codex", "Cursor", "antigravity", "Claude"]),
    ).toEqual(["codex", "cursor", "claude-code"]);
  });

  it("preserves first-seen canonical order across aliases", () => {
    expect(
      normalizePlatforms([
        "Windsurf",
        "windsurf",
        "Gemini",
        "VS Code",
        "vscode",
      ]),
    ).toEqual(["windsurf", "gemini", "vscode"]);
  });

  it("skips unknown values without shifting later matches", () => {
    expect(
      normalizePlatforms(["unknown", "Codex", "also-unknown", "codex"]),
    ).toEqual(["codex"]);
  });

  it("handles lists containing only unknown platforms", () => {
    expect(normalizePlatforms(["foo", "bar", "baz"])).toEqual([]);
  });

  it("collapses many aliases of the same canonical id", () => {
    expect(
      normalizePlatforms(["claude", "Claude Code", "claude-code", "CLAUDE"]),
    ).toEqual(["claude-code"]);
  });

  it("maps generic agents family to cli once", () => {
    expect(
      normalizePlatforms([
        "Generic AGENTS",
        "agents-md",
        "cli",
        "generic-agents",
      ]),
    ).toEqual(["cli"]);
  });

  it("normalizes a long mixed batch deterministically", () => {
    const input = [
      "Raycast",
      "Aider",
      "Zed",
      "Continue",
      "OpenAI",
      "cursor-rules",
      "claude desktop",
      "vs code",
      "invalid",
      "gemini",
    ];
    expect(normalizePlatforms(input)).toEqual([
      "raycast",
      "aider",
      "zed",
      "continue",
      "codex",
      "cursor",
      "claude-desktop",
      "vscode",
      "gemini",
    ]);
  });
});

describe("alias coverage matrix", () => {
  const claudeCodeAliases = [
    "claude",
    "claude code",
    "claude-code",
    "Claude",
    "CLAUDE CODE",
  ];
  it.each(claudeCodeAliases)("classifies %s as claude-code", (alias) => {
    expect(normalizePlatform(alias)).toBe("claude-code");
  });

  const claudeDesktopAliases = [
    "claude desktop",
    "claude-desktop",
    "Claude Desktop",
  ];
  it.each(claudeDesktopAliases)("classifies %s as claude-desktop", (alias) => {
    expect(normalizePlatform(alias)).toBe("claude-desktop");
  });

  const codexAliases = ["codex", "Codex", "openai", "OpenAI"];
  it.each(codexAliases)("classifies %s as codex", (alias) => {
    expect(normalizePlatform(alias)).toBe("codex");
  });

  const cursorAliases = ["cursor", "Cursor", "cursor-rules", "CURSOR-RULES"];
  it.each(cursorAliases)("classifies %s as cursor", (alias) => {
    expect(normalizePlatform(alias)).toBe("cursor");
  });

  const vscodeAliases = ["vscode", "VS Code", "vs code", "VSCODE"];
  it.each(vscodeAliases)("classifies %s as vscode", (alias) => {
    expect(normalizePlatform(alias)).toBe("vscode");
  });
});

describe("platform id label symmetry", () => {
  it("defines labels only for known platform ids", () => {
    for (const key of Object.keys(PLATFORM_LABELS)) {
      expect(PLATFORM_IDS).toContain(key);
    }
  });

  it.each(PLATFORM_IDS)("label for %s is unique", (id) => {
    const duplicates = PLATFORM_IDS.filter(
      (other) => other !== id && PLATFORM_LABELS[other] === PLATFORM_LABELS[id],
    );
    if (id === "cli") {
      expect(duplicates).toEqual([]);
      return;
    }
    expect(duplicates.length).toBeLessThanOrEqual(1);
  });
});

describe("whitespace and casing normalization", () => {
  it.each([
    ["  codex  ", "codex"],
    ["\twindsurf\t", "windsurf"],
    ["\nraycast\n", "raycast"],
    ["  VS Code  ", "vscode"],
    ["  generic agents  ", "cli"],
  ])("trims and lowercases %j to %s", (input, expected) => {
    expect(normalizePlatform(input)).toBe(expected);
  });
});

describe("batch normalization edge cases", () => {
  it("ignores nullish entries by treating them as unknown", () => {
    expect(normalizePlatforms([null, "Codex", undefined, "codex"])).toEqual([
      "codex",
    ]);
  });

  it("does not mutate the input array", () => {
    const input = ["Codex", "Cursor"];
    const frozen = [...input];
    normalizePlatforms(input);
    expect(input).toEqual(frozen);
  });

  it("returns a fresh array on each call", () => {
    const first = normalizePlatforms(["Codex"]);
    const second = normalizePlatforms(["Codex"]);
    expect(second).toEqual(first);
    expect(second).not.toBe(first);
  });
});

describe("integration snapshots", () => {
  it("normalizes a realistic frontmatter platform list", () => {
    const frontmatter = [
      "Claude",
      "Codex",
      "Cursor",
      "Generic AGENTS",
      "VS Code",
      "Windsurf",
    ];
    expect(normalizePlatforms(frontmatter)).toEqual([
      "claude-code",
      "codex",
      "cursor",
      "cli",
      "vscode",
      "windsurf",
    ]);
  });

  it("handles skill compatibility aliases from submissions", () => {
    expect(
      normalizePlatforms([
        "claude-code",
        "openai",
        "cursor-rules",
        "agents-md",
        "gemini",
      ]),
    ).toEqual(["claude-code", "codex", "cursor", "cli", "gemini"]);
  });
});

describe("full alias table enumeration", () => {
  it("has exactly the expected number of aliases", () => {
    expect(ALIAS_ENTRIES).toHaveLength(23);
  });

  it.each(ALIAS_ENTRIES)(
    "alias %j resolves through normalizePlatform",
    (alias, id) => {
      expect(normalizePlatform(alias)).toBe(id);
      expect(normalizePlatforms([alias])).toEqual([id]);
    },
  );
});

describe("canonical id round trips", () => {
  it.each(PLATFORM_IDS)("accepts canonical id %s as input", (id) => {
    const aliasMatch = ALIAS_ENTRIES.find(([, target]) => target === id)?.[0];
    if (aliasMatch === id || id.includes("-")) {
      const viaAlias = normalizePlatform(id);
      if (viaAlias) expect(viaAlias).toBe(id);
    }
    expect(PLATFORM_LABELS[id]).toBeDefined();
  });
});

describe("search facet stability", () => {
  it("never emits duplicate ids from repeated canonical values", () => {
    const result = normalizePlatforms(PLATFORM_IDS);
    expect(result).toEqual(PLATFORM_IDS);
    expect(new Set(result).size).toBe(PLATFORM_IDS.length);
  });

  it("promotes first alias occurrence when multiple map to same id", () => {
    expect(normalizePlatforms(["openai", "codex"])).toEqual(["codex"]);
    expect(normalizePlatforms(["codex", "openai"])).toEqual(["codex"]);
  });
});

describe("unknown and reserved inputs", () => {
  it.each([
    "constructor",
    "__proto__",
    "toString",
    "valueOf",
    "hasOwnProperty",
  ])("does not treat reserved name %s as a platform alias", (name) => {
    expect(normalizePlatform(name)).toBeUndefined();
  });

  it.each([
    "chatgpt-desktop",
    "github-copilot",
    "replit",
    "bolt",
    "windsurf cascade",
  ])("rejects non-taxonomy platform %s", (value) => {
    expect(normalizePlatform(value)).toBeUndefined();
  });
});

describe("large batch performance sanity", () => {
  it("normalizes a thousand-value batch deterministically", () => {
    const batch = Array.from({ length: 1000 }, (_, index) => {
      const aliases = ["Codex", "Claude", "Cursor", "unknown", "Gemini"];
      return aliases[index % aliases.length];
    });
    const result = normalizePlatforms(batch);
    expect(result[0]).toBe("codex");
    expect(result).toContain("claude-code");
    expect(result).toContain("cursor");
    expect(result).toContain("gemini");
    expect(result).not.toContain("unknown");
  });
});

describe("platform label content", () => {
  it.each([
    ["claude-code", "Claude Code"],
    ["claude-desktop", "Claude Desktop"],
    ["cursor", "Cursor"],
    ["vscode", "VS Code"],
    ["windsurf", "Windsurf"],
    ["codex", "Codex"],
    ["gemini", "Gemini"],
    ["raycast", "Raycast"],
    ["cli", "CLI"],
    ["aider", "Aider"],
    ["zed", "Zed"],
    ["continue", "Continue"],
  ])("labels %s as %s", (id, label) => {
    expect(PLATFORM_LABELS[id]).toBe(label);
  });
});

describe("normalizePlatforms ordering invariants", () => {
  it("keeps vscode before windsurf when listed in that order", () => {
    expect(normalizePlatforms(["vscode", "windsurf"])).toEqual([
      "vscode",
      "windsurf",
    ]);
  });

  it("keeps aider before zed when listed in that order", () => {
    expect(normalizePlatforms(["aider", "zed"])).toEqual(["aider", "zed"]);
  });

  it("interleaves unknown values without affecting order of known ids", () => {
    expect(
      normalizePlatforms([
        "unknown-1",
        "codex",
        "unknown-2",
        "cursor",
        "unknown-3",
      ]),
    ).toEqual(["codex", "cursor"]);
  });
});

describe("multi-platform list scenarios", () => {
  it("normalizes editor-focused submission platforms", () => {
    expect(
      normalizePlatforms(["Cursor", "VS Code", "Windsurf", "Zed", "Continue"]),
    ).toEqual(["cursor", "vscode", "windsurf", "zed", "continue"]);
  });

  it("normalizes claude ecosystem variants in one pass", () => {
    expect(
      normalizePlatforms([
        "Claude",
        "Claude Desktop",
        "claude-code",
        "claude desktop",
      ]),
    ).toEqual(["claude-code", "claude-desktop"]);
  });

  it("collapses openai and codex duplicates", () => {
    expect(normalizePlatforms(["OpenAI", "Codex", "openai"])).toEqual([
      "codex",
    ]);
  });

  it("preserves raycast when mixed with unknowns", () => {
    expect(normalizePlatforms(["raycast", "unknown", "Raycast"])).toEqual([
      "raycast",
    ]);
  });
});

describe("per-canonical-id alias reachability", () => {
  it.each(PLATFORM_IDS)("has at least one alias mapping to %s", (id) => {
    const aliases = ALIAS_ENTRIES.filter(([, target]) => target === id);
    expect(aliases.length).toBeGreaterThan(0);
  });
});

describe("normalizePlatform display variants", () => {
  it.each([
    ["Claude Code", "claude-code"],
    ["Claude Desktop", "claude-desktop"],
    ["Cursor Rules", undefined],
    ["Generic Agents.md", "cli"],
    ["VSCode", "vscode"],
  ])("normalizes spaced label %s to %j", (input, expected) => {
    expect(normalizePlatform(input)).toBe(expected);
  });
});

describe("platform taxonomy constants drift guards", () => {
  it("keeps PLATFORM_IDS and PLATFORM_LABELS keys aligned", () => {
    expect(Object.keys(PLATFORM_LABELS).sort()).toEqual(
      [...PLATFORM_IDS].sort(),
    );
  });

  it("maps every alias target to a defined label", () => {
    for (const [, id] of ALIAS_ENTRIES) {
      expect(PLATFORM_LABELS[id]).toBeTruthy();
    }
  });
});

describe("repeated normalization stability", () => {
  it("returns the same canonical list when re-run on prior output", () => {
    const first = normalizePlatforms([
      "Claude",
      "Codex",
      "Cursor",
      "VS Code",
      "Gemini",
    ]);
    const second = normalizePlatforms(first);
    expect(second).toEqual(first);
  });
});

describe("alias key shape", () => {
  it.each(ALIAS_ENTRIES)("stores lowercase or phrase alias key %j", (alias) => {
    expect(alias).toBe(alias.trim().toLowerCase());
  });
});

describe("cli bucket aliases", () => {
  const cliAliases = ALIAS_ENTRIES.filter(([, id]) => id === "cli");
  it.each(cliAliases)("routes agents-family alias %j to cli", (alias) => {
    expect(normalizePlatform(alias)).toBe("cli");
  });
});

describe("codex bucket aliases", () => {
  const codexAliases = ALIAS_ENTRIES.filter(([, id]) => id === "codex");
  it.each(codexAliases)("routes codex-family alias %j to codex", (alias) => {
    expect(normalizePlatform(alias)).toBe("codex");
  });
});

describe("cursor and windsurf families", () => {
  it.each([
    ["cursor", "cursor"],
    ["cursor-rules", "cursor"],
    ["windsurf", "windsurf"],
    ["Windsurf", "windsurf"],
  ])("normalizes %s to %s", (input, expected) => {
    expect(normalizePlatform(input)).toBe(expected);
  });
});

describe("gemini and raycast identifiers", () => {
  it.each(["gemini", "Gemini", "GEMINI"])(
    "normalizes %s to gemini",
    (value) => {
      expect(normalizePlatform(value)).toBe("gemini");
    },
  );

  it.each(["raycast", "Raycast", "RAYCAST"])(
    "normalizes %s to raycast",
    (value) => {
      expect(normalizePlatform(value)).toBe("raycast");
    },
  );
});

describe("aider zed continue toolchain ids", () => {
  it.each([
    ["aider", "aider"],
    ["zed", "zed"],
    ["continue", "continue"],
  ])("normalizes %s to %s", (input, expected) => {
    expect(normalizePlatform(input)).toBe(expected);
  });
});

describe("normalizePlatforms mixed editor stacks", () => {
  it("dedupes cursor and cursor-rules in one submission", () => {
    expect(normalizePlatforms(["cursor", "cursor-rules", "Cursor"])).toEqual([
      "cursor",
    ]);
  });

  it("keeps distinct claude-code and claude-desktop entries", () => {
    expect(
      normalizePlatforms(["claude", "claude desktop", "claude-code"]),
    ).toEqual(["claude-code", "claude-desktop"]);
  });

  it("orders vscode before cli when both appear", () => {
    expect(normalizePlatforms(["vscode", "generic agents"])).toEqual([
      "vscode",
      "cli",
    ]);
  });
});

describe("submission frontmatter regression cases", () => {
  it.each([
    [
      ["Claude", "Codex"],
      ["claude-code", "codex"],
    ],
    [
      ["VS Code", "Cursor"],
      ["vscode", "cursor"],
    ],
    [
      ["openai", "agents"],
      ["codex", "cli"],
    ],
    [
      ["Raycast", "Aider", "Zed"],
      ["raycast", "aider", "zed"],
    ],
  ])("normalizes frontmatter %j to %j", (input, expected) => {
    expect(normalizePlatforms(input)).toEqual(expected);
  });
});

describe("platform label non-empty constraints", () => {
  it.each(PLATFORM_IDS)(
    "%s label has no leading or trailing whitespace",
    (id) => {
      const label = PLATFORM_LABELS[id];
      expect(label).toBe(label.trim());
      expect(label.length).toBeGreaterThan(1);
    },
  );
});

describe("alias collision safety", () => {
  it("never maps two alias keys to conflicting canonical families for claude", () => {
    const claudeFamily = ALIAS_ENTRIES.filter(([, id]) =>
      id.startsWith("claude"),
    );
    expect(
      claudeFamily.every(
        ([, id]) => id === "claude-code" || id === "claude-desktop",
      ),
    ).toBe(true);
  });
});

describe("empty and sparse platform lists", () => {
  it("handles single-item lists", () => {
    expect(normalizePlatforms(["Gemini"])).toEqual(["gemini"]);
  });

  it("handles two-item lists with one unknown", () => {
    expect(normalizePlatforms(["foo", "bar"])).toEqual([]);
    expect(normalizePlatforms(["foo", "Codex"])).toEqual(["codex"]);
  });
});

describe("single-value normalization parity", () => {
  it.each(ALIAS_ENTRIES)(
    "normalizePlatforms([alias]) matches normalizePlatform(alias) for %j",
    (alias, id) => {
      expect(normalizePlatforms([alias])).toEqual([id]);
      expect(normalizePlatform(alias)).toBe(id);
    },
  );
});

describe("platform id stability guarantees", () => {
  it("every PLATFORM_ID is lowercase kebab-case", () => {
    for (const id of PLATFORM_IDS) {
      expect(id).toBe(id.toLowerCase());
      expect(id).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/);
    }
  });

  it("every label maps back to a unique id", () => {
    const labels = PLATFORM_IDS.map((id) => PLATFORM_LABELS[id]);
    expect(new Set(labels).size).toBe(labels.length);
  });

  it("alias keys are lowercase after trim", () => {
    for (const [alias] of ALIAS_ENTRIES) {
      expect(alias).toBe(alias.trim().toLowerCase());
    }
  });
});

describe("normalizePlatforms batch edge cases", () => {
  it("preserves first occurrence when duplicates appear after unknowns", () => {
    expect(normalizePlatforms(["unknown", "Codex", "codex", "openai"])).toEqual(
      ["codex"],
    );
  });

  it("returns empty array for all-unknown batch", () => {
    expect(normalizePlatforms(["", "   ", "not-a-platform", "???"])).toEqual(
      [],
    );
  });

  it("handles mixed alias and canonical ids in one batch", () => {
    expect(
      normalizePlatforms(["VSCode", "vscode", "Visual Studio Code", "cursor"]),
    ).toEqual(["vscode", "cursor"]);
  });

  it("handles maximum alias coverage batch without reordering canonical first-seen", () => {
    const batch = ALIAS_ENTRIES.map(([alias]) => alias);
    const expected = [];
    const seen = new Set<string>();
    for (const [, id] of ALIAS_ENTRIES) {
      if (!seen.has(id)) {
        seen.add(id);
        expected.push(id);
      }
    }
    expect(normalizePlatforms(batch)).toEqual(expected);
  });
});

describe("normalizePlatform defensive inputs", () => {
  it.each([null, undefined, 0, false, true, {}, [], () => {}])(
    "returns undefined for non-string value %j",
    (value) => {
      expect(normalizePlatform(value as unknown as string)).toBeUndefined();
    },
  );

  it("returns undefined for numeric string that is not an alias", () => {
    expect(normalizePlatform("12345")).toBeUndefined();
  });

  it("treats tab and newline padding like whitespace", () => {
    expect(normalizePlatform("\tcodex\n")).toBe("codex");
    expect(normalizePlatform("\n  Gemini  \t")).toBe("gemini");
  });
});
