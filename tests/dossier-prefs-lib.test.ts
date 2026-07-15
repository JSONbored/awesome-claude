import { afterEach, describe, expect, it, beforeEach } from "vitest";

import {
  COPY_KEY,
  HARNESS_KEY_PREFIX,
  SCROLL_KEY_PREFIX,
  createDossierPrefsStorage,
  defaultLocalStorage,
  defaultSessionStorage,
  harnessStorageKey,
  isCopyVariant,
  parseScrollPosition,
  readPersistent,
  scrollStorageKey,
  writePersistent,
} from "../apps/web/src/lib/dossier-prefs-lib";

function makeMemoryStorage(): Storage {
  const map = new Map<string, string>();
  return {
    get length() {
      return map.size;
    },
    clear() {
      map.clear();
    },
    getItem(key: string) {
      return map.has(key) ? map.get(key)! : null;
    },
    key(index: number) {
      return [...map.keys()][index] ?? null;
    },
    removeItem(key: string) {
      map.delete(key);
    },
    setItem(key: string, value: string) {
      map.set(key, value);
    },
  };
}

describe("dossier-prefs-lib keys", () => {
  it("exports storage key constants", () => {
    expect(COPY_KEY).toBe("hc:dossier-copy-pref");
    expect(SCROLL_KEY_PREFIX).toBe("hc:dossier-scroll:");
    expect(HARNESS_KEY_PREFIX).toBe("hc:dossier-harness:");
  });
  it("scrollStorageKey agents/agents-slug-0", () => {
    expect(scrollStorageKey("agents", "agents-slug-0")).toBe(
      `${SCROLL_KEY_PREFIX}agents/agents-slug-0`,
    );
    expect(harnessStorageKey("agents", "agents-slug-0")).toBe(
      `${HARNESS_KEY_PREFIX}agents/agents-slug-0`,
    );
  });
  it("scrollStorageKey agents/agents-slug-1", () => {
    expect(scrollStorageKey("agents", "agents-slug-1")).toBe(
      `${SCROLL_KEY_PREFIX}agents/agents-slug-1`,
    );
    expect(harnessStorageKey("agents", "agents-slug-1")).toBe(
      `${HARNESS_KEY_PREFIX}agents/agents-slug-1`,
    );
  });
  it("scrollStorageKey agents/agents-slug-2", () => {
    expect(scrollStorageKey("agents", "agents-slug-2")).toBe(
      `${SCROLL_KEY_PREFIX}agents/agents-slug-2`,
    );
    expect(harnessStorageKey("agents", "agents-slug-2")).toBe(
      `${HARNESS_KEY_PREFIX}agents/agents-slug-2`,
    );
  });
  it("scrollStorageKey agents/agents-slug-3", () => {
    expect(scrollStorageKey("agents", "agents-slug-3")).toBe(
      `${SCROLL_KEY_PREFIX}agents/agents-slug-3`,
    );
    expect(harnessStorageKey("agents", "agents-slug-3")).toBe(
      `${HARNESS_KEY_PREFIX}agents/agents-slug-3`,
    );
  });
  it("scrollStorageKey agents/agents-slug-4", () => {
    expect(scrollStorageKey("agents", "agents-slug-4")).toBe(
      `${SCROLL_KEY_PREFIX}agents/agents-slug-4`,
    );
    expect(harnessStorageKey("agents", "agents-slug-4")).toBe(
      `${HARNESS_KEY_PREFIX}agents/agents-slug-4`,
    );
  });
  it("scrollStorageKey agents/agents-slug-5", () => {
    expect(scrollStorageKey("agents", "agents-slug-5")).toBe(
      `${SCROLL_KEY_PREFIX}agents/agents-slug-5`,
    );
    expect(harnessStorageKey("agents", "agents-slug-5")).toBe(
      `${HARNESS_KEY_PREFIX}agents/agents-slug-5`,
    );
  });
  it("scrollStorageKey agents/agents-slug-6", () => {
    expect(scrollStorageKey("agents", "agents-slug-6")).toBe(
      `${SCROLL_KEY_PREFIX}agents/agents-slug-6`,
    );
    expect(harnessStorageKey("agents", "agents-slug-6")).toBe(
      `${HARNESS_KEY_PREFIX}agents/agents-slug-6`,
    );
  });
  it("scrollStorageKey agents/agents-slug-7", () => {
    expect(scrollStorageKey("agents", "agents-slug-7")).toBe(
      `${SCROLL_KEY_PREFIX}agents/agents-slug-7`,
    );
    expect(harnessStorageKey("agents", "agents-slug-7")).toBe(
      `${HARNESS_KEY_PREFIX}agents/agents-slug-7`,
    );
  });
  it("scrollStorageKey agents/agents-slug-8", () => {
    expect(scrollStorageKey("agents", "agents-slug-8")).toBe(
      `${SCROLL_KEY_PREFIX}agents/agents-slug-8`,
    );
    expect(harnessStorageKey("agents", "agents-slug-8")).toBe(
      `${HARNESS_KEY_PREFIX}agents/agents-slug-8`,
    );
  });
  it("scrollStorageKey agents/agents-slug-9", () => {
    expect(scrollStorageKey("agents", "agents-slug-9")).toBe(
      `${SCROLL_KEY_PREFIX}agents/agents-slug-9`,
    );
    expect(harnessStorageKey("agents", "agents-slug-9")).toBe(
      `${HARNESS_KEY_PREFIX}agents/agents-slug-9`,
    );
  });
  it("scrollStorageKey mcp/mcp-slug-0", () => {
    expect(scrollStorageKey("mcp", "mcp-slug-0")).toBe(
      `${SCROLL_KEY_PREFIX}mcp/mcp-slug-0`,
    );
    expect(harnessStorageKey("mcp", "mcp-slug-0")).toBe(
      `${HARNESS_KEY_PREFIX}mcp/mcp-slug-0`,
    );
  });
  it("scrollStorageKey mcp/mcp-slug-1", () => {
    expect(scrollStorageKey("mcp", "mcp-slug-1")).toBe(
      `${SCROLL_KEY_PREFIX}mcp/mcp-slug-1`,
    );
    expect(harnessStorageKey("mcp", "mcp-slug-1")).toBe(
      `${HARNESS_KEY_PREFIX}mcp/mcp-slug-1`,
    );
  });
  it("scrollStorageKey mcp/mcp-slug-2", () => {
    expect(scrollStorageKey("mcp", "mcp-slug-2")).toBe(
      `${SCROLL_KEY_PREFIX}mcp/mcp-slug-2`,
    );
    expect(harnessStorageKey("mcp", "mcp-slug-2")).toBe(
      `${HARNESS_KEY_PREFIX}mcp/mcp-slug-2`,
    );
  });
  it("scrollStorageKey mcp/mcp-slug-3", () => {
    expect(scrollStorageKey("mcp", "mcp-slug-3")).toBe(
      `${SCROLL_KEY_PREFIX}mcp/mcp-slug-3`,
    );
    expect(harnessStorageKey("mcp", "mcp-slug-3")).toBe(
      `${HARNESS_KEY_PREFIX}mcp/mcp-slug-3`,
    );
  });
  it("scrollStorageKey mcp/mcp-slug-4", () => {
    expect(scrollStorageKey("mcp", "mcp-slug-4")).toBe(
      `${SCROLL_KEY_PREFIX}mcp/mcp-slug-4`,
    );
    expect(harnessStorageKey("mcp", "mcp-slug-4")).toBe(
      `${HARNESS_KEY_PREFIX}mcp/mcp-slug-4`,
    );
  });
  it("scrollStorageKey mcp/mcp-slug-5", () => {
    expect(scrollStorageKey("mcp", "mcp-slug-5")).toBe(
      `${SCROLL_KEY_PREFIX}mcp/mcp-slug-5`,
    );
    expect(harnessStorageKey("mcp", "mcp-slug-5")).toBe(
      `${HARNESS_KEY_PREFIX}mcp/mcp-slug-5`,
    );
  });
  it("scrollStorageKey mcp/mcp-slug-6", () => {
    expect(scrollStorageKey("mcp", "mcp-slug-6")).toBe(
      `${SCROLL_KEY_PREFIX}mcp/mcp-slug-6`,
    );
    expect(harnessStorageKey("mcp", "mcp-slug-6")).toBe(
      `${HARNESS_KEY_PREFIX}mcp/mcp-slug-6`,
    );
  });
  it("scrollStorageKey mcp/mcp-slug-7", () => {
    expect(scrollStorageKey("mcp", "mcp-slug-7")).toBe(
      `${SCROLL_KEY_PREFIX}mcp/mcp-slug-7`,
    );
    expect(harnessStorageKey("mcp", "mcp-slug-7")).toBe(
      `${HARNESS_KEY_PREFIX}mcp/mcp-slug-7`,
    );
  });
  it("scrollStorageKey mcp/mcp-slug-8", () => {
    expect(scrollStorageKey("mcp", "mcp-slug-8")).toBe(
      `${SCROLL_KEY_PREFIX}mcp/mcp-slug-8`,
    );
    expect(harnessStorageKey("mcp", "mcp-slug-8")).toBe(
      `${HARNESS_KEY_PREFIX}mcp/mcp-slug-8`,
    );
  });
  it("scrollStorageKey mcp/mcp-slug-9", () => {
    expect(scrollStorageKey("mcp", "mcp-slug-9")).toBe(
      `${SCROLL_KEY_PREFIX}mcp/mcp-slug-9`,
    );
    expect(harnessStorageKey("mcp", "mcp-slug-9")).toBe(
      `${HARNESS_KEY_PREFIX}mcp/mcp-slug-9`,
    );
  });
  it("scrollStorageKey tools/tools-slug-0", () => {
    expect(scrollStorageKey("tools", "tools-slug-0")).toBe(
      `${SCROLL_KEY_PREFIX}tools/tools-slug-0`,
    );
    expect(harnessStorageKey("tools", "tools-slug-0")).toBe(
      `${HARNESS_KEY_PREFIX}tools/tools-slug-0`,
    );
  });
  it("scrollStorageKey tools/tools-slug-1", () => {
    expect(scrollStorageKey("tools", "tools-slug-1")).toBe(
      `${SCROLL_KEY_PREFIX}tools/tools-slug-1`,
    );
    expect(harnessStorageKey("tools", "tools-slug-1")).toBe(
      `${HARNESS_KEY_PREFIX}tools/tools-slug-1`,
    );
  });
  it("scrollStorageKey tools/tools-slug-2", () => {
    expect(scrollStorageKey("tools", "tools-slug-2")).toBe(
      `${SCROLL_KEY_PREFIX}tools/tools-slug-2`,
    );
    expect(harnessStorageKey("tools", "tools-slug-2")).toBe(
      `${HARNESS_KEY_PREFIX}tools/tools-slug-2`,
    );
  });
  it("scrollStorageKey tools/tools-slug-3", () => {
    expect(scrollStorageKey("tools", "tools-slug-3")).toBe(
      `${SCROLL_KEY_PREFIX}tools/tools-slug-3`,
    );
    expect(harnessStorageKey("tools", "tools-slug-3")).toBe(
      `${HARNESS_KEY_PREFIX}tools/tools-slug-3`,
    );
  });
  it("scrollStorageKey tools/tools-slug-4", () => {
    expect(scrollStorageKey("tools", "tools-slug-4")).toBe(
      `${SCROLL_KEY_PREFIX}tools/tools-slug-4`,
    );
    expect(harnessStorageKey("tools", "tools-slug-4")).toBe(
      `${HARNESS_KEY_PREFIX}tools/tools-slug-4`,
    );
  });
  it("scrollStorageKey tools/tools-slug-5", () => {
    expect(scrollStorageKey("tools", "tools-slug-5")).toBe(
      `${SCROLL_KEY_PREFIX}tools/tools-slug-5`,
    );
    expect(harnessStorageKey("tools", "tools-slug-5")).toBe(
      `${HARNESS_KEY_PREFIX}tools/tools-slug-5`,
    );
  });
  it("scrollStorageKey tools/tools-slug-6", () => {
    expect(scrollStorageKey("tools", "tools-slug-6")).toBe(
      `${SCROLL_KEY_PREFIX}tools/tools-slug-6`,
    );
    expect(harnessStorageKey("tools", "tools-slug-6")).toBe(
      `${HARNESS_KEY_PREFIX}tools/tools-slug-6`,
    );
  });
  it("scrollStorageKey tools/tools-slug-7", () => {
    expect(scrollStorageKey("tools", "tools-slug-7")).toBe(
      `${SCROLL_KEY_PREFIX}tools/tools-slug-7`,
    );
    expect(harnessStorageKey("tools", "tools-slug-7")).toBe(
      `${HARNESS_KEY_PREFIX}tools/tools-slug-7`,
    );
  });
  it("scrollStorageKey tools/tools-slug-8", () => {
    expect(scrollStorageKey("tools", "tools-slug-8")).toBe(
      `${SCROLL_KEY_PREFIX}tools/tools-slug-8`,
    );
    expect(harnessStorageKey("tools", "tools-slug-8")).toBe(
      `${HARNESS_KEY_PREFIX}tools/tools-slug-8`,
    );
  });
  it("scrollStorageKey tools/tools-slug-9", () => {
    expect(scrollStorageKey("tools", "tools-slug-9")).toBe(
      `${SCROLL_KEY_PREFIX}tools/tools-slug-9`,
    );
    expect(harnessStorageKey("tools", "tools-slug-9")).toBe(
      `${HARNESS_KEY_PREFIX}tools/tools-slug-9`,
    );
  });
  it("scrollStorageKey skills/skills-slug-0", () => {
    expect(scrollStorageKey("skills", "skills-slug-0")).toBe(
      `${SCROLL_KEY_PREFIX}skills/skills-slug-0`,
    );
    expect(harnessStorageKey("skills", "skills-slug-0")).toBe(
      `${HARNESS_KEY_PREFIX}skills/skills-slug-0`,
    );
  });
  it("scrollStorageKey skills/skills-slug-1", () => {
    expect(scrollStorageKey("skills", "skills-slug-1")).toBe(
      `${SCROLL_KEY_PREFIX}skills/skills-slug-1`,
    );
    expect(harnessStorageKey("skills", "skills-slug-1")).toBe(
      `${HARNESS_KEY_PREFIX}skills/skills-slug-1`,
    );
  });
  it("scrollStorageKey skills/skills-slug-2", () => {
    expect(scrollStorageKey("skills", "skills-slug-2")).toBe(
      `${SCROLL_KEY_PREFIX}skills/skills-slug-2`,
    );
    expect(harnessStorageKey("skills", "skills-slug-2")).toBe(
      `${HARNESS_KEY_PREFIX}skills/skills-slug-2`,
    );
  });
  it("scrollStorageKey skills/skills-slug-3", () => {
    expect(scrollStorageKey("skills", "skills-slug-3")).toBe(
      `${SCROLL_KEY_PREFIX}skills/skills-slug-3`,
    );
    expect(harnessStorageKey("skills", "skills-slug-3")).toBe(
      `${HARNESS_KEY_PREFIX}skills/skills-slug-3`,
    );
  });
  it("scrollStorageKey skills/skills-slug-4", () => {
    expect(scrollStorageKey("skills", "skills-slug-4")).toBe(
      `${SCROLL_KEY_PREFIX}skills/skills-slug-4`,
    );
    expect(harnessStorageKey("skills", "skills-slug-4")).toBe(
      `${HARNESS_KEY_PREFIX}skills/skills-slug-4`,
    );
  });
  it("scrollStorageKey skills/skills-slug-5", () => {
    expect(scrollStorageKey("skills", "skills-slug-5")).toBe(
      `${SCROLL_KEY_PREFIX}skills/skills-slug-5`,
    );
    expect(harnessStorageKey("skills", "skills-slug-5")).toBe(
      `${HARNESS_KEY_PREFIX}skills/skills-slug-5`,
    );
  });
  it("scrollStorageKey skills/skills-slug-6", () => {
    expect(scrollStorageKey("skills", "skills-slug-6")).toBe(
      `${SCROLL_KEY_PREFIX}skills/skills-slug-6`,
    );
    expect(harnessStorageKey("skills", "skills-slug-6")).toBe(
      `${HARNESS_KEY_PREFIX}skills/skills-slug-6`,
    );
  });
  it("scrollStorageKey skills/skills-slug-7", () => {
    expect(scrollStorageKey("skills", "skills-slug-7")).toBe(
      `${SCROLL_KEY_PREFIX}skills/skills-slug-7`,
    );
    expect(harnessStorageKey("skills", "skills-slug-7")).toBe(
      `${HARNESS_KEY_PREFIX}skills/skills-slug-7`,
    );
  });
  it("scrollStorageKey skills/skills-slug-8", () => {
    expect(scrollStorageKey("skills", "skills-slug-8")).toBe(
      `${SCROLL_KEY_PREFIX}skills/skills-slug-8`,
    );
    expect(harnessStorageKey("skills", "skills-slug-8")).toBe(
      `${HARNESS_KEY_PREFIX}skills/skills-slug-8`,
    );
  });
  it("scrollStorageKey skills/skills-slug-9", () => {
    expect(scrollStorageKey("skills", "skills-slug-9")).toBe(
      `${SCROLL_KEY_PREFIX}skills/skills-slug-9`,
    );
    expect(harnessStorageKey("skills", "skills-slug-9")).toBe(
      `${HARNESS_KEY_PREFIX}skills/skills-slug-9`,
    );
  });
  it("scrollStorageKey rules/rules-slug-0", () => {
    expect(scrollStorageKey("rules", "rules-slug-0")).toBe(
      `${SCROLL_KEY_PREFIX}rules/rules-slug-0`,
    );
    expect(harnessStorageKey("rules", "rules-slug-0")).toBe(
      `${HARNESS_KEY_PREFIX}rules/rules-slug-0`,
    );
  });
  it("scrollStorageKey rules/rules-slug-1", () => {
    expect(scrollStorageKey("rules", "rules-slug-1")).toBe(
      `${SCROLL_KEY_PREFIX}rules/rules-slug-1`,
    );
    expect(harnessStorageKey("rules", "rules-slug-1")).toBe(
      `${HARNESS_KEY_PREFIX}rules/rules-slug-1`,
    );
  });
  it("scrollStorageKey rules/rules-slug-2", () => {
    expect(scrollStorageKey("rules", "rules-slug-2")).toBe(
      `${SCROLL_KEY_PREFIX}rules/rules-slug-2`,
    );
    expect(harnessStorageKey("rules", "rules-slug-2")).toBe(
      `${HARNESS_KEY_PREFIX}rules/rules-slug-2`,
    );
  });
  it("scrollStorageKey rules/rules-slug-3", () => {
    expect(scrollStorageKey("rules", "rules-slug-3")).toBe(
      `${SCROLL_KEY_PREFIX}rules/rules-slug-3`,
    );
    expect(harnessStorageKey("rules", "rules-slug-3")).toBe(
      `${HARNESS_KEY_PREFIX}rules/rules-slug-3`,
    );
  });
  it("scrollStorageKey rules/rules-slug-4", () => {
    expect(scrollStorageKey("rules", "rules-slug-4")).toBe(
      `${SCROLL_KEY_PREFIX}rules/rules-slug-4`,
    );
    expect(harnessStorageKey("rules", "rules-slug-4")).toBe(
      `${HARNESS_KEY_PREFIX}rules/rules-slug-4`,
    );
  });
  it("scrollStorageKey rules/rules-slug-5", () => {
    expect(scrollStorageKey("rules", "rules-slug-5")).toBe(
      `${SCROLL_KEY_PREFIX}rules/rules-slug-5`,
    );
    expect(harnessStorageKey("rules", "rules-slug-5")).toBe(
      `${HARNESS_KEY_PREFIX}rules/rules-slug-5`,
    );
  });
  it("scrollStorageKey rules/rules-slug-6", () => {
    expect(scrollStorageKey("rules", "rules-slug-6")).toBe(
      `${SCROLL_KEY_PREFIX}rules/rules-slug-6`,
    );
    expect(harnessStorageKey("rules", "rules-slug-6")).toBe(
      `${HARNESS_KEY_PREFIX}rules/rules-slug-6`,
    );
  });
  it("scrollStorageKey rules/rules-slug-7", () => {
    expect(scrollStorageKey("rules", "rules-slug-7")).toBe(
      `${SCROLL_KEY_PREFIX}rules/rules-slug-7`,
    );
    expect(harnessStorageKey("rules", "rules-slug-7")).toBe(
      `${HARNESS_KEY_PREFIX}rules/rules-slug-7`,
    );
  });
  it("scrollStorageKey rules/rules-slug-8", () => {
    expect(scrollStorageKey("rules", "rules-slug-8")).toBe(
      `${SCROLL_KEY_PREFIX}rules/rules-slug-8`,
    );
    expect(harnessStorageKey("rules", "rules-slug-8")).toBe(
      `${HARNESS_KEY_PREFIX}rules/rules-slug-8`,
    );
  });
  it("scrollStorageKey rules/rules-slug-9", () => {
    expect(scrollStorageKey("rules", "rules-slug-9")).toBe(
      `${SCROLL_KEY_PREFIX}rules/rules-slug-9`,
    );
    expect(harnessStorageKey("rules", "rules-slug-9")).toBe(
      `${HARNESS_KEY_PREFIX}rules/rules-slug-9`,
    );
  });
  it("scrollStorageKey commands/commands-slug-0", () => {
    expect(scrollStorageKey("commands", "commands-slug-0")).toBe(
      `${SCROLL_KEY_PREFIX}commands/commands-slug-0`,
    );
    expect(harnessStorageKey("commands", "commands-slug-0")).toBe(
      `${HARNESS_KEY_PREFIX}commands/commands-slug-0`,
    );
  });
  it("scrollStorageKey commands/commands-slug-1", () => {
    expect(scrollStorageKey("commands", "commands-slug-1")).toBe(
      `${SCROLL_KEY_PREFIX}commands/commands-slug-1`,
    );
    expect(harnessStorageKey("commands", "commands-slug-1")).toBe(
      `${HARNESS_KEY_PREFIX}commands/commands-slug-1`,
    );
  });
  it("scrollStorageKey commands/commands-slug-2", () => {
    expect(scrollStorageKey("commands", "commands-slug-2")).toBe(
      `${SCROLL_KEY_PREFIX}commands/commands-slug-2`,
    );
    expect(harnessStorageKey("commands", "commands-slug-2")).toBe(
      `${HARNESS_KEY_PREFIX}commands/commands-slug-2`,
    );
  });
  it("scrollStorageKey commands/commands-slug-3", () => {
    expect(scrollStorageKey("commands", "commands-slug-3")).toBe(
      `${SCROLL_KEY_PREFIX}commands/commands-slug-3`,
    );
    expect(harnessStorageKey("commands", "commands-slug-3")).toBe(
      `${HARNESS_KEY_PREFIX}commands/commands-slug-3`,
    );
  });
  it("scrollStorageKey commands/commands-slug-4", () => {
    expect(scrollStorageKey("commands", "commands-slug-4")).toBe(
      `${SCROLL_KEY_PREFIX}commands/commands-slug-4`,
    );
    expect(harnessStorageKey("commands", "commands-slug-4")).toBe(
      `${HARNESS_KEY_PREFIX}commands/commands-slug-4`,
    );
  });
  it("scrollStorageKey commands/commands-slug-5", () => {
    expect(scrollStorageKey("commands", "commands-slug-5")).toBe(
      `${SCROLL_KEY_PREFIX}commands/commands-slug-5`,
    );
    expect(harnessStorageKey("commands", "commands-slug-5")).toBe(
      `${HARNESS_KEY_PREFIX}commands/commands-slug-5`,
    );
  });
  it("scrollStorageKey commands/commands-slug-6", () => {
    expect(scrollStorageKey("commands", "commands-slug-6")).toBe(
      `${SCROLL_KEY_PREFIX}commands/commands-slug-6`,
    );
    expect(harnessStorageKey("commands", "commands-slug-6")).toBe(
      `${HARNESS_KEY_PREFIX}commands/commands-slug-6`,
    );
  });
  it("scrollStorageKey commands/commands-slug-7", () => {
    expect(scrollStorageKey("commands", "commands-slug-7")).toBe(
      `${SCROLL_KEY_PREFIX}commands/commands-slug-7`,
    );
    expect(harnessStorageKey("commands", "commands-slug-7")).toBe(
      `${HARNESS_KEY_PREFIX}commands/commands-slug-7`,
    );
  });
  it("scrollStorageKey commands/commands-slug-8", () => {
    expect(scrollStorageKey("commands", "commands-slug-8")).toBe(
      `${SCROLL_KEY_PREFIX}commands/commands-slug-8`,
    );
    expect(harnessStorageKey("commands", "commands-slug-8")).toBe(
      `${HARNESS_KEY_PREFIX}commands/commands-slug-8`,
    );
  });
  it("scrollStorageKey commands/commands-slug-9", () => {
    expect(scrollStorageKey("commands", "commands-slug-9")).toBe(
      `${SCROLL_KEY_PREFIX}commands/commands-slug-9`,
    );
    expect(harnessStorageKey("commands", "commands-slug-9")).toBe(
      `${HARNESS_KEY_PREFIX}commands/commands-slug-9`,
    );
  });
  it("scrollStorageKey hooks/hooks-slug-0", () => {
    expect(scrollStorageKey("hooks", "hooks-slug-0")).toBe(
      `${SCROLL_KEY_PREFIX}hooks/hooks-slug-0`,
    );
    expect(harnessStorageKey("hooks", "hooks-slug-0")).toBe(
      `${HARNESS_KEY_PREFIX}hooks/hooks-slug-0`,
    );
  });
  it("scrollStorageKey hooks/hooks-slug-1", () => {
    expect(scrollStorageKey("hooks", "hooks-slug-1")).toBe(
      `${SCROLL_KEY_PREFIX}hooks/hooks-slug-1`,
    );
    expect(harnessStorageKey("hooks", "hooks-slug-1")).toBe(
      `${HARNESS_KEY_PREFIX}hooks/hooks-slug-1`,
    );
  });
  it("scrollStorageKey hooks/hooks-slug-2", () => {
    expect(scrollStorageKey("hooks", "hooks-slug-2")).toBe(
      `${SCROLL_KEY_PREFIX}hooks/hooks-slug-2`,
    );
    expect(harnessStorageKey("hooks", "hooks-slug-2")).toBe(
      `${HARNESS_KEY_PREFIX}hooks/hooks-slug-2`,
    );
  });
  it("scrollStorageKey hooks/hooks-slug-3", () => {
    expect(scrollStorageKey("hooks", "hooks-slug-3")).toBe(
      `${SCROLL_KEY_PREFIX}hooks/hooks-slug-3`,
    );
    expect(harnessStorageKey("hooks", "hooks-slug-3")).toBe(
      `${HARNESS_KEY_PREFIX}hooks/hooks-slug-3`,
    );
  });
  it("scrollStorageKey hooks/hooks-slug-4", () => {
    expect(scrollStorageKey("hooks", "hooks-slug-4")).toBe(
      `${SCROLL_KEY_PREFIX}hooks/hooks-slug-4`,
    );
    expect(harnessStorageKey("hooks", "hooks-slug-4")).toBe(
      `${HARNESS_KEY_PREFIX}hooks/hooks-slug-4`,
    );
  });
  it("scrollStorageKey hooks/hooks-slug-5", () => {
    expect(scrollStorageKey("hooks", "hooks-slug-5")).toBe(
      `${SCROLL_KEY_PREFIX}hooks/hooks-slug-5`,
    );
    expect(harnessStorageKey("hooks", "hooks-slug-5")).toBe(
      `${HARNESS_KEY_PREFIX}hooks/hooks-slug-5`,
    );
  });
  it("scrollStorageKey hooks/hooks-slug-6", () => {
    expect(scrollStorageKey("hooks", "hooks-slug-6")).toBe(
      `${SCROLL_KEY_PREFIX}hooks/hooks-slug-6`,
    );
    expect(harnessStorageKey("hooks", "hooks-slug-6")).toBe(
      `${HARNESS_KEY_PREFIX}hooks/hooks-slug-6`,
    );
  });
  it("scrollStorageKey hooks/hooks-slug-7", () => {
    expect(scrollStorageKey("hooks", "hooks-slug-7")).toBe(
      `${SCROLL_KEY_PREFIX}hooks/hooks-slug-7`,
    );
    expect(harnessStorageKey("hooks", "hooks-slug-7")).toBe(
      `${HARNESS_KEY_PREFIX}hooks/hooks-slug-7`,
    );
  });
  it("scrollStorageKey hooks/hooks-slug-8", () => {
    expect(scrollStorageKey("hooks", "hooks-slug-8")).toBe(
      `${SCROLL_KEY_PREFIX}hooks/hooks-slug-8`,
    );
    expect(harnessStorageKey("hooks", "hooks-slug-8")).toBe(
      `${HARNESS_KEY_PREFIX}hooks/hooks-slug-8`,
    );
  });
  it("scrollStorageKey hooks/hooks-slug-9", () => {
    expect(scrollStorageKey("hooks", "hooks-slug-9")).toBe(
      `${SCROLL_KEY_PREFIX}hooks/hooks-slug-9`,
    );
    expect(harnessStorageKey("hooks", "hooks-slug-9")).toBe(
      `${HARNESS_KEY_PREFIX}hooks/hooks-slug-9`,
    );
  });
  it("scrollStorageKey guides/guides-slug-0", () => {
    expect(scrollStorageKey("guides", "guides-slug-0")).toBe(
      `${SCROLL_KEY_PREFIX}guides/guides-slug-0`,
    );
    expect(harnessStorageKey("guides", "guides-slug-0")).toBe(
      `${HARNESS_KEY_PREFIX}guides/guides-slug-0`,
    );
  });
  it("scrollStorageKey guides/guides-slug-1", () => {
    expect(scrollStorageKey("guides", "guides-slug-1")).toBe(
      `${SCROLL_KEY_PREFIX}guides/guides-slug-1`,
    );
    expect(harnessStorageKey("guides", "guides-slug-1")).toBe(
      `${HARNESS_KEY_PREFIX}guides/guides-slug-1`,
    );
  });
  it("scrollStorageKey guides/guides-slug-2", () => {
    expect(scrollStorageKey("guides", "guides-slug-2")).toBe(
      `${SCROLL_KEY_PREFIX}guides/guides-slug-2`,
    );
    expect(harnessStorageKey("guides", "guides-slug-2")).toBe(
      `${HARNESS_KEY_PREFIX}guides/guides-slug-2`,
    );
  });
  it("scrollStorageKey guides/guides-slug-3", () => {
    expect(scrollStorageKey("guides", "guides-slug-3")).toBe(
      `${SCROLL_KEY_PREFIX}guides/guides-slug-3`,
    );
    expect(harnessStorageKey("guides", "guides-slug-3")).toBe(
      `${HARNESS_KEY_PREFIX}guides/guides-slug-3`,
    );
  });
  it("scrollStorageKey guides/guides-slug-4", () => {
    expect(scrollStorageKey("guides", "guides-slug-4")).toBe(
      `${SCROLL_KEY_PREFIX}guides/guides-slug-4`,
    );
    expect(harnessStorageKey("guides", "guides-slug-4")).toBe(
      `${HARNESS_KEY_PREFIX}guides/guides-slug-4`,
    );
  });
  it("scrollStorageKey guides/guides-slug-5", () => {
    expect(scrollStorageKey("guides", "guides-slug-5")).toBe(
      `${SCROLL_KEY_PREFIX}guides/guides-slug-5`,
    );
    expect(harnessStorageKey("guides", "guides-slug-5")).toBe(
      `${HARNESS_KEY_PREFIX}guides/guides-slug-5`,
    );
  });
  it("scrollStorageKey guides/guides-slug-6", () => {
    expect(scrollStorageKey("guides", "guides-slug-6")).toBe(
      `${SCROLL_KEY_PREFIX}guides/guides-slug-6`,
    );
    expect(harnessStorageKey("guides", "guides-slug-6")).toBe(
      `${HARNESS_KEY_PREFIX}guides/guides-slug-6`,
    );
  });
  it("scrollStorageKey guides/guides-slug-7", () => {
    expect(scrollStorageKey("guides", "guides-slug-7")).toBe(
      `${SCROLL_KEY_PREFIX}guides/guides-slug-7`,
    );
    expect(harnessStorageKey("guides", "guides-slug-7")).toBe(
      `${HARNESS_KEY_PREFIX}guides/guides-slug-7`,
    );
  });
  it("scrollStorageKey guides/guides-slug-8", () => {
    expect(scrollStorageKey("guides", "guides-slug-8")).toBe(
      `${SCROLL_KEY_PREFIX}guides/guides-slug-8`,
    );
    expect(harnessStorageKey("guides", "guides-slug-8")).toBe(
      `${HARNESS_KEY_PREFIX}guides/guides-slug-8`,
    );
  });
  it("scrollStorageKey guides/guides-slug-9", () => {
    expect(scrollStorageKey("guides", "guides-slug-9")).toBe(
      `${SCROLL_KEY_PREFIX}guides/guides-slug-9`,
    );
    expect(harnessStorageKey("guides", "guides-slug-9")).toBe(
      `${HARNESS_KEY_PREFIX}guides/guides-slug-9`,
    );
  });
  it("scrollStorageKey collections/collections-slug-0", () => {
    expect(scrollStorageKey("collections", "collections-slug-0")).toBe(
      `${SCROLL_KEY_PREFIX}collections/collections-slug-0`,
    );
    expect(harnessStorageKey("collections", "collections-slug-0")).toBe(
      `${HARNESS_KEY_PREFIX}collections/collections-slug-0`,
    );
  });
  it("scrollStorageKey collections/collections-slug-1", () => {
    expect(scrollStorageKey("collections", "collections-slug-1")).toBe(
      `${SCROLL_KEY_PREFIX}collections/collections-slug-1`,
    );
    expect(harnessStorageKey("collections", "collections-slug-1")).toBe(
      `${HARNESS_KEY_PREFIX}collections/collections-slug-1`,
    );
  });
  it("scrollStorageKey collections/collections-slug-2", () => {
    expect(scrollStorageKey("collections", "collections-slug-2")).toBe(
      `${SCROLL_KEY_PREFIX}collections/collections-slug-2`,
    );
    expect(harnessStorageKey("collections", "collections-slug-2")).toBe(
      `${HARNESS_KEY_PREFIX}collections/collections-slug-2`,
    );
  });
  it("scrollStorageKey collections/collections-slug-3", () => {
    expect(scrollStorageKey("collections", "collections-slug-3")).toBe(
      `${SCROLL_KEY_PREFIX}collections/collections-slug-3`,
    );
    expect(harnessStorageKey("collections", "collections-slug-3")).toBe(
      `${HARNESS_KEY_PREFIX}collections/collections-slug-3`,
    );
  });
  it("scrollStorageKey collections/collections-slug-4", () => {
    expect(scrollStorageKey("collections", "collections-slug-4")).toBe(
      `${SCROLL_KEY_PREFIX}collections/collections-slug-4`,
    );
    expect(harnessStorageKey("collections", "collections-slug-4")).toBe(
      `${HARNESS_KEY_PREFIX}collections/collections-slug-4`,
    );
  });
  it("scrollStorageKey collections/collections-slug-5", () => {
    expect(scrollStorageKey("collections", "collections-slug-5")).toBe(
      `${SCROLL_KEY_PREFIX}collections/collections-slug-5`,
    );
    expect(harnessStorageKey("collections", "collections-slug-5")).toBe(
      `${HARNESS_KEY_PREFIX}collections/collections-slug-5`,
    );
  });
  it("scrollStorageKey collections/collections-slug-6", () => {
    expect(scrollStorageKey("collections", "collections-slug-6")).toBe(
      `${SCROLL_KEY_PREFIX}collections/collections-slug-6`,
    );
    expect(harnessStorageKey("collections", "collections-slug-6")).toBe(
      `${HARNESS_KEY_PREFIX}collections/collections-slug-6`,
    );
  });
  it("scrollStorageKey collections/collections-slug-7", () => {
    expect(scrollStorageKey("collections", "collections-slug-7")).toBe(
      `${SCROLL_KEY_PREFIX}collections/collections-slug-7`,
    );
    expect(harnessStorageKey("collections", "collections-slug-7")).toBe(
      `${HARNESS_KEY_PREFIX}collections/collections-slug-7`,
    );
  });
  it("scrollStorageKey collections/collections-slug-8", () => {
    expect(scrollStorageKey("collections", "collections-slug-8")).toBe(
      `${SCROLL_KEY_PREFIX}collections/collections-slug-8`,
    );
    expect(harnessStorageKey("collections", "collections-slug-8")).toBe(
      `${HARNESS_KEY_PREFIX}collections/collections-slug-8`,
    );
  });
  it("scrollStorageKey collections/collections-slug-9", () => {
    expect(scrollStorageKey("collections", "collections-slug-9")).toBe(
      `${SCROLL_KEY_PREFIX}collections/collections-slug-9`,
    );
    expect(harnessStorageKey("collections", "collections-slug-9")).toBe(
      `${HARNESS_KEY_PREFIX}collections/collections-slug-9`,
    );
  });
  it("scrollStorageKey statuslines/statuslines-slug-0", () => {
    expect(scrollStorageKey("statuslines", "statuslines-slug-0")).toBe(
      `${SCROLL_KEY_PREFIX}statuslines/statuslines-slug-0`,
    );
    expect(harnessStorageKey("statuslines", "statuslines-slug-0")).toBe(
      `${HARNESS_KEY_PREFIX}statuslines/statuslines-slug-0`,
    );
  });
  it("scrollStorageKey statuslines/statuslines-slug-1", () => {
    expect(scrollStorageKey("statuslines", "statuslines-slug-1")).toBe(
      `${SCROLL_KEY_PREFIX}statuslines/statuslines-slug-1`,
    );
    expect(harnessStorageKey("statuslines", "statuslines-slug-1")).toBe(
      `${HARNESS_KEY_PREFIX}statuslines/statuslines-slug-1`,
    );
  });
  it("scrollStorageKey statuslines/statuslines-slug-2", () => {
    expect(scrollStorageKey("statuslines", "statuslines-slug-2")).toBe(
      `${SCROLL_KEY_PREFIX}statuslines/statuslines-slug-2`,
    );
    expect(harnessStorageKey("statuslines", "statuslines-slug-2")).toBe(
      `${HARNESS_KEY_PREFIX}statuslines/statuslines-slug-2`,
    );
  });
  it("scrollStorageKey statuslines/statuslines-slug-3", () => {
    expect(scrollStorageKey("statuslines", "statuslines-slug-3")).toBe(
      `${SCROLL_KEY_PREFIX}statuslines/statuslines-slug-3`,
    );
    expect(harnessStorageKey("statuslines", "statuslines-slug-3")).toBe(
      `${HARNESS_KEY_PREFIX}statuslines/statuslines-slug-3`,
    );
  });
  it("scrollStorageKey statuslines/statuslines-slug-4", () => {
    expect(scrollStorageKey("statuslines", "statuslines-slug-4")).toBe(
      `${SCROLL_KEY_PREFIX}statuslines/statuslines-slug-4`,
    );
    expect(harnessStorageKey("statuslines", "statuslines-slug-4")).toBe(
      `${HARNESS_KEY_PREFIX}statuslines/statuslines-slug-4`,
    );
  });
  it("scrollStorageKey statuslines/statuslines-slug-5", () => {
    expect(scrollStorageKey("statuslines", "statuslines-slug-5")).toBe(
      `${SCROLL_KEY_PREFIX}statuslines/statuslines-slug-5`,
    );
    expect(harnessStorageKey("statuslines", "statuslines-slug-5")).toBe(
      `${HARNESS_KEY_PREFIX}statuslines/statuslines-slug-5`,
    );
  });
  it("scrollStorageKey statuslines/statuslines-slug-6", () => {
    expect(scrollStorageKey("statuslines", "statuslines-slug-6")).toBe(
      `${SCROLL_KEY_PREFIX}statuslines/statuslines-slug-6`,
    );
    expect(harnessStorageKey("statuslines", "statuslines-slug-6")).toBe(
      `${HARNESS_KEY_PREFIX}statuslines/statuslines-slug-6`,
    );
  });
  it("scrollStorageKey statuslines/statuslines-slug-7", () => {
    expect(scrollStorageKey("statuslines", "statuslines-slug-7")).toBe(
      `${SCROLL_KEY_PREFIX}statuslines/statuslines-slug-7`,
    );
    expect(harnessStorageKey("statuslines", "statuslines-slug-7")).toBe(
      `${HARNESS_KEY_PREFIX}statuslines/statuslines-slug-7`,
    );
  });
  it("scrollStorageKey statuslines/statuslines-slug-8", () => {
    expect(scrollStorageKey("statuslines", "statuslines-slug-8")).toBe(
      `${SCROLL_KEY_PREFIX}statuslines/statuslines-slug-8`,
    );
    expect(harnessStorageKey("statuslines", "statuslines-slug-8")).toBe(
      `${HARNESS_KEY_PREFIX}statuslines/statuslines-slug-8`,
    );
  });
  it("scrollStorageKey statuslines/statuslines-slug-9", () => {
    expect(scrollStorageKey("statuslines", "statuslines-slug-9")).toBe(
      `${SCROLL_KEY_PREFIX}statuslines/statuslines-slug-9`,
    );
    expect(harnessStorageKey("statuslines", "statuslines-slug-9")).toBe(
      `${HARNESS_KEY_PREFIX}statuslines/statuslines-slug-9`,
    );
  });
});

