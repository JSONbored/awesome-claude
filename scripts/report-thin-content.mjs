import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

/*
 * Thin-content & duplicate-intro report.
 *
 * Surfaces "helpful-content" / thin-page risks across the directory by reading
 * the generated registry (apps/web/src/generated/atlas-registry.json) — a
 * read-only analysis that never touches content/*.mdx. It flags three things:
 *
 *   1. Thin text      — entries whose combined description text is below a
 *                       character/word threshold.
 *   2. Low uniqueness — entries with very low unique-word ratio (repetitive or
 *                       keyword-stuffed copy that reads as low-value to crawlers).
 *   3. Near-duplicate — pairs of entries whose intros/descriptions are highly
 *                       similar (Jaccard over word shingles), the classic
 *                       boilerplate-template risk.
 *
 * The atlas registry is the SEO-facing surface (description, cardDescription,
 * seoDescription, seoTitle) that search engines and LLM crawlers actually see,
 * so it is the right corpus for a helpful-content audit.
 *
 *   node scripts/report-thin-content.mjs                       # markdown to stdout
 *   node scripts/report-thin-content.mjs --format json
 *   node scripts/report-thin-content.mjs --category mcp,hooks
 *   node scripts/report-thin-content.mjs --output reports/thin-content.md
 *   node scripts/report-thin-content.mjs --min-chars 120 --min-words 18 \
 *     --min-unique-ratio 0.5 --similarity 0.8 --top 50
 */

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const defaultRepoRoot = path.resolve(scriptDir, "..");

// --- defaults ---
const DEFAULTS = {
  minChars: 120, // entries with < this many chars of description text are thin
  minWords: 18, // entries with < this many words are thin
  minUniqueRatio: 0.42, // unique-word / total-word ratio floor (≈ bottom decile)
  similarity: 0.8, // Jaccard threshold for near-duplicate pairs
  shingle: 3, // word-shingle size for similarity
  top: 50, // max rows per section in the report
};

// --- args (mirrors report-trust-coverage.mjs / audit-content.mjs) ---
let repoRoot = defaultRepoRoot;
let registryPath = "";
let outputPath = "";
let outputFormat = "markdown";
let minChars = DEFAULTS.minChars;
let minWords = DEFAULTS.minWords;
let minUniqueRatio = DEFAULTS.minUniqueRatio;
let similarity = DEFAULTS.similarity;
let shingleSize = DEFAULTS.shingle;
let top = DEFAULTS.top;
const selectedCategories = new Set();

const addCategories = (value) => {
  for (const category of String(value).split(",")) {
    const normalized = category.trim();
    if (normalized) selectedCategories.add(normalized);
  }
};

const argv = process.argv.slice(2);
for (let index = 0; index < argv.length; index += 1) {
  const arg = argv[index];
  const takeValue = (flag) => {
    if (arg === flag) {
      index += 1;
      return argv[index] ?? "";
    }
    if (arg.startsWith(`${flag}=`)) {
      return arg.slice(flag.length + 1);
    }
    return null;
  };

  let value;
  if ((value = takeValue("--category")) !== null) addCategories(value);
  else if ((value = takeValue("--categories")) !== null) addCategories(value);
  else if ((value = takeValue("--repo-root")) !== null)
    repoRoot = path.resolve(value);
  else if ((value = takeValue("--registry")) !== null)
    registryPath = path.resolve(process.cwd(), value);
  else if ((value = takeValue("--output")) !== null)
    outputPath = value ? path.resolve(process.cwd(), value) : "";
  else if ((value = takeValue("--format")) !== null) outputFormat = value;
  else if ((value = takeValue("--min-chars")) !== null)
    minChars = Number(value);
  else if ((value = takeValue("--min-words")) !== null)
    minWords = Number(value);
  else if ((value = takeValue("--min-unique-ratio")) !== null)
    minUniqueRatio = Number(value);
  else if ((value = takeValue("--similarity")) !== null)
    similarity = Number(value);
  else if ((value = takeValue("--shingle")) !== null)
    shingleSize = Number(value);
  else if ((value = takeValue("--top")) !== null) top = Number(value);
  else if (arg === "--help" || arg === "-h") {
    console.log(
      [
        "Usage: node scripts/report-thin-content.mjs [options]",
        "",
        "  --category <a,b>        Restrict to categories (repeatable / comma-list).",
        "  --repo-root <path>      Repo root (default: script's parent).",
        "  --registry <path>       Explicit atlas-registry.json path.",
        "  --output <path>         Also write the report to this file.",
        "  --format <markdown|json>  Output format (default: markdown).",
        `  --min-chars <n>         Thin-text char floor (default: ${DEFAULTS.minChars}).`,
        `  --min-words <n>         Thin-text word floor (default: ${DEFAULTS.minWords}).`,
        `  --min-unique-ratio <n>  Unique-word ratio floor 0..1 (default: ${DEFAULTS.minUniqueRatio}).`,
        `  --similarity <n>        Near-duplicate Jaccard threshold 0..1 (default: ${DEFAULTS.similarity}).`,
        `  --shingle <n>           Word-shingle size for similarity (default: ${DEFAULTS.shingle}).`,
        `  --top <n>               Max rows per section (default: ${DEFAULTS.top}).`,
      ].join("\n"),
    );
    process.exit(0);
  }
}

