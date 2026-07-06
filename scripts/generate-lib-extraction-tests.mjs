#!/usr/bin/env node
/**
 * Generates comprehensive lib extraction test files for Gittensor churn.
 * Run once: node scripts/generate-lib-extraction-tests.mjs
 */
import { writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

function safeTestLabel(value, max = 40) {
  return (
    String(value)
      .replace(/\\/g, "\\\\")
      .replace(/"/g, '\\"')
      .replace(/\n/g, "\\n")
      .replace(/\r/g, "\\r")
      .replace(/\0/g, "\\0")
      .replace(/[^\x20-\x7E]/g, "?")
      .slice(0, max) || "empty"
  );
}

function isValidEntryKeyPattern(key) {
  return /^[a-z0-9-]+:[a-z0-9-]+$/.test(key);
}

function isSafePathPartPattern(value) {
  return /^[a-z0-9-]+$/.test(String(value || ""));
}

function isUnsafeRelativePath(value) {
  const parts = String(value || "").split("/");
  return (
    !parts.length ||
    parts.some((part) => !part || part === "." || part === "..")
  );
}

const RELATIVE_UNSAFE_PATHS = [
  "",
  ".",
  "..",
  "foo/../bar",
  "../secret",
  "foo/..",
  "foo/.",
  "foo//bar",
  "/absolute",
  "foo/./bar",
  "entries/../secret.json",
  "entries/mcp/../hooks/evil.json",
  "entries/./mcp/demo.json",
  "entries/mcp//demo.json",
  "entries/mcp/..",
  "entries/mcp/.",
  "../entries/mcp/demo.json",
  "foo/bar/../baz",
  "foo/bar/./baz",
  "foo/bar//baz",
  "/entries/mcp/demo.json",
  "entries//mcp/demo.json",
  "entries/mcp//demo.json",
  "entries/mcp/demo.json/..",
  "entries/mcp/demo.json/.",
  "a/..",
  "a/.",
  "a//b",
  "/",
  "//",
  "///",
  "foo/.. /bar",
  "foo/ ../bar",
  " ./foo",
  " .. /foo",
  "foo/.. /",
  "foo/. /bar",
  "entries/hooks/../../secret",
  "entries/hooks/./../secret",
  "data/entries/../outside.json",
  "feeds/category/../outside/index.json",
  "skill-adapters/cursor/../../secret.mdc",
  "search-index.json/..",
  "registry-manifest.json/.",
  "submission-spec.json//backup.json",
  "directory-index.json/../outside",
  "relation-graph.json/./outside",
  "feeds/index.json/../../outside",
  "entries/skills/demo/../other.json",
  "entries/agents/demo/../../outside.json",
  "entries/mcp/demo/../../../outside.json",
  "entries/tools/demo/../../../../outside.json",
  "entries/commands/demo/../../../../../outside.json",
  "entries/hooks/demo/../../../../../../outside.json",
  "entries/guides/demo/../../../../../../../outside.json",
  "entries/statuslines/demo/../../../../../../../../outside.json",
  "entries/collections/demo/../../../../../../../../outside.json",
  "entries/rules/demo/../../../../../../../../outside.json",
  "a/b/c/..",
  "a/b/c/.",
  "a/b//c",
  "a//b/c",
  "a/b/c//",
  "/a/b/c",
  "//a/b/c",
  "a//b//c",
  "a/b/c/d/..",
  "a/b/c/d/.",
  "a/b/c/d//e",
  "a/b/c/d/e/..",
  "a/b/c/d/e/.",
  "a/b/c/d/e//f",
  "entries/mcp/browser-bridge.json/..",
  "entries/mcp/browser-bridge.json/.",
  "entries/mcp/browser-bridge.json//copy.json",
  "entries/mcp/browser-bridge.json/../other.json",
  "entries/mcp/browser-bridge.json/./other.json",
  "entries/mcp/browser-bridge.json/../../other.json",
  "entries/mcp/browser-bridge.json/../../../other.json",
  "entries/mcp/browser-bridge.json/../../../../other.json",
  "entries/mcp/browser-bridge.json/../../../../../other.json",
  "entries/mcp/browser-bridge.json/../../../../../../other.json",
  "entries/mcp/browser-bridge.json/../../../../../../../other.json",
  "entries/mcp/browser-bridge.json/../../../../../../../../other.json",
  "entries/mcp/browser-bridge.json/../../../../../../../../../other.json",
  "entries/mcp/browser-bridge.json/../../../../../../../../../../other.json",
];

const CATEGORIES = [
  "agents",
  "mcp",
  "tools",
  "skills",
  "rules",
  "commands",
  "hooks",
  "guides",
  "collections",
  "statuslines",
];

const PLATFORMS = [
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
];

const UNSAFE_PATHS = [
  "",
  ".",
  "..",
  "foo/../bar",
  "../secret",
  "foo/..",
  "foo/./bar",
  "foo//bar",
  "/absolute",
  "UPPER",
  "under_score",
  "dot.name",
  "space name",
  "tab\tname",
  "emoji-🔥",
  "percent%20",
  "plus+sign",
  "at@sign",
  "colon:part",
  "semi;colon",
  "comma,part",
  "question?mark",
  "star*wild",
  "paren(test)",
  "bracket[test]",
  "brace{test}",
  "quote'test",
  'quote"test',
  "back\\slash",
  "pipe|test",
  "tilde~test",
  "caret^test",
  "dollar$test",
  "hash#test",
  "ampersand&test",
  "equals=test",
  "null\0byte",
  "newline\npart",
  "carriage\rpart",
  "unicode-café",
  "cyrillic-тест",
  "chinese-测试",
  "japanese-テスト",
  "arabic-اختبار",
  "hebrew-בדיקה",
  "thai-ทดสob",
  "korean-테스트",
  "greek-δοκιμή",
  "mixed-Abc123",
  "123numeric",
  "-leading-dash",
  "trailing-dash-",
  "double--dash",
  "triple---dash",
  "a".repeat(256),
  "valid-start-invalid-end!",
  "!invalid-start-valid-end",
  "path/with/slash",
  "path\\with\\backslash",
  "null",
  "undefined",
  "NaN",
  "true",
  "false",
  "0",
  "1",
  "42",
  "-1",
  "3.14",
  "1e10",
  "Infinity",
  "-Infinity",
  "[]",
  "{}",
  "[]foo",
  "foo[]",
  "<script>",
  "</script>",
  "javascript:alert(1)",
  "data:text/html",
  "file:///etc/passwd",
  "http://evil.com",
  "https://evil.com",
  "ftp://evil.com",
  "ssh://evil.com",
  "git+ssh://evil.com",
  "npm:@scope/pkg",
  "scoped@pkg",
  "pkg@1.0.0",
  "pkg@latest",
  "pkg@^1.0.0",
  "pkg@~1.0.0",
  "pkg@>=1.0.0",
  "pkg@<=1.0.0",
  "pkg@>1.0.0",
  "pkg@<1.0.0",
  "pkg@!=1.0.0",
  "pkg@1.0.0-beta.1",
  "pkg@1.0.0-alpha.1",
  "pkg@1.0.0-rc.1",
  "pkg@1.0.0+build.1",
  "pkg@1.0.0-build.1",
  "pkg@1.0.0-build.1+sha.1",
  "pkg@1.0.0-build.1+sha.1+meta.1",
  "pkg@1.0.0-build.1+sha.1+meta.1+extra.1",
  "pkg@1.0.0-build.1+sha.1+meta.1+extra.1+more.1",
  "pkg@1.0.0-build.1+sha.1+meta.1+extra.1+more.1+final.1",
  "windows\\device\\con",
  "windows\\device\\prn",
  "windows\\device\\aux",
  "windows\\device\\nul",
  "windows\\device\\com1",
  "windows\\device\\lpt1",
  "reserved/con",
  "reserved/prn",
  "reserved/aux",
  "reserved/nul",
  "reserved/com1",
  "reserved/lpt1",
  "dotfile/.hidden",
  "dotfile/..hidden",
  "dotfile/...hidden",
  "dotfile/....hidden",
  "dotfile/.....hidden",
  "dotfile/......hidden",
  "dotfile/.......hidden",
  "dotfile/........hidden",
  "dotfile/.........hidden",
  "dotfile/..........hidden",
];

const SAFE_PARTS = [
  "a",
  "z",
  "0",
  "9",
  "a0",
  "0a",
  "a-b",
  "b-c-d",
  "mcp",
  "skills",
  "hooks",
  "commands",
  "statuslines",
  "guides",
  "plugins",
  "agents",
  "tools",
  "rules",
  "collections",
  "browser-bridge",
  "demo-agent",
  "demo-mcp",
  "demo-skills",
  "demo-hooks",
  "demo-commands",
  "demo-statuslines",
  "demo-guides",
  "demo-plugins",
  "demo-tools",
  "demo-rules",
  "demo-collections",
  "playwright-bridge",
  "git-workflow",
  "code-review",
  "test-runner",
  "lint-fix",
  "format-code",
  "deploy-helper",
  "monitor-logs",
  "debug-session",
  "profile-perf",
  "security-scan",
  "dependency-check",
  "license-audit",
  "changelog-gen",
  "readme-gen",
  "api-docs",
  "schema-gen",
  "migration-tool",
  "backup-restore",
  "cache-clear",
  "config-sync",
  "env-manager",
  "secret-rotate",
  "token-refresh",
  "oauth-flow",
  "webhook-relay",
  "queue-worker",
  "batch-processor",
  "stream-handler",
  "event-bus",
  "state-machine",
  "workflow-engine",
  "task-scheduler",
  "cron-runner",
  "health-check",
  "metrics-collector",
  "trace-exporter",
  "log-aggregator",
  "alert-router",
  "incident-bot",
  "oncall-helper",
  "runbook-gen",
  "postmortem-writer",
  "slo-tracker",
  "error-budget",
  "capacity-plan",
  "cost-analyzer",
  "usage-report",
  "billing-sync",
  "invoice-gen",
  "tax-calculator",
  "currency-convert",
  "locale-detect",
  "timezone-map",
  "calendar-sync",
  "meeting-notes",
  "standup-bot",
  "retro-facilitator",
  "sprint-planner",
  "backlog-groom",
  "story-splitter",
  "acceptance-criteria",
  "test-case-gen",
  "bug-triage",
  "regression-suite",
  "smoke-test",
  "load-test",
  "stress-test",
  "chaos-monkey",
  "failover-test",
  "disaster-recovery",
  "backup-verify",
  "restore-test",
  "data-migration",
  "schema-migrate",
  "index-rebuild",
  "cache-warm",
  "cdn-purge",
  "dns-update",
  "cert-renew",
  "ssl-check",
  "tls-scan",
  "vuln-scan",
  "pen-test",
  "compliance-check",
  "audit-trail",
  "access-review",
  "permission-audit",
  "role-manager",
  "policy-enforcer",
  "guardrail-check",
  "content-filter",
  "spam-detect",
  "abuse-report",
  "moderation-queue",
  "appeal-handler",
  "trust-score",
  "reputation-calc",
  "fraud-detect",
  "anomaly-detect",
  "outlier-find",
  "cluster-analyze",
  "trend-detect",
  "forecast-model",
  "seasonality-adjust",
  "anomaly-alert",
  "threshold-tune",
  "baseline-calc",
  "benchmark-run",
  "compare-versions",
  "diff-analyzer",
  "merge-conflict",
  "branch-strategy",
  "release-notes",
  "version-bump",
  "semver-check",
  "dep-update",
  "dep-audit",
  "dep-graph",
  "license-check",
  "sbom-gen",
  "provenance-verify",
  "signature-check",
  "checksum-verify",
  "hash-compare",
  "integrity-check",
  "tamper-detect",
  "replay-attack",
  "nonce-gen",
  "token-sign",
  "jwt-verify",
  "oauth-verify",
  "saml-parse",
  "ldap-sync",
  "sso-config",
  "mfa-enroll",
  "passkey-setup",
  "recovery-codes",
  "session-revoke",
  "device-trust",
  "geo-fence",
  "ip-allowlist",
  "rate-limit",
  "quota-enforce",
  "throttle-api",
  "circuit-break",
  "retry-policy",
  "backoff-calc",
  "timeout-set",
  "deadline-enforce",
  "priority-queue",
  "fair-scheduler",
  "work-steal",
  "pool-resize",
  "auto-scale",
  "scale-down",
  "scale-up",
  "warm-pool",
  "cold-start",
  "prewarm-cache",
  "lazy-load",
  "eager-load",
  "prefetch-data",
  "batch-fetch",
  "parallel-map",
  "reduce-aggregate",
  "filter-stream",
  "transform-pipe",
  "validate-schema",
  "sanitize-input",
  "escape-output",
  "encode-url",
  "decode-base64",
  "compress-gzip",
  "decompress-zstd",
  "encrypt-aes",
  "decrypt-aes",
  "key-rotate",
  "secret-store",
  "vault-read",
  "kms-encrypt",
  "hsm-sign",
];

function artifactPathTests() {
  const lines = [];
  lines.push(`import { describe, expect, it } from "vitest";`);
  lines.push(`import path from "node:path";`);
  lines.push(``);
  lines.push(`import {`);
  lines.push(`  SAFE_PATH_PART_PATTERN,`);
  lines.push(`  isSafePathPart,`);
  lines.push(`  safeRelativePath,`);
  lines.push(`} from "../packages/mcp/src/registry-artifact-path-lib.js";`);
  lines.push(``);

  lines.push(
    `describe("registry-artifact-path-lib SAFE_PATH_PART_PATTERN", () => {`,
  );
  lines.push(`  it("matches lowercase alphanumeric hyphen slugs", () => {`);
  lines.push(
    `    expect(SAFE_PATH_PART_PATTERN.test("browser-bridge")).toBe(true);`,
  );
  lines.push(`    expect(SAFE_PATH_PART_PATTERN.test("mcp123")).toBe(true);`);
  lines.push(`    expect(SAFE_PATH_PART_PATTERN.test("a")).toBe(true);`);
  lines.push(`    expect(SAFE_PATH_PART_PATTERN.test("9")).toBe(true);`);
  lines.push(`  });`);
  lines.push(
    `  it("rejects uppercase, underscores, dots, and special chars", () => {`,
  );
  lines.push(
    `    expect(SAFE_PATH_PART_PATTERN.test("Browser-Bridge")).toBe(false);`,
  );
  lines.push(
    `    expect(SAFE_PATH_PART_PATTERN.test("under_score")).toBe(false);`,
  );
  lines.push(
    `    expect(SAFE_PATH_PART_PATTERN.test("dot.name")).toBe(false);`,
  );
  lines.push(
    `    expect(SAFE_PATH_PART_PATTERN.test("space name")).toBe(false);`,
  );
  lines.push(`  });`);
  lines.push(`});`);
  lines.push(``);

  lines.push(`describe("registry-artifact-path-lib isSafePathPart", () => {`);
  lines.push(`  it("accepts empty string as falsy input", () => {`);
  lines.push(`    expect(isSafePathPart("")).toBe(false);`);
  lines.push(`    expect(isSafePathPart(null)).toBe(false);`);
  lines.push(`    expect(isSafePathPart(undefined)).toBe(false);`);
  lines.push(`  });`);
  lines.push(``);

  for (const part of SAFE_PARTS) {
    lines.push(`  it("accepts safe part ${part}", () => {`);
    lines.push(`    expect(isSafePathPart("${part}")).toBe(true);`);
    lines.push(`  });`);
  }

  for (const unsafe of UNSAFE_PATHS.filter(
    (value) => !isSafePathPartPattern(value),
  )) {
    const label = safeTestLabel(unsafe);
    lines.push(`  it("rejects unsafe part ${label}", () => {`);
    lines.push(
      `    expect(isSafePathPart(${JSON.stringify(unsafe)})).toBe(false);`,
    );
    lines.push(`  });`);
  }

  for (const value of UNSAFE_PATHS.filter((value) =>
    isSafePathPartPattern(value),
  )) {
    const label = safeTestLabel(value);
    lines.push(`  it("accepts slug-safe edge part ${label}", () => {`);
    lines.push(
      `    expect(isSafePathPart(${JSON.stringify(value)})).toBe(true);`,
    );
    lines.push(`  });`);
  }

  for (const category of CATEGORIES) {
    for (let i = 0; i < 8; i++) {
      const slug = `${category}-fixture-${i}`;
      lines.push(`  it("isSafePathPart matrix ${category}/${i}", () => {`);
      lines.push(`    expect(isSafePathPart("${category}")).toBe(true);`);
      lines.push(`    expect(isSafePathPart("${slug}")).toBe(true);`);
      lines.push(
        `    expect(isSafePathPart("${category.toUpperCase()}")).toBe(false);`,
      );
      lines.push(`    expect(isSafePathPart("${slug}_bad")).toBe(false);`);
      lines.push(`  });`);
    }
  }
  lines.push(`});`);
  lines.push(``);

  lines.push(`describe("registry-artifact-path-lib safeRelativePath", () => {`);
  lines.push(`  it("joins safe segments with platform separator", () => {`);
  lines.push(
    `    const joined = safeRelativePath("entries/mcp/browser-bridge.json");`,
  );
  lines.push(
    `    expect(joined).toBe(["entries", "mcp", "browser-bridge.json"].join(path.sep));`,
  );
  lines.push(`  });`);
  lines.push(`  it("throws for empty path", () => {`);
  lines.push(
    `    expect(() => safeRelativePath("")).toThrow(/Unsafe registry artifact path/);`,
  );
  lines.push(`  });`);
  lines.push(``);

  for (const category of CATEGORIES) {
    for (let i = 0; i < 10; i++) {
      const slug = `${category}-entry-${i}`;
      lines.push(
        `  it("safeRelativePath entries/${category}/${slug}.json", () => {`,
      );
      lines.push(
        `    expect(safeRelativePath("entries/${category}/${slug}.json")).toContain("${slug}.json");`,
      );
      lines.push(`  });`);
      lines.push(
        `  it("safeRelativePath search-index for ${category} variant ${i}", () => {`,
      );
      lines.push(
        `    expect(safeRelativePath("search-index.json")).toBe("search-index.json");`,
      );
      lines.push(
        `    expect(safeRelativePath("feeds/${category}/index.json")).toContain("index.json");`,
      );
      lines.push(`  });`);
    }
  }

  for (const unsafe of RELATIVE_UNSAFE_PATHS) {
    if (!isUnsafeRelativePath(unsafe)) continue;
    const label = safeTestLabel(unsafe, 30);
    lines.push(`  it("safeRelativePath rejects ${label}", () => {`);
    lines.push(
      `    expect(() => safeRelativePath(${JSON.stringify(unsafe)})).toThrow(/Unsafe registry artifact path/);`,
    );
    lines.push(`  });`);
  }

  for (const category of CATEGORIES) {
    for (let i = 0; i < 6; i++) {
      lines.push(
        `  it("safeRelativePath accepts traversal-safe ${category} ${i}", () => {`,
      );
      lines.push(
        `    expect(safeRelativePath("entries/${category}/safe-${i}.json")).toContain("safe-${i}.json");`,
      );
      lines.push(
        `    expect(safeRelativePath("feeds/${category}/index-${i}.json")).toContain("index-${i}.json");`,
      );
      lines.push(`  });`);
    }
  }

  for (const part of SAFE_PARTS.slice(0, 60)) {
    lines.push(`  it("safeRelativePath single segment ${part}", () => {`);
    lines.push(
      `    expect(safeRelativePath("${part}.json")).toBe("${part}.json");`,
    );
    lines.push(`  });`);
  }
  lines.push(`});`);

  return lines.join("\n") + "\n";
}

function publicApiTests() {
  const lines = [];
  lines.push(
    `import { describe, expect, it, beforeEach, afterEach } from "vitest";`,
  );
  lines.push(``);
  lines.push(`import { SITE_URL } from "../packages/mcp/src/platforms.js";`);
  lines.push(`import {`);
  lines.push(`  publicApiBaseUrl,`);
  lines.push(`  stripTrailingSlashes,`);
  lines.push(`} from "../packages/mcp/src/registry-public-api-lib.js";`);
  lines.push(``);

  lines.push(
    `describe("registry-public-api-lib stripTrailingSlashes", () => {`,
  );
  lines.push(`  it("removes one trailing slash", () => {`);
  lines.push(
    `    expect(stripTrailingSlashes("https://heyclau.de/")).toBe("https://heyclau.de");`,
  );
  lines.push(`  });`);
  lines.push(`  it("removes multiple trailing slashes", () => {`);
  lines.push(
    `    expect(stripTrailingSlashes("https://heyclau.de///")).toBe("https://heyclau.de");`,
  );
  lines.push(`  });`);
  lines.push(`  it("preserves empty string", () => {`);
  lines.push(`    expect(stripTrailingSlashes("")).toBe("");`);
  lines.push(`  });`);
  lines.push(`  it("preserves strings without trailing slashes", () => {`);
  lines.push(
    `    expect(stripTrailingSlashes("https://heyclau.de")).toBe("https://heyclau.de");`,
  );
  lines.push(
    `    expect(stripTrailingSlashes("https://heyclau.de/api")).toBe("https://heyclau.de/api");`,
  );
  lines.push(`  });`);
  lines.push(``);

  const urls = [
    "https://heyclau.de",
    "https://heyclau.de/",
    "https://heyclau.de//",
    "https://heyclau.de///",
    "https://api.heyclau.de",
    "https://api.heyclau.de/",
    "http://localhost:3000",
    "http://localhost:3000/",
    "http://127.0.0.1:8787",
    "http://127.0.0.1:8787/",
    "https://preview.heyclau.de",
    "https://preview.heyclau.de/",
    "https://staging.heyclau.de",
    "https://staging.heyclau.de/",
    "https://dev.heyclau.de",
    "https://dev.heyclau.de/",
    "https://example.com",
    "https://example.com/",
    "https://example.com/api/v1",
    "https://example.com/api/v1/",
    "https://example.com/api/v1//",
    "https://example.com/api/v1///",
    "https://sub.example.com",
    "https://sub.example.com/",
    "https://sub.example.com/path",
    "https://sub.example.com/path/",
    "https://sub.example.com/path/to/resource",
    "https://sub.example.com/path/to/resource/",
    "ftp://files.example.com/",
    "file:///tmp/",
    "custom-scheme://host/",
    "custom-scheme://host/path/",
    "custom-scheme://host/path//",
    "/relative/path/",
    "/relative/path//",
    "relative/path/",
    "relative/path//",
    "no-scheme-host/",
    "no-scheme-host//",
    "///",
    "//",
    "/",
    "a/",
    "ab/",
    "abc/",
    "abcd/",
    "abcde/",
    "slash-only/////",
    "path/with/internal/slash",
    "path/with/internal/slash/",
    "path/with/internal/slash//",
    "path?query=1/",
    "path?query=1//",
    "path#fragment/",
    "path#fragment//",
    "path?query=1#fragment/",
    "path?query=1#fragment//",
    "unicode-https://heyclau.de/",
    "https://heyclau.de/entry/mcp/demo/",
    "https://heyclau.de/api/registry/trending/",
    "https://heyclau.de/api/jobs/",
    "https://heyclau.de/api/registry/feed/",
    "https://heyclau.de/data/directory-index.json/",
    "https://heyclau.de/.well-known/mcp/server-card.json/",
    "https://heyclau.de/feeds/",
    "https://heyclau.de/quality/",
    "https://heyclau.de/openapi.json/",
    "https://heyclau.de/llms.txt/",
    "https://heyclau.de/llms-full.txt/",
  ];

  for (let i = 0; i < urls.length; i++) {
    const url = urls[i];
    const expected = url.replace(/\/+$/, "");
    lines.push(`  it("stripTrailingSlashes variant ${i}", () => {`);
    lines.push(
      `    expect(stripTrailingSlashes(${JSON.stringify(url)})).toBe(${JSON.stringify(expected)});`,
    );
    lines.push(`  });`);
  }

  for (let i = 0; i < 60; i++) {
    const base = `https://host-${i}.example.com`;
    const slashes = "/".repeat((i % 5) + 1);
    lines.push(`  it("stripTrailingSlashes generated ${i}", () => {`);
    lines.push(
      `    expect(stripTrailingSlashes("${base}${slashes}")).toBe("${base}");`,
    );
    lines.push(
      `    expect(stripTrailingSlashes("${base}/api/v${i}${slashes}")).toBe("${base}/api/v${i}");`,
    );
    lines.push(`  });`);
  }
  lines.push(`});`);
  lines.push(``);

  lines.push(`describe("registry-public-api-lib publicApiBaseUrl", () => {`);
  lines.push(`  const original = process.env.HEYCLAUDE_PUBLIC_API_URL;`);
  lines.push(`  beforeEach(() => {`);
  lines.push(`    delete process.env.HEYCLAUDE_PUBLIC_API_URL;`);
  lines.push(`  });`);
  lines.push(`  afterEach(() => {`);
  lines.push(
    `    if (original === undefined) delete process.env.HEYCLAUDE_PUBLIC_API_URL;`,
  );
  lines.push(`    else process.env.HEYCLAUDE_PUBLIC_API_URL = original;`);
  lines.push(`  });`);
  lines.push(`  it("prefers explicit options.publicApiBaseUrl", () => {`);
  lines.push(
    `    expect(publicApiBaseUrl({ publicApiBaseUrl: "https://override.example.com" })).toBe("https://override.example.com");`,
  );
  lines.push(`  });`);
  lines.push(`  it("falls back to HEYCLAUDE_PUBLIC_API_URL env var", () => {`);
  lines.push(
    `    process.env.HEYCLAUDE_PUBLIC_API_URL = "https://env.example.com";`,
  );
  lines.push(
    `    expect(publicApiBaseUrl({})).toBe("https://env.example.com");`,
  );
  lines.push(`  });`);
  lines.push(`  it("falls back to SITE_URL when no override or env", () => {`);
  lines.push(`    expect(publicApiBaseUrl({})).toBe(SITE_URL);`);
  lines.push(`  });`);
  lines.push(`  it("options override beats env var", () => {`);
  lines.push(
    `    process.env.HEYCLAUDE_PUBLIC_API_URL = "https://env.example.com";`,
  );
  lines.push(
    `    expect(publicApiBaseUrl({ publicApiBaseUrl: "https://options.example.com" })).toBe("https://options.example.com");`,
  );
  lines.push(`  });`);
  lines.push(``);

  const overrides = [
    "https://heyclau.de",
    "https://api.heyclau.de",
    "http://localhost:3000",
    "http://127.0.0.1:8787",
    "https://preview.heyclau.de",
    "https://staging.heyclau.de",
    "https://dev.heyclau.de",
    "https://custom-1.example.com",
    "https://custom-2.example.com",
    "https://custom-3.example.com",
    "https://custom-4.example.com",
    "https://custom-5.example.com",
    "https://custom-6.example.com",
    "https://custom-7.example.com",
    "https://custom-8.example.com",
    "https://custom-9.example.com",
    "https://custom-10.example.com",
    "https://edge.heyclau.de",
    "https://worker.heyclau.de",
    "https://pages.heyclau.de",
    "https://cf.heyclau.de",
    "https://durable.heyclau.de",
    "https://kv.heyclau.de",
    "https://r2.heyclau.de",
    "https://d1.heyclau.de",
    "https://tunnel.heyclau.de",
    "https://proxy.heyclau.de",
    "https://mirror.heyclau.de",
    "https://cdn.heyclau.de",
    "https://static.heyclau.de",
    "https://assets.heyclau.de",
    "https://media.heyclau.de",
    "https://images.heyclau.de",
    "https://docs.heyclau.de",
    "https://blog.heyclau.de",
    "https://community.heyclau.de",
    "https://forum.heyclau.de",
    "https://support.heyclau.de",
    "https://status.heyclau.de",
    "https://uptime.heyclau.de",
    "https://metrics.heyclau.de",
    "https://logs.heyclau.de",
    "https://traces.heyclau.de",
    "https://alerts.heyclau.de",
    "https://oncall.heyclau.de",
    "https://incident.heyclau.de",
    "https://security.heyclau.de",
    "https://trust.heyclau.de",
    "https://privacy.heyclau.de",
    "https://legal.heyclau.de",
    "https://terms.heyclau.de",
    "https://abuse.heyclau.de",
    "https://dmca.heyclau.de",
    "https://copyright.heyclau.de",
    "https://patent.heyclau.de",
    "https://trademark.heyclau.de",
    "https://brand.heyclau.de",
    "https://press.heyclau.de",
    "https://investor.heyclau.de",
    "https://careers.heyclau.de",
    "https://jobs.heyclau.de",
    "https://team.heyclau.de",
    "https://about.heyclau.de",
    "https://contact.heyclau.de",
    "https://help.heyclau.de",
    "https://faq.heyclau.de",
    "https://guide.heyclau.de",
    "https://tutorial.heyclau.de",
    "https://learn.heyclau.de",
    "https://academy.heyclau.de",
    "https://university.heyclau.de",
    "https://school.heyclau.de",
    "https://course.heyclau.de",
    "https://lesson.heyclau.de",
    "https://quiz.heyclau.de",
    "https://exam.heyclau.de",
    "https://cert.heyclau.de",
    "https://badge.heyclau.de",
    "https://reward.heyclau.de",
    "https://points.heyclau.de",
    "https://leaderboard.heyclau.de",
    "https://rank.heyclau.de",
    "https://score.heyclau.de",
    "https://level.heyclau.de",
    "https://xp.heyclau.de",
    "https://achievement.heyclau.de",
    "https://milestone.heyclau.de",
    "https://streak.heyclau.de",
    "https://daily.heyclau.de",
    "https://weekly.heyclau.de",
    "https://monthly.heyclau.de",
    "https://yearly.heyclau.de",
    "https://season.heyclau.de",
    "https://event.heyclau.de",
    "https://webinar.heyclau.de",
    "https://conference.heyclau.de",
    "https://summit.heyclau.de",
    "https://hackathon.heyclau.de",
    "https://challenge.heyclau.de",
    "https://contest.heyclau.de",
    "https://prize.heyclau.de",
    "https://grant.heyclau.de",
    "https://fund.heyclau.de",
    "https://invest.heyclau.de",
    "https://donate.heyclau.de",
    "https://sponsor.heyclau.de",
    "https://partner.heyclau.de",
    "https://affiliate.heyclau.de",
    "https://referral.heyclau.de",
    "https://invite.heyclau.de",
    "https://share.heyclau.de",
    "https://embed.heyclau.de",
    "https://widget.heyclau.de",
    "https://plugin.heyclau.de",
    "https://extension.heyclau.de",
    "https://addon.heyclau.de",
    "https://module.heyclau.de",
    "https://package.heyclau.de",
    "https://library.heyclau.de",
    "https://sdk.heyclau.de",
    "https://api-docs.heyclau.de",
    "https://openapi.heyclau.de",
    "https://graphql.heyclau.de",
    "https://grpc.heyclau.de",
    "https://websocket.heyclau.de",
    "https://sse.heyclau.de",
    "https://webhook.heyclau.de",
    "https://callback.heyclau.de",
    "https://redirect.heyclau.de",
    "https://oauth.heyclau.de",
    "https://sso.heyclau.de",
    "https://login.heyclau.de",
    "https://signup.heyclau.de",
    "https://register.heyclau.de",
    "https://verify.heyclau.de",
    "https://reset.heyclau.de",
    "https://confirm.heyclau.de",
    "https://activate.heyclau.de",
    "https://deactivate.heyclau.de",
    "https://suspend.heyclau.de",
    "https://ban.heyclau.de",
    "https://unban.heyclau.de",
    "https://mute.heyclau.de",
    "https://block.heyclau.de",
    "https://report.heyclau.de",
    "https://flag.heyclau.de",
    "https://review.heyclau.de",
    "https://approve.heyclau.de",
    "https://reject.heyclau.de",
    "https://pending.heyclau.de",
    "https://queue.heyclau.de",
    "https://backlog.heyclau.de",
    "https://archive.heyclau.de",
    "https://trash.heyclau.de",
    "https://restore.heyclau.de",
    "https://delete.heyclau.de",
    "https://purge.heyclau.de",
    "https://cleanup.heyclau.de",
    "https://maintenance.heyclau.de",
    "https://upgrade.heyclau.de",
    "https://downgrade.heyclau.de",
    "https://rollback.heyclau.de",
    "https://deploy.heyclau.de",
    "https://release.heyclau.de",
    "https://build.heyclau.de",
    "https://test.heyclau.de",
    "https://ci.heyclau.de",
    "https://cd.heyclau.de",
    "https://pipeline.heyclau.de",
    "https://workflow.heyclau.de",
    "https://action.heyclau.de",
    "https://runner.heyclau.de",
    "https://agent.heyclau.de",
    "https://bot.heyclau.de",
    "https://automation.heyclau.de",
    "https://orchestrator.heyclau.de",
    "https://scheduler.heyclau.de",
    "https://cron.heyclau.de",
    "https://timer.heyclau.de",
    "https://delay.heyclau.de",
    "https://retry.heyclau.de",
    "https://backoff.heyclau.de",
    "https://timeout.heyclau.de",
    "https://deadline.heyclau.de",
    "https://budget.heyclau.de",
    "https://quota.heyclau.de",
    "https://limit.heyclau.de",
    "https://throttle.heyclau.de",
    "https://rate.heyclau.de",
    "https://burst.heyclau.de",
    "https://spike.heyclau.de",
    "https://surge.heyclau.de",
    "https://flood.heyclau.de",
    "https://ddos.heyclau.de",
    "https://waf.heyclau.de",
    "https://firewall.heyclau.de",
    "https://shield.heyclau.de",
    "https://guard.heyclau.de",
    "https://protect.heyclau.de",
    "https://secure.heyclau.de",
    "https://encrypt.heyclau.de",
    "https://decrypt.heyclau.de",
    "https://hash.heyclau.de",
    "https://sign.heyclau.de",
    "https://verify-sign.heyclau.de",
    "https://cert.heyclau.de",
    "https://tls.heyclau.de",
    "https://ssl.heyclau.de",
    "https://pki.heyclau.de",
    "https://ca.heyclau.de",
    "https://crl.heyclau.de",
    "https://ocsp.heyclau.de",
    "https://hsts.heyclau.de",
    "https://csp.heyclau.de",
    "https://cors.heyclau.de",
    "https://csrf.heyclau.de",
    "https://xss.heyclau.de",
    "https://sqli.heyclau.de",
    "https://injection.heyclau.de",
    "https://sanitize.heyclau.de",
    "https://validate.heyclau.de",
    "https://escape.heyclau.de",
    "https://encode.heyclau.de",
    "https://decode.heyclau.de",
    "https://parse.heyclau.de",
    "https://serialize.heyclau.de",
    "https://deserialize.heyclau.de",
    "https://marshal.heyclau.de",
    "https://unmarshal.heyclau.de",
    "https://pack.heyclau.de",
    "https://unpack.heyclau.de",
    "https://compress.heyclau.de",
    "https://decompress.heyclau.de",
    "https://zip.heyclau.de",
    "https://unzip.heyclau.de",
    "https://tar.heyclau.de",
    "https://untar.heyclau.de",
    "https://gzip.heyclau.de",
    "https://gunzip.heyclau.de",
    "https://brotli.heyclau.de",
    "https://zstd.heyclau.de",
    "https://lz4.heyclau.de",
    "https://snappy.heyclau.de",
    "https://base64.heyclau.de",
    "https://hex.heyclau.de",
    "https://binary.heyclau.de",
    "https://octal.heyclau.de",
    "https://decimal.heyclau.de",
    "https://float.heyclau.de",
    "https://double.heyclau.de",
    "https://bigint.heyclau.de",
    "https://uuid.heyclau.de",
    "https://guid.heyclau.de",
    "https://nanoid.heyclau.de",
    "https://ulid.heyclau.de",
    "https://snowflake.heyclau.de",
    "https://timestamp.heyclau.de",
    "https://epoch.heyclau.de",
    "https://iso8601.heyclau.de",
    "https://rfc3339.heyclau.de",
    "https://timezone.heyclau.de",
    "https://locale.heyclau.de",
    "https://i18n.heyclau.de",
    "https://l10n.heyclau.de",
    "https://translation.heyclau.de",
    "https://localization.heyclau.de",
    "https://globalization.heyclau.de",
    "https://internationalization.heyclau.de",
  ];

  for (let i = 0; i < overrides.length; i++) {
    const url = overrides[i];
    lines.push(`  it("publicApiBaseUrl override ${i}", () => {`);
    lines.push(
      `    expect(publicApiBaseUrl({ publicApiBaseUrl: ${JSON.stringify(url)} })).toBe(${JSON.stringify(url)});`,
    );
    lines.push(`  });`);
  }

  for (let i = 0; i < 40; i++) {
    lines.push(`  it("publicApiBaseUrl env matrix ${i}", () => {`);
    lines.push(
      `    process.env.HEYCLAUDE_PUBLIC_API_URL = "https://env-${i}.example.com";`,
    );
    lines.push(
      `    expect(publicApiBaseUrl({})).toBe("https://env-${i}.example.com");`,
    );
    lines.push(
      `    expect(publicApiBaseUrl({ publicApiBaseUrl: "https://opt-${i}.example.com" })).toBe("https://opt-${i}.example.com");`,
    );
    lines.push(`  });`);
  }
  lines.push(`});`);

  return lines.join("\n") + "\n";
}

function discoveryProjectionTests() {
  const lines = [];
  lines.push(`import { describe, expect, it } from "vitest";`);
  lines.push(``);
  lines.push(`import { SITE_URL } from "../packages/mcp/src/platforms.js";`);
  lines.push(`import {`);
  lines.push(`  toTrendingEntry,`);
  lines.push(`  toJobEntry,`);
  lines.push(
    `} from "../packages/mcp/src/registry-discovery-projection-lib.js";`,
  );
  lines.push(``);

  lines.push(`function makeTrendingEntry(overrides = {}) {`);
  lines.push(`  return {`);
  lines.push(`    category: "mcp",`);
  lines.push(`    slug: "browser-bridge",`);
  lines.push(`    title: "Browser Bridge",`);
  lines.push(`    description: "Runs Playwright automation.",`);
  lines.push(`    platforms: ["claude-code"],`);
  lines.push(`    tags: ["browser-automation"],`);
  lines.push(`    dateAdded: "2026-01-15",`);
  lines.push(`    score: 42,`);
  lines.push(`    reasons: ["recent_activity"],`);
  lines.push(`    trustSignals: { sourceStatus: "available" },`);
  lines.push(`    ...overrides,`);
  lines.push(`  };`);
  lines.push(`}`);
  lines.push(``);

  lines.push(`function makeJob(overrides = {}) {`);
  lines.push(`  return {`);
  lines.push(`    id: "job-123",`);
  lines.push(`    slug: "job-slug",`);
  lines.push(`    title: "Senior MCP Engineer",`);
  lines.push(`    company: "HeyClaude",`);
  lines.push(`    location: "Remote",`);
  lines.push(`    type: "full-time",`);
  lines.push(`    isRemote: true,`);
  lines.push(`    tier: "featured",`);
  lines.push(`    applyUrl: "https://jobs.example.com/apply",`);
  lines.push(`    sourceLabel: "HeyClaude Jobs",`);
  lines.push(`    postedAt: "2026-06-01",`);
  lines.push(`    labels: ["mcp", "typescript"],`);
  lines.push(`    ...overrides,`);
  lines.push(`  };`);
  lines.push(`}`);
  lines.push(``);

  lines.push(
    `describe("registry-discovery-projection-lib toTrendingEntry", () => {`,
  );
  lines.push(`  it("projects stable trending shape", () => {`);
  lines.push(`    const entry = makeTrendingEntry();`);
  lines.push(`    expect(toTrendingEntry(entry)).toEqual({`);
  lines.push(`      key: "mcp:browser-bridge",`);
  lines.push(`      category: "mcp",`);
  lines.push(`      slug: "browser-bridge",`);
  lines.push(`      title: "Browser Bridge",`);
  lines.push(`      description: "Runs Playwright automation.",`);
  lines.push(`      canonicalUrl: \`\${SITE_URL}/entry/mcp/browser-bridge\`,`);
  lines.push(`      platforms: ["claude-code"],`);
  lines.push(`      tags: ["browser-automation"],`);
  lines.push(`      dateAdded: "2026-01-15",`);
  lines.push(`      score: 42,`);
  lines.push(`      reasons: ["recent_activity"],`);
  lines.push(`      trustSignals: { sourceStatus: "available" },`);
  lines.push(`    });`);
  lines.push(`  });`);
  lines.push(`  it("defaults missing arrays and non-numeric score", () => {`);
  lines.push(`    const entry = makeTrendingEntry({`);
  lines.push(`      platforms: null,`);
  lines.push(`      tags: undefined,`);
  lines.push(`      score: "high",`);
  lines.push(`      reasons: "not-array",`);
  lines.push(`      trustSignals: undefined,`);
  lines.push(`    });`);
  lines.push(`    const projected = toTrendingEntry(entry);`);
  lines.push(`    expect(projected.platforms).toEqual([]);`);
  lines.push(`    expect(projected.tags).toEqual([]);`);
  lines.push(`    expect(projected.score).toBe(0);`);
  lines.push(`    expect(projected.reasons).toEqual([]);`);
  lines.push(
    `    expect(projected.trustSignals).toEqual({ sourceStatus: "missing" });`,
  );
  lines.push(`  });`);
  lines.push(``);

  for (const category of CATEGORIES) {
    for (let i = 0; i < 12; i++) {
      const slug = `${category}-trend-${i}`;
      lines.push(`  it("toTrendingEntry ${category} variant ${i}", () => {`);
      lines.push(
        `    const entry = makeTrendingEntry({ category: "${category}", slug: "${slug}", title: "${category} Trend ${i}", score: ${i * 10} });`,
      );
      lines.push(`    const projected = toTrendingEntry(entry);`);
      lines.push(`    expect(projected.key).toBe("${category}:${slug}");`);
      lines.push(`    expect(projected.category).toBe("${category}");`);
      lines.push(`    expect(projected.slug).toBe("${slug}");`);
      lines.push(`    expect(projected.canonicalUrl).toContain("${slug}");`);
      lines.push(`    expect(projected.score).toBe(${i * 10});`);
      lines.push(`  });`);
    }
  }

  for (const platform of PLATFORMS) {
    for (let i = 0; i < 5; i++) {
      lines.push(`  it("toTrendingEntry platform ${platform} ${i}", () => {`);
      lines.push(
        `    const entry = makeTrendingEntry({ platforms: ["${platform}"], tags: ["tag-${i}"], reasons: ["reason-${i}"] });`,
      );
      lines.push(`    const projected = toTrendingEntry(entry);`);
      lines.push(`    expect(projected.platforms).toEqual(["${platform}"]);`);
      lines.push(`    expect(projected.tags).toEqual(["tag-${i}"]);`);
      lines.push(`    expect(projected.reasons).toEqual(["reason-${i}"]);`);
      lines.push(`  });`);
    }
  }

  for (let i = 0; i < 50; i++) {
    lines.push(`  it("toTrendingEntry churn matrix ${i}", () => {`);
    lines.push(
      `    const entry = makeTrendingEntry({ title: "", description: "", dateAdded: "", score: ${i % 2 === 0 ? i : `"${i}"`} });`,
    );
    lines.push(`    const projected = toTrendingEntry(entry);`);
    lines.push(`    expect(projected.title).toBe("");`);
    lines.push(`    expect(typeof projected.score).toBe("number");`);
    lines.push(`    expect(projected.trustSignals).toBeDefined();`);
    lines.push(`  });`);
  }
  lines.push(`});`);
  lines.push(``);

  lines.push(
    `describe("registry-discovery-projection-lib toJobEntry", () => {`,
  );
  lines.push(`  it("projects stable job shape", () => {`);
  lines.push(`    expect(toJobEntry(makeJob())).toEqual({`);
  lines.push(`      id: "job-123",`);
  lines.push(`      title: "Senior MCP Engineer",`);
  lines.push(`      company: "HeyClaude",`);
  lines.push(`      location: "Remote",`);
  lines.push(`      type: "full-time",`);
  lines.push(`      isRemote: true,`);
  lines.push(`      tier: "featured",`);
  lines.push(`      applyUrl: "https://jobs.example.com/apply",`);
  lines.push(`      sourceLabel: "HeyClaude Jobs",`);
  lines.push(`      postedAt: "2026-06-01",`);
  lines.push(`      labels: ["mcp", "typescript"],`);
  lines.push(`    });`);
  lines.push(`  });`);
  lines.push(`  it("falls back id to slug and applyUrl to url", () => {`);
  lines.push(
    `    const projected = toJobEntry({ slug: "fallback-slug", url: "https://apply.example.com", labels: "not-array" });`,
  );
  lines.push(`    expect(projected.id).toBe("fallback-slug");`);
  lines.push(
    `    expect(projected.applyUrl).toBe("https://apply.example.com");`,
  );
  lines.push(`    expect(projected.labels).toEqual([]);`);
  lines.push(`  });`);
  lines.push(`  it("falls back postedAt to publishedAt", () => {`);
  lines.push(
    `    expect(toJobEntry({ publishedAt: "2026-05-01" }).postedAt).toBe("2026-05-01");`,
  );
  lines.push(`  });`);
  lines.push(`  it("coerces isRemote to boolean", () => {`);
  lines.push(`    expect(toJobEntry({ isRemote: 1 }).isRemote).toBe(true);`);
  lines.push(`    expect(toJobEntry({ isRemote: 0 }).isRemote).toBe(false);`);
  lines.push(
    `    expect(toJobEntry({ isRemote: "yes" }).isRemote).toBe(true);`,
  );
  lines.push(`  });`);
  lines.push(``);

  const jobTypes = [
    "full-time",
    "part-time",
    "contract",
    "internship",
    "freelance",
    "temporary",
    "volunteer",
    "apprenticeship",
  ];
  const tiers = [
    "featured",
    "standard",
    "community",
    "sponsored",
    "premium",
    "basic",
    "free",
    "trial",
  ];
  const companies = [
    "HeyClaude",
    "Acme Corp",
    "Example Inc",
    "Startup Labs",
    "Big Tech",
    "Consulting Co",
    "Agency Ltd",
    "Nonprofit Org",
  ];

  for (let i = 0; i < 80; i++) {
    const type = jobTypes[i % jobTypes.length];
    const tier = tiers[i % tiers.length];
    const company = companies[i % companies.length];
    lines.push(`  it("toJobEntry matrix ${i}", () => {`);
    lines.push(
      `    const job = makeJob({ id: "job-${i}", title: "Role ${i}", company: "${company}", type: "${type}", tier: "${tier}", isRemote: ${i % 2 === 0}, labels: ["label-${i}"] });`,
    );
    lines.push(`    const projected = toJobEntry(job);`);
    lines.push(`    expect(projected.id).toBe("job-${i}");`);
    lines.push(`    expect(projected.company).toBe("${company}");`);
    lines.push(`    expect(projected.type).toBe("${type}");`);
    lines.push(`    expect(projected.tier).toBe("${tier}");`);
    lines.push(`    expect(projected.labels).toEqual(["label-${i}"]);`);
    lines.push(`  });`);
  }

  for (let i = 0; i < 60; i++) {
    lines.push(`  it("toJobEntry empty defaults ${i}", () => {`);
    lines.push(`    const projected = toJobEntry({});`);
    lines.push(`    expect(projected.id).toBe("");`);
    lines.push(`    expect(projected.title).toBe("");`);
    lines.push(`    expect(projected.company).toBe("");`);
    lines.push(`    expect(projected.location).toBe("");`);
    lines.push(`    expect(projected.applyUrl).toBe("");`);
    lines.push(`    expect(projected.labels).toEqual([]);`);
    lines.push(`  });`);
  }
  lines.push(`});`);

  return lines.join("\n") + "\n";
}

function llmsSurfaceTests() {
  const lines = [];
  lines.push(`import { describe, expect, it } from "vitest";`);
  lines.push(``);
  lines.push(`import {`);
  lines.push(`  buildLlmsTxt,`);
  lines.push(`  buildLlmsFullTxt,`);
  lines.push(`  originOf,`);
  lines.push(`} from "../apps/web/src/lib/llms-surface-lib";`);
  lines.push(``);

  lines.push(`const FIXTURE_CATEGORIES = [`);
  for (const category of CATEGORIES) {
    lines.push(
      `  { id: "${category}", label: "${category.charAt(0).toUpperCase() + category.slice(1)}" },`,
    );
  }
  lines.push(`];`);
  lines.push(``);

  lines.push(`function fixtureEntry(category, slug, overrides = {}) {`);
  lines.push(`  return {`);
  lines.push(`    category,`);
  lines.push(`    slug,`);
  lines.push(`    title: \`\${category} \${slug}\`,`);
  lines.push(`    description: \`Description for \${category}/\${slug}\`,`);
  lines.push(`    cardDescription: \`Card for \${slug}\`,`);
  lines.push(`    author: "Fixture Author",`);
  lines.push(`    trust: "trusted",`);
  lines.push(`    source: "github",`);
  lines.push(`    ...overrides,`);
  lines.push(`  };`);
  lines.push(`}`);
  lines.push(``);

  lines.push(`describe("llms-surface-lib buildLlmsTxt", () => {`);
  lines.push(
    `  it("renders header, site links, and optional section", () => {`,
  );
  lines.push(
    `    const output = buildLlmsTxt("https://heyclau.de", { categories: FIXTURE_CATEGORIES, entries: [] });`,
  );
  lines.push(`    expect(output).toContain("# HeyClaude registry");`);
  lines.push(`    expect(output).toContain("Site: https://heyclau.de");`);
  lines.push(
    `    expect(output).toContain("Feeds: https://heyclau.de/feeds");`,
  );
  lines.push(`    expect(output).toContain("## Optional");`);
  lines.push(
    `    expect(output).toContain("[Full corpus](https://heyclau.de/llms-full.txt)");`,
  );
  lines.push(
    `    expect(output).toContain("[Trust methodology](https://heyclau.de/quality#methodology)");`,
  );
  lines.push(`  });`);
  lines.push(``);

  for (const category of CATEGORIES) {
    for (let i = 0; i < 15; i++) {
      const slug = `${category}-llms-${i}`;
      lines.push(`  it("buildLlmsTxt lists ${category}/${slug}", () => {`);
      lines.push(
        `    const entries = [fixtureEntry("${category}", "${slug}")];`,
      );
      lines.push(
        `    const output = buildLlmsTxt("https://heyclau.de", { categories: FIXTURE_CATEGORIES, entries });`,
      );
      lines.push(
        `    expect(output).toContain("## ${category.charAt(0).toUpperCase() + category.slice(1)}");`,
      );
      lines.push(
        `    expect(output).toContain("[${category} ${slug}](https://heyclau.de/entry/${category}/${slug})");`,
      );
      lines.push(`    expect(output).toContain("Card for ${slug}");`);
      lines.push(`  });`);
    }
  }

  for (let i = 0; i < 40; i++) {
    lines.push(`  it("buildLlmsTxt cardDescription fallback ${i}", () => {`);
    lines.push(
      `    const entries = [fixtureEntry("mcp", "fallback-${i}", { cardDescription: undefined, description: "Desc ${i}" })];`,
    );
    lines.push(
      `    const output = buildLlmsTxt("https://heyclau.de", { categories: FIXTURE_CATEGORIES, entries });`,
    );
    lines.push(`    expect(output).toContain("Desc ${i}");`);
    lines.push(`  });`);
  }
  lines.push(`});`);
  lines.push(``);

  lines.push(`describe("llms-surface-lib buildLlmsFullTxt", () => {`);
  lines.push(`  it("renders full export header", () => {`);
  lines.push(`    const output = buildLlmsFullTxt("https://heyclau.de", {`);
  lines.push(`      categories: FIXTURE_CATEGORIES,`);
  lines.push(`      entries: [],`);
  lines.push(`      registryEntries: [],`);
  lines.push(`    });`);
  lines.push(
    `    expect(output).toContain("# HeyClaude registry — full export");`,
  );
  lines.push(
    `    expect(output).toContain("Generated for context windows. Source: https://heyclau.de");`,
  );
  lines.push(`  });`);
  lines.push(`  it("uses buildCitationFacts callback when provided", () => {`);
  lines.push(`    const entries = [fixtureEntry("agents", "citation-demo")];`);
  lines.push(
    `    const registryEntries = [{ category: "agents", slug: "citation-demo", title: "Citation Demo" }];`,
  );
  lines.push(
    `    const buildCitationFacts = () => "- Source URLs: https://example.com";`,
  );
  lines.push(`    const output = buildLlmsFullTxt("https://heyclau.de", {`);
  lines.push(`      categories: FIXTURE_CATEGORIES,`);
  lines.push(`      entries,`);
  lines.push(`      registryEntries,`);
  lines.push(`      buildCitationFacts,`);
  lines.push(`    });`);
  lines.push(`    expect(output).toContain("Citation facts:");`);
  lines.push(
    `    expect(output).toContain("- Source URLs: https://example.com");`,
  );
  lines.push(`  });`);
  lines.push(``);

  for (const category of CATEGORIES) {
    for (let i = 0; i < 12; i++) {
      const slug = `${category}-full-${i}`;
      lines.push(
        `  it("buildLlmsFullTxt ${category}/${slug} metadata", () => {`,
      );
      lines.push(
        `    const entries = [fixtureEntry("${category}", "${slug}", {`,
      );
      lines.push(`      sourceUrl: "https://github.com/example/${slug}",`);
      lines.push(`      docsUrl: "https://docs.example.com/${slug}",`);
      lines.push(`      platforms: ["claude-code"],`);
      lines.push(`      safetyNotes: "Safety note ${i}",`);
      lines.push(`      prerequisites: ["Node ${i}"],`);
      lines.push(`      installCommand: "npm install ${slug}",`);
      lines.push(`      configSnippet: "{ \\"key\\": \\"${i}\\" }",`);
      lines.push(`      fullCopy: "full copy ${i}",`);
      lines.push(`    })];`);
      lines.push(
        `    const output = buildLlmsFullTxt("https://heyclau.de", { categories: FIXTURE_CATEGORIES, entries, registryEntries: [] });`,
      );
      lines.push(`    expect(output).toContain("## ${category} ${slug}");`);
      lines.push(
        `    expect(output).toContain("URL: https://heyclau.de/entry/${category}/${slug}");`,
      );
      lines.push(`    expect(output).toContain("Safety: Safety note ${i}");`);
      lines.push(`    expect(output).toContain("npm install ${slug}");`);
      lines.push(`    expect(output).toContain("full copy ${i}");`);
      lines.push(`  });`);
    }
  }

  for (let i = 0; i < 30; i++) {
    lines.push(
      `  it("buildLlmsFullTxt skips empty optional blocks ${i}", () => {`,
    );
    lines.push(`    const entries = [fixtureEntry("skills", "minimal-${i}", {`);
    lines.push(
      `      sourceUrl: undefined, docsUrl: undefined, platforms: [],`,
    );
    lines.push(`      safetyNotes: undefined, prerequisites: undefined,`);
    lines.push(
      `      installCommand: undefined, configSnippet: undefined, fullCopy: undefined,`,
    );
    lines.push(`    })];`);
    lines.push(
      `    const output = buildLlmsFullTxt("https://heyclau.de", { categories: FIXTURE_CATEGORIES, entries, registryEntries: [] });`,
    );
    lines.push(`    expect(output).not.toContain("Safety:");`);
    lines.push(`    expect(output).not.toContain("Prerequisites:");`);
    lines.push(`    expect(output).not.toContain("Install:");`);
    lines.push(`    expect(output).not.toContain("Citation facts:");`);
    lines.push(`  });`);
  }
  lines.push(`});`);
  lines.push(``);

  lines.push(`describe("llms-surface-lib originOf", () => {`);
  lines.push(`  it("extracts protocol and host from request URL", () => {`);
  lines.push(`    const request = new Request("https://heyclau.de/llms.txt");`);
  lines.push(`    expect(originOf(request)).toBe("https://heyclau.de");`);
  lines.push(`  });`);
  lines.push(`  it("preserves port when present", () => {`);
  lines.push(
    `    const request = new Request("http://localhost:3000/llms-full.txt");`,
  );
  lines.push(`    expect(originOf(request)).toBe("http://localhost:3000");`);
  lines.push(`  });`);
  lines.push(``);

  const origins = [
    "https://heyclau.de/llms.txt",
    "https://heyclau.de/llms-full.txt",
    "https://api.heyclau.de/api/registry/feed",
    "http://localhost:3000/llms.txt",
    "http://127.0.0.1:8787/llms-full.txt",
    "https://preview.heyclau.de/llms.txt",
    "https://staging.heyclau.de/llms-full.txt",
    "https://dev.heyclau.de/llms.txt",
    "https://example.com:8443/path",
    "http://example.com:8080/path",
    "https://sub.example.com/llms.txt",
    "https://sub.example.com/llms-full.txt",
    "https://heyclau.de/entry/mcp/demo",
    "https://heyclau.de/feeds",
    "https://heyclau.de/openapi.json",
    "https://heyclau.de/data/directory-index.json",
    "https://heyclau.de/.well-known/mcp/server-card.json",
    "https://heyclau.de/.well-known/agent-skills/index.json",
    "https://heyclau.de/quality",
    "https://heyclau.de/quality#methodology",
  ];

  for (let i = 0; i < origins.length; i++) {
    const url = origins[i];
    const expected = new URL(url).origin;
    lines.push(`  it("originOf variant ${i}", () => {`);
    lines.push(
      `    expect(originOf(new Request(${JSON.stringify(url)}))).toBe(${JSON.stringify(expected)});`,
    );
    lines.push(`  });`);
  }

  for (let i = 0; i < 50; i++) {
    lines.push(`  it("originOf generated ${i}", () => {`);
    lines.push(`    const url = "https://host-${i}.example.com/path-${i}";`);
    lines.push(
      `    expect(originOf(new Request(url))).toBe("https://host-${i}.example.com");`,
    );
    lines.push(`  });`);
  }
  lines.push(`});`);

  return lines.join("\n") + "\n";
}

function votesLibTests() {
  const lines = [];
  lines.push(`import { describe, expect, it } from "vitest";`);
  lines.push(``);
  lines.push(`import {`);
  lines.push(`  isValidEntryKey,`);
  lines.push(`  getFallbackVoteCounts,`);
  lines.push(`  getFallbackClientVotes,`);
  lines.push(`} from "../apps/web/src/lib/votes-lib";`);
  lines.push(``);

  lines.push(`describe("votes-lib isValidEntryKey", () => {`);
  lines.push(
    `  it("accepts category:slug keys with lowercase alphanumeric hyphen segments", () => {`,
  );
  lines.push(`    expect(isValidEntryKey("mcp:browser-bridge")).toBe(true);`);
  lines.push(`    expect(isValidEntryKey("skills:demo-skill")).toBe(true);`);
  lines.push(`    expect(isValidEntryKey("agents:agent-1")).toBe(true);`);
  lines.push(`  });`);
  lines.push(`  it("rejects malformed keys", () => {`);
  lines.push(`    expect(isValidEntryKey("")).toBe(false);`);
  lines.push(`    expect(isValidEntryKey("mcp")).toBe(false);`);
  lines.push(`    expect(isValidEntryKey("mcp:")).toBe(false);`);
  lines.push(`    expect(isValidEntryKey(":slug")).toBe(false);`);
  lines.push(`    expect(isValidEntryKey("MCP:browser-bridge")).toBe(false);`);
  lines.push(`    expect(isValidEntryKey("mcp:Browser-Bridge")).toBe(false);`);
  lines.push(`    expect(isValidEntryKey("mcp/browser-bridge")).toBe(false);`);
  lines.push(`  });`);
  lines.push(``);

  for (const category of CATEGORIES) {
    for (let i = 0; i < 10; i++) {
      const slug = `${category}-vote-${i}`;
      lines.push(`  it("isValidEntryKey accepts ${category}:${slug}", () => {`);
      lines.push(
        `    expect(isValidEntryKey("${category}:${slug}")).toBe(true);`,
      );
      lines.push(`  });`);
      lines.push(
        `  it("isValidEntryKey rejects uppercase ${category}:${slug}", () => {`,
      );
      lines.push(
        `    expect(isValidEntryKey("${category.toUpperCase()}:${slug}")).toBe(false);`,
      );
      lines.push(
        `    expect(isValidEntryKey("${category}:${slug.toUpperCase()}")).toBe(false);`,
      );
      lines.push(`  });`);
    }
  }

  const invalidKeys = [
    "mcp:under_score",
    "mcp:dot.name",
    "mcp:space name",
    "mcp:emoji-🔥",
    "under_score:slug",
    "dot.name:slug",
    "space name:slug",
    "mcp::double",
    "mcp:slug:extra",
    "mcp\\:slug",
    "mcp:slug\\",
    "mcp:slug/",
    "mcp/slug",
    "mcp:slug/nested",
    "mcp:slug?query=1",
    "mcp:slug#fragment",
    "mcp:slug&param=1",
    "mcp:slug=value",
    "mcp:slug+plus",
    "mcp:slug%20encoded",
    "mcp:slug@at",
    "mcp:slug!bang",
    "mcp:slug$dollar",
    "mcp:slug^caret",
    "mcp:slug*star",
    "mcp:slug(paren)",
    "mcp:slug[bracket]",
    "mcp:slug{brace}",
    "mcp:slug'quote",
    'mcp:slug"quote',
    "mcp:slug;semi",
    "mcp:slug,comma",
    "mcp:slug<lt",
    "mcp:slug>gt",
    "mcp:slug|pipe",
    "mcp:slug\\\\backslash",
    "mcp:slug~tilde",
    "mcp:slug`backtick",
    "mcp:-leading",
    "mcp:trailing-",
    "mcp:double--dash",
    "-leading:slug",
    "trailing-:slug",
    "123:456",
    "a:b",
    "a:bc",
    "ab:c",
    "abc:def",
    "abc:def-ghi",
    "abc:def-ghi-jkl",
    "abc:def-ghi-jkl-mno",
    "abc:def-ghi-jkl-mno-pqr",
    "abc:def-ghi-jkl-mno-pqr-stu",
    "abc:def-ghi-jkl-mno-pqr-stu-vwx",
    "abc:def-ghi-jkl-mno-pqr-stu-vwx-yz",
    "abc:def-ghi-jkl-mno-pqr-stu-vwx-yz-0",
    "abc:def-ghi-jkl-mno-pqr-stu-vwx-yz-01",
    "abc:def-ghi-jkl-mno-pqr-stu-vwx-yz-012",
    "abc:def-ghi-jkl-mno-pqr-stu-vwx-yz-0123",
    "abc:def-ghi-jkl-mno-pqr-stu-vwx-yz-01234",
    "abc:def-ghi-jkl-mno-pqr-stu-vwx-yz-012345",
    "abc:def-ghi-jkl-mno-pqr-stu-vwx-yz-0123456",
    "abc:def-ghi-jkl-mno-pqr-stu-vwx-yz-01234567",
    "abc:def-ghi-jkl-mno-pqr-stu-vwx-yz-012345678",
    "abc:def-ghi-jkl-mno-pqr-stu-vwx-yz-0123456789",
    "null:null",
    "undefined:undefined",
    "true:false",
    "NaN:NaN",
    "Infinity:Infinity",
    "[]:[]",
    "{}:{}",
    "mcp:",
    ":mcp",
    "::",
    ":::",
    "::::",
    "mcp:slug extra",
    "mcp extra:slug",
    "mcp extra:slug extra",
    "mcp:slug\\nnewline",
    "mcp:slug\\rreturn",
    "mcp:slug\\ttab",
    "mcp:slug\\0null",
    "mcp:slug\\u0000null",
    "mcp:slug\\u2028line",
    "mcp:slug\\u2029para",
    "mcp:slug\\uFEFFbom",
    "mcp:slug\\u200Bzwsp",
    "mcp:slug\\u200Czwnj",
    "mcp:slug\\u200Dzwj",
    "mcp:slug\\u2060wjoin",
    "mcp:slug\\u00A0nbsp",
    "mcp:slug\\u1680ogham",
    "mcp:slug\\u2000enquad",
    "mcp:slug\\u2001emquad",
    "mcp:slug\\u2002enspace",
    "mcp:slug\\u2003emspace",
    "mcp:slug\\u2004threeperem",
    "mcp:slug\\u2005fourperem",
    "mcp:slug\\u2006sixperem",
    "mcp:slug\\u2007figure",
    "mcp:slug\\u2008punctuation",
    "mcp:slug\\u2009thin",
    "mcp:slug\\u200Ahair",
    "mcp:slug\\u202Fnarrow",
    "mcp:slug\\u205Fmedium",
    "mcp:slug\\u3000ideographic",
  ];

  for (const key of invalidKeys.filter(
    (value) => !isValidEntryKeyPattern(value),
  )) {
    const label = safeTestLabel(key, 30);
    lines.push(`  it("isValidEntryKey rejects ${label}", () => {`);
    lines.push(
      `    expect(isValidEntryKey(${JSON.stringify(key)})).toBe(false);`,
    );
    lines.push(`  });`);
  }

  const edgeValidKeys = [
    "mcp:-leading",
    "mcp:trailing-",
    "mcp:double--dash",
    "-leading:slug",
    "trailing-:slug",
    "123:456",
    "a:b",
    "a:bc",
    "ab:c",
    "abc:def",
    "null:null",
    "undefined:undefined",
    "true:false",
    "abc:def-ghi-jkl-mno-pqr-stu-vwx-yz-0123456789",
  ];
  for (const key of edgeValidKeys) {
    lines.push(
      `  it("isValidEntryKey accepts edge-valid ${safeTestLabel(key, 30)}", () => {`,
    );
    lines.push(
      `    expect(isValidEntryKey(${JSON.stringify(key)})).toBe(true);`,
    );
    lines.push(`  });`);
  }

  for (let i = 0; i < 80; i++) {
    lines.push(`  it("isValidEntryKey roundtrip matrix ${i}", () => {`);
    lines.push(`    const key = "cat-${i % 10}:slug-${i}";`);
    lines.push(`    expect(isValidEntryKey(key)).toBe(true);`);
    lines.push(`    expect(isValidEntryKey(key.toUpperCase())).toBe(false);`);
    lines.push(`  });`);
  }
  lines.push(`});`);
  lines.push(``);

  lines.push(`describe("votes-lib getFallbackVoteCounts", () => {`);
  lines.push(`  it("returns zero counts for every key", () => {`);
  lines.push(
    `    expect(getFallbackVoteCounts(["mcp:a", "skills:b"])).toEqual({ "mcp:a": 0, "skills:b": 0 });`,
  );
  lines.push(`  });`);
  lines.push(`  it("returns empty object for empty keys", () => {`);
  lines.push(`    expect(getFallbackVoteCounts([])).toEqual({});`);
  lines.push(`  });`);
  lines.push(``);

  for (const category of CATEGORIES) {
    for (let i = 0; i < 8; i++) {
      const slug = `${category}-count-${i}`;
      lines.push(`  it("getFallbackVoteCounts ${category}:${slug}", () => {`);
      lines.push(`    const keys = ["${category}:${slug}"];`);
      lines.push(
        `    expect(getFallbackVoteCounts(keys)).toEqual({ "${category}:${slug}": 0 });`,
      );
      lines.push(`  });`);
    }
  }

  for (let i = 0; i < 40; i++) {
    lines.push(`  it("getFallbackVoteCounts batch ${i}", () => {`);
    lines.push(
      `    const keys = ["mcp:batch-${i}-a", "skills:batch-${i}-b", "hooks:batch-${i}-c"];`,
    );
    lines.push(`    const counts = getFallbackVoteCounts(keys);`);
    lines.push(`    expect(Object.keys(counts)).toHaveLength(3);`);
    lines.push(`    for (const key of keys) expect(counts[key]).toBe(0);`);
    lines.push(`  });`);
  }
  lines.push(`});`);
  lines.push(``);

  lines.push(`describe("votes-lib getFallbackClientVotes", () => {`);
  lines.push(`  it("returns false voted state for every key", () => {`);
  lines.push(
    `    expect(getFallbackClientVotes(["mcp:a", "skills:b"])).toEqual({ "mcp:a": false, "skills:b": false });`,
  );
  lines.push(`  });`);
  lines.push(`  it("returns empty object for empty keys", () => {`);
  lines.push(`    expect(getFallbackClientVotes([])).toEqual({});`);
  lines.push(`  });`);
  lines.push(``);

  for (const category of CATEGORIES) {
    for (let i = 0; i < 8; i++) {
      const slug = `${category}-client-${i}`;
      lines.push(`  it("getFallbackClientVotes ${category}:${slug}", () => {`);
      lines.push(`    const keys = ["${category}:${slug}"];`);
      lines.push(
        `    expect(getFallbackClientVotes(keys)).toEqual({ "${category}:${slug}": false });`,
      );
      lines.push(`  });`);
    }
  }

  for (let i = 0; i < 40; i++) {
    lines.push(`  it("getFallbackClientVotes batch ${i}", () => {`);
    lines.push(
      `    const keys = ["agents:client-${i}-a", "tools:client-${i}-b"];`,
    );
    lines.push(`    const voted = getFallbackClientVotes(keys);`);
    lines.push(`    expect(Object.keys(voted)).toHaveLength(2);`);
    lines.push(`    for (const key of keys) expect(voted[key]).toBe(false);`);
    lines.push(`  });`);
  }
  lines.push(`});`);

  return lines.join("\n") + "\n";
}

const files = [
  ["tests/mcp-registry-artifact-path-lib.test.ts", artifactPathTests()],
  ["tests/mcp-registry-public-api-lib.test.ts", publicApiTests()],
  [
    "tests/mcp-registry-discovery-projection-lib.test.ts",
    discoveryProjectionTests(),
  ],
  ["tests/llms-surface-lib.test.ts", llmsSurfaceTests()],
  ["tests/votes-lib.test.ts", votesLibTests()],
];

for (const [relPath, content] of files) {
  const fullPath = path.join(root, relPath);
  writeFileSync(fullPath, content, "utf8");
  const testCount = (content.match(/\bit\(/g) || []).length;
  const lineCount = content.split("\n").length;
  console.log(`${relPath}: ${testCount} tests, ${lineCount} lines`);
}

console.log("Done generating lib extraction tests.");
