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
      reporter: ["text", "text-summary", "json-summary"],
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
      // Thresholds lock in current coverage and ratchet upward over time.
      // When coverage rises, bump these to match — never lower them.
      // See AGENTS.md "Validation" for the ratcheting policy.
      thresholds: {
        statements: 47,
        branches: 44,
        functions: 56,
        lines: 48,
      },
    },
  },
});
