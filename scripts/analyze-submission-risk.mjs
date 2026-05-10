import fs from "node:fs";
import path from "node:path";

import { validateSubmission } from "@heyclaude/registry/submission";
import {
  analyzeDirectContentRisk,
  analyzeIssueSubmissionRisk,
  formatSubmissionRiskMarkdown,
} from "@heyclaude/registry/submission-risk";

function argValue(flag) {
  const idx = process.argv.indexOf(flag);
  if (idx < 0) return "";
  return process.argv[idx + 1] ?? "";
}

function readJson(filePath, { fallback = null, required = false } = {}) {
  if (!filePath || !fs.existsSync(filePath)) {
    if (required) {
      throw new Error(
        `Required JSON input does not exist: ${filePath || "(missing path)"}`,
      );
    }
    return fallback;
  }
  try {
    return JSON.parse(fs.readFileSync(filePath, "utf8"));
  } catch (error) {
    throw new Error(
      `Could not parse JSON input ${filePath}: ${
        error instanceof Error ? error.message : String(error)
      }`,
    );
  }
}

function writeFile(filePath, contents) {
  if (!filePath) return;
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, contents, "utf8");
}

const issuePath = argValue("--issue-json");
const validationPath = argValue("--validation-json");
const contributorPath = argValue("--contributor-json");
const prPath = argValue("--pr-json");
const outputPath = argValue("--output");
const markdownOutputPath = argValue("--markdown-output");

if ((!issuePath && !prPath) || (issuePath && prPath) || !outputPath) {
  console.error(
    "Usage: node scripts/analyze-submission-risk.mjs (--issue-json <path> [--validation-json <path>] [--contributor-json <path>] | --pr-json <path>) --output <path> [--markdown-output <path>]. --issue-json and --pr-json are mutually exclusive.",
  );
  process.exit(1);
}

let report;
try {
  if (issuePath) {
    const issue = readJson(issuePath, { required: true });
    const validationReport =
      readJson(validationPath) || validateSubmission(issue);
    const contributor = readJson(contributorPath, { fallback: {} });
    report = analyzeIssueSubmissionRisk(issue, validationReport, {
      contributor,
    });
  } else {
    report = analyzeDirectContentRisk(readJson(prPath, { required: true }));
  }

  writeFile(outputPath, `${JSON.stringify(report, null, 2)}\n`);
  writeFile(markdownOutputPath, formatSubmissionRiskMarkdown(report));

  console.log(
    `Submission security/safety risk: ${report.riskTier} (${report.reviewFlags.length} flags)`,
  );
} catch (error) {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
}
