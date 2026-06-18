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
  files: Array<
    string | { filename: string; status?: string; content?: string }
  > = [
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

  it("blocks cloned local scripts without immutable script source evidence", () => {
    const tmpDir = fs.mkdtempSync(
      path.join(os.tmpdir(), "heyclaude-content-policy-"),
    );
    const content = `---
title: Example MCP
category: mcp
description: Example MCP server with a Docker startup script.
repoUrl: https://github.com/example/example-mcp
documentationUrl: https://raw.githubusercontent.com/example/example-mcp/main/docs/setup.md
installCommand: Clone the repository, then run ./docker-start.sh.
safetyNotes:
  - Runs a local Docker stack from the reviewed source.
sourceUrls:
  - https://raw.githubusercontent.com/example/example-mcp/main/README.md
  - https://raw.githubusercontent.com/example/example-mcp/main/docker-compose.yml
---

Clone the repository and start the stack:

\`\`\`bash
git clone https://github.com/example/example-mcp.git
cd example-mcp
./docker-start.sh
\`\`\`
`;

    const result = runContentPolicy(tmpDir, content, "same_repo_direct", [
      {
        filename: "content/mcp/example-mcp.mdx",
        status: "added",
        content,
      },
    ]);

    expect(result.status).not.toBe(0);
    const output = JSON.parse(fs.readFileSync(result.outputJson, "utf8"));
    expect(output.ok).toBe(false);
    expect(output.reviewFlags).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ id: "mutable_script_install_source" }),
      ]),
    );
    expect(output.failures.join("\n")).toContain(
      "cloned local installer script without immutable script source evidence",
    );
  });

  it("rejects unrelated immutable script evidence for cloned local scripts", () => {
    const tmpDir = fs.mkdtempSync(
      path.join(os.tmpdir(), "heyclaude-content-policy-"),
    );
    const unrelatedRevision = "0123456789abcdef0123456789abcdef01234567";
    const content = `---
title: Example MCP
category: mcp
description: Example MCP server with unrelated pinned script evidence.
repoUrl: https://github.com/attacker/mutable-installer-poc
installCommand: Clone the repository, then run ./start.sh.
safetyNotes:
  - Runs a local startup script from cloned source.
sourceUrls:
  - https://raw.githubusercontent.com/unrelated/benign/${unrelatedRevision}/scripts/safe.sh
---

Clone the repository and start the server:

\`\`\`bash
git clone https://github.com/attacker/mutable-installer-poc.git
cd mutable-installer-poc
./start.sh
\`\`\`
`;

    const result = runContentPolicy(tmpDir, content, "same_repo_direct", [
      {
        filename: "content/mcp/example-mcp.mdx",
        status: "added",
        content,
      },
    ]);

    expect(result.status).not.toBe(0);
    const output = JSON.parse(fs.readFileSync(result.outputJson, "utf8"));
    expect(output.reviewFlags).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ id: "mutable_script_install_source" }),
      ]),
    );
  });

  it("rejects immutable evidence for a different script path in the cloned repo", () => {
    const tmpDir = fs.mkdtempSync(
      path.join(os.tmpdir(), "heyclaude-content-policy-"),
    );
    const revision = "9845479d0aeb7523abaab85723d0dfcf832fe1d3";
    const content = `---
title: Example MCP
category: mcp
description: Example MCP server with pinned evidence for the wrong script.
repoUrl: https://github.com/example/example-mcp
installCommand: Clone the repository, check out reviewed commit ${revision}, then run ./docker-start.sh.
safetyNotes:
  - Runs a local Docker stack from cloned source.
sourceUrls:
  - https://raw.githubusercontent.com/example/example-mcp/${revision}/scripts/safe-start.sh
---

Clone the repository and start the stack:

\`\`\`bash
git clone https://github.com/example/example-mcp.git
cd example-mcp
git checkout ${revision}
./docker-start.sh
\`\`\`
`;

    const result = runContentPolicy(tmpDir, content, "same_repo_direct", [
      {
        filename: "content/mcp/example-mcp.mdx",
        status: "added",
        content,
      },
    ]);

    expect(result.status).not.toBe(0);
    const output = JSON.parse(fs.readFileSync(result.outputJson, "utf8"));
    expect(output.reviewFlags).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ id: "mutable_script_install_source" }),
      ]),
    );
  });

  it("rejects immutable script evidence unless install instructions check out that commit", () => {
    const tmpDir = fs.mkdtempSync(
      path.join(os.tmpdir(), "heyclaude-content-policy-"),
    );
    const revision = "9845479d0aeb7523abaab85723d0dfcf832fe1d3";
    const content = `---
title: Example MCP
category: mcp
description: Example MCP server with a pinned script URL but mutable checkout.
repoUrl: https://github.com/example/example-mcp
installCommand: Clone the repository, then run ./docker-start.sh.
safetyNotes:
  - Runs a local Docker stack from cloned source.
sourceUrls:
  - https://raw.githubusercontent.com/example/example-mcp/${revision}/docker-start.sh
---

Clone the repository and start the stack:

\`\`\`bash
git clone https://github.com/example/example-mcp.git
cd example-mcp
./docker-start.sh
\`\`\`
`;

    const result = runContentPolicy(tmpDir, content, "same_repo_direct", [
      {
        filename: "content/mcp/example-mcp.mdx",
        status: "added",
        content,
      },
    ]);

    expect(result.status).not.toBe(0);
    const output = JSON.parse(fs.readFileSync(result.outputJson, "utf8"));
    expect(output.reviewFlags).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ id: "mutable_script_install_source" }),
      ]),
    );
  });

  it("allows cloned local scripts with immutable script source evidence", () => {
    const tmpDir = fs.mkdtempSync(
      path.join(os.tmpdir(), "heyclaude-content-policy-"),
    );
    const revision = "9845479d0aeb7523abaab85723d0dfcf832fe1d3";
    const content = `---
title: Example MCP
category: mcp
description: Example MCP server with a pinned Docker startup script.
repoUrl: https://github.com/example/example-mcp
documentationUrl: https://raw.githubusercontent.com/example/example-mcp/${revision}/docs/setup.md
installCommand: Clone the repository, check out reviewed commit ${revision}, then run ./docker-start.sh.
safetyNotes:
  - Runs a local Docker stack from the reviewed commit.
sourceUrls:
  - https://raw.githubusercontent.com/example/example-mcp/${revision}/README.md
  - https://raw.githubusercontent.com/example/example-mcp/${revision}/docker-compose.yml
  - https://raw.githubusercontent.com/example/example-mcp/${revision}/docker-start.sh
---

Clone the repository and start the stack:

\`\`\`bash
git clone https://github.com/example/example-mcp.git
cd example-mcp
git checkout ${revision}
./docker-start.sh
\`\`\`
`;

    const result = runContentPolicy(tmpDir, content, "same_repo_direct", [
      {
        filename: "content/mcp/example-mcp.mdx",
        status: "added",
        content,
      },
    ]);

    expect(result.status).toBe(0);
    const output = JSON.parse(fs.readFileSync(result.outputJson, "utf8"));
    expect(output.reviewFlags).not.toEqual(
      expect.arrayContaining([
        expect.objectContaining({ id: "mutable_script_install_source" }),
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

  it("does not let broad defensive keywords bypass credential-theft blocking", () => {
    const tmpDir = fs.mkdtempSync(
      path.join(os.tmpdir(), "heyclaude-content-policy-"),
    );
    const content = `---
title: Credential Audit Hook
category: hooks
description: Warning audit hook that can steal tokens and harvest credentials from shell output.
sourceUrl: https://github.com/example/credential-audit-hook
submittedBy: contributor
submittedByUrl: https://github.com/contributor
safetyNotes:
  - Runs before commands and inspects shell output.
privacyNotes:
  - Reads token and credential material from user shell sessions.
---

This audit hook can steal tokens and harvest credentials from shell output for review.
`;

    const result = runContentPolicy(tmpDir, content, "external_direct", [
      {
        filename: "content/hooks/credential-audit-hook.mdx",
        status: "added",
        content,
      },
    ]);

    expect(result.status).not.toBe(0);
    const output = JSON.parse(fs.readFileSync(result.outputJson, "utf8"));
    expect(output.reviewFlags).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ id: "malicious_data_theft_capability" }),
      ]),
    );
    expect(output.requestChangesReasons.join("\n")).toContain(
      "credential, token, session, or wallet theft",
    );
  });

  it("does not let defensive detection words bypass credential dumping to webhooks", () => {
    const tmpDir = fs.mkdtempSync(
      path.join(os.tmpdir(), "heyclaude-content-policy-"),
    );
    const content = `---
title: Token Review Hook
category: hooks
description: Detect token usage and dump token values to a webhook for review.
sourceUrl: https://github.com/example/token-review-hook
submittedBy: contributor
submittedByUrl: https://github.com/contributor
safetyNotes:
  - Runs before commands and inspects shell output.
privacyNotes:
  - Sends token material to an external webhook.
---

Detect token usage and dump token values to a webhook for review.
`;

    const result = runContentPolicy(tmpDir, content, "external_direct", [
      {
        filename: "content/hooks/token-review-hook.mdx",
        status: "added",
        content,
      },
    ]);

    expect(result.status).not.toBe(0);
    const output = JSON.parse(fs.readFileSync(result.outputJson, "utf8"));
    expect(output.reviewFlags).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ id: "malicious_data_theft_capability" }),
      ]),
    );
    expect(output.requestChangesReasons.join("\n")).toContain(
      "credential, token, session, or wallet theft",
    );
  });

  it("does not let broad review words bypass cookie dumping claims", () => {
    const tmpDir = fs.mkdtempSync(
      path.join(os.tmpdir(), "heyclaude-content-policy-"),
    );
    const content = `---
title: Session Review Hook
category: hooks
description: Audit review hook that can dump session cookies from browser profiles.
sourceUrl: https://github.com/example/session-review-hook
submittedBy: contributor
submittedByUrl: https://github.com/contributor
safetyNotes:
  - Runs before commands and inspects browser profile state.
privacyNotes:
  - Reads session cookie material from user browser profiles.
---

Warning reviewers that this hook can dump session cookies from browser profiles.
`;

    const result = runContentPolicy(tmpDir, content, "external_direct", [
      {
        filename: "content/hooks/session-review-hook.mdx",
        status: "added",
        content,
      },
    ]);

    expect(result.status).not.toBe(0);
    const output = JSON.parse(fs.readFileSync(result.outputJson, "utf8"));
    expect(output.reviewFlags).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ id: "malicious_data_theft_capability" }),
      ]),
    );
  });

  it("does not let defensive words bypass explicit token stealing claims", () => {
    const tmpDir = fs.mkdtempSync(
      path.join(os.tmpdir(), "heyclaude-content-policy-"),
    );
    const content = `---
title: Credential Audit Notes
category: hooks
description: Prevent errors with audit notes; steal tokens from browser sessions.
sourceUrl: https://github.com/example/credential-audit-notes
submittedBy: contributor
submittedByUrl: https://github.com/contributor
safetyNotes:
  - Reviews browser session behavior before commands run.
privacyNotes:
  - Reads token material from user browser sessions.
---

Prevent errors during review; steal tokens from browser sessions for audit notes.
`;

    const result = runContentPolicy(tmpDir, content, "external_direct", [
      {
        filename: "content/hooks/credential-audit-notes.mdx",
        status: "added",
        content,
      },
    ]);

    expect(result.status).not.toBe(0);
    const output = JSON.parse(fs.readFileSync(result.outputJson, "utf8"));
    expect(output.reviewFlags).toEqual(
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

  it("exempts a delete-only content PR (removed status, no missing content flag) (#content-deletion)", () => {
    const tmpDir = fs.mkdtempSync(
      path.join(os.tmpdir(), "heyclaude-content-policy-"),
    );
    const result = runContentPolicy(tmpDir, "", "same_repo_direct", [
      { filename: "content/tools/removed-tool.mdx", status: "removed" },
    ]);

    expect(result.status).toBe(0);
    const output = JSON.parse(fs.readFileSync(result.outputJson, "utf8"));
    expect(output.ok).toBe(true);
    expect(
      output.reviewFlags.map((flag: { id: string }) => flag.id),
    ).not.toContain("missing_pr_file_content");
  });

  it("infers removal for an entry whose file is absent from the tree (lost-status defense) (#content-deletion)", () => {
    const tmpDir = fs.mkdtempSync(
      path.join(os.tmpdir(), "heyclaude-content-policy-"),
    );
    // status reported as "modified" (the bare-string --files-json default) but the
    // file does not exist on disk — i.e. a deletion whose status was lost upstream.
    // The defense-in-depth reclassifies it as removed instead of flagging it.
    const result = runContentPolicy(tmpDir, "", "same_repo_direct", [
      {
        filename: "content/tools/__absent-deleted-entry__.mdx",
        status: "modified",
      },
    ]);

    expect(result.status).toBe(0);
    const output = JSON.parse(fs.readFileSync(result.outputJson, "utf8"));
    expect(output.ok).toBe(true);
    expect(
      output.reviewFlags.map((flag: { id: string }) => flag.id),
    ).not.toContain("missing_pr_file_content");
  });

  it("does not classify GitHub artifact attestations as identity-sensitive", () => {
    const tmpDir = fs.mkdtempSync(
      path.join(os.tmpdir(), "heyclaude-content-policy-"),
    );
    const content = `---
title: GitHub Artifact Attestation Checklist
category: guides
description: Source-backed guide for verifying GitHub Artifact Attestations, release artifact provenance, build workflow metadata, and digest evidence.
documentationUrl: https://docs.github.com/en/actions/how-tos/secure-your-work/use-artifact-attestations/use-artifact-attestations
submittedBy: contributor
submittedByUrl: https://github.com/contributor
safetyNotes:
  - Attestations prove artifact provenance, not malware safety or runtime behavior.
---

Use this checklist to verify GitHub artifact attestation provenance before
trusting release artifacts.
`;
    const result = runContentPolicy(tmpDir, content, "same_repo_direct", [
      {
        filename: "content/guides/github-artifact-attestation-checklist.mdx",
        status: "added",
        content,
      },
    ]);
    const output = JSON.parse(fs.readFileSync(result.outputJson, "utf8"));
    expect(
      output.reviewFlags.map((flag: { id: string }) => flag.id),
    ).not.toContain("financial_or_identity_sensitive");
  });

  it("still classifies wallet attestations as identity-sensitive", () => {
    const tmpDir = fs.mkdtempSync(
      path.join(os.tmpdir(), "heyclaude-content-policy-"),
    );
    const content = `---
title: Wallet Attestation MCP
category: mcp
description: MCP server for wallet attestations, KYC review, and on-chain identity workflows.
documentationUrl: https://example.com/wallet-attestation-mcp
submittedBy: contributor
submittedByUrl: https://github.com/contributor
safetyNotes:
  - Requires explicit user approval before reading wallet or identity data.
privacyNotes:
  - Can process wallet, KYC, and on-chain identity records.
---

Use wallet attestations only after reviewing account permissions.
`;
    const result = runContentPolicy(tmpDir, content, "same_repo_direct", [
      {
        filename: "content/mcp/wallet-attestation-mcp.mdx",
        status: "added",
        content,
      },
    ]);
    const output = JSON.parse(fs.readFileSync(result.outputJson, "utf8"));
    expect(output.reviewFlags.map((flag: { id: string }) => flag.id)).toContain(
      "financial_or_identity_sensitive",
    );
  });

  it("classifies forward-order identity attestations as identity-sensitive", () => {
    const tmpDir = fs.mkdtempSync(
      path.join(os.tmpdir(), "heyclaude-content-policy-"),
    );
    const content = `---
title: Identity Attestation MCP
category: mcp
description: MCP server for attestations of user identity before account access.
documentationUrl: https://example.com/identity-attestation-mcp
submittedBy: contributor
submittedByUrl: https://github.com/contributor
privacyNotes:
  - Can process user identity evidence.
---

Use this server only for attestation of identity flows that have consent.
`;
    const result = runContentPolicy(tmpDir, content, "same_repo_direct", [
      {
        filename: "content/mcp/identity-attestation-mcp.mdx",
        status: "added",
        content,
      },
    ]);
    const output = JSON.parse(fs.readFileSync(result.outputJson, "utf8"));
    expect(output.reviewFlags.map((flag: { id: string }) => flag.id)).toContain(
      "financial_or_identity_sensitive",
    );
    expect(
      output.classificationWarnings.map(
        (warning: { id: string }) => warning.id,
      ),
    ).toContain("missing_safety_notes");
  });

  it("does not classify generic identity management artifact attestations as identity-sensitive", () => {
    const tmpDir = fs.mkdtempSync(
      path.join(os.tmpdir(), "heyclaude-content-policy-"),
    );
    const content = `---
title: Artifact Attestations for IAM Docs
category: guides
description: Guide for artifact provenance in IAM documentation workflows.
documentationUrl: https://example.com/iam-artifact-attestations
submittedBy: contributor
submittedByUrl: https://github.com/contributor
safetyNotes:
  - Provenance evidence only; no runtime document processing.
---

Use artifact attestations for identity management documentation and release
provenance checks.
`;
    const result = runContentPolicy(tmpDir, content, "same_repo_direct", [
      {
        filename: "content/guides/iam-artifact-attestations.mdx",
        status: "added",
        content,
      },
    ]);
    const output = JSON.parse(fs.readFileSync(result.outputJson, "utf8"));
    expect(
      output.reviewFlags.map((flag: { id: string }) => flag.id),
    ).not.toContain("financial_or_identity_sensitive");
  });

  it("classifies reverse-order identity proof attestations as identity-sensitive", () => {
    const tmpDir = fs.mkdtempSync(
      path.join(os.tmpdir(), "heyclaude-content-policy-"),
    );
    const content = `---
title: Passport Proof Attestation Review
category: guides
description: Guide for passport identity proof review before issuing user attestations.
documentationUrl: https://example.com/passport-proof-attestations
submittedBy: contributor
submittedByUrl: https://github.com/contributor
safetyNotes:
  - Requires explicit user approval before reviewing identity documents.
privacyNotes:
  - Can process passport and identity proof evidence.
---

Use passport identity proof data only with consent before producing an attestation.
`;
    const result = runContentPolicy(tmpDir, content, "same_repo_direct", [
      {
        filename: "content/guides/passport-proof-attestation-review.mdx",
        status: "added",
        content,
      },
    ]);
    const output = JSON.parse(fs.readFileSync(result.outputJson, "utf8"));
    expect(output.reviewFlags.map((flag: { id: string }) => flag.id)).toContain(
      "financial_or_identity_sensitive",
    );
  });

  it("does not classify distant generic attestation references as identity-sensitive", () => {
    const tmpDir = fs.mkdtempSync(
      path.join(os.tmpdir(), "heyclaude-content-policy-"),
    );
    const filler = "release provenance metadata ".repeat(10);
    const content = `---
title: Artifact Attestation Release Notes
category: guides
description: Guide for GitHub artifact attestation review using release provenance metadata.
documentationUrl: https://docs.github.com/en/actions/how-tos/secure-your-work/use-artifact-attestations/use-artifact-attestations
submittedBy: contributor
submittedByUrl: https://github.com/contributor
safetyNotes:
  - Attestations prove build provenance only.
---

Artifact attestation checks verify build provenance and digest evidence. ${filler}
Passport checks belong to a separate identity review and are not part of this artifact workflow.
`;
    const result = runContentPolicy(tmpDir, content, "same_repo_direct", [
      {
        filename: "content/guides/artifact-attestation-release-notes.mdx",
        status: "added",
        content,
      },
    ]);
    const output = JSON.parse(fs.readFileSync(result.outputJson, "utf8"));
    expect(
      output.reviewFlags.map((flag: { id: string }) => flag.id),
    ).not.toContain("financial_or_identity_sensitive");
  });

  it("allows the TODO|FIXME|XXX code-comment marker (prohibited_content false positive)", () => {
    const tmpDir = fs.mkdtempSync(
      path.join(os.tmpdir(), "heyclaude-content-policy-"),
    );
    const content = `---
title: Python Marker Hook
category: hooks
description: Flags TODO, FIXME, and XXX markers left in Python source files.
documentationUrl: https://code.claude.com/docs/en/hooks
safetyNotes:
  - Runs on a hook event and reads local files; review before enabling.
privacyNotes:
  - Reads hook input and local files; nothing is sent off-machine.
---

The hook runs \`grep -q "TODO\\|FIXME\\|XXX"\` against changed files.
`;
    const result = runContentPolicy(tmpDir, content, "same_repo_direct", [
      {
        filename: "content/hooks/python-marker-hook.mdx",
        status: "added",
        content,
      },
    ]);
    const output = JSON.parse(fs.readFileSync(result.outputJson, "utf8"));
    expect(
      output.reviewFlags.map((flag: { id: string }) => flag.id),
    ).not.toContain("prohibited_content");
  });

  it("allows (XXX) XXX-XXXX phone masks (prohibited_content false positive)", () => {
    const tmpDir = fs.mkdtempSync(
      path.join(os.tmpdir(), "heyclaude-content-policy-"),
    );
    const content = `---
title: Phone Mask Skill
category: skills
description: Normalizes US phone numbers into the (XXX) XXX-XXXX display format.
documentationUrl: https://example.com/docs
---

Output uses the mask (XXX) XXX-XXXX for redaction.
`;
    const result = runContentPolicy(tmpDir, content, "same_repo_direct", [
      {
        filename: "content/skills/phone-mask-skill.mdx",
        status: "added",
        content,
      },
    ]);
    const output = JSON.parse(fs.readFileSync(result.outputJson, "utf8"));
    expect(
      output.reviewFlags.map((flag: { id: string }) => flag.id),
    ).not.toContain("prohibited_content");
  });

  it("still blocks genuinely adult xxx content (prohibited_content)", () => {
    const tmpDir = fs.mkdtempSync(
      path.join(os.tmpdir(), "heyclaude-content-policy-"),
    );
    const content = `---
title: Bad Entry
category: tools
description: Scrapes xxx porn videos from adult sites.
sourceUrl: https://github.com/example/bad
---

Downloads xxx porn content in bulk.
`;
    const result = runContentPolicy(tmpDir, content, "same_repo_direct", [
      { filename: "content/tools/bad-entry.mdx", status: "added", content },
    ]);
    const output = JSON.parse(fs.readFileSync(result.outputJson, "utf8"));
    expect(output.reviewFlags).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ id: "prohibited_content" }),
      ]),
    );
  });

  it("allows loopback http executable sources (non_https_executable_source false positive)", () => {
    const tmpDir = fs.mkdtempSync(
      path.join(os.tmpdir(), "heyclaude-content-policy-"),
    );
    const content = `---
title: Local Loopback MCP
category: mcp
description: Connects Claude to a local dev server over loopback http.
documentationUrl: https://code.claude.com/docs/en/mcp
installCommand: Point the client at http://127.0.0.1:3845/mcp (also http://localhost:8080/mcp).
safetyNotes:
  - Runs locally and connects to a loopback endpoint you control.
---

Connect to the local endpoint http://127.0.0.1:3845/mcp.
`;
    const result = runContentPolicy(tmpDir, content, "same_repo_direct", [
      {
        filename: "content/mcp/local-loopback-mcp.mdx",
        status: "added",
        content,
      },
    ]);
    const output = JSON.parse(fs.readFileSync(result.outputJson, "utf8"));
    expect(
      output.reviewFlags.map((flag: { id: string }) => flag.id),
    ).not.toContain("non_https_executable_source");
  });

  it("still blocks remote http executable sources (non_https_executable_source)", () => {
    const tmpDir = fs.mkdtempSync(
      path.join(os.tmpdir(), "heyclaude-content-policy-"),
    );
    const content = `---
title: Remote Http MCP
category: mcp
description: Fetches its installer from a remote non-HTTPS endpoint.
documentationUrl: https://example.com/docs
installCommand: Fetch the installer from http://evil.example.com/install.sh and run it.
safetyNotes:
  - Downloads and runs an external installer.
---

Setup pulls from http://evil.example.com/install.sh.
`;
    const result = runContentPolicy(tmpDir, content, "same_repo_direct", [
      { filename: "content/mcp/remote-http-mcp.mdx", status: "added", content },
    ]);
    const output = JSON.parse(fs.readFileSync(result.outputJson, "utf8"));
    expect(output.reviewFlags).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ id: "non_https_executable_source" }),
      ]),
    );
  });

  it("blocks remote http executable sources with loopback-looking userinfo", () => {
    const tmpDir = fs.mkdtempSync(
      path.join(os.tmpdir(), "heyclaude-content-policy-"),
    );
    const content = `---
title: Remote Userinfo Http MCP
category: mcp
description: Fetches its installer from a remote non-HTTPS endpoint.
documentationUrl: https://example.com/docs
installCommand: Fetch the installer from http://localhost@evil.example.com/install.sh and run it.
safetyNotes:
  - Downloads and runs an external installer.
---

Setup pulls from http://127.0.0.1@evil.example.com/install.sh.
`;
    const result = runContentPolicy(tmpDir, content, "same_repo_direct", [
      {
        filename: "content/mcp/remote-userinfo-http-mcp.mdx",
        status: "added",
        content,
      },
    ]);
    const output = JSON.parse(fs.readFileSync(result.outputJson, "utf8"));
    expect(output.reviewFlags).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ id: "non_https_executable_source" }),
      ]),
    );
  });

  it("allows /ref/ reference paths in source URLs (affiliate false positive)", () => {
    const tmpDir = fs.mkdtempSync(
      path.join(os.tmpdir(), "heyclaude-content-policy-"),
    );
    const content = `---
title: Go Module Tidy Hook
category: hooks
description: Runs go mod tidy to prune and sync Go module dependencies on save.
documentationUrl: https://go.dev/ref/mod
retrievalSources:
  - https://go.dev/ref/mod
safetyNotes:
  - Runs on a hook event and executes go tooling; review before enabling.
privacyNotes:
  - Reads local Go module files; nothing is sent off-machine.
---

The hook runs \`go mod tidy\` and reports changes.
`;
    const result = runContentPolicy(tmpDir, content, "same_repo_direct", [
      {
        filename: "content/hooks/go-module-tidy.mdx",
        status: "added",
        content,
      },
    ]);
    const output = JSON.parse(fs.readFileSync(result.outputJson, "utf8"));
    expect(
      output.reviewFlags.map((flag: { id: string }) => flag.id),
    ).not.toContain("affiliate_referral_url");
  });

  it("still blocks genuine affiliate URLs (path and query param)", () => {
    const tmpDir = fs.mkdtempSync(
      path.join(os.tmpdir(), "heyclaude-content-policy-"),
    );
    const content = `---
title: Affiliate Entry
category: tools
description: Tool with an affiliate referral link.
sourceUrl: https://shop.example.com/product?ref=abc123
---

Body.
`;
    const result = runContentPolicy(tmpDir, content, "same_repo_direct", [
      {
        filename: "content/tools/affiliate-entry.mdx",
        status: "added",
        content,
      },
    ]);
    const output = JSON.parse(fs.readFileSync(result.outputJson, "utf8"));
    expect(output.reviewFlags).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ id: "affiliate_referral_url" }),
      ]),
    );
  });
});
