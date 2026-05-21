import { execFileSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { describe, expect, it } from "vitest";

import { repoRoot } from "./helpers/registry-fixtures";

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
    const tmpDir = fs.mkdtempSync(
      path.join(os.tmpdir(), "heyclaude-content-validation-"),
    );
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
    const tmpDir = fs.mkdtempSync(
      path.join(os.tmpdir(), "heyclaude-content-validation-"),
    );
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
});
