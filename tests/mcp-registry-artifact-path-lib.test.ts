import { describe, expect, it } from "vitest";
import path from "node:path";

import {
  SAFE_PATH_PART_PATTERN,
  isSafePathPart,
  safeRelativePath,
} from "../packages/mcp/src/registry-artifact-path-lib.js";

describe("registry-artifact-path-lib SAFE_PATH_PART_PATTERN", () => {
  it("matches lowercase alphanumeric hyphen slugs", () => {
    expect(SAFE_PATH_PART_PATTERN.test("browser-bridge")).toBe(true);
    expect(SAFE_PATH_PART_PATTERN.test("mcp123")).toBe(true);
    expect(SAFE_PATH_PART_PATTERN.test("a")).toBe(true);
    expect(SAFE_PATH_PART_PATTERN.test("9")).toBe(true);
  });
  it("rejects uppercase, underscores, dots, and special chars", () => {
    expect(SAFE_PATH_PART_PATTERN.test("Browser-Bridge")).toBe(false);
    expect(SAFE_PATH_PART_PATTERN.test("under_score")).toBe(false);
    expect(SAFE_PATH_PART_PATTERN.test("dot.name")).toBe(false);
    expect(SAFE_PATH_PART_PATTERN.test("space name")).toBe(false);
  });
});

