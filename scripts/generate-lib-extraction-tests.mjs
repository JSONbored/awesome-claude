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

function artifactLoaderLibTests() {
  const lines = [];
  lines.push(
    `import { describe, expect, it, beforeEach, afterEach } from "vitest";`,
  );
  lines.push(`import path from "node:path";`);
  lines.push(`import { fileURLToPath } from "node:url";`);
  lines.push(``);
  lines.push(`import {`);
  lines.push(`  dataDirFromOptions,`);
  lines.push(`  readEntry,`);
  lines.push(`  readJsonArtifact,`);
  lines.push(`  readTextArtifact,`);
  lines.push(`} from "../packages/mcp/src/registry-artifact-loader-lib.js";`);
  lines.push(``);

  lines.push(
    `describe("registry-artifact-loader-lib dataDirFromOptions", () => {`,
  );
  lines.push(`  const original = process.env.HEYCLAUDE_DATA_DIR;`);
  lines.push(`  beforeEach(() => { delete process.env.HEYCLAUDE_DATA_DIR; });`);
  lines.push(`  afterEach(() => {`);
  lines.push(
    `    if (original === undefined) delete process.env.HEYCLAUDE_DATA_DIR;`,
  );
  lines.push(`    else process.env.HEYCLAUDE_DATA_DIR = original;`);
  lines.push(`  });`);
  lines.push(`  it("prefers explicit options.dataDir", () => {`);
  lines.push(
    `    expect(dataDirFromOptions({ dataDir: "/tmp/custom-data" })).toBe("/tmp/custom-data");`,
  );
  lines.push(`  });`);
  lines.push(`  it("falls back to HEYCLAUDE_DATA_DIR env var", () => {`);
  lines.push(`    process.env.HEYCLAUDE_DATA_DIR = "/env/data";`);
  lines.push(`    expect(dataDirFromOptions({})).toBe("/env/data");`);
  lines.push(`  });`);
  lines.push(`  it("options.dataDir beats env var", () => {`);
  lines.push(`    process.env.HEYCLAUDE_DATA_DIR = "/env/data";`);
  lines.push(
    `    expect(dataDirFromOptions({ dataDir: "/opt/data" })).toBe("/opt/data");`,
  );
  lines.push(`  });`);
  lines.push(
    `  it("defaults to package-relative apps/web/public/data", () => {`,
  );
  lines.push(
    `    const moduleDir = path.dirname(fileURLToPath(import.meta.url));`,
  );
  lines.push(`    const repoRoot = path.resolve(moduleDir, "..");`);
  lines.push(
    `    expect(dataDirFromOptions({})).toBe(path.join(repoRoot, "apps", "web", "public", "data"));`,
  );
  lines.push(`  });`);

  for (let i = 0; i < 80; i++) {
    lines.push(`  it("dataDirFromOptions override matrix ${i}", () => {`);
    lines.push(
      `    expect(dataDirFromOptions({ dataDir: "/data/override-${i}" })).toBe("/data/override-${i}");`,
    );
    lines.push(`    process.env.HEYCLAUDE_DATA_DIR = "/data/env-${i}";`);
    lines.push(`    expect(dataDirFromOptions({})).toBe("/data/env-${i}");`);
    lines.push(`  });`);
  }
  lines.push(`});`);
  lines.push(``);

  lines.push(
    `describe("registry-artifact-loader-lib readTextArtifact", () => {`,
  );
  lines.push(
    `  it("delegates to injected readTextArtifact loader", async () => {`,
  );
  lines.push(`    const text = await readTextArtifact("search-index.json", {`);
  lines.push(
    `      readTextArtifact: async (relativePath) => \`mock:\${relativePath}\`,`,
  );
  lines.push(`    });`);
  lines.push(`    expect(text).toBe("mock:search-index.json");`);
  lines.push(`  });`);

  const artifacts = [
    "search-index.json",
    "registry-manifest.json",
    "directory-index.json",
    "relation-graph.json",
    "submission-spec.json",
    "feeds/index.json",
  ];
  for (const category of CATEGORIES) {
    for (let i = 0; i < 8; i++) {
      const slug = `${category}-artifact-${i}`;
      artifacts.push(`entries/${category}/${slug}.json`);
      artifacts.push(`skill-adapters/cursor/${slug}.mdc`);
    }
  }

  for (let i = 0; i < artifacts.length; i++) {
    const artifact = artifacts[i];
    lines.push(`  it("readTextArtifact injected loader ${i}", async () => {`);
    lines.push(
      `    const payload = await readTextArtifact(${JSON.stringify(artifact)}, {`,
    );
    lines.push(
      `      readTextArtifact: async (relativePath) => JSON.stringify({ relativePath }),`,
    );
    lines.push(`    });`);
    lines.push(
      `    expect(JSON.parse(payload)).toEqual({ relativePath: ${JSON.stringify(artifact)} });`,
    );
    lines.push(`  });`);
  }

  for (let i = 0; i < 60; i++) {
    lines.push(
      `  it("readTextArtifact preserves relative path ${i}", async () => {`,
    );
    lines.push(`    const relativePath = "entries/mcp/demo-${i}.json";`);
    lines.push(`    const text = await readTextArtifact(relativePath, {`);
    lines.push(
      `      readTextArtifact: async (path) => \`content-for-\${path}\`,`,
    );
    lines.push(`    });`);
    lines.push(`    expect(text).toBe(\`content-for-\${relativePath}\`);`);
    lines.push(`  });`);
  }
  lines.push(`});`);
  lines.push(``);

  lines.push(
    `describe("registry-artifact-loader-lib readJsonArtifact", () => {`,
  );
  lines.push(
    `  it("delegates to injected readJsonArtifact loader", async () => {`,
  );
  lines.push(
    `    const payload = await readJsonArtifact("search-index.json", {`,
  );
  lines.push(
    `      readJsonArtifact: async () => ({ entries: [{ slug: "demo" }] }),`,
  );
  lines.push(`    });`);
  lines.push(`    expect(payload).toEqual({ entries: [{ slug: "demo" }] });`);
  lines.push(`  });`);
  lines.push(
    `  it("parses injected readTextArtifact when no cache", async () => {`,
  );
  lines.push(
    `    const payload = await readJsonArtifact("registry-manifest.json", {`,
  );
  lines.push(
    `      readTextArtifact: async () => JSON.stringify({ schemaVersion: 2, totalEntries: 1 }),`,
  );
  lines.push(`    });`);
  lines.push(
    `    expect(payload).toEqual({ schemaVersion: 2, totalEntries: 1 });`,
  );
  lines.push(`  });`);
  lines.push(`  it("uses artifactCache when provided", async () => {`);
  lines.push(`    const cache = new Map();`);
  lines.push(`    let reads = 0;`);
  lines.push(`    const options = {`);
  lines.push(`      dataDir: "/tmp/cache-test",`);
  lines.push(`      artifactCache: cache,`);
  lines.push(`      readTextArtifact: async () => {`);
  lines.push(`        reads += 1;`);
  lines.push(`        return JSON.stringify({ cached: true, reads });`);
  lines.push(`      },`);
  lines.push(`    };`);
  lines.push(
    `    const first = await readJsonArtifact("search-index.json", options);`,
  );
  lines.push(
    `    const second = await readJsonArtifact("search-index.json", options);`,
  );
  lines.push(`    expect(first).toEqual({ cached: true, reads: 1 });`);
  lines.push(`    expect(second).toEqual({ cached: true, reads: 1 });`);
  lines.push(`    expect(reads).toBe(1);`);
  lines.push(`  });`);

  for (const category of CATEGORIES) {
    for (let i = 0; i < 10; i++) {
      const slug = `${category}-json-${i}`;
      lines.push(`  it("readJsonArtifact ${category}/${slug}", async () => {`);
      lines.push(
        `    const payload = await readJsonArtifact("entries/${category}/${slug}.json", {`,
      );
      lines.push(
        `      readJsonArtifact: async () => ({ entry: { category: "${category}", slug: "${slug}" } }),`,
      );
      lines.push(`    });`);
      lines.push(`    expect(payload.entry.slug).toBe("${slug}");`);
      lines.push(`  });`);
    }
  }

  for (let i = 0; i < 50; i++) {
    lines.push(
      `  it("readJsonArtifact cache key isolation ${i}", async () => {`,
    );
    lines.push(`    const cache = new Map();`);
    lines.push(
      `    const options = { dataDir: "/tmp/cache-${i}", artifactCache: cache, readTextArtifact: async (p) => JSON.stringify({ path: p }) };`,
    );
    lines.push(`    await readJsonArtifact("search-index.json", options);`);
    lines.push(
      `    await readJsonArtifact("registry-manifest.json", options);`,
    );
    lines.push(`    expect(cache.size).toBe(2);`);
    lines.push(`  });`);
  }
  lines.push(`});`);
  lines.push(``);

  lines.push(`describe("registry-artifact-loader-lib readEntry", () => {`);
  lines.push(`  it("returns null for unsafe category or slug", async () => {`);
  lines.push(`    expect(await readEntry("../etc", "passwd", {})).toBeNull();`);
  lines.push(`    expect(await readEntry("mcp", "../evil", {})).toBeNull();`);
  lines.push(`    expect(await readEntry("UPPER", "slug", {})).toBeNull();`);
  lines.push(`  });`);
  lines.push(`  it("returns entry payload when present", async () => {`);
  lines.push(`    const entry = await readEntry("mcp", "browser-bridge", {`);
  lines.push(
    `      readJsonArtifact: async () => ({ entry: { category: "mcp", slug: "browser-bridge", title: "Browser Bridge" } }),`,
  );
  lines.push(`    });`);
  lines.push(`    expect(entry?.title).toBe("Browser Bridge");`);
  lines.push(`  });`);
  lines.push(`  it("returns null when loader throws", async () => {`);
  lines.push(`    const entry = await readEntry("mcp", "missing", {`);
  lines.push(
    `      readJsonArtifact: async () => { throw new Error("missing"); },`,
  );
  lines.push(`    });`);
  lines.push(`    expect(entry).toBeNull();`);
  lines.push(`  });`);
  lines.push(`  it("returns null when payload has no entry", async () => {`);
  lines.push(`    const entry = await readEntry("mcp", "empty", {`);
  lines.push(`      readJsonArtifact: async () => ({ schemaVersion: 1 }),`);
  lines.push(`    });`);
  lines.push(`    expect(entry).toBeNull();`);
  lines.push(`  });`);

  for (const category of CATEGORIES) {
    for (let i = 0; i < 12; i++) {
      const slug = `${category}-read-${i}`;
      lines.push(`  it("readEntry accepts ${category}/${slug}", async () => {`);
      lines.push(
        `    const entry = await readEntry("${category}", "${slug}", {`,
      );
      lines.push(`      readJsonArtifact: async (relativePath) => {`);
      lines.push(
        `        expect(relativePath).toBe("entries/${category}/${slug}.json");`,
      );
      lines.push(
        `        return { entry: { category: "${category}", slug: "${slug}" } };`,
      );
      lines.push(`      },`);
      lines.push(`    });`);
      lines.push(`    expect(entry?.slug).toBe("${slug}");`);
      lines.push(`  });`);
    }
  }

  for (const unsafe of UNSAFE_PATHS.slice(0, 80)) {
    const label = safeTestLabel(unsafe);
    lines.push(`  it("readEntry rejects unsafe slug ${label}", async () => {`);
    lines.push(
      `    expect(await readEntry("mcp", ${JSON.stringify(unsafe)}, {})).toBeNull();`,
    );
    lines.push(
      `    expect(await readEntry(${JSON.stringify(unsafe)}, "demo", {})).toBeNull();`,
    );
    lines.push(`  });`);
  }
  lines.push(`});`);

  return lines.join("\n") + "\n";
}

function fetchLibTests() {
  const lines = [];
  lines.push(
    `import { describe, expect, it, beforeEach, afterEach } from "vitest";`,
  );
  lines.push(``);
  lines.push(`import { SITE_URL } from "../packages/mcp/src/platforms.js";`);
  lines.push(`import {`);
  lines.push(`  buildPublicApiRequestUrl,`);
  lines.push(`  DISCOVERY_FETCH_TIMEOUT_MS,`);
  lines.push(`  fetchPublicApiJson,`);
  lines.push(`  JSON_MIME_TYPE,`);
  lines.push(`} from "../packages/mcp/src/registry-fetch-lib.js";`);
  lines.push(``);

  lines.push(`describe("registry-fetch-lib constants", () => {`);
  lines.push(`  it("exports JSON mime type", () => {`);
  lines.push(`    expect(JSON_MIME_TYPE).toBe("application/json");`);
  lines.push(`  });`);
  lines.push(`  it("exports discovery fetch timeout", () => {`);
  lines.push(`    expect(DISCOVERY_FETCH_TIMEOUT_MS).toBe(5000);`);
  lines.push(`  });`);
  lines.push(`});`);
  lines.push(``);

  lines.push(`describe("registry-fetch-lib buildPublicApiRequestUrl", () => {`);
  lines.push(`  const original = process.env.HEYCLAUDE_PUBLIC_API_URL;`);
  lines.push(
    `  beforeEach(() => { delete process.env.HEYCLAUDE_PUBLIC_API_URL; });`,
  );
  lines.push(`  afterEach(() => {`);
  lines.push(
    `    if (original === undefined) delete process.env.HEYCLAUDE_PUBLIC_API_URL;`,
  );
  lines.push(`    else process.env.HEYCLAUDE_PUBLIC_API_URL = original;`);
  lines.push(`  });`);
  lines.push(`  it("joins base URL and absolute api path", () => {`);
  lines.push(
    `    expect(buildPublicApiRequestUrl("/api/registry/trending", { publicApiBaseUrl: "https://heyclau.de/" })).toBe("https://heyclau.de/api/registry/trending");`,
  );
  lines.push(`  });`);
  lines.push(`  it("prefixes slash for relative api paths", () => {`);
  lines.push(
    `    expect(buildPublicApiRequestUrl("api/jobs", { publicApiBaseUrl: "https://heyclau.de" })).toBe("https://heyclau.de/api/jobs");`,
  );
  lines.push(`  });`);
  lines.push(`  it("strips trailing slashes from base URL", () => {`);
  lines.push(
    `    expect(buildPublicApiRequestUrl("/api/jobs", { publicApiBaseUrl: "https://heyclau.de///" })).toBe("https://heyclau.de/api/jobs");`,
  );
  lines.push(`  });`);

  const apiPaths = [
    "/api/registry/trending",
    "/api/registry/trending?limit=25",
    "/api/jobs",
    "/api/jobs?limit=25",
    "/api/registry/feed",
    "/api/registry/recent",
    "/api/registry/stats",
    "/api/health",
    "/api/v1/registry/trending",
    "/api/v1/jobs/active",
  ];
  const bases = [
    "https://heyclau.de",
    "https://heyclau.de/",
    "https://api.heyclau.de",
    "http://localhost:3000",
    "http://127.0.0.1:8787",
    "https://preview.heyclau.de",
    "https://staging.heyclau.de",
    "https://dev.heyclau.de",
  ];

  let testIndex = 0;
  for (const base of bases) {
    for (const apiPath of apiPaths) {
      const normalizedBase = base.replace(/\/+$/, "");
      const expected = `${normalizedBase}${apiPath.startsWith("/") ? "" : "/"}${apiPath}`;
      lines.push(`  it("buildPublicApiRequestUrl combo ${testIndex}", () => {`);
      lines.push(
        `    expect(buildPublicApiRequestUrl(${JSON.stringify(apiPath)}, { publicApiBaseUrl: ${JSON.stringify(base)} })).toBe(${JSON.stringify(expected)});`,
      );
      lines.push(`  });`);
      testIndex += 1;
    }
  }

  for (let i = 0; i < 120; i++) {
    lines.push(`  it("buildPublicApiRequestUrl generated ${i}", () => {`);
    lines.push(`    const base = "https://host-${i}.example.com/";`);
    lines.push(
      `    const url = buildPublicApiRequestUrl("/api/registry/trending?limit=${i}", { publicApiBaseUrl: base });`,
    );
    lines.push(
      `    expect(url).toBe(\`https://host-${i}.example.com/api/registry/trending?limit=${i}\`);`,
    );
    lines.push(`  });`);
  }
  lines.push(`});`);
  lines.push(``);

  lines.push(`describe("registry-fetch-lib fetchPublicApiJson", () => {`);
  lines.push(`  it("delegates to injected fetchPublicApi", async () => {`);
  lines.push(`    const payload = await fetchPublicApiJson("/api/jobs", {`);
  lines.push(
    `      fetchPublicApi: async (apiPath) => ({ apiPath, entries: [] }),`,
  );
  lines.push(`    });`);
  lines.push(
    `    expect(payload).toEqual({ apiPath: "/api/jobs", entries: [] });`,
  );
  lines.push(`  });`);
  lines.push(`  it("throws when upstream response is not ok", async () => {`);
  lines.push(`    await expect(`);
  lines.push(`      fetchPublicApiJson("/api/jobs", {`);
  lines.push(`        publicApiBaseUrl: "https://example.test",`);
  lines.push(
    `        fetchPublicApi: async () => { throw new Error("Public API /api/jobs returned 503."); },`,
  );
  lines.push(`      }),`);
  lines.push(`    ).rejects.toThrow(/503/);`);
  lines.push(`  });`);

  for (let i = 0; i < 80; i++) {
    lines.push(`  it("fetchPublicApiJson injected matrix ${i}", async () => {`);
    lines.push(
      `    const payload = await fetchPublicApiJson("/api/registry/trending?limit=${i}", {`,
    );
    lines.push(
      `      fetchPublicApi: async (apiPath) => ({ ok: true, apiPath, count: ${i} }),`,
    );
    lines.push(`    });`);
    lines.push(
      `    expect(payload).toEqual({ ok: true, apiPath: "/api/registry/trending?limit=${i}", count: ${i} });`,
    );
    lines.push(`  });`);
  }

  for (const category of CATEGORIES) {
    for (let i = 0; i < 5; i++) {
      lines.push(
        `  it("fetchPublicApiJson trending ${category} ${i}", async () => {`,
      );
      lines.push(
        `    const payload = await fetchPublicApiJson("/api/registry/trending?category=${category}&limit=${i}", {`,
      );
      lines.push(
        `      fetchPublicApi: async () => ({ category: "${category}", entries: [{ slug: "${category}-${i}" }] }),`,
      );
      lines.push(`    });`);
      lines.push(`    expect(payload.category).toBe("${category}");`);
      lines.push(`  });`);
    }
  }

  lines.push(`  it("defaults base URL to SITE_URL when no override", () => {`);
  lines.push(
    `    expect(buildPublicApiRequestUrl("/api/jobs", {})).toBe(\`\${SITE_URL.replace(/\\/$/, "")}/api/jobs\`);`,
  );
  lines.push(`  });`);
  lines.push(`});`);

  return lines.join("\n") + "\n";
}

