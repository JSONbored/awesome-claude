import { describe, expect, it } from "vitest";

import {
  buildLlmsTxt,
  buildLlmsFullTxt,
  originOf,
} from "../apps/web/src/lib/llms-surface-lib";

const FIXTURE_CATEGORIES = [
  { id: "agents", label: "Agents" },
  { id: "mcp", label: "Mcp" },
  { id: "tools", label: "Tools" },
  { id: "skills", label: "Skills" },
  { id: "rules", label: "Rules" },
  { id: "commands", label: "Commands" },
  { id: "hooks", label: "Hooks" },
  { id: "guides", label: "Guides" },
  { id: "collections", label: "Collections" },
  { id: "statuslines", label: "Statuslines" },
];

function fixtureEntry(category, slug, overrides = {}) {
  return {
    category,
    slug,
    title: `${category} ${slug}`,
    description: `Description for ${category}/${slug}`,
    cardDescription: `Card for ${slug}`,
    author: "Fixture Author",
    trust: "trusted",
    source: "github",
    ...overrides,
  };
}

describe("llms-surface-lib buildLlmsTxt", () => {
  it("renders header, site links, and optional section", () => {
    const output = buildLlmsTxt("https://heyclau.de", {
      categories: FIXTURE_CATEGORIES,
      entries: [],
    });
    expect(output).toContain("# HeyClaude registry");
    expect(output).toContain("Site: https://heyclau.de");
    expect(output).toContain("Feeds: https://heyclau.de/feeds");
    expect(output).toContain("## Optional");
    expect(output).toContain("[Full corpus](https://heyclau.de/llms-full.txt)");
    expect(output).toContain(
      "[Trust methodology](https://heyclau.de/quality#methodology)",
    );
  });

  it("buildLlmsTxt lists agents/agents-llms-0", () => {
    const entries = [fixtureEntry("agents", "agents-llms-0")];
    const output = buildLlmsTxt("https://heyclau.de", {
      categories: FIXTURE_CATEGORIES,
      entries,
    });
    expect(output).toContain("## Agents");
    expect(output).toContain(
      "[agents agents-llms-0](https://heyclau.de/entry/agents/agents-llms-0)",
    );
    expect(output).toContain("Card for agents-llms-0");
  });
  it("buildLlmsTxt lists agents/agents-llms-1", () => {
    const entries = [fixtureEntry("agents", "agents-llms-1")];
    const output = buildLlmsTxt("https://heyclau.de", {
      categories: FIXTURE_CATEGORIES,
      entries,
    });
    expect(output).toContain("## Agents");
    expect(output).toContain(
      "[agents agents-llms-1](https://heyclau.de/entry/agents/agents-llms-1)",
    );
    expect(output).toContain("Card for agents-llms-1");
  });
  it("buildLlmsTxt lists agents/agents-llms-2", () => {
    const entries = [fixtureEntry("agents", "agents-llms-2")];
    const output = buildLlmsTxt("https://heyclau.de", {
      categories: FIXTURE_CATEGORIES,
      entries,
    });
    expect(output).toContain("## Agents");
    expect(output).toContain(
      "[agents agents-llms-2](https://heyclau.de/entry/agents/agents-llms-2)",
    );
    expect(output).toContain("Card for agents-llms-2");
  });
  it("buildLlmsTxt lists agents/agents-llms-3", () => {
    const entries = [fixtureEntry("agents", "agents-llms-3")];
    const output = buildLlmsTxt("https://heyclau.de", {
      categories: FIXTURE_CATEGORIES,
      entries,
    });
    expect(output).toContain("## Agents");
    expect(output).toContain(
      "[agents agents-llms-3](https://heyclau.de/entry/agents/agents-llms-3)",
    );
    expect(output).toContain("Card for agents-llms-3");
  });
  it("buildLlmsTxt lists agents/agents-llms-4", () => {
    const entries = [fixtureEntry("agents", "agents-llms-4")];
    const output = buildLlmsTxt("https://heyclau.de", {
      categories: FIXTURE_CATEGORIES,
      entries,
    });
    expect(output).toContain("## Agents");
    expect(output).toContain(
      "[agents agents-llms-4](https://heyclau.de/entry/agents/agents-llms-4)",
    );
    expect(output).toContain("Card for agents-llms-4");
  });
  it("buildLlmsTxt lists agents/agents-llms-5", () => {
    const entries = [fixtureEntry("agents", "agents-llms-5")];
    const output = buildLlmsTxt("https://heyclau.de", {
      categories: FIXTURE_CATEGORIES,
      entries,
    });
    expect(output).toContain("## Agents");
    expect(output).toContain(
      "[agents agents-llms-5](https://heyclau.de/entry/agents/agents-llms-5)",
    );
    expect(output).toContain("Card for agents-llms-5");
  });
  it("buildLlmsTxt lists agents/agents-llms-6", () => {
    const entries = [fixtureEntry("agents", "agents-llms-6")];
    const output = buildLlmsTxt("https://heyclau.de", {
      categories: FIXTURE_CATEGORIES,
      entries,
    });
    expect(output).toContain("## Agents");
    expect(output).toContain(
      "[agents agents-llms-6](https://heyclau.de/entry/agents/agents-llms-6)",
    );
    expect(output).toContain("Card for agents-llms-6");
  });
  it("buildLlmsTxt lists agents/agents-llms-7", () => {
    const entries = [fixtureEntry("agents", "agents-llms-7")];
    const output = buildLlmsTxt("https://heyclau.de", {
      categories: FIXTURE_CATEGORIES,
      entries,
    });
    expect(output).toContain("## Agents");
    expect(output).toContain(
      "[agents agents-llms-7](https://heyclau.de/entry/agents/agents-llms-7)",
    );
    expect(output).toContain("Card for agents-llms-7");
  });
  it("buildLlmsTxt lists agents/agents-llms-8", () => {
    const entries = [fixtureEntry("agents", "agents-llms-8")];
    const output = buildLlmsTxt("https://heyclau.de", {
      categories: FIXTURE_CATEGORIES,
      entries,
    });
    expect(output).toContain("## Agents");
    expect(output).toContain(
      "[agents agents-llms-8](https://heyclau.de/entry/agents/agents-llms-8)",
    );
    expect(output).toContain("Card for agents-llms-8");
  });
  it("buildLlmsTxt lists agents/agents-llms-9", () => {
    const entries = [fixtureEntry("agents", "agents-llms-9")];
    const output = buildLlmsTxt("https://heyclau.de", {
      categories: FIXTURE_CATEGORIES,
      entries,
    });
    expect(output).toContain("## Agents");
    expect(output).toContain(
      "[agents agents-llms-9](https://heyclau.de/entry/agents/agents-llms-9)",
    );
    expect(output).toContain("Card for agents-llms-9");
  });
  it("buildLlmsTxt lists agents/agents-llms-10", () => {
    const entries = [fixtureEntry("agents", "agents-llms-10")];
    const output = buildLlmsTxt("https://heyclau.de", {
      categories: FIXTURE_CATEGORIES,
      entries,
    });
    expect(output).toContain("## Agents");
    expect(output).toContain(
      "[agents agents-llms-10](https://heyclau.de/entry/agents/agents-llms-10)",
    );
    expect(output).toContain("Card for agents-llms-10");
  });
  it("buildLlmsTxt lists agents/agents-llms-11", () => {
    const entries = [fixtureEntry("agents", "agents-llms-11")];
    const output = buildLlmsTxt("https://heyclau.de", {
      categories: FIXTURE_CATEGORIES,
      entries,
    });
    expect(output).toContain("## Agents");
    expect(output).toContain(
      "[agents agents-llms-11](https://heyclau.de/entry/agents/agents-llms-11)",
    );
    expect(output).toContain("Card for agents-llms-11");
  });
  it("buildLlmsTxt lists agents/agents-llms-12", () => {
    const entries = [fixtureEntry("agents", "agents-llms-12")];
    const output = buildLlmsTxt("https://heyclau.de", {
      categories: FIXTURE_CATEGORIES,
      entries,
    });
    expect(output).toContain("## Agents");
    expect(output).toContain(
      "[agents agents-llms-12](https://heyclau.de/entry/agents/agents-llms-12)",
    );
    expect(output).toContain("Card for agents-llms-12");
  });
  it("buildLlmsTxt lists agents/agents-llms-13", () => {
    const entries = [fixtureEntry("agents", "agents-llms-13")];
    const output = buildLlmsTxt("https://heyclau.de", {
      categories: FIXTURE_CATEGORIES,
      entries,
    });
    expect(output).toContain("## Agents");
    expect(output).toContain(
      "[agents agents-llms-13](https://heyclau.de/entry/agents/agents-llms-13)",
    );
    expect(output).toContain("Card for agents-llms-13");
  });
  it("buildLlmsTxt lists agents/agents-llms-14", () => {
    const entries = [fixtureEntry("agents", "agents-llms-14")];
    const output = buildLlmsTxt("https://heyclau.de", {
      categories: FIXTURE_CATEGORIES,
      entries,
    });
    expect(output).toContain("## Agents");
    expect(output).toContain(
      "[agents agents-llms-14](https://heyclau.de/entry/agents/agents-llms-14)",
    );
    expect(output).toContain("Card for agents-llms-14");
  });
  it("buildLlmsTxt lists mcp/mcp-llms-0", () => {
    const entries = [fixtureEntry("mcp", "mcp-llms-0")];
    const output = buildLlmsTxt("https://heyclau.de", {
      categories: FIXTURE_CATEGORIES,
      entries,
    });
    expect(output).toContain("## Mcp");
    expect(output).toContain(
      "[mcp mcp-llms-0](https://heyclau.de/entry/mcp/mcp-llms-0)",
    );
    expect(output).toContain("Card for mcp-llms-0");
  });
  it("buildLlmsTxt lists mcp/mcp-llms-1", () => {
    const entries = [fixtureEntry("mcp", "mcp-llms-1")];
    const output = buildLlmsTxt("https://heyclau.de", {
      categories: FIXTURE_CATEGORIES,
      entries,
    });
    expect(output).toContain("## Mcp");
    expect(output).toContain(
      "[mcp mcp-llms-1](https://heyclau.de/entry/mcp/mcp-llms-1)",
    );
    expect(output).toContain("Card for mcp-llms-1");
  });
  it("buildLlmsTxt lists mcp/mcp-llms-2", () => {
    const entries = [fixtureEntry("mcp", "mcp-llms-2")];
    const output = buildLlmsTxt("https://heyclau.de", {
      categories: FIXTURE_CATEGORIES,
      entries,
    });
    expect(output).toContain("## Mcp");
    expect(output).toContain(
      "[mcp mcp-llms-2](https://heyclau.de/entry/mcp/mcp-llms-2)",
    );
    expect(output).toContain("Card for mcp-llms-2");
  });
  it("buildLlmsTxt lists mcp/mcp-llms-3", () => {
    const entries = [fixtureEntry("mcp", "mcp-llms-3")];
    const output = buildLlmsTxt("https://heyclau.de", {
      categories: FIXTURE_CATEGORIES,
      entries,
    });
    expect(output).toContain("## Mcp");
    expect(output).toContain(
      "[mcp mcp-llms-3](https://heyclau.de/entry/mcp/mcp-llms-3)",
    );
    expect(output).toContain("Card for mcp-llms-3");
  });
  it("buildLlmsTxt lists mcp/mcp-llms-4", () => {
    const entries = [fixtureEntry("mcp", "mcp-llms-4")];
    const output = buildLlmsTxt("https://heyclau.de", {
      categories: FIXTURE_CATEGORIES,
      entries,
    });
    expect(output).toContain("## Mcp");
    expect(output).toContain(
      "[mcp mcp-llms-4](https://heyclau.de/entry/mcp/mcp-llms-4)",
    );
    expect(output).toContain("Card for mcp-llms-4");
  });
  it("buildLlmsTxt lists mcp/mcp-llms-5", () => {
    const entries = [fixtureEntry("mcp", "mcp-llms-5")];
    const output = buildLlmsTxt("https://heyclau.de", {
      categories: FIXTURE_CATEGORIES,
      entries,
    });
    expect(output).toContain("## Mcp");
    expect(output).toContain(
      "[mcp mcp-llms-5](https://heyclau.de/entry/mcp/mcp-llms-5)",
    );
    expect(output).toContain("Card for mcp-llms-5");
  });
  it("buildLlmsTxt lists mcp/mcp-llms-6", () => {
    const entries = [fixtureEntry("mcp", "mcp-llms-6")];
    const output = buildLlmsTxt("https://heyclau.de", {
      categories: FIXTURE_CATEGORIES,
      entries,
    });
    expect(output).toContain("## Mcp");
    expect(output).toContain(
      "[mcp mcp-llms-6](https://heyclau.de/entry/mcp/mcp-llms-6)",
    );
    expect(output).toContain("Card for mcp-llms-6");
  });
  it("buildLlmsTxt lists mcp/mcp-llms-7", () => {
    const entries = [fixtureEntry("mcp", "mcp-llms-7")];
    const output = buildLlmsTxt("https://heyclau.de", {
      categories: FIXTURE_CATEGORIES,
      entries,
    });
    expect(output).toContain("## Mcp");
    expect(output).toContain(
      "[mcp mcp-llms-7](https://heyclau.de/entry/mcp/mcp-llms-7)",
    );
    expect(output).toContain("Card for mcp-llms-7");
  });
  it("buildLlmsTxt lists mcp/mcp-llms-8", () => {
    const entries = [fixtureEntry("mcp", "mcp-llms-8")];
    const output = buildLlmsTxt("https://heyclau.de", {
      categories: FIXTURE_CATEGORIES,
      entries,
    });
    expect(output).toContain("## Mcp");
    expect(output).toContain(
      "[mcp mcp-llms-8](https://heyclau.de/entry/mcp/mcp-llms-8)",
    );
    expect(output).toContain("Card for mcp-llms-8");
  });
  it("buildLlmsTxt lists mcp/mcp-llms-9", () => {
    const entries = [fixtureEntry("mcp", "mcp-llms-9")];
    const output = buildLlmsTxt("https://heyclau.de", {
      categories: FIXTURE_CATEGORIES,
      entries,
    });
    expect(output).toContain("## Mcp");
    expect(output).toContain(
      "[mcp mcp-llms-9](https://heyclau.de/entry/mcp/mcp-llms-9)",
    );
    expect(output).toContain("Card for mcp-llms-9");
  });
  it("buildLlmsTxt lists mcp/mcp-llms-10", () => {
    const entries = [fixtureEntry("mcp", "mcp-llms-10")];
    const output = buildLlmsTxt("https://heyclau.de", {
      categories: FIXTURE_CATEGORIES,
      entries,
    });
    expect(output).toContain("## Mcp");
    expect(output).toContain(
      "[mcp mcp-llms-10](https://heyclau.de/entry/mcp/mcp-llms-10)",
    );
    expect(output).toContain("Card for mcp-llms-10");
  });
  it("buildLlmsTxt lists mcp/mcp-llms-11", () => {
    const entries = [fixtureEntry("mcp", "mcp-llms-11")];
    const output = buildLlmsTxt("https://heyclau.de", {
      categories: FIXTURE_CATEGORIES,
      entries,
    });
    expect(output).toContain("## Mcp");
    expect(output).toContain(
      "[mcp mcp-llms-11](https://heyclau.de/entry/mcp/mcp-llms-11)",
    );
    expect(output).toContain("Card for mcp-llms-11");
  });
  it("buildLlmsTxt lists mcp/mcp-llms-12", () => {
    const entries = [fixtureEntry("mcp", "mcp-llms-12")];
    const output = buildLlmsTxt("https://heyclau.de", {
      categories: FIXTURE_CATEGORIES,
      entries,
    });
    expect(output).toContain("## Mcp");
    expect(output).toContain(
      "[mcp mcp-llms-12](https://heyclau.de/entry/mcp/mcp-llms-12)",
    );
    expect(output).toContain("Card for mcp-llms-12");
  });
  it("buildLlmsTxt lists mcp/mcp-llms-13", () => {
    const entries = [fixtureEntry("mcp", "mcp-llms-13")];
    const output = buildLlmsTxt("https://heyclau.de", {
      categories: FIXTURE_CATEGORIES,
      entries,
    });
    expect(output).toContain("## Mcp");
    expect(output).toContain(
      "[mcp mcp-llms-13](https://heyclau.de/entry/mcp/mcp-llms-13)",
    );
    expect(output).toContain("Card for mcp-llms-13");
  });
  it("buildLlmsTxt lists mcp/mcp-llms-14", () => {
    const entries = [fixtureEntry("mcp", "mcp-llms-14")];
    const output = buildLlmsTxt("https://heyclau.de", {
      categories: FIXTURE_CATEGORIES,
      entries,
    });
    expect(output).toContain("## Mcp");
    expect(output).toContain(
      "[mcp mcp-llms-14](https://heyclau.de/entry/mcp/mcp-llms-14)",
    );
    expect(output).toContain("Card for mcp-llms-14");
  });
  it("buildLlmsTxt lists tools/tools-llms-0", () => {
    const entries = [fixtureEntry("tools", "tools-llms-0")];
    const output = buildLlmsTxt("https://heyclau.de", {
      categories: FIXTURE_CATEGORIES,
      entries,
    });
    expect(output).toContain("## Tools");
    expect(output).toContain(
      "[tools tools-llms-0](https://heyclau.de/entry/tools/tools-llms-0)",
    );
    expect(output).toContain("Card for tools-llms-0");
  });
  it("buildLlmsTxt lists tools/tools-llms-1", () => {
    const entries = [fixtureEntry("tools", "tools-llms-1")];
    const output = buildLlmsTxt("https://heyclau.de", {
      categories: FIXTURE_CATEGORIES,
      entries,
    });
    expect(output).toContain("## Tools");
    expect(output).toContain(
      "[tools tools-llms-1](https://heyclau.de/entry/tools/tools-llms-1)",
    );
    expect(output).toContain("Card for tools-llms-1");
  });
  it("buildLlmsTxt lists tools/tools-llms-2", () => {
    const entries = [fixtureEntry("tools", "tools-llms-2")];
    const output = buildLlmsTxt("https://heyclau.de", {
      categories: FIXTURE_CATEGORIES,
      entries,
    });
    expect(output).toContain("## Tools");
    expect(output).toContain(
      "[tools tools-llms-2](https://heyclau.de/entry/tools/tools-llms-2)",
    );
    expect(output).toContain("Card for tools-llms-2");
  });
  it("buildLlmsTxt lists tools/tools-llms-3", () => {
    const entries = [fixtureEntry("tools", "tools-llms-3")];
    const output = buildLlmsTxt("https://heyclau.de", {
      categories: FIXTURE_CATEGORIES,
      entries,
    });
    expect(output).toContain("## Tools");
    expect(output).toContain(
      "[tools tools-llms-3](https://heyclau.de/entry/tools/tools-llms-3)",
    );
    expect(output).toContain("Card for tools-llms-3");
  });
  it("buildLlmsTxt lists tools/tools-llms-4", () => {
    const entries = [fixtureEntry("tools", "tools-llms-4")];
    const output = buildLlmsTxt("https://heyclau.de", {
      categories: FIXTURE_CATEGORIES,
      entries,
    });
    expect(output).toContain("## Tools");
    expect(output).toContain(
      "[tools tools-llms-4](https://heyclau.de/entry/tools/tools-llms-4)",
    );
    expect(output).toContain("Card for tools-llms-4");
  });
  it("buildLlmsTxt lists tools/tools-llms-5", () => {
    const entries = [fixtureEntry("tools", "tools-llms-5")];
    const output = buildLlmsTxt("https://heyclau.de", {
      categories: FIXTURE_CATEGORIES,
      entries,
    });
    expect(output).toContain("## Tools");
    expect(output).toContain(
      "[tools tools-llms-5](https://heyclau.de/entry/tools/tools-llms-5)",
    );
    expect(output).toContain("Card for tools-llms-5");
  });
  it("buildLlmsTxt lists tools/tools-llms-6", () => {
    const entries = [fixtureEntry("tools", "tools-llms-6")];
    const output = buildLlmsTxt("https://heyclau.de", {
      categories: FIXTURE_CATEGORIES,
      entries,
    });
    expect(output).toContain("## Tools");
    expect(output).toContain(
      "[tools tools-llms-6](https://heyclau.de/entry/tools/tools-llms-6)",
    );
    expect(output).toContain("Card for tools-llms-6");
  });
  it("buildLlmsTxt lists tools/tools-llms-7", () => {
    const entries = [fixtureEntry("tools", "tools-llms-7")];
    const output = buildLlmsTxt("https://heyclau.de", {
      categories: FIXTURE_CATEGORIES,
      entries,
    });
    expect(output).toContain("## Tools");
    expect(output).toContain(
      "[tools tools-llms-7](https://heyclau.de/entry/tools/tools-llms-7)",
    );
    expect(output).toContain("Card for tools-llms-7");
  });
  it("buildLlmsTxt lists tools/tools-llms-8", () => {
    const entries = [fixtureEntry("tools", "tools-llms-8")];
    const output = buildLlmsTxt("https://heyclau.de", {
      categories: FIXTURE_CATEGORIES,
      entries,
    });
    expect(output).toContain("## Tools");
    expect(output).toContain(
      "[tools tools-llms-8](https://heyclau.de/entry/tools/tools-llms-8)",
    );
    expect(output).toContain("Card for tools-llms-8");
  });
  it("buildLlmsTxt lists tools/tools-llms-9", () => {
    const entries = [fixtureEntry("tools", "tools-llms-9")];
    const output = buildLlmsTxt("https://heyclau.de", {
      categories: FIXTURE_CATEGORIES,
      entries,
    });
    expect(output).toContain("## Tools");
    expect(output).toContain(
      "[tools tools-llms-9](https://heyclau.de/entry/tools/tools-llms-9)",
    );
    expect(output).toContain("Card for tools-llms-9");
  });
  it("buildLlmsTxt lists tools/tools-llms-10", () => {
    const entries = [fixtureEntry("tools", "tools-llms-10")];
    const output = buildLlmsTxt("https://heyclau.de", {
      categories: FIXTURE_CATEGORIES,
      entries,
    });
    expect(output).toContain("## Tools");
    expect(output).toContain(
      "[tools tools-llms-10](https://heyclau.de/entry/tools/tools-llms-10)",
    );
    expect(output).toContain("Card for tools-llms-10");
  });
  it("buildLlmsTxt lists tools/tools-llms-11", () => {
    const entries = [fixtureEntry("tools", "tools-llms-11")];
    const output = buildLlmsTxt("https://heyclau.de", {
      categories: FIXTURE_CATEGORIES,
      entries,
    });
    expect(output).toContain("## Tools");
    expect(output).toContain(
      "[tools tools-llms-11](https://heyclau.de/entry/tools/tools-llms-11)",
    );
    expect(output).toContain("Card for tools-llms-11");
  });
  it("buildLlmsTxt lists tools/tools-llms-12", () => {
    const entries = [fixtureEntry("tools", "tools-llms-12")];
    const output = buildLlmsTxt("https://heyclau.de", {
      categories: FIXTURE_CATEGORIES,
      entries,
    });
    expect(output).toContain("## Tools");
    expect(output).toContain(
      "[tools tools-llms-12](https://heyclau.de/entry/tools/tools-llms-12)",
    );
    expect(output).toContain("Card for tools-llms-12");
  });
  it("buildLlmsTxt lists tools/tools-llms-13", () => {
    const entries = [fixtureEntry("tools", "tools-llms-13")];
    const output = buildLlmsTxt("https://heyclau.de", {
      categories: FIXTURE_CATEGORIES,
      entries,
    });
    expect(output).toContain("## Tools");
    expect(output).toContain(
      "[tools tools-llms-13](https://heyclau.de/entry/tools/tools-llms-13)",
    );
    expect(output).toContain("Card for tools-llms-13");
  });
  it("buildLlmsTxt lists tools/tools-llms-14", () => {
    const entries = [fixtureEntry("tools", "tools-llms-14")];
    const output = buildLlmsTxt("https://heyclau.de", {
      categories: FIXTURE_CATEGORIES,
      entries,
    });
    expect(output).toContain("## Tools");
    expect(output).toContain(
      "[tools tools-llms-14](https://heyclau.de/entry/tools/tools-llms-14)",
    );
    expect(output).toContain("Card for tools-llms-14");
  });
  it("buildLlmsTxt lists skills/skills-llms-0", () => {
    const entries = [fixtureEntry("skills", "skills-llms-0")];
    const output = buildLlmsTxt("https://heyclau.de", {
      categories: FIXTURE_CATEGORIES,
      entries,
    });
    expect(output).toContain("## Skills");
    expect(output).toContain(
      "[skills skills-llms-0](https://heyclau.de/entry/skills/skills-llms-0)",
    );
    expect(output).toContain("Card for skills-llms-0");
  });
  it("buildLlmsTxt lists skills/skills-llms-1", () => {
    const entries = [fixtureEntry("skills", "skills-llms-1")];
    const output = buildLlmsTxt("https://heyclau.de", {
      categories: FIXTURE_CATEGORIES,
      entries,
    });
    expect(output).toContain("## Skills");
    expect(output).toContain(
      "[skills skills-llms-1](https://heyclau.de/entry/skills/skills-llms-1)",
    );
    expect(output).toContain("Card for skills-llms-1");
  });
  it("buildLlmsTxt lists skills/skills-llms-2", () => {
    const entries = [fixtureEntry("skills", "skills-llms-2")];
    const output = buildLlmsTxt("https://heyclau.de", {
      categories: FIXTURE_CATEGORIES,
      entries,
    });
    expect(output).toContain("## Skills");
    expect(output).toContain(
      "[skills skills-llms-2](https://heyclau.de/entry/skills/skills-llms-2)",
    );
    expect(output).toContain("Card for skills-llms-2");
  });
  it("buildLlmsTxt lists skills/skills-llms-3", () => {
    const entries = [fixtureEntry("skills", "skills-llms-3")];
    const output = buildLlmsTxt("https://heyclau.de", {
      categories: FIXTURE_CATEGORIES,
      entries,
    });
    expect(output).toContain("## Skills");
    expect(output).toContain(
      "[skills skills-llms-3](https://heyclau.de/entry/skills/skills-llms-3)",
    );
    expect(output).toContain("Card for skills-llms-3");
  });
  it("buildLlmsTxt lists skills/skills-llms-4", () => {
    const entries = [fixtureEntry("skills", "skills-llms-4")];
    const output = buildLlmsTxt("https://heyclau.de", {
      categories: FIXTURE_CATEGORIES,
      entries,
    });
    expect(output).toContain("## Skills");
    expect(output).toContain(
      "[skills skills-llms-4](https://heyclau.de/entry/skills/skills-llms-4)",
    );
    expect(output).toContain("Card for skills-llms-4");
  });
  it("buildLlmsTxt lists skills/skills-llms-5", () => {
    const entries = [fixtureEntry("skills", "skills-llms-5")];
    const output = buildLlmsTxt("https://heyclau.de", {
      categories: FIXTURE_CATEGORIES,
      entries,
    });
    expect(output).toContain("## Skills");
    expect(output).toContain(
      "[skills skills-llms-5](https://heyclau.de/entry/skills/skills-llms-5)",
    );
    expect(output).toContain("Card for skills-llms-5");
  });
  it("buildLlmsTxt lists skills/skills-llms-6", () => {
    const entries = [fixtureEntry("skills", "skills-llms-6")];
    const output = buildLlmsTxt("https://heyclau.de", {
      categories: FIXTURE_CATEGORIES,
      entries,
    });
    expect(output).toContain("## Skills");
    expect(output).toContain(
      "[skills skills-llms-6](https://heyclau.de/entry/skills/skills-llms-6)",
    );
    expect(output).toContain("Card for skills-llms-6");
  });
  it("buildLlmsTxt lists skills/skills-llms-7", () => {
    const entries = [fixtureEntry("skills", "skills-llms-7")];
    const output = buildLlmsTxt("https://heyclau.de", {
      categories: FIXTURE_CATEGORIES,
      entries,
    });
    expect(output).toContain("## Skills");
    expect(output).toContain(
      "[skills skills-llms-7](https://heyclau.de/entry/skills/skills-llms-7)",
    );
    expect(output).toContain("Card for skills-llms-7");
  });
  it("buildLlmsTxt lists skills/skills-llms-8", () => {
    const entries = [fixtureEntry("skills", "skills-llms-8")];
    const output = buildLlmsTxt("https://heyclau.de", {
      categories: FIXTURE_CATEGORIES,
      entries,
    });
    expect(output).toContain("## Skills");
    expect(output).toContain(
      "[skills skills-llms-8](https://heyclau.de/entry/skills/skills-llms-8)",
    );
    expect(output).toContain("Card for skills-llms-8");
  });
  it("buildLlmsTxt lists skills/skills-llms-9", () => {
    const entries = [fixtureEntry("skills", "skills-llms-9")];
    const output = buildLlmsTxt("https://heyclau.de", {
      categories: FIXTURE_CATEGORIES,
      entries,
    });
    expect(output).toContain("## Skills");
    expect(output).toContain(
      "[skills skills-llms-9](https://heyclau.de/entry/skills/skills-llms-9)",
    );
    expect(output).toContain("Card for skills-llms-9");
  });
  it("buildLlmsTxt lists skills/skills-llms-10", () => {
    const entries = [fixtureEntry("skills", "skills-llms-10")];
    const output = buildLlmsTxt("https://heyclau.de", {
      categories: FIXTURE_CATEGORIES,
      entries,
    });
    expect(output).toContain("## Skills");
    expect(output).toContain(
      "[skills skills-llms-10](https://heyclau.de/entry/skills/skills-llms-10)",
    );
    expect(output).toContain("Card for skills-llms-10");
  });
  it("buildLlmsTxt lists skills/skills-llms-11", () => {
    const entries = [fixtureEntry("skills", "skills-llms-11")];
    const output = buildLlmsTxt("https://heyclau.de", {
      categories: FIXTURE_CATEGORIES,
      entries,
    });
    expect(output).toContain("## Skills");
    expect(output).toContain(
      "[skills skills-llms-11](https://heyclau.de/entry/skills/skills-llms-11)",
    );
    expect(output).toContain("Card for skills-llms-11");
  });
  it("buildLlmsTxt lists skills/skills-llms-12", () => {
    const entries = [fixtureEntry("skills", "skills-llms-12")];
    const output = buildLlmsTxt("https://heyclau.de", {
      categories: FIXTURE_CATEGORIES,
      entries,
    });
    expect(output).toContain("## Skills");
    expect(output).toContain(
      "[skills skills-llms-12](https://heyclau.de/entry/skills/skills-llms-12)",
    );
    expect(output).toContain("Card for skills-llms-12");
  });
  it("buildLlmsTxt lists skills/skills-llms-13", () => {
    const entries = [fixtureEntry("skills", "skills-llms-13")];
    const output = buildLlmsTxt("https://heyclau.de", {
      categories: FIXTURE_CATEGORIES,
      entries,
    });
    expect(output).toContain("## Skills");
    expect(output).toContain(
      "[skills skills-llms-13](https://heyclau.de/entry/skills/skills-llms-13)",
    );
    expect(output).toContain("Card for skills-llms-13");
  });
  it("buildLlmsTxt lists skills/skills-llms-14", () => {
    const entries = [fixtureEntry("skills", "skills-llms-14")];
    const output = buildLlmsTxt("https://heyclau.de", {
      categories: FIXTURE_CATEGORIES,
      entries,
    });
    expect(output).toContain("## Skills");
    expect(output).toContain(
      "[skills skills-llms-14](https://heyclau.de/entry/skills/skills-llms-14)",
    );
    expect(output).toContain("Card for skills-llms-14");
  });
  it("buildLlmsTxt lists rules/rules-llms-0", () => {
    const entries = [fixtureEntry("rules", "rules-llms-0")];
    const output = buildLlmsTxt("https://heyclau.de", {
      categories: FIXTURE_CATEGORIES,
      entries,
    });
    expect(output).toContain("## Rules");
    expect(output).toContain(
      "[rules rules-llms-0](https://heyclau.de/entry/rules/rules-llms-0)",
    );
    expect(output).toContain("Card for rules-llms-0");
  });
  it("buildLlmsTxt lists rules/rules-llms-1", () => {
    const entries = [fixtureEntry("rules", "rules-llms-1")];
    const output = buildLlmsTxt("https://heyclau.de", {
      categories: FIXTURE_CATEGORIES,
      entries,
    });
    expect(output).toContain("## Rules");
    expect(output).toContain(
      "[rules rules-llms-1](https://heyclau.de/entry/rules/rules-llms-1)",
    );
    expect(output).toContain("Card for rules-llms-1");
  });
  it("buildLlmsTxt lists rules/rules-llms-2", () => {
    const entries = [fixtureEntry("rules", "rules-llms-2")];
    const output = buildLlmsTxt("https://heyclau.de", {
      categories: FIXTURE_CATEGORIES,
      entries,
    });
    expect(output).toContain("## Rules");
    expect(output).toContain(
      "[rules rules-llms-2](https://heyclau.de/entry/rules/rules-llms-2)",
    );
    expect(output).toContain("Card for rules-llms-2");
  });
  it("buildLlmsTxt lists rules/rules-llms-3", () => {
    const entries = [fixtureEntry("rules", "rules-llms-3")];
    const output = buildLlmsTxt("https://heyclau.de", {
      categories: FIXTURE_CATEGORIES,
      entries,
    });
    expect(output).toContain("## Rules");
    expect(output).toContain(
      "[rules rules-llms-3](https://heyclau.de/entry/rules/rules-llms-3)",
    );
    expect(output).toContain("Card for rules-llms-3");
  });
  it("buildLlmsTxt lists rules/rules-llms-4", () => {
    const entries = [fixtureEntry("rules", "rules-llms-4")];
    const output = buildLlmsTxt("https://heyclau.de", {
      categories: FIXTURE_CATEGORIES,
      entries,
    });
    expect(output).toContain("## Rules");
    expect(output).toContain(
      "[rules rules-llms-4](https://heyclau.de/entry/rules/rules-llms-4)",
    );
    expect(output).toContain("Card for rules-llms-4");
  });
  it("buildLlmsTxt lists rules/rules-llms-5", () => {
    const entries = [fixtureEntry("rules", "rules-llms-5")];
    const output = buildLlmsTxt("https://heyclau.de", {
      categories: FIXTURE_CATEGORIES,
      entries,
    });
    expect(output).toContain("## Rules");
    expect(output).toContain(
      "[rules rules-llms-5](https://heyclau.de/entry/rules/rules-llms-5)",
    );
    expect(output).toContain("Card for rules-llms-5");
  });
  it("buildLlmsTxt lists rules/rules-llms-6", () => {
    const entries = [fixtureEntry("rules", "rules-llms-6")];
    const output = buildLlmsTxt("https://heyclau.de", {
      categories: FIXTURE_CATEGORIES,
      entries,
    });
    expect(output).toContain("## Rules");
    expect(output).toContain(
      "[rules rules-llms-6](https://heyclau.de/entry/rules/rules-llms-6)",
    );
    expect(output).toContain("Card for rules-llms-6");
  });
  it("buildLlmsTxt lists rules/rules-llms-7", () => {
    const entries = [fixtureEntry("rules", "rules-llms-7")];
    const output = buildLlmsTxt("https://heyclau.de", {
      categories: FIXTURE_CATEGORIES,
      entries,
    });
    expect(output).toContain("## Rules");
    expect(output).toContain(
      "[rules rules-llms-7](https://heyclau.de/entry/rules/rules-llms-7)",
    );
    expect(output).toContain("Card for rules-llms-7");
  });
  it("buildLlmsTxt lists rules/rules-llms-8", () => {
    const entries = [fixtureEntry("rules", "rules-llms-8")];
    const output = buildLlmsTxt("https://heyclau.de", {
      categories: FIXTURE_CATEGORIES,
      entries,
    });
    expect(output).toContain("## Rules");
    expect(output).toContain(
      "[rules rules-llms-8](https://heyclau.de/entry/rules/rules-llms-8)",
    );
    expect(output).toContain("Card for rules-llms-8");
  });
  it("buildLlmsTxt lists rules/rules-llms-9", () => {
    const entries = [fixtureEntry("rules", "rules-llms-9")];
    const output = buildLlmsTxt("https://heyclau.de", {
      categories: FIXTURE_CATEGORIES,
      entries,
    });
    expect(output).toContain("## Rules");
    expect(output).toContain(
      "[rules rules-llms-9](https://heyclau.de/entry/rules/rules-llms-9)",
    );
    expect(output).toContain("Card for rules-llms-9");
  });
  it("buildLlmsTxt lists rules/rules-llms-10", () => {
    const entries = [fixtureEntry("rules", "rules-llms-10")];
    const output = buildLlmsTxt("https://heyclau.de", {
      categories: FIXTURE_CATEGORIES,
      entries,
    });
    expect(output).toContain("## Rules");
    expect(output).toContain(
      "[rules rules-llms-10](https://heyclau.de/entry/rules/rules-llms-10)",
    );
    expect(output).toContain("Card for rules-llms-10");
  });
  it("buildLlmsTxt lists rules/rules-llms-11", () => {
    const entries = [fixtureEntry("rules", "rules-llms-11")];
    const output = buildLlmsTxt("https://heyclau.de", {
      categories: FIXTURE_CATEGORIES,
      entries,
    });
    expect(output).toContain("## Rules");
    expect(output).toContain(
      "[rules rules-llms-11](https://heyclau.de/entry/rules/rules-llms-11)",
    );
    expect(output).toContain("Card for rules-llms-11");
  });
  it("buildLlmsTxt lists rules/rules-llms-12", () => {
    const entries = [fixtureEntry("rules", "rules-llms-12")];
    const output = buildLlmsTxt("https://heyclau.de", {
      categories: FIXTURE_CATEGORIES,
      entries,
    });
    expect(output).toContain("## Rules");
    expect(output).toContain(
      "[rules rules-llms-12](https://heyclau.de/entry/rules/rules-llms-12)",
    );
    expect(output).toContain("Card for rules-llms-12");
  });
  it("buildLlmsTxt lists rules/rules-llms-13", () => {
    const entries = [fixtureEntry("rules", "rules-llms-13")];
    const output = buildLlmsTxt("https://heyclau.de", {
      categories: FIXTURE_CATEGORIES,
      entries,
    });
    expect(output).toContain("## Rules");
    expect(output).toContain(
      "[rules rules-llms-13](https://heyclau.de/entry/rules/rules-llms-13)",
    );
    expect(output).toContain("Card for rules-llms-13");
  });
  it("buildLlmsTxt lists rules/rules-llms-14", () => {
    const entries = [fixtureEntry("rules", "rules-llms-14")];
    const output = buildLlmsTxt("https://heyclau.de", {
      categories: FIXTURE_CATEGORIES,
      entries,
    });
    expect(output).toContain("## Rules");
    expect(output).toContain(
      "[rules rules-llms-14](https://heyclau.de/entry/rules/rules-llms-14)",
    );
    expect(output).toContain("Card for rules-llms-14");
  });
  it("buildLlmsTxt lists commands/commands-llms-0", () => {
    const entries = [fixtureEntry("commands", "commands-llms-0")];
    const output = buildLlmsTxt("https://heyclau.de", {
      categories: FIXTURE_CATEGORIES,
      entries,
    });
    expect(output).toContain("## Commands");
    expect(output).toContain(
      "[commands commands-llms-0](https://heyclau.de/entry/commands/commands-llms-0)",
    );
    expect(output).toContain("Card for commands-llms-0");
  });
  it("buildLlmsTxt lists commands/commands-llms-1", () => {
    const entries = [fixtureEntry("commands", "commands-llms-1")];
    const output = buildLlmsTxt("https://heyclau.de", {
      categories: FIXTURE_CATEGORIES,
      entries,
    });
    expect(output).toContain("## Commands");
    expect(output).toContain(
      "[commands commands-llms-1](https://heyclau.de/entry/commands/commands-llms-1)",
    );
    expect(output).toContain("Card for commands-llms-1");
  });
  it("buildLlmsTxt lists commands/commands-llms-2", () => {
    const entries = [fixtureEntry("commands", "commands-llms-2")];
    const output = buildLlmsTxt("https://heyclau.de", {
      categories: FIXTURE_CATEGORIES,
      entries,
    });
    expect(output).toContain("## Commands");
    expect(output).toContain(
      "[commands commands-llms-2](https://heyclau.de/entry/commands/commands-llms-2)",
    );
    expect(output).toContain("Card for commands-llms-2");
  });
  it("buildLlmsTxt lists commands/commands-llms-3", () => {
    const entries = [fixtureEntry("commands", "commands-llms-3")];
    const output = buildLlmsTxt("https://heyclau.de", {
      categories: FIXTURE_CATEGORIES,
      entries,
    });
    expect(output).toContain("## Commands");
    expect(output).toContain(
      "[commands commands-llms-3](https://heyclau.de/entry/commands/commands-llms-3)",
    );
    expect(output).toContain("Card for commands-llms-3");
  });
  it("buildLlmsTxt lists commands/commands-llms-4", () => {
    const entries = [fixtureEntry("commands", "commands-llms-4")];
    const output = buildLlmsTxt("https://heyclau.de", {
      categories: FIXTURE_CATEGORIES,
      entries,
    });
    expect(output).toContain("## Commands");
    expect(output).toContain(
      "[commands commands-llms-4](https://heyclau.de/entry/commands/commands-llms-4)",
    );
    expect(output).toContain("Card for commands-llms-4");
  });
  it("buildLlmsTxt lists commands/commands-llms-5", () => {
    const entries = [fixtureEntry("commands", "commands-llms-5")];
    const output = buildLlmsTxt("https://heyclau.de", {
      categories: FIXTURE_CATEGORIES,
      entries,
    });
    expect(output).toContain("## Commands");
    expect(output).toContain(
      "[commands commands-llms-5](https://heyclau.de/entry/commands/commands-llms-5)",
    );
    expect(output).toContain("Card for commands-llms-5");
  });
  it("buildLlmsTxt lists commands/commands-llms-6", () => {
    const entries = [fixtureEntry("commands", "commands-llms-6")];
    const output = buildLlmsTxt("https://heyclau.de", {
      categories: FIXTURE_CATEGORIES,
      entries,
    });
    expect(output).toContain("## Commands");
    expect(output).toContain(
      "[commands commands-llms-6](https://heyclau.de/entry/commands/commands-llms-6)",
    );
    expect(output).toContain("Card for commands-llms-6");
  });
  it("buildLlmsTxt lists commands/commands-llms-7", () => {
    const entries = [fixtureEntry("commands", "commands-llms-7")];
    const output = buildLlmsTxt("https://heyclau.de", {
      categories: FIXTURE_CATEGORIES,
      entries,
    });
    expect(output).toContain("## Commands");
    expect(output).toContain(
      "[commands commands-llms-7](https://heyclau.de/entry/commands/commands-llms-7)",
    );
    expect(output).toContain("Card for commands-llms-7");
  });
  it("buildLlmsTxt lists commands/commands-llms-8", () => {
    const entries = [fixtureEntry("commands", "commands-llms-8")];
    const output = buildLlmsTxt("https://heyclau.de", {
      categories: FIXTURE_CATEGORIES,
      entries,
    });
    expect(output).toContain("## Commands");
    expect(output).toContain(
      "[commands commands-llms-8](https://heyclau.de/entry/commands/commands-llms-8)",
    );
    expect(output).toContain("Card for commands-llms-8");
  });
  it("buildLlmsTxt lists commands/commands-llms-9", () => {
    const entries = [fixtureEntry("commands", "commands-llms-9")];
    const output = buildLlmsTxt("https://heyclau.de", {
      categories: FIXTURE_CATEGORIES,
      entries,
    });
    expect(output).toContain("## Commands");
    expect(output).toContain(
      "[commands commands-llms-9](https://heyclau.de/entry/commands/commands-llms-9)",
    );
    expect(output).toContain("Card for commands-llms-9");
  });
  it("buildLlmsTxt lists commands/commands-llms-10", () => {
    const entries = [fixtureEntry("commands", "commands-llms-10")];
    const output = buildLlmsTxt("https://heyclau.de", {
      categories: FIXTURE_CATEGORIES,
      entries,
    });
    expect(output).toContain("## Commands");
    expect(output).toContain(
      "[commands commands-llms-10](https://heyclau.de/entry/commands/commands-llms-10)",
    );
    expect(output).toContain("Card for commands-llms-10");
  });
  it("buildLlmsTxt lists commands/commands-llms-11", () => {
    const entries = [fixtureEntry("commands", "commands-llms-11")];
    const output = buildLlmsTxt("https://heyclau.de", {
      categories: FIXTURE_CATEGORIES,
      entries,
    });
    expect(output).toContain("## Commands");
    expect(output).toContain(
      "[commands commands-llms-11](https://heyclau.de/entry/commands/commands-llms-11)",
    );
    expect(output).toContain("Card for commands-llms-11");
  });
  it("buildLlmsTxt lists commands/commands-llms-12", () => {
    const entries = [fixtureEntry("commands", "commands-llms-12")];
    const output = buildLlmsTxt("https://heyclau.de", {
      categories: FIXTURE_CATEGORIES,
      entries,
    });
    expect(output).toContain("## Commands");
    expect(output).toContain(
      "[commands commands-llms-12](https://heyclau.de/entry/commands/commands-llms-12)",
    );
    expect(output).toContain("Card for commands-llms-12");
  });
  it("buildLlmsTxt lists commands/commands-llms-13", () => {
    const entries = [fixtureEntry("commands", "commands-llms-13")];
    const output = buildLlmsTxt("https://heyclau.de", {
      categories: FIXTURE_CATEGORIES,
      entries,
    });
    expect(output).toContain("## Commands");
    expect(output).toContain(
      "[commands commands-llms-13](https://heyclau.de/entry/commands/commands-llms-13)",
    );
    expect(output).toContain("Card for commands-llms-13");
  });
  it("buildLlmsTxt lists commands/commands-llms-14", () => {
    const entries = [fixtureEntry("commands", "commands-llms-14")];
    const output = buildLlmsTxt("https://heyclau.de", {
      categories: FIXTURE_CATEGORIES,
      entries,
    });
    expect(output).toContain("## Commands");
    expect(output).toContain(
      "[commands commands-llms-14](https://heyclau.de/entry/commands/commands-llms-14)",
    );
    expect(output).toContain("Card for commands-llms-14");
  });
  it("buildLlmsTxt lists hooks/hooks-llms-0", () => {
    const entries = [fixtureEntry("hooks", "hooks-llms-0")];
    const output = buildLlmsTxt("https://heyclau.de", {
      categories: FIXTURE_CATEGORIES,
      entries,
    });
    expect(output).toContain("## Hooks");
    expect(output).toContain(
      "[hooks hooks-llms-0](https://heyclau.de/entry/hooks/hooks-llms-0)",
    );
    expect(output).toContain("Card for hooks-llms-0");
  });
  it("buildLlmsTxt lists hooks/hooks-llms-1", () => {
    const entries = [fixtureEntry("hooks", "hooks-llms-1")];
    const output = buildLlmsTxt("https://heyclau.de", {
      categories: FIXTURE_CATEGORIES,
      entries,
    });
    expect(output).toContain("## Hooks");
    expect(output).toContain(
      "[hooks hooks-llms-1](https://heyclau.de/entry/hooks/hooks-llms-1)",
    );
    expect(output).toContain("Card for hooks-llms-1");
  });
  it("buildLlmsTxt lists hooks/hooks-llms-2", () => {
    const entries = [fixtureEntry("hooks", "hooks-llms-2")];
    const output = buildLlmsTxt("https://heyclau.de", {
      categories: FIXTURE_CATEGORIES,
      entries,
    });
    expect(output).toContain("## Hooks");
    expect(output).toContain(
      "[hooks hooks-llms-2](https://heyclau.de/entry/hooks/hooks-llms-2)",
    );
    expect(output).toContain("Card for hooks-llms-2");
  });
  it("buildLlmsTxt lists hooks/hooks-llms-3", () => {
    const entries = [fixtureEntry("hooks", "hooks-llms-3")];
    const output = buildLlmsTxt("https://heyclau.de", {
      categories: FIXTURE_CATEGORIES,
      entries,
    });
    expect(output).toContain("## Hooks");
    expect(output).toContain(
      "[hooks hooks-llms-3](https://heyclau.de/entry/hooks/hooks-llms-3)",
    );
    expect(output).toContain("Card for hooks-llms-3");
  });
  it("buildLlmsTxt lists hooks/hooks-llms-4", () => {
    const entries = [fixtureEntry("hooks", "hooks-llms-4")];
    const output = buildLlmsTxt("https://heyclau.de", {
      categories: FIXTURE_CATEGORIES,
      entries,
    });
    expect(output).toContain("## Hooks");
    expect(output).toContain(
      "[hooks hooks-llms-4](https://heyclau.de/entry/hooks/hooks-llms-4)",
    );
    expect(output).toContain("Card for hooks-llms-4");
  });
  it("buildLlmsTxt lists hooks/hooks-llms-5", () => {
    const entries = [fixtureEntry("hooks", "hooks-llms-5")];
    const output = buildLlmsTxt("https://heyclau.de", {
      categories: FIXTURE_CATEGORIES,
      entries,
    });
    expect(output).toContain("## Hooks");
    expect(output).toContain(
      "[hooks hooks-llms-5](https://heyclau.de/entry/hooks/hooks-llms-5)",
    );
    expect(output).toContain("Card for hooks-llms-5");
  });
  it("buildLlmsTxt lists hooks/hooks-llms-6", () => {
    const entries = [fixtureEntry("hooks", "hooks-llms-6")];
    const output = buildLlmsTxt("https://heyclau.de", {
      categories: FIXTURE_CATEGORIES,
      entries,
    });
    expect(output).toContain("## Hooks");
    expect(output).toContain(
      "[hooks hooks-llms-6](https://heyclau.de/entry/hooks/hooks-llms-6)",
    );
    expect(output).toContain("Card for hooks-llms-6");
  });
  it("buildLlmsTxt lists hooks/hooks-llms-7", () => {
    const entries = [fixtureEntry("hooks", "hooks-llms-7")];
    const output = buildLlmsTxt("https://heyclau.de", {
      categories: FIXTURE_CATEGORIES,
      entries,
    });
    expect(output).toContain("## Hooks");
    expect(output).toContain(
      "[hooks hooks-llms-7](https://heyclau.de/entry/hooks/hooks-llms-7)",
    );
    expect(output).toContain("Card for hooks-llms-7");
  });
  it("buildLlmsTxt lists hooks/hooks-llms-8", () => {
    const entries = [fixtureEntry("hooks", "hooks-llms-8")];
    const output = buildLlmsTxt("https://heyclau.de", {
      categories: FIXTURE_CATEGORIES,
      entries,
    });
    expect(output).toContain("## Hooks");
    expect(output).toContain(
      "[hooks hooks-llms-8](https://heyclau.de/entry/hooks/hooks-llms-8)",
    );
    expect(output).toContain("Card for hooks-llms-8");
  });
  it("buildLlmsTxt lists hooks/hooks-llms-9", () => {
    const entries = [fixtureEntry("hooks", "hooks-llms-9")];
    const output = buildLlmsTxt("https://heyclau.de", {
      categories: FIXTURE_CATEGORIES,
      entries,
    });
    expect(output).toContain("## Hooks");
    expect(output).toContain(
      "[hooks hooks-llms-9](https://heyclau.de/entry/hooks/hooks-llms-9)",
    );
    expect(output).toContain("Card for hooks-llms-9");
  });
  it("buildLlmsTxt lists hooks/hooks-llms-10", () => {
    const entries = [fixtureEntry("hooks", "hooks-llms-10")];
    const output = buildLlmsTxt("https://heyclau.de", {
      categories: FIXTURE_CATEGORIES,
      entries,
    });
    expect(output).toContain("## Hooks");
    expect(output).toContain(
      "[hooks hooks-llms-10](https://heyclau.de/entry/hooks/hooks-llms-10)",
    );
    expect(output).toContain("Card for hooks-llms-10");
  });
  it("buildLlmsTxt lists hooks/hooks-llms-11", () => {
    const entries = [fixtureEntry("hooks", "hooks-llms-11")];
    const output = buildLlmsTxt("https://heyclau.de", {
      categories: FIXTURE_CATEGORIES,
      entries,
    });
    expect(output).toContain("## Hooks");
    expect(output).toContain(
      "[hooks hooks-llms-11](https://heyclau.de/entry/hooks/hooks-llms-11)",
    );
    expect(output).toContain("Card for hooks-llms-11");
  });
  it("buildLlmsTxt lists hooks/hooks-llms-12", () => {
    const entries = [fixtureEntry("hooks", "hooks-llms-12")];
    const output = buildLlmsTxt("https://heyclau.de", {
      categories: FIXTURE_CATEGORIES,
      entries,
    });
    expect(output).toContain("## Hooks");
    expect(output).toContain(
      "[hooks hooks-llms-12](https://heyclau.de/entry/hooks/hooks-llms-12)",
    );
    expect(output).toContain("Card for hooks-llms-12");
  });
  it("buildLlmsTxt lists hooks/hooks-llms-13", () => {
    const entries = [fixtureEntry("hooks", "hooks-llms-13")];
    const output = buildLlmsTxt("https://heyclau.de", {
      categories: FIXTURE_CATEGORIES,
      entries,
    });
    expect(output).toContain("## Hooks");
    expect(output).toContain(
      "[hooks hooks-llms-13](https://heyclau.de/entry/hooks/hooks-llms-13)",
    );
    expect(output).toContain("Card for hooks-llms-13");
  });
  it("buildLlmsTxt lists hooks/hooks-llms-14", () => {
    const entries = [fixtureEntry("hooks", "hooks-llms-14")];
    const output = buildLlmsTxt("https://heyclau.de", {
      categories: FIXTURE_CATEGORIES,
      entries,
    });
    expect(output).toContain("## Hooks");
    expect(output).toContain(
      "[hooks hooks-llms-14](https://heyclau.de/entry/hooks/hooks-llms-14)",
    );
    expect(output).toContain("Card for hooks-llms-14");
  });
  it("buildLlmsTxt lists guides/guides-llms-0", () => {
    const entries = [fixtureEntry("guides", "guides-llms-0")];
    const output = buildLlmsTxt("https://heyclau.de", {
      categories: FIXTURE_CATEGORIES,
      entries,
    });
    expect(output).toContain("## Guides");
    expect(output).toContain(
      "[guides guides-llms-0](https://heyclau.de/entry/guides/guides-llms-0)",
    );
    expect(output).toContain("Card for guides-llms-0");
  });
  it("buildLlmsTxt lists guides/guides-llms-1", () => {
    const entries = [fixtureEntry("guides", "guides-llms-1")];
    const output = buildLlmsTxt("https://heyclau.de", {
      categories: FIXTURE_CATEGORIES,
      entries,
    });
    expect(output).toContain("## Guides");
    expect(output).toContain(
      "[guides guides-llms-1](https://heyclau.de/entry/guides/guides-llms-1)",
    );
    expect(output).toContain("Card for guides-llms-1");
  });
  it("buildLlmsTxt lists guides/guides-llms-2", () => {
    const entries = [fixtureEntry("guides", "guides-llms-2")];
    const output = buildLlmsTxt("https://heyclau.de", {
      categories: FIXTURE_CATEGORIES,
      entries,
    });
    expect(output).toContain("## Guides");
    expect(output).toContain(
      "[guides guides-llms-2](https://heyclau.de/entry/guides/guides-llms-2)",
    );
    expect(output).toContain("Card for guides-llms-2");
  });
  it("buildLlmsTxt lists guides/guides-llms-3", () => {
    const entries = [fixtureEntry("guides", "guides-llms-3")];
    const output = buildLlmsTxt("https://heyclau.de", {
      categories: FIXTURE_CATEGORIES,
      entries,
    });
    expect(output).toContain("## Guides");
    expect(output).toContain(
      "[guides guides-llms-3](https://heyclau.de/entry/guides/guides-llms-3)",
    );
    expect(output).toContain("Card for guides-llms-3");
  });
  it("buildLlmsTxt lists guides/guides-llms-4", () => {
    const entries = [fixtureEntry("guides", "guides-llms-4")];
    const output = buildLlmsTxt("https://heyclau.de", {
      categories: FIXTURE_CATEGORIES,
      entries,
    });
    expect(output).toContain("## Guides");
    expect(output).toContain(
      "[guides guides-llms-4](https://heyclau.de/entry/guides/guides-llms-4)",
    );
    expect(output).toContain("Card for guides-llms-4");
  });
  it("buildLlmsTxt lists guides/guides-llms-5", () => {
    const entries = [fixtureEntry("guides", "guides-llms-5")];
    const output = buildLlmsTxt("https://heyclau.de", {
      categories: FIXTURE_CATEGORIES,
      entries,
    });
    expect(output).toContain("## Guides");
    expect(output).toContain(
      "[guides guides-llms-5](https://heyclau.de/entry/guides/guides-llms-5)",
    );
    expect(output).toContain("Card for guides-llms-5");
  });
  it("buildLlmsTxt lists guides/guides-llms-6", () => {
    const entries = [fixtureEntry("guides", "guides-llms-6")];
    const output = buildLlmsTxt("https://heyclau.de", {
      categories: FIXTURE_CATEGORIES,
      entries,
    });
    expect(output).toContain("## Guides");
    expect(output).toContain(
      "[guides guides-llms-6](https://heyclau.de/entry/guides/guides-llms-6)",
    );
    expect(output).toContain("Card for guides-llms-6");
  });
  it("buildLlmsTxt lists guides/guides-llms-7", () => {
    const entries = [fixtureEntry("guides", "guides-llms-7")];
    const output = buildLlmsTxt("https://heyclau.de", {
      categories: FIXTURE_CATEGORIES,
      entries,
    });
    expect(output).toContain("## Guides");
    expect(output).toContain(
      "[guides guides-llms-7](https://heyclau.de/entry/guides/guides-llms-7)",
    );
    expect(output).toContain("Card for guides-llms-7");
  });
  it("buildLlmsTxt lists guides/guides-llms-8", () => {
    const entries = [fixtureEntry("guides", "guides-llms-8")];
    const output = buildLlmsTxt("https://heyclau.de", {
      categories: FIXTURE_CATEGORIES,
      entries,
    });
    expect(output).toContain("## Guides");
    expect(output).toContain(
      "[guides guides-llms-8](https://heyclau.de/entry/guides/guides-llms-8)",
    );
    expect(output).toContain("Card for guides-llms-8");
  });
  it("buildLlmsTxt lists guides/guides-llms-9", () => {
    const entries = [fixtureEntry("guides", "guides-llms-9")];
    const output = buildLlmsTxt("https://heyclau.de", {
      categories: FIXTURE_CATEGORIES,
      entries,
    });
    expect(output).toContain("## Guides");
    expect(output).toContain(
      "[guides guides-llms-9](https://heyclau.de/entry/guides/guides-llms-9)",
    );
    expect(output).toContain("Card for guides-llms-9");
  });
  it("buildLlmsTxt lists guides/guides-llms-10", () => {
    const entries = [fixtureEntry("guides", "guides-llms-10")];
    const output = buildLlmsTxt("https://heyclau.de", {
      categories: FIXTURE_CATEGORIES,
      entries,
    });
    expect(output).toContain("## Guides");
    expect(output).toContain(
      "[guides guides-llms-10](https://heyclau.de/entry/guides/guides-llms-10)",
    );
    expect(output).toContain("Card for guides-llms-10");
  });
  it("buildLlmsTxt lists guides/guides-llms-11", () => {
    const entries = [fixtureEntry("guides", "guides-llms-11")];
    const output = buildLlmsTxt("https://heyclau.de", {
      categories: FIXTURE_CATEGORIES,
      entries,
    });
    expect(output).toContain("## Guides");
    expect(output).toContain(
      "[guides guides-llms-11](https://heyclau.de/entry/guides/guides-llms-11)",
    );
    expect(output).toContain("Card for guides-llms-11");
  });
  it("buildLlmsTxt lists guides/guides-llms-12", () => {
    const entries = [fixtureEntry("guides", "guides-llms-12")];
    const output = buildLlmsTxt("https://heyclau.de", {
      categories: FIXTURE_CATEGORIES,
      entries,
    });
    expect(output).toContain("## Guides");
    expect(output).toContain(
      "[guides guides-llms-12](https://heyclau.de/entry/guides/guides-llms-12)",
    );
    expect(output).toContain("Card for guides-llms-12");
  });
  it("buildLlmsTxt lists guides/guides-llms-13", () => {
    const entries = [fixtureEntry("guides", "guides-llms-13")];
    const output = buildLlmsTxt("https://heyclau.de", {
      categories: FIXTURE_CATEGORIES,
      entries,
    });
    expect(output).toContain("## Guides");
    expect(output).toContain(
      "[guides guides-llms-13](https://heyclau.de/entry/guides/guides-llms-13)",
    );
    expect(output).toContain("Card for guides-llms-13");
  });
  it("buildLlmsTxt lists guides/guides-llms-14", () => {
    const entries = [fixtureEntry("guides", "guides-llms-14")];
    const output = buildLlmsTxt("https://heyclau.de", {
      categories: FIXTURE_CATEGORIES,
      entries,
    });
    expect(output).toContain("## Guides");
    expect(output).toContain(
      "[guides guides-llms-14](https://heyclau.de/entry/guides/guides-llms-14)",
    );
    expect(output).toContain("Card for guides-llms-14");
  });
  it("buildLlmsTxt lists collections/collections-llms-0", () => {
    const entries = [fixtureEntry("collections", "collections-llms-0")];
    const output = buildLlmsTxt("https://heyclau.de", {
      categories: FIXTURE_CATEGORIES,
      entries,
    });
    expect(output).toContain("## Collections");
    expect(output).toContain(
      "[collections collections-llms-0](https://heyclau.de/entry/collections/collections-llms-0)",
    );
    expect(output).toContain("Card for collections-llms-0");
  });
  it("buildLlmsTxt lists collections/collections-llms-1", () => {
    const entries = [fixtureEntry("collections", "collections-llms-1")];
    const output = buildLlmsTxt("https://heyclau.de", {
      categories: FIXTURE_CATEGORIES,
      entries,
    });
    expect(output).toContain("## Collections");
    expect(output).toContain(
      "[collections collections-llms-1](https://heyclau.de/entry/collections/collections-llms-1)",
    );
    expect(output).toContain("Card for collections-llms-1");
  });
  it("buildLlmsTxt lists collections/collections-llms-2", () => {
    const entries = [fixtureEntry("collections", "collections-llms-2")];
    const output = buildLlmsTxt("https://heyclau.de", {
      categories: FIXTURE_CATEGORIES,
      entries,
    });
    expect(output).toContain("## Collections");
    expect(output).toContain(
      "[collections collections-llms-2](https://heyclau.de/entry/collections/collections-llms-2)",
    );
    expect(output).toContain("Card for collections-llms-2");
  });
  it("buildLlmsTxt lists collections/collections-llms-3", () => {
    const entries = [fixtureEntry("collections", "collections-llms-3")];
    const output = buildLlmsTxt("https://heyclau.de", {
      categories: FIXTURE_CATEGORIES,
      entries,
    });
    expect(output).toContain("## Collections");
    expect(output).toContain(
      "[collections collections-llms-3](https://heyclau.de/entry/collections/collections-llms-3)",
    );
    expect(output).toContain("Card for collections-llms-3");
  });
  it("buildLlmsTxt lists collections/collections-llms-4", () => {
    const entries = [fixtureEntry("collections", "collections-llms-4")];
    const output = buildLlmsTxt("https://heyclau.de", {
      categories: FIXTURE_CATEGORIES,
      entries,
    });
    expect(output).toContain("## Collections");
    expect(output).toContain(
      "[collections collections-llms-4](https://heyclau.de/entry/collections/collections-llms-4)",
    );
    expect(output).toContain("Card for collections-llms-4");
  });
  it("buildLlmsTxt lists collections/collections-llms-5", () => {
    const entries = [fixtureEntry("collections", "collections-llms-5")];
    const output = buildLlmsTxt("https://heyclau.de", {
      categories: FIXTURE_CATEGORIES,
      entries,
    });
    expect(output).toContain("## Collections");
    expect(output).toContain(
      "[collections collections-llms-5](https://heyclau.de/entry/collections/collections-llms-5)",
    );
    expect(output).toContain("Card for collections-llms-5");
  });
  it("buildLlmsTxt lists collections/collections-llms-6", () => {
    const entries = [fixtureEntry("collections", "collections-llms-6")];
    const output = buildLlmsTxt("https://heyclau.de", {
      categories: FIXTURE_CATEGORIES,
      entries,
    });
    expect(output).toContain("## Collections");
    expect(output).toContain(
      "[collections collections-llms-6](https://heyclau.de/entry/collections/collections-llms-6)",
    );
    expect(output).toContain("Card for collections-llms-6");
  });
  it("buildLlmsTxt lists collections/collections-llms-7", () => {
    const entries = [fixtureEntry("collections", "collections-llms-7")];
    const output = buildLlmsTxt("https://heyclau.de", {
      categories: FIXTURE_CATEGORIES,
      entries,
    });
    expect(output).toContain("## Collections");
    expect(output).toContain(
      "[collections collections-llms-7](https://heyclau.de/entry/collections/collections-llms-7)",
    );
    expect(output).toContain("Card for collections-llms-7");
  });
  it("buildLlmsTxt lists collections/collections-llms-8", () => {
    const entries = [fixtureEntry("collections", "collections-llms-8")];
    const output = buildLlmsTxt("https://heyclau.de", {
      categories: FIXTURE_CATEGORIES,
      entries,
    });
    expect(output).toContain("## Collections");
    expect(output).toContain(
      "[collections collections-llms-8](https://heyclau.de/entry/collections/collections-llms-8)",
    );
    expect(output).toContain("Card for collections-llms-8");
  });
  it("buildLlmsTxt lists collections/collections-llms-9", () => {
    const entries = [fixtureEntry("collections", "collections-llms-9")];
    const output = buildLlmsTxt("https://heyclau.de", {
      categories: FIXTURE_CATEGORIES,
      entries,
    });
    expect(output).toContain("## Collections");
    expect(output).toContain(
      "[collections collections-llms-9](https://heyclau.de/entry/collections/collections-llms-9)",
    );
    expect(output).toContain("Card for collections-llms-9");
  });
  it("buildLlmsTxt lists collections/collections-llms-10", () => {
    const entries = [fixtureEntry("collections", "collections-llms-10")];
    const output = buildLlmsTxt("https://heyclau.de", {
      categories: FIXTURE_CATEGORIES,
      entries,
    });
    expect(output).toContain("## Collections");
    expect(output).toContain(
      "[collections collections-llms-10](https://heyclau.de/entry/collections/collections-llms-10)",
    );
    expect(output).toContain("Card for collections-llms-10");
  });
  it("buildLlmsTxt lists collections/collections-llms-11", () => {
    const entries = [fixtureEntry("collections", "collections-llms-11")];
    const output = buildLlmsTxt("https://heyclau.de", {
      categories: FIXTURE_CATEGORIES,
      entries,
    });
    expect(output).toContain("## Collections");
    expect(output).toContain(
      "[collections collections-llms-11](https://heyclau.de/entry/collections/collections-llms-11)",
    );
    expect(output).toContain("Card for collections-llms-11");
  });
  it("buildLlmsTxt lists collections/collections-llms-12", () => {
    const entries = [fixtureEntry("collections", "collections-llms-12")];
    const output = buildLlmsTxt("https://heyclau.de", {
      categories: FIXTURE_CATEGORIES,
      entries,
    });
    expect(output).toContain("## Collections");
    expect(output).toContain(
      "[collections collections-llms-12](https://heyclau.de/entry/collections/collections-llms-12)",
    );
    expect(output).toContain("Card for collections-llms-12");
  });
  it("buildLlmsTxt lists collections/collections-llms-13", () => {
    const entries = [fixtureEntry("collections", "collections-llms-13")];
    const output = buildLlmsTxt("https://heyclau.de", {
      categories: FIXTURE_CATEGORIES,
      entries,
    });
    expect(output).toContain("## Collections");
    expect(output).toContain(
      "[collections collections-llms-13](https://heyclau.de/entry/collections/collections-llms-13)",
    );
    expect(output).toContain("Card for collections-llms-13");
  });
  it("buildLlmsTxt lists collections/collections-llms-14", () => {
    const entries = [fixtureEntry("collections", "collections-llms-14")];
    const output = buildLlmsTxt("https://heyclau.de", {
      categories: FIXTURE_CATEGORIES,
      entries,
    });
    expect(output).toContain("## Collections");
    expect(output).toContain(
      "[collections collections-llms-14](https://heyclau.de/entry/collections/collections-llms-14)",
    );
    expect(output).toContain("Card for collections-llms-14");
  });
  it("buildLlmsTxt lists statuslines/statuslines-llms-0", () => {
    const entries = [fixtureEntry("statuslines", "statuslines-llms-0")];
    const output = buildLlmsTxt("https://heyclau.de", {
      categories: FIXTURE_CATEGORIES,
      entries,
    });
    expect(output).toContain("## Statuslines");
    expect(output).toContain(
      "[statuslines statuslines-llms-0](https://heyclau.de/entry/statuslines/statuslines-llms-0)",
    );
    expect(output).toContain("Card for statuslines-llms-0");
  });
  it("buildLlmsTxt lists statuslines/statuslines-llms-1", () => {
    const entries = [fixtureEntry("statuslines", "statuslines-llms-1")];
    const output = buildLlmsTxt("https://heyclau.de", {
      categories: FIXTURE_CATEGORIES,
      entries,
    });
    expect(output).toContain("## Statuslines");
    expect(output).toContain(
      "[statuslines statuslines-llms-1](https://heyclau.de/entry/statuslines/statuslines-llms-1)",
    );
    expect(output).toContain("Card for statuslines-llms-1");
  });
  it("buildLlmsTxt lists statuslines/statuslines-llms-2", () => {
    const entries = [fixtureEntry("statuslines", "statuslines-llms-2")];
    const output = buildLlmsTxt("https://heyclau.de", {
      categories: FIXTURE_CATEGORIES,
      entries,
    });
    expect(output).toContain("## Statuslines");
    expect(output).toContain(
      "[statuslines statuslines-llms-2](https://heyclau.de/entry/statuslines/statuslines-llms-2)",
    );
    expect(output).toContain("Card for statuslines-llms-2");
  });
  it("buildLlmsTxt lists statuslines/statuslines-llms-3", () => {
    const entries = [fixtureEntry("statuslines", "statuslines-llms-3")];
    const output = buildLlmsTxt("https://heyclau.de", {
      categories: FIXTURE_CATEGORIES,
      entries,
    });
    expect(output).toContain("## Statuslines");
    expect(output).toContain(
      "[statuslines statuslines-llms-3](https://heyclau.de/entry/statuslines/statuslines-llms-3)",
    );
    expect(output).toContain("Card for statuslines-llms-3");
  });
  it("buildLlmsTxt lists statuslines/statuslines-llms-4", () => {
    const entries = [fixtureEntry("statuslines", "statuslines-llms-4")];
    const output = buildLlmsTxt("https://heyclau.de", {
      categories: FIXTURE_CATEGORIES,
      entries,
    });
    expect(output).toContain("## Statuslines");
    expect(output).toContain(
      "[statuslines statuslines-llms-4](https://heyclau.de/entry/statuslines/statuslines-llms-4)",
    );
    expect(output).toContain("Card for statuslines-llms-4");
  });
  it("buildLlmsTxt lists statuslines/statuslines-llms-5", () => {
    const entries = [fixtureEntry("statuslines", "statuslines-llms-5")];
    const output = buildLlmsTxt("https://heyclau.de", {
      categories: FIXTURE_CATEGORIES,
      entries,
    });
    expect(output).toContain("## Statuslines");
    expect(output).toContain(
      "[statuslines statuslines-llms-5](https://heyclau.de/entry/statuslines/statuslines-llms-5)",
    );
    expect(output).toContain("Card for statuslines-llms-5");
  });
  it("buildLlmsTxt lists statuslines/statuslines-llms-6", () => {
    const entries = [fixtureEntry("statuslines", "statuslines-llms-6")];
    const output = buildLlmsTxt("https://heyclau.de", {
      categories: FIXTURE_CATEGORIES,
      entries,
    });
    expect(output).toContain("## Statuslines");
    expect(output).toContain(
      "[statuslines statuslines-llms-6](https://heyclau.de/entry/statuslines/statuslines-llms-6)",
    );
    expect(output).toContain("Card for statuslines-llms-6");
  });
  it("buildLlmsTxt lists statuslines/statuslines-llms-7", () => {
    const entries = [fixtureEntry("statuslines", "statuslines-llms-7")];
    const output = buildLlmsTxt("https://heyclau.de", {
      categories: FIXTURE_CATEGORIES,
      entries,
    });
    expect(output).toContain("## Statuslines");
    expect(output).toContain(
      "[statuslines statuslines-llms-7](https://heyclau.de/entry/statuslines/statuslines-llms-7)",
    );
    expect(output).toContain("Card for statuslines-llms-7");
  });
  it("buildLlmsTxt lists statuslines/statuslines-llms-8", () => {
    const entries = [fixtureEntry("statuslines", "statuslines-llms-8")];
    const output = buildLlmsTxt("https://heyclau.de", {
      categories: FIXTURE_CATEGORIES,
      entries,
    });
    expect(output).toContain("## Statuslines");
    expect(output).toContain(
      "[statuslines statuslines-llms-8](https://heyclau.de/entry/statuslines/statuslines-llms-8)",
    );
    expect(output).toContain("Card for statuslines-llms-8");
  });
  it("buildLlmsTxt lists statuslines/statuslines-llms-9", () => {
    const entries = [fixtureEntry("statuslines", "statuslines-llms-9")];
    const output = buildLlmsTxt("https://heyclau.de", {
      categories: FIXTURE_CATEGORIES,
      entries,
    });
    expect(output).toContain("## Statuslines");
    expect(output).toContain(
      "[statuslines statuslines-llms-9](https://heyclau.de/entry/statuslines/statuslines-llms-9)",
    );
    expect(output).toContain("Card for statuslines-llms-9");
  });
  it("buildLlmsTxt lists statuslines/statuslines-llms-10", () => {
    const entries = [fixtureEntry("statuslines", "statuslines-llms-10")];
    const output = buildLlmsTxt("https://heyclau.de", {
      categories: FIXTURE_CATEGORIES,
      entries,
    });
    expect(output).toContain("## Statuslines");
    expect(output).toContain(
      "[statuslines statuslines-llms-10](https://heyclau.de/entry/statuslines/statuslines-llms-10)",
    );
    expect(output).toContain("Card for statuslines-llms-10");
  });
  it("buildLlmsTxt lists statuslines/statuslines-llms-11", () => {
    const entries = [fixtureEntry("statuslines", "statuslines-llms-11")];
    const output = buildLlmsTxt("https://heyclau.de", {
      categories: FIXTURE_CATEGORIES,
      entries,
    });
    expect(output).toContain("## Statuslines");
    expect(output).toContain(
      "[statuslines statuslines-llms-11](https://heyclau.de/entry/statuslines/statuslines-llms-11)",
    );
    expect(output).toContain("Card for statuslines-llms-11");
  });
  it("buildLlmsTxt lists statuslines/statuslines-llms-12", () => {
    const entries = [fixtureEntry("statuslines", "statuslines-llms-12")];
    const output = buildLlmsTxt("https://heyclau.de", {
      categories: FIXTURE_CATEGORIES,
      entries,
    });
    expect(output).toContain("## Statuslines");
    expect(output).toContain(
      "[statuslines statuslines-llms-12](https://heyclau.de/entry/statuslines/statuslines-llms-12)",
    );
    expect(output).toContain("Card for statuslines-llms-12");
  });
  it("buildLlmsTxt lists statuslines/statuslines-llms-13", () => {
    const entries = [fixtureEntry("statuslines", "statuslines-llms-13")];
    const output = buildLlmsTxt("https://heyclau.de", {
      categories: FIXTURE_CATEGORIES,
      entries,
    });
    expect(output).toContain("## Statuslines");
    expect(output).toContain(
      "[statuslines statuslines-llms-13](https://heyclau.de/entry/statuslines/statuslines-llms-13)",
    );
    expect(output).toContain("Card for statuslines-llms-13");
  });
  it("buildLlmsTxt lists statuslines/statuslines-llms-14", () => {
    const entries = [fixtureEntry("statuslines", "statuslines-llms-14")];
    const output = buildLlmsTxt("https://heyclau.de", {
      categories: FIXTURE_CATEGORIES,
      entries,
    });
    expect(output).toContain("## Statuslines");
    expect(output).toContain(
      "[statuslines statuslines-llms-14](https://heyclau.de/entry/statuslines/statuslines-llms-14)",
    );
    expect(output).toContain("Card for statuslines-llms-14");
  });
  it("buildLlmsTxt cardDescription fallback 0", () => {
    const entries = [
      fixtureEntry("mcp", "fallback-0", {
        cardDescription: undefined,
        description: "Desc 0",
      }),
    ];
    const output = buildLlmsTxt("https://heyclau.de", {
      categories: FIXTURE_CATEGORIES,
      entries,
    });
    expect(output).toContain("Desc 0");
  });
  it("buildLlmsTxt cardDescription fallback 1", () => {
    const entries = [
      fixtureEntry("mcp", "fallback-1", {
        cardDescription: undefined,
        description: "Desc 1",
      }),
    ];
    const output = buildLlmsTxt("https://heyclau.de", {
      categories: FIXTURE_CATEGORIES,
      entries,
    });
    expect(output).toContain("Desc 1");
  });
  it("buildLlmsTxt cardDescription fallback 2", () => {
    const entries = [
      fixtureEntry("mcp", "fallback-2", {
        cardDescription: undefined,
        description: "Desc 2",
      }),
    ];
    const output = buildLlmsTxt("https://heyclau.de", {
      categories: FIXTURE_CATEGORIES,
      entries,
    });
    expect(output).toContain("Desc 2");
  });
  it("buildLlmsTxt cardDescription fallback 3", () => {
    const entries = [
      fixtureEntry("mcp", "fallback-3", {
        cardDescription: undefined,
        description: "Desc 3",
      }),
    ];
    const output = buildLlmsTxt("https://heyclau.de", {
      categories: FIXTURE_CATEGORIES,
      entries,
    });
    expect(output).toContain("Desc 3");
  });
  it("buildLlmsTxt cardDescription fallback 4", () => {
    const entries = [
      fixtureEntry("mcp", "fallback-4", {
        cardDescription: undefined,
        description: "Desc 4",
      }),
    ];
    const output = buildLlmsTxt("https://heyclau.de", {
      categories: FIXTURE_CATEGORIES,
      entries,
    });
    expect(output).toContain("Desc 4");
  });
  it("buildLlmsTxt cardDescription fallback 5", () => {
    const entries = [
      fixtureEntry("mcp", "fallback-5", {
        cardDescription: undefined,
        description: "Desc 5",
      }),
    ];
    const output = buildLlmsTxt("https://heyclau.de", {
      categories: FIXTURE_CATEGORIES,
      entries,
    });
    expect(output).toContain("Desc 5");
  });
  it("buildLlmsTxt cardDescription fallback 6", () => {
    const entries = [
      fixtureEntry("mcp", "fallback-6", {
        cardDescription: undefined,
        description: "Desc 6",
      }),
    ];
    const output = buildLlmsTxt("https://heyclau.de", {
      categories: FIXTURE_CATEGORIES,
      entries,
    });
    expect(output).toContain("Desc 6");
  });
  it("buildLlmsTxt cardDescription fallback 7", () => {
    const entries = [
      fixtureEntry("mcp", "fallback-7", {
        cardDescription: undefined,
        description: "Desc 7",
      }),
    ];
    const output = buildLlmsTxt("https://heyclau.de", {
      categories: FIXTURE_CATEGORIES,
      entries,
    });
    expect(output).toContain("Desc 7");
  });
  it("buildLlmsTxt cardDescription fallback 8", () => {
    const entries = [
      fixtureEntry("mcp", "fallback-8", {
        cardDescription: undefined,
        description: "Desc 8",
      }),
    ];
    const output = buildLlmsTxt("https://heyclau.de", {
      categories: FIXTURE_CATEGORIES,
      entries,
    });
    expect(output).toContain("Desc 8");
  });
  it("buildLlmsTxt cardDescription fallback 9", () => {
    const entries = [
      fixtureEntry("mcp", "fallback-9", {
        cardDescription: undefined,
        description: "Desc 9",
      }),
    ];
    const output = buildLlmsTxt("https://heyclau.de", {
      categories: FIXTURE_CATEGORIES,
      entries,
    });
    expect(output).toContain("Desc 9");
  });
  it("buildLlmsTxt cardDescription fallback 10", () => {
    const entries = [
      fixtureEntry("mcp", "fallback-10", {
        cardDescription: undefined,
        description: "Desc 10",
      }),
    ];
    const output = buildLlmsTxt("https://heyclau.de", {
      categories: FIXTURE_CATEGORIES,
      entries,
    });
    expect(output).toContain("Desc 10");
  });
  it("buildLlmsTxt cardDescription fallback 11", () => {
    const entries = [
      fixtureEntry("mcp", "fallback-11", {
        cardDescription: undefined,
        description: "Desc 11",
      }),
    ];
    const output = buildLlmsTxt("https://heyclau.de", {
      categories: FIXTURE_CATEGORIES,
      entries,
    });
    expect(output).toContain("Desc 11");
  });
  it("buildLlmsTxt cardDescription fallback 12", () => {
    const entries = [
      fixtureEntry("mcp", "fallback-12", {
        cardDescription: undefined,
        description: "Desc 12",
      }),
    ];
    const output = buildLlmsTxt("https://heyclau.de", {
      categories: FIXTURE_CATEGORIES,
      entries,
    });
    expect(output).toContain("Desc 12");
  });
  it("buildLlmsTxt cardDescription fallback 13", () => {
    const entries = [
      fixtureEntry("mcp", "fallback-13", {
        cardDescription: undefined,
        description: "Desc 13",
      }),
    ];
    const output = buildLlmsTxt("https://heyclau.de", {
      categories: FIXTURE_CATEGORIES,
      entries,
    });
    expect(output).toContain("Desc 13");
  });
  it("buildLlmsTxt cardDescription fallback 14", () => {
    const entries = [
      fixtureEntry("mcp", "fallback-14", {
        cardDescription: undefined,
        description: "Desc 14",
      }),
    ];
    const output = buildLlmsTxt("https://heyclau.de", {
      categories: FIXTURE_CATEGORIES,
      entries,
    });
    expect(output).toContain("Desc 14");
  });
  it("buildLlmsTxt cardDescription fallback 15", () => {
    const entries = [
      fixtureEntry("mcp", "fallback-15", {
        cardDescription: undefined,
        description: "Desc 15",
      }),
    ];
    const output = buildLlmsTxt("https://heyclau.de", {
      categories: FIXTURE_CATEGORIES,
      entries,
    });
    expect(output).toContain("Desc 15");
  });
  it("buildLlmsTxt cardDescription fallback 16", () => {
    const entries = [
      fixtureEntry("mcp", "fallback-16", {
        cardDescription: undefined,
        description: "Desc 16",
      }),
    ];
    const output = buildLlmsTxt("https://heyclau.de", {
      categories: FIXTURE_CATEGORIES,
      entries,
    });
    expect(output).toContain("Desc 16");
  });
  it("buildLlmsTxt cardDescription fallback 17", () => {
    const entries = [
      fixtureEntry("mcp", "fallback-17", {
        cardDescription: undefined,
        description: "Desc 17",
      }),
    ];
    const output = buildLlmsTxt("https://heyclau.de", {
      categories: FIXTURE_CATEGORIES,
      entries,
    });
    expect(output).toContain("Desc 17");
  });
  it("buildLlmsTxt cardDescription fallback 18", () => {
    const entries = [
      fixtureEntry("mcp", "fallback-18", {
        cardDescription: undefined,
        description: "Desc 18",
      }),
    ];
    const output = buildLlmsTxt("https://heyclau.de", {
      categories: FIXTURE_CATEGORIES,
      entries,
    });
    expect(output).toContain("Desc 18");
  });
  it("buildLlmsTxt cardDescription fallback 19", () => {
    const entries = [
      fixtureEntry("mcp", "fallback-19", {
        cardDescription: undefined,
        description: "Desc 19",
      }),
    ];
    const output = buildLlmsTxt("https://heyclau.de", {
      categories: FIXTURE_CATEGORIES,
      entries,
    });
    expect(output).toContain("Desc 19");
  });
  it("buildLlmsTxt cardDescription fallback 20", () => {
    const entries = [
      fixtureEntry("mcp", "fallback-20", {
        cardDescription: undefined,
        description: "Desc 20",
      }),
    ];
    const output = buildLlmsTxt("https://heyclau.de", {
      categories: FIXTURE_CATEGORIES,
      entries,
    });
    expect(output).toContain("Desc 20");
  });
  it("buildLlmsTxt cardDescription fallback 21", () => {
    const entries = [
      fixtureEntry("mcp", "fallback-21", {
        cardDescription: undefined,
        description: "Desc 21",
      }),
    ];
    const output = buildLlmsTxt("https://heyclau.de", {
      categories: FIXTURE_CATEGORIES,
      entries,
    });
    expect(output).toContain("Desc 21");
  });
  it("buildLlmsTxt cardDescription fallback 22", () => {
    const entries = [
      fixtureEntry("mcp", "fallback-22", {
        cardDescription: undefined,
        description: "Desc 22",
      }),
    ];
    const output = buildLlmsTxt("https://heyclau.de", {
      categories: FIXTURE_CATEGORIES,
      entries,
    });
    expect(output).toContain("Desc 22");
  });
  it("buildLlmsTxt cardDescription fallback 23", () => {
    const entries = [
      fixtureEntry("mcp", "fallback-23", {
        cardDescription: undefined,
        description: "Desc 23",
      }),
    ];
    const output = buildLlmsTxt("https://heyclau.de", {
      categories: FIXTURE_CATEGORIES,
      entries,
    });
    expect(output).toContain("Desc 23");
  });
  it("buildLlmsTxt cardDescription fallback 24", () => {
    const entries = [
      fixtureEntry("mcp", "fallback-24", {
        cardDescription: undefined,
        description: "Desc 24",
      }),
    ];
    const output = buildLlmsTxt("https://heyclau.de", {
      categories: FIXTURE_CATEGORIES,
      entries,
    });
    expect(output).toContain("Desc 24");
  });
  it("buildLlmsTxt cardDescription fallback 25", () => {
    const entries = [
      fixtureEntry("mcp", "fallback-25", {
        cardDescription: undefined,
        description: "Desc 25",
      }),
    ];
    const output = buildLlmsTxt("https://heyclau.de", {
      categories: FIXTURE_CATEGORIES,
      entries,
    });
    expect(output).toContain("Desc 25");
  });
  it("buildLlmsTxt cardDescription fallback 26", () => {
    const entries = [
      fixtureEntry("mcp", "fallback-26", {
        cardDescription: undefined,
        description: "Desc 26",
      }),
    ];
    const output = buildLlmsTxt("https://heyclau.de", {
      categories: FIXTURE_CATEGORIES,
      entries,
    });
    expect(output).toContain("Desc 26");
  });
  it("buildLlmsTxt cardDescription fallback 27", () => {
    const entries = [
      fixtureEntry("mcp", "fallback-27", {
        cardDescription: undefined,
        description: "Desc 27",
      }),
    ];
    const output = buildLlmsTxt("https://heyclau.de", {
      categories: FIXTURE_CATEGORIES,
      entries,
    });
    expect(output).toContain("Desc 27");
  });
  it("buildLlmsTxt cardDescription fallback 28", () => {
    const entries = [
      fixtureEntry("mcp", "fallback-28", {
        cardDescription: undefined,
        description: "Desc 28",
      }),
    ];
    const output = buildLlmsTxt("https://heyclau.de", {
      categories: FIXTURE_CATEGORIES,
      entries,
    });
    expect(output).toContain("Desc 28");
  });
  it("buildLlmsTxt cardDescription fallback 29", () => {
    const entries = [
      fixtureEntry("mcp", "fallback-29", {
        cardDescription: undefined,
        description: "Desc 29",
      }),
    ];
    const output = buildLlmsTxt("https://heyclau.de", {
      categories: FIXTURE_CATEGORIES,
      entries,
    });
    expect(output).toContain("Desc 29");
  });
  it("buildLlmsTxt cardDescription fallback 30", () => {
    const entries = [
      fixtureEntry("mcp", "fallback-30", {
        cardDescription: undefined,
        description: "Desc 30",
      }),
    ];
    const output = buildLlmsTxt("https://heyclau.de", {
      categories: FIXTURE_CATEGORIES,
      entries,
    });
    expect(output).toContain("Desc 30");
  });
  it("buildLlmsTxt cardDescription fallback 31", () => {
    const entries = [
      fixtureEntry("mcp", "fallback-31", {
        cardDescription: undefined,
        description: "Desc 31",
      }),
    ];
    const output = buildLlmsTxt("https://heyclau.de", {
      categories: FIXTURE_CATEGORIES,
      entries,
    });
    expect(output).toContain("Desc 31");
  });
  it("buildLlmsTxt cardDescription fallback 32", () => {
    const entries = [
      fixtureEntry("mcp", "fallback-32", {
        cardDescription: undefined,
        description: "Desc 32",
      }),
    ];
    const output = buildLlmsTxt("https://heyclau.de", {
      categories: FIXTURE_CATEGORIES,
      entries,
    });
    expect(output).toContain("Desc 32");
  });
  it("buildLlmsTxt cardDescription fallback 33", () => {
    const entries = [
      fixtureEntry("mcp", "fallback-33", {
        cardDescription: undefined,
        description: "Desc 33",
      }),
    ];
    const output = buildLlmsTxt("https://heyclau.de", {
      categories: FIXTURE_CATEGORIES,
      entries,
    });
    expect(output).toContain("Desc 33");
  });
  it("buildLlmsTxt cardDescription fallback 34", () => {
    const entries = [
      fixtureEntry("mcp", "fallback-34", {
        cardDescription: undefined,
        description: "Desc 34",
      }),
    ];
    const output = buildLlmsTxt("https://heyclau.de", {
      categories: FIXTURE_CATEGORIES,
      entries,
    });
    expect(output).toContain("Desc 34");
  });
  it("buildLlmsTxt cardDescription fallback 35", () => {
    const entries = [
      fixtureEntry("mcp", "fallback-35", {
        cardDescription: undefined,
        description: "Desc 35",
      }),
    ];
    const output = buildLlmsTxt("https://heyclau.de", {
      categories: FIXTURE_CATEGORIES,
      entries,
    });
    expect(output).toContain("Desc 35");
  });
  it("buildLlmsTxt cardDescription fallback 36", () => {
    const entries = [
      fixtureEntry("mcp", "fallback-36", {
        cardDescription: undefined,
        description: "Desc 36",
      }),
    ];
    const output = buildLlmsTxt("https://heyclau.de", {
      categories: FIXTURE_CATEGORIES,
      entries,
    });
    expect(output).toContain("Desc 36");
  });
  it("buildLlmsTxt cardDescription fallback 37", () => {
    const entries = [
      fixtureEntry("mcp", "fallback-37", {
        cardDescription: undefined,
        description: "Desc 37",
      }),
    ];
    const output = buildLlmsTxt("https://heyclau.de", {
      categories: FIXTURE_CATEGORIES,
      entries,
    });
    expect(output).toContain("Desc 37");
  });
  it("buildLlmsTxt cardDescription fallback 38", () => {
    const entries = [
      fixtureEntry("mcp", "fallback-38", {
        cardDescription: undefined,
        description: "Desc 38",
      }),
    ];
    const output = buildLlmsTxt("https://heyclau.de", {
      categories: FIXTURE_CATEGORIES,
      entries,
    });
    expect(output).toContain("Desc 38");
  });
  it("buildLlmsTxt cardDescription fallback 39", () => {
    const entries = [
      fixtureEntry("mcp", "fallback-39", {
        cardDescription: undefined,
        description: "Desc 39",
      }),
    ];
    const output = buildLlmsTxt("https://heyclau.de", {
      categories: FIXTURE_CATEGORIES,
      entries,
    });
    expect(output).toContain("Desc 39");
  });
});

