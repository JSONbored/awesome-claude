import { describe, expect, it } from "vitest";

import type { Entry } from "@/types/registry";
import {
  compareActionSignature,
  compareActionsDiverge,
  resolveCompareEntryActions,
  type CompareAction,
} from "../apps/web/src/lib/compare-entry-actions-lib";
import { claimCtaAnalyticsEvent } from "../apps/web/src/lib/conversion-cta-events-lib";

function entry(overrides: Partial<Entry> = {}): Entry {
  return {
    category: "mcp",
    slug: "fixture",
    title: "Fixture",
    description: "Fixture description",
    author: "Author",
    tags: [],
    platforms: ["claude-code"],
    installType: "manual",
    trust: "review",
    source: "unverified",
    dateAdded: "2026-01-01",
    ...overrides,
  } as Entry;
}

describe("resolveCompareEntryActions", () => {
  it("always includes dossier as the first action", () => {
    const actions = resolveCompareEntryActions(entry());
    expect(actions[0]).toEqual({
      id: "dossier",
      label: "Open dossier",
      kind: "link",
      intentType: "open",
      analyticsEvent: "compare_open_dossier",
    });
  });

  it("returns dossier and claim for a sparse unclaimed entry", () => {
    expect(
      resolveCompareEntryActions(entry()).map((action) => action.id),
    ).toEqual(["dossier", "claim"]);
  });

  it("omits claim when the entry is claimed", () => {
    expect(
      resolveCompareEntryActions(entry({ claimed: true })).map(
        (action) => action.id,
      ),
    ).toEqual(["dossier"]);
  });

  it("adds install when installCommand is present", () => {
    const actions = resolveCompareEntryActions(
      entry({ installCommand: "npm i fixture", claimed: true }),
    );
    expect(actions.map((action) => action.id)).toEqual(["dossier", "install"]);
    expect(actions[1]).toMatchObject({
      kind: "copy",
      copyValue: "npm i fixture",
      intentType: "install",
      analyticsEvent: "compare_copy_install",
    });
  });

  it("adds config when configSnippet is present", () => {
    const actions = resolveCompareEntryActions(
      entry({ configSnippet: '{"mcp":true}', claimed: true }),
    );
    expect(actions.map((action) => action.id)).toEqual(["dossier", "config"]);
    expect(actions[1]).toMatchObject({
      kind: "copy",
      copyValue: '{"mcp":true}',
      intentType: "copy",
      analyticsEvent: "compare_copy_config",
    });
  });

  it("adds source when sourceUrl is present", () => {
    const actions = resolveCompareEntryActions(
      entry({
        sourceUrl: "https://github.com/org/repo",
        claimed: true,
      }),
    );
    expect(actions.map((action) => action.id)).toEqual([
      "dossier",
      "api-json",
      "llms",
      "mcp-feed",
      "source",
      "newsletter",
    ]);
    expect(actions.find((action) => action.id === "source")).toMatchObject({
      kind: "link",
      href: "https://github.com/org/repo",
      intentType: "open",
      analyticsEvent: "compare_open_source",
      external: true,
    });
  });

  it("returns the full action set for a rich claimed entry", () => {
    expect(
      resolveCompareEntryActions(
        entry({
          installCommand: "npm i fixture",
          configSnippet: '{ "mcp": true }',
          sourceUrl: "https://github.com/org/repo",
          claimed: true,
        }),
      ).map((action) => action.id),
    ).toEqual([
      "dossier",
      "install",
      "config",
      "api-json",
      "llms",
      "mcp-feed",
      "source",
      "newsletter",
    ]);
  });

  it("preserves dossier → install → config → source → claim ordering", () => {
    const ids = resolveCompareEntryActions(
      entry({
        installCommand: "npx pkg",
        configSnippet: "{}",
        sourceUrl: "https://example.com",
        claimed: false,
      }),
    ).map((action) => action.id);
    expect(ids).toEqual([
      "dossier",
      "install",
      "config",
      "api-json",
      "llms",
      "mcp-feed",
      "source",
      "newsletter",
      "claim",
    ]);
  });
});