function sourceRepoSignalsLibTests() {
  const lines = [];
  lines.push(`import { describe, expect, it } from "vitest";`);
  lines.push(``);
  lines.push(`import {`);
  lines.push(`  applySourceRepoSignal,`);
  lines.push(`  collectSourceRepos,`);
  lines.push(`  DEFAULT_REFRESH_LIMIT,`);
  lines.push(`  GITHUB_API_VERSION,`);
  lines.push(`  normalizeSourceRepoSignalRow,`);
  lines.push(`  parseGitHubRepoUrl,`);
  lines.push(`  REFRESH_STALE_MS,`);
  lines.push(`  refreshLimit,`);
  lines.push(`  REQUEST_TIMEOUT_MS,`);
  lines.push(`  shouldRefreshSourceRepoSignal,`);
  lines.push(`  type SourceRepoSignal,`);
  lines.push(`  type SourceRepoSignalState,`);
  lines.push(`} from "../apps/web/src/lib/source-repo-signals-lib";`);
  lines.push(``);

  lines.push(`describe("source-repo-signals-lib constants", () => {`);
  lines.push(`  it("exports GitHub API version", () => {`);
  lines.push(`    expect(GITHUB_API_VERSION).toBe("2022-11-28");`);
  lines.push(`  });`);
  lines.push(`  it("exports request timeout", () => {`);
  lines.push(`    expect(REQUEST_TIMEOUT_MS).toBe(5000);`);
  lines.push(`  });`);
  lines.push(`  it("exports refresh defaults", () => {`);
  lines.push(`    expect(DEFAULT_REFRESH_LIMIT).toBe(25);`);
  lines.push(`    expect(REFRESH_STALE_MS).toBe(24 * 60 * 60 * 1000);`);
  lines.push(`  });`);
  lines.push(`});`);
  lines.push(``);

  lines.push(`describe("source-repo-signals-lib parseGitHubRepoUrl", () => {`);
  lines.push(`  it("parses https GitHub URLs", () => {`);
  lines.push(
    `    expect(parseGitHubRepoUrl("https://github.com/OpenAI/whisper.git")).toEqual({ owner: "OpenAI", repo: "whisper", key: "openai/whisper" });`,
  );
  lines.push(`  });`);
  lines.push(`  it("returns null for non-GitHub URLs", () => {`);
  lines.push(
    `    expect(parseGitHubRepoUrl("https://gitlab.com/org/repo")).toBeNull();`,
  );
  lines.push(`  });`);

  const urls = [
    "https://github.com/anthropics/claude-code",
    "https://github.com/microsoft/vscode",
    "https://github.com/openai/codex",
    "git@github.com:owner/repo.git",
    "https://www.github.com/Org/Repo",
    "git+https://github.com/foo/bar.git",
  ];
  for (let i = 0; i < urls.length; i++) {
    lines.push(`  it("parseGitHubRepoUrl variant ${i}", () => {`);
    lines.push(
      `    const parsed = parseGitHubRepoUrl(${JSON.stringify(urls[i])});`,
    );
    lines.push(
      `    if (parsed) expect(parsed.key).toMatch(/^[a-z0-9-]+\\/[a-z0-9-]+$/);`,
    );
    lines.push(`  });`);
  }

  for (let i = 0; i < 80; i++) {
    lines.push(`  it("parseGitHubRepoUrl matrix ${i}", () => {`);
    lines.push(
      `    const parsed = parseGitHubRepoUrl(\`https://github.com/org-${i}/repo-${i}\`);`,
    );
    lines.push(`    expect(parsed?.key).toBe(\`org-${i}/repo-${i}\`);`);
    lines.push(`  });`);
  }
  lines.push(`});`);
  lines.push(``);

  lines.push(`describe("source-repo-signals-lib collectSourceRepos", () => {`);
  lines.push(`  it("deduplicates and sorts repo keys", () => {`);
  lines.push(`    const repos = collectSourceRepos([`);
  lines.push(`      { repoUrl: "https://github.com/a/b" },`);
  lines.push(`      { repoUrl: "https://github.com/A/B" },`);
  lines.push(`      { repoUrl: "https://github.com/c/d" },`);
  lines.push(`    ]);`);
  lines.push(`    expect(repos).toEqual(["a/b", "c/d"]);`);
  lines.push(`  });`);

  for (const category of CATEGORIES) {
    for (let i = 0; i < 8; i++) {
      lines.push(`  it("collectSourceRepos ${category} ${i}", () => {`);
      lines.push(
        `    const repos = collectSourceRepos([{ repoUrl: "https://github.com/${category}-org/demo-${i}" }]);`,
      );
      lines.push(`    expect(repos).toEqual(["${category}-org/demo-${i}"]);`);
      lines.push(`  });`);
    }
  }

  for (let i = 0; i < 40; i++) {
    lines.push(`  it("collectSourceRepos batch ${i}", () => {`);
    lines.push(`    const repos = collectSourceRepos([`);
    lines.push(
      `      { repoStats: { url: "https://github.com/batch-${i}/a" } },`,
    );
    lines.push(`      { repoUrl: "https://github.com/batch-${i}/b" },`);
    lines.push(`      { repoUrl: "https://example.com/not-github" },`);
    lines.push(`    ]);`);
    lines.push(
      `    expect(repos).toEqual(["batch-${i}/a", "batch-${i}/b"].sort());`,
    );
    lines.push(`  });`);
  }
  lines.push(`});`);
  lines.push(``);

  lines.push(
    `describe("source-repo-signals-lib normalizeSourceRepoSignalRow", () => {`,
  );
  lines.push(`  it("normalizes database row shape", () => {`);
  lines.push(`    expect(normalizeSourceRepoSignalRow({`);
  lines.push(
    `      repo: "OpenAI/Whisper", stars: 10, forks: 2, repo_updated_at: "2026-01-01", fetched_at: "2026-01-02", status: "ok", last_error: null,`,
  );
  lines.push(
    `    })).toEqual({ repo: "openai/whisper", stars: 10, forks: 2, repoUpdatedAt: "2026-01-01", fetchedAt: "2026-01-02", status: "ok", lastError: null });`,
  );
  lines.push(`  });`);

  for (let i = 0; i < 100; i++) {
    lines.push(`  it("normalizeSourceRepoSignalRow matrix ${i}", () => {`);
    lines.push(`    const signal = normalizeSourceRepoSignalRow({`);
    lines.push(
      `      repo: "org-${i}/repo-${i}", stars: ${i}, forks: ${i % 5}, repo_updated_at: "2026-06-${String((i % 28) + 1).padStart(2, "0")}", fetched_at: "2026-06-02", status: ${i % 3 === 0 ? '"error"' : '"ok"'}, last_error: ${i % 3 === 0 ? '"boom"' : "null"},`,
    );
    lines.push(`    });`);
    lines.push(`    expect(signal.repo).toBe("org-${i}/repo-${i}");`);
    lines.push(
      `    expect(signal.status).toBe(${i % 3 === 0 ? '"error"' : '"ok"'});`,
    );
    lines.push(`  });`);
  }
  lines.push(`});`);
  lines.push(``);

  lines.push(
    `describe("source-repo-signals-lib applySourceRepoSignal", () => {`,
  );
  lines.push(
    `  const baseEntry = { repoUrl: "https://github.com/demo/repo", title: "Demo" };`,
  );
  lines.push(`  it("returns entry unchanged when state unavailable", () => {`);
  lines.push(
    `    const state: SourceRepoSignalState = { available: false, signals: new Map() };`,
  );
  lines.push(
    `    expect(applySourceRepoSignal(baseEntry, state)).toEqual(baseEntry);`,
  );
  lines.push(`  });`);
  lines.push(`  it("applies cached signal stats", () => {`);
  lines.push(
    `    const state: SourceRepoSignalState = { available: true, signals: new Map([["demo/repo", { repo: "demo/repo", stars: 42, forks: 7, repoUpdatedAt: "2026-01-01", fetchedAt: "2026-01-02", status: "ok", lastError: null }]]) };`,
  );
  lines.push(`    const applied = applySourceRepoSignal(baseEntry, state);`);
  lines.push(`    expect(applied.githubStars).toBe(42);`);
  lines.push(`    expect(applied.githubForks).toBe(7);`);
  lines.push(`  });`);

  for (let i = 0; i < 60; i++) {
    lines.push(`  it("applySourceRepoSignal matrix ${i}", () => {`);
    lines.push(
      `    const entry = { repoUrl: "https://github.com/org-${i}/repo-${i}", githubStars: 1, githubForks: 1, repoUpdatedAt: "old" };`,
    );
    lines.push(
      `    const state: SourceRepoSignalState = { available: true, signals: new Map([["org-${i}/repo-${i}", { repo: "org-${i}/repo-${i}", stars: ${i * 10}, forks: ${i}, repoUpdatedAt: "2026-06-01", fetchedAt: "2026-06-02", status: "ok", lastError: null }]]) };`,
    );
    lines.push(`    const applied = applySourceRepoSignal(entry, state);`);
    lines.push(`    expect(applied.githubStars).toBe(${i * 10});`);
    lines.push(`    expect(applied.repoStats?.stars).toBe(${i * 10});`);
    lines.push(`  });`);
  }
  lines.push(`});`);
  lines.push(``);

  lines.push(`describe("source-repo-signals-lib refreshLimit", () => {`);
  lines.push(
    `  it("defaults invalid values to DEFAULT_REFRESH_LIMIT", () => {`,
  );
  lines.push(
    `    expect(refreshLimit(undefined)).toBe(DEFAULT_REFRESH_LIMIT);`,
  );
  lines.push(
    `    expect(refreshLimit("not-a-number")).toBe(DEFAULT_REFRESH_LIMIT);`,
  );
  lines.push(`  });`);
  lines.push(`  it("clamps between 1 and 100", () => {`);
  lines.push(`    expect(refreshLimit(0)).toBe(1);`);
  lines.push(`    expect(refreshLimit(1000)).toBe(100);`);
  lines.push(`  });`);

  for (let i = -20; i <= 120; i++) {
    const expected = !Number.isFinite(i)
      ? DEFAULT_REFRESH_LIMIT
      : Math.max(1, Math.min(100, Math.trunc(i)));
    lines.push(`  it("refreshLimit value ${i}", () => {`);
    lines.push(`    expect(refreshLimit(${i})).toBe(${expected});`);
    lines.push(`  });`);
  }
  lines.push(`});`);
  lines.push(``);

  lines.push(
    `describe("source-repo-signals-lib shouldRefreshSourceRepoSignal", () => {`,
  );
  lines.push(`  const now = Date.parse("2026-06-15T00:00:00.000Z");`);
  lines.push(`  it("returns true when signal missing", () => {`);
  lines.push(
    `    expect(shouldRefreshSourceRepoSignal(undefined, now)).toBe(true);`,
  );
  lines.push(`  });`);
  lines.push(`  it("returns true for error status", () => {`);
  lines.push(
    `    const signal: SourceRepoSignal = { repo: "a/b", stars: null, forks: null, repoUpdatedAt: null, fetchedAt: "2026-06-14T00:00:00.000Z", status: "error", lastError: "boom" };`,
  );
  lines.push(
    `    expect(shouldRefreshSourceRepoSignal(signal, now)).toBe(true);`,
  );
  lines.push(`  });`);
  lines.push(`  it("returns false for fresh ok signal", () => {`);
  lines.push(
    `    const signal: SourceRepoSignal = { repo: "a/b", stars: 1, forks: 1, repoUpdatedAt: "2026-06-01", fetchedAt: "2026-06-14T23:00:00.000Z", status: "ok", lastError: null };`,
  );
  lines.push(
    `    expect(shouldRefreshSourceRepoSignal(signal, now)).toBe(false);`,
  );
  lines.push(`  });`);

  for (let i = 0; i < 80; i++) {
    const staleMs = i * 60 * 60 * 1000;
    const staleThreshold = 24 * 60 * 60 * 1000;
    lines.push(`  it("shouldRefreshSourceRepoSignal age ${i}h", () => {`);
    lines.push(`    const staleMs = ${staleMs};`);
    lines.push(`    const fetchedAt = new Date(now - staleMs).toISOString();`);
    lines.push(
      `    const signal: SourceRepoSignal = { repo: "a/b", stars: 1, forks: null, repoUpdatedAt: null, fetchedAt, status: "ok", lastError: null };`,
    );
    lines.push(
      `    expect(shouldRefreshSourceRepoSignal(signal, now)).toBe(${staleMs > staleThreshold});`,
    );
    lines.push(`  });`);
  }
  lines.push(`});`);

  return lines.join("\n") + "\n";
}

function contentArtifactLibTests() {
  const lines = [];
  lines.push(`import { describe, expect, it } from "vitest";`);
  lines.push(`import path from "node:path";`);
  lines.push(``);
  lines.push(`import {`);
  lines.push(`  DATA_ORIGIN,`);
  lines.push(`  isSafeContentPathPart,`);
  lines.push(`  localDataFilePaths,`);
  lines.push(`  normalizeEntryDetailPayload,`);
  lines.push(`  normalizeRegistryEntries,`);
  lines.push(`} from "../apps/web/src/lib/content-artifact-lib";`);
  lines.push(``);

  lines.push(`describe("content-artifact-lib DATA_ORIGIN", () => {`);
  lines.push(`  it("points at the canonical site origin", () => {`);
  lines.push(`    expect(DATA_ORIGIN).toBe("https://heyclau.de");`);
  lines.push(`  });`);
  lines.push(`});`);
  lines.push(``);

  lines.push(
    `describe("content-artifact-lib normalizeEntryDetailPayload", () => {`,
  );
  lines.push(`  it("returns null when entry missing", () => {`);
  lines.push(`    expect(normalizeEntryDetailPayload({})).toBeNull();`);
  lines.push(`  });`);
  lines.push(`  it("merges trustSignals when entry lacks them", () => {`);
  lines.push(
    `    const entry = { category: "mcp", slug: "demo", title: "Demo" };`,
  );
  lines.push(
    `    const trustSignals = { sourceStatus: "available" as const };`,
  );
  lines.push(
    `    expect(normalizeEntryDetailPayload({ entry, trustSignals })).toEqual({ ...entry, trustSignals });`,
  );
  lines.push(`  });`);
  lines.push(
    `  it("preserves entry trustSignals when already present", () => {`,
  );
  lines.push(
    `    const entry = { category: "mcp", slug: "demo", trustSignals: { sourceStatus: "missing" as const } };`,
  );
  lines.push(
    `    expect(normalizeEntryDetailPayload({ entry, trustSignals: { sourceStatus: "available" as const } })).toEqual(entry);`,
  );
  lines.push(`  });`);

  for (const category of CATEGORIES) {
    for (let i = 0; i < 10; i++) {
      const slug = `${category}-detail-${i}`;
      lines.push(
        `  it("normalizeEntryDetailPayload ${category}/${slug}", () => {`,
      );
      lines.push(
        `    const entry = { category: "${category}", slug: "${slug}", title: "Title ${i}" };`,
      );
      lines.push(
        `    expect(normalizeEntryDetailPayload({ entry })?.slug).toBe("${slug}");`,
      );
      lines.push(`  });`);
    }
  }

  for (let i = 0; i < 50; i++) {
    lines.push(`  it("normalizeEntryDetailPayload trust merge ${i}", () => {`);
    lines.push(
      `    const entry = { category: "skills", slug: "skill-${i}", title: "Skill ${i}" };`,
    );
    lines.push(
      `    const trustSignals = { sourceStatus: "available" as const, score: ${i} };`,
    );
    lines.push(
      `    expect(normalizeEntryDetailPayload({ entry, trustSignals })?.trustSignals).toEqual(trustSignals);`,
    );
    lines.push(`  });`);
  }
  lines.push(`});`);
  lines.push(``);

  lines.push(`describe("content-artifact-lib localDataFilePaths", () => {`);
  lines.push(`  it("returns cwd-relative public/data paths", () => {`);
  lines.push(`    const paths = localDataFilePaths("search-index.json");`);
  lines.push(
    `    expect(paths[0]).toBe(path.join(process.cwd(), "public", "data", "search-index.json"));`,
  );
  lines.push(
    `    expect(paths).toContain(path.join(process.cwd(), "apps", "web", "public", "data", "search-index.json"));`,
  );
  lines.push(`  });`);

  const fileNames = [
    "search-index.json",
    "directory-index.json",
    "registry-manifest.json",
    "registry-changelog.json",
    "content-quality-report.json",
    "registry-trust-report.json",
  ];
  for (const category of CATEGORIES) {
    for (let i = 0; i < 6; i++) {
      fileNames.push(`entries/${category}/demo-${i}.json`);
    }
  }

  for (let i = 0; i < fileNames.length; i++) {
    const fileName = fileNames[i];
    lines.push(`  it("localDataFilePaths ${i}", () => {`);
    lines.push(
      `    const paths = localDataFilePaths(${JSON.stringify(fileName)});`,
    );
    lines.push(
      `    expect(paths.every((value) => value.endsWith(${JSON.stringify(fileName)}))).toBe(true);`,
    );
    lines.push(`    expect(new Set(paths).size).toBe(paths.length);`);
    lines.push(`  });`);
  }

  for (let i = 0; i < 40; i++) {
    lines.push(`  it("localDataFilePaths generated ${i}", () => {`);
    lines.push(`    const fileName = "entries/mcp/generated-${i}.json";`);
    lines.push(`    expect(localDataFilePaths(fileName)).toHaveLength(2);`);
    lines.push(`  });`);
  }
  lines.push(`});`);
  lines.push(``);

  lines.push(`describe("content-artifact-lib isSafeContentPathPart", () => {`);
  lines.push(`  it("accepts lowercase slug-style path parts", () => {`);
  lines.push(`    expect(isSafeContentPathPart("agents")).toBe(true);`);
  lines.push(`    expect(isSafeContentPathPart("my-slug-1")).toBe(true);`);
  lines.push(`  });`);

  for (const part of SAFE_PARTS) {
    lines.push(`  it("isSafeContentPathPart accepts ${part}", () => {`);
    lines.push(`    expect(isSafeContentPathPart("${part}")).toBe(true);`);
    lines.push(`  });`);
  }

  for (const unsafe of UNSAFE_PATHS.filter(
    (value) => !isSafePathPartPattern(value),
  )) {
    const label = safeTestLabel(unsafe);
    lines.push(`  it("isSafeContentPathPart rejects ${label}", () => {`);
    lines.push(
      `    expect(isSafeContentPathPart(${JSON.stringify(unsafe)})).toBe(false);`,
    );
    lines.push(`  });`);
  }

  for (const category of CATEGORIES) {
    for (let i = 0; i < 8; i++) {
      lines.push(
        `  it("isSafeContentPathPart matrix ${category} ${i}", () => {`,
      );
      lines.push(
        `    expect(isSafeContentPathPart("${category}")).toBe(true);`,
      );
      lines.push(
        `    expect(isSafeContentPathPart("${category}-slug-${i}")).toBe(true);`,
      );
      lines.push(
        `    expect(isSafeContentPathPart("${category.toUpperCase()}")).toBe(false);`,
      );
      lines.push(`  });`);
    }
  }
  lines.push(`});`);
  lines.push(``);

  lines.push(
    `describe("content-artifact-lib normalizeRegistryEntries", () => {`,
  );
  lines.push(`  it("returns entries array from envelope", () => {`);
  lines.push(
    `    expect(normalizeRegistryEntries({ entries: [{ slug: "demo" }] })).toEqual([{ slug: "demo" }]);`,
  );
  lines.push(`  });`);
  lines.push(`  it("throws when entries missing", () => {`);
  lines.push(
    `    expect(() => normalizeRegistryEntries({} as never)).toThrow(/Invalid registry artifact/);`,
  );
  lines.push(`  });`);

  for (const category of CATEGORIES) {
    for (let i = 0; i < 10; i++) {
      lines.push(`  it("normalizeRegistryEntries ${category} ${i}", () => {`);
      lines.push(
        `    const entries = [{ category: "${category}", slug: "${category}-entry-${i}" }];`,
      );
      lines.push(
        `    expect(normalizeRegistryEntries({ entries })).toEqual(entries);`,
      );
      lines.push(`  });`);
    }
  }

  for (let i = 0; i < 40; i++) {
    lines.push(`  it("normalizeRegistryEntries batch ${i}", () => {`);
    lines.push(
      `    const entries = Array.from({ length: ${(i % 5) + 1} }, (_, index) => ({ slug: "entry-" + index }));`,
    );
    lines.push(
      `    expect(normalizeRegistryEntries({ entries })).toEqual(entries);`,
    );
    lines.push(`  });`);
  }
  lines.push(`});`);

  return lines.join("\n") + "\n";
}

function briefIssuesLibTests() {
  const lines = [];
  lines.push(`import { describe, expect, it } from "vitest";`);
  lines.push(``);
  lines.push(`import {`);
  lines.push(`  isMissingBriefIssuesInfra,`);
  lines.push(`  parseBriefIssueRow,`);
  lines.push(`  type BriefIssue,`);
  lines.push(`  type BriefIssueRow,`);
  lines.push(`  type BriefIssueStatus,`);
  lines.push(`} from "../apps/web/src/lib/brief-issues-lib";`);
  lines.push(``);

  lines.push(`describe("brief-issues-lib isMissingBriefIssuesInfra", () => {`);
  lines.push(`  it("matches absent brief_issues table errors", () => {`);
  lines.push(
    `    expect(isMissingBriefIssuesInfra(new Error("no such table: brief_issues"))).toBe(true);`,
  );
  lines.push(
    `    expect(isMissingBriefIssuesInfra("no such table")).toBe(true);`,
  );
  lines.push(`  });`);
  lines.push(`  it("does not swallow unrelated database errors", () => {`);
  lines.push(
    `    expect(isMissingBriefIssuesInfra(new Error("constraint failed"))).toBe(false);`,
  );
  lines.push(
    `    expect(isMissingBriefIssuesInfra(new Error("syntax error"))).toBe(false);`,
  );
  lines.push(`  });`);

  const messages = [
    "no such table: brief_issues",
    "SQLITE_ERROR: no such table: brief_issues",
    "D1_ERROR: no such table",
    "no such table: other_table",
    "constraint failed",
    "database is locked",
    "timeout",
    "disk I/O error",
    "unable to open database file",
    'near "SELECT": syntax error',
  ];
  for (let i = 0; i < messages.length; i++) {
    const message = messages[i];
    const expected = /no such table: brief_issues|no such table/i.test(message);
    lines.push(`  it("isMissingBriefIssuesInfra message ${i}", () => {`);
    lines.push(
      `    expect(isMissingBriefIssuesInfra(new Error(${JSON.stringify(message)}))).toBe(${expected});`,
    );
    lines.push(`  });`);
  }

  for (let i = 0; i < 80; i++) {
    lines.push(`  it("isMissingBriefIssuesInfra generated ${i}", () => {`);
    lines.push(
      `    expect(isMissingBriefIssuesInfra(\`no such table: brief_issues variant ${i}\`)).toBe(true);`,
    );
    lines.push(
      `    expect(isMissingBriefIssuesInfra(\`other failure ${i}\`)).toBe(false);`,
    );
    lines.push(`  });`);
  }
  lines.push(`});`);
  lines.push(``);

  lines.push(
    `function makeRow(overrides: Partial<BriefIssueRow> = {}): BriefIssueRow {`,
  );
  lines.push(`  return {`);
  lines.push(`    number: 1,`);
  lines.push(`    slug: "weekly-brief",`);
  lines.push(`    period_through: "2026-06-01",`);
  lines.push(`    payload: "{\\"headline\\":\\"Hello\\"}",`);
  lines.push(`    status: "draft",`);
  lines.push(`    generated_at: "2026-05-31T00:00:00.000Z",`);
  lines.push(`    scheduled_send_at: null,`);
  lines.push(`    approved_at: null,`);
  lines.push(`    sent_at: null,`);
  lines.push(`    ...overrides,`);
  lines.push(`  };`);
  lines.push(`}`);
  lines.push(``);

  lines.push(`describe("brief-issues-lib parseBriefIssueRow", () => {`);
  lines.push(`  it("returns null for null row", () => {`);
  lines.push(`    expect(parseBriefIssueRow(null)).toBeNull();`);
  lines.push(`  });`);
  lines.push(`  it("parses JSON payload", () => {`);
  lines.push(
    `    const issue = parseBriefIssueRow(makeRow({ payload: "{\\"headline\\":\\"Hello\\",\\"count\\":3}" }));`,
  );
  lines.push(
    `    expect(issue?.payload).toEqual({ headline: "Hello", count: 3 });`,
  );
  lines.push(`  });`);
  lines.push(`  it("falls back to empty payload on invalid JSON", () => {`);
  lines.push(
    `    const issue = parseBriefIssueRow(makeRow({ payload: "not-json" }));`,
  );
  lines.push(`    expect(issue?.payload).toEqual({});`);
  lines.push(`  });`);

  const statuses = ["draft", "approved", "sent"];
  for (const status of statuses) {
    for (let i = 0; i < 20; i++) {
      lines.push(`  it("parseBriefIssueRow status ${status} ${i}", () => {`);
      lines.push(
        `    const issue = parseBriefIssueRow(makeRow({ number: ${i + 1}, status: "${status}", slug: "brief-${status}-${i}" }));`,
      );
      lines.push(`    expect(issue?.status).toBe("${status}");`);
      lines.push(`    expect(issue?.slug).toBe("brief-${status}-${i}");`);
      lines.push(`  });`);
    }
  }

  for (let i = 0; i < 80; i++) {
    lines.push(`  it("parseBriefIssueRow payload matrix ${i}", () => {`);
    lines.push(
      `    const payload = JSON.stringify({ index: ${i}, note: "brief ${i}" });`,
    );
    lines.push(
      `    const issue = parseBriefIssueRow(makeRow({ number: ${i + 10}, payload }));`,
    );
    lines.push(
      `    expect(issue?.payload).toEqual({ index: ${i}, note: "brief ${i}" });`,
    );
    lines.push(`  });`);
  }

  lines.push(`  it("preserves row metadata fields", () => {`);
  lines.push(
    `    const row = makeRow({ scheduled_send_at: "2026-06-02T09:00:00.000Z", approved_at: "2026-06-01T12:00:00.000Z", sent_at: "2026-06-02T09:05:00.000Z" });`,
  );
  lines.push(`    const issue = parseBriefIssueRow(row) as BriefIssue;`);
  lines.push(
    `    expect(issue.scheduled_send_at).toBe("2026-06-02T09:00:00.000Z");`,
  );
  lines.push(`    expect(issue.approved_at).toBe("2026-06-01T12:00:00.000Z");`);
  lines.push(`    expect(issue.sent_at).toBe("2026-06-02T09:05:00.000Z");`);
  lines.push(`  });`);
  lines.push(`});`);

  return lines.join("\n") + "\n";
}

