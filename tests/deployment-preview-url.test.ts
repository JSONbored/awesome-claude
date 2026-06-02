import { describe, expect, it } from "vitest";
import fs from "node:fs";
import path from "node:path";

import {
  normalizeBaseUrl,
  selectPreviewUrl,
} from "../scripts/resolve-pr-preview-url.mjs";
import { repoRoot } from "./helpers/registry-fixtures";

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

  it("uses resolved PR preview URLs instead of a manual merge-gate variable", () => {
    const workflow = fs.readFileSync(
      path.join(repoRoot, ".github/workflows/content-validation.yml"),
      "utf8",
    );
    expect(workflow).toContain("Deploy same-repo PR preview to dev Worker");
    expect(workflow).toContain("Resolve PR preview URL");
    expect(workflow).toContain("REQUIRE_PR_PREVIEW");
    expect(workflow).toContain('[ "$REQUIRE_PR_PREVIEW" != "true" ]');
    expect(workflow).toContain("pnpm validate:deployment-artifacts");
    expect(workflow).not.toContain("Require preview artifact base URL");
    expect(workflow).not.toContain("vars.DEPLOYMENT_ARTIFACT_BASE_URL");
  });

  it("guards submission-gate production deploys until prod D1 exists", () => {
    const packageJson = JSON.parse(
      fs.readFileSync(
        path.join(repoRoot, "apps/submission-gate/package.json"),
        "utf8",
      ),
    ) as { scripts: Record<string, string> };

    expect(packageJson.scripts["deploy:prod"]).toContain(
      "check-submission-gate-prod-config.mjs",
    );
    expect(packageJson.scripts["deploy:dry-run:prod"]).toContain(
      "check-submission-gate-prod-config.mjs",
    );
  });
});
