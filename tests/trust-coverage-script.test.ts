import { describe, expect, it } from "vitest";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";

import { repoRoot } from "./helpers/registry-fixtures";

const scriptPath = path.join(repoRoot, "scripts/report-trust-coverage.mjs");

function writeMcpEntry(
  root: string,
  slug: string,
  options: { safety?: boolean; privacy?: boolean; attributed?: boolean } = {},
) {
  const dir = path.join(root, "content/mcp");
  fs.mkdirSync(dir, { recursive: true });
  const notes = [
    options.attributed ? `authorProfileUrl: https://github.com/example` : "",
    options.safety
      ? `safetyNotes:\n  - Runs as a local MCP server and should be granted only the account permissions required for testing.`
      : "",
    options.privacy
      ? `privacyNotes:\n  - Can pass selected user prompts and account data through the connected MCP client.`
      : "",
  ]
    .filter(Boolean)
    .join("\n");
  fs.writeFileSync(
    path.join(dir, `${slug}.mdx`),
    `---
title: ${slug}
slug: ${slug}
category: mcp
description: Test MCP entry.
sourceUrl: https://github.com/example/${slug}
${notes}
---

Test MCP body.
`,
    "utf8",
  );
}

function runTrustCoverage(args: string[]) {
  return spawnSync(process.execPath, [scriptPath, ...args], {
    cwd: repoRoot,
    encoding: "utf8",
  });
}

describe("trust coverage report script", () => {
  it("honors an explicit output path", () => {
    const tmpDir = fs.mkdtempSync(
      path.join(os.tmpdir(), "heyclaude-trust-output-"),
    );
    writeMcpEntry(tmpDir, "covered-mcp", { safety: true, privacy: true });
    const outputPath = path.join(tmpDir, "mcp-trust.json");

    const result = runTrustCoverage([
      "--repo-root",
      tmpDir,
      "--category",
      "mcp",
      "--output",
      outputPath,
    ]);

    expect(result.status).toBe(0);
    expect(fs.existsSync(outputPath)).toBe(true);
    expect(JSON.parse(fs.readFileSync(outputPath, "utf8"))).toMatchObject({
      summary: {
        riskBearing: {
          withSafetyAndPrivacy: 1,
          missing: 0,
          coveragePct: 100,
        },
      },
    });
  });

  it("fails check mode when risk coverage is below the threshold", () => {
    const tmpDir = fs.mkdtempSync(
      path.join(os.tmpdir(), "heyclaude-trust-check-"),
    );
    writeMcpEntry(tmpDir, "missing-notes");

    const result = runTrustCoverage([
      "--repo-root",
      tmpDir,
      "--category",
      "mcp",
      "--check",
      "--min-risk-coverage",
      "100",
    ]);

    expect(result.status).toBe(1);
    expect(result.stderr).toContain("below required 100%");
    expect(
      fs.existsSync(path.join(tmpDir, "reports/trust-coverage/mcp.json")),
    ).toBe(false);
  });

  it("fails check mode when attribution coverage is below the threshold", () => {
    const tmpDir = fs.mkdtempSync(
      path.join(os.tmpdir(), "heyclaude-trust-attribution-"),
    );
    writeMcpEntry(tmpDir, "safe-but-unattributed", {
      safety: true,
      privacy: true,
    });

    const result = runTrustCoverage([
      "--repo-root",
      tmpDir,
      "--category",
      "mcp",
      "--check",
      "--min-attribution-coverage",
      "100",
    ]);

    expect(result.status).toBe(1);
    expect(result.stderr).toContain(
      "Attribution coverage 0% is below required 100%",
    );
    expect(
      fs.existsSync(path.join(tmpDir, "reports/trust-coverage/mcp.json")),
    ).toBe(false);
  });

  it("does not write the default report in successful check mode", () => {
    const tmpDir = fs.mkdtempSync(
      path.join(os.tmpdir(), "heyclaude-trust-clean-check-"),
    );
    writeMcpEntry(tmpDir, "covered-mcp", { safety: true, privacy: true });

    const result = runTrustCoverage([
      "--repo-root",
      tmpDir,
      "--category",
      "mcp",
      "--check",
      "--min-risk-coverage",
      "100",
    ]);

    expect(result.status).toBe(0);
    expect(result.stdout).toContain("Check mode: no report file written.");
    expect(
      fs.existsSync(path.join(tmpDir, "reports/trust-coverage/mcp.json")),
    ).toBe(false);
  });

  it("keeps live MCP content at full trust coverage", () => {
    const result = runTrustCoverage([
      "--category",
      "mcp",
      "--check",
      "--min-risk-coverage",
      "100",
    ]);

    expect(result.status).toBe(0);
    expect(result.stdout).toContain("with safety + privacy notes: 318 (100%)");
    expect(result.stdout).toContain(
      "Provenance (all 318): source-backed 100%, attributed 100%",
    );
  });
});
