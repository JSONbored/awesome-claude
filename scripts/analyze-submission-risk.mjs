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

function readJson(filePath, fallback = null) {
  if (!filePath || !fs.existsSync(filePath)) return fallback;
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
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

if ((!issuePath && !prPath) || !outputPath) {
  console.error(
    "Usage: node scripts/analyze-submission-risk.mjs (--issue-json <path> [--validation-json <path>] [--contributor-json <path>] | --pr-json <path>) --output <path> [--markdown-output <path>]",
  );
  process.exit(1);
}

let report;
if (issuePath) {
  const issue = readJson(issuePath);
  const validationReport =
    readJson(validationPath) || validateSubmission(issue);
  const contributor = readJson(contributorPath, {});
  report = analyzeIssueSubmissionRisk(issue, validationReport, { contributor });
} else {
  report = analyzeDirectContentRisk(readJson(prPath));
}

writeFile(outputPath, `${JSON.stringify(report, null, 2)}\n`);
writeFile(markdownOutputPath, formatSubmissionRiskMarkdown(report));

console.log(
  `Submission security/safety risk: ${report.riskTier} (${report.reviewFlags.length} flags)`,
);
