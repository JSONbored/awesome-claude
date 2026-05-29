import { execFileSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { describe, expect, it } from "vitest";

import { repoRoot } from "./helpers/registry-fixtures";

function runContentPolicy(tmpDir: string, content: string) {
  const filesJson = path.join(tmpDir, "files.json");
  const outputJson = path.join(tmpDir, "policy-output.json");
  fs.writeFileSync(
    filesJson,
    JSON.stringify([
      {
        filename: "content/tools/example-tool.mdx",
        status: "added",
        content,
      },
    ]),
    "utf8",
  );

  const args = [
    path.join(repoRoot, "scripts/ci/validate-content-policy.mjs"),
    "--repo-root",
    repoRoot,
    "--files-json",
    filesJson,
    "--output",
    outputJson,
    "--source-type",
    "same_repo_direct",
  ];

  try {
    const stdout = execFileSync(process.execPath, args, {
      cwd: repoRoot,
      encoding: "utf8",
      stdio: "pipe",
    });
    return { status: 0, stdout, outputJson };
  } catch (error) {
    const execError = error as {
      status?: number;
      stdout?: string;
      stderr?: string;
    };
    const status = typeof execError.status === "number" ? execError.status : 1;
    const stdout = typeof execError.stdout === "string" ? execError.stdout : "";
    const stderr = typeof execError.stderr === "string" ? execError.stderr : "";
    return { status, stdout, stderr, outputJson };
  }
}

describe("content policy validation", () => {
  it("parses normal YAML frontmatter", () => {
    const tmpDir = fs.mkdtempSync(
      path.join(os.tmpdir(), "heyclaude-content-policy-"),
    );
    const result = runContentPolicy(
      tmpDir,
      `---
title: Example Tool
category: tools
description: Example policy validation fixture.
sourceUrl: https://github.com/example/example-tool
submittedBy: tester
submittedByUrl: https://github.com/tester
---

Example body.
`,
    );

    expect(result.status).toBe(0);
    expect(result.stdout).toContain("HeyClaude content policy passed.");
    expect(
      JSON.parse(fs.readFileSync(result.outputJson, "utf8")),
    ).toMatchObject({ ok: true });
  });

  it("rejects JavaScript frontmatter without executing it", () => {
    const tmpDir = fs.mkdtempSync(
      path.join(os.tmpdir(), "heyclaude-content-policy-"),
    );
    const markerPath = path.join(tmpDir, "frontmatter-executed");
    const result = runContentPolicy(
      tmpDir,
      `---js
require("node:fs").writeFileSync(${JSON.stringify(markerPath)}, "owned");
process.exit(0)
---

Example body.
`,
    );

    expect(result.status).not.toBe(0);
    expect(fs.existsSync(markerPath)).toBe(false);
    expect(fs.existsSync(result.outputJson)).toBe(true);
    const output = JSON.parse(fs.readFileSync(result.outputJson, "utf8"));
    expect(output.ok).toBe(false);
    expect(output.reviewFlags).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ id: "invalid_frontmatter" }),
      ]),
    );
  });
});
