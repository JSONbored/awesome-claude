import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    alias: {
      "@": new URL("./apps/web/src", import.meta.url).pathname,
    },
  },
  test: {
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
      // Scope coverage to the source the node test suite actually exercises
      // (registry + mcp packages, web server/lib/data logic, the submission
      // gate worker, and build scripts). React components and routes are not
      // run under the node environment, so they are intentionally out of scope.
      include: [
        "packages/registry/src/**",
        "packages/mcp/src/**",
        "apps/web/src/lib/**",
        "apps/web/src/data/**",
        "apps/web/src/types/**",
        "apps/submission-gate/src/**",
        "scripts/**",
      ],
      exclude: [
        "**/node_modules/**",
        "**/dist/**",
        "**/generated/**",
        "**/*.gen.*",
        "**/*.d.ts",
        "**/*.test.ts",
        "**/*.sh",
        "**/*.json",
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