describe("optional field handling", () => {
  it.each([undefined, "", null as unknown as string])(
    "skips install when installCommand is %j",
    (installCommand) => {
      const ids = resolveCompareEntryActions(
        entry({ installCommand, claimed: true }),
      ).map((action) => action.id);
      expect(ids).not.toContain("install");
    },
  );

  it.each([undefined, "", null as unknown as string])(
    "skips config when configSnippet is %j",
    (configSnippet) => {
      const ids = resolveCompareEntryActions(
        entry({ configSnippet, claimed: true }),
      ).map((action) => action.id);
      expect(ids).not.toContain("config");
    },
  );

  it.each([undefined, "", null as unknown as string])(
    "skips source when sourceUrl is %j",
    (sourceUrl) => {
      const ids = resolveCompareEntryActions(
        entry({ sourceUrl, claimed: true }),
      ).map((action) => action.id);
      expect(ids).not.toContain("source");
    },
  );

  it("treats whitespace-only installCommand as present", () => {
    const actions = resolveCompareEntryActions(
      entry({ installCommand: "   ", claimed: true }),
    );
    expect(actions.some((action) => action.id === "install")).toBe(true);
  });
});

describe("action metadata", () => {
  it("labels every action for UI rendering", () => {
    for (const action of resolveCompareEntryActions(
      entry({
        installCommand: "npx a",
        configSnippet: "{}",
        sourceUrl: "https://x",
      }),
    )) {
      expect(action.label.length).toBeGreaterThan(0);
    }
  });

  it("uses copy kind only for install and config actions", () => {
    const actions = resolveCompareEntryActions(
      entry({
        installCommand: "npx a",
        configSnippet: "{}",
        sourceUrl: "https://x",
        claimed: true,
      }),
    );
    const copyActions = actions.filter((action) => action.kind === "copy");
    expect(copyActions.map((action) => action.id)).toEqual([
      "install",
      "config",
    ]);
  });

  it("uses link kind for dossier, source, and claim actions", () => {
    const actions = resolveCompareEntryActions(
      entry({ sourceUrl: "https://x" }),
    );
    const linkActions = actions.filter((action) => action.kind === "link");
    expect(linkActions.map((action) => action.id)).toEqual([
      "dossier",
      "api-json",
      "llms",
      "mcp-feed",
      "source",
      "newsletter",
      "claim",
    ]);
  });

  it("sets external only on the source action", () => {
    const actions = resolveCompareEntryActions(
      entry({
        sourceUrl: "https://github.com/org/repo",
        claimed: true,
      }),
    );
    expect(actions.find((action) => action.id === "source")?.external).toBe(
      true,
    );
    expect(
      actions.find((action) => action.id === "dossier")?.external,
    ).toBeUndefined();
  });

  it("attaches analytics events to every action", () => {
    const actions = resolveCompareEntryActions(
      entry({
        installCommand: "npx a",
        configSnippet: "{}",
        sourceUrl: "https://x",
      }),
    );
    expect(
      actions.every((action) => {
        if (!action.analyticsEvent) return false;
        if (action.id === "claim")
          return action.analyticsEvent === claimCtaAnalyticsEvent();
        return action.analyticsEvent.startsWith("compare_");
      }),
    ).toBe(true);
  });
});

describe("compareActionSignature", () => {
  it("joins action ids with pipes", () => {
    expect(compareActionSignature(entry())).toBe("dossier|claim");
    expect(
      compareActionSignature(
        entry({
          installCommand: "npm i fixture",
          configSnippet: "{}",
          sourceUrl: "https://x",
          claimed: true,
        }),
      ),
    ).toBe("dossier|install|config|api-json|llms|mcp-feed|source|newsletter");
  });

  it("changes when optional actions appear or disappear", () => {
    const base = compareActionSignature(entry({ claimed: true }));
    const withInstall = compareActionSignature(
      entry({ installCommand: "npx a", claimed: true }),
    );
    expect(base).not.toBe(withInstall);
  });

  it.each([
    ["sparse", entry(), "dossier|claim"],
    [
      "install only",
      entry({ installCommand: "npx a", claimed: true }),
      "dossier|install",
    ],
    [
      "config only",
      entry({ configSnippet: "{}", claimed: true }),
      "dossier|config",
    ],
    [
      "source only",
      entry({ sourceUrl: "https://x", claimed: true }),
      "dossier|api-json|llms|mcp-feed|source|newsletter",
    ],
    ["claimed sparse", entry({ claimed: true }), "dossier"],
  ] as const)("signature for %s is %s", (_label, e, signature) => {
    expect(compareActionSignature(e)).toBe(signature);
  });
});

