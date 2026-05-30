import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";

import matter from "gray-matter";

import {
  CATEGORY_SCHEMAS,
  FORBIDDEN_CONTENT_FIELDS,
  inferSectionBooleans,
  inferStructuredFields,
  normalizeBody,
  validateEntry,
} from "@heyclaude/registry/content-schema";

const repoRoot = process.cwd();
const contentRoot = path.join(repoRoot, "content");
const strictRecommended = process.argv.includes("--strict-recommended");
const selectedCategories = new Set();

for (let index = 2; index < process.argv.length; index += 1) {
  const arg = process.argv[index];
  if (arg === "--category" || arg === "--categories") {
    const value = process.argv[index + 1] || "";
    for (const category of value.split(",")) {
      const normalized = category.trim();
      if (normalized) selectedCategories.add(normalized);
    }
    index += 1;
  } else if (arg.startsWith("--category=")) {
    const value = arg.slice("--category=".length);
    for (const category of value.split(",")) {
      const normalized = category.trim();
      if (normalized) selectedCategories.add(normalized);
    }
  } else if (arg.startsWith("--categories=")) {
    const value = arg.slice("--categories=".length);
    for (const category of value.split(",")) {
      const normalized = category.trim();
      if (normalized) selectedCategories.add(normalized);
    }
  }
}