const fail = (message) => {
  console.error(message);
  process.exit(2);
};

const validatePositiveInt = (value, flag) => {
  if (!Number.isInteger(value) || value < 0) {
    fail(`${flag} must be a non-negative integer.`);
  }
};
const validateRatio = (value, flag) => {
  if (!Number.isFinite(value) || value < 0 || value > 1) {
    fail(`${flag} must be a number from 0 to 1.`);
  }
};

validatePositiveInt(minChars, "--min-chars");
validatePositiveInt(minWords, "--min-words");
validateRatio(minUniqueRatio, "--min-unique-ratio");
validateRatio(similarity, "--similarity");
if (!Number.isInteger(shingleSize) || shingleSize < 1) {
  fail("--shingle must be a positive integer.");
}
validatePositiveInt(top, "--top");
if (!["markdown", "json"].includes(outputFormat)) {
  fail("--format must be either markdown or json.");
}

const resolvedRegistryPath =
  registryPath ||
  path.join(repoRoot, "apps/web/src/generated/atlas-registry.json");

if (!fs.existsSync(resolvedRegistryPath)) {
  fail(
    [
      `Registry not found: ${resolvedRegistryPath}`,
      "Generate it first with: pnpm generate:registry",
    ].join("\n"),
  );
}

let registry;
try {
  registry = JSON.parse(fs.readFileSync(resolvedRegistryPath, "utf8"));
} catch (error) {
  fail(`Could not parse registry JSON: ${error.message}`);
}

const allEntries = Array.isArray(registry?.entries) ? registry.entries : [];
if (allEntries.length === 0) {
  fail("Registry has no entries to analyze.");
}

// --- text extraction ---

// Fields the registry exposes to crawlers / LLMs, in priority order. These are
// the "intro/body" surface of an entry inside atlas-registry.json.
const TEXT_FIELDS = [
  "description",
  "cardDescription",
  "seoDescription",
  "trigger",
  "usageSnippet",
];

const collapseWhitespace = (value) => String(value ?? "").trim();

// The primary "intro" we de-duplicate on: the description is what shows up in
// listings and meta tags, so duplicate descriptions are the real SEO risk.
const introOf = (entry) =>
  collapseWhitespace(entry.description) ||
  collapseWhitespace(entry.cardDescription) ||
  collapseWhitespace(entry.seoDescription);

// Combined text used for the thin / low-uniqueness signals.
const combinedTextOf = (entry) => {
  const seen = new Set();
  const parts = [];
  for (const field of TEXT_FIELDS) {
    const text = collapseWhitespace(entry[field]);
    if (text && !seen.has(text)) {
      seen.add(text);
      parts.push(text);
    }
  }
  return parts.join(" ");
};

const tokenize = (text) =>
  collapseWhitespace(text)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim()
    .split(/\s+/)
    .filter(Boolean);

const normalizeForCompare = (text) => tokenize(text).join(" ");

const shinglesOf = (tokens, size) => {
  const set = new Set();
  if (tokens.length === 0) return set;
  if (tokens.length < size) {
    set.add(tokens.join(" "));
    return set;
  }
  for (let i = 0; i + size <= tokens.length; i += 1) {
    set.add(tokens.slice(i, i + size).join(" "));
  }
  return set;
};

const jaccard = (a, b) => {
  if (a.size === 0 && b.size === 0) return 0;
  let intersection = 0;
  const [small, large] = a.size <= b.size ? [a, b] : [b, a];
  for (const item of small) {
    if (large.has(item)) intersection += 1;
  }
  return intersection / (a.size + b.size - intersection);
};

const round = (value, digits = 3) => {
  const factor = 10 ** digits;
  return Math.round(value * factor) / factor;
};

// --- build per-entry analysis ---