describe("compareActionsDiverge", () => {
  it("returns false for fewer than two entries", () => {
    expect(compareActionsDiverge([])).toBe(false);
    expect(compareActionsDiverge([entry()])).toBe(false);
  });

  it("detects divergence when install availability differs", () => {
    expect(
      compareActionsDiverge([
        entry({ installCommand: "npm i fixture" }),
        entry(),
      ]),
    ).toBe(true);
  });

  it("returns false when install commands differ but action set matches", () => {
    expect(
      compareActionsDiverge([
        entry({ installCommand: "npm i fixture" }),
        entry({ installCommand: "pnpm add fixture" }),
      ]),
    ).toBe(false);
  });

  it("detects divergence when claim availability differs", () => {
    expect(
      compareActionsDiverge([
        entry({ claimed: true }),
        entry({ claimed: false }),
      ]),
    ).toBe(true);
  });

  it("detects divergence when source links differ in presence only", () => {
    expect(
      compareActionsDiverge([
        entry({ sourceUrl: "https://github.com/a/b" }),
        entry(),
      ]),
    ).toBe(true);
  });

  it("returns false for identical sparse entries", () => {
    const sparse = entry();
    expect(compareActionsDiverge([sparse, sparse])).toBe(false);
  });

  it("returns false for identical rich entries", () => {
    const rich = entry({
      installCommand: "npx a",
      configSnippet: "{}",
      sourceUrl: "https://x",
      claimed: true,
    });
    expect(compareActionsDiverge([rich, rich])).toBe(false);
  });

  it("detects divergence in a three-entry comparison", () => {
    expect(
      compareActionsDiverge([
        entry({ installCommand: "npx a" }),
        entry({ configSnippet: "{}" }),
        entry({ installCommand: "npx a" }),
      ]),
    ).toBe(true);
  });
});

describe("category and slug passthrough", () => {
  it.each([
    ["mcp", "demo-server"],
    ["skills", "writing-assistant"],
    ["hooks", "pre-commit"],
    ["agents", "research-bot"],
  ] as const)(
    "builds actions for %s/%s without requiring unused fields",
    (category, slug) => {
      const actions = resolveCompareEntryActions(
        entry({ category, slug, claimed: true }),
      );
      expect(actions[0]?.id).toBe("dossier");
    },
  );
});

describe("install command variants", () => {
  it.each([
    "npx -y @scope/pkg",
    "npm install -g tool",
    "pnpm dlx pkg",
    "uvx server",
    "claude mcp add x url",
  ])("includes install action for %s", (installCommand) => {
    const action = resolveCompareEntryActions(
      entry({ installCommand, claimed: true }),
    ).find((item) => item.id === "install");
    expect(action?.copyValue).toBe(installCommand);
  });
});

describe("config snippet variants", () => {
  it.each([
    '{"command":"npx"}',
    '{"type":"http","url":"https://x/mcp"}',
    "plain-text-config",
  ])("includes config action for snippet %s", (configSnippet) => {
    const action = resolveCompareEntryActions(
      entry({ configSnippet, claimed: true }),
    ).find((item) => item.id === "claim");
    expect(action).toBeUndefined();
    expect(
      resolveCompareEntryActions(entry({ configSnippet, claimed: true })).some(
        (item) => item.id === "config",
      ),
    ).toBe(true);
  });
});

describe("source URL variants", () => {
  it.each([
    "https://github.com/org/repo",
    "http://localhost:3000",
    "https://gitlab.com/group/project",
  ])("includes source action for %s", (sourceUrl) => {
    const action = resolveCompareEntryActions(
      entry({ sourceUrl, claimed: true }),
    ).find((item) => item.id === "source");
    expect(action?.href).toBe(sourceUrl);
  });
});

describe("claim CTA", () => {
  it("includes claim analytics event", () => {
    const claim = resolveCompareEntryActions(entry()).find(
      (action) => action.id === "claim",
    );
    expect(claim).toEqual({
      id: "claim",
      label: "Claim listing",
      kind: "link",
      analyticsEvent: claimCtaAnalyticsEvent(),
    });
  });

  it.each([false, undefined])("shows claim when claimed is %j", (claimed) => {
    expect(
      resolveCompareEntryActions(entry({ claimed } as Partial<Entry>)).some(
        (action) => action.id === "claim",
      ),
    ).toBe(true);
  });

  it("hides claim when claimed is true", () => {
    expect(
      resolveCompareEntryActions(entry({ claimed: true })).some(
        (action) => action.id === "claim",
      ),
    ).toBe(false);
  });
});

