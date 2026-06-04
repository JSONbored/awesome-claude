import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

import { repoRoot } from "./helpers/registry-fixtures";

const forbiddenPaths = [
  ".lovable",
  "apps/web/.lovable",
  "bun.lock",
  "apps/web/bun.lock",
  "apps/web/bunfig.toml",
  "apps/web/next.config.js",
  "apps/web/next.config.mjs",
  "apps/web/open-next.config.ts",
  "apps/web/open-next.config.js",
  "apps/web/src/app",
  "apps/web/src/mocks",
  "apps/web/public/data/content-index.json",
  "apps/web/src/data/curated-jobs.json",
  "apps/web/src/generated/content-category-spec.json",
  "apps/web/src/lib/entry-presentation.ts",
  "apps/web/src/lib/llms-export.ts",
  "apps/web/src/generated/legacy-vote-seed.json",
  "apps/web/src/data/signals.ts",
  "content/archive/legacy-data",
  "content/data/legacy-vote-seed.json",
  "scripts/content-schema.mjs",
  "scripts/export-legacy-vote-seed.mjs",
  "scripts/migrate-content.mjs",
  "scripts/normalize-skills-cross-platform.mjs",
  "scripts/remove-legacy-counters.mjs",
  "scripts/restore-collections-from-history.mjs",
  "scripts/restore-hooks-from-history.mjs",
  "scripts/restore-mcp-from-history.mjs",
  "scripts/restore-skills-from-history.mjs",
  "scripts/restore-statuslines-from-history.mjs",
  "scripts/submission-issue-lib.mjs",
  "scripts/test-all.mjs",
  "scripts/test-commercial-intake.mjs",
  "scripts/test-registry-artifacts.mjs",
  "scripts/test-seo-jsonld.mjs",
  "scripts/test-submission-intake.mjs",
];

const requiredTaskSections = [
  "Current Gate",
  "V2.1 Hardening",
  "Registry/API",
  "SEO + Content Quality",
  "UGC Growth",
  "Raycast",
  "Commercial Surfaces",
  "Testing/CI/Trunk",
  "Future Moat",
];

const forbiddenBenchmarkNames = [
  String.fromCharCode(
    99,
    117,
    114,
    115,
    111,
    114,
    46,
    100,
    105,
    114,
    101,
    99,
    116,
    111,
    114,
    121,
  ),
  String.fromCharCode(
    67,
    117,
    114,
    115,
    111,
    114,
    32,
    68,
    105,
    114,
    101,
    99,
    116,
    111,
    114,
    121,
  ),
];

