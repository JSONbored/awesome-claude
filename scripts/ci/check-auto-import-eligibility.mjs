import fs from "node:fs";
import path from "node:path";

function argValue(flag) {
  const idx = process.argv.indexOf(flag);
  if (idx < 0) return "";
  return process.argv[idx + 1] ?? "";
}

function readJson(filePath, label) {
  if (!filePath) throw new Error(`Missing ${label} path`);
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function issueLabels(issue = {}) {
  return (issue.labels || [])
    .map((label) => (typeof label === "string" ? label : label?.name))
    .filter(Boolean);
}

function hasBlockingLabel(labels) {
  const blocked = new Set([
    "accepted",
    "import-approved",
    "import-pr-open",
    "needs-author-input",
    "source-needs-verification",
    "stale-submission",
  ]);
  return labels.find((label) => blocked.has(label)) || "";
}

function gateStatus(risk, gateName) {
  return risk?.policyMatrix?.[gateName]?.status || "";
}

function appendOutput(values) {
  const outputPath = process.env.GITHUB_OUTPUT;
  if (!outputPath) return;
  const lines = Object.entries(values).map(([key, value]) => {
    if (!/^[A-Za-z_][A-Za-z0-9_]*$/.test(key)) {
      throw new Error(`Unsafe GitHub Actions output name: ${key}`);
    }
    const normalized = String(value ?? "").replace(/[\r\n]/g, " ");
    return `${key}=${normalized}`;
  });
  fs.appendFileSync(outputPath, `${lines.join("\n")}\n`);
}

function safeImportPath(category, slug) {
  if (!/^[a-z0-9-]+$/.test(slug)) return "";
  if (!/^[a-z0-9-]+$/.test(category)) return "";
  return path.join("content", category, `${slug}.mdx`);
}

const issuePath = argValue("--issue-json");
const validationPath = argValue("--validation-json");
const riskPath = argValue("--risk-json");
const outputPath = argValue("--output");

const issue = readJson(issuePath, "issue JSON");
const validation = readJson(validationPath, "validation JSON");
const risk = readJson(riskPath, "risk JSON");

const labels = issueLabels(issue);
const category = validation.category || risk.subject?.category || "";
const slug = validation.fields?.slug || risk.subject?.slug || "";
const importPath = safeImportPath(category, slug);
const reasons = [];

if (issue.pull_request) {
  reasons.push("auto import is only available for issues, not pull requests");
}

const blockingLabel = hasBlockingLabel(labels);
if (blockingLabel) {
  reasons.push(`issue already has manual/import state label: ${blockingLabel}`);
}

if (validation.skipped) {
  reasons.push("submission did not resolve to a supported category");
}
if (!validation.ok) {
  reasons.push("submission schema validation is failing");
}
if (!category || !slug || !importPath) {
  reasons.push("submission category or slug is missing or unsafe");
}
if (importPath && fs.existsSync(path.join(process.cwd(), importPath))) {
  reasons.push(`content file already exists: ${importPath}`);
}

if (risk.policyDecision !== "auto_import_eligible") {
  reasons.push(
    `risk policy decision is ${risk.policyDecision || "maintainer_review"}`,
  );
}
if (!["low", "medium"].includes(risk.riskTier)) {
  reasons.push(`risk tier is ${risk.riskTier || "unknown"}`);
}

for (const [gate, status] of Object.entries(risk.policyMatrix || {})) {
  if (status?.status === "block") {
    reasons.push(`policy gate is blocking: ${gate}`);
  }
}

for (const gate of ["schema", "source", "package", "quality"]) {
  if (gateStatus(risk, gate) !== "pass") {
    reasons.push(`policy gate must pass: ${gate}`);
  }
}

const result = {
  eligible: reasons.length === 0,
  reasons,
  issueNumber: issue.number || null,
  category,
  slug,
  importPath,
};

if (outputPath) {
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, `${JSON.stringify(result, null, 2)}\n`);
}

appendOutput({
  eligible: result.eligible ? "true" : "false",
  category,
  slug,
  import_path: importPath,
});

if (result.eligible) {
  console.log(`Submission #${issue.number} is auto-import eligible.`);
} else {
  console.log(`Submission #${issue.number} is not auto-import eligible:`);
  for (const reason of reasons) console.log(`- ${reason}`);
}