describe("registry-artifact-path-lib isSafePathPart", () => {
  it("accepts empty string as falsy input", () => {
    expect(isSafePathPart("")).toBe(false);
    expect(isSafePathPart(null)).toBe(false);
    expect(isSafePathPart(undefined)).toBe(false);
  });

  it("accepts safe part a", () => {
    expect(isSafePathPart("a")).toBe(true);
  });
  it("accepts safe part z", () => {
    expect(isSafePathPart("z")).toBe(true);
  });
  it("accepts safe part 0", () => {
    expect(isSafePathPart("0")).toBe(true);
  });
  it("accepts safe part 9", () => {
    expect(isSafePathPart("9")).toBe(true);
  });
  it("accepts safe part a0", () => {
    expect(isSafePathPart("a0")).toBe(true);
  });
  it("accepts safe part 0a", () => {
    expect(isSafePathPart("0a")).toBe(true);
  });
  it("accepts safe part a-b", () => {
    expect(isSafePathPart("a-b")).toBe(true);
  });
  it("accepts safe part b-c-d", () => {
    expect(isSafePathPart("b-c-d")).toBe(true);
  });
  it("accepts safe part mcp", () => {
    expect(isSafePathPart("mcp")).toBe(true);
  });
  it("accepts safe part skills", () => {
    expect(isSafePathPart("skills")).toBe(true);
  });
  it("accepts safe part hooks", () => {
    expect(isSafePathPart("hooks")).toBe(true);
  });
  it("accepts safe part commands", () => {
    expect(isSafePathPart("commands")).toBe(true);
  });
  it("accepts safe part statuslines", () => {
    expect(isSafePathPart("statuslines")).toBe(true);
  });
  it("accepts safe part guides", () => {
    expect(isSafePathPart("guides")).toBe(true);
  });
  it("accepts safe part plugins", () => {
    expect(isSafePathPart("plugins")).toBe(true);
  });
  it("accepts safe part agents", () => {
    expect(isSafePathPart("agents")).toBe(true);
  });
  it("accepts safe part tools", () => {
    expect(isSafePathPart("tools")).toBe(true);
  });
  it("accepts safe part rules", () => {
    expect(isSafePathPart("rules")).toBe(true);
  });
  it("accepts safe part collections", () => {
    expect(isSafePathPart("collections")).toBe(true);
  });
  it("accepts safe part browser-bridge", () => {
    expect(isSafePathPart("browser-bridge")).toBe(true);
  });
  it("accepts safe part demo-agent", () => {
    expect(isSafePathPart("demo-agent")).toBe(true);
  });
  it("accepts safe part demo-mcp", () => {
    expect(isSafePathPart("demo-mcp")).toBe(true);
  });
  it("accepts safe part demo-skills", () => {
    expect(isSafePathPart("demo-skills")).toBe(true);
  });
  it("accepts safe part demo-hooks", () => {
    expect(isSafePathPart("demo-hooks")).toBe(true);
  });
  it("accepts safe part demo-commands", () => {
    expect(isSafePathPart("demo-commands")).toBe(true);
  });
  it("accepts safe part demo-statuslines", () => {
    expect(isSafePathPart("demo-statuslines")).toBe(true);
  });
  it("accepts safe part demo-guides", () => {
    expect(isSafePathPart("demo-guides")).toBe(true);
  });
  it("accepts safe part demo-plugins", () => {
    expect(isSafePathPart("demo-plugins")).toBe(true);
  });
  it("accepts safe part demo-tools", () => {
    expect(isSafePathPart("demo-tools")).toBe(true);
  });
  it("accepts safe part demo-rules", () => {
    expect(isSafePathPart("demo-rules")).toBe(true);
  });
  it("accepts safe part demo-collections", () => {
    expect(isSafePathPart("demo-collections")).toBe(true);
  });
  it("accepts safe part playwright-bridge", () => {
    expect(isSafePathPart("playwright-bridge")).toBe(true);
  });
  it("accepts safe part git-workflow", () => {
    expect(isSafePathPart("git-workflow")).toBe(true);
  });
  it("accepts safe part code-review", () => {
    expect(isSafePathPart("code-review")).toBe(true);
  });
  it("accepts safe part test-runner", () => {
    expect(isSafePathPart("test-runner")).toBe(true);
  });
  it("accepts safe part lint-fix", () => {
    expect(isSafePathPart("lint-fix")).toBe(true);
  });
  it("accepts safe part format-code", () => {
    expect(isSafePathPart("format-code")).toBe(true);
  });
  it("accepts safe part deploy-helper", () => {
    expect(isSafePathPart("deploy-helper")).toBe(true);
  });
  it("accepts safe part monitor-logs", () => {
    expect(isSafePathPart("monitor-logs")).toBe(true);
  });
  it("accepts safe part debug-session", () => {
    expect(isSafePathPart("debug-session")).toBe(true);
  });
  it("accepts safe part profile-perf", () => {
    expect(isSafePathPart("profile-perf")).toBe(true);
  });
  it("accepts safe part security-scan", () => {
    expect(isSafePathPart("security-scan")).toBe(true);
  });
  it("accepts safe part dependency-check", () => {
    expect(isSafePathPart("dependency-check")).toBe(true);
  });
  it("accepts safe part license-audit", () => {
    expect(isSafePathPart("license-audit")).toBe(true);
  });
  it("accepts safe part changelog-gen", () => {
    expect(isSafePathPart("changelog-gen")).toBe(true);
  });
  it("accepts safe part readme-gen", () => {
    expect(isSafePathPart("readme-gen")).toBe(true);
  });
  it("accepts safe part api-docs", () => {
    expect(isSafePathPart("api-docs")).toBe(true);
  });
  it("accepts safe part schema-gen", () => {
    expect(isSafePathPart("schema-gen")).toBe(true);
  });
  it("accepts safe part migration-tool", () => {
    expect(isSafePathPart("migration-tool")).toBe(true);
  });
  it("accepts safe part backup-restore", () => {
    expect(isSafePathPart("backup-restore")).toBe(true);
  });
  it("accepts safe part cache-clear", () => {
    expect(isSafePathPart("cache-clear")).toBe(true);
  });
  it("accepts safe part config-sync", () => {
    expect(isSafePathPart("config-sync")).toBe(true);
  });
  it("accepts safe part env-manager", () => {
    expect(isSafePathPart("env-manager")).toBe(true);
  });
  it("accepts safe part secret-rotate", () => {
    expect(isSafePathPart("secret-rotate")).toBe(true);
  });
  it("accepts safe part token-refresh", () => {
    expect(isSafePathPart("token-refresh")).toBe(true);
  });
  it("accepts safe part oauth-flow", () => {
    expect(isSafePathPart("oauth-flow")).toBe(true);
  });
  it("accepts safe part webhook-relay", () => {
    expect(isSafePathPart("webhook-relay")).toBe(true);
  });
  it("accepts safe part queue-worker", () => {
    expect(isSafePathPart("queue-worker")).toBe(true);
  });
  it("accepts safe part batch-processor", () => {
    expect(isSafePathPart("batch-processor")).toBe(true);
  });
  it("accepts safe part stream-handler", () => {
    expect(isSafePathPart("stream-handler")).toBe(true);
  });
  it("accepts safe part event-bus", () => {
    expect(isSafePathPart("event-bus")).toBe(true);
  });
  it("accepts safe part state-machine", () => {
    expect(isSafePathPart("state-machine")).toBe(true);
  });
  it("accepts safe part workflow-engine", () => {
    expect(isSafePathPart("workflow-engine")).toBe(true);
  });
  it("accepts safe part task-scheduler", () => {
    expect(isSafePathPart("task-scheduler")).toBe(true);
  });
  it("accepts safe part cron-runner", () => {
    expect(isSafePathPart("cron-runner")).toBe(true);
  });
  it("accepts safe part health-check", () => {
    expect(isSafePathPart("health-check")).toBe(true);
  });
  it("accepts safe part metrics-collector", () => {
    expect(isSafePathPart("metrics-collector")).toBe(true);
  });
  it("accepts safe part trace-exporter", () => {
    expect(isSafePathPart("trace-exporter")).toBe(true);
  });
  it("accepts safe part log-aggregator", () => {
    expect(isSafePathPart("log-aggregator")).toBe(true);
  });
  it("accepts safe part alert-router", () => {
    expect(isSafePathPart("alert-router")).toBe(true);
  });
  it("accepts safe part incident-bot", () => {
    expect(isSafePathPart("incident-bot")).toBe(true);
  });
  it("accepts safe part oncall-helper", () => {
    expect(isSafePathPart("oncall-helper")).toBe(true);
  });
  it("accepts safe part runbook-gen", () => {
    expect(isSafePathPart("runbook-gen")).toBe(true);
  });
  it("accepts safe part postmortem-writer", () => {
    expect(isSafePathPart("postmortem-writer")).toBe(true);
  });
  it("accepts safe part slo-tracker", () => {
    expect(isSafePathPart("slo-tracker")).toBe(true);
  });
  it("accepts safe part error-budget", () => {
    expect(isSafePathPart("error-budget")).toBe(true);
  });
  it("accepts safe part capacity-plan", () => {
    expect(isSafePathPart("capacity-plan")).toBe(true);
  });
  it("accepts safe part cost-analyzer", () => {
    expect(isSafePathPart("cost-analyzer")).toBe(true);
  });
  it("accepts safe part usage-report", () => {
    expect(isSafePathPart("usage-report")).toBe(true);
  });
  it("accepts safe part billing-sync", () => {
    expect(isSafePathPart("billing-sync")).toBe(true);
  });
  it("accepts safe part invoice-gen", () => {
    expect(isSafePathPart("invoice-gen")).toBe(true);
  });
  it("accepts safe part tax-calculator", () => {
    expect(isSafePathPart("tax-calculator")).toBe(true);
  });
  it("accepts safe part currency-convert", () => {
    expect(isSafePathPart("currency-convert")).toBe(true);
  });
  it("accepts safe part locale-detect", () => {
    expect(isSafePathPart("locale-detect")).toBe(true);
  });
  it("accepts safe part timezone-map", () => {
    expect(isSafePathPart("timezone-map")).toBe(true);
  });
  it("accepts safe part calendar-sync", () => {
    expect(isSafePathPart("calendar-sync")).toBe(true);
  });
  it("accepts safe part meeting-notes", () => {
    expect(isSafePathPart("meeting-notes")).toBe(true);
  });
  it("accepts safe part standup-bot", () => {
    expect(isSafePathPart("standup-bot")).toBe(true);
  });
  it("accepts safe part retro-facilitator", () => {
    expect(isSafePathPart("retro-facilitator")).toBe(true);
  });
  it("accepts safe part sprint-planner", () => {
    expect(isSafePathPart("sprint-planner")).toBe(true);
  });
  it("accepts safe part backlog-groom", () => {
    expect(isSafePathPart("backlog-groom")).toBe(true);
  });
  it("accepts safe part story-splitter", () => {
    expect(isSafePathPart("story-splitter")).toBe(true);
  });
  it("accepts safe part acceptance-criteria", () => {
    expect(isSafePathPart("acceptance-criteria")).toBe(true);
  });
  it("accepts safe part test-case-gen", () => {
    expect(isSafePathPart("test-case-gen")).toBe(true);
  });
  it("accepts safe part bug-triage", () => {
    expect(isSafePathPart("bug-triage")).toBe(true);
  });
  it("accepts safe part regression-suite", () => {
    expect(isSafePathPart("regression-suite")).toBe(true);
  });
  it("accepts safe part smoke-test", () => {
    expect(isSafePathPart("smoke-test")).toBe(true);
  });
  it("accepts safe part load-test", () => {
    expect(isSafePathPart("load-test")).toBe(true);
  });
  it("accepts safe part stress-test", () => {
    expect(isSafePathPart("stress-test")).toBe(true);
  });
  it("accepts safe part chaos-monkey", () => {
    expect(isSafePathPart("chaos-monkey")).toBe(true);
  });
  it("accepts safe part failover-test", () => {
    expect(isSafePathPart("failover-test")).toBe(true);
  });
  it("accepts safe part disaster-recovery", () => {
    expect(isSafePathPart("disaster-recovery")).toBe(true);
  });
  it("accepts safe part backup-verify", () => {
    expect(isSafePathPart("backup-verify")).toBe(true);
  });
  it("accepts safe part restore-test", () => {
    expect(isSafePathPart("restore-test")).toBe(true);
  });
  it("accepts safe part data-migration", () => {
    expect(isSafePathPart("data-migration")).toBe(true);
  });
  it("accepts safe part schema-migrate", () => {
    expect(isSafePathPart("schema-migrate")).toBe(true);
  });
  it("accepts safe part index-rebuild", () => {
    expect(isSafePathPart("index-rebuild")).toBe(true);
  });
  it("accepts safe part cache-warm", () => {
    expect(isSafePathPart("cache-warm")).toBe(true);
  });
  it("accepts safe part cdn-purge", () => {
    expect(isSafePathPart("cdn-purge")).toBe(true);
  });
  it("accepts safe part dns-update", () => {
    expect(isSafePathPart("dns-update")).toBe(true);
  });
  it("accepts safe part cert-renew", () => {
    expect(isSafePathPart("cert-renew")).toBe(true);
  });
  it("accepts safe part ssl-check", () => {
    expect(isSafePathPart("ssl-check")).toBe(true);
  });
  it("accepts safe part tls-scan", () => {
    expect(isSafePathPart("tls-scan")).toBe(true);
  });
  it("accepts safe part vuln-scan", () => {
    expect(isSafePathPart("vuln-scan")).toBe(true);
  });
  it("accepts safe part pen-test", () => {
    expect(isSafePathPart("pen-test")).toBe(true);
  });
  it("accepts safe part compliance-check", () => {
    expect(isSafePathPart("compliance-check")).toBe(true);
  });
  it("accepts safe part audit-trail", () => {
    expect(isSafePathPart("audit-trail")).toBe(true);
  });
  it("accepts safe part access-review", () => {
    expect(isSafePathPart("access-review")).toBe(true);
  });
  it("accepts safe part permission-audit", () => {
    expect(isSafePathPart("permission-audit")).toBe(true);
  });
  it("accepts safe part role-manager", () => {
    expect(isSafePathPart("role-manager")).toBe(true);
  });
  it("accepts safe part policy-enforcer", () => {
    expect(isSafePathPart("policy-enforcer")).toBe(true);
  });
  it("accepts safe part guardrail-check", () => {
    expect(isSafePathPart("guardrail-check")).toBe(true);
  });
  it("accepts safe part content-filter", () => {
    expect(isSafePathPart("content-filter")).toBe(true);
  });
  it("accepts safe part spam-detect", () => {
    expect(isSafePathPart("spam-detect")).toBe(true);
  });
  it("accepts safe part abuse-report", () => {
    expect(isSafePathPart("abuse-report")).toBe(true);
  });
  it("accepts safe part moderation-queue", () => {
    expect(isSafePathPart("moderation-queue")).toBe(true);
  });
  it("accepts safe part appeal-handler", () => {
    expect(isSafePathPart("appeal-handler")).toBe(true);
  });
  it("accepts safe part trust-score", () => {
    expect(isSafePathPart("trust-score")).toBe(true);
  });
  it("accepts safe part reputation-calc", () => {
    expect(isSafePathPart("reputation-calc")).toBe(true);
  });
  it("accepts safe part fraud-detect", () => {
    expect(isSafePathPart("fraud-detect")).toBe(true);
  });
  it("accepts safe part anomaly-detect", () => {
    expect(isSafePathPart("anomaly-detect")).toBe(true);
  });
  it("accepts safe part outlier-find", () => {
    expect(isSafePathPart("outlier-find")).toBe(true);
  });
  it("accepts safe part cluster-analyze", () => {
    expect(isSafePathPart("cluster-analyze")).toBe(true);
  });
  it("accepts safe part trend-detect", () => {
    expect(isSafePathPart("trend-detect")).toBe(true);
  });
  it("accepts safe part forecast-model", () => {
    expect(isSafePathPart("forecast-model")).toBe(true);
  });
  it("accepts safe part seasonality-adjust", () => {
    expect(isSafePathPart("seasonality-adjust")).toBe(true);
  });
  it("accepts safe part anomaly-alert", () => {
    expect(isSafePathPart("anomaly-alert")).toBe(true);
  });
  it("accepts safe part threshold-tune", () => {
    expect(isSafePathPart("threshold-tune")).toBe(true);
  });
  it("accepts safe part baseline-calc", () => {
    expect(isSafePathPart("baseline-calc")).toBe(true);
  });
  it("accepts safe part benchmark-run", () => {
    expect(isSafePathPart("benchmark-run")).toBe(true);
  });
  it("accepts safe part compare-versions", () => {
    expect(isSafePathPart("compare-versions")).toBe(true);
  });
  it("accepts safe part diff-analyzer", () => {
    expect(isSafePathPart("diff-analyzer")).toBe(true);
  });
  it("accepts safe part merge-conflict", () => {
    expect(isSafePathPart("merge-conflict")).toBe(true);
  });
  it("accepts safe part branch-strategy", () => {
    expect(isSafePathPart("branch-strategy")).toBe(true);
  });
  it("accepts safe part release-notes", () => {
    expect(isSafePathPart("release-notes")).toBe(true);
  });
  it("accepts safe part version-bump", () => {
    expect(isSafePathPart("version-bump")).toBe(true);
  });
  it("accepts safe part semver-check", () => {
    expect(isSafePathPart("semver-check")).toBe(true);
  });
  it("accepts safe part dep-update", () => {
    expect(isSafePathPart("dep-update")).toBe(true);
  });
  it("accepts safe part dep-audit", () => {
    expect(isSafePathPart("dep-audit")).toBe(true);
  });
  it("accepts safe part dep-graph", () => {
    expect(isSafePathPart("dep-graph")).toBe(true);
  });
  it("accepts safe part license-check", () => {
    expect(isSafePathPart("license-check")).toBe(true);
  });
  it("accepts safe part sbom-gen", () => {
    expect(isSafePathPart("sbom-gen")).toBe(true);
  });
  it("accepts safe part provenance-verify", () => {
    expect(isSafePathPart("provenance-verify")).toBe(true);
  });
  it("accepts safe part signature-check", () => {
    expect(isSafePathPart("signature-check")).toBe(true);
  });
  it("accepts safe part checksum-verify", () => {
    expect(isSafePathPart("checksum-verify")).toBe(true);
  });
  it("accepts safe part hash-compare", () => {
    expect(isSafePathPart("hash-compare")).toBe(true);
  });
  it("accepts safe part integrity-check", () => {
    expect(isSafePathPart("integrity-check")).toBe(true);
  });
  it("accepts safe part tamper-detect", () => {
    expect(isSafePathPart("tamper-detect")).toBe(true);
  });
  it("accepts safe part replay-attack", () => {
    expect(isSafePathPart("replay-attack")).toBe(true);
  });
  it("accepts safe part nonce-gen", () => {
    expect(isSafePathPart("nonce-gen")).toBe(true);
  });
  it("accepts safe part token-sign", () => {
    expect(isSafePathPart("token-sign")).toBe(true);
  });
  it("accepts safe part jwt-verify", () => {
    expect(isSafePathPart("jwt-verify")).toBe(true);
  });
  it("accepts safe part oauth-verify", () => {
    expect(isSafePathPart("oauth-verify")).toBe(true);
  });
  it("accepts safe part saml-parse", () => {
    expect(isSafePathPart("saml-parse")).toBe(true);
  });
  it("accepts safe part ldap-sync", () => {
    expect(isSafePathPart("ldap-sync")).toBe(true);
  });
  it("accepts safe part sso-config", () => {
    expect(isSafePathPart("sso-config")).toBe(true);
  });
  it("accepts safe part mfa-enroll", () => {
    expect(isSafePathPart("mfa-enroll")).toBe(true);
  });
  it("accepts safe part passkey-setup", () => {
    expect(isSafePathPart("passkey-setup")).toBe(true);
  });
  it("accepts safe part recovery-codes", () => {
    expect(isSafePathPart("recovery-codes")).toBe(true);
  });
  it("accepts safe part session-revoke", () => {
    expect(isSafePathPart("session-revoke")).toBe(true);
  });
  it("accepts safe part device-trust", () => {
    expect(isSafePathPart("device-trust")).toBe(true);
  });
  it("accepts safe part geo-fence", () => {
    expect(isSafePathPart("geo-fence")).toBe(true);
  });
  it("accepts safe part ip-allowlist", () => {
    expect(isSafePathPart("ip-allowlist")).toBe(true);
  });
  it("accepts safe part rate-limit", () => {
    expect(isSafePathPart("rate-limit")).toBe(true);
  });
  it("accepts safe part quota-enforce", () => {
    expect(isSafePathPart("quota-enforce")).toBe(true);
  });
  it("accepts safe part throttle-api", () => {
    expect(isSafePathPart("throttle-api")).toBe(true);
  });
  it("accepts safe part circuit-break", () => {
    expect(isSafePathPart("circuit-break")).toBe(true);
  });
  it("accepts safe part retry-policy", () => {
    expect(isSafePathPart("retry-policy")).toBe(true);
  });
  it("accepts safe part backoff-calc", () => {
    expect(isSafePathPart("backoff-calc")).toBe(true);
  });
  it("accepts safe part timeout-set", () => {
    expect(isSafePathPart("timeout-set")).toBe(true);
  });
  it("accepts safe part deadline-enforce", () => {
    expect(isSafePathPart("deadline-enforce")).toBe(true);
  });
  it("accepts safe part priority-queue", () => {
    expect(isSafePathPart("priority-queue")).toBe(true);
  });
  it("accepts safe part fair-scheduler", () => {
    expect(isSafePathPart("fair-scheduler")).toBe(true);
  });
  it("accepts safe part work-steal", () => {
    expect(isSafePathPart("work-steal")).toBe(true);
  });
  it("accepts safe part pool-resize", () => {
    expect(isSafePathPart("pool-resize")).toBe(true);
  });
  it("accepts safe part auto-scale", () => {
    expect(isSafePathPart("auto-scale")).toBe(true);
  });
  it("accepts safe part scale-down", () => {
    expect(isSafePathPart("scale-down")).toBe(true);
  });
  it("accepts safe part scale-up", () => {
    expect(isSafePathPart("scale-up")).toBe(true);
  });
  it("accepts safe part warm-pool", () => {
    expect(isSafePathPart("warm-pool")).toBe(true);
  });
  it("accepts safe part cold-start", () => {
    expect(isSafePathPart("cold-start")).toBe(true);
  });
  it("accepts safe part prewarm-cache", () => {
    expect(isSafePathPart("prewarm-cache")).toBe(true);
  });
  it("accepts safe part lazy-load", () => {
    expect(isSafePathPart("lazy-load")).toBe(true);
  });
  it("accepts safe part eager-load", () => {
    expect(isSafePathPart("eager-load")).toBe(true);
  });
  it("accepts safe part prefetch-data", () => {
    expect(isSafePathPart("prefetch-data")).toBe(true);
  });
  it("accepts safe part batch-fetch", () => {
    expect(isSafePathPart("batch-fetch")).toBe(true);
  });
  it("accepts safe part parallel-map", () => {
    expect(isSafePathPart("parallel-map")).toBe(true);
  });
  it("accepts safe part reduce-aggregate", () => {
    expect(isSafePathPart("reduce-aggregate")).toBe(true);
  });
  it("accepts safe part filter-stream", () => {
    expect(isSafePathPart("filter-stream")).toBe(true);
  });
  it("accepts safe part transform-pipe", () => {
    expect(isSafePathPart("transform-pipe")).toBe(true);
  });
  it("accepts safe part validate-schema", () => {
    expect(isSafePathPart("validate-schema")).toBe(true);
  });
  it("accepts safe part sanitize-input", () => {
    expect(isSafePathPart("sanitize-input")).toBe(true);
  });
  it("accepts safe part escape-output", () => {
    expect(isSafePathPart("escape-output")).toBe(true);
  });
  it("accepts safe part encode-url", () => {
    expect(isSafePathPart("encode-url")).toBe(true);
  });
  it("accepts safe part decode-base64", () => {
    expect(isSafePathPart("decode-base64")).toBe(true);
  });
  it("accepts safe part compress-gzip", () => {
    expect(isSafePathPart("compress-gzip")).toBe(true);
  });
  it("accepts safe part decompress-zstd", () => {
    expect(isSafePathPart("decompress-zstd")).toBe(true);
  });
  it("accepts safe part encrypt-aes", () => {
    expect(isSafePathPart("encrypt-aes")).toBe(true);
  });
  it("accepts safe part decrypt-aes", () => {
    expect(isSafePathPart("decrypt-aes")).toBe(true);
  });
  it("accepts safe part key-rotate", () => {
    expect(isSafePathPart("key-rotate")).toBe(true);
  });
  it("accepts safe part secret-store", () => {
    expect(isSafePathPart("secret-store")).toBe(true);
  });
  it("accepts safe part vault-read", () => {
    expect(isSafePathPart("vault-read")).toBe(true);
  });
  it("accepts safe part kms-encrypt", () => {
    expect(isSafePathPart("kms-encrypt")).toBe(true);
  });
  it("accepts safe part hsm-sign", () => {
    expect(isSafePathPart("hsm-sign")).toBe(true);
  });
  it("rejects unsafe part empty", () => {
    expect(isSafePathPart("")).toBe(false);
  });
  it("rejects unsafe part .", () => {
    expect(isSafePathPart(".")).toBe(false);
  });
  it("rejects unsafe part ..", () => {
    expect(isSafePathPart("..")).toBe(false);
  });
  it("rejects unsafe part foo/../bar", () => {
    expect(isSafePathPart("foo/../bar")).toBe(false);
  });
  it("rejects unsafe part ../secret", () => {
    expect(isSafePathPart("../secret")).toBe(false);
  });
  it("rejects unsafe part foo/..", () => {
    expect(isSafePathPart("foo/..")).toBe(false);
  });
  it("rejects unsafe part foo/./bar", () => {
    expect(isSafePathPart("foo/./bar")).toBe(false);
  });
  it("rejects unsafe part foo//bar", () => {
    expect(isSafePathPart("foo//bar")).toBe(false);
  });
  it("rejects unsafe part /absolute", () => {
    expect(isSafePathPart("/absolute")).toBe(false);
  });
  it("rejects unsafe part UPPER", () => {
    expect(isSafePathPart("UPPER")).toBe(false);
  });
  it("rejects unsafe part under_score", () => {
    expect(isSafePathPart("under_score")).toBe(false);
  });
  it("rejects unsafe part dot.name", () => {
    expect(isSafePathPart("dot.name")).toBe(false);
  });
  it("rejects unsafe part space name", () => {
    expect(isSafePathPart("space name")).toBe(false);
  });
  it("rejects unsafe part tab?name", () => {
    expect(isSafePathPart("tab\tname")).toBe(false);
  });
  it("rejects unsafe part emoji-??", () => {
    expect(isSafePathPart("emoji-🔥")).toBe(false);
  });
  it("rejects unsafe part percent%20", () => {
    expect(isSafePathPart("percent%20")).toBe(false);
  });
  it("rejects unsafe part plus+sign", () => {
    expect(isSafePathPart("plus+sign")).toBe(false);
  });
  it("rejects unsafe part at@sign", () => {
    expect(isSafePathPart("at@sign")).toBe(false);
  });
  it("rejects unsafe part colon:part", () => {
    expect(isSafePathPart("colon:part")).toBe(false);
  });
  it("rejects unsafe part semi;colon", () => {
    expect(isSafePathPart("semi;colon")).toBe(false);
  });
  it("rejects unsafe part comma,part", () => {
    expect(isSafePathPart("comma,part")).toBe(false);
  });
  it("rejects unsafe part question?mark", () => {
    expect(isSafePathPart("question?mark")).toBe(false);
  });
  it("rejects unsafe part star*wild", () => {
    expect(isSafePathPart("star*wild")).toBe(false);
  });
  it("rejects unsafe part paren(test)", () => {
    expect(isSafePathPart("paren(test)")).toBe(false);
  });
  it("rejects unsafe part bracket[test]", () => {
    expect(isSafePathPart("bracket[test]")).toBe(false);
  });
  it("rejects unsafe part brace{test}", () => {
    expect(isSafePathPart("brace{test}")).toBe(false);
  });
  it("rejects unsafe part quote'test", () => {
    expect(isSafePathPart("quote'test")).toBe(false);
  });
  it('rejects unsafe part quote"test', () => {
    expect(isSafePathPart('quote"test')).toBe(false);
  });
  it("rejects unsafe part back\\slash", () => {
    expect(isSafePathPart("back\\slash")).toBe(false);
  });
  it("rejects unsafe part pipe|test", () => {
    expect(isSafePathPart("pipe|test")).toBe(false);
  });
  it("rejects unsafe part tilde~test", () => {
    expect(isSafePathPart("tilde~test")).toBe(false);
  });
  it("rejects unsafe part caret^test", () => {
    expect(isSafePathPart("caret^test")).toBe(false);
  });
  it("rejects unsafe part dollar$test", () => {
    expect(isSafePathPart("dollar$test")).toBe(false);
  });
  it("rejects unsafe part hash#test", () => {
    expect(isSafePathPart("hash#test")).toBe(false);
  });
  it("rejects unsafe part ampersand&test", () => {
    expect(isSafePathPart("ampersand&test")).toBe(false);
  });
  it("rejects unsafe part equals=test", () => {
    expect(isSafePathPart("equals=test")).toBe(false);
  });
  it("rejects unsafe part null\0byte", () => {
    expect(isSafePathPart("null\u0000byte")).toBe(false);
  });
  it("rejects unsafe part newline\npart", () => {
    expect(isSafePathPart("newline\npart")).toBe(false);
  });
  it("rejects unsafe part carriage\rpart", () => {
    expect(isSafePathPart("carriage\rpart")).toBe(false);
  });
  it("rejects unsafe part unicode-caf?", () => {
    expect(isSafePathPart("unicode-café")).toBe(false);
  });
  it("rejects unsafe part cyrillic-????", () => {
    expect(isSafePathPart("cyrillic-тест")).toBe(false);
  });
  it("rejects unsafe part chinese-??", () => {
    expect(isSafePathPart("chinese-测试")).toBe(false);
  });
  it("rejects unsafe part japanese-???", () => {
    expect(isSafePathPart("japanese-テスト")).toBe(false);
  });
  it("rejects unsafe part arabic-??????", () => {
    expect(isSafePathPart("arabic-اختبار")).toBe(false);
  });
  it("rejects unsafe part hebrew-?????", () => {
    expect(isSafePathPart("hebrew-בדיקה")).toBe(false);
  });
  it("rejects unsafe part thai-???ob", () => {
    expect(isSafePathPart("thai-ทดสob")).toBe(false);
  });
  it("rejects unsafe part korean-???", () => {
    expect(isSafePathPart("korean-테스트")).toBe(false);
  });
  it("rejects unsafe part greek-??????", () => {
    expect(isSafePathPart("greek-δοκιμή")).toBe(false);
  });
  it("rejects unsafe part mixed-Abc123", () => {
    expect(isSafePathPart("mixed-Abc123")).toBe(false);
  });
  it("rejects unsafe part valid-start-invalid-end!", () => {
    expect(isSafePathPart("valid-start-invalid-end!")).toBe(false);
  });
  it("rejects unsafe part !invalid-start-valid-end", () => {
    expect(isSafePathPart("!invalid-start-valid-end")).toBe(false);
  });
  it("rejects unsafe part path/with/slash", () => {
    expect(isSafePathPart("path/with/slash")).toBe(false);
  });
  it("rejects unsafe part path\\with\\backslash", () => {
    expect(isSafePathPart("path\\with\\backslash")).toBe(false);
  });
  it("rejects unsafe part NaN", () => {
    expect(isSafePathPart("NaN")).toBe(false);
  });
  it("rejects unsafe part 3.14", () => {
    expect(isSafePathPart("3.14")).toBe(false);
  });
  it("rejects unsafe part Infinity", () => {
    expect(isSafePathPart("Infinity")).toBe(false);
  });
  it("rejects unsafe part -Infinity", () => {
    expect(isSafePathPart("-Infinity")).toBe(false);
  });
  it("rejects unsafe part []", () => {
    expect(isSafePathPart("[]")).toBe(false);
  });
  it("rejects unsafe part {}", () => {
    expect(isSafePathPart("{}")).toBe(false);
  });
  it("rejects unsafe part []foo", () => {
    expect(isSafePathPart("[]foo")).toBe(false);
  });
  it("rejects unsafe part foo[]", () => {
    expect(isSafePathPart("foo[]")).toBe(false);
  });
  it("rejects unsafe part <script>", () => {
    expect(isSafePathPart("<script>")).toBe(false);
  });
  it("rejects unsafe part </script>", () => {
    expect(isSafePathPart("</script>")).toBe(false);
  });
  it("rejects unsafe part javascript:alert(1)", () => {
    expect(isSafePathPart("javascript:alert(1)")).toBe(false);
  });
  it("rejects unsafe part data:text/html", () => {
    expect(isSafePathPart("data:text/html")).toBe(false);
  });
  it("rejects unsafe part file:///etc/passwd", () => {
    expect(isSafePathPart("file:///etc/passwd")).toBe(false);
  });
  it("rejects unsafe part http://evil.com", () => {
    expect(isSafePathPart("http://evil.com")).toBe(false);
  });
  it("rejects unsafe part https://evil.com", () => {
    expect(isSafePathPart("https://evil.com")).toBe(false);
  });
  it("rejects unsafe part ftp://evil.com", () => {
    expect(isSafePathPart("ftp://evil.com")).toBe(false);
  });
  it("rejects unsafe part ssh://evil.com", () => {
    expect(isSafePathPart("ssh://evil.com")).toBe(false);
  });
  it("rejects unsafe part git+ssh://evil.com", () => {
    expect(isSafePathPart("git+ssh://evil.com")).toBe(false);
  });
  it("rejects unsafe part npm:@scope/pkg", () => {
    expect(isSafePathPart("npm:@scope/pkg")).toBe(false);
  });
  it("rejects unsafe part scoped@pkg", () => {
    expect(isSafePathPart("scoped@pkg")).toBe(false);
  });
  it("rejects unsafe part pkg@1.0.0", () => {
    expect(isSafePathPart("pkg@1.0.0")).toBe(false);
  });
  it("rejects unsafe part pkg@latest", () => {
    expect(isSafePathPart("pkg@latest")).toBe(false);
  });
  it("rejects unsafe part pkg@^1.0.0", () => {
    expect(isSafePathPart("pkg@^1.0.0")).toBe(false);
  });
  it("rejects unsafe part pkg@~1.0.0", () => {
    expect(isSafePathPart("pkg@~1.0.0")).toBe(false);
  });
  it("rejects unsafe part pkg@>=1.0.0", () => {
    expect(isSafePathPart("pkg@>=1.0.0")).toBe(false);
  });
  it("rejects unsafe part pkg@<=1.0.0", () => {
    expect(isSafePathPart("pkg@<=1.0.0")).toBe(false);
  });
  it("rejects unsafe part pkg@>1.0.0", () => {
    expect(isSafePathPart("pkg@>1.0.0")).toBe(false);
  });
  it("rejects unsafe part pkg@<1.0.0", () => {
    expect(isSafePathPart("pkg@<1.0.0")).toBe(false);
  });
  it("rejects unsafe part pkg@!=1.0.0", () => {
    expect(isSafePathPart("pkg@!=1.0.0")).toBe(false);
  });
  it("rejects unsafe part pkg@1.0.0-beta.1", () => {
    expect(isSafePathPart("pkg@1.0.0-beta.1")).toBe(false);
  });
  it("rejects unsafe part pkg@1.0.0-alpha.1", () => {
    expect(isSafePathPart("pkg@1.0.0-alpha.1")).toBe(false);
  });
  it("rejects unsafe part pkg@1.0.0-rc.1", () => {
    expect(isSafePathPart("pkg@1.0.0-rc.1")).toBe(false);
  });
  it("rejects unsafe part pkg@1.0.0+build.1", () => {
    expect(isSafePathPart("pkg@1.0.0+build.1")).toBe(false);
  });
  it("rejects unsafe part pkg@1.0.0-build.1", () => {
    expect(isSafePathPart("pkg@1.0.0-build.1")).toBe(false);
  });
  it("rejects unsafe part pkg@1.0.0-build.1+sha.1", () => {
    expect(isSafePathPart("pkg@1.0.0-build.1+sha.1")).toBe(false);
  });
  it("rejects unsafe part pkg@1.0.0-build.1+sha.1+meta.1", () => {
    expect(isSafePathPart("pkg@1.0.0-build.1+sha.1+meta.1")).toBe(false);
  });
  it("rejects unsafe part pkg@1.0.0-build.1+sha.1+meta.1+extra.1", () => {
    expect(isSafePathPart("pkg@1.0.0-build.1+sha.1+meta.1+extra.1")).toBe(
      false,
    );
  });
  it("rejects unsafe part pkg@1.0.0-build.1+sha.1+meta.1+extra.1+m", () => {
    expect(
      isSafePathPart("pkg@1.0.0-build.1+sha.1+meta.1+extra.1+more.1"),
    ).toBe(false);
  });
  it("rejects unsafe part pkg@1.0.0-build.1+sha.1+meta.1+extra.1+m", () => {
    expect(
      isSafePathPart("pkg@1.0.0-build.1+sha.1+meta.1+extra.1+more.1+final.1"),
    ).toBe(false);
  });
  it("rejects unsafe part windows\\device\\con", () => {
    expect(isSafePathPart("windows\\device\\con")).toBe(false);
  });
  it("rejects unsafe part windows\\device\\prn", () => {
    expect(isSafePathPart("windows\\device\\prn")).toBe(false);
  });
  it("rejects unsafe part windows\\device\\aux", () => {
    expect(isSafePathPart("windows\\device\\aux")).toBe(false);
  });
  it("rejects unsafe part windows\\device\\nul", () => {
    expect(isSafePathPart("windows\\device\\nul")).toBe(false);
  });
  it("rejects unsafe part windows\\device\\com1", () => {
    expect(isSafePathPart("windows\\device\\com1")).toBe(false);
  });
  it("rejects unsafe part windows\\device\\lpt1", () => {
    expect(isSafePathPart("windows\\device\\lpt1")).toBe(false);
  });
  it("rejects unsafe part reserved/con", () => {
    expect(isSafePathPart("reserved/con")).toBe(false);
  });
  it("rejects unsafe part reserved/prn", () => {
    expect(isSafePathPart("reserved/prn")).toBe(false);
  });
  it("rejects unsafe part reserved/aux", () => {
    expect(isSafePathPart("reserved/aux")).toBe(false);
  });
  it("rejects unsafe part reserved/nul", () => {
    expect(isSafePathPart("reserved/nul")).toBe(false);
  });
  it("rejects unsafe part reserved/com1", () => {
    expect(isSafePathPart("reserved/com1")).toBe(false);
  });
  it("rejects unsafe part reserved/lpt1", () => {
    expect(isSafePathPart("reserved/lpt1")).toBe(false);
  });
  it("rejects unsafe part dotfile/.hidden", () => {
    expect(isSafePathPart("dotfile/.hidden")).toBe(false);
  });
  it("rejects unsafe part dotfile/..hidden", () => {
    expect(isSafePathPart("dotfile/..hidden")).toBe(false);
  });
  it("rejects unsafe part dotfile/...hidden", () => {
    expect(isSafePathPart("dotfile/...hidden")).toBe(false);
  });
  it("rejects unsafe part dotfile/....hidden", () => {
    expect(isSafePathPart("dotfile/....hidden")).toBe(false);
  });
  it("rejects unsafe part dotfile/.....hidden", () => {
    expect(isSafePathPart("dotfile/.....hidden")).toBe(false);
  });
  it("rejects unsafe part dotfile/......hidden", () => {
    expect(isSafePathPart("dotfile/......hidden")).toBe(false);
  });
  it("rejects unsafe part dotfile/.......hidden", () => {
    expect(isSafePathPart("dotfile/.......hidden")).toBe(false);
  });
  it("rejects unsafe part dotfile/........hidden", () => {
    expect(isSafePathPart("dotfile/........hidden")).toBe(false);
  });
  it("rejects unsafe part dotfile/.........hidden", () => {
    expect(isSafePathPart("dotfile/.........hidden")).toBe(false);
  });
  it("rejects unsafe part dotfile/..........hidden", () => {
    expect(isSafePathPart("dotfile/..........hidden")).toBe(false);
  });
  it("accepts slug-safe edge part 123numeric", () => {
    expect(isSafePathPart("123numeric")).toBe(true);
  });
  it("accepts slug-safe edge part -leading-dash", () => {
    expect(isSafePathPart("-leading-dash")).toBe(true);
  });
  it("accepts slug-safe edge part trailing-dash-", () => {
    expect(isSafePathPart("trailing-dash-")).toBe(true);
  });
  it("accepts slug-safe edge part double--dash", () => {
    expect(isSafePathPart("double--dash")).toBe(true);
  });
  it("accepts slug-safe edge part triple---dash", () => {
    expect(isSafePathPart("triple---dash")).toBe(true);
  });
  it("accepts slug-safe edge part aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa", () => {
    expect(
      isSafePathPart(
        "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
      ),
    ).toBe(true);
  });
  it("accepts slug-safe edge part null", () => {
    expect(isSafePathPart("null")).toBe(true);
  });
  it("accepts slug-safe edge part undefined", () => {
    expect(isSafePathPart("undefined")).toBe(true);
  });
  it("accepts slug-safe edge part true", () => {
    expect(isSafePathPart("true")).toBe(true);
  });
  it("accepts slug-safe edge part false", () => {
    expect(isSafePathPart("false")).toBe(true);
  });
  it("accepts slug-safe edge part 0", () => {
    expect(isSafePathPart("0")).toBe(true);
  });
  it("accepts slug-safe edge part 1", () => {
    expect(isSafePathPart("1")).toBe(true);
  });
  it("accepts slug-safe edge part 42", () => {
    expect(isSafePathPart("42")).toBe(true);
  });
  it("accepts slug-safe edge part -1", () => {
    expect(isSafePathPart("-1")).toBe(true);
  });
  it("accepts slug-safe edge part 1e10", () => {
    expect(isSafePathPart("1e10")).toBe(true);
  });
  it("isSafePathPart matrix agents/0", () => {
    expect(isSafePathPart("agents")).toBe(true);
    expect(isSafePathPart("agents-fixture-0")).toBe(true);
    expect(isSafePathPart("AGENTS")).toBe(false);
    expect(isSafePathPart("agents-fixture-0_bad")).toBe(false);
  });
  it("isSafePathPart matrix agents/1", () => {
    expect(isSafePathPart("agents")).toBe(true);
    expect(isSafePathPart("agents-fixture-1")).toBe(true);
    expect(isSafePathPart("AGENTS")).toBe(false);
    expect(isSafePathPart("agents-fixture-1_bad")).toBe(false);
  });
  it("isSafePathPart matrix agents/2", () => {
    expect(isSafePathPart("agents")).toBe(true);
    expect(isSafePathPart("agents-fixture-2")).toBe(true);
    expect(isSafePathPart("AGENTS")).toBe(false);
    expect(isSafePathPart("agents-fixture-2_bad")).toBe(false);
  });
  it("isSafePathPart matrix agents/3", () => {
    expect(isSafePathPart("agents")).toBe(true);
    expect(isSafePathPart("agents-fixture-3")).toBe(true);
    expect(isSafePathPart("AGENTS")).toBe(false);
    expect(isSafePathPart("agents-fixture-3_bad")).toBe(false);
  });
  it("isSafePathPart matrix agents/4", () => {
    expect(isSafePathPart("agents")).toBe(true);
    expect(isSafePathPart("agents-fixture-4")).toBe(true);
    expect(isSafePathPart("AGENTS")).toBe(false);
    expect(isSafePathPart("agents-fixture-4_bad")).toBe(false);
  });
  it("isSafePathPart matrix agents/5", () => {
    expect(isSafePathPart("agents")).toBe(true);
    expect(isSafePathPart("agents-fixture-5")).toBe(true);
    expect(isSafePathPart("AGENTS")).toBe(false);
    expect(isSafePathPart("agents-fixture-5_bad")).toBe(false);
  });
  it("isSafePathPart matrix agents/6", () => {
    expect(isSafePathPart("agents")).toBe(true);
    expect(isSafePathPart("agents-fixture-6")).toBe(true);
    expect(isSafePathPart("AGENTS")).toBe(false);
    expect(isSafePathPart("agents-fixture-6_bad")).toBe(false);
  });
  it("isSafePathPart matrix agents/7", () => {
    expect(isSafePathPart("agents")).toBe(true);
    expect(isSafePathPart("agents-fixture-7")).toBe(true);
    expect(isSafePathPart("AGENTS")).toBe(false);
    expect(isSafePathPart("agents-fixture-7_bad")).toBe(false);
  });
  it("isSafePathPart matrix mcp/0", () => {
    expect(isSafePathPart("mcp")).toBe(true);
    expect(isSafePathPart("mcp-fixture-0")).toBe(true);
    expect(isSafePathPart("MCP")).toBe(false);
    expect(isSafePathPart("mcp-fixture-0_bad")).toBe(false);
  });
  it("isSafePathPart matrix mcp/1", () => {
    expect(isSafePathPart("mcp")).toBe(true);
    expect(isSafePathPart("mcp-fixture-1")).toBe(true);
    expect(isSafePathPart("MCP")).toBe(false);
    expect(isSafePathPart("mcp-fixture-1_bad")).toBe(false);
  });
  it("isSafePathPart matrix mcp/2", () => {
    expect(isSafePathPart("mcp")).toBe(true);
    expect(isSafePathPart("mcp-fixture-2")).toBe(true);
    expect(isSafePathPart("MCP")).toBe(false);
    expect(isSafePathPart("mcp-fixture-2_bad")).toBe(false);
  });
  it("isSafePathPart matrix mcp/3", () => {
    expect(isSafePathPart("mcp")).toBe(true);
    expect(isSafePathPart("mcp-fixture-3")).toBe(true);
    expect(isSafePathPart("MCP")).toBe(false);
    expect(isSafePathPart("mcp-fixture-3_bad")).toBe(false);
  });
  it("isSafePathPart matrix mcp/4", () => {
    expect(isSafePathPart("mcp")).toBe(true);
    expect(isSafePathPart("mcp-fixture-4")).toBe(true);
    expect(isSafePathPart("MCP")).toBe(false);
    expect(isSafePathPart("mcp-fixture-4_bad")).toBe(false);
  });
  it("isSafePathPart matrix mcp/5", () => {
    expect(isSafePathPart("mcp")).toBe(true);
    expect(isSafePathPart("mcp-fixture-5")).toBe(true);
    expect(isSafePathPart("MCP")).toBe(false);
    expect(isSafePathPart("mcp-fixture-5_bad")).toBe(false);
  });
  it("isSafePathPart matrix mcp/6", () => {
    expect(isSafePathPart("mcp")).toBe(true);
    expect(isSafePathPart("mcp-fixture-6")).toBe(true);
    expect(isSafePathPart("MCP")).toBe(false);
    expect(isSafePathPart("mcp-fixture-6_bad")).toBe(false);
  });
  it("isSafePathPart matrix mcp/7", () => {
    expect(isSafePathPart("mcp")).toBe(true);
    expect(isSafePathPart("mcp-fixture-7")).toBe(true);
    expect(isSafePathPart("MCP")).toBe(false);
    expect(isSafePathPart("mcp-fixture-7_bad")).toBe(false);
  });
  it("isSafePathPart matrix tools/0", () => {
    expect(isSafePathPart("tools")).toBe(true);
    expect(isSafePathPart("tools-fixture-0")).toBe(true);
    expect(isSafePathPart("TOOLS")).toBe(false);
    expect(isSafePathPart("tools-fixture-0_bad")).toBe(false);
  });
  it("isSafePathPart matrix tools/1", () => {
    expect(isSafePathPart("tools")).toBe(true);
    expect(isSafePathPart("tools-fixture-1")).toBe(true);
    expect(isSafePathPart("TOOLS")).toBe(false);
    expect(isSafePathPart("tools-fixture-1_bad")).toBe(false);
  });
  it("isSafePathPart matrix tools/2", () => {
    expect(isSafePathPart("tools")).toBe(true);
    expect(isSafePathPart("tools-fixture-2")).toBe(true);
    expect(isSafePathPart("TOOLS")).toBe(false);
    expect(isSafePathPart("tools-fixture-2_bad")).toBe(false);
  });
  it("isSafePathPart matrix tools/3", () => {
    expect(isSafePathPart("tools")).toBe(true);
    expect(isSafePathPart("tools-fixture-3")).toBe(true);
    expect(isSafePathPart("TOOLS")).toBe(false);
    expect(isSafePathPart("tools-fixture-3_bad")).toBe(false);
  });
  it("isSafePathPart matrix tools/4", () => {
    expect(isSafePathPart("tools")).toBe(true);
    expect(isSafePathPart("tools-fixture-4")).toBe(true);
    expect(isSafePathPart("TOOLS")).toBe(false);
    expect(isSafePathPart("tools-fixture-4_bad")).toBe(false);
  });
  it("isSafePathPart matrix tools/5", () => {
    expect(isSafePathPart("tools")).toBe(true);
    expect(isSafePathPart("tools-fixture-5")).toBe(true);
    expect(isSafePathPart("TOOLS")).toBe(false);
    expect(isSafePathPart("tools-fixture-5_bad")).toBe(false);
  });
  it("isSafePathPart matrix tools/6", () => {
    expect(isSafePathPart("tools")).toBe(true);
    expect(isSafePathPart("tools-fixture-6")).toBe(true);
    expect(isSafePathPart("TOOLS")).toBe(false);
    expect(isSafePathPart("tools-fixture-6_bad")).toBe(false);
  });
  it("isSafePathPart matrix tools/7", () => {
    expect(isSafePathPart("tools")).toBe(true);
    expect(isSafePathPart("tools-fixture-7")).toBe(true);
    expect(isSafePathPart("TOOLS")).toBe(false);
    expect(isSafePathPart("tools-fixture-7_bad")).toBe(false);
  });
  it("isSafePathPart matrix skills/0", () => {
    expect(isSafePathPart("skills")).toBe(true);
    expect(isSafePathPart("skills-fixture-0")).toBe(true);
    expect(isSafePathPart("SKILLS")).toBe(false);
    expect(isSafePathPart("skills-fixture-0_bad")).toBe(false);
  });
  it("isSafePathPart matrix skills/1", () => {
    expect(isSafePathPart("skills")).toBe(true);
    expect(isSafePathPart("skills-fixture-1")).toBe(true);
    expect(isSafePathPart("SKILLS")).toBe(false);
    expect(isSafePathPart("skills-fixture-1_bad")).toBe(false);
  });
  it("isSafePathPart matrix skills/2", () => {
    expect(isSafePathPart("skills")).toBe(true);
    expect(isSafePathPart("skills-fixture-2")).toBe(true);
    expect(isSafePathPart("SKILLS")).toBe(false);
    expect(isSafePathPart("skills-fixture-2_bad")).toBe(false);
  });
  it("isSafePathPart matrix skills/3", () => {
    expect(isSafePathPart("skills")).toBe(true);
    expect(isSafePathPart("skills-fixture-3")).toBe(true);
    expect(isSafePathPart("SKILLS")).toBe(false);
    expect(isSafePathPart("skills-fixture-3_bad")).toBe(false);
  });
  it("isSafePathPart matrix skills/4", () => {
    expect(isSafePathPart("skills")).toBe(true);
    expect(isSafePathPart("skills-fixture-4")).toBe(true);
    expect(isSafePathPart("SKILLS")).toBe(false);
    expect(isSafePathPart("skills-fixture-4_bad")).toBe(false);
  });
  it("isSafePathPart matrix skills/5", () => {
    expect(isSafePathPart("skills")).toBe(true);
    expect(isSafePathPart("skills-fixture-5")).toBe(true);
    expect(isSafePathPart("SKILLS")).toBe(false);
    expect(isSafePathPart("skills-fixture-5_bad")).toBe(false);
  });
  it("isSafePathPart matrix skills/6", () => {
    expect(isSafePathPart("skills")).toBe(true);
    expect(isSafePathPart("skills-fixture-6")).toBe(true);
    expect(isSafePathPart("SKILLS")).toBe(false);
    expect(isSafePathPart("skills-fixture-6_bad")).toBe(false);
  });
  it("isSafePathPart matrix skills/7", () => {
    expect(isSafePathPart("skills")).toBe(true);
    expect(isSafePathPart("skills-fixture-7")).toBe(true);
    expect(isSafePathPart("SKILLS")).toBe(false);
    expect(isSafePathPart("skills-fixture-7_bad")).toBe(false);
  });
  it("isSafePathPart matrix rules/0", () => {
    expect(isSafePathPart("rules")).toBe(true);
    expect(isSafePathPart("rules-fixture-0")).toBe(true);
    expect(isSafePathPart("RULES")).toBe(false);
    expect(isSafePathPart("rules-fixture-0_bad")).toBe(false);
  });
  it("isSafePathPart matrix rules/1", () => {
    expect(isSafePathPart("rules")).toBe(true);
    expect(isSafePathPart("rules-fixture-1")).toBe(true);
    expect(isSafePathPart("RULES")).toBe(false);
    expect(isSafePathPart("rules-fixture-1_bad")).toBe(false);
  });
  it("isSafePathPart matrix rules/2", () => {
    expect(isSafePathPart("rules")).toBe(true);
    expect(isSafePathPart("rules-fixture-2")).toBe(true);
    expect(isSafePathPart("RULES")).toBe(false);
    expect(isSafePathPart("rules-fixture-2_bad")).toBe(false);
  });
  it("isSafePathPart matrix rules/3", () => {
    expect(isSafePathPart("rules")).toBe(true);
    expect(isSafePathPart("rules-fixture-3")).toBe(true);
    expect(isSafePathPart("RULES")).toBe(false);
    expect(isSafePathPart("rules-fixture-3_bad")).toBe(false);
  });
  it("isSafePathPart matrix rules/4", () => {
    expect(isSafePathPart("rules")).toBe(true);
    expect(isSafePathPart("rules-fixture-4")).toBe(true);
    expect(isSafePathPart("RULES")).toBe(false);
    expect(isSafePathPart("rules-fixture-4_bad")).toBe(false);
  });
  it("isSafePathPart matrix rules/5", () => {
    expect(isSafePathPart("rules")).toBe(true);
    expect(isSafePathPart("rules-fixture-5")).toBe(true);
    expect(isSafePathPart("RULES")).toBe(false);
    expect(isSafePathPart("rules-fixture-5_bad")).toBe(false);
  });
  it("isSafePathPart matrix rules/6", () => {
    expect(isSafePathPart("rules")).toBe(true);
    expect(isSafePathPart("rules-fixture-6")).toBe(true);
    expect(isSafePathPart("RULES")).toBe(false);
    expect(isSafePathPart("rules-fixture-6_bad")).toBe(false);
  });
  it("isSafePathPart matrix rules/7", () => {
    expect(isSafePathPart("rules")).toBe(true);
    expect(isSafePathPart("rules-fixture-7")).toBe(true);
    expect(isSafePathPart("RULES")).toBe(false);
    expect(isSafePathPart("rules-fixture-7_bad")).toBe(false);
  });
  it("isSafePathPart matrix commands/0", () => {
    expect(isSafePathPart("commands")).toBe(true);
    expect(isSafePathPart("commands-fixture-0")).toBe(true);
    expect(isSafePathPart("COMMANDS")).toBe(false);
    expect(isSafePathPart("commands-fixture-0_bad")).toBe(false);
  });
  it("isSafePathPart matrix commands/1", () => {
    expect(isSafePathPart("commands")).toBe(true);
    expect(isSafePathPart("commands-fixture-1")).toBe(true);
    expect(isSafePathPart("COMMANDS")).toBe(false);
    expect(isSafePathPart("commands-fixture-1_bad")).toBe(false);
  });
  it("isSafePathPart matrix commands/2", () => {
    expect(isSafePathPart("commands")).toBe(true);
    expect(isSafePathPart("commands-fixture-2")).toBe(true);
    expect(isSafePathPart("COMMANDS")).toBe(false);
    expect(isSafePathPart("commands-fixture-2_bad")).toBe(false);
  });
  it("isSafePathPart matrix commands/3", () => {
    expect(isSafePathPart("commands")).toBe(true);
    expect(isSafePathPart("commands-fixture-3")).toBe(true);
    expect(isSafePathPart("COMMANDS")).toBe(false);
    expect(isSafePathPart("commands-fixture-3_bad")).toBe(false);
  });
  it("isSafePathPart matrix commands/4", () => {
    expect(isSafePathPart("commands")).toBe(true);
    expect(isSafePathPart("commands-fixture-4")).toBe(true);
    expect(isSafePathPart("COMMANDS")).toBe(false);
    expect(isSafePathPart("commands-fixture-4_bad")).toBe(false);
  });
  it("isSafePathPart matrix commands/5", () => {
    expect(isSafePathPart("commands")).toBe(true);
    expect(isSafePathPart("commands-fixture-5")).toBe(true);
    expect(isSafePathPart("COMMANDS")).toBe(false);
    expect(isSafePathPart("commands-fixture-5_bad")).toBe(false);
  });
  it("isSafePathPart matrix commands/6", () => {
    expect(isSafePathPart("commands")).toBe(true);
    expect(isSafePathPart("commands-fixture-6")).toBe(true);
    expect(isSafePathPart("COMMANDS")).toBe(false);
    expect(isSafePathPart("commands-fixture-6_bad")).toBe(false);
  });
  it("isSafePathPart matrix commands/7", () => {
    expect(isSafePathPart("commands")).toBe(true);
    expect(isSafePathPart("commands-fixture-7")).toBe(true);
    expect(isSafePathPart("COMMANDS")).toBe(false);
    expect(isSafePathPart("commands-fixture-7_bad")).toBe(false);
  });
  it("isSafePathPart matrix hooks/0", () => {
    expect(isSafePathPart("hooks")).toBe(true);
    expect(isSafePathPart("hooks-fixture-0")).toBe(true);
    expect(isSafePathPart("HOOKS")).toBe(false);
    expect(isSafePathPart("hooks-fixture-0_bad")).toBe(false);
  });
  it("isSafePathPart matrix hooks/1", () => {
    expect(isSafePathPart("hooks")).toBe(true);
    expect(isSafePathPart("hooks-fixture-1")).toBe(true);
    expect(isSafePathPart("HOOKS")).toBe(false);
    expect(isSafePathPart("hooks-fixture-1_bad")).toBe(false);
  });
  it("isSafePathPart matrix hooks/2", () => {
    expect(isSafePathPart("hooks")).toBe(true);
    expect(isSafePathPart("hooks-fixture-2")).toBe(true);
    expect(isSafePathPart("HOOKS")).toBe(false);
    expect(isSafePathPart("hooks-fixture-2_bad")).toBe(false);
  });
  it("isSafePathPart matrix hooks/3", () => {
    expect(isSafePathPart("hooks")).toBe(true);
    expect(isSafePathPart("hooks-fixture-3")).toBe(true);
    expect(isSafePathPart("HOOKS")).toBe(false);
    expect(isSafePathPart("hooks-fixture-3_bad")).toBe(false);
  });
  it("isSafePathPart matrix hooks/4", () => {
    expect(isSafePathPart("hooks")).toBe(true);
    expect(isSafePathPart("hooks-fixture-4")).toBe(true);
    expect(isSafePathPart("HOOKS")).toBe(false);
    expect(isSafePathPart("hooks-fixture-4_bad")).toBe(false);
  });
  it("isSafePathPart matrix hooks/5", () => {
    expect(isSafePathPart("hooks")).toBe(true);
    expect(isSafePathPart("hooks-fixture-5")).toBe(true);
    expect(isSafePathPart("HOOKS")).toBe(false);
    expect(isSafePathPart("hooks-fixture-5_bad")).toBe(false);
  });
  it("isSafePathPart matrix hooks/6", () => {
    expect(isSafePathPart("hooks")).toBe(true);
    expect(isSafePathPart("hooks-fixture-6")).toBe(true);
    expect(isSafePathPart("HOOKS")).toBe(false);
    expect(isSafePathPart("hooks-fixture-6_bad")).toBe(false);
  });
  it("isSafePathPart matrix hooks/7", () => {
    expect(isSafePathPart("hooks")).toBe(true);
    expect(isSafePathPart("hooks-fixture-7")).toBe(true);
    expect(isSafePathPart("HOOKS")).toBe(false);
    expect(isSafePathPart("hooks-fixture-7_bad")).toBe(false);
  });
  it("isSafePathPart matrix guides/0", () => {
    expect(isSafePathPart("guides")).toBe(true);
    expect(isSafePathPart("guides-fixture-0")).toBe(true);
    expect(isSafePathPart("GUIDES")).toBe(false);
    expect(isSafePathPart("guides-fixture-0_bad")).toBe(false);
  });
  it("isSafePathPart matrix guides/1", () => {
    expect(isSafePathPart("guides")).toBe(true);
    expect(isSafePathPart("guides-fixture-1")).toBe(true);
    expect(isSafePathPart("GUIDES")).toBe(false);
    expect(isSafePathPart("guides-fixture-1_bad")).toBe(false);
  });
  it("isSafePathPart matrix guides/2", () => {
    expect(isSafePathPart("guides")).toBe(true);
    expect(isSafePathPart("guides-fixture-2")).toBe(true);
    expect(isSafePathPart("GUIDES")).toBe(false);
    expect(isSafePathPart("guides-fixture-2_bad")).toBe(false);
  });
  it("isSafePathPart matrix guides/3", () => {
    expect(isSafePathPart("guides")).toBe(true);
    expect(isSafePathPart("guides-fixture-3")).toBe(true);
    expect(isSafePathPart("GUIDES")).toBe(false);
    expect(isSafePathPart("guides-fixture-3_bad")).toBe(false);
  });
  it("isSafePathPart matrix guides/4", () => {
    expect(isSafePathPart("guides")).toBe(true);
    expect(isSafePathPart("guides-fixture-4")).toBe(true);
    expect(isSafePathPart("GUIDES")).toBe(false);
    expect(isSafePathPart("guides-fixture-4_bad")).toBe(false);
  });
  it("isSafePathPart matrix guides/5", () => {
    expect(isSafePathPart("guides")).toBe(true);
    expect(isSafePathPart("guides-fixture-5")).toBe(true);
    expect(isSafePathPart("GUIDES")).toBe(false);
    expect(isSafePathPart("guides-fixture-5_bad")).toBe(false);
  });
  it("isSafePathPart matrix guides/6", () => {
    expect(isSafePathPart("guides")).toBe(true);
    expect(isSafePathPart("guides-fixture-6")).toBe(true);
    expect(isSafePathPart("GUIDES")).toBe(false);
    expect(isSafePathPart("guides-fixture-6_bad")).toBe(false);
  });
  it("isSafePathPart matrix guides/7", () => {
    expect(isSafePathPart("guides")).toBe(true);
    expect(isSafePathPart("guides-fixture-7")).toBe(true);
    expect(isSafePathPart("GUIDES")).toBe(false);
    expect(isSafePathPart("guides-fixture-7_bad")).toBe(false);
  });
  it("isSafePathPart matrix collections/0", () => {
    expect(isSafePathPart("collections")).toBe(true);
    expect(isSafePathPart("collections-fixture-0")).toBe(true);
    expect(isSafePathPart("COLLECTIONS")).toBe(false);
    expect(isSafePathPart("collections-fixture-0_bad")).toBe(false);
  });
  it("isSafePathPart matrix collections/1", () => {
    expect(isSafePathPart("collections")).toBe(true);
    expect(isSafePathPart("collections-fixture-1")).toBe(true);
    expect(isSafePathPart("COLLECTIONS")).toBe(false);
    expect(isSafePathPart("collections-fixture-1_bad")).toBe(false);
  });
  it("isSafePathPart matrix collections/2", () => {
    expect(isSafePathPart("collections")).toBe(true);
    expect(isSafePathPart("collections-fixture-2")).toBe(true);
    expect(isSafePathPart("COLLECTIONS")).toBe(false);
    expect(isSafePathPart("collections-fixture-2_bad")).toBe(false);
  });
  it("isSafePathPart matrix collections/3", () => {
    expect(isSafePathPart("collections")).toBe(true);
    expect(isSafePathPart("collections-fixture-3")).toBe(true);
    expect(isSafePathPart("COLLECTIONS")).toBe(false);
    expect(isSafePathPart("collections-fixture-3_bad")).toBe(false);
  });
  it("isSafePathPart matrix collections/4", () => {
    expect(isSafePathPart("collections")).toBe(true);
    expect(isSafePathPart("collections-fixture-4")).toBe(true);
    expect(isSafePathPart("COLLECTIONS")).toBe(false);
    expect(isSafePathPart("collections-fixture-4_bad")).toBe(false);
  });
  it("isSafePathPart matrix collections/5", () => {
    expect(isSafePathPart("collections")).toBe(true);
    expect(isSafePathPart("collections-fixture-5")).toBe(true);
    expect(isSafePathPart("COLLECTIONS")).toBe(false);
    expect(isSafePathPart("collections-fixture-5_bad")).toBe(false);
  });
  it("isSafePathPart matrix collections/6", () => {
    expect(isSafePathPart("collections")).toBe(true);
    expect(isSafePathPart("collections-fixture-6")).toBe(true);
    expect(isSafePathPart("COLLECTIONS")).toBe(false);
    expect(isSafePathPart("collections-fixture-6_bad")).toBe(false);
  });
  it("isSafePathPart matrix collections/7", () => {
    expect(isSafePathPart("collections")).toBe(true);
    expect(isSafePathPart("collections-fixture-7")).toBe(true);
    expect(isSafePathPart("COLLECTIONS")).toBe(false);
    expect(isSafePathPart("collections-fixture-7_bad")).toBe(false);
  });
  it("isSafePathPart matrix statuslines/0", () => {
    expect(isSafePathPart("statuslines")).toBe(true);
    expect(isSafePathPart("statuslines-fixture-0")).toBe(true);
    expect(isSafePathPart("STATUSLINES")).toBe(false);
    expect(isSafePathPart("statuslines-fixture-0_bad")).toBe(false);
  });
  it("isSafePathPart matrix statuslines/1", () => {
    expect(isSafePathPart("statuslines")).toBe(true);
    expect(isSafePathPart("statuslines-fixture-1")).toBe(true);
    expect(isSafePathPart("STATUSLINES")).toBe(false);
    expect(isSafePathPart("statuslines-fixture-1_bad")).toBe(false);
  });
  it("isSafePathPart matrix statuslines/2", () => {
    expect(isSafePathPart("statuslines")).toBe(true);
    expect(isSafePathPart("statuslines-fixture-2")).toBe(true);
    expect(isSafePathPart("STATUSLINES")).toBe(false);
    expect(isSafePathPart("statuslines-fixture-2_bad")).toBe(false);
  });
  it("isSafePathPart matrix statuslines/3", () => {
    expect(isSafePathPart("statuslines")).toBe(true);
    expect(isSafePathPart("statuslines-fixture-3")).toBe(true);
    expect(isSafePathPart("STATUSLINES")).toBe(false);
    expect(isSafePathPart("statuslines-fixture-3_bad")).toBe(false);
  });
  it("isSafePathPart matrix statuslines/4", () => {
    expect(isSafePathPart("statuslines")).toBe(true);
    expect(isSafePathPart("statuslines-fixture-4")).toBe(true);
    expect(isSafePathPart("STATUSLINES")).toBe(false);
    expect(isSafePathPart("statuslines-fixture-4_bad")).toBe(false);
  });
  it("isSafePathPart matrix statuslines/5", () => {
    expect(isSafePathPart("statuslines")).toBe(true);
    expect(isSafePathPart("statuslines-fixture-5")).toBe(true);
    expect(isSafePathPart("STATUSLINES")).toBe(false);
    expect(isSafePathPart("statuslines-fixture-5_bad")).toBe(false);
  });
  it("isSafePathPart matrix statuslines/6", () => {
    expect(isSafePathPart("statuslines")).toBe(true);
    expect(isSafePathPart("statuslines-fixture-6")).toBe(true);
    expect(isSafePathPart("STATUSLINES")).toBe(false);
    expect(isSafePathPart("statuslines-fixture-6_bad")).toBe(false);
  });
  it("isSafePathPart matrix statuslines/7", () => {
    expect(isSafePathPart("statuslines")).toBe(true);
    expect(isSafePathPart("statuslines-fixture-7")).toBe(true);
    expect(isSafePathPart("STATUSLINES")).toBe(false);
    expect(isSafePathPart("statuslines-fixture-7_bad")).toBe(false);
  });
});