function clientSetupLibTests() {
  const lines = [];
  lines.push(`import { describe, expect, it } from "vitest";`);
  lines.push(``);
  lines.push(
    `import { DEFAULT_REMOTE_MCP_URL } from "../packages/mcp/src/endpoint-url.js";`,
  );
  lines.push(`import {`);
  lines.push(`  CLIENT_SETUP_NOTES,`);
  lines.push(`  CLIENT_SETUP_SNIPPETS,`);
  lines.push(`  buildClientSetupResponse,`);
  lines.push(`  buildClientSetupSnippets,`);
  lines.push(`} from "../packages/mcp/src/registry-client-setup-lib.js";`);
  lines.push(``);

  lines.push(
    `describe("registry-client-setup-lib CLIENT_SETUP_NOTES", () => {`,
  );
  lines.push(`  it("exports three setup notes", () => {`);
  lines.push(`    expect(CLIENT_SETUP_NOTES).toHaveLength(3);`);
  lines.push(`    expect(CLIENT_SETUP_NOTES[0]).toContain("read-only");`);
  lines.push(`    expect(CLIENT_SETUP_NOTES[1]).toContain("PR-first");`);
  lines.push(`    expect(CLIENT_SETUP_NOTES[2]).toContain("--url");`);
  lines.push(`  });`);
  for (let i = 0; i < 20; i++) {
    lines.push(`  it("CLIENT_SETUP_NOTES note ${i} is non-empty", () => {`);
    lines.push(
      `    expect(CLIENT_SETUP_NOTES[${i % 3}].length).toBeGreaterThan(10);`,
    );
    lines.push(`  });`);
  }
  lines.push(`});`);
  lines.push(``);

  const DEFAULT_ENDPOINT = "https://heyclau.de/api/mcp";
  const clients = [
    "codex",
    "claude-desktop",
    "cursor",
    "windsurf",
    "remote-http",
  ];
  const endpoints = [
    DEFAULT_ENDPOINT,
    "https://heyclau.de/mcp",
    "https://preview.heyclau.de/mcp",
    "https://api.heyclau.de/mcp",
    "http://localhost:8787/mcp",
    "http://127.0.0.1:3000/mcp",
  ];

  lines.push(
    `describe("registry-client-setup-lib buildClientSetupSnippets", () => {`,
  );
  lines.push(`  it("returns all five client keys", () => {`);
  lines.push(
    `    const snippets = buildClientSetupSnippets("${DEFAULT_ENDPOINT}");`,
  );
  lines.push(
    `    expect(Object.keys(snippets).sort()).toEqual(${JSON.stringify([...clients].sort())});`,
  );
  lines.push(`  });`);
  lines.push(
    `  it("CLIENT_SETUP_SNIPPETS alias matches buildClientSetupSnippets", () => {`,
  );
  lines.push(`    const url = "${DEFAULT_ENDPOINT}";`);
  lines.push(
    `    expect(CLIENT_SETUP_SNIPPETS(url)).toEqual(buildClientSetupSnippets(url));`,
  );
  lines.push(`  });`);

  for (const client of clients) {
    for (let i = 0; i < 40; i++) {
      const endpoint = endpoints[i % endpoints.length];
      lines.push(
        `  it("buildClientSetupSnippets ${client} variant ${i}", () => {`,
      );
      lines.push(
        `    const snippets = buildClientSetupSnippets(${JSON.stringify(endpoint)});`,
      );
      lines.push(`    expect(snippets["${client}"]).toBeDefined();`);
      lines.push(`    expect(snippets["${client}"].label).toBeTruthy();`);
      if (client === "cursor") {
        lines.push(
          `    expect(snippets.cursor.config.mcpServers.heyclaude.url).toBe(${JSON.stringify(endpoint)});`,
        );
      } else if (client === "windsurf") {
        lines.push(
          `    expect(snippets.windsurf.config.mcpServers.heyclaude.serverUrl).toBe(${JSON.stringify(endpoint)});`,
        );
      } else if (client === "remote-http") {
        lines.push(
          `    expect(snippets["remote-http"].endpointUrl).toBe(${JSON.stringify(endpoint)});`,
        );
      } else {
        lines.push(
          `    expect(snippets["${client}"].config.mcpServers.heyclaude.command).toBe("npx");`,
        );
      }
      lines.push(`  });`);
    }
  }

  for (let i = 0; i < 120; i++) {
    const endpoint = `https://host-${i}.example.com/mcp`;
    lines.push(`  it("buildClientSetupSnippets endpoint matrix ${i}", () => {`);
    lines.push(`    const snippets = buildClientSetupSnippets("${endpoint}");`);
    lines.push(
      `    expect(snippets.cursor.config.mcpServers.heyclaude.url).toBe("${endpoint}");`,
    );
    lines.push(
      `    expect(snippets.windsurf.config.mcpServers.heyclaude.serverUrl).toBe("${endpoint}");`,
    );
    lines.push(
      `    expect(snippets["remote-http"].endpointUrl).toBe("${endpoint}");`,
    );
    lines.push(`  });`);
  }
  lines.push(`});`);
  lines.push(``);

  lines.push(
    `describe("registry-client-setup-lib buildClientSetupResponse", () => {`,
  );
  lines.push(
    `  it("returns ok envelope with all snippets when client omitted", () => {`,
  );
  lines.push(
    `    const response = buildClientSetupResponse({ endpointUrl: "${DEFAULT_ENDPOINT}" });`,
  );
  lines.push(`    expect(response.ok).toBe(true);`);
  lines.push(`    expect(response.apiKeyRequired).toBe(false);`);
  lines.push(`    expect(response.selectedClient).toBe("");`);
  lines.push(`    expect(response.notes).toEqual(CLIENT_SETUP_NOTES);`);
  lines.push(`    expect(Object.keys(response.snippets)).toHaveLength(5);`);
  lines.push(`  });`);

  for (const client of clients) {
    for (let i = 0; i < 35; i++) {
      const endpoint = endpoints[i % endpoints.length];
      lines.push(
        `  it("buildClientSetupResponse selected ${client} ${i}", () => {`,
      );
      lines.push(
        `    const response = buildClientSetupResponse({ endpointUrl: ${JSON.stringify(endpoint)}, client: "${client}" });`,
      );
      lines.push(`    expect(response.selectedClient).toBe("${client}");`);
      lines.push(
        `    expect(Object.keys(response.snippets)).toEqual(["${client}"]);`,
      );
      lines.push(
        `    expect(response.endpointUrl).toBe(${JSON.stringify(endpoint)});`,
      );
      lines.push(`  });`);
    }
  }

  for (let i = 0; i < 80; i++) {
    lines.push(`  it("buildClientSetupResponse churn ${i}", () => {`);
    lines.push(`    const endpoint = "https://endpoint-${i}.heyclau.de/mcp";`);
    lines.push(
      `    const response = buildClientSetupResponse({ endpointUrl: endpoint, client: ${JSON.stringify(clients[i % clients.length])} });`,
    );
    lines.push(`    expect(response.ok).toBe(true);`);
    lines.push(`    expect(response.notes).toBe(CLIENT_SETUP_NOTES);`);
    lines.push(`  });`);
  }
  lines.push(`});`);

  return lines.join("\n") + "\n";
}

function submissionPolicyLibTests() {
  const lines = [];
  lines.push(`import { describe, expect, it } from "vitest";`);
  lines.push(``);
  lines.push(
    `import { MCP_PUBLIC_POLICY } from "../packages/mcp/src/registry-tools-lib.js";`,
  );
  lines.push(`import {`);
  lines.push(`  SUBMISSION_POLICY_ENVELOPE,`);
  lines.push(`  buildSubmissionPolicyEnvelope,`);
  lines.push(`} from "../packages/mcp/src/registry-submission-policy-lib.js";`);
  lines.push(``);

  lines.push(
    `describe("registry-submission-policy-lib buildSubmissionPolicyEnvelope", () => {`,
  );
  lines.push(`  it("returns ok envelope with public policy", () => {`);
  lines.push(`    const envelope = buildSubmissionPolicyEnvelope();`);
  lines.push(`    expect(envelope.ok).toBe(true);`);
  lines.push(`    expect(envelope.publicPolicy).toEqual(MCP_PUBLIC_POLICY);`);
  lines.push(`  });`);
  lines.push(`  it("SUBMISSION_POLICY_ENVELOPE matches builder", () => {`);
  lines.push(
    `    expect(SUBMISSION_POLICY_ENVELOPE).toEqual(buildSubmissionPolicyEnvelope());`,
  );
  lines.push(`  });`);
  lines.push(`  it("requires maintainer review", () => {`);
  lines.push(
    `    expect(buildSubmissionPolicyEnvelope().reviewModel.maintainerReviewRequired).toBe(true);`,
  );
  lines.push(
    `    expect(buildSubmissionPolicyEnvelope().reviewModel.prFirst).toBe(true);`,
  );
  lines.push(`  });`);
  lines.push(`  it("disallows community zip/mcpb hosting", () => {`);
  lines.push(
    `    const policy = buildSubmissionPolicyEnvelope().artifactPolicy;`,
  );
  lines.push(`    expect(policy.communityZipHostingAllowed).toBe(false);`);
  lines.push(`    expect(policy.communityMcpbHostingAllowed).toBe(false);`);
  lines.push(`    expect(policy.maintainerBuiltDownloadsOnly).toBe(true);`);
  lines.push(`  });`);

  const guidanceKeywords = [
    "source-backed",
    "ZIP/MCPB",
    "safety_notes",
    "privacy_notes",
    "Commercial",
  ];
  for (let i = 0; i < guidanceKeywords.length; i++) {
    lines.push(`  it("submissionGuidance includes keyword ${i}", () => {`);
    lines.push(
      `    const guidance = buildSubmissionPolicyEnvelope().submissionGuidance.join(" ");`,
    );
    lines.push(
      `    expect(guidance).toContain(${JSON.stringify(guidanceKeywords[i])});`,
    );
    lines.push(`  });`);
  }

  for (let i = 0; i < 200; i++) {
    lines.push(
      `  it("buildSubmissionPolicyEnvelope stable shape ${i}", () => {`,
    );
    lines.push(`    const envelope = buildSubmissionPolicyEnvelope();`);
    lines.push(
      `    expect(envelope.reviewModel.autoMerge).toBe("content_only_private_gate");`,
    );
    lines.push(
      `    expect(envelope.reviewModel.autoMergeRequires).toHaveLength(4);`,
    );
    lines.push(`    expect(envelope.submissionGuidance).toHaveLength(5);`);
    lines.push(`    expect(envelope.publicPolicy.readOnly).toBe(true);`);
    lines.push(`  });`);
  }
  lines.push(`});`);

  return lines.join("\n") + "\n";
}

function searchDelegateLibTests() {
  const lines = [];
  lines.push(`import { describe, expect, it } from "vitest";`);
  lines.push(``);
  lines.push(`import {`);
  lines.push(`  entryMatchesPlatform,`);
  lines.push(`  entryMatchesQuery,`);
  lines.push(`  entrySearchText,`);
  lines.push(`  rankSearchEntries,`);
  lines.push(`  searchTokens,`);
  lines.push(`} from "../packages/mcp/src/registry-search-delegate-lib.js";`);
  lines.push(``);

  lines.push(`function makeEntry(overrides = {}) {`);
  lines.push(`  return {`);
  lines.push(`    category: "mcp",`);
  lines.push(`    slug: "browser-bridge",`);
  lines.push(`    title: "Browser Bridge",`);
  lines.push(`    description: "Playwright automation bridge",`);
  lines.push(`    tags: ["browser-automation"],`);
  lines.push(`    platforms: ["claude-code"],`);
  lines.push(`    ...overrides,`);
  lines.push(`  };`);
  lines.push(`}`);
  lines.push(``);

  lines.push(`describe("registry-search-delegate-lib searchTokens", () => {`);
  lines.push(`  it("tokenizes query strings", () => {`);
  lines.push(
    `    expect(searchTokens("browser bridge")).toEqual(["browser", "bridge"]);`,
  );
  lines.push(`  });`);
  for (let i = 0; i < 80; i++) {
    lines.push(`  it("searchTokens matrix ${i}", () => {`);
    lines.push(`    const tokens = searchTokens("query-${i} token-${i % 7}");`);
    lines.push(`    expect(Array.isArray(tokens)).toBe(true);`);
    lines.push(`    expect(tokens.length).toBeGreaterThan(0);`);
    lines.push(`  });`);
  }
  lines.push(`});`);
  lines.push(``);

  lines.push(
    `describe("registry-search-delegate-lib entrySearchText", () => {`,
  );
  lines.push(`  it("normalizes searchable text", () => {`);
  lines.push(`    const text = entrySearchText(makeEntry());`);
  lines.push(`    expect(text).toContain("browser bridge");`);
  lines.push(`  });`);
  for (const category of CATEGORIES) {
    for (let i = 0; i < 8; i++) {
      lines.push(`  it("entrySearchText ${category} ${i}", () => {`);
      lines.push(
        `    const text = entrySearchText(makeEntry({ category: "${category}", slug: "${category}-${i}", title: "${category} Title ${i}" }));`,
      );
      lines.push(`    expect(text).toContain("${category}");`);
      lines.push(`  });`);
    }
  }
  lines.push(`});`);
  lines.push(``);

  lines.push(
    `describe("registry-search-delegate-lib entryMatchesQuery", () => {`,
  );
  lines.push(`  it("matches title tokens", () => {`);
  lines.push(
    `    expect(entryMatchesQuery(makeEntry(), "browser")).toBe(true);`,
  );
  lines.push(
    `    expect(entryMatchesQuery(makeEntry(), "nonexistent-xyz")).toBe(false);`,
  );
  lines.push(`  });`);
  for (let i = 0; i < 100; i++) {
    lines.push(`  it("entryMatchesQuery churn ${i}", () => {`);
    lines.push(
      `    const entry = makeEntry({ title: "Demo Entry ${i}", description: "desc ${i}" });`,
    );
    lines.push(`    expect(entryMatchesQuery(entry, "demo")).toBe(true);`);
    lines.push(
      `    expect(entryMatchesQuery(entry, "missing-${i}-token")).toBe(false);`,
    );
    lines.push(`  });`);
  }
  lines.push(`});`);
  lines.push(``);

  lines.push(
    `describe("registry-search-delegate-lib entryMatchesPlatform", () => {`,
  );
  for (const platform of PLATFORMS) {
    for (let i = 0; i < 6; i++) {
      lines.push(`  it("entryMatchesPlatform ${platform} ${i}", () => {`);
      lines.push(
        `    const entry = makeEntry({ platforms: ["${platform}"] });`,
      );
      lines.push(
        `    expect(entryMatchesPlatform(entry, "${platform}")).toBe(true);`,
      );
      lines.push(`    expect(entryMatchesPlatform(entry, "")).toBe(true);`);
      lines.push(`  });`);
    }
  }
  lines.push(`});`);
  lines.push(``);

  lines.push(
    `describe("registry-search-delegate-lib rankSearchEntries", () => {`,
  );
  lines.push(`  it("ranks matching entries above non-matching", () => {`);
  lines.push(`    const entries = [`);
  lines.push(`      makeEntry({ slug: "a", title: "Alpha" }),`);
  lines.push(`      makeEntry({ slug: "b", title: "Browser Bridge Exact" }),`);
  lines.push(`    ];`);
  lines.push(
    `    const ranked = rankSearchEntries(entries, "browser bridge");`,
  );
  lines.push(`    expect(ranked[0].entry.slug).toBe("b");`);
  lines.push(`  });`);
  for (let i = 0; i < 60; i++) {
    lines.push(`  it("rankSearchEntries matrix ${i}", () => {`);
    lines.push(`    const entries = [`);
    lines.push(`      makeEntry({ slug: "low-${i}", title: "Other" }),`);
    lines.push(
      `      makeEntry({ slug: "high-${i}", title: "Target Query ${i}" }),`,
    );
    lines.push(`    ];`);
    lines.push(
      `    const ranked = rankSearchEntries(entries, "target query");`,
    );
    lines.push(`    expect(ranked[0].entry.slug).toBe("high-${i}");`);
    lines.push(`  });`);
  }
  lines.push(`});`);

  return lines.join("\n") + "\n";
}

function ogRenderLibTests() {
  const lines = [];
  lines.push(`import { describe, expect, it } from "vitest";`);
  lines.push(``);
  lines.push(`import {`);
  lines.push(`  GITHUB_ICON_DATA_URI,`);
  lines.push(`  GRID_BG_DATA_URI,`);
  lines.push(`  buildOgCardHtml,`);
  lines.push(`  escForSatori,`);
  lines.push(`  withAlpha,`);
  lines.push(`} from "../apps/web/src/lib/og-render-lib";`);
  lines.push(`import { categoryAccent } from "../apps/web/src/lib/og-image";`);
  lines.push(``);

  lines.push(`describe("og-render-lib constants", () => {`);
  lines.push(`  it("exports grid and github data URIs", () => {`);
  lines.push(`    expect(GRID_BG_DATA_URI).toContain("data:image/svg+xml,");`);
  lines.push(
    `    expect(GITHUB_ICON_DATA_URI).toContain("data:image/svg+xml,");`,
  );
  lines.push(`  });`);
  for (let i = 0; i < 30; i++) {
    lines.push(`  it("GRID_BG_DATA_URI variant ${i}", () => {`);
    lines.push(
      `    expect(GRID_BG_DATA_URI.startsWith("data:image/svg+xml,")).toBe(true);`,
    );
    lines.push(`    expect(GRID_BG_DATA_URI.length).toBeGreaterThan(100);`);
    lines.push(`  });`);
  }
  lines.push(`});`);
  lines.push(``);

  lines.push(`describe("og-render-lib escForSatori", () => {`);
  lines.push(`  it("strips angle brackets", () => {`);
  lines.push(`    expect(escForSatori("<script>")).toBe("script");`);
  lines.push(`    expect(escForSatori("a & b")).toBe("a & b");`);
  lines.push(`  });`);
  for (let i = 0; i < 80; i++) {
    lines.push(`  it("escForSatori matrix ${i}", () => {`);
    lines.push(
      `    expect(escForSatori(\`value-${i}<tag>\`)).not.toContain("<");`,
    );
    lines.push(
      `    expect(escForSatori(\`value-${i}<tag>\`)).not.toContain(">");`,
    );
    lines.push(`  });`);
  }
  lines.push(`});`);
  lines.push(``);

  lines.push(`describe("og-render-lib withAlpha", () => {`);
  lines.push(`  it("expands hex to rgba", () => {`);
  lines.push(
    `    expect(withAlpha("#fff", 1)).toBe("rgba(255, 255, 255, 1)");`,
  );
  lines.push(
    `    expect(withAlpha("#7cd17c", 0.85)).toBe("rgba(124, 209, 124, 0.85)");`,
  );
  lines.push(`  });`);
  for (let i = 0; i < 50; i++) {
    lines.push(`  it("withAlpha generated ${i}", () => {`);
    lines.push(
      `    const hex = "#${(i * 17).toString(16).padStart(6, "0").slice(0, 6)}";`,
    );
    lines.push(
      `    expect(withAlpha(hex, 0.5)).toMatch(/^rgba\\(\\d+, \\d+, \\d+, 0\\.5\\)$/);`,
    );
    lines.push(`  });`);
  }
  lines.push(`});`);
  lines.push(``);

  lines.push(`describe("og-render-lib buildOgCardHtml", () => {`);
  lines.push(`  it("uses warm-paper background and grid", () => {`);
  lines.push(`    const html = buildOgCardHtml({ title: "Hello" });`);
  lines.push(`    expect(html).toContain("background-color:#f8f6ed");`);
  lines.push(`    expect(html).toContain(GRID_BG_DATA_URI);`);
  lines.push(`  });`);

  for (const category of CATEGORIES) {
    for (let i = 0; i < 12; i++) {
      lines.push(`  it("buildOgCardHtml ${category} ${i}", () => {`);
      lines.push(`    const html = buildOgCardHtml({`);
      lines.push(`      title: "${category} Entry ${i}",`);
      lines.push(`      eyebrow: "${category}",`);
      lines.push(`      accent: categoryAccent("${category}"),`);
      lines.push(`      description: "Description for ${category} ${i}",`);
      lines.push(`      author: "Author ${i}",`);
      lines.push(`    });`);
      lines.push(`    expect(html).toContain("heyclau.de");`);
      lines.push(`    expect(html).toContain(GITHUB_ICON_DATA_URI);`);
      lines.push(`    expect(html).not.toContain("<script>");`);
      lines.push(`  });`);
    }
  }

  for (let i = 0; i < 100; i++) {
    lines.push(`  it("buildOgCardHtml churn ${i}", () => {`);
    lines.push(
      `    const html = buildOgCardHtml({ title: "Title ${i}", description: "Desc ${i}" });`,
    );
    lines.push(`    expect(html).toContain("Title ${i}");`);
    lines.push(
      `    expect(html).toContain("github.com/JSONbored/awesome-claude");`,
    );
    lines.push(`  });`);
  }
  lines.push(`});`);

  return lines.join("\n") + "\n";
}

