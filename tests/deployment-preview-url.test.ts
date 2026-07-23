import { afterEach, describe, expect, it, vi } from "vitest";
import fs from "node:fs";
import path from "node:path";

import {
  normalizeBaseUrl,
  resolveFromPrComments,
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
          url: "https://abc123-heyclaude-prod.zeronode.workers.dev",
          source: "deploy",
        },
      ]),
    ).toEqual({
      url: "https://abc123-heyclaude-prod.zeronode.workers.dev",
      source: "deploy",
    });
  });

  it("ignores sibling-project and retired dev-worker URLs", () => {
    // The account hosts other projects; their deployment statuses must never be
    // selected as a HeyClaude preview (regression: gittensory.aethereal.dev).
    // The retired dev worker hosts must also be rejected now that it is gone.
    for (const url of [
      "https://gittensory.aethereal.dev",
      "https://heyclaude-dev.zeronode.workers.dev",
      "https://dev.heyclau.de",
      // Sibling workers whose name/subdomain merely contains the substring
      // "heyclaude-prod" must not be mistaken for the prod worker.
      "https://heyclaude-prod-next.zeronode.workers.dev",
      "https://v1-heyclaude-prod-staging.zeronode.workers.dev",
      "https://preview.heyclaude-prod.otheracct.workers.dev",
    ]) {
      expect(
        selectPreviewUrl([{ url, source: "github-deployment:x" }]),
      ).toBeNull();
    }
    expect(
      selectPreviewUrl([
        {
          url: "https://gittensory.aethereal.dev",
          source: "github-deployment:gittensory",
        },
        {
          url: "https://heyclau.de",
          source: "github-deployment:Production",
        },
      ]),
    ).toEqual({
      url: "https://heyclau.de",
      source: "github-deployment:Production",
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
          url: "https://abc123-heyclaude-prod.zeronode.workers.dev",
          source: "github-deployment:preview",
        },
      ]),
    ).toEqual({
      url: "https://abc123-heyclaude-prod.zeronode.workers.dev",
      source: "github-deployment:preview",
    });
  });

  it("uses resolved same-repo PR preview URLs instead of a manual merge-gate variable", () => {
    const workflow = readContentValidationWorkflow();
    expect(workflow).toContain("Resolve PR preview URL");
    expect(workflow).toContain(
      "github.event.pull_request.head.repo.full_name == github.repository",
    );
    expect(workflow).toContain("github.event_name == 'workflow_dispatch'");
    expect(workflow).toContain(
      "github.ref_name == 'automation/readme-refresh'",
    );
    const previewBlock =
      workflow.match(
        /\n  validate-pr-preview:[\s\S]*?\n  required-pr-gate:/,
      )?.[0] || "";
    expect(previewBlock).toContain(
      "group: deployment-artifacts-pr-preview-${{ github.ref }}\n",
    );
    expect(previewBlock).not.toContain("github.event.pull_request.number");
    // The shared heyclaude-dev worker has been retired; PR previews resolve from
    // the real per-PR prod preview-version deployment statuses, and the resolver
    // degrades gracefully (--allow-missing) instead of falling back to dev.
    expect(workflow).not.toContain("ALLOW_SHARED_DEV_WORKER_PREVIEW");
    expect(workflow).not.toContain(
      "https://heyclaude-dev.zeronode.workers.dev",
    );
    expect(workflow).toContain("--wait-seconds 240");
    expect(workflow).not.toContain("REQUIRE_PR_PREVIEW");
    expect(workflow).toContain("--allow-missing");
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

  it("keeps production uploads defaulted while exposing a dev Worker version upload", () => {
    const packageJson = JSON.parse(
      fs.readFileSync(path.join(repoRoot, "apps/web/package.json"), "utf8"),
    ) as { scripts: Record<string, string> };
    const wranglerConfig = fs.readFileSync(
      path.join(repoRoot, "apps/web/wrangler.jsonc"),
      "utf8",
    );

    expect(packageJson.scripts["versions:upload"]).toContain('--env ""');
    expect(packageJson.scripts["versions:upload"]).not.toContain("--env dev");
    expect(packageJson.scripts["versions:upload:dev"]).toContain("--env dev");
    expect(packageJson.scripts["preversions:upload:dev"]).toBe(
      "pnpm run generate:artifacts",
    );
    expect(wranglerConfig).toContain('"name": "heyclaude-prod"');
    expect(wranglerConfig).toContain('"dev": {');
    expect(wranglerConfig).toContain('"name": "heyclaude-dev"');
    expect(wranglerConfig).toContain(
      '"database_name": "heyclaude-dev-site-state"',
    );
  });

  it("does not enable the first-party Umami script proxy in production config", () => {
    const wranglerConfig = fs.readFileSync(
      path.join(repoRoot, "apps/web/wrangler.jsonc"),
      "utf8",
    );

    expect(wranglerConfig).not.toContain(
      '"VITE_UMAMI_SCRIPT_URL": "/u/script.js"',
    );
    expect(wranglerConfig).toContain(
      '"VITE_UMAMI_WEBSITE_ID": "b734c138-2949-4527-9160-7fe5d0e81121"',
    );
    expect(wranglerConfig).toContain(
      '"VITE_UMAMI_ALLOWED_HOSTS": "heyclau.de,www.heyclau.de"',
    );
    expect(wranglerConfig).toContain(
      '"UMAMI_UPSTREAM_URL": "https://tasty.aethereal.dev"',
    );
    expect(wranglerConfig).toContain(
      '"UMAMI_ALLOWED_UPSTREAM_ORIGINS": "https://tasty.aethereal.dev"',
    );
    expect(wranglerConfig).toContain(
      '"UMAMI_WEBSITE_ID": "b734c138-2949-4527-9160-7fe5d0e81121"',
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

    expect(packageJson.scripts).not.toHaveProperty("deploy");
    expect(packageJson.scripts).not.toHaveProperty("deploy:dev");
    expect(packageJson.scripts["deploy:prod"]).toContain(
      "check-submission-gate-prod-config.mjs",
    );
    expect(packageJson.scripts).not.toHaveProperty("deploy:dry-run");
    expect(packageJson.scripts).not.toHaveProperty("deploy:dry-run:dev");
    expect(packageJson.scripts["deploy:dry-run:prod"]).toContain(
      'wrangler deploy --config wrangler.jsonc --env "" --dry-run',
    );

    const wranglerConfig = fs.readFileSync(
      path.join(repoRoot, "apps/submission-gate/wrangler.jsonc"),
      "utf8",
    );
    expect(wranglerConfig).not.toContain('"env":');
    expect(wranglerConfig).toContain('"pattern": "submission-gate.heyclau.de"');
    expect(wranglerConfig).toContain('"CONTENT_GATE_BASE_REF": "main"');
    expect(wranglerConfig).not.toContain(
      `"${["PILOT", "BASE", "REF"].join("_")}"`,
    );
    expect(wranglerConfig).toContain('"name": "heyclaude-submission-gate"');
  });
});

describe("resolveFromPrComments — reads the Cloudflare Workers Builds PR comment", () => {
  afterEach(() => vi.unstubAllGlobals());
  const env = {
    GITHUB_TOKEN: "t",
    GITHUB_REPOSITORY: "JSONbored/awesome-claude",
  };
  // The real comment markup Cloudflare posts (both links present).
  const cfBody =
    "| ✅ Deployment successful! | heyclaude-prod | def6d9d7 | " +
    "<a href='https://71ca0b68-heyclaude-prod.zeronode.workers.dev'>Commit Preview URL</a><br><br>" +
    "<a href='https://codex-quality-methodology-copy-heyclaude-prod.zeronode.workers.dev'>Branch Preview URL</a> | Jun 19 2026 |";

  function stubComments(comments) {
    vi.stubGlobal(
      "fetch",
      vi.fn(
        async () =>
          new Response(JSON.stringify(comments), {
            status: 200,
            headers: { "content-type": "application/json" },
          }),
      ),
    );
  }

  it("prefers the stable Branch Preview URL from a fresh cloudflare bot comment", async () => {
    stubComments([
      { user: { login: "someone" }, body: "unrelated" },
      { user: { login: "cloudflare-workers-and-pages[bot]" }, body: cfBody },
    ]);
    expect(
      await resolveFromPrComments(
        { pull_request: { number: 4045, head: { sha: "def6d9d7abcdef" } } },
        env,
      ),
    ).toEqual({
      url: "https://codex-quality-methodology-copy-heyclaude-prod.zeronode.workers.dev",
      source: "cf-comment:branch",
    });
  });

  it("ignores stale cloudflare bot comments from older PR heads", async () => {
    stubComments([
      { user: { login: "cloudflare-workers-and-pages[bot]" }, body: cfBody },
    ]);
    expect(
      await resolveFromPrComments(
        { pull_request: { number: 4045, head: { sha: "abc1234newhead" } } },
        env,
      ),
    ).toBeNull();
  });

  it("falls back to the per-commit Preview URL when no Branch URL is present", async () => {
    stubComments([
      {
        user: { login: "cloudflare-workers-and-pages[bot]" },
        body: "<a href='https://71ca0b68-heyclaude-prod.zeronode.workers.dev'>Commit Preview URL</a>",
      },
    ]);
    const resolved = await resolveFromPrComments(
      { pull_request: { number: 1 } },
      env,
    );
    expect(resolved?.url).toBe(
      "https://71ca0b68-heyclaude-prod.zeronode.workers.dev",
    );
  });

  it("rejects SPOOFED commenters (exact bot login only) and returns null without a PR number", async () => {
    // A public-repo user whose name merely CONTAINS "cloudflare" must not be able to inject a preview URL —
    // only the unspoofable `cloudflare-workers-and-pages[bot]` login counts (Superagent P2 hardening).
    stubComments([
      {
        user: { login: "cloudflare-impostor" },
        body: "<a href='https://evil-heyclaude-prod.zeronode.workers.dev'>Branch Preview URL</a>",
      },
      {
        user: { login: "cloudflare-workers-and-pages" },
        body: "<a href='https://evil2-heyclaude-prod.zeronode.workers.dev'>Branch Preview URL</a>",
      },
    ]);
    expect(
      await resolveFromPrComments({ pull_request: { number: 2 } }, env),
    ).toBeNull();
    expect(await resolveFromPrComments({}, env)).toBeNull();
  });

  it("bounds the GitHub API fetch with an abort-timeout signal so a hung request can't outlast the poll deadline", async () => {
    const fetchMock = vi.fn(
      async () =>
        new Response(JSON.stringify([]), {
          status: 200,
          headers: { "content-type": "application/json" },
        }),
    );
    vi.stubGlobal("fetch", fetchMock);

    await resolveFromPrComments({ pull_request: { number: 4045 } }, env);

    expect(fetchMock).toHaveBeenCalledTimes(1);
    const init = fetchMock.mock.calls[0][1] as RequestInit | undefined;
    expect(init?.signal).toBeInstanceOf(AbortSignal);
    // A real AbortSignal.timeout(...) is live and un-aborted at call time.
    expect(init?.signal?.aborted).toBe(false);
  });
});