describe("dossier-prefs-lib isCopyVariant", () => {
  it("accepts install, config, full", () => {
    expect(isCopyVariant("install")).toBe(true);
    expect(isCopyVariant("config")).toBe(true);
    expect(isCopyVariant("full")).toBe(true);
  });
  it("isCopyVariant rejects invalid 0", () => {
    expect(isCopyVariant("")).toBe(false);
  });
  it("isCopyVariant rejects invalid 1", () => {
    expect(isCopyVariant("other")).toBe(false);
  });
  it("isCopyVariant rejects invalid 2", () => {
    expect(isCopyVariant("INSTALL")).toBe(false);
  });
  it("isCopyVariant rejects invalid 3", () => {
    expect(isCopyVariant(null)).toBe(false);
  });
  it("isCopyVariant rejects invalid 4", () => {
    expect(isCopyVariant(undefined)).toBe(false);
  });
  it("isCopyVariant rejects invalid 5", () => {
    expect(isCopyVariant(1)).toBe(false);
  });
  it("isCopyVariant rejects invalid 6", () => {
    expect(isCopyVariant({})).toBe(false);
  });
  it("isCopyVariant rejects invalid 7", () => {
    expect(isCopyVariant([])).toBe(false);
  });
  it("isCopyVariant matrix 0", () => {
    const variants = ["install", "config", "full"] as const;
    expect(isCopyVariant(variants[0])).toBe(true);
    expect(isCopyVariant("invalid-0")).toBe(false);
  });
  it("isCopyVariant matrix 1", () => {
    const variants = ["install", "config", "full"] as const;
    expect(isCopyVariant(variants[1])).toBe(true);
    expect(isCopyVariant("invalid-1")).toBe(false);
  });
  it("isCopyVariant matrix 2", () => {
    const variants = ["install", "config", "full"] as const;
    expect(isCopyVariant(variants[2])).toBe(true);
    expect(isCopyVariant("invalid-2")).toBe(false);
  });
  it("isCopyVariant matrix 3", () => {
    const variants = ["install", "config", "full"] as const;
    expect(isCopyVariant(variants[0])).toBe(true);
    expect(isCopyVariant("invalid-3")).toBe(false);
  });
  it("isCopyVariant matrix 4", () => {
    const variants = ["install", "config", "full"] as const;
    expect(isCopyVariant(variants[1])).toBe(true);
    expect(isCopyVariant("invalid-4")).toBe(false);
  });
  it("isCopyVariant matrix 5", () => {
    const variants = ["install", "config", "full"] as const;
    expect(isCopyVariant(variants[2])).toBe(true);
    expect(isCopyVariant("invalid-5")).toBe(false);
  });
  it("isCopyVariant matrix 6", () => {
    const variants = ["install", "config", "full"] as const;
    expect(isCopyVariant(variants[0])).toBe(true);
    expect(isCopyVariant("invalid-6")).toBe(false);
  });
  it("isCopyVariant matrix 7", () => {
    const variants = ["install", "config", "full"] as const;
    expect(isCopyVariant(variants[1])).toBe(true);
    expect(isCopyVariant("invalid-7")).toBe(false);
  });
  it("isCopyVariant matrix 8", () => {
    const variants = ["install", "config", "full"] as const;
    expect(isCopyVariant(variants[2])).toBe(true);
    expect(isCopyVariant("invalid-8")).toBe(false);
  });
  it("isCopyVariant matrix 9", () => {
    const variants = ["install", "config", "full"] as const;
    expect(isCopyVariant(variants[0])).toBe(true);
    expect(isCopyVariant("invalid-9")).toBe(false);
  });
  it("isCopyVariant matrix 10", () => {
    const variants = ["install", "config", "full"] as const;
    expect(isCopyVariant(variants[1])).toBe(true);
    expect(isCopyVariant("invalid-10")).toBe(false);
  });
  it("isCopyVariant matrix 11", () => {
    const variants = ["install", "config", "full"] as const;
    expect(isCopyVariant(variants[2])).toBe(true);
    expect(isCopyVariant("invalid-11")).toBe(false);
  });
  it("isCopyVariant matrix 12", () => {
    const variants = ["install", "config", "full"] as const;
    expect(isCopyVariant(variants[0])).toBe(true);
    expect(isCopyVariant("invalid-12")).toBe(false);
  });
  it("isCopyVariant matrix 13", () => {
    const variants = ["install", "config", "full"] as const;
    expect(isCopyVariant(variants[1])).toBe(true);
    expect(isCopyVariant("invalid-13")).toBe(false);
  });
  it("isCopyVariant matrix 14", () => {
    const variants = ["install", "config", "full"] as const;
    expect(isCopyVariant(variants[2])).toBe(true);
    expect(isCopyVariant("invalid-14")).toBe(false);
  });
  it("isCopyVariant matrix 15", () => {
    const variants = ["install", "config", "full"] as const;
    expect(isCopyVariant(variants[0])).toBe(true);
    expect(isCopyVariant("invalid-15")).toBe(false);
  });
  it("isCopyVariant matrix 16", () => {
    const variants = ["install", "config", "full"] as const;
    expect(isCopyVariant(variants[1])).toBe(true);
    expect(isCopyVariant("invalid-16")).toBe(false);
  });
  it("isCopyVariant matrix 17", () => {
    const variants = ["install", "config", "full"] as const;
    expect(isCopyVariant(variants[2])).toBe(true);
    expect(isCopyVariant("invalid-17")).toBe(false);
  });
  it("isCopyVariant matrix 18", () => {
    const variants = ["install", "config", "full"] as const;
    expect(isCopyVariant(variants[0])).toBe(true);
    expect(isCopyVariant("invalid-18")).toBe(false);
  });
  it("isCopyVariant matrix 19", () => {
    const variants = ["install", "config", "full"] as const;
    expect(isCopyVariant(variants[1])).toBe(true);
    expect(isCopyVariant("invalid-19")).toBe(false);
  });
  it("isCopyVariant matrix 20", () => {
    const variants = ["install", "config", "full"] as const;
    expect(isCopyVariant(variants[2])).toBe(true);
    expect(isCopyVariant("invalid-20")).toBe(false);
  });
  it("isCopyVariant matrix 21", () => {
    const variants = ["install", "config", "full"] as const;
    expect(isCopyVariant(variants[0])).toBe(true);
    expect(isCopyVariant("invalid-21")).toBe(false);
  });
  it("isCopyVariant matrix 22", () => {
    const variants = ["install", "config", "full"] as const;
    expect(isCopyVariant(variants[1])).toBe(true);
    expect(isCopyVariant("invalid-22")).toBe(false);
  });
  it("isCopyVariant matrix 23", () => {
    const variants = ["install", "config", "full"] as const;
    expect(isCopyVariant(variants[2])).toBe(true);
    expect(isCopyVariant("invalid-23")).toBe(false);
  });
  it("isCopyVariant matrix 24", () => {
    const variants = ["install", "config", "full"] as const;
    expect(isCopyVariant(variants[0])).toBe(true);
    expect(isCopyVariant("invalid-24")).toBe(false);
  });
  it("isCopyVariant matrix 25", () => {
    const variants = ["install", "config", "full"] as const;
    expect(isCopyVariant(variants[1])).toBe(true);
    expect(isCopyVariant("invalid-25")).toBe(false);
  });
  it("isCopyVariant matrix 26", () => {
    const variants = ["install", "config", "full"] as const;
    expect(isCopyVariant(variants[2])).toBe(true);
    expect(isCopyVariant("invalid-26")).toBe(false);
  });
  it("isCopyVariant matrix 27", () => {
    const variants = ["install", "config", "full"] as const;
    expect(isCopyVariant(variants[0])).toBe(true);
    expect(isCopyVariant("invalid-27")).toBe(false);
  });
  it("isCopyVariant matrix 28", () => {
    const variants = ["install", "config", "full"] as const;
    expect(isCopyVariant(variants[1])).toBe(true);
    expect(isCopyVariant("invalid-28")).toBe(false);
  });
  it("isCopyVariant matrix 29", () => {
    const variants = ["install", "config", "full"] as const;
    expect(isCopyVariant(variants[2])).toBe(true);
    expect(isCopyVariant("invalid-29")).toBe(false);
  });
  it("isCopyVariant matrix 30", () => {
    const variants = ["install", "config", "full"] as const;
    expect(isCopyVariant(variants[0])).toBe(true);
    expect(isCopyVariant("invalid-30")).toBe(false);
  });
  it("isCopyVariant matrix 31", () => {
    const variants = ["install", "config", "full"] as const;
    expect(isCopyVariant(variants[1])).toBe(true);
    expect(isCopyVariant("invalid-31")).toBe(false);
  });
  it("isCopyVariant matrix 32", () => {
    const variants = ["install", "config", "full"] as const;
    expect(isCopyVariant(variants[2])).toBe(true);
    expect(isCopyVariant("invalid-32")).toBe(false);
  });
  it("isCopyVariant matrix 33", () => {
    const variants = ["install", "config", "full"] as const;
    expect(isCopyVariant(variants[0])).toBe(true);
    expect(isCopyVariant("invalid-33")).toBe(false);
  });
  it("isCopyVariant matrix 34", () => {
    const variants = ["install", "config", "full"] as const;
    expect(isCopyVariant(variants[1])).toBe(true);
    expect(isCopyVariant("invalid-34")).toBe(false);
  });
  it("isCopyVariant matrix 35", () => {
    const variants = ["install", "config", "full"] as const;
    expect(isCopyVariant(variants[2])).toBe(true);
    expect(isCopyVariant("invalid-35")).toBe(false);
  });
  it("isCopyVariant matrix 36", () => {
    const variants = ["install", "config", "full"] as const;
    expect(isCopyVariant(variants[0])).toBe(true);
    expect(isCopyVariant("invalid-36")).toBe(false);
  });
  it("isCopyVariant matrix 37", () => {
    const variants = ["install", "config", "full"] as const;
    expect(isCopyVariant(variants[1])).toBe(true);
    expect(isCopyVariant("invalid-37")).toBe(false);
  });
  it("isCopyVariant matrix 38", () => {
    const variants = ["install", "config", "full"] as const;
    expect(isCopyVariant(variants[2])).toBe(true);
    expect(isCopyVariant("invalid-38")).toBe(false);
  });
  it("isCopyVariant matrix 39", () => {
    const variants = ["install", "config", "full"] as const;
    expect(isCopyVariant(variants[0])).toBe(true);
    expect(isCopyVariant("invalid-39")).toBe(false);
  });
  it("isCopyVariant matrix 40", () => {
    const variants = ["install", "config", "full"] as const;
    expect(isCopyVariant(variants[1])).toBe(true);
    expect(isCopyVariant("invalid-40")).toBe(false);
  });
  it("isCopyVariant matrix 41", () => {
    const variants = ["install", "config", "full"] as const;
    expect(isCopyVariant(variants[2])).toBe(true);
    expect(isCopyVariant("invalid-41")).toBe(false);
  });
  it("isCopyVariant matrix 42", () => {
    const variants = ["install", "config", "full"] as const;
    expect(isCopyVariant(variants[0])).toBe(true);
    expect(isCopyVariant("invalid-42")).toBe(false);
  });
  it("isCopyVariant matrix 43", () => {
    const variants = ["install", "config", "full"] as const;
    expect(isCopyVariant(variants[1])).toBe(true);
    expect(isCopyVariant("invalid-43")).toBe(false);
  });
  it("isCopyVariant matrix 44", () => {
    const variants = ["install", "config", "full"] as const;
    expect(isCopyVariant(variants[2])).toBe(true);
    expect(isCopyVariant("invalid-44")).toBe(false);
  });
  it("isCopyVariant matrix 45", () => {
    const variants = ["install", "config", "full"] as const;
    expect(isCopyVariant(variants[0])).toBe(true);
    expect(isCopyVariant("invalid-45")).toBe(false);
  });
  it("isCopyVariant matrix 46", () => {
    const variants = ["install", "config", "full"] as const;
    expect(isCopyVariant(variants[1])).toBe(true);
    expect(isCopyVariant("invalid-46")).toBe(false);
  });
  it("isCopyVariant matrix 47", () => {
    const variants = ["install", "config", "full"] as const;
    expect(isCopyVariant(variants[2])).toBe(true);
    expect(isCopyVariant("invalid-47")).toBe(false);
  });
  it("isCopyVariant matrix 48", () => {
    const variants = ["install", "config", "full"] as const;
    expect(isCopyVariant(variants[0])).toBe(true);
    expect(isCopyVariant("invalid-48")).toBe(false);
  });
  it("isCopyVariant matrix 49", () => {
    const variants = ["install", "config", "full"] as const;
    expect(isCopyVariant(variants[1])).toBe(true);
    expect(isCopyVariant("invalid-49")).toBe(false);
  });
  it("isCopyVariant matrix 50", () => {
    const variants = ["install", "config", "full"] as const;
    expect(isCopyVariant(variants[2])).toBe(true);
    expect(isCopyVariant("invalid-50")).toBe(false);
  });
  it("isCopyVariant matrix 51", () => {
    const variants = ["install", "config", "full"] as const;
    expect(isCopyVariant(variants[0])).toBe(true);
    expect(isCopyVariant("invalid-51")).toBe(false);
  });
  it("isCopyVariant matrix 52", () => {
    const variants = ["install", "config", "full"] as const;
    expect(isCopyVariant(variants[1])).toBe(true);
    expect(isCopyVariant("invalid-52")).toBe(false);
  });
  it("isCopyVariant matrix 53", () => {
    const variants = ["install", "config", "full"] as const;
    expect(isCopyVariant(variants[2])).toBe(true);
    expect(isCopyVariant("invalid-53")).toBe(false);
  });
  it("isCopyVariant matrix 54", () => {
    const variants = ["install", "config", "full"] as const;
    expect(isCopyVariant(variants[0])).toBe(true);
    expect(isCopyVariant("invalid-54")).toBe(false);
  });
  it("isCopyVariant matrix 55", () => {
    const variants = ["install", "config", "full"] as const;
    expect(isCopyVariant(variants[1])).toBe(true);
    expect(isCopyVariant("invalid-55")).toBe(false);
  });
  it("isCopyVariant matrix 56", () => {
    const variants = ["install", "config", "full"] as const;
    expect(isCopyVariant(variants[2])).toBe(true);
    expect(isCopyVariant("invalid-56")).toBe(false);
  });
  it("isCopyVariant matrix 57", () => {
    const variants = ["install", "config", "full"] as const;
    expect(isCopyVariant(variants[0])).toBe(true);
    expect(isCopyVariant("invalid-57")).toBe(false);
  });
  it("isCopyVariant matrix 58", () => {
    const variants = ["install", "config", "full"] as const;
    expect(isCopyVariant(variants[1])).toBe(true);
    expect(isCopyVariant("invalid-58")).toBe(false);
  });
  it("isCopyVariant matrix 59", () => {
    const variants = ["install", "config", "full"] as const;
    expect(isCopyVariant(variants[2])).toBe(true);
    expect(isCopyVariant("invalid-59")).toBe(false);
  });
  it("isCopyVariant matrix 60", () => {
    const variants = ["install", "config", "full"] as const;
    expect(isCopyVariant(variants[0])).toBe(true);
    expect(isCopyVariant("invalid-60")).toBe(false);
  });
  it("isCopyVariant matrix 61", () => {
    const variants = ["install", "config", "full"] as const;
    expect(isCopyVariant(variants[1])).toBe(true);
    expect(isCopyVariant("invalid-61")).toBe(false);
  });
  it("isCopyVariant matrix 62", () => {
    const variants = ["install", "config", "full"] as const;
    expect(isCopyVariant(variants[2])).toBe(true);
    expect(isCopyVariant("invalid-62")).toBe(false);
  });
  it("isCopyVariant matrix 63", () => {
    const variants = ["install", "config", "full"] as const;
    expect(isCopyVariant(variants[0])).toBe(true);
    expect(isCopyVariant("invalid-63")).toBe(false);
  });
  it("isCopyVariant matrix 64", () => {
    const variants = ["install", "config", "full"] as const;
    expect(isCopyVariant(variants[1])).toBe(true);
    expect(isCopyVariant("invalid-64")).toBe(false);
  });
  it("isCopyVariant matrix 65", () => {
    const variants = ["install", "config", "full"] as const;
    expect(isCopyVariant(variants[2])).toBe(true);
    expect(isCopyVariant("invalid-65")).toBe(false);
  });
  it("isCopyVariant matrix 66", () => {
    const variants = ["install", "config", "full"] as const;
    expect(isCopyVariant(variants[0])).toBe(true);
    expect(isCopyVariant("invalid-66")).toBe(false);
  });
  it("isCopyVariant matrix 67", () => {
    const variants = ["install", "config", "full"] as const;
    expect(isCopyVariant(variants[1])).toBe(true);
    expect(isCopyVariant("invalid-67")).toBe(false);
  });
  it("isCopyVariant matrix 68", () => {
    const variants = ["install", "config", "full"] as const;
    expect(isCopyVariant(variants[2])).toBe(true);
    expect(isCopyVariant("invalid-68")).toBe(false);
  });
  it("isCopyVariant matrix 69", () => {
    const variants = ["install", "config", "full"] as const;
    expect(isCopyVariant(variants[0])).toBe(true);
    expect(isCopyVariant("invalid-69")).toBe(false);
  });
  it("isCopyVariant matrix 70", () => {
    const variants = ["install", "config", "full"] as const;
    expect(isCopyVariant(variants[1])).toBe(true);
    expect(isCopyVariant("invalid-70")).toBe(false);
  });
  it("isCopyVariant matrix 71", () => {
    const variants = ["install", "config", "full"] as const;
    expect(isCopyVariant(variants[2])).toBe(true);
    expect(isCopyVariant("invalid-71")).toBe(false);
  });
  it("isCopyVariant matrix 72", () => {
    const variants = ["install", "config", "full"] as const;
    expect(isCopyVariant(variants[0])).toBe(true);
    expect(isCopyVariant("invalid-72")).toBe(false);
  });
  it("isCopyVariant matrix 73", () => {
    const variants = ["install", "config", "full"] as const;
    expect(isCopyVariant(variants[1])).toBe(true);
    expect(isCopyVariant("invalid-73")).toBe(false);
  });
  it("isCopyVariant matrix 74", () => {
    const variants = ["install", "config", "full"] as const;
    expect(isCopyVariant(variants[2])).toBe(true);
    expect(isCopyVariant("invalid-74")).toBe(false);
  });
  it("isCopyVariant matrix 75", () => {
    const variants = ["install", "config", "full"] as const;
    expect(isCopyVariant(variants[0])).toBe(true);
    expect(isCopyVariant("invalid-75")).toBe(false);
  });
  it("isCopyVariant matrix 76", () => {
    const variants = ["install", "config", "full"] as const;
    expect(isCopyVariant(variants[1])).toBe(true);
    expect(isCopyVariant("invalid-76")).toBe(false);
  });
  it("isCopyVariant matrix 77", () => {
    const variants = ["install", "config", "full"] as const;
    expect(isCopyVariant(variants[2])).toBe(true);
    expect(isCopyVariant("invalid-77")).toBe(false);
  });
  it("isCopyVariant matrix 78", () => {
    const variants = ["install", "config", "full"] as const;
    expect(isCopyVariant(variants[0])).toBe(true);
    expect(isCopyVariant("invalid-78")).toBe(false);
  });
  it("isCopyVariant matrix 79", () => {
    const variants = ["install", "config", "full"] as const;
    expect(isCopyVariant(variants[1])).toBe(true);
    expect(isCopyVariant("invalid-79")).toBe(false);
  });
});