describe("llms-surface-lib buildLlmsFullTxt", () => {
  it("renders full export header", () => {
    const output = buildLlmsFullTxt("https://heyclau.de", {
      categories: FIXTURE_CATEGORIES,
      entries: [],
      registryEntries: [],
    });
    expect(output).toContain("# HeyClaude registry — full export");
    expect(output).toContain(
      "Generated for context windows. Source: https://heyclau.de",
    );
  });
  it("uses buildCitationFacts callback when provided", () => {
    const entries = [fixtureEntry("agents", "citation-demo")];
    const registryEntries = [
      { category: "agents", slug: "citation-demo", title: "Citation Demo" },
    ];
    const buildCitationFacts = () => "- Source URLs: https://example.com";
    const output = buildLlmsFullTxt("https://heyclau.de", {
      categories: FIXTURE_CATEGORIES,
      entries,
      registryEntries,
      buildCitationFacts,
    });
    expect(output).toContain("Citation facts:");
    expect(output).toContain("- Source URLs: https://example.com");
  });

  it("buildLlmsFullTxt agents/agents-full-0 metadata", () => {
    const entries = [
      fixtureEntry("agents", "agents-full-0", {
        sourceUrl: "https://github.com/example/agents-full-0",
        docsUrl: "https://docs.example.com/agents-full-0",
        platforms: ["claude-code"],
        safetyNotes: "Safety note 0",
        prerequisites: ["Node 0"],
        installCommand: "npm install agents-full-0",
        configSnippet: '{ "key": "0" }',
        fullCopy: "full copy 0",
      }),
    ];
    const output = buildLlmsFullTxt("https://heyclau.de", {
      categories: FIXTURE_CATEGORIES,
      entries,
      registryEntries: [],
    });
    expect(output).toContain("## agents agents-full-0");
    expect(output).toContain(
      "URL: https://heyclau.de/entry/agents/agents-full-0",
    );
    expect(output).toContain("Safety: Safety note 0");
    expect(output).toContain("npm install agents-full-0");
    expect(output).toContain("full copy 0");
  });
  it("buildLlmsFullTxt agents/agents-full-1 metadata", () => {
    const entries = [
      fixtureEntry("agents", "agents-full-1", {
        sourceUrl: "https://github.com/example/agents-full-1",
        docsUrl: "https://docs.example.com/agents-full-1",
        platforms: ["claude-code"],
        safetyNotes: "Safety note 1",
        prerequisites: ["Node 1"],
        installCommand: "npm install agents-full-1",
        configSnippet: '{ "key": "1" }',
        fullCopy: "full copy 1",
      }),
    ];
    const output = buildLlmsFullTxt("https://heyclau.de", {
      categories: FIXTURE_CATEGORIES,
      entries,
      registryEntries: [],
    });
    expect(output).toContain("## agents agents-full-1");
    expect(output).toContain(
      "URL: https://heyclau.de/entry/agents/agents-full-1",
    );
    expect(output).toContain("Safety: Safety note 1");
    expect(output).toContain("npm install agents-full-1");
    expect(output).toContain("full copy 1");
  });
  it("buildLlmsFullTxt agents/agents-full-2 metadata", () => {
    const entries = [
      fixtureEntry("agents", "agents-full-2", {
        sourceUrl: "https://github.com/example/agents-full-2",
        docsUrl: "https://docs.example.com/agents-full-2",
        platforms: ["claude-code"],
        safetyNotes: "Safety note 2",
        prerequisites: ["Node 2"],
        installCommand: "npm install agents-full-2",
        configSnippet: '{ "key": "2" }',
        fullCopy: "full copy 2",
      }),
    ];
    const output = buildLlmsFullTxt("https://heyclau.de", {
      categories: FIXTURE_CATEGORIES,
      entries,
      registryEntries: [],
    });
    expect(output).toContain("## agents agents-full-2");
    expect(output).toContain(
      "URL: https://heyclau.de/entry/agents/agents-full-2",
    );
    expect(output).toContain("Safety: Safety note 2");
    expect(output).toContain("npm install agents-full-2");
    expect(output).toContain("full copy 2");
  });
  it("buildLlmsFullTxt agents/agents-full-3 metadata", () => {
    const entries = [
      fixtureEntry("agents", "agents-full-3", {
        sourceUrl: "https://github.com/example/agents-full-3",
        docsUrl: "https://docs.example.com/agents-full-3",
        platforms: ["claude-code"],
        safetyNotes: "Safety note 3",
        prerequisites: ["Node 3"],
        installCommand: "npm install agents-full-3",
        configSnippet: '{ "key": "3" }',
        fullCopy: "full copy 3",
      }),
    ];
    const output = buildLlmsFullTxt("https://heyclau.de", {
      categories: FIXTURE_CATEGORIES,
      entries,
      registryEntries: [],
    });
    expect(output).toContain("## agents agents-full-3");
    expect(output).toContain(
      "URL: https://heyclau.de/entry/agents/agents-full-3",
    );
    expect(output).toContain("Safety: Safety note 3");
    expect(output).toContain("npm install agents-full-3");
    expect(output).toContain("full copy 3");
  });
  it("buildLlmsFullTxt agents/agents-full-4 metadata", () => {
    const entries = [
      fixtureEntry("agents", "agents-full-4", {
        sourceUrl: "https://github.com/example/agents-full-4",
        docsUrl: "https://docs.example.com/agents-full-4",
        platforms: ["claude-code"],
        safetyNotes: "Safety note 4",
        prerequisites: ["Node 4"],
        installCommand: "npm install agents-full-4",
        configSnippet: '{ "key": "4" }',
        fullCopy: "full copy 4",
      }),
    ];
    const output = buildLlmsFullTxt("https://heyclau.de", {
      categories: FIXTURE_CATEGORIES,
      entries,
      registryEntries: [],
    });
    expect(output).toContain("## agents agents-full-4");
    expect(output).toContain(
      "URL: https://heyclau.de/entry/agents/agents-full-4",
    );
    expect(output).toContain("Safety: Safety note 4");
    expect(output).toContain("npm install agents-full-4");
    expect(output).toContain("full copy 4");
  });
  it("buildLlmsFullTxt agents/agents-full-5 metadata", () => {
    const entries = [
      fixtureEntry("agents", "agents-full-5", {
        sourceUrl: "https://github.com/example/agents-full-5",
        docsUrl: "https://docs.example.com/agents-full-5",
        platforms: ["claude-code"],
        safetyNotes: "Safety note 5",
        prerequisites: ["Node 5"],
        installCommand: "npm install agents-full-5",
        configSnippet: '{ "key": "5" }',
        fullCopy: "full copy 5",
      }),
    ];
    const output = buildLlmsFullTxt("https://heyclau.de", {
      categories: FIXTURE_CATEGORIES,
      entries,
      registryEntries: [],
    });
    expect(output).toContain("## agents agents-full-5");
    expect(output).toContain(
      "URL: https://heyclau.de/entry/agents/agents-full-5",
    );
    expect(output).toContain("Safety: Safety note 5");
    expect(output).toContain("npm install agents-full-5");
    expect(output).toContain("full copy 5");
  });
  it("buildLlmsFullTxt agents/agents-full-6 metadata", () => {
    const entries = [
      fixtureEntry("agents", "agents-full-6", {
        sourceUrl: "https://github.com/example/agents-full-6",
        docsUrl: "https://docs.example.com/agents-full-6",
        platforms: ["claude-code"],
        safetyNotes: "Safety note 6",
        prerequisites: ["Node 6"],
        installCommand: "npm install agents-full-6",
        configSnippet: '{ "key": "6" }',
        fullCopy: "full copy 6",
      }),
    ];
    const output = buildLlmsFullTxt("https://heyclau.de", {
      categories: FIXTURE_CATEGORIES,
      entries,
      registryEntries: [],
    });
    expect(output).toContain("## agents agents-full-6");
    expect(output).toContain(
      "URL: https://heyclau.de/entry/agents/agents-full-6",
    );
    expect(output).toContain("Safety: Safety note 6");
    expect(output).toContain("npm install agents-full-6");
    expect(output).toContain("full copy 6");
  });
  it("buildLlmsFullTxt agents/agents-full-7 metadata", () => {
    const entries = [
      fixtureEntry("agents", "agents-full-7", {
        sourceUrl: "https://github.com/example/agents-full-7",
        docsUrl: "https://docs.example.com/agents-full-7",
        platforms: ["claude-code"],
        safetyNotes: "Safety note 7",
        prerequisites: ["Node 7"],
        installCommand: "npm install agents-full-7",
        configSnippet: '{ "key": "7" }',
        fullCopy: "full copy 7",
      }),
    ];
    const output = buildLlmsFullTxt("https://heyclau.de", {
      categories: FIXTURE_CATEGORIES,
      entries,
      registryEntries: [],
    });
    expect(output).toContain("## agents agents-full-7");
    expect(output).toContain(
      "URL: https://heyclau.de/entry/agents/agents-full-7",
    );
    expect(output).toContain("Safety: Safety note 7");
    expect(output).toContain("npm install agents-full-7");
    expect(output).toContain("full copy 7");
  });
  it("buildLlmsFullTxt agents/agents-full-8 metadata", () => {
    const entries = [
      fixtureEntry("agents", "agents-full-8", {
        sourceUrl: "https://github.com/example/agents-full-8",
        docsUrl: "https://docs.example.com/agents-full-8",
        platforms: ["claude-code"],
        safetyNotes: "Safety note 8",
        prerequisites: ["Node 8"],
        installCommand: "npm install agents-full-8",
        configSnippet: '{ "key": "8" }',
        fullCopy: "full copy 8",
      }),
    ];
    const output = buildLlmsFullTxt("https://heyclau.de", {
      categories: FIXTURE_CATEGORIES,
      entries,
      registryEntries: [],
    });
    expect(output).toContain("## agents agents-full-8");
    expect(output).toContain(
      "URL: https://heyclau.de/entry/agents/agents-full-8",
    );
    expect(output).toContain("Safety: Safety note 8");
    expect(output).toContain("npm install agents-full-8");
    expect(output).toContain("full copy 8");
  });
  it("buildLlmsFullTxt agents/agents-full-9 metadata", () => {
    const entries = [
      fixtureEntry("agents", "agents-full-9", {
        sourceUrl: "https://github.com/example/agents-full-9",
        docsUrl: "https://docs.example.com/agents-full-9",
        platforms: ["claude-code"],
        safetyNotes: "Safety note 9",
        prerequisites: ["Node 9"],
        installCommand: "npm install agents-full-9",
        configSnippet: '{ "key": "9" }',
        fullCopy: "full copy 9",
      }),
    ];
    const output = buildLlmsFullTxt("https://heyclau.de", {
      categories: FIXTURE_CATEGORIES,
      entries,
      registryEntries: [],
    });
    expect(output).toContain("## agents agents-full-9");
    expect(output).toContain(
      "URL: https://heyclau.de/entry/agents/agents-full-9",
    );
    expect(output).toContain("Safety: Safety note 9");
    expect(output).toContain("npm install agents-full-9");
    expect(output).toContain("full copy 9");
  });
  it("buildLlmsFullTxt agents/agents-full-10 metadata", () => {
    const entries = [
      fixtureEntry("agents", "agents-full-10", {
        sourceUrl: "https://github.com/example/agents-full-10",
        docsUrl: "https://docs.example.com/agents-full-10",
        platforms: ["claude-code"],
        safetyNotes: "Safety note 10",
        prerequisites: ["Node 10"],
        installCommand: "npm install agents-full-10",
        configSnippet: '{ "key": "10" }',
        fullCopy: "full copy 10",
      }),
    ];
    const output = buildLlmsFullTxt("https://heyclau.de", {
      categories: FIXTURE_CATEGORIES,
      entries,
      registryEntries: [],
    });
    expect(output).toContain("## agents agents-full-10");
    expect(output).toContain(
      "URL: https://heyclau.de/entry/agents/agents-full-10",
    );
    expect(output).toContain("Safety: Safety note 10");
    expect(output).toContain("npm install agents-full-10");
    expect(output).toContain("full copy 10");
  });
  it("buildLlmsFullTxt agents/agents-full-11 metadata", () => {
    const entries = [
      fixtureEntry("agents", "agents-full-11", {
        sourceUrl: "https://github.com/example/agents-full-11",
        docsUrl: "https://docs.example.com/agents-full-11",
        platforms: ["claude-code"],
        safetyNotes: "Safety note 11",
        prerequisites: ["Node 11"],
        installCommand: "npm install agents-full-11",
        configSnippet: '{ "key": "11" }',
        fullCopy: "full copy 11",
      }),
    ];
    const output = buildLlmsFullTxt("https://heyclau.de", {
      categories: FIXTURE_CATEGORIES,
      entries,
      registryEntries: [],
    });
    expect(output).toContain("## agents agents-full-11");
    expect(output).toContain(
      "URL: https://heyclau.de/entry/agents/agents-full-11",
    );
    expect(output).toContain("Safety: Safety note 11");
    expect(output).toContain("npm install agents-full-11");
    expect(output).toContain("full copy 11");
  });
  it("buildLlmsFullTxt mcp/mcp-full-0 metadata", () => {
    const entries = [
      fixtureEntry("mcp", "mcp-full-0", {
        sourceUrl: "https://github.com/example/mcp-full-0",
        docsUrl: "https://docs.example.com/mcp-full-0",
        platforms: ["claude-code"],
        safetyNotes: "Safety note 0",
        prerequisites: ["Node 0"],
        installCommand: "npm install mcp-full-0",
        configSnippet: '{ "key": "0" }',
        fullCopy: "full copy 0",
      }),
    ];
    const output = buildLlmsFullTxt("https://heyclau.de", {
      categories: FIXTURE_CATEGORIES,
      entries,
      registryEntries: [],
    });
    expect(output).toContain("## mcp mcp-full-0");
    expect(output).toContain("URL: https://heyclau.de/entry/mcp/mcp-full-0");
    expect(output).toContain("Safety: Safety note 0");
    expect(output).toContain("npm install mcp-full-0");
    expect(output).toContain("full copy 0");
  });
  it("buildLlmsFullTxt mcp/mcp-full-1 metadata", () => {
    const entries = [
      fixtureEntry("mcp", "mcp-full-1", {
        sourceUrl: "https://github.com/example/mcp-full-1",
        docsUrl: "https://docs.example.com/mcp-full-1",
        platforms: ["claude-code"],
        safetyNotes: "Safety note 1",
        prerequisites: ["Node 1"],
        installCommand: "npm install mcp-full-1",
        configSnippet: '{ "key": "1" }',
        fullCopy: "full copy 1",
      }),
    ];
    const output = buildLlmsFullTxt("https://heyclau.de", {
      categories: FIXTURE_CATEGORIES,
      entries,
      registryEntries: [],
    });
    expect(output).toContain("## mcp mcp-full-1");
    expect(output).toContain("URL: https://heyclau.de/entry/mcp/mcp-full-1");
    expect(output).toContain("Safety: Safety note 1");
    expect(output).toContain("npm install mcp-full-1");
    expect(output).toContain("full copy 1");
  });
  it("buildLlmsFullTxt mcp/mcp-full-2 metadata", () => {
    const entries = [
      fixtureEntry("mcp", "mcp-full-2", {
        sourceUrl: "https://github.com/example/mcp-full-2",
        docsUrl: "https://docs.example.com/mcp-full-2",
        platforms: ["claude-code"],
        safetyNotes: "Safety note 2",
        prerequisites: ["Node 2"],
        installCommand: "npm install mcp-full-2",
        configSnippet: '{ "key": "2" }',
        fullCopy: "full copy 2",
      }),
    ];
    const output = buildLlmsFullTxt("https://heyclau.de", {
      categories: FIXTURE_CATEGORIES,
      entries,
      registryEntries: [],
    });
    expect(output).toContain("## mcp mcp-full-2");
    expect(output).toContain("URL: https://heyclau.de/entry/mcp/mcp-full-2");
    expect(output).toContain("Safety: Safety note 2");
    expect(output).toContain("npm install mcp-full-2");
    expect(output).toContain("full copy 2");
  });
  it("buildLlmsFullTxt mcp/mcp-full-3 metadata", () => {
    const entries = [
      fixtureEntry("mcp", "mcp-full-3", {
        sourceUrl: "https://github.com/example/mcp-full-3",
        docsUrl: "https://docs.example.com/mcp-full-3",
        platforms: ["claude-code"],
        safetyNotes: "Safety note 3",
        prerequisites: ["Node 3"],
        installCommand: "npm install mcp-full-3",
        configSnippet: '{ "key": "3" }',
        fullCopy: "full copy 3",
      }),
    ];
    const output = buildLlmsFullTxt("https://heyclau.de", {
      categories: FIXTURE_CATEGORIES,
      entries,
      registryEntries: [],
    });
    expect(output).toContain("## mcp mcp-full-3");
    expect(output).toContain("URL: https://heyclau.de/entry/mcp/mcp-full-3");
    expect(output).toContain("Safety: Safety note 3");
    expect(output).toContain("npm install mcp-full-3");
    expect(output).toContain("full copy 3");
  });
  it("buildLlmsFullTxt mcp/mcp-full-4 metadata", () => {
    const entries = [
      fixtureEntry("mcp", "mcp-full-4", {
        sourceUrl: "https://github.com/example/mcp-full-4",
        docsUrl: "https://docs.example.com/mcp-full-4",
        platforms: ["claude-code"],
        safetyNotes: "Safety note 4",
        prerequisites: ["Node 4"],
        installCommand: "npm install mcp-full-4",
        configSnippet: '{ "key": "4" }',
        fullCopy: "full copy 4",
      }),
    ];
    const output = buildLlmsFullTxt("https://heyclau.de", {
      categories: FIXTURE_CATEGORIES,
      entries,
      registryEntries: [],
    });
    expect(output).toContain("## mcp mcp-full-4");
    expect(output).toContain("URL: https://heyclau.de/entry/mcp/mcp-full-4");
    expect(output).toContain("Safety: Safety note 4");
    expect(output).toContain("npm install mcp-full-4");
    expect(output).toContain("full copy 4");
  });
  it("buildLlmsFullTxt mcp/mcp-full-5 metadata", () => {
    const entries = [
      fixtureEntry("mcp", "mcp-full-5", {
        sourceUrl: "https://github.com/example/mcp-full-5",
        docsUrl: "https://docs.example.com/mcp-full-5",
        platforms: ["claude-code"],
        safetyNotes: "Safety note 5",
        prerequisites: ["Node 5"],
        installCommand: "npm install mcp-full-5",
        configSnippet: '{ "key": "5" }',
        fullCopy: "full copy 5",
      }),
    ];
    const output = buildLlmsFullTxt("https://heyclau.de", {
      categories: FIXTURE_CATEGORIES,
      entries,
      registryEntries: [],
    });
    expect(output).toContain("## mcp mcp-full-5");
    expect(output).toContain("URL: https://heyclau.de/entry/mcp/mcp-full-5");
    expect(output).toContain("Safety: Safety note 5");
    expect(output).toContain("npm install mcp-full-5");
    expect(output).toContain("full copy 5");
  });
  it("buildLlmsFullTxt mcp/mcp-full-6 metadata", () => {
    const entries = [
      fixtureEntry("mcp", "mcp-full-6", {
        sourceUrl: "https://github.com/example/mcp-full-6",
        docsUrl: "https://docs.example.com/mcp-full-6",
        platforms: ["claude-code"],
        safetyNotes: "Safety note 6",
        prerequisites: ["Node 6"],
        installCommand: "npm install mcp-full-6",
        configSnippet: '{ "key": "6" }',
        fullCopy: "full copy 6",
      }),
    ];
    const output = buildLlmsFullTxt("https://heyclau.de", {
      categories: FIXTURE_CATEGORIES,
      entries,
      registryEntries: [],
    });
    expect(output).toContain("## mcp mcp-full-6");
    expect(output).toContain("URL: https://heyclau.de/entry/mcp/mcp-full-6");
    expect(output).toContain("Safety: Safety note 6");
    expect(output).toContain("npm install mcp-full-6");
    expect(output).toContain("full copy 6");
  });
  it("buildLlmsFullTxt mcp/mcp-full-7 metadata", () => {
    const entries = [
      fixtureEntry("mcp", "mcp-full-7", {
        sourceUrl: "https://github.com/example/mcp-full-7",
        docsUrl: "https://docs.example.com/mcp-full-7",
        platforms: ["claude-code"],
        safetyNotes: "Safety note 7",
        prerequisites: ["Node 7"],
        installCommand: "npm install mcp-full-7",
        configSnippet: '{ "key": "7" }',
        fullCopy: "full copy 7",
      }),
    ];
    const output = buildLlmsFullTxt("https://heyclau.de", {
      categories: FIXTURE_CATEGORIES,
      entries,
      registryEntries: [],
    });
    expect(output).toContain("## mcp mcp-full-7");
    expect(output).toContain("URL: https://heyclau.de/entry/mcp/mcp-full-7");
    expect(output).toContain("Safety: Safety note 7");
    expect(output).toContain("npm install mcp-full-7");
    expect(output).toContain("full copy 7");
  });
  it("buildLlmsFullTxt mcp/mcp-full-8 metadata", () => {
    const entries = [
      fixtureEntry("mcp", "mcp-full-8", {
        sourceUrl: "https://github.com/example/mcp-full-8",
        docsUrl: "https://docs.example.com/mcp-full-8",
        platforms: ["claude-code"],
        safetyNotes: "Safety note 8",
        prerequisites: ["Node 8"],
        installCommand: "npm install mcp-full-8",
        configSnippet: '{ "key": "8" }',
        fullCopy: "full copy 8",
      }),
    ];
    const output = buildLlmsFullTxt("https://heyclau.de", {
      categories: FIXTURE_CATEGORIES,
      entries,
      registryEntries: [],
    });
    expect(output).toContain("## mcp mcp-full-8");
    expect(output).toContain("URL: https://heyclau.de/entry/mcp/mcp-full-8");
    expect(output).toContain("Safety: Safety note 8");
    expect(output).toContain("npm install mcp-full-8");
    expect(output).toContain("full copy 8");
  });
  it("buildLlmsFullTxt mcp/mcp-full-9 metadata", () => {
    const entries = [
      fixtureEntry("mcp", "mcp-full-9", {
        sourceUrl: "https://github.com/example/mcp-full-9",
        docsUrl: "https://docs.example.com/mcp-full-9",
        platforms: ["claude-code"],
        safetyNotes: "Safety note 9",
        prerequisites: ["Node 9"],
        installCommand: "npm install mcp-full-9",
        configSnippet: '{ "key": "9" }',
        fullCopy: "full copy 9",
      }),
    ];
    const output = buildLlmsFullTxt("https://heyclau.de", {
      categories: FIXTURE_CATEGORIES,
      entries,
      registryEntries: [],
    });
    expect(output).toContain("## mcp mcp-full-9");
    expect(output).toContain("URL: https://heyclau.de/entry/mcp/mcp-full-9");
    expect(output).toContain("Safety: Safety note 9");
    expect(output).toContain("npm install mcp-full-9");
    expect(output).toContain("full copy 9");
  });
  it("buildLlmsFullTxt mcp/mcp-full-10 metadata", () => {
    const entries = [
      fixtureEntry("mcp", "mcp-full-10", {
        sourceUrl: "https://github.com/example/mcp-full-10",
        docsUrl: "https://docs.example.com/mcp-full-10",
        platforms: ["claude-code"],
        safetyNotes: "Safety note 10",
        prerequisites: ["Node 10"],
        installCommand: "npm install mcp-full-10",
        configSnippet: '{ "key": "10" }',
        fullCopy: "full copy 10",
      }),
    ];
    const output = buildLlmsFullTxt("https://heyclau.de", {
      categories: FIXTURE_CATEGORIES,
      entries,
      registryEntries: [],
    });
    expect(output).toContain("## mcp mcp-full-10");
    expect(output).toContain("URL: https://heyclau.de/entry/mcp/mcp-full-10");
    expect(output).toContain("Safety: Safety note 10");
    expect(output).toContain("npm install mcp-full-10");
    expect(output).toContain("full copy 10");
  });
  it("buildLlmsFullTxt mcp/mcp-full-11 metadata", () => {
    const entries = [
      fixtureEntry("mcp", "mcp-full-11", {
        sourceUrl: "https://github.com/example/mcp-full-11",
        docsUrl: "https://docs.example.com/mcp-full-11",
        platforms: ["claude-code"],
        safetyNotes: "Safety note 11",
        prerequisites: ["Node 11"],
        installCommand: "npm install mcp-full-11",
        configSnippet: '{ "key": "11" }',
        fullCopy: "full copy 11",
      }),
    ];
    const output = buildLlmsFullTxt("https://heyclau.de", {
      categories: FIXTURE_CATEGORIES,
      entries,
      registryEntries: [],
    });
    expect(output).toContain("## mcp mcp-full-11");
    expect(output).toContain("URL: https://heyclau.de/entry/mcp/mcp-full-11");
    expect(output).toContain("Safety: Safety note 11");
    expect(output).toContain("npm install mcp-full-11");
    expect(output).toContain("full copy 11");
  });
  it("buildLlmsFullTxt tools/tools-full-0 metadata", () => {
    const entries = [
      fixtureEntry("tools", "tools-full-0", {
        sourceUrl: "https://github.com/example/tools-full-0",
        docsUrl: "https://docs.example.com/tools-full-0",
        platforms: ["claude-code"],
        safetyNotes: "Safety note 0",
        prerequisites: ["Node 0"],
        installCommand: "npm install tools-full-0",
        configSnippet: '{ "key": "0" }',
        fullCopy: "full copy 0",
      }),
    ];
    const output = buildLlmsFullTxt("https://heyclau.de", {
      categories: FIXTURE_CATEGORIES,
      entries,
      registryEntries: [],
    });
    expect(output).toContain("## tools tools-full-0");
    expect(output).toContain(
      "URL: https://heyclau.de/entry/tools/tools-full-0",
    );
    expect(output).toContain("Safety: Safety note 0");
    expect(output).toContain("npm install tools-full-0");
    expect(output).toContain("full copy 0");
  });
  it("buildLlmsFullTxt tools/tools-full-1 metadata", () => {
    const entries = [
      fixtureEntry("tools", "tools-full-1", {
        sourceUrl: "https://github.com/example/tools-full-1",
        docsUrl: "https://docs.example.com/tools-full-1",
        platforms: ["claude-code"],
        safetyNotes: "Safety note 1",
        prerequisites: ["Node 1"],
        installCommand: "npm install tools-full-1",
        configSnippet: '{ "key": "1" }',
        fullCopy: "full copy 1",
      }),
    ];
    const output = buildLlmsFullTxt("https://heyclau.de", {
      categories: FIXTURE_CATEGORIES,
      entries,
      registryEntries: [],
    });
    expect(output).toContain("## tools tools-full-1");
    expect(output).toContain(
      "URL: https://heyclau.de/entry/tools/tools-full-1",
    );
    expect(output).toContain("Safety: Safety note 1");
    expect(output).toContain("npm install tools-full-1");
    expect(output).toContain("full copy 1");
  });
  it("buildLlmsFullTxt tools/tools-full-2 metadata", () => {
    const entries = [
      fixtureEntry("tools", "tools-full-2", {
        sourceUrl: "https://github.com/example/tools-full-2",
        docsUrl: "https://docs.example.com/tools-full-2",
        platforms: ["claude-code"],
        safetyNotes: "Safety note 2",
        prerequisites: ["Node 2"],
        installCommand: "npm install tools-full-2",
        configSnippet: '{ "key": "2" }',
        fullCopy: "full copy 2",
      }),
    ];
    const output = buildLlmsFullTxt("https://heyclau.de", {
      categories: FIXTURE_CATEGORIES,
      entries,
      registryEntries: [],
    });
    expect(output).toContain("## tools tools-full-2");
    expect(output).toContain(
      "URL: https://heyclau.de/entry/tools/tools-full-2",
    );
    expect(output).toContain("Safety: Safety note 2");
    expect(output).toContain("npm install tools-full-2");
    expect(output).toContain("full copy 2");
  });
  it("buildLlmsFullTxt tools/tools-full-3 metadata", () => {
    const entries = [
      fixtureEntry("tools", "tools-full-3", {
        sourceUrl: "https://github.com/example/tools-full-3",
        docsUrl: "https://docs.example.com/tools-full-3",
        platforms: ["claude-code"],
        safetyNotes: "Safety note 3",
        prerequisites: ["Node 3"],
        installCommand: "npm install tools-full-3",
        configSnippet: '{ "key": "3" }',
        fullCopy: "full copy 3",
      }),
    ];
    const output = buildLlmsFullTxt("https://heyclau.de", {
      categories: FIXTURE_CATEGORIES,
      entries,
      registryEntries: [],
    });
    expect(output).toContain("## tools tools-full-3");
    expect(output).toContain(
      "URL: https://heyclau.de/entry/tools/tools-full-3",
    );
    expect(output).toContain("Safety: Safety note 3");
    expect(output).toContain("npm install tools-full-3");
    expect(output).toContain("full copy 3");
  });
  it("buildLlmsFullTxt tools/tools-full-4 metadata", () => {
    const entries = [
      fixtureEntry("tools", "tools-full-4", {
        sourceUrl: "https://github.com/example/tools-full-4",
        docsUrl: "https://docs.example.com/tools-full-4",
        platforms: ["claude-code"],
        safetyNotes: "Safety note 4",
        prerequisites: ["Node 4"],
        installCommand: "npm install tools-full-4",
        configSnippet: '{ "key": "4" }',
        fullCopy: "full copy 4",
      }),
    ];
    const output = buildLlmsFullTxt("https://heyclau.de", {
      categories: FIXTURE_CATEGORIES,
      entries,
      registryEntries: [],
    });
    expect(output).toContain("## tools tools-full-4");
    expect(output).toContain(
      "URL: https://heyclau.de/entry/tools/tools-full-4",
    );
    expect(output).toContain("Safety: Safety note 4");
    expect(output).toContain("npm install tools-full-4");
    expect(output).toContain("full copy 4");
  });
  it("buildLlmsFullTxt tools/tools-full-5 metadata", () => {
    const entries = [
      fixtureEntry("tools", "tools-full-5", {
        sourceUrl: "https://github.com/example/tools-full-5",
        docsUrl: "https://docs.example.com/tools-full-5",
        platforms: ["claude-code"],
        safetyNotes: "Safety note 5",
        prerequisites: ["Node 5"],
        installCommand: "npm install tools-full-5",
        configSnippet: '{ "key": "5" }',
        fullCopy: "full copy 5",
      }),
    ];
    const output = buildLlmsFullTxt("https://heyclau.de", {
      categories: FIXTURE_CATEGORIES,
      entries,
      registryEntries: [],
    });
    expect(output).toContain("## tools tools-full-5");
    expect(output).toContain(
      "URL: https://heyclau.de/entry/tools/tools-full-5",
    );
    expect(output).toContain("Safety: Safety note 5");
    expect(output).toContain("npm install tools-full-5");
    expect(output).toContain("full copy 5");
  });
  it("buildLlmsFullTxt tools/tools-full-6 metadata", () => {
    const entries = [
      fixtureEntry("tools", "tools-full-6", {
        sourceUrl: "https://github.com/example/tools-full-6",
        docsUrl: "https://docs.example.com/tools-full-6",
        platforms: ["claude-code"],
        safetyNotes: "Safety note 6",
        prerequisites: ["Node 6"],
        installCommand: "npm install tools-full-6",
        configSnippet: '{ "key": "6" }',
        fullCopy: "full copy 6",
      }),
    ];
    const output = buildLlmsFullTxt("https://heyclau.de", {
      categories: FIXTURE_CATEGORIES,
      entries,
      registryEntries: [],
    });
    expect(output).toContain("## tools tools-full-6");
    expect(output).toContain(
      "URL: https://heyclau.de/entry/tools/tools-full-6",
    );
    expect(output).toContain("Safety: Safety note 6");
    expect(output).toContain("npm install tools-full-6");
    expect(output).toContain("full copy 6");
  });
  it("buildLlmsFullTxt tools/tools-full-7 metadata", () => {
    const entries = [
      fixtureEntry("tools", "tools-full-7", {
        sourceUrl: "https://github.com/example/tools-full-7",
        docsUrl: "https://docs.example.com/tools-full-7",
        platforms: ["claude-code"],
        safetyNotes: "Safety note 7",
        prerequisites: ["Node 7"],
        installCommand: "npm install tools-full-7",
        configSnippet: '{ "key": "7" }',
        fullCopy: "full copy 7",
      }),
    ];
    const output = buildLlmsFullTxt("https://heyclau.de", {
      categories: FIXTURE_CATEGORIES,
      entries,
      registryEntries: [],
    });
    expect(output).toContain("## tools tools-full-7");
    expect(output).toContain(
      "URL: https://heyclau.de/entry/tools/tools-full-7",
    );
    expect(output).toContain("Safety: Safety note 7");
    expect(output).toContain("npm install tools-full-7");
    expect(output).toContain("full copy 7");
  });
  it("buildLlmsFullTxt tools/tools-full-8 metadata", () => {
    const entries = [
      fixtureEntry("tools", "tools-full-8", {
        sourceUrl: "https://github.com/example/tools-full-8",
        docsUrl: "https://docs.example.com/tools-full-8",
        platforms: ["claude-code"],
        safetyNotes: "Safety note 8",
        prerequisites: ["Node 8"],
        installCommand: "npm install tools-full-8",
        configSnippet: '{ "key": "8" }',
        fullCopy: "full copy 8",
      }),
    ];
    const output = buildLlmsFullTxt("https://heyclau.de", {
      categories: FIXTURE_CATEGORIES,
      entries,
      registryEntries: [],
    });
    expect(output).toContain("## tools tools-full-8");
    expect(output).toContain(
      "URL: https://heyclau.de/entry/tools/tools-full-8",
    );
    expect(output).toContain("Safety: Safety note 8");
    expect(output).toContain("npm install tools-full-8");
    expect(output).toContain("full copy 8");
  });
  it("buildLlmsFullTxt tools/tools-full-9 metadata", () => {
    const entries = [
      fixtureEntry("tools", "tools-full-9", {
        sourceUrl: "https://github.com/example/tools-full-9",
        docsUrl: "https://docs.example.com/tools-full-9",
        platforms: ["claude-code"],
        safetyNotes: "Safety note 9",
        prerequisites: ["Node 9"],
        installCommand: "npm install tools-full-9",
        configSnippet: '{ "key": "9" }',
        fullCopy: "full copy 9",
      }),
    ];
    const output = buildLlmsFullTxt("https://heyclau.de", {
      categories: FIXTURE_CATEGORIES,
      entries,
      registryEntries: [],
    });
    expect(output).toContain("## tools tools-full-9");
    expect(output).toContain(
      "URL: https://heyclau.de/entry/tools/tools-full-9",
    );
    expect(output).toContain("Safety: Safety note 9");
    expect(output).toContain("npm install tools-full-9");
    expect(output).toContain("full copy 9");
  });
  it("buildLlmsFullTxt tools/tools-full-10 metadata", () => {
    const entries = [
      fixtureEntry("tools", "tools-full-10", {
        sourceUrl: "https://github.com/example/tools-full-10",
        docsUrl: "https://docs.example.com/tools-full-10",
        platforms: ["claude-code"],
        safetyNotes: "Safety note 10",
        prerequisites: ["Node 10"],
        installCommand: "npm install tools-full-10",
        configSnippet: '{ "key": "10" }',
        fullCopy: "full copy 10",
      }),
    ];
    const output = buildLlmsFullTxt("https://heyclau.de", {
      categories: FIXTURE_CATEGORIES,
      entries,
      registryEntries: [],
    });
    expect(output).toContain("## tools tools-full-10");
    expect(output).toContain(
      "URL: https://heyclau.de/entry/tools/tools-full-10",
    );
    expect(output).toContain("Safety: Safety note 10");
    expect(output).toContain("npm install tools-full-10");
    expect(output).toContain("full copy 10");
  });
  it("buildLlmsFullTxt tools/tools-full-11 metadata", () => {
    const entries = [
      fixtureEntry("tools", "tools-full-11", {
        sourceUrl: "https://github.com/example/tools-full-11",
        docsUrl: "https://docs.example.com/tools-full-11",
        platforms: ["claude-code"],
        safetyNotes: "Safety note 11",
        prerequisites: ["Node 11"],
        installCommand: "npm install tools-full-11",
        configSnippet: '{ "key": "11" }',
        fullCopy: "full copy 11",
      }),
    ];
    const output = buildLlmsFullTxt("https://heyclau.de", {
      categories: FIXTURE_CATEGORIES,
      entries,
      registryEntries: [],
    });
    expect(output).toContain("## tools tools-full-11");
    expect(output).toContain(
      "URL: https://heyclau.de/entry/tools/tools-full-11",
    );
    expect(output).toContain("Safety: Safety note 11");
    expect(output).toContain("npm install tools-full-11");
    expect(output).toContain("full copy 11");
  });
  it("buildLlmsFullTxt skills/skills-full-0 metadata", () => {
    const entries = [
      fixtureEntry("skills", "skills-full-0", {
        sourceUrl: "https://github.com/example/skills-full-0",
        docsUrl: "https://docs.example.com/skills-full-0",
        platforms: ["claude-code"],
        safetyNotes: "Safety note 0",
        prerequisites: ["Node 0"],
        installCommand: "npm install skills-full-0",
        configSnippet: '{ "key": "0" }',
        fullCopy: "full copy 0",
      }),
    ];
    const output = buildLlmsFullTxt("https://heyclau.de", {
      categories: FIXTURE_CATEGORIES,
      entries,
      registryEntries: [],
    });
    expect(output).toContain("## skills skills-full-0");
    expect(output).toContain(
      "URL: https://heyclau.de/entry/skills/skills-full-0",
    );
    expect(output).toContain("Safety: Safety note 0");
    expect(output).toContain("npm install skills-full-0");
    expect(output).toContain("full copy 0");
  });
  it("buildLlmsFullTxt skills/skills-full-1 metadata", () => {
    const entries = [
      fixtureEntry("skills", "skills-full-1", {
        sourceUrl: "https://github.com/example/skills-full-1",
        docsUrl: "https://docs.example.com/skills-full-1",
        platforms: ["claude-code"],
        safetyNotes: "Safety note 1",
        prerequisites: ["Node 1"],
        installCommand: "npm install skills-full-1",
        configSnippet: '{ "key": "1" }',
        fullCopy: "full copy 1",
      }),
    ];
    const output = buildLlmsFullTxt("https://heyclau.de", {
      categories: FIXTURE_CATEGORIES,
      entries,
      registryEntries: [],
    });
    expect(output).toContain("## skills skills-full-1");
    expect(output).toContain(
      "URL: https://heyclau.de/entry/skills/skills-full-1",
    );
    expect(output).toContain("Safety: Safety note 1");
    expect(output).toContain("npm install skills-full-1");
    expect(output).toContain("full copy 1");
  });
  it("buildLlmsFullTxt skills/skills-full-2 metadata", () => {
    const entries = [
      fixtureEntry("skills", "skills-full-2", {
        sourceUrl: "https://github.com/example/skills-full-2",
        docsUrl: "https://docs.example.com/skills-full-2",
        platforms: ["claude-code"],
        safetyNotes: "Safety note 2",
        prerequisites: ["Node 2"],
        installCommand: "npm install skills-full-2",
        configSnippet: '{ "key": "2" }',
        fullCopy: "full copy 2",
      }),
    ];
    const output = buildLlmsFullTxt("https://heyclau.de", {
      categories: FIXTURE_CATEGORIES,
      entries,
      registryEntries: [],
    });
    expect(output).toContain("## skills skills-full-2");
    expect(output).toContain(
      "URL: https://heyclau.de/entry/skills/skills-full-2",
    );
    expect(output).toContain("Safety: Safety note 2");
    expect(output).toContain("npm install skills-full-2");
    expect(output).toContain("full copy 2");
  });
  it("buildLlmsFullTxt skills/skills-full-3 metadata", () => {
    const entries = [
      fixtureEntry("skills", "skills-full-3", {
        sourceUrl: "https://github.com/example/skills-full-3",
        docsUrl: "https://docs.example.com/skills-full-3",
        platforms: ["claude-code"],
        safetyNotes: "Safety note 3",
        prerequisites: ["Node 3"],
        installCommand: "npm install skills-full-3",
        configSnippet: '{ "key": "3" }',
        fullCopy: "full copy 3",
      }),
    ];
    const output = buildLlmsFullTxt("https://heyclau.de", {
      categories: FIXTURE_CATEGORIES,
      entries,
      registryEntries: [],
    });
    expect(output).toContain("## skills skills-full-3");
    expect(output).toContain(
      "URL: https://heyclau.de/entry/skills/skills-full-3",
    );
    expect(output).toContain("Safety: Safety note 3");
    expect(output).toContain("npm install skills-full-3");
    expect(output).toContain("full copy 3");
  });
  it("buildLlmsFullTxt skills/skills-full-4 metadata", () => {
    const entries = [
      fixtureEntry("skills", "skills-full-4", {
        sourceUrl: "https://github.com/example/skills-full-4",
        docsUrl: "https://docs.example.com/skills-full-4",
        platforms: ["claude-code"],
        safetyNotes: "Safety note 4",
        prerequisites: ["Node 4"],
        installCommand: "npm install skills-full-4",
        configSnippet: '{ "key": "4" }',
        fullCopy: "full copy 4",
      }),
    ];
    const output = buildLlmsFullTxt("https://heyclau.de", {
      categories: FIXTURE_CATEGORIES,
      entries,
      registryEntries: [],
    });
    expect(output).toContain("## skills skills-full-4");
    expect(output).toContain(
      "URL: https://heyclau.de/entry/skills/skills-full-4",
    );
    expect(output).toContain("Safety: Safety note 4");
    expect(output).toContain("npm install skills-full-4");
    expect(output).toContain("full copy 4");
  });
  it("buildLlmsFullTxt skills/skills-full-5 metadata", () => {
    const entries = [
      fixtureEntry("skills", "skills-full-5", {
        sourceUrl: "https://github.com/example/skills-full-5",
        docsUrl: "https://docs.example.com/skills-full-5",
        platforms: ["claude-code"],
        safetyNotes: "Safety note 5",
        prerequisites: ["Node 5"],
        installCommand: "npm install skills-full-5",
        configSnippet: '{ "key": "5" }',
        fullCopy: "full copy 5",
      }),
    ];
    const output = buildLlmsFullTxt("https://heyclau.de", {
      categories: FIXTURE_CATEGORIES,
      entries,
      registryEntries: [],
    });
    expect(output).toContain("## skills skills-full-5");
    expect(output).toContain(
      "URL: https://heyclau.de/entry/skills/skills-full-5",
    );
    expect(output).toContain("Safety: Safety note 5");
    expect(output).toContain("npm install skills-full-5");
    expect(output).toContain("full copy 5");
  });
  it("buildLlmsFullTxt skills/skills-full-6 metadata", () => {
    const entries = [
      fixtureEntry("skills", "skills-full-6", {
        sourceUrl: "https://github.com/example/skills-full-6",
        docsUrl: "https://docs.example.com/skills-full-6",
        platforms: ["claude-code"],
        safetyNotes: "Safety note 6",
        prerequisites: ["Node 6"],
        installCommand: "npm install skills-full-6",
        configSnippet: '{ "key": "6" }',
        fullCopy: "full copy 6",
      }),
    ];
    const output = buildLlmsFullTxt("https://heyclau.de", {
      categories: FIXTURE_CATEGORIES,
      entries,
      registryEntries: [],
    });
    expect(output).toContain("## skills skills-full-6");
    expect(output).toContain(
      "URL: https://heyclau.de/entry/skills/skills-full-6",
    );
    expect(output).toContain("Safety: Safety note 6");
    expect(output).toContain("npm install skills-full-6");
    expect(output).toContain("full copy 6");
  });
  it("buildLlmsFullTxt skills/skills-full-7 metadata", () => {
    const entries = [
      fixtureEntry("skills", "skills-full-7", {
        sourceUrl: "https://github.com/example/skills-full-7",
        docsUrl: "https://docs.example.com/skills-full-7",
        platforms: ["claude-code"],
        safetyNotes: "Safety note 7",
        prerequisites: ["Node 7"],
        installCommand: "npm install skills-full-7",
        configSnippet: '{ "key": "7" }',
        fullCopy: "full copy 7",
      }),
    ];
    const output = buildLlmsFullTxt("https://heyclau.de", {
      categories: FIXTURE_CATEGORIES,
      entries,
      registryEntries: [],
    });
    expect(output).toContain("## skills skills-full-7");
    expect(output).toContain(
      "URL: https://heyclau.de/entry/skills/skills-full-7",
    );
    expect(output).toContain("Safety: Safety note 7");
    expect(output).toContain("npm install skills-full-7");
    expect(output).toContain("full copy 7");
  });
  it("buildLlmsFullTxt skills/skills-full-8 metadata", () => {
    const entries = [
      fixtureEntry("skills", "skills-full-8", {
        sourceUrl: "https://github.com/example/skills-full-8",
        docsUrl: "https://docs.example.com/skills-full-8",
        platforms: ["claude-code"],
        safetyNotes: "Safety note 8",
        prerequisites: ["Node 8"],
        installCommand: "npm install skills-full-8",
        configSnippet: '{ "key": "8" }',
        fullCopy: "full copy 8",
      }),
    ];
    const output = buildLlmsFullTxt("https://heyclau.de", {
      categories: FIXTURE_CATEGORIES,
      entries,
      registryEntries: [],
    });
    expect(output).toContain("## skills skills-full-8");
    expect(output).toContain(
      "URL: https://heyclau.de/entry/skills/skills-full-8",
    );
    expect(output).toContain("Safety: Safety note 8");
    expect(output).toContain("npm install skills-full-8");
    expect(output).toContain("full copy 8");
  });
  it("buildLlmsFullTxt skills/skills-full-9 metadata", () => {
    const entries = [
      fixtureEntry("skills", "skills-full-9", {
        sourceUrl: "https://github.com/example/skills-full-9",
        docsUrl: "https://docs.example.com/skills-full-9",
        platforms: ["claude-code"],
        safetyNotes: "Safety note 9",
        prerequisites: ["Node 9"],
        installCommand: "npm install skills-full-9",
        configSnippet: '{ "key": "9" }',
        fullCopy: "full copy 9",
      }),
    ];
    const output = buildLlmsFullTxt("https://heyclau.de", {
      categories: FIXTURE_CATEGORIES,
      entries,
      registryEntries: [],
    });
    expect(output).toContain("## skills skills-full-9");
    expect(output).toContain(
      "URL: https://heyclau.de/entry/skills/skills-full-9",
    );
    expect(output).toContain("Safety: Safety note 9");
    expect(output).toContain("npm install skills-full-9");
    expect(output).toContain("full copy 9");
  });
  it("buildLlmsFullTxt skills/skills-full-10 metadata", () => {
    const entries = [
      fixtureEntry("skills", "skills-full-10", {
        sourceUrl: "https://github.com/example/skills-full-10",
        docsUrl: "https://docs.example.com/skills-full-10",
        platforms: ["claude-code"],
        safetyNotes: "Safety note 10",
        prerequisites: ["Node 10"],
        installCommand: "npm install skills-full-10",
        configSnippet: '{ "key": "10" }',
        fullCopy: "full copy 10",
      }),
    ];
    const output = buildLlmsFullTxt("https://heyclau.de", {
      categories: FIXTURE_CATEGORIES,
      entries,
      registryEntries: [],
    });
    expect(output).toContain("## skills skills-full-10");
    expect(output).toContain(
      "URL: https://heyclau.de/entry/skills/skills-full-10",
    );
    expect(output).toContain("Safety: Safety note 10");
    expect(output).toContain("npm install skills-full-10");
    expect(output).toContain("full copy 10");
  });
  it("buildLlmsFullTxt skills/skills-full-11 metadata", () => {
    const entries = [
      fixtureEntry("skills", "skills-full-11", {
        sourceUrl: "https://github.com/example/skills-full-11",
        docsUrl: "https://docs.example.com/skills-full-11",
        platforms: ["claude-code"],
        safetyNotes: "Safety note 11",
        prerequisites: ["Node 11"],
        installCommand: "npm install skills-full-11",
        configSnippet: '{ "key": "11" }',
        fullCopy: "full copy 11",
      }),
    ];
    const output = buildLlmsFullTxt("https://heyclau.de", {
      categories: FIXTURE_CATEGORIES,
      entries,
      registryEntries: [],
    });
    expect(output).toContain("## skills skills-full-11");
    expect(output).toContain(
      "URL: https://heyclau.de/entry/skills/skills-full-11",
    );
    expect(output).toContain("Safety: Safety note 11");
    expect(output).toContain("npm install skills-full-11");
    expect(output).toContain("full copy 11");
  });
  it("buildLlmsFullTxt rules/rules-full-0 metadata", () => {
    const entries = [
      fixtureEntry("rules", "rules-full-0", {
        sourceUrl: "https://github.com/example/rules-full-0",
        docsUrl: "https://docs.example.com/rules-full-0",
        platforms: ["claude-code"],
        safetyNotes: "Safety note 0",
        prerequisites: ["Node 0"],
        installCommand: "npm install rules-full-0",
        configSnippet: '{ "key": "0" }',
        fullCopy: "full copy 0",
      }),
    ];
    const output = buildLlmsFullTxt("https://heyclau.de", {
      categories: FIXTURE_CATEGORIES,
      entries,
      registryEntries: [],
    });
    expect(output).toContain("## rules rules-full-0");
    expect(output).toContain(
      "URL: https://heyclau.de/entry/rules/rules-full-0",
    );
    expect(output).toContain("Safety: Safety note 0");
    expect(output).toContain("npm install rules-full-0");
    expect(output).toContain("full copy 0");
  });
  it("buildLlmsFullTxt rules/rules-full-1 metadata", () => {
    const entries = [
      fixtureEntry("rules", "rules-full-1", {
        sourceUrl: "https://github.com/example/rules-full-1",
        docsUrl: "https://docs.example.com/rules-full-1",
        platforms: ["claude-code"],
        safetyNotes: "Safety note 1",
        prerequisites: ["Node 1"],
        installCommand: "npm install rules-full-1",
        configSnippet: '{ "key": "1" }',
        fullCopy: "full copy 1",
      }),
    ];
    const output = buildLlmsFullTxt("https://heyclau.de", {
      categories: FIXTURE_CATEGORIES,
      entries,
      registryEntries: [],
    });
    expect(output).toContain("## rules rules-full-1");
    expect(output).toContain(
      "URL: https://heyclau.de/entry/rules/rules-full-1",
    );
    expect(output).toContain("Safety: Safety note 1");
    expect(output).toContain("npm install rules-full-1");
    expect(output).toContain("full copy 1");
  });
  it("buildLlmsFullTxt rules/rules-full-2 metadata", () => {
    const entries = [
      fixtureEntry("rules", "rules-full-2", {
        sourceUrl: "https://github.com/example/rules-full-2",
        docsUrl: "https://docs.example.com/rules-full-2",
        platforms: ["claude-code"],
        safetyNotes: "Safety note 2",
        prerequisites: ["Node 2"],
        installCommand: "npm install rules-full-2",
        configSnippet: '{ "key": "2" }',
        fullCopy: "full copy 2",
      }),
    ];
    const output = buildLlmsFullTxt("https://heyclau.de", {
      categories: FIXTURE_CATEGORIES,
      entries,
      registryEntries: [],
    });
    expect(output).toContain("## rules rules-full-2");
    expect(output).toContain(
      "URL: https://heyclau.de/entry/rules/rules-full-2",
    );
    expect(output).toContain("Safety: Safety note 2");
    expect(output).toContain("npm install rules-full-2");
    expect(output).toContain("full copy 2");
  });
  it("buildLlmsFullTxt rules/rules-full-3 metadata", () => {
    const entries = [
      fixtureEntry("rules", "rules-full-3", {
        sourceUrl: "https://github.com/example/rules-full-3",
        docsUrl: "https://docs.example.com/rules-full-3",
        platforms: ["claude-code"],
        safetyNotes: "Safety note 3",
        prerequisites: ["Node 3"],
        installCommand: "npm install rules-full-3",
        configSnippet: '{ "key": "3" }',
        fullCopy: "full copy 3",
      }),
    ];
    const output = buildLlmsFullTxt("https://heyclau.de", {
      categories: FIXTURE_CATEGORIES,
      entries,
      registryEntries: [],
    });
    expect(output).toContain("## rules rules-full-3");
    expect(output).toContain(
      "URL: https://heyclau.de/entry/rules/rules-full-3",
    );
    expect(output).toContain("Safety: Safety note 3");
    expect(output).toContain("npm install rules-full-3");
    expect(output).toContain("full copy 3");
  });
  it("buildLlmsFullTxt rules/rules-full-4 metadata", () => {
    const entries = [
      fixtureEntry("rules", "rules-full-4", {
        sourceUrl: "https://github.com/example/rules-full-4",
        docsUrl: "https://docs.example.com/rules-full-4",
        platforms: ["claude-code"],
        safetyNotes: "Safety note 4",
        prerequisites: ["Node 4"],
        installCommand: "npm install rules-full-4",
        configSnippet: '{ "key": "4" }',
        fullCopy: "full copy 4",
      }),
    ];
    const output = buildLlmsFullTxt("https://heyclau.de", {
      categories: FIXTURE_CATEGORIES,
      entries,
      registryEntries: [],
    });
    expect(output).toContain("## rules rules-full-4");
    expect(output).toContain(
      "URL: https://heyclau.de/entry/rules/rules-full-4",
    );
    expect(output).toContain("Safety: Safety note 4");
    expect(output).toContain("npm install rules-full-4");
    expect(output).toContain("full copy 4");
  });
  it("buildLlmsFullTxt rules/rules-full-5 metadata", () => {
    const entries = [
      fixtureEntry("rules", "rules-full-5", {
        sourceUrl: "https://github.com/example/rules-full-5",
        docsUrl: "https://docs.example.com/rules-full-5",
        platforms: ["claude-code"],
        safetyNotes: "Safety note 5",
        prerequisites: ["Node 5"],
        installCommand: "npm install rules-full-5",
        configSnippet: '{ "key": "5" }',
        fullCopy: "full copy 5",
      }),
    ];
    const output = buildLlmsFullTxt("https://heyclau.de", {
      categories: FIXTURE_CATEGORIES,
      entries,
      registryEntries: [],
    });
    expect(output).toContain("## rules rules-full-5");
    expect(output).toContain(
      "URL: https://heyclau.de/entry/rules/rules-full-5",
    );
    expect(output).toContain("Safety: Safety note 5");
    expect(output).toContain("npm install rules-full-5");
    expect(output).toContain("full copy 5");
  });
  it("buildLlmsFullTxt rules/rules-full-6 metadata", () => {
    const entries = [
      fixtureEntry("rules", "rules-full-6", {
        sourceUrl: "https://github.com/example/rules-full-6",
        docsUrl: "https://docs.example.com/rules-full-6",
        platforms: ["claude-code"],
        safetyNotes: "Safety note 6",
        prerequisites: ["Node 6"],
        installCommand: "npm install rules-full-6",
        configSnippet: '{ "key": "6" }',
        fullCopy: "full copy 6",
      }),
    ];
    const output = buildLlmsFullTxt("https://heyclau.de", {
      categories: FIXTURE_CATEGORIES,
      entries,
      registryEntries: [],
    });
    expect(output).toContain("## rules rules-full-6");
    expect(output).toContain(
      "URL: https://heyclau.de/entry/rules/rules-full-6",
    );
    expect(output).toContain("Safety: Safety note 6");
    expect(output).toContain("npm install rules-full-6");
    expect(output).toContain("full copy 6");
  });
  it("buildLlmsFullTxt rules/rules-full-7 metadata", () => {
    const entries = [
      fixtureEntry("rules", "rules-full-7", {
        sourceUrl: "https://github.com/example/rules-full-7",
        docsUrl: "https://docs.example.com/rules-full-7",
        platforms: ["claude-code"],
        safetyNotes: "Safety note 7",
        prerequisites: ["Node 7"],
        installCommand: "npm install rules-full-7",
        configSnippet: '{ "key": "7" }',
        fullCopy: "full copy 7",
      }),
    ];
    const output = buildLlmsFullTxt("https://heyclau.de", {
      categories: FIXTURE_CATEGORIES,
      entries,
      registryEntries: [],
    });
    expect(output).toContain("## rules rules-full-7");
    expect(output).toContain(
      "URL: https://heyclau.de/entry/rules/rules-full-7",
    );
    expect(output).toContain("Safety: Safety note 7");
    expect(output).toContain("npm install rules-full-7");
    expect(output).toContain("full copy 7");
  });
  it("buildLlmsFullTxt rules/rules-full-8 metadata", () => {
    const entries = [
      fixtureEntry("rules", "rules-full-8", {
        sourceUrl: "https://github.com/example/rules-full-8",
        docsUrl: "https://docs.example.com/rules-full-8",
        platforms: ["claude-code"],
        safetyNotes: "Safety note 8",
        prerequisites: ["Node 8"],
        installCommand: "npm install rules-full-8",
        configSnippet: '{ "key": "8" }',
        fullCopy: "full copy 8",
      }),
    ];
    const output = buildLlmsFullTxt("https://heyclau.de", {
      categories: FIXTURE_CATEGORIES,
      entries,
      registryEntries: [],
    });
    expect(output).toContain("## rules rules-full-8");
    expect(output).toContain(
      "URL: https://heyclau.de/entry/rules/rules-full-8",
    );
    expect(output).toContain("Safety: Safety note 8");
    expect(output).toContain("npm install rules-full-8");
    expect(output).toContain("full copy 8");
  });
  it("buildLlmsFullTxt rules/rules-full-9 metadata", () => {
    const entries = [
      fixtureEntry("rules", "rules-full-9", {
        sourceUrl: "https://github.com/example/rules-full-9",
        docsUrl: "https://docs.example.com/rules-full-9",
        platforms: ["claude-code"],
        safetyNotes: "Safety note 9",
        prerequisites: ["Node 9"],
        installCommand: "npm install rules-full-9",
        configSnippet: '{ "key": "9" }',
        fullCopy: "full copy 9",
      }),
    ];
    const output = buildLlmsFullTxt("https://heyclau.de", {
      categories: FIXTURE_CATEGORIES,
      entries,
      registryEntries: [],
    });
    expect(output).toContain("## rules rules-full-9");
    expect(output).toContain(
      "URL: https://heyclau.de/entry/rules/rules-full-9",
    );
    expect(output).toContain("Safety: Safety note 9");
    expect(output).toContain("npm install rules-full-9");
    expect(output).toContain("full copy 9");
  });
  it("buildLlmsFullTxt rules/rules-full-10 metadata", () => {
    const entries = [
      fixtureEntry("rules", "rules-full-10", {
        sourceUrl: "https://github.com/example/rules-full-10",
        docsUrl: "https://docs.example.com/rules-full-10",
        platforms: ["claude-code"],
        safetyNotes: "Safety note 10",
        prerequisites: ["Node 10"],
        installCommand: "npm install rules-full-10",
        configSnippet: '{ "key": "10" }',
        fullCopy: "full copy 10",
      }),
    ];
    const output = buildLlmsFullTxt("https://heyclau.de", {
      categories: FIXTURE_CATEGORIES,
      entries,
      registryEntries: [],
    });
    expect(output).toContain("## rules rules-full-10");
    expect(output).toContain(
      "URL: https://heyclau.de/entry/rules/rules-full-10",
    );
    expect(output).toContain("Safety: Safety note 10");
    expect(output).toContain("npm install rules-full-10");
    expect(output).toContain("full copy 10");
  });
  it("buildLlmsFullTxt rules/rules-full-11 metadata", () => {
    const entries = [
      fixtureEntry("rules", "rules-full-11", {
        sourceUrl: "https://github.com/example/rules-full-11",
        docsUrl: "https://docs.example.com/rules-full-11",
        platforms: ["claude-code"],
        safetyNotes: "Safety note 11",
        prerequisites: ["Node 11"],
        installCommand: "npm install rules-full-11",
        configSnippet: '{ "key": "11" }',
        fullCopy: "full copy 11",
      }),
    ];
    const output = buildLlmsFullTxt("https://heyclau.de", {
      categories: FIXTURE_CATEGORIES,
      entries,
      registryEntries: [],
    });
    expect(output).toContain("## rules rules-full-11");
    expect(output).toContain(
      "URL: https://heyclau.de/entry/rules/rules-full-11",
    );
    expect(output).toContain("Safety: Safety note 11");
    expect(output).toContain("npm install rules-full-11");
    expect(output).toContain("full copy 11");
  });
  it("buildLlmsFullTxt commands/commands-full-0 metadata", () => {
    const entries = [
      fixtureEntry("commands", "commands-full-0", {
        sourceUrl: "https://github.com/example/commands-full-0",
        docsUrl: "https://docs.example.com/commands-full-0",
        platforms: ["claude-code"],
        safetyNotes: "Safety note 0",
        prerequisites: ["Node 0"],
        installCommand: "npm install commands-full-0",
        configSnippet: '{ "key": "0" }',
        fullCopy: "full copy 0",
      }),
    ];
    const output = buildLlmsFullTxt("https://heyclau.de", {
      categories: FIXTURE_CATEGORIES,
      entries,
      registryEntries: [],
    });
    expect(output).toContain("## commands commands-full-0");
    expect(output).toContain(
      "URL: https://heyclau.de/entry/commands/commands-full-0",
    );
    expect(output).toContain("Safety: Safety note 0");
    expect(output).toContain("npm install commands-full-0");
    expect(output).toContain("full copy 0");
  });
  it("buildLlmsFullTxt commands/commands-full-1 metadata", () => {
    const entries = [
      fixtureEntry("commands", "commands-full-1", {
        sourceUrl: "https://github.com/example/commands-full-1",
        docsUrl: "https://docs.example.com/commands-full-1",
        platforms: ["claude-code"],
        safetyNotes: "Safety note 1",
        prerequisites: ["Node 1"],
        installCommand: "npm install commands-full-1",
        configSnippet: '{ "key": "1" }',
        fullCopy: "full copy 1",
      }),
    ];
    const output = buildLlmsFullTxt("https://heyclau.de", {
      categories: FIXTURE_CATEGORIES,
      entries,
      registryEntries: [],
    });
    expect(output).toContain("## commands commands-full-1");
    expect(output).toContain(
      "URL: https://heyclau.de/entry/commands/commands-full-1",
    );
    expect(output).toContain("Safety: Safety note 1");
    expect(output).toContain("npm install commands-full-1");
    expect(output).toContain("full copy 1");
  });
  it("buildLlmsFullTxt commands/commands-full-2 metadata", () => {
    const entries = [
      fixtureEntry("commands", "commands-full-2", {
        sourceUrl: "https://github.com/example/commands-full-2",
        docsUrl: "https://docs.example.com/commands-full-2",
        platforms: ["claude-code"],
        safetyNotes: "Safety note 2",
        prerequisites: ["Node 2"],
        installCommand: "npm install commands-full-2",
        configSnippet: '{ "key": "2" }',
        fullCopy: "full copy 2",
      }),
    ];
    const output = buildLlmsFullTxt("https://heyclau.de", {
      categories: FIXTURE_CATEGORIES,
      entries,
      registryEntries: [],
    });
    expect(output).toContain("## commands commands-full-2");
    expect(output).toContain(
      "URL: https://heyclau.de/entry/commands/commands-full-2",
    );
    expect(output).toContain("Safety: Safety note 2");
    expect(output).toContain("npm install commands-full-2");
    expect(output).toContain("full copy 2");
  });
  it("buildLlmsFullTxt commands/commands-full-3 metadata", () => {
    const entries = [
      fixtureEntry("commands", "commands-full-3", {
        sourceUrl: "https://github.com/example/commands-full-3",
        docsUrl: "https://docs.example.com/commands-full-3",
        platforms: ["claude-code"],
        safetyNotes: "Safety note 3",
        prerequisites: ["Node 3"],
        installCommand: "npm install commands-full-3",
        configSnippet: '{ "key": "3" }',
        fullCopy: "full copy 3",
      }),
    ];
    const output = buildLlmsFullTxt("https://heyclau.de", {
      categories: FIXTURE_CATEGORIES,
      entries,
      registryEntries: [],
    });
    expect(output).toContain("## commands commands-full-3");
    expect(output).toContain(
      "URL: https://heyclau.de/entry/commands/commands-full-3",
    );
    expect(output).toContain("Safety: Safety note 3");
    expect(output).toContain("npm install commands-full-3");
    expect(output).toContain("full copy 3");
  });
  it("buildLlmsFullTxt commands/commands-full-4 metadata", () => {
    const entries = [
      fixtureEntry("commands", "commands-full-4", {
        sourceUrl: "https://github.com/example/commands-full-4",
        docsUrl: "https://docs.example.com/commands-full-4",
        platforms: ["claude-code"],
        safetyNotes: "Safety note 4",
        prerequisites: ["Node 4"],
        installCommand: "npm install commands-full-4",
        configSnippet: '{ "key": "4" }',
        fullCopy: "full copy 4",
      }),
    ];
    const output = buildLlmsFullTxt("https://heyclau.de", {
      categories: FIXTURE_CATEGORIES,
      entries,
      registryEntries: [],
    });
    expect(output).toContain("## commands commands-full-4");
    expect(output).toContain(
      "URL: https://heyclau.de/entry/commands/commands-full-4",
    );
    expect(output).toContain("Safety: Safety note 4");
    expect(output).toContain("npm install commands-full-4");
    expect(output).toContain("full copy 4");
  });
  it("buildLlmsFullTxt commands/commands-full-5 metadata", () => {
    const entries = [
      fixtureEntry("commands", "commands-full-5", {
        sourceUrl: "https://github.com/example/commands-full-5",
        docsUrl: "https://docs.example.com/commands-full-5",
        platforms: ["claude-code"],
        safetyNotes: "Safety note 5",
        prerequisites: ["Node 5"],
        installCommand: "npm install commands-full-5",
        configSnippet: '{ "key": "5" }',
        fullCopy: "full copy 5",
      }),
    ];
    const output = buildLlmsFullTxt("https://heyclau.de", {
      categories: FIXTURE_CATEGORIES,
      entries,
      registryEntries: [],
    });
    expect(output).toContain("## commands commands-full-5");
    expect(output).toContain(
      "URL: https://heyclau.de/entry/commands/commands-full-5",
    );
    expect(output).toContain("Safety: Safety note 5");
    expect(output).toContain("npm install commands-full-5");
    expect(output).toContain("full copy 5");
  });
  it("buildLlmsFullTxt commands/commands-full-6 metadata", () => {
    const entries = [
      fixtureEntry("commands", "commands-full-6", {
        sourceUrl: "https://github.com/example/commands-full-6",
        docsUrl: "https://docs.example.com/commands-full-6",
        platforms: ["claude-code"],
        safetyNotes: "Safety note 6",
        prerequisites: ["Node 6"],
        installCommand: "npm install commands-full-6",
        configSnippet: '{ "key": "6" }',
        fullCopy: "full copy 6",
      }),
    ];
    const output = buildLlmsFullTxt("https://heyclau.de", {
      categories: FIXTURE_CATEGORIES,
      entries,
      registryEntries: [],
    });
    expect(output).toContain("## commands commands-full-6");
    expect(output).toContain(
      "URL: https://heyclau.de/entry/commands/commands-full-6",
    );
    expect(output).toContain("Safety: Safety note 6");
    expect(output).toContain("npm install commands-full-6");
    expect(output).toContain("full copy 6");
  });
  it("buildLlmsFullTxt commands/commands-full-7 metadata", () => {
    const entries = [
      fixtureEntry("commands", "commands-full-7", {
        sourceUrl: "https://github.com/example/commands-full-7",
        docsUrl: "https://docs.example.com/commands-full-7",
        platforms: ["claude-code"],
        safetyNotes: "Safety note 7",
        prerequisites: ["Node 7"],
        installCommand: "npm install commands-full-7",
        configSnippet: '{ "key": "7" }',
        fullCopy: "full copy 7",
      }),
    ];
    const output = buildLlmsFullTxt("https://heyclau.de", {
      categories: FIXTURE_CATEGORIES,
      entries,
      registryEntries: [],
    });
    expect(output).toContain("## commands commands-full-7");
    expect(output).toContain(
      "URL: https://heyclau.de/entry/commands/commands-full-7",
    );
    expect(output).toContain("Safety: Safety note 7");
    expect(output).toContain("npm install commands-full-7");
    expect(output).toContain("full copy 7");
  });
  it("buildLlmsFullTxt commands/commands-full-8 metadata", () => {
    const entries = [
      fixtureEntry("commands", "commands-full-8", {
        sourceUrl: "https://github.com/example/commands-full-8",
        docsUrl: "https://docs.example.com/commands-full-8",
        platforms: ["claude-code"],
        safetyNotes: "Safety note 8",
        prerequisites: ["Node 8"],
        installCommand: "npm install commands-full-8",
        configSnippet: '{ "key": "8" }',
        fullCopy: "full copy 8",
      }),
    ];
    const output = buildLlmsFullTxt("https://heyclau.de", {
      categories: FIXTURE_CATEGORIES,
      entries,
      registryEntries: [],
    });
    expect(output).toContain("## commands commands-full-8");
    expect(output).toContain(
      "URL: https://heyclau.de/entry/commands/commands-full-8",
    );
    expect(output).toContain("Safety: Safety note 8");
    expect(output).toContain("npm install commands-full-8");
    expect(output).toContain("full copy 8");
  });
  it("buildLlmsFullTxt commands/commands-full-9 metadata", () => {
    const entries = [
      fixtureEntry("commands", "commands-full-9", {
        sourceUrl: "https://github.com/example/commands-full-9",
        docsUrl: "https://docs.example.com/commands-full-9",
        platforms: ["claude-code"],
        safetyNotes: "Safety note 9",
        prerequisites: ["Node 9"],
        installCommand: "npm install commands-full-9",
        configSnippet: '{ "key": "9" }',
        fullCopy: "full copy 9",
      }),
    ];
    const output = buildLlmsFullTxt("https://heyclau.de", {
      categories: FIXTURE_CATEGORIES,
      entries,
      registryEntries: [],
    });
    expect(output).toContain("## commands commands-full-9");
    expect(output).toContain(
      "URL: https://heyclau.de/entry/commands/commands-full-9",
    );
    expect(output).toContain("Safety: Safety note 9");
    expect(output).toContain("npm install commands-full-9");
    expect(output).toContain("full copy 9");
  });
  it("buildLlmsFullTxt commands/commands-full-10 metadata", () => {
    const entries = [
      fixtureEntry("commands", "commands-full-10", {
        sourceUrl: "https://github.com/example/commands-full-10",
        docsUrl: "https://docs.example.com/commands-full-10",
        platforms: ["claude-code"],
        safetyNotes: "Safety note 10",
        prerequisites: ["Node 10"],
        installCommand: "npm install commands-full-10",
        configSnippet: '{ "key": "10" }',
        fullCopy: "full copy 10",
      }),
    ];
    const output = buildLlmsFullTxt("https://heyclau.de", {
      categories: FIXTURE_CATEGORIES,
      entries,
      registryEntries: [],
    });
    expect(output).toContain("## commands commands-full-10");
    expect(output).toContain(
      "URL: https://heyclau.de/entry/commands/commands-full-10",
    );
    expect(output).toContain("Safety: Safety note 10");
    expect(output).toContain("npm install commands-full-10");
    expect(output).toContain("full copy 10");
  });
  it("buildLlmsFullTxt commands/commands-full-11 metadata", () => {
    const entries = [
      fixtureEntry("commands", "commands-full-11", {
        sourceUrl: "https://github.com/example/commands-full-11",
        docsUrl: "https://docs.example.com/commands-full-11",
        platforms: ["claude-code"],
        safetyNotes: "Safety note 11",
        prerequisites: ["Node 11"],
        installCommand: "npm install commands-full-11",
        configSnippet: '{ "key": "11" }',
        fullCopy: "full copy 11",
      }),
    ];
    const output = buildLlmsFullTxt("https://heyclau.de", {
      categories: FIXTURE_CATEGORIES,
      entries,
      registryEntries: [],
    });
    expect(output).toContain("## commands commands-full-11");
    expect(output).toContain(
      "URL: https://heyclau.de/entry/commands/commands-full-11",
    );
    expect(output).toContain("Safety: Safety note 11");
    expect(output).toContain("npm install commands-full-11");
    expect(output).toContain("full copy 11");
  });
  it("buildLlmsFullTxt hooks/hooks-full-0 metadata", () => {
    const entries = [
      fixtureEntry("hooks", "hooks-full-0", {
        sourceUrl: "https://github.com/example/hooks-full-0",
        docsUrl: "https://docs.example.com/hooks-full-0",
        platforms: ["claude-code"],
        safetyNotes: "Safety note 0",
        prerequisites: ["Node 0"],
        installCommand: "npm install hooks-full-0",
        configSnippet: '{ "key": "0" }',
        fullCopy: "full copy 0",
      }),
    ];
    const output = buildLlmsFullTxt("https://heyclau.de", {
      categories: FIXTURE_CATEGORIES,
      entries,
      registryEntries: [],
    });
    expect(output).toContain("## hooks hooks-full-0");
    expect(output).toContain(
      "URL: https://heyclau.de/entry/hooks/hooks-full-0",
    );
    expect(output).toContain("Safety: Safety note 0");
    expect(output).toContain("npm install hooks-full-0");
    expect(output).toContain("full copy 0");
  });
  it("buildLlmsFullTxt hooks/hooks-full-1 metadata", () => {
    const entries = [
      fixtureEntry("hooks", "hooks-full-1", {
        sourceUrl: "https://github.com/example/hooks-full-1",
        docsUrl: "https://docs.example.com/hooks-full-1",
        platforms: ["claude-code"],
        safetyNotes: "Safety note 1",
        prerequisites: ["Node 1"],
        installCommand: "npm install hooks-full-1",
        configSnippet: '{ "key": "1" }',
        fullCopy: "full copy 1",
      }),
    ];
    const output = buildLlmsFullTxt("https://heyclau.de", {
      categories: FIXTURE_CATEGORIES,
      entries,
      registryEntries: [],
    });
    expect(output).toContain("## hooks hooks-full-1");
    expect(output).toContain(
      "URL: https://heyclau.de/entry/hooks/hooks-full-1",
    );
    expect(output).toContain("Safety: Safety note 1");
    expect(output).toContain("npm install hooks-full-1");
    expect(output).toContain("full copy 1");
  });
  it("buildLlmsFullTxt hooks/hooks-full-2 metadata", () => {
    const entries = [
      fixtureEntry("hooks", "hooks-full-2", {
        sourceUrl: "https://github.com/example/hooks-full-2",
        docsUrl: "https://docs.example.com/hooks-full-2",
        platforms: ["claude-code"],
        safetyNotes: "Safety note 2",
        prerequisites: ["Node 2"],
        installCommand: "npm install hooks-full-2",
        configSnippet: '{ "key": "2" }',
        fullCopy: "full copy 2",
      }),
    ];
    const output = buildLlmsFullTxt("https://heyclau.de", {
      categories: FIXTURE_CATEGORIES,
      entries,
      registryEntries: [],
    });
    expect(output).toContain("## hooks hooks-full-2");
    expect(output).toContain(
      "URL: https://heyclau.de/entry/hooks/hooks-full-2",
    );
    expect(output).toContain("Safety: Safety note 2");
    expect(output).toContain("npm install hooks-full-2");
    expect(output).toContain("full copy 2");
  });
  it("buildLlmsFullTxt hooks/hooks-full-3 metadata", () => {
    const entries = [
      fixtureEntry("hooks", "hooks-full-3", {
        sourceUrl: "https://github.com/example/hooks-full-3",
        docsUrl: "https://docs.example.com/hooks-full-3",
        platforms: ["claude-code"],
        safetyNotes: "Safety note 3",
        prerequisites: ["Node 3"],
        installCommand: "npm install hooks-full-3",
        configSnippet: '{ "key": "3" }',
        fullCopy: "full copy 3",
      }),
    ];
    const output = buildLlmsFullTxt("https://heyclau.de", {
      categories: FIXTURE_CATEGORIES,
      entries,
      registryEntries: [],
    });
    expect(output).toContain("## hooks hooks-full-3");
    expect(output).toContain(
      "URL: https://heyclau.de/entry/hooks/hooks-full-3",
    );
    expect(output).toContain("Safety: Safety note 3");
    expect(output).toContain("npm install hooks-full-3");
    expect(output).toContain("full copy 3");
  });
  it("buildLlmsFullTxt hooks/hooks-full-4 metadata", () => {
    const entries = [
      fixtureEntry("hooks", "hooks-full-4", {
        sourceUrl: "https://github.com/example/hooks-full-4",
        docsUrl: "https://docs.example.com/hooks-full-4",
        platforms: ["claude-code"],
        safetyNotes: "Safety note 4",
        prerequisites: ["Node 4"],
        installCommand: "npm install hooks-full-4",
        configSnippet: '{ "key": "4" }',
        fullCopy: "full copy 4",
      }),
    ];
    const output = buildLlmsFullTxt("https://heyclau.de", {
      categories: FIXTURE_CATEGORIES,
      entries,
      registryEntries: [],
    });
    expect(output).toContain("## hooks hooks-full-4");
    expect(output).toContain(
      "URL: https://heyclau.de/entry/hooks/hooks-full-4",
    );
    expect(output).toContain("Safety: Safety note 4");
    expect(output).toContain("npm install hooks-full-4");
    expect(output).toContain("full copy 4");
  });
  it("buildLlmsFullTxt hooks/hooks-full-5 metadata", () => {
    const entries = [
      fixtureEntry("hooks", "hooks-full-5", {
        sourceUrl: "https://github.com/example/hooks-full-5",
        docsUrl: "https://docs.example.com/hooks-full-5",
        platforms: ["claude-code"],
        safetyNotes: "Safety note 5",
        prerequisites: ["Node 5"],
        installCommand: "npm install hooks-full-5",
        configSnippet: '{ "key": "5" }',
        fullCopy: "full copy 5",
      }),
    ];
    const output = buildLlmsFullTxt("https://heyclau.de", {
      categories: FIXTURE_CATEGORIES,
      entries,
      registryEntries: [],
    });
    expect(output).toContain("## hooks hooks-full-5");
    expect(output).toContain(
      "URL: https://heyclau.de/entry/hooks/hooks-full-5",
    );
    expect(output).toContain("Safety: Safety note 5");
    expect(output).toContain("npm install hooks-full-5");
    expect(output).toContain("full copy 5");
  });
  it("buildLlmsFullTxt hooks/hooks-full-6 metadata", () => {
    const entries = [
      fixtureEntry("hooks", "hooks-full-6", {
        sourceUrl: "https://github.com/example/hooks-full-6",
        docsUrl: "https://docs.example.com/hooks-full-6",
        platforms: ["claude-code"],
        safetyNotes: "Safety note 6",
        prerequisites: ["Node 6"],
        installCommand: "npm install hooks-full-6",
        configSnippet: '{ "key": "6" }',
        fullCopy: "full copy 6",
      }),
    ];
    const output = buildLlmsFullTxt("https://heyclau.de", {
      categories: FIXTURE_CATEGORIES,
      entries,
      registryEntries: [],
    });
    expect(output).toContain("## hooks hooks-full-6");
    expect(output).toContain(
      "URL: https://heyclau.de/entry/hooks/hooks-full-6",
    );
    expect(output).toContain("Safety: Safety note 6");
    expect(output).toContain("npm install hooks-full-6");
    expect(output).toContain("full copy 6");
  });
  it("buildLlmsFullTxt hooks/hooks-full-7 metadata", () => {
    const entries = [
      fixtureEntry("hooks", "hooks-full-7", {
        sourceUrl: "https://github.com/example/hooks-full-7",
        docsUrl: "https://docs.example.com/hooks-full-7",
        platforms: ["claude-code"],
        safetyNotes: "Safety note 7",
        prerequisites: ["Node 7"],
        installCommand: "npm install hooks-full-7",
        configSnippet: '{ "key": "7" }',
        fullCopy: "full copy 7",
      }),
    ];
    const output = buildLlmsFullTxt("https://heyclau.de", {
      categories: FIXTURE_CATEGORIES,
      entries,
      registryEntries: [],
    });
    expect(output).toContain("## hooks hooks-full-7");
    expect(output).toContain(
      "URL: https://heyclau.de/entry/hooks/hooks-full-7",
    );
    expect(output).toContain("Safety: Safety note 7");
    expect(output).toContain("npm install hooks-full-7");
    expect(output).toContain("full copy 7");
  });
  it("buildLlmsFullTxt hooks/hooks-full-8 metadata", () => {
    const entries = [
      fixtureEntry("hooks", "hooks-full-8", {
        sourceUrl: "https://github.com/example/hooks-full-8",
        docsUrl: "https://docs.example.com/hooks-full-8",
        platforms: ["claude-code"],
        safetyNotes: "Safety note 8",
        prerequisites: ["Node 8"],
        installCommand: "npm install hooks-full-8",
        configSnippet: '{ "key": "8" }',
        fullCopy: "full copy 8",
      }),
    ];
    const output = buildLlmsFullTxt("https://heyclau.de", {
      categories: FIXTURE_CATEGORIES,
      entries,
      registryEntries: [],
    });
    expect(output).toContain("## hooks hooks-full-8");
    expect(output).toContain(
      "URL: https://heyclau.de/entry/hooks/hooks-full-8",
    );
    expect(output).toContain("Safety: Safety note 8");
    expect(output).toContain("npm install hooks-full-8");
    expect(output).toContain("full copy 8");
  });
  it("buildLlmsFullTxt hooks/hooks-full-9 metadata", () => {
    const entries = [
      fixtureEntry("hooks", "hooks-full-9", {
        sourceUrl: "https://github.com/example/hooks-full-9",
        docsUrl: "https://docs.example.com/hooks-full-9",
        platforms: ["claude-code"],
        safetyNotes: "Safety note 9",
        prerequisites: ["Node 9"],
        installCommand: "npm install hooks-full-9",
        configSnippet: '{ "key": "9" }',
        fullCopy: "full copy 9",
      }),
    ];
    const output = buildLlmsFullTxt("https://heyclau.de", {
      categories: FIXTURE_CATEGORIES,
      entries,
      registryEntries: [],
    });
    expect(output).toContain("## hooks hooks-full-9");
    expect(output).toContain(
      "URL: https://heyclau.de/entry/hooks/hooks-full-9",
    );
    expect(output).toContain("Safety: Safety note 9");
    expect(output).toContain("npm install hooks-full-9");
    expect(output).toContain("full copy 9");
  });
  it("buildLlmsFullTxt hooks/hooks-full-10 metadata", () => {
    const entries = [
      fixtureEntry("hooks", "hooks-full-10", {
        sourceUrl: "https://github.com/example/hooks-full-10",
        docsUrl: "https://docs.example.com/hooks-full-10",
        platforms: ["claude-code"],
        safetyNotes: "Safety note 10",
        prerequisites: ["Node 10"],
        installCommand: "npm install hooks-full-10",
        configSnippet: '{ "key": "10" }',
        fullCopy: "full copy 10",
      }),
    ];
    const output = buildLlmsFullTxt("https://heyclau.de", {
      categories: FIXTURE_CATEGORIES,
      entries,
      registryEntries: [],
    });
    expect(output).toContain("## hooks hooks-full-10");
    expect(output).toContain(
      "URL: https://heyclau.de/entry/hooks/hooks-full-10",
    );
    expect(output).toContain("Safety: Safety note 10");
    expect(output).toContain("npm install hooks-full-10");
    expect(output).toContain("full copy 10");
  });
  it("buildLlmsFullTxt hooks/hooks-full-11 metadata", () => {
    const entries = [
      fixtureEntry("hooks", "hooks-full-11", {
        sourceUrl: "https://github.com/example/hooks-full-11",
        docsUrl: "https://docs.example.com/hooks-full-11",
        platforms: ["claude-code"],
        safetyNotes: "Safety note 11",
        prerequisites: ["Node 11"],
        installCommand: "npm install hooks-full-11",
        configSnippet: '{ "key": "11" }',
        fullCopy: "full copy 11",
      }),
    ];
    const output = buildLlmsFullTxt("https://heyclau.de", {
      categories: FIXTURE_CATEGORIES,
      entries,
      registryEntries: [],
    });
    expect(output).toContain("## hooks hooks-full-11");
    expect(output).toContain(
      "URL: https://heyclau.de/entry/hooks/hooks-full-11",
    );
    expect(output).toContain("Safety: Safety note 11");
    expect(output).toContain("npm install hooks-full-11");
    expect(output).toContain("full copy 11");
  });
  it("buildLlmsFullTxt guides/guides-full-0 metadata", () => {
    const entries = [
      fixtureEntry("guides", "guides-full-0", {
        sourceUrl: "https://github.com/example/guides-full-0",
        docsUrl: "https://docs.example.com/guides-full-0",
        platforms: ["claude-code"],
        safetyNotes: "Safety note 0",
        prerequisites: ["Node 0"],
        installCommand: "npm install guides-full-0",
        configSnippet: '{ "key": "0" }',
        fullCopy: "full copy 0",
      }),
    ];
    const output = buildLlmsFullTxt("https://heyclau.de", {
      categories: FIXTURE_CATEGORIES,
      entries,
      registryEntries: [],
    });
    expect(output).toContain("## guides guides-full-0");
    expect(output).toContain(
      "URL: https://heyclau.de/entry/guides/guides-full-0",
    );
    expect(output).toContain("Safety: Safety note 0");
    expect(output).toContain("npm install guides-full-0");
    expect(output).toContain("full copy 0");
  });
  it("buildLlmsFullTxt guides/guides-full-1 metadata", () => {
    const entries = [
      fixtureEntry("guides", "guides-full-1", {
        sourceUrl: "https://github.com/example/guides-full-1",
        docsUrl: "https://docs.example.com/guides-full-1",
        platforms: ["claude-code"],
        safetyNotes: "Safety note 1",
        prerequisites: ["Node 1"],
        installCommand: "npm install guides-full-1",
        configSnippet: '{ "key": "1" }',
        fullCopy: "full copy 1",
      }),
    ];
    const output = buildLlmsFullTxt("https://heyclau.de", {
      categories: FIXTURE_CATEGORIES,
      entries,
      registryEntries: [],
    });
    expect(output).toContain("## guides guides-full-1");
    expect(output).toContain(
      "URL: https://heyclau.de/entry/guides/guides-full-1",
    );
    expect(output).toContain("Safety: Safety note 1");
    expect(output).toContain("npm install guides-full-1");
    expect(output).toContain("full copy 1");
  });
  it("buildLlmsFullTxt guides/guides-full-2 metadata", () => {
    const entries = [
      fixtureEntry("guides", "guides-full-2", {
        sourceUrl: "https://github.com/example/guides-full-2",
        docsUrl: "https://docs.example.com/guides-full-2",
        platforms: ["claude-code"],
        safetyNotes: "Safety note 2",
        prerequisites: ["Node 2"],
        installCommand: "npm install guides-full-2",
        configSnippet: '{ "key": "2" }',
        fullCopy: "full copy 2",
      }),
    ];
    const output = buildLlmsFullTxt("https://heyclau.de", {
      categories: FIXTURE_CATEGORIES,
      entries,
      registryEntries: [],
    });
    expect(output).toContain("## guides guides-full-2");
    expect(output).toContain(
      "URL: https://heyclau.de/entry/guides/guides-full-2",
    );
    expect(output).toContain("Safety: Safety note 2");
    expect(output).toContain("npm install guides-full-2");
    expect(output).toContain("full copy 2");
  });
  it("buildLlmsFullTxt guides/guides-full-3 metadata", () => {
    const entries = [
      fixtureEntry("guides", "guides-full-3", {
        sourceUrl: "https://github.com/example/guides-full-3",
        docsUrl: "https://docs.example.com/guides-full-3",
        platforms: ["claude-code"],
        safetyNotes: "Safety note 3",
        prerequisites: ["Node 3"],
        installCommand: "npm install guides-full-3",
        configSnippet: '{ "key": "3" }',
        fullCopy: "full copy 3",
      }),
    ];
    const output = buildLlmsFullTxt("https://heyclau.de", {
      categories: FIXTURE_CATEGORIES,
      entries,
      registryEntries: [],
    });
    expect(output).toContain("## guides guides-full-3");
    expect(output).toContain(
      "URL: https://heyclau.de/entry/guides/guides-full-3",
    );
    expect(output).toContain("Safety: Safety note 3");
    expect(output).toContain("npm install guides-full-3");
    expect(output).toContain("full copy 3");
  });
  it("buildLlmsFullTxt guides/guides-full-4 metadata", () => {
    const entries = [
      fixtureEntry("guides", "guides-full-4", {
        sourceUrl: "https://github.com/example/guides-full-4",
        docsUrl: "https://docs.example.com/guides-full-4",
        platforms: ["claude-code"],
        safetyNotes: "Safety note 4",
        prerequisites: ["Node 4"],
        installCommand: "npm install guides-full-4",
        configSnippet: '{ "key": "4" }',
        fullCopy: "full copy 4",
      }),
    ];
    const output = buildLlmsFullTxt("https://heyclau.de", {
      categories: FIXTURE_CATEGORIES,
      entries,
      registryEntries: [],
    });
    expect(output).toContain("## guides guides-full-4");
    expect(output).toContain(
      "URL: https://heyclau.de/entry/guides/guides-full-4",
    );
    expect(output).toContain("Safety: Safety note 4");
    expect(output).toContain("npm install guides-full-4");
    expect(output).toContain("full copy 4");
  });
  it("buildLlmsFullTxt guides/guides-full-5 metadata", () => {
    const entries = [
      fixtureEntry("guides", "guides-full-5", {
        sourceUrl: "https://github.com/example/guides-full-5",
        docsUrl: "https://docs.example.com/guides-full-5",
        platforms: ["claude-code"],
        safetyNotes: "Safety note 5",
        prerequisites: ["Node 5"],
        installCommand: "npm install guides-full-5",
        configSnippet: '{ "key": "5" }',
        fullCopy: "full copy 5",
      }),
    ];
    const output = buildLlmsFullTxt("https://heyclau.de", {
      categories: FIXTURE_CATEGORIES,
      entries,
      registryEntries: [],
    });
    expect(output).toContain("## guides guides-full-5");
    expect(output).toContain(
      "URL: https://heyclau.de/entry/guides/guides-full-5",
    );
    expect(output).toContain("Safety: Safety note 5");
    expect(output).toContain("npm install guides-full-5");
    expect(output).toContain("full copy 5");
  });
  it("buildLlmsFullTxt guides/guides-full-6 metadata", () => {
    const entries = [
      fixtureEntry("guides", "guides-full-6", {
        sourceUrl: "https://github.com/example/guides-full-6",
        docsUrl: "https://docs.example.com/guides-full-6",
        platforms: ["claude-code"],
        safetyNotes: "Safety note 6",
        prerequisites: ["Node 6"],
        installCommand: "npm install guides-full-6",
        configSnippet: '{ "key": "6" }',
        fullCopy: "full copy 6",
      }),
    ];
    const output = buildLlmsFullTxt("https://heyclau.de", {
      categories: FIXTURE_CATEGORIES,
      entries,
      registryEntries: [],
    });
    expect(output).toContain("## guides guides-full-6");
    expect(output).toContain(
      "URL: https://heyclau.de/entry/guides/guides-full-6",
    );
    expect(output).toContain("Safety: Safety note 6");
    expect(output).toContain("npm install guides-full-6");
    expect(output).toContain("full copy 6");
  });
  it("buildLlmsFullTxt guides/guides-full-7 metadata", () => {
    const entries = [
      fixtureEntry("guides", "guides-full-7", {
        sourceUrl: "https://github.com/example/guides-full-7",
        docsUrl: "https://docs.example.com/guides-full-7",
        platforms: ["claude-code"],
        safetyNotes: "Safety note 7",
        prerequisites: ["Node 7"],
        installCommand: "npm install guides-full-7",
        configSnippet: '{ "key": "7" }',
        fullCopy: "full copy 7",
      }),
    ];
    const output = buildLlmsFullTxt("https://heyclau.de", {
      categories: FIXTURE_CATEGORIES,
      entries,
      registryEntries: [],
    });
    expect(output).toContain("## guides guides-full-7");
    expect(output).toContain(
      "URL: https://heyclau.de/entry/guides/guides-full-7",
    );
    expect(output).toContain("Safety: Safety note 7");
    expect(output).toContain("npm install guides-full-7");
    expect(output).toContain("full copy 7");
  });
  it("buildLlmsFullTxt guides/guides-full-8 metadata", () => {
    const entries = [
      fixtureEntry("guides", "guides-full-8", {
        sourceUrl: "https://github.com/example/guides-full-8",
        docsUrl: "https://docs.example.com/guides-full-8",
        platforms: ["claude-code"],
        safetyNotes: "Safety note 8",
        prerequisites: ["Node 8"],
        installCommand: "npm install guides-full-8",
        configSnippet: '{ "key": "8" }',
        fullCopy: "full copy 8",
      }),
    ];
    const output = buildLlmsFullTxt("https://heyclau.de", {
      categories: FIXTURE_CATEGORIES,
      entries,
      registryEntries: [],
    });
    expect(output).toContain("## guides guides-full-8");
    expect(output).toContain(
      "URL: https://heyclau.de/entry/guides/guides-full-8",
    );
    expect(output).toContain("Safety: Safety note 8");
    expect(output).toContain("npm install guides-full-8");
    expect(output).toContain("full copy 8");
  });
  it("buildLlmsFullTxt guides/guides-full-9 metadata", () => {
    const entries = [
      fixtureEntry("guides", "guides-full-9", {
        sourceUrl: "https://github.com/example/guides-full-9",
        docsUrl: "https://docs.example.com/guides-full-9",
        platforms: ["claude-code"],
        safetyNotes: "Safety note 9",
        prerequisites: ["Node 9"],
        installCommand: "npm install guides-full-9",
        configSnippet: '{ "key": "9" }',
        fullCopy: "full copy 9",
      }),
    ];
    const output = buildLlmsFullTxt("https://heyclau.de", {
      categories: FIXTURE_CATEGORIES,
      entries,
      registryEntries: [],
    });
    expect(output).toContain("## guides guides-full-9");
    expect(output).toContain(
      "URL: https://heyclau.de/entry/guides/guides-full-9",
    );
    expect(output).toContain("Safety: Safety note 9");
    expect(output).toContain("npm install guides-full-9");
    expect(output).toContain("full copy 9");
  });
  it("buildLlmsFullTxt guides/guides-full-10 metadata", () => {
    const entries = [
      fixtureEntry("guides", "guides-full-10", {
        sourceUrl: "https://github.com/example/guides-full-10",
        docsUrl: "https://docs.example.com/guides-full-10",
        platforms: ["claude-code"],
        safetyNotes: "Safety note 10",
        prerequisites: ["Node 10"],
        installCommand: "npm install guides-full-10",
        configSnippet: '{ "key": "10" }',
        fullCopy: "full copy 10",
      }),
    ];
    const output = buildLlmsFullTxt("https://heyclau.de", {
      categories: FIXTURE_CATEGORIES,
      entries,
      registryEntries: [],
    });
    expect(output).toContain("## guides guides-full-10");
    expect(output).toContain(
      "URL: https://heyclau.de/entry/guides/guides-full-10",
    );
    expect(output).toContain("Safety: Safety note 10");
    expect(output).toContain("npm install guides-full-10");
    expect(output).toContain("full copy 10");
  });
  it("buildLlmsFullTxt guides/guides-full-11 metadata", () => {
    const entries = [
      fixtureEntry("guides", "guides-full-11", {
        sourceUrl: "https://github.com/example/guides-full-11",
        docsUrl: "https://docs.example.com/guides-full-11",
        platforms: ["claude-code"],
        safetyNotes: "Safety note 11",
        prerequisites: ["Node 11"],
        installCommand: "npm install guides-full-11",
        configSnippet: '{ "key": "11" }',
        fullCopy: "full copy 11",
      }),
    ];
    const output = buildLlmsFullTxt("https://heyclau.de", {
      categories: FIXTURE_CATEGORIES,
      entries,
      registryEntries: [],
    });
    expect(output).toContain("## guides guides-full-11");
    expect(output).toContain(
      "URL: https://heyclau.de/entry/guides/guides-full-11",
    );
    expect(output).toContain("Safety: Safety note 11");
    expect(output).toContain("npm install guides-full-11");
    expect(output).toContain("full copy 11");
  });
  it("buildLlmsFullTxt collections/collections-full-0 metadata", () => {
    const entries = [
      fixtureEntry("collections", "collections-full-0", {
        sourceUrl: "https://github.com/example/collections-full-0",
        docsUrl: "https://docs.example.com/collections-full-0",
        platforms: ["claude-code"],
        safetyNotes: "Safety note 0",
        prerequisites: ["Node 0"],
        installCommand: "npm install collections-full-0",
        configSnippet: '{ "key": "0" }',
        fullCopy: "full copy 0",
      }),
    ];
    const output = buildLlmsFullTxt("https://heyclau.de", {
      categories: FIXTURE_CATEGORIES,
      entries,
      registryEntries: [],
    });
    expect(output).toContain("## collections collections-full-0");
    expect(output).toContain(
      "URL: https://heyclau.de/entry/collections/collections-full-0",
    );
    expect(output).toContain("Safety: Safety note 0");
    expect(output).toContain("npm install collections-full-0");
    expect(output).toContain("full copy 0");
  });
  it("buildLlmsFullTxt collections/collections-full-1 metadata", () => {
    const entries = [
      fixtureEntry("collections", "collections-full-1", {
        sourceUrl: "https://github.com/example/collections-full-1",
        docsUrl: "https://docs.example.com/collections-full-1",
        platforms: ["claude-code"],
        safetyNotes: "Safety note 1",
        prerequisites: ["Node 1"],
        installCommand: "npm install collections-full-1",
        configSnippet: '{ "key": "1" }',
        fullCopy: "full copy 1",
      }),
    ];
    const output = buildLlmsFullTxt("https://heyclau.de", {
      categories: FIXTURE_CATEGORIES,
      entries,
      registryEntries: [],
    });
    expect(output).toContain("## collections collections-full-1");
    expect(output).toContain(
      "URL: https://heyclau.de/entry/collections/collections-full-1",
    );
    expect(output).toContain("Safety: Safety note 1");
    expect(output).toContain("npm install collections-full-1");
    expect(output).toContain("full copy 1");
  });
  it("buildLlmsFullTxt collections/collections-full-2 metadata", () => {
    const entries = [
      fixtureEntry("collections", "collections-full-2", {
        sourceUrl: "https://github.com/example/collections-full-2",
        docsUrl: "https://docs.example.com/collections-full-2",
        platforms: ["claude-code"],
        safetyNotes: "Safety note 2",
        prerequisites: ["Node 2"],
        installCommand: "npm install collections-full-2",
        configSnippet: '{ "key": "2" }',
        fullCopy: "full copy 2",
      }),
    ];
    const output = buildLlmsFullTxt("https://heyclau.de", {
      categories: FIXTURE_CATEGORIES,
      entries,
      registryEntries: [],
    });
    expect(output).toContain("## collections collections-full-2");
    expect(output).toContain(
      "URL: https://heyclau.de/entry/collections/collections-full-2",
    );
    expect(output).toContain("Safety: Safety note 2");
    expect(output).toContain("npm install collections-full-2");
    expect(output).toContain("full copy 2");
  });
  it("buildLlmsFullTxt collections/collections-full-3 metadata", () => {
    const entries = [
      fixtureEntry("collections", "collections-full-3", {
        sourceUrl: "https://github.com/example/collections-full-3",
        docsUrl: "https://docs.example.com/collections-full-3",
        platforms: ["claude-code"],
        safetyNotes: "Safety note 3",
        prerequisites: ["Node 3"],
        installCommand: "npm install collections-full-3",
        configSnippet: '{ "key": "3" }',
        fullCopy: "full copy 3",
      }),
    ];
    const output = buildLlmsFullTxt("https://heyclau.de", {
      categories: FIXTURE_CATEGORIES,
      entries,
      registryEntries: [],
    });
    expect(output).toContain("## collections collections-full-3");
    expect(output).toContain(
      "URL: https://heyclau.de/entry/collections/collections-full-3",
    );
    expect(output).toContain("Safety: Safety note 3");
    expect(output).toContain("npm install collections-full-3");
    expect(output).toContain("full copy 3");
  });
  it("buildLlmsFullTxt collections/collections-full-4 metadata", () => {
    const entries = [
      fixtureEntry("collections", "collections-full-4", {
        sourceUrl: "https://github.com/example/collections-full-4",
        docsUrl: "https://docs.example.com/collections-full-4",
        platforms: ["claude-code"],
        safetyNotes: "Safety note 4",
        prerequisites: ["Node 4"],
        installCommand: "npm install collections-full-4",
        configSnippet: '{ "key": "4" }',
        fullCopy: "full copy 4",
      }),
    ];
    const output = buildLlmsFullTxt("https://heyclau.de", {
      categories: FIXTURE_CATEGORIES,
      entries,
      registryEntries: [],
    });
    expect(output).toContain("## collections collections-full-4");
    expect(output).toContain(
      "URL: https://heyclau.de/entry/collections/collections-full-4",
    );
    expect(output).toContain("Safety: Safety note 4");
    expect(output).toContain("npm install collections-full-4");
    expect(output).toContain("full copy 4");
  });
  it("buildLlmsFullTxt collections/collections-full-5 metadata", () => {
    const entries = [
      fixtureEntry("collections", "collections-full-5", {
        sourceUrl: "https://github.com/example/collections-full-5",
        docsUrl: "https://docs.example.com/collections-full-5",
        platforms: ["claude-code"],
        safetyNotes: "Safety note 5",
        prerequisites: ["Node 5"],
        installCommand: "npm install collections-full-5",
        configSnippet: '{ "key": "5" }',
        fullCopy: "full copy 5",
      }),
    ];
    const output = buildLlmsFullTxt("https://heyclau.de", {
      categories: FIXTURE_CATEGORIES,
      entries,
      registryEntries: [],
    });
    expect(output).toContain("## collections collections-full-5");
    expect(output).toContain(
      "URL: https://heyclau.de/entry/collections/collections-full-5",
    );
    expect(output).toContain("Safety: Safety note 5");
    expect(output).toContain("npm install collections-full-5");
    expect(output).toContain("full copy 5");
  });
  it("buildLlmsFullTxt collections/collections-full-6 metadata", () => {
    const entries = [
      fixtureEntry("collections", "collections-full-6", {
        sourceUrl: "https://github.com/example/collections-full-6",
        docsUrl: "https://docs.example.com/collections-full-6",
        platforms: ["claude-code"],
        safetyNotes: "Safety note 6",
        prerequisites: ["Node 6"],
        installCommand: "npm install collections-full-6",
        configSnippet: '{ "key": "6" }',
        fullCopy: "full copy 6",
      }),
    ];
    const output = buildLlmsFullTxt("https://heyclau.de", {
      categories: FIXTURE_CATEGORIES,
      entries,
      registryEntries: [],
    });
    expect(output).toContain("## collections collections-full-6");
    expect(output).toContain(
      "URL: https://heyclau.de/entry/collections/collections-full-6",
    );
    expect(output).toContain("Safety: Safety note 6");
    expect(output).toContain("npm install collections-full-6");
    expect(output).toContain("full copy 6");
  });
  it("buildLlmsFullTxt collections/collections-full-7 metadata", () => {
    const entries = [
      fixtureEntry("collections", "collections-full-7", {
        sourceUrl: "https://github.com/example/collections-full-7",
        docsUrl: "https://docs.example.com/collections-full-7",
        platforms: ["claude-code"],
        safetyNotes: "Safety note 7",
        prerequisites: ["Node 7"],
        installCommand: "npm install collections-full-7",
        configSnippet: '{ "key": "7" }',
        fullCopy: "full copy 7",
      }),
    ];
    const output = buildLlmsFullTxt("https://heyclau.de", {
      categories: FIXTURE_CATEGORIES,
      entries,
      registryEntries: [],
    });
    expect(output).toContain("## collections collections-full-7");
    expect(output).toContain(
      "URL: https://heyclau.de/entry/collections/collections-full-7",
    );
    expect(output).toContain("Safety: Safety note 7");
    expect(output).toContain("npm install collections-full-7");
    expect(output).toContain("full copy 7");
  });
  it("buildLlmsFullTxt collections/collections-full-8 metadata", () => {
    const entries = [
      fixtureEntry("collections", "collections-full-8", {
        sourceUrl: "https://github.com/example/collections-full-8",
        docsUrl: "https://docs.example.com/collections-full-8",
        platforms: ["claude-code"],
        safetyNotes: "Safety note 8",
        prerequisites: ["Node 8"],
        installCommand: "npm install collections-full-8",
        configSnippet: '{ "key": "8" }',
        fullCopy: "full copy 8",
      }),
    ];
    const output = buildLlmsFullTxt("https://heyclau.de", {
      categories: FIXTURE_CATEGORIES,
      entries,
      registryEntries: [],
    });
    expect(output).toContain("## collections collections-full-8");
    expect(output).toContain(
      "URL: https://heyclau.de/entry/collections/collections-full-8",
    );
    expect(output).toContain("Safety: Safety note 8");
    expect(output).toContain("npm install collections-full-8");
    expect(output).toContain("full copy 8");
  });
  it("buildLlmsFullTxt collections/collections-full-9 metadata", () => {
    const entries = [
      fixtureEntry("collections", "collections-full-9", {
        sourceUrl: "https://github.com/example/collections-full-9",
        docsUrl: "https://docs.example.com/collections-full-9",
        platforms: ["claude-code"],
        safetyNotes: "Safety note 9",
        prerequisites: ["Node 9"],
        installCommand: "npm install collections-full-9",
        configSnippet: '{ "key": "9" }',
        fullCopy: "full copy 9",
      }),
    ];
    const output = buildLlmsFullTxt("https://heyclau.de", {
      categories: FIXTURE_CATEGORIES,
      entries,
      registryEntries: [],
    });
    expect(output).toContain("## collections collections-full-9");
    expect(output).toContain(
      "URL: https://heyclau.de/entry/collections/collections-full-9",
    );
    expect(output).toContain("Safety: Safety note 9");
    expect(output).toContain("npm install collections-full-9");
    expect(output).toContain("full copy 9");
  });
  it("buildLlmsFullTxt collections/collections-full-10 metadata", () => {
    const entries = [
      fixtureEntry("collections", "collections-full-10", {
        sourceUrl: "https://github.com/example/collections-full-10",
        docsUrl: "https://docs.example.com/collections-full-10",
        platforms: ["claude-code"],
        safetyNotes: "Safety note 10",
        prerequisites: ["Node 10"],
        installCommand: "npm install collections-full-10",
        configSnippet: '{ "key": "10" }',
        fullCopy: "full copy 10",
      }),
    ];
    const output = buildLlmsFullTxt("https://heyclau.de", {
      categories: FIXTURE_CATEGORIES,
      entries,
      registryEntries: [],
    });
    expect(output).toContain("## collections collections-full-10");
    expect(output).toContain(
      "URL: https://heyclau.de/entry/collections/collections-full-10",
    );
    expect(output).toContain("Safety: Safety note 10");
    expect(output).toContain("npm install collections-full-10");
    expect(output).toContain("full copy 10");
  });
  it("buildLlmsFullTxt collections/collections-full-11 metadata", () => {
    const entries = [
      fixtureEntry("collections", "collections-full-11", {
        sourceUrl: "https://github.com/example/collections-full-11",
        docsUrl: "https://docs.example.com/collections-full-11",
        platforms: ["claude-code"],
        safetyNotes: "Safety note 11",
        prerequisites: ["Node 11"],
        installCommand: "npm install collections-full-11",
        configSnippet: '{ "key": "11" }',
        fullCopy: "full copy 11",
      }),
    ];
    const output = buildLlmsFullTxt("https://heyclau.de", {
      categories: FIXTURE_CATEGORIES,
      entries,
      registryEntries: [],
    });
    expect(output).toContain("## collections collections-full-11");
    expect(output).toContain(
      "URL: https://heyclau.de/entry/collections/collections-full-11",
    );
    expect(output).toContain("Safety: Safety note 11");
    expect(output).toContain("npm install collections-full-11");
    expect(output).toContain("full copy 11");
  });
  it("buildLlmsFullTxt statuslines/statuslines-full-0 metadata", () => {
    const entries = [
      fixtureEntry("statuslines", "statuslines-full-0", {
        sourceUrl: "https://github.com/example/statuslines-full-0",
        docsUrl: "https://docs.example.com/statuslines-full-0",
        platforms: ["claude-code"],
        safetyNotes: "Safety note 0",
        prerequisites: ["Node 0"],
        installCommand: "npm install statuslines-full-0",
        configSnippet: '{ "key": "0" }',
        fullCopy: "full copy 0",
      }),
    ];
    const output = buildLlmsFullTxt("https://heyclau.de", {
      categories: FIXTURE_CATEGORIES,
      entries,
      registryEntries: [],
    });
    expect(output).toContain("## statuslines statuslines-full-0");
    expect(output).toContain(
      "URL: https://heyclau.de/entry/statuslines/statuslines-full-0",
    );
    expect(output).toContain("Safety: Safety note 0");
    expect(output).toContain("npm install statuslines-full-0");
    expect(output).toContain("full copy 0");
  });
  it("buildLlmsFullTxt statuslines/statuslines-full-1 metadata", () => {
    const entries = [
      fixtureEntry("statuslines", "statuslines-full-1", {
        sourceUrl: "https://github.com/example/statuslines-full-1",
        docsUrl: "https://docs.example.com/statuslines-full-1",
        platforms: ["claude-code"],
        safetyNotes: "Safety note 1",
        prerequisites: ["Node 1"],
        installCommand: "npm install statuslines-full-1",
        configSnippet: '{ "key": "1" }',
        fullCopy: "full copy 1",
      }),
    ];
    const output = buildLlmsFullTxt("https://heyclau.de", {
      categories: FIXTURE_CATEGORIES,
      entries,
      registryEntries: [],
    });
    expect(output).toContain("## statuslines statuslines-full-1");
    expect(output).toContain(
      "URL: https://heyclau.de/entry/statuslines/statuslines-full-1",
    );
    expect(output).toContain("Safety: Safety note 1");
    expect(output).toContain("npm install statuslines-full-1");
    expect(output).toContain("full copy 1");
  });
  it("buildLlmsFullTxt statuslines/statuslines-full-2 metadata", () => {
    const entries = [
      fixtureEntry("statuslines", "statuslines-full-2", {
        sourceUrl: "https://github.com/example/statuslines-full-2",
        docsUrl: "https://docs.example.com/statuslines-full-2",
        platforms: ["claude-code"],
        safetyNotes: "Safety note 2",
        prerequisites: ["Node 2"],
        installCommand: "npm install statuslines-full-2",
        configSnippet: '{ "key": "2" }',
        fullCopy: "full copy 2",
      }),
    ];
    const output = buildLlmsFullTxt("https://heyclau.de", {
      categories: FIXTURE_CATEGORIES,
      entries,
      registryEntries: [],
    });
    expect(output).toContain("## statuslines statuslines-full-2");
    expect(output).toContain(
      "URL: https://heyclau.de/entry/statuslines/statuslines-full-2",
    );
    expect(output).toContain("Safety: Safety note 2");
    expect(output).toContain("npm install statuslines-full-2");
    expect(output).toContain("full copy 2");
  });
  it("buildLlmsFullTxt statuslines/statuslines-full-3 metadata", () => {
    const entries = [
      fixtureEntry("statuslines", "statuslines-full-3", {
        sourceUrl: "https://github.com/example/statuslines-full-3",
        docsUrl: "https://docs.example.com/statuslines-full-3",
        platforms: ["claude-code"],
        safetyNotes: "Safety note 3",
        prerequisites: ["Node 3"],
        installCommand: "npm install statuslines-full-3",
        configSnippet: '{ "key": "3" }',
        fullCopy: "full copy 3",
      }),
    ];
    const output = buildLlmsFullTxt("https://heyclau.de", {
      categories: FIXTURE_CATEGORIES,
      entries,
      registryEntries: [],
    });
    expect(output).toContain("## statuslines statuslines-full-3");
    expect(output).toContain(
      "URL: https://heyclau.de/entry/statuslines/statuslines-full-3",
    );
    expect(output).toContain("Safety: Safety note 3");
    expect(output).toContain("npm install statuslines-full-3");
    expect(output).toContain("full copy 3");
  });
  it("buildLlmsFullTxt statuslines/statuslines-full-4 metadata", () => {
    const entries = [
      fixtureEntry("statuslines", "statuslines-full-4", {
        sourceUrl: "https://github.com/example/statuslines-full-4",
        docsUrl: "https://docs.example.com/statuslines-full-4",
        platforms: ["claude-code"],
        safetyNotes: "Safety note 4",
        prerequisites: ["Node 4"],
        installCommand: "npm install statuslines-full-4",
        configSnippet: '{ "key": "4" }',
        fullCopy: "full copy 4",
      }),
    ];
    const output = buildLlmsFullTxt("https://heyclau.de", {
      categories: FIXTURE_CATEGORIES,
      entries,
      registryEntries: [],
    });
    expect(output).toContain("## statuslines statuslines-full-4");
    expect(output).toContain(
      "URL: https://heyclau.de/entry/statuslines/statuslines-full-4",
    );
    expect(output).toContain("Safety: Safety note 4");
    expect(output).toContain("npm install statuslines-full-4");
    expect(output).toContain("full copy 4");
  });
  it("buildLlmsFullTxt statuslines/statuslines-full-5 metadata", () => {
    const entries = [
      fixtureEntry("statuslines", "statuslines-full-5", {
        sourceUrl: "https://github.com/example/statuslines-full-5",
        docsUrl: "https://docs.example.com/statuslines-full-5",
        platforms: ["claude-code"],
        safetyNotes: "Safety note 5",
        prerequisites: ["Node 5"],
        installCommand: "npm install statuslines-full-5",
        configSnippet: '{ "key": "5" }',
        fullCopy: "full copy 5",
      }),
    ];
    const output = buildLlmsFullTxt("https://heyclau.de", {
      categories: FIXTURE_CATEGORIES,
      entries,
      registryEntries: [],
    });
    expect(output).toContain("## statuslines statuslines-full-5");
    expect(output).toContain(
      "URL: https://heyclau.de/entry/statuslines/statuslines-full-5",
    );
    expect(output).toContain("Safety: Safety note 5");
    expect(output).toContain("npm install statuslines-full-5");
    expect(output).toContain("full copy 5");
  });
  it("buildLlmsFullTxt statuslines/statuslines-full-6 metadata", () => {
    const entries = [
      fixtureEntry("statuslines", "statuslines-full-6", {
        sourceUrl: "https://github.com/example/statuslines-full-6",
        docsUrl: "https://docs.example.com/statuslines-full-6",
        platforms: ["claude-code"],
        safetyNotes: "Safety note 6",
        prerequisites: ["Node 6"],
        installCommand: "npm install statuslines-full-6",
        configSnippet: '{ "key": "6" }',
        fullCopy: "full copy 6",
      }),
    ];
    const output = buildLlmsFullTxt("https://heyclau.de", {
      categories: FIXTURE_CATEGORIES,
      entries,
      registryEntries: [],
    });
    expect(output).toContain("## statuslines statuslines-full-6");
    expect(output).toContain(
      "URL: https://heyclau.de/entry/statuslines/statuslines-full-6",
    );
    expect(output).toContain("Safety: Safety note 6");
    expect(output).toContain("npm install statuslines-full-6");
    expect(output).toContain("full copy 6");
  });
  it("buildLlmsFullTxt statuslines/statuslines-full-7 metadata", () => {
    const entries = [
      fixtureEntry("statuslines", "statuslines-full-7", {
        sourceUrl: "https://github.com/example/statuslines-full-7",
        docsUrl: "https://docs.example.com/statuslines-full-7",
        platforms: ["claude-code"],
        safetyNotes: "Safety note 7",
        prerequisites: ["Node 7"],
        installCommand: "npm install statuslines-full-7",
        configSnippet: '{ "key": "7" }',
        fullCopy: "full copy 7",
      }),
    ];
    const output = buildLlmsFullTxt("https://heyclau.de", {
      categories: FIXTURE_CATEGORIES,
      entries,
      registryEntries: [],
    });
    expect(output).toContain("## statuslines statuslines-full-7");
    expect(output).toContain(
      "URL: https://heyclau.de/entry/statuslines/statuslines-full-7",
    );
    expect(output).toContain("Safety: Safety note 7");
    expect(output).toContain("npm install statuslines-full-7");
    expect(output).toContain("full copy 7");
  });
  it("buildLlmsFullTxt statuslines/statuslines-full-8 metadata", () => {
    const entries = [
      fixtureEntry("statuslines", "statuslines-full-8", {
        sourceUrl: "https://github.com/example/statuslines-full-8",
        docsUrl: "https://docs.example.com/statuslines-full-8",
        platforms: ["claude-code"],
        safetyNotes: "Safety note 8",
        prerequisites: ["Node 8"],
        installCommand: "npm install statuslines-full-8",
        configSnippet: '{ "key": "8" }',
        fullCopy: "full copy 8",
      }),
    ];
    const output = buildLlmsFullTxt("https://heyclau.de", {
      categories: FIXTURE_CATEGORIES,
      entries,
      registryEntries: [],
    });
    expect(output).toContain("## statuslines statuslines-full-8");
    expect(output).toContain(
      "URL: https://heyclau.de/entry/statuslines/statuslines-full-8",
    );
    expect(output).toContain("Safety: Safety note 8");
    expect(output).toContain("npm install statuslines-full-8");
    expect(output).toContain("full copy 8");
  });
  it("buildLlmsFullTxt statuslines/statuslines-full-9 metadata", () => {
    const entries = [
      fixtureEntry("statuslines", "statuslines-full-9", {
        sourceUrl: "https://github.com/example/statuslines-full-9",
        docsUrl: "https://docs.example.com/statuslines-full-9",
        platforms: ["claude-code"],
        safetyNotes: "Safety note 9",
        prerequisites: ["Node 9"],
        installCommand: "npm install statuslines-full-9",
        configSnippet: '{ "key": "9" }',
        fullCopy: "full copy 9",
      }),
    ];
    const output = buildLlmsFullTxt("https://heyclau.de", {
      categories: FIXTURE_CATEGORIES,
      entries,
      registryEntries: [],
    });
    expect(output).toContain("## statuslines statuslines-full-9");
    expect(output).toContain(
      "URL: https://heyclau.de/entry/statuslines/statuslines-full-9",
    );
    expect(output).toContain("Safety: Safety note 9");
    expect(output).toContain("npm install statuslines-full-9");
    expect(output).toContain("full copy 9");
  });
  it("buildLlmsFullTxt statuslines/statuslines-full-10 metadata", () => {
    const entries = [
      fixtureEntry("statuslines", "statuslines-full-10", {
        sourceUrl: "https://github.com/example/statuslines-full-10",
        docsUrl: "https://docs.example.com/statuslines-full-10",
        platforms: ["claude-code"],
        safetyNotes: "Safety note 10",
        prerequisites: ["Node 10"],
        installCommand: "npm install statuslines-full-10",
        configSnippet: '{ "key": "10" }',
        fullCopy: "full copy 10",
      }),
    ];
    const output = buildLlmsFullTxt("https://heyclau.de", {
      categories: FIXTURE_CATEGORIES,
      entries,
      registryEntries: [],
    });
    expect(output).toContain("## statuslines statuslines-full-10");
    expect(output).toContain(
      "URL: https://heyclau.de/entry/statuslines/statuslines-full-10",
    );
    expect(output).toContain("Safety: Safety note 10");
    expect(output).toContain("npm install statuslines-full-10");
    expect(output).toContain("full copy 10");
  });
  it("buildLlmsFullTxt statuslines/statuslines-full-11 metadata", () => {
    const entries = [
      fixtureEntry("statuslines", "statuslines-full-11", {
        sourceUrl: "https://github.com/example/statuslines-full-11",
        docsUrl: "https://docs.example.com/statuslines-full-11",
        platforms: ["claude-code"],
        safetyNotes: "Safety note 11",
        prerequisites: ["Node 11"],
        installCommand: "npm install statuslines-full-11",
        configSnippet: '{ "key": "11" }',
        fullCopy: "full copy 11",
      }),
    ];
    const output = buildLlmsFullTxt("https://heyclau.de", {
      categories: FIXTURE_CATEGORIES,
      entries,
      registryEntries: [],
    });
    expect(output).toContain("## statuslines statuslines-full-11");
    expect(output).toContain(
      "URL: https://heyclau.de/entry/statuslines/statuslines-full-11",
    );
    expect(output).toContain("Safety: Safety note 11");
    expect(output).toContain("npm install statuslines-full-11");
    expect(output).toContain("full copy 11");
  });
  it("buildLlmsFullTxt skips empty optional blocks 0", () => {
    const entries = [
      fixtureEntry("skills", "minimal-0", {
        sourceUrl: undefined,
        docsUrl: undefined,
        platforms: [],
        safetyNotes: undefined,
        prerequisites: undefined,
        installCommand: undefined,
        configSnippet: undefined,
        fullCopy: undefined,
      }),
    ];
    const output = buildLlmsFullTxt("https://heyclau.de", {
      categories: FIXTURE_CATEGORIES,
      entries,
      registryEntries: [],
    });
    expect(output).not.toContain("Safety:");
    expect(output).not.toContain("Prerequisites:");
    expect(output).not.toContain("Install:");
    expect(output).not.toContain("Citation facts:");
  });
  it("buildLlmsFullTxt skips empty optional blocks 1", () => {
    const entries = [
      fixtureEntry("skills", "minimal-1", {
        sourceUrl: undefined,
        docsUrl: undefined,
        platforms: [],
        safetyNotes: undefined,
        prerequisites: undefined,
        installCommand: undefined,
        configSnippet: undefined,
        fullCopy: undefined,
      }),
    ];
    const output = buildLlmsFullTxt("https://heyclau.de", {
      categories: FIXTURE_CATEGORIES,
      entries,
      registryEntries: [],
    });
    expect(output).not.toContain("Safety:");
    expect(output).not.toContain("Prerequisites:");
    expect(output).not.toContain("Install:");
    expect(output).not.toContain("Citation facts:");
  });
  it("buildLlmsFullTxt skips empty optional blocks 2", () => {
    const entries = [
      fixtureEntry("skills", "minimal-2", {
        sourceUrl: undefined,
        docsUrl: undefined,
        platforms: [],
        safetyNotes: undefined,
        prerequisites: undefined,
        installCommand: undefined,
        configSnippet: undefined,
        fullCopy: undefined,
      }),
    ];
    const output = buildLlmsFullTxt("https://heyclau.de", {
      categories: FIXTURE_CATEGORIES,
      entries,
      registryEntries: [],
    });
    expect(output).not.toContain("Safety:");
    expect(output).not.toContain("Prerequisites:");
    expect(output).not.toContain("Install:");
    expect(output).not.toContain("Citation facts:");
  });
  it("buildLlmsFullTxt skips empty optional blocks 3", () => {
    const entries = [
      fixtureEntry("skills", "minimal-3", {
        sourceUrl: undefined,
        docsUrl: undefined,
        platforms: [],
        safetyNotes: undefined,
        prerequisites: undefined,
        installCommand: undefined,
        configSnippet: undefined,
        fullCopy: undefined,
      }),
    ];
    const output = buildLlmsFullTxt("https://heyclau.de", {
      categories: FIXTURE_CATEGORIES,
      entries,
      registryEntries: [],
    });
    expect(output).not.toContain("Safety:");
    expect(output).not.toContain("Prerequisites:");
    expect(output).not.toContain("Install:");
    expect(output).not.toContain("Citation facts:");
  });
  it("buildLlmsFullTxt skips empty optional blocks 4", () => {
    const entries = [
      fixtureEntry("skills", "minimal-4", {
        sourceUrl: undefined,
        docsUrl: undefined,
        platforms: [],
        safetyNotes: undefined,
        prerequisites: undefined,
        installCommand: undefined,
        configSnippet: undefined,
        fullCopy: undefined,
      }),
    ];
    const output = buildLlmsFullTxt("https://heyclau.de", {
      categories: FIXTURE_CATEGORIES,
      entries,
      registryEntries: [],
    });
    expect(output).not.toContain("Safety:");
    expect(output).not.toContain("Prerequisites:");
    expect(output).not.toContain("Install:");
    expect(output).not.toContain("Citation facts:");
  });
  it("buildLlmsFullTxt skips empty optional blocks 5", () => {
    const entries = [
      fixtureEntry("skills", "minimal-5", {
        sourceUrl: undefined,
        docsUrl: undefined,
        platforms: [],
        safetyNotes: undefined,
        prerequisites: undefined,
        installCommand: undefined,
        configSnippet: undefined,
        fullCopy: undefined,
      }),
    ];
    const output = buildLlmsFullTxt("https://heyclau.de", {
      categories: FIXTURE_CATEGORIES,
      entries,
      registryEntries: [],
    });
    expect(output).not.toContain("Safety:");
    expect(output).not.toContain("Prerequisites:");
    expect(output).not.toContain("Install:");
    expect(output).not.toContain("Citation facts:");
  });
  it("buildLlmsFullTxt skips empty optional blocks 6", () => {
    const entries = [
      fixtureEntry("skills", "minimal-6", {
        sourceUrl: undefined,
        docsUrl: undefined,
        platforms: [],
        safetyNotes: undefined,
        prerequisites: undefined,
        installCommand: undefined,
        configSnippet: undefined,
        fullCopy: undefined,
      }),
    ];
    const output = buildLlmsFullTxt("https://heyclau.de", {
      categories: FIXTURE_CATEGORIES,
      entries,
      registryEntries: [],
    });
    expect(output).not.toContain("Safety:");
    expect(output).not.toContain("Prerequisites:");
    expect(output).not.toContain("Install:");
    expect(output).not.toContain("Citation facts:");
  });
  it("buildLlmsFullTxt skips empty optional blocks 7", () => {
    const entries = [
      fixtureEntry("skills", "minimal-7", {
        sourceUrl: undefined,
        docsUrl: undefined,
        platforms: [],
        safetyNotes: undefined,
        prerequisites: undefined,
        installCommand: undefined,
        configSnippet: undefined,
        fullCopy: undefined,
      }),
    ];
    const output = buildLlmsFullTxt("https://heyclau.de", {
      categories: FIXTURE_CATEGORIES,
      entries,
      registryEntries: [],
    });
    expect(output).not.toContain("Safety:");
    expect(output).not.toContain("Prerequisites:");
    expect(output).not.toContain("Install:");
    expect(output).not.toContain("Citation facts:");
  });
  it("buildLlmsFullTxt skips empty optional blocks 8", () => {
    const entries = [
      fixtureEntry("skills", "minimal-8", {
        sourceUrl: undefined,
        docsUrl: undefined,
        platforms: [],
        safetyNotes: undefined,
        prerequisites: undefined,
        installCommand: undefined,
        configSnippet: undefined,
        fullCopy: undefined,
      }),
    ];
    const output = buildLlmsFullTxt("https://heyclau.de", {
      categories: FIXTURE_CATEGORIES,
      entries,
      registryEntries: [],
    });
    expect(output).not.toContain("Safety:");
    expect(output).not.toContain("Prerequisites:");
    expect(output).not.toContain("Install:");
    expect(output).not.toContain("Citation facts:");
  });
  it("buildLlmsFullTxt skips empty optional blocks 9", () => {
    const entries = [
      fixtureEntry("skills", "minimal-9", {
        sourceUrl: undefined,
        docsUrl: undefined,
        platforms: [],
        safetyNotes: undefined,
        prerequisites: undefined,
        installCommand: undefined,
        configSnippet: undefined,
        fullCopy: undefined,
      }),
    ];
    const output = buildLlmsFullTxt("https://heyclau.de", {
      categories: FIXTURE_CATEGORIES,
      entries,
      registryEntries: [],
    });
    expect(output).not.toContain("Safety:");
    expect(output).not.toContain("Prerequisites:");
    expect(output).not.toContain("Install:");
    expect(output).not.toContain("Citation facts:");
  });
  it("buildLlmsFullTxt skips empty optional blocks 10", () => {
    const entries = [
      fixtureEntry("skills", "minimal-10", {
        sourceUrl: undefined,
        docsUrl: undefined,
        platforms: [],
        safetyNotes: undefined,
        prerequisites: undefined,
        installCommand: undefined,
        configSnippet: undefined,
        fullCopy: undefined,
      }),
    ];
    const output = buildLlmsFullTxt("https://heyclau.de", {
      categories: FIXTURE_CATEGORIES,
      entries,
      registryEntries: [],
    });
    expect(output).not.toContain("Safety:");
    expect(output).not.toContain("Prerequisites:");
    expect(output).not.toContain("Install:");
    expect(output).not.toContain("Citation facts:");
  });
  it("buildLlmsFullTxt skips empty optional blocks 11", () => {
    const entries = [
      fixtureEntry("skills", "minimal-11", {
        sourceUrl: undefined,
        docsUrl: undefined,
        platforms: [],
        safetyNotes: undefined,
        prerequisites: undefined,
        installCommand: undefined,
        configSnippet: undefined,
        fullCopy: undefined,
      }),
    ];
    const output = buildLlmsFullTxt("https://heyclau.de", {
      categories: FIXTURE_CATEGORIES,
      entries,
      registryEntries: [],
    });
    expect(output).not.toContain("Safety:");
    expect(output).not.toContain("Prerequisites:");
    expect(output).not.toContain("Install:");
    expect(output).not.toContain("Citation facts:");
  });
  it("buildLlmsFullTxt skips empty optional blocks 12", () => {
    const entries = [
      fixtureEntry("skills", "minimal-12", {
        sourceUrl: undefined,
        docsUrl: undefined,
        platforms: [],
        safetyNotes: undefined,
        prerequisites: undefined,
        installCommand: undefined,
        configSnippet: undefined,
        fullCopy: undefined,
      }),
    ];
    const output = buildLlmsFullTxt("https://heyclau.de", {
      categories: FIXTURE_CATEGORIES,
      entries,
      registryEntries: [],
    });
    expect(output).not.toContain("Safety:");
    expect(output).not.toContain("Prerequisites:");
    expect(output).not.toContain("Install:");
    expect(output).not.toContain("Citation facts:");
  });
  it("buildLlmsFullTxt skips empty optional blocks 13", () => {
    const entries = [
      fixtureEntry("skills", "minimal-13", {
        sourceUrl: undefined,
        docsUrl: undefined,
        platforms: [],
        safetyNotes: undefined,
        prerequisites: undefined,
        installCommand: undefined,
        configSnippet: undefined,
        fullCopy: undefined,
      }),
    ];
    const output = buildLlmsFullTxt("https://heyclau.de", {
      categories: FIXTURE_CATEGORIES,
      entries,
      registryEntries: [],
    });
    expect(output).not.toContain("Safety:");
    expect(output).not.toContain("Prerequisites:");
    expect(output).not.toContain("Install:");
    expect(output).not.toContain("Citation facts:");
  });
  it("buildLlmsFullTxt skips empty optional blocks 14", () => {
    const entries = [
      fixtureEntry("skills", "minimal-14", {
        sourceUrl: undefined,
        docsUrl: undefined,
        platforms: [],
        safetyNotes: undefined,
        prerequisites: undefined,
        installCommand: undefined,
        configSnippet: undefined,
        fullCopy: undefined,
      }),
    ];
    const output = buildLlmsFullTxt("https://heyclau.de", {
      categories: FIXTURE_CATEGORIES,
      entries,
      registryEntries: [],
    });
    expect(output).not.toContain("Safety:");
    expect(output).not.toContain("Prerequisites:");
    expect(output).not.toContain("Install:");
    expect(output).not.toContain("Citation facts:");
  });
  it("buildLlmsFullTxt skips empty optional blocks 15", () => {
    const entries = [
      fixtureEntry("skills", "minimal-15", {
        sourceUrl: undefined,
        docsUrl: undefined,
        platforms: [],
        safetyNotes: undefined,
        prerequisites: undefined,
        installCommand: undefined,
        configSnippet: undefined,
        fullCopy: undefined,
      }),
    ];
    const output = buildLlmsFullTxt("https://heyclau.de", {
      categories: FIXTURE_CATEGORIES,
      entries,
      registryEntries: [],
    });
    expect(output).not.toContain("Safety:");
    expect(output).not.toContain("Prerequisites:");
    expect(output).not.toContain("Install:");
    expect(output).not.toContain("Citation facts:");
  });
  it("buildLlmsFullTxt skips empty optional blocks 16", () => {
    const entries = [
      fixtureEntry("skills", "minimal-16", {
        sourceUrl: undefined,
        docsUrl: undefined,
        platforms: [],
        safetyNotes: undefined,
        prerequisites: undefined,
        installCommand: undefined,
        configSnippet: undefined,
        fullCopy: undefined,
      }),
    ];
    const output = buildLlmsFullTxt("https://heyclau.de", {
      categories: FIXTURE_CATEGORIES,
      entries,
      registryEntries: [],
    });
    expect(output).not.toContain("Safety:");
    expect(output).not.toContain("Prerequisites:");
    expect(output).not.toContain("Install:");
    expect(output).not.toContain("Citation facts:");
  });
  it("buildLlmsFullTxt skips empty optional blocks 17", () => {
    const entries = [
      fixtureEntry("skills", "minimal-17", {
        sourceUrl: undefined,
        docsUrl: undefined,
        platforms: [],
        safetyNotes: undefined,
        prerequisites: undefined,
        installCommand: undefined,
        configSnippet: undefined,
        fullCopy: undefined,
      }),
    ];
    const output = buildLlmsFullTxt("https://heyclau.de", {
      categories: FIXTURE_CATEGORIES,
      entries,
      registryEntries: [],
    });
    expect(output).not.toContain("Safety:");
    expect(output).not.toContain("Prerequisites:");
    expect(output).not.toContain("Install:");
    expect(output).not.toContain("Citation facts:");
  });
  it("buildLlmsFullTxt skips empty optional blocks 18", () => {
    const entries = [
      fixtureEntry("skills", "minimal-18", {
        sourceUrl: undefined,
        docsUrl: undefined,
        platforms: [],
        safetyNotes: undefined,
        prerequisites: undefined,
        installCommand: undefined,
        configSnippet: undefined,
        fullCopy: undefined,
      }),
    ];
    const output = buildLlmsFullTxt("https://heyclau.de", {
      categories: FIXTURE_CATEGORIES,
      entries,
      registryEntries: [],
    });
    expect(output).not.toContain("Safety:");
    expect(output).not.toContain("Prerequisites:");
    expect(output).not.toContain("Install:");
    expect(output).not.toContain("Citation facts:");
  });
  it("buildLlmsFullTxt skips empty optional blocks 19", () => {
    const entries = [
      fixtureEntry("skills", "minimal-19", {
        sourceUrl: undefined,
        docsUrl: undefined,
        platforms: [],
        safetyNotes: undefined,
        prerequisites: undefined,
        installCommand: undefined,
        configSnippet: undefined,
        fullCopy: undefined,
      }),
    ];
    const output = buildLlmsFullTxt("https://heyclau.de", {
      categories: FIXTURE_CATEGORIES,
      entries,
      registryEntries: [],
    });
    expect(output).not.toContain("Safety:");
    expect(output).not.toContain("Prerequisites:");
    expect(output).not.toContain("Install:");
    expect(output).not.toContain("Citation facts:");
  });
  it("buildLlmsFullTxt skips empty optional blocks 20", () => {
    const entries = [
      fixtureEntry("skills", "minimal-20", {
        sourceUrl: undefined,
        docsUrl: undefined,
        platforms: [],
        safetyNotes: undefined,
        prerequisites: undefined,
        installCommand: undefined,
        configSnippet: undefined,
        fullCopy: undefined,
      }),
    ];
    const output = buildLlmsFullTxt("https://heyclau.de", {
      categories: FIXTURE_CATEGORIES,
      entries,
      registryEntries: [],
    });
    expect(output).not.toContain("Safety:");
    expect(output).not.toContain("Prerequisites:");
    expect(output).not.toContain("Install:");
    expect(output).not.toContain("Citation facts:");
  });
  it("buildLlmsFullTxt skips empty optional blocks 21", () => {
    const entries = [
      fixtureEntry("skills", "minimal-21", {
        sourceUrl: undefined,
        docsUrl: undefined,
        platforms: [],
        safetyNotes: undefined,
        prerequisites: undefined,
        installCommand: undefined,
        configSnippet: undefined,
        fullCopy: undefined,
      }),
    ];
    const output = buildLlmsFullTxt("https://heyclau.de", {
      categories: FIXTURE_CATEGORIES,
      entries,
      registryEntries: [],
    });
    expect(output).not.toContain("Safety:");
    expect(output).not.toContain("Prerequisites:");
    expect(output).not.toContain("Install:");
    expect(output).not.toContain("Citation facts:");
  });
  it("buildLlmsFullTxt skips empty optional blocks 22", () => {
    const entries = [
      fixtureEntry("skills", "minimal-22", {
        sourceUrl: undefined,
        docsUrl: undefined,
        platforms: [],
        safetyNotes: undefined,
        prerequisites: undefined,
        installCommand: undefined,
        configSnippet: undefined,
        fullCopy: undefined,
      }),
    ];
    const output = buildLlmsFullTxt("https://heyclau.de", {
      categories: FIXTURE_CATEGORIES,
      entries,
      registryEntries: [],
    });
    expect(output).not.toContain("Safety:");
    expect(output).not.toContain("Prerequisites:");
    expect(output).not.toContain("Install:");
    expect(output).not.toContain("Citation facts:");
  });
  it("buildLlmsFullTxt skips empty optional blocks 23", () => {
    const entries = [
      fixtureEntry("skills", "minimal-23", {
        sourceUrl: undefined,
        docsUrl: undefined,
        platforms: [],
        safetyNotes: undefined,
        prerequisites: undefined,
        installCommand: undefined,
        configSnippet: undefined,
        fullCopy: undefined,
      }),
    ];
    const output = buildLlmsFullTxt("https://heyclau.de", {
      categories: FIXTURE_CATEGORIES,
      entries,
      registryEntries: [],
    });
    expect(output).not.toContain("Safety:");
    expect(output).not.toContain("Prerequisites:");
    expect(output).not.toContain("Install:");
    expect(output).not.toContain("Citation facts:");
  });
  it("buildLlmsFullTxt skips empty optional blocks 24", () => {
    const entries = [
      fixtureEntry("skills", "minimal-24", {
        sourceUrl: undefined,
        docsUrl: undefined,
        platforms: [],
        safetyNotes: undefined,
        prerequisites: undefined,
        installCommand: undefined,
        configSnippet: undefined,
        fullCopy: undefined,
      }),
    ];
    const output = buildLlmsFullTxt("https://heyclau.de", {
      categories: FIXTURE_CATEGORIES,
      entries,
      registryEntries: [],
    });
    expect(output).not.toContain("Safety:");
    expect(output).not.toContain("Prerequisites:");
    expect(output).not.toContain("Install:");
    expect(output).not.toContain("Citation facts:");
  });
  it("buildLlmsFullTxt skips empty optional blocks 25", () => {
    const entries = [
      fixtureEntry("skills", "minimal-25", {
        sourceUrl: undefined,
        docsUrl: undefined,
        platforms: [],
        safetyNotes: undefined,
        prerequisites: undefined,
        installCommand: undefined,
        configSnippet: undefined,
        fullCopy: undefined,
      }),
    ];
    const output = buildLlmsFullTxt("https://heyclau.de", {
      categories: FIXTURE_CATEGORIES,
      entries,
      registryEntries: [],
    });
    expect(output).not.toContain("Safety:");
    expect(output).not.toContain("Prerequisites:");
    expect(output).not.toContain("Install:");
    expect(output).not.toContain("Citation facts:");
  });
  it("buildLlmsFullTxt skips empty optional blocks 26", () => {
    const entries = [
      fixtureEntry("skills", "minimal-26", {
        sourceUrl: undefined,
        docsUrl: undefined,
        platforms: [],
        safetyNotes: undefined,
        prerequisites: undefined,
        installCommand: undefined,
        configSnippet: undefined,
        fullCopy: undefined,
      }),
    ];
    const output = buildLlmsFullTxt("https://heyclau.de", {
      categories: FIXTURE_CATEGORIES,
      entries,
      registryEntries: [],
    });
    expect(output).not.toContain("Safety:");
    expect(output).not.toContain("Prerequisites:");
    expect(output).not.toContain("Install:");
    expect(output).not.toContain("Citation facts:");
  });
  it("buildLlmsFullTxt skips empty optional blocks 27", () => {
    const entries = [
      fixtureEntry("skills", "minimal-27", {
        sourceUrl: undefined,
        docsUrl: undefined,
        platforms: [],
        safetyNotes: undefined,
        prerequisites: undefined,
        installCommand: undefined,
        configSnippet: undefined,
        fullCopy: undefined,
      }),
    ];
    const output = buildLlmsFullTxt("https://heyclau.de", {
      categories: FIXTURE_CATEGORIES,
      entries,
      registryEntries: [],
    });
    expect(output).not.toContain("Safety:");
    expect(output).not.toContain("Prerequisites:");
    expect(output).not.toContain("Install:");
    expect(output).not.toContain("Citation facts:");
  });
  it("buildLlmsFullTxt skips empty optional blocks 28", () => {
    const entries = [
      fixtureEntry("skills", "minimal-28", {
        sourceUrl: undefined,
        docsUrl: undefined,
        platforms: [],
        safetyNotes: undefined,
        prerequisites: undefined,
        installCommand: undefined,
        configSnippet: undefined,
        fullCopy: undefined,
      }),
    ];
    const output = buildLlmsFullTxt("https://heyclau.de", {
      categories: FIXTURE_CATEGORIES,
      entries,
      registryEntries: [],
    });
    expect(output).not.toContain("Safety:");
    expect(output).not.toContain("Prerequisites:");
    expect(output).not.toContain("Install:");
    expect(output).not.toContain("Citation facts:");
  });
  it("buildLlmsFullTxt skips empty optional blocks 29", () => {
    const entries = [
      fixtureEntry("skills", "minimal-29", {
        sourceUrl: undefined,
        docsUrl: undefined,
        platforms: [],
        safetyNotes: undefined,
        prerequisites: undefined,
        installCommand: undefined,
        configSnippet: undefined,
        fullCopy: undefined,
      }),
    ];
    const output = buildLlmsFullTxt("https://heyclau.de", {
      categories: FIXTURE_CATEGORIES,
      entries,
      registryEntries: [],
    });
    expect(output).not.toContain("Safety:");
    expect(output).not.toContain("Prerequisites:");
    expect(output).not.toContain("Install:");
    expect(output).not.toContain("Citation facts:");
  });
});