const entries = allEntries
  .filter(
    (entry) =>
      selectedCategories.size === 0 || selectedCategories.has(entry.category),
  )
  .map((entry) => {
    const intro = introOf(entry);
    const combined = combinedTextOf(entry);
    const tokens = tokenize(combined);
    const uniqueTokens = new Set(tokens);
    const uniqueRatio =
      tokens.length === 0 ? 0 : uniqueTokens.size / tokens.length;
    return {
      category: entry.category,
      slug: entry.slug,
      title: collapseWhitespace(entry.title),
      ref: `${entry.category}/${entry.slug}`,
      intro,
      combined,
      chars: combined.length,
      words: tokens.length,
      uniqueWords: uniqueTokens.size,
      uniqueRatio: round(uniqueRatio),
      shingles: shinglesOf(tokenize(intro), shingleSize),
      normalizedIntro: normalizeForCompare(intro),
    };
  });

if (entries.length === 0) {
  fail(
    selectedCategories.size > 0
      ? `No entries matched categories: ${[...selectedCategories].join(", ")}`
      : "No entries to analyze.",
  );
}

// --- 1. thin text ---
// Severity = how far below the worse of the two floors the entry sits, so the
// thinnest entries rank first.
const thin = entries
  .filter((entry) => entry.chars < minChars || entry.words < minWords)
  .map((entry) => {
    const charDeficit = minChars > 0 ? (minChars - entry.chars) / minChars : 0;
    const wordDeficit = minWords > 0 ? (minWords - entry.words) / minWords : 0;
    return {
      ...entry,
      severity: round(Math.max(charDeficit, wordDeficit)),
    };
  })
  .sort(
    (a, b) =>
      b.severity - a.severity ||
      a.words - b.words ||
      a.ref.localeCompare(b.ref),
  );

// --- 2. low uniqueness ---
// Only meaningful for entries with enough words that a low ratio signals
// repetition rather than a naturally short sentence.
const MIN_WORDS_FOR_UNIQUENESS = Math.max(minWords, 12);
const lowUnique = entries
  .filter(
    (entry) =>
      entry.words >= MIN_WORDS_FOR_UNIQUENESS &&
      entry.uniqueRatio < minUniqueRatio,
  )
  .sort(
    (a, b) =>
      a.uniqueRatio - b.uniqueRatio ||
      b.words - a.words ||
      a.ref.localeCompare(b.ref),
  );

// --- 3. near-duplicate intros ---
// Group candidates by their first shingle to avoid an O(n^2) all-pairs scan
// across ~1k entries; identical/near-identical intros share early shingles.
const buckets = new Map();
for (const entry of entries) {
  if (entry.shingles.size === 0) continue;
  for (const shingle of entry.shingles) {
    if (!buckets.has(shingle)) buckets.set(shingle, []);
    buckets.get(shingle).push(entry);
  }
}

const comparedPairs = new Set();
const duplicates = [];
for (const bucket of buckets.values()) {
  if (bucket.length < 2) continue;
  for (let i = 0; i < bucket.length; i += 1) {
    for (let j = i + 1; j < bucket.length; j += 1) {
      const a = bucket[i];
      const b = bucket[j];
      const pairKey = a.ref < b.ref ? `${a.ref}|${b.ref}` : `${b.ref}|${a.ref}`;
      if (comparedPairs.has(pairKey)) continue;
      comparedPairs.add(pairKey);

      const exact =
        a.normalizedIntro.length > 0 && a.normalizedIntro === b.normalizedIntro;
      const score = exact ? 1 : round(jaccard(a.shingles, b.shingles));
      if (score < similarity) continue;

      duplicates.push({
        score,
        exact,
        a: { ref: a.ref, title: a.title, intro: a.intro },
        b: { ref: b.ref, title: b.title, intro: b.intro },
      });
    }
  }
}
duplicates.sort(
  (x, y) =>
    y.score - x.score ||
    x.a.ref.localeCompare(y.a.ref) ||
    x.b.ref.localeCompare(y.b.ref),
);

// --- summary ---
const categoriesPresent = [...new Set(entries.map((e) => e.category))].sort();
const summary = {
  registryPath: path.relative(repoRoot, resolvedRegistryPath),
  generatedAt: registry.generatedAt ?? null,
  analyzedAt: new Date().toISOString(),
  scope: {
    categories:
      selectedCategories.size > 0
        ? [...selectedCategories].sort()
        : categoriesPresent,
    entries: entries.length,
  },
  thresholds: {
    minChars,
    minWords,
    minUniqueRatio,
    similarity,
    shingle: shingleSize,
  },
  flagged: {
    thin: thin.length,
    lowUnique: lowUnique.length,
    duplicatePairs: duplicates.length,
  },
};

// --- output ---

const limit = (list) => (top > 0 ? list.slice(0, top) : list);
const escapePipes = (text) => String(text).replace(/\|/g, "\\|");
const truncate = (text, max = 140) => {
  const value = collapseWhitespace(text);
  return value.length > max ? `${value.slice(0, max - 1)}…` : value;
};

