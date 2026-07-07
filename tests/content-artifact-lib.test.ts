import { describe, expect, it } from "vitest";
import path from "node:path";

import {
  DATA_ORIGIN,
  isSafeContentPathPart,
  localDataFilePaths,
  normalizeEntryDetailPayload,
  normalizeRegistryEntries,
  safeDataArtifactPath,
} from "../apps/web/src/lib/content-artifact-lib";

describe("content-artifact-lib DATA_ORIGIN", () => {
  it("points at the canonical site origin", () => {
    expect(DATA_ORIGIN).toBe("https://heyclau.de");
  });
});

describe("content-artifact-lib normalizeEntryDetailPayload", () => {
  it("returns null when entry missing", () => {
    expect(normalizeEntryDetailPayload({})).toBeNull();
  });
  it("merges trustSignals when entry lacks them", () => {
    const entry = { category: "mcp", slug: "demo", title: "Demo" };
    const trustSignals = { sourceStatus: "available" as const };
    expect(normalizeEntryDetailPayload({ entry, trustSignals })).toEqual({
      ...entry,
      trustSignals,
    });
  });
  it("preserves entry trustSignals when already present", () => {
    const entry = {
      category: "mcp",
      slug: "demo",
      trustSignals: { sourceStatus: "missing" as const },
    };
    expect(
      normalizeEntryDetailPayload({
        entry,
        trustSignals: { sourceStatus: "available" as const },
      }),
    ).toEqual(entry);
  });
  it("normalizeEntryDetailPayload agents/agents-detail-0", () => {
    const entry = {
      category: "agents",
      slug: "agents-detail-0",
      title: "Title 0",
    };
    expect(normalizeEntryDetailPayload({ entry })?.slug).toBe(
      "agents-detail-0",
    );
  });
  it("normalizeEntryDetailPayload agents/agents-detail-1", () => {
    const entry = {
      category: "agents",
      slug: "agents-detail-1",
      title: "Title 1",
    };
    expect(normalizeEntryDetailPayload({ entry })?.slug).toBe(
      "agents-detail-1",
    );
  });
  it("normalizeEntryDetailPayload agents/agents-detail-2", () => {
    const entry = {
      category: "agents",
      slug: "agents-detail-2",
      title: "Title 2",
    };
    expect(normalizeEntryDetailPayload({ entry })?.slug).toBe(
      "agents-detail-2",
    );
  });
  it("normalizeEntryDetailPayload agents/agents-detail-3", () => {
    const entry = {
      category: "agents",
      slug: "agents-detail-3",
      title: "Title 3",
    };
    expect(normalizeEntryDetailPayload({ entry })?.slug).toBe(
      "agents-detail-3",
    );
  });
  it("normalizeEntryDetailPayload agents/agents-detail-4", () => {
    const entry = {
      category: "agents",
      slug: "agents-detail-4",
      title: "Title 4",
    };
    expect(normalizeEntryDetailPayload({ entry })?.slug).toBe(
      "agents-detail-4",
    );
  });
  it("normalizeEntryDetailPayload agents/agents-detail-5", () => {
    const entry = {
      category: "agents",
      slug: "agents-detail-5",
      title: "Title 5",
    };
    expect(normalizeEntryDetailPayload({ entry })?.slug).toBe(
      "agents-detail-5",
    );
  });
  it("normalizeEntryDetailPayload agents/agents-detail-6", () => {
    const entry = {
      category: "agents",
      slug: "agents-detail-6",
      title: "Title 6",
    };
    expect(normalizeEntryDetailPayload({ entry })?.slug).toBe(
      "agents-detail-6",
    );
  });
  it("normalizeEntryDetailPayload agents/agents-detail-7", () => {
    const entry = {
      category: "agents",
      slug: "agents-detail-7",
      title: "Title 7",
    };
    expect(normalizeEntryDetailPayload({ entry })?.slug).toBe(
      "agents-detail-7",
    );
  });
  it("normalizeEntryDetailPayload agents/agents-detail-8", () => {
    const entry = {
      category: "agents",
      slug: "agents-detail-8",
      title: "Title 8",
    };
    expect(normalizeEntryDetailPayload({ entry })?.slug).toBe(
      "agents-detail-8",
    );
  });
  it("normalizeEntryDetailPayload agents/agents-detail-9", () => {
    const entry = {
      category: "agents",
      slug: "agents-detail-9",
      title: "Title 9",
    };
    expect(normalizeEntryDetailPayload({ entry })?.slug).toBe(
      "agents-detail-9",
    );
  });
  it("normalizeEntryDetailPayload mcp/mcp-detail-0", () => {
    const entry = { category: "mcp", slug: "mcp-detail-0", title: "Title 0" };
    expect(normalizeEntryDetailPayload({ entry })?.slug).toBe("mcp-detail-0");
  });
  it("normalizeEntryDetailPayload mcp/mcp-detail-1", () => {
    const entry = { category: "mcp", slug: "mcp-detail-1", title: "Title 1" };
    expect(normalizeEntryDetailPayload({ entry })?.slug).toBe("mcp-detail-1");
  });
  it("normalizeEntryDetailPayload mcp/mcp-detail-2", () => {
    const entry = { category: "mcp", slug: "mcp-detail-2", title: "Title 2" };
    expect(normalizeEntryDetailPayload({ entry })?.slug).toBe("mcp-detail-2");
  });
  it("normalizeEntryDetailPayload mcp/mcp-detail-3", () => {
    const entry = { category: "mcp", slug: "mcp-detail-3", title: "Title 3" };
    expect(normalizeEntryDetailPayload({ entry })?.slug).toBe("mcp-detail-3");
  });
  it("normalizeEntryDetailPayload mcp/mcp-detail-4", () => {
    const entry = { category: "mcp", slug: "mcp-detail-4", title: "Title 4" };
    expect(normalizeEntryDetailPayload({ entry })?.slug).toBe("mcp-detail-4");
  });
  it("normalizeEntryDetailPayload mcp/mcp-detail-5", () => {
    const entry = { category: "mcp", slug: "mcp-detail-5", title: "Title 5" };
    expect(normalizeEntryDetailPayload({ entry })?.slug).toBe("mcp-detail-5");
  });
  it("normalizeEntryDetailPayload mcp/mcp-detail-6", () => {
    const entry = { category: "mcp", slug: "mcp-detail-6", title: "Title 6" };
    expect(normalizeEntryDetailPayload({ entry })?.slug).toBe("mcp-detail-6");
  });
  it("normalizeEntryDetailPayload mcp/mcp-detail-7", () => {
    const entry = { category: "mcp", slug: "mcp-detail-7", title: "Title 7" };
    expect(normalizeEntryDetailPayload({ entry })?.slug).toBe("mcp-detail-7");
  });
  it("normalizeEntryDetailPayload mcp/mcp-detail-8", () => {
    const entry = { category: "mcp", slug: "mcp-detail-8", title: "Title 8" };
    expect(normalizeEntryDetailPayload({ entry })?.slug).toBe("mcp-detail-8");
  });
  it("normalizeEntryDetailPayload mcp/mcp-detail-9", () => {
    const entry = { category: "mcp", slug: "mcp-detail-9", title: "Title 9" };
    expect(normalizeEntryDetailPayload({ entry })?.slug).toBe("mcp-detail-9");
  });
  it("normalizeEntryDetailPayload tools/tools-detail-0", () => {
    const entry = {
      category: "tools",
      slug: "tools-detail-0",
      title: "Title 0",
    };
    expect(normalizeEntryDetailPayload({ entry })?.slug).toBe("tools-detail-0");
  });
  it("normalizeEntryDetailPayload tools/tools-detail-1", () => {
    const entry = {
      category: "tools",
      slug: "tools-detail-1",
      title: "Title 1",
    };
    expect(normalizeEntryDetailPayload({ entry })?.slug).toBe("tools-detail-1");
  });
  it("normalizeEntryDetailPayload tools/tools-detail-2", () => {
    const entry = {
      category: "tools",
      slug: "tools-detail-2",
      title: "Title 2",
    };
    expect(normalizeEntryDetailPayload({ entry })?.slug).toBe("tools-detail-2");
  });
  it("normalizeEntryDetailPayload tools/tools-detail-3", () => {
    const entry = {
      category: "tools",
      slug: "tools-detail-3",
      title: "Title 3",
    };
    expect(normalizeEntryDetailPayload({ entry })?.slug).toBe("tools-detail-3");
  });
  it("normalizeEntryDetailPayload tools/tools-detail-4", () => {
    const entry = {
      category: "tools",
      slug: "tools-detail-4",
      title: "Title 4",
    };
    expect(normalizeEntryDetailPayload({ entry })?.slug).toBe("tools-detail-4");
  });
  it("normalizeEntryDetailPayload tools/tools-detail-5", () => {
    const entry = {
      category: "tools",
      slug: "tools-detail-5",
      title: "Title 5",
    };
    expect(normalizeEntryDetailPayload({ entry })?.slug).toBe("tools-detail-5");
  });
  it("normalizeEntryDetailPayload tools/tools-detail-6", () => {
    const entry = {
      category: "tools",
      slug: "tools-detail-6",
      title: "Title 6",
    };
    expect(normalizeEntryDetailPayload({ entry })?.slug).toBe("tools-detail-6");
  });
  it("normalizeEntryDetailPayload tools/tools-detail-7", () => {
    const entry = {
      category: "tools",
      slug: "tools-detail-7",
      title: "Title 7",
    };
    expect(normalizeEntryDetailPayload({ entry })?.slug).toBe("tools-detail-7");
  });
  it("normalizeEntryDetailPayload tools/tools-detail-8", () => {
    const entry = {
      category: "tools",
      slug: "tools-detail-8",
      title: "Title 8",
    };
    expect(normalizeEntryDetailPayload({ entry })?.slug).toBe("tools-detail-8");
  });
  it("normalizeEntryDetailPayload tools/tools-detail-9", () => {
    const entry = {
      category: "tools",
      slug: "tools-detail-9",
      title: "Title 9",
    };
    expect(normalizeEntryDetailPayload({ entry })?.slug).toBe("tools-detail-9");
  });
  it("normalizeEntryDetailPayload skills/skills-detail-0", () => {
    const entry = {
      category: "skills",
      slug: "skills-detail-0",
      title: "Title 0",
    };
    expect(normalizeEntryDetailPayload({ entry })?.slug).toBe(
      "skills-detail-0",
    );
  });
  it("normalizeEntryDetailPayload skills/skills-detail-1", () => {
    const entry = {
      category: "skills",
      slug: "skills-detail-1",
      title: "Title 1",
    };
    expect(normalizeEntryDetailPayload({ entry })?.slug).toBe(
      "skills-detail-1",
    );
  });
  it("normalizeEntryDetailPayload skills/skills-detail-2", () => {
    const entry = {
      category: "skills",
      slug: "skills-detail-2",
      title: "Title 2",
    };
    expect(normalizeEntryDetailPayload({ entry })?.slug).toBe(
      "skills-detail-2",
    );
  });
  it("normalizeEntryDetailPayload skills/skills-detail-3", () => {
    const entry = {
      category: "skills",
      slug: "skills-detail-3",
      title: "Title 3",
    };
    expect(normalizeEntryDetailPayload({ entry })?.slug).toBe(
      "skills-detail-3",
    );
  });
  it("normalizeEntryDetailPayload skills/skills-detail-4", () => {
    const entry = {
      category: "skills",
      slug: "skills-detail-4",
      title: "Title 4",
    };
    expect(normalizeEntryDetailPayload({ entry })?.slug).toBe(
      "skills-detail-4",
    );
  });
  it("normalizeEntryDetailPayload skills/skills-detail-5", () => {
    const entry = {
      category: "skills",
      slug: "skills-detail-5",
      title: "Title 5",
    };
    expect(normalizeEntryDetailPayload({ entry })?.slug).toBe(
      "skills-detail-5",
    );
  });
  it("normalizeEntryDetailPayload skills/skills-detail-6", () => {
    const entry = {
      category: "skills",
      slug: "skills-detail-6",
      title: "Title 6",
    };
    expect(normalizeEntryDetailPayload({ entry })?.slug).toBe(
      "skills-detail-6",
    );
  });
  it("normalizeEntryDetailPayload skills/skills-detail-7", () => {
    const entry = {
      category: "skills",
      slug: "skills-detail-7",
      title: "Title 7",
    };
    expect(normalizeEntryDetailPayload({ entry })?.slug).toBe(
      "skills-detail-7",
    );
  });
  it("normalizeEntryDetailPayload skills/skills-detail-8", () => {
    const entry = {
      category: "skills",
      slug: "skills-detail-8",
      title: "Title 8",
    };
    expect(normalizeEntryDetailPayload({ entry })?.slug).toBe(
      "skills-detail-8",
    );
  });
  it("normalizeEntryDetailPayload skills/skills-detail-9", () => {
    const entry = {
      category: "skills",
      slug: "skills-detail-9",
      title: "Title 9",
    };
    expect(normalizeEntryDetailPayload({ entry })?.slug).toBe(
      "skills-detail-9",
    );
  });
  it("normalizeEntryDetailPayload rules/rules-detail-0", () => {
    const entry = {
      category: "rules",
      slug: "rules-detail-0",
      title: "Title 0",
    };
    expect(normalizeEntryDetailPayload({ entry })?.slug).toBe("rules-detail-0");
  });
  it("normalizeEntryDetailPayload rules/rules-detail-1", () => {
    const entry = {
      category: "rules",
      slug: "rules-detail-1",
      title: "Title 1",
    };
    expect(normalizeEntryDetailPayload({ entry })?.slug).toBe("rules-detail-1");
  });
  it("normalizeEntryDetailPayload rules/rules-detail-2", () => {
    const entry = {
      category: "rules",
      slug: "rules-detail-2",
      title: "Title 2",
    };
    expect(normalizeEntryDetailPayload({ entry })?.slug).toBe("rules-detail-2");
  });
  it("normalizeEntryDetailPayload rules/rules-detail-3", () => {
    const entry = {
      category: "rules",
      slug: "rules-detail-3",
      title: "Title 3",
    };
    expect(normalizeEntryDetailPayload({ entry })?.slug).toBe("rules-detail-3");
  });
  it("normalizeEntryDetailPayload rules/rules-detail-4", () => {
    const entry = {
      category: "rules",
      slug: "rules-detail-4",
      title: "Title 4",
    };
    expect(normalizeEntryDetailPayload({ entry })?.slug).toBe("rules-detail-4");
  });
  it("normalizeEntryDetailPayload rules/rules-detail-5", () => {
    const entry = {
      category: "rules",
      slug: "rules-detail-5",
      title: "Title 5",
    };
    expect(normalizeEntryDetailPayload({ entry })?.slug).toBe("rules-detail-5");
  });
  it("normalizeEntryDetailPayload rules/rules-detail-6", () => {
    const entry = {
      category: "rules",
      slug: "rules-detail-6",
      title: "Title 6",
    };
    expect(normalizeEntryDetailPayload({ entry })?.slug).toBe("rules-detail-6");
  });
  it("normalizeEntryDetailPayload rules/rules-detail-7", () => {
    const entry = {
      category: "rules",
      slug: "rules-detail-7",
      title: "Title 7",
    };
    expect(normalizeEntryDetailPayload({ entry })?.slug).toBe("rules-detail-7");
  });
  it("normalizeEntryDetailPayload rules/rules-detail-8", () => {
    const entry = {
      category: "rules",
      slug: "rules-detail-8",
      title: "Title 8",
    };
    expect(normalizeEntryDetailPayload({ entry })?.slug).toBe("rules-detail-8");
  });
  it("normalizeEntryDetailPayload rules/rules-detail-9", () => {
    const entry = {
      category: "rules",
      slug: "rules-detail-9",
      title: "Title 9",
    };
    expect(normalizeEntryDetailPayload({ entry })?.slug).toBe("rules-detail-9");
  });
  it("normalizeEntryDetailPayload commands/commands-detail-0", () => {
    const entry = {
      category: "commands",
      slug: "commands-detail-0",
      title: "Title 0",
    };
    expect(normalizeEntryDetailPayload({ entry })?.slug).toBe(
      "commands-detail-0",
    );
  });
  it("normalizeEntryDetailPayload commands/commands-detail-1", () => {
    const entry = {
      category: "commands",
      slug: "commands-detail-1",
      title: "Title 1",
    };
    expect(normalizeEntryDetailPayload({ entry })?.slug).toBe(
      "commands-detail-1",
    );
  });
  it("normalizeEntryDetailPayload commands/commands-detail-2", () => {
    const entry = {
      category: "commands",
      slug: "commands-detail-2",
      title: "Title 2",
    };
    expect(normalizeEntryDetailPayload({ entry })?.slug).toBe(
      "commands-detail-2",
    );
  });
  it("normalizeEntryDetailPayload commands/commands-detail-3", () => {
    const entry = {
      category: "commands",
      slug: "commands-detail-3",
      title: "Title 3",
    };
    expect(normalizeEntryDetailPayload({ entry })?.slug).toBe(
      "commands-detail-3",
    );
  });
  it("normalizeEntryDetailPayload commands/commands-detail-4", () => {
    const entry = {
      category: "commands",
      slug: "commands-detail-4",
      title: "Title 4",
    };
    expect(normalizeEntryDetailPayload({ entry })?.slug).toBe(
      "commands-detail-4",
    );
  });
  it("normalizeEntryDetailPayload commands/commands-detail-5", () => {
    const entry = {
      category: "commands",
      slug: "commands-detail-5",
      title: "Title 5",
    };
    expect(normalizeEntryDetailPayload({ entry })?.slug).toBe(
      "commands-detail-5",
    );
  });
  it("normalizeEntryDetailPayload commands/commands-detail-6", () => {
    const entry = {
      category: "commands",
      slug: "commands-detail-6",
      title: "Title 6",
    };
    expect(normalizeEntryDetailPayload({ entry })?.slug).toBe(
      "commands-detail-6",
    );
  });
  it("normalizeEntryDetailPayload commands/commands-detail-7", () => {
    const entry = {
      category: "commands",
      slug: "commands-detail-7",
      title: "Title 7",
    };
    expect(normalizeEntryDetailPayload({ entry })?.slug).toBe(
      "commands-detail-7",
    );
  });
  it("normalizeEntryDetailPayload commands/commands-detail-8", () => {
    const entry = {
      category: "commands",
      slug: "commands-detail-8",
      title: "Title 8",
    };
    expect(normalizeEntryDetailPayload({ entry })?.slug).toBe(
      "commands-detail-8",
    );
  });
  it("normalizeEntryDetailPayload commands/commands-detail-9", () => {
    const entry = {
      category: "commands",
      slug: "commands-detail-9",
      title: "Title 9",
    };
    expect(normalizeEntryDetailPayload({ entry })?.slug).toBe(
      "commands-detail-9",
    );
  });
  it("normalizeEntryDetailPayload hooks/hooks-detail-0", () => {
    const entry = {
      category: "hooks",
      slug: "hooks-detail-0",
      title: "Title 0",
    };
    expect(normalizeEntryDetailPayload({ entry })?.slug).toBe("hooks-detail-0");
  });
  it("normalizeEntryDetailPayload hooks/hooks-detail-1", () => {
    const entry = {
      category: "hooks",
      slug: "hooks-detail-1",
      title: "Title 1",
    };
    expect(normalizeEntryDetailPayload({ entry })?.slug).toBe("hooks-detail-1");
  });
  it("normalizeEntryDetailPayload hooks/hooks-detail-2", () => {
    const entry = {
      category: "hooks",
      slug: "hooks-detail-2",
      title: "Title 2",
    };
    expect(normalizeEntryDetailPayload({ entry })?.slug).toBe("hooks-detail-2");
  });
  it("normalizeEntryDetailPayload hooks/hooks-detail-3", () => {
    const entry = {
      category: "hooks",
      slug: "hooks-detail-3",
      title: "Title 3",
    };
    expect(normalizeEntryDetailPayload({ entry })?.slug).toBe("hooks-detail-3");
  });
  it("normalizeEntryDetailPayload hooks/hooks-detail-4", () => {
    const entry = {
      category: "hooks",
      slug: "hooks-detail-4",
      title: "Title 4",
    };
    expect(normalizeEntryDetailPayload({ entry })?.slug).toBe("hooks-detail-4");
  });
  it("normalizeEntryDetailPayload hooks/hooks-detail-5", () => {
    const entry = {
      category: "hooks",
      slug: "hooks-detail-5",
      title: "Title 5",
    };
    expect(normalizeEntryDetailPayload({ entry })?.slug).toBe("hooks-detail-5");
  });
  it("normalizeEntryDetailPayload hooks/hooks-detail-6", () => {
    const entry = {
      category: "hooks",
      slug: "hooks-detail-6",
      title: "Title 6",
    };
    expect(normalizeEntryDetailPayload({ entry })?.slug).toBe("hooks-detail-6");
  });
  it("normalizeEntryDetailPayload hooks/hooks-detail-7", () => {
    const entry = {
      category: "hooks",
      slug: "hooks-detail-7",
      title: "Title 7",
    };
    expect(normalizeEntryDetailPayload({ entry })?.slug).toBe("hooks-detail-7");
  });
  it("normalizeEntryDetailPayload hooks/hooks-detail-8", () => {
    const entry = {
      category: "hooks",
      slug: "hooks-detail-8",
      title: "Title 8",
    };
    expect(normalizeEntryDetailPayload({ entry })?.slug).toBe("hooks-detail-8");
  });
  it("normalizeEntryDetailPayload hooks/hooks-detail-9", () => {
    const entry = {
      category: "hooks",
      slug: "hooks-detail-9",
      title: "Title 9",
    };
    expect(normalizeEntryDetailPayload({ entry })?.slug).toBe("hooks-detail-9");
  });
  it("normalizeEntryDetailPayload guides/guides-detail-0", () => {
    const entry = {
      category: "guides",
      slug: "guides-detail-0",
      title: "Title 0",
    };
    expect(normalizeEntryDetailPayload({ entry })?.slug).toBe(
      "guides-detail-0",
    );
  });
  it("normalizeEntryDetailPayload guides/guides-detail-1", () => {
    const entry = {
      category: "guides",
      slug: "guides-detail-1",
      title: "Title 1",
    };
    expect(normalizeEntryDetailPayload({ entry })?.slug).toBe(
      "guides-detail-1",
    );
  });
  it("normalizeEntryDetailPayload guides/guides-detail-2", () => {
    const entry = {
      category: "guides",
      slug: "guides-detail-2",
      title: "Title 2",
    };
    expect(normalizeEntryDetailPayload({ entry })?.slug).toBe(
      "guides-detail-2",
    );
  });
  it("normalizeEntryDetailPayload guides/guides-detail-3", () => {
    const entry = {
      category: "guides",
      slug: "guides-detail-3",
      title: "Title 3",
    };
    expect(normalizeEntryDetailPayload({ entry })?.slug).toBe(
      "guides-detail-3",
    );
  });
  it("normalizeEntryDetailPayload guides/guides-detail-4", () => {
    const entry = {
      category: "guides",
      slug: "guides-detail-4",
      title: "Title 4",
    };
    expect(normalizeEntryDetailPayload({ entry })?.slug).toBe(
      "guides-detail-4",
    );
  });
  it("normalizeEntryDetailPayload guides/guides-detail-5", () => {
    const entry = {
      category: "guides",
      slug: "guides-detail-5",
      title: "Title 5",
    };
    expect(normalizeEntryDetailPayload({ entry })?.slug).toBe(
      "guides-detail-5",
    );
  });
  it("normalizeEntryDetailPayload guides/guides-detail-6", () => {
    const entry = {
      category: "guides",
      slug: "guides-detail-6",
      title: "Title 6",
    };
    expect(normalizeEntryDetailPayload({ entry })?.slug).toBe(
      "guides-detail-6",
    );
  });
  it("normalizeEntryDetailPayload guides/guides-detail-7", () => {
    const entry = {
      category: "guides",
      slug: "guides-detail-7",
      title: "Title 7",
    };
    expect(normalizeEntryDetailPayload({ entry })?.slug).toBe(
      "guides-detail-7",
    );
  });
  it("normalizeEntryDetailPayload guides/guides-detail-8", () => {
    const entry = {
      category: "guides",
      slug: "guides-detail-8",
      title: "Title 8",
    };
    expect(normalizeEntryDetailPayload({ entry })?.slug).toBe(
      "guides-detail-8",
    );
  });
  it("normalizeEntryDetailPayload guides/guides-detail-9", () => {
    const entry = {
      category: "guides",
      slug: "guides-detail-9",
      title: "Title 9",
    };
    expect(normalizeEntryDetailPayload({ entry })?.slug).toBe(
      "guides-detail-9",
    );
  });
  it("normalizeEntryDetailPayload collections/collections-detail-0", () => {
    const entry = {
      category: "collections",
      slug: "collections-detail-0",
      title: "Title 0",
    };
    expect(normalizeEntryDetailPayload({ entry })?.slug).toBe(
      "collections-detail-0",
    );
  });
  it("normalizeEntryDetailPayload collections/collections-detail-1", () => {
    const entry = {
      category: "collections",
      slug: "collections-detail-1",
      title: "Title 1",
    };
    expect(normalizeEntryDetailPayload({ entry })?.slug).toBe(
      "collections-detail-1",
    );
  });
  it("normalizeEntryDetailPayload collections/collections-detail-2", () => {
    const entry = {
      category: "collections",
      slug: "collections-detail-2",
      title: "Title 2",
    };
    expect(normalizeEntryDetailPayload({ entry })?.slug).toBe(
      "collections-detail-2",
    );
  });
  it("normalizeEntryDetailPayload collections/collections-detail-3", () => {
    const entry = {
      category: "collections",
      slug: "collections-detail-3",
      title: "Title 3",
    };
    expect(normalizeEntryDetailPayload({ entry })?.slug).toBe(
      "collections-detail-3",
    );
  });
  it("normalizeEntryDetailPayload collections/collections-detail-4", () => {
    const entry = {
      category: "collections",
      slug: "collections-detail-4",
      title: "Title 4",
    };
    expect(normalizeEntryDetailPayload({ entry })?.slug).toBe(
      "collections-detail-4",
    );
  });
  it("normalizeEntryDetailPayload collections/collections-detail-5", () => {
    const entry = {
      category: "collections",
      slug: "collections-detail-5",
      title: "Title 5",
    };
    expect(normalizeEntryDetailPayload({ entry })?.slug).toBe(
      "collections-detail-5",
    );
  });
  it("normalizeEntryDetailPayload collections/collections-detail-6", () => {
    const entry = {
      category: "collections",
      slug: "collections-detail-6",
      title: "Title 6",
    };
    expect(normalizeEntryDetailPayload({ entry })?.slug).toBe(
      "collections-detail-6",
    );
  });
  it("normalizeEntryDetailPayload collections/collections-detail-7", () => {
    const entry = {
      category: "collections",
      slug: "collections-detail-7",
      title: "Title 7",
    };
    expect(normalizeEntryDetailPayload({ entry })?.slug).toBe(
      "collections-detail-7",
    );
  });
  it("normalizeEntryDetailPayload collections/collections-detail-8", () => {
    const entry = {
      category: "collections",
      slug: "collections-detail-8",
      title: "Title 8",
    };
    expect(normalizeEntryDetailPayload({ entry })?.slug).toBe(
      "collections-detail-8",
    );
  });
  it("normalizeEntryDetailPayload collections/collections-detail-9", () => {
    const entry = {
      category: "collections",
      slug: "collections-detail-9",
      title: "Title 9",
    };
    expect(normalizeEntryDetailPayload({ entry })?.slug).toBe(
      "collections-detail-9",
    );
  });
  it("normalizeEntryDetailPayload statuslines/statuslines-detail-0", () => {
    const entry = {
      category: "statuslines",
      slug: "statuslines-detail-0",
      title: "Title 0",
    };
    expect(normalizeEntryDetailPayload({ entry })?.slug).toBe(
      "statuslines-detail-0",
    );
  });
  it("normalizeEntryDetailPayload statuslines/statuslines-detail-1", () => {
    const entry = {
      category: "statuslines",
      slug: "statuslines-detail-1",
      title: "Title 1",
    };
    expect(normalizeEntryDetailPayload({ entry })?.slug).toBe(
      "statuslines-detail-1",
    );
  });
  it("normalizeEntryDetailPayload statuslines/statuslines-detail-2", () => {
    const entry = {
      category: "statuslines",
      slug: "statuslines-detail-2",
      title: "Title 2",
    };
    expect(normalizeEntryDetailPayload({ entry })?.slug).toBe(
      "statuslines-detail-2",
    );
  });
  it("normalizeEntryDetailPayload statuslines/statuslines-detail-3", () => {
    const entry = {
      category: "statuslines",
      slug: "statuslines-detail-3",
      title: "Title 3",
    };
    expect(normalizeEntryDetailPayload({ entry })?.slug).toBe(
      "statuslines-detail-3",
    );
  });
  it("normalizeEntryDetailPayload statuslines/statuslines-detail-4", () => {
    const entry = {
      category: "statuslines",
      slug: "statuslines-detail-4",
      title: "Title 4",
    };
    expect(normalizeEntryDetailPayload({ entry })?.slug).toBe(
      "statuslines-detail-4",
    );
  });
  it("normalizeEntryDetailPayload statuslines/statuslines-detail-5", () => {
    const entry = {
      category: "statuslines",
      slug: "statuslines-detail-5",
      title: "Title 5",
    };
    expect(normalizeEntryDetailPayload({ entry })?.slug).toBe(
      "statuslines-detail-5",
    );
  });
  it("normalizeEntryDetailPayload statuslines/statuslines-detail-6", () => {
    const entry = {
      category: "statuslines",
      slug: "statuslines-detail-6",
      title: "Title 6",
    };
    expect(normalizeEntryDetailPayload({ entry })?.slug).toBe(
      "statuslines-detail-6",
    );
  });
  it("normalizeEntryDetailPayload statuslines/statuslines-detail-7", () => {
    const entry = {
      category: "statuslines",
      slug: "statuslines-detail-7",
      title: "Title 7",
    };
    expect(normalizeEntryDetailPayload({ entry })?.slug).toBe(
      "statuslines-detail-7",
    );
  });
  it("normalizeEntryDetailPayload statuslines/statuslines-detail-8", () => {
    const entry = {
      category: "statuslines",
      slug: "statuslines-detail-8",
      title: "Title 8",
    };
    expect(normalizeEntryDetailPayload({ entry })?.slug).toBe(
      "statuslines-detail-8",
    );
  });
  it("normalizeEntryDetailPayload statuslines/statuslines-detail-9", () => {
    const entry = {
      category: "statuslines",
      slug: "statuslines-detail-9",
      title: "Title 9",
    };
    expect(normalizeEntryDetailPayload({ entry })?.slug).toBe(
      "statuslines-detail-9",
    );
  });
  it("normalizeEntryDetailPayload trust merge 0", () => {
    const entry = { category: "skills", slug: "skill-0", title: "Skill 0" };
    const trustSignals = { sourceStatus: "available" as const, score: 0 };
    expect(
      normalizeEntryDetailPayload({ entry, trustSignals })?.trustSignals,
    ).toEqual(trustSignals);
  });
  it("normalizeEntryDetailPayload trust merge 1", () => {
    const entry = { category: "skills", slug: "skill-1", title: "Skill 1" };
    const trustSignals = { sourceStatus: "available" as const, score: 1 };
    expect(
      normalizeEntryDetailPayload({ entry, trustSignals })?.trustSignals,
    ).toEqual(trustSignals);
  });
  it("normalizeEntryDetailPayload trust merge 2", () => {
    const entry = { category: "skills", slug: "skill-2", title: "Skill 2" };
    const trustSignals = { sourceStatus: "available" as const, score: 2 };
    expect(
      normalizeEntryDetailPayload({ entry, trustSignals })?.trustSignals,
    ).toEqual(trustSignals);
  });
  it("normalizeEntryDetailPayload trust merge 3", () => {
    const entry = { category: "skills", slug: "skill-3", title: "Skill 3" };
    const trustSignals = { sourceStatus: "available" as const, score: 3 };
    expect(
      normalizeEntryDetailPayload({ entry, trustSignals })?.trustSignals,
    ).toEqual(trustSignals);
  });
  it("normalizeEntryDetailPayload trust merge 4", () => {
    const entry = { category: "skills", slug: "skill-4", title: "Skill 4" };
    const trustSignals = { sourceStatus: "available" as const, score: 4 };
    expect(
      normalizeEntryDetailPayload({ entry, trustSignals })?.trustSignals,
    ).toEqual(trustSignals);
  });
  it("normalizeEntryDetailPayload trust merge 5", () => {
    const entry = { category: "skills", slug: "skill-5", title: "Skill 5" };
    const trustSignals = { sourceStatus: "available" as const, score: 5 };
    expect(
      normalizeEntryDetailPayload({ entry, trustSignals })?.trustSignals,
    ).toEqual(trustSignals);
  });
  it("normalizeEntryDetailPayload trust merge 6", () => {
    const entry = { category: "skills", slug: "skill-6", title: "Skill 6" };
    const trustSignals = { sourceStatus: "available" as const, score: 6 };
    expect(
      normalizeEntryDetailPayload({ entry, trustSignals })?.trustSignals,
    ).toEqual(trustSignals);
  });
  it("normalizeEntryDetailPayload trust merge 7", () => {
    const entry = { category: "skills", slug: "skill-7", title: "Skill 7" };
    const trustSignals = { sourceStatus: "available" as const, score: 7 };
    expect(
      normalizeEntryDetailPayload({ entry, trustSignals })?.trustSignals,
    ).toEqual(trustSignals);
  });
  it("normalizeEntryDetailPayload trust merge 8", () => {
    const entry = { category: "skills", slug: "skill-8", title: "Skill 8" };
    const trustSignals = { sourceStatus: "available" as const, score: 8 };
    expect(
      normalizeEntryDetailPayload({ entry, trustSignals })?.trustSignals,
    ).toEqual(trustSignals);
  });
  it("normalizeEntryDetailPayload trust merge 9", () => {
    const entry = { category: "skills", slug: "skill-9", title: "Skill 9" };
    const trustSignals = { sourceStatus: "available" as const, score: 9 };
    expect(
      normalizeEntryDetailPayload({ entry, trustSignals })?.trustSignals,
    ).toEqual(trustSignals);
  });
  it("normalizeEntryDetailPayload trust merge 10", () => {
    const entry = { category: "skills", slug: "skill-10", title: "Skill 10" };
    const trustSignals = { sourceStatus: "available" as const, score: 10 };
    expect(
      normalizeEntryDetailPayload({ entry, trustSignals })?.trustSignals,
    ).toEqual(trustSignals);
  });
  it("normalizeEntryDetailPayload trust merge 11", () => {
    const entry = { category: "skills", slug: "skill-11", title: "Skill 11" };
    const trustSignals = { sourceStatus: "available" as const, score: 11 };
    expect(
      normalizeEntryDetailPayload({ entry, trustSignals })?.trustSignals,
    ).toEqual(trustSignals);
  });
  it("normalizeEntryDetailPayload trust merge 12", () => {
    const entry = { category: "skills", slug: "skill-12", title: "Skill 12" };
    const trustSignals = { sourceStatus: "available" as const, score: 12 };
    expect(
      normalizeEntryDetailPayload({ entry, trustSignals })?.trustSignals,
    ).toEqual(trustSignals);
  });
  it("normalizeEntryDetailPayload trust merge 13", () => {
    const entry = { category: "skills", slug: "skill-13", title: "Skill 13" };
    const trustSignals = { sourceStatus: "available" as const, score: 13 };
    expect(
      normalizeEntryDetailPayload({ entry, trustSignals })?.trustSignals,
    ).toEqual(trustSignals);
  });
  it("normalizeEntryDetailPayload trust merge 14", () => {
    const entry = { category: "skills", slug: "skill-14", title: "Skill 14" };
    const trustSignals = { sourceStatus: "available" as const, score: 14 };
    expect(
      normalizeEntryDetailPayload({ entry, trustSignals })?.trustSignals,
    ).toEqual(trustSignals);
  });
  it("normalizeEntryDetailPayload trust merge 15", () => {
    const entry = { category: "skills", slug: "skill-15", title: "Skill 15" };
    const trustSignals = { sourceStatus: "available" as const, score: 15 };
    expect(
      normalizeEntryDetailPayload({ entry, trustSignals })?.trustSignals,
    ).toEqual(trustSignals);
  });
  it("normalizeEntryDetailPayload trust merge 16", () => {
    const entry = { category: "skills", slug: "skill-16", title: "Skill 16" };
    const trustSignals = { sourceStatus: "available" as const, score: 16 };
    expect(
      normalizeEntryDetailPayload({ entry, trustSignals })?.trustSignals,
    ).toEqual(trustSignals);
  });
  it("normalizeEntryDetailPayload trust merge 17", () => {
    const entry = { category: "skills", slug: "skill-17", title: "Skill 17" };
    const trustSignals = { sourceStatus: "available" as const, score: 17 };
    expect(
      normalizeEntryDetailPayload({ entry, trustSignals })?.trustSignals,
    ).toEqual(trustSignals);
  });
  it("normalizeEntryDetailPayload trust merge 18", () => {
    const entry = { category: "skills", slug: "skill-18", title: "Skill 18" };
    const trustSignals = { sourceStatus: "available" as const, score: 18 };
    expect(
      normalizeEntryDetailPayload({ entry, trustSignals })?.trustSignals,
    ).toEqual(trustSignals);
  });
  it("normalizeEntryDetailPayload trust merge 19", () => {
    const entry = { category: "skills", slug: "skill-19", title: "Skill 19" };
    const trustSignals = { sourceStatus: "available" as const, score: 19 };
    expect(
      normalizeEntryDetailPayload({ entry, trustSignals })?.trustSignals,
    ).toEqual(trustSignals);
  });
  it("normalizeEntryDetailPayload trust merge 20", () => {
    const entry = { category: "skills", slug: "skill-20", title: "Skill 20" };
    const trustSignals = { sourceStatus: "available" as const, score: 20 };
    expect(
      normalizeEntryDetailPayload({ entry, trustSignals })?.trustSignals,
    ).toEqual(trustSignals);
  });
  it("normalizeEntryDetailPayload trust merge 21", () => {
    const entry = { category: "skills", slug: "skill-21", title: "Skill 21" };
    const trustSignals = { sourceStatus: "available" as const, score: 21 };
    expect(
      normalizeEntryDetailPayload({ entry, trustSignals })?.trustSignals,
    ).toEqual(trustSignals);
  });
  it("normalizeEntryDetailPayload trust merge 22", () => {
    const entry = { category: "skills", slug: "skill-22", title: "Skill 22" };
    const trustSignals = { sourceStatus: "available" as const, score: 22 };
    expect(
      normalizeEntryDetailPayload({ entry, trustSignals })?.trustSignals,
    ).toEqual(trustSignals);
  });
  it("normalizeEntryDetailPayload trust merge 23", () => {
    const entry = { category: "skills", slug: "skill-23", title: "Skill 23" };
    const trustSignals = { sourceStatus: "available" as const, score: 23 };
    expect(
      normalizeEntryDetailPayload({ entry, trustSignals })?.trustSignals,
    ).toEqual(trustSignals);
  });
  it("normalizeEntryDetailPayload trust merge 24", () => {
    const entry = { category: "skills", slug: "skill-24", title: "Skill 24" };
    const trustSignals = { sourceStatus: "available" as const, score: 24 };
    expect(
      normalizeEntryDetailPayload({ entry, trustSignals })?.trustSignals,
    ).toEqual(trustSignals);
  });
  it("normalizeEntryDetailPayload trust merge 25", () => {
    const entry = { category: "skills", slug: "skill-25", title: "Skill 25" };
    const trustSignals = { sourceStatus: "available" as const, score: 25 };
    expect(
      normalizeEntryDetailPayload({ entry, trustSignals })?.trustSignals,
    ).toEqual(trustSignals);
  });
  it("normalizeEntryDetailPayload trust merge 26", () => {
    const entry = { category: "skills", slug: "skill-26", title: "Skill 26" };
    const trustSignals = { sourceStatus: "available" as const, score: 26 };
    expect(
      normalizeEntryDetailPayload({ entry, trustSignals })?.trustSignals,
    ).toEqual(trustSignals);
  });
  it("normalizeEntryDetailPayload trust merge 27", () => {
    const entry = { category: "skills", slug: "skill-27", title: "Skill 27" };
    const trustSignals = { sourceStatus: "available" as const, score: 27 };
    expect(
      normalizeEntryDetailPayload({ entry, trustSignals })?.trustSignals,
    ).toEqual(trustSignals);
  });
  it("normalizeEntryDetailPayload trust merge 28", () => {
    const entry = { category: "skills", slug: "skill-28", title: "Skill 28" };
    const trustSignals = { sourceStatus: "available" as const, score: 28 };
    expect(
      normalizeEntryDetailPayload({ entry, trustSignals })?.trustSignals,
    ).toEqual(trustSignals);
  });
  it("normalizeEntryDetailPayload trust merge 29", () => {
    const entry = { category: "skills", slug: "skill-29", title: "Skill 29" };
    const trustSignals = { sourceStatus: "available" as const, score: 29 };
    expect(
      normalizeEntryDetailPayload({ entry, trustSignals })?.trustSignals,
    ).toEqual(trustSignals);
  });
  it("normalizeEntryDetailPayload trust merge 30", () => {
    const entry = { category: "skills", slug: "skill-30", title: "Skill 30" };
    const trustSignals = { sourceStatus: "available" as const, score: 30 };
    expect(
      normalizeEntryDetailPayload({ entry, trustSignals })?.trustSignals,
    ).toEqual(trustSignals);
  });
  it("normalizeEntryDetailPayload trust merge 31", () => {
    const entry = { category: "skills", slug: "skill-31", title: "Skill 31" };
    const trustSignals = { sourceStatus: "available" as const, score: 31 };
    expect(
      normalizeEntryDetailPayload({ entry, trustSignals })?.trustSignals,
    ).toEqual(trustSignals);
  });
  it("normalizeEntryDetailPayload trust merge 32", () => {
    const entry = { category: "skills", slug: "skill-32", title: "Skill 32" };
    const trustSignals = { sourceStatus: "available" as const, score: 32 };
    expect(
      normalizeEntryDetailPayload({ entry, trustSignals })?.trustSignals,
    ).toEqual(trustSignals);
  });
  it("normalizeEntryDetailPayload trust merge 33", () => {
    const entry = { category: "skills", slug: "skill-33", title: "Skill 33" };
    const trustSignals = { sourceStatus: "available" as const, score: 33 };
    expect(
      normalizeEntryDetailPayload({ entry, trustSignals })?.trustSignals,
    ).toEqual(trustSignals);
  });
  it("normalizeEntryDetailPayload trust merge 34", () => {
    const entry = { category: "skills", slug: "skill-34", title: "Skill 34" };
    const trustSignals = { sourceStatus: "available" as const, score: 34 };
    expect(
      normalizeEntryDetailPayload({ entry, trustSignals })?.trustSignals,
    ).toEqual(trustSignals);
  });
  it("normalizeEntryDetailPayload trust merge 35", () => {
    const entry = { category: "skills", slug: "skill-35", title: "Skill 35" };
    const trustSignals = { sourceStatus: "available" as const, score: 35 };
    expect(
      normalizeEntryDetailPayload({ entry, trustSignals })?.trustSignals,
    ).toEqual(trustSignals);
  });
  it("normalizeEntryDetailPayload trust merge 36", () => {
    const entry = { category: "skills", slug: "skill-36", title: "Skill 36" };
    const trustSignals = { sourceStatus: "available" as const, score: 36 };
    expect(
      normalizeEntryDetailPayload({ entry, trustSignals })?.trustSignals,
    ).toEqual(trustSignals);
  });
  it("normalizeEntryDetailPayload trust merge 37", () => {
    const entry = { category: "skills", slug: "skill-37", title: "Skill 37" };
    const trustSignals = { sourceStatus: "available" as const, score: 37 };
    expect(
      normalizeEntryDetailPayload({ entry, trustSignals })?.trustSignals,
    ).toEqual(trustSignals);
  });
  it("normalizeEntryDetailPayload trust merge 38", () => {
    const entry = { category: "skills", slug: "skill-38", title: "Skill 38" };
    const trustSignals = { sourceStatus: "available" as const, score: 38 };
    expect(
      normalizeEntryDetailPayload({ entry, trustSignals })?.trustSignals,
    ).toEqual(trustSignals);
  });
  it("normalizeEntryDetailPayload trust merge 39", () => {
    const entry = { category: "skills", slug: "skill-39", title: "Skill 39" };
    const trustSignals = { sourceStatus: "available" as const, score: 39 };
    expect(
      normalizeEntryDetailPayload({ entry, trustSignals })?.trustSignals,
    ).toEqual(trustSignals);
  });
  it("normalizeEntryDetailPayload trust merge 40", () => {
    const entry = { category: "skills", slug: "skill-40", title: "Skill 40" };
    const trustSignals = { sourceStatus: "available" as const, score: 40 };
    expect(
      normalizeEntryDetailPayload({ entry, trustSignals })?.trustSignals,
    ).toEqual(trustSignals);
  });
  it("normalizeEntryDetailPayload trust merge 41", () => {
    const entry = { category: "skills", slug: "skill-41", title: "Skill 41" };
    const trustSignals = { sourceStatus: "available" as const, score: 41 };
    expect(
      normalizeEntryDetailPayload({ entry, trustSignals })?.trustSignals,
    ).toEqual(trustSignals);
  });
  it("normalizeEntryDetailPayload trust merge 42", () => {
    const entry = { category: "skills", slug: "skill-42", title: "Skill 42" };
    const trustSignals = { sourceStatus: "available" as const, score: 42 };
    expect(
      normalizeEntryDetailPayload({ entry, trustSignals })?.trustSignals,
    ).toEqual(trustSignals);
  });
  it("normalizeEntryDetailPayload trust merge 43", () => {
    const entry = { category: "skills", slug: "skill-43", title: "Skill 43" };
    const trustSignals = { sourceStatus: "available" as const, score: 43 };
    expect(
      normalizeEntryDetailPayload({ entry, trustSignals })?.trustSignals,
    ).toEqual(trustSignals);
  });
  it("normalizeEntryDetailPayload trust merge 44", () => {
    const entry = { category: "skills", slug: "skill-44", title: "Skill 44" };
    const trustSignals = { sourceStatus: "available" as const, score: 44 };
    expect(
      normalizeEntryDetailPayload({ entry, trustSignals })?.trustSignals,
    ).toEqual(trustSignals);
  });
  it("normalizeEntryDetailPayload trust merge 45", () => {
    const entry = { category: "skills", slug: "skill-45", title: "Skill 45" };
    const trustSignals = { sourceStatus: "available" as const, score: 45 };
    expect(
      normalizeEntryDetailPayload({ entry, trustSignals })?.trustSignals,
    ).toEqual(trustSignals);
  });
  it("normalizeEntryDetailPayload trust merge 46", () => {
    const entry = { category: "skills", slug: "skill-46", title: "Skill 46" };
    const trustSignals = { sourceStatus: "available" as const, score: 46 };
    expect(
      normalizeEntryDetailPayload({ entry, trustSignals })?.trustSignals,
    ).toEqual(trustSignals);
  });
  it("normalizeEntryDetailPayload trust merge 47", () => {
    const entry = { category: "skills", slug: "skill-47", title: "Skill 47" };
    const trustSignals = { sourceStatus: "available" as const, score: 47 };
    expect(
      normalizeEntryDetailPayload({ entry, trustSignals })?.trustSignals,
    ).toEqual(trustSignals);
  });
  it("normalizeEntryDetailPayload trust merge 48", () => {
    const entry = { category: "skills", slug: "skill-48", title: "Skill 48" };
    const trustSignals = { sourceStatus: "available" as const, score: 48 };
    expect(
      normalizeEntryDetailPayload({ entry, trustSignals })?.trustSignals,
    ).toEqual(trustSignals);
  });
  it("normalizeEntryDetailPayload trust merge 49", () => {
    const entry = { category: "skills", slug: "skill-49", title: "Skill 49" };
    const trustSignals = { sourceStatus: "available" as const, score: 49 };
    expect(
      normalizeEntryDetailPayload({ entry, trustSignals })?.trustSignals,
    ).toEqual(trustSignals);
  });
});

