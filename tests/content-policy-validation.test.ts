import { execFileSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { describe, expect, it } from "vitest";

import { repoRoot } from "./helpers/registry-fixtures";

function runContentPolicy(
  tmpDir: string,
  content: string,
  sourceType = "same_repo_direct",
  files = [
    {
      filename: "content/tools/example-tool.mdx",
      status: "added",
      content,
    },
  ],
) {
  const filesJson = path.join(tmpDir, "files.json");
  const outputJson = path.join(tmpDir, "policy-output.json");
  fs.writeFileSync(filesJson, JSON.stringify(files), "utf8");

  const args = [
    path.join(repoRoot, "scripts/ci/validate-content-policy.mjs"),
    "--repo-root",
    repoRoot,
    "--files-json",
    filesJson,
    "--output",
    outputJson,
    "--source-type",
    sourceType,
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

  it("allows maintainer-owned content to reference HeyClaude-hosted downloads when disclosures are present", () => {
    const tmpDir = fs.mkdtempSync(
      path.join(os.tmpdir(), "heyclaude-content-policy-"),
    );
    const content = `---
title: Example Tool
category: tools
description: Example maintainer-owned package fixture.
downloadUrl: /downloads/skills/example-skill.zip
submittedBy: JSONbored
submittedByUrl: https://github.com/JSONbored
safetyNotes:
  - Downloads a maintainer-built archive into the current working directory.
privacyNotes:
  - Do not include private data in generated drafts.
---

Example body.
`;

    const result = runContentPolicy(tmpDir, content);

    expect(result.status).toBe(0);
    const output = JSON.parse(fs.readFileSync(result.outputJson, "utf8"));
    expect(output).toMatchObject({
      ok: true,
      sourceType: "same_repo_direct",
    });
    expect(output.reviewFlags).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ id: "community_local_download_request" }),
      ]),
    );
  });

  it("does not fail mixed same-repository maintenance PRs as direct submissions", () => {
    const tmpDir = fs.mkdtempSync(
      path.join(os.tmpdir(), "heyclaude-content-policy-"),
    );
    const content = `---
title: Example MCP
category: mcp
description: Example maintainer metadata migration fixture.
sourceUrl: https://github.com/example/example-mcp
installCommand: npx example-mcp --api-key $EXAMPLE_API_KEY
submittedBy: JSONbored
submittedByUrl: https://github.com/JSONbored
sourceSubmissionNumber: 123
---

Example body.
`;

    const result = runContentPolicy(tmpDir, content, "same_repo_direct", [
      {
        filename: "content/mcp/example-mcp.mdx",
        status: "modified",
        content,
      },
      {
        filename: "packages/registry/src/content-schema.js",
        status: "modified",
        content: "export const schema = {};",
      },
    ]);

    expect(result.status).toBe(0);
    const output = JSON.parse(fs.readFileSync(result.outputJson, "utf8"));
    expect(output).toMatchObject({
      ok: true,
      sourceType: "same_repo_direct",
    });
    expect(output.requestChangesReasons).toEqual([]);
    expect(output.classificationWarnings).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ id: "missing_privacy_notes" }),
      ]),
    );
  });

  it("still blocks external content PRs that request HeyClaude-hosted downloads", () => {
    const tmpDir = fs.mkdtempSync(
      path.join(os.tmpdir(), "heyclaude-content-policy-"),
    );
    const content = `---
title: Example Tool
category: tools
description: Example external package fixture.
downloadUrl: /downloads/skills/example-skill.zip
submittedBy: contributor
submittedByUrl: https://github.com/contributor
safetyNotes:
  - Downloads a package archive into the current working directory.
privacyNotes:
  - Do not include private data in generated drafts.
---

Example body.
`;

    const result = runContentPolicy(tmpDir, content, "external_direct");

    expect(result.status).not.toBe(0);
    const output = JSON.parse(fs.readFileSync(result.outputJson, "utf8"));
    expect(output.failures).toEqual(
      expect.arrayContaining([
        expect.stringContaining("community_local_download_request"),
      ]),
    );
  });

  it("fails external content PRs that include referral or affiliate source URLs", () => {
    const tmpDir = fs.mkdtempSync(
      path.join(os.tmpdir(), "heyclaude-content-policy-"),
    );
    const content = `---
title: Example Tool
category: tools
description: Example external referral fixture.
websiteUrl: https://example.com/products/assistant?ref=creator
sourceUrl: https://github.com/example/example-tool
submittedBy: contributor
submittedByUrl: https://github.com/contributor
---

Example body.
`;

    const result = runContentPolicy(tmpDir, content, "external_direct");

    expect(result.status).not.toBe(0);
    const output = JSON.parse(fs.readFileSync(result.outputJson, "utf8"));
    expect(output.failures).toEqual(
      expect.arrayContaining([
        expect.stringContaining("affiliate_referral_url"),
      ]),
    );
  });

  it("fails external content PRs that hide referral paths without query params", () => {
    const tmpDir = fs.mkdtempSync(
      path.join(os.tmpdir(), "heyclaude-content-policy-"),
    );
    const content = `---
title: Example Tool
category: tools
description: Example external referral path fixture.
websiteUrl: https://example.com/ref
sourceUrl: https://github.com/example/example-tool
submittedBy: contributor
submittedByUrl: https://github.com/contributor
---

Example body.
`;

    const result = runContentPolicy(tmpDir, content, "external_direct");

    expect(result.status).not.toBe(0);
    const output = JSON.parse(fs.readFileSync(result.outputJson, "utf8"));
    expect(output.failures).toEqual(
      expect.arrayContaining([
        expect.stringContaining("affiliate_referral_url"),
      ]),
    );
  });

  it("fails direct content PRs with category/path mismatch", () => {
    const tmpDir = fs.mkdtempSync(
      path.join(os.tmpdir(), "heyclaude-content-policy-"),
    );
    const content = `---
title: Example Guide
category: tools
description: Example mismatched category fixture.
sourceUrl: https://github.com/example/example-guide
submittedBy: contributor
submittedByUrl: https://github.com/contributor
---

Example body.
`;

    const result = runContentPolicy(tmpDir, content, "external_direct", [
      {
        filename: "content/guides/example-guide.mdx",
        status: "added",
        content,
      },
    ]);

    expect(result.status).not.toBe(0);
    const output = JSON.parse(fs.readFileSync(result.outputJson, "utf8"));
    expect(output.failures).toEqual(
      expect.arrayContaining([
        expect.stringContaining("category_path_mismatch"),
      ]),
    );
  });

  it("fails external content PRs that set packageVerified", () => {
    const tmpDir = fs.mkdtempSync(
      path.join(os.tmpdir(), "heyclaude-content-policy-"),
    );
    const content = `---
title: Example MCP
category: mcp
description: Example package verification abuse fixture.
sourceUrl: https://github.com/example/example-mcp
packageVerified: true
submittedBy: contributor
submittedByUrl: https://github.com/contributor
---

Example body.
`;

    const result = runContentPolicy(tmpDir, content, "external_direct", [
      {
        filename: "content/mcp/example-mcp.mdx",
        status: "added",
        content,
      },
    ]);

    expect(result.status).not.toBe(0);
    const output = JSON.parse(fs.readFileSync(result.outputJson, "utf8"));
    expect(output.failures).toEqual(
      expect.arrayContaining([
        expect.stringContaining("unsafe_package_verified_true"),
      ]),
    );
  });

  it("fails external content PRs that edit generated artifacts", () => {
    const tmpDir = fs.mkdtempSync(
      path.join(os.tmpdir(), "heyclaude-content-policy-"),
    );
    const content = `---
title: Example Tool
category: tools
description: Example generated artifact fixture.
sourceUrl: https://github.com/example/example-tool
submittedBy: contributor
submittedByUrl: https://github.com/contributor
---

Example body.
`;

    const result = runContentPolicy(tmpDir, content, "external_direct", [
      {
        filename: "content/tools/example-tool.mdx",
        status: "added",
        content,
      },
      {
        filename: "apps/web/public/data/directory.json",
        status: "modified",
        content: "{}",
      },
      {
        filename: "README.md",
        status: "modified",
        content: "# Edited README\n",
      },
    ]);

    expect(result.status).not.toBe(0);
    const output = JSON.parse(fs.readFileSync(result.outputJson, "utf8"));
    expect(output.failures).toEqual(
      expect.arrayContaining([
        expect.stringContaining("generated_registry_artifact_change"),
        expect.stringContaining("generated_readme_change"),
      ]),
    );
  });

  it("does not hard-fail defensive security hooks for secret-related wording alone", () => {
    const tmpDir = fs.mkdtempSync(
      path.join(os.tmpdir(), "heyclaude-content-policy-"),
    );
    const content = `---
title: Environment Leak Warning Hook
category: hooks
description: Defensive hook that warns before commands dump tokens or harvest credentials from shell output.
sourceUrl: https://docs.anthropic.com/en/docs/claude-code/hooks
submittedBy: contributor
submittedByUrl: https://github.com/contributor
safetyNotes:
  - Inspects command text before execution and blocks risky output patterns.
privacyNotes:
  - Does not read secret values or send command text to third parties.
---

This hook detects commands that dump tokens or harvest credentials and blocks
them before they run. It is defensive guidance for preventing accidental leaks.
`;

    const result = runContentPolicy(tmpDir, content, "external_direct", [
      {
        filename: "content/hooks/environment-leak-warning-hook.mdx",
        status: "added",
        content,
      },
    ]);

    expect(result.status).toBe(0);
    const output = JSON.parse(fs.readFileSync(result.outputJson, "utf8"));
    expect(output.reviewFlags).not.toEqual(
      expect.arrayContaining([
        expect.objectContaining({ id: "malicious_data_theft_capability" }),
      ]),
    );
  });

  it("routes commercial API relay submissions out of the free content queue", () => {
    const tmpDir = fs.mkdtempSync(
      path.join(os.tmpdir(), "heyclaude-content-policy-"),
    );
    const content = `---
title: CoderPlan LLM API Relay
category: tools
description: Pay-per-use LLM API relay for routing paid model requests through a hosted API gateway.
sourceUrl: https://example.com/coderplan
websiteUrl: https://example.com/coderplan/pricing
submittedBy: contributor
submittedByUrl: https://github.com/contributor
---

This commercial API relay sells credits and billing-backed access to multiple
LLM providers through a proxy gateway.
`;

    const result = runContentPolicy(tmpDir, content, "external_direct", [
      {
        filename: "content/tools/coderplan.mdx",
        status: "added",
        content,
      },
    ]);

    expect(result.status).not.toBe(0);
    const output = JSON.parse(fs.readFileSync(result.outputJson, "utf8"));
    expect(output.failures).toEqual(
      expect.arrayContaining([
        expect.stringContaining("commercial_listing_route"),
      ]),
    );
  });
});