const failures = [];
const warnings = [];
let filesChecked = 0;
const bashScriptLanguages = new Set(["bash", "sh", "shell"]);
const oldBrandOrDomainPattern = new RegExp(
  `${["claude", "pro"].join("")}\\.directory|${[
    "Claude",
    " Pro ",
    "Directory",
  ].join("")}`,
  "i",
);
const sharedTmpDebugPathPattern =
  /(^|[^A-Za-z0-9_$\/{.-])(\/tmp\/[A-Za-z0-9_.$\/{}-]*(?:debug|startup)[A-Za-z0-9_.$\/{}-]*)/gi;
const nonPredictableTmpPathPattern =
  /\$\$|\$RANDOM|\$\{RANDOM\}|X{3,}/i;

function checkBashSyntax(scriptBody) {
  const result = spawnSync("bash", ["--noprofile", "--norc", "-n", "-s"], {
    input: scriptBody,
    encoding: "utf8",
    maxBuffer: 1024 * 1024,
    timeout: 5000,
  });

  if (result.error) {
    return {
      ok: false,
      detail: result.error.message,
    };
  }

  if (result.status !== 0) {
    const detail = String(result.stderr || result.stdout || "")
      .trim()
      .split(/\r?\n/)
      .filter(Boolean)
      .slice(-1)[0];
    return {
      ok: false,
      detail: detail || `bash -n exited with status ${result.status}`,
    };
  }

  return { ok: true };
}

function findPredictableSharedTmpDebugPaths(scriptBody) {
  const paths = new Set();
  for (const match of String(scriptBody || "").matchAll(
    sharedTmpDebugPathPattern,
  )) {
    const tmpPath = match[2];
    if (!tmpPath || nonPredictableTmpPathPattern.test(tmpPath)) continue;
    paths.add(tmpPath);
  }
  return [...paths];
}

for (const category of Object.keys(CATEGORY_SCHEMAS)) {
  if (selectedCategories.size > 0 && !selectedCategories.has(category)) {
    continue;
  }

  const categoryDir = path.join(contentRoot, category);
  if (!fs.existsSync(categoryDir)) continue;

  for (const fileName of fs.readdirSync(categoryDir)) {
    if (!fileName.endsWith(".mdx")) continue;

    filesChecked += 1;

    const filePath = path.join(categoryDir, fileName);
    const source = fs.readFileSync(filePath, "utf8");
    const parsed = matter(source);
    const normalizedBody = normalizeBody(parsed.content, category);
    const inferred = inferStructuredFields(
      parsed.data,
      normalizedBody,
      category,
    );
    const validation = validateEntry(category, parsed.data, inferred);
    const sectionFlags = inferSectionBooleans(normalizedBody);
    const scriptBody = String(parsed.data.scriptBody ?? inferred.scriptBody ?? "");
    const scriptLanguage = String(
      parsed.data.scriptLanguage ?? inferred.scriptLanguage ?? "",
    )
      .trim()
      .toLowerCase();

    const entry = `${category}/${fileName}`;

    if (!normalizedBody.trim()) {
      failures.push(`${entry}: metadata-only content is not allowed`);
    }

    if (oldBrandOrDomainPattern.test(source)) {
      failures.push(`${entry}: old brand/domain references are not allowed`);
    }

    if (/\[Script content from first example\]/.test(source)) {
      failures.push(`${entry}: placeholder script marker is not allowed`);
    }

    if (validation.missingRequired.length > 0) {
      failures.push(
        `${entry}: missing required fields -> ${validation.missingRequired.join(", ")}`,
      );
    }

    if (validation.missingRecommended.length > 0) {
      const message = `${entry}: missing recommended fields -> ${validation.missingRecommended.join(", ")}`;
      if (strictRecommended) {
        failures.push(message);
      } else {
        warnings.push(message);
      }
    }

    if (validation.enumErrors?.length) {
      failures.push(`${entry}: ${validation.enumErrors.join("; ")}`);
    }

    if (validation.semanticErrors?.length) {
      failures.push(`${entry}: ${validation.semanticErrors.join("; ")}`);
    }

    if (scriptBody.trim() && bashScriptLanguages.has(scriptLanguage)) {
      const syntax = checkBashSyntax(scriptBody);
      if (!syntax.ok) {
        failures.push(
          `${entry}: scriptBody failed bash syntax check -> ${syntax.detail}`,
        );
      }
      const predictableTmpDebugPaths =
        findPredictableSharedTmpDebugPaths(scriptBody);
      if (predictableTmpDebugPaths.length) {
        failures.push(
          `${entry}: scriptBody uses predictable shared /tmp debug log path -> ${predictableTmpDebugPaths.join(", ")}`,
        );
      }
    }

    for (const field of FORBIDDEN_CONTENT_FIELDS) {
      if (parsed.data[field] !== undefined) {
        failures.push(`${entry}: forbidden field present -> ${field}`);
      }
    }

    if (
      parsed.data.category &&
      String(parsed.data.category).trim() !== category
    ) {
      failures.push(
        `${entry}: category mismatch (frontmatter="${String(parsed.data.category).trim()}" folder="${category}")`,
      );
    }

    if (
      category === "guides" &&
      parsed.data.copySnippet &&
      String(parsed.data.copySnippet).trim()
    ) {
      failures.push(`${entry}: guides must not include copySnippet`);
    }

    if (
      category === "collections" &&
      parsed.data.copySnippet &&
      String(parsed.data.copySnippet).trim()
    ) {
      failures.push(`${entry}: collections must not include copySnippet`);
    }

    if (
      parsed.data.hasPrerequisites === false &&
      sectionFlags.hasPrerequisites
    ) {
      failures.push(
        `${entry}: hasPrerequisites=false but Prerequisites section exists`,
      );
    }

    if (
      parsed.data.hasTroubleshooting === false &&
      sectionFlags.hasTroubleshooting
    ) {
      failures.push(
        `${entry}: hasTroubleshooting=false but Troubleshooting section exists`,
      );
    }

    const downloadUrl = String(parsed.data.downloadUrl ?? "").trim();
    if (downloadUrl) {
      const localDownload = downloadUrl.startsWith("/downloads/");
      if (category === "skills" && !downloadUrl.endsWith(".zip")) {
        failures.push(`${entry}: skills downloadUrl must end with .zip`);
      }
      if (category === "mcp" && !downloadUrl.endsWith(".mcpb")) {
        failures.push(`${entry}: mcp downloadUrl must end with .mcpb`);
      }
      if (localDownload && parsed.data.packageVerified !== true) {
        failures.push(
          `${entry}: local /downloads package must set packageVerified: true`,
        );
      }
    }

    if (category === "skills") {
      const skillType = String(
        parsed.data.skillType ?? inferred.skillType ?? "",
      )
        .trim()
        .toLowerCase();
      const retrievalSources = Array.isArray(parsed.data.retrievalSources)
        ? parsed.data.retrievalSources
            .map((value) => String(value).trim())
            .filter(Boolean)
        : [];

      for (const url of retrievalSources) {
        if (!/^https:\/\//i.test(url)) {
          failures.push(
            `${entry}: retrievalSources must use https URLs -> ${url}`,
          );
        }
      }

      if (skillType === "capability-pack") {
        const requiredSections = [
          "## Knowledge Freshness",
          "## Retrieval Sources",
          "## Core Workflow",
          "## Capability Scope",
          "## Production Rules",
        ];
        for (const heading of requiredSections) {
          if (!normalizedBody.includes(heading)) {
            failures.push(
              `${entry}: capability-pack missing section -> ${heading}`,
            );
          }
        }
      }
    }
  }
}

console.log(`Validated ${filesChecked} content files.`);

if (selectedCategories.size > 0) {
  console.log(`Selected categories: ${[...selectedCategories].join(", ")}`);
}

if (warnings.length > 0) {
  console.log(`Warnings (${warnings.length}):`);
  for (const warning of warnings.slice(0, 50)) console.log(`- ${warning}`);
  if (warnings.length > 50) {
    console.log(`...and ${warnings.length - 50} more warnings`);
  }
}

if (failures.length > 0) {
  console.error(`Failures (${failures.length}):`);
  for (const failure of failures.slice(0, 100)) console.error(`- ${failure}`);
  if (failures.length > 100) {
    console.error(`...and ${failures.length - 100} more failures`);
  }
  process.exit(1);
}

console.log("Content validation passed.");