describe("content-artifact-lib localDataFilePaths", () => {
  it("returns cwd-relative public/data paths", () => {
    const paths = localDataFilePaths("search-index.json");
    expect(paths[0]).toBe(
      path.join(process.cwd(), "public", "data", "search-index.json"),
    );
    expect(paths).toContain(
      path.join(
        process.cwd(),
        "apps",
        "web",
        "public",
        "data",
        "search-index.json",
      ),
    );
  });
  it("localDataFilePaths 0", () => {
    const paths = localDataFilePaths("search-index.json");
    expect(paths.every((value) => value.endsWith("search-index.json"))).toBe(
      true,
    );
    expect(new Set(paths).size).toBe(paths.length);
  });
  it("localDataFilePaths 1", () => {
    const paths = localDataFilePaths("directory-index.json");
    expect(paths.every((value) => value.endsWith("directory-index.json"))).toBe(
      true,
    );
    expect(new Set(paths).size).toBe(paths.length);
  });
  it("localDataFilePaths 2", () => {
    const paths = localDataFilePaths("registry-manifest.json");
    expect(
      paths.every((value) => value.endsWith("registry-manifest.json")),
    ).toBe(true);
    expect(new Set(paths).size).toBe(paths.length);
  });
  it("localDataFilePaths 3", () => {
    const paths = localDataFilePaths("registry-changelog.json");
    expect(
      paths.every((value) => value.endsWith("registry-changelog.json")),
    ).toBe(true);
    expect(new Set(paths).size).toBe(paths.length);
  });
  it("localDataFilePaths 4", () => {
    const paths = localDataFilePaths("content-quality-report.json");
    expect(
      paths.every((value) => value.endsWith("content-quality-report.json")),
    ).toBe(true);
    expect(new Set(paths).size).toBe(paths.length);
  });
  it("localDataFilePaths 5", () => {
    const paths = localDataFilePaths("registry-trust-report.json");
    expect(
      paths.every((value) => value.endsWith("registry-trust-report.json")),
    ).toBe(true);
    expect(new Set(paths).size).toBe(paths.length);
  });
  it("localDataFilePaths 6", () => {
    const paths = localDataFilePaths("entries/agents/demo-0.json");
    expect(
      paths.every((value) => value.endsWith("entries/agents/demo-0.json")),
    ).toBe(true);
    expect(new Set(paths).size).toBe(paths.length);
  });
  it("localDataFilePaths 7", () => {
    const paths = localDataFilePaths("entries/agents/demo-1.json");
    expect(
      paths.every((value) => value.endsWith("entries/agents/demo-1.json")),
    ).toBe(true);
    expect(new Set(paths).size).toBe(paths.length);
  });
  it("localDataFilePaths 8", () => {
    const paths = localDataFilePaths("entries/agents/demo-2.json");
    expect(
      paths.every((value) => value.endsWith("entries/agents/demo-2.json")),
    ).toBe(true);
    expect(new Set(paths).size).toBe(paths.length);
  });
  it("localDataFilePaths 9", () => {
    const paths = localDataFilePaths("entries/agents/demo-3.json");
    expect(
      paths.every((value) => value.endsWith("entries/agents/demo-3.json")),
    ).toBe(true);
    expect(new Set(paths).size).toBe(paths.length);
  });
  it("localDataFilePaths 10", () => {
    const paths = localDataFilePaths("entries/agents/demo-4.json");
    expect(
      paths.every((value) => value.endsWith("entries/agents/demo-4.json")),
    ).toBe(true);
    expect(new Set(paths).size).toBe(paths.length);
  });
  it("localDataFilePaths 11", () => {
    const paths = localDataFilePaths("entries/agents/demo-5.json");
    expect(
      paths.every((value) => value.endsWith("entries/agents/demo-5.json")),
    ).toBe(true);
    expect(new Set(paths).size).toBe(paths.length);
  });
  it("localDataFilePaths 12", () => {
    const paths = localDataFilePaths("entries/mcp/demo-0.json");
    expect(
      paths.every((value) => value.endsWith("entries/mcp/demo-0.json")),
    ).toBe(true);
    expect(new Set(paths).size).toBe(paths.length);
  });
  it("localDataFilePaths 13", () => {
    const paths = localDataFilePaths("entries/mcp/demo-1.json");
    expect(
      paths.every((value) => value.endsWith("entries/mcp/demo-1.json")),
    ).toBe(true);
    expect(new Set(paths).size).toBe(paths.length);
  });
  it("localDataFilePaths 14", () => {
    const paths = localDataFilePaths("entries/mcp/demo-2.json");
    expect(
      paths.every((value) => value.endsWith("entries/mcp/demo-2.json")),
    ).toBe(true);
    expect(new Set(paths).size).toBe(paths.length);
  });
  it("localDataFilePaths 15", () => {
    const paths = localDataFilePaths("entries/mcp/demo-3.json");
    expect(
      paths.every((value) => value.endsWith("entries/mcp/demo-3.json")),
    ).toBe(true);
    expect(new Set(paths).size).toBe(paths.length);
  });
  it("localDataFilePaths 16", () => {
    const paths = localDataFilePaths("entries/mcp/demo-4.json");
    expect(
      paths.every((value) => value.endsWith("entries/mcp/demo-4.json")),
    ).toBe(true);
    expect(new Set(paths).size).toBe(paths.length);
  });
  it("localDataFilePaths 17", () => {
    const paths = localDataFilePaths("entries/mcp/demo-5.json");
    expect(
      paths.every((value) => value.endsWith("entries/mcp/demo-5.json")),
    ).toBe(true);
    expect(new Set(paths).size).toBe(paths.length);
  });
  it("localDataFilePaths 18", () => {
    const paths = localDataFilePaths("entries/tools/demo-0.json");
    expect(
      paths.every((value) => value.endsWith("entries/tools/demo-0.json")),
    ).toBe(true);
    expect(new Set(paths).size).toBe(paths.length);
  });
  it("localDataFilePaths 19", () => {
    const paths = localDataFilePaths("entries/tools/demo-1.json");
    expect(
      paths.every((value) => value.endsWith("entries/tools/demo-1.json")),
    ).toBe(true);
    expect(new Set(paths).size).toBe(paths.length);
  });
  it("localDataFilePaths 20", () => {
    const paths = localDataFilePaths("entries/tools/demo-2.json");
    expect(
      paths.every((value) => value.endsWith("entries/tools/demo-2.json")),
    ).toBe(true);
    expect(new Set(paths).size).toBe(paths.length);
  });
  it("localDataFilePaths 21", () => {
    const paths = localDataFilePaths("entries/tools/demo-3.json");
    expect(
      paths.every((value) => value.endsWith("entries/tools/demo-3.json")),
    ).toBe(true);
    expect(new Set(paths).size).toBe(paths.length);
  });
  it("localDataFilePaths 22", () => {
    const paths = localDataFilePaths("entries/tools/demo-4.json");
    expect(
      paths.every((value) => value.endsWith("entries/tools/demo-4.json")),
    ).toBe(true);
    expect(new Set(paths).size).toBe(paths.length);
  });
  it("localDataFilePaths 23", () => {
    const paths = localDataFilePaths("entries/tools/demo-5.json");
    expect(
      paths.every((value) => value.endsWith("entries/tools/demo-5.json")),
    ).toBe(true);
    expect(new Set(paths).size).toBe(paths.length);
  });
  it("localDataFilePaths 24", () => {
    const paths = localDataFilePaths("entries/skills/demo-0.json");
    expect(
      paths.every((value) => value.endsWith("entries/skills/demo-0.json")),
    ).toBe(true);
    expect(new Set(paths).size).toBe(paths.length);
  });
  it("localDataFilePaths 25", () => {
    const paths = localDataFilePaths("entries/skills/demo-1.json");
    expect(
      paths.every((value) => value.endsWith("entries/skills/demo-1.json")),
    ).toBe(true);
    expect(new Set(paths).size).toBe(paths.length);
  });
  it("localDataFilePaths 26", () => {
    const paths = localDataFilePaths("entries/skills/demo-2.json");
    expect(
      paths.every((value) => value.endsWith("entries/skills/demo-2.json")),
    ).toBe(true);
    expect(new Set(paths).size).toBe(paths.length);
  });
  it("localDataFilePaths 27", () => {
    const paths = localDataFilePaths("entries/skills/demo-3.json");
    expect(
      paths.every((value) => value.endsWith("entries/skills/demo-3.json")),
    ).toBe(true);
    expect(new Set(paths).size).toBe(paths.length);
  });
  it("localDataFilePaths 28", () => {
    const paths = localDataFilePaths("entries/skills/demo-4.json");
    expect(
      paths.every((value) => value.endsWith("entries/skills/demo-4.json")),
    ).toBe(true);
    expect(new Set(paths).size).toBe(paths.length);
  });
  it("localDataFilePaths 29", () => {
    const paths = localDataFilePaths("entries/skills/demo-5.json");
    expect(
      paths.every((value) => value.endsWith("entries/skills/demo-5.json")),
    ).toBe(true);
    expect(new Set(paths).size).toBe(paths.length);
  });
  it("localDataFilePaths 30", () => {
    const paths = localDataFilePaths("entries/rules/demo-0.json");
    expect(
      paths.every((value) => value.endsWith("entries/rules/demo-0.json")),
    ).toBe(true);
    expect(new Set(paths).size).toBe(paths.length);
  });
  it("localDataFilePaths 31", () => {
    const paths = localDataFilePaths("entries/rules/demo-1.json");
    expect(
      paths.every((value) => value.endsWith("entries/rules/demo-1.json")),
    ).toBe(true);
    expect(new Set(paths).size).toBe(paths.length);
  });
  it("localDataFilePaths 32", () => {
    const paths = localDataFilePaths("entries/rules/demo-2.json");
    expect(
      paths.every((value) => value.endsWith("entries/rules/demo-2.json")),
    ).toBe(true);
    expect(new Set(paths).size).toBe(paths.length);
  });
  it("localDataFilePaths 33", () => {
    const paths = localDataFilePaths("entries/rules/demo-3.json");
    expect(
      paths.every((value) => value.endsWith("entries/rules/demo-3.json")),
    ).toBe(true);
    expect(new Set(paths).size).toBe(paths.length);
  });
  it("localDataFilePaths 34", () => {
    const paths = localDataFilePaths("entries/rules/demo-4.json");
    expect(
      paths.every((value) => value.endsWith("entries/rules/demo-4.json")),
    ).toBe(true);
    expect(new Set(paths).size).toBe(paths.length);
  });
  it("localDataFilePaths 35", () => {
    const paths = localDataFilePaths("entries/rules/demo-5.json");
    expect(
      paths.every((value) => value.endsWith("entries/rules/demo-5.json")),
    ).toBe(true);
    expect(new Set(paths).size).toBe(paths.length);
  });
  it("localDataFilePaths 36", () => {
    const paths = localDataFilePaths("entries/commands/demo-0.json");
    expect(
      paths.every((value) => value.endsWith("entries/commands/demo-0.json")),
    ).toBe(true);
    expect(new Set(paths).size).toBe(paths.length);
  });
  it("localDataFilePaths 37", () => {
    const paths = localDataFilePaths("entries/commands/demo-1.json");
    expect(
      paths.every((value) => value.endsWith("entries/commands/demo-1.json")),
    ).toBe(true);
    expect(new Set(paths).size).toBe(paths.length);
  });
  it("localDataFilePaths 38", () => {
    const paths = localDataFilePaths("entries/commands/demo-2.json");
    expect(
      paths.every((value) => value.endsWith("entries/commands/demo-2.json")),
    ).toBe(true);
    expect(new Set(paths).size).toBe(paths.length);
  });
  it("localDataFilePaths 39", () => {
    const paths = localDataFilePaths("entries/commands/demo-3.json");
    expect(
      paths.every((value) => value.endsWith("entries/commands/demo-3.json")),
    ).toBe(true);
    expect(new Set(paths).size).toBe(paths.length);
  });
  it("localDataFilePaths 40", () => {
    const paths = localDataFilePaths("entries/commands/demo-4.json");
    expect(
      paths.every((value) => value.endsWith("entries/commands/demo-4.json")),
    ).toBe(true);
    expect(new Set(paths).size).toBe(paths.length);
  });
  it("localDataFilePaths 41", () => {
    const paths = localDataFilePaths("entries/commands/demo-5.json");
    expect(
      paths.every((value) => value.endsWith("entries/commands/demo-5.json")),
    ).toBe(true);
    expect(new Set(paths).size).toBe(paths.length);
  });
  it("localDataFilePaths 42", () => {
    const paths = localDataFilePaths("entries/hooks/demo-0.json");
    expect(
      paths.every((value) => value.endsWith("entries/hooks/demo-0.json")),
    ).toBe(true);
    expect(new Set(paths).size).toBe(paths.length);
  });
  it("localDataFilePaths 43", () => {
    const paths = localDataFilePaths("entries/hooks/demo-1.json");
    expect(
      paths.every((value) => value.endsWith("entries/hooks/demo-1.json")),
    ).toBe(true);
    expect(new Set(paths).size).toBe(paths.length);
  });
  it("localDataFilePaths 44", () => {
    const paths = localDataFilePaths("entries/hooks/demo-2.json");
    expect(
      paths.every((value) => value.endsWith("entries/hooks/demo-2.json")),
    ).toBe(true);
    expect(new Set(paths).size).toBe(paths.length);
  });
  it("localDataFilePaths 45", () => {
    const paths = localDataFilePaths("entries/hooks/demo-3.json");
    expect(
      paths.every((value) => value.endsWith("entries/hooks/demo-3.json")),
    ).toBe(true);
    expect(new Set(paths).size).toBe(paths.length);
  });
  it("localDataFilePaths 46", () => {
    const paths = localDataFilePaths("entries/hooks/demo-4.json");
    expect(
      paths.every((value) => value.endsWith("entries/hooks/demo-4.json")),
    ).toBe(true);
    expect(new Set(paths).size).toBe(paths.length);
  });
  it("localDataFilePaths 47", () => {
    const paths = localDataFilePaths("entries/hooks/demo-5.json");
    expect(
      paths.every((value) => value.endsWith("entries/hooks/demo-5.json")),
    ).toBe(true);
    expect(new Set(paths).size).toBe(paths.length);
  });
  it("localDataFilePaths 48", () => {
    const paths = localDataFilePaths("entries/guides/demo-0.json");
    expect(
      paths.every((value) => value.endsWith("entries/guides/demo-0.json")),
    ).toBe(true);
    expect(new Set(paths).size).toBe(paths.length);
  });
  it("localDataFilePaths 49", () => {
    const paths = localDataFilePaths("entries/guides/demo-1.json");
    expect(
      paths.every((value) => value.endsWith("entries/guides/demo-1.json")),
    ).toBe(true);
    expect(new Set(paths).size).toBe(paths.length);
  });
  it("localDataFilePaths 50", () => {
    const paths = localDataFilePaths("entries/guides/demo-2.json");
    expect(
      paths.every((value) => value.endsWith("entries/guides/demo-2.json")),
    ).toBe(true);
    expect(new Set(paths).size).toBe(paths.length);
  });
  it("localDataFilePaths 51", () => {
    const paths = localDataFilePaths("entries/guides/demo-3.json");
    expect(
      paths.every((value) => value.endsWith("entries/guides/demo-3.json")),
    ).toBe(true);
    expect(new Set(paths).size).toBe(paths.length);
  });
  it("localDataFilePaths 52", () => {
    const paths = localDataFilePaths("entries/guides/demo-4.json");
    expect(
      paths.every((value) => value.endsWith("entries/guides/demo-4.json")),
    ).toBe(true);
    expect(new Set(paths).size).toBe(paths.length);
  });
  it("localDataFilePaths 53", () => {
    const paths = localDataFilePaths("entries/guides/demo-5.json");
    expect(
      paths.every((value) => value.endsWith("entries/guides/demo-5.json")),
    ).toBe(true);
    expect(new Set(paths).size).toBe(paths.length);
  });
  it("localDataFilePaths 54", () => {
    const paths = localDataFilePaths("entries/collections/demo-0.json");
    expect(
      paths.every((value) => value.endsWith("entries/collections/demo-0.json")),
    ).toBe(true);
    expect(new Set(paths).size).toBe(paths.length);
  });
  it("localDataFilePaths 55", () => {
    const paths = localDataFilePaths("entries/collections/demo-1.json");
    expect(
      paths.every((value) => value.endsWith("entries/collections/demo-1.json")),
    ).toBe(true);
    expect(new Set(paths).size).toBe(paths.length);
  });
  it("localDataFilePaths 56", () => {
    const paths = localDataFilePaths("entries/collections/demo-2.json");
    expect(
      paths.every((value) => value.endsWith("entries/collections/demo-2.json")),
    ).toBe(true);
    expect(new Set(paths).size).toBe(paths.length);
  });
  it("localDataFilePaths 57", () => {
    const paths = localDataFilePaths("entries/collections/demo-3.json");
    expect(
      paths.every((value) => value.endsWith("entries/collections/demo-3.json")),
    ).toBe(true);
    expect(new Set(paths).size).toBe(paths.length);
  });
  it("localDataFilePaths 58", () => {
    const paths = localDataFilePaths("entries/collections/demo-4.json");
    expect(
      paths.every((value) => value.endsWith("entries/collections/demo-4.json")),
    ).toBe(true);
    expect(new Set(paths).size).toBe(paths.length);
  });
  it("localDataFilePaths 59", () => {
    const paths = localDataFilePaths("entries/collections/demo-5.json");
    expect(
      paths.every((value) => value.endsWith("entries/collections/demo-5.json")),
    ).toBe(true);
    expect(new Set(paths).size).toBe(paths.length);
  });
  it("localDataFilePaths 60", () => {
    const paths = localDataFilePaths("entries/statuslines/demo-0.json");
    expect(
      paths.every((value) => value.endsWith("entries/statuslines/demo-0.json")),
    ).toBe(true);
    expect(new Set(paths).size).toBe(paths.length);
  });
  it("localDataFilePaths 61", () => {
    const paths = localDataFilePaths("entries/statuslines/demo-1.json");
    expect(
      paths.every((value) => value.endsWith("entries/statuslines/demo-1.json")),
    ).toBe(true);
    expect(new Set(paths).size).toBe(paths.length);
  });
  it("localDataFilePaths 62", () => {
    const paths = localDataFilePaths("entries/statuslines/demo-2.json");
    expect(
      paths.every((value) => value.endsWith("entries/statuslines/demo-2.json")),
    ).toBe(true);
    expect(new Set(paths).size).toBe(paths.length);
  });
  it("localDataFilePaths 63", () => {
    const paths = localDataFilePaths("entries/statuslines/demo-3.json");
    expect(
      paths.every((value) => value.endsWith("entries/statuslines/demo-3.json")),
    ).toBe(true);
    expect(new Set(paths).size).toBe(paths.length);
  });
  it("localDataFilePaths 64", () => {
    const paths = localDataFilePaths("entries/statuslines/demo-4.json");
    expect(
      paths.every((value) => value.endsWith("entries/statuslines/demo-4.json")),
    ).toBe(true);
    expect(new Set(paths).size).toBe(paths.length);
  });
  it("localDataFilePaths 65", () => {
    const paths = localDataFilePaths("entries/statuslines/demo-5.json");
    expect(
      paths.every((value) => value.endsWith("entries/statuslines/demo-5.json")),
    ).toBe(true);
    expect(new Set(paths).size).toBe(paths.length);
  });
  it("localDataFilePaths generated 0", () => {
    const fileName = "entries/mcp/generated-0.json";
    expect(localDataFilePaths(fileName)).toHaveLength(2);
  });
  it("localDataFilePaths generated 1", () => {
    const fileName = "entries/mcp/generated-1.json";
    expect(localDataFilePaths(fileName)).toHaveLength(2);
  });
  it("localDataFilePaths generated 2", () => {
    const fileName = "entries/mcp/generated-2.json";
    expect(localDataFilePaths(fileName)).toHaveLength(2);
  });
  it("localDataFilePaths generated 3", () => {
    const fileName = "entries/mcp/generated-3.json";
    expect(localDataFilePaths(fileName)).toHaveLength(2);
  });
  it("localDataFilePaths generated 4", () => {
    const fileName = "entries/mcp/generated-4.json";
    expect(localDataFilePaths(fileName)).toHaveLength(2);
  });
  it("localDataFilePaths generated 5", () => {
    const fileName = "entries/mcp/generated-5.json";
    expect(localDataFilePaths(fileName)).toHaveLength(2);
  });
  it("localDataFilePaths generated 6", () => {
    const fileName = "entries/mcp/generated-6.json";
    expect(localDataFilePaths(fileName)).toHaveLength(2);
  });
  it("localDataFilePaths generated 7", () => {
    const fileName = "entries/mcp/generated-7.json";
    expect(localDataFilePaths(fileName)).toHaveLength(2);
  });
  it("localDataFilePaths generated 8", () => {
    const fileName = "entries/mcp/generated-8.json";
    expect(localDataFilePaths(fileName)).toHaveLength(2);
  });
  it("localDataFilePaths generated 9", () => {
    const fileName = "entries/mcp/generated-9.json";
    expect(localDataFilePaths(fileName)).toHaveLength(2);
  });
  it("localDataFilePaths generated 10", () => {
    const fileName = "entries/mcp/generated-10.json";
    expect(localDataFilePaths(fileName)).toHaveLength(2);
  });
  it("localDataFilePaths generated 11", () => {
    const fileName = "entries/mcp/generated-11.json";
    expect(localDataFilePaths(fileName)).toHaveLength(2);
  });
  it("localDataFilePaths generated 12", () => {
    const fileName = "entries/mcp/generated-12.json";
    expect(localDataFilePaths(fileName)).toHaveLength(2);
  });
  it("localDataFilePaths generated 13", () => {
    const fileName = "entries/mcp/generated-13.json";
    expect(localDataFilePaths(fileName)).toHaveLength(2);
  });
  it("localDataFilePaths generated 14", () => {
    const fileName = "entries/mcp/generated-14.json";
    expect(localDataFilePaths(fileName)).toHaveLength(2);
  });
  it("localDataFilePaths generated 15", () => {
    const fileName = "entries/mcp/generated-15.json";
    expect(localDataFilePaths(fileName)).toHaveLength(2);
  });
  it("localDataFilePaths generated 16", () => {
    const fileName = "entries/mcp/generated-16.json";
    expect(localDataFilePaths(fileName)).toHaveLength(2);
  });
  it("localDataFilePaths generated 17", () => {
    const fileName = "entries/mcp/generated-17.json";
    expect(localDataFilePaths(fileName)).toHaveLength(2);
  });
  it("localDataFilePaths generated 18", () => {
    const fileName = "entries/mcp/generated-18.json";
    expect(localDataFilePaths(fileName)).toHaveLength(2);
  });
  it("localDataFilePaths generated 19", () => {
    const fileName = "entries/mcp/generated-19.json";
    expect(localDataFilePaths(fileName)).toHaveLength(2);
  });
  it("localDataFilePaths generated 20", () => {
    const fileName = "entries/mcp/generated-20.json";
    expect(localDataFilePaths(fileName)).toHaveLength(2);
  });
  it("localDataFilePaths generated 21", () => {
    const fileName = "entries/mcp/generated-21.json";
    expect(localDataFilePaths(fileName)).toHaveLength(2);
  });
  it("localDataFilePaths generated 22", () => {
    const fileName = "entries/mcp/generated-22.json";
    expect(localDataFilePaths(fileName)).toHaveLength(2);
  });
  it("localDataFilePaths generated 23", () => {
    const fileName = "entries/mcp/generated-23.json";
    expect(localDataFilePaths(fileName)).toHaveLength(2);
  });
  it("localDataFilePaths generated 24", () => {
    const fileName = "entries/mcp/generated-24.json";
    expect(localDataFilePaths(fileName)).toHaveLength(2);
  });
  it("localDataFilePaths generated 25", () => {
    const fileName = "entries/mcp/generated-25.json";
    expect(localDataFilePaths(fileName)).toHaveLength(2);
  });
  it("localDataFilePaths generated 26", () => {
    const fileName = "entries/mcp/generated-26.json";
    expect(localDataFilePaths(fileName)).toHaveLength(2);
  });
  it("localDataFilePaths generated 27", () => {
    const fileName = "entries/mcp/generated-27.json";
    expect(localDataFilePaths(fileName)).toHaveLength(2);
  });
  it("localDataFilePaths generated 28", () => {
    const fileName = "entries/mcp/generated-28.json";
    expect(localDataFilePaths(fileName)).toHaveLength(2);
  });
  it("localDataFilePaths generated 29", () => {
    const fileName = "entries/mcp/generated-29.json";
    expect(localDataFilePaths(fileName)).toHaveLength(2);
  });
  it("localDataFilePaths generated 30", () => {
    const fileName = "entries/mcp/generated-30.json";
    expect(localDataFilePaths(fileName)).toHaveLength(2);
  });
  it("localDataFilePaths generated 31", () => {
    const fileName = "entries/mcp/generated-31.json";
    expect(localDataFilePaths(fileName)).toHaveLength(2);
  });
  it("localDataFilePaths generated 32", () => {
    const fileName = "entries/mcp/generated-32.json";
    expect(localDataFilePaths(fileName)).toHaveLength(2);
  });
  it("localDataFilePaths generated 33", () => {
    const fileName = "entries/mcp/generated-33.json";
    expect(localDataFilePaths(fileName)).toHaveLength(2);
  });
  it("localDataFilePaths generated 34", () => {
    const fileName = "entries/mcp/generated-34.json";
    expect(localDataFilePaths(fileName)).toHaveLength(2);
  });
  it("localDataFilePaths generated 35", () => {
    const fileName = "entries/mcp/generated-35.json";
    expect(localDataFilePaths(fileName)).toHaveLength(2);
  });
  it("localDataFilePaths generated 36", () => {
    const fileName = "entries/mcp/generated-36.json";
    expect(localDataFilePaths(fileName)).toHaveLength(2);
  });
  it("localDataFilePaths generated 37", () => {
    const fileName = "entries/mcp/generated-37.json";
    expect(localDataFilePaths(fileName)).toHaveLength(2);
  });
  it("localDataFilePaths generated 38", () => {
    const fileName = "entries/mcp/generated-38.json";
    expect(localDataFilePaths(fileName)).toHaveLength(2);
  });
  it("localDataFilePaths generated 39", () => {
    const fileName = "entries/mcp/generated-39.json";
    expect(localDataFilePaths(fileName)).toHaveLength(2);
  });
});