describe("integration snapshots", () => {
  it("builds a compare drawer action bundle for a typical MCP entry", () => {
    const actions = resolveCompareEntryActions(
      entry({
        category: "mcp",
        slug: "demo",
        installCommand: "npx -y @scope/mcp",
        configSnippet: '{"url":"https://example/mcp"}',
        sourceUrl: "https://github.com/org/mcp",
        claimed: false,
      }),
    );
    expect(actions).toHaveLength(9);
    expect(
      compareActionSignature(
        entry({
          category: "mcp",
          slug: "demo",
          installCommand: "npx -y @scope/mcp",
          configSnippet: '{"url":"https://example/mcp"}',
          sourceUrl: "https://github.com/org/mcp",
          claimed: false,
        }),
      ),
    ).toBe(
      "dossier|install|config|api-json|llms|mcp-feed|source|newsletter|claim",
    );
  });

  it("builds a minimal skill entry action bundle", () => {
    const actions = resolveCompareEntryActions(
      entry({
        category: "skills",
        slug: "writing",
        claimed: true,
      }),
    );
    expect(actions).toEqual([expect.objectContaining({ id: "dossier" })]);
  });
});

describe("divergence matrix", () => {
  const fixtures: Array<{ name: string; entry: Entry }> = [
    { name: "sparse", entry: entry() },
    { name: "install", entry: entry({ installCommand: "npx a" }) },
    { name: "config", entry: entry({ configSnippet: "{}" }) },
    { name: "source", entry: entry({ sourceUrl: "https://x" }) },
    { name: "claimed", entry: entry({ claimed: true }) },
    {
      name: "rich",
      entry: entry({
        installCommand: "npx a",
        configSnippet: "{}",
        sourceUrl: "https://x",
        claimed: true,
      }),
    },
  ];

  it("detects any mismatch between sparse and rich entries", () => {
    const sparse = fixtures.find((item) => item.name === "sparse")!.entry;
    const rich = fixtures.find((item) => item.name === "rich")!.entry;
    expect(compareActionsDiverge([sparse, rich])).toBe(true);
  });

  it.each(fixtures)(
    "produces a stable signature for %s fixture",
    ({ entry: e }) => {
      expect(compareActionSignature(e)).toMatch(/^dossier/);
    },
  );
});