describe("cleanup policy", () => {
  it("keeps retired generated truth and one-shot scripts out of active code", () => {
    for (const relativePath of forbiddenPaths) {
      expect(
        fs.existsSync(path.join(repoRoot, relativePath)),
        relativePath,
      ).toBe(false);
    }
  });

  it("keeps app code on canonical registry imports", () => {
    const sourceFiles = [
      "apps/web/src/lib/site.ts",
      "apps/web/src/data/entries.ts",
      "apps/web/src/routes/browse.tsx",
      "apps/web/src/routes/entry.$category.$slug.tsx",
      "apps/web/src/routes/submit.tsx",
    ];

    for (const relativePath of sourceFiles) {
      const source = fs.readFileSync(path.join(repoRoot, relativePath), "utf8");
      expect(source).not.toContain("@/generated/content-category-spec.json");
      expect(source).not.toContain("@/lib/entry-presentation");
      expect(source).not.toContain("@/lib/llms-export");
    }
  });

  it("keeps generic entry pages from presenting repo stars as ratings", () => {
    const entryRoute = fs.readFileSync(
      path.join(repoRoot, "apps/web/src/routes/entry.$category.$slug.tsx"),
      "utf8",
    );
    expect(entryRoute).not.toContain("SoftwareApplication");
    expect(entryRoute).not.toContain("aggregateRating");
    expect(entryRoute).not.toContain("— stars");
    expect(entryRoute).toContain("source repo stars");
  });

  it("keeps Atlas fixture-era public signals and broken feed links out of production source", () => {
    const forbiddenSourcePatterns = [
      /@\/mocks\b/,
      /\/feeds\/ecosystem\.json/,
      /updated 12m ago|2026-05-26 · 08:12 UTC|14-build trend/i,
      /Checksum drift detected|New entries signed|Latest health probe completed/i,
      /(?:upvotes|weeklyInstalls|trending):\s*Math\./,
    ];
    const sourceRoots = ["apps/web/src", "scripts"];
    for (const root of sourceRoots) {
      const rootPath = path.join(repoRoot, root);
      const stack = [rootPath];
      while (stack.length) {
        const current = stack.pop()!;
        for (const item of fs.readdirSync(current, { withFileTypes: true })) {
          const absolutePath = path.join(current, item.name);
          const relativePath = path.relative(repoRoot, absolutePath);
          if (item.isDirectory()) {
            if (item.name !== "generated") stack.push(absolutePath);
            continue;
          }
          if (!item.isFile() || !/\.(tsx?|mjs|js)$/.test(item.name)) continue;
          if (relativePath === "scripts/validate-codebase-clean.mjs") continue;
          const source = fs.readFileSync(absolutePath, "utf8");
          for (const pattern of forbiddenSourcePatterns) {
            expect(source, relativePath).not.toMatch(pattern);
          }
        }
      }
    }
  });

  it("keeps branch-era array artifact fallbacks out of active readers", () => {
    const retiredFallbacks = [
      {
        file: "apps/web/src/routes/browse.tsx",
        snippets: [
          "type DirectoryEntriesPayload =\n  | DirectoryEntry[]",
          "if (Array.isArray(payload)) return payload;",
        ],
      },
      {
        file: "scripts/validate-deployment-artifacts.mjs",
        snippets: ["if (Array.isArray(payload)) return payload;"],
      },
      {
        file: "integrations/raycast/src/feed.ts",
        snippets: [
          "if (Array.isArray(parsed))",
          "parsed.filter(isRaycastEntry)",
        ],
      },
    ];

    for (const { file, snippets } of retiredFallbacks) {
      const absolutePath = path.join(repoRoot, file);
      if (!fs.existsSync(absolutePath)) continue;
      const source = fs.readFileSync(absolutePath, "utf8");
      for (const snippet of snippets) {
        expect(source).not.toContain(snippet);
      }
    }
  });

  it("keeps retired submission-gate compatibility out of active runtime config", () => {
    const retiredTokens = [
      ["submission", "gate", ["pil", "ot"].join("")].join("-"),
      ["submission", "-needs", "-changes"].join(""),
      ["PILOT", "_BASE", "_REF"].join(""),
      ["submission", "-gate:deploy:dev"].join(""),
    ];
    const activeFiles = [
      "package.json",
      "apps/submission-gate/package.json",
      "apps/submission-gate/wrangler.jsonc",
      "apps/submission-gate/src/constants.ts",
      "apps/submission-gate/src/github.ts",
      "apps/submission-gate/src/index.ts",
      "docs/submission-queue-ops.md",
    ];

    for (const relativePath of activeFiles) {
      const source = fs.readFileSync(path.join(repoRoot, relativePath), "utf8");
      for (const token of retiredTokens) {
        expect(
          source,
          `${relativePath} should not contain ${token}`,
        ).not.toContain(token);
      }
    }

    const gatePackage = JSON.parse(
      fs.readFileSync(
        path.join(repoRoot, "apps/submission-gate/package.json"),
        "utf8",
      ),
    ) as { scripts: Record<string, string> };
    expect(gatePackage.scripts).not.toHaveProperty("deploy");
    expect(gatePackage.scripts).not.toHaveProperty("deploy:dev");
    expect(gatePackage.scripts).not.toHaveProperty("deploy:dry-run");
    expect(gatePackage.scripts).not.toHaveProperty("deploy:dry-run:dev");
  });

  it("keeps active web category surfaces on the canonical content categories", () => {
    const unsupportedCategoryTokens = [
      ["codex", "-plugins"].join(""),
      ["codex", "-automations"].join(""),
      ["harness", "-configs"].join(""),
      ["aider", "-recipes"].join(""),
      ["continue", "-configs"].join(""),
      ["zed", "-extensions"].join(""),
      `"${["plugins"].join("")}"`,
      `"${["automations"].join("")}"`,
      ["PRIMARY", "CATEGORIES"].join("_"),
      [".", "legacy"].join(""),
      ["legacy", "?:"].join(""),
    ];
    const activeFiles = [
      "apps/web/src/types/registry.ts",
      "apps/web/src/data/entry-normalize.ts",
      "apps/web/src/lib/submission-spec.ts",
      "apps/web/src/routes/index.tsx",
      "apps/web/src/components/intent-chips.tsx",
    ];

    for (const relativePath of activeFiles) {
      const source = fs.readFileSync(path.join(repoRoot, relativePath), "utf8");
      for (const token of unsupportedCategoryTokens) {
        expect(
          source,
          `${relativePath} should not contain ${token}`,
        ).not.toContain(token);
      }
    }
  });

  it("requires SITE_DB as the only dynamic-state D1 binding", () => {
    const wranglerConfig = fs.readFileSync(
      path.join(repoRoot, "apps/web/wrangler.jsonc"),
      "utf8",
    );
    const dbLib = fs.readFileSync(
      path.join(repoRoot, "apps/web/src/lib/db.ts"),
      "utf8",
    );
    expect(wranglerConfig).toContain('"binding": "SITE_DB"');
    expect(wranglerConfig).not.toContain("VOTES_DB");
    expect(dbLib).not.toContain("VOTES_DB");
  });

  it("tracks Trunk config and documents every migration", () => {
    expect(fs.existsSync(path.join(repoRoot, ".trunk/trunk.yaml"))).toBe(true);
    const docs = fs.readFileSync(
      path.join(repoRoot, "apps/web/DEPLOYMENT.md"),
      "utf8",
    );
    const migrations = fs
      .readdirSync(path.join(repoRoot, "apps/web/migrations"))
      .filter((fileName) => fileName.endsWith(".sql"));
    for (const migration of migrations) {
      expect(docs).toContain(migration);
    }
  });

  it("keeps TASKS.md as an optional local-only tracker", () => {
    const gitignore = fs.readFileSync(
      path.join(repoRoot, ".gitignore"),
      "utf8",
    );
    expect(gitignore.split("\n")).toContain("TASKS.md");

    const rootPackage = JSON.parse(
      fs.readFileSync(path.join(repoRoot, "package.json"), "utf8"),
    ) as { scripts: Record<string, string> };
    expect(rootPackage.scripts["validate:tasks"]).toBeTruthy();

    const validator = fs.readFileSync(
      path.join(repoRoot, "scripts/validate-tasks.mjs"),
      "utf8",
    );
    expect(validator).toContain("REQUIRE_TASKS");
    expect(validator).toContain("skipping optional local task tracker");

    const tasksPath = path.join(repoRoot, "TASKS.md");
    if (fs.existsSync(tasksPath)) {
      const tasks = fs.readFileSync(tasksPath, "utf8");
      for (const section of requiredTaskSections) {
        expect(tasks).toContain(`## ${section}`);
      }
      for (const forbiddenName of forbiddenBenchmarkNames) {
        expect(tasks.toLowerCase()).not.toContain(forbiddenName.toLowerCase());
      }
    }
  });
});