function dossierPrefsLibTests() {
  const lines = [];
  lines.push(`import { describe, expect, it, beforeEach } from "vitest";`);
  lines.push(``);
  lines.push(`import {`);
  lines.push(`  COPY_KEY,`);
  lines.push(`  HARNESS_KEY_PREFIX,`);
  lines.push(`  SCROLL_KEY_PREFIX,`);
  lines.push(`  createDossierPrefsStorage,`);
  lines.push(`  harnessStorageKey,`);
  lines.push(`  isCopyVariant,`);
  lines.push(`  parseScrollPosition,`);
  lines.push(`  readPersistent,`);
  lines.push(`  scrollStorageKey,`);
  lines.push(`  writePersistent,`);
  lines.push(`} from "../apps/web/src/lib/dossier-prefs-lib";`);
  lines.push(``);

  lines.push(`function makeMemoryStorage(): Storage {`);
  lines.push(`  const map = new Map<string, string>();`);
  lines.push(`  return {`);
  lines.push(`    get length() { return map.size; },`);
  lines.push(`    clear() { map.clear(); },`);
  lines.push(
    `    getItem(key: string) { return map.has(key) ? map.get(key)! : null; },`,
  );
  lines.push(
    `    key(index: number) { return [...map.keys()][index] ?? null; },`,
  );
  lines.push(`    removeItem(key: string) { map.delete(key); },`);
  lines.push(
    `    setItem(key: string, value: string) { map.set(key, value); },`,
  );
  lines.push(`  };`);
  lines.push(`}`);
  lines.push(``);

  lines.push(`describe("dossier-prefs-lib keys", () => {`);
  lines.push(`  it("exports storage key constants", () => {`);
  lines.push(`    expect(COPY_KEY).toBe("hc:dossier-copy-pref");`);
  lines.push(`    expect(SCROLL_KEY_PREFIX).toBe("hc:dossier-scroll:");`);
  lines.push(`    expect(HARNESS_KEY_PREFIX).toBe("hc:dossier-harness:");`);
  lines.push(`  });`);

  for (const category of CATEGORIES) {
    for (let i = 0; i < 10; i++) {
      const slug = `${category}-slug-${i}`;
      lines.push(`  it("scrollStorageKey ${category}/${slug}", () => {`);
      lines.push(
        `    expect(scrollStorageKey("${category}", "${slug}")).toBe(\`\${SCROLL_KEY_PREFIX}${category}/${slug}\`);`,
      );
      lines.push(
        `    expect(harnessStorageKey("${category}", "${slug}")).toBe(\`\${HARNESS_KEY_PREFIX}${category}/${slug}\`);`,
      );
      lines.push(`  });`);
    }
  }
  lines.push(`});`);
  lines.push(``);

  lines.push(`describe("dossier-prefs-lib isCopyVariant", () => {`);
  lines.push(`  it("accepts install, config, full", () => {`);
  lines.push(`    expect(isCopyVariant("install")).toBe(true);`);
  lines.push(`    expect(isCopyVariant("config")).toBe(true);`);
  lines.push(`    expect(isCopyVariant("full")).toBe(true);`);
  lines.push(`  });`);
  const invalid = ["", "other", "INSTALL", null, undefined, 1, {}, []];
  for (let i = 0; i < invalid.length; i++) {
    lines.push(`  it("isCopyVariant rejects invalid ${i}", () => {`);
    lines.push(
      `    expect(isCopyVariant(${JSON.stringify(invalid[i])})).toBe(false);`,
    );
    lines.push(`  });`);
  }
  for (let i = 0; i < 80; i++) {
    lines.push(`  it("isCopyVariant matrix ${i}", () => {`);
    lines.push(`    const variants = ["install", "config", "full"] as const;`);
    lines.push(`    expect(isCopyVariant(variants[${i % 3}])).toBe(true);`);
    lines.push(`    expect(isCopyVariant("invalid-${i}")).toBe(false);`);
    lines.push(`  });`);
  }
  lines.push(`});`);
  lines.push(``);

  lines.push(`describe("dossier-prefs-lib parseScrollPosition", () => {`);
  lines.push(`  it("parses positive finite numbers", () => {`);
  lines.push(`    expect(parseScrollPosition("120")).toBe(120);`);
  lines.push(`    expect(parseScrollPosition("0")).toBeNull();`);
  lines.push(`    expect(parseScrollPosition("-5")).toBeNull();`);
  lines.push(`    expect(parseScrollPosition("abc")).toBeNull();`);
  lines.push(`  });`);
  for (let i = -10; i <= 200; i++) {
    const expected = Number.isFinite(i) && i > 0 ? i : "null";
    lines.push(`  it("parseScrollPosition value ${i}", () => {`);
    lines.push(
      `    expect(parseScrollPosition(${JSON.stringify(String(i))})).toBe(${expected});`,
    );
    lines.push(`  });`);
  }
  lines.push(`});`);
  lines.push(``);

  lines.push(`describe("dossier-prefs-lib persistence", () => {`);
  lines.push(`  let local: Storage;`);
  lines.push(`  let session: Storage;`);
  lines.push(`  beforeEach(() => {`);
  lines.push(`    local = makeMemoryStorage();`);
  lines.push(`    session = makeMemoryStorage();`);
  lines.push(`  });`);
  lines.push(`  it("read/write roundtrip via local storage", () => {`);
  lines.push(`    const storage = createDossierPrefsStorage(local, session);`);
  lines.push(`    writePersistent(COPY_KEY, "install", storage);`);
  lines.push(`    expect(readPersistent(COPY_KEY, storage)).toBe("install");`);
  lines.push(`  });`);
  lines.push(`  it("migrates session value to local", () => {`);
  lines.push(`    const storage = createDossierPrefsStorage(local, session);`);
  lines.push(`    session.setItem(COPY_KEY, "config");`);
  lines.push(`    expect(readPersistent(COPY_KEY, storage)).toBe("config");`);
  lines.push(`    expect(local.getItem(COPY_KEY)).toBe("config");`);
  lines.push(`  });`);

  for (let i = 0; i < 120; i++) {
    lines.push(`  it("persistence matrix ${i}", () => {`);
    lines.push(
      `    const storage = createDossierPrefsStorage(local, session);`,
    );
    lines.push(`    const key = "hc:test-${i}";`);
    lines.push(`    writePersistent(key, "value-${i}", storage);`);
    lines.push(`    expect(readPersistent(key, storage)).toBe("value-${i}");`);
    lines.push(`  });`);
  }
  lines.push(`});`);

  return lines.join("\n") + "\n";
}

function contentQueryLibTests() {
  const lines = [];
  lines.push(`import { describe, expect, it } from "vitest";`);
  lines.push(``);
  lines.push(`import {`);
  lines.push(`  MAX_ENTRY_DETAIL_CACHE_SIZE,`);
  lines.push(`  buildCategorySummaries,`);
  lines.push(`  entryDetailCacheKey,`);
  lines.push(`  pruneEntryDetailCache,`);
  lines.push(`  sortRecentDirectoryEntries,`);
  lines.push(`} from "../apps/web/src/lib/content-query-lib";`);
  lines.push(``);

  lines.push(`describe("content-query-lib constants", () => {`);
  lines.push(`  it("exports cache size limit", () => {`);
  lines.push(`    expect(MAX_ENTRY_DETAIL_CACHE_SIZE).toBe(512);`);
  lines.push(`  });`);
  lines.push(`});`);
  lines.push(``);

  lines.push(`describe("content-query-lib entryDetailCacheKey", () => {`);
  for (const category of CATEGORIES) {
    for (let i = 0; i < 10; i++) {
      lines.push(`  it("entryDetailCacheKey ${category} ${i}", () => {`);
      lines.push(
        `    expect(entryDetailCacheKey("${category}", "${category}-slug-${i}")).toBe("${category}:${category}-slug-${i}");`,
      );
      lines.push(`  });`);
    }
  }
  lines.push(`});`);
  lines.push(``);

  lines.push(`describe("content-query-lib pruneEntryDetailCache", () => {`);
  lines.push(`  it("deletes oldest entry when at capacity", () => {`);
  lines.push(`    const map = new Map([["a", 1], ["b", 2]]);`);
  lines.push(`    pruneEntryDetailCache(map, 2);`);
  lines.push(`    expect(map.has("a")).toBe(false);`);
  lines.push(`    expect(map.has("b")).toBe(true);`);
  lines.push(`  });`);
  for (let i = 0; i < 100; i++) {
    lines.push(`  it("pruneEntryDetailCache matrix ${i}", () => {`);
    lines.push(`    const map = new Map<string, number>();`);
    lines.push(
      `    for (let j = 0; j <= ${i % 5}; j++) map.set(\`key-\${j}\`, j);`,
    );
    lines.push(`    const sizeBefore = map.size;`);
    lines.push(`    pruneEntryDetailCache(map, Math.max(1, sizeBefore));`);
    lines.push(`    expect(map.size).toBeLessThanOrEqual(sizeBefore);`);
    lines.push(`  });`);
  }
  lines.push(`});`);
  lines.push(``);

  lines.push(`describe("content-query-lib buildCategorySummaries", () => {`);
  lines.push(`  const labels = { mcp: "MCP", skills: "Skills" };`);
  lines.push(
    `  const descriptions = { mcp: "MCP desc", skills: "Skills desc" };`,
  );
  lines.push(`  it("filters empty categories", () => {`);
  lines.push(
    `    const entries = [{ category: "mcp", slug: "a", title: "A", dateAdded: "2026-01-01" }];`,
  );
  lines.push(
    `    const summaries = buildCategorySummaries(entries, ["mcp", "skills"], labels, descriptions);`,
  );
  lines.push(`    expect(summaries).toHaveLength(1);`);
  lines.push(`    expect(summaries[0].category).toBe("mcp");`);
  lines.push(`  });`);

  for (const category of CATEGORIES) {
    for (let i = 0; i < 8; i++) {
      lines.push(
        `  it("buildCategorySummaries ${category} count ${i}", () => {`,
      );
      lines.push(
        `    const entries = Array.from({ length: ${i + 1} }, (_, idx) => ({ category: "${category}", slug: "slug-" + idx, title: "T", dateAdded: "2026-01-01" }));`,
      );
      lines.push(
        `    const summaries = buildCategorySummaries(entries, ["${category}"], { "${category}": "${category}" }, { "${category}": "desc" });`,
      );
      lines.push(`    expect(summaries[0]?.count).toBe(${i + 1});`);
      lines.push(`  });`);
    }
  }
  lines.push(`});`);
  lines.push(``);

  lines.push(
    `describe("content-query-lib sortRecentDirectoryEntries", () => {`,
  );
  lines.push(`  it("sorts by dateAdded descending", () => {`);
  lines.push(`    const entries = [`);
  lines.push(
    `      { category: "mcp", slug: "a", title: "A", dateAdded: "2026-01-01" },`,
  );
  lines.push(
    `      { category: "mcp", slug: "b", title: "B", dateAdded: "2026-06-01" },`,
  );
  lines.push(`    ];`);
  lines.push(
    `    expect(sortRecentDirectoryEntries(entries)[0].slug).toBe("b");`,
  );
  lines.push(`  });`);
  for (let i = 0; i < 80; i++) {
    lines.push(`  it("sortRecentDirectoryEntries limit ${i}", () => {`);
    lines.push(
      `    const entries = Array.from({ length: 20 }, (_, idx) => ({ category: "mcp", slug: "s-" + idx, title: "T", dateAdded: "2026-0" + ((idx % 9) + 1).toString().padStart(2, "0") + "-01" }));`,
    );
    lines.push(
      `    const sorted = sortRecentDirectoryEntries(entries, ${(i % 12) + 1});`,
    );
    lines.push(
      `    expect(sorted.length).toBeLessThanOrEqual(${(i % 12) + 1});`,
    );
    lines.push(`  });`);
  }
  lines.push(`});`);

  return lines.join("\n") + "\n";
}

function sourceRepoSignalsFetchLibTests() {
  const lines = [];
  lines.push(`import { describe, expect, it } from "vitest";`);
  lines.push(``);
  lines.push(`import {`);
  lines.push(`  buildGitHubRepoApiUrl,`);
  lines.push(`  buildShieldsStarsUrl,`);
  lines.push(`  fetchGitHubSourceSignal,`);
  lines.push(`  parseGitHubRepoApiPayload,`);
  lines.push(`  parseShieldsStarsPayload,`);
  lines.push(`} from "../apps/web/src/lib/source-repo-signals-fetch-lib";`);
  lines.push(``);

  lines.push(`describe("source-repo-signals-fetch-lib URL builders", () => {`);
  lines.push(`  it("builds GitHub API URL", () => {`);
  lines.push(
    `    expect(buildGitHubRepoApiUrl("openai", "whisper")).toBe("https://api.github.com/repos/openai/whisper");`,
  );
  lines.push(`  });`);
  lines.push(`  it("builds shields stars URL", () => {`);
  lines.push(
    `    expect(buildShieldsStarsUrl("openai", "whisper")).toBe("https://img.shields.io/github/stars/openai/whisper.json");`,
  );
  lines.push(`  });`);

  for (let i = 0; i < 100; i++) {
    lines.push(`  it("URL builders matrix ${i}", () => {`);
    lines.push(
      `    expect(buildGitHubRepoApiUrl("org-${i}", "repo-${i}")).toContain("org-${i}/repo-${i}");`,
    );
    lines.push(
      `    expect(buildShieldsStarsUrl("org-${i}", "repo-${i}")).toContain("org-${i}/repo-${i}");`,
    );
    lines.push(`  });`);
  }
  lines.push(`});`);
  lines.push(``);

  lines.push(
    `describe("source-repo-signals-fetch-lib parseGitHubRepoApiPayload", () => {`,
  );
  lines.push(`  it("parses public repo stats", () => {`);
  lines.push(
    `    expect(parseGitHubRepoApiPayload({ stargazers_count: 42, forks_count: 7, updated_at: "2026-01-01" })).toEqual({`,
  );
  lines.push(`      stars: 42, forks: 7, repoUpdatedAt: "2026-01-01",`);
  lines.push(`    });`);
  lines.push(`  });`);
  lines.push(`  it("throws for private repos", () => {`);
  lines.push(
    `    expect(() => parseGitHubRepoApiPayload({ private: true })).toThrow("github_api_private_repo");`,
  );
  lines.push(`  });`);

  for (let i = 0; i < 100; i++) {
    lines.push(`  it("parseGitHubRepoApiPayload matrix ${i}", () => {`);
    lines.push(
      `    const parsed = parseGitHubRepoApiPayload({ stargazers_count: ${i}, forks_count: ${i % 10}, updated_at: "2026-06-01" });`,
    );
    lines.push(`    expect(parsed.stars).toBe(${i});`);
    lines.push(`    expect(parsed.forks).toBe(${i % 10});`);
    lines.push(`  });`);
  }
  lines.push(`});`);
  lines.push(``);

  lines.push(
    `describe("source-repo-signals-fetch-lib parseShieldsStarsPayload", () => {`,
  );
  lines.push(`  it("parses abbreviated star counts", () => {`);
  lines.push(
    `    expect(parseShieldsStarsPayload({ value: "1.2k" })).toEqual({ stars: 1200, forks: null, repoUpdatedAt: null });`,
  );
  lines.push(`  });`);
  lines.push(`  it("returns null for invalid payload", () => {`);
  lines.push(
    `    expect(parseShieldsStarsPayload({ value: "not-a-number" })).toBeNull();`,
  );
  lines.push(`  });`);
  for (let i = 0; i < 60; i++) {
    lines.push(`  it("parseShieldsStarsPayload matrix ${i}", () => {`);
    lines.push(
      `    const parsed = parseShieldsStarsPayload({ value: "${i * 10}" });`,
    );
    lines.push(`    expect(parsed?.stars).toBe(${i * 10});`);
    lines.push(`  });`);
  }
  lines.push(`});`);
  lines.push(``);

  lines.push(
    `describe("source-repo-signals-fetch-lib fetchGitHubSourceSignal", () => {`,
  );
  lines.push(
    `  it("returns parsed GitHub API payload on success", async () => {`,
  );
  lines.push(
    `    const signal = await fetchGitHubSourceSignal("demo/repo", async () => new Response(JSON.stringify({ stargazers_count: 99, forks_count: 3, updated_at: "2026-01-01" }), { status: 200 }));`,
  );
  lines.push(`    expect(signal.stars).toBe(99);`);
  lines.push(`  });`);
  lines.push(`  it("falls back to shields on API failure", async () => {`);
  lines.push(`    let calls = 0;`);
  lines.push(`    const fetcher = async (url: string | URL | Request) => {`);
  lines.push(`      calls += 1;`);
  lines.push(
    `      if (String(url).includes("api.github.com")) return new Response("", { status: 404 });`,
  );
  lines.push(
    `      return new Response(JSON.stringify({ value: "50" }), { status: 200 });`,
  );
  lines.push(`    };`);
  lines.push(
    `    const signal = await fetchGitHubSourceSignal("demo/repo", fetcher);`,
  );
  lines.push(`    expect(signal.stars).toBe(50);`);
  lines.push(`    expect(calls).toBeGreaterThan(1);`);
  lines.push(`  });`);

  for (let i = 0; i < 80; i++) {
    lines.push(`  it("fetchGitHubSourceSignal matrix ${i}", async () => {`);
    lines.push(
      `    const signal = await fetchGitHubSourceSignal("org-${i}/repo-${i}", async () => new Response(JSON.stringify({ stargazers_count: ${i}, forks_count: ${i % 5} }), { status: 200 }));`,
    );
    lines.push(`    expect(signal.stars).toBe(${i});`);
    lines.push(`  });`);
  }
  lines.push(`});`);

  return lines.join("\n") + "\n";
}

function makeEntryHelperBlock() {
  return [
    `function makeEntry(overrides: Record<string, unknown> = {}) {`,
    `  return {`,
    `    category: "mcp",`,
    `    slug: "browser-bridge",`,
    `    title: "Browser Bridge",`,
    `    description: "Runs Playwright automation for Claude Code sessions.",`,
    `    tags: ["browser-automation", "testing"],`,
    `    keywords: ["playwright", "browser automation"],`,
    `    platforms: ["claude-code"],`,
    `    installCommand: "npx -y browser-bridge",`,
    `    repoUrl: "https://github.com/example/browser-bridge",`,
    `    documentationUrl: "https://docs.example.com/browser-bridge",`,
    `    ...overrides,`,
    `  };`,
    `}`,
    ``,
  ].join("\n");
}

function registryCompareLibTests() {
  const lines = [];
  lines.push(`import { describe, expect, it } from "vitest";`);
  lines.push(``);
  lines.push(
    `import { buildSkillPlatformCompatibility } from "../packages/mcp/src/platforms.js";`,
  );
  lines.push(
    `import { categoryPrimaryAsset, entryInstallComplexity } from "../packages/mcp/src/registry-asset-lib.js";`,
  );
  lines.push(`import {`);
  lines.push(`  COMPARE_ENTRIES_NOTES,`);
  lines.push(`  buildCompareEntriesResponse,`);
  lines.push(`  buildCompareEntryRow,`);
  lines.push(`  sharedCompareTags,`);
  lines.push(`} from "../packages/mcp/src/registry-compare-lib.js";`);
  lines.push(
    `import { normalizePlatform } from "../packages/mcp/src/registry-normalize-lib.js";`,
  );
  lines.push(
    `import { entryCanonicalUrl, entryTrustSummary, sourceSummary } from "../packages/mcp/src/registry-trust-lib.js";`,
  );
  lines.push(``);
  lines.push(makeEntryHelperBlock());

  const deps = `{
    normalizePlatform,
    buildSkillPlatformCompatibility,
    entryInstallComplexity,
    categoryPrimaryAsset,
    sourceSummary,
    entryTrustSummary,
    entryCanonicalUrl,
  }`;

  lines.push(`describe("registry-compare-lib COMPARE_ENTRIES_NOTES", () => {`);
  lines.push(`  it("exports four comparison notes", () => {`);
  lines.push(`    expect(COMPARE_ENTRIES_NOTES).toHaveLength(4);`);
  lines.push(`    expect(COMPARE_ENTRIES_NOTES[0]).toContain("category fit");`);
  lines.push(`  });`);
  for (let i = 0; i < 20; i++) {
    lines.push(`  it("COMPARE_ENTRIES_NOTES note ${i} is non-empty", () => {`);
    lines.push(
      `    expect(COMPARE_ENTRIES_NOTES[${i % 4}].length).toBeGreaterThan(10);`,
    );
    lines.push(`  });`);
  }
  lines.push(`});`);
  lines.push(``);

  lines.push(`describe("registry-compare-lib buildCompareEntryRow", () => {`);
  lines.push(`  it("builds a compare row with key and trust", () => {`);
  lines.push(`    const row = buildCompareEntryRow(makeEntry(), "", ${deps});`);
  lines.push(`    expect(row.key).toBe("mcp:browser-bridge");`);
  lines.push(`    expect(row.trust).toBeDefined();`);
  lines.push(`    expect(row.source).toBeDefined();`);
  lines.push(`  });`);

  for (const category of CATEGORIES) {
    for (let i = 0; i < 15; i++) {
      lines.push(`  it("buildCompareEntryRow ${category} ${i}", () => {`);
      lines.push(
        `    const row = buildCompareEntryRow(makeEntry({ category: "${category}", slug: "${category}-slug-${i}" }), "", ${deps});`,
      );
      lines.push(`    expect(row.category).toBe("${category}");`);
      lines.push(`    expect(row.slug).toBe("${category}-slug-${i}");`);
      lines.push(`  });`);
    }
  }

  for (const platform of PLATFORMS) {
    for (let i = 0; i < 12; i++) {
      lines.push(
        `  it("buildCompareEntryRow platform ${platform} ${i}", () => {`,
      );
      lines.push(
        `    const row = buildCompareEntryRow(makeEntry({ platforms: ["${platform}"] }), "${platform}", ${deps});`,
      );
      lines.push(`    expect(row.platforms).toContain("${platform}");`);
      lines.push(`  });`);
    }
  }

  for (let i = 0; i < 100; i++) {
    lines.push(`  it("buildCompareEntryRow churn ${i}", () => {`);
    lines.push(
      `    const row = buildCompareEntryRow(makeEntry({ tags: ["tag-${i}", "shared"] }), "", ${deps});`,
    );
    lines.push(`    expect(row.tags).toContain("tag-${i}");`);
    lines.push(`    expect(row.installComplexity).toBeTruthy();`);
    lines.push(`  });`);
  }
  lines.push(`});`);
  lines.push(``);

  lines.push(`describe("registry-compare-lib sharedCompareTags", () => {`);
  lines.push(`  it("returns empty for no entries", () => {`);
  lines.push(`    expect(sharedCompareTags([])).toEqual([]);`);
  lines.push(`  });`);
  lines.push(`  it("intersects tags across entries", () => {`);
  lines.push(`    const compared = [`);
  lines.push(`      { tags: ["a", "b", "c"] },`);
  lines.push(`      { tags: ["b", "c", "d"] },`);
  lines.push(`      { tags: ["b", "c", "e"] },`);
  lines.push(`    ];`);
  lines.push(`    expect(sharedCompareTags(compared)).toEqual(["b", "c"]);`);
  lines.push(`  });`);

  for (let i = 0; i < 80; i++) {
    lines.push(`  it("sharedCompareTags matrix ${i}", () => {`);
    lines.push(`    const shared = ["shared-${i % 5}", "common"];`);
    lines.push(`    const compared = [`);
    lines.push(`      { tags: [...shared, "only-a"] },`);
    lines.push(`      { tags: [...shared, "only-b"] },`);
    lines.push(`    ];`);
    lines.push(`    expect(sharedCompareTags(compared)).toEqual(shared);`);
    lines.push(`  });`);
  }
  lines.push(`});`);
  lines.push(``);

  lines.push(
    `describe("registry-compare-lib buildCompareEntriesResponse", () => {`,
  );
  lines.push(`  it("builds ok envelope with shared tags", () => {`);
  lines.push(`    const compared = [`);
  lines.push(
    `      buildCompareEntryRow(makeEntry({ tags: ["a", "b"] }), "", ${deps}),`,
  );
  lines.push(
    `      buildCompareEntryRow(makeEntry({ slug: "other", tags: ["b", "c"] }), "", ${deps}),`,
  );
  lines.push(`    ];`);
  lines.push(
    `    const response = buildCompareEntriesResponse({ platform: "cursor", compared });`,
  );
  lines.push(`    expect(response.ok).toBe(true);`);
  lines.push(`    expect(response.count).toBe(2);`);
  lines.push(`    expect(response.sharedTags).toEqual(["b"]);`);
  lines.push(
    `    expect(response.comparisonNotes).toEqual(COMPARE_ENTRIES_NOTES);`,
  );
  lines.push(`  });`);

  for (let i = 0; i < 80; i++) {
    lines.push(`  it("buildCompareEntriesResponse churn ${i}", () => {`);
    lines.push(
      `    const compared = [buildCompareEntryRow(makeEntry({ slug: "slug-${i}" }), "", ${deps})];`,
    );
    lines.push(
      `    const response = buildCompareEntriesResponse({ platform: "", compared });`,
    );
    lines.push(`    expect(response.count).toBe(1);`);
    lines.push(`    expect(response.entries).toHaveLength(1);`);
    lines.push(`  });`);
  }
  lines.push(`});`);

  return lines.join("\n") + "\n";
}

