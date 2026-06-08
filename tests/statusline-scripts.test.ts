import { execFileSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { describe, expect, it } from "vitest";

import { parseSafeFrontmatter } from "@heyclaude/registry/frontmatter";

import { repoRoot } from "./helpers/registry-fixtures";

function readScriptBody(relativePath: string) {
  const source = fs.readFileSync(path.join(repoRoot, relativePath), "utf8");
  const { data } = parseSafeFrontmatter(source);
  return String(data.scriptBody ?? "");
}

function writeExecutableTempScript(scriptBody: string) {
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "heyclaude-statusline-"));
  const scriptPath = path.join(tmpDir, "statusline.sh");
  fs.writeFileSync(scriptPath, scriptBody, { encoding: "utf8", mode: 0o700 });
  return { scriptPath, tmpDir };
}

describe("statusline scripts", () => {
  it("rejects multiline token counters before Bash arithmetic evaluation", () => {
    const scriptBody = readScriptBody(
      "content/statuslines/context-pressure-statusline.mdx",
    );
    const { scriptPath, tmpDir } = writeExecutableTempScript(scriptBody);
    const markerPath = path.join(tmpDir, "marker");
    const payload = JSON.stringify({
      session: {
        totalTokens: `123\n+limit[$(printf pwned > ${markerPath})]`,
      },
    });

    const output = execFileSync("bash", [scriptPath], {
      input: `${payload}\n`,
      encoding: "utf8",
    });

    expect(output).toBe("context: 0/200000 | 0% | ok\n");
    expect(fs.existsSync(markerPath)).toBe(false);
  });
});