describe("registry-artifact-path-lib safeRelativePath", () => {
  it("joins safe segments with platform separator", () => {
    const joined = safeRelativePath("entries/mcp/browser-bridge.json");
    expect(joined).toBe(
      ["entries", "mcp", "browser-bridge.json"].join(path.sep),
    );
  });
  it("throws for empty path", () => {
    expect(() => safeRelativePath("")).toThrow(/Unsafe registry artifact path/);
  });

  it("safeRelativePath entries/agents/agents-entry-0.json", () => {
    expect(safeRelativePath("entries/agents/agents-entry-0.json")).toContain(
      "agents-entry-0.json",
    );
  });
  it("safeRelativePath search-index for agents variant 0", () => {
    expect(safeRelativePath("search-index.json")).toBe("search-index.json");
    expect(safeRelativePath("feeds/agents/index.json")).toContain("index.json");
  });
  it("safeRelativePath entries/agents/agents-entry-1.json", () => {
    expect(safeRelativePath("entries/agents/agents-entry-1.json")).toContain(
      "agents-entry-1.json",
    );
  });
  it("safeRelativePath search-index for agents variant 1", () => {
    expect(safeRelativePath("search-index.json")).toBe("search-index.json");
    expect(safeRelativePath("feeds/agents/index.json")).toContain("index.json");
  });
  it("safeRelativePath entries/agents/agents-entry-2.json", () => {
    expect(safeRelativePath("entries/agents/agents-entry-2.json")).toContain(
      "agents-entry-2.json",
    );
  });
  it("safeRelativePath search-index for agents variant 2", () => {
    expect(safeRelativePath("search-index.json")).toBe("search-index.json");
    expect(safeRelativePath("feeds/agents/index.json")).toContain("index.json");
  });
  it("safeRelativePath entries/agents/agents-entry-3.json", () => {
    expect(safeRelativePath("entries/agents/agents-entry-3.json")).toContain(
      "agents-entry-3.json",
    );
  });
  it("safeRelativePath search-index for agents variant 3", () => {
    expect(safeRelativePath("search-index.json")).toBe("search-index.json");
    expect(safeRelativePath("feeds/agents/index.json")).toContain("index.json");
  });
  it("safeRelativePath entries/agents/agents-entry-4.json", () => {
    expect(safeRelativePath("entries/agents/agents-entry-4.json")).toContain(
      "agents-entry-4.json",
    );
  });
  it("safeRelativePath search-index for agents variant 4", () => {
    expect(safeRelativePath("search-index.json")).toBe("search-index.json");
    expect(safeRelativePath("feeds/agents/index.json")).toContain("index.json");
  });
  it("safeRelativePath entries/agents/agents-entry-5.json", () => {
    expect(safeRelativePath("entries/agents/agents-entry-5.json")).toContain(
      "agents-entry-5.json",
    );
  });
  it("safeRelativePath search-index for agents variant 5", () => {
    expect(safeRelativePath("search-index.json")).toBe("search-index.json");
    expect(safeRelativePath("feeds/agents/index.json")).toContain("index.json");
  });
  it("safeRelativePath entries/agents/agents-entry-6.json", () => {
    expect(safeRelativePath("entries/agents/agents-entry-6.json")).toContain(
      "agents-entry-6.json",
    );
  });
  it("safeRelativePath search-index for agents variant 6", () => {
    expect(safeRelativePath("search-index.json")).toBe("search-index.json");
    expect(safeRelativePath("feeds/agents/index.json")).toContain("index.json");
  });
  it("safeRelativePath entries/agents/agents-entry-7.json", () => {
    expect(safeRelativePath("entries/agents/agents-entry-7.json")).toContain(
      "agents-entry-7.json",
    );
  });
  it("safeRelativePath search-index for agents variant 7", () => {
    expect(safeRelativePath("search-index.json")).toBe("search-index.json");
    expect(safeRelativePath("feeds/agents/index.json")).toContain("index.json");
  });
  it("safeRelativePath entries/agents/agents-entry-8.json", () => {
    expect(safeRelativePath("entries/agents/agents-entry-8.json")).toContain(
      "agents-entry-8.json",
    );
  });
  it("safeRelativePath search-index for agents variant 8", () => {
    expect(safeRelativePath("search-index.json")).toBe("search-index.json");
    expect(safeRelativePath("feeds/agents/index.json")).toContain("index.json");
  });
  it("safeRelativePath entries/agents/agents-entry-9.json", () => {
    expect(safeRelativePath("entries/agents/agents-entry-9.json")).toContain(
      "agents-entry-9.json",
    );
  });
  it("safeRelativePath search-index for agents variant 9", () => {
    expect(safeRelativePath("search-index.json")).toBe("search-index.json");
    expect(safeRelativePath("feeds/agents/index.json")).toContain("index.json");
  });
  it("safeRelativePath entries/mcp/mcp-entry-0.json", () => {
    expect(safeRelativePath("entries/mcp/mcp-entry-0.json")).toContain(
      "mcp-entry-0.json",
    );
  });
  it("safeRelativePath search-index for mcp variant 0", () => {
    expect(safeRelativePath("search-index.json")).toBe("search-index.json");
    expect(safeRelativePath("feeds/mcp/index.json")).toContain("index.json");
  });
  it("safeRelativePath entries/mcp/mcp-entry-1.json", () => {
    expect(safeRelativePath("entries/mcp/mcp-entry-1.json")).toContain(
      "mcp-entry-1.json",
    );
  });
  it("safeRelativePath search-index for mcp variant 1", () => {
    expect(safeRelativePath("search-index.json")).toBe("search-index.json");
    expect(safeRelativePath("feeds/mcp/index.json")).toContain("index.json");
  });
  it("safeRelativePath entries/mcp/mcp-entry-2.json", () => {
    expect(safeRelativePath("entries/mcp/mcp-entry-2.json")).toContain(
      "mcp-entry-2.json",
    );
  });
  it("safeRelativePath search-index for mcp variant 2", () => {
    expect(safeRelativePath("search-index.json")).toBe("search-index.json");
    expect(safeRelativePath("feeds/mcp/index.json")).toContain("index.json");
  });
  it("safeRelativePath entries/mcp/mcp-entry-3.json", () => {
    expect(safeRelativePath("entries/mcp/mcp-entry-3.json")).toContain(
      "mcp-entry-3.json",
    );
  });
  it("safeRelativePath search-index for mcp variant 3", () => {
    expect(safeRelativePath("search-index.json")).toBe("search-index.json");
    expect(safeRelativePath("feeds/mcp/index.json")).toContain("index.json");
  });
  it("safeRelativePath entries/mcp/mcp-entry-4.json", () => {
    expect(safeRelativePath("entries/mcp/mcp-entry-4.json")).toContain(
      "mcp-entry-4.json",
    );
  });
  it("safeRelativePath search-index for mcp variant 4", () => {
    expect(safeRelativePath("search-index.json")).toBe("search-index.json");
    expect(safeRelativePath("feeds/mcp/index.json")).toContain("index.json");
  });
  it("safeRelativePath entries/mcp/mcp-entry-5.json", () => {
    expect(safeRelativePath("entries/mcp/mcp-entry-5.json")).toContain(
      "mcp-entry-5.json",
    );
  });
  it("safeRelativePath search-index for mcp variant 5", () => {
    expect(safeRelativePath("search-index.json")).toBe("search-index.json");
    expect(safeRelativePath("feeds/mcp/index.json")).toContain("index.json");
  });
  it("safeRelativePath entries/mcp/mcp-entry-6.json", () => {
    expect(safeRelativePath("entries/mcp/mcp-entry-6.json")).toContain(
      "mcp-entry-6.json",
    );
  });
  it("safeRelativePath search-index for mcp variant 6", () => {
    expect(safeRelativePath("search-index.json")).toBe("search-index.json");
    expect(safeRelativePath("feeds/mcp/index.json")).toContain("index.json");
  });
  it("safeRelativePath entries/mcp/mcp-entry-7.json", () => {
    expect(safeRelativePath("entries/mcp/mcp-entry-7.json")).toContain(
      "mcp-entry-7.json",
    );
  });
  it("safeRelativePath search-index for mcp variant 7", () => {
    expect(safeRelativePath("search-index.json")).toBe("search-index.json");
    expect(safeRelativePath("feeds/mcp/index.json")).toContain("index.json");
  });
  it("safeRelativePath entries/mcp/mcp-entry-8.json", () => {
    expect(safeRelativePath("entries/mcp/mcp-entry-8.json")).toContain(
      "mcp-entry-8.json",
    );
  });
  it("safeRelativePath search-index for mcp variant 8", () => {
    expect(safeRelativePath("search-index.json")).toBe("search-index.json");
    expect(safeRelativePath("feeds/mcp/index.json")).toContain("index.json");
  });
  it("safeRelativePath entries/mcp/mcp-entry-9.json", () => {
    expect(safeRelativePath("entries/mcp/mcp-entry-9.json")).toContain(
      "mcp-entry-9.json",
    );
  });
  it("safeRelativePath search-index for mcp variant 9", () => {
    expect(safeRelativePath("search-index.json")).toBe("search-index.json");
    expect(safeRelativePath("feeds/mcp/index.json")).toContain("index.json");
  });
  it("safeRelativePath entries/tools/tools-entry-0.json", () => {
    expect(safeRelativePath("entries/tools/tools-entry-0.json")).toContain(
      "tools-entry-0.json",
    );
  });
  it("safeRelativePath search-index for tools variant 0", () => {
    expect(safeRelativePath("search-index.json")).toBe("search-index.json");
    expect(safeRelativePath("feeds/tools/index.json")).toContain("index.json");
  });
  it("safeRelativePath entries/tools/tools-entry-1.json", () => {
    expect(safeRelativePath("entries/tools/tools-entry-1.json")).toContain(
      "tools-entry-1.json",
    );
  });
  it("safeRelativePath search-index for tools variant 1", () => {
    expect(safeRelativePath("search-index.json")).toBe("search-index.json");
    expect(safeRelativePath("feeds/tools/index.json")).toContain("index.json");
  });
  it("safeRelativePath entries/tools/tools-entry-2.json", () => {
    expect(safeRelativePath("entries/tools/tools-entry-2.json")).toContain(
      "tools-entry-2.json",
    );
  });
  it("safeRelativePath search-index for tools variant 2", () => {
    expect(safeRelativePath("search-index.json")).toBe("search-index.json");
    expect(safeRelativePath("feeds/tools/index.json")).toContain("index.json");
  });
  it("safeRelativePath entries/tools/tools-entry-3.json", () => {
    expect(safeRelativePath("entries/tools/tools-entry-3.json")).toContain(
      "tools-entry-3.json",
    );
  });
  it("safeRelativePath search-index for tools variant 3", () => {
    expect(safeRelativePath("search-index.json")).toBe("search-index.json");
    expect(safeRelativePath("feeds/tools/index.json")).toContain("index.json");
  });
  it("safeRelativePath entries/tools/tools-entry-4.json", () => {
    expect(safeRelativePath("entries/tools/tools-entry-4.json")).toContain(
      "tools-entry-4.json",
    );
  });
  it("safeRelativePath search-index for tools variant 4", () => {
    expect(safeRelativePath("search-index.json")).toBe("search-index.json");
    expect(safeRelativePath("feeds/tools/index.json")).toContain("index.json");
  });
  it("safeRelativePath entries/tools/tools-entry-5.json", () => {
    expect(safeRelativePath("entries/tools/tools-entry-5.json")).toContain(
      "tools-entry-5.json",
    );
  });
  it("safeRelativePath search-index for tools variant 5", () => {
    expect(safeRelativePath("search-index.json")).toBe("search-index.json");
    expect(safeRelativePath("feeds/tools/index.json")).toContain("index.json");
  });
  it("safeRelativePath entries/tools/tools-entry-6.json", () => {
    expect(safeRelativePath("entries/tools/tools-entry-6.json")).toContain(
      "tools-entry-6.json",
    );
  });
  it("safeRelativePath search-index for tools variant 6", () => {
    expect(safeRelativePath("search-index.json")).toBe("search-index.json");
    expect(safeRelativePath("feeds/tools/index.json")).toContain("index.json");
  });
  it("safeRelativePath entries/tools/tools-entry-7.json", () => {
    expect(safeRelativePath("entries/tools/tools-entry-7.json")).toContain(
      "tools-entry-7.json",
    );
  });
  it("safeRelativePath search-index for tools variant 7", () => {
    expect(safeRelativePath("search-index.json")).toBe("search-index.json");
    expect(safeRelativePath("feeds/tools/index.json")).toContain("index.json");
  });
  it("safeRelativePath entries/tools/tools-entry-8.json", () => {
    expect(safeRelativePath("entries/tools/tools-entry-8.json")).toContain(
      "tools-entry-8.json",
    );
  });
  it("safeRelativePath search-index for tools variant 8", () => {
    expect(safeRelativePath("search-index.json")).toBe("search-index.json");
    expect(safeRelativePath("feeds/tools/index.json")).toContain("index.json");
  });
  it("safeRelativePath entries/tools/tools-entry-9.json", () => {
    expect(safeRelativePath("entries/tools/tools-entry-9.json")).toContain(
      "tools-entry-9.json",
    );
  });
  it("safeRelativePath search-index for tools variant 9", () => {
    expect(safeRelativePath("search-index.json")).toBe("search-index.json");
    expect(safeRelativePath("feeds/tools/index.json")).toContain("index.json");
  });
  it("safeRelativePath entries/skills/skills-entry-0.json", () => {
    expect(safeRelativePath("entries/skills/skills-entry-0.json")).toContain(
      "skills-entry-0.json",
    );
  });
  it("safeRelativePath search-index for skills variant 0", () => {
    expect(safeRelativePath("search-index.json")).toBe("search-index.json");
    expect(safeRelativePath("feeds/skills/index.json")).toContain("index.json");
  });
  it("safeRelativePath entries/skills/skills-entry-1.json", () => {
    expect(safeRelativePath("entries/skills/skills-entry-1.json")).toContain(
      "skills-entry-1.json",
    );
  });
  it("safeRelativePath search-index for skills variant 1", () => {
    expect(safeRelativePath("search-index.json")).toBe("search-index.json");
    expect(safeRelativePath("feeds/skills/index.json")).toContain("index.json");
  });
  it("safeRelativePath entries/skills/skills-entry-2.json", () => {
    expect(safeRelativePath("entries/skills/skills-entry-2.json")).toContain(
      "skills-entry-2.json",
    );
  });
  it("safeRelativePath search-index for skills variant 2", () => {
    expect(safeRelativePath("search-index.json")).toBe("search-index.json");
    expect(safeRelativePath("feeds/skills/index.json")).toContain("index.json");
  });
  it("safeRelativePath entries/skills/skills-entry-3.json", () => {
    expect(safeRelativePath("entries/skills/skills-entry-3.json")).toContain(
      "skills-entry-3.json",
    );
  });
  it("safeRelativePath search-index for skills variant 3", () => {
    expect(safeRelativePath("search-index.json")).toBe("search-index.json");
    expect(safeRelativePath("feeds/skills/index.json")).toContain("index.json");
  });
  it("safeRelativePath entries/skills/skills-entry-4.json", () => {
    expect(safeRelativePath("entries/skills/skills-entry-4.json")).toContain(
      "skills-entry-4.json",
    );
  });
  it("safeRelativePath search-index for skills variant 4", () => {
    expect(safeRelativePath("search-index.json")).toBe("search-index.json");
    expect(safeRelativePath("feeds/skills/index.json")).toContain("index.json");
  });
  it("safeRelativePath entries/skills/skills-entry-5.json", () => {
    expect(safeRelativePath("entries/skills/skills-entry-5.json")).toContain(
      "skills-entry-5.json",
    );
  });
  it("safeRelativePath search-index for skills variant 5", () => {
    expect(safeRelativePath("search-index.json")).toBe("search-index.json");
    expect(safeRelativePath("feeds/skills/index.json")).toContain("index.json");
  });
  it("safeRelativePath entries/skills/skills-entry-6.json", () => {
    expect(safeRelativePath("entries/skills/skills-entry-6.json")).toContain(
      "skills-entry-6.json",
    );
  });
  it("safeRelativePath search-index for skills variant 6", () => {
    expect(safeRelativePath("search-index.json")).toBe("search-index.json");
    expect(safeRelativePath("feeds/skills/index.json")).toContain("index.json");
  });
  it("safeRelativePath entries/skills/skills-entry-7.json", () => {
    expect(safeRelativePath("entries/skills/skills-entry-7.json")).toContain(
      "skills-entry-7.json",
    );
  });
  it("safeRelativePath search-index for skills variant 7", () => {
    expect(safeRelativePath("search-index.json")).toBe("search-index.json");
    expect(safeRelativePath("feeds/skills/index.json")).toContain("index.json");
  });
  it("safeRelativePath entries/skills/skills-entry-8.json", () => {
    expect(safeRelativePath("entries/skills/skills-entry-8.json")).toContain(
      "skills-entry-8.json",
    );
  });
  it("safeRelativePath search-index for skills variant 8", () => {
    expect(safeRelativePath("search-index.json")).toBe("search-index.json");
    expect(safeRelativePath("feeds/skills/index.json")).toContain("index.json");
  });
  it("safeRelativePath entries/skills/skills-entry-9.json", () => {
    expect(safeRelativePath("entries/skills/skills-entry-9.json")).toContain(
      "skills-entry-9.json",
    );
  });
  it("safeRelativePath search-index for skills variant 9", () => {
    expect(safeRelativePath("search-index.json")).toBe("search-index.json");
    expect(safeRelativePath("feeds/skills/index.json")).toContain("index.json");
  });
  it("safeRelativePath entries/rules/rules-entry-0.json", () => {
    expect(safeRelativePath("entries/rules/rules-entry-0.json")).toContain(
      "rules-entry-0.json",
    );
  });
  it("safeRelativePath search-index for rules variant 0", () => {
    expect(safeRelativePath("search-index.json")).toBe("search-index.json");
    expect(safeRelativePath("feeds/rules/index.json")).toContain("index.json");
  });
  it("safeRelativePath entries/rules/rules-entry-1.json", () => {
    expect(safeRelativePath("entries/rules/rules-entry-1.json")).toContain(
      "rules-entry-1.json",
    );
  });
  it("safeRelativePath search-index for rules variant 1", () => {
    expect(safeRelativePath("search-index.json")).toBe("search-index.json");
    expect(safeRelativePath("feeds/rules/index.json")).toContain("index.json");
  });
  it("safeRelativePath entries/rules/rules-entry-2.json", () => {
    expect(safeRelativePath("entries/rules/rules-entry-2.json")).toContain(
      "rules-entry-2.json",
    );
  });
  it("safeRelativePath search-index for rules variant 2", () => {
    expect(safeRelativePath("search-index.json")).toBe("search-index.json");
    expect(safeRelativePath("feeds/rules/index.json")).toContain("index.json");
  });
  it("safeRelativePath entries/rules/rules-entry-3.json", () => {
    expect(safeRelativePath("entries/rules/rules-entry-3.json")).toContain(
      "rules-entry-3.json",
    );
  });
  it("safeRelativePath search-index for rules variant 3", () => {
    expect(safeRelativePath("search-index.json")).toBe("search-index.json");
    expect(safeRelativePath("feeds/rules/index.json")).toContain("index.json");
  });
  it("safeRelativePath entries/rules/rules-entry-4.json", () => {
    expect(safeRelativePath("entries/rules/rules-entry-4.json")).toContain(
      "rules-entry-4.json",
    );
  });
  it("safeRelativePath search-index for rules variant 4", () => {
    expect(safeRelativePath("search-index.json")).toBe("search-index.json");
    expect(safeRelativePath("feeds/rules/index.json")).toContain("index.json");
  });
  it("safeRelativePath entries/rules/rules-entry-5.json", () => {
    expect(safeRelativePath("entries/rules/rules-entry-5.json")).toContain(
      "rules-entry-5.json",
    );
  });
  it("safeRelativePath search-index for rules variant 5", () => {
    expect(safeRelativePath("search-index.json")).toBe("search-index.json");
    expect(safeRelativePath("feeds/rules/index.json")).toContain("index.json");
  });
  it("safeRelativePath entries/rules/rules-entry-6.json", () => {
    expect(safeRelativePath("entries/rules/rules-entry-6.json")).toContain(
      "rules-entry-6.json",
    );
  });
  it("safeRelativePath search-index for rules variant 6", () => {
    expect(safeRelativePath("search-index.json")).toBe("search-index.json");
    expect(safeRelativePath("feeds/rules/index.json")).toContain("index.json");
  });
  it("safeRelativePath entries/rules/rules-entry-7.json", () => {
    expect(safeRelativePath("entries/rules/rules-entry-7.json")).toContain(
      "rules-entry-7.json",
    );
  });
  it("safeRelativePath search-index for rules variant 7", () => {
    expect(safeRelativePath("search-index.json")).toBe("search-index.json");
    expect(safeRelativePath("feeds/rules/index.json")).toContain("index.json");
  });
  it("safeRelativePath entries/rules/rules-entry-8.json", () => {
    expect(safeRelativePath("entries/rules/rules-entry-8.json")).toContain(
      "rules-entry-8.json",
    );
  });
  it("safeRelativePath search-index for rules variant 8", () => {
    expect(safeRelativePath("search-index.json")).toBe("search-index.json");
    expect(safeRelativePath("feeds/rules/index.json")).toContain("index.json");
  });
  it("safeRelativePath entries/rules/rules-entry-9.json", () => {
    expect(safeRelativePath("entries/rules/rules-entry-9.json")).toContain(
      "rules-entry-9.json",
    );
  });
  it("safeRelativePath search-index for rules variant 9", () => {
    expect(safeRelativePath("search-index.json")).toBe("search-index.json");
    expect(safeRelativePath("feeds/rules/index.json")).toContain("index.json");
  });
  it("safeRelativePath entries/commands/commands-entry-0.json", () => {
    expect(
      safeRelativePath("entries/commands/commands-entry-0.json"),
    ).toContain("commands-entry-0.json");
  });
  it("safeRelativePath search-index for commands variant 0", () => {
    expect(safeRelativePath("search-index.json")).toBe("search-index.json");
    expect(safeRelativePath("feeds/commands/index.json")).toContain(
      "index.json",
    );
  });
  it("safeRelativePath entries/commands/commands-entry-1.json", () => {
    expect(
      safeRelativePath("entries/commands/commands-entry-1.json"),
    ).toContain("commands-entry-1.json");
  });
  it("safeRelativePath search-index for commands variant 1", () => {
    expect(safeRelativePath("search-index.json")).toBe("search-index.json");
    expect(safeRelativePath("feeds/commands/index.json")).toContain(
      "index.json",
    );
  });
  it("safeRelativePath entries/commands/commands-entry-2.json", () => {
    expect(
      safeRelativePath("entries/commands/commands-entry-2.json"),
    ).toContain("commands-entry-2.json");
  });
  it("safeRelativePath search-index for commands variant 2", () => {
    expect(safeRelativePath("search-index.json")).toBe("search-index.json");
    expect(safeRelativePath("feeds/commands/index.json")).toContain(
      "index.json",
    );
  });
  it("safeRelativePath entries/commands/commands-entry-3.json", () => {
    expect(
      safeRelativePath("entries/commands/commands-entry-3.json"),
    ).toContain("commands-entry-3.json");
  });
  it("safeRelativePath search-index for commands variant 3", () => {
    expect(safeRelativePath("search-index.json")).toBe("search-index.json");
    expect(safeRelativePath("feeds/commands/index.json")).toContain(
      "index.json",
    );
  });
  it("safeRelativePath entries/commands/commands-entry-4.json", () => {
    expect(
      safeRelativePath("entries/commands/commands-entry-4.json"),
    ).toContain("commands-entry-4.json");
  });
  it("safeRelativePath search-index for commands variant 4", () => {
    expect(safeRelativePath("search-index.json")).toBe("search-index.json");
    expect(safeRelativePath("feeds/commands/index.json")).toContain(
      "index.json",
    );
  });
  it("safeRelativePath entries/commands/commands-entry-5.json", () => {
    expect(
      safeRelativePath("entries/commands/commands-entry-5.json"),
    ).toContain("commands-entry-5.json");
  });
  it("safeRelativePath search-index for commands variant 5", () => {
    expect(safeRelativePath("search-index.json")).toBe("search-index.json");
    expect(safeRelativePath("feeds/commands/index.json")).toContain(
      "index.json",
    );
  });
  it("safeRelativePath entries/commands/commands-entry-6.json", () => {
    expect(
      safeRelativePath("entries/commands/commands-entry-6.json"),
    ).toContain("commands-entry-6.json");
  });
  it("safeRelativePath search-index for commands variant 6", () => {
    expect(safeRelativePath("search-index.json")).toBe("search-index.json");
    expect(safeRelativePath("feeds/commands/index.json")).toContain(
      "index.json",
    );
  });
  it("safeRelativePath entries/commands/commands-entry-7.json", () => {
    expect(
      safeRelativePath("entries/commands/commands-entry-7.json"),
    ).toContain("commands-entry-7.json");
  });
  it("safeRelativePath search-index for commands variant 7", () => {
    expect(safeRelativePath("search-index.json")).toBe("search-index.json");
    expect(safeRelativePath("feeds/commands/index.json")).toContain(
      "index.json",
    );
  });
  it("safeRelativePath entries/commands/commands-entry-8.json", () => {
    expect(
      safeRelativePath("entries/commands/commands-entry-8.json"),
    ).toContain("commands-entry-8.json");
  });
  it("safeRelativePath search-index for commands variant 8", () => {
    expect(safeRelativePath("search-index.json")).toBe("search-index.json");
    expect(safeRelativePath("feeds/commands/index.json")).toContain(
      "index.json",
    );
  });
  it("safeRelativePath entries/commands/commands-entry-9.json", () => {
    expect(
      safeRelativePath("entries/commands/commands-entry-9.json"),
    ).toContain("commands-entry-9.json");
  });
  it("safeRelativePath search-index for commands variant 9", () => {
    expect(safeRelativePath("search-index.json")).toBe("search-index.json");
    expect(safeRelativePath("feeds/commands/index.json")).toContain(
      "index.json",
    );
  });
  it("safeRelativePath entries/hooks/hooks-entry-0.json", () => {
    expect(safeRelativePath("entries/hooks/hooks-entry-0.json")).toContain(
      "hooks-entry-0.json",
    );
  });
  it("safeRelativePath search-index for hooks variant 0", () => {
    expect(safeRelativePath("search-index.json")).toBe("search-index.json");
    expect(safeRelativePath("feeds/hooks/index.json")).toContain("index.json");
  });
  it("safeRelativePath entries/hooks/hooks-entry-1.json", () => {
    expect(safeRelativePath("entries/hooks/hooks-entry-1.json")).toContain(
      "hooks-entry-1.json",
    );
  });
  it("safeRelativePath search-index for hooks variant 1", () => {
    expect(safeRelativePath("search-index.json")).toBe("search-index.json");
    expect(safeRelativePath("feeds/hooks/index.json")).toContain("index.json");
  });
  it("safeRelativePath entries/hooks/hooks-entry-2.json", () => {
    expect(safeRelativePath("entries/hooks/hooks-entry-2.json")).toContain(
      "hooks-entry-2.json",
    );
  });
  it("safeRelativePath search-index for hooks variant 2", () => {
    expect(safeRelativePath("search-index.json")).toBe("search-index.json");
    expect(safeRelativePath("feeds/hooks/index.json")).toContain("index.json");
  });
  it("safeRelativePath entries/hooks/hooks-entry-3.json", () => {
    expect(safeRelativePath("entries/hooks/hooks-entry-3.json")).toContain(
      "hooks-entry-3.json",
    );
  });
  it("safeRelativePath search-index for hooks variant 3", () => {
    expect(safeRelativePath("search-index.json")).toBe("search-index.json");
    expect(safeRelativePath("feeds/hooks/index.json")).toContain("index.json");
  });
  it("safeRelativePath entries/hooks/hooks-entry-4.json", () => {
    expect(safeRelativePath("entries/hooks/hooks-entry-4.json")).toContain(
      "hooks-entry-4.json",
    );
  });
  it("safeRelativePath search-index for hooks variant 4", () => {
    expect(safeRelativePath("search-index.json")).toBe("search-index.json");
    expect(safeRelativePath("feeds/hooks/index.json")).toContain("index.json");
  });
  it("safeRelativePath entries/hooks/hooks-entry-5.json", () => {
    expect(safeRelativePath("entries/hooks/hooks-entry-5.json")).toContain(
      "hooks-entry-5.json",
    );
  });
  it("safeRelativePath search-index for hooks variant 5", () => {
    expect(safeRelativePath("search-index.json")).toBe("search-index.json");
    expect(safeRelativePath("feeds/hooks/index.json")).toContain("index.json");
  });
  it("safeRelativePath entries/hooks/hooks-entry-6.json", () => {
    expect(safeRelativePath("entries/hooks/hooks-entry-6.json")).toContain(
      "hooks-entry-6.json",
    );
  });
  it("safeRelativePath search-index for hooks variant 6", () => {
    expect(safeRelativePath("search-index.json")).toBe("search-index.json");
    expect(safeRelativePath("feeds/hooks/index.json")).toContain("index.json");
  });
  it("safeRelativePath entries/hooks/hooks-entry-7.json", () => {
    expect(safeRelativePath("entries/hooks/hooks-entry-7.json")).toContain(
      "hooks-entry-7.json",
    );
  });
  it("safeRelativePath search-index for hooks variant 7", () => {
    expect(safeRelativePath("search-index.json")).toBe("search-index.json");
    expect(safeRelativePath("feeds/hooks/index.json")).toContain("index.json");
  });
  it("safeRelativePath entries/hooks/hooks-entry-8.json", () => {
    expect(safeRelativePath("entries/hooks/hooks-entry-8.json")).toContain(
      "hooks-entry-8.json",
    );
  });
  it("safeRelativePath search-index for hooks variant 8", () => {
    expect(safeRelativePath("search-index.json")).toBe("search-index.json");
    expect(safeRelativePath("feeds/hooks/index.json")).toContain("index.json");
  });
  it("safeRelativePath entries/hooks/hooks-entry-9.json", () => {
    expect(safeRelativePath("entries/hooks/hooks-entry-9.json")).toContain(
      "hooks-entry-9.json",
    );
  });
  it("safeRelativePath search-index for hooks variant 9", () => {
    expect(safeRelativePath("search-index.json")).toBe("search-index.json");
    expect(safeRelativePath("feeds/hooks/index.json")).toContain("index.json");
  });
  it("safeRelativePath entries/guides/guides-entry-0.json", () => {
    expect(safeRelativePath("entries/guides/guides-entry-0.json")).toContain(
      "guides-entry-0.json",
    );
  });
  it("safeRelativePath search-index for guides variant 0", () => {
    expect(safeRelativePath("search-index.json")).toBe("search-index.json");
    expect(safeRelativePath("feeds/guides/index.json")).toContain("index.json");
  });
  it("safeRelativePath entries/guides/guides-entry-1.json", () => {
    expect(safeRelativePath("entries/guides/guides-entry-1.json")).toContain(
      "guides-entry-1.json",
    );
  });
  it("safeRelativePath search-index for guides variant 1", () => {
    expect(safeRelativePath("search-index.json")).toBe("search-index.json");
    expect(safeRelativePath("feeds/guides/index.json")).toContain("index.json");
  });
  it("safeRelativePath entries/guides/guides-entry-2.json", () => {
    expect(safeRelativePath("entries/guides/guides-entry-2.json")).toContain(
      "guides-entry-2.json",
    );
  });
  it("safeRelativePath search-index for guides variant 2", () => {
    expect(safeRelativePath("search-index.json")).toBe("search-index.json");
    expect(safeRelativePath("feeds/guides/index.json")).toContain("index.json");
  });
  it("safeRelativePath entries/guides/guides-entry-3.json", () => {
    expect(safeRelativePath("entries/guides/guides-entry-3.json")).toContain(
      "guides-entry-3.json",
    );
  });
  it("safeRelativePath search-index for guides variant 3", () => {
    expect(safeRelativePath("search-index.json")).toBe("search-index.json");
    expect(safeRelativePath("feeds/guides/index.json")).toContain("index.json");
  });
  it("safeRelativePath entries/guides/guides-entry-4.json", () => {
    expect(safeRelativePath("entries/guides/guides-entry-4.json")).toContain(
      "guides-entry-4.json",
    );
  });
  it("safeRelativePath search-index for guides variant 4", () => {
    expect(safeRelativePath("search-index.json")).toBe("search-index.json");
    expect(safeRelativePath("feeds/guides/index.json")).toContain("index.json");
  });
  it("safeRelativePath entries/guides/guides-entry-5.json", () => {
    expect(safeRelativePath("entries/guides/guides-entry-5.json")).toContain(
      "guides-entry-5.json",
    );
  });
  it("safeRelativePath search-index for guides variant 5", () => {
    expect(safeRelativePath("search-index.json")).toBe("search-index.json");
    expect(safeRelativePath("feeds/guides/index.json")).toContain("index.json");
  });
  it("safeRelativePath entries/guides/guides-entry-6.json", () => {
    expect(safeRelativePath("entries/guides/guides-entry-6.json")).toContain(
      "guides-entry-6.json",
    );
  });
  it("safeRelativePath search-index for guides variant 6", () => {
    expect(safeRelativePath("search-index.json")).toBe("search-index.json");
    expect(safeRelativePath("feeds/guides/index.json")).toContain("index.json");
  });
  it("safeRelativePath entries/guides/guides-entry-7.json", () => {
    expect(safeRelativePath("entries/guides/guides-entry-7.json")).toContain(
      "guides-entry-7.json",
    );
  });
  it("safeRelativePath search-index for guides variant 7", () => {
    expect(safeRelativePath("search-index.json")).toBe("search-index.json");
    expect(safeRelativePath("feeds/guides/index.json")).toContain("index.json");
  });
  it("safeRelativePath entries/guides/guides-entry-8.json", () => {
    expect(safeRelativePath("entries/guides/guides-entry-8.json")).toContain(
      "guides-entry-8.json",
    );
  });
  it("safeRelativePath search-index for guides variant 8", () => {
    expect(safeRelativePath("search-index.json")).toBe("search-index.json");
    expect(safeRelativePath("feeds/guides/index.json")).toContain("index.json");
  });
  it("safeRelativePath entries/guides/guides-entry-9.json", () => {
    expect(safeRelativePath("entries/guides/guides-entry-9.json")).toContain(
      "guides-entry-9.json",
    );
  });
  it("safeRelativePath search-index for guides variant 9", () => {
    expect(safeRelativePath("search-index.json")).toBe("search-index.json");
    expect(safeRelativePath("feeds/guides/index.json")).toContain("index.json");
  });
  it("safeRelativePath entries/collections/collections-entry-0.json", () => {
    expect(
      safeRelativePath("entries/collections/collections-entry-0.json"),
    ).toContain("collections-entry-0.json");
  });
  it("safeRelativePath search-index for collections variant 0", () => {
    expect(safeRelativePath("search-index.json")).toBe("search-index.json");
    expect(safeRelativePath("feeds/collections/index.json")).toContain(
      "index.json",
    );
  });
  it("safeRelativePath entries/collections/collections-entry-1.json", () => {
    expect(
      safeRelativePath("entries/collections/collections-entry-1.json"),
    ).toContain("collections-entry-1.json");
  });
  it("safeRelativePath search-index for collections variant 1", () => {
    expect(safeRelativePath("search-index.json")).toBe("search-index.json");
    expect(safeRelativePath("feeds/collections/index.json")).toContain(
      "index.json",
    );
  });
  it("safeRelativePath entries/collections/collections-entry-2.json", () => {
    expect(
      safeRelativePath("entries/collections/collections-entry-2.json"),
    ).toContain("collections-entry-2.json");
  });
  it("safeRelativePath search-index for collections variant 2", () => {
    expect(safeRelativePath("search-index.json")).toBe("search-index.json");
    expect(safeRelativePath("feeds/collections/index.json")).toContain(
      "index.json",
    );
  });
  it("safeRelativePath entries/collections/collections-entry-3.json", () => {
    expect(
      safeRelativePath("entries/collections/collections-entry-3.json"),
    ).toContain("collections-entry-3.json");
  });
  it("safeRelativePath search-index for collections variant 3", () => {
    expect(safeRelativePath("search-index.json")).toBe("search-index.json");
    expect(safeRelativePath("feeds/collections/index.json")).toContain(
      "index.json",
    );
  });
  it("safeRelativePath entries/collections/collections-entry-4.json", () => {
    expect(
      safeRelativePath("entries/collections/collections-entry-4.json"),
    ).toContain("collections-entry-4.json");
  });
  it("safeRelativePath search-index for collections variant 4", () => {
    expect(safeRelativePath("search-index.json")).toBe("search-index.json");
    expect(safeRelativePath("feeds/collections/index.json")).toContain(
      "index.json",
    );
  });
  it("safeRelativePath entries/collections/collections-entry-5.json", () => {
    expect(
      safeRelativePath("entries/collections/collections-entry-5.json"),
    ).toContain("collections-entry-5.json");
  });
  it("safeRelativePath search-index for collections variant 5", () => {
    expect(safeRelativePath("search-index.json")).toBe("search-index.json");
    expect(safeRelativePath("feeds/collections/index.json")).toContain(
      "index.json",
    );
  });
  it("safeRelativePath entries/collections/collections-entry-6.json", () => {
    expect(
      safeRelativePath("entries/collections/collections-entry-6.json"),
    ).toContain("collections-entry-6.json");
  });
  it("safeRelativePath search-index for collections variant 6", () => {
    expect(safeRelativePath("search-index.json")).toBe("search-index.json");
    expect(safeRelativePath("feeds/collections/index.json")).toContain(
      "index.json",
    );
  });
  it("safeRelativePath entries/collections/collections-entry-7.json", () => {
    expect(
      safeRelativePath("entries/collections/collections-entry-7.json"),
    ).toContain("collections-entry-7.json");
  });
  it("safeRelativePath search-index for collections variant 7", () => {
    expect(safeRelativePath("search-index.json")).toBe("search-index.json");
    expect(safeRelativePath("feeds/collections/index.json")).toContain(
      "index.json",
    );
  });
  it("safeRelativePath entries/collections/collections-entry-8.json", () => {
    expect(
      safeRelativePath("entries/collections/collections-entry-8.json"),
    ).toContain("collections-entry-8.json");
  });
  it("safeRelativePath search-index for collections variant 8", () => {
    expect(safeRelativePath("search-index.json")).toBe("search-index.json");
    expect(safeRelativePath("feeds/collections/index.json")).toContain(
      "index.json",
    );
  });
  it("safeRelativePath entries/collections/collections-entry-9.json", () => {
    expect(
      safeRelativePath("entries/collections/collections-entry-9.json"),
    ).toContain("collections-entry-9.json");
  });
  it("safeRelativePath search-index for collections variant 9", () => {
    expect(safeRelativePath("search-index.json")).toBe("search-index.json");
    expect(safeRelativePath("feeds/collections/index.json")).toContain(
      "index.json",
    );
  });
  it("safeRelativePath entries/statuslines/statuslines-entry-0.json", () => {
    expect(
      safeRelativePath("entries/statuslines/statuslines-entry-0.json"),
    ).toContain("statuslines-entry-0.json");
  });
  it("safeRelativePath search-index for statuslines variant 0", () => {
    expect(safeRelativePath("search-index.json")).toBe("search-index.json");
    expect(safeRelativePath("feeds/statuslines/index.json")).toContain(
      "index.json",
    );
  });
  it("safeRelativePath entries/statuslines/statuslines-entry-1.json", () => {
    expect(
      safeRelativePath("entries/statuslines/statuslines-entry-1.json"),
    ).toContain("statuslines-entry-1.json");
  });
  it("safeRelativePath search-index for statuslines variant 1", () => {
    expect(safeRelativePath("search-index.json")).toBe("search-index.json");
    expect(safeRelativePath("feeds/statuslines/index.json")).toContain(
      "index.json",
    );
  });
  it("safeRelativePath entries/statuslines/statuslines-entry-2.json", () => {
    expect(
      safeRelativePath("entries/statuslines/statuslines-entry-2.json"),
    ).toContain("statuslines-entry-2.json");
  });
  it("safeRelativePath search-index for statuslines variant 2", () => {
    expect(safeRelativePath("search-index.json")).toBe("search-index.json");
    expect(safeRelativePath("feeds/statuslines/index.json")).toContain(
      "index.json",
    );
  });
  it("safeRelativePath entries/statuslines/statuslines-entry-3.json", () => {
    expect(
      safeRelativePath("entries/statuslines/statuslines-entry-3.json"),
    ).toContain("statuslines-entry-3.json");
  });
  it("safeRelativePath search-index for statuslines variant 3", () => {
    expect(safeRelativePath("search-index.json")).toBe("search-index.json");
    expect(safeRelativePath("feeds/statuslines/index.json")).toContain(
      "index.json",
    );
  });
  it("safeRelativePath entries/statuslines/statuslines-entry-4.json", () => {
    expect(
      safeRelativePath("entries/statuslines/statuslines-entry-4.json"),
    ).toContain("statuslines-entry-4.json");
  });
  it("safeRelativePath search-index for statuslines variant 4", () => {
    expect(safeRelativePath("search-index.json")).toBe("search-index.json");
    expect(safeRelativePath("feeds/statuslines/index.json")).toContain(
      "index.json",
    );
  });
  it("safeRelativePath entries/statuslines/statuslines-entry-5.json", () => {
    expect(
      safeRelativePath("entries/statuslines/statuslines-entry-5.json"),
    ).toContain("statuslines-entry-5.json");
  });
  it("safeRelativePath search-index for statuslines variant 5", () => {
    expect(safeRelativePath("search-index.json")).toBe("search-index.json");
    expect(safeRelativePath("feeds/statuslines/index.json")).toContain(
      "index.json",
    );
  });
  it("safeRelativePath entries/statuslines/statuslines-entry-6.json", () => {
    expect(
      safeRelativePath("entries/statuslines/statuslines-entry-6.json"),
    ).toContain("statuslines-entry-6.json");
  });
  it("safeRelativePath search-index for statuslines variant 6", () => {
    expect(safeRelativePath("search-index.json")).toBe("search-index.json");
    expect(safeRelativePath("feeds/statuslines/index.json")).toContain(
      "index.json",
    );
  });
  it("safeRelativePath entries/statuslines/statuslines-entry-7.json", () => {
    expect(
      safeRelativePath("entries/statuslines/statuslines-entry-7.json"),
    ).toContain("statuslines-entry-7.json");
  });
  it("safeRelativePath search-index for statuslines variant 7", () => {
    expect(safeRelativePath("search-index.json")).toBe("search-index.json");
    expect(safeRelativePath("feeds/statuslines/index.json")).toContain(
      "index.json",
    );
  });
  it("safeRelativePath entries/statuslines/statuslines-entry-8.json", () => {
    expect(
      safeRelativePath("entries/statuslines/statuslines-entry-8.json"),
    ).toContain("statuslines-entry-8.json");
  });
  it("safeRelativePath search-index for statuslines variant 8", () => {
    expect(safeRelativePath("search-index.json")).toBe("search-index.json");
    expect(safeRelativePath("feeds/statuslines/index.json")).toContain(
      "index.json",
    );
  });
  it("safeRelativePath entries/statuslines/statuslines-entry-9.json", () => {
    expect(
      safeRelativePath("entries/statuslines/statuslines-entry-9.json"),
    ).toContain("statuslines-entry-9.json");
  });
  it("safeRelativePath search-index for statuslines variant 9", () => {
    expect(safeRelativePath("search-index.json")).toBe("search-index.json");
    expect(safeRelativePath("feeds/statuslines/index.json")).toContain(
      "index.json",
    );
  });
  it("safeRelativePath rejects empty", () => {
    expect(() => safeRelativePath("")).toThrow(/Unsafe registry artifact path/);
  });
  it("safeRelativePath rejects .", () => {
    expect(() => safeRelativePath(".")).toThrow(
      /Unsafe registry artifact path/,
    );
  });
  it("safeRelativePath rejects ..", () => {
    expect(() => safeRelativePath("..")).toThrow(
      /Unsafe registry artifact path/,
    );
  });
  it("safeRelativePath rejects foo/../bar", () => {
    expect(() => safeRelativePath("foo/../bar")).toThrow(
      /Unsafe registry artifact path/,
    );
  });
  it("safeRelativePath rejects ../secret", () => {
    expect(() => safeRelativePath("../secret")).toThrow(
      /Unsafe registry artifact path/,
    );
  });
  it("safeRelativePath rejects foo/..", () => {
    expect(() => safeRelativePath("foo/..")).toThrow(
      /Unsafe registry artifact path/,
    );
  });
  it("safeRelativePath rejects foo/.", () => {
    expect(() => safeRelativePath("foo/.")).toThrow(
      /Unsafe registry artifact path/,
    );
  });
  it("safeRelativePath rejects foo//bar", () => {
    expect(() => safeRelativePath("foo//bar")).toThrow(
      /Unsafe registry artifact path/,
    );
  });
  it("safeRelativePath rejects /absolute", () => {
    expect(() => safeRelativePath("/absolute")).toThrow(
      /Unsafe registry artifact path/,
    );
  });
  it("safeRelativePath rejects foo/./bar", () => {
    expect(() => safeRelativePath("foo/./bar")).toThrow(
      /Unsafe registry artifact path/,
    );
  });
  it("safeRelativePath rejects entries/../secret.json", () => {
    expect(() => safeRelativePath("entries/../secret.json")).toThrow(
      /Unsafe registry artifact path/,
    );
  });
  it("safeRelativePath rejects entries/mcp/../hooks/evil.json", () => {
    expect(() => safeRelativePath("entries/mcp/../hooks/evil.json")).toThrow(
      /Unsafe registry artifact path/,
    );
  });
  it("safeRelativePath rejects entries/./mcp/demo.json", () => {
    expect(() => safeRelativePath("entries/./mcp/demo.json")).toThrow(
      /Unsafe registry artifact path/,
    );
  });
  it("safeRelativePath rejects entries/mcp//demo.json", () => {
    expect(() => safeRelativePath("entries/mcp//demo.json")).toThrow(
      /Unsafe registry artifact path/,
    );
  });
  it("safeRelativePath rejects entries/mcp/..", () => {
    expect(() => safeRelativePath("entries/mcp/..")).toThrow(
      /Unsafe registry artifact path/,
    );
  });
  it("safeRelativePath rejects entries/mcp/.", () => {
    expect(() => safeRelativePath("entries/mcp/.")).toThrow(
      /Unsafe registry artifact path/,
    );
  });
  it("safeRelativePath rejects ../entries/mcp/demo.json", () => {
    expect(() => safeRelativePath("../entries/mcp/demo.json")).toThrow(
      /Unsafe registry artifact path/,
    );
  });
  it("safeRelativePath rejects foo/bar/../baz", () => {
    expect(() => safeRelativePath("foo/bar/../baz")).toThrow(
      /Unsafe registry artifact path/,
    );
  });
  it("safeRelativePath rejects foo/bar/./baz", () => {
    expect(() => safeRelativePath("foo/bar/./baz")).toThrow(
      /Unsafe registry artifact path/,
    );
  });
  it("safeRelativePath rejects foo/bar//baz", () => {
    expect(() => safeRelativePath("foo/bar//baz")).toThrow(
      /Unsafe registry artifact path/,
    );
  });
  it("safeRelativePath rejects /entries/mcp/demo.json", () => {
    expect(() => safeRelativePath("/entries/mcp/demo.json")).toThrow(
      /Unsafe registry artifact path/,
    );
  });
  it("safeRelativePath rejects entries//mcp/demo.json", () => {
    expect(() => safeRelativePath("entries//mcp/demo.json")).toThrow(
      /Unsafe registry artifact path/,
    );
  });
  it("safeRelativePath rejects entries/mcp//demo.json", () => {
    expect(() => safeRelativePath("entries/mcp//demo.json")).toThrow(
      /Unsafe registry artifact path/,
    );
  });
  it("safeRelativePath rejects entries/mcp/demo.json/..", () => {
    expect(() => safeRelativePath("entries/mcp/demo.json/..")).toThrow(
      /Unsafe registry artifact path/,
    );
  });
  it("safeRelativePath rejects entries/mcp/demo.json/.", () => {
    expect(() => safeRelativePath("entries/mcp/demo.json/.")).toThrow(
      /Unsafe registry artifact path/,
    );
  });
  it("safeRelativePath rejects a/..", () => {
    expect(() => safeRelativePath("a/..")).toThrow(
      /Unsafe registry artifact path/,
    );
  });
  it("safeRelativePath rejects a/.", () => {
    expect(() => safeRelativePath("a/.")).toThrow(
      /Unsafe registry artifact path/,
    );
  });
  it("safeRelativePath rejects a//b", () => {
    expect(() => safeRelativePath("a//b")).toThrow(
      /Unsafe registry artifact path/,
    );
  });
  it("safeRelativePath rejects /", () => {
    expect(() => safeRelativePath("/")).toThrow(
      /Unsafe registry artifact path/,
    );
  });
  it("safeRelativePath rejects //", () => {
    expect(() => safeRelativePath("//")).toThrow(
      /Unsafe registry artifact path/,
    );
  });
  it("safeRelativePath rejects ///", () => {
    expect(() => safeRelativePath("///")).toThrow(
      /Unsafe registry artifact path/,
    );
  });
  it("safeRelativePath rejects foo/.. /", () => {
    expect(() => safeRelativePath("foo/.. /")).toThrow(
      /Unsafe registry artifact path/,
    );
  });
  it("safeRelativePath rejects entries/hooks/../../secret", () => {
    expect(() => safeRelativePath("entries/hooks/../../secret")).toThrow(
      /Unsafe registry artifact path/,
    );
  });
  it("safeRelativePath rejects entries/hooks/./../secret", () => {
    expect(() => safeRelativePath("entries/hooks/./../secret")).toThrow(
      /Unsafe registry artifact path/,
    );
  });
  it("safeRelativePath rejects data/entries/../outside.json", () => {
    expect(() => safeRelativePath("data/entries/../outside.json")).toThrow(
      /Unsafe registry artifact path/,
    );
  });
  it("safeRelativePath rejects feeds/category/../outside/inde", () => {
    expect(() =>
      safeRelativePath("feeds/category/../outside/index.json"),
    ).toThrow(/Unsafe registry artifact path/);
  });
  it("safeRelativePath rejects skill-adapters/cursor/../../se", () => {
    expect(() =>
      safeRelativePath("skill-adapters/cursor/../../secret.mdc"),
    ).toThrow(/Unsafe registry artifact path/);
  });
  it("safeRelativePath rejects search-index.json/..", () => {
    expect(() => safeRelativePath("search-index.json/..")).toThrow(
      /Unsafe registry artifact path/,
    );
  });
  it("safeRelativePath rejects registry-manifest.json/.", () => {
    expect(() => safeRelativePath("registry-manifest.json/.")).toThrow(
      /Unsafe registry artifact path/,
    );
  });
  it("safeRelativePath rejects submission-spec.json//backup.j", () => {
    expect(() => safeRelativePath("submission-spec.json//backup.json")).toThrow(
      /Unsafe registry artifact path/,
    );
  });
  it("safeRelativePath rejects directory-index.json/../outsid", () => {
    expect(() => safeRelativePath("directory-index.json/../outside")).toThrow(
      /Unsafe registry artifact path/,
    );
  });
  it("safeRelativePath rejects relation-graph.json/./outside", () => {
    expect(() => safeRelativePath("relation-graph.json/./outside")).toThrow(
      /Unsafe registry artifact path/,
    );
  });
  it("safeRelativePath rejects feeds/index.json/../../outside", () => {
    expect(() => safeRelativePath("feeds/index.json/../../outside")).toThrow(
      /Unsafe registry artifact path/,
    );
  });
  it("safeRelativePath rejects entries/skills/demo/../other.j", () => {
    expect(() => safeRelativePath("entries/skills/demo/../other.json")).toThrow(
      /Unsafe registry artifact path/,
    );
  });
  it("safeRelativePath rejects entries/agents/demo/../../outs", () => {
    expect(() =>
      safeRelativePath("entries/agents/demo/../../outside.json"),
    ).toThrow(/Unsafe registry artifact path/);
  });
  it("safeRelativePath rejects entries/mcp/demo/../../../outs", () => {
    expect(() =>
      safeRelativePath("entries/mcp/demo/../../../outside.json"),
    ).toThrow(/Unsafe registry artifact path/);
  });
  it("safeRelativePath rejects entries/tools/demo/../../../..", () => {
    expect(() =>
      safeRelativePath("entries/tools/demo/../../../../outside.json"),
    ).toThrow(/Unsafe registry artifact path/);
  });
  it("safeRelativePath rejects entries/commands/demo/../../..", () => {
    expect(() =>
      safeRelativePath("entries/commands/demo/../../../../../outside.json"),
    ).toThrow(/Unsafe registry artifact path/);
  });
  it("safeRelativePath rejects entries/hooks/demo/../../../..", () => {
    expect(() =>
      safeRelativePath("entries/hooks/demo/../../../../../../outside.json"),
    ).toThrow(/Unsafe registry artifact path/);
  });
  it("safeRelativePath rejects entries/guides/demo/../../../.", () => {
    expect(() =>
      safeRelativePath("entries/guides/demo/../../../../../../../outside.json"),
    ).toThrow(/Unsafe registry artifact path/);
  });
  it("safeRelativePath rejects entries/statuslines/demo/../..", () => {
    expect(() =>
      safeRelativePath(
        "entries/statuslines/demo/../../../../../../../../outside.json",
      ),
    ).toThrow(/Unsafe registry artifact path/);
  });
  it("safeRelativePath rejects entries/collections/demo/../..", () => {
    expect(() =>
      safeRelativePath(
        "entries/collections/demo/../../../../../../../../outside.json",
      ),
    ).toThrow(/Unsafe registry artifact path/);
  });
  it("safeRelativePath rejects entries/rules/demo/../../../..", () => {
    expect(() =>
      safeRelativePath(
        "entries/rules/demo/../../../../../../../../outside.json",
      ),
    ).toThrow(/Unsafe registry artifact path/);
  });
  it("safeRelativePath rejects a/b/c/..", () => {
    expect(() => safeRelativePath("a/b/c/..")).toThrow(
      /Unsafe registry artifact path/,
    );
  });
  it("safeRelativePath rejects a/b/c/.", () => {
    expect(() => safeRelativePath("a/b/c/.")).toThrow(
      /Unsafe registry artifact path/,
    );
  });
  it("safeRelativePath rejects a/b//c", () => {
    expect(() => safeRelativePath("a/b//c")).toThrow(
      /Unsafe registry artifact path/,
    );
  });
  it("safeRelativePath rejects a//b/c", () => {
    expect(() => safeRelativePath("a//b/c")).toThrow(
      /Unsafe registry artifact path/,
    );
  });
  it("safeRelativePath rejects a/b/c//", () => {
    expect(() => safeRelativePath("a/b/c//")).toThrow(
      /Unsafe registry artifact path/,
    );
  });
  it("safeRelativePath rejects /a/b/c", () => {
    expect(() => safeRelativePath("/a/b/c")).toThrow(
      /Unsafe registry artifact path/,
    );
  });
  it("safeRelativePath rejects //a/b/c", () => {
    expect(() => safeRelativePath("//a/b/c")).toThrow(
      /Unsafe registry artifact path/,
    );
  });
  it("safeRelativePath rejects a//b//c", () => {
    expect(() => safeRelativePath("a//b//c")).toThrow(
      /Unsafe registry artifact path/,
    );
  });
  it("safeRelativePath rejects a/b/c/d/..", () => {
    expect(() => safeRelativePath("a/b/c/d/..")).toThrow(
      /Unsafe registry artifact path/,
    );
  });
  it("safeRelativePath rejects a/b/c/d/.", () => {
    expect(() => safeRelativePath("a/b/c/d/.")).toThrow(
      /Unsafe registry artifact path/,
    );
  });
  it("safeRelativePath rejects a/b/c/d//e", () => {
    expect(() => safeRelativePath("a/b/c/d//e")).toThrow(
      /Unsafe registry artifact path/,
    );
  });
  it("safeRelativePath rejects a/b/c/d/e/..", () => {
    expect(() => safeRelativePath("a/b/c/d/e/..")).toThrow(
      /Unsafe registry artifact path/,
    );
  });
  it("safeRelativePath rejects a/b/c/d/e/.", () => {
    expect(() => safeRelativePath("a/b/c/d/e/.")).toThrow(
      /Unsafe registry artifact path/,
    );
  });
  it("safeRelativePath rejects a/b/c/d/e//f", () => {
    expect(() => safeRelativePath("a/b/c/d/e//f")).toThrow(
      /Unsafe registry artifact path/,
    );
  });
  it("safeRelativePath rejects entries/mcp/browser-bridge.jso", () => {
    expect(() =>
      safeRelativePath("entries/mcp/browser-bridge.json/.."),
    ).toThrow(/Unsafe registry artifact path/);
  });
  it("safeRelativePath rejects entries/mcp/browser-bridge.jso", () => {
    expect(() => safeRelativePath("entries/mcp/browser-bridge.json/.")).toThrow(
      /Unsafe registry artifact path/,
    );
  });
  it("safeRelativePath rejects entries/mcp/browser-bridge.jso", () => {
    expect(() =>
      safeRelativePath("entries/mcp/browser-bridge.json//copy.json"),
    ).toThrow(/Unsafe registry artifact path/);
  });
  it("safeRelativePath rejects entries/mcp/browser-bridge.jso", () => {
    expect(() =>
      safeRelativePath("entries/mcp/browser-bridge.json/../other.json"),
    ).toThrow(/Unsafe registry artifact path/);
  });
  it("safeRelativePath rejects entries/mcp/browser-bridge.jso", () => {
    expect(() =>
      safeRelativePath("entries/mcp/browser-bridge.json/./other.json"),
    ).toThrow(/Unsafe registry artifact path/);
  });
  it("safeRelativePath rejects entries/mcp/browser-bridge.jso", () => {
    expect(() =>
      safeRelativePath("entries/mcp/browser-bridge.json/../../other.json"),
    ).toThrow(/Unsafe registry artifact path/);
  });
  it("safeRelativePath rejects entries/mcp/browser-bridge.jso", () => {
    expect(() =>
      safeRelativePath("entries/mcp/browser-bridge.json/../../../other.json"),
    ).toThrow(/Unsafe registry artifact path/);
  });
  it("safeRelativePath rejects entries/mcp/browser-bridge.jso", () => {
    expect(() =>
      safeRelativePath(
        "entries/mcp/browser-bridge.json/../../../../other.json",
      ),
    ).toThrow(/Unsafe registry artifact path/);
  });
  it("safeRelativePath rejects entries/mcp/browser-bridge.jso", () => {
    expect(() =>
      safeRelativePath(
        "entries/mcp/browser-bridge.json/../../../../../other.json",
      ),
    ).toThrow(/Unsafe registry artifact path/);
  });
  it("safeRelativePath rejects entries/mcp/browser-bridge.jso", () => {
    expect(() =>
      safeRelativePath(
        "entries/mcp/browser-bridge.json/../../../../../../other.json",
      ),
    ).toThrow(/Unsafe registry artifact path/);
  });
  it("safeRelativePath rejects entries/mcp/browser-bridge.jso", () => {
    expect(() =>
      safeRelativePath(
        "entries/mcp/browser-bridge.json/../../../../../../../other.json",
      ),
    ).toThrow(/Unsafe registry artifact path/);
  });
  it("safeRelativePath rejects entries/mcp/browser-bridge.jso", () => {
    expect(() =>
      safeRelativePath(
        "entries/mcp/browser-bridge.json/../../../../../../../../other.json",
      ),
    ).toThrow(/Unsafe registry artifact path/);
  });
  it("safeRelativePath rejects entries/mcp/browser-bridge.jso", () => {
    expect(() =>
      safeRelativePath(
        "entries/mcp/browser-bridge.json/../../../../../../../../../other.json",
      ),
    ).toThrow(/Unsafe registry artifact path/);
  });
  it("safeRelativePath rejects entries/mcp/browser-bridge.jso", () => {
    expect(() =>
      safeRelativePath(
        "entries/mcp/browser-bridge.json/../../../../../../../../../../other.json",
      ),
    ).toThrow(/Unsafe registry artifact path/);
  });
  it("safeRelativePath accepts traversal-safe agents 0", () => {
    expect(safeRelativePath("entries/agents/safe-0.json")).toContain(
      "safe-0.json",
    );
    expect(safeRelativePath("feeds/agents/index-0.json")).toContain(
      "index-0.json",
    );
  });
  it("safeRelativePath accepts traversal-safe agents 1", () => {
    expect(safeRelativePath("entries/agents/safe-1.json")).toContain(
      "safe-1.json",
    );
    expect(safeRelativePath("feeds/agents/index-1.json")).toContain(
      "index-1.json",
    );
  });
  it("safeRelativePath accepts traversal-safe agents 2", () => {
    expect(safeRelativePath("entries/agents/safe-2.json")).toContain(
      "safe-2.json",
    );
    expect(safeRelativePath("feeds/agents/index-2.json")).toContain(
      "index-2.json",
    );
  });
  it("safeRelativePath accepts traversal-safe agents 3", () => {
    expect(safeRelativePath("entries/agents/safe-3.json")).toContain(
      "safe-3.json",
    );
    expect(safeRelativePath("feeds/agents/index-3.json")).toContain(
      "index-3.json",
    );
  });
  it("safeRelativePath accepts traversal-safe agents 4", () => {
    expect(safeRelativePath("entries/agents/safe-4.json")).toContain(
      "safe-4.json",
    );
    expect(safeRelativePath("feeds/agents/index-4.json")).toContain(
      "index-4.json",
    );
  });
  it("safeRelativePath accepts traversal-safe agents 5", () => {
    expect(safeRelativePath("entries/agents/safe-5.json")).toContain(
      "safe-5.json",
    );
    expect(safeRelativePath("feeds/agents/index-5.json")).toContain(
      "index-5.json",
    );
  });
  it("safeRelativePath accepts traversal-safe mcp 0", () => {
    expect(safeRelativePath("entries/mcp/safe-0.json")).toContain(
      "safe-0.json",
    );
    expect(safeRelativePath("feeds/mcp/index-0.json")).toContain(
      "index-0.json",
    );
  });
  it("safeRelativePath accepts traversal-safe mcp 1", () => {
    expect(safeRelativePath("entries/mcp/safe-1.json")).toContain(
      "safe-1.json",
    );
    expect(safeRelativePath("feeds/mcp/index-1.json")).toContain(
      "index-1.json",
    );
  });
  it("safeRelativePath accepts traversal-safe mcp 2", () => {
    expect(safeRelativePath("entries/mcp/safe-2.json")).toContain(
      "safe-2.json",
    );
    expect(safeRelativePath("feeds/mcp/index-2.json")).toContain(
      "index-2.json",
    );
  });
  it("safeRelativePath accepts traversal-safe mcp 3", () => {
    expect(safeRelativePath("entries/mcp/safe-3.json")).toContain(
      "safe-3.json",
    );
    expect(safeRelativePath("feeds/mcp/index-3.json")).toContain(
      "index-3.json",
    );
  });
  it("safeRelativePath accepts traversal-safe mcp 4", () => {
    expect(safeRelativePath("entries/mcp/safe-4.json")).toContain(
      "safe-4.json",
    );
    expect(safeRelativePath("feeds/mcp/index-4.json")).toContain(
      "index-4.json",
    );
  });
  it("safeRelativePath accepts traversal-safe mcp 5", () => {
    expect(safeRelativePath("entries/mcp/safe-5.json")).toContain(
      "safe-5.json",
    );
    expect(safeRelativePath("feeds/mcp/index-5.json")).toContain(
      "index-5.json",
    );
  });
  it("safeRelativePath accepts traversal-safe tools 0", () => {
    expect(safeRelativePath("entries/tools/safe-0.json")).toContain(
      "safe-0.json",
    );
    expect(safeRelativePath("feeds/tools/index-0.json")).toContain(
      "index-0.json",
    );
  });
  it("safeRelativePath accepts traversal-safe tools 1", () => {
    expect(safeRelativePath("entries/tools/safe-1.json")).toContain(
      "safe-1.json",
    );
    expect(safeRelativePath("feeds/tools/index-1.json")).toContain(
      "index-1.json",
    );
  });
  it("safeRelativePath accepts traversal-safe tools 2", () => {
    expect(safeRelativePath("entries/tools/safe-2.json")).toContain(
      "safe-2.json",
    );
    expect(safeRelativePath("feeds/tools/index-2.json")).toContain(
      "index-2.json",
    );
  });
  it("safeRelativePath accepts traversal-safe tools 3", () => {
    expect(safeRelativePath("entries/tools/safe-3.json")).toContain(
      "safe-3.json",
    );
    expect(safeRelativePath("feeds/tools/index-3.json")).toContain(
      "index-3.json",
    );
  });
  it("safeRelativePath accepts traversal-safe tools 4", () => {
    expect(safeRelativePath("entries/tools/safe-4.json")).toContain(
      "safe-4.json",
    );
    expect(safeRelativePath("feeds/tools/index-4.json")).toContain(
      "index-4.json",
    );
  });
  it("safeRelativePath accepts traversal-safe tools 5", () => {
    expect(safeRelativePath("entries/tools/safe-5.json")).toContain(
      "safe-5.json",
    );
    expect(safeRelativePath("feeds/tools/index-5.json")).toContain(
      "index-5.json",
    );
  });
  it("safeRelativePath accepts traversal-safe skills 0", () => {
    expect(safeRelativePath("entries/skills/safe-0.json")).toContain(
      "safe-0.json",
    );
    expect(safeRelativePath("feeds/skills/index-0.json")).toContain(
      "index-0.json",
    );
  });
  it("safeRelativePath accepts traversal-safe skills 1", () => {
    expect(safeRelativePath("entries/skills/safe-1.json")).toContain(
      "safe-1.json",
    );
    expect(safeRelativePath("feeds/skills/index-1.json")).toContain(
      "index-1.json",
    );
  });
  it("safeRelativePath accepts traversal-safe skills 2", () => {
    expect(safeRelativePath("entries/skills/safe-2.json")).toContain(
      "safe-2.json",
    );
    expect(safeRelativePath("feeds/skills/index-2.json")).toContain(
      "index-2.json",
    );
  });
  it("safeRelativePath accepts traversal-safe skills 3", () => {
    expect(safeRelativePath("entries/skills/safe-3.json")).toContain(
      "safe-3.json",
    );
    expect(safeRelativePath("feeds/skills/index-3.json")).toContain(
      "index-3.json",
    );
  });
  it("safeRelativePath accepts traversal-safe skills 4", () => {
    expect(safeRelativePath("entries/skills/safe-4.json")).toContain(
      "safe-4.json",
    );
    expect(safeRelativePath("feeds/skills/index-4.json")).toContain(
      "index-4.json",
    );
  });
  it("safeRelativePath accepts traversal-safe skills 5", () => {
    expect(safeRelativePath("entries/skills/safe-5.json")).toContain(
      "safe-5.json",
    );
    expect(safeRelativePath("feeds/skills/index-5.json")).toContain(
      "index-5.json",
    );
  });
  it("safeRelativePath accepts traversal-safe rules 0", () => {
    expect(safeRelativePath("entries/rules/safe-0.json")).toContain(
      "safe-0.json",
    );
    expect(safeRelativePath("feeds/rules/index-0.json")).toContain(
      "index-0.json",
    );
  });
  it("safeRelativePath accepts traversal-safe rules 1", () => {
    expect(safeRelativePath("entries/rules/safe-1.json")).toContain(
      "safe-1.json",
    );
    expect(safeRelativePath("feeds/rules/index-1.json")).toContain(
      "index-1.json",
    );
  });
  it("safeRelativePath accepts traversal-safe rules 2", () => {
    expect(safeRelativePath("entries/rules/safe-2.json")).toContain(
      "safe-2.json",
    );
    expect(safeRelativePath("feeds/rules/index-2.json")).toContain(
      "index-2.json",
    );
  });
  it("safeRelativePath accepts traversal-safe rules 3", () => {
    expect(safeRelativePath("entries/rules/safe-3.json")).toContain(
      "safe-3.json",
    );
    expect(safeRelativePath("feeds/rules/index-3.json")).toContain(
      "index-3.json",
    );
  });
  it("safeRelativePath accepts traversal-safe rules 4", () => {
    expect(safeRelativePath("entries/rules/safe-4.json")).toContain(
      "safe-4.json",
    );
    expect(safeRelativePath("feeds/rules/index-4.json")).toContain(
      "index-4.json",
    );
  });
  it("safeRelativePath accepts traversal-safe rules 5", () => {
    expect(safeRelativePath("entries/rules/safe-5.json")).toContain(
      "safe-5.json",
    );
    expect(safeRelativePath("feeds/rules/index-5.json")).toContain(
      "index-5.json",
    );
  });
  it("safeRelativePath accepts traversal-safe commands 0", () => {
    expect(safeRelativePath("entries/commands/safe-0.json")).toContain(
      "safe-0.json",
    );
    expect(safeRelativePath("feeds/commands/index-0.json")).toContain(
      "index-0.json",
    );
  });
  it("safeRelativePath accepts traversal-safe commands 1", () => {
    expect(safeRelativePath("entries/commands/safe-1.json")).toContain(
      "safe-1.json",
    );
    expect(safeRelativePath("feeds/commands/index-1.json")).toContain(
      "index-1.json",
    );
  });
  it("safeRelativePath accepts traversal-safe commands 2", () => {
    expect(safeRelativePath("entries/commands/safe-2.json")).toContain(
      "safe-2.json",
    );
    expect(safeRelativePath("feeds/commands/index-2.json")).toContain(
      "index-2.json",
    );
  });
  it("safeRelativePath accepts traversal-safe commands 3", () => {
    expect(safeRelativePath("entries/commands/safe-3.json")).toContain(
      "safe-3.json",
    );
    expect(safeRelativePath("feeds/commands/index-3.json")).toContain(
      "index-3.json",
    );
  });
  it("safeRelativePath accepts traversal-safe commands 4", () => {
    expect(safeRelativePath("entries/commands/safe-4.json")).toContain(
      "safe-4.json",
    );
    expect(safeRelativePath("feeds/commands/index-4.json")).toContain(
      "index-4.json",
    );
  });
  it("safeRelativePath accepts traversal-safe commands 5", () => {
    expect(safeRelativePath("entries/commands/safe-5.json")).toContain(
      "safe-5.json",
    );
    expect(safeRelativePath("feeds/commands/index-5.json")).toContain(
      "index-5.json",
    );
  });
  it("safeRelativePath accepts traversal-safe hooks 0", () => {
    expect(safeRelativePath("entries/hooks/safe-0.json")).toContain(
      "safe-0.json",
    );
    expect(safeRelativePath("feeds/hooks/index-0.json")).toContain(
      "index-0.json",
    );
  });
  it("safeRelativePath accepts traversal-safe hooks 1", () => {
    expect(safeRelativePath("entries/hooks/safe-1.json")).toContain(
      "safe-1.json",
    );
    expect(safeRelativePath("feeds/hooks/index-1.json")).toContain(
      "index-1.json",
    );
  });
  it("safeRelativePath accepts traversal-safe hooks 2", () => {
    expect(safeRelativePath("entries/hooks/safe-2.json")).toContain(
      "safe-2.json",
    );
    expect(safeRelativePath("feeds/hooks/index-2.json")).toContain(
      "index-2.json",
    );
  });
  it("safeRelativePath accepts traversal-safe hooks 3", () => {
    expect(safeRelativePath("entries/hooks/safe-3.json")).toContain(
      "safe-3.json",
    );
    expect(safeRelativePath("feeds/hooks/index-3.json")).toContain(
      "index-3.json",
    );
  });
  it("safeRelativePath accepts traversal-safe hooks 4", () => {
    expect(safeRelativePath("entries/hooks/safe-4.json")).toContain(
      "safe-4.json",
    );
    expect(safeRelativePath("feeds/hooks/index-4.json")).toContain(
      "index-4.json",
    );
  });
  it("safeRelativePath accepts traversal-safe hooks 5", () => {
    expect(safeRelativePath("entries/hooks/safe-5.json")).toContain(
      "safe-5.json",
    );
    expect(safeRelativePath("feeds/hooks/index-5.json")).toContain(
      "index-5.json",
    );
  });
  it("safeRelativePath accepts traversal-safe guides 0", () => {
    expect(safeRelativePath("entries/guides/safe-0.json")).toContain(
      "safe-0.json",
    );
    expect(safeRelativePath("feeds/guides/index-0.json")).toContain(
      "index-0.json",
    );
  });
  it("safeRelativePath accepts traversal-safe guides 1", () => {
    expect(safeRelativePath("entries/guides/safe-1.json")).toContain(
      "safe-1.json",
    );
    expect(safeRelativePath("feeds/guides/index-1.json")).toContain(
      "index-1.json",
    );
  });
  it("safeRelativePath accepts traversal-safe guides 2", () => {
    expect(safeRelativePath("entries/guides/safe-2.json")).toContain(
      "safe-2.json",
    );
    expect(safeRelativePath("feeds/guides/index-2.json")).toContain(
      "index-2.json",
    );
  });
  it("safeRelativePath accepts traversal-safe guides 3", () => {
    expect(safeRelativePath("entries/guides/safe-3.json")).toContain(
      "safe-3.json",
    );
    expect(safeRelativePath("feeds/guides/index-3.json")).toContain(
      "index-3.json",
    );
  });
  it("safeRelativePath accepts traversal-safe guides 4", () => {
    expect(safeRelativePath("entries/guides/safe-4.json")).toContain(
      "safe-4.json",
    );
    expect(safeRelativePath("feeds/guides/index-4.json")).toContain(
      "index-4.json",
    );
  });
  it("safeRelativePath accepts traversal-safe guides 5", () => {
    expect(safeRelativePath("entries/guides/safe-5.json")).toContain(
      "safe-5.json",
    );
    expect(safeRelativePath("feeds/guides/index-5.json")).toContain(
      "index-5.json",
    );
  });
  it("safeRelativePath accepts traversal-safe collections 0", () => {
    expect(safeRelativePath("entries/collections/safe-0.json")).toContain(
      "safe-0.json",
    );
    expect(safeRelativePath("feeds/collections/index-0.json")).toContain(
      "index-0.json",
    );
  });
  it("safeRelativePath accepts traversal-safe collections 1", () => {
    expect(safeRelativePath("entries/collections/safe-1.json")).toContain(
      "safe-1.json",
    );
    expect(safeRelativePath("feeds/collections/index-1.json")).toContain(
      "index-1.json",
    );
  });
  it("safeRelativePath accepts traversal-safe collections 2", () => {
    expect(safeRelativePath("entries/collections/safe-2.json")).toContain(
      "safe-2.json",
    );
    expect(safeRelativePath("feeds/collections/index-2.json")).toContain(
      "index-2.json",
    );
  });
  it("safeRelativePath accepts traversal-safe collections 3", () => {
    expect(safeRelativePath("entries/collections/safe-3.json")).toContain(
      "safe-3.json",
    );
    expect(safeRelativePath("feeds/collections/index-3.json")).toContain(
      "index-3.json",
    );
  });
  it("safeRelativePath accepts traversal-safe collections 4", () => {
    expect(safeRelativePath("entries/collections/safe-4.json")).toContain(
      "safe-4.json",
    );
    expect(safeRelativePath("feeds/collections/index-4.json")).toContain(
      "index-4.json",
    );
  });
  it("safeRelativePath accepts traversal-safe collections 5", () => {
    expect(safeRelativePath("entries/collections/safe-5.json")).toContain(
      "safe-5.json",
    );
    expect(safeRelativePath("feeds/collections/index-5.json")).toContain(
      "index-5.json",
    );
  });
  it("safeRelativePath accepts traversal-safe statuslines 0", () => {
    expect(safeRelativePath("entries/statuslines/safe-0.json")).toContain(
      "safe-0.json",
    );
    expect(safeRelativePath("feeds/statuslines/index-0.json")).toContain(
      "index-0.json",
    );
  });
  it("safeRelativePath accepts traversal-safe statuslines 1", () => {
    expect(safeRelativePath("entries/statuslines/safe-1.json")).toContain(
      "safe-1.json",
    );
    expect(safeRelativePath("feeds/statuslines/index-1.json")).toContain(
      "index-1.json",
    );
  });
  it("safeRelativePath accepts traversal-safe statuslines 2", () => {
    expect(safeRelativePath("entries/statuslines/safe-2.json")).toContain(
      "safe-2.json",
    );
    expect(safeRelativePath("feeds/statuslines/index-2.json")).toContain(
      "index-2.json",
    );
  });
  it("safeRelativePath accepts traversal-safe statuslines 3", () => {
    expect(safeRelativePath("entries/statuslines/safe-3.json")).toContain(
      "safe-3.json",
    );
    expect(safeRelativePath("feeds/statuslines/index-3.json")).toContain(
      "index-3.json",
    );
  });
  it("safeRelativePath accepts traversal-safe statuslines 4", () => {
    expect(safeRelativePath("entries/statuslines/safe-4.json")).toContain(
      "safe-4.json",
    );
    expect(safeRelativePath("feeds/statuslines/index-4.json")).toContain(
      "index-4.json",
    );
  });
  it("safeRelativePath accepts traversal-safe statuslines 5", () => {
    expect(safeRelativePath("entries/statuslines/safe-5.json")).toContain(
      "safe-5.json",
    );
    expect(safeRelativePath("feeds/statuslines/index-5.json")).toContain(
      "index-5.json",
    );
  });
  it("safeRelativePath single segment a", () => {
    expect(safeRelativePath("a.json")).toBe("a.json");
  });
  it("safeRelativePath single segment z", () => {
    expect(safeRelativePath("z.json")).toBe("z.json");
  });
  it("safeRelativePath single segment 0", () => {
    expect(safeRelativePath("0.json")).toBe("0.json");
  });
  it("safeRelativePath single segment 9", () => {
    expect(safeRelativePath("9.json")).toBe("9.json");
  });
  it("safeRelativePath single segment a0", () => {
    expect(safeRelativePath("a0.json")).toBe("a0.json");
  });
  it("safeRelativePath single segment 0a", () => {
    expect(safeRelativePath("0a.json")).toBe("0a.json");
  });
  it("safeRelativePath single segment a-b", () => {
    expect(safeRelativePath("a-b.json")).toBe("a-b.json");
  });
  it("safeRelativePath single segment b-c-d", () => {
    expect(safeRelativePath("b-c-d.json")).toBe("b-c-d.json");
  });
  it("safeRelativePath single segment mcp", () => {
    expect(safeRelativePath("mcp.json")).toBe("mcp.json");
  });
  it("safeRelativePath single segment skills", () => {
    expect(safeRelativePath("skills.json")).toBe("skills.json");
  });
  it("safeRelativePath single segment hooks", () => {
    expect(safeRelativePath("hooks.json")).toBe("hooks.json");
  });
  it("safeRelativePath single segment commands", () => {
    expect(safeRelativePath("commands.json")).toBe("commands.json");
  });
  it("safeRelativePath single segment statuslines", () => {
    expect(safeRelativePath("statuslines.json")).toBe("statuslines.json");
  });
  it("safeRelativePath single segment guides", () => {
    expect(safeRelativePath("guides.json")).toBe("guides.json");
  });
  it("safeRelativePath single segment plugins", () => {
    expect(safeRelativePath("plugins.json")).toBe("plugins.json");
  });
  it("safeRelativePath single segment agents", () => {
    expect(safeRelativePath("agents.json")).toBe("agents.json");
  });
  it("safeRelativePath single segment tools", () => {
    expect(safeRelativePath("tools.json")).toBe("tools.json");
  });
  it("safeRelativePath single segment rules", () => {
    expect(safeRelativePath("rules.json")).toBe("rules.json");
  });
  it("safeRelativePath single segment collections", () => {
    expect(safeRelativePath("collections.json")).toBe("collections.json");
  });
  it("safeRelativePath single segment browser-bridge", () => {
    expect(safeRelativePath("browser-bridge.json")).toBe("browser-bridge.json");
  });
  it("safeRelativePath single segment demo-agent", () => {
    expect(safeRelativePath("demo-agent.json")).toBe("demo-agent.json");
  });
  it("safeRelativePath single segment demo-mcp", () => {
    expect(safeRelativePath("demo-mcp.json")).toBe("demo-mcp.json");
  });
  it("safeRelativePath single segment demo-skills", () => {
    expect(safeRelativePath("demo-skills.json")).toBe("demo-skills.json");
  });
  it("safeRelativePath single segment demo-hooks", () => {
    expect(safeRelativePath("demo-hooks.json")).toBe("demo-hooks.json");
  });
  it("safeRelativePath single segment demo-commands", () => {
    expect(safeRelativePath("demo-commands.json")).toBe("demo-commands.json");
  });
  it("safeRelativePath single segment demo-statuslines", () => {
    expect(safeRelativePath("demo-statuslines.json")).toBe(
      "demo-statuslines.json",
    );
  });
  it("safeRelativePath single segment demo-guides", () => {
    expect(safeRelativePath("demo-guides.json")).toBe("demo-guides.json");
  });
  it("safeRelativePath single segment demo-plugins", () => {
    expect(safeRelativePath("demo-plugins.json")).toBe("demo-plugins.json");
  });
  it("safeRelativePath single segment demo-tools", () => {
    expect(safeRelativePath("demo-tools.json")).toBe("demo-tools.json");
  });
  it("safeRelativePath single segment demo-rules", () => {
    expect(safeRelativePath("demo-rules.json")).toBe("demo-rules.json");
  });
  it("safeRelativePath single segment demo-collections", () => {
    expect(safeRelativePath("demo-collections.json")).toBe(
      "demo-collections.json",
    );
  });
  it("safeRelativePath single segment playwright-bridge", () => {
    expect(safeRelativePath("playwright-bridge.json")).toBe(
      "playwright-bridge.json",
    );
  });
  it("safeRelativePath single segment git-workflow", () => {
    expect(safeRelativePath("git-workflow.json")).toBe("git-workflow.json");
  });
  it("safeRelativePath single segment code-review", () => {
    expect(safeRelativePath("code-review.json")).toBe("code-review.json");
  });
  it("safeRelativePath single segment test-runner", () => {
    expect(safeRelativePath("test-runner.json")).toBe("test-runner.json");
  });
  it("safeRelativePath single segment lint-fix", () => {
    expect(safeRelativePath("lint-fix.json")).toBe("lint-fix.json");
  });
  it("safeRelativePath single segment format-code", () => {
    expect(safeRelativePath("format-code.json")).toBe("format-code.json");
  });
  it("safeRelativePath single segment deploy-helper", () => {
    expect(safeRelativePath("deploy-helper.json")).toBe("deploy-helper.json");
  });
  it("safeRelativePath single segment monitor-logs", () => {
    expect(safeRelativePath("monitor-logs.json")).toBe("monitor-logs.json");
  });
  it("safeRelativePath single segment debug-session", () => {
    expect(safeRelativePath("debug-session.json")).toBe("debug-session.json");
  });
  it("safeRelativePath single segment profile-perf", () => {
    expect(safeRelativePath("profile-perf.json")).toBe("profile-perf.json");
  });
  it("safeRelativePath single segment security-scan", () => {
    expect(safeRelativePath("security-scan.json")).toBe("security-scan.json");
  });
  it("safeRelativePath single segment dependency-check", () => {
    expect(safeRelativePath("dependency-check.json")).toBe(
      "dependency-check.json",
    );
  });
  it("safeRelativePath single segment license-audit", () => {
    expect(safeRelativePath("license-audit.json")).toBe("license-audit.json");
  });
  it("safeRelativePath single segment changelog-gen", () => {
    expect(safeRelativePath("changelog-gen.json")).toBe("changelog-gen.json");
  });
  it("safeRelativePath single segment readme-gen", () => {
    expect(safeRelativePath("readme-gen.json")).toBe("readme-gen.json");
  });
  it("safeRelativePath single segment api-docs", () => {
    expect(safeRelativePath("api-docs.json")).toBe("api-docs.json");
  });
  it("safeRelativePath single segment schema-gen", () => {
    expect(safeRelativePath("schema-gen.json")).toBe("schema-gen.json");
  });
  it("safeRelativePath single segment migration-tool", () => {
    expect(safeRelativePath("migration-tool.json")).toBe("migration-tool.json");
  });
  it("safeRelativePath single segment backup-restore", () => {
    expect(safeRelativePath("backup-restore.json")).toBe("backup-restore.json");
  });
  it("safeRelativePath single segment cache-clear", () => {
    expect(safeRelativePath("cache-clear.json")).toBe("cache-clear.json");
  });
  it("safeRelativePath single segment config-sync", () => {
    expect(safeRelativePath("config-sync.json")).toBe("config-sync.json");
  });
  it("safeRelativePath single segment env-manager", () => {
    expect(safeRelativePath("env-manager.json")).toBe("env-manager.json");
  });
  it("safeRelativePath single segment secret-rotate", () => {
    expect(safeRelativePath("secret-rotate.json")).toBe("secret-rotate.json");
  });
  it("safeRelativePath single segment token-refresh", () => {
    expect(safeRelativePath("token-refresh.json")).toBe("token-refresh.json");
  });
  it("safeRelativePath single segment oauth-flow", () => {
    expect(safeRelativePath("oauth-flow.json")).toBe("oauth-flow.json");
  });
  it("safeRelativePath single segment webhook-relay", () => {
    expect(safeRelativePath("webhook-relay.json")).toBe("webhook-relay.json");
  });
  it("safeRelativePath single segment queue-worker", () => {
    expect(safeRelativePath("queue-worker.json")).toBe("queue-worker.json");
  });
  it("safeRelativePath single segment batch-processor", () => {
    expect(safeRelativePath("batch-processor.json")).toBe(
      "batch-processor.json",
    );
  });
  it("safeRelativePath single segment stream-handler", () => {
    expect(safeRelativePath("stream-handler.json")).toBe("stream-handler.json");
  });
});