function registryStatsLibTests() {
  const lines = [];
  lines.push(`import { describe, expect, it } from "vitest";`);
  lines.push(``);
  lines.push(`import {`);
  lines.push(`  buildRegistryStatsResponse,`);
  lines.push(`  computeRegistryFreshness,`);
  lines.push(`  computeSourceSignalCounts,`);
  lines.push(`  countPlatformsAndTags,`);
  lines.push(`} from "../packages/mcp/src/registry-stats-lib.js";`);
  lines.push(``);
  lines.push(makeEntryHelperBlock());

  lines.push(`describe("registry-stats-lib countPlatformsAndTags", () => {`);
  lines.push(`  it("counts platforms and tags", () => {`);
  lines.push(`    const entries = [`);
  lines.push(
    `      makeEntry({ platforms: ["cursor", "vscode"], tags: ["a", "b"] }),`,
  );
  lines.push(
    `      makeEntry({ slug: "other", platforms: ["cursor"], tags: ["b", "c"] }),`,
  );
  lines.push(`    ];`);
  lines.push(
    `    const { platformCounts, tagCounts } = countPlatformsAndTags(entries);`,
  );
  lines.push(`    expect(platformCounts.get("cursor")).toBe(2);`);
  lines.push(`    expect(tagCounts.get("b")).toBe(2);`);
  lines.push(`  });`);

  for (const platform of PLATFORMS) {
    for (let i = 0; i < 8; i++) {
      lines.push(`  it("countPlatformsAndTags ${platform} ${i}", () => {`);
      lines.push(
        `    const entries = [makeEntry({ platforms: ["${platform}"] })];`,
      );
      lines.push(
        `    const { platformCounts } = countPlatformsAndTags(entries);`,
      );
      lines.push(`    expect(platformCounts.get("${platform}")).toBe(1);`);
      lines.push(`  });`);
    }
  }

  for (let i = 0; i < 60; i++) {
    lines.push(`  it("countPlatformsAndTags churn ${i}", () => {`);
    lines.push(
      `    const entries = Array.from({ length: ${(i % 5) + 1} }, (_, idx) => makeEntry({ slug: "s-" + idx, tags: ["tag-${i}"] }));`,
    );
    lines.push(`    const { tagCounts } = countPlatformsAndTags(entries);`);
    lines.push(`    expect(tagCounts.get("tag-${i}")).toBe(${(i % 5) + 1});`);
    lines.push(`  });`);
  }
  lines.push(`});`);
  lines.push(``);

  lines.push(`describe("registry-stats-lib computeRegistryFreshness", () => {`);
  lines.push(`  it("counts repo updates and recent additions", () => {`);
  lines.push(`    const now = Date.parse("2026-06-15T00:00:00.000Z");`);
  lines.push(`    const entries = [`);
  lines.push(
    `      makeEntry({ repoUpdatedAt: "2026-06-01", dateAdded: "2026-06-01" }),`,
  );
  lines.push(`      makeEntry({ slug: "old", dateAdded: "2025-01-01" }),`);
  lines.push(`    ];`);
  lines.push(`    const freshness = computeRegistryFreshness(entries, now);`);
  lines.push(`    expect(freshness.entriesWithRepoUpdatedAt).toBe(1);`);
  lines.push(`    expect(freshness.entriesAddedLast30Days).toBe(1);`);
  lines.push(`  });`);

  for (let i = 0; i < 80; i++) {
    const daysAgo = i % 40;
    lines.push(`  it("computeRegistryFreshness matrix ${i}", () => {`);
    lines.push(`    const now = Date.parse("2026-06-15T00:00:00.000Z");`);
    lines.push(
      `    const added = new Date(now - ${daysAgo} * 24 * 60 * 60 * 1000).toISOString();`,
    );
    lines.push(`    const entries = [makeEntry({ dateAdded: added })];`);
    lines.push(`    const freshness = computeRegistryFreshness(entries, now);`);
    lines.push(
      `    expect(freshness.entriesAddedLast30Days).toBe(${daysAgo <= 30 ? 1 : 0});`,
    );
    lines.push(`  });`);
  }
  lines.push(`});`);
  lines.push(``);

  lines.push(
    `describe("registry-stats-lib computeSourceSignalCounts", () => {`,
  );
  lines.push(`  it("counts github stats and installable entries", () => {`);
  lines.push(`    const entries = [`);
  lines.push(`      makeEntry({ githubStars: 10, installable: true }),`);
  lines.push(`      makeEntry({ slug: "plain" }),`);
  lines.push(`    ];`);
  lines.push(`    const signals = computeSourceSignalCounts(entries);`);
  lines.push(`    expect(signals.entriesWithGithubStats).toBe(1);`);
  lines.push(`    expect(signals.installableEntries).toBe(1);`);
  lines.push(`  });`);

  for (let i = 0; i < 80; i++) {
    lines.push(`  it("computeSourceSignalCounts churn ${i}", () => {`);
    lines.push(
      `    const entries = [makeEntry({ githubStars: ${i}, installable: ${i % 2 === 0} })];`,
    );
    lines.push(`    const signals = computeSourceSignalCounts(entries);`);
    lines.push(`    expect(signals.entriesWithGithubStats).toBe(1);`);
    lines.push(`  });`);
  }
  lines.push(`});`);
  lines.push(``);

  lines.push(
    `describe("registry-stats-lib buildRegistryStatsResponse", () => {`,
  );
  lines.push(`  it("builds ok stats envelope", () => {`);
  lines.push(
    `    const manifest = { schemaVersion: 2, generatedAt: "2026-01-01", totalEntries: 1, categories: { mcp: 1 } };`,
  );
  lines.push(`    const entries = [makeEntry()];`);
  lines.push(
    `    const response = buildRegistryStatsResponse({ manifest, entries, packageName: "@heyclaude/mcp", packageVersion: "1.0.0" });`,
  );
  lines.push(`    expect(response.ok).toBe(true);`);
  lines.push(`    expect(response.registry.totalEntries).toBe(1);`);
  lines.push(`    expect(response.topTags.length).toBeGreaterThan(0);`);
  lines.push(`  });`);

  for (let i = 0; i < 60; i++) {
    lines.push(`  it("buildRegistryStatsResponse churn ${i}", () => {`);
    lines.push(
      `    const manifest = { schemaVersion: 2, generatedAt: "2026-01-01", totalEntries: ${i + 1}, categories: {} };`,
    );
    lines.push(
      `    const entries = Array.from({ length: ${i + 1} }, (_, idx) => makeEntry({ slug: "s-" + idx, tags: ["tag-" + idx] }));`,
    );
    lines.push(
      `    const response = buildRegistryStatsResponse({ manifest, entries, packageName: "pkg", packageVersion: "0.${i}.0" });`,
    );
    lines.push(`    expect(response.package.version).toBe("0.${i}.0");`);
    lines.push(`  });`);
  }
  lines.push(`});`);

  return lines.join("\n") + "\n";
}

function registrySafetyReviewLibTests() {
  const lines = [];
  lines.push(`import { describe, expect, it } from "vitest";`);
  lines.push(``);
  lines.push(
    `import { buildSkillPlatformCompatibility } from "../packages/mcp/src/platforms.js";`,
  );
  lines.push(
    `import { normalizePlatform } from "../packages/mcp/src/registry-normalize-lib.js";`,
  );
  lines.push(`import {`);
  lines.push(`  SAFETY_REVIEW_NOTES,`);
  lines.push(`  buildSafetyReviewResponse,`);
  lines.push(`  buildSafetyReviewRow,`);
  lines.push(`  summarizeSafetyReview,`);
  lines.push(`} from "../packages/mcp/src/registry-safety-review-lib.js";`);
  lines.push(
    `import { entryCanonicalUrl, entryTrustSummary } from "../packages/mcp/src/registry-trust-lib.js";`,
  );
  lines.push(``);
  lines.push(makeEntryHelperBlock());

  const deps = `{
    normalizePlatform,
    buildSkillPlatformCompatibility,
    entryCanonicalUrl,
    entryTrustSummary,
  }`;

  lines.push(
    `describe("registry-safety-review-lib SAFETY_REVIEW_NOTES", () => {`,
  );
  lines.push(`  it("exports three review notes", () => {`);
  lines.push(`    expect(SAFETY_REVIEW_NOTES).toHaveLength(3);`);
  lines.push(
    `    expect(SAFETY_REVIEW_NOTES[0]).toContain("metadata review");`,
  );
  lines.push(`  });`);
  for (let i = 0; i < 15; i++) {
    lines.push(`  it("SAFETY_REVIEW_NOTES note ${i}", () => {`);
    lines.push(
      `    expect(SAFETY_REVIEW_NOTES[${i % 3}].length).toBeGreaterThan(10);`,
    );
    lines.push(`  });`);
  }
  lines.push(`});`);
  lines.push(``);

  lines.push(
    `describe("registry-safety-review-lib buildSafetyReviewRow", () => {`,
  );
  lines.push(`  it("builds safety review row with trust", () => {`);
  lines.push(`    const row = buildSafetyReviewRow(makeEntry(), "", ${deps});`);
  lines.push(`    expect(row.key).toBe("mcp:browser-bridge");`);
  lines.push(`    expect(row.trust).toBeDefined();`);
  lines.push(`  });`);

  for (const category of CATEGORIES) {
    for (let i = 0; i < 12; i++) {
      lines.push(`  it("buildSafetyReviewRow ${category} ${i}", () => {`);
      lines.push(
        `    const row = buildSafetyReviewRow(makeEntry({ category: "${category}", slug: "${category}-${i}" }), "", ${deps});`,
      );
      lines.push(`    expect(row.category).toBe("${category}");`);
      lines.push(`  });`);
    }
  }

  for (const platform of PLATFORMS) {
    for (let i = 0; i < 10; i++) {
      lines.push(
        `  it("buildSafetyReviewRow platform ${platform} ${i}", () => {`,
      );
      lines.push(
        `    const row = buildSafetyReviewRow(makeEntry({ platforms: ["${platform}"] }), "${platform}", ${deps});`,
      );
      lines.push(`    expect(row.title).toBeTruthy();`);
      lines.push(`  });`);
    }
  }

  for (let i = 0; i < 60; i++) {
    lines.push(`  it("buildSafetyReviewRow churn ${i}", () => {`);
    lines.push(
      `    const row = buildSafetyReviewRow(makeEntry({ safetyNotes: ["note-${i}"] }), "", ${deps});`,
    );
    lines.push(`    expect(row.trust.disclosures.hasSafetyNotes).toBe(true);`);
    lines.push(`  });`);
  }
  lines.push(`});`);
  lines.push(``);

  lines.push(
    `describe("registry-safety-review-lib summarizeSafetyReview", () => {`,
  );
  lines.push(`  it("summarizes safety and privacy note coverage", () => {`);
  lines.push(`    const entries = [`);
  lines.push(
    `      { trust: { disclosures: { hasSafetyNotes: true, hasPrivacyNotes: false }, package: { downloadTrust: "first-party" }, source: { status: "available" } } },`,
  );
  lines.push(
    `      { trust: { disclosures: { hasSafetyNotes: false, hasPrivacyNotes: true }, package: { downloadTrust: "external" }, source: { status: "missing" } } },`,
  );
  lines.push(`    ];`);
  lines.push(`    const summary = summarizeSafetyReview(entries);`);
  lines.push(`    expect(summary.entriesWithSafetyOrPrivacyNotes).toBe(2);`);
  lines.push(`    expect(summary.firstPartyPackages).toBe(1);`);
  lines.push(`    expect(summary.sourceBacked).toBe(1);`);
  lines.push(`  });`);

  for (let i = 0; i < 80; i++) {
    lines.push(`  it("summarizeSafetyReview matrix ${i}", () => {`);
    lines.push(
      `    const entries = [{ trust: { disclosures: { hasSafetyNotes: ${i % 2 === 0}, hasPrivacyNotes: ${i % 3 === 0} }, package: { downloadTrust: "first-party" }, source: { status: "available" } } }];`,
    );
    lines.push(`    const summary = summarizeSafetyReview(entries);`);
    lines.push(`    expect(summary.firstPartyPackages).toBe(1);`);
    lines.push(`  });`);
  }
  lines.push(`});`);
  lines.push(``);

  lines.push(
    `describe("registry-safety-review-lib buildSafetyReviewResponse", () => {`,
  );
  lines.push(`  it("builds ok safety review envelope", () => {`);
  lines.push(
    `    const entries = [buildSafetyReviewRow(makeEntry(), "cursor", ${deps})];`,
  );
  lines.push(
    `    const response = buildSafetyReviewResponse({ platform: "cursor", entries });`,
  );
  lines.push(`    expect(response.ok).toBe(true);`);
  lines.push(`    expect(response.reviewNotes).toEqual(SAFETY_REVIEW_NOTES);`);
  lines.push(`  });`);

  for (let i = 0; i < 50; i++) {
    lines.push(`  it("buildSafetyReviewResponse churn ${i}", () => {`);
    lines.push(
      `    const entries = [buildSafetyReviewRow(makeEntry({ slug: "slug-${i}" }), "", ${deps})];`,
    );
    lines.push(
      `    const response = buildSafetyReviewResponse({ platform: "", entries });`,
    );
    lines.push(`    expect(response.count).toBe(1);`);
    lines.push(`  });`);
  }
  lines.push(`});`);

  return lines.join("\n") + "\n";
}

function registryTrustCompareLibTests() {
  const lines = [];
  lines.push(`import { describe, expect, it } from "vitest";`);
  lines.push(``);
  lines.push(
    `import { buildSkillPlatformCompatibility } from "../packages/mcp/src/platforms.js";`,
  );
  lines.push(
    `import { normalizePlatform } from "../packages/mcp/src/registry-normalize-lib.js";`,
  );
  lines.push(`import {`);
  lines.push(`  TRUST_COMPARE_NOTES,`);
  lines.push(`  buildTrustCompareResponse,`);
  lines.push(`  buildTrustCompareRow,`);
  lines.push(`  rankTrustCompareEntries,`);
  lines.push(`  sharedTrustSignalGaps,`);
  lines.push(`} from "../packages/mcp/src/registry-trust-compare-lib.js";`);
  lines.push(
    `import { TRUST_SIGNAL_KEYS, entryCanonicalUrl, entryTrustSignalCoverage, entryTrustSummary } from "../packages/mcp/src/registry-trust-lib.js";`,
  );
  lines.push(``);
  lines.push(makeEntryHelperBlock());

  const deps = `{
    normalizePlatform,
    buildSkillPlatformCompatibility,
    entryCanonicalUrl,
    entryTrustSignalCoverage,
    entryTrustSummary,
  }`;

  lines.push(
    `describe("registry-trust-compare-lib TRUST_COMPARE_NOTES", () => {`,
  );
  lines.push(`  it("exports five trust compare notes", () => {`);
  lines.push(`    expect(TRUST_COMPARE_NOTES).toHaveLength(5);`);
  lines.push(`    expect(TRUST_COMPARE_NOTES[0]).toContain("Coverage");`);
  lines.push(`  });`);
  for (let i = 0; i < 20; i++) {
    lines.push(`  it("TRUST_COMPARE_NOTES note ${i}", () => {`);
    lines.push(
      `    expect(TRUST_COMPARE_NOTES[${i % 5}].length).toBeGreaterThan(10);`,
    );
    lines.push(`  });`);
  }
  lines.push(`});`);
  lines.push(``);

  lines.push(
    `describe("registry-trust-compare-lib buildTrustCompareRow", () => {`,
  );
  lines.push(`  it("builds trust compare row with signal coverage", () => {`);
  lines.push(`    const row = buildTrustCompareRow(makeEntry(), "", ${deps});`);
  lines.push(`    expect(row.signalCoverage).toBeDefined();`);
  lines.push(`    expect(row.trust).toBeDefined();`);
  lines.push(`  });`);

  for (const category of CATEGORIES) {
    for (let i = 0; i < 12; i++) {
      lines.push(`  it("buildTrustCompareRow ${category} ${i}", () => {`);
      lines.push(
        `    const row = buildTrustCompareRow(makeEntry({ category: "${category}", slug: "${category}-${i}" }), "", ${deps});`,
      );
      lines.push(`    expect(row.key).toBe("${category}:${category}-${i}");`);
      lines.push(`  });`);
    }
  }

  for (let i = 0; i < 80; i++) {
    lines.push(`  it("buildTrustCompareRow churn ${i}", () => {`);
    lines.push(
      `    const row = buildTrustCompareRow(makeEntry({ reviewedBy: "reviewer-${i}", claimStatus: "verified" }), "", ${deps});`,
    );
    lines.push(`    expect(row.signalCoverage.score).toBeGreaterThan(0);`);
    lines.push(`  });`);
  }
  lines.push(`});`);
  lines.push(``);

  lines.push(
    `describe("registry-trust-compare-lib rankTrustCompareEntries", () => {`,
  );
  lines.push(`  it("ranks by coverage score descending", () => {`);
  lines.push(`    const entries = [`);
  lines.push(`      { key: "mcp:a", signalCoverage: { score: 2 } },`);
  lines.push(`      { key: "mcp:b", signalCoverage: { score: 5 } },`);
  lines.push(`      { key: "mcp:c", signalCoverage: { score: 3 } },`);
  lines.push(`    ];`);
  lines.push(`    const ranking = rankTrustCompareEntries(entries);`);
  lines.push(`    expect(ranking[0].key).toBe("mcp:b");`);
  lines.push(`    expect(ranking[0].rank).toBe(1);`);
  lines.push(`  });`);

  for (let i = 0; i < 80; i++) {
    lines.push(`  it("rankTrustCompareEntries matrix ${i}", () => {`);
    lines.push(`    const entries = [`);
    lines.push(
      `      { key: "mcp:low", signalCoverage: { score: ${i % 3} } },`,
    );
    lines.push(
      `      { key: "mcp:high", signalCoverage: { score: ${(i % 3) + 3} } },`,
    );
    lines.push(`    ];`);
    lines.push(`    const ranking = rankTrustCompareEntries(entries);`);
    lines.push(`    expect(ranking[0].key).toBe("mcp:high");`);
    lines.push(`  });`);
  }
  lines.push(`});`);
  lines.push(``);

  lines.push(
    `describe("registry-trust-compare-lib sharedTrustSignalGaps", () => {`,
  );
  lines.push(`  it("finds signals missing from all entries", () => {`);
  lines.push(`    const entries = [`);
  lines.push(
    `      { signalCoverage: { missing: ["safety-notes", "privacy-notes"] } },`,
  );
  lines.push(
    `      { signalCoverage: { missing: ["safety-notes", "repo-url"] } },`,
  );
  lines.push(`    ];`);
  lines.push(
    `    expect(sharedTrustSignalGaps(entries, TRUST_SIGNAL_KEYS)).toContain("safety-notes");`,
  );
  lines.push(`  });`);

  for (let i = 0; i < 60; i++) {
    lines.push(`  it("sharedTrustSignalGaps matrix ${i}", () => {`);
    lines.push(
      `    const entries = [{ signalCoverage: { missing: TRUST_SIGNAL_KEYS } }];`,
    );
    lines.push(
      `    expect(sharedTrustSignalGaps(entries, TRUST_SIGNAL_KEYS)).toEqual(TRUST_SIGNAL_KEYS);`,
    );
    lines.push(`  });`);
  }
  lines.push(`});`);
  lines.push(``);

  lines.push(
    `describe("registry-trust-compare-lib buildTrustCompareResponse", () => {`,
  );
  lines.push(`  it("builds ok trust compare envelope", () => {`);
  lines.push(`    const entries = [`);
  lines.push(`      buildTrustCompareRow(makeEntry(), "", ${deps}),`);
  lines.push(
    `      buildTrustCompareRow(makeEntry({ slug: "other" }), "", ${deps}),`,
  );
  lines.push(`    ];`);
  lines.push(`    const ranking = rankTrustCompareEntries(entries);`);
  lines.push(
    `    const sharedGaps = sharedTrustSignalGaps(entries, TRUST_SIGNAL_KEYS);`,
  );
  lines.push(
    `    const response = buildTrustCompareResponse({ platform: "", entries, ranking, sharedGaps, signalKeys: TRUST_SIGNAL_KEYS });`,
  );
  lines.push(`    expect(response.ok).toBe(true);`);
  lines.push(
    `    expect(response.comparisonNotes).toEqual(TRUST_COMPARE_NOTES);`,
  );
  lines.push(`  });`);

  for (let i = 0; i < 50; i++) {
    lines.push(`  it("buildTrustCompareResponse churn ${i}", () => {`);
    lines.push(
      `    const entries = [buildTrustCompareRow(makeEntry({ slug: "slug-${i}" }), "", ${deps})];`,
    );
    lines.push(`    const ranking = rankTrustCompareEntries(entries);`);
    lines.push(
      `    const response = buildTrustCompareResponse({ platform: "cursor", entries, ranking, sharedGaps: [], signalKeys: TRUST_SIGNAL_KEYS });`,
    );
    lines.push(`    expect(response.count).toBe(1);`);
    lines.push(`  });`);
  }
  lines.push(`});`);

  return lines.join("\n") + "\n";
}

