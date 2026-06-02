import { execFileSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { afterEach, describe, expect, it } from "vitest";

import { repoRoot } from "./helpers/registry-fixtures";

const tempDirs: string[] = [];

function git(cwd: string, args: string[]) {
  return execFileSync("git", args, { cwd, encoding: "utf8" }).trim();
}

function parseOutput(output: string) {
  return Object.fromEntries(
    output
      .trim()
      .split(/\r?\n/)
      .filter(Boolean)
      .map((line) => {
        const separator = line.indexOf("=");
        return [line.slice(0, separator), line.slice(separator + 1)];
      }),
  );
}

function createFixtureRepo() {
  const cwd = fs.mkdtempSync(path.join(os.tmpdir(), "heyclaude-classify-"));
  tempDirs.push(cwd);

  git(cwd, ["init", "--initial-branch=main"]);
  git(cwd, ["config", "user.email", "test@example.com"]);
  git(cwd, ["config", "user.name", "Test User"]);
  git(cwd, ["config", "commit.gpgsign", "false"]);
  fs.writeFileSync(path.join(cwd, "README.md"), "# fixture\n");
  git(cwd, ["add", "README.md"]);
  git(cwd, ["commit", "-m", "init"]);

  return {
    cwd,
    baseSha: git(cwd, ["rev-parse", "HEAD"]),
  };
}

function runClassifier(
  cwd: string,
  baseSha: string,
  extraEnv: Record<string, string> = {},
) {
  const outputPath = path.join(cwd, "github-output.txt");
  execFileSync(
    "node",
    [path.join(repoRoot, "scripts/ci/classify-pr-changes.mjs")],
    {
      cwd,
      env: {
        ...process.env,
        GITHUB_HEAD_REF: "contributor/source-entry",
        HEAD_REF: "contributor/source-entry",
        ...extraEnv,
        BASE_SHA: baseSha,
        GITHUB_EVENT_NAME: "pull_request",
        GITHUB_OUTPUT: outputPath,
      },
      encoding: "utf8",
    },
  );

  return parseOutput(fs.readFileSync(outputPath, "utf8"));
}

describe("PR change classifier", () => {
  afterEach(() => {
    for (const dir of tempDirs.splice(0)) {
      fs.rmSync(dir, { force: true, recursive: true });
    }
  });

  it("routes direct content entry PRs through the focused submission lane", () => {
    const { cwd, baseSha } = createFixtureRepo();

    const contentDir = path.join(cwd, "content", "agents");
    fs.mkdirSync(contentDir, { recursive: true });
    fs.writeFileSync(
      path.join(contentDir, "example.mdx"),
      "---\ntitle: Example\n---\n",
    );
    git(cwd, ["add", "content/agents/example.mdx"]);
    git(cwd, ["commit", "-m", "add content entry"]);

    const outputs = runClassifier(cwd, baseSha);
    expect(outputs).toMatchObject({
      content: "true",
      content_agents: "true",
      direct_submission: "true",
      source_content_only: "true",
      readme_only: "false",
      registry: "false",
      raycast: "false",
      web: "false",
    });
  });

  it("routes README-only refresh PRs through registry contract validation without content review", () => {
    const { cwd, baseSha } = createFixtureRepo();

    fs.writeFileSync(path.join(cwd, "README.md"), "# refreshed\n");
    git(cwd, ["add", "README.md"]);
    git(cwd, ["commit", "-m", "refresh readme"]);

    const outputs = runClassifier(cwd, baseSha, {
      GITHUB_HEAD_REF: "automation/readme-refresh",
    });
    expect(outputs).toMatchObject({
      readme_only: "true",
      direct_submission: "false",
      source_content_only: "false",
      content: "false",
      registry: "true",
      docs: "true",
      web: "false",
      raycast: "false",
    });
  });

  it("routes direct PR submission automation changes through full owned validation lanes", () => {
    const { cwd, baseSha } = createFixtureRepo();
    const scriptDir = path.join(cwd, "scripts");
    fs.mkdirSync(scriptDir, { recursive: true });
    fs.writeFileSync(
      path.join(scriptDir, "analyze-submission-risk.mjs"),
      "console.log('changed');\n",
    );
    git(cwd, ["add", "scripts/analyze-submission-risk.mjs"]);
    git(cwd, ["commit", "-m", "update submission automation"]);

    const outputs = runClassifier(cwd, baseSha);
    expect(outputs).toMatchObject({
      ci: "true",
      content: "false",
      registry: "true",
      web: "true",
    });
  });

  it("routes private submission gate changes through the gate lane", () => {
    const { cwd, baseSha } = createFixtureRepo();
    const gateDir = path.join(cwd, "apps", "submission-gate", "src");
    fs.mkdirSync(gateDir, { recursive: true });
    fs.writeFileSync(path.join(gateDir, "index.ts"), "export default {};\n");
    git(cwd, ["add", "apps/submission-gate/src/index.ts"]);
    git(cwd, ["commit", "-m", "update submission gate"]);

    const outputs = runClassifier(cwd, baseSha);
    expect(outputs).toMatchObject({
      submission_gate: "true",
      content: "false",
      registry: "false",
      web: "false",
    });
  });
});
