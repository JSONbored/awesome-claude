import { execFileSync } from "node:child_process";
import fs from "node:fs";

const eventName = process.env.GITHUB_EVENT_NAME || "";
const baseSha = process.env.BASE_SHA || "";
const baseRef = process.env.BASE_REF || process.env.GITHUB_BASE_REF || "";
const headSha = process.env.HEAD_SHA || "";
const headRef =
  process.env.HEAD_REF ||
  process.env.GITHUB_HEAD_REF ||
  process.env.GITHUB_REF_NAME ||
  "";
const workflowDispatchBaseRef =
  process.env.WORKFLOW_DISPATCH_BASE_REF || "main";
const workflowDispatchDiff =
  eventName === "workflow_dispatch" &&
  (headRef === "automation/readme-refresh" ||
    process.env.GITHUB_REF_NAME === "automation/readme-refresh");
const forceFullFromEvent =
  process.env.FORCE_FULL_VALIDATION === "1" ||
  (eventName === "workflow_dispatch" && !workflowDispatchDiff) ||
  eventName === "schedule";
const outputPath = process.env.GITHUB_OUTPUT || "";
const summaryPath = process.env.GITHUB_STEP_SUMMARY || "";
const CONTENT_CATEGORIES = [
  "agents",
  "commands",
  "collections",
  "guides",
  "hooks",
  "mcp",
  "rules",
  "skills",
  "statuslines",
  "tools",
];

function gitCommitExists(revision) {
  if (!revision) return false;
  try {
    execFileSync("git", ["rev-parse", "--verify", `${revision}^{commit}`], {
      stdio: "ignore",
    });
    return true;
  } catch {
    return false;
  }
}

function pullRequestDiffRange() {
  const head =
    /^[0-9a-f]{40}$/i.test(headSha) && gitCommitExists(headSha)
      ? headSha
      : "HEAD";
  const candidates = [];

  if (workflowDispatchDiff) {
    candidates.push(`refs/remotes/origin/${workflowDispatchBaseRef}`);
    candidates.push(`origin/${workflowDispatchBaseRef}`);
    candidates.push(workflowDispatchBaseRef);
  } else if (baseRef) {
    candidates.push(`refs/remotes/origin/${baseRef}`);
    candidates.push(`origin/${baseRef}`);
    candidates.push(baseRef);
  }

  for (const candidate of candidates) {
    if (gitCommitExists(candidate)) {
      return [`${candidate}...${head}`];
    }
  }

  if (/^[0-9a-f]{40}$/i.test(baseSha)) {
    return [`${baseSha}...${head}`];
  }

  throw new Error("BASE_SHA must be a full Git commit SHA for PR validation");
}

function changedFiles() {
  if (forceFullFromEvent) return [];
  if (eventName !== "pull_request" && !workflowDispatchDiff) return [];
  const output = execFileSync(
    "git",
    ["diff", "--name-only", ...pullRequestDiffRange()],
    {
      encoding: "utf8",
    },
  );
  return output
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .sort();
}

const files = changedFiles();
const workflowDispatchReadmeOnly =
  workflowDispatchDiff && files.length === 1 && files[0] === "README.md";
const all =
  forceFullFromEvent || (workflowDispatchDiff && !workflowDispatchReadmeOnly);
const diffClassifiedEvent =
  eventName === "pull_request" || workflowDispatchReadmeOnly;

function touches(...patterns) {
  if (all) return true;
  return files.some((file) =>
    patterns.some((pattern) =>
      typeof pattern === "string" ? file === pattern : pattern.test(file),
    ),
  );
}

function contentCategoriesFromFiles() {
  if (all) return [...CONTENT_CATEGORIES];

  const categories = new Set();
  for (const file of files) {
    const match = /^content\/([^/]+)\/[^/]+\.mdx$/i.exec(file);
    if (match && CONTENT_CATEGORIES.includes(match[1])) {
      categories.add(match[1]);
    }
  }
  return [...categories].sort();
}

const contentCategories = contentCategoriesFromFiles();
const contentCategoryTouched = contentCategories.length > 0;
const sourceContentOnly =
  diffClassifiedEvent &&
  !all &&
  files.length > 0 &&
  files.every((file) => /^content\/[^/]+\/[^/]+\.mdx$/i.test(file));
const readmeOnly =
  diffClassifiedEvent && !all && files.length === 1 && files[0] === "README.md";
const directSubmission =
  diffClassifiedEvent &&
  !all &&
  files.length === 1 &&
  contentCategories.length === 1 &&
  /^content\/[^/]+\/[^/]+\.mdx$/i.test(files[0]);