function renderMarkdown() {
  const lines = [];
  lines.push("# Thin-content & duplicate-intro report");
  lines.push("");
  lines.push(`- Registry: \`${summary.registryPath}\``);
  if (summary.generatedAt)
    lines.push(`- Registry generated: ${summary.generatedAt}`);
  lines.push(`- Analyzed: ${summary.analyzedAt}`);
  lines.push(
    `- Scope: ${summary.scope.entries} entries across ${summary.scope.categories.length} categories (${summary.scope.categories.join(", ")})`,
  );
  lines.push(
    `- Thresholds: < ${minChars} chars or < ${minWords} words = thin; unique-word ratio < ${minUniqueRatio}; intro similarity ≥ ${similarity} (shingle ${shingleSize})`,
  );
  lines.push("");
  lines.push("## Summary");
  lines.push("");
  lines.push("| Signal | Flagged |");
  lines.push("| --- | ---: |");
  lines.push(`| Thin text | ${summary.flagged.thin} |`);
  lines.push(`| Low unique-text ratio | ${summary.flagged.lowUnique} |`);
  lines.push(
    `| Near-duplicate intro pairs | ${summary.flagged.duplicatePairs} |`,
  );
  lines.push("");

  lines.push(`## Thin text (${thin.length})`);
  lines.push("");
  if (thin.length === 0) {
    lines.push("_None below threshold._");
  } else {
    lines.push("| Severity | Ref | Chars | Words | Intro |");
    lines.push("| ---: | --- | ---: | ---: | --- |");
    for (const e of limit(thin)) {
      lines.push(
        `| ${e.severity.toFixed(2)} | \`${e.ref}\` | ${e.chars} | ${e.words} | ${escapePipes(truncate(e.intro))} |`,
      );
    }
    if (top > 0 && thin.length > top) {
      lines.push("");
      lines.push(`_…and ${thin.length - top} more._`);
    }
  }
  lines.push("");

  lines.push(`## Low unique-text ratio (${lowUnique.length})`);
  lines.push("");
  if (lowUnique.length === 0) {
    lines.push("_None below threshold._");
  } else {
    lines.push("| Unique ratio | Ref | Words | Unique | Intro |");
    lines.push("| ---: | --- | ---: | ---: | --- |");
    for (const e of limit(lowUnique)) {
      lines.push(
        `| ${e.uniqueRatio.toFixed(2)} | \`${e.ref}\` | ${e.words} | ${e.uniqueWords} | ${escapePipes(truncate(e.intro))} |`,
      );
    }
    if (top > 0 && lowUnique.length > top) {
      lines.push("");
      lines.push(`_…and ${lowUnique.length - top} more._`);
    }
  }
  lines.push("");

  lines.push(`## Near-duplicate intros (${duplicates.length})`);
  lines.push("");
  if (duplicates.length === 0) {
    lines.push("_No pairs at or above the similarity threshold._");
  } else {
    lines.push("| Score | Entry A | Entry B | Shared intro |");
    lines.push("| ---: | --- | --- | --- |");
    for (const pair of limit(duplicates)) {
      const label = pair.exact ? "1.00 (exact)" : pair.score.toFixed(2);
      lines.push(
        `| ${label} | \`${pair.a.ref}\` | \`${pair.b.ref}\` | ${escapePipes(truncate(pair.a.intro, 120))} |`,
      );
    }
    if (top > 0 && duplicates.length > top) {
      lines.push("");
      lines.push(`_…and ${duplicates.length - top} more pairs._`);
    }
  }
  lines.push("");

  return lines.join("\n");
}

function buildJson() {
  return {
    summary,
    thin: limit(thin).map((e) => ({
      ref: e.ref,
      category: e.category,
      slug: e.slug,
      title: e.title,
      chars: e.chars,
      words: e.words,
      severity: e.severity,
      intro: e.intro,
    })),
    lowUnique: limit(lowUnique).map((e) => ({
      ref: e.ref,
      category: e.category,
      slug: e.slug,
      title: e.title,
      words: e.words,
      uniqueWords: e.uniqueWords,
      uniqueRatio: e.uniqueRatio,
      intro: e.intro,
    })),
    duplicates: limit(duplicates),
  };
}

const rendered =
  outputFormat === "json"
    ? `${JSON.stringify(buildJson(), null, 2)}\n`
    : `${renderMarkdown()}\n`;

if (outputPath) {
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, rendered);
  console.error(`Wrote ${path.relative(process.cwd(), outputPath)}`);
}

process.stdout.write(rendered);