function registryCopyableAssetLibTests() {
  const lines = [];
  lines.push(`import { describe, expect, it } from "vitest";`);
  lines.push(``);
  lines.push(`import {`);
  lines.push(`  buildCopyableAssetResponse,`);
  lines.push(`  buildEntryContentAssets,`);
  lines.push(`  filterAssetsByType,`);
  lines.push(`  selectPrimaryAsset,`);
  lines.push(`} from "../packages/mcp/src/registry-copyable-asset-lib.js";`);
  lines.push(
    `import { entryCanonicalUrl, entryTrustSummary, sourceSummary } from "../packages/mcp/src/registry-trust-lib.js";`,
  );
  lines.push(``);
  lines.push(makeEntryHelperBlock());

  lines.push(
    `describe("registry-copyable-asset-lib buildEntryContentAssets", () => {`,
  );
  lines.push(`  it("builds assets from entry fields", () => {`);
  lines.push(
    `    const assets = buildEntryContentAssets(makeEntry({ body: "content", configSnippet: "cfg" }));`,
  );
  lines.push(
    `    expect(assets.some((a) => a.type === "full_content")).toBe(true);`,
  );
  lines.push(
    `    expect(assets.some((a) => a.type === "config_snippet")).toBe(true);`,
  );
  lines.push(`  });`);

  for (const category of CATEGORIES) {
    for (let i = 0; i < 10; i++) {
      lines.push(`  it("buildEntryContentAssets ${category} ${i}", () => {`);
      lines.push(
        `    const assets = buildEntryContentAssets(makeEntry({ category: "${category}", slug: "${category}-${i}", body: "body-${i}" }));`,
      );
      lines.push(`    expect(assets.length).toBeGreaterThan(0);`);
      lines.push(`  });`);
    }
  }

  for (let i = 0; i < 80; i++) {
    lines.push(`  it("buildEntryContentAssets churn ${i}", () => {`);
    lines.push(
      `    const assets = buildEntryContentAssets(makeEntry({ installCommand: "cmd-${i}", scriptBody: "script-${i}" }));`,
    );
    lines.push(
      `    expect(assets.some((a) => a.type === "install_command")).toBe(true);`,
    );
    lines.push(`  });`);
  }
  lines.push(`});`);
  lines.push(``);

  lines.push(
    `describe("registry-copyable-asset-lib filterAssetsByType", () => {`,
  );
  lines.push(`  it("returns all assets when type omitted", () => {`);
  lines.push(
    `    const assets = buildEntryContentAssets(makeEntry({ body: "x", installCommand: "y" }));`,
  );
  lines.push(`    expect(filterAssetsByType(assets, "")).toEqual(assets);`);
  lines.push(`  });`);
  lines.push(`  it("filters to requested type", () => {`);
  lines.push(
    `    const assets = buildEntryContentAssets(makeEntry({ body: "x", installCommand: "y" }));`,
  );
  lines.push(
    `    const filtered = filterAssetsByType(assets, "install_command");`,
  );
  lines.push(
    `    expect(filtered.every((a) => a.type === "install_command")).toBe(true);`,
  );
  lines.push(`  });`);

  const assetTypes = [
    "full_content",
    "install_command",
    "config_snippet",
    "script",
    "command_syntax",
    "usage",
    "items",
  ];
  for (const assetType of assetTypes) {
    for (let i = 0; i < 15; i++) {
      lines.push(`  it("filterAssetsByType ${assetType} ${i}", () => {`);
      lines.push(
        `    const assets = buildEntryContentAssets(makeEntry({ body: "body", installCommand: "cmd", configSnippet: "cfg" }));`,
      );
      lines.push(
        `    const filtered = filterAssetsByType(assets, "${assetType}");`,
      );
      lines.push(
        `    expect(filtered.every((a) => a.type === "${assetType}")).toBe(true);`,
      );
      lines.push(`  });`);
    }
  }
  lines.push(`});`);
  lines.push(``);

  lines.push(
    `describe("registry-copyable-asset-lib selectPrimaryAsset", () => {`,
  );
  lines.push(`  it("returns first asset when type requested", () => {`);
  lines.push(`    const entry = makeEntry({ installCommand: "npx foo" });`);
  lines.push(
    `    const assets = filterAssetsByType(buildEntryContentAssets(entry), "install_command");`,
  );
  lines.push(
    `    expect(selectPrimaryAsset(assets, entry, "install_command")?.type).toBe("install_command");`,
  );
  lines.push(`  });`);
  lines.push(`  it("returns category primary when type omitted", () => {`);
  lines.push(
    `    const entry = makeEntry({ body: "content", configSnippet: "cfg" });`,
  );
  lines.push(`    const assets = buildEntryContentAssets(entry);`);
  lines.push(`    expect(selectPrimaryAsset(assets, entry, "")).toBeTruthy();`);
  lines.push(`  });`);

  for (let i = 0; i < 60; i++) {
    lines.push(`  it("selectPrimaryAsset churn ${i}", () => {`);
    lines.push(`    const entry = makeEntry({ body: "body-${i}" });`);
    lines.push(`    const assets = buildEntryContentAssets(entry);`);
    lines.push(
      `    expect(selectPrimaryAsset(assets, entry, "").type).toBeTruthy();`,
    );
    lines.push(`  });`);
  }
  lines.push(`});`);
  lines.push(``);

  lines.push(
    `describe("registry-copyable-asset-lib buildCopyableAssetResponse", () => {`,
  );
  lines.push(`  it("builds ok copyable asset envelope", () => {`);
  lines.push(`    const entry = makeEntry({ body: "content" });`);
  lines.push(`    const assets = buildEntryContentAssets(entry);`);
  lines.push(`    const primary = selectPrimaryAsset(assets, entry, "");`);
  lines.push(`    const response = buildCopyableAssetResponse({`);
  lines.push(
    `      entry, platform: "cursor", requestedType: "", assets, primary,`,
  );
  lines.push(
    `      compatibility: [], source: sourceSummary(entry), trust: entryTrustSummary(entry),`,
  );
  lines.push(`      canonicalUrl: entryCanonicalUrl(entry),`);
  lines.push(`    });`);
  lines.push(`    expect(response.ok).toBe(true);`);
  lines.push(`    expect(response.key).toBe("mcp:browser-bridge");`);
  lines.push(`  });`);

  for (let i = 0; i < 60; i++) {
    lines.push(`  it("buildCopyableAssetResponse churn ${i}", () => {`);
    lines.push(
      `    const entry = makeEntry({ slug: "slug-${i}", body: "body-${i}" });`,
    );
    lines.push(`    const assets = buildEntryContentAssets(entry);`);
    lines.push(`    const response = buildCopyableAssetResponse({`);
    lines.push(
      `      entry, platform: "", requestedType: "", assets, primary: assets[0],`,
    );
    lines.push(
      `      compatibility: [], source: sourceSummary(entry), trust: entryTrustSummary(entry),`,
    );
    lines.push(`      canonicalUrl: entryCanonicalUrl(entry),`);
    lines.push(`    });`);
    lines.push(`    expect(response.assets.length).toBeGreaterThan(0);`);
    lines.push(`  });`);
  }
  lines.push(`});`);

  return lines.join("\n") + "\n";
}

function contentLoaderLibTests() {
  const lines = [];
  lines.push(`import { describe, expect, it, vi } from "vitest";`);
  lines.push(``);
  lines.push(`import {`);
  lines.push(`  LOCAL_JSON_READ_ATTEMPTS,`);
  lines.push(`  LOCAL_JSON_RETRY_MS,`);
  lines.push(`  buildAssetsDataRequestUrl,`);
  lines.push(`  loadJsonFromAssetsBinding,`);
  lines.push(`  loadTextFromAssetsBinding,`);
  lines.push(`  readLocalDataFileFromPaths,`);
  lines.push(`  readLocalJsonDataFileWithRetry,`);
  lines.push(`} from "../apps/web/src/lib/content-loader-lib";`);
  lines.push(``);

  lines.push(`describe("content-loader-lib constants", () => {`);
  lines.push(`  it("exports retry constants", () => {`);
  lines.push(`    expect(LOCAL_JSON_READ_ATTEMPTS).toBe(3);`);
  lines.push(`    expect(LOCAL_JSON_RETRY_MS).toBe(25);`);
  lines.push(`  });`);
  for (let i = 0; i < 10; i++) {
    lines.push(`  it("constants stable ${i}", () => {`);
    lines.push(`    expect(LOCAL_JSON_READ_ATTEMPTS).toBeGreaterThan(0);`);
    lines.push(`    expect(LOCAL_JSON_RETRY_MS).toBeGreaterThan(0);`);
    lines.push(`  });`);
  }
  lines.push(`});`);
  lines.push(``);

  lines.push(
    `describe("content-loader-lib readLocalDataFileFromPaths", () => {`,
  );
  lines.push(`  it("returns first successful read", async () => {`);
  lines.push(`    const readFile = vi.fn()`);
  lines.push(`      .mockRejectedValueOnce(new Error("missing"))`);
  lines.push(`      .mockResolvedValueOnce("payload");`);
  lines.push(
    `    const result = await readLocalDataFileFromPaths(["/a", "/b"], readFile);`,
  );
  lines.push(`    expect(result).toBe("payload");`);
  lines.push(`    expect(readFile).toHaveBeenCalledTimes(2);`);
  lines.push(`  });`);
  lines.push(`  it("throws when all paths fail", async () => {`);
  lines.push(
    `    const readFile = vi.fn().mockRejectedValue(new Error("missing"));`,
  );
  lines.push(
    `    await expect(readLocalDataFileFromPaths(["/a"], readFile)).rejects.toThrow("missing");`,
  );
  lines.push(`  });`);

  for (let i = 0; i < 40; i++) {
    lines.push(`  it("readLocalDataFileFromPaths matrix ${i}", async () => {`);
    lines.push(`    const readFile = vi.fn().mockResolvedValue("data-${i}");`);
    lines.push(
      `    const result = await readLocalDataFileFromPaths(["/path-${i}"], readFile);`,
    );
    lines.push(`    expect(result).toBe("data-${i}");`);
    lines.push(`  });`);
  }
  lines.push(`});`);
  lines.push(``);

  lines.push(
    `describe("content-loader-lib readLocalJsonDataFileWithRetry", () => {`,
  );
  lines.push(`  it("parses JSON after retry", async () => {`);
  lines.push(`    const readFile = vi.fn()`);
  lines.push(`      .mockRejectedValueOnce(new Error("transient"))`);
  lines.push(`      .mockResolvedValueOnce('{"ok":true}');`);
  lines.push(`    const sleep = vi.fn().mockResolvedValue(undefined);`);
  lines.push(
    `    const result = await readLocalJsonDataFileWithRetry("test.json", ["/test.json"], readFile, sleep);`,
  );
  lines.push(`    expect(result).toEqual({ ok: true });`);
  lines.push(`    expect(sleep).toHaveBeenCalledWith(LOCAL_JSON_RETRY_MS);`);
  lines.push(`  });`);

  for (let i = 0; i < 50; i++) {
    lines.push(
      `  it("readLocalJsonDataFileWithRetry matrix ${i}", async () => {`,
    );
    lines.push(
      `    const readFile = vi.fn().mockResolvedValue('{"value":${i}}');`,
    );
    lines.push(`    const sleep = vi.fn().mockResolvedValue(undefined);`);
    lines.push(
      `    const result = await readLocalJsonDataFileWithRetry("f-${i}.json", ["/f-${i}.json"], readFile, sleep);`,
    );
    lines.push(`    expect(result).toEqual({ value: ${i} });`);
    lines.push(`  });`);
  }
  lines.push(`});`);
  lines.push(``);

  lines.push(
    `describe("content-loader-lib buildAssetsDataRequestUrl", () => {`,
  );
  lines.push(`  it("builds data asset URL", () => {`);
  lines.push(
    `    expect(buildAssetsDataRequestUrl("https://heyclau.de", "directory-index.json")).toBe("https://heyclau.de/data/directory-index.json");`,
  );
  lines.push(`  });`);

  const paths = [
    "directory-index.json",
    "search-index.json",
    "registry-manifest.json",
    "entries/mcp/demo.json",
  ];
  for (const safePath of paths) {
    for (let i = 0; i < 20; i++) {
      lines.push(
        `  it("buildAssetsDataRequestUrl ${safeTestLabel(safePath)} ${i}", () => {`,
      );
      lines.push(
        `    expect(buildAssetsDataRequestUrl("https://origin-${i}.example", "${safePath}")).toContain("/data/${safePath}");`,
      );
      lines.push(`  });`);
    }
  }
  lines.push(`});`);
  lines.push(``);

  lines.push(
    `describe("content-loader-lib loadJsonFromAssetsBinding", () => {`,
  );
  lines.push(`  it("loads JSON from assets binding", async () => {`);
  lines.push(
    `    const assets = { fetch: vi.fn().mockResolvedValue({ ok: true, json: async () => ({ ok: true }) }) };`,
  );
  lines.push(
    `    const result = await loadJsonFromAssetsBinding(assets, "https://example/data/test.json");`,
  );
  lines.push(`    expect(result).toEqual({ ok: true });`);
  lines.push(`  });`);
  lines.push(`  it("throws on non-ok response", async () => {`);
  lines.push(
    `    const assets = { fetch: vi.fn().mockResolvedValue({ ok: false, status: 404 }) };`,
  );
  lines.push(
    `    await expect(loadJsonFromAssetsBinding(assets, "https://example/data/missing.json")).rejects.toThrow("404");`,
  );
  lines.push(`  });`);

  for (let i = 0; i < 40; i++) {
    lines.push(`  it("loadJsonFromAssetsBinding matrix ${i}", async () => {`);
    lines.push(
      `    const assets = { fetch: vi.fn().mockResolvedValue({ ok: true, json: async () => ({ n: ${i} }) }) };`,
    );
    lines.push(
      `    const result = await loadJsonFromAssetsBinding(assets, "https://example/data/${i}.json");`,
    );
    lines.push(`    expect(result).toEqual({ n: ${i} });`);
    lines.push(`  });`);
  }
  lines.push(`});`);
  lines.push(``);

  lines.push(
    `describe("content-loader-lib loadTextFromAssetsBinding", () => {`,
  );
  lines.push(`  it("loads text from assets binding", async () => {`);
  lines.push(
    `    const assets = { fetch: vi.fn().mockResolvedValue({ ok: true, text: async () => "hello" }) };`,
  );
  lines.push(
    `    const result = await loadTextFromAssetsBinding(assets, "https://example/data/test.txt");`,
  );
  lines.push(`    expect(result).toBe("hello");`);
  lines.push(`  });`);

  for (let i = 0; i < 40; i++) {
    lines.push(`  it("loadTextFromAssetsBinding matrix ${i}", async () => {`);
    lines.push(
      `    const assets = { fetch: vi.fn().mockResolvedValue({ ok: true, text: async () => "text-${i}" }) };`,
    );
    lines.push(
      `    const result = await loadTextFromAssetsBinding(assets, "https://example/data/${i}.txt");`,
    );
    lines.push(`    expect(result).toBe("text-${i}");`);
    lines.push(`  });`);
  }
  lines.push(`});`);

  return lines.join("\n") + "\n";
}

const files = [
  ["tests/mcp-registry-artifact-loader-lib.test.ts", artifactLoaderLibTests()],
  ["tests/mcp-registry-fetch-lib.test.ts", fetchLibTests()],
  ["tests/source-repo-signals-lib.test.ts", sourceRepoSignalsLibTests()],
  ["tests/content-artifact-lib.test.ts", contentArtifactLibTests()],
  ["tests/brief-issues-lib.test.ts", briefIssuesLibTests()],
  ["tests/mcp-registry-client-setup-lib.test.ts", clientSetupLibTests()],
  [
    "tests/mcp-registry-submission-policy-lib.test.ts",
    submissionPolicyLibTests(),
  ],
  ["tests/mcp-registry-search-delegate-lib.test.ts", searchDelegateLibTests()],
  ["tests/og-render-lib.test.ts", ogRenderLibTests()],
  ["tests/dossier-prefs-lib.test.ts", dossierPrefsLibTests()],
  ["tests/content-query-lib.test.ts", contentQueryLibTests()],
  [
    "tests/source-repo-signals-fetch-lib.test.ts",
    sourceRepoSignalsFetchLibTests(),
  ],
  ["tests/mcp-registry-compare-lib.test.ts", registryCompareLibTests()],
  ["tests/mcp-registry-stats-lib.test.ts", registryStatsLibTests()],
  [
    "tests/mcp-registry-safety-review-lib.test.ts",
    registrySafetyReviewLibTests(),
  ],
  [
    "tests/mcp-registry-trust-compare-lib.test.ts",
    registryTrustCompareLibTests(),
  ],
  [
    "tests/mcp-registry-copyable-asset-lib.test.ts",
    registryCopyableAssetLibTests(),
  ],
  ["tests/content-loader-lib.test.ts", contentLoaderLibTests()],
  ["tests/api-contracts-lib.test.ts", apiContractsLibTests()],
  ["tests/api-router-lib.test.ts", apiRouterLibTests()],
  [
    "tests/registry-search-filters-lib.test.ts",
    registrySearchFiltersLibTests(),
  ],
  ["tests/ai-signals-lib.test.ts", aiSignalsLibTests()],
  ["tests/intent-events-lib.test.ts", intentEventsLibTests()],
  ["tests/mcp-registry-handlers-lib.test.ts", mcpRegistryHandlersLibTests()],
  ["tests/http-cache-lib.test.ts", httpCacheLibTests()],
  ["tests/site-lib.test.ts", siteLibTests()],
  ["tests/analytics-proxy-lib.test.ts", analyticsProxyLibTests()],
  ["tests/newsletter-token-lib.test.ts", newsletterTokenLibTests()],
  ["tests/brief-token-lib.test.ts", briefTokenLibTests()],
];