describe("action shape invariants", () => {
  it("never emits duplicate action ids", () => {
    const actions = resolveCompareEntryActions(
      entry({
        installCommand: "npx a",
        configSnippet: "{}",
        sourceUrl: "https://x",
      }),
    );
    const ids = actions.map((action) => action.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("requires copyValue on copy actions", () => {
    const copyActions = resolveCompareEntryActions(
      entry({ installCommand: "npx a", configSnippet: "{}", claimed: true }),
    ).filter((action) => action.kind === "copy");
    expect(copyActions.every((action) => action.copyValue)).toBe(true);
  });

  it("requires href on external source actions only", () => {
    const source = resolveCompareEntryActions(
      entry({ sourceUrl: "https://x", claimed: true }),
    ).find((action) => action.id === "source") as CompareAction;
    expect(source.href).toBe("https://x");
  });
});

describe("bulk signature comparison", () => {
  it("compares ten-entry batches deterministically", () => {
    const batch = Array.from({ length: 10 }, (_, index) =>
      entry({
        slug: `e-${index}`,
        installCommand: index % 2 === 0 ? "npx pkg" : undefined,
        claimed: index % 3 === 0,
      }),
    );
    const signatures = batch.map(compareActionSignature);
    expect(new Set(signatures).size).toBeGreaterThan(1);
    expect(compareActionsDiverge(batch)).toBe(true);
  });
});

describe("multi-entry compare scenarios", () => {
  it("detects divergence when only config differs", () => {
    expect(
      compareActionsDiverge([entry({ configSnippet: "{}" }), entry()]),
    ).toBe(true);
  });

  it("does not detect divergence when both entries lack optional actions", () => {
    expect(
      compareActionsDiverge([
        entry({ claimed: true }),
        entry({ claimed: true, slug: "other" }),
      ]),
    ).toBe(false);
  });

  it("detects divergence across a heterogeneous batch", () => {
    const batch = [
      entry({ installCommand: "npx a" }),
      entry({ configSnippet: "{}" }),
      entry({ sourceUrl: "https://a" }),
      entry({ claimed: true }),
      entry(),
    ];
    expect(compareActionsDiverge(batch)).toBe(true);
  });
});

describe("action ordering invariants", () => {
  it("keeps dossier before install when both exist", () => {
    const ids = resolveCompareEntryActions(
      entry({ installCommand: "npx a", claimed: true }),
    ).map((action) => action.id);
    expect(ids.indexOf("dossier")).toBeLessThan(ids.indexOf("install"));
  });

  it("keeps install before config when both exist", () => {
    const ids = resolveCompareEntryActions(
      entry({ installCommand: "npx a", configSnippet: "{}", claimed: true }),
    ).map((action) => action.id);
    expect(ids.indexOf("install")).toBeLessThan(ids.indexOf("config"));
  });

  it("keeps config before source when both exist", () => {
    const ids = resolveCompareEntryActions(
      entry({
        configSnippet: "{}",
        sourceUrl: "https://x",
        claimed: true,
      }),
    ).map((action) => action.id);
    expect(ids.indexOf("config")).toBeLessThan(ids.indexOf("source"));
  });

  it("keeps source before claim when both exist", () => {
    const ids = resolveCompareEntryActions(
      entry({ sourceUrl: "https://x", claimed: false }),
    ).map((action) => action.id);
    expect(ids.indexOf("source")).toBeLessThan(ids.indexOf("claim"));
  });
});

describe("signature stability", () => {
  it("is unchanged when only slug differs", () => {
    expect(compareActionSignature(entry({ slug: "a" }))).toBe(
      compareActionSignature(entry({ slug: "b" })),
    );
  });

  it("is unchanged when only title or description differ", () => {
    const base = entry();
    const renamed = entry({ title: "Other", description: "Other desc" });
    expect(compareActionSignature(base)).toBe(compareActionSignature(renamed));
  });
});

describe("rich entry permutations", () => {
  const optionalFields = [
    "installCommand",
    "configSnippet",
    "sourceUrl",
  ] as const;

  it.each(optionalFields)("signature changes when %s is added", (field) => {
    const sparse = entry({ claimed: true });
    const enriched = entry({
      claimed: true,
      [field]: field === "sourceUrl" ? "https://x" : "value",
    });
    expect(compareActionSignature(sparse)).not.toBe(
      compareActionSignature(enriched),
    );
  });
});

describe("analytics event coverage", () => {
  it.each([
    ["dossier", "compare_open_dossier"],
    ["install", "compare_copy_install"],
    ["config", "compare_copy_config"],
    ["source", "compare_open_source"],
    ["claim", claimCtaAnalyticsEvent()],
  ] as const)("maps %s to %s", (id, analyticsEvent) => {
    const action = resolveCompareEntryActions(
      entry({
        installCommand: "npx a",
        configSnippet: "{}",
        sourceUrl: "https://x",
        claimed: false,
      }),
    ).find((item) => item.id === id);
    expect(action?.analyticsEvent).toBe(analyticsEvent);
  });
});

describe("copy payload fidelity", () => {
  it("preserves multiline install commands", () => {
    const command = "npx -y pkg\\\n  --flag value";
    const action = resolveCompareEntryActions(
      entry({ installCommand: command, claimed: true }),
    ).find((item) => item.id === "install");
    expect(action?.copyValue).toBe(command);
  });

  it("preserves JSON config snippets verbatim", () => {
    const snippet = '{\n  "command": "npx",\n  "args": ["-y", "pkg"]\n}';
    const action = resolveCompareEntryActions(
      entry({ configSnippet: snippet, claimed: true }),
    ).find((item) => item.id === "config");
    expect(action?.copyValue).toBe(snippet);
  });
});

describe("claimed flag edge cases", () => {
  it("shows claim for explicitly unclaimed entries", () => {
    expect(
      resolveCompareEntryActions(entry({ claimed: false })).some(
        (action) => action.id === "claim",
      ),
    ).toBe(true);
  });

  it("changes signature when claimed toggles", () => {
    expect(compareActionSignature(entry({ claimed: false }))).toBe(
      "dossier|claim",
    );
    expect(compareActionSignature(entry({ claimed: true }))).toBe("dossier");
  });
});

describe("intent type mapping", () => {
  it("maps dossier and source to open intents", () => {
    const actions = resolveCompareEntryActions(
      entry({ sourceUrl: "https://x", claimed: true }),
    );
    expect(actions.find((action) => action.id === "dossier")?.intentType).toBe(
      "open",
    );
    expect(actions.find((action) => action.id === "source")?.intentType).toBe(
      "open",
    );
  });

  it("maps install to install intent and config to copy intent", () => {
    const actions = resolveCompareEntryActions(
      entry({
        installCommand: "npx a",
        configSnippet: "{}",
        claimed: true,
      }),
    );
    expect(actions.find((action) => action.id === "install")?.intentType).toBe(
      "install",
    );
    expect(actions.find((action) => action.id === "config")?.intentType).toBe(
      "copy",
    );
  });
});
