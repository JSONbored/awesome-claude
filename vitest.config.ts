import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    alias: {
      "@": new URL("./apps/web/src", import.meta.url).pathname,
    },
  },
  test: {
    globalSetup: ["tests/helpers/sync-mcp-metadata.mts"],
    environment: "node",
    include: ["tests/**/*.test.ts"],
    exclude: ["tests/e2e/**", "node_modules/**", "integrations/**"],
    reporters: ["default", "junit"],
    outputFile: {
      junit: "reports/junit/vitest.xml",
    },
    testTimeout: 30_000,
    coverage: {
      provider: "v8",
      // `lcov` feeds Codecov (coverage/lcov.info); the text/json reporters are
      // for local inspection.
      reporter: ["text", "text-summary", "json-summary", "lcov"],
      reportsDirectory: "coverage",
      // Scope coverage to importable non-UI source the node test suite can
      // exercise directly: registry + mcp packages, web API/server/data logic,
      // submission-gate helper modules, and shared script libraries. React UI,
      // browser-only helpers, page presentation assembly, visual renderers,
      // Worker entrypoints, and CLI scripts run via subprocess tests are kept
      // out of the in-process v8 denominator.
      include: [
        "packages/registry/src/**",
        "packages/mcp/src/**",
        "apps/web/src/lib/**",
        "apps/web/src/data/**",
        "apps/web/src/types/**",
        "apps/submission-gate/src/**",
        "scripts/lib/**",
      ],
      exclude: [
        "**/node_modules/**",
        "**/dist/**",
        "**/generated/**",
        "**/*.gen.*",
        "**/*.d.ts",
        "**/*.tsx",
        "**/*.test.ts",
        "**/*.sh",
        "**/*.json",
        "packages/mcp/src/cli.js",
        "packages/mcp/src/cli-options.js",
        "apps/web/src/data/comparisons.ts",
        "apps/web/src/data/search.ts",
        "apps/web/src/data/tools.ts",
        "apps/web/src/lib/api/example.functions.ts",
        "apps/web/src/lib/client-logs.ts",
        "apps/web/src/lib/community-signals.ts",
        "apps/web/src/lib/content-section-parsing.ts",
        "apps/web/src/lib/content.server.ts",
        "apps/web/src/lib/contributors.ts",
        "apps/web/src/lib/detail-assembly.ts",
        "apps/web/src/lib/dossier-prefs.ts",
        "apps/web/src/lib/error-capture.ts",
        "apps/web/src/lib/error-page.ts",
        "apps/web/src/lib/growth-surface-rules.ts",
        "apps/web/src/lib/growth-surfaces.ts",
        "apps/web/src/lib/hub-highlights.ts",
        "apps/web/src/lib/index.ts",
        "apps/web/src/lib/llms.ts",
        "apps/web/src/lib/motion.ts",
        "apps/web/src/lib/og-fonts.ts",
        "apps/web/src/lib/og-image.ts",
        "apps/web/src/lib/og-render.server.ts",
        "apps/web/src/lib/peek-hotkey.ts",
        "apps/web/src/lib/site.ts",
        "apps/web/src/lib/tools.ts",
        "apps/web/src/lib/utils.ts",
        "apps/submission-gate/src/index.ts",
        "tests/**",
      ],
      // Coverage gating is owned by Codecov (codecov.yml: patch + project,
      // base-relative via `target: auto`) instead of a global vitest threshold
      // ratchet, which caused cross-PR churn (a merge moved the bar under other
      // open PRs). `pnpm test:coverage` here is for local inspection + producing
      // the lcov report uploaded by the `coverage` workflow.
    },
  },
});