const contentValidationInfra = touches(
  /^examples\/content\//,
  /^\.github\/ISSUE_TEMPLATE\//,
  /^scripts\/(audit-content|generate-issue-templates|validate-category-spec|validate-content)\.mjs$/,
  /^packages\/registry\/src\/(category-spec|content-builder|submission|index\.d\.ts)/,
);
const generatedArtifactInfra = touches(
  /^packages\/registry\//,
  /^scripts\/(audit-content|build-content-index|generate-readme|validate-category-spec|validate-content|validate-codebase-clean)\.mjs$/,
  /^tests\/(registry-artifacts|readme-generation|seo-jsonld)\.test\.ts$/,
  /^apps\/web\/public\/data\//,
  /^apps\/web\/src\/generated\//,
  "README.md",
);
const submissionAutomationInfra = touches(
  /^scripts\/analyze-submission-risk\.mjs$/,
);
const submissionGateInfra = touches(
  /^apps\/submission-gate\//,
  /^tests\/submission-gate-.*\.test\.ts$/,
);

const flags = {
  direct_submission: directSubmission,
  source_content_only: sourceContentOnly,
  readme_only: readmeOnly,
  content: contentCategoryTouched || contentValidationInfra,
  content_config: contentValidationInfra,
  registry:
    !directSubmission &&
    (contentCategoryTouched ||
      generatedArtifactInfra ||
      submissionAutomationInfra),
  web:
    !directSubmission &&
    (contentCategoryTouched ||
      submissionAutomationInfra ||
      touches(
        /^apps\/web\//,
        /^emails\//,
        /^cloudflare\/api-schema-heyclaude-openapi\.yaml$/,
        /^scripts\/(generate-openapi|validate-d1-jobs|validate-deployment-artifacts)\.(mjs|ts)$/,
        /^tests\/(api-|commercial-intake|discovery-surfaces|seo-jsonld|submission-api|submission-workflows|votes-api).*\.test\.ts$/,
        "vitest.config.ts",
        "package.json",
        "pnpm-lock.yaml",
      )),
  mcp: touches(
    /^packages\/mcp\//,
    /^apps\/web\/src\/routes\/api\/mcp\.ts$/,
    /^scripts\/validate-mcp-package\.mjs$/,
    /^tests\/mcp-.*\.test\.ts$/,
    "package.json",
    "pnpm-lock.yaml",
  ),
  raycast:
    !directSubmission &&
    (contentCategoryTouched ||
      touches(
        /^integrations\/raycast\//,
        /^apps\/web\/public\/data\/raycast/,
        /^scripts\/(build-content-index|validate-raycast-feed)\.mjs$/,
        /^tests\/registry-artifacts\.test\.ts$/,
        "package.json",
        "pnpm-lock.yaml",
      )),
  packages: touches(
    /^apps\/web\/public\/downloads\//,
    /^content\/skills\/.*\.zip$/,
    /^content\/mcp\/.*\.mcpb$/,
    /^scripts\/(scan-download-packages|validate-download-packages)\.mjs$/,
    "package.json",
    "pnpm-lock.yaml",
  ),
  submission_gate:
    submissionGateInfra ||
    touches("package.json", "pnpm-lock.yaml", "pnpm-workspace.yaml"),
  ci:
    submissionAutomationInfra ||
    touches(
      /^\.github\/workflows\//,
      /^scripts\/ci\//,
      /^\.trunk\//,
      "renovate.json",
      "package.json",
      "pnpm-lock.yaml",
      "vitest.config.ts",
    ),
};

flags.docs = touches(
  /^docs\//,
  /^.*\.md$/,
  "AGENTS.md",
  "CLAUDE.md",
  "LICENSE",
);

for (const key of Object.keys(flags)) {
  flags[key] = Boolean(flags[key]);
}

for (const category of CONTENT_CATEGORIES) {
  flags[`content_${category}`] = all || contentCategories.includes(category);
}

const lines = [
  `full=${all ? "true" : "false"}`,
  ...Object.entries(flags).map(
    ([key, value]) => `${key}=${value ? "true" : "false"}`,
  ),
  `content_categories=${contentCategories.join(",")}`,
  `content_categories_json=${JSON.stringify(contentCategories)}`,
  `changed_count=${files.length}`,
  `changed_files_json=${JSON.stringify(files)}`,
];

if (outputPath) {
  fs.appendFileSync(outputPath, `${lines.join("\n")}\n`);
}

const summary = [
  "## PR validation lanes",
  "",
  `Full validation: ${all ? "yes" : "no"}`,
  "",
  "| Lane | Runs |",
  "| --- | --- |",
  ...Object.entries(flags).map(
    ([key, value]) => `| ${key} | ${value ? "yes" : "no"} |`,
  ),
  `| content categories | ${contentCategories.length ? contentCategories.join(", ") : "none"} |`,
  "",
  `<details><summary>Changed files (${files.length})</summary>`,
  "",
  ...files.map((file) => `- \`${file}\``),
  "",
  "</details>",
  "",
].join("\n");

if (summaryPath) {
  fs.appendFileSync(summaryPath, summary);
} else {
  console.log(summary);
}