describe("dossier-prefs-lib parseScrollPosition", () => {
  it("parses positive finite numbers", () => {
    expect(parseScrollPosition("120")).toBe(120);
    expect(parseScrollPosition("0")).toBeNull();
    expect(parseScrollPosition("-5")).toBeNull();
    expect(parseScrollPosition("abc")).toBeNull();
  });
  it("parseScrollPosition value -10", () => {
    expect(parseScrollPosition("-10")).toBe(null);
  });
  it("parseScrollPosition value -9", () => {
    expect(parseScrollPosition("-9")).toBe(null);
  });
  it("parseScrollPosition value -8", () => {
    expect(parseScrollPosition("-8")).toBe(null);
  });
  it("parseScrollPosition value -7", () => {
    expect(parseScrollPosition("-7")).toBe(null);
  });
  it("parseScrollPosition value -6", () => {
    expect(parseScrollPosition("-6")).toBe(null);
  });
  it("parseScrollPosition value -5", () => {
    expect(parseScrollPosition("-5")).toBe(null);
  });
  it("parseScrollPosition value -4", () => {
    expect(parseScrollPosition("-4")).toBe(null);
  });
  it("parseScrollPosition value -3", () => {
    expect(parseScrollPosition("-3")).toBe(null);
  });
  it("parseScrollPosition value -2", () => {
    expect(parseScrollPosition("-2")).toBe(null);
  });
  it("parseScrollPosition value -1", () => {
    expect(parseScrollPosition("-1")).toBe(null);
  });
  it("parseScrollPosition value 0", () => {
    expect(parseScrollPosition("0")).toBe(null);
  });
  it("parseScrollPosition value 1", () => {
    expect(parseScrollPosition("1")).toBe(1);
  });
  it("parseScrollPosition value 2", () => {
    expect(parseScrollPosition("2")).toBe(2);
  });
  it("parseScrollPosition value 3", () => {
    expect(parseScrollPosition("3")).toBe(3);
  });
  it("parseScrollPosition value 4", () => {
    expect(parseScrollPosition("4")).toBe(4);
  });
  it("parseScrollPosition value 5", () => {
    expect(parseScrollPosition("5")).toBe(5);
  });
  it("parseScrollPosition value 6", () => {
    expect(parseScrollPosition("6")).toBe(6);
  });
  it("parseScrollPosition value 7", () => {
    expect(parseScrollPosition("7")).toBe(7);
  });
  it("parseScrollPosition value 8", () => {
    expect(parseScrollPosition("8")).toBe(8);
  });
  it("parseScrollPosition value 9", () => {
    expect(parseScrollPosition("9")).toBe(9);
  });
  it("parseScrollPosition value 10", () => {
    expect(parseScrollPosition("10")).toBe(10);
  });
  it("parseScrollPosition value 11", () => {
    expect(parseScrollPosition("11")).toBe(11);
  });
  it("parseScrollPosition value 12", () => {
    expect(parseScrollPosition("12")).toBe(12);
  });
  it("parseScrollPosition value 13", () => {
    expect(parseScrollPosition("13")).toBe(13);
  });
  it("parseScrollPosition value 14", () => {
    expect(parseScrollPosition("14")).toBe(14);
  });
  it("parseScrollPosition value 15", () => {
    expect(parseScrollPosition("15")).toBe(15);
  });
  it("parseScrollPosition value 16", () => {
    expect(parseScrollPosition("16")).toBe(16);
  });
  it("parseScrollPosition value 17", () => {
    expect(parseScrollPosition("17")).toBe(17);
  });
  it("parseScrollPosition value 18", () => {
    expect(parseScrollPosition("18")).toBe(18);
  });
  it("parseScrollPosition value 19", () => {
    expect(parseScrollPosition("19")).toBe(19);
  });
  it("parseScrollPosition value 20", () => {
    expect(parseScrollPosition("20")).toBe(20);
  });
  it("parseScrollPosition value 21", () => {
    expect(parseScrollPosition("21")).toBe(21);
  });
  it("parseScrollPosition value 22", () => {
    expect(parseScrollPosition("22")).toBe(22);
  });
  it("parseScrollPosition value 23", () => {
    expect(parseScrollPosition("23")).toBe(23);
  });
  it("parseScrollPosition value 24", () => {
    expect(parseScrollPosition("24")).toBe(24);
  });
  it("parseScrollPosition value 25", () => {
    expect(parseScrollPosition("25")).toBe(25);
  });
  it("parseScrollPosition value 26", () => {
    expect(parseScrollPosition("26")).toBe(26);
  });
  it("parseScrollPosition value 27", () => {
    expect(parseScrollPosition("27")).toBe(27);
  });
  it("parseScrollPosition value 28", () => {
    expect(parseScrollPosition("28")).toBe(28);
  });
  it("parseScrollPosition value 29", () => {
    expect(parseScrollPosition("29")).toBe(29);
  });
  it("parseScrollPosition value 30", () => {
    expect(parseScrollPosition("30")).toBe(30);
  });
  it("parseScrollPosition value 31", () => {
    expect(parseScrollPosition("31")).toBe(31);
  });
  it("parseScrollPosition value 32", () => {
    expect(parseScrollPosition("32")).toBe(32);
  });
  it("parseScrollPosition value 33", () => {
    expect(parseScrollPosition("33")).toBe(33);
  });
  it("parseScrollPosition value 34", () => {
    expect(parseScrollPosition("34")).toBe(34);
  });
  it("parseScrollPosition value 35", () => {
    expect(parseScrollPosition("35")).toBe(35);
  });
  it("parseScrollPosition value 36", () => {
    expect(parseScrollPosition("36")).toBe(36);
  });
  it("parseScrollPosition value 37", () => {
    expect(parseScrollPosition("37")).toBe(37);
  });
  it("parseScrollPosition value 38", () => {
    expect(parseScrollPosition("38")).toBe(38);
  });
  it("parseScrollPosition value 39", () => {
    expect(parseScrollPosition("39")).toBe(39);
  });
  it("parseScrollPosition value 40", () => {
    expect(parseScrollPosition("40")).toBe(40);
  });
  it("parseScrollPosition value 41", () => {
    expect(parseScrollPosition("41")).toBe(41);
  });
  it("parseScrollPosition value 42", () => {
    expect(parseScrollPosition("42")).toBe(42);
  });
  it("parseScrollPosition value 43", () => {
    expect(parseScrollPosition("43")).toBe(43);
  });
  it("parseScrollPosition value 44", () => {
    expect(parseScrollPosition("44")).toBe(44);
  });
  it("parseScrollPosition value 45", () => {
    expect(parseScrollPosition("45")).toBe(45);
  });
  it("parseScrollPosition value 46", () => {
    expect(parseScrollPosition("46")).toBe(46);
  });
  it("parseScrollPosition value 47", () => {
    expect(parseScrollPosition("47")).toBe(47);
  });
  it("parseScrollPosition value 48", () => {
    expect(parseScrollPosition("48")).toBe(48);
  });
  it("parseScrollPosition value 49", () => {
    expect(parseScrollPosition("49")).toBe(49);
  });
  it("parseScrollPosition value 50", () => {
    expect(parseScrollPosition("50")).toBe(50);
  });
  it("parseScrollPosition value 51", () => {
    expect(parseScrollPosition("51")).toBe(51);
  });
  it("parseScrollPosition value 52", () => {
    expect(parseScrollPosition("52")).toBe(52);
  });
  it("parseScrollPosition value 53", () => {
    expect(parseScrollPosition("53")).toBe(53);
  });
  it("parseScrollPosition value 54", () => {
    expect(parseScrollPosition("54")).toBe(54);
  });
  it("parseScrollPosition value 55", () => {
    expect(parseScrollPosition("55")).toBe(55);
  });
  it("parseScrollPosition value 56", () => {
    expect(parseScrollPosition("56")).toBe(56);
  });
  it("parseScrollPosition value 57", () => {
    expect(parseScrollPosition("57")).toBe(57);
  });
  it("parseScrollPosition value 58", () => {
    expect(parseScrollPosition("58")).toBe(58);
  });
  it("parseScrollPosition value 59", () => {
    expect(parseScrollPosition("59")).toBe(59);
  });
  it("parseScrollPosition value 60", () => {
    expect(parseScrollPosition("60")).toBe(60);
  });
  it("parseScrollPosition value 61", () => {
    expect(parseScrollPosition("61")).toBe(61);
  });
  it("parseScrollPosition value 62", () => {
    expect(parseScrollPosition("62")).toBe(62);
  });
  it("parseScrollPosition value 63", () => {
    expect(parseScrollPosition("63")).toBe(63);
  });
  it("parseScrollPosition value 64", () => {
    expect(parseScrollPosition("64")).toBe(64);
  });
  it("parseScrollPosition value 65", () => {
    expect(parseScrollPosition("65")).toBe(65);
  });
  it("parseScrollPosition value 66", () => {
    expect(parseScrollPosition("66")).toBe(66);
  });
  it("parseScrollPosition value 67", () => {
    expect(parseScrollPosition("67")).toBe(67);
  });
  it("parseScrollPosition value 68", () => {
    expect(parseScrollPosition("68")).toBe(68);
  });
  it("parseScrollPosition value 69", () => {
    expect(parseScrollPosition("69")).toBe(69);
  });
  it("parseScrollPosition value 70", () => {
    expect(parseScrollPosition("70")).toBe(70);
  });
  it("parseScrollPosition value 71", () => {
    expect(parseScrollPosition("71")).toBe(71);
  });
  it("parseScrollPosition value 72", () => {
    expect(parseScrollPosition("72")).toBe(72);
  });
  it("parseScrollPosition value 73", () => {
    expect(parseScrollPosition("73")).toBe(73);
  });
  it("parseScrollPosition value 74", () => {
    expect(parseScrollPosition("74")).toBe(74);
  });
  it("parseScrollPosition value 75", () => {
    expect(parseScrollPosition("75")).toBe(75);
  });
  it("parseScrollPosition value 76", () => {
    expect(parseScrollPosition("76")).toBe(76);
  });
  it("parseScrollPosition value 77", () => {
    expect(parseScrollPosition("77")).toBe(77);
  });
  it("parseScrollPosition value 78", () => {
    expect(parseScrollPosition("78")).toBe(78);
  });
  it("parseScrollPosition value 79", () => {
    expect(parseScrollPosition("79")).toBe(79);
  });
  it("parseScrollPosition value 80", () => {
    expect(parseScrollPosition("80")).toBe(80);
  });
  it("parseScrollPosition value 81", () => {
    expect(parseScrollPosition("81")).toBe(81);
  });
  it("parseScrollPosition value 82", () => {
    expect(parseScrollPosition("82")).toBe(82);
  });
  it("parseScrollPosition value 83", () => {
    expect(parseScrollPosition("83")).toBe(83);
  });
  it("parseScrollPosition value 84", () => {
    expect(parseScrollPosition("84")).toBe(84);
  });
  it("parseScrollPosition value 85", () => {
    expect(parseScrollPosition("85")).toBe(85);
  });
  it("parseScrollPosition value 86", () => {
    expect(parseScrollPosition("86")).toBe(86);
  });
  it("parseScrollPosition value 87", () => {
    expect(parseScrollPosition("87")).toBe(87);
  });
  it("parseScrollPosition value 88", () => {
    expect(parseScrollPosition("88")).toBe(88);
  });
  it("parseScrollPosition value 89", () => {
    expect(parseScrollPosition("89")).toBe(89);
  });
  it("parseScrollPosition value 90", () => {
    expect(parseScrollPosition("90")).toBe(90);
  });
  it("parseScrollPosition value 91", () => {
    expect(parseScrollPosition("91")).toBe(91);
  });
  it("parseScrollPosition value 92", () => {
    expect(parseScrollPosition("92")).toBe(92);
  });
  it("parseScrollPosition value 93", () => {
    expect(parseScrollPosition("93")).toBe(93);
  });
  it("parseScrollPosition value 94", () => {
    expect(parseScrollPosition("94")).toBe(94);
  });
  it("parseScrollPosition value 95", () => {
    expect(parseScrollPosition("95")).toBe(95);
  });
  it("parseScrollPosition value 96", () => {
    expect(parseScrollPosition("96")).toBe(96);
  });
  it("parseScrollPosition value 97", () => {
    expect(parseScrollPosition("97")).toBe(97);
  });
  it("parseScrollPosition value 98", () => {
    expect(parseScrollPosition("98")).toBe(98);
  });
  it("parseScrollPosition value 99", () => {
    expect(parseScrollPosition("99")).toBe(99);
  });
  it("parseScrollPosition value 100", () => {
    expect(parseScrollPosition("100")).toBe(100);
  });
  it("parseScrollPosition value 101", () => {
    expect(parseScrollPosition("101")).toBe(101);
  });
  it("parseScrollPosition value 102", () => {
    expect(parseScrollPosition("102")).toBe(102);
  });
  it("parseScrollPosition value 103", () => {
    expect(parseScrollPosition("103")).toBe(103);
  });
  it("parseScrollPosition value 104", () => {
    expect(parseScrollPosition("104")).toBe(104);
  });
  it("parseScrollPosition value 105", () => {
    expect(parseScrollPosition("105")).toBe(105);
  });
  it("parseScrollPosition value 106", () => {
    expect(parseScrollPosition("106")).toBe(106);
  });
  it("parseScrollPosition value 107", () => {
    expect(parseScrollPosition("107")).toBe(107);
  });
  it("parseScrollPosition value 108", () => {
    expect(parseScrollPosition("108")).toBe(108);
  });
  it("parseScrollPosition value 109", () => {
    expect(parseScrollPosition("109")).toBe(109);
  });
  it("parseScrollPosition value 110", () => {
    expect(parseScrollPosition("110")).toBe(110);
  });
  it("parseScrollPosition value 111", () => {
    expect(parseScrollPosition("111")).toBe(111);
  });
  it("parseScrollPosition value 112", () => {
    expect(parseScrollPosition("112")).toBe(112);
  });
  it("parseScrollPosition value 113", () => {
    expect(parseScrollPosition("113")).toBe(113);
  });
  it("parseScrollPosition value 114", () => {
    expect(parseScrollPosition("114")).toBe(114);
  });
  it("parseScrollPosition value 115", () => {
    expect(parseScrollPosition("115")).toBe(115);
  });
  it("parseScrollPosition value 116", () => {
    expect(parseScrollPosition("116")).toBe(116);
  });
  it("parseScrollPosition value 117", () => {
    expect(parseScrollPosition("117")).toBe(117);
  });
  it("parseScrollPosition value 118", () => {
    expect(parseScrollPosition("118")).toBe(118);
  });
  it("parseScrollPosition value 119", () => {
    expect(parseScrollPosition("119")).toBe(119);
  });
  it("parseScrollPosition value 120", () => {
    expect(parseScrollPosition("120")).toBe(120);
  });
  it("parseScrollPosition value 121", () => {
    expect(parseScrollPosition("121")).toBe(121);
  });
  it("parseScrollPosition value 122", () => {
    expect(parseScrollPosition("122")).toBe(122);
  });
  it("parseScrollPosition value 123", () => {
    expect(parseScrollPosition("123")).toBe(123);
  });
  it("parseScrollPosition value 124", () => {
    expect(parseScrollPosition("124")).toBe(124);
  });
  it("parseScrollPosition value 125", () => {
    expect(parseScrollPosition("125")).toBe(125);
  });
  it("parseScrollPosition value 126", () => {
    expect(parseScrollPosition("126")).toBe(126);
  });
  it("parseScrollPosition value 127", () => {
    expect(parseScrollPosition("127")).toBe(127);
  });
  it("parseScrollPosition value 128", () => {
    expect(parseScrollPosition("128")).toBe(128);
  });
  it("parseScrollPosition value 129", () => {
    expect(parseScrollPosition("129")).toBe(129);
  });
  it("parseScrollPosition value 130", () => {
    expect(parseScrollPosition("130")).toBe(130);
  });
  it("parseScrollPosition value 131", () => {
    expect(parseScrollPosition("131")).toBe(131);
  });
  it("parseScrollPosition value 132", () => {
    expect(parseScrollPosition("132")).toBe(132);
  });
  it("parseScrollPosition value 133", () => {
    expect(parseScrollPosition("133")).toBe(133);
  });
  it("parseScrollPosition value 134", () => {
    expect(parseScrollPosition("134")).toBe(134);
  });
  it("parseScrollPosition value 135", () => {
    expect(parseScrollPosition("135")).toBe(135);
  });
  it("parseScrollPosition value 136", () => {
    expect(parseScrollPosition("136")).toBe(136);
  });
  it("parseScrollPosition value 137", () => {
    expect(parseScrollPosition("137")).toBe(137);
  });
  it("parseScrollPosition value 138", () => {
    expect(parseScrollPosition("138")).toBe(138);
  });
  it("parseScrollPosition value 139", () => {
    expect(parseScrollPosition("139")).toBe(139);
  });
  it("parseScrollPosition value 140", () => {
    expect(parseScrollPosition("140")).toBe(140);
  });
  it("parseScrollPosition value 141", () => {
    expect(parseScrollPosition("141")).toBe(141);
  });
  it("parseScrollPosition value 142", () => {
    expect(parseScrollPosition("142")).toBe(142);
  });
  it("parseScrollPosition value 143", () => {
    expect(parseScrollPosition("143")).toBe(143);
  });
  it("parseScrollPosition value 144", () => {
    expect(parseScrollPosition("144")).toBe(144);
  });
  it("parseScrollPosition value 145", () => {
    expect(parseScrollPosition("145")).toBe(145);
  });
  it("parseScrollPosition value 146", () => {
    expect(parseScrollPosition("146")).toBe(146);
  });
  it("parseScrollPosition value 147", () => {
    expect(parseScrollPosition("147")).toBe(147);
  });
  it("parseScrollPosition value 148", () => {
    expect(parseScrollPosition("148")).toBe(148);
  });
  it("parseScrollPosition value 149", () => {
    expect(parseScrollPosition("149")).toBe(149);
  });
  it("parseScrollPosition value 150", () => {
    expect(parseScrollPosition("150")).toBe(150);
  });
  it("parseScrollPosition value 151", () => {
    expect(parseScrollPosition("151")).toBe(151);
  });
  it("parseScrollPosition value 152", () => {
    expect(parseScrollPosition("152")).toBe(152);
  });
  it("parseScrollPosition value 153", () => {
    expect(parseScrollPosition("153")).toBe(153);
  });
  it("parseScrollPosition value 154", () => {
    expect(parseScrollPosition("154")).toBe(154);
  });
  it("parseScrollPosition value 155", () => {
    expect(parseScrollPosition("155")).toBe(155);
  });
  it("parseScrollPosition value 156", () => {
    expect(parseScrollPosition("156")).toBe(156);
  });
  it("parseScrollPosition value 157", () => {
    expect(parseScrollPosition("157")).toBe(157);
  });
  it("parseScrollPosition value 158", () => {
    expect(parseScrollPosition("158")).toBe(158);
  });
  it("parseScrollPosition value 159", () => {
    expect(parseScrollPosition("159")).toBe(159);
  });
  it("parseScrollPosition value 160", () => {
    expect(parseScrollPosition("160")).toBe(160);
  });
  it("parseScrollPosition value 161", () => {
    expect(parseScrollPosition("161")).toBe(161);
  });
  it("parseScrollPosition value 162", () => {
    expect(parseScrollPosition("162")).toBe(162);
  });
  it("parseScrollPosition value 163", () => {
    expect(parseScrollPosition("163")).toBe(163);
  });
  it("parseScrollPosition value 164", () => {
    expect(parseScrollPosition("164")).toBe(164);
  });
  it("parseScrollPosition value 165", () => {
    expect(parseScrollPosition("165")).toBe(165);
  });
  it("parseScrollPosition value 166", () => {
    expect(parseScrollPosition("166")).toBe(166);
  });
  it("parseScrollPosition value 167", () => {
    expect(parseScrollPosition("167")).toBe(167);
  });
  it("parseScrollPosition value 168", () => {
    expect(parseScrollPosition("168")).toBe(168);
  });
  it("parseScrollPosition value 169", () => {
    expect(parseScrollPosition("169")).toBe(169);
  });
  it("parseScrollPosition value 170", () => {
    expect(parseScrollPosition("170")).toBe(170);
  });
  it("parseScrollPosition value 171", () => {
    expect(parseScrollPosition("171")).toBe(171);
  });
  it("parseScrollPosition value 172", () => {
    expect(parseScrollPosition("172")).toBe(172);
  });
  it("parseScrollPosition value 173", () => {
    expect(parseScrollPosition("173")).toBe(173);
  });
  it("parseScrollPosition value 174", () => {
    expect(parseScrollPosition("174")).toBe(174);
  });
  it("parseScrollPosition value 175", () => {
    expect(parseScrollPosition("175")).toBe(175);
  });
  it("parseScrollPosition value 176", () => {
    expect(parseScrollPosition("176")).toBe(176);
  });
  it("parseScrollPosition value 177", () => {
    expect(parseScrollPosition("177")).toBe(177);
  });
  it("parseScrollPosition value 178", () => {
    expect(parseScrollPosition("178")).toBe(178);
  });
  it("parseScrollPosition value 179", () => {
    expect(parseScrollPosition("179")).toBe(179);
  });
  it("parseScrollPosition value 180", () => {
    expect(parseScrollPosition("180")).toBe(180);
  });
  it("parseScrollPosition value 181", () => {
    expect(parseScrollPosition("181")).toBe(181);
  });
  it("parseScrollPosition value 182", () => {
    expect(parseScrollPosition("182")).toBe(182);
  });
  it("parseScrollPosition value 183", () => {
    expect(parseScrollPosition("183")).toBe(183);
  });
  it("parseScrollPosition value 184", () => {
    expect(parseScrollPosition("184")).toBe(184);
  });
  it("parseScrollPosition value 185", () => {
    expect(parseScrollPosition("185")).toBe(185);
  });
  it("parseScrollPosition value 186", () => {
    expect(parseScrollPosition("186")).toBe(186);
  });
  it("parseScrollPosition value 187", () => {
    expect(parseScrollPosition("187")).toBe(187);
  });
  it("parseScrollPosition value 188", () => {
    expect(parseScrollPosition("188")).toBe(188);
  });
  it("parseScrollPosition value 189", () => {
    expect(parseScrollPosition("189")).toBe(189);
  });
  it("parseScrollPosition value 190", () => {
    expect(parseScrollPosition("190")).toBe(190);
  });
  it("parseScrollPosition value 191", () => {
    expect(parseScrollPosition("191")).toBe(191);
  });
  it("parseScrollPosition value 192", () => {
    expect(parseScrollPosition("192")).toBe(192);
  });
  it("parseScrollPosition value 193", () => {
    expect(parseScrollPosition("193")).toBe(193);
  });
  it("parseScrollPosition value 194", () => {
    expect(parseScrollPosition("194")).toBe(194);
  });
  it("parseScrollPosition value 195", () => {
    expect(parseScrollPosition("195")).toBe(195);
  });
  it("parseScrollPosition value 196", () => {
    expect(parseScrollPosition("196")).toBe(196);
  });
  it("parseScrollPosition value 197", () => {
    expect(parseScrollPosition("197")).toBe(197);
  });
  it("parseScrollPosition value 198", () => {
    expect(parseScrollPosition("198")).toBe(198);
  });
  it("parseScrollPosition value 199", () => {
    expect(parseScrollPosition("199")).toBe(199);
  });
  it("parseScrollPosition value 200", () => {
    expect(parseScrollPosition("200")).toBe(200);
  });
});