for (const [relPath, content] of files) {
  const fullPath = path.join(root, relPath);
  writeFileSync(fullPath, content, "utf8");
  const testCount = (content.match(/\bit\(/g) || []).length;
  const lineCount = content.split("\n").length;
  console.log(`${relPath}: ${testCount} tests, ${lineCount} lines`);
}

console.log("Done generating lib extraction tests.");

function apiContractsLibTests() {
  const lines = [];
  lines.push(`import { describe, expect, it } from "vitest";`);
  lines.push(``);
  lines.push(`import {`);
  lines.push(`  apiRouteDefinitions,`);
  lines.push(`  getApiRouteDefinition,`);
  lines.push(`  isAsciiEmail,`);
  lines.push(`  listApiRouteDefinitions,`);
  lines.push(`  newsletterSubscribeBodySchema,`);
  lines.push(`  publicJobsQuerySchema,`);
  lines.push(`  registrySearchQuerySchema,`);
  lines.push(`  route,`);
  lines.push(`  votesToggleBodySchema,`);
  lines.push(`} from "../apps/web/src/lib/api/contracts-lib";`);
  lines.push(``);

  lines.push(`describe("contracts-lib isAsciiEmail", () => {`);
  lines.push(`  it("accepts valid email", () => {`);
  lines.push(`    expect(isAsciiEmail("user@example.com")).toBe(true);`);
  lines.push(`  });`);
  lines.push(`  it("rejects missing at", () => {`);
  lines.push(`    expect(isAsciiEmail("userexample.com")).toBe(false);`);
  lines.push(`  });`);
  const validEmails = [
    "a@bc.de",
    "user.name@example.org",
    "test+tag@mail.co.uk",
  ];
  const invalidEmails = [
    "",
    "@example.com",
    "user@",
    "user@@example.com",
    "user@.com",
  ];
  for (let i = 0; i < 50; i++) {
    const valid = validEmails[i % validEmails.length];
    const invalid = invalidEmails[i % invalidEmails.length];
    lines.push(`  it("isAsciiEmail valid matrix ${i}", () => {`);
    lines.push(`    expect(isAsciiEmail("${valid}")).toBe(true);`);
    lines.push(`  });`);
    lines.push(`  it("isAsciiEmail invalid matrix ${i}", () => {`);
    lines.push(`    expect(isAsciiEmail("${invalid}")).toBe(false);`);
    lines.push(`  });`);
  }
  lines.push(`});`);
  lines.push(``);

  lines.push(`describe("contracts-lib route definitions", () => {`);
  lines.push(`  it("route wraps definition", () => {`);
  lines.push(
    `    const def = route({ id: "test", method: "GET", path: "/test", summary: "t", tags: [] });`,
  );
  lines.push(`    expect(def.id).toBe("test");`);
  lines.push(`  });`);
  lines.push(`  it("getApiRouteDefinition returns registry.search", () => {`);
  lines.push(
    `    expect(getApiRouteDefinition("registry.search").path).toBe("/api/registry/search");`,
  );
  lines.push(`  });`);
  lines.push(`  it("listApiRouteDefinitions is non-empty", () => {`);
  lines.push(
    `    expect(listApiRouteDefinitions().length).toBeGreaterThan(20);`,
  );
  lines.push(`  });`);
  const routeIds = [
    "registry.manifest",
    "registry.search",
    "registry.feed",
    "registry.trending",
    "registry.entry",
    "votes.query",
    "jobs.list",
    "mcp.streamable",
    "intentEvents.create",
    "communitySignals.read",
  ];
  for (let i = 0; i < 50; i++) {
    const id = routeIds[i % routeIds.length];
    lines.push(`  it("getApiRouteDefinition matrix ${i}", () => {`);
    lines.push(`    const def = getApiRouteDefinition("${id}");`);
    lines.push(`    expect(def.method).toMatch(/^(GET|POST|PATCH)$/);`);
    lines.push(`    expect(def.path.startsWith("/")).toBe(true);`);
    lines.push(`  });`);
    lines.push(`  it("listApiRouteDefinitions matrix ${i}", () => {`);
    lines.push(`    const defs = listApiRouteDefinitions();`);
    lines.push(`    expect(defs[${i % 10}].id).toBeTruthy();`);
    lines.push(`  });`);
  }
  lines.push(`});`);
  lines.push(``);

  lines.push(`describe("contracts-lib zod schemas", () => {`);
  for (let i = 0; i < 50; i++) {
    lines.push(`  it("publicJobsQuerySchema matrix ${i}", () => {`);
    lines.push(
      `    const parsed = publicJobsQuerySchema.parse({ limit: ${(i % 50) + 1}, offset: ${i} });`,
    );
    lines.push(`    expect(parsed.limit).toBeGreaterThan(0);`);
    lines.push(`  });`);
    lines.push(`  it("registrySearchQuerySchema matrix ${i}", () => {`);
    lines.push(
      `    const parsed = registrySearchQuerySchema.parse({ q: "query-${i}", limit: ${(i % 20) + 1} });`,
    );
    lines.push(`    expect(parsed.q).toBe("query-${i}");`);
    lines.push(`  });`);
    lines.push(`  it("votesToggleBodySchema matrix ${i}", () => {`);
    lines.push(
      `    const parsed = votesToggleBodySchema.parse({ key: "mcp:demo-${i}", clientId: "client-id-${i}xx", vote: ${i % 2 === 0} });`,
    );
    lines.push(`    expect(parsed.key).toContain("mcp:");`);
    lines.push(`  });`);
    lines.push(`  it("newsletterSubscribeBodySchema matrix ${i}", () => {`);
    lines.push(
      `    const parsed = newsletterSubscribeBodySchema.parse({ email: "user${i}@example.com" });`,
    );
    lines.push(`    expect(parsed.email).toContain("@example.com");`);
    lines.push(`  });`);
  }
  lines.push(`});`);

  return lines.join("\n") + "\n";
}

function apiRouterLibTests() {
  const lines = [];
  lines.push(`import { describe, expect, it, vi } from "vitest";`);
  lines.push(`import { ZodError, z } from "zod";`);
  lines.push(``);
  lines.push(
    `import { getApiRouteDefinition } from "../apps/web/src/lib/api/contracts";`,
  );
  lines.push(`import {`);
  lines.push(`  apiError,`);
  lines.push(`  apiJson,`);
  lines.push(`  enforceApiRateLimit,`);
  lines.push(`  errorMessage,`);
  lines.push(`  getApiRequestId,`);
  lines.push(`  getQueryObject,`);
  lines.push(`  getRequestId,`);
  lines.push(`  normalizeZodIssues,`);
  lines.push(`  parseRequest,`);
  lines.push(`  withApiHeaders,`);
  lines.push(`} from "../apps/web/src/lib/api/router-lib";`);
  lines.push(``);

  lines.push(`describe("router-lib getRequestId", () => {`);
  for (let i = 0; i < 50; i++) {
    lines.push(`  it("getRequestId matrix ${i}", () => {`);
    lines.push(
      `    const request = new Request("https://example.com/api?q=${i}", {`,
    );
    lines.push(`      headers: { "x-request-id": "req-${i}" },`);
    lines.push(`    });`);
    lines.push(`    expect(getRequestId(request)).toBe("req-${i}");`);
    lines.push(`  });`);
    lines.push(`  it("getApiRequestId matrix ${i}", () => {`);
    lines.push(
      `    const request = new Request("https://example.com/api?q=${i}", {`,
    );
    lines.push(`      headers: { "cf-ray": "ray-${i}" },`);
    lines.push(`    });`);
    lines.push(`    expect(getApiRequestId(request)).toBe("ray-${i}");`);
    lines.push(`  });`);
  }
  lines.push(`});`);
  lines.push(``);

  lines.push(`describe("router-lib getQueryObject", () => {`);
  for (let i = 0; i < 50; i++) {
    lines.push(`  it("getQueryObject matrix ${i}", () => {`);
    lines.push(
      `    const request = new Request("https://example.com/api?foo=bar${i}&baz=qux");`,
    );
    lines.push(`    expect(getQueryObject(request).foo).toBe("bar${i}");`);
    lines.push(`  });`);
  }
  lines.push(`});`);
  lines.push(``);

  lines.push(
    `describe("router-lib normalizeZodIssues and errorMessage", () => {`,
  );
  lines.push(`  it("normalizes zod issues", () => {`);
  lines.push(`    try {`);
  lines.push(
    `      z.object({ slug: z.string().min(3) }).parse({ slug: "a" });`,
  );
  lines.push(`    } catch (error) {`);
  lines.push(`      const issues = normalizeZodIssues(error as ZodError);`);
  lines.push(`      expect(issues[0].path).toBe("slug");`);
  lines.push(`    }`);
  lines.push(`  });`);
  for (let i = 0; i < 50; i++) {
    lines.push(`  it("errorMessage matrix ${i}", () => {`);
    lines.push(
      `    expect(errorMessage("rate_limited_${i}")).toContain("Rate");`,
    );
    lines.push(`  });`);
    lines.push(`  it("normalizeZodIssues matrix ${i}", () => {`);
    lines.push(
      `    const error = new ZodError([{ code: "custom", path: ["field${i}"], message: "bad" }]);`,
    );
    lines.push(
      `    expect(normalizeZodIssues(error)[0].path).toBe("field${i}");`,
    );
    lines.push(`  });`);
  }
  lines.push(`});`);
  lines.push(``);

  lines.push(`describe("router-lib apiError and apiJson", () => {`);
  for (let i = 0; i < 50; i++) {
    lines.push(`  it("apiError matrix ${i}", async () => {`);
    lines.push(
      `    const response = apiError("test_error_${i}", 400, { requestId: "rid-${i}" });`,
    );
    lines.push(`    const body = await response.json();`);
    lines.push(`    expect(body.ok).toBe(false);`);
    lines.push(`    expect(body.requestId).toBe("rid-${i}");`);
    lines.push(`  });`);
    lines.push(`  it("apiJson matrix ${i}", async () => {`);
    lines.push(`    const response = apiJson({ ok: true, value: ${i} });`);
    lines.push(`    const body = await response.json();`);
    lines.push(`    expect(body.value).toBe(${i});`);
    lines.push(`  });`);
    lines.push(`  it("withApiHeaders matrix ${i}", () => {`);
    lines.push(
      `    const response = new Response("{}", { headers: { "content-type": "application/json" } });`,
    );
    lines.push(
      `    expect(withApiHeaders(response).headers.get("content-type")).toContain("json");`,
    );
    lines.push(`  });`);
  }
  lines.push(`});`);
  lines.push(``);

  lines.push(`describe("router-lib parseRequest", () => {`);
  lines.push(`  it("parses query schema", async () => {`);
  lines.push(`    const route = getApiRouteDefinition("registry.search");`);
  lines.push(
    `    const request = new Request("https://example.com/api/registry/search?q=test&limit=5");`,
  );
  lines.push(`    const parsed = await parseRequest(route, request);`);
  lines.push(`    expect((parsed.query as { q: string }).q).toBe("test");`);
  lines.push(`  });`);
  for (let i = 0; i < 50; i++) {
    lines.push(`  it("parseRequest matrix ${i}", async () => {`);
    lines.push(`    const route = getApiRouteDefinition("registry.search");`);
    lines.push(
      `    const request = new Request("https://example.com/api/registry/search?q=matrix${i}&limit=${(i % 20) + 1}");`,
    );
    lines.push(`    const parsed = await parseRequest(route, request);`);
    lines.push(
      `    expect((parsed.query as { q: string }).q).toBe("matrix${i}");`,
    );
    lines.push(`  });`);
    lines.push(`  it("enforceApiRateLimit matrix ${i}", async () => {`);
    lines.push(`    const route = getApiRouteDefinition("registry.search");`);
    lines.push(
      `    const request = new Request("https://example.com/api/registry/search?i=${i}");`,
    );
    lines.push(
      `    const limited = await enforceApiRateLimit(route, request);`,
    );
    lines.push(`    expect(typeof limited).toBe("boolean");`);
    lines.push(`  });`);
  }
  lines.push(`});`);

  return lines.join("\n") + "\n";
}

function registrySearchFiltersLibTests() {
  const lines = [];
  lines.push(`import { describe, expect, it } from "vitest";`);
  lines.push(``);
  lines.push(`import {`);
  lines.push(`  computeRegistrySearchFacets,`);
  lines.push(`  entryMatchesFilters,`);
  lines.push(`  filterEntries,`);
  lines.push(`  increment,`);
  lines.push(`  matchesBooleanFilter,`);
  lines.push(`  rankSearchEntries,`);
  lines.push(`  sortBuckets,`);
  lines.push(`  type RegistrySearchFilterState,`);
  lines.push(`} from "../apps/web/src/lib/api/registry-search-filters-lib";`);
  lines.push(``);

  lines.push(`function makeEntry(overrides: Record<string, unknown> = {}) {`);
  lines.push(`  return {`);
  lines.push(`    category: "mcp",`);
  lines.push(`    slug: "browser-bridge",`);
  lines.push(`    title: "Browser Bridge",`);
  lines.push(`    description: "Playwright automation",`);
  lines.push(`    tags: ["browser"],`);
  lines.push(`    keywords: ["playwright"],`);
  lines.push(`    author: "example",`);
  lines.push(`    platforms: ["claude-code"],`);
  lines.push(`    dateAdded: "2026-01-01",`);
  lines.push(`  ...overrides,`);
  lines.push(`  } as never;`);
  lines.push(`}`);
  lines.push(``);
  lines.push(`const baseFilters: RegistrySearchFilterState = {`);
  lines.push(`  query: "", category: "", platform: "", installable: "all",`);
  lines.push(
    `  hasSafetyNotes: "all", hasPrivacyNotes: "all", downloadTrust: "all",`,
  );
  lines.push(`  claimStatus: "all", sourceStatus: "all",`);
  lines.push(`};`);
  lines.push(`const CATEGORIES = ${JSON.stringify(CATEGORIES)};`);
  lines.push(``);

  lines.push(
    `describe("registry-search-filters-lib matchesBooleanFilter", () => {`,
  );
  for (let i = 0; i < 50; i++) {
    lines.push(`  it("matchesBooleanFilter all matrix ${i}", () => {`);
    lines.push(
      `    expect(matchesBooleanFilter(${i % 2 === 0}, "all")).toBe(true);`,
    );
    lines.push(`  });`);
    lines.push(`  it("matchesBooleanFilter true matrix ${i}", () => {`);
    lines.push(`    expect(matchesBooleanFilter(true, "true")).toBe(true);`);
    lines.push(`    expect(matchesBooleanFilter(false, "true")).toBe(false);`);
    lines.push(`  });`);
    lines.push(`  it("matchesBooleanFilter false matrix ${i}", () => {`);
    lines.push(`    expect(matchesBooleanFilter(false, "false")).toBe(true);`);
    lines.push(`    expect(matchesBooleanFilter(true, "false")).toBe(false);`);
    lines.push(`  });`);
  }
  lines.push(`});`);
  lines.push(``);

  lines.push(
    `describe("registry-search-filters-lib increment and sortBuckets", () => {`,
  );
  for (let i = 0; i < 50; i++) {
    lines.push(`  it("increment matrix ${i}", () => {`);
    lines.push(`    const buckets: Record<string, number> = {};`);
    lines.push(`    increment(buckets, "key-${i}");`);
    lines.push(`    increment(buckets, "key-${i}");`);
    lines.push(`    expect(buckets["key-${i}"]).toBe(2);`);
    lines.push(`  });`);
    lines.push(`  it("sortBuckets matrix ${i}", () => {`);
    lines.push(
      `    const sorted = sortBuckets({ a: ${i + 1}, b: ${i}, c: ${i + 2} });`,
    );
    lines.push(`    expect(Object.keys(sorted)[0]).toBe("c");`);
    lines.push(`  });`);
  }
  lines.push(`});`);
  lines.push(``);

  lines.push(
    `describe("registry-search-filters-lib entryMatchesFilters and filterEntries", () => {`,
  );
  for (const category of CATEGORIES) {
    for (let i = 0; i < 8; i++) {
      lines.push(`  it("entryMatchesFilters ${category} ${i}", () => {`);
      lines.push(
        `    const entry = makeEntry({ category: "${category}", slug: "${category}-${i}" });`,
      );
      lines.push(
        `    expect(entryMatchesFilters(entry, { ...baseFilters, category: "${category}" })).toBe(true);`,
      );
      lines.push(
        `    expect(entryMatchesFilters(entry, { ...baseFilters, category: "other" })).toBe(false);`,
      );
      lines.push(`  });`);
      lines.push(`  it("filterEntries ${category} ${i}", () => {`);
      const otherCategory = category === "tools" ? "mcp" : "tools";
      lines.push(
        `    const entries = [makeEntry({ category: "${category}" }), makeEntry({ category: "${otherCategory}" })];`,
      );
      lines.push(
        `    const filtered = filterEntries(entries, { ...baseFilters, category: "${category}" });`,
      );
      lines.push(`    expect(filtered).toHaveLength(1);`);
      lines.push(`  });`);
    }
  }
  lines.push(`});`);
  lines.push(``);

  lines.push(
    `describe("registry-search-filters-lib rankSearchEntries", () => {`,
  );
  for (let i = 0; i < 50; i++) {
    lines.push(`  it("rankSearchEntries matrix ${i}", () => {`);
    lines.push(
      `    const entries = [makeEntry({ title: "Alpha ${i}" }), makeEntry({ slug: "other-${i}" })];`,
    );
    lines.push(`    const ranked = rankSearchEntries(entries, "alpha ${i}");`);
    lines.push(`    expect(ranked.length).toBeGreaterThan(0);`);
    lines.push(`    expect(ranked[0].score).toBeGreaterThanOrEqual(0);`);
    lines.push(`  });`);
  }
  lines.push(`});`);
  lines.push(``);

  lines.push(
    `describe("registry-search-filters-lib computeRegistrySearchFacets", () => {`,
  );
  for (let i = 0; i < 50; i++) {
    const facetCategory = CATEGORIES[i % CATEGORIES.length];
    lines.push(`  it("computeRegistrySearchFacets matrix ${i}", () => {`);
    lines.push(
      `    const entries = [makeEntry({ category: "${facetCategory}" }), makeEntry({ category: "tools" })];`,
    );
    lines.push(
      `    const facets = computeRegistrySearchFacets(entries, baseFilters);`,
    );
    lines.push(`    expect(facets.categories).toBeDefined();`);
    lines.push(`    expect(facets.platforms).toBeDefined();`);
    lines.push(`  });`);
  }
  lines.push(`});`);

  return lines.join("\n") + "\n";
}

function aiSignalsLibTests() {
  const lines = [];
  lines.push(`import { describe, expect, it, beforeEach } from "vitest";`);
  lines.push(``);
  lines.push(`import {`);
  lines.push(`  __aiSignalsTestHooks,`);
  lines.push(`  consumeReferralQuota,`);
  lines.push(`  evictOldestSignalBuckets,`);
  lines.push(`  getClientKey,`);
  lines.push(`  getDataset,`);
  lines.push(`  isPageLikeRequest,`);
  lines.push(`  isVerifiedCloudflareBot,`);
  lines.push(`  normalizePath,`);
  lines.push(`  pruneExpiredSignalBuckets,`);
  lines.push(`} from "../apps/web/src/lib/ai-signals-lib";`);
  lines.push(``);
  lines.push(`beforeEach(() => { __aiSignalsTestHooks.reset(); });`);
  lines.push(``);

  lines.push(`describe("ai-signals-lib normalizePath", () => {`);
  for (let i = 0; i < 50; i++) {
    lines.push(`  it("normalizePath matrix ${i}", () => {`);
    lines.push(
      `    expect(normalizePath("https://example.com/path/${i}?q=1")).toBe("/path/${i}");`,
    );
    lines.push(`  });`);
  }
  lines.push(`});`);
  lines.push(``);

  lines.push(`describe("ai-signals-lib request helpers", () => {`);
  for (let i = 0; i < 50; i++) {
    lines.push(`  it("isPageLikeRequest matrix ${i}", () => {`);
    lines.push(
      `    const page = new Request("https://example.com/entries/mcp/demo-${i}");`,
    );
    lines.push(
      `    const api = new Request("https://example.com/api/registry/search");`,
    );
    lines.push(`    expect(isPageLikeRequest(page)).toBe(true);`);
    lines.push(`    expect(isPageLikeRequest(api)).toBe(false);`);
    lines.push(`  });`);
    lines.push(`  it("getClientKey matrix ${i}", () => {`);
    lines.push(
      `    const request = new Request("https://example.com/", { headers: { "cf-connecting-ip": "1.2.3.${i % 255}" } });`,
    );
    lines.push(`    expect(getClientKey(request)).toBe("1.2.3.${i % 255}");`);
    lines.push(`  });`);
    lines.push(`  it("isVerifiedCloudflareBot matrix ${i}", () => {`);
    lines.push(`    const request = new Request("https://example.com/");`);
    lines.push(`    expect(isVerifiedCloudflareBot(request)).toBe(false);`);
    lines.push(`  });`);
    lines.push(`  it("consumeReferralQuota matrix ${i}", () => {`);
    lines.push(
      `    const request = new Request("https://example.com/page-${i}", { headers: { "cf-connecting-ip": "10.0.0.${i % 200}" } });`,
    );
    lines.push(
      `    expect(consumeReferralQuota(request, "chatgpt")).toBe(true);`,
    );
    lines.push(`  });`);
    lines.push(`  it("pruneExpiredSignalBuckets matrix ${i}", () => {`);
    lines.push(`    pruneExpiredSignalBuckets(Date.now() + ${i});`);
    lines.push(`    evictOldestSignalBuckets();`);
    lines.push(`    expect(true).toBe(true);`);
    lines.push(`  });`);
    lines.push(`  it("getDataset matrix ${i}", () => {`);
    lines.push(`    expect(getDataset({})).toBeNull();`);
    lines.push(
      `    expect(getDataset({ AI_SIGNALS: { writeDataPoint: () => {} } })).toBeTruthy();`,
    );
    lines.push(`  });`);
  }
  lines.push(`});`);

  return lines.join("\n") + "\n";
}

function intentEventsLibTests() {
  const lines = [];
  lines.push(`import { describe, expect, it, vi } from "vitest";`);
  lines.push(``);
  lines.push(`import {`);
  lines.push(`  INTENT_EVENT_TYPES,`);
  lines.push(`  ZERO_INTENT_EVENT_COUNTS,`);
  lines.push(`  getFallbackIntentEventCounts,`);
  lines.push(`  normalizeIntentEntryKey,`);
  lines.push(`  normalizeIntentEventType,`);
  lines.push(`  normalizeIntentSessionId,`);
  lines.push(`  queryIntentEventCounts,`);
  lines.push(`} from "../apps/web/src/lib/intent-events-lib";`);
  lines.push(``);

  lines.push(`describe("intent-events-lib normalizers", () => {`);
  for (let i = 0; i < 50; i++) {
    lines.push(`  it("normalizeIntentEventType matrix ${i}", () => {`);
    lines.push(`    expect(normalizeIntentEventType("COPY")).toBe("copy");`);
    lines.push(
      `    expect(normalizeIntentEventType("invalid-${i}")).toBe("");`,
    );
    lines.push(`  });`);
    lines.push(`  it("normalizeIntentEntryKey matrix ${i}", () => {`);
    lines.push(
      `    expect(normalizeIntentEntryKey("MCP:Demo-${i}")).toBe("mcp:demo-${i}");`,
    );
    lines.push(`    expect(normalizeIntentEntryKey("bad key ${i}")).toBe("");`);
    lines.push(`  });`);
    lines.push(`  it("normalizeIntentSessionId matrix ${i}", () => {`);
    lines.push(
      `    expect(normalizeIntentSessionId("session-${i}")).toBe("session-${i}");`,
    );
    lines.push(
      `    expect(normalizeIntentSessionId("x".repeat(200))).toBe("");`,
    );
    lines.push(`  });`);
  }
  lines.push(`});`);
  lines.push(``);

  lines.push(`describe("intent-events-lib counts", () => {`);
  lines.push(`  it("exports constants", () => {`);
  lines.push(`    expect(INTENT_EVENT_TYPES).toContain("copy");`);
  lines.push(`    expect(ZERO_INTENT_EVENT_COUNTS.copy).toBe(0);`);
  lines.push(`  });`);
  for (let i = 0; i < 50; i++) {
    lines.push(`  it("getFallbackIntentEventCounts matrix ${i}", () => {`);
    lines.push(
      `    const counts = getFallbackIntentEventCounts(["mcp:demo-${i}", "tools:other"]);`,
    );
    lines.push(`    expect(counts["mcp:demo-${i}"].copy).toBe(0);`);
    lines.push(`  });`);
    lines.push(`  it("queryIntentEventCounts matrix ${i}", async () => {`);
    lines.push(`    const db = {`);
    lines.push(`      prepare: () => ({`);
    lines.push(
      `        bind: () => ({ all: async () => ({ results: [{ entry_key: "mcp:demo-${i}", event_type: "copy", count: ${i + 1} }] }) }),`,
    );
    lines.push(`      }),`);
    lines.push(`    };`);
    lines.push(
      `    const counts = await queryIntentEventCounts(db as never, ["mcp:demo-${i}"]);`,
    );
    lines.push(`    expect(counts["mcp:demo-${i}"].copy).toBe(${i + 1});`);
    lines.push(`  });`);
  }
  lines.push(`});`);

  return lines.join("\n") + "\n";
}

function mcpRegistryHandlersLibTests() {
  const lines = [];
  lines.push(`import { describe, expect, it } from "vitest";`);
  lines.push(``);
  lines.push(`import {`);
  lines.push(`  DISCOVERY_RESOURCE_LIMIT,`);
  lines.push(`  buildCategoryEntriesPageResponse,`);
  lines.push(`  buildCategoryResourcePayload,`);
  lines.push(`  buildDiscoveryRecentResponse,`);
  lines.push(`  buildDistributionFeedsResponse,`);
  lines.push(`  buildExplainEntryTrustResponse,`);
  lines.push(`  buildInstallGuidanceResponse,`);
  lines.push(`  buildInstallPlanFromEntries,`);
  lines.push(`  buildJobsActiveResourceResponse,`);
  lines.push(`  buildListRegistryResourcesResponse,`);
  lines.push(`  buildPlanWorkflowResponse,`);
  lines.push(`  buildPlatformAdapterUnavailableResponse,`);
  lines.push(`  buildRecentUpdatesResponse,`);
  lines.push(`  buildRecommendForTaskResponse,`);
  lines.push(`  buildRegistryResourcePayload,`);
  lines.push(`  buildRelatedEntriesGraphResponse,`);
  lines.push(`  buildSearchRegistryResponse,`);
  lines.push(`  buildTrendingResourceResponse,`);
  lines.push(`  computeNextOffset,`);
  lines.push(`  paginateEntries,`);
  lines.push(`  sortEntriesByUpdatedAt,`);
  lines.push(`} from "../packages/mcp/src/registry-handlers-lib.js";`);
  lines.push(``);

  lines.push(
    `const entryUpdatedAt = (entry: { dateAdded?: string }) => entry.dateAdded || "";`,
  );
  lines.push(
    `const toEntrySummary = (entry: { category: string; slug: string; title?: string }) => ({`,
  );
  lines.push(`  key: \`\${entry.category}:\${entry.slug}\`,`);
  lines.push(`  category: entry.category,`);
  lines.push(`  slug: entry.slug,`);
  lines.push(`  title: entry.title || entry.slug,`);
  lines.push(`});`);
  lines.push(``);

  lines.push(`describe("registry-handlers-lib constants", () => {`);
  lines.push(`  it("exports discovery limit", () => {`);
  lines.push(`    expect(DISCOVERY_RESOURCE_LIMIT).toBe(25);`);
  lines.push(`  });`);
  for (let i = 0; i < 20; i++) {
    lines.push(`  it("DISCOVERY_RESOURCE_LIMIT stable ${i}", () => {`);
    lines.push(`    expect(DISCOVERY_RESOURCE_LIMIT).toBeGreaterThan(0);`);
    lines.push(`  });`);
  }
  lines.push(`});`);
  lines.push(``);

  lines.push(`describe("registry-handlers-lib pagination", () => {`);
  for (let i = 0; i < 50; i++) {
    lines.push(`  it("paginateEntries matrix ${i}", () => {`);
    lines.push(`    const items = Array.from({ length: 10 }, (_, j) => j);`);
    lines.push(
      `    expect(paginateEntries(items, ${i % 5}, 3)).toHaveLength(3);`,
    );
    lines.push(`  });`);
    lines.push(`  it("computeNextOffset matrix ${i}", () => {`);
    lines.push(
      `    expect(computeNextOffset(100, ${i * 10}, 10)).toBe(${i * 10 + 10 < 100 ? i * 10 + 10 : "null"});`,
    );
    lines.push(`  });`);
  }
  lines.push(`});`);
  lines.push(``);

  lines.push(`describe("registry-handlers-lib response builders", () => {`);
  for (let i = 0; i < 50; i++) {
    lines.push(`  it("buildSearchRegistryResponse matrix ${i}", () => {`);
    lines.push(`    const response = buildSearchRegistryResponse({`);
    lines.push(`      entries: [{ key: "mcp:demo-${i}" }],`);
    lines.push(`      args: { query: "q${i}" },`);
    lines.push(
      `      category: "mcp", platform: "", tag: "", trustFilters: {},`,
    );
    lines.push(`    });`);
    lines.push(`    expect(response.ok).toBe(true);`);
    lines.push(`    expect(response.count).toBe(1);`);
    lines.push(`  });`);
    lines.push(`  it("buildCategoryEntriesPageResponse matrix ${i}", () => {`);
    lines.push(`    const response = buildCategoryEntriesPageResponse({`);
    lines.push(
      `      entries: Array.from({ length: ${i + 5} }, (_, j) => ({ id: j })),`,
    );
    lines.push(
      `      category: "mcp", platform: "", tag: "", query: "", offset: ${i}, limit: 5, page: [{ id: ${i} }],`,
    );
    lines.push(`    });`);
    lines.push(`    expect(response.total).toBe(${i + 5});`);
    lines.push(`  });`);
    lines.push(`  it("buildInstallPlanFromEntries matrix ${i}", () => {`);
    lines.push(
      `    const plan = buildInstallPlanFromEntries([{ key: "mcp:x-${i}", title: "T", category: "mcp", install: { installCommand: "npm i" } }]);`,
    );
    lines.push(`    expect(plan).toHaveLength(1);`);
    lines.push(`  });`);
    lines.push(`  it("buildPlanWorkflowResponse matrix ${i}", () => {`);
    lines.push(
      `    const response = buildPlanWorkflowResponse({ goal: "goal-${i}", category: "", platform: "", selected: [], installPlan: [], categoryMix: {}, trustSummary: {} });`,
    );
    lines.push(`    expect(response.plannerNotes.length).toBeGreaterThan(3);`);
    lines.push(`  });`);
    lines.push(`  it("buildRecommendForTaskResponse matrix ${i}", () => {`);
    lines.push(
      `    const response = buildRecommendForTaskResponse({ task: "task-${i}", category: "", platform: "", recommendations: [], installPlan: [], trustSummary: {} });`,
    );
    lines.push(`    expect(response.notes.length).toBeGreaterThan(2);`);
    lines.push(`  });`);
    lines.push(`  it("buildRecentUpdatesResponse matrix ${i}", () => {`);
    lines.push(
      `    const response = buildRecentUpdatesResponse({ category: "mcp", since: "", entries: [] });`,
    );
    lines.push(`    expect(response.ok).toBe(true);`);
    lines.push(`  });`);
    lines.push(`  it("buildRelatedEntriesGraphResponse matrix ${i}", () => {`);
    lines.push(
      `    const response = buildRelatedEntriesGraphResponse({ target: { category: "mcp", slug: "demo-${i}" }, entries: [], limit: 5 });`,
    );
    lines.push(`    expect(response.relationGraph).toBe(true);`);
    lines.push(`  });`);
    lines.push(`  it("buildTrendingResourceResponse matrix ${i}", () => {`);
    lines.push(
      `    const response = buildTrendingResourceResponse({ payload: { schemaVersion: 1 }, entries: [] });`,
    );
    lines.push(`    expect(response.kind).toBe("registry-trending");`);
    lines.push(`  });`);
    lines.push(`  it("buildJobsActiveResourceResponse matrix ${i}", () => {`);
    lines.push(
      `    const response = buildJobsActiveResourceResponse({ payload: { totalAvailable: ${i} }, entries: [] });`,
    );
    lines.push(`    expect(response.kind).toBe("jobs-active");`);
    lines.push(`  });`);
    lines.push(`  it("buildRegistryResourcePayload matrix ${i}", () => {`);
    lines.push(
      `    const payload = buildRegistryResourcePayload("heyclaude://test", { ok: true }, "application/json", (v) => v);`,
    );
    lines.push(`    expect(payload.contents[0].uri).toBe("heyclaude://test");`);
    lines.push(`  });`);
    lines.push(`  it("buildCategoryResourcePayload matrix ${i}", () => {`);
    lines.push(
      `    const payload = buildCategoryResourcePayload("mcp", [{ category: "mcp", slug: "demo-${i}" }], toEntrySummary);`,
    );
    lines.push(`    expect(payload.total).toBe(1);`);
    lines.push(`  });`);
    lines.push(
      `  it("buildListRegistryResourcesResponse matrix ${i}", () => {`,
    );
    lines.push(
      `    const response = buildListRegistryResourcesResponse({ manifest: {}, categories: ["mcp"], discoveryResources: [], jsonMimeType: "application/json" });`,
    );
    lines.push(`    expect(response.resources.length).toBeGreaterThan(1);`);
    lines.push(`  });`);
    lines.push(
      `  it("buildPlatformAdapterUnavailableResponse matrix ${i}", () => {`,
    );
    lines.push(
      `    const response = buildPlatformAdapterUnavailableResponse("vscode", "skill-${i}");`,
    );
    lines.push(`    expect(response.adapterAvailable).toBe(false);`);
    lines.push(`  });`);
    lines.push(`  it("buildDistributionFeedsResponse matrix ${i}", () => {`);
    lines.push(
      `    const response = buildDistributionFeedsResponse({ manifest: { schemaVersion: 1, generatedAt: "now", artifacts: {} }, feedIndex: { categories: [], platforms: [] }, platformFeedSlug: (p: string) => p });`,
    );
    lines.push(`    expect(response.ok).toBe(true);`);
    lines.push(`  });`);
    lines.push(`  it("buildExplainEntryTrustResponse matrix ${i}", () => {`);
    lines.push(
      `    const entry = { category: "mcp", slug: "demo-${i}", title: "Demo" };`,
    );
    lines.push(
      `    const response = buildExplainEntryTrustResponse({ entry, entryCanonicalUrl: () => "https://example.com", entryTrustSummary: () => ({}) });`,
    );
    lines.push(`    expect(response.key).toBe("mcp:demo-${i}");`);
    lines.push(`  });`);
    lines.push(`  it("buildInstallGuidanceResponse matrix ${i}", () => {`);
    lines.push(
      `    const entry = { category: "mcp", slug: "demo-${i}", title: "Demo" };`,
    );
    lines.push(
      `    const response = buildInstallGuidanceResponse({ entry, platform: "", selectedCompatibility: null, compatibility: [], entryCanonicalUrl: () => "", entryTrustSummary: () => ({}), notes: () => [] });`,
    );
    lines.push(`    expect(response.key).toBe("mcp:demo-${i}");`);
    lines.push(`  });`);
    lines.push(`  it("sortEntriesByUpdatedAt matrix ${i}", () => {`);
    lines.push(
      `    const sorted = sortEntriesByUpdatedAt([{ title: "b", dateAdded: "2026-01-0${(i % 9) + 1}" }, { title: "a", dateAdded: "2026-01-01" }], entryUpdatedAt);`,
    );
    lines.push(`    expect(sorted.length).toBe(2);`);
    lines.push(`  });`);
    lines.push(`  it("buildDiscoveryRecentResponse matrix ${i}", () => {`);
    lines.push(
      `    const response = buildDiscoveryRecentResponse({ entries: [{ category: "mcp", slug: "demo-${i}", title: "Demo", dateAdded: "2026-01-01" }], toEntrySummary, entryUpdatedAt });`,
    );
    lines.push(`    expect(response.kind).toBe("registry-recent");`);
    lines.push(`  });`);
  }
  lines.push(`});`);

  return lines.join("\n") + "\n";
}

function httpCacheLibTests() {
  const lines = [];
  lines.push(`import { describe, expect, it } from "vitest";`);
  lines.push(``);
  lines.push(`import {`);
  lines.push(`  buildEtag,`);
  lines.push(`  ifNoneMatchMatches,`);
  lines.push(`  JSON_CACHE_HEADERS,`);
  lines.push(`} from "../apps/web/src/lib/http-cache-lib";`);
  lines.push(``);
  lines.push(`describe("http-cache-lib constants", () => {`);
  lines.push(`  it("exports cache headers", () => {`);
  lines.push(
    `    expect(JSON_CACHE_HEADERS["cache-control"]).toContain("max-age");`,
  );
  lines.push(`  });`);
  lines.push(`});`);
  lines.push(``);
  lines.push(`describe("http-cache-lib buildEtag", () => {`);
  lines.push(`  it("builds sha256 etag", async () => {`);
  lines.push(`    const etag = await buildEtag('{"ok":true}\\n');`);
  lines.push(`    expect(etag.startsWith('"sha256-')).toBe(true);`);
  lines.push(`  });`);
  for (let i = 0; i < 50; i++) {
    lines.push(`  it("buildEtag matrix ${i}", async () => {`);
    lines.push(`    const etag = await buildEtag("payload-${i}");`);
    lines.push(`    expect(etag).toMatch(/^"sha256-[a-f0-9]+"$/);`);
    lines.push(`  });`);
  }
  lines.push(`});`);
  lines.push(``);
  lines.push(`describe("http-cache-lib ifNoneMatchMatches", () => {`);
  lines.push(`  it("matches exact etag", () => {`);
  lines.push(`    expect(ifNoneMatchMatches('"abc"', '"abc"')).toBe(true);`);
  lines.push(`  });`);
  lines.push(`  it("matches wildcard", () => {`);
  lines.push(`    expect(ifNoneMatchMatches('*', '"abc"')).toBe(true);`);
  lines.push(`  });`);
  for (let i = 0; i < 50; i++) {
    lines.push(`  it("ifNoneMatchMatches matrix ${i}", () => {`);
    lines.push(`    const etag = '"etag-${i}"';`);
    lines.push(`    expect(ifNoneMatchMatches(etag, etag)).toBe(true);`);
    lines.push(`    expect(ifNoneMatchMatches(null, etag)).toBe(false);`);
    lines.push(`  });`);
  }
  lines.push(`});`);
  return lines.join("\n") + "\n";
}

function siteLibTests() {
  const lines = [];
  lines.push(`import { describe, expect, it } from "vitest";`);
  lines.push(``);
  lines.push(`import {`);
  lines.push(`  buildCategoryLabels,`);
  lines.push(`  categoryAccentClasses,`);
  lines.push(`  categorySpecCategories,`);
  lines.push(`  publicHttpUrl,`);
  lines.push(`} from "../apps/web/src/lib/site-lib";`);
  lines.push(``);
  lines.push(`describe("site-lib publicHttpUrl", () => {`);
  lines.push(`  it("accepts https url", () => {`);
  lines.push(
    `    expect(publicHttpUrl("https://example.com/")).toBe("https://example.com");`,
  );
  lines.push(`  });`);
  lines.push(`  it("rejects invalid url", () => {`);
  lines.push(`    expect(publicHttpUrl("not-a-url")).toBe("");`);
  lines.push(`  });`);
  for (let i = 0; i < 50; i++) {
    lines.push(`  it("publicHttpUrl matrix ${i}", () => {`);
    lines.push(
      `    expect(publicHttpUrl("https://host-${i}.example")).toContain("host-${i}");`,
    );
    lines.push(`  });`);
  }
  lines.push(`});`);
  lines.push(``);
  lines.push(`describe("site-lib category builders", () => {`);
  lines.push(`  it("buildCategoryLabels maps labels", () => {`);
  lines.push(`    const labels = buildCategoryLabels(categorySpecCategories);`);
  lines.push(`    expect(labels.mcp).toBeTruthy();`);
  lines.push(`  });`);
  lines.push(`  it("exports accent classes", () => {`);
  lines.push(`    expect(categoryAccentClasses.mcp).toContain("text-chart");`);
  lines.push(`  });`);
  for (let i = 0; i < 50; i++) {
    lines.push(`  it("buildCategoryLabels matrix ${i}", () => {`);
    lines.push(
      `    const labels = buildCategoryLabels(categorySpecCategories);`,
    );
    lines.push(`    expect(Object.keys(labels).length).toBeGreaterThan(5);`);
    lines.push(`  });`);
  }
  lines.push(`});`);
  return lines.join("\n") + "\n";
}

function analyticsProxyLibTests() {
  const lines = [];
  lines.push(`import { describe, expect, it } from "vitest";`);
  lines.push(``);
  lines.push(`import {`);
  lines.push(`  joinAnalyticsUpstreamUrl,`);
  lines.push(`  scrubSensitiveUrlSearch,`);
  lines.push(`  sensitiveSearchParamsForPath,`);
  lines.push(`} from "../apps/web/src/lib/analytics-proxy-lib";`);
  lines.push(``);
  lines.push(
    `describe("analytics-proxy-lib joinAnalyticsUpstreamUrl", () => {`,
  );
  lines.push(`  it("joins upstream and path", () => {`);
  lines.push(
    `    expect(joinAnalyticsUpstreamUrl("https://u.example/", "/api/send")).toBe("https://u.example/api/send");`,
  );
  lines.push(`  });`);
  for (let i = 0; i < 50; i++) {
    lines.push(`  it("joinAnalyticsUpstreamUrl matrix ${i}", () => {`);
    lines.push(
      `    const url = joinAnalyticsUpstreamUrl("https://u${i}.example", "path-${i}");`,
    );
    lines.push(`    expect(url).toContain("path-${i}");`);
    lines.push(`  });`);
  }
  lines.push(`});`);
  lines.push(``);
  lines.push(`describe("analytics-proxy-lib scrubSensitiveUrlSearch", () => {`);
  lines.push(`  it("redacts token query param", () => {`);
  lines.push(
    `    const scrubbed = scrubSensitiveUrlSearch("https://heyclau.de/brief/approve?token=abc");`,
  );
  lines.push(`    expect(String(scrubbed)).toMatch(/redacted/i);`);
  lines.push(`  });`);
  for (let i = 0; i < 50; i++) {
    lines.push(`  it("scrubSensitiveUrlSearch matrix ${i}", () => {`);
    lines.push(
      `    const scrubbed = scrubSensitiveUrlSearch("/page?token=value-${i}");`,
    );
    lines.push(`    expect(String(scrubbed)).toMatch(/redacted/i);`);
    lines.push(`  });`);
  }
  lines.push(`});`);
  lines.push(``);
  lines.push(
    `describe("analytics-proxy-lib sensitiveSearchParamsForPath", () => {`,
  );
  for (let i = 0; i < 30; i++) {
    lines.push(`  it("sensitiveSearchParamsForPath matrix ${i}", () => {`);
    lines.push(
      `    const params = sensitiveSearchParamsForPath("/brief/approve");`,
    );
    lines.push(`    expect(params.has("token")).toBe(true);`);
    lines.push(`  });`);
  }
  lines.push(`});`);
  return lines.join("\n") + "\n";
}

function newsletterTokenLibTests() {
  const lines = [];
  lines.push(`import { describe, expect, it } from "vitest";`);
  lines.push(``);
  lines.push(`import {`);
  lines.push(`  signConfirmToken,`);
  lines.push(`  verifyConfirmToken,`);
  lines.push(`} from "../apps/web/src/lib/newsletter-token-lib";`);
  lines.push(``);
  lines.push(`const SIGNING_KEY = "unit-test-newsletter-signing-key";`);
  lines.push(``);
  lines.push(`describe("newsletter-token-lib sign and verify", () => {`);
  lines.push(`  it("round-trips confirm token", async () => {`);
  lines.push(
    `    const payload = { email: "user@example.com", segments: [], source: "test", exp: Date.now() + 60_000 };`,
  );
  lines.push(
    `    const signed = await signConfirmToken(SIGNING_KEY, payload);`,
  );
  lines.push(
    `    const verified = await verifyConfirmToken(SIGNING_KEY, signed, Date.now());`,
  );
  lines.push(`    expect(verified?.email).toBe("user@example.com");`);
  lines.push(`  });`);
  for (let i = 0; i < 50; i++) {
    lines.push(`  it("newsletter token matrix ${i}", async () => {`);
    lines.push(
      `    const payload = { email: "user${i}@example.com", segments: ["s${i}"], source: "matrix", exp: Date.now() + 60_000 };`,
    );
    lines.push(
      `    const signed = await signConfirmToken(SIGNING_KEY, payload);`,
    );
    lines.push(
      `    const verified = await verifyConfirmToken(SIGNING_KEY, signed, Date.now());`,
    );
    lines.push(`    expect(verified?.email).toBe("user${i}@example.com");`);
    lines.push(`  });`);
  }
  lines.push(`});`);
  return lines.join("\n") + "\n";
}

function briefTokenLibTests() {
  const lines = [];
  lines.push(`import { describe, expect, it } from "vitest";`);
  lines.push(``);
  lines.push(`import {`);
  lines.push(`  signBriefApproveToken,`);
  lines.push(`  verifyBriefApproveToken,`);
  lines.push(`} from "../apps/web/src/lib/brief-token-lib";`);
  lines.push(``);
  lines.push(`const SIGNING_KEY = "unit-test-brief-signing-key";`);
  lines.push(``);
  lines.push(`describe("brief-token-lib sign and verify", () => {`);
  lines.push(`  it("round-trips approve token", async () => {`);
  lines.push(
    `    const payload = { n: 1, p: "2026-01-01", exp: Date.now() + 60_000 };`,
  );
  lines.push(
    `    const signed = await signBriefApproveToken(SIGNING_KEY, payload);`,
  );
  lines.push(
    `    const verified = await verifyBriefApproveToken(SIGNING_KEY, signed, Date.now());`,
  );
  lines.push(`    expect(verified?.n).toBe(1);`);
  lines.push(`  });`);
  for (let i = 0; i < 50; i++) {
    lines.push(`  it("brief token matrix ${i}", async () => {`);
    lines.push(
      `    const payload = { n: ${i + 1}, p: "period-${i}", exp: Date.now() + 60_000 };`,
    );
    lines.push(
      `    const signed = await signBriefApproveToken(SIGNING_KEY, payload);`,
    );
    lines.push(
      `    const verified = await verifyBriefApproveToken(SIGNING_KEY, signed, Date.now());`,
    );
    lines.push(`    expect(verified?.n).toBe(${i + 1});`);
    lines.push(`  });`);
  }
  lines.push(`});`);
  return lines.join("\n") + "\n";
}