describe("content-artifact-lib isSafeContentPathPart", () => {
  it("accepts lowercase slug-style path parts", () => {
    expect(isSafeContentPathPart("agents")).toBe(true);
    expect(isSafeContentPathPart("my-slug-1")).toBe(true);
  });
  it("isSafeContentPathPart accepts a", () => {
    expect(isSafeContentPathPart("a")).toBe(true);
  });
  it("isSafeContentPathPart accepts z", () => {
    expect(isSafeContentPathPart("z")).toBe(true);
  });
  it("isSafeContentPathPart accepts 0", () => {
    expect(isSafeContentPathPart("0")).toBe(true);
  });
  it("isSafeContentPathPart accepts 9", () => {
    expect(isSafeContentPathPart("9")).toBe(true);
  });
  it("isSafeContentPathPart accepts a0", () => {
    expect(isSafeContentPathPart("a0")).toBe(true);
  });
  it("isSafeContentPathPart accepts 0a", () => {
    expect(isSafeContentPathPart("0a")).toBe(true);
  });
  it("isSafeContentPathPart accepts a-b", () => {
    expect(isSafeContentPathPart("a-b")).toBe(true);
  });
  it("isSafeContentPathPart accepts b-c-d", () => {
    expect(isSafeContentPathPart("b-c-d")).toBe(true);
  });
  it("isSafeContentPathPart accepts mcp", () => {
    expect(isSafeContentPathPart("mcp")).toBe(true);
  });
  it("isSafeContentPathPart accepts skills", () => {
    expect(isSafeContentPathPart("skills")).toBe(true);
  });
  it("isSafeContentPathPart accepts hooks", () => {
    expect(isSafeContentPathPart("hooks")).toBe(true);
  });
  it("isSafeContentPathPart accepts commands", () => {
    expect(isSafeContentPathPart("commands")).toBe(true);
  });
  it("isSafeContentPathPart accepts statuslines", () => {
    expect(isSafeContentPathPart("statuslines")).toBe(true);
  });
  it("isSafeContentPathPart accepts guides", () => {
    expect(isSafeContentPathPart("guides")).toBe(true);
  });
  it("isSafeContentPathPart accepts plugins", () => {
    expect(isSafeContentPathPart("plugins")).toBe(true);
  });
  it("isSafeContentPathPart accepts agents", () => {
    expect(isSafeContentPathPart("agents")).toBe(true);
  });
  it("isSafeContentPathPart accepts tools", () => {
    expect(isSafeContentPathPart("tools")).toBe(true);
  });
  it("isSafeContentPathPart accepts rules", () => {
    expect(isSafeContentPathPart("rules")).toBe(true);
  });
  it("isSafeContentPathPart accepts collections", () => {
    expect(isSafeContentPathPart("collections")).toBe(true);
  });
  it("isSafeContentPathPart accepts browser-bridge", () => {
    expect(isSafeContentPathPart("browser-bridge")).toBe(true);
  });
  it("isSafeContentPathPart accepts demo-agent", () => {
    expect(isSafeContentPathPart("demo-agent")).toBe(true);
  });
  it("isSafeContentPathPart accepts demo-mcp", () => {
    expect(isSafeContentPathPart("demo-mcp")).toBe(true);
  });
  it("isSafeContentPathPart accepts demo-skills", () => {
    expect(isSafeContentPathPart("demo-skills")).toBe(true);
  });
  it("isSafeContentPathPart accepts demo-hooks", () => {
    expect(isSafeContentPathPart("demo-hooks")).toBe(true);
  });
  it("isSafeContentPathPart accepts demo-commands", () => {
    expect(isSafeContentPathPart("demo-commands")).toBe(true);
  });
  it("isSafeContentPathPart accepts demo-statuslines", () => {
    expect(isSafeContentPathPart("demo-statuslines")).toBe(true);
  });
  it("isSafeContentPathPart accepts demo-guides", () => {
    expect(isSafeContentPathPart("demo-guides")).toBe(true);
  });
  it("isSafeContentPathPart accepts demo-plugins", () => {
    expect(isSafeContentPathPart("demo-plugins")).toBe(true);
  });
  it("isSafeContentPathPart accepts demo-tools", () => {
    expect(isSafeContentPathPart("demo-tools")).toBe(true);
  });
  it("isSafeContentPathPart accepts demo-rules", () => {
    expect(isSafeContentPathPart("demo-rules")).toBe(true);
  });
  it("isSafeContentPathPart accepts demo-collections", () => {
    expect(isSafeContentPathPart("demo-collections")).toBe(true);
  });
  it("isSafeContentPathPart accepts playwright-bridge", () => {
    expect(isSafeContentPathPart("playwright-bridge")).toBe(true);
  });
  it("isSafeContentPathPart accepts git-workflow", () => {
    expect(isSafeContentPathPart("git-workflow")).toBe(true);
  });
  it("isSafeContentPathPart accepts code-review", () => {
    expect(isSafeContentPathPart("code-review")).toBe(true);
  });
  it("isSafeContentPathPart accepts test-runner", () => {
    expect(isSafeContentPathPart("test-runner")).toBe(true);
  });
  it("isSafeContentPathPart accepts lint-fix", () => {
    expect(isSafeContentPathPart("lint-fix")).toBe(true);
  });
  it("isSafeContentPathPart accepts format-code", () => {
    expect(isSafeContentPathPart("format-code")).toBe(true);
  });
  it("isSafeContentPathPart accepts deploy-helper", () => {
    expect(isSafeContentPathPart("deploy-helper")).toBe(true);
  });
  it("isSafeContentPathPart accepts monitor-logs", () => {
    expect(isSafeContentPathPart("monitor-logs")).toBe(true);
  });
  it("isSafeContentPathPart accepts debug-session", () => {
    expect(isSafeContentPathPart("debug-session")).toBe(true);
  });
  it("isSafeContentPathPart accepts profile-perf", () => {
    expect(isSafeContentPathPart("profile-perf")).toBe(true);
  });
  it("isSafeContentPathPart accepts security-scan", () => {
    expect(isSafeContentPathPart("security-scan")).toBe(true);
  });
  it("isSafeContentPathPart accepts dependency-check", () => {
    expect(isSafeContentPathPart("dependency-check")).toBe(true);
  });
  it("isSafeContentPathPart accepts license-audit", () => {
    expect(isSafeContentPathPart("license-audit")).toBe(true);
  });
  it("isSafeContentPathPart accepts changelog-gen", () => {
    expect(isSafeContentPathPart("changelog-gen")).toBe(true);
  });
  it("isSafeContentPathPart accepts readme-gen", () => {
    expect(isSafeContentPathPart("readme-gen")).toBe(true);
  });
  it("isSafeContentPathPart accepts api-docs", () => {
    expect(isSafeContentPathPart("api-docs")).toBe(true);
  });
  it("isSafeContentPathPart accepts schema-gen", () => {
    expect(isSafeContentPathPart("schema-gen")).toBe(true);
  });
  it("isSafeContentPathPart accepts migration-tool", () => {
    expect(isSafeContentPathPart("migration-tool")).toBe(true);
  });
  it("isSafeContentPathPart accepts backup-restore", () => {
    expect(isSafeContentPathPart("backup-restore")).toBe(true);
  });
  it("isSafeContentPathPart accepts cache-clear", () => {
    expect(isSafeContentPathPart("cache-clear")).toBe(true);
  });
  it("isSafeContentPathPart accepts config-sync", () => {
    expect(isSafeContentPathPart("config-sync")).toBe(true);
  });
  it("isSafeContentPathPart accepts env-manager", () => {
    expect(isSafeContentPathPart("env-manager")).toBe(true);
  });
  it("isSafeContentPathPart accepts secret-rotate", () => {
    expect(isSafeContentPathPart("secret-rotate")).toBe(true);
  });
  it("isSafeContentPathPart accepts token-refresh", () => {
    expect(isSafeContentPathPart("token-refresh")).toBe(true);
  });
  it("isSafeContentPathPart accepts oauth-flow", () => {
    expect(isSafeContentPathPart("oauth-flow")).toBe(true);
  });
  it("isSafeContentPathPart accepts webhook-relay", () => {
    expect(isSafeContentPathPart("webhook-relay")).toBe(true);
  });
  it("isSafeContentPathPart accepts queue-worker", () => {
    expect(isSafeContentPathPart("queue-worker")).toBe(true);
  });
  it("isSafeContentPathPart accepts batch-processor", () => {
    expect(isSafeContentPathPart("batch-processor")).toBe(true);
  });
  it("isSafeContentPathPart accepts stream-handler", () => {
    expect(isSafeContentPathPart("stream-handler")).toBe(true);
  });
  it("isSafeContentPathPart accepts event-bus", () => {
    expect(isSafeContentPathPart("event-bus")).toBe(true);
  });
  it("isSafeContentPathPart accepts state-machine", () => {
    expect(isSafeContentPathPart("state-machine")).toBe(true);
  });
  it("isSafeContentPathPart accepts workflow-engine", () => {
    expect(isSafeContentPathPart("workflow-engine")).toBe(true);
  });
  it("isSafeContentPathPart accepts task-scheduler", () => {
    expect(isSafeContentPathPart("task-scheduler")).toBe(true);
  });
  it("isSafeContentPathPart accepts cron-runner", () => {
    expect(isSafeContentPathPart("cron-runner")).toBe(true);
  });
  it("isSafeContentPathPart accepts health-check", () => {
    expect(isSafeContentPathPart("health-check")).toBe(true);
  });
  it("isSafeContentPathPart accepts metrics-collector", () => {
    expect(isSafeContentPathPart("metrics-collector")).toBe(true);
  });
  it("isSafeContentPathPart accepts trace-exporter", () => {
    expect(isSafeContentPathPart("trace-exporter")).toBe(true);
  });
  it("isSafeContentPathPart accepts log-aggregator", () => {
    expect(isSafeContentPathPart("log-aggregator")).toBe(true);
  });
  it("isSafeContentPathPart accepts alert-router", () => {
    expect(isSafeContentPathPart("alert-router")).toBe(true);
  });
  it("isSafeContentPathPart accepts incident-bot", () => {
    expect(isSafeContentPathPart("incident-bot")).toBe(true);
  });
  it("isSafeContentPathPart accepts oncall-helper", () => {
    expect(isSafeContentPathPart("oncall-helper")).toBe(true);
  });
  it("isSafeContentPathPart accepts runbook-gen", () => {
    expect(isSafeContentPathPart("runbook-gen")).toBe(true);
  });
  it("isSafeContentPathPart accepts postmortem-writer", () => {
    expect(isSafeContentPathPart("postmortem-writer")).toBe(true);
  });
  it("isSafeContentPathPart accepts slo-tracker", () => {
    expect(isSafeContentPathPart("slo-tracker")).toBe(true);
  });
  it("isSafeContentPathPart accepts error-budget", () => {
    expect(isSafeContentPathPart("error-budget")).toBe(true);
  });
  it("isSafeContentPathPart accepts capacity-plan", () => {
    expect(isSafeContentPathPart("capacity-plan")).toBe(true);
  });
  it("isSafeContentPathPart accepts cost-analyzer", () => {
    expect(isSafeContentPathPart("cost-analyzer")).toBe(true);
  });
  it("isSafeContentPathPart accepts usage-report", () => {
    expect(isSafeContentPathPart("usage-report")).toBe(true);
  });
  it("isSafeContentPathPart accepts billing-sync", () => {
    expect(isSafeContentPathPart("billing-sync")).toBe(true);
  });
  it("isSafeContentPathPart accepts invoice-gen", () => {
    expect(isSafeContentPathPart("invoice-gen")).toBe(true);
  });
  it("isSafeContentPathPart accepts tax-calculator", () => {
    expect(isSafeContentPathPart("tax-calculator")).toBe(true);
  });
  it("isSafeContentPathPart accepts currency-convert", () => {
    expect(isSafeContentPathPart("currency-convert")).toBe(true);
  });
  it("isSafeContentPathPart accepts locale-detect", () => {
    expect(isSafeContentPathPart("locale-detect")).toBe(true);
  });
  it("isSafeContentPathPart accepts timezone-map", () => {
    expect(isSafeContentPathPart("timezone-map")).toBe(true);
  });
  it("isSafeContentPathPart accepts calendar-sync", () => {
    expect(isSafeContentPathPart("calendar-sync")).toBe(true);
  });
  it("isSafeContentPathPart accepts meeting-notes", () => {
    expect(isSafeContentPathPart("meeting-notes")).toBe(true);
  });
  it("isSafeContentPathPart accepts standup-bot", () => {
    expect(isSafeContentPathPart("standup-bot")).toBe(true);
  });
  it("isSafeContentPathPart accepts retro-facilitator", () => {
    expect(isSafeContentPathPart("retro-facilitator")).toBe(true);
  });
  it("isSafeContentPathPart accepts sprint-planner", () => {
    expect(isSafeContentPathPart("sprint-planner")).toBe(true);
  });
  it("isSafeContentPathPart accepts backlog-groom", () => {
    expect(isSafeContentPathPart("backlog-groom")).toBe(true);
  });
  it("isSafeContentPathPart accepts story-splitter", () => {
    expect(isSafeContentPathPart("story-splitter")).toBe(true);
  });
  it("isSafeContentPathPart accepts acceptance-criteria", () => {
    expect(isSafeContentPathPart("acceptance-criteria")).toBe(true);
  });
  it("isSafeContentPathPart accepts test-case-gen", () => {
    expect(isSafeContentPathPart("test-case-gen")).toBe(true);
  });
  it("isSafeContentPathPart accepts bug-triage", () => {
    expect(isSafeContentPathPart("bug-triage")).toBe(true);
  });
  it("isSafeContentPathPart accepts regression-suite", () => {
    expect(isSafeContentPathPart("regression-suite")).toBe(true);
  });
  it("isSafeContentPathPart accepts smoke-test", () => {
    expect(isSafeContentPathPart("smoke-test")).toBe(true);
  });
  it("isSafeContentPathPart accepts load-test", () => {
    expect(isSafeContentPathPart("load-test")).toBe(true);
  });
  it("isSafeContentPathPart accepts stress-test", () => {
    expect(isSafeContentPathPart("stress-test")).toBe(true);
  });
  it("isSafeContentPathPart accepts chaos-monkey", () => {
    expect(isSafeContentPathPart("chaos-monkey")).toBe(true);
  });
  it("isSafeContentPathPart accepts failover-test", () => {
    expect(isSafeContentPathPart("failover-test")).toBe(true);
  });
  it("isSafeContentPathPart accepts disaster-recovery", () => {
    expect(isSafeContentPathPart("disaster-recovery")).toBe(true);
  });
  it("isSafeContentPathPart accepts backup-verify", () => {
    expect(isSafeContentPathPart("backup-verify")).toBe(true);
  });
  it("isSafeContentPathPart accepts restore-test", () => {
    expect(isSafeContentPathPart("restore-test")).toBe(true);
  });
  it("isSafeContentPathPart accepts data-migration", () => {
    expect(isSafeContentPathPart("data-migration")).toBe(true);
  });
  it("isSafeContentPathPart accepts schema-migrate", () => {
    expect(isSafeContentPathPart("schema-migrate")).toBe(true);
  });
  it("isSafeContentPathPart accepts index-rebuild", () => {
    expect(isSafeContentPathPart("index-rebuild")).toBe(true);
  });
  it("isSafeContentPathPart accepts cache-warm", () => {
    expect(isSafeContentPathPart("cache-warm")).toBe(true);
  });
  it("isSafeContentPathPart accepts cdn-purge", () => {
    expect(isSafeContentPathPart("cdn-purge")).toBe(true);
  });
  it("isSafeContentPathPart accepts dns-update", () => {
    expect(isSafeContentPathPart("dns-update")).toBe(true);
  });
  it("isSafeContentPathPart accepts cert-renew", () => {
    expect(isSafeContentPathPart("cert-renew")).toBe(true);
  });
  it("isSafeContentPathPart accepts ssl-check", () => {
    expect(isSafeContentPathPart("ssl-check")).toBe(true);
  });
  it("isSafeContentPathPart accepts tls-scan", () => {
    expect(isSafeContentPathPart("tls-scan")).toBe(true);
  });
  it("isSafeContentPathPart accepts vuln-scan", () => {
    expect(isSafeContentPathPart("vuln-scan")).toBe(true);
  });
  it("isSafeContentPathPart accepts pen-test", () => {
    expect(isSafeContentPathPart("pen-test")).toBe(true);
  });
  it("isSafeContentPathPart accepts compliance-check", () => {
    expect(isSafeContentPathPart("compliance-check")).toBe(true);
  });
  it("isSafeContentPathPart accepts audit-trail", () => {
    expect(isSafeContentPathPart("audit-trail")).toBe(true);
  });
  it("isSafeContentPathPart accepts access-review", () => {
    expect(isSafeContentPathPart("access-review")).toBe(true);
  });
  it("isSafeContentPathPart accepts permission-audit", () => {
    expect(isSafeContentPathPart("permission-audit")).toBe(true);
  });
  it("isSafeContentPathPart accepts role-manager", () => {
    expect(isSafeContentPathPart("role-manager")).toBe(true);
  });
  it("isSafeContentPathPart accepts policy-enforcer", () => {
    expect(isSafeContentPathPart("policy-enforcer")).toBe(true);
  });
  it("isSafeContentPathPart accepts guardrail-check", () => {
    expect(isSafeContentPathPart("guardrail-check")).toBe(true);
  });
  it("isSafeContentPathPart accepts content-filter", () => {
    expect(isSafeContentPathPart("content-filter")).toBe(true);
  });
  it("isSafeContentPathPart accepts spam-detect", () => {
    expect(isSafeContentPathPart("spam-detect")).toBe(true);
  });
  it("isSafeContentPathPart accepts abuse-report", () => {
    expect(isSafeContentPathPart("abuse-report")).toBe(true);
  });
  it("isSafeContentPathPart accepts moderation-queue", () => {
    expect(isSafeContentPathPart("moderation-queue")).toBe(true);
  });
  it("isSafeContentPathPart accepts appeal-handler", () => {
    expect(isSafeContentPathPart("appeal-handler")).toBe(true);
  });
  it("isSafeContentPathPart accepts trust-score", () => {
    expect(isSafeContentPathPart("trust-score")).toBe(true);
  });
  it("isSafeContentPathPart accepts reputation-calc", () => {
    expect(isSafeContentPathPart("reputation-calc")).toBe(true);
  });
  it("isSafeContentPathPart accepts fraud-detect", () => {
    expect(isSafeContentPathPart("fraud-detect")).toBe(true);
  });
  it("isSafeContentPathPart accepts anomaly-detect", () => {
    expect(isSafeContentPathPart("anomaly-detect")).toBe(true);
  });
  it("isSafeContentPathPart accepts outlier-find", () => {
    expect(isSafeContentPathPart("outlier-find")).toBe(true);
  });
  it("isSafeContentPathPart accepts cluster-analyze", () => {
    expect(isSafeContentPathPart("cluster-analyze")).toBe(true);
  });
  it("isSafeContentPathPart accepts trend-detect", () => {
    expect(isSafeContentPathPart("trend-detect")).toBe(true);
  });
  it("isSafeContentPathPart accepts forecast-model", () => {
    expect(isSafeContentPathPart("forecast-model")).toBe(true);
  });
  it("isSafeContentPathPart accepts seasonality-adjust", () => {
    expect(isSafeContentPathPart("seasonality-adjust")).toBe(true);
  });
  it("isSafeContentPathPart accepts anomaly-alert", () => {
    expect(isSafeContentPathPart("anomaly-alert")).toBe(true);
  });
  it("isSafeContentPathPart accepts threshold-tune", () => {
    expect(isSafeContentPathPart("threshold-tune")).toBe(true);
  });
  it("isSafeContentPathPart accepts baseline-calc", () => {
    expect(isSafeContentPathPart("baseline-calc")).toBe(true);
  });
  it("isSafeContentPathPart accepts benchmark-run", () => {
    expect(isSafeContentPathPart("benchmark-run")).toBe(true);
  });
  it("isSafeContentPathPart accepts compare-versions", () => {
    expect(isSafeContentPathPart("compare-versions")).toBe(true);
  });
  it("isSafeContentPathPart accepts diff-analyzer", () => {
    expect(isSafeContentPathPart("diff-analyzer")).toBe(true);
  });
  it("isSafeContentPathPart accepts merge-conflict", () => {
    expect(isSafeContentPathPart("merge-conflict")).toBe(true);
  });
  it("isSafeContentPathPart accepts branch-strategy", () => {
    expect(isSafeContentPathPart("branch-strategy")).toBe(true);
  });
  it("isSafeContentPathPart accepts release-notes", () => {
    expect(isSafeContentPathPart("release-notes")).toBe(true);
  });
  it("isSafeContentPathPart accepts version-bump", () => {
    expect(isSafeContentPathPart("version-bump")).toBe(true);
  });
  it("isSafeContentPathPart accepts semver-check", () => {
    expect(isSafeContentPathPart("semver-check")).toBe(true);
  });
  it("isSafeContentPathPart accepts dep-update", () => {
    expect(isSafeContentPathPart("dep-update")).toBe(true);
  });
  it("isSafeContentPathPart accepts dep-audit", () => {
    expect(isSafeContentPathPart("dep-audit")).toBe(true);
  });
  it("isSafeContentPathPart accepts dep-graph", () => {
    expect(isSafeContentPathPart("dep-graph")).toBe(true);
  });
  it("isSafeContentPathPart accepts license-check", () => {
    expect(isSafeContentPathPart("license-check")).toBe(true);
  });
  it("isSafeContentPathPart accepts sbom-gen", () => {
    expect(isSafeContentPathPart("sbom-gen")).toBe(true);
  });
  it("isSafeContentPathPart accepts provenance-verify", () => {
    expect(isSafeContentPathPart("provenance-verify")).toBe(true);
  });
  it("isSafeContentPathPart accepts signature-check", () => {
    expect(isSafeContentPathPart("signature-check")).toBe(true);
  });
  it("isSafeContentPathPart accepts checksum-verify", () => {
    expect(isSafeContentPathPart("checksum-verify")).toBe(true);
  });
  it("isSafeContentPathPart accepts hash-compare", () => {
    expect(isSafeContentPathPart("hash-compare")).toBe(true);
  });
  it("isSafeContentPathPart accepts integrity-check", () => {
    expect(isSafeContentPathPart("integrity-check")).toBe(true);
  });
  it("isSafeContentPathPart accepts tamper-detect", () => {
    expect(isSafeContentPathPart("tamper-detect")).toBe(true);
  });
  it("isSafeContentPathPart accepts replay-attack", () => {
    expect(isSafeContentPathPart("replay-attack")).toBe(true);
  });
  it("isSafeContentPathPart accepts nonce-gen", () => {
    expect(isSafeContentPathPart("nonce-gen")).toBe(true);
  });
  it("isSafeContentPathPart accepts token-sign", () => {
    expect(isSafeContentPathPart("token-sign")).toBe(true);
  });
  it("isSafeContentPathPart accepts jwt-verify", () => {
    expect(isSafeContentPathPart("jwt-verify")).toBe(true);
  });
  it("isSafeContentPathPart accepts oauth-verify", () => {
    expect(isSafeContentPathPart("oauth-verify")).toBe(true);
  });
  it("isSafeContentPathPart accepts saml-parse", () => {
    expect(isSafeContentPathPart("saml-parse")).toBe(true);
  });
  it("isSafeContentPathPart accepts ldap-sync", () => {
    expect(isSafeContentPathPart("ldap-sync")).toBe(true);
  });
  it("isSafeContentPathPart accepts sso-config", () => {
    expect(isSafeContentPathPart("sso-config")).toBe(true);
  });
  it("isSafeContentPathPart accepts mfa-enroll", () => {
    expect(isSafeContentPathPart("mfa-enroll")).toBe(true);
  });
  it("isSafeContentPathPart accepts passkey-setup", () => {
    expect(isSafeContentPathPart("passkey-setup")).toBe(true);
  });
  it("isSafeContentPathPart accepts recovery-codes", () => {
    expect(isSafeContentPathPart("recovery-codes")).toBe(true);
  });
  it("isSafeContentPathPart accepts session-revoke", () => {
    expect(isSafeContentPathPart("session-revoke")).toBe(true);
  });
  it("isSafeContentPathPart accepts device-trust", () => {
    expect(isSafeContentPathPart("device-trust")).toBe(true);
  });
  it("isSafeContentPathPart accepts geo-fence", () => {
    expect(isSafeContentPathPart("geo-fence")).toBe(true);
  });
  it("isSafeContentPathPart accepts ip-allowlist", () => {
    expect(isSafeContentPathPart("ip-allowlist")).toBe(true);
  });
  it("isSafeContentPathPart accepts rate-limit", () => {
    expect(isSafeContentPathPart("rate-limit")).toBe(true);
  });
  it("isSafeContentPathPart accepts quota-enforce", () => {
    expect(isSafeContentPathPart("quota-enforce")).toBe(true);
  });
  it("isSafeContentPathPart accepts throttle-api", () => {
    expect(isSafeContentPathPart("throttle-api")).toBe(true);
  });
  it("isSafeContentPathPart accepts circuit-break", () => {
    expect(isSafeContentPathPart("circuit-break")).toBe(true);
  });
  it("isSafeContentPathPart accepts retry-policy", () => {
    expect(isSafeContentPathPart("retry-policy")).toBe(true);
  });
  it("isSafeContentPathPart accepts backoff-calc", () => {
    expect(isSafeContentPathPart("backoff-calc")).toBe(true);
  });
  it("isSafeContentPathPart accepts timeout-set", () => {
    expect(isSafeContentPathPart("timeout-set")).toBe(true);
  });
  it("isSafeContentPathPart accepts deadline-enforce", () => {
    expect(isSafeContentPathPart("deadline-enforce")).toBe(true);
  });
  it("isSafeContentPathPart accepts priority-queue", () => {
    expect(isSafeContentPathPart("priority-queue")).toBe(true);
  });
  it("isSafeContentPathPart accepts fair-scheduler", () => {
    expect(isSafeContentPathPart("fair-scheduler")).toBe(true);
  });
  it("isSafeContentPathPart accepts work-steal", () => {
    expect(isSafeContentPathPart("work-steal")).toBe(true);
  });
  it("isSafeContentPathPart accepts pool-resize", () => {
    expect(isSafeContentPathPart("pool-resize")).toBe(true);
  });
  it("isSafeContentPathPart accepts auto-scale", () => {
    expect(isSafeContentPathPart("auto-scale")).toBe(true);
  });
  it("isSafeContentPathPart accepts scale-down", () => {
    expect(isSafeContentPathPart("scale-down")).toBe(true);
  });
  it("isSafeContentPathPart accepts scale-up", () => {
    expect(isSafeContentPathPart("scale-up")).toBe(true);
  });
  it("isSafeContentPathPart accepts warm-pool", () => {
    expect(isSafeContentPathPart("warm-pool")).toBe(true);
  });
  it("isSafeContentPathPart accepts cold-start", () => {
    expect(isSafeContentPathPart("cold-start")).toBe(true);
  });
  it("isSafeContentPathPart accepts prewarm-cache", () => {
    expect(isSafeContentPathPart("prewarm-cache")).toBe(true);
  });
  it("isSafeContentPathPart accepts lazy-load", () => {
    expect(isSafeContentPathPart("lazy-load")).toBe(true);
  });
  it("isSafeContentPathPart accepts eager-load", () => {
    expect(isSafeContentPathPart("eager-load")).toBe(true);
  });
  it("isSafeContentPathPart accepts prefetch-data", () => {
    expect(isSafeContentPathPart("prefetch-data")).toBe(true);
  });
  it("isSafeContentPathPart accepts batch-fetch", () => {
    expect(isSafeContentPathPart("batch-fetch")).toBe(true);
  });
  it("isSafeContentPathPart accepts parallel-map", () => {
    expect(isSafeContentPathPart("parallel-map")).toBe(true);
  });
  it("isSafeContentPathPart accepts reduce-aggregate", () => {
    expect(isSafeContentPathPart("reduce-aggregate")).toBe(true);
  });
  it("isSafeContentPathPart accepts filter-stream", () => {
    expect(isSafeContentPathPart("filter-stream")).toBe(true);
  });
  it("isSafeContentPathPart accepts transform-pipe", () => {
    expect(isSafeContentPathPart("transform-pipe")).toBe(true);
  });
  it("isSafeContentPathPart accepts validate-schema", () => {
    expect(isSafeContentPathPart("validate-schema")).toBe(true);
  });
  it("isSafeContentPathPart accepts sanitize-input", () => {
    expect(isSafeContentPathPart("sanitize-input")).toBe(true);
  });
  it("isSafeContentPathPart accepts escape-output", () => {
    expect(isSafeContentPathPart("escape-output")).toBe(true);
  });
  it("isSafeContentPathPart accepts encode-url", () => {
    expect(isSafeContentPathPart("encode-url")).toBe(true);
  });
  it("isSafeContentPathPart accepts decode-base64", () => {
    expect(isSafeContentPathPart("decode-base64")).toBe(true);
  });
  it("isSafeContentPathPart accepts compress-gzip", () => {
    expect(isSafeContentPathPart("compress-gzip")).toBe(true);
  });
  it("isSafeContentPathPart accepts decompress-zstd", () => {
    expect(isSafeContentPathPart("decompress-zstd")).toBe(true);
  });
  it("isSafeContentPathPart accepts encrypt-aes", () => {
    expect(isSafeContentPathPart("encrypt-aes")).toBe(true);
  });
  it("isSafeContentPathPart accepts decrypt-aes", () => {
    expect(isSafeContentPathPart("decrypt-aes")).toBe(true);
  });
  it("isSafeContentPathPart accepts key-rotate", () => {
    expect(isSafeContentPathPart("key-rotate")).toBe(true);
  });
  it("isSafeContentPathPart accepts secret-store", () => {
    expect(isSafeContentPathPart("secret-store")).toBe(true);
  });
  it("isSafeContentPathPart accepts vault-read", () => {
    expect(isSafeContentPathPart("vault-read")).toBe(true);
  });
  it("isSafeContentPathPart accepts kms-encrypt", () => {
    expect(isSafeContentPathPart("kms-encrypt")).toBe(true);
  });
  it("isSafeContentPathPart accepts hsm-sign", () => {
    expect(isSafeContentPathPart("hsm-sign")).toBe(true);
  });
  it("isSafeContentPathPart rejects empty", () => {
    expect(isSafeContentPathPart("")).toBe(false);
  });
  it("isSafeContentPathPart rejects .", () => {
    expect(isSafeContentPathPart(".")).toBe(false);
  });
  it("isSafeContentPathPart rejects ..", () => {
    expect(isSafeContentPathPart("..")).toBe(false);
  });
  it("isSafeContentPathPart rejects foo/../bar", () => {
    expect(isSafeContentPathPart("foo/../bar")).toBe(false);
  });
  it("isSafeContentPathPart rejects ../secret", () => {
    expect(isSafeContentPathPart("../secret")).toBe(false);
  });
  it("isSafeContentPathPart rejects foo/..", () => {
    expect(isSafeContentPathPart("foo/..")).toBe(false);
  });
  it("isSafeContentPathPart rejects foo/./bar", () => {
    expect(isSafeContentPathPart("foo/./bar")).toBe(false);
  });
  it("isSafeContentPathPart rejects foo//bar", () => {
    expect(isSafeContentPathPart("foo//bar")).toBe(false);
  });
  it("isSafeContentPathPart rejects /absolute", () => {
    expect(isSafeContentPathPart("/absolute")).toBe(false);
  });
  it("isSafeContentPathPart rejects UPPER", () => {
    expect(isSafeContentPathPart("UPPER")).toBe(false);
  });
  it("isSafeContentPathPart rejects under_score", () => {
    expect(isSafeContentPathPart("under_score")).toBe(false);
  });
  it("isSafeContentPathPart rejects dot.name", () => {
    expect(isSafeContentPathPart("dot.name")).toBe(false);
  });
  it("isSafeContentPathPart rejects space name", () => {
    expect(isSafeContentPathPart("space name")).toBe(false);
  });
  it("isSafeContentPathPart rejects tab?name", () => {
    expect(isSafeContentPathPart("tab\tname")).toBe(false);
  });
  it("isSafeContentPathPart rejects emoji-??", () => {
    expect(isSafeContentPathPart("emoji-🔥")).toBe(false);
  });
  it("isSafeContentPathPart rejects percent%20", () => {
    expect(isSafeContentPathPart("percent%20")).toBe(false);
  });
  it("isSafeContentPathPart rejects plus+sign", () => {
    expect(isSafeContentPathPart("plus+sign")).toBe(false);
  });
  it("isSafeContentPathPart rejects at@sign", () => {
    expect(isSafeContentPathPart("at@sign")).toBe(false);
  });
  it("isSafeContentPathPart rejects colon:part", () => {
    expect(isSafeContentPathPart("colon:part")).toBe(false);
  });
  it("isSafeContentPathPart rejects semi;colon", () => {
    expect(isSafeContentPathPart("semi;colon")).toBe(false);
  });
  it("isSafeContentPathPart rejects comma,part", () => {
    expect(isSafeContentPathPart("comma,part")).toBe(false);
  });
  it("isSafeContentPathPart rejects question?mark", () => {
    expect(isSafeContentPathPart("question?mark")).toBe(false);
  });
  it("isSafeContentPathPart rejects star*wild", () => {
    expect(isSafeContentPathPart("star*wild")).toBe(false);
  });
  it("isSafeContentPathPart rejects paren(test)", () => {
    expect(isSafeContentPathPart("paren(test)")).toBe(false);
  });
  it("isSafeContentPathPart rejects bracket[test]", () => {
    expect(isSafeContentPathPart("bracket[test]")).toBe(false);
  });
  it("isSafeContentPathPart rejects brace{test}", () => {
    expect(isSafeContentPathPart("brace{test}")).toBe(false);
  });
  it("isSafeContentPathPart rejects quote'test", () => {
    expect(isSafeContentPathPart("quote'test")).toBe(false);
  });
  it('isSafeContentPathPart rejects quote"test', () => {
    expect(isSafeContentPathPart('quote"test')).toBe(false);
  });
  it("isSafeContentPathPart rejects back\\slash", () => {
    expect(isSafeContentPathPart("back\\slash")).toBe(false);
  });
  it("isSafeContentPathPart rejects pipe|test", () => {
    expect(isSafeContentPathPart("pipe|test")).toBe(false);
  });
  it("isSafeContentPathPart rejects tilde~test", () => {
    expect(isSafeContentPathPart("tilde~test")).toBe(false);
  });
  it("isSafeContentPathPart rejects caret^test", () => {
    expect(isSafeContentPathPart("caret^test")).toBe(false);
  });
  it("isSafeContentPathPart rejects dollar$test", () => {
    expect(isSafeContentPathPart("dollar$test")).toBe(false);
  });
  it("isSafeContentPathPart rejects hash#test", () => {
    expect(isSafeContentPathPart("hash#test")).toBe(false);
  });
  it("isSafeContentPathPart rejects ampersand&test", () => {
    expect(isSafeContentPathPart("ampersand&test")).toBe(false);
  });
  it("isSafeContentPathPart rejects equals=test", () => {
    expect(isSafeContentPathPart("equals=test")).toBe(false);
  });
  it("isSafeContentPathPart rejects null\0byte", () => {
    expect(isSafeContentPathPart("null\u0000byte")).toBe(false);
  });
  it("isSafeContentPathPart rejects newline\npart", () => {
    expect(isSafeContentPathPart("newline\npart")).toBe(false);
  });
  it("isSafeContentPathPart rejects carriage\rpart", () => {
    expect(isSafeContentPathPart("carriage\rpart")).toBe(false);
  });
  it("isSafeContentPathPart rejects unicode-caf?", () => {
    expect(isSafeContentPathPart("unicode-café")).toBe(false);
  });
  it("isSafeContentPathPart rejects cyrillic-????", () => {
    expect(isSafeContentPathPart("cyrillic-тест")).toBe(false);
  });
  it("isSafeContentPathPart rejects chinese-??", () => {
    expect(isSafeContentPathPart("chinese-测试")).toBe(false);
  });
  it("isSafeContentPathPart rejects japanese-???", () => {
    expect(isSafeContentPathPart("japanese-テスト")).toBe(false);
  });
  it("isSafeContentPathPart rejects arabic-??????", () => {
    expect(isSafeContentPathPart("arabic-اختبار")).toBe(false);
  });
  it("isSafeContentPathPart rejects hebrew-?????", () => {
    expect(isSafeContentPathPart("hebrew-בדיקה")).toBe(false);
  });
  it("isSafeContentPathPart rejects thai-???ob", () => {
    expect(isSafeContentPathPart("thai-ทดสob")).toBe(false);
  });
  it("isSafeContentPathPart rejects korean-???", () => {
    expect(isSafeContentPathPart("korean-테스트")).toBe(false);
  });
  it("isSafeContentPathPart rejects greek-??????", () => {
    expect(isSafeContentPathPart("greek-δοκιμή")).toBe(false);
  });
  it("isSafeContentPathPart rejects mixed-Abc123", () => {
    expect(isSafeContentPathPart("mixed-Abc123")).toBe(false);
  });
  it("isSafeContentPathPart rejects valid-start-invalid-end!", () => {
    expect(isSafeContentPathPart("valid-start-invalid-end!")).toBe(false);
  });
  it("isSafeContentPathPart rejects !invalid-start-valid-end", () => {
    expect(isSafeContentPathPart("!invalid-start-valid-end")).toBe(false);
  });
  it("isSafeContentPathPart rejects path/with/slash", () => {
    expect(isSafeContentPathPart("path/with/slash")).toBe(false);
  });
  it("isSafeContentPathPart rejects path\\with\\backslash", () => {
    expect(isSafeContentPathPart("path\\with\\backslash")).toBe(false);
  });
  it("isSafeContentPathPart rejects NaN", () => {
    expect(isSafeContentPathPart("NaN")).toBe(false);
  });
  it("isSafeContentPathPart rejects 3.14", () => {
    expect(isSafeContentPathPart("3.14")).toBe(false);
  });
  it("isSafeContentPathPart rejects Infinity", () => {
    expect(isSafeContentPathPart("Infinity")).toBe(false);
  });
  it("isSafeContentPathPart rejects -Infinity", () => {
    expect(isSafeContentPathPart("-Infinity")).toBe(false);
  });
  it("isSafeContentPathPart rejects []", () => {
    expect(isSafeContentPathPart("[]")).toBe(false);
  });
  it("isSafeContentPathPart rejects {}", () => {
    expect(isSafeContentPathPart("{}")).toBe(false);
  });
  it("isSafeContentPathPart rejects []foo", () => {
    expect(isSafeContentPathPart("[]foo")).toBe(false);
  });
  it("isSafeContentPathPart rejects foo[]", () => {
    expect(isSafeContentPathPart("foo[]")).toBe(false);
  });
  it("isSafeContentPathPart rejects <script>", () => {
    expect(isSafeContentPathPart("<script>")).toBe(false);
  });
  it("isSafeContentPathPart rejects </script>", () => {
    expect(isSafeContentPathPart("</script>")).toBe(false);
  });
  it("isSafeContentPathPart rejects javascript:alert(1)", () => {
    expect(isSafeContentPathPart("javascript:alert(1)")).toBe(false);
  });
  it("isSafeContentPathPart rejects data:text/html", () => {
    expect(isSafeContentPathPart("data:text/html")).toBe(false);
  });
  it("isSafeContentPathPart rejects file:///etc/passwd", () => {
    expect(isSafeContentPathPart("file:///etc/passwd")).toBe(false);
  });
  it("isSafeContentPathPart rejects http://evil.com", () => {
    expect(isSafeContentPathPart("http://evil.com")).toBe(false);
  });
  it("isSafeContentPathPart rejects https://evil.com", () => {
    expect(isSafeContentPathPart("https://evil.com")).toBe(false);
  });
  it("isSafeContentPathPart rejects ftp://evil.com", () => {
    expect(isSafeContentPathPart("ftp://evil.com")).toBe(false);
  });
  it("isSafeContentPathPart rejects ssh://evil.com", () => {
    expect(isSafeContentPathPart("ssh://evil.com")).toBe(false);
  });
  it("isSafeContentPathPart rejects git+ssh://evil.com", () => {
    expect(isSafeContentPathPart("git+ssh://evil.com")).toBe(false);
  });
  it("isSafeContentPathPart rejects npm:@scope/pkg", () => {
    expect(isSafeContentPathPart("npm:@scope/pkg")).toBe(false);
  });
  it("isSafeContentPathPart rejects scoped@pkg", () => {
    expect(isSafeContentPathPart("scoped@pkg")).toBe(false);
  });
  it("isSafeContentPathPart rejects pkg@1.0.0", () => {
    expect(isSafeContentPathPart("pkg@1.0.0")).toBe(false);
  });
  it("isSafeContentPathPart rejects pkg@latest", () => {
    expect(isSafeContentPathPart("pkg@latest")).toBe(false);
  });
  it("isSafeContentPathPart rejects pkg@^1.0.0", () => {
    expect(isSafeContentPathPart("pkg@^1.0.0")).toBe(false);
  });
  it("isSafeContentPathPart rejects pkg@~1.0.0", () => {
    expect(isSafeContentPathPart("pkg@~1.0.0")).toBe(false);
  });
  it("isSafeContentPathPart rejects pkg@>=1.0.0", () => {
    expect(isSafeContentPathPart("pkg@>=1.0.0")).toBe(false);
  });
  it("isSafeContentPathPart rejects pkg@<=1.0.0", () => {
    expect(isSafeContentPathPart("pkg@<=1.0.0")).toBe(false);
  });
  it("isSafeContentPathPart rejects pkg@>1.0.0", () => {
    expect(isSafeContentPathPart("pkg@>1.0.0")).toBe(false);
  });
  it("isSafeContentPathPart rejects pkg@<1.0.0", () => {
    expect(isSafeContentPathPart("pkg@<1.0.0")).toBe(false);
  });
  it("isSafeContentPathPart rejects pkg@!=1.0.0", () => {
    expect(isSafeContentPathPart("pkg@!=1.0.0")).toBe(false);
  });
  it("isSafeContentPathPart rejects pkg@1.0.0-beta.1", () => {
    expect(isSafeContentPathPart("pkg@1.0.0-beta.1")).toBe(false);
  });
  it("isSafeContentPathPart rejects pkg@1.0.0-alpha.1", () => {
    expect(isSafeContentPathPart("pkg@1.0.0-alpha.1")).toBe(false);
  });
  it("isSafeContentPathPart rejects pkg@1.0.0-rc.1", () => {
    expect(isSafeContentPathPart("pkg@1.0.0-rc.1")).toBe(false);
  });
  it("isSafeContentPathPart rejects pkg@1.0.0+build.1", () => {
    expect(isSafeContentPathPart("pkg@1.0.0+build.1")).toBe(false);
  });
  it("isSafeContentPathPart rejects pkg@1.0.0-build.1", () => {
    expect(isSafeContentPathPart("pkg@1.0.0-build.1")).toBe(false);
  });
  it("isSafeContentPathPart rejects pkg@1.0.0-build.1+sha.1", () => {
    expect(isSafeContentPathPart("pkg@1.0.0-build.1+sha.1")).toBe(false);
  });
  it("isSafeContentPathPart rejects pkg@1.0.0-build.1+sha.1+meta.1", () => {
    expect(isSafeContentPathPart("pkg@1.0.0-build.1+sha.1+meta.1")).toBe(false);
  });
  it("isSafeContentPathPart rejects pkg@1.0.0-build.1+sha.1+meta.1+extra.1", () => {
    expect(
      isSafeContentPathPart("pkg@1.0.0-build.1+sha.1+meta.1+extra.1"),
    ).toBe(false);
  });
  it("isSafeContentPathPart rejects pkg@1.0.0-build.1+sha.1+meta.1+extra.1+m", () => {
    expect(
      isSafeContentPathPart("pkg@1.0.0-build.1+sha.1+meta.1+extra.1+more.1"),
    ).toBe(false);
  });
  it("isSafeContentPathPart rejects pkg@1.0.0-build.1+sha.1+meta.1+extra.1+m", () => {
    expect(
      isSafeContentPathPart(
        "pkg@1.0.0-build.1+sha.1+meta.1+extra.1+more.1+final.1",
      ),
    ).toBe(false);
  });
  it("isSafeContentPathPart rejects windows\\device\\con", () => {
    expect(isSafeContentPathPart("windows\\device\\con")).toBe(false);
  });
  it("isSafeContentPathPart rejects windows\\device\\prn", () => {
    expect(isSafeContentPathPart("windows\\device\\prn")).toBe(false);
  });
  it("isSafeContentPathPart rejects windows\\device\\aux", () => {
    expect(isSafeContentPathPart("windows\\device\\aux")).toBe(false);
  });
  it("isSafeContentPathPart rejects windows\\device\\nul", () => {
    expect(isSafeContentPathPart("windows\\device\\nul")).toBe(false);
  });
  it("isSafeContentPathPart rejects windows\\device\\com1", () => {
    expect(isSafeContentPathPart("windows\\device\\com1")).toBe(false);
  });
  it("isSafeContentPathPart rejects windows\\device\\lpt1", () => {
    expect(isSafeContentPathPart("windows\\device\\lpt1")).toBe(false);
  });
  it("isSafeContentPathPart rejects reserved/con", () => {
    expect(isSafeContentPathPart("reserved/con")).toBe(false);
  });
  it("isSafeContentPathPart rejects reserved/prn", () => {
    expect(isSafeContentPathPart("reserved/prn")).toBe(false);
  });
  it("isSafeContentPathPart rejects reserved/aux", () => {
    expect(isSafeContentPathPart("reserved/aux")).toBe(false);
  });
  it("isSafeContentPathPart rejects reserved/nul", () => {
    expect(isSafeContentPathPart("reserved/nul")).toBe(false);
  });
  it("isSafeContentPathPart rejects reserved/com1", () => {
    expect(isSafeContentPathPart("reserved/com1")).toBe(false);
  });
  it("isSafeContentPathPart rejects reserved/lpt1", () => {
    expect(isSafeContentPathPart("reserved/lpt1")).toBe(false);
  });
  it("isSafeContentPathPart rejects dotfile/.hidden", () => {
    expect(isSafeContentPathPart("dotfile/.hidden")).toBe(false);
  });
  it("isSafeContentPathPart rejects dotfile/..hidden", () => {
    expect(isSafeContentPathPart("dotfile/..hidden")).toBe(false);
  });
  it("isSafeContentPathPart rejects dotfile/...hidden", () => {
    expect(isSafeContentPathPart("dotfile/...hidden")).toBe(false);
  });
  it("isSafeContentPathPart rejects dotfile/....hidden", () => {
    expect(isSafeContentPathPart("dotfile/....hidden")).toBe(false);
  });
  it("isSafeContentPathPart rejects dotfile/.....hidden", () => {
    expect(isSafeContentPathPart("dotfile/.....hidden")).toBe(false);
  });
  it("isSafeContentPathPart rejects dotfile/......hidden", () => {
    expect(isSafeContentPathPart("dotfile/......hidden")).toBe(false);
  });
  it("isSafeContentPathPart rejects dotfile/.......hidden", () => {
    expect(isSafeContentPathPart("dotfile/.......hidden")).toBe(false);
  });
  it("isSafeContentPathPart rejects dotfile/........hidden", () => {
    expect(isSafeContentPathPart("dotfile/........hidden")).toBe(false);
  });
  it("isSafeContentPathPart rejects dotfile/.........hidden", () => {
    expect(isSafeContentPathPart("dotfile/.........hidden")).toBe(false);
  });
  it("isSafeContentPathPart rejects dotfile/..........hidden", () => {
    expect(isSafeContentPathPart("dotfile/..........hidden")).toBe(false);
  });
  it("isSafeContentPathPart matrix agents 0", () => {
    expect(isSafeContentPathPart("agents")).toBe(true);
    expect(isSafeContentPathPart("agents-slug-0")).toBe(true);
    expect(isSafeContentPathPart("AGENTS")).toBe(false);
  });
  it("isSafeContentPathPart matrix agents 1", () => {
    expect(isSafeContentPathPart("agents")).toBe(true);
    expect(isSafeContentPathPart("agents-slug-1")).toBe(true);
    expect(isSafeContentPathPart("AGENTS")).toBe(false);
  });
  it("isSafeContentPathPart matrix agents 2", () => {
    expect(isSafeContentPathPart("agents")).toBe(true);
    expect(isSafeContentPathPart("agents-slug-2")).toBe(true);
    expect(isSafeContentPathPart("AGENTS")).toBe(false);
  });
  it("isSafeContentPathPart matrix agents 3", () => {
    expect(isSafeContentPathPart("agents")).toBe(true);
    expect(isSafeContentPathPart("agents-slug-3")).toBe(true);
    expect(isSafeContentPathPart("AGENTS")).toBe(false);
  });
  it("isSafeContentPathPart matrix agents 4", () => {
    expect(isSafeContentPathPart("agents")).toBe(true);
    expect(isSafeContentPathPart("agents-slug-4")).toBe(true);
    expect(isSafeContentPathPart("AGENTS")).toBe(false);
  });
  it("isSafeContentPathPart matrix agents 5", () => {
    expect(isSafeContentPathPart("agents")).toBe(true);
    expect(isSafeContentPathPart("agents-slug-5")).toBe(true);
    expect(isSafeContentPathPart("AGENTS")).toBe(false);
  });
  it("isSafeContentPathPart matrix agents 6", () => {
    expect(isSafeContentPathPart("agents")).toBe(true);
    expect(isSafeContentPathPart("agents-slug-6")).toBe(true);
    expect(isSafeContentPathPart("AGENTS")).toBe(false);
  });
  it("isSafeContentPathPart matrix agents 7", () => {
    expect(isSafeContentPathPart("agents")).toBe(true);
    expect(isSafeContentPathPart("agents-slug-7")).toBe(true);
    expect(isSafeContentPathPart("AGENTS")).toBe(false);
  });
  it("isSafeContentPathPart matrix mcp 0", () => {
    expect(isSafeContentPathPart("mcp")).toBe(true);
    expect(isSafeContentPathPart("mcp-slug-0")).toBe(true);
    expect(isSafeContentPathPart("MCP")).toBe(false);
  });
  it("isSafeContentPathPart matrix mcp 1", () => {
    expect(isSafeContentPathPart("mcp")).toBe(true);
    expect(isSafeContentPathPart("mcp-slug-1")).toBe(true);
    expect(isSafeContentPathPart("MCP")).toBe(false);
  });
  it("isSafeContentPathPart matrix mcp 2", () => {
    expect(isSafeContentPathPart("mcp")).toBe(true);
    expect(isSafeContentPathPart("mcp-slug-2")).toBe(true);
    expect(isSafeContentPathPart("MCP")).toBe(false);
  });
  it("isSafeContentPathPart matrix mcp 3", () => {
    expect(isSafeContentPathPart("mcp")).toBe(true);
    expect(isSafeContentPathPart("mcp-slug-3")).toBe(true);
    expect(isSafeContentPathPart("MCP")).toBe(false);
  });
  it("isSafeContentPathPart matrix mcp 4", () => {
    expect(isSafeContentPathPart("mcp")).toBe(true);
    expect(isSafeContentPathPart("mcp-slug-4")).toBe(true);
    expect(isSafeContentPathPart("MCP")).toBe(false);
  });
  it("isSafeContentPathPart matrix mcp 5", () => {
    expect(isSafeContentPathPart("mcp")).toBe(true);
    expect(isSafeContentPathPart("mcp-slug-5")).toBe(true);
    expect(isSafeContentPathPart("MCP")).toBe(false);
  });
  it("isSafeContentPathPart matrix mcp 6", () => {
    expect(isSafeContentPathPart("mcp")).toBe(true);
    expect(isSafeContentPathPart("mcp-slug-6")).toBe(true);
    expect(isSafeContentPathPart("MCP")).toBe(false);
  });
  it("isSafeContentPathPart matrix mcp 7", () => {
    expect(isSafeContentPathPart("mcp")).toBe(true);
    expect(isSafeContentPathPart("mcp-slug-7")).toBe(true);
    expect(isSafeContentPathPart("MCP")).toBe(false);
  });
  it("isSafeContentPathPart matrix tools 0", () => {
    expect(isSafeContentPathPart("tools")).toBe(true);
    expect(isSafeContentPathPart("tools-slug-0")).toBe(true);
    expect(isSafeContentPathPart("TOOLS")).toBe(false);
  });
  it("isSafeContentPathPart matrix tools 1", () => {
    expect(isSafeContentPathPart("tools")).toBe(true);
    expect(isSafeContentPathPart("tools-slug-1")).toBe(true);
    expect(isSafeContentPathPart("TOOLS")).toBe(false);
  });
  it("isSafeContentPathPart matrix tools 2", () => {
    expect(isSafeContentPathPart("tools")).toBe(true);
    expect(isSafeContentPathPart("tools-slug-2")).toBe(true);
    expect(isSafeContentPathPart("TOOLS")).toBe(false);
  });
  it("isSafeContentPathPart matrix tools 3", () => {
    expect(isSafeContentPathPart("tools")).toBe(true);
    expect(isSafeContentPathPart("tools-slug-3")).toBe(true);
    expect(isSafeContentPathPart("TOOLS")).toBe(false);
  });
  it("isSafeContentPathPart matrix tools 4", () => {
    expect(isSafeContentPathPart("tools")).toBe(true);
    expect(isSafeContentPathPart("tools-slug-4")).toBe(true);
    expect(isSafeContentPathPart("TOOLS")).toBe(false);
  });
  it("isSafeContentPathPart matrix tools 5", () => {
    expect(isSafeContentPathPart("tools")).toBe(true);
    expect(isSafeContentPathPart("tools-slug-5")).toBe(true);
    expect(isSafeContentPathPart("TOOLS")).toBe(false);
  });
  it("isSafeContentPathPart matrix tools 6", () => {
    expect(isSafeContentPathPart("tools")).toBe(true);
    expect(isSafeContentPathPart("tools-slug-6")).toBe(true);
    expect(isSafeContentPathPart("TOOLS")).toBe(false);
  });
  it("isSafeContentPathPart matrix tools 7", () => {
    expect(isSafeContentPathPart("tools")).toBe(true);
    expect(isSafeContentPathPart("tools-slug-7")).toBe(true);
    expect(isSafeContentPathPart("TOOLS")).toBe(false);
  });
  it("isSafeContentPathPart matrix skills 0", () => {
    expect(isSafeContentPathPart("skills")).toBe(true);
    expect(isSafeContentPathPart("skills-slug-0")).toBe(true);
    expect(isSafeContentPathPart("SKILLS")).toBe(false);
  });
  it("isSafeContentPathPart matrix skills 1", () => {
    expect(isSafeContentPathPart("skills")).toBe(true);
    expect(isSafeContentPathPart("skills-slug-1")).toBe(true);
    expect(isSafeContentPathPart("SKILLS")).toBe(false);
  });
  it("isSafeContentPathPart matrix skills 2", () => {
    expect(isSafeContentPathPart("skills")).toBe(true);
    expect(isSafeContentPathPart("skills-slug-2")).toBe(true);
    expect(isSafeContentPathPart("SKILLS")).toBe(false);
  });
  it("isSafeContentPathPart matrix skills 3", () => {
    expect(isSafeContentPathPart("skills")).toBe(true);
    expect(isSafeContentPathPart("skills-slug-3")).toBe(true);
    expect(isSafeContentPathPart("SKILLS")).toBe(false);
  });
  it("isSafeContentPathPart matrix skills 4", () => {
    expect(isSafeContentPathPart("skills")).toBe(true);
    expect(isSafeContentPathPart("skills-slug-4")).toBe(true);
    expect(isSafeContentPathPart("SKILLS")).toBe(false);
  });
  it("isSafeContentPathPart matrix skills 5", () => {
    expect(isSafeContentPathPart("skills")).toBe(true);
    expect(isSafeContentPathPart("skills-slug-5")).toBe(true);
    expect(isSafeContentPathPart("SKILLS")).toBe(false);
  });
  it("isSafeContentPathPart matrix skills 6", () => {
    expect(isSafeContentPathPart("skills")).toBe(true);
    expect(isSafeContentPathPart("skills-slug-6")).toBe(true);
    expect(isSafeContentPathPart("SKILLS")).toBe(false);
  });
  it("isSafeContentPathPart matrix skills 7", () => {
    expect(isSafeContentPathPart("skills")).toBe(true);
    expect(isSafeContentPathPart("skills-slug-7")).toBe(true);
    expect(isSafeContentPathPart("SKILLS")).toBe(false);
  });
  it("isSafeContentPathPart matrix rules 0", () => {
    expect(isSafeContentPathPart("rules")).toBe(true);
    expect(isSafeContentPathPart("rules-slug-0")).toBe(true);
    expect(isSafeContentPathPart("RULES")).toBe(false);
  });
  it("isSafeContentPathPart matrix rules 1", () => {
    expect(isSafeContentPathPart("rules")).toBe(true);
    expect(isSafeContentPathPart("rules-slug-1")).toBe(true);
    expect(isSafeContentPathPart("RULES")).toBe(false);
  });
  it("isSafeContentPathPart matrix rules 2", () => {
    expect(isSafeContentPathPart("rules")).toBe(true);
    expect(isSafeContentPathPart("rules-slug-2")).toBe(true);
    expect(isSafeContentPathPart("RULES")).toBe(false);
  });
  it("isSafeContentPathPart matrix rules 3", () => {
    expect(isSafeContentPathPart("rules")).toBe(true);
    expect(isSafeContentPathPart("rules-slug-3")).toBe(true);
    expect(isSafeContentPathPart("RULES")).toBe(false);
  });
  it("isSafeContentPathPart matrix rules 4", () => {
    expect(isSafeContentPathPart("rules")).toBe(true);
    expect(isSafeContentPathPart("rules-slug-4")).toBe(true);
    expect(isSafeContentPathPart("RULES")).toBe(false);
  });
  it("isSafeContentPathPart matrix rules 5", () => {
    expect(isSafeContentPathPart("rules")).toBe(true);
    expect(isSafeContentPathPart("rules-slug-5")).toBe(true);
    expect(isSafeContentPathPart("RULES")).toBe(false);
  });
  it("isSafeContentPathPart matrix rules 6", () => {
    expect(isSafeContentPathPart("rules")).toBe(true);
    expect(isSafeContentPathPart("rules-slug-6")).toBe(true);
    expect(isSafeContentPathPart("RULES")).toBe(false);
  });
  it("isSafeContentPathPart matrix rules 7", () => {
    expect(isSafeContentPathPart("rules")).toBe(true);
    expect(isSafeContentPathPart("rules-slug-7")).toBe(true);
    expect(isSafeContentPathPart("RULES")).toBe(false);
  });
  it("isSafeContentPathPart matrix commands 0", () => {
    expect(isSafeContentPathPart("commands")).toBe(true);
    expect(isSafeContentPathPart("commands-slug-0")).toBe(true);
    expect(isSafeContentPathPart("COMMANDS")).toBe(false);
  });
  it("isSafeContentPathPart matrix commands 1", () => {
    expect(isSafeContentPathPart("commands")).toBe(true);
    expect(isSafeContentPathPart("commands-slug-1")).toBe(true);
    expect(isSafeContentPathPart("COMMANDS")).toBe(false);
  });
  it("isSafeContentPathPart matrix commands 2", () => {
    expect(isSafeContentPathPart("commands")).toBe(true);
    expect(isSafeContentPathPart("commands-slug-2")).toBe(true);
    expect(isSafeContentPathPart("COMMANDS")).toBe(false);
  });
  it("isSafeContentPathPart matrix commands 3", () => {
    expect(isSafeContentPathPart("commands")).toBe(true);
    expect(isSafeContentPathPart("commands-slug-3")).toBe(true);
    expect(isSafeContentPathPart("COMMANDS")).toBe(false);
  });
  it("isSafeContentPathPart matrix commands 4", () => {
    expect(isSafeContentPathPart("commands")).toBe(true);
    expect(isSafeContentPathPart("commands-slug-4")).toBe(true);
    expect(isSafeContentPathPart("COMMANDS")).toBe(false);
  });
  it("isSafeContentPathPart matrix commands 5", () => {
    expect(isSafeContentPathPart("commands")).toBe(true);
    expect(isSafeContentPathPart("commands-slug-5")).toBe(true);
    expect(isSafeContentPathPart("COMMANDS")).toBe(false);
  });
  it("isSafeContentPathPart matrix commands 6", () => {
    expect(isSafeContentPathPart("commands")).toBe(true);
    expect(isSafeContentPathPart("commands-slug-6")).toBe(true);
    expect(isSafeContentPathPart("COMMANDS")).toBe(false);
  });
  it("isSafeContentPathPart matrix commands 7", () => {
    expect(isSafeContentPathPart("commands")).toBe(true);
    expect(isSafeContentPathPart("commands-slug-7")).toBe(true);
    expect(isSafeContentPathPart("COMMANDS")).toBe(false);
  });
  it("isSafeContentPathPart matrix hooks 0", () => {
    expect(isSafeContentPathPart("hooks")).toBe(true);
    expect(isSafeContentPathPart("hooks-slug-0")).toBe(true);
    expect(isSafeContentPathPart("HOOKS")).toBe(false);
  });
  it("isSafeContentPathPart matrix hooks 1", () => {
    expect(isSafeContentPathPart("hooks")).toBe(true);
    expect(isSafeContentPathPart("hooks-slug-1")).toBe(true);
    expect(isSafeContentPathPart("HOOKS")).toBe(false);
  });
  it("isSafeContentPathPart matrix hooks 2", () => {
    expect(isSafeContentPathPart("hooks")).toBe(true);
    expect(isSafeContentPathPart("hooks-slug-2")).toBe(true);
    expect(isSafeContentPathPart("HOOKS")).toBe(false);
  });
  it("isSafeContentPathPart matrix hooks 3", () => {
    expect(isSafeContentPathPart("hooks")).toBe(true);
    expect(isSafeContentPathPart("hooks-slug-3")).toBe(true);
    expect(isSafeContentPathPart("HOOKS")).toBe(false);
  });
  it("isSafeContentPathPart matrix hooks 4", () => {
    expect(isSafeContentPathPart("hooks")).toBe(true);
    expect(isSafeContentPathPart("hooks-slug-4")).toBe(true);
    expect(isSafeContentPathPart("HOOKS")).toBe(false);
  });
  it("isSafeContentPathPart matrix hooks 5", () => {
    expect(isSafeContentPathPart("hooks")).toBe(true);
    expect(isSafeContentPathPart("hooks-slug-5")).toBe(true);
    expect(isSafeContentPathPart("HOOKS")).toBe(false);
  });
  it("isSafeContentPathPart matrix hooks 6", () => {
    expect(isSafeContentPathPart("hooks")).toBe(true);
    expect(isSafeContentPathPart("hooks-slug-6")).toBe(true);
    expect(isSafeContentPathPart("HOOKS")).toBe(false);
  });
  it("isSafeContentPathPart matrix hooks 7", () => {
    expect(isSafeContentPathPart("hooks")).toBe(true);
    expect(isSafeContentPathPart("hooks-slug-7")).toBe(true);
    expect(isSafeContentPathPart("HOOKS")).toBe(false);
  });
  it("isSafeContentPathPart matrix guides 0", () => {
    expect(isSafeContentPathPart("guides")).toBe(true);
    expect(isSafeContentPathPart("guides-slug-0")).toBe(true);
    expect(isSafeContentPathPart("GUIDES")).toBe(false);
  });
  it("isSafeContentPathPart matrix guides 1", () => {
    expect(isSafeContentPathPart("guides")).toBe(true);
    expect(isSafeContentPathPart("guides-slug-1")).toBe(true);
    expect(isSafeContentPathPart("GUIDES")).toBe(false);
  });
  it("isSafeContentPathPart matrix guides 2", () => {
    expect(isSafeContentPathPart("guides")).toBe(true);
    expect(isSafeContentPathPart("guides-slug-2")).toBe(true);
    expect(isSafeContentPathPart("GUIDES")).toBe(false);
  });
  it("isSafeContentPathPart matrix guides 3", () => {
    expect(isSafeContentPathPart("guides")).toBe(true);
    expect(isSafeContentPathPart("guides-slug-3")).toBe(true);
    expect(isSafeContentPathPart("GUIDES")).toBe(false);
  });
  it("isSafeContentPathPart matrix guides 4", () => {
    expect(isSafeContentPathPart("guides")).toBe(true);
    expect(isSafeContentPathPart("guides-slug-4")).toBe(true);
    expect(isSafeContentPathPart("GUIDES")).toBe(false);
  });
  it("isSafeContentPathPart matrix guides 5", () => {
    expect(isSafeContentPathPart("guides")).toBe(true);
    expect(isSafeContentPathPart("guides-slug-5")).toBe(true);
    expect(isSafeContentPathPart("GUIDES")).toBe(false);
  });
  it("isSafeContentPathPart matrix guides 6", () => {
    expect(isSafeContentPathPart("guides")).toBe(true);
    expect(isSafeContentPathPart("guides-slug-6")).toBe(true);
    expect(isSafeContentPathPart("GUIDES")).toBe(false);
  });
  it("isSafeContentPathPart matrix guides 7", () => {
    expect(isSafeContentPathPart("guides")).toBe(true);
    expect(isSafeContentPathPart("guides-slug-7")).toBe(true);
    expect(isSafeContentPathPart("GUIDES")).toBe(false);
  });
  it("isSafeContentPathPart matrix collections 0", () => {
    expect(isSafeContentPathPart("collections")).toBe(true);
    expect(isSafeContentPathPart("collections-slug-0")).toBe(true);
    expect(isSafeContentPathPart("COLLECTIONS")).toBe(false);
  });
  it("isSafeContentPathPart matrix collections 1", () => {
    expect(isSafeContentPathPart("collections")).toBe(true);
    expect(isSafeContentPathPart("collections-slug-1")).toBe(true);
    expect(isSafeContentPathPart("COLLECTIONS")).toBe(false);
  });
  it("isSafeContentPathPart matrix collections 2", () => {
    expect(isSafeContentPathPart("collections")).toBe(true);
    expect(isSafeContentPathPart("collections-slug-2")).toBe(true);
    expect(isSafeContentPathPart("COLLECTIONS")).toBe(false);
  });
  it("isSafeContentPathPart matrix collections 3", () => {
    expect(isSafeContentPathPart("collections")).toBe(true);
    expect(isSafeContentPathPart("collections-slug-3")).toBe(true);
    expect(isSafeContentPathPart("COLLECTIONS")).toBe(false);
  });
  it("isSafeContentPathPart matrix collections 4", () => {
    expect(isSafeContentPathPart("collections")).toBe(true);
    expect(isSafeContentPathPart("collections-slug-4")).toBe(true);
    expect(isSafeContentPathPart("COLLECTIONS")).toBe(false);
  });
  it("isSafeContentPathPart matrix collections 5", () => {
    expect(isSafeContentPathPart("collections")).toBe(true);
    expect(isSafeContentPathPart("collections-slug-5")).toBe(true);
    expect(isSafeContentPathPart("COLLECTIONS")).toBe(false);
  });
  it("isSafeContentPathPart matrix collections 6", () => {
    expect(isSafeContentPathPart("collections")).toBe(true);
    expect(isSafeContentPathPart("collections-slug-6")).toBe(true);
    expect(isSafeContentPathPart("COLLECTIONS")).toBe(false);
  });
  it("isSafeContentPathPart matrix collections 7", () => {
    expect(isSafeContentPathPart("collections")).toBe(true);
    expect(isSafeContentPathPart("collections-slug-7")).toBe(true);
    expect(isSafeContentPathPart("COLLECTIONS")).toBe(false);
  });
  it("isSafeContentPathPart matrix statuslines 0", () => {
    expect(isSafeContentPathPart("statuslines")).toBe(true);
    expect(isSafeContentPathPart("statuslines-slug-0")).toBe(true);
    expect(isSafeContentPathPart("STATUSLINES")).toBe(false);
  });
  it("isSafeContentPathPart matrix statuslines 1", () => {
    expect(isSafeContentPathPart("statuslines")).toBe(true);
    expect(isSafeContentPathPart("statuslines-slug-1")).toBe(true);
    expect(isSafeContentPathPart("STATUSLINES")).toBe(false);
  });
  it("isSafeContentPathPart matrix statuslines 2", () => {
    expect(isSafeContentPathPart("statuslines")).toBe(true);
    expect(isSafeContentPathPart("statuslines-slug-2")).toBe(true);
    expect(isSafeContentPathPart("STATUSLINES")).toBe(false);
  });
  it("isSafeContentPathPart matrix statuslines 3", () => {
    expect(isSafeContentPathPart("statuslines")).toBe(true);
    expect(isSafeContentPathPart("statuslines-slug-3")).toBe(true);
    expect(isSafeContentPathPart("STATUSLINES")).toBe(false);
  });
  it("isSafeContentPathPart matrix statuslines 4", () => {
    expect(isSafeContentPathPart("statuslines")).toBe(true);
    expect(isSafeContentPathPart("statuslines-slug-4")).toBe(true);
    expect(isSafeContentPathPart("STATUSLINES")).toBe(false);
  });
  it("isSafeContentPathPart matrix statuslines 5", () => {
    expect(isSafeContentPathPart("statuslines")).toBe(true);
    expect(isSafeContentPathPart("statuslines-slug-5")).toBe(true);
    expect(isSafeContentPathPart("STATUSLINES")).toBe(false);
  });
  it("isSafeContentPathPart matrix statuslines 6", () => {
    expect(isSafeContentPathPart("statuslines")).toBe(true);
    expect(isSafeContentPathPart("statuslines-slug-6")).toBe(true);
    expect(isSafeContentPathPart("STATUSLINES")).toBe(false);
  });
  it("isSafeContentPathPart matrix statuslines 7", () => {
    expect(isSafeContentPathPart("statuslines")).toBe(true);
    expect(isSafeContentPathPart("statuslines-slug-7")).toBe(true);
    expect(isSafeContentPathPart("STATUSLINES")).toBe(false);
  });
});