describe("dossier-prefs-lib persistence", () => {
  let local: Storage;
  let session: Storage;
  beforeEach(() => {
    local = makeMemoryStorage();
    session = makeMemoryStorage();
  });
  it("read/write roundtrip via local storage", () => {
    const storage = createDossierPrefsStorage(local, session);
    writePersistent(COPY_KEY, "install", storage);
    expect(readPersistent(COPY_KEY, storage)).toBe("install");
  });
  it("migrates session value to local", () => {
    const storage = createDossierPrefsStorage(local, session);
    session.setItem(COPY_KEY, "config");
    expect(readPersistent(COPY_KEY, storage)).toBe("config");
    expect(local.getItem(COPY_KEY)).toBe("config");
  });
  it("persistence matrix 0", () => {
    const storage = createDossierPrefsStorage(local, session);
    const key = "hc:test-0";
    writePersistent(key, "value-0", storage);
    expect(readPersistent(key, storage)).toBe("value-0");
  });
  it("persistence matrix 1", () => {
    const storage = createDossierPrefsStorage(local, session);
    const key = "hc:test-1";
    writePersistent(key, "value-1", storage);
    expect(readPersistent(key, storage)).toBe("value-1");
  });
  it("persistence matrix 2", () => {
    const storage = createDossierPrefsStorage(local, session);
    const key = "hc:test-2";
    writePersistent(key, "value-2", storage);
    expect(readPersistent(key, storage)).toBe("value-2");
  });
  it("persistence matrix 3", () => {
    const storage = createDossierPrefsStorage(local, session);
    const key = "hc:test-3";
    writePersistent(key, "value-3", storage);
    expect(readPersistent(key, storage)).toBe("value-3");
  });
  it("persistence matrix 4", () => {
    const storage = createDossierPrefsStorage(local, session);
    const key = "hc:test-4";
    writePersistent(key, "value-4", storage);
    expect(readPersistent(key, storage)).toBe("value-4");
  });
  it("persistence matrix 5", () => {
    const storage = createDossierPrefsStorage(local, session);
    const key = "hc:test-5";
    writePersistent(key, "value-5", storage);
    expect(readPersistent(key, storage)).toBe("value-5");
  });
  it("persistence matrix 6", () => {
    const storage = createDossierPrefsStorage(local, session);
    const key = "hc:test-6";
    writePersistent(key, "value-6", storage);
    expect(readPersistent(key, storage)).toBe("value-6");
  });
  it("persistence matrix 7", () => {
    const storage = createDossierPrefsStorage(local, session);
    const key = "hc:test-7";
    writePersistent(key, "value-7", storage);
    expect(readPersistent(key, storage)).toBe("value-7");
  });
  it("persistence matrix 8", () => {
    const storage = createDossierPrefsStorage(local, session);
    const key = "hc:test-8";
    writePersistent(key, "value-8", storage);
    expect(readPersistent(key, storage)).toBe("value-8");
  });
  it("persistence matrix 9", () => {
    const storage = createDossierPrefsStorage(local, session);
    const key = "hc:test-9";
    writePersistent(key, "value-9", storage);
    expect(readPersistent(key, storage)).toBe("value-9");
  });
  it("persistence matrix 10", () => {
    const storage = createDossierPrefsStorage(local, session);
    const key = "hc:test-10";
    writePersistent(key, "value-10", storage);
    expect(readPersistent(key, storage)).toBe("value-10");
  });
  it("persistence matrix 11", () => {
    const storage = createDossierPrefsStorage(local, session);
    const key = "hc:test-11";
    writePersistent(key, "value-11", storage);
    expect(readPersistent(key, storage)).toBe("value-11");
  });
  it("persistence matrix 12", () => {
    const storage = createDossierPrefsStorage(local, session);
    const key = "hc:test-12";
    writePersistent(key, "value-12", storage);
    expect(readPersistent(key, storage)).toBe("value-12");
  });
  it("persistence matrix 13", () => {
    const storage = createDossierPrefsStorage(local, session);
    const key = "hc:test-13";
    writePersistent(key, "value-13", storage);
    expect(readPersistent(key, storage)).toBe("value-13");
  });
  it("persistence matrix 14", () => {
    const storage = createDossierPrefsStorage(local, session);
    const key = "hc:test-14";
    writePersistent(key, "value-14", storage);
    expect(readPersistent(key, storage)).toBe("value-14");
  });
  it("persistence matrix 15", () => {
    const storage = createDossierPrefsStorage(local, session);
    const key = "hc:test-15";
    writePersistent(key, "value-15", storage);
    expect(readPersistent(key, storage)).toBe("value-15");
  });
  it("persistence matrix 16", () => {
    const storage = createDossierPrefsStorage(local, session);
    const key = "hc:test-16";
    writePersistent(key, "value-16", storage);
    expect(readPersistent(key, storage)).toBe("value-16");
  });
  it("persistence matrix 17", () => {
    const storage = createDossierPrefsStorage(local, session);
    const key = "hc:test-17";
    writePersistent(key, "value-17", storage);
    expect(readPersistent(key, storage)).toBe("value-17");
  });
  it("persistence matrix 18", () => {
    const storage = createDossierPrefsStorage(local, session);
    const key = "hc:test-18";
    writePersistent(key, "value-18", storage);
    expect(readPersistent(key, storage)).toBe("value-18");
  });
  it("persistence matrix 19", () => {
    const storage = createDossierPrefsStorage(local, session);
    const key = "hc:test-19";
    writePersistent(key, "value-19", storage);
    expect(readPersistent(key, storage)).toBe("value-19");
  });
  it("persistence matrix 20", () => {
    const storage = createDossierPrefsStorage(local, session);
    const key = "hc:test-20";
    writePersistent(key, "value-20", storage);
    expect(readPersistent(key, storage)).toBe("value-20");
  });
  it("persistence matrix 21", () => {
    const storage = createDossierPrefsStorage(local, session);
    const key = "hc:test-21";
    writePersistent(key, "value-21", storage);
    expect(readPersistent(key, storage)).toBe("value-21");
  });
  it("persistence matrix 22", () => {
    const storage = createDossierPrefsStorage(local, session);
    const key = "hc:test-22";
    writePersistent(key, "value-22", storage);
    expect(readPersistent(key, storage)).toBe("value-22");
  });
  it("persistence matrix 23", () => {
    const storage = createDossierPrefsStorage(local, session);
    const key = "hc:test-23";
    writePersistent(key, "value-23", storage);
    expect(readPersistent(key, storage)).toBe("value-23");
  });
  it("persistence matrix 24", () => {
    const storage = createDossierPrefsStorage(local, session);
    const key = "hc:test-24";
    writePersistent(key, "value-24", storage);
    expect(readPersistent(key, storage)).toBe("value-24");
  });
  it("persistence matrix 25", () => {
    const storage = createDossierPrefsStorage(local, session);
    const key = "hc:test-25";
    writePersistent(key, "value-25", storage);
    expect(readPersistent(key, storage)).toBe("value-25");
  });
  it("persistence matrix 26", () => {
    const storage = createDossierPrefsStorage(local, session);
    const key = "hc:test-26";
    writePersistent(key, "value-26", storage);
    expect(readPersistent(key, storage)).toBe("value-26");
  });
  it("persistence matrix 27", () => {
    const storage = createDossierPrefsStorage(local, session);
    const key = "hc:test-27";
    writePersistent(key, "value-27", storage);
    expect(readPersistent(key, storage)).toBe("value-27");
  });
  it("persistence matrix 28", () => {
    const storage = createDossierPrefsStorage(local, session);
    const key = "hc:test-28";
    writePersistent(key, "value-28", storage);
    expect(readPersistent(key, storage)).toBe("value-28");
  });
  it("persistence matrix 29", () => {
    const storage = createDossierPrefsStorage(local, session);
    const key = "hc:test-29";
    writePersistent(key, "value-29", storage);
    expect(readPersistent(key, storage)).toBe("value-29");
  });
  it("persistence matrix 30", () => {
    const storage = createDossierPrefsStorage(local, session);
    const key = "hc:test-30";
    writePersistent(key, "value-30", storage);
    expect(readPersistent(key, storage)).toBe("value-30");
  });
  it("persistence matrix 31", () => {
    const storage = createDossierPrefsStorage(local, session);
    const key = "hc:test-31";
    writePersistent(key, "value-31", storage);
    expect(readPersistent(key, storage)).toBe("value-31");
  });
  it("persistence matrix 32", () => {
    const storage = createDossierPrefsStorage(local, session);
    const key = "hc:test-32";
    writePersistent(key, "value-32", storage);
    expect(readPersistent(key, storage)).toBe("value-32");
  });
  it("persistence matrix 33", () => {
    const storage = createDossierPrefsStorage(local, session);
    const key = "hc:test-33";
    writePersistent(key, "value-33", storage);
    expect(readPersistent(key, storage)).toBe("value-33");
  });
  it("persistence matrix 34", () => {
    const storage = createDossierPrefsStorage(local, session);
    const key = "hc:test-34";
    writePersistent(key, "value-34", storage);
    expect(readPersistent(key, storage)).toBe("value-34");
  });
  it("persistence matrix 35", () => {
    const storage = createDossierPrefsStorage(local, session);
    const key = "hc:test-35";
    writePersistent(key, "value-35", storage);
    expect(readPersistent(key, storage)).toBe("value-35");
  });
  it("persistence matrix 36", () => {
    const storage = createDossierPrefsStorage(local, session);
    const key = "hc:test-36";
    writePersistent(key, "value-36", storage);
    expect(readPersistent(key, storage)).toBe("value-36");
  });
  it("persistence matrix 37", () => {
    const storage = createDossierPrefsStorage(local, session);
    const key = "hc:test-37";
    writePersistent(key, "value-37", storage);
    expect(readPersistent(key, storage)).toBe("value-37");
  });
  it("persistence matrix 38", () => {
    const storage = createDossierPrefsStorage(local, session);
    const key = "hc:test-38";
    writePersistent(key, "value-38", storage);
    expect(readPersistent(key, storage)).toBe("value-38");
  });
  it("persistence matrix 39", () => {
    const storage = createDossierPrefsStorage(local, session);
    const key = "hc:test-39";
    writePersistent(key, "value-39", storage);
    expect(readPersistent(key, storage)).toBe("value-39");
  });
  it("persistence matrix 40", () => {
    const storage = createDossierPrefsStorage(local, session);
    const key = "hc:test-40";
    writePersistent(key, "value-40", storage);
    expect(readPersistent(key, storage)).toBe("value-40");
  });
  it("persistence matrix 41", () => {
    const storage = createDossierPrefsStorage(local, session);
    const key = "hc:test-41";
    writePersistent(key, "value-41", storage);
    expect(readPersistent(key, storage)).toBe("value-41");
  });
  it("persistence matrix 42", () => {
    const storage = createDossierPrefsStorage(local, session);
    const key = "hc:test-42";
    writePersistent(key, "value-42", storage);
    expect(readPersistent(key, storage)).toBe("value-42");
  });
  it("persistence matrix 43", () => {
    const storage = createDossierPrefsStorage(local, session);
    const key = "hc:test-43";
    writePersistent(key, "value-43", storage);
    expect(readPersistent(key, storage)).toBe("value-43");
  });
  it("persistence matrix 44", () => {
    const storage = createDossierPrefsStorage(local, session);
    const key = "hc:test-44";
    writePersistent(key, "value-44", storage);
    expect(readPersistent(key, storage)).toBe("value-44");
  });
  it("persistence matrix 45", () => {
    const storage = createDossierPrefsStorage(local, session);
    const key = "hc:test-45";
    writePersistent(key, "value-45", storage);
    expect(readPersistent(key, storage)).toBe("value-45");
  });
  it("persistence matrix 46", () => {
    const storage = createDossierPrefsStorage(local, session);
    const key = "hc:test-46";
    writePersistent(key, "value-46", storage);
    expect(readPersistent(key, storage)).toBe("value-46");
  });
  it("persistence matrix 47", () => {
    const storage = createDossierPrefsStorage(local, session);
    const key = "hc:test-47";
    writePersistent(key, "value-47", storage);
    expect(readPersistent(key, storage)).toBe("value-47");
  });
  it("persistence matrix 48", () => {
    const storage = createDossierPrefsStorage(local, session);
    const key = "hc:test-48";
    writePersistent(key, "value-48", storage);
    expect(readPersistent(key, storage)).toBe("value-48");
  });
  it("persistence matrix 49", () => {
    const storage = createDossierPrefsStorage(local, session);
    const key = "hc:test-49";
    writePersistent(key, "value-49", storage);
    expect(readPersistent(key, storage)).toBe("value-49");
  });
  it("persistence matrix 50", () => {
    const storage = createDossierPrefsStorage(local, session);
    const key = "hc:test-50";
    writePersistent(key, "value-50", storage);
    expect(readPersistent(key, storage)).toBe("value-50");
  });
  it("persistence matrix 51", () => {
    const storage = createDossierPrefsStorage(local, session);
    const key = "hc:test-51";
    writePersistent(key, "value-51", storage);
    expect(readPersistent(key, storage)).toBe("value-51");
  });
  it("persistence matrix 52", () => {
    const storage = createDossierPrefsStorage(local, session);
    const key = "hc:test-52";
    writePersistent(key, "value-52", storage);
    expect(readPersistent(key, storage)).toBe("value-52");
  });
  it("persistence matrix 53", () => {
    const storage = createDossierPrefsStorage(local, session);
    const key = "hc:test-53";
    writePersistent(key, "value-53", storage);
    expect(readPersistent(key, storage)).toBe("value-53");
  });
  it("persistence matrix 54", () => {
    const storage = createDossierPrefsStorage(local, session);
    const key = "hc:test-54";
    writePersistent(key, "value-54", storage);
    expect(readPersistent(key, storage)).toBe("value-54");
  });
  it("persistence matrix 55", () => {
    const storage = createDossierPrefsStorage(local, session);
    const key = "hc:test-55";
    writePersistent(key, "value-55", storage);
    expect(readPersistent(key, storage)).toBe("value-55");
  });
  it("persistence matrix 56", () => {
    const storage = createDossierPrefsStorage(local, session);
    const key = "hc:test-56";
    writePersistent(key, "value-56", storage);
    expect(readPersistent(key, storage)).toBe("value-56");
  });
  it("persistence matrix 57", () => {
    const storage = createDossierPrefsStorage(local, session);
    const key = "hc:test-57";
    writePersistent(key, "value-57", storage);
    expect(readPersistent(key, storage)).toBe("value-57");
  });
  it("persistence matrix 58", () => {
    const storage = createDossierPrefsStorage(local, session);
    const key = "hc:test-58";
    writePersistent(key, "value-58", storage);
    expect(readPersistent(key, storage)).toBe("value-58");
  });
  it("persistence matrix 59", () => {
    const storage = createDossierPrefsStorage(local, session);
    const key = "hc:test-59";
    writePersistent(key, "value-59", storage);
    expect(readPersistent(key, storage)).toBe("value-59");
  });
  it("persistence matrix 60", () => {
    const storage = createDossierPrefsStorage(local, session);
    const key = "hc:test-60";
    writePersistent(key, "value-60", storage);
    expect(readPersistent(key, storage)).toBe("value-60");
  });
  it("persistence matrix 61", () => {
    const storage = createDossierPrefsStorage(local, session);
    const key = "hc:test-61";
    writePersistent(key, "value-61", storage);
    expect(readPersistent(key, storage)).toBe("value-61");
  });
  it("persistence matrix 62", () => {
    const storage = createDossierPrefsStorage(local, session);
    const key = "hc:test-62";
    writePersistent(key, "value-62", storage);
    expect(readPersistent(key, storage)).toBe("value-62");
  });
  it("persistence matrix 63", () => {
    const storage = createDossierPrefsStorage(local, session);
    const key = "hc:test-63";
    writePersistent(key, "value-63", storage);
    expect(readPersistent(key, storage)).toBe("value-63");
  });
  it("persistence matrix 64", () => {
    const storage = createDossierPrefsStorage(local, session);
    const key = "hc:test-64";
    writePersistent(key, "value-64", storage);
    expect(readPersistent(key, storage)).toBe("value-64");
  });
  it("persistence matrix 65", () => {
    const storage = createDossierPrefsStorage(local, session);
    const key = "hc:test-65";
    writePersistent(key, "value-65", storage);
    expect(readPersistent(key, storage)).toBe("value-65");
  });
  it("persistence matrix 66", () => {
    const storage = createDossierPrefsStorage(local, session);
    const key = "hc:test-66";
    writePersistent(key, "value-66", storage);
    expect(readPersistent(key, storage)).toBe("value-66");
  });
  it("persistence matrix 67", () => {
    const storage = createDossierPrefsStorage(local, session);
    const key = "hc:test-67";
    writePersistent(key, "value-67", storage);
    expect(readPersistent(key, storage)).toBe("value-67");
  });
  it("persistence matrix 68", () => {
    const storage = createDossierPrefsStorage(local, session);
    const key = "hc:test-68";
    writePersistent(key, "value-68", storage);
    expect(readPersistent(key, storage)).toBe("value-68");
  });
  it("persistence matrix 69", () => {
    const storage = createDossierPrefsStorage(local, session);
    const key = "hc:test-69";
    writePersistent(key, "value-69", storage);
    expect(readPersistent(key, storage)).toBe("value-69");
  });
  it("persistence matrix 70", () => {
    const storage = createDossierPrefsStorage(local, session);
    const key = "hc:test-70";
    writePersistent(key, "value-70", storage);
    expect(readPersistent(key, storage)).toBe("value-70");
  });
  it("persistence matrix 71", () => {
    const storage = createDossierPrefsStorage(local, session);
    const key = "hc:test-71";
    writePersistent(key, "value-71", storage);
    expect(readPersistent(key, storage)).toBe("value-71");
  });
  it("persistence matrix 72", () => {
    const storage = createDossierPrefsStorage(local, session);
    const key = "hc:test-72";
    writePersistent(key, "value-72", storage);
    expect(readPersistent(key, storage)).toBe("value-72");
  });
  it("persistence matrix 73", () => {
    const storage = createDossierPrefsStorage(local, session);
    const key = "hc:test-73";
    writePersistent(key, "value-73", storage);
    expect(readPersistent(key, storage)).toBe("value-73");
  });
  it("persistence matrix 74", () => {
    const storage = createDossierPrefsStorage(local, session);
    const key = "hc:test-74";
    writePersistent(key, "value-74", storage);
    expect(readPersistent(key, storage)).toBe("value-74");
  });
  it("persistence matrix 75", () => {
    const storage = createDossierPrefsStorage(local, session);
    const key = "hc:test-75";
    writePersistent(key, "value-75", storage);
    expect(readPersistent(key, storage)).toBe("value-75");
  });
  it("persistence matrix 76", () => {
    const storage = createDossierPrefsStorage(local, session);
    const key = "hc:test-76";
    writePersistent(key, "value-76", storage);
    expect(readPersistent(key, storage)).toBe("value-76");
  });
  it("persistence matrix 77", () => {
    const storage = createDossierPrefsStorage(local, session);
    const key = "hc:test-77";
    writePersistent(key, "value-77", storage);
    expect(readPersistent(key, storage)).toBe("value-77");
  });
  it("persistence matrix 78", () => {
    const storage = createDossierPrefsStorage(local, session);
    const key = "hc:test-78";
    writePersistent(key, "value-78", storage);
    expect(readPersistent(key, storage)).toBe("value-78");
  });
  it("persistence matrix 79", () => {
    const storage = createDossierPrefsStorage(local, session);
    const key = "hc:test-79";
    writePersistent(key, "value-79", storage);
    expect(readPersistent(key, storage)).toBe("value-79");
  });
  it("persistence matrix 80", () => {
    const storage = createDossierPrefsStorage(local, session);
    const key = "hc:test-80";
    writePersistent(key, "value-80", storage);
    expect(readPersistent(key, storage)).toBe("value-80");
  });
  it("persistence matrix 81", () => {
    const storage = createDossierPrefsStorage(local, session);
    const key = "hc:test-81";
    writePersistent(key, "value-81", storage);
    expect(readPersistent(key, storage)).toBe("value-81");
  });
  it("persistence matrix 82", () => {
    const storage = createDossierPrefsStorage(local, session);
    const key = "hc:test-82";
    writePersistent(key, "value-82", storage);
    expect(readPersistent(key, storage)).toBe("value-82");
  });
  it("persistence matrix 83", () => {
    const storage = createDossierPrefsStorage(local, session);
    const key = "hc:test-83";
    writePersistent(key, "value-83", storage);
    expect(readPersistent(key, storage)).toBe("value-83");
  });
  it("persistence matrix 84", () => {
    const storage = createDossierPrefsStorage(local, session);
    const key = "hc:test-84";
    writePersistent(key, "value-84", storage);
    expect(readPersistent(key, storage)).toBe("value-84");
  });
  it("persistence matrix 85", () => {
    const storage = createDossierPrefsStorage(local, session);
    const key = "hc:test-85";
    writePersistent(key, "value-85", storage);
    expect(readPersistent(key, storage)).toBe("value-85");
  });
  it("persistence matrix 86", () => {
    const storage = createDossierPrefsStorage(local, session);
    const key = "hc:test-86";
    writePersistent(key, "value-86", storage);
    expect(readPersistent(key, storage)).toBe("value-86");
  });
  it("persistence matrix 87", () => {
    const storage = createDossierPrefsStorage(local, session);
    const key = "hc:test-87";
    writePersistent(key, "value-87", storage);
    expect(readPersistent(key, storage)).toBe("value-87");
  });
  it("persistence matrix 88", () => {
    const storage = createDossierPrefsStorage(local, session);
    const key = "hc:test-88";
    writePersistent(key, "value-88", storage);
    expect(readPersistent(key, storage)).toBe("value-88");
  });
  it("persistence matrix 89", () => {
    const storage = createDossierPrefsStorage(local, session);
    const key = "hc:test-89";
    writePersistent(key, "value-89", storage);
    expect(readPersistent(key, storage)).toBe("value-89");
  });
  it("persistence matrix 90", () => {
    const storage = createDossierPrefsStorage(local, session);
    const key = "hc:test-90";
    writePersistent(key, "value-90", storage);
    expect(readPersistent(key, storage)).toBe("value-90");
  });
  it("persistence matrix 91", () => {
    const storage = createDossierPrefsStorage(local, session);
    const key = "hc:test-91";
    writePersistent(key, "value-91", storage);
    expect(readPersistent(key, storage)).toBe("value-91");
  });
  it("persistence matrix 92", () => {
    const storage = createDossierPrefsStorage(local, session);
    const key = "hc:test-92";
    writePersistent(key, "value-92", storage);
    expect(readPersistent(key, storage)).toBe("value-92");
  });
  it("persistence matrix 93", () => {
    const storage = createDossierPrefsStorage(local, session);
    const key = "hc:test-93";
    writePersistent(key, "value-93", storage);
    expect(readPersistent(key, storage)).toBe("value-93");
  });
  it("persistence matrix 94", () => {
    const storage = createDossierPrefsStorage(local, session);
    const key = "hc:test-94";
    writePersistent(key, "value-94", storage);
    expect(readPersistent(key, storage)).toBe("value-94");
  });
  it("persistence matrix 95", () => {
    const storage = createDossierPrefsStorage(local, session);
    const key = "hc:test-95";
    writePersistent(key, "value-95", storage);
    expect(readPersistent(key, storage)).toBe("value-95");
  });
  it("persistence matrix 96", () => {
    const storage = createDossierPrefsStorage(local, session);
    const key = "hc:test-96";
    writePersistent(key, "value-96", storage);
    expect(readPersistent(key, storage)).toBe("value-96");
  });
  it("persistence matrix 97", () => {
    const storage = createDossierPrefsStorage(local, session);
    const key = "hc:test-97";
    writePersistent(key, "value-97", storage);
    expect(readPersistent(key, storage)).toBe("value-97");
  });
  it("persistence matrix 98", () => {
    const storage = createDossierPrefsStorage(local, session);
    const key = "hc:test-98";
    writePersistent(key, "value-98", storage);
    expect(readPersistent(key, storage)).toBe("value-98");
  });
  it("persistence matrix 99", () => {
    const storage = createDossierPrefsStorage(local, session);
    const key = "hc:test-99";
    writePersistent(key, "value-99", storage);
    expect(readPersistent(key, storage)).toBe("value-99");
  });
  it("persistence matrix 100", () => {
    const storage = createDossierPrefsStorage(local, session);
    const key = "hc:test-100";
    writePersistent(key, "value-100", storage);
    expect(readPersistent(key, storage)).toBe("value-100");
  });
  it("persistence matrix 101", () => {
    const storage = createDossierPrefsStorage(local, session);
    const key = "hc:test-101";
    writePersistent(key, "value-101", storage);
    expect(readPersistent(key, storage)).toBe("value-101");
  });
  it("persistence matrix 102", () => {
    const storage = createDossierPrefsStorage(local, session);
    const key = "hc:test-102";
    writePersistent(key, "value-102", storage);
    expect(readPersistent(key, storage)).toBe("value-102");
  });
  it("persistence matrix 103", () => {
    const storage = createDossierPrefsStorage(local, session);
    const key = "hc:test-103";
    writePersistent(key, "value-103", storage);
    expect(readPersistent(key, storage)).toBe("value-103");
  });
  it("persistence matrix 104", () => {
    const storage = createDossierPrefsStorage(local, session);
    const key = "hc:test-104";
    writePersistent(key, "value-104", storage);
    expect(readPersistent(key, storage)).toBe("value-104");
  });
  it("persistence matrix 105", () => {
    const storage = createDossierPrefsStorage(local, session);
    const key = "hc:test-105";
    writePersistent(key, "value-105", storage);
    expect(readPersistent(key, storage)).toBe("value-105");
  });
  it("persistence matrix 106", () => {
    const storage = createDossierPrefsStorage(local, session);
    const key = "hc:test-106";
    writePersistent(key, "value-106", storage);
    expect(readPersistent(key, storage)).toBe("value-106");
  });
  it("persistence matrix 107", () => {
    const storage = createDossierPrefsStorage(local, session);
    const key = "hc:test-107";
    writePersistent(key, "value-107", storage);
    expect(readPersistent(key, storage)).toBe("value-107");
  });
  it("persistence matrix 108", () => {
    const storage = createDossierPrefsStorage(local, session);
    const key = "hc:test-108";
    writePersistent(key, "value-108", storage);
    expect(readPersistent(key, storage)).toBe("value-108");
  });
  it("persistence matrix 109", () => {
    const storage = createDossierPrefsStorage(local, session);
    const key = "hc:test-109";
    writePersistent(key, "value-109", storage);
    expect(readPersistent(key, storage)).toBe("value-109");
  });
  it("persistence matrix 110", () => {
    const storage = createDossierPrefsStorage(local, session);
    const key = "hc:test-110";
    writePersistent(key, "value-110", storage);
    expect(readPersistent(key, storage)).toBe("value-110");
  });
  it("persistence matrix 111", () => {
    const storage = createDossierPrefsStorage(local, session);
    const key = "hc:test-111";
    writePersistent(key, "value-111", storage);
    expect(readPersistent(key, storage)).toBe("value-111");
  });
  it("persistence matrix 112", () => {
    const storage = createDossierPrefsStorage(local, session);
    const key = "hc:test-112";
    writePersistent(key, "value-112", storage);
    expect(readPersistent(key, storage)).toBe("value-112");
  });
  it("persistence matrix 113", () => {
    const storage = createDossierPrefsStorage(local, session);
    const key = "hc:test-113";
    writePersistent(key, "value-113", storage);
    expect(readPersistent(key, storage)).toBe("value-113");
  });
  it("persistence matrix 114", () => {
    const storage = createDossierPrefsStorage(local, session);
    const key = "hc:test-114";
    writePersistent(key, "value-114", storage);
    expect(readPersistent(key, storage)).toBe("value-114");
  });
  it("persistence matrix 115", () => {
    const storage = createDossierPrefsStorage(local, session);
    const key = "hc:test-115";
    writePersistent(key, "value-115", storage);
    expect(readPersistent(key, storage)).toBe("value-115");
  });
  it("persistence matrix 116", () => {
    const storage = createDossierPrefsStorage(local, session);
    const key = "hc:test-116";
    writePersistent(key, "value-116", storage);
    expect(readPersistent(key, storage)).toBe("value-116");
  });
  it("persistence matrix 117", () => {
    const storage = createDossierPrefsStorage(local, session);
    const key = "hc:test-117";
    writePersistent(key, "value-117", storage);
    expect(readPersistent(key, storage)).toBe("value-117");
  });
  it("persistence matrix 118", () => {
    const storage = createDossierPrefsStorage(local, session);
    const key = "hc:test-118";
    writePersistent(key, "value-118", storage);
    expect(readPersistent(key, storage)).toBe("value-118");
  });
  it("persistence matrix 119", () => {
    const storage = createDossierPrefsStorage(local, session);
    const key = "hc:test-119";
    writePersistent(key, "value-119", storage);
    expect(readPersistent(key, storage)).toBe("value-119");
  });
});

