import { execFileSync } from "node:child_process";
import fs from "node:fs";

const eventName = process.env.GITHUB_EVENT_NAME || "";
const baseSha = process.env.BASE_SHA || "";
const forceFull =
  process.env.FORCE_FULL_VALIDATION === "1" ||
  eventName === "workflow_dispatch" ||
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
  "prompts",
  "rules",
  "skills",
  "statuslines",
  "tools",
];

function changedFiles() {
  if (forceFull) return [];
  if (eventName !== "pull_request") return [];
  if (!/^[0-9a-f]{40}$/i.test(baseSha)) {
    throw new Error("BASE_SHA must be a full Git commit SHA for PR validation");
  }
  const output = execFileSync(
    "git",
    ["diff", "--name-only", `${baseSha}...HEAD`],
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
const all = forceFull;

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
  /^scripts\/(analyze-submission-risk|import-submission-issue|validate-submission-issue)\.mjs$/,
);

const flags = {
  content: contentCategoryTouched || contentValidationInfra,
  content_config: contentValidationInfra,
  registry:
    contentCategoryTouched ||
    generatedArtifactInfra ||
    submissionAutomationInfra,
  web:
    contentCategoryTouched ||
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
    ),
  mcp: touches(
    /^packages\/mcp\//,
    /^apps\/web\/src\/routes\/api\/mcp\.ts$/,
    /^scripts\/validate-mcp-package\.mjs$/,
    /^tests\/mcp-.*\.test\.ts$/,
    "package.json",
    "pnpm-lock.yaml",
  ),
  raycast:
    contentCategoryTouched ||
    touches(
      /^integrations\/raycast\//,
      /^apps\/web\/public\/data\/raycast/,
      /^scripts\/(build-content-index|validate-raycast-feed)\.mjs$/,
      /^tests\/registry-artifacts\.test\.ts$/,
      "package.json",
      "pnpm-lock.yaml",
    ),
  packages: touches(
    /^apps\/web\/public\/downloads\//,
    /^content\/skills\/.*\.zip$/,
    /^content\/mcp\/.*\.mcpb$/,
    /^scripts\/(scan-download-packages|validate-download-packages)\.mjs$/,
    "package.json",
    "pnpm-lock.yaml",
  ),
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