describe("content-artifact-lib safeDataArtifactPath", () => {
  it("accepts canonical registry artifact paths", () => {
    expect(safeDataArtifactPath("search-index.json")).toBe("search-index.json");
    expect(safeDataArtifactPath("entries/mcp/browser-bridge.json")).toBe(
      "entries/mcp/browser-bridge.json",
    );
  });

  it("rejects traversal and empty path segments", () => {
    expect(() => safeDataArtifactPath("../registry-manifest.json")).toThrow(
      /Unsafe data artifact path/,
    );
    expect(() => safeDataArtifactPath("entries/../secret.json")).toThrow(
      /Unsafe data artifact path/,
    );
    expect(() => safeDataArtifactPath("")).toThrow(/Unsafe data artifact path/);
  });
});

describe("content-artifact-lib normalizeRegistryEntries", () => {
  it("returns entries array from envelope", () => {
    expect(normalizeRegistryEntries({ entries: [{ slug: "demo" }] })).toEqual([
      { slug: "demo" },
    ]);
  });
  it("throws when entries missing", () => {
    expect(() => normalizeRegistryEntries({} as never)).toThrow(
      /Invalid registry artifact/,
    );
  });
  it("normalizeRegistryEntries agents 0", () => {
    const entries = [{ category: "agents", slug: "agents-entry-0" }];
    expect(normalizeRegistryEntries({ entries })).toEqual(entries);
  });
  it("normalizeRegistryEntries agents 1", () => {
    const entries = [{ category: "agents", slug: "agents-entry-1" }];
    expect(normalizeRegistryEntries({ entries })).toEqual(entries);
  });
  it("normalizeRegistryEntries agents 2", () => {
    const entries = [{ category: "agents", slug: "agents-entry-2" }];
    expect(normalizeRegistryEntries({ entries })).toEqual(entries);
  });
  it("normalizeRegistryEntries agents 3", () => {
    const entries = [{ category: "agents", slug: "agents-entry-3" }];
    expect(normalizeRegistryEntries({ entries })).toEqual(entries);
  });
  it("normalizeRegistryEntries agents 4", () => {
    const entries = [{ category: "agents", slug: "agents-entry-4" }];
    expect(normalizeRegistryEntries({ entries })).toEqual(entries);
  });
  it("normalizeRegistryEntries agents 5", () => {
    const entries = [{ category: "agents", slug: "agents-entry-5" }];
    expect(normalizeRegistryEntries({ entries })).toEqual(entries);
  });
  it("normalizeRegistryEntries agents 6", () => {
    const entries = [{ category: "agents", slug: "agents-entry-6" }];
    expect(normalizeRegistryEntries({ entries })).toEqual(entries);
  });
  it("normalizeRegistryEntries agents 7", () => {
    const entries = [{ category: "agents", slug: "agents-entry-7" }];
    expect(normalizeRegistryEntries({ entries })).toEqual(entries);
  });
  it("normalizeRegistryEntries agents 8", () => {
    const entries = [{ category: "agents", slug: "agents-entry-8" }];
    expect(normalizeRegistryEntries({ entries })).toEqual(entries);
  });
  it("normalizeRegistryEntries agents 9", () => {
    const entries = [{ category: "agents", slug: "agents-entry-9" }];
    expect(normalizeRegistryEntries({ entries })).toEqual(entries);
  });
  it("normalizeRegistryEntries mcp 0", () => {
    const entries = [{ category: "mcp", slug: "mcp-entry-0" }];
    expect(normalizeRegistryEntries({ entries })).toEqual(entries);
  });
  it("normalizeRegistryEntries mcp 1", () => {
    const entries = [{ category: "mcp", slug: "mcp-entry-1" }];
    expect(normalizeRegistryEntries({ entries })).toEqual(entries);
  });
  it("normalizeRegistryEntries mcp 2", () => {
    const entries = [{ category: "mcp", slug: "mcp-entry-2" }];
    expect(normalizeRegistryEntries({ entries })).toEqual(entries);
  });
  it("normalizeRegistryEntries mcp 3", () => {
    const entries = [{ category: "mcp", slug: "mcp-entry-3" }];
    expect(normalizeRegistryEntries({ entries })).toEqual(entries);
  });
  it("normalizeRegistryEntries mcp 4", () => {
    const entries = [{ category: "mcp", slug: "mcp-entry-4" }];
    expect(normalizeRegistryEntries({ entries })).toEqual(entries);
  });
  it("normalizeRegistryEntries mcp 5", () => {
    const entries = [{ category: "mcp", slug: "mcp-entry-5" }];
    expect(normalizeRegistryEntries({ entries })).toEqual(entries);
  });
  it("normalizeRegistryEntries mcp 6", () => {
    const entries = [{ category: "mcp", slug: "mcp-entry-6" }];
    expect(normalizeRegistryEntries({ entries })).toEqual(entries);
  });
  it("normalizeRegistryEntries mcp 7", () => {
    const entries = [{ category: "mcp", slug: "mcp-entry-7" }];
    expect(normalizeRegistryEntries({ entries })).toEqual(entries);
  });
  it("normalizeRegistryEntries mcp 8", () => {
    const entries = [{ category: "mcp", slug: "mcp-entry-8" }];
    expect(normalizeRegistryEntries({ entries })).toEqual(entries);
  });
  it("normalizeRegistryEntries mcp 9", () => {
    const entries = [{ category: "mcp", slug: "mcp-entry-9" }];
    expect(normalizeRegistryEntries({ entries })).toEqual(entries);
  });
  it("normalizeRegistryEntries tools 0", () => {
    const entries = [{ category: "tools", slug: "tools-entry-0" }];
    expect(normalizeRegistryEntries({ entries })).toEqual(entries);
  });
  it("normalizeRegistryEntries tools 1", () => {
    const entries = [{ category: "tools", slug: "tools-entry-1" }];
    expect(normalizeRegistryEntries({ entries })).toEqual(entries);
  });
  it("normalizeRegistryEntries tools 2", () => {
    const entries = [{ category: "tools", slug: "tools-entry-2" }];
    expect(normalizeRegistryEntries({ entries })).toEqual(entries);
  });
  it("normalizeRegistryEntries tools 3", () => {
    const entries = [{ category: "tools", slug: "tools-entry-3" }];
    expect(normalizeRegistryEntries({ entries })).toEqual(entries);
  });
  it("normalizeRegistryEntries tools 4", () => {
    const entries = [{ category: "tools", slug: "tools-entry-4" }];
    expect(normalizeRegistryEntries({ entries })).toEqual(entries);
  });
  it("normalizeRegistryEntries tools 5", () => {
    const entries = [{ category: "tools", slug: "tools-entry-5" }];
    expect(normalizeRegistryEntries({ entries })).toEqual(entries);
  });
  it("normalizeRegistryEntries tools 6", () => {
    const entries = [{ category: "tools", slug: "tools-entry-6" }];
    expect(normalizeRegistryEntries({ entries })).toEqual(entries);
  });
  it("normalizeRegistryEntries tools 7", () => {
    const entries = [{ category: "tools", slug: "tools-entry-7" }];
    expect(normalizeRegistryEntries({ entries })).toEqual(entries);
  });
  it("normalizeRegistryEntries tools 8", () => {
    const entries = [{ category: "tools", slug: "tools-entry-8" }];
    expect(normalizeRegistryEntries({ entries })).toEqual(entries);
  });
  it("normalizeRegistryEntries tools 9", () => {
    const entries = [{ category: "tools", slug: "tools-entry-9" }];
    expect(normalizeRegistryEntries({ entries })).toEqual(entries);
  });
  it("normalizeRegistryEntries skills 0", () => {
    const entries = [{ category: "skills", slug: "skills-entry-0" }];
    expect(normalizeRegistryEntries({ entries })).toEqual(entries);
  });
  it("normalizeRegistryEntries skills 1", () => {
    const entries = [{ category: "skills", slug: "skills-entry-1" }];
    expect(normalizeRegistryEntries({ entries })).toEqual(entries);
  });
  it("normalizeRegistryEntries skills 2", () => {
    const entries = [{ category: "skills", slug: "skills-entry-2" }];
    expect(normalizeRegistryEntries({ entries })).toEqual(entries);
  });
  it("normalizeRegistryEntries skills 3", () => {
    const entries = [{ category: "skills", slug: "skills-entry-3" }];
    expect(normalizeRegistryEntries({ entries })).toEqual(entries);
  });
  it("normalizeRegistryEntries skills 4", () => {
    const entries = [{ category: "skills", slug: "skills-entry-4" }];
    expect(normalizeRegistryEntries({ entries })).toEqual(entries);
  });
  it("normalizeRegistryEntries skills 5", () => {
    const entries = [{ category: "skills", slug: "skills-entry-5" }];
    expect(normalizeRegistryEntries({ entries })).toEqual(entries);
  });
  it("normalizeRegistryEntries skills 6", () => {
    const entries = [{ category: "skills", slug: "skills-entry-6" }];
    expect(normalizeRegistryEntries({ entries })).toEqual(entries);
  });
  it("normalizeRegistryEntries skills 7", () => {
    const entries = [{ category: "skills", slug: "skills-entry-7" }];
    expect(normalizeRegistryEntries({ entries })).toEqual(entries);
  });
  it("normalizeRegistryEntries skills 8", () => {
    const entries = [{ category: "skills", slug: "skills-entry-8" }];
    expect(normalizeRegistryEntries({ entries })).toEqual(entries);
  });
  it("normalizeRegistryEntries skills 9", () => {
    const entries = [{ category: "skills", slug: "skills-entry-9" }];
    expect(normalizeRegistryEntries({ entries })).toEqual(entries);
  });
  it("normalizeRegistryEntries rules 0", () => {
    const entries = [{ category: "rules", slug: "rules-entry-0" }];
    expect(normalizeRegistryEntries({ entries })).toEqual(entries);
  });
  it("normalizeRegistryEntries rules 1", () => {
    const entries = [{ category: "rules", slug: "rules-entry-1" }];
    expect(normalizeRegistryEntries({ entries })).toEqual(entries);
  });
  it("normalizeRegistryEntries rules 2", () => {
    const entries = [{ category: "rules", slug: "rules-entry-2" }];
    expect(normalizeRegistryEntries({ entries })).toEqual(entries);
  });
  it("normalizeRegistryEntries rules 3", () => {
    const entries = [{ category: "rules", slug: "rules-entry-3" }];
    expect(normalizeRegistryEntries({ entries })).toEqual(entries);
  });
  it("normalizeRegistryEntries rules 4", () => {
    const entries = [{ category: "rules", slug: "rules-entry-4" }];
    expect(normalizeRegistryEntries({ entries })).toEqual(entries);
  });
  it("normalizeRegistryEntries rules 5", () => {
    const entries = [{ category: "rules", slug: "rules-entry-5" }];
    expect(normalizeRegistryEntries({ entries })).toEqual(entries);
  });
  it("normalizeRegistryEntries rules 6", () => {
    const entries = [{ category: "rules", slug: "rules-entry-6" }];
    expect(normalizeRegistryEntries({ entries })).toEqual(entries);
  });
  it("normalizeRegistryEntries rules 7", () => {
    const entries = [{ category: "rules", slug: "rules-entry-7" }];
    expect(normalizeRegistryEntries({ entries })).toEqual(entries);
  });
  it("normalizeRegistryEntries rules 8", () => {
    const entries = [{ category: "rules", slug: "rules-entry-8" }];
    expect(normalizeRegistryEntries({ entries })).toEqual(entries);
  });
  it("normalizeRegistryEntries rules 9", () => {
    const entries = [{ category: "rules", slug: "rules-entry-9" }];
    expect(normalizeRegistryEntries({ entries })).toEqual(entries);
  });
  it("normalizeRegistryEntries commands 0", () => {
    const entries = [{ category: "commands", slug: "commands-entry-0" }];
    expect(normalizeRegistryEntries({ entries })).toEqual(entries);
  });
  it("normalizeRegistryEntries commands 1", () => {
    const entries = [{ category: "commands", slug: "commands-entry-1" }];
    expect(normalizeRegistryEntries({ entries })).toEqual(entries);
  });
  it("normalizeRegistryEntries commands 2", () => {
    const entries = [{ category: "commands", slug: "commands-entry-2" }];
    expect(normalizeRegistryEntries({ entries })).toEqual(entries);
  });
  it("normalizeRegistryEntries commands 3", () => {
    const entries = [{ category: "commands", slug: "commands-entry-3" }];
    expect(normalizeRegistryEntries({ entries })).toEqual(entries);
  });
  it("normalizeRegistryEntries commands 4", () => {
    const entries = [{ category: "commands", slug: "commands-entry-4" }];
    expect(normalizeRegistryEntries({ entries })).toEqual(entries);
  });
  it("normalizeRegistryEntries commands 5", () => {
    const entries = [{ category: "commands", slug: "commands-entry-5" }];
    expect(normalizeRegistryEntries({ entries })).toEqual(entries);
  });
  it("normalizeRegistryEntries commands 6", () => {
    const entries = [{ category: "commands", slug: "commands-entry-6" }];
    expect(normalizeRegistryEntries({ entries })).toEqual(entries);
  });
  it("normalizeRegistryEntries commands 7", () => {
    const entries = [{ category: "commands", slug: "commands-entry-7" }];
    expect(normalizeRegistryEntries({ entries })).toEqual(entries);
  });
  it("normalizeRegistryEntries commands 8", () => {
    const entries = [{ category: "commands", slug: "commands-entry-8" }];
    expect(normalizeRegistryEntries({ entries })).toEqual(entries);
  });
  it("normalizeRegistryEntries commands 9", () => {
    const entries = [{ category: "commands", slug: "commands-entry-9" }];
    expect(normalizeRegistryEntries({ entries })).toEqual(entries);
  });
  it("normalizeRegistryEntries hooks 0", () => {
    const entries = [{ category: "hooks", slug: "hooks-entry-0" }];
    expect(normalizeRegistryEntries({ entries })).toEqual(entries);
  });
  it("normalizeRegistryEntries hooks 1", () => {
    const entries = [{ category: "hooks", slug: "hooks-entry-1" }];
    expect(normalizeRegistryEntries({ entries })).toEqual(entries);
  });
  it("normalizeRegistryEntries hooks 2", () => {
    const entries = [{ category: "hooks", slug: "hooks-entry-2" }];
    expect(normalizeRegistryEntries({ entries })).toEqual(entries);
  });
  it("normalizeRegistryEntries hooks 3", () => {
    const entries = [{ category: "hooks", slug: "hooks-entry-3" }];
    expect(normalizeRegistryEntries({ entries })).toEqual(entries);
  });
  it("normalizeRegistryEntries hooks 4", () => {
    const entries = [{ category: "hooks", slug: "hooks-entry-4" }];
    expect(normalizeRegistryEntries({ entries })).toEqual(entries);
  });
  it("normalizeRegistryEntries hooks 5", () => {
    const entries = [{ category: "hooks", slug: "hooks-entry-5" }];
    expect(normalizeRegistryEntries({ entries })).toEqual(entries);
  });
  it("normalizeRegistryEntries hooks 6", () => {
    const entries = [{ category: "hooks", slug: "hooks-entry-6" }];
    expect(normalizeRegistryEntries({ entries })).toEqual(entries);
  });
  it("normalizeRegistryEntries hooks 7", () => {
    const entries = [{ category: "hooks", slug: "hooks-entry-7" }];
    expect(normalizeRegistryEntries({ entries })).toEqual(entries);
  });
  it("normalizeRegistryEntries hooks 8", () => {
    const entries = [{ category: "hooks", slug: "hooks-entry-8" }];
    expect(normalizeRegistryEntries({ entries })).toEqual(entries);
  });
  it("normalizeRegistryEntries hooks 9", () => {
    const entries = [{ category: "hooks", slug: "hooks-entry-9" }];
    expect(normalizeRegistryEntries({ entries })).toEqual(entries);
  });
  it("normalizeRegistryEntries guides 0", () => {
    const entries = [{ category: "guides", slug: "guides-entry-0" }];
    expect(normalizeRegistryEntries({ entries })).toEqual(entries);
  });
  it("normalizeRegistryEntries guides 1", () => {
    const entries = [{ category: "guides", slug: "guides-entry-1" }];
    expect(normalizeRegistryEntries({ entries })).toEqual(entries);
  });
  it("normalizeRegistryEntries guides 2", () => {
    const entries = [{ category: "guides", slug: "guides-entry-2" }];
    expect(normalizeRegistryEntries({ entries })).toEqual(entries);
  });
  it("normalizeRegistryEntries guides 3", () => {
    const entries = [{ category: "guides", slug: "guides-entry-3" }];
    expect(normalizeRegistryEntries({ entries })).toEqual(entries);
  });
  it("normalizeRegistryEntries guides 4", () => {
    const entries = [{ category: "guides", slug: "guides-entry-4" }];
    expect(normalizeRegistryEntries({ entries })).toEqual(entries);
  });
  it("normalizeRegistryEntries guides 5", () => {
    const entries = [{ category: "guides", slug: "guides-entry-5" }];
    expect(normalizeRegistryEntries({ entries })).toEqual(entries);
  });
  it("normalizeRegistryEntries guides 6", () => {
    const entries = [{ category: "guides", slug: "guides-entry-6" }];
    expect(normalizeRegistryEntries({ entries })).toEqual(entries);
  });
  it("normalizeRegistryEntries guides 7", () => {
    const entries = [{ category: "guides", slug: "guides-entry-7" }];
    expect(normalizeRegistryEntries({ entries })).toEqual(entries);
  });
  it("normalizeRegistryEntries guides 8", () => {
    const entries = [{ category: "guides", slug: "guides-entry-8" }];
    expect(normalizeRegistryEntries({ entries })).toEqual(entries);
  });
  it("normalizeRegistryEntries guides 9", () => {
    const entries = [{ category: "guides", slug: "guides-entry-9" }];
    expect(normalizeRegistryEntries({ entries })).toEqual(entries);
  });
  it("normalizeRegistryEntries collections 0", () => {
    const entries = [{ category: "collections", slug: "collections-entry-0" }];
    expect(normalizeRegistryEntries({ entries })).toEqual(entries);
  });
  it("normalizeRegistryEntries collections 1", () => {
    const entries = [{ category: "collections", slug: "collections-entry-1" }];
    expect(normalizeRegistryEntries({ entries })).toEqual(entries);
  });
  it("normalizeRegistryEntries collections 2", () => {
    const entries = [{ category: "collections", slug: "collections-entry-2" }];
    expect(normalizeRegistryEntries({ entries })).toEqual(entries);
  });
  it("normalizeRegistryEntries collections 3", () => {
    const entries = [{ category: "collections", slug: "collections-entry-3" }];
    expect(normalizeRegistryEntries({ entries })).toEqual(entries);
  });
  it("normalizeRegistryEntries collections 4", () => {
    const entries = [{ category: "collections", slug: "collections-entry-4" }];
    expect(normalizeRegistryEntries({ entries })).toEqual(entries);
  });
  it("normalizeRegistryEntries collections 5", () => {
    const entries = [{ category: "collections", slug: "collections-entry-5" }];
    expect(normalizeRegistryEntries({ entries })).toEqual(entries);
  });
  it("normalizeRegistryEntries collections 6", () => {
    const entries = [{ category: "collections", slug: "collections-entry-6" }];
    expect(normalizeRegistryEntries({ entries })).toEqual(entries);
  });
  it("normalizeRegistryEntries collections 7", () => {
    const entries = [{ category: "collections", slug: "collections-entry-7" }];
    expect(normalizeRegistryEntries({ entries })).toEqual(entries);
  });
  it("normalizeRegistryEntries collections 8", () => {
    const entries = [{ category: "collections", slug: "collections-entry-8" }];
    expect(normalizeRegistryEntries({ entries })).toEqual(entries);
  });
  it("normalizeRegistryEntries collections 9", () => {
    const entries = [{ category: "collections", slug: "collections-entry-9" }];
    expect(normalizeRegistryEntries({ entries })).toEqual(entries);
  });
  it("normalizeRegistryEntries statuslines 0", () => {
    const entries = [{ category: "statuslines", slug: "statuslines-entry-0" }];
    expect(normalizeRegistryEntries({ entries })).toEqual(entries);
  });
  it("normalizeRegistryEntries statuslines 1", () => {
    const entries = [{ category: "statuslines", slug: "statuslines-entry-1" }];
    expect(normalizeRegistryEntries({ entries })).toEqual(entries);
  });
  it("normalizeRegistryEntries statuslines 2", () => {
    const entries = [{ category: "statuslines", slug: "statuslines-entry-2" }];
    expect(normalizeRegistryEntries({ entries })).toEqual(entries);
  });
  it("normalizeRegistryEntries statuslines 3", () => {
    const entries = [{ category: "statuslines", slug: "statuslines-entry-3" }];
    expect(normalizeRegistryEntries({ entries })).toEqual(entries);
  });
  it("normalizeRegistryEntries statuslines 4", () => {
    const entries = [{ category: "statuslines", slug: "statuslines-entry-4" }];
    expect(normalizeRegistryEntries({ entries })).toEqual(entries);
  });
  it("normalizeRegistryEntries statuslines 5", () => {
    const entries = [{ category: "statuslines", slug: "statuslines-entry-5" }];
    expect(normalizeRegistryEntries({ entries })).toEqual(entries);
  });
  it("normalizeRegistryEntries statuslines 6", () => {
    const entries = [{ category: "statuslines", slug: "statuslines-entry-6" }];
    expect(normalizeRegistryEntries({ entries })).toEqual(entries);
  });
  it("normalizeRegistryEntries statuslines 7", () => {
    const entries = [{ category: "statuslines", slug: "statuslines-entry-7" }];
    expect(normalizeRegistryEntries({ entries })).toEqual(entries);
  });
  it("normalizeRegistryEntries statuslines 8", () => {
    const entries = [{ category: "statuslines", slug: "statuslines-entry-8" }];
    expect(normalizeRegistryEntries({ entries })).toEqual(entries);
  });
  it("normalizeRegistryEntries statuslines 9", () => {
    const entries = [{ category: "statuslines", slug: "statuslines-entry-9" }];
    expect(normalizeRegistryEntries({ entries })).toEqual(entries);
  });
  it("normalizeRegistryEntries batch 0", () => {
    const entries = Array.from({ length: 1 }, (_, index) => ({
      slug: "entry-" + index,
    }));
    expect(normalizeRegistryEntries({ entries })).toEqual(entries);
  });
  it("normalizeRegistryEntries batch 1", () => {
    const entries = Array.from({ length: 2 }, (_, index) => ({
      slug: "entry-" + index,
    }));
    expect(normalizeRegistryEntries({ entries })).toEqual(entries);
  });
  it("normalizeRegistryEntries batch 2", () => {
    const entries = Array.from({ length: 3 }, (_, index) => ({
      slug: "entry-" + index,
    }));
    expect(normalizeRegistryEntries({ entries })).toEqual(entries);
  });
  it("normalizeRegistryEntries batch 3", () => {
    const entries = Array.from({ length: 4 }, (_, index) => ({
      slug: "entry-" + index,
    }));
    expect(normalizeRegistryEntries({ entries })).toEqual(entries);
  });
  it("normalizeRegistryEntries batch 4", () => {
    const entries = Array.from({ length: 5 }, (_, index) => ({
      slug: "entry-" + index,
    }));
    expect(normalizeRegistryEntries({ entries })).toEqual(entries);
  });
  it("normalizeRegistryEntries batch 5", () => {
    const entries = Array.from({ length: 1 }, (_, index) => ({
      slug: "entry-" + index,
    }));
    expect(normalizeRegistryEntries({ entries })).toEqual(entries);
  });
  it("normalizeRegistryEntries batch 6", () => {
    const entries = Array.from({ length: 2 }, (_, index) => ({
      slug: "entry-" + index,
    }));
    expect(normalizeRegistryEntries({ entries })).toEqual(entries);
  });
  it("normalizeRegistryEntries batch 7", () => {
    const entries = Array.from({ length: 3 }, (_, index) => ({
      slug: "entry-" + index,
    }));
    expect(normalizeRegistryEntries({ entries })).toEqual(entries);
  });
  it("normalizeRegistryEntries batch 8", () => {
    const entries = Array.from({ length: 4 }, (_, index) => ({
      slug: "entry-" + index,
    }));
    expect(normalizeRegistryEntries({ entries })).toEqual(entries);
  });
  it("normalizeRegistryEntries batch 9", () => {
    const entries = Array.from({ length: 5 }, (_, index) => ({
      slug: "entry-" + index,
    }));
    expect(normalizeRegistryEntries({ entries })).toEqual(entries);
  });
  it("normalizeRegistryEntries batch 10", () => {
    const entries = Array.from({ length: 1 }, (_, index) => ({
      slug: "entry-" + index,
    }));
    expect(normalizeRegistryEntries({ entries })).toEqual(entries);
  });
  it("normalizeRegistryEntries batch 11", () => {
    const entries = Array.from({ length: 2 }, (_, index) => ({
      slug: "entry-" + index,
    }));
    expect(normalizeRegistryEntries({ entries })).toEqual(entries);
  });
  it("normalizeRegistryEntries batch 12", () => {
    const entries = Array.from({ length: 3 }, (_, index) => ({
      slug: "entry-" + index,
    }));
    expect(normalizeRegistryEntries({ entries })).toEqual(entries);
  });
  it("normalizeRegistryEntries batch 13", () => {
    const entries = Array.from({ length: 4 }, (_, index) => ({
      slug: "entry-" + index,
    }));
    expect(normalizeRegistryEntries({ entries })).toEqual(entries);
  });
  it("normalizeRegistryEntries batch 14", () => {
    const entries = Array.from({ length: 5 }, (_, index) => ({
      slug: "entry-" + index,
    }));
    expect(normalizeRegistryEntries({ entries })).toEqual(entries);
  });
  it("normalizeRegistryEntries batch 15", () => {
    const entries = Array.from({ length: 1 }, (_, index) => ({
      slug: "entry-" + index,
    }));
    expect(normalizeRegistryEntries({ entries })).toEqual(entries);
  });
  it("normalizeRegistryEntries batch 16", () => {
    const entries = Array.from({ length: 2 }, (_, index) => ({
      slug: "entry-" + index,
    }));
    expect(normalizeRegistryEntries({ entries })).toEqual(entries);
  });
  it("normalizeRegistryEntries batch 17", () => {
    const entries = Array.from({ length: 3 }, (_, index) => ({
      slug: "entry-" + index,
    }));
    expect(normalizeRegistryEntries({ entries })).toEqual(entries);
  });
  it("normalizeRegistryEntries batch 18", () => {
    const entries = Array.from({ length: 4 }, (_, index) => ({
      slug: "entry-" + index,
    }));
    expect(normalizeRegistryEntries({ entries })).toEqual(entries);
  });
  it("normalizeRegistryEntries batch 19", () => {
    const entries = Array.from({ length: 5 }, (_, index) => ({
      slug: "entry-" + index,
    }));
    expect(normalizeRegistryEntries({ entries })).toEqual(entries);
  });
  it("normalizeRegistryEntries batch 20", () => {
    const entries = Array.from({ length: 1 }, (_, index) => ({
      slug: "entry-" + index,
    }));
    expect(normalizeRegistryEntries({ entries })).toEqual(entries);
  });
  it("normalizeRegistryEntries batch 21", () => {
    const entries = Array.from({ length: 2 }, (_, index) => ({
      slug: "entry-" + index,
    }));
    expect(normalizeRegistryEntries({ entries })).toEqual(entries);
  });
  it("normalizeRegistryEntries batch 22", () => {
    const entries = Array.from({ length: 3 }, (_, index) => ({
      slug: "entry-" + index,
    }));
    expect(normalizeRegistryEntries({ entries })).toEqual(entries);
  });
  it("normalizeRegistryEntries batch 23", () => {
    const entries = Array.from({ length: 4 }, (_, index) => ({
      slug: "entry-" + index,
    }));
    expect(normalizeRegistryEntries({ entries })).toEqual(entries);
  });
  it("normalizeRegistryEntries batch 24", () => {
    const entries = Array.from({ length: 5 }, (_, index) => ({
      slug: "entry-" + index,
    }));
    expect(normalizeRegistryEntries({ entries })).toEqual(entries);
  });
  it("normalizeRegistryEntries batch 25", () => {
    const entries = Array.from({ length: 1 }, (_, index) => ({
      slug: "entry-" + index,
    }));
    expect(normalizeRegistryEntries({ entries })).toEqual(entries);
  });
  it("normalizeRegistryEntries batch 26", () => {
    const entries = Array.from({ length: 2 }, (_, index) => ({
      slug: "entry-" + index,
    }));
    expect(normalizeRegistryEntries({ entries })).toEqual(entries);
  });
  it("normalizeRegistryEntries batch 27", () => {
    const entries = Array.from({ length: 3 }, (_, index) => ({
      slug: "entry-" + index,
    }));
    expect(normalizeRegistryEntries({ entries })).toEqual(entries);
  });
  it("normalizeRegistryEntries batch 28", () => {
    const entries = Array.from({ length: 4 }, (_, index) => ({
      slug: "entry-" + index,
    }));
    expect(normalizeRegistryEntries({ entries })).toEqual(entries);
  });
  it("normalizeRegistryEntries batch 29", () => {
    const entries = Array.from({ length: 5 }, (_, index) => ({
      slug: "entry-" + index,
    }));
    expect(normalizeRegistryEntries({ entries })).toEqual(entries);
  });
  it("normalizeRegistryEntries batch 30", () => {
    const entries = Array.from({ length: 1 }, (_, index) => ({
      slug: "entry-" + index,
    }));
    expect(normalizeRegistryEntries({ entries })).toEqual(entries);
  });
  it("normalizeRegistryEntries batch 31", () => {
    const entries = Array.from({ length: 2 }, (_, index) => ({
      slug: "entry-" + index,
    }));
    expect(normalizeRegistryEntries({ entries })).toEqual(entries);
  });
  it("normalizeRegistryEntries batch 32", () => {
    const entries = Array.from({ length: 3 }, (_, index) => ({
      slug: "entry-" + index,
    }));
    expect(normalizeRegistryEntries({ entries })).toEqual(entries);
  });
  it("normalizeRegistryEntries batch 33", () => {
    const entries = Array.from({ length: 4 }, (_, index) => ({
      slug: "entry-" + index,
    }));
    expect(normalizeRegistryEntries({ entries })).toEqual(entries);
  });
  it("normalizeRegistryEntries batch 34", () => {
    const entries = Array.from({ length: 5 }, (_, index) => ({
      slug: "entry-" + index,
    }));
    expect(normalizeRegistryEntries({ entries })).toEqual(entries);
  });
  it("normalizeRegistryEntries batch 35", () => {
    const entries = Array.from({ length: 1 }, (_, index) => ({
      slug: "entry-" + index,
    }));
    expect(normalizeRegistryEntries({ entries })).toEqual(entries);
  });
  it("normalizeRegistryEntries batch 36", () => {
    const entries = Array.from({ length: 2 }, (_, index) => ({
      slug: "entry-" + index,
    }));
    expect(normalizeRegistryEntries({ entries })).toEqual(entries);
  });
  it("normalizeRegistryEntries batch 37", () => {
    const entries = Array.from({ length: 3 }, (_, index) => ({
      slug: "entry-" + index,
    }));
    expect(normalizeRegistryEntries({ entries })).toEqual(entries);
  });
  it("normalizeRegistryEntries batch 38", () => {
    const entries = Array.from({ length: 4 }, (_, index) => ({
      slug: "entry-" + index,
    }));
    expect(normalizeRegistryEntries({ entries })).toEqual(entries);
  });
  it("normalizeRegistryEntries batch 39", () => {
    const entries = Array.from({ length: 5 }, (_, index) => ({
      slug: "entry-" + index,
    }));
    expect(normalizeRegistryEntries({ entries })).toEqual(entries);
  });
});