describe("dossier-prefs-lib readPersistent session fallback", () => {
  it("migrates a value from session to local storage on read", () => {
    const local = makeMemoryStorage();
    const session = makeMemoryStorage();
    session.setItem("k", "v");
    expect(readPersistent("k", { local, session })).toBe("v");
    // The value is copied into local so later reads no longer need session.
    expect(local.getItem("k")).toBe("v");
  });

  it("reads from session without migrating when local storage is absent", () => {
    const session = makeMemoryStorage();
    session.setItem("k", "v");
    expect(readPersistent("k", { local: null, session })).toBe("v");
  });

  it("returns null when neither store has the key", () => {
    expect(
      readPersistent("missing", {
        local: makeMemoryStorage(),
        session: makeMemoryStorage(),
      }),
    ).toBeNull();
  });

  it("returns null when local misses and there is no session store", () => {
    expect(
      readPersistent("missing", { local: makeMemoryStorage(), session: null }),
    ).toBeNull();
  });

  it("writePersistent is a no-op when local storage is absent", () => {
    expect(() =>
      writePersistent("k", "v", { local: null, session: null }),
    ).not.toThrow();
  });
});

describe("dossier-prefs-lib default window storage", () => {
  const globalWithWindow = globalThis as { window?: unknown };
  const originalWindow = globalWithWindow.window;

  afterEach(() => {
    if (originalWindow === undefined) delete globalWithWindow.window;
    else globalWithWindow.window = originalWindow;
  });

  it("returns the window storages when they are available", () => {
    const local = makeMemoryStorage();
    const session = makeMemoryStorage();
    globalWithWindow.window = { localStorage: local, sessionStorage: session };
    expect(defaultLocalStorage()).toBe(local);
    expect(defaultSessionStorage()).toBe(session);
  });

  it("returns null when accessing a window storage throws", () => {
    globalWithWindow.window = {
      get localStorage(): Storage {
        throw new Error("storage blocked");
      },
      get sessionStorage(): Storage {
        throw new Error("storage blocked");
      },
    };
    expect(defaultLocalStorage()).toBeNull();
    expect(defaultSessionStorage()).toBeNull();
  });

  it("returns null when window is undefined", () => {
    delete globalWithWindow.window;
    expect(defaultLocalStorage()).toBeNull();
    expect(defaultSessionStorage()).toBeNull();
  });
});

describe("dossier-prefs-lib resilience and parsing edges", () => {
  function throwingStorage(): Storage {
    return {
      ...makeMemoryStorage(),
      getItem() {
        throw new Error("storage blocked");
      },
    };
  }

  it("parseScrollPosition returns null for empty or nullish input", () => {
    expect(parseScrollPosition("")).toBeNull();
    expect(parseScrollPosition(null)).toBeNull();
    expect(parseScrollPosition(undefined)).toBeNull();
  });

  it("parseScrollPosition rejects non-positive and non-finite values", () => {
    expect(parseScrollPosition("0")).toBeNull();
    expect(parseScrollPosition("-5")).toBeNull();
    expect(parseScrollPosition("abc")).toBeNull();
  });

  it("readPersistent recovers to session when local getItem throws", () => {
    const session = makeMemoryStorage();
    session.setItem("k", "v");
    expect(readPersistent("k", { local: throwingStorage(), session })).toBe(
      "v",
    );
  });

  it("readPersistent returns null when session getItem throws", () => {
    expect(
      readPersistent("k", { local: null, session: throwingStorage() }),
    ).toBeNull();
  });
});