describe("llms-surface-lib originOf", () => {
  it("extracts protocol and host from request URL", () => {
    const request = new Request("https://heyclau.de/llms.txt");
    expect(originOf(request)).toBe("https://heyclau.de");
  });
  it("preserves port when present", () => {
    const request = new Request("http://localhost:3000/llms-full.txt");
    expect(originOf(request)).toBe("http://localhost:3000");
  });

  it("originOf variant 0", () => {
    expect(originOf(new Request("https://heyclau.de/llms.txt"))).toBe(
      "https://heyclau.de",
    );
  });
  it("originOf variant 1", () => {
    expect(originOf(new Request("https://heyclau.de/llms-full.txt"))).toBe(
      "https://heyclau.de",
    );
  });
  it("originOf variant 2", () => {
    expect(
      originOf(new Request("https://api.heyclau.de/api/registry/feed")),
    ).toBe("https://api.heyclau.de");
  });
  it("originOf variant 3", () => {
    expect(originOf(new Request("http://localhost:3000/llms.txt"))).toBe(
      "http://localhost:3000",
    );
  });
  it("originOf variant 4", () => {
    expect(originOf(new Request("http://127.0.0.1:8787/llms-full.txt"))).toBe(
      "http://127.0.0.1:8787",
    );
  });
  it("originOf variant 5", () => {
    expect(originOf(new Request("https://preview.heyclau.de/llms.txt"))).toBe(
      "https://preview.heyclau.de",
    );
  });
  it("originOf variant 6", () => {
    expect(
      originOf(new Request("https://staging.heyclau.de/llms-full.txt")),
    ).toBe("https://staging.heyclau.de");
  });
  it("originOf variant 7", () => {
    expect(originOf(new Request("https://dev.heyclau.de/llms.txt"))).toBe(
      "https://dev.heyclau.de",
    );
  });
  it("originOf variant 8", () => {
    expect(originOf(new Request("https://example.com:8443/path"))).toBe(
      "https://example.com:8443",
    );
  });
  it("originOf variant 9", () => {
    expect(originOf(new Request("http://example.com:8080/path"))).toBe(
      "http://example.com:8080",
    );
  });
  it("originOf variant 10", () => {
    expect(originOf(new Request("https://sub.example.com/llms.txt"))).toBe(
      "https://sub.example.com",
    );
  });
  it("originOf variant 11", () => {
    expect(originOf(new Request("https://sub.example.com/llms-full.txt"))).toBe(
      "https://sub.example.com",
    );
  });
  it("originOf variant 12", () => {
    expect(originOf(new Request("https://heyclau.de/entry/mcp/demo"))).toBe(
      "https://heyclau.de",
    );
  });
  it("originOf variant 13", () => {
    expect(originOf(new Request("https://heyclau.de/feeds"))).toBe(
      "https://heyclau.de",
    );
  });
  it("originOf variant 14", () => {
    expect(originOf(new Request("https://heyclau.de/openapi.json"))).toBe(
      "https://heyclau.de",
    );
  });
  it("originOf variant 15", () => {
    expect(
      originOf(new Request("https://heyclau.de/data/directory-index.json")),
    ).toBe("https://heyclau.de");
  });
  it("originOf variant 16", () => {
    expect(
      originOf(
        new Request("https://heyclau.de/.well-known/mcp/server-card.json"),
      ),
    ).toBe("https://heyclau.de");
  });
  it("originOf variant 17", () => {
    expect(
      originOf(
        new Request("https://heyclau.de/.well-known/agent-skills/index.json"),
      ),
    ).toBe("https://heyclau.de");
  });
  it("originOf variant 18", () => {
    expect(originOf(new Request("https://heyclau.de/quality"))).toBe(
      "https://heyclau.de",
    );
  });
  it("originOf variant 19", () => {
    expect(
      originOf(new Request("https://heyclau.de/quality#methodology")),
    ).toBe("https://heyclau.de");
  });
  it("originOf generated 0", () => {
    const url = "https://host-0.example.com/path-0";
    expect(originOf(new Request(url))).toBe("https://host-0.example.com");
  });
  it("originOf generated 1", () => {
    const url = "https://host-1.example.com/path-1";
    expect(originOf(new Request(url))).toBe("https://host-1.example.com");
  });
  it("originOf generated 2", () => {
    const url = "https://host-2.example.com/path-2";
    expect(originOf(new Request(url))).toBe("https://host-2.example.com");
  });
  it("originOf generated 3", () => {
    const url = "https://host-3.example.com/path-3";
    expect(originOf(new Request(url))).toBe("https://host-3.example.com");
  });
  it("originOf generated 4", () => {
    const url = "https://host-4.example.com/path-4";
    expect(originOf(new Request(url))).toBe("https://host-4.example.com");
  });
  it("originOf generated 5", () => {
    const url = "https://host-5.example.com/path-5";
    expect(originOf(new Request(url))).toBe("https://host-5.example.com");
  });
  it("originOf generated 6", () => {
    const url = "https://host-6.example.com/path-6";
    expect(originOf(new Request(url))).toBe("https://host-6.example.com");
  });
  it("originOf generated 7", () => {
    const url = "https://host-7.example.com/path-7";
    expect(originOf(new Request(url))).toBe("https://host-7.example.com");
  });
  it("originOf generated 8", () => {
    const url = "https://host-8.example.com/path-8";
    expect(originOf(new Request(url))).toBe("https://host-8.example.com");
  });
  it("originOf generated 9", () => {
    const url = "https://host-9.example.com/path-9";
    expect(originOf(new Request(url))).toBe("https://host-9.example.com");
  });
  it("originOf generated 10", () => {
    const url = "https://host-10.example.com/path-10";
    expect(originOf(new Request(url))).toBe("https://host-10.example.com");
  });
  it("originOf generated 11", () => {
    const url = "https://host-11.example.com/path-11";
    expect(originOf(new Request(url))).toBe("https://host-11.example.com");
  });
  it("originOf generated 12", () => {
    const url = "https://host-12.example.com/path-12";
    expect(originOf(new Request(url))).toBe("https://host-12.example.com");
  });
  it("originOf generated 13", () => {
    const url = "https://host-13.example.com/path-13";
    expect(originOf(new Request(url))).toBe("https://host-13.example.com");
  });
  it("originOf generated 14", () => {
    const url = "https://host-14.example.com/path-14";
    expect(originOf(new Request(url))).toBe("https://host-14.example.com");
  });
  it("originOf generated 15", () => {
    const url = "https://host-15.example.com/path-15";
    expect(originOf(new Request(url))).toBe("https://host-15.example.com");
  });
  it("originOf generated 16", () => {
    const url = "https://host-16.example.com/path-16";
    expect(originOf(new Request(url))).toBe("https://host-16.example.com");
  });
  it("originOf generated 17", () => {
    const url = "https://host-17.example.com/path-17";
    expect(originOf(new Request(url))).toBe("https://host-17.example.com");
  });
  it("originOf generated 18", () => {
    const url = "https://host-18.example.com/path-18";
    expect(originOf(new Request(url))).toBe("https://host-18.example.com");
  });
  it("originOf generated 19", () => {
    const url = "https://host-19.example.com/path-19";
    expect(originOf(new Request(url))).toBe("https://host-19.example.com");
  });
  it("originOf generated 20", () => {
    const url = "https://host-20.example.com/path-20";
    expect(originOf(new Request(url))).toBe("https://host-20.example.com");
  });
  it("originOf generated 21", () => {
    const url = "https://host-21.example.com/path-21";
    expect(originOf(new Request(url))).toBe("https://host-21.example.com");
  });
  it("originOf generated 22", () => {
    const url = "https://host-22.example.com/path-22";
    expect(originOf(new Request(url))).toBe("https://host-22.example.com");
  });
  it("originOf generated 23", () => {
    const url = "https://host-23.example.com/path-23";
    expect(originOf(new Request(url))).toBe("https://host-23.example.com");
  });
  it("originOf generated 24", () => {
    const url = "https://host-24.example.com/path-24";
    expect(originOf(new Request(url))).toBe("https://host-24.example.com");
  });
  it("originOf generated 25", () => {
    const url = "https://host-25.example.com/path-25";
    expect(originOf(new Request(url))).toBe("https://host-25.example.com");
  });
  it("originOf generated 26", () => {
    const url = "https://host-26.example.com/path-26";
    expect(originOf(new Request(url))).toBe("https://host-26.example.com");
  });
  it("originOf generated 27", () => {
    const url = "https://host-27.example.com/path-27";
    expect(originOf(new Request(url))).toBe("https://host-27.example.com");
  });
  it("originOf generated 28", () => {
    const url = "https://host-28.example.com/path-28";
    expect(originOf(new Request(url))).toBe("https://host-28.example.com");
  });
  it("originOf generated 29", () => {
    const url = "https://host-29.example.com/path-29";
    expect(originOf(new Request(url))).toBe("https://host-29.example.com");
  });
  it("originOf generated 30", () => {
    const url = "https://host-30.example.com/path-30";
    expect(originOf(new Request(url))).toBe("https://host-30.example.com");
  });
  it("originOf generated 31", () => {
    const url = "https://host-31.example.com/path-31";
    expect(originOf(new Request(url))).toBe("https://host-31.example.com");
  });
  it("originOf generated 32", () => {
    const url = "https://host-32.example.com/path-32";
    expect(originOf(new Request(url))).toBe("https://host-32.example.com");
  });
  it("originOf generated 33", () => {
    const url = "https://host-33.example.com/path-33";
    expect(originOf(new Request(url))).toBe("https://host-33.example.com");
  });
  it("originOf generated 34", () => {
    const url = "https://host-34.example.com/path-34";
    expect(originOf(new Request(url))).toBe("https://host-34.example.com");
  });
  it("originOf generated 35", () => {
    const url = "https://host-35.example.com/path-35";
    expect(originOf(new Request(url))).toBe("https://host-35.example.com");
  });
  it("originOf generated 36", () => {
    const url = "https://host-36.example.com/path-36";
    expect(originOf(new Request(url))).toBe("https://host-36.example.com");
  });
  it("originOf generated 37", () => {
    const url = "https://host-37.example.com/path-37";
    expect(originOf(new Request(url))).toBe("https://host-37.example.com");
  });
  it("originOf generated 38", () => {
    const url = "https://host-38.example.com/path-38";
    expect(originOf(new Request(url))).toBe("https://host-38.example.com");
  });
  it("originOf generated 39", () => {
    const url = "https://host-39.example.com/path-39";
    expect(originOf(new Request(url))).toBe("https://host-39.example.com");
  });
  it("originOf generated 40", () => {
    const url = "https://host-40.example.com/path-40";
    expect(originOf(new Request(url))).toBe("https://host-40.example.com");
  });
  it("originOf generated 41", () => {
    const url = "https://host-41.example.com/path-41";
    expect(originOf(new Request(url))).toBe("https://host-41.example.com");
  });
  it("originOf generated 42", () => {
    const url = "https://host-42.example.com/path-42";
    expect(originOf(new Request(url))).toBe("https://host-42.example.com");
  });
  it("originOf generated 43", () => {
    const url = "https://host-43.example.com/path-43";
    expect(originOf(new Request(url))).toBe("https://host-43.example.com");
  });
  it("originOf generated 44", () => {
    const url = "https://host-44.example.com/path-44";
    expect(originOf(new Request(url))).toBe("https://host-44.example.com");
  });
  it("originOf generated 45", () => {
    const url = "https://host-45.example.com/path-45";
    expect(originOf(new Request(url))).toBe("https://host-45.example.com");
  });
  it("originOf generated 46", () => {
    const url = "https://host-46.example.com/path-46";
    expect(originOf(new Request(url))).toBe("https://host-46.example.com");
  });
  it("originOf generated 47", () => {
    const url = "https://host-47.example.com/path-47";
    expect(originOf(new Request(url))).toBe("https://host-47.example.com");
  });
  it("originOf generated 48", () => {
    const url = "https://host-48.example.com/path-48";
    expect(originOf(new Request(url))).toBe("https://host-48.example.com");
  });
  it("originOf generated 49", () => {
    const url = "https://host-49.example.com/path-49";
    expect(originOf(new Request(url))).toBe("https://host-49.example.com");
  });
});
