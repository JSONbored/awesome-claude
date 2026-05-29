import { execFileSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { describe, expect, it } from "vitest";

import { repoRoot } from "./helpers/registry-fixtures";

function makeTempContentRoot() {
  return fs.mkdtempSync(
    path.join(os.tmpdir(), "heyclaude-content-validation-"),
  );
}

function writeHookFixture(tmpDir: string, scriptBody: string) {
  const hookDir = path.join(tmpDir, "content", "hooks");
  fs.mkdirSync(hookDir, { recursive: true });
  fs.writeFileSync(
    path.join(hookDir, "example-hook.mdx"),
    `---
title: Example Hook
slug: example-hook
category: hooks
description: Example hook used by validation tests.
cardDescription: Example hook used by validation tests.
scriptLanguage: bash
scriptBody: |-
${scriptBody
  .split("\n")
  .map((line) => `  ${line}`)
  .join("\n")}
---

Example hook body.
`,
    "utf8",
  );
}

function runContentValidation(tmpDir: string) {
  return execFileSync(
    process.execPath,
    [path.join(repoRoot, "scripts/validate-content.mjs"), "--category", "hooks"],
    {
      cwd: tmpDir,
      encoding: "utf8",
      stdio: "pipe",
    },
  );
}

describe("content validation", () => {
  it("rejects hook scriptBody values that are not valid bash", () => {
    const tmpDir = makeTempContentRoot();
    writeHookFixture(
      tmpDir,
      [
        "#!/bin/bash",
        "printf '%s' \"$ACCUMULATED\" | python3 -c '",
        "print(\"the user's dashboard\")",
        "'",
      ].join("\n"),
    );

    expect(() => runContentValidation(tmpDir)).toThrow(
      /scriptBody failed bash syntax check/,
    );
  });

  it("accepts hook scriptBody values that are valid bash", () => {
    const tmpDir = makeTempContentRoot();
    writeHookFixture(
      tmpDir,
      [
        "#!/bin/bash",
        "printf '%s' \"$ACCUMULATED\" | python3 -c '",
        "print(\"the user dashboard\")",
        "'",
      ].join("\n"),
    );

    expect(runContentValidation(tmpDir)).toContain("Content validation passed.");
  });

  it("rejects predictable shared /tmp debug logs in hook script bodies", () => {
    const tmpDir = makeTempContentRoot();
    writeHookFixture(
      tmpDir,
      [
        "#!/bin/bash",
        'DEBUG_LOG="/tmp/claude-hook-debug.log"',
        'printf "%s\\n" "$CLAUDE_CODE_SESSION" >> "$DEBUG_LOG"',
      ].join("\n"),
    );

    expect(() => runContentValidation(tmpDir)).toThrow(
      /scriptBody uses predictable shared \/tmp debug log path -> \/tmp\/claude-hook-debug\.log/,
    );
  });

  it("accepts hook debug logs kept under a user-private directory", () => {
    const tmpDir = makeTempContentRoot();
    writeHookFixture(
      tmpDir,
      [
        "#!/bin/bash",
        'DEBUG_LOG_DIR="${HOME}/.claude/metrics"',
        'mkdir -p "$DEBUG_LOG_DIR"',
        'DEBUG_LOG="$DEBUG_LOG_DIR/hook-debug.log"',
        'printf "%s\\n" "$CLAUDE_CODE_SESSION" >> "$DEBUG_LOG"',
      ].join("\n"),
    );

    expect(runContentValidation(tmpDir)).toContain("Content validation passed.");
  });

  it("accepts hook debug logs with unpredictable temporary filenames", () => {
    const tmpDir = makeTempContentRoot();
    writeHookFixture(
      tmpDir,
      [
        "#!/bin/bash",
        'DEBUG_LOG="$(mktemp /tmp/claude-hook-debug.XXXXXX)"',
        'trap \'rm -f "$DEBUG_LOG"\' EXIT',
        'printf "%s\\n" "debug event" >> "$DEBUG_LOG"',
      ].join("\n"),
    );

    expect(runContentValidation(tmpDir)).toContain("Content validation passed.");
  });
});
