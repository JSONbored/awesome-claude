import { describe, expect, it } from "vitest";
import fs from "node:fs";
import path from "node:path";

import {
  normalizeBaseUrl,
  selectPreviewUrl,
} from "../scripts/resolve-pr-preview-url.mjs";
import { repoRoot } from "./helpers/registry-fixtures";

function readContentValidationWorkflow() {
  return fs.readFileSync(
    path.join(repoRoot, ".github/workflows/content-validation.yml"),
    "utf8",
  );
}

describe("PR preview artifact validation flow", () => {
  it("normalizes preview URLs and ignores GitHub status links", () => {
    expect(normalizeBaseUrl("https://preview.example.com/path/")).toBe(
      "https://preview.example.com/path",
    );
    expect(
      selectPreviewUrl([
        {
          url: "https://github.com/JSONbored/awesome-claude/actions/runs/1",
          source: "status",
        },
        {
          url: "https://heyclaude-dev.zeronode.workers.dev",
          source: "deploy",
        },
      ]),
    ).toEqual({
      url: "https://heyclaude-dev.zeronode.workers.dev",
      source: "deploy",
    });
  });

  it("ignores scanner and review app URLs when resolving deploy previews", () => {
    expect(
      selectPreviewUrl([
        {
          url: "https://superagent.sh",
          source: "github-check:Superagent Security Scan",
        },
        {
          url: "https://app.coderabbit.ai/change-stack/repo/pr/1",
          source: "github-status:CodeRabbit",
        },
        {
          url: "https://heyclaude-dev.zeronode.workers.dev",
          source: "github-deployment:preview",
        },
      ]),
    ).toEqual({
      url: "https://heyclaude-dev.zeronode.workers.dev",
      source: "github-deployment:preview",
    });
  });

  it("uses resolved PR preview URLs instead of a manual merge-gate variable", () => {
    const workflow = readContentValidationWorkflow();
    expect(workflow).toContain("Resolve PR preview URL");
    expect(workflow).toContain("REQUIRE_PR_PREVIEW");
    expect(workflow).toContain("ALLOW_SHARED_DEV_WORKER_PREVIEW");
    expect(workflow).toContain("https://heyclaude-dev.zeronode.workers.dev");
    expect(workflow).toContain('[ "$REQUIRE_PR_PREVIEW" != "true" ]');
    expect(workflow).toContain("--wait-seconds 600");
    expect(workflow).toContain("pnpm validate:deployment-artifacts");
    expect(workflow).toContain(
      "Deployed preview did not satisfy the artifact contract before timeout.",
    );
    expect(workflow).not.toContain("CLOUDFLARE_API_TOKEN");
    expect(workflow).not.toContain("CLOUDFLARE_ACCOUNT_ID");
    expect(workflow).not.toContain("pnpm --filter web run deploy:dev");
    expect(workflow).not.toContain("Require preview artifact base URL");
    expect(workflow).not.toContain("vars.DEPLOYMENT_ARTIFACT_BASE_URL");
  });

  it("keeps trusted policy execution anchored to the pull request base branch", () => {
    const workflow = readContentValidationWorkflow();
    const policyBlock =
      workflow.match(
        /- name: Validate direct content policy[\s\S]*?\n  validate-content-config:/,
      )?.[0] || "";

    expect(policyBlock).toContain(
      'git show "$BASE_SHA:$policy_path" > "$trusted_policy"',
    );
    expect(policyBlock).toContain('if [ "$HEAD_REPO" = "$BASE_REPO" ]; then');
    expect(policyBlock).toContain('cp "$policy_path" "$trusted_policy"');
    expect(policyBlock).toContain(
      "Trusted content policy script is missing from the base branch.",
    );
    expect(policyBlock).not.toContain('cat "$policy_path" > "$trusted_policy"');
  });

  it("runs a focused source lane for one-file direct content submissions", () => {
    const workflow = readContentValidationWorkflow();
    const sourceBlock =
      workflow.match(
        /\n  validate-submission-source:[\s\S]*?\n  validate-content-config:/,
      )?.[0] || "";

    expect(workflow).toContain("direct_submission:");
    expect(sourceBlock).toContain("name: validate-submission-source");
    expect(sourceBlock).toContain(
      "needs.classify-pr.outputs.direct_submission == 'true'",
    );
    expect(sourceBlock).toContain("pnpm validate:content:strict");
    expect(sourceBlock).toContain("pnpm audit:content");
    expect(sourceBlock).toContain('node "$trusted_policy"');
    expect(sourceBlock).toContain('git diff --check "$BASE_SHA"...HEAD');
  });

  it("keeps generated artifact lanes off direct contributor submissions", () => {
    const workflow = readContentValidationWorkflow();
    expect(workflow).toContain(
      "needs.classify-pr.outputs.direct_submission != 'true'",
    );
    expect(workflow).toContain("- validate-submission-source");
  });

  it("validates source-only content changes without requiring committed generated artifacts", () => {
    const workflow = readContentValidationWorkflow();
    const registryBlock =
      workflow.match(/\n  validate-registry:[\s\S]*?\n  validate-web:/)?.[0] ||
      "";

    expect(workflow).toContain("source_content_only:");
    expect(workflow).toContain("readme_only:");
    expect(registryBlock).toContain(
      "needs.classify-pr.outputs.source_content_only != 'true'",
    );
    expect(registryBlock).toContain(
      "Generate README for source-only import validation",
    );
    expect(registryBlock).toContain("pnpm generate:readme");
    expect(registryBlock).toContain(
      "README refresh is handled by the single automation/readme-refresh accumulator PR",
    );
    expect(registryBlock).toContain(
      "Verify source-only imports produce only build artifacts",
    );
    expect(registryBlock).toContain(
      "Generated artifact changes are build-time outputs for this source-only content import",
    );
    expect(registryBlock).toContain("apps/web/public/data/.*");
    expect(registryBlock).toContain("apps/web/src/generated/.*");
  });

  it("lets README-only refresh PRs validate generated outputs without committing them", () => {
    const workflow = readContentValidationWorkflow();
    const registryBlock =
      workflow.match(/\n  validate-registry:[\s\S]*?\n  validate-web:/)?.[0] ||
      "";

    expect(registryBlock).toContain(
      "needs.classify-pr.outputs.readme_only != 'true'",
    );
    expect(registryBlock).toContain(
      "Verify README-only refresh leaves generated artifacts as build outputs",
    );
    expect(registryBlock).toContain(
      "Generated artifact changes are build-time outputs for this README refresh",
    );
  });

  it("does not persist GitHub credentials in the submission-gate validation checkout", () => {
    const workflow = readContentValidationWorkflow();
    const jobBlock =
      workflow.match(
        /\n  validate-submission-gate:[\s\S]*?\n  validate-pr-preview:/,
      )?.[0] || "";

    expect(jobBlock).toContain("permissions:\n      contents: read");
    expect(jobBlock).toContain(
      "uses: actions/checkout@de0fac2e4500dabe0009e67214ff5f5447ce83dd",
    );
    expect(jobBlock).toContain("persist-credentials: false");
  });

  it("routes submission-gate deployments through the production Worker only", () => {
    const packageJson = JSON.parse(
      fs.readFileSync(
        path.join(repoRoot, "apps/submission-gate/package.json"),
        "utf8",
      ),
    ) as { scripts: Record<string, string> };

    expect(packageJson.scripts["deploy:dev"]).toBe("pnpm run deploy:prod");
    expect(packageJson.scripts["deploy:prod"]).toContain(
      "check-submission-gate-prod-config.mjs",
    );
    expect(packageJson.scripts["deploy:dry-run:dev"]).toBe(
      "pnpm run deploy:dry-run:prod",
    );
    expect(packageJson.scripts["deploy:dry-run:prod"]).toContain(
      'wrangler deploy --config wrangler.jsonc --env "" --dry-run',
    );

    const wranglerConfig = fs.readFileSync(
      path.join(repoRoot, "apps/submission-gate/wrangler.jsonc"),
      "utf8",
    );
    expect(wranglerConfig).not.toContain('"env":');
    expect(wranglerConfig).toContain('"pattern": "submission-gate.heyclau.de"');
    expect(wranglerConfig).toContain('"PILOT_BASE_REF": "main"');
    expect(wranglerConfig).toContain('"name": "heyclaude-submission-gate"');
  });
});
